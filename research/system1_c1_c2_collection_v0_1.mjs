import {collectShadowCohortEvidence} from './system1_shadow_cohort_collection_v0_1.mjs';
import {adaptC1PopulationPages,diagnosePopulation} from './system1_selection_isolated_v0_1.mjs';
import {buildC2ProspectivePairedLedger} from './system1_c2_paired_ledger_v0_1.mjs';
import {verifyC1ZeroPickProspectiveEvidence} from './system1_zero_pick_evidence_collector_v0_1.mjs';
import {collectC4RankingRedundancyEvidence} from './system1_c4_ranking_collection_v0_1.mjs';
import {buildSystem1SetupChannelScaleAudit} from './system1_setup_channel_scale_audit_v0_1.mjs';
import {buildSystem1MarketCapConditionalAdmissionAudit} from './system1_market_cap_conditional_admission_v0_1.mjs';
import {buildSystem1FirstFailureMaskingAudit} from './system1_first_failure_masking_audit_v0_1.mjs';
function blocked(code,httpStatus=200){const e=new Error(code);e.code=code;e.httpStatus=httpStatus;return e;}

// Authorized GETs only. Both artifacts use these exact verified page objects.
export async function collectVerifiedC1C2({origin,token,scanDate,request=fetch,timeoutMs=30000}) {
  if(!token) throw blocked('AUTHORIZATION_BLOCKED',401);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(scanDate||'')) throw blocked('SCAN_DATE_REQUIRED');
  const headers={'x-admin-token':token,accept:'application/json','cache-control':'no-cache'};
  const read=async url=>{
    let response,body;
    try{response=await request(url,{method:'GET',headers,signal:AbortSignal.timeout(timeoutMs)});}
    catch{throw blocked('C1_TRANSPORT_FAILED');}
    try{body=await response.json();}catch{throw blocked('C1_INVALID_JSON',response.status);}
    if(!response.ok) throw blocked([401,403].includes(response.status)?'AUTHORIZATION_BLOCKED':'C1_HTTP_FAILED',response.status);
    if(body?.ok===false) throw blocked(body.error==='C1_GENERATION_NOT_FOUND'?body.error:'C1_READ_FAILED',response.status);
    return body;
  };
  const pages=[];let generationId=null,cursor=0;
  for(let count=0;count<100;count++){
    const url=new URL('/api/research/c1-population',origin);
    url.searchParams.set('cursor',String(cursor));url.searchParams.set('limit','2');
    url.searchParams.set(generationId?'generationId':'scanDate',generationId||scanDate);
    const body=await read(url);
    if(body?.ok!==true||body.header?.sessionDate!==scanDate) throw blocked('C1_SESSION_MISMATCH');
    generationId??=body.header?.generationId;
    if(!generationId||body.header?.generationId!==generationId) throw blocked('C1_GENERATION_CHANGED');
    pages.push(body);
    if(body.page?.hasMore===false) break;
    const next=body.page?.nextCursor;
    if(body.page?.hasMore!==true||!Number.isInteger(next)||next<=cursor||count===99) throw blocked('C1_PAGINATION_INVALID');
    cursor=next;
  }
  const adapted=adaptC1PopulationPages(pages);
  if(adapted.captureCompleteness!=='IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE'||
    !/^[a-f0-9]{40}$/i.test(adapted.sourceMainSha||'')) throw blocked('C1_SOURCE_UNVERIFIED');
  const scan=await read(new URL('/api/scan/status',origin));
  const proof=scan?.researchC1Population;
  if(scan.scanDate!==scanDate||scan.dryRun!==false||scan.incomplete===true||scan.pipeline?.complete!==true||
    scan.config?.verified!==true) throw blocked('FORMAL_PIPELINE_UNVERIFIED');
  if(proof?.generationId!==generationId||proof.saveOk!==true||proof.readbackVerified!==true||
    proof.generated!==adapted.universe.length||proof.saved!==adapted.universe.length||
    (proof.contentDigest&&proof.contentDigest!==adapted.contentDigest)||
    (proof.universeDigest&&proof.universeDigest!==adapted.universeDigest)) throw blocked('FORMAL_C1_GENERATION_UNLINKED');
  const diagnosis=diagnosePopulation({sessionDate:adapted.sessionDate,decisionAt:adapted.decisionAt,
    universe:adapted.universe,rows:adapted.rows,samplePerStratum:3,seed:`C1-${adapted.sessionDate}`});
  const paired=buildC2ProspectivePairedLedger(pages);
  if(!diagnosis.coverageComplete||paired.generationId!==generationId||
    paired.sourceContentDigest!==adapted.contentDigest||paired.tally.populationN!==diagnosis.populationN)
    throw blocked('C1_C2_DENOMINATOR_MISMATCH');
  const scanProof={scanDate,generationId,pipelineComplete:true,configVerified:true,c1SaveVerified:true};
  const zeroPickProspective=verifyC1ZeroPickProspectiveEvidence({pages,adapted,scanProof,formalSelectedCount:scan.selectedCount});
  const shadowCohort=await collectShadowCohortEvidence({pages,diagnosis,origin,headers,request,timeoutMs});
  const c4RankingRedundancy=collectC4RankingRedundancyEvidence({pages});
  const setupChannelScale=buildSystem1SetupChannelScaleAudit(adapted);
  const marketCapConditionalAdmission=buildSystem1MarketCapConditionalAdmissionAudit({adapted,diagnosis});
  const firstFailureMasking=buildSystem1FirstFailureMaskingAudit(diagnosis);
  return {pages,adapted,diagnosis,paired,scanProof,zeroPickProspective,shadowCohort,c4RankingRedundancy,setupChannelScale,marketCapConditionalAdmission,firstFailureMasking};
}
