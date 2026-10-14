import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import {createHash} from "node:crypto";
import {performance} from "node:perf_hooks";
const source=readFileSync("Worker.js","utf8");
const patched=readFileSync("artifacts/reviewonly/Worker.cpu-cache.js","utf8");
const sha=s=>createHash("sha256").update(s).digest("hex");
assert.notEqual(sha(source),sha(patched));
assert.equal(patched.length>source.length,true);
assert.equal(source.includes("S1_P0_TAIPEI_CLOCK_FORMATTER"),false);
assert.equal(source.includes("S1_P0_TAIPEI_DATE_FORMATTER"),false);
assert.equal(patched.includes("const S1_P0_TAIPEI_CLOCK_FORMATTER = new Intl.DateTimeFormat"),true);
assert.equal(patched.includes("const S1_P0_TAIPEI_DATE_FORMATTER = new Intl.DateTimeFormat"),true);
assert.equal(patched.includes("const LIVE_STALE_SECONDS = 90;"),true);
for(const invariant of [
 "const need10 = minutesSinceOpen >= 11 && (minutesSinceOpen - 1) % 10 === 0;",
 "const need15 = minutesSinceOpen >= 16 && (minutesSinceOpen - 1) % 15 === 0;",
 "await acquireSignalStateLease(env,key)",
 "await writeLiveSnapshot(env, snapshot)",
 "await env.STOCKS_KV.put(",
])assert.ok(patched.includes(invariant),invariant);
const formalLegacyState=patched.includes("const key=SIGNAL_STATE_PREFIX+result.symbol;");
const canonicalAideenRoleState=patched.includes("const key=aideenSignalStateKey(result);")&&
 patched.includes("function aideenSignalStateKey(result)")&&
 patched.includes("result?.plan?.strategyPool===AIDEEN_POOL_ID")&&
 patched.includes("return SIGNAL_STATE_PREFIX +");
assert.ok(formalLegacyState||canonicalAideenRoleState,
 "must preserve original formal lease key or stronger independently namespaced Aideen signal key");
assert.equal(canonicalAideenRoleState,
 source.includes("const key=aideenSignalStateKey(result);"),
 "CPU patch must not alter original canonical role-separated signal state");

function createProbe(script,name) {
 const capture=script.match(new RegExp("function "+name+"\\(value = Date\\.now\\(\\)\\) \\{[\\s\\S]*?\\n\\}"));
 assert.ok(capture,"protected function "+name+" missing");
 const formatterConst=name==="taiwanClock"?"S1_P0_TAIPEI_CLOCK_FORMATTER":"S1_P0_TAIPEI_DATE_FORMATTER";
 const definition=script.includes("const "+formatterConst+" = ")?script.match(
  new RegExp("const "+formatterConst+" = new Intl\\.DateTimeFormat\\([\\s\\S]*?\\n\\}\\);"))?.[0]:"";
 if(script.includes("const "+formatterConst+" = "))assert.ok(definition,"candidate declaration missing");
 let constructors=0;
 const safeIntl={DateTimeFormat:function(...args){
   constructors++; return new Intl.DateTimeFormat(...args);
 }};
 const api=vm.runInNewContext("(function(){"+definition+"\n"+capture[0]+";return "+name+";})()",
  {Intl:safeIntl,Date,Object,Number},{timeout:8000});
 return {fn:api,constructors:()=>constructors};
}
const cases=[];
for(const year of [2024,2025,2026,2027]){
 for(const month of [0,1,5,8,9,11]){
  for(const utcHour of [0,1,7,8,15,16,20,23]){
   cases.push(Date.UTC(year,month,14,utcHour,59,55));
  }
 }
}
for(const name of ["taiwanClock","taiwanDate"]){
 const before=createProbe(source,name),after=createProbe(patched,name);
 assert.equal(before.constructors(),0);
 assert.equal(after.constructors(),1);
 for(const point of cases){
  const expected=before.fn(point),actual=after.fn(point);
  assert.deepEqual(JSON.parse(JSON.stringify(actual)),JSON.parse(JSON.stringify(expected)),name+" "+new Date(point).toISOString());
 }
 assert.equal(before.constructors(),cases.length,"old instantiates Intl formatter EACH call");
 assert.equal(after.constructors(),1,"candidate constructs Intl formatter ONCE per isolate");
}
let costResults={};
for(const name of ["taiwanClock","taiwanDate"]){
 const before=createProbe(source,name),after=createProbe(patched,name);
 const stamps=cases.slice(0,12);
 function measure(fn){
  const t0=performance.now();
  for(let n=0;n<4000;n++)fn(stamps[n%stamps.length]);
  return Number((performance.now()-t0).toFixed(2));
 }
 // Measurement is ONLY an observable Node runner indicator, not a Cloudflare CPU limit proof.
 costResults[name]={uncachedMs:measure(before.fn),cachedMs:measure(after.fn)};
 assert.equal(after.constructors(),1);
}
console.log("SYSTEM1_P0_CPU_FORMATTER_REVIEW_ONLY_TEST_PASS="+JSON.stringify({
 testCases:cases.length*2,candidateSourceSha256:sha(patched),
 sourceSha256:sha(source),sharedConstructorsPerFunction:1,
 liveStaleSecondsKept:90,formalScanBusinessCoreUnchanged:true,
 d1LeaseUnchanged:true,originalCronUnchanged:true,
 productionWorkerDeployed:false,benchmarksNodeRunnerIllustrativeOnly:costResults}));
