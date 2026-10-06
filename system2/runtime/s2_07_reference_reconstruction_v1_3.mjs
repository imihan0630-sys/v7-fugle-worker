import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_REFERENCE_RECONSTRUCTION_VERSION = "1.3-RESEARCH";

function requiredText(value,field){
  if(typeof value!=="string"||!value.trim())throw new Error(field+" is required");
  return value.trim();
}
function positive(value,field){
  const n=Number(value);
  if(!Number.isFinite(n)||n<=0)throw new Error(field+" must be positive");
  return n;
}
function isoTimestamp(value,field){
  const text=requiredText(value,field);
  if(!Number.isFinite(Date.parse(text)))throw new Error(field+" must be ISO timestamp");
  return new Date(text).toISOString();
}
function round2(value){return Math.round((Number(value)+Number.EPSILON)*100)/100;}

export function evaluateReferencePriceReconstructionV1_3({
  symbol,
  family,
  resumeOpenCutoffAt,
  preActionClose,
  preCloseAvailableAt,
  preClosePitAvailabilityClass,
  preClosePitReplayEligible=false,
  approvedNewSharesPer1000,
  approvedRatioSourceReportedAt,
  ratioSourceVersionKey,
  ratioSourcePayloadHash,
  ratioPublicAvailabilityCertified=false,
  officialReferencePrice,
}={}){
  const code=requiredText(symbol,"symbol");
  const fam=requiredText(family,"family");
  if(fam!=="CAPITAL_REDUCTION")throw new Error("V1.3 supports CAPITAL_REDUCTION only");
  const cutoff=isoTimestamp(resumeOpenCutoffAt,"resumeOpenCutoffAt");
  const close=positive(preActionClose,"preActionClose");
  const closeAvailable=isoTimestamp(preCloseAvailableAt,"preCloseAvailableAt");
  const newShares=positive(approvedNewSharesPer1000,"approvedNewSharesPer1000");
  const ratioClock=isoTimestamp(approvedRatioSourceReportedAt,"approvedRatioSourceReportedAt");
  const official=positive(officialReferencePrice,"officialReferencePrice");
  const factor=newShares/1000;
  if(!(factor>0&&factor<1))throw new Error("approvedNewSharesPer1000 must imply a reduction factor between 0 and 1");
  const rawReconstruction=close/factor;
  const reconstructedReferencePrice=round2(rawReconstruction);
  const geometryMatchesOfficial=Math.abs(reconstructedReferencePrice-official)<1e-9;
  const ratioSourceReportedBeforeCutoff=Date.parse(ratioClock)<=Date.parse(cutoff);
  const preCloseObservedBeforeCutoff=Date.parse(closeAvailable)<=Date.parse(cutoff);
  const blockers=[];
  if(!geometryMatchesOfficial)blockers.push("REFERENCE_RECONSTRUCTION_DOES_NOT_MATCH_OFFICIAL");
  if(!ratioSourceReportedBeforeCutoff)blockers.push("APPROVED_RATIO_SOURCE_REPORTED_AFTER_RESUME_CUTOFF");
  if(ratioPublicAvailabilityCertified!==true)blockers.push("APPROVED_RATIO_PUBLIC_AVAILABILITY_NOT_CERTIFIED");
  if(!preClosePitReplayEligible)blockers.push("PRE_ACTION_CLOSE_PIT_REPLAY_NOT_ELIGIBLE");
  if(!preCloseObservedBeforeCutoff)blockers.push("PRE_ACTION_CLOSE_AVAILABLE_AFTER_RESUME_CUTOFF");
  if(requiredText(preClosePitAvailabilityClass,"preClosePitAvailabilityClass")==="UNKNOWN"){
    blockers.push("PRE_ACTION_CLOSE_AVAILABILITY_CLASS_UNKNOWN");
  }

  const mechanicallyProven=geometryMatchesOfficial&&ratioSourceReportedBeforeCutoff;
  const pitInputClocksReady=
    ratioPublicAvailabilityCertified===true&&
    preClosePitReplayEligible===true&&
    preCloseObservedBeforeCutoff;
  const state=mechanicallyProven
    ? pitInputClocksReady
      ? "REFERENCE_RECONSTRUCTION_CLOCK_CANDIDATE_REVIEW_REQUIRED"
      : "REFERENCE_RECONSTRUCTION_MECHANICALLY_PROVEN_PIT_BLOCKED"
    : "REFERENCE_RECONSTRUCTION_NOT_PROVEN";

  return deepFreeze({
    schemaVersion:"S2_S2_07_REFERENCE_RECONSTRUCTION_V1_3",
    version:S2_07_REFERENCE_RECONSTRUCTION_VERSION,
    symbol:code,
    family:fam,
    resumeOpenCutoffAt:cutoff,
    inputs:{
      preActionClose:close,
      preCloseAvailableAt:closeAvailable,
      preClosePitAvailabilityClass:requiredText(preClosePitAvailabilityClass,"preClosePitAvailabilityClass"),
      preClosePitReplayEligible:preClosePitReplayEligible===true,
      approvedNewSharesPer1000:newShares,
      approvedShareFactor:factor,
      approvedRatioSourceReportedAt:ratioClock,
      ratioSourceVersionKey:requiredText(ratioSourceVersionKey,"ratioSourceVersionKey"),
      ratioSourcePayloadHash:requiredText(ratioSourcePayloadHash,"ratioSourcePayloadHash"),
      ratioPublicAvailabilityCertified:ratioPublicAvailabilityCertified===true,
      officialReferencePrice:official,
    },
    reconstruction:{
      rawReferencePrice:rawReconstruction,
      reconstructedReferencePrice,
      roundingMode:"DECIMAL_2_NEAREST",
      geometryMatchesOfficial,
      mechanicallyProven,
    },
    clocks:{
      ratioSourceReportedBeforeCutoff,
      preCloseObservedBeforeCutoff,
      pitInputClocksReady,
    },
    state,
    blockers:deepFreeze([...new Set(blockers)]),
    historicalAvailabilityProven:false,
    knownAtVersionClockCertified:false,
    verifiedSourceTimestampPromoted:false,
    firstKnownAt:null,
    availableAt:null,
    pitEventReplayEligible:false,
    pitTechnicalContinuityReplayEligible:false,
    technicalContinuityCertified:false,
    continuityTransformPerformed:false,
    historyMutationPerformed:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
