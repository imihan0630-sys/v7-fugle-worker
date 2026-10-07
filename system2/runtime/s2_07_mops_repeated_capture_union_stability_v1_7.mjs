import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_MOPS_UNION_STABILITY_VERSION_V1_7 = "1.7-RESEARCH";

const text=(v)=>v==null?"":String(v).trim();
const hash64=(v)=>/^[0-9a-f]{64}$/i.test(text(v));
const versionKeyOk=(v)=>/^S2-MOPS-V:[0-9a-f]{64}$/i.test(text(v));
const uniqueSorted=(xs)=>[...new Set(xs)].sort();

function iso(v,field){
  const s=text(v);
  if(!s||!Number.isFinite(Date.parse(s))) throw new Error(field+" must be ISO timestamp");
  return new Date(s).toISOString();
}

function captureId(c,index){
  const explicit=text(c?.captureId);
  if(explicit) return explicit;
  const run=text(c?.workflowRunId);
  const artifact=text(c?.artifactId);
  if(run||artifact) return ["RUN",run||"NA","ART",artifact||"NA"].join(":");
  return "CAPTURE:"+String(index+1).padStart(3,"0");
}

function queryPathClass(sourceQueryRef){
  const ref=text(sourceQueryRef);
  if(!ref) return "UNKNOWN";
  const last=ref.split("|").at(-1)?.trim()||"";
  if(last.toLowerCase()==="all") return "ANNUAL";
  if(/^\d{1,2}$/.test(last)) return "MONTH";
  return "OTHER";
}

function pairwise(a,b){
  const A=new Set(a),B=new Set(b);
  const added=[...B].filter(k=>!A.has(k)).sort();
  const lost=[...A].filter(k=>!B.has(k)).sort();
  const common=[...A].filter(k=>B.has(k)).sort();
  const union=new Set([...A,...B]).size;
  return {
    added,
    lost,
    commonCount:common.length,
    addedCount:added.length,
    lostCount:lost.length,
    jaccard:union?common.length/union:1,
    identical:added.length===0&&lost.length===0,
  };
}

