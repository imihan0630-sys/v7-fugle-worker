export const D03_PRE_PARENT_CLOCK_VERSION="D03_PRE_PARENT_CONTINUITY_CLOCK_V0_1";

const isoTime=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));
const isoDay=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x);

export function assessD03PreParentClockV0_1({
  parent,
  sourceCapture,
}={}){
  const reasons=[];
  if(!parent||typeof parent!=="object"||!isoDay(parent.scanDate)||!isoTime(parent.knownAt)){
    return {schemaVersion:D03_PRE_PARENT_CLOCK_VERSION,status:"DATA_BLOCKED",reasons:["PARENT_CLOCK_INVALID"],promotionClockEligible:false};
  }
  if(!sourceCapture||typeof sourceCapture!=="object"){
    return {schemaVersion:D03_PRE_PARENT_CLOCK_VERSION,status:"UNKNOWN",reasons:["SOURCE_CAPTURE_MISSING"],promotionClockEligible:false};
  }
  if(!isoDay(sourceCapture.marketDate)||sourceCapture.marketDate!==parent.scanDate) reasons.push("SOURCE_DATE_PARENT_DATE_MISMATCH");
  if(!isoTime(sourceCapture.capturedAt)) reasons.push("SOURCE_CAPTURE_CLOCK_INVALID");
  if(isoTime(sourceCapture.capturedAt)&&Date.parse(sourceCapture.capturedAt)>Date.parse(parent.knownAt)) reasons.push("SOURCE_CAPTURE_AFTER_PARENT");
  if(sourceCapture.continuityState!=="CERTIFIED") reasons.push("CONTINUITY_NOT_CERTIFIED");
  if(sourceCapture.exactVersionObserved!==true) reasons.push("EXACT_VERSION_NOT_OBSERVED");
  if(sourceCapture.firstObservedAtCertified!==true) reasons.push("FIRST_OBSERVED_CLOCK_NOT_CERTIFIED");
  if(sourceCapture.noRevisionGapThroughParent!==true) reasons.push("REVISION_GAP_THROUGH_PARENT_NOT_CLOSED");
  if(sourceCapture.symbolSessionCoverageComplete!==true) reasons.push("SYMBOL_SESSION_COVERAGE_INCOMPLETE");

  if(reasons.length){
    return {schemaVersion:D03_PRE_PARENT_CLOCK_VERSION,status:"DATA_BLOCKED",reasons:[...new Set(reasons)],promotionClockEligible:false,
      parentKnownAt:parent.knownAt,sourceCapturedAt:sourceCapture.capturedAt||null};
  }
  return {schemaVersion:D03_PRE_PARENT_CLOCK_VERSION,status:"VALID",reasons:[],promotionClockEligible:true,
    parentKnownAt:parent.knownAt,sourceCapturedAt:sourceCapture.capturedAt,clockLeadMs:Date.parse(parent.knownAt)-Date.parse(sourceCapture.capturedAt)};
}

export function auditCurrentD03ClockEnvelopeV0_1(){
  return {
    schemaVersion:"D03_CURRENT_CLOCK_ENVELOPE_AUDIT_V0_1",
    system1:{
      normalAfterMarketParent:"18:10_ASIA_TAIPEI",
      parentDecisionClock:"ACTUAL_RUNTIME_NEW_DATE",
      historyWarmupWindow:"17:00_17:59_ASIA_TAIPEI",
      historyWarmupContinuityAuthority:false,
    },
    existingScheduledResearchSources:[
      {
        name:"SYSTEM2_RECENT_A1_HOT_HISTORY_WARMUP",
        scheduled:"16:30_ASIA_TAIPEI",
        sourceClass:"RAW_A1_HISTORY_ONLY",
        continuityState:"UNVERIFIED",
        promotionClockEligible:false,
      },
      {
        name:"SYSTEM2_DAILY_SHADOW_DIAGNOSTIC",
        scheduled:"18:35_ASIA_TAIPEI",
        sourceClass:"DIAGNOSTIC",
        timingRelativeToParent:"AFTER_18_10_PARENT",
        promotionClockEligible:false,
      },
    ],
    continuityCapabilityWorkflows:{
      automaticPreParentScheduleObserved:false,
      triggerClasses:["WORKFLOW_DISPATCH","PUSH_PATH_CHANGE"],
      promotionClockEligible:false,
    },
    conclusion:"PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE_NOT_PRESENT",
    bollingerFirstParentReady:false,
    adxFirstParentReady:false,
    maturityImpact:false,
  };
}
