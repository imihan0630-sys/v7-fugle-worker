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
  analyzeVcpContext,
  analyzeWLifecycle,
  analyzePlatformLifecycle,
  detectPlatform,
  classifyVShape,
  classifyCorporateActionGap,
  classifyLimitBreakout,
  classifyDeadLiquidityTightBase,
  classifyNestedResistance,
  classifyEventGapBreakout,
  classifyRepeatedResistanceTests,
  analyzeMajorZoneLifecycle,
  buildPatternSnapshot,
  replayPatternSnapshot
} from "../research/pattern_core_v0_1.mjs";
import {
  buildPatternCacheRecord,
  comparePatternCacheRecords,
  buildPatternObservability,
  attachPatternQaMetrics,
  buildPatternEpisodeReference,
  comparePatternEpisodeReferences,
  buildPatternRunReceipt
} from "../research/pattern_observer_adapter_v0_1.mjs";

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

// VCP full context: shrinking contractions + improving lows + declining sell volume/range can mature
// only when prior-trend context is compatible. No future return is consulted.
{
  const closes = [90,95,100,91,82,90,98,93,88,94,97,94,92,93,93.5,94,94.2];
  const volumes = [220,240,300,280,260,230,200,180,160,140,120,100,80,70,60,55,50];
  const bars = makeBars(closes, { volume:volumes, turnover:closes.map((_,i)=>5_000_000-i*100_000) });
  const swings = [
    { type:"HIGH", pivotAt:bars[2].date, confirmedAt:bars[4].date, pivotPrice:100, pivotIndex:2 },
    { type:"LOW",  pivotAt:bars[4].date, confirmedAt:bars[5].date, pivotPrice:82,  pivotIndex:4 },
    { type:"HIGH", pivotAt:bars[6].date, confirmedAt:bars[8].date, pivotPrice:98,  pivotIndex:6 },
    { type:"LOW",  pivotAt:bars[8].date, confirmedAt:bars[9].date, pivotPrice:88,  pivotIndex:8 },
    { type:"HIGH", pivotAt:bars[10].date, confirmedAt:bars[12].date, pivotPrice:97, pivotIndex:10 },
    { type:"LOW",  pivotAt:bars[12].date, confirmedAt:bars[13].date, pivotPrice:92, pivotIndex:12 }
  ];
  const mature = analyzeVcpContext({
    bars, swings, asOfDate:bars.at(-1).date, priorTrendState:"UPTREND", finalWindowBars:5
  });
  assert.equal(mature.status, "VALID");
  assert.equal(mature.contractionCount, 3);
  assert.ok(mature.depthMonotonicity > 0);
  assert.ok(mature.lowProgression > 0);
  assert.equal(mature.downVolumeDecay, true);
  assert.equal(mature.downRangeDecay, true);
  assert.ok(mature.finalDryUpRatio < 1);
  assert.ok(mature.finalRangeRatio < 1);
  assert.equal(mature.maturityState, "MATURE");

  const wrongContext = analyzeVcpContext({
    bars, swings, asOfDate:bars.at(-1).date, priorTrendState:"DOWNTREND", finalWindowBars:5
  });
  assert.equal(wrongContext.maturityState, "GENERIC_COMPRESSION_NOT_CONTINUATION_VCP");

  const unknownContext = analyzeVcpContext({
    bars, swings, asOfDate:bars.at(-1).date, priorTrendState:"UNKNOWN", finalWindowBars:5
  });
  assert.equal(unknownContext.maturityState, "VALID_CONTEXT_UNKNOWN");
}

// W lifecycle: true neckline comes from MID_HIGH, undercut/reclaim is distinct, and future bars do not backdate state.
{
  const closes = [
    ...Array.from({length:20},(_,i)=>110-i*0.4),
    101,98,96,99,104,101,97,95.5,97,101,104,106,103.5,105
  ];
  const bars = makeBars(closes,{startDay:1,volume:closes.map((_,i)=>200-i)});
  const swings = [
    {type:"LOW",pivotAt:bars[22].date,confirmedAt:bars[23].date,pivotPrice:95.8},
    {type:"HIGH",pivotAt:bars[24].date,confirmedAt:bars[26].date,pivotPrice:104.2},
    {type:"LOW",pivotAt:bars[27].date,confirmedAt:bars[28].date,pivotPrice:95.3}
  ];
  const structureDate=bars[28].date;
  const structure=analyzeWLifecycle({bars,swings,asOfDate:structureDate,priorTrendState:"DOWNTREND"});
  assert.equal(structure.status,"VALID");
  assert.equal(structure.family,"REVERSAL_W");
  assert.equal(structure.necklinePrice,104.2);
  assert.ok(["W_STRUCTURE_VALID","W_UNDERCUT_RECLAIM","W_NECKLINE_APPROACH"].includes(structure.lifecycle));

  const full=analyzeWLifecycle({bars,swings,asOfDate:bars.at(-1).date,priorTrendState:"DOWNTREND"});
  assert.equal(full.breakoutAt!==null,true);
  assert.ok(["W_BREAKOUT_CONFIRMED","W_RETEST_CONFIRMING"].includes(full.lifecycle));

  const replay=analyzeWLifecycle({bars:bars.slice(0,29),swings,asOfDate:structureDate,priorTrendState:"DOWNTREND"});
  assert.deepEqual(replay,structure);
}

