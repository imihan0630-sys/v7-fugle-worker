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

## Evidence methodology — PVE-005 through PVE-012
- PVE-005 preserves blocked/null readiness evidence permanently.
- PVE-006 freezes a layered post-enable receipt: runtime isolation, after-market write receipt, intraday write receipt, D1 at-rest audit, cohort provenance. Do not collapse these into one Boolean.
- PVE-007 audits existing admin paths. /api/scan/status can provide useful after-market PV bootstrap/daily write acknowledgements after the first post-enable scan without direct D1 access. /api/cron/status is execution context only. Persistent /api/live is not assumed to contain post-persistence PV recorder metadata.
- A new PV D1 read endpoint remains Class-B proposal-first; none was implemented.
- PVE-008 corrects namespace ambiguity: the 62-row live readback belongs to `trade_research_shadow_candidates` Candidate Shadow Archive, NOT to `v7_pv_shadow_snapshots`. Actual PV Shadow at-rest row count remains UNKNOWN.
- PVE-009 distinguishes runtime WRITE_ACKNOWLEDGED from independent AT_REST_VERIFIED fingerprint/readback.
- PVE-010 freezes readiness levels ENABLED_ONLY -> RUNTIME_RECEIPT -> FEATURE_AT_REST_VERIFIED -> CLEAN_COHORT_VERIFIED -> OUTCOME_MATURE -> DESCRIPTIVE_EVIDENCE_READY.
- PVE-011 freezes valid zero-plan semantics: zero Formal plans can legitimately imply zero PV opportunities; expected-opportunity denominator must be explicit.
- PVE-012 allows prospective PV feature/data-quality collection to continue while H001-H004 alpha interpretation remains gated by cohort provenance.
- No new PV factor, no Formal change, no runtime/API change, no secret/permission change.

## Revised continuation after PVE-012
1. Before 9/29 no additional true post-enable market sample can exist; do not manufacture one.
2. On the first post-enable completed trading date, inspect /api/scan/status receipt first; classify ZERO_FORMAL_PLANS_VALID vs PV_OPPORTUNITIES_EXPECTED.
3. If opportunities exist, require runtime receipt with no mutation conflicts and successful baseline bootstrap.
4. Direct D1 at-rest QA remains separately blocked until D1 Read authorization exists or an owner-approved isolated read path is implemented.
5. H001/H002 remain unrun until CLEAN_COHORT_VERIFIED + sample floors.
6. Continue learning only through source/quality/falsification questions that can be answered before new market data arrive.
7. Formal Core remains LOCKED.

## Evidence progress — PVE-013 through PVE-028
- PVE-013 freezes /api/scan/status as an after-market runtime receipt only: bootstrap.requested/results and daily.stored/details can prove the write path acknowledged work, not independent D1 at-rest persistence.
- PVE-014 proves intraday PV receipt is not persisted in LAST_MONITOR_KEY: the KV snapshot is written before execution/PV recorders run. /api/live and /api/signals therefore cannot be used as after-the-fact intraday PV write receipts.
- PVE-015: generic Cron success is not PV recorder success; it lacks PV stored/conflict/fingerprint detail.
- PVE-016 freezes the observability ladder: ENABLED_ONLY -> RUNTIME_RECEIPT -> FEATURE_AT_REST_VERIFIED -> CLEAN_COHORT_VERIFIED -> OUTCOME_MATURE -> DESCRIPTIVE_EVIDENCE_READY. No level may be skipped by inference.
- PVE-017 corrects the first-session lineage: 2026-09-29 intraday features inherit plans from the known-bad 2026-09-24 stale-history selection, so they are DATA_QA-only for primary H001~H004 inference.
- PVE-018: earliest potentially clean cohort is the 2026-09-29 after-market selection for a later session, still pending independent symbol-session/pool provenance.
- PVE-019: D1 HTTP 403 means AT_REST_QA_UNAUTHORIZED, not zero rows.
- PVE-020 freezes the first post-enable trading-day evidence decision tree and zero-plan semantics.
- PVE-021 identifies expected cold-start: historical same-slot baseline bootstrap only occurs after an after-market scan, so 9/29 intraday should naturally be DATA_INSUFFICIENT rather than fabricated neutral values.
- PVE-022: 2026-09-30 is only the earliest possible baseline-ready intraday date if 9/29 after-market bootstrap succeeds; baseline-ready still does not imply clean cohort.
- PVE-023 confirms pvDailyRvol20 continuity is not validated by v0.1: the function only finds current row plus last 20 available rows, so stale recent-session gaps can still yield a numeric daily RVOL and non-INVALID guard.
- PVE-024 finds a research-only Guard bug: Formal liquidity thresholds are thousand>=300 lots / general>=1000 lots, while pvIlliquidityWarning reverses them; Formal liquidityException is a descriptive string but PV checks ===true. Formal is unaffected; ILLIQUIDITY_WARNING is not trusted research truth.
- PVE-025 finds several Guard interfaces without verified production upstream plumbing: corporateActionResetAt, pvGapDominated, marketStructure; viStateUnknownConfounder is hardcoded false.
- PVE-026 confirms price-censor logic uses quote.previousClose rather than exchange-consistent reference price, so ex-right/dividend/corporate-action sessions require independent guard/overlay.
- PVE-027 makes Guard-label integrity a separate QA axis from snapshot/baseline/cohort/at-rest/outcome quality.
- PVE-028 freezes first-window priorities around recorder falsification/data quality, not win rate or threshold promotion.
- No runtime/Formal/token/secret change was made.

## Revised exact continuation after PVE-028
1. PVE-029: audit historical 15m true-range baseline semantics, especially previous-session close handling for 09:00.
2. PVE-030: audit missing-intermediate-slot effects on trueRange/rangeHistoryCount versus cumulative coverage.
3. PVE-031: audit current-vs-historical response normalization symmetry and identify which fields remain clean if range baseline is guarded.
4. PVE-032: define a minimum label-quality overlay for v0.1 rows without mutating immutable snapshots.
5. PVE-033: freeze which raw fields can enter H001/H002 even if Guard/response labels are quarantined.
6. Keep H001/H002 outcome inference unrun until clean cohort + evidence floors.
7. Formal Core remains LOCKED.

## Evidence progress — PVE-029 through PVE-061
- PVE-029 finds a historical 09:00 range-anchor asymmetry: historical sessions carry priorClose from the v0.1 last observable 13:00 bar, while live 09:00 uses quote.previousClose. This affects range-normalized response, not slot volume.
- PVE-030: missing intermediate historical slots can make later trueRange span more than one 15m interval; cumulative validity catches the gap but rangeHistoryCount does not.
- PVE-031~033 separate slot-volume, cumulative-volume and range/response quality. H001/H002 can be field-scoped independently from H003 Guard/response defects.
- PVE-034 audits H001 comparator: normal Formal frame15 and PV use the same fetched completed 15m source/unit, but at-rest snapshot lacks explicit formalFrame15LatestTime provenance.
- PVE-035: H001 primary comparison is common-support only. Formal previous-5 ratio begins at 10:15; earlier RVOL availability is a separate coverage study.
- PVE-036: on missing-slot sessions Formal local ratio can remain numeric using previous available bars while PV current-session coverage becomes INVALID. Such rows are not clean H001 common support.
- PVE-037/038 identify a snapshot idempotency defect: semantic fingerprint includes volatile sourceFetchedAt, so legitimate intraday/daily retries can be reported as mutationConflict.
- PVE-039 confirms T16/T17 only clone a fixed object and do not test sourceFetchedAt-changing retries.
- PVE-040 freezes semantic-fingerprint versus acquisition-provenance separation for a future version; historical rows are not rewritten.
- PVE-041 confirms outcome fingerprint excludes completed_at and is structurally cleaner from this timestamp defect.
- PVE-042 requires mutation conflicts to be classified as semantic mutation, volatile-provenance-only or unknown before kill-switch interpretation.
- PVE-043 qualifies D1 valid_sessions: it is sessions.length / cached session count, not proof every slot/prefix/range has 20 valid samples.
- PVE-044 bootstrap skip uses coarse session count, so skipped+>=20 means CACHE_POPULATED, not feature-ready.
- PVE-045/046 preserve feature-specific baseline semantics: a partial session can validly contribute exact-slot volume while cumulative/range have stricter requirements.
- PVE-047 freezes a future slot-coverage receipt: per-slot volume/prefix/range counts are needed; one validSessions number is insufficient.
- PVE-048 explicitly supersedes the PVE-013 interpretation that validSessions>=20 alone proves feature readiness.
- PVE-049 finds PV Acceptance is an approximation of Formal, not exact replay, because Formal local volume ratio is rounded to 2 decimals while PV uses unrounded ratio.
- PVE-050 finds PV A lower-shadow acceptance branch lacks Formal's bullish requirement.
- PVE-051 distinguishes 13:00 same-session censoring from absence of Formal confirmation; initial acceptance can be overwritten to EXPIRED_AMBIGUOUS because no follow-through window remains.
- PVE-052: stopFirst cannot be known when stop and target are both touched inside the same OHLC bar; this is path-order ambiguous.
- PVE-053: B1/B2/B4 are exact horizons only under verified slot continuity; otherwise next-available-bar slicing can stretch clock time.
- PVE-054: daily outcomes use market sessions rather than symbol-session-aware horizons; legitimate symbol suspensions censor outcome rather than imply zero/failure.
- PVE-055 establishes hypothesis-specific readiness: H003/H004 have higher gates than H001/H002.
- PVE-056~061 qualify timestamp semantics. Intraday observedAt and acceptance enteredAt are bar-start identity times; daily observedAt=13:30 is a session anchor, not 23:35 decision-known time. featureKnownAt must be derived from sourceFetchedAt with barEnd checks. sourceFetchedAt is useful for PIT eligibility but should not define semantic fingerprint identity.
- No runtime code, Formal rule, threshold, capital, push, token or permission changed.

## Revised exact continuation after PVE-061
1. PVE-062: audit daily outcome finalizer against stale-history/symbol-session provenance and determine which outcome fields are factual versus censored.
2. PVE-063: audit persistence-state continuity across overnight/session boundaries and missing observations.
3. PVE-064: audit eventKey semantics when acceptance and persistence events coexist; prevent pseudo-independent event inflation.
4. PVE-065: define exact first-session QA receipt expected on 9/29 and baseline-ready receipt on 9/30, including known defect overlays.
5. PVE-066: define v0.1 evidence salvage matrix—what can remain usable without code changes versus what requires a new research schema.
6. Continue evidence/falsification; no threshold tuning or Formal promotion.
7. Formal Core remains LOCKED.

## Evidence lane — PVE-001 through PVE-006
- New canonical prospective evidence file: PRICE_VOLUME_EVIDENCE.md.
- PVE-001 verifies actual runtime activation: GitHub Actions enable run 36144091642 succeeded; PV_SHADOW_ENABLED=true; binding plain_text; Formal isolation true; no rollback.
- Latest read-only QA workflow run 36144193465 confirms deployed runtime 8.11.0-pv-shadow-v0.1-log-only, decisionImpact=false, formalCoreImpact=false, active hook after Formal and zero extra ordinary live candle calls.
- The QA workflow itself returns qaPass=false because direct D1 SELECT is not authorized (Cloudflare 403). This is a row-level QA observability block, not evidence that PV runtime rows are absent.
- Re-running the existing read-only job after 23:35 proved the 2026-09-25 scan was correctly SKIPPED because 2026-09-25 is a configured market holiday; 2026-09-28 is also holiday. The system made zero Fugle calls and did not fabricate a scan/PV baseline.
- Because bootstrap only runs after a successful Formal after-market scan, 2026-09-29 intraday is expected to be DATA_INSUFFICIENT for same-slot baseline before the 23:35 bootstrap. 2026-09-30 is the first natural candidate date for clean >=20-session intraday baseline evidence.
- Two QA diagnostic blind spots were identified without changing code: cron audit drops result.reason for SKIPPED runs, and the QA script's afterMarketWindow assertion is not trading-calendar aware and could false-fail on a holiday after 23:45.
- Overall PVE-001 readiness = DATA_QA_PARTIAL, not DATA_QA_PASS and not alpha evidence.
- Formal Core and PV_SHADOW_V0_1 unchanged.

