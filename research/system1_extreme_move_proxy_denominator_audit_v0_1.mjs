export const EXTREME_MOVE_PROXY_DENOMINATOR_AUDIT_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_EXTREME_MOVE_PROXY_DENOMINATOR_AUDIT_V0_1',
  absoluteThresholdPct:9.8,
  upstreamRequiredPass:['PRICE_FLOOR','HISTORY_60D','RS_CONTEXT','MARKET_CAP_FLOOR'],
  officialLimitStateLayer:'NOT_JOINED',
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x)?x:null;
const round=(x,d=4)=>Math.round(x*10**d)/10**d;
const pct=(n,d)=>d?round(n/d):null;
const inc=(o,k)=>o[k]=(o[k]||0)+1;

function proxyState(changePct){
  if(changePct===null)return 'MISSING_CHANGE_PERCENT';
  if(changePct>=9.8)return 'EXTREME_RETURN_PROXY_UP_REJECTED';
  if(changePct<=-9.8)return 'EXTREME_RETURN_PROXY_DOWN_REJECTED';
  return 'NUMERIC_PROXY_PASS';
}
function observerExpected(state){
  if(state==='MISSING_CHANGE_PERCENT')return 'UNKNOWN';
  return state==='NUMERIC_PROXY_PASS'?'PASS':'FAIL';
}
function upstreamState(gates){
  const ids=EXTREME_MOVE_PROXY_DENOMINATOR_AUDIT_V0_1.upstreamRequiredPass;
  const states=ids.map(id=>gates?.[id]?.status||'UNKNOWN');
  if(states.every(s=>s==='PASS'))return 'REACHED';
  if(states.includes('UNKNOWN')||states.includes('NOT_EVALUABLE'))return 'UPSTREAM_UNKNOWN';
  return 'UPSTREAM_FAIL';
}
function poolFor(row){
  if(row?.pricePool)return row.pricePool;
  const close=finite(row?.feature?.close);
  return close===null?'UNKNOWN':close>=1000?'THOUSAND':close>=10?'GENERAL':'BELOW_PRICE_FLOOR';
}
function summarizeReach(rows){
  const stateCounts={
    NUMERIC_PROXY_PASS:0,EXTREME_RETURN_PROXY_UP_REJECTED:0,
    EXTREME_RETURN_PROXY_DOWN_REJECTED:0,MISSING_CHANGE_PERCENT:0
  };
  for(const r of rows)inc(stateCounts,r.proxyState);
  const finiteN=stateCounts.NUMERIC_PROXY_PASS+stateCounts.EXTREME_RETURN_PROXY_UP_REJECTED+stateCounts.EXTREME_RETURN_PROXY_DOWN_REJECTED;
  return {
    reachedN:rows.length,finiteChangeN:finiteN,missingChangeN:stateCounts.MISSING_CHANGE_PERCENT,
    stateCounts,
    upRejectRateAmongFinite:pct(stateCounts.EXTREME_RETURN_PROXY_UP_REJECTED,finiteN),
    downRejectRateAmongFinite:pct(stateCounts.EXTREME_RETURN_PROXY_DOWN_REJECTED,finiteN),
    anyRejectRateAmongFinite:pct(stateCounts.EXTREME_RETURN_PROXY_UP_REJECTED+stateCounts.EXTREME_RETURN_PROXY_DOWN_REJECTED,finiteN)
  };
}

