# D01 DL-068~070 — Evidence Ledger V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / SOURCE_LINEAGE_FROZEN / OUTCOME_BLIND

## Primary official sources

### TWSE — 公布或通知注意交易資訊暨處置作業要點
Source:
https://twse-regulation.twse.com.tw/m/LawContent.aspx?FID=FL007225

Live re-read 2026-10-07.

Relevant current rule facts:
- Attention publication follows predefined abnormal-trading conditions and is therefore endogenous to prior price/volume path.
- Repeated attention conditions can escalate into disposition.
- Disposition measures may alter matching cadence.
- First/repeated disposition and changed-trading-method states can use different periodic matching intervals.
- Full-payment/pre-collection, margin restrictions, broker order caps, additional settlement protection or trading suspension can be imposed.
- These measures change both observation mechanics and feasible participant behavior.

Research consequence:
Do not estimate a "disposition pattern effect" without reconstructing trigger path, label clock and mechanism state separately.

### TWSE — 公布處置有價證券資訊
Source:
https://www.twse.com.tw/announcement/punish?response=html

Live re-read 2026-10-07.

Observed current examples:
- ordinary disposition examples specify artificial-control matching approximately every two minutes;
- first disposition can require full payment once order-size thresholds are reached;
- repeated disposition can require full payment for all investors/orders;
- margin requirements may be tightened;
- disposition period is extended when trading is suspended/full-day halted.

Research consequence:
Current runtime/replay must use event-specific receipt, not assume one universal disposition cadence.

## Research literature

### Memory effects in stock price dynamics: evidences of technical trading
Primary IDs:
- PMID 24671011
- PMCID PMC3967202
- DOI 10.1038/srep04487
- arXiv 1110.5197

Relevant finding:
Prices around algorithmically identified support/resistance values show measurable bounce/cross memory consistent with technical-trading self-reinforcement.

Boundary:
This supports testability of structural memory; it does not prove any Taiwan-specific alpha and does not remove microstructure confounding.

### Evidence and Behaviour of Support and Resistance Levels in Financial Time Series
Primary ID:
- arXiv 2101.07410

Relevant finding:
Discovered support/resistance levels show statistically detectable reversal behavior and the response probability can decay with time.

Boundary:
Decay exists empirically in that study, but D01 must not import an arbitrary calendar half-life into Taiwan. Competing freshness clocks must be preregistered and tested.

### What really causes large price changes?
Primary ID:
- arXiv cond-mat/0312703

Relevant finding:
Large price moves can arise from gaps in available order-book liquidity rather than order size; lightly traded securities can display more extreme risk.

Boundary:
A zone crossing under thin liquidity is not automatically evidence of strong informed demand/supply.

### Liquidity crises on different time scales
Primary IDs:
- arXiv 1504.02956
- PMID 26764739

Relevant finding:
Liquidity imbalance/depletion is linked to large price movement and the mechanism depends on timescale.

Boundary:
D01 must consume D04/D05 liquidity receipts instead of translating a large bar into structural strength.

### Modeling Price Clustering in High-Frequency Prices
Primary ID:
- arXiv 2102.12112

Relevant finding:
Specific price increments occur disproportionately, consistent with price clustering and heterogeneous quoting preferences.

Boundary:
Round-number or repeated-tick frequency is context; it is not independent support/resistance alpha.

### Exact and asymptotic solutions of the call auction problem
Primary ID:
- arXiv 1407.4512

Relevant finding:
Call-auction clearing prices and traded volume arise from accumulated order-flow distributions and differ structurally from sequential continuous matching.

Boundary:
Periodic-call-auction observations must not be interpreted using continuous-trading touch/persistence semantics.

## Synthesis

The literature does not justify accepting or rejecting technical structure wholesale.

Instead it motivates a decomposition:
1. remove observation artifacts;
2. restore correct denominator;
3. control regulatory selection and trading mechanism;
4. control liquidity/tick/price clustering;
5. only then test residual structural memory prospectively/OOS.

No source in this ledger authorizes Formal Core promotion.
Pattern alpha remains UNKNOWN.
