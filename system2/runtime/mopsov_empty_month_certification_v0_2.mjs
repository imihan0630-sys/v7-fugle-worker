import { deepFreeze } from "./factor_snapshot.mjs";

export const MOPSOV_EMPTY_MONTH_CERTIFICATION_VERSION = "0.2-RESEARCH";

export const MOPSOV_EMPTY_MONTH_FROZEN_SIGNATURE_V0_2 = deepFreeze({
  sourceHost: "mopsov.twse.com.tw",
  contentTypeIncludes: "text/html",
  payloadBytes: 2540,
  payloadSha256: "9d2e63bf800085e3953d9e675f72cd95131758de64546ad898a5beee56a39e5d",
  normalizedVisibleText: "公開資訊觀測站 資料庫中查無需求資料",
  structure: deepFreeze({
    hasHtml: true,
    hasBody: true,
    hasForm: false,
    hasTable: true,
    hasMops: true,
    hasStockCode: false,
  }),
});

const ERROR_PATTERNS = Object.freeze([
  "系統發生錯誤",
  "service unavailable",
  "access denied",
  "驗證碼",
  "禁止存取",
]);

function bool(value){ return value === true; }
function text(value){ return value == null ? "" : String(value).trim(); }

function hasKnownError(observation){
  const source = [
    ...(Array.isArray(observation?.matchedErrorPhrases) ? observation.matchedErrorPhrases : []),
    text(observation?.visibleText),
  ].join(" ").toLowerCase();
  return ERROR_PATTERNS.some((x)=>source.includes(x.toLowerCase()));
}

function exactStructure(actual, expected){
  return Object.entries(expected).every(([key,value])=>bool(actual?.[key])===value);
}

export function certifyMopsovEmptyMonthObservationV0_2(observation = {}){
  const sig = MOPSOV_EMPTY_MONTH_FROZEN_SIGNATURE_V0_2;
  const checks = deepFreeze({
    http200: Number(observation.httpStatus) === 200,
    htmlContentType: text(observation.contentType).toLowerCase().includes(sig.contentTypeIncludes),
    zeroRows: Number(observation.rowCount) === 0,
    payloadBytesExact: Number(observation.bytes) === sig.payloadBytes,
    payloadHashExact: text(observation.payloadSha256) === sig.payloadSha256,
    visibleTextExact: text(observation.visibleText) === sig.normalizedVisibleText,
    structureExact: exactStructure(observation.structure, sig.structure),
    noKnownError: !hasKnownError(observation),
  });
  const pass = Object.values(checks).every(Boolean);
  return deepFreeze({
    state: pass ? "CERTIFIED_EMPTY_MONTH_SIGNATURE" : "EMPTY_MONTH_SIGNATURE_DRIFT_OR_INVALID",
    pass,
    checks,
  });
}

export function certifyMopsovPositiveControlV0_2(observation = {}){
  const sig = MOPSOV_EMPTY_MONTH_FROZEN_SIGNATURE_V0_2;
  const checks = deepFreeze({
    http200: Number(observation.httpStatus) === 200,
    htmlContentType: text(observation.contentType).toLowerCase().includes(sig.contentTypeIncludes),
    nonZeroRows: Number(observation.rowCount) > 0,
    stockCodePresent: observation?.structure?.hasStockCode === true,
    formPresent: observation?.structure?.hasForm === true,
    notEmptyHash: text(observation.payloadSha256) !== sig.payloadSha256,
    notEmptyText: text(observation.visibleText) !== sig.normalizedVisibleText,
    noKnownError: !hasKnownError(observation),
  });
  const pass = Object.values(checks).every(Boolean);
  return deepFreeze({
    state: pass ? "POSITIVE_CONTROL_CONFIRMED" : "POSITIVE_CONTROL_DRIFT_OR_INVALID",
    pass,
    checks,
  });
}

export function summarizeMopsovEmptyMonthCertificationV0_2({
  emptyObservations = [],
  positiveObservations = [],
} = {}){
  if(!Array.isArray(emptyObservations) || !Array.isArray(positiveObservations)){
    throw new Error("emptyObservations and positiveObservations must be arrays");
  }
  const emptyResults = emptyObservations.map((x)=>deepFreeze({
    id: x.id ?? null,
    ...certifyMopsovEmptyMonthObservationV0_2(x),
  }));
  const positiveResults = positiveObservations.map((x)=>deepFreeze({
    id: x.id ?? null,
    ...certifyMopsovPositiveControlV0_2(x),
  }));
  const emptyCount = emptyResults.length;
  const positiveCount = positiveResults.length;
  const emptyPassCount = emptyResults.filter((x)=>x.pass).length;
  const positivePassCount = positiveResults.filter((x)=>x.pass).length;
  const certified =
    emptyCount >= 4 &&
    positiveCount >= 3 &&
    emptyPassCount === emptyCount &&
    positivePassCount === positiveCount;

  return deepFreeze({
    schemaVersion: "S2_MOPSOV_EMPTY_MONTH_CERTIFICATION_V0_2",
    version: MOPSOV_EMPTY_MONTH_CERTIFICATION_VERSION,
    state: certified ? "MOPSOV_EMPTY_MONTH_SEMANTICS_CERTIFIED" : "MOPSOV_EMPTY_MONTH_CERTIFICATION_BLOCKED",
    emptyMonthSemanticsCertified: certified,
    emptyCount,
    emptyPassCount,
    positiveCount,
    positivePassCount,
    emptyResults: Object.freeze(emptyResults),
    positiveResults: Object.freeze(positiveResults),

    // Narrow source-level certification only.
    boundedIntervalCoverageComplete: false,
    actionFamilyCoverageComplete: false,
    cancellationHistoryComplete: false,
    knownAtVersionClockCertified: false,
    revisionCoverageComplete: false,
    noEventMayBeClaimed: false,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    historyMutationPerformed: false,
    strategyEvaluationPerformed: false,
    capacityRunProduced: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
