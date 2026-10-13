import assert from "node:assert/strict";
import {summarizeInvocationRows} from "../ops/cloudflare_worker_invocations_readonly.mjs";

const report=summarizeInvocationRows([
 {dimensions:{datetime:"2026-10-13T02:45:10Z",status:"success"},sum:{requests:1,errors:0,subrequests:3},quantiles:{cpuTimeP50:4,cpuTimeP99:7,memoryUsageBytesP50:100,memoryUsageBytesP99:200}},
 {dimensions:{datetime:"2026-10-13T02:45:59Z",status:"success"},sum:{requests:1,errors:0,subrequests:2},quantiles:{cpuTimeP50:6,cpuTimeP99:9,memoryUsageBytesP50:120,memoryUsageBytesP99:220}},
 {dimensions:{datetime:"2026-10-13T02:46:01Z",status:"scriptThrewException"},sum:{requests:1,errors:1,subrequests:0},quantiles:{cpuTimeP50:10,cpuTimeP99:10,memoryUsageBytesP50:300,memoryUsageBytesP99:300}},
],{startUtc:"2026-10-13T00:30:00Z",endUtc:"2026-10-13T04:50:00Z",scriptName:"fugle-test"});
assert.equal(report.cloudflareResourceMutations,0);
assert.equal(report.totalRequests,3);
assert.equal(report.totalErrors,1);
assert.equal(report.lastInvocationMinuteUtc,"2026-10-13T02:46Z");
assert.equal(report.lastErrorMinuteUtc,"2026-10-13T02:46Z");
assert.deepEqual(report.minutes[0],{minuteUtc:"2026-10-13T02:45Z",status:"success",requests:2,errors:0,subrequests:5,
 cpuTimeP50:6,cpuTimeP99:9,memoryUsageBytesP50:120,memoryUsageBytesP99:220});
assert(!JSON.stringify(report).includes("accountTag"));
console.log("System1 Cloudflare invocation telemetry query-only summarizer PASS");
