import fs from "node:fs";

const workerPath=process.env.V7_TEST_WORKER_PATH || "Worker.js";
const source=fs.readFileSync(workerPath,"utf8");

const required=[
  'CREATE TABLE IF NOT EXISTS trade_research_execution_snapshots',
  'function executionResearchEventTypes(',
  'function buildExecutionResearchPayload(',
  'async function recordProspectiveExecutionShadow(',
  'async function readExecutionResearchRecorder(',
  'url.pathname==="/api/research/execution-recorder"',
  'RESEARCH_EXECUTION_RECORDER_FAIL_OPEN',
  'const executionResearchRecorder = await recordProspectiveExecutionShadow(env,results,scheduledTime,notifications);'
];
if(!source.includes('const VERSION = "8.8.')) throw new Error("V8.8+ runtime version contract missing");
for(const needle of required) {
  if(!source.includes(needle)) throw new Error("Missing recorder contract: "+needle);
}
const hook=source.indexOf('const executionResearchRecorder = await recordProspectiveExecutionShadow');
const push=source.indexOf('notifications.push(...await processSignalState');
const live=source.indexOf('const liveStore = await writeLiveSnapshot',push);
if(!(push>=0 && live>push && hook>live)) throw new Error("Recorder must run after formal signal processing and live-state persistence");
if(!source.includes('researchOnly:true') || !source.includes('decisionImpact:false')) throw new Error("Research-only semantics missing");
if(source.includes('executionMarketState:"NORMAL"')) throw new Error("Unknown market mechanism must not be coerced to NORMAL");
console.log("V8.8.0 Shadow Execution Recorder contract OK");
