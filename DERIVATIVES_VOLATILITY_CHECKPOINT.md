# Derivatives Information & Volatility Surface Checkpoint

Updated: 2026-09-29 10:13 Asia/Taipei
Current cursor: DR-001 through DR-066 complete.
Next: D12-08 prospective Gamma evidence + D12-10 18:10 NIGHT_PRE_SCAN prospective receipts.

## Durable conclusions

- Current main Worker source has no explicit PCR/VIX/implied-volatility/skew/futures-basis/OI/foreign-futures layer; this is genuinely incremental.
- Derivatives should first be used as market/risk context, not direct stock-picking signals.
- Volume PCR and OI PCR are different. TAIFEX public TXO PCR aggregates weekly/monthly expiries and lacks trade-side/open-close/moneyness identity.
- Signed buyer-opening option flow in academic research is not equivalent to public aggregate PCR.
- Taiwan evidence is mixed: older work finds aggregate option volume uninformative but foreign options flow informative; 2025 research finds aggregate PCR useful for a Taiwan option-writing conditioning strategy and institutional PCR less useful in that setup.
- TAIEX VIX is volatility/risk pricing, not a directional forecast.
- Skew/smirk may contain tail-risk/information but also reflects insurance supply/demand and constraints.
- Surface construction materially affects IV/skew/VRP estimates; methodology must be frozen.
- Ex-post future realized variance cannot be used in a live VRP feature. Separate contemporaneous proxy from future outcome.
- Raw futures basis must be adjusted for rates/dividends/time to expiry before interpreting abnormal basis.
- Total OI is participation/risk transfer; it does not reveal net bulls versus bears.
- Foreign futures net short is hedge-confounded; combine change in net OI with cash/options/basis/volatility context.
- Option OI cannot be made directional without side/strike/expiry/Greek semantics.
- Expiry/settlement/night-session mechanics require separate regimes.
- First architecture separates Positioning / Volatility / Tail Risk / Participation / Mechanics / Data Quality.
- Formal Core remains LOCKED.

## Exact next continuation

DR-016 IV term structure.
DR-017 skew term structure.
DR-018 gamma/delta exposure limits.
DR-019 max-pain evidence audit.
DR-020 futures curve/roll.
DR-021 joint foreign cash/futures/options state.
DR-022 Taiwan price discovery/night-session literature.
DR-023 official data-source feasibility.
DR-024 minimal Shadow schema + falsification.


## DR-016 through DR-029 — concept convergence
- IV term structure and skew term structure are horizon-specific risk-price layers, not direct direction signals.
- Public OI cannot identify dealer GEX sign; unsigned gamma/OI concentration can be described, dealer hedge direction cannot be asserted without position-side assumptions.
- Academic expiration pinning is distinct from popular “max pain”; max-pain indicator rejected, expiry clustering mechanism retained.
- Front/next futures and fair-value-adjusted basis are required around roll/expiry.
- Foreign cash x futures x options is a joint exposure state; raw foreign net-short futures remain hedge-confounded.
- Taiwan futures/options contribute to price discovery; futures often lead but leadership varies with liquidity/mechanism. Night futures may add Taiwan-specific interpretation beyond global indices.
- TAIFEX official historical data feasibility is high for PCR, VIX, participant positions, futures and full option chains; robust IV surfaces still require a frozen inversion/filter/rate/dividend method.
- Minimal derivatives Shadow schema, prediction-target decomposition, macro-event IV guard, historical rules-regime segmentation and redundancy gate are frozen.
- Concept status: CONCEPT_COMPLETE / EVIDENCE_PENDING. Formal Core unchanged.

## Next lane
Portfolio & Risk Construction / Correlation Clusters.


## 2026-09-28 D12-08 Gamma identifiability deepening

