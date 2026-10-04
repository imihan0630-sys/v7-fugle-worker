export const ATR_GATE_DECOMPOSITION_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_ATR_GATE_DECOMPOSITION_AUDIT_V0_1',
  minAtrPct:1,
  maxAtrPct:10,
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x)?x:null;
const inc=(o,k)=>o[k]=(o[k]||0)+1;
const round=(x,d=4)=>Math.round(x*10**d)/10**d;
const pct=(n,d)=>d?round(n/d):null;
const median=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),i=Math.floor(s.length/2);return s.length%2?s[i]:(s[i-1]+s[i])/2;};
const stats=a=>a.length?{n:a.length,min:Math.min(...a),max:Math.max(...a),mean:round(a.reduce((s,x)=>s+x,0)/a.length),median:round(median(a))}:{n:0,min:null,max:null,mean:null,median:null};

function stateFor(atr){
  if(atr===null)return 'UNKNOWN';
  if(atr<1)return 'LOW_ATR_FAIL';
  if(atr>10)return 'HIGH_ATR_FAIL';
  return 'PASS';
}
function poolFor(close){
  if(close===null)return 'UNKNOWN';
  return close>=1000?'THOUSAND':close>=10?'GENERAL':'BELOW_PRICE_FLOOR';
}
function capBand(m){
  if(m===null)return 'UNKNOWN';
  if(m<10)return 'BELOW_10';
  if(m<30)return 'CAP_10_30';
  if(m<100)return 'CAP_30_100';
  return 'CAP_100_PLUS';
}
function summarize(rows){
  const states={PASS:0,LOW_ATR_FAIL:0,HIGH_ATR_FAIL:0,UNKNOWN:0};
  const channels={A:0,B:0,NONE:0};
  let abPassN=0,targetPassN=0,rrPassN=0,gradePassN=0,selectedN=0;
  const vals=[];
  for(const r of rows){
    inc(states,r.atrState);inc(channels,r.channel||'NONE');
    if(r.atrPercent!==null)vals.push(r.atrPercent);
    if(r.abStatus==='PASS')abPassN++;
    if(r.targetStatus==='PASS')targetPassN++;
    if(r.rrStatus==='PASS')rrPassN++;
    if(r.gradeStatus==='PASS')gradePassN++;
    if(r.selected)selectedN++;
  }
  const evaluable=states.PASS+states.LOW_ATR_FAIL+states.HIGH_ATR_FAIL;
  return {n:rows.length,states,evaluableN:evaluable,
    failRate:evaluable?pct(states.LOW_ATR_FAIL+states.HIGH_ATR_FAIL,evaluable):null,
    lowFailRate:evaluable?pct(states.LOW_ATR_FAIL,evaluable):null,
    highFailRate:evaluable?pct(states.HIGH_ATR_FAIL,evaluable):null,
    channels,abPassN,targetPassN,rrPassN,gradePassN,selectedN,atrPercent:stats(vals)};
}

