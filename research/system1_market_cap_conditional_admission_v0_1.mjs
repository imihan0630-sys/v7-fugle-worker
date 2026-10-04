import {replaySingleGateRemoval} from './formal_gate_replay_v0_1.mjs';

export const MARKET_CAP_CONDITIONAL_ADMISSION_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_MARKET_CAP_CONDITIONAL_ADMISSION_AUDIT_V0_1',
  smallCapRange:[10,30],
  midCapRange:[30,100],
  nearBoundaryWindows:{
    cap30:{lower:[24,30],upper:[30,36]},
    cap100:{lower:[80,100],upper:[100,120]}
  },
  generalMinLots:1000,
  thousandMinLots:300,
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x)?x:null;
const round=(x,d=4)=>Math.round(x*10**d)/10**d;
const assert=(ok,code)=>{if(!ok)throw new Error('MCAP_ADMISSION_'+code);};

function capBand(mcap){
  if(mcap===null)return 'UNKNOWN';
  if(mcap<10)return 'BELOW_10';
  if(mcap<30)return 'CAP_10_30';
  if(mcap<100)return 'CAP_30_100';
  return 'CAP_100_PLUS';
}
function poolFor(close){
  if(close===null)return 'UNKNOWN';
  if(close>=1000)return 'THOUSAND';
  if(close>=10)return 'GENERAL';
  return 'BELOW_PRICE_FLOOR';
}
function minLots(pool){
  return pool==='THOUSAND'?MARKET_CAP_CONDITIONAL_ADMISSION_V0_1.thousandMinLots:
    pool==='GENERAL'?MARKET_CAP_CONDITIONAL_ADMISSION_V0_1.generalMinLots:null;
}
function liquidityException(row,pool){
  const f=row?.feature||{},avgLots=finite(f.avgVolume20Lots),base=minLots(pool);
  if(avgLots===null||base===null)return {state:'UNKNOWN'};
  if(avgLots>=base)return {state:'NOT_NEEDED'};
  const avgAmount=finite(f.avgAmount20),spread=finite(f.spreadPercent),depthScore=finite(f.depthScore);
  const depthBool=typeof f.orderBookDepthGood==='boolean'?f.orderBookDepthGood:null;
  if(avgAmount===null||spread===null||(depthBool===null&&depthScore===null))return {state:'UNKNOWN'};
  const goodDepth=depthBool===true||(depthScore!==null&&depthScore>=80);
  const pass=avgAmount>=50000000&&spread<=0.5&&goodDepth;
  return {state:pass?'PASS':'FAIL',avgAmount20:avgAmount,spreadPercent:spread,goodDepth};
}
function pct(n,d){return d?round(n/d):null;}
function countStates(rows,gate){
  const out={PASS:0,FAIL:0,UNKNOWN:0};
  for(const r of rows){
    const s=r.gates?.[gate]?.status||'UNKNOWN';
    out[s]=(out[s]||0)+1;
  }
  return out;
}
function summarizeGroup(rows){
  const small=countStates(rows,'SMALL_CAP_SPECIAL');
  const mid=countStates(rows,'MID_CAP_LIQUIDITY');
  const liq=countStates(rows,'LIQUIDITY');
  return {
    n:rows.length,
    liquidity:liq,
    smallCapSpecial:small,
    midCapLiquidity:mid,
    failRates:{
      liquidity:pct(liq.FAIL,liq.PASS+liq.FAIL),
      smallCapSpecial:pct(small.FAIL,small.PASS+small.FAIL),
      midCapLiquidity:pct(mid.FAIL,mid.PASS+mid.FAIL)
    }
  };
}
function classifySmall(row){
  if(row.band!=='CAP_10_30'||row.gates?.SMALL_CAP_SPECIAL?.status!=='FAIL')return null;
  const volumeKnown=finite(row.avgVolume20Lots)!==null&&finite(row.requiredSmallLots)!==null;
  const instKnown=finite(row.institutionalScore)!==null;
  if(!volumeKnown||!instKnown)return 'UNKNOWN_COMPONENT';
  const volumePass=row.avgVolume20Lots>=row.requiredSmallLots;
  const instPass=row.institutionalScore>=70;
  if(!volumePass&&!instPass)return 'VOLUME_AND_INSTITUTIONAL_FAIL';
  if(!volumePass)return 'VOLUME_ONLY_FAIL';
  if(!instPass)return 'INSTITUTIONAL_ONLY_FAIL';
  return 'INCONSISTENT_FAIL';
}
function replaySummary(observations,gate){
  const counts={};
  const nextGateCounts={};
  let allOtherClear=0;
  for(const o of observations){
    const r=replaySingleGateRemoval(o,gate);
    counts[r.status]=(counts[r.status]||0)+1;
    if(r.nextGate)nextGateCounts[r.nextGate]=(nextGateCounts[r.nextGate]||0)+1;
    if(r.status==='ALL_OTHER_OBSERVED_GATES_CLEAR')allOtherClear++;
  }
  return {gate,counts,nextGateCounts,uniqueObservedClear:allOtherClear,
    policy:'Single-gate replay only. uniqueObservedClear is not recovered selection/rank/trade.'};
}
function boundary(rows,low,cut,high,gate){
  const lower=rows.filter(r=>finite(r.marketCapYi)!==null&&r.marketCapYi>=low&&r.marketCapYi<cut);
  const upper=rows.filter(r=>finite(r.marketCapYi)!==null&&r.marketCapYi>=cut&&r.marketCapYi<high);
  const lowerState=countStates(lower,gate),upperState=countStates(upper,gate);
  return {
    lower:{range:[low,cut],...summarizeGroup(lower),targetGate:lowerState},
    upper:{range:[cut,high],...summarizeGroup(upper),targetGate:upperState},
    structuralNote:'Upper-side target gate becomes not-applicable by current Formal definition at the boundary; this is incidence, not outcome evidence.'
  };
}

