# System 2 Tier A/B Source Contract Audit

Updated: 2026-09-27 Asia/Taipei
Status: P1 SOURCE CONTRACT AUDIT V0.1
Scope: research-only; no V8 runtime/Formal change

## Purpose

Freeze which existing fields System 2 may safely consume first, and separate "machine-readable today" from "historically point-in-time proven".

This audit is based on current GitHub main source/contracts and the existing research corpus. It does not claim every field has deep historical continuity.

## Contract states

- TIER_A_CURRENT: machine-readable current/recent contract exists and can support prospective Shadow capture.
- TIER_A_DERIVED: deterministic derived field exists from current OHLCV/source data.
- TIER_B_PIT_AUDIT: source/field exists, but historical vintage/continuity must be proven before retrospective outcome testing.
- TIER_B_SEMANTIC_GAP: data exists but semantics are too coarse for the intended factor.
- TIER_C_SOURCE_REQUIRED: no canonical source contract selected.

## A1 — Taiwan daily market / derived technical-price-volume fields

State: TIER_A_CURRENT + TIER_A_DERIVED; historical continuity remains TIER_B_PIT_AUDIT.

Existing derived fields observed in current source/research snapshots include:
- historyDays
- close / open / todayHigh / todayLow
- ma5 / ma10 / ma20 / ma60
- prevMa5 / prevMa10 / prevMa20
- bullishStack / justTurnBullish / lateStage
- atrPercent
- avgVolume20Lots
- avgAmount20
- volumeRatio
- volumeTodayVsPrev5
- volumeContraction5to20
- volatility20
- ret20 / ret60
- dailyClosePosition
- dailyUpperShadowRatio
- priorHigh20 / priorHigh60 / priorLow20
- gapPct / breakoutDistancePct where produced

System 2 use:
- first SHORT_MOMENTUM prototype;
- technical/price-volume factor snapshots;
- liquidity and extension controls.

Restrictions:
- current availability does not prove historical provider continuity;
- stale/missing bars, suspensions and corporate actions must preserve UNKNOWN/provenance;
- raw vs adjusted price semantics must be explicit for pattern/backtest work.

## A2 — TAIEX official index snapshot

State: TIER_A_CURRENT; historical receipt timing is TIER_B_PIT_AUDIT.

Current normalized contract:
- asOfDate
- count
- history[] with date/close
- return20
- dailyReturn
- definition = TWSE official capitalization-weighted index semantics

System 2 use:
- Market Regime V0;
- market-relative return controls;
- risk-on/off support.

Restriction:
- TAIEX cannot substitute for TPEx/small-cap regime.

## A3 — three-institution daily flow

State: TIER_A_CURRENT for recent official synchronized dates; deeper continuity TIER_B_PIT_AUDIT.

Current per-stock fields:
- foreignNet
- trustNet
- dealerNet
- institutionTotalNet
- foreignBuyDays
- trustBuyDays
- dealerBuyDays

Current status contract also exposes:
- marketDate
- ready
- validDates
- missingDates
- snapshotCounts

System 2 use:
- INSTITUTIONAL_ACCUMULATION V0;
- SHORT_MOMENTUM confirmation;
- interaction tests with price response and ownership concentration.

Semantic restrictions:
- TWSE/TPEx unit parity is materially verified: normalized foreignNet / trustNet / dealerNet / institutionTotalNet are raw **share counts** on both markets; normalization by avgVolume20Lots*1000 is shares/shares;
- raw net shares are FLOW, not holdings;
- current foreignNet semantics may be broader than the decomposition desired by new research;
- future System 2 capture should preserve foreign-main vs foreign-dealer separately when official source semantics allow;
- dealer proprietary vs hedge must not be guessed;
- institution signs are not independent "votes".

## A4 — TDCC holder concentration

State: TIER_A_CURRENT weekly; historical vintages TIER_B_PIT_AUDIT.

Official accepted raw field contract:
- 資料日期
- 證券代號
- 持股分級
- 股數
- 占集保庫存數比例%

Current normalized per-stock fields:
- chipConcentration = 400-lot-and-above holding ratio
- holdersOver1000LotsRatio
- chipAsOfDate
- chipDefinition

System 2 use:
- ownership-concentration trend;
- INSTITUTIONAL_ACCUMULATION / BLACK_HORSE research.

Restrictions:
- weekly cadence;
- 400+/1000+ groups do not identify institutions or "main force";
- trend requires preserved weekly vintages; today's snapshot cannot reconstruct history.

## A5 — quarterly financials

State: TIER_A_CURRENT; historical publication/vintage semantics TIER_B_PIT_AUDIT.

Existing normalized fields include:
- financialYear
- financialQuarter
- quarterRevenue
- quarterEPS
- quarterEpsVerified
- quarterEpsMethod
- revenueQuarterYoY
- revenueQoQ
- grossMargin
- operatingMargin
- grossMarginYoY
- operatingMarginYoY
- grossMarginQoQ
- operatingMarginQoQ
- comparison/readiness metadata where applicable

