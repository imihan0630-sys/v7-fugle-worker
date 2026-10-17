// M12 REMEDIATION_LANE Class A. Independent structural, active-step-only
// regression firewall around existing DATA/BUILD owned destination D1 workflows.
// Never grant a quota/Cloudflare atomic lease or execute a provider call.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const ROOT=new URL('../../',import.meta.url);
export const GUARDED_FLOWS=Object.freeze({
 RAW_COPY:{file:'.github/workflows/system2-owner-override-raw-d1-copy-20261012.yml',job:'destination_copy',mode:'direct'},
 DAILY_DIAGNOSTIC:{file:'.github/workflows/system2-daily-shadow-diagnostic.yml',job:'diagnostic',mode:'quota'},
 RECENT_A1_WARMUP:{file:'.github/workflows/system2-recent-a1-hot-history-warmup.yml',job:'warmup',mode:'quota'},
 MANUAL_SCHEMA_APPLY:{file:'.github/workflows/system2-destination-schema-only-manual.yml',job:'owner-schema-only',mode:'schema'}
});
const LOCK='s2-dest-d1-historical-and-diagnostic-writer';
const TOKEN='secrets.S2_SCHEMA_DEST_D1_WRITE_TOKEN';
const INTERLOCK='node system2/scripts/dest_d1_writer_run_interlock_v0_1.mjs';
const BUDGET='./.github/actions/system2-d1-budget-gate';
const fail=(v)=>{throw Error('M12_ACTIVE_STEP_GUARD_'+v)};
export function inspectActiveWriterWorkflowV0_1(raw,writerId){
 const config=GUARDED_FLOWS[writerId];if(!config||typeof raw!=='string')fail('UNKNOWN_WRITER');
 const rows=raw.replace(/\r\n/g,'\n').split('\n');
 const live=rows.filter(x=>!/^\s*#/.test(x));
 const text=live.join('\n');
 if(!/^permissions:\s*$/m.test(text)||!/^  actions: read\s*$/m.test(text))fail('NATIVE_READ_PERMISSION');
 if(!/^jobs:\s*$/m.test(text))fail('JOBS_MISSING');
 const start=rows.findIndex(x=>x==='  '+config.job+':');
 if(start<0)fail('JOB_NOT_FOUND');
 const stop=rows.findIndex((x,i)=>i>start&&/^  [\w-]+:\s*$/.test(x));
 const job=rows.slice(start,stop<0?undefined:stop);
 const active=job.filter(x=>!/^\s*#/.test(x));
 if(!active.some(x=>/^    environment: system2-schema-only(?:\\s+#.*)?$/.test(x)))fail('WRONG_ENVIRONMENT');
 if(active.some(x=>x.trim()==='environment: system2-research'))fail('SOURCE_ACCOUNT_LEAK');
 if(!active.some(x=>/^    concurrency:\s*$/.test(x)) ||
    !active.some(x=>x==='      group: '+LOCK) ||
    !active.some(x=>x==='      cancel-in-progress: false'))fail('JOB_LOCK_FAKE_OR_MISSING');
 if(!active.some(x=>/^    timeout-minutes: \d+$/.test(x)))fail('TIME_BOUND_MISSING');
 const steps=[], stepHeads=[];
 for(let i=0;i<job.length;i++){
  if(/^      - name:\s*\S/.test(job[i])&& !/^\s*#/.test(job[i])){
    stepHeads.push(i);
  }
 }
 for(let i=0;i<stepHeads.length;i++){
  const lines=job.slice(stepHeads[i],stepHeads[i+1]);
  const block=lines.filter(x=>!/^\s*#/.test(x)).join('\n');
  const top={};
  for(const x of lines)if(!/^\s*#/.test(x)){
   const m=x.match(/^        (id|if|run|uses):\s*(.*?)\s*$/);if(m)top[m[1]]=m[2];
  }
  steps.push({...top,block});
 }
 if(steps.length<4)fail('ACTIVE_STEPS_MISSING');
 const inter=steps.map((x,i)=>({...x,i})).filter(x=>x.id==='day_interlock');
 if(inter.length!==1||inter[0].run!==INTERLOCK||
   !inter[0].block.includes('S2_DEST_WRITER_CLASS: '+writerId))fail('LIVE_INTERLOCK_STEP_MISSING');
 const n=inter[0].i;
 const secrets=steps.map((x,i)=>({...x,i})).filter(x=>x.block.includes(TOKEN));
 if(!secrets.length||secrets.some(x=>x.i<=n))fail('SECRET_BEFORE_INTERLOCK');
 if(steps.slice(0,n).some(x=>x.block.includes(TOKEN)))fail('EARLY_DEST_SECRET');
 const guard="steps.day_interlock.outputs.allowed == 'true'";
 const physical="steps.quota.outputs.physical_allowed == 'true'";
 if(config.mode==='schema'){
  if(inter[0].if!=="inputs.action == 'APPLY_ONCE'")fail('SCHEMA_INTERLOCK_NOT_APPLY_ONLY');
  if(secrets.length!==1||secrets[0].if!=="inputs.action == 'VERIFY_ONLY' || "+guard ||
    secrets[0].run!=='node system2/migration/run_destination_schema_only_manual_v0_1.mjs')
   fail('SCHEMA_WRITE_STEP_BYPASS');
  if(!active.some(x=>x.trim()==="if: github.ref == 'refs/heads/main' && github.event_name == 'workflow_dispatch'"))fail('SCHEMA_DISPATCH_BYPASS');
 }else if(config.mode==='direct'){
  if(secrets.length!==1||secrets[0].if!==guard||
    secrets[0].run!=='node system2/migration/owner_override_raw_d1_import_20261012.mjs')
   fail('RAW_COPY_UNGUARDED');
  if(!active.some(x=>x.includes('S2_OWNER_OVERRIDE_RAW_COPY_20261012')))fail('RAW_COPY_OWNER_ENTRY_MISSING');
 }else{
  if(!active.some(x=>x.includes("github.event_name != 'push'")&&x.trim().startsWith('if:')))fail('PUSH_WRITE_BYPASS');
  const quota=steps.map((x,i)=>({...x,i})).filter(x=>x.id==='quota');
  if(quota.length!==1||quota[0].i<=n||quota[0].if!==guard||quota[0].uses!==BUDGET)fail('REAL_BUDGET_ACTION_BYPASS');
  const writeSteps=secrets.filter(x=>x.i>quota[0].i && (x.run||'').length>0);
  if(!writeSteps.length || writeSteps.some(x=>x.if!==physical && x.if!=='always() && '+physical))fail('D1_WRITE_STEP_UNGUARDED');
  for(const s of secrets)if(s.i!==quota[0].i && s.if!==physical && s.if!=='always() && '+physical)fail('RECONCILE_STEP_UNGUARDED');
 }
 return Object.freeze({writerId,mode:config.mode,stepCount:steps.length,secretBoundStepCount:secrets.length,
  interlockStepIndex:n,scope:'SOURCE_ONLY_YAML_ACTIVE_STEP_SHAPE',nativeCloudflareAtomicLeaseVerified:false,
  fullCloudflareWriterCensusVerified:false,d1WriteAuthorized:false});
}
export function inspectCanonicalFourWriterFlowsV0_1(){
 return Object.entries(GUARDED_FLOWS).map(([id,x])=>inspectActiveWriterWorkflowV0_1(
   readFileSync(fileURLToPath(new URL(x.file,ROOT)),'utf8'),id));
}
