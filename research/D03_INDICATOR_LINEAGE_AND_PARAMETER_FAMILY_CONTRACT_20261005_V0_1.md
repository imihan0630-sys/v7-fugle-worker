# D03 Indicator Lineage and Parameter-Family Contract V0.1

Updated: 2026-10-05 Asia/Taipei  
Room: 03｜技術指標與趨勢動能研究室  
Classification: Class A research / Shadow diagnostic  
Tickets: SDA-001, SDA-004  
Formal Core impact: NONE / LOCKED

## Purpose

This contract prevents D03 from manufacturing confidence by counting several deterministic or near-deterministic transforms of the same price path as independent Alpha evidence. It freezes representation families, parameter families, causal clocks and residual-evidence gates before any new outcome inspection.

The canonical tracker currently has 12 active modules. The historical thirteenth module, D03-11 ROC, is retired into D03-02 because same-horizon percentage ROC is exactly `100 * retN`. The capability remains covered; it is not a thirteenth vote.

## TI-701 — one information root does not imply one formula, and different formulas do not imply independence

All active D03 modules descend primarily from `PRICE_OHLC`. Some also consume a derived volatility state or an indicator parent, but this does not create a new independent source.

Support for grouping:
- same-horizon return, percentage ROC, common Momentum index and log return are exact or monotonic aliases;
- moving averages, MACD and price-vs-MA all summarize overlapping weighted price histories;
- KD and RSI use different normalizations but both summarize recent price movement;
- divergence reuses both a price pivot and a base indicator already derived from that price path;
- multi-timeframe agreement reuses nested samples of the same price history.

Counterevidence / alternative explanation:
- two same-root transforms may retain different residual information because of path, range, volatility or horizon sensitivity;
- ADX uses directional movement and true range rather than return level alone;
- Bollinger width/position uses dispersion as well as location;
- KD range location and RSI signed gain/loss balance are not algebraic aliases.

Decision: different formulas justify a residual candidate, never automatic independent-vote status. Until common-support residual evidence survives the canonical gate, independence stays `SAME_ROOT_REDUNDANT`, `PARTIAL_OVERLAP` or `UNKNOWN`.

## TI-702 — frozen D03 representation and redundancy families

| D03 lane | Representation family | Redundancy group | Default independence | Independent-vote rule |
|---|---|---|---|---|
| D03-01 MA alignment/slope/state | weighted price level and trend geometry | `RG_D03_PRICE_TREND` | `SAME_ROOT_REDUNDANT` versus price trend/breakout until residual proof | within-family confirmation only |
| D03-02 ret5/20/60 + ROC alias | endpoint return / rank | `RG_D03_DIRECT_RETURN` | exact aliases are `SAME_ROOT_REDUNDANT`; different horizons are `PARTIAL_OVERLAP` | one horizon family, no alias stacking |
| D03-03 trend persistence | pre-decision path quality | `RG_D03_PATH_PERSISTENCE` | `PARTIAL_OVERLAP` with returns/trend | residual candidate after retN, trend and path-efficiency controls |
| D03-04 momentum continuation | post-decision transition/outcome relation | `RG_D03_OUTCOME_RELATION` | not a contemporaneous vote | predictor/outcome relation only |
| D03-05 pullback/reversal | causal price episode | `RG_D03_REVERSAL_EPISODE` | `PARTIAL_OVERLAP` with D01 geometry and D03 trend | episode state, not generic extra reversal vote |
| D03-06 KD | rolling-range location and smoothing | `RG_D03_OSCILLATOR` | `PARTIAL_OVERLAP` with RSI/returns/range | residual candidate only |
| D03-07 RSI | signed gain/loss balance and smoothing | `RG_D03_OSCILLATOR` | `PARTIAL_OVERLAP` with KD/returns | residual candidate only |
| D03-08 MACD | fast/slow EMA spread and signal smoothing | `RG_D03_PRICE_TREND` | `SAME_ROOT_REDUNDANT` with EMA trend unless residual proof | no EMA + MACD double vote |
| D03-09 ADX | directional-movement / true-range trend quality | `RG_D03_DIRECTIONAL_RANGE` | `PARTIAL_OVERLAP` with trend/volatility | residual candidate after trend and volatility controls |
| D03-10 Bollinger Bands | moving location plus dispersion envelope | `RG_D03_VOLATILITY_ENVELOPE` | `PARTIAL_OVERLAP` with MA and D04 volatility | position/width components tested separately; no extra vote by default |
| D03-12 divergence | price pivot versus base-indicator pivot relation | inherits base group + `RG_D03_REVERSAL_EPISODE` | `PARTIAL_OVERLAP`; missing parent lineage => `UNKNOWN` | episode diagnostic only until causal-clock and residual proof |
| D03-13 multi-timeframe conflict | nested-horizon state comparison | `RG_D03_MULTI_HORIZON_VIEW` | `SAME_ROOT_REDUNDANT` if treated as multiple votes | one conflict state, never one vote per timeframe |

Cross-domain rule: D01 pattern/breakout and D03 price-trend signals start in one `PRICE_OHLC` evidence family. D02 may become a residual candidate only for verified `VOLUME_TURNOVER` contribution beyond price-only controls. D04 volatility context may condition D03 but may not be re-counted as a new D03 vote.

## TI-703 — parameter-family ledger is frozen before outcomes

