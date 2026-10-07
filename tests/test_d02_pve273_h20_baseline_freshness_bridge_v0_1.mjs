import assert from "node:assert/strict";
import {evaluatePVE242LaneBridge} from "../research/d02_pve242_lane_bridge_guard_v0_1.mjs";
import {evaluatePve273H20BaselineFreshness as gate} from "../research/d02_pve273_h20_baseline_freshness_bridge_v0_1.mjs";

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
const base={
 primitiveEventOwner:"D01-05",primitiveEventId:"E1",comparatorPrimitiveEventId:"E1",
 anchorBarStart:iso("10:15:00"),comparatorAnchorBarStart:iso("10:15:00"),outcomeHorizon:"B2",comparatorOutcomeHorizon:"B2",
 challengerFeatureId:"SAME_SLOT_RVOL20",baselineComparatorFeatureId:"LOCAL_PREV5_VOLUME_RATIO",
 sameSlotBaselineClean:true,slotHistoryCount:20,currentSlotCoverageValid:true,
 baselineAsOfDate:"2026-10-08",expectedLatestComparableSlotDate:"2026-10-08",
 sameSlotHistoryValidityState:"PASS",corporateActionContinuityState:"CLEAN",
 currentSessionExcludedFromBaseline:true,futureDatesAbsent:true,
 baselineRawPayloadHash:"a".repeat(64),baselineRawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
 residualIncrementalityTarget:"RVOL20_BEYOND_LOCAL_PREV5_ON_IDENTICAL_D01_BREAKOUT"
};

// Reproduce the old blind spot: PVE-242 passes without any baseline freshness evidence.
const legacyCtx={primitiveEventOwner:"D01-05",primitiveEventId:"E1",comparatorPrimitiveEventId:"E1",anchorBarStart:iso("10:15:00"),comparatorAnchorBarStart:iso("10:15:00"),outcomeHorizon:"B2",comparatorOutcomeHorizon:"B2"};
assert.equal(evaluatePVE242LaneBridge(receipt,"D02-03:H20",legacyCtx).pass,true);
assert.equal(gate(receipt,legacyCtx).pass,false);
assert.ok(gate(receipt,legacyCtx).reasons.includes("H20_SAME_SLOT_BASELINE_NOT_CLEAN"));

assert.equal(gate(receipt,base).pass,true);
for(const [k,v] of [
 ["challengerFeatureId","LOCAL_RATIO"],["baselineComparatorFeatureId","OTHER"],
 ["sameSlotBaselineClean",false],["slotHistoryCount",19],["currentSlotCoverageValid",false],
 ["baselineAsOfDate","2026-10-07"],["expectedLatestComparableSlotDate",null],
 ["sameSlotHistoryValidityState","FAIL"],["corporateActionContinuityState","UNKNOWN"],
 ["currentSessionExcludedFromBaseline",false],["futureDatesAbsent",false],
 ["baselineRawPayloadHash","bad"],["baselineRawPayloadHashBasis","OTHER"],
 ["residualIncrementalityTarget","OTHER"]
]){
 const r=gate(receipt,{...base,[k]:v});
 assert.equal(r.pass,false,k);
}
assert.equal(gate(receipt,{...base,baselineAsOfDate:"2026-10-09",expectedLatestComparableSlotDate:"2026-10-09"}).pass,false);
assert.equal(gate(receipt,{...base,primitiveEventOwner:"D02"}).pass,false);
assert.equal(gate(receipt,base).outcomeAccessAuthorized,false);
assert.equal(gate(receipt,base).maturityPromotionAuthorized,false);

console.log(JSON.stringify({status:"PASS",assertions:22,legacyBlindSpotReproduced:true}));
