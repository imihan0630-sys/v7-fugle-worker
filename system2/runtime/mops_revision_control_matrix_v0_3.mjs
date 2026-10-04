import { deepFreeze } from "./factor_snapshot.mjs";
import { MOPS_REVISION_CONTROLS_V0_2 } from "./mops_revision_control_matrix_v0_2.mjs";

export const MOPS_REVISION_CONTROL_MATRIX_VERSION_V0_3 = "0.3-RESEARCH";

const NEW_TPEX_3152_CONTROL = deepFreeze({
  id: "TPEX_CAPITAL_REDUCTION_DECISION_CORRECTION_3152_2026",
  exchange: "TPEX",
  laneSourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  actionFamily: "CAPITAL_REDUCTION_DECISION",
  mode: "ORIGINAL_PLUS_CORRECTION",
  stockCode: "3152",
  rocYear: 115,
  months: Object.freeze([1, 5]),
  expectedDates: Object.freeze(["2026-01-20", "2026-05-28"]),
  baseSubject: "本公司董事會決議辦理現金減資事宜",
  officialEffectiveDate: "2026-06-30",
});

export const MOPS_REVISION_CONTROLS_V0_3 = deepFreeze([
  ...MOPS_REVISION_CONTROLS_V0_2.map((control)=>({
    ...control,
    exchange: control.exchange || "TWSE",
    months: Object.freeze([control.month]),
    expectedDates: Object.freeze(control.expectedDate ? [control.expectedDate] : []),
  })),
  NEW_TPEX_3152_CONTROL,
]);

function requiredControlMap(controlResults) {
  if (!Array.isArray(controlResults)) throw new Error("controlResults must be an array");
  const out = new Map();
  for (const row of controlResults) {
    if (!row || typeof row !== "object") throw new Error("control result must be an object");
    if (!row.controlId) throw new Error("controlId is required");
    if (out.has(row.controlId)) throw new Error("duplicate controlId " + row.controlId);
    out.set(row.controlId, row);
  }
  return out;
}

function versionKey(row){
  return [row?.date || "", row?.time || "", row?.seqNo || ""].join("|");
}

