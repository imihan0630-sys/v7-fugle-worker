import { createHash } from 'node:crypto';

const EPS=1e-9;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);

function membershipDigest(rows){
  return createHash('sha256').update([...rows].map(r=>`${r.symbol}|${r.industry}`).sort().join('\n')).digest('hex');
}

function validateRows(rows){
  const blockers=[];
  const seen=new Set();
  for(const row of rows||[]){
    const symbol=String(row?.symbol??'');
    if(!symbol) blockers.push('INVALID_SYMBOL');
    else if(seen.has(symbol)) blockers.push(`DUPLICATE_SYMBOL:${symbol}`); else seen.add(symbol);
    if(typeof row?.industry!=='string'||!row.industry) blockers.push(`MISSING_INDUSTRY:${symbol||'?'}`);
    if(!own(row||{},'currentChangePercent')) blockers.push(`MISSING_CURRENT_CHANGE_CAPTURE:${symbol||'?'}`);
    if(!own(row||{},'currentTradeValue')) blockers.push(`MISSING_CURRENT_TRADE_VALUE_CAPTURE:${symbol||'?'}`);
  }
  return blockers;
}

function sectorPrimitives(rows){
  const groups=new Map();
  for(const row of rows){
    const key=row.industry||'未分類';
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(row);
  }
  const out=new Map();
  for(const [industry,items] of groups){
    const amount=items.reduce((s,r)=>s+(finite(r.currentTradeValue)?r.currentTradeValue:0),0);
    const positiveCount=items.filter(r=>(finite(r.currentChangePercent)?r.currentChangePercent:0)>0).length;
    const breadth=items.length?positiveCount/items.length*100:0;
    const changes=items.map(r=>r.currentChangePercent).filter(finite);
    const avgChange=mean(changes);
    const ready=items.filter(r=>finite(r.feature?.historyDays)&&r.feature.historyDays>=20);
    const avgAmount20=ready.reduce((s,r)=>s+(finite(r.feature?.avgAmount20)?r.feature.avgAmount20:0),0);
    const coveredAmount=ready.reduce((s,r)=>s+(finite(r.currentTradeValue)?r.currentTradeValue:0),0);
    const amountVs20DayAverage=avgAmount20>0?coveredAmount/avgAmount20:null;
    out.set(industry,{industry,stockCount:items.length,changeObservedCount:changes.length,positiveCount,amount,breadth,avgChange,historicalCoverage:ready.length,avgAmount20,coveredAmount,amountVs20DayAverage});
  }
  return out;
}

function addScores(map,{frozenMaxAmount=null}={}){
  const maxAmount=frozenMaxAmount??Math.max(1,...[...map.values()].map(x=>x.amount));
  const sectors=new Map();
  for(const [key,x] of map){
    const sectorScore=clamp(x.amount/maxAmount*45+x.breadth*0.3+clamp((x.avgChange||0)*5+15,0,25),0,100);
    sectors.set(key,{...x,maxAmount,sectorScore});
  }
  return {maxAmount,sectors};
}

function componentStates(s){
  const breadth=finite(s?.breadth)?(s.breadth>=40?'PASS':'FAIL'):'UNKNOWN';
  const avgChange=finite(s?.avgChange)?(s.avgChange>=-1?'PASS':'FAIL'):'UNKNOWN';
  const amount=finite(s?.amountVs20DayAverage)?(s.amountVs20DayAverage>=0.5?'PASS':'FAIL'):'UNKNOWN';
  const states=[breadth,avgChange,amount];
  const hardGateState=states.includes('UNKNOWN')?'UNKNOWN':states.includes('FAIL')?'FAIL':'PASS';
  return {breadth,avgChange,amount,hardGateState,formalHardGatePass:hardGateState==='PASS'};
}

function near(a,b,tol=1e-7){ return finite(a)&&finite(b)&&Math.abs(a-b)<=tol; }

function gateParity(reconstructed,stored,tol=1e-7){
  if(!stored||typeof stored!=='object') return {state:'BLOCKED_GATE_PARITY_MISSING',mismatches:['storedInclusive']};
  const required=['breadth','avgChange','amountVs20DayAverage'];
  const mismatches=[];
  for(const key of required){
    if(!own(stored,key)) mismatches.push(`MISSING_STORED_${key}`);
    else if(stored[key]===null && reconstructed?.[key]!==null) mismatches.push(key);
    else if(stored[key]!==null && !near(reconstructed?.[key],stored[key],tol)) mismatches.push(key);
  }
  return {state:mismatches.length?'BLOCKED_GATE_PARITY_MISMATCH':'PASS',mismatches};
}

