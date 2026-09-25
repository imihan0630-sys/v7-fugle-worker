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
- PV-029 records Taiwan evidence that transaction count may explain volatility better than average trade size. **Superseded/qualified by PV-070:** Fugle historical candles lack intraday transaction count, so intraday historical count remains second-stage/prospective; daily transaction count is available from official TWSE/TPEx closing data and is a feasible Tier-2 field.
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
- **Superseded by PV-068:** the earlier 18-slot/108-row estimate ignored the current cron ending at 13:24. Zero-extra-call v0.1 observes completed 15m bars starting 09:00 through 13:00: 17 bars x 6 symbols = 102 feature snapshots/day. Never write duplicates every minute.
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

## Progress added — PV-073 through PV-077
- PV-073 decomposes daily abnormal volume into transaction-count shock vs average-trade-size shock using official daily closing data. States COUNT_DRIVEN / SIZE_DRIVEN / BOTH_EXPANDED are descriptive only; do not infer retail vs institutional identity.
- PV-074 studies intraday volume shape with simple as-of descriptors (peak slot RVOL, bars since peak, abnormal-slot count, post-opening persistence). Complex HHI/entropy concentration metrics are deferred because of likely redundancy with persistence/cumulative pace.
- PV-075 confirms first 15m mixes opening call-auction and early continuous trading. Same-slot normalization remains valid for abnormality, but 1m auction/continuous decomposition is deferred unless first-slot results prove materially different.
- PV-076 defines day-trading share as explanatory context for high-RVOL false-confirmation / MAE research, but same-day use is blocked by publication/finality timing relative to the 18:10 scan, especially TPEx T+2 revisions.
- PV-077 prunes Tier-2 scope. Strong candidates after v0.1 QA: daily transaction decomposition, daily residual RVOL, event freshness. Conditional: issued-share turnover, divergence, attention/disposition flags. Deferred: opening 1m decomposition, intraday trade-count history, volume-at-price history, queue history, same-day day-trading selection input, HHI/entropy shape, full-market 15m residualization. Classic packaged volume indicators remain rejected as independent scores.
- Current judgment: stop expanding indicators; next value comes from implementing/collecting prospective Shadow v0.1 evidence.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-077
1. PV-078: perform consistency audit across PRICE_VOLUME_RESEARCH.md / CHECKPOINT / SHADOW_SPEC for superseded assumptions and contradictions.
2. PV-079: build exact implementation delta map showing which Worker functions/tables would change in a research-only Class A patch, without applying it.
3. PV-080: freeze v0.1 field dictionary, types, null/UNKNOWN semantics and schema-version migration rules.
4. PV-081: freeze rollout acceptance tests and rollback criteria.
5. PV-082: decide whether evidence is sufficient to propose Class A Shadow implementation to owner; no automatic implementation.
6. Formal Core remains LOCKED.

## Progress added — PV-078 through PV-082
- PV-078 completed a cross-file consistency audit. Superseded assumptions are now marked rather than silently deleted: the 18-slot/108-row v0.1 bound is superseded by the audited 17-slot/102-row current-cron bound; PV-029 is qualified so only intraday historical trade-count remains prospective while official daily transaction count is feasible.
- A durable supersession rule is now defined. For implementation, the canonical precedence is PRICE_VOLUME_SHADOW_IMPLEMENTATION_PLAN.md -> PRICE_VOLUME_SHADOW_SPEC.md -> latest CHECKPOINT corrections -> RESEARCH evidence history.
- PV-079 maps a Class-A Shadow patch to exact Worker/D1 integration points while explicitly forbidding semantic changes inside evaluatePullback/evaluateMomentum/evaluateStop/buildFinalDecision/compareResults/evaluateOperationSignals and selector/ranking/capital logic. Research attaches only after Formal results exist.
- PV-080 freezes the PV_SHADOW_V0_1 field dictionary, numeric null vs state UNKNOWN semantics, guard/provenance fields, unrounded classification and schema-version rules. Any semantic threshold/state/slot/unit change requires a new version and never rewrites old rows.
- PV-081 freezes feature-flag, rollout, telemetry, kill-switch and rollback criteria. Any Formal output/push difference, propagated PV exception, unexpected live API growth, look-ahead, snapshot mutation or unit mixing is an immediate disable trigger.
- PV-082 concludes that research is mature enough to propose a Class-A LOG_ONLY decisionImpact=false Shadow implementation, but there is still zero prospective evidence supporting Formal optimization.
- New canonical engineering file: PRICE_VOLUME_SHADOW_IMPLEMENTATION_PLAN.md.
- Worker.js remains unchanged; Formal Core remains LOCKED.

