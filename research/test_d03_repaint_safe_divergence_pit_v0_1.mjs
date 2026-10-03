import assert from 'node:assert/strict';

const pivots=[
 {id:'L1',type:'LOW',scale:'BASE',pivotIndex:10,pivotAt:'D10',confirmedIndex:12,confirmedAt:'D12',price:100,indicator:30},
 {id:'L2',type:'LOW',scale:'BASE',pivotIndex:20,pivotAt:'D20',confirmedIndex:23,confirmedAt:'D23',price:95,indicator:36},
 {id:'L3',type:'LOW',scale:'BASE',pivotIndex:30,pivotAt:'D30',confirmedIndex:33,confirmedAt:'D33',price:92,indicator:34},
];
function visible(asOfIndex){return pivots.filter(p=>p.confirmedIndex<=asOfIndex)}
function latestPair(asOfIndex){
 const lows=visible(asOfIndex).filter(p=>p.type==='LOW'&&p.scale==='BASE');
 return lows.length>=2?lows.slice(-2):null;
}
function desc(pair){
 if(!pair)return null;
 const [a,b]=pair;
 return {
  pair:a.id+'-'+b.id,
  bullish:b.price<a.price&&b.indicator>a.indicator,
  priceProgressionPct:(b.price/a.price-1)*100,
  indicatorProgression:b.indicator-a.indicator,
  firstObservableAt:b.confirmedAt,
  pivotAnchorAt:b.pivotAt,
 };
}

assert.equal(latestPair(22),null);
const at23=desc(latestPair(23));
assert.equal(at23.pair,'L1-L2');
assert.equal(at23.bullish,true);
assert.ok(Math.abs(at23.priceProgressionPct+5)<1e-12);
assert.equal(at23.indicatorProgression,6);
assert.equal(at23.firstObservableAt,'D23');
assert.equal(at23.pivotAnchorAt,'D20');

const lag=pivots[1].confirmedIndex-pivots[1].pivotIndex;
const move=(99/95-1)*100;
assert.equal(lag,3);
assert.ok(Math.abs(move-4.210526315789465)<1e-12);

const at33=desc(latestPair(33));
assert.equal(at33.pair,'L2-L3');
assert.equal(at33.bullish,false);
const historical=desc([pivots[0],pivots[1]]);
assert.equal(historical.pair,'L1-L2');
assert.equal(historical.firstObservableAt,'D23');
assert.equal(historical.bullish,true);

console.log(JSON.stringify({
 status:'PASS',
 beforeSecondConfirm:{asOf:'D22',visible:visible(22).map(x=>x.id),divergence:null},
 atSecondConfirm:at23,
 laterCurrentPair:at33,
 immutableHistoricalEpisode:historical,
 confirmationLag:{bars:lag,priceMovePivotToConfirmationPct:move}
},null,2));