export function buildSystem1AtrGateDecompositionAudit({adapted,diagnosis,firstFailureMasking=null}={}){
  if(adapted?.researchOnly!==true||adapted?.decisionImpact!==false||adapted?.formalCoreImpact!==false||
     diagnosis?.schemaVersion!=='SYSTEM1_C1_ISOLATED_V0_1'||diagnosis?.researchOnly!==true||
     diagnosis?.decisionImpact!==false||diagnosis?.formalCoreImpact!==false)
    throw new Error('ATR_GATE_C1_DIAGNOSIS_REQUIRED');
  const rawBySymbol=new Map((adapted.rows||[]).map(r=>[String(r.symbol),r]));
  const rows=[];
  let observerParityMismatchN=0;
  for(const o of diagnosis.observations||[]){
    const raw=rawBySymbol.get(String(o.symbol));
    if(!raw)continue;
    const atr=finite(raw.feature?.atrPercent);
    const atrState=stateFor(atr);
    const observer=o.gates?.ATR_QUALITY?.status||'UNKNOWN';
    const expectedObserver=atrState==='UNKNOWN'?'UNKNOWN':atrState==='PASS'?'PASS':'FAIL';
    if(observer!==expectedObserver)observerParityMismatchN++;
    const a=raw.derived?.setupState?.A?.pass===true,b=raw.derived?.setupState?.B?.pass===true;
    const channel=b?'B':a?'A':null;
    rows.push({
      symbol:String(o.symbol),pool:o.pool||poolFor(finite(raw.feature?.close)),
      capBand:capBand(finite(raw.feature?.marketCapYi)),
      atrPercent:atr,atrState,observerAtrStatus:observer,
      channel,
      abStatus:o.gates?.AB_SETUP?.status||'UNKNOWN',
      targetStatus:o.gates?.TARGET_AVAILABLE?.status||'UNKNOWN',
      rrStatus:o.gates?.REWARD_RISK?.status||'UNKNOWN',
      gradeStatus:o.gates?.FINAL_SIGNAL_GRADE?.status||'UNKNOWN',
      rewardPerRisk:finite(raw.derived?.rewardPerRisk),
      setupQuality:finite(raw.derived?.setupQuality),
      selected:o.formalResult?.selected===true,
      formalFirstFailure:o.firstFailureReason||null
    });
  }
  const low=rows.filter(r=>r.atrState==='LOW_ATR_FAIL');
  const high=rows.filter(r=>r.atrState==='HIGH_ATR_FAIL');
  const failed=[...low,...high];
  const downstreamAmongFails={
    atrFailN:failed.length,
    abPassN:failed.filter(r=>r.abStatus==='PASS').length,
    targetPassN:failed.filter(r=>r.targetStatus==='PASS').length,
    rrPassN:failed.filter(r=>r.rrStatus==='PASS').length,
    gradePassN:failed.filter(r=>r.gradeStatus==='PASS').length,
    rrPassBySide:{
      LOW_ATR_FAIL:low.filter(r=>r.rrStatus==='PASS').length,
      HIGH_ATR_FAIL:high.filter(r=>r.rrStatus==='PASS').length
    },
    note:'Independent same-scan downstream gate observability only. Does not replay Formal reach, rank, quota, or trade.'
  };
  const byChannel={},byPool={},byCapBand={};
  for(const ch of ['A','B','NONE'])byChannel[ch]=summarize(rows.filter(r=>(r.channel||'NONE')===ch));
  for(const p of ['GENERAL','THOUSAND','UNKNOWN','BELOW_PRICE_FLOOR'])byPool[p]=summarize(rows.filter(r=>r.pool===p));
  for(const b of ['BELOW_10','CAP_10_30','CAP_30_100','CAP_100_PLUS','UNKNOWN'])byCapBand[b]=summarize(rows.filter(r=>r.capBand===b));

  return {
    schemaVersion:ATR_GATE_DECOMPOSITION_V0_1.schemaVersion,
    sessionDate:adapted.sessionDate,generationId:adapted.generationId,decisionAt:adapted.decisionAt,
    thresholds:{minAtrPct:1,maxAtrPct:10},
    overall:summarize(rows),byChannel,byPool,byCapBand,downstreamAmongFails,
    firstFailureMasking:{
      available:firstFailureMasking!==null,
      atrFirstFailureN:firstFailureMasking?.perGate?.ATR_QUALITY?.firstFailureN??null,
      atrObservedFailN:firstFailureMasking?.perGate?.ATR_QUALITY?.observedFailN??failed.length,
      hiddenBehindEarlierFirstFailureN:firstFailureMasking?.perGate?.ATR_QUALITY?.hiddenBehindOtherFirstFailureN??null
    },
    observerParityMismatchN,
    evidenceTrust:observerParityMismatchN===0?'ATR_PARITY_VERIFIED':'DATA_QUALITY_BLOCKED',
    interpretation:{
      lowAndHighAtrAreDistinctMechanisms:true,
      downstreamPassDoesNotMeanRecoveredSelection:true,
      atrFailCountIsNotEconomicHarm:true,
      noOutcomeUsed:true,noThresholdSweep:true,noGateChange:true
    },
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
