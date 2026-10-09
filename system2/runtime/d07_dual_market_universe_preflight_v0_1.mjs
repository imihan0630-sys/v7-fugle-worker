import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { A1_SYMBOL_SNAPSHOT_SOURCES } from "./a1_symbol_snapshot_adapter.mjs";

// D07: isolated research preflight only. Never an independent HTTP attestation
// or authorization for final selection, capacity, orders or daily D1 writes.
export const D07_UNIVERSE_PREFLIGHT_VERSION = "S2_D07_A1_DUAL_MARKET_UNIVERSE_PREFLIGHT_V0_1";
const HEX = /^[a-f0-9]{64}$/;
const MARKETS = Object.freeze(["TWSE","TPEX"]);
function parse(x) {
  if(typeof x!=="string"|| !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(x)) return null;
  const ms=Date.parse(x);
  return Number.isFinite(ms)?ms:null;
}
function block(set,code){set.add(code);}
function withoutHash(x,key){const obj={...x};delete obj[key];return obj;}
export async function inspectD07ProspectiveUniverseV0_1({
  a1SymbolSnapshotBatch:batch,sourceSessionReceipt:session,
}={}) {
  if(!batch||typeof batch!=="object"||!session||typeof session!=="object"){
    throw new Error("D07_A1_AND_SOURCE_SESSION_REQUIRED");
  }
  if(!HEX.test(batch.batchHash||"")||!HEX.test(session.sourceSessionHash||"")){
    throw new Error("D07_SOURCE_OR_BATCH_HASH_MISSING");
  }
  if(await sha256Hex(withoutHash(batch,"batchHash"))!==batch.batchHash){
    throw new Error("D07_A1_BATCH_HASH_MISMATCH");
  }
  if(await sha256Hex(withoutHash(session,"sourceSessionHash"))!==session.sourceSessionHash){
    throw new Error("D07_SOURCE_SESSION_HASH_MISMATCH");
  }
  const blockers=new Set();
  const T=batch.marketDate,ts=batch.decisionTimestamp,clock=parse(ts);
  if(T!==session.marketDate||ts!==session.decisionTimestamp||clock===null){
    block(blockers,"D07_SESSION_CLOCK_MISMATCH");
  }
  if(batch.state!=="READY"||batch.pointInTimeEligible!==true){
    block(blockers,"D07_A1_BATCH_NOT_READY");
  }
  if(session.sourceSessionState!=="SOURCE_SESSION_READY"
      ||session.requiredBlockers?.length || session.outcomeJoinSourceEligible!==true){
    block(blockers,"D07_REQUIRED_SOURCE_SESSION_INCOMPLETE");
  }
  if(!Array.isArray(batch.symbols)||!batch.bySymbol||typeof batch.bySymbol!=="object"
    ||!Array.isArray(session.sourceRows)||!Array.isArray(session.extraObservedSources)){
    throw new Error("D07_MALFORMED_SOURCE_CONTRACT");
  }
  if(batch.symbols.length!==batch.ordinarySymbolCount
      ||new Set(batch.symbols).size!==batch.symbols.length
      ||Object.keys(batch.bySymbol).length!==batch.ordinarySymbolCount){
    block(blockers,"D07_UNIVERSE_DENOMINATOR_INCONSISTENT");
  }
  const requiredSources=new Set(MARKETS.map(m=>A1_SYMBOL_SNAPSHOT_SOURCES[m].sourceId));
  const expectedIds=new Set(session.sourceRows.filter(x=>x.role==="REQUIRED").map(x=>x.sourceId));
  if(expectedIds.size!==requiredSources.size
      ||[...requiredSources].some(id=>!expectedIds.has(id))){
    block(blockers,"D07_BOTH_MARKETS_REQUIRED_WITHOUT_WAIVER");
  }
  if(session.extraObservedSources.length){
    block(blockers,"D07_UNREGISTERED_SOURCES_REQUIRE_REVIEW");
  }
  const marketLedger=[];
  let combinedCount=0;
  for(const market of MARKETS) {
    const m=batch.markets?.[market];
    const expected=A1_SYMBOL_SNAPSHOT_SOURCES[market];
    if(!m||typeof m!=="object") {block(blockers,"D07_MISSING_MARKET:"+market);continue;}
    const issues=[];
    if(m.sourceId!==expected.sourceId||m.market!==market)issues.push("SOURCE_ID_MISMATCH");
    if(m.marketDate!==T||m.decisionTimestamp!==ts)issues.push("SOURCE_DATE_MISMATCH");
    if(m.state!=="READY"||m.blockerCodes?.length)issues.push("MARKET_NOT_READY");
    if(!Number.isInteger(m.minimumOrdinarySymbols)
      ||m.minimumOrdinarySymbols<expected.minimumOrdinarySymbols){
      issues.push("COVERAGE_FLOOR_WEAKENED");
    }
    if(!Number.isInteger(m.normalizedSymbolCount)
      ||m.normalizedSymbolCount<expected.minimumOrdinarySymbols
      ||!Array.isArray(m.snapshots)||m.snapshots.length!==m.normalizedSymbolCount){
      issues.push("ORDINARY_UNIVERSE_INCOMPLETE");
    }
    if(m.duplicateSymbols?.length||m.invalidOhlcSymbols?.length){
      issues.push("INVALID_OR_DUPLICATE_SYMBOLS");
    }
    const required=session.sourceRows.filter(x=>x.sourceId===expected.sourceId);
    if(required.length!==1||required[0]?.role!=="REQUIRED"||required[0]?.readiness!=="READY"){
      issues.push("REQUIRED_SOURCE_NOT_READY");
    }
    const source=required[0]?.observed;
    if(!source||source.sourceDate!==T||source.pointInTimeEligible!==true
      ||!HEX.test(source.payloadHash||"")
      ||parse(source.availableAt)===null||parse(source.capturedAt)===null
      ||parse(source.availableAt)>clock||parse(source.capturedAt)>clock
      ||parse(source.availableAt)>parse(source.capturedAt)){
      issues.push("SOURCE_PIT_AND_PAYLOAD_PROVENANCE_NOT_VERIFIED");
    }
    if(!Array.isArray(m.snapshots))continue;
    for(const snap of m.snapshots){
      if(snap.market!==market||snap.marketDate!==T
        ||snap.provenance?.sourceId!==expected.sourceId
        ||snap.provenance?.sourceDate!==T
        ||snap.provenance?.pointInTimeEligible!==true
        ||parse(snap.provenance?.observedAt)===null
        ||parse(snap.provenance?.observedAt)>clock
        ||!HEX.test(snap.sourceRowHash||"")
        ||snap.priceState!=="COMPLETE_OHLC"
        ||snap.ohlcConsistency!=="CONSISTENT") {
        issues.push("SYMBOL_PRICE_OR_PIT_UNVERIFIED");
        break;
      }
      if(await sha256Hex(snap.sourceFields)!==snap.sourceRowHash) {
        issues.push("SYMBOL_RAW_FIELD_HASH_MISMATCH");
        break;
      }
      if(batch.bySymbol[snap.symbol]?.sourceRowHash!==snap.sourceRowHash){
        issues.push("UNIVERSE_SYMBOL_INDEX_MISMATCH");break;
      }
    }
    combinedCount+=m.normalizedSymbolCount||0;
    issues.forEach(x=>block(blockers,market+":"+x));
    marketLedger.push(deepFreeze({
      market,sourceId:expected.sourceId,
      minimumOrdinarySymbols:expected.minimumOrdinarySymbols,
      observedSymbolCount:m.normalizedSymbolCount||0,
      readiness:issues.length?"BLOCKED":"REQUIRES_INDEPENDENT_PHYSICAL_PIT_REVALIDATION",
      blockerCodes:Object.freeze([...new Set(issues)]),
    }));
  }
  if(combinedCount!==batch.ordinarySymbolCount)block(blockers,"D07_CROSS_MARKET_UNIVERSE_MISMATCH");
  const ready=blockers.size===0;
  const base={
    schemaVersion:D07_UNIVERSE_PREFLIGHT_VERSION,
    marketDate:T,decisionTimestamp:ts,
    a1BatchHash:batch.batchHash,sourceSessionHash:session.sourceSessionHash,
    physicalPITVerified:false,externalSourceBytesAuthenticated:false,
    fullUniverseCertified:false,finalSelectionEnabled:false,
    capacityWriteEnabled:false,orderImpact:false,system1FormalCoreImpact:false,
    marketLedger:Object.freeze(marketLedger),
    blockers:Object.freeze([...blockers].sort()),
    state:ready?"READY_FOR_INDEPENDENT_PHYSICAL_PIT_REVALIDATION":"BLOCKED_SOURCE_OR_UNIVERSE",
    authorization:"RESEARCH_PREFLIGHT_ONLY_NO_DAILY_SELECTION",
  };
  return deepFreeze({...base,preflightHash:await sha256Hex(base)});
}