- Curriculum reconciliation: D12-08 had remained L0 even though DR-018 already warned that public OI cannot identify Dealer GEX sign. DR-030..DR-034 now turn that warning into an explicit mechanism, source and falsification contract.
- Gamma sign is position-side semantics: long Call and long Put are positive Gamma; short Call and short Put are negative Gamma. Call-positive / Put-negative public GEX is an assumption scenario, not mathematics.
- TAIFEX option-chain data are strike/expiry-specific and support Gamma/OI concentration after model inputs are frozen.
- TAIFEX dealer-class Call/Put long/short OI is aggregate and is not publicly cross-tabulated by strike/expiry; exact option-market-maker signed GEX therefore remains NOT_IDENTIFIED.
- TAIFEX “long/short” for options is directional grouping: buy Call + sell Put are long; sell Call + buy Put are short. For Gamma, dealer Put-long grouping is short-option/negative-Gamma while dealer Put-short grouping is long-option/positive-Gamma.
- New defensible layer A: unsigned Gamma concentration by strike/expiry; it must be falsified against simpler OI-only concentration.
- New defensible layer B: partial-identification lower/upper bounds for TAIFEX reported dealer-class Gamma using aggregate dealer counts plus strike-expiry market-OI capacities. Sign is POSITIVE only if lower bound > 0, NEGATIVE only if upper bound < 0, otherwise UNKNOWN.
- “Gamma wall”, “zero Gamma” and “Gamma flip” are prohibited as factual labels unless a signed inventory model is explicit and validated. Large Gamma/OI nodes are hypotheses for expiry-conditioned dwell/reversal, not automatic support/resistance.
- Primary outcomes are volatility/range, reversal-vs-momentum and liquidity stress; direction is secondary.
- Research contract frozen at `research/d12_08_gamma_exposure_identifiability_spec_v0_1.json`.
- Maturity: D12-08 L0 -> L2. L3 remains blocked until prospective PIT same-date/session source receipts exist.
- Formal Core unchanged; no score, veto, risk throttle or ranking change.

## Exact next continuation

1. Prospective same-date/session TXO chain + institutional dealer aggregate reconciliation.
2. Research-only unsigned-Gamma and dealer-class-bound calculator.
3. Independent normal/expiry/event-date evidence before L3.
4. Continue D12-10 night futures/overnight information L1 -> L2 while evidence accumulates.


## 2026-09-28 D12-10 night-futures deepening

- D12-10 advances L1 -> L2.
- TAIFEX TX after-hours session is 15:00->05:00 and is attributed to the following regular trading session; expiring TX has no after-hours session on its last trading day.
- For the 18:10 Taiwan after-market selector, night data are partitioned into NIGHT_PRE_SCAN 15:00->18:10 (eligible if timestamped), NIGHT_POST_SCAN 18:10->05:00 (future), and NIGHT_FULL_SESSION (future-contaminated for 18:10).
- 2024 Taiwan evidence supports price continuity / international-information absorption but falsifies a universal night-up => day-up continuation rule.
- Higher-value candidate is Taiwan-specific night residual after same-window U.S. broad/tech/semiconductor futures controls, not raw direction.
- Public full-session daily night OHLC cannot reconstruct the 18:10 state. TAIFEX provides individual trades for the past 30 trading days; older transaction history requires application/purchase and no historical database API is provided.
- Preferred evidence route is prospective 18:10 capture; recent 30-day transaction data are for parser/replay QA.
- Machine-readable contract: `research/d12_10_night_futures_pit_spec_v0_1.json`.
- Formal Core unchanged; no score/veto/risk-throttle/ranking change.

## Updated exact next continuation

1. Prospectively capture TX 15:00->18:10 plus same-window broad/tech/semiconductor controls.
2. Validate exact contract/roll/session replay on recent transaction data.
3. Join scheduled U.S. macro-event flags from D13 before outcome tests.
4. Accumulate independent dates across normal, expiry/roll, event and crisis regimes before any L3 promotion.


## 2026-09-29 D12-05 VRP semantic deepening

