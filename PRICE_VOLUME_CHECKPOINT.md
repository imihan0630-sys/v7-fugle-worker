# Price-Volume Research Checkpoint

Updated: 2026-09-25 Asia/Taipei

## Purpose
Durable handoff for continuous price-volume relationship research.
When a new chat continues price-volume learning, read this file first, then `PRICE_VOLUME_RESEARCH.md`, `DEEP_LEARNING_CHECKPOINT.md`, `KLINE_PATTERN_CHECKPOINT.md`, and the latest `RESEARCH_CHECKPOINT.md`.

Do not restart from generic “volume confirms price” introductions.

## Governance
- Formal Core LOCKED.
- Research / Shadow first.
- Missing evidence = UNKNOWN.
- Every hypothesis requires positive mechanism + opposing interpretation / failure mode.
- Do not convert practitioner slogans directly into program rules.
- Any Formal A/B, ranking, threshold, capital, entry/exit, 15m confirmation, monitoring or push change is Class C and requires owner approval.

## Current research theme
PV-007 — Institutional/sector participation as moderator after same-slot 15m feasibility and pattern-integration design.

## Durable findings
1. Volume contains information beyond price alone, but volume level is not unidirectionally bullish or bearish.
2. High abnormal volume can accompany short-horizon continuation, while high past turnover can also correspond to faster momentum decay / later reversal.
3. Taiwan-specific evidence supports abnormal volume as potentially informative, but effects are sample-, horizon-, and regime-dependent.
4. The current system already contains meaningful daily volume logic; the missing layer is conditional interpretation and normalization, not simply adding a volume factor.
5. Current B breakout logic hard-gates today/prev5 volume >=1.3 and rewards greater relative volume until capped. This deserves nonlinear/climax testing rather than automatic strengthening.
6. Current A pullback logic already recognizes volume contraction; research must distinguish constructive supply dry-up from simple lack of demand.
7. Taiwan intraday volume is time-of-day patterned. Current 15m current-vs-prev5 volume ratio can therefore confound seasonality with abnormal participation.
8. Same-time-slot 15m relative volume and cumulative-volume pace are high-priority Shadow research candidates.
9. Effort-versus-result must be treated as a multi-dimensional interaction: volume state x price efficiency x structure location x overheat state x follow-through.
10. A single high-volume/no-progress bar is ambiguous: distribution, absorption, or exhaustion are all possible. Follow-through is required before directional classification.
11. Price-impact proxies such as return / traded value may help quantify “effort vs result,” but must not be conflated with pure alpha and must handle overnight-vs-session mismatch.
12. Raw low volume can be constructive in a liquid leader or deceptive in an illiquid stock. Existing liquidity gates remain important.

## Candidate handoffs
### PV-001A Contextual Relative Volume
Status: WORTH_SHADOW_RESEARCH.
Research daily RVOL_5, RVOL_20, log-volume z-score, trade-value RVOL, range expansion, close location and structure-state interactions.

### PV-001B Effort-versus-Result
Status: WORTH_SHADOW_RESEARCH.
Research high/low volume x efficient/inefficient price response x structural location. No standalone directional rule.

### PV-001C Same-slot Intraday Volume Normalization
Status: HIGH_PRIORITY_SHADOW_CANDIDATE.
Compare each 15m bar with historical volume for the same intraday slot and expected cumulative-volume pace; retain existing raw/prev5 ratio for comparison.
Class A if research-only; Class C if later used in formal 15m confirmation.

## Exact next continuation point
1. PV-002: define measurable “constructive volume dry-up” vs “no demand” using pullback slope, support hold, close location, range contraction, sector/market context and follow-through.
2. PV-003: test whether breakout-volume quality is nonlinear: moderate expansion vs extreme/climax, and whether extreme volume requires stronger acceptance/retest rules.
3. PV-004: specify 3-10 bar effort-result sequence features and distinguish absorption from distribution without look-ahead.
4. PV-005: design same-slot 15m baseline schema and minimum historical coverage rules for Taiwan session structure.
5. Map all PV features against Pattern Maturity latent geometry and DL-001 Information Discreteness to avoid Factor Zoo duplication.
6. Pre-register validation outcomes before inspecting returns: D1/D3/D5/D10, MFE/MAE, stop-first, false-break rate, coverage and regime splits.
7. Formal Core remains unchanged until mature evidence supports a specific owner-approved proposal.


