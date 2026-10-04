import { deepFreeze } from "./factor_snapshot.mjs";
import { officialContinuityRevisionRequiredLanesV0_1 } from "./official_continuity_revision_coverage_v0_1.mjs";

export const SUPPLEMENTAL_REVISION_BLOCKER_RECEIPT_VERSION = "0.1-RESEARCH";

const REPRESENTATIVE_CONTROLS = deepFreeze({
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL: [
    "DIVIDEND_CORRECTION_2467_2026_05",
  ],
  TWSE_CAPITAL_REDUCTION_REFERENCE: [
    "CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",
  ],
  TWSE_PAR_VALUE_CHANGE_REFERENCE: [],
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL: [],
  TPEX_CAPITAL_REDUCTION_REFERENCE: [],
  TPEX_PAR_VALUE_CHANGE_REFERENCE: [],
});

function text(value){ return value == null ? "" : String(value).trim(); }
function bool(value){ return value === true; }

function passedControlIds(matrix){
  const rows=Array.isArray(matrix?.controls) ? matrix.controls : [];
  return new Set(rows.filter((x)=>x?.pass===true).map((x)=>text(x.controlId)).filter(Boolean));
}

function sourceAssessmentMap(rows){
  const map=new Map();
  for(const row of Array.isArray(rows)?rows:[]){
    const id=text(row?.sourceId);
    if(id) map.set(id,row);
  }
  return map;
}

function laneFlag(map, sourceId){
  return map && typeof map==="object" && map[sourceId]===true;
}

export function buildSupplementalRevisionBlockerReceiptV0_1({
  sourceAssessments = [],
  mopsMatrix,
  sourceClockSummary,
  authorityMatrix,
  prospectiveAvailabilitySummary,
  boundedSupplementalCoverageByLane = {},
  cancellationHistoryCompleteByLane = {},
  generatedAt = new Date().toISOString(),
} = {}) {
  if(!mopsMatrix || typeof mopsMatrix!=="object") throw new Error("mopsMatrix is required");
  if(!sourceClockSummary || typeof sourceClockSummary!=="object") throw new Error("sourceClockSummary is required");
  if(!authorityMatrix || typeof authorityMatrix!=="object") throw new Error("authorityMatrix is required");
  if(!prospectiveAvailabilitySummary || typeof prospectiveAvailabilitySummary!=="object") {
    throw new Error("prospectiveAvailabilitySummary is required");
  }
  if(!Number.isFinite(Date.parse(generatedAt))) throw new Error("generatedAt must be ISO");

  const required=officialContinuityRevisionRequiredLanesV0_1();
  const assessments=sourceAssessmentMap(sourceAssessments);
  const mopsPassed=passedControlIds(mopsMatrix);
  const authorityPassed=passedControlIds(authorityMatrix);

  const sourceClockCertified=bool(sourceClockSummary.sourceReportedVersionClockSemanticsCertified);
  const publicAvailabilityCertified=bool(prospectiveAvailabilitySummary.publicAvailabilityLatencyCertified);
  const knownAtCertified=bool(sourceClockSummary.knownAtVersionClockCertified) &&
    bool(prospectiveAvailabilitySummary.knownAtVersionClockCertified);

  const lanes=Object.entries(required).map(([sourceId,contract])=>{
    const assessment=assessments.get(sourceId)||null;
    const controls=REPRESENTATIVE_CONTROLS[sourceId]||[];
    const issuerRepresentativeObserved=
      controls.length>0 && controls.every((id)=>mopsPassed.has(id));
    const authorityRepresentativeObserved=
      controls.length>0 && controls.every((id)=>authorityPassed.has(id));
    const boundedSupplementalHistoryComplete=laneFlag(boundedSupplementalCoverageByLane,sourceId);
    const cancellationHistoryComplete=laneFlag(cancellationHistoryCompleteByLane,sourceId);
    const finalResultRangeReady=assessment?.finalResultRangeReady===true;

    const blockers=[];
    if(!finalResultRangeReady) blockers.push("FINAL_RESULT_RANGE_NOT_READY");
    if(!issuerRepresentativeObserved) blockers.push("REPRESENTATIVE_ISSUER_REVISION_CONTROL_NOT_OBSERVED");
    if(!authorityRepresentativeObserved) blockers.push("REPRESENTATIVE_AUTHORITY_ROUTE_NOT_OBSERVED");
    if(!sourceClockCertified) blockers.push("SOURCE_REPORTED_CLOCK_SEMANTICS_NOT_CERTIFIED");
    if(!publicAvailabilityCertified) blockers.push("PROSPECTIVE_PUBLIC_AVAILABILITY_NOT_CERTIFIED");
    if(!knownAtCertified) blockers.push("KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED");
    if(!boundedSupplementalHistoryComplete) blockers.push("BOUNDED_SUPPLEMENTAL_REVISION_HISTORY_NOT_PROVEN");
    if(!cancellationHistoryComplete) blockers.push("CANCELLATION_HISTORY_NOT_COMPLETE");

    return deepFreeze({
      sourceId,
      exchange:contract.exchange,
      actionFamilyId:contract.actionFamilyId,
      representativeControlIds:Object.freeze([...controls]),
      finalResultRangeReady,
      issuerRepresentativeObserved,
      authorityRepresentativeObserved,
      sourceReportedClockSemanticsCertified:sourceClockCertified,
      publicAvailabilityLatencyCertified:publicAvailabilityCertified,
      knownAtVersionClockCertified:knownAtCertified,
      boundedSupplementalHistoryComplete,
      cancellationHistoryComplete,
      blockers:Object.freeze(blockers),
      supplementalRevisionLaneComplete:blockers.length===0,
    });
  });

  const blockerCounts={};
  for(const lane of lanes){
    for(const blocker of lane.blockers){
      blockerCounts[blocker]=(blockerCounts[blocker]||0)+1;
    }
  }

  const finalResultReadyCount=lanes.filter((x)=>x.finalResultRangeReady).length;
  const representativeIssuerReadyCount=lanes.filter((x)=>x.issuerRepresentativeObserved).length;
  const representativeAuthorityReadyCount=lanes.filter((x)=>x.authorityRepresentativeObserved).length;
  const supplementalRevisionReadyCount=lanes.filter((x)=>x.supplementalRevisionLaneComplete).length;
  const revisionCoverageComplete=lanes.length>0 && supplementalRevisionReadyCount===lanes.length;

  return deepFreeze({
    schemaVersion:"S2_SUPPLEMENTAL_REVISION_BLOCKER_RECEIPT_V0_1",
    version:SUPPLEMENTAL_REVISION_BLOCKER_RECEIPT_VERSION,
    generatedAt:new Date(generatedAt).toISOString(),
    requiredLaneCount:lanes.length,
    finalResultReadyCount,
    representativeIssuerReadyCount,
    representativeAuthorityReadyCount,
    sourceReportedVersionClockSemanticsCertified:sourceClockCertified,
    publicAvailabilityLatencyCertified:publicAvailabilityCertified,
    knownAtVersionClockCertified:knownAtCertified,
    supplementalRevisionReadyCount,
    blockerCounts:deepFreeze(blockerCounts),
    lanes:Object.freeze(lanes),
    revisionCoverageComplete,

    // Independent downstream gates remain locked.
    noEventMayBeClaimed:false,
    suspensionCoverageComplete:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    historyMutationPerformed:false,
    strategyEvaluationPerformed:false,
    capacityRunProduced:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}

export function supplementalRevisionRepresentativeControlsV0_1(){
  return REPRESENTATIVE_CONTROLS;
}
