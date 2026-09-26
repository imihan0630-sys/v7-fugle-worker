# K-line Pattern Research Checkpoint

Updated: 2026-09-25 Asia/Taipei

## Purpose
Durable handoff for the user's continuous K-line / chart-pattern deep research.
When a new chat continues K-line learning, read this file first, then `KLINE_PATTERN_RESEARCH.md`.
Do not restart from generic pattern introductions.

## Governance
- Formal Core remains LOCKED.
- Research / Shadow first.
- Missing evidence = UNKNOWN.
- No look-ahead, no historical Shadow fabrication, no outcome-tuned pattern definitions.
- Any later change affecting Formal selection/ranking/threshold/capital/execution/monitor/push needs explicit owner approval.

## Current research theme
DL-002 — Pattern Maturity / Multi-stage K-line Structure

## Completed durable sections
- DL-002A repaint-safe swing segmentation concept
- DL-002B data-readiness audit
- DL-002C redundancy map against current Formal features
- DL-002D alignment with existing R01-R08 research governance
- DL-002E Taiwan market-regime portability
- DL-002F candlestick evidence conflict / preregistration
- DL-002G evidence tiers
- DL-002H swing segmentation specification v0.1
- DL-002I VCP specification v0.1
- DL-002J Cup-with-Handle specification v0.1
- DL-002K W/Double-Bottom specification v0.1
- DL-002L Platform / Bull Flag / Triangle specification v0.1
- DL-002M Sakata / multi-candle sequence specification v0.1
- DL-002N cross-pattern de-duplication / latent geometry layer
- DL-002O isolated research data architecture / validation plan
- DL-002P adversarial detector test suite
- DL-002Q multi-peak / multi-trough reversal family
- DL-002R High Tight Flag vs overheat interaction
- DL-002S Pattern Maturity vs existing 15-minute execution layer
- DL-002T false-break / Spring / Upthrust structural events
- DL-002U multi-timeframe weekly/daily/15m context
- DL-002V gap / Three-Gap / Island-Reversal research
- DL-002W conditional price-volume / effort-vs-result research

- DL-002X Pennant / triangle subclasses / wedges

- DL-002Y Pattern Confidence / Ambiguity Profile

- DL-002Z Pattern Failure Timing / Acceptance Lifecycle

- DL-003A detector algorithm architecture comparison

## Key findings to retain
1. The system already uses substantial daily K-line structure; the real missing layer is multi-stage topology/lifecycle, not “K-lines are absent.”
2. Current system already has a crude W proxy: leftLow/rightLow/rightFootHigher. Do not duplicate it.
3. Current B breakout qualification mainly uses priorHigh20; longer pattern pivots/necklines may differ.
4. Current live history cache retains ~65 bars and discards historical OPEN even though Fugle source can provide it.
5. Fugle official historical candles support OHLCV, adjusted=true, listed-stock daily data back to 2010, with <1-year range per request.
6. Long-base and candlestick research should use a separate research-only data path, not mutate shared Formal cache by default.
7. Raw vs adjusted OHLC must be explicit; corporate-action gaps must not become pattern signals.
8. Swing points must keep pivotAt and confirmedAt. Confirmed pattern state at date t may use only swings with confirmedAt<=t.
9. VCP must use non-overlapping confirmed contraction legs; overlapping 5/10/20-day windows can create false contraction.
10. Named patterns are interpretation labels; quantitative research should use latent geometry dimensions to avoid double counting.
11. Cup/VCP have weaker direct academic alpha evidence than generic systematic chart-pattern recognition; treat them as hypotheses.
12. Taiwan candlestick studies are specification-sensitive; named candles cannot be assumed timeless.
13. Old Taiwan evidence predates 2015 price-limit widening and 2020 continuous trading; transportability must be tested.
14. High Tight Flag is a useful overheat conflict study because updated practitioner performance deteriorated versus early claims.
15. Pattern maturity must be studied separately from existing 15-minute BUY execution; good selection can still create NO-BUY because of no retest/maxChase.
16. Opening gaps vs true range gaps are distinct; Taiwan overnight and intraday returns contain different information.

## Current blockers
- CANDLESTICK_HISTORY_OPEN: research source available, live cache inadequate.
- LONG_PATTERN_HORIZON: research source available, live cache too short.
- CORPORATE_ACTION_ADJUSTMENT: source supports adjusted=true; research handling must be explicit.
- EXECUTION_COVERAGE: missing recorder rows cannot be interpreted as NO-BUY without complete date coverage.

