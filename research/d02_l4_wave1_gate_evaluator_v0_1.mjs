const finite = v => Number.isFinite(Number(v));
const isoMs = v => Number.isFinite(Date.parse(v)) ? Date.parse(v) : null;

function slotMinutes(v){
  const m=String(v??'').match(/^(\d{2}):(\d{2})$/);
  return m ? Number(m[1])*60+Number(m[2]) : null;
}
function uniq(xs){ return [...new Set(xs)]; }
function fail(reasons=[]){ return {pass:false,reasons:[...new Set(reasons)]}; }
function pass(extra={}){ return {pass:true,reasons:[],...extra}; }

export const D02_L4_WAVE1_GATE_VERSION='D02_L4_WAVE1_GATE_V0_1_1';
export const DESCRIPTIVE_CLEAN_DATES=20;
export const L4_MIN_CLEAN_DATES=30;
export const L4_MIN_COMPLETED_EVENTS=100;
export const WAVE1_HYPOTHESES=['H001','H20','H003'];

export function evaluateWave1Row(row={}){
  const reasons=[];
  const h=String(row.hypothesis||'');
  if(!WAVE1_HYPOTHESES.includes(h)) reasons.push('UNSUPPORTED_HYPOTHESIS');
  if(!row.scanDate) reasons.push('MISSING_SCAN_DATE');
  if(!row.eventId) reasons.push('MISSING_EVENT_ID');
  if(row.gate0to6Pass!==true) reasons.push('GATE_0_6_NOT_PASS');
  if(row.dataQaPass!==true) reasons.push('DATA_QA_NOT_PASS');
  if(row.cleanCohortProvenance!==true) reasons.push('COHORT_PROVENANCE_NOT_CLEAN');
  if(row.generationAligned!==true) reasons.push('GENERATION_NOT_ALIGNED');
  if(row.formalIsolationPass!==true) reasons.push('FORMAL_ISOLATION_NOT_PASS');
  if(row.sourceContinuityPass!==true) reasons.push('SOURCE_CONTINUITY_NOT_PASS');
  if(row.commonSupportPass!==true) reasons.push('COMMON_SUPPORT_NOT_PASS');
  if(row.cleanScanDate!==true) reasons.push('SCAN_DATE_NOT_CLEAN');

  if(h==='H001'){
    const sm=slotMinutes(row.slotKey);
    if(sm===null || sm<615) reasons.push('H001_SLOT_BEFORE_10_15_OR_INVALID');
    if(!finite(row.formalLocalVolumeRatio)) reasons.push('H001_FORMAL_LOCAL_RATIO_INVALID');
    if(!finite(row.pvSlotRvol20)) reasons.push('H001_SLOT_RVOL_INVALID');
    if(Number(row.slotHistoryCount)<20) reasons.push('H001_SLOT_HISTORY_LT_20');
    if(row.sameSlotBaselineClean!==true) reasons.push('H001_BASELINE_NOT_CLEAN');
    if(row.currentSlotCoverageValid!==true) reasons.push('H001_CURRENT_SLOT_COVERAGE_INVALID');
    if(row.identicalOutcomeAvailabilityBC!==true) reasons.push('H001_BC_OUTCOME_SUPPORT_MISMATCH');
  }

  if(h==='H20'){
    if(row.primitiveEventOwner!=='D01-05') reasons.push('H20_PRIMITIVE_OWNER_INVALID');
    if(typeof row.eventId==='string' && !row.eventId.startsWith('H20_BREAKOUT:')) reasons.push('H20_EVENT_KEY_INVALID');
    if(row.primitiveEventId!==row.comparatorPrimitiveEventId) reasons.push('H20_PRIMITIVE_EVENT_ID_MISMATCH');
    if(row.anchorBarStart!==row.comparatorAnchorBarStart) reasons.push('H20_ANCHOR_MISMATCH');
    if(row.outcomeHorizon!==row.comparatorOutcomeHorizon) reasons.push('H20_OUTCOME_HORIZON_MISMATCH');
    const parts=String(row.eventId||'').split(':');
    if(parts.length>=2 && row.scanDate && parts[1]!==row.scanDate) reasons.push('H20_EVENT_DATE_MISMATCH');
  }

  if(h==='H003'){
    if(row.sameFeatureBarForPAndPV!==true) reasons.push('H003_P_PV_FEATURE_BAR_MISMATCH');
    if(row.h003HypothesisCleanEvent!==true) reasons.push('H003_NOT_HYPOTHESIS_CLEAN_EVENT');
    if(row.preEventOnlyExpiry===true) reasons.push('H003_PRE_EVENT_ONLY_EXPIRY_QA_ONLY');
  }

  return reasons.length ? fail(reasons) : pass();
}

