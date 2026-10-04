import assert from "node:assert/strict";
import {
  D19_FACTOR_RECEIPT_VERSION_V0_1,
  buildD19UniverseReceiptV0_1,
  buildD19ReturnReceiptV0_1,
  buildD19FactorInputReceiptV0_1,
  buildD19NeutralizationReceiptV0_1,
  buildD19CostReceiptV0_1,
  buildD19ReplayReceiptV0_1,
} from "../runtime/d19_factor_receipt_adapter_v0_1.mjs";

const marketDate = "2026-08-31";
const decisionTimestamp = "2026-08-31T05:40:00Z";
const capturedAtA = "2026-10-04T00:30:00Z";
const capturedAtB = "2026-10-04T00:31:00Z";

const members = [
  {
    market: "TWSE",
    symbol: "2330",
    membershipId: "MEM-2330",
    membershipHash: "MH-2330",
    replayEligible: true,
    industry: "半導體",
  },
  {
    market: "TWSE",
    symbol: "2454",
    membershipId: "MEM-2454",
    membershipHash: "MH-2454",
    replayEligible: true,
    industry: "半導體",
  },
];

const universeA = await buildD19UniverseReceiptV0_1({
  runId: "D19-SMOKE-001",
  marketDate,
  decisionTimestamp,
  registryId: "REG-20260831",
  members,
  capturedAt: capturedAtA,
});
const universeB = await buildD19UniverseReceiptV0_1({
  runId: "D19-SMOKE-001",
  marketDate,
  decisionTimestamp,
  registryId: "REG-20260831",
  members: [...members].reverse(),
  capturedAt: capturedAtB,
});
assert.equal(universeA.state, "READY");
assert.equal(universeA.receiptHash, universeB.receiptHash);
assert.notEqual(universeA.capturedAt, universeB.capturedAt);
assert.equal(universeA.formalSelectionAuthorized, false);

await assert.rejects(
  () => buildD19UniverseReceiptV0_1({
    runId: "D19-DUPLICATE",
    marketDate,
    decisionTimestamp,
    registryId: "REG-DUPLICATE",
    members: [members[0], members[0]],
    capturedAt: capturedAtA,
  }),
  /duplicate universe member/,
);

const return2330 = await buildD19ReturnReceiptV0_1({
  runId: "D19-SMOKE-001",
  factorId: "D19-04",
  symbol: "2330",
  market: "TWSE",
  marketDate,
  decisionTimestamp,
  inputBarHashes: ["BAR-2330-20260803", "BAR-2330-20260831"],
  continuityPolicyVersion: "RAW_CONTINUITY_UNVERIFIED_V0_1",
  corporateActionPolicyVersion: "NO_BACKFILL_V0_1",
  returnDefinition: "CLOSE_T_MINUS_20_TO_CLOSE_T",
  returnValue: 0.08,
  capturedAt: capturedAtA,
});
const return2454 = await buildD19ReturnReceiptV0_1({
  runId: "D19-SMOKE-001",
  factorId: "D19-04",
  symbol: "2454",
  market: "TWSE",
  marketDate,
  decisionTimestamp,
  inputBarHashes: ["BAR-2454-20260803", "BAR-2454-20260831"],
  continuityPolicyVersion: "RAW_CONTINUITY_UNVERIFIED_V0_1",
  corporateActionPolicyVersion: "NO_BACKFILL_V0_1",
  returnDefinition: "CLOSE_T_MINUS_20_TO_CLOSE_T",
  returnValue: 0.03,
  capturedAt: capturedAtA,
});

const factorInput2330 = await buildD19FactorInputReceiptV0_1({
  runId: "D19-SMOKE-001",
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_SMOKE_V0_1",
  scope: "SYMBOL",
  scopeKey: "TWSE|2330",
  marketDate,
  decisionTimestamp,
  inputs: [{
    inputId: "RAW_RETURN_20S",
    inputVersion: "V0_1",
    required: true,
    state: "KNOWN",
    valueHash: return2330.receiptHash,
    sourceId: "SYSTEM2_PIT_REPLAY",
    payloadHash: "PAYLOAD-2330",
    observedAt: "2026-10-04T00:00:00Z",
    availableAt: "2026-08-31T05:30:00Z",
  }],
  capturedAt: capturedAtA,
});
const factorInput2454 = await buildD19FactorInputReceiptV0_1({
  runId: "D19-SMOKE-001",
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_SMOKE_V0_1",
  scope: "SYMBOL",
  scopeKey: "TWSE|2454",
  marketDate,
  decisionTimestamp,
  inputs: [{
    inputId: "RAW_RETURN_20S",
    inputVersion: "V0_1",
    required: true,
    state: "KNOWN",
    valueHash: return2454.receiptHash,
    sourceId: "SYSTEM2_PIT_REPLAY",
    payloadHash: "PAYLOAD-2454",
    observedAt: "2026-10-04T00:00:00Z",
    availableAt: "2026-08-31T05:30:00Z",
  }],
  capturedAt: capturedAtA,
});
assert.equal(factorInput2330.state, "READY");