## Progress added — PV-002 / PV-003 / PV-004
- PV-002 separates constructive supply dry-up from no-demand risk. Low pullback volume is not intrinsically bullish.
- Proposed discrimination uses pullback volume ratio, negative-bar volume, price slope, range contraction, close-location trend, support hold, liquidity, sector context and later rebound-demand state.
- PV-003 challenges the current B-channel's implicit monotonic “more breakout volume is better” assumption. Literature supports both short-horizon high-volume continuation and higher disagreement/overconfidence/reversal risk.
- Extreme breakout volume should therefore be tested as a nonlinear/contextual variable, especially with late-stage extension, gap, upper rejection, price-progress efficiency, institutional activity and sector participation.
- PV-004 specifies an as-of-date event lifecycle so high-volume/no-progress remains ambiguous until later acceptance/failure evidence arrives. Later evidence updates state but never rewrites the historical decision timestamp.

## Revised exact next continuation point
1. PV-005: design Taiwan same-slot 15m volume baseline and cumulative-volume pace with coverage rules.
2. PV-006: map price-volume features against VCP/Cup/W/Platform/false-break Pattern Maturity to avoid double counting.
3. PV-007: study whether institutional participation and sector breadth help distinguish informed/broad participation from attention/disagreement volume.
4. PV-008: build nonlinear breakout-volume validation plan with frozen buckets/quantiles before outcome inspection.
5. PV-009: design prospective Shadow data schema and outcome ledger; no Formal use.


## Progress added — PV-005 / PV-006 / PV-007
- Fugle historical candles can provide 15m history back to 2023-05-23, making same-slot volume research technically feasible.
- PV-005 keeps three distinct intraday measurements: local previous-5-bar acceleration, same-slot abnormal volume, and cumulative day-volume pace.
- Minimum coverage / halt / missing-session semantics must be explicit; insufficient history = UNKNOWN.
- PV-006 maps price-volume state onto Pattern Maturity lifecycle and forbids duplicate named-pattern volume scores when one latent supply-contraction variable explains them.
- PV-007 treats institutional and sector participation as moderators of abnormal volume, not new additive factors, because the current system already contains institutional and sector features.

## Revised exact next continuation point after PV-007
1. PV-008: define frozen nonlinear breakout-volume response study with quantile bins / splines and explicit climax interaction.
2. PV-009: design research-only data schema that can store daily + 15m PV features with as-of timestamp, source provenance, coverage and decisionImpact=false.
3. PV-010: specify prospectively testable “volume acceptance lifecycle” from breakout -> retest -> re-acceleration / failure.
4. PV-011: study up-volume/down-volume asymmetry and whether signed volume proxies add information beyond institutional flow.
5. PV-012: study turnover vs raw volume and free-float normalization feasibility for cross-stock comparisons.
6. Keep Formal Core unchanged.

## Progress added — PV-008 through PV-015
- PV-008 freezes a nonlinear breakout-volume Shadow study. Existing Formal B >=1.3 breakout-volume rule remains unchanged; research bins diagnose moderate vs extreme expansion and climax interactions.
- PV-009 defines separate daily / 15m feature snapshots and a delayed outcome ledger. Historical features are immutable as-of-time and never rewritten using later outcomes.
- PV-010 defines a volume-acceptance lifecycle: BREAKOUT_ATTEMPT -> INITIAL_ACCEPTANCE -> RETEST -> REACCELERATION / FAILED_REENTRY / AMBIGUOUS.
- PV-011 allows up/down signed-volume proxies only as noisy research features. Bar-sign volume is not true buy/sell order flow and must prove incremental value beyond return/candle/institution variables.
- PV-012 prefers own-history RVOL first; issued-share / value-turnover normalization is secondary and must preserve as-of data quality. Issued shares are not free float.
- PV-013 adds a Taiwan-specific price-limit censoring control. Generic effort-vs-result metrics must exclude or separately model bars near/hitting +/-10% limits.
- PV-014 distinguishes a one-day abnormal-volume shock from a persistent multi-day abnormal-volume wave.
- PV-015 records turnover x 52-week-high evidence but keeps it low/medium priority because of overlap with existing high60 / breakout / overheat logic and possible API cost.
- Strongest current PV candidates: same-slot 15m RVOL, nonlinear breakout volume, acceptance lifecycle, price-limit control, abnormal-volume persistence, and constructive dry-up vs no-demand.
- Formal Core remains unchanged.

