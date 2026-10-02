import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {collectVerifiedC1C2} from '../research/system1_c1_c2_collection_v0_1.mjs';
import {previousTaipeiDate,collectC1ReadOnlyPreflight} from '../research/system1_c1_readiness_v0_1.mjs';

const origin=String(process.env.V7_ORIGIN||'https://fugle-test.imihan0630.workers.dev').replace(/\/$/,'');
const token=String(process.env.V7_ADMIN_TOKEN||'');
const scanDate=String(process.env.C1_SCAN_DATE||previousTaipeiDate()).trim();
const output=resolve(process.env.C1_EVIDENCE_OUTPUT||'artifacts/system1-c1-evidence.json');
const pairedOutput=resolve(process.env.C2_EVIDENCE_OUTPUT||'artifacts/system1-c2-paired.json');
const statusPath=resolve(process.env.C1_READINESS_OUTPUT||'artifacts/system1-c1-readiness.json');
const save=async(path,value)=>{await mkdir(dirname(path),{recursive:true});await writeFile(path,JSON.stringify(value,null,2)+'\n','utf8');};
try {
  const {pages,adapted,diagnosis,paired,scanProof}=await collectVerifiedC1C2({origin,token,scanDate});
  const gateTotals={},firstFailures={};
  for(const row of diagnosis.observations){
    for(const [gate,observation] of Object.entries(row.gates)){
      gateTotals[gate]??={PASS:0,FAIL:0,UNKNOWN:0};gateTotals[gate][observation.status]++;
    }
    const reason=row.firstFailureReason||(row.formalResult?.ok===true?'QUALIFIED':'UNKNOWN');
    firstFailures[reason]=(firstFailures[reason]||0)+1;
  }
  const artifact={schemaVersion:'SYSTEM1_C1_EVIDENCE_ARTIFACT_V0_1',collectedAt:new Date().toISOString(),origin,
    receipt:{generationId:adapted.generationId,sessionDate:adapted.sessionDate,decisionAt:adapted.decisionAt,
      sourceMainSha:adapted.sourceMainSha,effectiveRuntimeVersion:adapted.effectiveRuntimeVersion,
      contentDigest:adapted.contentDigest,universeDigest:adapted.universeDigest,
      captureCompleteness:adapted.captureCompleteness,pages:pages.length},scanProof,
    summary:{populationN:diagnosis.populationN,capturedN:diagnosis.capturedN,coverageComplete:true,
      selectedN:paired.tally.formalSelectedN,qualifiedN:paired.tally.formalQualifiedN,firstFailures,gateTotals,
      overlaps:diagnosis.overlaps,samples:diagnosis.samples,economicSuperiority:'UNKNOWN',fullFormalCounterfactual:false},
    diagnosis,safety:{researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      noPlanChanges:true,noTrade:true,noPush:true}};
  await save(output,artifact);await save(pairedOutput,{...paired,scanProof});
  console.log(JSON.stringify({ok:true,output,pairedOutput,scanDate,generationId:adapted.generationId,
    populationN:diagnosis.populationN,coverageComplete:true,formalCoreImpact:false}));
}catch(error){
  const receiptError=error.code||'C1_VERIFICATION_FAILED';
  const readiness=await collectC1ReadOnlyPreflight({origin,token,scanDate,receiptError,receiptHttpStatus:error.httpStatus||200});
  await save(statusPath,{observedAt:new Date().toISOString(),...readiness,
    verificationFailure:receiptError,mayCountAsZeroPick:false,eligibleForResearch:false});
  console.error(JSON.stringify({c1EvidenceBlocked:true,scanDate,category:readiness.category,
    verificationFailure:receiptError,statusPath,mayCountAsZeroPick:false,noPlanChanges:true}));
  process.exitCode=1;
}
