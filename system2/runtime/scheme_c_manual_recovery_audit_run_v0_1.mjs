// System 2 BUILD-only gate for a manual replay of the ALREADY independently
// source-audited A1 workflow; no SOURCE market GET, formal PIT, or D1 writes.
const EXACT_REPO='imihan0630-sys/v7-fugle-worker';
const EXACT_NAME='System2 Shared Official A1 Independent Source Audit (READ ONLY)';
const EXACT_PATH='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const fail=x=>{throw Error('S2_SCHEME_C_MANUAL_RECOVERY_'+x)};
export function validateSchemeCManualRecoveryAuditRunV0_1(meta,{repo=EXACT_REPO,requestedRunId}={}){
 if(repo!==EXACT_REPO||!Number.isSafeInteger(requestedRunId)||requestedRunId<1)
  fail('UNAUTHORIZED_REPO_OR_RUN_ID');
 if(!meta||typeof meta!=='object'||Array.isArray(meta)||
   meta.id!==requestedRunId)fail('EXACT_RUN_ID_MISMATCH');
 if(meta.name!==EXACT_NAME||meta.event!=='workflow_run'||
   meta.head_branch!=='main'||meta.head_repository?.full_name!==EXACT_REPO||
   meta.repository?.full_name!==EXACT_REPO||
   ![EXACT_PATH,EXACT_PATH+'@main',EXACT_PATH+'@refs/heads/main'].includes(meta.path))
  fail('SOURCE_AUDIT_IDENTITY_OR_MAIN_ORIGIN_MISMATCH');
 if(meta.status!=='completed'||meta.conclusion!=='success')
  fail('INDEPENDENT_AUDIT_NOT_SUCCESSFULLY_COMPLETED');
 if(!/^[0-9a-f]{40}$/.test(meta.head_sha||''))
  fail('AUDIT_HEAD_SHA_INVALID');
 return Object.freeze({
  schemaVersion:'S2_SCHEME_C_MANUAL_RECOVERY_AUDIT_RUN_V0_1',
  auditRunId:requestedRunId,
  originalWorkflowName:EXACT_NAME,
  originalEvent:'workflow_run',
  headBranch:'main',repo:EXACT_REPO,
  sourceKind:'SAME_RUN_SOURCE_ONLY_AUDIT_ARTIFACT',
  canReplayReadOnlyPreview:true,
  canBackdateMarketDecision:false,canSelect:false,
  pitA:false,pitB:false,frozen:false,orders:false,push:false
 });
}