## Exact next continuation point
1. Specify isolated Pattern Research cache schema with raw/adjusted OHLC, provenance, corporate-action flags, feature snapshots and detector-version metadata.
2. Specify deterministic as-of-date replay tests: fetched data -> swing engine -> topology -> pattern state must reproduce the historical snapshot exactly.
3. Define implementation order: research data layer -> swing engine -> structural levels -> VCP/W/Platform -> Cup -> Flag/Triangle/Wedge -> candlesticks/gaps after OPEN/adjustment readiness.
4. Define Pattern Research observability: coverage, data-blocked rate, repaint/prefix-invariance, detector disagreement, compute cost.
5. Research nested weekly/daily structure and whether weekly resistance explains daily R01 failures after controlling priorHigh60/MA60.
6. Keep primary detector architecture frozen: confirmed Directional-Change-style swings + transparent topology; PIP/kernel as independent robustness checks; DTW exploratory; ML deferred.
7. Implement synthetic/adversarial detector tests before any forward-return optimization if code is built.
8. Link diagnostics prospectively to Shadow Candidate Archive and execution recorder only when date coverage is complete.
9. Reuse R01 and existing D1/D3/D5/D10/MFE/MAE outcomes; do not create R09 yet.
10. Keep Formal Core unchanged until mature evidence supports a specific owner-approved proposal.

## Latest durable research commit
- `3377f6ded3eaeb4223b0f68562164da58554a495` — DL-003A detector architecture comparison.


## Continuation update — DL-003D
- Live connected Fugle audit found an important parameter-contract problem: `FCNT000154` requested with `adjusted=false` returned payload metadata `adjusted:true` for both TWSE 2412 and TPEx 6488. Therefore this connector route cannot certify RAW-vs-ADJUSTED parity; mismatch must block raw-gap/corporate-action validation rather than silently pass.
- C1-C8 counterexample fixtures are now frozen with deterministic synthetic inputs and expected detector states in `KLINE_PATTERN_RESEARCH.md`.
- Existing V8.7.2 Shadow Candidate Archive is confirmed as the Pattern parent population. Stable Pattern parent identity is `(scan_date,symbol)` plus parent snapshot hash; cohort_rank is not an identity key.
- Pattern v0.1 status: SPEC_READY / DATA_CONTRACT_GUARDED / NOT_IMPLEMENTED.
- Formal Core unchanged / LOCKED.

### Updated exact next continuation point
1. Resolve an authenticated RAW corporate-action source/path or prove the provider connector can truly return adjusted=false; until then RAW corporate-action fixture remains DATA_BLOCKED.
2. Translate frozen C1-C8 fixtures into executable isolated detector tests before any outcome study.
3. Implement only the lowest-level isolated research primitives first: data validator -> swing engine -> structural levels -> W/VCP/Platform; no full-universe scan and no Formal dependency.
4. Require prefix-invariance/replay exactness and Formal-isolation regression before enabling prospective Pattern logging.
5. Continue weekly/daily nested-resistance research controlling priorHigh60/MA60/R01 redundancy.

Latest durable research commit before this checkpoint update: `1fc02001fc0fea01b1ab42464b7901c6fec18c1d`.


## Continuation update — DL-003F
- Draft PR #102 now carries an isolated executable Pattern detector-QA prototype; no Worker.js wiring or production deployment.
- Latest validated research head for this update: `580d6080e89b4f750f16633c34bf8409b3e5941c`.
- V8 Regression run `36146803521` SUCCESS and V8 Repair run `36146803565` SUCCESS.
- Early failures are retained as evidence: null->0 coercion was fixed to preserve UNKNOWN; C2 was de-coupled so VCP topology and swing extraction have independent oracles.
- Executable C1-C8, prefix/replay, price-scale, data-quality, ATR-frozen MICRO/BASE/MAJOR swings, immutable zone versioning, Shadow parent hash conflict detection, and RAW_EXECUTION/TECHNICAL_CONTINUITY provenance firewall are now present.
- Major-zone hierarchy is pre-registered outcome-free: priorHigh20 comparator; BASE k=2 / 120 sessions; MAJOR k=3 / 260 sessions; simple 260-session high redundancy comparator. No hard available-air veto.
- VCP swing-only code refuses to claim full maturity until range/volume context exists.
- Corporate-action semantics are now cross-lane: direct FCNT000154 adjusted=false remains blocked as RAW, while Pattern consumes Corporate Actions lane semantic spaces. Real TWSE 2412 / 8454 and TPEx 5314 mechanics witnesses are covered.
- New falsification: corporate-action day does not imply “suppress all gaps”; only the mechanical reset is neutralized, while residual continuity-space gap remains market information.
- Four Pattern x Regime interactions are frozen only: RG1 breakout acceptance, RG2 nested resistance, RG3 compression/VCP, RG4 reversal/prior-trend.
- No outcome return was used to tune detector parameters. Pattern alpha remains UNKNOWN.
- Formal Core unchanged / LOCKED.

