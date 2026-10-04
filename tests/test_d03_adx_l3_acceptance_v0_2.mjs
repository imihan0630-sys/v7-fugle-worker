import assert from "node:assert/strict";
import {
  D03_ADX_FORMULA_VERSION,
  D03_ADX_STATE_CONSTRUCTION_VERSION,
  evaluateAdxL3ParentV0_2,
  reconcileAdxL3RunV0_2,
} from "../research/d03_adx_l3_acceptance_v0_2.mjs";

function dateFrom(start,i){
  const d=new Date(start+"T00:00:00Z");
  d.setUTCDate(d.getUTCDate()+i);
  return d.toISOString().slice(0,10);
}
function h(x){return String(x).padStart(64,"0").slice(-64).replace(/[^0-9a-f]/gi,"a");}
function bars(n=80,{constrainedIndex=null}={}){
  const out=[];
  let close=100;
  for(let i=0;i<n;i++){
    close += 0.18 + 0.7*Math.sin(i*0.31) - 0.28*Math.sin(i*0.13);
    const high=close+1.2+0.15*Math.sin(i*0.19);
    const low=close-1.1-0.12*Math.cos(i*0.17);
    out.push({
      date:dateFrom("2026-01-02",i),
      high,low,close,
      observedRawBarIdentity:"raw-"+i,
      symbolSessionVerified:true,
      technicalContinuity:true,
      corporateActionContinuityResolved:true,
      sourceFetchedAt:"2026-04-30T06:00:00Z",
      priceLimitConstrained:i===constrainedIndex,
      sourceBarHash:h((i+1).toString(16)),
    });
  }
  return out;
}
const parent={
  scanDate:"2026-05-01",
  captureGeneration:"gen-1",
  symbol:"2330",
  parentSnapshotHash:"a".repeat(64),
  knownAt:"2026-05-01T08:00:00Z",
};
function receipt(custom={}){
  const b=custom.bars||bars(80);
  return {
    symbol:"2330",
    status:"VALID",
    continuitySpace:"TECHNICAL_CONTINUITY",
    formulaVersion:D03_ADX_FORMULA_VERSION,
    continuityReceiptId:"cont-receipt-1",
    capturedAt:"2026-05-01T07:00:00Z",
    sourceFamilyVersion:"OFFICIAL_TW_CONTINUITY_V1",
    sourceHistoryHash:"b".repeat(64),
    rawHistoryAdmissionReceiptId:"raw-admission-1",
    symbolSessionContractVersion:"SYMBOL_SESSION_V1",
    sessionCalendarVersion:"TW_CALENDAR_V1",
    continuityEngineVersion:"TECHNICAL_CONTINUITY_V1",
    corporateActionRegistryVersion:"CA_REGISTRY_V1",
    continuityTransformHash:"c".repeat(64),
    receiptVersion:"CONTINUITY_RECEIPT_V1",
    stateConstructionMode:"FULL_REPLAY",
    stateConstructionVersion:D03_ADX_STATE_CONSTRUCTION_VERSION,
    stateLineageId:"d".repeat(64),
    cleanHistoryStartDate:b[0].date,
    initializationAnchorDate:b[0].date,
    anchorCertificationState:"CANONICAL_LINEAGE_ANCHOR_CERTIFIED",
    replayCertificationState:"REPLAY_EXACT",
    expectedEligibleSymbolSessions:b.map(x=>x.date),
    bars:b,
    eligibleBarsFromAnchorToAsOf:b.length,
    unresolvedMissingSessions:0,
    unresolvedRelevantEvents:0,
    pseudoBarsRejected:0,
    ...custom,
  };
}

const good=evaluateAdxL3ParentV0_2({parent,continuityReceipt:receipt()});
assert.equal(good.status,"VALID");
assert.equal(good.l3EvidenceEligible,true);
assert.equal(good.anchorCertificationState,"CANONICAL_LINEAGE_ANCHOR_CERTIFIED");
assert.ok(Number.isFinite(good.canonicalState.adx14));
assert.ok(/^[0-9a-f]{64}$/.test(good.replayInputHash));
assert.ok(/^[0-9a-f]{64}$/.test(good.canonicalStateHash));

