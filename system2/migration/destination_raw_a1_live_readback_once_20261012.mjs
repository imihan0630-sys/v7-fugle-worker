// One-time, destination-only readback of current migration counters during active source->dest copy.
// Protected GH runner. NO UPDATE, DELETE, INSERT, DDL, production Worker/Cron or source calls.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
const sha=x=>createHash("sha256").update(String(x).toLowerCase()).digest("hex");
const acct="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const db="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
const token=process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,account=process.env.S2_SCHEMA_DEST_ACCOUNT_ID;
const record={schemaVersion:"S2_DEST_LIVE_COPY_READBACK_ONCE_20261012_V0_1",
  status:"UNKNOWN",sourceWrites:0,destinationWritesRequested:0,sourceA1BarsExpected:84688,
  plannedIngestBatches:129,ownerCopyGateWaived:true,certifiedPIT:false,
  observedAtUtc:new Date().toISOString()};
const fail=x=>{throw Error("READ_ONLY_DEST_"+x)};
async function request(path,method="GET",body){
 const r=await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+path,{
   method,headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
   ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(40000)});
 const d=await r.json().catch(()=>null);
 if(!r.ok||d?.success!==true){
   record.errorStatus=r.status;
   record.errorCodes=Array.isArray(d?.errors)?d.errors.slice(0,3).map(x=>x.code??"UNKNOWN"):[];
   fail("CLOUDFLARE_READ_FAILED");
 }
 return d.result;
}
try{
 if(!token||!account||sha(account)!==acct)fail("ACCOUNT_IDENTITY");
 const list=await request("/d1/database?per_page=100");
 if(!Array.isArray(list)||list.length!==1||list[0].name!=="system2-research")fail("DATABASE_UNIVERSE");
 const selected=list[0];const id=selected.uuid||selected.id;
 if(sha(id)!==db)fail("D1_FINGERPRINT");
 record.destinationFileSizeBytes=selected.file_size??null;
 const sql="SELECT (SELECT COUNT(*) FROM s2_historical_a1_bars) AS a1_bars, (SELECT COUNT(*) FROM s2_historical_ingest_batches) AS batches, (SELECT COUNT(*) FROM s2_decisions) AS frozen_decisions";
 const result=await request("/d1/database/"+id+"/query","POST",{sql});
 if(!Array.isArray(result)||result.length!==1||result[0]?.success!==true||result[0].results?.length!==1)fail("READBACK_RESPONSE");
 const row=result[0].results[0];
 for(const [key,max] of [["a1_bars",84688],["batches",129],["frozen_decisions",0]])
   if(!Number.isSafeInteger(row[key])||row[key]<0||row[key]>max)fail("READBACK_OUT_OF_RANGE");
 record.sourceD1UnchangedByThisRun=true;
 record.destinationA1Rows=row.a1_bars;
 record.destinationBatchRows=row.batches;
 record.destinationFrozenRows=row.frozen_decisions;
 record.providerQueryRowsRead=result[0].meta?.rows_read??null;
 record.providerQueryRowsWritten=result[0].meta?.rows_written??null;
 record.status="REAL_PROVIDER_DEST_D1_READBACK_OBSERVED__COPY_COMPLETENESS_NOT_ASSERTED";
}catch(err){
 record.status="READ_ONLY_READBACK_FAIL_CLOSED";
 record.error=/^READ_ONLY_DEST_[A-Z_]+$/.test(String(err.message))?err.message:"READ_ONLY_DEST_UNKNOWN_FAILURE";
 process.exitCode=2;
}finally{
 record.completedAtUtc=new Date().toISOString();
 const dir="/tmp/s2-copy-live-readback";await mkdir(dir,{recursive:true,mode:0o700});
 await writeFile(dir+"/sanitized-original-provider-readback.json",JSON.stringify(record,null,2)+"\n",{mode:0o600});
 console.log(JSON.stringify({status:record.status,rows:record.destinationA1Rows??null,batches:record.destinationBatchRows??null,
   providerRowsWritten:record.providerQueryRowsWritten??null,error:record.error??null}));
}
