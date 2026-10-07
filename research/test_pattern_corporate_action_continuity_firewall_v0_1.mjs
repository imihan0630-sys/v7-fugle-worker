import assert from "node:assert/strict";
import {
  validateContinuityReceipt,
  classifyRawVsContinuity,
  classifyReferenceProvenance,
  classifyVolumeSemantic,
  buildDualSpaceLineage,
  classifyCorporateActionComparator,
  classifyProviderHistory,
  classifyStructuralVersionAcrossAction
} from "./pattern_corporate_action_continuity_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("CA01 canonical owner plus valid factor passes",()=>{
  const r=validateContinuityReceipt({
    canonicalOwner:"CORPORATE_ACTIONS_LANE",
    firstKnownAt:"2026-10-01T18:00:00+08:00",
    finalScheduleKnownAt:"2026-10-02T18:00:00+08:00",
    effectiveDate:"2026-10-07",
    predictorFreezeAt:"2026-10-07T08:50:00+08:00",
    technicalPriceFactor:0.95,
    factorVersion:"F1",
    replaySafe:true
  });
  assert.equal(r.status,"VALID");
});

t("CA02 noncanonical adjustment owner is blocked",()=>{
  const r=validateContinuityReceipt({
    canonicalOwner:"D01",
    firstKnownAt:"2026-10-01T18:00:00+08:00",
    effectiveDate:"2026-10-07",
    predictorFreezeAt:"2026-10-07T08:50:00+08:00",
    technicalPriceFactor:0.95,
    factorVersion:"F1",
    replaySafe:true
  });
  assert.equal(r.reason,"NONCANONICAL_ADJUSTMENT_OWNER");
});

t("CA03 post-freeze event version cannot backfill",()=>{
  const r=validateContinuityReceipt({
    canonicalOwner:"CORPORATE_ACTIONS_LANE",
    firstKnownAt:"2026-10-07T10:00:00+08:00",
    effectiveDate:"2026-10-07",
    predictorFreezeAt:"2026-10-07T08:50:00+08:00",
    technicalPriceFactor:0.95,
    factorVersion:"F1",
    replaySafe:true
  });
  assert.equal(r.status,"POST_FREEZE_EVENT_VERSION_NOT_ELIGIBLE");
});

t("CA04 invalid/missing factor fails closed",()=>{
  const r=validateContinuityReceipt({
    canonicalOwner:"CORPORATE_ACTIONS_LANE",
    firstKnownAt:"2026-10-01T18:00:00+08:00",
    effectiveDate:"2026-10-07",
    predictorFreezeAt:"2026-10-07T08:50:00+08:00",
    technicalPriceFactor:null,
    factorVersion:"F1",
    replaySafe:true
  });
  assert.equal(r.status,"CORPORATE_ACTION_CONTINUITY_DATA_BLOCKED");
});

t("CA05 raw cross but continuity no-cross is mechanical discontinuity",()=>{
  const r=classifyRawVsContinuity({
    rawGap:-5,continuityGap:0,
    rawCrossesZone:true,continuityCrossesZone:false,
    actionReceiptValid:true
  });
  assert.equal(r.status,"RAW_CROSS_CONTINUITY_NO_CROSS");
  assert.equal(r.semanticInterpretation,"CORPORATE_ACTION_MECHANICAL_DISCONTINUITY");
});

t("CA06 continuity cross remains distinct technical candidate",()=>{
  const r=classifyRawVsContinuity({
    rawGap:0,continuityGap:-2,
    rawCrossesZone:false,continuityCrossesZone:true,
    actionReceiptValid:true
  });
  assert.equal(r.status,"CONTINUITY_CROSS_ONLY");
});

t("CA07 both spaces agreeing on cross is explicit",()=>{
  const r=classifyRawVsContinuity({
    rawGap:-3,continuityGap:-2,
    rawCrossesZone:true,continuityCrossesZone:true,
    actionReceiptValid:true
  });
  assert.equal(r.status,"RAW_AND_CONTINUITY_AGREE_CROSS");
});

