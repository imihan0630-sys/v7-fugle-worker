import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {assessIntradayHealth,assessAfterMarketHealth} from './scheduled_health.mjs';
{
  const now=Date.parse('2026-09-16T01:16:30Z');
  const live={tradeDate:'2026-09-16',testMode:false,generatedAtIso:new Date(now).toISOString(),monitoredCount:1,results:[{symbol:'1234',ok:true,plan:{planDate:'2026-09-16',positionStage:'NONE'},quote:{lastUpdated:now*1000,isTrial:false},executionData:{quoteFresh:true,formal15Fresh:true,auxiliary10Fresh:true,checkedAt:new Date(now).toISOString()},frame15:{latest:{time:'2026-09-16T01:00:00Z'}}}],notifications:[]};
  assert.equal(assessIntradayHealth(live,'2026-09-16',now).formal15Ready,1);
  assert.throws(()=>assessIntradayHealth({...live,tradeDate:'2026-09-15'},'2026-09-16',now),/not today/);
  const forming=structuredClone(live);forming.results[0].frame15.latest.time='2026-09-16T01:15:00Z';
  assert.throws(()=>assessIntradayHealth(forming,'2026-09-16',now),/forming/);
  assert.throws(()=>assessIntradayHealth(live,'2026-09-16',now+240000),/stale/);
  const baseNotification={stock:{symbol:'1234'},signalType:'SELL',signalId:'unique',suggestedShares:50,currentPrice:100,reason:'fixture',instruction:'fixture',time:'fixture',stop:95,profitCheck:120};
  assert.throws(()=>assessIntradayHealth({...live,notifications:[baseNotification]},'2026-09-16',now),/Unknown actual shares/);
  const actual=structuredClone(live);actual.results[0].plan.actualShares=50;actual.notifications=[baseNotification];assert.equal(assessIntradayHealth(actual,'2026-09-16',now).notificationCount,1);
  assert.throws(()=>assessIntradayHealth({...actual,notifications:[baseNotification,baseNotification]},'2026-09-16',now),/Duplicate/);
  const scan={scanDate:'2026-09-16',dryRun:false,config:{saved:true,verified:true},threeMin:{sent:true,simulated:false},threeMinPayload:{schemaVersion:'V7_PLAN_2',scanDate:'2026-09-16',stocks:[{symbol:'1234'}]},dailyReport:{sent:true,simulated:false},diagnostics:{quarterEpsReview:{ready:true}},selectedCount:1,stocks:[{formalClose:1000}]};
  assert.equal(assessAfterMarketHealth(scan,'2026-09-16').newFullPayloadAccepted,true);
  assert.throws(()=>assessAfterMarketHealth({...scan,dryRun:true},'2026-09-16'),/Readonly preview/);
  assert.throws(()=>assessAfterMarketHealth({...scan,stocks:Array.from({length:4},()=>({formalClose:1000})),selectedCount:4,threeMinPayload:{...scan.threeMinPayload,stocks:Array.from({length:4},(_,i)=>({symbol:String(1000+i)}))}},'2026-09-16'),/quota/);
}
// A delayed Cloudflare propagation must not be mistaken for a failed upload.
{
  const verification = await readFile(new URL('./verify_deployment.mjs', import.meta.url), 'utf8');
  const originalFetch = globalThis.fetch;
  const originalBaseline = process.env.V7_DEPLOY_BASELINE_PATH;
  delete process.env.V7_DEPLOY_BASELINE_PATH;
  let checks = 0;
  globalThis.fetch = async (url, options) => {
    assert.equal(options.cache, 'no-store');
    assert.match(url, /deploymentCheck=/);
    checks++;
    return {ok:true, status:200, json:async () => ({version:checks <= 8 ? 'previous-runtime' : 'test-current', bindings:{kv:true,d1:true},readiness:{}})};
  };
  try {
    const fixture = verification.replace("import {readFile} from 'node:fs/promises';", 'const readFile = async () => \'const VERSION = "test-current";\';')
      .replace('setTimeout(resolve, 5000)', 'setTimeout(resolve, 0)');
    await import('data:text/javascript;base64,' + Buffer.from(fixture).toString('base64'));
    assert.equal(checks, 9, 'Verification must wait beyond six stale reads without uploading again');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalBaseline !== undefined) process.env.V7_DEPLOY_BASELINE_PATH = originalBaseline;
  }
}
process.on('uncaughtException',error=>{console.error(String(error.message).slice(0,1800));process.exit(1);});
const source = await readFile(process.env.V7_TEST_WORKER_PATH || new URL('./Worker_V7_7.5.11_REQUIREMENTS_REPAIR.mjs', import.meta.url), 'utf8');
const quarterHelpers=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {parseMopsQuarterEpsHtml,validateOfficialQualityData,deriveQuarterlyFinancials};').toString('base64'));
{
  const report=(current='27.25',prior='15.36',period='115年第2季')=>`合併綜合損益表 單位：新台幣仟元 <a href="/server-java/t164sb01?step=1&CO_ID=2330&SYEAR=2026&SSEASON=2&REPORT_ID=C">XBRL</a><table><tr><th>會計項目</th><th colspan="2">${period}</th><th colspan="2">114年第2季</th><th colspan="2">115年01月01日至115年06月30日</th><th colspan="2">114年01月01日至114年06月30日</th></tr><tr><td>基本每股盈餘</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>　基本每股盈餘</td><td>${current}</td><td></td><td>${prior}</td><td></td><td>49.33</td><td></td><td>29.31</td><td></td></tr></table>`;
  const actual=quarterHelpers.parseMopsQuarterEpsHtml(report(),'2330',2026,2);
  assert.equal(actual.quarterEPS,27.25);assert.equal(actual.reportedPriorYearQuarterEPS,15.36);assert.equal(actual.epsQoQ,null);
  assert.ok(Math.abs(actual.epsYoY-(27.25/15.36-1)*100)<1e-10);
  assert.equal(quarterHelpers.parseMopsQuarterEpsHtml(report('-1.89','-3.20'),'2330',2026,2).epsYoY,null,'Negative comparison base is not growth');
  assert.throws(()=>quarterHelpers.parseMopsQuarterEpsHtml(report(),'6706',2026,2),/公司/);
  assert.throws(()=>quarterHelpers.parseMopsQuarterEpsHtml(report('27.25','15.36','115年01月01日至115年06月30日'),'2330',2026,2),/真正單季/,'Cumulative period is not quarter EPS');
  assert.throws(()=>quarterHelpers.parseMopsQuarterEpsHtml(report()+report(),'2330',2026,2),/不唯一/);
  assert.throws(()=>quarterHelpers.parseMopsQuarterEpsHtml(report(),'2330',2026,4),/輸入/);
  const q2Financial={year:2026,quarter:2,stocks:{'2330':{}}};
  const body={kind:'QUARTER_EPS',year:2026,quarter:2,financialSnapshot:q2Financial,reports:[{symbol:'2330',sourceUrl:'https://mopsov.twse.com.tw/mops/web/ajax_t164sb04',html:report()}]};
  assert.throws(()=>quarterHelpers.validateOfficialQualityData(body,'2026-09-16'),/前一季/,'Requirement 11 now requires a verified previous-quarter EPS before QoQ is accepted');
  const previous=report('22.08','13.95').replace('SSEASON=2','SSEASON=1').replace('115年第2季','115年第1季').replace('114年第2季','114年第1季');
  const paired={...body,reports:[{...body.reports[0],previousQuarterHtml:previous}]};
  const stock=quarterHelpers.validateOfficialQualityData(paired,'2026-09-16').stocks['2330'];
  assert.equal(stock.previousQuarterEPS,22.08);assert.equal(stock.previousQuarterEpsVerified,true);
  const q1Actual=previous.replace('<th colspan="2">114年第1季</th>','<th colspan="2">115年第1季</th>').replace('<th colspan="2">115年01月01日至115年06月30日</th>','<th colspan="2">114年01月01日至114年03月31日</th>').replace('<th colspan="2">114年01月01日至114年06月30日</th>','<th colspan="2">114年第1季</th>').replace('<td>13.95</td>','<td>22.08</td>').replace('<td>49.33</td>','<td>13.95</td>').replace('<td>29.31</td>','<td>13.95</td>');
  const q1=quarterHelpers.parseMopsQuarterEpsHtml(q1Actual,'2330',2026,1);
  assert.equal(q1.quarterEPS,22.08);assert.equal(q1.reportedPriorYearQuarterEPS,13.95);
  assert.throws(()=>quarterHelpers.parseMopsQuarterEpsHtml(q1Actual.replace('<td>22.08</td>','<td>99</td>'),'2330',2026,1),/欄位不一致/);

  assert.equal(stock.epsQoQReady,true);assert.ok(Math.abs(stock.epsQoQ-(27.25/22.08-1)*100)<1e-10,'Verified direct single-quarter EPS should support QoQ');
  assert.throws(()=>quarterHelpers.validateOfficialQualityData({...paired,reports:[{...paired.reports[0],previousQuarterHtml:report()}]},'2026-09-16'),/季別/);
  assert.throws(()=>quarterHelpers.validateOfficialQualityData({...paired,reports:[{...paired.reports[0],previousQuarterHtml:previous.replace('CO_ID=2330','CO_ID=6706')}]},'2026-09-16'),/公司/);
  const turnaround=quarterHelpers.parseMopsQuarterEpsHtml(report('2.18','-0.79'),'2330',2026,2);
  assert.equal(turnaround.epsTurnedProfitable,1);assert.equal(turnaround.epsYoY,null);assert.equal(turnaround.epsComparisonsReady,true);
  assert.equal(turnaround.epsYoYPercentageReady,false);
  const narrower=quarterHelpers.parseMopsQuarterEpsHtml(report('-1.89','-3.20'),'2330',2026,2);
  assert.equal(narrower.epsLossNarrowed,1);assert.equal(narrower.epsLossWidened,0);
  assert.equal(quarterHelpers.parseMopsQuarterEpsHtml(report('-4','-3.20'),'2330',2026,2).epsLossWidened,1);
  assert.equal(quarterHelpers.parseMopsQuarterEpsHtml(report('2','0'),'2330',2026,2).epsYoY,null);

  // V8.0.1 Requirement 11: TWSE 財務比較E點通明示 Q4 單季 = Q4累計 - Q3累計。
  const fin=(epsYTD,revenueYTD,grossYTD,operatingYTD)=>({epsYTD,revenueYTD,grossYTD,operatingYTD});
  const periods=[
    {year:2025,quarter:4,stocks:{'2412':fin(4.99,236114409,86969217,48547702)}},
    {year:2025,quarter:3,stocks:{'2412':fin(3.79,170463142,64892333,37167934)}},
    {year:2025,quarter:2,stocks:{'2412':fin(2.57,110000000,43000000,24500000)}},
    {year:2024,quarter:4,stocks:{'2412':fin(4.80,220000000,82000000,45000000)}},
    {year:2024,quarter:3,stocks:{'2412':fin(3.60,160000000,60000000,34000000)}}
  ];
  const q4Financial=quarterHelpers.deriveQuarterlyFinancials(periods,2025,4);
  assert.equal(q4Financial['2412'].quarterEPS,1.2);
  assert.equal(q4Financial['2412'].quarterEpsVerified,true);
  assert.equal(q4Financial['2412'].quarterEpsMethod,'MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3');
  const q3Html=report('1.22','1.25','114年第3季')
    .replaceAll('SYEAR=2026','SYEAR=2025').replaceAll('SSEASON=2','SSEASON=3')
    .replaceAll('115年第2季','114年第3季').replaceAll('114年第2季','113年第3季')
    .replaceAll('115年01月01日至115年06月30日','114年01月01日至114年09月30日')
    .replaceAll('114年01月01日至114年06月30日','113年01月01日至113年09月30日');
  const q4Body={kind:'QUARTER_EPS',year:2025,quarter:4,financialSnapshot:{year:2025,quarter:4,stocks:q4Financial},
    reports:[{symbol:'2412',sourceUrl:'https://mopsfin.twse.com.tw/terms',previousQuarterHtml:q3Html.replaceAll('CO_ID=2330','CO_ID=2412')}]};
  const q4Stock=quarterHelpers.validateOfficialQualityData(q4Body,'2026-03-31').stocks['2412'];
  assert.equal(q4Stock.quarterEPS,1.2);assert.equal(q4Stock.previousQuarterEPS,1.22);assert.equal(q4Stock.epsQoQReady,true);
  assert.ok(Math.abs(q4Stock.epsQoQ-(1.2/1.22-1)*100)<1e-10);
  assert.throws(()=>quarterHelpers.validateOfficialQualityData({...q4Body,reports:[{...q4Body.reports[0],sourceUrl:'https://example.com'}]},'2026-03-31'),/Q4/);

  // Q1 的前一季需使用前一年度 Q4 官方公式結果，而不是把它當成未來資料。
  const q1Financial={year:2026,quarter:1,stocks:{'2330':{previousQuarterEPS:1.2,previousQuarterEpsVerified:true,previousQuarterEpsMethod:'MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3'}}};
  const q1Body={kind:'QUARTER_EPS',year:2026,quarter:1,financialSnapshot:q1Financial,reports:[{symbol:'2330',sourceUrl:'https://mopsov.twse.com.tw/mops/web/ajax_t164sb04',html:q1Actual}]};
  const q1Validated=quarterHelpers.validateOfficialQualityData(q1Body,'2026-05-20').stocks['2330'];
  assert.equal(q1Validated.previousQuarterEPS,1.2);assert.equal(q1Validated.epsQoQReady,true);
  assert.throws(()=>quarterHelpers.validateOfficialQualityData(paired,'2026-03-31'),/期間/,'Future quarters are invalid inputs, not current data requirements');

  assert.throws(()=>quarterHelpers.validateOfficialQualityData({...paired,reports:[...paired.reports,...paired.reports]},'2026-09-16'),/重複/);
  assert.throws(()=>quarterHelpers.validateOfficialQualityData({...body,reports:[{...body.reports[0],sourceUrl:'https://example.com'}]},'2026-09-16'),/來源/);
}
const api = await import('data:text/javascript;base64,' + Buffer.from(source + '\nexport { evaluateOperationSignals, evaluateStop, processSignalState, recalculatePlanCapital, saveStockConfig, KV_KEY, fetchMarketRows, fetchClosingRowsWithFallback, normalizeMarketDate, normalizeStock, enforceIndependentPoolQuota, buildPublicRecommendations, buildDailySelectionPayload, formatSlackSignalMessage, scoreCandidate, nextTradingDate, mostRecentWeekday, runAfterMarketScan, MARKET_STATE_KEY, allocateAndBuildPlans, sendTo3Min, verifyThreeMinReadback, parseOfficialCsv, fetchOfficialEnrichment, buildThreeMinPayload, waitingLivePage, LAST_SCAN_KEY, validateInstitutionData, institutionSourceUrls, readInstitutionStreakMap, writeInstitutionSnapshot };').toString('base64'));
class MemoryKV {
  values = new Map();
  async get(key, type) { const raw = this.values.get(key); return raw === undefined ? null : type === 'json' ? JSON.parse(raw) : raw; }
  async put(key, value) { this.values.set(key, value); }
}
const qualityApi=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {validateOfficialQualityData,writeQualitySnapshot,readQualitySnapshot,recentWeekdays,selectTomorrowCandidates,parseMopsIncomeHtml,parseMopsMarketOptions,deriveQuarterlyFinancials,analyzeFrame,executionDataStatus};').toString('base64'));
class MemoryD1 {
  snapshots=new Map();
  quality=new Map();
  delivery=new Map();
  withSession(){return this;}
  prepare(sql){
    const db=this;
    return {args:[],bind(...args){this.args=args;return this;},async first(){
      if(sql.includes('FROM v7_signal_delivery_state')) {const row=db.delivery.get(this.args[0]);return row?.lease_token===this.args[1] ? row : null;}
      return sql.includes('FROM v7_quality_snapshots') ? db.quality.get(this.args.slice(0,2).join(':')) || null : null;},
      async all(){return {results:sql.includes('FROM v7_institution_snapshots')?[...db.snapshots.values()].filter(row=>row.market_date<=this.args[0]).sort((a,b)=>b.market_date.localeCompare(a.market_date)).slice(0,this.args[1]):[]};},
      async run(){if(sql.includes('INSERT INTO v7_institution_snapshots')){
        const [market_date,snapshot_json,stock_count,updated_at,minimum]=this.args;
        const old=db.snapshots.get(market_date);
        if(!old || stock_count>=minimum || old.stock_count<minimum) db.snapshots.set(market_date,{market_date,snapshot_json,stock_count,updated_at});
      }if(sql.includes('INSERT INTO v7_quality_snapshots')){db.quality.set(this.args.slice(0,2).join(':'),{snapshot_json:this.args[2]});}
      if(sql.includes('INSERT INTO v7_signal_delivery_state')){const [key,token,until,updated,now]=this.args,old=db.delivery.get(key);if(!old || old.lease_until<now)db.delivery.set(key,{...old,lease_token:token,lease_until:until});}
      if(sql.includes('UPDATE v7_signal_delivery_state SET snapshot_json')) {const [json,updated,key,token]=this.args,old=db.delivery.get(key);if(old?.lease_token===token) old.snapshot_json=json;else return {meta:{rows_written:0,changes:0}};}
      if(sql.includes('UPDATE v7_signal_delivery_state SET lease_token=NULL')) {const [key,token]=this.args,old=db.delivery.get(key);if(old?.lease_token===token){old.lease_token=null;old.lease_until=0;}}
      return {meta:{rows_written:1,changes:1}};}};
  }
}
const result = () => ({
  ok: true, symbol: 'TEST', name: '測試', currentPrice: 120,
  plan: { positionStage: 'NONE', pushEnabled: true, firstAmount: 6000, firstShares: 50,
    secondAmount: 4000, secondShares: 33, totalAllocation: 10000, totalShares: 83,
    reduceAt: 115, sellBelow: null, stop: 100, profitCheck: 130 },
  stop: { level: 'ok' }, profit: { level: 'ok' },
  finalDecision: { level: 'buy', text: '15分K確認' },
  frame10: { latest: { bearish: true, volumeRatio: 2 } },
  frame15: { latest: { close: 120, bearish: false, volumeRatio: 0.8 } },
});

