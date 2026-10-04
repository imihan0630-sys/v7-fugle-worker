export const D03_MOPS_CLOCK_SEMANTICS_VERSION="D03_MOPS_SOURCE_CLOCK_SEMANTICS_V0_1";

const isoTime=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));

export function classifyMopsSourceClockV0_1({
  sourceReportedAt,
  firstObservedAt=null,
  parentKnownAt,
  sourceReportedClockSemantic="ISSUER_REPORTED_SPEAK_TIME",
  prospectiveObserverCertified=false,
}={}){
  const reasons=[];
  if(!isoTime(parentKnownAt)) return {schemaVersion:D03_MOPS_CLOCK_SEMANTICS_VERSION,status:"DATA_BLOCKED",reasons:["PARENT_KNOWN_AT_INVALID"],pitAvailableByParent:false};
  if(!isoTime(sourceReportedAt)) return {schemaVersion:D03_MOPS_CLOCK_SEMANTICS_VERSION,status:"UNKNOWN",reasons:["SOURCE_REPORTED_AT_INVALID"],pitAvailableByParent:false};
  if(sourceReportedClockSemantic!=="ISSUER_REPORTED_SPEAK_TIME") reasons.push("SOURCE_CLOCK_SEMANTIC_UNCERTIFIED");

  if(Date.parse(sourceReportedAt)>Date.parse(parentKnownAt)){
    return {
      schemaVersion:D03_MOPS_CLOCK_SEMANTICS_VERSION,
      status:"EXCLUDED",
      reasons:["SOURCE_REPORTED_AFTER_PARENT"],
      sourceReportedAt,
      parentKnownAt,
      pitAvailableByParent:false,
      historicalSourceReportedAtSufficient:false,
    };
  }

  if(prospectiveObserverCertified===true && isoTime(firstObservedAt)){
    if(Date.parse(firstObservedAt)<=Date.parse(parentKnownAt)){
      return {
        schemaVersion:D03_MOPS_CLOCK_SEMANTICS_VERSION,
        status:"VALID_OBSERVED_BY_PARENT",
        reasons,
        sourceReportedAt,
        firstObservedAt,
        parentKnownAt,
        pitAvailableByParent:true,
        historicalSourceReportedAtSufficient:false,
      };
    }
    return {
      schemaVersion:D03_MOPS_CLOCK_SEMANTICS_VERSION,
      status:"OBSERVED_AFTER_PARENT",
      reasons:["FIRST_OBSERVED_AFTER_PARENT",...reasons],
      sourceReportedAt,
      firstObservedAt,
      parentKnownAt,
      pitAvailableByParent:false,
      historicalSourceReportedAtSufficient:false,
    };
  }

  return {
    schemaVersion:D03_MOPS_CLOCK_SEMANTICS_VERSION,
    status:"HISTORICAL_REPORTED_CLOCK_ONLY",
    reasons:["EXACT_PUBLIC_AVAILABILITY_LATENCY_UNCERTIFIED",...reasons],
    sourceReportedAt,
    firstObservedAt:null,
    parentKnownAt,
    pitAvailableByParent:false,
    historicalSourceReportedAtSufficient:false,
    safeUse:"NOT_BEFORE_EXCLUSION_BOUND_ONLY",
  };
}
