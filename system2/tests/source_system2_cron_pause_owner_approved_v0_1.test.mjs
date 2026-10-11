import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceCronPauseV0_1,APPROVED_CRON} from '../migration/source_system2_cron_pause_owner_approved_v0_1.mjs';
const id='1'.repeat(32), db='2'.repeat(32);
function fixture({
 cron=[APPROVED_CRON],v8Cron=['35 15 * * MON-FRI'],
 workerIds=['fugle-test','system2-shadow-research'],
 dbNames=['v7-live','system2-research'],boundDb=db,
 guard=true,putError=false,wrongAfter=false,
}={}){
 const log=[];let schedules=cron;
 return {
  log,readDeployGuard:async()=>guard,accountId:id,token:'FIXTURE_NEVER_ACTUAL_TOKEN',
  clock:()=>new Date('2026-10-11T12:42:00Z').toISOString(),
  fetchImpl:async(url,opts={})=>{
   const u=new URL(url);const p=u.pathname;
   log.push({p,method:opts.method,body:opts.body??null});
   let result;
   if(opts.method==='PUT'){
    if(putError)return new Response(JSON.stringify({success:false}),{status:403});
    if(p.endsWith('/workers/scripts/system2-shadow-research/schedules')){
     assert.equal(opts.body,'[]');
     schedules=wrongAfter?[APPROVED_CRON]:[];
     result={schedules:[]};
    }else throw Error('OUT_OF_SCOPE_PUT');
   }else if(p.endsWith('/workers/scripts')&&u.searchParams.get('per_page')==='100'){
    result=workerIds.map(id=>({id}));
   }else if(p.endsWith('/d1/database')){
    result=dbNames.map(name=>({name,uuid:name==='system2-research'?db:'3'.repeat(32)}));
   }else if(p.endsWith('/workers/scripts/system2-shadow-research/settings')){
    result={bindings:[{name:'SYSTEM2_DB',type:'d1',id:boundDb}]};
   }else if(p.endsWith('/workers/scripts/fugle-test/schedules')){
    result={schedules:v8Cron.map(cron=>({cron}))};
   }else if(p.endsWith('/workers/scripts/system2-shadow-research/schedules')){
    result={schedules:schedules.map(cron=>({cron}))};
   }else throw Error('UNEXPECTED_API_CALL');
   return new Response(JSON.stringify({success:true,result}),{status:200,
      headers:{'Content-Type':'application/json'}});
  }
 };
}
test('GET-only inspection preserves Cron and never PUTs',async()=>{
 const args=fixture();const r=await sourceCronPauseV0_1({...args,mode:'INSPECT'});
 assert.equal(r.state,'FRESH_SOURCE_READONLY_INSPECTED_NOT_PAUSED');
 assert.equal(r.pausedConfirmed,false);assert.equal(r.cloudMutationsRequested,0);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
 assert.equal(r.system1Mutated,false);
});
test('exact approval + quarantine: PUT only SOURCE System2 schedules [] and readback exact 0',async()=>{
 const args=fixture();const r=await sourceCronPauseV0_1({...args,mode:'PAUSE'});
 assert.equal(r.pausedConfirmed,true);
 assert.equal(r.state,'SOURCE_S2_CRON_EMPTY_PHYSICAL_CONFIG_READBACK_PENDING_INDEPENDENT_AUDIT');
 assert.equal(r.v8CronUnchanged,true);assert.equal(r.independentAuditCompleted,false);
 const changes=args.log.filter(x=>x.method==='PUT');
 assert.equal(changes.length,1);assert(changes[0].p.endsWith('/system2-shadow-research/schedules'));
 assert.equal(changes[0].body,'[]');
 assert.equal(r.originalSourceCronRestorable,true);
});
test('legacy cron reactivation path unquarantined fails before PUT',async()=>{
 const args=fixture({guard:false});
 await assert.rejects(()=>sourceCronPauseV0_1({...args,mode:'PAUSE'}),/DEPLOY_QUARANTINE_NOT_EFFECTIVE/);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
});
test('source S2 wrong original Cron blocks before write',async()=>{
 const args=fixture({cron:['* * * * *']});
 await assert.rejects(()=>sourceCronPauseV0_1({...args,mode:'PAUSE'}),/NOT_EXACTLY_EXPECTED/);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
});
test('multiple original Cron triggers cannot be erased',async()=>{
 const args=fixture({cron:[APPROVED_CRON,'0 * * * *']});
 await assert.rejects(()=>sourceCronPauseV0_1({...args,mode:'PAUSE'}),/NOT_EXACTLY_EXPECTED/);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
});
test('missing V8 or S2 worker source identity refuses change',async()=>{
 const args=fixture({workerIds:['system2-shadow-research']});
 await assert.rejects(()=>sourceCronPauseV0_1({...args,mode:'PAUSE'}),/SOURCE_WORKER_IDENTITY_UNVERIFIED/);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
});
test('missing original source V8 DB rejects destination/scope ambiguity',async()=>{
 const args=fixture({dbNames:['system2-research']});
 await assert.rejects(()=>sourceCronPauseV0_1({...args,mode:'PAUSE'}),/SOURCE_D1_IDENTITY_UNVERIFIED/);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
});
test('System2 D1 binding changed fails closed',async()=>{
 const args=fixture({boundDb:'9'.repeat(32)});
 await assert.rejects(()=>sourceCronPauseV0_1({...args,mode:'PAUSE'}),/SOURCE_D1_BINDING_ID_MISMATCH/);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
});
test('Cloudflare write permission denial fails, never reports verified pause',async()=>{
 const args=fixture({putError:true});
 await assert.rejects(()=>sourceCronPauseV0_1({...args,mode:'PAUSE'}),/CLOUDFLARE_PUT_FAILED/);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,1);
});
test('after PUT but Cron persists => fail closed, no false acceptance',async()=>{
 const args=fixture({wrongAfter:true});
 await assert.rejects(()=>sourceCronPauseV0_1({...args,mode:'PAUSE'}),/POST_PAUSE_SCHEDULE_READBACK_DRIFT/);
});
test('invalid or missing source Cloudflare identity/token never reaches API',async()=>{
 const args=fixture();
 await assert.rejects(()=>sourceCronPauseV0_1({...args,accountId:'not-old-account',mode:'PAUSE'}),/CREDENTIAL_OR_MODE_INVALID/);
 assert.equal(args.log.length,0);
});

test('already empty source S2 Cron gives safe GET-only post-pause observation (no second PUT)',async()=>{
 const args=fixture({cron:[]});
 const r=await sourceCronPauseV0_1({...args,mode:'INSPECT'});
 assert.equal(r.state,'SOURCE_S2_CRON_ALREADY_EMPTY_READONLY_NOT_ORIGINAL_PAUSE_PROOF');
 assert.equal(r.pausedConfirmed,true);
 assert.equal(r.v8CronUnchanged,null);
 assert.equal(r.cloudMutationsRequested,0);
 assert.equal(r.independentAuditCompleted,false);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
});
test('repeated approved PAUSE on already zero Cron remains read-only, never reinstalls/retries',async()=>{
 const args=fixture({cron:[]});
 const r=await sourceCronPauseV0_1({...args,mode:'PAUSE'});
 assert.equal(r.state,'SOURCE_S2_CRON_ALREADY_EMPTY_READONLY_NOT_ORIGINAL_PAUSE_PROOF');
 assert.equal(r.cloudMutationsRequested,0);
 assert.equal(args.log.filter(x=>x.method==='PUT').length,0);
});
