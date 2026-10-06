import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";

export const PRIMARY_AFTER_MARKET_CRON="35 15 * * mon-fri";
export const RECOVERY_AFTER_MARKET_CRON="55 15 * * mon-fri";
export const COMBINED_AFTER_MARKET_CRON="35,55 15 * * mon-fri";

export function normalizeCron(value){
  return String(value||"").trim().replace(/\s+/g," ").toLowerCase();
}

export function splitAfterMarketRecoverySchedule(schedules){
  const input=(Array.isArray(schedules)?schedules:[])
    .map(item=>typeof item==="string"?{cron:item}:item)
    .filter(item=>item?.cron)
    .map(item=>({cron:String(item.cron)}));

  const normalized=input.map(item=>normalizeCron(item.cron));
  const combinedCount=normalized.filter(x=>x===COMBINED_AFTER_MARKET_CRON).length;
  const primaryCount=normalized.filter(x=>x===PRIMARY_AFTER_MARKET_CRON).length;
  const recoveryCount=normalized.filter(x=>x===RECOVERY_AFTER_MARKET_CRON).length;

  if(combinedCount>1||primaryCount>1||recoveryCount>1) throw new Error("Duplicate after-market Cron detected");
  if(combinedCount===1&&(primaryCount||recoveryCount)) throw new Error("Combined and separate after-market Cron coexist; manual review required");

  if(primaryCount===1&&recoveryCount===1){
    return {changed:false,schedules:input};
  }

  if(combinedCount!==1) throw new Error("Expected exactly one combined 23:35/23:55 Cron");
  if(input.length>=5) throw new Error("Split would exceed conservative five-trigger ceiling; manual plan/limit review required");

  const out=[];
  for(const item of input){
    if(normalizeCron(item.cron)===COMBINED_AFTER_MARKET_CRON){
      out.push({cron:PRIMARY_AFTER_MARKET_CRON},{cron:RECOVERY_AFTER_MARKET_CRON});
    }else{
      out.push({cron:item.cron});
    }
  }
  return {changed:true,schedules:out};
}

function extractSchedules(payload){
  const result=payload?.result;
  if(Array.isArray(result)) return result;
  if(Array.isArray(result?.schedules)) return result.schedules;
  return [];
}

export async function updateCloudflareSplitRecoveryCron({fetchImpl=fetch,accountId,apiToken,scriptName="fugle-test"}){
  assert.ok(accountId,"CF_ACCOUNT_ID is required");
  assert.ok(apiToken,"CF_API_TOKEN is required");
  assert.equal(scriptName,"fugle-test","PVE-253 split recovery updater may only target fugle-test");

  const url=`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}/schedules`;
  const headers={authorization:`Bearer ${apiToken}`,"content-type":"application/json","accept":"application/json"};

  const beforeRes=await fetchImpl(url,{headers,signal:AbortSignal.timeout(20000)});
  assert.equal(beforeRes.ok,true,`Cannot read Cloudflare schedules: HTTP ${beforeRes.status}`);
  const beforePayload=await beforeRes.json();
  assert.equal(beforePayload.success,true,"Cloudflare schedules GET returned success != true");
  const before=extractSchedules(beforePayload);
  const next=splitAfterMarketRecoverySchedule(before);

  if(next.changed){
    const put=await fetchImpl(url,{
      method:"PUT",headers,body:JSON.stringify(next.schedules),signal:AbortSignal.timeout(20000)
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

  assert.equal(normalized.filter(x=>x===PRIMARY_AFTER_MARKET_CRON).length,1,"23:35 primary Cron missing/duplicated");
  assert.equal(normalized.filter(x=>x===RECOVERY_AFTER_MARKET_CRON).length,1,"23:55 recovery Cron missing/duplicated");
  assert.equal(normalized.includes(COMBINED_AFTER_MARKET_CRON),false,"combined Cron must be removed after split");
  assert.ok(after.length<=5,"post-split Cron inventory exceeds conservative five-trigger ceiling");

  const preservedBefore=before.map(x=>normalizeCron(x.cron)).filter(x=>x!==COMBINED_AFTER_MARKET_CRON).sort();
  const preservedAfter=after.map(x=>normalizeCron(x.cron)).filter(x=>x!==PRIMARY_AFTER_MARKET_CRON&&x!==RECOVERY_AFTER_MARKET_CRON).sort();
  assert.deepEqual(preservedAfter,preservedBefore,"Non-PVE System1 Cron schedules changed unexpectedly");

  return {ok:true,changed:next.changed,before:before.map(x=>x.cron),after:after.map(x=>x.cron)};
}

async function main(){
  const result=await updateCloudflareSplitRecoveryCron({
    accountId:process.env.CF_ACCOUNT_ID,
    apiToken:process.env.CF_API_TOKEN,
    scriptName:process.env.SCRIPT_NAME||"fugle-test"
  });
  console.log(JSON.stringify(result,null,2));
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(error=>{console.error(String(error.stack||error));process.exitCode=1;});
}
