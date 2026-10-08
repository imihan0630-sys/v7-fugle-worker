import {evaluateWave2Row} from "./d02_l4_wave2_admission_evaluator_v0_1.mjs";

export const PVE278_SCHEMA="D02_PVE278_WAVE2_ANTI_BYPASS_FIREWALL_V0_1";
const sha256=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
const date=v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v||""));
const caOk=new Set(["CLEAN","BRIDGE_VERIFIED","RESET_CLEAN_GE20"]);

function receiptCommon(r,name,out){
  if(!r||typeof r!=="object"){out.push(name+"_RECEIPT_MISSING");return false;}
  if(r.pass!==true)out.push(name+"_NOT_PASS");
  if(r.outcomeBlind!==true)out.push(name+"_NOT_OUTCOME_BLIND");
  if(!sha256(r.receiptHash))out.push(name+"_RECEIPT_HASH_INVALID");
  return true;
}
function intraday(r,out,{range=false,cumulative=false,adjacency=false}={}){
  if(!receiptCommon(r,"INTRADAY_BASELINE",out))return;
  if(!date(r.baselineAsOfDate))out.push("INTRADAY_BASELINE_AS_OF_INVALID");
  if(!date(r.expectedLatestComparableSlotDate))out.push("INTRADAY_EXPECTED_PRIOR_SLOT_INVALID");
  if(date(r.baselineAsOfDate)&&date(r.expectedLatestComparableSlotDate)&&r.baselineAsOfDate!==r.expectedLatestComparableSlotDate)out.push("INTRADAY_BASELINE_STALE");
  if(!Number.isInteger(r.slotHistoryCount)||r.slotHistoryCount<20)out.push("INTRADAY_SLOT_HISTORY_LT_20");
  if(range&&(!Number.isInteger(r.rangeHistoryCount)||r.rangeHistoryCount<20))out.push("INTRADAY_RANGE_HISTORY_LT_20");
  if(cumulative&&(!Number.isInteger(r.cumulativeHistoryCount)||r.cumulativeHistoryCount<20))out.push("INTRADAY_CUMULATIVE_HISTORY_LT_20");
  if(r.currentSlotCoverageValid!==true)out.push("INTRADAY_CURRENT_SLOT_COVERAGE_INVALID");
  if(r.exactSlotHistoryValidityState!=="PASS")out.push("INTRADAY_EXACT_SLOT_VALIDITY_NOT_PASS");
  if(!caOk.has(r.corporateActionContinuityState))out.push("INTRADAY_CA_CONTINUITY_NOT_PROVEN");
  if(r.currentSessionExcluded!==true)out.push("INTRADAY_CURRENT_SESSION_NOT_EXCLUDED");
  if(r.futureDatesAbsent!==true)out.push("INTRADAY_FUTURE_DATES_NOT_EXCLUDED");
  if(!sha256(r.rawPayloadHash))out.push("INTRADAY_RAW_PAYLOAD_HASH_INVALID");
  if(cumulative&&r.prefixContinuityPass!==true)out.push("INTRADAY_PREFIX_CONTINUITY_NOT_PASS");
  if(adjacency&&r.persistenceAdjacencyPass!==true)out.push("INTRADAY_PERSISTENCE_ADJACENCY_NOT_PASS");
}
function daily(r,out){
  if(!receiptCommon(r,"DAILY_CONTINUITY",out))return;
  if(!sha256(r.expectedSessionSetHash))out.push("DAILY_EXPECTED_SESSION_SET_HASH_INVALID");
  if(r.missingExpectedSessionCount!==0)out.push("DAILY_EXPECTED_SESSION_GAP");
  if(r.unitContinuityPass!==true)out.push("DAILY_UNIT_CONTINUITY_NOT_PASS");
  if(r.corporateActionContinuityPass!==true)out.push("DAILY_CA_CONTINUITY_NOT_PASS");
  if(r.sourceProvenancePass!==true)out.push("DAILY_SOURCE_PROVENANCE_NOT_PASS");
}
function rolling20(r,out){
  if(!receiptCommon(r,"ROLLING20",out))return;
  if(!Number.isInteger(r.historyCount)||r.historyCount<20)out.push("ROLLING20_HISTORY_LT_20");
  if(!date(r.baselineAsOfDate)||!date(r.expectedLatestPriorSession))out.push("ROLLING20_DATE_INVALID");
  else if(r.baselineAsOfDate!==r.expectedLatestPriorSession)out.push("ROLLING20_BASELINE_STALE");
  if(!sha256(r.expectedSessionSetHash))out.push("ROLLING20_SESSION_SET_HASH_INVALID");
  if(r.missingExpectedSessionCount!==0)out.push("ROLLING20_EXPECTED_SESSION_GAP");
  if(r.unitContinuityPass!==true)out.push("ROLLING20_UNIT_CONTINUITY_NOT_PASS");
  if(r.corporateActionContinuityPass!==true)out.push("ROLLING20_CA_CONTINUITY_NOT_PASS");
}
function control(r,out,{response=false}={}){
  if(!receiptCommon(r,"CONTROL_FRESHNESS",out))return;
  if(r.sameSlotRvolFreshnessPass!==true)out.push("CONTROL_RVOL_FRESHNESS_NOT_PASS");
  if(r.cumulativePaceFreshnessPass!==true)out.push("CONTROL_CUMPACE_FRESHNESS_NOT_PASS");
  if(response&&r.responseBaselineFreshnessPass!==true)out.push("CONTROL_RESPONSE_FRESHNESS_NOT_PASS");
  if(!sha256(r.controlDatasetHash))out.push("CONTROL_DATASET_HASH_INVALID");
}
function timeCurve(r,out){
  if(!receiptCommon(r,"TIME_CURVE_DENOMINATOR",out))return;
  if(!date(r.denominatorAsOfDate)||!date(r.expectedLatestComparableSlotDate))out.push("TIME_CURVE_DATE_INVALID");
  else if(r.denominatorAsOfDate!==r.expectedLatestComparableSlotDate)out.push("TIME_CURVE_DENOMINATOR_STALE");
  if(!Number.isInteger(r.historicalSessionCount)||r.historicalSessionCount<20)out.push("TIME_CURVE_HISTORY_LT_20");
  if(r.exactSlotHistoryValidityState!=="PASS")out.push("TIME_CURVE_EXACT_SLOT_VALIDITY_NOT_PASS");
  if(r.currentSessionExcluded!==true)out.push("TIME_CURVE_CURRENT_SESSION_NOT_EXCLUDED");
  if(r.futureDatesAbsent!==true)out.push("TIME_CURVE_FUTURE_DATES_NOT_EXCLUDED");
}

