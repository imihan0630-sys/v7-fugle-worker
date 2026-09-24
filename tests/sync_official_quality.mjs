import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
process.on('uncaughtException',error=>{console.error('Quality synchronization failed: '+String(error.message).slice(0,900));process.exit(1);});
const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const helpers=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {parseOfficialCsv,parseMopsIncomeHtml,parseMopsMarketOptions,parseMopsQuarterEpsHtml,validateOfficialQualityData,loadTradingCalendar,mostRecentWeekday,isTradingDate};').toString('base64'));
const origin='https://fugle-test.imihan0630.workers.dev';
const now=new Date();
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
await helpers.loadTradingCalendar({},Number(today.slice(0,4)));
const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',hourCycle:'h23'}).format(now));
const reference=hour<14 ? new Date(Date.parse(today+'T12:00:00Z')-86400000).toISOString().slice(0,10) : today;
const requestedMarketDate=String(process.env.QUALITY_MARKET_DATE || '').trim();
const marketDate=requestedMarketDate || helpers.mostRecentWeekday(reference);
assert.match(marketDate,/^\d{4}-\d{2}-\d{2}$/,'QUALITY_MARKET_DATE must be YYYY-MM-DD');
assert.ok(marketDate<=today,'QUALITY_MARKET_DATE cannot be in the future');
assert.ok(Date.parse(today+'T00:00:00Z')-Date.parse(marketDate+'T00:00:00Z')<=14*86400000,'QUALITY_MARKET_DATE exceeds 14-day recovery window');
await helpers.loadTradingCalendar({},Number(marketDate.slice(0,4)));
assert.equal(helpers.isTradingDate(marketDate),true,'QUALITY_MARKET_DATE is not a trading day');
assert.ok(process.env.V7_ADMIN_TOKEN,'Normal V7_ADMIN_TOKEN required');
async function publicSource(url,options={}) {
  for(let attempt=0;attempt<3;attempt++) {
    try {
      const response=await fetch(url,{...options,redirect:'manual',signal:AbortSignal.timeout(45000)});
      if([401,403].includes(response.status)) throw new Error('Official source disallows access; stop this synchronization without bypassing restrictions');
      if((response.status===429 || response.status>=500) && attempt<2) {await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));continue;}
      assert.equal(response.ok,true,`Official source HTTP ${response.status}`);return response;
    }catch(error){if(attempt>=2 || !/fetch failed|timeout|ECONNRESET|ETIMEDOUT/i.test(String(error))) throw new Error(`Public source ${new URL(url).pathname}: ${error.message}`);await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));}
  }
}
async function admin(path,options={}) {
  for(let attempt=0;attempt<3;attempt++) {
    try {
      const response=await fetch(origin+path,{...options,headers:{'x-admin-token':process.env.V7_ADMIN_TOKEN,'content-type':'application/json','accept':'application/json'},signal:AbortSignal.timeout(path==='/api/scan-preview'?180000:45000)});
      if([401,403].includes(response.status)) throw new Error('Administrator authorization failed; stop without replacing credentials');return response;
    }catch(error){if(options.method==='POST' || attempt>=2 || !/fetch failed|timeout|ECONNRESET|ETIMEDOUT/i.test(String(error))) throw new Error(`Administrator ${options.method || 'GET'} ${path}: ${error.message}`);await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));}
  }
}
async function readonlyPreview(body,label) {
  let lastMeta=null;
  for(let attempt=1;attempt<=3;attempt++) {
    const response=await admin('/api/scan-preview',{method:'POST',body:JSON.stringify(body)});
    const contentType=String(response.headers.get('content-type') || '');
    const text=await response.text();
    let result=null;
    try { result=JSON.parse(text); }
    catch(error) {
      lastMeta={attempt,status:response.status,contentType,bodyPrefix:text.slice(0,240).replace(/\s+/g,' ')};
      console.error(JSON.stringify({readonlyPreviewNonJson:true,label,...lastMeta}));
      const retryable=attempt<3 && (response.status===429 || response.status>=500 || /text\/html/i.test(contentType) || /^\s*</.test(text));
      if(retryable) {await new Promise(resolve=>setTimeout(resolve,1000*attempt));continue;}
      throw new Error(label+' returned non-JSON response: '+JSON.stringify(lastMeta));
    }
    if(!response.ok) {
      lastMeta={attempt,status:response.status,contentType,error:String(result?.error || '').slice(0,500)};
      console.error(JSON.stringify({readonlyPreviewRejected:true,label,...lastMeta}));
      if(attempt<3 && (response.status===429 || response.status>=500)) {await new Promise(resolve=>setTimeout(resolve,1000*attempt));continue;}
      throw new Error(label+' failed: '+JSON.stringify(lastMeta));
    }
    console.log(JSON.stringify({readonlyPreviewAccepted:true,label,attempt,status:response.status,contentType}));
    return result;
  }
  throw new Error(label+' failed after bounded retries: '+JSON.stringify(lastMeta));
}
const configResponse=await admin('/api/config');assert.equal(configResponse.ok,true);const before=await configResponse.json();
const recoveryOnly=String(process.env.QUALITY_RECOVERY_ONLY || '')==='1';
let existingQuality=null;
if(recoveryOnly) {
  const response=await admin('/api/quality-status?marketDate='+encodeURIComponent(marketDate));
  assert.equal(response.ok,true,'Historical quality status unavailable');
  existingQuality=await response.json();
  assert.equal(existingQuality.marketDate,marketDate);
  console.log(JSON.stringify({historicalQualityRecovery:true,marketDate,existingQuality}));
}
function datasetReady(kind) {
  if(!recoveryOnly) return false;
  if(kind==='INDEX') return existingQuality?.index?.ready===true;
  if(kind==='TDCC') return existingQuality?.tdcc?.ready===true;
  return existingQuality?.datasets?.[kind]?.ready===true;
}

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
  return validated;
}
if(!datasetReady('INDEX')) {
const months=await Promise.all(Array.from({length:3},async (_,offset)=>{
  const date=new Date(marketDate+'T12:00:00Z');date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()-offset);
  const sourceUrl=`https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=${date.toISOString().slice(0,10).replaceAll('-','')}`;
  return {sourceUrl,payload:await (await publicSource(sourceUrl)).json()};
}));
if(months[0].payload.data?.at(-1)?.[0]?.replaceAll('/','')!==String(Number(marketDate.slice(0,4))-1911)+marketDate.slice(5).replaceAll('-','')) throw new Error('Official index is not current; stop without presenting missing data as successful zero picks');
await sync({kind:'INDEX',months});
}
else console.log(JSON.stringify({historicalQualityReuse:true,kind:'INDEX',marketDate}));
if(!datasetReady('TDCC')) {
const tdccUrl='https://opendata.tdcc.com.tw/getOD.ashx?id=1-5';
const tdcc=helpers.parseOfficialCsv(await (await publicSource(tdccUrl)).text(),['資料日期','證券代號','持股分級','人數','股數','占集保庫存數比例%']).map(row=>({...row,'證券代號':String(row['證券代號']).trim()}));
console.log(JSON.stringify({tdccAdjustmentSchema:tdcc.find(row=>row['持股分級']==='16' && /^[1-9][0-9]{3}$/.test(row['證券代號'])),tdccTotalSchema:tdcc.find(row=>row['持股分級']==='17' && /^[1-9][0-9]{3}$/.test(row['證券代號']))}));
const fields=['資料日期','證券代號','持股分級','股數','占集保庫存數比例%'];
await sync({kind:'TDCC',sourceUrl:tdccUrl,fields,rows:tdcc.filter(row=>/^[1-9][0-9]{3}$/.test(String(row['證券代號']))).map(row=>fields.map(field=>row[field]))});
}
else console.log(JSON.stringify({historicalQualityReuse:true,kind:'TDCC',marketDate}));
if(!datasetReady('VALUATION')) {
const twseUrl=`https://www.twse.com.tw/exchangeReport/BWIBBU_d?response=json&date=${marketDate.replaceAll('-','')}&selectType=ALL`;
const tpexUrl='https://www.tpex.org.tw/openapi/v1/tpex_mainboard_peratio_analysis';
const [twsePayload,tpexPayload]=await Promise.all([twseUrl,tpexUrl].map(async url=>(await publicSource(url)).json()));
await sync({kind:'VALUATION',twseUrl,tpexUrl,twsePayload,tpexPayload});
}
else console.log(JSON.stringify({historicalQualityReuse:true,kind:'VALUATION',marketDate}));
if(!datasetReady('ANNOUNCEMENTS')) {
const announcementTwse='https://openapi.twse.com.tw/v1/opendata/t187ap04_L',announcementTpex='https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap04_O';
const [announcementsTwse,announcementsTpex]=await Promise.all([announcementTwse,announcementTpex].map(async url=>(await publicSource(url)).json()));
console.log(JSON.stringify({officialAnnouncementSchemas:{TWSE:{fields:Object.keys(announcementsTwse[0] || {}),date:announcementsTwse[0]?.['發言日期']},TPEx:{fields:Object.keys(announcementsTpex[0] || {}),date:announcementsTpex[0]?.['發言日期']}}}));
await sync({kind:'ANNOUNCEMENTS',twseUrl:announcementTwse,tpexUrl:announcementTpex,twsePayload:announcementsTwse,tpexPayload:announcementsTpex});
}
else console.log(JSON.stringify({historicalQualityReuse:true,kind:'ANNOUNCEMENTS',marketDate}));
const epsRows=helpers.parseOfficialCsv(await (await publicSource('https://mopsfin.twse.com.tw/opendata/t187ap14_L.csv')).text());
const marketOptions=helpers.parseMopsMarketOptions(await (await publicSource('https://mopsov.twse.com.tw/mops/web/t163sb04')).text());
console.log(JSON.stringify({officialMopsMarketOptions:marketOptions}));
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
      body:new URLSearchParams({encodeURIComponent:'1',step:'1',firstin:'1',off:'1',TYPEK:marketOptions[market],year:String(y-1911),season:String(q).padStart(2,'0')})});
    const html=await response.text();
    const incomeHeaders=[...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(row=>[...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(cell=>cell[1].replace(/<[^>]+>/g,'').replace(/\s+/g,''))).filter(row=>row[0]==='公司代號');
    console.log(JSON.stringify({officialIncomeHeaders:incomeHeaders,market,year:y,quarter:q}));
    const stocks=helpers.parseMopsIncomeHtml(html,y,q);
    console.log(JSON.stringify({officialFinancialPeriodParsed:true,market,year:y,quarter:q,count:Object.keys(stocks).length}));
    return {market,year:y,quarter:q,sourceUrl,stocks};
  }));periods.push(...batch);
}
const financialBody={kind:'FINANCIAL',year,quarter,periods};
const financialSnapshot=helpers.validateOfficialQualityData(financialBody,marketDate);
if(!datasetReady('FINANCIAL')) await sync(financialBody);
else console.log(JSON.stringify({historicalQualityReuse:true,kind:'FINANCIAL',marketDate,count:financialSnapshot.count}));
// Review every preliminary qualifying candidate, before applying either pool quota.
// This is a readonly source-selection preview; it never imports or pushes a plan.
const review=await readonlyPreview({dryRun:true,epsReviewOnly:true,marketDate},'EPS source review');
assert.equal(review.dryRun,true);assert.equal(review.diagnostics?.quarterEpsReview?.provisional,true);
const universe=review.diagnostics?.epsReviewUniverse;
assert.ok(Array.isArray(universe) && universe.length<=200,'EPS review universe unavailable or exceeds verified request budget; do not silently truncate');
const q4TermsUrl='https://mopsfin.twse.com.tw/terms';
const q4TermsHtml=await (await publicSource(q4TermsUrl)).text();
const q4TermsText=q4TermsHtml.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
assert.match(q4TermsText,/第4季因未申報單季金額/,'TWSE Financial Comparison no longer documents why Q4 needs derivation');
assert.match(q4TermsText,/第4季累計金額.{0,120}第3季累計金額/,'TWSE Financial Comparison Q4 cumulative-minus-Q3 methodology changed');
const formHtml=await (await publicSource('https://mopsov.twse.com.tw/mops/web/t164sb04')).text();
assert.match(formHtml,/<form\b[^>]*id=["']form1["'][^>]*action=["']\/mops\/web\/ajax_t164sb04["']/i,'Official single-company statement form action changed; do not guess another API');
for(const name of ['co_id','year','season','TYPEK','isnew']) assert.ok(new RegExp(`name=["']${name}["']`).test(formHtml),`Official statement form missing ${name}`);
const reports=[];
for(let start=0;start<universe.length;start+=2) {
  const batch=await Promise.all(universe.slice(start,start+2).map(async item=>{
    assert.match(item.symbol,/^[1-9][0-9]{3}$/);
    const directSourceUrl='https://mopsov.twse.com.tw/mops/web/ajax_t164sb04';
    if(quarter===4) {
      const q4=financialSnapshot.stocks?.[item.symbol];
      assert.equal(q4?.quarterEpsVerified,true,`Q4 official derived EPS missing for ${item.symbol}`);
      assert.equal(q4?.quarterEpsMethod,'MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3');
      const priorResponse=await publicSource(directSourceUrl,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({encodeURIComponent:'1',step:'1',firstin:'1',off:'1',TYPEK:'all',isnew:'false',co_id:item.symbol,year:String(year-1911),season:'03'})});
      const previousQuarterHtml=await priorResponse.text();
      const prior=helpers.parseMopsQuarterEpsHtml(previousQuarterHtml,item.symbol,year,3);
      console.log(JSON.stringify({reportedQuarterEpsReviewed:true,symbol:item.symbol,year,quarter:4,quarterEPS:q4.quarterEPS,
        q4CumulativeEPS:q4.q4CumulativeEPS,q3CumulativeEPS:q4.q3CumulativeEPS,method:q4.quarterEpsMethod,
        previousQuarterEPS:prior.quarterEPS,epsQoQ:q4.quarterEPS/prior.quarterEPS-1}));
      return {sourceUrl:q4TermsUrl,symbol:item.symbol,previousQuarterHtml};
    }
    const response=await publicSource(directSourceUrl,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({encodeURIComponent:'1',step:'1',firstin:'1',off:'1',TYPEK:'all',isnew:'false',co_id:item.symbol,year:String(year-1911),season:String(quarter).padStart(2,'0')})});
    const html=await response.text();
    const verified=helpers.parseMopsQuarterEpsHtml(html,item.symbol,year,quarter);
    console.log(JSON.stringify({reportedQuarterEpsReviewed:true,symbol:item.symbol,year,quarter,quarterEPS:verified.quarterEPS,priorYearQuarterEPS:verified.reportedPriorYearQuarterEPS,epsYoY:verified.epsYoY}));
    let previousQuarterHtml;
    if(quarter>1) {
      const priorResponse=await publicSource(directSourceUrl,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({encodeURIComponent:'1',step:'1',firstin:'1',off:'1',TYPEK:'all',isnew:'false',co_id:item.symbol,year:String(year-1911),season:String(quarter-1).padStart(2,'0')})});
      previousQuarterHtml=await priorResponse.text();
      const prior=helpers.parseMopsQuarterEpsHtml(previousQuarterHtml,item.symbol,year,quarter-1);
      console.log(JSON.stringify({reportedPreviousQuarterEpsReviewed:true,symbol:item.symbol,year,quarter:quarter-1,quarterEPS:prior.quarterEPS}));
    } else {
      const q4=financialSnapshot.stocks?.[item.symbol];
      assert.equal(q4?.previousQuarterEpsVerified,true,`Q1 previous Q4 official derived EPS missing for ${item.symbol}`);
      assert.equal(q4?.previousQuarterEpsMethod,'MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3');
      console.log(JSON.stringify({reportedPreviousQuarterEpsReviewed:true,symbol:item.symbol,year:year-1,quarter:4,
        quarterEPS:q4.previousQuarterEPS,method:q4.previousQuarterEpsMethod}));
    }
    return {sourceUrl:directSourceUrl,symbol:item.symbol,html,...(previousQuarterHtml!==undefined ? {previousQuarterHtml} : {})};
  }));reports.push(...batch);
}
if(!datasetReady('QUARTER_EPS')) await sync({kind:'QUARTER_EPS',year,quarter,reports,financialSnapshot});
else console.log(JSON.stringify({historicalQualityReuse:true,kind:'QUARTER_EPS',marketDate}));
const afterResponse=await admin('/api/config');assert.equal(afterResponse.ok,true);assert.deepEqual(await afterResponse.json(),before,'Quality sync cannot change current plans or capital');
const statusResponse=await admin('/api/quality-status?marketDate='+marketDate);assert.equal(statusResponse.ok,true);
const finalStatus=await statusResponse.json();
if(recoveryOnly) {
  assert.equal(finalStatus.index?.ready,true,'INDEX still missing after recovery');
  assert.equal(finalStatus.tdcc?.ready,true,'TDCC still missing after recovery');
  for(const kind of ['FINANCIAL','VALUATION','ANNOUNCEMENTS','QUARTER_EPS']) assert.equal(finalStatus.datasets?.[kind]?.ready,true,kind+' still missing after recovery');
}
console.log(JSON.stringify({officialQualityStatus:finalStatus,configurationUnchanged:true,noSelection:true,noThreeMinWrite:true,noPush:true}));
if(process.argv.includes('--dry-run')) {
  const storageTest=await admin('/api/signals/storage-test',{method:'POST',body:'{}'});
  const storageResult=await storageTest.json();assert.equal(storageTest.ok,true);assert.equal(storageResult.verified,true);assert.equal(storageResult.noRealSignals,true);
  console.log(JSON.stringify({liveSignalStorageVerified:storageResult}));
  const result=await readonlyPreview({dryRun:true,marketDate},'Readonly selection acceptance');
  assert.equal(result.dryRun,true);
  const finalConfig=await admin('/api/config');assert.deepEqual(await finalConfig.json(),before,'Preview must preserve current plans');
  console.log(JSON.stringify({qualityDryRunVerified:true,selectedCount:result.selectedCount,scanDate:result.scanDate,market:result.market,
    benchmark:result.diagnostics?.relativeStrengthBenchmark,exclusions:result.diagnostics?.exclusions,quarterEpsReview:result.diagnostics?.quarterEpsReview,requirements30:result.diagnostics?.requirements30,preservedPlans:true,noThreeMinWrite:true,noPush:true}));
  assert.equal(result.diagnostics?.quarterEpsReview?.ready,true,'Every final qualifying candidate must have actual quarter EPS review before acceptance');
}
