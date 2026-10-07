import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { validateActualHoldingsScreenshotExtractionV0_1 } from "../runtime/actual_holdings_validation_v0_1.mjs";
import { buildActualHoldingsSnapshotV0_1 } from "../runtime/actual_holdings_snapshot_v0_1.mjs";
import { buildActualHoldingsReadModelV0_1 } from "../runtime/actual_holdings_read_model_v0_1.mjs";

const baseExtraction={
  sourceType:"USER_UPLOADED_BROKER_SCREENSHOT",
  brokerName:"SYNTHETIC_BROKER",
  accountAlias:"MASKED-SYNTHETIC",
  receivedAt:"2026-10-07T07:00:00Z",
  screenshotCapturedAt:"2026-10-07T06:58:00Z",
  sourceImage:{sha256:"d".repeat(64),referenceId:"SYNTHETIC_FIXTURE_ONLY"},
  extractionVersion:"CHAT_VISION_CONTRACT_FIXTURE_V0_1",
  extractionConfidence:0.99,
  rows:[
    {symbol:"2330",companyName:"台積電",quantity:1000,averageCost:1000,currency:"TWD",confidence:{symbol:.99,quantity:.99,averageCost:.99}},
    {symbol:"2454",companyName:"聯發科",quantity:200,averageCost:1200,currency:"TWD",confidence:{symbol:.99,quantity:.99,averageCost:.99}},
  ],
};

const validation=validateActualHoldingsScreenshotExtractionV0_1({
  extraction:baseExtraction,
  symbolNameReference:{"2330":"台積電","2454":"聯發科"},
});
assert.equal(validation.validationState,"VALIDATED_PENDING_CONFIRMATION");
assert.equal(validation.actualHoldingsWriteEligible,false);

const confirmation={
  reviewState:"CONFIRMED",
  reviewedAt:"2026-10-07T07:02:00Z",
  reviewedBy:"SYNTHETIC_OWNER_CONFIRMATION_FIXTURE",
  effectiveAsOf:"2026-10-07T06:58:00Z",
  resolvedIssueCodes:validation.reviewIssueCodes,
  confirmedRows:validation.normalizedRows,
};
const first=await buildActualHoldingsSnapshotV0_1({validation,confirmation});
const repeat=await buildActualHoldingsSnapshotV0_1({validation,confirmation});
assert.equal(first.snapshotId,repeat.snapshotId);
assert.equal(first.idempotencyKey,repeat.idempotencyKey);

const secondValidation=validateActualHoldingsScreenshotExtractionV0_1({
  extraction:{
    ...baseExtraction,
    receivedAt:"2026-10-07T08:00:00Z",
    screenshotCapturedAt:"2026-10-07T07:58:00Z",
    sourceImage:{sha256:"e".repeat(64),referenceId:"SYNTHETIC_FIXTURE_2"},
    rows:[
      {symbol:"2330",companyName:"台積電",quantity:800,averageCost:1000,currency:"TWD",confidence:{symbol:.99,quantity:.99,averageCost:.99}},
      {symbol:"2317",companyName:"鴻海",quantity:500,averageCost:210,currency:"TWD",confidence:{symbol:.99,quantity:.99,averageCost:.99}},
    ],
  },
  symbolNameReference:{"2330":"台積電","2317":"鴻海"},
});
const second=await buildActualHoldingsSnapshotV0_1({
  validation:secondValidation,
  previousSnapshot:first,
  confirmation:{
    reviewState:"CONFIRMED",
    reviewedAt:"2026-10-07T08:02:00Z",
    reviewedBy:"SYNTHETIC_OWNER_CONFIRMATION_FIXTURE",
    effectiveAsOf:"2026-10-07T07:58:00Z",
    resolvedIssueCodes:secondValidation.reviewIssueCodes,
    confirmedRows:secondValidation.normalizedRows,
  },
});
assert.equal(second.previousSnapshotId,first.snapshotId);
assert.ok(second.reconciliation.events.some(x=>x.symbol==="2330"&&x.eventTypes.includes("REDUCED")));
assert.ok(second.reconciliation.events.some(x=>x.symbol==="2454"&&x.eventTypes.includes("CLOSED")));
assert.ok(second.reconciliation.events.some(x=>x.symbol==="2317"&&x.eventTypes.includes("NEW_POSITION")));
assert.ok(second.reconciliation.events.every(x=>x.tradeInference==="NOT_INFERRED"));

