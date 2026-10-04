const COMPARATOR_VERSION='PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30';
const RANK_KEYS=Object.freeze(['priorityScore','rewardPerRisk','marketConsensusScore','setupQuality','sectorFlow','relativeStrength']);
const POOLS=Object.freeze(['GENERAL','THOUSAND']);
const SCORE_ABLATIONS=Object.freeze({
  REMOVE_SETUP_SCORE_COMPONENT:'SETUP',
  REMOVE_SECTOR_SCORE_COMPONENT:'SECTOR',
  REMOVE_INSTITUTIONAL_SCORE_COMPONENT:'INSTITUTIONAL',
  REMOVE_FUNDAMENTAL_SCORE_COMPONENT:'FUNDAMENTAL',
  REMOVE_RS_SCORE_COMPONENT:'RS',
  REMOVE_RR_SCORE_COMPONENT:'RR',
  REMOVE_CONSENSUS_BONUS:'CONSENSUS'
});
const TIEBREAK_ABLATIONS=Object.freeze({
  DROP_RR_TIEBREAK:'rewardPerRisk',
  DROP_CONSENSUS_TIEBREAK:'marketConsensusScore',
  DROP_SETUP_TIEBREAK:'setupQuality',
  DROP_SECTOR_TIEBREAK:'sectorFlow',
  DROP_RS_TIEBREAK:'relativeStrength'
});
export const C4_RANKING_REDUNDANCY_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_C4_RANKING_REDUNDANCY_AUDIT_V0_1',
  comparatorVersion:COMPARATOR_VERSION,
  rankKeys:RANK_KEYS,
  scoreAblations:SCORE_ABLATIONS,
  tieBreakAblations:TIEBREAK_ABLATIONS,
  poolQuota:3,
  formalCoreLocked:true,
  researchOnly:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const round=(x,d=1)=>Math.round(x*10**d)/10**d;
const eq=(a,b,tol=1e-9)=>finite(a)&&finite(b)&&Math.abs(a-b)<=tol;
const assert=(ok,code)=>{if(!ok)throw new Error('C4_RANK_'+code);};
const sameSet=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));

