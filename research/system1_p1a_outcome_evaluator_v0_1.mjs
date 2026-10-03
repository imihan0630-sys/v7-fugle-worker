const DATE=/^\d{4}-\d{2}-\d{2}$/;
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=6)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const median=xs=>{
  if(!xs.length) return null;
  const a=[...xs].sort((x,y)=>x-y),m=Math.floor(a.length/2);
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
};
const uniq=xs=>[...new Set(xs)];

export const P1A_OUTCOME_GATE_V0_1=Object.freeze({
  minIndependentDates:15,
  minMarketRegimes:2,
  minDateDirectionAgreementPct:70
});

function validC1(x){
  return x?.schemaVersion==="SYSTEM1_C1_ISOLATED_V0_1"&&DATE.test(String(x?.sessionDate||""))&&
    Number.isInteger(x?.populationN)&&x.populationN>=0&&Array.isArray(x?.observations)&&x.observations.length===x.populationN;
}
function validC5(x){
  return x?.schemaVersion==="SYSTEM1_C5_SEMANTIC_REPAIR_V0_2"&&DATE.test(String(x?.sessionDate||""))&&
    typeof x?.generationId==="string"&&x.generationId.length>0&&Array.isArray(x?.rows)&&
    x?.researchOnly===true&&x?.formalCoreLocked===true&&x?.economicSuperiority==="UNKNOWN";
}
function validD5(r){
  return r?.schemaVersion==="SYSTEM1_D5_MATURITY_RECEIPT_V0_1"&&r?.mature===true&&
    DATE.test(String(r?.scanDate||""))&&typeof r?.symbol==="string"&&r.symbol.length>0&&
    typeof r?.parentGenerationId==="string"&&r.parentGenerationId.length>0&&
    finite(r?.afterCostReturnPct)!==null&&finite(r?.mfePct)!==null&&finite(r?.maePct)!==null&&
    Number.isFinite(Date.parse(String(r?.observedAt||"")));
}
function validRegime(r){
  return r?.schemaVersion==="SYSTEM1_MARKET_REGIME_RECEIPT_V0_1"&&r?.verified===true&&
    DATE.test(String(r?.scanDate||""))&&typeof r?.regime==="string"&&r.regime.trim().length>0&&
    Number.isFinite(Date.parse(String(r?.knownAt||"")));
}
function groupMean(rows,key){return round(mean(rows.map(x=>x[key])));}
function key(scanDate,symbol,generationId){return scanDate+"|"+symbol+"|"+generationId;}

function dateSummary({scanDate,generationId,formalSymbols,p1aSymbols,d5Map,regime}){
  const formalRows=formalSymbols.map(symbol=>d5Map.get(key(scanDate,symbol,generationId))).filter(Boolean);
  const p1aRows=p1aSymbols.map(symbol=>d5Map.get(key(scanDate,symbol,generationId))).filter(Boolean);
  const complete=formalRows.length===formalSymbols.length&&p1aRows.length===p1aSymbols.length&&
    formalSymbols.length>0&&p1aSymbols.length>0;
  const out={
    scanDate,generationId,regime:regime||null,
    formalExpectedN:formalSymbols.length,p1aExpectedN:p1aSymbols.length,
    formalOutcomeN:formalRows.length,p1aOutcomeN:p1aRows.length,complete
  };
  if(!complete) return out;
  out.formalAfterCostMeanPct=groupMean(formalRows,"afterCostReturnPct");
  out.p1aAfterCostMeanPct=groupMean(p1aRows,"afterCostReturnPct");
  out.afterCostDeltaPct=round(out.p1aAfterCostMeanPct-out.formalAfterCostMeanPct);
  out.formalMfeMeanPct=groupMean(formalRows,"mfePct");
  out.p1aMfeMeanPct=groupMean(p1aRows,"mfePct");
  out.mfeDeltaPct=round(out.p1aMfeMeanPct-out.formalMfeMeanPct);
  out.formalMaeMeanPct=groupMean(formalRows,"maePct");
  out.p1aMaeMeanPct=groupMean(p1aRows,"maePct");
  out.maeDeltaPct=round(out.p1aMaeMeanPct-out.formalMaeMeanPct);
  return out;
}
function directionAgreement(xs){
  const eligible=xs.filter(x=>x!==0);
  return eligible.length?round(eligible.filter(x=>x>0).length/eligible.length*100,2):null;
}
function lodoAgreement(xs){
  if(xs.length<2) return null;
  const full=mean(xs),sign=Math.sign(full);
  if(sign===0) return 0;
  let same=0;
  for(let i=0;i<xs.length;i++){
    const rest=xs.filter((_,j)=>j!==i),m=mean(rest);
    if(Math.sign(m)===sign) same++;
  }
  return round(same/xs.length*100,2);
}
function regimeStats(clean){
  const groups={};
  for(const d of clean){
    if(!d.regime) continue;
    (groups[d.regime]??=[]).push(d.afterCostDeltaPct);
  }
  return Object.fromEntries(Object.entries(groups).sort().map(([regime,xs])=>[regime,{
    dateN:xs.length,afterCostDeltaMeanPct:round(mean(xs)),afterCostDeltaMedianPct:round(median(xs)),
    directionAgreementPct:directionAgreement(xs)
  }]));
}
function integrityValidationPass(v){
  return ["sourceCoveragePass","matchedStrataPass","costStressPass","redundancyPass","purgedHoldoutPass",
    "multipleTestingPass"].every(k=>v?.[k]===true);
}

