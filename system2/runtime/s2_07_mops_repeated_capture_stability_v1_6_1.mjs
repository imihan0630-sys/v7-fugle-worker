import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_MOPS_REPEATED_CAPTURE_STABILITY_VERSION_V1_6_1="1.6.1-RESEARCH";

const text=(v)=>v==null?"":String(v).trim();
const hash64=(v)=>/^[0-9a-f]{64}$/i.test(text(v));
const globalKey=(v)=>/^S2-MOPS-V:[0-9a-f]{64}$/i.test(text(v));
const uniqSorted=(xs)=>[...new Set(xs)].sort();

function iso(v,field){
  const s=text(v);
  if(!s||!Number.isFinite(Date.parse(s))) throw new Error(field+" must be ISO timestamp");
  return new Date(s).toISOString();
}

function captureIdentity(capture,index){
  if(!capture||typeof capture!=="object"||Array.isArray(capture)) throw new Error("capture["+index+"] is required");
  const capturedAt=iso(capture.capturedAt,"capture["+index+"].capturedAt");
  const scopeHash=text(capture.stableEventUniverseHash);
  if(!hash64(scopeHash)) throw new Error("capture["+index+"].stableEventUniverseHash invalid");
  const observations=Array.isArray(capture.observations)?capture.observations:[];
  return {capturedAt,scopeHash,observations,captureReady:capture.prospectiveExactVersionCaptureReady===true};
}