{
  const realFetch=globalThis.fetch;
  const makeEnv=()=>({STOCKS_KV:new MemoryKV(),V7_DB:new MemoryD1(),TEST_MODE:'false',PUSH_WEBHOOK_URL:'https://example.com/test-only-mock'});
  const clear=result();clear.finalDecision.level='wait';
  let calls=0;
  globalThis.fetch=async()=>{calls++;throw new Error('mock network ambiguity after acceptance');};
  try{
    const ambiguous=makeEnv();
    const attempt=await api.processSignalState(result(),ambiguous,'2026-09-16');
    assert.equal(attempt[0].deliveryState,'UNKNOWN');assert.equal(attempt[0].automaticRetryBlocked,true);
    assert.equal((await api.processSignalState(result(),ambiguous,'2026-09-16')).length,0);
    const stale={...clear,executionData:{formal15Fresh:false,auxiliary10Fresh:false}};
    await api.processSignalState(stale,ambiguous,'2026-09-16');
    assert.equal((await api.processSignalState(result(),ambiguous,'2026-09-16')).length,0,'Stale data is not a release');
    assert.equal(calls,1);
    await api.processSignalState(clear,ambiguous,'2026-09-16');
    const again=await api.processSignalState(result(),ambiguous,'2026-09-16');
    assert.equal(calls,2);assert.notEqual(again[0].signalId,attempt[0].signalId);
    globalThis.fetch=async()=>{calls++;return {ok:false,status:403,text:async()=> 'mock rejection'};};
    const rejected=makeEnv();await api.processSignalState(result(),rejected,'2026-09-16');
    assert.equal((await api.processSignalState(result(),rejected,'2026-09-16')).length,0,'403 must not loop');
    assert.equal(calls,3);
    globalThis.fetch=async()=>{calls++;return {ok:true,status:200};};
    const crash=makeEnv();
    const prepare=crash.V7_DB.prepare.bind(crash.V7_DB);
    let crashOnce=true;
    crash.V7_DB.prepare=sql=>{
      const statement=prepare(sql),run=statement.run.bind(statement);
      statement.run=async()=>{
        if(crashOnce && sql.includes('SET snapshot_json')){
          const snapshot=JSON.parse(statement.args[0]);
          if(snapshot.fired?.includes('NONE:BUY')){
            crashOnce=false;throw new Error('mock crash after webhook acceptance before ACK save');
          }
        }
        return run();
      };return statement;
    };
    await assert.rejects(()=>api.processSignalState(result(),crash,'2026-09-16'),/mock crash/);
    assert.equal(calls,4);
    assert.equal((await api.processSignalState(result(),crash,'2026-09-16')).length,0,'Persisted reservation survives missing final ACK');
    await api.processSignalState(clear,crash,'2026-09-16');
    const restored=await api.processSignalState(result(),crash,'2026-09-16');
    assert.equal(restored[0].sent,true);assert.equal(calls,5);
    assert.match(restored[0].signalId,/:episode-2$/);
  }finally{globalThis.fetch=realFetch;}
}

