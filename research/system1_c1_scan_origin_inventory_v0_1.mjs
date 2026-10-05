import {canonicalJcsJson} from './canonical_receipt_hash_v0_1.mjs';

export const C1_SCAN_ORIGIN_SCHEMA='SYSTEM1_C1_SCAN_ORIGIN_V0_1';
export const C1_GENERATION_INVENTORY_SCHEMA='SYSTEM1_C1_GENERATION_INVENTORY_V0_1';
export const C1_SCAN_ORIGIN_KINDS=Object.freeze([
  'CLOUDFLARE_CRON',
  'AUTHORIZED_MANUAL_API',
  'TEST_FINALIZE',
  'READ_ONLY_DRY_RUN',
  'INTERNAL_UNCLASSIFIED'
]);

const assert=(v,reason)=>{if(!v)throw Error('C1_SCAN_ORIGIN_'+reason);};
const instant=v=>{
  if(v===null||v===undefined)return null;
  const ms=Date.parse(String(v));
  assert(Number.isFinite(ms),'INVALID_INSTANT');
  return new Date(ms).toISOString();
};
const dateOnly=v=>{
  const s=String(v||'');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(s),'INVALID_DATE');
  return s;
};

export function buildC1ScanOriginContext(input={}) {
  const originKind=String(input.originKind||'INTERNAL_UNCLASSIFIED');
  assert(C1_SCAN_ORIGIN_KINDS.includes(originKind),'INVALID_KIND');
  const scanAttemptId=String(input.scanAttemptId||'');
  assert(/^C1SCAN:[0-9]{4}-[0-9]{2}-[0-9]{2}:[A-Za-z0-9-]{8,}$/.test(scanAttemptId),'INVALID_ATTEMPT_ID');
  const requestedDate=dateOnly(input.requestedDate);
  const invokedAt=instant(input.invokedAt);
  assert(invokedAt,'MISSING_INVOKED_AT');
  const scheduledAt=instant(input.scheduledAt);
  return Object.freeze({
    schemaVersion:C1_SCAN_ORIGIN_SCHEMA,
    state:'CAPTURED',
    originKind,
    scanAttemptId,
    requestedDate,
    invokedAt,
    scheduledAt,
    cronExpression:input.cronExpression===null||input.cronExpression===undefined?null:String(input.cronExpression),
    onlyIfMissing:input.onlyIfMissing===true,
    testMode:input.testMode===true,
    semantics:'ENTRYPOINT_CAPTURED_NO_RETROACTIVE_INFERENCE'
  });
}

export function attachC1ScanOrigin(receipt,context) {
  assert(receipt&&Array.isArray(receipt.rows)&&receipt.rows.length>0,'RECEIPT_REQUIRED');
  const hasEntrypointContext=Boolean(context);
  const suffix=String(receipt.generationId||'').split(':').pop()||'unclassified';
  const effectiveContext=context||buildC1ScanOriginContext({
    originKind:'INTERNAL_UNCLASSIFIED',
    scanAttemptId:`C1SCAN:${String(receipt.sessionDate)}:${suffix}`,
    requestedDate:String(receipt.sessionDate),
    invokedAt:String(receipt.decisionAt),
    scheduledAt:null,cronExpression:null,onlyIfMissing:false,testMode:false
  });
  assert(effectiveContext&&effectiveContext.schemaVersion===C1_SCAN_ORIGIN_SCHEMA&&effectiveContext.state==='CAPTURED','CONTEXT_REQUIRED');
  if(hasEntrypointContext) assert(Date.parse(effectiveContext.invokedAt)<=Date.parse(receipt.decisionAt),'CLOCK_ORDER');
  const root=Object.freeze({
    ...effectiveContext,
    generationId:String(receipt.generationId),
    sessionDate:String(receipt.sessionDate),
    decisionAt:hasEntrypointContext?String(receipt.decisionAt):null,
    decisionAtBinding:hasEntrypointContext?'ENTRYPOINT_BOUND':'UNBOUND_INTERNAL_CALL'
  });
  const rows=receipt.rows.map((row,index)=>index===0?{...row,c1ScanOriginAnchor:root}:row);
  return {...receipt,scanOrigin:root,rows};
}