## Revised exact next continuation point after PV-015
1. PV-016: study price vs session cumulative average / VWAP-style acceptance and whether current Fugle `average` can add nonredundant intraday information.
2. PV-017: study price impact / liquidity-efficiency measures such as return-or-range per traded value, including when they fail near price limits or illiquid names.
3. PV-018: study gap x volume archetypes (information gap continuation vs exhaustion gap) with strict as-of lifecycle rules.
4. PV-019: study multi-timeframe volume alignment (daily + 60m/15m) without double-counting the same event.
5. PV-020: define a compact latent-state architecture so dry-up, breakout participation, acceptance, persistence and exhaustion do not become a Factor Zoo.
6. Then design a minimum prospective Shadow experiment and sample-size/coverage stopping rules before any coding proposal that could affect selection.
7. Formal Core remains LOCKED.

## Progress added — PV-016 through PV-020
- PV-016 treats Fugle session cumulative average / VWAP-style position only as an intraday acceptance diagnostic, not a proven standalone alpha factor.
- PV-017 introduces price-impact / effort-vs-result diagnostics but explicitly separates liquidity effects from directional alpha and requires price-limit / liquidity controls.
- PV-018 separates Taiwan overnight gap information from intraday acceptance. Gap + volume is not automatically strength; gap sentiment risk and information acceptance must be distinguished by later price behavior.
- PV-019 defines a multi-timeframe hierarchy: daily=context, coarse intraday=transition, 15m=resolution, 10m=auxiliary. Do not add duplicate volume points across timeframes for the same event.
- PV-020 consolidates the research into latent states: Participation, Price Response, Acceptance Lifecycle, Persistence, and Constraint/Guard. This is preferred to a growing collection of independent volume scores.
- Current research direction is now conditional-state modeling rather than traditional “volume indicator” accumulation.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-020
1. PV-021: study intraday volume concentration by time block (opening / mid-session / closing) beyond same-slot RVOL and cumulative pace.
2. PV-022: test sequence structure: pre-breakout dry-up -> breakout re-expansion -> retest contraction -> reacceleration.
3. PV-023: design residual/incremental-value tests versus Pattern Maturity, Residual RS, sector, institution, overheat and Information Discreteness.
4. PV-024: define prospective sample-size, coverage and stopping rules before recommending any Shadow implementation.
5. PV-025: define exact minimal Shadow feature set; explicitly reject redundant candidates.
6. Only after PV-021~025 should engineering insertion into research-only snapshots be proposed.
7. Formal Core remains LOCKED.

## Progress added — PV-021 through PV-027
- PV-021 adds opening/mid/closing volume concentration but enforces strict no-look-ahead semantics: full-day block shares are post-close only; live snapshots use same-block historical baselines and cumulative pace.
- PV-022 formalizes dry-up -> breakout expansion -> retest contraction -> reacceleration as a falsifiable state sequence, not an assumed bullish law. Retest is optional and must prove incremental value.
- PV-023 requires incremental-value testing after existing Formal A/B, Pattern Maturity, Residual RS, sector, institution, overheat, liquidity, Information Discreteness and regime controls. Date-blocked validation and multiple-testing controls are mandatory.
- PV-024 defines prospective operational coverage gates: >=20 valid history sessions for slot features; first 50 events data-quality only; evidence interpretation after >=100 completed events and >=30 distinct market dates, with milestone reviews at 100/250/500. These are governance floors, not universal statistical-power claims.
- PV-025 defines the minimum viable Shadow set and explicitly rejects redundant indicators. Proposed new fields: pvDailyRvol20, pvSlotRvol20, pvCumvolPace20, pvResponseState, pvAcceptanceState, pvPersistenceState, pvGuardState plus coverage/provenance. Existing Worker volume fields remain reused, not duplicated.
- PV-026 separates directional alpha from risk/information-intensity value. A PV feature may fail to predict sign yet still help predict volatility, false-break, stop-first or execution risk.
- PV-027 proposes market/sector-residual abnormal volume as a comparison, not an extra score, because stock RVOL may reflect common market/sector activity.
- Minimal Shadow set is ready for an engineering proposal with decisionImpact=false; Formal scoring is not ready.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-027
1. PV-028: study volume distribution / concentration inside a bar or day only if data semantics support it; avoid inventing volume-at-price from OHLCV candles.
2. PV-029: study trade-count vs average-trade-size evidence and whether available Taiwan/Fugle data can support it historically.
3. PV-030: study corporate actions / shares-outstanding changes and baseline-reset rules so RVOL history is not corrupted by capital changes.
4. PV-031: study downside vs upside volume-volatility asymmetry and whether risk controls should be direction-sensitive.
5. PV-032: map PV states into current entry / maxChase / stop-risk research targets without changing Formal decisions.
6. Engineering proposal may be drafted for research-only Shadow logging; do not implement Formal use without owner approval.
7. Formal Core remains LOCKED.

