import { deepFreeze } from "./factor_snapshot.mjs";

export const MOPS_REVISION_CONTROL_MATRIX_VERSION = "0.2-RESEARCH";

export const MOPS_REVISION_CONTROLS_V0_2 = deepFreeze([
  {
    id: "DIVIDEND_CORRECTION_2467_2026_05",
    actionFamily: "DIVIDEND_EX_DATE",
    mode: "ORIGINAL_PLUS_CORRECTION",
    stockCode: "2467",
    rocYear: 115,
    month: 5,
    expectedDate: "2026-05-22",
    baseSubject: "公告本公司除息基準日等相關事宜",
  },
  {
    id: "CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",
    actionFamily: "CAPITAL_REDUCTION_SCHEDULE",
    mode: "ORIGINAL_PLUS_CORRECTION",
    stockCode: "1459",
    rocYear: 115,
    month: 6,
    expectedDate: null,
    baseSubject: "本公司董事長訂定現金減資換股基準日",
  },
  {
    id: "CAPITAL_REDUCTION_DECISION_CORRECTION_2321_2026_03",
    actionFamily: "CAPITAL_REDUCTION_DECISION",
    mode: "ORIGINAL_PLUS_CORRECTION",
    stockCode: "2321",
    rocYear: 115,
    month: 3,
    expectedDate: null,
    baseSubject: "公告本公司董事會決議減資彌補虧損",
  },
  {
    id: "CASH_CAPITAL_INCREASE_CORRECTION_1342_2026_06",
    actionFamily: "CASH_CAPITAL_INCREASE",
    mode: "ORIGINAL_PLUS_CORRECTION",
    stockCode: "1342",
    rocYear: 115,
    month: 6,
    expectedDate: "2026-06-16",
    baseSubject: "辦理115年現金增資發行新股訂定認股基準日相關事宜",
  },
  {
    id: "CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",
    actionFamily: "CASH_CAPITAL_INCREASE",
    mode: "CANCELLATION_ROW",
    stockCode: "1342",
    rocYear: 115,
    month: 7,
    expectedDate: "2026-07-01",
    baseSubject: "公告本公司接獲金融監督管理委員會核准撤銷115年",
  },
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

export function summarizeMopsRevisionControlMatrixV0_2(controlResults = []) {
  const byId = requiredControlMap(controlResults);
  const rows = MOPS_REVISION_CONTROLS_V0_2.map((control) => {
    const result = byId.get(control.id);
    if (!result) {
      return deepFreeze({
        controlId: control.id,
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
      actionFamily: control.actionFamily,
      mode: control.mode,
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

  const correctionRows = rows.filter((x) => x.mode === "ORIGINAL_PLUS_CORRECTION");
  const cancellationRows = rows.filter((x) => x.mode === "CANCELLATION_ROW");
  const correctionControlPassCount = correctionRows.filter((x) => x.pass).length;
  const cancellationControlPassCount = cancellationRows.filter((x) => x.pass).length;
  const observedFamilies = new Set(rows.filter((x) => x.pass).map((x) => x.actionFamily));
  const allControlsPass = rows.every((x) => x.pass);

  return deepFreeze({
    schemaVersion: "S2_MOPS_REVISION_CONTROL_MATRIX_V0_2",
    version: MOPS_REVISION_CONTROL_MATRIX_VERSION,
    state: allControlsPass
      ? "MULTI_FAMILY_CORRECTION_AND_CANCELLATION_CAPABILITY_OBSERVED"
      : "CONTROL_MATRIX_PARTIAL_OR_BLOCKED",
    controls: Object.freeze(rows),
    controlCount: rows.length,
    passCount: rows.filter((x) => x.pass).length,
    correctionControlCount: correctionRows.length,
    correctionControlPassCount,
    cancellationControlCount: cancellationRows.length,
    cancellationControlPassCount,
    actionFamiliesObserved: Object.freeze([...observedFamilies].sort()),
    actionFamilyObservedCount: observedFamilies.size,

    // Capability observations are not completeness certification.
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
