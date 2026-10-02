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


## Continuation update — DL-003K
- Modern Taiwan market-structure evidence now strengthens the regime-portability guard.
- TWSE switched from frequent batch auctions to continuous intraday trading on 2020-03-23.
- 2026 Journal of Financial Markets evidence finds the switch generally improved liquidity/price efficiency, especially for mid/small caps; separate 2026 Taiwan evidence finds stronger disposition/overconfidence behavior after continuous trading, especially in retail-heavy stocks.
- These are not treated as a direct Pattern alpha claim. They imply that modern price discovery and retail behavioral feedback can coexist.
- Primary evidence for 2026 Pattern decisions must therefore be post-2020 continuous-trading evidence. Pre-2020 7%/batch-auction studies remain mechanism/detector-stress evidence, not directly representative effect sizes.
- Do not create a combinatorial new Pattern interaction family. Reuse PATTERN-RG1..RG4 and keep marketStructureRegime as a structural-era control.
- C4 constrained-breakout evidence must eventually be prospective under the current 10% + continuous-trading regime.
- Formal Core remains LOCKED; no new factor or threshold.


## Continuation update — DL-003L through DL-003T (long-cycle update)
- This cycle deliberately continued for a full research tranche rather than stopping after one paper/test.
- External evidence materially strengthens the named-label firewall. Jiang/Kelly/Xiu-style machine chart evidence shows that many textbook chart labels do not reliably preserve their conventional directional sign; formal classification literature independently shows there is no industry-wide unambiguous definition for many chart/candlestick patterns. Therefore named Pattern labels remain explainability metadata, not bullish/bearish priors.
- Modern machine-chart evidence (Jiang/Kelly/Xiu; Murray/Xia/Xiao; Korea extension) supports the existence of nonlinear chart information distinct from simple momentum/reversal, but this does NOT justify implementing ML now. ML remains a future independent falsification benchmark after clean prospective Pattern data maturity.
- Taiwan candlestick evidence remains historically positive for a small subset of patterns but is pre-2020; holding/exit design materially affects profitability. Pattern candle shape is therefore not a self-contained trading rule.
- Draft PR #103 now has an outcome-free two-day candlestick relational encoder requiring OPEN + TECHNICAL_CONTINUITY. It stores ATR-normalized body/range, wick ratios, close location, overlap/containment/engulfment, penetration, prior-trend context, corporate-action-boundary flag, plus Taiwan-relevant overnight/intraday/total-return decomposition. Named Engulfing/Harami/Piercing labels are descriptive only.
- Latent geometry expanded without return tuning:
  - confirmed upper/lower boundary slopes, normalized fit error, width compression and projected apex for Platform/Flag/Triangle/Pennant families;
  - explicit confirmed H-L-H Cup/bowl depth, rim difference, time symmetry, bottom residence and curvature residual;
  - explicit impulse/consolidation pole return/path-efficiency plus consolidation depth/range/volume/true-range relations;
  - continuous repeated-resistance progression (distance slopes, rejection compression, pairwise improvement, optional volume/turnover progression), while touchCount remains unsigned;
  - cross-family shared-anchor overlap diagnostics to prevent W/Cup/Flag/etc. labels from being double-counted as independent evidence.
- New main research contracts:
  - `research/PATTERN_NAMED_LABEL_GOVERNANCE_V0_1.md`;
  - `research/PATTERN_LATENT_GEOMETRY_V0_1.md`.
- Taiwan-specific counterevidence strengthened:
  - old Bull-Flag/TWI evidence supports formalized detection, while Taiwan Reality-Check/SPA work shows broad technical-rule profits can disappear after data-snooping, non-synchronous-trading and cost corrections;
  - TWSE limit-order research documents round-price clustering and barrier behavior, so nested historical resistance must later control round-number/tick proximity rather than claiming the whole mechanism;
  - close location has state-dependent meaning. Current Formal B explicitly requires closePosition>=0.65 and upperShadow<=0.35 in a breakout-acceptance context, while broader external reversal/chart evidence can assign different meaning to low close locations. This is not a Formal defect; it means Pattern must control existing close-location context rather than create a universal sign.
