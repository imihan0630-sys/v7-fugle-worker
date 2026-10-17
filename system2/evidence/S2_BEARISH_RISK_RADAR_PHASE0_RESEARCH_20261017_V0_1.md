# System 2｜多空架構 Phase 0 — 空頭風險雷達（Research-only）

Date: 2026-10-17 Asia/Taipei  
Status: **Class A source-injected research observer, NOT a new authorized trading/selection strategy**  
Canonical: latest GitHub `main`. System 1 V8 Formal Core, System 2 current strategy versions, actual PIT admission, Shadow, Frozen, money orders and Cloudflare Worker/Cron are untouched.

## Owner direction and scope

Owner agreed to evaluating and moving toward **bullish selection + bearish risk radar + separate executable-short eligibility + cash/no-trade regime**. Phase 0 here implements only **BEARISH_RISK_RADAR_V0.1-RESEARCH-OBSERVATION** as a new completely isolated read-only research module; no production routing, auto pushes, changed top lists or capital deployment.

**Important naming:** existing `SHORT_MOMENTUM` in `strategy_contracts_v0_1.mjs` means *short-term momentum*, NOT short-selling. Do not invert `SHORT_MOMENTUM` or alter its factors. This module does not register an owner-approved versioned short strategy.

## Inputs and state semantics

Pure BUILD consumer `system2/runtime/bearish_risk_radar_research_v0_1.mjs` reuses **already existing A1 history factor bundle** from `a1_history_primitives_v0_1.mjs`, a separately source-labeled original body hash, origin/cut clocks, a *source-reviewed* company-action exposure indication, and unweighted upper-level market Regime. This is a provenance check on producer **claims**, **NOT** an independent audit of provider bytes. Missing/late source or inconsistent market/ticker, factor bundle SHA, official 61-session sequence, known material dividend with unadjusted price, or unknown event exposure ⇒ `DATA_BLOCKED`.

Even `SOURCE_REVIEWED_NO_KNOWN_MATERIAL_EVENT` means only **preview working hypothesis** and explicitly never proves authoritative `NO_EVENT`. Real 2330 2026-10-16 with 2026-09-16 ex-dividend is hard-blocked even if a source wrongly claims no event. No 61-session adjusted OHLC is synthesized from the official one-day reference comparison.

| Diagnostic state | Meaning | Not permitted |
|---|---|---|
| `DATA_BLOCKED` | data/clock, relevant CA, price-space or mandatory factor unknown | short signal, rank, formal PIT |
| `BEARISH_WATCH_RESEARCH_ONLY` | one or more source-observed bearish relational hypotheses | tradable short |
| `BEARISH_CONFLUENCE_RESEARCH_ONLY` | downward MA/20-return structure + close below prior20 low + selling volume above prior20 baseline | promotion to eligible short without borrow/cost/pit |
| `CONTRADICTED_BY_BULLISH_TREND` | bullish MA momentum contradicts short hypothesis | treating absence of bullish as short evidence |
| `NO_CURRENT_BEARISH_RELATIONAL_PATTERN` | no evidence for current hypothesis | declare zero picks |

Research relations, not tuned trade triggers:
- ma5 below ma20, ma20 slope negative, ret20 negative and close below ma20;
- close below **prior** 20-session low, avoiding same-bar lookahead;
- current close below previous close while volume above the **previous** 20-session mean (relative volume above natural 1 reference);
- opposing bullish MA alignment + positive ret20 negates simplistic inverse long;
- `RISK_ON/RECOVERY` warns of short squeeze, `PANIC/HIGH_VOLATILITY` warns of violent reversal; unknown regime stays explicitly unverified.

**No scores, numeric weights, rank, top picks or trade size.** Market regime remains upper-layer context, not a numerical add-on.

## Four isolated abilities, not one all-powerful short flag

1. **Current LONG selection:** unchanged independent System 2 strategies, formal PIT held as-is.
2. **BEARISH_RISK_RADAR:** this non-executable research-only source-bound hypothesis, can separately inform a later risk-overlay candidate only after validation.
3. **SHORT_ELIGIBILITY / SHORT_SHADOW:** **not implemented**. Separate future verified borrow/locate, issuer eligibility, suspension, restricted sale/cover clock, recalls, corporate-action obligations, borrow fee, price-limit execution, liquidity, no-favorable-fill ambiguity. A bearish observation never implies a real share is shortable or even borrowable.
4. **NO_TRADE/CASH:** retained as an explicit valid research outcome for risk-off/PIT-unknown/poor expectancy, not an obligatory bearish trade. Real capital allocation/notifications need owner Class B/C authorization.

## What this step actually delivers

- Pure runtime module and signed diagnostic research receipt with `rank=null`, `selectedCount=null`, `zeroPickDay=null`, `recommendationToShort=false`, `shortEligible=false`, `borrowLocateVerified=false`, `formalPITAEligible=false`, `shortShadowAuthorized=false`, `frozenD1Written=false`.
- Deterministic adversarial tests: downward confluence **synthetic only**, bullish refutation, real **2330 hardcoded known event crossing source**, unknown CA negative, future availability, wrong market, producer hash mutation, and never touching System1/Worker/D1/order execution.
- No real bearish stock recommendations, no end-of-day market scan, no historical performance. The test fixture is synthetic; passing tests cannot be represented as physical daily-selection or PIT readiness.
- All real FACTOR/PIT/CA evidence belongs to DATA/AUDIT; BUILD does not regenerate issuer originals.

## Next gates

**P1:** independent source-bound as-of factor and relevant company action auditing, real current-day universe source coverage/denominator with PIT certified subset, and a candidate short risk radar that can be replayed across distinct Regimes without introducing outcome leakage.

**P2:** market-specific shortable universe, current borrowable lot inventory and locate receipt, fees and forced buy-in / recall, margin/collateral, trading price limits, extraordinary suspension/restart and T+ execution; evaluate multiple short strategies separately.

**P3:** preregister shorts (e.g. breakdown, failed breakout, industry downcycle, negative event), PIT/OOS/Forward, costs, gap/limit/same-bar ambiguous, short squeeze tail risk and overall portfolio diversification; owner reviews measurable net expectancy before ranking, Shadow/Frozen, push or order activation.

No numerical alpha, win rate, Sharpe or drawdown gains are asserted. No action authorizes System1 Formal Core changes.
