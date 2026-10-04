import assert from "node:assert/strict";
import {
  buildRetestArrivalCohortEntry,
  classifyRetestArrival,
  buildFirstRetestResponseSnapshot,
  classifyCommonSupport,
  classifyEstimand
} from "./pattern_polarity_incrementality_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const breakout={eventId:"B1",confirmedAt:"2026-09-10",confirmed:true};
const salience={verified:true,roundPriceDistanceTicks:2};
const pre={asOf:"2026-09-10",breakoutExcessAtr:0.4};

const s1=()=>buildRetestArrivalCohortEntry({
  parentId:"P1",breakout,priorOppositeRoleCertified:true,
  originalRole:"RESISTANCE",candidateRole:"SUPPORT",
  salienceReceipt:salience,preBreakContext:pre
});

const s0=()=>buildRetestArrivalCohortEntry({
  parentId:"P0",breakout:{...breakout,eventId:"B0"},priorOppositeRoleCertified:false,
  candidateRole:"SUPPORT",salienceReceipt:salience,preBreakContext:pre
});

t("PI01 certified former-role case enters S1",()=>{
  const r=s1();
  assert.equal(r.status,"VALID");
  assert.equal(r.comparatorClass,"S1_CERTIFIED_FORMER_ROLE_BREAKOUT");
});

t("PI02 salient non-role case enters S0",()=>{
  const r=s0();
  assert.equal(r.status,"VALID");
  assert.equal(r.comparatorClass,"S0_SALIENT_NON_ROLE_BREAKOUT");
});

