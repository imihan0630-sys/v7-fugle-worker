import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import {
  buildHistoricalA1PacksResearchV0_1,
  unpackHistoricalA1PackResearchV0_1,
} from "./historical_pack_research_v0_1.mjs";
import { conservativeHistoricalAvailableAt } from "./official_full_market_daily_history_adapter_v0_1.mjs";

export const HISTORICAL_PACK_STORE_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function positiveInteger(value, field) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(field + " must be a non-negative integer");
  return n;
}

function packRow(pack) {
  return {
    pack_id: requiredText(pack.packId, "pack.packId"),
    market: requiredText(pack.market, "pack.market"),
    symbol: requiredText(pack.symbol, "pack.symbol"),
    year: Number(pack.year),
    price_space: requiredText(pack.priceSpace, "pack.priceSpace"),
    first_market_date: requiredText(pack.firstMarketDate, "pack.firstMarketDate"),
    last_market_date: requiredText(pack.lastMarketDate, "pack.lastMarketDate"),
    bar_count: positiveInteger(pack.barCount, "pack.barCount"),
    source_id: pack.sourceId || null,
    source_name: pack.sourceName || null,
    availability_policy: "SESSION_CLOSE_FINALITY_PER_MARKET_DATE",
    payload_hash: requiredText(pack.payloadHash, "pack.payloadHash"),
    payload_json_bytes: positiveInteger(pack.payloadJsonBytes, "pack.payloadJsonBytes"),
    gzip_bytes: positiveInteger(pack.gzipBytes, "pack.gzipBytes"),
    base64_bytes: positiveInteger(pack.base64Bytes, "pack.base64Bytes"),
    gzip_base64: requiredText(pack.gzipBase64, "pack.gzipBase64"),
    captured_at: requiredText(pack.capturedAt, "pack.capturedAt"),
    schema_version: requiredText(pack.schemaVersion, "pack.schemaVersion"),
  };
}

function equalPackRow(existing, next) {
  const fields = [
    "pack_id","market","symbol","year","price_space","first_market_date","last_market_date",
    "bar_count","source_id","source_name","availability_policy","payload_hash",
    "payload_json_bytes","gzip_bytes","base64_bytes","gzip_base64","schema_version",
  ];
  return fields.every((key) => String(existing?.[key] ?? "") === String(next?.[key] ?? ""));
}

async function findExistingPack(db, row) {
  const result = await db.prepare(
    `SELECT * FROM s2_historical_a1_packs
     WHERE market=? AND symbol=? AND year=? AND price_space=?`
  ).bind(row.market, row.symbol, row.year, row.price_space).first();
  return result || null;
}

