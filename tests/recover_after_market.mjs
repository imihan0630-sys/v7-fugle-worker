// Future scheduled recovery only. Never part of deployment acceptance.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
process.on('uncaughtException',error=>{console.error('After-market recovery stopped: '+String(error.message).slice(0,700));process.exit(1);});
const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const helpers=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {loadTradingCalendar,isTradingDate};').toString('base64'));
const now=new Date(),today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
const requestedDate=String(process.env.RECOVERY_MARKET_DATE || '').trim();
const historicalRecovery=requestedDate.length>0;
const date=historicalRecovery ? requestedDate : today;
if(!historicalRecovery && (time<'23:35' || time>'23:59')) {console.log(JSON.stringify({skipped:true,reason:'Outside 23:35-23:59 same-day recovery window',date,time}));process.exit(0);}
if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('RECOVERY_MARKET_DATE must be YYYY-MM-DD');
if(date>today) throw new Error('RECOVERY_MARKET_DATE cannot be in the future');
if(Date.parse(today+'T00:00:00Z')-Date.parse(date+'T00:00:00Z')>14*86400000) throw new Error('RECOVERY_MARKET_DATE exceeds 14-day recovery window');
await helpers.loadTradingCalendar({},Number(date.slice(0,4)));
if(!helpers.isTradingDate(date)) {console.log(JSON.stringify({skipped:true,reason:'Not a trading day',date,historicalRecovery}));process.exit(0);}
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
if(prior.scanDate===date) {console.log(JSON.stringify({skipped:true,reason:'Today already selected; never resend plans',date}));process.exit(0);}
const institution=await admin('/api/institution-status?marketDate='+encodeURIComponent(date)),quality=await admin('/api/quality-status?marketDate='+encodeURIComponent(date));
assert.equal(institution.marketDate,date);assert.equal(institution.ready,true,'Latest institutional history incomplete');
assert.equal(quality.marketDate,date);assert.equal(quality.index.ready,true);assert.equal(quality.tdcc.ready,true);
for(const kind of ['FINANCIAL','VALUATION','ANNOUNCEMENTS','QUARTER_EPS']) assert.equal(quality.datasets[kind]?.ready,true,kind+' missing');
// Only one POST. A timeout is ambiguous: never retry a business write blindly.
try {
  const result=await admin('/api/scan',{method:'POST',body:JSON.stringify({onlyIfMissing:true,marketDate:date})});
  console.log(JSON.stringify({recovery:true,historicalRecovery,requestedDate:date,skipped:!!result.skipped,reason:result.reason,scanDate:result.scanDate,selectedCount:result.selectedCount,pipelineComplete:result.pipeline?.complete,dailyDeliveryState:result.dailyReport?.deliveryState || null}));
} catch(error) {
  if(/authorization rejected/.test(String(error))) throw error;
  const latest=await admin('/api/scan/status');
  if(latest.scanDate===date) console.log(JSON.stringify({recoveredByReadonlyConfirmation:true,date,noRepeatedPost:true}));
  else throw new Error('Single recovery attempt not confirmed; no repeated POST. '+String(error.message).slice(0,400));
}
