import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname,"utf8");

assert.match(source,/const VERSION = "8\.14\.0-sector-gate-provenance-shadow";/);

const market=source.slice(source.indexOf("function buildResearchMarketContext"),source.indexOf("function buildResearchSnapshot"));
assert.ok(market.includes('schemaVersion:"research-market-v2-sector-universe-provenance"'));
assert.ok(market.includes('marketScope:"TWSE_TPEX_COMBINED_FORMAL_NORMALIZED"'));
assert.ok(market.includes('advanceDefinition:"FORMAL_NORMALIZED_TODAY_ROWS"'));
assert.ok(market.includes('trendDefinition:"HISTORY_ADMITTED_FEATURE_ROWS"'));
assert.ok(market.includes("formalPriceFloorApplied:true"));
assert.ok(market.includes("nonCommonInstrumentFilterApplied:true"));
assert.ok(market.includes("officialWholeMarketBreadth:false"));

const shadow=source.slice(source.indexOf("function buildShadowCandidateEntry"),source.indexOf("async function persistShadowCandidateArchive"));
assert.ok(shadow.includes('auditVersion:"SECTOR_GATE_AUDIT_V0_1"'));
assert.ok(shadow.includes('gateVersion:"FORMAL_SECTOR_GATE_BREADTH40_AVGCHANGE_MINUS1_AMOUNT0_5"'));
assert.ok(shadow.includes("breadthGte40"));
assert.ok(shadow.includes("avgChangeGteMinus1"));
assert.ok(shadow.includes("amountVs20Gte0_5"));
assert.ok(shadow.includes("fullFormalCounterfactual:false"));
assert.ok(shadow.includes('"SECTOR_GATE_REJECTED"'));
assert.ok(shadow.includes('String(row.result?.reason||"")==="產業廣度、漲幅或資金活躍度偏弱"'));
assert.ok(shadow.includes("byPool(sectorGateRejected,6"));

const score=source.slice(source.indexOf("function scoreCandidate"),source.indexOf("function reject",source.indexOf("function scoreCandidate")));
assert.match(score,/sector\.breadth<40 \|\| sector\.avgChange<-1 \|\| !\(sector\.amountVs20DayAverage>=\.5\)/);
assert.match(score,/return reject\("產業廣度、漲幅或資金活躍度偏弱",true\)/);

const selection=source.slice(source.indexOf("function selectTomorrowCandidates"),source.indexOf("function scoreCandidate"));
assert.match(selection,/b\.priorityScore - a\.priorityScore \|\| b\.rewardPerRisk - a\.rewardPerRisk \|\|/);
assert.match(selection,/\(b\.marketConsensusScore \|\| 0\) - \(a\.marketConsensusScore \|\| 0\) \|\|/);

console.log(JSON.stringify({
  ok:true,
  version:"8.14.0-sector-gate-provenance-shadow",
  class:"A",
  sectorGateProspectiveProvenance:true,
  boundedSectorGateRejectedCohort:true,
  breadthUniverseExplicit:true,
  formalSectorGateFrozen:true,
  formalRankingFrozen:true,
  decisionImpact:false
}));
