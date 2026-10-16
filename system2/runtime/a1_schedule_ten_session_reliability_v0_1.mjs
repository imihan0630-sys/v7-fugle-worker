// System2 Class A: ten OFFICIAL trading-session read-only A1 schedule reliability.
// Observed genuine github.event.schedule receipts vs expected Cron slots.
// Never infer a missing GitHub run is definitively "dropped" from incomplete REST.
import {sha256Hex} from './decision_archive.mjs';

const SLOTS=Object.freeze([
 {cron:'15 12 * * 1-5',slot:'20:15_T_SOURCE_ONLY',hour:12,minute:15},
 {cron:'45 15 * * 1-5',slot:'23:45_T_SOURCE_ONLY',hour:15,minute:45},
 {cron:'15 16 * * 1-5',slot:'00:15_T_PLUS_ONE_SOURCE_ONLY',hour:16,minute:15}
]);
const SHA=/^[a-f0-9]{64}$/i;
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const DAY=/^\d{4}-\d\d-\d\d$/;
const originStartDay='2026-10-16'; // PR #1380 merged 2026-10-16 10:46 Taipei.
const isDay=x=>typeof x==='string'&&DAY.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const ms=x=>typeof x==='string'&&ISO.test(x)&&Number.isFinite(Date.parse(x))?Date.parse(x):null;
const unsigned=(x,key)=>Object.fromEntries(Object.entries(x).filter(([k])=>k!==key));
const percentage=(good,total)=>total?Math.round(10000*good/total)/100:null;
const block=x=>{throw Error('A1_SCHEDULE_TEN_SESSION_'+x)};
const expected=(day,slot)=>{
 const n=Date.parse(day+'T00:00:00Z')+slot.hour*3600000+slot.minute*60000;
 return new Date(n).toISOString();
};
async function validDual(x){
 if(!x||x.schemaVersion!=='S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1'||
    !SHA.test(x.receiptHash||'')||
    await sha256Hex(unsigned(x,'receiptHash'))!==x.receiptHash||
    !Number.isSafeInteger(x.sourceRunId)||x.sourceRunId<1||
    x.sourceRunAttempt!==1||!isDay(x.marketDate)||
    x.sourceRunEvent!=='schedule'||x.scheduler?.cronAttribution!==
     'SOURCE_GITHUB_EVENT_PAYLOAD_SELF_REPORTED_NOT_INDEPENDENT_SCHEDULE_OCCURRENCE'||
    !SLOTS.some(s=>s.cron===x.scheduler?.cronExpression)||
    !['WITHIN_15_MIN_RESEARCH_SLO','DELAYED_OVER_15_MIN_RESEARCH_SLO',
      'NOMINAL_OCCURRENCE_UNATTRIBUTABLE'].includes(x.scheduler?.state)||
    !SHA.test(x.originalEventOriginHash||'')||
    ms(x.scheduler.actualRunCreatedAtUtc)===null||
    ms(x.scheduler.actualJobStartedAtUtc)===null||
    ms(x.scheduler.actualJobCompletedAtUtc)===null||
    x.decisionClock?.finalSelectionAuthorized!==false||
    x.decisionClock?.selectedCount!==null||x.decisionClock?.zeroPickDay!==null||
    x.decisionClock?.frozenD1Written!==false||
    x.decisionClock?.cloudflareD1Writes!==0||
    x.onlyResearchAcceptance!==true||
    x.system1FormalCoreTouched!==false)
  return false;
 return true;
}
export async function buildA1ScheduleTenSessionRollupV0_1({
 tradingDates, dualReceipts=[],sourceRuns=[],asOfUtc,
 censusComplete=false, trackingFromTradingDate=originStartDay
}={}){
 const end=ms(asOfUtc);
 if(end===null||!isDay(trackingFromTradingDate)||
    !Array.isArray(tradingDates)||!tradingDates.length||
    tradingDates.length>61||tradingDates.some((x,i)=>
      !isDay(x)||(i>0&&x<=tradingDates[i-1]))||
    !Array.isArray(dualReceipts)||dualReceipts.length>150||
    !Array.isArray(sourceRuns)||sourceRuns.length>500||
    typeof censusComplete!=='boolean')
  block('INPUT_OR_CLOCK_INVALID');
 const sessions=tradingDates.filter(x=>x>=trackingFromTradingDate).slice(-10);
 const eligible=new Set(sessions);
 const seenRuns=new Map();
 for(const run of sourceRuns){
  if(!Number.isSafeInteger(run?.id)||run.id<1||
     run.event!=='schedule'||run.head_branch!=='main'||
     run.path!=='.github/workflows/system2-shared-official-a1-incremental-readonly.yml'||
     !Number.isSafeInteger(run.run_attempt)||run.run_attempt<1||
     ms(run.created_at)===null||
     !['completed','in_progress','queued','waiting','pending','requested'].includes(run.status)||
     seenRuns.has(run.id))
   block('SCHEDULE_SOURCE_CENSUS_PROVENANCE_INVALID');
  seenRuns.set(run.id,run);
 }
 const grouped=new Map(),unattributedIds=new Set(),outside=[],observed=new Set();
 let invalidSignedReceipts=0;
 for(const d of dualReceipts){
  if(!await validDual(d)){invalidSignedReceipts++;continue}
  const run=seenRuns.get(d.sourceRunId);
  if(!run||run.run_attempt!==1||run.created_at!==d.scheduler.actualRunCreatedAtUtc||
     run.conclusion!=='success'){
   invalidSignedReceipts++;continue;
  }
  observed.add(run.id);
  const nominal=d.scheduler.nominalInferredUtc;
  if(ms(nominal)===null||nominal.slice(0,10)<trackingFromTradingDate||
     !eligible.has(nominal.slice(0,10))||
     expected(nominal.slice(0,10),
      SLOTS.find(s=>s.cron===d.scheduler.cronExpression))!==nominal||
     d.scheduler.state==='NOMINAL_OCCURRENCE_UNATTRIBUTABLE'){
   outside.push(run.id);continue;
  }
  const key=nominal.slice(0,10)+'|'+d.scheduler.cronExpression;
  const group=grouped.get(key)||[];
  if(group.some(x=>x.sourceRunId===d.sourceRunId))continue;
  group.push(d);
  grouped.set(key,group);
 }
 for(const run of sourceRuns)if(!observed.has(run.id) &&
   ms(run.created_at)>=Date.parse(trackingFromTradingDate+'T00:00:00Z'))
  unattributedIds.add(run.id);
 const slots=[],graceMs=48*3600000;
 for(const day of sessions)for(const slot of SLOTS){
  const nominal=expected(day,slot),n=ms(nominal);
  const records=grouped.get(day+'|'+slot.cron)||[];
  const validRecord=records.length===1?records[0]:null;
  const mature=n+graceMs<=end;
  const punctual=validRecord?.scheduler?.state==='WITHIN_15_MIN_RESEARCH_SLO';
  const sourcePass=validRecord?.sourceIntegrity?.independentlyAccepted===true;
  const withinDecision=validRecord?.decisionClock?.state===
    'SOURCE_ASSESSMENT_WITHIN_T_PLUS_ONE_0159_NOT_PIT';
  const atRisk=sourceRuns.some(run=>{
    const c=ms(run.created_at);
    return !observed.has(run.id)&&c>=n&&c<=n+graceMs;
  });
  const status=records.length>1?'MULTIPLE_ORIGIN_RUNS_SAME_SLOT_REVIEW':
    validRecord?punctual?'ATTRIBUTED_WITHIN_15_MIN':'ATTRIBUTED_LATE':
    !mature?'AWAITING_48H_MATURITY':
    !censusComplete?'CENSUS_INCOMPLETE_NO_MISSED_ASSERTION':
    atRisk?'UNATTRIBUTED_RUN_IN_48H_WINDOW':
    'NOT_OBSERVED_AFTER_48H_FULL_CENSUS_NOT_CONFIRMED_DROPPED';
  slots.push({marketDate:day,slot:slot.slot,cron:slot.cron,nominalInferredUtc:nominal,
   maturityReached:mature,status,
   sourceRunId:validRecord?.sourceRunId??null,
   deliveredPunctually:validRecord?punctual:null,
   independent122SourceIntegrity:validRecord?sourcePass:null,
   sourceAndIndependentAuditBeforeDecisionCutoff:validRecord?withinDecision:null,
   sourceFirstKnownAtCertified:false,formalFrozenAuthorized:false});
 }
 const attributed=slots.filter(x=>x.sourceRunId!==null);
 const matured=slots.filter(x=>x.maturityReached);
 const punctual=attributed.filter(x=>x.deliveredPunctually===true).length;
 const sourceAccepted=attributed.filter(x=>x.independent122SourceIntegrity===true).length;
 const deadline=attributed.filter(x=>x.sourceAndIndependentAuditBeforeDecisionCutoff===true).length;
 const late=attributed.length-punctual;
 const unobservedMatured=matured.filter(x=>x.status.startsWith('NOT_OBSERVED_')).length;
 const unresolved=matured.filter(x=>x.status==='UNATTRIBUTED_RUN_IN_48H_WINDOW'||
  x.status==='CENSUS_INCOMPLETE_NO_MISSED_ASSERTION'||
  x.status==='MULTIPLE_ORIGIN_RUNS_SAME_SLOT_REVIEW').length;
 const base={schemaVersion:'S2_A1_TEN_OFFICIAL_SESSION_SCHEDULE_RELIABILITY_V0_1',
  asOfUtc,trackingFromTradingDate,officialTradingSessionCount:sessions.length,
  officialTradingDates:sessions,
  expectedSlotsAcrossSessions:slots.length,maturedExpectedSlots:matured.length,
  independentlyAttributedScheduleRuns:attributed.length,
  sourceRunCountObservedInCensus:sourceRuns.length,
  sourceRunIdsWithNoAttributableDualReceipt:[...unattributedIds].sort((a,b)=>a-b),
  invalidOrUnlinkedDualReceiptCount:invalidSignedReceipts,
  outOfTrackingSessionReceiptRunIds:outside.sort((a,b)=>a-b),
  punctualScheduleRuns:punctual,lateScheduleRuns:late,
  observedIndependentlyVerified122Of122Count:sourceAccepted,
  observedWithinSourceDecisionClockCount:deadline,
  punctualityAmongAttributedRunsPct:percentage(punctual,attributed.length),
  acceptedSourceRateAmongAttributedRunsPct:percentage(sourceAccepted,attributed.length),
  sourceDecisionClockRateAmongAttributedRunsPct:percentage(deadline,attributed.length),
  maturityGraceHours:48,censusComplete,
  noObservedRunForMaturedSlotCount:unobservedMatured,
  unresolvedMaturedSlotCount:unresolved,
  missingDeliveryConfirmed:false,
  expectedSlotDeliveryRateCertified:false,
  dataMaturityState:matured.length===0?'NO_MATURED_POSTDEPLOYMENT_SLOTS':
   attributed.length===0?'NO_ORIGINAL_CRON_IDENTIFIED_SAMPLES':
    'OBSERVED_RUNS_ONLY_WITH_UNKNOWN_UNOBSERVED_DELIVERIES',
  slots,selectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,system1FormalCoreTouched:false};
 return Object.freeze({...base,rollupHash:await sha256Hex(base)});
}
