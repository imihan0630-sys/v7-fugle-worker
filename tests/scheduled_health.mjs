import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

export function assessIntradayHealth(live, date, now=Date.now()) {
  assert.equal(live.tradeDate,date,'Latest monitoring snapshot is not today');
  assert.equal(live.testMode,false,'A simulated snapshot is not production evidence');
  const timestamp=Date.parse(live.generatedAtIso);
  assert.ok(Number.isFinite(timestamp) && timestamp<=now+5000 && now-timestamp<=180000,'Background monitoring snapshot is stale');
  assert.ok(Array.isArray(live.results));
  assert.equal(live.monitoredCount,live.results.length);
  const results=new Map(live.results.map(item=>[item.symbol,item]));
  for(const item of live.results) {
    assert.equal(item.ok,true,'Stock analysis failed: '+item.symbol);
    for(const flag of ['quoteFresh','formal15Fresh','auxiliary10Fresh']) assert.equal(typeof item.executionData?.[flag],'boolean','Missing actual execution guard');
    const checked=Date.parse(item.executionData.checkedAt);
    assert.ok(Number.isFinite(checked) && checked<=now+5000 && now-checked<=180000,'Execution guard is not from recent analysis');
    if(item.executionData.formal15Fresh) {
      assert.equal(item.executionData.quoteFresh,true);
      assert.ok(Number(item.quote?.lastUpdated)>=1e14,'Official quote timestamp must use microseconds');
      assert.equal(item.quote?.isTrial,false);
      const start=Date.parse(item.frame15?.latest?.time),end=start+15*60000;
      assert.ok(Number.isFinite(start) && end<=checked && checked-end<=15*60000+90000,'Formal candle is forming or stale');
      assert.equal(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(start),date);
    }
  }
  const seen=new Set();
  for(const notification of live.notifications || []) {
    const item=results.get(notification.stock?.symbol);assert.ok(item,'Notification is not for a monitored stock');
    assert.equal(notification.signalType==='EARLY_ALERT_10M' ? item.executionData.auxiliary10Fresh : item.executionData.formal15Fresh,true,'Actual notification bypassed candle freshness guard');
    assert.ok(notification.signalId && !seen.has(notification.signalId),'Duplicate delivery episode in one run');seen.add(notification.signalId);
    for(const field of ['currentPrice','reason','instruction','time','stop','profitCheck']) assert.ok(notification[field]!==undefined,'Notification missing '+field);
    if(['STOP_LOSS','SELL','REDUCE'].includes(notification.signalType)) {
      const actual=item.plan?.actualShares;
      if(Number.isInteger(actual) && actual>0) assert.ok(notification.suggestedShares>=0 && notification.suggestedShares<=actual,'Sell amount exceeds actual shares');
      else assert.equal(notification.suggestedShares,null,'Unknown actual shares must not be replaced with plan shares');
    }
    if(['BUY','ADD'].includes(notification.signalType)) {
      assert.equal(item.plan?.planDate,date,'Entry notification used an expired plan');
      assert.equal(notification.suggestedShares,Math.floor(notification.suggestedAmount/notification.currentPrice));
    }
    if(notification.signalType==='ADD') assert.ok(Date.parse(item.frame15?.latest?.time)>Date.parse(item.plan?.firstEntryConfirmedAt),'Add was not after actual first fill');
  }
  return {date,monitoredCount:live.results.length,formal15Ready:live.results.filter(item=>item.executionData.formal15Fresh).length,
    waitingForFreshData:live.results.filter(item=>!item.executionData.formal15Fresh).length,notificationCount:seen.size,
    noSyntheticPush:true,handsetReceiptVerified:false};
}

