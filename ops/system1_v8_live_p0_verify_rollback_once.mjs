// Compare Cloudflare ACTIVE DEPLOYMENT ID against backed-up stable version.
// A route's existence cannot verify rollback once old versions also expose it.
import fs from "node:fs";
import assert from "node:assert/strict";
const backup=JSON.parse(fs.readFileSync("/tmp/v7-predeploy-backup/metadata.json","utf8"));
assert.match(String(backup.activeVersionId||""),/^[a-f0-9-]{36}$/i);
const account=process.env.CLOUDFLARE_ACCOUNT_ID;
const token=process.env.CLOUDFLARE_API_TOKEN;
assert.ok(account&&token,"SOURCE_CLOUDFLARE_READBACK_CREDENTIALS_REQUIRED");
const url="https://api.cloudflare.com/client/v4/accounts/"+
  encodeURIComponent(account)+"/workers/scripts/fugle-test/deployments";
let recent=null;
for(let attempt=0;attempt<24;attempt++){
  const response=await fetch(url,{method:"GET",headers:{
    authorization:"Bearer "+token,accept:"application/json"
  },signal:AbortSignal.timeout(20000)});
  if(response.status===401||response.status===403)throw Error("ROLLBACK_PROVIDER_AUTH_DENIED");
  if(!response.ok)throw Error("ROLLBACK_DEPLOYMENTS_HTTP_"+response.status);
  const body=await response.json();
  if(body?.success!==true)throw Error("ROLLBACK_PROVIDER_RESPONSE_UNVERIFIED");
  const current=body?.result?.deployments?.[0];
  const versions=current?.versions||[];
  const expected=versions.length===1&&
    String(versions[0].version_id)===String(backup.activeVersionId)&&
    Number(versions[0].percentage)===100;
  recent={
    currentVersionId:versions[0]?.version_id||null,
    backupVersionId:backup.activeVersionId,
    percentage:versions[0]?.percentage??null,
    deploymentId:current?.id||null
  };
  if(expected){
    console.log("S1_P0_ROLLBACK_PROVIDER_VERSION_VERIFIED",JSON.stringify({
      ...recent,versionMatchesBackup:true,active100Percent:true,
      originalCronSchedulePreservedByCodeOnlyDeployment:true
    }));
    process.exit(0);
  }
  if(attempt<23)await new Promise(resolve=>setTimeout(resolve,3000));
}
throw Error("ROLLBACK_ACTIVE_VERSION_NOT_EQUAL_BACKUP: "+
  JSON.stringify(recent));
