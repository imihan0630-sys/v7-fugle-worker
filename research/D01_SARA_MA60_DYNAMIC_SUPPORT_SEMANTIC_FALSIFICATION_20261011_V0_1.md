# D01 Sara 金包銀 — current MA60 band vs true historical dynamic support (2026-10-11)

Status: CLASS_A_RESEARCH_ONLY / CAUSAL_SEMANTIC_FALSIFIER_PASS / PERFORMANCE_UNKNOWN
Owner: 01｜K線與型態研究室
Existing parent: research/D01_SARA_JINBAOYIN_CAUSAL_ORACLE_AND_D16_VALIDATION_FREEZE_20261010_V0_1.md
Companion source readiness: research/D01_SARA_60M_OFFICIAL_SOURCE_ADMISSION_READINESS_20261011_V0_1.md

## Frozen distinction

A previous 60-minute gold-wrapped-silver strict research proxy used last-five-bar ranges crossed with *the CURRENT* MA60 value at decision cutoff (with +/-2% as a preregistered research threshold). That is a causally computable "current-support-band proximity", but not proof of the distinct concept "a past bar touched its own MA60 at that past bar's close".

Freeze TWO separate read-only features:
- CURRENT_SUPPORT_BAND_PROXIMITY: any of final 5 bars overlaps a +/-2% band around the **decision-bar** MA60. May be useful as present-day range-relative placement.
- HISTORICAL_DYNAMIC_MA60_TOUCH: any of final 5 bars overlaps +/-2% around its **own bar-time** MA60 based solely on the 60 completed bars ending at that bar.

Both use PRICE_OHLC; they are not independent Alpha votes. If source coverage is not certified, output UNKNOWN rather than FALSE. This research-only comparison does NOT silently replace the frozen earlier strategy hypothesis, nor does it claim Sara's exact unpublished algorithm.

## Adversarial counterexamples frozen BEFORE outcomes

Build synthetic 65-bar price history, ordinary price level 100, and shift the last four bars to 150.
1. A prior support test occurred at index 60 near 100 before the 150 jump, while the current 60-MA climbed above the earlier bar range. HISTORICAL_DYNAMIC_MA60_TOUCH = true, CURRENT_SUPPORT_BAND_PROXIMITY = false.
2. Set index-60 bar at 104 instead. Its own MA60 remains around 100 and was not touched, yet the later MA60 rises near 103.4; CURRENT_SUPPORT_BAND_PROXIMITY = true, HISTORICAL_DYNAMIC_MA60_TOUCH = false.

These deliberately extreme synthetic paths demonstrate **semantic non-equivalence**, not that either rule has alpha. Additional tests ensure:
- chart-prefix invariance when future bars are appended without changing decision cutoff;
- no early MA60 computation with fewer than 65 observed bars for five-bar window;
- invalid OHLC and uncertified source cannot silently pass;
- fixed tolerance bound, no outcome-based after-the-fact threshold tuning;
- one PRICE_OHLC informationRoot and effectiveIndependentEvidenceCount=1.

## Implementation and native execution receipt

Files:
- research/d01_sara_support_touch_semantics_v0_1.mjs
- research/test_d01_sara_support_touch_semantics_v0_1.mjs
- research/d01_sara_ma60_support_native_test_receipt_20261011_v0_1.json

16 synthetic cases passed in isolated V8 evaluation **and** native Node.js v22.16.0 local execution.
- Observed native execution time: 2026-10-11 08:54:48 Asia/Taipei.
- 16/16 PASS, failures=0, process exit=0.
- Local source and test files were verified bit-for-bit against GitHub branch blob identities:
  source 968e48fded39d05071a1004496f4f8bc7e4eaeef
  test 0d4a864832babc644526601ccc733e98eb7d9419
- Native stdout 17 lines, sha256 891262830c3b96753b6281b9dc0879920e36747292f358b95091bb3c902348f9.
- Do not equate this native execution receipt with GitHub CI (none claimed), real 60-minute provider rows (none) or OOS return tests (not opened).

Important: Source data contract STILL PHYSICAL_NOT_RETURNED for the frozen 1101 / 2026-08-01..10-08 60m sample; the old 46 synthetic Sara test suite and new 21 source-admission suite still lack native execution/CI parity, though their isolated V8 tests passed.

## D16 future experiment routing

On common-support actual price bars with as-of vintage, compare both definitions within T prior-uptrend-pullback, B bottoming, M market-bull-only, N unknown. Freeze a per-episode disagreement table BEFORE returns:
- BOTH_TOUCH
- CURRENT_ONLY
- HISTORICAL_DYNAMIC_ONLY
- NEITHER_TOUCH
- UNKNOWN_BLOCKED

D16 should first report prevalence, dependence, denominator and source missingness. Then evaluate incremental predictive value only after explicit D16 preregistered OOS/prospective and cost/entry gate. Any difference must be residual beyond daily uptrend, baseline MA60 pullback, Formal A/B price ancestry, 120/240 overhead and broader sector/market state. No double reward from shared PRICE_OHLC.

## Exact next continuation

1. Preserve the official provider/bucket/firstKnownAt physical source blocker; obtain owner-certified 1101 60m real historical rows using authorized source lane, not production.
2. Native Node/CI verify earlier Sara 46-fixture and admission 21-fixture suites by exact source hash. This tranche only verified 16-fixture native suite.
3. Apply both support semantics to source-certified data WITHOUT outcome join; freeze disagreement opportunity denominator and failure/missingness states.
4. D16 to sign off formal proof boundaries; 00 independent audit for candidate readiness.
5. Mainline DL-147 and frozen physical 2021/1101 R1-R6 retain separate owner. D01 all 11 modules L3/60.0%; Alpha UNKNOWN. Formal Core LOCKED. No Worker, D1, monitor, scan, capital, ranking or push mutation.
