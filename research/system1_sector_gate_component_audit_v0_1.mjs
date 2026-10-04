export const SECTOR_GATE_COMPONENT_AUDIT_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_SECTOR_GATE_COMPONENT_AUDIT_V0_1',
  thresholds:{breadth:40,avgChange:-1,amountVs20DayAverage:.5},
  componentGateIds:['SECTOR_BREADTH','SECTOR_RETURN','SECTOR_AMOUNT'],
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x)?x:null;
const round=(x,d=4)=>Math.round(x*10**d)/10**d;
const pct=(n,d)=>d?round(n/d):null;
const median=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),i=Math.floor(s.length/2);return s.length%2?s[i]:(s[i-1]+s[i])/2;};
const stats=a=>a.length?{n:a.length,min:Math.min(...a),max:Math.max(...a),mean:round(a.reduce((s,x)=>s+x,0)/a.length),median:round(median(a))}:{n:0,min:null,max:null,mean:null,median:null};
const inc=(o,k)=>o[k]=(o[k]||0)+1;

function expectedCombined(g){
  const ss=['SECTOR_BREADTH','SECTOR_RETURN','SECTOR_AMOUNT'].map(id=>g?.[id]?.status||'UNKNOWN');
  if(ss.includes('UNKNOWN'))return 'UNKNOWN';
  if(ss.includes('FAIL'))return 'FAIL';
  if(ss.every(x=>x==='PASS'))return 'PASS';
  return 'UNKNOWN';
}
function componentCounts(rows,id){
  const x={PASS:0,FAIL:0,UNKNOWN:0};
  for(const r of rows)inc(x,r.gates?.[id]?.status||'UNKNOWN');
  return {...x,evaluableN:x.PASS+x.FAIL,evaluableFailRate:pct(x.FAIL,x.PASS+x.FAIL)};
}
function marginStats(rows,key,threshold){
  const vals=rows.map(r=>finite(r.sector?.[key])).filter(x=>x!==null).map(x=>x-threshold);
  return stats(vals);
}

