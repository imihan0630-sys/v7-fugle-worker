const VALID_TOP6 = new Set([true, false]);

function finite(v) {
  return typeof v === "number" && Number.isFinite(v);
}

function missing(v) {
  return v === null || v === undefined || v === "";
}

export function classifySda009Row(row) {
  const blockers = [];
  for (const key of ["scanDate", "candidateSymbol", "classificationSchemeId", "membershipVersion"]) {
    if (missing(row?.[key])) blockers.push(`MISSING_${key}`);
  }
  if (!row?.inclusiveSectorState || typeof row.inclusiveSectorState !== "object") blockers.push("MISSING_INCLUSIVE_STATE");
  if (!row?.leaveOneOutSectorState || typeof row.leaveOneOutSectorState !== "object") blockers.push("MISSING_LOO_STATE");
  if (row?.replayTrust === "BLOCKED") blockers.push("REPLAY_TRUST_BLOCKED");
  if (row?.leaveOneOutSectorState?.state === "UNKNOWN") blockers.push("LOO_UNKNOWN");

  const supportState = row?.supportState || row?.leaveOneOutSectorState?.supportState || null;
  const smallN = supportState === "SMALL_N_SENSITIVE";

  const incGate = row?.inclusiveSectorState?.hardGatePass;
  const looGate = row?.leaveOneOutSectorState?.hardGatePass;
  const gateComparable = typeof incGate === "boolean" && typeof looGate === "boolean";
  const gateFlip = gateComparable && incGate !== looGate;

  const rawRank = row?.rawRank;
  const looRank = row?.leaveOneOutDiagnosticRank;
  const rankComparable = finite(rawRank) && finite(looRank);
  const rankFlip = rankComparable && rawRank !== looRank;

  const rawTop6 = row?.rawTop6;
  const looTop6 = row?.leaveOneOutTop6;
  const top6Comparable = VALID_TOP6.has(rawTop6) && VALID_TOP6.has(looTop6);
  const top6Flip = top6Comparable && rawTop6 !== looTop6;

  const incScore = row?.inclusiveSectorState?.sectorScore;
  const looScore = row?.leaveOneOutSectorState?.sectorScore;
  const scoreComparable = finite(incScore) && finite(looScore);
  const sectorScoreDelta = scoreComparable ? incScore - looScore : null;
  const scoreChanged = scoreComparable && Math.abs(sectorScoreDelta) > 1e-9;

  const priorityDelta = finite(row?.priorityScoreDeltaFromSector)
    ? row.priorityScoreDeltaFromSector
    : (scoreComparable ? 0.14 * sectorScoreDelta : null);

  const effects = { gateFlip, rankFlip, top6Flip, scoreChanged };

  let primaryClassification;
  if (blockers.length) primaryClassification = "BLOCKED";
  else if (smallN) primaryClassification = "SMALL_N_SENSITIVE";
  else if (top6Flip) primaryClassification = "TOP6_FLIP";
  else if (gateFlip) primaryClassification = "GATE_FLIP";
  else if (rankFlip) primaryClassification = "RANK_FLIP";
  else if (scoreChanged) primaryClassification = "SCORE_ONLY_SELF_EFFECT";
  else primaryClassification = "NO_MATERIAL_SELF_EFFECT";

  return {
    scanDate: row?.scanDate ?? null,
    candidateSymbol: row?.candidateSymbol ?? null,
    classificationSchemeId: row?.classificationSchemeId ?? null,
    membershipVersion: row?.membershipVersion ?? null,
    primaryClassification,
    effects,
    blockers,
    supportState,
    sectorScoreDelta,
    priorityScoreDeltaFromSector: priorityDelta,
    rawRank: rankComparable ? rawRank : null,
    leaveOneOutDiagnosticRank: rankComparable ? looRank : null,
    rawTop6: top6Comparable ? rawTop6 : null,
    leaveOneOutTop6: top6Comparable ? looTop6 : null,
    economicMateriality: "UNASSESSED_D16_REQUIRED"
  };
}

export function analyzeSda009Receipt(receipt) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt object required");
  if (!Array.isArray(receipt.rows)) throw new Error("receipt.rows array required");

  const rows = receipt.rows.map(classifySda009Row);
  const counts = {};
  for (const r of rows) counts[r.primaryClassification] = (counts[r.primaryClassification] || 0) + 1;

  const comparable = rows.filter(r => r.primaryClassification !== "BLOCKED");
  const top6FlipN = comparable.filter(r => r.effects.top6Flip).length;
  const gateFlipN = comparable.filter(r => r.effects.gateFlip).length;
  const rankFlipN = comparable.filter(r => r.effects.rankFlip).length;

  return {
    schemaVersion: "SDA009_R2_RECEIPT_ORACLE_V0_1",
    auditTicket: "SDA-009",
    scanDate: receipt.scanDate ?? null,
    generationId: receipt.generationId ?? null,
    rowCount: rows.length,
    comparableRowCount: comparable.length,
    blockedRowCount: rows.length - comparable.length,
    counts,
    effectCounts: { gateFlipN, rankFlipN, top6FlipN },
    rows,
    formalDecisionImpact: false,
    interpretation: "MECHANICAL_SELF_CONTRIBUTION_DIAGNOSTIC_ONLY",
    d16Required: true
  };
}
