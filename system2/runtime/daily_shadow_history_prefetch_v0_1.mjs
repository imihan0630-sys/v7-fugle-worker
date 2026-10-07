import { deepFreeze } from "./factor_snapshot.mjs";
import { loadPitPriorA1BarsV0_1 } from "./daily_shadow_history_reader_v0_1.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const DAILY_SHADOW_HISTORY_PREFETCH_VERSION = "0.1-RESEARCH";

const PIT_SQL = `SELECT bar_id, canonical_key, market_date, market, symbol, company_name,
            price_space, open_price, high_price, low_price, close_price,
            volume_shares, trade_value, transactions, change_value,
            continuity_state, source_id, source_name, source_url, source_row_hash,
            observed_at, available_at, pit_availability_class, pit_replay_eligible,
            captured_at, bar_hash, schema_version
       FROM s2_historical_a1_bars
      WHERE symbol = ? AND market = ? AND market_date < ?
        AND price_space = ?
        AND pit_replay_eligible = 1
        AND available_at IS NOT NULL
        AND available_at <= ?
        AND (? IS NULL OR market_date >= ?)
      ORDER BY market_date DESC, observed_at DESC, bar_hash DESC
      LIMIT ?`;

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function positiveInt(value, field, max) {
  const n=Number(value);
  if(!Number.isInteger(n)||n<1||n>max) throw new Error(field+" must be an integer from 1 to "+max);
  return n;
}

function diagIndex(historyCoverage) {
  const map=new Map();
  for(const row of historyCoverage?.diagnostics||[]) {
    if(!row?.symbol||!row?.market) continue;
    map.set(String(row.market)+"|"+String(row.symbol),row);
  }
  return map;
}

function minDateFor(diag, marketDate) {
  const value=diag?.expectedFirstDate;
  return typeof value==="string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && value<marketDate
    ? value
    : null;
}

