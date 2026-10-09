import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildA1HistoryPrimitiveBundle } from "../runtime/a1_history_primitives_v0_1.mjs";
import { buildStrategyStateAssessment } from "../runtime/strategy_evaluator.mjs";
import {
 SHORT_MOMENTUM_CONTRACT_V0_1 as SM,
 SWING_GROWTH_CONTRACT_V0_1 as SG,
} from "../runtime/strategy_contracts_v0_1.mjs";
import { findLimitedShadowSpec } from "../runtime/limited_shadow_v0_1.mjs";
import { evaluateD06LimitedShadowEvidenceV0_1 as evaluate,
 createD06LimitedShadowAssessorV0_1 } from "../runtime/d06_a1_limited_shadow_evidence_policy_v0_1.mjs";

const T="2026-09-29",at="2026-09-29T07:30:00Z";
const bars=Array.from({length:61},(_,i)=>({
 date:new Date(Date.UTC(2026,6,31+i)).toISOString().slice(0,10),
 open:100+i*0.1,high:102+i*0.1,low:99+i*0.1,close:101+i*0.1,
 volumeShares:1000000+i*1000,tradeValue:100000000+i*100000,
}));
bars[bars.length-1].date=T;
// Re-key entire synthetic date sequence to unique valid dates ending T.
// These dates are deliberately illustrative only, never trading-calendar proof.
for(let i=0;i<61;i++){
 bars[i].date=new Date(Date.UTC(2026,8,29-(60-i))).toISOString().slice(0,10);
}
const make=changes=>buildA1HistoryPrimitiveBundle({
 bundleId:"D06-A1-TEST",symbol:"2330",marketDate:T,
 decisionTimestamp:at,observedAt:"2026-09-29T07:21:00Z",
 availableAt:"2026-09-29T07:20:00Z",bars,sourceId:"TEST-A1",
 sourceName:"SYNTHETIC_NOT_EXTERNAL_PROOF",priceSpace:"RAW",
 continuityState:"CLEAR_NO_ACTION",...changes,
});
const bundle=await make({});
assert.equal(bundle.factorObservations.length,7);
const ctx={
 contract:SM,shadowSpec:findLimitedShadowSpec("SHORT_MOMENTUM"),
 symbol:"2330",marketDate:T,decisionTimestamp:at,factorBundle:bundle,
};
const good=await evaluate(ctx);
assert.equal(good.familyAssessments.TECHNICAL_STRUCTURE.observationState,"KNOWN");
assert.equal(good.familyAssessments.PRICE_VOLUME.observationState,"KNOWN");
assert.equal(good.familyAssessments.RISK_FRICTION.observationState,"UNKNOWN");
assert.ok(good.familyAssessments.RISK_FRICTION.reasons.includes(
 "D06_REQUIRED_FACTOR_UNATTESTED:RISK.REWARD_RISK"));
assert.equal(good.entryReadiness,"BLOCKED");
assert.equal(good.assessorState,"INCOMPLETE");
assert.equal(good.score,null);
assert.equal(good.rank,null);
assert.equal(good.alphaValidated,false);
assert.equal(good.readyForLiveSelection,false);
assert.equal(Object.isFrozen(good),true);
assert.equal((await evaluate(ctx)).policyReceiptHash,good.policyReceiptHash);
const assessment=buildStrategyStateAssessment(SM,{
 familyAssessments:good.familyAssessments,
 entryReadiness:"BUY_ELIGIBLE",
});
assert.equal(assessment.strategyValidity,"INCOMPLETE");
assert.equal(assessment.entryReadiness,"BLOCKED");
const wrapped=await createD06LimitedShadowAssessorV0_1()(ctx);
assert.equal(wrapped.entryReadiness,"BLOCKED");
assert.equal(wrapped.importantRejected,false);
assert.equal(wrapped.entryPlan,null);
assert.equal(wrapped.assessorPolicyReceipt.policyReceiptHash,good.policyReceiptHash);

const growth=await evaluate({...ctx,contract:SG,
 shadowSpec:findLimitedShadowSpec("SWING_GROWTH")});
assert.deepEqual([...growth.missingRequiredFamilies].sort(),
 ["FUNDAMENTAL_QUALITY","INDUSTRY_THESIS"].sort());
assert.equal(growth.familyAssessments.FUNDAMENTAL_QUALITY.observationState,"UNKNOWN");

await assert.rejects(()=>evaluate({...ctx,marketDate:"2026-09-30"}),/BUNDLE_IDENTITY/);
await assert.rejects(()=>evaluate({...ctx,contract:{...SM,strategyVersion:"HINDSIGHT"}}),
 /UNREGISTERED_STRATEGY/);
await assert.rejects(()=>evaluate({...ctx,shadowSpec:{...ctx.shadowSpec,
 selectionLayerEnabled:true}}),/SHADOW_CONTRACT_MISMATCH/);

async function rehash(change){
 const rest={...bundle,...change};
 delete rest.bundleHash;
 return {...rest,bundleHash:await sha256Hex(rest)};
}
const tampered={...bundle,barCount:20000};
await assert.rejects(()=>evaluate({...ctx,factorBundle:tampered}),/BUNDLE_HASH_MISMATCH/);
const duplicate=await rehash({factorObservations:[
 ...bundle.factorObservations,bundle.factorObservations[0],
]});
await assert.rejects(()=>evaluate({...ctx,factorBundle:duplicate}),/DUPLICATE_FACTOR_ID/);
const forwardFactor=await rehash({factorObservations:bundle.factorObservations.map((x,i)=>
 i===0?{...x,provenance:{...x.provenance,availableAt:"2026-10-01T00:00:00Z"}}:x)});
await assert.rejects(()=>evaluate({...ctx,factorBundle:forwardFactor}),/FACTOR_PROVENANCE_NOT_BOUND/);
const stale=await make({availableAt:"2026-09-29T08:30:00Z",observedAt:"2026-09-29T08:35:00Z"});
const staleResult=await evaluate({...ctx,factorBundle:stale});
assert.equal(staleResult.entryReadiness,"BLOCKED");
assert.ok(staleResult.sourceIssues.includes("D06_SOURCE_PIT_UNPROVEN"));
const unverified=await make({continuityState:"UNVERIFIED"});
const u=await evaluate({...ctx,factorBundle:unverified});
assert.equal(u.familyAssessments.TECHNICAL_STRUCTURE.observationState,"UNKNOWN");
assert.equal(u.entryReadiness,"BLOCKED");
const gaps=await rehash({factorObservations:bundle.factorObservations.filter(x=>x.factorId!=="PV.ACCEPTANCE")});
const g=await evaluate({...ctx,factorBundle:gaps});
assert.ok(g.familyAssessments.PRICE_VOLUME.reasons.includes(
 "D06_REQUIRED_FACTOR_UNATTESTED:PV.ACCEPTANCE"));
assert.equal(g.entryReadiness,"BLOCKED");
console.log("System2 D06 A1 evidence prereg assessor: PIT, UNKNOWN, integrity, strategy isolation PASS");