export function verifyC1ScanOrigin(receipt) {
  assert(receipt&&typeof receipt==='object','RECEIPT_REQUIRED');
  const runtime=String(receipt.effectiveRuntimeVersion||'');
  const isV819=/^8\.(?:19|[2-9][0-9])\./.test(runtime)||/^(?:9|[1-9][0-9])\./.test(runtime);
  if(!receipt.scanOrigin) {
    if(isV819) throw Error('C1_SCAN_ORIGIN_REQUIRED_FOR_V819_PLUS');
    return {ok:true,state:'LEGACY_ORIGIN_NOT_CAPTURED',originKind:null,scanAttemptId:null};
  }
  const root=receipt.scanOrigin;
  assert(root.schemaVersion===C1_SCAN_ORIGIN_SCHEMA&&root.state==='CAPTURED','INVALID_ROOT');
  assert(root.generationId===receipt.generationId&&root.sessionDate===receipt.sessionDate,'IDENTITY_MISMATCH');
  if(root.originKind==='INTERNAL_UNCLASSIFIED') {
    assert(root.decisionAt===null&&root.decisionAtBinding==='UNBOUND_INTERNAL_CALL','UNCLASSIFIED_BINDING_INVALID');
  } else {
    assert(root.decisionAt===receipt.decisionAt&&root.decisionAtBinding==='ENTRYPOINT_BOUND','IDENTITY_MISMATCH');
  }
  assert(C1_SCAN_ORIGIN_KINDS.includes(root.originKind),'INVALID_KIND');
  const anchor=receipt.rows?.[0]?.c1ScanOriginAnchor;
  assert(anchor,'ANCHOR_MISSING');
  assert(canonicalJcsJson(anchor)===canonicalJcsJson(root),'ANCHOR_MISMATCH');
  return {ok:true,state:'CAPTURED',originKind:root.originKind,scanAttemptId:root.scanAttemptId};
}

export function projectC1GenerationInventoryRecord(row) {
  const header=JSON.parse(String(row?.header_json||'{}'));
  const base={
    generationId:String(row?.generation_id||header.generationId||''),
    scanDate:String(row?.scan_date||header.sessionDate||''),
    decisionAt:String(row?.decision_at||header.decisionAt||''),
    capturedAt:String(row?.captured_at||header.capturedAt||''),
    sourceMainSha:row?.source_main_sha??header.sourceMainSha??null,
    runtimeVersion:String(row?.runtime_version||header.effectiveRuntimeVersion||''),
    universeScope:String(row?.universe_scope||header.universeScope||''),
    universeDigest:row?.universe_digest??header.universeDigest??null,
    contentDigest:row?.content_digest??header.contentDigest??null,
    populationN:Number(row?.population_n??header.populationN??0),
    capturedN:Number(row?.captured_n??header.capturedN??0),
    featureN:Number(row?.feature_n??header.featureN??0),
    chunkCount:Number(row?.chunk_count??header.chunkCount??0),
    completeness:String(row?.completeness||header.completeness||'UNKNOWN'),
    createdAt:String(row?.created_at||'')
  };
  if(header.scanOrigin) {
    const s=header.scanOrigin;
    return {...base,scanOriginState:'CAPTURED',scanOriginKind:s.originKind||null,scanAttemptId:s.scanAttemptId||null,
      originInvokedAt:s.invokedAt||null,originScheduledAt:s.scheduledAt||null,originCronExpression:s.cronExpression||null,
      originOnlyIfMissing:s.onlyIfMissing===true,originTestMode:s.testMode===true};
  }
  return {...base,scanOriginState:'LEGACY_ORIGIN_NOT_CAPTURED',scanOriginKind:null,scanAttemptId:null,
    originInvokedAt:null,originScheduledAt:null,originCronExpression:null,originOnlyIfMissing:null,originTestMode:null};
}