- D12-05 remains L2 / 40%; no maturity inflation.
- Core correction frozen: TAIWAN VIX / implied variance is not itself the Variance Risk Premium (VRP).
- Separate five objects: option-implied variance; trailing past-only realized variance; future realized variance; a PIT implied-realized spread proxy; and ex-post variance premium.
- Future realized variance is an outcome/decomposition object and is forbidden as a live feature. A result that requires future realized variance at decision time is LOOK_AHEAD.
- A contemporaneous implied-minus-trailing-realized spread may be researched prospectively, but must not be called structural VRP unless the physical expected-variance model is validated.
- Literature supports different economic roles for expected variance versus variance premium and shows horizon/measurement sensitivity. International evidence is hypothesis support only; Taiwan transfer is not assumed.
- Taiwan validation order remains: ATR/realized volatility -> Taiwan Regime -> trend/residual RS -> breadth/liquidity -> VIX level/change/shock -> implied-realized spread proxy -> only later directional-return tests.
- Primary targets are risk outcomes first: next-session range, realized volatility, absolute gap, MAE and tail-loss incidence. Directional return is secondary.
- D12-11 option-liquidity quality is an upstream measurement dependency where observable; missing quote-quality evidence stays UNKNOWN.
- Overlapping-horizon inference, event/crisis clustering, date-shift placebo, leave-one-date/event-cluster-out and no outcome-selected window/threshold are mandatory.
- Durable contract: `research/d12_05_vrp_semantics_validation_spec_v0_1.json`.
- FORMAL_OPTIMIZATION_CANDIDATE = NO. Formal Core unchanged.

## Updated exact next continuation

1. Audit whether an isolated research-only prospective TAIWAN VIX receipt implementation already exists; if absent, freeze only the smallest Class-A capture boundary and do not touch shared/Formal runtime.
2. Do not create a paid-history dependency before prospective source/quality coverage proves useful.
3. Cross-link D12-05 with D04 realized-volatility states for a frozen, outcome-blind redundancy design.
4. Resume D12-10 `NIGHT_PRE_SCAN` prospective receipt work so implied-risk state and after-hours absorption can later be tested jointly on independent dates.


## 2026-09-30 prospective receipt implementation / PIT firewall

- Re-read latest main before implementation. D12-05 and D12-10 remain L2 / 40%; no maturity inflation.
- Implemented isolated Class-A research guard:
  - `research/global_market_receipt_guard_v0_1.mjs`
  - unified family list now includes `TAIWAN_VIX`
  - rejects future-known receipts, unknown latency/entitlement marked PIT-eligible, missing-as-clean, timestamp inversions and tampered receipt hashes.
- Guard deterministic/adversarial suite had already passed before the VIX extension; VIX integration exposed and corrected a schema-family mismatch before any live source wiring.
- Implemented isolated TAIWAN VIX receipt builder:
  - `research/d12_05_taiwan_vix_receipt_v0_1.mjs`
  - `research/test_d12_05_taiwan_vix_receipt_v0_1.mjs`
  - local Node adversarial suite PASS.
- VIX receipt guards:
  - official 09:00-13:45 Taipei publication window;
  - official 15-second grid;
  - finite positive VIX only for `VIX_VALID_OFFICIAL`;
  - stale/halt/source-missing => NOT_CLEAN / UNKNOWN;
  - after-decision capture cannot be used for the 18:10 decision;
  - directional interpretation explicitly PROHIBITED.
- Implemented isolated TX night-pre-scan receipt builder:
  - `research/d12_10_night_pre_scan_receipt_v0_1.mjs`
  - `research/test_d12_10_night_pre_scan_receipt_v0_1.mjs`
  - local Node adversarial suite PASS.
- NIGHT_PRE_SCAN guards:
  - exact 15:00 Taipei window start;
  - observedAt cannot exceed 18:10;
  - sourceSessionDate is mandatory because TAIFEX attributes after-hours trades to the following regular session;
  - expiring TX last-trading-day after-hours receipt is rejected;
  - contract month / DTE / roll metadata mandatory for clean receipts;
  - OHLC/volume/trade-count geometry checked;
  - full-night use at 18:10 explicitly PROHIBITED.
- This is source/PIT infrastructure evidence only. No return, MAE, MFE, gap, selection hit-rate or trading outcome was inspected.
- Formal Core remains LOCKED. `FORMAL_OPTIMIZATION_CANDIDATE = NO`.

## Updated exact next continuation

1. On the next eligible Taiwan regular session, capture one actual official TAIWAN VIX receipt before the 18:10 decision and read it back through the guard.
2. On the same selection date, capture TX `NIGHT_PRE_SCAN` only from source transactions available through/before 18:10; never append later full-night fields to the same first-known receipt.
3. Accumulate independent clean dates; first evaluate source coverage/missing/stale/roll/event-regime quality with outcomes CLOSED.
4. Cross-link D12-05 to D04 realized-volatility states only after both raw parent receipts are PIT/replay complete; VIX must beat ATR/realized-volatility/Regime before any incremental claim.
5. Cross-link D12-10 to same-window global controls only after their provider entitlement/latency contracts are frozen.
6. No L3 promotion until actual Taiwan-date PIT receipts exist and replay verification passes; no L4 before prospective/OOS outcome evidence.


