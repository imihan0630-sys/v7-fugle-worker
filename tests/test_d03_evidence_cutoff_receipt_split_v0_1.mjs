import assert from "node:assert/strict";
import {
  evaluateEvidenceCutoffReceiptSplitV0_1,
  evaluateCutoffDerivedBollingerL3V0_3,
  evaluateCutoffDerivedAdxL3V0_3,
} from "../research/d03_evidence_cutoff_receipt_split_v0_1.mjs";
import {D03_BOLLINGER_FORMULA_VERSION} from "../research/d03_bollinger_l3_acceptance_v0_2.mjs";
import {
  D03_ADX_FORMULA_VERSION,
  D03_ADX_STATE_CONSTRUCTION_VERSION,
} from "../research/d03_adx_l3_acceptance_v0_2.mjs";

const H=c=>String(c).repeat(64).slice(0,64);
function dateFrom(start,i){const d=new Date(start+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);}
const parent={scanDate:"2026-10-05",captureGeneration:"GEN-1",symbol:"2330",parentSnapshotHash:H("a"),knownAt:"2026-10-05T10:10:00.000Z"};
const cut={
  evidenceCutId:"CUT-20261005-A",
  evidenceCutoffAt:"2026-10-05T10:05:00.000Z",
  scope:"MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE",
  noRevisionGapThroughCut:true,
  symbolSessionCompletenessCertified:true,
  queryTruncated:false,
  budgetExceeded:false,
  unknownRequiredLaneCount:0,
  lateDiscoveredPreCutVersionCount:0,
  sourceCutManifestHash:H("b"),
  expectedVersionKeys:["V1","V2"],
  observedVersionKeys:["V1","V2"],
};

function bbBars(){
 return Array.from({length:20},(_,i)=>({
   date:dateFrom("2026-09-16",i),
   close:100+i*0.7+Math.sin(i*.3),
   observedRawBarIdentity:"raw-"+i,
   sourceBarHash:(i.toString(16).padStart(64,"c")).slice(-64),
   symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,
   sourceFetchedAt:"2026-10-05T10:04:00.000Z",priceLimitConstrained:false,
 }));
}
function bbReceipt(custom={}){
 const bars=custom.bars||bbBars();
 return {
   symbol:"2330",status:"VALID",continuitySpace:"TECHNICAL_CONTINUITY",
   formulaVersion:D03_BOLLINGER_FORMULA_VERSION,stdDefinition:"POPULATION",
   continuityReceiptId:"CONT-BB-1",receiptCreatedAt:"2026-10-05T10:20:00.000Z",
   evidenceCutId:cut.evidenceCutId,derivedOnlyFromEvidenceCut:true,postCutSourceFactCount:0,
   transformInputManifestHash:cut.sourceCutManifestHash,
   sourceFamilyVersion:"OFFICIAL_TW_CONTINUITY_V1",sourceHistoryHash:H("d"),
   rawHistoryAdmissionReceiptId:"RAW-1",symbolSessionContractVersion:"SYMBOL_SESSION_V1",
   sessionCalendarVersion:"TW_CAL_V1",continuityEngineVersion:"CONT_ENGINE_V1",
   corporateActionRegistryVersion:"CA_REG_V1",continuityTransformHash:H("e"),
   receiptVersion:"CONT_V3",cleanHistoryStartDate:bars[0].date,
   expectedEligibleSymbolSessions:bars.map(x=>x.date),expectedEligibleSymbolSessionCount:20,
   observedRawBars:20,continuityBars:20,bars,
   unresolvedMissingSessions:0,unresolvedRelevantEvents:0,pseudoBarsRejected:0,
   ...custom,
 };
}

const timing=evaluateEvidenceCutoffReceiptSplitV0_1({parent,evidenceCut:cut,continuityReceipt:bbReceipt()});
assert.equal(timing.status,"VALID_EVIDENCE_CUTOFF_SPLIT");
assert.equal(timing.eligible,true);
assert.equal(timing.receiptCreatedAfterParent,true);

const bb=evaluateCutoffDerivedBollingerL3V0_3({parent,evidenceCut:cut,continuityReceipt:bbReceipt()});
assert.equal(bb.status,"VALID");
assert.equal(bb.l3EvidenceEligible,true);
assert.equal(bb.timing.receiptCreatedAfterParent,true);

