import assert from "node:assert/strict";
import {evaluatePVE242LaneBridge} from "../research/d02_pve242_lane_bridge_guard_v0_1.mjs";
import {evaluatePve274H003BaselineSymmetry as gate} from "../research/d02_pve274_h003_baseline_symmetry_gate_v0_1.mjs";

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
 participation:{proxyClass:"PRICE_VOLUME_RESPONSE",intentIdentified:false,openingAuctionCompleteness:"NOT_APPLICABLE"},
 admission:{pitPass:true,unitPass:true,corporateActionPass:true,sourcePass:true,intentFirewallPass:true,eligibleForProspectiveEvidence:true,reasons:[]}
};
const legacy={sameFeatureBarForPAndPV:true,h003HypothesisCleanEvent:true,preEventOnlyExpiry:false};
assert.equal(evaluatePVE242LaneBridge(receipt,"D02-06:H003",legacy).pass,true);
assert.equal(gate(receipt,legacy).pass,false);

const b={
 clean:true,historyCount:20,currentSlotCoverageValid:true,
 baselineAsOfDate:"2026-10-08",expectedLatestComparableSlotDate:"2026-10-08",
 exactSlotHistoryValidityState:"PASS",corporateActionContinuityState:"CLEAN",
 currentSessionExcluded:true,futureDatesAbsent:true,
 rawPayloadHash:"a".repeat(64),rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256"
};
const base={
 ...legacy,
 priceOnlyFeatureSetId:"PRICE_GEOMETRY_ONLY_V0_1",
 pricePlusVolumeFeatureSetId:"PRICE_GEOMETRY_PLUS_VOLUME_EFFORT_V0_1",
 identicalPriceGeometryInputs:true,identicalEligibleRows:true,volumeEffortOnlyIncrement:true,
 sameOutcomeDefinition:true,outcomeStrictlyFuture:true,sameEventIdentity:true,
 priceOnlyBaseline:{...b},pricePlusVolumeBaseline:{...b,rawPayloadHash:"b".repeat(64)}
};
assert.equal(gate(receipt,base).pass,true);

for(const [scope,k,v] of [
 ["priceOnlyBaseline","clean",false],["priceOnlyBaseline","historyCount",19],
 ["priceOnlyBaseline","baselineAsOfDate","2026-10-07"],["priceOnlyBaseline","exactSlotHistoryValidityState","FAIL"],
 ["pricePlusVolumeBaseline","clean",false],["pricePlusVolumeBaseline","historyCount",19],
 ["pricePlusVolumeBaseline","baselineAsOfDate","2026-10-07"],["pricePlusVolumeBaseline","exactSlotHistoryValidityState","UNKNOWN"],
 ["pricePlusVolumeBaseline","currentSessionExcluded",false],["pricePlusVolumeBaseline","futureDatesAbsent",false],
 ["pricePlusVolumeBaseline","rawPayloadHash","bad"]
]){
 const r=gate(receipt,{...base,[scope]:{...base[scope],[k]:v}});
 assert.equal(r.pass,false,scope+"."+k);
}
for(const [k,v] of [
 ["identicalPriceGeometryInputs",false],["identicalEligibleRows",false],["volumeEffortOnlyIncrement",false],
 ["sameOutcomeDefinition",false],["outcomeStrictlyFuture",false],["sameEventIdentity",false],
 ["priceOnlyFeatureSetId","OTHER"],["pricePlusVolumeFeatureSetId","OTHER"]
]){
 assert.equal(gate(receipt,{...base,[k]:v}).pass,false,k);
}
assert.equal(gate(receipt,{...base,priceOnlyBaseline:{...b,baselineAsOfDate:"2026-10-07",expectedLatestComparableSlotDate:"2026-10-07"}}).pass,false);
assert.equal(gate(receipt,base).outcomeAccessAuthorized,false);
assert.equal(gate(receipt,base).maturityPromotionAuthorized,false);

console.log(JSON.stringify({status:"PASS",assertions:26,legacyBlindSpotReproduced:true}));