## Revised exact next continuation point after PV-082
1. PV-083: freeze statistical evaluation unit and dependence handling (event-level vs snapshot-level, date/symbol/event clustering).
2. PV-084: define effect-size and calibration reporting so tiny statistical significance cannot masquerade as useful trading value.
3. PV-085: freeze multiple-testing / model-comparison governance for the A->E primary experiment.
4. PV-086: define practical utility metrics for false-confirmation reduction versus missed-valid-confirmation cost, still without changing Formal.
5. PV-087: define explicit Observer -> Modifier promotion gates and failure-to-promote conditions.
6. No new indicator expansion unless a genuine unresolved mechanism appears.
7. Formal Core remains LOCKED.

## Progress added — PV-083 through PV-087
- PV-083 freezes the statistical unit: event-level is primary for abnormal-volume shock/confirmation research; raw snapshots are nested within event/symbol/date and cannot be treated as iid sample size. Date-block splits and event/date dependence controls are mandatory.
- PV-084 requires effect-size and stability reporting before significance: absolute failure-rate difference, risk ratio, median MFE/MAE/return and subgroup stability. P-values/AUC alone cannot justify usefulness.
- PV-085 freezes the primary A->B->C->D->E comparison family and prohibits threshold tournaments/winner picking. Any semantic threshold revision becomes a new prospective schema version; failed tests remain in a durable ledger.
- PV-086 defines utility as a trade-off between adverse confirmations avoided and valid follow-through opportunities lost, including impact on BUY frequency / idle capital. A filter that improves win rate by suppressing nearly all entries fails the system objective.
- PV-087 freezes Observer->Modifier promotion gates: integrity, coverage, incremental value, stability, utility, simplicity and a fresh untouched confirmation block. All current PV remains OBSERVER; Modifier is not approved and Veto requires a separate higher-bar Class C proposal.
- Formal Core remains unchanged / LOCKED.

## Revised exact next continuation point after PV-087
1. PV-088: create deterministic synthetic fixtures for the most important response/acceptance/persistence/guard cases before implementation.
2. PV-089: define baseline bootstrap date/session parsing and exact slot keys, including holidays/missing bars/current-session exclusion.
3. PV-090: define research feature fingerprints and Formal-output fingerprints for byte/semantic isolation tests.
4. PV-091: define the durable hypothesis/test ledger schema to prevent forgotten failed experiments.
5. PV-092: final pre-implementation readiness audit; identify unresolved blockers that require owner decision versus items safe for Class-A implementation.
6. Do not expand the indicator set unless a genuine unresolved mechanism is found.
7. Formal Core remains LOCKED.

## Progress added — PV-088 through PV-092
- PV-088 defines deterministic synthetic oracle fixtures for response, A/B acceptance, persistence, guards and unit safety. The implementation must match these expected states before real market outcomes are examined.
- PV-089 freezes baseline bootstrap semantics: Taiwan-local start-time slot keys, current-session exclusion, exact-slot identity, slot-specific validity, stricter contiguous validity for cumulative pace, explicit-zero vs missing distinction, official holiday skipping and corporate-action reset.
- PV-090 freezes canonical SHA-256 fingerprints for Formal-output isolation, immutable PV snapshots and completed outcomes. Same key + different semantic fingerprint is a mutation conflict and must never silently overwrite.
- PV-091 creates PRICE_VOLUME_HYPOTHESIS_LEDGER.md so planned, failed, inconclusive and supported hypotheses remain durable. Initial frozen hypotheses PV-H001 through PV-H004 cover slot RVOL, cumulative pace, latent states and risk-without-direction.
- PV-092 completes the pre-implementation readiness audit. PV_SHADOW_V0_1 research semantics are mature enough for owner-authorized Class-A LOG_ONLY implementation, but no prospective sample exists for Formal optimization.
- Remaining unknowns such as exact 13:30 15m representation, explicit VI source, same-day day-trading finality, free float and historical intraday trade count do not block the narrow v0.1 because they remain guarded/out of scope.
- Formal Core remains unchanged / LOCKED.

## Current state after PV-092
- PRICE_VOLUME_RESEARCH.md: research specification complete through PV-092.
- PRICE_VOLUME_SHADOW_SPEC.md: current Shadow design.
- PRICE_VOLUME_SHADOW_IMPLEMENTATION_PLAN.md: canonical current engineering plan.
- PRICE_VOLUME_HYPOTHESIS_LEDGER.md: canonical hypothesis/test history.
- Next rational action is not indicator expansion. It is owner-approved Class-A LOG_ONLY implementation and prospective DATA_QA.
- Superseded by PV-093: owner authorization was subsequently received; the patch-chain implementation is recorded below while Formal Core remains unchanged.

## Progress added — PV-093 implementation

- Owner authorization was received; V8.11.0 implements `PV_SHADOW_V0_1` as Class-A `LOG_ONLY`, `decisionImpact=false`, `formalCoreImpact=false`.
- The default flag remains OFF. OFF performs no PV bootstrap, feature calculation or D1 write.
- ON stores immutable intraday/daily snapshots, horizon outcomes and prior-session-only baseline rows in the three frozen D1 tables. Ordinary monitoring reuses completed 15m bars and adds zero live candle calls.
- PV hooks run after Formal processing and are fail-open. They emit zero PV pushes/actions and cannot alter selection, ranking, capital, A/B/stop decisions or the existing local volume ratio.
- Mandatory deterministic T1–T18 tests and the 44-test legacy/full regression pass are the implementation acceptance gate; no prospective market evidence is claimed by this milestone.
- Formal Core remains LOCKED.

