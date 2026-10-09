import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { inspectD07ProspectiveUniverseV0_1 } from "./d07_dual_market_universe_preflight_v0_1.mjs";

// D08: read-only, zero-I/O cross-check between the full dual-exchange
// universe, ALL strategy runs, and capacity results. Never grants D1 writes.
export const D08_CAPACITY_UNIVERSE_LINK_VERSION =
  "S2_D08_CAPACITY_UNIVERSE_ACCOUNTING_LINK_V0_1";
const HEX = /^[a-f0-9]{64}$/;
const READY = new Set(["CAPACITY_READY","CAPACITY_ZERO_PICK_READY",
  "CAPACITY_READY_PARTIAL_COVERAGE"]);
function omit(obj,keys) {
  const copy={...obj};
  for(const key of keys)delete copy[key];
  return copy;
}
function add(s,code){s.add(code);}
function validSha(x){return typeof x==="string" && HEX.test(x);}
function required(x,name){
  if(typeof x!=="string"||!x.trim())throw new Error("D08_REQUIRED:"+name);
  return x.trim();
}
function finiteInt(x){return Number.isInteger(x)&&x>=0;}
export async function inspectD08CapacityUniverseLinkV0_1({
  a1SymbolSnapshotBatch:batch,
  sourceSessionReceipt:source,
  strategyRuns,
  capacityOrchestration:capacity,
}={}) {
  if(!batch||!source||!Array.isArray(strategyRuns)||!strategyRuns.length||!capacity) {
    throw new Error("D08_FULL_SOURCE_STRATEGY_CAPACITY_INPUTS_REQUIRED");
  }
  const d07=await inspectD07ProspectiveUniverseV0_1({
    a1SymbolSnapshotBatch:batch,sourceSessionReceipt:source,
  });
  const blockers=new Set();
  if(d07.state!=="READY_FOR_INDEPENDENT_PHYSICAL_PIT_REVALIDATION") {
    add(blockers,"D08_D07_UNIVERSE_SOURCE_BLOCKED");
  }
  const symbols=Array.isArray(batch.symbols)?batch.symbols:[];
  const universe=new Set(symbols);
  const day=batch.marketDate,clock=batch.decisionTimestamp;
  const strategyLedger=[];
  const strategyIds=new Set();
  let incompleteTotal=0, missingTotal=0, contradictoryTotal=0;
  for(let i=0;i<strategyRuns.length;i++) {
    const run=strategyRuns[i];
    const id=required(run?.bundle?.strategyId||run?.strategyId,"strategyId");
    const version=required(run?.bundle?.strategyVersion||run?.strategyVersion,"strategyVersion");
    if(strategyIds.has(id)){add(blockers,"D08_DUPLICATE_STRATEGY:"+id);continue;}
    strategyIds.add(id);
    const issues=[];
    if(run.marketDate!==day||run.decisionTimestamp!==clock)
      issues.push("RUN_DECISION_CLOCK_MISMATCH");
    if(run.a1BatchHash!==batch.batchHash||run.sourceSessionHash!==source.sourceSessionHash)
      issues.push("RUN_SOURCE_HASH_NOT_BOUND");
    if(run.finalSelectionEnabled!==false||run.scheduledCaptureActivated!==false)
      issues.push("RUN_UNAUTHORIZED_FINAL_SELECTION");
    if(run.bundle?.runReceipt?.runState!=="COMPLETE"
       ||run.bundle?.runReceipt?.strategyId!==id
       ||run.bundle?.runReceipt?.strategyVersion!==version)
      issues.push("RUN_RECEIPT_INCOMPLETE");
    if(!validSha(run.orchestrationHash)
        ||await sha256Hex(omit(run,["orchestrationHash","bundle"]))!==run.orchestrationHash)
      issues.push("RUN_ORCHESTRATION_HASH_UNVERIFIED");
    if(!Array.isArray(run.rankingInputs)
       ||!Array.isArray(run.perSymbolDiagnostics)
       ||!run.exclusions||typeof run.exclusions!=="object") {
      issues.push("RUN_ACCOUNTING_ARRAYS_MISSING");
    }
    const ranks=Array.isArray(run.rankingInputs)?run.rankingInputs:[];
    const diags=Array.isArray(run.perSymbolDiagnostics)?run.perSymbolDiagnostics:[];
    const rankMap=new Map(),diagMap=new Map();
    for(const x of ranks) {
      const k=String(x?.symbol??"");
      if(!universe.has(k)||rankMap.has(k))issues.push("RUN_RANK_UNIVERSE_OR_DUPLICATE");
      rankMap.set(k,x);
      if(x?.strategyId!==id||x?.strategyVersion!==version)
        issues.push("RUN_RANK_STRATEGY_VERSION_MISMATCH");
      if(x?.strategyValidity==="INCOMPLETE")incompleteTotal++;
      if(x?.strategyValidity==="VALID"&&x?.entryReadiness==="BUY_ELIGIBLE"
         &&(!x.familyAssessments||Object.values(x.familyAssessments).some(y=>y?.observationState==="UNKNOWN"))) {
        contradictoryTotal++;
        issues.push("RUN_UNKNOWN_FAMILY_BUY_CLAIM");
      }
    }
    for(const x of diags) {
      const k=String(x?.symbol??"");
      if(!universe.has(k)||diagMap.has(k))issues.push("RUN_DIAGNOSTIC_UNIVERSE_OR_DUPLICATE");
      diagMap.set(k,x);
    }
    let localExcluded=0,localUnaccounted=0;
    for(const symbol of universe) {
      const ex=run.exclusions[symbol]?.excluded===true;
      const rank=rankMap.has(symbol);
      const d=diagMap.get(symbol);
      if(ex)localExcluded++;
      if((ex&&rank)||(!ex&&!rank)) {
        localUnaccounted++;
        issues.push("RUN_SYMBOL_EXCLUSION_OR_RANK_GAP");
      }
      if(!d||d.state!==(ex?"EXCLUDED":"ACCOUNTED")) {
        issues.push("RUN_SYMBOL_DIAGNOSTIC_MISSING_OR_MISMATCH");
      }
    }
    missingTotal+=localUnaccounted;
    if(Object.keys(run.exclusions).some(sym=>!universe.has(sym))
       ||diags.length!==universe.size
       ||ranks.length+localExcluded!==universe.size
       ||run.baseUniverseCount!==universe.size
       ||run.excludedCount!==localExcluded
       ||run.eligibleCount!==ranks.length
       ||run.accountedCount!==ranks.length) {
      issues.push("RUN_FULL_DENOMINATOR_ACCOUNTING_INCONSISTENT");
    }
    const receipt=run.bundle?.runReceipt;
    const claimedIncomplete=receipt?.stateCounts?.INCOMPLETE;
    const actualIncomplete=ranks.filter(x=>x.strategyValidity==="INCOMPLETE").length;
    if(!finiteInt(claimedIncomplete)||claimedIncomplete!==actualIncomplete) {
      issues.push("RUN_INCOMPLETE_DENOMINATOR_COUNT_MISMATCH");
    }
    const missingRequired=ranks.filter(x=>x.strategyValidity==="INCOMPLETE").length;
    if(missingRequired>0)issues.push("RUN_REQUIRED_EVIDENCE_INCOMPLETE");
    const uniqueIssues=[...new Set(issues)].sort();
    uniqueIssues.forEach(s=>add(blockers,id+":"+s));
    strategyLedger.push(deepFreeze({
      strategyId:id,strategyVersion:version,
      runId:receipt?.runId||null,
      runHash:run.orchestrationHash||null,
      rankedCount:ranks.length,excludedCount:localExcluded,
      accountedUniverseCount:ranks.length+localExcluded,
      unresolvedCount:missingRequired+localUnaccounted,
      state:uniqueIssues.length?"INCOMPLETE":"ACCOUNTED_UNCERTIFIED",
      blockers:Object.freeze(uniqueIssues),
    }));
  }
  if(capacity.marketDate!==day||capacity.decisionTimestamp!==clock)
    add(blockers,"D08_CAPACITY_DECISION_CLOCK_MISMATCH");
  if(capacity.strategyCount!==strategyRuns.length)
    add(blockers,"D08_CAPACITY_STRATEGY_COUNT_MISMATCH");
  if(capacity.finalSelectionEnabled!==false||capacity.livePushEnabled===true
     ||capacity.orderImpact===true) {
    add(blockers,"D08_CAPACITY_UNAUTHORIZED_LIVE_ACTION");
  }
  const cap=capacity.capacityReceipt;
  if(!cap) {
    add(blockers,"D08_CAPACITY_FROZEN_RECEIPT_MISSING");
  } else {
    if(!validSha(cap.capacityHash)
       ||await sha256Hex(omit(cap,["capacityHash"]))!==cap.capacityHash) {
      add(blockers,"D08_CAPACITY_RECEIPT_HASH_MISMATCH");
    }
    if(cap.marketDate!==day||cap.decisionTimestamp!==clock
       ||cap.globalMax!==12||cap.perStrategyMax!==3
       ||cap.globalCount>12||!finiteInt(cap.globalCount)) {
      add(blockers,"D08_CAPACITY_IDENTITY_OR_LIMIT_MISMATCH");
    }
    const global=Array.isArray(cap.globalPool)?cap.globalPool:[];
    if(global.length!==cap.globalCount||new Set(global.map(x=>x.symbol)).size!==global.length
       ||global.some(x=>!universe.has(String(x.symbol)))) {
      add(blockers,"D08_GLOBAL_POOL_OUTSIDE_FULL_UNIVERSE");
    }
    const d=cap.selectionDenominator;
    if(!d||!validSha(d.provenanceHash)
       ||await sha256Hex(omit(d,["provenanceHash"]))!==d.provenanceHash) {
      add(blockers,"D08_CAPACITY_DENOMINATOR_PROVENANCE_INVALID");
    } else {
      if(d.denominatorState!=="COMPLETE"||d.unresolvedCount!==0)
        add(blockers,"D08_STRATEGY_DENOMINATOR_UNRESOLVED");
      const receipts=Array.isArray(d.contributingShadowRuns)?d.contributingShadowRuns:[];
      if(receipts.length!==strategyRuns.length
         ||receipts.some(x=>!strategyIds.has(x.strategyId))
         ||new Set(receipts.map(x=>x.strategyId)).size!==receipts.length) {
        add(blockers,"D08_CONTRIBUTING_STRATEGY_LINEAGE_MISSING");
      } else {
        for(const item of receipts) {
          const run=strategyRuns.find(x=>(x.bundle?.strategyId??x.strategyId)===item.strategyId);
          if(item.strategyVersion!==(run.bundle?.strategyVersion??run.strategyVersion)
             ||item.runId!==run.bundle?.runReceipt?.runId
             ||item.shadowAccountingHash!==await sha256Hex(run.bundle.runReceipt)
             ||item.runFingerprintHash!==(run.bundle?.fingerprint?.runFingerprintHash||null)) {
            add(blockers,"D08_CONTRIBUTING_STRATEGY_HASH_MISMATCH");
          }
        }
      }
    }
  }
  if(!READY.has(capacity.state)) add(blockers,"D08_CAPACITY_NOT_READY");
  if(capacity.state==="CAPACITY_ZERO_PICK_READY") {
    if(capacity.zeroPickDay!==true||capacity.zeroPickState!=="CLEAN_ZERO_PICK"
       ||cap?.globalCount!==0||incompleteTotal>0||missingTotal>0) {
      add(blockers,"D08_FALSE_CLEAN_ZERO_PICK");
    }
  }
  if(capacity.state==="CAPACITY_READY_PARTIAL_COVERAGE") {
    add(blockers,"D08_PARTIAL_SELECTION_CANNOT_BE_CERTIFIED");
  }
  const base={
    schemaVersion:D08_CAPACITY_UNIVERSE_LINK_VERSION,
    marketDate:day,decisionTimestamp:clock,
    a1BatchHash:batch.batchHash,sourceSessionHash:source.sourceSessionHash,
    d07PreflightHash:d07.preflightHash,
    sourcePreflightState:d07.state,
    strategyLedger:Object.freeze(strategyLedger),
    strategyCount:strategyRuns.length,
    capacityRunId:cap?.capacityRunId||null,
    capacityHash:cap?.capacityHash||null,
    requestedCapacityState:capacity.state||"UNKNOWN",
    requestedZeroPickDay:capacity.zeroPickDay===true,
    canonicalZeroPickDay:null,
    zeroPickCertified:false,
    fullUniversePhysicallyVerified:false,
    physicalPITVerified:false,
    finalSelectionEnabled:false,
    d1WriteAuthorized:false,
    livePushEnabled:false,orderImpact:false,system1FormalCoreImpact:false,
    readiness:blockers.size?"BLOCKED_UNIVERSE_OR_DENOMINATOR":
      "RESEARCH_ACCOUNTED_PENDING_PHYSICAL_SOURCE_VERIFICATION",
    blockers:Object.freeze([...blockers].sort()),
  };
  return deepFreeze({...base,linkHash:await sha256Hex(base)});
}
