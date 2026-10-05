import assert from "node:assert/strict";
import {
  validateOpeningReceipt,
  classifyCorporateActionGap,
  decomposeSessionPath,
  classifyPathMechanism,
  classifyPathCoverage,
  futurePathLeakageGuard
} from "./pattern_overnight_opening_auction_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const freeze="2026-10-05T18:10:00+08:00";

t("OA01 normal opening receipt remains evaluable",()=>{
  const r=validateOpeningReceipt({
    predictorFreezeAt:freeze,
    receipt:{
      tradeDate:"2026-10-06",
      capturedAt:"2026-10-06T09:00:05+08:00",
      previousClose:100,referencePrice:100,openPrice:103,
      openTime:"2026-10-06T09:00:00+08:00",
      openingAuctionState:"OPEN_FINAL",
      suspensionState:"NORMAL",priceLimitState:"NORMAL"
    }
  });
  assert.equal(r.status,"NORMAL_OPEN");
  assert.equal(r.evaluable,true);
});

t("OA02 missing open is UNKNOWN, not zero return",()=>{
  const r=validateOpeningReceipt({
    predictorFreezeAt:freeze,
    receipt:{
      tradeDate:"2026-10-06",
      capturedAt:"2026-10-06T09:00:05+08:00",
      openPrice:null,
      suspensionState:"NORMAL",priceLimitState:"NORMAL"
    }
  });
  assert.equal(r.status,"OPENING_DATA_MISSING");
});

t("OA03 suspension with no open stays explicit",()=>{
  const r=validateOpeningReceipt({
    predictorFreezeAt:freeze,
    receipt:{
      tradeDate:"2026-10-06",
      capturedAt:"2026-10-06T09:00:05+08:00",
      suspensionState:"SUSPENDED_NO_OPEN"
    }
  });
  assert.equal(r.status,"SUSPENDED_NO_OPEN");
  assert.equal(r.evaluable,false);
});

t("OA04 price-limit constrained open remains visible",()=>{
  const r=validateOpeningReceipt({
    predictorFreezeAt:freeze,
    receipt:{
      tradeDate:"2026-10-06",
      capturedAt:"2026-10-06T09:00:05+08:00",
      openPrice:110,openTime:"2026-10-06T09:00:00+08:00",
      suspensionState:"NORMAL",priceLimitState:"PRICE_LIMIT_CONSTRAINED"
    }
  });
  assert.equal(r.status,"PRICE_LIMIT_CONSTRAINED");
});

t("OA05 corporate-action day without reference price is blocked",()=>{
  const r=classifyCorporateActionGap({
    continuityState:"CORPORATE_ACTION_OR_REFERENCE_RESET",
    previousClose:100,referencePrice:null,openPrice:52
  });
  assert.equal(r.status,"CORPORATE_ACTION_GAP_DATA_BLOCKED");
  assert.equal(r.rawGapAllowed,false);
});

t("OA06 corporate-action day uses reference gap without calling raw gap safe",()=>{
  const r=classifyCorporateActionGap({
    continuityState:"CORPORATE_ACTION_OR_REFERENCE_RESET",
    previousClose:100,referencePrice:50,openPrice:52
  });
  assert.equal(r.status,"CORPORATE_ACTION_CONTEXT_KNOWN");
  assert.equal(r.rawGapAllowed,false);
  assert.equal(r.referenceGap,0.04);
});

t("OA07 ordinary verified day can compute raw overnight gap",()=>{
  const r=classifyCorporateActionGap({
    continuityState:"CONTINUITY_VERIFIED",
    previousClose:100,referencePrice:100,openPrice:103
  });
  assert.equal(r.status,"CONTINUITY_VERIFIED");
  assert.equal(r.rawGapAllowed,true);
  assert.equal(r.rawOvernightGap,0.03);
});

t("OA08 close-to-close decomposes multiplicatively",()=>{
  const r=decomposeSessionPath({
    previousClose:100,openPrice:105,closePrice:107.1,continuityVerified:true
  });
  assert.equal(r.status,"VALID");
  assert.ok(r.identityError<1e-12);
});

t("OA09 overnight and intraday are distinct estimands",()=>{
  const r=decomposeSessionPath({
    previousClose:100,openPrice:105,closePrice:103,continuityVerified:true
  });
  assert.ok(r.overnightReturn>0);
  assert.ok(r.intradayReturn<0);
  assert.equal(r.totalEqualsIntraday,false);
});

