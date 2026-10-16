// Capture exact github.event.schedule from original Actions event payload.
// Does NOT infer actual scheduled timestamp, certify source PIT, or authorize Frozen.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const EXPECTED=new Set(['15 12 * * 1-5','45 15 * * 1-5','15 16 * * 1-5']);
export async function makeA1GithubOriginV0_1({
 eventName,event,runId,runAttempt,codeSha
}={}){
 if(!['schedule','push','workflow_dispatch'].includes(eventName)||
    !Number.isSafeInteger(runId)||runId<1||
    !Number.isSafeInteger(runAttempt)||runAttempt<1||
    !/^[0-9a-f]{40}$/i.test(codeSha||''))
  throw Error('A1_ORIGIN_GITHUB_CONTEXT_INVALID');
 const cron=eventName==='schedule'?event?.schedule:null;
 if(eventName==='schedule'&&!EXPECTED.has(cron))
  throw Error('A1_ORIGIN_SCHEDULE_EVENT_CRON_UNVERIFIED');
 const base={schemaVersion:'S2_A1_GITHUB_ORIGIN_V0_1',
  source:'GITHUB_EVENT_PAYLOAD_SCHEDULE_EXPRESSION_NOT_EXECUTION_TIMESTAMP',
  eventName,eventSchedule:cron,runId,runAttempt,codeSha,
  selectionAuthorized:false,frozenD1Written:false};
 return {...base,originHash:await sha256Hex(base)};
}
if(process.argv[1]?.endsWith('/record_shared_a1_github_schedule_origin_v0_1.mjs')){
 const payload=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8'));
 const result=await makeA1GithubOriginV0_1({
  eventName:process.env.GITHUB_EVENT_NAME,event:payload,
  runId:Number(process.env.GITHUB_RUN_ID),
  runAttempt:Number(process.env.GITHUB_RUN_ATTEMPT),
  codeSha:process.env.GITHUB_SHA
 });
 const dir='/tmp/s2-shared-a1-official-incremental';
 await mkdir(dir,{recursive:true,mode:0o700});
 await writeFile(resolve(dir,'source-github-origin.json'),
  JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({eventName:result.eventName,
  scheduleCron:result.eventSchedule,originHash:result.originHash,
  noSelection:true}));
}
