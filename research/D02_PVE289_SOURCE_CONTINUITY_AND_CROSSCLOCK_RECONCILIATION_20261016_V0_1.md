# D02 PVE-289 — 60-session continuity and dual-clock source evidence reconciliation (2026-10-16)

## Scope, baseline, and anti-restart rule

Research-only source-quality addendum to the existing `PVE-289` convergence state, not `PVE-290`, not a new strategy, not a D02 L4 promotion. Latest-main baseline read at `cf92b569f630faa852793c69f4488d62675a1b3b`. Canonical authority remains `PRICE_VOLUME_CHECKPOINT.md` and `research/stock_market_learning_tracker_v0_1.json`; this file does not supersede them. Previous unmerged research branch `research/d02-pve289-60session-provenance-20261014` is ahead by two and behind by 82 relative to this baseline; its source-quality findings are reconciled below without merging a stale checkpoint over latest main.

## A. Real System1 60-session continuity census, not H001 baseline acceptance

Original read-only run `38487815289`, job `115605647456`, artifact `11861275185`, at https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38487815289. Direct job-log readback contains `SYSTEM1_P0_60_SESSION_SOURCE_AUDIT` with 1,908 symbols: 1,676 `60_BARS_AND_60_MARKET_SESSIONS_PRESENT`, 204 `CALENDAR_GAP_NEEDS_LISTING_OR_HALT_PROVENANCE`, 21 `LATEST_COMPLETED_QUOTE_NOT_PRESENT`, 7 `FEWER_THAN_60_COMPLETED_BARS`; 1,901 had at least 60 raw bars. The 204 uncertain gaps include 63 single-session and 141 multiple-session groups, 1,007 missing symbol-session instances per earlier source receipt. Source classification pass = 1,676/1,908 = 87.84%; this is not a tradable signal success rate, a clean 15-minute historical baseline, or 1,676 independent dates. Causes of gaps remain UNKNOWN until exchange calendar, listing, halt and source-version evidence is joined. Do not convert missing volume to zero.

Earlier 2026-10-14 16:35 source note said the 16:10 scheduled daily increment had **not yet been observed at that observation cutoff**. This was time-bounded, not a permanent absence claim. Subsequent real schedule run `38573427508` at 2026-10-14 21:38 Taipei, https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38573427508, conclusively supersedes any unqualified “never ran” inference: the workflow did trigger late and `official_history_incremental` failed. Direct job log: `TPEX 2026-10-05` official historical source exhausted primary transport, `error=terminated`, so no certified incremental history completeness follows. Guard-test success and scheduled-workflow creation do not mean source/persistence success.

## B. New immutable original-source evidence, two different clocks

Latest main contains `system2/migration/evidence/S2_DATA_ISSUE1068_NATIVE_122_A1_PERBAR_PIT_PHYSICAL_20261016_V0_1.json` and `system2/migration/evidence/S2_DATA_ISSUE1068_CROSSDOMAIN_PIT_REAL_ORIGINAL_ARTIFACT_20261016_V0_1.json`. The first binds 122 original provider files over 61 historical sessions, 1,935 complete symbol windows and 118,035 original OHLCV rows with independently verified hashes and individual row fields. Physical run `38826851466` succeeded. At the *actual* 2026-10-16 05:45 Taipei research cutoff, source-only evidence is available; at the *original* 2026-10-15 23:45 formal decision cutoff, independently authenticated availability is not proven. Original historical first-known/available-at versions remain uncertified. Therefore no 61-day retrospective Formal PIT or fabricated historical Shadow.

The second receipt binds original-source A1 to native present-day security-type and six corporate-action families: physical run `38834381884`, artifact `12017773951`, original ZIP and inner JSON independently verified, 20/20 tests. Its status is `SOURCE_ONLY_A1_PIT_PASS__CFI_CA_HISTORICAL_VINTAGE_STRICTLY_BLOCKED`. The native type sample is 30; 11 have known corporate-action exposure, 19 lack proven no-event coverage. Historical 61-session effective-dated security-type evidence, complete CA amendments/retractions/suspensions/negative witnesses, formal strategy universe and immutable frozen decision remain **not certified**. These are upstream source-quality facts only, not D02 H001 same-slot 15m evidence or System1 C1 operational acceptance.

## C. Four price-volume hypotheses — support, falsification, alternatives, failure

**D02-01 (volume units and semantics).** Mechanism: native share class, price/volume adjustment and corporate-action lineage can prevent false participation shifts. Counterexample: a known action does not necessarily contaminate already adjusted data; double adjustment can create a new error. Alternatives: market board, lot/share units, vendor adjustment policy, revision timing. Failure: absent effective-date/source-first-known clocks or a post-cutoff classification backfilled into a prior decision.

**H001 / D02-02 (same-slot relative volume).** Mechanism: same-clock historical volume removes intraday seasonal variation. Counterexample: 60 daily bars and even 118,035 historical A1 OHLCV rows do not establish 20 valid *15-minute same-slot* observations available before a feature decision; the observed PVE-261 baseline physical PASS remains absent. Alternatives: stale baseline, legal halt, listing age, provider delay, volume-unit change, action adjustment. Failure: unknown exact prior comparable slot, unverified baseline provenance/freshness, absent same-generation source clocks. Economic effect UNKNOWN, not BAD or zero.