## 2026-10-02 strict-source audit and NFP night-session design (DR-047–DR-050)

- DR-047: existing VIX and TX NIGHT_PRE_SCAN Class-A builders remain **implementation artifacts**, not validated live source parents. The latest room checkpoint did not contain 2026-09-30 or 2026-10-01 authenticated live 18:10 VIX/TX receipts; neither historical official pages nor later full-night OHLC can be backdated.
- DR-048: global source-attestation guard V0.1 now also requires authorized raw provider-response bytes, responseCompletedAt, archive readback, license, capturedAt >= completedAt and knownAt >= completedAt. The last condition is intentionally conservative; an arbitrary provider-native availability flag cannot allow backdating. Thirteen adversarial synthetic tests PASS.
- DR-049: at Taiwan 2026-10-02 18:10, BLS September Employment Situation release scheduled 20:30 remains FUTURE realization. Separate pre-scan TX window (15:00–18:10) from event-reaction TX window (after 20:30) and eventual next Taiwan session. Do not count later US/TX response as an 18:10 predictor.
- DR-050: Friday release studies need matched non-release Fridays, elapsed-weekend/holiday equivalence, D04 ATR/realized-vol controls, D12-05 VIX and TX expiry/roll separation before making volatility or next-gap risk claims. See `research/d12_d13_20261002_nfp_event_clock_falsification_v0_1.md`.

**D12-05 and D12-10 remain L2 / 40%. Formal Core LOCKED; outcome join CLOSED.**

## Exact next continuation after DR-050

1. Run the pure source attestation check alongside unified receipt guard on the first *actual* authorized TAIFEX VIX and 15:00–18:10 TX source-response archives.
2. Record failure/missing as UNKNOWN, not zero. No strict clean date before independently replayable parent evidence.
3. Keep later 20:30 NFP event response a separate future object. Accumulate independent dates before any risk/incremental tests.


## 2026-10-02 evening continuation — D12 curriculum reconciliation + TAIFEX source lanes

- Current time window was post-18:10 and pre-20:30 Employment Situation release. No retrospective 18:10 VIX/TX parent was fabricated.
- BLS official CPS page was still in pre-release state at ~19:55 Taipei: September 2026 Employment Situation remained the next release, scheduled 2026-10-02 08:30 ET. This is post-decision event-clock QA only.
- TAIFEX public VIX statistical page exposed date rows for 2026/10/02 and 2026/10/01, but the audited text/JSON extraction did not expose numeric VIX cells. Numeric current-session VIX therefore remains NOT_EXTRACTED under this path.
- TAIFEX live Market Information System redirected to its disclaimer under the audited fetch path. The disclaimer reserves rights in market-price/site content and describes prior written-consent requirements for specified uses. Result: live MIS automated/non-display capture is NOT_AUTHORIZED_BY_THIS_AUDIT. Do not scrape it.
- Post-decision/pre-release QA artifact: `research/d12_d13_20261002_postdecision_prerelease_source_qa_v0_1.json`.

### Expanded D12 curriculum reconciliation
New D12-13..16 modules were created as L0 during the curriculum expansion, but existing D12 research already contained material mechanism/counterevidence. DR-051..DR-059 reconcile rather than invent history:
- D12-13 Greeks: L0 -> L2.
- D12-14 IV-RV Spread: L0 -> L2.
- D12-15 VRP: L0 -> L2.
- D12-16 Volatility Surface/Smile: L0 -> L2.

Dedicated machine contract:
`research/d12_13_16_greeks_vrp_surface_semantics_spec_v0_1.json`.

