import assert from "node:assert/strict";
import {
  buildFlipEligibility,
  classifyFirstFlipTestOpportunity,
  cancelFlipCandidateBeforeTest,
  classifyPolarityComparator,
  buildRoleEpisodeAge
} from "./pattern_role_reversal_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const baseBreak={eventId:"B1",direction:"UP",confirmedAt:"2026-09-10",confirmed:true};

t("RR01 resistance plus confirmed upward breakout creates support candidate",()=>{
  const r=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak
  });
  assert.equal(r.status,"CROSS_CONFIRMED_FLIP_ELIGIBLE");
  assert.equal(r.candidateRole,"SUPPORT");
});

t("RR02 support plus confirmed downward breakdown creates resistance candidate",()=>{
  const r=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"SUPPORT",
    breakout:{eventId:"B2",direction:"DOWN",confirmedAt:"2026-09-10",confirmed:true}
  });
  assert.equal(r.candidateRole,"RESISTANCE");
});

t("RR03 wrong crossing direction is not role-reversal eligible",()=>{
  const r=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",
    breakout:{eventId:"B3",direction:"DOWN",confirmedAt:"2026-09-10",confirmed:true}
  });
  assert.equal(r.status,"NOT_ELIGIBLE");
  assert.equal(r.reason,"ROLE_DIRECTION_MISMATCH");
});

t("RR04 unconfirmed crossing cannot create flip candidate",()=>{
  const r=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",
    breakout:{...baseBreak,confirmed:false}
  });
  assert.equal(r.reason,"CROSSING_NOT_CONFIRMED");
});

t("RR05 role reversal keeps same structural root",()=>{
  const r=buildFlipEligibility({
    structuralRootId:"ROOT-X",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak
  });
  assert.equal(r.structuralRootId,"ROOT-X");
  assert.equal(r.createsNewRoot,false);
});

t("RR06 role episode clock starts at breakout confirmation, not later bounce",()=>{
  const r=buildRoleEpisodeAge({breakoutConfirmedOrdinal:100,asOfOrdinal:106});
  assert.equal(r.roleEpisodeAgeEligibleSessions,6);
  assert.equal(r.startsAtBreakoutConfirmation,true);
});

t("RR07 first retest eligibility does not consume outcome",()=>{
  const c=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak
  });
  const r=classifyFirstFlipTestOpportunity({
    flipCandidate:c,
    opportunity:{valid:true,at:"2026-09-15",approachSide:"ABOVE",observedBounce:true}
  });
  assert.equal(r.status,"FIRST_FLIP_TEST_OPPORTUNITY");
  assert.equal(r.firstRetestOutcomeUsed,false);
  assert.equal(r.outcomeJoinAllowed,false);
});

t("RR08 resistance-to-support retest must approach from above",()=>{
  const c=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak
  });
  const r=classifyFirstFlipTestOpportunity({
    flipCandidate:c,
    opportunity:{valid:true,at:"2026-09-15",approachSide:"BELOW"}
  });
  assert.equal(r.status,"NOT_OPPOSITE_SIDE_RETEST");
  assert.equal(r.expectedApproachSide,"ABOVE");
});

t("RR09 support-to-resistance retest must approach from below",()=>{
  const c=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"SUPPORT",
    breakout:{eventId:"B2",direction:"DOWN",confirmedAt:"2026-09-10",confirmed:true}
  });
  const r=classifyFirstFlipTestOpportunity({
    flipCandidate:c,
    opportunity:{valid:true,at:"2026-09-15",approachSide:"BELOW"}
  });
  assert.equal(r.status,"FIRST_FLIP_TEST_OPPORTUNITY");
});

t("RR10 no valid retest opportunity cannot become pseudo failure",()=>{
  const c=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak
  });
  const r=classifyFirstFlipTestOpportunity({flipCandidate:c,opportunity:{valid:false}});
  assert.equal(r.status,"NO_VALID_TEST_OPPORTUNITY");
  assert.equal(r.pseudoFailureAllowed,false);
});

t("RR11 reclaim before first test cancels candidate but is not failed retest",()=>{
  const c=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak
  });
  const r=cancelFlipCandidateBeforeTest({flipCandidate:c,breakoutLifecycleStateAsOf:"RECLAIMED"});
  assert.equal(r.status,"FLIP_CANDIDATE_CANCELLED_BEFORE_TEST");
  assert.equal(r.failedRetest,false);
});

t("RR12 constrained crossing remains visible rather than silently pooled",()=>{
  const r=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak,
    constraintState:"PRICE_LIMIT_CONSTRAINED"
  });
  assert.equal(r.status,"FLIP_ELIGIBLE_CONSTRAINED");
  assert.equal(r.constraintState,"PRICE_LIMIT_CONSTRAINED");
});

t("RR13 constrained first test has explicit state",()=>{
  const c=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak
  });
  const r=classifyFirstFlipTestOpportunity({
    flipCandidate:c,
    opportunity:{valid:true,at:"2026-09-15",approachSide:"ABOVE",constraintState:"GAP_CONSTRAINED"}
  });
  assert.equal(r.status,"FLIP_TEST_OPPORTUNITY_CONSTRAINED");
});

t("RR14 generic breakout-retest control and former-role candidate are distinct",()=>{
  const g0=classifyPolarityComparator({priorOppositeRoleCertified:false,genericBreakoutContextVerified:true});
  const g1=classifyPolarityComparator({priorOppositeRoleCertified:true,genericBreakoutContextVerified:true});
  assert.equal(g0.status,"G0_GENERIC_BREAKOUT_RETEST");
  assert.equal(g1.status,"G1_FORMER_ROLE_POLARITY_CANDIDATE");
});

t("RR15 polarity comparator does not create independent vote",()=>{
  const r=classifyPolarityComparator({priorOppositeRoleCertified:true,genericBreakoutContextVerified:true});
  assert.equal(r.independentVote,false);
});

t("RR16 first retest timestamp must be after crossing",()=>{
  const c=buildFlipEligibility({
    structuralRootId:"R1",structuralVersionId:"V1",originalRole:"RESISTANCE",breakout:baseBreak
  });
  const r=classifyFirstFlipTestOpportunity({
    flipCandidate:c,
    opportunity:{valid:true,at:"2026-09-10",approachSide:"ABOVE"}
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"TEST_CLOCK_INVALID");
});

console.log(`SUMMARY ${pass}/16 PASS`);