export async function executeHistoricalPackSetV0_1({
  db,
  packSet,
  batchId,
  capturedAt,
} = {}) {
  if (!db || typeof db.prepare !== "function") throw new Error("isolated System2 database adapter is required");
  if (!packSet || packSet.schemaVersion !== "S2_HISTORICAL_A1_PACK_SET_RESEARCH_V0_1") {
    throw new Error("valid historical pack set is required");
  }
  const id = requiredText(batchId, "batchId");
  const captured = requiredText(capturedAt, "capturedAt");

  let insertedPackCount = 0;
  let identicalPackCount = 0;
  const writtenPackIds = [];

  for (const pack of packSet.packs) {
    const row = packRow(pack);
    const existing = await findExistingPack(db, row);
    if (existing) {
      if (!equalPackRow(existing, row)) {
        throw new Error("IMMUTABLE_CONFLICT historical pack: " + [row.market,row.symbol,row.year,row.price_space].join("|"));
      }
      identicalPackCount += 1;
      writtenPackIds.push(row.pack_id);
      continue;
    }

    await db.prepare(`
      INSERT INTO s2_historical_a1_packs (
        pack_id, market, symbol, year, price_space,
        first_market_date, last_market_date, bar_count,
        source_id, source_name, availability_policy, payload_hash,
        payload_json_bytes, gzip_bytes, base64_bytes, gzip_base64,
        captured_at, schema_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      row.pack_id,row.market,row.symbol,row.year,row.price_space,
      row.first_market_date,row.last_market_date,row.bar_count,
      row.source_id,row.source_name,row.availability_policy,row.payload_hash,
      row.payload_json_bytes,row.gzip_bytes,row.base64_bytes,row.gzip_base64,
      row.captured_at,row.schema_version,
    ).run();
    insertedPackCount += 1;
    writtenPackIds.push(row.pack_id);
  }

  if (insertedPackCount + identicalPackCount !== packSet.packCount) {
    throw new Error("historical pack persistence accounting mismatch");
  }

  const firstMarketDate = packSet.packs.length
    ? packSet.packs.map((x) => x.firstMarketDate).sort()[0]
    : null;
  const lastMarketDate = packSet.packs.length
    ? packSet.packs.map((x) => x.lastMarketDate).sort().at(-1)
    : null;
  const rollingHash = await sha256Hex({
    batchId: id,
    packIds: writtenPackIds,
    packHashes: packSet.packs.map((x) => x.payloadHash),
  });
  const receiptId = "S2HPR-" + rollingHash;

  const priorReceipt = await db.prepare(
    "SELECT * FROM s2_historical_pack_ingest_receipts WHERE receipt_id=?"
  ).bind(receiptId).first();

  const receipt = {
    receipt_id: receiptId,
    batch_id: id,
    pack_count: packSet.packCount,
    bar_count: packSet.barCount,
    inserted_pack_count: insertedPackCount,
    identical_pack_count: identicalPackCount,
    payload_json_bytes: packSet.payloadJsonBytes,
    gzip_bytes: packSet.gzipBytes,
    base64_bytes: packSet.base64Bytes,
    first_market_date: firstMarketDate,
    last_market_date: lastMarketDate,
    rolling_hash: rollingHash,
    captured_at: captured,
    schema_version: "S2_HISTORICAL_PACK_INGEST_RECEIPT_V0_1",
  };

  if (!priorReceipt) {
    await db.prepare(`
      INSERT INTO s2_historical_pack_ingest_receipts (
        receipt_id,batch_id,pack_count,bar_count,inserted_pack_count,identical_pack_count,
        payload_json_bytes,gzip_bytes,base64_bytes,first_market_date,last_market_date,
        rolling_hash,captured_at,schema_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      receipt.receipt_id,receipt.batch_id,receipt.pack_count,receipt.bar_count,
      receipt.inserted_pack_count,receipt.identical_pack_count,receipt.payload_json_bytes,
      receipt.gzip_bytes,receipt.base64_bytes,receipt.first_market_date,receipt.last_market_date,
      receipt.rolling_hash,receipt.captured_at,receipt.schema_version,
    ).run();
  }

  return deepFreeze({
    batchId: id,
    packCount: packSet.packCount,
    barCount: packSet.barCount,
    insertedPackCount,
    identicalPackCount,
    compressionRatio: packSet.payloadJsonBytes > 0
      ? packSet.gzipBytes / packSet.payloadJsonBytes
      : null,
    base64ExpansionRatio: packSet.gzipBytes > 0
      ? packSet.base64Bytes / packSet.gzipBytes
      : null,
    receiptId,
    rollingHash,
    state: "HISTORICAL_PACK_SET_PERSISTED",
    schemaVersion: "S2_HISTORICAL_PACK_STORE_RESULT_V0_1",
  });
}

function tupleToHistoricalBar(payload, tuple) {
  const [marketDate,open,high,low,close,volumeShares,tradeValue,transactions,change,continuityState,sourceRowHash] = tuple;
  const availableAt = conservativeHistoricalAvailableAt(marketDate);
  return deepFreeze({
    canonicalKey: [payload.market,payload.symbol,marketDate,payload.priceSpace].join("|"),
    marketDate,
    market: payload.market,
    symbol: payload.symbol,
    companyName: null,
    priceSpace: payload.priceSpace,
    open, high, low, close,
    volumeShares, tradeValue, transactions, change,
    continuityState: continuityState || "UNVERIFIED",
    sourceId: payload.sourceId || null,
    sourceName: payload.sourceName || null,
    sourceUrl: null,
    sourceRowHash: sourceRowHash || null,
    observedAt: availableAt,
    availableAt,
    availabilityBasis: "SESSION_CLOSE_FINALITY",
    pitAvailabilityClass: "CONSERVATIVE_SESSION_FINALITY",
    pitReplayEligible: true,
  });
}

function restoreNames(rows, nameTimeline) {
  if (!Array.isArray(nameTimeline) || !nameTimeline.length) return rows;
  const sorted = [...nameTimeline].sort((a,b)=>String(a[0]).localeCompare(String(b[0])));
  let idx = 0;
  let current = sorted[0]?.[1] || null;
  return rows.map((row) => {
    while (idx + 1 < sorted.length && sorted[idx + 1][0] <= row.marketDate) {
      idx += 1;
      current = sorted[idx][1] || null;
    }
    return deepFreeze({ ...row, companyName: current });
  });
}

export async function loadHistoricalBarsFromPacksV0_1({
  db,
  market,
  symbol,
  fromDate,
  toDate,
  priceSpace = "RAW",
} = {}) {
  if (!db || typeof db.prepare !== "function") throw new Error("isolated System2 database adapter is required");
  const mkt = requiredText(market, "market");
  const code = requiredText(symbol, "symbol");
  const from = requiredText(fromDate, "fromDate");
  const to = requiredText(toDate, "toDate");
  if (to < from) throw new Error("toDate cannot be earlier than fromDate");

  const fromYear = Number(from.slice(0,4));
  const toYear = Number(to.slice(0,4));
  const result = await db.prepare(`
    SELECT * FROM s2_historical_a1_packs
    WHERE market=? AND symbol=? AND price_space=? AND year BETWEEN ? AND ?
    ORDER BY year ASC
  `).bind(mkt, code, priceSpace, fromYear, toYear).all();

  const rows = [];
  const packRefs = [];
  for (const dbRow of result?.results || []) {
    const pack = {
      packId: dbRow.pack_id,
      market: dbRow.market,
      symbol: dbRow.symbol,
      year: dbRow.year,
      priceSpace: dbRow.price_space,
      firstMarketDate: dbRow.first_market_date,
      lastMarketDate: dbRow.last_market_date,
      barCount: dbRow.bar_count,
      payloadHash: dbRow.payload_hash,
      gzipBase64: dbRow.gzip_base64,
      capturedAt: dbRow.captured_at,
      schemaVersion: dbRow.schema_version,
    };
    const payload = await unpackHistoricalA1PackResearchV0_1(pack);
    let unpacked = payload.bars.map((tuple) => tupleToHistoricalBar(payload, tuple));
    unpacked = restoreNames(unpacked, payload.nameTimeline);
    for (const row of unpacked) {
      if (row.marketDate >= from && row.marketDate <= to) rows.push(row);
    }
    packRefs.push({ packId: pack.packId, payloadHash: pack.payloadHash, year: pack.year });
  }

  rows.sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
  return deepFreeze({
    market: mkt,
    symbol: code,
    fromDate: from,
    toDate: to,
    priceSpace,
    rowCount: rows.length,
    rows: Object.freeze(rows),
    packRefs: Object.freeze(packRefs),
    sourceMode: "PACKED_D1_COLD_HISTORY",
    pointInTimePolicy: "SESSION_CLOSE_FINALITY_PER_MARKET_DATE",
    schemaVersion: "S2_HISTORICAL_PACK_QUERY_RESULT_V0_1",
  });
}

export async function buildAndPersistHistoricalPacksV0_1({
  db,
  rows,
  batchId,
  capturedAt,
} = {}) {
  const packSet = await buildHistoricalA1PacksResearchV0_1({ rows, capturedAt });
  const persistence = await executeHistoricalPackSetV0_1({
    db,
    packSet,
    batchId,
    capturedAt,
  });
  return deepFreeze({ packSet, persistence });
}
