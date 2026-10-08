import assert from "node:assert/strict";
import {evaluatePve275Wave1AntiBypass as gate} from "../research/d02_pve275_wave1_anti_bypass_firewall_v0_1.mjs";

const d="2026-10-09",iso=t=>d+"T"+t+"+08:00";
const receipt={
 schemaVersion:"D02_PROSPECTIVE_PV_PROVENANCE_RECEIPT_V0_1",researchOnly:true,outcomeBlind:true,
 symbol:"2330",marketDate:d,timeframe:"15m",
 source:{provider:"X",endpoint:"live",retrievedAt:iso("10:30:01"),sourceTier:"LIVE_PROVIDER",rawPayloadHash:"abcdef1234567890"},
 availability:{availableAt:iso("10:30:00"),firstKnownAt:iso("10:30:02"),decisionCutoff:iso("10:31:00"),knownByDecisionCutoff:true},
 bar:{barStart:iso("10:15:00"),barEnd:iso("10:30:00"),timezone:"Asia/Taipei",completed:true},
 volume:{rawValue:12,rawUnit:"LOTS",normalizedValue:12000,normalizedUnit:"SHARES",conversionRule:"REGULAR_LOT_X_1000",unitContinuityStatus:"PASS"},
 price:{adjustmentSemantics:"UNADJUSTED",corporateActionContaminated:false},
 corporateAction:{status:"NONE_VERIFIED",receiptRef:null,knownByDecisionCutoff:true},
 informationRoot:"PRICE_PLUS_VOLUME_DERIVED",
 participation:{proxyClass:"RVOL",intentIdentified:false,openingAuctionCompleteness:"NOT_APPLICABLE"},
 admission:{pitPass:true,unitPass:true,corporateActionPass:true,sourcePass:true,intentFirewallPass:true,eligibleForProspectiveEvidence:true,reasons:[]}
};

const h001Baseline={
 ownerApproved:true,deployed:true,productionRemediationAccepted:true,marketDate:d,
 baselineAsOfDate:"2026-10-08",expectedLatestComparableSlotDate:"2026-10-08",
 sameSlotHistoryValidityState:"PASS",corporateActionContinuityState:"CLEAN",
 currentSessionExcludedFromBaseline:true,futureDatesAbsent:true,
 rawPayloadHash:"a".repeat(64),rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
 featureCapturedAt:"2026-10-09T02:30:02.000Z",deployedAt:"2026-10-08T01:00:00.000Z",
 decisionImpact:0,retroactiveCleanDateGranted:false
};
const quota={
 corr003IndependentVerificationPass:true,accountQuotaGateActive:true,system1AfterMarketReserveProtected:true,
 accountUsageKnownOrConservativeBlock:true,scheduleEvidenceState:"BUSINESS_EXECUTION_SUCCESS",
 successfulBusinessExecutionCount:1,normalProductionReceiptPersisted:true,quotaRejectionObserved:false,
 triggerAbsenceVsWriteFailureDistinguishable:true,paidUpgradePerformed:false,
 system1FormalCoreUnchanged:true,system2StrategySemanticsUnchanged:true,verifiedAt:"2026-10-08T15:58:00.000Z"
};
assert.equal(gate({evidenceKey:"D02-02:H001",candidateMarketDate:d,baseline:h001Baseline,quotaSchedule:quota}).pass,true);
assert.equal(gate({evidenceKey:"D02-02:H001",candidateMarketDate:d,baseline:{...h001Baseline,baselineAsOfDate:"2026-10-07"},quotaSchedule:quota}).pass,false);
assert.equal(gate({evidenceKey:"D02-02:H001",candidateMarketDate:d,baseline:h001Baseline,quotaSchedule:{...quota,accountQuotaGateActive:false}}).pass,false);