## Evidence progress — PVE-062 through PVE-075
- PVE-062 confirms exact-date daily outcome lookup is conservative: missing expected dates return null rather than jumping to a later cached row. Stale history mainly censors outcome coverage.
- PVE-063 freezes NEXT_SESSION and D1 as the same one-next-session numeric return/path endpoint for statistical purposes.
- PVE-064 confirms rangeAtr is null in v0.1; no ATR-normalized outcome claim is allowed without a separate frozen computation.
- PVE-065 identifies persistence gap provenance as missing: intraday persistence can cross sessions/holidays/outages without distinguishing expected versus missing observation gaps.
- PVE-066 requires domain-specific event IDs. Top-level eventKey is acceptance.eventKey || persistence.eventKey and can split/conflate mechanisms; detailed acceptance/persistence IDs remain recoverable in context/features.
- PVE-067 freezes first-two-session QA expectations: 9/29 cold-start/data-QA and 9/29 after-market cache/write receipt; 9/30 earliest possible baseline-ready day if bootstrap succeeds, still subject to cohort provenance.
- PVE-068 freezes a field-level salvage matrix: raw OHLCV/slot RVOL/cumulative/local ratio may remain usable with clean provenance while range/Guard/acceptance/daily layers have stricter overlays.
- PVE-069 replaces the vague question “does PV work?” with a narrow falsification sequence: slot RVOL -> cumulative pace -> response -> acceptance/guards -> risk outcomes.
- PVE-070 states outcome existence is not feature eligibility; factual future paths can be stored for quarantined rows but primary analysis must join quality overlays.
- PVE-071 separates rawSnapshotCount, dataQaEligibleObservationCount and hypothesisCleanEventCount so cold-start/invalid rows cannot inflate evidence milestones.
- PVE-072 starts the 30-distinct-date maturity clock on clean evidence dates, not the enable date.
- PVE-073 uses hypothesis-specific event denominators instead of the top-level union eventKey.
- PVE-074 requires coverage/common-support tables before H001 performance comparisons.
- PVE-075 freezes the boundary that research-side defects never justify modifying Formal A/B/ranking/BUY/capital/push without separate evidence and owner-approved governance.
- No runtime code, Formal logic, permissions, token scope or deployment was changed.

## Revised exact continuation after PVE-075
1. PVE-076: audit whether the first 9/29 after-market runtime receipt can distinguish daily snapshot duplicate vs volatile-provenance mutation conflict and define exact interpretation.
2. PVE-077: define a synthetic retry fixture contract that a future research-only schema must pass before version promotion.
3. PVE-078: audit baseline session rolling/overwrite semantics when historical bootstrap and prospective 13:00 roll both contain the same market date.
4. PVE-079: audit corporate-action/reset metadata migration semantics across baseline schema versions.
5. PVE-080: freeze a v0.1 defect registry with severity, affected hypotheses and salvage policy.
6. Keep outcome inference blocked until clean evidence prerequisites mature.
7. Formal Core remains LOCKED.

## Evidence progress — PVE-062 through PVE-066
- PVE-062 audits daily outcome finalization. directionReturn/MFE/MAE/NEXT_OPEN are factual path fields only under verified symbol-session continuity and price comparability. Legitimate suspension/missing symbol bars censor the horizon; they are not zero/failure. AFTER_MARKET acceptanceResult is a frozen-plan threshold-path label, not proof of a live Acceptance lifecycle. stopFirst is unusable when stop and target are both touched in the same unresolved OHLC bar.
- PVE-063 confirms persistence continuity is not constrained by same-session adjacency or next expected symbol session. Old intraday/daily persistence states can be resumed after overnight/unobserved gaps. Raw current RVOL is unaffected; pvPersistenceState/event continuity requires an adjacency overlay.
- PVE-064 confirms top-level eventKey mixes two event families because it prefers acceptance.eventKey over persistence.eventKey. Existing nested keys are separately stored and can be salvaged analytically; top-level eventKey must not be the universal independence unit.
- PVE-065 freezes first-session receipts for 9/29 and 9/30 with all known defect overlays. 9/29 is DATA_QA-only because of stale 9/24 cohort lineage and expected cold baseline. 9/30 is only the earliest possible field-ready date if 9/29 bootstrap succeeds; clean cohort provenance and at-rest proof remain separate gates.
- PVE-066 freezes the v0.1 salvage matrix: H001 raw Formal local volume ratio vs pvSlotRvol20 and H002 cumulative pace are potentially salvageable under feature-specific coverage/common-support rules; H003/H004 state/Guard/outcome labels are much more heavily guarded. No defect here authorizes a Formal change.
- Formal Core and runtime code unchanged.

## Revised exact continuation after PVE-066
1. PVE-067: freeze the minimal clean H001 row contract.
2. PVE-068: freeze the minimal clean H002 row contract and nested sample relationship H002 subset of H001 where appropriate.
3. PVE-069: define event/date de-duplication using separate persistence/acceptance keys without top-level eventKey.
4. PVE-070: define field-specific outcome eligibility and censoring codes rather than one row-level outcome-valid Boolean.
5. PVE-071: define sample accounting receipts so excluded/unknown rows never disappear silently.
6. PVE-072: define first descriptive H001/H002 report shape before outcome inspection.
7. Continue evidence/falsification only; no threshold tuning or Formal promotion.

## Evidence progress — PVE-067 through PVE-091
- PVE-067 freezes the clean H001 row contract: completed/PIT-valid INTRADAY_15M v0.1 rows, finite Formal local prev5 ratio and pvSlotRvol20, slotHistoryCount>=20, common session support, field-level baseline freshness and clean cohort provenance. v0.1 comparator identity is COMMON_SOURCE_CODE_INVARIANT, not explicit same-bar-ID proof.
- PVE-068 makes H002 a nested subset of H001 with finite pvCumvolPace20, cumulativeHistoryCount>=20 and complete current/historical slot prefixes.
- PVE-069 separates independence/event accounting: H001/H002 keep the full RVOL distribution and use date-level dependence controls; secondary abnormal-volume events use verified persistence keys/session-local overlays, never the mixed top-level eventKey.
- PVE-070 freezes field-specific outcome quality states. Direction/MFE/MAE, structural failure and stopFirst have separate validity/censoring/ambiguity states; outcomeComplete alone is not enough.
- PVE-071 freezes a full sample-accounting funnel and explicit exclusion receipts; null rows may never disappear silently.
- PVE-072 preregisters the first H001/H002 report before outcomes: QA/coverage first, metric relationship second, pre-frozen A->B->C->D outcome comparison only after maturity, no winner/threshold tuning.
- PVE-073~078 audit outcome-table semantics: AFTER_MARKET and INTRADAY anchors differ; intraday daily MFE/MAE omit same-day remainder; NEXT_SESSION and D1 are numerically duplicate in v0.1; outcomeComplete=1 can mean session-end censoring; missing daily row has multiple possible causes; 45-day finalizer lookback can strand long-censored rows; daily plan and intraday acceptance anchors must be separate cohorts.
- PVE-079~085 audit baseline provenance: snapshot ratios are frozen but exact baseline denominators/vintages are not; baseline cache is mutable, per-session source is coarse, and “session” means the PV observable 09:00~13:00-start window. Crucially, validSessions>=20 has no freshness check, so a re-entering symbol can reuse a months-old baseline. baselineAsOfDate allows partial stale-baseline quarantine; future baseline content fingerprinting is needed for exact replay.
- PVE-086: bootstrap.ok only means no thrown error; it does not prove >=20 or field-ready coverage.
- PVE-087~091 find a next-day baseline gap: after-market bootstrap for newly selected symbols fetches history only through T-1. If a symbol was not already monitored on selection date T, it has no live-rolled T session, so T+1 baseline can omit the immediately prior trading session. Freshness on T+1 depends on old/new plan overlap and baselineAsOfDate; 9/30 is only a row-specific candidate, not uniformly baseline-ready.
- No code/runtime/Formal change made.

## Revised exact continuation after PVE-091
1. PVE-092: determine whether existing admin live/scan readbacks can reconstruct old-monitor vs new-plan overlap without D1.
2. PVE-093: define row-level FIRST_DAY_BASELINE_LINEAGE classes using plan overlap + baselineAsOfDate.
3. PVE-094: audit baseline refresh behavior when a cached symbol re-enters after a long monitoring gap.
4. PVE-095: define baseline freshness age metrics in trading/symbol sessions, not calendar days.
5. PVE-096: freeze first post-enable QA queries/receipts needed on 9/29 night and 9/30 intraday.
6. Continue evidence/falsification; no production implementation or Formal promotion.

## Evidence progress — PVE-092 through PVE-100
- PVE-092 confirms old intraday monitor set vs new after-market plan overlap can be reconstructed read-only from /api/live and /api/scan/status, provided date/timestamp freshness is checked.
- PVE-093 freezes first-day baseline lineage classes: CONTINUING_MONITORED_PLAN / NEW_AFTER_MARKET_SELECTION / REENTERED_WITH_EXISTING_CACHE / ZERO_PLAN / UNKNOWN_LINEAGE.
- PVE-094 finds bootstrap skip receipts omit lastMarketDate, so the very case most exposed to old-cache staleness is freshness-UNKNOWN from scan receipt alone.
- PVE-095 defines baseline freshness age in expected symbol sessions, not calendar days; verified suspension is excluded while unexplained slot gaps remain quality failures.
- PVE-096 preregisters the exact 9/29 night read-only receipt: cron + live old-symbol set + scan new-plan set + pvShadow bootstrap/daily + overlap-derived lineage + Formal safety.
- PVE-097 notes a non-skipped bootstrap result can directly reveal selection-day omission through lastMarketDate without D1 access.
- PVE-098 separates daily feature validity from frozen Formal anchor validity; a daily PV feature can be invalid while a formalClose-anchored market path remains separately usable.
- PVE-099 freezes pre-first-session evidence state: runtime activation proven, but at-rest rows and post-enable live market observations not yet observed; all current findings are QA/falsification.
- PVE-100 closes Evidence Phase I before the first post-enable trading-day sample. No thresholds, cohorts or outcome families may be changed because later evidence is inconvenient.
- PRICE_VOLUME_EVIDENCE.md now includes a continuity index for concurrently completed PVE-013~061; their detailed canonical record remains in the checkpoints.
- Current evidence cursor: PVE-001 through PVE-100.
- Next information hinge is actual 2026-09-29 / 2026-09-30 prospective runtime evidence.
- Formal Core remains LOCKED; no production code/runtime change made.


