import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_MOPS_INCREMENTAL_UNION_VERSION_V1_7_1 = "1.7.1-RESEARCH";

const text=(v)=>v==null?"":String(v).trim();
const hash64=(v)=>/^[0-9a-f]{64}$/i.test(text(v));
const versionKeyOk=(v)=>/^S2-MOPS-V:[0-9a-f]{64}$/i.test(text(v));
const uniqueSorted=(xs)=>[...new Set(xs)].sort();

function iso(v,field){
  const s=text(v);
  if(!s||!Number.isFinite(Date.parse(s))) throw new Error(field+" must be ISO timestamp");
  return new Date(s).toISOString();
}
function queryPathClass(ref){
  const last=text(ref).split("|").at(-1)?.trim()||"";
  if(!last) return "UNKNOWN";
  if(last.toLowerCase()==="all") return "ANNUAL";
  if(/^\d{1,2}$/.test(last)) return "MONTH";
  return "OTHER";
}
function transition(priorKeys,currentKeys){
  const A=new Set(priorKeys),B=new Set(currentKeys);
  const added=[...B].filter(k=>!A.has(k)).sort();
  const lost=[...A].filter(k=>!B.has(k)).sort();
  const common=[...A].filter(k=>B.has(k)).sort();
  const union=new Set([...A,...B]).size;
  return {
    added,lost,commonCount:common.length,
    addedCount:added.length,lostCount:lost.length,
    jaccard:union?common.length/union:1,
    identical:added.length===0&&lost.length===0,
  };
}

