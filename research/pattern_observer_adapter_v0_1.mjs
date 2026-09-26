import { createHash } from "node:crypto";

export const PATTERN_OBSERVER_ADAPTER_VERSION = "PATTERN_OBSERVER_ADAPTER_V0_1";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  }
  return value;
}

export function stableObserverHash(value) {
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

function blocked(reason, extra = {}) {
  return {
    status: "BLOCKED",
    reason,
    researchOnly: true,
    decisionImpact: false,
    ...extra
  };
}

export function buildPatternCacheRecord({
  parentReference,
  geometryEnvelope,
  rawExecutionEnvelope,
  detectorSnapshot,
  asOfDate,
  detectorVersion,
  semanticContractVersion = "CA_SEMANTIC_SPACES_V0_1"
} = {}) {
  if (!parentReference || parentReference.status !== "VALID") {
    return blocked("SHADOW_PARENT_REFERENCE_INVALID");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(asOfDate || ""))) {
    return blocked("AS_OF_DATE_INVALID", { shadowParentKey: parentReference.shadowParentKey });
  }
  if (!geometryEnvelope || geometryEnvelope.status !== "VALID" ||
      geometryEnvelope.semanticSpace !== "TECHNICAL_CONTINUITY") {
    return blocked("GEOMETRY_SERIES_NOT_READY", { shadowParentKey: parentReference.shadowParentKey });
  }
  if (!rawExecutionEnvelope || rawExecutionEnvelope.status !== "VALID" ||
      rawExecutionEnvelope.semanticSpace !== "RAW_EXECUTION") {
    return blocked("RAW_EXECUTION_SERIES_NOT_READY", { shadowParentKey: parentReference.shadowParentKey });
  }
  if (!detectorSnapshot || detectorSnapshot.status !== "VALID") {
    return blocked("DETECTOR_SNAPSHOT_NOT_READY", { shadowParentKey: parentReference.shadowParentKey });
  }
  if (detectorSnapshot.asOfDate && String(detectorSnapshot.asOfDate) !== String(asOfDate)) {
    return blocked("DETECTOR_ASOF_MISMATCH", { shadowParentKey: parentReference.shadowParentKey });
  }

  const record = {
    adapterVersion: PATTERN_OBSERVER_ADAPTER_VERSION,
    detectorVersion: String(detectorVersion || detectorSnapshot.detectorVersion || ""),
    semanticContractVersion,
    shadowParentKey: parentReference.shadowParentKey,
    parentSnapshotHash: parentReference.parentSnapshotHash,
    scanDate: parentReference.scanDate,
    symbol: parentReference.symbol,
    asOfDate: String(asOfDate),
    geometry: {
      semanticSpace: geometryEnvelope.semanticSpace,
      sourceId: geometryEnvelope.sourceId,
      payloadHash: geometryEnvelope.payloadHash
    },
    rawExecution: {
      semanticSpace: rawExecutionEnvelope.semanticSpace,
      sourceId: rawExecutionEnvelope.sourceId,
      payloadHash: rawExecutionEnvelope.payloadHash
    },
    detectorSnapshotHash: detectorSnapshot.snapshotHash || stableObserverHash(detectorSnapshot),
    patternState: detectorSnapshot,
    researchOnly: true,
    decisionImpact: false,
    formalCoreImpact: false
  };
  return {
    ...record,
    status: "VALID",
    recordHash: stableObserverHash(record)
  };
}

export function comparePatternCacheRecords(a, b) {
  if (!a || !b || a.status !== "VALID" || b.status !== "VALID") {
    return blocked("CACHE_RECORD_INVALID");
  }
  if (a.shadowParentKey !== b.shadowParentKey || a.asOfDate !== b.asOfDate) {
    return {
      status: "DIFFERENT_RECORD_IDENTITY",
      sameIdentity: false,
      provenanceConflict: false,
      researchOnly: true,
      decisionImpact: false
    };
  }
  const sameParent = a.parentSnapshotHash === b.parentSnapshotHash;
  const sameGeometry = a.geometry?.payloadHash === b.geometry?.payloadHash;
  const sameRaw = a.rawExecution?.payloadHash === b.rawExecution?.payloadHash;
  const sameDetector = a.detectorSnapshotHash === b.detectorSnapshotHash;
  const exact = sameParent && sameGeometry && sameRaw && sameDetector;
  return {
    status: exact ? "SAME_RECORD_EXACT" : "PROVENANCE_CONFLICT",
    sameIdentity: true,
    sameParent,
    sameGeometry,
    sameRaw,
    sameDetector,
    provenanceConflict: !exact,
    researchOnly: true,
    decisionImpact: false
  };
}

