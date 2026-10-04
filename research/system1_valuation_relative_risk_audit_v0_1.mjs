import {replaySingleGateRemoval} from './formal_gate_replay_v0_1.mjs';

export const VALUATION_RELATIVE_RISK_AUDIT_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_VALUATION_RELATIVE_RISK_AUDIT_V0_1',
  peMultipleThreshold:2.5,
  growthExceptionThresholdPct:25,
  upstreamRequiredPass:Object.freeze([
    'PRICE_FLOOR','HISTORY_60D','RS_CONTEXT','MARKET_CAP_FLOOR','DAILY_ABNORMALITY',
    'LIQUIDITY','SMALL_CAP_SPECIAL','MID_CAP_LIQUIDITY','CHIP_CONCENTRATION_PRESENT',
    'FINANCIAL_SOURCE_COMPLETENESS','ANNOUNCEMENT_RISK'
  ]),
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x)?x:null;
const bool=x=>typeof x==='boolean'?x:null;
const round=(x,d=4)=>Math.round(x*10**d)/10**d;
const pct=(n,d)=>d?round(n/d):null;
const inc=(o,k)=>o[k]=(o[k]||0)+1;

function upstreamState(gates){
  const s=VALUATION_RELATIVE_RISK_AUDIT_V0_1.upstreamRequiredPass.map(id=>gates?.[id]?.status||'UNKNOWN');
  if(s.every(x=>x==='PASS'))return 'REACHED';
  if(s.includes('UNKNOWN')||s.includes('NOT_EVALUABLE'))return 'UPSTREAM_UNKNOWN';
  return 'UPSTREAM_FAIL';
}
function classify({pe,sectorMedianPe,revQ,epsYoY}){
  if(pe===null||pe<=0)return {state:'NO_POSITIVE_TTM_PE',observer:'NOT_EVALUABLE',ratio:null,highGrowth:null,growthSource:'NOT_EVALUABLE'};
  if(sectorMedianPe===null||sectorMedianPe<=0)return {state:'MISSING_POSITIVE_SECTOR_MEDIAN_PE',observer:'UNKNOWN',ratio:null,highGrowth:null,growthSource:'UNKNOWN'};
  const ratio=pe/sectorMedianPe;
  if(ratio>2.5&&(revQ===null||epsYoY===null))
    return {state:'HIGH_RELATIVE_PE_GROWTH_CONTEXT_MISSING',observer:'UNKNOWN',ratio,highGrowth:null,growthSource:'UNKNOWN'};
  const rev=revQ!==null&&revQ>25,eps=epsYoY!==null&&epsYoY>25,highGrowth=rev||eps;
  if(ratio>2.5&&!highGrowth)return {state:'FAIL_HIGH_RELATIVE_PE_NO_GROWTH',observer:'FAIL',ratio,highGrowth:false,growthSource:'NONE'};
  if(ratio>2.5&&highGrowth)return {state:'PASS_HIGH_GROWTH_EXCEPTION',observer:'PASS',ratio,highGrowth:true,growthSource:rev&&eps?'BOTH':rev?'REVENUE':'EPS'};
  return {state:'PASS_WITHIN_RELATIVE_PE_MULTIPLE',observer:'PASS',ratio,highGrowth,growthSource:highGrowth?(rev&&eps?'BOTH':rev?'REVENUE':'EPS'):'NONE'};
}
function poolFor(raw){
  if(['GENERAL','THOUSAND'].includes(raw?.pricePool))return raw.pricePool;
  const close=finite(raw?.feature?.close);
  return close===null?'UNKNOWN':close>=1000?'THOUSAND':close>=10?'GENERAL':'BELOW_PRICE_FLOOR';
}
function capBand(m){
  if(m===null)return 'UNKNOWN';
  if(m<10)return 'BELOW_10';
  if(m<30)return 'CAP_10_30';
  if(m<100)return 'CAP_30_100';
  return 'CAP_100_PLUS';
}
function summarize(rows){
  const states={NO_POSITIVE_TTM_PE:0,MISSING_POSITIVE_SECTOR_MEDIAN_PE:0,HIGH_RELATIVE_PE_GROWTH_CONTEXT_MISSING:0,
    FAIL_HIGH_RELATIVE_PE_NO_GROWTH:0,PASS_HIGH_GROWTH_EXCEPTION:0,PASS_WITHIN_RELATIVE_PE_MULTIPLE:0};
  const sources={NONE:0,REVENUE:0,EPS:0,BOTH:0,UNKNOWN:0,NOT_EVALUABLE:0};
  const ratios=[];
  for(const r of rows){inc(states,r.state);inc(sources,r.growthSource);if(r.relativePeMultiple!==null)ratios.push(r.relativePeMultiple);}
  const evaluable=states.FAIL_HIGH_RELATIVE_PE_NO_GROWTH+states.PASS_HIGH_GROWTH_EXCEPTION+states.PASS_WITHIN_RELATIVE_PE_MULTIPLE;
  return {
    n:rows.length,states,growthExceptionSource:sources,
    evaluableN:evaluable,failRateAmongEvaluable:pct(states.FAIL_HIGH_RELATIVE_PE_NO_GROWTH,evaluable),
    highGrowthExceptionRateAmongEvaluable:pct(states.PASS_HIGH_GROWTH_EXCEPTION,evaluable),
    relativePeMultiple:{
      n:ratios.length,min:ratios.length?Math.min(...ratios):null,max:ratios.length?Math.max(...ratios):null,
      mean:ratios.length?round(ratios.reduce((s,x)=>s+x,0)/ratios.length):null
    }
  };
}
function replaySummary(rows){
  const counts={},nextGateCounts={};
  for(const r of rows){
    const x=replaySingleGateRemoval(r.observation,'VALUATION_RELATIVE_RISK');
    inc(counts,x.status);if(x.nextGate)inc(nextGateCounts,x.nextGate);
  }
  return {rows:rows.length,counts,nextGateCounts,
    allOtherObservedGatesClear:Number(counts.ALL_OTHER_OBSERVED_GATES_CLEAR||0),
    unresolved:Number(counts.PRIOR_STATE_UNKNOWN||0)+Number(counts.PRIOR_STATE_NOT_EVALUABLE||0)+
      Number(counts.NEXT_STATE_UNKNOWN||0)+Number(counts.NEXT_STATE_NOT_EVALUABLE||0),
    policy:'Observed-state single-gate replay only; not recovered rank/selection/trade.'};
}