## Evidence progress — PVE-101 through PVE-127
- Canonical detailed records are in `PRICE_VOLUME_EVIDENCE.md`.
- PVE-101~108 deepen baseline semantics: observable-slot support, partial-session/container-count limits, corporate-action reset early-return risk and a multi-axis baseline QA contract.
- PVE-109~114 prove the current sanitized QA artifact is strong for safety/runtime receipt but insufficient for plan-overlap/cohort-lineage reconstruction and skipped-cache freshness.
- PVE-115~120 separate full-table, windowed-at-rest and runtime evidence; snapshot/outcome fingerprint checks and guard distributions are windowed at scale, current D1 baseline assertions remain insufficient for freshness, and current-state Formal fingerprints are not fresh OFF-vs-ON live experiments.
- PVE-121: `baseline.readyCount` is only a coarse `validSessions>=20` container count and must not be read as field readiness.
- PVE-122: `mutationConflictAtRest=0` is hard-coded when D1 is readable; it is not a historical mutation-conflict measurement.
- PVE-123: report `outcomeRows` is the latest-2000 fetched window size, not a full-table persisted-outcome count.
- PVE-124: `qaPass` does not enumerate hard assertion failures because many assertions can abort before the JSON report is written.
- PVE-125: when `pvScan` is absent, decisionImpact/formalCoreImpact default to false; receipt presence must gate interpretation.
- PVE-126: initial audit flagged a possible logical-OR zero-collapse risk; PVE-134 later corrects current-runtime interpretation because the field is an object and all-zero counters are preserved.
- PVE-127: one broad D1 catch conflates authorization denial with schema/query/assertion failures; current label alone is not an authoritative failure taxonomy.
- These are research/observability semantics only. No Worker/runtime/Formal/token/permission/deployment change was made.
- Current Price-Volume evidence cursor: PVE-001 through PVE-127.

## Revised exact continuation after PVE-127
1. PVE-128: freeze non-mutating D1 failure classification from existing error/status evidence.
2. PVE-129: design an always-emitted sanitized failure envelope while preserving workflow hard-fail semantics.
3. PVE-130: freeze exact report-field naming/scope metadata corrections.
4. PVE-131: audit existing read-only surfaces for historical intraday mutation-conflict telemetry.
5. PVE-132: freeze the pre-9/29 interpretation matrix for zero/null/UNKNOWN/hard failure.
6. Keep H001~H004 outcome inference blocked until prospective clean evidence prerequisites mature.
7. Formal Core remains LOCKED.


## Evidence progress — PVE-128 through PVE-133
- PVE-128 verifies the current run 36144193465 D1 failure specifically as HTTP 403 AUTHZ_DENIED from the captured error body; PVE-127's broader catch-conflation warning remains valid for future runs.
- PVE-129 freezes an always-emitted sanitized failure-envelope design that preserves hard workflow failure semantics instead of suppressing assertions.
- PVE-130 freezes evidence-safe field naming/scope metadata so coarse counts, latest-N windows and receipt-dependent flags cannot masquerade as stronger evidence.
- PVE-131 concludes historical intraday PV mutation-conflict telemetry is not reconstructable from the current read-only admin surfaces; no zero conflict rate may be inferred.
- PVE-132 proves a blocked D1 path can serialize baseline rowCount/readyCount as 0 and other arrays/maps as empty even though they were not observed. D1-dependent zero/empty values require an acquisition-available gate.
- PVE-133 freezes the pre-first-session evidence-state matrix: MEASURED_ZERO / NOT_OBSERVED / ABSENT_RECEIPT / UNKNOWN_SEMANTICS / BLOCKED / HARD_CHECK_FAILURE / VERIFIED_PASS / VERIFIED_FAIL.
- Current Price-Volume evidence cursor: PVE-001 through PVE-133.
- Formal Core, runtime code, token scope, permissions and deployment remain unchanged.

## Revised exact continuation after PVE-133
1. PVE-134 audit workflow conclusion versus qaPass state semantics.
2. PVE-135 compare the two preserved artifacts/rerun lineage for run 36144193465 where possible.
3. PVE-136 define deterministic safety/runtime artifact-diff receipts.
4. PVE-137 separate code drift, environment drift and market/admin-state drift.
5. PVE-138 freeze safe cross-rerun comparison fields before 9/29.
6. Continue falsification/data-quality research only; no alpha outcome inference.


## Evidence progress — PVE-134 through PVE-139
- PVE-134 corrects PVE-126: the current `live.fugleCallsThisRun` is an object, so an all-zero call object remains truthy and is preserved. The logical-OR risk is only type-dependent if that field ever becomes numeric zero.
- PVE-135 directly observes workflow/job success while report `qaPass=false`; operational workflow success and research QA state are independent axes.
- PVE-136 compares two artifacts from the same run 36144193465/head SHA and finds stable Formal config/live fingerprints but different active Worker content hashes, scan fingerprints and cron receipts.
- PVE-137 freezes that runtime version equality is not executable-code identity; activeContentSha256 must be pinned.
- PVE-138 freezes whole-scan fingerprint drift as semantically ambiguous because the hash mixes timing and semantic fields and the artifact lacks decomposable sub-hashes.
- PVE-139 freezes a safe cross-rerun comparison matrix separating provenance, code identity, settings, Formal state and expected time-dependent receipts.
- Current Price-Volume evidence cursor: PVE-001 through PVE-139.
- PVE-126's current-runtime zero-collapse claim is superseded by PVE-134.
- No Worker/runtime/Formal/token/permission/deployment change was made by this research.

## Revised exact continuation after PVE-139
1. PVE-140 audit active Worker source drift against authorized deployment/commit lineage.
2. PVE-141 attempt bounded reconstruction of the observed scan-fingerprint drift; preserve UNKNOWN if component evidence is unavailable.
3. PVE-142 freeze the minimum provenance tuple for every post-enable observation/report.
4. PVE-143 separate workflow-source commit, deployed Worker source and research-document commit lineage.
5. PVE-144 freeze the no-hindsight provenance receipt for 9/29 and 9/30.
6. Formal Core remains LOCKED.


## Evidence progress — PVE-140 through PVE-144
- PVE-140 corrects the prior active-content interpretation. The QA artifacts hash raw `content/v2` response text, while commit 262dc359 explicitly added `extractWorkerSource()` to the enable workflow to remove multipart/binding-metadata representation before hashing source. QA did not inherit that extractor.
- PVE-141 therefore downgrades the two differing QA `activeContentSha256` values to RAW_RESPONSE_HASH_DRIFT. They do not prove Worker code drift. The enable workflow's before/after extracted-source equality remains valid within its method.
- PVE-142 freezes Cloudflare Worker version id/number + `resources.script.etag` as the preferred executable identity tuple; runtime VERSION remains a label and raw content/v2 hash is non-authoritative unless canonicalized.
- PVE-143 freezes three independent lineages: research-document commit, QA workflow/artifact head, and external deployed Worker version/etag/runtime state.
- PVE-144 preregisters the 9/29-9/30 no-hindsight provenance receipt before any outcome inspection.
- PVE-137/PVE-139 statements treating QA raw activeContentSha256 as exact code identity are superseded by PVE-140~142.
- Current Price-Volume evidence cursor: PVE-001 through PVE-144.
- Formal Core/runtime/token/permission/deployment remain unchanged.

## Revised exact continuation after PVE-144
1. PVE-145 audit existing read-only access to Worker Versions/etag with no permission expansion.
2. PVE-146 freeze version/etag receipt semantics or VERSION_IDENTITY_UNOBSERVED if blocked.
3. PVE-147 audit extracted-source canonical hash as future QA observability only.
4. PVE-148 decompose scan fingerprints into timing versus semantic components.
5. PVE-149 freeze 9/29 night evaluation order before outcomes.
6. Continue falsification/data-quality research only.


## Evidence progress — PVE-145 through PVE-149
- PVE-145 verifies from current Cloudflare documentation that content/v2 and Worker Version read endpoints share the documented Workers read/write permission class. Because the current token succeeds on content/v2, version/etag access is expected without permission expansion, but remains NOT_EXECUTION_VERIFIED until actually called.
- PVE-146 freezes explicit version/etag read-receipt classes and forbids treating unobserved/blocked identity as equality.
- PVE-147 freezes Worker version id + script etag as primary identity, extracted-source hash as secondary reproducibility evidence, and raw content-response hash as transport diagnostics only.
- PVE-148 freezes componentized Formal scan fingerprints so generatedAt/timing drift cannot masquerade as stock-plan/pipeline/config drift.
- PVE-149 preregisters the first post-enable evaluation order: provenance -> safety -> market/operation -> acquisition -> baseline -> cohort -> feature QA -> outcomes.
- Current Price-Volume evidence cursor: PVE-001 through PVE-149.
- No token, permission, runtime, Worker, Formal, deployment or threshold change was made.

## Revised exact continuation after PVE-149
1. PVE-150 audit the exact 9/24 -> 9/29 after-market -> 9/30 cohort transition across holidays.
2. PVE-151 freeze row-level clean/unclean/unknown cohort labels for that transition.
3. PVE-152 freeze symbol-session freshness inputs needed for cohort rehabilitation.
4. PVE-153 audit 3+3 pool displacement reconstructability.
5. PVE-154 freeze pool-date integrity receipt.
6. Keep all alpha/outcome inference blocked until preregistered gates mature.


## Evidence progress — PVE-150 through PVE-154
- PVE-150 freezes the holiday/plan transition: 9/25 and 9/28 are configured non-trading days, so 9/29 intraday inherits the last saved 9/24 Formal plan; a successful 9/29 after-market scan can first create the plan monitored on 9/30.
- 9/29 intraday is therefore DATA_QA-only under known stale 9/24 selection lineage. 9/30 is only the first potentially clean selection cohort and still has row-level baseline/cohort provenance gates.
- PVE-151 separates lineage labels from final CLEAN/UNCLEAN/UNKNOWN research eligibility.
- PVE-152 freezes the symbol-session rehabilitation inputs and retains fail-closed semantics for unexplained missing sessions.
- PVE-153 finds exact 3+3 historical pool displacement cannot be reconstructed from the current scan receipt because the complete ordered qualified list/rank tuple beyond the cutline is not preserved.
- PVE-154 freezes a future pool-date integrity receipt that can support selected vs displaced controls without changing Formal.
- Current Price-Volume evidence cursor: PVE-001 through PVE-154.
- Formal Core/runtime/token/permission/deployment remain unchanged.

## Revised exact continuation after PVE-154
1. PVE-155 audit existing Candidate Shadow/archive coverage against the full PVE-154 pool receipt.
2. PVE-156 freeze a minimum additive research-only pool-integrity schema if current evidence is incomplete.
3. PVE-157 freeze unbiased SELECTED vs QUALIFIED_NOT_SELECTED control construction.
4. PVE-158 define date-cluster/dependence handling.
5. PVE-159 freeze minimum clean-date/event reporting before descriptive outcome tables.
6. Continue evidence/falsification only.

## Evidence progress — PVE-155 through PVE-159
- PVE-155 audits the actual Candidate Shadow archive implementation. It is a bounded decision-boundary archive, not a complete pool-integrity receipt: all SELECTED rows are kept, but QUALIFIED_NOT_SELECTED / NEAR_MISS / REJECTED_AFTER_BASE / BROAD_CONTROL are capped at 6 per pool.
- Formal rank order is rewardPerRisk -> priorityScore -> setupQuality -> sectorFlow -> relativeStrength. The existing snapshot cannot exactly reconstruct it because raw rewardPerRisk is reduced to rounded rewardRisk, priorityScore is omitted from buildResearchSnapshot(), and pre-sort ordinal is not persisted.
- cohort_rank is not an absolute per-pool Formal rank. Nevertheless, the first six QNS rows retain within-pool post-cutline order, so bounded cutline salvage is possible; this is weaker than full historical pool integrity.
- The current archive is mutable by scan_date because persistence deletes that date before reinserting/upserting. It is not automatically an immutable first-known selection receipt.
- PVE-156 freezes a future additive Class-A pool-integrity receipt: full qualified list, no top-N truncation, exact comparator inputs, observed pool rank, pre-sort ordinal, cutline, selection/version identity, point-in-time quality overlay and semantic fingerprints. NOT_IMPLEMENTED.
- PVE-157 freezes two pre-outcome controls: ALL_QNS and exact CUTLINE_NEXT. No post-outcome substitution/matching/filtering; an unclean or tie-ambiguous next row makes that boundary contrast unavailable.
- PVE-158 sets scanDate as the primary dependence/cluster unit. Six rows on one day are not six independent market experiments. The first table is descriptive only; no naive row-level significance claims.
- PVE-159 retains the already-existing 20 paired-date threshold as the first DESCRIPTIVE_READY floor, now explicitly requiring 20 CLEAN scan dates on common support. High row count cannot substitute for independent dates.
- The first H001/H002 table remains A Formal -> B + prev5 volume ratio -> C + same-slot RVOL -> D + cumulative pace, with false-confirmation/MFE/MAE/opportunity-retention and no threshold tuning.
- No H001~H006 status changed. Formal Core/runtime/ranking/threshold/capital/push behavior remains unchanged.

