import assert from "node:assert/strict";
import {
  buildScaleMigrationSnapshot,
  classifyContextEvaluability,
  classifyCommonSupport
} from "./pattern_regime_scale_migration_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const boundary={lower:100,upper:104};
const semanticSpaceReceipt={
  verified:true,
  formationSpace:"TECHNICAL_CONTINUITY",
  currentSpace:"TECHNICAL_CONTINUITY"
};
const formation={
  asOf:"2026-09-01",
  referencePrice:102,
  atr:2,
  normalizedVolatility:0.02,
  relativeTick:0.001,
  volatilityRegime:"LOW",
  marketRegime:"R1",
  sectorRegime:"S1",
  liquidityState:"L1",
  ownerReceiptVerified:true,
  ownerVersion:"CTX-V1"
};
const current={
  asOf:"2026-10-01",
  referencePrice:110,
  atr:8,
  normalizedVolatility:0.06,
  relativeTick:0.002,
  volatilityRegime:"HIGH",
  marketRegime:"R2",
  sectorRegime:"S2",
  liquidityState:"L2",
  ownerReceiptVerified:true,
  ownerVersion:"CTX-V1"
};

t("SM01 frozen price boundary never mutates under scale normalization",()=>{
  const r=buildScaleMigrationSnapshot({boundary,formation,current,semanticSpaceReceipt});
  assert.deepEqual(r.frozenBoundary,boundary);
  assert.equal(r.boundaryMutated,false);
});

t("SM02 same frozen width changes meaning in ATR units",()=>{
  const r=buildScaleMigrationSnapshot({boundary,formation,current,semanticSpaceReceipt});
  assert.equal(r.zoneWidthPrice,4);
  assert.equal(r.formationZoneWidthAtr,2);
  assert.equal(r.currentZoneWidthAtr,0.5);
});

t("SM03 normalized volatility migration is descriptive not identity-changing",()=>{
  const r=buildScaleMigrationSnapshot({boundary,formation,current,semanticSpaceReceipt});
  assert.equal(r.volatilityScaleRatio,3);
  assert.equal(r.boundaryMutated,false);
});

t("SM04 regime migration does not reset age clocks",()=>{
  const r=buildScaleMigrationSnapshot({boundary,formation,current,semanticSpaceReceipt});
  assert.equal(r.regimeChangeResetsRootAge,false);
  assert.equal(r.regimeChangeResetsVersionAge,false);
});

t("SM05 unresolved continuity blocks scale migration analysis",()=>{
  const r=buildScaleMigrationSnapshot({
    boundary,formation,current,
    semanticSpaceReceipt:{...semanticSpaceReceipt,verified:false}
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("SM06 current price scale changes percentage width without rewriting zone",()=>{
  const r=buildScaleMigrationSnapshot({boundary,formation,current,semanticSpaceReceipt});
  assert.equal(r.formationZoneWidthPct,4/102);
  assert.equal(r.currentZoneWidthPct,4/110);
  assert.deepEqual(r.frozenBoundary,boundary);
});

t("SM07 relative tick migration remains a descriptor",()=>{
  const r=buildScaleMigrationSnapshot({boundary,formation,current,semanticSpaceReceipt});
  assert.equal(r.relativeTickRatio,2);
  assert.equal(r.boundaryMutated,false);
});

t("SM08 future formation context is rejected",()=>{
  const r=buildScaleMigrationSnapshot({
    boundary,
    formation:{...formation,asOf:"2026-11-01"},
    current,
    semanticSpaceReceipt
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"FUTURE_FORMATION_CONTEXT");
});

t("SM09 owner context receipts must be verified",()=>{
  const r=classifyContextEvaluability({
    formation:{...formation,ownerReceiptVerified:false},
    current
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"OWNER_CONTEXT_RECEIPT_UNVERIFIED");
});

t("SM10 owner taxonomy version mismatch is fail-closed",()=>{
  const r=classifyContextEvaluability({
    formation,
    current:{...current,ownerVersion:"CTX-V2"}
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"OWNER_CONTEXT_VERSION_MISMATCH");
});

t("SM11 common support requires all frozen dimensions",()=>{
  const r=classifyCommonSupport({
    ageOverlap:true,
    volatilityOverlap:true,
    liquidityOverlap:true,
    tickOverlap:true,
    regimeOverlap:true,
    interactionHistoryOverlap:true
  });
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

t("SM12 any explicit support failure prohibits extrapolation",()=>{
  const r=classifyCommonSupport({
    ageOverlap:true,
    volatilityOverlap:false,
    liquidityOverlap:true,
    tickOverlap:true,
    regimeOverlap:true,
    interactionHistoryOverlap:true
  });
  assert.equal(r.status,"EXTRAPOLATION_PROHIBITED");
});

t("SM13 incomplete common-support evidence is UNKNOWN",()=>{
  const r=classifyCommonSupport({
    ageOverlap:true,
    volatilityOverlap:true,
    liquidityOverlap:true,
    tickOverlap:true,
    regimeOverlap:null,
    interactionHistoryOverlap:true
  });
  assert.equal(r.status,"UNKNOWN");
});

t("SM14 no outcome field or adaptive rescue boundary is created",()=>{
  const r=buildScaleMigrationSnapshot({boundary,formation,current,semanticSpaceReceipt});
  assert.equal(r.outcomeJoinAllowed,false);
  assert.equal("adaptiveBoundary" in r,false);
});

console.log(`SUMMARY ${pass}/14 PASS`);
