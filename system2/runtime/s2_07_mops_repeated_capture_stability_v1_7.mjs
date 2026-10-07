import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_MOPS_REPEATED_CAPTURE_STABILITY_VERSION_V1_7 = "1.7-RESEARCH";

const text=(v)=>v==null?"":String(v).trim();
const hash64=(v)=>/^[0-9a-f]{64}$/i.test(text(v));
const versionKeyOk=(v)=>/^S2-MOPS-V:[0-9a-f]{64}$/i.test(text(v));

function isoTimestamp(v,field){
  const s=text(v);
  if(!s||!Number.isFinite(Date.parse(s))) throw new Error(field+" must be ISO timestamp");
  return new Date(s).toISOString();
}

function normalizeCapture(input,index){
  if(!input||typeof input!=="object"||Array.isArray(input)) throw new Error("capture["+index+"] must be object");
  const receipt=input.receipt&&typeof input.receipt==="object"&&!Array.isArray(input.receipt)
    ?input.receipt:input;
  const capturedAt=isoTimestamp(receipt.capturedAt,"capture["+index+"].capturedAt");
  const stableEventUniverseHash=text(receipt.stableEventUniverseHash);
  if(!hash64(stableEventUniverseHash)) throw new Error("capture["+index+"].stableEventUniverseHash invalid");
  const observations=Array.isArray(receipt.observations)?receipt.observations:[];
  const queryDiagnostics=Array.isArray(input.queryDiagnostics)?input.queryDiagnostics:[];
  const diagnosticIdentityEvidence=[];
  for(const d of queryDiagnostics){
    const stockCode=text(d?.symbol);
    for(const [queryPath,keys] of [
      ["ANNUAL_ONLY",d?.yearOnlyVersionKeys],
      ["MONTH_ONLY",d?.monthOnlyVersionKeys],
    ]){
      for(const key of Array.isArray(keys)?keys:[]){
        diagnosticIdentityEvidence.push({
          versionKey:text(key),
          stockCode,
          sourceId:text(d?.sourceId)||null,
          family:text(d?.family)||null,
          queryPath,
        });
      }
    }
  }
  return {
    label:text(input.captureLabel||input.runId||input.workflowRunId||("CAPTURE_"+(index+1))),
    capturedAt,
    stableEventUniverseHash,
    prospectiveExactVersionCaptureReady:receipt.prospectiveExactVersionCaptureReady===true,
    coveredSymbolCount:Number(receipt.coveredSymbolCount||0),
    uniqueGlobalVersionKeyCount:Number(receipt.uniqueGlobalVersionKeyCount||observations.length),
    observations,
    diagnosticIdentityEvidence,
  };
}

function presencePattern(bits,sourceReportedAt,captureTimes){
  const first=bits.indexOf(true);
  const last=bits.lastIndexOf(true);
  if(first<0) return "NEVER_PRESENT";
  if(bits.every(Boolean)) return "STABLE_PRESENT_ALL_CAPTURES";

  let missingEarlierWhileSourceExisted=0;
  for(let i=0;i<first;i++){
    if(Date.parse(sourceReportedAt)<=Date.parse(captureTimes[i])) missingEarlierWhileSourceExisted+=1;
  }

  const post=bits.slice(first);
  const missingAfterFirst=post.filter(x=>!x).length;
  const reappeared=post.some((x,i)=>!x&&post.slice(i+1).some(Boolean));

  if(missingAfterFirst>0&&reappeared) return "INTERMITTENT_MEMBERSHIP";
  if(missingAfterFirst>0) return "DROPPED_FROM_LATER_CAPTURE";
  if(missingEarlierWhileSourceExisted>0) return "LATE_DISCOVERED_PREEXISTING";
  return "GENUINELY_LATER_SOURCE_VERSION";
}

