import assert from "node:assert/strict";
import {
 classifyCurrentLocation,
 reconstructLifecycleFromCompleteBasis,
 compareLifecycleRepresentations,
 lifecycleRedundancyAssessment
} from "./pattern_lifecycle_redundancy_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const base={
 availableAirToParentLowerPct:0.02,
 distanceLocalToParentCenterPct:0.03,
 currentSignedCloseDistance:0.01,
 parentZoneAgeEligibleSessions:80,
 geometryRelationState:"LOCAL_BOUNDARY_OVERLAPS_PARENT_ZONE",
 eligibleBarsSinceBreak:5,
 observableBarsSinceBreak:5,
 constrainedBarsSinceBreak:0,
 maxFavorableExtension:0.04,
 maxAdverseExcursion:-0.01,
 cumulativeSignedDistance:0.06,
 localFirstBreakAt:"2026-09-20",
 firstParentZoneEntryAt:"2026-09-21",
 parentFirstBreakAt:"2026-09-22",
 parentFirstOrdinaryObservableAt:"2026-09-22",
 parentFirstPostBreakOutsideCloseAt:"2026-09-23",
 parentFirstReentryAt:null,
 parentFirstFailureAt:null,
 parentFirstReclaimAt:null
};

t("LR01 current favorable location classified",()=>{
 assert.equal(classifyCurrentLocation({signedCloseDistanceFromBoundary:0.01}),"OUTSIDE_FAVORABLE");
});

t("LR02 no break reconstructs no-break state",()=>{
 assert.equal(reconstructLifecycleFromCompleteBasis({currentLocationClass:"NONFAVORABLE_SIDE"}).state,"NO_BREAK_EVENT");
});

t("LR03 constrained break remains unresolved state",()=>{
 const r=reconstructLifecycleFromCompleteBasis({
  firstConfirmedBreakAt:"2026-09-22",constrainedPending:true,currentLocationClass:"OUTSIDE_FAVORABLE"
 });
 assert.equal(r.state,"BREAK_OBSERVED_CONSTRAINED");
});

t("LR04 break plus no reentry and outside => holding",()=>{
 const r=reconstructLifecycleFromCompleteBasis({
  firstConfirmedBreakAt:"2026-09-22",currentLocationClass:"OUTSIDE_FAVORABLE"
 });
 assert.equal(r.state,"HOLDING_OUTSIDE");
});

t("LR05 first reentry without reclaim => reentered",()=>{
 const r=reconstructLifecycleFromCompleteBasis({
  firstConfirmedBreakAt:"2026-09-22",firstReentryAt:"2026-09-24",currentLocationClass:"INSIDE_ZONE"
 });
 assert.equal(r.state,"REENTERED_ZONE");
});

t("LR06 failure dominates unreclaimed reentry",()=>{
 const r=reconstructLifecycleFromCompleteBasis({
  firstConfirmedBreakAt:"2026-09-22",firstReentryAt:"2026-09-24",firstFailureAt:"2026-09-25",
  currentLocationClass:"FAILED_SIDE"
 });
 assert.equal(r.state,"FAILED");
});

t("LR07 reclaimed path outside => reclaimed",()=>{
 const r=reconstructLifecycleFromCompleteBasis({
  firstConfirmedBreakAt:"2026-09-22",firstReentryAt:"2026-09-24",firstReclaimAt:"2026-09-25",
  currentLocationClass:"OUTSIDE_FAVORABLE"
 });
 assert.equal(r.state,"RECLAIMED");
});

t("LR08 same current geometry can hide different histories",()=>{
 const a={...base,compoundLifecycleState:"LOCAL_BREAK_PARENT_HOLDING_ABOVE"};
 const b={...base,
  parentFirstReentryAt:"2026-09-24",parentFirstReclaimAt:"2026-09-25",
  compoundLifecycleState:"LOCAL_BREAK_PARENT_REENTERED"
 };
 const r=compareLifecycleRepresentations(a,b);
 assert.equal(r.sameGeometry,true);
 assert.equal(r.sameCompletePath,false);
 assert.equal(r.interpretation,"PATH_MEMORY_NOT_CAPTURED_BY_GEOMETRY_ONLY");
});

t("LR09 same complete path cannot legitimately carry different lifecycle category",()=>{
 const a={...base,compoundLifecycleState:"LOCAL_BREAK_PARENT_HOLDING_ABOVE"};
 const b={...base,compoundLifecycleState:"LOCAL_BREAK_PARENT_FAILED"};
 const r=compareLifecycleRepresentations(a,b);
 assert.equal(r.sameCompletePath,true);
 assert.equal(r.sameLifecycle,false);
 assert.equal(r.interpretation,"SEMANTIC_CONTRADICTION_SAME_COMPLETE_PATH_DIFFERENT_CATEGORY");
});

t("LR10 same complete path same lifecycle is redundancy candidate",()=>{
 const a={...base,compoundLifecycleState:"LOCAL_BREAK_PARENT_HOLDING_ABOVE"};
 const b={...base,compoundLifecycleState:"LOCAL_BREAK_PARENT_HOLDING_ABOVE"};
 const r=compareLifecycleRepresentations(a,b);
 assert.equal(r.interpretation,"CATEGORY_DETERMINISTIC_OR_REDUNDANT_GIVEN_COMPLETE_PATH");
});

t("LR11 C0-only explicitly recognizes path-memory possibility",()=>{
 const r=lifecycleRedundancyAssessment({hasGeometryBasis:true,categoricalLifecycleAvailable:true});
 assert.equal(r.status,"C0_ONLY");
});

t("LR12 C2-complete requires flexible C2 comparator",()=>{
 const r=lifecycleRedundancyAssessment({
  hasGeometryBasis:true,hasContinuousPathBasis:true,hasCompleteClockBasis:true,categoricalLifecycleAvailable:true
 });
 assert.equal(r.status,"C2_COMPLETE");
 assert.match(r.claim,/FLEXIBLE_C2/);
});

console.log(`SUMMARY ${pass}/12 PASS`);
