// Future scheduled recovery only. Never part of deployment acceptance.
import assert from 'node:assert/strict';
import {classifySourceReadyFormalHandoff,classifyImmediateBusinessPostClock} from './system1_p0_source_ready_handoff_gate_v0_1.mjs';
import {assessP0PrimaryMonitorDelivery} from './system1_p0_primary_monitor_delivery_v0_1.mjs';
import {readFile} from 'node:fs/promises';
process.on('uncaughtException',error=>{console.error('After-market recovery stopped: '+String(error.message).slice(0,700));process.exit(1);});
const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const helpers=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {loadTradingCalendar,isTradingDate};').toString('base64'));
const now=new Date(),today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
const requestedDate=String(process.env.RECOVERY_MARKET_DATE || '').trim();
const scheduledFallback=String(process.env.RECOVERY_SCHEDULED_FALLBACK || '').trim().toLowerCase()==='true';
const sourceReadyHandoff=String(process.env.RECOVERY_SOURCE_READY_HANDOFF||'').trim().toLowerCase()==='true';
if(sourceReadyHandoff && (scheduledFallback||!requestedDate)) throw new Error('SOURCE_READY_HANDOFF_REQUIRES_SAME_DAY_FROZEN_MARKET_DATE');
if(scheduledFallback && !requestedDate) throw new Error('Scheduled fallback requires frozen RECOVERY_MARKET_DATE');
const historicalRecovery=requestedDate.length>0 && !scheduledFallback;
const date=requestedDate || today;
if(sourceReadyHandoff && (date!==today||time<'18:10'||time>'23:54')) {console.log(JSON.stringify({skipped:true,reason:'SOURCE_READY_TARGET_NOT_SAME_DAY_EVENING',date,today,time,noBusinessPost:true}));process.exit(0);}
if(!sourceReadyHandoff && !historicalRecovery && !scheduledFallback && (time<'23:35' || time>'23:54')) {console.log(JSON.stringify({skipped:true,reason:'Outside 23:35-23:54 safe same-day recovery window',date,time}));process.exit(0);}
if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('RECOVERY_MARKET_DATE must be YYYY-MM-DD');
if(date>today) throw new Error('RECOVERY_MARKET_DATE cannot be in the future');
 // Canonical deployed Worker ignores JSON body.marketDate and calls
 // runAfterMarketScan(env,Date.now()). Do not let any delayed/explicit recovery
 // select another session. Future Worker pinning needs separate deployment.
