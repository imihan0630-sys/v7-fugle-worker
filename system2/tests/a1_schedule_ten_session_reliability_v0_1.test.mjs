import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildA1ScheduleTenSessionRollupV0_1 as rollup}
 from '../runtime/a1_schedule_ten_session_reliability_v0_1.mjs';
import {collectA1TenSessionRollupV0_1 as collect}
 from '../scripts/audit_a1_ten_session_reliability_v0_1.mjs';
const PATH='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const SLOTS=[['15 12 * * 1-5','12:15'],['45 15 * * 1-5','15:45'],
 ['15 16 * * 1-5','16:15']];
const DAY=['2026-10-16','2026-10-19'];
const META={trackingFromTradingDate:'2026-10-16',
 tradingDates:DAY,asOfUtc:'2026-10-22T18:20:00Z'};
async function proof({day=DAY[0],index=0,id=10,onTime=true,
 sourcePass=true,decisionPass=true}={}){
 const [cron,hm]=SLOTS[index],nominal=day+'T'+hm+':00.000Z';
 const t=Date.parse(nominal),created=new Date(t+(onTime?5:90)*60000).toISOString(),
  jobStarted=new Date(t+(onTime?6:91)*60000).toISOString(),
  jobEnded=new Date(t+(onTime?8:93)*60000).toISOString();
 const base={
  schemaVersion:'S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1',
  marketDate:day,sourceRunId:id,sourceRunAttempt:1,sourceRunEvent:'schedule',
  originalEventOriginHash:'a'.repeat(64),
  sourceIntegrity:{independentlyAccepted:sourcePass},
  scheduler:{cronAttribution:
   'SOURCE_GITHUB_EVENT_PAYLOAD_SELF_REPORTED_NOT_INDEPENDENT_SCHEDULE_OCCURRENCE',
   cronExpression:cron,nominalInferredUtc:nominal,
   actualRunCreatedAtUtc:created,actualJobStartedAtUtc:jobStarted,
   actualJobCompletedAtUtc:jobEnded,
   state:onTime?'WITHIN_15_MIN_RESEARCH_SLO':'DELAYED_OVER_15_MIN_RESEARCH_SLO'},
  decisionClock:{state:decisionPass?
   'SOURCE_ASSESSMENT_WITHIN_T_PLUS_ONE_0159_NOT_PIT':
   'OUTSIDE_OR_UNQUALIFIED_SOURCE_ASSESSMENT_CLOCK',
   finalSelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
   frozenD1Written:false,cloudflareD1Writes:0},
  onlyResearchAcceptance:true,system1FormalCoreTouched:false
 };
 return {receipt:{...base,receiptHash:await sha256Hex(base)},
  run:{id,event:'schedule',head_branch:'main',path:PATH,
   run_attempt:1,created_at:created,status:'completed',conclusion:'success'}};
}
test('separate punctuality, actual 122 source and cutoff denominators over two official sessions',async()=>{
 const a=await proof({id:11,index:0,onTime:true,sourcePass:true,decisionPass:true});
 const b=await proof({id:12,index:1,onTime:false,sourcePass:true,decisionPass:false});
 const c=await proof({id:13,index:2,onTime:true,sourcePass:false,decisionPass:false});
 const z=await rollup({...META,dualReceipts:[a.receipt,b.receipt,c.receipt],
  sourceRuns:[a.run,b.run,c.run],censusComplete:true});
 assert.equal(z.expectedSlotsAcrossSessions,6);
 assert.equal(z.maturedExpectedSlots,6);
 assert.equal(z.independentlyAttributedScheduleRuns,3);
 assert.equal(z.punctualScheduleRuns,2);
 assert.equal(z.lateScheduleRuns,1);
 assert.equal(z.observedIndependentlyVerified122Of122Count,2);
 assert.equal(z.observedWithinSourceDecisionClockCount,1);
 assert.equal(z.punctualityAmongAttributedRunsPct,66.67);
 assert.equal(z.acceptedSourceRateAmongAttributedRunsPct,66.67);
 assert.equal(z.sourceDecisionClockRateAmongAttributedRunsPct,33.33);
 assert.equal(z.noObservedRunForMaturedSlotCount,3);
 assert.equal(z.missingDeliveryConfirmed,false);
 assert.equal(z.selectedCount,null);assert.equal(z.frozenD1Written,false);
 const {rollupHash,...base}=z;assert.equal(rollupHash,await sha256Hex(base));
});
test('no matured post-deploy session does not mean 0% punctuality',async()=>{
 const z=await rollup({tradingDates:['2026-10-15'],
  asOfUtc:'2026-10-16T02:55:00Z',dualReceipts:[],
  sourceRuns:[],censusComplete:true});
 assert.equal(z.officialTradingSessionCount,0);
 assert.equal(z.expectedSlotsAcrossSessions,0);
 assert.equal(z.punctualityAmongAttributedRunsPct,null);
 assert.equal(z.dataMaturityState,'NO_MATURED_POSTDEPLOYMENT_SLOTS');
});
test('future or less-than-48-hour slot stays pending, not counted as dropped',async()=>{
 const z=await rollup({trackingFromTradingDate:'2026-10-16',
  tradingDates:[DAY[0]],asOfUtc:'2026-10-17T11:00:00Z',
  dualReceipts:[],sourceRuns:[],censusComplete:true});
 assert.equal(z.maturedExpectedSlots,0);
 assert.equal(z.noObservedRunForMaturedSlotCount,0);
 assert.ok(z.slots.every(s=>s.status==='AWAITING_48H_MATURITY'));
});
test('incomplete GitHub REST census cannot claim even unobserved slots',async()=>{
 const z=await rollup({...META,dualReceipts:[],sourceRuns:[],censusComplete:false});
 assert.equal(z.noObservedRunForMaturedSlotCount,0);
 assert.equal(z.unresolvedMaturedSlotCount,6);
 assert.ok(z.slots.every(s=>s.status==='CENSUS_INCOMPLETE_NO_MISSED_ASSERTION'));
});
test('exact successful source run lacking dual origin makes slot un-attributable',async()=>{
 const a=await proof({id:41,index:0});
 const z=await rollup({...META,dualReceipts:[],sourceRuns:[a.run],censusComplete:true});
 assert.equal(z.independentlyAttributedScheduleRuns,0);
 assert.equal(z.sourceRunIdsWithNoAttributableDualReceipt.length,1);
 assert.equal(z.slots[0].status,'UNATTRIBUTED_RUN_IN_48H_WINDOW');
 assert.equal(z.missingDeliveryConfirmed,false);
});
test('same-day push and workflow_dispatch source cannot boost Cron rate',async()=>{
 const a=await proof({id:11,index:0});
 const forged={...a.receipt,sourceRunEvent:'push'};
 const {receiptHash,...base}=forged;forged.receiptHash=await sha256Hex(base);
 const z=await rollup({...META,dualReceipts:[forged],
  sourceRuns:[],censusComplete:true});
 assert.equal(z.independentlyAttributedScheduleRuns,0);
 assert.equal(z.punctualityAmongAttributedRunsPct,null);
});
test('validly re-signed Cron with swapped slot cannot fool source REST run association',async()=>{
 const a=await proof({id:22,index:0});
 const altered={...a.receipt,scheduler:{...a.receipt.scheduler,cronExpression:SLOTS[1][0]}};
 const {receiptHash,...base}=altered;altered.receiptHash=await sha256Hex(base);
 const z=await rollup({...META,dualReceipts:[altered],sourceRuns:[a.run],censusComplete:true});
 assert.equal(z.independentlyAttributedScheduleRuns,0);
 assert.equal(z.outOfTrackingSessionReceiptRunIds.length,1);
});
test('duplicate Cron event origins for same expected slot never double count a success',async()=>{
 const a=await proof({id:23,index:0});
 const b=await proof({id:24,index:0});
 const z=await rollup({...META,dualReceipts:[a.receipt,b.receipt],
  sourceRuns:[a.run,b.run],censusComplete:true});
 assert.equal(z.independentlyAttributedScheduleRuns,0);
 assert.equal(z.slots[0].status,'MULTIPLE_ORIGIN_RUNS_SAME_SLOT_REVIEW');
 assert.equal(z.unresolvedMaturedSlotCount,1);
});
test('source audit receipt hash tampering rejected, not counted as an accepted schedule',async()=>{
 const a=await proof({id:25,index:0});
 a.receipt.scheduler.actualJobStartedAtUtc='2026-10-17T00:00:00Z';
 const z=await rollup({...META,dualReceipts:[a.receipt],sourceRuns:[a.run],censusComplete:true});
 assert.equal(z.invalidOrUnlinkedDualReceiptCount,1);
 assert.equal(z.independentlyAttributedScheduleRuns,0);
});
test('signed but mismatched GitHub run.created_at cannot be used to invent start time',async()=>{
 const a=await proof({id:26,index:0});
 a.run.created_at='2026-10-16T12:17:00.000Z';
 const z=await rollup({...META,dualReceipts:[a.receipt],sourceRuns:[a.run],censusComplete:true});
 assert.equal(z.invalidOrUnlinkedDualReceiptCount,1);
});
test('reject unsorted or duplicated official trading dates',async()=>{
 await assert.rejects(()=>rollup({...META,tradingDates:[DAY[0],DAY[0]]}),
  /A1_SCHEDULE_TEN_SESSION_INPUT_OR_CLOCK_INVALID/);
});

