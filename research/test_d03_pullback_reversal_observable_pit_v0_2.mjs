import assert from "node:assert/strict";

function episode({parent,bars,expectedStarts,knownAt}) {
  if (!parent || parent.channel !== "A" || parent.setupPass !== true) return {state:"NO_PARENT"};
  const have=new Set(bars.map(x=>x.start));
  for (const slot of expectedStarts) {
    if (!have.has(slot)) return {state:"DATA_BLOCKED",reason:"MISSING_EXPECTED_15M_SLOT",slot,originState:"UNKNOWN_ORIGIN"};
  }
  let seed=null;
  const history=[];
  for (const bar of bars) {
    if (bar.close < parent.buyLow) {
      history.push({state:"FAILED_ZONE_BREAK",at:bar.end});
      return {state:"FAILED_ZONE_BREAK",history,originState:"UNKNOWN_ORIGIN"};
    }
    if (bar.bearish===true && Number.isFinite(bar.volumeRatio) && bar.volumeRatio>=1.3) {
      history.push({state:"FAILED_DOWN_VOLUME",at:bar.end});
      return {state:"FAILED_DOWN_VOLUME",history,originState:"UNKNOWN_ORIGIN"};
    }
    if (seed) {
      const higherLow=bar.low>=seed.low;
      const turnUp=bar.bullish===true && (bar.close>seed.close || bar.high>seed.high);
      if (higherLow && turnUp) {
        const ms=Math.max(Date.parse(bar.end),Date.parse(knownAt[bar.start]),Date.parse(knownAt[seed.start]),Date.parse(parent.parentKnownAt));
        return {
          state:"REVERSAL_CONFIRMED",
          pullbackLowAt:seed.start,
          reversalConfirmedAt:new Date(ms).toISOString(),
          history,
          originState:"UNKNOWN_ORIGIN"
        };
      }
    }
    const entered=bar.low<=parent.buyHigh && bar.high>=parent.buyLow;
    const held=bar.close>=parent.buyLow;
    if (entered && held) {
      history.push({state:"ZONE_ENTERED_HELD",at:bar.end});
      const volumeOK=Number.isFinite(bar.volumeRatio)&&bar.volumeRatio<=0.9;
      if (volumeOK && (bar.reversalK===true || bar.strongClose===true)) {
        seed=bar;
        history.push({state:"REVERSAL_SEED_VISIBLE",at:bar.end});
      }
    }
  }
  return {state:seed?"REVERSAL_SEED_VISIBLE":"NO_CONFIRMATION_YET",history,originState:"UNKNOWN_ORIGIN"};
}

const parent={
  channel:"A",setupPass:true,buyLow:95,buyHigh:98,
  parentKnownAt:"2026-09-23T15:00:00+08:00"
};
const bars=[
  {start:"2026-09-24T10:00:00+08:00",end:"2026-09-24T10:15:00+08:00",open:97,high:98,low:95.5,close:96.5,volumeRatio:1.0,reversalK:false,strongClose:false,bullish:false,bearish:true},
  {start:"2026-09-24T10:15:00+08:00",end:"2026-09-24T10:30:00+08:00",open:96,high:97.5,low:95.5,close:97.2,volumeRatio:0.8,reversalK:true,strongClose:false,bullish:true,bearish:false},
  {start:"2026-09-24T10:30:00+08:00",end:"2026-09-24T10:45:00+08:00",open:97.2,high:99,low:96,close:98.8,volumeRatio:0.9,reversalK:false,strongClose:true,bullish:true,bearish:false}
];
const knownAt={
  "2026-09-24T10:00:00+08:00":"2026-09-24T10:16:00+08:00",
  "2026-09-24T10:15:00+08:00":"2026-09-24T10:31:00+08:00",
  "2026-09-24T10:30:00+08:00":"2026-09-24T10:46:00+08:00"
};
const expected=bars.map(x=>x.start);

const confirmed=episode({parent,bars,expectedStarts:expected,knownAt});
assert.equal(confirmed.state,"REVERSAL_CONFIRMED");
assert.equal(confirmed.pullbackLowAt,"2026-09-24T10:15:00+08:00");
assert.equal(confirmed.reversalConfirmedAt,"2026-09-24T02:46:00.000Z");
assert.equal(confirmed.originState,"UNKNOWN_ORIGIN");

const missing=episode({parent,bars:bars.filter((_,i)=>i!==1),expectedStarts:expected,knownAt});
assert.equal(missing.state,"DATA_BLOCKED");
assert.equal(missing.reason,"MISSING_EXPECTED_15M_SLOT");

const failedBars=bars.map(x=>({...x}));
failedBars[2]={...failedBars[2],close:94,bullish:false,bearish:true};
const failed=episode({parent,bars:failedBars,expectedStarts:expected,knownAt});
assert.equal(failed.state,"FAILED_ZONE_BREAK");

const seedOnly=episode({parent,bars:bars.slice(0,2),expectedStarts:expected.slice(0,2),knownAt});
assert.equal(seedOnly.state,"REVERSAL_SEED_VISIBLE");

console.log(JSON.stringify({status:"PASS",confirmed,missing,failed,seedOnly},null,2));
