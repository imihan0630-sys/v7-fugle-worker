import assert from "node:assert/strict";
import {planOriginalQuarterEpsSnapshotMerge as plan} from "../research/system1_p0_quarter_eps_safe_merge_v0_1.mjs";
const date="2026-10-16";
const row=n=>({quarterEPS:n/100,previousQuarterEPS:n/200,
 quarterEpsVerified:true,previousQuarterEpsVerified:true});
const baseStocks=Object.fromEntries(Array.from({length:9},(_,i)=>[String(6001+i),row(i+1)]));
const sourceStocks=Object.fromEntries(["4167","3236","3147","6122"].map((code,i)=>[code,row(i+20)]));
const old={asOfDate:date,year:2026,quarter:2,count:9,stocks:baseStocks};
const next={asOfDate:date,year:2026,quarter:2,count:4,stocks:sourceStocks};
const receipts=Object.fromEntries(Object.keys(sourceStocks).map(code=>[code,{
 sourceUrl:"https://mopsov.twse.com.tw/mops/web/ajax_t164sb04",
 quarterRawSha256:"a".repeat(64),priorRawSha256:"b".repeat(64),
 currentOriginalParserVerified:true,previousOriginalParserVerified:true,
 fiscalYear:2026,fiscalQuarter:2,reportId:"C"
}]));
const cand=["4167","3236","3147","5340","6122"];
const input={marketDate:date,originalD1SourceAuthenticated:true,originalD1ReadbackProven:true,
 existingSnapshot:old,supplement:next,sourceReceipts:receipts,requiredCandidates:cand};
let count=0;const t=(name,fn)=>{fn();count++;console.log("PASS "+name)};
t("9 original unchanged plus four C source-only candidates, missing 5340",()=>{
 const x=plan(input);
 assert.equal(x.existingCount,9);assert.equal(x.supplementCount,4);
 assert.equal(x.prospectiveCount,13);
 assert.deepEqual(x.unverifiedRequiredCandidates,["5340"]);
 assert.equal(x.status,"REMAINS_INCOMPLETE_DO_NOT_SCAN");
 assert.equal(x.readyToApply,false);assert.equal(x.formalEligible,false);
 assert.equal(x.pitFirstKnownCertified,false);
 assert.equal(x.originalD1DataMutated,false);
 assert.deepEqual(old.stocks,baseStocks);
});
t("without authentic original D1 snapshot no merge authorization",()=>{
 assert.throws(()=>plan({...input,originalD1ReadbackProven:false}),/ORIGINAL_D1_EVIDENCE_REQUIRED/);
});
t("not allowed to overwrite 9 existing rows with partial packet",()=>{
 const x=plan(input);
 assert.deepEqual(Object.keys(x.potentialContent.stocks).filter(s=>Object.hasOwn(baseStocks,s)).sort(),
  Object.keys(baseStocks).sort());
});
t("same symbol different original EPS rejects rather than overwrite",()=>{
 const conflict={...next,stocks:{...next.stocks,"6001":row(99)},count:5};
 const m={...receipts,"6001":{...receipts["4167"]}};
 assert.throws(()=>plan({...input,supplement:conflict,sourceReceipts:m}),/CONFLICTING_EXISTING_EPS_6001/);
});
t("even legitimate A-form not treated as C in old production rule",()=>{
 const updated={...next,stocks:{...next.stocks,"5340":row(54)},count:5};
 const m={...receipts,"5340":{...receipts["4167"],reportId:"A"}};
 assert.throws(()=>plan({...input,supplement:updated,sourceReceipts:m}),/INDIVIDUAL_A_NEEDS_LEGAL_APPROVAL_5340/);
});
t("source unknown SHA and missing prior-quarter EPS not promoted",()=>{
 const m={...receipts,"4167":{...receipts["4167"],priorRawSha256:null}};
 assert.throws(()=>plan({...input,sourceReceipts:m}),/SOURCE_NOT_ORIGINAL_VERIFIED_4167/);
 const bad={...next,stocks:{...next.stocks,"4167":{...row(20),previousQuarterEpsVerified:false}}};
 assert.throws(()=>plan({...input,supplement:bad}),/SUPPLEMENT_UNVERIFIED_QUARTER/);
});
t("snapshot fiscal period and population count fail closed",()=>{
 assert.throws(()=>plan({...input,existingSnapshot:{...old,count:8}}),/EXISTING_COUNT_NOT_MATCHED/);
 assert.throws(()=>plan({...input,existingSnapshot:{...old,asOfDate:"2026-10-15"}}),/EXISTING_WRONG_PERIOD/);
 assert.throws(()=>plan({...input,marketDate:"2026-10-17"}),/PINNED_DATE_REQUIRED/);
});
t("if all five have C-verified official data still requires PIT/CAS review",()=>{
 const all={...next,stocks:{...next.stocks,"5340":row(54)},count:5};
 const m={...receipts,"5340":{...receipts["4167"]}};
 const x=plan({...input,supplement:all,sourceReceipts:m});
 assert.equal(x.unverifiedRequiredCandidates.length,0);
 assert.equal(x.readyToApply,false);assert.equal(x.formalEligible,false);
 assert.equal(x.status,"SOURCE_COVERAGE_PROPOSED_PENDING_D1_CAS_AND_PIT");
});
console.log(JSON.stringify({suite:"S1 2026-10-16 EPS original snapshot preservation",tests:count,
 passed:true,liveMutation:false,selectionAuthorization:false}));
