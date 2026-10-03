import assert from "node:assert/strict";
import {auditCrossingOpportunityControls} from "./pattern_repeated_cycle_confound_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const full={
 parentZoneWidthPct:0.02,parentZoneWidthATR:1.4,boundaryDistancePathAvailable:true,
 episodeAgeEligibleSessions:40,observableEligibleSessionsAtRisk:20,constrainedEligibleSessionsAtRisk:1,
 atrOrVolatilityReceiptRef:"VOL1",tickRuleVersion:"TWSE_TICK_V1",relativeTick:0.001,
 liquidityState:"LIQUID",priceLimitSessionProvenance:"PL1",
 priceVolumeAcceptanceReceiptRef:"PV1",marketSectorRegimeReceiptRef:"RG1"
};

t("CF01 complete bundle allows residual research only",()=>{
 const r=auditCrossingOpportunityControls(full);
 assert.equal(r.status,"CONTROL_BUNDLE_COMPLETE");
 assert.equal(r.structuralRecurrenceResidualEligible,true);
 assert.equal(r.rawCycleRatePromotionEligible,false);
});

t("CF02 missing volatility remains unknown",()=>{
 const x={...full,atrOrVolatilityReceiptRef:null};
 const r=auditCrossingOpportunityControls(x);
 assert.equal(r.status,"CONTROL_INCOMPLETE");
 assert(r.missing.includes("atrOrVolatilityReceiptRef"));
});

t("CF03 missing tick rule blocks residual claim",()=>{
 const r=auditCrossingOpportunityControls({...full,tickRuleVersion:null});
 assert.equal(r.structuralRecurrenceResidualEligible,false);
});

t("CF04 missing D02 acceptance blocks residual claim",()=>{
 const r=auditCrossingOpportunityControls({...full,priceVolumeAcceptanceReceiptRef:null});
 assert.equal(r.structuralRecurrenceResidualEligible,false);
});

t("CF05 missing regime remains unknown not neutral",()=>{
 const r=auditCrossingOpportunityControls({...full,marketSectorRegimeReceiptRef:null});
 assert.equal(r.missingDataSemantics,"UNKNOWN");
});

t("CF06 raw cycle rate never becomes promotion eligible by itself",()=>{
 assert.equal(auditCrossingOpportunityControls(full).rawCycleRatePromotionEligible,false);
});

console.log(`SUMMARY ${pass}/6 PASS`);