## Progress added — PV-028 through PV-032
- PV-028 confirms volume-at-price / trade-detail data are current-day microstructure sources, not historical candle equivalents. Never synthesize historical volume profile from OHLCV; defer to prospective capture only.
- PV-029 records Taiwan evidence that transaction count may explain volatility better than average trade size, but current documented Fugle historical candles lack trade count. Keep this second-stage/prospective only.
- PV-030 adds a high-priority corporate-action baseline-reset guard. Raw-volume baselines must not silently straddle splits, par-value changes, capital reductions or long halt/resume events; require a post-action rebuild unless adjustment semantics are verified.
- PV-031 separates downside volume-volatility asymmetry from direction. Extreme downside volume can signal higher risk yet still represent capitulation/absorption; later acceptance remains necessary.
- PV-032 maps PV research onto the actual system funnel. Highest direct optimization hypothesis remains same-slot 15m RVOL + cumulative pace versus current previous-5-bar ratio, followed by acceptance lifecycle and market-structure/data guards.
- Do not mix immature PV research into ABF re-add until the reduced-position state machine is separately validated.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-032
1. PV-033: define risk-target labels for realized range / MAE / stop-first so PV volatility value can be tested separately from direction.
2. PV-034: specify market/sector residual-RVOL calculation using current full-market daily snapshots and assess 15m feasibility/cost.
3. PV-035: study abnormal-volume half-life / decay and event freshness so stale volume shocks do not remain “strong.”
4. PV-036: integrate PV states with Information Discreteness / news-event context without double counting attention.
5. PV-037: draft the exact research-only Shadow engineering specification, storage schema, API budget and tests for the PV-025 minimum set.
6. No Formal implementation without owner-approved proposal.
7. Formal Core remains LOCKED.

## Progress added — PV-033 through PV-037
- PV-033 defines separate directional and risk outcome ledgers. PV may survive as a volatility/MAE/stop-first/false-confirmation feature even when directional return prediction is weak.
- PV-034 defines daily market- and sector-residual RVOL using existing full-market daily history. Use robust market median and leave-one-out sector median; retain raw RVOL because sector-wide participation may be valid confirmation. Full-market 15m residualization is deferred for cost/complexity and unit-semantics reasons.
- PV-035 adds event freshness variables (age, days/bars since peak, current-to-peak RVOL, decay slope) and explicitly rejects a universal hard-coded N-day expiry until prospective Taiwan evidence exists.
- PV-036 requires interaction, not additive double counting, between PV, Information Discreteness and news/attention context. Discrete move + extreme volume can mean rapid information incorporation or attention overreaction; no universal continuation label.
- PV-037 defines the exact research-only Shadow engineering spec: dedicated D1 snapshots/outcomes/intraday-baseline cache, immutable as-of features, completed-bar only, strict no-look-ahead, corporate-action reset, Formal-isolation tests and phased rollout.
- Daily Shadow fields can reuse current full-market history with effectively no new daily historical calls when cache coverage is valid. 15m baseline should be bootstrapped only for newly monitored symbols and then rolled forward, not refetched every monitor cycle.
- Minimal engineering proposal is now sufficiently specified for research-only implementation, but it has NOT been implemented and Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-037
1. PV-038: examine volume-conditioned return autocorrelation / continuation-vs-reversal diagnostics (Llorente-style) without pretending to identify trader motive.
2. PV-039: audit classic OBV / PVT / A-D / CMF / MFI indicators for mathematical redundancy with fields already in the system.
3. PV-040: study robust normalization choices (median/MAD, log-RVOL, percentiles) and outlier/corporate-action behavior.
4. PV-041: define event de-duplication for overlapping abnormal-volume signals so one multi-day episode is not counted as many independent samples.
5. PV-042: define how PV research should interact with late-stage / momentum-life-cycle logic without becoming a monotonic “more volume is stronger” rule.
6. Keep engineering proposal research-only; no Formal use without owner approval.
7. Formal Core remains LOCKED.

