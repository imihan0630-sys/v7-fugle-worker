import assert from "node:assert/strict";
import {
  PATTERN_CORE_VERSION,
  buildShadowParentReference,
  compareShadowParentReferences,
  validatePatternSeriesEnvelope,
  validatePatternBars,
  detectDirectionalChangeSwings,
  detectDirectionalChangeSwingsAtr,
  detectSwingScaleFamily,
  simpleAtrBeforeIndex,
  buildFrozenResistanceZoneVersions,
  buildResistanceZones,
  detectWFromSwings,
  detectVcpFromSwings,
  detectPlatform,
  classifyVShape,
  classifyCorporateActionGap,
  classifyLimitBreakout,
  classifyDeadLiquidityTightBase,
  classifyNestedResistance,
  classifyEventGapBreakout,
  classifyRepeatedResistanceTests,
  buildPatternSnapshot,
  replayPatternSnapshot
} from "../research/pattern_core_v0_1.mjs";

function makeBars(closes, { startDay = 1, volume = 100, turnover = 2_000_000, tickPad = 0.2 } = {}) {
  return closes.map((close, i) => {
    const prev = i ? closes[i - 1] : close;
    const open = prev;
    const high = Math.max(open, close) + tickPad;
    const low = Math.min(open, close) - tickPad;
    return {
      date: "2026-01-" + String(startDay + i).padStart(2, "0"),
      open, high, low, close,
      volume: Array.isArray(volume) ? volume[i] : volume,
      turnover: Array.isArray(turnover) ? turnover[i] : turnover
    };
  });
}

function scaled(bars, k) {
  return bars.map(x => ({
    ...x,
    open: x.open * k,
    high: x.high * k,
    low: x.low * k,
    close: x.close * k
  }));
}

// Shadow parent reference: natural key stays (scan_date,symbol), while snapshot hash detects rerun drift.
{
  const p1 = buildShadowParentReference({
    scanDate: "2026-09-25",
    symbol: "1234",
    parentSnapshot: { cohort:"NEAR_MISS", rank:2, setup:{x:1} }
  });
  const p1Replay = buildShadowParentReference({
    scanDate: "2026-09-25",
    symbol: "1234",
    parentSnapshot: { setup:{x:1}, rank:2, cohort:"NEAR_MISS" }
  });
  const p2 = buildShadowParentReference({
    scanDate: "2026-09-25",
    symbol: "1234",
    parentSnapshot: { cohort:"SELECTED", rank:1, setup:{x:1} }
  });
  const other = buildShadowParentReference({
    scanDate: "2026-09-25",
    symbol: "5678",
    parentSnapshot: { cohort:"NEAR_MISS" }
  });
  assert.equal(p1.shadowParentKey, "2026-09-25|1234");
  assert.equal(compareShadowParentReferences(p1, p1Replay).status, "SAME_PARENT_EXACT");
  assert.equal(compareShadowParentReferences(p1, p2).status, "PROVENANCE_CONFLICT");
  assert.equal(compareShadowParentReferences(p1, other).status, "DIFFERENT_PARENT");
}