### Current status
`DETECTOR_QA_PROTOTYPE_PASS / DATA_SEMANTICS_CROSS_LANE_READY_WITH_GUARDS / PROSPECTIVE_RUNTIME_NOT_WIRED / ALPHA_UNKNOWN`.

### Updated exact next continuation point
1. Keep PR #102 Draft; no merge/deploy from detector QA alone.
2. Complete isolated VCP range/volume context and exact W/Platform lifecycle outputs.
3. Specify isolated Pattern research-cache adapter consuming Corporate Actions semantic spaces; do not use FCNT000154 false/raw as trusted RAW and do not build another adjustment engine.
4. Add Pattern observability: coverage, blocked-reason rates, replay/prefix exactness, scale disagreement, compute cost.
5. Only then consider prospective Pattern observer logging attached to existing Shadow parents; runtime wiring requires governance reclassification first.
6. No historical Formal-cohort fabrication and no outcome testing until prospective coverage is complete.
7. When evidence exists, run only preregistered PATTERN-RG1..RG4 plus frozen redundancy controls before any new interaction search.
8. Do not create R09 or propose Formal change yet.

Durable research detail: main `KLINE_PATTERN_RESEARCH.md` commit `a245b486dc60f29b623546416c2db4c6994465a4`.


## Continuation update — DL-003G
- Draft PR #102 research branch advanced without runtime wiring.
- VCP range/volume context is now executable: shrinking contraction depth, improving lows, declining down-leg volume/range and final dry-up/range context are separated from swing-only topology; incompatible prior-trend context is labeled generic compression rather than continuation VCP.
- W lifecycle is executable with true MID_HIGH neckline, undercut/reclaim variant, breakout/retest/failure chronology and prior-trend family context.
- Platform lifecycle is executable with repeated confirmed upper/lower touches, range/volume contraction context and breakout/breakdown states; narrow rolling range alone is insufficient.
- New isolated `pattern_observer_adapter_v0_1.mjs` now enforces Shadow-parent identity, Corporate Actions semantic spaces, point-in-time provenance, immutable payload hashes and provenance-conflict detection.
- Pattern observability v0.1 now measures coverage, blocked reasons, replay/prefix exactness, scale agreement and compute cost; no outcome return enters detector/adapter QA.
- Initial CI failed due to a literal escaped-newline import bug. It was diagnosed from Actions logs, fixed, and the corrected branch head `adefb586b4af2cbff6afd62dd0a6e0f7c413c784` passed V8 Repair `36147957526` and V8 Regression `36147957785`.
- 2025 Pacific-Basin Finance Journal Taiwan evidence on historical-high breakouts materially strengthens the counterargument to a hard resistance veto: old/high reference points can become momentum/underreaction states after a true break, with size/turnover/seasonality heterogeneity.
- Therefore major-zone logic stays lifecycle-based: approach -> first break -> accepted above -> failed break. No hard available-air veto.
- No forward outcomes were inspected for Pattern. Alpha remains UNKNOWN. Formal Core remains LOCKED.

### Current status
`DETECTOR_QA_PLUS_LIFECYCLE_PASS / CACHE_ADAPTER_QA_PASS / OBSERVABILITY_SPEC_EXECUTABLE / RUNTIME_NOT_WIRED / ALPHA_UNKNOWN`.

### Updated exact next continuation point
1. Keep PR #102 Draft and un-deployed.
2. Reconcile branch divergence against latest main before any further engineering; do not overwrite newer main changes.
3. Specify prospective Pattern observer persistence schema/API boundary as isolated Class-A design; runtime wiring must still be reclassified before merge/deploy.
4. Add explicit observer-level episode de-dup and blocked-coverage acceptance thresholds without using future returns.
5. Prepare prospective-only Shadow-parent coverage gate; no historical Formal cohort fabrication.
6. After enough prospective complete dates exist, run only preregistered PATTERN-RG1..RG4 and frozen redundancy controls.
7. Distinguish major-zone lifecycle states (approach / first break / accepted / failed) from current R01/local breakout without changing Formal logic.
8. Do not create R09 or propose Formal optimization until maturity/date/regime/holdout/cost gates are met.


