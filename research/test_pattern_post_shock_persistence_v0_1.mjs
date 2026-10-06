import assert from "node:assert/strict";
import {
  validateHorizonFamily,
  buildShockReference,
  displacementRetention,
  classifyPostShockPath,
  classifyClockOrder,
  buildInformationLineage
} from "./pattern_post_shock_persistence_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const shockReceipt={valid:true,replaySafe:true,shockAt:"2026-10-01T10:00:00+08:00"};
const ref=buildShockReference({
  shockReceipt,
  preShockReference:{valid:true,type:"MIDQUOTE",price:100},
  shockObservedPrice:110
});

t("PS01 valid shock reference preserves pre-shock and shock prices",()=>{
  assert.equal(ref.status,"VALID");
  assert.equal(ref.shockDisplacementPrice,10);
});

t("PS02 zero shock displacement cannot define retention ratio",()=>{
  const z=buildShockReference({
    shockReceipt,
    preShockReference:{valid:true,type:"MIDQUOTE",price:100},
    shockObservedPrice:100
  });
  const r=displacementRetention({shockReference:z,followupPrice:101});
  assert.equal(r.status,"UNKNOWN");
});

t("PS03 retention ratio is descriptive and has no permanent threshold",()=>{
  const r=displacementRetention({shockReference:ref,followupPrice:106});
  assert.equal(r.displacementRetentionRatio,0.6);
  assert.equal(r.thresholdedPermanentStateDefined,false);
});

t("PS04 one-window snapback without zone test is not structural rejection",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true,snapbackObserved:true}
  });
  assert.equal(r.status,"IMMEDIATE_SNAPBACK_CANDIDATE");
  assert.equal(r.persistentStructuralClaimAllowed,false);
});

t("PS05 retained new level without zone test is price-discovery candidate",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true,newLevelRetentionObserved:true}
  });
  assert.equal(r.status,"PRICE_DISCOVERY_COMPLETION_CANDIDATE");
});

t("PS06 transaction-price snapback without midquote control is incomplete",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    transactionPriceReceipt:{snapbackObserved:true}
  });
  assert.equal(r.status,"TRANSACTION_SNAPBACK_MICROSTRUCTURE_CONTROL_INCOMPLETE");
});

t("PS07 last-trade snapback with stable midquote is microstructure compatible",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    transactionPriceReceipt:{snapbackObserved:true},
    midquoteReceipt:{valid:true,replaySafe:true,snapbackObserved:false}
  });
  assert.equal(r.status,"MICROSTRUCTURE_BOUNCE_COMPATIBLE");
});

t("PS08 zone test requires predictor freeze before response",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    firstZoneTestReceipt:{valid:true,predictorFreezeBeforeResponse:false,rejectionCandidate:true}
  });
  assert.equal(r.status,"NOT_EVALUABLE");
  assert.equal(r.reason,"ZONE_TEST_LOOKAHEAD_RISK");
});

t("PS09 first rejection without later persistence is transient",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    firstZoneTestReceipt:{valid:true,predictorFreezeBeforeResponse:true,rejectionCandidate:true}
  });
  assert.equal(r.status,"TRANSIENT_ZONE_REJECTION_CANDIDATE");
});

t("PS10 rejection retained across frozen followups is persistent candidate",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    firstZoneTestReceipt:{valid:true,predictorFreezeBeforeResponse:true,rejectionCandidate:true},
    persistenceReceipts:[
      {complete:true,replaySafe:true,rejectionOrientationRetained:true},
      {complete:true,replaySafe:true,rejectionOrientationRetained:true}
    ]
  });
  assert.equal(r.status,"PERSISTENT_STRUCTURAL_REJECTION_CANDIDATE");
  assert.equal(r.alphaClaimAllowed,false);
});

t("PS11 persistence failure keeps transient classification",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    firstZoneTestReceipt:{valid:true,predictorFreezeBeforeResponse:true,rejectionCandidate:true},
    persistenceReceipts:[
      {complete:true,replaySafe:true,rejectionOrientationRetained:true},
      {complete:true,replaySafe:true,rejectionOrientationRetained:false}
    ]
  });
  assert.equal(r.status,"TRANSIENT_ZONE_REJECTION_CANDIDATE");
});

