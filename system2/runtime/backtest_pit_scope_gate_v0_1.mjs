// System2 independent historical backtest PIT gate.
// Missing vintage/revisions is NOT "zero", NOT automatically eligible.
// This classifies input permission only; neither outcomes nor alpha are certified.
import {sha256Hex} from './decision_archive.mjs';
const SHA=/^[a-f0-9]{64}$/i;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const isUtc=x=>typeof x==='string'&&UTC.test(x)&&Number.isFinite(Date.parse(x));
function fail(c){throw Error('S2_BACKTEST_PIT_'+c);}
export async function assessSystem2BacktestPITScopeV0_1({
 studyId,requestedDecisionAtUtc,observations,
}={}){
 if(typeof studyId!=='string'||!/^[A-Za-z0-9_-]{3,70}$/.test(studyId)||
    !isUtc(requestedDecisionAtUtc)||!Array.isArray(observations)||
    observations.length===0||observations.length>3000)
  fail('INPUT_OR_DECISION_CLOCK_INVALID');
 const cutoff=Date.parse(requestedDecisionAtUtc);
 const seen=new Set(),diagnosis=[],usable=[];
 for(const row of observations){
  if(!/^[1-9]\d{3}$/.test(row?.symbol||'')||
     !/^\d{4}-\d\d-\d\d$/.test(row?.marketDate||'')||
     !['TWSE','TPEX'].includes(row?.market)||
     row.marketDate>requestedDecisionAtUtc.slice(0,10))
    fail('INVALID_MARKET_SYMBOL_OR_DATE');
  const key=row.market+'|'+row.symbol+'|'+row.marketDate;
  if(seen.has(key))fail('DUPLICATE_STUDY_OBSERVATION');
  seen.add(key);
  const blockers=[];
  if(!SHA.test(row?.originalSourceHash||'')||
     !isUtc(row?.firstKnownAt)||!isUtc(row?.availableAt)||
     Date.parse(row.firstKnownAt)>cutoff||
     Date.parse(row.availableAt)>cutoff)
    blockers.push('SOURCE_NOT_PROVEN_KNOWN_BY_HISTORICAL_DECISION');
  if(row?.corporateActionVersionHistoryComplete!==true||
     row?.correctionAndCancellationHistoryComplete!==true||
     row?.caNoEventOrAdjustmentPITProof!==true||
     !SHA.test(row?.companyActionVersionHash||''))
    blockers.push('CORPORATE_ACTION_VINTAGE_OR_NO_EVENT_PIT_MISSING');
  if(row?.priceAdjustmentAndContinuityVerified!==true)
    blockers.push('HISTORICAL_PRICE_CONTINUITY_UNVERIFIED');
  if(row?.factorVersionAndRegimeKnownAtVerified!==true)
    blockers.push('HISTORICAL_FACTOR_REGIME_VINTAGE_UNVERIFIED');
  const status=blockers.length?'DIAGNOSTIC_ONLY_NOT_CERTIFIABLE':
    'PIT_INPUT_SLICE_ELIGIBLE_PERFORMANCE_STILL_UNCERTIFIED';
  diagnosis.push({symbol:row.symbol,market:row.market,
    marketDate:row.marketDate,status,blockers,
    originalSourceHash:row.originalSourceHash||null,
    companyActionVersionHash:row.companyActionVersionHash||null});
  if(!blockers.length)usable.push(key);
 }
 const missing=diagnosis.filter(x=>x.blockers.length).length;
 const base={schemaVersion:'S2_BACKTEST_PIT_SCOPE_GATE_V0_1',
  studyId,decisionCutoffUtc:requestedDecisionAtUtc,
  totalInputSlices:observations.length,
  pitSliceEligibleCount:usable.length,
  diagnosticOnlyCount:missing,
  studyWidePITEligible:missing===0,
  backtestResearchExecutionPermitted:true,
  unqualifiedSliceIncludedInCertifiedReturns:false,
  performanceCertificationAuthorized:false,
  reason:'COST_OOS_REGIME_SAMPLE_REPRESENTATIVENESS_AND_REAL_EXECUTION_NOT_ATTESTED',
  sliceDiagnostics:diagnosis,
  noFutureRevisionBackfill:true,
  finalSystem2SelectionTouched:false,system1FormalTouched:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0};
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