## Continuation update — DL-003H through DL-003J
- Older Draft PR #102 is CLOSED / NOT MERGED / NOT DEPLOYED. It was superseded because it fell far behind main.
- New Draft PR #103 uses branch `research/class-a-pattern-shadow-v0-2-20260926`, refreshed from a much newer main baseline. It remains research-only and unmerged.
- Latest validated PR #103 head in this update: `5847e294d1c5644d9ec1d34343400618b10973c9`.
- CI on that head: V8 Repair `36203275992` SUCCESS; V8 Regression `36203275970` SUCCESS.
- The branch now includes outcome-free observer episode identity and run-receipt gates. Every expected Shadow parent must resolve exactly once to VALID or explicit BLOCKED; silent missing, duplicate parent, provenance conflict, replay mismatch or prefix mismatch blocks outcome joining.
- `research/PATTERN_OBSERVER_PERSISTENCE_V0_1.md` freezes the proposed immutable parent/snapshot/run contract. No production D1 migration/API wiring is authorized.
- A causal major-zone lifecycle primitive is executable and prefix-invariant: BELOW/APPROACH -> FIRST_BREAK -> HOLDING_ABOVE -> REENTERED -> FAILED, with break/reentry counts and above-zone close streak. No fixed acceptance bar-count is tuned.
- External evidence now supports a state-dependent resistance interpretation rather than a one-sign touch-count score: pre-break barrier memory can coexist with faster movement after a true cross; Taiwan 2025 historical-high evidence strengthens the post-break momentum side. Touch count remains unsigned/descriptive.
- Taiwan price-limit evidence supports preserving `localBreakout=true` while labeling a limit-constrained bar `UNRESOLVED`; classic Taiwan studies show magnet/delayed-price-discovery/overnight-vs-intraday effects, but modern 10% continuous-trading transportability must be tested separately.
- Fugle `FCNT000002` is materially validated as a raw-traded OHLC research source through real 8454, 5314 and 2412 corporate-action witnesses. It preserves raw nominal resets and verified suspension gaps.
- Critical field guard: FCNT000002 `change/change_rate` are not raw close-to-close arithmetic on corporate-action sessions, and `refPrice` is not a universal unit-comparable opening reference. Pattern raw-return/gap logic must not use those fields blindly.
- FCNT000002 volume is lots, not shares.
- `research/PATTERN_RUNTIME_READINESS_MATRIX_V0_1.md` freezes current overall state: GO_ISOLATED_QA / NO_GO_RUNTIME. Detector mechanics are no longer the primary blocker; production-grade TECHNICAL_CONTINUITY, symbol-session provenance, supply/unit-change volume semantics and shared-runtime wiring remain unresolved cross-lane dependencies.
- No Pattern forward outcomes were inspected; no parameter was tuned to returns; no R09; Formal Core remains LOCKED.

### Current status
`ISOLATED_DETECTOR_AND_OBSERVER_QA_PASS / RAW_OHLC_RESEARCH_PATH_MATERIAL_PASS / RUNTIME_SEMANTIC_PATH_BLOCKED / ALPHA_UNKNOWN`.

### Updated exact next continuation point
1. Keep Draft PR #103 unmerged/un-deployed. Before any future merge proposal, port/reconcile onto then-current main because other research lanes advance main rapidly.
2. Do not request Pattern runtime wiring yet. First require an approved point-in-time runtime path for RAW_EXECUTION + TECHNICAL_CONTINUITY, verified symbol-session completeness and fail-closed unit/supply-change volume semantics.
3. Continue Pattern learning offline: strengthen real-witness source QA and lifecycle falsification without adding outcome-tuned thresholds.
4. Keep touchCount unsigned; preserve repeated-test progression and major-zone lifecycle as continuous/as-of descriptors.
5. Keep limit-constrained structural breakouts separate from ordinary acceptance; modern 10%-continuous-trading evidence must be prospective/modern-regime.
6. Do not fabricate historical Pattern Shadow rows. Outcome joins remain blocked until prospective complete parent coverage exists.
7. When runtime/data gates eventually clear, run only PATTERN-RG1..RG4 plus frozen redundancy controls and existing maturity/date/regime/holdout/cost gates.
8. Do not create R09 or propose Formal optimization yet.