## Current state after PV-093

- Engineering phase: implementation completed; next phase is prospective `DATA_QA`.
- PV-H001 through PV-H004 move to `DATA_QA`; they are not supported or rejected yet.
- Next exact continuation: enable `PV_SHADOW_ENABLED=true` only in a controlled environment, verify first-session slot/coverage/guard/fingerprint integrity and live-call counts, then collect the frozen first 50 events before any inferential analysis.
- Any Formal fingerprint difference, PV exception propagation, PV push/action, unexpected live API growth, look-ahead, mutation conflict or unit mixing is an immediate kill-switch condition.

## Progress added — PV-098 through PV-117
- PV-098 audits current dealer-flow semantics: official TWSE/TPEx data split dealer proprietary vs hedge, but current Worker stores only combined dealerNet and dealerBuyDays. Combined flow is real cash demand but broader than directional dealer conviction.
- PV-099 links Taiwan covered-warrant evidence: dynamic hedge demand can alter underlying volume/volatility and unwind around expiry. Hedge flow is a volume-origin label, not a bearish/bullish discount.
- PV-100 integrates ETF creation/redemption/arbitrage as common basket flow. Causal direction between ETF and constituent prices is not assumed.
- PV-101 confirms official daily volume can include block-trading activity; daily RVOL can therefore be elevated by non-regular-session sources. Never infer block share as daily-minus-intraday residual without source reconciliation.
- PV-102 creates the volume-origin decomposition framework and registers dealer proprietary-vs-hedge as the highest-priority Tier-2 origin test because the fields already exist in the current official payload.
- PV-103~107 integrate leverage/shorting semantics: margin and short balances are leverage/disagreement/crowding states, not simple direction scores; current 23:35 scan makes same-day TWSE/TPEx short/SBL data temporally research-eligible subject to exact freshness/finality checks. Current combined dealerBuyDays remains unchanged pending evidence.
- PV-108~110 establish that disposition securities alter the matching clock. Periodic 5/20-minute auction sessions can invalidate normal 15m same-slot RVOL semantics. Attention is context; disposition is altered market structure. Disposition sessions should pause/exclude baseline accumulation, not be zero-filled or force a full corporate-action reset.
- PV-111 identifies current cross-market coverage asymmetry: research infrastructure captures TWSE attention/disposition but TPEx disposition remains explicit UNKNOWN in V8.7.11. UNKNOWN must not be treated as non-disposition.
- PV-112 integrates the existing Leverage/Shorting lane: disposition/attention are constraint variables conditioning leverage and PV, not alpha factors.
- PV-113 integrates the existing Passive Flow lane: PV should consume provider-quality index-event states rather than rebuild a duplicate rebalance model.
- PV-114~117 integrate the existing Derivatives/Volatility lane. Index futures/options expiry is primarily broad market/common-flow context; covered warrants/single-stock derivatives can be stock-specific. Expiry-day late-session volume does not prove hedge causality.
- New durable hypothesis: PV-H005 dealer proprietary vs hedge flow decomposition.
- PV_SHADOW_V0_1 remains unchanged during DATA_QA; all new items are Tier-2 / cross-lane research only.
- Formal Core remains LOCKED.

## Revised exact next continuation point after PV-117
1. PV-118: build one unified volume-origin taxonomy: stock-specific information / discretionary flow / mechanical hedge / passive basket / leverage-crowding / market-structure distortion / common-factor flow / unknown.
2. PV-119: define attribution-confidence levels so the system never states a causal origin more strongly than the evidence permits.
3. PV-120: build a source-readiness matrix with TWSE/TPEx coverage, publication time, historical depth, revision/finality and incremental API cost for each origin.
4. PV-121: define how residual RVOL and origin context interact without double counting.
5. PV-122: freeze PV-H005 data-capture/test protocol using existing institution payloads, still no Formal change.
6. Continue cross-lane integration before inventing any new indicator.
7. Formal Core remains LOCKED.