// Series semantic-space firewall: provider adjustment coercion cannot masquerade as RAW.
{
  const bars = makeBars([100,101,100.5]);
  const common = {
    sourceId:"fixture-source",
    payloadHash:"abc123",
    pointInTimeEligible:true,
    corporateActionSemanticsReady:true
  };

  const raw = validatePatternSeriesEnvelope({
    role:"RAW_EXECUTION",
    semanticSpace:"RAW_EXECUTION",
    bars,
    provenance:{...common,requestedAdjustmentMode:false,returnedAdjustmentMode:false}
  });
  assert.equal(raw.status, "VALID");

  const coerced = validatePatternSeriesEnvelope({
    role:"RAW_EXECUTION",
    semanticSpace:"RAW_EXECUTION",
    bars,
    provenance:{...common,requestedAdjustmentMode:false,returnedAdjustmentMode:true}
  });
  assert.equal(coerced.reason, "ADJUSTMENT_MODE_MISMATCH");

  const wrongGeometry = validatePatternSeriesEnvelope({
    role:"GEOMETRY",
    semanticSpace:"RAW_EXECUTION",
    bars,
    provenance:common
  });
  assert.equal(wrongGeometry.reason, "GEOMETRY_REQUIRES_TECHNICAL_CONTINUITY");

  const geometry = validatePatternSeriesEnvelope({
    role:"GEOMETRY",
    semanticSpace:"TECHNICAL_CONTINUITY",
    bars,
    provenance:common
  });
  assert.equal(geometry.status, "VALID");

  const unknownAction = validatePatternSeriesEnvelope({
    role:"GEOMETRY",
    semanticSpace:"TECHNICAL_CONTINUITY",
    bars,
    provenance:{...common,corporateActionSemanticsReady:false}
  });
  assert.equal(unknownAction.reason, "CORPORATE_ACTION_SEMANTICS_UNKNOWN");
}

// Data validator: duplicate, ordering and OPEN honesty.
{
  const ok = makeBars([10, 11, 10.5]);
  assert.equal(validatePatternBars({ bars: ok }).usable, true);
  const duplicate = [...ok, { ...ok.at(-1) }];
  assert.equal(validatePatternBars({ bars: duplicate }).reason, "DUPLICATE_BAR_DATE");
  const reversed = [ok[1], ok[0], ok[2]];
  assert.equal(validatePatternBars({ bars: reversed }).reason, "OUT_OF_ORDER_BAR_DATE");
  const missingOpen = ok.map(x => ({ ...x, open: null }));
  assert.equal(validatePatternBars({ bars: missingOpen, requireOpen: true }).reason, "OPEN_MISSING");
  assert.equal(validatePatternBars({ bars: missingOpen, requireOpen: false }).usable, true);
}

// C1 V-shaped crash/rebound.
{
  const bars = makeBars([100, 98, 94, 86, 78, 82, 90, 97, 101], {
    volume: [100,110,130,180,240,220,180,150,140]
  });
  const c1 = classifyVShape(bars, { asOfDate: bars.at(-1).date });
  assert.equal(c1.vShapedBase, true);
  assert.ok(c1.bottomResidenceBars <= 2);
  assert.equal(c1.highConfidenceCup, false);

  // Prefix replay: future suffix cannot backdate a different historical snapshot.
  for (let i = 4; i < bars.length; i += 1) {
    const prefix = bars.slice(0, i + 1);
    const asOfDate = prefix.at(-1).date;
    const a = buildPatternSnapshot({ bars: prefix, asOfDate, swingThresholdPct: 0.05 });
    const b = buildPatternSnapshot({ bars, asOfDate, swingThresholdPct: 0.05 });
    assert.deepEqual(a, b);
  }
}

// C2 wide-loose base: not mature VCP.
// Topology oracle is fed confirmed swings directly so this test isolates VCP classification
// from the separate swing-extraction oracle below.
{
  const swings = [
    { type:"HIGH", pivotAt:"2026-01-01", confirmedAt:"2026-01-02", pivotPrice:100 },
    { type:"LOW",  pivotAt:"2026-01-02", confirmedAt:"2026-01-03", pivotPrice:82 },
    { type:"HIGH", pivotAt:"2026-01-03", confirmedAt:"2026-01-04", pivotPrice:99 },
    { type:"LOW",  pivotAt:"2026-01-04", confirmedAt:"2026-01-05", pivotPrice:80 },
    { type:"HIGH", pivotAt:"2026-01-05", confirmedAt:"2026-01-06", pivotPrice:98 },
    { type:"LOW",  pivotAt:"2026-01-06", confirmedAt:"2026-01-07", pivotPrice:79 }
  ];
  const vcp = detectVcpFromSwings(swings, { wideLooseDepthPct: 0.15 });
  assert.equal(vcp.contractionCount, 3);
  assert.equal(vcp.mature, false);
  assert.equal(vcp.maturityStatus, "TOPOLOGY_ONLY_NEEDS_RANGE_VOLUME");
  assert.equal(vcp.wideLoose, true);
}

