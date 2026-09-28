# Derivatives Information & Volatility Surface Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: DR-001 through DR-029 complete.
Next: evidence accumulation; concept lane complete.

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