Key frozen guards:
- Delta is sensitivity/hedge ratio, not probability/direction.
- Gamma sign is position-side; positive Gamma is not bullish.
- Vega/Theta units and DTE/model clock are part of feature identity.
- IV-minus-trailing-RV, forecast-based implied-realized spread and ex-post implied-minus-future-RV are different objects.
- Structural VRP is risk-neutral expected variance minus physical expected variance under the project sign convention; ex-post future RV is outcome.
- Surface method/quote filters/interpolation/arbitrage constraints are part of feature identity.
- Complex Greek/VRP/surface factors must beat simpler VIX, realized-vol, skew, moneyness/DTE/OI/liquidity baselines.

### TAIFEX official replay source feasibility
- TAIFEX official option daily report exposes contract/month/date, strike, Call/Put, OHLC/last/settlement, volume, OI, best bid/ask and historical high/low.
- Daily historical download supports bounded date queries and annual ZIP history; after-hours rows retain following-session attribution semantics.
- TAIFEX also publishes recent individual option trades for the previous 30 trading days in CSV/RPT (excluding block trades per page note).
- These sources are materially useful for EOD parser/surface/replay QA, but current historical completeness does NOT prove historical 18:10 first-known availability.
- Frozen source contract: `research/d12_taifex_option_chain_replay_source_feasibility_v0_1.json`.

### Maturity / governance
- Expanded D12 is now 40.0% across 16 modules after curriculum reconciliation.
- No D12-13..16 module advances to L3.
- Live source entitlement and strict source-attested Taiwan option-chain dates remain missing.
- No outcome join was opened.
- Formal Core remains LOCKED; no FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation after DR-059

1. Acquire one permitted TAIFEX historical/statistical option-chain raw file for **replay QA only**; preserve raw source identity and do not claim first-known.
2. Freeze exact file-header/schema mapping and implement a pure Class-A row parser/quality validator with adversarial fixtures.
3. Freeze Surface Method V0.1 with quote filters, no-static-arbitrage checks and method-version receipts.
4. Compare simple D12-07 skew/term structure against D12-16 level/slope/curvature on the same parent rows before any outcomes.
5. Keep live TAIWAN VIX/TX automation blocked until an explicit authorized data path exists.
6. Continue accumulating true source-attested decision dates; no L3/OOS/optimization before coverage/replay gates pass.


## 2026-10-03 continuation — Delta publication clocks, Surface QA and D12-17 parity

- DR-060..DR-063 freeze TAIFEX Daily Delta semantics:
  - official page updates about 06:45 / 14:30 / 16:30;
  - 06:45 = current business-day tradable series including newly listed;
  - 14:30/16:30 = next-business-day Delta and exclude next-day newly listed series;
  - publicationDate, publicationVersion and effectiveTradingDate must be separate.
- Official TAIFEX page currently shows the 2026-10-02 Delta-file generation time as 16:39:28, before the 18:10 selector. This materially supports next-session 18:10 clock feasibility but a later retrieval is not strict first-known/raw-source attestation.
- TAIFEX Delta is a theoretical hedge ratio/model state, not direction/probability/sentiment. Own-computed Greeks must first explain differences through model inputs/clock/source before any predictive interpretation.
- Machine contract: `research/d12_13_taifex_daily_delta_clock_semantics_v0_1.json`.
- DR-064 freezes Surface Method V0.1:
  - primary two-sided positive bid/ask midpoint only;
  - no silent settlement/last fallback;
  - zero bid/one-sided/crossed quotes excluded/rejected from primary fit;
  - no primary extrapolation beyond clean strike hull;
  - method identity and static-arbitrage/coverage metrics required.
- Implemented isolated normalized-row validator:
  - `research/d12_option_row_validator_v0_1.mjs`
  - `research/test_d12_option_row_validator_v0_1.mjs`
  - local Node execution PASS: 10 adversarial assertions (clean quote, zero-bid exclusion, crossed quote, negative strike, Call monotonicity, monotonic violation, convexity violation, duplicate series, Put monotonicity, expired row).
  - Synthetic tests = method/data-quality evidence only, not Taiwan market/OOS evidence.
- DR-065..066 complete D12-17 parity/synthetics:
  - TXO is European and cash-settled.
  - Long Call - Long Put is forward-like expiry payoff under same strike/expiry/carry convention; it is not automatic economic equivalence to owning Taiwan cash equities.
  - Mid-quote parity deviations are first data-quality/liquidity diagnostics, not free arbitrage.
  - After-hours parity requires explicit futures/forward convention because cash index is not live.