export async function reconcileRepeatedMopsCapturesV1_7({
  captures=[],
  minimumCaptureCount=4,
  requiredTrailingZeroUnionGrowthCaptures=2,
}={}){
  if(!Array.isArray(captures)) throw new Error("captures must be array");
  if(!Number.isInteger(minimumCaptureCount)||minimumCaptureCount<2) throw new Error("minimumCaptureCount must be >=2");
  if(!Number.isInteger(requiredTrailingZeroUnionGrowthCaptures)||requiredTrailingZeroUnionGrowthCaptures<1){
    throw new Error("requiredTrailingZeroUnionGrowthCaptures must be >=1");
  }

  const blockers=[];
  const normalized=captures.map(normalizeCapture)
    .sort((a,b)=>Date.parse(a.capturedAt)-Date.parse(b.capturedAt));

  if(normalized.length<2) blockers.push("REPEATED_CAPTURE_COUNT_LT_2");
  for(let i=1;i<normalized.length;i++){
    if(Date.parse(normalized[i].capturedAt)<=Date.parse(normalized[i-1].capturedAt)){
      blockers.push("CAPTURE_TIME_NOT_STRICTLY_INCREASING");
      break;
    }
  }

  const universeHashes=[...new Set(normalized.map(c=>c.stableEventUniverseHash))];
  if(universeHashes.length!==1) blockers.push("STABLE_EVENT_UNIVERSE_HASH_MISMATCH");
  if(normalized.some(c=>c.prospectiveExactVersionCaptureReady!==true)) blockers.push("INPUT_CAPTURE_NOT_READY");
  if(normalized.some(c=>c.coveredSymbolCount!==23)) blockers.push("INPUT_CAPTURE_SYMBOL_COVERAGE_NOT_23");

  const captureSets=[];
  const union=new Map();
  const diagnosticIdentityMap=new Map();
  const payloadConflictKeys=new Set();
  const identityConflictKeys=new Set();
  const diagnosticIdentityConflictKeys=new Set();
  const captureDiagnostics=[];
  const cumulative=new Set();

  for(let ci=0;ci<normalized.length;ci++){
    const capture=normalized[ci];
    const set=new Set();
    const duplicateKeys=new Set();

    for(const obs of capture.observations){
      if(!obs||typeof obs!=="object"||obs.eligible!==true) continue;
      const key=text(obs.versionKey);
      const payload=text(obs.versionPayloadHash);
      const stockCode=text(obs.stockCode);
      const sourceReportedAt=text(obs.sourceReportedAt);
      const firstObservedAt=text(obs.firstObservedAt??obs.firstObservedAvailableAt??obs.observedAt);
      const seqNo=text(obs.seqNo);

      if(!versionKeyOk(key)||!hash64(payload)||!/^[1-9][0-9]{3}$/.test(stockCode)
        ||!sourceReportedAt||!Number.isFinite(Date.parse(sourceReportedAt))
        ||!firstObservedAt||!Number.isFinite(Date.parse(firstObservedAt))){
        blockers.push("MOPS_EXACT_VERSION_OBSERVATION_INVALID");
        continue;
      }
      if(Date.parse(firstObservedAt)>Date.parse(capture.capturedAt)) blockers.push("OBSERVATION_AFTER_CAPTURE_TIME");
      if(set.has(key)) duplicateKeys.add(key);
      set.add(key);

      let record=union.get(key);
      if(!record){
        record={
          versionKey:key,
          stockCode,
          sourceReportedAt:new Date(sourceReportedAt).toISOString(),
          seqNo:seqNo||null,
          versionPayloadHash:payload,
          earliestObservedAt:new Date(firstObservedAt).toISOString(),
          presenceCaptureIndexes:[],
          presenceCaptureLabels:[],
          observedAtByCapture:[],
        };
        union.set(key,record);
      }else{
        if(record.versionPayloadHash!==payload) payloadConflictKeys.add(key);
        if(record.stockCode!==stockCode
          ||record.sourceReportedAt!==new Date(sourceReportedAt).toISOString()
          ||text(record.seqNo)!==seqNo){
          identityConflictKeys.add(key);
        }
        if(Date.parse(firstObservedAt)<Date.parse(record.earliestObservedAt)){
          record.earliestObservedAt=new Date(firstObservedAt).toISOString();
        }
      }
      record.presenceCaptureIndexes.push(ci);
      record.presenceCaptureLabels.push(capture.label);
      record.observedAtByCapture.push({
        captureIndex:ci,
        captureLabel:capture.label,
        captureAt:capture.capturedAt,
        observedAt:new Date(firstObservedAt).toISOString(),
      });
    }

    for(const e of capture.diagnosticIdentityEvidence){
      if(!versionKeyOk(e.versionKey)||!/^[1-9][0-9]{3}$/.test(e.stockCode)){
        blockers.push("DIAGNOSTIC_VERSION_IDENTITY_INVALID");
        continue;
      }
      let record=diagnosticIdentityMap.get(e.versionKey);
      if(!record){
        record={
          versionKey:e.versionKey,
          stockCode:e.stockCode,
          evidence:[],
        };
        diagnosticIdentityMap.set(e.versionKey,record);
      }else if(record.stockCode!==e.stockCode){
        diagnosticIdentityConflictKeys.add(e.versionKey);
      }
      record.evidence.push({
        captureIndex:ci,
        captureLabel:capture.label,
        capturedAt:capture.capturedAt,
        queryPath:e.queryPath,
        sourceId:e.sourceId,
        family:e.family,
      });
    }

    if(duplicateKeys.size) blockers.push("DUPLICATE_VERSION_KEY_WITHIN_CAPTURE");
    if(set.size!==capture.uniqueGlobalVersionKeyCount) blockers.push("CAPTURE_VERSION_COUNT_MISMATCH");

    const priorUnion=new Set(cumulative);
    const newKeys=[...set].filter(k=>!priorUnion.has(k)).sort();
    const missingPriorUnion=[...priorUnion].filter(k=>!set.has(k)).sort();
    for(const k of set) cumulative.add(k);

    captureSets.push(set);
    captureDiagnostics.push({
      captureIndex:ci,
      captureLabel:capture.label,
      capturedAt:capture.capturedAt,
      observedVersionCount:set.size,
      unionVersionCountAfterCapture:cumulative.size,
      newVersionCount:newKeys.length,
      newVersionKeys:newKeys,
      missingPriorUnionVersionCount:missingPriorUnion.length,
      missingPriorUnionVersionKeys:missingPriorUnion,
    });
  }

  if(payloadConflictKeys.size) blockers.push("MOPS_VERSION_PAYLOAD_MUTATION_ACROSS_CAPTURES");
  if(identityConflictKeys.size) blockers.push("MOPS_VERSION_IDENTITY_CONFLICT_ACROSS_CAPTURES");
  if(diagnosticIdentityConflictKeys.size) blockers.push("DIAGNOSTIC_VERSION_STOCK_IDENTITY_CONFLICT");

  const unresolvedDiagnosticOnly=[...diagnosticIdentityMap.values()]
    .filter(record=>!union.has(record.versionKey))
    .sort((a,b)=>a.versionKey.localeCompare(b.versionKey));
  if(unresolvedDiagnosticOnly.length) blockers.push("DIAGNOSTIC_ONLY_VERSION_WITHOUT_EXACT_PAYLOAD_PROVENANCE");

  const captureTimes=normalized.map(c=>c.capturedAt);
  const versions=[...union.values()].map(record=>{
    const bits=normalized.map((_,i)=>record.presenceCaptureIndexes.includes(i));
    const pattern=presencePattern(bits,record.sourceReportedAt,captureTimes);
    let missingEarlierWhileSourceExisted=0;
    const firstIndex=bits.indexOf(true);
    for(let i=0;i<firstIndex;i++){
      if(Date.parse(record.sourceReportedAt)<=Date.parse(captureTimes[i])) missingEarlierWhileSourceExisted+=1;
    }
    const missingAfterFirstSeen=bits.slice(Math.max(firstIndex,0)).filter(x=>!x).length;
    const diagnosticEvidence=diagnosticIdentityMap.get(record.versionKey)?.evidence||[];
    const earliestIdentityObservedAt=[record.earliestObservedAt,...diagnosticEvidence.map(x=>x.capturedAt)]
      .filter(Boolean)
      .sort((a,b)=>Date.parse(a)-Date.parse(b))[0]||record.earliestObservedAt;
    return {
      ...record,
      earliestExactPayloadObservedAt:record.earliestObservedAt,
      earliestIdentityObservedAt,
      diagnosticIdentityEvidenceCount:diagnosticEvidence.length,
      diagnosticIdentityEvidence:diagnosticEvidence,
      presenceBits:bits.map(Boolean),
      presenceCount:bits.filter(Boolean).length,
      absenceCount:bits.filter(x=>!x).length,
      firstPresenceCaptureIndex:firstIndex,
      lastPresenceCaptureIndex:bits.lastIndexOf(true),
      missingEarlierWhileSourceExisted,
      missingAfterFirstSeen,
      membershipPattern:pattern,
    };
  }).sort((a,b)=>a.versionKey.localeCompare(b.versionKey));

  const patternCounts={};
  for(const v of versions) patternCounts[v.membershipPattern]=(patternCounts[v.membershipPattern]||0)+1;

  let trailingZeroUnionGrowthCaptureCount=0;
  for(let i=captureDiagnostics.length-1;i>=1;i--){
    if(captureDiagnostics[i].newVersionCount===0) trailingZeroUnionGrowthCaptureCount+=1;
    else break;
  }

  const latestPairMembershipStable=captureSets.length>=2
    && captureSets.at(-1).size===captureSets.at(-2).size
    && [...captureSets.at(-1)].every(k=>captureSets.at(-2).has(k));
  const allMembershipIdentical=captureSets.length>=2
    && captureSets.every(s=>s.size===captureSets[0].size&&[...s].every(k=>captureSets[0].has(k)));

  const lateDiscoveredPreexisting=versions.filter(v=>v.missingEarlierWhileSourceExisted>0);
  const disappearedAfterObservation=versions.filter(v=>v.missingAfterFirstSeen>0);
  const intermittent=versions.filter(v=>v.membershipPattern==="INTERMITTENT_MEMBERSHIP");

  const structuralBlockers=[...new Set(blockers)];
  const boundedRepeatedCaptureUnionStabilized=
    structuralBlockers.length===0
    && normalized.length>=minimumCaptureCount
    && trailingZeroUnionGrowthCaptureCount>=requiredTrailingZeroUnionGrowthCaptures;

  const unionIdentity={
    version:S2_07_MOPS_REPEATED_CAPTURE_STABILITY_VERSION_V1_7,
    stableEventUniverseHash:universeHashes.length===1?universeHashes[0]:null,
    versions:versions.map(v=>({
      versionKey:v.versionKey,
      stockCode:v.stockCode,
      sourceReportedAt:v.sourceReportedAt,
      seqNo:v.seqNo,
      versionPayloadHash:v.versionPayloadHash,
      earliestObservedAt:v.earliestObservedAt,
    })),
  };
  const immutableUnionHash=await sha256Hex(unionIdentity);

  return deepFreeze({
    schemaVersion:"S2_S2_07_MOPS_REPEATED_CAPTURE_STABILITY_V1_7",
    version:S2_07_MOPS_REPEATED_CAPTURE_STABILITY_VERSION_V1_7,
    state:structuralBlockers.length
      ?"REPEATED_CAPTURE_RECONCILIATION_BLOCKED"
      :boundedRepeatedCaptureUnionStabilized
        ?"REPEATED_CAPTURE_UNION_STABILIZED_SOURCE_SEMANTICS_PENDING"
        :"REPEATED_CAPTURE_UNION_GROWTH_NOT_YET_STABILIZED",
    blockers:structuralBlockers,
    captureCount:normalized.length,
    minimumCaptureCount,
    requiredTrailingZeroUnionGrowthCaptures,
    stableEventUniverseHash:universeHashes.length===1?universeHashes[0]:null,
    immutableUnionHash,
    unionVersionCount:versions.length,
    captureDiagnostics:deepFreeze(captureDiagnostics),
    trailingZeroUnionGrowthCaptureCount,
    boundedRepeatedCaptureUnionStabilized,
    latestPairMembershipStable,
    allMembershipIdentical,
    payloadMutationCount:payloadConflictKeys.size,
    payloadMutationVersionKeys:deepFreeze([...payloadConflictKeys].sort()),
    identityConflictCount:identityConflictKeys.size,
    identityConflictVersionKeys:deepFreeze([...identityConflictKeys].sort()),
    diagnosticIdentityConflictCount:diagnosticIdentityConflictKeys.size,
    diagnosticIdentityConflictVersionKeys:deepFreeze([...diagnosticIdentityConflictKeys].sort()),
    diagnosticObservedIdentityCount:diagnosticIdentityMap.size,
    unresolvedDiagnosticOnlyVersionCount:unresolvedDiagnosticOnly.length,
    unresolvedDiagnosticOnlyVersionKeys:deepFreeze(unresolvedDiagnosticOnly.map(x=>x.versionKey)),
    unresolvedDiagnosticOnlyEvidence:deepFreeze(unresolvedDiagnosticOnly),
    membershipPatternCounts:deepFreeze(patternCounts),
    lateDiscoveredPreexistingVersionCount:lateDiscoveredPreexisting.length,
    lateDiscoveredPreexistingVersionKeys:deepFreeze(lateDiscoveredPreexisting.map(v=>v.versionKey)),
    disappearedAfterObservationVersionCount:disappearedAfterObservation.length,
    disappearedAfterObservationVersionKeys:deepFreeze(disappearedAfterObservation.map(v=>v.versionKey)),
    intermittentMembershipVersionCount:intermittent.length,
    intermittentMembershipVersionKeys:deepFreeze(intermittent.map(v=>v.versionKey)),
    earliestObservedAtPreserved:true,
    unionVersions:deepFreeze(versions),

    // V1.7 stabilizes an immutable observed union only. It cannot by itself
    // promote the union to the complete expected MOPS population.
    sourceSemanticsCertified:false,
    expectedMopsKeysetComplete:false,
    expectedMopsVersionKeys:deepFreeze([]),
    candidateObservedUnionVersionKeys:deepFreeze(versions.map(v=>v.versionKey)),
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
