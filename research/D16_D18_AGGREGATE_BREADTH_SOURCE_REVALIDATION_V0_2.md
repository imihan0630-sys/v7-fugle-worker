# D16 + D18 Aggregate Breadth Source Revalidation V0.2

Updated: 2026-10-02 Asia/Taipei
Status: RESEARCH-ONLY / SOURCE_FAMILY_CORRECTION / NO POLICY IMPACT
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Correct the source-readiness conclusion from V0.1 after a prospective falsification of the TWSE `twtazu_od` source, and freeze a better official after-trading source candidate for D18 market-level Direction Breadth.

This update distinguishes:
1. semantic/parser correctness;
2. source freshness;
3. prospective availability;
4. cross-venue common-support readiness.

Passing one layer does not imply the next.

## 1. Falsification of TWSE `twtazu_od` as the primary live source

The existing research parser:
- `system2/runtime/d18_twse_official_market_breadth_v0_1.mjs`

remains useful for its declared payload semantics and fail-closed parser behavior.

However, a live read on 2026-10-02 after the TWSE close returned:
- `出表日期 = 1150605` = 2026-06-05;
- stock counts 342 / 19 / 671 / 10 / 59 / 2 / 4.

Those counts match the previously frozen fixture but are months stale relative to the 2026-10-02 decision-research date.

The Government Data Open Platform metadata for the dataset `集中市場漲跌證券數統計表` explicitly declares update frequency:
- `不定期更新`.

Therefore:

`PARSER_SEMANTICS_VALIDATED != PROSPECTIVE_LIVE_SOURCE_READY`.

The prior wording that could be read as live PIT sublane readiness was too strong and must be corrected.

Do not delete or rewrite the old source history. Preserve it as:
- semantic/archive source;
- not the primary D18 live Decision Clock breadth source.

## 2. Preferred TWSE candidate: MI_INDEX / type=MS

Official TWSE after-trading report:
`MI_INDEX`

Machine JSON candidate:
`https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date={YYYYMMDD}&type=MS&response=json`

A same-day 2026-10-02 prospective observation succeeded after market close:
- `stat = OK`;
- `date = 20261002`;
- table title = `漲跌證券數合計`;
- fields = `類型 / 整體市場 / 股票`;
- stock up = 483, limit-up = 24;
- stock down = 506, limit-down = 1;
- unchanged = 91;
- untraded = 0;
- no-comparison = 2.

The official notes state that no-comparison can include:
- prior day without a closing price;
- ex-right;
- ex-dividend;
- new listing;
- resumed trading.

This aligns with D18 NOT_COMPARABLE semantics and is materially safer than treating such rows as FLAT.

## 3. New executable parser

New research-only source-specific module:
- `system2/runtime/d18_twse_mi_index_market_breadth_v0_1.mjs`

It requires:
- payload object;
- `stat=OK`;
- exact source date = target date;
- exact breadth table/fields;
- explicit stock column;
- parseable parent/subcount grammar such as `483(24)`;
- limit-up <= up and limit-down <= down by parser grammar;
- observedAt <= frozen decisionTimestamp.

It preserves separately:
- up;
- limit-up;
- down;
- limit-down;
- unchanged;
- untraded;
- no-comparison.

No-comparison/untraded are excluded from the comparable denominator but reported as coverage diagnostics.

## 4. Prospective timing interpretation

The 2026-10-02 same-day MI_INDEX observation proves only:

`available by the observation timestamp`.

It does NOT prove:
- source publication time;
- first-ready time;
- a frozen exact Decision Clock;
- readiness before earlier candidate clocks.

A scheduled prospective poller is still required to estimate the first observed same-day availability distribution.

Do not retroactively infer availability from historical fetch success.

## 5. TPEx aggregate source status

Official public TPEx market-highlight pages expose:
- advancing;
- limit-up;
- declining;
- limit-down;
- flat;
- untraded.

A historical official 2026-10-01 page returned:
- up 333 / limit-up 27;
- down 417 / limit-down 2;
- flat 114;
- untraded including suspended = 28.