## Revised exact continuation after PVE-159
1. Do not expand methodology merely to create more PVE numbers; wait for the preregistered live information hinge unless a contradiction is discovered.
2. 2026-09-29 intraday is DATA_QA-only under inherited 9/24 stale-selection lineage.
3. 2026-09-29 after-market is the first post-enable ordinary selection/bootstrap receipt.
4. 2026-09-30 intraday is the first potentially clean selection cohort, subject to symbol-session, baseline, at-rest and pool-integrity gates.
5. Execute PVE-149 Gate 0->7 in order and keep outcome inspection last.
6. PVE-156 schema remains proposal-only until owner-approved engineering work.
7. Formal Core remains LOCKED.



## Correction — PVE-155 comparator lineage (2026-09-27)

PVE-155's sentence stating Formal rank order as:
`rewardPerRisk -> priorityScore -> setupQuality -> sectorFlow -> relativeStrength`
is stale relative to the deployed deterministic patch chain.

Fresh patch-chain audit confirms:
- base Worker / earlier lineage used an RR-first comparator;
- V7.5.30 changed deployed Formal ordering to:
  1. post-consensus `priorityScore`;
  2. raw `rewardPerRisk`;
  3. `marketConsensusScore`;
  4. `setupQuality`;
  5. `sectorFlow`;
  6. `relativeStrength`;
- V8.13 did NOT change that ordering; it prospectively persisted the exact inputs and labels the comparator:
  `PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`.

Therefore:
- PVE-155's historical observation that the old Shadow archive could not fully reconstruct Formal cutline remains valid in spirit;
- its exact comparator sequence must not be reused for V7.5.30+ QNS/cutline replay;
- all prospective pool-integrity/cutline receipts must persist `rankComparatorVersion` and use the comparator valid for that scan date/version;
- pre-V8.13 snapshots lacking post-consensus priority/consensus provenance remain insufficient for exact deployed comparator replay and must stay UNKNOWN rather than being recomputed from today's logic.

This is a research-document correction only. Formal runtime/order is unchanged.


## PVE-160 — Pre-outcome redundancy/falsification stress test for abnormal-volume features (2026-09-28)

Status: PREREGISTERED_FALSIFICATION / NO_OUTCOME_INSPECTION / FORMAL_CORE_UNCHANGED

### Why this can be done before the 2026-09-29/30 live evidence hinge
PVE-159 correctly blocks any H001-H004 outcome conclusion before prospective clean cohorts exist. That does not block a pre-outcome falsification audit of whether the candidate volume features could merely repackage already-known state variables. This section therefore freezes the competing explanations before outcome inspection.

### Main falsification result
Abnormal volume is not assigned a universal bullish/bearish sign. Prior empirical literature permits both continuation and reversal depending on information asymmetry, speculative trading, liquidity shocks and the component of volume being measured. Therefore a future positive association between raw/high RVOL and return is insufficient by itself to establish incremental price-volume alpha.

### Mandatory competing explanations for H001/H002
For every future clean comparison of formalLocalVolumeRatio, pvSlotRvol20 and pvCumvolPace20, report or condition on pre-outcome controls sufficient to distinguish at least:
1. PRICE_STATE: contemporaneous/lagged return, breakout/pullback state and close-location/response variables already known at featureKnownAt.
2. VOLATILITY_STATE: range/ATR or existing volatility-regime evidence available point-in-time. High volume caused by a volatility shock must not automatically be labelled participation alpha.
3. LIQUIDITY_STATE: average volume/amount and any point-in-time spread/depth evidence actually available. A liquidity shock is a competing mechanism, not proof of informed participation.
4. MARKET_SECTOR_ACTIVITY: market/sector-wide abnormal activity. Stock RVOL that merely mirrors a broad activity surge is not stock-specific incremental evidence.
5. EVENT_CONTEXT when PIT-valid: material-news/corporate-action/event context. Event-driven volume must not be pooled silently with ordinary-session volume.

Missing controls remain UNKNOWN; they are never imputed as neutral/zero merely to retain a row.

### Residual-volume test frozen
The earlier research idea of stock-specific residual RVOL is now elevated from a generic future idea to an explicit falsification requirement before any claim that raw pvSlotRvol20/pvCumvolPace20 has independent informational content.

Primary sequence remains preregistered and unchanged:
A = Formal context
B = A + formalLocalVolumeRatio
C = B + pvSlotRvol20
D = C + pvCumvolPace20

But any apparent C/D improvement must also survive a separately reported contextual/residual check against market/sector activity and the available price/volatility/liquidity controls above. This is a falsification layer, not a new optimized threshold or score.

### Interpretation rules frozen before outcomes
- HIGH_VOLUME + STRONG_PRICE_RESPONSE may be continuation, information incorporation or temporary price pressure; outcome evidence decides, not the label.
- HIGH_VOLUME + WEAK/REJECTED_PRICE_RESPONSE is a distinct state and must not be averaged into generic high-volume evidence.
- LOW_VOLUME is not automatically healthy dry-up; it may represent low attention, weak demand or illiquidity.
- pvCumvolPace20 is only incremental if it improves evidence beyond same-slot RVOL/local volume ratio on common support; otherwise it is REDUNDANT.
- If residual/context-adjusted volume loses the apparent effect, raw abnormal volume is classified CONTEXT_PROXY / REJECTED_OR_REDUNDANT rather than promoted.
- If effect direction flips materially by regime/event/liquidity state, report REGIME_OR_CONTEXT_DEPENDENT; do not tune a global threshold post hoc.

### Evidence basis / counterevidence incorporated
External empirical evidence reviewed on 2026-09-28 includes findings consistent with both high-volume continuation and high/speculative-volume reversal, plus evidence that volume predictability can depend on components orthogonal to volatility, liquidity or order flow. These sources are methodological priors only; they are not Taiwan-stock validation and do not upgrade D02 maturity by themselves.

### System implication
This strengthens the existing observer-only design. No new Formal factor, threshold, score, ranking, entry rule or veto is justified. The prospective 9/29-9/30 gate remains unchanged; first clean evidence must still pass PVE-149 and PVE-159.

Current Price-Volume evidence cursor: PVE-001 through PVE-160.
Formal Core remains LOCKED.

## Revised exact continuation after PVE-160
1. Preserve the live hinge: 2026-09-29 intraday DATA_QA-only; 9/29 after-market bootstrap; 9/30 first potentially clean selection cohort.
2. At first eligible clean rows, execute PVE-149 Gate 0->7 before outcome inspection.
3. For H001/H002, preserve A/B/C/D common-support comparison, then run the PVE-160 contextual/residual falsification layer without threshold tuning.
4. Separate high-volume/strong-response from high-volume/weak-response states before directional interpretation.
5. Classify any apparent volume effect as INCREMENTAL, CONTEXT_PROXY, REDUNDANT, REGIME_OR_CONTEXT_DEPENDENT or UNKNOWN; do not force support/rejection from inadequate controls.
6. Do not alter Formal Core.


## PVE-161 — Volume sign is horizon/state dependent; prohibit universal HIGH_VOLUME bullishness (2026-09-28)
Status: LITERATURE_FALSIFICATION_FROZEN / PRE-OUTCOME / FORMAL_CORE_UNCHANGED

Cross-market evidence is intentionally contradictory: unusually high volume has been associated with subsequent appreciation in some designs, while high-volume winners/speculative turnover have also been associated with faster reversal or lower future returns. A 2021 meta-analysis of 468 estimates across 44 studies reports material heterogeneity and publication-bias concerns. Therefore D02 freezes the following rule before Taiwan prospective outcomes exist:
- no universal sign is assigned to HIGH_VOLUME, LOW_VOLUME, volume shock or turnover;
- horizon, prior price state, information/event context and market regime are mandatory interpretation dimensions;
- a result at one horizon (intraday/B1-B4, D1, D3/D5/D10, monthly) must not be silently generalized to another.

Falsification consequence:
D02-05 (climax/distribution volume), D02-09 (price-volume divergence) and D02-10 (volume-state x trend) cannot be validated by unconditional RVOL buckets. They require interaction/state evidence.

## PVE-162 — Residual-volume observability gap confirmed
Status: RESEARCH_GAP_CONFIRMED / NOT_IMPLEMENTED / OWNER_DECISION_NOT_REQUIRED_YET

Repository audit confirms:
- PRICE_VOLUME_SHADOW_SPEC.md declares pvMarketResidualRvol and pvSectorResidualRvol as intended daily Shadow fields;
- current v0.1 implementation/field dictionary and Worker patch implement pvDailyRvol20, pvSlotRvol20, pvCumvolPace20 and response/persistence/guard states, but repository-wide code search finds no implemented marketResidual/sectorResidual computation outside the specification;
- the spec itself states full-market 15m residualization is deferred.

Interpretation:
The residual-volume concept is currently a falsification requirement/design target, not an observed feature. No future analysis may claim market/sector-adjusted volume evidence until a PIT-valid implementation/receipt exists.

Minimum future design constraints (proposal only):
1. use only market/sector activity known by featureKnownAt;
2. do not raw-divide listed-stock share/lot volume by index volume with incompatible semantics;
3. prefer normalized peer activity (e.g. cross-sectional median/robust aggregate of comparable stock RVOL) rather than raw index volume;
4. sector aggregate must be leave-one-out for the target stock to avoid mechanical self-inclusion;
5. require minimum peer coverage and preserve UNKNOWN when coverage is insufficient;
6. freeze sector membership point-in-time; today's sector map cannot rewrite historical membership;
7. market and sector residuals are contextual diagnostics/falsification controls first, not additive alpha scores.

No implementation is authorized by this finding alone.

## PVE-163 — D02 factor-family consolidation: prevent fourfold counting of the same episode
Status: REDUNDANCY_GOVERNANCE_FROZEN / PRE-OUTCOME

Repository tracker currently separates D02-05 climax/distribution volume, D02-08 accumulation/distribution proxies, D02-09 price-volume divergence and D02-10 volume-state x trend. Mechanistically these can describe the same underlying episode and must not become four independent additive scores.

Freeze a three-stage evidence graph:
1. PARTICIPATION_RESIDUAL: Is activity abnormal for this stock after same-slot/history and, when available, market/sector context?
2. EFFORT_RESULT: What price progress/range/close-location occurred for that participation? HIGH_EFFORT_LOW_PROGRESS is distinct from EFFICIENT_UP/DOWN.
3. PERSISTENCE_ACCEPTANCE: Did the participation/price response persist, decay, retest, fail or reaccelerate on later comparable observations?

OBV/CMF/MFI/volume oscillators and narrative labels such as accumulation/distribution may be descriptive views, but cannot receive independent weight unless they prove incremental information beyond this graph on common support.

## PVE-164 — Response-state anti-circularity audit
Status: DESIGN_RISK_IDENTIFIED / H003_REMAINS_HIGHER_GATED

