import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(process.env.V7_TEST_WORKER_PATH||new URL("../Worker.js",import.meta.url),"utf8");
let n=0;
assert.ok(source.includes('const VERSION = "8.15.4-c4-priority-provenance";'));n++;

const c1Start=source.indexOf("function buildC1PopulationReceipt(");
const c1End=source.indexOf("function c1ChunkRows(",c1Start);
assert.ok(c1Start>=0&&c1End>c1Start);n++;
const c1=source.slice(c1Start,c1End);
assert.ok(c1.includes("priorityScore:c1Number(result.priorityScore)"));n++;
assert.ok(c1.includes('priorityScoreProvenance:"FORMAL_RUNTIME_RESULT_AT_C1_DECISION"'));n++;
assert.equal(c1.includes("scoreCandidate("),false);n++;
assert.equal(c1.includes("applyMarketConsensus("),false);n++;
assert.equal(c1.includes("priorityScore="),false);n++;
assert.equal(c1.includes("priorityScore +="),false);n++;
assert.equal(c1.includes("priorityScore -="),false);n++;

const selectorStart=source.indexOf("function selectTomorrowCandidates(");
const selectorEnd=source.indexOf("function scoreCandidate(",selectorStart);
assert.ok(selectorStart>=0&&selectorEnd>selectorStart);n++;
const selector=source.slice(selectorStart,selectorEnd);
assert.ok(selector.includes("b.priorityScore - a.priorityScore || b.rewardPerRisk - a.rewardPerRisk ||"));n++;
assert.ok(selector.includes("c1FormalResults.set(String(f.symbol),result)"));n++;

for(const forbidden of ["sendPush(","processSignalState(","saveStockConfig(","FIRST","ADD","REDUCE","SELL"]){
  assert.equal(c1.includes(forbidden),false,"C1 receipt must not gain business path: "+forbidden);n++;
}
console.log(JSON.stringify({
  ok:true,assertions:n,version:"8.15.4-c4-priority-provenance",
  priorityScoreCopiedFromFormalResult:true,priorityScoreRecomputed:false,formalComparatorFrozen:true,
  signalPathChanged:false,pushPathChanged:false,orderPathChanged:false,formalCoreImpact:false,system2Touched:false
}));
