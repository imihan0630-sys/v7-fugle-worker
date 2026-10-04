import {canonicalJcsJson} from './canonical_receipt_hash_v0_1.mjs';
import {buildSystem1C4RankingRedundancyAudit} from './system1_c4_ranking_redundancy_v0_1.mjs';
import {buildSystem1C4SaturationCarryoverAudit} from './system1_c4_saturation_carryover_v0_1.mjs';

const flags={researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true,
  economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE'};
const versionAtLeast817=v=>{
  const m=/^(\d+)\.(\d+)\.(\d+)(?:-|$)/.exec(String(v||''));
  return Boolean(m&&(Number(m[1])>8||(Number(m[1])===8&&(Number(m[2])>17||(Number(m[2])===17&&Number(m[3])>=0)))));
};

// Input pages have already passed the core C1 digest/generation/pagination verification.
// This side-study never fetches, repairs, backfills, mutates, ranks live plans or changes C1/C2/C3.
export function collectC4RankingRedundancyEvidence({pages}={}){
  if(!Array.isArray(pages)||!pages.length)return {status:'DATA_QUALITY_BLOCKED',error:'C4_RANKING_C1_PAGES_REQUIRED',eligibleForInference:false,...flags};
  const header=pages[0]?.header||{};
  if(!versionAtLeast817(header.effectiveRuntimeVersion)){
    return {status:'LEGACY_NO_C4_RANKING_INPUT',generationId:header.generationId??null,
      sessionDate:header.sessionDate??null,eligibleForInference:false,historicalBackfillPerformed:false,...flags};
  }
  if(!header.shadowMembershipCapture){
    return {status:'DATA_QUALITY_BLOCKED',generationId:header.generationId??null,sessionDate:header.sessionDate??null,
      error:'C4_RANKING_CAPTURE_MISSING_ON_V8_17_PLUS',eligibleForDecisionIncidence:false,eligibleForInference:false,
      historicalBackfillPerformed:false,...flags};
  }
  try{
    const capture=canonicalJcsJson(header.shadowMembershipCapture);
    if(!pages.every(p=>canonicalJcsJson(p?.header?.shadowMembershipCapture??null)===capture))
      throw new Error('C4_RANKING_CAPTURE_HEADER_CHANGED');
    const chunks=pages.flatMap(p=>Array.isArray(p?.chunks)?p.chunks:[]).sort((a,b)=>a.chunkIndex-b.chunkIndex);
    const rows=chunks.flatMap(c=>c.rows||[]);
    const receipt={...structuredClone(header),rows:structuredClone(rows)};
    const audit=buildSystem1C4RankingRedundancyAudit(receipt);
    const saturationCarryover=buildSystem1C4SaturationCarryoverAudit(receipt,{baseAudit:audit});
    return {status:audit.qualifiedN?'VERIFIED':'NO_QUALIFIED_RANKING_POPULATION',
      generationId:audit.generationId,sessionDate:audit.sessionDate,qualifiedN:audit.qualifiedN,selectedN:audit.selectedN,
      eligibleForDecisionIncidence:audit.qualifiedN>0,eligibleForInference:false,historicalBackfillPerformed:false,
      audit,saturationCarryover,...flags};
  }catch(error){
    return {status:'DATA_QUALITY_BLOCKED',generationId:header.generationId??null,sessionDate:header.sessionDate??null,
      error:String(error?.message||error).slice(0,240),eligibleForDecisionIncidence:false,eligibleForInference:false,
      historicalBackfillPerformed:false,...flags};
  }
}
