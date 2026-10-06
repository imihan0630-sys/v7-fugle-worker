import assert from "node:assert/strict";
import {
  classifyFeeRegime,
  classifyExecutionStyle,
  classifyOrderLifecycle,
  feeTimingGuard,
  realizedExecutionCostGuard,
  foreignMakerTakerTransferGuard,
  buildExecutionSelectionComparator,
  denominatorAudit,
  informationLineage
} from "./pattern_execution_selection_fee_economics_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("EF01 verified local maker-taker regime requires local receipt",()=>{
  const r=classifyFeeRegime({venueReceiptVerified:true,makerTakerProgramVerified:true});
  assert.equal(r.state,"VENUE_MAKER_TAKER_REGIME_VERIFIED");
});

t("EF02 verified non-maker-taker local regime remains separate",()=>{
  const r=classifyFeeRegime({venueReceiptVerified:true,nonMakerTakerVerified:true});
  assert.equal(r.state,"VENUE_FEE_REGIME_VERIFIED_NON_MAKER_TAKER");
});

t("EF03 broker commission alone does not prove maker-taker",()=>{
  const r=classifyFeeRegime({brokerCommissionKnown:true});
  assert.equal(r.state,"BROKER_COMMISSION_ONLY_KNOWN");
});

t("EF04 unknown fee regime stays unknown",()=>{
  assert.equal(classifyFeeRegime({}).state,"FEE_REGIME_UNKNOWN");
});

t("EF05 no real order cannot receive verified passive execution",()=>{
  const r=classifyExecutionStyle({realOrderSubmitted:false,passiveVerified:true});
  assert.equal(r.state,"EXECUTION_STYLE_UNKNOWN");
  assert.equal(r.realExecution,false);
});

t("EF06 real passive execution can be verified",()=>{
  const r=classifyExecutionStyle({realOrderSubmitted:true,passiveVerified:true});
  assert.equal(r.state,"PASSIVE_EXECUTION_VERIFIED");
});

t("EF07 aggressive execution remains a separate state",()=>{
  const r=classifyExecutionStyle({realOrderSubmitted:true,aggressiveVerified:true});
  assert.equal(r.state,"AGGRESSIVE_EXECUTION_VERIFIED");
});

t("EF08 mixed or partial execution is not collapsed",()=>{
  const r=classifyExecutionStyle({realOrderSubmitted:true,partialOrMixed:true});
  assert.equal(r.state,"MIXED_OR_PARTIAL_EXECUTION");
});

t("EF09 no-order opportunity remains in denominator",()=>{
  const r=classifyOrderLifecycle({realOrderSubmitted:false});
  assert.equal(r.state,"NO_ORDER_SUBMITTED");
  assert.equal(r.denominatorEligible,true);
});

t("EF10 cancelled passive opportunity remains in denominator",()=>{
  const r=classifyOrderLifecycle({realOrderSubmitted:true,cancelled:true,submittedQty:100,filledQty:0});
  assert.equal(r.state,"CANCELLED");
  assert.equal(r.denominatorEligible,true);
});

t("EF11 partial fill remains explicit",()=>{
  const r=classifyOrderLifecycle({realOrderSubmitted:true,submittedQty:100,filledQty:40});
  assert.equal(r.state,"PARTIAL");
});

t("EF12 unfilled study-end case is not silently dropped",()=>{
  const r=classifyOrderLifecycle({realOrderSubmitted:true,submittedQty:100,filledQty:0,studyEnded:true});
  assert.equal(r.state,"UNFILLED_STUDY_END");
});

t("EF13 fee schedule must be effective and known by freeze",()=>{
  const r=feeTimingGuard({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    feeKnownAt:"2026-10-01T00:00:00+08:00",
    scheduleEffectiveAt:"2026-10-01T00:00:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"BASELINE_FEE_SCHEDULE_AVAILABLE");
});

t("EF14 later fee schedule is post-hoc",()=>{
  const r=feeTimingGuard({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    feeKnownAt:"2026-10-01T00:00:00+08:00",
    scheduleEffectiveAt:"2026-10-07T00:00:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("EF15 realized cost after freeze is post-treatment",()=>{
  const r=realizedExecutionCostGuard({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    realizedCostKnownAt:"2026-10-06T10:05:00+08:00"
  });
  assert.equal(r.status,"POST_TREATMENT_REALIZED_COST");
  assert.equal(r.baselineEligible,false);
});

t("EF16 foreign maker-taker evidence cannot be imported without local proof",()=>{
  const r=foreignMakerTakerTransferGuard({localVenueProgramVerified:false,foreignEvidenceOnly:true});
  assert.equal(r.status,"PROHIBITED");
});

t("EF17 generic and zone execution-selection comparators are non-independent",()=>{
  const g0=buildExecutionSelectionComparator({nearFrozenZone:false,executionContextMatched:true,feeContextMatched:true});
  const g1=buildExecutionSelectionComparator({nearFrozenZone:true,executionContextMatched:true,feeContextMatched:true});
  assert.equal(g0.independentVote,false);
  assert.equal(g1.independentVote,false);
});

t("EF18 completed fills cannot define the denominator",()=>{
  const d=denominatorAudit([
    {state:"FILLED"},
    {state:"CANCELLED"},
    {state:"UNFILLED_STUDY_END"},
    {state:"NO_ORDER_SUBMITTED"}
  ]);
  assert.equal(d.totalOpportunities,4);
  assert.equal(d.completedFillOnlyDenominatorAllowed,false);
  assert.equal(d.unfilledMayBeDropped,false);
});

t("EF19 multiple fee/execution receipts remain one evidence family",()=>{
  const r=informationLineage({
    parentDecisionId:"P1",
    receipts:["zone","execution-style","fee","fill","queue"]
  });
  assert.equal(r.rawReceiptCount,5);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("EF20 rejected order remains an opportunity state",()=>{
  const r=classifyOrderLifecycle({realOrderSubmitted:true,rejected:true});
  assert.equal(r.state,"ORDER_REJECTED");
  assert.equal(r.denominatorEligible,true);
});

console.log(`SUMMARY ${pass}/20 PASS`);