const env = { STOCKS_KV: new MemoryKV(), TEST_MODE: 'true' };
const freshnessNow=Date.parse('2026-09-16T01:31:00Z'),currentQuote={date:'2026-09-16',symbol:'TEST',closePrice:120,lastUpdated:(freshnessNow-1000)*1000};
const frame15Fixture={latest:{time:'2026-09-16T01:15:00Z'}},frame10Fixture={latest:{time:'2026-09-16T01:20:00Z'}};
assert.equal(qualityApi.executionDataStatus(currentQuote,frame10Fixture,frame15Fixture,'TEST',freshnessNow).formal15Fresh,true);
assert.equal(qualityApi.executionDataStatus({...currentQuote,lastUpdated:freshnessNow-1000},frame10Fixture,frame15Fixture,'TEST',freshnessNow).quoteFresh,false,'Do not misread milliseconds as official microseconds');
assert.equal(qualityApi.executionDataStatus({...currentQuote,isTrial:true},frame10Fixture,frame15Fixture,'TEST',freshnessNow).formal15Fresh,false);
assert.equal(qualityApi.executionDataStatus(currentQuote,frame10Fixture,{latest:{time:'2026-09-15T01:15:00Z'}},'TEST',freshnessNow).formal15Fresh,false);
assert.equal(qualityApi.executionDataStatus({...currentQuote,lastUpdated:(freshnessNow-120000)*1000},frame10Fixture,frame15Fixture,'TEST',freshnessNow).quoteFresh,false);
const freshBar=time=>({date:time,open:120,high:121,low:119,close:120,volume:100});
const validatedFrame=qualityApi.analyzeFrame({data:[freshBar('2026-09-16T01:30:00Z'),freshBar('2026-09-15T01:15:00Z'),freshBar('2026-09-16T01:15:00Z')]},15,freshnessNow);
assert.equal(validatedFrame.completedBars,1,'Exclude forming and prior-day candles');
assert.throws(()=>qualityApi.analyzeFrame({data:[freshBar('2026-09-16T01:15:00Z'),freshBar('2026-09-16T01:15:00Z')]},15,freshnessNow),/重複/);
const staleSignal={...result(),executionData:{formal15Fresh:false,auxiliary10Fresh:false}};
assert.equal((await api.processSignalState(staleSignal,{STOCKS_KV:new MemoryKV(),TEST_MODE:'true'},'2026-09-16')).length,0);
const first = await api.processSignalState(result(), env, '2026-09-16');
assert.equal(first.length, 1);
assert.equal((await api.processSignalState(result(), env, '2026-09-16')).length, 0);
const released = result(); released.finalDecision.level = 'wait';
assert.equal((await api.processSignalState(released, env, '2026-09-16')).length, 0);
const rearmed = await api.processSignalState(result(), env, '2026-09-16');
assert.equal(rearmed.length, 1);
assert.notEqual(first[0].signalId, rearmed[0].signalId);
assert.equal((await api.processSignalState(result(), env, '2026-09-16')).length, 0);
assert.equal((await api.processSignalState(result(), env, '2026-09-17')).length, 1);
const held = result(); held.plan.positionStage = 'FULL'; held.finalDecision.level = 'wait';
assert.equal(api.evaluateOperationSignals(held).some(x => x.type === 'REDUCE'), false);
held.frame15.latest = { close: 119, bearish: true, volumeRatio: 1.3 };
assert.equal(api.evaluateOperationSignals(held).some(x => x.type === 'REDUCE'), true);
assert.equal(api.evaluateStop({ latest: { close: 101 } }, { latest: { bearish: true, volumeRatio: 2 } }, 98, { stop: 100 }).level, 'watch');
assert.equal(api.evaluateStop({ latest: { close: 99 } }, { latest: null }, 99, { stop: 100 }).level, 'risk');
// 無Webhook時必須保留重試機會，不能把失敗寫成已通知。
const failedEnv = { STOCKS_KV: new MemoryKV(), TEST_MODE: 'false',V7_DB:new MemoryD1() };
assert.equal((await api.processSignalState(result(), failedEnv, '2026-09-16'))[0].sent, false);
failedEnv.TEST_MODE = 'true';
assert.equal((await api.processSignalState(result(), failedEnv, '2026-09-16'))[0].sent, true);
const concurrentEnv={STOCKS_KV:new MemoryKV(),V7_DB:new MemoryD1(),TEST_MODE:'true'};
const concurrent=await Promise.all(Array.from({length:80},()=>api.processSignalState(result(),concurrentEnv,'2026-09-16')));
assert.equal(concurrent.flat().filter(signal=>signal.sent).length,1,'D1 lease allows one sender under parallel invocation');
concurrentEnv.STOCKS_KV.values.clear();
assert.equal((await api.processSignalState(result(),concurrentEnv,'2026-09-16')).length,0,'Stale or missing KV cannot duplicate authoritative D1 state');
await api.processSignalState({...result(),finalDecision:{level:'wait'}},concurrentEnv,'2026-09-16');
assert.equal((await api.processSignalState(result(),concurrentEnv,'2026-09-16')).filter(signal=>signal.sent).length,1,'Release followed by reactivation still notifies');
await assert.rejects(api.processSignalState(result(),{STOCKS_KV:new MemoryKV(),TEST_MODE:'false'},'2026-09-16'),/D1/);
const plan = { ...result().plan, name: '測試', allocationRatio: 25, buyHigh: 120 };
const capital = api.recalculatePlanCapital([plan], 300000);
assert.equal(capital.stocks[0].totalAllocation, 75000);
assert.equal(capital.stocks[0].firstAmount, 45000);
assert.equal(capital.stocks[0].secondAmount, 30000);
assert.equal(capital.remainingCash, 225000);
assert.equal(capital.stocks[0].firstShares, 375);
assert.equal(capital.stocks[0].totalShares, 625);
assert.equal(plan.totalAllocation, 10000);
assert.throws(() => api.recalculatePlanCapital([{ ...plan, positionStage: 'FIRST' }], 300000));
assert.throws(() => api.recalculatePlanCapital([{ ...plan, allocationRatio: null }], 300000));
assert.throws(() => api.recalculatePlanCapital([plan], 0));
assert.throws(() => api.recalculatePlanCapital([{ ...plan, allocationRatio: 60 }, { ...plan, allocationRatio: 60 }], 300000));
await api.saveStockConfig(env, [], 'test', 300000);
await api.saveStockConfig(env, [], 'test import');
assert.equal((await env.STOCKS_KV.get(api.KV_KEY, 'json')).totalCapital, 300000);
const denied = await api.default.fetch(new Request('https://example.invalid/api/capital', { method: 'POST' }), env);
assert.equal(denied.status, 401);
assert.equal(api.normalizeMarketDate('1150916'), '2026-09-16');
assert.equal(api.normalizeMarketDate('2026/09/16'), '2026-09-16');
assert.equal(api.nextTradingDate('2026-09-24'), '2026-09-29');
assert.equal(api.mostRecentWeekday('2026-09-28'), '2026-09-24');
const highPool = Array.from({ length: 4 }, (_, i) => ({ formalClose: 1000, buyHigh: 990, sourceRank: i + 1 }));
const lowPool = Array.from({ length: 2 }, (_, i) => ({ formalClose: 999, buyHigh: 1001, sourceRank: i + 5 }));
assert.equal(api.enforceIndependentPoolQuota([...highPool, ...lowPool]).length, 5);
assert.equal(api.enforceIndependentPoolQuota(highPool).length, 3);
assert.equal(api.normalizeStock({symbol:'1234', name:'測試', formalClose:10, buyHigh:9.9, mode:'PULLBACK'}, 0).formalClose, 10);
assert.throws(() => api.normalizeStock({symbol:'1234', formalClose:9.99, buyHigh:11}, 0));
const failedRecommendations = api.buildPublicRecommendations({scanDate:'2026-09-11',stocks:[]}, {status:'FAILED', requestedDate:'2026-09-16',error:'private'});
assert.equal(failedRecommendations.resultType, 'SCAN_FAILED');
assert.equal(failedRecommendations.isCurrent, false);
assert.equal(failedRecommendations.attempt.error, undefined);
assert.equal(api.buildPublicRecommendations(null).resultType, 'NOT_SCANNED');
assert.match(api.formatSlackSignalMessage(api.buildDailySelectionPayload('2026-09-16', [], {})), /維持現金/);
const originalFetch = globalThis.fetch;
const table = { date:'20260916', tables:[{ fields:['代號','名稱','收盤','開盤','最高','最低','成交股數','成交金額(元)'],
  data:Array.from({length:450}, (_, i) => [String(1000+i),'測試',100,99,101,98,'5000000','500000000']) }] };
