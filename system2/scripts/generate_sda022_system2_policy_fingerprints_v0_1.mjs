import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import {
  buildStage1System2PolicyFingerprintSetV0_1,
  system2PolicyFingerprintSourceArtifactsV0_1,
} from "../runtime/system2_policy_fingerprint_v0_1.mjs";

const generatedAt=process.env.SYSTEM2_FINGERPRINT_GENERATED_AT || new Date().toISOString();
const outDir=process.env.SYSTEM2_FINGERPRINT_OUTPUT_DIR || "/tmp/system2-sda022-fingerprints";

for(const artifact of system2PolicyFingerprintSourceArtifactsV0_1()){
  const actual=execFileSync("git",["rev-parse","HEAD:"+artifact.path],{encoding:"utf8"}).trim();
  if(actual!==artifact.contentSha){
    throw new Error("SOURCE_ARTIFACT_DIGEST_MISMATCH:"+artifact.path+":"+actual+":"+artifact.contentSha);
  }
}

const set=await buildStage1System2PolicyFingerprintSetV0_1({generatedAt});
const byStrategy=Object.fromEntries(set.fingerprints.map(x=>[x.strategyId,x]));
await mkdir(outDir,{recursive:true});
await writeFile(
  outDir+"/system2_short_momentum_policy_fingerprint_receipt_v0_1.json",
  JSON.stringify(byStrategy.SHORT_MOMENTUM,null,2)+"\n",
  "utf8",
);
await writeFile(
  outDir+"/system2_swing_growth_policy_fingerprint_receipt_v0_1.json",
  JSON.stringify(byStrategy.SWING_GROWTH,null,2)+"\n",
  "utf8",
);
await writeFile(
  outDir+"/system2_stage1_policy_fingerprint_set_v0_1.json",
  JSON.stringify(set,null,2)+"\n",
  "utf8",
);

console.log(JSON.stringify({
  result:"SDA022_SYSTEM2_POLICY_FINGERPRINTS_GENERATED",
  generatedAt:set.generatedAt,
  fingerprints:set.fingerprints.map(x=>({
    strategyId:x.strategyId,
    strategyVersion:x.strategyVersion,
    policyId:x.policyId,
    policyVersion:x.policyVersion,
    fingerprintId:x.fingerprintId,
    fingerprintHash:x.fingerprintHash,
    candidateUniverseMode:x.candidateUniverseMode,
    requiresOtherSystemCandidateOutput:x.requiresOtherSystemCandidateOutput,
    requiresOtherSystemRankOutput:x.requiresOtherSystemRankOutput,
    rankingPolicy:x.rankingPolicy,
    capacityPolicy:x.capacityPolicy,
    primaryHorizonSessions:x.primaryHorizonSessions,
  })),
  sda022:set.sda022,
  outputDir:outDir,
},null,2));
