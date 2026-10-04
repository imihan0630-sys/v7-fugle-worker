import { deepFreeze } from "./factor_snapshot.mjs";
import { officialContinuityRevisionRequiredLanesV0_1 } from "./official_continuity_revision_coverage_v0_1.mjs";

export const SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION = "0.1-RESEARCH";

function requiredText(value, field){
  if(typeof value!=="string" || !value.trim()) throw new Error(field+" is required");
  return value.trim();
}

function bool(value){ return value===true; }

function frozenRefs(refs=[]){
  if(!Array.isArray(refs)) throw new Error("evidenceRefs must be an array");
  return Object.freeze(refs.map((x)=>requiredText(x,"evidenceRefs[]")));
}

export function buildSupplementalRevisionProvenanceReceiptV0_1({
  startDate,
  endDate,
  generatedAt,
  evidenceRefs = [],
  finalResultLaneReadiness = {},
  mopsQueryIntegrity = {},
  sourceClockEvidence = {},
  authorityEvidence = {},
  representativeAuthorityLaneCoverage = {},
  boundedRevisionHistoryCoverageByLane = {},
} = {}) {
  const start=requiredText(startDate,"startDate");
  const end=requiredText(endDate,"endDate");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || end<start){
    throw new Error("invalid interval");
  }
  const at=requiredText(generatedAt,"generatedAt");
  if(!Number.isFinite(Date.parse(at))) throw new Error("generatedAt must be ISO");

  const queryIntegrityReady =
    bool(mopsQueryIntegrity.monthShardReconciliationVerified) &&
    bool(mopsQueryIntegrity.multiControlReconciliationVerified) &&
    bool(mopsQueryIntegrity.emptyMonthSemanticsCertified) &&
    bool(mopsQueryIntegrity.highRowStressVerified);

  const sourceReportedClockReady =
    bool(sourceClockEvidence.sourceReportedVersionClockSemanticsCertified);

  const publicAvailabilityReady =
    bool(sourceClockEvidence.publicAvailabilityLatencyCertified);

  const knownAtReady =
    bool(sourceClockEvidence.knownAtVersionClockCertified) &&
    bool(sourceClockEvidence.pitReplayUseAsAvailableAtAuthorized);

  const frozenAuthorityMatrixReady =
    bool(authorityEvidence.frozenAuthorityRoutingCoverageComplete);

  const authorityBoundedComplete =
    bool(authorityEvidence.authorityRevisionCoverageComplete);

  const lanes=officialContinuityRevisionRequiredLanesV0_1();
  const laneResults=Object.entries(lanes).map(([sourceId,contract])=>{
    const finalResultReady=bool(finalResultLaneReadiness[sourceId]);
    const representativeAuthorityObserved=
      bool(representativeAuthorityLaneCoverage[sourceId]);
    const boundedRevisionHistoryComplete=
      bool(boundedRevisionHistoryCoverageByLane[sourceId]);

    const blockers=[];
    if(!finalResultReady) blockers.push("FINAL_RESULT_RANGE_NOT_READY");
    if(!queryIntegrityReady) blockers.push("MOPS_QUERY_INTEGRITY_NOT_READY");
    if(!sourceReportedClockReady) blockers.push("SOURCE_REPORTED_CLOCK_NOT_CERTIFIED");
    if(!publicAvailabilityReady) blockers.push("PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED");
    if(!knownAtReady) blockers.push("KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED");
    if(!frozenAuthorityMatrixReady) blockers.push("FROZEN_AUTHORITY_ROUTING_MATRIX_NOT_READY");
    if(!representativeAuthorityObserved) blockers.push("LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED");
    if(!authorityBoundedComplete) blockers.push("AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE");
    if(!boundedRevisionHistoryComplete) blockers.push("BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE");

    return deepFreeze({
      sourceId,
      exchange:contract.exchange,
      actionFamilyId:contract.actionFamilyId,
      finalResultReady,
      queryIntegrityReady,
      sourceReportedClockReady,
      publicAvailabilityReady,
      knownAtReady,
      frozenAuthorityMatrixReady,
      representativeAuthorityObserved,
      authorityBoundedComplete,
      boundedRevisionHistoryComplete,
      blockers:Object.freeze(blockers),
      supplementalRevisionChannelComplete:blockers.length===0,
    });
  });

  const blockerCounts={};
  for(const lane of laneResults){
    for(const blocker of lane.blockers){
      blockerCounts[blocker]=(blockerCounts[blocker]||0)+1;
    }
  }

  const finalResultReadyCount=laneResults.filter((x)=>x.finalResultReady).length;
  const representativeAuthorityReadyCount=
    laneResults.filter((x)=>x.representativeAuthorityObserved).length;
  const supplementalRevisionReadyCount=
    laneResults.filter((x)=>x.supplementalRevisionChannelComplete).length;
  const revisionCoverageComplete=
    laneResults.length>0 &&
    supplementalRevisionReadyCount===laneResults.length;

  return deepFreeze({
    schemaVersion:"S2_SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_V0_1",
    version:SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION,
    interval:deepFreeze({startDate:start,endDate:end}),
    generatedAt:new Date(at).toISOString(),
    evidenceRefs:frozenRefs(evidenceRefs),
    requiredLaneCount:laneResults.length,
    finalResultReadyCount,
    representativeAuthorityReadyCount,
    supplementalRevisionReadyCount,
    laneResults:Object.freeze(laneResults),
    blockerCounts:deepFreeze(blockerCounts),

    queryIntegrityReady,
    sourceReportedClockReady,
    publicAvailabilityLatencyCertified:publicAvailabilityReady,
    knownAtVersionClockCertified:knownAtReady,
    frozenAuthorityRoutingCoverageComplete:frozenAuthorityMatrixReady,
    authorityRevisionCoverageComplete:authorityBoundedComplete,
    revisionCoverageComplete,

    // Independent completeness / authority firewalls.
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
