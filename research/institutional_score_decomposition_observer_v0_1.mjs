// Research-only / outcome-blind institutional-score decomposition observer.
// Designed to be embedded into Worker.js by apply_v8_14_0.py.
// Formal Core, selection, ranking, capital, signal and push behavior are untouched.

function institutionalObserverNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function institutionalObserverClamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function institutionalObserverRound(value, digits = 2) {
  if (!Number.isFinite(value)) return null;
  const p = 10 ** digits;
  return Math.round((value + Number.EPSILON) * p) / p;
}

function institutionalObserverMean(values) {
  const xs = (values || []).filter(Number.isFinite);
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

function institutionalObserverMedian(values) {
  const xs = (values || []).filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (!xs.length) return null;
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2;
}

function institutionalObserverPearson(xs, ys) {
  const pairs = [];
  const n = Math.min(xs?.length || 0, ys?.length || 0);
  for (let i = 0; i < n; i++) {
    const x = Number(xs[i]), y = Number(ys[i]);
    if (Number.isFinite(x) && Number.isFinite(y)) pairs.push([x, y]);
  }
  if (pairs.length < 3) return null;
  const mx = institutionalObserverMean(pairs.map(x => x[0]));
  const my = institutionalObserverMean(pairs.map(x => x[1]));
  let num = 0, dx = 0, dy = 0;
  for (const [x, y] of pairs) {
    const a = x - mx, b = y - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  if (!(dx > 0) || !(dy > 0)) return null;
  return num / Math.sqrt(dx * dy);
}

function institutionalObserverStats(values) {
  const xs = (values || []).filter(Number.isFinite);
  if (!xs.length) return { n: 0, mean: null, median: null, min: null, max: null };
  return {
    n: xs.length,
    mean: institutionalObserverRound(institutionalObserverMean(xs), 3),
    median: institutionalObserverRound(institutionalObserverMedian(xs), 3),
    min: institutionalObserverRound(Math.min(...xs), 3),
    max: institutionalObserverRound(Math.max(...xs), 3)
  };
}

function buildInstitutionalScoreDecompositionObserver(rows = []) {
  const required = [
    "score", "foreignBuyDays", "trustBuyDays", "dealerBuyDays",
    "foreignNet", "trustNet", "dealerNet", "institutionTotalNet",
    "chipConcentration", "avgVolume20Lots"
  ];
  const missingCounts = Object.fromEntries(required.map(k => [k, 0]));
  const clean = [];
  const byCohort = {};
  const byDate = {};
  let parseErrors = 0;
  let reconstructionMismatchRows = 0;
  let saturatedRows = 0;
  let netIntensityCappedRows = 0;
  let actorDivergenceRows = 0;
  let allThreePositiveRows = 0;
  let anyCurrentBuyRows = 0;
  let aggregateNetNegativeButAnyActorPositiveRows = 0;
  let aggregateNetPositiveButAnyActorNegativeRows = 0;

  for (const row of rows || []) {
    let snapshot = row?.snapshot || null;
    if (!snapshot && typeof row?.snapshot_json === "string") {
      try { snapshot = JSON.parse(row.snapshot_json || "{}"); }
      catch (_) { parseErrors += 1; continue; }
    }
    snapshot = snapshot || {};
    const inst = snapshot?.institution || {};
    const volume = snapshot?.volume || {};
    const values = {
      score: institutionalObserverNumber(inst.score),
      foreignBuyDays: institutionalObserverNumber(inst.foreignBuyDays),
      trustBuyDays: institutionalObserverNumber(inst.trustBuyDays),
      dealerBuyDays: institutionalObserverNumber(inst.dealerBuyDays),
      foreignNet: institutionalObserverNumber(inst.foreignNet),
      trustNet: institutionalObserverNumber(inst.trustNet),
      dealerNet: institutionalObserverNumber(inst.dealerNet),
      institutionTotalNet: institutionalObserverNumber(inst.institutionTotalNet),
      chipConcentration: institutionalObserverNumber(inst.chipConcentration),
      avgVolume20Lots: institutionalObserverNumber(volume.avgVolume20Lots)
    };

    const missing = required.filter(k => values[k] === null);
    for (const k of missing) missingCounts[k] += 1;
    if (missing.length) continue;

    const foreignNet = values.foreignNet;
    const trustNet = values.trustNet;
    const dealerNet = values.dealerNet;
    const currentBuy = foreignNet > 0 || trustNet > 0 || dealerNet > 0;
    const synced = foreignNet > 0 && trustNet > 0 && dealerNet > 0;
    const actorDivergence =
      [foreignNet, trustNet, dealerNet].some(x => x > 0) &&
      [foreignNet, trustNet, dealerNet].some(x => x < 0);

    const streakLinearContribution =
      values.foreignBuyDays * 8 +
      values.trustBuyDays * 10 +
      values.dealerBuyDays * 4;
    const consensusInteractionContribution =
      (synced ? 15 : 0) + (currentBuy ? 6 : 0);
    const avgVolumeShares = Math.max(1, values.avgVolume20Lots * 1000);
    const netRatio = Math.max(0, values.institutionTotalNet / avgVolumeShares);
    const aggregateNetIntensityContribution =
      institutionalObserverClamp(netRatio * 25, 0, 25);
    const largeHolderConcentrationContribution = values.chipConcentration * 0.15;
    const preClampInstitutionalScore =
      streakLinearContribution +
      consensusInteractionContribution +
      aggregateNetIntensityContribution +
      largeHolderConcentrationContribution;
    const reconstructedScore =
      institutionalObserverClamp(preClampInstitutionalScore, 0, 100);
    const roundedReconstructed = institutionalObserverRound(reconstructedScore, 2);
    const roundedStored = institutionalObserverRound(values.score, 2);
    const reconstructionMatches =
      roundedReconstructed !== null && roundedStored !== null &&
      Math.abs(roundedReconstructed - roundedStored) <= 0.011;

    if (!reconstructionMatches) reconstructionMismatchRows += 1;
    const saturated = reconstructedScore >= 100 - 1e-9 || values.score >= 99.995;
    if (saturated) saturatedRows += 1;
    if (aggregateNetIntensityContribution >= 25 - 1e-9) netIntensityCappedRows += 1;
    if (actorDivergence) actorDivergenceRows += 1;
    if (synced) allThreePositiveRows += 1;
    if (currentBuy) anyCurrentBuyRows += 1;
    if (values.institutionTotalNet < 0 && currentBuy) aggregateNetNegativeButAnyActorPositiveRows += 1;
    if (values.institutionTotalNet > 0 && [foreignNet, trustNet, dealerNet].some(x => x < 0)) {
      aggregateNetPositiveButAnyActorNegativeRows += 1;
    }

    const record = {
      scanDate: String(row?.scan_date || row?.scanDate || ""),
      cohort: String(row?.cohort || "UNKNOWN"),
      pool: String(row?.pool || "UNKNOWN"),
      score: values.score,
      streakLinearContribution,
      consensusInteractionContribution,
      aggregateNetIntensityContribution,
      largeHolderConcentrationContribution,
      preClampInstitutionalScore,
      reconstructedScore,
      saturated,
      actorDivergence,
      currentBuy,
      synced,
      concentrationShareOfPreClamp:
        preClampInstitutionalScore > 0
          ? largeHolderConcentrationContribution / preClampInstitutionalScore
          : null
    };
    clean.push(record);

    byCohort[record.cohort] ||= { rows: 0, saturated: 0, actorDivergence: 0 };
    byCohort[record.cohort].rows += 1;
    if (saturated) byCohort[record.cohort].saturated += 1;
    if (actorDivergence) byCohort[record.cohort].actorDivergence += 1;

    byDate[record.scanDate] ||= { rows: 0, saturated: 0, actorDivergence: 0 };
    byDate[record.scanDate].rows += 1;
    if (saturated) byDate[record.scanDate].saturated += 1;
    if (actorDivergence) byDate[record.scanDate].actorDivergence += 1;
  }

  const pct = (n, d) => d > 0 ? institutionalObserverRound(n / d * 100, 2) : null;
  for (const x of Object.values(byCohort)) {
    x.saturatedPct = pct(x.saturated, x.rows);
    x.actorDivergencePct = pct(x.actorDivergence, x.rows);
  }
  for (const x of Object.values(byDate)) {
    x.saturatedPct = pct(x.saturated, x.rows);
    x.actorDivergencePct = pct(x.actorDivergence, x.rows);
  }

  const components = {
    streakLinear: clean.map(x => x.streakLinearContribution),
    consensusInteraction: clean.map(x => x.consensusInteractionContribution),
    aggregateNetIntensity: clean.map(x => x.aggregateNetIntensityContribution),
    largeHolderConcentration: clean.map(x => x.largeHolderConcentrationContribution),
    preClampScore: clean.map(x => x.preClampInstitutionalScore),
    storedScore: clean.map(x => x.score)
  };
  const correlationPairs = [
    ["streakLinear", "consensusInteraction"],
    ["streakLinear", "aggregateNetIntensity"],
    ["streakLinear", "largeHolderConcentration"],
    ["consensusInteraction", "aggregateNetIntensity"],
    ["consensusInteraction", "largeHolderConcentration"],
    ["aggregateNetIntensity", "largeHolderConcentration"],
    ["preClampScore", "storedScore"]
  ];
  const correlations = {};
  for (const [a, b] of correlationPairs) {
    correlations[a + "__" + b] = institutionalObserverRound(
      institutionalObserverPearson(components[a], components[b]), 4
    );
  }

  return {
    schemaVersion: "INSTITUTIONAL_SCORE_DECOMPOSITION_OBSERVER_V0_1",
    researchOnly: true,
    decisionImpact: false,
    formalCoreImpact: false,
    outcomesUsed: false,
    rows: (rows || []).length,
    parsedRows: (rows || []).length - parseErrors,
    decompositionReadyRows: clean.length,
    decompositionReadyPct: pct(clean.length, (rows || []).length),
    distinctScanDates: new Set(clean.map(x => x.scanDate).filter(Boolean)).size,
    parseErrors,
    missingCounts,
    reconstructionMismatchRows,
    reconstructionMatchPct: pct(clean.length - reconstructionMismatchRows, clean.length),
    saturatedRows,
    saturatedPct: pct(saturatedRows, clean.length),
    netIntensityCappedRows,
    netIntensityCappedPct: pct(netIntensityCappedRows, clean.length),
    anyCurrentBuyRows,
    anyCurrentBuyPct: pct(anyCurrentBuyRows, clean.length),
    allThreePositiveRows,
    allThreePositivePct: pct(allThreePositiveRows, clean.length),
    actorDivergenceRows,
    actorDivergencePct: pct(actorDivergenceRows, clean.length),
    aggregateNetNegativeButAnyActorPositiveRows,
    aggregateNetPositiveButAnyActorNegativeRows,
    contributionStats: {
      streakLinear: institutionalObserverStats(components.streakLinear),
      consensusInteraction: institutionalObserverStats(components.consensusInteraction),
      aggregateNetIntensity: institutionalObserverStats(components.aggregateNetIntensity),
      largeHolderConcentration: institutionalObserverStats(components.largeHolderConcentration),
      concentrationShareOfPreClamp: institutionalObserverStats(clean.map(x => x.concentrationShareOfPreClamp)),
      preClampScore: institutionalObserverStats(components.preClampScore),
      storedScore: institutionalObserverStats(components.storedScore)
    },
    correlations,
    byCohort,
    byDate,
    interpretationGuard:
      "Outcome-blind structural diagnostics only. Rows within one scanDate are not independent evidence. TDCC ownership-vintage independence remains UNKNOWN until chipAsOfDate is preserved.",
    sourceSemanticsGuard:
      "Snapshot serialization may already coerce missing buy-day streaks to zero upstream; this observer never upgrades serialized zeros into proof of source completeness."
  };
}
