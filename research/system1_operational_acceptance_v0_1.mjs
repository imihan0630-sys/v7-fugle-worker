import {createHash} from "node:crypto";

const DATE=/^\d{4}-\d{2}-\d{2}$/;
const SHA40=/^[0-9a-f]{40}$/i;
const SHA64=/^[0-9a-f]{64}$/i;
const EXPECTED_SCHEDULE="10 16 * * 1-5";

const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==="object"
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash("sha256").update(JSON.stringify(canonical(x))).digest("hex");

export function previousTaipeiCalendarDate(now=new Date()){
  const t=now instanceof Date?now:new Date(now);
  if(!Number.isFinite(t.getTime())) throw new Error("OPERATIONAL_ACCEPTANCE_CLOCK_INVALID");
  return new Intl.DateTimeFormat("en-CA",{
    timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"
  }).format(new Date(t.getTime()-86400000));
}
function block(blockers,code,detail=null){
  blockers.push({code,detail:detail===undefined?null:detail});
}
function safetyOk(x){
  return x?.researchOnly===true&&x?.decisionImpact===false&&x?.formalCoreImpact===false&&
    x?.noPlanChanges===true&&x?.noTrade===true&&x?.noPush===true;
}
function runtimeAtLeast820(v){
  const m=String(v||"").match(/^(\d+)\.(\d+)\.(\d+)/);
  return !!m&&(Number(m[1])>8||(Number(m[1])===8&&Number(m[2])>=20));
}
function validationOf(artifact){return artifact?.validation&&typeof artifact.validation==="object"?artifact.validation:null;}

export function buildSystem1OperationalBlocker({
  trigger,observedAt,code="UPSTREAM_ARTIFACT_MISSING",detail=null,upstreamReadiness=null
}={}){
  const now=new Date(observedAt||new Date());
  const observedMs=now.getTime();
  const expectedDate=Number.isFinite(observedMs)?previousTaipeiCalendarDate(now):null;
  const normalizedCode=String(code||"UPSTREAM_ARTIFACT_MISSING");
  const core={
    schemaVersion:"SYSTEM1_OPERATIONAL_ACCEPTANCE_V0_1",
    status:"BLOCKED",genuineProspective:false,
    scanDate:upstreamReadiness?.formalScanDate||upstreamReadiness?.scanDate||null,
    expectedScanDate:expectedDate,generationId:null,
    sourceMainSha:null,runtimeVersion:upstreamReadiness?.runtimeVersion||null,
    bindingId:null,formalDecisionReceiptId:null,populationN:null,formalSelectedN:null,
    h1h5States:{},
    trigger:{eventName:trigger?.eventName??null,schedule:trigger?.schedule??null},
    observedAt:Number.isFinite(observedMs)?now.toISOString():null,
    blockers:[{code:normalizedCode,detail:detail??null}],
    firstBlocker:normalizedCode,
    zeroPickAllowedWhenFullyVerified:true,
    historicalBackfillPerformed:false,
    manualReplayCanNeverBecomeGenuineProspective:true,
    t1PendingDoesNotBlockOperationalRecovery:true,
    operationalRecoveryOnly:true,
    formalOptimizationCandidate:"NONE",autoSwitchAuthorized:false,
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true
  };
  return {...core,receiptDigest:hash(core)};
}