- Pattern selection and execution roles are now explicitly separated. Pattern maturity may eventually be Selection/WATCH information, but there is no evidence to bypass the existing 15m execution layer, RR, maxChase, liquidity or 3+3+3 rules.
- Latest isolated research head: `2ba148d5a0aaaca6173b7ba4d1f8a9f24754e6b4`.
- CI on that head: V8 Repair `36205822887` SUCCESS; V8 Regression `36205822864` SUCCESS.
- PR #103 remains Draft / unmerged / un-deployed. Current branch comparison shows it is already 56 commits behind rapidly advancing main; therefore green CI is NOT merge readiness and future promotion must re-port/reconcile onto then-current main.
- No Pattern forward outcomes were inspected. No historical Shadow rows were fabricated. No R09. Formal Core remains LOCKED.

### Current status
`LATENT_GEOMETRY_V0_1_QA_PASS / NAMED_LABEL_SIGN_UNKNOWN / SOURCE_RESEARCH_FEASIBLE / PROSPECTIVE_RUNTIME_NO_GO / ALPHA_UNKNOWN`.

### Updated exact next continuation point
1. Treat latent-geometry v0.1 as frozen for now; stop adding named Pattern families merely to expand the catalog.
2. Keep PR #103 Draft and do not merge/deploy. If a future runtime proposal becomes decision-ready, first re-port/reconcile the isolated research files/tests onto then-current main and rerun full protected-output regressions.
3. Continue outcome-blind real-source/detector falsification: OPEN/TECHNICAL_CONTINUITY semantics, symbol-session/suspension handling, corporate-action boundaries, limit-constrained bars, low-liquidity cases and round-number resistance confounding.
4. Do not add a round-number score. If studied later, pre-register a Taiwan tick-aware proximity control before outcomes.
5. Preserve close location, volume and volatility as existing Formal/PV controls; Pattern must prove incremental geometry beyond them.
6. No historical Pattern outcome inference. Prospective outcome joins require COMPLETE parent coverage/run receipts and point-in-time semantic readiness.
7. If cross-lane RAW_EXECUTION + TECHNICAL_CONTINUITY + symbol-session + volume semantics become runtime-ready, then prepare a Class-B prospective observer-wiring proposal for owner approval; no merge/deploy before approval.
8. Only after clean prospective dates exist, run frozen PATTERN-RG1..RG4 plus redundancy/date-cluster/holdout/cost gates. No R09 and no Formal optimization proposal before that evidence.


## Continuation update — DL-003U through DL-003V
- Real FCNT000002 falsification exposed a provider-history hazard: TPEx 5314 contains flat zero-amount/zero-volume pseudo-bars on verified suspension dates. Official TPEx evidence confirms 2025-10-14 and 2026-05-13 suspension, and 2025-08-13 resumption supports 2025-08-12 as a non-ordinary session. Provider bar presence is therefore not symbol-session proof.
- Draft PR #103 now requires the actual verified symbol-session date set when `requireSymbolSession=true` and fails closed on `NON_SYMBOL_SESSION_BAR_PRESENT`. A Boolean provenance receipt alone is insufficient.
- FCNT000002 also contains real low-liquidity 5314 rows with volume=0 lots but amount>0. Taiwan odd-lot rules permit sub-1,000-share trading, so zero lot-volume cannot mean zero trading. The isolated envelope now exposes `volumeSubLotRemainderRisk` and `volumeMagnitudeReady`; exact VCP/dry-up magnitude cannot silently use sub-lot activity as zero.
- Modern 5314 2025-09-03 through 09-08 provides a real consecutive-limit-up stress witness. Each day remains localBreakout=true but priceLimitConstrained=true / acceptance UNRESOLVED; the first later unconstrained session becomes OBSERVABLE. C4 therefore resolves on the first eligible unconstrained symbol-session, not mechanically the next session.
- Latest validated Pattern research head: `69aace54c8d7d7b5ea2f7609495e5dea5eb616c2`; V8 Repair `36210022595` SUCCESS; V8 Regression `36210022603` SUCCESS.
- No Pattern outcomes, no historical Shadow fabrication, no R09, no Formal change.