// C3 ex-dividend mechanical reset: raw price is guarded; residual morphology gap is tested separately.
{
  const out = classifyCorporateActionGap({
    rawPrev: { close: 101 },
    rawCurrent: { open: 91 },
    morphologyPrev: { close: 91.5 },
    morphologyCurrent: { open: 91 },
    corporateActionTag: true,
    adjustmentReady: true,
    gapThresholdPct: 0.02
  });
  assert.ok(Math.abs(out.rawGapPct) > 0.09);
  assert.ok(Math.abs(out.morphologyGapPct) < 0.01);
  assert.equal(out.mechanicalDiscontinuityNeutralized, true);
  assert.equal(out.rawGapPatternEligible, false);
  assert.equal(out.morphologyGapPatternEligible, true);
  assert.equal(out.residualPatternGapFlag, false);
  assert.equal(out.rawWUndercutEligible, false);
  assert.equal(out.morphologyWUndercutEligible, true);

  const blocked = classifyCorporateActionGap({
    rawPrev: { close: 101 },
    rawCurrent: { open: 91 },
    morphologyPrev: { close: 91.5 },
    morphologyCurrent: { open: 91 },
    corporateActionTag: true,
    adjustmentReady: false
  });
  assert.equal(blocked.status, "DATA_BLOCKED");
}

// Real cross-lane mechanics witnesses: corporate-action adjustment removes only the mechanical component.
// 2412 residual gap is tiny after the official 134.3 continuity anchor.
// 8454 retains a genuine positive residual gap versus its 1/1.05 ex-right reference.
{
  const cht = classifyCorporateActionGap({
    rawPrev: { close: 139.5 },
    rawCurrent: { open: 134 },
    morphologyPrev: { close: 134.3 },
    morphologyCurrent: { open: 134 },
    corporateActionTag: true,
    adjustmentReady: true,
    gapThresholdPct: 0.02
  });
  assert.equal(cht.residualPatternGapFlag, false);
  assert.ok(Math.abs(cht.morphologyGapPct) < 0.003);

  const momo = classifyCorporateActionGap({
    rawPrev: { close: 272 },
    rawCurrent: { open: 265 },
    morphologyPrev: { close: 272 / 1.05 },
    morphologyCurrent: { open: 265 },
    corporateActionTag: true,
    adjustmentReady: true,
    gapThresholdPct: 0.02
  });
  assert.equal(momo.rawGapPatternEligible, false);
  assert.equal(momo.morphologyGapPatternEligible, true);
  assert.equal(momo.residualPatternGapFlag, true);
  assert.ok(momo.morphologyGapPct > 0.02);

  // TPEx 5314: official par-value change 10 -> 0.5, one old share -> 20 new shares.
  // 2025-03-19 raw close 1390 maps to a 69.5 continuity/reference anchor.
  // 2025-03-31 raw open 69 therefore has only a small residual gap after the mechanical reset.
  const century = classifyCorporateActionGap({
    rawPrev: { close: 1390 },
    rawCurrent: { open: 69 },
    morphologyPrev: { close: 1390 / 20 },
    morphologyCurrent: { open: 69 },
    corporateActionTag: true,
    adjustmentReady: true,
    gapThresholdPct: 0.02
  });
  assert.equal(century.rawGapPatternEligible, false);
  assert.equal(century.morphologyGapPatternEligible, true);
  assert.equal(century.residualPatternGapFlag, false);
  assert.ok(Math.abs(century.morphologyGapPct) < 0.01);
}

