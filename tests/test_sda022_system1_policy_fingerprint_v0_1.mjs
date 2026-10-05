import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";

const receiptPath=new URL("../shared-knowledge/system1_policy_fingerprint_receipt_v0_1.json",import.meta.url);
const schemaPath=new URL("../shared-knowledge/cross_system_policy_fingerprint_receipt_schema_v0_1.json",import.meta.url);
const baselinePath=new URL("../shared-knowledge/system1_system2_policy_fingerprint_baseline_20261006_v0_1.json",import.meta.url);
const receipt=JSON.parse(await readFile(receiptPath,"utf8"));
const schema=JSON.parse(await readFile(schemaPath,"utf8"));
const baseline=JSON.parse(await readFile(baselinePath,"utf8"));

for(const key of schema.required) assert.ok(Object.hasOwn(receipt,key),"missing schema-required field: "+key);
assert.equal(receipt.schemaVersion,"CROSS_SYSTEM_POLICY_FINGERPRINT_RECEIPT_V0_1");
assert.equal(receipt.systemId,"SYSTEM1");
assert.equal(receipt.strategyId,null);
assert.equal(receipt.strategyVersion,null);
assert.equal(receipt.authorityState,"FORMAL_LOCKED");
assert.equal(receipt.formalMutation,false);

const canonical=value=>Array.isArray(value)?value.map(canonical):
  value&&typeof value==="object"?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
const material=structuredClone(receipt);delete material.fingerprintHash;delete material.generatedAt;
const hash=createHash("sha256").update(JSON.stringify(canonical(material))).digest("hex");
assert.equal(receipt.fingerprintHash,hash,"fingerprintHash must bind stable policy material");

const gitBlobSha=async path=>{
  const bytes=await readFile(new URL("../"+path,import.meta.url));
  return createHash("sha1").update(Buffer.from("blob "+bytes.length+"\0")).update(bytes).digest("hex");
};
for(const source of receipt.sourceArtifacts){
  assert.equal(await gitBlobSha(source.path),source.contentSha,"source artifact drift: "+source.path);
}

assert.equal(receipt.candidateUniverseMode,"INDEPENDENT_AUTHORIZED_UNIVERSE");
assert.equal(receipt.requiresOtherSystemCandidateOutput,false,"S22-T03: System1 must not require System2 candidates");
assert.equal(receipt.requiresOtherSystemRankOutput,false,"S22-T03: System1 must not require System2 rank");
assert.ok(receipt.gateFamilyIds.includes("AB_SETUP"));
assert.ok(receipt.gateFamilyIds.includes("PRICE_FLOOR"));
assert.ok(receipt.gateFamilyIds.includes("OUTER_SOURCE_AUTHENTICITY"));

assert.equal(receipt.rankingPolicy.rankingMechanism,"SYSTEM1_FORMAL_COMPARATOR");
assert.deepEqual(receipt.rankingPolicy.orderedComparatorFields,
  ["priorityScore","rewardPerRisk","marketConsensusScore","setupQuality","sectorFlow","relativeStrength"]);
const patch=await readFile(new URL("../scripts/apply_v7_5_30.py",import.meta.url),"utf8");
assert.match(patch,/b\.priorityScore - a\.priorityScore \|\| b\.rewardPerRisk - a\.rewardPerRisk/);
assert.match(patch,/\(b\.marketConsensusScore \|\| 0\) - \(a\.marketConsensusScore \|\| 0\)/);
assert.match(patch,/b\.setupQuality - a\.setupQuality \|\| b\.sectorFlow - a\.sectorFlow \|\| b\.relativeStrength - a\.relativeStrength/);

assert.equal(receipt.capacityPolicy.policyId,"TOP6_3PLUS3");
assert.deepEqual(
  [receipt.capacityPolicy.generalPoolMax,receipt.capacityPolicy.thousandPoolMax,receipt.capacityPolicy.totalMax,
   receipt.capacityPolicy.crossPoolTransfer,receipt.capacityPolicy.forcedFill],
  [3,3,6,false,false]
);
assert.equal(receipt.entryConfirmationPolicy.primaryBarMinutes,15);
assert.equal(receipt.entryConfirmationPolicy.auxiliaryBarMinutes,10);
assert.equal(receipt.entryConfirmationPolicy.system2UniversalGate,false);
assert.equal(receipt.lifecyclePolicy.requiresSystem2State,false);

assert.equal(baseline.system1.policyId,receipt.policyId);
assert.equal(baseline.system1.candidateUniverseMode,receipt.candidateUniverseMode);
assert.equal(baseline.system1.requiresSystem2Candidates,receipt.requiresOtherSystemCandidateOutput);
assert.equal(baseline.system1.requiresSystem2Rank,receipt.requiresOtherSystemRankOutput);
assert.deepEqual(baseline.system1.ranking.order,receipt.rankingPolicy.orderedComparatorFields);
assert.equal(baseline.system1.capacity.generalMax,receipt.capacityPolicy.generalPoolMax);
assert.equal(baseline.system1.capacity.thousandMax,receipt.capacityPolicy.thousandPoolMax);
assert.equal(baseline.system1.capacity.totalMax,receipt.capacityPolicy.totalMax);
assert.equal(baseline.system1.entryConfirmation,"FORMAL_15M");

console.log(JSON.stringify({
  ok:true,
  tests:["S22-T01","S22-T02","S22-T03","S22-T04","S22-T05"],
  fingerprintId:receipt.fingerprintId,
  fingerprintHash:receipt.fingerprintHash,
  system2CandidateDependency:false,
  system2RankDependency:false,
  formalMutation:false
}));
