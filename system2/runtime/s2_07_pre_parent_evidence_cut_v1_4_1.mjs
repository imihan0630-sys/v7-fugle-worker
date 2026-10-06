import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_PRE_PARENT_EVIDENCE_CUT_VERSION_V1_4_1 = "1.4.1-RESEARCH";
const ALLOWED_SCOPES = new Set(["MARKET_WIDE", "EXCHANGE_WIDE", "FULL_ELIGIBLE_UNIVERSE"]);

const text=v=>v==null?"":String(v).trim();
const hash64=v=>/^[0-9a-f]{64}$/i.test(text(v));
function isoTimestamp(v,field){const s=text(v);if(!s||!Number.isFinite(Date.parse(s)))throw new Error(field+" must be ISO timestamp");return new Date(s).toISOString();}
function isoDate(v,field){const s=text(v);if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(Date.parse(s+"T00:00:00Z")))throw new Error(field+" must be YYYY-MM-DD");return s;}
const uniqSorted=xs=>[...new Set(xs.map(text).filter(Boolean))].sort();
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

function normalizeSourceLane(lane,cutoff){
  if(!lane||typeof lane!=="object"||Array.isArray(lane)) return null;
  const observedAt=text(lane.observedAt);
  const rangeRequired=lane.requiresRangeIdentity===true;
  const eligible=Boolean(text(lane.sourceId))
    && lane.state==="READY"
    && hash64(lane.payloadHash)
    && observedAt && Number.isFinite(Date.parse(observedAt)) && Date.parse(observedAt)<=Date.parse(cutoff)
    && lane.parserComplete===true
    && lane.queryComplete===true
    && lane.queryTruncated!==true
    && (!rangeRequired || lane.responseRangeVerified===true);
  return deepFreeze({
    sourceId:text(lane.sourceId)||null,
    state:text(lane.state)||null,
    payloadHash:text(lane.payloadHash)||null,
    observedAt:observedAt?new Date(observedAt).toISOString():null,
    requiresRangeIdentity:rangeRequired,
    responseRangeVerified:lane.responseRangeVerified===true,
    parserComplete:lane.parserComplete===true,
    queryComplete:lane.queryComplete===true,
    queryTruncated:lane.queryTruncated===true,
    eligible,
  });
}

function normalizeMopsVersion(obs,cutoff){
  if(!obs||typeof obs!=="object"||Array.isArray(obs))return null;
  const firstObservedAt=text(obs.firstObservedAt??obs.firstObservedAvailableAt);
  const versionKey=text(obs.versionKey);
  const versionPayloadHash=text(obs.versionPayloadHash??obs.payloadHash);
  const sourceReportedAt=text(obs.sourceReportedAt);
  const eligible=obs.observationMode==="PROSPECTIVE_POLL"
    && obs.sourceReportedClockEligible===true
    && Boolean(versionKey)
    && hash64(versionPayloadHash)
    && firstObservedAt && Number.isFinite(Date.parse(firstObservedAt)) && Date.parse(firstObservedAt)<=Date.parse(cutoff)
    && sourceReportedAt && Number.isFinite(Date.parse(sourceReportedAt));
  return deepFreeze({
    versionKey:versionKey||null,
    versionPayloadHash:versionPayloadHash||null,
    sourceReportedAt:sourceReportedAt?new Date(sourceReportedAt).toISOString():null,
    firstObservedAt:firstObservedAt?new Date(firstObservedAt).toISOString():null,
    controlId:text(obs.controlId)||null,
    eligible,
  });
}

function normalizeReferenceObservation(obs,cutoff){
  if(!obs||typeof obs!=="object"||Array.isArray(obs))return null;
  const availableAt=text(obs.availableAt??obs.firstObservedAt);
  const eligible=obs.observationMode==="PROSPECTIVE_POLL"
    && obs.evidenceClass==="PROSPECTIVE_EXACT_VERSION_OBSERVER"
    && obs.exactVersionIdentity===true
    && obs.publicAvailabilityObserved===true
    && hash64(obs.stableReferenceKey)
    && hash64(obs.referenceSourceRowHash)
    && availableAt && Number.isFinite(Date.parse(availableAt)) && Date.parse(availableAt)<=Date.parse(cutoff);
  return deepFreeze({
    stableReferenceKey:text(obs.stableReferenceKey)||null,
    sourceRowHash:text(obs.referenceSourceRowHash)||null,
    availableAt:availableAt?new Date(availableAt).toISOString():null,
    sourceId:text(obs.sourceId)||null,
    eligible,
  });
}