### Updated exact next continuation point
1. Keep latent geometry v0.1 frozen; no family catalog expansion.
2. Continue real-source falsification only where it can change data-validity semantics: no-trade vs suspension, corporate-action continuity, exact volume units, current-regime price-limit/session mechanics.
3. Pattern runtime remains NO_GO until approved PIT RAW_EXECUTION + TECHNICAL_CONTINUITY + explicit symbol-session membership + fit-for-purpose volume semantics exist.
4. Do not infer alpha from the 5314 witnesses; they are detector/data-quality stress cases.
5. Prospective Pattern outcome work still waits for COMPLETE parent coverage/run receipts.
6. Formal Core LOCKED.

## Continuation update — DL-003W through DL-003X (2026-09-27)
- Cross-lane ownership is now explicit: Price-Volume owns same-slot RVOL/cumulative-volume/acceptance/persistence; Microstructure owns auction/volatility-interruption execution mechanics; Pattern consumes those verified states as controls/guards and must not fork alternative definitions.
- Corporate-action endpoints can expose future effective/ex-date rows, so present-day pulls are not automatically point-in-time announcement evidence. Realized continuity processing may use events effective on/before as-of under verified semantics; future event knowledge cannot be backfilled without a separate availability timestamp.
- Volume-unit semantics are source-specific. Fugle official historical daily regular-stock candles document volume in shares, while intraday regular-stock candles are lots; Pattern FCNT000002 witness audit also found lots. Every adapter must carry volumeUnit/source and fail closed for exact magnitude when sub-lot/unit/session semantics are unresolved.
- TWSE official historical Suspended Securities data explicitly begins 2011-10-03. Earlier strict TWSE symbol-session provenance is therefore incomplete unless another authoritative source closes the gap.
- TPEx historical halt/resumption pages expose security-level suspension and resumption dates/times; earliest complete coverage remains UNKNOWN until independently established.
- A market-open date is not sufficient symbol-session proof. Security-specific suspension/resumption, delayed opening, delayed closing and volatility interruption can alter intraday bar semantics.
- TWSE resumption first collects orders and matches 30 minutes later by call auction; modern TWSE/TPEx opening can be delayed 2 minutes and closing can extend to 13:33 under stability rules. Pattern intraday interpretation must consume canonical session guards rather than assume every stock has ordinary 09:00-13:30 bars.
- For daily Pattern morphology, verified suspension pseudo-bars must not become zero-range/zero-volume candles; duration uses eligible observed trading bars, with TECHNICAL_CONTINUITY across resumption/corporate-action boundaries.
- Pattern runtime remains NO_GO. No Pattern outcomes inspected; alpha UNKNOWN; Formal Core LOCKED.

### Updated exact next continuation point
1. Keep latent geometry v0.1 frozen and stop adding named families.
2. Continue outcome-blind source falsification on the remaining runtime semantic blockers: authoritative trading-unit/share-unit provenance, symbol-session coverage, corporate-action continuity and current-regime price-limit/session mechanics.
3. Reuse Price-Volume and Microstructure canonical guards; Pattern must not duplicate same-slot volume or auction/VI specifications.
4. Determine whether official security metadata can supply point-in-time tradingUnit/share-unit changes; never convert lots to shares with an assumed constant 1,000 across unit-change events.
5. Treat TWSE pre-2011-10-03 strict symbol-session history as coverage-limited; do not silently call it complete.
6. Keep Pattern observer persistence unwired. Runtime wiring remains governance-gated and requires RAW_EXECUTION + TECHNICAL_CONTINUITY + explicit symbol-session + fit-for-purpose volume semantics.
7. Prospective outcome joins still require COMPLETE parent run receipts; no historical Pattern Shadow fabrication.
8. Formal Core remains LOCKED; no R09 / no optimization proposal before clean prospective evidence.

