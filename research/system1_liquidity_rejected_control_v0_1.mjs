export const LIQUIDITY_REJECTED_CONTROL_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_LIQUIDITY_REJECTED_CONTROL_EVIDENCE_V0_1',
  rejectedMemberships:Object.freeze({
    LIQ_LOW_AVG_VOLUME_REJECTED:'20日流動性不足',
    LIQ_SMALLCAP_SPECIAL_REASON_REJECTED:'10至30億市值缺少強力特殊理由',
    LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED:'30至100億市值流動性要求未達'
  }),
  positiveControl:'LIQ_LOW_VOLUME_EXCEPTION_PASS',
  broadControl:'INDEPENDENT_BROAD_MARKET_CONTROL',
  residualControl:'RESIDUAL_CONTROL',
  pools:Object.freeze(['GENERAL','THOUSAND']),
  researchOnly:true,
  formalCoreLocked:true
});

const POOLS=LIQUIDITY_REJECTED_CONTROL_V0_1.pools;
const REJECTS=LIQUIDITY_REJECTED_CONTROL_V0_1.rejectedMemberships;
const CONTROLS=[
  LIQUIDITY_REJECTED_CONTROL_V0_1.positiveControl,
  LIQUIDITY_REJECTED_CONTROL_V0_1.broadControl,
  LIQUIDITY_REJECTED_CONTROL_V0_1.residualControl
];
const QUALITY=['VALID','COHORT_SEMANTIC_CONTAMINATION','SOURCE_QUALITY_BLOCKED','PROVENANCE_CONFLICT','UNKNOWN'];
const flags={researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true,
  economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE'};
const assert=(ok,code)=>{if(!ok)throw new Error('LIQ_REJECTED_CONTROL_'+code);};
const countBy=(rows,keyFn)=>{
  const out={};for(const r of rows){const k=keyFn(r);out[k]=(out[k]||0)+1;}return out;
};
const frameFor=(parent,type,pool)=>(parent?.frameCounts||[]).find(x=>x.membershipType===type&&x.stratum===pool)||null;
const expectedSample=(parent,type,pool)=>Number(parent?.expectedCounts?.[pool+'|'+type]||0);
const firstFailureDenom=(parent,reason,pool)=>Number(parent?.firstFailureCounts?.[pool+'|'+reason]||0);
function latestQualityMap(quality){
  const m=new Map();
  for(const q of [...(quality||[])].sort((a,b)=>a.overlayId-b.overlayId)){
    const key=q.symbol+'|'+q.membershipType;
    m.set(key,q.state);
  }
  return m;
}
function qualitySummary(rows,qmap){
  const counts=Object.fromEntries(QUALITY.map(x=>[x,0]));
  for(const m of rows){
    const state=qmap.get(m.symbol+'|'+m.membershipType)||'UNKNOWN';
    assert(QUALITY.includes(state),'QUALITY_STATE');
    counts[state]++;
  }
  return {counts,allValid:rows.length>0&&counts.VALID===rows.length,validN:counts.VALID,unknownN:counts.UNKNOWN,
    blockedN:counts.COHORT_SEMANTIC_CONTAMINATION+counts.SOURCE_QUALITY_BLOCKED+counts.PROVENANCE_CONFLICT};
}
function summarizeType(shadow,type,{reason=null}={}){
  const memberships=shadow.memberships.filter(m=>m.membershipType===type);
  const qmap=latestQualityMap(shadow.quality);
  const byPool={};
  for(const pool of POOLS){
    const sampled=memberships.filter(m=>m.pool===pool);
    const expectedN=expectedSample(shadow.parent,type,pool);
    assert(sampled.length===expectedN,'EXPECTED_SAMPLE_'+type+'_'+pool);
    let populationN;
    if(reason!==null){
      populationN=firstFailureDenom(shadow.parent,reason,pool);
      const frame=frameFor(shadow.parent,type,pool);
      if(populationN>0){
        assert(frame!==null,'REJECT_FRAME_MISSING_'+type+'_'+pool);
        assert(frame.semanticPopulationCount===populationN,'REJECT_DENOMINATOR_'+type+'_'+pool);
        assert(frame.sampledCount===sampled.length,'REJECT_SAMPLE_COUNT_'+type+'_'+pool);
      }else{
        assert(sampled.length===0,'ZERO_DENOMINATOR_SAMPLED_'+type+'_'+pool);
      }
      for(const m of sampled){
        assert(m.firstFailureReason===reason,'REJECT_REASON_'+type);
        assert(m.fullFormalCounterfactual===false,'FULL_COUNTERFACTUAL_FORBIDDEN_'+type);
      }
    }else{
      const frame=frameFor(shadow.parent,type,pool);
      populationN=frame?Number(frame.semanticPopulationCount):0;
      if(frame)assert(frame.sampledCount===sampled.length,'CONTROL_SAMPLE_COUNT_'+type+'_'+pool);
    }
    const fractions=[...new Set(sampled.map(m=>m.samplingFraction))];
    if(sampled.length)assert(fractions.length===1,'SAMPLING_FRACTION_INCONSISTENT_'+type+'_'+pool);
    byPool[pool]={
      populationN,sampledN:sampled.length,
      samplingFraction:sampled.length?fractions[0]:(populationN===0?0:null),
      quality:qualitySummary(sampled,qmap),
      sampledSymbols:sampled.map(m=>m.symbol).sort()
    };
  }
  return {
    membershipType:type,
    exactFormalReason:reason,
    populationN:POOLS.reduce((s,p)=>s+byPool[p].populationN,0),
    sampledN:memberships.length,
    byPool,
    quality:qualitySummary(memberships,qmap)
  };
}
function assertLiquiditySemantics(shadow){
  const ms=shadow.memberships;
  for(const m of ms.filter(x=>x.membershipType==='LIQ_LOW_AVG_VOLUME_REJECTED')){
    const l=m.liquidity||{};
    assert(typeof l.minLots==='number'&&typeof l.avgVolume20Lots==='number','LOW_AVG_CONTEXT');
    assert(l.avgVolume20Lots<l.minLots,'LOW_AVG_THRESHOLD');
    assert(l.liquidityExceptionPass!==true,'LOW_AVG_EXCEPTION_CONFLICT');
  }
  for(const m of ms.filter(x=>x.membershipType==='LIQ_LOW_VOLUME_EXCEPTION_PASS')){
    const l=m.liquidity||{};
    assert(typeof l.minLots==='number'&&typeof l.avgVolume20Lots==='number','EXCEPTION_CONTEXT');
    assert(l.avgVolume20Lots<l.minLots,'EXCEPTION_NOT_BELOW_MIN');
    assert(l.liquidityExceptionPass===true,'EXCEPTION_PASS_REQUIRED');
  }
}
function overlapSymbols(shadow,a,b){
  const aa=new Set(shadow.memberships.filter(m=>m.membershipType===a).map(m=>m.symbol));
  const bb=new Set(shadow.memberships.filter(m=>m.membershipType===b).map(m=>m.symbol));
  return [...aa].filter(s=>bb.has(s)).sort();
}

export function buildSystem1LiquidityRejectedControlEvidence(shadow){
  if(shadow?.status!=='VERIFIED'){
    return {schemaVersion:LIQUIDITY_REJECTED_CONTROL_V0_1.schemaVersion,status:'PARENT_NOT_VERIFIED',
      parentStatus:shadow?.status||'MISSING',eligibleForOutcomeJoin:false,selectionTimeEvidenceComplete:false,...flags};
  }
  try{
    assert(shadow.parent?.schemaVersion==='SYSTEM1_SHADOW_COHORT_MEMBERSHIP_V0_1','PARENT_SCHEMA');
    assert(shadow.parent?.captureGeneration&&shadow.parent?.scanDate,'PARENT_IDENTITY');
    assert(Array.isArray(shadow.memberships)&&Array.isArray(shadow.quality),'PARENT_ROWS');
    assert(shadow.captureIntegrity==='HEALTHY','PARENT_CAPTURE_INTEGRITY');
    assert(shadow.researchOnly===true&&shadow.decisionImpact===false&&shadow.formalCoreImpact===false,'PARENT_FIREWALL');

    const uniqueKeys=new Set(shadow.memberships.map(m=>m.symbol+'|'+m.membershipType));
    assert(uniqueKeys.size===shadow.memberships.length,'DUPLICATE_MEMBERSHIP');
    assertLiquiditySemantics(shadow);

    const rejected={};
    for(const [type,reason] of Object.entries(REJECTS))rejected[type]=summarizeType(shadow,type,{reason});
    const controls={};
    for(const type of CONTROLS)controls[type]=summarizeType(shadow,type);

    const lowBroadOverlap=overlapSymbols(shadow,'LIQ_LOW_AVG_VOLUME_REJECTED','INDEPENDENT_BROAD_MARKET_CONTROL');
    assert(lowBroadOverlap.length===0,'LOW_AVG_BROAD_CONTROL_CONTAMINATION');

    const focalTypes=[...Object.keys(REJECTS),'LIQ_LOW_VOLUME_EXCEPTION_PASS'];
    const focal=shadow.memberships.filter(m=>focalTypes.includes(m.membershipType));
    const q=qualitySummary(focal,latestQualityMap(shadow.quality));
    const samplingFractions={};
    for(const [type,s] of Object.entries({...rejected,...controls}))
      samplingFractions[type]=Object.fromEntries(POOLS.map(p=>[p,s.byPool[p].samplingFraction]));

    const overlaps={
      lowAvgVsBroad:lowBroadOverlap,
      smallCapVsBroad:overlapSymbols(shadow,'LIQ_SMALLCAP_SPECIAL_REASON_REJECTED','INDEPENDENT_BROAD_MARKET_CONTROL'),
      midCapVsBroad:overlapSymbols(shadow,'LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED','INDEPENDENT_BROAD_MARKET_CONTROL'),
      exceptionPassVsBroad:overlapSymbols(shadow,'LIQ_LOW_VOLUME_EXCEPTION_PASS','INDEPENDENT_BROAD_MARKET_CONTROL')
    };
    return {
      schemaVersion:LIQUIDITY_REJECTED_CONTROL_V0_1.schemaVersion,
      status:'VERIFIED_SELECTION_TIME',
      scanDate:shadow.parent.scanDate,captureGeneration:shadow.parent.captureGeneration,
      parentContentDigest:shadow.parent.parentContentDigest,
      rejected,controls,overlaps,samplingFractions,
      focalQuality:q,
      qualityEligibility:q.allValid?'ALL_FOCAL_MEMBERSHIPS_VALID':'QUALITY_PENDING_OR_BLOCKED',
      selectionTimeEvidenceComplete:true,
      eligibleForOutcomeJoin:false,
      outcomeState:'NOT_JOINED',
      interpretation:{
        rejectedPopulationDenominatorsArePreSample:true,
        lowAvgBroadControlSystematicHoleConfirmedByZeroOverlap:true,
        smallMidBroadOverlapIsSampleMembershipOverlapNotPopulationCausalControl:true,
        exceptionPassIsDescriptivePositiveControl:true,
        fullFormalCounterfactual:false,
        noThresholdSweep:true,
        noOutcomeUsed:true,
        candidateCountIsNotEconomicSuccess:true
      },
      ...flags
    };
  }catch(error){
    return {schemaVersion:LIQUIDITY_REJECTED_CONTROL_V0_1.schemaVersion,status:'DATA_QUALITY_BLOCKED',
      error:String(error?.message||error).slice(0,240),selectionTimeEvidenceComplete:false,
      eligibleForOutcomeJoin:false,outcomeState:'NOT_JOINED',...flags};
  }
}
