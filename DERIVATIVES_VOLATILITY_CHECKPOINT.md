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


## 2026-10-04 Room09 continuation — DR-079..DR-081 real TXO parent/hash and session-quality evidence

Status: RESEARCH_ONLY / CLASS_A_SOURCE_QA / OUTCOMES_CLOSED / NO_PROMOTION.
Durable evidence: `research/d12_d13_native_parent_revision_lineage_20261004_v0_1.md`.

- DR-079: A real official TAIFEX TXO daily historical parent for 2026-10-02 was fetched through an isolated read-only GitHub Actions workflow. Source=`https://www.taifex.com.tw/cht/3/optDataDown`, raw bytes=567,774, SHA-256=`61574590f9c8a1c882616f89090d39cbd44e00a91bd93055ff046ff4ab287c2a`, strict CP950 decode PASS. 6,086 rows were observed, all TXO/2026-10-02. Raw bytes were not committed.
- DR-080: Under frozen Surface Method V0.1 midpoint eligibility, 3,337/6,086 rows are usable two-sided quotes (54.8308%). Regular session has 2,957 eligible midpoint rows and 247 missing-side rows; after-hours has only 380 eligible midpoint rows and 2,502 missing-side rows. Same strike/expiry/session eligible Call-Put common support totals 1,411 pairs, of which 1,355 are regular and 56 after-hours. This falsifies treating regular and after-hours quote quality as interchangeable.
- DR-081: The real raw-parent/hash gate for replay QA is now materially passed, but H11 is not terminal. The identical-parent simple-skew/term vs complex-surface residual comparison, parity/forward identity and real divergent-state audit remain pending. This historical parent is later-retrieved EOD evidence and does not satisfy prospective 18:10 PIT evidence.
- Formal Core LOCKED; outcomes CLOSED; D12 remains 40.0%; no L3; FORMAL_OPTIMIZATION_CANDIDATE=NONE.

### Exact next continuation after DR-081
1. On the same 2026-10-02 parent, run a source-only Put-Call parity/common-support audit.
2. Freeze a separately versioned parity-derived forward/discount-factor QA method before any IV surface computation.
3. If parity identity/coverage is defensible, compute D12-07 simple skew/term and D12-16 surface features from identical eligible rows/common support and record disagreement/coverage sensitivity.
4. Return the routed H11 terminal status only after real divergent states and quality diagnostics exist.
5. Keep historical replay separate from prospective 18:10 first-known evidence.


## 2026-10-04 Room09 continuation — DR-082..DR-085 real-parent parity falsification and futures cross-check

Status: RESEARCH_ONLY / SOURCE_QA / OUTCOMES_CLOSED / H11_PARTIAL.
Durable evidence: `research/d12_put_call_parity_real_parent_audit_20261004_v0_1.md`.

- DR-082: On the identical 2026-10-02 TXO parent, regular-session eligible Call/Put midpoint pairs were fit by expiry under `C-P=D*(F-K)`. Ten expiries had >=5 pairs; R2 values were very high (about 0.99795 to 0.9999996), but this alone is not economic validation.
- DR-083: Jointly estimated discount factors are internally inconsistent across nearby tenors. Same-day 202610F1 gives D=0.998404; five-day 202610W1 gives D=0.992995 with a simple calendar-day annualized diagnostic near 51%; 202610F2 also implies a much larger short-tenor rate than adjacent expiries. Exact annualization is not promoted because settlement-clock identity remains separately versioned. The robust conclusion is that asynchronous/stale daily last-best quotes make joint F+D estimation too fragile. `JOINT_PARITY_F_AND_D_PRIMARY=REJECTED_FOR_THIS_PARENT`.
- DR-084: A same-date official TX futures parent was fetched from `futDataDown`, bytes=2,128, SHA-256=`d41cc8c279d805a0ebb13c29f3ff757cdc78a35d7a2e13fc06be4b3f3aeb1834`. Monthly regular-session futures best-bid/ask midpoints align closely with parity-derived forward levels: 202610 +1.72 bp, 202611 -0.73 bp, 202612 -0.35 bp, 202703 +2.01 bp, 202706 +2.79 bp (parity F minus TX midpoint). Thus forward level is much more stable than the jointly inferred discount factor.
- DR-085: H11 method consequence: monthly-expiry replay should prefer same-expiry TX futures as the primary forward candidate, while the discount/risk-free convention must be independently frozen from an official source. Weekly expiries without same-expiry futures require a separately validated convention; do not reuse the rejected joint F+D estimator by default. High R2 cannot override source-clock/quote-synchronization diagnostics.
- TAIFEX official calculator states that European-option IV/theoretical pricing requires explicit spot, strike, risk-free rate, cash-dividend yield and maturity; it notes bank time-deposit or commercial-paper rates as examples of a risk-free-rate input. No rate source has yet been selected merely to complete the surface.
- D12 remains 40.0%; no L3. Formal Core LOCKED; outcomes CLOSED; FORMAL_OPTIMIZATION_CANDIDATE=NONE.

