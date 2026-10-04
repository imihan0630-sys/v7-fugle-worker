import crypto from "node:crypto";

export const D03_PRE_PARENT_SOURCE_CUT_VERSION="D03_PRE_PARENT_SOURCE_CUT_V0_1";
const hash64=x=>typeof x==="string"&&/^[0-9a-f]{64}$/i.test(x);
const isoDay=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+"T00:00:00Z"));
const isoTime=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));
const nonempty=x=>typeof x==="string"&&x.trim().length>0;
const hash=v=>crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex");

export function evaluateD03PreParentSourceCutV0_1({cut,parent}={}){
  const reasons=[];
  if(!cut||typeof cut!=="object") return {schemaVersion:D03_PRE_PARENT_SOURCE_CUT_VERSION,status:"UNKNOWN",eligible:false,reasons:["CUT_MISSING"]};
  if(!parent||typeof parent!=="object") return {schemaVersion:D03_PRE_PARENT_SOURCE_CUT_VERSION,status:"UNKNOWN",eligible:false,reasons:["PARENT_MISSING"]};

  if(!isoDay(parent.scanDate)||!isoTime(parent.knownAt)||!nonempty(parent.captureGeneration)||!hash64(parent.parentSnapshotHash)) reasons.push("PARENT_IDENTITY_INVALID");
  if(cut.scanDate!==parent.scanDate) reasons.push("CUT_PARENT_DATE_MISMATCH");
  if(cut.scope!=="MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE") reasons.push("SELECTED_ONLY_SOURCE_CUT_FORBIDDEN");
  if(!isoTime(cut.cutCompletedAt)||Date.parse(cut.cutCompletedAt)>Date.parse(parent.knownAt)) reasons.push("SOURCE_CUT_AFTER_PARENT");

  const lanes=Array.isArray(cut.requiredMarketWideLanes)?cut.requiredMarketWideLanes:[];
  if(lanes.length!==8) reasons.push("REQUIRED_MARKET_WIDE_LANE_COUNT_MISMATCH");
  const ids=lanes.map(x=>x?.sourceId).filter(Boolean);
  if(new Set(ids).size!==lanes.length) reasons.push("DUPLICATE_SOURCE_LANE");
  for(const lane of lanes){
    if(!nonempty(lane?.sourceId)) reasons.push("SOURCE_ID_MISSING");
    if(lane?.state!=="READY") reasons.push("SOURCE_LANE_NOT_READY");
    if(!hash64(lane?.payloadHash)) reasons.push("SOURCE_PAYLOAD_HASH_INVALID");
    if(!isoTime(lane?.observedAt)||Date.parse(lane.observedAt)>Date.parse(parent.knownAt)) reasons.push("SOURCE_LANE_AFTER_PARENT");
    if(lane?.requiresRangeIdentity===true&&lane?.responseRangeVerified!==true) reasons.push("SOURCE_RANGE_UNVERIFIED");
    if(lane?.parserComplete!==true) reasons.push("SOURCE_PARSER_INCOMPLETE");
  }

  const expected=Array.isArray(cut.expectedMopsVersionKeys)?[...cut.expectedMopsVersionKeys].sort():[];
  const observed=Array.isArray(cut.mopsExactVersionObservations)?cut.mopsExactVersionObservations:[];
  const observedKeys=observed.map(x=>x?.versionKey).filter(Boolean).sort();
  if(expected.length!==new Set(expected).size) reasons.push("EXPECTED_MOPS_KEY_DUPLICATE");
  if(observedKeys.length!==new Set(observedKeys).size) reasons.push("OBSERVED_MOPS_KEY_DUPLICATE");
  if(JSON.stringify(expected)!==JSON.stringify(observedKeys)) reasons.push("MOPS_EXPECTED_OBSERVED_KEYSET_MISMATCH");
  for(const row of observed){
    if(row?.observationMode!=="PROSPECTIVE_POLL") reasons.push("MOPS_NOT_PROSPECTIVE");
    if(!isoTime(row?.firstObservedAt)||Date.parse(row.firstObservedAt)>Date.parse(parent.knownAt)) reasons.push("MOPS_FIRST_OBSERVED_AFTER_PARENT");
    if(!hash64(row?.payloadHash)) reasons.push("MOPS_PAYLOAD_HASH_INVALID");
  }

  if(cut.mopsCoverageComplete!==true) reasons.push("MOPS_KEYSET_COVERAGE_INCOMPLETE");
  if(cut.queryTruncated===true) reasons.push("SOURCE_QUERY_TRUNCATED");
  if(cut.budgetExceeded===true) reasons.push("SOURCE_BUDGET_EXCEEDED");
  if(cut.unknownRequiredLaneCount!==0) reasons.push("UNKNOWN_REQUIRED_LANES_PRESENT");
  if(cut.noRevisionGapThroughCut!==true) reasons.push("NO_REVISION_GAP_THROUGH_CUT_UNPROVEN");

  const uniqueReasons=[...new Set(reasons)];
  if(uniqueReasons.length) return {
    schemaVersion:D03_PRE_PARENT_SOURCE_CUT_VERSION,
    status:"DATA_BLOCKED",eligible:false,reasons:uniqueReasons,
    sourceCutId:cut.sourceCutId||null,
  };

  const identity={
    scanDate:cut.scanDate,
    cutCompletedAt:new Date(cut.cutCompletedAt).toISOString(),
    parentKnownAt:new Date(parent.knownAt).toISOString(),
    captureGeneration:parent.captureGeneration,
    parentSnapshotHash:parent.parentSnapshotHash,
    marketWideLaneHashes:lanes.map(x=>[x.sourceId,x.payloadHash]).sort(),
    mopsVersionKeys:observedKeys,
  };
  return {
    schemaVersion:D03_PRE_PARENT_SOURCE_CUT_VERSION,
    status:"VALID_SOURCE_CUT_FOR_PARENT",
    eligible:true,reasons:[],
    sourceCutId:cut.sourceCutId||hash(identity),
    parentSourceCutBindingPreviewId:hash(identity),
    precisionEligibleCount:observed.filter(x=>x.precisionEligible===true).length,
    prospectiveObservedCount:observed.length,
    highFrequencyPollingRequiredForParentEligibility:false,
  };
}
