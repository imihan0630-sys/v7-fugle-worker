// DATA_LANE: fail closed before creating any Cloudflare D1 database adapter.
import assert from "node:assert/strict";
import {readFile,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {qualifyOct08D1ReadonlyBudgetV0_1} from "../runtime/oct08_readonly_d1_account_budget_qualification_v0_1.mjs";

export async function requireOct08ReadonlyBudgetQualificationV0_1(mode,{
 env=process.env,clock=()=>new Date().toISOString(),
}={}){
 const attestationPath=env.S2_OCT08_READ_BUDGET_ATTESTATION_PATH;
 assert.ok(typeof attestationPath==="string"&&
  /^system2\/evidence\/[A-Za-z0-9_.-]+\.json$/.test(attestationPath),
  "OCT08_READ_BUDGET_EVIDENCE_REQUIRED_MAIN_TRACKED_JSON");
 const root=resolve(import.meta.dirname,"../..");
 const scoutEvidencePath=env.S2_OCT08_PRIOR_SCOUT_ACCEPTANCE_PATH;
 if(mode==="FULL_11843"){
  assert.ok(typeof scoutEvidencePath==="string"&&
   /^system2\/evidence\/[A-Za-z0-9_.-]+\.json$/.test(scoutEvidencePath),
   "FULL_CENSUS_PRIOR_36_SCOUT_PHYSICAL_ACCEPTANCE_MAIN_JSON_REQUIRED");
 }
 const [attestation,system1ReservePolicy,writerRegistry,scoutAcceptance]=await Promise.all([
  readFile(resolve(root,attestationPath),"utf8").then(JSON.parse),
  readFile(resolve(root,"system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json"),"utf8").then(JSON.parse),
  readFile(resolve(root,"system2/config/d1_account_writer_registry_v0_1.json"),"utf8").then(JSON.parse),
  mode==="FULL_11843"?readFile(resolve(root,scoutEvidencePath),"utf8").then(JSON.parse):Promise.resolve(null),
 ]);
 const confirmation=mode==="SAMPLE_36"
  ?env.S2_NO_COMPETING_D1_WRITER_CONFIRMED==="true"
  :env.S2_D1_NO_COMPETING_WRITER_CONFIRMED==="true";
 return qualifyOct08D1ReadonlyBudgetV0_1({
  mode,attestation,system1ReservePolicy,writerRegistry,now:clock(),
  scoutAcceptance,
  noCompetingWriterConfirmed:confirmation,
 });
}

if(process.argv[1]&&import.meta.url===new URL("file://"+resolve(process.argv[1])).href){
 const mode=process.argv[2]||"";
 const output=process.env.S2_OCT08_BUDGET_GATE_RESULT||
  "/tmp/s2-oct08-read-budget-evidence-preflight.json";
 let receipt;
 try{
  const proof=await requireOct08ReadonlyBudgetQualificationV0_1(mode);
  receipt={...proof,checkedAt:new Date().toISOString(),noD1AdapterConstructed:true};
 }catch(error){
  receipt={
   schemaVersion:"S2_OCT08_READONLY_D1_BUDGET_BLOCKED_V0_1",
   state:"READ_ONLY_D1_BUDGET_EVIDENCE_DEFER",
   mode,checkedAt:new Date().toISOString(),
   reason:String(error?.message||error).slice(0,380),
   actualD1QueriesExecuted:0,d1RowsRead:0,d1RowsWritten:0,
   physicalReadAuthorized:false,physicalWriteAuthorized:false,
  };
  process.exitCode=1;
 }
 await writeFile(output,JSON.stringify(receipt,null,2)+"\n","utf8");
 console.log("S2_OCT08_READ_BUDGET_QUALIFICATION "+JSON.stringify(receipt));
}