Current pvResponseState is partly constructed from price variables (signed progress, range expansion, close position, body/wick structure) plus RVOL. Therefore using pvResponseState to 'predict' an outcome label that is mechanically based on the same bar's close/progress can create circular apparent skill.

Freeze anti-circularity rules:
- same-bar response classification is explanatory/state description, not evidence of future predictive alpha;
- primary H003 outcomes must begin strictly after featureKnownAt/barEnd;
- report a price-only response baseline alongside price+volume response. Volume has incremental value only if price+volume improves future outcome discrimination beyond the same price geometry without volume;
- do not count the anchor bar's already-realized price movement as MFE/return evidence attributable to volume;
- acceptance transitions that reuse Formal geometry are not independent PV alpha evidence by themselves.

This is a direct falsification test against 'volume works' claims: if price-only response explains the same future outcomes, the PV state is REDUNDANT.

## PVE-165 — Persistence can add path information but not independent samples
Status: DEPENDENCE_RULE_FROZEN / H002-H003

pvPersistenceState is generated from repeated observations of the same participation episode. PERSISTENT/DECAYING/REIGNITED states may contain useful path information, but they are not independent market experiments.

Freeze:
- event-level primary unit remains the first clean participation event;
- later persistence states are within-event trajectory features;
- repeated 15m rows cannot inflate N_PRIMARY;
- continuity gaps remain quarantined per prior PVE rules;
- compare trajectory classes prospectively only after the event identity was frozen, never relabel the event from future outcomes.

## PVE-166 — Low-volume/dry-up falsification refinement
Status: PRE-OUTCOME_HYPOTHESIS_REFINEMENT / NO_THRESHOLD_TUNING

LOW_VOLUME/DRY_UP has at least three competing meanings:
A. constructive supply contraction during an intact setup;
B. weak demand/attention with no sponsor;
C. illiquidity/data-quality effect.

Therefore D02-04 cannot be validated from low RVOL alone. A constructive dry-up claim requires pre-outcome context showing intact price structure and acceptable liquidity, then a later independently observed re-expansion/reacceleration. If no later demand reappears, low volume remains descriptive, not bullish confirmation.

Do not tune a dry-up threshold from future winners. Use frozen/robust participation bands for descriptive testing first.

## PVE-167 — Long-block synthesis and next executable evidence plan
Status: LONG_BLOCK_COMPLETE / WAITING_LIVE_HINGE

This long research block yields no Formal optimization candidate yet, but materially tightens the falsification design:
- abnormal volume has no universal sign;
- raw RVOL must survive market/sector/context explanation;
- response states require price-only baselines to prove volume incrementality;
- persistence is a trajectory, not extra independent N;
- dry-up is not bullish without later demand confirmation;
- D02 narrative modules must not be stacked as duplicate scores.

The next empirical phase remains prospective. On first potentially clean cohorts:
A. coverage/provenance first;
B. A/B/C/D common-support comparison;
C. price-only vs price+volume response comparison;
D. high-volume strong-response vs weak-response split;
E. contextual/residual check when PIT-valid market/sector controls exist;
F. event-level persistence trajectories;
G. separate directional alpha from risk/false-break/MFE/MAE value.

No D02 module is promoted solely from this literature/design block because tracker rules require Taiwan PIT/OOS/prospective evidence for higher maturity.
Current Price-Volume evidence cursor: PVE-001 through PVE-167.
Formal Core remains LOCKED.


## PVE-168 — Four-quadrant price×volume labels are state descriptors, not directional rules (2026-09-28)
Status: PRE-OUTCOME_TAXONOMY_FROZEN / FORMAL_CORE_UNCHANGED

The classic four labels PRICE_UP_VOLUME_UP, PRICE_UP_VOLUME_DOWN, PRICE_DOWN_VOLUME_UP and PRICE_DOWN_VOLUME_DOWN are retained only as descriptive coordinates. They cannot carry a fixed bullish/bearish sign because identical coordinates can arise from information incorporation, liquidity demand, passive/rebalancing flow, disagreement, short covering, forced liquidation or ordinary low-attention trading.

Frozen decomposition for every quadrant:
1. PRICE_LOCATION: base / breakout boundary / post-breakout / pullback / late-stage / failed-break;
2. PRICE_RESPONSE: signed progress, close location, range/body/wick efficiency;
3. PARTICIPATION: daily RVOL / same-slot RVOL / cumulative pace on PIT-valid baselines;
4. ACCEPTANCE: later hold/re-entry/failure relative to frozen Formal geometry;
5. PERSISTENCE: fresh shock / persistent / decay / reignition with event dependence preserved;
6. CONTEXT: liquidity, market/sector activity, event/news/corporate-action and regime when PIT-valid.

Thus the four quadrants are reporting strata, never additive scores by themselves.

## PVE-169 — High-volume reversal can be liquidity pressure, not distribution
Status: COMPETING_MECHANISM_FROZEN / D02-05-D02-08

External evidence on institutional liquidity needs documents predictable price pressure and subsequent reversals around month-end across multiple equity markets; related literature explicitly links large-volume episodes to reduced/negative serial correlation under liquidity-demand shocks. This creates a concrete falsifier for the practitioner label 'high-volume decline = distribution'.

Required interpretation rule:
- HIGH_VOLUME + DOWN_PRICE is not DISTRIBUTION unless later path evidence and PIT-valid context reject plausible liquidity/event-pressure explanations;
- HIGH_VOLUME + UP_PRICE is not ACCUMULATION for the symmetric reason;
- when flow origin is unavailable, label mechanism UNKNOWN and retain only observable state descriptors.

System implication: D02-08 accumulation/distribution proxies cannot advance beyond descriptive proxy status from OHLCV alone.

## PVE-170 — Horizon-separation matrix frozen for price-volume claims
Status: MULTI_HORIZON_GOVERNANCE_FROZEN

A volume shock can coexist with continuation at one horizon and reversal at another. Therefore every future H001-H004 report must keep horizons separate rather than aggregate a single success label.

Frozen horizon families under current available evidence design:
- intraday path: B1/B2/B4 completed bars after featureKnownAt;
- short daily: D1/D3/D5 when clean daily outcomes exist;
- medium daily: D10/D20 only if source/provenance and corporate-action continuity remain valid.

No horizon may inherit the sign/status of another. A feature can be INTRADAY_RISK_USEFUL but DIRECTIONALLY_REDUNDANT, or SHORT_CONTINUATION_LONGER_REVERSAL, without contradiction.

## PVE-171 — Breakout-volume claim decomposed into necessity vs quality
Status: HYPOTHESIS_REFINEMENT / NO_FORMAL_CHANGE

'Breakout must have volume' contains two different claims and they must be tested separately:
A. NECESSITY: low-volume breakouts should fail more often.
B. QUALITY: conditional on a breakout already satisfying Formal price geometry, abnormal participation should add incremental information about later acceptance/failure.

Only B is directly relevant to H001/H002. A can be false while B is useful, or vice versa. Testing only successful breakouts creates selection bias; controls must be frozen from the pre-outcome candidate/pool evidence under PVE-155/159 constraints.

For D02-03, a future optimization candidate requires volume to improve false-break/retention discrimination beyond price-only breakout quality on common support, after costs and regime checks. Until then, 'breakout with volume' remains a hypothesis, not a rule.

## PVE-172 — Volume dry-up requires a paired demand-return event
Status: EVENT_PAIR_DESIGN_FROZEN / D02-04

PVE-166 is operationalized as a two-leg event rather than a single low-volume observation:
LEG_1 DRY_UP_CANDIDATE = low normalized participation while frozen price structure remains intact and liquidity is interpretable.
LEG_2 DEMAND_RETURN = later independent participation re-expansion with positive price-response/acceptance evidence before structure failure/expiry.

Research labels:
- DRY_UP_CONFIRMED only after LEG_2 occurs;
- DRY_UP_UNCONFIRMED while waiting;
- DEMAND_FAILED if structure fails before LEG_2;
- UNKNOWN if continuity/liquidity/Guard evidence is inadequate.

Critical PIT rule: a historical low-volume bar must never be relabelled 'healthy dry-up' merely because the stock later rose. The initial bar stays DRY_UP_CANDIDATE; confirmation is a later timestamped transition.

## PVE-173 — D02 long-block stage II synthesis
Status: LARGE_STAGE_COMPLETE / WAITING_PROSPECTIVE_HINGE

New durable conclusions beyond PVE-167:
- the four price×volume quadrants are descriptive coordinates, not directional signals;
- accumulation/distribution cannot be inferred uniquely from OHLCV because liquidity/event/passive-flow mechanisms can generate the same state;
- horizon must be explicit because continuation and reversal can coexist at different horizons;
- breakout-volume 'necessity' and 'incremental quality' are separate hypotheses;
- healthy dry-up is a timestamped two-leg lifecycle, preventing hindsight relabelling.

No Formal optimization candidate is eligible. These findings sharpen falsification and event labelling but do not supply Taiwan prospective/OOS evidence.

Exact next continuation after PVE-173:
1. Do not expand pre-outcome methodology again unless a concrete contradiction/implementation defect is discovered.
2. At the first post-enable ordinary-market hinge, execute PVE-149 Gate 0→7 before outcomes.
3. Preserve 2026-09-29 intraday as DATA_QA-only inherited cohort; inspect 9/29 after-market selection/bootstrap receipts; 2026-09-30 is only first potentially clean cohort.
4. First clean tables must separate price×volume quadrant, price-response state, breakout-quality question, dry-up lifecycle and horizon without threshold tuning.
5. Keep accumulation/distribution mechanism UNKNOWN unless independent PIT-valid evidence identifies flow origin.
6. Formal Core remains LOCKED.

Current Price-Volume evidence cursor: PVE-001 through PVE-173.


## Evidence progress — PVE-174 through PVE-180 (2026-09-28 long-block stage III)

### PVE-174 — Daily RVOL corporate-action continuity is code-proven incomplete
Status: CODE_PROVEN_DATA_QUALITY_DEFECT / DAILY_LAYER_QUARANTINE / FORMAL_UNCHANGED

Fresh main/patch-chain audit confirms a stronger statement than the earlier generic upstream-plumbing warning:
- `pvBuildDailyFeature(history, marketDate)` simply takes the current daily row plus the last 20 earlier positive-volume rows;
- it receives no corporate-action/reset argument and performs no post-reset filtering;
- `pvRecordDailySnapshot` persists `coverage.corporateActionResetAt:null` for AFTER_MARKET rows;
- the existing T13 corporate-action fixture tests intraday `pvBaselineStats`, not daily `pvDailyRvol20` continuity.

Therefore current v0.1 daily RVOL can mix pre/post structural share-volume regimes around splits, reverse splits, par-value/trading-unit changes, capital reductions or other events that alter raw volume comparability. Current-row volume and the market path may still be factual; the normalized daily ratio is not automatically hypothesis-clean across such boundaries.

Rule frozen before prospective outcomes:
- daily `pvDailyRvol20` is eligible only when corporate-action / trading-unit continuity is independently verified for the full denominator window;
- unresolved continuity => DAILY_RVOL_CONTINUITY_UNKNOWN, not neutral RVOL=1 and not BAD;
- do not retroactively infer reset dates from future/current registries without PIT-valid event provenance.

### PVE-175 — Price-censor Guard does not implement Taiwan legal limit semantics
Status: CODE_PROVEN_GUARD_SEMANTIC_DEFECT / GUARD_LABEL_QUARANTINE

Current patch code:
`bar.high >= previousClose*1.099 || bar.low <= previousClose*0.901`.

