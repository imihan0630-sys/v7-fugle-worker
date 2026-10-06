const EPS=1e-9;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);

function validateAtoms(rows){
  const blockers=[];
  for(const row of rows||[]){
    if(!row||typeof row.symbol!=='string'||!row.symbol) blockers.push('INVALID_SYMBOL');
    if(typeof row.industry!=='string'||!row.industry) blockers.push(`MISSING_INDUSTRY:${row?.symbol??'?'}`);
    if(!own(row,'currentChangePercent')) blockers.push(`MISSING_CURRENT_CHANGE_CAPTURE:${row?.symbol??'?'}`);
    if(!own(row,'currentTradeValue')) blockers.push(`MISSING_CURRENT_TRADE_VALUE_CAPTURE:${row?.symbol??'?'}`);
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
    const breadth=items.length?positiveCount/items.length*100:null;
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
    const sectorScore=clamp(x.amount/maxAmount*45+(x.breadth??0)*0.3+clamp((x.avgChange||0)*5+15,0,25),0,100);
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

function near(a,b,tol=1e-9){return finite(a)&&finite(b)&&Math.abs(a-b)<=tol;}

function parity(reconstructed,stored,tol=1e-7){
  if(!stored) return {state:'NOT_AVAILABLE',mismatches:[]};
  const mismatches=[];
  for(const key of ['breadth','avgChange','amountVs20DayAverage','sectorScore']){
    if(own(stored,key)&&stored[key]!==null&&!near(reconstructed?.[key],stored[key],tol)) mismatches.push(key);
  }
  return {state:mismatches.length?'BLOCKED_PARITY_MISMATCH':'PASS',mismatches};
}

export function replayCandidateLoo(rows,candidateSymbol,{storedInclusive=null}={}){
  if(!Array.isArray(rows)||!rows.length) throw new Error('ROWS_REQUIRED');
  const atomBlockers=validateAtoms(rows);
  const candidate=rows.find(r=>r.symbol===candidateSymbol);
  if(!candidate) return {state:'BLOCKED',blockers:['CANDIDATE_NOT_FOUND',...atomBlockers]};
  if(atomBlockers.length) return {state:'BLOCKED',blockers:atomBlockers};

  const inclusiveBuilt=addScores(sectorPrimitives(rows));
  const inclusive=inclusiveBuilt.sectors.get(candidate.industry)||null;
  const parityState=parity(inclusive,storedInclusive);
  if(parityState.state==='BLOCKED_PARITY_MISMATCH'){
    return {state:'BLOCKED',blockers:['BLOCKED_PARITY_MISMATCH'],parity:parityState,inclusive};
  }

  const peers=rows.filter(r=>r.symbol!==candidateSymbol);
  const sameIndustryPeers=peers.filter(r=>r.industry===candidate.industry);
  if(!sameIndustryPeers.length){
    return {state:'UNKNOWN',supportState:'ZERO_PEERS',parity:parityState,inclusive,leaveOneOut:null};
  }

  const localBuilt=addScores(sectorPrimitives(peers),{frozenMaxAmount:inclusiveBuilt.maxAmount});
  const fullBuilt=addScores(sectorPrimitives(peers));
  const local=localBuilt.sectors.get(candidate.industry)||null;
  const full=fullBuilt.sectors.get(candidate.industry)||null;

  const localSelfContribution=finite(inclusive?.sectorScore)&&finite(local?.sectorScore)?inclusive.sectorScore-local.sectorScore:null;
  const maxNormalizerExternality=finite(local?.sectorScore)&&finite(full?.sectorScore)?local.sectorScore-full.sectorScore:null;
  const fullCounterfactualDelta=finite(inclusive?.sectorScore)&&finite(full?.sectorScore)?inclusive.sectorScore-full.sectorScore:null;

  return {
    state:'PASS',
    supportState:sameIndustryPeers.length===1?'SMALL_N_SENSITIVE':'SUPPORTED',
    parity:parityState,
    inclusive:{...inclusive,components:componentStates(inclusive)},
    leaveOneOutLocal:{...local,components:componentStates(local)},
    leaveOneOut:{...full,components:componentStates(full)},
    attribution:{localSelfContribution,maxNormalizerExternality,fullCounterfactualDelta},
    crossCandidateRankComparability:'UNKNOWN_UNTIL_POLICY_FROZEN',
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
