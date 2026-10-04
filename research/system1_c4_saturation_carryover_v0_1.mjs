import {buildSystem1C4RankingRedundancyAudit} from './system1_c4_ranking_redundancy_v0_1.mjs';

export const C4_SATURATION_CARRYOVER_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_C4_SATURATION_CARRYOVER_AUDIT_V0_1',
  comparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',
  rrSaturationAt:5,
  rsLowSaturationAt:-25,
  rsHighSaturationAt:25,
  consensusBonusSaturationSources:5,
  consensusBonusCap:7,
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const round=(x,d=1)=>Math.round(x*10**d)/10**d;
const eq=(a,b,tol=1e-9)=>finite(a)&&finite(b)&&Math.abs(a-b)<=tol;
const choose2=n=>n<2?0:n*(n-1)/2;
const assert=(ok,code)=>{if(!ok)throw new Error('C4_SATURATION_'+code);};
const key=x=>JSON.stringify(x);

function groupPairCount(rows,groupFields,valueField){
  const groups=new Map();
  for(const row of rows){
    const k=key(groupFields.map(f=>row[f]));
    const g=groups.get(k)||[];
    g.push(row);groups.set(k,g);
  }
  let eligiblePairs=0,differentiatedPairs=0;
  for(const g of groups.values()){
    eligiblePairs+=choose2(g.length);
    const byValue=new Map();
    for(const row of g){
      const k=String(row[valueField]);
      byValue.set(k,(byValue.get(k)||0)+1);
    }
    differentiatedPairs+=choose2(g.length)-[...byValue.values()].reduce((s,n)=>s+choose2(n),0);
  }
  return {eligiblePairs,differentiatedPairs};
}

function rowsFromReceipt(receipt,baseAudit){
  assert(baseAudit?.baselineSelectionParity===true,'BASELINE_AUDIT_REQUIRED');
  const out=[];
  for(const raw of receipt.rows.filter(x=>x?.formalResult?.ok===true)){
    const t=raw.formalResult.actualRankingTuple,ri=raw.zeroPickRankObservation.rankInput,d=ri.decomposition;
    const rrExpected=clamp(t.rewardPerRisk*20,0,100);
    const rsExpected=clamp(50+ri.relativeStrength*2,0,100);
    const bonusExpected=d.marketConsensusSources<2?0:Math.min(7,(d.marketConsensusSources-1)*2);
    const consensusExpected=d.marketConsensusSources<2?0:Math.min(100,20+d.marketConsensusSources*15);
    assert(eq(d.rrComponent,rrExpected),'RR_COMPONENT_MAPPING');
    assert(eq(d.rsComponent,rsExpected),'RS_COMPONENT_MAPPING');
    assert(eq(d.marketConsensusBonus,bonusExpected),'CONSENSUS_BONUS_MAPPING');
    assert(eq(t.marketConsensusScore,consensusExpected),'CONSENSUS_SCORE_MAPPING');
    assert(eq(t.relativeStrength,round(ri.relativeStrength,1)),'RS_FORMAL_ROUNDING');
    out.push({
      symbol:String(raw.symbol),pool:raw.pricePool,selected:raw.formalResult.selected===true,
      priorityScore:t.priorityScore,rewardPerRisk:t.rewardPerRisk,marketConsensusScore:t.marketConsensusScore,
      setupQuality:t.setupQuality,sectorFlow:t.sectorFlow,relativeStrength:t.relativeStrength,
      rawRelativeStrength:ri.relativeStrength,preSortOrdinal:t.preSortOrdinal,
      rrComponent:d.rrComponent,rsComponent:d.rsComponent,
      marketConsensusSources:d.marketConsensusSources,marketConsensusBonus:d.marketConsensusBonus,
      preConsensusPriorityScore:d.preConsensusPriorityScore
    });
  }
  return out;
}

function rowBySymbol(rows,symbol){return rows.find(r=>r.symbol===symbol)||null;}

function cutlineState(baseAudit,rows){
  const result={};
  for(const [pool,c] of Object.entries(baseAudit.decisionIncidence.cutline||{})){
    const a=rowBySymbol(rows,c.selectedSymbol),b=rowBySymbol(rows,c.nextSymbol);
    const rrCarry=Boolean(a&&b&&c.decidingKey==='rewardPerRisk'&&a.rrComponent===100&&b.rrComponent===100&&a.rewardPerRisk!==b.rewardPerRisk);
    const rsCarry=Boolean(a&&b&&c.decidingKey==='relativeStrength'&&
      ((a.rsComponent===100&&b.rsComponent===100)||(a.rsComponent===0&&b.rsComponent===0))&&a.relativeStrength!==b.relativeStrength);
    const consensusCarry=Boolean(a&&b&&c.decidingKey==='marketConsensusScore'&&
      a.marketConsensusBonus===7&&b.marketConsensusBonus===7&&a.marketConsensusScore!==b.marketConsensusScore);
    result[pool]={...c,rrSaturationCarryover:rrCarry,rsSaturationCarryover:rsCarry,
      consensusSaturationCarryover:consensusCarry};
  }
  return result;
}

