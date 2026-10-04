import assert from "node:assert/strict";
import {
  D03_ADX_FORMULA_VERSION,
  D03_ADX_STATE_CONSTRUCTION_VERSION,
  evaluateAdxL3ParentV0_1,
  reconcileAdxL3RunV0_1,
} from "../research/d03_adx_l3_acceptance_v0_1.mjs";

function pad(n){return String(n).padStart(2,"0");}
function dateFrom(start,i){
  const d=new Date(start+"T00:00:00Z");
  d.setUTCDate(d.getUTCDate()+i);
  return d.toISOString().slice(0,10);
}
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
      symbolSessionVerified:true,
      technicalContinuity:true,
      corporateActionContinuityResolved:true,
      sourceFetchedAt:"2026-04-30T06:00:00Z",
      priceLimitConstrained:i===constrainedIndex,
      sourceBarHash:"bar-"+i,
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
    continuityReceiptId:"cont-1",
    capturedAt:"2026-05-01T07:00:00Z",
    stateConstructionMode:"FULL_REPLAY",
    stateConstructionVersion:D03_ADX_STATE_CONSTRUCTION_VERSION,
    stateLineageId:"lineage-1",
    sourceHistoryHash:"source-"+ "b".repeat(20),
    continuityTransformHash:"transform-"+ "c".repeat(20),
    initializationAnchorDate:b[0].date,
    replayCertificationState:"REPLAY_EXACT",
    expectedEligibleSymbolSessions:b.map(x=>x.date),
    bars:b,
    unresolvedMissingSessions:0,
    unresolvedRelevantEvents:0,
    ...custom,
  };
}

const good=evaluateAdxL3ParentV0_1({parent,continuityReceipt:receipt()});
assert.equal(good.status,"VALID");
assert.equal(good.l3EvidenceEligible,true);
assert.equal(good.stateConstructionMode,"FULL_REPLAY");
assert.equal(good.replayCertificationState,"REPLAY_EXACT");
assert.equal(good.replaySessionCount,80);
assert.ok(Number.isFinite(good.canonicalState.adx14));
assert.ok(/^[0-9a-f]{64}$/.test(good.replayInputHash));
assert.ok(/^[0-9a-f]{64}$/.test(good.canonicalStateHash));

const constrainedBars=bars(80,{constrainedIndex:55});
const constrained=evaluateAdxL3ParentV0_1({
  parent,
  continuityReceipt:receipt({status:"VALID_BUT_CONSTRAINED",bars:constrainedBars,expectedEligibleSymbolSessions:constrainedBars.map(x=>x.date)})
});
assert.equal(constrained.status,"VALID_BUT_CONSTRAINED");
assert.equal(constrained.l3EvidenceEligible,true);
assert.equal(constrained.ordinaryInterpretationEligible,false);

const tooShortBars=bars(28);
const tooShort=evaluateAdxL3ParentV0_1({
  parent,
  continuityReceipt:receipt({bars:tooShortBars,expectedEligibleSymbolSessions:tooShortBars.map(x=>x.date),initializationAnchorDate:tooShortBars[0].date})
});
assert.equal(tooShort.status,"DATA_BLOCKED");
assert.ok(tooShort.reasons.includes("EXPECTED_REPLAY_SESSION_COUNT_LT_29"));

const local=evaluateAdxL3ParentV0_1({
  parent,
  continuityReceipt:receipt({stateConstructionMode:"LOCAL_WINDOW_BOOTSTRAP"})
});
assert.equal(local.status,"DATA_BLOCKED");
assert.ok(local.reasons.includes("STATE_CONSTRUCTION_MODE_NOT_FULL_REPLAY"));

const trusted=evaluateAdxL3ParentV0_1({
  parent,
  continuityReceipt:receipt({stateConstructionMode:"TRUSTED_PRIOR_STATE"})
});
assert.equal(trusted.status,"DATA_BLOCKED");
assert.ok(trusted.reasons.includes("TRUSTED_PRIOR_STATE_REQUIRES_SEPARATE_CERTIFIER"));

const late=evaluateAdxL3ParentV0_1({
  parent,
  continuityReceipt:receipt({capturedAt:"2026-05-01T09:00:00Z"})
});
assert.equal(late.status,"DATA_BLOCKED");
assert.ok(late.reasons.includes("CONTINUITY_CAPTURE_AFTER_PARENT"));

const missingDateBars=bars(80);
missingDateBars.splice(30,1);
const missingDate=evaluateAdxL3ParentV0_1({
  parent,
  continuityReceipt:receipt({bars:missingDateBars,expectedEligibleSymbolSessions:bars(80).map(x=>x.date)})
});
assert.equal(missingDate.status,"DATA_BLOCKED");
assert.ok(missingDate.reasons.includes("BAR_COUNT_EXPECTED_COUNT_MISMATCH"));

const unresolved=evaluateAdxL3ParentV0_1({
  parent,
  continuityReceipt:receipt({unresolvedRelevantEvents:1})
});
assert.equal(unresolved.status,"DATA_BLOCKED");
assert.ok(unresolved.reasons.includes("UNRESOLVED_RELEVANT_EVENTS"));

const wrongHash=evaluateAdxL3ParentV0_1({
  parent,
  continuityReceipt:receipt({expectedCanonicalStateHash:"0".repeat(64)})
});
assert.equal(wrongHash.status,"DATA_BLOCKED");
assert.ok(wrongHash.reasons.includes("EXPECTED_CANONICAL_STATE_HASH_MISMATCH"));

const unknown=evaluateAdxL3ParentV0_1({parent,continuityReceipt:null});
assert.equal(unknown.status,"UNKNOWN");

const parent2={...parent,symbol:"2317",parentSnapshotHash:"d".repeat(64)};
const unknown2=evaluateAdxL3ParentV0_1({parent:parent2,continuityReceipt:null});
const complete=reconcileAdxL3RunV0_1({expectedParents:[parent,parent2],attempts:[good,unknown2]});
assert.equal(complete.status,"COMPLETE");
assert.equal(complete.expectedAttemptCount,2);
assert.equal(complete.persistedAttemptCount,2);
assert.equal(complete.countsByStatus.VALID,1);
assert.equal(complete.countsByStatus.UNKNOWN,1);

const incomplete=reconcileAdxL3RunV0_1({expectedParents:[parent,parent2],attempts:[good]});
assert.equal(incomplete.status,"INCOMPLETE");
assert.equal(incomplete.missingCount,1);

const duplicate=reconcileAdxL3RunV0_1({expectedParents:[parent],attempts:[good,good]});
assert.equal(duplicate.status,"INCOMPLETE");
assert.equal(duplicate.duplicateCount,1);

console.log(JSON.stringify({
  status:"PASS",
  validAdx:good.canonicalState.adx14,
  constrainedStatus:constrained.status,
  fullReplayOnly:true,
  trustedPriorStateAccepted:false,
  runCompleteWithUnknown:complete.status,
},null,2));