export async function buildMopsRepeatedCaptureUnionV1_7({
  captures=[],
  requiredStableEventUniverseHash=null,
  minCaptureCount=4,
  trailingIdenticalTransitionRequirement=2,
}={}){
  if(!Array.isArray(captures)||!captures.length) throw new Error("captures must be non-empty array");
  if(!Number.isInteger(minCaptureCount)||minCaptureCount<2) throw new Error("minCaptureCount must be >=2");
  if(!Number.isInteger(trailingIdenticalTransitionRequirement)||trailingIdenticalTransitionRequirement<1){
    throw new Error("trailingIdenticalTransitionRequirement must be >=1");
  }

  const blockers=[];
  const normalized=[];
  const universeHashes=new Set();

  for(let i=0;i<captures.length;i+=1){
    const c=captures[i]||{};
    const id=captureId(c,i);
    const capturedAt=iso(c.capturedAt||c.receipt?.capturedAt,"captures["+i+"].capturedAt");
    const stableEventUniverseHash=text(c.stableEventUniverseHash||c.receipt?.stableEventUniverseHash);
    if(!hash64(stableEventUniverseHash)) blockers.push("CAPTURE_STABLE_EVENT_UNIVERSE_HASH_INVALID");
    else universeHashes.add(stableEventUniverseHash);

    const observations=Array.isArray(c.observations)
      ? c.observations
      : Array.isArray(c.receipt?.observations)
        ? c.receipt.observations
        : [];

    const byKey=new Map();
    for(const raw of observations){
      const key=text(raw?.versionKey);
      const payload=text(raw?.versionPayloadHash||raw?.canonicalParsedRowHash);
      const observedAt=text(raw?.observedAt||raw?.firstObservedAt);
      if(!versionKeyOk(key)||!hash64(payload)||!Number.isFinite(Date.parse(observedAt))){
        blockers.push("CAPTURE_OBSERVATION_IDENTITY_INVALID");
        continue;
      }
      if(Date.parse(observedAt)>Date.parse(capturedAt)) blockers.push("OBSERVATION_AFTER_CAPTURE_CLOCK");
      const prior=byKey.get(key);
      if(prior&&prior.versionPayloadHash!==payload) blockers.push("SAME_CAPTURE_PAYLOAD_CONFLICT");
      if(!prior){
        byKey.set(key,{
          versionKey:key,
          versionPayloadHash:payload,
          stockCode:text(raw?.stockCode)||null,
          sourceReportedAt:text(raw?.sourceReportedAt)||null,
          seqNo:text(raw?.seqNo)||null,
          sourceClockVersionKey:text(raw?.sourceClockVersionKey)||null,
          observedAt:new Date(observedAt).toISOString(),
          sourceQueryRef:text(raw?.sourceQueryRef)||null,
          queryPathClass:queryPathClass(raw?.sourceQueryRef),
        });
      }
    }

    normalized.push({
      captureId:id,
      capturedAt,
      stableEventUniverseHash,
      workflowRunId:c.workflowRunId??null,
      artifactId:c.artifactId??null,
      keys:[...byKey.keys()].sort(),
      observations:[...byKey.values()].sort((a,b)=>a.versionKey.localeCompare(b.versionKey)),
    });
  }

  normalized.sort((a,b)=>Date.parse(a.capturedAt)-Date.parse(b.capturedAt)||a.captureId.localeCompare(b.captureId));

  if(requiredStableEventUniverseHash){
    const required=text(requiredStableEventUniverseHash);
    if(!hash64(required)) throw new Error("requiredStableEventUniverseHash must be 64-hex");
    if(normalized.some(c=>c.stableEventUniverseHash!==required)) blockers.push("STABLE_EVENT_UNIVERSE_HASH_MISMATCH");
  }else if(universeHashes.size!==1){
    blockers.push("STABLE_EVENT_UNIVERSE_HASH_MISMATCH");
  }

  const union=new Map();
  for(const capture of normalized){
    const present=new Set(capture.keys);
    for(const obs of capture.observations){
      const existing=union.get(obs.versionKey);
      if(existing&&existing.versionPayloadHash!==obs.versionPayloadHash){
        blockers.push("CROSS_CAPTURE_PAYLOAD_CONFLICT");
        continue;
      }
      if(!existing){
        union.set(obs.versionKey,{
          versionKey:obs.versionKey,
          versionPayloadHash:obs.versionPayloadHash,
          stockCode:obs.stockCode,
          sourceReportedAt:obs.sourceReportedAt,
          seqNo:obs.seqNo,
          sourceClockVersionKey:obs.sourceClockVersionKey,
          firstObservedAt:obs.observedAt,
          latestObservedAt:obs.observedAt,
          observedCaptureIds:[capture.captureId],
          observedQueryRefs:obs.sourceQueryRef?[obs.sourceQueryRef]:[],
          observedQueryPathClasses:[obs.queryPathClass],
          observationCount:1,
        });
      }else{
        if(existing.stockCode&&obs.stockCode&&existing.stockCode!==obs.stockCode) blockers.push("CROSS_CAPTURE_STOCK_CODE_CONFLICT");
        if(existing.sourceReportedAt&&obs.sourceReportedAt&&existing.sourceReportedAt!==obs.sourceReportedAt) blockers.push("CROSS_CAPTURE_SOURCE_CLOCK_CONFLICT");
        existing.firstObservedAt=new Date(Math.min(Date.parse(existing.firstObservedAt),Date.parse(obs.observedAt))).toISOString();
        existing.latestObservedAt=new Date(Math.max(Date.parse(existing.latestObservedAt),Date.parse(obs.observedAt))).toISOString();
        existing.observedCaptureIds=uniqueSorted([...existing.observedCaptureIds,capture.captureId]);
        existing.observedQueryRefs=uniqueSorted([...existing.observedQueryRefs,...(obs.sourceQueryRef?[obs.sourceQueryRef]:[])]);
        existing.observedQueryPathClasses=uniqueSorted([...existing.observedQueryPathClasses,obs.queryPathClass]);
        existing.observationCount+=1;
      }
    }

    for(const [key,item] of union.entries()){
      if(!present.has(key)){
        item.absentCaptureIds=uniqueSorted([...(item.absentCaptureIds||[]),capture.captureId]);
      }
    }
  }

  const pairwiseTransitions=[];
  for(let i=1;i<normalized.length;i+=1){
    const p=pairwise(normalized[i-1].keys,normalized[i].keys);
    pairwiseTransitions.push({
      fromCaptureId:normalized[i-1].captureId,
      toCaptureId:normalized[i].captureId,
      ...p,
    });
  }

  let trailingIdenticalTransitions=0;
  for(let i=pairwiseTransitions.length-1;i>=0;i-=1){
    if(pairwiseTransitions[i].identical) trailingIdenticalTransitions+=1;
    else break;
  }

  const unionRows=[...union.values()]
    .map(item=>({
      ...item,
      observedCaptureIds:uniqueSorted(item.observedCaptureIds||[]),
      absentCaptureIds:uniqueSorted(item.absentCaptureIds||[]),
      observedQueryRefs:uniqueSorted(item.observedQueryRefs||[]),
      observedQueryPathClasses:uniqueSorted(item.observedQueryPathClasses||[]),
      presentInLatestCapture:(item.observedCaptureIds||[]).includes(normalized.at(-1).captureId),
      absenceMeansNonexistence:false,
    }))
    .sort((a,b)=>a.versionKey.localeCompare(b.versionKey));

  const earliestObservedPreserved=unionRows.every(row=>{
    const observedTimes=[];
    for(const capture of normalized){
      const o=capture.observations.find(x=>x.versionKey===row.versionKey);
      if(o) observedTimes.push(Date.parse(o.observedAt));
    }
    return observedTimes.length>0 && Date.parse(row.firstObservedAt)===Math.min(...observedTimes);
  });

  const latestObservedPreserved=unionRows.every(row=>{
    const observedTimes=[];
    for(const capture of normalized){
      const o=capture.observations.find(x=>x.versionKey===row.versionKey);
      if(o) observedTimes.push(Date.parse(o.observedAt));
    }
    return observedTimes.length>0 && Date.parse(row.latestObservedAt)===Math.max(...observedTimes);
  });

  const unionKeyset=unionRows.map(x=>x.versionKey);
  const latestKeyset=normalized.at(-1).keys;
  const unionMissingFromLatest=unionKeyset.filter(k=>!new Set(latestKeyset).has(k));

  const monthOnlyDriftVersionKeys=unionRows
    .filter(r=>r.absentCaptureIds.length>0 && r.observedQueryPathClasses.length===1 && r.observedQueryPathClasses[0]==="MONTH")
    .map(r=>r.versionKey);

  const payloadConflictBlockers=blockers.filter(b=>/PAYLOAD_CONFLICT/.test(b));
  const structuralReady=
    blockers.length===0
    && earliestObservedPreserved
    && latestObservedPreserved;

  const boundedStabilizationCandidate=
    structuralReady
    && normalized.length>=minCaptureCount
    && trailingIdenticalTransitions>=trailingIdenticalTransitionRequirement;

  const unionHash=await sha256Hex({
    version:S2_07_MOPS_UNION_STABILITY_VERSION_V1_7,
    stableEventUniverseHash:normalized[0]?.stableEventUniverseHash||null,
    versions:unionRows.map(r=>({
      versionKey:r.versionKey,
      versionPayloadHash:r.versionPayloadHash,
      firstObservedAt:r.firstObservedAt,
      latestObservedAt:r.latestObservedAt,
      observedCaptureIds:r.observedCaptureIds,
      absentCaptureIds:r.absentCaptureIds,
      observedQueryRefs:r.observedQueryRefs,
    })),
  });

  return deepFreeze({
    schemaVersion:"S2_S2_07_MOPS_REPEATED_CAPTURE_UNION_STABILITY_V1_7",
    version:S2_07_MOPS_UNION_STABILITY_VERSION_V1_7,
    state:structuralReady
      ? boundedStabilizationCandidate
        ? "MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_CANDIDATE"
        : "MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_PENDING"
      : "MOPS_APPEND_ONLY_UNION_BLOCKED",
    blockers:uniqueSorted(blockers),
    captureCount:normalized.length,
    stableEventUniverseHash:normalized[0]?.stableEventUniverseHash||null,
    unionVersionKeyCount:unionRows.length,
    latestCaptureVersionKeyCount:latestKeyset.length,
    unionMissingFromLatestCount:unionMissingFromLatest.length,
    unionMissingFromLatestVersionKeys:deepFreeze(unionMissingFromLatest),
    pairwiseTransitions:deepFreeze(pairwiseTransitions),
    trailingIdenticalTransitions,
    stabilizationPolicy:deepFreeze({
      researchOnly:true,
      minCaptureCount,
      trailingIdenticalTransitionRequirement,
      automaticallyAuthorizesExpectedKeysetFreeze:false,
    }),
    boundedStabilizationCandidate,
    earliestObservedPreserved,
    latestObservedPreserved,
    payloadConflictCount:payloadConflictBlockers.length,
    monthOnlyDriftVersionCount:monthOnlyDriftVersionKeys.length,
    monthOnlyDriftVersionKeys:deepFreeze(monthOnlyDriftVersionKeys),
    absenceMeansNonexistence:false,
    appendOnlyUnion:true,
    unionHash,
    captures:deepFreeze(normalized.map(c=>({
      captureId:c.captureId,
      capturedAt:c.capturedAt,
      workflowRunId:c.workflowRunId,
      artifactId:c.artifactId,
      versionKeyCount:c.keys.length,
    }))),
    versions:deepFreeze(unionRows),

    // V1.7 repairs union/clock provenance only. It does not auto-promote
    // expected keyset completeness or downstream continuity authority.
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