**H20 / D02-03 (breakout volume).** Mechanism: higher participation may confirm acceptance of a price break. Counterexample: crowding/news/terminal exhaustion can also cause volume spikes; conditioning on complete-history symbols or 11 known-CA vs 19 unknown-CA controls creates selection bias. Alternatives: price momentum, industry common shocks, liquidity, board rules. Failure: no matched price-only vs price+volume comparison on a frozen event population and no independently dated out-of-sample, after-cost incremental evidence.

**H003 / D02-06 (effort vs result).** Mechanism: volume-relative price response may distinguish absorption from continuation/exhaustion. Counterexample: missing intermediate sessions, revisions and event censoring can mimic reversal. Alternatives: volatility, tick size, limit-hit mechanics, regime and corporate actions. Failure: noncausal outcome clocks, mixed data generations, unknown terminal outcomes coerced to negative/zero.

## D. Mandatory scientific controls and receipt routing

PIT: preserve published/first-known/captured/feature/decision clocks, original byte lineage and source revisions. OOS and walk-forward: future independently completed dates only, purge overlapping event windows; no historical Shadow synthesis. Selection bias: preserve full planned parent denominator and UNKNOWN missing cohorts. Look-ahead/data snooping/multiple testing: no post-outcome choice of feature, metric, horizon, comparator or target. Overfitting/redundancy: price-only baseline, shared information roots and cross-domain D01/D03 controls before treating volume as independent alpha. Sample adequacy/date clustering: D16 owns effective independent scan-date evidence; 1,908 symbols, 61 source dates and 118,035 rows are not independent D02 clean prospective dates. Costs/liquidity: D14 broker, spread, slippage, capacity and fill provenance; UNKNOWN costs never become zero. Regime: stratify by predeclared market states without selecting the best subgroup after returns. No returns inspected and no Formal change.

## E. Six PVE-289 acceptance lanes — no cross-credit

1. D16-19 frozen D02-specific predictive model-method receipts: 0/12 in canonical tracker; no newly validated exact-key receipt.
2. D14 D02-11 execution cost-quality receipt: absent; do not freeze utility/horizon.
3. System1 genuine scheduled operational C1 physical acceptance: not established by either source-only run.
4. PVE-261 deployed 15m exact-slot baseline physical PASS: not established by daily 60-session/A1 data.
5. S2-CORR-20261007-003 independent quota closure: remains open; implementation/source tests are not five physical-gate closure.
6. Legal numerical EffectTarget sources: 0/14; no fixture/current-outcome-based threshold.

Thus D02 maturity 60.0%, 12/12 L3, clean prospective dates 0, Gate 7 CLOSED, Formal Core LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE` NONE.

## Exact next continuation

Re-read latest `main` and compare only changed immutable receipts against the six frozen PVE-289 states. If none changes, remain `WAITING_EXTERNAL_RECEIPTS`; do not invent another PVE or repeat PVE-282~288. When a genuine System1 same-generation operational artifact appears, validate PVE-286/PVE-288; when a deployed exact-slot 15m remediation receipt appears, validate PVE-270/PVE-288 independently of the quota PVE-268 closure; D16 method, D14 cost and legal numerical target receipts remain their own separate validators. Independently investigate 204 gap-symbol listing/halt/calendar causes without converting them into prospective H001 credit. No Production, D1, Cron, Formal, trade, push, or billing changes in this research-only addendum.


## F. 2026-10-16 21:41 Taipei — prospective source-only 2330 change, no D02 gate credit

Re-read main at `e4095fb7054158428388394f8975a527d4f5bf20` after concurrent source-lane commits. Two new merged source-engineering changes are relevant to future lineage but **not** one of the six PVE-289 qualified external receipts:
- `0226c53b906d8ee41fc9b555e2b695fa44c7c0c7` adds a one-time native 2330 TWSE market-date A1 source-original capture and artifact workflow for 2026-10-16. Its own output intentionally has `pitEligible=false`, `historicalCfiEffectivePeriodsCertified=false`, `sameDayIndependentAuditAccepted=false`, `selectedCount=null`, `zeroPickDay=null` and no D1 writes. The script's cutoff is `2026-10-16T15:45:00.000Z` (23:45 Taipei); code and commit do not independently prove its main-push physical artifact actually succeeded.
- `e4095fb7054158428388394f8975a527d4f5bf20` adds read-only 60+1 native 2330 source byte-rehash and session-chain checks from earlier original artifacts plus the prospective original. A source-only 61-session chain does not establish historical first-known/available-at versions, effective historical security class, six corporate-action families and negative no-event completeness, separate AUDIT acceptance, or D02's exact-slot 15-minute history baseline.

PVE-289 outcome: no validated D16-19 receipt, D14 cost receipt, System1 operational C1 acceptance, PVE-261 deployed same-slot baseline PASS, independent CORR-003 closure, or legal numerical target source newly admitted in this D02 check. Treat physical workflow execution/receipt state as UNKNOWN until original run/job/artifact are independently read. No clean prospective D02 date, no economic effect, no maturity change. Future physical same-day source evidence must be admitted only through its own owner/clock gate and must not cross-credit H001 or Formal Core.

This section is an additive source-delta reconciliation, not PVE-290 and not a new feature design. Previous branch notes were recovered onto a branch created from latest main; the original branches remain untouched.