t("CA08 invalid action receipt blocks raw-vs-continuity claim",()=>{
  const r=classifyRawVsContinuity({
    rawGap:-5,continuityGap:0,
    rawCrossesZone:true,continuityCrossesZone:false,
    actionReceiptValid:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("CA09 reference fields remain separate",()=>{
  const r=classifyReferenceProvenance({
    previousRawClose:100,
    economicAdjustmentReference:95,
    exchangeOpeningReference:95,
    providerAdjustedAnchor:94.8
  });
  assert.equal(r.status,"REFERENCE_RECEIPTS_PRESERVED");
  assert.equal(r.collapsed,false);
});

t("CA10 reference conflict fails closed",()=>{
  const r=classifyReferenceProvenance({
    previousRawClose:100,
    economicAdjustmentReference:95,
    exchangeOpeningReference:94,
    referenceConflictReasons:["OFFICIAL_ECONOMIC_REFERENCE_MISMATCH"]
  });
  assert.equal(r.status,"REFERENCE_CONFLICT_DATA_BLOCKED");
});

t("CA11 price factor does not automatically transform volume",()=>{
  const r=classifyVolumeSemantic({
    volumeTransformMode:"SUPPLY_CHANGE",
    volumeReceiptVerified:true
  });
  assert.equal(r.priceFactorUsedForVolume,false);
});

t("CA12 unknown volume semantics are data blocked",()=>{
  const r=classifyVolumeSemantic({
    volumeTransformMode:"UNKNOWN",
    volumeReceiptVerified:true
  });
  assert.equal(r.status,"VOLUME_SEMANTIC_DATA_BLOCKED");
});

t("CA13 raw and continuity spaces are one information family",()=>{
  const r=buildDualSpaceLineage({
    rawExecutionPresent:true,
    technicalContinuityPresent:true
  });
  assert.equal(r.rawRepresentationCount,2);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.dualSpaceCreatesIndependentConfirmation,false);
});

t("CA14 four semantic spaces still do not create four votes",()=>{
  const r=buildDualSpaceLineage({
    rawExecutionPresent:true,
    technicalContinuityPresent:true,
    priceIndexComparablePresent:true,
    totalReturnComparablePresent:true
  });
  assert.equal(r.rawRepresentationCount,4);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("CA15 corporate-action at-zone comparator is explicit",()=>{
  assert.equal(
    classifyCorporateActionComparator({atStructuralZone:true,actionContextVerified:true}).status,
    "G1_CORPORATE_ACTION_EVENT_AT_STRUCTURAL_ZONE"
  );
});

t("CA16 corporate-action away-from-zone comparator is explicit",()=>{
  assert.equal(
    classifyCorporateActionComparator({atStructuralZone:false,actionContextVerified:true}).status,
    "G0_CORPORATE_ACTION_EVENT_AWAY_FROM_STRUCTURAL_ZONE"
  );
});

t("CA17 unverified action comparator fails closed",()=>{
  assert.equal(
    classifyCorporateActionComparator({atStructuralZone:true,actionContextVerified:false}).status,
    "UNKNOWN"
  );
});

t("CA18 later-basis provider-adjusted history is replay unsafe",()=>{
  const r=classifyProviderHistory({
    pointInTimeAdjustmentVintageKnown:false,
    providerAdjusted:true,
    laterBasisPossible:true
  });
  assert.equal(r.status,"PROVIDER_ADJUSTED_HISTORY_REPLAY_UNSAFE");
});

t("CA19 PIT-safe provider history remains evaluable",()=>{
  const r=classifyProviderHistory({
    pointInTimeAdjustmentVintageKnown:true,
    providerAdjusted:true,
    laterBasisPossible:false
  });
  assert.equal(r.status,"PROVIDER_HISTORY_REPLAY_EVALUABLE");
});

t("CA20 mechanical reset under same root becomes continuity version, not new root",()=>{
  const r=classifyStructuralVersionAcrossAction({
    sameRootCertified:true,
    mechanicalPriceResetOnly:true,
    continuityReceiptValid:true
  });
  assert.equal(r.status,"CORPORATE_ACTION_CONTINUITY_VERSION");
  assert.equal(r.newIndependentRoot,false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
