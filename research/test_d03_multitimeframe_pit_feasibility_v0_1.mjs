import assert from 'node:assert/strict';

function ms(s){return Date.parse(s)}
function m15State(start, asOf, fetchedAt=null){
  const end=ms(start)+15*60*1000;
  const completed=ms(asOf)>=end;
  const known=completed && fetchedAt!=null && ms(asOf)>=ms(fetchedAt) && ms(fetchedAt)>=end;
  return {completed,known,end:new Date(end).toISOString()};
}
function aggregate(rows){
  return {
    open:rows[0].open,
    high:Math.max(...rows.map(x=>x.high)),
    low:Math.min(...rows.map(x=>x.low)),
    close:rows.at(-1).close
  };
}
function weeklyCompletion({asOfDate,expectedSessions,observedEligibleBars}){
  const remaining=expectedSessions.filter(x=>x>asOfDate);
  if(remaining.length) return 'PARTIAL_ASOF_HIGHER_TIMEFRAME_BAR';
  const observed=new Set(observedEligibleBars);
  const missing=expectedSessions.filter(x=>x<=asOfDate&&!observed.has(x));
  return missing.length?'DATA_BLOCKED_SESSION_RECONCILIATION':'COMPLETED_HIGHER_TIMEFRAME_BAR';
}
function dailyFinality(state,officialCloseConfirmed){
  if(state==='LIVE') return 'PROVISIONAL_DAILY_BAR';
  if(state==='FINAL'&&officialCloseConfirmed) return 'CONFIRMED_DAILY_CLOSE';
  return 'UNKNOWN_OR_BLOCKED';
}
function alignment(a,b,c){
  const vals=[a,b,c];
  if(vals.some(x=>!['BULL','BEAR','NEUTRAL'].includes(x))) return {state:'UNKNOWN',independentVoteCount:null};
  const directional=vals.filter(x=>x!=='NEUTRAL');
  if(!directional.length) return {state:'MIXED',independentVoteCount:null};
  if(directional.every(x=>x===directional[0])&&directional.length===3) return {state:'ALIGNED',independentVoteCount:null};
  if(new Set(directional).size>1) return {state:'CONFLICT',independentVoteCount:null};
  return {state:'MIXED',independentVoteCount:null};
}

const start='2026-10-02T09:00:00+08:00';
let s=m15State(start,'2026-10-02T09:14:59+08:00','2026-10-02T09:16:00+08:00');
assert.equal(s.completed,false); assert.equal(s.known,false);
s=m15State(start,'2026-10-02T09:15:30+08:00','2026-10-02T09:16:00+08:00');
assert.equal(s.completed,true); assert.equal(s.known,false);
s=m15State(start,'2026-10-02T09:16:00+08:00','2026-10-02T09:16:00+08:00');
assert.equal(s.completed,true); assert.equal(s.known,true);

const slots=[
 '09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00',
 '11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00'
];
assert.equal(slots.length,17);
assert.equal(slots.at(-1),'13:00');
assert.equal(17/18,0.9444444444444444);

const mon={open:100,high:103,low:99,close:102};
const tue={open:102,high:104,low:100,close:103};
const wed={open:103,high:104,low:98,close:99};
const thu={open:99,high:101,low:97,close:98};
const fri={open:98,high:106,low:98,close:105};
const partial=aggregate([mon,tue,wed]);
const full=aggregate([mon,tue,wed,thu,fri]);
assert.deepEqual(partial,{open:100,high:104,low:98,close:99});
assert.deepEqual(full,{open:100,high:106,low:97,close:105});
assert.ok(partial.close<partial.open);
assert.ok(full.close>full.open);

assert.equal(weeklyCompletion({
  asOfDate:'2026-10-07',
  expectedSessions:['2026-10-05','2026-10-06','2026-10-07','2026-10-08','2026-10-09'],
  observedEligibleBars:['2026-10-05','2026-10-06','2026-10-07']
}),'PARTIAL_ASOF_HIGHER_TIMEFRAME_BAR');

assert.equal(weeklyCompletion({
  asOfDate:'2026-10-08',
  expectedSessions:['2026-10-05','2026-10-06','2026-10-07','2026-10-08'],
  observedEligibleBars:['2026-10-05','2026-10-06','2026-10-07','2026-10-08']
}),'COMPLETED_HIGHER_TIMEFRAME_BAR');

assert.equal(dailyFinality('LIVE',false),'PROVISIONAL_DAILY_BAR');
assert.equal(dailyFinality('FINAL',true),'CONFIRMED_DAILY_CLOSE');
assert.equal(dailyFinality('FINAL',false),'UNKNOWN_OR_BLOCKED');

assert.deepEqual(alignment('BULL','BULL','BULL'),{state:'ALIGNED',independentVoteCount:null});
assert.deepEqual(alignment('BULL','BULL','BEAR'),{state:'CONFLICT',independentVoteCount:null});

console.log(JSON.stringify({
 status:'PASS',
 m15:{configuredSlots:17,fullRegularSlots:18,coveragePct:17/18*100,coverageThrough:'13:15'},
 weekly:{partial,full},
 daily:{live:'PROVISIONAL_DAILY_BAR',final:'CONFIRMED_DAILY_CLOSE'},
 voteCount:null
},null,2));
