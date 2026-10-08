import assert from "node:assert/strict";
import fs from "node:fs";
import {classifyPve282} from "../research/d02_pve282_promotion_design_readiness_audit_v0_1.mjs";

const registry=JSON.parse(fs.readFileSync(new URL("../research/d02_l4_effect_target_registry_v0_4.json",import.meta.url),"utf8"));
const d14={
 statutoryTaxSemanticsKnown:true,
 ownerCommissionKnown:false,
 brokerConfirmedSlippageAvailable:false,
 universalEconomicCostAnchorReady:false,
 d02_11CostQualityAnchorReady:false
};
const r=classifyPve282({registry,d14,d16:{unrelatedSda022MethodFreezeExists:true}});

assert.equal(Object.keys(r.targetReadiness).length,14);
assert.equal(r.counts.targetStates.READY??0,0);
assert.equal(r.counts.targetStates.PARTIAL_NUMERIC_JUSTIFICATION_MISSING,4);
assert.equal(r.counts.targetStates.BLOCKED_PRIMARY_METRIC_OR_HORIZON_NOT_FROZEN,10);
for(const k of ["D02-01:SEMANTIC_GOVERNANCE","D02-02:H001","D02-03:H20","D02-06:H003"])
  assert.equal(r.targetReadiness[k].state,"PARTIAL_NUMERIC_JUSTIFICATION_MISSING",k);
for(const k of ["D02-04:DRYUP","D02-05:EXTREME_PARTICIPATION","D02-07:SVB20","D02-08:PROVIDER_PRESSURE","D02-09:PIVOT_SIGNED_VOLUME","D02-09:PARTICIPATION_TRAJECTORY","D02-10:TREND_VOLUME_INTERACTION","D02-11:LIQUIDITY_COUNTERFACTUAL","D02-12:TIME_OF_DAY_VOLUME_CURVE","D02-12:PRICE_BY_VOLUME_PROFILE"])
  assert.equal(r.targetReadiness[k].state,"BLOCKED_PRIMARY_METRIC_OR_HORIZON_NOT_FROZEN",k);
assert.ok(r.targetReadiness["D02-11:LIQUIDITY_COUNTERFACTUAL"].reasons.includes("D14_D02_11_COST_QUALITY_ANCHOR_NOT_READY"));
assert.equal(Object.keys(r.methodReadiness).length,3);
assert.equal(r.counts.methodStates.BLOCKED_D16_MODEL_METHOD_RECEIPT_MISSING,3);
for(const k of ["D02-02:H001","D02-03:H20","D02-06:H003"]){
 assert.equal(r.methodReadiness[k].exactReceiptFrozen,false);
 assert.equal(r.methodReadiness[k].unrelatedSda022MethodReusable,false);
}
assert.equal(r.d14Snapshot.statutoryTaxSemanticsKnown,true);
assert.equal(r.d14Snapshot.ownerCommissionKnown,false);
assert.equal(r.d14Snapshot.brokerConfirmedSlippageAvailable,false);
assert.equal(r.d16Snapshot.unrelatedSda022MethodFreezeExists,true);
assert.equal(r.d16Snapshot.unrelatedSda022MethodReusable,false);
assert.equal(r.allPromotionDesignReady,false);
assert.equal(r.outcomeAccessAuthorized,false);
assert.equal(r.maturityPromotionAuthorized,false);
assert.equal(r.formalCoreChangeAuthorized,false);

const fake=structuredClone(registry);
fake.entries["D02-04:DRYUP"].metric="FIXED_METRIC";
fake.entries["D02-04:DRYUP"].outcomeHorizon="D5";
fake.entries["D02-04:DRYUP"].thresholdValue=0.01;
fake.entries["D02-04:DRYUP"].targetHash="x";
fake.entries["D02-04:DRYUP"].targetStatus="FROZEN";
const r2=classifyPve282({registry:fake,d14,d16:{}});
assert.equal(r2.targetReadiness["D02-04:DRYUP"].state,"READY");

console.log(JSON.stringify({status:"PASS",assertions:34,targets:14,wave1Methods:3}));
