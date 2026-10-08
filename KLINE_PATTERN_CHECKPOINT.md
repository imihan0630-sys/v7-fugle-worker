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

## Continuation update — DL-009A through DL-009E (2026-10-02)

- Existing PATTERN-RG2 nested-resistance hypothesis is now semantically frozen before outcomes; no new hypothesis family was created.
- New durable artifacts:
  - research/PATTERN_RG2_NESTED_RESISTANCE_V0_1.md
  - research/pattern_rg2_nested_resistance_v0_1.json
- Scale definitions are inherited unchanged from the already-frozen Pattern hierarchy:
  - Formal comparator = priorHigh20;
  - BASE = lagged-ATR Directional-Change k=2 / 120 eligible symbol sessions;
  - MAJOR = k=3 / 260 eligible symbol sessions;
  - simple 260-session high = mandatory redundancy comparator.
- Primary local boundary is the immutable confirmed Pattern trigger boundary (neckline/rim/platform/VCP boundary). priorHigh20 remains a comparator and must not masquerade as a true Pattern neckline.
- Primary parent zone is the immutable confirmed MAJOR structural zone with zoneId/version/lower/upper/center/confirmedAt and semantic-space provenance.
- Future parent confirmation, semantic-space conflict, or same-version coordinate mutation fails closed.
- availableAir is frozen as a continuous descriptor; it may be positive/zero/negative and is not a hard rejection rule.
- Relation semantics separate:
  local break still below parent / local break entered parent / parent first break / holding above / reentered / failed.
- No arbitrary new "near resistance = X%" threshold is introduced.
- Redundancy ladder is frozen from priorHigh20 -> priorHigh60 -> MA60/ret20/ret60/overheat -> simple260-high -> structural BASE/MAJOR zone -> lifecycle -> round-price/D02/regime/liquidity.
- If MAJOR topology loses residual value after simple260-high, classify it REDUNDANT rather than preserve a named structural factor.
- Taiwan 2025 historical-high evidence remains explicit counterevidence to a hard resistance veto: a true break can transition into underreaction/momentum. Round-price clustering literature is retained as a confound control, not a score.
- RG2 outcome status remains CLOSED. Predictive incrementality remains UNKNOWN.
- D01 maturity remains 51.7%; no module promotion.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-009

1. Create outcome-blind RG2 adversarial fixtures for local-below-parent, overlap, local-break-enters-parent, parent-first-break, hold, reentry/failure, future-parent, coordinate-mutation and semantic-space-conflict cases.
2. Reuse existing major-zone lifecycle rather than fork another state machine.
3. Map RG2 fields against Pattern round-price control and Target/RR research so each source owns one canonical definition.
4. Preserve the simple260-high comparator and the full redundancy ladder in any future PATTERN-RG2 outcome design.
5. Keep outcome joins closed until prospective Pattern parent/run coverage is COMPLETE and semantic runtime blockers clear.
6. No hard resistance veto / no R09 / no Formal change.

## Continuation update — DL-010A through DL-010D (2026-10-02)

- RG2 now has an isolated research-only relation calculator:
  - research/pattern_rg2_relation_v0_1.mjs
- 12 adversarial RG2 cases are defined:
  - research/test_pattern_rg2_relation_v0_1.mjs
  - research/pattern_rg2_nested_resistance_fixtures_v0_1.json
- IMPORTANT evidence boundary: the 12 RG2 cases are DEFINED_NOT_YET_EXECUTED in this chat. Do not claim 12/12 PASS without a reproducible Node run receipt.
- The calculator is deliberately threshold-free:
  - local below parent;
  - boundary overlap;
  - local above parent;
  - first parent break;
  - parent holding above;
  - reentry;
  - failure;
  - no local break;
  - future confirmation / semantic conflict / coordinate mutation blockers.
- Negative availableAir is retained as a signed geometric value; it is not clipped and has no automatic bullish/bearish meaning.
- Cross-lane definition ownership is frozen in:
  research/PATTERN_RG2_CROSS_LANE_OWNERSHIP_V0_1.md
- Canonical ownership:
  Corporate Actions = continuity semantics;
  Pattern = structural boundaries/zones/lifecycle;
  Technical Indicator shared contract = multi-timeframe overlap taxonomy;
  D02 = price-volume acceptance/persistence;
  Round-price control = tick-aware proximity confound;
  Microstructure = auction/VI/order-book mechanics;
  Target-RR = target construction/RR semantics.
- Pattern must not fork any of those definitions.
- D01 remains 51.7%. Outcome joins remain closed. Formal Core LOCKED.

### Updated exact next continuation point after DL-010

1. Obtain reproducible execution receipts for DL-008 16-case and RG2 12-case research tests; until then both remain TEST_EXECUTION_PENDING.
2. Audit RG2 local/parent fields against existing Pattern observer persistence schema to identify missing prospective fields without wiring runtime.
3. Freeze equal-horizon / calendar-boundary placebo objects for future PATTERN-RG2 inference.
4. Preserve cross-lane canonical ownership; do not duplicate D02 acceptance, Target-RR target selection, Microstructure execution or Corporate Actions continuity logic.
5. Prospective outcome join remains blocked until COMPLETE Pattern parent/run coverage and runtime semantic readiness.
6. No R09 / no hard resistance veto / no Formal change.

## Continuation update — DL-011A through DL-011E (2026-10-02)

- Pattern observer persistence v0.1 was audited against the newer shared immutable-parent architecture.
- New artifacts:
  - research/PATTERN_SHARED_PARENT_SCHEMA_GAP_V0_1.md
  - research/pattern_shared_parent_schema_gap_v0_1.json
- Key finding: the older Pattern contract is still valid for isolated legacy QA, but its inference-authoritative parent assumption is superseded for promotion-grade work.
- Legacy parentage:
  scan_date + symbol + parent_snapshot_hash against the bounded/mutable Shadow archive.
- Future promotion-grade parentage must inherit:
  parentDecisionReceiptId + captureGeneration + parentScopeId + semanticFingerprint + decisionCutoffAt,
  with certified parentKeysetHash / decisionSetHash at run level.
- Pattern is explicitly a multi-object observer:
  every expected parent requires exactly one ROOT attempt row,
  followed by zero/many deterministic episode child rows.
- Episode row count is never the coverage denominator.
- DL-008 multi-scale fields and DL-009/010 RG2 fields are now enumerated as required future prospective payload/provenance fields.
- Generic timing must separate as_of / available_at / captured_at / created_at.
- Next-session 15m information and later weekly confirmations cannot backfill the prior after-market parent.
- Promotion-grade Pattern inference is killed if only legacy mutable Shadow linkage exists, capture generation is uncertified, ROOT keyset is incomplete, scale/zone provenance is missing, or current-code reconstruction substitutes for decision-time capture.
- No D1 schema, Worker, schedule or runtime persistence change is authorized.
- PATTERN_SHARED_PARENT_SCHEMA = DESIGN_RECONCILED / RUNTIME_NOT_IMPLEMENTED.
- D01 remains 51.7%; Pattern alpha UNKNOWN; Formal Core LOCKED.

### Updated exact next continuation point after DL-011

1. Freeze the machine-readable Pattern shared-parent child contract and deterministic ROOT/episode/relation item-key rules.
2. Audit Pattern payload-hash identity so DL-008/DL-009 fields cannot mutate under one item identity.
3. Freeze equal-horizon / bar-boundary placebo identity before outcomes.
4. Keep Pattern outcome joins closed until immutable parent runtime + COMPLETE ROOT keysets + semantic runtime readiness exist.
5. No Class-B runtime approval request yet; no R09 / no Formal change.

## Continuation update — DL-012A through DL-012D (2026-10-02)

- Pattern shared-child identity is now frozen at design level:
  - research/pattern_shared_child_contract_v0_1.json
  - research/pattern_shared_child_identity_v0_1.mjs
  - research/test_pattern_shared_child_identity_v0_1.mjs
- Generic Pattern child identity inherits:
  parentDecisionReceiptId + captureGeneration + parentScopeId + evidence_family=PATTERN + evidence_item_key + observer_version + as_of.
- ROOT is a fixed parent-attempt item key and remains the coverage authority.
- Structural episode identity is separated from lifecycle state:
  symbol + semantic space + detector family version + latent family + scale + ordered confirmed anchors + initial confirmedAt.
- Named-label changes or lifecycle progress under the same structural anchors do not create a new episode.
- RG2 relation identity is separated from relation state:
  symbol + semantic space + RG2 relation-definition version + local boundary id/version + parent zone id/version.
- availableAir, geometry relation and lifecycle state do not create a new RG2 relation identity.
- Same identity with changed immutable anchor/boundary coordinates must become PROVENANCE_CONFLICT rather than silently generating a new ID.
- Outcome fields are prohibited from decision-time child identity/payload validation.
- 12 shared-child identity adversarial tests are authored but NOT executed in a reproducible Node environment in this chat. Status remains TEST_EXECUTION_PENDING.
- No persistence/runtime change. D01 remains 51.7%. Formal Core LOCKED.

### Updated exact next continuation point after DL-012

1. Freeze equal-horizon / bar-boundary placebo identity and causal timing before any multi-scale outcome work.
2. Audit whether Pattern child payload fingerprint must bind all DL-008 multi-scale and RG2 immutable geometry fields; keep mutable lifecycle state append-only/snapshot-versioned without mutating prior rows.
3. Obtain reproducible execution receipts for DL-008 (16 cases), RG2 relation (12 cases) and shared-child identity (12 cases).
4. Keep outcome joins and Class-B runtime approval closed.
5. No R09 / no Formal change.

## Continuation update — DL-013A through DL-013D (2026-10-02)

- Equal-horizon and aggregation-boundary falsification is now frozen before outcomes:
  - research/PATTERN_EQUAL_HORIZON_BOUNDARY_CONTROL_V0_1.md
  - research/pattern_equal_horizon_boundary_control_v0_1.json
- Terminology correction:
  "bar-boundary placebo" as a guaranteed null is rejected.
  The correct role is BOUNDARY_SENSITIVITY_CONTROL because shifted aggregation can have different information age/session composition and may contain real structure.
- Two confounds are separated:
  effective-horizon difference vs aggregation-boundary difference.
- Primary future test remains B0 daily long-horizon controls vs B1 B0 + canonical completed-calendar-week Pattern relation on common support/equal dates.
- Frozen comparators:
  DAILY_EQUIVALENT_CLOCK_HORIZON and SIMPLE_LONG_HORIZON_PRICE_GEOMETRY.
- Boundary sensitivity variant:
  SHIFTED_5_ELIGIBLE_SESSION_BLOCK_V0_1,
  preregistered before outcomes, fully causal, no future block completion.
- Comparability can explicitly be NOT_COMPARABLE_FEATURE_AGE or NOT_COMPARABLE_SESSION_COVERAGE; dates are never force-paired.
- Timeframe/boundary variants remain inside one multiple-testing family.
- Pattern shared-child contract v0.2 now adds featureAgeEligibleSessions and aggregationBoundaryVersion plus DL-008/RG2 provenance.
- No outcome join / no timeframe search / no score. D01 remains 51.7%. Formal Core LOCKED.

### Updated exact next continuation point after DL-013

1. Audit immutable Pattern payload fingerprint coverage for all v0.2 provenance/geometry fields.
2. Obtain reproducible execution receipts for authored DL-008/RG2/shared-child tests; do not infer PASS from V8 regression CI.
3. Re-read latest main before any merge because parallel research rooms may advance it.
4. Keep runtime/Class-B proposal closed until parent/continuity/session/storage gates clear.
5. No R09 / no Formal change.

## Continuation update — DL-014A through DL-014D (2026-10-02)

- Pattern fingerprint semantics are now split into immutable structural identity vs evolving as-of observation:
  - research/PATTERN_FINGERPRINT_CONTRACT_V0_1.md
  - research/pattern_fingerprint_contract_v0_1.json
- structuralIdentityFingerprint binds immutable anchors/boundaries/versions and excludes lifecycle/outcomes.
- observationPayloadHash binds one exact parent/as-of Pattern observation, including current lifecycle, multi-scale provenance, RG2 geometry and consumed cross-lane receipt references.
- Same item key + changed structuralIdentityFingerprint = PROVENANCE_CONFLICT.
- Same generic child identity + changed observationPayloadHash = PROVENANCE_CONFLICT.
- Same structural episode key across a later immutable parent/as-of may legitimately carry a different observationPayloadHash; that is longitudinal evolution, not mutation.
- ROOT must commit to the sorted episode-item keyset for that parent so missing/duplicate/foreign episode rows can be audited independently from parent coverage.
- Pattern shared-child contract v0.3 incorporates these fingerprint rules.
- Outcomes and later source revisions are prohibited from decision-time fingerprints.
- No runtime wiring. D01 remains 51.7%; Formal Core LOCKED.

### Updated exact next continuation point after DL-014

1. Recheck latest PR CI and current main divergence.
2. If production regression/repair CI passes, treat it only as Formal-isolation evidence; DL-008/RG2/child tests remain TEST_EXECUTION_PENDING without a dedicated Node receipt.
3. Preserve all new contracts on a clean latest-main lineage before any merge.
4. Next scientific research after engineering closure: preregister RG2 cross-parent episode clustering and future B0-vs-B1 estimands; do not inspect outcomes yet.
5. No R09 / no Formal change.

## Continuation update — DL-015A through DL-016D (2026-10-03)

- PATTERN-RG2 cross-parent clustering and future B0-vs-B1 estimand are now preregistered before any outcome join:
  - research/PATTERN_RG2_CLUSTERING_ESTIMAND_V0_1.md
  - research/pattern_rg2_clustering_estimand_v0_1.json
- Five identities are explicitly separated:
  parentDecisionReceiptId / scanDate / symbol / relationEpisodeKey / as-of observation.
- Important refinement versus the earlier loose "date + episode" wording:
  primary dependence must account for scanDate common shocks AND symbol persistence.
  relationEpisodeKey remains de-dup/longitudinal identity but is not a substitute for symbol-level dependence because one symbol can generate multiple episodes.
- Parent-outcome multiplicity firewall is frozen:
  zero relation = NO_RG2_RELATION;
  one relation = SINGLE_RELATION_ELIGIBLE;
  >1 non-equivalent relations = MULTI_RELATION_AMBIGUOUS;
  duplicate key = QA_FAIL;
  same key/different structural fingerprint = PROVENANCE_CONFLICT.
- Primary outcome inference never chooses "best/nearest/strongest" RG2 relation after outcomes. MULTI_RELATION_AMBIGUOUS remains coverage evidence and is excluded from the first single-relation estimand.
- New outcome-blind helper/tests:
  - research/pattern_rg2_sample_unit_v0_1.mjs
  - research/test_pattern_rg2_sample_unit_v0_1.mjs
- 14 sample-unit adversarial cases are authored but not executed in a reproducible Node run; do NOT claim 14/14 PASS.
- Existing global maturity gates remain authoritative; D01 does not invent a second sample threshold.
- B0_PRICE_STRUCTURE is diagnostic only.
- B0_FULL_CONTEXT is the promotion-grade baseline: price/structure controls plus D02 acceptance/persistence, market/sector regime, liquidity and round-price proximity.
- First frozen challenger:
  RG2_CORE_V0_1 = availableAirToParentLowerPct + geometryRelationState + compoundLifecycleState + parentZoneAgeEligibleSessions.
- Co-primary future endpoints are D5 MFE and D5 MAE. D5 return and D10/lifecycle outcomes remain secondary.
- Primary estimand target is equal-scanDate weighted common-support B0-vs-B1 predictive-loss differential. Raw pooled rows do not define the effect.
- Forward OOS rules are frozen:
  chronological scanDate split, PURGED_FORWARD_HOLDOUT, training-only transforms, no random row split.
- New robustness guards:
  EPISODE_FIRST_SENSITIVITY;
  EPISODE_HOLDOUT_SENSITIVITY;
  NON_OVERLAPPING_DATE_SENSITIVITY.
- If forward OOS works but episode-holdout collapses => EPISODE_MEMORIZATION_RISK.
- If repeated snapshots drive the effect => LONGITUDINAL_REPEAT_DEPENDENCE.
- If overlapping D5/D10 windows drive the effect => OUTCOME_WINDOW_DEPENDENCE.
- Exact finite-sample statistical inference is explicitly routed to D16, not reinvented in D01:
  - research/PATTERN_RG2_D16_VALIDATION_HANDOFF_V0_1.md
  - research/pattern_rg2_d16_validation_handoff_v0_1.json
- D16 must preregister estimator/loss/nested-model comparison/date+symbol dependence/small-cluster handling before outcomes.
- Schema audit found two canonicalization defects:
  1. relation helper v0.1 emitted geometryState/compoundState while shared-child expected geometryRelationState/compoundLifecycleState;
  2. shared-child v0.3 omitted parentZoneAgeEligibleSessions and explicit immutable RG2 coordinates despite the RG2/fingerprint contracts requiring them.
- Research-only repairs:
  - research/pattern_rg2_relation_v0_2.mjs
  - research/test_pattern_rg2_relation_v0_2.mjs
  - research/pattern_shared_child_contract_v0_4.json
  - research/PATTERN_RG2_FEATURE_OBSERVABILITY_AUDIT_V0_1.md
- v0.4 canonical RG2 payload now explicitly preserves local/parent coordinates, source window, zone age, canonical relation/lifecycle names and liquidity receipt reference.
- Legacy aliases geometryState / compoundState / availableAirPct are not promotion-grade canonical names.
- RG2_CORE_V0_1 status:
  DESIGN_OBSERVABLE / PROSPECTIVE_RUNTIME_BLOCKED.
- No outcomes inspected; no Pattern runtime wiring; no R09.
- D01 remains 51.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-016

1. Recheck latest main for branch divergence and run Class-A PR Formal-isolation CI.
2. Preserve research-specific test status as TEST_EXECUTION_PENDING; V8 Repair/Regression success does not imply the new 14+10 research tests executed.
3. Next D01 scientific continuation: freeze RG2 state-transition episode semantics for first-entry / first-parent-break / first-hold / first-reentry / first-failure without using outcomes, so lifecycle-event analysis cannot duplicate one state across many dates.
4. Hand D16 the exact preregistration packet; D16 owns the statistical method and must not redefine D01 Pattern semantics.
5. Keep outcome join CLOSED until immutable parent runtime + Pattern ROOT completeness + continuity/session provenance + canonical cross-lane receipts are prospectively available.
6. No Class-B runtime wiring request yet; no R09 / no Formal change.

## Continuation update — DL-017A through DL-017F (2026-10-03)

- RG2 current-state snapshots are now explicitly separated from first-transition event identity.
- New research-only artifacts:
  - research/PATTERN_RG2_TRANSITION_EVENT_CONTRACT_V0_1.md
  - research/pattern_rg2_transition_event_v0_1.json
  - research/pattern_rg2_transition_event_v0_1.mjs
  - research/test_pattern_rg2_transition_event_v0_1.mjs
  - research/pattern_shared_child_contract_v0_5.json
- A state persisting across many scan dates does not create many first-transition events.
- Three clocks are separated:
  eventOccurredAt / eventAvailableAt / firstObservedAt.
  Storage createdAt, if ever implemented, is a fourth operational clock.
- First-transition taxonomy freezes local break, first parent-zone entry close, parent break, first post-break outside close, reentry, failure, reclaim and constrained-break ordinary-observability.
- FIRST_POST_BREAK_OUTSIDE_CLOSE is descriptive persistence only; it is NOT an N-bar acceptance threshold or directional signal.
- Transition event identity excludes eventOccurredAt so a changed first clock under the same event key becomes PROVENANCE_CONFLICT rather than a new event.
- PARENT_FAILURE is a severe subtype of PARENT_REENTRY. If both happen on the same close, they retain two semantic labels but share one sourceEventGroupKey and never count as independent confirmations.
- Same-day local break and parent break can likewise share one source event group.
- Reclaim does not erase first reentry/failure clocks.
- Price-limit-constrained break preserves structural break timing while ordinary interpretation waits for the first eligible unconstrained observability point.
- Critical future-leak firewall:
  a transition occurring after an earlier parent decision may become a later structural outcome, but it is never written back into the earlier decision-time Pattern child.
- Current RG2 v0.2 state alone cannot reconstruct certified first clocks. Transition analysis therefore remains DESIGN_READY / PROSPECTIVE_CLOCK_CAPTURE_BLOCKED.
- Shared-child v0.5 now preregisters lifecycle clock provenance but remains design-only / runtime NO_GO.
- 15 transition-event adversarial tests are authored; without a reproducible Node execution receipt they remain TEST_EXECUTION_PENDING.
- No outcomes inspected; no repeated-cycle experiment; no R09; no Formal change.
- D01 remains 51.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-017

1. Reuse or extend one canonical Pattern lifecycle clock-bundle producer; do not reconstruct clocks separately inside RG2.
2. Reconcile DL-017 onto latest main using the same single-tree commit method before PR.
3. Formal-isolation CI does not execute the 15 new transition-event tests.
4. Hand D16 the event/source-group identity rules before any structural-event outcome study.
5. Keep prospective clock capture/runtime wiring blocked until shared immutable parent, continuity/session and storage prerequisites clear.
6. No N-bar acceptance threshold / no outcome join / no R09 / no Formal change.

## Continuation update — DL-018A through DL-018E (2026-10-03)

- DL-017 first-transition clocks now have one canonical consumer/adapter design rather than a second RG2 breakout engine.
- New research-only artifacts:
  - research/PATTERN_RG2_LIFECYCLE_CLOCK_BUNDLE_V0_1.md
  - research/pattern_rg2_lifecycle_clock_bundle_v0_1.json
  - research/pattern_rg2_lifecycle_clock_bundle_v0_1.mjs
  - research/test_pattern_rg2_lifecycle_clock_bundle_v0_1.mjs
  - research/pattern_shared_child_contract_v0_6.json
- The adapter reuses research/pattern_breakout_lifecycle_v0_1.mjs for parent break/reentry/failure/reclaim chronology.
- RG2 owns only relation-specific firstParentZoneEntryAt and first post-break outside-close mapping.
- Exact "first" certification requires exact eligible-session DATE SET completeness, not only matching counts.
- New consumer requirement:
  expectedEligibleSessionDateSetHash == continuityBarDateSetHash,
  no duplicate dates,
  unresolvedMissingSessions == 0.
- Existing shared continuity handoff already requires exact eligible date-set equality semantically, but its machine-readable v0.1 does not expose the two explicit date-set commitment fields.
- Therefore upstream status is:
  SEMANTICS_COMPATIBLE / PROMOTION_GRADE_DATE_SET_RECEIPT_EXTENSION_REQUIRED.
- D01 does not modify or fork the Corporate Actions/session owner.
- Close-based firstParentZoneEntryAt is not invented from intrabar crossing. A direct gap/jump from below to above the full parent zone can legitimately have no close-entry event before parent break.
- parentFirstPostBreakOutsideCloseAt is first later unconstrained outside close before any reentry/failure; it is persistence, not acceptance and not an N-bar threshold.
- Prefix invariance remains mandatory.
- Isolated helper computes SHA-256 date-set hashes only for synthetic research QA; production upstream hash domain/version is NOT frozen by D01.
- 15 clock-bundle adversarial cases are authored but remain TEST_EXECUTION_PENDING without a reproducible Node receipt.
- Clock bundle status:
  RESEARCH_EXECUTABLE_DESIGN / UPSTREAM_RECEIPT_EXTENSION_REQUIRED / RUNTIME_NO_GO.
- No outcomes, no R09, no Formal change.
- D01 remains 51.7%; Pattern alpha UNKNOWN; FORMAL_OPTIMIZATION_CANDIDATE=NONE; Formal Core LOCKED.

### Updated exact next continuation point after DL-018

1. Hand expected/continuity date-set commitment requirement to the canonical continuity/session owner; D01 must not implement that upstream runtime.
2. Hand the clock-bundle identity and transition source-group rules to D16 for future event-study validation.
3. Preserve all clock-bundle research tests as TEST_EXECUTION_PENDING unless independently executed.
4. Keep Pattern prospective clock/runtime persistence blocked until immutable parent + Pattern ROOT + continuity/session exact-set receipts exist.
5. Next D01 science: study whether transition-state representation itself is redundant with continuous distance/path descriptors before adding any categorical lifecycle challenger.
6. No outcome join / no N-bar acceptance / no R09 / no Formal change.

## Continuation update — DL-019A through DL-019F (2026-10-03)

- D01 studied whether RG2 / Pattern lifecycle categories add information beyond continuous distance/path descriptors before any outcome join.
- New research-only artifacts:
  - research/PATTERN_LIFECYCLE_REDUNDANCY_V0_1.md
  - research/pattern_lifecycle_redundancy_v0_1.json
  - research/pattern_lifecycle_redundancy_v0_1.mjs
  - research/test_pattern_lifecycle_redundancy_v0_1.mjs
  - research/PATTERN_LIFECYCLE_REDUNDANCY_D16_HANDOFF_V0_1.md
- Core distinction:
  current geometry alone is NOT enough to reconstruct path-dependent lifecycle;
  complete causal path + first-event clocks can make the categorical lifecycle a deterministic / thresholded summary.
- Frozen redundancy ladder:
  C0_GEOMETRY_ONLY
  -> C1_CONTINUOUS_PATH
  -> C2_CLOCK_COMPLETE_PATH
  -> C3_CATEGORICAL_LIFECYCLE.
- Promotion-grade lifecycle incrementality must be evaluated as C3 vs FLEXIBLE(C2), not merely C3 vs C0 and not merely C3 vs a weak linear C2.
- Same current geometry with different break/reentry/reclaim history is a valid path-memory counterexample.
- Same complete C2 path basis with different lifecycle labels is a SEMANTIC_CONTRADICTION, not independent evidence.
- Lifecycle source novelty is frozen as NONE because category states derive from the same PRICE_OHLC / continuity root.
- Lifecycle may retain explanation / audit / event-indexing value even if predictive incrementality is zero.
- D16 handoff requires:
  common-support same-parent comparison,
  equal scan-date weighting,
  scanDate + symbol dependence handling,
  chronological OOS / purged holdout,
  episode-first / episode-holdout / non-overlapping-date sensitivities,
  and at least one flexible continuous C2 comparator.
- External support/counterevidence:
  2026 Finance and Stochastics formalizes support/resistance as path-dependent regime switching, supporting path-memory relative to current distance;
  statistical guidance on continuous predictors warns that categorization loses information and can create arbitrary step functions, so lifecycle categories cannot replace continuous descriptors by default.
- 12 lifecycle redundancy adversarial tests are authored but remain TEST_EXECUTION_PENDING without an independent Node receipt.
- No outcomes inspected; no N-bar threshold; no R09; no runtime wiring.
- D01 remains 51.7%; Pattern alpha UNKNOWN; FORMAL_OPTIMIZATION_CANDIDATE=NONE; Formal Core LOCKED.

### Updated exact next continuation point after DL-019

1. Audit C2 internal redundancy so the complete-path comparator itself does not become a factor zoo.
2. Freeze a minimal continuous path basis using semantics / algebra / deterministic dependency only, not outcomes.
3. Preserve clock/path fields needed for causal reconstruction even if they are excluded from a minimal predictive basis.
4. Hand the minimal-basis contract to D16 so C3 is compared against both full-C2 and minimal-flexible-C2 sensitivity.
5. Preserve TEST_EXECUTION_PENDING for DL-019 tests unless independently executed.
6. No outcome join / no R09 / no Formal change.

## Continuation update — DL-020A through DL-020E (2026-10-03)

- D01 audited internal redundancy inside the full continuous C2 path basis so the comparator itself does not become a Factor Zoo.
- New research-only artifacts:
  - research/PATTERN_MINIMAL_CONTINUOUS_BASIS_V0_1.md
  - research/pattern_minimal_continuous_basis_v0_1.json
  - research/pattern_minimal_continuous_basis_v0_1.mjs
  - research/test_pattern_minimal_continuous_basis_v0_1.mjs
- Frozen semantic basis:
  PB1 immutable boundary geometry;
  PB2 path excursion / occupancy;
  PB3 observability / exposure;
  PB4 first-event clocks;
  PB5 structural identity / episode age;
  PB6 derived lifecycle representation.
- Exact/nested dependencies frozen outcome-blind:
  eligibleBars = observableBars + constrainedBars under complete accounting;
  parentCenter = midpoint(parentLower,parentUpper) under midpoint semantics;
  availableAirPct / centerDistancePct / availableAirATR share the same structural geometry numerator/reference family;
  geometryRelationState is deterministic from local/parent coordinates;
  barsToReentry/failure/reclaim are derived from certified session ordinals + first clocks;
  failure is nested inside reentry semantics;
  compoundLifecycleState is derived when complete clocks + current location are available.
- Multiple normalization units of one numerator are scaling alternatives / interactions, not multiple source votes.
- New future dual sensitivity:
  FULL_C2 versus MINIMAL_C2 (MCPB_V0_1).
- C3 lifecycle category must be evaluated against both flexible FULL_C2 and flexible MINIMAL_C2.
- Causal audit fields are NOT deleted from prospective storage merely because they are excluded from a predictive minimal basis.
- 12 minimal-basis adversarial tests are authored; TEST_EXECUTION_PENDING until independently executed.
- No outcomes inspected; no runtime wiring; no R09.
- D01 remains 51.7%; Pattern alpha UNKNOWN; FORMAL_OPTIMIZATION_CANDIDATE=NONE; Formal Core LOCKED.

### Updated exact next continuation point after DL-020

1. Reconcile DL-019/020 against latest main and verify no concurrent-room divergence.
2. Open one Class-A PR containing only D01 research/docs/helpers/tests.
3. Treat V8 Repair/Regression CI as Formal-isolation evidence only; the new D01 Node tests remain pending unless explicitly executed.
4. Next D01 science after merge: study whether first-event clocks themselves add representation value beyond path excursion/occupancy and current geometry, without converting clocks into arbitrary N-bar buckets.
5. Preserve full audit clocks even if predictive minimal basis later excludes some derived durations.
6. No outcome join / no R09 / no Formal change.

## Continuation update — DL-021A through DL-021E (2026-10-03)

- First-event clocks are now split into decision-time predictor state versus future time-to-event outcome semantics.
- New research-only artifacts:
  - research/PATTERN_FIRST_EVENT_CLOCK_PIT_V0_1.md
  - research/pattern_first_event_clock_pit_v0_1.json
  - research/pattern_first_event_clock_pit_v0_1.mjs
  - research/test_pattern_first_event_clock_pit_v0_1.mjs
  - research/PATTERN_FIRST_EVENT_CLOCK_D16_HANDOFF_V0_1.md
- Predictor-side rule:
  only event clocks occurred/available/first-observed by asOf are legal.
- Not-yet-occurred event:
  occurred=0 / firstOccurredAt=null / ageEligibleSessions=null / NOT_YET_OCCURRED_THROUGH_ASOF.
- Age 0 means the event occurred on the current eligible session; it is NOT equivalent to null/censored.
- UNKNOWN provenance is distinct from genuine not-yet-occurred censoring.
- Future first-event date, future time-to-event and future failure/reentry/reclaim distance are prohibited from decision-time payloads.
- First-event timing can contain path-order memory beyond aggregate excursion descriptors even when current distance/max excursion/cumulative distance match.
- Failure remains nested inside reentry:
  same-bar failure+reentry share one sourceEventGroupKey and never count as two confirmations.
- Continuous eligible-session event age is primary; arbitrary fast/slow or N-bar duration buckets are rejected by default.
- Future event time may later be analyzed as a right-censored outcome under D16/statistical ownership, but it can never be written back into the earlier Pattern child.
- 12 first-event PIT/censoring adversarial tests are authored; TEST_EXECUTION_PENDING until independently executed.
- No outcomes inspected; no runtime wiring; no R09.
- D01 remains 51.7%; Pattern alpha UNKNOWN; FORMAL_OPTIMIZATION_CANDIDATE=NONE; Formal Core LOCKED.

### Updated exact next continuation point after DL-021

1. Finish PR reconciliation/CI for DL-019 through DL-021 against latest main.
2. Treat Formal-isolation CI separately from research-specific Node execution receipts.
3. After merge, next D01 science may study whether event-order information beyond first clocks adds value or is reconstructible from the ordered clock bundle; do not expand categories first.
4. Keep not-yet-occurred / UNKNOWN / occurred-age-zero semantics distinct in all future schema work.
5. No outcome join / no N-bar optimization / no R09 / no Formal change.

## Continuation update — DL-022 through DL-027 (2026-10-03)

### DL-022 — First-event order redundancy
- First-event order is frozen as a deterministic derived view of certified first-event clocks + sourceEventGroupKey.
- Same-source labels on one close are one source group, not sequential confirmations.
- Distinct source groups sharing one daily date form a tied partial-order block; daily OHLC cannot invent intraday sub-order.
- An order label without certified clocks/session completeness is audit-only, not promotion-grade.
- Repeated cycles beyond first events are explicitly outside DL-022.
- New files:
  - research/PATTERN_FIRST_EVENT_ORDER_REDUNDANCY_V0_1.md
  - research/pattern_first_event_order_redundancy_v0_1.json
  - research/pattern_first_event_order_redundancy_v0_1.mjs
  - research/test_pattern_first_event_order_redundancy_v0_1.mjs
- 12 tests authored; TEST_EXECUTION_PENDING.

### DL-023 — Repeated-cycle path memory / exposure
- Repeated reentry/reclaim cycles add longitudinal path memory beyond first-event clocks by construction, but no new PRICE_OHLC source information.
- Raw event count does not increase independent N.
- Repeated-cycle risk starts only after first reclaim; before then state is NOT_YET_AT_RISK, not zero events.
- Counts require observable/constrained eligible-session exposure; raw count/rate alone is not alpha evidence.
- Failure remains nested severity inside RETURN_GROUP.
- Open repeated cycle at asOf is right-censored/open, not completed.
- New files:
  - research/PATTERN_REPEATED_CYCLE_V0_1.md
  - research/pattern_repeated_cycle_v0_1.json
  - research/pattern_repeated_cycle_v0_1.mjs
  - research/test_pattern_repeated_cycle_v0_1.mjs
  - research/PATTERN_REPEATED_CYCLE_D16_HANDOFF_V0_1.md
- 12 tests authored; TEST_EXECUTION_PENDING.

### DL-024 — Repeated-sequence decomposition
- Coarse RETURN -> RECLAIM alternation is largely deterministic from the frozen state machine / cycle count.
- Residual sequence novelty is narrowed to failure severity placement/timing:
  FAILURE_ON_RETURN_GROUP vs FAILURE_AFTER_REENTRY and escalation lag.
- Full recurrent source-group ledger remains audit/replay authority, not a default factor family.
- No named "double fakeout/triple rejection/churn" sequence catalogue.
- New files:
  - research/PATTERN_REPEATED_SEQUENCE_DECOMPOSITION_V0_1.md
  - research/pattern_repeated_sequence_v0_1.mjs
  - research/test_pattern_repeated_sequence_v0_1.mjs
- 10 tests authored; TEST_EXECUTION_PENDING.

### DL-025 — Dynamic landmark / immortal-time firewall
- Repeated-cycle state is a time-varying predictor.
- Eventual future repeated cycles may never be written back into the original breakout parent.
- BASELINE_BREAK_COHORT and REPEAT_RISK_LANDMARK_COHORT are different estimand populations.
- NOT_YET_AT_REPEAT_RISK != AT_RISK_ZERO_EVENTS.
- Future outcomes for repeat-risk predictor analysis must start after the current later immutable parent cutoff.
- Conditioning on first reclaim must be explicit; findings cannot be generalized automatically to all original breakouts.
- New files:
  - research/PATTERN_REPEATED_CYCLE_LANDMARK_V0_1.md
  - research/pattern_repeated_cycle_landmark_v0_1.json
  - research/pattern_repeated_cycle_landmark_v0_1.mjs
  - research/test_pattern_repeated_cycle_landmark_v0_1.mjs
  - research/PATTERN_REPEATED_CYCLE_LANDMARK_D16_HANDOFF_V0_1.md
- 10 tests authored; TEST_EXECUTION_PENDING.

### DL-026 — Crossing-opportunity confound firewall
- cycleCount / observableSessions is still not fully opportunity-adjusted.
- Required controls include volatility/ATR, zone width, distance path, relative tick/tick rule, liquidity, constrained-session share, D02 acceptance/persistence and market/sector regime.
- Raw recurrence can proxy high volatility / narrow zones / price-grid / liquidity mechanics rather than structural memory.
- No new opportunity score is defined.
- Q0-Q4 falsification ladder frozen from raw count through full cross-lane controls.
- New files:
  - research/PATTERN_REPEATED_CYCLE_CONFOUND_FIREWALL_V0_1.md
  - research/pattern_repeated_cycle_confound_v0_1.json
  - research/pattern_repeated_cycle_confound_v0_1.mjs
  - research/test_pattern_repeated_cycle_confound_v0_1.mjs
- 6 tests authored; TEST_EXECUTION_PENDING.

### DL-027 — Structural-zone mechanism negative controls
- A parent-specific non-anchor pseudo-zone pool is frozen as MECHANISM_NEGATIVE_CONTROL, not a guaranteed-null placebo.
- Pseudo-zones use the same symbol/date/width and only pre-confirmation eligible continuity-safe closes.
- Controls overlapping the true parent or any structural zone already known by parent confirmation are excluded.
- Future-discovered structures cannot retroactively clean the pool.
- All eligible controls are retained; no post-outcome "best pseudo-zone" selection.
- True ~= pseudo after full opportunity controls weakens structural-memory mechanism.
- True > pseudo is only a structural-specific representation candidate, not alpha proof.
- New files:
  - research/PATTERN_NEGATIVE_CONTROL_BOUNDARY_V0_1.md
  - research/pattern_negative_control_boundary_v0_1.json
  - research/pattern_negative_control_boundary_v0_1.mjs
  - research/test_pattern_negative_control_boundary_v0_1.mjs
- 8 tests authored; TEST_EXECUTION_PENDING.

### Governance after DL-027
- No outcomes inspected.
- No historical Pattern Shadow fabrication.
- No N-bar acceptance rule.
- No new R09.
- No runtime/Worker/D1 wiring.
- D01 remains 51.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-027

1. Reconcile this branch against latest main; parallel rooms are active.
2. Open one Class-A PR containing D01 research/docs/helpers/tests only.
3. Treat Repair/Regression CI as Formal-isolation evidence only; all DL-022..027 research tests remain TEST_EXECUTION_PENDING unless separately executed.
4. Next D01 science after merge: separate detector-selection salience from true structural-memory mechanism if confirmed zones outperform non-anchor controls.
5. Preserve pseudo-zone manifests and failed controls; no outcome-based pruning.
6. No outcome join / no Formal change.


## Continuation update — DL-028 (2026-10-04)

### D01 progress denominator reconciliation
- Current curriculum authority is `shared-knowledge/LEARNING_ROOM_ROUTER.md` plus `shared-knowledge/STOCK_MARKET_KNOWLEDGE_LEARNING_MAP.md`.
- Current D01 curriculum has 11 active modules and reports 52.7%.
- The older 51.7% label in this checkpoint used the prior 12-module denominator, where D01-12 remained a separate L2 / 40% module.
- After D01-12 was merged into D01-02 / D01-03 / D01-05 / D01-09, the active-module maturity sum is 580 percentage-points across 11 modules: 580 / 11 = 52.7%.
- The old denominator was 620 / 12 = 51.7%.
- Therefore 51.7% -> 52.7% is a curriculum-denominator reconciliation, NOT a new module maturity promotion.
- Historical 51.7% entries above are retained as contemporaneous records; current authoritative D01 maturity is 52.7%.

### DL-028 — Detector-selection salience vs structural-memory firewall
- DL-027 non-anchor pseudo-zones control generic horizontal-level crossing, but true-zone superiority over random/non-anchor levels would still not identify structural memory.
- DL-028 freezes a three-layer mechanism ladder:
  - M0 = NON_ANCHOR_HORIZONTAL_CONTROL from DL-027;
  - M1 = DETECTOR_SALIENCE_CONTROL: same symbol / semantic space / detector version, already-created but UNCONFIRMED_ACTIVE candidate at the true-zone confirmation landmark;
  - M2 = CONFIRMED_STRUCTURAL_ZONE.
- The key falsification is M2 vs M1 after DL-026 opportunity controls. If M2 beats M0 but not M1, detector-selection salience is sufficient and the structural-memory interpretation weakens.
- M1 membership is frozen strictly as-of the true-zone confirmation landmark. A candidate that confirms later remains an eligible M1 control if it was genuinely unconfirmed at the landmark; future state may not retroactively alter the risk set.
- No scalar salience score is created. Pre-landmark anchor prominence, excursion, volume/range, round/tick proximity, candidate age, exposure/opportunity, volatility, liquidity, D02 context and regime are stored as covariates for later D16 inference.
- D01 does not choose matching/weighting/calipers after outcomes. All eligible controls are retained in an immutable manifest; D16 owns future preregistered inference.
- Candidates overlapping the true zone, known duplicate relation, wrong detector version/semantic space/symbol, future-created state or incomplete provenance are fail-closed.
- External evidence is mechanism-compatible but non-identifying: support/resistance interruption predictability can coexist with order clustering, round-number effects, local-extrema selection and path dependence. Therefore none is treated as direct proof of D01 alpha.
- New files:
  - research/PATTERN_DETECTOR_SALIENCE_MEMORY_FIREWALL_V0_1.md
  - research/pattern_detector_salience_memory_v0_1.json
  - research/pattern_detector_salience_memory_v0_1.mjs
  - research/test_pattern_detector_salience_memory_v0_1.mjs
- 10 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcomes inspected; no historical Pattern Shadow fabrication; no runtime/Worker/D1 wiring; no new R09.
- Current D01 maturity = 52.7% under the 11-module curriculum denominator.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-028

1. Keep this tranche Class-A research-only and reconcile it against then-latest main before merge because parallel rooms are active.
2. Execute DL-022..DL-028 research Node tests independently when an approved research-test execution path is available; V8 Repair/Regression alone is only Formal-isolation evidence.
3. Preserve all M1 eligible/excluded candidates and manifest hashes; no post-outcome pruning or hand-picked matching.
4. Hand the frozen M0/M1/M2 comparison and pre-landmark covariates to D16 for future preregistered matching/weighting/inference.
5. Next D01 science: test whether any confirmation-specific representation survives boundary-identity perturbation and detector-version perturbation without outcome tuning.
6. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-029 (2026-10-04)

### DL-029 — Boundary identity and detector-version perturbation robustness
- DL-028 separated generic horizontal-level effects (M0), detector-selection salience (M1) and confirmed structural zones (M2).
- DL-029 adds a new firewall before any future M2 interpretation: a representation that exists only at one exact boundary or one exact detector build is definition-fragile.
- Frozen boundary perturbation family P1 uses only the as-of-date legal Taiwan price grid supplied by the canonical microstructure owner:
  - SHIFT_DOWN_ONE_GRID_STEP;
  - SHIFT_UP_ONE_GRID_STEP;
  - EXPAND_ONE_GRID_STEP;
  - CONTRACT_ONE_GRID_STEP.
- D01 does not own or hard-code the Taiwan tick table. Missing historical tick-rule provenance makes P1 DATA_BLOCKED rather than approximated.
- Frozen anchor perturbation family P2 is leave-one-anchor-out over every causal source anchor. Every variant is retained. Zone disappearance is I3_IDENTITY_DISAPPEARED falsification evidence, not a reason to drop the case.
- Frozen detector-version relations:
  - SEMANTIC_EQUIVALENT: must reproduce the same manifest; mismatch is SEMANTIC_REGRESSION.
  - PREDECLARED_VARIANT: allowed only if version/parameters were frozen before outcomes; it is a nested robustness challenger, not a new independent vote.
  - POST_OUTCOME_VERSION_PROHIBITED: cannot retroactively rescue a result.
- Structural identity classes are frozen before outcomes:
  I0 same identity/same anchors;
  I1 same identity/reduced anchors;
  I2 identity changed;
  I3 identity disappeared;
  I4 not evaluable.
- Perturbation variants are nested inside one immutable parent/relation episode. Variant count never increases independent N.
- No majority voting, best-variant selection, N-tick search, post-outcome detector rescue or arbitrary detector ensemble is allowed.
- Future D16 analysis must use common-support parents for cross-version outcome comparison and separately report identity coverage/disappearance.
- Robustness interpretation ladder:
  R0_EXACT_ONLY;
  R1_BOUNDARY_STABLE_DETECTOR_SPECIFIC;
  R2_VERSION_STABLE_IDENTITY_FRAGILE;
  R3_STRUCTURAL_ROBUSTNESS_CANDIDATE;
  R4_NOT_EVALUABLE.
- Even R3 remains research evidence only; it is not causal proof and not Formal alpha.
- External evidence strengthens the need for this design:
  systematic pattern recognition is needed to reduce subjective chart definitions;
  support/resistance can be generated by round-number/order clustering;
  Asian-market technical-rule conclusions are materially affected by data snooping and market frictions;
  modern path-dependent support/resistance theory itself notes the simplification of fixed boundaries versus real dynamic structure.
- New files:
  - research/PATTERN_BOUNDARY_DETECTOR_ROBUSTNESS_V0_1.md
  - research/pattern_boundary_detector_robustness_v0_1.json
  - research/pattern_boundary_detector_robustness_v0_1.mjs
  - research/test_pattern_boundary_detector_robustness_v0_1.mjs
  - research/PATTERN_BOUNDARY_DETECTOR_ROBUSTNESS_D16_HANDOFF_V0_1.md
- 12 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-029

1. Reconcile the DL-029 Class-A branch against then-latest main before PR because parallel rooms are active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-029 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve every legal-grid and leave-one-anchor-out variant, including invalid/disappeared cases; no outcome-based pruning.
4. Hand the parent-nested/common-support robustness matrix to D16 before any outcome join.
5. Next D01 science: distinguish true structural-object persistence from repeated rediscovery caused by overlapping rolling windows, detector refresh cadence and duplicate anchor lineages.
6. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-030 (2026-10-04)

### DL-030 — Structural-object persistence vs rolling-window rediscovery
- Repeated Pattern scans operate on overlapping rolling windows, so the same support/resistance or pattern structure can be emitted on many adjacent decision dates or multiple refreshes.
- DL-030 freezes four identity layers without replacing the existing Shadow parent identity:
  - STRUCTURAL_OBJECT_ROOT;
  - STRUCTURAL_OBJECT_VERSION;
  - STRUCTURAL_OBJECT_EPISODE;
  - OBSERVATION_SNAPSHOT.
- Existing daily Shadow parent identity remains (scan_date, symbol) plus immutable parent snapshot/hash. A structural object can be visible to multiple daily parents; these are repeated decision exposures, not automatically independent structural samples.
- Structural root identity includes symbol, semantic space, timeframe, detector family, structure family, orientation, firstConfirmedAt and ordered root anchor IDs. scanDate/runAt/cohortRank/future outcomes are excluded.
- Same root may receive causal versions when boundaries update or later certified anchors are added. A version is not a new independent root/sample.
- Exact anchor superset with only causally later anchors -> SAME_ROOT_CAUSAL_EXTENSION.
- Anchor replacement/removal without canonical lineage explanation -> IDENTITY_BREAK_OR_RESEGMENTATION. No fuzzy post-outcome matching is allowed.
- Repeated state snapshots are not repeated confirmation events. Same decision timestamp + same object/version + same snapshot hash -> REPLAY_DUPLICATE.
- Missing detector output is split into:
  - UNKNOWN_COVERAGE_GAP;
  - WINDOW_CENSORED;
  - DETECTOR_ABSENT_COMPLETE_SCAN;
  - explicit MARKET_INVALIDATED.
- WINDOW_CENSORED is detector observability loss as root anchors leave the rolling horizon; it is not market failure.
- Only explicit lifecycle invalidation can close an object episode as a market-structure event.
- Same root reacquired after detector absence or window censoring does not automatically become a new independent object. Reappearance after explicit MARKET_INVALIDATED requires NEW_EPISODE_AFTER_INVALIDATION.
- Within one decision timestamp, overlapping raw detector windows that emit the same root/version are deduplicated to one observation snapshot while raw emissions remain in the audit ledger.
- Same root/version with conflicting snapshot hashes -> PROVENANCE_CONFLICT, never majority vote.
- timeframe remains part of root identity; daily/weekly objects are not auto-deduplicated by price proximity.
- D16 future inference must report multiple Ns separately:
  unique daily decision parents;
  unique structural roots;
  unique structural episodes;
  object versions;
  observation snapshots;
  raw detector emissions;
  repeated-exposure distribution;
  coverage/window-censoring rates.
- External finance evidence supports the dependence firewall: overlapping observations can materially change estimates/inference, and even small correlation among overlapping event observations can bias test statistics.
- New files:
  - research/PATTERN_STRUCTURAL_OBJECT_PERSISTENCE_V0_1.md
  - research/pattern_structural_object_persistence_v0_1.json
  - research/pattern_structural_object_persistence_v0_1.mjs
  - research/test_pattern_structural_object_persistence_v0_1.mjs
  - research/PATTERN_STRUCTURAL_OBJECT_PERSISTENCE_D16_HANDOFF_V0_1.md
- 14 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-030

1. Reconcile the DL-030 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-030 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve raw detector emissions and deduplicated snapshots together; never delete raw emissions to manufacture clean identity.
4. Hand root/episode/repeated-exposure and overlapping-window dependence semantics to D16.
5. Next D01 science: distinguish genuine structural aging/decay from mere observability loss as root anchors leave the detector horizon.
6. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-031 (2026-10-04)

### DL-031 — Structural aging vs observability censoring
- DL-030 separated one persistent structural object from repeated rolling-window rediscovery.
- DL-031 freezes the next falsification: an old support/resistance object can look weaker because of true aging, repeated-use depletion/reinforcement, or simple detector-horizon observability loss.
- External evidence motivates a two-dimensional mechanism rather than one scalar age:
  Chung and Bellotti report that more prior bounces can increase another bounce probability while elapsed time is associated with decreasing bounce probability.
  Henderson et al. (2026) provide a path-dependent state model with waiting-time transition toward a neutral regime, which makes time-varying structural state plausible but does not prove D01 alpha.
- Four separate clocks are frozen:
  A0 CALENDAR_AGE_DAYS — descriptive only;
  A1 ELIGIBLE_SESSION_AGE — primary chronological market-time age;
  A2 OBSERVABLE_SESSION_AGE — sessions with complete/reconstructible follow-up;
  A3 INTERACTION_OPPORTUNITY_AGE — causally valid structural interaction opportunities.
- Interaction history remains a separate family:
  priorInteractionCount;
  priorBounceCount;
  priorBreakCount;
  priorReclaimCount;
  timeSinceLastInteractionEligibleSessions;
  timeSinceLastBounceEligibleSessions.
- No combined strength/decay score and no fixed half-life are defined.
- Root age and version age are separated:
  a causal boundary/anchor extension does not reset ROOT_AGE;
  it does reset VERSION_AGE.
- Observability states are frozen:
  O0 OBSERVABLE_ACTIVE;
  O1 WINDOW_CENSORED_ROOT_PERSISTED;
  O2 UNKNOWN_COVERAGE_GAP;
  O3 DETECTOR_ABSENT_COMPLETE_SCAN;
  O4 MARKET_INVALIDATED;
  O5 STUDY_END_RIGHT_CENSORED.
- WINDOW_CENSORED_ROOT_PERSISTED is a detector-observability state, not structural failure.
- Under finite rolling lookback, window censoring is mechanically age-dependent. Restricting analysis to objects still emitted by the detector would create a survivor/observability selection problem.
- Persisted-root follow-up is allowed only from a causal immutable root/boundary/version ledger. It does not pretend the current rolling detector could rediscover the old object.
- Left-truncation firewall:
  unknown first confirmation -> LEFT_TRUNCATED_FIRST_CONFIRMATION_UNKNOWN -> not promotion-grade for decay inference.
  exact historical first-confirmation replay may remain evaluable if the full causal history is certified.
- Primary future decay estimand is opportunity-based:
  freeze age + interaction history immediately before a real structural interaction opportunity.
  A non-approach day is not a failure.
- MARKET_INVALIDATED is an event.
  STUDY_END_RIGHT_CENSORED is censoring.
  WINDOW_CENSORED_ROOT_PERSISTED is detector censoring / observability loss.
  UNKNOWN_COVERAGE_GAP is unknown/missingness.
  These states may never be pooled into one inactive label.
- Future D16 falsification ladder:
  A0 apparent decay only while detector-visible -> detector-horizon artifact;
  A1 age effect redundant with interaction history;
  A2 interaction effect redundant with age;
  A3 age and interaction both remain;
  A4 not evaluable.
- New files:
  - research/PATTERN_STRUCTURAL_AGING_OBSERVABILITY_V0_1.md
  - research/pattern_structural_aging_observability_v0_1.json
  - research/pattern_structural_aging_observability_v0_1.mjs
  - research/test_pattern_structural_aging_observability_v0_1.mjs
  - research/PATTERN_STRUCTURAL_AGING_OBSERVABILITY_D16_HANDOFF_V0_1.md
- 14 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-031

1. Reconcile the DL-031 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-031 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve root age, version age, observability age and interaction history as separate fields; do not create a decay score.
4. Preserve window-censored roots in the research follow-up manifest; never relabel horizon loss as market failure.
5. Hand left-truncation/right-censoring/opportunity-based inference semantics to D16.
6. Next D01 science: separate structural aging from regime migration / volatility-scale migration so a level does not look old merely because the price process changed scale.
7. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-032 (2026-10-04)

### DL-032 — Structural aging vs regime / volatility-scale migration
- DL-031 separated structural age from detector observability and interaction history.
- DL-032 freezes another confound: an old level may appear weaker because volatility, price scale, liquidity or market regime changed rather than because structural memory decayed.
- Canonical structural geometry remains immutable. Current ATR/volatility/liquidity/regime may change normalized interpretation but cannot retroactively widen/narrow the persisted boundary.
- Three objects are kept separate:
  IMMUTABLE_STRUCTURAL_GEOMETRY;
  FORMATION_CONTEXT;
  CURRENT_OPPORTUNITY_CONTEXT.
- Formation/current scale descriptors include:
  reference price;
  ATR;
  normalized volatility;
  relative tick;
  liquidity state;
  volatility regime;
  market regime;
  sector regime.
- Derived descriptors are outcome-blind and descriptive:
  ZONE_WIDTH_PRICE;
  FORMATION_ZONE_WIDTH_ATR;
  CURRENT_ZONE_WIDTH_ATR;
  FORMATION_ZONE_WIDTH_PCT;
  CURRENT_ZONE_WIDTH_PCT;
  VOLATILITY_SCALE_RATIO;
  RELATIVE_TICK_RATIO.
- Scale normalization never mutates structural identity.
- Corporate-action discontinuity may not masquerade as scale migration. Formation/current states must share canonical TECHNICAL_CONTINUITY semantic space or the analysis is DATA_BLOCKED.
- D01 does not create new volatility/regime taxonomies:
  D04/D05 own volatility/microstructure context;
  D18 owns market-regime context;
  D02 owns acceptance/persistence context.
  Missing/incompatible owner receipts remain UNKNOWN.
- Regime migration does not reset ROOT_AGE or VERSION_AGE by itself and does not create a new root.
- Same frozen zone may shift dramatically in ATR/percent/tick units. Example:
  4 price units may be 2 ATR at formation but 0.5 ATR later.
  This can alter crossing/bounce behavior without any structural-memory decay.
- Dynamic ATR widening/tightening is prohibited as a rescue operation.
  Any adaptive-width sensitivity view is a separate preregistered challenger with separate identity.
- Future D16 nested comparison ladder:
  C0 age + interaction history;
  C1 C0 + current scale/context;
  C2 C1 + formation-to-current migration descriptors;
  C3 C2 + canonical owner regime context.
- Future interpretation states:
  M0_AGE_SURVIVES;
  M1_SCALE_CONFOUND;
  M2_MIGRATION_CONFOUND;
  M3_REGIME_SPECIFIC;
  M4_NOT_EVALUABLE.
- Common support is mandatory across:
  age;
  normalized volatility;
  liquidity;
  relative tick;
  regime;
  interaction history.
  Explicit support failure -> EXTRAPOLATION_PROHIBITED.
- No arbitrary migration buckets or hard-coded ATR thresholds are defined.
- Taiwan evidence supports treating technical-rule behavior and volatility as interacting context; recent Taiwan volatility research also shows model specification and sector context materially affect volatility-targeting behavior. This is context evidence, not D01 alpha proof.
- Henderson et al. (2026) explicitly note their tractable model fixes support/resistance levels despite real-world path dependencies being more complex; DL-032 therefore preserves causal fixed geometry while allowing context to migrate around it.
- New files:
  - research/PATTERN_REGIME_SCALE_MIGRATION_V0_1.md
  - research/pattern_regime_scale_migration_v0_1.json
  - research/pattern_regime_scale_migration_v0_1.mjs
  - research/test_pattern_regime_scale_migration_v0_1.mjs
  - research/PATTERN_REGIME_SCALE_MIGRATION_D16_HANDOFF_V0_1.md
- 14 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-032

1. Reconcile the DL-032 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-032 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve the frozen structural boundary while formation/current scale and regime descriptors evolve; never rescue old geometry by ATR widening.
4. Consume D04/D05/D18/D02 owner receipts without duplicating their taxonomies.
5. Hand common-support and C0-C3 nested inference semantics to D16.
6. Next D01 science: separate structural aging from absolute price displacement / long excursion path so "far away for a long time" is not conflated with "old."
7. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-033 (2026-10-04)

### DL-033 — Structural aging vs absolute displacement / long excursion path
- DL-031 separated age from observability and interaction history.
- DL-032 separated age from volatility/regime scale migration.
- DL-033 freezes another confound: an old structural object may differ because price spent a long time far away and later returned, not because elapsed age itself changed structural memory.
- Age, current location and excursion path are separate families:
  AGE = root/version eligible-session age;
  CURRENT LOCATION = signed/absolute distance to frozen zone;
  PATH = max excursion, cumulative path, one-sided excursions, time since last interaction and return-trip state.
- Same-age counterexample is explicit:
  one root may remain near its zone;
  another may travel many ATR away and return.
  Both cannot be represented by age alone.
- Frozen distance semantics:
  inside zone -> distance 0;
  above zone -> close - upper;
  below zone -> close - lower.
- Continuous descriptors include:
  signedDistancePrice;
  absoluteDistancePrice;
  currentDistanceAtr;
  currentDistancePct;
  maxAbsExcursionPrice;
  maxAbsExcursionAtr;
  maxAboveExcursionPrice;
  maxBelowExcursionPrice;
  cumulativeAbsPathPrice;
  cumulativeAbsPathAtr.
- No arbitrary near/far threshold or staleness score is defined.
- Long time without interaction and large excursion are not the same:
  a root may have long no-interaction time with modest distance;
  short no-interaction time with large distance;
  both;
  neither.
- Return from above vs below remains explicit through excursionSide / returnApproachSide / orientation.
- Path summaries require complete eligible-session continuity from the last valid interaction/causal landmark through asOf.
  Unresolved gaps -> PATH_SUMMARY_DATA_BLOCKED.
  Missing excursion/path values are not imputed.
- All path prices must remain in canonical TECHNICAL_CONTINUITY semantic space; corporate-action raw jumps cannot become excursion.
- Far-away current state is location only, not a failed structural test.
  Response inference begins only at a valid interaction opportunity.
- Future D16 nested comparison:
  P0 age + interaction history + DL-032 scale/regime;
  P1 + current distance/location;
  P2 + max/cumulative excursion path;
  P3 + time-since-last-interaction / return-trip descriptors.
- Future interpretation:
  D0_AGE_SURVIVES_PATH;
  D1_CURRENT_DISTANCE_CONFOUND;
  D2_EXCURSION_PATH_CONFOUND;
  D3_RETURN_RECENCY_CONFOUND;
  D4_NOT_EVALUABLE.
- Common support must include current distance, excursion magnitude, interaction recency/history and DL-032 scale/regime context.
- Support/resistance literature is path-dependent by construction; Chung/Bellotti separate elapsed time from prior bounce history, and Henderson et al. (2026) explicitly model path-dependent regime transitions. This motivates the firewall but does not prove D01 alpha.
- New files:
  - research/PATTERN_DISPLACEMENT_PATH_V0_1.md
  - research/pattern_displacement_path_v0_1.json
  - research/pattern_displacement_path_v0_1.mjs
  - research/test_pattern_displacement_path_v0_1.mjs
  - research/PATTERN_DISPLACEMENT_PATH_D16_HANDOFF_V0_1.md
- 14 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-033

1. Reconcile the DL-033 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-033 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve age, current location, excursion path and interaction recency as separate fields; do not create a staleness score.
4. Keep path summaries fail-closed under continuity gaps and never re-anchor the zone toward current price.
5. Hand P0-P3 common-support inference semantics to D16.
6. Next D01 science: separate structural persistence from role reversal / polarity flip so an old resistance becoming support is not misclassified as either decay or fresh independent structure.
7. No outcome join / no runtime wiring / no Formal change.


## 00 control-plane receipt — H16 / H20 terminal closures

H16 is CLOSED_NO_STRUCTURAL_CHANGE:
- D01-09 remains chart/pattern semantics owner under gap/price-limit constraints.
- D05-02 owns exchange mechanics; D11-11 exit/orderability; D04-10 volatility contamination.
- one limit event cannot become multiple independent votes.

H20 is CLOSED_NO_STRUCTURAL_CHANGE:
- D01-05 remains breakout/failure lifecycle and event-identity owner.
- D02-03 volume and D04-07 volatility are transforms on the same breakout parent.
- price + volume + volatility cannot be counted as three independent votes unless residual incremental evidence later passes.

D01-09 remains L2/40%; D01-05 remains L3/60%.
No maturity/count/Formal/runtime change from closure.

Audits:
- shared-knowledge/CURRICULUM_H16_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md
- shared-knowledge/CURRICULUM_H20_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md


## 00 routed COV-01 final specialist-return delta — 2026-10-04

COV-01 is now:
`SPECIALIST_RETURN_READY_PENDING_TERMINAL_RECOMMENDATION`.

Do not redo the Pattern ontology.

Accepted:
- Platform / Flag / Triangle / Pennant / Wedge / HTF / Cup / VCP specifications;
- latent geometry and cross-pattern de-dup;
- repaint-safe confirmation/failure timing;
- D01-05 breakout lifecycle boundary;
- D01-08 VCP specialization;
- named labels are not independent votes.

Exact remaining return delta:
1. compare D01-07 as umbrella continuation/base morphology owner versus a distinct umbrella owner;
2. decide whether D01-07 can absorb platform/flag/triangle/wedge/base families cleanly;
3. identify any unique replay/data/decision contract that would justify a new module;
4. choose exactly one terminal recommendation;
5. commit `research/COV01_D01_SPECIALIST_RETURN_V0_1.md`.

No maturity or Formal change is authorized by this routing.


## Continuation update — DL-034 (2026-10-04)

### DL-034 — Structural persistence vs role reversal / polarity flip
- DL-034 freezes role-reversal semantics without assuming the polarity claim is already proven.
- External evidence is asymmetric:
  Osler (2000/2003) supports trend interruption at technical levels and acceleration through crossed levels via order clustering;
  Zapranis/Tsinaslanidis (2012) supports some horizontal support/resistance trend-interruption ability but not abnormal-return superiority;
  Chung/Bellotti (2021) supports temporary barrier memory with bounce-count and time effects;
  Henderson/Jacka/Liu/Maeda (2026) explicitly model support/resistance role reversal as a path-dependent state, but that is theoretical mechanism structure rather than direct empirical proof of incremental polarity memory.
- The same persisted price zone remains the same STRUCTURAL_OBJECT_ROOT by default.
  A polarity change creates a ROLE_EPISODE, not a new independent root.
- Root age continues.
  Structural-version age continues unless geometry actually changes.
  Role-episode age starts at canonical breakoutConfirmedAt.
- Only two directional mappings are eligible:
  RESISTANCE + confirmed UP breakout -> SUPPORT candidate;
  SUPPORT + confirmed DOWN breakdown -> RESISTANCE candidate.
- D01-05 remains breakout/failure lifecycle owner.
  DL-034 consumes its breakoutEventId/direction/confirmedAt/lifecycle state and does not invent new breakout thresholds.
- Wick-only or unconfirmed crossings do not create flip eligibility.
- Outcome-leakage firewall:
  canonical confirmed crossing creates CROSS_CONFIRMED_FLIP_ELIGIBLE only.
  The first valid opposite-side retest is FIRST_FLIP_TEST_OPPORTUNITY.
  The first retest result cannot be used in eligibility.
- This avoids circular reasoning where a bounce first defines the role flip and the same bounce is then reported as proof that the flip worked.
- Candidate cancellation before first test is explicit:
  failed/reclaimed breakout lifecycle;
  market invalidation;
  semantic-continuity failure;
  unresolved constraints.
  Cancellation is not a failed retest because no valid test opportunity occurred.
- Central falsification comparator:
  G0 = generic confirmed breakout/retest without certified prior opposite-role structural history;
  G1 = matched breakout/retest context with certified former support/resistance role.
- If G1 does not improve on G0, a generic breakout/retest mechanism is sufficient and polarity-memory interpretation weakens.
- Future D16 nested comparison:
  F0 generic breakout/retest controls;
  F1 + certified prior opposite role;
  F2 + original-role history/salience/age;
  F3 + DL-031/DL-032/DL-033 age/scale/regime/path controls.
- Prior-role interaction history is stored but not converted into an automatic strength score.
- Behavioral stories such as trapped traders or breakeven exits are plausible mechanisms, not identifiable from OHLC alone; D20 owns behavioral mechanism research.
- Gap/price-limit constrained crossings/retests remain explicit and are not silently pooled with unconstrained cases.
- Original support/resistance, breakout, first retest, volume confirmation and volatility confirmation are linked observations inside one causal lineage; they do not multiply independent N.
- New files:
  - research/PATTERN_ROLE_REVERSAL_V0_1.md
  - research/pattern_role_reversal_v0_1.json
  - research/pattern_role_reversal_v0_1.mjs
  - research/test_pattern_role_reversal_v0_1.mjs
  - research/PATTERN_ROLE_REVERSAL_D16_HANDOFF_V0_1.md
- 16 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-034

1. Reconcile the DL-034 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-034 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve same-root role episodes, first-retest opportunity identity and candidate cancellation states.
4. Freeze G0/G1 generic-retest comparator semantics before outcomes.
5. Hand F0-F3 parent/root/role-episode inference semantics to D16.
6. Next D01 science: distinguish genuine polarity memory from simple breakout displacement/momentum and from boundary salience under matched first-retest opportunity.
7. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-035 (2026-10-04)

### DL-035 — Polarity memory vs breakout momentum, boundary salience and retest selection
- DL-034 established causal role-reversal eligibility and kept the first opposite-side retest outcome outside eligibility.
- DL-035 adds three alternative explanations that must be separated before any polarity-memory claim:
  generic breakout continuation/momentum;
  boundary salience/price clustering/reference-point effects;
  selection into the subset that later produces a first retest.
- External evidence strengthens these controls:
  Osler shows acceleration through technical levels can arise from clustered order flow;
  George/Hwang show salient price-reference proximity can dominate past-return momentum information;
  Hao/Chu/Ho/Ko find mixed anchoring/recency evidence for 52-week-high momentum in Taiwan;
  Chiao finds Taiwan limit-order prices cluster at integer/even prices and that clustering creates price barriers;
  modern technical-rule studies treat support/resistance/channel breakouts as a broad rule family distinct from polarity memory.
- Two future estimands are frozen:
  E1 FIRST_RETEST_ARRIVAL = among all eligible breakouts, whether/when a valid first opposite-side retest occurs;
  E2 FIRST_RETEST_RESPONSE = conditional on FIRST_RETEST_ARRIVED, what happens at/after that first valid opportunity.
- E2 may not be described as an unconditional polarity effect because it conditions on retest selection.
- Pre-break context is frozen no later than breakoutConfirmedAt and may contain:
  breakout quality/excess;
  D02 acceptance/persistence;
  volatility/liquidity/regime;
  relative tick and constraints;
  boundary salience / detector prominence / reference-level proximity.
- Post-break/pre-retest descriptors are a different causal-timing family:
  maximum directional displacement;
  cumulative path;
  time to retest;
  retracement/return-path descriptors;
  intervening scale/liquidity migration.
- Those post-break descriptors are MEDIATOR_OR_SELECTION_VARIABLE, not ordinary baseline confounders.
- Future D16 must distinguish:
  TOTAL_POLARITY_INCREMENT = S1 vs S0 with pre-break adjustment only;
  PATH_CONDITIONAL_POLARITY_INCREMENT = conditional E2 comparison after explicit post-break path adjustment.
- Removing an effect after post-break adjustment does not automatically mean "no polarity effect"; it can mean the effect is mediated/explained through the breakout path and the estimand changed.
- Primary comparator family is frozen:
  S0_SALIENT_NON_ROLE_BREAKOUT = causally salient breakout boundary without certified prior opposite support/resistance role;
  S1_CERTIFIED_FORMER_ROLE_BREAKOUT = comparable boundary with certified former opposite role.
- Random horizontal breakout lines are rejected as the primary control.
- Preferred S0 sources include same-detector salient/unconfirmed structural candidates from DL-028 or preregistered salient range/channel/reference boundaries.
- Do not exact-match away the full treatment definition:
  presence of certified former role and intensity of role history are separate estimands.
- E1 selection reporting must include S0/S1:
  eligible breakout N;
  first-retest arrival rate;
  time-to-retest distribution;
  cancellation rate;
  right-censoring rate;
  data-block / constraint rate.
- States remain separate:
  FIRST_RETEST_ARRIVED;
  RIGHT_CENSORED_NO_RETEST;
  CANCELLED_BEFORE_RETEST;
  DATA_BLOCKED.
  They may not be pooled into "failed flip."
- Future nested interpretation:
  I0 generic salient breakout/retest;
  I1 pre-break matched context;
  I2 + certified former role;
  I3 + explicit post-break path for conditional interpretation.
- Future labels:
  Q0_GENERIC_BREAKOUT_SUFFICIENT;
  Q1_POLARITY_INCREMENT;
  Q2_PATH_MEDIATED;
  Q3_SALIENCE_EXPLANATION;
  Q4_SELECTION_SENSITIVE;
  Q5_NOT_EVALUABLE.
- Common support for the total estimand is evaluated in pre-break context.
  Path-conditional E2 additionally requires post-break path common support.
- One breakout candidate remains one causal unit even when it contributes an E1 record, E2 snapshot and many descriptors.
- New files:
  - research/PATTERN_POLARITY_INCREMENTALITY_V0_1.md
  - research/pattern_polarity_incrementality_v0_1.json
  - research/pattern_polarity_incrementality_v0_1.mjs
  - research/test_pattern_polarity_incrementality_v0_1.mjs
  - research/PATTERN_POLARITY_INCREMENTALITY_D16_HANDOFF_V0_1.md
- 18 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-035

1. Reconcile the DL-035 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-035 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve E1 first-retest arrival and E2 conditional response as distinct estimands.
4. Keep post-break/pre-retest path variables marked as mediators/selection variables, not baseline confounders.
5. Hand total-vs-path-conditional inference and S0/S1 common-support handling to D16.
6. Next D01 science: distinguish inherited old-role polarity memory from NEW post-break structure formed after the crossing near the same price zone.
7. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-036 (2026-10-05)

### DL-036 — Inherited polarity memory vs new post-break structure
- DL-034 froze role-reversal eligibility; DL-035 separated retest arrival/response, momentum, salience and selection.
- DL-036 addresses a distinct ambiguity: a later response near the old broken zone may reflect inherited polarity memory, a genuinely new post-break structure, a same-root causal extension, two co-located lineages, or no valid new structure.
- Spatial overlap is descriptive only and may not determine lineage identity.
- Two identities are now explicitly separated:
  STRUCTURAL_LINEAGE asks same root / new root / unresolved;
  INFORMATION_LINEAGE asks whether the representation is an independent information contribution.
- New structural root != new independent vote.
  D01 structural geometry remains informationRoot = PRICE_OHLC and representationFamily = D01_PRICE_GEOMETRY.
- Default same-parent redundancy rule:
  rawRepresentationCount may exceed 1;
  distinctStructuralRootCount may exceed 1;
  effectiveIndependentEvidenceCount remains 1 until D16 validates residual incrementality.
- This is additive to existing SDA-001 controls and does not claim ticket closure.
- Frozen lineage states:
  INHERITED_ROLE_ONLY;
  SAME_ROOT_CAUSAL_EXTENSION;
  NEW_POST_BREAK_ROOT_PRETEST;
  COLOCATED_DUAL_LINEAGE_PRETEST;
  NEW_STRUCTURE_CONFIRMED_AFTER_TEST;
  SPATIAL_OVERLAP_WITHOUT_LINEAGE;
  NEW_POST_BREAK_ROOT_NONOVERLAP.
- Causal lineage beats price proximity:
  same-root anchor superset with only later causal anchors -> SAME_ROOT_CAUSAL_EXTENSION;
  independently certified post-break root -> new structural lineage;
  ambiguous/replaced anchors -> unresolved rather than fuzzy assignment.
- No overlap threshold (50%, 70%, ATR band, etc.) is allowed to decide same-root/new-root identity.
- SDA-002-specific timing firewall is extended:
  every new candidate stores firstObservableAt, confirmedAt, latestAnchorAt, predictorFreezeAt, replaySafe and futureBarRequired.
- A structure confirmed at or after the tested retest opportunity cannot explain that opportunity.
- A retest bar or later pivot-confirmation bar cannot certify its own pre-retest predictor.
- Future bars may not rewrite an earlier candidate snapshot.
- Negative/divergent states remain mandatory:
  no new structure;
  new-only;
  dual co-location;
  same-root extension;
  unresolved overlap;
  post-hoc confirmation;
  non-overlap;
  never-confirmed candidate.
- A new post-break structure may itself be a mediator of the breakout path.
  It is therefore not an automatic baseline confounder for the total inherited-polarity estimand.
- Future comparison families handed to D16:
  C0 INHERITED_ONLY;
  C1 NEW_ONLY;
  C2 DUAL_COLOCATED;
  C3 SAME_ROOT_EXTENSION;
  C4 POST_HOC_NEW_STRUCTURE.
- Future incrementality questions:
  inherited role beyond new structure;
  new structure beyond inherited role;
  dual co-location after common-parent PRICE_OHLC residualization;
  raw-vs-dedup confluence;
  no-lookahead robustness after removal of post-hoc cases.
- External evidence remains compatible with multiple mechanisms:
  Osler order clustering supports reversal/acceleration around salient price levels;
  Chung/Bellotti support temporary SR barrier memory;
  recent breakout/retest work finds retest arrival/path characteristics can matter and generic breakout momentum can explain a large part of apparent technical-rule effects.
  None identifies inherited polarity memory by itself.
- New files:
  - research/PATTERN_INHERITED_VS_NEW_STRUCTURE_V0_1.md
  - research/pattern_inherited_vs_new_structure_v0_1.json
  - research/pattern_inherited_vs_new_structure_v0_1.mjs
  - research/test_pattern_inherited_vs_new_structure_v0_1.mjs
  - research/PATTERN_INHERITED_VS_NEW_STRUCTURE_D16_HANDOFF_V0_1.md
- 18 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS; existing engineering Shadow lineage/dedup work is credited, while D16 common-parent residual readback / System 2 integration / independent 00 closure remain outside D01 ownership.
- SDA-002 remains REMEDIATION_IN_PROGRESS; causal semantics are strong, but research Node test execution / system future-pivot guards / prospective evidence / 00 readback remain pending.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-036

1. Reconcile the DL-036 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-036 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve STRUCTURAL_LINEAGE and INFORMATION_LINEAGE separately; never promote a second price-derived structural root to a second effective vote by identity alone.
4. Preserve firstObservableAt / confirmedAt / latestAnchorAt / predictorFreezeAt / futureBarRequired for every post-break candidate.
5. Hand C0-C4 plus common-parent PRICE_OHLC residual inference to D16.
6. Preserve SDA-001 and SDA-002 as REMEDIATION_IN_PROGRESS until machine guards, D16 evidence and independent 00 closure satisfy the canonical queue.
7. Next D01 science: quantify topology identity robustness when multiple detector parameterizations generate the same apparent post-break root, without creating an indicator/geometry zoo.
8. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-037 (2026-10-05)

### DL-037 — Topology identity robustness across detector parameterizations
- DL-036 separated structural lineage from information lineage.
- DL-037 freezes parameter-family robustness so many detector variants cannot become a geometry/indicator zoo.
- External methodology support:
  Lo/Mamaysky/Wang show systematic algorithmic pattern recognition can reduce visual subjectivity;
  Sullivan/Timmermann/White show technical-rule families are exposed to data-snooping when many rules/variants are searched.
- Every detector family must export a frozen parameter registry before outcome inspection:
  detectorFamilyId;
  detectorVersion;
  parameterFamilyId;
  parameterGridHash;
  registryFrozenAt;
  variantId;
  parameterVector;
  semantic space/timeframe/source receipts.
- Variant identity, structural-topology identity and information identity are now explicitly separate.
- Exact same root/version/anchors/boundary/lifecycle at the same freeze -> EXACT_VARIANT_ALIAS.
- Same root with legal geometry/version differences -> SAME_ROOT_PARAMETER_VARIATION.
- Different root identities with no canonical relation -> PARAMETER_IDENTITY_CONFLICT.
- Majority vote may not decide canonical truth.
- Best-performing variant may not be selected after outcomes.
- Variants that emit no structure remain in the frozen family denominator.
- Data-blocked and post-hoc variants remain visible as separate states.
- Allowed family robustness descriptors:
  eligibleVariantCount;
  rootEmittedCount;
  exactAliasCount;
  sameRootVariationCount;
  noStructureCount;
  dataBlockedCount;
  postHocCount;
  identityConflictCount;
  emissionRate;
  sameRootSupportRate;
  conflictRate;
  noStructureRate.
- These are detector robustness descriptors, not alpha scores and not vote counts.
- All price-only D01 variants remain:
  informationRoot = PRICE_OHLC;
  representationFamily = D01_PRICE_GEOMETRY;
  redundancyGroup = D01_PRICE_GEOMETRY_PARAMETER_FAMILY.
- Default effectiveIndependentEvidenceCount remains 1 regardless of rawVariantCount.
- residualIncrementalityStatus remains NOT_VALIDATED until D16 common-parent residual evidence exists.
- SDA-002 no-lookahead is enforced per variant:
  firstObservableAt;
  confirmedAt;
  latestAnchorAt;
  predictorFreezeAt;
  futureBarRequired;
  replaySafe.
- A family consensus cannot launder a future-looking variant.
- Future D16 comparison families:
  P0 CANONICAL_ONLY;
  P1 FAMILY_DIAGNOSTIC;
  P2 VARIANT_ENSEMBLE_RAW;
  P3 VARIANT_ENSEMBLE_DEDUP.
- P2 vs P3 is intended to expose false confidence from correlated variant multiplicity.
- Familywise inference must account for all preregistered variants, dependence, repeated dates, family revisions and holdout use.
- New files:
  - research/PATTERN_TOPOLOGY_PARAMETER_ROBUSTNESS_V0_1.md
  - research/pattern_topology_parameter_robustness_v0_1.json
  - research/pattern_topology_parameter_robustness_v0_1.mjs
  - research/test_pattern_topology_parameter_robustness_v0_1.mjs
  - research/PATTERN_TOPOLOGY_PARAMETER_ROBUSTNESS_D16_HANDOFF_V0_1.md
- 24 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS.
- SDA-002 remains REMEDIATION_IN_PROGRESS.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-037

1. Reconcile the DL-037 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-037 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Keep the full preregistered parameter family in robustness denominators; never drop no-structure or poor variants after outcomes.
4. Keep effectiveIndependentEvidenceCount = 1 for price-only D01 parameter families until D16 residual incrementality is validated.
5. Hand P0-P3 familywise inference / dependence / residual testing to D16.
6. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS until canonical closure evidence exists.
7. Next D01 science: separate detector robustness from economic robustness across symbols, dates and regimes so stable local topology is not mistaken for generalizable evidence.
8. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-038 (2026-10-05)

### DL-038 — Detector robustness vs economic robustness across symbols, dates and regimes
- DL-037 froze detector parameter-family robustness.
- DL-038 freezes a strict separation:
  DETECTOR_ROBUSTNESS = same local geometry is stably identified across frozen detector variants;
  ECONOMIC_ROBUSTNESS = incremental evidence generalizes across symbols, independent dates/episodes, ex-ante regimes, prospective/OOS periods and costs.
- Detector robustness may be high while economic robustness is zero or UNKNOWN.
- External evidence motivates the firewall:
  Sullivan/Timmermann/White require data-snooping correction across technical-rule universes;
  true fresh OOS research has failed to reproduce some classic technical-rule results;
  recent large-rule studies show much apparent profitability can disappear after multiple-testing correction, OOS evaluation and transaction costs;
  breakout evidence can vary materially with market condition.
- D01 does not open economic outcomes.
  D16 owns actual economic robustness evidence.
- Frozen detector axis:
  D0 DETECTOR_NOT_EVALUABLE;
  D1 DETECTOR_UNSTABLE;
  D2 DETECTOR_LOCALLY_STABLE.
- Frozen future economic axis:
  E0 ECONOMIC_NOT_OPENED;
  E1 ECONOMIC_LOCAL_ONLY;
  E2 ECONOMIC_MULTI_SYMBOL;
  E3 ECONOMIC_MULTI_DATE;
  E4 ECONOMIC_MULTI_REGIME;
  E5 ECONOMIC_PROSPECTIVE_OOS_COST_AWARE.
- High sameRootSupportRate / low conflictRate cannot promote the E-axis.
- Repeated observations of one root across adjacent dates do not create independent replication.
- Future reports must separate:
  unique decision parents;
  unique structural roots;
  unique object episodes;
  unique symbols;
  independent date/episode clusters;
  regime strata;
  raw representation N;
  deduped PRICE_OHLC effective evidence N.
- Symbol generalization must report concentration and missing/data-blocked symbols so one dominant stock cannot masquerade as broad evidence.
- Date generalization requires dependence-aware independent clusters; adjacent dates sharing one root/regime/outcome window are not independent.
- Regime generalization consumes only canonical ex-ante regime receipts; Pattern performance may not define the favorable regime.
- Coverage firewall:
  eligible/evaluable/data-blocked/no-opportunity/missing denominators remain visible.
  UNKNOWN is not zero and is not silently dropped.
- Future generalization readiness ladder:
  G0 LOCAL_DETECTOR_ONLY;
  G1 CROSS_SYMBOL;
  G2 CROSS_DATE;
  G3 CROSS_REGIME;
  G4 PROSPECTIVE_OOS;
  G5 COST_AWARE.
- These are design/evidence stages; D01 does not assign economic success.
- Holdout discipline fields:
  holdoutId;
  holdoutFirstOpenedAt;
  holdoutUseCount;
  prospectiveFlag.
  Repeatedly opening the same OOS set makes it development-like.
- Economic validation readiness requires frozen:
  semantic detector contract;
  parameter family;
  parent/root identity;
  symbol-universe vintage;
  date windows;
  regime owner/version;
  target/benchmark/horizon;
  cost policy;
  missingness/coverage policy;
  dependence unit;
  holdout policy.
- Missing any required item -> ECONOMIC_VALIDATION_NOT_READY.
- SDA-001 remains central:
  any eventual Pattern economic evidence must still prove residual value beyond direct PRICE_OHLC baselines and overlapping D02/D03 families.
- SDA-002 remains central:
  all roots/episodes used in replication must be replay-safe; a large hindsight-labeled sample is not valid generalization evidence.
- New files:
  - research/PATTERN_DETECTOR_VS_ECONOMIC_ROBUSTNESS_V0_1.md
  - research/pattern_detector_vs_economic_robustness_v0_1.json
  - research/pattern_detector_vs_economic_robustness_v0_1.mjs
  - research/test_pattern_detector_vs_economic_robustness_v0_1.mjs
  - research/PATTERN_DETECTOR_VS_ECONOMIC_ROBUSTNESS_D16_HANDOFF_V0_1.md
- 18 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS.
- SDA-002 remains REMEDIATION_IN_PROGRESS.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-038

1. Reconcile the DL-038 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-038 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve detector robustness, economic replication and coverage as separate ledgers.
4. Keep repeated root dates separate from independent economic replication count.
5. Hand G0-G5 generalization readiness / holdout / regime / coverage semantics to D16.
6. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS until canonical closure evidence exists.
7. Next D01 science: separate cross-sectional generalization from liquidity/size survivorship so Pattern does not appear robust only because data-rich liquid stocks are easier to detect and trade.
8. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-039 (2026-10-05)

### DL-039 — Cross-sectional generalization vs liquidity / size / survivorship selection
- DL-038 separated detector robustness from economic robustness.
- DL-039 freezes the next cross-sectional selection firewall: Pattern may look robust only because large, liquid, long-listed and data-rich stocks are easier to observe, detect, retest and trade.
- External evidence motivates explicit controls:
  Taiwan firm-level technical-trading evidence reports profitability varies with firm size and trading volume;
  recent Taiwan size-effect evidence identifies illiquidity and price-limit related limits-to-arbitrage as important cross-sectional context;
  survivorship-bias literature shows historical cross-sectional inference can change when later-delisted/non-surviving firms are restored.
- Every future design must freeze one target population before outcomes:
  POINT_IN_TIME_MARKET_UNIVERSE;
  or FORMAL_ELIGIBLE_UNIVERSE.
- If the target is FORMAL_ELIGIBLE_UNIVERSE, claims are restricted to that Formal-eligible population; market-wide generalization is prohibited.
- D01 consumes an existing point-in-time historical-universe receipt rather than rebuilding one.
  The current repository historical-universe registry explicitly supports CURRENT + DELISTED membership intervals and hides future delisting information from strategy timestamps.
- Cross-sectional attrition is now frozen as explicit stages:
  TARGET_UNIVERSE_ELIGIBLE;
  HISTORY_READY;
  HISTORY_TOO_SHORT_BY_DESIGN;
  HISTORY_DATA_BLOCKED;
  DETECTOR_EVALUABLE;
  DETECTOR_NO_STRUCTURE;
  DETECTOR_DATA_BLOCKED;
  STRUCTURE_EMITTED;
  OPPORTUNITY_READY;
  NO_VALID_OPPORTUNITY;
  OPPORTUNITY_DATA_BLOCKED;
  ECONOMIC_EVALUABLE;
  TRADABILITY_EVALUABLE.
- New-listing firewall:
  when listing-age-aware available history is complete but detector minimum lookback is not reached, state = HISTORY_TOO_SHORT_BY_DESIGN.
  It is not missing data, no-pattern evidence or a negative case.
- Historical-survivorship firewall:
  today's survivors cannot reconstruct a historical universe;
  later-delisted symbols remain in the point-in-time denominator when they were eligible;
  future delisting date may not enter the predictor;
  D01 does not assign terminal delisting returns.
- Data survivorship is separated from no-pattern evidence:
  HISTORY_DATA_BLOCKED / DETECTOR_DATA_BLOCKED / OPPORTUNITY_DATA_BLOCKED / EXECUTION_CONTEXT_UNKNOWN remain visible.
  UNKNOWN is never silently recoded as NO_STRUCTURE.
- D01 consumes point-in-time size/liquidity receipts and does not redefine their owner taxonomies.
  Relevant context includes market cap/size, value traded/volume/turnover, spread/depth where available, relative tick, price tier, constraints and listing age.
- Current/future size or liquidity values may not be backfilled into historical predictor states.
- Formal liquidity eligibility and scientific cross-sectional generalization are kept separate.
  Future reports show market-universe denominator, Formal-eligible denominator, detector-evaluable denominator, opportunity denominator and tradability denominator.
- Detectability and tradability are distinct:
  a symbol can be detector-evaluable but not execution-evaluable;
  a new listing can be data-complete but history-ineligible;
  a structure can exist without a valid opportunity.
- Cross-sectional coverage matrix must report by point-in-time market / size / liquidity / listing-age / price-tick context:
  target eligible;
  history ready;
  history too short;
  history blocked;
  detector evaluable;
  no structure;
  structure emitted;
  opportunity ready;
  no opportunity;
  opportunity blocked;
  economic evaluable;
  tradability evaluable.
- Successful-case denominators are prohibited:
  structure-only, retest-only, execution-complete-only, current-survivor-only and hidden mature-history-only samples cannot define cross-sectional coverage.
- Symbol breadth is separated from opportunity count.
  top contributor shares / concentration remain descriptive and cannot create broad-generalization claims by themselves.
- Common-support firewall spans point-in-time size, liquidity, listing age, price/tick tier, market, regime and detector-history readiness.
  Lack of overlap -> CROSS_SECTIONAL_EXTRAPOLATION_PROHIBITED.
- Liquidity-conditioned technical effects are treated as context, not Pattern alpha.
  Better results in liquid names may reflect cleaner observability/trend persistence/lower noise/lower cost;
  stronger results in illiquid names may reflect stale prices/spread/limits-to-arbitrage/untradeable marks.
- Delisting, suspension, price-limit constraint and unknown execution context are separate later-evaluation states; none is silently dropped.
- Cross-sectional readiness ladder:
  X0 TARGET_UNIVERSE_UNFROZEN;
  X1 POINT_IN_TIME_UNIVERSE_READY;
  X2 HISTORY_AND_DATA_ATTRITION_AUDITED;
  X3 DETECTOR_COVERAGE_BY_SIZE_LIQUIDITY_READY;
  X4 COMMON_SUPPORT_AND_SURVIVORSHIP_READY;
  X5 OPPORTUNITY_SELECTION_AUDITED;
  X6 TRADABILITY_CONTEXT_AUDITED.
- New files:
  - research/PATTERN_CROSSSECTION_LIQUIDITY_SURVIVORSHIP_V0_1.md
  - research/pattern_crosssection_liquidity_survivorship_v0_1.json
  - research/pattern_crosssection_liquidity_survivorship_v0_1.mjs
  - research/test_pattern_crosssection_liquidity_survivorship_v0_1.mjs
  - research/PATTERN_CROSSSECTION_LIQUIDITY_SURVIVORSHIP_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS.
- SDA-002 remains REMEDIATION_IN_PROGRESS.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-039

1. Reconcile the DL-039 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-039 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve target-universe, history-readiness, detector, opportunity, economic-evaluability and tradability ledgers separately.
4. Keep HISTORY_TOO_SHORT_BY_DESIGN separate from data missingness and no-structure evidence.
5. Preserve POINT_IN_TIME_MARKET_UNIVERSE vs FORMAL_ELIGIBLE_UNIVERSE claim scope explicitly.
6. Hand X0-X6 / size-liquidity common support / delisting / symbol-concentration semantics to D16.
7. Consume existing historical-universe and D04/D05 liquidity owners without duplicating their taxonomies.
8. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS until canonical closure evidence exists.
9. Next D01 science: separate cross-sectional coverage from sector/industry composition so a Pattern effect concentrated in one industry is not mislabeled as generic chart-structure evidence.
10. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-040 (2026-10-05)

### DL-040 — Pattern generalization vs sector / industry composition
- DL-039 froze cross-sectional selection against size/liquidity/listing-age/survivorship bias.
- DL-040 freezes the next confound: a Pattern result may look broad across many stocks while actually being concentrated in one sector, one industry cycle or one sector-wide momentum episode.
- External evidence motivates this firewall:
  Moskowitz/Grinblatt show industry momentum explains a substantial share of individual-stock momentum;
  Hou/Robinson show industry concentration is related to average returns after standard controls;
  later evidence shows industry-classification granularity itself can affect measured industry-return relations;
  Taiwan technical-rule evidence shows technical profitability varies across firm/state context.
- Ownership boundary:
  D09 owns industry/sector classification, sector return/RS, breadth, leadership, concentration and rotation;
  D10 owns supply-chain / physical-cycle / issuer-exposure transmission.
  D01 consumes D09 receipts and does not build a second taxonomy/sector score or alter the Formal sector gate.
- Every classification receipt must preserve:
  sectorTaxonomyId;
  classificationLevel;
  classificationVersion;
  effective dating where available;
  knownAt/capturedAt;
  classificationState.
- Current classifications may not be backfilled historically without owner-certified effective membership.
- Classification level must be frozen before outcomes.
  Trying several sector/industry taxonomies and reporting the favorable one is prohibited.
- Pattern prevalence and Pattern incrementality are distinct:
  PATTERN_PREVALENCE_BY_SECTOR asks where the detector emits structures;
  PATTERN_INCREMENT_WITHIN_SECTOR asks whether Pattern adds representation beyond comparable sector context.
- Sector composition denominator must retain:
  target eligible;
  detector evaluable;
  structure emitted;
  opportunity ready;
  no structure;
  blocked;
  unclassified counts by sector.
- Descriptive concentration fields include:
  uniqueSectorCount;
  opportunitiesBySector;
  top1/top3 sector opportunity share;
  sector opportunity HHI;
  unclassifiedShare.
  No concentration threshold is frozen in D01.
- Candidate self-inclusion firewall:
  candidate price can mechanically improve sector return, breadth, above-MA, new-high share, leadership and RS.
  Pattern controls should therefore prefer candidate leave-one-out D09 receipts where available.
- If excluding the candidate leaves no valid peers:
  LOO_SECTOR_CONTEXT_UNAVAILABLE.
  Do not substitute zero, self-included sector value or market value without an explicit design.
- SDA-001 implication:
  candidate Pattern and self-included sector confirmation share the candidate PRICE_OHLC and are not independent votes.
  Leave-one-out reduces direct self-inclusion but still leaves sector context as a control/context family, not automatic independent alpha.
- Existing Formal sector-strength gate remains unchanged; DL-040 does not change thresholds/weights or add a second gate.
- Future D16 comparison ladder:
  S0 RAW_PATTERN_COHORT;
  S1 SECTOR_COMPOSITION_MATCHED;
  S2 LOO_SECTOR_CONTEXT_CONTROLLED;
  S3 WITHIN_SECTOR_INCREMENT;
  S4 CROSS_SECTOR_REPLICATION.
- Future interpretation states:
  C0 SECTOR_COMPOSITION_EXPLANATION;
  C1 SECTOR_MOMENTUM_EXPLANATION;
  C2 SECTOR_BREADTH_EXPLANATION;
  C3 WITHIN_SECTOR_PATTERN_INCREMENT;
  C4 SECTOR_SPECIFIC_PATTERN;
  C5 CROSS_SECTOR_PATTERN_CANDIDATE;
  C6 NOT_EVALUABLE.
- A one-sector effect is not automatically a failure, but its claim scope is SECTOR_SPECIFIC rather than generic Pattern evidence.
- Cross-sector common support must include:
  DL-039 size/liquidity/listing age;
  price/tick tier;
  market;
  regime;
  detector history readiness;
  opportunity geometry;
  sector return/breadth context.
  Lack of overlap -> CROSS_SECTOR_EXTRAPOLATION_PROHIBITED.
- Sector-date dependence is explicit:
  ten Pattern stocks in one semiconductor rally are not ten independent sector replications.
  Future D16 reports stock N, root N, symbol N, sector N, sector-date cluster N and market-date cluster N separately.
- UNCLASSIFIED_UNKNOWN stays visible.
  Do not silently drop it, backfill it from future classification or treat generic OTHER as a coherent economic sector.
- Diversified-company sector code is taxonomy context only.
  If economic exposure matters, D10 issuer/supply-chain mapping is a separate owner dependency.
- New files:
  - research/PATTERN_SECTOR_COMPOSITION_V0_1.md
  - research/pattern_sector_composition_v0_1.json
  - research/pattern_sector_composition_v0_1.mjs
  - research/test_pattern_sector_composition_v0_1.mjs
  - research/PATTERN_SECTOR_COMPOSITION_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-040

1. Reconcile the DL-040 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-040 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve Pattern prevalence and Pattern incrementality as separate questions.
4. Consume D09 point-in-time classification / breadth / rotation receipts and candidate leave-one-out controls without recreating D09 taxonomies.
5. Keep stock/root/symbol/sector/sector-date/market-date replication counts separate.
6. Hand S0-S4 / C0-C6 sector-matched common-support inference to D16.
7. Preserve SDA-001 as REMEDIATION_IN_PROGRESS until residual evidence, system lineage and independent 00 closure exist.
8. Next D01 science: separate sector composition from market-wide common shocks / beta so cross-sector replication in one market surge is not mistaken for independent Pattern evidence.
9. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-041 (2026-10-05)

### DL-041 — Pattern generalization vs market-wide common shocks / beta
- DL-040 separated Pattern generalization from sector / industry composition.
- DL-041 freezes the next confound: many sectors can appear to replicate Pattern on the same dates because the whole Taiwan market moved together, selected names share similar market beta, or one common shock drove both Pattern state and response.
- External evidence strengthens this firewall:
  Taiwan cross-sectional work finds beta can remain conditionally related to stock returns;
  Taiwan dynamic-beta evidence shows systematic risk is state-dependent rather than a fixed constant;
  Taiwan latent-factor evidence reports a large aggregate component in stock-return fluctuation;
  crisis-shock research shows common shocks can dominate equity-return behavior during stress periods.
- Ownership boundary:
  D19 owns benchmark construction, beta, benchmark residual and factor-exposure semantics;
  D18 owns market-regime/common-state semantics;
  D13 owns global/cross-market shocks;
  D09 owns sector context;
  D01 only owns Pattern state and the claim-scope firewall.
- Every market/beta receipt is PIT-bound and must preserve:
  benchmarkId/version/knownAt;
  betaModelId/version;
  betaEstimate;
  betaEstimateKnownAt;
  estimation window;
  observation count;
  candidate benchmark inclusion;
  ex-candidate state where owner-supported.
- Current beta may not backfill historical predictor snapshots.
  UNKNOWN beta stays UNKNOWN; no beta=1 or beta=0 imputation.
- Beta is systematic exposure context, not Pattern alpha and not a score/bonus/penalty.
- Beta/benchmark policy must be frozen before outcomes.
  Outcome-selected beta model/window/benchmark is prohibited.
- Market-date dependence is now explicit:
  stockObservationN;
  uniqueSymbolN;
  structuralRootN;
  uniqueSectorN;
  sectorDateClusterN;
  marketDateClusterN;
  commonShockClusterN.
  Many sectors on one date do not create independent market-date replication.
- Cross-sector replication and cross-market-date replication are different dimensions.
  DL-040 C5 CROSS_SECTOR_PATTERN_CANDIDATE must still pass DL-041 market/common-shock controls.
- Candidate self-inclusion is a first-class issue:
  candidate Pattern plus a benchmark containing the candidate mechanically reuses the same stock price.
  Prefer D19 ex-candidate market context where supported.
  Otherwise mark SELF_INCLUSION_UNRESOLVED.
  Even ex-candidate context remains control/context rather than an extra alpha vote.
- No D01-local market-shock threshold is defined.
  Owner-defined D18/D13 common-shock/regime state is consumed when available; otherwise UNKNOWN stays explicit.
- Beta concentration is part of common support.
  If Pattern cases and controls occupy disjoint beta regions -> MARKET_BETA_EXTRAPOLATION_PROHIBITED.
- Future comparison ladder:
  M0 RAW_CROSS_SECTOR_PATTERN;
  M1 MARKET_DATE_MATCHED;
  M2 EX_CANDIDATE_MARKET_CONTEXT;
  M3 BETA_MARKET_RESIDUAL_CONTROLLED;
  M4 SECTOR_PLUS_MARKET_RESIDUAL;
  M5 CROSS_MARKET_DATE_RESIDUAL_REPLICATION.
- Future interpretation:
  R0 MARKET_COMMON_SHOCK_EXPLANATION;
  R1 BETA_EXPOSURE_EXPLANATION;
  R2 MARKET_REGIME_EXPLANATION;
  R3 SECTOR_PLUS_MARKET_EXPLANATION;
  R4 RESIDUAL_PATTERN_INCREMENT;
  R5 CROSS_MARKET_DATE_RESIDUAL_CANDIDATE;
  R6 MODEL_SENSITIVE;
  R7 NOT_EVALUABLE.
- Common-shock/crisis dates are not silently removed.
  Future D16 may run full-sample, shock-excluded sensitivity, leave-one-market-date-out and regime-stratified analysis under preregistration.
- SDA-001 remains REMEDIATION_IN_PROGRESS:
  Pattern, market and sector contexts are correlated price-derived information families; direct candidate self-inclusion is especially non-independent.
- New files:
  - research/PATTERN_MARKET_COMMON_SHOCK_BETA_V0_1.md
  - research/pattern_market_common_shock_beta_v0_1.json
  - research/pattern_market_common_shock_beta_v0_1.mjs
  - research/test_pattern_market_common_shock_beta_v0_1.mjs
  - research/PATTERN_MARKET_COMMON_SHOCK_BETA_D16_HANDOFF_V0_1.md
- 22 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-041

1. Reconcile the DL-041 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-041 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve cross-sector and cross-market-date replication counts separately.
4. Consume D19 benchmark/beta, D18 market regime, D13 global-shock and D09 sector receipts without recreating owner models.
5. Preserve candidate-included versus ex-candidate market context and beta common-support states explicitly.
6. Hand M0-M5 / R0-R7 dependence-aware residual inference to D16.
7. Preserve SDA-001 as REMEDIATION_IN_PROGRESS until residual evidence, system lineage and independent 00 closure exist.
8. Next D01 science: separate market-wide common shocks from event-day clustering / scheduled-information days so one CPI/FOMC/earnings-season shock cluster is not mislabeled as independent Pattern replication.
9. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-042 (2026-10-05)

### DL-042 — Pattern generalization vs event-day / scheduled-information clustering
- DL-041 separated Pattern from market-wide common shocks and beta exposure.
- DL-042 freezes the next dependence layer: many stocks, sectors or market dates can still be one information event or one event family.
- External evidence makes the event firewall material:
  scheduled FOMC meetings can create broad equity return drift across industries and international markets;
  macro-announcement days can concentrate a large share of market risk premium and alter beta-return relations;
  earnings-announcement dates have distinct return/volume behavior;
  macro and firm-level news can interact in information processing.
- Ownership boundary:
  D08 owns event/news and issuer-event risk semantics;
  D13 owns macro schedule / release / consensus / surprise clocks;
  D17/disclosure-clock owners remain authoritative for issuer publication timestamps where applicable;
  D16 owns economic inference.
  D01 consumes owner receipts and does not rebuild calendars or surprise models.
- Four clocks are kept separate:
  SCHEDULE_CLOCK;
  RELEASE_CLOCK;
  SURPRISE_CLOCK;
  MARKET_REACTION_CLOCK.
  No later clock may be attached to an earlier predictor snapshot.
- Decision-relative event states:
  E0 NO_KNOWN_EVENT;
  E1 SCHEDULED_PENDING;
  E2 REALIZED_PRE_FREEZE;
  E3 UNSCHEDULED_DISCLOSED_PRE_FREEZE;
  E4 EVENT_AFTER_FREEZE_FUTURE;
  E5 EVENT_CONTEXT_UNKNOWN.
- NO_KNOWN_EVENT is never an absolute claim that no event can occur.
- Three event identities are preserved:
  EVENT_FAMILY;
  EVENT_INSTANCE;
  COMMON_EVENT_CLUSTER.
  Many stock rows attached to one event instance are one event dependence family.
- Market-date count is not event-instance count.
  One event can span pre-event, overnight and post-event Taiwan dates without becoming several independent events.
- Multiple FOMC meetings are multiple event instances but one event family.
  Family-level replication and instance-level replication remain separate.
- Scheduled event presence carries timing information only.
  Realized release, surprise and sign are unavailable until their release clocks are valid.
- Current event calendars cannot backfill historical first-known schedules without archived/captured vintage receipts.
- Earnings season is not one common event by default.
  Issuer events remain separate instances unless an owner-certified common-event relation exists.
- Event-cluster denominator reports:
  stockObservationN;
  uniqueSymbolN;
  structuralRootN;
  marketDateClusterN;
  eventInstanceClusterN;
  eventFamilyN;
  commonEventClusterN;
  nonEventMarketDateN;
  unknownEventContextN.
- Outcome-selected event deletion is prohibited.
  Allowed sensitivity designs must be preregistered:
  full sample;
  event-stratified;
  owner-defined event-family exclusion;
  leave-one-event-instance-out;
  leave-one-event-family-out;
  non-event-date replication.
- Future comparison ladder:
  A0 RAW_MARKET_RESIDUAL_PATTERN;
  A1 EVENT_STATE_STRATIFIED;
  A2 EVENT_INSTANCE_CLUSTERED;
  A3 EVENT_FAMILY_CLUSTERED;
  A4 NON_EVENT_DATE_RESIDUAL;
  A5 CROSS_EVENT_FAMILY_REPLICATION;
  A6 EVENT_AND_NON_EVENT_REPLICATION.
- Future interpretation:
  C0 ANNOUNCEMENT_DAY_EXPLANATION;
  C1 PRE_EVENT_DRIFT_EXPLANATION;
  C2 EVENT_FAMILY_SPECIFIC;
  C3 EVENT_INSTANCE_DEPENDENCE;
  C4 NON_EVENT_RESIDUAL_PATTERN;
  C5 CROSS_EVENT_RESIDUAL_PATTERN;
  C6 EVENT_AND_NON_EVENT_PATTERN_CANDIDATE;
  C7 NOT_EVALUABLE.
- Event vs non-event inference requires common support in:
  size/liquidity;
  sector;
  beta/market regime;
  opportunity geometry;
  pre-event volatility;
  tradability.
  Failure -> EVENT_CONTEXT_EXTRAPOLATION_PROHIBITED.
- Macro events and issuer events remain separate families.
  Common-event mapping must come from owner evidence, not D01 narrative.
- Event schedule/disclosure can be a distinct information source from PRICE_OHLC, but event-driven price reactions remain price-derived and are not automatic extra votes.
- New files:
  - research/PATTERN_EVENT_DAY_CLUSTERING_V0_1.md
  - research/pattern_event_day_clustering_v0_1.json
  - research/pattern_event_day_clustering_v0_1.mjs
  - research/test_pattern_event_day_clustering_v0_1.mjs
  - research/PATTERN_EVENT_DAY_CLUSTERING_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-042

1. Reconcile the DL-042 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-042 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve event family / event instance / common-event cluster / market-date counts separately.
4. Preserve schedule / release / surprise / market-reaction clocks separately; no realized surprise before its release.
5. Consume D08/D13/D17 owner receipts without reconstructing event calendars in D01.
6. Hand A0-A6 / C0-C7 event-cluster dependence inference to D16.
7. Next D01 science: separate calendar/event clustering from overnight-gap/opening-auction mechanics so a Pattern result driven only by gap-to-open behavior is not mislabeled as continuous-session structure.
8. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-043 (2026-10-05)

### DL-043 — Overnight gap / opening auction / continuous-session separation
- DL-042 separated Pattern from event-day / scheduled-information clustering.
- DL-043 freezes the next mechanism firewall: daily Pattern behavior may be generated by the overnight interval, opening call auction, immediate post-open price discovery or later continuous trading.
- Current TWSE public material confirms call auction at the market open and continuous trading afterward; Taiwan evidence also finds overnight and intraday return components can behave differently.
- Four path/session components are therefore separated:
  OVERNIGHT_GAP_COMPONENT;
  OPEN_AUCTION_COMPONENT;
  IMMEDIATE_POST_OPEN_COMPONENT;
  LATER_CONTINUOUS_COMPONENT.
- A daily OHLC candle is not allowed to identify which mechanism generated the observed response.
- Reuse DL-006C gap distinctions:
  overnight open gap;
  non-overlap range gap;
  technical-continuity gap.
  These remain separate.
- D04/D05 remain authoritative session-mechanism owners.
  D01 consumes OPEN_CALL_AUCTION / IMMEDIATE_POST_OPEN / CONTINUOUS / VI / closing / UNKNOWN states and does not invent a duplicate taxonomy.
- Opening-auction print is not treated as an ordinary continuous-trading print.
- A prior close on one side of a frozen boundary and opening print on the other side is OPENING_GAP_CROSS, not CONTINUOUS_CROSS.
- Opening within the zone is AUCTION_AT_BOUNDARY.
- Constrained gap/auction crosses remain CONSTRAINED_OPENING_CROSS.
- UNKNOWN session state never defaults to continuous trading.
- Important execution/path firewall:
  close 100 -> next open 106 does not imply prices 101..105 were continuously tradable.
- Session windows must be preregistered.
  Outcome-tuned switching among first 1m/5m/15m or later-start definitions is prohibited.
- Predictor-clock firewall:
  pre-open predictor cannot use current open;
  at-open predictor cannot use later first-15m path;
  first-15m predictor cannot use later continuous path.
- DL-042 event state remains orthogonal:
  one overnight event may create an opening gap, but event instance != auction mechanism.
- Future D16 ladder:
  T0 RAW_DAILY_PATTERN;
  T1 OVERNIGHT_INTRADAY_DECOMPOSED;
  T2 OPEN_AUCTION_SEPARATED;
  T3 IMMEDIATE_POST_OPEN_SEPARATED;
  T4 LATER_CONTINUOUS_ONLY;
  T5 NON_GAP_CONTINUOUS_CROSS_ONLY;
  T6 SESSION_ROBUST_REPLICATION.
- Future interpretations:
  M0 OVERNIGHT_GAP_EXPLANATION;
  M1 OPEN_AUCTION_EXPLANATION;
  M2 IMMEDIATE_POST_OPEN_EXPLANATION;
  M3 CONTINUOUS_SESSION_RESIDUAL;
  M4 GAP_CROSS_ONLY;
  M5 NON_GAP_CONTINUOUS_PATTERN_CANDIDATE;
  M6 SESSION_ROBUST_PATTERN_CANDIDATE;
  M7 NOT_EVALUABLE.
- Session-specific denominators must preserve evaluable / blocked / constrained / unknown states instead of using only full-session-complete rows.
- All price-path session components remain one PRICE_OHLC information family by default.
  Decomposition does not create four independent votes.
- New files:
  - research/PATTERN_SESSION_GAP_AUCTION_V0_1.md
  - research/pattern_session_gap_auction_v0_1.json
  - research/pattern_session_gap_auction_v0_1.mjs
  - research/test_pattern_session_gap_auction_v0_1.mjs
  - research/PATTERN_SESSION_GAP_AUCTION_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-043

1. Reconcile the DL-043 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-043 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve overnight / opening-auction / immediate-post-open / later-continuous components separately.
4. Consume D04/D05 session receipts and D08/D13 event receipts rather than rebuilding those taxonomies in D01.
5. Keep opening-gap cross distinct from continuously traded boundary crossing.
6. Hand T0-T6 / M0-M7 session-mechanism inference to D16.
7. Next D01 science: separate opening-gap mechanics from prior-close / reference-price anchoring so apparent support/resistance around prior close is not confused with overnight reversal mechanics.
8. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-044 (2026-10-05)

### DL-044 — Structural boundary vs prior-close / auction-reference price anchors
- DL-043 separated overnight gap, opening auction and continuous-session mechanisms.
- DL-044 freezes the next reference-price confound: apparent support/resistance around the open can coincide with the prior close or official auction reference price, and a move back toward those references may reflect overnight reversal / gap normalization rather than structural memory.
- Three price objects are kept separate:
  PRIOR_CLOSE_REFERENCE;
  AUCTION_REFERENCE_PRICE;
  STRUCTURAL_BOUNDARY.
- Prior close is not a universal substitute for the official auction reference price.
  Special sessions may use mechanically adjusted reference semantics.
- D01 consumes official / owner-certified auctionReferencePrice, source, ruleVersion, knownAt and specialReferenceState rather than reconstructing the reference from prior close.
- Behavioral firewall:
  D01 may store REFERENCE_PRICE_PROXIMITY / REFERENCE_PRICE_COINCIDENCE;
  OHLC alone does not identify anchoring bias, trapped-investor intent, breakeven motive or psychological magnet.
  D20 owns behavior-specific identification.
- Reference coincidence descriptors remain continuous:
  prior-close distance in price / ATR / ticks;
  auction-reference distance in price / ATR / ticks.
  No arbitrary near/far threshold is frozen.
- Frozen coincidence states:
  STRUCTURE_DISTINCT_FROM_REFERENCES;
  PRIOR_CLOSE_INSIDE_STRUCTURE;
  AUCTION_REFERENCE_INSIDE_STRUCTURE;
  BOTH_REFERENCES_INSIDE_STRUCTURE;
  REFERENCE_CONTEXT_UNKNOWN.
- Numerical equality does not merge causal identity.
  priorClose == auctionReferencePrice == structural level may still represent distinct reference/mechanism objects.
- Corporate-action / special-reference firewall:
  raw prior close may be non-comparable;
  auction reference may be mechanically reset;
  missing official reference on special sessions -> DATA_BLOCKED, not prior-close fallback.
- Gap fill / same-day reversal remains an outcome / post-open path.
  It cannot enter a pre-open or at-open predictor snapshot.
- If a structural root overlaps prior close or official reference, do not discard it.
  Future D16 must ask whether the structural root adds representation beyond the simple reference-price baseline.
- Reference coincidence creates no extra independent vote.
  Default effectiveIndependentEvidenceCount remains 1.
- Future D16 comparison ladder:
  P0 RAW_STRUCTURAL_RESPONSE;
  P1 PRIOR_CLOSE_CONTEXT_CONTROLLED;
  P2 AUCTION_REFERENCE_CONTEXT_CONTROLLED;
  P3 OVERNIGHT_GAP_CONTEXT_CONTROLLED;
  P4 MARKET_SECTOR_GAP_CONTROLLED;
  P5 REFERENCE_DISTINCT_STRUCTURE_ONLY;
  P6 REFERENCE_ROBUST_PATTERN_REPLICATION.
- Future interpretations:
  C0 PRIOR_CLOSE_REFERENCE_EXPLANATION;
  C1 AUCTION_REFERENCE_MECHANICS_EXPLANATION;
  C2 OVERNIGHT_REVERSAL_EXPLANATION;
  C3 COMMON_GAP_NORMALIZATION_EXPLANATION;
  C4 STRUCTURAL_RESIDUAL_AROUND_REFERENCE;
  C5 STRUCTURE_DISTINCT_FROM_REFERENCE_CANDIDATE;
  C6 REFERENCE_ROBUST_PATTERN_CANDIDATE;
  C7 NOT_EVALUABLE.
- Common support must include overnight gap, reference distance, auction mechanism, volatility/liquidity, limits, event context, market/sector gap and regime.
- Outcome-selected reference families are prohibited.
  DL-044 v0.1 freezes only prior close + official auction reference.
- New files:
  - research/PATTERN_REFERENCE_PRICE_ANCHOR_V0_1.md
  - research/pattern_reference_price_anchor_v0_1.json
  - research/pattern_reference_price_anchor_v0_1.mjs
  - research/test_pattern_reference_price_anchor_v0_1.mjs
  - research/PATTERN_REFERENCE_PRICE_ANCHOR_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS.
- SDA-002 remains REMEDIATION_IN_PROGRESS.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-044

1. Reconcile the DL-044 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-044 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve prior close and official auction reference as distinct causal/reference objects even when numerically equal.
4. Preserve special-session reference UNKNOWN / DATA_BLOCKED states and prohibit unverified prior-close fallback.
5. Hand P0-P6 / C0-C7 reference-context incrementality inference to D16.
6. Keep behavioral anchoring UNIDENTIFIED unless D20 provides behavior-specific observables.
7. Next D01 science: separate prior-close/reference effects from round-number / tick-grid salience so apparent support near 100 / 200 / 500 is not mislabeled structural memory.
8. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-045 (2026-10-05)

### DL-045 — Structural memory vs round-number / tick-grid salience
- DL-044 separated structural boundaries from prior-close and auction-reference effects.
- DL-045 freezes the next salience confound: apparent support/resistance may arise from round-number order clustering, legal tick-grid mechanics or tick-band transitions rather than historical structural memory.
- Taiwan evidence documents order-price clustering at integer / even / preferred terminal prices; broader microstructure evidence shows clustered limit orders can create price barriers.
- D01 does not infer psychology from price clustering.
  ROUND_PRICE_CLUSTERING_CONTEXT is observable context;
  PSYCHOLOGICAL_ANCHOR_CONFIRMED remains prohibited without D20 behavior-specific evidence.
- D04/D05 remain authoritative for point-in-time tick size, tick band, session mechanics and order-book interpretation.
  D01 consumes tickSize, tickBandId, tickRuleVersion, tickKnownAt and transition receipts instead of hard-coding permanent exchange mechanics.
- Four distinct objects are kept separate:
  LEGAL_TICK_GRID;
  TICK_BAND_TRANSITION;
  ROUND_NUMBER_REFERENCE;
  STRUCTURAL_BOUNDARY.
- Round-grid families must be preregistered before outcomes.
  Testing multiple nominal grids creates one multiple-testing family.
  Best-grid selection after outcomes is prohibited.
- Continuous salience descriptors are frozen:
  boundary/center distance to nearest registered round reference in price/ticks;
  distance to tick-band transition;
  relative tick;
  price/tick tier.
  No universal near-round threshold is defined.
- Current and formation tick receipts remain separate.
  Current tick-band state may not be backfilled into historical structural formation.
- Comparator logic:
  R0 ROUND_SALIENT_NONSTRUCTURAL;
  R1 STRUCTURAL_NONROUND;
  R2 STRUCTURAL_ROUND_COINCIDENT.
  Future D16 asks structural increment beyond salience and salience increment beyond structure.
- Daily OHLC can establish round-price proximity but cannot prove actual displayed order clustering, hidden liquidity or queue behavior.
  ORDER_CLUSTERING_MECHANISM remains PLAUSIBLE_NOT_OBSERVED without D05 book evidence.
- DL-043 / DL-044 contexts remain required because a single price can simultaneously be round, near prior close, near auction reference, crossed at the open and inside a structural zone.
  Those co-located descriptions are not independent confirmations.
- SDA-001 anti-double-count default:
  informationRoot = PRICE_OHLC;
  redundancyGroup = D01_ROUND_TICK_REFERENCE_CONTEXT;
  rawRepresentationCount may exceed 1;
  effectiveIndependentEvidenceCount = 1;
  independentVoteAllowed = false;
  residualIncrementalityStatus = NOT_VALIDATED.
- Future D16 ladder:
  G0 RAW_STRUCTURAL_PATTERN;
  G1 ROUND_REFERENCE_CONTEXT_CONTROLLED;
  G2 TICK_BAND_CONTEXT_CONTROLLED;
  G3 PRIOR_CLOSE_AUCTION_REFERENCE_CONTROLLED;
  G4 MICROSTRUCTURE_CONTEXT_CONTROLLED;
  G5 STRUCTURAL_NONROUND_REPLICATION;
  G6 STRUCTURAL_VS_ROUND_NEGATIVE_CONTROL;
  G7 ROUND_TICK_ROBUST_REPLICATION.
- Future interpretations:
  C0 ROUND_NUMBER_EXPLANATION;
  C1 TICK_GRID_MECHANICS_EXPLANATION;
  C2 REFERENCE_PRICE_COMPOSITE_EXPLANATION;
  C3 MICROSTRUCTURE_CLUSTERING_EXPLANATION;
  C4 STRUCTURAL_RESIDUAL_AFTER_SALIENCE;
  C5 NONROUND_STRUCTURAL_CANDIDATE;
  C6 ROUND_AND_STRUCTURE_INCREMENTAL_CANDIDATE;
  C7 NOT_EVALUABLE.
- New files:
  - research/PATTERN_ROUND_TICK_SALIENCE_V0_1.md
  - research/pattern_round_tick_salience_v0_1.json
  - research/pattern_round_tick_salience_v0_1.mjs
  - research/test_pattern_round_tick_salience_v0_1.mjs
  - research/PATTERN_ROUND_TICK_SALIENCE_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-045

1. Reconcile the DL-045 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-045 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve point-in-time tick receipts and preregistered round-grid families; never outcome-select a preferred nominal grid.
4. Preserve structural, round, prior-close and auction-reference contexts as one deduplicated price-information family by default.
5. Hand G0-G7 / C0-C7 round/tick salience incrementality inference to D16.
6. Preserve SDA-001 as REMEDIATION_IN_PROGRESS until residual/system/00 closure evidence exists.
7. Next D01 science: separate round/tick salience from volume-at-price / historical traded-volume concentration so a price level with heavy historical volume is not automatically treated as independent structural evidence.
8. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-046 (2026-10-06)

### DL-046 — Structural memory vs volume-at-price / historical traded-volume concentration
- DL-045 separated structural memory from round-number / tick-grid salience.
- DL-046 freezes the next candidate explanation: a price region may appear important because large historical executed volume accumulated there, not because a structural turning-point memory exists.
- Direct high-quality evidence for conventional volume-profile nodes as stable independent SR alpha is limited relative to general SR, round-price clustering and microstructure evidence.
- Therefore D01 classifies volume-at-price as HISTORICAL_TRADING_DENSITY_CONTEXT, not proven structural memory, current liquidity or independent alpha.
- D02-12 is the canonical owner of PRICE_BY_VOLUME_PROFILE semantics.
- Current D02 contract allows current-day / prospective capture, but historical OOS replay from the current source is not established.
- Historical price-by-volume may never be synthesized from OHLCV candles and relabeled as historical Shadow.
- Core information roots:
  PRICE_OHLC;
  TRADED_VOLUME.
- representationFamily = D02_PRICE_BY_VOLUME_PROFILE_CONTEXT.
- redundancyGroup = D01_D02_PRICE_VOLUME_LEVEL_CONTEXT.
- effectiveIndependentEvidenceCount = 1 by default;
  independentVoteAllowed = false;
  residualIncrementalityStatus = NOT_VALIDATED.
- Executed historical volume is not current standing liquidity.
  It does not identify current bid/ask depth, queue, hidden liquidity or willingness to defend.
  D05 remains the live order-book owner.
- Executed historical volume is not remaining investor inventory.
  Shares can turn over repeatedly, ownership changes, and total executed volume may exceed float.
  Trapped-holder / cost-basis interpretation remains UNIDENTIFIED without separate observables.
- Every profile receipt must store:
  sourceFetchedAt;
  profileAsOf;
  predictorFreezeAt;
  profile window;
  source/version;
  session/market type;
  price bins;
  bin-construction rule;
  tick provenance;
  coverage state;
  replaySafe.
- sourceFetchedAt/profileAsOf/profileWindowEnd > predictorFreezeAt => POST_HOC_NOT_ELIGIBLE.
- Bin construction cannot be tuned after outcomes.
  No post-outcome choice of bin width, tick grouping, kernel bandwidth, node merging or number of bins.
- Point-in-time tick semantics consume DL-045 / D04-D05 owner receipts.
- Frozen continuous descriptors:
  zoneExecutedVolume;
  zoneVolumeShare;
  maxVolumePrices;
  maxNodeTieCount;
  maxNodeVolumeShare;
  structuralCenterDistanceToNearestMaxNodePrice;
  distance in ticks / ATR where legal;
  structuralZoneContainsAnyMaxNode;
  distinctPriceLevelCount.
- Tied max-volume nodes are all retained; one convenient node may not be selected after the fact.
- No universal high-volume-node threshold / 70% value area / top-decile threshold is frozen.
- Volume concentration has a time-at-price confound:
  more time spent at a price can mechanically generate more executed volume.
  Without dwell-time control, volume-density mechanism is only PARTIALLY_IDENTIFIED.
- DL-044 prior-close / auction-reference and DL-045 round/tick contexts remain mandatory because a single price may be simultaneously structural, round, reference-anchored and high-volume.
- Future comparison classes:
  V0 STRUCTURAL_ONLY;
  V1 VOLUME_NODE_NONSTRUCTURAL;
  V2 STRUCTURE_VOLUME_COINCIDENT;
  V3 ROUND_REFERENCE_VOLUME_NODE;
  V4 PROFILE_NOT_EVALUABLE.
- Future D16 questions:
  structural increment beyond profile concentration;
  profile increment beyond structural history;
  V2 increment after D02 participation/turnover and DL-044/DL-045 controls;
  time-at-price / liquidity / event-flow explanation;
  profile value beyond simpler D02 volume variables;
  residual contribution without creating a second vote.
- Prospective-only evidence lane is mandatory until D02 supplies genuinely replayable profile evidence.
- D02 provider caveat is preserved:
  bid/ask classified volume may not sum to total because opening first trade is excluded from inside/outside classification.
  V0.1 therefore uses total executed volume by price and defers directional bid/ask profile interpretation.
- New files:
  - research/PATTERN_VOLUME_AT_PRICE_CONTEXT_V0_1.md
  - research/pattern_volume_at_price_context_v0_1.json
  - research/pattern_volume_at_price_context_v0_1.mjs
  - research/test_pattern_volume_at_price_context_v0_1.mjs
  - research/PATTERN_VOLUME_AT_PRICE_CONTEXT_D16_HANDOFF_V0_1.md
- 22 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS.
- SDA-002 remains REMEDIATION_IN_PROGRESS.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-046

1. Reconcile the DL-046 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-046 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Keep PRICE_BY_VOLUME_PROFILE under D02 ownership and prohibit OHLCV synthetic historical reconstruction.
4. Keep structural / volume-profile / round / prior-close / auction-reference contexts deduplicated by default; no automatic second vote.
5. Hand V0-V4 / Q1-Q6 prospective common-support and residual inference to D16.
6. Keep historical price-by-volume outcome inference CLOSED until D02 provides prospective or genuinely replayable profile evidence.
7. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS until canonical closure evidence exists.
8. Next D01 science: separate volume-at-price concentration from anchored VWAP / volume-weighted cost-reference effects and from actual live order-book liquidity.
9. No runtime wiring / no Formal change.


## Continuation update — DL-047 (2026-10-06)

### DL-047 — Structural memory vs anchored VWAP / cost-reference and live order-book liquidity
- DL-046 separated structural memory from historical volume-at-price concentration.
- DL-047 separates three distinct objects:
  historical executed-volume concentration;
  transaction-weighted VWAP / anchored-VWAP reference;
  current displayed order-book liquidity.
- Academic VWAP literature is primarily execution-benchmark / transaction-weighted-reference literature; it does not establish remaining-holder cost basis or structural support/resistance.
- TWSE best-five data represent current unexecuted displayed bid/ask quotes, not historical traded-volume inventory.
- D02 remains owner of session-average/VWAP-style context and PRICE_BY_VOLUME_PROFILE.
- D05 remains owner of live spread/depth/order-book microstructure.
- Provider avgPrice remains PROVIDER_AVERAGE_PRICE_PROXY unless exact VWAP construction is independently verified.
- Frozen reference family:
  W0 SESSION_AVERAGE_PRICE_PROXY;
  W1 EXACT_SESSION_VWAP;
  W2 ANCHORED_VWAP_CANDIDATE.
- Exact/anchored VWAP requires complete causal trade/value coverage and legal as-of timing.
- Exact historical anchored VWAP reconstructed from OHLCV, typical price or close*volume is prohibited.
- Anchor lineage is mandatory:
  SESSION_MECHANIC_ANCHOR;
  EXTERNAL_EVENT_ANCHOR;
  D01_STRUCTURAL_EVENT_ANCHOR;
  MANUAL_PREDECLARED_ANCHOR.
  OUTCOME_SELECTED_ANCHOR is prohibited.
- A D01-structural anchor is partially generated by the same PRICE_OHLC state being tested. It is therefore not an independent confirmation by default.
- VWAP is not remaining-holder cost basis. Repeated turnover and changing ownership make trapped-holder / shareholder-average-cost / remaining-inventory interpretations unidentified without separate observables.
- VOLUME_PROFILE != VWAP_REFERENCE:
  profile = executed-volume distribution across price;
  VWAP = transaction-weighted first moment over a time window.
- Historical traded volume != current standing liquidity.
- Displayed bid/ask depth may cancel/amend/execute and public best-five is partial depth; displayed walls are not certified structural support/resistance.
- Live-book receipts require snapshot/fetch clock, predictor freeze, freshness, session mechanism and coverage.
- Three clocks remain separate:
  TRADE_FLOW_CLOCK;
  ANCHOR_CLOCK;
  BOOK_CLOCK.
- Frozen context classes:
  C0 STRUCTURAL_ONLY;
  C1 VWAP_REFERENCE_NONSTRUCTURAL;
  C2 STRUCTURE_VWAP_COINCIDENT;
  C3 STRUCTURE_PROFILE_VWAP_COINCIDENT;
  C4 STRUCTURE_BOOK_COINCIDENT;
  C5 STRUCTURE_VWAP_BOOK_COINCIDENT;
  C6 CONTEXT_NOT_EVALUABLE.
- Possible raw roots include PRICE_OHLC, TRADED_VOLUME, LIVE_ORDER_BOOK and EVENT_CLOCK.
- Even with multiple raw roots, effectiveIndependentEvidenceCount remains 1 and independentVoteAllowed=false by default until D16 residual incrementality is validated.
- Anchor selection is a multiple-testing family; best-anchor selection after outcomes is prohibited.
- Future D16 ladder:
  L0 structural baseline;
  L1 + session/exact VWAP;
  L2 + anchored VWAP;
  L3 + volume profile;
  L4 + fresh live-book context;
  L5 + dedup/common-support/residual testing.
- New files:
  - research/PATTERN_ANCHORED_VWAP_LIVE_LIQUIDITY_V0_1.md
  - research/pattern_anchored_vwap_live_liquidity_v0_1.json
  - research/pattern_anchored_vwap_live_liquidity_v0_1.mjs
  - research/test_pattern_anchored_vwap_live_liquidity_clock_v0_1.mjs
  - research/test_pattern_anchored_vwap_live_liquidity_lineage_v0_1.mjs
  - research/PATTERN_ANCHORED_VWAP_LIVE_LIQUIDITY_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains REMEDIATION_IN_PROGRESS.
- SDA-002 remains REMEDIATION_IN_PROGRESS.
- No outcome join; no historical synthetic backfill; no runtime wiring.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-047

1. Reconcile the DL-047 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat standard CI only as Formal-isolation evidence; DL-047 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Keep provider average proxy, exact VWAP, anchored VWAP, price-by-volume profile and live-book state semantically distinct.
4. Preserve trade-flow, anchor and book clocks independently.
5. Keep structural-anchor VWAP dependent by default and effectiveIndependentEvidenceCount=1 until D16 residual evidence exists.
6. Hand L0-L5 / Q1-Q7 residual/common-support inference to D16.
7. Keep SDA-001/SDA-002 REMEDIATION_IN_PROGRESS until canonical closure evidence exists.
8. Next D01 science: separate transaction-weighted reference effects from time-at-price / dwell-time reference effects and from explicit participant-inventory data.
9. No runtime wiring / no Formal change.

## Continuation update — DL-048 (2026-10-06)

### DL-048 — Time-at-price / dwell-time semantic separation
- Time-at-price, traded-volume weighting and point-in-time position records are separate research objects.
- BAR_VISIT_OCCUPANCY_PROXY records completed-bar price-bin visits only; it does not estimate exact dwell seconds.
- Exact dwell requires timestamp-complete trade or quote sequences plus a frozen duration rule.
- Bar interval, price-bin rule, tick semantics and session segment form a frozen parameter family; no result-driven tuning.
- Occupancy, volume profile and VWAP remain separate representations.
- Net flow does not establish point-in-time position state; observed position quantity does not establish acquisition price.
- Missing exact event / position evidence remains UNKNOWN.
- Information lineage can include PRICE_OHLC, TRADE_TIME, TRADED_VOLUME, QUOTE_TIME and PARTICIPANT_POSITION.
- Multiple roots do not create an extra independent vote by default; residual incrementality remains NOT_VALIDATED.
- T0-T6 comparison classes and D16 handoff are frozen.
- 26 adversarial cases are durably authored across the executable test files, including direct tick-rule / bin-family freeze guards and an aggregate TP01-TP26 runner.\n- Research-specific Node execution remains TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain REMEDIATION_IN_PROGRESS.
- D01 maturity remains 52.7%; outcomes closed; Formal Core unchanged.

### Updated exact next continuation point after DL-048

1. Keep DL-048 stacked on the exact DL-047 head until PR #661 lands.
2. Open a stacked research-only PR with base research/d01-dl047-anchored-vwap-liquidity-20261006.
3. Preserve occupancy, volume weighting and position observability as separate semantics.
4. Hand T0-T6 common-support / residual inference to D16.
5. Keep audit tickets open until canonical closure evidence exists.
6. Next D01 science: separate time/volume acceptance from price-path entropy / directional churn.
7. No runtime wiring / no Formal change.


### DL-048 machine-guard completion — tick/bin family gap closed

- Direct executable guards now require a frozen occupancy parameter family, point-in-time verified tick-rule receipt, bar interval, price-bin rule, semantic price space and session mechanism.
- Current/future tick rules may not be backfilled into earlier predictor states.
- Parameter-family mutation or best interval/bin selection after outcome inspection is prohibited.
- Aggregate research runner now imports all TP01-TP26 cases so split files cannot be silently omitted.
- This is a machine-guard completion, not a maturity promotion.
- D01 remains 52.7%; outcomes CLOSED; Formal Core LOCKED.


## Continuation update — DL-049 (2026-10-06)

### DL-049 — Zone acceptance vs directional churn / path disorder
- DL-048 separated time-at-price, traded-volume weighting and participant-position observability.
- DL-049 separates stable zone occupancy from directional churn / path disorder.
- Repeated visits do not equal acceptance:
  equal occupancy can coexist with very different transition structure;
  equal transition counts can coexist with very different occupancy.
- D03 remains owner of fixed-window pathEfficiency10 / trend-quality primitives.
  D01 owns only zone-local structural path semantics and does not create a duplicate path-efficiency factor.
- Completed-bar close states are frozen as BELOW / INSIDE / ABOVE relative to the frozen structural zone.
- OHLC bar spanning both zone edges preserves BAR_SPANS_ENTIRE_ZONE ambiguity.
  OHLC alone cannot reveal first edge touched, exact crossing count, crossing order or exact dwell time.
- Exact crossing sequence requires complete replay-safe timestamped trade or quote event data.
- Zone-local close-path descriptors remain descriptive:
  eligible state count;
  inside share;
  state transition count;
  direct outside flip count;
  max consecutive inside run;
  cumulative close travel / zone width.
- No directional alpha sign, churn threshold or entropy factor is frozen in v0.1.
- Tick regime, price-limit state, auction/continuous session, volatility-interruption, liquidity/spread and corporate-action continuity remain required controls.
- Information lineage:
  OHLC zone path -> PRICE_OHLC;
  exact event path may add EVENT_TIME / TRADE_TIME / QUOTE_TIME.
  Default effectiveIndependentEvidenceCount remains 1 and residualIncrementalityStatus remains NOT_VALIDATED.
- Future D16 comparison classes:
  Z0 STRUCTURAL_ONLY;
  Z1 HIGH_OCCUPANCY_LOW_CHURN_CONTEXT;
  Z2 HIGH_OCCUPANCY_HIGH_CHURN_CONTEXT;
  Z3 LOW_OCCUPANCY_HIGH_TRAVERSAL_CONTEXT;
  Z4 EVENT_EXACT_CROSSING_CONTEXT;
  Z5 CONSTRAINED_MECHANICS_CONTEXT;
  Z6 NOT_EVALUABLE.
- Future D16 questions:
  occupancy beyond structure;
  churn/path beyond occupancy;
  occupancy beyond churn;
  survival after D03 pathEfficiency10 controls;
  OHLC proxy vs exact event sequence;
  survival after market-mechanics controls;
  residual information after PRICE_OHLC de-duplication.
- New durable artifacts:
  - research/PATTERN_ZONE_PATH_CHURN_V0_1.md
  - research/pattern_zone_path_churn_v0_1.json
  - research/pattern_zone_state_guard_v0_1.mjs
  - research/pattern_zone_state_transition_v0_1.mjs
  - research/test_pattern_zone_path_churn_v0_1.mjs
  - research/PATTERN_ZONE_PATH_CHURN_D16_HANDOFF_V0_1.md
- 20 executable adversarial cases authored; research-specific Node execution remains TEST_EXECUTION_PENDING.
- Prior TOOL_BLOCKED note is superseded: helper/test durable write is now complete.
- SDA-001 / SDA-002 remain REMEDIATION_IN_PROGRESS.
- No outcome join; no runtime/Worker/D1 wiring; no Formal change.
- D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-049

1. Reconcile the clean DL-049 r2 Class-A branch against then-latest main and merge via a new research-only PR.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-049 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve occupancy, close-state transition/churn and exact event crossing as separate semantics.
4. Keep D03 pathEfficiency10 as owner/control primitive and prohibit duplicate D01 trend-quality voting.
5. Hand Z0-Z6 / Q1-Q7 common-support and residual inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate ordinary oscillation from auction/limit/event-driven discrete repricing and microstructure bounce.
8. No runtime wiring / no Formal change.


## Continuation update — DL-050 (2026-10-06)

### DL-050 — Ordinary oscillation vs auction / limit / event / microstructure repricing
- DL-049 separated occupancy from zone-local churn/path disorder.
- DL-050 freezes the next confound: observed state transitions can be ordinary continuous oscillation or mechanically different repricing under auction, VI, price-limit, bid-ask-bounce or event context.
- Current TWSE market-mechanism evidence is encoded only through point-in-time receipts; current rules may not be backfilled into historical samples.
- Four orthogonal context axes are frozen:
  MATCHING_MECHANISM;
  PRICE_CONSTRAINT_STATE;
  MICROSTRUCTURE_BOUNCE_STATE;
  EVENT_CONTEXT.
- Matching mechanisms:
  CONTINUOUS;
  OPEN_CALL_AUCTION;
  CLOSE_CALL_AUCTION;
  VI_REOPEN_CALL_AUCTION;
  OTHER_CALL_AUCTION;
  UNKNOWN.
- Price constraints:
  UNCONSTRAINED;
  DAILY_LIMIT_UP_CONSTRAINED;
  DAILY_LIMIT_DOWN_CONSTRAINED;
  SPECIAL_NO_LIMIT_REGIME;
  UNKNOWN.
- Microstructure-bounce states:
  QUOTE_CONFIRMED_BID_ASK_BOUNCE;
  EXACT_EVENT_NOT_BOUNCE;
  CANDIDATE_UNVERIFIED;
  NOT_EVALUABLE.
- Event context:
  VERIFIED_EVENT_CONTEXT;
  VERIFIED_NO_EVENT_CONTEXT;
  EVENT_CONTEXT_UNKNOWN.
- A call-auction jump across a zone proves only start/end states and AUCTION_CROSSED_ZONE context.
  It does not prove continuous traversal, intermediate occupancy, crossing count or dwell.
- VI reopening is explicitly separated from ordinary continuous churn.
- Price-limit observations are constraint states and cannot be interpreted as unconstrained acceptance/churn without control.
- Legal tick scale is point-in-time input; current tick rules may not be used for historical backfill.
- Bid-ask bounce requires canonical D04/D05 exact trade/quote evidence.
  OHLC alternation alone can never confirm bid-ask bounce.
- Roll-style microstructure evidence motivates this firewall: transaction prices can alternate at bid/ask and create negative short-horizon serial dependence without a corresponding change in underlying value.
- D11 verified event context remains orthogonal:
  event presence does not prove event causation.
- Mixed mechanisms remain multi-axis rather than forcing one causal label.
- Future research classes:
  K0 ORDINARY_CONTINUOUS_UNCONSTRAINED;
  K1 OPEN_OR_CLOSE_AUCTION_REPRICING;
  K2 VI_REOPEN_REPRICING;
  K3 PRICE_LIMIT_CONSTRAINED;
  K4 QUOTE_CONFIRMED_BID_ASK_BOUNCE;
  K5 VERIFIED_EVENT_CONTEXT;
  K6 MIXED_MECHANISM;
  K7 NOT_EVALUABLE.
- DL-049 path/churn descriptors are preserved and stratified by DL-050 mechanism context rather than replaced.
- Future D16 questions:
  churn survival in K0 only;
  share attributable to auction/VI/limit mechanics;
  bounce explanation of short-horizon side flips;
  structural residual after spread/depth/bounce controls;
  event/non-event comparison;
  OHLC proxy vs exact event reconstruction;
  residual value after PRICE_OHLC de-duplication.
- Information roots can include PRICE_OHLC plus TRADE_TIME / QUOTE_TIME / VENUE_RULE, but default effectiveIndependentEvidenceCount remains 1 and residualIncrementalityStatus remains NOT_VALIDATED.
- New durable artifacts:
  - research/PATTERN_TRANSITION_MECHANICS_V0_1.md
  - research/pattern_transition_mechanics_v0_1.json
  - research/pattern_transition_mechanics_v0_1.mjs
  - research/test_pattern_transition_mechanics_v0_1.mjs
  - research/PATTERN_TRANSITION_MECHANICS_D16_HANDOFF_V0_1.md
- 22 executable adversarial cases authored; research-specific Node execution remains TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain REMEDIATION_IN_PROGRESS.
- No outcome join; no runtime/Worker/D1 wiring; no Formal change.
- D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-050

1. Reconcile the DL-050 Class-A branch against then-latest main and merge via research-only PR.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-050 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve matching mechanism, price constraint, microstructure bounce and event context as separate axes.
4. Preserve auction/VI jumps as discrete repricing and never reconstruct unobserved continuous crossing paths.
5. Keep D04/D05 microstructure ownership and D11 event ownership explicit.
6. Hand K0-K7 / Q1-Q7 common-support and residual inference to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. Next D01 science: separate structural-zone churn from volatility clustering / realized-volatility bursts and spread/depth deterioration.
9. No runtime wiring / no Formal change.


## Continuation update — DL-051 (2026-10-06)

### DL-051 — Zone churn vs volatility clustering / realized-volatility burst / liquidity deterioration
- DL-049 separated zone occupancy from directional churn/path disorder.
- DL-050 separated ordinary continuous transitions from auction/limit/event/microstructure repricing.
- DL-051 adds the next confound firewall: repeated zone transitions can rise mechanically when volatility clusters, same-window realized volatility bursts, spread widens, displayed depth thins, or quote/book freshness deteriorates.
- Owner boundaries remain strict:
  D04 owns volatility level, realized-volatility primitives, clustering/persistence and contraction/expansion/shock semantics;
  D05 owns bid-ask spread, displayed depth, quote freshness/reconnect and liquidity-state components;
  D03 owns pathEfficiency10 / trend-quality primitives;
  D01 owns zone-local occupancy/churn geometry and mechanism-conditioned interpretation.
- D01 creates no duplicate volatility indicator, liquidity score or path-efficiency factor.
- Causal timing is split into two blocks:
  PRE_WINDOW_CONTEXT = state known no later than churnWindowStartAt / predictor freeze;
  WITHIN_WINDOW_MECHANISM = realized burst, spread/depth/freshness deterioration and other states observed during the churn window.
- If predictorFreezeAt precedes churnWindowEndAt, WITHIN_WINDOW_MECHANISM is a mediator/contemporaneous mechanism and may not be backfilled into the earlier predictor.
- A completed earlier churn window may be stored as historical state for a later decision only under normal PIT / replay rules.
- Raw transition count is exposure-sensitive. Preserve zone width, owner-supplied volatility scale and a causally verified crossing-opportunity denominator.
- Allowed diagnostics when denominator is valid/non-zero:
  transitionsPerOpportunity;
  sideFlipsPerOpportunity.
  Zero/unknown denominator remains UNKNOWN; no pseudo-zero churn rate.
- Keep distinct:
  VOLATILITY_LEVEL;
  VOLATILITY_CLUSTER_STATE;
  REALIZED_VOLATILITY_BURST.
  Clustering is persistence of magnitude, not direction.
- Where valid two-sided quotes exist:
  midquote local volatility is the primary microstructure volatility control;
  transaction-price RV is a noise/discreteness diagnostic.
- Transaction RV alone -> VOLATILITY_NOISE_SEPARATION_INCOMPLETE.
- Spread/depth states are consumed from D05 owner receipts; no D01 threshold, GOOD/BAD label or directional vote is defined.
- Stale quote != stable spread.
  Missing book != zero depth.
  Reconnect-crossed windows are not continuous observation.
- Quote/book missingness may be stress-endogenous and must remain in the denominator.
- Research context classes:
  L0 STRUCTURAL_CHURN_RAW;
  L1 HIGH_VOLATILITY_CONTEXT;
  L2 REALIZED_VOLATILITY_BURST_CONTEXT;
  L3 SPREAD_DETERIORATION_CONTEXT;
  L4 DEPTH_DETERIORATION_CONTEXT;
  L5 VOLATILITY_LIQUIDITY_STRESS_MIXED;
  L6 STRUCTURAL_CHURN_RESIDUAL_CANDIDATE;
  L7 NOT_EVALUABLE.
- L6 is only a research candidate after owner receipts/common support; absence of flags alone does not prove structural churn.
- Same-window liquidity deterioration may be cause, consequence or feedback; D01 does not infer causal direction from coexistence.
- DL-050 market-mechanism states remain mandatory; a volatility burst during auction, VI restart or price-limit constraint is not pooled with unconstrained continuous trading.
- Future D16 ladder:
  V0 RAW_ZONE_CHURN;
  V1 PRE_WINDOW_VOL_LEVEL_CONTROLLED;
  V2 PRE_WINDOW_VOL_CLUSTER_CONTROLLED;
  V3 OPPORTUNITY_NORMALIZED;
  V4 WITHIN_WINDOW_RV_BURST_STRATIFIED;
  V5 SPREAD_DEPTH_FRESHNESS_CONTROLLED;
  V6 DL050_MECHANISM_CONTROLLED;
  V7 RESIDUAL_ZONE_CHURN_CANDIDATE;
  V8 MULTI_DATE_MULTI_REGIME_REPLICATION.
- Future interpretation:
  Q0 VOLATILITY_LEVEL_EXPLANATION;
  Q1 VOLATILITY_CLUSTER_EXPLANATION;
  Q2 CROSSING_OPPORTUNITY_EXPLANATION;
  Q3 REALIZED_BURST_EXPLANATION;
  Q4 LIQUIDITY_DETERIORATION_EXPLANATION;
  Q5 MICROSTRUCTURE_MISSINGNESS_SENSITIVE;
  Q6 MARKET_MECHANISM_SENSITIVE;
  Q7 STRUCTURAL_CHURN_RESIDUAL;
  Q8 NOT_EVALUABLE.
- Most volatility/churn descriptors remain PRICE_OHLC descendants.
  Spread/depth may supply distinct owner primitives, but default effectiveIndependentEvidenceCount remains 1 until D16 residual evidence.
- New files:
  - research/PATTERN_VOLATILITY_LIQUIDITY_CHURN_V0_1.md
  - research/pattern_volatility_liquidity_churn_v0_1.json
  - research/pattern_volatility_liquidity_churn_v0_1.mjs
  - research/test_pattern_volatility_liquidity_churn_v0_1.mjs
  - research/PATTERN_VOLATILITY_LIQUIDITY_CHURN_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-051

1. Reconcile the DL-051 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-051 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve PRE_WINDOW_CONTEXT and WITHIN_WINDOW_MECHANISM causal timing; never backfill same-window volatility/liquidity deterioration into an earlier predictor.
4. Preserve crossing-opportunity denominators; zero/UNKNOWN opportunity remains UNKNOWN.
5. Consume D04/D05 volatility/liquidity/freshness receipts and D03 pathEfficiency10 without duplicating owner primitives.
6. Hand V0-V8 / Q0-Q8 common-support and residual inference to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. Next D01 science: separate persistent structural rejection from immediate snapback / price-discovery completion after volatility or liquidity shock.
9. No runtime wiring / no Formal change.


## Continuation update — DL-052 (2026-10-06)

### DL-052 — Persistent structural rejection vs shock snapback / price-discovery completion
- DL-051 separated zone churn from volatility clustering / realized-volatility burst / liquidity deterioration.
- DL-052 freezes the next mechanism firewall: a fast reversal near a structural zone can be temporary liquidity-impact recovery, bid/ask/discreteness correction, volatility overshoot, auction/VI/limit repricing recovery, information-driven price discovery, genuine structural rejection, or a mixture.
- Immediate touch-and-bounce is therefore insufficient evidence of structural memory.
- External microstructure evidence strengthens the separation:
  Biais/Weill (2009) show liquidity shocks can generate sharp price decline/order-flow imbalance followed by gradual price recovery;
  Lo/Hall (2015) treat limit-order-book resiliency as post-shock replenishment/recovery;
  Yamada/Ito (2022) explicitly separate price-discovery speed from liquidity-recovery speed.
- Owner boundaries remain strict:
  D04 owns volatility shock/burst primitives;
  D05 owns spread/depth/freshness, resiliency and transaction-vs-midquote noise;
  D11 owns event identity/timing;
  D01 owns the frozen-zone relation and opportunity semantics.
- Separate clocks are mandatory:
  shockStartedAt;
  shockKnownAt;
  shockPeakAt;
  structuralOpportunityAt;
  predictorFreezeAt;
  liquidityRecoveryAt;
  priceRecoveryAt;
  priceDiscoveryCompletionAt.
- Future recovery clocks may never be backfilled into the predictor snapshot.
- Preferred temporary-impact reference is a valid PRE_SHOCK_MIDQUOTE_REFERENCE.
  A transaction-price fallback remains REFERENCE_NOISE_SEPARATION_INCOMPLETE.
- A structural boundary may coincide numerically with the pre-shock reference.
  Numerical coincidence does not identify whether the later move is structural rejection or ordinary snapback.
- Frozen shock-timing states:
  NO_PREEXISTING_SHOCK_CONTEXT;
  PREEXISTING_VOLATILITY_SHOCK;
  PREEXISTING_LIQUIDITY_SHOCK;
  PREEXISTING_MIXED_SHOCK;
  SHOCK_BEGINS_AFTER_OPPORTUNITY;
  SHOCK_CONTEXT_UNKNOWN.
- Liquidity recovery != price recovery.
  A single generic recoveredAt field is prohibited.
- Future mechanism candidates:
  TEMPORARY_IMPACT_RECOVERY_CANDIDATE;
  PERMANENT_PRICE_DISCOVERY_CANDIDATE;
  STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  MIXED_RECOVERY_STRUCTURE_CANDIDATE;
  NOT_EVALUABLE.
- No universal 1-bar / 5-minute / 15-minute / 3-bar / N-ATR snapback horizon is frozen.
  D16 must preregister horizon families or consume owner-defined recovery events before opening outcomes.
- Midquote vs transaction-price noise separation remains explicit.
  A transaction-price snapback without valid quote evidence is SNAPBACK_NOISE_SEPARATION_INCOMPLETE.
- Event/information context can permanently move efficient price.
  Stabilization on the other side of a zone can therefore be price discovery rather than structural failure; short-lived reversal can be transitional rather than structural rejection.
- Future D16 ladder:
  R0 RAW_TOUCH_RESPONSE;
  R1 DL050_MARKET_MECHANICS_CONTROLLED;
  R2 PREEXISTING_VOLATILITY_SHOCK_CONTROLLED;
  R3 PREEXISTING_LIQUIDITY_SHOCK_CONTROLLED;
  R4 PRE_SHOCK_REFERENCE_SNAPBACK_CONTROLLED;
  R5 LIQUIDITY_RECOVERY_VS_PRICE_RECOVERY_SEPARATED;
  R6 PRICE_DISCOVERY_CONTEXT_CONTROLLED;
  R7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  R8 MULTI_DATE_MULTI_REGIME_REPLICATION.
- Future interpretations:
  Q0 AUCTION_LIMIT_MICROSTRUCTURE_EXPLANATION;
  Q1 VOLATILITY_SHOCK_SNAPBACK_EXPLANATION;
  Q2 LIQUIDITY_SHOCK_RECOVERY_EXPLANATION;
  Q3 PRE_SHOCK_REFERENCE_REVERSION_EXPLANATION;
  Q4 PRICE_DISCOVERY_COMPLETION_EXPLANATION;
  Q5 MIXED_SHOCK_STRUCTURE_MECHANISM;
  Q6 STRUCTURAL_REJECTION_RESIDUAL;
  Q7 NOT_EVALUABLE.
- One structural opportunity remains one causal parent even when multiple shock/recovery receipts exist.
  effectiveIndependentEvidenceCount remains 1 by default.
- New files:
  - research/PATTERN_SHOCK_SNAPBACK_V0_1.md
  - research/pattern_shock_snapback_v0_1.json
  - research/pattern_shock_snapback_v0_1.mjs
  - research/test_pattern_shock_snapback_v0_1.mjs
  - research/PATTERN_SHOCK_SNAPBACK_D16_HANDOFF_V0_1.md
- 16 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcomes inspected; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-052

1. Reconcile the DL-052 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-052 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve pre-shock reference, liquidity recovery, price recovery and price-discovery clocks separately; never backfill post-opportunity recovery into baseline predictors.
4. Keep D04/D05/D11 ownership explicit and do not duplicate their shock, resiliency or event estimators.
5. Hand R0-R8 / Q0-Q7 common-support and mechanism-separation inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate persistent rejection from inventory replenishment / queue refill around the zone, especially when displayed depth reforms after the shock.
8. No runtime wiring / no Formal change.


## Continuation update — DL-053 (2026-10-06)

### DL-053 — Persistent structural rejection vs inventory replenishment / queue refill
- DL-052 separated structural rejection from shock snapback / temporary impact recovery / price-discovery completion.
- DL-053 adds the next microstructure falsification: price rejection plus later displayed-depth recovery can reflect ordinary liquidity replenishment / queue refill rather than structural memory.
- External evidence supports rapid post-shock normalization of spread/depth/order-submission intensity in limit-order books; price recovery and liquidity recovery can follow different clocks.
- Owner boundary remains strict:
  D05 owns displayed depth, queue/depth imbalance, quote freshness, replenishment/resiliency, event-clock validity and hidden-liquidity/cancellation caveats.
  D01 owns only the relation between the frozen structural zone and owner-certified liquidity events.
- D01 does not reconstruct queue events from OHLCV and does not infer hidden liquidity, spoofing, inventory motive or market-maker intent.
- Four distinct depth states are frozen:
  PREEXISTING_DEPTH_SURVIVED;
  DEPTH_DEPLETED_THEN_REFILLED;
  DEPTH_DEPLETED_NO_REFILL;
  DEPTH_STATE_UNKNOWN.
  If event-clock/source semantics are inadequate:
  REFILL_IDENTIFIABILITY_BLOCKED.
- Depth survival != depth replenishment.
  A quote that remained visible through the interaction is different from depth that was consumed and later reappeared.
- Displayed depth != committed demand.
  Refill != proven structural memory.
  Refill != proven inventory rebalancing.
- Refill localization relative to the structural zone is descriptive only.
  No universal tick / ATR / percentage proximity threshold is frozen.
- Generic mechanism comparator is mandatory:
  G0 generic post-shock refill under matched liquidity/shock/session context;
  G1 zone-associated refill under comparable context.
  If G1 adds no representation beyond G0, ordinary order-book resiliency is sufficient.
- Mandatory timing clocks:
  structuralOpportunityAt;
  predictorFreezeAt;
  depthObservedPreFreezeAt;
  depletionStartedAt;
  depletionPeakAt;
  refillFirstObservedAt;
  refillConfirmedAt;
  depthRecoveryAt;
  priceRecoveryAt.
- Any refill/recovery observed after predictorFreezeAt is post-treatment / mechanism state and cannot be backfilled into baseline predictors.
- D05 event-clock validity is required for a true refill label.
  Sparse open/10m/15m/30m snapshots cannot identify seconds-scale replenishment.
  If provider semantics cannot certify the intended event process, the mechanism remains blocked or uses weaker displayed-depth-change language.
- Continuous-session unconstrained observations remain the primary lane.
  Opening/closing auction, VI, price-limit constrained and trial/noncontinuous states remain separate.
- DL-053 is nested after DL-052; it does not replace the shock/snapback controls.
- Future D16 ladder:
  R0 RAW_TOUCH_RESPONSE;
  R1 DL052_SHOCK_SNAPBACK_CONTROLLED;
  R2 PREEXISTING_DEPTH_CONTROLLED;
  R3 DEPTH_SURVIVAL_VS_DEPLETION_SEPARATED;
  R4 GENERIC_REFILL_CONTROLLED;
  R5 ZONE_LOCALIZATION_CONTROLLED;
  R6 REFILL_TIMING_MEDIATOR_SEPARATED;
  R7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  R8 MULTI_DATE_MULTI_TICK_TIER_REPLICATION.
- Future interpretations:
  Q0 PREEXISTING_DEPTH_EXPLANATION;
  Q1 GENERIC_RESILIENCY_EXPLANATION;
  Q2 REFILL_MEDIATED_REJECTION;
  Q3 ZONE_LOCALIZED_REFILL_ASSOCIATION;
  Q4 STRUCTURAL_REJECTION_RESIDUAL;
  Q5 MICROSTRUCTURE_NOT_IDENTIFIABLE;
  Q6 NOT_EVALUABLE.
- One structural opportunity remains one causal parent even with multiple microstructure receipts.
  effectiveIndependentEvidenceCount remains 1 by default.
- New files:
  - research/PATTERN_QUEUE_REFILL_VS_STRUCTURAL_REJECTION_V0_1.md
  - research/pattern_queue_refill_vs_structural_rejection_v0_1.json
  - research/pattern_queue_refill_vs_structural_rejection_v0_1.mjs
  - research/test_pattern_queue_refill_vs_structural_rejection_v0_1.mjs
  - research/PATTERN_QUEUE_REFILL_VS_STRUCTURAL_REJECTION_D16_HANDOFF_V0_1.md
- 16 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-053

1. Reconcile the DL-053 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-053 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve depth survival vs depletion/refill vs unknown as distinct states.
4. Reject sparse-snapshot refill identification unless D05 event-clock evidence is valid.
5. Keep all post-opportunity refill/recovery clocks out of baseline predictors.
6. Hand R0-R8 / Q0-Q6 common-support and mechanism-separation inference to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. Next D01 science: separate persistent structural rejection from repeated passive-depth display that is continuously cancelled / reposted (quote flicker) rather than economically durable liquidity.
9. No runtime wiring / no Formal change.


## Continuation update — DL-054 (2026-10-06)

### DL-054 — Persistent structural rejection vs quote flicker / cancel-repost depth
- DL-053 separated structural rejection from queue refill / displayed-depth recovery.
- DL-054 freezes the next microstructure falsification: repeated visible depth near a structural zone may reflect durable resting liquidity, same-price replacement, rapid cancellation/repost, quote flicker, or unknown persistence.
- External evidence supports the distinction:
  quote-stuffing episodes can involve sharp increases in new/cancel messages, shorter order duration and worse liquidity;
  recent flickering-quote research also shows fleeting orders can occur in liquid price-discovery environments;
  limit-order-book resiliency requires event-clock replenishment/survival measurement rather than sparse snapshot inference.
- Therefore:
  cancellation intensity != manipulation;
  visible depth continuity != same-order survival;
  same-price depth across snapshots != economically durable liquidity.
- D05 owner boundary remains strict:
  D05 owns quote/order-book event clocks, order survival/cancellation/modification, displayed depth, queue state, quote freshness, replenishment/resiliency, sequence completeness and hidden-liquidity/intent caveats.
  D01 owns only the relation of owner-certified microstructure state to the frozen structural zone.
- D01 may not infer spoofing, market-maker intent or cancellation survival from OHLCV.
- Frozen persistence states:
  F0 DEPTH_SURVIVAL_CERTIFIED;
  F1 DEPTH_REPLACED_SAME_PRICE;
  F2 FLICKERING_DISPLAYED_DEPTH;
  F3 DEPTH_PERSISTENCE_UNKNOWN.
- Sparse snapshots may support DISPLAYED_DEPTH_PRESENT_AT_SNAPSHOT only.
  They cannot certify continuous queue persistence / same-order survival / flicker rate.
- D01 may consume D05 owner receipts for:
  order lifetime;
  cancellation/modification/message rates;
  cancel-to-submit ratio;
  same-price replacement;
  queue turnover;
  horizon survival probability;
  depth-weighted survival;
  event-clock completeness.
- D01 defines no universal high-cancellation / flicker / durable / spoofing threshold.
- Same-price replacement is treated as price-level persistence without order-level persistence.
- Fast cancellation/repost may reflect normal liquidity provision, quote competition, price discovery or other mechanisms; D01 makes no behavioral intent claim.
- Generic comparator:
  G0 GENERIC_FLICKER_OR_REPLACEMENT;
  G1 ZONE_ASSOCIATED_FLICKER_OR_REPLACEMENT.
  If G1 adds no representation beyond G0, generic microstructure dynamics are sufficient.
- Timing firewall:
  structuralOpportunityAt;
  predictorFreezeAt;
  quoteEventFirstSeenAt;
  quoteEventLastSeenAt;
  cancellationObservedAt;
  repostObservedAt;
  durabilityConfirmedAt;
  depthRecoveryAt;
  priceRecoveryAt.
- Future survival known only after predictorFreezeAt is POST_TREATMENT_PERSISTENCE and cannot be backfilled into baseline predictors.
- Event-clock validity remains mandatory.
  If only sparse snapshots exist -> DEPTH_PERSISTENCE_UNKNOWN.
  If provider sequence completeness is unresolved -> EVENT_CLOCK_INCOMPLETE.
  If order identity is unavailable -> ORDER_IDENTITY_UNAVAILABLE.
- DL-054 refines DL-053:
  depth that appears to survive/recover is further separated into actual survival vs repeated replacement/flicker.
- SDA-001 remains active:
  zone / depth / cancel / repost / persistence receipts are linked mechanism evidence within one causal parent;
  effectiveIndependentEvidenceCount remains 1 by default.
- SDA-002 remains active:
  future order survival cannot become pre-freeze evidence.
- Future D16 ladder:
  F0 RAW_ZONE_REJECTION;
  F1 DL053_REFILL_STATE_CONTROLLED;
  F2 ORDER_SURVIVAL_VS_REPLACEMENT_SEPARATED;
  F3 CANCELLATION_REPOST_ACTIVITY_CONTROLLED;
  F4 GENERIC_FLICKER_CONTROLLED;
  F5 EVENT_CLOCK_COMPLETENESS_CONTROLLED;
  F6 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  F7 MULTI_DATE_MULTI_TICK_TIER_REPLICATION.
- Future interpretation:
  Q0 DISPLAYED_DEPTH_ONLY_EXPLANATION;
  Q1 SAME_PRICE_REPLACEMENT_EXPLANATION;
  Q2 QUOTE_FLICKER_EXPLANATION;
  Q3 GENERIC_CANCELLATION_ACTIVITY_EXPLANATION;
  Q4 DURABLE_DEPTH_CONTEXT_ONLY;
  Q5 EVENT_CLOCK_NOT_IDENTIFIABLE;
  Q6 STRUCTURAL_REJECTION_RESIDUAL;
  Q7 NOT_EVALUABLE.
- New files:
  - research/PATTERN_QUOTE_FLICKER_DEPTH_PERSISTENCE_V0_1.md
  - research/pattern_quote_flicker_depth_persistence_v0_1.json
  - research/pattern_quote_flicker_depth_persistence_v0_1.mjs
  - research/test_pattern_quote_flicker_depth_persistence_v0_1.mjs
  - research/PATTERN_QUOTE_FLICKER_DEPTH_PERSISTENCE_D16_HANDOFF_V0_1.md
- 18 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-054

1. Reconcile the DL-054 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-054 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve same-price snapshot continuity, order survival, replacement and flicker as distinct states.
4. Reject sparse-snapshot order-persistence claims without D05 event-clock/order-identity evidence.
5. Keep post-freeze persistence out of baseline predictors.
6. Hand F0-F7 / Q0-Q7 common-support and residual inference to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. Next D01 science: separate structural rejection from latency / queue-position advantage and hidden-liquidity execution effects around the zone.
9. No runtime wiring / no Formal change.


## Continuation update — DL-055 (2026-10-06)

### DL-055 — Structural rejection vs queue priority / latency / hidden-liquidity execution effects
- DL-054 separated durable displayed depth from same-price replacement / quote flicker.
- DL-055 freezes the next execution-mechanism firewall: apparent zone rejection may reflect queue priority, submission/ack latency, hidden/iceberg liquidity, or generic execution mechanics rather than structural memory.
- External evidence supports the distinction:
  price-time-priority queues make queue position economically relevant to waiting/fill probability;
  hidden/iceberg orders can replenish displayed size and alter price/order-flow dynamics;
  visible top-five depth is not total executable liquidity.
- D05 owner boundary remains strict:
  D05 owns exact queue/priority semantics, queue-ahead proxy, own-order lifecycle, submit/ack/fill clocks, fill probability, hidden-liquidity inference and event-clock validity.
  D01 owns only the relation of owner-certified execution states to the frozen structural zone.
- Queue states:
  EXACT_QUEUE_POSITION_KNOWN;
  QUEUE_AHEAD_PROXY_ONLY;
  QUEUE_POSITION_UNKNOWN.
- Public top-five aggregate depth cannot identify exact queue rank.
- Exact queue requires owner-grade order sequence plus own-order lifecycle.
- Queue position remains execution-confidence/fill-probability context and is not directional alpha.
- Latency states:
  LATENCY_KNOWN;
  SUBMIT_LATENCY_PARTIAL;
  ACK_LATENCY_UNKNOWN;
  NO_OWN_ORDER_LIFECYCLE;
  NOT_APPLICABLE.
- No real submitted order -> no exact submit-to-ack latency, no exact own queue rank, no true fill probability and no implementation-shortfall claim.
- Hidden-liquidity states:
  DISPLAYED_ONLY_OBSERVED;
  HIDDEN_LIQUIDITY_CANDIDATE;
  OWNER_CONFIRMED_HIDDEN_LIQUIDITY;
  HIDDEN_LIQUIDITY_UNKNOWN.
- Repeated replenishment / weak price progress may support HIDDEN_LIQUIDITY_CANDIDATE, but candidate != confirmed iceberg.
- Owner-confirmed hidden liquidity requires valid D05 owner receipt + event-clock evidence.
- Hypothetical touch = fill is explicitly prohibited.
- Timing firewall:
  structuralOpportunityAt;
  predictorFreezeAt;
  decisionTimestamp;
  orderSubmitTimestamp;
  exchangeAckTimestamp;
  firstExecutableTimestamp;
  hiddenLiquidityFirstIndicatedAt;
  hiddenLiquidityConfirmedAt;
  fillTimestamp;
  priceResponseKnownAt.
- Post-freeze hidden-liquidity / fill state is post-treatment and may not be backfilled into the baseline structural predictor.
- Generic execution comparator:
  G0 GENERIC_EXECUTION_ADVANTAGE;
  G1 ZONE_ASSOCIATED_EXECUTION_ADVANTAGE.
  If G1 adds no residual representation beyond G0, generic execution mechanics are sufficient.
- Common-support controls include relative tick, price tier, spread, displayed depth, trade/message intensity, queue-ahead proxy, latency state, hidden-liquidity state, session/auction/VI/limit state, volatility/liquidity regime, structural age and DL-052/DL-053/DL-054 mechanism context.
- SDA-001 remains active:
  zone / queue / latency / hidden-liquidity / fill receipts are linked mechanism receipts within one causal parent;
  effectiveIndependentEvidenceCount remains 1 by default.
- SDA-002 remains active:
  every execution receipt retains firstObservableAt / knownAt / predictorFreezeAt / replaySafe;
  future queue depletion / hidden-liquidity confirmation / fill may not rewrite earlier predictor state.
- Future D16 ladder:
  E0 RAW_ZONE_REJECTION;
  E1 DL054_DEPTH_PERSISTENCE_CONTROLLED;
  E2 QUEUE_PRIORITY_CONTEXT_CONTROLLED;
  E3 LATENCY_CONTEXT_CONTROLLED;
  E4 HIDDEN_LIQUIDITY_CONTEXT_CONTROLLED;
  E5 GENERIC_EXECUTION_ADVANTAGE_CONTROLLED;
  E6 OWN_ORDER_LIFECYCLE_CONFIRMED;
  E7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  E8 MULTI_DATE_MULTI_TICK_TIER_REPLICATION.
- Future interpretation:
  Q0 QUEUE_PRIORITY_EXPLANATION;
  Q1 LATENCY_EXPLANATION;
  Q2 HIDDEN_LIQUIDITY_EXPLANATION;
  Q3 GENERIC_EXECUTION_MECHANICS_EXPLANATION;
  Q4 FILL_SELECTION_SENSITIVE;
  Q5 OWN_ORDER_DATA_REQUIRED;
  Q6 STRUCTURAL_REJECTION_RESIDUAL;
  Q7 NOT_EVALUABLE.
- New files:
  - research/PATTERN_QUEUE_LATENCY_HIDDEN_LIQUIDITY_V0_1.md
  - research/pattern_queue_latency_hidden_liquidity_v0_1.json
  - research/pattern_queue_latency_hidden_liquidity_v0_1.mjs
  - research/test_pattern_queue_latency_hidden_liquidity_v0_1.mjs
  - research/PATTERN_QUEUE_LATENCY_HIDDEN_LIQUIDITY_D16_HANDOFF_V0_1.md
- 18 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-055

1. Reconcile the DL-055 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-055 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve exact queue / queue-ahead proxy / unknown as separate states.
4. Preserve displayed-only / hidden-liquidity candidate / owner-confirmed hidden / unknown as separate states.
5. Reject hypothetical touch-as-fill and post-freeze hidden-liquidity/fill backfill.
6. Hand E0-E8 / Q0-Q7 common-support and execution-selection inference to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. Next D01 science: separate structural rejection from maker/taker fee economics and passive-vs-aggressive execution selection around the zone.
9. No runtime wiring / no Formal change.


## Continuation update — DL-056 (2026-10-06)

### DL-056 — Structural rejection vs passive/aggressive execution selection and fee economics
- DL-055 separated queue priority, latency and hidden-liquidity effects from structural rejection.
- DL-056 adds execution-selection / fee-economics selection: passive and aggressive fills are not randomized samples, and fill-only studies can create selection bias.
- TWSE ordinary-stock official rules reviewed for this tranche establish price/time priority and broker customer commissions.
  They do not by themselves prove a U.S.-style maker-taker rebate schedule for ordinary equities.
- Foreign maker-taker economics may be used only as mechanism literature.
  Local venue/instrument/date owner receipt is required before applying maker/taker fee/rebate semantics.
- Fee-regime states:
  VENUE_FEE_REGIME_VERIFIED_NON_MAKER_TAKER;
  VENUE_MAKER_TAKER_REGIME_VERIFIED;
  BROKER_COMMISSION_ONLY_KNOWN;
  FEE_REGIME_UNKNOWN.
- Special liquidity-provider incentive programs are instrument/program specific and may not be generalized to ordinary equities.
- Execution-style states:
  PASSIVE_EXECUTION_VERIFIED;
  AGGRESSIVE_EXECUTION_VERIFIED;
  MIXED_OR_PARTIAL_EXECUTION;
  EXECUTION_STYLE_PROXY_ONLY;
  EXECUTION_STYLE_UNKNOWN.
- Verified passive/aggressive execution requires real-order semantics.
  No hypothetical trade receives a verified execution style.
- Passive-fill observations are selected by queue position, incoming marketable flow, cancellation/repost, price path, latency, hidden liquidity and order lifetime.
- Aggressive execution is also selected by urgency, spread/depth, price movement and execution intent/context.
- Therefore passive vs aggressive execution is execution selection/context, not Pattern evidence.
- Required opportunity denominator preserves:
  NO_ORDER_SUBMITTED;
  ORDER_REJECTED;
  SUBMITTED_PENDING;
  FILLED;
  PARTIAL;
  CANCELLED;
  UNFILLED_STUDY_END.
- Completed fills alone may not define the sample.
- Hypothetical touch=fill remains prohibited.
  No real submitted order -> no actual fill, no actual commission/rebate, no implementation-shortfall claim.
- Fee components remain separate:
  broker commission;
  venue/handling charge where applicable;
  maker rebate/taker fee only if locally verified;
  transaction tax;
  instrument-specific charges.
- Lower execution cost != stock alpha.
- Timing firewall:
  structuralOpportunityAt;
  predictorFreezeAt;
  executionDecisionAt;
  orderSubmitAt;
  exchangeAckAt;
  firstFillAt;
  finalFillAt;
  cancelAt;
  feeKnownAt;
  postFillMarkoutKnownAt.
- Ex-ante fee schedule can be baseline only when effective/known by predictor freeze.
  Realized fill/fee/rebate/cancel/markout remains post-treatment.
- Fee receipts require venue/instrument, effectiveFrom/effectiveTo, source/version, knownAt, broker commission schedule ID and maker/taker program ID where applicable.
- Current fee schedules may not be backfilled historically without PIT validity.
- Generic execution-selection comparator:
  G0 GENERIC_EXECUTION_SELECTION;
  G1 ZONE_ASSOCIATED_EXECUTION_SELECTION.
  If G1 adds no residual representation beyond G0, execution selection is sufficient.
- Future D16 ladder:
  X0 RAW_ZONE_REJECTION;
  X1 DL055_QUEUE_LATENCY_HIDDEN_CONTROLLED;
  X2 EXECUTION_STYLE_SELECTION_CONTROLLED;
  X3 UNFILLED_CANCELLED_DENOMINATOR_INCLUDED;
  X4 EX_ANTE_FEE_REGIME_CONTROLLED;
  X5 REALIZED_EXECUTION_COST_SEPARATED;
  X6 GENERIC_EXECUTION_SELECTION_CONTROLLED;
  X7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  X8 MULTI_DATE_MULTI_BROKER_OR_FEE_REGIME_REPLICATION.
- Future interpretation:
  Q0 PASSIVE_FILL_SELECTION_EXPLANATION;
  Q1 AGGRESSIVE_URGENCY_SELECTION_EXPLANATION;
  Q2 NONFILL_OPPORTUNITY_COST_EXPLANATION;
  Q3 FEE_ECONOMICS_EXPLANATION;
  Q4 EXECUTION_COST_ONLY;
  Q5 VENUE_TRANSFER_NOT_VALID;
  Q6 STRUCTURAL_REJECTION_RESIDUAL;
  Q7 NOT_EVALUABLE.
- SDA-001 remains active:
  execution style, queue state, fee and fill receipts are linked mechanisms;
  effectiveIndependentEvidenceCount remains 1 by default.
- SDA-002 remains active:
  every fee/execution receipt retains firstObservableAt / knownAt / predictorFreezeAt / replaySafe;
  realized execution outcomes cannot rewrite the baseline predictor.
- New files:
  - research/PATTERN_EXECUTION_SELECTION_FEE_ECONOMICS_V0_1.md
  - research/pattern_execution_selection_fee_economics_v0_1.json
  - research/pattern_execution_selection_fee_economics_v0_1.mjs
  - research/test_pattern_execution_selection_fee_economics_v0_1.mjs
  - research/PATTERN_EXECUTION_SELECTION_FEE_ECONOMICS_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-056

1. Reconcile the DL-056 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-056 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve all no-order/reject/fill/partial/cancel/unfilled states in the execution opportunity denominator.
4. Require PIT local fee-regime receipts; never import foreign maker-taker semantics without local proof.
5. Preserve signal/structural response and execution quality as separate estimands.
6. Hand X0-X8 / Q0-Q7 fill-selection and cost-separation inference to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. Next D01 science: separate structural rejection from order-size / participation-rate market-impact selection around the zone.
9. No runtime wiring / no Formal change.


## Continuation update — DL-057 (2026-10-07)

### DL-057 — Structural rejection vs order-size / participation-rate market-impact selection
- DL-056 separated passive/aggressive execution selection and fee economics from structural rejection.
- DL-057 freezes the next falsification: a price move away from a structural zone after an order is submitted may be partly caused by the trader's own order size, participation rate, urgency and execution schedule.
- External market-impact literature supports several mechanism facts:
  buy flow tends to push prices upward and sell flow downward;
  impact grows with executed quantity and often follows a concave square-root-like relation over broad regimes;
  participation rate changes the impact path, especially at high execution intensity;
  impact can decay after execution;
  simultaneous/correlated metaorders can confound naive attribution.
- These findings are mechanism literature, not Taiwan-equity calibration.
- D05 remains owner of event-level microstructure / order-book / trade-clock / depth / liquidity receipts.
- D01 does not reconstruct realized impact from candles.
- Structural opportunity and execution intervention are separate clocks:
  STRUCTURAL_OPPORTUNITY_AT;
  EXECUTION_INTERVENTION_AT.
- If execution starts before predictor freeze:
  STRUCTURAL_BASELINE_CONTAMINATED_BY_EXECUTION.
- Order size and participation rate are separate mechanism dimensions.
- Participation rate requires interval-matched market volume denominator.
  shares / daily ADV is proxy-only unless preregistered.
- No universal D01 threshold defines large order / high participation.
- Impact measurement states are frozen:
  M0 NO_REAL_ORDER;
  M1 ORDER_SUBMITTED_IMPACT_UNMEASURED;
  M2 IMPACT_MEASUREMENT_PARTIAL;
  M3 LOCAL_IMPACT_RECEIPT_VALID;
  M4 IMPACT_MODEL_PROXY_ONLY;
  M5 IMPACT_DATA_BLOCKED.
- No hypothetical order receives verified realized-impact fields.
- Baseline-eligible fields include planned size/participation cap/ex-ante policy/current liquidity.
- Realized executed quantity/participation/fills/impact/shortfall/decay are post-treatment and cannot rewrite the structural baseline.
- Response windows are frozen:
  I0 PRE_EXECUTION_RESPONSE;
  I1 EXECUTION_OVERLAP_RESPONSE;
  I2 POST_EXECUTION_DECAY_WINDOW;
  I3 NO_EXECUTION_REFERENCE;
  I4 CONTAMINATION_UNKNOWN.
- Own-order-flow alignment is explicit:
  BUY near support with expected UP rejection can mechanically mimic successful support;
  SELL near resistance with expected DOWN rejection can mechanically mimic successful resistance.
- Alignment is a contamination descriptor, not evidence strength.
- Generic comparator:
  G0 GENERIC_IMPACT_EVENT;
  G1 ZONE_ASSOCIATED_IMPACT_EVENT.
  If G1 adds no residual representation beyond G0, generic market impact is sufficient.
- Impact models require venue/instrument/date lineage.
  Foreign-market parameters cannot be treated as Taiwan local calibration.
- Concurrent order-flow confounding remains explicit:
  OTHER_METAORDER_CONFOUND_UNKNOWN when external flow coverage is unavailable.
- No universal permanent-impact fraction is imported.
- Opportunity denominator preserves no-order / reject / pending / fill / partial / cancel / unfilled / data-blocked states.
- Fill-only samples are prohibited.
- Future D16 ladder:
  X0 RAW_ZONE_RESPONSE;
  X1 DL055_QUEUE_LATENCY_HIDDEN_CONTROLLED;
  X2 DL056_EXECUTION_SELECTION_FEE_CONTROLLED;
  X3 ORDER_SIZE_CONTROLLED;
  X4 PARTICIPATION_RATE_CONTROLLED;
  X5 EXECUTION_OVERLAP_TIMING_CONTROLLED;
  X6 OWN_IMPACT_ALIGNMENT_CONTROLLED;
  X7 POST_EXECUTION_DECAY_CONTROLLED;
  X8 GENERIC_IMPACT_COMPARATOR_CONTROLLED;
  X9 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  X10 MULTI_DATE_MULTI_SYMBOL_LOCAL_CALIBRATION.
- Future interpretations:
  Q0 ORDER_SIZE_EXPLANATION;
  Q1 PARTICIPATION_RATE_EXPLANATION;
  Q2 OWN_IMPACT_ALIGNMENT_EXPLANATION;
  Q3 TEMPORARY_IMPACT_DECAY_EXPLANATION;
  Q4 GENERIC_MARKET_IMPACT_EXPLANATION;
  Q5 CONCURRENT_ORDER_FLOW_UNRESOLVED;
  Q6 STRUCTURAL_REJECTION_RESIDUAL;
  Q7 LOCAL_CALIBRATION_NOT_VALID;
  Q8 NOT_EVALUABLE.
- SDA-001 remains open:
  impact / size / participation / queue / fill / fee / zone are linked mechanism observations;
  effectiveIndependentEvidenceCount remains 1 by default.
- SDA-002 remains open:
  execution/impact receipts retain firstObservableAt / knownAt / predictorFreezeAt / executionStartAt / replaySafe;
  realized impact cannot backfill baseline predictors.
- New files:
  - research/PATTERN_MARKET_IMPACT_SELECTION_V0_1.md
  - research/pattern_market_impact_selection_v0_1.json
  - research/pattern_market_impact_selection_v0_1.mjs
  - research/test_pattern_market_impact_selection_v0_1.mjs
  - research/PATTERN_MARKET_IMPACT_SELECTION_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-057

1. Reconcile the DL-057 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-057 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve order size, participation rate, execution timing, own-impact alignment and post-execution decay as separate mechanism fields.
4. Require local PIT impact-model receipts before any calibrated Taiwan market-impact interpretation.
5. Preserve full no-order/reject/fill/partial/cancel/unfilled denominator.
6. Hand X0-X10 / Q0-Q8 market-impact residual inference to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. Next D01 science: separate structural rejection from information content / alpha of the initiating order so informed trading is not misread as zone efficacy.
9. No runtime wiring / no Formal change.


## Continuation update — DL-058 (2026-10-07)

### DL-058 — Structural rejection vs information content / initiating-order alpha
- DL-057 separated structural response from order-size / participation-rate mechanical market impact.
- DL-058 freezes the next falsification: a trade initiated near a structural zone may move in the expected direction because the initiating decision itself contains information/predictive alpha, not because the zone caused the response.
- External microstructure evidence supports separating mechanical and informational components:
  uninformed/isolated metaorders can show temporary impact that decays more fully;
  more informationally correlated order flow can leave more persistent price displacement;
  adverse selection is a genuine liquidity-provider risk.
- These findings are mechanism evidence only and do not prove that any Taiwan order is informed.
- D05 remains owner of adverse-selection / toxicity / markout / order-book microstructure semantics.
- D10 remains owner of execution-quality semantics where applicable.
- D01 owns only whether structural-zone interpretation survives owner-certified information context.
- Information classes are frozen:
  I0 INFORMATION_CONTENT_UNKNOWN;
  I1 EX_ANTE_SIGNAL_RECEIPT_PRESENT;
  I2 EXTERNAL_INFORMATION_RECEIPT_PRESENT;
  I3 MICROSTRUCTURE_ADVERSE_SELECTION_PROXY_PRESENT;
  I4 INFORMATION_PROXY_ONLY;
  I5 INFORMATION_RECEIPT_DATA_BLOCKED.
- Outcome leakage is prohibited:
  profitable trade != informed;
  persistent post-trade move != informed;
  successful breakout != informed;
  positive permanent markout != informed.
- Information classification must use fields known at/before predictorFreezeAt.
- Three mechanism families remain separate:
  MECHANICAL_IMPACT_CONTEXT;
  INFORMATION_CONTEXT;
  STRUCTURAL_CONTEXT.
- No composite smart-money score is defined.
- Persistent post-trade displacement may reflect information, correlated order flow, structure, permanent impact, regime drift or mixtures.
- Generic comparator:
  G0 INFORMED_OR_SIGNALLED_ORDER_AWAY_FROM_ZONE;
  G1 INFORMED_OR_SIGNALLED_ORDER_AT_ZONE.
  If G1 adds no residual representation beyond G0, initiating-order information is sufficient.
- Complementary zone comparison:
  Z0 ZONE_EVENT_NO_INFORMATION_RECEIPT;
  Z1 ZONE_EVENT_WITH_INFORMATION_RECEIPT.
- No-information-receipt does not mean truly uninformed; UNKNOWN remains UNKNOWN.
- Post-trade markout is outcome/mechanism evidence and cannot become baseline information.
- External news/event receipts require source/release/first-known/ingest/event identity/replaySafe provenance.
- Strategy-signal receipts require source system/version/generatedAt/informationRoot/replaySafe lineage.
- PRICE_OHLC-derived initiating signals and D01 geometry share the same information root by default.
  Different names do not create independent evidence.
- Research mechanism cells:
  M0 low/unknown information + low/unknown own impact;
  M1 higher information proxy + low/unknown own impact;
  M2 low/unknown information + high own impact;
  M3 higher information proxy + high own impact.
- Future D16 ladder:
  Y0 RAW_ZONE_RESPONSE;
  Y1 DL057_MARKET_IMPACT_CONTROLLED;
  Y2 EX_ANTE_SIGNAL_CLASS_CONTROLLED;
  Y3 EVENT_NEWS_INFORMATION_CONTROLLED;
  Y4 ADVERSE_SELECTION_CONTEXT_CONTROLLED;
  Y5 SAME_INFORMATION_ROOT_DEDUPED;
  Y6 GENERIC_INFORMED_ORDER_COMPARATOR_CONTROLLED;
  Y7 NO_INFORMATION_RECEIPT_ZONE_REFERENCE;
  Y8 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  Y9 MULTI_DATE_MULTI_SYMBOL_MULTI_INFORMATION_CLASS.
- Future interpretations:
  Q0 INITIATING_SIGNAL_EXPLANATION;
  Q1 EXTERNAL_INFORMATION_EXPLANATION;
  Q2 ADVERSE_SELECTION_EXPLANATION;
  Q3 SAME_INFORMATION_ROOT_ALIAS;
  Q4 INFORMATION_PLUS_MECHANICAL_IMPACT;
  Q5 STRUCTURAL_REJECTION_RESIDUAL;
  Q6 INFORMATION_STATUS_UNKNOWN;
  Q7 NOT_EVALUABLE.
- SDA-001 remains open:
  all same-root PRICE_OHLC signal aliases remain de-duplicated by default.
- SDA-002 remains open:
  information receipts require knownAt / predictorFreezeAt / replaySafe;
  future revisions cannot rewrite baseline predictors.
- New files:
  - research/PATTERN_INFORMATION_CONTENT_FIREWALL_V0_1.md
  - research/pattern_information_content_firewall_v0_1.json
  - research/pattern_information_content_firewall_v0_1.mjs
  - research/test_pattern_information_content_firewall_v0_1.mjs
  - research/PATTERN_INFORMATION_CONTENT_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-058

1. Reconcile the DL-058 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-058 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve mechanical impact, information context and structural context separately.
4. Preserve UNKNOWN vs no-receipt vs proxy-only information states.
5. Hand Y0-Y9 / Q0-Q7 information-content residual inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural rejection from correlated external order-flow / crowding so same-direction follow-through is not attributed to one initiating decision or one zone.
8. No runtime wiring / no Formal change.


## Continuation update — DL-059 (2026-10-07)

### DL-059 — Structural rejection vs correlated external order flow / crowding / co-impact
- DL-057 separated structural response from own-order mechanical impact.
- DL-058 separated structural response from initiating-order information content.
- DL-059 freezes the next falsification: same-direction follow-through near a structural zone may be driven by correlated external order flow, institutional crowding, passive basket flow, mechanical hedging, leverage crowding, common-factor flow or cross-impact rather than by the zone itself.
- External evidence supports the mechanism:
  institutional metaorders from different investors can be correlated;
  concurrent same-direction metaorders can generate co-impact/crowding;
  order-flow imbalances can amplify price moves;
  correlated metaorders can make impact appear persistent;
  cross-impact can propagate price effects across related assets.
- These findings are mechanism evidence only and do not prove any Taiwan event is crowded.
- Owner boundaries remain strict:
  D02 owns volume-origin / leverage crowding / passive / hedge / common-factor flow taxonomy;
  D05 owns event-level order flow / trade pressure / microstructure clocks;
  D03 owns trend/momentum semantics;
  D13/D18 own relevant macro/regime context where routed.
- D01 only tests whether zone interpretation survives owner-certified flow context.
- External-flow identity is split into:
  INITIATING_ORDER_FLOW;
  EXTERNAL_SAME_SYMBOL_FLOW;
  COMMON_FACTOR_OR_BASKET_FLOW;
  CROSS_ASSET_FLOW.
- Frozen flow states:
  F0 EXTERNAL_FLOW_UNKNOWN;
  F1 SAME_SYMBOL_DIRECTIONAL_FLOW_PRESENT;
  F2 SAME_SYMBOL_OPPOSING_FLOW_PRESENT;
  F3 MULTI_PARTICIPANT_CROWDING_PRESENT;
  F4 PASSIVE_BASKET_FLOW_PRESENT;
  F5 MECHANICAL_HEDGE_FLOW_PRESENT;
  F6 LEVERAGE_CROWDING_PRESENT;
  F7 COMMON_FACTOR_FLOW_PRESENT;
  F8 CROSS_ASSET_COIMPACT_CONTEXT_PRESENT;
  F9 MIXED_OR_CONFLICTING_FLOW;
  F10 FLOW_DATA_BLOCKED.
- High volume alone does not prove crowding.
- Strong candle / high volume / synchronized stocks may not be relabeled as crowding, passive flow or cross-impact without owner-grade receipts.
- External-flow timing firewall:
  firstObservableAt;
  knownAt;
  flowWindowStart;
  flowWindowEnd;
  predictorFreezeAt;
  sourceVersion;
  replaySafe.
- knownAt > predictorFreezeAt -> POST_HOC_EXTERNAL_FLOW_NOT_BASELINE_ELIGIBLE.
- Flow windows extending beyond predictor freeze are baseline-partial only; later flow is post-treatment/mediator/co-movement context.
- Primary generic comparator:
  G0 EXTERNAL_FLOW_EVENT_AWAY_FROM_ZONE;
  G1 EXTERNAL_FLOW_EVENT_AT_ZONE.
  If G1 adds no residual representation, generic external flow/crowding is sufficient.
- Complementary zone states:
  Z0 flow unknown/no receipt;
  Z1 external flow present;
  Z2 mixed/opposing flow.
  Unknown does not equal no flow.
- Crowding requires participant/category/concentration/correlation evidence under owner semantics; D01 defines no universal crowding threshold.
- Passive basket, hedge and common-factor flow remain mechanism/context, not Pattern votes.
- Cross-impact may come from index/ETF/sector/derivatives/related assets; D01 defines no cross-impact coefficients.
- Correlated flow can mimic structural persistence through shared signals, metaorder splitting, herding, passive baskets, hedging or common information.
- External-flow receipts are distinct-information-root candidates only; they are not automatically independent evidence.
- Future D16 ladder:
  C0 RAW_ZONE_RESPONSE;
  C1 DL057_OWN_IMPACT_CONTROLLED;
  C2 DL058_INITIATING_INFORMATION_CONTROLLED;
  C3 SAME_SYMBOL_EXTERNAL_FLOW_CONTROLLED;
  C4 MULTI_PARTICIPANT_CROWDING_CONTROLLED;
  C5 PASSIVE_HEDGE_LEVERAGE_FLOW_CONTROLLED;
  C6 COMMON_FACTOR_FLOW_CONTROLLED;
  C7 CROSS_ASSET_COIMPACT_CONTROLLED;
  C8 GENERIC_EXTERNAL_FLOW_COMPARATOR_CONTROLLED;
  C9 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE;
  C10 MULTI_DATE_MULTI_SYMBOL_MULTI_FLOW_REGIME.
- Future interpretations:
  Q0 SAME_SYMBOL_FLOW_EXPLANATION;
  Q1 CROWDING_EXPLANATION;
  Q2 PASSIVE_OR_HEDGE_FLOW_EXPLANATION;
  Q3 COMMON_FACTOR_FLOW_EXPLANATION;
  Q4 CROSS_IMPACT_EXPLANATION;
  Q5 MIXED_FLOW_NOT_IDENTIFIED;
  Q6 STRUCTURAL_REJECTION_RESIDUAL;
  Q7 FLOW_STATUS_UNKNOWN;
  Q8 NOT_EVALUABLE.
- SDA-001 remains open:
  external-flow receipts / D01 geometry / D02 volume-origin / D03 momentum are not automatic multi-votes.
- SDA-002 remains open:
  flow receipts require firstObservableAt / knownAt / predictorFreezeAt / replaySafe;
  future crowding cannot rewrite earlier predictors.
- New files:
  - research/PATTERN_EXTERNAL_FLOW_CROWDING_FIREWALL_V0_1.md
  - research/pattern_external_flow_crowding_firewall_v0_1.json
  - research/pattern_external_flow_crowding_firewall_v0_1.mjs
  - research/test_pattern_external_flow_crowding_firewall_v0_1.mjs
  - research/PATTERN_EXTERNAL_FLOW_CROWDING_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-059

1. Reconcile the DL-059 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-059 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve initiating order, external same-symbol flow, common-factor flow and cross-asset flow separately.
4. Consume D02/D05/D03/D13/D18 owner receipts rather than inventing duplicate flow taxonomies.
5. Hand C0-C10 / Q0-Q8 external-flow residual inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural rejection from cross-sectional leader/follower propagation and sector/index synchronization so apparent zone response is not just common price discovery.
8. No runtime wiring / no Formal change.


## Continuation update — DL-060 (2026-10-07)

### DL-060 — Structural response vs leader/follower propagation and common price discovery
- DL-059 separated structural response from correlated external order flow/crowding.
- DL-060 freezes the next attribution firewall: an apparent stock-specific support/resistance response may instead be delayed reaction to a market leader, sector, index, ETF, futures contract, supply-chain leader or other common price-discovery channel.
- D03 remains canonical owner of lead-lag / timing-placebo methodology.
- D07 owns verified supply-chain lead-lag relations.
- Breadth/rotation research owns sector participation / leadership-state semantics.
- D05 owns event-clock / cross-impact context where available.
- D01 does not build a new lead-lag model; it only tests whether structural representation survives owner-certified common-price-discovery context.
- Hard clock consumes D03 invariant:
  leaderSignalKnownAt <= followerPredictorFreeze < followerEndpointWindowStart.
- Same completed-bar co-movement is contemporaneous association, not lead evidence.
- Frozen context states:
  P0 SELF_STRUCTURE_CONTEXT_ONLY;
  P1 MARKET_INDEX_PRIOR_MOVE_PRESENT;
  P2 SECTOR_PRIOR_MOVE_PRESENT;
  P3 VERIFIED_LEADER_PRIOR_MOVE_PRESENT;
  P4 FUTURES_OR_ETF_PRICE_DISCOVERY_PRIOR_MOVE_PRESENT;
  P5 SUPPLY_CHAIN_PRIOR_MOVE_PRESENT;
  P6 CONTEMPORANEOUS_SYNCHRONIZATION_ONLY;
  P7 MULTIPLE_COMMON_DISCOVERY_CHANNELS;
  P8 LEAD_LAG_DIRECTION_UNKNOWN;
  P9 PRICE_DISCOVERY_DATA_BLOCKED.
- Leader identity must be frozen by an owner registry/relation before outcomes.
  Outcome-selected leaders are prohibited.
- Same-bar synchronization may reflect common information, factor beta, passive/index flow, simultaneous reaction, nonsynchronous trading or true lead-lag.
  Without earlier knownAt, it contributes zero predictive lead evidence.
- Nonsynchronous trading is a required falsifier:
  liquidity tier;
  stale-price state;
  last-trade freshness;
  trading intensity;
  auction/suspension/limit/session state.
- A lead-lag effect that disappears after those controls is NONSYNCHRONOUS_TRADING_EXPLANATION.
- Market/sector context stays separate:
  broad index prior move;
  sector prior move;
  sector breadth/participation;
  equal-weight vs cap-weight state;
  leadership concentration;
  market/sector regime.
- Futures/ETF price-discovery direction may be consumed only from owner-certified relations; same-bar correlation cannot define direction.
- Supply-chain leadership requires D07 verified edge/relation; theme membership alone is not a causal leader receipt.
- Primary generic comparator:
  G0 COMMON_DISCOVERY_EVENT_AWAY_FROM_ZONE;
  G1 COMMON_DISCOVERY_EVENT_AT_ZONE.
  If G1 adds no residual representation, common price discovery is sufficient.
- Complementary zone states preserve no-prior-receipt, market/sector prior move, verified leader prior move, futures/ETF prior discovery, multiple channels, contemporaneous only and direction unknown.
- Absence of a prior receipt does not prove no common influence; UNKNOWN remains UNKNOWN.
- Only common-discovery states known before predictorFreezeAt are baseline eligible.
  Later leader/sector/index movement is POST_OPPORTUNITY_COMMON_DISCOVERY.
- Direct-price ancestry controls remain mandatory:
  follower direct trend/return;
  leader direct trend/return;
  market/sector return;
  D01 structure;
  D02 price-volume;
  D03 trend/momentum;
  D18 regime;
  liquidity/nonsynchronous trading.
- Different symbols do not automatically create independent evidence.
  Leader price, sector price, market price and follower structure may share common PRICE_OHLC/common-shock ancestry.
- SDA-001 remains open:
  effectiveIndependentEvidenceCount remains 1 by default within one parent unless D16 validates residual/dependence structure.
- SDA-002 remains open:
  relationFrozenAt / leaderSignalFirstObservableAt / leaderSignalKnownAt / followerPredictorFreezeAt / replaySafe are required;
  outcome-selected relations are POST_HOC_RELATION_NOT_ELIGIBLE.
- Future D16 ladder:
  L0 RAW_ZONE_RESPONSE;
  L1 DL057_OWN_IMPACT_CONTROLLED;
  L2 DL058_INITIATING_INFORMATION_CONTROLLED;
  L3 DL059_EXTERNAL_FLOW_CONTROLLED;
  L4 MARKET_INDEX_PRIOR_MOVE_CONTROLLED;
  L5 SECTOR_PRIOR_MOVE_BREADTH_CONTROLLED;
  L6 VERIFIED_LEADER_PRIOR_MOVE_CONTROLLED;
  L7 FUTURES_ETF_PRICE_DISCOVERY_CONTROLLED;
  L8 NONSYNCHRONOUS_TRADING_CONTROLLED;
  L9 GENERIC_COMMON_DISCOVERY_COMPARATOR_CONTROLLED;
  L10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE;
  L11 MULTI_DATE_MULTI_SYMBOL_MULTI_RELATION_REPLICATION.
- Future interpretations:
  Q0 MARKET_COMMON_MOVE_EXPLANATION;
  Q1 SECTOR_SYNCHRONIZATION_EXPLANATION;
  Q2 LEADER_FOLLOWER_PROPAGATION_EXPLANATION;
  Q3 FUTURES_ETF_PRICE_DISCOVERY_EXPLANATION;
  Q4 NONSYNCHRONOUS_TRADING_EXPLANATION;
  Q5 MULTIPLE_COMMON_CHANNELS;
  Q6 STRUCTURAL_RESPONSE_RESIDUAL;
  Q7 DIRECTION_UNKNOWN;
  Q8 NOT_EVALUABLE.
- New files:
  - research/PATTERN_COMMON_PRICE_DISCOVERY_FIREWALL_V0_1.md
  - research/pattern_common_price_discovery_firewall_v0_1.json
  - research/pattern_common_price_discovery_firewall_v0_1.mjs
  - research/test_pattern_common_price_discovery_firewall_v0_1.mjs
  - research/PATTERN_COMMON_PRICE_DISCOVERY_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open under canonical queue.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-060

1. Reconcile the DL-060 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-060 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve market, sector, leader, futures/ETF and supply-chain price-discovery channels separately.
4. Consume D03/D07/breadth-rotation/D05/D18 owner receipts rather than creating D01 lead-lag models.
5. Hand L0-L11 / Q0-Q8 common-price-discovery residual inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural response from index-weight / mega-cap mechanical contribution and constituent-arbitrage effects around market/sector moves.
8. No runtime wiring / no Formal change.

## Continuation update — DL-061 (2026-10-07)

### DL-061 — Structural response vs index-weight / passive-flow / constituent-arbitrage effects
- DL-060 separated structural response from common price discovery.
- DL-061 adds a stricter mechanical-attribution firewall:
  index weighting;
  passive rebalancing;
  ETF creation/redemption;
  ETF/futures price discovery;
  basket arbitrage;
  mega-cap concentration;
  constituent synchronization.
- External evidence motivates the firewall:
  Hasbrouck (2003) finds major equity-index price discovery can occur in E-mini futures / ETF markets;
  Ben-David/Franzoni/Moussawi (2018) find ETF arbitrage can propagate liquidity shocks into underlying stocks;
  index-effect literature documents price pressure / demand shifts around index changes;
  recent work documents excess index-member comovement that need not come from firm fundamentals.
- D01 does not own those mechanisms.
  It consumes canonical receipts from:
  D06-11 passive/rebalancing;
  D06-16 ETF mechanics;
  D11-14 index-event clocks;
  D19-15 benchmark methodology/weight vintages;
  D12 derivative context;
  D18 large-cap/leadership context.
- Major new falsifier:
  a cap-weighted market/sector index containing the target stock is partially endogenous.
  RAW_INDEX_RETURN_IS_EXOGENOUS_CONTROL = FALSE when targetIncluded = true.
- Historical target weight, benchmark methodology and composition vintage must be known by predictor freeze.
  Current weights may not backfill historical dates.
- If a target is in the benchmark and no owner-certified self-excluded/decontaminated benchmark exists:
  benchmark state = SELF_INCLUDED_BENCHMARK_ONLY;
  external-market-control interpretation is fail-closed.
- D01 does not construct ad-hoc ex-self returns by subtracting weight × target return because benchmark mechanics can involve float adjustment, divisor rules, corporate actions, constituent changes, return type and auction conventions.
- Frozen index-weight states:
  TARGET_NOT_IN_BENCHMARK;
  TARGET_INCLUDED_WEIGHT_KNOWN;
  TARGET_INCLUDED_WEIGHT_UNKNOWN;
  SELF_EXCLUDED_BENCHMARK_VERIFIED;
  SELF_INCLUDED_BENCHMARK_ONLY;
  INDEX_METHODOLOGY_OR_VINTAGE_UNKNOWN;
  INDEX_RECONSTITUTION_ACTIVE;
  WEIGHT_CHANGE_ACTIVE.
- Mega-cap context preserves target weight, owner-certified concentration / cap-vs-equal-weight / breadth context.
  D01 defines no arbitrary mega-cap threshold.
- Passive/rebalance states remain separated:
  announcement;
  effective session;
  add/delete/transfer;
  weight change;
  modeled passive flow;
  verified actual passive execution;
  execution unknown;
  data blocked.
- ETF primary-market semantics remain strict:
  MODELED_PRIMARY_BASKET_EXPOSURE != ACTUAL_AP_EXECUTION != ACTUAL_CONSTITUENT_EXECUTION.
  D06-16 owner receipts decide what is actually identified.
- ETF/futures mechanical context states include:
  ETF prior price discovery;
  futures prior price discovery;
  NAV/basis dislocation;
  modeled basket arbitrage;
  verified constituent arbitrage execution;
  multi-channel;
  direction unknown;
  data blocked.
- Hard clock:
  receiptKnownAt <= predictorFreezeAt < endpointWindowStart.
  Later mechanical context is POST_OPPORTUNITY_MECHANICAL_CONTEXT.
- Same-direction target/index/ETF/futures movement is context only, not independent confirmation.
- Primary generic comparator:
  G0 MECHANICAL_EVENT_AWAY_FROM_ZONE;
  G1 MECHANICAL_EVENT_AT_ZONE.
  If G1 adds no residual representation after common-support controls, mechanical context is sufficient.
- Complementary zone states preserve:
  no mechanical context;
  self-included index-only;
  verified self-excluded market move;
  passive event;
  ETF arbitrage;
  futures price discovery;
  multiple channels;
  unknown.
- Different instruments do not automatically create independent evidence.
  effectiveIndependentEvidenceCount remains 1 by default within one parent until D16 validates dependence/residual structure.
- SDA-001 remains open.
- SDA-002 remains open:
  composition/weight/methodology/event/ETF/futures receipts require firstObservableAt/knownAt/predictorFreezeAt/version/hash/replaySafe.
- Future D16 ladder:
  M0 RAW_ZONE_RESPONSE;
  M1-M4 inherit DL057-DL060;
  M5 SELF_INCLUDED_BENCHMARK_IDENTIFIED;
  M6 SELF_EXCLUDED_BENCHMARK_CONTROLLED;
  M7 INDEX_REBALANCE_PASSIVE_FLOW_CONTROLLED;
  M8 ETF_PRIMARY_MARKET_CONTEXT_CONTROLLED;
  M9 ETF_FUTURES_ARBITRAGE_CONTROLLED;
  M10 MEGA_CAP_CONCENTRATION_BREADTH_CONTROLLED;
  M11 GENERIC_MECHANICAL_EVENT_COMPARATOR_CONTROLLED;
  M12 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE;
  M13 MULTI_DATE_MULTI_SYMBOL_MULTI_INDEX_REPLICATION.
- Future interpretation states:
  Q0 SELF_INCLUDED_BENCHMARK_CIRCULARITY;
  Q1 INDEX_WEIGHT_MECHANICAL_EXPLANATION;
  Q2 PASSIVE_REBALANCE_EXPLANATION;
  Q3 ETF_ARBITRAGE_EXPLANATION;
  Q4 FUTURES_PRICE_DISCOVERY_EXPLANATION;
  Q5 CONSTITUENT_COMOVEMENT_EXPLANATION;
  Q6 MEGA_CAP_CONCENTRATION_EXPLANATION;
  Q7 MULTIPLE_MECHANICAL_CHANNELS;
  Q8 STRUCTURAL_RESPONSE_RESIDUAL;
  Q9 NOT_EVALUABLE.
- New files:
  - research/PATTERN_INDEX_WEIGHT_ARBITRAGE_FIREWALL_V0_1.md
  - research/pattern_index_weight_arbitrage_firewall_v0_1.json
  - research/pattern_index_weight_arbitrage_firewall_v0_1.mjs
  - research/test_pattern_index_weight_arbitrage_firewall_v0_1.mjs
  - research/PATTERN_INDEX_WEIGHT_ARBITRAGE_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-061

1. Reconcile the DL-061 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-061 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Fail closed whenever a target-containing benchmark is used without historical target-weight/methodology vintage and a canonical self-excluded benchmark receipt.
4. Preserve MODELED vs ACTUAL passive/ETF execution semantics.
5. Hand M0-M13 / Q0-Q9 mechanical-attribution inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural response from opening/closing-auction mechanics, closing-index replication and end-of-session liquidity concentration.
8. No outcome join / no runtime wiring / no Formal change.

## Continuation update — DL-062 (2026-10-07)

### DL-062 — Structural response vs opening/closing auction and end-of-session liquidity
- DL-061 separated structural response from index-weight/passive/ETF/constituent-arbitrage mechanics.
- DL-062 freezes a Taiwan-specific session/microstructure firewall:
  opening call auction;
  closing call auction;
  indicative auction state;
  final auction print;
  delayed close;
  end-of-session liquidity concentration;
  month/quarter-end;
  index-rebalance/passive benchmark-close demand.
- TWSE official market structure:
  pre-open and pre-close are call-auction contexts;
  the last five minutes before close are auction order accumulation/matching;
  simulated transaction price/volume and order-book information are disseminated;
  final close can be delayed under extreme indicative-price changes;
  closing price is a widely used portfolio/index benchmark.
- Taiwan empirical work shows closing-call design and transparency materially affect closing volatility, efficiency, liquidity and month-end closing behavior.
- Therefore auction interactions are not assumed equivalent to ordinary continuous-trading structure tests.
- Frozen session states:
  CONTINUOUS_TRADING_UNCONSTRAINED;
  PREOPEN_INDICATIVE_ONLY;
  OPENING_CALL_FINAL_PRINT;
  CLOSING_CALL_INDICATIVE_ONLY;
  CLOSING_CALL_FINAL_PRINT;
  CLOSING_CALL_DELAYED;
  POST_CLOSE_FIXED_PRICE;
  SESSION_PHASE_UNKNOWN.
- INDICATIVE_PRICE != EXECUTED_PRICE.
  Indicative snapshots may be used only when their knownAt precedes predictorFreezeAt.
  The later final auction print may never be backfilled into the earlier predictor state.
- Any aggregate bar spanning continuous trading and the closing auction without phase decomposition is AUCTION_MIXED_BAR.
- AUCTION_MIXED_BAR may not be treated as pure continuous data for:
  touch;
  breakout;
  retest;
  wick/body;
  volume-confirmation semantics.
- Opening-call gap through a zone is OPENING_GAP_CROSSING, not a continuous path through the zone.
- If the only interaction occurs on the final closing-auction print:
  CLOSING_AUCTION_ONLY_INTERACTION.
  This is an observed interaction but a different microstructure class from continuous trading.
- Delayed closing match uses its actual execution time; it is never backdated to scheduled 13:30.
- Closing-price benchmark demand is separated into owner-certified contexts:
  month-end/quarter-end;
  index rebalance;
  constituent add/delete/weight change;
  modeled passive flow;
  verified passive execution;
  ETF primary-market context;
  derivative expiry/settlement where available;
  benchmark-close targeting.
- High closing volume alone does NOT prove passive flow.
- Close-liquidity descriptors may include owner-certified auction volume/share, spread/depth, indicative imbalance and market-wide concentration.
  D01 defines no arbitrary high-close-volume threshold.
- Primary closing comparator:
  G0 AUCTION_OR_CLOSE_MECHANICAL_EVENT_AWAY_FROM_ZONE;
  G1 AUCTION_OR_CLOSE_MECHANICAL_EVENT_AT_ZONE.
- Opening comparator remains separate:
  O0 OPENING_CALL_EVENT_AWAY_FROM_ZONE;
  O1 OPENING_CALL_EVENT_AT_ZONE.
- Opening/closing are not pooled because information sets, overnight risk, benchmark demand and liquidity composition differ.
- Required causal clock:
  mechanicalReceiptKnownAt <= predictorFreezeAt < endpointWindowStart.
- D04/D05 own microstructure/auction/liquidity context;
  D06 owns passive/ETF mechanics;
  D11 owns event/rebalance/expiry clocks where routed;
  D19 owns benchmark methodology;
  D12 owns derivative context;
  D16 owns dependence-aware inference.
- PRICE_OHLC ancestry remains de-duplicated under SDA-001:
  effectiveIndependentEvidenceCount = 1 by default within one parent.
- SDA-002 clock fields remain mandatory:
  firstObservableAt;
  knownAt;
  sessionPhase;
  predictorFreezeAt;
  source/version/hash;
  replaySafe.
- Future D16 ladder:
  A0 RAW_ZONE_RESPONSE;
  A1 CONTINUOUS_VS_AUCTION_PHASE_SEPARATED;
  A2 OPENING_GAP_CALL_CONTROLLED;
  A3 CLOSING_INDICATIVE_VS_FINAL_PRINT_SEPARATED;
  A4 CLOSING_LIQUIDITY_CONCENTRATION_CONTROLLED;
  A5 MONTH_END_QUARTER_END_CONTROLLED;
  A6 INDEX_REBALANCE_PASSIVE_CLOSE_CONTROLLED;
  A7 ETF_BENCHMARK_CLOSE_CONTEXT_CONTROLLED;
  A8 DERIVATIVE_EXPIRY_SETTLEMENT_CONTROLLED;
  A9 GENERIC_AUCTION_MECHANICAL_COMPARATOR_CONTROLLED;
  A10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE;
  A11 MULTI_DATE_MULTI_SYMBOL_MULTI_AUCTION_REPLICATION.
- Interpretation states:
  Q0 AUCTION_PHASE_EXPLANATION;
  Q1 OPENING_GAP_EXPLANATION;
  Q2 CLOSING_CALL_PRICE_PRESSURE_EXPLANATION;
  Q3 END_OF_SESSION_LIQUIDITY_EXPLANATION;
  Q4 PASSIVE_BENCHMARK_CLOSE_EXPLANATION;
  Q5 MONTH_END_OR_REBALANCE_EXPLANATION;
  Q6 DERIVATIVE_SETTLEMENT_EXPLANATION;
  Q7 MULTIPLE_CLOSE_MECHANISMS;
  Q8 STRUCTURAL_RESPONSE_RESIDUAL;
  Q9 NOT_EVALUABLE.
- New files:
  - research/PATTERN_AUCTION_CLOSE_LIQUIDITY_FIREWALL_V0_1.md
  - research/pattern_auction_close_liquidity_firewall_v0_1.json
  - research/pattern_auction_close_liquidity_firewall_v0_1.mjs
  - research/test_pattern_auction_close_liquidity_firewall_v0_1.mjs
  - research/PATTERN_AUCTION_CLOSE_LIQUIDITY_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 / SDA-002 remain open.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-062

1. Reconcile the DL-062 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-062 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve opening, continuous, pre-close indicative, final close, delayed close and post-close phases separately.
4. Treat auction-mixed bars as non-comparable to pure continuous bars unless phase decomposition is available.
5. Hand A0-A11 / Q0-Q9 auction-attribution inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural response from overnight information accumulation and previous-close anchoring across opening gaps.
8. No outcome join / no runtime wiring / no Formal change.

## Continuation update — DL-063 (2026-10-07)

### DL-063 — Structural response vs overnight information / previous-close anchoring
- DL-062 separated auction mechanics from continuous trading.
- DL-063 adds a Taiwan-specific overnight/opening attribution firewall:
  previous-close anchoring;
  overnight information accumulation;
  opening gap size;
  firm-specific news;
  market/sector/global overnight moves;
  pre-open futures/options price discovery;
  pre-open spot indicative state;
  opening order-flow/liquidity.
- Taiwan evidence directly motivates the split:
  listed stocks do not trade overnight, so information can concentrate into the next opening call;
  intraday and overnight return components have different predictive behavior;
  Taiwan pre-open index options/futures can carry information for the post-open spot/ETF market;
  older Taiwan microstructure evidence links opening prices to prior end-of-day quotes and order-flow dependence.
- Frozen overnight context states:
  NO_VERIFIED_OVERNIGHT_RECEIPT;
  VERIFIED_CORPORATE_OR_FIRM_NEWS;
  VERIFIED_MARKET_OR_SECTOR_OVERNIGHT_MOVE;
  VERIFIED_GLOBAL_MACRO_OR_CROSS_ASSET_MOVE;
  PREOPEN_INDEX_FUTURES_SIGNAL;
  PREOPEN_INDEX_OPTIONS_SIGNAL;
  PREOPEN_SPOT_INDICATIVE_SIGNAL;
  PREVIOUS_CLOSE_ANCHOR_NEAR_ZONE;
  MULTIPLE_OVERNIGHT_CHANNELS;
  OVERNIGHT_CONTEXT_UNKNOWN.
- Previous close is treated as a separate reference price, not as structural proof.
- Required geometry fields:
  priorCloseZoneDistance;
  openingZoneDistance;
  overnightGapPrice;
  overnightGapAtr;
  overnightGapPct;
  prior/opening side relative to the zone.
- D01 defines no arbitrary near-prior-close threshold.
- Opening across opposite sides of the zone remains OPENING_GAP_CROSSING.
  No continuous intraday path through the zone is invented.
- Required opening clock:
  openingFinalPrintKnownAt <= predictorFreezeAt < endpointWindowStart.
- The opening print cannot simultaneously serve as predictor and the same tested response outcome.
- Pre-open simulated prices/volumes remain indicative context only.
  Their exact knownAt snapshots may be stored;
  the final open may not overwrite prior indicative states.
- Owner-certified prior price-discovery channels remain separate:
  firm news;
  market/sector/global move;
  futures;
  options;
  spot indicative state;
  opening liquidity/order flow.
- D01 does not create an OVERNIGHT_SCORE.
- NO_VERIFIED_OVERNIGHT_RECEIPT does not mean NO_OVERNIGHT_CAUSAL_INFLUENCE.
  Unknown remains unknown.
- Primary comparator:
  G0 OVERNIGHT_SHOCK_AWAY_FROM_ZONE;
  G1 OVERNIGHT_SHOCK_AT_ZONE.
- Complementary previous-close comparator:
  P0 PRIOR_CLOSE_ANCHOR_AWAY_FROM_ZONE;
  P1 PRIOR_CLOSE_ANCHOR_NEAR_ZONE.
- Taiwan research suggests overnight information can be overreacted to at the open and later corrected.
  Therefore an opening bounce/reversal near a zone can reflect correction, liquidity normalization, prior-close anchoring or structural response.
- High opening volume alone does not identify informed trading.
- D08 owns news/event receipts;
  D09/D12 own overnight global/derivative context where routed;
  D03 owns timing/trend decomposition;
  D04/D05 own opening microstructure/liquidity;
  D18 owns regime;
  D16 owns residual inference.
- Future D16 ladder:
  N0 RAW_OPENING_ZONE_RESPONSE;
  N1 OPENING_AUCTION_PHASE_CONTROLLED;
  N2 PRIOR_CLOSE_ANCHOR_GEOMETRY_CONTROLLED;
  N3 OVERNIGHT_GAP_SIZE_CONTROLLED;
  N4 FIRM_SPECIFIC_OVERNIGHT_EVENT_CONTROLLED;
  N5 MARKET_SECTOR_GLOBAL_OVERNIGHT_MOVE_CONTROLLED;
  N6 PREOPEN_FUTURES_SIGNAL_CONTROLLED;
  N7 PREOPEN_OPTIONS_SIGNAL_CONTROLLED;
  N8 PREOPEN_SPOT_INDICATIVE_STATE_CONTROLLED;
  N9 OPENING_ORDER_FLOW_LIQUIDITY_CONTROLLED;
  N10 GENERIC_OVERNIGHT_SHOCK_COMPARATOR_CONTROLLED;
  N11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE;
  N12 MULTI_DATE_MULTI_SYMBOL_MULTI_OVERNIGHT_REGIME_REPLICATION.
- Interpretation states:
  Q0 PREVIOUS_CLOSE_ANCHOR_EXPLANATION;
  Q1 OVERNIGHT_INFORMATION_EXPLANATION;
  Q2 PREOPEN_DERIVATIVE_PRICE_DISCOVERY_EXPLANATION;
  Q3 OPENING_AUCTION_ORDER_FLOW_EXPLANATION;
  Q4 OPENING_OVERREACTION_CORRECTION_EXPLANATION;
  Q5 MULTIPLE_OVERNIGHT_CHANNELS;
  Q6 STRUCTURAL_RESPONSE_RESIDUAL;
  Q7 OVERNIGHT_CONTEXT_UNKNOWN;
  Q8 NOT_EVALUABLE.
- SDA-001 remains open:
  prior close, opening print and D01 structure share PRICE_OHLC ancestry;
  same-direction derivative/news context is not an automatic independent vote.
- SDA-002 remains open:
  all receipts require firstObservableAt/knownAt/predictorFreezeAt/source/version/hash/replaySafe.
- New files:
  - research/PATTERN_OVERNIGHT_OPENING_ANCHOR_FIREWALL_V0_1.md
  - research/pattern_overnight_opening_anchor_firewall_v0_1.json
  - research/pattern_overnight_opening_anchor_firewall_v0_1.mjs
  - research/test_pattern_overnight_opening_anchor_firewall_v0_1.mjs
  - research/PATTERN_OVERNIGHT_OPENING_ANCHOR_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-063

1. Reconcile the DL-063 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-063 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve previous-close geometry, overnight news/global/derivative context and opening liquidity as separate channels.
4. Never allow opening print or later overnight classifications to leak into the same predictor/outcome window.
5. Hand N0-N12 / Q0-Q8 residual inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural response from daily price-limit carryover and limit-hit queue mechanics across overnight/opening transitions.
8. No outcome join / no runtime wiring / no Formal change.

## Continuation update — DL-064 (2026-10-07)

### DL-064 — Structural response vs daily price-limit carryover / limit-queue mechanics
- DL-063 separated structural response from overnight information and previous-close anchoring.
- DL-064 freezes a Taiwan-specific daily-price-limit attribution firewall:
  daily upper/lower price boundaries;
  magnet/trading-interference effects;
  delayed price discovery;
  same-session order queue;
  latent unmet demand/supply;
  next-session resubmitted orders.
- TWSE ordinary stocks are generally limited to 10 percent above/below the current-session opening-auction reference price, subject to explicit exemptions.
- Historical opening-auction reference price, legal tick/rule vintage and exemption state must be owner-certified; D01 does not assume the reference price always equals prior close.
- Exchange order validity is session-limited.
  Therefore:
  PHYSICAL_ORDER_QUEUE_SAME_SESSION;
  LATENT_UNMET_DEMAND_OR_SUPPLY_CARRYOVER;
  NEXT_SESSION_RESUBMITTED_ORDERS
  are three different objects.
- Same physical order queue does not persist overnight.
- Same-price pre-opening priority is randomly arranged by the exchange, while post-open orders follow time priority after price priority.
- Close at limit does not prove a locked queue.
  Queue state requires timestamped owner-certified order-book/imbalance receipts.
- Frozen limit states:
  NO_LIMIT_PROXIMITY_RECEIPT;
  LIMIT_PROXIMITY_ONLY;
  FIRST_LIMIT_HIT;
  LIMIT_HIT_WITH_VERIFIED_QUEUE;
  LIMIT_HIT_QUEUE_UNKNOWN;
  UNLOCK_RELOCK;
  CLOSE_AT_LIMIT_WITH_VERIFIED_QUEUE;
  CLOSE_AT_LIMIT_QUEUE_UNKNOWN;
  PRICE_LIMIT_EXEMPT_OR_NOT_APPLICABLE;
  LIMIT_STATE_DATA_BLOCKED.
- Verified queue volume is microstructure context, not structural strength.
  No LIMIT_QUEUE_STRENGTH_SCORE is defined.
- Taiwan high-frequency evidence supports an upper-limit magnet effect and broader price-limit literature supports delayed price discovery/trading interference.
  Taiwan daily evidence also finds overnight continuation after limit moves and later intraday reversal/correction.
- A structural zone overlapping the legal daily price boundary is STRUCTURE_PRICE_LIMIT_COLOCATION, not independent confluence.
- Default effectiveIndependentEvidenceCount remains 1 for co-located price-limit/price-structure representations.
- Same-day comparator:
  G0 LIMIT_EVENT_AWAY_FROM_STRUCTURAL_ZONE;
  G1 LIMIT_EVENT_AT_STRUCTURAL_ZONE.
- Separate next-day comparator:
  N0 PRIOR_DAY_LIMIT_EVENT_AWAY_FROM_ZONE;
  N1 PRIOR_DAY_LIMIT_EVENT_AT_ZONE.
- Next-day continuation may reflect delayed price discovery or latent unmet demand, but never proves the same physical queue survived overnight.
- Required cross-session fields preserve:
  day-t final queue receipt;
  day-t last unlock;
  order validity end;
  day-t+1 pre-open state;
  day-t+1 opening print/reference;
  day-t+1 new queue receipt.
- No day-t queue volume is copied into day t+1.
- Price-limit exemption sessions do not receive fabricated upper/lower bounds.
- D04/D05 own queue/depth/liquidity microstructure;
  D08 owns news/event context;
  D09/D12 own overnight/global/derivative context where routed;
  D16 owns residual inference.
- SDA-001 remains open:
  price-limit price/path and D01 structure share PRICE_OHLC ancestry;
  queue context is not an automatic independent vote.
- SDA-002 remains open:
  every limit/queue receipt needs firstObservableAt/knownAt/predictorFreezeAt/source/version/hash/replaySafe.
- Future D16 ladder:
  P0 RAW_ZONE_RESPONSE;
  P1 PRICE_LIMIT_REFERENCE_AND_EXEMPTION_IDENTIFIED;
  P2 DISTANCE_TO_LIMIT_CONTROLLED;
  P3 LIMIT_HIT_PATH_CONTROLLED;
  P4 QUEUE_VISIBILITY_AND_IMBALANCE_CONTROLLED;
  P5 UNLOCK_RELOCK_CONTROLLED;
  P6 NEWS_EVENT_CONTEXT_CONTROLLED;
  P7 SAME_DAY_GENERIC_LIMIT_COMPARATOR_CONTROLLED;
  P8 OVERNIGHT_CONTEXT_CONTROLLED;
  P9 NEXT_SESSION_RESUBMISSION_OPENING_CONTROLLED;
  P10 NEXT_DAY_GENERIC_LIMIT_CARRYOVER_COMPARATOR_CONTROLLED;
  P11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE;
  P12 MULTI_DATE_MULTI_SYMBOL_MULTI_LIMIT_REGIME_REPLICATION.
- Interpretation states:
  Q0 PRICE_LIMIT_MAGNET_EXPLANATION;
  Q1 TRADING_INTERFERENCE_EXPLANATION;
  Q2 QUEUE_IMBALANCE_EXPLANATION;
  Q3 DELAYED_PRICE_DISCOVERY_EXPLANATION;
  Q4 OVERREACTION_CORRECTION_EXPLANATION;
  Q5 NEWS_OR_EVENT_EXPLANATION;
  Q6 STRUCTURE_LIMIT_COLOCATION_REDUNDANCY;
  Q7 STRUCTURAL_RESPONSE_RESIDUAL;
  Q8 LIMIT_STATE_UNKNOWN;
  Q9 NOT_EVALUABLE.
- New files:
  - research/PATTERN_PRICE_LIMIT_CARRYOVER_FIREWALL_V0_1.md
  - research/pattern_price_limit_carryover_firewall_v0_1.json
  - research/pattern_price_limit_carryover_firewall_v0_1.mjs
  - research/test_pattern_price_limit_carryover_firewall_v0_1.mjs
  - research/PATTERN_PRICE_LIMIT_CARRYOVER_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-064

1. Reconcile the DL-064 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-064 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve physical same-session queue, latent unmet demand and next-session resubmitted orders as different objects.
4. Never infer locked queue from close-at-limit alone or copy day-t queue volume into day t+1.
5. Hand P0-P12 / Q0-Q9 price-limit residual inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural response from ex-dividend/ex-right reference-price adjustments and corporate-action price discontinuities near structural zones.
8. No outcome join / no runtime wiring / no Formal change.

## Continuation update — DL-065 (2026-10-07)

### DL-065 — Structural response vs corporate-action price discontinuity / continuity spaces
- DL-064 separated structural response from daily price-limit and cross-session queue mechanics.
- DL-065 freezes corporate-action semantic-space attribution:
  RAW_EXECUTION;
  TECHNICAL_CONTINUITY;
  PRICE_INDEX_COMPARABLE;
  TOTAL_RETURN_COMPARABLE.
- Corporate Actions lane remains canonical owner of adjustment factors, event lifecycle/version provenance, suspension/resumption interaction and cross-space semantics.
- D01 consumes those receipts fail-closed and does not build an independent adjustment engine.
- TWSE official data/rules provide dedicated ex-right/ex-dividend reference-price semantics, including prior close, adjusted reference price, rights/dividend values, opening reference and price limits.
- Capital reduction, cash-refund capital reduction, demerger and par-value changes can mechanically rescale reference prices.
- Therefore raw-price discontinuity may be a mechanical reset rather than a genuine traversal through support/resistance.
- Required distinction:
  RAW_MECHANICAL_GAP = raw discontinuity explained by verified action reset;
  CONTINUITY_GAP = residual gap after canonical TECHNICAL_CONTINUITY transform.
- Only continuity-space geometry may support technical gap/breakout claims across a verified price-reset event.
- A pre-event structural root does not automatically die.
  If the action is a mechanical price-unit/reference reset and causal lineage remains valid:
  CORPORATE_ACTION_CONTINUITY_VERSION.
  This is a version of the same root, not a new independent root.
- RAW_EXECUTION remains mandatory for actual tradable open/high/low/close and cost/slippage semantics.
  Adjusted/continuity prices are not executable prices.
- Prohibited mechanical Pattern evidence includes:
  cash-dividend drop as bearish gap;
  capital-reduction reference jump as bullish breakout;
  par-value change as reversal;
  mechanically relocated high/low as a fresh structural level.
- Corporate action event versions must preserve firstKnownAt/finalScheduleKnownAt/effectiveDate/eventVersion/factorVersion/replaySafe.
  Historical replay uses only versions known by predictorFreezeAt.
- Missing technicalPriceFactor is DATA_BLOCKED; factor=1 is never a missing-data default.
- Provider-adjusted history without point-in-time adjustment-vintage evidence is replay-unsafe.
- Reference fields remain separate:
  previousRawClose;
  economicAdjustmentReference;
  exchangeOpeningReference;
  providerAdjustedAnchor;
  dailyChangeReference.
  Conflicts fail closed rather than being collapsed.
- Price adjustment does not automatically define volume adjustment.
  D01 consumes Corporate Actions volume modes:
  NONE;
  UNIT_SCALE;
  SUPPLY_CHANGE;
  UNKNOWN.
- Fill-right/fill-dividend behavior is later outcome, not evidence for choosing the adjustment factor.
- Verified suspension sessions are removed from expected symbol-session continuity only under canonical provenance.
  Unknown suspension provenance stays blocked; no pseudo-bars are inserted.
- RAW_EXECUTION and TECHNICAL_CONTINUITY are two semantic views of one PRICE_OHLC parent and do not create two independent confirmations.
- Primary comparator:
  G0 CORPORATE_ACTION_EVENT_AWAY_FROM_STRUCTURAL_ZONE;
  G1 CORPORATE_ACTION_EVENT_AT_STRUCTURAL_ZONE.
- Required raw-vs-continuity falsifier reports:
  RAW cross / CONTINUITY no-cross;
  RAW gap / CONTINUITY mechanical reset;
  RAW support break / CONTINUITY preserved;
  both spaces agree.
- Taiwan 2026 ex-dividend evidence also finds pre-ex-date appreciation/activity and incomplete reversal after the event, reinforcing that post-event price behavior is an empirical outcome and not part of mechanical adjustment truth.
- Future D16 ladder:
  C0 RAW_PRICE_ZONE_RESPONSE;
  C1 CORPORATE_ACTION_EVENT_IDENTIFIED;
  C2 POINT_IN_TIME_EVENT_VERSION_CONTROLLED;
  C3 TECHNICAL_CONTINUITY_FACTOR_VERIFIED;
  C4 RAW_VS_CONTINUITY_GEOMETRY_SEPARATED;
  C5 SYMBOL_SESSION_SUSPENSION_CONTROLLED;
  C6 VOLUME_SEMANTICS_CONTROLLED;
  C7 REFERENCE_CONFLICTS_EXCLUDED_OR_STRATIFIED;
  C8 GENERIC_CORPORATE_ACTION_COMPARATOR_CONTROLLED;
  C9 PROVIDER_ADJUSTMENT_VINTAGE_CONTROLLED;
  C10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE;
  C11 MULTI_ACTION_MULTI_DATE_MULTI_SYMBOL_REPLICATION.
- Interpretation states:
  Q0 MECHANICAL_REFERENCE_RESET_EXPLANATION;
  Q1 CORPORATE_ACTION_GAP_EXPLANATION;
  Q2 CAPITAL_UNIT_RESCALE_EXPLANATION;
  Q3 SUSPENSION_RESUMPTION_EXPLANATION;
  Q4 PROVIDER_ADJUSTMENT_LOOKAHEAD_EXPLANATION;
  Q5 VOLUME_SEMANTIC_CONTAMINATION;
  Q6 REFERENCE_CONFLICT;
  Q7 STRUCTURAL_RESPONSE_RESIDUAL;
  Q8 EVENT_COVERAGE_UNKNOWN;
  Q9 NOT_EVALUABLE.
- New files:
  - research/PATTERN_CORPORATE_ACTION_CONTINUITY_FIREWALL_V0_1.md
  - research/pattern_corporate_action_continuity_firewall_v0_1.json
  - research/pattern_corporate_action_continuity_firewall_v0_1.mjs
  - research/test_pattern_corporate_action_continuity_firewall_v0_1.mjs
  - research/PATTERN_CORPORATE_ACTION_CONTINUITY_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-065

1. Reconcile the DL-065 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-065 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Consume Corporate Actions lane receipts; never build a second D01 adjustment engine.
4. Preserve RAW_EXECUTION and TECHNICAL_CONTINUITY simultaneously and keep volume semantics independent from price factors.
5. Hand C0-C11 / Q0-Q9 continuity-attribution inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural response from suspension/resumption stale-price anchoring and reopening price discovery after multi-session no-trade intervals.
8. No outcome join / no runtime wiring / no Formal change.

## Continuation update — DL-066 (2026-10-07)

### DL-066 — Structural response vs suspension/resumption stale-price anchoring
- DL-065 separated corporate-action mechanical resets from technical continuity.
- DL-066 freezes suspension/resumption attribution:
  verified suspension interval;
  stale pre-suspension price;
  information accumulation while no trade occurs;
  resumption call auction;
  reopening order flow/liquidity;
  market/sector/global movement during the no-trade interval.
- VERIFIED_SUSPENSION_SESSION != SOURCE_MISSING_SESSION.
- Verified suspension sessions receive no OHLC pseudo-bars, no forward-filled close and no zero-volume fabricated bar.
- Unknown suspension provenance remains DATA_BLOCKED.
- Two clocks are permanently separated:
  ELIGIBLE_TRADING_SESSION_AGE does not increment during verified suspension;
  CALENDAR_INFORMATION_AGE continues through real-world elapsed time.
- Required fields also preserve suspensionCalendarDays and suspensionMarketSessions.
- Last pre-suspension price is PRE_SUSPENSION_PRICE_STALE_ANCHOR_CANDIDATE, not proof of current equilibrium after resumption.
- Owner-certified information accumulated during suspension remains separate:
  firm/material news;
  corporate-action changes;
  market/sector/global move;
  derivatives/futures context;
  regime transition.
- No SUSPENSION_NEWS_SCORE is defined.
- Frozen resumption states:
  VERIFIED_SUSPENSION_ACTIVE;
  RESUMPTION_ORDER_ACCEPTANCE;
  RESUMPTION_INDICATIVE_STATE;
  RESUMPTION_FIRST_CALL_PRINT;
  POST_RESUMPTION_CONTINUOUS_TRADING;
  RESUMPTION_DELAYED_OR_DEFERRED;
  SUSPENSION_PROVENANCE_UNKNOWN.
- The first resumption call print is not equivalent to a continuous-trading touch.
- Reopening discovery is now further separated:
  LAST_EXECUTED_PRICE_BEFORE_SUSPENSION;
  EXCHANGE_REOPENING_REFERENCE;
  FIRST_REOPENING_AUCTION_PRICE;
  FIRST_CONTINUOUS_TRADE_AFTER_REOPENING;
  POST_REOPENING_STABILIZED_REFERENCE.
- FIRST_REOPENING_AUCTION_PRICE != CONFIRMED_BREAKOUT.
- Same-session short halt, one-session suspension, multi-session suspension and canonical extended suspension remain distinct freshness states.
- No arbitrary stale-duration score is defined.
- Discovery windows (first auction / first 5m / first 15m / first 30m / first session) must be preregistered; best-after-outcome window selection is prohibited.
- Root reconfirmation from first call alone is prohibited; a separate post-resumption observable confirmation rule is required.
- Opposite-side first resumption print across an old zone is RESUMPTION_GAP_CROSSING.
  No unobserved path through the zone is invented.
- Suspension does not automatically invalidate an old structural root, but residual structural attribution requires stale-anchor/information/reopening controls.
- Resumption reference price must be owner-certified and is not assumed equal to last pre-suspension close.
- Same-day halt/resumption and multi-session suspension are not pooled automatically.
- Pre-suspension order queue does not establish resumption queue identity.
  Fresh order-book receipts are required.
- If suspension overlaps a corporate-action reset, DL-065 continuity receipt is mandatory.
- If resumption is constrained by daily price limits, DL-064 limit-state receipt is mandatory.
- DL-062 auction semantics remain mandatory for a call-auction first print.
- Taiwan official rules support the mechanism:
  suspension stops new order acceptance;
  resumption first matching may be by call auction;
  information-assessment suspension exists to control material-information asymmetry.
- Taiwan empirical work finds post-disclosure price/volume effects can remain elevated after suspension, reinforcing information-accumulation/repricing as an alternative to structural-memory claims.
- Primary comparator:
  G0 RESUMPTION_EVENT_AWAY_FROM_OLD_STRUCTURAL_ZONE;
  G1 RESUMPTION_EVENT_AT_OLD_STRUCTURAL_ZONE.
- Future D16 ladder:
  S0 RAW_RESUMPTION_ZONE_RESPONSE;
  S1 VERIFIED_SUSPENSION_INTERVAL_CONTROLLED;
  S2 ELIGIBLE_SESSION_VS_CALENDAR_AGE_SEPARATED;
  S3 PRE_SUSPENSION_STALE_ANCHOR_CONTROLLED;
  S4 FIRM_INFORMATION_DURING_SUSPENSION_CONTROLLED;
  S5 MARKET_SECTOR_GLOBAL_MOVE_CONTROLLED;
  S6 CORPORATE_ACTION_CONTINUITY_CONTROLLED;
  S7 RESUMPTION_REFERENCE_AND_AUCTION_CONTROLLED;
  S8 PRICE_LIMIT_CONTEXT_CONTROLLED;
  S9 REOPENING_ORDER_FLOW_LIQUIDITY_CONTROLLED;
  S10 GENERIC_SUSPENSION_COMPARATOR_CONTROLLED;
  S11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE;
  S12 MULTI_DURATION_MULTI_EVENT_MULTI_SYMBOL_REPLICATION.
- Interpretation states:
  Q0 STALE_PRICE_ANCHOR_EXPLANATION;
  Q1 INFORMATION_ACCUMULATION_EXPLANATION;
  Q2 REOPENING_PRICE_DISCOVERY_EXPLANATION;
  Q3 CORPORATE_ACTION_RESET_EXPLANATION;
  Q4 PRICE_LIMIT_CATCHUP_EXPLANATION;
  Q5 REOPENING_LIQUIDITY_EXPLANATION;
  Q6 MULTIPLE_SUSPENSION_MECHANISMS;
  Q7 STRUCTURAL_RESPONSE_RESIDUAL;
  Q8 SUSPENSION_PROVENANCE_UNKNOWN;
  Q9 NOT_EVALUABLE.
- SDA-001 remains open: old zone/stale price/resumption price share PRICE_OHLC ancestry; external context is not automatic extra vote.
- SDA-002 remains open: exact suspension/resumption knownAt and replay-safe receipts remain mandatory.
- New files:
  - research/PATTERN_SUSPENSION_RESUMPTION_FIREWALL_V0_1.md
  - research/pattern_suspension_resumption_firewall_v0_1.json
  - research/pattern_suspension_resumption_firewall_v0_1.mjs
  - research/test_pattern_suspension_resumption_firewall_v0_1.mjs
  - research/PATTERN_SUSPENSION_RESUMPTION_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-066

1. Reconcile the DL-066 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-066 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve verified suspension sessions as non-trading sessions, not missing bars or pseudo-bars.
4. Preserve eligible trading-session age and calendar information age as distinct clocks.
5. Hand S0-S12 / Q0-Q9 suspension-attribution inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural response from intraday volatility interruption / delayed matching / dynamic price-stabilization mechanics, which are not the same as multi-session suspension.
8. No outcome join / no runtime wiring / no Formal change.



## Continuation update — DL-067 (2026-10-07)

### DL-067 — Structural response vs intraday volatility interruption / delayed matching
- DL-066 separated multi-session suspension/resumption stale-price anchoring from technical structure.
- DL-067 freezes TWSE intraday volatility interruption as a separate matching-mechanism layer.
- Official TWSE rule facts were re-read live from the current trading-mechanism page:
  potential execution price beyond +/-3.5% of the interruption reference triggers the mechanism;
  matching is postponed for two minutes;
  resumption occurs by call auction and then continuous trading resumes;
  market/IOC/FOK orders are not accepted during interruption;
  existing market orders are automatically deleted;
  limit ROD orders may be added;
  the restart call-auction price becomes the reference for the next five minutes before rolling five-minute weighted-average reference resumes.
- This mechanism is NOT multi-session suspension and NOT the daily price limit.
- Trigger potential execution price is not an executed price and cannot be used as a breakout/support-break event.
- Reference regimes are frozen separately:
  OPENING_REFERENCE_PHASE;
  ROLLING_FIVE_MINUTE_REFERENCE;
  POST_INTERRUPTION_RESET_REFERENCE.
- Frozen interruption states:
  NORMAL_CONTINUOUS_TRADING;
  INTERRUPTION_TRIGGER_CANDIDATE;
  MATCHING_POSTPONED;
  INTERRUPTION_ORDER_ACCEPTANCE;
  RESTART_CALL_AUCTION;
  RESTART_CALL_PRINT;
  POST_INTERRUPTION_REFERENCE_RESET_WINDOW;
  RETURN_TO_ROLLING_CONTINUOUS_REFERENCE;
  INTERRUPTION_PROVENANCE_UNKNOWN.
- Two-minute matching delay is not price acceptance.
- Pre-trigger order set does not remain unchanged because order eligibility changes and market orders may be deleted.
- Structural crossing states are separated:
  TRIGGER_POTENTIAL_ZONE_CROSS;
  RESTART_CALL_ZONE_CROSS;
  POST_INTERRUPTION_CONTINUOUS_CROSS_OBSERVED.
- No continuous path through the delayed interval is invented.
- Restart call print != confirmed breakout.
- Post-interruption structural confirmation requires a preregistered observation window; best-after-outcome window selection is prohibited.
- DL-064 daily-price-limit and DL-062 auction semantics remain mandatory.
- One interruption episode keeps one immutable event identity; repeated snapshots do not multiply N.
- Primary comparators:
  G0 HIGH_VOLATILITY_MOVE_WITHOUT_INTERRUPTION_AT_STRUCTURAL_ZONE;
  G1 VOLATILITY_INTERRUPTION_AT_STRUCTURAL_ZONE;
  H0 VOLATILITY_INTERRUPTION_AWAY_FROM_STRUCTURAL_ZONE;
  H1 VOLATILITY_INTERRUPTION_AT_STRUCTURAL_ZONE.
- Future D16 ladder:
  V0 RAW_STRUCTURAL_RESPONSE;
  V1 VOLATILITY_INTERRUPTION_EVENT_IDENTIFIED;
  V2 TRIGGER_POTENTIAL_VS_EXECUTED_PRICE_SEPARATED;
  V3 REFERENCE_PRICE_REGIME_CONTROLLED;
  V4 MATCHING_DELAY_CONTROLLED;
  V5 ORDER_SET_MUTATION_CONTROLLED;
  V6 RESTART_CALL_AUCTION_CONTROLLED;
  V7 POST_INTERRUPTION_REFERENCE_RESET_CONTROLLED;
  V8 DAILY_PRICE_LIMIT_CONTEXT_CONTROLLED;
  V9 TIME_OF_DAY_AND_TRADING_PHASE_CONTROLLED;
  V10 GENERIC_HIGH_VOLATILITY_COMPARATOR_CONTROLLED;
  V11 AWAY_FROM_ZONE_INTERRUPTION_COMPARATOR_CONTROLLED;
  V12 LIQUIDITY_ORDER_FLOW_CONTROLLED;
  V13 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE;
  V14 MULTI_EVENT_MULTI_SYMBOL_MULTI_REGIME_REPLICATION.
- Interpretation states:
  Q0 TRIGGER_WITHOUT_EXECUTION_EXPLANATION;
  Q1 MATCHING_DELAY_EXPLANATION;
  Q2 ORDER_SET_MUTATION_EXPLANATION;
  Q3 RESTART_AUCTION_EXPLANATION;
  Q4 REFERENCE_RESET_EXPLANATION;
  Q5 DAILY_LIMIT_INTERACTION_EXPLANATION;
  Q6 GENERIC_HIGH_VOLATILITY_EXPLANATION;
  Q7 LIQUIDITY_ORDER_FLOW_EXPLANATION;
  Q8 STRUCTURAL_RESPONSE_RESIDUAL;
  Q9 INTERRUPTION_PROVENANCE_UNKNOWN;
  Q10 NOT_EVALUABLE.
- New files:
  - research/PATTERN_INTRADAY_VOLATILITY_INTERRUPTION_FIREWALL_V0_1.md
  - research/pattern_intraday_volatility_interruption_firewall_v0_1.json
  - research/pattern_intraday_volatility_interruption_firewall_v0_1.mjs
  - research/test_pattern_intraday_volatility_interruption_firewall_v0_1.mjs
  - research/PATTERN_INTRADAY_VOLATILITY_INTERRUPTION_D16_HANDOFF_V0_1.md
- 20 adversarial tests authored; TEST_EXECUTION_PENDING.
- SDA-001 remains open: price-derived interruption/pattern states share PRICE_OHLC ancestry by default.
- SDA-002 remains open: trigger/reference/restart timestamps require replay-safe first-known receipts.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no R09.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-067

1. Reconcile the DL-067 Class-A branch against then-latest main before PR because parallel rooms remain active.
2. Treat V8 Repair/Regression CI only as Formal-isolation evidence; DL-067 research Node tests remain TEST_EXECUTION_PENDING unless independently executed.
3. Preserve trigger-potential price, restart call price and first post-interruption continuous trade as distinct states.
4. Consume D04/D05 trading-phase, auction, liquidity and order-book receipts; do not build a second D01 matching engine.
5. Hand V0-V14 / Q0-Q10 mechanism-attribution inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural response from disposition-security periodic matching / altered matching cadence, where apparent persistence may be a microstructure artifact.
8. No outcome join / no runtime wiring / no Formal change.


## Continuation update — DL-068~070 (2026-10-07)

### DL-068 — Disposition-security periodic matching / altered cadence
- Official TWSE attention/disposition rules were re-read live.
- Disposition can alter matching cadence, prepayment/full-payment, margin/short-sale constraints, broker order caps and in severe cases trading status.
- Periodic matching != continuous matching.
- WALL_CLOCK_TIME and MATCHING_OPPORTUNITY_COUNT are separate clocks.
- Fewer prints do not prove low information arrival.
- Repeated same-price auction prints do not automatically strengthen support/resistance.
- Volume concentrated at periodic call auctions requires cadence normalization.
- Disposition assignment is endogenous to prior abnormal price/volume/turnover path; naive before/after design is selection-biased.
- Primary comparator separates matched abnormal/attention securities with continuous matching from disposition securities with periodic matching.
- D16 ladder P0-P12 frozen.
- 12 adversarial tests authored; TEST_EXECUTION_PENDING.

### DL-069 — Attention/disposition public-label effect
- PRE_LABEL_ABNORMAL_PATH, PUBLIC_LABEL_EVENT and TRADING_MECHANISM_INTERVENTION are now distinct causal objects/clocks.
- Regulatory label is not a directional technical signal.
- Public salience/broker warnings/financing constraints may change behavior after publication.
- Post-label breakout/reversal cannot be attributed to the prior structural level without controlling the abnormal trigger path.
- Repeated notices/extensions under one surveillance chain keep one regulatoryRootId; notices do not multiply N.
- Three future estimands are separated:
  A label increment;
  B mechanism increment;
  C structural-zone increment.
- D16 ladder L0-L12 frozen.
- 12 adversarial tests authored; TEST_EXECUTION_PENDING.

### DL-070 — Sparse-liquidity / stale-print / price-clustering false structure
- Research literature was deep-read across support/resistance memory, liquidity-gap price changes, liquidity crises, price clustering and call-auction formation.
- Measurable support/resistance memory and microstructure artifacts can coexist; neither literature cancels the other.
- REPEATED_BAR_PRICE != REPEATED_EXECUTION.
- Zero-trade bars, carried prices, duplicate vendor prints and one auction split into multiple bars are prohibited as independent touches.
- Tick size, zone width in ticks and round-price clustering are explicit controls.
- Certified order-book-gap crossing is LIQUIDITY_GAP_CROSSING, not breakout strength.
- Bounce denominator must retain all eligible roots, including no-revisit, crossed, expired and data-blocked roots.
- Arbitrary calendar half-life is rejected.
- Competing future freshness clocks frozen:
  ELIGIBLE_SESSION_COUNT;
  INDEPENDENT_EXECUTION_COUNT;
  INFORMATION_EVENT_COUNT;
  VOLATILITY_DISTANCE_TRAVELED;
  LIQUIDITY_OPPORTUNITY_COUNT.
- D16 ladder I0-I12 frozen.
- 12 adversarial tests authored; TEST_EXECUTION_PENDING.

### Evidence / governance
- New evidence ledger:
  research/D01_DL068_070_EVIDENCE_LEDGER_V0_1.md
- New DL-068 files:
  research/PATTERN_DISPOSITION_PERIODIC_MATCHING_FIREWALL_V0_1.md
  research/pattern_disposition_periodic_matching_firewall_v0_1.json
  research/pattern_disposition_periodic_matching_firewall_v0_1.mjs
  research/test_pattern_disposition_periodic_matching_firewall_v0_1.mjs
  research/PATTERN_DISPOSITION_PERIODIC_MATCHING_D16_HANDOFF_V0_1.md
- New DL-069 files:
  research/PATTERN_REGULATORY_LABEL_FIREWALL_V0_1.md
  research/pattern_regulatory_label_firewall_v0_1.json
  research/pattern_regulatory_label_firewall_v0_1.mjs
  research/test_pattern_regulatory_label_firewall_v0_1.mjs
  research/PATTERN_REGULATORY_LABEL_D16_HANDOFF_V0_1.md
- New DL-070 files:
  research/PATTERN_ILLIQUIDITY_FALSE_STRUCTURE_FIREWALL_V0_1.md
  research/pattern_illiquidity_false_structure_firewall_v0_1.json
  research/pattern_illiquidity_false_structure_firewall_v0_1.mjs
  research/test_pattern_illiquidity_false_structure_firewall_v0_1.mjs
  research/PATTERN_ILLIQUIDITY_FALSE_STRUCTURE_D16_HANDOFF_V0_1.md
- SDA-001 remains open.
- SDA-002 remains open.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-070

1. Execute DL-068/069/070 research Node adversarial tests independently; until then keep TEST_EXECUTION_PENDING.
2. Reconcile branch against latest main before merge; current main drift observed during the tranche is System2-only and does not touch D01 files.
3. Start DL-071: structural-level freshness tournament.
4. Pre-register competing freshness clocks (eligible sessions, independent executions, information events, volatility distance, liquidity opportunities) before any outcome join.
5. Define root-level denominator and negative controls so expired/no-revisit roots remain in the population.
6. Hand freshness-model comparison to D16; no best-after-outcome clock selection.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. No Formal Core change.


## Continuation update — DL-071 (2026-10-07)

### DL-071 — Structural-level freshness tournament
- DL-070 rejected arbitrary calendar half-life.
- DL-071 freezes five competing preregistered freshness clocks before any outcome join:
  ELIGIBLE_SESSION_COUNT;
  INDEPENDENT_EXECUTION_COUNT;
  INFORMATION_EVENT_COUNT;
  VOLATILITY_DISTANCE_TRAVELED;
  LIQUIDITY_OPPORTUNITY_COUNT.
- Calendar elapsed time remains context, not an automatically valid decay law.
- Every canonical structural root enters one append-only population and remains in the denominator even if never revisited, expired, crossed, rebased, overlapped by suspension/disposition, or data blocked.
- Touch history is separate from freshness:
  age clock;
  revisit count;
  bounce count;
  cross count;
  time since last interaction;
  interaction sequence
  are distinct fields.
- Monotone decay is not assumed. Candidate shapes include MONOTONE_DECAY, HUMP_SHAPED, THRESHOLD_DECAY, NO_DECAY, NONMONOTONIC and NOT_IDENTIFIED.
- The tournament must freeze transformation families, primary comparison metric, tie rule, minimum common support and multiple-testing plan before outcomes.
- NO_WINNER is explicitly valid.
- Future bounce/cross cannot enter clock construction.
- Five clocks are alternate representations of one latent freshness concept, not five independent confirmation votes.
- D16 ladder F0-F12 frozen.
- 12 adversarial tests authored; TEST_EXECUTION_PENDING.
- New files:
  - research/PATTERN_STRUCTURAL_FRESHNESS_TOURNAMENT_V0_1.md
  - research/pattern_structural_freshness_tournament_v0_1.json
  - research/pattern_structural_freshness_tournament_v0_1.mjs
  - research/test_pattern_structural_freshness_tournament_v0_1.mjs
  - research/PATTERN_STRUCTURAL_FRESHNESS_D16_HANDOFF_V0_1.md
- SDA-001 remains open.
- SDA-002 remains open.
- No outcome join; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-071

1. Execute DL-068~071 research Node tests independently; keep TEST_EXECUTION_PENDING until actual execution evidence exists.
2. Start DL-072: repeated-touch strength decomposition.
3. Separate familiarity/self-fulfilling memory from resting-liquidity depletion/consumption and adverse-selection migration.
4. Never assume more historical touches monotonically strengthen a level.
5. Preserve immutable root/touch lineage and one PRICE_OHLC information root unless independent evidence exists.
6. Hand residual inference to D16 with same-root common support and prospective/OOS validation.
7. Keep SDA-001/SDA-002 open.
8. No Formal Core change.


## Continuation update — DL-072~073 (2026-10-07)

### DL-072 — Repeated-touch strength decomposition
- Repeated-touch folklore was decomposed into competing mechanisms instead of a monotone touch-count rule.
- Frozen mechanisms:
  COORDINATION_REINFORCEMENT;
  RESTING_LIQUIDITY_DEPLETION;
  STIMULATED_REPLENISHMENT;
  ADVERSE_SELECTION_WITHDRAWAL;
  MICROSTRUCTURE_ARTIFACT.
- More touches are not assumed stronger or weaker.
- Touch identity requires immutable execution/match lineage; duplicate provider bars/prints do not multiply touches.
- Touch order is preserved rather than collapsed into one scalar count.
- Candidate empirical shapes include reinforcing, depleting, U-shaped, inverted-U, threshold, no relation, state dependent and unidentified.
- D04/D05 remain canonical owners of spread/depth/order-book/resiliency evidence; D01 consumes receipts only.
- Within-root and matched between-root comparators are both required.
- D16 ladder T0-T13 frozen.
- 10 adversarial tests authored; TEST_EXECUTION_PENDING.

### DL-073 — Structural-zone width / precision-illusion firewall
- Exact-price support/resistance was rejected as a default semantic.
- Structural geometry is represented as a zone with explicit lower/upper bounds and uncertainty.
- Candidate width families:
  TICK_FIXED;
  SPREAD_SCALED;
  VOLATILITY_SCALED;
  EXECUTION_DISTRIBUTION;
  HYBRID_PREREGISTERED.
- Multiple width families are challenger representations of one geometry object, not independent votes.
- Crossing states are separated:
  ENTER_ZONE;
  TOUCH_ZONE;
  PARTIAL_PENETRATION;
  FULL_ZONE_CROSS;
  CLOSE_BEYOND_ZONE;
  RECLAIM_ZONE;
  DATA_BLOCKED.
- One-tick penetration is not automatically a breakout.
- Outcome-based zone resizing is direct lookahead and prohibited.
- Width must be reported in ticks, basis points and volatility units.
- D16 ladder Z0-Z11 frozen.
- 10 adversarial tests authored; TEST_EXECUTION_PENDING.

### Evidence / governance
- Deep-read evidence supports coexistence of technical-level memory, depth depletion, liquidity replenishment and adverse-selection withdrawal.
- Therefore touch count alone cannot identify the operative mechanism.
- Evidence ledger:
  research/D01_DL072_073_EVIDENCE_LEDGER_V0_1.md
- New DL-072 files:
  research/PATTERN_REPEATED_TOUCH_DECOMPOSITION_V0_1.md
  research/pattern_repeated_touch_decomposition_v0_1.json
  research/pattern_repeated_touch_decomposition_v0_1.mjs
  research/test_pattern_repeated_touch_decomposition_v0_1.mjs
  research/PATTERN_REPEATED_TOUCH_D16_HANDOFF_V0_1.md
- New DL-073 files:
  research/PATTERN_ZONE_WIDTH_PRECISION_FIREWALL_V0_1.md
  research/pattern_zone_width_precision_firewall_v0_1.json
  research/pattern_zone_width_precision_firewall_v0_1.mjs
  research/test_pattern_zone_width_precision_firewall_v0_1.mjs
  research/PATTERN_ZONE_WIDTH_D16_HANDOFF_V0_1.md
- SDA-001 remains open.
- SDA-002 remains open.
- No outcome join; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-073

1. Execute DL-068~073 research Node tests independently; keep TEST_EXECUTION_PENDING until actual execution evidence exists.
2. Start DL-074: zone-width / target-price / stop-loss / RR geometry interaction.
3. Prevent the same structural uncertainty from being counted once in zone width, again in stop distance, and again in target/RR confidence.
4. Separate geometric uncertainty from execution/slippage uncertainty and from volatility risk.
5. Preserve D01-11 ownership of target/resistance/RR geometry while routing execution cost to D10 and microstructure to D04/D05.
6. Hand residual incrementality to D16.
7. Keep SDA-001/SDA-002 open.
8. No Formal Core change.


## Continuation update — DL-074 (2026-10-07)

### DL-074 — Zone width / stop / target / RR uncertainty firewall
- D01-11 target/resistance/RR geometry was extended with explicit uncertainty lineage.
- Structural geometry uncertainty, execution uncertainty, volatility risk, event-gap risk and model-selection uncertainty are now distinct objects.
- The same uncertainty root may not be counted repeatedly in zone width, confirmation padding, stop padding, target haircut or confidence.
- Gross geometric RR and executable RR are permanently separated.
- Executable RR requires owner-certified execution cost/slippage receipt; D01 does not fabricate slippage.
- Candidate stop families frozen:
  ZONE_INVALIDATION_STOP;
  VOLATILITY_SCALED_STOP;
  SWING_INVALIDATION_STOP;
  FIXED_RISK_STOP;
  HYBRID_PREREGISTERED_STOP.
- Candidate target families frozen:
  NEXT_STRUCTURAL_RESISTANCE;
  MEASURED_MOVE;
  PRIOR_SWING_EXTREME;
  VOLATILITY_SCALED_TARGET;
  HYBRID_PREREGISTERED_TARGET.
- Stop/target selection after observing survival/outcome is prohibited.
- Wider structural uncertainty is not assumed to widen stop and target symmetrically.
- D16 ladder R0-R12 frozen.
- 10 adversarial tests authored; TEST_EXECUTION_PENDING.
- New files:
  - research/PATTERN_RR_UNCERTAINTY_FIREWALL_V0_1.md
  - research/pattern_rr_uncertainty_firewall_v0_1.mjs
  - research/test_pattern_rr_uncertainty_firewall_v0_1.mjs
  - research/pattern_rr_uncertainty_firewall_v0_1.json
  - research/PATTERN_RR_UNCERTAINTY_D16_HANDOFF_V0_1.md
  - research/D01_DL074_EVIDENCE_LEDGER_V0_1.md
- Research evidence reinforces that transaction costs can erase apparent technical-rule profitability and that stop/take-profit levels are jointly dependent decision objects.
- SDA-001 remains open.
- SDA-002 remains open.
- No outcome join; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-074

1. Execute DL-068~074 research Node tests independently; keep TEST_EXECUTION_PENDING until actual execution evidence exists.
2. Start DL-075: breakout-confirmation / retest-entry / stop-placement path dependence.
3. Preserve one immutable structural episode even when one episode emits breakout, retest, reclaim and continuation representations.
4. Prevent the same price path from becoming multiple independent trade signals.
5. Separate entry timing quality from structural alpha and from execution quality.
6. Hand episode-level residual inference to D16.
7. Keep SDA-001/SDA-002 open.
8. No Formal Core change.


## Continuation update — DL-075~077 (2026-10-07)

### DL-075 — Structural episode identity / multi-signal alias firewall
- One structural price episode can emit breakout, retest, reclaim, continuation, higher-low, momentum and trend-filter representations.
- These representations default to one immutable structuralEpisodeId and one PRICE_OHLC information root.
- Raw signal count and effective independent evidence count are now explicitly separated.
- A retest does not automatically create a new root.
- New root requires prior episode completion/invalidation plus preregistered, replay-safe new-root formation.
- Entry timing value, execution quality and risk geometry are separated from structural information value.
- Failed breakout/retest states remain in lifecycle even if a later reclaim succeeds.
- D16 ladder E0-E12 frozen.
- 10 adversarial tests authored; TEST_EXECUTION_PENDING.

### DL-076 — Retest path quality / confirmation-delay tradeoff
- Retest-required entry is not assumed safer or superior.
- The full breakout denominator must retain no-retest, retest-continue, retest-fail, immediate-fail, immediate-continue-without-retest and data-blocked episodes.
- Conditioning only on observed retests is survivor/selection bias.
- Confirmation latency, confirmation price distance, missed move, remaining reward distance and stop distance are distinct.
- Any apparent retest advantage must be decomposed into structural reconfirmation, waiting/selection, better risk geometry, execution differences, opportunity cost and regime confounding.
- D16 ladder R0-R12 frozen.
- 10 adversarial tests authored; TEST_EXECUTION_PENDING.

### DL-077 — Multi-timeframe structural aliasing firewall
- Daily/hourly/15m/5m structural signals must trace to source-trade lineage.
- Different bar aggregation does not create independent information.
- Same episode + overlapping source trades + no independent non-price root defaults to one PRICE_OHLC vote.
- Lower-timeframe signals may become observable before higher-timeframe bars close.
- Incomplete higher-timeframe bars may not backfill earlier decisions.
- Cross-timeframe conflict is classified as episode phase/root/staleness/incompleteness/regime-transition state, not automatically counted as two signals.
- Timeframe sets must be preregistered; best-after-outcome timeframe selection is prohibited.
- D16 ladder M0-M12 frozen.
- 10 adversarial tests authored; TEST_EXECUTION_PENDING.

### Evidence / governance
- New evidence ledgers:
  research/D01_DL075_076_EVIDENCE_LEDGER_V0_1.md
  research/D01_DL077_EVIDENCE_LEDGER_V0_1.md
- This tranche materially advances research remediation for SDA-001/SDA-002, but neither audit item is closed without D16 incrementality/readback and engineering closure evidence.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-077

1. Execute DL-068~077 research Node tests independently; keep TEST_EXECUTION_PENDING until actual execution evidence exists.
2. Start DL-078: structural confluence vs geometric coincidence among nearby zones.
3. Define when two nearby zones are one merged uncertainty object versus genuinely distinct roots.
4. Prevent support/resistance clustering, moving-average coincidence and prior-swing coincidence from multiplying votes without distinct information roots.
5. Preserve zone topology and root lineage across merge/split operations.
6. Hand confluence incrementality and merge/split sensitivity to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. No Formal Core change.


## Continuation update — DL-078 (2026-10-07)

### DL-078 — Structural confluence vs geometric coincidence firewall
- Raw confluence count is no longer treated as independent evidence count.
- Nearby prior highs, necklines, moving averages, round numbers, prior swings and gaps must preserve object/root/episode lineage.
- Same-root overlapping zones and deterministic transforms merge into one uncertainty object under preregistered topology rules.
- Merge preserves all parent lineage but does not multiply evidence count.
- Split is allowed only under preregistered rules with predictor-time observable distinct roots; outcome-based split is prohibited.
- Genuine confluence requires independently generated, owner-certified roots.
- Price-only overlap remains one PRICE_OHLC family unless independent root evidence exists.
- Topology metrics frozen:
  overlapTicks;
  overlapBps;
  overlapVolatilityUnits;
  centerDistanceTicks;
  unionWidthTicks;
  intersectionWidthTicks;
  rootCount;
  effectiveIndependentRootCount.
- No arbitrary CONFLUENCE_SCORE is defined.
- D16 ladder C0-C11 frozen.
- 10 adversarial tests authored; TEST_EXECUTION_PENDING.
- New files:
  - research/PATTERN_CONFLUENCE_TOPOLOGY_FIREWALL_V0_1.md
  - research/pattern_confluence_topology_firewall_v0_1.mjs
  - research/test_pattern_confluence_topology_firewall_v0_1.mjs
  - research/pattern_confluence_topology_firewall_v0_1.json
  - research/PATTERN_CONFLUENCE_TOPOLOGY_D16_HANDOFF_V0_1.md
  - research/D01_DL078_EVIDENCE_LEDGER_V0_1.md
- This tranche directly advances SDA-001 but does not close it.
- SDA-002 remains open.
- No outcome join; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-078

1. Execute DL-068~078 research Node tests independently; keep TEST_EXECUTION_PENDING until actual execution evidence exists.
2. Start DL-079: cluster-level topology persistence and zone migration.
3. Preserve root lineage when zones drift, widen, narrow, merge or split through time.
4. Prevent a moving zone from being reissued as a new independent root each session.
5. Separate genuine new price discovery from deterministic moving-window drift.
6. Hand migration persistence and root-renewal sensitivity to D16.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. No Formal Core change.


## Continuation update — DL-079~080 (2026-10-07)

### DL-079 — Zone migration / root persistence firewall
- Zone version and structural root are now separate identities.
- Center drift, widening, narrowing, reshape, merge and split can remain one structuralRootId while zoneVersionId advances.
- Moving-window/adaptive transformations do not create new independent information merely because the representation moves.
- Every version preserves root-forming observation-set lineage.
- Root renewal requires preregistered completion/coexistence semantics, a genuinely distinct observation set, non-deterministic transformation, predictor-time firstObservableAt, minimum topology separation and no future outcome use.
- Merge/split operations preserve parent lineage and do not multiply evidence by themselves.
- Frozen migration metrics:
  centerShiftTicks;
  centerShiftBps;
  widthChangeTicks;
  overlapRatio;
  unionWidthTicks;
  intersectionWidthTicks;
  parentObservationOverlapRatio;
  newObservationShare;
  elapsedEligibleSessions.
- D16 ladder G0-G11 frozen.
- 10 adversarial tests authored.
- Independent V8-equivalent deterministic execution: 10 / 10 PASS.
- Native Node environment-parity execution remains separate and is not claimed.

### DL-080 — Structural break / regime reset firewall
- Regime/change-point context may alter root relevance, but only through replay-safe receipts known by predictor freeze.
- Retrospective best-fit break dates cannot enter live predictors.
- D01 does not build a second regime engine; owner-certified regime receipts are consumed as context.
- Root treatment states now separate unchanged activity, contextual activity, freshness reevaluation, geometry reestimation, temporary block, mechanical invalidation, new-price-discovery invalidation and unknown state.
- Regime change alone does not automatically invalidate all old structural roots.
- Abrupt/gradual and volatility/trend/liquidity/multidimensional changes remain distinct.
- New post-break roots are not automatically independent alpha.
- Regime context is not an extra confirmation vote.
- D16 ladder B0-B11 frozen.
- 10 adversarial tests authored.
- Independent V8-equivalent deterministic execution: 10 / 10 PASS.
- Native Node environment-parity execution remains separate and is not claimed.

### Deterministic execution evidence
- DL-068~078: 118 / 118 PASS under V8-equivalent research execution.
- DL-079~080: 20 / 20 PASS under V8-equivalent research execution.
- Cumulative DL-068~080: 138 / 138 PASS.
- Evidence files:
  research/D01_DL068_078_TEST_EXECUTION_EVIDENCE_20261007_V0_1.md
  research/D01_DL079_080_TEST_EXECUTION_EVIDENCE_20261007_V0_1.md
- This closes deterministic helper/test execution evidence under V8-equivalent semantics only.
- It does not close native Node parity, Taiwan historical validation, OOS/prospective validation, D16 incrementality, SDA-001, SDA-002, or Formal promotion.

### Evidence / governance
- New research files:
  research/PATTERN_ZONE_MIGRATION_ROOT_PERSISTENCE_FIREWALL_V0_1.md
  research/pattern_zone_migration_root_persistence_firewall_v0_1.mjs
  research/test_pattern_zone_migration_root_persistence_firewall_v0_1.mjs
  research/pattern_zone_migration_root_persistence_firewall_v0_1.json
  research/PATTERN_ZONE_MIGRATION_ROOT_PERSISTENCE_D16_HANDOFF_V0_1.md
  research/PATTERN_STRUCTURAL_BREAK_REGIME_RESET_FIREWALL_V0_1.md
  research/pattern_structural_break_regime_reset_firewall_v0_1.mjs
  research/test_pattern_structural_break_regime_reset_firewall_v0_1.mjs
  research/pattern_structural_break_regime_reset_firewall_v0_1.json
  research/PATTERN_STRUCTURAL_BREAK_REGIME_RESET_D16_HANDOFF_V0_1.md
  research/D01_DL079_080_EVIDENCE_LEDGER_V0_1.md
- SDA-001 remains open.
- SDA-002 remains open.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Current D01 maturity remains 52.7%.
- Pattern alpha UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-080

1. Native Node environment-parity execution remains optional evidence work; deterministic research logic is already 138/138 PASS under V8-equivalent execution.
2. Start DL-081: large discontinuity root survival versus gradual-drift root survival.
3. Separate event gap, price-limit catch-up, suspension/resumption, corporate-action mechanics and genuine information repricing before any old-root survival claim.
4. Compare abrupt discontinuity versus gradual regime drift under the same structural-root lineage.
5. Preserve old-root failure/survival outcomes in the denominator; do not reset history at the break.
6. Hand root-survival heterogeneity to D16 with prospective/OOS validation.
7. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
8. No Formal Core change.


## Continuation update — DL-081~086 (2026-10-07)

### DL-081 — Discontinuity vs gradual-drift root survival
- Abrupt discontinuity and gradual drift are now separate structural-root survival problems.
- Event gaps, price-limit catch-up, suspension/resumption repricing, corporate-action mechanical resets, liquidity gaps, market-wide gaps and symbol-specific information repricing are not pooled.
- Every pre-existing root remains in the denominator across a break.
- Break date does not reset root history.
- D16 ladder D0-D11 frozen.
- 8 adversarial tests authored and 8/8 PASS under V8-equivalent deterministic execution.

### DL-082 — D01-02 single-candle morphology PIT contract
- Traditional candle names are deterministic aliases over normalized OHLC morphology.
- body/range, wick/range, close-location, gap, tick and session state are explicit replay-safe features.
- Completed-bar first-observable semantics are frozen.
- Zero-trade, synthetic, price-limit, corporate-action, suspension and few-tick illiquidity contamination are explicit.
- Named-candle value must be tested against raw normalized OHLC geometry.
- D01-02 PIT data contract = FEASIBLE.
- 8 adversarial tests authored and 8/8 PASS.

### DL-083 — D01-03 multi-candle sequence PIT contract
- Named multi-bar patterns are aliases over sourceBarIds and normalized inter-bar relations.
- Sliding-window overlap is measured and deduped.
- firstObservableAt is the close/availability of the final required bar, not pattern start.
- Failed and unresolved sequences remain in the denominator.
- Named sequence value must beat raw N-bar geometry.
- D01-03 PIT data contract = FEASIBLE.
- 8 adversarial tests authored and 8/8 PASS.

### DL-084 — D01-07 cup/base/handle PIT contract
- Cup/base/handle is now an online lifecycle, not a retrospective template.
- Candidate, left-side, trough, right-side, rim-retest, handle, breakout, confirmed, failed, expired and blocked states are preserved.
- Backpainting completed cups to the left edge is prohibited.
- Parameter families must be preregistered.
- Failed/expired bases remain in the denominator.
- Pattern-specific value must beat prior trend, range compression and generic breakout baselines.
- D01-07 PIT data contract = FEASIBLE.
- 8 adversarial tests authored and 8/8 PASS.

### DL-085 — D01-09 gap / price-limit PIT contract
- Gap taxonomy now separates ordinary opening gaps, market-wide gaps, symbol-event gaps, mechanical corporate-action gaps, suspension/resumption gaps, price-limit delayed discovery, liquidity gaps and vendor/data gaps.
- Gap fill is an outcome, not predictor-time information.
- The full gap denominator retains never-filled/censored/mechanical/price-limit/data-blocked cases.
- Taiwan price-limit/session mechanics and earlier D01 continuity firewalls are explicit upstream controls.
- D01-09 PIT data contract = FEASIBLE.
- 8 adversarial tests authored and 8/8 PASS.

### DL-086 — Remaining L2 to L3 PIT promotion audit
- D01-02, D01-03, D01-07 and D01-09 now each satisfy:
  mechanism + falsifiers;
  predictor-time receipt;
  firstObservableAt / predictorFreezeAt;
  no-lookahead lifecycle;
  deterministic executable contract;
  Taiwan trading/continuity routing;
  raw-price/redundancy controls;
  explicit evidence boundary for L4/L5.
- Promotion recommendation:
  D01-02 L2/40 -> L3/60;
  D01-03 L2/40 -> L3/60;
  D01-07 L2/40 -> L3/60;
  D01-09 L2/40 -> L3/60.
- Recommended D01 maturity after tracker governance = 60.0%.
- This is PIT-feasibility promotion only; alpha remains UNKNOWN.

### Deterministic execution evidence
- DL-068~080 cumulative: 138/138 PASS under V8-equivalent execution.
- DL-081~085: 40/40 PASS.
- DL-068~085 cumulative: 178/178 PASS.
- Native Node environment parity remains unclaimed.

### Evidence / governance
- New evidence ledger:
  research/D01_DL081_085_EVIDENCE_LEDGER_V0_1.md
- New execution evidence:
  research/D01_DL081_085_TEST_EXECUTION_EVIDENCE_20261007_V0_1.md
- Promotion audit:
  research/D01_DL086_L2_TO_L3_PIT_PROMOTION_AUDIT_V0_1.md
- SDA-001 remains OPEN.
- SDA-002 remains OPEN.
- No outcome join; no historical Shadow fabrication; no runtime/Worker/D1 wiring; no Formal change.
- Pattern alpha UNKNOWN.
- Formal Core LOCKED.

### Updated exact next continuation point after DL-086

1. Apply the four L2->L3 PIT promotions to the canonical tracker from latest main after this research tranche is merged.
2. Start DL-087: D01 L3-to-L4 empirical validation portfolio.
3. Prioritize D01-02/D01-03/D01-07/D01-09 with identical Taiwan PIT universe and common benchmark controls.
4. Freeze outcome horizons, transaction-cost treatment, multiplicity correction, walk-forward splits and no-winner policy before historical outcome joins.
5. Require raw-OHLC/raw-sequence/generic-breakout controls before pattern-specific claims.
6. Hand statistical incrementality to D16; no pattern promotion without OOS evidence.
7. Keep SDA-001/SDA-002 open.
8. No Formal Core change.


## Tracker governance update — D01 L3 PIT promotion applied (2026-10-07)

- Canonical tracker promotion applied after DL-086 audit:
  - D01-02: L2 / 40 -> L3 / 60
  - D01-03: L2 / 40 -> L3 / 60
  - D01-07: L2 / 40 -> L3 / 60
  - D01-09: L2 / 40 -> L3 / 60
- D01 canonical maturity:
  - before: 52.7%
  - after: 60.0%
- All 11 D01 modules are now L3.
- This promotion means Taiwan PIT data feasibility only.
- It does NOT establish historical alpha, OOS/prospective value, Shadow readiness, SDA closure, or Formal Core promotion.
- Cumulative deterministic V8-equivalent execution through DL-085 remains 178 / 178 PASS.
- SDA-001 remains OPEN.
- SDA-002 remains OPEN.
- Formal Core remains LOCKED.

### Exact next continuation after tracker promotion

1. DL-087: preregister D01 L3-to-L4 empirical validation portfolio.
2. Use one Taiwan PIT universe and synchronized outcome windows for all 11 D01 modules.
3. Prioritize D01-02, D01-03, D01-07 and D01-09 because they were the last PIT-feasibility promotions.
4. Freeze transaction costs, benchmark controls, multiple-testing correction, walk-forward folds, common-support rules and NO_WINNER policy before outcome joins.
5. Require pattern-specific incrementality over raw OHLC / raw N-bar geometry / generic compression / generic breakout controls.
6. Route statistical inference to D16.
7. No Formal Core change.


## Continuation update — DL-087 (2026-10-07)

### DL-087 — L3-to-L4 prospective/OOS validation portfolio preregistration
- All 11 D01 modules are now L3; L4 requires PROSPECTIVE_SHADOW_OR_OOS_EVIDENCE.
- One common Taiwan PIT empirical protocol is frozen before any new outcome join.
- Primary research universe preserves point-in-time listing status, delisting/failure histories where available, suspension/disposition states and ordinary common-equity identity.
- Formal System-1 deployment filters are secondary sensitivity analysis, not baked into the primary scientific universe.
- Primary outcome families frozen:
  structural reaction;
  forward returns at 1 / 5 / 20 eligible sessions;
  MFE / MAE on the same horizons;
  executable economic endpoint only with owner-certified cost receipt.
- Common-parent controls are mandatory for every named pattern family.
- Chronological protocol frozen:
  expanding-window primary validation;
  minimum initial train span 3 complete years;
  1 complete year test fold;
  purge/embargo at least 20 eligible sessions;
  final most-recent complete 1-year holdout untouched by tuning.
- Primary multiplicity control:
  hierarchical Benjamini-Yekutieli FDR within D01 correlated hypothesis families.
- Secondary D16 robustness:
  SPA / Reality-Check-style family comparison where owner-certified.
- Search registry must count every attempted parameter/template variant.
- Allowed conclusions:
  SUPPORTED;
  REFUTED;
  INCONCLUSIVE;
  NOT_EVALUABLE.
- NO_WINNER remains valid.
- First empirical wave:
  D01-02;
  D01-03;
  D01-07;
  D01-09.
- 10 deterministic protocol tests authored and 10 / 10 PASS under V8-equivalent execution.
- Cumulative D01 deterministic equivalent execution through DL-087:
  188 / 188 PASS.
- No module is promoted to L4 in this tranche because no OOS/prospective outcome evidence has yet been joined.

### Governance
- D01 canonical maturity remains 60.0%.
- All 11 modules remain L3.
- SDA-001 remains OPEN.
- SDA-002 remains OPEN.
- Outcome join remains CLOSED.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-087

1. Start DL-088: Taiwan PIT empirical-data readiness audit for D01-02 / D01-03 / D01-07 / D01-09.
2. Resolve exact historical coverage, delisting/listing membership, session-status, corporate-action, suspension, price-limit and disposition receipts.
3. Freeze one executable dataset manifest before opening outcomes.
4. If first-wave coverage gates pass, hand OOS execution to D16 under DL-087.
5. No L4 promotion until completed OOS or prospective Shadow evidence exists.


## Continuation update — DL-088~091 (2026-10-07)

### DL-088 — First-wave Taiwan PIT empirical-data readiness audit
- First-wave L4 candidates remain D01-02, D01-03, D01-07 and D01-09.
- Raw historical price availability is now explicitly separated from causal replay readiness.
- TWSE 2018-2024:
  data coverage PASS;
  conservative session-finality PIT PASS;
  official current + new-listing + delisting universe union PASS;
  official delisting union complete;
  replay readiness PARTIAL;
  continuity PARTIAL_UNVERIFIED;
  technical-price readiness PARTIAL_NONPRICE_OBSERVATIONS;
  symbol-session readiness PARTIAL_UNKNOWN_GAPS.
- TWSE 2018-2024 current UNKNOWN symbol-session gap total = 4,036.
- TPEx 2017-2023 raw price coverage is accepted but the universe remains PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION and official delisting union complete=false.
- TPEx 2017-2023 current UNKNOWN symbol-session gap total = 2,533.
- 2024 TPEx remains PENDING / NOT ACCEPTED; current blocker is infrastructure/execution quota after earlier transport/timeout hardening, not proven source corruption.
- 2025 annual history remains pending; 2026 segmented path remains physical-execution pending.
- Full-Taiwan first-wave dataset is therefore BLOCKED.

### Causal context blockers frozen
- Symbol-session lifecycle:
  repository normalization/source hardening exists, but physical historical completeness is not closed; TPEx lifecycle expansion remains unresolved.
- Corporate-action continuity:
  mechanics and positive witnesses exist, but whole-market replay-complete historical event/clear-state coverage is not closed.
- Suspension/resumption:
  bounded official source evidence exists, but bounded absence cannot certify no-suspension and all-history completeness is not certified.
- Price-limit/reference state:
  source/rule feasibility is L3-ready, but exact first-wave historical per-symbol/per-session receipt materialization is not complete.
- Disposition/matching regime:
  mechanism is frozen, but replay-complete historical matching-cadence coverage is not proven.

### DL-089 — Bounded TWSE pre-outcome dataset manifest
- Market = TWSE only.
- Warmup-only year = 2018.
- Inference years = 2019-2024.
- Fold 1:
  train 2019-2021;
  test 2022;
  minimum purge/embargo 20 eligible sessions.
- Fold 2:
  train 2019-2022;
  test 2023;
  minimum purge/embargo 20 eligible sessions.
- Final untouched holdout = 2024.
- Frozen horizons remain 1 / 5 / 20 eligible sessions.
- No year substitution is allowed after outcomes.
- TPEx cannot be appended later into this TWSE result as though one predeclared sample.
- Manifest is FROZEN but EXECUTION_BLOCKED.

### DL-090 — Module evaluability / owner routing
- D01-02 = RAW_FEATURE_READY / CAUSAL_OOS_BLOCKED.
- D01-03 = SEQUENCE_FEATURE_READY / CAUSAL_OOS_BLOCKED.
- D01-07 = DETECTOR_CONTRACT_READY / CAUSAL_OOS_BLOCKED.
- D01-09 = RAW_GAP_READY / CAUSAL_OOS_BLOCKED.
- D01 does not dispatch/rewrite System2 history, redefine the historical universe, infer clean state from source absence, build a second price-limit engine, or execute D16 outcome inference.
- Exact blocker ownership is routed to existing System2 DATA/BUILD, Corporate Actions, D05, D10 and D16 owners.

### DL-091 — Source/context receipt interface
- R1 membership receipt frozen.
- R2 raw A1 observation receipt frozen.
- R3 symbol-session lifecycle receipt frozen.
- R4 corporate-action continuity receipt frozen.
- R5 price-limit/reference-price receipt frozen.
- R6 disposition/matching-regime receipt frozen.
- R7 D01 pattern-observability receipt frozen.
- R8 D16 outcome-availability receipt frozen.
- R9 D16 validation-policy receipt frozen.
- Common temporal rule:
  firstObservableAt <= predictorFreezeAt.
- Source absence cannot certify clean/normal state unless completenessScope itself is complete.
- Any UNKNOWN mandatory predictor/context receipt => CAUSAL_OOS_BLOCKED.

### Deterministic execution evidence
- DL-088~090 readiness oracle:
  first isolate attempt stopped only because structuredClone was unavailable;
  test was rewritten with ordinary object copying without changing expectations;
  final 14 / 14 PASS.
- DL-091 receipt-bundle oracle:
  15 / 15 PASS.
- This tranche:
  29 / 29 PASS.
- Cumulative D01 deterministic V8-equivalent execution through DL-091:
  217 / 217 PASS.
- Native Node parity remains unclaimed.

### Governance
- D01 canonical maturity remains 60.0%.
- All 11 D01 modules remain L3.
- No L4 promotion because no completed causal OOS/prospective Shadow evidence exists.
- SDA-001 remains OPEN.
- SDA-002 remains OPEN.
- Outcome join remains CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-091

1. Start DL-092: bounded exact-window physical-receipt positive-control audit.
2. Search current repository evidence for at least one TWSE symbol/window where R1-R7 can all be physically satisfied without opening any future return.
3. Use positive control only to verify interface composability, not pattern performance.
4. If a complete R1-R7 bundle does not exist, record the exact missing receipt families and remain BLOCKED.
5. Do not weaken completeness rules to manufacture a clean example.
6. After an R1-R7 positive control exists, hand the same interface to D16 for future R8/R9 outcome execution.
7. No L4 promotion and no Formal Core change.


## Continuation update — DL-092 (2026-10-07)

### DL-092 — Exact-window R1-R7 positive-control bundle audit
- Current repository evidence was searched for a real TWSE symbol/window where DL-091 R1-R7 could all be physically satisfied without opening future returns.
- Existing rich mechanics candidates:
  8422 on 2025-11-17;
  3593 on 2025-12-22;
  8103 on 2025-12-08.
- Existing corporate-action feature-window evidence explicitly reports these candidates as:
  pointInTimeReady=true;
  technicalPriceReady=true;
  technicalVolumeReady=true;
  eligibleForMechanicsDelta=true;
  eventCoverageComplete=UNKNOWN;
  eligibleForOutcomeInference=false.
- This proves useful mechanics/continuity examples but not exact-window inference completeness.

### Receipt findings
- R1:
  historical-universe infrastructure exists, but these strongest candidates sit in 2025 while canonical annual TWSE 2025 is still pending; no exact accepted annual-history bundle is claimed.
- R2:
  real raw-price witnesses exist, but the convenience mechanics artifacts are not themselves the DL-091 canonical A1 sourceRowHash/canonicalBarHash receipt.
- R3:
  positive suspension/resumption mechanics exist, but exact-window all-history lifecycle completeness is not certified.
- R4:
  continuity mechanics are demonstrable, but eventCoverageComplete remains UNKNOWN; inference readiness is false.
- R5:
  legal price-limit/reference source feasibility/specifications exist, but no exact-window DL-091-complete R5 receipt was found for the candidates.
- R6:
  disposition/matching mechanism contract exists, but no exact-window CERTIFIED_NORMAL_MATCHING or VERIFIED_DISPOSITION_MATCHING receipt was found.
- R7:
  D01 pattern-observability contract is ready but remains upstream-bundle dependent.

### Falsification
- Positive mechanics witness != inference-ready historical pattern window.
- Known corporate action != complete event coverage.
- Missing disposition match != normal continuous matching.
- Missing price-limit receipt != ordinary limit state.
- Therefore no R1-R7 positive-control bundle is currently certified.

### Test evidence
- DL-092 deterministic oracle:
  12 / 12 PASS under V8-equivalent execution.
- Cumulative through DL-092:
  229 / 229 PASS.
- Native Node parity remains unclaimed.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- R1_R7_POSITIVE_CONTROL_FOUND = FALSE.
- INTERFACE_COMPOSABILITY = PARTIAL.
- OOS_EXECUTION_READY = FALSE.
- SDA-001 remains OPEN.
- SDA-002 remains OPEN.
- Outcome join remains CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-092

1. Start DL-093: freeze one exact-window pre-outcome witness request on an already accepted TWSE historical year.
2. Prefer a simple ordinary/no-action window; do not select on future pattern success or returns.
3. Request only R1-R6 physical provenance from existing owners; D01 generates R7.
4. The witness need not contain any successful pattern.
5. Once one R1-R7 bundle passes, interface composability can become PASS, but no L4 promotion follows without OOS/prospective evidence.
6. No outcome join / no Formal Core change.


## Continuation update — DL-093~095 (2026-10-07)

### DL-093 — first exact-window pre-outcome witness frozen
- Witness:
  TWSE / 1101 / 2021-06-15.
- Interface cutoff:
  2021-06-15T23:59:59+08:00.
- Required history:
  exact 60 prior eligible symbol-sessions plus target date = 61 ordered symbol-sessions.
- Start date is not calendar-guessed; it must be derived from canonical symbol-session evidence.
- Selection reason is source composability, not outcome:
  2021 TWSE is an accepted historical raw/universe year;
  2021-06-15 was already a frozen historical TWT84U source witness date before DL-093;
  1101 is a long-standing ordinary TWSE source/history witness.
- No D1/D5/D20 return, MFE, MAE, later Pattern success or strategy outcome was used.
- Anti-cherry-pick rule:
  after context inspection, the witness may not be replaced merely because it contains a corporate action, suspension, disposition, unusual matching regime or inconvenient blocker.

### DL-094 — exact witness source-availability audit
- R1 membership:
  2021 TWSE owner infrastructure PASS at year level;
  registry = S2-DATA-TWSE-2021-OFFICIAL-UNION-V0.1;
  exact 1101 witness binding remains pending.
- R2 raw A1:
  2021 TWSE data coverage PASS;
  exact 61-row source/revision/hash binding remains pending.
- R3 lifecycle:
  normalized lifecycle + exact-session runtime semantics now exist;
  exact historical 2021 witness receipt remains pending.
- R4 corporate-action continuity:
  archive core and narrowed TWSE source-family contract exist;
  exact-window event/source completeness remains pending.
- R5 price-limit/reference:
  pre-existing source contract already identified 2021-06-15 as a historical TWT84U witness.
  Official target-date factual fields for 1101 were observed:
  upper limit 56.50;
  opening-auction reference 51.40;
  lower limit 46.30;
  previous reference 51.50;
  previous close 51.40;
  most recent prior trade date 2021-06-11.
  This is positive source-field evidence only.
  Exact raw-payload hash, firstObservableAt/knownAt, rule version/exemption and replay-safe binding remain pending.
- R6 disposition/matching:
  official TWSE historical source supports date-range queries/CSV back to January 2001 and event-specific measures/cadence semantics;
  exact 1101 61-session range receipt is still pending.
  A no-match cannot become CERTIFIED_NORMAL_MATCHING until source coverage and changed-trading-method state are both resolved.
- Net result:
  source-family feasibility is strong;
  exact-window R1-R6 bundle is not complete;
  bottleneck is exact materialization/provenance/completeness rather than new Pattern logic.

### DL-095 — owner-return acceptance schema frozen
- Every owner receipt must bind the same witness identity, exact ordered session set, cutoff and source-history generation.
- Reused shared System2/D03 lineage:
  rawHistoryAdmissionReceiptId;
  sourceHistoryHash;
  continuityReceiptId;
  continuityTransformHash;
  continuityEngineVersion;
  corporateActionRegistryVersion;
  ordered source-bar identities.
- Count-only 61 rows are insufficient; ordered expected/observed date sets and hashes must match.
- Later evidence cannot be backdated into predictor/context state.
- Zero-row source result certifies absence only when exact range, pagination, parser, empty-range semantics, coverage and source hash all pass.
- CLEAR_NO_ACTION eligibility requires complete event/revision/suspension/session evidence and sourceHistoryHash binding.
- CERTIFIED_NORMAL_MATCHING requires complete disposition source coverage plus changed-trading-method resolution.
- R1-R6 individually PASS but cross-window/hash mismatch => whole bundle BLOCKED.
- R7 remains blocked until the cross-receipt bundle passes and outcome fields remain absent.

### Latest-main duplicate-work audit
- Latest main at the audit moved to 5c8f05d8a2b78a411d63b9006e10d69af4084fb8.
- New System2 durable evidence explicitly states:
  REAL_CLEAR_NO_ACTION_RECEIPT_NOT_YET_OBSERVED.
- A real 1101/TWSE exact-session history witness exists on 2026-10-07, but its remaining blocker is SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED.
- Repository CLEAR_NO_ACTION_ELIGIBLE examples remain fixture-only.
- Therefore DL-093~095 does not duplicate an already completed physical continuity receipt.
- Existing owner work should produce the real hash-bound source-honest receipt; D01 must not implement a second history/continuity engine.

### Deterministic execution evidence
- DL-093:
  16 / 16 PASS.
- DL-095:
  18 / 18 PASS.
- This tranche:
  34 / 34 PASS.
- Cumulative through DL-095:
  263 / 263 PASS.
- Native Node parity remains unclaimed.

### Governance
- D01 canonical maturity remains 60.0%.
- All 11 D01 modules remain L3.
- WITNESS_IDENTITY_FROZEN = TRUE.
- SOURCE_FAMILY_FEASIBILITY = STRONG.
- EXACT_WINDOW_R1_R6_BUNDLE = PENDING.
- R7_GENERATION = BLOCKED.
- OUTCOME_JOIN = CLOSED.
- SDA-001 remains OPEN.
- SDA-002 remains OPEN.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-095

1. Re-read latest main for a real 1101 exact-window continuity/source bundle before opening any new D01 implementation.
2. If still absent, preserve the frozen DL-093 witness and wait for/cross-check canonical owner returns under DL-095.
3. R1/R2/R3/R4 owner work belongs to System2 DATA/continuity owners; R5/R6 belong to D05/exchange-mechanism owners.
4. D01 must not create duplicate source collectors or a second continuity engine.
5. When R1-R6 physical returns appear, validate the exact ordered date set, sourceHistoryHash, clocks, zero-row semantics and cross-receipt identity first.
6. Only if all pass may D01 generate R7 without opening outcomes.
7. After one R1-R7 composability witness passes, hand to D16 for future R8/R9 OOS execution under the already frozen DL-087/DL-089 protocol.
8. No L4 promotion / no outcome join / no Formal Core change until actual evidence exists.

## Continuation update — DL-096~097 (2026-10-07)

### DL-096 — cross-witness non-equivalence firewall
- D01 historical composability witness remains:
  TWSE / 1101 / 2021-06-15 / exact 60 prior eligible sessions + target.
- System2 NC-T01 physical witness is a different object:
  TWSE / 1101 / 2026-10-07.
- Same symbol does not make the receipts fungible.
- Cross-witness reuse is prohibited when target/asOf date, cutoff, exact date set, session hashes, replayHash, sourceHistoryHash, source-generation identity or market-mechanism state differ.
- System2 2026 physical PASS, when it eventually exists, can validate shared machinery but cannot satisfy D01 2021 R1-R6.
- Latest-main System2 evidence still reports:
  REAL_CLEAR_NO_ACTION_RECEIPT_NOT_YET_OBSERVED.
- The 2026 physical witness also has a durable per-symbol replay-identity export gap.
- New bounded TWTAWU suspension-negative-completeness handoff is accepted as a shared semantic contract:
  exact replay interval;
  source/raw-body digest;
  bounded completeness proof;
  no HTTP-200/empty-array shortcut;
  explicit NO_SUSPENSION_IN_COMPLETE_BOUNDED_WINDOW before negative coverage may be certified.
- D01 reuses this semantic contract but does not build a duplicate System2 producer.

### DL-097 — first-wave R7 pattern observability admission
- D01-owned R7 schema is now frozen before the owner R1-R6 bundle arrives.
- First-wave modules:
  D01-02;
  D01-03;
  D01-07;
  D01-09.
- R7 requires R1-R6 PASS for the same witness and exact window.
- Required common fields include:
  module/version;
  witness identity;
  predictorFreezeAt;
  firstObservableAt;
  ordered requiredSourceBarIds;
  exactSessionHash;
  sourceHistoryHash;
  informationRoot;
  redundancyGroup;
  featureState;
  deterministicFeatureHash;
  replaySafe.
- Valid completed feature states:
  NO_STRUCTURE;
  STRUCTURE_EMITTED;
  DATA_BLOCKED.
- NO_STRUCTURE remains a valid denominator observation; a positive Pattern is not required.
- firstObservableAt may equal predictorFreezeAt but may not be later.
- D01-02/D01-03 remain PRICE_OHLC-rooted rather than named-label-rooted.
- D01-07 retrospective backpainting is prohibited.
- D01-09 requires R5 legal price-limit/reference context PASS.
- Future-return/MFE/MAE/later-success fields are prohibited from R7.
- Physical R7 emission remains BLOCKED until the exact 2021 R1-R6 owner bundle passes.

### Deterministic execution evidence
- DL-096~097:
  14 / 14 PASS.
- Cumulative through DL-097:
  277 / 277 PASS.
- Native Node parity remains unclaimed.

### Governance
- D01 canonical maturity remains 60.0%.
- All 11 D01 modules remain L3.
- CROSS_WITNESS_RECEIPT_REUSE = PROHIBITED.
- SHARED_MACHINERY_REUSE = ALLOWED.
- R7_SCHEMA_FROZEN = TRUE.
- R7_PHYSICAL_EMISSION = BLOCKED_PENDING_R1_R6.
- OUTCOME_JOIN = CLOSED.
- SDA-001 remains OPEN.
- SDA-002 remains OPEN.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Updated exact next continuation point after DL-097

1. Re-read latest main for a physical 1101/2021-06-15 R1-R6 owner bundle before any new D01 source implementation.
2. Do not cross-credit System2 1101/2026-10-07 receipts into the 2021 D01 witness.
3. If the 2021 owner bundle appears, validate DL-095 cross-receipt identity and clocks first.
4. If R1-R6 pass, emit the first physical R7 using DL-097, allowing NO_STRUCTURE as a valid result.
5. If no owner bundle exists, keep D01 blocked and continue only D01-owned pre-outcome science/governance; do not create duplicate System2/D05 collectors.
6. After one R1-R7 composability witness passes, hand it to D16 under DL-087/DL-089; outcomes remain closed until then.
7. No L4 promotion / no Formal Core change without actual OOS/prospective evidence.

## Continuation update — DL-098~100 (2026-10-07)

### DL-098 — R7 canonical feature payload
- Repository-standard canonical JSON + SHA-256 semantics adopted for future R7 feature receipts.
- D01-02 primary object = continuous normalized single-bar OHLC geometry.
- D01-03 primary object = ordered N-bar OHLC/inter-bar geometry.
- D01-07 primary object = online base lifecycle and price geometry; retrospective backpainting prohibited.
- D01-09 primary object = raw gap plus legal reference/limit and event/suspension context.
- Named labels remain metadata, not independent votes.
- Volume context remains D02-owned rather than silently absorbed into D01.

### DL-099 — common-parent comparator registry
- D01-02 named candle must beat continuous single-bar OHLC geometry.
- D01-03 named sequence must beat the same ordered N-bar geometry without the name.
- D01-07 cup/base/handle must beat prior-trend + range-compression + generic-breakout geometry.
- D01-09 named gap/limit subtype must beat raw gap + legal-limit/reference context.
- Parent and child must use identical PIT universe, source/window identity, predictor freeze, blocked-row policy, OOS fold, horizons and cost treatment.
- New thresholds/lookbacks/scales/subtypes/weights/interactions count as new experiments.
- External literature remains mixed, so named-pattern incrementality remains UNKNOWN until Taiwan PIT OOS evidence beats the frozen parent.

### DL-100 — denominator and alias dedup
- Every module/date ends in exactly one state:
  UPSTREAM_DATA_BLOCKED / R7_DATA_BLOCKED / NO_STRUCTURE / STRUCTURE_EMITTED.
- Silent deletion is prohibited.
- Multiple aliases over the same information root do not multiply sample size, votes, scores or degrees of freedom.
- Overlapping sequences preserve dependency identities for D16.
- NO_STRUCTURE and DATA_BLOCKED remain denominator-accounted.
- NO_WINNER remains valid.

### Test evidence
- DL-098~100: 20/20 PASS.
- Cumulative through DL-100: 297/297 PASS.
- Native Node parity and OOS performance are not claimed.

### Governance
- D01 maturity remains 60.0%.
- All 11 modules remain L3.
- R7 canonical payload = FROZEN.
- Common-parent registry = FROZEN.
- Full denominator / alias dedup = FROZEN.
- Exact 2021 R1-R6 physical bundle remains pending.
- Physical R7 remains blocked.
- Outcome join remains CLOSED.
- SDA-001 / SDA-002 remain OPEN.
- Formal Core remains LOCKED.

### Exact next continuation after DL-100
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue D01-owned pre-outcome work: scale/parameter-family stability diagnostics and first-wave cross-module redundancy graph.
3. Do not use outcomes to choose scales, thresholds or labels.
4. If R1-R6 appear, validate DL-095 first, then emit R7 under DL-097/DL-098.
5. After one R1-R7 witness passes, hand to D16 under the frozen validation protocol.
6. No L4 promotion or Formal Core change without actual OOS/prospective evidence.


## Continuation update — DL-101~102 (2026-10-07)

### DL-101 — scale / parameter stability firewall
- Scale, lookback, sequence length, geometry thresholds, base/handle tolerances, timeframe and alignment are experiment dimensions.
- Outcome-selected scales/parameters are prohibited.
- Outcome-free representation states are now frozen:
  STABLE_REPRESENTATION / CONFIG_SENSITIVE_REPRESENTATION / IDENTITY_DRIFT / DATA_BLOCKED / UNKNOWN.
- Stability is a quality/falsification axis only; it does not imply alpha.
- D01-09 raw gap parent remains continuous; named large-gap thresholds are child experiments.
- DL-008 multi-scale rule is inherited: higher-timeframe agreement is not an independent vote.

### DL-102 — cross-module redundancy graph
- D01-02 / D01-03 / D01-07 / D01-09 cannot become four votes by default.
- Graph edge classes frozen:
  EXACT_REPRESENTATION_DUPLICATE;
  NESTED_SHARED_ROOT;
  OVERLAPPING_SHARED_ROOT;
  SAME_EPISODE_DIFFERENT_LABEL;
  SHARED_MECHANICAL_CONTEXT;
  DISTINCT_ROOT_CANDIDATE.
- A gap-up breakout day may simultaneously appear as a strong candle, named sequence, base breakout and gap pattern; these remain dependency-linked unless D16 proves residual independence.
- Labels are preserved for explanation; graph edges prevent score/sample-size multiplication.
- Cross-domain volume/volatility/microstructure/statistics remain with D02/D04/D05/D16.

### Test evidence
- DL-101~102: 15/15 PASS.
- Cumulative through DL-102: 312/312 PASS.
- Native Node parity and OOS performance are not claimed.

### Governance
- D01 maturity remains 60.0%.
- All 11 modules remain L3.
- Outcome-selected parameter search = PROHIBITED.
- Cross-module redundancy graph = FROZEN.
- Exact 2021 R1-R6 bundle remains pending.
- Physical R7 remains blocked.
- Outcome join remains CLOSED.
- Formal Core remains LOCKED.

### Exact next continuation after DL-102
1. Re-read latest main for the frozen 1101/2021-06-15 owner bundle.
2. If still absent, continue D01-owned outcome-blind work on representation invariance and episode identity across detector versions.
3. If the owner bundle appears, validate DL-095, then emit R7 and its redundancy graph without outcomes.
4. D16 receives only deduped/dependency-preserving R7 observations.
5. No L4 promotion or Formal Core change without actual OOS/prospective evidence.

## Continuation update — DL-103~105 (2026-10-08)

### DL-103 — detector-version representation invariance
- Three clocks are now separated:
  marketFirstObservableAt;
  detectorSpecFrozenAt;
  outcomeUnblindedAt / experiment outcome unlock.
- A detector frozen after the historical market date is not automatically lookahead if it consumes only prefix-safe historical inputs and was frozen before the relevant outcome family was opened.
- Detector-version choice after outcomes is a searched variant and must be counted.
- Old R7 receipts remain immutable and append-only.
- Cross-version states frozen:
  EXACT_REPLAY_EQUIVALENT;
  SAME_CAUSAL_EPISODE_REPRESENTATION_DRIFT;
  EXPECTED_SPEC_CHANGE;
  CLOCK_DRIFT;
  PROVENANCE_DRIFT;
  EPISODE_IDENTITY_DRIFT;
  DATA_BLOCKED.
- Bug fixes that change historical emitted state create a new research version unless complete canonical payload/clock/source/denominator equivalence is proven.

### DL-104 — cross-version episode identity migration
- Episode identity is causal lineage, not label similarity or spatial proximity.
- Identity precedence:
  immutable root/episode lineage;
  exact anchors/source bars;
  boundary/version lineage;
  causal lifecycle;
  spatial overlap only as description.
- Migration classes frozen:
  UNCHANGED_EPISODE;
  SAME_EPISODE_REPRESENTATION_CHANGED;
  EPISODE_SPLIT;
  EPISODE_MERGE;
  NEW_EPISODE_IN_NEW_VERSION;
  DROPPED_EPISODE_IN_NEW_VERSION;
  CLOCK_DRIFT;
  PROVENANCE_DRIFT;
  IDENTITY_UNRESOLVED.
- Split/merge never rewrites old historical receipts or inherits outcome history as if the new representation always existed.
- Mapping choice must remain outcome-blind.

### DL-105 — version migration ledger / replay acceptance
- Detector-version migration ledger is append-only.
- Outcome access state at migration is frozen as CLOSED / PARTIALLY_OPENED / OPENED.
- Any version introduced after relevant outcomes were opened must enter the search family and cannot reuse untouched-final-holdout privilege.
- Exact implementation-equivalence shortcut requires canonical payload, clocks, source identities and denominator states all unchanged.
- Prefix invariance explicitly compares true prefix vs full-history asOf replay.
- Future failure/pivot/reclaim/label cannot rewrite an earlier snapshot.
- NO_STRUCTURE / DATA_BLOCKED / FAILED / EXPIRED / INVALIDATED / UNRESOLVED cases must survive version migration.
- SDA-002 research semantics are now materially mature but the ticket remains REMEDIATION_IN_PROGRESS pending genuine replay receipts, System1/System2 enforcement, D16 validation and 00 closure.

### Test evidence
- DL-103~105: 29/29 PASS.
- Cumulative through DL-105: 341/341 PASS.
- Native Node parity and OOS performance are not claimed.

### Physical owner readback
- No physical 1101 / 2021-06-15 R1-R6 bundle was found on latest main before this tranche.
- D01 did not implement duplicate System2/D05 collectors.
- Physical R7 remains blocked.

### Governance
- D01 maturity remains 60.0%.
- All 11 modules remain L3.
- DETECTOR_VERSION_INVARIANCE = FROZEN.
- CROSS_VERSION_EPISODE_MIGRATION = FROZEN.
- VERSION_LEDGER_APPEND_ONLY = TRUE.
- POST_HOC_VERSION_SWAP = PROHIBITED.
- SDA-001 remains OPEN / remediation in progress.
- SDA-002 remains OPEN / remediation in progress.
- Outcome join remains CLOSED.
- Formal Core remains LOCKED.

### Exact next continuation after DL-105
1. Re-read latest main for the frozen 1101/2021-06-15 owner bundle.
2. If absent, freeze D01-specific SDA-001/SDA-002 research-side closure-readiness package without claiming ticket closure.
3. Distinguish research-side completed controls from remaining System1/System2/D16/00 gates.
4. If R1-R6 appear, validate DL-095, emit R7 under DL-097/DL-098, then apply DL-103~105 version-invariance checks.
5. No L4 promotion / no Formal Core change without actual OOS/prospective evidence.


## Continuation update — DL-106~107 (2026-10-08)

### DL-106 — SDA-001 / SDA-002 research-side closure-readiness
- D01-specific SDA-001 research semantics are now classified COMPLETE_FOR_CURRENT_SCOPE:
  PRICE_OHLC root;
  alias dedup;
  common-parent comparators;
  cross-module redundancy graph;
  cross-scale no-extra-vote firewall;
  new structural root != new independent evidence.
- SDA-001 remains REMEDIATION_IN_PROGRESS because cross-domain/System1/System2/D16/00 gates remain.
- D01-specific SDA-002 causal research semantics are now classified COMPLETE_FOR_CURRENT_SCOPE:
  label-independent geometry;
  firstObservableAt/confirmedAt/predictorFreezeAt;
  failure lifecycle;
  negative/no-structure/data-blocked retention;
  immutable episode/version lineage;
  prefix invariance;
  version migration firewall;
  outcome-field firewall.
- Older audit text that described latest D01 research tests as TEST_EXECUTION_PENDING is stale for the current suite.
- Current deterministic V8-equivalent D01 execution through DL-107 = 357 / 357 PASS.
- Native Node parity, genuine physical R7 and prospective/OOS evidence remain unclaimed.
- SDA-002 remains REMEDIATION_IN_PROGRESS pending physical R7, System1/System2 enforcement, D16 and 00 closure.

### DL-107 — outcome-locked D16 first-wave handoff
- First-wave module set frozen:
  D01-02 / D01-03 / D01-07 / D01-09.
- Chronology preserved:
  2018 warmup;
  2019-2021 train -> 2022 test;
  2019-2022 train -> 2023 test;
  2024 untouched final holdout;
  minimum 20 eligible-session purge/embargo.
- Outcomes remain 1 / 5 / 20 eligible sessions.
- Common parents, full denominator, redundancy/dependency graph and detector-version search accounting are all frozen before outcomes.
- Parent/child comparisons require identical universe/window/source/predictor/blocking/censoring/horizon/cost/search-family support.
- Hierarchical Benjamini-Yekutieli remains primary multiplicity control.
- NO_WINNER remains valid.
- D16 execution is NOT_STARTED because physical R1-R7 remains pending.

### Test evidence
- DL-103~105: 29/29 PASS.
- DL-106~107: 16/16 PASS.
- Cumulative through DL-107: 357/357 PASS.
- Native Node parity and OOS/prospective performance are not claimed.

### Governance
- D01 maturity remains 60.0%.
- All 11 modules remain L3.
- D01_SDA001_RESEARCH_SEMANTICS = COMPLETE_FOR_CURRENT_SCOPE.
- D01_SDA002_CAUSAL_RESEARCH_SEMANTICS = COMPLETE_FOR_CURRENT_SCOPE.
- SDA-001 ticket remains OPEN / remediation in progress.
- SDA-002 ticket remains OPEN / remediation in progress.
- PHYSICAL_R1_R7 = PENDING.
- D16_EXECUTION = NOT_STARTED.
- OUTCOME_JOIN = CLOSED.
- Formal Core remains LOCKED.

### Exact next continuation after DL-107
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, D01 may continue only genuinely new outcome-blind science; do not repeat SDA-001/SDA-002 semantics already marked complete for current scope.
3. Candidate next science: define episode equivalence under benign source revision / corporate-action registry revision without allowing source-vintage drift to rewrite historical R7.
4. If R1-R6 appear, validate DL-095, emit R7 under DL-097/DL-098, then apply DL-103~105 version invariance.
5. Once physical R1-R7 exists, release the already-frozen DL-107 package to D16.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.


## Continuation update — DL-108~112 (2026-10-08)

### DL-108 — source-vintage equivalence / historical receipt immutability
- Source capture identity, semantic identity, knowledge-time identity and D01 replay identity are now explicitly separated.
- Frozen source-revision classes:
  BYTE_REFRESH_SEMANTICALLY_EQUIVALENT;
  PARSER_EQUIVALENT_REPARSE;
  DUPLICATE_OBSERVATION_SAME_SEMANTIC_VERSION;
  METADATA_ONLY_NON_CAUSAL_CHANGE;
  SEMANTIC_REVISION;
  KNOWLEDGE_CLOCK_REVISION;
  COVERAGE_EXPANSION.
- Exact replay equivalence requires same query/window, semantic set, PIT clocks, exactSessionHash, sourceHistoryHash, denominator state and canonical R7 payload.
- A newer archive may improve current truth but may not mutate an old R7 receipt.
- PIT_VIEW and BEST_KNOWN_CURRENT_VIEW are now separate research objects.

### DL-109 — corporate-action registry revision causality
- Later corporate-action revisions are classified by when the corrected information was knowable.
- PREEXISTING_PUBLIC_INFORMATION_BACKFILL:
  information was public by the old cutoff but the research pipeline missed it;
  this is a pipeline error and corrected replay is required.
- LATE_PUBLIC_CORRECTION / LATE_CANCELLATION:
  information became knowable only after the old cutoff;
  old PIT predictor is not backdated.
- Effective-date / continuity-effect corrections use the same knowledge-time split.
- A current revisionCoverageComplete/completeness certificate is validation evidence, not automatically historical predictor information.
- Final holdout already opened cannot be reset to untouched by later data correction.

### DL-110 — source-vintage migration ledger / holdout firewall
- Source-vintage migration is append-only.
- Old/new sourceHistoryHash, registry version, continuity receipt and R7 receipt are all versioned.
- Outcome-access state at correction discovery is frozen.
- Pre-outcome pipeline repair may replay cleanly before outcomes.
- Development-outcome-open repair becomes a new analysis version.
- Final-holdout-open/consumed repair is diagnostic/sensitivity evidence and requires fresh confirmation unless a preregistered error-correction policy already governs the case.
- Source correction never resets a consumed holdout.
- Revision-denominator changes must remain visible.
- Revised named child and common parent must use identical revised support.

### DL-111 — R1-R6 revision blast-radius matrix
- R1 membership/security revision changing window identity => all affected downstream D01 receipts replay.
- R2 price correction => all D01 price consumers using the bar replay.
- R2 volume-only correction => D02 context by default; not a D01 price revision.
- R3 symbol-session revision changing eligible date set => all affected downstream D01 receipts replay.
- R4 continuity revision => every module consuming affected continuity bars replays.
- R5 reference/limit revision primarily affects D01-09 unless another module explicitly consumed that context.
- R6 matching/disposition revision affects only frozen context-dependent consumers; it does not rewrite raw OHLC.
- expectedSessionHash/sourceHistoryHash/continuityTransformHash change forces versioned downstream replay.

### DL-112 — outcome-blind revision sensitivity audit
- Old/new source-vintage replay is compared before outcomes.
- Frozen representation-change classes:
  UNCHANGED_REPRESENTATION;
  VALUE_ONLY_CHANGE_SAME_STATE;
  FEATURE_STATE_CHANGE;
  EPISODE_IDENTITY_CHANGE;
  CLOCK_CHANGE;
  WINDOW_IDENTITY_CHANGE;
  NEWLY_EVALUABLE;
  NO_LONGER_EVALUABLE;
  UNKNOWN_BLOCKED.
- Sensitivity is reported continuously over the full affected denominator.
- Results must be stratified by D01 module and R1-R6 revision family.
- No post-hoc 5%/10% robustness threshold may be invented after counts are observed.
- Representation stability/fragility is not alpha.

### Test evidence
- DL-108~110: 27/27 PASS.
- DL-111~112: 25/25 PASS.
- This tranche: 52/52 PASS.
- Cumulative through DL-112: 409/409 PASS.
- Native Node parity and OOS/prospective performance are not claimed.

### Physical owner readback
- No physical 1101 / 2021-06-15 R1-R6 owner bundle was found before this tranche.
- Physical R7 remains blocked.
- D01 did not implement duplicate System2/D05 collectors.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- SOURCE_VINTAGE_FIREWALL = FROZEN.
- CORPORATE_ACTION_REVISION_CAUSALITY = FROZEN.
- SOURCE_VINTAGE_MIGRATION_LEDGER = FROZEN.
- REVISION_BLAST_RADIUS_MATRIX = FROZEN.
- OUTCOME_BLIND_REVISION_SENSITIVITY = FROZEN.
- SDA-001 / SDA-002 remain open under their existing cross-system/D16/00 gates.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Formal Core remains LOCKED.

### Exact next continuation after DL-112
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new D01-owned outcome-blind science.
3. Candidate next science:
   freeze source-revision impact on cross-scale aggregation / derived higher-timeframe bars and ensure one low-level correction cannot generate multiple synthetic evidence revisions.
4. If R1-R6 appear, validate DL-095 and DL-108~112 before physical R7 emission.
5. Once physical R1-R7 exists, attach revision-vintage metadata to the already frozen DL-107 D16 handoff.
6. No L4 promotion / no Formal Core change without actual OOS/prospective evidence.


## Continuation update — DL-113~115 (2026-10-08)

### DL-113 — cross-scale source-revision propagation
- One primitive daily source revision may fan out into daily / weekly / monthly / rolling derived-bar changes.
- Primitive revision root identity is preserved through every aggregation layer.
- Higher-timeframe aggregation must record constituent bar identities, aggregation definition/version, semantic space and primitiveRevisionRootIds.
- A primitive daily correction does not automatically imply the derived weekly/monthly OHLC changed; the aggregate must be rebuilt and compared.
- Session-set revisions can change aggregate membership/open/close even without a raw price-value edit.
- TECHNICAL_CONTINUITY revisions propagate only within continuity space; RAW_EXECUTION and TECHNICAL_CONTINUITY constituents may not be mixed.
- Volume-only changes do not force D01 price-pattern replay when price aggregates are unchanged.

### DL-114 — revision-root lineage / cross-scale dedup
- Revision lineage graph now separates primitive source revision, derived bar revision, R7 representation revision and context revision.
- Frozen revision-edge classes:
  EXACT_REVISION_DUPLICATE;
  NESTED_REVISION_ROOT;
  OVERLAPPING_REVISION_ROOT;
  DISJOINT_REVISION_ROOT_CANDIDATE.
- rawDerivedRevisionCount / rawRepresentationRevisionCount may exceed primitiveRevisionRootCount.
- effectiveIndependentRevisionRootCount defaults to primitiveRevisionRootCount, not representation count.
- Three changed scales from one corrected daily row remain one primitive revision root.
- Multiple distinct primitive revision roots still do not automatically imply predictive independence.
- Cross-scale revision fanout remains rooted in PRICE_OHLC where applicable.

### DL-115 — cross-scale revision sensitivity receipt
- Outcome-blind per-scale receipt now preserves:
  old/new source vintage;
  primitive revision roots;
  constituent set commitments;
  old/new derived bar hashes;
  old/new R7 states/hashes;
  old/new episode/clocks;
  revision change class.
- Aggregate metrics separate:
  primitiveRevisionRootCount;
  derivedBarRebuildCount;
  derivedBarChangedCount;
  R7ReplayedCount;
  R7RepresentationChangedCount;
  rawRevisionRepresentationCount;
  effectiveIndependentRevisionRootCount.
- Hard invariant:
  effectiveIndependentRevisionRootCount <= primitiveRevisionRootCount.
- Frozen descriptive states:
  ALL_SCALES_UNCHANGED_AFTER_REBUILD;
  SOME_SCALES_CHANGED;
  ALL_OBSERVED_SCALES_CHANGED;
  WINDOW_MEMBERSHIP_CHANGED;
  CONTINUITY_SPACE_REVISION_CHANGED;
  DATA_BLOCKED.
- Multi-scale changed count is not Alpha and cannot become a vote multiplier.

### Adversarial execution finding
- First execution produced 27/28 PASS.
- Failure exposed a helper implementation bug:
  generic REVISION_ROOTS_ACCOUNTED status overwrote the more specific ONE_ROOT_MULTI_SCALE_FANOUT status because of object-spread field precedence.
- Implementation was corrected without changing the frozen research rule or fixture expectation.
- Final execution:
  28/28 PASS.
- Cumulative deterministic V8-equivalent execution through DL-115:
  437/437 PASS.
- Native Node parity and OOS/prospective performance remain unclaimed.

### Physical owner readback
- No physical 1101 / 2021-06-15 R1-R6 owner bundle was found before this tranche.
- Physical R7 remains blocked.
- D01 did not implement duplicate System2/D05 collectors.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- CROSS_SCALE_REVISION_PROPAGATION = FROZEN.
- REVISION_ROOT_LINEAGE_DEDUP = FROZEN.
- CROSS_SCALE_REVISION_SENSITIVITY = FROZEN.
- FANOUT_COUNT_EQUALS_INDEPENDENT_EVIDENCE_COUNT = FALSE.
- SDA-001 research semantics remain complete for current D01 scope; ticket stays open under cross-domain/System/D16/00 gates.
- SDA-002 remains open under physical replay/System/D16/00 gates.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Formal Core remains LOCKED.

### Exact next continuation after DL-115
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new outcome-blind D01 science.
3. Candidate next science:
   freeze derived-bar boundary/calendar/timezone revision identity so a calendar-definition correction cannot masquerade as new market information.
4. If R1-R6 appear, validate DL-095 plus DL-108~115 before physical R7 emission.
5. D16 receives primitive revision roots and cross-scale sensitivity metadata, never raw scale-count votes.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.



## Continuation update — DL-116~121 (2026-10-08)

### DL-116~118 — calendar / timezone / partial higher-timeframe formalization
- A pre-existing DL-116~118 research note was already present on main but its originating commit added only the markdown note; the referenced standalone oracle/test artifacts were absent and KLINE_PATTERN_CHECKPOINT.md had not advanced beyond DL-115.
- Formalization preserved the frozen research semantics and added:
  research/pattern_dl116_118_calendar_boundary_oracle_v0_1.mjs;
  research/pattern_dl116_118_calendar_boundary_oracle_v0_1.test.mjs;
  research/D01_DL116_118_FORMALIZED_TEST_EVIDENCE_20261008_V0_1.md.
- Frozen semantics:
  historical weekly/monthly bars use exchange-local eligible symbol sessions, not fixed 5/20-day assumptions;
  partial higher-timeframe bars remain PARTIAL_AS_OF while expected future sessions remain;
  future observations are filtered before due-session validation;
  calendar/source revisions do not create extra Alpha votes;
  primitive price/calendar revision roots remain deduped across scale fanout.
- Formalized first execution produced 35/36 PASS and exposed a real helper status-precedence defect:
  the specific revision-vote-inflation status was overwritten by a generic accounting status.
- Only object-spread precedence was corrected; research rule and expected fixture result were unchanged.
- Final formalized result:
  36/36 PASS.
- Cumulative through DL-118:
  473/473 PASS.

### DL-119 — immutable session-attribution causality
- Generic missing-bar state is now prohibited.
- Session absence is causally separated into:
  EXCHANGE_CLOSED;
  SYMBOL_NOT_EXPECTED_TO_TRADE;
  SYMBOL_TRADED;
  SYMBOL_EXPECTED_NO_TRADE_CONFIRMED;
  DATA_MISSING;
  CONTRADICTION_BLOCKED;
  UNKNOWN_BLOCKED.
- Attribution precedence:
  official exchange session;
  certified symbol lifecycle;
  authoritative trade/no-trade state;
  admitted raw row;
  provider metadata.
- Immutable roots:
  calendarAttributionRootId;
  symbolLifecycleRootId;
  timezoneAttributionRootId;
  rawObservationRootId.
- Frozen revision causes:
  OFFICIAL_CALENDAR_REVISION;
  VENDOR_TIMEZONE_ATTRIBUTION_REVISION;
  SYMBOL_LIFECYCLE_REVISION;
  RAW_DATA_PIPELINE_REVISION;
  TRADE_STATUS_REVISION;
  MULTI_ROOT_REVISION;
  IDENTICAL_ATTRIBUTION.
- Exchange closure, symbol suspension, missing raw row and timezone error are not interchangeable and none is an Alpha root.

### DL-120 — exchange-local market-date / timezone binding
- TWSE/TPEx canonical market timezone remains Asia/Taipei.
- Market-date precedence:
  official exchange-reported market date first;
  explicit timezone-bearing trade/session timestamp as controlled fallback.
- Provider batch date, file-name date, ingestion date and local machine date may not define the trading session.
- UTC truncation may shift a Taiwan market observation to the wrong local date and is explicitly prohibited.
- Batch/download after local midnight does not change the original exchange session date.
- Parent/child and old/new-vintage common-support comparison now includes timezone/date attribution identity.
- Timezone remap requires versioned replay and preserves old receipts.

### DL-121 — nontrading denominator / gap-bridge common support
- A raw gap remains one prior-traded/current-traded endpoint root regardless weekend/holiday calendar-day distance.
- Intervening states are frozen as:
  MARKET_CLOSED_ONLY;
  SYMBOL_NOT_EXPECTED_TO_TRADE_INTERVAL;
  EXPECTED_TO_TRADE_NO_TRADE_CONFIRMED;
  DATA_MISSING_INTERVAL;
  ATTRIBUTION_UNCERTAIN_INTERVAL;
  MIXED_INTERVAL.
- Holiday/weekend closures do not create pseudo bars or extra gap votes.
- Suspension/resumption intervals inherit DL-066 stale-anchor/reopening semantics.
- Confirmed no-trade eligible sessions are retained in denominator accounting and are not converted to fake zero-volume/zero-return bars.
- Unresolved attribution blocks gap/path inference.
- Holiday, suspension, vendor-date error and data loss cannot be pooled without explicit stratification.

### Test evidence
- DL-116~118:
  formalized final 36/36 PASS after initial 35/36 defect discovery and correction.
- DL-119~121:
  40/40 PASS.
- Cumulative deterministic V8-equivalent execution through DL-121:
  513/513 PASS.
- Native Node parity and OOS/prospective performance are not claimed.

### Physical owner readback
- Latest-main search still shows no physical 1101 / 2021-06-15 exact-window continuityReceiptId or CERTIFIED_NORMAL_MATCHING owner receipt.
- Physical R1-R6 remains incomplete.
- Physical R7 remains blocked.
- D01 did not implement duplicate System2/D05 source collectors.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- CALENDAR_TIMEZONE_PARTIAL_BAR_FIREWALL = FROZEN.
- SESSION_ATTRIBUTION_CAUSALITY = FROZEN.
- EXCHANGE_LOCAL_MARKET_DATE_BINDING = FROZEN.
- NONTRADING_GAP_COMMON_SUPPORT = FROZEN.
- SDA-001 research semantics remain complete for current D01 scope; ticket stays open under cross-domain/System/D16/00 gates.
- SDA-002 remains open under physical replay/System/D16/00 gates.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Exact next continuation after DL-121
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new outcome-blind D01 science.
3. Candidate next science:
   freeze listing/migration/share-conversion boundary identity across TWSE/TPEx so exchange migration or code continuity cannot create a false continuous price pattern or duplicate opportunity.
4. If R1-R6 appear, validate DL-095 plus DL-108~121 before physical R7 emission.
5. D16 receives attribution-class and nontrading-bridge metadata alongside primitive revision roots, never missing-bar counts as votes.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.


## Continuation update — DL-122~125 (2026-10-08)

### DL-122 — security identity transition firewall
- Durable pattern identity is securityIdentity, not market+symbol text.
- Frozen continuity-eligible relations:
  SAME_SECURITY;
  SAME_SECURITY_MARKET_MIGRATION_PROVEN;
  SAME_SECURITY_CODE_CHANGED_PROVEN_EQUIVALENT.
- Frozen identity-break relations:
  SUCCESSOR_SECURITY;
  MULTI_SUCCESSOR;
  TERMINATED_NO_SUCCESSOR.
- IDENTITY_EQUIVALENCE_UNKNOWN fails closed.
- Unit/share semantics must remain compatible or have a certified transform.
- An exchange reference price derived from predecessor close/exchange ratio is a trading-mechanism object, not security-identity proof.
- Successor security does not inherit predecessor pattern identity.

### DL-123 — cross-market migration pattern continuity
- A proven same-security TPEx/TWSE or board migration may preserve one structural episode only after:
  exact old/new membership boundaries;
  transition interval classification;
  price-space continuity;
  no successor-security event;
  immutable identity proof.
- Market migration remains an explicit marketRegimeBoundary.
- One same-security migration episode = one effective opportunity root.
- First new-market open versus last old-market close is classified MARKET_MIGRATION_BOUNDARY_GAP, not ordinary breakaway/technical gap by default.
- No synthetic OHLC may fill the transition interval.

### DL-124 — share-conversion / successor-security pattern break
- Share conversion, merger, demerger, delisting-to-successor and other true security-identity transitions terminate predecessor D01 episode lineage.
- Successor begins a new security namespace.
- Successor cannot inherit:
  episodeId;
  opportunityId;
  sourceHistoryHash;
  exactSessionHash;
  source bars;
  clocks;
  redundancy group;
  feature hash.
- D01-03 sequences cannot cross identity.
- D01-07 base/cup lifecycle cannot inherit predecessor anchors.
- D01-09 predecessor-close to successor-open distance is IDENTITY_TRANSITION_REFERENCE_DISTANCE, not an ordinary same-security gap.
- Multiple successors remain event-dependency-linked but not aliases.

### DL-125 — symbol reuse / transition opportunity dedup
- Durable opportunity key requires:
  securityIdentity;
  membershipIntervalId;
  detector family;
  episode/root;
  predictor freeze;
  exactSessionHash;
  sourceHistoryHash.
- market+symbol alone is prohibited as long-horizon identity.
- Same visible ticker reused by another security starts a new lineage.
- Proven administrative code change preserves one opportunity root.
- Proven same-security market migration preserves one opportunity root.
- Different successor securities remain distinct opportunities but share a corporate-action dependency cluster.
- Identity-transition states remain denominator-accounted and cannot be silently dropped.

### External rule readback
- TWSE rules explicitly distinguish initial-listing/reference-price mechanics from security identity.
- A TPEx security moving to TWSE can use its last TPEx close as a listing reference basis.
- Share conversion into a newly established company can derive a successor listing reference from predecessor close and exchange ratio.
- The original listed company may be delisted on the share-conversion record date.
- D01 therefore preserves the firewall:
  reference-price linkage != same-security pattern continuity.

### Test evidence
- DL-122~125: 34/34 PASS.
- Cumulative deterministic V8-equivalent execution through DL-125: 547/547 PASS.
- Native Node parity and OOS/prospective performance remain unclaimed.

### Physical owner readback
- No physical 1101 / 2021-06-15 exact R1-R6 owner bundle had appeared before this tranche.
- Physical R7 remains blocked.
- D01 did not implement duplicate System2/D05 collectors.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- SECURITY_IDENTITY_TRANSITION_FIREWALL = FROZEN.
- CROSS_MARKET_PATTERN_CONTINUITY = FROZEN.
- SUCCESSOR_PATTERN_BREAK = FROZEN.
- SYMBOL_REUSE_TRANSITION_DEDUP = FROZEN.
- SAME_SECURITY_MIGRATION_EXTRA_VOTE = PROHIBITED.
- SUCCESSOR_INHERITS_PREDECESSOR_PATTERN = FALSE.
- SDA-001 research semantics remain complete for current D01 scope; ticket stays open under cross-domain/System/D16/00 gates.
- SDA-002 remains open under physical replay/System/D16/00 gates.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Exact next continuation after DL-125
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new outcome-blind D01 science.
3. Candidate next science:
   freeze newly-listed/relisted security warmup and insufficient-history semantics so first-session/short-history names cannot inherit predecessor context or be compared against mature-history patterns without an explicit denominator state.
4. If R1-R6 appear, validate DL-095 plus DL-108~125 before physical R7 emission.
5. D16 receives security-identity relation, migration boundary, successor dependency and symbol-reuse metadata together with the full denominator.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.


## Continuation update — DL-126~128 (2026-10-08)

### DL-126 — newly listed / relisted warmup and insufficient history
- Short history by design is now explicitly separated from data loss.
- Frozen warmup states:
  FIRST_ELIGIBLE_SESSION;
  WARMUP_IN_PROGRESS;
  HISTORY_TOO_SHORT_BY_DESIGN;
  MODULE_MINIMUM_HISTORY_READY;
  FULL_PREREGISTERED_WINDOW_READY;
  DATA_MISSING_BLOCKED;
  IDENTITY_BLOCKED.
- Initial-listing/reference price is not a prior same-security close.
- A genuinely new security cannot borrow predecessor bars/anchors.
- D01-02 may describe the first completed bar after observability.
- D01-03 must wait for N same-security eligible bars.
- D01-07 must satisfy preregistered base-width/lifecycle history.
- D01-09 ordinary same-security gap is not evaluable on a new-security listing day.
- Proven same-security transfer listing may reuse prior-market history only after DL-123 continuity PASS.
- HISTORY_TOO_SHORT_BY_DESIGN remains denominator-accounted and is not recoded as NO_STRUCTURE or DATA_MISSING.

### DL-127 — relisting / long-absence stale-anchor firewall
- Security identity continuity and structural-anchor freshness are separate.
- A same-security instrument returning after long absence begins with stale-anchor status unless a preregistered reconfirmation rule passes.
- Frozen states:
  SAME_SECURITY_SHORT_INTERRUPTION;
  SAME_SECURITY_LONG_ABSENCE_STALE_ANCHOR;
  SAME_SECURITY_REENTRY_RECONFIRMED;
  SAME_SECURITY_REENTRY_BREACHED;
  SUCCESSOR_SECURITY_NEW_IDENTITY;
  IDENTITY_UNKNOWN_BLOCKED;
  DATA_BLOCKED.
- First reentry print is price discovery and cannot backdate confirmation.
- Reconfirmation receives a new observable clock and cannot mutate the old receipt.
- No arbitrary post-outcome calendar half-life is allowed.

### DL-128 — listing-age common support / denominator
- Every first-wave opportunity now carries:
  securityIdentity;
  listingStart;
  listingAgeEligibleSessions;
  warmupState;
  identityTransitionClass;
  same-security history availability;
  module minimum-history requirement/readiness.
- Parent and named child must share listing-age/warmup support.
- Mature-history parent cannot be compared against a child after silently dropping short-history names.
- Frozen denominator states:
  HISTORY_TOO_SHORT_BY_DESIGN;
  MODULE_HISTORY_READY_NO_STRUCTURE;
  MODULE_HISTORY_READY_STRUCTURE_EMITTED;
  DATA_MISSING_BLOCKED;
  IDENTITY_BLOCKED.
- D16 receives listing-age metadata for stratification/common support only; listing age is not Alpha.
- NEW_SECURITY_INITIAL_LISTING, SAME_SECURITY_TRANSFER_LISTING and SUCCESSOR_SECURITY_INITIAL_LISTING remain distinct transition classes.

### Test evidence
- DL-122~125:
  34/34 PASS.
- DL-126~128:
  23/23 PASS.
- Cumulative deterministic V8-equivalent execution through DL-128:
  570/570 PASS.
- Native Node parity and OOS/prospective performance remain unclaimed.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- SECURITY_IDENTITY_TRANSITION_FIREWALL = FROZEN.
- CROSS_MARKET_PATTERN_CONTINUITY = FROZEN.
- SUCCESSOR_PATTERN_BREAK = FROZEN.
- SYMBOL_REUSE_TRANSITION_DEDUP = FROZEN.
- LISTING_WARMUP = FROZEN.
- RELISTING_STALE_ANCHOR = FROZEN.
- LISTING_AGE_COMMON_SUPPORT = FROZEN.
- SHORT_HISTORY_SILENT_DROP = PROHIBITED.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Exact next continuation after DL-128
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new outcome-blind D01 science.
3. Candidate next science:
   freeze first-day/early-life price-discovery semantics and transfer-listing placebo controls so listing mechanics cannot masquerade as pattern Alpha.
4. If R1-R6 appear, validate DL-095 plus DL-108~128 before physical R7 emission.
5. D16 receives listing-age/warmup/identity-transition metadata and keeps short-history rows in the denominator.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.


## Continuation update — DL-129~131 (2026-10-08)

### DL-129 — listing-day / early-life price discovery
- Frozen price-discovery classes:
  NEW_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY;
  SAME_SECURITY_TRANSFER_LISTING_PRICE_DISCOVERY;
  SUCCESSOR_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY;
  RELISTING_REENTRY_PRICE_DISCOVERY;
  MATURE_CONTINUOUS_TRADING.
- Initial-listing/public-offering/transfer reference bases are market-mechanism anchors, not ordinary prior-close observations.
- D01-02 first completed bar may be described geometrically but must retain priceDiscoveryClass.
- D01-03 and D01-07 require enough same-security history unless DL-123 same-security transfer continuity passes.
- D01-09:
  new-security first day has no ordinary prior-close gap;
  same-security transfer uses MARKET_MIGRATION_BOUNDARY_GAP;
  successor uses IDENTITY_TRANSITION_REFERENCE_DISTANCE.
- listingAgeEligibleSessions remains continuous context; no post-hoc bullish/bearish age threshold is invented.

### DL-130 — transfer-listing / listing-mechanic placebo registry
- Placebo/control families frozen before outcomes:
  SAME_SECURITY_NON_TRANSITION_GEOMETRY;
  REFERENCE_BASIS_MECHANIC;
  FIRST_SESSION_PRICE_DISCOVERY;
  SAME_SECURITY_TRANSFER_VS_NEW_SECURITY_LISTING;
  MIGRATION_BOUNDARY_VS_ORDINARY_GAP.
- First-session morphology must be compared on transition-class/listing-age common support.
- New-security listing, same-security transfer listing and successor-security listing cannot be pooled as one event class.
- Reference-basis mechanics may not be credited as pattern Alpha.
- Any residual pattern effect remains only a candidate pending D16 OOS/multiplicity/common-support validation.

### DL-131 — listing-cohort survivorship firewall
- Historical listing cohort predictor may use:
  listingStart;
  listingAgeEligibleSessions;
  security identity;
  then-current market/lifecycle state.
- Predictor may not use:
  future delisting;
  future migration;
  future successor identity;
  future survival duration;
  present-day listing status as historical eligibility.
- Current survivors alone cannot define historical listing cohorts.
- Later-delisted/migrated/converted/short-lived securities remain denominator-accounted through the PIT historical universe.
- Terminal state may appear only on the outcome/descriptive side after the proper unlock.

### Test evidence
- DL-122~125:
  34/34 PASS.
- DL-126~128:
  23/23 PASS.
- DL-129~131:
  23/23 PASS.
- Cumulative deterministic V8-equivalent execution through DL-131:
  593/593 PASS.
- Native Node parity and OOS/prospective performance remain unclaimed.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- SECURITY_IDENTITY_TRANSITION_FIREWALL = FROZEN.
- CROSS_MARKET_PATTERN_CONTINUITY = FROZEN.
- SUCCESSOR_PATTERN_BREAK = FROZEN.
- SYMBOL_REUSE_TRANSITION_DEDUP = FROZEN.
- LISTING_WARMUP = FROZEN.
- RELISTING_STALE_ANCHOR = FROZEN.
- LISTING_AGE_COMMON_SUPPORT = FROZEN.
- EARLY_LIFE_PRICE_DISCOVERY = FROZEN.
- LISTING_MECHANIC_PLACEBOS = FROZEN.
- LISTING_COHORT_SURVIVORSHIP = FROZEN.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Exact next continuation after DL-131
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new outcome-blind D01 science.
3. Candidate next science:
   freeze corporate-name / issuer-identity alias changes and same-code different-issuer collision handling across long historical windows, then integrate that alias lineage into R1/R7 opportunity identity.
4. If R1-R6 appear, validate DL-095 plus DL-108~131 before physical R7 emission.
5. D16 receives listing-mechanic placebo, listing-age/cohort, security-identity and transition-class metadata with full denominators.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.


## Continuation update — DL-132~134 (2026-10-08)

### DL-132 — corporate-name / issuer-alias identity firewall
- Legal company name, short name, board suffix and historical brand/name changes are descriptive aliases, not durable security identity.
- Conservative normalization may support source reconciliation:
  Unicode / whitespace / punctuation / known board-suffix normalization and exact official alias intersection.
- Fuzzy similarity, edit distance, brand stem or token overlap may not stitch history.
- Identity proof hierarchy is frozen:
  canonical security identity;
  issuer/security-class linkage;
  exact official symbol + membership interval + authoritative alias linkage;
  name aliases only as supporting evidence.
- A proven same-security name change preserves pattern lineage and does not create a new vote.
- Same/similar name with different security identity remains a distinct security.
- Alias timeline is append-only and versioned.

### DL-133 — same-code different-issuer collision
- market+symbol equality is insufficient for long-horizon continuity.
- Same code with different security/issuer identity is a collision.
- Code reuse after delisting starts a new lineage.
- Overlapping same-code/different-identity claims fail closed as IDENTITY_BOUNDARY_CONFLICT.
- Current issuer may not be backfilled into an older membership interval.
- Historical-universe reconciliation may use conservative aliases only while preserving same-code/different-company rejection.
- Collision/unknown states remain denominator-accounted.

### DL-134 — R1/R7 issuer-alias lineage integration
- R1 may expose:
  securityIdentity;
  issuerIdentity;
  securityClass;
  membershipIntervalId;
  canonicalSymbol;
  aliasTimelineVersion;
  issuerAliasSetHash;
  identityEvidenceHash;
  identityResolutionState.
- Alias strings are explanation/source-reconciliation metadata, not informationRoot, score, vote or pattern confirmation.
- R7 durable identity remains:
  securityIdentity + membershipIntervalId + exactSessionHash + sourceHistoryHash + detector/episode identity.
- Display-name-only changes do not require a geometry-hash change.
- Identity remap creates a new R1 version and downstream replay; old R7 remains immutable.
- Parent and child must use the same identity/alias-lineage version.

### Test evidence
- DL-132~134:
  27/27 PASS.
- Cumulative deterministic V8-equivalent execution through DL-134:
  620/620 PASS.
- Native Node parity and OOS/prospective performance remain unclaimed.

### Physical owner readback
- Latest-main search before this tranche still found no physical 1101 / 2021-06-15 continuityReceiptId / CERTIFIED_NORMAL_MATCHING owner bundle.
- Physical R1-R6 remains incomplete.
- Physical R7 remains blocked.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- ISSUER_ALIAS_FIREWALL = FROZEN.
- SAME_CODE_COLLISION_FIREWALL = FROZEN.
- R1_R7_ALIAS_LINEAGE_INTEGRATION = FROZEN.
- FUZZY_NAME_HISTORY_STITCH = PROHIBITED.
- CURRENT_ISSUER_BACKFILL = PROHIBITED.
- ALIAS_METADATA_ALPHA_ROOT = FALSE.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Exact next continuation after DL-134
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new outcome-blind D01 science.
3. Candidate next science:
   freeze same-issuer different-security-class identity so common/preferred/TDR/warrant/CB/payment-certificate histories cannot be stitched merely because issuer identity matches.
4. If R1-R6 appear, validate DL-095 plus DL-108~134 before physical R7 emission.
5. D16 receives identity-resolution/alias-lineage/collision metadata with full denominators.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.


## Continuation update — DL-135~137 (2026-10-08)

### DL-135 — same-issuer different-security-class firewall
- Same issuer does not imply same security.
- Domestic ordinary common equity remains the D01 first-wave class.
- Preferred equity / TDR / warrant / convertible or exchangeable bond / subscription right / payment certificate and other non-ordinary classes do not silently enter ordinary-equity history.
- Same issuer + different securityClass => separate security identity.
- Class conversion/exercise/redemption does not create one continuous OHLC path without explicit canonical equivalence.
- Different classes may have different price units/reference rules/expiry/leverage/liquidity mechanics, so issuer identity is not a price-pattern common parent.

### DL-136 — issuer-event context vs security opportunity
- One issuer event receives issuerEventContextId and may be referenced by multiple security-level R7 observations.
- Each security still preserves its own securityIdentity/securityClass/history/session/pattern episode.
- Multiple affected securities are not aliases.
- One issuer event affecting common/preferred/warrant does not create one independent vote per security.
- Cross-security price geometry is not a D01 common parent.
- Shared issuer event becomes a dependency cluster for D16, not a vote multiplier.

### DL-137 — security-class transition/conversion admission
- SAME_SECURITY_CLASS_ADMINISTRATIVE_CHANGE may preserve history only with identity and price-space proof.
- DIFFERENT_CLASS_SUCCESSOR_SECURITY / CONVERSION_INTO_EXISTING_COMMON_SHARE / CONVERSION_INTO_NEW_COMMON_SHARE / MULTI_CONSIDERATION_TRANSITION break source-instrument pattern continuity.
- CB/warrant/preferred history may not be inserted into common-share history.
- Existing common-share target preserves its own historical lineage.
- Newly created target common security uses DL-126 listing warmup and cannot borrow non-equity predecessor bars.
- Mixed cash/securities/fractional consideration payoff transforms remain outside D01.

### Test evidence
- DL-132~134:
  27/27 PASS.
- DL-135~137:
  25/25 PASS.
- Cumulative deterministic V8-equivalent execution through DL-137:
  645/645 PASS.
- Native Node parity and OOS/prospective performance remain unclaimed.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- ISSUER_ALIAS_FIREWALL = FROZEN.
- SAME_CODE_COLLISION_FIREWALL = FROZEN.
- R1_R7_ALIAS_LINEAGE_INTEGRATION = FROZEN.
- SECURITY_CLASS_FIREWALL = FROZEN.
- ISSUER_EVENT_SECURITY_OPPORTUNITY_SPLIT = FROZEN.
- CLASS_TRANSITION_ADMISSION = FROZEN.
- SAME_ISSUER_EXTRA_PATTERN_VOTE = PROHIBITED.
- CROSS_CLASS_HISTORY_STITCH = PROHIBITED.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Exact next continuation after DL-137
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new outcome-blind D01 science.
3. Candidate next science:
   freeze odd-lot/regular-lot and alternate trading-channel representation identity so the same common-share price event cannot be duplicated across trading venues/lot regimes as separate pattern evidence.
4. If R1-R6 appear, validate DL-095 plus DL-108~137 before physical R7 emission.
5. D16 receives issuer-event dependency and security-class metadata with the full denominator.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.


## Continuation update — DL-138~140 (2026-10-08)

### DL-138 — same-security trading-channel representation firewall
- Frozen channel classes:
  REGULAR_LOT;
  INTRADAY_ODD_LOT;
  AFTER_HOURS_ODD_LOT;
  AFTER_HOURS_FIXED_PRICE;
  BLOCK_TRADE;
  OTHER_OFFICIAL_CHANNEL;
  CHANNEL_UNKNOWN.
- Same security across channels does not imply identical price observation.
- Every D01 canonical bar must bind:
  canonicalBarSourceId;
  channelCompositionVersion;
  included/excluded trading channels;
  marketSessionDate;
  sourceHistoryHash.
- Channel-specific observations may not be silently fused into a custom bar unless the canonical owner/source contract explicitly defines the aggregation.
- Multiple channels on the same security/date share a dependency root and do not multiply votes.
- Pre-regime channel absence is CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN, not DATA_MISSING.

### DL-139 — session-mechanism price-discovery / confirmation firewall
- Frozen mechanism classes:
  opening call auction;
  regular continuous;
  closing call auction;
  intraday odd-lot call auction;
  after-hours odd-lot call auction;
  after-hours fixed price;
  block trade;
  volatility-interruption call auction;
  unknown.
- After-hours fixed-price trading using the regular-session close is execution/liquidity context, not a second price confirmation.
- Odd-lot prices may differ from regular prices but cannot silently replace/fuse with regular geometry.
- Auction sub-observations do not create extra votes over the same canonical OHLC bar.
- Block-trade price does not enter first-wave D01 canonical pattern geometry by default.

### DL-140 — trading-channel regime vintage / common support
- Every channel receipt binds rule version, effective interval and source-channel-composition version.
- Modern channel data may not be backfilled before the channel existed.
- Unknown source composition fails closed.
- Parent/child and old/new-vintage comparison require compatible channel composition and mechanism regime.
- sameSecurityDateChannelClusterId preserves cross-channel dependence without inventing independent vote count.
- Frozen denominator states:
  CHANNEL_OBSERVED;
  CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN;
  CHANNEL_SOURCE_MISSING;
  CHANNEL_COMPOSITION_UNKNOWN_BLOCKED;
  MECHANISM_RULE_UNKNOWN_BLOCKED.

### External primary-source readback
- TWSE officially separates regular trading, intraday odd-lot, after-hours odd-lot, after-hours fixed-price and block trading.
- Intraday odd-lot began on 2020-10-26, first matches at 09:10 and uses periodic call auctions.
- After-hours fixed-price trading uses the same-day regular-session closing price.
- These mechanism differences support D01's channel-dependence firewall and prohibit counting repeated/mechanically fixed observations as independent price discovery.

### Test evidence
- DL-135~137:
  25/25 PASS.
- DL-138~140:
  22/22 PASS.
- Cumulative deterministic V8-equivalent execution through DL-140:
  667/667 PASS.
- Native Node parity and OOS/prospective performance remain unclaimed.

### Governance
- D01 maturity remains 60.0%.
- All 11 D01 modules remain L3.
- SECURITY_CLASS_FIREWALL = FROZEN.
- ISSUER_EVENT_SECURITY_OPPORTUNITY_SPLIT = FROZEN.
- CLASS_TRANSITION_ADMISSION = FROZEN.
- TRADING_CHANNEL_REPRESENTATION = FROZEN.
- SESSION_MECHANISM_FIREWALL = FROZEN.
- CHANNEL_REGIME_VINTAGE = FROZEN.
- MULTI_CHANNEL_EXTRA_PATTERN_VOTE = PROHIBITED.
- SILENT_CHANNEL_FUSION = PROHIBITED.
- PHYSICAL_R1_R7 = PENDING.
- OUTCOME_JOIN = CLOSED.
- Pattern alpha remains UNKNOWN.
- Formal Core remains LOCKED.

### Exact next continuation after DL-140
1. Re-read latest main for physical 1101/2021-06-15 R1-R6 owner returns.
2. If absent, continue only genuinely new outcome-blind D01 science.
3. Candidate next science:
   freeze canonical daily OHLC composition/finality across delayed-close, no-regular-trade and trading-mechanism reforms so a change in what counts as the official daily close cannot masquerade as a pattern change.
4. If R1-R6 appear, validate DL-095 plus DL-108~140 before physical R7 emission.
5. D16 receives channel-regime/composition/dependency metadata with full denominators.
6. No L4 promotion / no Formal Core change without completed OOS/prospective evidence.
