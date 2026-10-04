import {buildSystem1C4RankingRedundancyAudit} from './system1_c4_ranking_redundancy_v0_1.mjs';

export const C4_PRIORITY_ROUNDING_COLLISION_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_C4_PRIORITY_ROUNDING_COLLISION_AUDIT_V0_1',
  comparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',
  deployedPriorityPrecisionDecimals:1,
  researchComparator:'FULL_PRECISION_PRIORITY_THEN_FORMAL_LATER_KEYS',
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const round=(x,d=1)=>Math.round(x*10**d)/10**d;
const eq=(a,b,tol=1e-9)=>finite(a)&&finite(b)&&Math.abs(a-b)<=tol;
const assert=(ok,code)=>{if(!ok)throw new Error('C4_ROUNDING_'+code);};
const choose2=n=>n<2?0:n*(n-1)/2;
const POOLS=['GENERAL','THOUSAND'];
const LATER_KEYS=['rewardPerRisk','marketConsensusScore','setupQuality','sectorFlow','relativeStrength'];

function compareLater(a,b){
  for(const k of LATER_KEYS){
    const d=b[k]-a[k];
    if(d)return d;
  }
  return a.preSortOrdinal-b.preSortOrdinal;
}
function compareFullPrecision(a,b){
  const d=b.fullPrecisionPostPriority-a.fullPrecisionPostPriority;
  return d||compareLater(a,b);
}
function firstLaterKey(a,b){
  for(const k of LATER_KEYS)if(a[k]!==b[k])return k;
  return a.preSortOrdinal!==b.preSortOrdinal?'preSortOrdinal':'EXACT_TIE';
}
function fullPrecisionPre(ri){
  const d=ri.decomposition;
  return clamp(
    ri.setupQuality*.28+ri.sectorFlow*.14+d.institutionalScore*.16+d.fundamentalScore*.14+
    d.rsComponent*.14+d.rrComponent*.14,0,100
  );
}
function normalize(receipt,base){
  assert(base?.baselineSelectionParity===true,'BASELINE_AUDIT_REQUIRED');
  return receipt.rows.filter(x=>x?.formalResult?.ok===true).map(raw=>{
    const t=raw.formalResult.actualRankingTuple,ri=raw.zeroPickRankObservation.rankInput,d=ri.decomposition;
    const pre=fullPrecisionPre(ri);
    assert(eq(round(pre,1),d.preConsensusPriorityScore),'PRECONSENSUS_ROUNDING_REBUILD');
    const fullPost=clamp(pre+d.marketConsensusBonus,0,100);
    const deployed=round(clamp(d.preConsensusPriorityScore+d.marketConsensusBonus,0,100),1);
    assert(eq(deployed,t.priorityScore),'DEPLOYED_POST_REBUILD');
    return {
      symbol:String(raw.symbol),pool:raw.pricePool,selected:raw.formalResult.selected===true,
      priorityScore:t.priorityScore,rewardPerRisk:t.rewardPerRisk,marketConsensusScore:t.marketConsensusScore,
      setupQuality:t.setupQuality,sectorFlow:t.sectorFlow,relativeStrength:t.relativeStrength,
      preSortOrdinal:t.preSortOrdinal,
      fullPrecisionPrePriority:pre,
      deployedPrePriority:d.preConsensusPriorityScore,
      marketConsensusBonus:d.marketConsensusBonus,
      fullPrecisionPostPriority:fullPost,
      preConsensusRoundingError:d.preConsensusPriorityScore-pre
    };
  });
}
function poolTop(rows,cmp){
  const byPool={};
  for(const pool of POOLS)byPool[pool]=[...rows.filter(r=>r.pool===pool)].sort(cmp).slice(0,3);
  return byPool;
}
function selectedSet(byPool){return [...byPool.GENERAL,...byPool.THOUSAND].map(r=>r.symbol);}
function summarizeSelection(baselineRows,researchRows){
  const a=selectedSet(baselineRows),b=selectedSet(researchRows);
  const all=[...new Set([...a,...b])];
  const perPool={};
  for(const pool of POOLS){
    const x=baselineRows[pool].map(r=>r.symbol),y=researchRows[pool].map(r=>r.symbol);
    perPool[pool]={
      deployed:x,fullPrecision:y,
      membershipChanged:[...new Set([...x,...y])].filter(s=>x.includes(s)!==y.includes(s)),
      orderChanged:x.length!==y.length||x.some((s,i)=>y[i]!==s)
    };
  }
  return {
    deployedSelectedSymbols:a,fullPrecisionSelectedSymbols:b,
    selectedMembershipChangedN:all.filter(s=>a.includes(s)!==b.includes(s)).length,
    selectedMembershipChangedSymbols:all.filter(s=>a.includes(s)!==b.includes(s)),
    selectedOrderChanged:a.length!==b.length||a.some((s,i)=>b[i]!==s),
    perPool
  };
}

