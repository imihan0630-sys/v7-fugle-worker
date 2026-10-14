import assert from "node:assert/strict";
import {buildIndependentMonitorShards,chooseBoundedShard,auditShardAggregate}
 from "../ops/system1_p0_free_cpu_shard_oracle_v0_1.mjs";
const formal=["6226","8046","3037","6191","2609"].map(symbol=>({symbol}));
const aideen=["6213","3189","6672","2404"].map(symbol=>({symbol}));
const p=buildIndependentMonitorShards({formal,aideen,shardSize:3});
let cases=0;const ok=(truth,label)=>{assert.ok(truth,label);cases++};
ok(p.expectedKeys.length===9&&p.cycles===3&&p.shardSize===3,"9 exact monitors in 3 <=3 stock shards");
ok(p.groups.every(g=>g.length===3),"no event loads 9 Fugle quotes in one invocation");
ok(p.originalWorkerQuoteFreshSeconds===90&&p.sequentialOneCronRotationMeets90SecondFreshness===false,
 "three-minute 3x3 rotation is explicitly NOT production freshness-compatible");

ok(new Set(p.expectedKeys).size===9,"all original independent identities unique");
const cycle=[540,541,542].map(minuteOfDay=>chooseBoundedShard({plan:p,minuteOfDay}));
ok(cycle.flatMap(x=>x.entries).length===9&&new Set(cycle.flatMap(x=>x.entries.map(z=>z.pool+":"+z.symbol))).size===9,
 "each original 9-role stock covered once in 3 consecutive exchange-open minutes");
ok(cycle.map(x=>x.index).join(",")==="0,1,2","deterministic phase begins at 09:00");
assert.throws(()=>buildIndependentMonitorShards({formal,aideen:[...aideen,aideen[0]]}),/PROTECTED_FORMAL5_AIDEEN4/);cases++;
assert.throws(()=>buildIndependentMonitorShards({formal,aideen,shardSize:4}),/INVALID_CPU_SHARD_INPUT/);cases++;
assert.throws(()=>chooseBoundedShard({plan:p,minuteOfDay:-1}),/SHARD_CADENCE_UNVERIFIED/);cases++;
const tradeDate="2026-10-14",now="2026-10-14T02:55:00Z";
const row=(x,at="2026-10-14T02:54:00Z")=>({
 pool:x.pool,symbol:x.symbol,tradeDate,ok:true,
 quote:{lastUpdated:Date.parse(at)*1000,isTrial:false},
 executionData:{quoteFresh:true}
});
const rows=p.groups.flat().map(x=>row(x));
const result=(r=rows,prior=[])=>auditShardAggregate({plan:p,tradeDate,now,updates:r,prior});
ok(result().readyForCandidateValidationOnly===true,"genuinely current nine-source snapshot may be validated for READINESS ONLY");
ok(result().mayPublishToFormalLive===false&&result().maySendPush===false,
 "offline proof cannot publish, push, trade or mutate D1");
ok(result().oldestVendorAgeSeconds===60,"actual 60 second producer timestamp recorded");
ok(result().originalWorkerQuoteFreshSeconds===90&&result().neverLoosenQuoteClock===true,
 "aggregate never silently relaxes original quote producer age from 90 to 300 seconds");
ok(result([row(p.groups[0][0],"2026-10-14T02:53:29Z"),...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "91-second-old quote is INVALID even if a 5-minute dashboard freshness gate would have passed");
assert.throws(()=>auditShardAggregate({plan:p,tradeDate,now,updates:rows,maxAgeSeconds:91}),
 /AGGREGATE_EPOCH_OR_CLOCK_UNVERIFIED/);cases++;
const single=rows.slice(0,3);
ok(result(single).readyForCandidateValidationOnly===false&&result(single).missingKeys.length===6,
 "one updated shard MUST NOT masquerade as full 9 stock monitor");
ok(result(single,rows.slice(3)).readyForCandidateValidationOnly===true,
 "prior fresh shards may contribute under exact epoch and clock verification");
ok(result([row({pool:"FORMAL",symbol:"6226"},"2026-10-14T02:44:00Z"),...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "stale Fugle quote cannot hide behind fresh snapshot");
ok(result([{...rows[0],tradeDate:"2026-10-13"},...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "prior trading-day stock cannot pass current-day merge");
ok(result([{...rows[0],quote:{...rows[0].quote,isTrial:true}},...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "trial quotes rejected");
ok(result([{...rows[0],executionData:{quoteFresh:false}},...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "original source provider false freshness flag rejected");
ok(result([{...rows[0],quote:{...rows[0].quote,lastUpdated:0}},...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "missing microsecond timestamp rejected");
ok(result([{...rows[0],symbol:"0000"},...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "unknown stock never promoted");
ok(result([rows[0],{...rows[0],quote:{...rows[0].quote,closePrice:133}},...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "same-timestamp conflicting prices not atomic");
ok(result([{...rows[0],quote:{...rows[0].quote,lastUpdated:Date.parse("2026-10-14T03:00:00Z")*1000}},...rows.slice(1)]).readyForCandidateValidationOnly===false,
 "future quote timestamp rejected");
assert.throws(()=>auditShardAggregate({plan:p,tradeDate,now,maxAgeSeconds:301}),/AGGREGATE_EPOCH_OR_CLOCK_UNVERIFIED/);cases++;
console.log("SYSTEM1_FREE_CPU_SHARD_PURE_ORACLE_PASS="+JSON.stringify({
 cases,shardCount:p.cycles,stocksPerEvent:p.shardSize,maxQuoteRotationMinutes:p.maxConsecutiveMinutesWithoutQuote,
 mayDeployToProduction:false,maySendPush:false,originalFormalAndAideenKeys:p.expectedKeys}));
