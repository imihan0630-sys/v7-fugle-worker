// System 2 Class A BUILD research: asymmetric bearish risk OBSERVER.
// "SHORT_MOMENTUM" in existing contracts means short-term LONG momentum,
// NOT short-selling. No change to any owner-approved strategy contract.
// This module NEVER certifies borrow availability, execution, PIT, ranking,
// Frozen/Shadow, alerts, or real short order eligibility.
import {sha256Hex} from './decision_archive.mjs';

export const BEARISH_RADAR_RESEARCH_VERSION='V0.1-RESEARCH-OBSERVATION';
const SHA=/^[0-9a-f]{64}$/, DAY=/^\d{4}-\d{2}-\d{2}$/;
const UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const REGIMES=new Set(['UNKNOWN','RISK_ON','RISK_OFF','TREND','RANGE',
  'HIGH_VOLATILITY','PANIC','RECOVERY','SECTOR_ROTATION']);
const DATE=x=>typeof x==='string'&&DAY.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const clock=x=>typeof x==='string'&&UTC.test(x)&&
 Number.isFinite(Date.parse(x))&&
 new Date(Date.parse(x)).toISOString().slice(0,19)===x.slice(0,19);
const num=x=>Number.isFinite(x);
const isSha=x=>typeof x==='string'&&SHA.test(x);
function protect(code){throw Error('BEARISH_RADAR_RESEARCH_'+code);}

