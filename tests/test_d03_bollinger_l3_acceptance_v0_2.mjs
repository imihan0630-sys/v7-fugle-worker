import assert from "node:assert/strict";
import {
  D03_BOLLINGER_FORMULA_VERSION,
  evaluateBollingerL3ParentV0_2,
  reconcileBollingerL3RunV0_2,
} from "../research/d03_bollinger_l3_acceptance_v0_2.mjs";

function dateFrom(start,i){
  const d=new Date(start+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);
}
function bars(n=20,{constrainedIndex=null}={}){
  return Array.from({length:n},(_,i)=>({
    date:dateFrom("2026-04-01",i),
    close:100+i*0.7+2*Math.sin(i*0.4),
    observedRawBarIdentity:"raw-"+i,
    sourceBarHash:(i.toString(16).padStart(64,"a")).slice(-64),
    symbolSessionVerified:true,
    technicalContinuity:true,
    corporateActionContinuityResolved:true,
    sourceFetchedAt:"2026-04-30T06:00:00Z",
    priceLimitConstrained:i===constrainedIndex,
  }));
}
const parent={scanDate:"2026-05-01",captureGeneration:"gen-1",symbol:"2330",parentSnapshotHash:"a".repeat(64),knownAt:"2026-05-01T08:00:00Z"};
function receipt(custom={}){
  const b=custom.bars||bars(20);
  return {
    symbol:"2330",status:"VALID",continuitySpace:"TECHNICAL_CONTINUITY",
    formulaVersion:D03_BOLLINGER_FORMULA_VERSION,stdDefinition:"POPULATION",
    continuityReceiptId:"cont-1",capturedAt:"2026-05-01T07:00:00Z",
    sourceFamilyVersion:"OFFICIAL_TW_CONTINUITY_V1",sourceHistoryHash:"b".repeat(64),
    rawHistoryAdmissionReceiptId:"raw-admission-1",symbolSessionContractVersion:"SYMBOL_SESSION_V1",
    sessionCalendarVersion:"TW_CALENDAR_V1",continuityEngineVersion:"TECHNICAL_CONTINUITY_V1",
    corporateActionRegistryVersion:"CA_REGISTRY_V1",continuityTransformHash:"c".repeat(64),
    receiptVersion:"CONTINUITY_RECEIPT_V1",cleanHistoryStartDate:b[0].date,
    expectedEligibleSymbolSessions:b.map(x=>x.date),expectedEligibleSymbolSessionCount:b.length,
    observedRawBars:b.length,continuityBars:b.length,bars:b,
    unresolvedMissingSessions:0,unresolvedRelevantEvents:0,pseudoBarsRejected:0,
    ...custom,
  };
}
const good=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:receipt()});
assert.equal(good.status,"VALID");assert.equal(good.l3EvidenceEligible,true);
assert.ok(Number.isFinite(good.values.sma20));assert.ok(/^[0-9a-f]{64}$/.test(good.continuityWindowHash));

const cb=bars(20,{constrainedIndex:10});
const constrained=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:receipt({status:"VALID_BUT_CONSTRAINED",bars:cb,expectedEligibleSymbolSessions:cb.map(x=>x.date)})});
assert.equal(constrained.status,"VALID_BUT_CONSTRAINED");assert.equal(constrained.ordinaryInterpretationEligible,false);

const fakeHash=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:receipt({sourceHistoryHash:"fake"})});
assert.equal(fakeHash.status,"DATA_BLOCKED");assert.ok(fakeHash.reasons.includes("SOURCE_HISTORY_HASH_INVALID"));

const noRaw=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:receipt({rawHistoryAdmissionReceiptId:""})});
assert.equal(noRaw.status,"DATA_BLOCKED");assert.ok(noRaw.reasons.includes("RAW_HISTORY_ADMISSION_RECEIPT_MISSING"));

const late=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:receipt({capturedAt:"2026-05-01T09:00:00Z"})});
assert.equal(late.status,"DATA_BLOCKED");assert.ok(late.reasons.includes("CONTINUITY_CAPTURE_AFTER_PARENT"));

const shortBars=bars(19);
const short=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:receipt({
  bars:shortBars,expectedEligibleSymbolSessions:shortBars.map(x=>x.date),expectedEligibleSymbolSessionCount:19,
  observedRawBars:19,continuityBars:19,cleanHistoryStartDate:shortBars[0].date
})});
assert.equal(short.status,"DATA_BLOCKED");assert.ok(short.reasons.includes("EXPECTED_SESSION_COUNT_NOT_20"));

const unresolved=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:receipt({unresolvedRelevantEvents:1})});
assert.equal(unresolved.status,"DATA_BLOCKED");assert.ok(unresolved.reasons.includes("UNRESOLVED_RELEVANT_EVENTS"));

const badStd=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:receipt({stdDefinition:"SAMPLE"})});
assert.equal(badStd.status,"DATA_BLOCKED");assert.ok(badStd.reasons.includes("STD_DEFINITION_MISMATCH"));

const unknown=evaluateBollingerL3ParentV0_2({parent,continuityReceipt:null});assert.equal(unknown.status,"UNKNOWN");
const parent2={...parent,symbol:"2317",parentSnapshotHash:"d".repeat(64)};
const unknown2=evaluateBollingerL3ParentV0_2({parent:parent2,continuityReceipt:null});
const complete=reconcileBollingerL3RunV0_2({expectedParents:[parent,parent2],attempts:[good,unknown2]});
assert.equal(complete.status,"COMPLETE");assert.equal(complete.countsByStatus.UNKNOWN,1);
const incomplete=reconcileBollingerL3RunV0_2({expectedParents:[parent,parent2],attempts:[good]});
assert.equal(incomplete.status,"INCOMPLETE");assert.equal(incomplete.missingCount,1);

console.log(JSON.stringify({
 status:"PASS",sma20:good.values.sma20,popStd20:good.values.popStd20,
 fakeSourceLineageBlocked:fakeHash.status,missingRawReceiptBlocked:noRaw.status,
 constrainedStatus:constrained.status,completeWithUnknown:complete.status
},null,2));
