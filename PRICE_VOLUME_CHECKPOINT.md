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