export async function buildPreParentEvidenceCutManifestV1_4_1({
  scanDate,
  evidenceCutoffAt,
  scopeClass,
  requiredMarkets=[],
  coveredMarkets=[],
  requiredSourceLanes=[],
  expectedMopsVersionKeys=[],
  expectedMopsKeysetComplete=false,
  mopsVersionObservations=[],
  referenceAvailabilityObservations=[],
  queryTruncated=false,
  budgetExceeded=false,
  selectedOnly=false,
}={}){
  const date=isoDate(scanDate,"scanDate");
  const cutoff=isoTimestamp(evidenceCutoffAt,"evidenceCutoffAt");
  const scope=text(scopeClass).toUpperCase();
  const required=uniqSorted(requiredMarkets.map(x=>text(x).toUpperCase()));
  const covered=uniqSorted(coveredMarkets.map(x=>text(x).toUpperCase()));
  const blockers=[];
  if(!ALLOWED_SCOPES.has(scope))blockers.push("EVIDENCE_CUT_SCOPE_INVALID");
  if(selectedOnly===true)blockers.push("SELECTED_ONLY_CAPTURE_FORBIDDEN");
  if(required.length===0)blockers.push("REQUIRED_MARKET_SCOPE_EMPTY");
  if(!same(required,covered))blockers.push("MARKET_SCOPE_COVERAGE_MISMATCH");
  if(queryTruncated===true)blockers.push("EVIDENCE_CUT_QUERY_TRUNCATED");
  if(budgetExceeded===true)blockers.push("EVIDENCE_CUT_BUDGET_EXCEEDED");

  const lanes=requiredSourceLanes.map(x=>normalizeSourceLane(x,cutoff)).filter(Boolean);
  if(lanes.length!==8)blockers.push("REQUIRED_MARKET_WIDE_LANE_COUNT_MISMATCH");
  const laneIds=lanes.map(x=>x.sourceId).filter(Boolean);
  if(new Set(laneIds).size!==lanes.length)blockers.push("DUPLICATE_SOURCE_LANE");
  const unknownRequiredLaneCount=lanes.filter(x=>x.eligible!==true).length;
  if(unknownRequiredLaneCount)blockers.push("EVIDENCE_CUT_UNKNOWN_REQUIRED_LANES");

  if(expectedMopsKeysetComplete!==true)blockers.push("EXPECTED_MOPS_KEYSET_NOT_CERTIFIED_COMPLETE");
  const expected=expectedMopsVersionKeys.map(text).filter(Boolean).sort();
  const mops=mopsVersionObservations.map(x=>normalizeMopsVersion(x,cutoff)).filter(Boolean);
  const mopsIneligibleCount=mops.filter(x=>x.eligible!==true).length;
  if(mopsIneligibleCount)blockers.push("MOPS_EXACT_VERSION_OBSERVATION_INELIGIBLE_AT_CUTOFF");
  const observed=mops.map(x=>x.versionKey).filter(Boolean).sort();
  if(expected.length!==new Set(expected).size)blockers.push("EXPECTED_MOPS_VERSION_KEY_DUPLICATE");
  if(observed.length!==new Set(observed).size)blockers.push("OBSERVED_MOPS_VERSION_KEY_DUPLICATE");
  if(!same(expected,observed))blockers.push("MOPS_VERSION_KEYSET_MISMATCH");
  if(expectedMopsKeysetComplete===true && expected.length===0)blockers.push("MOPS_EXACT_VERSION_POPULATION_EMPTY_UNCERTIFIED");

  const refs=referenceAvailabilityObservations.map(x=>normalizeReferenceObservation(x,cutoff)).filter(Boolean);
  const referenceIneligibleCount=refs.filter(x=>x.eligible!==true).length;
  if(referenceIneligibleCount)blockers.push("REFERENCE_OBSERVATION_INELIGIBLE_AT_CUTOFF");

  const uniqueBlockers=[...new Set(blockers)];
  const identity={
    version:S2_07_PRE_PARENT_EVIDENCE_CUT_VERSION_V1_4_1,
    scanDate:date,evidenceCutoffAt:cutoff,scopeClass:scope||null,
    requiredMarkets:required,coveredMarkets:covered,
    requiredSourceLanes:lanes.map(x=>({sourceId:x.sourceId,payloadHash:x.payloadHash,observedAt:x.observedAt,requiresRangeIdentity:x.requiresRangeIdentity,responseRangeVerified:x.responseRangeVerified,parserComplete:x.parserComplete})).sort((a,b)=>String(a.sourceId).localeCompare(String(b.sourceId))),
    expectedMopsVersionKeys:expected,
    mopsObservedVersions:mops.map(x=>({versionKey:x.versionKey,versionPayloadHash:x.versionPayloadHash,sourceReportedAt:x.sourceReportedAt,firstObservedAt:x.firstObservedAt,controlId:x.controlId})).sort((a,b)=>String(a.versionKey).localeCompare(String(b.versionKey))),
    referenceAvailabilityObservations:refs.map(x=>({stableReferenceKey:x.stableReferenceKey,sourceRowHash:x.sourceRowHash,availableAt:x.availableAt,sourceId:x.sourceId})).sort((a,b)=>String(a.stableReferenceKey).localeCompare(String(b.stableReferenceKey))),
  };
  const sourceCutManifestHash=await sha256Hex(identity);
  const evidenceCutId="S2-ECUT:"+await sha256Hex({sourceCutManifestHash,evidenceCutoffAt:cutoff});
  const preCutManifestReady=uniqueBlockers.length===0;
  return deepFreeze({
    schemaVersion:"S2_S2_07_PRE_PARENT_EVIDENCE_CUT_MANIFEST_V1_4_1",
    version:S2_07_PRE_PARENT_EVIDENCE_CUT_VERSION_V1_4_1,
    state:preCutManifestReady?"PRE_PARENT_EVIDENCE_CUT_CAPTURED_RECONCILIATION_PENDING":"PRE_PARENT_EVIDENCE_CUT_BLOCKED",
    blockers:uniqueBlockers,scanDate:date,evidenceCutId,evidenceCutoffAt:cutoff,scopeClass:scope||null,
    scope:preCutManifestReady?"MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE":"UNVERIFIED",
    requiredMarkets:required,coveredMarkets:covered,
    requiredSourceLanes:identity.requiredSourceLanes,unknownRequiredLaneCount,
    expectedMopsKeysetComplete:expectedMopsKeysetComplete===true,
    expectedMopsVersionKeys:expected,observedMopsVersionKeys:observed,mopsObservedVersions:identity.mopsObservedVersions,mopsIneligibleCount,
    referenceAvailabilityObservations:identity.referenceAvailabilityObservations,referenceIneligibleCount,
    referenceIdentityDomainCountsTowardMopsKeyset:false,
    mopsIdentityDomainCountsTowardNoRevisionGap:true,
    queryTruncated:queryTruncated===true,budgetExceeded:budgetExceeded===true,selectedOnlyCaptureAuthorized:false,
    sourceCutManifestHash,preCutManifestReady,appendOnlyExactVersionIdentity:true,
    noRevisionGapThroughCut:false,noRevisionGapThroughCutCertified:false,
    symbolSessionCompletenessCertified:false,technicalContinuityCertified:false,
    historyMutationPerformed:false,selectionAuthority:false,finalSelectionEnabled:false,livePushEnabled:false,capitalImpact:false,orderImpact:false,system1RuntimeUsed:false,
  });
}

