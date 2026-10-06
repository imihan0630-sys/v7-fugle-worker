import assert from "node:assert/strict";
import {buildPreParentEvidenceCutManifestV1_4_1,reconcileMopsNoRevisionGapThroughCutV1_4_1} from "../runtime/s2_07_pre_parent_evidence_cut_v1_4_1.mjs";
const H=c=>c.repeat(64);
const lanes=Array.from({length:8},(_,i)=>({sourceId:"L"+(i+1),state:"READY",payloadHash:H(String((i+1)%10)),observedAt:"2026-10-07T05:00:00Z",requiresRangeIdentity:i<6,responseRangeVerified:true,parserComplete:true,queryComplete:true,queryTruncated:false}));
const mops=(key,payload=H("a"),at="2026-10-07T05:10:00Z")=>({controlId:"C1",observationMode:"PROSPECTIVE_POLL",sourceReportedClockEligible:true,versionKey:key,versionPayloadHash:payload,sourceReportedAt:"2026-10-07T04:55:00Z",firstObservedAvailableAt:at});
const ref={observationMode:"PROSPECTIVE_POLL",evidenceClass:"PROSPECTIVE_EXACT_VERSION_OBSERVER",exactVersionIdentity:true,publicAvailabilityObserved:true,stableReferenceKey:H("b"),referenceSourceRowHash:H("c"),availableAt:"2026-10-07T05:12:00Z",sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE"};
const cut=await buildPreParentEvidenceCutManifestV1_4_1({scanDate:"2026-10-07",evidenceCutoffAt:"2026-10-07T05:30:00Z",scopeClass:"MARKET_WIDE",requiredMarkets:["TWSE","TPEX"],coveredMarkets:["TWSE","TPEX"],requiredSourceLanes:lanes,expectedMopsVersionKeys:["V1"],expectedMopsKeysetComplete:true,mopsVersionObservations:[mops("V1")],referenceAvailabilityObservations:[ref]});
assert.equal(cut.preCutManifestReady,true);
assert.deepEqual(cut.observedMopsVersionKeys,["V1"]);
assert.equal(cut.referenceIdentityDomainCountsTowardMopsKeyset,false);
assert.equal(cut.mopsIdentityDomainCountsTowardNoRevisionGap,true);
assert.equal(cut.referenceAvailabilityObservations.length,1);

const wrongDomain=await buildPreParentEvidenceCutManifestV1_4_1({scanDate:"2026-10-07",evidenceCutoffAt:"2026-10-07T05:30:00Z",scopeClass:"MARKET_WIDE",requiredMarkets:["TWSE","TPEX"],coveredMarkets:["TWSE","TPEX"],requiredSourceLanes:lanes,expectedMopsVersionKeys:[ref.stableReferenceKey],expectedMopsKeysetComplete:true,mopsVersionObservations:[],referenceAvailabilityObservations:[ref]});
assert.equal(wrongDomain.preCutManifestReady,false);
assert.ok(wrongDomain.blockers.includes("MOPS_VERSION_KEYSET_MISMATCH"));
assert.equal(wrongDomain.referenceIdentityDomainCountsTowardMopsKeyset,false);

const seven=await buildPreParentEvidenceCutManifestV1_4_1({scanDate:"2026-10-07",evidenceCutoffAt:"2026-10-07T05:30:00Z",scopeClass:"MARKET_WIDE",requiredMarkets:["TWSE","TPEX"],coveredMarkets:["TWSE","TPEX"],requiredSourceLanes:lanes.slice(0,7),expectedMopsVersionKeys:["V1"],expectedMopsKeysetComplete:true,mopsVersionObservations:[mops("V1")]});
assert.equal(seven.preCutManifestReady,false);assert.ok(seven.blockers.includes("REQUIRED_MARKET_WIDE_LANE_COUNT_MISMATCH"));

const pass=await reconcileMopsNoRevisionGapThroughCutV1_4_1({preCutManifest:cut,postReconciliation:{reconciledAt:"2026-10-07T07:00:00Z",boundedPopulationComplete:true,populationIdentityStable:true,queryTruncated:false,mopsVersions:[{versionKey:"V1",versionPayloadHash:H("a"),sourceReportedAt:"2026-10-07T04:55:00Z"}]}});
assert.equal(pass.noRevisionGapThroughCut,true);assert.equal(pass.referenceIdentityDomainUsedForRevisionGap,false);
const late=await reconcileMopsNoRevisionGapThroughCutV1_4_1({preCutManifest:cut,postReconciliation:{reconciledAt:"2026-10-07T07:00:00Z",boundedPopulationComplete:true,populationIdentityStable:true,queryTruncated:false,mopsVersions:[{versionKey:"V1",versionPayloadHash:H("a"),sourceReportedAt:"2026-10-07T04:55:00Z"},{versionKey:"V0",versionPayloadHash:H("d"),sourceReportedAt:"2026-10-07T05:20:00Z"}]}});
assert.equal(late.noRevisionGapThroughCut,false);assert.ok(late.blockers.includes("LATE_DISCOVERED_PRE_CUT_MOPS_VERSION"));
console.log("S2-07 pre-parent evidence cut V1.4.1 identity-domain tests PASS");
