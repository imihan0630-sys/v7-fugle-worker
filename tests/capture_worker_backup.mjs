import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const baseline=JSON.parse(await readFile('/tmp/v7-predeploy.json','utf8'));
const runtimeResponse=await fetch('https://fugle-test.imihan0630.workers.dev/api/version',{signal:AbortSignal.timeout(20000)});
assert.equal(runtimeResponse.ok,true,'Cannot verify actual runtime version before backup');
const runtime=await runtimeResponse.json();
assert.equal(typeof runtime.version,'string');
const api=`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/workers/scripts/fugle-test`;
const headers={authorization:`Bearer ${process.env.CF_API_TOKEN}`};
const response=await fetch(api+'/content/v2',{headers,signal:AbortSignal.timeout(20000)});
assert.equal(response.ok,true,`Backing up actual deployed content failed: HTTP ${response.status}`);
const content=Buffer.from(await response.arrayBuffer());
assert.ok(content.toString('utf8').includes(runtime.version),'Backup content must contain the current deployed runtime version');
const schedules=await fetch(api+'/schedules',{headers,signal:AbortSignal.timeout(20000)});
assert.equal(schedules.ok,true,'Cannot verify existing Cron schedule before deployment');
const cron=await schedules.json();
assert.equal(cron.success,true);
await mkdir('/tmp/v7-predeploy-backup',{recursive:true});
await writeFile('/tmp/v7-predeploy-backup/content.body',content);
await writeFile('/tmp/v7-predeploy-backup/metadata.json',JSON.stringify({version:runtime.version,
  contentType:response.headers.get('content-type'),mainModule:response.headers.get('cf-main-module'),
  sha256:createHash('sha256').update(content).digest('hex'),schedules:cron.result},null,2));
await writeFile('/tmp/v7-predeploy-backup/monitoring.json',JSON.stringify(baseline,null,2));
console.log(JSON.stringify({backupVerified:true,version:runtime.version,bytes:content.length,contentType:response.headers.get('content-type'),cronCount:cron.result?.schedules?.length ?? cron.result?.length}));
