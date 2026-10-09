// DATA_LANE Issue #1026 P03: audit real same-UTC-day nonauthorizing writer gates.
// Pure offline validation only: never grants quota or authenticates unseen ledgers.
import assert from "node:assert/strict";
const sha=/^[0-9a-f]{40}$/;
export function validateIssue1026P03DeferMatrixV0_1({
 matrix,registry,system1Producer,reservePolicy,p03P05Metadata,physicalClosure,
}={}){
 assert.equal(matrix?.schemaVersion,"S2_ISSUE1026_P03_REAL_SAME_UTC_DAY_CROSS_WRITER_DEFER_MATRIX_20261009_V0_1");
 assert.equal(matrix.issueNumber,1026);
 assert.equal(matrix.parentDirective,"S2-CORR-20261007-003");
 assert.equal(matrix.utcQuotaDay,"2026-10-09");
 assert.equal(matrix.evidenceClassification,"PHYSICAL_GATE_INVOCATION_AND_NEGATIVE_DEFER_RECEIPTS_ONLY");
 assert.equal(system1Producer?.schemaVersion,"SYSTEM1_ISSUE1024_P01_P02_P04_READONLY_SOURCE_INTAKE_V0_1");
 assert.equal(system1Producer?.physicalQualification?.P01,false);
 assert.equal(system1Producer?.physicalQualification?.P02,false);
 assert.equal(system1Producer?.physicalQualification?.readReserveAuthorized,false);
 assert.equal(system1Producer?.physicalQualification?.writeReserveAuthorized,false);
 assert.equal(reservePolicy?.readReserveNumberAuthorized,false);
 assert.equal(reservePolicy?.reserveNumberAuthorized,false);
 assert.equal(reservePolicy?.authorizedReadReserveRows,null);
 assert.equal(reservePolicy?.authorizedReserveRows,null);
 assert.equal(p03P05Metadata?.realAccountObservation?.runId,37941792137);
 assert.equal(p03P05Metadata?.realAccountObservation?.readHeadroomProven,false);
 assert.equal(p03P05Metadata?.realAccountObservation?.writeHeadroomProven,false);
 assert.equal(physicalClosure?.closureState,"PHYSICAL_GATES_PENDING_NO_VERIFIED_CLOSED");
 const m03=physicalClosure?.prerequisiteGates?.find(x=>x.id==="P03_MULTIWRITER_UTC_DAY");
 const m05=physicalClosure?.prerequisiteGates?.find(x=>x.id==="P05_ORIGINAL_PHYSICAL_CRITERIA");
 assert.equal(m03?.state,"PENDING");
 assert.equal(m05?.state,"PENDING");
 assert.ok(Array.isArray(matrix?.observedRuns)&&matrix.observedRuns.length===5);
 assert.equal(new Set(matrix.observedRuns.map(x=>x.runId)).size,5);
 const prioritySet=new Set();
 const observedClasses=new Set();
 for(const x of matrix.observedRuns){
  assert.ok(Number.isSafeInteger(x.runId)&&Number.isSafeInteger(x.jobId));
  assert.match(x.runHeadSha,sha);
  assert.equal(x.startedAt.slice(0,10),matrix.utcQuotaDay);
  assert.ok(["push","schedule"].includes(x.trigger));
  assert.equal(x.jobConclusion,"success","A workflow-level failure must not be labeled SUCCESS");
  assert.ok(["QUOTA_BUDGET_DEFER","PUSH_READ_ONLY_ONLY"].includes(x.gateState),
   "physical grant is forbidden in negative defer matrix");
  if(x.gateState==="QUOTA_BUDGET_DEFER")
   assert.equal(x.gateReason,"SYSTEM1_AFTER_MARKET_RESERVE_NOT_AUTHORIZED");
  else{
   assert.equal(x.trigger,"push");
   assert.equal(x.gateReason,"PUSH_NON_MUTATING_POLICY");
  }
  const owner=registry?.writers?.find(w=>w.id===x.writerId);
  assert.ok(owner&&owner.priority===x.priority&&owner.physicalMutation===true,
   "registry writer mismatch or no physical mutation class");
  if(x.gateState==="PUSH_READ_ONLY_ONLY")
   assert.equal(owner.pushPhysicalAllowed,false);
  assert.equal(x.writerClass,x.writerId);
  assert.ok(Array.isArray(x.physicalBusinessSteps)&&x.physicalBusinessSteps.length>=2);
  for(const step of x.physicalBusinessSteps)
   assert.equal(step.result,"skipped","physical business I/O must remain skipped");
  prioritySet.add(x.priority);observedClasses.add(x.writerId);
 }
 assert.deepEqual([...prioritySet].sort(),["P0","P2","P3"]);
 assert.equal(observedClasses.size,4);
 assert.equal(matrix?.p03?.documentedSupportChecks,3);
 assert.equal(matrix?.p03?.totalSupportChecks,8);
 assert.equal(matrix?.p03?.qualifiedSameUtcDayPostFixMultiwriterGrantAndResultCount,0);
 assert.deepEqual(matrix?.p03?.validReservationCheckIdsAndAuthenticatedHashesForPostFixGrants,[]);
 assert.equal(matrix?.p03?.physicalAcceptance,"PENDING");
 assert.equal(matrix?.p03?.realP0ProtectedAndP2P3DeferConfirmedFromThisMatrix,false);
 assert.equal(matrix?.p05?.realOctoberD1ScoutKeysRead,0);
 assert.equal(matrix?.p05?.realOctoberD1CensusKeysRead,0);
 assert.equal(matrix?.p05?.physicalMissingKeys,"UNKNOWN");
 assert.equal(matrix?.p05?.physicalAcceptance,"PENDING");
 assert.equal(matrix?.accountMetadataObservation?.spendableBudgetCertified,false);
 assert.equal(matrix?.crossSystemProducer?.reserveReadAuthorized,false);
 assert.equal(matrix?.crossSystemProducer?.reserveWriteAuthorized,false);
 assert.equal(matrix?.safety?.physicalD1WritesExecutedByEvidenceAssembly,0);
 assert.equal(matrix?.safety?.physicalD1SqlReadsExecutedByEvidenceAssembly,0);
 return Object.freeze({result:"ISSUE1026_REAL_CROSSWRITER_DEFER_EVIDENCE_VALIDATED_NON_AUTHORIZING",
  observedRealGateRuns:5,writerClasses:4,priorities:["P0","P2","P3"],
  p03PhysicalAcceptance:false,p05PhysicalAcceptance:false,
  realGrantedReservationCount:0,physicalD1SqlReadsAuthorized:false,
  physicalD1MutationAuthorized:false});
}
