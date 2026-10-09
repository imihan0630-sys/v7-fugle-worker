import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

// Independent AUDIT_LANE frozen source/physical classification.
// Passing this test certifies cross-document provenance and rejection controls,
// NOT a real Cloudflare physical mutation, reserve approval or CORR-003 closure.
const load=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const audit=load("../evidence/S2_CORR003_AUDIT_5_PHYSICAL_19_ORIGINAL_FINAL_DISPOSITION_20261009_V0_1.json");
const queue=load("../SYSTEM2_CORRECTION_QUEUE.json");
const p01p05=load("../evidence/S2_CORR003_P01_P05_PHYSICAL_EVIDENCE_GAP_INVENTORY_20261009_V0_1.json");
const mapped=load("../evidence/S2_CORR003_ORIGINAL19_ACCEPTANCE_PROVENANCE_MAP_20261009_V0_1.json");
const physical=load("../evidence/S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_20261009_V0_1.json");
const policy=load("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json");
const p03=load("../evidence/S2_ISSUE1026_P03_REAL_MULTIWRITER_QUOTA_DEFER_MATRIX_20261009_V0_1.json");
const s1=load("../../research/SYSTEM1_ISSUE1024_PER_RUN_COST_PERSISTENCE_GATE_EVIDENCE_20261009_V0_1.json");
const p05=load("../evidence/S2_ISSUE1026_P05_FULL_11843_OFFICIAL_SOURCE_KEYS_REAL_ACCEPTANCE_20261009_V0_1.json");
const correction=queue.directives.find(x=>x.directiveId==="S2-CORR-20261007-003");
assert.ok(correction);
const clone=x=>structuredClone(x);
function validate(a,q,p,g,pl,writer,prod,official){
 const problems=[];
 const ticket=q.directives.find(x=>x.directiveId===a.directiveId);
 if(!ticket)problems.push("MISSING_CORRECTION");
 if(a.originalCriteria.length!==19||a.originalCriteria.some((x,i)=>x.number!==i+1||x.exactCanonicalCriterion!==ticket?.acceptanceCriteria?.[i]||x.exactCanonicalCriterion!==mapped.criteria[i]?.exactCanonicalCriterion))
  problems.push("ORIGINAL_CRITERION_MISMATCH");
 const tally=a.originalCriteria.reduce((c,x)=>(c[x.classification]=(c[x.classification]||0)+1,c),{});
 if(tally.INDEPENDENT_SOURCE_LEVEL_PASS_NOT_PHYSICAL_GATE_ACCEPTANCE!==15||tally.PHYSICAL_PROOF_MISSING!==3||tally.HISTORICAL_NEGATIVE_REAL_NO_POSTFIX_SUCCESS!==1)
  problems.push("ORIGINAL19_MISCLASSIFIED");
 if(a.originalCriteria.some(x=>x.physicalAcceptance!=="NOT_INDEPENDENTLY_ACCEPTED")||a.originalCriterionDispositionCounts.fullyClosedPhysical!==0)
  problems.push("SOURCE_OR_NEGATIVE_EVIDENCE_PROMOTED");
 if(a.fivePhysicalGates.length!==5||a.fivePhysicalGates.some(x=>x.independentlyPhysicalQualified||x.decision!=="PENDING"))
  problems.push("FIVE_PHYSICAL_GATES_MISREPRESENTED");
 const dataCounts=g.workPackages.map(x=>[x.id,x.supportChecksDocumented,x.supportChecksTotal]);
 for(const x of a.fivePhysicalGates){
  const target=dataCounts.find(y=>y[0]===x.id);
  if(!target||target[1]!==x.documentedSupportChecks||target[2]!==x.totalSupportChecks||x.missingSupportChecks!==x.totalSupportChecks-x.documentedSupportChecks)
   problems.push("PHYSICAL_SUPPORT_MISMATCH:"+x.id);
 }
 if(a.fivePhysicalGates.some(x=>!p.prerequisiteGates.some(z=>z.id===x.id&&z.state==="PENDING"&&!z.evidenceQualified)))
  problems.push("NOT_SUPPORTED_BY_PRIOR_AUDIT_PHYSICAL_MATRIX");
 if(g.supportChecksDocumentedTotal!==15||g.supportChecksTotal!==38||a.supportChecksDocumented!==15||a.supportChecksTotal!==38)
  problems.push("SUPPORT_COUNTS_MISMATCH");
 if(pl.reserveNumberAuthorized!==false||pl.readReserveNumberAuthorized!==false||pl.authorizedReserveRows!==null||pl.authorizedReadReserveRows!==null)
  problems.push("UNAUTHORIZED_SYSTEM1_RESERVE_PROMOTED");
 if(prod.existingRealReceipts?.moreHealthyDaysFound!==0||prod.existingRealReceipts?.fullyPersistedSameGenerationBusinessDatesVerified?.length!==0)
  problems.push("SYSTEM1_BUSINESS_EVIDENCE_MISCLASSIFIED");
 if(writer.observedRuns.length!==5||writer.observedRuns.some(x=>!["QUOTA_BUDGET_DEFER","PUSH_READ_ONLY_ONLY"].includes(x.gateState)))
  problems.push("REAL_P03_DEFER_EVIDENCE_PROMOTED");
 if(official.authoritativeBoundaries.hotD1KeyPresencePhysicallyCertified!==false||official.authoritativeBoundaries.realHotD1ScoutKeysQueried!==0||official.authoritativeBoundaries.realHotD1FullCensusKeysQueried!==0||official.authoritativeBoundaries.physicalMissingKeys!=="UNKNOWN")
  problems.push("SOURCE_ONLY_P05_PROMOTED");
 if(a.independentlyAcceptedPhysicalProofs?.length||a.physicalGatePassed!==0||a.verdict!=="NOT_ELIGIBLE_FOR_VERIFIED_CLOSED")
  problems.push("AUDIT_FALSE_PASS");
 if(ticket?.status==="VERIFIED_CLOSED"&&a.physicalGatePassed!==5)
  problems.push("QUEUE_CLOSED_DESPITE_UNACCEPTED_PHYSICAL_PROOF");
 if(a.independentRealReadbacks?.System1QuotaFailure?.[1]?.rowsWrittenAccount!==126498||
    a.independentRealReadbacks?.System1QuotaFailure?.[1]?.rowsWrittenSystem1+
      a.independentRealReadbacks?.System1QuotaFailure?.[1]?.rowsWrittenSystem2!==126498)
  problems.push("HISTORICAL_COLLISION_ARITHMETIC");
 return [...new Set(problems)];
}
assert.deepEqual(validate(audit,queue,physical,p01p05,policy,p03,s1,p05),[]);
{
 const q=clone(queue);q.directives.find(x=>x.directiveId===audit.directiveId).status="VERIFIED_CLOSED";
 assert.ok(validate(audit,q,physical,p01p05,policy,p03,s1,p05).includes("QUEUE_CLOSED_DESPITE_UNACCEPTED_PHYSICAL_PROOF"));
}
{
 const a=clone(audit);a.originalCriteria[9].classification="INDEPENDENT_SOURCE_LEVEL_PASS_NOT_PHYSICAL_GATE_ACCEPTANCE";
 assert.ok(validate(a,queue,physical,p01p05,policy,p03,s1,p05).includes("ORIGINAL19_MISCLASSIFIED"));
}
{
 const a=clone(audit);a.fivePhysicalGates[2].independentlyPhysicalQualified=true;
 assert.ok(validate(a,queue,physical,p01p05,policy,p03,s1,p05).includes("FIVE_PHYSICAL_GATES_MISREPRESENTED"));
}
{
 const a=clone(audit);a.originalCriteria[15].physicalAcceptance="INDEPENDENTLY_ACCEPTED";
 assert.ok(validate(a,queue,physical,p01p05,policy,p03,s1,p05).includes("SOURCE_OR_NEGATIVE_EVIDENCE_PROMOTED"));
}
{
 const d=clone(p05);d.authoritativeBoundaries.realHotD1ScoutKeysQueried=36;
 assert.ok(validate(audit,queue,physical,p01p05,policy,p03,s1,d).includes("SOURCE_ONLY_P05_PROMOTED"));
}
console.log("S2_CORR003_INDEPENDENT_5GATE_19CRITERIA_AUDIT "+JSON.stringify({
 verdict:audit.verdict,originalCriteriaAudited:audit.originalCriteria.length,
 originalSourceLevelOnly:15,originalProspectivePhysicalPending:3,originalHistoricalNegative:1,
 independentlyPhysicalAccepted:0,physicalGateTotal:5,
 supportChecksDocumented:15,supportChecksTotal:38,
 allFivePhysicalGatesPending:true,system1WriteReadReserveAuthorized:false,
 physicalCloudflareQueriesThisAudit:0,noClosureAuthorityGranted:true,
}));