A current official app page is also readable prospectively.

Separately, TPEx publishes a formal machine-readable paid product:
- `MARKET_HIGHLIGHT.CSV`;
- daily;
- production time 17:20 GMT+8.

This proves machine-readable official aggregate data exists, but the paid 17:20 product must NOT be silently substituted for the free public runtime source.

Current free/public status:
- semantic official page = VERIFIED;
- exact stable free machine transport/version = NOT YET FROZEN;
- prospective availability distribution = PENDING.

## 6. Decision Clock evidence through 2026-10-01

Finalized independent source-clock dates:
- 2026-09-29;
- 2026-09-30;
- 2026-10-01.

Aggregate:
- promotionGradeDateCount = 3;
- independentTradingDates = 3;
- completeTradingDates = 0;
- precisionEligibleDates = 0.

All three preserve immutable attempt-one evidence but fail required source completeness.

This is now a repeated source-readiness pattern rather than a one-day anomaly.

Do not respond by dropping failed dates or threshold-tuning the clock.

## 7. 2026-10-01 failure shape

A1 TWSE:
- target date never observed during the frozen polling window;
- mostly prior-date 2026-09-30;
- one network error.

A1 TPEx:
- prior-date observations followed by non-JSON/invalid-payload episodes;
- target-date readiness not stably established in the A1 lane.

B2:
- A5 itself was READY;
- B2 remained incomplete because same-date market inputs were not jointly ready;
- final TPEx side eventually reached 2026-10-01 with 887 ordinary symbols while TWSE remained prior-date.

This strengthens the cross-market-asynchrony finding.

## 8. Evidence ladder restated

`PARSER_PASS`
does not imply
`SOURCE_FRESH`
does not imply
`SOURCE_CLOCK_VALID`
does not imply
`FEATURE_VALID`
does not imply
`STRATEGY_COHORT_VALID`
does not imply
`OUTCOME_VALID`.

Maturity must be assigned to the exact layer proven.

## 9. Current source architecture

### TWSE official aggregate Direction Breadth
Preferred candidate:
- MI_INDEX type=MS JSON.
Status:
- semantic structure verified;
- current same-day machine JSON observed;
- parser implementation/test pending CI in this research patch;
- exact prospective first-ready distribution pending.

### TPEx official aggregate Direction Breadth
Status:
- official semantic page verified;
- paid daily CSV exists at 17:20;
- stable free machine transport pending;
- prospective timing pending.

### Per-symbol common-stock/return lane
Still separate.
Needed for:
- common-stock breadth;
- U2 returns;
- dispersion;
- Above-MA / multi-day participation.

Do not use aggregate-market source as a substitute for symbol-level return/history.

## 10. Maturity correction

D18-04 remains L2 / 40%.

No module maturity increase is justified by this source migration.

The correct correction is:
- old TWTaZU source: parser semantics validated, live freshness rejected;
- new MI_INDEX source: candidate executable source lane under validation.

This is a falsification-driven source correction, not regression of the overall research architecture.

## 11. Formal boundary

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

No:
- Regime threshold;
- strategy gate;
- dynamic weight;
- System 1 Formal rule;
- System 2 live selection/capital/order/push authority;
- exact Decision Clock;
- source substitution in production.

## Exact next continuation

1. Run CI/adversarial tests for the new MI_INDEX parser.
2. After merge, build a prospective research-only availability observer for TWSE MI_INDEX; do not infer first-ready from one observation.
3. Freeze a free/public TPEx transport or explicitly decide that only the paid 17:20 CSV is machine-contract-grade; do not conflate them.
4. Accumulate same-date common-support aggregate TWSE/TPEx receipts.
5. Compare official aggregate breadth with per-symbol reconstructed breadth only as universe/source diagnostics.
6. Continue U2B only through shared TECHNICAL_CONTINUITY.
7. Do not test Breadth policy alpha until source occupancy/missingness is stable across multiple independent episodes/dates.