function comparator(keys=RANK_KEYS){
  return (a,b)=>{
    for(const key of keys){
      const d=b[key]-a[key];
      if(d) return d;
    }
    return a.preSortOrdinal-b.preSortOrdinal;
  };
}
function poolSort(rows,keys=RANK_KEYS){return [...rows].sort(comparator(keys));}
function selectedFor(rows,quota,keys=RANK_KEYS){
  const byPool={};
  for(const pool of POOLS) byPool[pool]=poolSort(rows.filter(x=>x.pool===pool),keys).slice(0,quota);
  const selected=[...byPool.GENERAL,...byPool.THOUSAND].sort(comparator(keys));
  return {byPool,selected,selectedSymbols:selected.map(x=>x.symbol)};
}
function firstDifferingKey(a,b,keys=RANK_KEYS){
  for(const key of keys) if(a[key]!==b[key]) return key;
  return a.preSortOrdinal!==b.preSortOrdinal?'preSortOrdinal':'EXACT_TIE';
}
function decisionIncidence(rows,quota){
  const pairwiseFirstDifference={},cutline={};
  for(const pool of POOLS){
    const sorted=poolSort(rows.filter(x=>x.pool===pool));
    for(let i=0;i<sorted.length;i++)for(let j=i+1;j<sorted.length;j++){
      const key=firstDifferingKey(sorted[i],sorted[j]);
      pairwiseFirstDifference[key]=(pairwiseFirstDifference[key]||0)+1;
    }
    if(sorted.length>quota){
      const selected=sorted[quota-1],next=sorted[quota];
      cutline[pool]={selectedSymbol:selected.symbol,nextSymbol:next.symbol,decidingKey:firstDifferingKey(selected,next)};
    }else cutline[pool]={selectedSymbol:sorted.at(-1)?.symbol||null,nextSymbol:null,decidingKey:'NO_CUTLINE'};
  }
  return {pairwiseFirstDifference,cutline};
}
function summarizeVariant(name,baseline,variant,rows){
  const basePos=new Map(baseline.selected.map((x,i)=>[x.symbol,i]));
  const varPos=new Map(variant.selected.map((x,i)=>[x.symbol,i]));
  const all=[...new Set([...baseline.selectedSymbols,...variant.selectedSymbols])];
  const membershipChanged=all.filter(s=>basePos.has(s)!==varPos.has(s));
  const selectedOrderChanged=!sameSet(baseline.selectedSymbols,variant.selectedSymbols)||baseline.selectedSymbols.some((s,i)=>variant.selectedSymbols[i]!==s);
  const perPool={};
  for(const pool of POOLS){
    const a=baseline.byPool[pool].map(x=>x.symbol),b=variant.byPool[pool].map(x=>x.symbol);
    perPool[pool]={baseline:a,variant:b,membershipChanged:[...new Set([...a,...b])].filter(s=>a.includes(s)!==b.includes(s)),orderChanged:a.some((s,i)=>b[i]!==s)||a.length!==b.length};
  }
  return {name,selectedMembershipChangedN:membershipChanged.length,selectedMembershipChangedSymbols:membershipChanged,
    selectedOrderChanged,perPool,qualifiedN:rows.length};
}
function scoreParts(row){
  const d=row.rankInput.decomposition;
  return {
    SETUP:row.setupQuality*.28,
    SECTOR:row.sectorFlow*.14,
    INSTITUTIONAL:d.institutionalScore*.16,
    FUNDAMENTAL:d.fundamentalScore*.14,
    RS:d.rsComponent*.14,
    RR:d.rrComponent*.14
  };
}
function ablatedPriority(row,component){
  const d=row.rankInput.decomposition,parts=scoreParts(row);
  let raw=Object.values(parts).reduce((a,b)=>a+b,0);
  if(component!=='CONSENSUS') raw-=parts[component];
  const pre=round(clamp(raw,0,100),1);
  const bonus=component==='CONSENSUS'?0:d.marketConsensusBonus;
  return round(clamp(pre+bonus,0,100),1);
}
function normalizeQualifiedRow(raw,receipt){
  const r=raw?.formalResult,t=r?.actualRankingTuple,z=raw?.zeroPickRankObservation,ri=z?.rankInput;
  assert(r?.ok===true,'QUALIFIED_ROW_REQUIRED');
  assert(POOLS.includes(raw.pricePool),'POOL_REQUIRED');
  assert(t&&RANK_KEYS.every(k=>finite(t[k]))&&Number.isInteger(t.preSortOrdinal)&&t.preSortOrdinal>=0,'ACTUAL_TUPLE_REQUIRED');
  assert(z?.rankInputStatus==='COMPLETE'&&ri&&z.actualFormalRank===false,'COMPLETE_COUNTERFACTUAL_DECOMPOSITION_REQUIRED');
  assert(ri.rankComparatorVersion===COMPARATOR_VERSION,'COMPARATOR_VERSION_MISMATCH');
  assert(ri.scanDate===receipt.sessionDate&&ri.symbol===raw.symbol&&ri.pool===raw.pricePool&&ri.captureGeneration===receipt.generationId,'IDENTITY_MISMATCH');
  assert(ri.decisionAt===receipt.decisionAt,'DECISION_TIME_MISMATCH');
  const map={priorityScore:'postConsensusPriorityScore',rewardPerRisk:'rewardPerRisk',marketConsensusScore:'marketConsensusScore',setupQuality:'setupQuality',sectorFlow:'sectorFlow',relativeStrength:'relativeStrength'};
  for(const [actualKey,rankKey] of Object.entries(map)) assert(eq(t[actualKey],ri[rankKey]),'ACTUAL_COUNTERFACTUAL_TUPLE_DIVERGENCE_'+actualKey.toUpperCase());
  assert(t.preSortOrdinal===ri.preSortOrdinal,'ORDINAL_DIVERGENCE');
  const d=ri.decomposition;
  assert(d&&['preConsensusPriorityScore','marketConsensusBonus','institutionalScore','fundamentalScore','rsComponent','rrComponent'].every(k=>finite(d[k])),'DECOMPOSITION_REQUIRED');
  const row={symbol:String(raw.symbol),pool:raw.pricePool,preSortOrdinal:t.preSortOrdinal,rankInput:ri};
  for(const k of RANK_KEYS)row[k]=t[k];
  const rebuiltPre=round(clamp(Object.values(scoreParts(row)).reduce((a,b)=>a+b,0),0,100),1);
  assert(eq(rebuiltPre,d.preConsensusPriorityScore),'PRECONSENSUS_REBUILD_MISMATCH');
  const rebuiltPost=round(clamp(rebuiltPre+d.marketConsensusBonus,0,100),1);
  assert(eq(rebuiltPost,row.priorityScore),'POSTCONSENSUS_REBUILD_MISMATCH');
  return row;
}