await assert.rejects(
  () => buildD19FactorInputReceiptV0_1({
    runId: "D19-FUTURE-INPUT",
    factorId: "D19-04",
    factorVersion: "V0_1",
    scope: "SYMBOL",
    scopeKey: "TWSE|2330",
    marketDate,
    decisionTimestamp,
    inputs: [{
      inputId: "FUTURE",
      inputVersion: "V0_1",
      required: true,
      state: "KNOWN",
      sourceId: "TEST",
      availableAt: "2026-09-01T05:30:00Z",
    }],
    capturedAt: capturedAtA,
  }),
  /after decisionTimestamp/,
);

const incompleteInput = await buildD19FactorInputReceiptV0_1({
  runId: "D19-UNKNOWN-INPUT",
  factorId: "D19-04",
  factorVersion: "V0_1",
  scope: "SYMBOL",
  scopeKey: "TWSE|2330",
  marketDate,
  decisionTimestamp,
  inputs: [{
    inputId: "INDUSTRY_VINTAGE",
    inputVersion: "V0_1",
    required: true,
    state: "UNKNOWN",
    sourceId: "HISTORICAL_INDUSTRY_SOURCE",
    unknownReason: "HISTORICAL_INDUSTRY_VINTAGE_NOT_AVAILABLE",
  }],
  capturedAt: capturedAtA,
});
assert.equal(incompleteInput.state, "INCOMPLETE");

const neutralization = await buildD19NeutralizationReceiptV0_1({
  runId: "D19-SMOKE-001",
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_SMOKE_V0_1",
  marketDate,
  decisionTimestamp,
  factorSetId: "D19-04-MARKET-CENTERING",
  factorSetVersion: "V0_1",
  method: "WITHIN_MARKET_DEMEAN",
  benchmarkVintageHash: "BENCHMARK-NOT-USED-IN-THIS-TRANSFORM",
  industryVintageHash: null,
  estimationWindow: "2026-08-03/2026-08-31",
  validSampleCount: 2,
  transformMetadata: { market: "TWSE", center: 0.055 },
  residualHash: "RESIDUAL-OUTPUT-HASH",
  warnings: ["INDUSTRY_NEUTRALIZATION_NOT_YET_PROVEN"],
  capturedAt: capturedAtA,
});
assert.equal(neutralization.state, "READY");

const modeledCost = await buildD19CostReceiptV0_1({
  runId: "D19-SMOKE-001",
  marketDate,
  decisionTimestamp,
  scenarioId: "D19_RESEARCH_MODELED_COST",
  scenarioVersion: "V0_1",
  turnoverDefinition: "ONE_WAY_FORMATION_TURNOVER",
  components: [
    {
      componentId: "COMMISSION",
      componentVersion: "MODELED_EXPLICIT_V0_1",
      quality: "MODELED",
      rate: 0.001425,
      sourceId: "D14_MODELED_COST_CONTRACT",
      sourceVersion: "D14_RESEARCH_ONLY",
      sourceHash: "D14-COMMISSION-CONTRACT-HASH",
    },
    {
      componentId: "SELL_TRANSACTION_TAX",
      componentVersion: "ORDINARY_STOCK_V0_1",
      quality: "MODELED",
      rate: 0.003,
      sourceId: "D14_TAX_PROVENANCE_CONTRACT",
      sourceVersion: "D14_RESEARCH_ONLY",
      sourceHash: "D14-TAX-CONTRACT-HASH",
    },
    {
      componentId: "SLIPPAGE",
      componentVersion: "ZERO_ONLY_FOR_TRANSPORT_SMOKE_V0_1",
      quality: "MODELED",
      rate: 0,
      sourceId: "D19_ENGINEERING_SMOKE_ONLY",
      sourceVersion: "V0_1",
      sourceHash: "SMOKE-NOT-ALPHA-EVIDENCE",
    },
  ],
  shortLegRequired: false,
  borrowabilityState: "NOT_APPLICABLE",
  capturedAt: capturedAtA,
});
assert.equal(modeledCost.state, "READY");

