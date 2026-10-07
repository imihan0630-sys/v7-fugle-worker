import assert from "node:assert/strict";
import { validateActualHoldingsScreenshotExtractionV0_1 } from "../runtime/actual_holdings_validation_v0_1.mjs";
import { buildActualHoldingsSnapshotV0_1 } from "../runtime/actual_holdings_snapshot_v0_1.mjs";
import { reconcileActualHoldingsSnapshotsV0_1 } from "../runtime/actual_holdings_reconciliation_v0_1.mjs";
import { buildActualHoldingsReadModelV0_1 } from "../runtime/actual_holdings_read_model_v0_1.mjs";

const IMG="a".repeat(64);
function extraction(overrides={}){
  return {
    sourceType:"USER_UPLOADED_BROKER_SCREENSHOT",
    brokerName:"TEST_BROKER",
    accountAlias:"MASKED-A",
    receivedAt:"2026-10-07T06:00:00Z",
    screenshotCapturedAt:"2026-10-07T05:55:00Z",
    sourceImage:{sha256:IMG,referenceId:"chat-upload-1",fileName:"holdings.png"},
    extractionVersion:"CHAT_VISION_V0_1",
    extractionConfidence:0.99,
    rows:[
      {
        symbol:"2330",companyName:"台積電",quantity:"1,000",averageCost:"1000.50",
        marketPrice:"1100",marketValue:"1,100,000",unrealizedPnL:"99500",unrealizedPnLPercent:"9.945",
        currency:"TWD",confidence:{symbol:0.99,quantity:0.99,averageCost:0.99},
      },
      {
        symbol:"2454",companyName:"聯發科",quantity:200,averageCost:1200,
        marketPrice:1250,marketValue:250000,currency:"TWD",
        confidence:{symbol:0.98,quantity:0.99,averageCost:0.98},
      },
    ],
    ...overrides,
  };
}

const validated=validateActualHoldingsScreenshotExtractionV0_1({
  extraction:extraction(),
  symbolNameReference:{"2330":"台積電","2454":"聯發科"},
});
assert.equal(validated.validationState,"VALIDATED_PENDING_CONFIRMATION");
assert.equal(validated.reviewState,"NOT_CONFIRMED");
assert.equal(validated.actualHoldingsWriteEligible,false);
assert.equal(validated.brokerApiUsed,false);
assert.equal(validated.brokerApiAuthorized,false);
assert.equal(validated.realOrdersEnabled,false);
assert.equal(validated.orderRoutingAuthorized,false);

const confirmed={
  reviewState:"CONFIRMED",
  reviewedAt:"2026-10-07T06:03:00Z",
  reviewedBy:"OWNER_CONFIRMED_CHAT_ASSISTED",
  effectiveAsOf:"2026-10-07T05:55:00Z",
  resolvedIssueCodes:[],
  confirmedRows:validated.normalizedRows,
};
const snap1=await buildActualHoldingsSnapshotV0_1({validation:validated,confirmation:confirmed});
assert.equal(snap1.snapshotState,"CONFIRMED_ACTUAL_HOLDINGS");
assert.equal(snap1.rowCount,2);
assert.equal(snap1.actualHoldingsWriteEligible,true);
assert.equal(snap1.sourceType,"USER_UPLOADED_BROKER_SCREENSHOT");
assert.equal(snap1.brokerApiUsed,false);
assert.equal(snap1.realOrdersEnabled,false);
assert.equal(snap1.liveCapitalAuthority,false);
assert.equal(snap1.orderRoutingAuthorized,false);
assert.equal(snap1.reconciliation.summary.NEW_POSITION,2);

const snap1Repeat=await buildActualHoldingsSnapshotV0_1({validation:validated,confirmation:confirmed});
assert.equal(snap1Repeat.snapshotId,snap1.snapshotId);
assert.equal(snap1Repeat.idempotencyKey,snap1.idempotencyKey);
assert.equal(snap1Repeat.snapshotHash,snap1.snapshotHash);

const low=validateActualHoldingsScreenshotExtractionV0_1({
  extraction:extraction({
    extractionConfidence:0.82,
    screenshotCapturedAt:null,
    rows:[{
      symbol:"2330",companyName:"台積電",quantity:"1,000",averageCost:"1,000.50",
      currency:"TWD",confidence:{symbol:0.80,quantity:0.99,averageCost:0.70},
      ambiguityFlags:["AVERAGE_COST_DIGIT_UNCLEAR"],
    }],
  }),
});
assert.equal(low.validationState,"REVIEW_REQUIRED");
assert.ok(low.reviewIssueCodes.includes("SCREENSHOT_ASOF_UNKNOWN"));
assert.ok(low.reviewIssueCodes.includes("CORE_FIELD_LOW_CONFIDENCE"));
await assert.rejects(
  ()=>buildActualHoldingsSnapshotV0_1({
    validation:low,
    confirmation:{
      reviewState:"CONFIRMED",reviewedAt:"2026-10-07T06:05:00Z",
      reviewedBy:"OWNER",effectiveAsOf:"2026-10-07T05:55:00Z",
      resolvedIssueCodes:[],
      confirmedRows:[{symbol:"2330",companyName:"台積電",quantity:1000,averageCost:1000.5,currency:"TWD"}],
    },
  }),
  /unresolved validation issues/,
);

