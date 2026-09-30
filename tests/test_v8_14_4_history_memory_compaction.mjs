import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const api=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {buildMarketFeatures,nearestRealResistance,updateMarketState};').toString('base64'));

function bar(i,highOverride=null){
  const close=100+i*0.2;
  return {
    date:new Date(Date.UTC(2026,5,1+i)).toISOString().slice(0,10),
    open:close-0.3,high:highOverride??close+1,low:close-1,close,
    volumeShares:1_000_000+i*1000,tradeValue:(1_000_000+i*1000)*close,
    foreignNet:i%3===0?100:0,trustNet:i%4===0?50:0,dealerNet:i%5===0?10:0
  };
}
const history=Array.from({length:61},(_,i)=>bar(i));
history[20].high=130;
history[21].high=115;history[19].high=114;history[18].high=113;history[22].high=112;
history[40].high=145;
history[39].high=130;history[38].high=129;history[41].high=131;history[42].high=128;

const stock={symbol:'1234',name:'測試',history,marketCapYi:100,foreignNet:1,trustNet:1,dealerNet:1};
const legacy={...stock};
const compact=api.buildMarketFeatures(stock);
assert.equal('history' in compact,false,'feature row must not retain full history');
assert.ok(Array.isArray(compact.resistancePivotHighs));
assert.ok(compact.resistancePivotHighs.includes(130));
assert.ok(compact.resistancePivotHighs.includes(145));

const legacyResistance=api.nearestRealResistance({...legacy,priorHigh20:compact.priorHigh20,priorHigh60:compact.priorHigh60},110);
const compactResistance=api.nearestRealResistance(compact,110);
assert.equal(compactResistance,legacyResistance,'precomputed pivot resistance must be selection-equivalent');

const seed=history.slice(0,60).map(x=>({...x}));
const enrichment={history:{'1234':seed}};
const rows=[{symbol:'1234',name:'測試',market:'TWSE',open:112,high:114,low:111,close:113,volumeShares:2_000_000,tradeValue:226_000_000}];
const admission={bySymbol:{'1234':{usable:true,status:'VALID_EXACT_SESSIONS'}},summary:{usableSymbols:1}};
const state=api.updateMarketState({stocks:{}},rows,enrichment,'2026-08-01',admission);
assert.equal(state.stocks['1234'].history,seed,'marketState should reuse ephemeral seed array instead of allocating a second history array');
assert.equal(state.stocks['1234'].history.at(-1).date,'2026-08-01');
assert.ok(state.stocks['1234'].history.length<=65);

assert.match(source,/historyCacheLoadedCount/);
assert.match(source,/compactStateForStorage/);
assert.match(source,/stock\.history=\[\]/);

console.log(JSON.stringify({
  ok:true,
  historyRemovedFromFeature:true,
  resistanceParity:true,
  seedArrayReused:true,
  formalRulesChanged:false,
  system2Touched:false
}));
