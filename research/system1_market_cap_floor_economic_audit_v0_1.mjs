import {replaySingleGateRemoval} from './formal_gate_replay_v0_1.mjs';

export const MARKET_CAP_FLOOR_ECONOMIC_AUDIT_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_MARKET_CAP_FLOOR_ECONOMIC_AUDIT_V0_1',
  thresholdYi:10,
  upstreamRequiredPass:Object.freeze(['PRICE_FLOOR','HISTORY_60D','RS_CONTEXT']),
  downstreamObservedGates:Object.freeze([
    'DAILY_ABNORMALITY','LIQUIDITY','SMALL_CAP_SPECIAL','MID_CAP_LIQUIDITY',
    'ANNOUNCEMENT_RISK','VALUATION_RELATIVE_RISK','SECTOR_GATE','AB_SETUP',
    'FUNDAMENTAL_QUALITY','ATR_QUALITY','TARGET_AVAILABLE','REWARD_RISK','FINAL_SIGNAL_GRADE'
  ]),
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x)?x:null;
const round=(x,d=4)=>Math.round(x*10**d)/10**d;
const pct=(n,d)=>d?round(n/d):null;
const inc=(o,k)=>o[k]=(o[k]||0)+1;

function upstreamState(gates){
  const states=MARKET_CAP_FLOOR_ECONOMIC_AUDIT_V0_1.upstreamRequiredPass.map(id=>gates?.[id]?.status||'UNKNOWN');
  if(states.every(x=>x==='PASS'))return 'REACHED';
  if(states.includes('UNKNOWN')||states.includes('NOT_EVALUABLE'))return 'UPSTREAM_UNKNOWN';
  return 'UPSTREAM_FAIL';
}
function capState(m){
  if(m===null)return 'MARKET_CAP_MISSING';
  if(m<10)return 'KNOWN_BELOW_10_FAIL';
  if(m<30)return 'KNOWN_10_30_PASS';
  if(m<100)return 'KNOWN_30_100_PASS';
  return 'KNOWN_100_PLUS_PASS';
}
function expectedGateState(state){
  if(state==='MARKET_CAP_MISSING')return 'UNKNOWN';
  return state==='KNOWN_BELOW_10_FAIL'?'FAIL':'PASS';
}
function poolFor(raw){
  const p=String(raw?.pricePool||'');
  if(p==='GENERAL'||p==='THOUSAND')return p;
  const close=finite(raw?.feature?.close);
  return close===null?'UNKNOWN':close>=1000?'THOUSAND':close>=10?'GENERAL':'BELOW_PRICE_FLOOR';
}
function stateCounts(rows){
  const out={MARKET_CAP_MISSING:0,KNOWN_BELOW_10_FAIL:0,KNOWN_10_30_PASS:0,KNOWN_30_100_PASS:0,KNOWN_100_PLUS_PASS:0};
  for(const r of rows)inc(out,r.marketCapState);
  return out;
}
function gateCounts(rows,id){
  const out={PASS:0,FAIL:0,UNKNOWN:0,NOT_EVALUABLE:0};
  for(const r of rows)inc(out,r.gates?.[id]?.status||'UNKNOWN');
  return out;
}
function summarizeReplay(rows){
  const counts={},nextGateCounts={};
  for(const r of rows){
    const x=replaySingleGateRemoval(r.observation,'MARKET_CAP_FLOOR');
    inc(counts,x.status);
    if(x.nextGate)inc(nextGateCounts,x.nextGate);
  }
  return {
    rows:rows.length,counts,nextGateCounts,
    allOtherObservedGatesClear:Number(counts.ALL_OTHER_OBSERVED_GATES_CLEAR||0),
    unresolved:Number(counts.PRIOR_STATE_UNKNOWN||0)+Number(counts.PRIOR_STATE_NOT_EVALUABLE||0)+
      Number(counts.NEXT_STATE_UNKNOWN||0)+Number(counts.NEXT_STATE_NOT_EVALUABLE||0),
    policy:'Single-gate observed-state replay only; not recovered rank/selection/trade.'
  };
}
function summarizeSlice(rows){
  const states=stateCounts(rows);
  const knownN=rows.length-states.MARKET_CAP_MISSING;
  return {
    n:rows.length,knownMarketCapN:knownN,missingMarketCapN:states.MARKET_CAP_MISSING,
    states,knownBelow10Rate:knownN?pct(states.KNOWN_BELOW_10_FAIL,knownN):null
  };
}