export function buildSystem1P1AOutcomeEvaluation({
  c1Diagnoses=[],c5Diagnostics=[],d5Receipts=[],regimeReceipts=[],validation={}
}={}){
  if(!Array.isArray(c1Diagnoses)||!Array.isArray(c5Diagnostics)||!Array.isArray(d5Receipts)||!Array.isArray(regimeReceipts))
    throw new Error("P1A_OUTCOME_ARRAY_INPUTS_REQUIRED");

  const c1ByDate=new Map();
  for(const c1 of c1Diagnoses){
    if(!validC1(c1)) throw new Error("P1A_OUTCOME_INVALID_C1");
    if(c1ByDate.has(c1.sessionDate)) throw new Error("P1A_OUTCOME_DUPLICATE_C1_DATE");
    c1ByDate.set(c1.sessionDate,c1);
  }

  const c5Keys=new Set(),validC5s=[];
  for(const c5 of c5Diagnostics){
    if(!validC5(c5)) throw new Error("P1A_OUTCOME_INVALID_C5");
    const k=c5.sessionDate+"|"+c5.generationId;
    if(c5Keys.has(k)) throw new Error("P1A_OUTCOME_DUPLICATE_C5");
    c5Keys.add(k);validC5s.push(c5);
  }

  const d5Map=new Map(),invalidD5=[];
  for(const r of d5Receipts){
    if(!validD5(r)){invalidD5.push((r?.scanDate||"?")+"|"+(r?.symbol||"?"));continue;}
    const k=key(r.scanDate,r.symbol,r.parentGenerationId);
    if(d5Map.has(k)) throw new Error("P1A_OUTCOME_DUPLICATE_D5");
    d5Map.set(k,r);
  }

  const regimeMap=new Map();
  for(const r of regimeReceipts){
    if(!validRegime(r)) continue;
    if(regimeMap.has(r.scanDate)) throw new Error("P1A_OUTCOME_DUPLICATE_REGIME_DATE");
    regimeMap.set(r.scanDate,r.regime);
  }

  const dates=[];
  let totalP1aRankableRows=0,totalFormalAdmittedRows=0;
  for(const c5 of validC5s){
    const c1=c1ByDate.get(c5.sessionDate);
    if(!c1) throw new Error("P1A_OUTCOME_C1_C5_DATE_MISMATCH");
    const formalSymbols=c1.observations.filter(o=>o?.formalResult?.ok===true).map(o=>String(o.symbol));
    const p1aSymbols=c5.rows.filter(r=>Array.isArray(r?.p1aBlockSet)&&r.p1aBlockSet.length>0&&r?.reachStage==="F9_RANKABLE")
      .map(r=>String(r.symbol));
    if(new Set([...formalSymbols,...p1aSymbols]).size!==formalSymbols.length+p1aSymbols.length)
      throw new Error("P1A_OUTCOME_GROUP_OVERLAP");
    totalP1aRankableRows+=p1aSymbols.length;totalFormalAdmittedRows+=formalSymbols.length;
    if(!formalSymbols.length||!p1aSymbols.length){
      dates.push({scanDate:c5.sessionDate,generationId:c5.generationId,regime:regimeMap.get(c5.sessionDate)||null,
        formalExpectedN:formalSymbols.length,p1aExpectedN:p1aSymbols.length,formalOutcomeN:0,p1aOutcomeN:0,
        complete:false,comparisonEligible:false});
      continue;
    }
    const row=dateSummary({scanDate:c5.sessionDate,generationId:c5.generationId,formalSymbols,p1aSymbols,d5Map,regime:regimeMap.get(c5.sessionDate)});
    row.comparisonEligible=true;dates.push(row);
  }

  const eligibleDates=dates.filter(d=>d.comparisonEligible);
  const clean=eligibleDates.filter(d=>d.complete);
  const deltas=clean.map(d=>d.afterCostDeltaPct);
  const absTotal=deltas.reduce((s,x)=>s+Math.abs(x),0);
  const uniqueRegimes=uniq(clean.map(d=>d.regime).filter(Boolean)).sort();
  const dateCoveragePct=eligibleDates.length?round(clean.length/eligibleDates.length*100,2):null;
  const dateCluster={
    eligibleComparisonDates:eligibleDates.length,
    cleanComparableDates:clean.length,
    dateCoveragePct,
    independentDates:clean.length,
    afterCostDeltaMeanPct:round(mean(deltas)),
    afterCostDeltaMedianPct:round(median(deltas)),
    directionAgreementPct:directionAgreement(deltas),
    lodoDirectionAgreementPct:lodoAgreement(deltas),
    bestDateDeltaPct:deltas.length?round(Math.max(...deltas)):null,
    worstDateDeltaPct:deltas.length?round(Math.min(...deltas)):null,
    maxAbsoluteDateContributionSharePct:absTotal>0?round(Math.max(...deltas.map(Math.abs))/absTotal*100,2):null,
    regimeCount:uniqueRegimes.length,regimes:uniqueRegimes,regimeStats:regimeStats(clean)
  };

  const gate=P1A_OUTCOME_GATE_V0_1;
  const completeOutcomeCoverage=eligibleDates.length>0&&clean.length===eligibleDates.length;
  const maturityReady=completeOutcomeCoverage&&clean.length>=gate.minIndependentDates&&
    uniqueRegimes.length>=gate.minMarketRegimes;
  const validationReady=integrityValidationPass(validation);
  const economicGatePass=
    dateCluster.directionAgreementPct!==null&&dateCluster.directionAgreementPct>=gate.minDateDirectionAgreementPct&&
    (dateCluster.lodoDirectionAgreementPct??0)>=gate.minDateDirectionAgreementPct&&
    validation?.riskSafetyPass===true&&validation?.regimeStabilityPass===true;

  let classification;
  if(totalP1aRankableRows===0) classification="P1A_NOT_MATERIAL";
  else if(!maturityReady||!validationReady) classification="P1A_FUNNEL_MATERIAL_OUTCOME_UNKNOWN";
  else if((dateCluster.afterCostDeltaMeanPct??0)<=0||(dateCluster.afterCostDeltaMedianPct??0)<=0||!economicGatePass)
    classification="P1A_MATERIAL_NO_ECONOMIC_GAIN";
  else classification="P1A_POSITIVE_ECONOMIC_EVIDENCE";

  return {
    schemaVersion:"SYSTEM1_P1A_OUTCOME_EVALUATION_V0_1",
    sourceContract:"SYSTEM1_P1A_MINIMAL_BLOCKING_AND_OUTCOME_CONTRACT_20261003_V0_1",
    gate,classification,
    population:{
      diagnosticDates:validC5s.length,totalFormalAdmittedRows,totalP1aRankableRows,
      eligibleComparisonDates:eligibleDates.length,cleanComparableDates:clean.length
    },
    dateCluster,dates,
    validation:{
      sourceCoveragePass:validation?.sourceCoveragePass===true,
      matchedStrataPass:validation?.matchedStrataPass===true,
      costStressPass:validation?.costStressPass===true,
      redundancyPass:validation?.redundancyPass===true,
      purgedHoldoutPass:validation?.purgedHoldoutPass===true,
      multipleTestingPass:validation?.multipleTestingPass===true,
      riskSafetyPass:validation?.riskSafetyPass===true,
      regimeStabilityPass:validation?.regimeStabilityPass===true
    },
    readiness:{completeOutcomeCoverage,maturityReady,validationReady,economicGatePass},
    exclusions:{invalidD5N:invalidD5.length,invalidD5Keys:invalidD5},
    interpretation:{
      equalDateWeightingPrimary:true,
      symbolsWithinDateAreNotIndependent:true,
      incompleteDatesExcludedFromEconomicComparisonButBlockReadiness:true,
      p1aRankableIsNotCandidate:true,
      positiveEvidenceDoesNotAuthorizeFormalChange:true
    },
    economicSuperiority:classification==="P1A_POSITIVE_ECONOMIC_EVIDENCE"?"RESEARCH_EVIDENCE_POSITIVE":"UNKNOWN",
    formalOptimizationCandidate:"NONE",
    ownerReviewRequiredBeforeAnyClassCProposal:true,
    autoSwitchAuthorized:false,formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true
  };
}