export function buildSystem1C4SaturationCarryoverAudit(receipt,{baseAudit=null}={}){
  const base=baseAudit||buildSystem1C4RankingRedundancyAudit(receipt);
  assert(base?.schemaVersion==='SYSTEM1_C4_RANKING_REDUNDANCY_AUDIT_V0_1','BASE_SCHEMA');
  assert(base?.comparatorVersion===C4_SATURATION_CARRYOVER_V0_1.comparatorVersion,'COMPARATOR_VERSION');
  assert(base?.formalCoreImpact===false&&base?.researchOnly===true,'BASE_FIREWALL');
  const rows=rowsFromReceipt(receipt,base);

  const rrSaturated=rows.filter(r=>r.rrComponent===100&&r.rewardPerRisk>=5);
  const rrPairs=groupPairCount(rrSaturated,['pool','priorityScore'],'rewardPerRisk');

  const rsSaturated=rows.filter(r=>(r.rsComponent===100&&r.rawRelativeStrength>=25)||(r.rsComponent===0&&r.rawRelativeStrength<=-25));
  const rsPairs=groupPairCount(rsSaturated,
    ['pool','priorityScore','rewardPerRisk','marketConsensusScore','setupQuality','sectorFlow','rsComponent'],
    'relativeStrength');

  const consensusSaturated=rows.filter(r=>r.marketConsensusBonus===7&&r.marketConsensusSources>=5);
  const consensusPairs=groupPairCount(consensusSaturated,
    ['pool','priorityScore','rewardPerRisk'],
    'marketConsensusScore');

  const postPriorityCapped=rows.filter(r=>r.priorityScore===100);
  const consensusCausedCap=rows.filter(r=>r.priorityScore===100&&r.marketConsensusBonus>0&&
    r.preConsensusPriorityScore<100&&r.preConsensusPriorityScore+r.marketConsensusBonus>=100);

  const cutline=cutlineState(base,rows);
  return {
    schemaVersion:C4_SATURATION_CARRYOVER_V0_1.schemaVersion,
    sessionDate:receipt.sessionDate,generationId:receipt.generationId,decisionAt:receipt.decisionAt,
    comparatorVersion:C4_SATURATION_CARRYOVER_V0_1.comparatorVersion,
    qualifiedN:rows.length,selectedN:rows.filter(r=>r.selected).length,
    rr:{
      saturationDefinition:'rrComponent=100 and rewardPerRisk>=5',
      saturatedN:rrSaturated.length,selectedSaturatedN:rrSaturated.filter(r=>r.selected).length,
      samePoolSamePriorityPairs:rrPairs.eligiblePairs,
      rawRrDifferentiatedPairs:rrPairs.differentiatedPairs,
      interpretation:'Pairs counted only when PriorityScore is tied, so raw RR would be the next deployed comparator.'
    },
    rs:{
      saturationDefinition:'rsComponent=100 at raw RS>=25 or rsComponent=0 at raw RS<=-25',
      saturatedN:rsSaturated.length,selectedSaturatedN:rsSaturated.filter(r=>r.selected).length,
      samePoolSameEarlierComparatorPairs:rsPairs.eligiblePairs,
      rawRsDifferentiatedPairs:rsPairs.differentiatedPairs,
      highSaturatedN:rsSaturated.filter(r=>r.rsComponent===100).length,
      lowSaturatedN:rsSaturated.filter(r=>r.rsComponent===0).length,
      interpretation:'Pairs require equality through priority/RR/consensus/setup/sector and the same RS saturation side.'
    },
    consensus:{
      saturationDefinition:'marketConsensusBonus=7 at sourceCount>=5',
      saturatedN:consensusSaturated.length,selectedSaturatedN:consensusSaturated.filter(r=>r.selected).length,
      sourceCount5N:consensusSaturated.filter(r=>r.marketConsensusSources===5).length,
      sourceCount6PlusN:consensusSaturated.filter(r=>r.marketConsensusSources>=6).length,
      samePoolSamePriorityAndRrPairs:consensusPairs.eligiblePairs,
      consensusScoreDifferentiatedPairs:consensusPairs.differentiatedPairs,
      postConsensusPriorityCapN:postPriorityCapped.length,
      consensusCausedPriorityCapN:consensusCausedCap.length,
      interpretation:'ConsensusScore can still distinguish sourceCount 5 versus 6+ after the additive bonus has saturated.'
    },
    cutline,
    interpretation:{
      saturationDoesNotMeanFactorShouldBeRemoved:true,
      carryoverIncidenceIsStructuralNotEconomic:true,
      zeroCarryoverWouldSupportPracticalImmaterialityNotEconomicInferiority:true,
      noOutcomeUsed:true,noWeightRetuning:true,noComparatorChange:true,noGateChange:true
    },
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
