export const SETUP_CHANNEL_SCALE_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_SETUP_CHANNEL_SCALE_AUDIT_V0_1',
  derivationVersion:'FORMAL_V8_15_OBSERVED_INPUTS_NO_DECISION_IMPACT',
  gradeBMin:65,
  theoreticalRange:{A:[38,82],B:[69.65,100]},
  researchOnly:true,
  formalCoreLocked:true
});

const finite=x=>typeof x==='number'&&Number.isFinite(x);
const round=(x,d=4)=>Math.round(x*10**d)/10**d;
const median=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;};
const stats=a=>a.length?{n:a.length,min:Math.min(...a),max:Math.max(...a),mean:round(a.reduce((s,x)=>s+x,0)/a.length),median:round(median(a))}:{n:0,min:null,max:null,mean:null,median:null};

function summarize(rows,channel){
  const formed=rows.filter(r=>r.channel===channel);
  const scored=formed.filter(r=>finite(r.setupQuality));
  const quality=scored.map(r=>r.setupQuality);
  const selected=scored.filter(r=>r.selected);
  const qualified=scored.filter(r=>r.qualified);
  const below=scored.filter(r=>r.setupQuality<SETUP_CHANNEL_SCALE_V0_1.gradeBMin);
  return {
    channel,channelFormedN:formed.length,setupQualityKnownN:scored.length,setupQualityUnknownN:formed.length-scored.length,
    gradePassN:scored.length-below.length,gradeFailN:below.length,
    gradeFailRate:scored.length?round(below.length/scored.length):null,
    formalQualifiedN:formed.filter(r=>r.qualified).length,formalSelectedN:formed.filter(r=>r.selected).length,
    setupQuality:stats(quality),qualifiedSetupQuality:stats(qualified.map(r=>r.setupQuality)),
    selectedSetupQuality:stats(selected.map(r=>r.setupQuality)),
    beyondATheoreticalMaxN:channel==='B'?scored.filter(r=>r.setupQuality>82).length:0,
    selectedBeyondATheoreticalMaxN:channel==='B'?selected.filter(r=>r.setupQuality>82).length:0
  };
}

export function buildSystem1SetupChannelScaleAudit(adapted){
  if(!adapted||!Array.isArray(adapted.rows))throw new Error('SETUP_CHANNEL_C1_REQUIRED');
  if(adapted.researchOnly!==true||adapted.decisionImpact!==false||adapted.formalCoreImpact!==false)
    throw new Error('SETUP_CHANNEL_RESEARCH_FIREWALL');
  const violations=[],rows=[];
  for(const raw of adapted.rows){
    const d=raw?.derived||{},a=d.setupState?.A?.pass===true,b=d.setupState?.B?.pass===true;
    const expected=b?'B':a?'A':null,channel=d.channel??null,score=finite(d.setupQuality)?d.setupQuality:null;
    if(a&&b)violations.push({symbol:String(raw.symbol),code:'A_B_MUTUAL_EXCLUSIVITY_VIOLATION'});
    if(channel!==expected)violations.push({symbol:String(raw.symbol),code:'CHANNEL_SETUP_STATE_MISMATCH'});
    if((a||b)&&d.derivationVersion&&d.derivationVersion!==SETUP_CHANNEL_SCALE_V0_1.derivationVersion)
      violations.push({symbol:String(raw.symbol),code:'DERIVATION_VERSION_MISMATCH'});
    if(score!==null&&channel==='A'&&(score<38-1e-9||score>82+1e-9))
      violations.push({symbol:String(raw.symbol),code:'A_SETUP_QUALITY_OUTSIDE_THEORETICAL_PASS_RANGE'});
    if(score!==null&&channel==='B'&&(score<69.65-1e-9||score>100+1e-9))
      violations.push({symbol:String(raw.symbol),code:'B_SETUP_QUALITY_OUTSIDE_THEORETICAL_PASS_RANGE'});
    rows.push({symbol:String(raw?.symbol||''),pool:raw?.feature?.close>=1000?'THOUSAND':'GENERAL',
      channel,setupAPass:a,setupBPass:b,setupQuality:score,
      qualified:raw?.formalResult?.ok===true,selected:raw?.formalResult?.selected===true});
  }
  const byChannel={A:summarize(rows,'A'),B:summarize(rows,'B')};
  const knownA=byChannel.A.setupQualityKnownN,knownB=byChannel.B.setupQualityKnownN;
  const medianGap=knownA&&knownB?round(byChannel.B.setupQuality.median-byChannel.A.setupQuality.median):null;
  return {
    schemaVersion:SETUP_CHANNEL_SCALE_V0_1.schemaVersion,
    sessionDate:adapted.sessionDate??null,generationId:adapted.generationId??null,decisionAt:adapted.decisionAt??null,
    derivationVersion:SETUP_CHANNEL_SCALE_V0_1.derivationVersion,
    status:violations.length?'DATA_QUALITY_BLOCKED':'VERIFIED',
    violations,observedRowsN:rows.length,channelFormedN:rows.filter(r=>r.channel).length,
    byChannel,crossChannelRawMedianGapBMinusA:medianGap,
    structuralContract:{
      commonGradeThreshold:65,
      aTheoreticalQualifyingRange:[38,82],
      bTheoreticalQualifyingRange:[69.65,100],
      bSetupPassImpliesGradePassUnderCurrentFormula:true,
      aSetupPassDoesNotImplyGradePassUnderCurrentFormula:true,
      commonGradeThresholdIsChannelAsymmetricByConstruction:true,
      rawScoresAreNotAssumedCrossChannelCalibrated:true
    },
    interpretation:{
      aGradeGateExposureN:byChannel.A.gradeFailN,
      bGradeGateExposureN:byChannel.B.gradeFailN,
      bBeyondAReachN:byChannel.B.beyondATheoreticalMaxN,
      selectedBBeyondAReachN:byChannel.B.selectedBeyondATheoreticalMaxN,
      candidateCountIsNotEconomicSuccess:true,
      structuralAsymmetryIsNotProofOfEconomicHarm:true,
      noAlternativeFormulaTested:true,
      noOutcomeUsed:true
    },
    eligibleForEconomicInference:false,economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',
    prospectiveEvidenceMature:false,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true,formalCoreLocked:true
  };
}