export function combineMultiMonthMopsRevisionControlResultV0_3({
  control,
  monthlyResults = [],
} = {}) {
  if (!control || typeof control !== "object") throw new Error("control is required");
  if (!Array.isArray(monthlyResults)) throw new Error("monthlyResults must be an array");
  const requiredMonths = [...new Set((control.months || []).map(Number))].sort((a,b)=>a-b);
  if (!requiredMonths.length) throw new Error("control.months is required");

  const byMonth = new Map();
  for (const result of monthlyResults) {
    const month = Number(result?.control?.month);
    if (!Number.isInteger(month)) throw new Error("monthly result control.month is required");
    if (byMonth.has(month)) throw new Error("duplicate monthly result for month " + month);
    byMonth.set(month, result);
  }
  const missingMonths = requiredMonths.filter((month)=>!byMonth.has(month));
  const extraMonths = [...byMonth.keys()].filter((month)=>!requiredMonths.includes(month));
  const requiredResults = requiredMonths.map((month)=>byMonth.get(month)).filter(Boolean);
  const allTransportReady =
    missingMonths.length === 0 &&
    extraMonths.length === 0 &&
    requiredResults.every((x)=>
      x?.directHistoryCapabilityObserved === true &&
      Number(x?.historyHttpStatus) === 200 &&
      x?.parsed &&
      Array.isArray(x.parsed.rows)
    );

  const rows = requiredResults
    .flatMap((x)=>x.parsed.rows || [])
    .sort((a,b)=>versionKey(a).localeCompare(versionKey(b)));
  const originalRows = rows.filter((x)=>x.correctionOrCancellationHint !== true);
  const revisionRows = rows.filter((x)=>x.correctionOrCancellationHint === true);
  const distinctVersionKeyCount = new Set(rows.map(versionKey)).size;
  const revisionHistoryCapabilityObserved =
    allTransportReady &&
    rows.length >= 2 &&
    originalRows.length >= 1 &&
    revisionRows.length >= 1 &&
    distinctVersionKeyCount >= 2;

  return deepFreeze({
    schemaVersion: "S2_MOPS_MULTI_MONTH_CONTROL_RESULT_V0_3",
    controlId: control.id,
    state: revisionHistoryCapabilityObserved
      ? "MOPSOV_MULTI_MONTH_REVISION_CHAIN_READY"
      : "MOPSOV_MULTI_MONTH_REVISION_CHAIN_BLOCKED",
    sourceMonthsRequired: Object.freeze(requiredMonths),
    sourceMonthsObserved: Object.freeze([...byMonth.keys()].sort((a,b)=>a-b)),
    missingMonths: Object.freeze(missingMonths),
    extraMonths: Object.freeze(extraMonths),
    historyHttpStatus: allTransportReady ? 200 : null,
    historyPayloadHashes: Object.freeze(
      requiredResults.map((x)=>x.historyPayloadHash).filter(Boolean)
    ),
    directHistoryCapabilityObserved: allTransportReady,
    revisionHistoryCapabilityObserved,
    parsed: deepFreeze({
      rowCount: requiredResults.reduce((n,x)=>n+Number(x?.parsed?.rowCount || 0),0),
      expectedDateRowCount: rows.length,
      matchingSubjectRowCount: rows.length,
      correctionOrCancellationRowCount: revisionRows.length,
      originalRowCount: originalRows.length,
      distinctVersionKeyCount,
      rows: Object.freeze(rows),
    }),

    boundedIntervalCoverageComplete: false,
    actionFamilyCoverageComplete: false,
    cancellationHistoryComplete: false,
    knownAtVersionClockCertified: false,
    revisionCoverageComplete: false,
    noEventMayBeClaimed: false,
    technicalContinuityCertified: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export function summarizeMopsRevisionControlMatrixV0_3(controlResults = []) {
  const byId = requiredControlMap(controlResults);
  const rows = MOPS_REVISION_CONTROLS_V0_3.map((control) => {
    const result = byId.get(control.id);
    if (!result) {
      return deepFreeze({
        controlId: control.id,
        exchange: control.exchange || null,
        laneSourceId: control.laneSourceId || null,
        actionFamily: control.actionFamily,
        mode: control.mode,
        state: "MISSING_CONTROL_RESULT",
        pass: false,
      });
    }

    const parsed = result.parsed || {};
    let pass = false;
    if (control.mode === "ORIGINAL_PLUS_CORRECTION") {
      pass =
        result.revisionHistoryCapabilityObserved === true &&
        Number(parsed.matchingSubjectRowCount) >= 2 &&
        Number(parsed.originalRowCount) >= 1 &&
        Number(parsed.correctionOrCancellationRowCount) >= 1 &&
        Number(parsed.distinctVersionKeyCount) >= 2;
    } else if (control.mode === "CANCELLATION_ROW") {
      pass =
        Number(parsed.matchingSubjectRowCount) >= 1 &&
        Number(parsed.correctionOrCancellationRowCount) >= 1 &&
        Array.isArray(parsed.rows) &&
        parsed.rows.some((x) => /撤銷|取消/.test(String(x?.rowText || "")));
    }

    return deepFreeze({
      controlId: control.id,
      exchange: control.exchange || null,
      laneSourceId: control.laneSourceId || null,
      actionFamily: control.actionFamily,
      mode: control.mode,
      configuredMonths: Object.freeze([...(control.months || [])]),
      state: pass ? "PASS_CONTROL_OBSERVED" : String(result.state || "CONTROL_NOT_PROVEN"),
      pass,
      historyHttpStatus: result.historyHttpStatus ?? null,
      rowCount: parsed.rowCount ?? null,
      matchingSubjectRowCount: parsed.matchingSubjectRowCount ?? null,
      originalRowCount: parsed.originalRowCount ?? null,
      correctionOrCancellationRowCount: parsed.correctionOrCancellationRowCount ?? null,
      distinctVersionKeyCount: parsed.distinctVersionKeyCount ?? null,
    });
  });

  const correctionRows = rows.filter((x)=>x.mode === "ORIGINAL_PLUS_CORRECTION");
  const cancellationRows = rows.filter((x)=>x.mode === "CANCELLATION_ROW");
  const allControlsPass = rows.every((x)=>x.pass);
  const observedFamilies = new Set(rows.filter((x)=>x.pass).map((x)=>x.actionFamily));
  const exchangesObserved = new Set(rows.filter((x)=>x.pass).map((x)=>x.exchange).filter(Boolean));

  return deepFreeze({
    schemaVersion: "S2_MOPS_REVISION_CONTROL_MATRIX_V0_3",
    version: MOPS_REVISION_CONTROL_MATRIX_VERSION_V0_3,
    state: allControlsPass
      ? "MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED"
      : "CONTROL_MATRIX_PARTIAL_OR_BLOCKED",
    controls: Object.freeze(rows),
    controlCount: rows.length,
    passCount: rows.filter((x)=>x.pass).length,
    correctionControlCount: correctionRows.length,
    correctionControlPassCount: correctionRows.filter((x)=>x.pass).length,
    cancellationControlCount: cancellationRows.length,
    cancellationControlPassCount: cancellationRows.filter((x)=>x.pass).length,
    actionFamiliesObserved: Object.freeze([...observedFamilies].sort()),
    actionFamilyObservedCount: observedFamilies.size,
    exchangesObserved: Object.freeze([...exchangesObserved].sort()),
    crossMonthControlCount: MOPS_REVISION_CONTROLS_V0_3.filter((x)=>(x.months || []).length>1).length,

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
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