export function buildSystem1MarketCapConditionalAdmissionAudit({adapted,diagnosis}={}){
  assert(adapted?.researchOnly===true&&adapted?.decisionImpact===false&&adapted?.formalCoreImpact===false,'ADAPTED_FIREWALL');
  assert(diagnosis?.researchOnly===true&&diagnosis?.decisionImpact===false&&diagnosis?.formalCoreImpact===false,'DIAGNOSIS_FIREWALL');
  assert(adapted.generationId===diagnosis?.observations?.[0]?.parentId||diagnosis?.observations?.length===0,'GENERATION_MISMATCH');
  const obsBySymbol=new Map((diagnosis.observations||[]).map(o=>[String(o.symbol),o]));
  const rows=[];
  for(const raw of adapted.rows||[]){
    const symbol=String(raw.symbol),obs=obsBySymbol.get(symbol);
    if(!obs)continue;
    const mcap=finite(raw.feature?.marketCapYi),close=finite(raw.feature?.close),pool=poolFor(close),base=minLots(pool);
    const avgLots=finite(raw.feature?.avgVolume20Lots),inst=finite(raw.derived?.institutionalScore);
    const ex=liquidityException(raw,pool);
    rows.push({
      symbol,pool,band:capBand(mcap),marketCapYi:mcap,close,
      avgVolume20Lots:avgLots,institutionalScore:inst,
      minLots:base,
      volumeMultipleToBase:avgLots!==null&&base?round(avgLots/base):null,
      requiredSmallLots:base?base*1.5:null,
      requiredMidLots:base?base*1.2:null,
      liquidityExceptionState:ex.state,
      gates:obs.gates,
      formalResult:obs.formalResult
    });
  }

  const byBand={};
  for(const band of ['BELOW_10','CAP_10_30','CAP_30_100','CAP_100_PLUS','UNKNOWN'])
    byBand[band]=summarizeGroup(rows.filter(r=>r.band===band));
  const byPool={};
  for(const pool of ['GENERAL','THOUSAND','UNKNOWN','BELOW_PRICE_FLOOR'])
    byPool[pool]=summarizeGroup(rows.filter(r=>r.pool===pool));

  const smallBreakdown={VOLUME_ONLY_FAIL:0,INSTITUTIONAL_ONLY_FAIL:0,VOLUME_AND_INSTITUTIONAL_FAIL:0,UNKNOWN_COMPONENT:0,INCONSISTENT_FAIL:0};
  for(const r of rows){
    const k=classifySmall(r);if(k)smallBreakdown[k]++;
  }

  const midRows=rows.filter(r=>r.band==='CAP_10_30'||r.band==='CAP_30_100');
  const midFail=midRows.filter(r=>r.gates?.MID_CAP_LIQUIDITY?.status==='FAIL');
  const midBreakdown={
    failN:midFail.length,
    below1_2xN:midFail.filter(r=>finite(r.volumeMultipleToBase)!==null&&r.volumeMultipleToBase<1.2).length,
    exceptionFailN:midFail.filter(r=>r.liquidityExceptionState==='FAIL').length,
    exceptionUnknownN:midFail.filter(r=>r.liquidityExceptionState==='UNKNOWN').length
  };

  const observations=diagnosis.observations||[];
  const smallReplay=replaySummary(observations,'SMALL_CAP_SPECIAL');
  const midReplay=replaySummary(observations,'MID_CAP_LIQUIDITY');

  return {
    schemaVersion:MARKET_CAP_CONDITIONAL_ADMISSION_V0_1.schemaVersion,
    sessionDate:adapted.sessionDate,generationId:adapted.generationId,decisionAt:adapted.decisionAt,
    observedN:rows.length,
    byBand,byPool,
    smallCapSpecial:{
      applicableBand:'10<=marketCapYi<30',
      requirements:'avgVolume20Lots>=1.5*poolMinLots AND institutionalScore>=70',
      failBreakdown:smallBreakdown,
      replay:smallReplay
    },
    midCapLiquidity:{
      applicableBand:'10<=marketCapYi<100',
      requirements:'avgVolume20Lots>=1.2*poolMinLots OR previously-qualified low-volume liquidity exception',
      failBreakdown:midBreakdown,
      replay:midReplay
    },
    boundaryWindows:{
      cap30:boundary(rows,24,30,36,'SMALL_CAP_SPECIAL'),
      cap100:boundary(rows,80,100,120,'MID_CAP_LIQUIDITY')
    },
    interpretation:{
      boundaryIncidenceIsNotEconomicDiscontinuity:true,
      uniqueObservedClearIsNotRecoveredSelection:true,
      failCountIsNotMarginalAlphaLoss:true,
      unknownPreserved:true,
      noOutcomeUsed:true,
      noThresholdSweep:true,
      noGateChange:true
    },
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
