import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { mopsovSourceReportedAtV0_1 } from "./mopsov_source_reported_clock_v0_1.mjs";

export const S2_07_MOPS_EXACT_VERSION_POPULATION_VERSION_V1_6 = "1.6-RESEARCH";
export const S2_07_FROZEN_LOW_VOLUME_EVENT_COUNT_V1_6 = 23;
export const S2_07_FROZEN_LOW_VOLUME_UNIQUE_SYMBOL_COUNT_V1_6 = 23;

const EXPECTED_LANE_COUNTS = Object.freeze({
  "TWSE_CAPITAL_REDUCTION_REFERENCE": 9,
  "TWSE_PAR_VALUE_CHANGE_REFERENCE": 1,
  "TPEX_CAPITAL_REDUCTION_REFERENCE": 9,
  "TPEX_PAR_VALUE_CHANGE_REFERENCE": 4,
});

const text=(v)=>v==null?"":String(v).trim();
const hash64=(v)=>/^[0-9a-f]{64}$/i.test(text(v));
const uniqueSorted=(xs)=>[...new Set(xs)].sort();

function isoTimestamp(v,field){
  const s=text(v);
  if(!s||!Number.isFinite(Date.parse(s))) throw new Error(field+" must be ISO timestamp");
  return new Date(s).toISOString();
}

function canonicalParsedRow(stockCode,row){
  return {
    stockCode:text(stockCode),
    date:text(row?.date)||null,
    time:text(row?.time)||null,
    seqNo:text(row?.seqNo)||null,
    spokeDateRaw:text(row?.spokeDateRaw)||null,
    spokeTimeRaw:text(row?.spokeTimeRaw)||null,
    typek:text(row?.typek)||null,
    correctionOrCancellationHint:row?.correctionOrCancellationHint===true,
    rowText:text(row?.rowText)||null,
  };
}