export function buildSystem1ValuationRelativeRiskAudit({adapted,diagnosis,firstFailureMasking=null}={}){
  if(adapted?.researchOnly!==true||adapted?.decisionImpact!==false||adapted?.formalCoreImpact!==false||
     diagnosis?.schemaVersion!=='SYSTEM1_C1_ISOLATED_V0_1'||diagnosis?.researchOnly!==true||
     diagnosis?.decisionImpact!==false||diagnosis?.formalCoreImpact!==false)
    throw new Error('VALUATION_RISK_C1_DIAGNOSIS_REQUIRED');

  const rawBySymbol=new Map((adapted.rows||[]).map(r=>[String(r.symbol),r]));
  const rows=[];let parityMismatchN=0,upstreamReachN=0,upstreamFailN=0,upstreamUnknownN=0;
  for(const o of diagnosis.observations||[]){
    const raw=rawBySymbol.get(String(o.symbol));if(!raw)continue;
    const f=raw.feature||{};
    const pe=finite(f.priceEarningsRatio),sectorMedianPe=finite(f.sectorMedianPe),
      revQ=finite(f.revenueQuarterYoY),epsYoY=finite(f.epsYoY);
    const cl=classify({pe,sectorMedianPe,revQ,epsYoY});
    const observed=o.gates?.VALUATION_RELATIVE_RISK?.status||'UNKNOWN';
    if(observed!==cl.observer)parityMismatchN++;
    const reach=upstreamState(o.gates||{});
    if(reach==='REACHED')upstreamReachN++; else if(reach==='UPSTREAM_FAIL')upstreamFailN++; else upstreamUnknownN++;
    rows.push({
      symbol:String(o.symbol),pool:poolFor(raw),capBand:capBand(finite(f.marketCapYi)),upstreamReachState:reach,
      state:cl.state,relativePeMultiple:cl.ratio,highGrowth:cl.highGrowth,growthSource:cl.growthSource,
      pe,sectorMedianPe,revenueQuarterYoY:revQ,epsYoY,
      valuationObserved:bool(f.valuationObserved),financialBasis:bool(f.financialBasis),
      observerStatus:observed,firstFailureReason:o.firstFailureReason||null,gates:o.gates||{},observation:o
    });
  }

  const reached=rows.filter(r=>r.upstreamReachState==='REACHED');
  const fails=reached.filter(r=>r.state==='FAIL_HIGH_RELATIVE_PE_NO_GROWTH');
  const exceptions=reached.filter(r=>r.state==='PASS_HIGH_GROWTH_EXCEPTION');
  const within=reached.filter(r=>r.state==='PASS_WITHIN_RELATIVE_PE_MULTIPLE');
  const unknown=reached.filter(r=>r.state==='MISSING_POSITIVE_SECTOR_MEDIAN_PE'||r.state==='HIGH_RELATIVE_PE_GROWTH_CONTEXT_MISSING');
  const nonEvaluable=reached.filter(r=>r.state==='NO_POSITIVE_TTM_PE');

  const byPool={},byCapBand={};
  for(const p of ['GENERAL','THOUSAND','UNKNOWN','BELOW_PRICE_FLOOR'])byPool[p]=summarize(reached.filter(r=>r.pool===p));
  for(const b of ['BELOW_10','CAP_10_30','CAP_30_100','CAP_100_PLUS','UNKNOWN'])byCapBand[b]=summarize(reached.filter(r=>r.capBand===b));

  return {
    schemaVersion:VALUATION_RELATIVE_RISK_AUDIT_V0_1.schemaVersion,
    sessionDate:adapted.sessionDate,generationId:adapted.generationId,decisionAt:adapted.decisionAt,
    thresholds:{peMultiple:2.5,growthExceptionPct:25},
    upstreamRequiredPass:[...VALUATION_RELATIVE_RISK_AUDIT_V0_1.upstreamRequiredPass],
    populationN:rows.length,upstreamReachN,upstreamFailN,upstreamUnknownN,
    reached:summarize(reached),byPool,byCapBand,
    failedGateCohort:{
      n:fails.length,exactFirstFailureN:fails.filter(r=>r.firstFailureReason==='本益比明顯高於族群但成長未配合，估值風險過高').length,
      singleGateReplay:replaySummary(fails)
    },
    highGrowthExceptionControl:{
      n:exceptions.length,
      revenueOnlyN:exceptions.filter(r=>r.growthSource==='REVENUE').length,
      epsOnlyN:exceptions.filter(r=>r.growthSource==='EPS').length,
      bothN:exceptions.filter(r=>r.growthSource==='BOTH').length
    },
    withinMultipleControl:{n:within.length},
    unresolved:{unknownN:unknown.length,noPositivePeN:nonEvaluable.length},
    firstFailureMasking:{
      available:firstFailureMasking!==null,
      valuationFirstFailureN:firstFailureMasking?.perGate?.VALUATION_RELATIVE_RISK?.firstFailureN??null,
      valuationObservedFailN:firstFailureMasking?.perGate?.VALUATION_RELATIVE_RISK?.observedFailN??fails.length,
      hiddenBehindEarlierFirstFailureN:firstFailureMasking?.perGate?.VALUATION_RELATIVE_RISK?.hiddenBehindOtherFirstFailureN??null
    },
    sourceProvenance:{
      selectionTimeValuesCaptured:true,
      valuationObservedFlagCaptured:true,
      perFieldSourceAsOfCaptured:false,
      immutableSourceVintageCaptured:false,
      promotionGradeOutcomeJoin:false,
      blocker:'VALUATION_SOURCE_ASOF_AND_VINTAGE_NOT_FROZEN_IN_C1'
    },
    observerParityMismatchN:parityMismatchN,
    evidenceTrust:parityMismatchN===0?'VALUATION_GATE_PARITY_VERIFIED':'DATA_QUALITY_BLOCKED',
    interpretation:{
      noPositivePeIsNotFail:true,
      missingGrowthContextIsNotFail:true,
      highGrowthExceptionIsPositiveControlNotMatchedOutcomeControl:true,
      singleGateReplayIsNotRecoveredSelection:true,
      noOutcomeUsed:true,noThresholdSweep:true,noGateChange:true
    },
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,noPlanChanges:true,noTrade:true,noPush:true
  };
}
