import assert from "node:assert/strict";
import { rankStrategyLocalBaseline } from "../runtime/strategy_local_ranking_baseline.mjs";

const fam = (thesisState, observationState = "KNOWN") => ({
  observationState,
  thesisState,
});

const smCandidates = [
  {
    symbol: "A",
    decisionId: "D-A",
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    strategyValidity: "VALID",
    entryReadiness: "WATCH",
    familyAssessments: {
      TECHNICAL_STRUCTURE: fam("SUPPORTIVE"),
      PRICE_VOLUME: fam("SUPPORTIVE"),
      RISK_FRICTION: fam("NEUTRAL"),
    },
  },
  {
    symbol: "B",
    decisionId: "D-B",
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    strategyValidity: "VALID",
    entryReadiness: "BUY_ELIGIBLE",
    familyAssessments: {
      TECHNICAL_STRUCTURE: fam("SUPPORTIVE"),
      PRICE_VOLUME: fam("NEUTRAL"),
      RISK_FRICTION: fam("NEUTRAL"),
    },
  },
  {
    symbol: "C",
    decisionId: "D-C",
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    strategyValidity: "VALID",
    entryReadiness: "NEAR_ENTRY",
    familyAssessments: {
      TECHNICAL_STRUCTURE: fam("NEUTRAL"),
      PRICE_VOLUME: fam("SUPPORTIVE"),
      RISK_FRICTION: fam("SUPPORTIVE"),
    },
  },
  {
    symbol: "D",
    decisionId: "D-D",
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    strategyValidity: "VALID",
    entryReadiness: "WATCH",
    familyAssessments: {
      TECHNICAL_STRUCTURE: fam("SUPPORTIVE"),
      PRICE_VOLUME: fam("SUPPORTIVE", "UNKNOWN"),
      RISK_FRICTION: fam("NEUTRAL"),
    },
  },
];

const first = await rankStrategyLocalBaseline({
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  candidates: smCandidates,
});
const second = await rankStrategyLocalBaseline({
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  candidates: smCandidates,
});

const a = first.ranked.find((x) => x.symbol === "A");
const b = first.ranked.find((x) => x.symbol === "B");
const c = first.ranked.find((x) => x.symbol === "C");

assert.equal(a.paretoTier, 1);
assert.ok(b.paretoTier > a.paretoTier);
assert.equal(c.paretoTier, 1);
assert.equal(first.unranked.find((x) => x.symbol === "D").reason, "RANKING_INPUT_INCOMPLETE");
assert.equal(first.noNumericScore, true);
assert.deepEqual(
  first.ranked.map((x) => [x.symbol, x.paretoTier, x.tieBreakHash]),
  second.ranked.map((x) => [x.symbol, x.paretoTier, x.tieBreakHash]),
);

const sg = await rankStrategyLocalBaseline({
  strategyId: "SWING_GROWTH",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  candidates: [
    {
      symbol: "X",
      decisionId: "D-X",
      strategyId: "SWING_GROWTH",
      strategyVersion: "V0.1-CONTRACT",
      strategyValidity: "VALID",
      entryReadiness: "WATCH",
      familyAssessments: {
        FUNDAMENTAL_QUALITY: fam("SUPPORTIVE"),
        INDUSTRY_THESIS: fam("NEUTRAL"),
      },
    },
    {
      symbol: "Y",
      decisionId: "D-Y",
      strategyId: "SWING_GROWTH",
      strategyVersion: "V0.1-CONTRACT",
      strategyValidity: "VALID",
      entryReadiness: "BUY_ELIGIBLE",
      familyAssessments: {
        FUNDAMENTAL_QUALITY: fam("NEUTRAL"),
        INDUSTRY_THESIS: fam("SUPPORTIVE"),
      },
    },
  ],
});

assert.equal(sg.ranked.length, 2);
assert.equal(sg.ranked[0].paretoTier, 1);
assert.equal(sg.ranked[1].paretoTier, 1);
assert.equal(sg.ranked[0].tiedWithinTier, true);
assert.deepEqual(sg.baselineFamilies, ["FUNDAMENTAL_QUALITY", "INDUSTRY_THESIS"]);

console.log("System2 strategy-local ranking baseline tests passed");
