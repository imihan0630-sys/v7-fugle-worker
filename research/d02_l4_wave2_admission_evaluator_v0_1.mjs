const finite=v=>Number.isFinite(Number(v));
const isoMs=v=>Number.isFinite(Date.parse(v))?Date.parse(v):null;
const uniq=xs=>[...new Set(xs)];
const pass=(extra={})=>({pass:true,reasons:[],...extra});
const fail=(reasons=[],extra={})=>({pass:false,reasons:[...new Set(reasons)],...extra});
const slotMinutes=v=>{const m=String(v??'').match(/^(\d{2}):(\d{2})$/);return m?Number(m[1])*60+Number(m[2]):null;};
const forbiddenIntent=new Set(['ACCUMULATION','DISTRIBUTION','SMART_MONEY_BUYING','SMART_MONEY_SELLING','ABSORPTION','PASSIVE_ABSORPTION','ICEBERG','SPOOFING','TRUE_OFI']);

export const D02_L4_WAVE2_ADMISSION_VERSION='D02_L4_WAVE2_ADMISSION_V0_1';
export const WAVE2_MODULES=['D02-04','D02-05','D02-07','D02-08','D02-09','D02-10','D02-11','D02-12'];

function commonReasons(row){
  const r=[];
  if(!WAVE2_MODULES.includes(String(row.moduleId||''))) r.push('UNSUPPORTED_MODULE');
  if(!row.scanDate) r.push('MISSING_SCAN_DATE');
  if(!row.eventId) r.push('MISSING_EVENT_ID');
  if(row.gate0to6Pass!==true) r.push('GATE_0_6_NOT_PASS');
  if(row.dataQaPass!==true) r.push('DATA_QA_NOT_PASS');
  if(row.cleanCohortProvenance!==true) r.push('COHORT_PROVENANCE_NOT_CLEAN');
  if(row.generationAligned!==true) r.push('GENERATION_NOT_ALIGNED');
  if(row.formalIsolationPass!==true) r.push('FORMAL_ISOLATION_NOT_PASS');
  if(row.sourceContinuityPass!==true) r.push('SOURCE_CONTINUITY_NOT_PASS');
  if(row.commonSupportPass!==true) r.push('COMMON_SUPPORT_NOT_PASS');
  if(row.cleanScanDate!==true) r.push('SCAN_DATE_NOT_CLEAN');
  const first=isoMs(row.featureFirstKnownAt);
  const cutoff=isoMs(row.decisionCutoffAt);
  if(first===null||cutoff===null) r.push('FEATURE_OR_CUTOFF_CLOCK_INVALID');
  else if(first>cutoff) r.push('FEATURE_KNOWN_AFTER_DECISION_CUTOFF');
  return r;
}