export function buildPatternObservability(records = []) {
  const rows = Array.isArray(records) ? records : [];
  const valid = rows.filter(x => x?.status === "VALID");
  const blockedRows = rows.filter(x => x?.status === "BLOCKED");
  const blockedReasons = {};
  for (const row of blockedRows) {
    const key = String(row?.reason || "UNKNOWN");
    blockedReasons[key] = (blockedReasons[key] || 0) + 1;
  }

  const boolRate = (field) => {
    const known = valid.filter(x => typeof x?.[field] === "boolean");
    if (!known.length) return null;
    return known.filter(x => x[field] === true).length / known.length;
  };

  const numericMedian = (field) => {
    const values = valid.map(x => Number(x?.[field])).filter(Number.isFinite).sort((a,b)=>a-b);
    if (!values.length) return null;
    const m = Math.floor(values.length / 2);
    return values.length % 2 ? values[m] : (values[m-1] + values[m]) / 2;
  };

  return {
    observabilityVersion: "PATTERN_OBSERVABILITY_V0_1",
    totalRecords: rows.length,
    validRecords: valid.length,
    blockedRecords: blockedRows.length,
    coverageRate: rows.length ? valid.length / rows.length : null,
    blockedReasons,
    prefixExactRate: boolRate("prefixExact"),
    replayExactRate: boolRate("replayExact"),
    scaleAgreementMedian: numericMedian("scaleAgreement"),
    computeMsMedian: numericMedian("computeMs"),
    researchOnly: true,
    decisionImpact: false,
    formalCoreImpact: false
  };
}

export function attachPatternQaMetrics(record, {
  prefixExact = null,
  replayExact = null,
  scaleAgreement = null,
  computeMs = null
} = {}) {
  if (!record || record.status !== "VALID") return blocked("CACHE_RECORD_INVALID");
  const out = {
    ...record,
    prefixExact: typeof prefixExact === "boolean" ? prefixExact : null,
    replayExact: typeof replayExact === "boolean" ? replayExact : null,
    scaleAgreement: Number.isFinite(Number(scaleAgreement)) ? Number(scaleAgreement) : null,
    computeMs: Number.isFinite(Number(computeMs)) ? Number(computeMs) : null
  };
  return { ...out, qaHash: stableObserverHash(out) };
}