// C4 limit-up breakout: acceptance remains unresolved on the constrained bar.
{
  const out = classifyLimitBreakout({
    priorResistance: 100,
    referencePrice: 100,
    bar: { open: 100, high: 110, low: 100, close: 110 },
    priceLimitPct: 0.10
  });
  assert.equal(out.localBreakout, true);
  assert.equal(out.priceLimitConstrained, true);
  assert.equal(out.acceptanceState, "UNRESOLVED");
}

// C5 dead-liquidity tight base: tiny geometric range cannot become healthy compression by itself.
{
  const closes = [50.00,50.05,50.00,50.05,50.00,50.05,50.00,50.05];
  const bars = closes.map((close, i) => ({
    date: "2026-02-" + String(i + 1).padStart(2, "0"),
    open: close,
    high: close,
    low: close,
    close,
    volume: 1,
    turnover: 10_000
  }));
  const out = classifyDeadLiquidityTightBase({ bars, tickSize: 0.05, minHealthyTurnover: 1_000_000 });
  assert.equal(out.geometricTightness, true);
  assert.equal(out.tickDominanceHigh, true);
  assert.equal(out.liquidityQualityLow, true);
  assert.equal(out.healthyCompressionConfidence, "REDUCED_OR_UNKNOWN");
}

// C6 local 20d breakout into major resistance.
{
  const out = classifyNestedResistance({
    localResistance: 100,
    majorZoneCenter: 103,
    currentClose: 101.5,
    majorTolerancePct: 0.01
  });
  assert.equal(out.localBreakout, true);
  assert.equal(out.majorZoneConflict, true);
  assert.equal(out.nestedConflictState, "LOCAL_BREAKOUT_BELOW_MAJOR_ZONE");
  assert.ok(out.availableAirPct > 0 && out.availableAirPct < 0.01);
}

// C7 event-created gap breakout: overnight and intraday pieces remain separate.
{
  const out = classifyEventGapBreakout({
    previousClose: 100,
    resistance: 105,
    bar: { open: 108, high: 112, low: 107, close: 110 },
    eventProvenanceKnown: true
  });
  assert.equal(out.gapBreakout, true);
  assert.equal(out.eventCreated, true);
  assert.ok(Math.abs(out.overnightReturn - 0.08) < 1e-12);
  assert.ok(Math.abs(out.intradayReturn - (110/108 - 1)) < 1e-12);
  assert.equal(out.attribution, "EVENT_AND_PRIOR_PATTERN_SEPARATE");

  const unknown = classifyEventGapBreakout({
    previousClose: 100,
    resistance: 105,
    bar: { open: 108, high: 112, low: 107, close: 110 },
    eventProvenanceKnown: false
  });
  assert.equal(unknown.attribution, "UNKNOWN");
}

// C8 repeated resistance: equal touch count can imply different progression states.
{
  const absorption = classifyRepeatedResistanceTests([
    { low: 96, close: 98, resistance: 100 },
    { low: 97, close: 99, resistance: 100 },
    { low: 98.5, close: 99.7, resistance: 100 }
  ]);
  const barrier = classifyRepeatedResistanceTests([
    { low: 96, close: 98, resistance: 100 },
    { low: 95.8, close: 97.9, resistance: 100 },
    { low: 96.1, close: 98.0, resistance: 100 }
  ]);
  assert.equal(absorption.touchCount, barrier.touchCount);
  assert.equal(absorption.progression, "ABSORPTION_LIKE");
  assert.equal(barrier.progression, "BARRIER_PERSISTENT_OR_AMBIGUOUS");
}

// Swing chronology and W topology use confirmedAt; no future pivot confirmation is backdated.
{
  const bars = makeBars([100, 94, 88, 92, 99, 94, 89, 95, 101, 98]);
  const { swings } = detectDirectionalChangeSwings({ bars, asOfDate: bars.at(-1).date, thresholdPct: 0.05 });
  for (const s of swings) assert.ok(s.confirmedAt >= s.pivotAt);
  const w = detectWFromSwings(swings, { lowTolerancePct: 0.08 });
  assert.equal(typeof w.formed, "boolean");
}