## Continuation update — DL-005A through DL-005G (2026-09-28)

### Core-family unification
- Mandatory D01 themes now share one four-layer framework:
  MACRO_TOPOLOGY -> COMPRESSION_PROGRESSION -> LOCAL_CANDLE_SAKATA -> TRIGGER_LIFECYCLE.
- W/M, Cup, VCP, K-line/Sakata and breakout/false-break are no longer treated as independent label votes by default.
- Frozen rule:
  NAMED LABEL COUNT != DISTINCT STRUCTURAL OBJECT COUNT != INDEPENDENT INFORMATION COUNT.
- Durable contracts:
  research/PATTERN_CORE_FAMILY_UNIFICATION_V0_1.md
  research/pattern_core_family_unification_v0_1.json

### Executable evidence de-dup
- New outcome-free helper/tests:
  research/pattern_evidence_dedup_v0_1.mjs
  research/test_pattern_evidence_dedup_v0_1.mjs
- Adversarial QA PASS:
  - same-anchor W + Cup => one exact-anchor structural group;
  - nested W/Cup partial overlap remains continuous Jaccard, no arbitrary independence threshold;
  - Cup Handle + VCP + Platform exact contraction overlap => one exact-anchor group;
  - W/Cup/VCP same boundary+firstBreakAt => one trigger event;
  - Sakata local motif inside breakout can add a structural layer but remains the same PRICE_OHLC root provenance;
  - Sakata Three Mountains vs M/top same peaks => one macro group;
  - Sakata Three Methods vs short Flag same anchors => one impulse/consolidation group.
- scoringVoteCount intentionally remains null.

### Causal breakout / false-break lifecycle
- New research-only state machine:
  research/pattern_breakout_lifecycle_v0_1.mjs
  research/test_pattern_breakout_lifecycle_v0_1.mjs
  research/PATTERN_BREAKOUT_FALSE_BREAK_LIFECYCLE_V0_1.md
- Key semantic separations:
  rejected intraday pierce != failed confirmed breakout;
  retest != failure;
  reentry into zone != full below/above-zone failure;
  failure may later reclaim;
  no-follow-through != false breakout without structural reentry/failure.
- UP/DOWN mirror supported.
- No fixed 3D/5D failure threshold.
- Constrained price-limit break remains UNRESOLVED until first eligible unconstrained symbol-session.
- Suspension/non-symbol-session pseudo-bars cannot create lifecycle events.
- asOf prefix-invariance PASS: future failure cannot backwrite prior state.
- boundary-version firewall PASS:
  same ID/version/coordinates may continue;
  new version requires reset;
  same version with mutated coordinates is PROVENANCE_CONFLICT;
  different boundary ID is a new lifecycle object.

### Sakata decomposition
- Durable contracts:
  research/PATTERN_SAKATA_DECOMPOSITION_V0_1.md
  research/pattern_sakata_decomposition_v0_1.json
- Three Mountains -> macro resistance topology; overlaps M/triple-top/repeated resistance.
- Three Rivers -> explicit definitionVariant required because modern descriptions are not uniform.
- Three Gaps -> gap/session/event mechanics; count=3 has no automatic reversal/exhaustion sign.
- Three Soldiers -> local candle sequence; high redundancy prior vs short-horizon momentum/close-location/body-range expansion.
- Three Methods -> impulse/consolidation/continuation; high redundancy prior vs Flag/micro-Platform/VCP final leg.
- Single Sakata score is rejected.

