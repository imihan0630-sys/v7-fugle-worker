# Derivatives Information & Volatility Surface Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: DR-001 through DR-015 complete.
Next: DR-016.

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