// Frozen-architecture swing engine: lagged ATR threshold is frozen per leg and supports MICRO/BASE/MAJOR.
{
  const closes = [
    ...Array.from({ length: 25 }, (_, i) => 100 + (i % 2 === 0 ? 0.1 : -0.1)),
    100,106,109,103,97,104,110,102,96,105,112,108,101,109
  ];
  const base = Date.UTC(2026, 2, 1);
  const bars = closes.map((close, i) => {
    const previous = i ? closes[i - 1] : close;
    const day = new Date(base + i * 86400000).toISOString().slice(0, 10);
    return {
      date: day,
      open: previous,
      high: Math.max(previous, close) + 0.2,
      low: Math.min(previous, close) - 0.2,
      close,
      volume: 1000,
      turnover: 5_000_000
    };
  });

  const atr = simpleAtrBeforeIndex(bars, 20, 20);
  assert.ok(atr > 0);

  const baseScale = detectDirectionalChangeSwingsAtr({
    bars,
    asOfDate: bars.at(-1).date,
    scaleK: 2,
    atrPeriod: 20
  });
  assert.equal(baseScale.status, "VALID");
  assert.ok(baseScale.swings.length >= 3);
  for (const swing of baseScale.swings) {
    assert.ok(swing.confirmedAt >= swing.pivotAt);
    assert.ok(swing.thresholdFrozenAt < swing.confirmedAt);
    assert.ok(swing.thresholdPct > 0);
    assert.equal(swing.scaleK, 2);
    assert.equal(swing.atrPeriod, 20);
  }

  const family = detectSwingScaleFamily({ bars, asOfDate: bars.at(-1).date, atrPeriod: 20 });
  assert.equal(family.method, "DIRECTIONAL_CHANGE_LAGGED_ATR_FROZEN");
  for (const key of ["MICRO","BASE","MAJOR"]) {
    assert.equal(family.scales[key].status, "VALID");
    assert.ok(family.scales[key].swings.every(x => x.thresholdPct > 0));
  }

  // Prefix invariance for confirmed ATR-based states.
  for (let cut = 28; cut < bars.length; cut += 2) {
    const prefix = bars.slice(0, cut + 1);
    const asOfDate = prefix.at(-1).date;
    const a = detectDirectionalChangeSwingsAtr({ bars: prefix, asOfDate, scaleK: 2, atrPeriod: 20 });
    const b = detectDirectionalChangeSwingsAtr({ bars, asOfDate, scaleK: 2, atrPeriod: 20 });
    assert.deepEqual(a, b);
  }
}

// Frozen structural zones: a later confirmed touch creates a successor version, not a rewrite.
{
  const base = Date.UTC(2026, 4, 1);
  const bars = Array.from({ length: 45 }, (_, i) => {
    const date = new Date(base + i * 86400000).toISOString().slice(0, 10);
    const close = 100 + (i % 2 === 0 ? 0.1 : -0.1);
    return {
      date,
      open: 100,
      high: 100.4,
      low: 99.6,
      close,
      volume: 1000,
      turnover: 5_000_000
    };
  });
  const at = i => bars[i].date;
  const swings = [
    { type:"HIGH", pivotAt:at(21), confirmedAt:at(23), pivotPrice:100.0 },
    { type:"LOW",  pivotAt:at(24), confirmedAt:at(25), pivotPrice:97.0 },
    { type:"HIGH", pivotAt:at(27), confirmedAt:at(29), pivotPrice:100.1 },
    { type:"LOW",  pivotAt:at(30), confirmedAt:at(31), pivotPrice:97.5 },
    { type:"HIGH", pivotAt:at(34), confirmedAt:at(36), pivotPrice:99.9 }
  ];
  const out = buildFrozenResistanceZoneVersions({
    bars,
    swings,
    asOfDate: bars.at(-1).date,
    scaleName: "BASE",
    lookbackSessions: 45,
    atrPeriod: 20,
    atrWidthMultiple: 0.25,
    minTouches: 2
  });
  assert.equal(out.status, "VALID");
  assert.equal(out.versions.length, 2);
  assert.equal(out.versions[0].version, 1);
  assert.equal(out.versions[0].touchCount, 2);
  assert.equal(out.versions[1].version, 2);
  assert.equal(out.versions[1].touchCount, 3);
  assert.equal(out.versions[0].zoneId, out.versions[1].zoneId);
  assert.deepEqual(out.versions[0].anchorPivotDates, [at(21), at(27)]);
  assert.deepEqual(out.versions[1].anchorPivotDates, [at(21), at(27), at(34)]);
  assert.equal(out.versions[0].immutable, true);
  assert.equal(out.versions[1].immutable, true);

  // Replaying as-of the second touch must recover exactly the original first version.
  const replay = buildFrozenResistanceZoneVersions({
    bars,
    swings,
    asOfDate: at(29),
    scaleName: "BASE",
    lookbackSessions: 45,
    atrPeriod: 20,
    atrWidthMultiple: 0.25,
    minTouches: 2
  });
  assert.equal(replay.versions.length, 1);
  assert.deepEqual(replay.versions[0], out.versions[0]);
}

