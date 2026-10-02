import assert from "node:assert/strict";
import {
  aggregateOHLC,
  sameAggregateDifferentPath,
  classifyCrossScaleEvidence,
  dedupCrossScaleEpisodes
} from "./pattern_multiscale_incrementality_v0_1.mjs";

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log("PASS", name); };

const bar = (id, date, open, high, low, close) => ({
  id, date, open, high, low, close,
  semanticSpaceId: "TECHNICAL_CONTINUITY",
  symbolSessionVerified: true,
  technicalContinuityVerified: true
});

const pathA = [
  bar("A1","2026-09-21",100,110,99,108),
  bar("A2","2026-09-22",108,109,101,102),
  bar("A3","2026-09-23",102,106,100,105),
  bar("A4","2026-09-24",105,107,103,104),
  bar("A5","2026-09-25",104,108,102,107)
];
const pathB = [
  bar("B1","2026-09-21",100,104,99,101),
  bar("B2","2026-09-22",101,110,100,109),
  bar("B3","2026-09-23",109,109,103,104),
  bar("B4","2026-09-24",104,106,102,105),
  bar("B5","2026-09-25",105,108,101,107)
];

const obj = (o={}) => ({
  timeframe: "WEEKLY",
  confirmedAt: "2026-09-25",
  sourceFamily: "PRICE_OHLC",
  semanticSpaceId: "TECHNICAL_CONTINUITY",
  sourceBarIds: ["d1","d2","d3","d4","d5"],
  barCompletionState: "COMPLETED_HIGHER_TIMEFRAME_BAR",
  featureFamily: "MACRO_TOPOLOGY",
  ...o
});

t("MI01 exact OHLC aggregation", () => {
  const w = aggregateOHLC(pathA);
  assert.equal(w.status, "VALID");
  assert.deepEqual([w.open,w.high,w.low,w.close],[100,110,99,107]);
});

t("MI02 aggregation is many-to-one", () => {
  const r = sameAggregateDifferentPath(pathA,pathB);
  assert.equal(r.sameAggregate,true);
  assert.equal(r.sameOrderedPath,false);
  assert.equal(r.provesManyToOneAggregationWhenTrue,true);
});

t("MI03 weekly from daily has no new raw source info", () => {
  const higher=obj();
  const lower=obj({timeframe:"DAILY",sourceBarIds:["d1","d2","d3","d4","d5"],featureFamily:"DAILY_STRUCTURE"});
  const r=classifyCrossScaleEvidence({asOf:"2026-09-25",higher,lower,higherDerivedFromLower:true,relationType:"CONTAINS"});
  assert.equal(r.rawInformationClass,"DETERMINISTIC_AGGREGATION_NO_NEW_RAW_INFO");
  assert.equal(r.independentVoteEligible,false);
});

t("MI04 shared trigger is one event not two votes", () => {
  const r=classifyCrossScaleEvidence({asOf:"2026-09-25",higher:obj(),lower:obj({timeframe:"DAILY"}),sharedEventIds:["BRK:R1:2026-09-25"],relationType:"SHARES_TRIGGER"});
  assert.equal(r.overlapClass,"SAME_EVENT_DUPLICATE");
  assert.equal(r.scaleAgreementVoteCount,null);
});

t("MI05 equivalent horizon is nested not independent", () => {
  const r=classifyCrossScaleEvidence({asOf:"2026-09-25",higher:obj(),lower:obj({timeframe:"ROLLING_5D"}),equalClockHorizon:true});
  assert.equal(r.overlapClass,"NESTED_HORIZON");
  assert.equal(r.independentVoteEligible,false);
});

t("MI06 parent-child topology may be representation candidate only", () => {
  const r=classifyCrossScaleEvidence({asOf:"2026-09-25",higher:obj(),lower:obj({timeframe:"DAILY",sourceBarIds:["d4","d5"]}),relationType:"CONTAINS"});
  assert.equal(r.representationClass,"CROSS_SCALE_RELATION_REPRESENTATION_CANDIDATE");
  assert.equal(r.predictiveIncrementality,"UNKNOWN_REQUIRES_PREREGISTERED_OUTCOME_TEST");
});

