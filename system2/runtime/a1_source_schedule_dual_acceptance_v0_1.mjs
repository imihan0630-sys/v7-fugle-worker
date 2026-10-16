// System 2 Class A. Research-only independent DUAL acceptance for one real A1 run.
// Source integrity, schedule punctuality, and PIT decision-clock timeliness
// are three INDEPENDENT dimensions. NONE promotes a trade or Frozen decision.
import {sha256Hex} from './decision_archive.mjs';

const CRONS=Object.freeze({
 '15 12 * * 1-5':{hour:12,minute:15,slot:'20:15_T_SOURCE_ONLY'},
 '45 15 * * 1-5':{hour:15,minute:45,slot:'23:45_T_SOURCE_ONLY'},
 '15 16 * * 1-5':{hour:16,minute:15,slot:'00:15_T_PLUS_ONE_SOURCE_ONLY'}
});
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const SHA=/^[a-f0-9]{64}$/i;
const date=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\d$/.test(x)&&
 !Number.isNaN(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
function ms(x){return typeof x==='string'&&ISO.test(x)&&Number.isFinite(Date.parse(x))?Date.parse(x):null}
function deny(x){throw Error('A1_DUAL_ACCEPTANCE_'+x)}
function unsigned(x,key){return Object.fromEntries(Object.entries(x||{}).filter(([n])=>n!==key))}
const minutes=(a,b)=>Number(((a-b)/60000).toFixed(3));
export function closestNominalA1CronV0_1(cron,createdAtUtc){
 const cfg=CRONS[cron],created=ms(createdAtUtc);
 if(!cfg||created===null)return null;
 // GitHub gives the configured cron expression, not an authoritative
 // scheduled-occurrence timestamp. This is an explicitly INFERRED occurrence.
 const midnight=Date.UTC(new Date(created).getUTCFullYear(),
  new Date(created).getUTCMonth(),new Date(created).getUTCDate());
 for(let daysBack=0;daysBack<=9;daysBack++){
  const d=new Date(midnight-daysBack*86400000);
  const wd=d.getUTCDay();
  if(wd===0||wd===6)continue;
  const nominal=d.getTime()+cfg.hour*3600000+cfg.minute*60000;
  if(nominal<=created){
   const delay=minutes(created,nominal);
   if(delay>1440)return null; // cannot assign stale/dropped prior-day event
   return Object.freeze({cron,slot:cfg.slot,
    nominalInferredUtc:new Date(nominal).toISOString(),enqueueDelayMinutes:delay,
    attribution:'INFERRED_LATEST_WEEKDAY_MATCH_NOT_GITHUB_OCCURRENCE_PROOF'});
  }
 }
 return null;
}
export async function buildA1DualAcceptanceV0_1({
 origin,sourceRun,sourceJob,sourceReceipt,independentAudit,stage1Summary,
 observedAtUtc=new Date().toISOString()
}={}){
 if(ms(observedAtUtc)===null||!Number.isSafeInteger(sourceRun?.id)||
    sourceRun.id<1||sourceRun.path!==
     '.github/workflows/system2-shared-official-a1-incremental-readonly.yml'||
    sourceRun.head_branch!=='main'||!['schedule','push','workflow_dispatch'].includes(sourceRun.event)||
    !Number.isSafeInteger(sourceRun.run_attempt)||sourceRun.run_attempt<1||
    sourceJob?.name!=='current_source'||sourceJob?.run_id!==sourceRun.id||
    ms(sourceRun.created_at)===null||ms(sourceJob.started_at)===null||
    ms(sourceJob.completed_at)===null||
    ms(sourceRun.created_at)>ms(sourceJob.started_at)||
    ms(sourceJob.started_at)>ms(sourceJob.completed_at)||
    ms(sourceJob.completed_at)>ms(observedAtUtc))
  deny('REAL_GITHUB_RUN_JOB_PROVENANCE_INVALID');
 const originalValid=origin?.schemaVersion==='S2_A1_GITHUB_ORIGIN_V0_1'&&
  origin?.runId===sourceRun.id&&origin?.runAttempt===sourceRun.run_attempt&&
  origin?.eventName===sourceRun.event&&
  SHA.test(origin?.originHash||'')&&
  await sha256Hex(unsigned(origin,'originHash'))===origin.originHash;
 if(!originalValid)deny('EVENT_PAYLOAD_SOURCE_ORIGIN_UNVERIFIED');
 if(sourceRun.event==='schedule'&&!CRONS[origin.eventSchedule])
  deny('UNKNOWN_SCHEDULE_CRON'); // never guess which of three slots
 if(sourceRun.event!=='schedule'&&origin.eventSchedule!==null)
  deny('NON_SCHEDULE_MUST_NOT_INHERIT_CRON');
 if(!date(sourceReceipt?.marketDate)||sourceReceipt?.plannedPairs!==122||
    !['SOURCE_OBSERVED_UNAUDITED','SKIPPED_NO_NEW_OFFICIAL_TRADING_DAY'].includes(sourceReceipt.state))
  deny('SOURCE_RECEIPT_SHAPE_INVALID');
 const verified=independentAudit?.schemaVersion==='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'&&
  independentAudit?.marketDate===sourceReceipt.marketDate&&
  independentAudit?.verdict==='ACCEPTED_SOURCE_INTEGRITY_ONLY'&&
  independentAudit?.sourceMarketDatePairsVerified===122&&
  independentAudit?.selectionAuthorized===false&&
  independentAudit?.strategyPitCertified===false&&
  SHA.test(independentAudit?.auditHash||'')&&
  await sha256Hex(unsigned(independentAudit,'auditHash'))===independentAudit.auditHash&&
  sourceReceipt.state==='SOURCE_OBSERVED_UNAUDITED'&&sourceReceipt.validatedPairs===122;
 const sourceIntegrityState=verified?'INDEPENDENT_SOURCE_122_OF_122_ACCEPTED':
  'SOURCE_NOT_INDEPENDENTLY_ACCEPTED';
 if(!date(stage1Summary?.marketDate)||
    stage1Summary.marketDate!==sourceReceipt.marketDate||
    ms(stage1Summary.freezeAtUtc)===null||
    stage1Summary.selectedCount!==null||stage1Summary.zeroPickDay!==null||
    stage1Summary.selectionAuthorized!==false||
    stage1Summary.frozenDecisionWritten!==false)
  deny('STAGE1_NO_SELECTION_CLOCK_OR_SCOPE_INVALID');
 if(ms(independentAudit?.auditedAtUtc)===null||
    ms(independentAudit.auditedAtUtc)>ms(observedAtUtc))
  deny('INDEPENDENT_AUDIT_CLOCK_INVALID');
 const cutoff=new Date(Date.parse(sourceReceipt.marketDate+'T00:00:00Z')+
  (17*60+59)*60000+59999).toISOString(); // T+1 01:59:59.999 Taipei
 const cut=ms(cutoff);
 const sourceBefore=cut>=ms(sourceJob.completed_at);
 const auditBefore=cut>=ms(independentAudit.auditedAtUtc);
 const assessmentBefore=cut>=ms(stage1Summary.freezeAtUtc);
 const admissionState=sourceIntegrityState==='INDEPENDENT_SOURCE_122_OF_122_ACCEPTED'&&
  sourceBefore&&auditBefore&&assessmentBefore&&
  stage1Summary.state==='STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED'
   ?'SOURCE_ASSESSMENT_WITHIN_T_PLUS_ONE_0159_NOT_PIT':
    'OUTSIDE_OR_UNQUALIFIED_SOURCE_ASSESSMENT_CLOCK';
 const nominal=sourceRun.event==='schedule'?
  closestNominalA1CronV0_1(origin.eventSchedule,sourceRun.created_at):null;
 const totalDelay=nominal?minutes(ms(sourceJob.started_at),ms(nominal.nominalInferredUtc)):null;
 const queueDelay=minutes(ms(sourceJob.started_at),ms(sourceRun.created_at));
 const execution=minutes(ms(sourceJob.completed_at),ms(sourceJob.started_at));
 const scheduleState=sourceRun.event!=='schedule'?'NOT_APPLICABLE_NON_SCHEDULE':
  !nominal?'NOMINAL_OCCURRENCE_UNATTRIBUTABLE':
   totalDelay<=15?'WITHIN_15_MIN_RESEARCH_SLO':'DELAYED_OVER_15_MIN_RESEARCH_SLO';
 const base={
  schemaVersion:'S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1',
  marketDate:sourceReceipt.marketDate,sourceRunId:sourceRun.id,
  observedAtUtc,sourceRunEvent:sourceRun.event,sourceRunAttempt:sourceRun.run_attempt,
  originalEventOriginHash:origin.originHash,
  sourceIntegrity:{state:sourceIntegrityState,pairsVerified:verified?122:null,
   independentlyAccepted:verified,notStrategyPit:true},
  scheduler:{state:scheduleState,cronExpression:sourceRun.event==='schedule'?origin.eventSchedule:null,
   cronAttribution:'SOURCE_GITHUB_EVENT_PAYLOAD_SELF_REPORTED_NOT_INDEPENDENT_SCHEDULE_OCCURRENCE',
   nominalInferredUtc:nominal?.nominalInferredUtc??null,
   nominalEvidenceClass:nominal?.attribution??null,
   actualRunCreatedAtUtc:sourceRun.created_at,actualJobStartedAtUtc:sourceJob.started_at,
   actualJobCompletedAtUtc:sourceJob.completed_at,
   enqueueDelayMinutes:nominal?.enqueueDelayMinutes??null,
   runnerQueueDelayMinutes:queueDelay,fullTriggerToRunnerDelayMinutes:totalDelay,
   jobRuntimeMinutes:execution,researchSloMinutes:15,
   githubScheduleDeliveryGuaranteed:false},
  decisionClock:{state:admissionState,cutoffUtc:cutoff,
   independentAuditObservedAtUtc:independentAudit.auditedAtUtc,
   stage1ObservationAtUtc:stage1Summary.freezeAtUtc,
   sourceJobFinishedBeforeCutoff:sourceBefore,
   independentAuditBeforeCutoff:auditBefore,stage1AsOfBeforeCutoff:assessmentBefore,
   ordinaryEquityHistoricalPitCertified:false,
   finalSelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
   frozenD1Written:false,cloudflareD1Writes:0},
  onlyResearchAcceptance:true,system1FormalCoreTouched:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