Current TWSE Operating Rules instead define ordinary-stock daily limits relative to the auction reference price at market opening, with minimum-tick handling; newly TWSE-listed common stocks (except TPEx-to-TWSE transfers) have no fluctuation limit for the first five trading days. Tick size itself varies by price tier under Article 62.

Official anchors checked on 2026-09-28:
- Article 63: https://twse-regulation.twse.com.tw/EN/law/DOC01.aspx?FLCODE=FL007304&FLNO=63
- Article 62: https://twse-regulation.twse.com.tw/eng/en/law/DOC01.aspx?FLCODE=FL007304&FLNO=62

Consequences:
- raw previousClose is not always the legal reference;
- fixed 1.099/0.901 floating thresholds are not the exchange limit-price calculation;
- tick rounding/minimum tick can change the exact boundary;
- special no-limit sessions cannot be represented by the generic ±10% proxy.

Thus `PRICE_CENSORED` remains a heuristic diagnostic, not exchange-truth. It cannot qualify H003/H004 evidence without an exchange-consistent overlay. Raw observed slot volume itself need not be discarded solely because this Guard is untrusted.

### PVE-176 — Selected-plan contract omits multiple Guard inputs
Status: CODE_PROVEN_INPUT_CONTRACT_MISMATCH / MISSING_IS_NOT_FALSE

Fresh audit of `allocateAndBuildPlans()` and the V8.11 PV patch shows that the selected Formal plan carries trading-plan fields such as formalClose/channel/priority/levels, but does not emit the following fields that PV later attempts to read from `result.plan`:
- `avgVolume20Lots`;
- `liquidityException`;
- `marketStructure`;
- `corporateActionResetAt`;
- `pvGapDominated`.

Repository-wide search also finds no producer assignment for `pvGapDominated` in the current patch chain.

This creates concrete missing->false/normal coercions:
- `pvIlliquidityWarning(plan)` returns false when avgVolume20Lots is absent;
- unsupported-market check maps absent marketStructure to empty string, hence not ESB;
- gapDominated uses `===true`, so absence becomes false;
- a newly created baseline cannot receive a plan corporateActionResetAt that the plan does not carry.

This is stronger than saying the upstream plumbing is merely unverified. For the audited plan-builder path, the Guard input contract is incomplete. Production incidence for alternative/nonstandard plan paths remains UNKNOWN, but missing fields must not be interpreted as verified NORMAL.

### PVE-177 — Reference-price UNKNOWN is only raised at 09:00
Status: CODE_PROVEN_UNKNOWN_COERCION_RISK / INCIDENCE_UNKNOWN

The intraday builder sets:
`referencePriceUnresolved = (bar.slotKey === "09:00" && referenceClose === null)`.
But `pvPriceCensored()` needs a reference for every slot; with a missing reference on later bars it simply returns false.

Therefore a missing reference after 09:00 can become:
- no REFERENCE_PRICE_UNRESOLVED flag;
- no PRICE_CENSORED flag;
while actual boundary state is unobservable.

A valid current quote may make real-world incidence low, but incidence is not the semantic contract. For research evidence, missing required reference provenance at any slot where boundary interpretation is used must be UNKNOWN, not verified non-censored.

### PVE-178 — Field-level quarantine matrix before the first live cohort
Status: PREREGISTERED_DATA_QUALITY_OVERLAY / NO_OUTCOME_INSPECTION

Do not collapse the defects above into an all-or-nothing row rejection.

1. H001 slot RVOL:
   - may remain eligible when current bar, same-slot denominator, source unit, completed-bar timing, baseline freshness and cohort provenance are clean;
   - does not require a trusted price-censor or illiquidity label for the raw volume relationship itself.
2. H002 cumulative pace:
   - same field-level salvage principle, plus complete current-session prefix and cumulative baseline continuity.
3. H003 response/acceptance/Guard:
   - quarantine rows whose interpretation requires the defective Guard fields;
   - retain raw price/volume primitives separately.
4. H004 future market-path outcomes:
   - may still be recorded factually, but cannot become hypothesis-clean without outcome/session/corporate-action/boundary overlays.
5. Daily RVOL:
   - quarantine denominator windows crossing unresolved corporate-action/trading-unit continuity.

This preserves information while preventing a single broken label from falsely turning a row clean or destroying unrelated raw evidence.

### PVE-179 — External evidence revalidates state/horizon separation, not a new threshold
Status: LITERATURE_REVALIDATION / NO_MATURITY_PROMOTION

Fresh literature review before prospective Taiwan outcome inspection again rejects a universal volume sign:
- Lee & Swaminathan show past volume interacts with momentum life-cycle and high-volume winners can reverse faster over long horizons;
- Medhat & Schmeling report short-term reversal among low-turnover stocks but short-term momentum among high-turnover stocks across U.S./international samples.

These are mechanism priors, not Taiwan validation. Their value here is to reinforce the already-frozen rule that turnover/volume can change the state and horizon of return continuation/reversal; they do not justify importing a fixed RVOL threshold, sign or holding period into D02.

### PVE-180 — Long-block stage III synthesis
Status: IMPLEMENTATION_SEMANTICS_AUDITED / PROSPECTIVE_ALPHA_STILL_UNKNOWN

This block resolves one false alarm and finds four material evidence-contract issues.

Resolved false alarm:
- repository `Worker.js` is intentionally a pre-patch base; deploy/regression workflows sequentially apply `scripts/apply_v8_11_0.py` and later V8.12-V8.14 patches, then assert `PV_SHADOW_V0_1` symbols/tables in the built Worker. Absence of PV code in base Worker.js is therefore not evidence that deployed PV disappeared.

Durable new findings:
- daily RVOL lacks effective corporate-action reset continuity;
- price-censor is not exchange-exact;
- selected-plan-to-PV Guard input contract omits several fields and coerces missing evidence toward false/normal;
- reference-price unresolved handling is slot-asymmetric.

System implication:
- no Formal Core change is justified;
- H001/H002 raw-volume evidence remains partially salvageable under field-scoped quality gates;
- H003/H004 Guard/state evidence remains materially more restricted;
- 2026-09-30 is still only the first potentially clean cohort, and cleanliness must be row/field specific rather than date-wide.

Current Price-Volume evidence cursor: PVE-001 through PVE-180.
Formal Core remains LOCKED.

## Revised exact continuation after PVE-180
1. Preserve the 2026-09-29/30 prospective hinge and do not fabricate pre-hinge Shadow outcomes.
2. Before inspecting any return/MFE/MAE result, run PVE-149 Gate 0->7 plus the PVE-174~178 field-level overlay.
3. Report Guard-input coverage explicitly: PRESENT / MISSING / UNKNOWN, never infer NORMAL from an absent plan field.
4. For daily RVOL, require PIT-valid corporate-action/trading-unit continuity for the full 20-session denominator window.
5. For H001/H002, proceed on clean raw-volume common support even if H003 Guard labels are quarantined.
6. For H003/H004, require exchange-consistent price-boundary/reference overlays and price-only vs price+volume anti-circularity before any interpretation.
7. After clean data accumulate, run horizon-separated A/B/C/D, quadrant/response, breakout-quality and two-leg dry-up analyses without threshold tuning.
8. No Formal modification or FORMAL_OPTIMIZATION_CANDIDATE until prospective/OOS evidence passes the existing gates.


## Evidence progress — PVE-181 through PVE-186 (2026-09-29 pre-market long block)

### PVE-181 — 13:00 PRE_EVENT can create a phantom Acceptance event
Status: CODE_PROVEN_EVENT_DENOMINATOR_DEFECT / H003_QUARANTINE / FORMAL_UNCHANGED

Fresh audit of `pvAdvanceAcceptance()` shows the session-end clause executes for every non-terminal state:
`if(bar.slotKey==="13:00" && ![...terminal states].includes(state)) state=*_EXPIRED_AMBIGUOUS`.

If a symbol remained `B_PRE_EVENT` all day without ever reaching breakout, or `A_PRE_EVENT` without ever entering the pullback zone, the 13:00 bar still changes state to `B_EXPIRED_AMBIGUOUS` / `A_EXPIRED_AMBIGUOUS`. Immediately afterward, `eventKey` is created whenever `transitioned && state!==initial`.

Therefore a pure PRE_EVENT -> EXPIRED_AMBIGUOUS transition can manufacture a `PVACC:...` event even though no underlying Acceptance lifecycle was ever activated.

Evidence rule frozen before live outcome inspection:
- raw `acceptance.eventKey` count is NOT the H003 event denominator;
- an Acceptance event is active only after a genuine pre-outcome lifecycle entry such as B_BREAKOUT_ATTEMPT / B_INITIAL_ACCEPTANCE / A_PULLBACK_TEST / A_INITIAL_ACCEPTANCE (or a future versioned equivalent);
- PRE_EVENT -> EXPIRED_AMBIGUOUS-only keys are `NO_TRIGGER_SESSION_CENSOR`, not failed/ambiguous Acceptance events;
- historical/prospective v0.1 rows can be reclassified offline from nested stateHistory; snapshots are not rewritten.

### PVE-182 — INVALID Guard does not pause Acceptance, unlike Persistence
Status: CODE_PROVEN_STATE_MACHINE_ASYMMETRY / H003_H004_HIGHER_GATED

Current intraday builder explicitly passes:
`comparable = guard.pvInterpretability !== "INVALID"`
to `pvAdvancePersistence()`, so participation persistence pauses on INVALID rows.

But `pvAdvanceAcceptance()` is called unconditionally and receives no Guard/comparable input. As a result, rows flagged INVALID for reasons such as INVALID_SOURCE_DATA, DATA_INSUFFICIENT, REFERENCE_PRICE_UNRESOLVED or other invalid-precedence states can still advance Acceptance based on available bar/plan geometry.

This is a semantic asymmetry:
- Persistence: INVALID => paused;
- Acceptance: INVALID => can transition.

The asymmetry is not automatically wrong for storage, but it prevents v0.1 Acceptance state from being treated as hypothesis-clean ground truth without a quality overlay.

### PVE-183 — INVALID rows can still create intraday outcome anchors
Status: CODE_PROVEN_ANCHOR_ELIGIBILITY_LEAK / OUTCOME_STORAGE_NOT_INFERENCE

After unconditional Acceptance evaluation, current code sets:
`anchorEligible = acceptance.transitioned && (B_INITIAL_ACCEPTANCE || A_REACCELERATION)`.
There is no additional condition requiring `guard.pvInterpretability !== "INVALID"`.

Therefore a cold-start / source-invalid row can theoretically become anchorEligible and later receive B1/B2/B4 and daily outcomes. The outcome values may be factual market paths, but their existence does not make the originating PV state clean.

Frozen rule:
- outcome storage and feature/state eligibility are separate dimensions;
- `anchorEligible=true` does not imply H003/H004 eligibility;
- primary H003/H004 requires both genuine Acceptance lifecycle entry and a field-level quality overlay proving the fields used by that transition were interpretable at featureKnownAt.

### PVE-184 — 2026-09-29 cold-start Acceptance/outcome rows require explicit DATA_QA-only labeling
Status: FIRST_SESSION_QA_REFINEMENT / NO_OUTCOME_INSPECTION

The first ordinary post-enable intraday session is still 2026-09-29 and remains DATA_QA-only due inherited stale 2026-09-24 plan lineage. In addition, before the first successful after-market bootstrap, intraday same-slot baselines are expected cold/insufficient.

Because Acceptance can advance independently of the PV baseline Guard, the recorder may still persist Acceptance transitions/anchors/outcomes on 9/29 even when RVOL response fields are DATA_INSUFFICIENT/INVALID.

Therefore the 9/29 receipt must separately count:
- raw snapshots;
- Guard INVALID / GUARDED / VALID rows;
- raw Acceptance transitions;
- genuine lifecycle-entry transitions;
- PRE_EVENT-only expiries;
- raw anchorEligible rows;
- hypothesis-clean anchors (expected zero for primary inference on 9/29 regardless of market outcome).