t("MI07 same root disjoint horizon remains hierarchical context", () => {
  const r=classifyCrossScaleEvidence({
    asOf:"2026-09-25",
    higher:obj({sourceBarIds:["old1","old2"]}),
    lower:obj({timeframe:"DAILY",sourceBarIds:["new1","new2"],featureFamily:"DAILY_STRUCTURE"})
  });
  assert.equal(r.rawInformationClass,"SAME_ROOT_DISTINCT_HORIZON_HISTORY");
  assert.equal(r.independentVoteEligible,false);
});

t("MI08 partial weekly state fails closed", () => {
  const r=classifyCrossScaleEvidence({asOf:"2026-09-23",higher:obj({confirmedAt:"2026-09-23",barCompletionState:"PARTIAL_ASOF_HIGHER_TIMEFRAME_BAR"}),lower:obj({timeframe:"DAILY",confirmedAt:"2026-09-23"})});
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"PARTIAL_HIGHER_TIMEFRAME");
});

t("MI09 future higher confirmation fails closed", () => {
  const r=classifyCrossScaleEvidence({asOf:"2026-09-24",higher:obj({confirmedAt:"2026-09-25"}),lower:obj({timeframe:"DAILY",confirmedAt:"2026-09-24"})});
  assert.equal(r.reason,"FUTURE_CONFIRMATION");
});

t("MI10 semantic-space conflict fails closed", () => {
  const r=classifyCrossScaleEvidence({asOf:"2026-09-25",higher:obj(),lower:obj({timeframe:"DAILY",semanticSpaceId:"RAW_EXECUTION"})});
  assert.equal(r.reason,"SEMANTIC_SPACE_CONFLICT");
});

t("MI11 missing root provenance remains UNKNOWN", () => {
  const bad=obj(); delete bad.sourceFamily;
  const r=classifyCrossScaleEvidence({asOf:"2026-09-25",higher:bad,lower:obj({timeframe:"DAILY"})});
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.independentVoteEligible,false);
});

t("MI12 different source family is not auto-authorized as a vote", () => {
  const r=classifyCrossScaleEvidence({asOf:"2026-09-25",higher:obj({sourceFamily:"PRICE_OHLC"}),lower:obj({timeframe:"DAILY",sourceFamily:"ORDER_BOOK"})});
  assert.equal(r.rawInformationClass,"DISTINCT_SOURCE_FAMILY_OUTSIDE_PATTERN_ROOT");
  assert.equal(r.independentVoteEligible,false);
});

t("MI13 repeated snapshots do not inflate independent episode N", () => {
  const r=dedupCrossScaleEpisodes([
    {symbol:"2330",parentEpisodeId:"P1",childEpisodeId:"C1",relationType:"CONTAINS",asOf:"2026-09-23"},
    {symbol:"2330",parentEpisodeId:"P1",childEpisodeId:"C1",relationType:"CONTAINS",asOf:"2026-09-24"},
    {symbol:"2330",parentEpisodeId:"P1",childEpisodeId:"C1",relationType:"CONTAINS",asOf:"2026-09-25"}
  ]);
  assert.equal(r.snapshotCount,3);
  assert.equal(r.independentEpisodeCount,1);
});

t("MI14 timeframe pair enters multiple-testing identity", () => {
  const r=classifyCrossScaleEvidence({asOf:"2026-09-25",higher:obj(),lower:obj({timeframe:"DAILY"}),relationType:"CONTRADICTS"});
  assert(r.multipleTestingFamilyKey.includes("DAILY+WEEKLY"));
  assert(r.multipleTestingFamilyKey.includes("CONTRADICTS"));
});

t("MI15 next-session intraday evidence is future for prior after-market decision", () => {
  const r=classifyCrossScaleEvidence({
    asOf:"2026-09-25T18:10:00+08:00",
    higher:obj({confirmedAt:"2026-09-25T13:30:00+08:00"}),
    lower:obj({timeframe:"M15",confirmedAt:"2026-09-28T09:15:00+08:00"})
  });
  assert.equal(r.reason,"FUTURE_CONFIRMATION");
});

t("MI16 overlapping same-root observations never increase vote count", () => {
  const r=classifyCrossScaleEvidence({
    asOf:"2026-09-25",
    higher:obj({sourceBarIds:["d1","d2","d3","d4","d5"]}),
    lower:obj({timeframe:"DAILY",sourceBarIds:["d4","d5"]})
  });
  assert.equal(r.rawInformationClass,"SHARED_ROOT_OVERLAPPING_OBSERVATIONS");
  assert.equal(r.independentVoteEligible,false);
});

console.log(`SUMMARY ${pass}/16 PASS`);