export function buildSystem1C4RankingRedundancyAudit(receipt,{poolQuota=3}={}){
  assert(Number.isInteger(poolQuota)&&poolQuota>=1&&poolQuota<=3,'INVALID_POOL_QUOTA');
  assert(receipt&&Array.isArray(receipt.rows)&&receipt.rows.length>0,'RECEIPT_REQUIRED');
  assert(receipt.researchOnly===true&&receipt.decisionImpact===false&&receipt.formalCoreImpact===false,'RESEARCH_FIREWALL');
  assert(receipt.shadowMembershipCapture?.rankComparatorVersion===COMPARATOR_VERSION,'RECEIPT_COMPARATOR_VERSION');
  assert(receipt.shadowMembershipCapture?.selectionRuleVersion==='FORMAL_UNCHANGED_FROM_V8_16_0','FORMAL_LINEAGE');
  const qualified=receipt.rows.filter(x=>x?.formalResult?.ok===true).map(x=>normalizeQualifiedRow(x,receipt));
  assert(new Set(qualified.map(x=>x.symbol)).size===qualified.length,'DUPLICATE_SYMBOL');
  for(const pool of POOLS){
    const ord=qualified.filter(x=>x.pool===pool).map(x=>x.preSortOrdinal);
    assert(new Set(ord).size===ord.length,'DUPLICATE_POOL_ORDINAL');
  }
  const baseline=selectedFor(qualified,poolQuota);
  const storedSelected=receipt.rows.filter(x=>x?.formalResult?.selected===true).map(x=>String(x.symbol)).sort();
  const rebuiltSelected=[...baseline.selectedSymbols].sort();
  assert(JSON.stringify(storedSelected)===JSON.stringify(rebuiltSelected),'BASELINE_SELECTION_PARITY_FAILED');
  const tieBreakAblations=[];
  for(const [name,dropped] of Object.entries(TIEBREAK_ABLATIONS)){
    const keys=RANK_KEYS.filter(k=>k!==dropped),variant=selectedFor(qualified,poolQuota,keys);
    tieBreakAblations.push({...summarizeVariant(name,baseline,variant,qualified),droppedComparator:dropped,remainingComparatorKeys:keys});
  }
  const scoreAblations=[];
  for(const [name,component] of Object.entries(SCORE_ABLATIONS)){
    const modified=qualified.map(x=>({...x,priorityScore:ablatedPriority(x,component)}));
    const variant=selectedFor(modified,poolQuota);
    scoreAblations.push({...summarizeVariant(name,baseline,variant,qualified),removedScoreComponent:component,
      renormalized:false,gatePreserved:true,rawComparatorPreserved:component==='INSTITUTIONAL'||component==='FUNDAMENTAL'?null:true});
  }
  const incidence=decisionIncidence(qualified,poolQuota);
  return {schemaVersion:C4_RANKING_REDUNDANCY_V0_1.schemaVersion,sessionDate:receipt.sessionDate,generationId:receipt.generationId,
    comparatorVersion:COMPARATOR_VERSION,poolQuota,noCrossPoolFill:true,qualifiedN:qualified.length,selectedN:baseline.selected.length,
    baselineSelectionParity:true,baselineSelectedSymbols:baseline.selectedSymbols,decisionIncidence:incidence,
    tieBreakAblations,scoreAblations,
    interpretation:{layerCountIsNotImportance:true,candidateCountLiftIsNotSuccess:true,ablationIsStructuralNotEconomic:true,
      noGateChanged:true,noWeightRetuning:true,noOutcomeUsed:true},
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,noPlanChanges:true,noTrade:true,noPush:true};
}