### Evidence / maturity
- Systematic chart-pattern literature supports objective pattern detection, not label-count voting.
- Taiwan candlestick literature supports empirical testability of some candle morphologies, but principal evidence is pre-modern current regime.
- No Pattern forward outcomes inspected.
- No tracker maturity upgrade:
  D01 remains 51.7%.
- D01-05/D01-06/D01-08 remain L3;
  D01-07/D01-12 remain L2.
- No R09.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core remains LOCKED.

### Updated exact next continuation point

1. Freeze the four-layer hierarchy; no named-family catalog expansion.
2. Next: multi-scale nested-structure graph for weekly/daily/local objects, with explicit parent-child scale relationships and overlap de-dup.
3. Extend breakout lifecycle with continuous no-follow-through/time-above/extension/reclaim path descriptors without tuning fixed thresholds.
4. Continue Sakata Three-Gaps only under valid OPEN + continuity + session semantics.
5. Keep all named-label signs UNKNOWN pending modern prospective evidence.
6. Pattern runtime remains NO_GO until shared TECHNICAL_CONTINUITY + explicit symbol-session + fit-for-purpose volume/trading-unit semantics are runtime-ready.
7. Prospective outcomes still require COMPLETE immutable parent/run coverage; no historical fabrication.
8. Formal Core remains unchanged.

### Durable commits in this tranche
- 47f94d601138b040b84707abca9acb3741f9c3b6 — core-family unification document.
- b6b97914f70e4146258e7510260845297b9c68f6 — machine-readable core-family contract.
- 7c25e746c93323577715fd0947d75a7aa2e9021f — evidence de-dup helper.
- ed1ac0f94295efc6c3ae72ec886abfe02b6e2b83 — cross-family/Sakata de-dup adversarial tests.
- 486ba694e09d13dffacf563552ca6526a18614b6 — causal breakout lifecycle with as-of/boundary guards.
- fc0ede4065d182170da342075979ee8069b2b617 — breakout lifecycle prefix-invariance test correction/pass.
- f48d5b3a07410ca90c35748dcae2c330d0ca8cd3 — Sakata decomposition research document.
- 0f98f5a30ef16327c50916fd8bb434e3d9819184 — machine-readable Sakata contract.

## Continuation update — DL-006A through DL-006D (2026-09-28)
- See `research/PATTERN_NESTED_STRUCTURE_AND_GAP_V0_1.md`. Outcome-blind research specification: causal weekly/daily/local graph, explicit CONTAINS/REFINES/SHARES_ANCHORS/SHARES_TRIGGER/CONTRADICTS edges, and no transitive equivalence or label voting.
- Weekly aggregates require verified eligible daily constituents; a weekly pivot enters only after confirmation. As-of prefix and immutable semantic-space/boundary versions govern ancestry and breakout chronology.
- Continuous breakout path descriptors specify eligible-session denominators, break-bar inclusive vs post-break extension, constrained/unobservable state and null for unavailable future information. No arbitrary N-day cutoff or directional sign.
- Three-Gaps separates overnight and non-overlap gaps from continuity-space gaps; OPEN, technical continuity, corporate action and security-specific sessions are prerequisites. Mechanical ex-rights reset is neutralized while any residual continuity-space gap remains assessable. Directional value UNKNOWN.
- Positive hypotheses and countermechanisms are explicit; no returns inspected, no Shadow fabrication, no R09, no tracker upgrade (D01 51.7%), no Formal optimization candidate; Formal Core LOCKED.

### Exact next continuation point after DL-006
1. Build isolated synthetic graph fixtures for weekly/daily ancestry, confirmation timing, partial week, semantic-space conflict and non-transitive overlap; require prefix replay equality.
2. Prototype continuous path descriptors as research-only functions with break-bar inclusion, observed-session denominators, constrained sessions and boundary version tests; do not wire runtime.
3. Seek authoritative OPEN/continuity/session witnesses before any Three-Gaps detector; DATA_BLOCKED where unavailable.
4. Keep prospective outcome joins blocked pending COMPLETE immutable parent/run receipts and source-semantic readiness; test incremental value only against frozen controls and preregistered interactions.
5. Keep Formal Core LOCKED and Pattern direction UNKNOWN.

