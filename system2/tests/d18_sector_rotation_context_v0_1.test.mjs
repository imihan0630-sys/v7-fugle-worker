import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildD18SectorRotationContextV0_1 } from "../runtime/d18_sector_rotation_context_v0_1.mjs";

async function b2(date, observedAt, values) {
  const base = {
    contractFamilyId: "B2_INDUSTRY_THESIS_PROSPECTIVE",
    contractVersion: "0.2",
    marketDate: date,
    observedAt,
    availabilityState: "READY",
    dependencyCoverageEligible: true,
    classificationVintageSemantics: "PROFILE_FIRST_OBSERVED_PROSPECTIVELY_NO_HISTORICAL_BACKFILL",
    industries: values.map(([industryKey, meanChangePercent, breadthNetShare]) => ({
      industryKey,
      market: industryKey.split(":")[0],
      industry: industryKey.split(":")[1],
      meanChangePercent,
      breadthNetShare,
      memberCount: 100,
    })),
  };
  return { ...base, receiptHash: await sha256Hex(base) };
}

const priorDate = "2026-09-29";
const currentDate = "2026-09-30";
const prior = await b2(priorDate, "2026-09-29T06:20:00.000Z", [
  ["TWSE:電子", 0.2, 0.1],
  ["TWSE:金融", 1.1, 0.6],
  ["TPEX:電子", -0.3, -0.2],
]);
const current = await b2(currentDate, "2026-09-30T06:20:00.000Z", [
  ["TWSE:電子", 1.5, 0.7],
  ["TWSE:金融", 0.1, 0.0],
  ["TPEX:電子", -0.1, -0.1],
]);

const base = {
  receiptId: "D18-SECTOR-1",
  marketDate: currentDate,
  priorMarketDate: priorDate,
  decisionTimestamp: "2026-09-30T06:30:00.000Z",
  currentB2Receipt: current,
  priorB2Receipt: prior,
  officialSessionDates: ["2026-09-29","2026-09-30"],
};

const out = await buildD18SectorRotationContextV0_1(base);
assert.equal(out.state, "KNOWN");
assert.equal(out.thresholdApplied, false);
assert.equal(out.strategyScoreAssigned, false);
assert.equal(out.policyApplied, false);
assert.equal(out.commonIndustryCount, 3);
const elec = out.industries.find((x) => x.industryKey === "TWSE:電子");
assert.equal(elec.currentRank, 1);
assert(elec.rankImprovement > 0);

const replay = await buildD18SectorRotationContextV0_1(base);
assert.equal(replay.receiptHash, out.receiptHash);

const lateCurrent = { ...current, observedAt: "2026-09-30T07:00:00.000Z" };
const late = await buildD18SectorRotationContextV0_1({
  ...base,
  receiptId: "D18-SECTOR-late",
  currentB2Receipt: lateCurrent,
});
assert.equal(late.state, "UNKNOWN");
assert(late.unknownReasons.includes("CURRENT_OBSERVED_AFTER_DECISION"));

const notAdjacent = await buildD18SectorRotationContextV0_1({
  ...base,
  receiptId: "D18-SECTOR-gap",
  officialSessionDates: ["2026-09-28","2026-09-30"],
});
assert.equal(notAdjacent.state, "UNKNOWN");
assert(notAdjacent.unknownReasons.includes("PRIOR_SESSION_NOT_OFFICIAL_ADJACENT"));

const notReady = await buildD18SectorRotationContextV0_1({
  ...base,
  receiptId: "D18-SECTOR-not-ready",
  currentB2Receipt: { ...current, availabilityState: "NOT_READY", dependencyCoverageEligible: false },
});
assert.equal(notReady.state, "UNKNOWN");
assert(notReady.unknownReasons.includes("CURRENT_NOT_READY"));

console.log("D18 sector rotation context builder tests: PASS");
