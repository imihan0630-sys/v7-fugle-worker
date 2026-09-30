import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";

export const LEGACY_AFTER_MARKET_CRON="10 10 * * mon-fri";
export const PRIMARY_AFTER_MARKET_CRON="35 15 * * mon-fri";   // 23:35 Taipei
export const COMBINED_AFTER_MARKET_CRON="35,55 15 * * mon-fri"; // 23:35 + 23:55 Taipei, one trigger

export function normalizeCron(value){
  return String(value||"").trim().replace(/\s+/g," ").toLowerCase();
}

export function ensureAfterMarketRecoverySchedule(schedules){
  const input=(Array.isArray(schedules)?schedules:[])
    .map(item=>typeof item==="string"?{cron:item}:item)
    .filter(item=>item?.cron)
    .map(item=>({cron:String(item.cron)}));

  const normalized=input.map(item=>normalizeCron(item.cron));
  const legacyCount=normalized.filter(x=>x===LEGACY_AFTER_MARKET_CRON).length;
  const primaryCount=normalized.filter(x=>x===PRIMARY_AFTER_MARKET_CRON).length;
  const combinedCount=normalized.filter(x=>x===COMBINED_AFTER_MARKET_CRON).length;

  if(legacyCount>0) throw new Error("Legacy 18:10 after-market Cron still exists; refusing to guess");
  if(combinedCount>1) throw new Error("Duplicate combined 23:35/23:55 Cron detected");
  if(primaryCount>0 && combinedCount>0) throw new Error("Separate 23:35 and combined 23:35/23:55 Cron both exist");

  if(combinedCount===1) return {changed:false,schedules:input};
  if(primaryCount!==1) throw new Error("Expected exactly one 23:35 System1 after-market Cron");
  return {
    changed:true,
    schedules:input.map(item=>normalizeCron(item.cron)===PRIMARY_AFTER_MARKET_CRON?{cron:COMBINED_AFTER_MARKET_CRON}:item)
  };
}

function extractSchedules(payload){
  const result=payload?.result;
  if(Array.isArray(result)) return result;
  if(Array.isArray(result?.schedules)) return result.schedules;
  return [];
}

export async function updateCloudflareAfterMarketRecoveryCron({fetchImpl=fetch,accountId,apiToken,scriptName="fugle-test"}){
  assert.ok(accountId,"CF_ACCOUNT_ID is required");
  assert.ok(apiToken,"CF_API_TOKEN is required");
  assert.equal(scriptName,"fugle-test","System1 recovery Cron updater may only target fugle-test");

  const url=`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}/schedules`;
  const headers={authorization:`Bearer ${apiToken}`,"content-type":"application/json","accept":"application/json"};

  const beforeRes=await fetchImpl(url,{headers,signal:AbortSignal.timeout(20000)});
  assert.equal(beforeRes.ok,true,`Cannot read Cloudflare schedules: HTTP ${beforeRes.status}`);
  const beforePayload=await beforeRes.json();
  assert.equal(beforePayload.success,true,"Cloudflare schedules GET returned success != true");
  const before=extractSchedules(beforePayload);
  const next=ensureAfterMarketRecoverySchedule(before);

  if(next.changed){
    const put=await fetchImpl(url,{
      method:"PUT",headers,
      body:JSON.stringify(next.schedules),
      signal:AbortSignal.timeout(20000)
    });
    assert.equal(put.ok,true,`Cannot update Cloudflare schedules: HTTP ${put.status}`);
    const payload=await put.json();
    assert.equal(payload.success,true,"Cloudflare schedules PUT returned success != true");
  }

  const afterRes=await fetchImpl(url,{headers,signal:AbortSignal.timeout(20000)});
  assert.equal(afterRes.ok,true,`Cannot verify Cloudflare schedules: HTTP ${afterRes.status}`);
  const afterPayload=await afterRes.json();
  assert.equal(afterPayload.success,true,"Cloudflare schedules verification GET returned success != true");
  const after=extractSchedules(afterPayload);
  const normalized=after.map(x=>normalizeCron(x.cron));

  assert.equal(normalized.filter(x=>x===COMBINED_AFTER_MARKET_CRON).length,1,"combined 23:35/23:55 Cron missing/duplicated");
  assert.equal(normalized.includes(PRIMARY_AFTER_MARKET_CRON),false,"separate 23:35 Cron should have been consolidated");
  assert.equal(normalized.includes(LEGACY_AFTER_MARKET_CRON),false,"Legacy 18:10 Cron unexpectedly present");
  assert.equal(after.length,before.length,"Cloudflare Cron count must remain unchanged");

  const preservedBefore=before.map(x=>normalizeCron(x.cron)).filter(x=>x!==PRIMARY_AFTER_MARKET_CRON && x!==COMBINED_AFTER_MARKET_CRON).sort();
  const preservedAfter=after.map(x=>normalizeCron(x.cron)).filter(x=>x!==PRIMARY_AFTER_MARKET_CRON && x!==COMBINED_AFTER_MARKET_CRON).sort();
  assert.deepEqual(preservedAfter,preservedBefore,"Existing System1 Cron schedules changed unexpectedly");

  return {
    ok:true,
    changed:next.changed,
    worker:scriptName,
    before:before.map(x=>x.cron),
    after:after.map(x=>x.cron),
    primaryTaipei:"23:35",
    recoveryTaipei:"23:55",
    combinedCron:COMBINED_AFTER_MARKET_CRON,
    recoverySemantics:"existing runScheduledWithAudit -> runAfterMarketScan({onlyIfMissing:true})",
    system2Changed:false
  };
}

async function main(){
  const result=await updateCloudflareAfterMarketRecoveryCron({
    accountId:process.env.CF_ACCOUNT_ID,
    apiToken:process.env.CF_API_TOKEN,
    scriptName:process.env.SCRIPT_NAME||"fugle-test"
  });
  console.log(JSON.stringify(result,null,2));
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(error=>{console.error(String(error.stack||error));process.exitCode=1;});
}