globalThis.fetch = async url => new Response(JSON.stringify(table), {status:200});
assert.equal((await api.fetchMarketRows('https://example.invalid', 'TPEx', '2026-09-16')).length, 450);
assert.equal((await api.fetchMarketRows('https://example.invalid', 'TPEx', '2026-09-16'))[0].tradeValue, 500000000);
await assert.rejects(api.fetchMarketRows('https://example.invalid', 'TPEx', '2026-09-15'));
let calls = 0;
globalThis.fetch = async () => ++calls === 1 ? new Response('', {status:302}) : new Response(JSON.stringify(table));
assert.equal((await api.fetchClosingRowsWithFallback({}, 'TPEx', '2026-09-16')).source, 'TPEX_OFFICIAL_DATED_API');
const twseTable = {date:'20260916',stat:'OK',tables:[{fields:['證券代號','證券名稱','成交股數','成交金額','開盤價','最高價','最低價','收盤價','漲跌(+/-)','漲跌價差'],
  data:Array.from({length:600},(_,i)=>[String(1000+i),'上市測試','5000000','500000000',101,102,99,100,'<p style=color:green>-</p>',2])}]};
calls=0;
globalThis.fetch=async url=>{
  calls++;
  if(calls===1) return new Response(JSON.stringify([{Date:'20260915',Code:'2330',Name:'台積電',ClosingPrice:2380}]));
  assert.match(String(url),/date=20260916/);
  return new Response(JSON.stringify(twseTable));
};
const datedTwseRows=await api.fetchClosingRowsWithFallback({},'TWSE','2026-09-16');
assert.equal(datedTwseRows.source,'TWSE_OFFICIAL_DATED_API');
assert.equal(datedTwseRows.length,600);
assert.equal(datedTwseRows[0].closeDate,'2026-09-16');
assert.equal(datedTwseRows[0].changePercent,-2/102*100);
globalThis.fetch=async()=>new Response(JSON.stringify({...twseTable,date:'20260915'}));
await assert.rejects(api.fetchClosingRowsWithFallback({},'TWSE','2026-09-16'),/日期2026-09-15/);
const cachedEnv={STOCKS_KV:new MemoryKV(),ADMIN_TOKEN:'mock-admin'};
const cacheDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const cacheUrl=`https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=${encodeURIComponent(cacheDate.replaceAll('-','/'))}&id=&response=json`;
const cachePayload={market:'TPEx',marketDate:cacheDate,sourceUrl:cacheUrl,payload:{...table,date:cacheDate.replaceAll('-','')}};
const cacheRequest=(body,token='mock-admin')=>new Request('https://example.invalid/api/market-data',{method:'POST',headers:{'x-admin-token':token,'content-type':'application/json'},body:JSON.stringify(body)});
assert.equal((await api.default.fetch(cacheRequest(cachePayload,'wrong'),cachedEnv)).status,401);
assert.equal((await api.default.fetch(cacheRequest({...cachePayload,sourceUrl:'https://example.invalid'}),cachedEnv)).status,400);
const cachedResult=await api.default.fetch(cacheRequest(cachePayload),cachedEnv);
assert.equal(cachedResult.status,200);
assert.equal((await cachedResult.json()).verified,true);
globalThis.fetch=async()=>new Response('',{status:302});
const fromCache=await api.fetchClosingRowsWithFallback(cachedEnv,'TPEx',cacheDate);
let cacheNetworkCalls=0;
globalThis.fetch=async()=>{cacheNetworkCalls++;throw new Error('Verified current cache must be used before public network');};
assert.equal((await api.fetchClosingRowsWithFallback(cachedEnv,'TPEx',cacheDate)).length,450);
assert.equal(cacheNetworkCalls,0);
assert.equal(fromCache.source,'OFFICIAL_DATED_ACTIONS_CACHE');
assert.equal(fromCache.length,450);
await assert.rejects(api.fetchClosingRowsWithFallback(cachedEnv,'TPEx','2020-01-01'));
assert.equal(await cachedEnv.STOCKS_KV.get(api.KV_KEY),null,'Market cache must not overwrite targets');
globalThis.fetch = originalFetch;
const qualified = {symbol:'1234',name:'合格測試',close:101,historyDays:65,marketCapYi:200,changePercent:1,
  avgVolume20Lots:5000,atrPercent:2,ma5:99,ma10:98,ma20:97,ma60:95,prevMa20:96,bullishStack:true,
  priorHigh20:100,priorHigh60:120,priorLow20:90,todayLow:100,recentHigh10:100,volumeTodayVsPrev5:2,
  dailyClosePosition:.9,dailyUpperShadowRatio:.05,ret20:10,marketReturn20:1,
  eps:5,revenueYoY:50,grossMargin:50,operatingMargin:25,trustBuyDays:3,foreignBuyDays:3,institutionsAligned:true,sectorReturn20:2,chipConcentration:50,
  quarterRevenue:100000,financialBasis:'TEST_ONLY',revenueQoQ:10,revenueQuarterYoY:30,valuationObserved:true,priceBookRatio:3,priceEarningsRatio:20,announcementsVerified:true};
