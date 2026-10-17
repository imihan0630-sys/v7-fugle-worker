// BUILD Class A: classify *observed GitHub consumer trigger*, distinct from
// an independently attested original SOURCE scheduler event. Neither the
// completed audit event nor a manual replay certifies an upstream cron slot.
import {sha256Hex} from './decision_archive.mjs';
const deny=x=>{throw Error('SCHEME_C_DELIVERY_ORIGIN_'+x)};
const HASH=/^[a-f0-9]{64}$/i;
export async function buildSchemeCDeliveryOriginV0_1({
  eventName,runId,auditRunId,marketDate,handoffReceiptHash,
  upstreamAuditEvent=null,upstreamAuditConclusion=null,
  upstreamAuditHeadBranch=null,upstreamAuditHeadRepo=null,
  repo='imihan0630-sys/v7-fugle-worker'
}={}){
 if(repo!=='imihan0630-sys/v7-fugle-worker'||
    !Number.isSafeInteger(runId)||runId<1||
    !Number.isSafeInteger(auditRunId)||auditRunId<1||
    !/^\d{4}-\d\d-\d\d$/.test(marketDate||'')||
    !Number.isFinite(Date.parse(marketDate+'T00:00:00Z'))||
    new Date(marketDate+'T00:00:00Z').toISOString().slice(0,10)!==marketDate||
    !HASH.test(handoffReceiptHash||''))deny('EXACT_SOURCE_HANDOFF_INVALID');
 if(!['pull_request','workflow_run','workflow_dispatch'].includes(eventName))
  deny('EVENT_UNSUPPORTED');
 if(eventName==='workflow_run'&&(
    upstreamAuditEvent!=='workflow_run'||
    upstreamAuditConclusion!=='success'||
    upstreamAuditHeadBranch!=='main'||
    upstreamAuditHeadRepo!==repo))
  deny('AUTOMATIC_AUDIT_EVENT_OR_MAIN_ORIGIN_UNVERIFIED');
 if(eventName==='workflow_dispatch'&&(
    upstreamAuditEvent!=='workflow_run'||
    upstreamAuditConclusion!=='success'||
    upstreamAuditHeadBranch!=='main'||
    upstreamAuditHeadRepo!==repo))
  deny('MANUAL_AUDIT_UPSTREAM_UNVERIFIED');
 if(eventName==='pull_request'&&upstreamAuditEvent!==null)
  deny('PR_FIXTURE_CANNOT_BORROW_AUTO_EVENT');
 const auditChildAutomatic=eventName==='workflow_run';
 const status=eventName==='pull_request'
  ?'PR_HISTORICAL_PROOF_ONLY'
  :eventName==='workflow_dispatch'
    ?'OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC'
    :'AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED';
 // An Audit Run's event=workflow_run proves that the audit consumed an
 // upstream workflow; it does not say if THAT SOURCE run was scheduled, push,
 // or manually dispatched. No inference from time, main, success or SHA.
 const base={
  schemaVersion:'S2_SCHEME_C_DELIVERY_ORIGIN_V0_1',
  status,marketDate,auditRunId,consumerRunId:runId,
  handoffReceiptHash,consumerTrigger:eventName,
  naturalAuditChildEventObserved:auditChildAutomatic,
  sourceCollectorScheduledOriginIndependentlyVerified:null,
  completedDailyAutomaticSourceChainCertified:false,
  system2PITA:false,system2PITB:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  ordersAuthorized:false,pushAuthorized:false,cloudflareD1Writes:0
 };
 return Object.freeze({...base,deliveryOriginHash:await sha256Hex(base)});
}