export function evaluateWave2Row(row={}){
  const r=commonReasons(row);
  const m=String(row.moduleId||'');

  if(m==='D02-04'){
    if(row.state!=='LOW_PARTICIPATION_CANDIDATE') r.push('D02_04_NOT_FROZEN_DRYUP_CANDIDATE');
    if(row.candidateLabelImmutable!==true) r.push('D02_04_CANDIDATE_NOT_IMMUTABLE');
    if(row.priceConsolidationGeometryKnown!==true) r.push('D02_04_PRICE_GEOMETRY_UNKNOWN');
    if(row.volatilityContractionKnown!==true) r.push('D02_04_VOLATILITY_CONTROL_UNKNOWN');
    if(row.liquidityContextKnown!==true) r.push('D02_04_LIQUIDITY_CONTROL_UNKNOWN');
    if(row.laterDemandStateUsedInFeature===true) r.push('D02_04_HINDSIGHT_DEMAND_REEXPANSION_LEAK');
  }

  if(m==='D02-05'){
    if(row.participationBand!=='EXTREME') r.push('D02_05_NOT_EXTREME_PARTICIPATION');
    if(row.volumeBandFrozenPreOutcome!==true) r.push('D02_05_BAND_NOT_FROZEN_PRE_OUTCOME');
    if(row.priceResponseStateKnown!==true) r.push('D02_05_RESPONSE_UNKNOWN');
    if(row.volatilityContextKnown!==true) r.push('D02_05_VOLATILITY_CONTROL_UNKNOWN');
    if(row.eventContextKnown!==true) r.push('D02_05_EVENT_CONTROL_UNKNOWN');
    if(row.liquidityContextKnown!==true) r.push('D02_05_LIQUIDITY_CONTROL_UNKNOWN');
    if(forbiddenIntent.has(String(row.motiveLabel||''))) r.push('D02_05_FORBIDDEN_MOTIVE_LABEL');
  }

  if(m==='D02-07'){
    if(!finite(row.signedVolumeBalance20)) r.push('D02_07_SVB20_INVALID');
    if(row.dailyVolumeContinuityPass!==true) r.push('D02_07_VOLUME_CONTINUITY_NOT_PASS');
    if(row.pricePathControlPresent!==true) r.push('D02_07_PRICE_CONTROL_MISSING');
    if(row.directVolumeControlPresent!==true) r.push('D02_07_DIRECT_VOLUME_CONTROL_MISSING');
    if(row.responsePersistenceControlPresent!==true) r.push('D02_07_RESPONSE_CONTROL_MISSING');
    if(row.identicalSupportCvsD!==true) r.push('D02_07_C_D_SUPPORT_MISMATCH');
    if(row.rawObvIndependentVote===true) r.push('D02_07_RAW_OBV_DOUBLE_COUNT');
    if(row.unfrozenObvSlopeUsed===true) r.push('D02_07_UNFROZEN_OBV_SLOPE');
  }

  if(m==='D02-08'){
    if(!finite(row.providerTradePressureProxy)||Number(row.providerTradePressureProxy)<-1||Number(row.providerTradePressureProxy)>1) r.push('D02_08_PRESSURE_PROXY_INVALID');
    if(!finite(row.classificationCoverage)||Number(row.classificationCoverage)<0||Number(row.classificationCoverage)>1) r.push('D02_08_CLASSIFICATION_COVERAGE_INVALID');
    if(!finite(row.unclassifiedVolume)||Number(row.unclassifiedVolume)<0) r.push('D02_08_UNCLASSIFIED_VOLUME_INVALID');
    if(row.pressureSourceContinuityPass!==true) r.push('D02_08_PRESSURE_SOURCE_CONTINUITY_NOT_PASS');
    if(row.spreadDepthLiquidityControlsKnown!==true) r.push('D02_08_LIQUIDITY_CONTROLS_UNKNOWN');
    if(row.trueOfiEligible!==false) r.push('D02_08_TRUE_OFI_MUST_REMAIN_FALSE');
    if(row.dynamicAbsorptionEligible!==false) r.push('D02_08_DYNAMIC_ABSORPTION_MUST_REMAIN_FALSE');
    if(row.participantIntentEligible!==false) r.push('D02_08_PARTICIPANT_INTENT_MUST_REMAIN_FALSE');
    if(forbiddenIntent.has(String(row.motiveLabel||''))) r.push('D02_08_FORBIDDEN_INTENT_LABEL');
  }

  if(m==='D02-09'){
    if(!['PIVOT_SIGNED_VOLUME','PARTICIPATION_TRAJECTORY'].includes(row.family)) r.push('D02_09_UNSUPPORTED_DIVERGENCE_FAMILY');
    if(row.genericDivergenceBooleanUsed===true) r.push('D02_09_GENERIC_BOOLEAN_FORBIDDEN');
    if(row.visualPivotSelectionUsed===true) r.push('D02_09_VISUAL_PIVOT_SELECTION_FORBIDDEN');
    if(row.allPairScanUsed===true) r.push('D02_09_ALL_PAIR_SCAN_FORBIDDEN');
    if(row.bestWindowSearchUsed===true) r.push('D02_09_BEST_WINDOW_SEARCH_FORBIDDEN');
    if(row.underlyingPriceAndVolumeTrajectoriesPresent!==true) r.push('D02_09_UNDERLYING_TRAJECTORIES_MISSING');
    if(row.family==='PIVOT_SIGNED_VOLUME'){
      if(row.confirmedPivotChronologyPass!==true) r.push('D02_09_PIVOT_CHRONOLOGY_NOT_PASS');
      if(row.sameTypeSameScaleConsecutivePivots!==true) r.push('D02_09_PIVOT_PAIR_INVALID');
      if(row.priceContinuityPass!==true) r.push('D02_09_PRICE_CONTINUITY_NOT_PASS');
      if(row.dailyVolumeContinuityPass!==true) r.push('D02_09_VOLUME_CONTINUITY_NOT_PASS');
      const confirmed=isoMs(row.laterPivotConfirmedAt), first=isoMs(row.featureFirstKnownAt);
      if(confirmed===null||first===null||confirmed>first) r.push('D02_09_PIVOT_CONFIRMED_AFTER_FEATURE_CLOCK');
    }
    if(row.family==='PARTICIPATION_TRAJECTORY' && row.trajectoryClockPass!==true) r.push('D02_09_TRAJECTORY_CLOCK_NOT_PASS');
  }

  if(m==='D02-10'){
    if(row.trendParentOwner!=='D03') r.push('D02_10_TREND_PARENT_OWNER_INVALID');
    if(row.directTrendPresent!==true) r.push('D02_10_DIRECT_TREND_MISSING');
    if(row.directParticipationPresent!==true) r.push('D02_10_DIRECT_PARTICIPATION_MISSING');
    if(row.explicitInteractionTransformPresent!==true) r.push('D02_10_INTERACTION_MISSING');
    if(row.identicalSupportCvsD!==true) r.push('D02_10_C_D_SUPPORT_MISMATCH');
    if(row.noTripleVote!==true) r.push('D02_10_TRIPLE_VOTE_RISK');
    const ik=isoMs(row.interactionFirstKnownAt), tk=isoMs(row.trendParentKnownAt), vb=isoMs(row.volumeBarEnd), vf=isoMs(row.volumeSourceFetchedAt), cutoff=isoMs(row.decisionCutoffAt);
    if([ik,tk,vb,vf,cutoff].some(x=>x===null)) r.push('D02_10_INTERACTION_CLOCK_INVALID');
    else {
      if(ik<Math.max(tk,vb,vf)) r.push('D02_10_INTERACTION_KNOWN_TOO_EARLY');
      if(ik>cutoff) r.push('D02_10_INTERACTION_AFTER_CUTOFF');
    }
    if(row.slotKey==='09:00' && row.interactionUsesCumvolPace===true) r.push('D02_10_09_00_CUMPACE_STRUCTURAL_REDUNDANCY');
  }

  if(m==='D02-11'){
    if(!['ADMITTED','LIQUIDITY_REJECTED_CONTROL'].includes(row.cohortRole)) r.push('D02_11_COHORT_ROLE_INVALID');
    if(!row.rejectionReason) r.push('D02_11_REJECTION_REASON_MISSING');
    if(row.reasonStratified!==true) r.push('D02_11_REASON_NOT_STRATIFIED');
    if(row.executionCostEvidenceKnown!==true) r.push('D02_11_EXECUTION_COST_EVIDENCE_UNKNOWN');
    if(row.spreadDepthEvidenceKnown!==true) r.push('D02_11_SPREAD_DEPTH_EVIDENCE_UNKNOWN');
    if(row.thresholdVersionFrozen!==true) r.push('D02_11_THRESHOLD_VERSION_NOT_FROZEN');
    if(row.thresholdSweepUsed===true) r.push('D02_11_THRESHOLD_SWEEP_FORBIDDEN');
  }

  if(m==='D02-12'){
    if(!['TIME_OF_DAY_VOLUME_CURVE','PRICE_BY_VOLUME_PROFILE'].includes(row.family)) r.push('D02_12_FAMILY_INVALID');
    if(row.sameSlotRvolControlPresent!==true) r.push('D02_12_SAME_SLOT_RVOL_CONTROL_MISSING');
    if(row.cumulativePaceControlPresent!==true) r.push('D02_12_CUMULATIVE_PACE_CONTROL_MISSING');
    if(row.priceLocationControlPresent!==true) r.push('D02_12_PRICE_LOCATION_CONTROL_MISSING');
    if(row.family==='TIME_OF_DAY_VOLUME_CURVE'){
      const sm=slotMinutes(row.slotKey);
      if(sm===null||sm<540||sm>780) r.push('D02_12_TIME_CURVE_OUTSIDE_09_00_13_00');
      if(row.fullSessionCompletenessClaim===true) r.push('D02_12_FULL_SESSION_CLAIM_FORBIDDEN');
    }
    if(row.family==='PRICE_BY_VOLUME_PROFILE'){
      if(row.prospectiveCapture!==true) r.push('D02_12_PRICE_PROFILE_NOT_PROSPECTIVE');
      if(row.historicalBackfillUsed===true) r.push('D02_12_HISTORICAL_PROFILE_BACKFILL_FORBIDDEN');
      if(row.closingAuctionCompletenessClaim===true && row.closingAuctionCoverageProven!==true) r.push('D02_12_CLOSING_AUCTION_CLAIM_UNPROVEN');
    }
  }

  return r.length?fail(r):pass();
}

