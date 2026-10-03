
import assert from 'node:assert/strict';
import {
  normalizeFuglePressureSnapshot,
  buildProviderTradePressureProxy,
  joinPressureWithPriceResponse
} from '../research/d02_provider_trade_pressure_proxy_v0_1.mjs';

const q=(over={})=>({
  date:'2026-10-02',type:'EQUITY',exchange:'TWSE',symbol:'2330',
  total:{tradeVolume:1000,tradeVolumeAtBid:300,tradeVolumeAtAsk:500,transaction:100,time:1790904000000000},
  ...over
});
const q2=(over={})=>({
  date:'2026-10-02',type:'EQUITY',exchange:'TWSE',symbol:'2330',
  total:{tradeVolume:1200,tradeVolumeAtBid:350,tradeVolumeAtAsk:620,transaction:120,time:1790904060000000},
  ...over
});
const n1=normalizeFuglePressureSnapshot(q(),'2026-10-02T09:20:01+08:00');
const n2=normalizeFuglePressureSnapshot(q2(),'2026-10-02T09:21:01+08:00');

assert.equal(n1.status,'NORMALIZED');

let r=buildProviderTradePressureProxy(n1,n2);
assert.equal(r.proxyEligible,true);
assert.equal(r.deltaTradeVolume,200);
assert.equal(r.deltaAtBid,50);
assert.equal(r.deltaAtAsk,120);
assert.equal(r.unclassifiedVolume,30);
assert.equal(r.classificationCoverage,170/200);
assert.equal(r.trueOfiEligible,false);
assert.equal(r.participantIntentEligible,false);

assert.equal(r.pressureSign,'ASK_SIDE_DOMINANT_PROXY');
assert.equal(r.providerTradePressureProxy,(120-50)/(120+50));

let j=joinPressureWithPriceResponse(r,{priceStart:100,priceEnd:99.9});
assert.equal(j.observableState,'ASK_PRESSURE_WITH_WEAK_OR_NEGATIVE_PROGRESS');
assert.equal(j.dynamicAbsorptionEligible,false);
assert.equal(j.participantIntentEligible,false);

const other=normalizeFuglePressureSnapshot({...q2(),symbol:'2317'},'2026-10-02T09:21:01+08:00');
r=buildProviderTradePressureProxy(n1,other);
assert.equal(r.proxyEligible,false);
assert.ok(r.unknownReasons.includes('IDENTITY_MISMATCH_SYMBOL'));

const odd=normalizeFuglePressureSnapshot({...q2(),type:'ODDLOT'},'2026-10-02T09:21:01+08:00');
r=buildProviderTradePressureProxy(n1,odd);
assert.equal(r.proxyEligible,false);
assert.ok(r.unknownReasons.includes('IDENTITY_MISMATCH_TYPE'));

const reg=normalizeFuglePressureSnapshot({...q2(),total:{...q2().total,tradeVolumeAtAsk:490}},'2026-10-02T09:21:01+08:00');
r=buildProviderTradePressureProxy(n1,reg);
assert.ok(r.unknownReasons.includes('AT_ASK_COUNTER_REGRESSION'));

const over=normalizeFuglePressureSnapshot({...q2(),total:{...q2().total,tradeVolume:1100,tradeVolumeAtBid:390,tradeVolumeAtAsk:650}},'2026-10-02T09:21:01+08:00');
r=buildProviderTradePressureProxy(n1,over);
assert.ok(r.unknownReasons.includes('CLASSIFIED_VOLUME_EXCEEDS_TOTAL'));

const same=normalizeFuglePressureSnapshot({...q(),total:{...q().total,time:1790904060000000}},'2026-10-02T09:21:01+08:00');
r=buildProviderTradePressureProxy(n1,same);
assert.ok(r.unknownReasons.includes('NO_NEW_TRADE_VOLUME'));

const unc=normalizeFuglePressureSnapshot({...q2(),total:{...q2().total,tradeVolume:1200,tradeVolumeAtBid:300,tradeVolumeAtAsk:500}},'2026-10-02T09:21:01+08:00');
r=buildProviderTradePressureProxy(n1,unc);
assert.ok(r.unknownReasons.includes('NO_CLASSIFIED_VOLUME'));

r=buildProviderTradePressureProxy(n1,n2,{minCoverage:0.9});
assert.ok(r.unknownReasons.includes('CLASSIFICATION_COVERAGE_BELOW_PREREGISTERED_FLOOR'));

const earlyFetch=normalizeFuglePressureSnapshot(q2(),'2026-10-02T09:19:01+08:00');
r=buildProviderTradePressureProxy(n1,earlyFetch);
assert.ok(r.unknownReasons.includes('FETCH_CLOCK_NOT_INCREASING'));

const trial=normalizeFuglePressureSnapshot({...q2(),isTrial:true},'2026-10-02T09:21:01+08:00');
assert.equal(trial.proxyEligible,false);
assert.ok(trial.unknownReasons.includes('TRIAL_STATE'));

const badDate=normalizeFuglePressureSnapshot({...q2(),date:'2026-10-03'},'2026-10-03T09:21:01+08:00');
assert.equal(badDate.proxyEligible,false);
assert.ok(badDate.unknownReasons.includes('PROVIDER_TIME_DATE_MISMATCH'));

console.log(JSON.stringify({
  status:'PASS',
  tests:14,
  contract:'D02_PROVIDER_TRADE_PRESSURE_PROXY_V0_1'
}));
