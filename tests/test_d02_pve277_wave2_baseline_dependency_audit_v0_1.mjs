import assert from "node:assert/strict";
import {auditPve277Wave2Dependency as audit,DEPENDENCY_MATRIX} from "../research/d02_pve277_wave2_baseline_dependency_audit_v0_1.mjs";

const d="2026-11-03",iso=t=>d+"T"+t+"+08:00";let n=0;
const base=(moduleId,over={})=>({moduleId,scanDate:d,eventId:moduleId+":"+n++,gate0to6Pass:true,dataQaPass:true,cleanCohortProvenance:true,generationAligned:true,formalIsolationPass:true,sourceContinuityPass:true,commonSupportPass:true,cleanScanDate:true,featureFirstKnownAt:iso("10:30:01"),decisionCutoffAt:iso("10:31:00"),outcomeStartAt:iso("10:45:00"),outcomeKnownAt:iso("13:31:00"),outcomeStatus:"COMPLETED",...over});
const rows=[
 base("D02-04",{state:"LOW_PARTICIPATION_CANDIDATE",candidateLabelImmutable:true,priceConsolidationGeometryKnown:true,volatilityContractionKnown:true,liquidityContextKnown:true,laterDemandStateUsedInFeature:false}),
 base("D02-05",{participationBand:"EXTREME",volumeBandFrozenPreOutcome:true,priceResponseStateKnown:true,volatilityContextKnown:true,eventContextKnown:true,liquidityContextKnown:true,motiveLabel:"UNKNOWN"}),
 base("D02-07",{signedVolumeBalance20:.1,dailyVolumeContinuityPass:true,pricePathControlPresent:true,directVolumeControlPresent:true,responsePersistenceControlPresent:true,identicalSupportCvsD:true,rawObvIndependentVote:false,unfrozenObvSlopeUsed:false}),
 base("D02-08",{providerTradePressureProxy:.2,classificationCoverage:.8,unclassifiedVolume:20,pressureSourceContinuityPass:true,spreadDepthLiquidityControlsKnown:true,trueOfiEligible:false,dynamicAbsorptionEligible:false,participantIntentEligible:false,motiveLabel:"UNKNOWN"}),
 base("D02-09",{family:"PIVOT_SIGNED_VOLUME",genericDivergenceBooleanUsed:false,visualPivotSelectionUsed:false,allPairScanUsed:false,bestWindowSearchUsed:false,underlyingPriceAndVolumeTrajectoriesPresent:true,confirmedPivotChronologyPass:true,sameTypeSameScaleConsecutivePivots:true,priceContinuityPass:true,dailyVolumeContinuityPass:true,laterPivotConfirmedAt:iso("10:20:00")}),
 base("D02-09",{family:"PARTICIPATION_TRAJECTORY",genericDivergenceBooleanUsed:false,visualPivotSelectionUsed:false,allPairScanUsed:false,bestWindowSearchUsed:false,underlyingPriceAndVolumeTrajectoriesPresent:true,trajectoryClockPass:true}),
 base("D02-10",{trendParentOwner:"D03",directTrendPresent:true,directParticipationPresent:true,explicitInteractionTransformPresent:true,identicalSupportCvsD:true,noTripleVote:true,trendParentKnownAt:"2026-11-02T13:31:00+08:00",volumeBarEnd:iso("10:30:00"),volumeSourceFetchedAt:iso("10:30:00"),interactionFirstKnownAt:iso("10:30:01"),slotKey:"10:15",interactionUsesCumvolPace:true}),
 base("D02-11",{cohortRole:"ADMITTED",rejectionReason:"BELOW_MIN_LOTS",reasonStratified:true,executionCostEvidenceKnown:true,spreadDepthEvidenceKnown:true,thresholdVersionFrozen:true,thresholdSweepUsed:false}),
 base("D02-12",{family:"TIME_OF_DAY_VOLUME_CURVE",sameSlotRvolControlPresent:true,cumulativePaceControlPresent:true,priceLocationControlPresent:true,slotKey:"12:45",fullSessionCompletenessClaim:false}),
 base("D02-12",{family:"PRICE_BY_VOLUME_PROFILE",sameSlotRvolControlPresent:true,cumulativePaceControlPresent:true,priceLocationControlPresent:true,prospectiveCapture:true,historicalBackfillUsed:false,closingAuctionCompletenessClaim:false,closingAuctionCoverageProven:false})
];

for(const row of rows){
 const r=audit(row);
 assert.equal(r.legacyAdmissionPass,true,r.dependencyKey);
 assert.ok(r.dependency,r.dependencyKey);
 assert.equal(r.newEvidenceRequired,true,r.dependencyKey);
 assert.equal(r.baselineOrContinuityEvidenceExplicitInLegacyRowGate,false,r.dependencyKey);
}
assert.equal(DEPENDENCY_MATRIX["D02-04"].class,"DIRECT_INTRADAY_BASELINE_DEPENDENT");
assert.equal(DEPENDENCY_MATRIX["D02-05"].required.includes("SAME_SLOT_RANGE_BASELINE"),true);
assert.equal(DEPENDENCY_MATRIX["D02-07"].class,"DAILY_CONTINUITY_DEPENDENT_NOT_MEDIAN_BASELINE");
assert.equal(DEPENDENCY_MATRIX["D02-08"].class,"PRIMARY_SOURCE_BASELINE_INDEPENDENT_CONTROL_DEPENDENT");
assert.equal(DEPENDENCY_MATRIX["D02-11"].required.includes("LATEST_EXPECTED_PRIOR_SESSION"),true);
assert.equal(DEPENDENCY_MATRIX["D02-12:PRICE_BY_VOLUME_PROFILE"].class,"PRIMARY_PROSPECTIVE_PROFILE_CONTROL_DEPENDENT");
console.log(JSON.stringify({status:"PASS",assertions:46,legacyPassWithoutExplicitFreshnessCount:rows.length}));
