import assert from "node:assert/strict";
import {
 bindD03ParentCutoffContinuityV0_2,
 evaluateBoundCutoffDerivedBollingerL3V0_3,
 evaluateBoundCutoffDerivedAdxL3V0_3,
} from "../research/d03_parent_continuity_binding_v0_2.mjs";
import {D03_BOLLINGER_FORMULA_VERSION} from "../research/d03_bollinger_l3_acceptance_v0_2.mjs";
import {D03_ADX_FORMULA_VERSION,D03_ADX_STATE_CONSTRUCTION_VERSION} from "../research/d03_adx_l3_acceptance_v0_2.mjs";

const H=c=>String(c).repeat(64).slice(0,64);
function dateFrom(start,i){const d=new Date(start+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);}
const parent={
 scanDate:"2026-10-05",captureGeneration:"GEN-A",symbol:"2330",parentSnapshotHash:H("a"),
 decisionCutoffAt:"2026-10-05T10:09:00.000Z",decisionAt:"2026-10-05T10:10:00.000Z",knownAt:"2026-10-05T10:10:00.000Z"
};
const cut={
 evidenceCutId:"CUT-A",evidenceCutoffAt:"2026-10-05T10:05:00.000Z",scope:"MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE",
 noRevisionGapThroughCut:true,symbolSessionCompletenessCertified:true,queryTruncated:false,budgetExceeded:false,
 unknownRequiredLaneCount:0,lateDiscoveredPreCutVersionCount:0,sourceCutManifestHash:H("b"),
 expectedVersionKeys:["V1"],observedVersionKeys:["V1"]
};
function baseReceipt(bars){
 return {
  symbol:"2330",asOf:"2026-10-05",status:"VALID",continuitySpace:"TECHNICAL_CONTINUITY",
  continuityReceiptId:"CONT-1",receiptVersion:"CONT_V3",receiptCreatedAt:"2026-10-05T10:20:00.000Z",
  evidenceCutId:cut.evidenceCutId,evidenceCutManifestHash:cut.sourceCutManifestHash,
  derivedOnlyFromEvidenceCut:true,postCutSourceFactCount:0,unboundSourceFactCount:0,
  transformInputManifestHash:H("9"),sourceFactRefSetHash:H("8"),
  sourceFamilyVersion:"OFFICIAL_TW_CONTINUITY_V1",sourceHistoryHash:H("d"),
  rawHistoryAdmissionReceiptId:"RAW-1",symbolSessionContractVersion:"SYMBOL_SESSION_V1",
  sessionCalendarVersion:"TW_CAL_V1",continuityEngineVersion:"CONT_ENGINE_V1",
  corporateActionRegistryVersion:"CA_REG_V1",continuityTransformHash:H("e"),
  cleanHistoryStartDate:bars[0].date,expectedEligibleSymbolSessions:bars.map(x=>x.date),
  bars,sourceBarsThrough:bars.at(-1).date,unresolvedMissingSessions:0,unresolvedRelevantEvents:0,pseudoBarsRejected:0,
 };
}
function bbBars(){
 return Array.from({length:20},(_,i)=>({date:dateFrom("2026-09-16",i),close:100+i*.6+Math.sin(i*.2),
  observedRawBarIdentity:"bb-"+i,sourceBarHash:(i.toString(16).padStart(64,"c")).slice(-64),
  symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,
  sourceFetchedAt:"2026-10-05T10:04:00.000Z",priceLimitConstrained:false}));
}
function bbReceipt(){
 const bars=bbBars();
 return {...baseReceipt(bars),formulaVersion:D03_BOLLINGER_FORMULA_VERSION,stdDefinition:"POPULATION",
  expectedEligibleSymbolSessionCount:20,observedRawBars:20,continuityBars:20};
}
function adxBars(n=80){
 let close=100;
 return Array.from({length:n},(_,i)=>{close+=.2+.6*Math.sin(i*.31)-.2*Math.sin(i*.17);return{
  date:dateFrom("2026-07-18",i),high:close+1.1,low:close-1,close,
  observedRawBarIdentity:"adx-"+i,sourceBarHash:(i.toString(16).padStart(64,"d")).slice(-64),
  symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,
  sourceFetchedAt:"2026-10-05T10:04:00.000Z",priceLimitConstrained:false};});
}
function adxReceipt(){
 const bars=adxBars();
 return {...baseReceipt(bars),formulaVersion:D03_ADX_FORMULA_VERSION,
  stateConstructionMode:"FULL_REPLAY",stateConstructionVersion:D03_ADX_STATE_CONSTRUCTION_VERSION,
  stateLineageId:H("3"),initializationAnchorDate:bars[0].date,anchorCertificationState:"CANONICAL_LINEAGE_ANCHOR_CERTIFIED",
  replayCertificationState:"REPLAY_EXACT",eligibleBarsFromAnchorToAsOf:bars.length};
}

