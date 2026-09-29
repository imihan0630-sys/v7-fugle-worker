# D12-05 TAIWAN VIX checkpoint delta v0.1

Updated: 2026-09-29 05:14 Asia/Taipei
Status: RESEARCH_ONLY / EVIDENCE_PENDING
Formal Core: LOCKED

## Progress
- Official TAIFEX source audit confirms TAIWAN VIX is derived from TXO quotes and measures 30-day expected TAIEX volatility; it is not a directional forecast.
- Official disclosure is 09:00-13:45 during the regular session, every 15 seconds. A timestamped same-day official observation is therefore known before an 18:10 after-market research decision.
- Public official pages expose current/recent intraday and daily history. Longer official history from 2007 is available through the TAIFEX e-data shop under restricted paid-use terms. Prospective research should be attempted before creating any purchase dependency.
- D12-11 option liquidity is an upstream evidence-quality dependency for VIX/IV/skew/gamma. Daily chain best bid/ask supports coarse QA, but cannot reconstruct intraday quote continuity or depth.
- Friday-expiry TXO introduced in 2025 is a market-structure regime break. Expiry-family and quote-quality diagnostics remain rules-regime aware.
- Durable contract: research/d12_05_taiwan_vix_source_quality_spec_v0_1.json.
- D12-05 remains L2 / 40%. L3 is not justified until prospective/OOS Taiwan-date evidence proves incremental value beyond realized volatility and Taiwan Regime.

## Exact next continuation
1. Define a research-only prospective TAIWAN VIX receipt with official timestamp/value, capturedAt, knownAt, quality state and rules-regime version.
2. First target is risk prediction: next-session range, MAE and realized volatility; direction is secondary.
3. Compare VIX level/change/shock against ATR/realized volatility and Taiwan Regime before claiming increment.
4. Condition IV/skew/gamma evidence on D12-11 liquidity quality where observable; missing intraday quote evidence stays UNKNOWN.
5. No runtime or Formal change.