## Progress added — PV-038 through PV-047
- PV-038 studies volume-conditioned continuation/reversal using a Llorente-style return x abnormal-volume interaction, but forbids interpreting the coefficient as direct proof of informed vs liquidity trader motive. Per-stock ~60D estimation is too unstable for the minimum Shadow set.
- PV-039 audits OBV, Accumulation/Distribution, CMF, MFI, Volume Oscillator and price-volume-distribution style indicators. Most repackage primitive price direction / close location / volume / short-long volume relations already represented in the system. No independent classic-indicator score is justified.
- PV-040 freezes Shadow v0.1 normalization semantics: pvDailyRvol20 and pvSlotRvol20 use prior-20-valid-session medians; pvCumvolPace20 uses prior-20 same-slot cumulative medians. Raw values remain stored; insufficient/zero baseline => UNKNOWN.
- PV-041 adds event de-duplication. Persistent multi-day or multi-bar abnormal-volume episodes may have many snapshots but must not be counted as many independent events.
- PV-042 treats volume as momentum-life-cycle context, especially with lateStage/overheat, rather than monotonic strength. High-volume winners can reverse faster at longer horizons, but this is not a next-day sell rule.
- PV-043 adds Taiwan auction-aware intraday phases: opening call-auction mixed, continuous, closing call-auction mixed. Exact Fugle 15m bucket boundaries must be fixture-tested against 1m/trade data rather than assumed.
- PV-044 documents intraday volatility interruption as a possible 15m confounder. Historical candles cannot prove VI occurred, so do not synthesize it from price/volume shapes.
- PV-045 forbids treating final-bar high RVOL as automatic confirmation because 13:25-13:30 is a closing call-auction phase.
- PV-046 requires exchange-consistent adjusted reference prices for ex-rights/ex-dividend gap/return semantics; raw previous close can create fake overnight gaps.
- PV-047 limits main PV v0.1 semantics to ordinary TWSE/TPEx listed mainboard equities. Emerging Stock Board has incompatible quote-driven/session mechanics and must be guarded as unsupported.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-047
1. PV-048: study limit-up/limit-down lock, unlock and queue/participation semantics; determine what can/cannot be reconstructed from available data.
2. PV-049: formalize divergence detection (price makes new extreme while participation fails) without hindsight swing selection.
3. PV-050: revisit share-turnover / shares-outstanding normalization with timestamped capital data and corporate-action resets.
4. PV-051: study PV-state stability across BULL_BROAD / MIXED / BEAR_BROAD and high/low market-volume regimes.
5. PV-052: build an integrated PV decision table showing constructive interpretation, adverse interpretation, UNKNOWN conditions and exact Shadow variables for every major price-volume state.
6. Keep `PRICE_VOLUME_SHADOW_SPEC.md` synchronized with new guards; no Formal implementation without owner approval.
7. Formal Core remains LOCKED.