if(date!==today) throw new Error('LEGACY_WORKER_PINNED_PRIOR_DAY_UNSUPPORTED_NO_BUSINESS_POST');
if(historicalRecovery && !sourceReadyHandoff && (time<'23:35'||time>'23:54')){
  console.log(JSON.stringify({skipped:true,reason:'MANUAL_RECOVERY_OUTSIDE_EVENING_WINDOW',date,time,noBusinessPost:true}));
  process.exit(0);
}
const ageMs=Date.parse(today+'T00:00:00Z')-Date.parse(date+'T00:00:00Z');
if(ageMs>14*86400000) throw new Error('RECOVERY_MARKET_DATE exceeds 14-day recovery window');
if(scheduledFallback && ageMs>86400000) throw new Error('Scheduled fallback target exceeds one-day cross-midnight window');
await helpers.loadTradingCalendar({},Number(date.slice(0,4)));
if(!helpers.isTradingDate(date)) {console.log(JSON.stringify({skipped:true,reason:'Not a trading day',date,historicalRecovery,scheduledFallback}));process.exit(0);}
assert.ok(process.env.V7_ADMIN_TOKEN,'Normal configured administrator token required');
const origin='https://fugle-test.imihan0630.workers.dev';
async function admin(path,options={}) {
  const response=await fetch(origin+path,{...options,headers:{'x-admin-token':process.env.V7_ADMIN_TOKEN,'content-type':'application/json','accept':'application/json'},signal:AbortSignal.timeout(options.method==='POST'?180000:45000)});
  if([401,403].includes(response.status)) throw new Error('Administrator authorization rejected; stop without bypass');
  const contentType=String(response.headers.get('content-type') || '');
  const text=await response.text();
  let result;
  try { result=JSON.parse(text); }
  catch(error) {
    throw new Error(`Administrator ${options.method || 'GET'} ${path} returned non-JSON status=${response.status} contentType=${contentType} bodyPrefix=${text.slice(0,240).replace(/\s+/g,' ')}`);
  }
  assert.equal(response.ok,true,String(result.error || response.status).slice(0,500));
  return result;
}
const prior=await admin('/api/scan/status');
if(prior.scanDate===date) {
  const [existingMonitor,existingOutbox]=await Promise.all([admin('/api/config'),admin('/api/push-outbox?limit=50')]);
  const receipt=assessP0PrimaryMonitorDelivery({targetDate:date,formal:prior,monitor:existingMonitor,outbox:existingOutbox});
  console.log(JSON.stringify({alreadySelected:true,date,primaryBusinessReceipt:receipt,noBusinessPost:true}));
  if(!receipt.ok)throw new Error('SAME_DAY_FORMAL_SAVED_BUT_MONITOR_OR_DAILY_PUSH_INCOMPLETE:'+receipt.reason+'; never reselect');
  console.log(JSON.stringify({skipped:true,reason:'FORMAL_PRIMARY_MONITOR_AND_PUSH_ALREADY_ACCEPTED',date,noBusinessPost:true}));
  process.exit(0);
}
const institution=await admin('/api/institution-status?marketDate='+encodeURIComponent(date)),quality=await admin('/api/quality-status?marketDate='+encodeURIComponent(date));
assert.equal(institution.marketDate,date);assert.equal(institution.ready,true,'Latest institutional history incomplete');
assert.equal(quality.marketDate,date);assert.equal(quality.index.ready,true);assert.equal(quality.tdcc.ready,true);
for(const kind of ['FINANCIAL','VALUATION','ANNOUNCEMENTS','QUARTER_EPS']) assert.equal(quality.datasets[kind]?.ready,true,kind+' missing');
// ALL same-date recovery modes (late official source, scheduled 23:45,
// and authorized manual) must PROVE the original Formal Cron failed
// strictly before the first plan mutation. An ambiguous original CPU/503
// may never be replayed merely because /api/scan/status is absent.
// Use GET-only D1/KV receipts before the one existing /api/scan POST.
{
  const [recommendations,cron]=await Promise.all([admin('/api/recommendations'),admin('/api/cron/status')]);
  const handoff=classifySourceReadyFormalHandoff({now:new Date(),targetDate:date,
    scan:prior,institution,quality,recommendations,cron});
  console.log(JSON.stringify({sourceReadyFormalHandoff:handoff,noBusinessPost:!handoff.mayPost}));
  if(!handoff.mayPost){
    // The deployed after-market Cron is 23:35, NOT old main's 18:10.
    // Official source success before 23:35 correctly waits for that scheduled
    // original Formal business attempt; it is not an operational failure yet.
    if(handoff.reason==="ORIGINAL_FORMAL_CRON_NOT_DUE"){
      console.log(JSON.stringify({skipped:true,reason:handoff.reason,date,
        scheduledClock:handoff.scheduledClock,formalNotYetDue:true,noBusinessPost:true,noPush:true}));
      process.exit(0);
    }
    console.log(JSON.stringify({blocked:true,reason:handoff.reason,date,sourceReadyHandoff:true,noBusinessPost:true,noPush:true}));
    // A successful official data-sync run while Formal/monitor/push is absent
    // must never silently green-skip; surface the real P0 business blockage.
    // This fail-closed check is NOT a request to repeat an ambiguous POST.
    throw new Error('SOURCE_READY_BUT_FORMAL_HANDOFF_BLOCKED_NO_RETRY:'+handoff.reason);
  }
}
// MUST repeat Taipei-date authority immediately BEFORE the one legacy POST,
// even after all 5 authenticated GETs; these may span midnight. Legacy Worker
// takes Date.now() instead of request.body.marketDate, so never send on rollover.
const freshPostClock=classifyImmediateBusinessPostClock({now:new Date(),targetDate:date});
if(!freshPostClock.mayPost){
  console.log(JSON.stringify({blocked:true,reason:freshPostClock.reason,
    observedDate:freshPostClock.observedDate,targetDate:date,noBusinessPost:true,noPush:true}));
  throw new Error('NO_BUSINESS_POST_AFTER_SESSION_ROLLOVER:'+freshPostClock.reason);
}
// Only one POST; no repeated POST after HTTP 503, timeout or unverifiable monitor/push.
// A timeout is ambiguous: NEVER repeat a business write.
// A nominal HTTP200 with same-day scanDate is NOT enough for the owner P0:
// independently read current primary monitoring KV and check original daily push.
let postResult=null,postError=null;
try{
  postResult=await admin('/api/scan',{method:'POST',body:JSON.stringify({onlyIfMissing:true,marketDate:date})});
}catch(error){
  if(/authorization rejected/.test(String(error)))throw error;
  postError=String(error?.message||error).slice(0,320);
}
let latest,monitor,outbox;
try{
  [latest,monitor,outbox]=await Promise.all([admin('/api/scan/status'),admin('/api/config'),admin('/api/push-outbox?limit=50')]);
}catch(error){
  throw new Error('FORMAL_POST_OUTCOME_UNCONFIRMED_AND_READBACK_UNAVAILABLE_NO_RETRY:'+String(error.message).slice(0,300));
}
const receipt=assessP0PrimaryMonitorDelivery({targetDate:date,formal:latest,monitor,outbox});
console.log(JSON.stringify({sourceReadyHandoff,requestedDate:date,postWasAttempted:true,
  postStatus:postError?'OUTCOME_UNKNOWN_NEEDS_READBACK':'HTTP_SUCCESS',
  postReturnedSkipped:postResult?.skipped===true,
  primaryBusinessReceipt:receipt,noRepeatedPost:true}));
if(!receipt.ok)throw new Error('P0_FORMAL_MONITOR_OR_PUSH_UNVERIFIED_NO_RETRY:'+receipt.reason+
  (postError?'; original POST status unknown: '+postError:''));
console.log(JSON.stringify({recoveredByExactPrimaryReadback:true,date,
  selectedCount:receipt.selectedCount,monitorExact:true,dailyPushAccepted:true,
  external3MinSeparate:true,phoneReceiptVerified:false,noRepeatedPost:true}));
