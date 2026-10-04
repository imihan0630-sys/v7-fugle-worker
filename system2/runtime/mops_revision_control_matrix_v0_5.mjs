import { deepFreeze } from "./factor_snapshot.mjs";
import {
  MOPS_REVISION_CONTROLS_V0_4,
  summarizeMopsRevisionControlMatrixV0_4,
} from "./mops_revision_control_matrix_v0_4.mjs";

export const MOPS_REVISION_CONTROL_MATRIX_VERSION_V0_5 = "0.5-RESEARCH";

export const TPEX_5356_DIVIDEND_CONTROL_V0_5 = deepFreeze({
  id: "TPEX_EX_RIGHT_DIVIDEND_CORRECTION_5356_2026",
  exchange: "TPEX",
  laneSourceId: "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  actionFamily: "EX_RIGHT_DIVIDEND",
  mode: "ORIGINAL_PLUS_CORRECTION",
  stockCode: "5356",
  rocYear: 115,
  months: Object.freeze([6]),
  expectedDates: Object.freeze([]),
  baseSubject: "除息基準日及發放日",
  officialEffectiveDate: "2026-07-08",
});

export const MOPS_REVISION_CONTROLS_V0_5 = deepFreeze([
  ...MOPS_REVISION_CONTROLS_V0_4,
  TPEX_5356_DIVIDEND_CONTROL_V0_5,
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

export function summarizeMopsRevisionControlMatrixV0_5(controlResults = []) {
  const byId = requiredControlMap(controlResults);
  const priorIds = new Set(MOPS_REVISION_CONTROLS_V0_4.map((x)=>x.id));
  const priorSummary = summarizeMopsRevisionControlMatrixV0_4(
    controlResults.filter((x)=>priorIds.has(x.controlId))
  );

  const control = TPEX_5356_DIVIDEND_CONTROL_V0_5;
  const result = byId.get(control.id);
  const parsed = result?.parsed || {};
  const pass =
    result?.revisionHistoryCapabilityObserved === true &&
    Number(parsed.matchingSubjectRowCount) >= 2 &&
    Number(parsed.originalRowCount) >= 1 &&
    Number(parsed.correctionOrCancellationRowCount) >= 1 &&
    Number(parsed.distinctVersionKeyCount) >= 2;

  const newControl = deepFreeze({
    controlId: control.id,
    exchange: control.exchange,
    laneSourceId: control.laneSourceId,
    actionFamily: control.actionFamily,
    mode: control.mode,
    configuredMonths: control.months,
    state: pass ? "PASS_CONTROL_OBSERVED" : String(result?.state || "CONTROL_NOT_PROVEN"),
    pass,
    historyHttpStatus: result?.historyHttpStatus ?? null,
    rowCount: parsed.rowCount ?? null,
    matchingSubjectRowCount: parsed.matchingSubjectRowCount ?? null,
    originalRowCount: parsed.originalRowCount ?? null,
    correctionOrCancellationRowCount: parsed.correctionOrCancellationRowCount ?? null,
    distinctVersionKeyCount: parsed.distinctVersionKeyCount ?? null,
  });

  const controls = Object.freeze([...priorSummary.controls, newControl]);
  const allPass = controls.every((x)=>x.pass===true);
  const observedFamilies = new Set(controls.filter((x)=>x.pass).map((x)=>x.actionFamily));
  const exchangesObserved = new Set(controls.filter((x)=>x.pass).map((x)=>x.exchange).filter(Boolean));

  return deepFreeze({
    schemaVersion: "S2_MOPS_REVISION_CONTROL_MATRIX_V0_5",
    version: MOPS_REVISION_CONTROL_MATRIX_VERSION_V0_5,
    priorVersion: priorSummary.version,
    state: allPass
      ? "MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED_V0_5"
      : "CONTROL_MATRIX_PARTIAL_OR_BLOCKED",
    controls,
    controlCount: controls.length,
    passCount: controls.filter((x)=>x.pass).length,
    actionFamiliesObserved: Object.freeze([...observedFamilies].sort()),
    actionFamilyObservedCount: observedFamilies.size,
    exchangesObserved: Object.freeze([...exchangesObserved].sort()),
    crossMonthControlCount: priorSummary.crossMonthControlCount,

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