const candidate = api.scoreCandidate(qualified,{score:90,breadth:60,avgChange:1,amountVs20DayAverage:1});
assert.equal(candidate.ok,true);
assert.equal(candidate.channel,'B');
assert.ok(candidate.rewardRisk >= 2);
const generated = api.allocateAndBuildPlans([candidate],200000,'2026-09-16')[0];
assert.equal(generated.formalClose,101);
assert.equal(generated.mode,'MOMENTUM');
assert.equal(generated.planDate,'2026-09-17');
assert.equal(generated.totalAllocation,70000);
assert.equal(api.scoreCandidate({...qualified,eps:null,revenueYoY:null,grossMargin:null,operatingMargin:null},{score:90}).ok,false);
// 完整盤後流程使用假行情與假財報，驗證真正0檔、寫入讀回、每日通知去重、失敗保留原股池。
const symbols = Array.from({length:1050}, (_, i) => String(1000+i));
const history = qualityApi.recentWeekdays('2026-09-16',65).reverse().map(date => ({date,open:100,close:100,high:101,low:99,volumeShares:5000000,tradeValue:500000000}));
const extra = symbols.map(symbol => ({symbol, market:Number(symbol)<1600?'TWSE':'TPEx',marketCapYi:200,industry:'測試產業',eps:5,revenueYoY:10,grossMargin:30}));
const fullEnv = {STOCKS_KV:new MemoryKV(),TEST_MODE:'true',V7_ENRICHMENT_JSON:JSON.stringify({stocks:extra,history:Object.fromEntries(symbols.map(symbol=>[symbol,history]))})};
const institutionStocks=Object.fromEntries(Array.from({length:1600},(_,i)=>[String(1000+i),{foreignNet:0,trustNet:0,dealerNet:0,institutionTotalNet:0}]));
fullEnv.V7_DB=new MemoryD1();
for(const date of ['2026-09-16','2026-09-15','2026-09-14']) await api.writeInstitutionSnapshot(fullEnv,date,institutionStocks);
const indexHistory=qualityApi.recentWeekdays('2026-09-16',65).reverse().map((date,index)=>({date,close:100+index}));
const monthPoints=new Map();
for(const point of indexHistory){const month=point.date.slice(0,7)+'-01',items=monthPoints.get(month) || [];items.push([`${Number(point.date.slice(0,4))-1911}/${point.date.slice(5).replaceAll('-','/')}`,String(point.close)]);monthPoints.set(month,items);}
const indexFixture={kind:'INDEX',months:[...monthPoints].map(([month,data])=>({sourceUrl:`https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=${month.replaceAll('-','')}`,payload:{date:month.replaceAll('-',''),stat:'OK',fields:['日期','發行量加權股價指數'],data}}))};
assert.ok(qualityApi.validateOfficialQualityData(indexFixture,'2026-09-16').return20>0);
const badIndex=structuredClone(indexFixture);badIndex.months.at(-1).payload.data.pop();assert.throws(()=>qualityApi.validateOfficialQualityData(badIndex,'2026-09-16'));
await qualityApi.writeQualitySnapshot(fullEnv,'INDEX','2026-09-16',{asOfDate:'2026-09-16',count:65,history:indexHistory,return20:1});
await qualityApi.writeQualitySnapshot(fullEnv,'TDCC','2026-09-16',{asOfDate:'2026-09-11',count:1600,stocks:Object.fromEntries(Object.keys(institutionStocks).map(symbol=>[symbol,{chipConcentration:50}]))});
await qualityApi.writeQualitySnapshot(fullEnv,'FINANCIAL','2026-09-16',{asOfDate:'2026-09-16',count:1600,stocks:Object.fromEntries(Object.keys(institutionStocks).map(symbol=>[symbol,{quarterRevenue:100000,financialBasis:'TEST_ONLY',revenueQoQ:0,revenueQuarterYoY:0}]))});
await qualityApi.writeQualitySnapshot(fullEnv,'VALUATION','2026-09-16',{asOfDate:'2026-09-16',count:1600,stocks:Object.fromEntries(Object.keys(institutionStocks).map(symbol=>[symbol,{valuationObserved:true,priceBookRatio:3,priceEarningsRatio:20}]))});
await qualityApi.writeQualitySnapshot(fullEnv,'ANNOUNCEMENTS','2026-09-16',{asOfDate:'2026-09-16',count:0,stocks:{},sourcesVerified:true});
const twseRows = symbols.slice(0,600).map(Code=>({Date:'20260916',Code,Name:'測試',ClosingPrice:100,OpeningPrice:100,HighestPrice:101,LowestPrice:99,TradeVolume:5000000,TradeValue:500000000}));
const tpexRows = symbols.slice(600).map(SecuritiesCompanyCode=>({Date:'1150916',SecuritiesCompanyCode,CompanyName:'測試',Close:100,Open:100,High:101,Low:99,TradingShares:5000000,TransactionAmount:500000000}));
globalThis.fetch = async url => new Response(JSON.stringify(String(url).includes('STOCK_DAY_ALL')?twseRows:String(url).includes('daily_close_quotes')?tpexRows:[]));
const scan = await api.runAfterMarketScan(fullEnv, Date.parse('2026-09-16T10:10:00Z'));
assert.equal(scan.selectedCount, 0);
assert.equal(scan.config.verified, true);
assert.equal(scan.dailyReport.sent, true);
assert.equal(scan.diagnostics.externalValidation.optional,true);
assert.equal(scan.diagnostics.externalValidation.coreRulesUnchanged,true);
assert.equal((await api.runAfterMarketScan(fullEnv, Date.parse('2026-09-16T10:10:00Z'))).dailyReport.deduplicated, true);
const beforeRecovery=await fullEnv.STOCKS_KV.get(api.KV_KEY);
const recoveryAttempts=await Promise.all(Array.from({length:12},()=>api.runAfterMarketScan(fullEnv,Date.parse('2026-09-16T10:20:00Z'),{onlyIfMissing:true})));
assert.ok(recoveryAttempts.every(attempt=>attempt.skipped && attempt.noSelectionOrExternalWrite));
assert.equal(await fullEnv.STOCKS_KV.get(api.KV_KEY),beforeRecovery);
assert.equal((await api.runAfterMarketScan(fullEnv,Date.parse('2026-09-25T10:10:00Z'),{onlyIfMissing:true})).reason,'NOT_TRADING_DAY');
const beforeFailure = await fullEnv.STOCKS_KV.get(api.KV_KEY);
globalThis.fetch = async () => new Response('unavailable',{status:400});
await assert.rejects(api.runAfterMarketScan(fullEnv,Date.parse('2026-09-17T10:10:00Z')));
assert.equal(await fullEnv.STOCKS_KV.get(api.KV_KEY),beforeFailure);
assert.equal((await fullEnv.STOCKS_KV.get('V7_LAST_SCAN_ATTEMPT','json')).status,'FAILED');
globalThis.fetch = originalFetch;
// 第一筆通知的同一根15分K不得立即加碼；未知第一筆時間也不得猜測。
const entryEnv = {STOCKS_KV:new MemoryKV(),TEST_MODE:'true'};
const entry = result(); entry.frame15.latest.time = '2026-09-16T01:15:00Z';
assert.equal((await api.processSignalState(entry,entryEnv,'2026-09-16'))[0].signalType,'BUY');
entry.plan.positionStage='FIRST';
assert.equal((await api.processSignalState(entry,entryEnv,'2026-09-16')).some(x=>x.signalType==='ADD'),false);
entry.frame15.latest.time='2026-09-16T01:30:00Z';
assert.equal((await api.processSignalState(entry,entryEnv,'2026-09-16')).some(x=>x.signalType==='ADD'),false,'A buy notification does not prove a fill');
entry.plan.firstEntryConfirmedAt='2026-09-16T01:31:00Z';
assert.equal((await api.processSignalState(entry,entryEnv,'2026-09-16')).some(x=>x.signalType==='ADD'),false,'Do not add on a bar before the actual fill');
entry.frame15.latest.time='2026-09-16T01:45:00Z';
assert.equal((await api.processSignalState(entry,entryEnv,'2026-09-16')).some(x=>x.signalType==='ADD'),true);
const unknownFirst = result(); unknownFirst.plan.positionStage='FIRST'; unknownFirst.frame15.latest.time='2026-09-16T02:00:00Z';
assert.equal((await api.processSignalState(unknownFirst,{STOCKS_KV:new MemoryKV(),TEST_MODE:'true'},'2026-09-16')).some(x=>x.signalType==='ADD'),false);
const firstStop = result(); firstStop.plan.positionStage='FIRST'; firstStop.stop={level:'risk',text:'15分K停損'};
assert.equal(api.evaluateOperationSignals(firstStop)[0].shares,null,'Planned shares are not actual holdings');
firstStop.plan.actualShares=40;
assert.equal(api.evaluateOperationSignals(firstStop)[0].shares,40);
assert.equal(api.evaluateOperationSignals(firstStop)[0].amount,4800,'Sale estimate uses actual holdings and current price');
const overChase = result(); overChase.plan.maxChase=119;
assert.equal(api.evaluateOperationSignals(overChase).some(x=>x.type==='BUY'),false);
// 僅測試假3Min；TEST_MODE不得觸發任何外部寫入。
const bridgePlan={planDate:'2026-09-17',totalCapital:200000,stocks:[{symbol:'1234',name:'測試',stop:100,firstEntryCondition:'15分K正式確認'}]};
const completePlan=api.normalizeStock(generated,0);
const completePayload=api.buildThreeMinPayload('2026-09-16',200000,[completePlan]);
assert.equal(completePayload.schemaVersion,'V7_PLAN_2');
assert.equal(completePayload.stocks[0].strategyChannel,completePlan.channel);
assert.equal(completePayload.stocks[0].sourcePool,completePlan.formalClose>=1000?'THOUSAND':'NON_THOUSAND');
assert.equal(completePayload.stocks[0].formalClose,completePlan.formalClose);
assert.equal(completePayload.stocks[0].totalAllocation,completePlan.totalAllocation);
assert.equal(completePayload.stocks[0].totalShares,completePlan.firstShares+completePlan.secondShares);
assert.equal(completePayload.remainingCash,200000-completePlan.totalAllocation);
assert.equal(api.buildThreeMinPayload('2026-09-16',200000,[completePlan],false).schemaVersion,undefined,'Keep legacy readback contract');
assert.equal(api.verifyThreeMinReadback(completePayload,{success:true,data:[{payload:structuredClone(completePayload)}]}),true);
assert.equal(api.verifyThreeMinReadback(completePayload,{...completePayload,stocks:[{...completePayload.stocks[0],firstAmount:1}]}),false);
assert.equal(api.verifyThreeMinReadback(completePayload,{...completePayload,remainingCash:0}),false);
assert.equal(api.verifyThreeMinReadback(completePayload,{...completePayload,scanDate:'2026-09-15'}),false);
assert.equal(api.verifyThreeMinReadback(bridgePlan,structuredClone(bridgePlan)),true);
assert.equal(api.verifyThreeMinReadback(bridgePlan,{...bridgePlan,planDate:'2026-09-16'}),false);
assert.equal(api.verifyThreeMinReadback(bridgePlan,{...bridgePlan,stocks:[{...bridgePlan.stocks[0],stop:99}]}),false);
globalThis.fetch = async()=>{throw new Error('TEST_MODE must not fetch');};
assert.equal((await api.sendTo3Min(bridgePlan,{TEST_MODE:'true',THREEMIN_API_URL:'https://test.invalid'})).simulated,true);
assert.equal((await api.sendTo3Min(bridgePlan,{TEST_MODE:'false'})).verified,false);
globalThis.fetch = async(_,options)=>new Response(JSON.stringify(options.method==='POST'?{ok:true}:bridgePlan));
const bridgeEnv={TEST_MODE:'false',THREEMIN_API_URL:'https://test.invalid/write',THREEMIN_VERIFY_URL:'https://test.invalid/read'};
assert.equal((await api.sendTo3Min(bridgePlan,bridgeEnv)).verified,true);
let asyncWrites=0,asyncReads=0;
globalThis.fetch=async(_,options)=>{if(options.method==='POST'){asyncWrites++;return new Response('{"ok":true}',{status:202});}asyncReads++;return new Response(JSON.stringify(asyncReads===1?{success:true,data:[]}:bridgePlan));};
assert.equal((await api.sendTo3Min(bridgePlan,bridgeEnv)).verified,true);
assert.equal(asyncWrites,1);assert.equal(asyncReads,2,'Only readonly polling after async acceptance');
let deniedReads=0;
globalThis.fetch=async(_,options)=>options.method==='POST'?new Response('{"ok":true}'):(deniedReads++,new Response('denied',{status:403}));
assert.equal((await api.sendTo3Min(bridgePlan,bridgeEnv)).verified,false);assert.equal(deniedReads,1,'Stop at explicit authorization rejection');
assert.equal(api.verifyThreeMinReadback(bridgePlan,{success:true,data:[{id:'rec_test',payload:bridgePlan}]}),true);
assert.equal(api.verifyThreeMinReadback(bridgePlan,{success:true,data:[{id:'rec_test',data:bridgePlan}]}),true);
assert.equal(api.verifyThreeMinReadback(bridgePlan,{success:false,data:[{payload:bridgePlan}]}),false);
assert.equal(api.verifyThreeMinReadback(bridgePlan,{data:[{payload:{...bridgePlan,totalCapital:1}}]}),false);
const verifyEnv={...bridgeEnv,ADMIN_TOKEN:'mock',STOCKS_KV:new MemoryKV()};
const externalDate=api.mostRecentWeekday(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()));
const externalRequest=(body,token='mock')=>new Request('https://example.invalid/api/external-validation',{method:'POST',headers:{'x-admin-token':token,'content-type':'application/json'},body:JSON.stringify(body)});
await verifyEnv.STOCKS_KV.put(api.KV_KEY,'original-plan-proof');
const externalPayload={marketDate:externalDate,source:'愛德恩（模擬參考）',symbols:['1234','5678'],notes:'TEST_ONLY',totalCapital:1};
assert.equal((await api.default.fetch(externalRequest(externalPayload,'wrong'),verifyEnv)).status,401);
const externalResponse=await api.default.fetch(externalRequest(externalPayload),verifyEnv);
assert.equal(externalResponse.status,200);assert.equal((await externalResponse.json()).noPlanChanges,true);
assert.equal(await verifyEnv.STOCKS_KV.get(api.KV_KEY),'original-plan-proof');
assert.equal((await api.default.fetch(externalRequest({...externalPayload,symbols:['1234','1234']}),verifyEnv)).status,400);
assert.equal((await api.default.fetch(externalRequest({...externalPayload,marketDate:'2099-01-01'}),verifyEnv)).status,400);
const verifyConfig={updatedAt:'original',stocks:[{symbol:'original'}]};
await verifyEnv.STOCKS_KV.put(api.KV_KEY,JSON.stringify(verifyConfig));
await verifyEnv.STOCKS_KV.put(api.LAST_SCAN_KEY,JSON.stringify({scanDate:'2026-09-16',generatedAt:'original-scan',stocks:[completePlan],totalCapital:completePayload.totalCapital,
  config:{saved:true,verified:true,updatedAt:'original'},threeMin:{sent:true,simulated:false},threeMinPayload:completePayload,
  diagnostics:{requirements30:{complete:false,incompleteRules:[17,18,19,26,27,28,29]}},
  pipeline:{configVerified:true,dailyReportAccepted:true,complete:false}}));
