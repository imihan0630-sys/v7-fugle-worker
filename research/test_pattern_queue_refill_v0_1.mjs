import assert from "node:assert/strict";
import {
  classifyBookRefillTiming,
  buildRefillDescriptor,
  classifyRefillMechanism,
  buildBookInformationLineage
} from "./pattern_queue_refill_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const freeze="2026-10-06T10:00:00+08:00";
const opp="2026-10-06T10:01:00+08:00";

t("QR01 post-freeze refill cannot enter baseline",()=>{
  const r=classifyBookRefillTiming({
    predictorFreezeAt:freeze,structuralOpportunityAt:opp,
    preShockBookAt:"2026-10-06T09:58:00+08:00",
    refillMeasuredAt:"2026-10-06T10:03:00+08:00"
  });
  assert.equal(r.status,"REFILL_POST_FREEZE");
  assert.equal(r.baselineEligible,false);
});

t("QR02 future pre-shock book receipt is invalid",()=>{
  const r=classifyBookRefillTiming({
    predictorFreezeAt:freeze,structuralOpportunityAt:opp,
    preShockBookAt:"2026-10-06T10:02:00+08:00"
  });
  assert.equal(r.status,"UNKNOWN");
});

t("QR03 valid refill fraction is descriptive only",()=>{
  const r=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:200,refillDepth:800,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.refillFractionOfPreShockDepth,0.8);
  assert.equal(r.refillEqualsStructuralDefense,false);
});

t("QR04 zone coincidence is explicit but not proof",()=>{
  const r=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:200,refillDepth:800,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true
  });
  assert.equal(r.refillInsideStructuralZone,true);
  assert.equal(r.independentVoteAllowed,false);
});

t("QR05 refill outside zone remains generic context",()=>{
  const r=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:700,refillPrice:108,
    zone:{lower:100,upper:102},quoteFresh:true
  });
  assert.equal(r.refillInsideStructuralZone,false);
});

t("QR06 stale quote blocks depth interpretation",()=>{
  const r=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:700,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("QR07 visible depth is not latent liquidity",()=>{
  const r=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:700,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true
  });
  assert.equal(r.displayedDepthIsLatentLiquidity,false);
});

t("QR08 fleeting refill is not structural defense",()=>{
  const d=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:900,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true
  });
  const r=classifyRefillMechanism({descriptor:d,stableDisplayed:false,executionObserved:false,matchedGenericRefillAvailable:true});
  assert.equal(r.status,"REFILL_VISIBLE_FLEETING_CONTEXT");
  assert.equal(r.structuralClaimAllowed,false);
});

t("QR09 executed interaction still does not prove structural memory",()=>{
  const d=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:900,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true
  });
  const r=classifyRefillMechanism({descriptor:d,stableDisplayed:true,executionObserved:true,matchedGenericRefillAvailable:true});
  assert.equal(r.status,"REFILL_EXECUTION_INTERACTION_OBSERVED");
  assert.equal(r.structuralClaimAllowed,false);
});

t("QR10 generic matched refill control is mandatory",()=>{
  const d=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:900,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true
  });
  const r=classifyRefillMechanism({descriptor:d,stableDisplayed:true,executionObserved:false,matchedGenericRefillAvailable:false});
  assert.equal(r.status,"GENERIC_CONTROL_MISSING");
});

t("QR11 stable refill remains context only",()=>{
  const d=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:900,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true
  });
  const r=classifyRefillMechanism({descriptor:d,stableDisplayed:true,executionObserved:false,matchedGenericRefillAvailable:true});
  assert.equal(r.status,"REFILL_VISIBLE_STABLE_CONTEXT");
  assert.equal(r.structuralClaimAllowed,false);
});

t("QR12 cancellation state is preserved",()=>{
  const r=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:900,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true,cancellationState:"CANCELLED_AFTER_REFILL"
  });
  assert.equal(r.cancellationState,"CANCELLED_AFTER_REFILL");
});

t("QR13 execution state is preserved separately from display",()=>{
  const r=buildRefillDescriptor({
    preShockDepth:1000,depletedDepth:100,refillDepth:900,refillPrice:101,
    zone:{lower:100,upper:102},quoteFresh:true,executionState:"TRADES_OBSERVED"
  });
  assert.equal(r.executionAtRefillPriceState,"TRADES_OBSERVED");
});

t("QR14 live book plus price remains one default effective evidence count",()=>{
  const r=buildBookInformationLineage();
  assert.deepEqual(r.informationRoots,["PRICE_OHLC","LIVE_ORDER_BOOK"]);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("QR15 book context is never an automatic independent vote",()=>{
  const r=buildBookInformationLineage();
  assert.equal(r.independentVoteAllowed,false);
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("QR16 outcome join remains closed",()=>{
  const r=buildBookInformationLineage();
  assert.equal(r.outcomeJoinAllowed,false);
});

console.log(`SUMMARY ${pass}/16 PASS`);