export function assessAfterMarketHealth(scan,date) {
  assert.equal(scan.scanDate,date,'No completed analysis for today');
  assert.equal(scan.dryRun,false,'Readonly preview cannot prove actual plan import');
  assert.equal(scan.config?.saved,true);assert.equal(scan.config?.verified,true);
  assert.equal(scan.threeMin?.simulated,false);assert.equal(scan.threeMin?.sent,true);
  assert.equal(scan.threeMinPayload?.schemaVersion,'V7_PLAN_2','New full payload has not been accepted');
  assert.equal(scan.dailyReport?.simulated,false);assert.equal(scan.dailyReport?.sent,true);
  assert.equal(scan.diagnostics?.quarterEpsReview?.ready,true,'Actual selected candidates lack EPS review');
  assert.equal(scan.selectedCount,scan.stocks?.length);
  for(const thousand of [true,false]) assert.ok(scan.stocks.filter(s=>(s.formalClose>=1000)===thousand).length<=3,'Cross-pool filling or quota breach');
  for(const stock of scan.stocks) assert.ok(stock.formalClose>=10,'Below10 stock entered monitoring');
  return {date,selectedCount:scan.selectedCount,newFullPayloadAccepted:true,dailyReportHttpAccepted:true,handsetReceiptVerified:false};
}

async function main() {
  const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
  const helpers=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {loadTradingCalendar,isTradingDate};').toString('base64'));
  const now=new Date(),date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
  await helpers.loadTradingCalendar({},Number(date.slice(0,4)));
  const intraday=process.argv.includes('--intraday');
  if(!helpers.isTradingDate(date) || (intraday ? time<'09:20' || time>'13:24' : time<'18:35' || time>'23:00')) {
    console.log(JSON.stringify({skipped:true,date,time,reason:'Outside verified trading-day/window; no business action'}));return;
  }
  assert.ok(process.env.V7_ADMIN_TOKEN,'Normal configured administrator token required');
  const origin='https://fugle-test.imihan0630.workers.dev';
  async function admin(path,method='GET') {
    for(let attempt=0;attempt<3;attempt++) {
      try {
        const response=await fetch(origin+path,{method,headers:{'x-admin-token':process.env.V7_ADMIN_TOKEN},signal:AbortSignal.timeout(45000)});
        if(response.status===401 || response.status===403) throw new Error('Administrator/readback access denied; stop without bypass');
        assert.equal(response.ok,true,`Health check ${path} HTTP ${response.status}`);return await response.json();
      }catch(error){if(method!=='GET' || attempt===2 || !/fetch failed|timeout|ECONNRESET/i.test(String(error))) throw error;}
    }
  }
  const [before,cron]=await Promise.all([admin('/api/config'),admin('/api/cron/status')]);
  if(intraday) {
    const live=await admin('/api/live');
    const proof=assessIntradayHealth(live,date);
    assert.deepEqual(live.results.map(x=>x.symbol).sort(),before.stocks.map(x=>x.symbol).sort(),'Monitoring targets differ from configured plans');
    const latest=cron.recent?.find(x=>x.job_type==='INTRADAY_MONITOR' && x.status==='SUCCESS' && x.finished_at);
    assert.ok(latest && now-Date.parse(latest.finished_at)<=180000,'No recent successful monitoring Cron');
    console.log(JSON.stringify({actualIntradayHealth:proof,cronVerified:true}));
  } else {
    const scan=await admin('/api/scan/status');
    const proof=assessAfterMarketHealth(scan,date);
    // Existing route only performs configured3Min GET and stores internal audit.
    // It never POSTs a plan to3Min or triggers selection/phone push.
    const readback=await admin('/api/three-min/verify','POST');
    assert.equal(readback.verified,true,'Full external payload readback differs');
    console.log(JSON.stringify({actualAfterMarketHealth:proof,externalReadbackVerified:true,noNewSelection:true,noThreeMinPost:true,noPush:true}));
  }
  const after=await admin('/api/config');assert.deepEqual(after,before,'Health verification must preserve all actual plans/capital/holdings');
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) main().catch(error=>{console.error(String(error.message).slice(0,700));process.exitCode=1;});
