// Research-only Price Path Quality / Information Discreteness readiness matrix.
// Class A branch-only helper: no Formal Core, monitoring, push, storage, schema or runtime wiring.
// Readiness is observational and MUST NOT be used as an alpha denominator or formal gate.

function readinessFinite(value) {
  if (value === null || value === undefined || value === "") return false;
  return Number.isFinite(Number(value));
}

function readinessState(present, provenanceState) {
  if (provenanceState && provenanceState !== "OK" && provenanceState !== "SNAPSHOT_OK") return "PROVENANCE_BLOCKED";
  return present ? "AVAILABLE" : "FIELD_UNKNOWN_OR_MISSING";
}

function outcomeState(metric, provenanceState) {
  if (provenanceState && provenanceState !== "OK" && provenanceState !== "OUTCOME_AVAILABLE" && provenanceState !== "OBSERVED_HISTORY_INSUFFICIENT") return "PROVENANCE_BLOCKED";
  return readinessFinite(metric) ? "AVAILABLE" : "OUTCOME_NOT_MATURE";
}

function provenanceStates(provenance) {
  const legacy = String(provenance?.state || "OK");
  // Prefer split provenance whenever supplied. A valid scan-time snapshot must not be
  // suppressed merely because later history/outcome provenance failed.
  const snapshot = String(provenance?.snapshotState || provenance?.snapshot?.state || legacy);
  const outcome = String(provenance?.historyState || provenance?.outcomeState || provenance?.history?.state || legacy);
  return { snapshot, outcome };
}

function pricePathReadinessForOutcome(row, provenance) {
  const snapshot = row?.snapshot || {};
  const price = snapshot?.price || {};
  const volume = snapshot?.volume || {};
  const provenanceState = provenanceStates(provenance);
  const baselinePresent = readinessFinite(row?.baselineClose ?? price?.close);
  const breakoutReferencePresent = readinessFinite(row?.breakout?.reference) ||
    readinessFinite(price?.breakoutReferencePriceResearch) ||
    (baselinePresent && readinessFinite(price?.breakoutDistancePct));
  const residualPresent = readinessFinite(price?.residualSectorRs20);
  const relativeVolumePresent = readinessFinite(volume?.volumeTodayVsPrev5);

  return {
    scanDate: String(row?.scanDate || "").slice(0, 10),
    cohort: String(row?.cohort || "UNKNOWN"),
    symbol: String(row?.symbol || ""),
    fields: {
      r01BreakoutReference: readinessState(breakoutReferencePresent, provenanceState.snapshot),
      r05BaselineClose: readinessState(baselinePresent, provenanceState.snapshot),
      r07ResidualSectorRs20: readinessState(residualPresent, provenanceState.snapshot),
      r08ResidualSectorRs20: readinessState(residualPresent, provenanceState.snapshot),
      r08VolumeTodayVsPrev5: readinessState(relativeVolumePresent, provenanceState.snapshot)
    },
    outcomes: {
      r01ThreeDayBreakout: outcomeState(["HELD_3D", "FAILED_CLOSE_WITHIN_3D"].includes(row?.breakout?.status) ? 1 : null, provenanceState.outcome),
      r05NextDayOvernight: outcomeState(row?.firstDay?.overnightPct, provenanceState.outcome),
      r05NextDayIntraday: outcomeState(row?.firstDay?.intradayPct, provenanceState.outcome),
      d5: outcomeState(row?.horizons?.d5?.returnPct, provenanceState.outcome),
      d10: outcomeState(row?.horizons?.d10?.returnPct, provenanceState.outcome),
      d20: outcomeState(row?.horizons?.d20?.returnPct, provenanceState.outcome)
    }
  };
}

function buildPricePathReadinessMatrix(outcomes, provenanceByKey = {}) {
  const rows = (outcomes || []).map(row => {
    const key = `${String(row?.scanDate || "").slice(0, 10)}|${String(row?.symbol || "")}`;
    return pricePathReadinessForOutcome(row, provenanceByKey[key]);
  });
  const groups = {};
  for (const row of rows) {
    const key = `${row.scanDate}|${row.cohort}`;
    if (!groups[key]) groups[key] = { scanDate: row.scanDate, cohort: row.cohort, rows: 0, fields: {}, outcomes: {} };
    const group = groups[key];
    group.rows += 1;
    for (const [name, state] of Object.entries(row.fields)) {
      group.fields[name] ||= { AVAILABLE: 0, FIELD_UNKNOWN_OR_MISSING: 0, PROVENANCE_BLOCKED: 0 };
      group.fields[name][state] = (group.fields[name][state] || 0) + 1;
    }
    for (const [name, state] of Object.entries(row.outcomes)) {
      group.outcomes[name] ||= { AVAILABLE: 0, OUTCOME_NOT_MATURE: 0, PROVENANCE_BLOCKED: 0 };
      group.outcomes[name][state] = (group.outcomes[name][state] || 0) + 1;
    }
  }
  return {
    researchOnly: true,
    decisionImpact: false,
    unit: "INDEPENDENT_SCAN_DATE_X_COHORT",
    groups: Object.values(groups).sort((a, b) => `${a.scanDate}|${a.cohort}`.localeCompare(`${b.scanDate}|${b.cohort}`)),
    rule: "Scan-time field presence uses snapshot provenance only and is counted independently of future outcome maturity/history provenance. Missing or provenance-blocked evidence is never coerced to BAD/0."
  };
}

if (typeof module !== "undefined") module.exports = { pricePathReadinessForOutcome, buildPricePathReadinessMatrix };
