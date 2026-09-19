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
  const bridge=scan.planBridge || scan.threeMin;
  const payload=scan.planPayload || scan.threeMinPayload;
  assert.equal(bridge?.simulated,false);assert.equal(bridge?.sent,true);
  // assessAfterMarketHealth validates the completed write shape only; exact external readback is
  // verified below against the active provider so legacy fixtures and live provider checks stay separate.
  assert.equal(payload?.schemaVersion,'V7_PLAN_2','New full payload has not been accepted');
  assert.equal(payload?.scanDate,date,'Plan payload is not from today');
  assert.equal(payload?.stocks?.length,scan.selectedCount,'Plan payload stock count differs from selected plan');
  assert.equal(scan.dailyReport?.simulated,false);assert.equal(scan.dailyReport?.sent,true);
  assert.equal(scan.diagnostics?.quarterEpsReview?.ready,true,'Actual selected candidates lack EPS review');
  assert.equal(scan.selectedCount,scan.stocks?.length);
  for(const thousand of [true,false]) assert.ok(scan.stocks.filter(s=>(s.formalClose>=1000)===thousand).length<=3,'Cross-pool filling or quota breach');
  for(const stock of scan.stocks) assert.ok(stock.formalClose>=10,'Below10 stock entered monitoring');
  return {date,selectedCount:scan.selectedCount,newFullPayloadAccepted:true,bridgeProvider:(scan.planBridge||scan.threeMin)?.provider||'D1_THREEMIN_COMPAT',dailyReportHttpAccepted:true,handsetReceiptVerified:false};
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
  const versionResponse=await fetch(origin+'/api/version',{headers:{'accept':'application/json'},signal:AbortSignal.timeout(20000)});
  assert.equal(versionResponse.ok,true,'Cannot read public runtime version');
  const runtime=await versionResponse.json();
  const [before,cron,outbox,receipts]=await Promise.all([
    admin('/api/config'),admin('/api/cron/status'),admin('/api/push-outbox?limit=50'),admin('/api/push-receipts?limit=50')
  ]);
  assert.equal(outbox.configured,true,'Push outbox is not configured');
  assert.equal(Number(outbox.staleUnresolved||0),0,'Push outbox has unresolved delivery older than 10 minutes');
  if(intraday) {
    const live=await admin('/api/live');
    const proof=assessIntradayHealth(live,date);
    assert.deepEqual(live.results.map(x=>x.symbol).sort(),before.stocks.map(x=>x.symbol).sort(),'Monitoring targets differ from configured plans');
    const outboxById=new Map((outbox.recent||[]).map(item=>[String(item.signal_id),item]));
    for(const notification of (live.notifications||[])) {
      if(notification?.simulated===true || notification?.sent!==true) continue;
      const row=outboxById.get(String(notification.signalId||''));
      assert.ok(row,'Actual intraday notification missing from durable outbox: '+String(notification.signalId||''));
      assert.equal(row.delivery_state,'ACCEPTED','Actual intraday notification outbox is not ACCEPTED');
    }
    const latest=cron.recent?.find(x=>x.job_type==='INTRADAY_MONITOR' && x.status==='SUCCESS' && x.finished_at);
    assert.ok(latest && now-Date.parse(latest.finished_at)<=180000,'No recent successful monitoring Cron');
    console.log(JSON.stringify({actualIntradayHealth:proof,cronVerified:true,
      pushOutbox:{unresolved:outbox.unresolved,staleUnresolved:outbox.staleUnresolved},
      handsetReceipts:{total:receipts.total,intraday:receipts.intraday,signalTypes:receipts.signalTypes}
    }));
  } else {
    const scan=await admin('/api/scan/status');
    const proof=assessAfterMarketHealth(scan,date);
    const journal=await admin('/api/journal/health?date='+encodeURIComponent(date));
    assert.equal(journal.configured,true,'Trade journal D1 is not configured');
    assert.equal(journal.ok,true,'Trade journal latest day is incomplete');
    assert.equal(journal.selectedCount,scan.selectedCount,'Trade journal selected count differs from formal scan');
    assert.equal(journal.planCount,scan.selectedCount,'Trade journal plan rows differ from formal scan');
    assert.equal(scan.dailyReport?.signalId,`DAILY_SELECTION:${date}`,'Daily report lacks durable signal identity');
    const dailyOutbox=(outbox.recent||[]).find(item=>String(item.signal_id)===String(scan.dailyReport.signalId));
    assert.ok(dailyOutbox,'Daily after-market report missing from durable outbox');
    assert.equal(dailyOutbox.delivery_state,'ACCEPTED','Daily after-market report was not accepted by webhook');

    // V7.5.33：觀察池是獨立唯讀結果，最多12檔，且不得與正式池重疊。
    const watchResponse=await fetch(origin+'/api/watchlist?health='+Date.now(),{
      headers:{'user-agent':'V7-Scheduled-Health/1.0','accept':'application/json'},
      signal:AbortSignal.timeout(30000)
    });
    assert.equal(watchResponse.ok,true,`Watchlist health HTTP ${watchResponse.status}`);
    const watch=await watchResponse.json();
    assert.equal(watch.version,runtime.version,'Watchlist runtime version differs from deployed Worker');
    assert.equal(watch.maxStocks,12);
    assert.ok(Array.isArray(watch.stocks));
    assert.equal(watch.count,watch.stocks.length);
    assert.ok(watch.count>=0 && watch.count<=12,'Watchlist exceeds max 12');
    assert.equal(watch.marketDate,date,'Watchlist was not reviewed for today');
    const formalSymbols=new Set((scan.stocks||[]).map(x=>String(x.symbol)));
    for(const stock of watch.stocks) {
      assert.ok(!formalSymbols.has(String(stock.symbol)),'Watchlist must not duplicate formal pool: '+stock.symbol);
      assert.ok(Number(stock.watchScore)>=55,'Watchlist stock below retention score: '+stock.symbol);
    }

    let verifiedScan=scan,storageEvidence=null;
    if(runtime.readiness?.planStorageMode==='D1_GITHUB_ENCRYPTED') {
      storageEvidence=await fetch(origin+'/api/storage/status',{headers:{'accept':'application/json'},signal:AbortSignal.timeout(20000)}).then(async response=>{
        assert.equal(response.ok,true,'Storage status read failed');return response.json();
      });
      assert.equal(storageEvidence.mode,'D1_GITHUB_ENCRYPTED');
      assert.equal(storageEvidence.d1?.configured,true);
      assert.equal(storageEvidence.d1?.latestArchived,true,'D1 primary plan archive missing');
      assert.equal(storageEvidence.github?.encrypted,true,'GitHub mirror must remain encrypted');
      assert.equal(storageEvidence.github?.verified,true,'GitHub encrypted external readback is not verified');
      verifiedScan=await admin('/api/scan/status');
      assert.equal(verifiedScan.planBridge?.provider,'D1_GITHUB_ENCRYPTED','Latest scan did not use GitHub encrypted mirror');
      assert.equal(verifiedScan.planBridge?.github?.verified,true,'GitHub exact readback acceptance was not persisted');
      assert.equal(verifiedScan.pipeline?.externalPlanVerified,true,'Generic external plan verification is incomplete');
      assert.equal(verifiedScan.pipeline?.threeMinVerified,null,'3Min must be inactive after GitHub mirror cutover');
    } else if(runtime.readiness?.planStorageMode==='D1_FIRESTORE') {
      storageEvidence=await fetch(origin+'/api/storage/status',{headers:{'accept':'application/json'},signal:AbortSignal.timeout(20000)}).then(async response=>{
        assert.equal(response.ok,true,'Storage status read failed');return response.json();
      });
      assert.equal(storageEvidence.mode,'D1_FIRESTORE');
      assert.equal(storageEvidence.d1?.configured,true);
      assert.equal(storageEvidence.d1?.latestArchived,true,'D1 primary plan archive missing');
      assert.equal(scan.planBridge?.provider,'D1_FIRESTORE','Latest scan did not use Firestore bridge');
      assert.equal(scan.planBridge?.firebase?.verified,true,'Firestore exact readback was not persisted');
    } else {
      // Historical compatibility only: verify the existing 3Min record without creating a new plan.
      const readback=await admin('/api/three-min/verify','POST');
      assert.equal(readback.verified,true,'Full legacy external payload readback differs');
      verifiedScan=await admin('/api/scan/status');
      assert.equal(verifiedScan.threeMin?.verified,true,'Legacy 3Min exact readback was not persisted');
    }
    assert.equal(verifiedScan.scanDate,date,'External readback acceptance attached to a stale scan');
    assert.equal(verifiedScan.diagnostics?.requirements30?.requirement26?.complete,true,'Rule 26 was not marked complete after exact external readback');
    assert.equal(verifiedScan.diagnostics?.requirements30?.incompleteRules?.includes(26),false,'Rule 26 still appears incomplete after exact external readback');
    console.log(JSON.stringify({
      actualAfterMarketHealth:proof,
      watchlistVerified:{count:watch.count,maxStocks:watch.maxStocks,noFormalOverlap:true,marketDate:watch.marketDate},
      externalReadbackVerified:true,externalPlanProvider:proof.bridgeProvider,requirement26Accepted:true,
      storageEvidence:storageEvidence?{mode:storageEvidence.mode,d1Archived:storageEvidence.d1?.latestArchived,
        githubVerified:storageEvidence.github?.verified===true,firebaseConfigured:storageEvidence.firebase?.configured}:null,
      dailyReportOutboxAccepted:true,
      tradeJournal:{verified:true,selectedCount:journal.selectedCount,planCount:journal.planCount,signalCount:journal.signalCount},
      pushOutbox:{unresolved:outbox.unresolved,staleUnresolved:outbox.staleUnresolved},
      handsetReceipts:{total:receipts.total,dailySelection:receipts.dailySelection,intraday:receipts.intraday},
      noNewSelection:true,noThreeMinPost:true,noPush:true
    }));
  }
  const acceptance=await admin('/api/acceptance/reconcile','POST');
  assert.equal(acceptance.ok,true,'Acceptance evidence reconciliation failed');
  assert.equal(acceptance.noPlanChanges,true);
  assert.equal(acceptance.noPush,true);
  assert.equal(acceptance.noThreeMinWrite,true);
  assert.equal(acceptance.noTrade,true);
  const after=await admin('/api/config');assert.deepEqual(after,before,'Health verification must preserve all actual plans/capital/holdings');
  console.log(JSON.stringify({acceptanceReconciled:true,changed:acceptance.changed,
    acceptedRules:Object.entries(acceptance.ledger?.rules || {}).filter(([,value])=>value?.acceptedAt).map(([rule])=>Number(rule)).sort((a,b)=>a-b),
    pendingEvidence:Object.fromEntries([17,18,19,27,28,29].filter(rule=>acceptance.evidence?.[rule]?.complete!==true).map(rule=>[rule,acceptance.evidence?.[rule]?.proof || null])),
    noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true
  }));
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) main().catch(error=>{console.error(String(error.message).slice(0,700));process.exitCode=1;});
