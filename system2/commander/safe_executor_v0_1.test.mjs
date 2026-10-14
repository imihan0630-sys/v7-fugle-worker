import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateRegistry,assessSourceRoute,assessQuotaInterlock,evaluateSafeJobs,runOneTest} from "./safe_executor_v0_1.mjs";
import {stableFindingDigest,renderEvidenceComment} from "./safe_executor_report_v0_1.mjs";
const manifest=JSON.parse(await readFile(new URL("./dispatch_plan_v0_1.json",import.meta.url),"utf8"));
const registry=JSON.parse(await readFile(new URL("./safe_job_registry_v0_1.json",import.meta.url),"utf8"));
const disabled="if: "+String.fromCharCode(36)+"{{ false }}";
test("all 14 tasks classified and only M08/M12 executable without AI",()=>{
 assert.equal(validateRegistry(manifest,registry),true);
 assert.deepEqual(registry.autoTaskIds,["M08","M12"]);
 for(const id of ["M01","M02","M03","M05","M07","M09","M14"])assert.equal(registry.taskTypes[id],"APPROVAL_REQUIRED");
 const bad=structuredClone(registry);bad.autoTaskIds.push("M05");
 assert.throws(()=>validateRegistry(manifest,bad),/SCOPE_ESCALATION/);
});
test("source old Cron quarantine and both new target environments are fail-closed",()=>{
 const a=assessSourceRoute({source:"jobs:\n  deploy:\n    "+disabled,daily:"environment: system2-schema-only\ngithub.event_name != 'push'",
 raw:"environment: system2-schema-only\nS2_OWNER_OVERRIDE_RAW_COPY_20261012",
 quarantine:{active:true,automaticRelease:false}});
 assert.equal(a.findings.length,0);
 const b=assessSourceRoute({source:"if: true",daily:"environment: system2-research",
 raw:"environment: system2-research",quarantine:{active:false,automaticRelease:true}});
 assert.ok(b.findings.length>=5);
 assert.equal(b.accountCredentialMatchPhysicallyObserved,false);
});
test("different concurrency groups remain blocked; 71322+13130 exceeds owner 80000",()=>{
 const v=assessQuotaInterlock({daily:"group: system2-isolated-d1-writer",
 warmup:"group: system2-isolated-d1-writer",
 manualSchema:"group: system2-new-account-schema-only-single-run",
 raw:"group: s2-dest-owner-override-original-raw-copy-only",registry:{writers:[
 {id:"DAILY_SHADOW_DIAGNOSTIC",reservationModel:{rowsWritten:13130}}
 ]},importer:"const limit=80000, stopAt=75000, maxStatementRows=80"});
 assert.equal(v.assertions.sameGroupSerializesWriters,false);
 assert.equal(v.assertions.rawWriterRegisteredInDestRegistry,false);
 assert.equal(v.collisionScenario.sum,84452);
 assert.equal(v.collisionScenario.wouldExceedUserCap,true);
 assert.equal(v.collisionScenario.notCurrentUtcDayBalance,true);
 assert.equal(v.authorizedConcurrentWrite,false);
});
test("safe executor runs six allowlisted test paths only, can't create formal acceptance",async()=>{
 const data={
 source:disabled,daily:"environment: system2-schema-only\ngithub.event_name != 'push'\ngroup: system2-isolated-d1-writer",
 raw:"environment: system2-schema-only\nS2_OWNER_OVERRIDE_RAW_COPY_20261012\ngroup: s2-dest-owner-override-original-raw-copy-only",
 warmup:"environment: system2-schema-only\ngroup: system2-isolated-d1-writer",
 manualSchema:"environment: system2-schema-only",
 sourceQuarantine:JSON.stringify({active:true,automaticRelease:false}),
 registry:JSON.stringify({writers:[{id:"DAILY_SHADOW_DIAGNOSTIC",reservationModel:{rowsWritten:13130}}]}),
 destRegistry:JSON.stringify({writers:[{id:"RAW_COPY",workflow:".github/workflows/system2-owner-override-raw-d1-copy-20261012.yml"},{id:"DAILY_DIAGNOSTIC",workflow:".github/workflows/system2-daily-shadow-diagnostic.yml"},{id:"RECENT_A1_WARMUP",workflow:".github/workflows/system2-recent-a1-hot-history-warmup.yml"},{id:"MANUAL_SCHEMA_APPLY",workflow:".github/workflows/system2-destination-schema-only-manual.yml",writeOnlyWhenInputAction:"APPLY_ONCE"}],sharedJobConcurrencyGroup:"s2-dest-d1-historical-and-diagnostic-writer",accountWideWriterCensusComplete:false}),
 rawImporter:"const limit=80000, stopAt=75000, maxStatementRows=80"
 };
 const paths=[];const out=await evaluateSafeJobs({manifest,registry,readText:async p=>{
  const entry=Object.entries({
   source:".github/workflows/system2-resonance-deploy.yml",daily:".github/workflows/system2-daily-shadow-diagnostic.yml",
   raw:".github/workflows/system2-owner-override-raw-d1-copy-20261012.yml",
   warmup:".github/workflows/system2-recent-a1-hot-history-warmup.yml",
   manualSchema:".github/workflows/system2-destination-schema-only-manual.yml",
   sourceQuarantine:"system2/config/source_account_d1_writer_quarantine_v0_1.json",
   registry:"system2/config/d1_account_writer_registry_v0_1.json",
   destRegistry:"system2/config/dest_d1_cross_workflow_writer_interlock_v0_1.json",
   rawImporter:"system2/migration/owner_override_raw_d1_import_20261012.mjs"}).find(([key,val])=>val===p);
  if(!entry)throw Error("DYNAMIC_FILE");return data[entry[0]];
 },testRunner:async p=>{paths.push(p);return{path:p,passed:true,testCount:1,failCount:0}}});
 assert.equal(paths.length,7);
 assert.deepEqual(new Set(paths),new Set(registry.allowlistedTests.M08.concat(registry.allowlistedTests.M12)));
 assert.equal(out.results.M12.state,"FINDINGS_REMEDIATION_REQUIRED");
 assert.equal(out.results.M08.state,"OFFLINE_CHECKS_PASS_NOT_PHYSICAL");
 assert.equal(out.results.M08.taskFormallyAccepted,false);
 assert.equal(out.actualCloudflareCalls,0);
 assert.equal(out.actualCloudflareWrites,0);
 const receipt={...out,github:{runId:"123",headSha:"a".repeat(40)}};
 const fingerprint=stableFindingDigest(receipt);
 assert.equal(fingerprint.length,64);
 const altered={...receipt,github:{runId:"999",headSha:"f".repeat(40)}};
 assert.equal(stableFindingDigest(altered),fingerprint);
 const comment=renderEvidenceComment("M12",receipt,{id:777,name:"original",digest:"sha256:"+"1".repeat(64)},fingerprint);
 assert.ok(comment.includes("Artifact #777"));
});
test("actual pre-registered pure unit test executes in isolated node subprocess",async()=>{
 const r=await runOneTest("system2/tests/source_account_d1_writer_quarantine_v0_1.test.mjs");
 assert.equal(r.passed,true);
 assert.ok(r.testCount>=1);
 await assert.rejects(()=>runOneTest("../../Worker.js"),/UNREGISTERED_PATH/);
});