const replayA = await buildD19ReplayReceiptV0_1({
  runId: "D19-SMOKE-001",
  marketDate,
  decisionTimestamp,
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_SMOKE_V0_1",
  universeReceipt: universeA,
  returnReceipts: [return2330, return2454],
  factorInputReceipts: [factorInput2330, factorInput2454],
  neutralizationReceipt: neutralization,
  costReceipt: modeledCost,
  outputHash: "D19-04-SMOKE-OUTPUT",
  codeVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
  capturedAt: capturedAtA,
});
const replayB = await buildD19ReplayReceiptV0_1({
  runId: "D19-SMOKE-001",
  marketDate,
  decisionTimestamp,
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_SMOKE_V0_1",
  universeReceipt: universeB,
  returnReceipts: [return2454, return2330],
  factorInputReceipts: [factorInput2454, factorInput2330],
  neutralizationReceipt: neutralization,
  costReceipt: modeledCost,
  outputHash: "D19-04-SMOKE-OUTPUT",
  codeVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
  capturedAt: capturedAtB,
});
assert.equal(replayA.state, "READY");
assert.equal(replayA.l3DataFeasibilityEligible, true);
assert.equal(replayA.receiptHash, replayB.receiptHash);
assert.equal(replayA.formalSelectionAuthorized, false);
assert.equal(replayA.productionImpact, false);

const changedReturn = await buildD19ReturnReceiptV0_1({
  runId: "D19-SMOKE-001",
  factorId: "D19-04",
  symbol: "2330",
  market: "TWSE",
  marketDate,
  decisionTimestamp,
  inputBarHashes: ["BAR-2330-CHANGED"],
  continuityPolicyVersion: "RAW_CONTINUITY_UNVERIFIED_V0_1",
  corporateActionPolicyVersion: "NO_BACKFILL_V0_1",
  returnDefinition: "CLOSE_T_MINUS_20_TO_CLOSE_T",
  returnValue: 0.08,
  capturedAt: capturedAtA,
});
const changedReplay = await buildD19ReplayReceiptV0_1({
  runId: "D19-SMOKE-001",
  marketDate,
  decisionTimestamp,
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_SMOKE_V0_1",
  universeReceipt: universeA,
  returnReceipts: [changedReturn, return2454],
  factorInputReceipts: [factorInput2330, factorInput2454],
  neutralizationReceipt: neutralization,
  costReceipt: modeledCost,
  outputHash: "D19-04-SMOKE-OUTPUT",
  codeVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
  capturedAt: capturedAtA,
});
assert.notEqual(changedReplay.receiptHash, replayA.receiptHash);

const unknownCost = await buildD19CostReceiptV0_1({
  runId: "D19-COST-UNKNOWN",
  marketDate,
  decisionTimestamp,
  scenarioId: "D19_UNKNOWN_COST",
  scenarioVersion: "V0_1",
  turnoverDefinition: "ONE_WAY_FORMATION_TURNOVER",
  components: [{
    componentId: "COMMISSION",
    componentVersion: "V0_1",
    quality: "UNKNOWN",
    rate: null,
    sourceId: "BROKER_SCHEDULE",
    sourceVersion: "UNKNOWN",
    unknownReason: "BROKER_SCHEDULE_NOT_ESTABLISHED",
  }],
  shortLegRequired: false,
  borrowabilityState: "NOT_APPLICABLE",
  capturedAt: capturedAtA,
});
assert.equal(unknownCost.state, "INCOMPLETE");

const blockedReplay = await buildD19ReplayReceiptV0_1({
  runId: "D19-COST-UNKNOWN",
  marketDate,
  decisionTimestamp,
  factorId: "D19-04",
  factorVersion: "V0_1",
  universeReceipt: universeA,
  returnReceipts: [return2330],
  factorInputReceipts: [factorInput2330],
  neutralizationReceipt: neutralization,
  costReceipt: unknownCost,
  outputHash: "BLOCKED",
  codeVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
  capturedAt: capturedAtA,
});
assert.equal(blockedReplay.state, "INCOMPLETE");
assert.equal(blockedReplay.l3DataFeasibilityEligible, false);

console.log("System2 D19 factor receipt adapter v0.1 tests passed");
