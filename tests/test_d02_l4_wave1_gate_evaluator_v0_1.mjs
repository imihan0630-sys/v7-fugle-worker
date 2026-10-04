import assert from 'node:assert/strict';
import {evaluateWave1Dataset,evaluateWave1Row,evaluateOutcomeEligibility} from '../research/d02_l4_wave1_gate_evaluator_v0_1.mjs';

const date=i=>`2026-11-${String((i%30)+1).padStart(2,'0')}`;
const iso=(d,t)=>`${d}T${t}+08:00`;
let seq=0;
function h001(d,over={}){
  const n=seq++;
  return {hypothesis:'H001',scanDate:d,eventId:`H001:${d}:2330:${n}`,symbol:'2330',cleanScanDate:true,gate0to6Pass:true,dataQaPass:true,cleanCohortProvenance:true,generationAligned:true,formalIsolationPass:true,sourceContinuityPass:true,commonSupportPass:true,slotKey:'10:15',formalLocalVolumeRatio:1.2,pvSlotRvol20:1.4,slotHistoryCount:20,sameSlotBaselineClean:true,currentSlotCoverageValid:true,identicalOutcomeAvailabilityBC:true,featureBarEnd:iso(d,'10:30:00'),featureFirstKnownAt:iso(d,'10:30:01'),outcomeStartAt:iso(d,'10:45:00'),outcomeKnownAt:iso(d,'13:31:00'),outcomeStatus:'COMPLETED',...over};
}
function h20(d,over={}){
  const n=seq++;
  const pid=`BRK:${d}:2330:${n}`;
  const anchor=iso(d,'10:15:00');
  return {hypothesis:'H20',scanDate:d,eventId:`H20_BREAKOUT:${d}:2330:${n}`,symbol:'2330',cleanScanDate:true,gate0to6Pass:true,dataQaPass:true,cleanCohortProvenance:true,generationAligned:true,formalIsolationPass:true,sourceContinuityPass:true,commonSupportPass:true,primitiveEventOwner:'D01-05',primitiveEventId:pid,comparatorPrimitiveEventId:pid,anchorBarStart:anchor,comparatorAnchorBarStart:anchor,outcomeHorizon:'D1',comparatorOutcomeHorizon:'D1',featureBarEnd:iso(d,'10:30:00'),featureFirstKnownAt:iso(d,'10:30:01'),outcomeStartAt:iso(d,'10:45:00'),outcomeKnownAt:iso(d,'13:31:00'),outcomeStatus:'COMPLETED',...over};
}
function h003(d,over={}){
  const n=seq++;
  return {hypothesis:'H003',scanDate:d,eventId:`H003:${d}:2330:${n}`,symbol:'2330',cleanScanDate:true,gate0to6Pass:true,dataQaPass:true,cleanCohortProvenance:true,generationAligned:true,formalIsolationPass:true,sourceContinuityPass:true,commonSupportPass:true,sameFeatureBarForPAndPV:true,h003HypothesisCleanEvent:true,preEventOnlyExpiry:false,featureBarEnd:iso(d,'10:30:00'),featureFirstKnownAt:iso(d,'10:30:01'),outcomeStartAt:iso(d,'10:45:00'),outcomeKnownAt:iso(d,'13:31:00'),outcomeStatus:'COMPLETED',...over};
}
function dates(n){ return Array.from({length:n},(_,i)=>date(i)); }
function rowsByDates(n,perDate=1,builder=h001){
  const out=[]; for(const d of dates(n)) for(let j=0;j<perDate;j++) out.push(builder(d,{symbol:String(2300+j)})); return out;
}

let r=evaluateWave1Dataset(rowsByDates(19,1));
assert.equal(r.distinctCleanScanDates,19); assert.equal(r.outcomeAccessState,'OUTCOME_ACCESS_CLOSED');

r=evaluateWave1Dataset(rowsByDates(20,1)); assert.equal(r.outcomeAccessState,'DESCRIPTIVE_ONLY');