System 2 use:
- SWING_GROWTH / FUNDAMENTAL_GROWTH;
- fundamental quality and acceleration.

Restrictions:
- period/restatement comparability must be preserved;
- publication time / first-eligible decision date must be recorded for historical use;
- do not invent growth percentages for zero/negative comparison bases.

### A5 prospective observer upgrade — 2026-09-27

Implemented System 2 read-only observer:
- `runtime/a5_filing_vintage_observer.mjs`;
- TWSE/TPEx official EPS + profitability endpoints;
- market-wide symbol/vintage consistency checks;
- first-observed `observedAt` provenance.

Validated semantics:
- prospective market-wide quarterly vintage observation is now implementable;
- exact company filing timestamp is NOT proven;
- exact official publication timestamp is NOT inferred;
- historical pre-observer publication vintages remain UNKNOWN.

Non-trading smoke on 2026-09-27 returned `OBSERVED_COVERAGE_PASS` for A5 with all transport OK, but it contributes zero trading-date decision-clock evidence.

## A6 — valuation PE/PB

State: TIER_A_CURRENT; historical daily archive TIER_B_PIT_AUDIT.

Current normalized fields:
- priceEarningsRatio
- priceBookRatio
- valuationObserved
- valuationDate
- valuationSource

System 2 use:
- valuation risk;
- peer-relative and growth-relative research.

Restrictions:
- current contract does not provide forward PE, PEG, EV/EBITDA, FCF yield or historical percentile;
- historical percentile requires a durable historical valuation series;
- PE may be null/meaningless for loss companies and must remain semantically explicit.

## A7 — official announcements

State: TIER_A_CURRENT at date level; TIER_B_SEMANTIC_GAP for intraday event timing.

Existing normalized per-event record:
- date
- title

Related current fields:
- officialAnnouncements[]
- announcementsVerified

System 2 use now:
- date-level risk/catalyst context;
- exclusion/warning evidence in prospective daily snapshots.

Not sufficient yet for:
- precise firstKnownAt / availableAt intraday;
- event half-life measured from true disclosure time;
- news-vs-market reaction ordering;
- full event-driven backtest.

Required upgrade:
- immutable first-known timestamp;
- source/entity/event ID;
- revision/update handling;
- event mechanism, beneficiary/victim and expiry stored separately from raw announcement.

## B1 — TPEx / small-cap regime

State: TIER_B_PIT_AUDIT.

Research has identified official TPEx market/breadth sources, but System 2 does not yet have one frozen normalized contract equivalent to A2.

Required fields before Market Regime V0 can call this "ready":
- marketDate
- TPEx index close/return
- advance/decline/flat counts
- turnover
- availability timestamp
- source/provenance
- coverage/readiness flags

Rule:
- never proxy TPEx/small-cap conditions solely with TAIEX.

## B2 — market breadth and sector rotation

State: TIER_B_PIT_AUDIT / derivable prospectively.

Research-ready concepts:
- advance share
- MA participation
- new-high/new-low participation
- breadth acceleration/deterioration
- cap-weighted vs equal-weight concentration
- sector return/turnover/breadth
- rank transition and leadership diffusion
- cross-sector correlation/dispersion

Existing V8 sector fields such as breadth, avgChange and amountVs20DayAverage are useful evidence but their Formal thresholds remain SYSTEM1_IMPL.

System 2 rule:
- first build prospective frozen breadth/sector snapshots with explicit universe definitions;
- do not historical-backfill sector state using today's industry classification without vintage control.

### B2 prospective observer upgrade — 2026-09-27

Implemented System 2 read-only derived observer:
- `runtime/b2_industry_snapshot_observer.mjs`;
- official TWSE/TPEx company-profile classification;
- official same-date TWSE/TPEx close rows;
- deterministic industry member count / up-down-flat breadth / net breadth share and available price-value summaries.

Boundaries:
- current profile classification is prospectively observed and never backfilled into historical dates;
- the observer does NOT assign an INDUSTRY_TREND thesis direction;
- the observer does NOT create a strategy score;
- a same-date trading-session close is required for dependency eligibility.

The 2026-09-27 non-trading smoke correctly returned `DERIVED_SNAPSHOT_INCOMPLETE`; this is expected behavior, not evidence of source failure.

## B3 — margin / short / SBL

State: TIER_B_PIT_AUDIT / TIER_B_SEMANTIC_GAP.

Known reusable research rules:
- margin financing balance/flow != margin short;
- securities borrowing != actual SBL short sale;
- one-day SBL evidence cannot be relabeled as 5/20/60-day shorting flow;
- TWSE and TPEx coverage/parity must be explicit.

Use:
- later crowding/short-pressure factors after contiguous history is proven.