const h20={
 primitiveEventOwner:"D01-05",primitiveEventId:"E1",comparatorPrimitiveEventId:"E1",
 anchorBarStart:iso("10:15:00"),comparatorAnchorBarStart:iso("10:15:00"),outcomeHorizon:"B2",comparatorOutcomeHorizon:"B2",
 challengerFeatureId:"SAME_SLOT_RVOL20",baselineComparatorFeatureId:"LOCAL_PREV5_VOLUME_RATIO",
 sameSlotBaselineClean:true,slotHistoryCount:20,currentSlotCoverageValid:true,
 baselineAsOfDate:"2026-10-08",expectedLatestComparableSlotDate:"2026-10-08",
 sameSlotHistoryValidityState:"PASS",corporateActionContinuityState:"CLEAN",currentSessionExcludedFromBaseline:true,
 futureDatesAbsent:true,baselineRawPayloadHash:"b".repeat(64),baselineRawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
 residualIncrementalityTarget:"RVOL20_BEYOND_LOCAL_PREV5_ON_IDENTICAL_D01_BREAKOUT"
};
assert.equal(gate({evidenceKey:"D02-03:H20",receipt,context:h20}).pass,true);
assert.equal(gate({evidenceKey:"D02-03:H20",receipt,context:{...h20,sameSlotBaselineClean:false}}).pass,false);

const bb={
 clean:true,historyCount:20,currentSlotCoverageValid:true,baselineAsOfDate:"2026-10-08",
 expectedLatestComparableSlotDate:"2026-10-08",exactSlotHistoryValidityState:"PASS",
 corporateActionContinuityState:"CLEAN",currentSessionExcluded:true,futureDatesAbsent:true,
 rawPayloadHash:"c".repeat(64),rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256"
};
const h003={
 sameFeatureBarForPAndPV:true,h003HypothesisCleanEvent:true,preEventOnlyExpiry:false,
 priceOnlyFeatureSetId:"PRICE_GEOMETRY_ONLY_V0_1",pricePlusVolumeFeatureSetId:"PRICE_GEOMETRY_PLUS_VOLUME_EFFORT_V0_1",
 identicalPriceGeometryInputs:true,identicalEligibleRows:true,volumeEffortOnlyIncrement:true,
 sameOutcomeDefinition:true,outcomeStrictlyFuture:true,sameEventIdentity:true,
 priceOnlyBaseline:{...bb},pricePlusVolumeBaseline:{...bb,rawPayloadHash:"d".repeat(64)}
};
assert.equal(gate({evidenceKey:"D02-06:H003",receipt:{...receipt,participation:{proxyClass:"PRICE_VOLUME_RESPONSE",intentIdentified:false,openingAuctionCompleteness:"NOT_APPLICABLE"}},context:h003}).pass,true);
assert.equal(gate({evidenceKey:"D02-06:H003",receipt:{...receipt,participation:{proxyClass:"PRICE_VOLUME_RESPONSE",intentIdentified:false,openingAuctionCompleteness:"NOT_APPLICABLE"}},context:{...h003,pricePlusVolumeBaseline:{...h003.pricePlusVolumeBaseline,baselineAsOfDate:"2026-10-07"}}}).pass,false);

assert.equal(gate({evidenceKey:"D02-99:UNKNOWN"}).state,"UNSUPPORTED_EVIDENCE_KEY");
for(const key of ["D02-02:H001","D02-03:H20","D02-06:H003"]){
 const good=key==="D02-02:H001"?{evidenceKey:key,candidateMarketDate:d,baseline:h001Baseline,quotaSchedule:quota}:
 key==="D02-03:H20"?{evidenceKey:key,receipt,context:h20}:
 {evidenceKey:key,receipt:{...receipt,participation:{proxyClass:"PRICE_VOLUME_RESPONSE",intentIdentified:false,openingAuctionCompleteness:"NOT_APPLICABLE"}},context:h003};
 const r=gate(good);
 assert.equal(r.outcomeAccessAuthorized,false);
 assert.equal(r.maturityPromotionAuthorized,false);
 assert.equal(r.formalCoreChangeAuthorized,false);
 assert.equal(r.legacyGateDirectUseAuthorized,false);
}
console.log(JSON.stringify({status:"PASS",assertions:20}));
