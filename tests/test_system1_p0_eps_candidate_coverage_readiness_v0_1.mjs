import assert from "node:assert/strict";
import {INCIDENT,reviewCandidateEpsCoverage as review}
 from "../research/system1_p0_eps_candidate_coverage_readiness_v0_1.mjs";
let cases=0;
function t(label,fn){fn();cases++;console.log("PASS "+label)}
const d="2026-10-16",stocks=["3236","5340","3147","4167","6122"];
const snapshot={ready:true,asOfDate:d,count:9};
const c=(symbol)=>({schema:"OFFICIAL_C_Q2_Q1_ORIGINAL_PARSER",symbol,
 marketDate:d,year:2026,quarter:2,statementBasis:"CONSOLIDATED",reportId:"C",
 officialCurrentQuarterParserVerified:true,officialPreviousQuarterParserVerified:true,
 sourceSha256Q2:"a".repeat(64),sourceSha256Q1:"b".repeat(64)});
const a={symbol:"5340",marketDate:d,year:2026,quarter:2,
 statementBasis:"INDIVIDUAL",reportId:"A",originalIndividualPdfVerified:true,
 sourceSha256Q2:"9".repeat(64)};
const source=[c("3236"),a,c("3147"),c("4167"),c("6122")];
const persisted=(code)=>({...c(code),source:"PRODUCTION_ORIGINAL_D1_QUALITY_READBACK",
 quarterEpsVerified:true,previousQuarterEpsVerified:true});
t("physical summary ready 9 is insufficient to certify 5 exact candidates",()=>{
 const v=review({snapshot});
 assert.equal(v.sourceQuarterEpsSnapshotReady,true);
 assert.equal(v.snapshotCount,9);
 assert.equal(v.completeCandidateCoverage,false);
 assert.equal(v.authoritativeFormalSelectionVerified,false);
 assert.equal(v.zeroPicksCertified,false);
 assert.equal(v.rows.every(x=>x.status==="OFFICIAL_ORIGINAL_UNVERIFIED"),true);
});
t("four C source proofs do not equal D1 readback",()=>{
 const v=review({snapshot,officialSources:source});
 assert.equal(v.originalConsolidatedVerifiedN,4);
 assert.equal(v.originalIndividualOnlyN,1);
 assert.equal(v.d1CandidateCoverageVerifiedN,0);
 assert.equal(v.rows.find(x=>x.symbol==="5340").status,
 "INDIVIDUAL_A_LEGAL_AND_POLICY_PENDING");
 assert.equal(v.rows.filter(x=>x.officialConsolidatedVerified).every(x=>!x.exactD1CandidateVerified),true);
});
t("even four certified C cached symbols cannot unlock legal A",()=>{
 const persistedReceipts=["3236","3147","4167","6122"].map(persisted);
 const v=review({snapshot,officialSources:source,persistedReceipts});
 assert.equal(v.d1CandidateCoverageVerifiedN,4);
 assert.equal(v.completeCandidateCoverage,false);
 assert.equal(v.authoritativeFormalSelectionVerified,false);
 assert.equal(v.rows.find(x=>x.symbol==="5340").exactD1CandidateVerified,false);
});
t("source and D1 digest/date parity required",()=>{
 const v=review({snapshot,officialSources:[c("3236")],
  candidates:["3236"],persistedReceipts:[{...persisted("3236"),sourceSha256Q1:"c".repeat(64)}]});
 assert.equal(v.completeCandidateCoverage,false);
});
t("complete original plus D1 per-symbol proof still cannot approve Formal",()=>{
 const v=review({snapshot,officialSources:[c("3236")],
  candidates:["3236"],persistedReceipts:[persisted("3236")]});
 assert.equal(v.completeCandidateCoverage,true);
 assert.equal(v.zeroPicksCertified,false);
 assert.equal(v.authoritativeFormalSelectionVerified,false);
 assert.equal(v.canSendBuy,false);assert.equal(v.canInvokeCloudflareScan,false);
});
t("dataset as-of mismatch is NOT ready",()=>{
 const v=review({snapshot:{...snapshot,asOfDate:"2026-10-15"},
  officialSources:[c("3236")],candidates:["3236"],persistedReceipts:[persisted("3236")]});
 assert.equal(v.completeCandidateCoverage,false);
});
t("dataset count does not substitute exact persisted symbols",()=>{
 const v=review({snapshot:{ready:true,asOfDate:d,count:50000},
   candidates:["3236"],officialSources:[c("3236")]});
 assert.equal(v.completeCandidateCoverage,false);
});
t("incorrect financial-report type A is not equal to C",()=>{
 const v=review({snapshot,candidates:["5340"],officialSources:[a],
  persistedReceipts:[{...persisted("5340"),statementBasis:"CONSOLIDATED"}]});
 assert.equal(v.completeCandidateCoverage,false);
});
t("wrong session or ambiguous candidate list rejected",()=>{
 assert.throws(()=>review({date:"2026-10-17",snapshot}),/CANDIDATE_SET_IDENTITY/);
 assert.throws(()=>review({snapshot,candidates:["3236","3236"]}),/CANDIDATE_SET_IDENTITY/);
 assert.throws(()=>review({snapshot,candidates:["00878"]}),/CANDIDATE_SET_IDENTITY/);
});
t("duplicate original statement versions fail closed",()=>{
 const v=review({snapshot,candidates:["3236"],officialSources:[c("3236"),c("3236")],
   persistedReceipts:[persisted("3236")]});
 assert.equal(v.completeCandidateCoverage,false);
 assert.equal(v.rows[0].status,"DUPLICATE_RECEIPT_FAIL_CLOSED");
});
t("missing official parser proof cannot be hidden by a D1 receipt",()=>{
 const v=review({snapshot,candidates:["3236"],officialSources:[{...c("3236"),officialPreviousQuarterParserVerified:false}],
   persistedReceipts:[persisted("3236")]});
 assert.equal(v.completeCandidateCoverage,false);
});
t("real incident immutable candidate set and research-only output",()=>{
 const v=review({snapshot,officialSources:source});
 assert.deepEqual(INCIDENT.candidateCodes,stocks);
 assert.equal(v.productionMutation,false);
 assert.equal(v.canOverwriteD1,false);
 assert.equal(v.canWriteKV,false);
 assert.equal(v.historicalReplayAllowed,false);
 assert(v.rows.every(x=>x.formalEligible===false&&x.canIssueBuy===false));
});
console.log(JSON.stringify({suite:"System1 P0 2026-10-16 EPS candidate exact-symbol D1 coverage",
 tests:cases,pass:true,offline:true,sourceReadOnly:true,noFormalEligibility:true}));
