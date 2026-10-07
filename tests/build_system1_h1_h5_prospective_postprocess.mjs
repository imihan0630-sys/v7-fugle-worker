import {readFile,mkdir,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {buildSystem1H1H5ProspectiveReadiness} from "../research/system1_h1_h5_prospective_readiness_v0_1.mjs";

const c1Path=resolve(process.env.C1_EVIDENCE_OUTPUT||"artifacts/system1-c1-evidence.json");
const c2Path=resolve(process.env.C2_EVIDENCE_OUTPUT||"artifacts/system1-c2-paired.json");
const c3Path=resolve(process.env.C3_REGISTRATION_OUTPUT||"artifacts/system1-c3-registration.json");
const readinessPath=resolve(process.env.H1_H5_READINESS_OUTPUT||"artifacts/system1-h1-h5-readiness.json");
const c5Path=resolve(process.env.C5_SHORT_OUTPUT||"artifacts/system1-c5-short.json");
const bridgePath=resolve(process.env.OPPORTUNITY_LOSS_OUTPUT||"artifacts/system1-opportunity-loss-v0.3.json");
const json=async p=>JSON.parse(await readFile(p,"utf8"));
const save=async(p,v)=>{await mkdir(dirname(p),{recursive:true});await writeFile(p,JSON.stringify(v,null,2)+"\n","utf8");};

const c1Artifact=await json(c1Path);
const c2Artifact=await json(c2Path);
const c3Registration=await json(c3Path).catch(()=>null);
if(c1Artifact?.safety?.researchOnly!==true||c1Artifact?.diagnosis?.coverageComplete!==true)
  throw new Error("H1_H5_COMPLETE_C1_ARTIFACT_REQUIRED");
if(c2Artifact?.completeMatchedCohort!==true||c2Artifact?.researchOnly!==true)
  throw new Error("H1_H5_COMPLETE_C2_ARTIFACT_REQUIRED");

const result=buildSystem1H1H5ProspectiveReadiness({
  c1Diagnosis:c1Artifact.diagnosis,c2Ledger:c2Artifact,c3Registration
});
await save(readinessPath,{
  schemaVersion:result.schemaVersion,sessionDate:result.sessionDate,generationId:result.generationId,
  populationN:result.populationN,hypotheses:result.hypotheses,targetProvenanceAudit:result.targetProvenanceAudit,
  immediateT0:result.immediateT0,deferredT1:result.deferredT1,
  economicSuperiority:result.economicSuperiority,formalOptimizationCandidate:result.formalOptimizationCandidate,
  autoSwitchAuthorized:false,formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
  noPlanChanges:true,noTrade:true,noPush:true
});
await save(c5Path,result.c5Diagnostic);
await save(bridgePath,result.opportunityLossBridge);
console.log(JSON.stringify({
  ok:true,sessionDate:result.sessionDate,generationId:result.generationId,
  h1:result.hypotheses[0].state,h2:result.hypotheses[1].state,h3:result.hypotheses[2].state,
  h4:result.hypotheses[3].state,h5:result.hypotheses[4].state,
  targetUnknownSourceN:result.targetProvenanceAudit.unknownSourceN,
  researchOnly:true,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
}));
