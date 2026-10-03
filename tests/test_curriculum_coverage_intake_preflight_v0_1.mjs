import assert from "node:assert/strict";
import {
  COVERAGE_RETURN_ROUTES,
  scanCoverageReturns
} from "../research/curriculum_coverage_intake_preflight_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

eq(COVERAGE_RETURN_ROUTES.length,12);
eq(COVERAGE_RETURN_ROUTES[0].candidateId,"COV-01");
eq(COVERAGE_RETURN_ROUTES.at(-1).candidateId,"COV-12");

const none=scanCoverageReturns({
  root:"/virtual",
  existsSync:()=>false,
  readFileSync:()=>{throw new Error("SHOULD_NOT_READ");}
});
eq(none.ok,true);
eq(none.present,0);
eq(none.valid,0);
eq(none.invalid,0);
eq(none.missing,12);
eq(none.acceptedForIntake,0);

function validReturn(route,recommendation="EVIDENCE_INSUFFICIENT"){
  return "# Specialist Return\n\n"+
  "- Candidate ID: "+route.candidateId+"\n"+
  "- Domain: "+route.domain+"\n"+
  "- Specialist room: TEST ROOM\n"+
  "- Return artifact path: "+route.artifactPath+"\n"+
  "- Evidence cutoff: 2026-10-03\n"+
  "- Current candidate class: TEST_CLASS\n"+
  "- Proposed terminal recommendation: "+recommendation+"\n\n"+
  "### 1. Exact Knowledge Definition\nDefinition; UNKNOWN remains UNKNOWN.\n\n"+
  "### 2. Existing-module Overlap Matrix\nOverlap with existing owner is explicitly reviewed.\n\n"+
  "### 3. Why Current Scope Is Insufficient\nCurrent scope lacks the exact evidence contract.\n\n"+
  "### 4. Taiwan Data Feasibility\nSource and data authority are identified; access limits remain explicit.\n\n"+
  "### 5. PIT / Replay Implication\nknownAt, capturedAt, vintage and Replay semantics are frozen.\n\n"+
  "### 6. Decision Role\nPrimary role is validation.\n\n"+
  "### 7. Anti-double-count Rule\nShared data cannot become duplicate independent evidence.\n\n"+
  "### 8. Proposed Owner\nExisting domain owner subject to 00 audit.\n\n"+
  "### 9. Maturity Starting Point\nNo automatic maturity promotion.\n\n"+
  "### 10. Terminal Recommendation\n"+recommendation+"\n";
}

const route8=COVERAGE_RETURN_ROUTES.find(x=>x.candidateId==="COV-08");
const filesValid=new Map([[route8.artifactPath,validReturn(route8,"EXTEND_EXISTING_SCOPE")]]);
const valid=scanCoverageReturns({
  root:"/virtual",
  existsSync:p=>filesValid.has(String(p).replace("/virtual/","")),
  readFileSync:p=>filesValid.get(String(p).replace("/virtual/",""))
});
eq(valid.ok,true);
eq(valid.present,1);
eq(valid.valid,1);
eq(valid.invalid,0);
eq(valid.missing,11);
eq(valid.rows.find(x=>x.candidateId==="COV-08").contractStatus,"RETURN_CONTRACT_COMPLETE");
eq(valid.acceptedForIntake,0);

const route1=COVERAGE_RETURN_ROUTES[0];
const badText=validReturn(route1).replace("### 7. Anti-double-count Rule","### 7. Missing Rule");
const filesBad=new Map([[route1.artifactPath,badText]]);
const bad=scanCoverageReturns({
  root:"/virtual",
  existsSync:p=>filesBad.has(String(p).replace("/virtual/","")),
  readFileSync:p=>filesBad.get(String(p).replace("/virtual/",""))
});
eq(bad.ok,false);
eq(bad.present,1);
eq(bad.valid,0);
eq(bad.invalid,1);
ok(bad.rows[0].errors.includes("MISSING_SECTION:antiDoubleCount"));
eq(bad.acceptedForIntake,0);

const mismatched=validReturn(route1).replace("- Domain: D01","- Domain: D22");
const filesMismatch=new Map([[route1.artifactPath,mismatched]]);
const mismatch=scanCoverageReturns({
  root:"/virtual",
  existsSync:p=>filesMismatch.has(String(p).replace("/virtual/","")),
  readFileSync:p=>filesMismatch.get(String(p).replace("/virtual/",""))
});
eq(mismatch.ok,false);
ok(mismatch.rows[0].errors.includes("DOMAIN_MISMATCH"));

console.log("curriculum coverage intake preflight tests passed: "+n);