### Exact next continuation after DR-085
1. Freeze an official, decision-time-valid discount/risk-free-rate convention and exact expiry/settlement clock before solving IV.
2. Prefer same-expiry TX futures for monthly forward identity; retain parity F as QA cross-check.
3. Run the frozen IV solver on identical eligible 2026-10-02 monthly rows, preserving quote-quality flags.
4. Compute D12-07 simple skew/term first, then D12-16 surface level/slope/curvature on identical common support.
5. Record real divergent states and residual information before returning H11 terminal KEEP_SEPARATE / SCOPE_DEDUP_ONLY / MERGE_ELIGIBLE / EVIDENCE_INSUFFICIENT.


## 00 control-plane receipt — H04 merge-eligible owner gate

00｜研究總控室 accepted existing Room09 evidence as complete H04 specialist input.

Audit:
`shared-knowledge/CURRICULUM_H04_CONSOLIDATION_AUDIT_20261004_V0_1.md`.

Recommendation:
`MERGE_ELIGIBLE / D12-15_SURVIVOR / D12-14_CHILD_PROXY_FAMILY`.

Proposed survivor:
D12-15 Volatility Risk Premium／IV-RV Proxies.

D12-14 child capabilities to preserve:
- trailing IV-RV descriptive state;
- forecast-based implied-minus-physical variance live proxy;
- ex-post implied-minus-future-realized outcome measure;
- horizon/unit/estimator/look-ahead guards.

Both remain L2/40 until explicit owner approval and canonical execution.
Do not remove D12-14 yet.


## 2026-10-04 Room09 continuation — DR-086..DR-089 discount-source and expiry-clock firewall
- DR-086: TAIFEX pricing guidance requires an explicit risk-free-rate input but does not mandate one unique official series. Rate-source choice is a versioned research convention.
- DR-087: CBC CD observations around 2026-10-02 are official but not synchronous across tenors/issuance mechanisms; stitching 7d/28d/91d/182d/364d issuance rates into one contemporaneous zero curve is rejected. Use only as sensitivity anchors.
- DR-088: TXO time-to-expiry must terminate at the contract settlement clock; generic midnight expiry is invalid, especially same-day expiry.
- DR-089: monthly TX futures remain the preferred monthly forward candidate. Discount source/time/tenor/day-count/interpolation/settlement/sensitivity must be frozen before IV replay.
- Maturity unchanged: D12 40.0%; outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation after DR-089
1. Freeze one primary research-only discount convention plus an alternative sensitivity convention.
2. Materialize the existing 2026-10-02 TXO parent through the authorized isolated path and run monthly IV/skew/surface on identical common support.
3. Keep weekly-expiry forward governance separate and historical replay separate from prospective 18:10 evidence.


## 2026-10-04 Room09 continuation — DR-090..DR-095 real IV/skew/surface residual return

Status: RESEARCH_ONLY / HISTORICAL_REPLAY_QA / H11_TERMINAL_SPECIALIST_RETURN / OUTCOMES_CLOSED / NO_PROMOTION.
Durable evidence: `research/d12_h11_common_parent_residual_return_20261004_v0_1.json`.

