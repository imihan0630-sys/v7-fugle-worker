import assert from 'node:assert/strict';
import {observeRow,diagnosePopulation,challenge,SAFETY} from '../research/system1_selection_isolated_v0_1.mjs';
const clock='2026-10-01T10:10:00Z';
const evidence={authenticated:true,parentId:'fixture-1',sessionDate:'2026-10-01',knownAt:'2026-10-01T10:00:00Z'};
function fixture(symbol='2006') {
  const row={symbol,sessionDate:'2026-10-01',parentId:'fixture-1',
    feature:{close:100,historyDays:80,marketReturn20:3,sectorReturn20:5,marketCapYi:200,changePercent:1,avgVolume20Lots:1500,avgAmount20:80000000,spreadPercent:0.2,orderBookDepthGood:true,depthScore:90,chipConcentration:60,quarterRevenue:100,financialBasis:true,revenueQoQ:3,revenueQuarterYoY:20,valuationObserved:true,priceBookRatio:2,announcementsVerified:true,officialAnnouncements:[],priceEarningsRatio:18,sectorMedianPe:15,epsYoY:10,atrPercent:3},
    sector:{breadth:55,avgChange:0.5,amountVs20DayAverage:1.1},
    derived:{institutionalScore:75,fundamentalCount:6,fundamentalScore:60,setupState:{A:{pass:true},B:{pass:false}},targetState:'FOUND',target:120,rewardPerRisk:2.5,setupQuality:75},
    formalResult:{ok:true,basePassed:true,rrPassed:true},
    safety:Object.fromEntries(SAFETY.map(id=>[id,{...evidence,status:'PASS'}])),
    thesis:{...evidence,status:'PASS'},structuralStop:{...evidence,price:92},entryGeometry:{...evidence,entry:100,stop:92,target:120}};
  row.gateEvidence=Object.fromEntries(Object.keys(observeRow(row,clock).gates).map(id=>[id,{...evidence}]));
  return row;
}
let assertions=0;
function equal(a,b){assert.equal(a,b);assertions++;}
const options={watchUntil:'2026-10-03T10:10:00Z',revalidatedAt:clock};
equal(challenge(fixture(),clock,options).status,'ENTRY_READY');
for(const change of [null,{...evidence,entry:100,stop:101,target:120},{...evidence,entry:110,stop:92,target:120},{...evidence,entry:100,stop:92,target:130}]) {
  const r=fixture();r.entryGeometry=change;equal(challenge(r,clock,options).status,'WATCH_EARLY');
}
for(const value of [null,undefined,'',false,'100',NaN,Infinity]) {
  const r=fixture();r.feature.close=value;equal(observeRow(r,clock).gates.PRICE_FLOOR.status,'UNKNOWN');
  r.feature.marketCapYi=value;equal(observeRow(r,clock).gates.MARKET_CAP_FLOOR.status,'UNKNOWN');
}
const fail=fixture('2330');fail.feature.marketCapYi=5;fail.sector.breadth=10;fail.derived.setupQuality=20;
const observation=observeRow(fail,clock);
equal(observation.gates.MARKET_CAP_FLOOR.status,'FAIL');equal(observation.gates.SECTOR_GATE.status,'FAIL');equal(observation.gates.FINAL_SIGNAL_GRADE.status,'FAIL');
for(const change of [{knownAt:'2026-10-02T00:00:00Z'},{parentId:'wrong'},{sessionDate:'2026-09-30'},{authenticated:false},{knownAt:'2026-10-01 10:00'}]) {
  const r=fixture();r.gateEvidence.PRICE_FLOOR={...evidence,...change};equal(observeRow(r,clock).gates.PRICE_FLOOR.status,'UNKNOWN');
}
const unknown=fixture();delete unknown.feature.chipConcentration;delete unknown.feature.quarterRevenue;
equal(challenge(unknown,clock,options).status,'ENTRY_READY');
equal(challenge(unknown,clock,{...options,strategy:'SWING'}).status,'DATA_BLOCKED');
for(const id of SAFETY) {
  const r=fixture();delete r.safety[id];equal(challenge(r,clock,options).status,'DATA_BLOCKED');
  r.safety[id]={...evidence,status:'FAIL'};equal(challenge(r,clock,options).status,'REJECTED');
}
const watch=fixture();watch.derived.setupState={A:{pass:false},B:{pass:false}};
watch.derived.targetState='UNKNOWN';watch.derived.target=null;watch.derived.rewardPerRisk=null;watch.derived.setupQuality=null;
equal(challenge(watch,clock,options).status,'WATCH_EARLY');
equal(challenge(watch,clock,{...options,watchUntil:clock}).status,'EXPIRED');
equal(challenge(watch,clock,{...options,revalidatedAt:'2026-09-28T10:10:00Z'}).status,'EXPIRED');
equal(challenge(watch,clock,{...options,watchUntil:'2026-10-20T10:10:00Z'}).status,'EXPIRED');
const risky=fixture();risky.feature.officialAnnouncements=[{title:'重大損失'}];equal(challenge(risky,clock,options).status,'REJECTED');
const low=fixture('3000');low.feature.avgVolume20Lots=100;low.feature.spreadPercent=1;
low.formalResult={ok:false,reason:'20日流動性不足',basePassed:false};
const rows=[fixture(),fail,low], before=JSON.stringify(rows);
const args={sessionDate:'2026-10-01',decisionAt:clock,universe:['2006','2330','3000','9999'],rows,samplePerStratum:1};
const pop=diagnosePopulation(args);equal(pop.populationN,4);equal(pop.capturedN,3);equal(pop.coverageComplete,false);
equal(pop.observations.find(x=>x.symbol==='9999').gates.HISTORY_60D.status,'UNKNOWN');
equal(pop.counts['GENERAL:LIQUIDITY'].FAIL,1);
equal(pop.samples.find(s=>s.stratum===JSON.stringify(['GENERAL','FAIL:LIQUIDITY'])).symbols[0],'3000');
equal(JSON.stringify(pop.samples),JSON.stringify(diagnosePopulation({...args,rows:[...rows].reverse(),universe:[...args.universe].reverse()}).samples));
equal(JSON.stringify(rows),before);
assert.throws(()=>diagnosePopulation({...args,rows:[...rows,rows[0]]}),/DUPLICATE/);assertions++;
assert.throws(()=>diagnosePopulation({...args,universe:['2006','2006']}),/INVALID_UNIVERSE/);assertions++;
assert.throws(()=>challenge(fixture(),clock,{strategy:'UNREGISTERED'}),/UNREGISTERED/);assertions++;
for(const row of rows) {
  const out=challenge(row,clock,options);equal(out.formalSelected,false);equal(out.buyAuthorized,false);equal(out.allocation,0);equal(out.signal,null);
}
console.log(JSON.stringify({ok:true,assertions,fixtureOnly:true,marketCalls:0,formalCoreImpact:false}));