Canonical baseline families:
- direct returns: 5, 20 and 60 eligible sessions;
- SMA family: existing canonical 5/10/20/60/120 definitions;
- System 2 EMA resonance family: existing canonical EMA16/EMA64 definitions;
- MACD, KD, RSI, ADX and Bollinger: use the exact already-versioned repository formula/parameter contract; changing a window, smoother, warm-up, price field, seed or threshold creates a new `factorVersion` inside the same `parameterFamilyId`;
- divergence: base-indicator version + pivot scale + confirmation rule form one inseparable parameter family;
- multi-timeframe: Weekly, Daily and M15 finality/coverage contract form one preregistered family.

No best-looking window may be selected after viewing outcomes. Every explored parameterization consumes the same experiment-family budget. Cosmetic renaming, percentile conversion, sign inversion, affine transform or monotonic transform does not create a new family.

Required experiment fields before outcome access:
`experimentId`, `parameterFamilyId`, `factorVersion`, frozen candidate set, primary baseline, primary outcome/horizon, multiplicity method, stop rule and holdout identity.

## TI-704 — residual incrementality gate

A D03 signal may claim `RESIDUAL_INCREMENTAL_PROVEN` only after all applicable checks pass:
1. exact alias and same-horizon direct-return controls;
2. direct price/trend/structure controls;
3. D01 pattern and D02 price-only controls on common support;
4. D04 volatility and D18 Regime controls where applicable;
5. PIT clocks, no look-ahead, corporate-action continuity, suspension and price-limit guards;
6. purged OOS or prospective Shadow evidence under a frozen experiment family;
7. walk-forward stability, date-cluster/dependence-aware inference and multiple-testing correction;
8. turnover, transaction-cost and fillability analysis;
9. raw signal count versus deduplicated evidence-family count and rank/Top6 sensitivity;
10. D16 incrementality readback and 00 cross-domain closure.

Correlation below one, different formula names, different module IDs or different owning rooms are explicitly insufficient.

## TI-705 — failure modes and falsifiers

The anti-double-count hypothesis is falsified only if a candidate adds stable out-of-sample information after its strongest same-root baseline and all shared parents are controlled.

Expected failure markets / states:
- choppy mean-reverting paths can make trend and MACD agreement jointly wrong;
- price-limit, suspension and stale-price periods can create artificial persistence or oscillator extremes;
- corporate actions can create false return, ROC, MA, MACD and divergence events;
- low-price tick discreteness can inflate zero-return ratios and oscillator states;
- volatility shocks can make Bollinger/ADX appear incremental when they merely proxy D04 state;
- nested Weekly/Daily/M15 observations can create pseudo-confirmation from one move;
- parameter searches can select a winner that disappears after family-wise correction.

Alternative explanations must be retained: market/sector exposure, volatility state, liquidity/tick effects, event shocks, D01 geometry and D02 participation. Missing controls remain `UNKNOWN`, never zero or negative evidence.

## TI-706 — machine lineage and fail-closed behavior

The companion registry is `research/d03_indicator_lineage_registry_20261005_v0_1.json`.

Every factor record carries the canonical minimum lineage fields. Missing lineage, an unknown representation family or an unregistered parameter version fails closed to `UNKNOWN` and cannot increase `effectiveIndependentEvidenceCount`.

Raw indicator count and deduplicated evidence-family count must both be emitted. Duplicate factor registration, exact aliases and cosmetic/monotonic transforms must not increase `dedupedShadowScore`.

## TI-707 — deterministic fixture

`research/test_d03_indicator_lineage_registry_v0_1.mjs` verifies:
- every active D03 module is registered once;
- the retired ROC lane resolves to D03-02;
- required lineage fields are present;
- same-horizon retN/ROC/Momentum/log-return aliases collapse to one evidence family;
- EMA/MACD/trend records collapse under the shared price-trend group absent residual proof;
- missing lineage fails closed;
- duplicate registration cannot inflate the deduplicated count;
- multi-timeframe views cannot inflate evidence by timeframe count;
- Formal outputs are not read or mutated.

This fixture proves contract mechanics only. It does not prove Alpha.

## TI-708 — maturity and routing decision

This tranche completes the D03 semantic contract requested by SDA-001/SDA-004 and supplies a machine-readable Class A registry plus deterministic contract fixture.

It does not close either ticket. Remaining work:
- System 1/System 2 implement shared lineage/dedup Shadow diagnostics;
- D16 performs common-support residual, multiple-testing and OOS readback;
- 00 performs cross-domain closure;
- any use of deduplicated scoring in Formal ranking remains Class C and owner-only.

D03 remains 56.7%. D03-09 remains L2/40. D03-10 remains L2/40. PR #600 remains owner-gated and is not modified by this tranche. Raw source gate remains 2/3. Outcome joins remain closed.

Current status:
`D03_LINEAGE_SEMANTIC_CONTRACT = FROZEN_V0_1`
`D03_ALIAS_PARAMETER_REGISTRY = CLASS_A_RESEARCH_READY`
`SDA_001 = REMEDIATION_IN_PROGRESS`
`SDA_004 = REMEDIATION_IN_PROGRESS`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

## Exact next continuation point

1. Protected path remains: owner approval is required before PR #600 merge/deploy; after approved deploy, wait for the first genuine cutoff-bearing Taiwan-session parent and run complete Bollinger v0.2 reconciliation before any maturity promotion.
2. Independent Class A path: hand this frozen D03 registry to System 1/System 2 for raw-vs-deduplicated Shadow diagnostics and deterministic alias/duplicate tests; D03 must review any mapping drift without changing Formal behavior.
3. D16 must preregister the parameter-family experiment budget and run common-support residual/OOS validation before any D03 factor receives independent-vote status.
4. ADX remains second behind Bollinger and still requires canonical FULL_REPLAY/trusted-state certification.

