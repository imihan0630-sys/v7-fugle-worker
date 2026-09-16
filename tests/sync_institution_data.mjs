import assert from 'node:assert/strict';
const origin='https://fugle-test.imihan0630.workers.dev';
const marketDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
assert.ok(process.env.V7_ADMIN_TOKEN,'Normal V7_ADMIN_TOKEN authorization is required');
const adminHeaders={'x-admin-token':process.env.V7_ADMIN_TOKEN,'content-type':'application/json'};
async function admin(path,options={}) {
  const response=await fetch(origin+path,{...options,headers:adminHeaders,signal:AbortSignal.timeout(40000)});
  if([401,403].includes(response.status)) throw new Error('Administrator authorization failed; stop without substituting credentials');
  return response;
}
async function config(){const response=await admin('/api/config');assert.equal(response.ok,true);return response.json();}
const before=await config();
for(let attempt=0;attempt<6;attempt++) {
  const probe=await admin('/api/institution-data');
  if(probe.status===405) break;
  assert.ok([404,200].includes(probe.status),'Unexpected deployment probe status');
  assert.ok(attempt<5,'Institution route not deployed; no data writes attempted');
  await new Promise(resolve=>setTimeout(resolve,3000));
}
async function sync(date) {
  const [year,month,day]=date.split('-');
  const twseUrl=`https://www.twse.com.tw/rwd/zh/fund/T86?response=json&date=${date.replaceAll('-','')}&selectType=ALL`;
  const tpexUrl=`https://www.tpex.org.tw/www/zh-tw/insti/dailyTrade?type=Daily&sect=EW&date=${encodeURIComponent(`${Number(year)-1911}/${month}/${day}`)}&id=&response=json`;
  const [twsePayload,tpexPayload]=await Promise.all([twseUrl,tpexUrl].map(async url=>{
    const response=await fetch(url,{headers:{accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(45000)});
    assert.equal(response.ok,true,`Official institution source HTTP ${response.status}`);return response.json();
  }));
  // Retain date/schema, omit non-ordinary instruments before transferring the large official table.
  const codeIndex=twsePayload.fields?.indexOf('證券代號');
  assert.ok(codeIndex>=0,'TWSE institution code field missing');
  twsePayload.data=twsePayload.data.filter(row=>/^[1-9][0-9]{3}$/.test(String(row[codeIndex]).trim()));
  const response=await admin('/api/institution-data',{method:'POST',body:JSON.stringify({marketDate:date,twseUrl,tpexUrl,twsePayload,tpexPayload})});
  const result=await response.json();
  assert.equal(response.ok,true,`Official institution ingestion rejected: ${String(result.error || response.status).slice(0,500)}`);
  assert.equal(result.verified,true);assert.equal(result.noPlanChanges,true);
  console.log(JSON.stringify({officialInstitutionCached:true,...result}));return result;
}
const current=await sync(marketDate);
for(const missingDate of current.streak.missingDates || []) await sync(missingDate);
const after=await config();
assert.deepEqual(after,before,'Institution synchronization must not change targets, capital or plans');
console.log(JSON.stringify({institutionDataOnly:true,marketDate,currentDateVerified:true,backfilledDates:current.streak.missingDates || [],configurationUnchanged:true,noSelection:true,noExternalPlanWrite:true,noPush:true}));