export function buildPatternEpisodeReference({
  symbol,
  detectorVersion,
  semanticContractVersion = "CA_SEMANTIC_SPACES_V0_1",
  patternFamily,
  scale = "BASE",
  anchorIds,
  initialConfirmedAt
} = {}) {
  const stock=String(symbol||"");
  const detector=String(detectorVersion||"");
  const family=String(patternFamily||"");
  const normalizedScale=String(scale||"");
  const confirmed=String(initialConfirmedAt||"");
  const anchors=(Array.isArray(anchorIds)?anchorIds:[]).map(x=>String(x||"")).filter(Boolean);
  if(!stock || !detector || !family || !normalizedScale || !/^\d{4}-\d{2}-\d{2}$/.test(confirmed) || anchors.length===0){
    return blocked("EPISODE_IDENTITY_INCOMPLETE");
  }
  const identity={
    symbol:stock,
    detectorVersion:detector,
    semanticContractVersion:String(semanticContractVersion||""),
    patternFamily:family,
    scale:normalizedScale,
    anchorIds:anchors,
    initialConfirmedAt:confirmed
  };
  return {
    status:"VALID",
    ...identity,
    episodeKey:stableObserverHash(identity),
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}

export function comparePatternEpisodeReferences(a,b){
  if(!a || !b || a.status!=="VALID" || b.status!=="VALID") return blocked("EPISODE_REFERENCE_INVALID");
  const same=a.episodeKey===b.episodeKey;
  return {
    status:same?"SAME_EPISODE":"DIFFERENT_EPISODE",
    sameEpisode:same,
    anchorChanged:stableObserverHash(a.anchorIds)!==stableObserverHash(b.anchorIds),
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}

export function buildPatternRunReceipt({
  runId,
  scanDate,
  detectorVersion,
  expectedParentKeys,
  attempts,
  prefixChecks = [],
  replayChecks = []
} = {}) {
  const expected=[...new Set((Array.isArray(expectedParentKeys)?expectedParentKeys:[]).map(x=>String(x||"")).filter(Boolean))].sort();
  const rows=Array.isArray(attempts)?attempts:[];
  const byKey=new Map();
  const duplicateParentKeys=[];
  const unexpectedParentKeys=[];
  let blockedWithoutReason=0;
  let provenanceConflictCount=0;

  for(const row of rows){
    const key=String(row?.shadowParentKey||"");
    if(!key){ unexpectedParentKeys.push("<MISSING_KEY>"); continue; }
    if(byKey.has(key)){ duplicateParentKeys.push(key); continue; }
    byKey.set(key,row);
    if(!expected.includes(key)) unexpectedParentKeys.push(key);
    if(row?.status==="BLOCKED" && !String(row?.reason||"")) blockedWithoutReason+=1;
    if(row?.status==="PROVENANCE_CONFLICT" || row?.provenanceConflict===true) provenanceConflictCount+=1;
  }

  const missingParentKeys=expected.filter(k=>!byKey.has(k));
  const expectedAttempts=expected.map(k=>byKey.get(k)).filter(Boolean);
  const validCount=expectedAttempts.filter(x=>x?.status==="VALID").length;
  const blockedCount=expectedAttempts.filter(x=>x?.status==="BLOCKED").length;
  const unknownStatusCount=expectedAttempts.length-validCount-blockedCount;

  const prefix=Array.isArray(prefixChecks)?prefixChecks:[];
  const replay=Array.isArray(replayChecks)?replayChecks:[];
  const prefixFailures=prefix.filter(x=>x!==true).length;
  const replayFailures=replay.filter(x=>x!==true).length;

  const correctnessFailure=
    duplicateParentKeys.length>0 ||
    unexpectedParentKeys.length>0 ||
    blockedWithoutReason>0 ||
    provenanceConflictCount>0 ||
    unknownStatusCount>0 ||
    prefixFailures>0 ||
    replayFailures>0;

  const incomplete=missingParentKeys.length>0;
  const status=correctnessFailure?"QA_FAIL":incomplete?"INCOMPLETE":"COMPLETE";

  return {
    receiptVersion:"PATTERN_RUN_RECEIPT_V0_1",
    runId:String(runId||""),
    scanDate:String(scanDate||""),
    detectorVersion:String(detectorVersion||""),
    expectedParentCount:expected.length,
    attemptedParentCount:expectedAttempts.length,
    validCount,
    blockedCount,
    missingCount:missingParentKeys.length,
    attemptCoverageRate:expected.length?expectedAttempts.length/expected.length:null,
    missingParentKeys,
    duplicateParentKeys:[...new Set(duplicateParentKeys)].sort(),
    unexpectedParentKeys:[...new Set(unexpectedParentKeys)].sort(),
    blockedWithoutReason,
    provenanceConflictCount,
    prefixExactChecked:prefix.length,
    prefixExactFailures:prefixFailures,
    replayExactChecked:replay.length,
    replayExactFailures:replayFailures,
    status,
    outcomeJoinEligible:status==="COMPLETE",
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}


export function analyzePatternEpisodeOverlap(episodes = []) {
  const rows=(Array.isArray(episodes)?episodes:[])
    .filter(x=>x?.status==="VALID"&&Array.isArray(x.anchorIds)&&x.anchorIds.length>0)
    .map(x=>({
      episodeKey:String(x.episodeKey||""),
      patternFamily:String(x.patternFamily||""),
      scale:String(x.scale||""),
      anchorIds:[...new Set(x.anchorIds.map(v=>String(v||"")).filter(Boolean))].sort()
    }))
    .filter(x=>x.episodeKey);

  const pairs=[];
  for(let i=0;i<rows.length;i+=1){
    for(let j=i+1;j<rows.length;j+=1){
      const a=rows[i],b=rows[j];
      const A=new Set(a.anchorIds),B=new Set(b.anchorIds);
      const shared=[...A].filter(x=>B.has(x)).sort();
      const union=new Set([...A,...B]);
      const jaccard=union.size?shared.length/union.size:null;
      const containmentA=A.size?shared.length/A.size:null;
      const containmentB=B.size?shared.length/B.size:null;
      pairs.push({
        episodeKeyA:a.episodeKey,
        episodeKeyB:b.episodeKey,
        familyA:a.patternFamily,
        familyB:b.patternFamily,
        scaleA:a.scale,
        scaleB:b.scale,
        sharedAnchorCount:shared.length,
        unionAnchorCount:union.size,
        jaccard,
        containmentA,
        containmentB,
        sharedAnchorIds:shared,
        sameFamily:a.patternFamily===b.patternFamily,
        sameScale:a.scale===b.scale
      });
    }
  }

  return {
    status:"VALID",
    episodeCount:rows.length,
    pairCount:pairs.length,
    pairs,
    rule:"Overlap is descriptive shared-anchor geometry. No Jaccard/containment cutoff converts two labels into independent evidence.",
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}
