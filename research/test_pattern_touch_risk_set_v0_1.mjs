import assert from "node:assert/strict";
import {buildAsOfTouchState,riskSetEligibility} from "./pattern_touch_risk_set_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("TR01 only touches through asOf counted",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20",touchEvents:["2026-09-10","2026-09-15"]});
 assert.equal(r.priorTouchCountThroughAsOf,2);
});

t("TR02 eventual total touch predictor prohibited",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20",touchEvents:["2026-09-10"],eventualTotalTouches:5});
 assert.equal(r.reason,"EVENTUAL_TOTAL_TOUCHES_PROHIBITED");
});

t("TR03 future touch in decision payload blocked",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20",touchEvents:["2026-09-10","2026-09-21"]});
 assert.equal(r.reason,"FUTURE_EVENT_IN_DECISION_INPUT");
});

t("TR04 future bounce in decision payload blocked",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20",bounceEvents:["2026-09-21"]});
 assert.equal(r.status,"DATA_BLOCKED");
});

t("TR05 incomplete path unknown",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20",pathComplete:false});
 assert.equal(r.status,"UNKNOWN");
});

t("TR06 terminal zone exits risk set",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20",lifecycleTerminalAt:"2026-09-18"});
 assert.equal(r.aliveInRiskSet,false);
});

t("TR07 future terminal date does not kill current risk set",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20",lifecycleTerminalAt:"2026-09-21"});
 assert.equal(r.aliveInRiskSet,true);
});

t("TR08 exact prior-touch risk set eligible",()=>{
 const s=buildAsOfTouchState({asOf:"2026-09-20",touchEvents:["2026-09-10","2026-09-15"]});
 const r=riskSetEligibility({asOf:"2026-09-20",requiredPriorTouches:2,touchState:s});
 assert.equal(r.status,"ELIGIBLE");
});

t("TR09 mismatched touch history not eligible",()=>{
 const s=buildAsOfTouchState({asOf:"2026-09-20",touchEvents:["2026-09-10"]});
 const r=riskSetEligibility({asOf:"2026-09-20",requiredPriorTouches:2,touchState:s});
 assert.equal(r.status,"NOT_ELIGIBLE");
});

t("TR10 terminal state not eligible even with count match",()=>{
 const s=buildAsOfTouchState({
  asOf:"2026-09-20",touchEvents:["2026-09-10"],lifecycleTerminalAt:"2026-09-18"
 });
 const r=riskSetEligibility({asOf:"2026-09-20",requiredPriorTouches:1,touchState:s});
 assert.equal(r.reason,"ZONE_TERMINAL");
});

t("TR11 touch count never creates independent vote",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20",touchEvents:["2026-09-10"]});
 assert.equal(r.independentVoteEligible,false);
});

t("TR12 zero prior touches is valid state not unknown",()=>{
 const r=buildAsOfTouchState({asOf:"2026-09-20"});
 assert.equal(r.status,"VALID");
 assert.equal(r.priorTouchCountThroughAsOf,0);
});

console.log(`SUMMARY ${pass}/12 PASS`);