const b1=bindD03ParentCutoffContinuityV0_2({parent,evidenceCut:cut,continuityReceipt:bbReceipt(),bindingCreatedAt:"2026-10-05T10:21:00.000Z"});
assert.equal(b1.status,"VALID");assert.equal(b1.bindingEligible,true);assert.equal(b1.receiptCreatedAfterParent,true);
const b2=bindD03ParentCutoffContinuityV0_2({parent:{...parent,captureGeneration:"GEN-B"},evidenceCut:cut,continuityReceipt:bbReceipt(),bindingCreatedAt:"2026-10-05T10:21:00.000Z"});
assert.notEqual(b1.bindingId,b2.bindingId);

const bb=evaluateBoundCutoffDerivedBollingerL3V0_3({parent,evidenceCut:cut,continuityReceipt:bbReceipt(),bindingCreatedAt:"2026-10-05T10:21:00.000Z"});
assert.equal(bb.status,"VALID");assert.equal(bb.l3EvidenceEligible,true);

const adx=evaluateBoundCutoffDerivedAdxL3V0_3({parent,evidenceCut:cut,continuityReceipt:adxReceipt(),bindingCreatedAt:"2026-10-05T10:22:00.000Z"});
assert.equal(adx.status,"VALID");assert.equal(adx.l3EvidenceEligible,true);

const noCutoff=bindD03ParentCutoffContinuityV0_2({parent:{...parent,decisionCutoffAt:null},evidenceCut:cut,continuityReceipt:bbReceipt()});
assert.equal(noCutoff.bindingEligible,false);assert.ok(noCutoff.reasons.includes("PARENT_DECISION_CUTOFF_NOT_PERSISTED"));

const lateCut=bindD03ParentCutoffContinuityV0_2({parent,evidenceCut:{...cut,evidenceCutoffAt:"2026-10-05T10:09:30.000Z"},continuityReceipt:bbReceipt()});
assert.equal(lateCut.bindingEligible,false);assert.ok(lateCut.reasons.includes("EVIDENCE_CUT_AFTER_PARENT"));

const wrongSymbol=bindD03ParentCutoffContinuityV0_2({parent,evidenceCut:cut,continuityReceipt:{...bbReceipt(),symbol:"2317"}});
assert.equal(wrongSymbol.bindingEligible,false);assert.ok(wrongSymbol.reasons.includes("SYMBOL_MISMATCH"));

const badDates=bbReceipt();badDates.expectedEligibleSymbolSessions=[...badDates.expectedEligibleSymbolSessions];badDates.expectedEligibleSymbolSessions[0]="2026-08-01";
const dateMismatch=bindD03ParentCutoffContinuityV0_2({parent,evidenceCut:cut,continuityReceipt:badDates});
assert.equal(dateMismatch.bindingEligible,false);assert.ok(dateMismatch.reasons.includes("ELIGIBLE_DATE_SET_MISMATCH"));

const earlyBinding=bindD03ParentCutoffContinuityV0_2({parent,evidenceCut:cut,continuityReceipt:bbReceipt(),bindingCreatedAt:"2026-10-05T10:19:00.000Z"});
assert.equal(earlyBinding.bindingEligible,false);assert.ok(earlyBinding.reasons.includes("BINDING_CREATED_BEFORE_RECEIPT"));

console.log(JSON.stringify({
 status:"PASS",
 validBindingId:b1.bindingId,
 crossGenerationBindingChanged:b1.bindingId!==b2.bindingId,
 postParentDerivedBollinger:bb.status,
 postParentDerivedAdx:adx.status,
 blocked:["missing decision cutoff","cut after decision cutoff","symbol mismatch","eligible date-set mismatch","binding before receipt"]
},null,2));