export async function prefetchDailyShadowPitHistoryV0_1({
  db,
  snapshotBatch,
  decisionTimestamp,
  historyCoverage = null,
  lookbackSessions = 60,
  priceSpace = "RAW",
  batchSize = 25,
} = {}) {
  if(!db||typeof db.prepare!=="function"||typeof db.batch!=="function") {
    throw new Error("SYSTEM2_DB batch-capable read adapter is required");
  }
  if(!snapshotBatch||typeof snapshotBatch!=="object") throw new Error("snapshotBatch is required");
  const marketDate=requiredText(snapshotBatch.marketDate,"snapshotBatch.marketDate");
  const clock=requiredText(decisionTimestamp,"decisionTimestamp");
  if(!Number.isFinite(Date.parse(clock))) throw new Error("decisionTimestamp must be ISO");
  const limit=positiveInt(lookbackSessions,"lookbackSessions",250);
  const chunkSize=positiveInt(batchSize,"batchSize",100);
  const space=requiredText(priceSpace,"priceSpace");
  const diagnostics=diagIndex(historyCoverage);

  const requests=[];
  for(const symbol of [...(snapshotBatch.symbols||[])].sort()) {
    const snapshot=snapshotBatch.bySymbol?.[symbol];
    const market=requiredText(snapshot?.market,"snapshot market for "+symbol);
    const diag=diagnostics.get(market+"|"+symbol)||null;
    const minimumMarketDate=minDateFor(diag,marketDate);
    requests.push({
      symbol:String(symbol),
      market,
      minimumMarketDate,
      expectedSessionHash:
        typeof diag?.expectedSessionHash==="string" ? diag.expectedSessionHash : null,
      requiredPriorSessionsForSymbol:
        Number.isInteger(Number(diag?.requiredPriorSessionsForSymbol))
          ? Number(diag.requiredPriorSessionsForSymbol)
          : limit,
    });
  }

  const rawByKey=new Map();
  let batchRequestCount=0;
  let statementCount=0;
  let rawRowCount=0;
  let maxBatchStatementCount=0;
  const batchDigests=[];

  for(let start=0;start<requests.length;start+=chunkSize) {
    const chunk=requests.slice(start,start+chunkSize);
    const statements=chunk.map((req)=>db.prepare(PIT_SQL).bind(
      req.symbol,
      req.market,
      marketDate,
      space,
      clock,
      req.minimumMarketDate,
      req.minimumMarketDate,
      limit*2,
    ));
    const result=await db.batch(statements);
    if(!Array.isArray(result)||result.length!==chunk.length) {
      throw new Error("PIT prefetch batch result count mismatch");
    }
    batchRequestCount+=1;
    statementCount+=statements.length;
    maxBatchStatementCount=Math.max(maxBatchStatementCount,statements.length);

    const digestRows=[];
    for(let i=0;i<chunk.length;i+=1) {
      const rows=Array.isArray(result[i]?.results)?result[i].results:[];
      const key=chunk[i].market+"|"+chunk[i].symbol;
      rawByKey.set(key,Object.freeze([...rows]));
      rawRowCount+=rows.length;
      digestRows.push({
        key,
        rawRowCount:rows.length,
        rowHashes:rows.map((row)=>String(row?.bar_hash||"")),
      });
    }
    batchDigests.push(await sha256Hex({
      marketDate,
      decisionTimestamp:clock,
      priceSpace:space,
      start,
      statementCount:statements.length,
      rows:digestRows,
    }));
  }

  async function loadPriorHistoricalBars({
    symbol,
    market,
    marketDate: requestedMarketDate,
    decisionTimestamp: requestedClock,
    lookbackSessions: requestedLookback = limit,
    priceSpace: requestedSpace = space,
  } = {}) {
    const code=requiredText(symbol,"symbol");
    const mkt=requiredText(market,"market");
    if(requestedMarketDate!==marketDate) throw new Error("prefetch marketDate mismatch");
    if(requestedClock!==clock) throw new Error("prefetch decisionTimestamp mismatch");
    if(requestedSpace!==space) throw new Error("prefetch priceSpace mismatch");
    const key=mkt+"|"+code;
    if(!rawByKey.has(key)) throw new Error("prefetch symbol not found: "+key);
    const diag=diagnostics.get(key)||null;
    const minimumMarketDate=minDateFor(diag,marketDate);
    const cached=rawByKey.get(key);

    const memoryDb={
      prepare() {
        return {
          bind() {
            return {
              async all() {
                return { results:[...cached] };
              },
            };
          },
        };
      },
    };
    return loadPitPriorA1BarsV0_1({
      db:memoryDb,
      symbol:code,
      market:mkt,
      marketDate,
      decisionTimestamp:clock,
      lookbackSessions:requestedLookback,
      priceSpace:space,
      minimumMarketDate,
      expectedSessionHash:
        typeof diag?.expectedSessionHash==="string" ? diag.expectedSessionHash : null,
    });
  }

  const evidence=deepFreeze({
    schemaVersion:"S2_DAILY_SHADOW_HISTORY_PREFETCH_V0_1",
    version:DAILY_SHADOW_HISTORY_PREFETCH_VERSION,
    marketDate,
    decisionTimestamp:clock,
    priceSpace:space,
    requestedSymbolCount:requests.length,
    cachedSymbolCount:rawByKey.size,
    lookbackSessions:limit,
    batchSize:chunkSize,
    batchRequestCount,
    statementCount,
    rawRowCount,
    maxBatchStatementCount,
    batchDigests:Object.freeze(batchDigests),
    transportSemantics:"REMOTE_D1_BATCH_OF_CANONICAL_PER_SYMBOL_PIT_SELECTS",
    canonicalResolver:"loadPitPriorA1BarsV0_1",
    readOnly:true,
    externalMutationPerformed:false,
  });
  const prefetchHash=await sha256Hex(evidence);

  return {
    evidence:deepFreeze({...evidence,prefetchHash}),
    loadPriorHistoricalBars,
  };
}

export function dailyShadowPitPrefetchSqlV0_1() {
  return PIT_SQL;
}