const lowResolved=await buildActualHoldingsSnapshotV0_1({
  validation:low,
  confirmation:{
    reviewState:"CONFIRMED",reviewedAt:"2026-10-07T06:05:00Z",
    reviewedBy:"OWNER",effectiveAsOf:"2026-10-07T05:55:00Z",
    resolvedIssueCodes:low.reviewIssueCodes,
    confirmedRows:[{symbol:"2330",companyName:"台積電",quantity:1000,averageCost:1000.5,currency:"TWD"}],
  },
});
assert.equal(lowResolved.rowCount,1);

const forbidden=validateActualHoldingsScreenshotExtractionV0_1({
  extraction:extraction({sourceType:"BROKER_API"}),
});
assert.equal(forbidden.validationState,"REJECTED");
assert.ok(forbidden.blockingIssueCodes.includes("SOURCE_NOT_AUTHORIZED"));
await assert.rejects(
  ()=>buildActualHoldingsSnapshotV0_1({validation:forbidden,confirmation:confirmed}),
  /source is not authorized|rejected extraction/,
);

const val2=validateActualHoldingsScreenshotExtractionV0_1({
  extraction:extraction({
    receivedAt:"2026-10-07T07:00:00Z",
    screenshotCapturedAt:"2026-10-07T06:55:00Z",
    sourceImage:{sha256:"b".repeat(64),referenceId:"chat-upload-2"},
    rows:[
      {symbol:"2330",companyName:"台積電",quantity:1200,averageCost:1010,currency:"TWD",confidence:{symbol:.99,quantity:.99,averageCost:.99}},
      {symbol:"2317",companyName:"鴻海",quantity:500,averageCost:210,currency:"TWD",confidence:{symbol:.99,quantity:.99,averageCost:.99}},
    ],
  }),
});
const snap2=await buildActualHoldingsSnapshotV0_1({
  validation:val2,
  previousSnapshot:snap1,
  confirmation:{
    reviewState:"CONFIRMED",reviewedAt:"2026-10-07T07:02:00Z",
    reviewedBy:"OWNER",effectiveAsOf:"2026-10-07T06:55:00Z",
    resolvedIssueCodes:[],
    confirmedRows:val2.normalizedRows,
  },
});
const e2330=snap2.reconciliation.events.find(x=>x.symbol==="2330");
const e2454=snap2.reconciliation.events.find(x=>x.symbol==="2454");
const e2317=snap2.reconciliation.events.find(x=>x.symbol==="2317");
assert.ok(e2330.eventTypes.includes("INCREASED"));
assert.ok(e2330.eventTypes.includes("QUANTITY_CHANGED"));
assert.ok(e2330.eventTypes.includes("AVG_COST_CHANGED"));
assert.ok(e2454.eventTypes.includes("CLOSED"));
assert.ok(e2317.eventTypes.includes("NEW_POSITION"));
assert.equal(e2330.tradeInference,"NOT_INFERRED");
assert.equal(e2330.explanation.exactTradePrice,null);
assert.equal(e2330.explanation.exactTradeTime,null);
assert.equal(e2330.explanation.orderId,null);

const corp=await reconcileActualHoldingsSnapshotsV0_1({
  previousSnapshot:{snapshotId:"P",holdings:[{symbol:"9999",quantity:100,averageCost:100,validationState:"CONFIRMED"}]},
  currentSnapshot:{snapshotId:"C",holdings:[{symbol:"9999",quantity:200,averageCost:50,validationState:"CONFIRMED"}]},
});
const ce=corp.events[0];
assert.ok(ce.eventTypes.includes("POSSIBLE_CORPORATE_ACTION"));
assert.ok(ce.eventTypes.includes("REVIEW_REQUIRED"));
assert.equal(ce.tradeInference,"NOT_INFERRED");

const emptyModel=buildActualHoldingsReadModelV0_1();
assert.equal(emptyModel.state,"NO_VERIFIED_ACTUAL_HOLDINGS_SNAPSHOT");
assert.equal(emptyModel.actualPositionMonitorVerified,false);
assert.equal(emptyModel.sourceType,"USER_UPLOADED_BROKER_SCREENSHOT");
assert.equal(emptyModel.realOrdersEnabled,false);

const model=buildActualHoldingsReadModelV0_1({snapshot:snap2});
assert.equal(model.state,"ACTUAL_HOLDINGS_SNAPSHOT_VERIFIED");
assert.equal(model.actualHoldingsAvailable,true);
assert.equal(model.actualPositionMonitorVerified,true);
assert.equal(model.holdingsCount,2);
assert.equal(model.boardSeparation.virtualPositionsMayBeRelabeledActual,false);
assert.equal(model.boardSeparation.simulatedFillsMayCreateActualOwnership,false);
assert.equal(model.orderRoutingAuthorized,false);

console.log("System2 actual holdings screenshot import V0.1 tests PASS");