const constrainedBars=bars(80,{constrainedIndex:55});
const constrained=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({status:"VALID_BUT_CONSTRAINED",bars:constrainedBars,expectedEligibleSymbolSessions:constrainedBars.map(x=>x.date),eligibleBarsFromAnchorToAsOf:constrainedBars.length})
});
assert.equal(constrained.status,"VALID_BUT_CONSTRAINED");
assert.equal(constrained.ordinaryInterpretationEligible,false);

const fakeLabel=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({sourceHistoryHash:"not-a-hash"})
});
assert.equal(fakeLabel.status,"DATA_BLOCKED");
assert.ok(fakeLabel.reasons.includes("SOURCE_HISTORY_HASH_INVALID"));

const noRawReceipt=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({rawHistoryAdmissionReceiptId:""})
});
assert.equal(noRawReceipt.status,"DATA_BLOCKED");
assert.ok(noRawReceipt.reasons.includes("RAW_HISTORY_ADMISSION_RECEIPT_MISSING"));

const badAnchorCert=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({anchorCertificationState:"SELF_DECLARED"})
});
assert.equal(badAnchorCert.status,"DATA_BLOCKED");
assert.ok(badAnchorCert.reasons.includes("CANONICAL_ANCHOR_NOT_CERTIFIED"));

const shiftedAnchor=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({cleanHistoryStartDate:"2025-12-01"})
});
assert.equal(shiftedAnchor.status,"DATA_BLOCKED");
assert.ok(shiftedAnchor.reasons.includes("FULL_REPLAY_ANCHOR_NOT_CLEAN_HISTORY_START"));

const badCount=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({eligibleBarsFromAnchorToAsOf:79})
});
assert.equal(badCount.status,"DATA_BLOCKED");
assert.ok(badCount.reasons.includes("ELIGIBLE_BAR_COUNT_FROM_ANCHOR_MISMATCH"));

const tooShortBars=bars(28);
const tooShort=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({
    bars:tooShortBars,
    expectedEligibleSymbolSessions:tooShortBars.map(x=>x.date),
    cleanHistoryStartDate:tooShortBars[0].date,
    initializationAnchorDate:tooShortBars[0].date,
    eligibleBarsFromAnchorToAsOf:tooShortBars.length,
  })
});
assert.equal(tooShort.status,"DATA_BLOCKED");
assert.ok(tooShort.reasons.includes("EXPECTED_REPLAY_SESSION_COUNT_LT_29"));

const local=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({stateConstructionMode:"LOCAL_WINDOW_BOOTSTRAP"})
});
assert.equal(local.status,"DATA_BLOCKED");
assert.ok(local.reasons.includes("STATE_CONSTRUCTION_MODE_NOT_FULL_REPLAY"));

const trusted=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({stateConstructionMode:"TRUSTED_PRIOR_STATE"})
});
assert.equal(trusted.status,"DATA_BLOCKED");
assert.ok(trusted.reasons.includes("TRUSTED_PRIOR_STATE_REQUIRES_SEPARATE_CERTIFIER"));

const late=evaluateAdxL3ParentV0_2({
  parent,
  continuityReceipt:receipt({capturedAt:"2026-05-01T09:00:00Z"})
});
assert.equal(late.status,"DATA_BLOCKED");
assert.ok(late.reasons.includes("CONTINUITY_CAPTURE_AFTER_PARENT"));

const unknown=evaluateAdxL3ParentV0_2({parent,continuityReceipt:null});
assert.equal(unknown.status,"UNKNOWN");

const parent2={...parent,symbol:"2317",parentSnapshotHash:"e".repeat(64)};
const unknown2=evaluateAdxL3ParentV0_2({parent:parent2,continuityReceipt:null});
const complete=reconcileAdxL3RunV0_2({expectedParents:[parent,parent2],attempts:[good,unknown2]});
assert.equal(complete.status,"COMPLETE");
assert.equal(complete.countsByStatus.UNKNOWN,1);

const incomplete=reconcileAdxL3RunV0_2({expectedParents:[parent,parent2],attempts:[good]});
assert.equal(incomplete.status,"INCOMPLETE");
assert.equal(incomplete.missingCount,1);

console.log(JSON.stringify({
  status:"PASS",
  validAdx:good.canonicalState.adx14,
  fakeFullReplayLabelBlocked:fakeLabel.status,
  uncertifiedAnchorBlocked:badAnchorCert.status,
  shiftedAnchorBlocked:shiftedAnchor.status,
  trustedPriorStateAccepted:false,
  completeWithUnknown:complete.status,
},null,2));
