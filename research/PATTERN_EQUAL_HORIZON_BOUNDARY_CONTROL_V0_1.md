# D01 DL-013 — Equal-Horizon and Boundary-Sensitivity Control V0.1

Updated: 2026-10-02 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_CLOSED / FORMAL_CORE_LOCKED

## 1. Terminology correction

Earlier DL-008 language used "bar-boundary placebo".

That term is too strong.

A shifted bar boundary is not guaranteed to be a true null placebo because:
- market information can cluster by weekday/session;
- the last completed shifted bar can have different age/freshness;
- aggregation boundaries can change extrema and path compression;
- different grouping can genuinely change a topology detector.

Frozen replacement term:
BOUNDARY_SENSITIVITY_CONTROL.

The control asks:
"Is a claimed multi-scale effect robust to a preregistered nearby aggregation boundary, after information-set and feature-age differences are explicit?"

It does NOT assume the shifted boundary must have zero effect.

## 2. Two different confounds

### A. Effective-horizon confound

A weekly feature may look different from a daily feature simply because it summarizes a longer clock horizon.

Required provenance:
- timeframe;
- lookbackBars;
- effectiveClockHorizonEligibleSessions;
- sourceStart;
- sourceEnd;
- featureAgeEligibleSessions at the parent decision.

### B. Aggregation-boundary confound

Even at similar horizons, changing which sessions belong to each higher-timeframe bar can change:
- high/low extrema;
- pattern anchors;
- breakout/rejection chronology;
- confirmation timing.

Therefore horizon and boundary are separate experimental dimensions.

## 3. Primary baseline vs challenger

B0:
daily long-horizon controls already frozen in DL-008:
- priorHigh60 / majorStructuralHigh;
- MA60/120 where available;
- ret20/ret60;
- ATR/realized volatility;
- daily major-zone state;
- current daily setup;
- D02 acceptance where applicable;
- regime/liquidity.

B1:
B0 + canonical completed-calendar-week Pattern relation.

Primary estimand:
B1 incremental value over B0 on common support/equal dates.

Do not compare raw B1 standalone hit rate with B0 from another sample.

## 4. Equal-horizon comparators

Two comparator families are preregistered.

EH1 — DAILY_EQUIVALENT_CLOCK_HORIZON
Use daily features whose eligible-session clock horizon approximates the higher-timeframe Pattern history.

Purpose:
test whether "weekly value" is only longer memory.

EH2 — SIMPLE_LONG_HORIZON_PRICE_GEOMETRY
Use simple controls such as:
- priorHigh60;
- simple260SessionHigh;
- ret60;
- MA60/120;
- ATR-normalized distance.

Purpose:
test whether complex topology adds beyond simple long-horizon location/trend.

No lookback sweep is authorized.

## 5. Boundary-sensitivity variants

Primary aggregation:
CALENDAR_WEEK_COMPLETED.

Frozen sensitivity challenger:
SHIFTED_5_ELIGIBLE_SESSION_BLOCK_V0_1.

Definition:
- partition eligible symbol sessions into contiguous 5-session blocks using a preregistered anchor rule;
- the anchor rule/version is fixed before outcomes;
- only fully completed blocks available by asOf may be used;
- no future session can complete a block for an earlier parent;
- featureAgeEligibleSessions is stored.

This is a robustness control, not a new factor family and not a score.

## 6. Comparability states

A calendar-week feature and shifted-block feature may be:

COMPARABLE
- both causal by parent cutoff;
- both use verified eligible sessions;
- semantic space identical;
- sufficient completed history;
- feature-age difference within the preregistered analysis stratum.

NOT_COMPARABLE_FEATURE_AGE
- one representation is materially older in information availability.

NOT_COMPARABLE_SESSION_COVERAGE
- holiday/suspension/session differences make the effective blocks structurally unmatched.

DATA_BLOCKED
- continuity/session provenance invalid.

UNKNOWN
- provenance incomplete.

Do not force all dates into a pair.

## 7. Interpretation firewall

Possible future outcomes:

A. B1 beats B0; shifted control similar
=> possible generic low-frequency/topology representation value; not specifically calendar-week magic.

B. B1 beats B0; shifted control weak
=> calendar boundary may matter OR feature age/session composition may confound; further causal diagnosis required.

C. B1 loses after equal-horizon controls
=> weekly effect likely memory/horizon redundancy.

D. B1 loses after simple260/high/MA/ret controls
=> complex Pattern topology likely redundant.

E. results flip across nearby boundary variants without mechanism
=> boundary fragility; no optimization proposal.

No case permits post-outcome search for a better week anchor.

## 8. Multiple-testing accounting

The following choices belong to one preregistered hypothesis family:
- timeframe pair;
- aggregation boundary version;
- effective horizon comparator;
- Pattern relation definition;
- RG2 scale relation;
- outcome horizon.

Failed variants remain counted.

Do not reset the multiple-testing family because a shifted boundary has a new name.

## 9. Sample / inference unit

Repeated representations of one parent/child structural episode:
do not create new independent N.

Future inference clusters at least by:
- scan date;
- structural episode;
- relation episode.

Calendar-week and shifted-block rows for the same symbol/date are paired representations, not two independent observations.

## 10. Current status

EQUAL_HORIZON_CONTROL = FROZEN_V0_1.
BOUNDARY_SENSITIVITY_CONTROL = FROZEN_V0_1.
TRUE_NULL_PLACEBO_CLAIM = REJECTED.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 11. Exact next continuation

1. Add these identities to the Pattern shared-child payload contract.
2. Freeze featureAgeEligibleSessions and aggregationBoundaryVersion as mandatory provenance.
3. Do not implement shifted aggregation runtime yet.
4. Future outcome study uses B0 vs B1 first; boundary-sensitivity analysis is robustness, not a factor search.
5. No outcome work until prospective parent/run evidence is complete.