## Progress added — PV-118 through PV-130
- PV-118 freezes a unified volume-origin taxonomy: stock-specific information, discretionary directional flow, mechanical hedge, passive basket, leverage crowding, market-structure distortion, common-factor flow, negotiated/liquidity transfer, retail short-horizon activity, and unknown/mixed.
- PV-119 freezes attribution-confidence levels AC0~AC4. Context overlap is not causality; same-symbol official flow can support AC2; compatible gross flow shares can support AC3; causal claims require much stronger identification. Net flow is never treated as a causal share of volume.
- PV-120 creates a source-readiness matrix. Dealer proprietary/hedge split is the best next Tier-2 capture because TWSE/TPEx official data already expose it and current payloads can be reused. TPEx attention/disposition has authoritative public sources; current UNKNOWN is an integration gap, not source absence.
- PV-121 separates raw RVOL, market/sector residual RVOL and origin context. They answer abnormality, specificity and mechanism respectively; they must not be stacked as duplicate additive points.
- PV-122 freezes the PV-H005 data-capture/test protocol, including buy/sell/net split, source/date/provenance, integrity checks, A~E comparator family, D1/D3/D5/MFE/MAE/false-confirmation and capital-utilization outcomes.
- PV-123 explicitly qualifies PV-111: TPEx disposition data exist officially; production code simply does not yet integrate them.
- PV-124 requires multi-origin evidence sets rather than a forced primary cause.
- PV-125 makes abstention a valid research output when origin evidence conflicts or is weak.
- PV-126 separates dealer gross participation from net directional imbalance. Same net flow can represent radically different gross trading involvement.
- PV-127 defines participant-side share semantics and prohibits interpreting it as unique-trade or causal share.
- PV-128 adds a collider/selection-bias guard: origin research must not use only high-RVOL observations as the primary population.
- PV-129 freezes the descriptive -> predictive -> causal hierarchy. Most PV origin research remains descriptive/incremental-predictive, not causal.
- PV-130 ranks Tier-2 origin data by expected information gain versus engineering cost. Priority order starts with dealer proprietary/hedge split, TPEx disposition parity, daily transaction-count decomposition, TWSE actual SBL context, and daily market/sector residual RVOL.
- PV_SHADOW_V0_1 remains frozen during DATA_QA. All origin work remains Tier-2/Observer.
- Formal Core remains LOCKED.

## Revised exact next continuation point after PV-130
1. PV-131: audit whether foreign/trust flows also need gross-participation vs net-direction separation, or whether that would mostly duplicate dealer lessons.
2. PV-132: define source-scope compatibility contracts for institutional flow vs official total volume across TWSE/TPEx.
3. PV-133: study whether gross institutional participation improves interpretation of HIGH_EFFORT_LOW_PROGRESS without creating duplicate volume signals.
4. PV-134: define point-in-time institutional data vintage/revision semantics for the 23:35 scan.
5. PV-135: decide whether H005 capture merits a separate Class-A research-only proposal after PV_SHADOW_V0_1 DATA_QA stabilizes.
6. Continue integrating existing research lanes; do not invent new standalone indicators.
7. Formal Core remains LOCKED.

## Progress added — PV-131 through PV-145
- PV-131 concludes foreign/trust gross buy/sell is worth preserving as origin/context data, but explicitly rejects creating separate gross-flow Formal factors before incremental testing.
- PV-132 freezes the source-scope compatibility contract: institutional flow and denominator volume must share audited session/trade scope before side-participation ratios are computed. Daily institutional flow may never use intraday 15m volume as denominator.
- PV-133 defines how gross institutional participation may explain HIGH_EFFORT_LOW_PROGRESS, while requiring controls for total RVOL/current net flow to avoid duplicate information.
- PV-134 freezes institutional point-in-time/finality semantics for the 23:35 scan. TWSE same-day detail is normally published well before scan; source variant including/excluding block trades must remain explicit. Missing/wrong-date data => UNKNOWN and Formal fail-open.
- PV-135 decides H005 capture is design-ready but should not be implemented until PV_SHADOW_V0_1 passes initial DATA_QA stabilization.
- PV-136 establishes that institutional streak length loses magnitude information; direction persistence, normalized magnitude, cumulative pressure and trajectory are separate dimensions.
- PV-137 integrates Taiwan herding evidence and prohibits a universal linear “more consecutive buy days = better” assumption.
- PV-138 freezes reverse-causality language: contemporaneous institutional flow can be informed, price-following, liquidity-providing or common-reaction flow. Same-day association is not causal proof.
- PV-139 freezes institutional-flow normalization hierarchy: flow/daily volume, flow/ADV20, gross side participation and own-history percentiles; raw shares/lots remain provenance only for cross-stock inference.
- PV-140 defines InstitutionFlowState x pvResponseState x pvAcceptanceState as a research interaction, not additive scoring.
- PV-141 identifies a semantic issue: current Worker foreignNet is broad foreignMain+foreignDealer, whereas official reporting separates foreign dealers and official totals avoid double counting. No Formal change; future capture should preserve foreignMainNet, foreignDealerNet and broadForeignNet separately.
- PV-142 prohibits treating foreign/trust/dealer signs as independent “votes”; consensus breadth must prove incremental value after common market/sector/passive-flow controls.
- PV-143 keeps flow trajectory continuous first (slope/current-vs-prior/cumulative) rather than outcome-tuned accelerating/decaying thresholds.
- PV-144 freezes raw-first architecture: persist buy/sell/net/source/scope/date/capturedAt before derived streaks or trajectory states.
- PV-145 keeps institutional-origin capture modular and separate from core PV Shadow during initial DATA_QA.
- PV_SHADOW_V0_1 remains unchanged; Formal Core remains LOCKED.

