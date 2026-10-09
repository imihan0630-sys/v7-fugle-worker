import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateIssue1026P03DeferMatrixV0_1 as validate}
 from "../runtime/issue1026_p03_cross_writer_defer_validate_v0_1.mjs";
const read=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const matrix=await read("evidence/S2_ISSUE1026_P03_REAL_MULTIWRITER_QUOTA_DEFER_MATRIX_20261009_V0_1.json");
const registry=await read("config/d1_account_writer_registry_v0_1.json");
const system1Producer=await read("../research/SYSTEM1_ISSUE1024_P01_P02_P04_REAL_GITHUB_D1_PRODUCER_EVIDENCE_20261009_V0_1.json");
const reservePolicy=await read("evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json");
const p03P05Metadata=await read("evidence/S2_ISSUE1026_P03_P05_ACCOUNT_GRAPHQL_NONAUTHORIZING_REAL_RUN_20261009_V0_1.json");
const physicalClosure=await read("evidence/S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_20261009_V0_1.json");
const base={matrix,registry,system1Producer,reservePolicy,p03P05Metadata,physicalClosure};
const result=validate(base);
assert.equal(result.observedRealGateRuns,5);
assert.equal(result.writerClasses,4);
assert.equal(result.p03PhysicalAcceptance,false);
assert.equal(result.p05PhysicalAcceptance,false);
assert.equal(result.realGrantedReservationCount,0);
const change=(fn)=>{const cloned=structuredClone(matrix);fn(cloned);return cloned};
for(const [name,mutant] of [
 ["forged grant",change(x=>x.observedRuns[0].gateState="QUOTA_RESERVATION_GRANTED")],
 ["forged physical P0 write",change(x=>x.observedRuns[1].physicalBusinessSteps[0].result="success")],
 ["fake physical P03 closure",change(x=>x.p03.physicalAcceptance="PASS")],
 ["fake P05 readback",change(x=>x.p05.realOctoberD1ScoutKeysRead=36)],
 ["fake missing 0",change(x=>x.p05.physicalMissingKeys=0)],
 ["forged day",change(x=>x.observedRuns[0].startedAt="2026-10-08T08:21:34Z")],
 ["forged writer",change(x=>x.observedRuns[0].writerId="UNREGISTERED_PHYSICAL_WRITER")],
 ["counterfeited reserve",change(x=>x.crossSystemProducer.reserveWriteAuthorized=true)],
 ["fake P0 authority",change(x=>x.p03.realP0ProtectedAndP2P3DeferConfirmedFromThisMatrix=true)],
 ["fake post-fix grant",change(x=>x.p03.qualifiedSameUtcDayPostFixMultiwriterGrantAndResultCount=1)],
 ["metadata unearned headroom",change(x=>x.accountMetadataObservation.spendableBudgetCertified=true)],
 ["fake priority",change(x=>x.observedRuns[2].priority="P0")],
]){
 assert.throws(()=>validate({...base,matrix:mutant}),undefined,name);
}
assert.throws(()=>validate({...base,reservePolicy:{...reservePolicy,readReserveNumberAuthorized:true,authorizedReadReserveRows:133037}}));
assert.throws(()=>validate({...base,system1Producer:{...system1Producer,physicalQualification:{...system1Producer.physicalQualification,P02:true}}}));
assert.throws(()=>validate({...base,p03P05Metadata:{...p03P05Metadata,realAccountObservation:{...p03P05Metadata.realAccountObservation,readHeadroomProven:true}}}));
assert.throws(()=>validate({...base,physicalClosure:{...physicalClosure,closureState:"VERIFIED_CLOSED"}}));
console.log("S2_ISSUE1026_P03_REAL_FIVE_WRITER_GATES_AND_16_ADVERSARIAL_CASES_PASS_NONAUTHORIZING");