export function evaluateOutcomeEligibility(row={},precheck=evaluateWave1Row(row)){
  if(!precheck.pass) return fail(precheck.reasons);
  if(row.outcomeStatus==='CENSORED' || row.outcomeStatus==='UNKNOWN') return fail(['OUTCOME_CENSORED_OR_UNKNOWN']);
  if(row.outcomeStatus!=='COMPLETED') return fail(['OUTCOME_NOT_COMPLETED']);
  const start=isoMs(row.outcomeStartAt);
  const known=isoMs(row.outcomeKnownAt);
  const feature=isoMs(row.featureFirstKnownAt ?? row.featureBarEnd);
  const barEnd=isoMs(row.featureBarEnd ?? row.featureFirstKnownAt);
  if(start===null || known===null || feature===null || barEnd===null) return fail(['OUTCOME_CLOCK_INVALID']);
  const strictBase=Math.max(feature,barEnd);
  if(start<=strictBase) return fail(['OUTCOME_NOT_STRICTLY_FUTURE']);
  if(known<start) return fail(['OUTCOME_KNOWN_BEFORE_START']);
  return pass();
}

export function evaluateWave1Dataset(rows=[], opts={}){
  const arr=Array.isArray(rows)?rows:[];
  const duplicateReasons=[];
  const eventSeen=new Map();
  for(const row of arr){
    if(!row?.eventId) continue;
    if(eventSeen.has(row.eventId)){
      const prior=eventSeen.get(row.eventId);
      duplicateReasons.push(prior===row.scanDate?'DUPLICATE_EVENT_ID_SAME_DATE':'DUPLICATE_EVENT_ID_CROSS_DATE');
    } else eventSeen.set(row.eventId,row.scanDate);
  }

  const rowReceipts=arr.map(row=>{
    const pre=evaluateWave1Row(row);
    const out=evaluateOutcomeEligibility(row,pre);
    return {eventId:row?.eventId??null,scanDate:row?.scanDate??null,hypothesis:row?.hypothesis??null,preOutcome:pre,outcome:out};
  });

  const fatalIntegrity=duplicateReasons.length>0;
  const summarizeHypothesis=(hypothesis)=>{
    const rows=rowReceipts.filter(x=>x.hypothesis===hypothesis);
    const preRows=rows.filter(x=>x.preOutcome.pass);
    const completedRows=rows.filter(x=>x.outcome.pass);
    const cleanDates=uniq(preRows.map(x=>x.scanDate).filter(Boolean));
    let outcomeAccessState='OUTCOME_ACCESS_CLOSED';
    if(!fatalIntegrity && cleanDates.length>=DESCRIPTIVE_CLEAN_DATES) outcomeAccessState='DESCRIPTIVE_ONLY';
    if(!fatalIntegrity && cleanDates.length>=L4_MIN_CLEAN_DATES && completedRows.length>=L4_MIN_COMPLETED_EVENTS) outcomeAccessState='L4_EVIDENCE_ELIGIBLE';
    const review=opts?.reviewByHypothesis?.[hypothesis]||{};
    const promotionReviewEligible=outcomeAccessState==='L4_EVIDENCE_ELIGIBLE' &&
      review.prospectiveOrOosEvidencePresent===true &&
      review.d16DependenceAwareMethodPass===true &&
      review.negativeControlsReported===true &&
      review.redundancyChecksReported===true &&
      review.concentrationPass===true;
    return {
      hypothesis,
      rowCount:rows.length,
      preOutcomeEligibleEvents:preRows.length,
      completedEligibleEvents:completedRows.length,
      distinctCleanScanDates:cleanDates.length,
      descriptiveReady:!fatalIntegrity && cleanDates.length>=DESCRIPTIVE_CLEAN_DATES,
      l4EvidenceEligible:outcomeAccessState==='L4_EVIDENCE_ELIGIBLE',
      promotionReviewEligible,
      outcomeAccessState,
      maturityPromotionAuthorized:false
    };
  };
  const byHypothesis=Object.fromEntries(WAVE1_HYPOTHESES.map(h=>[h,summarizeHypothesis(h)]));
  const eligibleHypotheses=WAVE1_HYPOTHESES.filter(h=>byHypothesis[h].l4EvidenceEligible);
  const descriptiveHypotheses=WAVE1_HYPOTHESES.filter(h=>byHypothesis[h].descriptiveReady);
  const reviewEligibleHypotheses=WAVE1_HYPOTHESES.filter(h=>byHypothesis[h].promotionReviewEligible);

  let programState='OUTCOME_ACCESS_CLOSED';
  if(!fatalIntegrity && descriptiveHypotheses.length>0) programState='DESCRIPTIVE_ONLY_PARTIAL';
  if(!fatalIntegrity && eligibleHypotheses.length>0) programState='L4_EVIDENCE_ELIGIBLE_PARTIAL';
  if(!fatalIntegrity && eligibleHypotheses.length===WAVE1_HYPOTHESES.length) programState='L4_EVIDENCE_ELIGIBLE_ALL_WAVE1';

  return {
    schemaVersion:'0.1.1',
    gateVersion:D02_L4_WAVE1_GATE_VERSION,
    outcomeBlind:true,
    rowCount:arr.length,
    programState,
    byHypothesis,
    descriptiveHypotheses,
    eligibleHypotheses,
    reviewEligibleHypotheses,
    allWave1L4EvidenceEligible:eligibleHypotheses.length===WAVE1_HYPOTHESES.length,
    anyHypothesisL4EvidenceEligible:eligibleHypotheses.length>0,
    fatalIntegrity,
    datasetReasons:[...new Set(duplicateReasons)],
    rowReceipts,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false,
    crossHypothesisSampleBorrowingAllowed:false
  };
}
