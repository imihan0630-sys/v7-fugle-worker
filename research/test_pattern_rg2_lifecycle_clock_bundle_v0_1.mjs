import assert from "node:assert/strict";
import {buildRg2LifecycleClockBundle} from "./pattern_rg2_lifecycle_clock_bundle_v0_1.mjs";
let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const bar=(date,close,o={})=>({
 date,open:close,high:close+1,low:close-1,close,
 eligibleSymbolSession:true,symbolSessionVerified:true,technicalContinuityVerified:true,
 corporateActionContinuityResolved:true,priceLimitConstrained:false,...o
});
const dates=["2026-10-01","2026-10-02","2026-10-03","2026-10-05","2026-10-06","2026-10-07","2026-10-08"];
const input=()=>({
 asOf:"2026-10-08",relationEpisodeKey:"REL1",localFirstBreakAt:"2026-10-01",
 semanticSpaceId:"TECHNICAL_CONTINUITY",continuityReceiptId:"CR1",
 sessionCalendarVersion:"CAL1",symbolSessionContractVersion:"SS1",continuityEngineVersion:"CE1",
 unresolvedMissingSessions:0,expectedEligibleSessionDates:dates,
 parentBoundary:{zoneId:"M1",zoneVersion:1,lower:110,upper:112},
 bars:[
  bar("2026-10-01",105),bar("2026-10-02",111),
  bar("2026-10-03",113),bar("2026-10-05",114),
  bar("2026-10-06",111),bar("2026-10-07",108),bar("2026-10-08",114)
 ]
});

t("CB01 exact eligible date set certifies bundle",()=>{
 const r=buildRg2LifecycleClockBundle(input());assert.equal(r.status,"VALID");
 assert.equal(r.expectedEligibleSessionDateSetHash,r.continuityBarDateSetHash);
});
t("CB02 same count substituted date fails exact set",()=>{
 const x=input();x.bars=x.bars.filter(b=>b.date!=="2026-10-06");x.bars.push(bar("2026-10-09",111));x.asOf="2026-10-09";
 const r=buildRg2LifecycleClockBundle(x);assert.equal(r.reason,"ELIGIBLE_DATE_SET_MISMATCH");
});
t("CB03 missing eligible bar fails exact set",()=>{
 const x=input();x.bars=x.bars.filter(b=>b.date!=="2026-10-06");
 const r=buildRg2LifecycleClockBundle(x);assert.equal(r.reason,"ELIGIBLE_DATE_SET_MISMATCH");
});
t("CB04 unresolved missing sessions fail closed",()=>{
 const x=input();x.unresolvedMissingSessions=1;
 assert.equal(buildRg2LifecycleClockBundle(x).reason,"UNRESOLVED_MISSING_SESSIONS");
});
t("CB05 continuity unknown fails closed",()=>{
 const x=input();x.bars[2].technicalContinuityVerified=false;
 assert.equal(buildRg2LifecycleClockBundle(x).reason,"TECHNICAL_CONTINUITY_UNKNOWN");
});
t("CB06 first close entry is separate from first parent break",()=>{
 const r=buildRg2LifecycleClockBundle(input());
 assert.equal(r.firstParentZoneEntryAt,"2026-10-02");assert.equal(r.parentFirstBreakAt,"2026-10-03");
});
t("CB07 first post-break outside close is later than break",()=>{
 const r=buildRg2LifecycleClockBundle(input());
 assert.equal(r.parentFirstPostBreakOutsideCloseAt,"2026-10-05");
});
t("CB08 reentry failure reclaim reuse canonical lifecycle clocks",()=>{
 const r=buildRg2LifecycleClockBundle(input());
 assert.equal(r.parentFirstReentryAt,"2026-10-06");
 assert.equal(r.parentFirstFailureAt,"2026-10-07");
 assert.equal(r.parentFirstReclaimAt,"2026-10-08");
});
t("CB09 ordinary unconstrained break is observable on break date",()=>{
 const r=buildRg2LifecycleClockBundle(input());assert.equal(r.parentFirstOrdinaryObservableAt,"2026-10-03");
});
t("CB10 constrained break waits for later ordinary session",()=>{
 const x=input();x.bars[2].priceLimitConstrained=true;
 const r=buildRg2LifecycleClockBundle(x);assert.equal(r.parentFirstBreakAt,"2026-10-03");assert.equal(r.parentFirstOrdinaryObservableAt,"2026-10-05");
});
t("CB11 if first ordinary post-break session reenters there is no hold",()=>{
 const x=input();x.bars[3].close=111;x.bars[3].high=112;x.bars[3].low=110;
 const r=buildRg2LifecycleClockBundle(x);assert.equal(r.parentFirstPostBreakOutsideCloseAt,null);
});
t("CB12 direct jump above parent can skip close-based zone entry",()=>{
 const x=input();x.bars[1].close=105;x.bars[1].high=106;x.bars[1].low=104;
 const r=buildRg2LifecycleClockBundle(x);assert.equal(r.firstParentZoneEntryAt,null);assert.equal(r.parentFirstBreakAt,"2026-10-03");
});
t("CB13 asOf prefix excludes future failure reclaim",()=>{
 const x=input();x.asOf="2026-10-05";
 const r=buildRg2LifecycleClockBundle(x);assert.equal(r.parentFirstFailureAt,null);assert.equal(r.parentFirstReclaimAt,null);
});
t("CB14 local break must be in certified eligible set",()=>{
 const x=input();x.localFirstBreakAt="2026-09-30";
 assert.equal(buildRg2LifecycleClockBundle(x).reason,"LOCAL_BREAK_NOT_IN_CERTIFIED_ELIGIBLE_SET");
});
t("CB15 pseudo non-eligible bar cannot substitute expected eligible date",()=>{
 const x=input();x.bars=x.bars.filter(b=>b.date!=="2026-10-06");x.bars.push(bar("2026-10-06",111,{eligibleSymbolSession:false}));
 assert.equal(buildRg2LifecycleClockBundle(x).reason,"ELIGIBLE_DATE_SET_MISMATCH");
});
console.log(`SUMMARY ${pass}/15 PASS`);