// Structural resistance zones need repeated confirmed swing highs.
{
  const swings = [
    { type:"HIGH", pivotAt:"2026-01-01", confirmedAt:"2026-01-03", pivotPrice:100 },
    { type:"LOW",  pivotAt:"2026-01-04", confirmedAt:"2026-01-05", pivotPrice:94 },
    { type:"HIGH", pivotAt:"2026-01-08", confirmedAt:"2026-01-10", pivotPrice:100.8 },
    { type:"HIGH", pivotAt:"2026-01-15", confirmedAt:"2026-01-17", pivotPrice:110 }
  ];
  const zones = buildResistanceZones(swings, { tolerancePct: 0.015, minTouches: 2 });
  assert.equal(zones.length, 1);
  assert.equal(zones[0].touchCount, 2);
  assert.equal(zones[0].stable, true);
}

// Platform primitive is geometry-only and outcome-agnostic.
{
  const bars = makeBars([100,100.5,100.2,100.4,100.1], { tickPad: 0.1 });
  const p = detectPlatform(bars, { asOfDate: bars.at(-1).date, minBars: 5, maxRangePct: 0.02 });
  assert.equal(p.formed, true);
}

// Price-scale invariance: multiplying OHLC by a constant preserves normalized topology.
{
  const bars = makeBars([100, 92, 98, 90, 99, 94, 101, 97, 103]);
  const a = buildPatternSnapshot({ bars, asOfDate: bars.at(-1).date, swingThresholdPct: 0.05 });
  const b = buildPatternSnapshot({ bars: scaled(bars, 10), asOfDate: bars.at(-1).date, swingThresholdPct: 0.05 });
  assert.deepEqual(
    a.swings.map(x => ({ type:x.type, pivotAt:x.pivotAt, confirmedAt:x.confirmedAt })),
    b.swings.map(x => ({ type:x.type, pivotAt:x.pivotAt, confirmedAt:x.confirmedAt }))
  );
  assert.equal(a.w.formed, b.w.formed);
  assert.equal(a.vcp.mature, b.vcp.mature);
  assert.equal(a.platform.formed, b.platform.formed);
}

// Replay exactness and research firewall.
{
  const bars = makeBars([100,95,90,96,102,98,104]);
  const args = { bars, asOfDate: bars.at(-1).date, swingThresholdPct: 0.05 };
  const original = buildPatternSnapshot(args);
  const replay = replayPatternSnapshot(args).replay;
  assert.deepEqual(original, replay);
  assert.equal(original.snapshotHash, replay.snapshotHash);
  assert.equal(original.detectorVersion, PATTERN_CORE_VERSION);
  assert.equal(original.researchOnly, true);
  assert.equal(original.decisionImpact, false);
}

console.log("pattern core v0.1 C1-C8 and invariance tests passed");
