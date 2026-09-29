import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname,"utf8");

assert.match(source,/const VERSION = "8\.14\.1-tdcc-share-reconciliation";/);

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


assert.ok(source.includes("INSTITUTIONAL_SCORE_DECOMPOSITION_OBSERVER_V0_2"));
assert.ok(source.includes("institutionalDecomposition=buildInstitutionalScoreDecompositionObserver"));
assert.ok(source.includes("byCohort,byDate,institutionalDecomposition"));

const observerSource=await readFile(new URL("../research/institutional_score_decomposition_observer_v0_2.mjs",import.meta.url),"utf8");
const observerMod=await import("data:text/javascript;base64,"+Buffer.from(
  observerSource+"\nexport {buildInstitutionalScoreDecompositionObserver};"
).toString("base64"));

const observerRows=[
  {
    scan_date:"2026-09-21",symbol:"1101",cohort:"SELECTED",pool:"FORMAL_GENERAL",
    snapshot_json:JSON.stringify({
      institution:{
        score:100,foreignBuyDays:3,trustBuyDays:3,dealerBuyDays:3,
        foreignNet:600000,trustNet:300000,dealerNet:100000,institutionTotalNet:1000000,
        chipConcentration:80
      },
      volume:{avgVolume20Lots:1000}
    })
  },
  {
    scan_date:"2026-09-22",symbol:"1102",cohort:"BROAD_CONTROL",pool:"FORMAL_GENERAL",
    snapshot_json:JSON.stringify({
      institution:{
        score:22.5,foreignBuyDays:1,trustBuyDays:0,dealerBuyDays:0,
        foreignNet:100000,trustNet:-30000,dealerNet:-20000,institutionTotalNet:50000,
        chipConcentration:40
      },
      volume:{avgVolume20Lots:500}
    })
  },
  {
    scan_date:"2026-09-22",symbol:"1103",cohort:"NEAR_MISS",pool:"FORMAL_GENERAL",
    snapshot_json:JSON.stringify({
      institution:{
        score:20,foreignBuyDays:1,trustBuyDays:0,dealerBuyDays:0,
        foreignNet:null,trustNet:0,dealerNet:0,institutionTotalNet:0,
        chipConcentration:40
      },
      volume:{avgVolume20Lots:500}
    })
  }
];
const observer=observerMod.buildInstitutionalScoreDecompositionObserver(observerRows);
assert.equal(observer.researchOnly,true);
assert.equal(observer.decisionImpact,false);
assert.equal(observer.formalCoreImpact,false);
assert.equal(observer.outcomesUsed,false);
assert.equal(observer.rows,3);
assert.equal(observer.decompositionReadyRows,2);
assert.equal(observer.saturatedRows,1);
assert.equal(observer.actorDivergenceRows,1);
assert.equal(observer.allThreePositiveRows,1);
assert.equal(observer.reconstructionMismatchRows,0);
assert.equal(observer.missingCounts.foreignNet,1);
assert.equal(observer.byCohort.SELECTED.saturated,1);
assert.equal(observer.byCohort.BROAD_CONTROL.actorDivergence,1);
assert.equal(observer.scoreAtOrAbove70Rows,1);
assert.equal(observer.streakEndpointInvariant.anyMismatchRows,0);
assert.equal(observer.contributionStats.currentDayDirectionBase.max,22);
assert.equal(observer.contributionStats.persistenceBeyondDay1.max,44);
assert.equal(observer.contributionStats.sameSessionDirectionPoints.max,43);
assert.equal(observer.rankInterpretationGuard.includes("bounded Shadow"),true);

console.log(JSON.stringify({
  ok:true,
  version:"8.14.2-unscheduled-closure-recovery-guard",
  class:"A",
  sectorGateProspectiveProvenance:true,
  boundedSectorGateRejectedCohort:true,
  breadthUniverseExplicit:true,
  formalSectorGateFrozen:true,
  formalRankingFrozen:true,
  decisionImpact:false,
  institutionalScoreDecompositionObserver:true,
  institutionalOutcomesUsed:false
}));


const {spawnSync}=await import("node:child_process");
const d18BreadthTest=spawnSync(process.execPath,["tests/test_d18_direction_breadth_semantics_v0_1.mjs"],{
  cwd:process.cwd(),encoding:"utf8"
});
assert.equal(
  d18BreadthTest.status,
  0,
  "D18 direction-breadth semantic observer test failed\n"+String(d18BreadthTest.stdout||"")+"\n"+String(d18BreadthTest.stderr||"")
);