for(const [name,evidencePatch,receiptPatch,reason] of [
 ["late cut",{evidenceCutoffAt:"2026-10-05T10:11:00.000Z"},{}, "EVIDENCE_CUT_AFTER_PARENT"],
 ["revision gap",{noRevisionGapThroughCut:false},{}, "NO_REVISION_GAP_THROUGH_CUT_UNPROVEN"],
 ["late discovered",{lateDiscoveredPreCutVersionCount:1},{}, "LATE_DISCOVERED_PRE_CUT_VERSION"],
 ["wrong cut",{}, {evidenceCutId:"OTHER"}, "RECEIPT_EVIDENCE_CUT_ID_MISMATCH"],
 ["post cut fact",{}, {postCutSourceFactCount:1}, "POST_CUT_SOURCE_FACT_PRESENT"],
 ["wrong manifest",{}, {transformInputManifestHash:H("f")}, "TRANSFORM_INPUT_MANIFEST_CUT_MISMATCH"],
]){
 const out=evaluateEvidenceCutoffReceiptSplitV0_1({
   parent,evidenceCut:{...cut,...evidencePatch},continuityReceipt:bbReceipt(receiptPatch)
 });
 assert.equal(out.eligible,false,name);
 assert.ok(out.reasons.includes(reason),name+" reason");
}

const afterCutBars=bbBars();afterCutBars[4]={...afterCutBars[4],sourceFetchedAt:"2026-10-05T10:06:00.000Z"};
const afterCut=evaluateEvidenceCutoffReceiptSplitV0_1({
 parent,evidenceCut:cut,continuityReceipt:bbReceipt({bars:afterCutBars})
});
assert.equal(afterCut.eligible,false);
assert.ok(afterCut.reasons.includes("BAR_SOURCE_AFTER_EVIDENCE_CUT"));

function adxBars(n=80){
 let close=100;
 return Array.from({length:n},(_,i)=>{
   close+=.2+.6*Math.sin(i*.31)-.25*Math.sin(i*.13);
   return {
     date:dateFrom("2026-07-18",i),
     high:close+1.2,low:close-1.1,close,
     observedRawBarIdentity:"adx-raw-"+i,
     sourceBarHash:(i.toString(16).padStart(64,"d")).slice(-64),
     symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,
     sourceFetchedAt:"2026-10-05T10:04:00.000Z",priceLimitConstrained:false,
   };
 });
}
function adxReceipt(){
 const bars=adxBars();
 return {
   symbol:"2330",status:"VALID",continuitySpace:"TECHNICAL_CONTINUITY",
   formulaVersion:D03_ADX_FORMULA_VERSION,continuityReceiptId:"CONT-ADX-1",
   receiptCreatedAt:"2026-10-05T10:21:00.000Z",evidenceCutId:cut.evidenceCutId,
   derivedOnlyFromEvidenceCut:true,postCutSourceFactCount:0,transformInputManifestHash:cut.sourceCutManifestHash,
   sourceFamilyVersion:"OFFICIAL_TW_CONTINUITY_V1",sourceHistoryHash:H("1"),
   rawHistoryAdmissionReceiptId:"RAW-ADX-1",symbolSessionContractVersion:"SYMBOL_SESSION_V1",
   sessionCalendarVersion:"TW_CAL_V1",continuityEngineVersion:"CONT_ENGINE_V1",
   corporateActionRegistryVersion:"CA_REG_V1",continuityTransformHash:H("2"),receiptVersion:"CONT_V3",
   stateConstructionMode:"FULL_REPLAY",stateConstructionVersion:D03_ADX_STATE_CONSTRUCTION_VERSION,
   stateLineageId:H("3"),cleanHistoryStartDate:bars[0].date,initializationAnchorDate:bars[0].date,
   anchorCertificationState:"CANONICAL_LINEAGE_ANCHOR_CERTIFIED",replayCertificationState:"REPLAY_EXACT",
   expectedEligibleSymbolSessions:bars.map(x=>x.date),bars,eligibleBarsFromAnchorToAsOf:bars.length,
   unresolvedMissingSessions:0,unresolvedRelevantEvents:0,pseudoBarsRejected:0,
 };
}
const adx=evaluateCutoffDerivedAdxL3V0_3({parent,evidenceCut:cut,continuityReceipt:adxReceipt()});
assert.equal(adx.status,"VALID");
assert.equal(adx.l3EvidenceEligible,true);
assert.equal(adx.timing.receiptCreatedAfterParent,true);

console.log(JSON.stringify({
 status:"PASS",
 validPostParentDerivedBollinger:bb.status,
 validPostParentDerivedAdx:adx.status,
 timingIdentityHash:timing.timingIdentityHash,
 blocked:["late cut","revision gap","late discovered pre-cut version","wrong cut id","post-cut fact","manifest mismatch","bar after cut"],
},null,2));