## Progress added — PV-048 through PV-052
- PV-048 defines limit-up/down as a market-structure context. Historical candles cannot reconstruct lock duration, unlock/relock count or queue history. Fugle live quote/order-book fields can support prospective candidate-state capture only; five-level book snapshots do not equal the full queue.
- PV-049 formalizes price-volume divergence without hindsight: comparisons may use only pivots already confirmed as-of-time, and participation must be normalized rather than raw. Lower volume at a new high can mean weakening demand OR scarce supply / efficient trend; later acceptance is required.
- PV-050 confirms daily turnover normalization is feasible using timestamped official issued-common-share data for both TWSE and TPEx. Issued shares are not free float; no marketCap/price hidden fallback is allowed. Corporate-action alignment remains mandatory.
- PV-051 requires explicit regime splits using the system's existing BULL_BROAD / MIXED / BEAR_BROAD states. Volume-return relations are not assumed to have one universal sign.
- PV-052 creates the integrated interpretation matrix: every major PV state records constructive interpretation, adverse interpretation, UNKNOWN/guard conditions and exact Shadow evidence. Research outputs may remain AMBIGUOUS rather than forcing bullish/bearish classification.
- Engineering tiers are now explicit: Tier 1 minimum Shadow; Tier 2 residual RVOL/divergence/turnover/freshness/late-stage interaction; prospective microstructure deferred.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-052
1. PV-053: map the PV interpretation matrix onto Pattern Maturity states (VCP/cup/W/platform/false-break) while proving no duplicate scoring.
2. PV-054: study sector-leader / follower synchronization in abnormal volume and whether leadership improves stock-specific PV interpretation.
3. PV-055: study post-event volume normalization after earnings/material information days so event-driven baselines do not contaminate ordinary days.
4. PV-056: define “PV veto / modifier / observer” governance — which evidence could ever block, adjust, or merely annotate a Formal candidate after validation.
5. PV-057: define the first prospective experiment protocol and freeze hypotheses before any Shadow implementation.
6. Keep `PRICE_VOLUME_SHADOW_SPEC.md` synchronized; no Formal implementation without owner approval.
7. Formal Core remains LOCKED.

## Progress added — PV-053 through PV-057
- PV-053 maps generic PV latent states onto Pattern Maturity and forbids named-pattern volume bonuses when geometry + generic PV already explain the information.
- PV-054 studies time-ordered sector leader/follower participation. Industry lead-lag evidence supports information diffusion, but leader strength is only a moderator and must prove incremental value beyond current sector score/breadth/RS.
- PV-055 prevents event-day baseline contamination by preserving the robust ordinary rolling median while freezing a separate pre-event baseline for within-episode persistence/decay. Do not blanket-exclude all news/earnings days.
- PV-056 defines governance levels: OBSERVER, MODIFIER, VETO. All current PV research remains OBSERVER. Data-semantic invalidity may veto PV interpretation only; no predictive PV state may veto a Formal stock without separate Class C approval.
- PV-057 freezes the first prospective experiment: among symbols already selected/monitored by Formal, compare current previous-5-bar 15m volumeRatio against pvSlotRvol20 + pvCumvolPace20 + latent states for false/no-follow-through, MFE/MAE and structural acceptance. PV must not change cohort selection.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-057
1. PV-058: define exact false/no-follow-through labels for the 15m experiment using only frozen plan/pivot information.
2. PV-059: define bar-horizon vs trading-day-horizon outcome windows and avoid overlapping-label leakage.
3. PV-060: design D1 outcome completion/finalization jobs and idempotency for PV Shadow.
4. PV-061: audit API-call and D1-write budget for selected/monitored-symbol 15m baselines under the current cron cadence.
5. PV-062: define dashboard/report outputs that expose evidence without affecting Formal action.
6. After PV-058~062, research-only implementation may be proposed as a self-contained Class A change.
7. Formal Core remains LOCKED.