### PVE-185 — H003 event denominator and maturity accounting frozen
Status: EVENT_ACCOUNTING_PREREGISTERED / NO_ALPHA_CLAIM

For v0.1 H003 reporting, maintain three distinct denominators:
1. `RAW_ACCEPTANCE_KEY_COUNT`: all nested acceptance event keys, including phantom PRE_EVENT expiries;
2. `ACTIVE_ACCEPTANCE_LIFECYCLE_COUNT`: keys whose stateHistory proves a real pre-event trigger/lifecycle entry occurred before expiry;
3. `H003_HYPOTHESIS_CLEAN_EVENT_COUNT`: active lifecycle keys that also pass Guard/input/PIT/cohort/continuity/anti-circularity gates.

Only #3 may count toward H003 evidence maturity.
#1 remains QA diagnostics only.

No event may become active because of future return, MFE/MAE, or later success/failure; activation is determined solely from the timestamped pre-outcome state path.

### PVE-186 — Long-block stage IV synthesis and live hinge
Status: PREMARKET_FALSIFICATION_COMPLETE / WAITING_2026_09_29_RUNTIME_RECEIPTS

This block found two previously unregistered v0.1 evidence-semantic defects:
- session-end PRE_EVENT expiry can create phantom Acceptance event keys;
- Acceptance/anchor creation is not fail-closed when the Guard is INVALID.

These defects do NOT invalidate H001/H002 raw slot RVOL / cumulative-pace evidence by themselves. They materially strengthen the quarantine around H003/H004 state/outcome inference.

No Formal optimization candidate is created. No runtime/Formal change is authorized from these findings alone.

Current Price-Volume evidence cursor: PVE-001 through PVE-186.
Formal Core remains LOCKED.

## Exact continuation after PVE-186
1. At 2026-09-29 intraday, execute the preregistered PVE-149 Gate 0->7 and PVE-174~185 overlays before inspecting any outcome metric.
2. Treat all 9/29 intraday rows as DATA_QA-only for primary H001~H004 due inherited 9/24 cohort lineage, regardless of recorder quality.
3. Explicitly classify Acceptance rows into PRE_EVENT_ONLY_EXPIRY / ACTIVE_LIFECYCLE / HYPOTHESIS_CLEAN.
4. Count anchorEligible separately from hypothesis-clean anchors; INVALID Guard anchors cannot enter H003/H004 primary inference.
5. After the 9/29 after-market run, inspect selection/bootstrap receipts and baseline freshness/lineage; 9/30 remains only the earliest potentially clean cohort.
6. No return/MFE/MAE threshold tuning, no historical Shadow fabrication, no maturity promotion until clean prospective evidence exists.


## Evidence progress — PVE-187 through PVE-193 (2026-09-29 post-close / pre-after-market long block)

### PVE-187 — 2026-09-29 real production read-only receipt confirms inherited 9/24 plan lineage
Status: LIVE_PRODUCTION_RECEIPT_OBSERVED / DATA_QA_ONLY_CONFIRMED / NO_OUTCOME_INSPECTION

A read-only production diagnostic executed during PR #258 regression at approximately 2026-09-29 21:31 Asia/Taipei. It independently observed:
- runtime version = `8.14.0-sector-gate-provenance-shadow`;
- TEST_MODE=false;
- production admin authorization succeeded;
- V7_DB/STOCKS_KV bindings were present in preflight;
- `/api/scan/status` still reported `scanDate=2026-09-24`, selectedCount=2, config saved/verified, config updatedAt=2026-09-24T23:37:33.822Z;
- the 2026-09-29 23:35 after-market scan had not yet occurred at the receipt time.

This is actual runtime evidence, not merely source-code inference. It confirms the preregistered PVE-150 lineage expectation that the 2026-09-29 intraday monitor still inherited the last successfully saved 2026-09-24 Formal plan.

Research consequence:
- all 2026-09-29 intraday PV rows remain `INHERITED_KNOWN_STALE_SELECTION / DATA_QA_ONLY` for primary H001~H004;
- no observed 9/29 return/MFE/MAE can rehabilitate that cohort;
- this receipt does not prove row-level PV recorder success or D1 at-rest contents because the diagnostic did not enumerate PV D1 rows.

### PVE-188 — scan/status freshness is decision-clock dependent
Status: PHASE_AWARE_RUNTIME_SEMANTICS_FROZEN

At ~21:31 Taipei, `scanDate=2026-09-24` is not evidence that the 9/29 after-market scan failed, because the scheduled Formal after-market scan is 23:35 Taipei. Before that decision clock, the correct expected state is the prior successful plan/scan.

Freeze runtime receipt classes:
- `EXPECTED_PRIOR_SCAN_STATE`: current time precedes today's scheduled after-market decision clock;
- `CURRENT_SCAN_EXPECTED_PENDING`: scheduled time reached but completion window not yet elapsed;
- `CURRENT_SCAN_OBSERVED`: today's successful scan receipt exists;
- `CURRENT_SCAN_MISSING_OR_FAILED`: only after the expected completion window and with cron/scan evidence supporting absence/failure;
- `UNKNOWN_CLOCK_OR_RECEIPT`: timing/provenance insufficient.

This prevents false stale-scan alarms and is reusable for the 9/29->9/30 cohort handoff.

### PVE-189 — Manual-only PV QA cannot certify prospective evidence coverage
Status: SELECTION_BIAS_GUARD_FROZEN / QA_DIAGNOSTIC_NOT_COHORT_RECEIPT

Both current PV QA workflows are `workflow_dispatch`-only and have no scheduled trigger:
- `.github/workflows/pv-shadow-readonly-qa.yml`;
- `.github/workflows/pv-shadow-ephemeral-d1-qa.yml`.

A manually chosen QA run can be valuable for debugging/at-rest inspection, but it cannot by itself prove complete prospective observation coverage. Running QA only on interesting or convenient dates creates a cherry-picking/selection-bias channel even when the query is read-only.

Frozen rule:
- manual QA artifacts = `DIAGNOSTIC_ONLY` for coverage/readiness clocks;
- they may verify properties of rows already captured, but cannot establish that all required dates/events were observed;
- maturity denominators require an independent expected-date/attempt receipt or a future deterministic scheduled evidence stream;
- no historical manual rerun may be backfilled as if it were a prospective scheduled receipt.

No scheduling change is authorized by this finding alone.

### PVE-190 — Acceptance denominator observability added as isolated Class-A QA
Status: CLASS_A_RESEARCH_QA_IMPLEMENTED / FORMAL_UNCHANGED

PVE-181~185 froze Acceptance denominators, but the existing ephemeral D1 QA did not expose them. An isolated research branch was created from fresh main, regression-tested, and merged through PR #258.

Merged commit:
`ea6f89115825ee0fb3c04cbbedfd61cd2105d679`

The manual read-only ephemeral D1 QA now reports, by market date:
- intradayRows;
- guardInvalidRows / guardGuardedRows / guardValidRows;
- rawAcceptanceTransitions;
- activeLifecycleRows;
- preEventOnlyExpiries;
- rawAnchorEligibleRows;
- invalidAnchorEligibleRows;
- nonInvalidAnchorEligibleRows;
- rawAcceptanceEventKeys;
- activeAcceptanceLifecycleEventKeys;
- phantomPreEventExpiryEventKeys.

The report explicitly labels this block:
`QA_ONLY_NOT_HYPOTHESIS_CLEAN`.
Cohort/PIT/anti-circularity overlays remain external and mandatory.

Safety evidence:
- V8 Repair CI run 36575682320: PASS;
- V8 Regression Tests run 36575681884: PASS;
- production build, syntax/offline regression, read-only production authorization preflight and latest after-market diagnostic all passed;
- no Worker patch, Formal selection, ranking, capital, Cron, push or trading behavior was changed by PR #258.

### PVE-191 — Legacy direct PV QA has a stale runtime-version assertion
Status: QA_TOOL_VERSION_DRIFT_CONFIRMED / DO_NOT_MISCLASSIFY_AS_DATA_FAILURE

`tests/pv_shadow_readonly_qa.mjs` still asserts the deployed runtime must match:
`8.11.0-pv-shadow-v0.1-log-only`.

Independent 2026-09-29 production readback and the current production patch chain verify runtime:
`8.14.0-sector-gate-provenance-shadow`.

Therefore the legacy direct QA can fail solely because its runtime string assertion is stale, even when PV Shadow remains present in the V8.14 build. Such a failure must be classified `QA_TOOL_VERSION_DRIFT`, not PV recorder/data failure.

For current diagnostics, prefer the forward-compatible ephemeral QA/source-attestation path unless/until the legacy assertion is version-normalized. No production runtime change is implied.

### PVE-192 — PVE-149 gate status at the 2026-09-29 21:31 receipt
Status: PARTIAL_LIVE_GATE_EVALUATION / OUTCOMES_CLOSED

Gate 0 — Provenance: PARTIAL_PASS
- actual production runtime V8.14 receipt observed;
- PR/run/job lineage known for the diagnostic;
- no row-level PV artifact id / Worker version-id+etag tied to 9/29 PV rows yet.

Gate 1 — Safety/Formal isolation: PARTIAL_PASS
- regression production build preserves PV LOG_ONLY hooks and decisionImpact/formalCoreImpact contracts;
- production preflight is read-only and authorized;
- today's row-level PV runtime receipt/at-rest decisionImpact counts remain unobserved.

Gate 2 — Market/operation context: PASS_FOR_CURRENT_PHASE
- receipt was before 23:35 after-market decision clock;
- prior scanDate 9/24 is expected at this clock phase;
- no claim of 9/29 after-market scan success/failure is allowed yet.

Gate 3 — Acquisition observability: ROW_LEVEL_UNOBSERVED
- no actual 9/29 ephemeral D1 QA artifact was available in repository/connector evidence at this time;
- measured zero is forbidden; state remains NOT_OBSERVED.

Gate 4 — Baseline lineage/readiness: NOT_YET_EVALUABLE
- 9/29 after-market bootstrap had not occurred.

Gate 5 — Cohort provenance: 9/29_INTRADAY_UNCLEAN_CONFIRMED
- actual scan/status still anchored to the 9/24 saved plan.

Gate 6 — Feature QA: DATA_QA_ONLY / ROW_ELIGIBILITY_UNOBSERVED
- cannot count H001/H002 clean common support without at-rest rows/baseline receipts.

Gate 7 — Outcomes: CLOSED
- no performance/threshold/promotion inspection authorized.

### PVE-193 — Long-block stage V synthesis and exact post-23:35 hinge
Status: FIRST_LIVE_LINEAGE_EVIDENCE_CAPTURED / WAITING_AFTER_MARKET_SELECTION_BOOTSTRAP

This stage converts one previously structural expectation into observed production evidence: the 9/29 intraday cohort truly remained on the prior 9/24 scan/plan before the scheduled 9/29 after-market refresh.

It also strengthens evidence governance:
- scan freshness must respect the decision clock;
- manual QA is diagnostic, not complete prospective coverage;
- Acceptance QA denominators are now observable in an isolated read-only tool;
- the legacy direct QA runtime assertion is stale and must not create a false data-quality alarm.

No H001~H004 direction/status is promoted or rejected. No FORMAL_OPTIMIZATION_CANDIDATE exists. Formal Core remains LOCKED.

Current Price-Volume evidence cursor: PVE-001 through PVE-193.