export async function evaluateBearishRiskRadarV0_1({
 factorBundle=null,market=null,sourceEvidence=null,
 evaluationAtUtc=null,regime='UNKNOWN'
}={}){
 const b=factorBundle,s=sourceEvidence;
 if(!clock(evaluationAtUtc)||!['TWSE','TPEX'].includes(market)||
    !REGIMES.has(regime))protect('SCOPE_OR_EVALUATION_CLOCK_INVALID');
 if(!b||typeof b!=='object'||Array.isArray(b)||
    !/^[1-9][0-9]{3}$/.test(b.symbol||'')||!DATE(b.marketDate)||
    !isSha(b.bundleHash)||!isSha(b.sourcePayloadHash))
   protect('FACTOR_SNAPSHOT_IDENTITY_MISSING');
 const {bundleHash,...unsignedBundle}=b;
 if(await sha256Hex(unsignedBundle)!==bundleHash)
   protect('FACTOR_SNAPSHOT_CONTENT_HASH_INVALID');
 const cut=Date.parse(evaluationAtUtc);
 const warnings=['NOT_AN_EXECUTABLE_SHORT_SIGNAL','BORROW_INVENTORY_UNKNOWN',
  'BORROW_COST_AND_FORCED_RECALL_UNKNOWN','NO_FORMAL_PIT_OR_FORWARD_PERFORMANCE_CERTIFICATION'];
 const blockers=[];
 if(!s||typeof s!=='object'||Array.isArray(s)||
    !isSha(s.originalNativeSourceSha256)||s.market!==market||
    s.symbol!==b.symbol||s.marketDate!==b.marketDate||
    !clock(s.firstPhysicalObservedAtUtc)||!clock(s.availableAtUtc)||
    s.priceContinuityReviewState===undefined)
   protect('SOURCE_EVIDENCE_REQUIRED_OR_IDENTITY_INVALID');
 if(s.sourceEvidenceClass!=='SOURCE_ONLY_PREVIEW_NOT_INDEPENDENT_AUDIT')
   protect('SOURCE_AUDIT_AUTHORITY_CANNOT_BE_SELF_DECLARED');
 if(Date.parse(s.firstPhysicalObservedAtUtc)>cut||
    Date.parse(s.availableAtUtc)>cut||
    Date.parse(s.availableAtUtc)<Date.parse(s.firstPhysicalObservedAtUtc)||
    !clock(b.observedAt)||!clock(b.availableAt)||
    Date.parse(b.availableAt)>cut||Date.parse(b.observedAt)>cut)
   blockers.push('ASOF_SOURCE_OR_FACTOR_OBSERVED_AFTER_DECISION');
 if(!Array.isArray(b.bars)||b.bars.length!==61||
    b.firstBarDate!==b.bars[0]?.date||
    b.lastBarDate!==b.marketDate||
    b.barCount!==61||b.bars.some((v,i)=>i>0&&v.date<=b.bars[i-1].date))
   blockers.push('EXACT_61_SESSION_HISTORY_NOT_AVAILABLE');
 if(b.pointInTimeEligible!==true)
   blockers.push('FACTOR_BUNDLE_AVAILABILITY_UNVERIFIED');
 // SOURCE_REVIEWED is a PREVIEW working hypothesis, never authoritative
 // proof that all CA sources were negative or historical PIT was met.
 if(s.priceContinuityReviewState!=='SOURCE_REVIEWED_NO_KNOWN_MATERIAL_EVENT'){
   blockers.push('MATERIAL_CORPORATE_ACTION_CONTINUITY_NOT_VERIFIED');
 }
 if(b.priceSpace!=='RAW'||b.continuityState!=='CLEAR_NO_ACTION'||
    b.continuityEligible!==true)
   blockers.push('RAW_OHLC_PRICE_SPACE_NOT_CONTINUOUS');
 // The Sept 16 2026 2330 source-positive dividend MUST NOT be disguised
 // as no-event. A positive known CA event (even if caller claims no-event)
 // blocks this V0.1 RAW-only observation; separate adjusted-version needed.
 if(s.knownMaterialCompanyActionInsideWindow===true ||
    (b.symbol==='2330'&&b.marketDate==='2026-10-16'&&
     b.firstBarDate<='2026-09-16'&&b.lastBarDate>='2026-09-16'))
   blockers.push('KNOWN_PRICE_DISCONTINUITY_DIVIDEND_INSIDE_WINDOW');
 if(s.knownMaterialCompanyActionInsideWindow!==true&&
    s.knownMaterialCompanyActionInsideWindow!==false)
   blockers.push('COMPANY_ACTION_EVENT_FLAG_UNKNOWN');
 const factorMap=new Map((b.factorObservations||[]).map(f=>[f.factorId,f]));
 const required=['TECH.TREND','TECH.STRUCTURE','PV.RELATIVE_VOLUME',
  'PV.RESPONSE','RISK.LIQUIDITY'];
 for(const id of required)
   if(factorMap.get(id)?.state!=='KNOWN')blockers.push('REQUIRED_FACTOR_UNKNOWN_'+id);
 const m=b.coreMetrics||{};
 if(!['close','ma5','ma20','ma20Slope1Pct','ret20','priorLow20',
      'relativeVolume20Prior','avgVolume20PriorLots','avgAmount20Prior']
      .every(k=>num(m[k])))
   blockers.push('REQUIRED_BEARISH_METRIC_UNKNOWN');
 if(!num(b.bars.at(-2)?.close))
   blockers.push('PREVIOUS_CLOSE_UNKNOWN');
 if(regime==='UNKNOWN')warnings.push('MARKET_REGIME_UNVERIFIED_NO_REGIME_RECOMMENDATION');
 if(regime==='RISK_ON'||regime==='RECOVERY')
   warnings.push('COUNTERTREND_SHORT_SQUEEZE_RISK');
 if(regime==='PANIC'||regime==='HIGH_VOLATILITY')
   warnings.push('PANIC_REVERSAL_AND_EXECUTION_RISK');
 let state='DATA_BLOCKED',observedSignals=[],counterEvidence=[];
 if(blockers.length===0){
  // Only relational / natural baselines, not optimised trade thresholds.
  const fallingTrend=m.ma5<m.ma20&&m.ma20Slope1Pct<0&&
      m.ret20<0&&m.close<m.ma20;
  const brokenStructure=m.close<m.priorLow20;
  const confirmedSelling=m.relativeVolume20Prior>1&&
      m.close<b.bars.at(-2).close;
  const bullishRefutation=m.maOrder5gt10gt20===true&&
      m.ma20Slope1Pct>0&&m.ret20>0;
  if(fallingTrend)observedSignals.push('FALLING_MA_STRUCTURE');
  if(brokenStructure)observedSignals.push('CLOSE_BELOW_PRIOR_20_SESSION_LOW');
  if(confirmedSelling)observedSignals.push('NEGATIVE_CLOSE_WITH_ABOVE_PRIOR_20_VOLUME');
  if(bullishRefutation)counterEvidence.push('BULLISH_MA_MOMENTUM_REFUTES_SHORT');
  if(m.relativeVolume20Prior<=1)counterEvidence.push('NO_ABOVE_PRIOR_20_VOLUME_CONFIRMATION');
  if(bullishRefutation)state='CONTRADICTED_BY_BULLISH_TREND';
  else if(fallingTrend&&brokenStructure&&confirmedSelling)
    state='BEARISH_CONFLUENCE_RESEARCH_ONLY';
  else if(observedSignals.length>0)state='BEARISH_WATCH_RESEARCH_ONLY';
  else state='NO_CURRENT_BEARISH_RELATIONAL_PATTERN';
 }
 if(s.priceContinuityReviewState==='SOURCE_REVIEWED_NO_KNOWN_MATERIAL_EVENT')
   warnings.push('NO_EVENT_NOT_AUTHORITATIVELY_PROVED_IN_PREVIEW');
 const result={
  schemaVersion:'S2_BEARISH_RISK_RADAR_RESEARCH_V0_1',
  strategyId:'BEARISH_RISK_RADAR',strategyVersion:BEARISH_RADAR_RESEARCH_VERSION,
  scope:'STANDALONE_NON_PIT_PREVIEW_NOT_SHORT_ELIGIBILITY',
  symbol:b.symbol,market,marketDate:b.marketDate,evaluationAtUtc,
  factorSnapshotHash:b.bundleHash,sourceOriginalClaimSha256:s.originalNativeSourceSha256,
  sourceReceiptIndependentlyAudited:false,
  marketRegime:regime,marketRegimeSourceAudited:false,
  state,observedSignals,counterEvidence,
  blockers:[...new Set(blockers)].sort(),warnings,
  observedBearishRiskSignalCount:observedSignals.length,
  signalStrengthScore:null,rank:null,allMarketUniverseCount:null,
  sourceMarketCoverageCertified:false,selectedCount:null,zeroPickDay:null,
  recommendationToShort:false,shortEligible:false,borrowLocateVerified:false,
  shortCostVerified:false,tradeabilityVerified:false,
  shortShadowAuthorized:false,formalPITAEligible:false,
  historicalPITBReplayCertified:false,pitAuditIndependent:false,
  livePush:false,ordersEnabled:false,frozenD1Written:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,system1FormalCoreChanged:false,
 };
 return Object.freeze({...result,receiptHash:await sha256Hex(result)});
}