export async function reconcileMopsRepeatedCapturesV1_6_1({
  captures=[],
  requiredStableTailCount=3,
}={}){
  if(!Array.isArray(captures)||captures.length<2) throw new Error("at least two captures are required");
  if(!Number.isInteger(requiredStableTailCount)||requiredStableTailCount<2||requiredStableTailCount>20){
    throw new Error("requiredStableTailCount must be 2..20");
  }

  const blockers=[];
  const normalized=captures.map(captureIdentity).sort((a,b)=>Date.parse(a.capturedAt)-Date.parse(b.capturedAt));
  const captureTimes=normalized.map(x=>x.capturedAt);
  if(new Set(captureTimes).size!==captureTimes.length) blockers.push("DUPLICATE_CAPTURE_TIME");
  if(normalized.some(x=>x.captureReady!==true)) blockers.push("INPUT_CAPTURE_NOT_READY");

  const scopeHashes=uniqSorted(normalized.map(x=>x.scopeHash));
  if(scopeHashes.length!==1) blockers.push("STABLE_EVENT_UNIVERSE_HASH_MISMATCH");

  const perCapture=[];
  const globalPayloads=new Map();
  const globalEarliest=new Map();
  const globalLatest=new Map();
  const payloadConflictKeys=new Set();
  const invalidObservationKeys=[];

  normalized.forEach((capture,captureIndex)=>{
    const map=new Map();
    for(const obs of capture.observations){
      if(!obs||typeof obs!=="object"||Array.isArray(obs)) continue;
      const key=text(obs.versionKey);
      const payload=text(obs.versionPayloadHash);
      const firstObservedAt=text(obs.firstObservedAt??obs.firstObservedAvailableAt??obs.observedAt);
      if(!globalKey(key)||!hash64(payload)||!firstObservedAt||!Number.isFinite(Date.parse(firstObservedAt))){
        invalidObservationKeys.push(key||"__MISSING__");
        continue;
      }
      const observedIso=new Date(firstObservedAt).toISOString();
      if(Date.parse(observedIso)>Date.parse(capture.capturedAt)){
        invalidObservationKeys.push(key);
        continue;
      }
      const previous=map.get(key);
      if(previous&&previous.versionPayloadHash!==payload) payloadConflictKeys.add(key);
      if(!previous||Date.parse(observedIso)<Date.parse(previous.firstObservedAt)){
        map.set(key,{
          versionKey:key,
          versionPayloadHash:payload,
          firstObservedAt:observedIso,
          stockCode:text(obs.stockCode)||null,
          sourceReportedAt:text(obs.sourceReportedAt)||null,
        });
      }

      if(globalPayloads.has(key)&&globalPayloads.get(key)!==payload) payloadConflictKeys.add(key);
      else globalPayloads.set(key,payload);

      const earliest=globalEarliest.get(key);
      if(!earliest||Date.parse(observedIso)<Date.parse(earliest)) globalEarliest.set(key,observedIso);
      const latest=globalLatest.get(key);
      if(!latest||Date.parse(observedIso)>Date.parse(latest)) globalLatest.set(key,observedIso);
    }

    const keys=[...map.keys()].sort();
    perCapture.push({
      captureIndex,
      capturedAt:capture.capturedAt,
      versionCount:keys.length,
      versionKeys:keys,
      map,
    });
  });

  if(invalidObservationKeys.length) blockers.push("INVALID_EXACT_VERSION_OBSERVATION");
  if(payloadConflictKeys.size) blockers.push("EXACT_VERSION_PAYLOAD_CONFLICT");

  const transitions=[];
  for(let i=1;i<perCapture.length;i+=1){
    const prev=new Set(perCapture[i-1].versionKeys);
    const cur=new Set(perCapture[i].versionKeys);
    const added=[...cur].filter(k=>!prev.has(k)).sort();
    const removed=[...prev].filter(k=>!cur.has(k)).sort();
    transitions.push({
      fromCapturedAt:perCapture[i-1].capturedAt,
      toCapturedAt:perCapture[i].capturedAt,
      fromVersionCount:prev.size,
      toVersionCount:cur.size,
      addedVersionCount:added.length,
      removedVersionCount:removed.length,
      membershipStable:added.length===0&&removed.length===0,
      addedVersionKeys:added,
      removedVersionKeys:removed,
    });
  }

  const allKeys=uniqSorted(perCapture.flatMap(x=>x.versionKeys));
  let intersection=perCapture[0].versionKeys.slice();
  for(let i=1;i<perCapture.length;i+=1){
    const set=new Set(perCapture[i].versionKeys);
    intersection=intersection.filter(k=>set.has(k));
  }
  intersection.sort();

  let stableTailCount=1;
  for(let i=transitions.length-1;i>=0;i-=1){
    if(transitions[i].membershipStable) stableTailCount+=1;
    else break;
  }
  const membershipDriftObserved=transitions.some(t=>!t.membershipStable);
  const requiredTailObserved=stableTailCount>=requiredStableTailCount;

  const unionObservations=allKeys.map(key=>{
    let example=null;
    for(const capture of perCapture){
      if(capture.map.has(key)){example=capture.map.get(key);break;}
    }
    const seenCaptureCount=perCapture.filter(c=>c.map.has(key)).length;
    return {
      versionKey:key,
      versionPayloadHash:globalPayloads.get(key)||null,
      stockCode:example?.stockCode||null,
      sourceReportedAt:example?.sourceReportedAt||null,
      earliestObservedAt:globalEarliest.get(key)||null,
      latestObservedAt:globalLatest.get(key)||null,
      seenCaptureCount,
      seenInEveryCapture:seenCaptureCount===perCapture.length,
    };
  });

  const identity={
    version:S2_07_MOPS_REPEATED_CAPTURE_STABILITY_VERSION_V1_6_1,
    stableEventUniverseHash:scopeHashes[0]||null,
    captureTimes,
    requiredStableTailCount,
    unionObservations:unionObservations.map(x=>({
      versionKey:x.versionKey,
      versionPayloadHash:x.versionPayloadHash,
      earliestObservedAt:x.earliestObservedAt,
      seenCaptureCount:x.seenCaptureCount,
    })),
  };
  const repeatedCaptureUnionHash=await sha256Hex(identity);
  const uniqueBlockers=[...new Set(blockers)];
  const reconciliationReady=uniqueBlockers.length===0;

  const state=!reconciliationReady
    ?"REPEATED_CAPTURE_RECONCILIATION_BLOCKED"
    : membershipDriftObserved
      ?"REPEATED_CAPTURE_MEMBERSHIP_DRIFT_OBSERVED"
      : requiredTailObserved
        ?"REPEATED_CAPTURE_TAIL_STABLE_COMPLETENESS_NOT_CERTIFIED"
        :"REPEATED_CAPTURE_PAIR_STABLE_MORE_CAPTURES_REQUIRED";

  return deepFreeze({
    schemaVersion:"S2_S2_07_MOPS_REPEATED_CAPTURE_STABILITY_V1_6_1",
    version:S2_07_MOPS_REPEATED_CAPTURE_STABILITY_VERSION_V1_6_1,
    state,
    blockers:uniqueBlockers,
    stableEventUniverseHash:scopeHashes.length===1?scopeHashes[0]:null,
    captureCount:perCapture.length,
    captureTimes:Object.freeze(captureTimes),
    perCaptureVersionCounts:Object.freeze(perCapture.map(x=>x.versionCount)),
    transitionCount:transitions.length,
    transitions:Object.freeze(transitions.map(t=>deepFreeze(t))),
    unionVersionCount:allKeys.length,
    intersectionVersionCount:intersection.length,
    unionVersionKeys:Object.freeze(allKeys),
    intersectionVersionKeys:Object.freeze(intersection),
    unionObservations:Object.freeze(unionObservations.map(x=>deepFreeze(x))),
    payloadConflictCount:payloadConflictKeys.size,
    payloadConflictVersionKeys:Object.freeze([...payloadConflictKeys].sort()),
    invalidObservationCount:invalidObservationKeys.length,
    membershipDriftObserved,
    requiredStableTailCount,
    stableTailCount,
    requiredTailObserved,
    repeatedCaptureUnionHash,
    earliestObservedPreservedByMin:true,
    laterCaptureMayNotOverwriteEarlierObservation:true,
    reconciliationReady,

    // Stability alone cannot prove source semantics or completeness.
    sourceSemanticsCertified:false,
    monthShardCoverageComplete:false,
    expectedMopsKeysetComplete:false,
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