### DR-090 — primary discount convention is now frozen for this replay
- CBC official five-bank posted-rate artifact hash: `4530cbe4fda52f124bb7bc0cb621bce374f4d8a9607b3ce72021d836038e2d16`.
- HTTP `Last-Modified`: 2026-10-01 11:00:50 UTC = 2026-10-01 19:00:50 Asia/Taipei, before the 2026-10-02 option parent date.
- The replay therefore uses CBC 11509 posted fixed time-deposit rates from 台銀/土銀/合庫/一銀/華銀, equal-weighted across banks.
- Frozen mean annual quoted rates by calendar tenor: 30d 1.225%, 90d 1.286%, 180d 1.452%, 270d 1.565%, 365d 1.700%.
- Piecewise-linear tenor interpolation plus `exp(-r*T)` ACT/365 is a research proxy, not a claim of an exact tradable zero curve.
- Monthly forward identity remains same-expiry TX regular-session final best-bid/ask midpoint.

### DR-091 — real monthly IV replay passes
Using the unchanged official 2026-10-02 TXO parent hash `61574590f9c8a1c882616f89090d39cbd44e00a91bd93055ff046ff4ab287c2a`, unchanged TX parent hash `d41cc8c279d805a0ebb13c29f3ff757cdc78a35d7a2e13fc06be4b3f3aeb1834`, Black-76 on futures forward, regular-session quote eligibility, 13:45 source-clock proxy and 13:30 expiry clock:
- only 3 rows failed option-price bounds before the monthly smile build;
- 202610 / 202611 / 202612 / 202703 / 202706 ATM IV = 18.8658% / 21.9993% / 23.2198% / 23.7758% / 24.6326%;
- observed monthly ATM term structure is upward on this parent;
- this is later-retrieved historical replay QA, not a 2026-10-02 18:10 first-known receipt.

### DR-092 — simple D12-07 skew is stable but nonzero
On identical OTM common-support rows within `abs(log(K/F))<=0.10`, downside-minus-upside IV is:
- 202610: 1.0934 vol points;
- 202611: 0.9504;
- 202612: 1.0524;
- 202703: 1.0253;
- 202706: 0.9522.
All five monthly expiries show the same downside-richer sign. The range is relatively narrow.

### DR-093 — D12-16 residual curvature is real on identical parent rows
Compare an unweighted linear IV-vs-log-moneyness fit (simple skew baseline) with a quadratic fit on the exact same strike support, evaluated by leave-one-strike-out RMSE:
- 202610: quadratic RMSE improvement 76.32%;
- 202611: 79.67%;
- 202612: 55.84%;
- 202703: 47.05%;
- 202706: 42.02%.
Quadratic curvature coefficients fall from 3.6123 (202610) to 0.1607 (202706), more than an order-of-magnitude variation, while simple downside-minus-upside skew stays around 0.95–1.09 vol points. This is a real source-hash-attested divergent state: simple skew and residual curvature do not collapse to the same object.

### DR-094 — alternative-rate falsification does not remove the residual
Re-run the identical rows using the previously frozen CBC central-bank CD issuance-rate anchors as sensitivity-only discount inputs:
- maximum ATM-IV change versus the primary rate convention = about 0.009 vol points;
- maximum downside-minus-upside skew change = about 0.00036 vol points;
- quadratic leave-one-out improvement remains 76.34%, 79.68%, 55.86%, 47.37%, 42.81%.
Therefore the H11 residual-curvature finding is not an artifact of choosing the five-bank posted-rate proxy.

### DR-095 — H11 terminal specialist classification
Room09 terminal specialist return:
`SCOPE_DEDUP_ONLY`.

Ownership boundary:
- D12-07 owns simple skew level/asymmetry and ATM / near-far term-structure baseline summaries.
- D12-16 owns residual curvature/smile, cross-expiry surface interaction, construction-method sensitivity, fit/coverage/static-arbitrage quality and only information not already represented by the D12-07 primitives.
- D12-16 must not create a second independent vote from the same linear skew or ATM term primitive already owned by D12-07.