## Revised exact next continuation point after PV-145
1. PV-146: audit actual historical/current prevalence of non-zero foreignDealer flow and whether broadForeignNet materially differs from foreignMainNet.
2. PV-147: build a source-scope fixture that proves institutional buy/sell totals and official daily volume use compatible scope on sampled TWSE/TPEx dates.
3. PV-148: study institutional consensus breadth vs strongest-single-participant under market/sector residual controls without counting correlated flows as independent votes.
4. PV-149: define research storage/API budget for a future raw institutional-origin recorder.
5. PV-150: freeze the smallest institutional-origin capture schema and Class-A proposal boundary, but defer implementation until core PV DATA_QA stability.
6. No new indicator family unless a genuine unresolved mechanism appears.
7. Formal Core remains LOCKED.

## Progress added — PV-146 through PV-160
- PV-146 audits foreign-dealer prevalence. Current and several modern TWSE/TPEx official samples show foreign-dealer flow often zero, suggesting current broadForeignNet may frequently equal foreignMainNet numerically; the categories remain semantically distinct and future raw capture should preserve both.
- PV-147 builds a source-scope fixture. TWSE institutional flow and daily volume can be matched under explicitly compatible official scope, making trade-side participation research feasible there. TPEx participation-share calculation remains SCOPE_UNVERIFIED pending exact denominator-source audit.
- PV-148 freezes institutional-consensus breadth versus strongest-participant hypotheses; correlated institutional groups are not treated as independent votes.
- PV-149 designs zero-extra-API future institutional-origin storage: short rolling full-market raw cache plus durable selected/monitor/control cohort observations, separate from Formal institution snapshot semantics.
- PV-150 freezes the smallest research-only institutional-origin raw schema and Class-A boundary; implementation remains deferred until PV_SHADOW_V0_1 DATA_QA stabilizes.
- PV-151~160 integrate MICROSTRUCTURE_RESEARCH.md instead of duplicating it. PV describes participation/price-response results; microstructure describes spread/depth/side pressure/replenishment mechanisms.
- HIGH_EFFORT_LOW_PROGRESS is explicitly not called absorption without side-specific pressure and replenishment evidence.
- Existing V8.8.x recorder is event-sparse; missing microstructure rows remain UNKNOWN and cannot be interpreted as healthy liquidity/no absorption.
- Exact as-of PV x microstructure timestamp alignment is frozen; post-event snapshots cannot be attached backward to the decision event.
- Minimal combined PV x microstructure state matrix is frozen. No matrix cell is a BUY/SELL label.
- New durable hypothesis PV-H006 asks whether microstructure resolves HIGH_EFFORT_LOW_PROGRESS ambiguity. Existing coarse recorder may support spread/depth context; true pressure/replenishment needs denser prospective capture.
- Signal quality and execution quality remain separate.
- Taiwan price-tier/tick-size and non-continuous market mechanisms require explicit guards.
- Theory is considered converged enough that evidence/coverage is now the priority.
- PV_SHADOW_V0_1 unchanged; Formal Core LOCKED.

## Revised exact next continuation point after PV-160
1. PV-161: audit exact execution-shadow-v2 fields and event cadence in apply_v8_8_0.py / apply_v8_8_1.py.
2. PV-162: freeze what H006-B can be tested with the current recorder versus what is impossible without denser data.
3. PV-163: define execution-recorder coverage metrics and missingness QA before any outcome analysis.
4. PV-164: freeze cross-lane as-of join keys/tolerances by event type.
5. PV-165: audit sessionVwapProxy semantics and prevent it being treated as reconstructed exchange VWAP.
6. PV-166: define top-five displayed-depth limitations / hidden-liquidity boundary.
7. PV-167: decide whether current sparse recorder has enough coverage to begin coarse H006-B evidence accumulation.
8. Formal Core remains LOCKED.

## Progress added — PV-161 through PV-167
- PV-161 audits exact execution-shadow-v2 capability and event cadence. Fixed snapshots occur at open, first 10m/15m/30m milestones plus Formal notification events; recorder is sparse, not continuous.
- Current coarse fields include spread, aggregate top-five share depth, depth imbalance, market-state/freshness flags, frame10/frame15 context, opening gap and provider average-price proxy. It does not store trade sequence, bid/ask matched-volume totals, transaction count, full per-level depth arrays, replenishment, OFI or queue state.
- A semantic issue is frozen: current lastTradeAt is populated from quote.lastUpdated, which Fugle defines as quote update time; it cannot be used as actual trade time.
- PV-162 limits H006-B to coarse spread/depth/state if coverage passes; H006-C/D remain data-gated.
- PV-163 freezes recorder-coverage QA. Missing row is never no-signal; current LIMIT-500 read endpoint cannot prove full-window completeness.
- PV-164 freezes exact as-of joins. OPEN_BASELINE has no completed 15m PV response; FIRST_15M and Formal signal joins require same completed source bar where possible; post-event nearest-neighbor hindsight is prohibited.
- PV-165 freezes avgPrice/opening-gap semantics. Fugle avgPrice remains provider daily average-price proxy; current openingGapPct uses raw previousClose and is guarded on ex-right/dividend corporate-action dates.
- PV-166 defines top-five displayed depth boundary: current depthImbalance is displayed share-depth imbalance, not OFI/true pressure/hidden liquidity or queue probability. Per-level shape and exact notional depth cannot be reconstructed from current stored payload.
- PV-167 concludes H006-B coarse features are technically present but empirical inference remains DATA_QUALITY_BLOCKED until live D1 coverage is audited.
- PV_SHADOW_V0_1 unchanged; Formal Core LOCKED.