## Progress added — PV-058 through PV-062
- PV-058 freezes channel-specific false/no-follow-through labels. B reuses current Formal breakout *0.995 / retestLow semantics; A reuses frozen buyLow/stop. Threshold-free no-close/no-high-progress outcomes are also stored with continuous MFE/MAE.
- PV-059 separates same-session B1/B2/B4 15m horizons from overnight/NEXT_SESSION and D1/D3/D5/D10 trading-day horizons. A late-session event that cannot complete B4 is INCOMPLETE, never rolled into the next day.
- PV-060 defines idempotent outcome finalization. Feature snapshots remain immutable; outcomes upsert by snapshot_id+horizon only after source bars/dates are complete. Repeated every-minute cron runs must not create duplicates or mutate completed outcomes.
- PV-061 audits resource design against current Worker: max 6 monitored symbols, every-minute Quote, 10m/15m refresh only after close. PV v0.1 should add zero live candle calls during ordinary monitoring by reusing existing frame15. Historical 15m baseline bootstraps once per newly monitored symbol and then rolls forward.
- At 18 fifteen-minute slots x 6 symbols, the worst-case full-bar logging ceiling is 108 PV feature snapshots per trading day before outcomes. Never write duplicates every minute.
- PV-062 defines a research/admin reporting surface only: counts, coverage, guards, A/B channel, regime/session splits, model A→E comparisons, false/no-progress and MFE/MAE. No trade instruction or push semantics.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-062
1. PV-063: define exact pvResponseState formulas using ATR/range/close-location and robust participation, including price-limit/auction guards.
2. PV-064: define exact pvAcceptanceState transitions for A and B separately, with immutable timestamps.
3. PV-065: define pvPersistenceState thresholds/quantiles without outcome tuning.
4. PV-066: define pvGuardState precedence when multiple guards coexist.
5. PV-067: turn PRICE_VOLUME_SHADOW_SPEC.md into implementation-ready pseudocode/test cases, still without modifying Worker.js.
6. Only after PV-063~067 consider a Class A research-only implementation proposal.
7. Formal Core remains LOCKED.

## Progress added — PV-063 through PV-072
- PV-063 freezes pvResponseState v0.1 using same-slot robust participation, same-slot true-range normalization, close location and wick/body structure. HIGH_EFFORT_LOW_PROGRESS remains directionally ambiguous; price-limit/auction observations are guarded.
- PV-064 freezes separate A/B acceptance state machines using current Formal geometry only. Shadow states observe existing Formal semantics and never cause the transition.
- PV-065 freezes persistence hysteresis: abnormal>=1.3; fresh shock, persistent, decaying, normalized after two comparable sub-threshold observations, optional reignition under same event_key. Missing/halted observations pause rather than count as normalization.
- PV-066 stores primary guard + all guard flags + interpretability; invalid data guards outrank contextual market-structure guards. PV invalidity never invalidates the Formal stock.
- PV-067 provides implementation-ready pseudocode and 18 mandatory no-look-ahead, state, unit, idempotency and Formal-isolation tests. Proposed schema version: PV_SHADOW_V0_1. Worker remains unchanged.
- PV-068 corrects provider/session semantics: Fugle v1 minute candles are start-timestamped; current Formal cron ends 13:24, so zero-extra-call v0.1 observes completed 15m bars only through the 13:00-start bar. Current ceiling is 17 bars x 6 stocks = 102 rows/day, superseding the earlier 108 assumption.
- PV-069 adds Taiwan day-trading intensity as a Tier-2 volume-quality/risk moderator. TWSE/TPEx publish per-security day-trading volume/value; TPEx figures can be revised through T+2, so as-of finality must be stored.
- PV-070 corrects PV-029: intraday historical transaction count remains unavailable from candle history, but daily transaction count is available from official TWSE/TPEx daily closing data already fetched by Worker; daily count/average-trade-size research is therefore low incremental cost.
- PV-071 prohibits raw cross-timeframe volume arithmetic until source-session scope is reconciled. Daily RVOL and intraday RVOL remain normalized within their own source/timeframe family.
- PV-072 adds attention/disposition/unusual-recommendation/abnormal-security flags as guarded Tier-2 context, never Formal penalties.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-072
1. PV-073: decompose daily abnormal volume into transaction-count shock vs average-trade-size shock using official closing data.
2. PV-074: study intraday volume-shape concentration/front-loading using only as-of-safe features and distinguish post-close descriptive metrics from live metrics.
3. PV-075: study first-15m opening-auction mixture vs continuous-session participation and whether 1m decomposition is worth the extra complexity.
4. PV-076: study whether day-trading-share explains high-RVOL false confirmations / high MAE after controlling for regime and attention flags.
5. PV-077: define which Tier-2 fields are worth keeping versus rejecting before any implementation grows beyond v0.1.
6. Keep PRICE_VOLUME_SHADOW_SPEC.md synchronized; Worker remains untouched.
7. Formal Core remains LOCKED.