t("PS12 repeated shock contamination blocks single-shock persistence story",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    repeatedShockReceipt:{interveningShock:true},
    firstZoneTestReceipt:{valid:true,predictorFreezeBeforeResponse:true,rejectionCandidate:true}
  });
  assert.equal(r.status,"REPEATED_SHOCK_OR_MIXED_MECHANISM");
});

t("PS13 new shock inside persistence receipts also contaminates",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    firstZoneTestReceipt:{valid:true,predictorFreezeBeforeResponse:true,rejectionCandidate:true},
    persistenceReceipts:[
      {complete:true,replaySafe:true,rejectionOrientationRetained:true,newShock:true}
    ]
  });
  assert.equal(r.status,"REPEATED_SHOCK_OR_MIXED_MECHANISM");
});

t("PS14 continuation through zone is separate from rejection",()=>{
  const r=classifyPostShockPath({
    shockReference:ref,
    immediateRepairReceipt:{complete:true},
    firstZoneTestReceipt:{valid:true,predictorFreezeBeforeResponse:true,continuationThroughZone:true}
  });
  assert.equal(r.status,"SHOCK_CONTINUATION_THROUGH_ZONE");
});

t("PS15 horizon family must be frozen before outcome",()=>{
  const r=validateHorizonFamily({
    followupHorizonFamilyId:"HF1",
    horizonRegistryFrozenAt:"2026-09-30T00:00:00+08:00",
    outcomeInspectionAt:"2026-10-02T00:00:00+08:00",
    horizons:[{id:"H1"},{id:"H2"}]
  });
  assert.equal(r.status,"VALID");
});

t("PS16 post-outcome horizon family mutation is prohibited",()=>{
  const r=validateHorizonFamily({
    followupHorizonFamilyId:"HF1",
    horizonRegistryFrozenAt:"2026-09-30T00:00:00+08:00",
    outcomeInspectionAt:"2026-10-02T00:00:00+08:00",
    horizons:[{id:"H1"}],
    familyChangedAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"POST_OUTCOME_HORIZON_FAMILY_MUTATION");
});

t("PS17 deleting failed horizons after outcomes is prohibited",()=>{
  const r=validateHorizonFamily({
    followupHorizonFamilyId:"HF1",
    horizonRegistryFrozenAt:"2026-09-30T00:00:00+08:00",
    outcomeInspectionAt:"2026-10-02T00:00:00+08:00",
    horizons:[{id:"H1"}],
    horizonsRemovedAfterOutcome:true
  });
  assert.equal(r.reason,"POST_OUTCOME_HORIZON_REMOVAL");
});

t("PS18 T0/T1/T2/T3 clocks must be ordered",()=>{
  const r=classifyClockOrder({
    shockAt:"2026-10-01T10:00:00+08:00",
    immediateRepairEndAt:"2026-10-01T10:05:00+08:00",
    firstZoneTestOpportunityAt:"2026-10-01T10:15:00+08:00",
    persistenceAts:["2026-10-01T10:30:00+08:00","2026-10-01T11:00:00+08:00"]
  });
  assert.equal(r.status,"VALID");
});

t("PS19 out-of-order persistence clock fails closed",()=>{
  const r=classifyClockOrder({
    shockAt:"2026-10-01T10:00:00+08:00",
    immediateRepairEndAt:"2026-10-01T10:05:00+08:00",
    firstZoneTestOpportunityAt:"2026-10-01T10:15:00+08:00",
    persistenceAts:["2026-10-01T10:10:00+08:00"]
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"T3_CLOCK_INVALID");
});

t("PS20 multiple path views remain one default evidence family",()=>{
  const r=buildInformationLineage({
    pricePathRepresentationCount:5,
    directMicrostructurePrimitivePresent:true
  });
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

console.log(`SUMMARY ${pass}/20 PASS`);
