import assert from "node:assert/strict";
import {mechanismEvidenceCeiling,auditMechanismClaim} from "./pattern_repeated_test_mechanisms_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("RM01 price only stops at path description",()=>{
 const r=mechanismEvidenceCeiling({hasPriceHistory:true});
 assert.equal(r.level,"L0_PRICE_HISTORY");
});

t("RM02 price volume reaches proxy not direct orderbook",()=>{
 const r=mechanismEvidenceCeiling({hasPriceHistory:true,hasPriceVolume:true});
 assert.equal(r.maxInterpretation,"PRICE_VOLUME_MECHANISM_PROXY");
});

t("RM03 microstructure reaches diagnostic ceiling",()=>{
 const r=mechanismEvidenceCeiling({hasPriceHistory:true,hasPriceVolume:true,hasMicrostructure:true});
 assert.equal(r.level,"L2_MICROSTRUCTURE");
});

t("RM04 no layer gives unknown",()=>{
 assert.equal(mechanismEvidenceCeiling({}).maxInterpretation,"UNKNOWN");
});

t("RM05 price-only liquidity depletion claim rejected",()=>{
 const r=auditMechanismClaim({claim:"RESTING_LIQUIDITY_DEPLETED",evidenceLevel:"L0_PRICE_HISTORY"});
 assert.equal(r.status,"REJECTED");
});

t("RM06 price-volume queue replenishment claim rejected",()=>{
 const r=auditMechanismClaim({claim:"ORDER_QUEUE_REPLENISHED",evidenceLevel:"L1_PRICE_VOLUME"});
 assert.equal(r.status,"REJECTED");
});

t("RM07 L2 direct claim allowed only as diagnostic",()=>{
 const r=auditMechanismClaim({claim:"RESTING_LIQUIDITY_DEPLETED",evidenceLevel:"L2_MICROSTRUCTURE"});
 assert.equal(r.status,"ALLOWED_AS_DESCRIPTIVE_CANDIDATE");
 assert.equal(r.independentVoteEligible,false);
});

t("RM08 path mechanism claim gets no universal sign",()=>{
 const r=auditMechanismClaim({claim:"DEPLETION_COMPATIBLE_PRICE_PATH",evidenceLevel:"L0_PRICE_HISTORY"});
 assert.equal(r.universalDirectionalSignAuthorized,false);
});

console.log(`SUMMARY ${pass}/8 PASS`);