export function evaluatePve278Wave2AntiBypass(row={},evidence={}){
  const legacy=evaluateWave2Row(row);
  const reasons=[...legacy.reasons];
  const m=String(row.moduleId||"");
  if(m==="D02-04") intraday(evidence.intradayBaseline,reasons);
  else if(m==="D02-05") intraday(evidence.intradayBaseline,reasons,{range:true});
  else if(m==="D02-07") daily(evidence.dailyContinuity,reasons);
  else if(m==="D02-08") control(evidence.incrementalControlFreshness,reasons,{response:true});
  else if(m==="D02-09"&&row.family==="PIVOT_SIGNED_VOLUME") daily(evidence.dailyContinuity,reasons);
  else if(m==="D02-09"&&row.family==="PARTICIPATION_TRAJECTORY"){
    const use=evidence.participationUsage||{};
    if(use.usesSlotRvol!==true&&use.usesCumPace!==true&&use.usesPersistence!==true)reasons.push("TRAJECTORY_PARTICIPATION_LINEAGE_UNDECLARED");
    intraday(evidence.intradayBaseline,reasons,{cumulative:use.usesCumPace===true,adjacency:use.usesPersistence===true});
  }else if(m==="D02-10"){
    const type=String(evidence.participationFeatureType||"");
    if(!["SLOT_RVOL20","CUMVOL_PACE20","PERSISTENCE_STATE"].includes(type))reasons.push("D02_10_PARTICIPATION_LINEAGE_INVALID");
    intraday(evidence.intradayBaseline,reasons,{cumulative:type==="CUMVOL_PACE20",adjacency:type==="PERSISTENCE_STATE"});
  }else if(m==="D02-11") rolling20(evidence.rolling20Baseline,reasons);
  else if(m==="D02-12"&&row.family==="TIME_OF_DAY_VOLUME_CURVE"){
    timeCurve(evidence.timeCurveDenominator,reasons);
    control(evidence.incrementalControlFreshness,reasons);
  }else if(m==="D02-12"&&row.family==="PRICE_BY_VOLUME_PROFILE") control(evidence.incrementalControlFreshness,reasons);
  const uniq=[...new Set(reasons)];
  return Object.freeze({
    schemaVersion:PVE278_SCHEMA,moduleId:m,family:row.family??null,
    pass:uniq.length===0,reasons:Object.freeze(uniq),legacyAdmissionPass:legacy.pass,
    cleanProspectiveRowAuthorized:uniq.length===0,
    outcomeAccessAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false
  });
}