export function buildSystem1MarketCapFloorEconomicAudit({adapted,diagnosis,firstFailureMasking=null}={}){
  if(adapted?.researchOnly!==true||adapted?.decisionImpact!==false||adapted?.formalCoreImpact!==false||
     diagnosis?.schemaVersion!=='SYSTEM1_C1_ISOLATED_V0_1'||diagnosis?.researchOnly!==true||
     diagnosis?.decisionImpact!==false||diagnosis?.formalCoreImpact!==false)
    throw new Error('MCAP_FLOOR_C1_DIAGNOSIS_REQUIRED');

  const rawBySymbol=new Map((adapted.rows||[]).map(r=>[String(r.symbol),r]));
  const rows=[];
  let parityMismatchN=0,upstreamReachN=0,upstreamFailN=0,upstreamUnknownN=0;
  for(const o of diagnosis.observations||[]){
    const raw=rawBySymbol.get(String(o.symbol));
    if(!raw)continue;
    const m=finite(raw.feature?.marketCapYi),state=capState(m);
    const observed=o.gates?.MARKET_CAP_FLOOR?.status||'UNKNOWN';
    const expected=expectedGateState(state);
    if(observed!==expected)parityMismatchN++;
    const reach=upstreamState(o.gates||{});
    if(reach==='REACHED')upstreamReachN++;
    else if(reach==='UPSTREAM_FAIL')upstreamFailN++;
    else upstreamUnknownN++;
    rows.push({
      symbol:String(o.symbol),pool:poolFor(raw),marketCapYi:m,marketCapState:state,
      upstreamReachState:reach,observerMarketCapFloor:observed,
      firstFailureReason:o.firstFailureReason||null,gates:o.gates||{},observation:o
    });
  }

  const reached=rows.filter(r=>r.upstreamReachState==='REACHED');
  const economicFails=reached.filter(r=>r.marketCapState==='KNOWN_BELOW_10_FAIL');
  const missing=reached.filter(r=>r.marketCapState==='MARKET_CAP_MISSING');
  const knownPass=reached.filter(r=>r.marketCapState.startsWith('KNOWN_')&&r.marketCapState!=='KNOWN_BELOW_10_FAIL');

  const byPool={};
  for(const pool of ['GENERAL','THOUSAND','UNKNOWN','BELOW_PRICE_FLOOR'])
    byPool[pool]=summarizeSlice(reached.filter(r=>r.pool===pool));

  const downstream={};
  for(const id of MARKET_CAP_FLOOR_ECONOMIC_AUDIT_V0_1.downstreamObservedGates)
    downstream[id]=gateCounts(economicFails,id);

  const reasonCrossCheck={
    knownBelow10N:economicFails.length,
    knownBelow10ExactFirstFailureN:economicFails.filter(r=>r.firstFailureReason==='市值低於10億').length,
    missingMarketCapN:missing.length,
    missingExactFirstFailureN:missing.filter(r=>r.firstFailureReason==='缺市值資料').length,
    knownPassN:knownPass.length
  };

  return {
    schemaVersion:MARKET_CAP_FLOOR_ECONOMIC_AUDIT_V0_1.schemaVersion,
    sessionDate:adapted.sessionDate,generationId:adapted.generationId,decisionAt:adapted.decisionAt,
    thresholdYi:10,
    upstreamRequiredPass:[...MARKET_CAP_FLOOR_ECONOMIC_AUDIT_V0_1.upstreamRequiredPass],
    populationN:rows.length,upstreamReachN,upstreamFailN,upstreamUnknownN,
    reached:summarizeSlice(reached),byPool,
    economicThreshold:{
      knownBelow10N:economicFails.length,
      knownMarketCapEvaluableN:reached.length-missing.length,
      rejectRateAmongKnown:pct(economicFails.length,reached.length-missing.length),
      singleGateReplay:summarizeReplay(economicFails),
      downstreamObservedStates:downstream
    },
    p1aMissingState:{
      missingMarketCapN:missing.length,
      classification:'CONFIDENCE_UNCERTAINTY',
      neverRelabelAsEconomicFail:true
    },
    reasonCrossCheck,
    firstFailureMasking:{
      available:firstFailureMasking!==null,
      marketCapFloorFirstFailureN:firstFailureMasking?.perGate?.MARKET_CAP_FLOOR?.firstFailureN??null,
      marketCapFloorObservedFailN:firstFailureMasking?.perGate?.MARKET_CAP_FLOOR?.observedFailN??null,
      hiddenBehindEarlierFirstFailureN:firstFailureMasking?.perGate?.MARKET_CAP_FLOOR?.hiddenBehindOtherFirstFailureN??null,
      note:'FirstFailure masking aggregates missing and known-below-threshold states; this audit separates them before economic interpretation.'
    },
    observerParityMismatchN:parityMismatchN,
    evidenceTrust:parityMismatchN===0?'MARKET_CAP_STATE_PARITY_VERIFIED':'DATA_QUALITY_BLOCKED',
    interpretation:{
      missingIsNotEconomicFail:true,
      knownBelow10IsContextThresholdNotFactualNonExecutability:true,
      downstreamPassIsNotRecoveredSelection:true,
      singleGateReplayIsNotRecoveredSelection:true,
      noOutcomeUsed:true,noThresholdSweep:true,noGateChange:true
    },
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