## Exact continuation after PVE-193
1. After the 2026-09-29 23:35 Formal after-market completion window, read the latest scan/status + cron receipt before any outcome inspection.
2. Require `scanDate=2026-09-29` or classify the exact zero-plan/failed/missing reason; do not infer from time alone.
3. Inspect `pvShadow.bootstrap` and `pvShadow.daily` runtime receipts, Formal safety, selected symbols, old/new plan overlap and per-symbol bootstrap result.
4. For each non-skipped bootstrap row, inspect validSessions and lastMarketDate. For skipped cache rows, freshness remains UNKNOWN unless D1/baseline receipt resolves it.
5. If a manual ephemeral D1 QA is available, use the newly merged Acceptance QA counters only as diagnostic row-quality evidence; it does not replace prospective coverage provenance.
6. Determine 2026-09-30 row-level cohort classes: CONTINUING_FROM_PRIOR_MONITOR / NEW_AFTER_MARKET_SELECTION / REENTERED_WITH_EXISTING_CACHE / UNKNOWN, plus CLEAN/UNCLEAN/UNKNOWN eligibility.
7. 2026-09-30 becomes the first potentially clean H001/H002 date only for rows passing all PVE-149 + PVE-174~192 gates. H003/H004 remain more restrictive.
8. Keep Gate 7 closed until preregistered maturity/common-support requirements are met; no threshold tuning or Formal change.


## Evidence progress — PVE-194 through PVE-202 (2026-09-30 Stage VI long block)

### PVE-194 — The natural 2026-09-29 23:35 after-market path did not yield an ordinary completed scan receipt
Status: NATURAL_AFTER_MARKET_NOT_COMPLETED / EXACT_SKIP_REASON_UNKNOWN / OUTCOMES_CLOSED

A fresh read-only production diagnostic on 2026-09-30 morning shows the 2026-09-29 scheduled AFTER_MARKET_SCAN cron:
- scheduled at 2026-09-29 23:35:20 Asia/Taipei;
- status = SKIPPED;
- error = null.

The current receipt does not expose the exact skip reason. Therefore:
- do NOT infer that the history-admission defect was the direct cron skip reason;
- do NOT treat the later recovered scanDate=2026-09-29 as evidence that the ordinary 23:35 pipeline completed;
- ordinary 9/29 selection/bootstrap provenance remains absent.

### PVE-195 — The first guarded historical recovery attempt still did not create the 9/29 selection
Status: GUARDED_RECOVERY_ATTEMPT_SKIPPED / QUALITY_RECOVERY_SEPARATED_FROM_SELECTION

Recovery run 36631504304 / job 109621869201 ran on 2026-09-30 around 05:11~05:12 Taipei.

Before selection retry it recovered/verified official quality snapshots for 2026-09-29. The subsequent single guarded POST to the historical recovery scan returned:
- recovery=true;
- historicalRecovery=true;
- requestedDate=2026-09-29;
- skipped=true;
- scanDate=2026-09-29;
- selectedCount=0;
- dailyDeliveryState=null.

Thus quality-data repair and selection persistence are separate events. The first guarded recovery attempt did not produce an ordinary persisted selection.

### PVE-196 — The persisted 9/29 selection was recomputed after the decision cutoff through staged historical dry-run
Status: HISTORICAL_RECOVERY_RECOMPUTED_AFTER_DECISION_CUTOFF / PRIMARY_PROSPECTIVE_COHORT_UNCLEAN

Run 36632353882 / job 109624458000 completed at approximately 2026-09-30 05:18 Taipei.

The production stage-selection route is code-proven to:
1. accept marketDate=2026-09-29;
2. set a historical scheduledTime;
3. call `runAfterMarketScan(...,{dryRun:true})`;
4. validate the preview;
5. persist the preview into operational stock config and LAST_SCAN_KEY.

The recovered output persisted:
- 2006;
- 4977;
with selectedCount=2.

This is not the original 2026-09-29 23:35 decision-time receipt. It is a next-morning historical recomputation. Even if every source row carries an as-of date of 9/29, first-known-before-23:35 provenance is not established for the recovered input set.

Frozen D02 classification:
`HISTORICAL_RECOVERY_RECOMPUTED_AFTER_DECISION_CUTOFF`.

Such rows cannot count as clean Prospective Shadow selection provenance.

### PVE-197 — 2026-09-30 is invalidated as the first clean H001/H002 prospective date
Status: FIRST_POTENTIALLY_CLEAN_DATE_INVALIDATED / DATA_QA_ONLY

PVE-150 previously allowed 2026-09-30 as the earliest *potentially* clean date if the 9/29 ordinary after-market selection and PV bootstrap succeeded.

That prerequisite did not occur.

Because the operational 9/29 plan was persisted by a 9/30 morning historical recomputation:
- 9/30 intraday may still be useful for recorder mechanics and source QA;
- it is excluded from primary H001/H002 incremental-value inference;
- H003/H004 are likewise excluded and remain higher-gated.

The first potentially clean date is now intentionally unspecified. It requires a future ordinary after-market selection, ordinary PV bootstrap, clean PIT provenance and all existing PVE-149 gates.

### PVE-198 — Staged recovery does not execute the ordinary PV after-market bootstrap/daily path
Status: ORDINARY_PV_BOOTSTRAP_ABSENT_ON_RECOVERY_PATH / BASELINE_READINESS_NOT_PROVEN

The V8.11 PV hooks execute `bootstrapPvShadowBaselinesSafe()` and `recordPvDailyShadowSafe()` only in the ordinary non-dry-run after-market flow after Formal plan/bridge/daily-report completion.

The staged recovery route:
- uses `runAfterMarketScan(...,{dryRun:true})`;
- then persists the verified preview;
- contains no call to `bootstrapPvShadowBaselinesSafe()`;
- contains no call to `recordPvDailyShadowSafe()`.

Therefore the staged 9/29 selection cannot be treated as if the normal PV bootstrap/daily receipt occurred.

A possible intraday roll of 9/29 observations for previously monitored symbols is a different mechanism and remains NOT_OBSERVED at rest here. It cannot substitute for an independently verified historical same-slot baseline/bootstrap contract.

### PVE-199 — 2/2 symbol overlap does not rehabilitate the recovered cohort
Status: FULL_SYMBOL_OVERLAP_DESCRIPTIVE_ONLY / NO_PROVENANCE_REHABILITATION

The recovered 9/29 Formal symbols are:
- 2006;
- 4977.

They are the same two Formal symbols known from the prior 9/24 plan, giving 2/2 symbol overlap.

This is descriptive continuity only. Same symbols do not prove:
- same ranking inputs;
- same source vintages;
- same decision-time information set;
- same baseline freshness;
- same clean control population.

Recovery recomputation can reproduce the same names while still violating prospective timing.

### PVE-200 — Recovery receipt violates the Formal planDate construction invariant
Status: RECOVERY_RECEIPT_PLAN_DATE_INVARIANT_VIOLATION / COHORT_CLOCK_UNTRUSTED

The stage-recovery readback reports:
- scanDate=2026-09-29;
- first Formal stock planDate=2026-09-29.

Fresh code audit proves ordinary Formal construction uses:
`planDate = nextTradingDate(scanDate)`.

The 2026 preloaded holiday set does not mark 2026-09-30 as a holiday, and `nextTradingDate()` advances at least one calendar day before testing trading status. Therefore the expected planDate for scanDate 2026-09-29 is 2026-09-30.

V8.14.1 only changes TDCC share reconciliation and does not alter this calendar/plan-date rule.

Conclusion:
the observed recovery receipt violates the normal plan-date invariant. The root cause is not yet proven, so do not generalize this into a production-wide planDate bug. For D02 evidence governance, however, the recovery plan's cohort clock is not trustworthy enough for PIT-clean inference.

### PVE-201 — Cross-room history-admission failure independently blocks 9/29 selection provenance
Status: CROSS_ROOM_DEPENDENCY_BLOCK / DIRECT_CRON_CAUSALITY_NOT_ASSUMED

Canonical cross-room receipt:
`research/br030_history_admission_dependency_20260930_v0_1.json`.

It records for scanDate 2026-09-29:
- unusableSymbols = 1883;
- OFFICIAL_GAP_PROOF_UNAVAILABLE = 1872;
- INSUFFICIENT_PRIOR_BARS = 11;
- repeated gapDate = 2026-07-10.

The repeated 2026-07-10 gap corresponds to a legitimate BAVI whole-market typhoon closure, while the preloaded 2026 planned-holiday map omits that later unscheduled closure. This is strong evidence of a shared history-admission provenance blocker.

D02 uses this only as a dependency:
- it independently prevents calling the recovered 9/29 selection clean;
- it does NOT prove this was the exact reason the 23:35 cron returned SKIPPED unless a direct cron receipt says so;
- the shared-runtime fix remains outside D02's autonomous scope.

### PVE-202 — PVE-149 gate state after the first post-holiday recovery sequence
Status: STAGE_VI_GATE_EVALUATION_COMPLETE / GATE_7_CLOSED / FORMAL_UNCHANGED

Gate 0 — Provenance: PARTIAL / FAIL_FOR_CLEAN_COHORT
- runtime/recovery run/job/commit receipts are identified;
- original 23:35 decision-time selection receipt is absent;
- recovered selection occurred after cutoff.

Gate 1 — Safety/Formal isolation: PASS_FOR_D02_RESEARCH_BOUNDARY
- this D02 block made no Formal change;
- recovery operations existed independently and are being audited, not initiated by D02;
- PV remains research-only for inference.

Gate 2 — Market/operation context: RECOVERY_PATH
- natural 23:35 cron = SKIPPED;
- first guarded recovery attempt = skipped;
- staged historical recovery later persisted selection.

Gate 3 — Acquisition observability: PARTIAL
- recovery/scan logs are directly observed;
- row-level PV D1 baseline/snapshot truth for 9/29 remains unobserved here.

Gate 4 — Baseline lineage/readiness: FAIL_FOR_CLEAN_9_30
- ordinary after-market PV bootstrap/daily path was not executed/proven on stage-selection;
- baseline field readiness is therefore not established.

Gate 5 — Cohort provenance: FAIL
- 9/30 operational plan derives from historical recomputation after intended 9/29 decision cutoff;
- planDate invariant also fails in the recovery receipt.

Gate 6 — Feature QA: DATA_QA_ONLY
- any 9/30 PV fields may be inspected for recorder/data semantics, not primary alpha.

Gate 7 — Outcomes: CLOSED
- no return/MFE/MAE superiority, threshold tuning or promotion is inspected.

Machine-readable receipt:
`research/d02_20260929_recovery_lineage_receipt_v0_1.json`.

Current Price-Volume evidence cursor: PVE-001 through PVE-202.
Formal Core remains LOCKED.

## Exact continuation after PVE-202
1. Treat all 2026-09-30 intraday PV observations as DATA_QA-only for primary H001~H004.
2. Do not assign a new calendar date as “first clean date” until an ordinary after-market selection and ordinary PV bootstrap both produce contemporaneous receipts.
3. On the next ordinary candidate cohort, require decision-time selection provenance, correct scanDate→planDate invariant, history-admission pass, baseline field readiness, pool/cohort integrity and PVE-149 Gate 0→6 before any outcome inspection.
4. Preserve the 9/29 natural cron skip reason as UNKNOWN_FROM_CURRENT_RECEIPT; do not post-hoc assign the history-admission defect as its cause.
5. Route the 2026-07-10 unscheduled-closure/history-admission repair to its owning shared-runtime governance path; D02 must not silently alter Formal calendar/history behavior.
6. If row-level 9/30 PV data become available, use them only to test recorder mechanics, UNKNOWN/null behavior, Acceptance phantom/INVALID-anchor diagnostics and baseline coverage; they cannot advance clean alpha-date counts.
7. H001/H002 A/B/C/D performance comparison remains unopened until clean prospective common support exists.