Why not MERGE_ELIGIBLE:
real common-parent curvature survives the simple skew baseline with large outcome-blind cross-validated fit gains and materially different tenor behavior.

Why not KEEP_SEPARATE without de-duplication:
the D12-16 slope/skew and level portions overlap directly with D12-07 baseline semantics.

Maturity firewall:
- D12-06 remains L2/40%.
- D12-07 remains L2/40%.
- D12-16 remains L2/40%.
- D12 aggregate remains 40.0%.
- No L3 because this is one later-retrieved historical parent, not independent source-attested prospective decision-time dates.
- Outcomes CLOSED; Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE=NONE.

### Exact next continuation after DR-095
1. Return `research/d12_h11_common_parent_residual_return_20261004_v0_1.json` to 00 control-plane intake; structural execution/owner approval remains a control-plane action.
2. D12 active research moves from H11 historical residual proof to independent prospective source-attested option-surface dates; do not backfill 18:10 first-known from daily files.
3. D12-13 next high-value lane: compare own-computed contract Greeks with official TAIFEX Delta only after publication/effective-date, model input and quote-clock alignment.
4. Keep weekly-expiry forward governance separate from monthly futures-forward replay.


## 2026-10-04 Room09 continuation — DR-096..DR-098 official Delta effective-date alignment firewall

Status: RESEARCH_ONLY / SOURCE_VERSION_ALIGNMENT / OUTCOMES_CLOSED / NO_PROMOTION.
Durable evidence: `research/d12_13_official_delta_version_alignment_20261004_v0_1.json`.

### DR-096 — official afternoon Delta version raw identity verified
A read-only isolated workflow later retrieved the official TXO Delta file/page:
- source: `https://www.taifex.com.tw/cht/3/optDailyDeltaExcel?scd_kind_id=TXO`;
- later-retrieved raw SHA-256: `a5a91485b332c246e451494550b389d9c629746b650e15645f93e4fec8307e10`;
- bytes: 1,261,436;
- publication text embedded in the official content: `2026-10-02 04:39:21 PM`;
- TXO occurrences: 2,872;
- the same content contains the frozen 06:45 / 14:30 / 16:30 clock notes;
- raw bytes were not committed.

### DR-097 — 2026-10-02 16:39 version is not a 2026-10-02 same-day Delta baseline
Per the already-frozen official clock contract `research/d12_13_taifex_daily_delta_clock_semantics_v0_1.json`:
- the 06:45 version is same-business-day;
- the 14:30/16:30 afternoon versions are for the next business day and exclude next-day newly listed series.
2026-10-02 was Friday, so the 16:39:21 version maps to the next business day 2026-10-05. It is therefore not directly comparable to the 2026-10-02 regular-session option parent as a same-date model-error baseline.

### DR-098 — own-vs-official Delta error remains UNKNOWN until effective dates align
A numerical comparison between own-computed Delta from 2026-10-02 option quotes and the 16:39 official next-session Delta would confound:
- model/input differences;
- option quote timing;
- effective trading date;
- next-session reference-price state;
- new-series universe coverage.

Therefore:
`DIRECT_20261002_OWN_VS_OFFICIAL_DELTA = BLOCKED_BY_EFFECTIVE_DATE_VERSION_MISMATCH`.

Allowed continuations:
1. if an immutable 2026-10-02 06:45 same-day official version is recovered with source identity, compare it with aligned 2026-10-02 inputs;
2. otherwise, after 2026-10-05 inputs exist, compare the preserved 2026-10-02 16:39 next-session official Delta with aligned 2026-10-05 inputs, explicitly flagging next-day new-series coverage.

Maturity firewall:
- D12-13 remains L2/40%;
- D12 remains 40.0%;
- no outcome join;
- Formal Core LOCKED;
- FORMAL_OPTIMIZATION_CANDIDATE=NONE.

### Exact next continuation after DR-098
1. Do not spend this closed-market period fabricating a same-day Delta comparison.
2. Resume aligned official-vs-own Delta only when a valid same-effective-date pair exists.
3. In the meantime continue D13 source-vintage work whose evidence does not depend on the next Taiwan trading session.