test('real GitHub metadata complete but failed dual-audit ZIP must make ALL empty mature slots unresolved',async()=>{
 const paths=[],now=()=>new Date('2026-10-25T18:20:00Z');
 const fetchImpl=async(url)=>{
  paths.push(url);
  if(url.includes('/actions/runs?')){
   if(url.includes('event=schedule'))return {ok:true,async json(){
    return {total_count:0,workflow_runs:[]};
   }};
   return {ok:true,async json(){return {total_count:1,workflow_runs:[{
    id:900,event:'workflow_run',path:'.github/workflows/system2-shared-official-a1-independent-audit.yml',
    head_branch:'main',status:'completed',conclusion:'success',
    created_at:'2026-10-19T18:20:00Z'
   }]};}};
  }
  if(url.includes('/actions/runs/900/artifacts'))return {ok:true,async json(){
   return {artifacts:[{id:901,name:'s2-a1-dual-source-clock-900',
    expired:false,size_in_bytes:1024}]};
  }};
  if(url.includes('/actions/artifacts/901/zip'))return {ok:false,status:503};
  throw Error('MOCK_UNEXPECTED_URL');
 };
 const z=await collect({repository:'example/system2',token:'FAKE_TEST_ONLY',
  sourceManifest:{tradingDates:DAY},
  currentDual:{schemaVersion:'S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1',
   sourceRunEvent:'push'},
  now,fetchImpl});
 assert.equal(z.downloadOrZipFailureCount,1);
 assert.equal(z.censusComplete,false);
 assert.equal(z.maturedExpectedSlots,6);
 assert.equal(z.noObservedRunForMaturedSlotCount,0);
 assert.equal(z.unresolvedMaturedSlotCount,6);
 assert.ok(z.slots.every(x=>x.status==='CENSUS_INCOMPLETE_NO_MISSED_ASSERTION'));
 assert.equal(z.punctualityAmongAttributedRunsPct,null);
 assert.equal(z.missingDeliveryConfirmed,false);
 assert.ok(paths.some(x=>x.includes('/actions/artifacts/901/zip')));
});
test('with genuinely fully enumerated empty REST/dual census maturity remains caveated not confirmed drop',async()=>{
 const z=await collect({repository:'example/system2',token:'FAKE_TEST_ONLY',
  sourceManifest:{tradingDates:DAY},
  currentDual:{schemaVersion:'S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1',
   sourceRunEvent:'push'},
  now:()=>new Date('2026-10-25T18:20:00Z'),
  fetchImpl:async url=>{
   if(!url.includes('/actions/runs?'))throw Error('NO_ARCHIVES_EXPECTED');
   return {ok:true,async json(){return {total_count:0,workflow_runs:[]}}};
  }});
 assert.equal(z.downloadOrZipFailureCount,0);
 assert.equal(z.censusComplete,true);
 assert.equal(z.noObservedRunForMaturedSlotCount,6);
 assert.ok(z.slots.every(x=>x.status===
  'NOT_OBSERVED_AFTER_48H_FULL_CENSUS_NOT_CONFIRMED_DROPPED'));
 assert.equal(z.missingDeliveryConfirmed,false);
 assert.equal(z.punctualityAmongAttributedRunsPct,null);
});
test('real workflow invokes both independent dual and rolling scheduled history under existing Cron',async()=>{
 const a=await readFile('.github/workflows/system2-shared-official-a1-independent-audit.yml','utf8');
 const s=await readFile('.github/workflows/system2-shared-official-a1-incremental-readonly.yml','utf8');
 assert.match(a,/audit_shared_a1_dual_acceptance_v0_1.mjs/);
 assert.match(a,/audit_a1_ten_session_reliability_v0_1.mjs/);
 assert.match(a,/ten-session-rollup.json/);
 assert.doesNotMatch(a,/secrets\./);
 assert.match(s,/15 12 \* \* 1-5/);
 assert.match(s,/45 15 \* \* 1-5/);
 assert.match(s,/15 16 \* \* 1-5/);
});
