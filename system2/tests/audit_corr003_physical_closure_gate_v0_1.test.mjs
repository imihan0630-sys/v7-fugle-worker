import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// This test validates independent AUDIT_LANE *acceptance integrity*, not Cloudflare
// actual physical headroom. No external IO; its synthetic controls are NOT real receipts.
const queue=JSON.parse(readFileSync(new URL("../SYSTEM2_CORRECTION_QUEUE.json",import.meta.url),"utf8"));
const policy=JSON.parse(readFileSync(new URL("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",import.meta.url),"utf8"));
const closure=JSON.parse(readFileSync(new URL("../evidence/S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_20261009_V0_1.json",import.meta.url),"utf8"));
const correctionId="S2-CORR-20261007-003";
const ids=[
 "P01_SYSTEM1_WRITE_RESERVE",
 "P02_SYSTEM1_READ_RESERVE",
 "P03_MULTIWRITER_UTC_DAY",
 "P04_LATER_TRADING_DAY_SYSTEM1_PERSISTENCE",
 "P05_ORIGINAL_PHYSICAL_CRITERIA",
];
function evaluate(q,p,e) {
 const problems=[];
 const directive=(q.directives||[]).find(x=>x.directiveId===correctionId);
 if(!directive)problems.push("CORR003_MISSING");
 if(e.directiveId!==correctionId)problems.push("EVIDENCE_DIRECTIVE_ID_MISMATCH");
 const gates=e.prerequisiteGates||[];
 if(gates.length!==ids.length||new Set(gates.map(x=>x.id)).size!==ids.length||ids.some(id=>!gates.some(x=>x.id===id)))problems.push("PHYSICAL_GATE_INVENTORY_CHANGED");
 const allAccepted=gates.length===ids.length&&gates.every(x=>x.state==="INDEPENDENTLY_PHYSICAL_VERIFIED"&&x.evidenceQualified===true&&typeof x.proofRef==="string"&&x.proofRef.startsWith("system2/evidence/")&&
   x.physicalProof?.sourceType==="REAL_PHYSICAL_EXECUTION"&&
   Number.isSafeInteger(x.physicalProof.runId)&&x.physicalProof.runId>0&&
   Number.isSafeInteger(x.physicalProof.jobId)&&x.physicalProof.jobId>0&&
   /^([a-f0-9]{40})$/.test(x.physicalProof.immutableCommitSha||""));
 // This is a syntactic acceptance guard, not a substitute for an auditor
 // reading external job logs, reservation receipts, account totals and hashes.
 if(gates.some(x=>x.state==="INDEPENDENTLY_PHYSICAL_VERIFIED")&&!allAccepted)problems.push("INCOMPLETE_OR_UNSUPPORTED_PHYSICAL_GATE_PROMOTION");
 if(directive?.status==="VERIFIED_CLOSED"&&!allAccepted)problems.push("CORR003_CLOSED_WITHOUT_COMPLETE_PHYSICAL_PROOF");
 if(directive?.status==="VERIFIED_CLOSED"&&(p.reserveNumberAuthorized!==true||p.readReserveNumberAuthorized!==true||!Number.isSafeInteger(p.authorizedReserveRows)||!Number.isSafeInteger(p.authorizedReadReserveRows)||p.authorizedReserveRows<1||p.authorizedReadReserveRows<1))problems.push("CORR003_CLOSED_WITHOUT_SYSTEM1_READ_WRITE_RESERVES");
 if(e.closureState==="PHYSICAL_GATES_PENDING_NO_VERIFIED_CLOSED"&&directive?.status==="VERIFIED_CLOSED")problems.push("CORR003_CLOSURE_STATE_CONTRADICTION");
 if(e.documentedReadOnlyPhysicalObservations?.some(x=>x.type!=="REAL_GRAPHQL_ACCOUNT_LOWER_BOUND"||x.physicalD1Mutation!==false))problems.push("GRAPHQL_LOWER_BOUND_MISLABELED");
 if(e.historicalCollision?.accountRowsWritten!==e.historicalCollision?.system1RowsWritten+e.historicalCollision?.system2RowsWritten)problems.push("HISTORICAL_ACCOUNT_TOTAL_MISMATCH");
 return problems;
}
assert.deepEqual(evaluate(queue,policy,closure),[],"canonical CORR-003 closeout evidence must reconcile");
assert.equal(closure.prerequisiteGates.length,5);
assert.equal(closure.prerequisiteGates.filter(x=>x.evidenceQualified).length,0);
assert.equal(closure.documentedReadOnlyPhysicalObservations.length,2);
assert.equal(closure.sourceOnlyStorage.d1Readback36,"NOT_RUN");
assert.equal(closure.sourceOnlyStorage.d1Readback11843,"NOT_RUN");
assert.equal(policy.reserveNumberAuthorized,false);
assert.equal(policy.authorizedReserveRows,null);
assert.equal(policy.readReserveNumberAuthorized,false);
assert.equal(policy.authorizedReadReserveRows,null);
assert.equal(policy.observedWholeV7DailyRowsWritten.max,2825);
const clone=x=>structuredClone(x);
// Falsification controls ensure future source-only/CI evidence cannot bypass
// the accepted physical proof requirements by mutating a label alone.
{
 const q=clone(queue);
 q.directives.find(x=>x.directiveId===correctionId).status="VERIFIED_CLOSED";
 assert.ok(evaluate(q,policy,closure).includes("CORR003_CLOSED_WITHOUT_COMPLETE_PHYSICAL_PROOF"));
 assert.ok(evaluate(q,policy,closure).includes("CORR003_CLOSED_WITHOUT_SYSTEM1_READ_WRITE_RESERVES"));
}
{
 const e=clone(closure);
 e.prerequisiteGates[0].state="INDEPENDENTLY_PHYSICAL_VERIFIED";
 e.prerequisiteGates[0].evidenceQualified=true;
 e.prerequisiteGates[0].proofRef="system2/evidence/synthetic.json";
 assert.ok(evaluate(queue,policy,e).includes("INCOMPLETE_OR_UNSUPPORTED_PHYSICAL_GATE_PROMOTION"));
}
{
 const e=clone(closure);
 e.documentedReadOnlyPhysicalObservations[0].type="REAL_D1_WRITER_COMMIT";
 assert.ok(evaluate(queue,policy,e).includes("GRAPHQL_LOWER_BOUND_MISLABELED"));
}
{
 const e=clone(closure);
 e.historicalCollision.accountRowsWritten--;
 assert.ok(evaluate(queue,policy,e).includes("HISTORICAL_ACCOUNT_TOTAL_MISMATCH"));
}
{
 const e=clone(closure);
 e.prerequisiteGates.pop();
 assert.ok(evaluate(queue,policy,e).includes("PHYSICAL_GATE_INVENTORY_CHANGED"));
}
console.log("S2_CORR003_PHYSICAL_CLOSURE_GUARD "+JSON.stringify({
 status:"PASS_GUARD_EXECUTED_NOT_PHYSICAL_CLOSURE",
 independentSourceLevelA1A7:"PASS_PREVIOUSLY_DOCUMENTED",
 totalPhysicalGates:closure.prerequisiteGates.length,
 physicalGatesQualified:closure.prerequisiteGates.filter(x=>x.evidenceQualified).length,
 genuineGraphqlLowerBoundObservations:closure.documentedReadOnlyPhysicalObservations.length,
 accountCollisionHistoricalRowsWritten:closure.historicalCollision.accountRowsWritten,
 system1ReserveWriteAuthorized:policy.reserveNumberAuthorized,
 system1ReserveReadAuthorized:policy.readReserveNumberAuthorized,
 ticketStatus:queue.directives.find(x=>x.directiveId===correctionId)?.status,
 futurePhysicalAcceptanceRequired:true,
}));