## Continuation update — DL-007A through DL-007C (2026-10-01)

- Main already contained DL-006 continuation artifacts that the durable checkpoint had not indexed: nested-graph fixtures/receipt (10/10 contract cases PASS) and breakout-path fixtures/receipt (12/12 contract cases PASS). These were recovered from GitHub main; no Work-chat state was trusted as canonical.
- New Class-A implementation-level research files on branch research/d01-pattern-dl007-impl-20261001:
  - research/pattern_nested_graph_v0_2.mjs
  - research/test_pattern_nested_graph_v0_2.mjs
  - research/pattern_breakout_path_v0_1.mjs
  - research/test_pattern_breakout_path_v0_1.mjs
  - research/PATTERN_DL007_IMPLEMENTATION_AND_COUNTEREVIDENCE_V0_1.md
- Isolated Node execution before PR:
  - nested graph: 12/12 PASS;
  - breakout path: 14/14 PASS after one deliberate falsification caught a normalization asymmetry.
- The failed mirror test is material: using the upper edge as the UP percentage denominator and the lower edge as the DOWN denominator mechanically created directional asymmetry. The descriptor now uses the boundary midpoint as the common scale denominator; exact UP/DOWN mirror invariance then passes.
- Nested graph v0.2 now explicitly fails closed / preserves UNKNOWN for:
  missing confirmedAt, partial higher-timeframe parent use, semantic-space conflict, cross-symbol edges, boundary-version conflict and same-version coordinate mutation.
- Breakout path v0.1 separates eligible / observable / constrained clocks, break-bar-inclusive vs post-break extension, first reentry/failure/reclaim clocks, continuity/session blockers and constrained-price-limit unresolved states. No fixed N-day verdict is introduced.
- New Taiwan evidence:
  - Chen et al. (Pacific-Basin Finance Journal, online 2026-09-21, DOI 10.1016/j.pacfin.2026.103390) finds mechanically detected HS bottoms stronger than tops and shows decision rules / Bry-Boschan confirmation matter; data end 2018-03-02, so this is not current post-2020-regime effect-size evidence.
  - Lee & Chou (Pacific-Basin Finance Journal 93, 2025, DOI 10.1016/j.pacfin.2025.102853) finds historical-high breaks in Taiwan can enter a positive underreaction/momentum regime, arguing against a universal hard-resistance veto; effect heterogeneity by size/turnover/seasonality remains material.
  - Older Taiwan candlestick positives remain counterbalanced by Reality-Check/SPA evidence showing technical-rule profits can disappear after data-snooping, non-synchronous-trading and cost controls.
- D01 maturity remains 51.7%; no tracker promotion.
- No Pattern forward outcomes inspected; no historical Shadow fabrication.
- Pattern runtime remains NO_GO.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-007

1. Preserve repository-executable CI/PR evidence for the new nested-graph and breakout-path tests; local isolated PASS is not by itself a production/runtime readiness claim.
2. Deepen D01-10 multi-scale falsification: distinguish genuinely incremental cross-scale topology from deterministic aggregation of the same PRICE_OHLC root.
3. Pre-register local-vs-major breakout definitions before using 2025 historical-high evidence in any outcome study.
4. Keep HS/candlestick named signs UNKNOWN for current-regime use; the new 2026 HS publication still uses pre-2020 data.
5. Continue source-semantic blockers: PIT RAW_EXECUTION + TECHNICAL_CONTINUITY + explicit symbol-session membership + fit-for-purpose volume/trading-unit semantics.
6. Prospective Pattern outcome joins remain blocked pending COMPLETE immutable parent/run receipts.
7. No R09 / no Formal optimization proposal before prospective/OOS, redundancy, regime, cost and multiple-testing gates pass.

