import assert from "node:assert/strict";
import {
  bindD03ParentContinuityV0_1,evaluateBoundBollingerL3V0_1,evaluateBoundAdxL3V0_1
} from "../research/d03_parent_continuity_binding_v0_1.mjs";
import {D03_ADX_FORMULA_VERSION,D03_ADX_STATE_CONSTRUCTION_VERSION} from "../research/d03_adx_l3_acceptance_v0_2.mjs";
import {D03_BOLLINGER_FORMULA_VERSION} from "../research/d03_bollinger_l3_acceptance_v0_2.mjs";

function dateFrom(start,i){const d=new Date(start+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);}
function hashChar(c){return c.repeat(64);}
const parent={scanDate:"2026-05-01",captureGeneration:"gen-1",symbol:"2330",parentSnapshotHash:hashChar("a"),knownAt:"2026-05-01T08:00:00Z"};
function baseBars(n,start="2026-01-02"){
 let close=100;return Array.from({length:n},(_,i)=>{close+=0.2+0.3*Math.sin(i*.2);return {
  date:dateFrom(start,i),high:close+1,low:close-1,close,observedRawBarIdentity:"raw-"+i,
  sourceBarHash:(i.toString(16).padStart(64,"b")).slice(-64),symbolSessionVerified:true,technicalContinuity:true,
  corporateActionContinuityResolved:true,sourceFetchedAt:"2026-04-30T06:00:00Z",priceLimitConstrained:false
 };});
}
function common(b){
 return {
  symbol:"2330",status:"VALID",continuitySpace:"TECHNICAL_CONTINUITY",continuityReceiptId:"cont-1",
  asOf:"2026-05-01",capturedAt:"2026-05-01T07:00:00Z",receiptVersion:"CONT_V1",
  sourceFamilyVersion:"SRC_V1",sourceHistoryHash:hashChar("b"),rawHistoryAdmissionReceiptId:"raw-1",
  symbolSessionContractVersion:"SESSION_V1",sessionCalendarVersion:"CAL_V1",continuityEngineVersion:"CONT_ENGINE_V1",
  corporateActionRegistryVersion:"CA_V1",continuityTransformHash:hashChar("c"),
  cleanHistoryStartDate:b[0].date,expectedEligibleSymbolSessions:b.map(x=>x.date),bars:b,
  sourceBarsThrough:b.at(-1).date,unresolvedMissingSessions:0,unresolvedRelevantEvents:0,pseudoBarsRejected:0
 };
}
function bbReceipt(){
 const b=baseBars(20,"2026-04-12");
 return {...common(b),formulaVersion:D03_BOLLINGER_FORMULA_VERSION,stdDefinition:"POPULATION",
  expectedEligibleSymbolSessionCount:20,observedRawBars:20,continuityBars:20};
}
function adxReceipt(){
 const b=baseBars(80,"2026-02-11");
 return {...common(b),formulaVersion:D03_ADX_FORMULA_VERSION,stateConstructionMode:"FULL_REPLAY",
  stateConstructionVersion:D03_ADX_STATE_CONSTRUCTION_VERSION,stateLineageId:hashChar("d"),
  initializationAnchorDate:b[0].date,anchorCertificationState:"CANONICAL_LINEAGE_ANCHOR_CERTIFIED",
  replayCertificationState:"REPLAY_EXACT",eligibleBarsFromAnchorToAsOf:b.length};
}

const bind=bindD03ParentContinuityV0_1({parent,continuityReceipt:bbReceipt(),bindingCreatedAt:"2026-05-01T08:01:00Z"});
assert.equal(bind.status,"VALID");assert.equal(bind.expectedEligibleDateSetHash,bind.continuityBarDateSetHash);
assert.ok(/^[0-9a-f]{64}$/.test(bind.bindingId));

const wrongGen={...parent,captureGeneration:"gen-2"};
const bind2=bindD03ParentContinuityV0_1({parent:wrongGen,continuityReceipt:bbReceipt(),bindingCreatedAt:"2026-05-01T08:01:00Z"});
assert.equal(bind2.status,"VALID");
assert.notEqual(bind.bindingId,bind2.bindingId);

const wrongDate=bbReceipt();wrongDate.asOf="2026-04-30";
const badDate=bindD03ParentContinuityV0_1({parent,continuityReceipt:wrongDate});
assert.equal(badDate.status,"DATA_BLOCKED");assert.ok(badDate.reasons.includes("CONTINUITY_ASOF_PARENT_DATE_MISMATCH"));

const late=bbReceipt();late.capturedAt="2026-05-01T09:00:00Z";
const badLate=bindD03ParentContinuityV0_1({parent,continuityReceipt:late});
assert.equal(badLate.status,"DATA_BLOCKED");assert.ok(badLate.reasons.includes("CONTINUITY_CAPTURE_AFTER_PARENT"));

const mismatch=bbReceipt();mismatch.bars=mismatch.bars.slice(0,-1);
const badSet=bindD03ParentContinuityV0_1({parent,continuityReceipt:mismatch});
assert.equal(badSet.status,"DATA_BLOCKED");assert.ok(badSet.reasons.includes("ELIGIBLE_DATE_SET_MISMATCH"));

const future=bbReceipt();future.bars[future.bars.length-1]={...future.bars.at(-1),date:"2026-05-02"};future.sourceBarsThrough="2026-05-02";
const badFuture=bindD03ParentContinuityV0_1({parent,continuityReceipt:future});
assert.equal(badFuture.status,"DATA_BLOCKED");assert.ok(badFuture.reasons.includes("FUTURE_BAR_RELATIVE_TO_PARENT"));

const bb=evaluateBoundBollingerL3V0_1({parent,continuityReceipt:bbReceipt(),bindingCreatedAt:"2026-05-01T08:01:00Z"});
assert.equal(bb.binding.status,"VALID");assert.equal(bb.indicator.status,"VALID");assert.equal(bb.l3EvidenceEligible,true);

const adx=evaluateBoundAdxL3V0_1({parent,continuityReceipt:adxReceipt(),bindingCreatedAt:"2026-05-01T08:01:00Z"});
assert.equal(adx.binding.status,"VALID");assert.equal(adx.indicator.status,"VALID");assert.equal(adx.l3EvidenceEligible,true);

console.log(JSON.stringify({
 status:"PASS",bindingId:bind.bindingId,crossGenerationBindingChanges:bind.bindingId!==bind2.bindingId,
 wrongAsOfBlocked:badDate.status,lateCaptureBlocked:badLate.status,dateSetMismatchBlocked:badSet.status,
 futureBarBlocked:badFuture.status,boundBollinger:bb.status,boundAdx:adx.status
},null,2));
