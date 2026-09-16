import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(process.env.V7_TEST_WORKER_PATH || new URL('./Worker_V7_7.5.11_REQUIREMENTS_REPAIR.mjs', import.meta.url), 'utf8');
const api = await import('data:text/javascript;base64,' + Buffer.from(source + '\nexport { evaluateOperationSignals, evaluateStop, processSignalState, recalculatePlanCapital, saveStockConfig, KV_KEY, fetchMarketRows, fetchClosingRowsWithFallback, normalizeMarketDate, normalizeStock, enforceIndependentPoolQuota, buildPublicRecommendations, buildDailySelectionPayload, formatSlackSignalMessage, scoreCandidate, nextTradingDate, mostRecentWeekday, runAfterMarketScan, MARKET_STATE_KEY, allocateAndBuildPlans, sendTo3Min, verifyThreeMinReadback, parseOfficialCsv, fetchOfficialEnrichment };').toString('base64'));
class MemoryKV {
  values = new Map();
  async get(key, type) { const raw = this.values.get(key); return raw === undefined ? null : type === 'json' ? JSON.parse(raw) : raw; }
  async put(key, value) { this.values.set(key, value); }
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
const env = { STOCKS_KV: new MemoryKV(), TEST_MODE: 'true' };
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
const failedEnv = { STOCKS_KV: new MemoryKV(), TEST_MODE: 'false' };
assert.equal((await api.processSignalState(result(), failedEnv, '2026-09-16'))[0].sent, false);
failedEnv.TEST_MODE = 'true';
assert.equal((await api.processSignalState(result(), failedEnv, '2026-09-16'))[0].sent, true);
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
globalThis.fetch = originalFetch;
const qualified = {symbol:'1234',name:'合格測試',close:101,historyDays:65,marketCapYi:200,changePercent:1,
  avgVolume20Lots:5000,atrPercent:2,ma5:99,ma10:98,ma20:97,ma60:95,prevMa20:96,bullishStack:true,
  priorHigh20:100,priorHigh60:120,priorLow20:90,todayLow:100,recentHigh10:100,volumeTodayVsPrev5:2,
  dailyClosePosition:.9,dailyUpperShadowRatio:.05,ret20:10,marketReturn20:1,
  eps:5,revenueYoY:50,grossMargin:50,operatingMargin:25,trustBuyDays:3,foreignBuyDays:3,institutionsAligned:true};
const candidate = api.scoreCandidate(qualified,{score:90});
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
const history = Array.from({length:65}, (_, i) => ({date:new Date(Date.UTC(2026,5,1+i)).toISOString().slice(0,10),open:100,close:100,high:101,low:99,volumeShares:5000000,tradeValue:500000000}));
const extra = symbols.map(symbol => ({symbol, market:Number(symbol)<1600?'TWSE':'TPEx',marketCapYi:200,industry:'測試產業',eps:5,revenueYoY:10,grossMargin:30}));
const fullEnv = {STOCKS_KV:new MemoryKV(),TEST_MODE:'true',V7_ENRICHMENT_JSON:JSON.stringify({stocks:extra,history:Object.fromEntries(symbols.map(symbol=>[symbol,history]))})};
const twseRows = symbols.slice(0,600).map(Code=>({Date:'20260916',Code,Name:'測試',ClosingPrice:100,OpeningPrice:100,HighestPrice:101,LowestPrice:99,TradeVolume:5000000,TradeValue:500000000}));
const tpexRows = symbols.slice(600).map(SecuritiesCompanyCode=>({Date:'1150916',SecuritiesCompanyCode,CompanyName:'測試',Close:100,Open:100,High:101,Low:99,TradingShares:5000000,TransactionAmount:500000000}));
globalThis.fetch = async url => new Response(JSON.stringify(String(url).includes('STOCK_DAY_ALL')?twseRows:String(url).includes('daily_close_quotes')?tpexRows:[]));
const scan = await api.runAfterMarketScan(fullEnv, Date.parse('2026-09-16T10:10:00Z'));
assert.equal(scan.selectedCount, 0);
assert.equal(scan.config.verified, true);
assert.equal(scan.dailyReport.sent, true);
assert.equal((await api.runAfterMarketScan(fullEnv, Date.parse('2026-09-16T10:10:00Z'))).dailyReport.deduplicated, true);
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
assert.equal((await api.processSignalState(entry,entryEnv,'2026-09-16')).some(x=>x.signalType==='ADD'),true);
const unknownFirst = result(); unknownFirst.plan.positionStage='FIRST'; unknownFirst.frame15.latest.time='2026-09-16T02:00:00Z';
assert.equal((await api.processSignalState(unknownFirst,{STOCKS_KV:new MemoryKV(),TEST_MODE:'true'},'2026-09-16')).some(x=>x.signalType==='ADD'),false);
const firstStop = result(); firstStop.plan.positionStage='FIRST'; firstStop.stop={level:'risk',text:'15分K停損'};
assert.equal(api.evaluateOperationSignals(firstStop)[0].shares,50);
firstStop.plan.actualShares=40;
assert.equal(api.evaluateOperationSignals(firstStop)[0].shares,40);
const overChase = result(); overChase.plan.maxChase=119;
assert.equal(api.evaluateOperationSignals(overChase).some(x=>x.type==='BUY'),false);
// 僅測試假3Min；TEST_MODE不得觸發任何外部寫入。
const bridgePlan={planDate:'2026-09-17',totalCapital:200000,stocks:[{symbol:'1234',name:'測試',stop:100,firstEntryCondition:'15分K正式確認'}]};
assert.equal(api.verifyThreeMinReadback(bridgePlan,structuredClone(bridgePlan)),true);
assert.equal(api.verifyThreeMinReadback(bridgePlan,{...bridgePlan,planDate:'2026-09-16'}),false);
assert.equal(api.verifyThreeMinReadback(bridgePlan,{...bridgePlan,stocks:[{...bridgePlan.stocks[0],stop:99}]}),false);
globalThis.fetch = async()=>{throw new Error('TEST_MODE must not fetch');};
assert.equal((await api.sendTo3Min(bridgePlan,{TEST_MODE:'true',THREEMIN_API_URL:'https://test.invalid'})).simulated,true);
assert.equal((await api.sendTo3Min(bridgePlan,{TEST_MODE:'false'})).verified,false);
globalThis.fetch = async(_,options)=>new Response(JSON.stringify(options.method==='POST'?{ok:true}:bridgePlan));
const bridgeEnv={TEST_MODE:'false',THREEMIN_API_URL:'https://test.invalid/write',THREEMIN_VERIFY_URL:'https://test.invalid/read'};
assert.equal((await api.sendTo3Min(bridgePlan,bridgeEnv)).verified,true);
assert.equal((await api.sendTo3Min(bridgePlan,{...bridgeEnv,THREEMIN_VERIFY_URL:''})).verified,false);
globalThis.fetch = async()=>new Response(JSON.stringify({ok:false}));
assert.equal((await api.sendTo3Min(bridgePlan,bridgeEnv)).sent,false);
globalThis.fetch = originalFetch;
if (process.argv.includes('--live-data')) {
  const rows = await api.fetchMarketRows('https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=2026%2F09%2F16&id=&response=json', 'TPEx', '2026-09-16');
  console.log('LIVE official TPEx date-verified ordinary stocks:', rows.length);
}
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