## Revised exact next continuation point after PV-167
1. PV-168: audit zero-extra-API Fugle quote fields not currently preserved by execution-shadow-v2.
2. PV-169: verify avgPrice mathematically against official tradeValue/tradeVolume example and freeze scope-aware semantics.
3. PV-170: study cumulative tradeVolumeAtBid/Ask as a coarse trade-pressure proxy and its limitations versus OFI.
4. PV-171: study transaction-count intensity from quote.total.transaction and whether milestone differencing can add information beyond volume.
5. PV-172: define a minimal future execution-shadow-v3 research extension using only already-fetched quote fields, but do not implement during core PV DATA_QA.
6. PV-173: decide whether v3 can materially improve H006-B/C without a new WebSocket collector.
7. Formal Core remains LOCKED.

## Progress added — PV-168 through PV-183
- PV-168 audits zero-extra-API Quote fields omitted from execution-shadow-v2. The already-fetched Fugle Quote exposes referencePrice, cumulative tradeValue/Volume/AtBid/AtAsk/transaction/time, actual lastTrade fields, more limit/session flags and full top-five levels; v3 can preserve these without extra REST calls.
- PV-169 verifies Fugle's official 2330 example: tradeValue/(tradeVolume*1000) matches avgPrice for the documented ordinary-equity example. Type/source-unit guards remain mandatory.
- PV-170 defines cumulative AtBid/AtAsk as a coarse provider trade-pressure proxy only; it is not OFI/aggressor truth/replenishment. Interval deltas are preferred over raw cumulative levels.
- PV-171 defines transaction-count intensity/average-trade-size research from cumulative Quote totals, with order-splitting/algo/retail ambiguity retained.
- PV-172 freezes a minimal execution-shadow-v3 proposal: correct quoteUpdatedAt vs actual lastTradeAt, referencePrice and full guard flags, cumulative totals, true lastTrade fields and raw top-five levels. Design only; not implemented.
- PV-173 concludes v3 can materially improve H006-B and partially H006-C but cannot deliver H006-D replenishment/resiliency without denser collection.
- PV-174 confirms a recorder event-scope defect: batch-level any-notification activates FORMAL_SIGNAL_OBSERVED for all results, with nonmatching symbols able to receive fallback eventKey SIGNAL. Current signal-event rows require independent same-symbol notification verification.
- PV-175 proves daily PV Shadow inherits the shared V7 D1 daily-history cache: pvDailyRvol20 baselineSource is V7_D1_DAILY_HISTORY_SHARES. Since tested history-freshness PR #100 remains Draft/Open/unmerged and no equivalent guard is on main, daily PV evidence needs a separate history-freshness prerequisite.
- PV-176 freezes history freshness as data validity, never alpha.
- PV-177 adds separate PV feature-quality and Formal cohort-eligibility-quality axes. Clean intraday features on a stale-history-selected cohort are not clean evidence for H001~H004.
- PV-178~180 freeze interval differencing, monotonic cumulative-counter guards and explicit unclassified trade volume.
- PV-181 keeps trade-pressure x displayed-depth interactions descriptive; sparse snapshots cannot confirm absorption.
- PV-182 notes raw top-five levels enable level-shape/microprice-style snapshot descriptors but still not queue dynamics.
- PV-183 defers v3 implementation until core PV Shadow QA and Formal history-freshness quality are stable.
- Production status audit: PR #100 remains OPEN + DRAFT + merged=false; main contains no equivalent v8.10.1 freshness guard found in repo search. No merge/deploy was performed here.
- PV_SHADOW_V0_1 and Formal Core remain unchanged.

## Revised exact next continuation point after PV-183
1. PV-184: define cohort-quality provenance fields and clean/guarded analysis cohorts for H001~H006.
2. PV-185: define how historical outcomes should be quarantined if cohort freshness is later found invalid, without mutating immutable feature snapshots.
3. PV-186: study selection-conditioning bias from Formal chosen/monitored cohort and define control/near-miss cohort requirements.
4. PV-187: define matched-date/control weighting without pretending stock rows on one day are independent.
5. PV-188: define how future history-freshness validation should feed research metadata without becoming a strategy feature.
6. PV-189: audit whether signal-event recorder scope defect can bias Execution Alpha BUY-trigger statistics.
7. PV-190: evidence-convergence checkpoint and next highest-value data action.
8. Formal Core remains LOCKED.