// Platform lifecycle: repeated confirmed upper/lower touches are required; simple narrow range alone is not enough.
{
  const closes=[
    ...Array.from({length:20},()=>100),
    100,104.8,101,95.2,99,105.1,101,95.1,99.5,104.9,101,95.3,99.8,102,100.5
  ];
  const volumes=closes.map((_,i)=>i<25?200:Math.max(60,180-(i-25)*12));
  const bars=makeBars(closes,{startDay:1,volume:volumes,tickPad:0.1});
  const swings=[
    {type:"HIGH",pivotAt:bars[21].date,confirmedAt:bars[23].date,pivotPrice:105.0},
    {type:"LOW", pivotAt:bars[23].date,confirmedAt:bars[24].date,pivotPrice:95.0},
    {type:"HIGH",pivotAt:bars[25].date,confirmedAt:bars[27].date,pivotPrice:105.1},
    {type:"LOW", pivotAt:bars[27].date,confirmedAt:bars[28].date,pivotPrice:95.1},
    {type:"HIGH",pivotAt:bars[29].date,confirmedAt:bars[31].date,pivotPrice:104.9},
    {type:"LOW", pivotAt:bars[31].date,confirmedAt:bars[32].date,pivotPrice:95.2}
  ];
  const p=analyzePlatformLifecycle({bars,swings,asOfDate:bars.at(-1).date,atrPeriod:20});
  assert.equal(p.status,"VALID");
  assert.equal(p.topologyValid,true);
  assert.ok(p.upperTouchCount>=2);
  assert.ok(p.lowerTouchCount>=2);
  assert.ok(["PLATFORM_VALID","PLATFORM_TIGHT"].includes(p.lifecycle));
  assert.ok(p.resistanceLevel>p.supportLevel);

  const insufficient=analyzePlatformLifecycle({
    bars,
    swings:swings.slice(0,2),
    asOfDate:bars.at(-1).date,
    atrPeriod:20
  });
  assert.equal(insufficient.lifecycle,"PLATFORM_FORMING");
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


// Isolated Pattern research-cache adapter: Corporate Actions semantic spaces remain explicit,
// Shadow parent provenance is immutable, and no Formal behavior is exposed.
{
  const bars = makeBars([100, 98, 96, 99, 101, 100, 102]);
  const parent = buildShadowParentReference({
    scanDate:"2026-09-25",
    symbol:"1234",
    parentSnapshot:{cohort:"NEAR_MISS",pool:"FORMAL_GENERAL",rank:4}
  });
  const commonProv = {
    sourceId:"cross-lane-fixture",
    payloadHash:"geom-v1",
    pointInTimeEligible:true,
    corporateActionSemanticsReady:true
  };
  const geometry = validatePatternSeriesEnvelope({
    role:"GEOMETRY",
    semanticSpace:"TECHNICAL_CONTINUITY",
    bars,
    provenance:commonProv
  });
  const raw = validatePatternSeriesEnvelope({
    role:"RAW_EXECUTION",
    semanticSpace:"RAW_EXECUTION",
    bars,
    provenance:{...commonProv,payloadHash:"raw-v1",requestedAdjustmentMode:false,returnedAdjustmentMode:false}
  });
  const snapshot = buildPatternSnapshot({bars,asOfDate:bars.at(-1).date,swingThresholdPct:0.03});
  const record = buildPatternCacheRecord({
    parentReference:parent,
    geometryEnvelope:geometry,
    rawExecutionEnvelope:raw,
    detectorSnapshot:snapshot,
    asOfDate:bars.at(-1).date
  });
  assert.equal(record.status,"VALID");
  assert.equal(record.researchOnly,true);
  assert.equal(record.decisionImpact,false);
  assert.equal(record.formalCoreImpact,false);
  assert.equal(record.shadowParentKey,"2026-09-25|1234");

  const replayRecord = buildPatternCacheRecord({
    parentReference:parent,
    geometryEnvelope:geometry,
    rawExecutionEnvelope:raw,
    detectorSnapshot:snapshot,
    asOfDate:bars.at(-1).date
  });
  assert.equal(comparePatternCacheRecords(record,replayRecord).status,"SAME_RECORD_EXACT");

  const rawDrift = {...raw,payloadHash:"raw-v2"};
  const drifted = buildPatternCacheRecord({
    parentReference:parent,
    geometryEnvelope:geometry,
    rawExecutionEnvelope:rawDrift,
    detectorSnapshot:snapshot,
    asOfDate:bars.at(-1).date
  });
  assert.equal(comparePatternCacheRecords(record,drifted).status,"PROVENANCE_CONFLICT");

  const coercedRaw = validatePatternSeriesEnvelope({
    role:"RAW_EXECUTION",
    semanticSpace:"RAW_EXECUTION",
    bars,
    provenance:{...commonProv,requestedAdjustmentMode:false,returnedAdjustmentMode:true}
  });
  const blocked = buildPatternCacheRecord({
    parentReference:parent,
    geometryEnvelope:geometry,
    rawExecutionEnvelope:coercedRaw,
    detectorSnapshot:snapshot,
    asOfDate:bars.at(-1).date
  });
  assert.equal(blocked.status,"BLOCKED");
  assert.equal(blocked.reason,"RAW_EXECUTION_SERIES_NOT_READY");

  const qa1 = attachPatternQaMetrics(record,{prefixExact:true,replayExact:true,scaleAgreement:3,computeMs:5});
  const qa2 = attachPatternQaMetrics(replayRecord,{prefixExact:true,replayExact:false,scaleAgreement:2,computeMs:7});
  const obs = buildPatternObservability([qa1,qa2,blocked]);
  assert.equal(obs.totalRecords,3);
  assert.equal(obs.validRecords,2);
  assert.equal(obs.blockedRecords,1);
  assert.equal(obs.coverageRate,2/3);
  assert.equal(obs.prefixExactRate,1);
  assert.equal(obs.replayExactRate,0.5);
  assert.equal(obs.scaleAgreementMedian,2.5);
  assert.equal(obs.computeMsMedian,6);
  assert.equal(obs.blockedReasons.RAW_EXECUTION_SERIES_NOT_READY,1);
}


// Episode identity and prospective run-receipt gates are outcome-free.
{
  const a=buildPatternEpisodeReference({
    symbol:"1234",detectorVersion:"PATTERN_CORE_V0_1",patternFamily:"PLATFORM",
    scale:"BASE",anchorIds:["H:2026-01-02","L:2026-01-05","H:2026-01-08"],initialConfirmedAt:"2026-01-10"
  });
  const same=buildPatternEpisodeReference({
    symbol:"1234",detectorVersion:"PATTERN_CORE_V0_1",patternFamily:"PLATFORM",
    scale:"BASE",anchorIds:["H:2026-01-02","L:2026-01-05","H:2026-01-08"],initialConfirmedAt:"2026-01-10"
  });
  const newAnchors=buildPatternEpisodeReference({
    symbol:"1234",detectorVersion:"PATTERN_CORE_V0_1",patternFamily:"PLATFORM",
    scale:"BASE",anchorIds:["H:2026-02-02","L:2026-02-05","H:2026-02-08"],initialConfirmedAt:"2026-02-10"
  });
  assert.equal(comparePatternEpisodeReferences(a,same).status,"SAME_EPISODE");
  assert.equal(comparePatternEpisodeReferences(a,newAnchors).status,"DIFFERENT_EPISODE");

  const complete=buildPatternRunReceipt({
    runId:"r1",scanDate:"2026-09-29",detectorVersion:"PATTERN_CORE_V0_1",
    expectedParentKeys:["2026-09-29|1111","2026-09-29|2222"],
    attempts:[
      {shadowParentKey:"2026-09-29|1111",status:"VALID"},
      {shadowParentKey:"2026-09-29|2222",status:"BLOCKED",reason:"OPEN_MISSING"}
    ],
    prefixChecks:[true,true],replayChecks:[true,true]
  });
  assert.equal(complete.status,"COMPLETE");
  assert.equal(complete.attemptCoverageRate,1);
  assert.equal(complete.outcomeJoinEligible,true);

  const missing=buildPatternRunReceipt({
    runId:"r2",scanDate:"2026-09-29",detectorVersion:"PATTERN_CORE_V0_1",
    expectedParentKeys:["2026-09-29|1111","2026-09-29|2222"],
    attempts:[{shadowParentKey:"2026-09-29|1111",status:"VALID"}],
    prefixChecks:[true],replayChecks:[true]
  });
  assert.equal(missing.status,"INCOMPLETE");
  assert.equal(missing.outcomeJoinEligible,false);
  assert.deepEqual(missing.missingParentKeys,["2026-09-29|2222"]);

  const replayFail=buildPatternRunReceipt({
    runId:"r3",scanDate:"2026-09-29",detectorVersion:"PATTERN_CORE_V0_1",
    expectedParentKeys:["2026-09-29|1111"],
    attempts:[{shadowParentKey:"2026-09-29|1111",status:"VALID"}],
    prefixChecks:[true],replayChecks:[false]
  });
  assert.equal(replayFail.status,"QA_FAIL");
  assert.equal(replayFail.replayExactFailures,1);
  assert.equal(replayFail.outcomeJoinEligible,false);

  const silentBlocked=buildPatternRunReceipt({
    runId:"r4",scanDate:"2026-09-29",detectorVersion:"PATTERN_CORE_V0_1",
    expectedParentKeys:["2026-09-29|1111"],
    attempts:[{shadowParentKey:"2026-09-29|1111",status:"BLOCKED",reason:""}],
    prefixChecks:[true],replayChecks:[true]
  });
  assert.equal(silentBlocked.status,"QA_FAIL");
  assert.equal(silentBlocked.blockedWithoutReason,1);

  const conflict=buildPatternRunReceipt({
    runId:"r5",scanDate:"2026-09-29",detectorVersion:"PATTERN_CORE_V0_1",
    expectedParentKeys:["2026-09-29|1111"],
    attempts:[{shadowParentKey:"2026-09-29|1111",status:"PROVENANCE_CONFLICT",provenanceConflict:true}],
    prefixChecks:[true],replayChecks:[true]
  });
  assert.equal(conflict.status,"QA_FAIL");
  assert.equal(conflict.provenanceConflictCount,1);
}


// Major-zone lifecycle is causal and state-dependent; touch/break state is not a one-sign score.
{
  const bars=makeBars([98,99,100,101,103,104,102,101,99,103,105],{tickPad:0.1});
  const zoneLower=101.5,zoneUpper=102.5;

  const pre=analyzeMajorZoneLifecycle({
    bars,
    asOfDate:bars[3].date,
    zoneLower,zoneUpper
  });
  assert.equal(pre.lifecycle,"BELOW_MAJOR_ZONE");
  assert.equal(pre.firstBreakAt,null);

  const first=analyzeMajorZoneLifecycle({
    bars,
    asOfDate:bars[4].date,
    zoneLower,zoneUpper
  });
  assert.equal(first.lifecycle,"FIRST_BREAK_ABOVE_MAJOR_ZONE");
  assert.equal(first.aboveZoneCloseStreak,1);
  assert.equal(first.breakCount,1);

  const hold=analyzeMajorZoneLifecycle({
    bars,
    asOfDate:bars[5].date,
    zoneLower,zoneUpper
  });
  assert.equal(hold.lifecycle,"HOLDING_ABOVE_MAJOR_ZONE");
  assert.equal(hold.aboveZoneCloseStreak,2);

  const reenter=analyzeMajorZoneLifecycle({
    bars,
    asOfDate:bars[6].date,
    zoneLower,zoneUpper
  });
  assert.equal(reenter.lifecycle,"REENTERED_MAJOR_ZONE");
  assert.equal(reenter.reentryCount,1);

  const fail=analyzeMajorZoneLifecycle({
    bars,
    asOfDate:bars[8].date,
    zoneLower,zoneUpper
  });
  assert.equal(fail.lifecycle,"FAILED_MAJOR_ZONE_BREAK");
  assert.equal(fail.failedBelowZoneAt,bars[8].date);

  const rebreak=analyzeMajorZoneLifecycle({
    bars,
    asOfDate:bars.at(-1).date,
    zoneLower,zoneUpper
  });
  assert.equal(rebreak.lifecycle,"HOLDING_ABOVE_MAJOR_ZONE");
  assert.equal(rebreak.breakCount,2);
  assert.equal(rebreak.aboveZoneCloseStreak,2);

  // Prefix invariance: full history as-of the first break equals the literal prefix.
  const firstReplay=analyzeMajorZoneLifecycle({
    bars:bars.slice(0,5),
    asOfDate:bars[4].date,
    zoneLower,zoneUpper
  });
  assert.deepEqual(firstReplay,first);
}
