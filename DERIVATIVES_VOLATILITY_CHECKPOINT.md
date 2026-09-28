# Derivatives Information & Volatility Surface Checkpoint

Updated: 2026-09-28 17:23 Asia/Taipei
Current cursor: DR-001 through DR-034 complete.
Next: D12-08 prospective evidence accumulation + D12-10 mechanism deepening.

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