- D12-17 advances L0 -> L2 / 40% for mechanism+falsification only.
- D12 across 17 modules recomputes to 40.0%.
- D12-13 and D12-16 remain L2; no strict raw multi-date PIT option/surface evidence for L3.
- Formal Core remains LOCKED. Outcomes remain CLOSED. No FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation after DR-066

1. Obtain one permitted official TAIFEX raw option-chain parent for replay QA and freeze its exact raw headers/source hash; do not call it historical 18:10 first-known.
2. Parse the identical parent into simple skew/term structure, Surface Method V0.1 and parity-quality metrics.
3. Preserve TAIFEX official Delta separately with publication/effective-date version lineage; compare own-computed Delta outcome-blind.
4. Audit 14:30 -> 16:30 -> next-day 06:45 Delta universe/version changes, with new-series additions separated from numeric revisions.
5. Only after source-attested independent dates exist, preregister outcomes and consider L3. Live MIS automation stays blocked unless explicitly authorized.


## 2026-10-04 source-lineage deepening — DR-067..DR-069
- DR-067: TAIFEX Daily Delta afternoon versions are next-business-day parameters. A pre-18:10 generation timestamp does not make them current-session market-state evidence. Publication time, publication version and effective trading date remain separate.
- DR-068: TAIFEX participant Call/Put buy/sell/OI aggregates plus series-level Delta do not identify strike-expiry-position-side dealer inventory. Exact signed dealer GEX remains NOT_IDENTIFIED; no gamma-wall/zero-gamma directional promotion.
- DR-069: official daily/annual option-chain downloads strengthen parser/contract/roll/session replay feasibility, including following-session attribution and scheduled expiry metadata, but historical download is not historical first-known 18:10 evidence.
- Durable evidence: `research/d12_d13_source_lineage_deepening_20261004_v0_1.md`.
- Maturity unchanged: D12 40.0%; no L3. Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation after DR-069
1. Acquire one permitted raw TAIFEX option-chain parent for parser/schema QA and preserve source identity.
2. Keep historical replay QA separate from live first-known evidence.
3. Pursue actual authorized 18:10 parent receipts prospectively; missing stays UNKNOWN.
4. No dealer-GEX sign claim without strike-expiry-position-side identification.


## 2026-10-04 Room09 continuation — DR-070..DR-073 TAIFEX historical schema / 18:10 firewall

Status: RESEARCH_ONLY / SOURCE_QA / OUTCOMES_CLOSED / NO_PROMOTION.
Durable evidence: `research/d12_d13_source_clock_continuation_20261004_v0_1.md`.

- DR-070: Official TAIFEX option daily market data materially covers contract, expiry month/week, contract-expiration-date under the post-2025-12-08 schema, strike, Call/Put, OHLC/last, settlement, after-hours/regular/total volume, OI, last best bid/ask and historical high/low. This is sufficient to freeze parser/schema and same-parent replay-QA contracts.
- DR-071: TAIFEX historical download semantics require date-versioned parsing. Historical daily download supports bounded ranges and annual archives, after-hours belongs to the following regular-session date, price-change fields changed historically, and contract-expiration-date was added from 2025-12-08. Older-schema field absence is not BAD/zero.
- DR-072: Historical daily/end-state rows cannot reconstruct a historical 18:10 option state. Last-best-bid/ask is not an intraday quote path/depth book and settlement is not an 18:10 contemporaneous value. Historical replay QA stays separate from first-known PIT evidence; D12 intraday surface/microstructure remains UNKNOWN without contemporaneous authorized raw receipts.
- DR-073: Simple skew/term, Surface Method V0.1, parity diagnostics and own-computed Greeks must use the identical parent rows/session/date/version for outcome-blind comparison. Official TAIFEX Delta remains a separate publication/effective-date object.
- Maturity unchanged: D12 40.0%; no L3 promotion. Outcomes CLOSED; Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE=NONE.

### Exact next continuation after DR-073
1. Acquire one permitted raw TAIFEX option-chain parent and preserve exact source identity/hash for parser/schema replay QA.
2. Parse the identical parent into simple skew/term, Surface Method V0.1 and parity-quality metrics.
3. Keep historical replay QA separate from prospective 18:10 first-known receipts.
4. Pursue authorized prospective 18:10 source-attested receipts; no L3 before independent PIT-clean dates and replay verification.