function scoreParity(reconstructed,stored,tol=1e-7){
  if(!stored||!own(stored,'sectorScore')||stored.sectorScore===null)
    return {state:'BLOCKED_PRODUCTION_SCORE_CAPTURE_MISSING',mismatches:['sectorScore']};
  return near(reconstructed?.sectorScore,stored.sectorScore,tol)
    ? {state:'PASS',mismatches:[]}
    : {state:'BLOCKED_SCORE_PARITY_MISMATCH',mismatches:['sectorScore']};
}

export function replayCandidateLooV04({rows,candidateSymbol,storedInclusive,membership}={}){
  if(!Array.isArray(rows)||!rows.length) throw new Error('ROWS_REQUIRED');
  const blockers=validateRows(rows);
  const candidate=rows.find(r=>r.symbol===candidateSymbol);
  if(!candidate) blockers.push('CANDIDATE_NOT_FOUND');
  if(!membership?.classificationSchemeId) blockers.push('MISSING_CLASSIFICATION_SCHEME_ID');
  if(!membership?.membershipVersion) blockers.push('MISSING_MEMBERSHIP_VERSION');
  const digest=membershipDigest(rows);
  if(!membership?.membershipDigest) blockers.push('MISSING_MEMBERSHIP_DIGEST');
  else if(membership.membershipDigest!==digest) blockers.push('MEMBERSHIP_DIGEST_MISMATCH');
  if(blockers.length) return {state:'BLOCKED',blockers,membershipDigestObserved:digest};

  const inclusiveBuilt=addScores(sectorPrimitives(rows));
  const inclusive=inclusiveBuilt.sectors.get(candidate.industry)||null;
  const gp=gateParity(inclusive,storedInclusive);
  if(gp.state!=='PASS') return {state:'BLOCKED',blockers:[gp.state],gateParity:gp,inclusive};
  const sp=scoreParity(inclusive,storedInclusive);

  const peers=rows.filter(r=>r.symbol!==candidateSymbol);
  const sameIndustryPeers=peers.filter(r=>r.industry===candidate.industry);
  if(!sameIndustryPeers.length){
    return {state:'UNKNOWN',supportState:'ZERO_PEERS',gateParity:gp,scoreParity:sp,inclusive:{...inclusive,components:componentStates(inclusive)},leaveOneOut:null,
      gateEffectAuthorized:true,scoreEffectAuthorized:false,rankSeatAllocationAuthorized:false,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
  }

  const localBuilt=addScores(sectorPrimitives(peers),{frozenMaxAmount:inclusiveBuilt.maxAmount});
  const fullBuilt=addScores(sectorPrimitives(peers));
  const local=localBuilt.sectors.get(candidate.industry)||null;
  const full=fullBuilt.sectors.get(candidate.industry)||null;
  const localSelfContribution=finite(inclusive?.sectorScore)&&finite(local?.sectorScore)?inclusive.sectorScore-local.sectorScore:null;
  const maxNormalizerExternality=finite(local?.sectorScore)&&finite(full?.sectorScore)?local.sectorScore-full.sectorScore:null;
  const fullCounterfactualDelta=finite(inclusive?.sectorScore)&&finite(full?.sectorScore)?inclusive.sectorScore-full.sectorScore:null;
  const inclusiveComponents=componentStates(inclusive), looComponents=componentStates(full);
  const gateFlip=inclusiveComponents.hardGateState!==looComponents.hardGateState && ![inclusiveComponents.hardGateState,looComponents.hardGateState].includes('UNKNOWN');
  const gateDirection=gateFlip?(inclusiveComponents.hardGateState==='PASS'?'SELF_PROMOTION':'SELF_SUPPRESSION'):'NONE';

  return {
    state:'PASS',supportState:sameIndustryPeers.length===1?'SMALL_N_SENSITIVE':'SUPPORTED',
    membershipDigestObserved:digest,gateParity:gp,scoreParity:sp,
    inclusive:{...inclusive,components:inclusiveComponents},
    leaveOneOutLocal:{...local,components:componentStates(local)},
    leaveOneOut:{...full,components:looComponents},
    gateEffect:{gateFlip,gateDirection},
    attribution:{localSelfContribution,maxNormalizerExternality,fullCounterfactualDelta},
    gateEffectAuthorized:true,
    scoreEffectAuthorized:sp.state==='PASS',
    rankSeatAllocationAuthorized:false,
    priorityScoreDeltaFromSector:null,
    structuralUnroundedSectorContributionDelta:finite(fullCounterfactualDelta)?0.14*fullCounterfactualDelta:null,
    priorityScoreDeltaReason:'EXACT_RUNTIME_CLAMP_ROUND_CONSENSUS_REPLAY_REQUIRED',
    effectiveComparatorAuthority:'BUILT_RUNTIME_NOT_BASELINE_WORKER',
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