export function buildSystem1SectorGateComponentAudit({adapted,diagnosis,firstFailureMasking=null}={}){
  if(adapted?.researchOnly!==true||adapted?.decisionImpact!==false||adapted?.formalCoreImpact!==false||
     diagnosis?.schemaVersion!=='SYSTEM1_C1_ISOLATED_V0_1'||diagnosis?.researchOnly!==true||
     diagnosis?.decisionImpact!==false||diagnosis?.formalCoreImpact!==false)
    throw new Error('SECTOR_GATE_C1_DIAGNOSIS_REQUIRED');
  const rawBySymbol=new Map((adapted.rows||[]).map(r=>[String(r.symbol),r]));
  const rows=[],patternCounts={};
  let combinedFailN=0,combinedUnknownN=0,mismatchN=0,singleComponentFailN=0,multiComponentFailN=0;
  const uniqueFailCounts={SECTOR_BREADTH:0,SECTOR_RETURN:0,SECTOR_AMOUNT:0};
  for(const o of diagnosis.observations||[]){
    const raw=rawBySymbol.get(String(o.symbol));
    const gates=o.gates||{};
    const combined=gates.SECTOR_GATE?.status||'UNKNOWN';
    const expected=expectedCombined(gates);
    if(combined!==expected)mismatchN++;
    if(combined==='FAIL')combinedFailN++;
    if(combined==='UNKNOWN')combinedUnknownN++;
    const fails=['SECTOR_BREADTH','SECTOR_RETURN','SECTOR_AMOUNT'].filter(id=>gates[id]?.status==='FAIL');
    const unknowns=['SECTOR_BREADTH','SECTOR_RETURN','SECTOR_AMOUNT'].filter(id=>gates[id]?.status==='UNKNOWN');
    let pattern;
    if(unknowns.length&&fails.length)pattern='MIXED_FAIL_UNKNOWN:'+fails.map(x=>x.replace('SECTOR_','')).join('+')+'|'+unknowns.map(x=>x.replace('SECTOR_','')).join('+');
    else if(unknowns.length)pattern='UNKNOWN:'+unknowns.map(x=>x.replace('SECTOR_','')).join('+');
    else if(fails.length)pattern='FAIL:'+fails.map(x=>x.replace('SECTOR_','')).join('+');
    else pattern='PASS_ALL';
    inc(patternCounts,pattern);
    if(fails.length===1&&unknowns.length===0){singleComponentFailN++;uniqueFailCounts[fails[0]]++;}
    if(fails.length>1)multiComponentFailN++;
    rows.push({
      symbol:String(o.symbol),pool:o.pool||'UNKNOWN',combinedSectorGate:combined,expectedCombined:expected,
      componentFailSet:fails,componentUnknownSet:unknowns,pattern,
      sector:raw?.sector||{},
      formalFirstFailure:o.firstFailureReason||null
    });
  }
  const components={
    breadth:componentCounts(rows,'SECTOR_BREADTH'),
    avgChange:componentCounts(rows,'SECTOR_RETURN'),
    amountVs20DayAverage:componentCounts(rows,'SECTOR_AMOUNT')
  };
  const allPass=rows.filter(r=>r.combinedSectorGate==='PASS');
  const allFail=rows.filter(r=>r.combinedSectorGate==='FAIL');
  const hiddenByEarlier=firstFailureMasking?.perGate?.SECTOR_GATE?.hiddenBehindOtherFirstFailureN??null;
  const firstFailureN=firstFailureMasking?.perGate?.SECTOR_GATE?.firstFailureN??null;
  const observedFailN=firstFailureMasking?.perGate?.SECTOR_GATE?.observedFailN??combinedFailN;

  return {
    schemaVersion:SECTOR_GATE_COMPONENT_AUDIT_V0_1.schemaVersion,
    sessionDate:adapted.sessionDate,generationId:adapted.generationId,decisionAt:adapted.decisionAt,
    observedN:rows.length,combinedFailN,combinedUnknownN,combinedComponentMismatchN:mismatchN,
    componentCounts:components,patternCounts,singleComponentFailN,multiComponentFailN,uniqueFailCounts,
    thresholdMargins:{
      breadthAll:marginStats(rows,'breadth',40),breadthPassers:marginStats(allPass,'breadth',40),breadthCombinedFails:marginStats(allFail,'breadth',40),
      avgChangeAll:marginStats(rows,'avgChange',-1),avgChangePassers:marginStats(allPass,'avgChange',-1),avgChangeCombinedFails:marginStats(allFail,'avgChange',-1),
      amountVs20All:marginStats(rows,'amountVs20DayAverage',.5),amountVs20Passers:marginStats(allPass,'amountVs20DayAverage',.5),amountVs20CombinedFails:marginStats(allFail,'amountVs20DayAverage',.5)
    },
    firstFailureMasking:{
      available:firstFailureMasking!==null,
      sectorFirstFailureN:firstFailureN,
      sectorObservedFailN:observedFailN,
      hiddenBehindEarlierFirstFailureN:hiddenByEarlier,
      note:'FirstFailure is order-dependent. Hidden count is descriptive overlap, not marginal sector-gate contribution.'
    },
    interpretation:{
      componentPatternIsNotEconomicImportance:true,
      uniqueComponentFailIsNotRecoveredSelection:true,
      marginDistributionIsNotThresholdOptimization:true,
      combinedMismatchBlocksTrust:mismatchN>0,
      noOutcomeUsed:true,noThresholdSweep:true,noGateChange:true
    },
    evidenceTrust:mismatchN===0?'COMPONENT_PARITY_VERIFIED':'DATA_QUALITY_BLOCKED',
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,noPlanChanges:true,noTrade:true,noPush:true
  };
}