export function evaluateWave2Outcome(row={},pre=evaluateWave2Row(row)){
  if(!pre.pass) return fail(pre.reasons);
  if(row.outcomeStatus==='CENSORED'||row.outcomeStatus==='UNKNOWN') return fail(['OUTCOME_CENSORED_OR_UNKNOWN']);
  if(row.outcomeStatus!=='COMPLETED') return fail(['OUTCOME_NOT_COMPLETED']);
  const start=isoMs(row.outcomeStartAt), known=isoMs(row.outcomeKnownAt), first=isoMs(row.featureFirstKnownAt);
  if([start,known,first].some(x=>x===null)) return fail(['OUTCOME_CLOCK_INVALID']);
  if(start<=first) return fail(['OUTCOME_NOT_STRICTLY_FUTURE']);
  if(known<start) return fail(['OUTCOME_KNOWN_BEFORE_START']);
  return pass();
}

export function evaluateWave2Dataset(rows=[]){
  const arr=Array.isArray(rows)?rows:[];
  const seen=new Map();
  const duplicateReasons=[];
  for(const row of arr){
    if(!row?.eventId) continue;
    if(seen.has(row.eventId)) duplicateReasons.push(seen.get(row.eventId)===row.scanDate?'DUPLICATE_EVENT_ID_SAME_DATE':'DUPLICATE_EVENT_ID_CROSS_DATE');
    else seen.set(row.eventId,row.scanDate);
  }
  const rowReceipts=arr.map(row=>{const pre=evaluateWave2Row(row);const outcome=evaluateWave2Outcome(row,pre);return {moduleId:row?.moduleId??null,family:row?.family??null,eventId:row?.eventId??null,scanDate:row?.scanDate??null,cohortRole:row?.cohortRole??null,rejectionReason:row?.rejectionReason??null,preOutcome:pre,outcome};});
  const fatalIntegrity=duplicateReasons.length>0;
  const byModule={};
  for(const moduleId of WAVE2_MODULES){
    const rs=rowReceipts.filter(x=>x.moduleId===moduleId);
    const pre=rs.filter(x=>x.preOutcome.pass);
    const completed=rs.filter(x=>x.outcome.pass);
    const dates=uniq(pre.map(x=>x.scanDate).filter(Boolean));
    const families=uniq(pre.map(x=>x.family).filter(Boolean));
    const s={moduleId,rowCount:rs.length,preOutcomeEligibleEvents:pre.length,completedEligibleEvents:completed.length,distinctCleanScanDates:dates.length,families,sourceAdmissionReady:!fatalIntegrity&&pre.length>0};
    if(moduleId==='D02-11'){
      const admitted=pre.filter(x=>x.cohortRole==='ADMITTED').length;
      const rejected=pre.filter(x=>x.cohortRole==='LIQUIDITY_REJECTED_CONTROL').length;
      const reasons=uniq(pre.filter(x=>x.cohortRole==='LIQUIDITY_REJECTED_CONTROL').map(x=>x.rejectionReason).filter(Boolean));
      s.admittedCount=admitted;s.reasonStratifiedRejectedControlCount=rejected;s.rejectionReasonStrata=reasons;
      s.counterfactualLaneReady=!fatalIntegrity&&admitted>0&&rejected>0&&reasons.length>0;
      s.sourceAdmissionReady=s.counterfactualLaneReady;
      if(!s.counterfactualLaneReady) s.blocker='D02_11_REASON_STRATIFIED_REJECTED_CONTROL_INCOMPLETE';
    }
    byModule[moduleId]=s;
  }
  return {schemaVersion:'0.1',admissionVersion:D02_L4_WAVE2_ADMISSION_VERSION,outcomeBlind:true,rowCount:arr.length,fatalIntegrity,datasetReasons:uniq(duplicateReasons),byModule,rowReceipts,maturityPromotionAuthorized:false,l4SampleAdequacyAuthorized:false,formalCoreChangeAuthorized:false};
}