export async function reconcileMopsNoRevisionGapThroughCutV1_4_1({preCutManifest,postReconciliation}={}){
  if(!preCutManifest||typeof preCutManifest!=="object"||Array.isArray(preCutManifest))throw new Error("preCutManifest is required");
  if(!postReconciliation||typeof postReconciliation!=="object"||Array.isArray(postReconciliation))throw new Error("postReconciliation is required");
  const blockers=[];
  if(preCutManifest.preCutManifestReady!==true)blockers.push("PRE_CUT_MANIFEST_NOT_READY");
  if(!hash64(preCutManifest.sourceCutManifestHash))blockers.push("PRE_CUT_MANIFEST_HASH_INVALID");
  const cutoff=isoTimestamp(preCutManifest.evidenceCutoffAt,"preCutManifest.evidenceCutoffAt");
  const reconciledAt=isoTimestamp(postReconciliation.reconciledAt,"postReconciliation.reconciledAt");
  if(Date.parse(reconciledAt)<=Date.parse(cutoff))blockers.push("POST_RECONCILIATION_NOT_AFTER_CUT");
  if(postReconciliation.boundedPopulationComplete!==true)blockers.push("POST_BOUNDED_POPULATION_INCOMPLETE");
  if(postReconciliation.populationIdentityStable!==true)blockers.push("POST_POPULATION_IDENTITY_UNSTABLE");
  if(postReconciliation.queryTruncated===true)blockers.push("POST_QUERY_TRUNCATED");

  const pre=Array.isArray(preCutManifest.mopsObservedVersions)?preCutManifest.mopsObservedVersions:[];
  const post=Array.isArray(postReconciliation.mopsVersions)?postReconciliation.mopsVersions:[];
  const preMap=new Map(pre.map(x=>[text(x.versionKey),x]));
  const postMap=new Map(post.map(x=>[text(x.versionKey),x]));
  const preKeys=[...preMap.keys()].filter(Boolean),postKeys=[...postMap.keys()].filter(Boolean);
  if(preKeys.length!==pre.length)blockers.push("PRE_MOPS_VERSION_KEY_MISSING_OR_DUPLICATE");
  if(postKeys.length!==post.length)blockers.push("POST_MOPS_VERSION_KEY_MISSING_OR_DUPLICATE");
  const missing=preKeys.filter(k=>!postMap.has(k));
  if(missing.length)blockers.push("PRE_MOPS_VERSION_MISSING_FROM_POST");
  const mutated=[];
  for(const [k,a] of preMap){const b=postMap.get(k);if(!b)continue;const ah=text(a.versionPayloadHash),bh=text(b.versionPayloadHash??b.payloadHash);if(!hash64(ah)||!hash64(bh))blockers.push("MOPS_VERSION_PAYLOAD_HASH_INVALID");else if(ah!==bh)mutated.push(k);}
  if(mutated.length)blockers.push("MOPS_VERSION_PAYLOAD_MUTATION");
  const latePre=[],later=[];
  for(const row of post){const k=text(row.versionKey);if(!k||preMap.has(k))continue;const at=text(row.sourceReportedAt);if(!at||!Number.isFinite(Date.parse(at))){blockers.push("POST_NEW_MOPS_VERSION_SOURCE_REPORTED_AT_INVALID");continue;}if(Date.parse(at)<=Date.parse(cutoff))latePre.push(k);else later.push(k);}
  if(latePre.length)blockers.push("LATE_DISCOVERED_PRE_CUT_MOPS_VERSION");
  const unique=[...new Set(blockers)],pass=unique.length===0;
  const identity={evidenceCutId:text(preCutManifest.evidenceCutId)||null,sourceCutManifestHash:text(preCutManifest.sourceCutManifestHash)||null,evidenceCutoffAt:cutoff,reconciledAt,preMopsVersionKeys:[...preKeys].sort(),postMopsVersionKeys:[...postKeys].sort(),missingPreMopsVersionKeys:[...missing].sort(),mutatedMopsVersionKeys:[...mutated].sort(),lateDiscoveredPreCutMopsVersionKeys:[...latePre].sort(),laterMopsVersionKeys:[...later].sort()};
  return deepFreeze({
    schemaVersion:"S2_S2_07_MOPS_NO_REVISION_GAP_THROUGH_CUT_V1_4_1",version:S2_07_PRE_PARENT_EVIDENCE_CUT_VERSION_V1_4_1,
    state:pass?"BOUNDED_MOPS_NO_REVISION_GAP_THROUGH_CUT_READY":"MOPS_NO_REVISION_GAP_THROUGH_CUT_BLOCKED",blockers:unique,
    reconciliationId:"S2-NRG:"+await sha256Hex(identity),...identity,lateDiscoveredPreCutVersionCount:latePre.length,
    noRevisionGapThroughCut:pass,noRevisionGapThroughCutCertified:pass,certificationScope:pass?"EXACT_MOPS_EVIDENCE_CUT_ONLY":"NONE",
    referenceIdentityDomainUsedForRevisionGap:false,historicalSourceReportedAtUsedForPositiveAdmission:false,historicalSourceReportedAtUsedForFalsificationOnly:true,
    symbolSessionCompletenessCertified:false,technicalContinuityCertified:false,historyMutationPerformed:false,selectionAuthority:false,finalSelectionEnabled:false,livePushEnabled:false,capitalImpact:false,orderImpact:false,system1RuntimeUsed:false,
  });
}