## B4 — monthly revenue vintages

State: CURRENT_PROVEN but historical first-known series TIER_B_PIT_AUDIT.

Use:
- growth acceleration/deceleration;
- SWING_GROWTH / FUNDAMENTAL_GROWTH.

Required before retrospective testing:
- source period;
- actualPublishedAt/availableAt;
- any restatement/replacement handling;
- no current snapshot backfilled into past decision dates.

## B5 — industry classification / sector membership

State: TIER_B_PIT_AUDIT.

Risk:
- classification drift and survivorship can create look-back bias.

Required:
- classificationVersion
- effectiveFrom/effectiveTo or equivalent vintage
- source
- peer-set definition

Until then:
- prospective current classification is usable;
- historical sector reconstruction must carry a quality warning.

## B6 — corporate-action-adjusted history

State: TIER_B_PIT_AUDIT; rich research exists.

Required for safe historical technical/pattern factors:
- corporate action type/date
- ex-date/effective date
- adjustment semantics
- denominator/share-basis provenance
- raw vs adjusted price-space marker
- contamination window where relevant

Rule:
- corporate-action discontinuities must never become false breakout/gap/pattern evidence.

## B7 — contract liabilities / customer prepayments

State: SOURCE_EXTENSION_REQUIRED + TIER_B_PIT_AUDIT.

The repository currently has no normalized `contractLiabilityCurrent`, `contractLiabilityNonCurrent` or `contractLiabilityTotal` field in the audited System 2 / V8 contracts.

Accounting source concept is valid, but System 2 must not score the factor until a canonical filing/taxonomy extraction is frozen.

Required source contract:
- financialYear / financialQuarter;
- contractLiabilityCurrent;
- contractLiabilityNonCurrent where disclosed;
- contractLiabilityTotal;
- filingPublishedAt / availableAt;
- source filing ID / taxonomy tag;
- restatement/version marker;
- unit / currency;
- semantic readiness flag.

Required data-quality checks:
- current vs non-current classification consistency;
- taxonomy/tag changes across years;
- restatement handling;
- industry/business-model applicability;
- distinguish contract liabilities from contract assets and ordinary payables;
- no assumption that all contract liabilities are cancellable/non-cancellable backlog.

System 2 use after source readiness:
- FUNDAMENTAL_GROWTH（基本面成長策略） forward-visibility research;
- SWING_GROWTH（波段成長策略） expectation/acceleration context;
- INDUSTRY_TREND（產業趨勢策略） project-cycle context where economically appropriate.

Historical testing remains blocked until publication-time vintages are proven.

## C — not yet canonical for System 2

State: TIER_C_SOURCE_REQUIRED.

Includes:
- global equity index durable receipts;
- oil/commodity/rare-element/product prices;
- USD/TWD and DXY durable decision-time receipts;
- rates and macro release/surprise series;
- general news with immutable timestamps;
- analyst estimates / forward PE;
- sector-specific supply/demand/inventory/capacity datasets.

These may be researched now, but cannot enter historical System 2 scoring until source/timing contracts are frozen.

## Initial factor-consumption mapping

### SHORT_MOMENTUM_V0
Can start prospectively from:
A1 market/technical/price-volume + A2 TAIEX + A3 institutions + A4 TDCC where current + B2 prospective breadth snapshot.

### SWING_GROWTH_V0
Can start prospectively from:
A5 financials + A6 valuation + A4 ownership + A1 timing + B2 industry state.
Still missing canonical forward estimates and richer valuation history.

### INSTITUTIONAL_ACCUMULATION_V0
Can start prospectively from:
A3 institution flow + A4 TDCC concentration + A1 price/volume response + A2/B2 market context.
Do not call it "black horse" evidence until incremental distinction is shown.

## P1 conclusion

System 2 does not need to wait for Tier C to begin honest prospective Shadow research.

The safe first implementation boundary is:
1. capture Tier A current fields into isolated System 2 factor snapshots;
2. add prospective B2 breadth/sector context with frozen universe semantics;
3. preserve availableAt/source/UNKNOWN on every record;
4. keep Tier B historical tests blocked until continuity/vintage evidence is proven;
5. keep all System 2 decision/performance storage isolated from V8 live state.

## Source-arrival measurement contract V0.1

`SYSTEM2_SOURCE_ARRIVAL_LATENCY_AND_DECISION_CLOCK_V0_1.md` now freezes a
prospective read-only measurement boundary for A1/A2/A3/A6 official sources.

Important semantics:
- first observed READY is an arrival upper bound, not an official publication timestamp;
- after-the-fact historical retrieval is not latency evidence;
- source error is distinct from NOT_READY;
- both TWSE and TPEx A1 daily close coverage are required for the full-universe daily gate;
- A5 quarterly filing vintages and B2 derived industry-thesis snapshots remain separate blockers;
- no exact Decision Clock or Cron is authorized by the measurement contract.
