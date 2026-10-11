// First independent public-source prospective ledger for System2 P0 #1132.
// Research-only: this DOES NOT select stocks or substitute for PIT strategy evaluation.
// D1-free, no credentials, no Worker/Cron/push/production writes.
import {sha256Hex} from '../runtime/decision_archive.mjs';
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const utc=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x)&&Number.isFinite(Date.parse(x));
export async function buildSourceFirstProspectiveLedgerV0_1({marketDate,source,freezeAtUtc,run={}}={}) {
  if(!DAY.test(marketDate||''))throw Error('MARKET_DATE_REQUIRED');
  if(!utc(freezeAtUtc))throw Error('FREEZE_TIME_UTC_REQUIRED');
  const batch=source?.snapshotBatch;
  const sourceClockOk=utc(source?.observedAt)&&Date.parse(source.observedAt)<=Date.parse(freezeAtUtc);
  const ready=source?.state==='READY'&&source?.marketDate===marketDate&&
    batch?.state==='READY'&&batch?.marketDate===marketDate&&
    batch?.pointInTimeEligible===true&&sourceClockOk&&
    batch?.decisionTimestamp===source?.decisionTimestamp;
  const blockers=[];
  if(!ready)blockers.push('TWSE_TPEX_A1_SOURCE_OR_DECISION_CLOCK_NOT_READY');
  const symbols=ready&&Array.isArray(batch?.symbols)?[...batch.symbols]:[];
  const rows=[];
  const seen=new Set();
  if(ready){
    if(!Number.isSafeInteger(batch.ordinarySymbolCount)||batch.ordinarySymbolCount!==symbols.length ||
       new Set(symbols).size!==symbols.length||symbols.length===0) blockers.push('A1_UNIVERSE_DENOMINATOR_INCOMPLETE');
    for(const symbol of symbols) {
      const row=batch.bySymbol?.[symbol];
      if(typeof symbol!=='string'||!/^[1-9]\d{3}$/.test(symbol)||seen.has(symbol)||
         !['TWSE','TPEX'].includes(row?.market)||row?.marketDate!==marketDate ||
         !/^[0-9a-f]{64}$/i.test(row?.sourceRowHash||'')||
         !Number.isFinite(row?.close)||row.close<=0 ||
         !Number.isFinite(row?.volumeShares)||row.volumeShares<0){
        blockers.push('SOURCE_SYMBOL_ROW_INTEGRITY_INCOMPLETE');continue;
      }
      seen.add(symbol);
      rows.push({
        symbol,companyName:row.companyName||null,market:row.market,
        marketDate,open:row.open,high:row.high,low:row.low,close:row.close,
        volumeShares:row.volumeShares,tradeValue:row.tradeValue,
        sourceRowHash:row.sourceRowHash,
        observedAt:row.provenance?.observedAt||source.observedAt,
        availableAt:row.provenance?.availableAt||null,
        sourceId:row.provenance?.sourceId||null,
      });
    }
  }
  rows.sort((a,b)=>a.symbol.localeCompare(b.symbol));
  if(ready&&(rows.length!==symbols.length||batch?.blockerCodes?.length))blockers.push('SOURCE_UNIVERSE_ROWS_NOT_ALL_RECONCILED');
  const sourceReady=blockers.length===0;
  const base={
    schemaVersion:'S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1',
    classification:'REAL_SOURCE_OBSERVATION_NOT_STRATEGY_SELECTION',
    marketDate,observedAt:sourceClockOk?source.observedAt:null,freezeAtUtc,
    sourceState:sourceReady?'READY':'BLOCKED',
    sourceBlockers:[...new Set(blockers)].sort(),
    sourceBatchHash:sourceReady?batch.batchHash:null,
    sourceTransports:source?.transports||null,
    sourceOrdinarySymbolCount:sourceReady?rows.length:null,
    observations:sourceReady?rows:[],
    strategyId:'SHORT_MOMENTUM',
    strategyVersion:'V0.1-CONTRACT',
    assessorPolicyId:'S2-ASSESSOR-SM-LAUNCH-001',
    assessorPolicyVersion:'0.1-LAUNCH',
    selectionState:'NOT_EXECUTED_REQUIRED_PIT_HISTORY_AND_CONTINUITY_MISSING',
    qualifiedCandidateCount:null,selectedCount:null,zeroPickDay:null,
    strategyDecisionSnapshots:[],
    run:{repository:run.repository||null,runId:run.runId||null,attempt:run.attempt||null,codeSha:run.codeSha||null},
    storageClass:'GITHUB_ACTIONS_TEMPORARY_ARTIFACT_NOT_DURABLE_FROZEN_DECISION',
    originalProviderBytesRetainedByThisCode:false,
    realQualifiedStockSelectionPerformed:false,immutableDecisionReadbackVerified:false,
    sourceD1Reads:0,sourceD1Writes:0,system1FormalCoreTouched:false,
    livePush:false,orders:false,
  };
  return Object.freeze({...base,ledgerSha256:await sha256Hex(base)});
}
