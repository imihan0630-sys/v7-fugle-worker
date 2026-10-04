import { deepFreeze } from "./factor_snapshot.mjs";
import {
  MOPS_REVISION_CONTROLS_V0_3,
  summarizeMopsRevisionControlMatrixV0_3,
} from "./mops_revision_control_matrix_v0_3.mjs";

export const MOPS_REVISION_CONTROL_MATRIX_VERSION_V0_4 = "0.4-RESEARCH";

export const TPEX_6548_PAR_VALUE_CONTROL_V0_4 = deepFreeze({
  id: "TPEX_PAR_VALUE_CHANGE_CORRECTION_6548_2022",
  exchange: "TPEX",
  laneSourceId: "TPEX_PAR_VALUE_CHANGE_REFERENCE",
  actionFamily: "PAR_VALUE_CHANGE",
  mode: "ORIGINAL_PLUS_CORRECTION",
  stockCode: "6548",
  rocYear: 111,
  months: Object.freeze([8]),
  expectedDates: Object.freeze([]),
  baseSubject: "董事會訂定股票面額變更之換發基準日",
  officialEffectiveDate: "2022-09-05",
});

export const MOPS_REVISION_CONTROLS_V0_4 = deepFreeze([
  ...MOPS_REVISION_CONTROLS_V0_3,
  TPEX_6548_PAR_VALUE_CONTROL_V0_4,
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

export function summarizeMopsRevisionControlMatrixV0_4(controlResults = []) {
  const byId = requiredControlMap(controlResults);
  const priorIds = new Set(MOPS_REVISION_CONTROLS_V0_3.map((x)=>x.id));
  const priorSummary = summarizeMopsRevisionControlMatrixV0_3(
    controlResults.filter((x)=>priorIds.has(x.controlId))
  );

  const control = TPEX_6548_PAR_VALUE_CONTROL_V0_4;
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
    schemaVersion: "S2_MOPS_REVISION_CONTROL_MATRIX_V0_4",
    version: MOPS_REVISION_CONTROL_MATRIX_VERSION_V0_4,
    priorVersion: priorSummary.version,
    state: allPass
      ? "MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED_V0_4"
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