r=evaluateWave1Dataset(rowsByDates(29,4)); assert.equal(r.completedEligibleEvents,116); assert.equal(r.outcomeAccessState,'DESCRIPTIVE_ONLY');

let a=[]; for(const [i,d] of dates(30).entries()){ const k=i<9?4:3; for(let j=0;j<k;j++) a.push(h001(d,{symbol:String(2300+j)})); }
assert.equal(a.length,99); r=evaluateWave1Dataset(a); assert.equal(r.outcomeAccessState,'DESCRIPTIVE_ONLY');

a.push(h001(dates(30)[29],{symbol:'9999'})); r=evaluateWave1Dataset(a); assert.equal(r.completedEligibleEvents,100); assert.equal(r.outcomeAccessState,'L4_EVIDENCE_ELIGIBLE'); assert.equal(r.maturityPromotionAuthorized,false);

a=rowsByDates(20,1); a[0].commonSupportPass=false; r=evaluateWave1Dataset(a); assert.equal(r.distinctCleanScanDates,19); assert.equal(r.outcomeAccessState,'OUTCOME_ACCESS_CLOSED');

assert.ok(evaluateWave1Row(h001(date(0),{gate0to6Pass:false})).reasons.includes('GATE_0_6_NOT_PASS'));
assert.ok(evaluateWave1Row(h001(date(0),{formalIsolationPass:false})).reasons.includes('FORMAL_ISOLATION_NOT_PASS'));
assert.ok(evaluateWave1Row(h001(date(0),{generationAligned:false})).reasons.includes('GENERATION_NOT_ALIGNED'));
assert.ok(evaluateWave1Row(h001(date(0),{slotKey:'10:00'})).reasons.includes('H001_SLOT_BEFORE_10_15_OR_INVALID'));
assert.ok(evaluateWave1Row(h20(date(0),{comparatorPrimitiveEventId:'OTHER'})).reasons.includes('H20_PRIMITIVE_EVENT_ID_MISMATCH'));

let row=h003(date(0),{featureFirstKnownAt:iso(date(0),'10:30:00'),outcomeStartAt:iso(date(0),'10:30:00')});
assert.ok(evaluateOutcomeEligibility(row).reasons.includes('OUTCOME_NOT_STRICTLY_FUTURE'));

row=h003(date(0),{outcomeStatus:'CENSORED'}); assert.ok(evaluateOutcomeEligibility(row).reasons.includes('OUTCOME_CENSORED_OR_UNKNOWN'));

row=h001(date(0)); r=evaluateWave1Dataset([row,{...row}]); assert.equal(r.fatalIntegrity,true); assert.ok(r.datasetReasons.includes('DUPLICATE_EVENT_ID_SAME_DATE'));

row=h001(date(0)); r=evaluateWave1Dataset([row,{...row,scanDate:date(1)}]); assert.equal(r.fatalIntegrity,true); assert.ok(r.datasetReasons.includes('DUPLICATE_EVENT_ID_CROSS_DATE'));

a=[]; for(let j=0;j<8;j++) a.push(h001(date(0),{symbol:String(2300+j)})); r=evaluateWave1Dataset(a); assert.equal(r.preOutcomeEligibleEvents,8); assert.equal(r.distinctCleanScanDates,1);

assert.ok(evaluateWave1Row(h20(date(0),{eventId:`H20_BREAKOUT:${date(1)}:2330:X`})).reasons.includes('H20_EVENT_DATE_MISMATCH'));
assert.ok(evaluateWave1Row(h003(date(0),{preEventOnlyExpiry:true})).reasons.includes('H003_PRE_EVENT_ONLY_EXPIRY_QA_ONLY'));

a=rowsByDates(30,4); r=evaluateWave1Dataset(a,{prospectiveOrOosEvidencePresent:true,d16DependenceAwareMethodPass:true,negativeControlsReported:true,redundancyChecksReported:true,concentrationPass:true}); assert.equal(r.promotionReviewEligible,true); assert.equal(r.maturityPromotionAuthorized,false);

console.log(JSON.stringify({status:'PASS',tests:19,contract:'D02_L4_WAVE1_GATE_V0_1'}));