export async function buildMopsExactVersionObservationV1_6({
  stockCode,
  row,
  observedAt,
  sourceUrl="https://mopsov.twse.com.tw/mops/web/ajax_t05st01",
  sourceQueryRef=null,
}={}){
  const symbol=text(stockCode);
  if(!/^[1-9][0-9]{3}$/.test(symbol)) throw new Error("stockCode must be ordinary four-digit equity symbol");
  if(!row||typeof row!=="object"||Array.isArray(row)) throw new Error("row is required");
  if(text(row.stockCode)&&text(row.stockCode)!==symbol) throw new Error("row stockCode mismatch");
  const observed=isoTimestamp(observedAt,"observedAt");
  const clock=mopsovSourceReportedAtV0_1(row);
  if(clock.eligible!==true){
    return deepFreeze({
      schemaVersion:"S2_S2_07_MOPS_EXACT_VERSION_OBSERVATION_V1_6",
      version:S2_07_MOPS_EXACT_VERSION_POPULATION_VERSION_V1_6,
      stockCode:symbol,
      observationMode:"PROSPECTIVE_POLL",
      observedAt:observed,
      firstObservedAt:null,
      firstObservedAvailableAt:null,
      availableAt:null,
      sourceUrl:text(sourceUrl)||null,
      sourceQueryRef:text(sourceQueryRef)||null,
      sourceReportedClockEligible:false,
      sourceClockVersionKey:null,
      versionKey:null,
      versionPayloadHash:null,
      state:"SOURCE_REPORTED_CLOCK_INVALID",
      eligible:false,
      knownAtVersionClockCertified:false,
      expectedMopsKeysetComplete:false,
      noRevisionGapThroughCut:false,
      selectionAuthority:false,
      system1RuntimeUsed:false,
    });
  }

  const canonicalRow=canonicalParsedRow(symbol,row);
  const versionPayloadHash=await sha256Hex(canonicalRow);
  const stableIdentity={
    sourceHost:"mopsov.twse.com.tw",
    stockCode:symbol,
    sourceReportedAt:clock.sourceReportedAt,
    seqNo:clock.seqNo,
  };
  const globalVersionKey="S2-MOPS-V:"+await sha256Hex(stableIdentity);

  return deepFreeze({
    schemaVersion:"S2_S2_07_MOPS_EXACT_VERSION_OBSERVATION_V1_6",
    version:S2_07_MOPS_EXACT_VERSION_POPULATION_VERSION_V1_6,
    stockCode:symbol,
    observationMode:"PROSPECTIVE_POLL",
    observedAt:observed,
    firstObservedAt:observed,
    firstObservedAvailableAt:observed,
    availableAt:observed,
    sourceUrl:text(sourceUrl)||null,
    sourceQueryRef:text(sourceQueryRef)||null,
    sourceReportedClockEligible:true,
    sourceReportedAt:clock.sourceReportedAt,
    sourceReportedDate:clock.sourceReportedDate,
    sourceReportedTime:clock.sourceReportedTime,
    seqNo:clock.seqNo,
    sourceClockVersionKey:clock.versionKey,
    versionKey:globalVersionKey,
    versionPayloadHash,
    canonicalParsedRowHash:versionPayloadHash,
    canonicalParsedRow,
    globalIdentityIncludesStockCode:true,
    sourceClockVersionKeyUsedAsGlobalIdentity:false,
    evidenceClass:"PROSPECTIVE_MOPS_EXACT_VERSION_OBSERVER",
    state:"PROSPECTIVE_MOPS_EXACT_VERSION_OBSERVED",
    eligible:true,
    immutable:true,

    // One prospective observation proves public retrievability no later than
    // observedAt. It does not certify the full expected population or latency.
    publicAvailabilityObserved:true,
    publicAvailabilityLatencyCertified:false,
    knownAtVersionClockCertified:false,
    expectedMopsKeysetComplete:false,
    noRevisionGapThroughCut:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}

function stableEventView(event){
  return {
    sourceId:text(event?.sourceId),
    symbol:text(event?.symbol),
    effectiveDate:text(event?.effectiveDate),
    family:text(event?.family),
  };
}

function laneCounts(events){
  const counts={};
  for(const event of events){
    const id=text(event?.sourceId);
    counts[id]=(counts[id]||0)+1;
  }
  return counts;
}

export async function buildProspectiveMopsExactVersionPopulationReceiptV1_6({
  frozenEvents=[],
  observations=[],
  queryDiagnostics=[],
  capturedAt,
}={}){
  const captured=isoTimestamp(capturedAt,"capturedAt");
  const blockers=[];
  const events=(Array.isArray(frozenEvents)?frozenEvents:[]).map(stableEventView)
    .sort((a,b)=>[a.sourceId,a.symbol,a.effectiveDate,a.family].join("|").localeCompare([b.sourceId,b.symbol,b.effectiveDate,b.family].join("|")));
  if(events.length!==S2_07_FROZEN_LOW_VOLUME_EVENT_COUNT_V1_6) blockers.push("FROZEN_EVENT_COUNT_MISMATCH");
  const symbols=uniqueSorted(events.map(x=>x.symbol).filter(Boolean));
  if(symbols.length!==S2_07_FROZEN_LOW_VOLUME_UNIQUE_SYMBOL_COUNT_V1_6) blockers.push("FROZEN_UNIQUE_SYMBOL_COUNT_MISMATCH");
  const counts=laneCounts(events);
  for(const [sourceId,expected] of Object.entries(EXPECTED_LANE_COUNTS)){
    if(Number(counts[sourceId]||0)!==expected) blockers.push("FROZEN_LANE_EVENT_COUNT_MISMATCH:"+sourceId);
  }
  const unexpectedLaneIds=Object.keys(counts).filter(id=>!(id in EXPECTED_LANE_COUNTS));
  if(unexpectedLaneIds.length) blockers.push("FROZEN_UNEXPECTED_LANE");

  const stableEventUniverseHash=await sha256Hex({
    interval:{startDate:"2026-04-05",endDate:"2026-10-02"},
    events,
  });

  const diagnostics=Array.isArray(queryDiagnostics)?queryDiagnostics:[];
  const diagSymbols=uniqueSorted(diagnostics.map(x=>text(x?.symbol)).filter(Boolean));
  if(diagnostics.length!==23||diagSymbols.length!==23) blockers.push("QUERY_DIAGNOSTIC_SCOPE_INCOMPLETE");
  const badDiagnostics=diagnostics.filter(d=>
    d?.transportReady!==true
    || d?.annualQueriesReady!==true
    || d?.monthShardQueriesReady!==true
    || d?.noPaginationHint!==true
    || Number(d?.monthShardQueryCount||0)<=0
  );
  if(badDiagnostics.length) blockers.push("MOPS_QUERY_TRANSPORT_OR_SHARD_CAPTURE_INCOMPLETE");

  const eligible=(Array.isArray(observations)?observations:[]).filter(o=>o?.eligible===true);
  const ineligibleCount=(Array.isArray(observations)?observations:[]).length-eligible.length;
  if(ineligibleCount) blockers.push("MOPS_EXACT_VERSION_OBSERVATION_INELIGIBLE");
  const outsideSymbols=eligible.filter(o=>!symbols.includes(text(o.stockCode)));
  if(outsideSymbols.length) blockers.push("MOPS_OBSERVATION_OUTSIDE_FROZEN_SYMBOL_SCOPE");

  const byKey=new Map();
  const payloadConflicts=[];
  for(const o of eligible){
    const key=text(o.versionKey);
    const payload=text(o.versionPayloadHash);
    if(!/^S2-MOPS-V:[0-9a-f]{64}$/i.test(key)||!hash64(payload)){
      blockers.push("MOPS_EXACT_VERSION_IDENTITY_INVALID");
      continue;
    }
    const previous=byKey.get(key);
    if(previous&&text(previous.versionPayloadHash)!==payload){
      payloadConflicts.push(key);
      continue;
    }
    if(!previous||Date.parse(o.firstObservedAt)<Date.parse(previous.firstObservedAt)) byKey.set(key,o);
  }
  if(payloadConflicts.length) blockers.push("MOPS_EXACT_VERSION_PAYLOAD_CONFLICT");

  const uniqueObservations=[...byKey.values()].sort((a,b)=>text(a.versionKey).localeCompare(text(b.versionKey)));
  const coveredSymbols=uniqueSorted(uniqueObservations.map(o=>text(o.stockCode)));
  const missingSymbols=symbols.filter(s=>!coveredSymbols.includes(s));
  if(missingSymbols.length) blockers.push("FROZEN_EVENT_SYMBOL_WITHOUT_MOPS_FAMILY_VERSION");

  const sourceClockGroups=new Map();
  for(const o of uniqueObservations){
    const k=text(o.sourceClockVersionKey);
    if(!sourceClockGroups.has(k)) sourceClockGroups.set(k,new Set());
    sourceClockGroups.get(k).add(text(o.stockCode));
  }
  const crossSymbolSourceClockCollisions=[...sourceClockGroups.entries()]
    .filter(([,set])=>set.size>1)
    .map(([sourceClockVersionKey,set])=>({
      sourceClockVersionKey,
      stockCodes:[...set].sort(),
    }))
    .sort((a,b)=>a.sourceClockVersionKey.localeCompare(b.sourceClockVersionKey));

  const monthOnlyCount=diagnostics.reduce((sum,d)=>sum+Number(d?.monthOnlyVersionCount||0),0);
  const yearOnlyCount=diagnostics.reduce((sum,d)=>sum+Number(d?.yearOnlyVersionCount||0),0);
  const queryKeysetExactEventCount=diagnostics.filter(d=>d?.annualVsMonthKeysetExact===true).length;

  // This V1.6 physical capture intentionally does not certify source semantics
  // for the month-shard union as a complete expected MOPS population.
  const uniqueBlockers=[...new Set(blockers)];
  const captureReady=uniqueBlockers.length===0;
  const populationIdentity={
    version:S2_07_MOPS_EXACT_VERSION_POPULATION_VERSION_V1_6,
    stableEventUniverseHash,
    capturedAt:captured,
    observations:uniqueObservations.map(o=>({
      versionKey:o.versionKey,
      stockCode:o.stockCode,
      sourceReportedAt:o.sourceReportedAt,
      seqNo:o.seqNo,
      versionPayloadHash:o.versionPayloadHash,
      firstObservedAt:o.firstObservedAt,
    })),
  };
  const prospectivePopulationHash=await sha256Hex(populationIdentity);

  return deepFreeze({
    schemaVersion:"S2_S2_07_PROSPECTIVE_MOPS_EXACT_VERSION_POPULATION_V1_6",
    version:S2_07_MOPS_EXACT_VERSION_POPULATION_VERSION_V1_6,
    state:captureReady
      ?"PROSPECTIVE_MOPS_EXACT_VERSION_POPULATION_CAPTURED_COMPLETENESS_PENDING"
      :"PROSPECTIVE_MOPS_EXACT_VERSION_POPULATION_BLOCKED",
    blockers:uniqueBlockers,
    capturedAt:captured,
    frozenEventCount:events.length,
    frozenUniqueSymbolCount:symbols.length,
    frozenLaneEventCounts:deepFreeze(counts),
    stableEventUniverseHash,
    prospectivePopulationHash,
    observationCount:Array.isArray(observations)?observations.length:0,
    eligibleObservationCount:eligible.length,
    uniqueGlobalVersionKeyCount:uniqueObservations.length,
    coveredSymbolCount:coveredSymbols.length,
    missingSymbols:deepFreeze(missingSymbols),
    payloadConflictCount:payloadConflicts.length,
    payloadConflictVersionKeys:deepFreeze(uniqueSorted(payloadConflicts)),
    sourceClockVersionKeyCollisionCount:crossSymbolSourceClockCollisions.length,
    sourceClockVersionKeyCollisions:deepFreeze(crossSymbolSourceClockCollisions),
    queryDiagnosticCount:diagnostics.length,
    queryKeysetExactEventCount,
    monthOnlyVersionCount:monthOnlyCount,
    yearOnlyVersionCount:yearOnlyCount,
    candidateObservedGlobalVersionKeys:deepFreeze(uniqueObservations.map(o=>o.versionKey)),
    observations:deepFreeze(uniqueObservations),
    prospectiveExactVersionCaptureReady:captureReady,

    // Completeness remains a separate future certification.
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
