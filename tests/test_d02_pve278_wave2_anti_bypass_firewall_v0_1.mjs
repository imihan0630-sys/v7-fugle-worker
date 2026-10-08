import assert from "node:assert/strict";
import {evaluateWave2Row} from "../research/d02_l4_wave2_admission_evaluator_v0_1.mjs";
import {evaluatePve278Wave2AntiBypass as gate} from "../research/d02_pve278_wave2_anti_bypass_firewall_v0_1.mjs";

const d="2026-11-03",iso=t=>d+"T"+t+"+08:00";let n=0;
const base=(moduleId,over={})=>({moduleId,scanDate:d,eventId:moduleId+":"+n++,gate0to6Pass:true,dataQaPass:true,cleanCohortProvenance:true,generationAligned:true,formalIsolationPass:true,sourceContinuityPass:true,commonSupportPass:true,cleanScanDate:true,featureFirstKnownAt:iso("10:30:01"),decisionCutoffAt:iso("10:31:00"),outcomeStartAt:iso("10:45:00"),outcomeKnownAt:iso("13:31:00"),outcomeStatus:"COMPLETED",...over});
const rows=[
 ["D04",base("D02-04",{state:"LOW_PARTICIPATION_CANDIDATE",candidateLabelImmutable:true,priceConsolidationGeometryKnown:true,volatilityContractionKnown:true,liquidityContextKnown:true,laterDemandStateUsedInFeature:false})],
 ["D05",base("D02-05",{participationBand:"EXTREME",volumeBandFrozenPreOutcome:true,priceResponseStateKnown:true,volatilityContextKnown:true,eventContextKnown:true,liquidityContextKnown:true,motiveLabel:"UNKNOWN"})],
 ["D07",base("D02-07",{signedVolumeBalance20:.1,dailyVolumeContinuityPass:true,pricePathControlPresent:true,directVolumeControlPresent:true,responsePersistenceControlPresent:true,identicalSupportCvsD:true,rawObvIndependentVote:false,unfrozenObvSlopeUsed:false})],
 ["D08",base("D02-08",{providerTradePressureProxy:.2,classificationCoverage:.8,unclassifiedVolume:20,pressureSourceContinuityPass:true,spreadDepthLiquidityControlsKnown:true,trueOfiEligible:false,dynamicAbsorptionEligible:false,participantIntentEligible:false,motiveLabel:"UNKNOWN"})],
 ["D09P",base("D02-09",{family:"PIVOT_SIGNED_VOLUME",genericDivergenceBooleanUsed:false,visualPivotSelectionUsed:false,allPairScanUsed:false,bestWindowSearchUsed:false,underlyingPriceAndVolumeTrajectoriesPresent:true,confirmedPivotChronologyPass:true,sameTypeSameScaleConsecutivePivots:true,priceContinuityPass:true,dailyVolumeContinuityPass:true,laterPivotConfirmedAt:iso("10:20:00")})],
 ["D09T",base("D02-09",{family:"PARTICIPATION_TRAJECTORY",genericDivergenceBooleanUsed:false,visualPivotSelectionUsed:false,allPairScanUsed:false,bestWindowSearchUsed:false,underlyingPriceAndVolumeTrajectoriesPresent:true,trajectoryClockPass:true})],
 ["D10",base("D02-10",{trendParentOwner:"D03",directTrendPresent:true,directParticipationPresent:true,explicitInteractionTransformPresent:true,identicalSupportCvsD:true,noTripleVote:true,trendParentKnownAt:"2026-11-02T13:31:00+08:00",volumeBarEnd:iso("10:30:00"),volumeSourceFetchedAt:iso("10:30:00"),interactionFirstKnownAt:iso("10:30:01"),slotKey:"10:15",interactionUsesCumvolPace:true})],
 ["D11",base("D02-11",{cohortRole:"ADMITTED",rejectionReason:"BELOW_MIN_LOTS",reasonStratified:true,executionCostEvidenceKnown:true,spreadDepthEvidenceKnown:true,thresholdVersionFrozen:true,thresholdSweepUsed:false})],
 ["D12T",base("D02-12",{family:"TIME_OF_DAY_VOLUME_CURVE",sameSlotRvolControlPresent:true,cumulativePaceControlPresent:true,priceLocationControlPresent:true,slotKey:"12:45",fullSessionCompletenessClaim:false})],
 ["D12P",base("D02-12",{family:"PRICE_BY_VOLUME_PROFILE",sameSlotRvolControlPresent:true,cumulativePaceControlPresent:true,priceLocationControlPresent:true,prospectiveCapture:true,historicalBackfillUsed:false,closingAuctionCompletenessClaim:false,closingAuctionCoverageProven:false})]
];
const common={pass:true,outcomeBlind:true,receiptHash:"a".repeat(64)};
const intraday={...common,baselineAsOfDate:"2026-11-02",expectedLatestComparableSlotDate:"2026-11-02",slotHistoryCount:20,rangeHistoryCount:20,cumulativeHistoryCount:20,currentSlotCoverageValid:true,exactSlotHistoryValidityState:"PASS",corporateActionContinuityState:"CLEAN",currentSessionExcluded:true,futureDatesAbsent:true,rawPayloadHash:"b".repeat(64),prefixContinuityPass:true,persistenceAdjacencyPass:true};
const daily={...common,expectedSessionSetHash:"c".repeat(64),missingExpectedSessionCount:0,unitContinuityPass:true,corporateActionContinuityPass:true,sourceProvenancePass:true};
const rolling={...common,historyCount:20,baselineAsOfDate:"2026-11-02",expectedLatestPriorSession:"2026-11-02",expectedSessionSetHash:"d".repeat(64),missingExpectedSessionCount:0,unitContinuityPass:true,corporateActionContinuityPass:true};
const control={...common,sameSlotRvolFreshnessPass:true,cumulativePaceFreshnessPass:true,responseBaselineFreshnessPass:true,controlDatasetHash:"e".repeat(64)};
const time={...common,denominatorAsOfDate:"2026-11-02",expectedLatestComparableSlotDate:"2026-11-02",historicalSessionCount:20,exactSlotHistoryValidityState:"PASS",currentSessionExcluded:true,futureDatesAbsent:true};
const evidenceBy={
 D04:{intradayBaseline:intraday},D05:{intradayBaseline:intraday},D07:{dailyContinuity:daily},D08:{incrementalControlFreshness:control},
 D09P:{dailyContinuity:daily},D09T:{intradayBaseline:intraday,participationUsage:{usesSlotRvol:true,usesCumPace:true,usesPersistence:true}},
 D10:{intradayBaseline:intraday,participationFeatureType:"CUMVOL_PACE20"},D11:{rolling20Baseline:rolling},
 D12T:{timeCurveDenominator:time,incrementalControlFreshness:control},D12P:{incrementalControlFreshness:control}
};
for(const [id,row] of rows){
 assert.equal(evaluateWave2Row(row).pass,true,id+" legacy");
 assert.equal(gate(row,{}).pass,false,id+" must fail without bound evidence");
 assert.equal(gate(row,evidenceBy[id]).pass,true,id+" bound evidence");
}
assert.equal(gate(rows[0][1],{intradayBaseline:{...intraday,baselineAsOfDate:"2026-10-31"}}).pass,false);
assert.equal(gate(rows[1][1],{intradayBaseline:{...intraday,rangeHistoryCount:19}}).pass,false);
assert.equal(gate(rows[2][1],{dailyContinuity:{...daily,missingExpectedSessionCount:1}}).pass,false);
assert.equal(gate(rows[5][1],{intradayBaseline:intraday,participationUsage:{usesSlotRvol:false,usesCumPace:false,usesPersistence:false}}).pass,false);
assert.equal(gate(rows[6][1],{intradayBaseline:intraday,participationFeatureType:"UNKNOWN"}).pass,false);
assert.equal(gate(rows[7][1],{rolling20Baseline:{...rolling,baselineAsOfDate:"2026-10-31"}}).pass,false);
assert.equal(gate(rows[8][1],{timeCurveDenominator:{...time,denominatorAsOfDate:"2026-10-31"},incrementalControlFreshness:control}).pass,false);
assert.equal(gate(rows[9][1],{incrementalControlFreshness:{...control,sameSlotRvolFreshnessPass:false}}).pass,false);
assert.equal(gate(rows[0][1],evidenceBy.D04).outcomeAccessAuthorized,false);
assert.equal(gate(rows[0][1],evidenceBy.D04).maturityPromotionAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:40}));
