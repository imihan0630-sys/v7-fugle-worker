import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  buildPreParentEvidenceCutManifestV1_4,
  reconcileNoRevisionGapThroughCutV1_4,
} from "../runtime/s2_07_pre_parent_evidence_cut_v1_4.mjs";

const H=(c)=>c.repeat(64);
async function observation({key=H("a"),payload=H("b"),availableAt="2026-10-07T05:00:00Z"}={}){
  return {
    observationMode:"PROSPECTIVE_POLL",
    evidenceClass:"PROSPECTIVE_EXACT_VERSION_OBSERVER",
    exactVersionIdentity:true,
    publicAvailabilityObserved:true,
    stableReferenceKey:key,
    referenceSourceRowHash:payload,
    evidenceId:await sha256Hex({key,payload,availableAt}),
    sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",
    availableAt,
  };
}
const lane={laneId:"TPEX_REFERENCE_LANE",state:"READY",payloadHash:H("c"),queryComplete:true,queryTruncated:false};

const obs=await observation();
const cut=await buildPreParentEvidenceCutManifestV1_4({
  scanDate:"2026-10-07",
  evidenceCutoffAt:"2026-10-07T05:30:00Z",
  scopeClass:"EXCHANGE_WIDE",
  requiredMarkets:["TPEX"],
  coveredMarkets:["TPEX"],
  expectedVersionKeys:[obs.stableReferenceKey],
  expectedKeysetComplete:true,
  observations:[obs],
  requiredLanes:[lane],
});
assert.equal(cut.preCutManifestReady,true);
assert.equal(cut.state,"PRE_PARENT_EVIDENCE_CUT_CAPTURED_RECONCILIATION_PENDING");
assert.equal(cut.noRevisionGapThroughCut,false);
assert.equal(cut.selectedOnlyCaptureAuthorized,false);
assert.match(cut.sourceCutManifestHash,/^[0-9a-f]{64}$/);

const partial=await buildPreParentEvidenceCutManifestV1_4({
  scanDate:"2026-10-07",
  evidenceCutoffAt:"2026-10-07T05:30:00Z",
  scopeClass:"SELECTED_ONLY_SAMPLE",
  requiredMarkets:["TPEX","TWSE"],
  coveredMarkets:["TPEX"],
  expectedVersionKeys:[obs.stableReferenceKey],
  expectedKeysetComplete:false,
  observations:[obs],
  requiredLanes:[lane],
  selectedOnly:true,
});
assert.equal(partial.preCutManifestReady,false);
for(const reason of ["EVIDENCE_CUT_SCOPE_INVALID","SELECTED_ONLY_CAPTURE_FORBIDDEN","MARKET_SCOPE_COVERAGE_MISMATCH","EXPECTED_VERSION_KEYSET_NOT_CERTIFIED_COMPLETE"]){
  assert.ok(partial.blockers.includes(reason),reason);
}

const late=await observation({availableAt:"2026-10-07T06:00:00Z"});
const lateCut=await buildPreParentEvidenceCutManifestV1_4({
  scanDate:"2026-10-07",evidenceCutoffAt:"2026-10-07T05:30:00Z",scopeClass:"EXCHANGE_WIDE",
  requiredMarkets:["TPEX"],coveredMarkets:["TPEX"],expectedVersionKeys:[late.stableReferenceKey],expectedKeysetComplete:true,
  observations:[late],requiredLanes:[lane],
});
assert.equal(lateCut.preCutManifestReady,false);
assert.ok(lateCut.blockers.includes("PROSPECTIVE_OBSERVATION_INELIGIBLE_AT_CUTOFF"));

const pass=await reconcileNoRevisionGapThroughCutV1_4({
  preCutManifest:cut,
  postReconciliation:{
    reconciledAt:"2026-10-07T07:00:00Z",boundedPopulationComplete:true,populationIdentityStable:true,queryTruncated:false,
    versions:[{versionKey:obs.stableReferenceKey,payloadHash:obs.referenceSourceRowHash,sourceReportedAt:"2026-10-07T04:59:00Z"}],
  },
});
assert.equal(pass.noRevisionGapThroughCut,true);
assert.equal(pass.noRevisionGapThroughCutCertified,true);
assert.equal(pass.certificationScope,"EXACT_EVIDENCE_CUT_ONLY");
assert.equal(pass.technicalContinuityCertified,false);

const latePreKey=H("d");
const falsified=await reconcileNoRevisionGapThroughCutV1_4({
  preCutManifest:cut,
  postReconciliation:{
    reconciledAt:"2026-10-07T07:00:00Z",boundedPopulationComplete:true,populationIdentityStable:true,queryTruncated:false,
    versions:[
      {versionKey:obs.stableReferenceKey,payloadHash:obs.referenceSourceRowHash,sourceReportedAt:"2026-10-07T04:59:00Z"},
      {versionKey:latePreKey,payloadHash:H("e"),sourceReportedAt:"2026-10-07T05:10:00Z"},
    ],
  },
});
assert.equal(falsified.noRevisionGapThroughCut,false);
assert.equal(falsified.lateDiscoveredPreCutVersionCount,1);
assert.ok(falsified.blockers.includes("LATE_DISCOVERED_PRE_CUT_VERSION"));
assert.equal(falsified.historicalSourceReportedAtUsedForPositiveAdmission,false);
assert.equal(falsified.historicalSourceReportedAtUsedForFalsificationOnly,true);

const laterAllowed=await reconcileNoRevisionGapThroughCutV1_4({
  preCutManifest:cut,
  postReconciliation:{
    reconciledAt:"2026-10-07T07:00:00Z",boundedPopulationComplete:true,populationIdentityStable:true,queryTruncated:false,
    versions:[
      {versionKey:obs.stableReferenceKey,payloadHash:obs.referenceSourceRowHash,sourceReportedAt:"2026-10-07T04:59:00Z"},
      {versionKey:H("f"),payloadHash:H("1"),sourceReportedAt:"2026-10-07T06:00:00Z"},
    ],
  },
});
assert.equal(laterAllowed.noRevisionGapThroughCut,true);
assert.deepEqual(laterAllowed.laterVersionKeys,[H("f")]);

const mutated=await reconcileNoRevisionGapThroughCutV1_4({
  preCutManifest:cut,
  postReconciliation:{
    reconciledAt:"2026-10-07T07:00:00Z",boundedPopulationComplete:true,populationIdentityStable:true,queryTruncated:false,
    versions:[{versionKey:obs.stableReferenceKey,payloadHash:H("9"),sourceReportedAt:"2026-10-07T04:59:00Z"}],
  },
});
assert.equal(mutated.noRevisionGapThroughCut,false);
assert.ok(mutated.blockers.includes("VERSION_PAYLOAD_MUTATION"));

console.log("S2-07 pre-parent evidence cut V1.4 tests PASS");