const verifyRequest=(token='mock')=>new Request('https://example.invalid/api/three-min/verify',{method:'POST',headers:{'x-admin-token':token}});
assert.equal((await api.default.fetch(verifyRequest('wrong'),verifyEnv)).status,401);
let reads=0;
globalThis.fetch=async(url,options)=>{assert.equal(url,bridgeEnv.THREEMIN_VERIFY_URL);assert.equal(options.method,'GET');reads++;return new Response(JSON.stringify({success:true,data:[{id:'rec_test',payload:completePayload}]}));};
const verifyResponse=await api.default.fetch(verifyRequest(),verifyEnv);
assert.equal(verifyResponse.status,200);
assert.equal((await verifyResponse.json()).verified,true);
assert.equal(reads,1,'No repeated writes or scans');
assert.deepEqual(await verifyEnv.STOCKS_KV.get(api.KV_KEY,'json'),verifyConfig);
const verifiedScan=await verifyEnv.STOCKS_KV.get(api.LAST_SCAN_KEY,'json');
assert.equal(verifiedScan.pipeline.complete,true);
assert.equal(verifiedScan.diagnostics.requirements30.requirement26.complete,true);
assert.equal(verifiedScan.diagnostics.requirements30.requirement26.schemaVersion,'V7_PLAN_2');
assert.equal(verifiedScan.diagnostics.requirements30.requirement26.externalPostAccepted,true);
assert.equal(verifiedScan.diagnostics.requirements30.requirement26.exactReadbackVerified,true);
assert.equal(verifiedScan.diagnostics.requirements30.incompleteRules.includes(26),false,'Rule 26 is removed only after actual full payload exact readback');
globalThis.fetch=async()=>new Response('',{status:403});
assert.equal((await api.default.fetch(verifyRequest(),verifyEnv)).status,403,'External authorization failure must stop');
const waitingPage=api.waitingLivePage({stocks:[api.normalizeStock(generated,0)],source:'KV',updatedAt:'2026-09-16T13:00:00Z'},null,true);
assert.match(waitingPage,/合格測試/);
assert.match(waitingPage,/不是即時行情或買進訊號/);
assert.match(waitingPage,/第一筆條件/);
globalThis.fetch = async(_,options)=>new Response(JSON.stringify(options.method==='POST'?{ok:true}:bridgePlan));
assert.equal((await api.sendTo3Min(bridgePlan,{...bridgeEnv,THREEMIN_VERIFY_URL:''})).verified,false);
globalThis.fetch = async()=>new Response(JSON.stringify({ok:false}));
assert.equal((await api.sendTo3Min(bridgePlan,bridgeEnv)).sent,false);
globalThis.fetch = originalFetch;
if (process.argv.includes('--live-data')) {
  const rows = await api.fetchMarketRows('https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=2026%2F09%2F16&id=&response=json', 'TPEx', '2026-09-16');
  console.log('LIVE official TPEx date-verified ordinary stocks:', rows.length);
}
// 法人來源必須同日、完整、數值一致；缺少交易日不可接續連買。
const institutionFixture=date=>{
  const fields=['證券代號','外陸資買賣超股數(不含外資自營商)','外資自營商買賣超股數','投信買賣超股數','自營商買賣超股數','三大法人買賣超股數'];
  const tpexFields=Array.from({length:24},(_,i)=>`欄${i}`);tpexFields[0]='代號';tpexFields[23]='三大法人買賣超股數合計';
  return {marketDate:date,...api.institutionSourceUrls(date),twsePayload:{date:date.replaceAll('-',''),stat:'OK',fields,data:Array.from({length:800},(_,i)=>[String(1000+i),1,0,2,3,6])},
    tpexPayload:{date:date.replaceAll('-',''),stat:'ok',tables:[{fields:tpexFields,data:Array.from({length:800},(_,i)=>{const row=Array(24).fill(0);row[0]=String(3000+i);row[10]=1;row[13]=2;row[22]=3;row[23]=6;return row;})}]}};
};
const fixture=institutionFixture('2026-09-16');
const validated=api.validateInstitutionData(fixture,'2026-09-16');
assert.equal(validated.counts.total,1600);
for(const mutate of [body=>body.twsePayload.date='20260915',body=>body.twsePayload.data[0][1]='--',body=>body.tpexPayload.tables[0].data[0][23]=7,body=>body.twsePayload.data.push(body.twsePayload.data[0]),body=>body.tpexPayload.tables[0].fields.pop()]){
  const bad=structuredClone(fixture);mutate(bad);assert.throws(()=>api.validateInstitutionData(bad,'2026-09-16'));
}
const instEnv={STOCKS_KV:new MemoryKV(),V7_DB:new MemoryD1(),ADMIN_TOKEN:'mock'};
await instEnv.STOCKS_KV.put(api.KV_KEY,JSON.stringify(verifyConfig));
for(const date of ['2026-09-16','2026-09-14','2026-09-11']) await api.writeInstitutionSnapshot(instEnv,date,validated.stocks);
let streak=await api.readInstitutionStreakMap(instEnv,'2026-09-16');
assert.equal(streak.ready,false);assert.deepEqual(streak.missingDates,['2026-09-15']);assert.equal(streak.stocks['1000'].foreignBuyDays,1);
await api.writeInstitutionSnapshot(instEnv,'2026-09-15',validated.stocks);
assert.equal((await api.readInstitutionStreakMap(instEnv,'2026-09-16')).stocks['1000'].foreignBuyDays,3);
await api.writeInstitutionSnapshot(instEnv,'2026-09-16',{'1000':validated.stocks['1000']});
assert.equal(instEnv.V7_DB.snapshots.get('2026-09-16').stock_count,1600,'Partial warmup cannot overwrite complete snapshot');
assert.equal((await api.readInstitutionStreakMap(instEnv,'2026-09-17')).ready,false,'Old three snapshots do not prove today coverage');
const ingestDate=api.mostRecentWeekday(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()));
const ingestRequest=token=>new Request('https://example.invalid/api/institution-data',{method:'POST',headers:{'x-admin-token':token,'content-type':'application/json'},body:JSON.stringify(institutionFixture(ingestDate))});
globalThis.fetch=async()=>new Response('[]');
assert.equal((await api.default.fetch(ingestRequest('wrong'),instEnv)).status,401);
const ingested=await api.default.fetch(ingestRequest('mock'),instEnv);
assert.equal(ingested.status,200);assert.equal((await ingested.json()).noPlanChanges,true);
assert.deepEqual(await instEnv.STOCKS_KV.get(api.KV_KEY,'json'),verifyConfig);
globalThis.fetch=originalFetch;
// 累計轉單季，負基期不算假成長率；解析只接受已核對的一般產業財報欄位。
const financialPeriods=[{year:2026,quarter:1,stocks:{'1234':{revenueYTD:100,grossYTD:30,operatingYTD:20,epsYTD:1}}},
  {year:2026,quarter:2,stocks:{'1234':{revenueYTD:250,grossYTD:90,operatingYTD:50,epsYTD:3}}},
  {year:2025,quarter:1,stocks:{'1234':{revenueYTD:80,grossYTD:16,operatingYTD:8,epsYTD:1}}},
  {year:2025,quarter:2,stocks:{'1234':{revenueYTD:180,grossYTD:41,operatingYTD:18,epsYTD:0}}}];
