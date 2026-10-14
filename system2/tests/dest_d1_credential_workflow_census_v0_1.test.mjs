// Static, fully local negative controls for every GitHub Actions workflow using
// existing DEST D1 write credential. No credential values, Cloudflare API or SQL.
import test from "node:test";
import assert from "node:assert/strict";
import {readdir,readFile} from "node:fs/promises";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=fileURLToPath(new URL("../../",import.meta.url));
const workflowDir=join(ROOT,".github/workflows");
const registry=JSON.parse(await readFile(new URL("../config/dest_d1_credential_workflow_census_v0_1.json",import.meta.url),"utf8"));
const dest=JSON.parse(await readFile(new URL("../config/dest_d1_cross_workflow_writer_interlock_v0_1.json",import.meta.url),"utf8"));
const writeCats=new Set(["WRITER","OWNER_GATED_WRITER"]);
const read=async path=>await readFile(join(ROOT,path),"utf8");
test("credential workflow discovery must exactly equal explicitly reviewed source roster",async()=>{
 assert.equal(registry.schemaVersion,"S2_DEST_D1_CREDENTIAL_WORKFLOW_CENSUS_V0_1");
 assert.equal(registry.runMayReadCredentialValue,false);
 assert.equal(registry.cloudflarePhysicalTokenScopeNotVerified,true);
 assert.equal(registry.allAccountWritersAudited,false);
 const files=(await readdir(workflowDir)).filter(x=>/\.ya?ml$/.test(x));
 const content=await Promise.all(files.map(async f=>({f,source:await readFile(join(workflowDir,f),"utf8")})));
 const found=content.filter(x=>x.source.includes(registry.credentialName)).map(x=>".github/workflows/"+x.f).sort();
 const declared=registry.codePaths.map(x=>x.path).sort();
 assert.deepEqual(found,declared,"NEW DESTINATION D1 CREDENTIAL USER MUST BE REVIEWED AND CLASSIFIED BEFORE MERGE");
 assert.equal(new Set(declared).size,declared.length);
 assert.equal(registry.codePaths.filter(x=>writeCats.has(x.category)).length,registry.expectedWriteCapableCount);
 assert.equal(registry.codePaths.filter(x=>!writeCats.has(x.category)).length,registry.expectedOtherCredentialReferenceCount);
});
test("all four write-capable credential flows must be in exact shared destination lock and GH native UTC-day guard",async()=>{
 assert.equal(dest.accountWideWriterCensusComplete,false);
 assert.equal(dest.atomicD1LeaseOrReservationAccepted,false);
 const expected="s2-dest-d1-historical-and-diagnostic-writer";
 assert.equal(dest.sharedJobConcurrencyGroup,expected);
 const writeRows=registry.codePaths.filter(x=>writeCats.has(x.category));
 assert.equal(writeRows.length,4);
 for(const row of writeRows){
  const item=dest.writers.find(x=>x.id===row.writerId&&x.workflow===row.path);
  assert.ok(item,"write-enabled workflow not registered: "+row.path);
  const code=await read(row.path);
  assert.ok(code.includes("group: "+expected),row.path+":missing matching interlock");
  assert.ok(code.includes("node system2/scripts/dest_d1_writer_run_interlock_v0_1.mjs"),row.path+":missing real GH preflight");
  assert.ok(code.includes("S2_DEST_WRITER_CLASS: "+row.writerId),row.path+":wrong identity");
  assert.ok(code.includes("actions: read"),row.path+":missing scoped GitHub native evidence");
  assert.ok(code.includes("environment: system2-schema-only"),row.path+":wrong target account environment");
  assert.ok(!code.includes("environment: system2-research"),row.path+":must never use source environment");
 }
});
test("owner manual APPLY_ONCE requires exact confirmation and real day gate; VERIFY_ONLY remains non-writing",async()=>{
 const code=await read(".github/workflows/system2-destination-schema-only-manual.yml");
 assert.match(code,/if: github\.ref == 'refs\/heads\/main' && github\.event_name == 'workflow_dispatch'/);
 assert.match(code,/test "\$ACK" = 'APPLY_EXISTING_DEST_D1_SCHEMA_ONLY_55'/);
 assert.match(code,/test "\$BOUNDARY" = 'NO_SOURCE_NO_DATA_NO_WORKER_NO_CRON_NO_PAID'/);
 assert.match(code,/if: inputs\.action == 'APPLY_ONCE'\n        id: day_interlock/);
 assert.match(code,/if: inputs\.action == 'VERIFY_ONLY' \|\| steps\.day_interlock\.outputs\.allowed == 'true'/);
 assert.ok(code.indexOf("node system2/scripts/dest_d1_writer_run_interlock_v0_1.mjs")<code.indexOf("secrets.S2_SCHEMA_DEST_D1_WRITE_TOKEN"));
 assert.match(code,/s2-dest-d1-writer-day-interlock\/receipt\.json/);
});
test("non-writer credential users must stay explicitly declared, without unreviewed auto-write authority",async()=>{
 const rows=registry.codePaths.filter(x=>!writeCats.has(x.category));
 for(const row of rows){
  assert.ok(["READ_ONLY_SELECT","READ_ONLY_ANALYTICS","ENCRYPTION_ONLY_NO_D1_WRITE"].includes(row.category));
  const code=await read(row.path);
  assert.ok(code.includes(registry.credentialName),row.path);
  assert.ok(!dest.writers.some(x=>x.workflow===row.path),row.path+":do not claim registered writer without proof");
 }
 assert.equal(registry.nonScriptCloudflareAndOtherSecretPathsNotCovered,true);
});