function collisionAnalysis(rows){
  const groups=new Map();
  for(const r of rows){
    if(r.priorityScore>=100)continue; // clamp compression is a separate mechanism, not a precision collision.
    const k=JSON.stringify([r.pool,r.priorityScore]);
    const g=groups.get(k)||[];g.push(r);groups.set(k,g);
  }
  let groupsN=0,pairsN=0,agreementN=0,reversalN=0,exactRawTieN=0;
  const byDecidingKey={};
  for(const g of groups.values()){
    if(g.length<2)continue;
    let groupHas=false;
    for(let i=0;i<g.length;i++)for(let j=i+1;j<g.length;j++){
      const a=g[i],b=g[j];
      if(eq(a.fullPrecisionPostPriority,b.fullPrecisionPostPriority)){exactRawTieN++;continue;}
      groupHas=true;pairsN++;
      const later=compareLater(a,b),raw=b.fullPrecisionPostPriority-a.fullPrecisionPostPriority;
      const decidingKey=firstLaterKey(a,b);
      byDecidingKey[decidingKey]=(byDecidingKey[decidingKey]||0)+1;
      // Comparator sign: negative => a ranks ahead; raw sign positive => b has higher full-precision priority.
      const formalWinner=later<0?'A':later>0?'B':'TIE';
      const rawWinner=raw<0?'A':raw>0?'B':'TIE';
      if(formalWinner===rawWinner)agreementN++;
      else if(formalWinner!=='TIE'&&rawWinner!=='TIE')reversalN++;
    }
    if(groupHas)groupsN++;
  }
  return {collisionGroupN:groupsN,collisionPairN:pairsN,laterComparatorAgreementN:agreementN,
    laterComparatorReversalN:reversalN,exactFullPrecisionTieN:exactRawTieN,byDecidingKey};
}

function cutlineAudit(base,rows){
  const out={};
  for(const pool of POOLS){
    const c=base.decisionIncidence.cutline?.[pool];
    const a=rows.find(r=>r.symbol===c?.selectedSymbol),b=rows.find(r=>r.symbol===c?.nextSymbol);
    if(!a||!b){
      out[pool]={...(c||{}),roundingCollision:false,fullPrecisionDirection:'NO_CUTLINE'};
      continue;
    }
    const collision=a.priorityScore===b.priorityScore&&a.priorityScore<100&&!eq(a.fullPrecisionPostPriority,b.fullPrecisionPostPriority);
    const rawDirection=!collision?'NOT_APPLICABLE':
      a.fullPrecisionPostPriority>b.fullPrecisionPostPriority?'CONFIRMS_DEPLOYED_SELECTED':
      a.fullPrecisionPostPriority<b.fullPrecisionPostPriority?'REVERSES_DEPLOYED_SELECTED':'EXACT_TIE';
    out[pool]={...c,roundingCollision:collision,
      selectedFullPrecisionPriority:a.fullPrecisionPostPriority,
      nextFullPrecisionPriority:b.fullPrecisionPostPriority,
      fullPrecisionDirection:rawDirection};
  }
  return out;
}

export function buildSystem1C4PriorityRoundingCollisionAudit(receipt,{baseAudit=null}={}){
  const base=baseAudit||buildSystem1C4RankingRedundancyAudit(receipt);
  assert(base?.schemaVersion==='SYSTEM1_C4_RANKING_REDUNDANCY_AUDIT_V0_1','BASE_SCHEMA');
  assert(base?.comparatorVersion===C4_PRIORITY_ROUNDING_COLLISION_V0_1.comparatorVersion,'COMPARATOR_VERSION');
  assert(base?.researchOnly===true&&base?.formalCoreImpact===false,'BASE_FIREWALL');
  const rows=normalize(receipt,base);

  const deployedTop=poolTop(rows,(a,b)=>{
    const d=b.priorityScore-a.priorityScore;
    return d||compareLater(a,b);
  });
  const fullTop=poolTop(rows,compareFullPrecision);
  const stored=[...rows.filter(r=>r.selected).map(r=>r.symbol)].sort();
  const rebuilt=[...selectedSet(deployedTop)].sort();
  assert(JSON.stringify(stored)===JSON.stringify(rebuilt),'DEPLOYED_SELECTION_PARITY');

  const collisions=collisionAnalysis(rows);
  const errors=rows.map(r=>Math.abs(r.preConsensusRoundingError));
  const capRows=rows.filter(r=>r.priorityScore===100);
  return {
    schemaVersion:C4_PRIORITY_ROUNDING_COLLISION_V0_1.schemaVersion,
    sessionDate:receipt.sessionDate,generationId:receipt.generationId,decisionAt:receipt.decisionAt,
    comparatorVersion:C4_PRIORITY_ROUNDING_COLLISION_V0_1.comparatorVersion,
    qualifiedN:rows.length,selectedN:rows.filter(r=>r.selected).length,
    precision:{
      deployedDecimals:1,
      preConsensusRoundedBeforeConsensusBonus:true,
      maxAbsPreConsensusRoundingError:errors.length?Math.max(...errors):null,
      meanAbsPreConsensusRoundingError:errors.length?errors.reduce((s,x)=>s+x,0)/errors.length:null,
      postPriorityCapN:capRows.length
    },
    collisions,
    cutline:cutlineAudit(base,rows),
    fullPrecisionCounterfactual:{
      rule:'FULL_PRECISION_PRECONSENSUS_COMPONENT_SUM_PLUS_SAME_CONSENSUS_BONUS_THEN_SAME_LATER_KEYS',
      clampPreserved:true,consensusBonusPreserved:true,laterComparatorOrderPreserved:true,
      ...summarizeSelection(deployedTop,fullTop)
    },
    interpretation:{
      roundingCollisionIsNotEconomicHarm:true,
      laterComparatorReversalIsStructuralNotOutcomeEvidence:true,
      capCompressionExcludedFromPrecisionCollisionPairs:true,
      noOutcomeUsed:true,noWeightRetuning:true,noGateChange:true,noComparatorRemoval:true
    },
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