const low=validateActualHoldingsScreenshotExtractionV0_1({
  extraction:{
    ...baseExtraction,
    extractionConfidence:.70,
    screenshotCapturedAt:null,
    sourceImage:{sha256:"f".repeat(64),referenceId:"SYNTHETIC_LOW_CONFIDENCE"},
    rows:[{
      symbol:"2330",companyName:"台積電",quantity:"1,000",averageCost:"1,0O0.5",
      currency:"TWD",confidence:{symbol:.70,quantity:.75,averageCost:.40},
      ambiguityFlags:["AVERAGE_COST_GLYPH_AMBIGUOUS"],
    }],
  },
});
assert.equal(low.validationState,"REVIEW_REQUIRED");
assert.equal(low.actualHoldingsWriteEligible,false);
assert.ok(low.reviewIssueCodes.includes("SCREENSHOT_ASOF_UNKNOWN"));
assert.ok(low.reviewIssueCodes.includes("CORE_FIELD_LOW_CONFIDENCE"));

const forbidden=validateActualHoldingsScreenshotExtractionV0_1({
  extraction:{...baseExtraction,sourceType:"BROKER_API"},
});
assert.equal(forbidden.validationState,"REJECTED");
assert.ok(forbidden.blockingIssueCodes.includes("SOURCE_NOT_AUTHORIZED"));

const readModel=buildActualHoldingsReadModelV0_1({snapshot:second});
assert.equal(readModel.state,"ACTUAL_HOLDINGS_SNAPSHOT_VERIFIED");
assert.equal(readModel.sourceType,"USER_UPLOADED_BROKER_SCREENSHOT");
assert.equal(readModel.boardSeparation.virtualPositionsMayBeRelabeledActual,false);
assert.equal(readModel.realOrdersEnabled,false);
assert.equal(readModel.brokerApiAuthorized,false);
assert.equal(readModel.orderRoutingAuthorized,false);

const artifact={
  schemaVersion:"S2_ACTUAL_HOLDINGS_SCREENSHOT_IMPORT_V0_1_PHYSICAL_CONTRACT_EVIDENCE",
  recordedDate:"2026-10-07",
  evidenceClass:"SYNTHETIC_CONTRACT_AND_FAIL_CLOSED_PROOF",
  ownerSourceDecision:"USER_UPLOADED_BROKER_SCREENSHOT",
  implementation:{
    structuredExtractionContract:true,
    deterministicValidation:true,
    explicitConfirmationRequired:true,
    immutableSnapshotIdentity:true,
    idempotencyProven:true,
    reconciliationProven:true,
    readModelSeparationProven:true,
  },
  positiveFixture:{
    firstSnapshotId:first.snapshotId,
    repeatedSnapshotId:repeat.snapshotId,
    sameSnapshotIdentity:first.snapshotId===repeat.snapshotId,
    secondSnapshotId:second.snapshotId,
    previousSnapshotId:second.previousSnapshotId,
    reconciliationSummary:second.reconciliation.summary,
  },
  negativeFixture:{
    lowConfidenceState:low.validationState,
    lowConfidenceIssueCodes:low.reviewIssueCodes,
    forbiddenSourceState:forbidden.validationState,
    forbiddenSourceIssueCodes:forbidden.blockingIssueCodes,
  },
  authority:{
    realOwnerScreenshotUsed:false,
    actualOwnerSnapshotImported:false,
    actualPositionMonitorVerified:false,
    ocrEngineBuilt:false,
    brokerApiUsed:false,
    brokerApiAuthorized:false,
    brokerTokenRequired:false,
    brokerCertificateRequired:false,
    realOrdersEnabled:false,
    liveCapitalAuthority:false,
    orderRoutingAuthorized:false,
    system1HoldingsImported:false,
    system1RuntimeUsed:false,
    formalCoreImpact:false,
  },
  nextPhysicalGate:"FIRST_REAL_OWNER_SCREENSHOT_CONFIRM_PERSIST_READBACK",
};
await writeFile(
  "/tmp/S2_ACTUAL_HOLDINGS_SCREENSHOT_IMPORT_V0_1_PHYSICAL_20261007.json",
  JSON.stringify(artifact,null,2)+"\n",
  "utf8",
);
console.log(JSON.stringify({
  result:"S2_ACTUAL_HOLDINGS_SCREENSHOT_IMPORT_V0_1_CONTRACT_PASS",
  sourceType:artifact.ownerSourceDecision,
  idempotency:artifact.positiveFixture.sameSnapshotIdentity,
  reconciliationSummary:artifact.positiveFixture.reconciliationSummary,
  lowConfidenceState:artifact.negativeFixture.lowConfidenceState,
  forbiddenSourceState:artifact.negativeFixture.forbiddenSourceState,
  actualOwnerSnapshotImported:false,
  actualPositionMonitorVerified:false,
  brokerApiAuthorized:false,
  realOrdersEnabled:false,
  nextGate:artifact.nextPhysicalGate,
},null,2));