## Progress added — PV-184 through PV-190
- PV-184 freezes cohort-quality provenance. PV primary inference needs both valid feature data and verified Formal cohort input-history quality; monitored observations retain original selectionScanDate/plan lineage rather than replacing it with observation date.
- PV-185 requires later data-quality discoveries to quarantine rows through a separate quality overlay; immutable snapshots/outcomes are not rewritten to hide past production defects.
- PV-186 reuses the existing prospective research cohorts SELECTED / QUALIFIED_NOT_SELECTED / NEAR_MISS / REJECTED_AFTER_BASE / BROAD_CONTROL. Selected/monitored PV evidence answers questions inside the Formal funnel and cannot automatically generalize to the whole market. Historical intraday Shadow for unmonitored controls is prohibited.
- PV-187 freezes date-level primary inference: same-date stocks are correlated, so compute within-date contrasts then aggregate across independent dates; equal-date weighting is primary and date concentration/leave-one-date-out stability must be reported.
- PV-188 integrates later Corporate Action evidence and corrects the freshness direction. Market-session-only freshness is insufficient because verified symbol-specific suspensions create legitimate no-bar exchange-open sessions. Safe contract: EXPECTED_SYMBOL_SESSIONS = OFFICIAL_EXCHANGE_SESSIONS - VERIFIED_SYMBOL_SUSPENSION_SESSIONS; unknown suspension provenance fails closed.
- PR #100 remains OPEN/DRAFT/unmerged and must not be promoted as-is. Its stale-cache rejection is useful, but the current market-session-only implementation can misclassify legitimate suspension gaps. The Corporate Action research line has independently reached and tested this conclusion.
- PV-189 separates two evidence channels: current Execution Alpha buyTriggeredPlans comes from v8 trade-journal plans/signals, not execution-recorder FORMAL_SIGNAL_OBSERVED rows. Thus the recorder batch-scope defect blocks signal-microstructure attribution but does not itself invalidate current Execution Alpha trigger counts.
- PV-190 declares theory mature enough that data integrity/provenance now outrank new factor invention. Priority order: symbol-session-aware history quality -> PV Shadow DATA_QA -> execution-recorder authoritative coverage -> only later v3 and H005.
- No merge/deploy performed. PV_SHADOW_V0_1 unchanged; Formal Core LOCKED.

## Revised exact next continuation point after PV-190
1. PV-191: audit the Corporate Action symbol-session prototype contract specifically for PV daily-history consumers and identify what metadata PV needs rather than duplicating the CA engine.
2. PV-192: define a minimal research quality-overlay schema joining cohort rows, PV snapshots, execution rows and history/suspension provenance.
3. PV-193: define date-level exclusion/quarantine rules so one corrupted selected symbol does not automatically discard an otherwise valid entire date unless the date-level denominator is compromised.
4. PV-194: define prospective PV DATA_QA acceptance receipts independent of alpha/outcomes.
5. PV-195: define readiness criteria for first H001/H002 descriptive comparison once clean dates accumulate.
6. Keep new factor invention paused; prioritize evidence completeness and point-in-time provenance.
7. Formal Core remains LOCKED.

## Progress added — PV-191 through PV-200
- PV-191 makes Corporate Action/Symbol-Session the single owner of history-quality semantics. PV consumes versioned usable/status/reason/latestPriorDate/expectedPriorDate and volume-transform receipts rather than building another event/calendar engine.
- PV-192 freezes an append-only research quality-overlay schema so later-discovered stale history/source/event defects quarantine evidence without rewriting immutable snapshots.
- PV-193 separates row feature validity from pool-date selection integrity. Because 3+3 quota/ranking can propagate one bad candidate into displaced candidates, a corrupted candidate may invalidate the selected/qualified set for that pool-date even if other rows are individually clean.
- PV-194 defines outcome-blind PV DATA_QA receipts separately for intraday, daily and cohort provenance. QA pass cannot depend on return/win-rate.
- PV-195 freezes earliest H001/H002 evidence gate: existing PV-024 sample/date floors + DATA_QA_PASS + clean cohort provenance + no Formal-isolation/mutation failure; current primary inference state is WAITING_CLEAN_COHORT_PROVENANCE.
- PV-196 separates history freshness from corporate-action volume comparability. UNIT_SCALE, SUPPLY_CHANGE and UNKNOWN volume semantics need distinct treatment; factual raw share volume is not the same as economically comparable turnover intensity.
- PV-197 freezes that a clean control group cannot repair a misclassified/stale selected set; such dates can be retained as production-defect postmortems, not intended-Formal alpha evidence.
- PV-198 prohibits retroactively manufacturing prospective intraday Shadow controls from historical OHLCV. Future intraday controls must be captured prospectively under a deterministic design.
- PV-199 freezes point-in-time selection-quality receipts with later corrections handled by append-only annotations.
- PV-200 closes PV Phase-II theory: core mechanisms, origin/context layers, microstructure interaction, anti-bias and quality governance are sufficiently specified. The next learning value is evidence/falsification, not new factor invention.
- Cross-lane correction: PR #100 remains Open/Draft/unmerged and its market-session-only freshness must NOT be promoted as-is. Corporate Action research has tested the prerequisite symbol-session contract: expected sessions = official exchange sessions minus VERIFIED symbol-specific suspension sessions; unknown provenance fails closed.
- No code merge/deploy or Formal change occurred in this PV research sequence.