t("PI03 primary control requires salience verification",()=>{
  const r=buildRetestArrivalCohortEntry({
    parentId:"P0",breakout,priorOppositeRoleCertified:false,
    salienceReceipt:{verified:false},preBreakContext:pre
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"SALIENCE_RECEIPT_UNVERIFIED");
});

t("PI04 post-break path cannot enter E1 baseline",()=>{
  const r=buildRetestArrivalCohortEntry({
    parentId:"P1",breakout,priorOppositeRoleCertified:true,
    originalRole:"RESISTANCE",candidateRole:"SUPPORT",
    salienceReceipt:salience,preBreakContext:pre,
    postBreakPath:{maxDirectionalDisplacementAtr:4}
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"POST_BREAK_PATH_IN_BASELINE_PROHIBITED");
});

t("PI05 E1 cohort entry is created before retest is known",()=>{
  const r=s1();
  assert.equal(r.firstRetestKnownAtEntry,false);
  assert.equal(r.selectionReportRequired,true);
});

t("PI06 valid later retest is an arrival event",()=>{
  const r=classifyRetestArrival({
    cohortEntry:s1(),asOf:"2026-09-20",firstRetestOpportunityAt:"2026-09-15"
  });
  assert.equal(r.status,"FIRST_RETEST_ARRIVED");
});

t("PI07 cancellation before retest is not failed retest",()=>{
  const r=classifyRetestArrival({
    cohortEntry:s1(),asOf:"2026-09-12",
    cancelledBeforeRetest:true,cancelReason:"BREAKOUT_RECLAIMED"
  });
  assert.equal(r.status,"CANCELLED_BEFORE_RETEST");
  assert.equal(r.failedRetest,false);
});

t("PI08 study end without retest is right censoring",()=>{
  const r=classifyRetestArrival({
    cohortEntry:s1(),asOf:"2026-10-01",studyEnded:true
  });
  assert.equal(r.status,"RIGHT_CENSORED_NO_RETEST");
  assert.equal(r.failedRetest,false);
});

t("PI09 missing provenance remains data blocked",()=>{
  const r=classifyRetestArrival({
    cohortEntry:s1(),asOf:"2026-09-20",dataBlocked:true
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("PI10 E2 snapshot cannot exist before first retest arrival",()=>{
  const r=buildFirstRetestResponseSnapshot({
    cohortEntry:s1(),
    arrivalState:{status:"RETEST_NOT_YET_OBSERVED"},
    opportunity:{valid:false}
  });
  assert.equal(r.status,"NOT_E2_ELIGIBLE");
});

t("PI11 post-break path is explicitly mediator/selection state in E2",()=>{
  const arrival=classifyRetestArrival({
    cohortEntry:s1(),asOf:"2026-09-20",firstRetestOpportunityAt:"2026-09-15"
  });
  const r=buildFirstRetestResponseSnapshot({
    cohortEntry:s1(),arrivalState:arrival,
    opportunity:{valid:true,at:"2026-09-15"},
    postBreakPath:{complete:true,maxDirectionalDisplacementAtr:3,eligibleSessionsToRetest:3}
  });
  assert.equal(r.status,"VALID_E2_SNAPSHOT");
  assert.equal(r.postBreakPathRole,"MEDIATOR_OR_SELECTION_VARIABLE");
});

t("PI12 retest response cannot leak into predictor snapshot",()=>{
  const arrival=classifyRetestArrival({
    cohortEntry:s1(),asOf:"2026-09-20",firstRetestOpportunityAt:"2026-09-15"
  });
  const r=buildFirstRetestResponseSnapshot({
    cohortEntry:s1(),arrivalState:arrival,
    opportunity:{valid:true,at:"2026-09-15"},
    postBreakPath:{complete:true},
    responseOutcome:"BOUNCED"
  });
  assert.equal(r.responseOutcomeUsed,false);
  assert.equal(r.suppliedResponseOutcomeIgnored,true);
});

t("PI13 same causal case does not gain independent N in E2",()=>{
  const arrival=classifyRetestArrival({
    cohortEntry:s1(),asOf:"2026-09-20",firstRetestOpportunityAt:"2026-09-15"
  });
  const r=buildFirstRetestResponseSnapshot({
    cohortEntry:s1(),arrivalState:arrival,
    opportunity:{valid:true,at:"2026-09-15"},
    postBreakPath:{complete:true}
  });
  assert.equal(r.independentSample,false);
});

t("PI14 total estimand forbids causal reinterpretation after mediator adjustment",()=>{
  const total=classifyEstimand({adjustPostBreakPath:false});
  const direct=classifyEstimand({adjustPostBreakPath:true});
  assert.equal(total.status,"TOTAL_POLARITY_INCREMENT");
  assert.equal(direct.status,"PATH_CONDITIONAL_POLARITY_INCREMENT");
  assert.equal(direct.totalEffectClaimAllowed,false);
});

t("PI15 pre-break common-support failure prohibits extrapolation",()=>{
  const r=classifyCommonSupport({
    preBreakOverlap:true,salienceOverlap:false,volatilityLiquidityOverlap:true,
    regimeOverlap:true,constraintOverlap:true
  });
  assert.equal(r.status,"EXTRAPOLATION_PROHIBITED");
});

t("PI16 total estimand does not require post-break path matching",()=>{
  const r=classifyCommonSupport({
    preBreakOverlap:true,salienceOverlap:true,volatilityLiquidityOverlap:true,
    regimeOverlap:true,constraintOverlap:true,postBreakPathOverlap:false,
    estimand:"TOTAL_POLARITY_INCREMENT"
  });
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

t("PI17 path-conditional estimand requires post-break path support",()=>{
  const r=classifyCommonSupport({
    preBreakOverlap:true,salienceOverlap:true,volatilityLiquidityOverlap:true,
    regimeOverlap:true,constraintOverlap:true,postBreakPathOverlap:false,
    estimand:"PATH_CONDITIONAL_POLARITY_INCREMENT"
  });
  assert.equal(r.status,"EXTRAPOLATION_PROHIBITED");
  assert.equal(r.reason,"POST_BREAK_PATH_SUPPORT_FAILED");
});

t("PI18 first retest cannot predate breakout confirmation",()=>{
  const r=classifyRetestArrival({
    cohortEntry:s1(),asOf:"2026-09-20",firstRetestOpportunityAt:"2026-09-09"
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"FIRST_RETEST_CLOCK_INVALID");
});

console.log(`SUMMARY ${pass}/18 PASS`);