t("OA10 continuity failure blocks decomposition",()=>{
  const r=decomposeSessionPath({
    previousClose:100,openPrice:105,closePrice:107,continuityVerified:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("OA11 corporate-action contamination gets its own interpretation state",()=>{
  const r=classifyPathMechanism({
    overnightComponentKnown:true,intradayComponentKnown:true,
    corporateActionContaminated:true
  });
  assert.equal(r.status,"P6_CORPORATE_ACTION_CONTAMINATION");
});

t("OA12 limit constraint gets its own interpretation state",()=>{
  const r=classifyPathMechanism({
    overnightComponentKnown:true,intradayComponentKnown:true,
    priceLimitConstrained:true,corporateActionContaminated:false
  });
  assert.equal(r.status,"P5_LIMIT_OR_AUCTION_CONSTRAINT_EXPLANATION");
});

t("OA13 missing path component is not evaluable",()=>{
  const r=classifyPathMechanism({
    overnightComponentKnown:true,intradayComponentKnown:false,
    corporateActionContaminated:false,priceLimitConstrained:false
  });
  assert.equal(r.status,"P8_NOT_EVALUABLE");
});

t("OA14 clean path without auction state remains partially interpretable",()=>{
  const r=classifyPathMechanism({
    overnightComponentKnown:true,intradayComponentKnown:true,
    earlyContinuousComponentKnown:true,
    openingAuctionStateKnown:false,
    priceLimitConstrained:false,corporateActionContaminated:false
  });
  assert.equal(r.status,"PATH_COMPONENTS_READY_AUCTION_STATE_UNKNOWN");
});

t("OA15 complete owner path is ready for D16, not alpha",()=>{
  const r=classifyPathMechanism({
    overnightComponentKnown:true,intradayComponentKnown:true,
    earlyContinuousComponentKnown:true,
    openingAuctionStateKnown:true,
    priceLimitConstrained:false,corporateActionContaminated:false
  });
  assert.equal(r.status,"PATH_COMPONENTS_READY_FOR_D16");
});

t("OA16 missing observed opening receipt is explicit",()=>{
  const r=classifyPathCoverage({
    expectedOpenCapture:true,observedOpenCapture:false,
    referencePriceKnown:false,openTimeKnown:false,
    suspensionStateKnown:true,corporateActionStateKnown:true
  });
  assert.equal(r.status,"OPENING_DATA_MISSING");
});

t("OA17 historical panel missing reference/openTime is partial blocked",()=>{
  const r=classifyPathCoverage({
    expectedOpenCapture:true,observedOpenCapture:true,
    referencePriceKnown:false,openTimeKnown:false,
    suspensionStateKnown:true,corporateActionStateKnown:true
  });
  assert.equal(r.status,"DATA_QUALITY_BLOCKED_PARTIAL");
});

t("OA18 complete receipt coverage is owner-ready",()=>{
  const r=classifyPathCoverage({
    expectedOpenCapture:true,observedOpenCapture:true,
    referencePriceKnown:true,openTimeKnown:true,
    suspensionStateKnown:true,corporateActionStateKnown:true
  });
  assert.equal(r.status,"OPENING_PATH_RECEIPT_READY");
});

t("OA19 next-session open cannot appear known before after-market freeze",()=>{
  const r=futurePathLeakageGuard({
    predictorFreezeAt:freeze,
    openKnownAt:"2026-10-06T09:00:05+08:00",
    closeKnownAt:"2026-10-06T13:30:05+08:00",
    earlyPathKnownAt:"2026-10-06T09:15:05+08:00"
  });
  assert.equal(r.status,"FUTURE_PATH_NOT_IN_PREDICTOR");
});

t("OA20 suspicious next-open value known before predictor is clock conflict",()=>{
  const r=futurePathLeakageGuard({
    predictorFreezeAt:freeze,
    openKnownAt:"2026-10-05T17:00:00+08:00"
  });
  assert.equal(r.status,"CLOCK_CONFLICT");
  assert.deepEqual(r.fields,["OPEN"]);
});

console.log(`SUMMARY ${pass}/20 PASS`);
