const SAFETY=Object.freeze([
  "SOURCE_AUTHENTICITY","SESSION_CONTINUITY","CORPORATE_ACTION_CONTINUITY","EXECUTION_FEASIBILITY","ACCOUNT_RISK"
]);
const round=(x,d=4)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;
const pct=(n,d)=>d>0?round(n/d*100,4):null;
const inc=(o,k)=>{o[k]=(o[k]||0)+1;};
const comboKey=xs=>xs.length?xs.slice().sort().join("+"):"NONE";

function verifyInputs(c5,conditional){
  if(c5?.schemaVersion!=="SYSTEM1_C5_SEMANTIC_REPAIR_V0_2"||
     conditional?.schemaVersion!=="SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_V0_1"||
     c5?.researchOnly!==true||c5?.formalCoreLocked!==true||
     conditional?.researchOnly!==true||conditional?.formalCoreLocked!==true||
     c5?.sessionDate!==conditional?.sessionDate||
     c5?.generationId!==conditional?.generationId||
     c5?.strategy!==conditional?.strategy||
     !Array.isArray(c5?.rows)||!Array.isArray(conditional?.rows))
    throw new Error("P1A_SAFETY_DEMAND_MATCHED_INPUTS_REQUIRED");
  return {c5,conditional};
}

export function buildP1ASafetyCaptureDemand(c5Diagnostic,conditionalDiagnostic){
  const {c5,conditional}=verifyInputs(c5Diagnostic,conditionalDiagnostic);
  const strictBySymbol=new Map(c5.rows.map(r=>[String(r.symbol),r]));
  const familyAll={},familyConditionalF9={},familyIncrementalF9={},comboAll={},comboConditionalF9={},comboIncrementalF9={};
  let p1aRowsN=0,conditionalF9N=0,strictF9N=0,incrementalConditionalF9N=0,
      conditionalF9WithSafetyUnknownN=0,conditionalF9WithoutSafetyUnknownN=0,rowsMissingFromConditional=0;
  const rows=[];

  for(const strict of c5.rows){
    if(!Array.isArray(strict?.p1aBlockSet)||strict.p1aBlockSet.length===0) continue;
    p1aRowsN++;
    const symbol=String(strict.symbol);
    const row=conditional.rows.find(x=>String(x.symbol)===symbol);
    if(!row){rowsMissingFromConditional++;continue;}
    const unknowns=(row.conditionalSafetyUnknownSet||[]).map(String).sort();
    if(unknowns.some(x=>!SAFETY.includes(x))) throw new Error("P1A_SAFETY_DEMAND_NONCANONICAL_FAMILY");
    const combo=comboKey(unknowns);
    for(const family of unknowns) inc(familyAll,family);
    inc(comboAll,combo);

    const strictF9=strict.reachStage==="F9_RANKABLE";
    const conditionalF9=row.conditionalP1aRankable===true&&row.conditionalReachStage==="F9_RANKABLE";
    const incremental=conditionalF9&&!strictF9;
    if(strictF9) strictF9N++;
    if(conditionalF9){
      conditionalF9N++;
      if(unknowns.length) conditionalF9WithSafetyUnknownN++;
      else conditionalF9WithoutSafetyUnknownN++;
      for(const family of unknowns) inc(familyConditionalF9,family);
      inc(comboConditionalF9,combo);
    }
    if(incremental){
      incrementalConditionalF9N++;
      for(const family of unknowns) inc(familyIncrementalF9,family);
      inc(comboIncrementalF9,combo);
    }

    rows.push({
      symbol,
      strictReachStage:strict.reachStage,
      conditionalReachStage:row.conditionalReachStage,
      strictRankable:strictF9,
      conditionalRankable:conditionalF9,
      incrementalConditionalRankable:incremental,
      unresolvedSafetyFamilies:unknowns,
      unresolvedSafetyCombination:combo,
      verifiedSafetyFailSet:[...(row.verifiedSafetyFailSet||[])].sort(),
      conditionalReachBlockedBy:[...(row.conditionalReachBlockedBy||[])].sort(),
      researchUpperBoundOnly:true,
      captureAuthorization:false,
      formalSelected:false,buyAuthorized:false,allocation:0,signal:null,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    });
  }

  if(rowsMissingFromConditional>0) throw new Error("P1A_SAFETY_DEMAND_CONDITIONAL_DENOMINATOR_INCOMPLETE");
  const familyRows=SAFETY.map(family=>({
    family,
    unresolvedAllP1aN:familyAll[family]||0,
    unresolvedAllP1aPct:pct(familyAll[family]||0,p1aRowsN),
    unresolvedConditionalF9N:familyConditionalF9[family]||0,
    unresolvedConditionalF9Pct:pct(familyConditionalF9[family]||0,conditionalF9N),
    unresolvedIncrementalF9N:familyIncrementalF9[family]||0,
    unresolvedIncrementalF9Pct:pct(familyIncrementalF9[family]||0,incrementalConditionalF9N)
  }));
  const combos=obj=>Object.entries(obj).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
    .map(([combination,count])=>({combination,count}));

  let demandState;
  if(p1aRowsN===0) demandState="NO_P1A_ROWS";
  else if(incrementalConditionalF9N===0) demandState="NO_INCREMENTAL_SAFETY_CAPTURE_DEMAND_OBSERVED";
  else demandState="INCREMENTAL_SAFETY_CAPTURE_DEMAND_MEASURED_THRESHOLD_NOT_FROZEN";

  return {
    schemaVersion:"SYSTEM1_P1A_SAFETY_CAPTURE_DEMAND_V0_1",
    sourceContract:"SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_CONTRACT_20261003_V0_1",
    sessionDate:c5.sessionDate,generationId:c5.generationId,strategy:c5.strategy,
    denominator:{
      formalRejectedN:c5.formalRejectedN,
      p1aRowsN,
      strictF9N,
      conditionalF9N,
      incrementalConditionalF9N,
      conditionalF9WithSafetyUnknownN,
      conditionalF9WithoutSafetyUnknownN
    },
    ratios:{
      conditionalF9OfFormalRejectedPct:pct(conditionalF9N,c5.formalRejectedN),
      incrementalConditionalF9OfFormalRejectedPct:pct(incrementalConditionalF9N,c5.formalRejectedN),
      conditionalF9OfP1aPct:pct(conditionalF9N,p1aRowsN),
      incrementalConditionalF9OfP1aPct:pct(incrementalConditionalF9N,p1aRowsN)
    },
    familyDemand:familyRows,
    combinationDemand:{
      allP1a:combos(comboAll),
      conditionalF9:combos(comboConditionalF9),
      incrementalConditionalF9:combos(comboIncrementalF9)
    },
    rows,
    demandState,
    materialityThresholdStatus:"NOT_FROZEN",
    materialityClassification:"UNCLASSIFIED_THRESHOLD_NOT_FROZEN",
    captureLaneAuthorization:"NONE",
    classBImplementationAuthorized:false,
    interpretation:{
      countsMeasureEngineeringDemandNotEconomicBenefit:true,
      incrementalF9IsUpperBoundNotCandidateCount:true,
      zeroIncrementalDemandDoesNotProveGateOptimality:true,
      positiveDemandDoesNotAuthorizeSafetyCapture:true,
      verifiedSafetyFailNeverCountedAsDemand:true,
      safetyFamiliesRemainSeparateFromStockEconomicThesis:true
    },
    economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
