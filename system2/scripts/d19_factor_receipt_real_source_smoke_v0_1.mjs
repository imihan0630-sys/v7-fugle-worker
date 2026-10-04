import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import {
  D19_FACTOR_RECEIPT_VERSION_V0_1,
  buildD19UniverseReceiptV0_1,
  buildD19ReturnReceiptV0_1,
  buildD19FactorInputReceiptV0_1,
  buildD19NeutralizationReceiptV0_1,
  buildD19CostReceiptV0_1,
  buildD19ReplayReceiptV0_1,
} from "../runtime/d19_factor_receipt_adapter_v0_1.mjs";

const fromDate = process.env.D19_SMOKE_FROM || "2026-08-03";
const toDate = process.env.D19_SMOKE_TO || "2026-08-31";
const decisionTimestamp = process.env.D19_SMOKE_DECISION || toDate + "T05:40:00Z";
const capturedAt = new Date().toISOString();
const boundedSymbols = {
  TWSE: (process.env.D19_SMOKE_TWSE || "2330,2454").split(",").map((x) => x.trim()).filter(Boolean),
  TPEX: (process.env.D19_SMOKE_TPEX || "3105,6488").split(",").map((x) => x.trim()).filter(Boolean),
};
const lookbackSessions = 21;

function sampleStd(values) {
  if (values.length < 2) return null;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function dailyReturns(rows) {
  const out = [];
  for (let i = 1; i < rows.length; i += 1) {
    const prev = rows[i - 1].close;
    const cur = rows[i].close;
    if (!Number.isFinite(prev) || !Number.isFinite(cur) || prev <= 0 || cur <= 0) return [];
    out.push(cur / prev - 1);
  }
  return out;
}

const ranges = {};
for (const market of ["TWSE", "TPEX"]) {
  ranges[market] = await fetchOfficialHistoricalA1RangeV0_1({
    market,
    fromDate,
    toDate,
    observedAt: capturedAt,
    pauseMs: 50,
    includeRowProvenance: true,
  });
  assert.equal(ranges[market].tradingDateCount, lookbackSessions);
  assert.equal(ranges[market].fetchedTradingDateCount, lookbackSessions);
}

const selected = [];
for (const market of ["TWSE", "TPEX"]) {
  for (const symbol of boundedSymbols[market]) {
    const rows = ranges[market].rows
      .filter((row) => row.symbol === symbol)
      .sort((a, b) => a.marketDate.localeCompare(b.marketDate));
    assert.equal(rows.length, lookbackSessions, market + " " + symbol + " needs 21 complete bars");
    assert.equal(rows.at(-1).marketDate, toDate);
    assert.ok(rows.every((row) => Number.isFinite(row.close) && row.close > 0));
    assert.ok(rows.every((row) => row.availableAt && Date.parse(row.availableAt) <= Date.parse(decisionTimestamp)));
    assert.ok(rows.every((row) => row.sourceRowHash));
    selected.push({ market, symbol, companyName: rows.at(-1).companyName, rows });
  }
}

const members = [];
for (const item of selected) {
  members.push({
    market: item.market,
    symbol: item.symbol,
    membershipId: "BOUNDED-OFFICIAL-SMOKE|" + item.market + "|" + item.symbol,
    membershipHash: await sha256Hex({
      market: item.market,
      symbol: item.symbol,
      firstDate: item.rows[0].marketDate,
      lastDate: item.rows.at(-1).marketDate,
      sourceRowHashes: item.rows.map((row) => row.sourceRowHash),
    }),
    replayEligible: true,
    industry: null,
  });
}

const runId = "D19-REAL-SOURCE-SMOKE|" + fromDate + "|" + toDate;
const universeReceipt = await buildD19UniverseReceiptV0_1({
  runId,
  marketDate: toDate,
  decisionTimestamp,
  registryId: "BOUNDED_OFFICIAL_RANGE_ENGINEERING_SMOKE",
  universeKind: "BOUNDED_OFFICIAL_RANGE_ENGINEERING_SMOKE",
  members,
  capturedAt,
});

const returnReceipts = [];
const factorInputReceipts = [];
const factorRows = [];

for (const item of selected) {
  const first = item.rows[0];
  const last = item.rows.at(-1);
  const momentum20 = last.close / first.close - 1;
  const rets = dailyReturns(item.rows);
  assert.equal(rets.length, 20);
  const volatility20 = sampleStd(rets);
  assert.ok(Number.isFinite(volatility20));

  const returnReceipt = await buildD19ReturnReceiptV0_1({
    runId,
    factorId: "D19-04",
    symbol: item.symbol,
    market: item.market,
    marketDate: toDate,
    decisionTimestamp,
    inputBarHashes: item.rows.map((row) => row.sourceRowHash),
    continuityPolicyVersion: "RAW_CONTINUITY_UNVERIFIED_V0_1",
    corporateActionPolicyVersion: "NO_CONTINUITY_TRANSFORM_ENGINEERING_SMOKE_V0_1",
    returnDefinition: "CLOSE_T_MINUS_20_TO_CLOSE_T",
    returnValue: momentum20,
    capturedAt,
  });
  returnReceipts.push(returnReceipt);

  const inputReceipt = await buildD19FactorInputReceiptV0_1({
    runId,
    factorId: "D19-04",
    factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_ENGINEERING_SMOKE_V0_1",
    scope: "SYMBOL",
    scopeKey: item.market + "|" + item.symbol,
    marketDate: toDate,
    decisionTimestamp,
    inputs: [{
      inputId: "RAW_RETURN_20S",
      inputVersion: "V0_1",
      required: true,
      state: "KNOWN",
      valueHash: returnReceipt.receiptHash,
      sourceId: last.sourceId,
      payloadHash: last.sourceRowHash,
      observedAt: last.observedAt,
      availableAt: last.availableAt,
    }],
    capturedAt,
  });
  factorInputReceipts.push(inputReceipt);

  factorRows.push({
    market: item.market,
    symbol: item.symbol,
    momentum20,
    volatility20,
    sourceAvailableAt: last.availableAt,
    lastSourceRowHash: last.sourceRowHash,
  });
}

const centers = {};
for (const market of ["TWSE", "TPEX"]) {
  const values = factorRows.filter((x) => x.market === market).map((x) => x.momentum20);
  assert.equal(values.length, boundedSymbols[market].length);
  centers[market] = values.reduce((a, b) => a + b, 0) / values.length;
}
const residualRows = factorRows.map((row) => ({
  market: row.market,
  symbol: row.symbol,
  rawMomentum20: row.momentum20,
  withinMarketResidual: row.momentum20 - centers[row.market],
}));
const residualHash = await sha256Hex(residualRows);

const neutralizationReceipt = await buildD19NeutralizationReceiptV0_1({
  runId,
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_ENGINEERING_SMOKE_V0_1",
  marketDate: toDate,
  decisionTimestamp,
  factorSetId: "D19-04-WITHIN-MARKET-CENTERING",
  factorSetVersion: "V0_1",
  method: "WITHIN_MARKET_DEMEAN",
  estimationWindow: fromDate + "/" + toDate,
  validSampleCount: residualRows.length,
  transformMetadata: {
    markets: ["TWSE", "TPEX"],
    centers,
    boundedUniverseOnly: true,
  },
  residualHash,
  warnings: [
    "BOUNDED_UNIVERSE_ONLY",
    "INDUSTRY_NEUTRALIZATION_NOT_PROVEN",
    "D03_D09_REDUNDANCY_NOT_PROVEN",
  ],
  capturedAt,
});

const costReceipt = await buildD19CostReceiptV0_1({
  runId,
  marketDate: toDate,
  decisionTimestamp,
  scenarioId: "D19_ENGINEERING_TRANSPORT_ONLY",
  scenarioVersion: "V0_1",
  turnoverDefinition: "FORMATION_TURNOVER_NOT_ESTIMATED_IN_THIS_SMOKE",
  components: [{
    componentId: "ALL_IN_COST_PLACEHOLDER",
    componentVersion: "V0_1",
    quality: "MODELED",
    rate: 0,
    sourceId: "D19_ENGINEERING_SMOKE_ONLY",
    sourceVersion: "V0_1",
    sourceHash: "NOT_ALPHA_OR_NET_RETURN_EVIDENCE",
  }],
  shortLegRequired: false,
  borrowabilityState: "NOT_APPLICABLE",
  capturedAt,
});

const outputHash = await sha256Hex({
  factorRows: factorRows.map((row) => ({
    market: row.market,
    symbol: row.symbol,
    momentum20: row.momentum20,
    volatility20: row.volatility20,
  })),
  residualRows,
});

const eligibilityBlockers = [
  "BOUNDED_UNIVERSE_NOT_HISTORICAL_REGISTRY",
  "CORPORATE_ACTION_CONTINUITY_UNVERIFIED",
  "INDUSTRY_NEUTRALIZATION_NOT_PROVEN",
  "D03_D09_REDUNDANCY_NOT_PROVEN",
  "COST_PROVENANCE_MODELED_TRANSPORT_ONLY",
];

const replayReceiptA = await buildD19ReplayReceiptV0_1({
  runId,
  marketDate: toDate,
  decisionTimestamp,
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_ENGINEERING_SMOKE_V0_1",
  universeReceipt,
  returnReceipts,
  factorInputReceipts,
  neutralizationReceipt,
  costReceipt,
  outputHash,
  codeVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
  eligibilityBlockers,
  capturedAt,
});
const replayReceiptB = await buildD19ReplayReceiptV0_1({
  runId,
  marketDate: toDate,
  decisionTimestamp,
  factorId: "D19-04",
  factorVersion: "CROSS_SECTIONAL_MOMENTUM_20S_ENGINEERING_SMOKE_V0_1",
  universeReceipt,
  returnReceipts: [...returnReceipts].reverse(),
  factorInputReceipts: [...factorInputReceipts].reverse(),
  neutralizationReceipt,
  costReceipt,
  outputHash,
  codeVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
  eligibilityBlockers: [...eligibilityBlockers].reverse(),
  capturedAt: new Date(Date.parse(capturedAt) + 60000).toISOString(),
});

assert.equal(replayReceiptA.state, "READY");
assert.equal(replayReceiptA.receiptChainComplete, true);
assert.equal(replayReceiptA.l3DataFeasibilityEligible, false);
assert.equal(replayReceiptA.receiptHash, replayReceiptB.receiptHash);

console.log(JSON.stringify({
  result: "PASS_NEGATIVE_L3_GATE",
  smokeVersion: "S2_D19_FACTOR_RECEIPT_REAL_SOURCE_SMOKE_V0_1",
  fromDate,
  toDate,
  decisionTimestamp,
  officialTradingDates: lookbackSessions,
  sourceUniverseRows: {
    TWSE: ranges.TWSE.rowCount,
    TPEX: ranges.TPEX.rowCount,
  },
  boundedSymbols,
  factorRows,
  receipts: {
    universeReceiptHash: universeReceipt.receiptHash,
    returnReceiptCount: returnReceipts.length,
    factorInputReceiptCount: factorInputReceipts.length,
    neutralizationReceiptHash: neutralizationReceipt.receiptHash,
    costReceiptHash: costReceipt.receiptHash,
    replayReceiptHash: replayReceiptA.receiptHash,
  },
  receiptChainComplete: replayReceiptA.receiptChainComplete,
  l3DataFeasibilityEligible: replayReceiptA.l3DataFeasibilityEligible,
  eligibilityBlockers: replayReceiptA.eligibilityBlockers,
  system1RuntimeChanged: false,
  formalCoreChanged: false,
  finalSelectionAuthorized: false,
}, null, 2));