## Continuation update — DL-008A through DL-008F (2026-10-02)

- D01 multi-timeframe research now explicitly inherits the shared Technical-Indicator multi-timeframe contract instead of creating a second incompatible framework.
- Three novelty layers are frozen:
  1. Source Novelty（來源新穎性）;
  2. Representation Novelty（表示新穎性）;
  3. Predictive Incrementality（預測增量）.
- Weekly OHLC built from verified daily constituents is deterministic aggregation and therefore not new raw PRICE_OHLC information.
- A many-to-one aggregation witness is frozen: two different daily paths can share the same weekly Open/High/Low/Close. Higher-timeframe aggregation can compress/lose path information; it cannot manufacture new raw observations.
- Same raw source does NOT imply zero possible research value. A weekly parent topology can still be a nonlinear representation candidate relative to the current finite daily baseline controls, but it remains one PRICE_OHLC root family and never receives an independent vote.
- New Class-A research-only artifacts:
  - research/PATTERN_MULTISCALE_INCREMENTALITY_V0_1.md
  - research/pattern_multiscale_incrementality_v0_1.mjs
  - research/test_pattern_multiscale_incrementality_v0_1.mjs
  - research/pattern_multiscale_incrementality_contract_v0_1.json
- The executable test file defines 16 adversarial cases covering deterministic aggregation, many-to-one information loss, same-event de-dup, equal-horizon nesting, cross-scale representation, partial higher-timeframe blocking, future confirmation, semantic-space conflicts, missing provenance, episode de-dup, multiple-testing identity and after-market vs next-session intraday clocks.
- IMPORTANT evidence boundary: these 16 cases are authored but not yet executed in a reproducible Node environment in this tranche. Do NOT record 16/16 PASS until an actual run receipt exists.
- Outcome testing remains closed. Predictive Incrementality is frozen as UNKNOWN_REQUIRES_PREREGISTERED_OUTCOME_TEST.
- No multiTimeframeScore and no scale-alignment vote count.
- No new R09. Future nested-resistance outcome work remains inside existing PATTERN-RG2.
- External evidence remains two-sided:
  - 2026 Pacific-Basin Finance Journal multi-timescale/shrinkage evidence supports horizon decomposition but finds technical predictors unstable and short-term components dominant;
  - wavelet/de-noising and aligned-index literature supports the possibility that transformed representations can add forecast value without creating a new raw source family;
  - 2026 overlapping-return evidence strengthens the effective-N / overlapping-window firewall;
  - large technical-rule universes under data-snooping / false-discovery controls reinforce the need to count timeframe/alignment choices in the multiple-testing family.
- D01 maturity remains 51.7%; D01-10 remains L3.
- Pattern alpha remains UNKNOWN.
- Pattern runtime remains NO_GO.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-008

1. Obtain a reproducible Node run receipt for the 16 DL-008 adversarial cases; until then status is EXECUTABLE_SPEC_WRITTEN / TEST_EXECUTION_PENDING.
2. Deepen PATTERN-RG2 nested resistance: freeze local boundary vs major parent boundary identity, normalized distance and lifecycle semantics.
3. Freeze equal-horizon and bar-boundary placebo definitions before any outcome join; do not search for the best timeframe after outcomes.
4. Build an outcome-blind redundancy map from weekly-parent descriptors to existing priorHigh60 / MA60 / major-zone / ret60 / ATR / daily-Pattern controls.
5. Keep scale count out of effective N; cluster later inference by scan date and parent/child episode.
6. Keep prospective Pattern outcomes blocked until COMPLETE immutable parent/run receipts and runtime semantic readiness exist.
7. No R09 / no Formal optimization proposal before PIT, prospective/OOS, redundancy, regime, cost and multiple-testing gates pass.
