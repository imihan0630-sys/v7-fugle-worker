import assert from "node:assert/strict";
import fs from "node:fs";
import {evaluatePve285Request} from "../research/d02_pve285_external_dependency_request_guard_v0_1.mjs";
const x=JSON.parse(fs.readFileSync(new URL("../research/d02_pve285_external_dependency_request_v0_1.json",import.meta.url),"utf8"));
let r=evaluatePve285Request(x);assert.equal(r.pass,true);assert.equal(r.d16RequestedKeyCount,12);assert.equal(r.d14ConsumerKey,"D02-11:LIQUIDITY_COUNTERFACTUAL");
for(const mutate of [
 y=>y.d16.requiredEvidenceKeys.pop(),
 y=>y.d16.actualFrozenReceiptCountAtRequest=1,
 y=>y.d16.constraints.d02DoesNotPrescribeEstimator=false,
 y=>y.d16.constraints.unrelatedSda022ReceiptReusable=true,
 y=>y.outcomeAccessAuthorized=true,
 y=>y.d14.constraints.unknownCommissionAsZeroForbidden=false,
 y=>y.d14.constraints.unknownSlippageAsZeroForbidden=false,
 y=>y.d14.constraints.d02MaySelfInventCostAnchor=true,
 y=>y.d14.consumerEvidenceKey="D02-10:TREND_VOLUME_INTERACTION"
]){
 const y=structuredClone(x);mutate(y);assert.equal(evaluatePve285Request(y).pass,false);
}
assert.equal(r.maturityPromotionAuthorized,false);assert.equal(r.formalCoreChangeAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:14,d16Requests:12,d14Requests:1}));
