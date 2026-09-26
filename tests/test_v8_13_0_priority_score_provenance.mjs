import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname,"utf8");

assert.match(source,/const VERSION = "8\.13\.0-priority-score-provenance-shadow";/);

const snapshot=source.slice(source.indexOf("function buildResearchSnapshot"),source.indexOf("function researchGet"));
assert.ok(snapshot.includes("priorityScore:toNumber(item?.priorityScore)"));
assert.ok(snapshot.includes("rewardPerRisk:toNumber(item?.rewardPerRisk)"));
assert.ok(snapshot.includes("rewardRisk:toNumber(item?.rewardRisk)"));
assert.ok(snapshot.includes("setupQuality:toNumber(item?.setupQuality)"));
assert.ok(snapshot.includes("sectorFlow:toNumber(item?.sectorFlow)"));
assert.ok(snapshot.includes("relativeStrength:toNumber(item?.relativeStrength)"));
assert.ok(snapshot.includes('definitionVersion:"FORMAL_PRIORITY_SCORE_V1"'));
assert.ok(snapshot.includes('comparatorVersion:"RR_THEN_PRIORITY_SETUP_SECTOR_RS_V1"'));
assert.ok(snapshot.includes("decisionImpact:false"));

const score=source.slice(source.indexOf("function scoreCandidate"),source.indexOf("function reject",source.indexOf("function scoreCandidate")));
assert.match(score,/setupQuality \* 0\.28 \+ sector\.score \* 0\.14 \+ inst \* 0\.16 \+ fundamentalForRank \* 0\.14/);
assert.match(score,/clamp\(50 \+ rs \* 2, 0, 100\) \* 0\.14 \+ clamp\(rr \* 20, 0, 100\) \* 0\.14/);

const selection=source.slice(source.indexOf("function selectTomorrowCandidates"),source.indexOf("function scoreCandidate"));
assert.match(selection,/b\.rewardPerRisk - a\.rewardPerRisk \|\| b\.priorityScore - a\.priorityScore \|\|/);
assert.match(selection,/b\.setupQuality - a\.setupQuality \|\| b\.sectorFlow - a\.sectorFlow \|\| b\.relativeStrength - a\.relativeStrength/);

console.log(JSON.stringify({
  ok:true,
  version:"8.13.0-priority-score-provenance-shadow",
  class:"A",
  priorityScoreProspectiveProvenance:true,
  formalScoreWeightsFrozen:true,
  formalRankingComparatorFrozen:true,
  decisionImpact:false
}));
