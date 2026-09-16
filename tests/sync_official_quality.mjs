import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const helpers=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {parseOfficialCsv,parseMopsIncomeHtml,validateOfficialQualityData};').toString('base64'));
const origin='https://fugle-test.imihan0630.workers.dev';
const marketDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
assert.ok(process.env.V7_ADMIN_TOKEN,'Normal V7_ADMIN_TOKEN required');
async function publicSource(url,options={}) {
  const response=await fetch(url,{...options,redirect:'manual',signal:AbortSignal.timeout(45000)});
  if([401,403].includes(response.status)) throw new Error('Official source disallows access; stop this synchronization without bypassing restrictions');
  assert.equal(response.ok,true,`Official source HTTP ${response.status}`);return response;
}
async function admin(path,options={}) {
  const response=await fetch(origin+path,{...options,headers:{'x-admin-token':process.env.V7_ADMIN_TOKEN,'content-type':'application/json'},signal:AbortSignal.timeout(45000)});
  if([401,403].includes(response.status)) throw new Error('Administrator authorization failed; stop without replacing credentials');return response;
}
const configResponse=await admin('/api/config');assert.equal(configResponse.ok,true);const before=await configResponse.json();
for(let attempt=0;attempt<6;attempt++) {
  const response=await admin('/api/quality-data');if(response.status===405) break;
  assert.ok([404,200].includes(response.status));assert.ok(attempt<5,'Quality route not deployed; no writes attempted');await new Promise(resolve=>setTimeout(resolve,3000));
}
async function sync(body) {
  const validated=helpers.validateOfficialQualityData(body,marketDate);
  console.log(JSON.stringify({officialQualityPrevalidated:true,kind:body.kind,count:validated.count,asOfDate:validated.asOfDate}));
  const response=await admin('/api/quality-data',{method:'POST',body:JSON.stringify({...body,marketDate})});
  const result=await response.json();assert.equal(response.ok,true,`Quality ingestion rejected: ${String(result.error || response.status).slice(0,500)}`);
  assert.equal(result.verified,true);assert.equal(result.noPlanChanges,true);console.log(JSON.stringify({officialQualityCached:true,...result}));
}
const months=await Promise.all(Array.from({length:3},async (_,offset)=>{
  const date=new Date(marketDate+'T12:00:00Z');date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()-offset);
  const sourceUrl=`https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=${date.toISOString().slice(0,10).replaceAll('-','')}`;
  return {sourceUrl,payload:await (await publicSource(sourceUrl)).json()};
}));
if(months[0].payload.data?.at(-1)?.[0]?.replaceAll('/','')!==String(Number(marketDate.slice(0,4))-1911)+marketDate.slice(5).replaceAll('-','')) throw new Error('Official index is not current; stop without presenting missing data as successful zero picks');
await sync({kind:'INDEX',months});
const tdccUrl='https://opendata.tdcc.com.tw/getOD.ashx?id=1-5';
const tdcc=helpers.parseOfficialCsv(await (await publicSource(tdccUrl)).text());
const fields=['資料日期','證券代號','持股分級','股數','占集保庫存數比例%'];
await sync({kind:'TDCC',sourceUrl:tdccUrl,fields,rows:tdcc.filter(row=>/^[1-9][0-9]{3}$/.test(String(row['證券代號']))).map(row=>fields.map(field=>row[field]))});
const twseUrl=`https://www.twse.com.tw/exchangeReport/BWIBBU_d?response=json&date=${marketDate.replaceAll('-','')}&selectType=ALL`;
const tpexUrl='https://www.tpex.org.tw/openapi/v1/tpex_mainboard_peratio_analysis';
const [twsePayload,tpexPayload]=await Promise.all([twseUrl,tpexUrl].map(async url=>(await publicSource(url)).json()));
await sync({kind:'VALUATION',twseUrl,tpexUrl,twsePayload,tpexPayload});
const announcementTwse='https://openapi.twse.com.tw/v1/opendata/t187ap04_L',announcementTpex='https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap04_O';
const [announcementsTwse,announcementsTpex]=await Promise.all([announcementTwse,announcementTpex].map(async url=>(await publicSource(url)).json()));
await sync({kind:'ANNOUNCEMENTS',twseUrl:announcementTwse,tpexUrl:announcementTpex,twsePayload:announcementsTwse,tpexPayload:announcementsTpex});
const epsRows=helpers.parseOfficialCsv(await (await publicSource('https://mopsfin.twse.com.tw/opendata/t187ap14_L.csv')).text());
const frequency=new Map();for(const row of epsRows){const key=`${Number(row['年度'])+1911}Q${Number(row['季別'])}`;frequency.set(key,(frequency.get(key) || 0)+1);}
const [year,quarter]=[...frequency].sort((a,b)=>b[1]-a[1])[0][0].split('Q').map(Number);
const periodKeys=new Set([`${year}Q${quarter}`,`${year-1}Q${quarter}`]);
function addBefore(y,q){if(q>1) periodKeys.add(`${y}Q${q-1}`);}
addBefore(year,quarter);addBefore(year-1,quarter);
const previousYear=quarter===1?year-1:year,previousQuarter=quarter===1?4:quarter-1;
periodKeys.add(`${previousYear}Q${previousQuarter}`);addBefore(previousYear,previousQuarter);
const requests=[...periodKeys].flatMap(key=>['TWSE','TPEx'].map(market=>({key,market})));
const periods=[];
for(let start=0;start<requests.length;start+=2) {
  const batch=await Promise.all(requests.slice(start,start+2).map(async ({key,market})=>{
    const [y,q]=key.split('Q').map(Number),sourceUrl='https://mopsov.twse.com.tw/mops/web/ajax_t163sb04';
    const response=await publicSource(sourceUrl,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({encodeURIComponent:'1',step:'1',firstin:'1',off:'1',TYPEK:market==='TWSE'?'s':'otc',year:String(y-1911),season:String(q).padStart(2,'0')})});
    const stocks=helpers.parseMopsIncomeHtml(await response.text(),y,q);
    console.log(JSON.stringify({officialFinancialPeriodParsed:true,market,year:y,quarter:q,count:Object.keys(stocks).length}));
    return {market,year:y,quarter:q,sourceUrl,stocks};
  }));periods.push(...batch);
}
await sync({kind:'FINANCIAL',year,quarter,periods});
const afterResponse=await admin('/api/config');assert.equal(afterResponse.ok,true);assert.deepEqual(await afterResponse.json(),before,'Quality sync cannot change current plans or capital');
const statusResponse=await admin('/api/quality-status');assert.equal(statusResponse.ok,true);console.log(JSON.stringify({officialQualityStatus:await statusResponse.json(),configurationUnchanged:true,noSelection:true,noThreeMinWrite:true,noPush:true}));
if(process.argv.includes('--dry-run')) {
  const response=await admin('/api/scan-preview',{method:'POST',body:JSON.stringify({dryRun:true})});
  const result=await response.json();assert.equal(response.ok,true,`Readonly selection acceptance failed: ${String(result.error || response.status).slice(0,500)}`);
  assert.equal(result.dryRun,true);
  const finalConfig=await admin('/api/config');assert.deepEqual(await finalConfig.json(),before,'Preview must preserve current plans');
  console.log(JSON.stringify({qualityDryRunVerified:true,selectedCount:result.selectedCount,scanDate:result.scanDate,market:result.market,
    benchmark:result.diagnostics?.relativeStrengthBenchmark,exclusions:result.diagnostics?.exclusions,requirements30:result.diagnostics?.requirements30,preservedPlans:true,noThreeMinWrite:true,noPush:true}));
}
