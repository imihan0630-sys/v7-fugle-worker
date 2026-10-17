import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildSchemeCDeliveryOriginV0_1 as build} from '../runtime/scheme_c_delivery_origin_v0_1.mjs';
const o=()=>({eventName:'workflow_run',runId:400,auditRunId:300,
 marketDate:'2026-10-19',handoffReceiptHash:'a'.repeat(64),
 upstreamAuditEvent:'workflow_run',upstreamAuditConclusion:'success',
 upstreamAuditHeadBranch:'main',
 upstreamAuditHeadRepo:'imihan0630-sys/v7-fugle-worker'});
test('real main audit child proves natural consumer invocation, NEVER underlying cron schedule',async()=>{
 const r=await build(o());
 assert.equal(r.naturalAuditChildEventObserved,true);
 assert.equal(r.completedDailyAutomaticSourceChainCertified,false);
 assert.equal(r.sourceCollectorScheduledOriginIndependentlyVerified,null);
 assert.equal(r.status,'AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED');
 assert.equal(r.selectedCount,null);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.deliveryOriginHash,await sha256Hex(Object.fromEntries(Object.entries(r).filter(([k])=>k!=='deliveryOriginHash'))));
});
test('operator recovery can never count as automatic scheduled daily source-chain success',async()=>{
 const r=await build({...o(),eventName:'workflow_dispatch'});
 assert.equal(r.status,'OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC');
 assert.equal(r.naturalAuditChildEventObserved,false);
 assert.equal(r.completedDailyAutomaticSourceChainCertified,false);
 const historical=await build({...o(),eventName:'pull_request',marketDate:'2026-10-16',
  upstreamAuditEvent:null,upstreamAuditConclusion:null,
  upstreamAuditHeadBranch:null,upstreamAuditHeadRepo:null});
 assert.equal(historical.status,'PR_HISTORICAL_PROOF_ONLY');
 assert.equal(historical.naturalAuditChildEventObserved,false);
});
test('fail closed on fake audit-event source and unauthorized origin identities',async()=>{
 const mutators=[
  x=>x.upstreamAuditEvent='schedule',x=>x.upstreamAuditEvent='push',
  x=>x.upstreamAuditConclusion='failure',x=>x.upstreamAuditHeadBranch='develop',
  x=>x.upstreamAuditHeadRepo='example/fork',x=>x.eventName='schedule',
  x=>x.repo='example/fork',x=>x.auditRunId=0,x=>x.handoffReceiptHash='bad',
  x=>x.marketDate='2026-02-30'
 ];
 for(const mutate of mutators){
  const x=o();mutate(x);
  await assert.rejects(build(x),/SCHEME_C_DELIVERY_ORIGIN_/);
 }
 await assert.rejects(build({...o(),eventName:'pull_request'}),/PR_FIXTURE_CANNOT_BORROW_AUTO_EVENT/);
 await assert.rejects(build({...o(),eventName:'workflow_dispatch',upstreamAuditEvent:'workflow_dispatch'}),/MANUAL_AUDIT_UPSTREAM_UNVERIFIED/);
});