## 2026-10-04 DR-070..DR-071
- DR-070: TAIFEX Delta 06:45 is current-day; 14:30/16:30 is next-business-day effective. Publication time and effective trading date remain separate.
- DR-071: series Greeks plus participant aggregate Call/Put positions do not identify strike-expiry-position-side dealer inventory. Signed dealer GEX remains UNKNOWN.
- Evidence: `research/d12_d13_vintage_regime_audit_20261004_v0_1.md`.
- Maturity unchanged: D12 40.0%, L2. Outcomes CLOSED; Formal Core LOCKED.
- Exact next: permitted raw TAIFEX option-chain parent with publication/effective/session identities; independent source-attested PIT dates required before L3.


## 00 routed H11 exact remaining delta — 2026-10-04

H11 (D12-07 vs D12-16) has been accepted as PARTIAL_EVIDENCE_RECEIVED.

Do not redo theory, quote-quality, Surface Method V0.1, no-static-arbitrage or source-clock research.

Exact remaining H11 delta:
1. obtain one permitted raw TAIFEX option-chain parent with preserved source identity/hash;
2. parse D12-07 simple skew/term and D12-16 complex surface from identical parent rows/common-support;
3. test D12-16 residual structure after D12-07 controls;
4. record real divergent states, coverage/fit/interpolation quality;
5. return terminal KEEP_SEPARATE / SCOPE_DEDUP_ONLY / MERGE_ELIGIBLE / EVIDENCE_INSUFFICIENT.

This routed governance delta does not override the room's existing active source-acquisition sequence; it is aligned with that sequence.


## 2026-10-04 Room09 continuation — DR-074..DR-078 official public route / H11 evidence-object firewall

Status: RESEARCH_ONLY / SOURCE_QA / OUTCOMES_CLOSED / NO_PROMOTION.
Durable evidence: `research/d12_d13_public_source_lineage_20261004_v0_1.md`.

- DR-074: TAIFEX official option time-and-sales offers RPT/CSV, but current official English and Chinese page crawls disagree on the displayed 2026-10-02 issued time. Do not select a timestamp by convenience; bind issuedAt to page/language/version/observedAt/source receipt before using it as a PIT clock.
- DR-075: TAIFEX OpenAPI Swagger confirms GET `/OptionsTimeAndSalesData`. Direct public access is reachable but the current extraction path stops at CONTENT_TOO_LARGE, so source route is confirmed while raw rows/schema/history semantics remain NOT_MATERIALIZED in this run.
- DR-076: time-and-sales and quote/surface parents are distinct evidence objects. Trade rows can validate contract/date/time/price/size/session replay but cannot silently replace contemporaneous bid/ask/common-support evidence required by D12-07/D12-16.
- DR-077: H11 raw-parent preservation must respect redistribution/license boundaries. Default durable pattern: public source identity + retrieval clock + hash + schema summary + parser version in GitHub; raw bytes only in authorized storage if permitted. Degraded/reconstructed bytes cannot be labeled original.
- DR-078: H11 remains PARTIAL_EVIDENCE_RECEIVED. Raw quote-chain parent, identical-parent skew-vs-surface residual comparison, real divergent states and prospective 18:10 source-attested dates remain pending.
- Tooling note: interactive CSV click automation did not start because the external automation wallet lacked balance. No retry was made; this is TOOLING_BLOCKED, not SOURCE_ABSENT.
- Maturity unchanged: D12 40.0%; no L3. Outcomes CLOSED; Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE=NONE.

### Exact next continuation after DR-078
1. Audit TAIFEX OpenAPI `/OptionsTimeAndSalesData` through a bounded authorized route and preserve one raw parent/hash without public redistribution.
2. Freeze actual row schema/date/session semantics from the materialized parent.
3. Obtain a permitted quote-chain parent and run H11 identical-parent/common-support D12-07 vs D12-16 comparison.
4. Record divergent states, fit/coverage/interpolation quality and return KEEP_SEPARATE / SCOPE_DEDUP_ONLY / MERGE_ELIGIBLE / EVIDENCE_INSUFFICIENT.
5. Keep historical replay separate from prospective 18:10 first-known evidence.
