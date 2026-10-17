// System1 P0 source-to-Candidate EPS completeness bridge, read-only V0.1.
// A quality snapshot ready:true/count:9 proves cached dataset existence,
// NOT that every preliminary candidate has verified quarterly EPS.
// No Formal, source import, strategy, KV/D1 or trade mutation.
export const SCHEMA="S1_P0_CANDIDATE_EPS_COVERAGE_V0_1";
export const INCIDENT={
 session:"2026-10-16",candidateCodes:Object.freeze(["3236","5340","3147","4167","6122"]),
 year:2026,quarter:2
};
const SHA=/^[0-9a-f]{64}$/;
const CODE=/^[1-9][0-9]{3}$/;
const REQUIRED_PROOF="OFFICIAL_C_Q2_Q1_ORIGINAL_PARSER";
function properCode(code){return typeof code==="string"&&CODE.test(code);}
function sameDate(d){return d===INCIDENT.session;}
function hasOfficialSourceProof(x){
 return x&&x.schema===REQUIRED_PROOF&&x.marketDate===INCIDENT.session&&
  x.year===INCIDENT.year&&x.quarter===INCIDENT.quarter&&
  x.statementBasis==="CONSOLIDATED"&&x.reportId==="C"&&
  x.officialCurrentQuarterParserVerified===true&&
  x.officialPreviousQuarterParserVerified===true&&
  SHA.test(String(x.sourceSha256Q2||""))&&SHA.test(String(x.sourceSha256Q1||""));
}
function hasPersistedProof(x,code){
 return x&&x.symbol===code&&x.source==="PRODUCTION_ORIGINAL_D1_QUALITY_READBACK"&&
  x.marketDate===INCIDENT.session&&x.quarterEpsVerified===true&&
  x.previousQuarterEpsVerified===true&&x.statementBasis==="CONSOLIDATED"&&
  x.year===2026&&x.quarter===2&&SHA.test(String(x.sourceSha256Q2||""))&&
  SHA.test(String(x.sourceSha256Q1||""));
}
export function reviewCandidateEpsCoverage({date=INCIDENT.session,candidates=INCIDENT.candidateCodes,
 snapshot={},officialSources=[],persistedReceipts=[]}={}){
 if(!sameDate(date)||!Array.isArray(candidates)||candidates.length===0||
    candidates.length>12||!candidates.every(properCode)||
    new Set(candidates).size!==candidates.length)throw Error("CANDIDATE_SET_IDENTITY_OR_DATE_INVALID");
 if(!Array.isArray(officialSources)||officialSources.length>24||
  !Array.isArray(persistedReceipts)||persistedReceipts.length>24)
  throw Error("EPS_RECEIPT_BUDGET_INVALID");
 const snapReady=snapshot.ready===true&&sameDate(snapshot.asOfDate)&&
  Number.isSafeInteger(snapshot.count)&&snapshot.count>=0;
 const results=candidates.map(symbol=>{
  const source=officialSources.filter(x=>x?.symbol===symbol);
  const persisted=persistedReceipts.filter(x=>x?.symbol===symbol);
  const hasDuplicates=source.length>1||persisted.length>1;
  const raw=source[0],originalC=source.length===1&&hasOfficialSourceProof(raw);
  const individualA=source.length===1&&raw?.statementBasis==="INDIVIDUAL"&&
   raw?.reportId==="A"&&raw?.originalIndividualPdfVerified===true;
  const originalVerified=originalC;
  const persistedVerified=snapReady&&persisted.length===1&&hasPersistedProof(persisted[0],symbol)&&
   originalVerified&&persisted[0].sourceSha256Q2===raw.sourceSha256Q2&&
   persisted[0].sourceSha256Q1===raw.sourceSha256Q1;
  const status=hasDuplicates?"DUPLICATE_RECEIPT_FAIL_CLOSED":
   individualA?"INDIVIDUAL_A_LEGAL_AND_POLICY_PENDING":
   !originalVerified?"OFFICIAL_ORIGINAL_UNVERIFIED":
   !snapReady?"C_ORIGINAL_VERIFIED_SNAPSHOT_NOT_READY":
   !persistedVerified?"C_ORIGINAL_VERIFIED_CANDIDATE_D1_READBACK_MISSING":
   "C_OFFICIAL_ORIGINAL_AND_D1_SYMBOL_PROVEN";
  return {symbol,status,officialConsolidatedVerified:originalVerified,
   sourceIndividualAOnly:individualA,exactD1CandidateVerified:persistedVerified,
   missingCannotBeCalledFailedFinancialAlpha:true,
   formalEligible:false,canIssueBuy:false};
 });
 const allReady=results.every(x=>x.exactD1CandidateVerified);
 return {schema:SCHEMA,sessionDate:date,requiredCandidates:candidates.length,
  sourceQuarterEpsSnapshotReady:snapReady,snapshotCount:snapReady?snapshot.count:null,
  originalConsolidatedVerifiedN:results.filter(x=>x.officialConsolidatedVerified).length,
  originalIndividualOnlyN:results.filter(x=>x.sourceIndividualAOnly).length,
  d1CandidateCoverageVerifiedN:results.filter(x=>x.exactD1CandidateVerified).length,
  completeCandidateCoverage:allReady,
  status:allReady?"SOURCE_AND_CANDIDATE_READBACK_COMPLETE__FORMAL_STILL_SEPARATE":
   "CANDIDATE_EPS_SOURCE_OR_PERSISTENCE_INCOMPLETE",
  rows:results,
  sourceReadyNotSufficientForSelection:true,
  cachedDatasetReadyNotCandidateCoverage:true,
  authoritativeFormalSelectionVerified:false,zeroPicksCertified:false,
  historicalReplayAllowed:false,canOverwriteD1:false,canWriteKV:false,
  canInvokeCloudflareScan:false,canSendBuy:false,productionMutation:false};
}
