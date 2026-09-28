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


## C-ROTATION — D12-08 Gamma Exposure / Dealer Gamma L0→L1 (2026-09-28 Asia/Taipei)
- Scope: concept/source semantics only; no outcome inspection, score/threshold tuning, runtime change, or Formal Core modification.
- Positive mechanism: strike/expiry-level option OI combined with option gamma can describe where convexity is concentrated. Such concentration is a plausible market-state/mechanics context around large OI clusters and expiry, but is not by itself a directional stock-picking signal.
- Critical falsification: public TAIFEX full-chain market OI identifies contract/expiry/strike/call-put and OI, but does not identify which side of each open position is the dealer. Therefore a signed dealer GEX series cannot be observed from aggregate chain OI alone. Assigning dealer sign from call/put labels or assuming dealers are always short options is prohibited.
- Participant data does not repair that gap: TAIFEX three-institution option tables aggregate many institutions, and the exchange explicitly warns that aggregate long/short/net figures do not represent any single institution's strategy. Dealer/self-dealer category data therefore cannot be equated to market-maker inventory at strike-level.
- Research-safe candidate: unsignedGammaConcentration = sum(abs(gamma_i) * OI_i * multiplier * scale), calculated separately by expiry and optionally strike-distance buckets. This is a concentration/mechanics descriptor only. dealerGammaSign = UNKNOWN unless a future source proves position-side/dealer identity at the required granularity.
- PIT/replay contract: freeze chain observation date/session, expiry, strike, call/put, OI, settlement/underlying price, multiplier, rate/dividend assumptions, IV source/inversion/filter version, gamma formula/version, source publication/availability timestamp where obtainable, and expiry/calendar rules. Same-day final OI must not be used for an earlier intraday decision.
- Data-quality fail-closed rules: missing OI/price/IV/expiry/multiplier => affected contribution UNKNOWN, not zero; invalid/illiquid option quotes cannot be silently assigned zero gamma; weekly/monthly expiries remain separate before any aggregation.
- Redundancy/alternative mechanisms: raw OI concentration, expiry proximity, PCR/OI PCR, IV level/skew/term structure and realized-volatility regime can explain apparent effects. Any future incremental test must compare unsigned gamma concentration against these controls and separate expiry sessions.
- Cost/implementation: research computation is feasible from official chain data plus frozen Greeks methodology, but full-chain IV/gamma computation adds data/compute complexity. No trading-cost benefit is assumed at L1.
- System value: potential System 1/System 2 market-risk context and expiry/mechanics guard; economic incremental value remains UNKNOWN pending PIT replay and OOS/Shadow evidence. No FORMAL_OPTIMIZATION_CANDIDATE.
- Evidence status: official TAIFEX chain tables expose strike/expiry/OI; official participant tables provide only aggregated institution positioning and explicitly caution against interpreting the aggregate as a single institution strategy. This supports the observability boundary above.
- Status: L1_CONCEPT_SOURCE_SEMANTICS / SIGNED_DEALER_GEX_UNOBSERVABLE_FROM_PUBLIC_AGGREGATE_OI / UNSIGNED_GAMMA_CONCENTRATION_RESEARCHABLE / PIT_REPLAY_NOT_YET_BUILT / FORMAL_UNCHANGED.
- Exact next: D12-08 L1→L2 — freeze a falsification protocol for unsigned gamma concentration: expiry-separated definitions, strike-distance normalization, raw-OI/expiry/IV/volatility controls, missing-data rules, and synthetic adversarial cases proving dealer sign is never inferred. Then audit TAIFEX historical chain availability/knownAt semantics for PIT replay.