const financial=qualityApi.deriveQuarterlyFinancials(financialPeriods,2026,2)['1234'];
assert.equal(financial.quarterRevenue,150);assert.equal(financial.quarterEPS,null,'Cumulative EPS differences are not valid single-quarter EPS');assert.equal(financial.reportedCumulativeEPS,3);assert.equal(financial.epsComparisonsReady,false);assert.equal(financial.epsQoQ,null);assert.equal(financial.revenueQoQ,50);assert.equal(financial.revenueQuarterYoY,50);assert.equal(financial.epsYoY,null);assert.equal(financial.grossMargin,40);assert.equal(financial.grossMarginYoY,15);
const incomeHtml='累計金額 新台幣仟元 <table><tr>'+['公司 代號','公司名稱','營業收入','營業毛利（毛損）淨額','營業利益（損失）','基本每股盈餘（元）'].map(field=>`<th>${field}</th>`).join('')+'</tr>'+Array.from({length:500},(_,index)=>`<tr><td>${5000+index}</td><td>測試</td><td>1,000</td><td>300</td><td>200</td><td>1.5</td></tr>`).join('')+'</table>';
assert.deepEqual(qualityApi.parseMopsMarketOptions('<select name="TYPEK"><option value="sii">上市</option><option value="otc">上櫃</option></select>'),{TWSE:'sii',TPEx:'otc'});
assert.throws(()=>qualityApi.parseMopsMarketOptions('<select name="TYPEK"><option value="s">全部</option></select>'),/不猜測/);
assert.equal(qualityApi.parseMopsIncomeHtml(incomeHtml,2026,2)['5000'].grossYTD,300);
assert.throws(()=>qualityApi.parseMopsIncomeHtml(incomeHtml.replaceAll('累計金額','單季資料'),2026,2));
const tdccFixture={kind:'TDCC',sourceUrl:'https://opendata.tdcc.com.tw/getOD.ashx?id=1-5',rows:Array.from({length:1500},(_,index)=>Array.from({length:17},(_,offset)=>({'資料日期':'20260911','證券代號':String(6000+index),'持股分級':String(offset+1),'股數':offset===16?'1500':offset===15?'0':'100','占集保庫存數比例%':offset===16?'100':offset===15?'0':'6.67'}))).flat()};
const announcementFixture={kind:'ANNOUNCEMENTS',twseUrl:'https://openapi.twse.com.tw/v1/opendata/t187ap04_L',tpexUrl:'https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap04_O',twsePayload:[{'公司代號':'1234','發言日期':'1150916','主旨 ':'已公告事件'}],tpexPayload:[{SecuritiesCompanyCode:'5678','發言日期':'1150916','主旨':'已公告事件'}]};
assert.equal(qualityApi.validateOfficialQualityData(announcementFixture,'2026-09-16').count,2,'Both official announcement title schemas');
const tdccCsv='資料日期,證券代號,持股分級,人數,股數,占集保庫存數比例%\n20260911,6000,1,1,100,6.67\n';
assert.equal(api.parseOfficialCsv(tdccCsv,['資料日期','證券代號','持股分級','人數','股數','占集保庫存數比例%'])[0]['證券代號'],'6000');
assert.throws(()=>api.parseOfficialCsv(tdccCsv),'Default MOPS contract must remain strict');
assert.equal(qualityApi.validateOfficialQualityData(tdccFixture,'2026-09-16').stocks['6000'].chipConcentration,26.68);
const duplicateTdcc=structuredClone(tdccFixture);duplicateTdcc.rows.push(duplicateTdcc.rows[0]);assert.throws(()=>qualityApi.validateOfficialQualityData(duplicateTdcc,'2026-09-16'));
assert.equal(api.scoreCandidate({...qualified,marketReturn20:null},{score:90,breadth:60,avgChange:1,amountVs20DayAverage:1}).ok,false);
assert.equal(api.scoreCandidate(qualified,{score:90,breadth:20,avgChange:1,amountVs20DayAverage:1}).ok,false);
assert.equal(api.scoreCandidate({...qualified,valuationObserved:false},{score:90,breadth:60,avgChange:1,amountVs20DayAverage:1}).ok,false);
const csv = '\uFEFF出表日期,公司代號,公司名稱,已發行普通股數或TDR原股發行股數\r\n"1150916","1234","測試,名稱""A""","1000000"\r\n';
assert.equal(api.parseOfficialCsv(csv)[0]['公司名稱'],'測試,名稱"A"');
assert.throws(()=>api.parseOfficialCsv('<html>not data</html>'));
assert.throws(()=>api.parseOfficialCsv(csv+'"broken'));
// 整批OpenAPI失敗仍可使用官方CSV；其中文普通股股數必須能計算市值。
const profileCsv='出表日期,公司代號,公司名稱,已發行普通股數或TDR原股發行股數\n'+Array.from({length:500},(_,i)=>`1150916,${3000+i},公司${i},100000000`).join('\n');
globalThis.fetch=async url=>new Response(String(url).endsWith('.csv')?(String(url).endsWith('_L.csv')?profileCsv.replaceAll(/3\d{3}/g,value=>String(Number(value)-2000)):profileCsv):'error',{status:String(url).endsWith('.csv')?200:302});
const mirror=await api.fetchOfficialEnrichment({},'2026-09-16');
assert.equal(mirror.meta.sources.tpexProfile.fallback,'MOPS_OFFICIAL_CSV');
assert.equal(mirror.stocks['3000'].sharesOutstanding,100000000);
assert.equal(mirror.stocks['3000'].market,'TPEx');
globalThis.fetch=originalFetch;
console.log('PASS: signal lifecycle, 15m confirmation, capital, date checks, independent pools and public status assertions. Mock tests do not send real notifications.');
