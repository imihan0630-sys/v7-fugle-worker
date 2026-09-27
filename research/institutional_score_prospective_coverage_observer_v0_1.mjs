import {decomposeInstitutionalScoreFromSnapshot} from "./institutional_score_decomposition_observer_v0_2.mjs";

function finite(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function round2(v){return Math.round((Number(v)+Number.EPSILON)*100)/100;}

export function classifyInstitutionalScoreSnapshot({
  snapshot,
  streakEvidence=null
}={}){
  if(!snapshot || snapshot.sourceCompleteness!=="FULL_FORMAL_SCAN"){
    return {
      state:"UNKNOWN_PARENT",
      reason:"FULL_FORMAL_SCAN_REQUIRED",
      scanDate:String(snapshot?.scanDate||""),
      symbol:String(snapshot?.symbol||""),
      formalReproducible:false
    };
  }

  const d=decomposeInstitutionalScoreFromSnapshot(snapshot);
  const storedScore=finite(snapshot?.institution?.score);
  if(storedScore===null){
    return {
      state:"UNKNOWN_INPUT",
      reason:"STORED_INSTITUTION_SCORE_MISSING",
      scanDate:String(snapshot.scanDate||""),symbol:String(snapshot.symbol||""),
      formalReproducible:false,decomposition:d
    };
  }

  const recomputedRounded=round2(d.score);
  const scoreMatches=Math.abs(recomputedRounded-storedScore)<=0.011;
  if(!scoreMatches){
    return {
      state:"SCORE_MISMATCH",
      reason:"RECOMPUTED_SCORE_DIFFERS_FROM_STORED",
      scanDate:String(snapshot.scanDate||""),symbol:String(snapshot.symbol||""),
      storedScore,recomputedRounded,formalReproducible:false,decomposition:d
    };
  }

  const ev=d.evidence;
  const nonStreakEvidenceComplete=
    ev.foreignNetObserved&&ev.trustNetObserved&&ev.dealerNetObserved&&
    ev.institutionTotalNetObserved&&ev.avgVolume20LotsObserved&&ev.avgVolume20LotsPositive&&
    ev.chipConcentrationObserved;

  const streakCertified=Boolean(
    streakEvidence?.sameGeneration===true &&
    streakEvidence?.ready===true &&
    Number(streakEvidence?.institutionHistoryDays)>=3
  );

  let state;
  if(!nonStreakEvidenceComplete) state="FORMAL_REPRODUCIBLE_BUT_SOURCE_INCOMPLETE";
  else if(!streakCertified) state="FORMAL_REPRODUCIBLE_BUT_STREAK_PROVENANCE_UNCERTIFIED";
  else state="CLEAN";

  const clean=state==="CLEAN";
  return {
    state,
    scanDate:String(snapshot.scanDate||""),
    symbol:String(snapshot.symbol||""),
    storedScore,
    recomputedRounded,
    formalReproducible:true,
    sourceEvidence:{
      nonStreakEvidenceComplete,
      streakCertified,
      institutionHistoryDays:finite(streakEvidence?.institutionHistoryDays),
      streakReady:streakEvidence?.ready===true,
      streakSameGeneration:streakEvidence?.sameGeneration===true,
      persistedStreakZerosSelfAuthenticate:false
    },
    metrics:clean?{
      scoreSaturated100:d.diagnostics.scoreSaturated100,
      actorSignDivergence:d.diagnostics.actorSignDivergence,
      aggregateNetNegativeButAnyActorPositive:d.diagnostics.aggregateNetNegativeButAnyActorPositive,
      ownershipShareOfPreClamp:d.diagnostics.ownershipShareOfPreClamp,
      preClamp:d.preClamp
    }:null,
    decomposition:d
  };
}

export function summarizeInstitutionalCoverage(records=[]){
  const rows=(Array.isArray(records)?records:[]).map(record=>
    classifyInstitutionalScoreSnapshot({
      snapshot:record?.snapshot??record,
      streakEvidence:record?.streakEvidence??null
    })
  );
  const byDate={};
  for(const row of rows){
    const date=row.scanDate||"UNKNOWN";
    const d=byDate[date] ||= {
      eligibleRows:0,cleanRows:0,formalReproducibleRows:0,
      sourceIncompleteRows:0,streakProvenanceUncertifiedRows:0,
      unknownParentRows:0,unknownInputRows:0,scoreMismatchRows:0,
      saturatedRowsAmongClean:0,actorSignDivergenceRowsAmongClean:0,
      aggregateNetNegativeButAnyActorPositiveRowsAmongClean:0,
      ownershipContributionShares:[]
    };
    d.eligibleRows+=1;
    if(row.formalReproducible) d.formalReproducibleRows+=1;
    if(row.state==="CLEAN"){
      d.cleanRows+=1;
      if(row.metrics?.scoreSaturated100) d.saturatedRowsAmongClean+=1;
      if(row.metrics?.actorSignDivergence===true) d.actorSignDivergenceRowsAmongClean+=1;
      if(row.metrics?.aggregateNetNegativeButAnyActorPositive===true) d.aggregateNetNegativeButAnyActorPositiveRowsAmongClean+=1;
      if(Number.isFinite(row.metrics?.ownershipShareOfPreClamp)) d.ownershipContributionShares.push(row.metrics.ownershipShareOfPreClamp);
    }else if(row.state==="FORMAL_REPRODUCIBLE_BUT_SOURCE_INCOMPLETE") d.sourceIncompleteRows+=1;
    else if(row.state==="FORMAL_REPRODUCIBLE_BUT_STREAK_PROVENANCE_UNCERTIFIED") d.streakProvenanceUncertifiedRows+=1;
    else if(row.state==="UNKNOWN_PARENT") d.unknownParentRows+=1;
    else if(row.state==="UNKNOWN_INPUT") d.unknownInputRows+=1;
    else if(row.state==="SCORE_MISMATCH") d.scoreMismatchRows+=1;
  }
  return {
    schemaVersion:"institutional-score-prospective-coverage-observer-v0.1",
    rows,
    byDate,
    guards:{
      unitOfIndependence:"scanDate",
      outcomesUsed:false,
      historicalBackfillAllowed:false,
      cleanRequiresSameGenerationStreakEvidence:true,
      formalCoreChanged:false
    }
  };
}
