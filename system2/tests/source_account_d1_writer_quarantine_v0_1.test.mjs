import assert from "node:assert/strict";
import {readFileSync, mkdtempSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {decideSourceAccountWriterQuarantineV0_1 as decide}
  from "../runtime/source_account_d1_writer_quarantine_v0_1.mjs";
const p=JSON.parse(readFileSync(new URL("../config/source_account_d1_writer_quarantine_v0_1.json",import.meta.url),"utf8"));
assert.equal(p.active,true);
assert.equal(p.automaticRelease,false);
assert.equal(p.denyNewPhysicalD1Reservations,true);
for(const writerId of ["RECENT_A1_WARMUP","DAILY_SHADOW_DIAGNOSTIC",
  "HISTORICAL_ANNUAL_BACKFILL","HISTORICAL_CURRENT_YEAR_SEGMENT"]){
  const v=decide({policy:p,mode:"reserve",writerId});
  assert.equal(v.state,"QUOTA_BUDGET_DEFER");
  assert.equal(v.physicalAllowed,false);
  assert.equal(v.sourceUsageGraphqlQueried,false);
  assert.equal(v.sourceD1SqlRead,false);
  assert.equal(v.sourceD1SqlWrite,false);
}
const result=decide({policy:p,mode:"result",writerId:"RECENT_A1_WARMUP"});
assert.equal(result.shouldDefer,false); // allow previous grant result reconciliation
for(const test of [
  {policy:{...p,active:false},mode:"reserve",writerId:"RECENT_A1_WARMUP"},
  {policy:{...p,automaticRelease:true},mode:"reserve",writerId:"RECENT_A1_WARMUP"},
  {policy:{...p,denyNewPhysicalD1Reservations:false},mode:"reserve",writerId:"RECENT_A1_WARMUP"},
  {policy:{...p,schemaVersion:"UNKNOWN"},mode:"reserve",writerId:"RECENT_A1_WARMUP"},
  {policy:p,mode:"wrong",writerId:"RECENT_A1_WARMUP"},
  {policy:p,mode:"reserve",writerId:"unknown writer"}
])assert.throws(()=>decide(test));

const folder=mkdtempSync(join(tmpdir(),"s2-source-quarantine-"));
try{
  // Actual quota entrypoint invocation, with NO Cloudflare tokens or account
  // credentials, must still safely fail closed before any network request.
  const outfile=join(folder,"receipt.json");
  const cli=fileURLToPath(new URL("../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url));
  const child=spawnSync(process.execPath,[cli],{
    env:{PATH:process.env.PATH||"", HOME:process.env.HOME||"",
      SYSTEM2_D1_GATE_MODE:"reserve",SYSTEM2_D1_WRITER_ID:"RECENT_A1_WARMUP",
      SYSTEM2_D1_GATE_OUTPUT:outfile,GITHUB_EVENT_NAME:"schedule"},
    encoding:"utf8",timeout:10000
  });
  assert.equal(child.status,0,child.stderr);
  const receipt=JSON.parse(readFileSync(outfile,"utf8"));
  assert.equal(receipt.physicalAllowed,false);
  assert.deepEqual(receipt.reasonCodes,["SOURCE_ACCOUNT_SYSTEM1_V8_PROTECTION_QUARANTINE"]);
  assert.equal(receipt.accountUsage.known,false);
  assert.equal(receipt.cloudflareCallsThisGate,0);
  assert.equal(receipt.d1SqlCallsThisGate,0);
  assert.equal(receipt.requestedRowsWritten,null);
  assert.equal(receipt.requestedRowsRead,null);
  assert.equal(receipt.system1ReserveAuthorized,false);
  assert.equal(receipt.system1ReadReserveAuthorized,false);
}finally{rmSync(folder,{recursive:true,force:true})}
console.log("S2_SOURCE_ACCOUNT_QUARANTINE_4_WRITERS_6_NEGATIVES_REAL_CLI_NO_TOKEN_NO_D1_PASS");