export function buildSystem1OperationalAcceptance({
  trigger,observedAt,c1,c2,inventory,binding,h1h5
}={}){
  const blockers=[];
  const now=new Date(observedAt||new Date());
  if(!Number.isFinite(now.getTime())) block(blockers,"OBSERVATION_CLOCK_INVALID");
  const expectedDate=Number.isFinite(now.getTime())?previousTaipeiCalendarDate(now):null;

  if(trigger?.eventName!=="schedule") block(blockers,"SCHEDULED_COLLECTOR_REQUIRED",trigger?.eventName??null);
  if(trigger?.schedule!==EXPECTED_SCHEDULE) block(blockers,"EXPECTED_0010_TAIPEI_SCHEDULE_REQUIRED",trigger?.schedule??null);

  const c1Receipt=c1?.receipt||{};
  const scanDate=String(c1Receipt.sessionDate||"");
  const generationId=String(c1Receipt.generationId||"");
  if(!DATE.test(scanDate)) block(blockers,"C1_SESSION_DATE_INVALID",scanDate||null);
  if(expectedDate&&scanDate!==expectedDate) block(blockers,"NOT_PREVIOUS_TAIPEI_CALENDAR_DATE",{expectedDate,scanDate});
  if(c1?.schemaVersion!=="SYSTEM1_C1_EVIDENCE_ARTIFACT_V0_1") block(blockers,"C1_ARTIFACT_SCHEMA_MISMATCH");
  if(!SHA40.test(String(c1Receipt.sourceMainSha||""))) block(blockers,"C1_SOURCE_MAIN_SHA_INVALID");
  if(!SHA64.test(String(c1Receipt.contentDigest||""))||!SHA64.test(String(c1Receipt.universeDigest||"")))
    block(blockers,"C1_DIGEST_INVALID");
  if(c1Receipt.captureCompleteness!=="IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE") block(blockers,"C1_CAPTURE_INCOMPLETE");
  if(c1?.summary?.coverageComplete!==true||Number(c1?.summary?.populationN)!==Number(c1?.diagnosis?.populationN))
    block(blockers,"C1_DENOMINATOR_UNVERIFIED");
  if(c1?.scanProof?.scanDate!==scanDate||c1?.scanProof?.generationId!==generationId||
     c1?.scanProof?.pipelineComplete!==true||c1?.scanProof?.configVerified!==true||
     c1?.scanProof?.c1SaveVerified!==true) block(blockers,"FORMAL_C1_SCAN_PROOF_INVALID");
  if(!safetyOk(c1?.safety)) block(blockers,"C1_RESEARCH_FIREWALL_INVALID");

  if(c2?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||c2?.completeMatchedCohort!==true||
     c2?.formalCoreLocked!==true||!safetyOk(c2)) block(blockers,"C2_MATCHED_COHORT_INVALID");
  if(String(c2?.sessionDate||"")!==scanDate||String(c2?.generationId||"")!==generationId)
    block(blockers,"C1_C2_SESSION_IDENTITY_MISMATCH");
  if(String(c2?.sourceMainSha||"")!==String(c1Receipt.sourceMainSha||"")||
     String(c2?.sourceContentDigest||"")!==String(c1Receipt.contentDigest||"")||
     String(c2?.universeDigest||"")!==String(c1Receipt.universeDigest||"")||
     Number(c2?.tally?.populationN)!==Number(c1?.summary?.populationN))
    block(blockers,"C1_C2_PROVENANCE_MISMATCH");

  const inv=validationOf(inventory);
  if(inventory?.schemaVersion!=="SYSTEM1_C1_GENERATION_INVENTORY_V0_1"||inv?.status!=="VERIFIED")
    block(blockers,"C1_INVENTORY_NOT_VERIFIED");
  if(String(inv?.scanDate||"")!==scanDate||String(inv?.generationId||"")!==generationId)
    block(blockers,"C1_INVENTORY_SESSION_IDENTITY_MISMATCH");
  if(inv?.originKind!=="AFTER_MARKET_SCAN_PIPELINE") block(blockers,"AUTHORITATIVE_AFTER_MARKET_ORIGIN_REQUIRED",inv?.originKind??null);
  if(inv?.historicalBackfillPerformed!==false||inventory?.historicalBackfillPerformed!==false)
    block(blockers,"C1_INVENTORY_HISTORICAL_BACKFILL_FORBIDDEN");
  if(inv?.integrityComplete!==true||inv?.modernOriginCoverageComplete!==true||inventory?.truncated===true)
    block(blockers,"C1_INVENTORY_INTEGRITY_INVALID");
  if(String(inv?.runtimeVersion||"")!==String(c1Receipt.effectiveRuntimeVersion||"")||
     String(inv?.contentDigest||"")!==String(c1Receipt.contentDigest||"")||
     String(inv?.universeDigest||"")!==String(c1Receipt.universeDigest||"")||
     Number(inv?.populationN)!==Number(c1?.summary?.populationN))
    block(blockers,"C1_INVENTORY_PROVENANCE_MISMATCH");

  const bind=validationOf(binding);
  if(binding?.schemaVersion!=="SYSTEM1_FORMAL_C1_BINDING_V0_1"||bind?.status!=="VERIFIED")
    block(blockers,"FORMAL_C1_BINDING_NOT_VERIFIED");
  if(String(bind?.c1GenerationId||"")!==generationId||bind?.c1ScanOriginKind!=="AFTER_MARKET_SCAN_PIPELINE"||
     bind?.authoritativeParentSelection!=="EXPLICIT_BINDING_ONLY")
    block(blockers,"FORMAL_C1_BINDING_IDENTITY_INVALID");
  if(bind?.historicalBackfillPerformed!==false||binding?.historicalBackfillPerformed!==false)
    block(blockers,"FORMAL_C1_BINDING_HISTORICAL_BACKFILL_FORBIDDEN");
  if(binding?.latestHeuristicUsed!==false||binding?.inventoryOrdinalHeuristicUsed!==false||
     binding?.selectedSetEqualityInferenceUsed!==false)
    block(blockers,"FORMAL_C1_BINDING_INFERENCE_FORBIDDEN");
  if(!safetyOk(binding?.safety)&&!safetyOk(binding))
    block(blockers,"FORMAL_C1_BINDING_FIREWALL_INVALID");

  if(h1h5?.schemaVersion!=="SYSTEM1_H1_H5_PROSPECTIVE_READINESS_V0_1"||
     String(h1h5?.sessionDate||"")!==scanDate||String(h1h5?.generationId||"")!==generationId||
     Number(h1h5?.populationN)!==Number(c1?.summary?.populationN))
    block(blockers,"H1_H5_ARTIFACT_IDENTITY_INVALID");
  if(!Array.isArray(h1h5?.hypotheses)||h1h5.hypotheses.length!==5)
    block(blockers,"H1_H5_HYPOTHESIS_SET_INVALID");
  if(h1h5?.formalOptimizationCandidate!=="NONE"||h1h5?.autoSwitchAuthorized!==false||
     h1h5?.formalCoreLocked!==true||!safetyOk(h1h5))
    block(blockers,"H1_H5_RESEARCH_FIREWALL_INVALID");
  if(h1h5?.deferredT1?.zeroBeforeT1IsForbidden!==true)
    block(blockers,"T1_ZERO_BEFORE_OBSERVATION_GUARD_MISSING");

  const collectedAt=Date.parse(String(c1?.collectedAt||""));
  const decisionAt=Date.parse(String(c1Receipt.decisionAt||""));
  const observedMs=now.getTime();
  if(!Number.isFinite(decisionAt)||!Number.isFinite(collectedAt)) block(blockers,"EVIDENCE_CLOCK_INVALID");
  else {
    if(collectedAt<decisionAt) block(blockers,"EVIDENCE_PRECEDES_DECISION");
    if(collectedAt-decisionAt>8*3600_000) block(blockers,"EVIDENCE_COLLECTION_WINDOW_TOO_LATE");
    if(Number.isFinite(observedMs)&&Math.abs(observedMs-collectedAt)>12*3600_000)
      block(blockers,"ACCEPTANCE_OBSERVATION_NOT_CONTEMPORANEOUS");
  }

  if(!runtimeAtLeast820(c1Receipt.effectiveRuntimeVersion)) block(blockers,"V820_OR_NEWER_RUNTIME_REQUIRED");
  const selectedN=Number(c1?.summary?.selectedN);
  if(!Number.isInteger(selectedN)||selectedN<0||selectedN>6) block(blockers,"FORMAL_SELECTED_COUNT_INVALID");
  if(Number(bind?.formalSelectedCount)!==selectedN) block(blockers,"FORMAL_SELECTED_COUNT_BINDING_MISMATCH");

  const status=blockers.length===0?"OPERATIONAL_RECOVERY_PASS":"BLOCKED";
  const core={
    schemaVersion:"SYSTEM1_OPERATIONAL_ACCEPTANCE_V0_1",
    status,genuineProspective:status==="OPERATIONAL_RECOVERY_PASS",
    scanDate:scanDate||null,expectedScanDate:expectedDate,generationId:generationId||null,
    sourceMainSha:c1Receipt.sourceMainSha||null,
    runtimeVersion:c1Receipt.effectiveRuntimeVersion||null,
    bindingId:bind?.bindingId||null,formalDecisionReceiptId:bind?.formalDecisionReceiptId||null,
    populationN:Number.isFinite(Number(c1?.summary?.populationN))?Number(c1.summary.populationN):null,
    formalSelectedN:Number.isInteger(selectedN)?selectedN:null,
    h1h5States:Array.isArray(h1h5?.hypotheses)?Object.fromEntries(h1h5.hypotheses.map(x=>[x.id,x.state])):{},
    trigger:{eventName:trigger?.eventName??null,schedule:trigger?.schedule??null},
    observedAt:Number.isFinite(observedMs)?now.toISOString():null,
    blockers,firstBlocker:blockers[0]?.code||null,
    zeroPickAllowedWhenFullyVerified:true,
    historicalBackfillPerformed:false,
    manualReplayCanNeverBecomeGenuineProspective:true,
    t1PendingDoesNotBlockOperationalRecovery:true,
    operationalRecoveryOnly:true,
    formalOptimizationCandidate:"NONE",autoSwitchAuthorized:false,
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true
  };
  return {...core,receiptDigest:hash(core)};
}
