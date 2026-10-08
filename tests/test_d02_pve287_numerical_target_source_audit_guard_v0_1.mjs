import assert from "node:assert/strict";
import fs from "node:fs";
import {evaluatePve287Audit} from "../research/d02_pve287_numerical_target_source_audit_guard_v0_1.mjs";
const x=JSON.parse(fs.readFileSync(new URL("../research/d02_pve287_numerical_target_source_audit_v0_1.json",import.meta.url),"utf8"));
let r=evaluatePve287Audit(x);assert.equal(r.pass,true);assert.equal(r.evidenceKeyCount,14);assert.equal(r.targetFreezeAuthorizedCount,0);assert.equal(r.numericalTargetFrozen,false);
for(const k of Object.keys(x.entries)){assert.equal(x.entries[k].targetFreezeAuthorized,false,k);assert.equal(x.entries[k].currentD02OutcomeUsed,false,k);}
assert.deepEqual(x.entries["D02-01:SEMANTIC_GOVERNANCE"].permittedRationalePaths,["SEMANTIC_POLICY"]);
assert.ok(x.entries["D02-11:LIQUIDITY_COUNTERFACTUAL"].blockers.includes("D14_COST_QUALITY_RECEIPT_PENDING"));
const y=structuredClone(x);y.entries["D02-02:H001"].targetFreezeAuthorized=true;assert.equal(evaluatePve287Audit(y).pass,false);
const z=structuredClone(x);z.entries["D02-07:SVB20"].currentAvailableLegalSources=["TEST_FIXTURE"];assert.equal(evaluatePve287Audit(z).pass,false);
const q=structuredClone(x);q.currentD02OutcomeInspected=true;assert.equal(evaluatePve287Audit(q).pass,false);
assert.equal(r.maturityPromotionAuthorized,false);assert.equal(r.formalCoreChangeAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:38,evidenceKeys:14,legalTargetSourcesNow:0}));
