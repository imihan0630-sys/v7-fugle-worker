import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const baseline=JSON.parse(await readFile('/tmp/v7-predeploy.json','utf8'));
const runtimeResponse=await fetch('https://fugle-test.imihan0630.workers.dev/api/version?backupCheck='+Date.now(),{
  headers:{'accept':'application/json','cache-control':'no-cache','user-agent':'V7-GitHub-Deploy/1.0'},
  signal:AbortSignal.timeout(20000)
});
assert.equal(runtimeResponse.ok,true,'Cannot verify actual runtime version before backup');
const runtime=await runtimeResponse.json();
assert.equal(typeof runtime.version,'string');

if(process.env.V7_ADMIN_TOKEN) {
  const configResponse=await fetch('https://fugle-test.imihan0630.workers.dev/api/config?backupCheck='+Date.now(),{
    headers:{'x-admin-token':process.env.V7_ADMIN_TOKEN,'cache-control':'no-cache'},
    signal:AbortSignal.timeout(20000)
  });
  assert.equal(configResponse.ok,true,'Normal admin authorization is required to verify actual targets before deployment');
  const config=await configResponse.json();
  baseline.plannedSymbols=config.stocks.map(stock=>stock.symbol).sort();
  assert.equal(config.updatedAt,baseline.configUpdatedAt);
  await writeFile('/tmp/v7-predeploy.json',JSON.stringify(baseline));
}

const api=`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/workers/scripts/fugle-test`;
const headers={authorization:`Bearer ${process.env.CF_API_TOKEN}`};

const deploymentsResponse=await fetch(api+'/deployments',{headers,signal:AbortSignal.timeout(20000)});
assert.equal(deploymentsResponse.ok,true,`Cannot read active Worker deployment: HTTP ${deploymentsResponse.status}`);
const deployments=await deploymentsResponse.json();
assert.equal(deployments.success,true,'Cloudflare deployments API returned success != true');
const activeDeployment=deployments?.result?.deployments?.[0];
assert.ok(activeDeployment?.id,'Active Worker deployment is missing');
const activeVersions=Array.isArray(activeDeployment.versions)?activeDeployment.versions:[];
assert.equal(activeVersions.length,1,'Pre-deploy backup requires one active Worker version; gradual deployment needs manual review');
const activeVersion=activeVersions[0];
assert.equal(Number(activeVersion.percentage),100,'Pre-deploy backup requires the active Worker version to serve 100% traffic');
assert.ok(activeVersion.version_id,'Active Worker version id is missing');

const versionResponse=await fetch(api+'/versions/'+encodeURIComponent(activeVersion.version_id),{headers,signal:AbortSignal.timeout(20000)});
assert.equal(versionResponse.ok,true,`Cannot read active Worker version metadata: HTTP ${versionResponse.status}`);
const versionDetail=await versionResponse.json();
assert.equal(versionDetail.success,true,'Cloudflare version API returned success != true');
assert.equal(versionDetail?.result?.id,activeVersion.version_id,'Active deployment/version mismatch');

const contentResponse=await fetch(api+'/content/v2',{headers,signal:AbortSignal.timeout(20000)});
assert.equal(contentResponse.ok,true,`Backing up latest Worker script content failed: HTTP ${contentResponse.status}`);
const latestContent=Buffer.from(await contentResponse.arrayBuffer());
const latestContentText=latestContent.toString('utf8');
const embeddedVersions=[...new Set([...latestContentText.matchAll(/const VERSION = ["']([^"']+)["']/g)].map(m=>m[1]))];

const schedules=await fetch(api+'/schedules',{headers,signal:AbortSignal.timeout(20000)});
assert.equal(schedules.ok,true,'Cannot verify existing Cron schedule before deployment');
const cron=await schedules.json();
assert.equal(cron.success,true);

await mkdir('/tmp/v7-predeploy-backup',{recursive:true});
await writeFile('/tmp/v7-predeploy-backup/latest-content.body',latestContent);
await writeFile('/tmp/v7-predeploy-backup/deployments.json',JSON.stringify(deployments,null,2));
await writeFile('/tmp/v7-predeploy-backup/active-version.json',JSON.stringify(versionDetail,null,2));
await writeFile('/tmp/v7-predeploy-backup/metadata.json',JSON.stringify({
  version:runtime.version,
  runtimeVersion:runtime.version,
  activeDeploymentId:activeDeployment.id,
  activeVersionId:activeVersion.version_id,
  activeVersionPercentage:Number(activeVersion.percentage),
  activeVersionEtag:versionDetail?.result?.resources?.script?.etag||null,
  latestContentType:contentResponse.headers.get('content-type'),
  latestContentMainModule:contentResponse.headers.get('cf-main-module'),
  latestContentSha256:createHash('sha256').update(latestContent).digest('hex'),
  latestContentEmbeddedVersions:embeddedVersions,
  latestContentMatchesRuntime:embeddedVersions.includes(runtime.version),
  schedules:cron.result
},null,2));
await writeFile('/tmp/v7-predeploy-backup/monitoring.json',JSON.stringify(baseline,null,2));

console.log(JSON.stringify({
  backupVerified:true,
  runtimeVersion:runtime.version,
  activeDeploymentId:activeDeployment.id,
  activeVersionId:activeVersion.version_id,
  activeVersionPercentage:Number(activeVersion.percentage),
  latestContentBytes:latestContent.length,
  latestContentEmbeddedVersions:embeddedVersions,
  latestContentMatchesRuntime:embeddedVersions.includes(runtime.version),
  cronCount:cron.result?.schedules?.length ?? cron.result?.length
}));
