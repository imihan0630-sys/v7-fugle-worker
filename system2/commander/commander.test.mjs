import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {verifyPlan,decide,auditPass,marker,issueBody} from "./commander.mjs";
const plan=JSON.parse(await readFile(new URL("./dispatch_plan_v0_1.json",import.meta.url)));
test("14 task unique DAG and strict owner-gated Cron",()=>{
 assert.equal(verifyPlan(plan),true);
 assert.equal(plan.tasks.length,14);
 assert.ok(plan.tasks.find(x=>x.id==="M05").needsLiveApproval);
 const bad=structuredClone(plan);
 bad.tasks.find(x=>x.id==="M01").requiresVerified=["M02"];
 bad.tasks.find(x=>x.id==="M02").requiresVerified=["M01"];
 assert.throws(()=>verifyPlan(bad),/CYCLIC_DEPENDENCY/);
});
test("initial start can dispatch 8 in four lanes without premature G6 G7",()=>{
 const d=decide(plan);
 assert.equal(d.ready.length,8);
 assert.deepEqual(new Set(d.ready.map(x=>x.lane)),new Set(["CLOUD","DATA","BUILD","REMEDIATION"]));
 assert.ok(!d.ready.some(x=>["M05","M14"].includes(x.id)));
 assert.equal(d.waiting.find(x=>x.id==="M05").reason,"DEPENDENCY_OR_AUTHORIZATION");
});
test("second start idempotent, lane bounded, duplicate marker fails",()=>{
 const first=decide(plan).ready;
 const issues=first.map((t,i)=>({body:marker(t.id),number:2000+i,state:"open",labels:[{name:"s2cmd:task"}]}));
 const next=decide(plan,issues);
 assert.equal(next.ready.length,0);
 assert.equal(next.present.length,8);
 const pass=decide(plan,issues,{M01:true,M02:true});
 assert.equal(pass.ready.length,2);
 assert.ok(pass.ready.some(x=>x.id==="M03"));
 assert.throws(()=>decide(plan,[issues[0],{...issues[0],number:9999}]),/DUPLICATE_ISSUE/);
});
test("closed issue and CI alone cannot unlock dependencies",()=>{
 const issue={state:"closed",labels:[{name:"s2cmd:audited-pass"}]};
 const weak=[{user:{login:"imihan0630-sys"},body:"CI SUCCESS"}];
 assert.equal(auditPass(issue,"M01",weak),false);
 const good={user:{login:"imihan0630-sys"},body:"[S2CMD-INDEPENDENT-AUDIT-PASS M01]\nhttps://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/123\nArtifact #456\nSHA-256: "+"f".repeat(64)};
 assert.equal(auditPass(issue,"M01",[good]),true);
 assert.equal(auditPass({...issue,state:"open"},"M01",[good]),false);
 assert.equal(auditPass({...issue,labels:[]},"M01",[good]),false);
 assert.equal(auditPass(issue,"M02",[good]),false);
 assert.equal(auditPass(issue,"M01",[{...good,user:{login:"unknown"}}]),false);
});
test("independent audited graph plus explicit separate owner approval is required even to queue Cron",()=>{
 const existing=plan.tasks.filter(t=>!["M05","M14"].includes(t.id)).map((t,i)=>({number:i+1,body:marker(t.id)}));
 const validated=Object.fromEntries(plan.tasks.map(t=>[t.id,true]));
 assert.ok(!decide(plan,existing,validated).ready.some(t=>t.id==="M05"));
 assert.ok(decide(plan,existing,validated,{M05:true}).ready.some(t=>t.id==="M05"));
 const m09=plan.tasks.find(t=>t.id==="M09");
 const body=issueBody(plan,m09,"a".repeat(40));
 assert.ok(body.includes("System 2｜建置總控室"));
 assert.ok(body.includes("Frozen"));
 assert.ok(body.includes("S2-COMMANDER-TASK:M09"));
});