export function buildSystem1ExtremeMoveProxyDenominatorAudit({adapted,diagnosis,firstFailureMasking=null}={}){
  if(adapted?.researchOnly!==true||adapted?.decisionImpact!==false||adapted?.formalCoreImpact!==false||
     diagnosis?.schemaVersion!=='SYSTEM1_C1_ISOLATED_V0_1'||diagnosis?.researchOnly!==true||
     diagnosis?.decisionImpact!==false||diagnosis?.formalCoreImpact!==false)
    throw new Error('EXTREME_MOVE_C1_DIAGNOSIS_REQUIRED');

  const rawBySymbol=new Map((adapted.rows||[]).map(r=>[String(r.symbol),r]));
  const rows=[];
  let observerParityMismatchN=0,upstreamReachN=0,upstreamFailN=0,upstreamUnknownN=0;
  for(const o of diagnosis.observations||[]){
    const raw=rawBySymbol.get(String(o.symbol));
    if(!raw)continue;
    const changePct=finite(raw.feature?.changePercent);
    const pState=proxyState(changePct);
    const obs=o.gates?.DAILY_ABNORMALITY?.status||'UNKNOWN';
    const expected=observerExpected(pState);
    if(obs!==expected)observerParityMismatchN++;
    const reach=upstreamState(o.gates||{});
    if(reach==='REACHED')upstreamReachN++;
    else if(reach==='UPSTREAM_FAIL')upstreamFailN++;
    else upstreamUnknownN++;
    rows.push({
      symbol:String(o.symbol),pool:poolFor(raw),upstreamReachState:reach,
      changePercent:changePct,proxyState:pState,observerDailyAbnormality:obs,
      formalFirstFailure:o.firstFailureReason||null,
      productionProxyWouldReject:pState==='EXTREME_RETURN_PROXY_UP_REJECTED'||pState==='EXTREME_RETURN_PROXY_DOWN_REJECTED',
      productionMissingCoercionWouldNotReject:pState==='MISSING_CHANGE_PERCENT',
      officialLimitState:'OFFICIAL_LIMIT_UNKNOWN_NOT_JOINED'
    });
  }

  const reached=rows.filter(r=>r.upstreamReachState==='REACHED');
  const byPool={};
  for(const p of ['GENERAL','THOUSAND','UNKNOWN','BELOW_PRICE_FLOOR'])
    byPool[p]=summarizeReach(reached.filter(r=>r.pool===p));

  const formalReason='單日走勢過度異常';
  const up=reached.filter(r=>r.proxyState==='EXTREME_RETURN_PROXY_UP_REJECTED');
  const down=reached.filter(r=>r.proxyState==='EXTREME_RETURN_PROXY_DOWN_REJECTED');
  const missing=reached.filter(r=>r.proxyState==='MISSING_CHANGE_PERCENT');
  const exactReason={
    upProxyRejectN:up.length,
    upFormalFirstFailureN:up.filter(r=>r.formalFirstFailure===formalReason).length,
    downProxyRejectN:down.length,
    downFormalFirstFailureN:down.filter(r=>r.formalFirstFailure===formalReason).length,
    missingChangeN:missing.length,
    missingButFormalContinuesByProxyCoercionN:missing.length
  };

  return {
    schemaVersion:EXTREME_MOVE_PROXY_DENOMINATOR_AUDIT_V0_1.schemaVersion,
    sessionDate:adapted.sessionDate,generationId:adapted.generationId,decisionAt:adapted.decisionAt,
    thresholdPct:9.8,
    upstreamRequiredPass:[...EXTREME_MOVE_PROXY_DENOMINATOR_AUDIT_V0_1.upstreamRequiredPass],
    populationN:rows.length,upstreamReachN,upstreamFailN,upstreamUnknownN,
    reached:summarizeReach(reached),byPool,formalFirstFailureCrossCheck:exactReason,
    firstFailureMasking:{
      available:firstFailureMasking!==null,
      dailyAbnormalityFirstFailureN:firstFailureMasking?.perGate?.DAILY_ABNORMALITY?.firstFailureN??null,
      dailyAbnormalityObservedFailN:firstFailureMasking?.perGate?.DAILY_ABNORMALITY?.observedFailN??(up.length+down.length),
      hiddenBehindEarlierFirstFailureN:firstFailureMasking?.perGate?.DAILY_ABNORMALITY?.hiddenBehindOtherFirstFailureN??null
    },
    observerParityMismatchN,
    evidenceTrust:observerParityMismatchN===0?'PROXY_PARENT_PARITY_VERIFIED':'DATA_QUALITY_BLOCKED',
    officialLimitStateLayer:{
      status:'NOT_JOINED',
      allowedStates:['OFFICIAL_CLOSE_LIMIT_UP','OFFICIAL_CLOSE_LIMIT_DOWN','OFFICIAL_NON_HIT','NO_PRICE_LIMIT','NON_COMPARABLE_X','OFFICIAL_LIMIT_UNKNOWN'],
      rule:'Do not infer official price-limit state from +/-9.8% return.'
    },
    interpretation:{
      upAndDownMustRemainSeparate:true,
      missingChangeIsNotZeroReturn:true,
      proxyRejectIsNotOfficialLimitState:true,
      formalReachIncidenceIsNotEconomicHarm:true,
      noOutcomeUsed:true,noThresholdSweep:true,noGateChange:true
    },
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
