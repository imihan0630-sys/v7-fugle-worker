import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {collectVerifiedC1C2} from '../research/system1_c1_c2_collection_v0_1.mjs';
import {previousTaipeiDate,collectC1ReadOnlyPreflight} from '../research/system1_c1_readiness_v0_1.mjs';
import {buildC3Registration} from '../research/system1_c3_registration_v0_1.mjs';

const origin=String(process.env.V7_ORIGIN||'https://fugle-test.imihan0630.workers.dev').replace(/\/$/,'');
const token=String(process.env.V7_ADMIN_TOKEN||'');
const scanDate=String(process.env.C1_SCAN_DATE||previousTaipeiDate()).trim();
const output=resolve(process.env.C1_EVIDENCE_OUTPUT||'artifacts/system1-c1-evidence.json');
const pairedOutput=resolve(process.env.C2_EVIDENCE_OUTPUT||'artifacts/system1-c2-paired.json');
const statusPath=resolve(process.env.C1_READINESS_OUTPUT||'artifacts/system1-c1-readiness.json');
const c3RegistrationPath=resolve(process.env.C3_REGISTRATION_OUTPUT||'artifacts/system1-c3-registration.json');
const registerC3=String(process.env.C3_REGISTER||'').trim().toLowerCase()==='true';
const save=async(path,value)=>{await mkdir(dirname(path),{recursive:true});await writeFile(path,JSON.stringify(value,null,2)+'\n','utf8');};
try {
  const {pages,adapted,diagnosis,paired,scanProof,zeroPickProspective,shadowCohort,c4RankingRedundancy,setupChannelScale,marketCapConditionalAdmission}=await collectVerifiedC1C2({origin,token,scanDate});
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
    diagnosis,zeroPickProspective,shadowCohort,c4RankingRedundancy,setupChannelScale,marketCapConditionalAdmission,safety:{researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      noPlanChanges:true,noTrade:true,noPush:true}};
  const pairedArtifact={...paired,scanProof};
  await save(output,artifact);await save(pairedOutput,pairedArtifact);
  console.log(JSON.stringify({ok:true,output,pairedOutput,scanDate,generationId:adapted.generationId,
    populationN:diagnosis.populationN,coverageComplete:true,formalCoreImpact:false}));
  if(registerC3){
    try{
      const headers={'x-admin-token':token,'accept':'application/json','content-type':'application/json'};
      const configResponse=await fetch(origin+'/api/config',{headers,signal:AbortSignal.timeout(30000)});
      if([401,403].includes(configResponse.status)) throw new Error('C3_REGISTRATION_AUTHORIZATION_REJECTED');
      const config=await configResponse.json().catch(()=>null);
      if(!configResponse.ok||!config) throw new Error('C3_REGISTRATION_CONFIG_HTTP_'+configResponse.status);
      const registration=buildC3Registration(artifact,pairedArtifact,config,{
        maxShadowSymbols:3,providerBudgetCallsPerSession:102,includeConditionalSafetyUnknown:true
      });
      if(!registration.postRequired){
        await save(c3RegistrationPath,{...registration,registered:false,observedAt:new Date().toISOString(),
          targetTradeDate:null,serverReadback:null});
        console.log(JSON.stringify({c3Registration:true,status:registration.status,generationId:registration.generationId,
          extraShadowN:0,noPlanChanges:true,noTrade:true,noPush:true}));
      }else{
        const response=await fetch(origin+'/api/research/c3-capture-cohort',{
          method:'POST',headers,body:JSON.stringify(registration.payload),signal:AbortSignal.timeout(45000)
        });
        if([401,403].includes(response.status)) throw new Error('C3_REGISTRATION_AUTHORIZATION_REJECTED');
        const result=await response.json().catch(()=>null);
        if(!response.ok||!result?.ok) throw new Error('C3_REGISTRATION_HTTP_'+response.status+'_'+String(result?.error||'').slice(0,160));
        if(result.generationId!==registration.generationId||!result.targetTradeDate||
           Number(result.symbols)!==registration.extraShadowN) throw new Error('C3_REGISTRATION_SERVER_READBACK_MISMATCH');
        await save(c3RegistrationPath,{...registration,payload:undefined,registered:true,observedAt:new Date().toISOString(),
          targetTradeDate:result.targetTradeDate,cohortDigest:result.cohortDigest||null,idempotent:result.idempotent===true,
          serverReadback:{generationId:result.generationId,targetTradeDate:result.targetTradeDate,
            cohortDigest:result.cohortDigest||null,symbols:result.symbols,requiredCalls:result.requiredCalls,
            researchOnly:result.researchOnly,decisionImpact:result.decisionImpact,formalCoreImpact:result.formalCoreImpact,
            noPlanChanges:result.noPlanChanges,noTrade:result.noTrade,noPush:result.noPush}});
        console.log(JSON.stringify({c3Registration:true,status:'REGISTERED',generationId:registration.generationId,
          targetTradeDate:result.targetTradeDate,extraShadowN:registration.extraShadowN,
          requiredExtraCandleCalls:registration.requiredExtraCandleCalls,requiredExtraQuoteCalls:registration.requiredExtraQuoteCalls,
          requiredExtraProviderCalls:registration.requiredExtraProviderCalls,noPlanChanges:true,noTrade:true,noPush:true}));
      }
    }catch(registrationError){
      const message=String(registrationError?.message||registrationError).slice(0,300);
      await save(c3RegistrationPath,{schemaVersion:'SYSTEM1_C3_REGISTRATION_BLOCKER_V0_1',
        observedAt:new Date().toISOString(),status:'BLOCKED',error:message,registered:false,
        generationId:adapted.generationId,sessionDate:adapted.sessionDate,researchOnly:true,decisionImpact:false,
        formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true});
      console.error(JSON.stringify({c3RegistrationBlocked:true,error:message,c3RegistrationPath,
        generationId:adapted.generationId,noPlanChanges:true,noTrade:true,noPush:true}));
      process.exitCode=1;
    }
  }
}catch(error){
  const receiptError=error.code||'C1_VERIFICATION_FAILED';
  const readiness=await collectC1ReadOnlyPreflight({origin,token,scanDate,receiptError,receiptHttpStatus:error.httpStatus||200});
  await save(statusPath,{observedAt:new Date().toISOString(),...readiness,
    verificationFailure:receiptError,mayCountAsZeroPick:false,eligibleForResearch:false});
  console.error(JSON.stringify({c1EvidenceBlocked:true,scanDate,category:readiness.category,
    verificationFailure:receiptError,statusPath,mayCountAsZeroPick:false,noPlanChanges:true}));
  process.exitCode=1;
}
