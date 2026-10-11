import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const load=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const proof=load("../evidence/S2_CORR003_INDEPENDENT_PHYSICAL_AND_ORIGINAL19_REVERIFY_20261011_V0_1.json");
const q=load("../SYSTEM2_CORRECTION_QUEUE.json");
const policy=load("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json");
const canonical=load("../evidence/S2_CORR003_ORIGINAL19_ACCEPTANCE_PROVENANCE_MAP_20261009_V0_1.json");
const gaps=load("../evidence/S2_CORR003_P01_P05_PHYSICAL_EVIDENCE_GAP_INVENTORY_20261009_V0_1.json");
const ticket=q.directives.find(x=>x.directiveId==="S2-CORR-20261007-003");
assert(ticket);
assert.equal(ticket.status,"VERIFYING");
assert.equal(proof.final,"BLOCKED_NOT_ELIGIBLE_FOR_VERIFIED_CLOSED");
assert.equal(proof.originalNineteen.total,19);
assert.equal(proof.originalNineteen.criteria.length,19);
assert.equal(proof.originalNineteen.sourceOnlyPriorAccepted,15);
assert.deepEqual(proof.originalNineteen.prospectivePhysicalPendingIds,[10,14,15]);
assert.equal(proof.originalNineteen.historicalNegativeNotForwardPassId,16);
assert.equal(proof.originalNineteen.independentlyFullyClosed,0);
for(let i=0;i<19;i++){
 const c=proof.originalNineteen.criteria[i];
 assert.equal(c.id,i+1);
 assert.equal(c.verbatim,ticket.acceptanceCriteria[i]);
 assert.equal(c.verbatim,canonical.criteria[i].exactCanonicalCriterion);
 assert.equal(c.fullyClosed,false);
 if([10,14,15].includes(c.id))assert.equal(c.physicalDisposition,"PHYSICAL_PROOF_PENDING");
 if(c.id===16)assert.equal(c.physicalDisposition,"HISTORICAL_QUOTA_COLLISION_NEGATIVE_FORWARD_NO_COLLISION_UNVERIFIED");
}
assert.equal(proof.fivePhysicalGates.length,5);
for(const gate of proof.fivePhysicalGates){
 const inherited=gaps.workPackages.find(g=>g.id===gate.id);
 assert(inherited);
 assert.equal(gate.documented,inherited.supportChecksDocumented);
 assert.equal(gate.total,inherited.supportChecksTotal);
 assert.equal(gate.missing,gate.total-gate.documented);
 assert.equal(gate.physicalAccepted,false);
}
assert.deepEqual([proof.supportEvidence.documented,proof.supportEvidence.total,proof.supportEvidence.qualifiedPhysical],[15,38,0]);
assert.equal(policy.reserveNumberAuthorized,false);
assert.equal(policy.readReserveNumberAuthorized,false);
assert.equal(policy.authorizedReserveRows,null);
assert.equal(policy.authorizedReadReserveRows,null);
assert.equal(proof.protectionPolicy.system1WriteReserveAuthorized,false);
assert.equal(proof.protectionPolicy.system1ReadReserveAuthorized,false);
assert.equal(proof.independentPhysicalReadbacks.P05.scoutKeysPhysicallyRead,0);
assert.equal(proof.independentPhysicalReadbacks.P05.censusKeysPhysicallyRead,0);
assert.equal(proof.independentPhysicalReadbacks.P05.missingKeys,"UNKNOWN");
assert.equal(proof.independentPhysicalReadbacks.P03.newSuccessfulAuthenticatedMultiwriterGrantedMutationResultCount,0);
assert.equal(proof.independentPhysicalReadbacks.P04.normalNaturalLaterTradingDaySameGenerationKVandD1Persist,"NOT_PROVEN");
assert.equal(proof.separateDestinationSchemaMilestone.accepted,true);
assert.equal(proof.separateDestinationSchemaMilestone.doesNotQualifySharedOldAccountQuotaOrProductionPersistence,true);
const ex=proof.freshProducerIntake.pr1121.clockDefect;
assert.equal(Date.parse(ex.actualUtcExample),Date.parse(ex.correctTaipeiExample));
assert.equal(Date.parse(ex.invalidLabeledTaipeiExample)-Date.parse(ex.actualUtcExample),-8*3600_000);
assert.equal(ex.count,12);
assert.equal(proof.freshProducerIntake.pr1121.status,"OPEN_UNMERGED");
assert.equal(proof.freshProducerIntake.pr1122.status,"OPEN_UNMERGED");
const mutations=[
 ["physical_gate_forgery",x=>x.fivePhysicalGates[0].physicalAccepted=true],
 ["old_quota_policy_forgery",x=>x.protectionPolicy.system1WriteReserveAuthorized=true],
 ["P03_fake_write",x=>x.independentPhysicalReadbacks.P03.newSuccessfulAuthenticatedMultiwriterGrantedMutationResultCount=1],
 ["P05_fake_scout",x=>x.independentPhysicalReadbacks.P05.scoutKeysPhysicallyRead=36],
 ["P05_source_only_spoof",x=>x.independentPhysicalReadbacks.P05.missingKeys=0],
 ["P04_relabel",x=>x.independentPhysicalReadbacks.P04.normalNaturalLaterTradingDaySameGenerationKVandD1Persist="PASS"],
 ["promote_destination_schema",x=>x.separateDestinationSchemaMilestone.doesNotQualifySharedOldAccountQuotaOrProductionPersistence=false],
 ["promote_criterion10",x=>x.originalNineteen.criteria[9].fullyClosed=true],
 ["clock_false_repair",x=>x.freshProducerIntake.pr1121.clockDefect.correctTaipeiExample=x.freshProducerIntake.pr1121.clockDefect.invalidLabeledTaipeiExample],
 ["merged_pr_forgery",x=>x.freshProducerIntake.pr1121.status="MERGED"],
];
const qualified=x=> x.fivePhysicalGates.every(g=>g.physicalAccepted===false)
 && !x.protectionPolicy.system1WriteReserveAuthorized
 && !x.protectionPolicy.system1ReadReserveAuthorized
 && x.independentPhysicalReadbacks.P03.newSuccessfulAuthenticatedMultiwriterGrantedMutationResultCount===0
 && x.independentPhysicalReadbacks.P05.scoutKeysPhysicallyRead===0
 && x.independentPhysicalReadbacks.P05.missingKeys==="UNKNOWN"
 && x.independentPhysicalReadbacks.P04.normalNaturalLaterTradingDaySameGenerationKVandD1Persist==="NOT_PROVEN"
 && x.separateDestinationSchemaMilestone.doesNotQualifySharedOldAccountQuotaOrProductionPersistence
 && x.originalNineteen.criteria.every(y=>!y.fullyClosed)
 && Date.parse(x.freshProducerIntake.pr1121.clockDefect.actualUtcExample)===Date.parse(x.freshProducerIntake.pr1121.clockDefect.correctTaipeiExample)
 && x.freshProducerIntake.pr1121.status==="OPEN_UNMERGED";
assert(qualified(proof));
for(const [label,mutate] of mutations){const x=structuredClone(proof);mutate(x);assert(!qualified(x),label);}
console.log("S2_CORR003_INDEPENDENT_REVERIFY_20261011 "+JSON.stringify({
 result:"PASS_NO_FALSE_PHYSICAL_PROMOTION",originalCriteria:19,sourceOnly:15,physicalPending:3,historicalNegative:1,
 physicalGatesPassed:0,physicalGatesTotal:5,supportEvidence:"15/38",
 producerClockDefects:12,negativeProbes:mutations.length,cloudflareOperations:0,
 formalVerdict:"HIGH_VERIFYING_NOT_VERIFIED_CLOSED"
}));