## Exact next continuation after PV-200
1. Evidence lane PVE-001: build/read an outcome-blind PV DATA_QA receipt from actual prospective Shadow rows when authoritative runtime access is available.
2. PVE-002: quantify clean selection-cohort provenance coverage by scan date/pool using existing shadow-candidate archive plus symbol-session evidence.
3. PVE-003: audit execution recorder exact-date coverage and verified FORMAL_SIGNAL_OBSERVED mappings before H006-B.
4. PVE-004: once clean floors pass, run only frozen H001/H002 A->B->C->D comparison; no threshold tuning.
5. PVE-005: preserve failed/null findings in hypothesis ledger.
6. Continue theory only if empirical residuals expose a concrete unexplained mechanism.
7. Formal Core remains LOCKED.

## Evidence progress — PVE-001 through PVE-003
- PVE-001 used actual GitHub Actions/runtime artifacts rather than source inference.
- PV Shadow enable chronology:
  - enable run 36143785159 failed safely on concurrent Worker source hash mismatch and attempted rollback;
  - enable run 36144091642 succeeded with PV_SHADOW_ENABLED=true, non-PV bindings preserved and identical Worker/Formal config/Formal scan fingerprints; formalIsolation=true.
- Read-only QA run 36144193465 confirms PV enabled and Formal isolation fields, but artifact qaPass=false because Cloudflare D1 direct SELECT returned HTTP 403. Workflow job success != QA pass.
- Official Cloudflare D1 /query accepts D1 Read or D1 Write token permission. Best-supported diagnosis is current GitHub workflow token lacks D1 Read scope; no token mutation was attempted.
- As of 2026-09-26 there are zero completed post-enable market sessions: 9/25 and 9/28 are official TWSE holidays and 9/26-27 weekend. Earliest ordinary prospective session is 9/29.
- PVE-001 state = ENABLE_PASS / FORMAL_ISOLATION_PASS / D1_QA_BLOCKED / ZERO_POST_ENABLE_TRADING_DAYS.
- PVE-002 live research-dashboard readback from deploy run 36156803749:
  - Shadow rows 62 across 2 dates;
  - 9/21=31, 9/22=31;
  - BROAD_CONTROL 24, NEAR_MISS 13, REJECTED_AFTER_BASE 24, SELECTED 1;
  - expectedScanDays 3 vs archivedScanDays 2;
  - integrity RESEARCH_DATA_GAP;
  - D1/D3/D5/D10/D20 outcome coverage all zero.
- Given enforcement date 9/21 and the known completed Formal sequence, the missing archive date is 9/23.
- Selection-time symbol-session receipts do not exist for the 9/21-9/22 archive. Their primary PV cohort state is HISTORY_PROVENANCE_UNVERIFIED, not clean/invalid.
- 9/24 staged-recovery Formal result is QUARANTINED_INPUT_DEFECT for rolling-history/PV inference because B-130 proved stale daily-history contamination.
- Therefore verified clean selection-cohort dates for H001-H004 = 0.
- PVE-003 reconfirms execution-recorder exact-date completeness remains unobservable under current LIMIT-500/newest-80 read contract. B-145's exact-date/run-receipt Class-B proposal is frozen but not implemented.
- FORMAL_SIGNAL_OBSERVED also requires same-symbol signal verification due the PV-174 batch-scope defect.
- H006 signal-microstructure remains DATA_QUALITY_BLOCKED.
- PVE-004 is deliberately NOT STARTED because the pre-registered clean-data gates fail.
- No alpha result, threshold tuning, Worker/runtime change, token/secret change, merge or deployment occurred.

## Exact next continuation after PVE-003
1. PVE-004 remains gated; do not run H001/H002 until at least one post-enable trading date produces authoritative PV DATA_QA and clean cohort provenance.
2. PVE-005: freeze null/blocked evidence outcomes in the hypothesis ledger so readiness failures cannot disappear later.
3. PVE-006: design the minimum post-9/29 evidence receipt joining PV snapshot QA + selection cohort provenance + symbol-session quality without adding a new strategy factor.
4. PVE-007: audit whether existing runtime/admin evidence can expose PV D1 QA through a read-only path without changing Cloudflare token permissions; any shared runtime endpoint remains Class-B proposal-first.
5. On the first completed post-enable trading day, rerun the existing read-only QA; do not equate workflow-success with qaPass.
6. Formal Core remains LOCKED.
