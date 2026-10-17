import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSchemeCManualRecoveryAuditRunV0_1 as gate}
 from '../runtime/scheme_c_manual_recovery_audit_run_v0_1.mjs';
const REPO='imihan0630-sys/v7-fugle-worker',ID=38934321405;
const W='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const valid=()=>({
 id:ID,name:'System2 Shared Official A1 Independent Source Audit (READ ONLY)',
 event:'workflow_run',head_branch:'main',head_repository:{full_name:REPO},
 repository:{full_name:REPO},path:W+'@main',status:'completed',
 conclusion:'success',head_sha:'a'.repeat(40)
});
const check=x=>gate(x,{repo:REPO,requestedRunId:ID});
test('only genuinely successful main independent A1 audit run is a read-only manual recovery source',()=>{
 const r=check(valid());
 assert.equal(r.auditRunId,ID);
 assert.equal(r.sourceKind,'SAME_RUN_SOURCE_ONLY_AUDIT_ARTIFACT');
 assert.equal(r.canReplayReadOnlyPreview,true);
 assert.equal(r.canSelect,false);
 assert.equal(r.canBackdateMarketDecision,false);
 assert.equal(r.pitA,false);
 assert.equal(r.pitB,false);
 assert.equal(r.frozen,false);
 for(const suffix of ['', '@refs/heads/main']){
  assert.equal(check({...valid(),path:W+suffix}).auditRunId,ID);
 }
});
test('reject source producers, own consumer runs, PR, push, dispatch and unrelated workflow',()=>{
 const mutations=[
  x=>x.name='System2 Shared Official TWSE TPEx A1 Incremental (READ ONLY)',
  x=>x.name='System2 Scheme C Daily Independent-Audit Preview Consumer (NO NEW CRON)',
  x=>x.event='push',x=>x.event='workflow_dispatch',x=>x.event='pull_request',
  x=>x.head_branch='feature',x=>x.repository.full_name='attacker/fork',
  x=>x.head_repository.full_name='attacker/fork',
  x=>x.path='.github/workflows/other.yml@main',
  x=>x.path=W+'@feature'
 ];
 for(const mutate of mutations){
  const x=valid();mutate(x);
  assert.throws(()=>check(x),/IDENTITY_OR_MAIN_ORIGIN_MISMATCH/);
 }
});
test('reject incomplete/cancelled/failure/queued and wrong audit ID without fallback',()=>{
 const x=valid();
 for(const conclusion of ['failure','cancelled',null,'skipped']){
  assert.throws(()=>check({...x,conclusion}),/NOT_SUCCESSFULLY_COMPLETED/);
 }
 assert.throws(()=>check({...x,status:'in_progress'}),/NOT_SUCCESSFULLY_COMPLETED/);
 assert.throws(()=>check({...x,id:ID+1}),/EXACT_RUN_ID_MISMATCH/);
 assert.throws(()=>gate(x,{repo:'wrong/repo',requestedRunId:ID}),/UNAUTHORIZED_REPO_OR_RUN_ID/);
 assert.throws(()=>gate(x,{repo:REPO,requestedRunId:0}),/UNAUTHORIZED_REPO_OR_RUN_ID/);
 assert.throws(()=>check({...x,head_sha:'fake'}),/AUDIT_HEAD_SHA_INVALID/);
});
