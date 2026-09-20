import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";

export const OLD_AFTER_MARKET_CRON="10 10 * * mon-fri";
export const NEW_AFTER_MARKET_CRON="35 15 * * mon-fri";

export function normalizeCron(value){
  return String(value||"").trim().replace(/\s+/g," ").toLowerCase();
}

export function replaceAfterMarketSchedule(schedules){
  const input=(Array.isArray(schedules)?schedules:[]).map(item=>typeof item==="string"?{cron:item}:item).filter(item=>item?.cron);
  const oldMatches=input.filter(item=>normalizeCron(item.cron)===OLD_AFTER_MARKET_CRON);
  const newMatches=input.filter(item=>normalizeCron(item.cron)===NEW_AFTER_MARKET_CRON);
  if(oldMatches.length>1||newMatches.length>1) throw new Error("Duplicate after-market Cron detected");
  if(oldMatches.length===0&&newMatches.length===0) throw new Error("Existing after-market Cron not found; refusing to guess");
  if(oldMatches.length===1&&newMatches.length===1) throw new Error("Old and new after-market Cron both exist; manual review required");
  if(newMatches.length===1) return {changed:false,schedules:input.map(x=>({cron:x.cron}))};
  return {
    changed:true,
    schedules:input.map(item=>normalizeCron(item.cron)===OLD_AFTER_MARKET_CRON?{cron:NEW_AFTER_MARKET_CRON}:{cron:item.cron})
  };
}

function extractSchedules(payload){
  const result=payload?.result;
  if(Array.isArray(result)) return result;
  if(Array.isArray(result?.schedules)) return result.schedules;
  return [];
}

export async function updateCloudflareAfterMarketCron({fetchImpl=fetch,accountId,apiToken,scriptName="fugle-test"}){
  assert.ok(accountId,"CF_ACCOUNT_ID is required");
  assert.ok(apiToken,"CF_API_TOKEN is required");
  const url=`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}/schedules`;
  const headers={authorization:`Bearer ${apiToken}`,"content-type":"application/json","accept":"application/json"};
  const beforeRes=await fetchImpl(url,{headers,signal:AbortSignal.timeout(20000)});
  assert.equal(beforeRes.ok,true,`Cannot read Cloudflare schedules: HTTP ${beforeRes.status}`);
  const beforePayload=await beforeRes.json();
  assert.equal(beforePayload.success,true,"Cloudflare schedules GET returned success != true");
  const before=extractSchedules(beforePayload);
  const migrated=replaceAfterMarketSchedule(before);
  if(migrated.changed){
    const put=await fetchImpl(url,{method:"PUT",headers,body:JSON.stringify(migrated.schedules),signal:AbortSignal.timeout(20000)});
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
  assert.equal(normalized.includes(NEW_AFTER_MARKET_CRON),true,"23:35 Taipei after-market Cron missing");
  assert.equal(normalized.includes(OLD_AFTER_MARKET_CRON),false,"Legacy 18:10 after-market Cron still present");
  assert.equal(after.length,before.length,"Cron count changed unexpectedly");
  return {ok:true,changed:migrated.changed,before:before.map(x=>x.cron),after:after.map(x=>x.cron),afterMarketTaipei:"23:35"};
}

async function main(){
  const result=await updateCloudflareAfterMarketCron({
    accountId:process.env.CF_ACCOUNT_ID,
    apiToken:process.env.CF_API_TOKEN,
    scriptName:process.env.SCRIPT_NAME||"fugle-test"
  });
  console.log(JSON.stringify(result));
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(error=>{console.error(String(error.stack||error));process.exitCode=1;});
}
