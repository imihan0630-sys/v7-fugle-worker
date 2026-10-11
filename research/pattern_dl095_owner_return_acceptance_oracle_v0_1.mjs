import {comparePITInstants} from "./d01_pit_instant_clock_v0_1.mjs";
// D01 DL-095 exact-witness owner-return acceptance oracle v0.1
const HEX64=/^[a-f0-9]{64}$/;

export function validateOwnerIdentity(r={}){
  if(r.market!=="TWSE"||r.symbol!=="1101"||r.targetDate!=="2021-06-15"||r.interfaceCutoffAt!=="2021-06-15T23:59:59+08:00")
    return {status:"OWNER_RETURN_WITNESS_MISMATCH"};
  if(r.outcomeFieldsPresent===true)return {status:"OUTCOME_FIELD_CONTAMINATION"};
  return {status:"OWNER_IDENTITY_VALID"};
}

export function validateEvidenceClock({firstObservableAt,interfaceCutoffAt}={}){
  const cmp=comparePITInstants(firstObservableAt,interfaceCutoffAt);
  if(cmp.state==="CLOCK_UNKNOWN")return {status:"EVIDENCE_CLOCK_UNKNOWN"};
  return {status:cmp.state==="KNOWN_BY_CUTOFF"?"EVIDENCE_CLOCK_VALID":"LATE_EVIDENCE_NOT_PIT_ELIGIBLE"};
}

export function validateExactWindow(r={}){
  const e=r.orderedExpectedSessionDates||[];
  const o=r.orderedObservedSessionDates||[];
  if(e.length!==61||o.length!==61)return {status:"EXACT_WINDOW_COUNT_BLOCKED"};
  if(new Set(e).size!==61||new Set(o).size!==61)return {status:"EXACT_WINDOW_DUPLICATE_DATE"};
  if(e.join("|")!==o.join("|"))return {status:"EXACT_WINDOW_DATESET_MISMATCH"};
  if(!r.expectedSessionHash||r.expectedSessionHash!==r.observedSessionHash)return {status:"EXACT_WINDOW_HASH_MISMATCH"};
  if(r.unresolvedMissingSessions!==0||r.unresolvedUnexpectedSessions!==0)return {status:"EXACT_WINDOW_UNRESOLVED_SESSION"};
  return {status:"EXACT_WINDOW_VALID"};
}

export function validateSourceHistoryIdentity(r={}){
  if(!r.rawHistoryAdmissionReceiptId||!HEX64.test(String(r.sourceHistoryHash||"")))
    return {status:"SOURCE_HISTORY_IDENTITY_INCOMPLETE"};
  if(r.boundSourceHistoryHash&&r.boundSourceHistoryHash!==r.sourceHistoryHash)
    return {status:"SOURCE_HISTORY_HASH_MISMATCH"};
  return {status:"SOURCE_HISTORY_IDENTITY_VALID"};
}

export function validateZeroRows(r={}){
  if(r.zeroRows!==true)return {status:"NOT_A_ZERO_ROW_CASE"};
  const required=[
    "requestedRangeMatchesExactly","paginationComplete","parserComplete",
    "emptyRangeSemanticsCertified","sourceCoverageComplete"
  ];
  if(!required.every(k=>r[k]===true)||!r.sourceHash)
    return {status:"ZERO_ROWS_UNCERTIFIED_ABSENCE"};
  return {status:"ZERO_ROWS_CERTIFIED_ABSENCE"};
}

export function validateR4ClearNoAction(r={}){
  const booleans=[
    "eventCoverageComplete","noEventMayBeClaimed","suspensionCoverageComplete",
    "symbolSessionCompletenessEvidenceReady","revisionCoverageComplete"
  ];
  if(!booleans.every(k=>r[k]===true))return {status:"R4_COMPLETENESS_BLOCKED"};
  if(r.symbolClassification!=="NO_EVENT")return {status:"R4_NOT_NO_EVENT"};
  if(r.ambiguityCount!==0)return {status:"R4_EVENT_AMBIGUITY"};
  if(!r.continuityReceiptId||!r.receiptHash||!HEX64.test(String(r.sourceHistoryHash||"")))
    return {status:"R4_LINEAGE_INCOMPLETE"};
  return {status:"R4_CLEAR_NO_ACTION_ELIGIBLE"};
}

export function validateR6Normal(r={}){
  if(r.coverageCompleteForWindow!==true||r.requestedRangeMatchesExactly!==true)
    return {status:"R6_COVERAGE_BLOCKED"};
  if(r.changedTradingMethodResolved!==true)return {status:"R6_CHANGED_TRADING_METHOD_UNKNOWN"};
  if(!r.sourceHash||!r.firstObservableAt)return {status:"R6_PROVENANCE_INCOMPLETE"};
  if(r.state!=="CERTIFIED_NORMAL_MATCHING")return {status:"R6_NOT_CERTIFIED_NORMAL"};
  return {status:"R6_NORMAL_READY"};
}

export function validateCrossReceiptIdentity(receipts=[]){
  if(!receipts.length)return {status:"BUNDLE_EMPTY"};
  const key=x=>[x.market,x.symbol,x.targetDate,x.interfaceCutoffAt,x.expectedSessionHash,x.sourceHistoryHash||""].join("|");
  const keys=new Set(receipts.map(key));
  return {status:keys.size===1?"BUNDLE_CROSS_RECEIPT_IDENTITY_VALID":"BUNDLE_CROSS_RECEIPT_IDENTITY_MISMATCH"};
}

export function validateR7Admission({r1,r2,r3,r4,r5,r6,crossIdentity,outcomeFieldsPresent}={}){
  if(outcomeFieldsPresent===true)return {status:"R7_OUTCOME_FIREWALL_BREACH"};
  const states=[r1,r2,r3,r4,r5,r6,crossIdentity];
  return {status:states.every(x=>x==="PASS")?"R7_ADMISSION_READY":"R7_ADMISSION_BLOCKED"};
}