export async function extendMopsAppendOnlyUnionV1_7_1({
  seedReceipt,
  freshCapture,
  requiredStableEventUniverseHash=null,
  minCaptureCount=4,
  trailingIdenticalTransitionRequirement=2,
}={}){
  if(!seedReceipt||typeof seedReceipt!=="object") throw new Error("seedReceipt is required");
  if(!Array.isArray(seedReceipt.versions)||!Array.isArray(seedReceipt.captures)) throw new Error("seedReceipt must contain versions and captures");
  const captureReceipt=freshCapture?.receipt||freshCapture;
  if(!captureReceipt||typeof captureReceipt!=="object") throw new Error("freshCapture receipt is required");
  const capturedAt=iso(captureReceipt.capturedAt,"freshCapture.capturedAt");
  const stableEventUniverseHash=text(captureReceipt.stableEventUniverseHash);
  if(!hash64(stableEventUniverseHash)) throw new Error("freshCapture stableEventUniverseHash invalid");
  const required=text(requiredStableEventUniverseHash||seedReceipt.stableEventUniverseHash);
  if(!hash64(required)) throw new Error("required stable event universe hash invalid");

  const blockers=[];
  if(text(seedReceipt.stableEventUniverseHash)!==required) blockers.push("SEED_STABLE_EVENT_UNIVERSE_HASH_MISMATCH");
  if(stableEventUniverseHash!==required) blockers.push("FRESH_STABLE_EVENT_UNIVERSE_HASH_MISMATCH");
  if(seedReceipt.earliestObservedPreserved!==true) blockers.push("SEED_EARLIEST_OBSERVED_NOT_CERTIFIED");
  if(seedReceipt.latestObservedPreserved!==true) blockers.push("SEED_LATEST_OBSERVED_NOT_CERTIFIED");
  if(Number(seedReceipt.payloadConflictCount||0)!==0) blockers.push("SEED_PAYLOAD_CONFLICT");

  const priorCaptureIds=seedReceipt.captures.map(c=>text(c.captureId)).filter(Boolean);
  const captureId=text(freshCapture?.captureId)
    || (freshCapture?.workflowRunId||freshCapture?.artifactId
      ? ["RUN",text(freshCapture?.workflowRunId)||"NA","ART",text(freshCapture?.artifactId)||"NA"].join(":")
      : "CAPTURE:"+capturedAt);
  if(priorCaptureIds.includes(captureId)) blockers.push("DUPLICATE_CAPTURE_ID");

  const obsRaw=Array.isArray(captureReceipt.observations)?captureReceipt.observations:[];
  const freshMap=new Map();
  for(const raw of obsRaw){
    const key=text(raw?.versionKey);
    const payload=text(raw?.versionPayloadHash||raw?.canonicalParsedRowHash);
    const observedAt=text(raw?.observedAt||raw?.firstObservedAt);
    if(!versionKeyOk(key)||!hash64(payload)||!Number.isFinite(Date.parse(observedAt))){
      blockers.push("FRESH_OBSERVATION_IDENTITY_INVALID");
      continue;
    }
    const normalized={
      versionKey:key,versionPayloadHash:payload,
      stockCode:text(raw?.stockCode)||null,
      sourceReportedAt:text(raw?.sourceReportedAt)||null,
      seqNo:text(raw?.seqNo)||null,
      sourceClockVersionKey:text(raw?.sourceClockVersionKey)||null,
      observedAt:new Date(observedAt).toISOString(),
      sourceQueryRef:text(raw?.sourceQueryRef)||null,
      queryPathClass:queryPathClass(raw?.sourceQueryRef),
    };
    const prior=freshMap.get(key);
    if(prior&&prior.versionPayloadHash!==payload) blockers.push("SAME_FRESH_CAPTURE_PAYLOAD_CONFLICT");
    if(!prior||Date.parse(normalized.observedAt)<Date.parse(prior.observedAt)) freshMap.set(key,normalized);
  }

  const versions=new Map();
  for(const row of seedReceipt.versions){
    const key=text(row?.versionKey);
    const payload=text(row?.versionPayloadHash);
    if(!versionKeyOk(key)||!hash64(payload)){
      blockers.push("SEED_VERSION_IDENTITY_INVALID");
      continue;
    }
    versions.set(key,{
      versionKey:key,
      versionPayloadHash:payload,
      stockCode:text(row.stockCode)||null,
      sourceReportedAt:text(row.sourceReportedAt)||null,
      seqNo:text(row.seqNo)||null,
      sourceClockVersionKey:text(row.sourceClockVersionKey)||null,
      firstObservedAt:iso(row.firstObservedAt,"seed firstObservedAt"),
      latestObservedAt:iso(row.latestObservedAt,"seed latestObservedAt"),
      observedCaptureIds:uniqueSorted(Array.isArray(row.observedCaptureIds)?row.observedCaptureIds.map(text).filter(Boolean):[]),
      absentCaptureIds:uniqueSorted(Array.isArray(row.absentCaptureIds)?row.absentCaptureIds.map(text).filter(Boolean):[]),
      observedQueryRefs:uniqueSorted(Array.isArray(row.observedQueryRefs)?row.observedQueryRefs.map(text).filter(Boolean):[]),
      observedQueryPathClasses:uniqueSorted(Array.isArray(row.observedQueryPathClasses)?row.observedQueryPathClasses.map(text).filter(Boolean):[]),
      observationCount:Number(row.observationCount||0),
    });
  }

  const freshKeys=[...freshMap.keys()].sort();
  const priorLatestKeys=seedReceipt.versions
    .filter(v=>v?.presentInLatestCapture===true)
    .map(v=>text(v.versionKey)).filter(Boolean).sort();
  if(!priorLatestKeys.length) blockers.push("SEED_LATEST_CAPTURE_KEYSET_UNAVAILABLE");

  for(const [key,obs] of freshMap){
    const existing=versions.get(key);
    if(existing){
      if(existing.versionPayloadHash!==obs.versionPayloadHash){
        blockers.push("CROSS_CAPTURE_PAYLOAD_CONFLICT");
        continue;
      }
      if(existing.stockCode&&obs.stockCode&&existing.stockCode!==obs.stockCode) blockers.push("CROSS_CAPTURE_STOCK_CODE_CONFLICT");
      if(existing.sourceReportedAt&&obs.sourceReportedAt&&existing.sourceReportedAt!==obs.sourceReportedAt) blockers.push("CROSS_CAPTURE_SOURCE_CLOCK_CONFLICT");
      existing.firstObservedAt=new Date(Math.min(Date.parse(existing.firstObservedAt),Date.parse(obs.observedAt))).toISOString();
      existing.latestObservedAt=new Date(Math.max(Date.parse(existing.latestObservedAt),Date.parse(obs.observedAt))).toISOString();
      existing.observedCaptureIds=uniqueSorted([...existing.observedCaptureIds,captureId]);
      existing.absentCaptureIds=existing.absentCaptureIds.filter(x=>x!==captureId);
      existing.observedQueryRefs=uniqueSorted([...existing.observedQueryRefs,...(obs.sourceQueryRef?[obs.sourceQueryRef]:[])]);
      existing.observedQueryPathClasses=uniqueSorted([...existing.observedQueryPathClasses,obs.queryPathClass]);
      existing.observationCount+=1;
    }else{
      versions.set(key,{
        versionKey:key,
        versionPayloadHash:obs.versionPayloadHash,
        stockCode:obs.stockCode,
        sourceReportedAt:obs.sourceReportedAt,
        seqNo:obs.seqNo,
        sourceClockVersionKey:obs.sourceClockVersionKey,
        firstObservedAt:obs.observedAt,
        latestObservedAt:obs.observedAt,
        observedCaptureIds:[captureId],
        absentCaptureIds:[...priorCaptureIds],
        observedQueryRefs:obs.sourceQueryRef?[obs.sourceQueryRef]:[],
        observedQueryPathClasses:[obs.queryPathClass],
        observationCount:1,
      });
    }
  }

  for(const [key,row] of versions){
    if(!freshMap.has(key)) row.absentCaptureIds=uniqueSorted([...row.absentCaptureIds,captureId]);
  }

  const currentTransition=transition(priorLatestKeys,freshKeys);
  const priorTransitions=Array.isArray(seedReceipt.pairwiseTransitions)?seedReceipt.pairwiseTransitions:[];
  const pairwiseTransitions=[...priorTransitions,{
    fromCaptureId:text(seedReceipt.captures.at(-1)?.captureId)||"SEED_LATEST",
    toCaptureId:captureId,
    ...currentTransition,
  }];
  const priorTrailing=Number(seedReceipt.trailingIdenticalTransitions||0);
  const trailingIdenticalTransitions=currentTransition.identical?priorTrailing+1:0;

  const captureCount=Number(seedReceipt.captureCount||seedReceipt.captures.length)+1;
  const unionRows=[...versions.values()].map(row=>({
    ...row,
    observedCaptureIds:uniqueSorted(row.observedCaptureIds),
    absentCaptureIds:uniqueSorted(row.absentCaptureIds),
    observedQueryRefs:uniqueSorted(row.observedQueryRefs),
    observedQueryPathClasses:uniqueSorted(row.observedQueryPathClasses),
    presentInLatestCapture:row.observedCaptureIds.includes(captureId),
    absenceMeansNonexistence:false,
  })).sort((a,b)=>a.versionKey.localeCompare(b.versionKey));

  const payloadConflictCount=blockers.filter(b=>/PAYLOAD_CONFLICT/.test(b)).length;
  const structuralReady=blockers.length===0;
  const boundedStabilizationCandidate=
    structuralReady
    && captureCount>=minCaptureCount
    && trailingIdenticalTransitions>=trailingIdenticalTransitionRequirement;

  const unionMissingFromLatest=unionRows.filter(r=>!r.presentInLatestCapture).map(r=>r.versionKey);
  const monthOnlyDriftVersionKeys=unionRows
    .filter(r=>r.absentCaptureIds.length>0&&r.observedQueryPathClasses.length===1&&r.observedQueryPathClasses[0]==="MONTH")
    .map(r=>r.versionKey);

  const unionHash=await sha256Hex({
    version:S2_07_MOPS_INCREMENTAL_UNION_VERSION_V1_7_1,
    stableEventUniverseHash:required,
    versions:unionRows.map(r=>({
      versionKey:r.versionKey,versionPayloadHash:r.versionPayloadHash,
      firstObservedAt:r.firstObservedAt,latestObservedAt:r.latestObservedAt,
      observedCaptureIds:r.observedCaptureIds,absentCaptureIds:r.absentCaptureIds,
      observedQueryRefs:r.observedQueryRefs,
    })),
  });

  return deepFreeze({
    schemaVersion:"S2_S2_07_MOPS_INCREMENTAL_UNION_STABILITY_V1_7_1",
    version:S2_07_MOPS_INCREMENTAL_UNION_VERSION_V1_7_1,
    state:structuralReady
      ? boundedStabilizationCandidate
        ?"MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_CANDIDATE"
        :"MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_PENDING"
      :"MOPS_APPEND_ONLY_UNION_BLOCKED",
    blockers:uniqueSorted(blockers),
    seedUnionHash:text(seedReceipt.unionHash)||null,
    stableEventUniverseHash:required,
    captureCount,
    latestCaptureId:captureId,
    latestCaptureAt:capturedAt,
    unionVersionKeyCount:unionRows.length,
    latestCaptureVersionKeyCount:freshKeys.length,
    unionMissingFromLatestCount:unionMissingFromLatest.length,
    unionMissingFromLatestVersionKeys:deepFreeze(unionMissingFromLatest),
    pairwiseTransitions:deepFreeze(pairwiseTransitions),
    trailingIdenticalTransitions,
    boundedStabilizationCandidate,
    earliestObservedPreserved:unionRows.every(r=>Date.parse(r.firstObservedAt)<=Date.parse(r.latestObservedAt)),
    latestObservedPreserved:true,
    payloadConflictCount,
    monthOnlyDriftVersionCount:monthOnlyDriftVersionKeys.length,
    monthOnlyDriftVersionKeys:deepFreeze(monthOnlyDriftVersionKeys),
    absenceMeansNonexistence:false,
    appendOnlyUnion:true,
    unionHash,
    captures:deepFreeze([...seedReceipt.captures,{captureId,capturedAt,workflowRunId:freshCapture?.workflowRunId??null,artifactId:freshCapture?.artifactId??null,versionKeyCount:freshKeys.length}]),
    versions:deepFreeze(unionRows),
    stabilizationPolicy:deepFreeze({researchOnly:true,minCaptureCount,trailingIdenticalTransitionRequirement,automaticallyAuthorizesExpectedKeysetFreeze:false}),
    sourceSemanticsCertified:false,
    monthShardCoverageComplete:false,
    expectedMopsKeysetComplete:false,
    expectedMopsVersionKeys:deepFreeze([]),
    noRevisionGapThroughCut:false,
    noRevisionGapThroughCutCertified:false,
    preParentEvidenceCutReady:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    historyMutationPerformed:false,
    scheduleAdded:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
