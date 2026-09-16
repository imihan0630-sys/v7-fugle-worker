import assert from 'node:assert/strict';
const origin='https://fugle-test.imihan0630.workers.dev';
assert.ok(process.env.V7_ADMIN_TOKEN,'V7_ADMIN_TOKEN is required; no authentication bypass');
const headers={'x-admin-token':process.env.V7_ADMIN_TOKEN};
// 真實補跑只有一個POST；逾時不自動重送，先查狀態避免重複匯入或洗推播。
let response;
try {response=await fetch(origin+'/api/scan',{method:'POST',headers,signal:AbortSignal.timeout(180000)});}
catch {throw new Error('補跑請求逾時或斷線；先查狀態，不自動重送');}
if ([401,403].includes(response.status)) throw new Error('管理員授權失敗：停止，不換用其他憑證');
const result=await response.json();
if (!response.ok) throw new Error(`盤後補跑失敗HTTP ${response.status}：${String(result.error || 'unknown').slice(0,1500)}`);
assert.equal(result.dryRun,false,'Simulation is not live acceptance');
assert.equal(result.config?.saved,true);
assert.ok(result.selectedCount<=6);
const high=(result.stocks || []).filter(stock=>stock.formalClose>=1000);
const low=(result.stocks || []).filter(stock=>stock.formalClose<1000);
assert.ok(high.length<=3 && low.length<=3 && high.length+low.length===result.selectedCount,'Independent3+3 pools must match official close');
const readback=await fetch(origin+'/api/scan/status',{headers,signal:AbortSignal.timeout(20000)});
assert.equal(readback.ok,true);
const actual=await readback.json();
assert.equal(actual.scanDate,result.scanDate);
assert.equal(actual.generatedAt,result.generatedAt);
assert.deepEqual(actual.stocks,result.stocks);
console.log(JSON.stringify({liveScanCompleted:true,version:result.version,scanDate:result.scanDate,selectedCount:result.selectedCount,
  market:result.market,config:result.config,threeMin:result.threeMin,dailyReport:result.dailyReport,pipeline:result.pipeline,
  sources:result.diagnostics?.officialSources,exclusions:result.diagnostics?.exclusions,
  stocks:(result.stocks || []).map(x=>({symbol:x.symbol,name:x.name,formalClose:x.formalClose,mode:x.mode}))}));
if (result.pipeline?.complete!==true) console.log('PARTIAL_ACCEPTANCE：已核對本次選股，但3Min讀回或真實推播未全部通過；不宣稱30條全部完成。');
