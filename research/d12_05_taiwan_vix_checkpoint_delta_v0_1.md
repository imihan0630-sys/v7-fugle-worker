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


## 2026-09-30 Class-A prospective receipt implementation

- No isolated VIX receipt implementation existed on latest main at the start of this run; only source/quality and VRP semantic contracts existed.
- Implemented `research/d12_05_taiwan_vix_receipt_v0_1.mjs` as a pure research-only builder over already-observed official source values.
- Integrated `TAIWAN_VIX` into the unified global receipt guard/schema.
- Adversarial deterministic Node test PASS:
  - valid official in-session 15-second observation accepted;
  - after-session timestamp rejected;
  - off-grid timestamp rejected;
  - nonpositive/NaN VIX rejected;
  - stale/halt and source-missing retained as NOT_CLEAN / UNKNOWN;
  - post-18:10 knownAt cannot contaminate the 18:10 decision;
  - receipt tampering detected by hash mismatch.
- The builder performs no network fetch, no scheduler action, no shared database write and no Formal behavior change. It remains Class A research infrastructure.
- No actual 2026-09-30 same-session VIX value existed at the 05:20 capture clock because the regular VIX publication session had not started; no value was fabricated.
- D12-05 remains L2 / 40%. L3 still requires actual PIT source receipts plus replay/source-quality evidence; L4 requires prospective/OOS outcome evidence.
- `FORMAL_OPTIMIZATION_CANDIDATE = NO`.

## Revised exact next continuation

1. Capture the next real official same-session VIX observation after the regular publication window is available and before the 18:10 decision.
2. Read back and verify hash/PIT eligibility; preserve stale/halt/missing states instead of replacing them.
3. Accumulate independent clean dates with outcomes closed.
4. Only after source coverage is adequate, compare VIX level/change/shock with D04 realized volatility/ATR/Taiwan Regime using the frozen redundancy order.
5. Keep long-history paid TAIFEX data optional until prospective evidence demonstrates enough incremental value to justify cost.
