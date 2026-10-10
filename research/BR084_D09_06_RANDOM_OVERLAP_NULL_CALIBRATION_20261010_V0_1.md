# BR-084 — D09-06 leader-set turnover versus fixed-size random-overlap null (2026-10-10)

Status: RESEARCH_ONLY / HISTORICAL_DESCRIPTIVE_NULL / OUTCOMES_CLOSED / NO_INDEPENDENT_DATE_ADDED / FORMAL_CORE_LOCKED
Owner: 07｜產業與供應鏈研究室
Module: D09-06; D09-07 may reference the same source root without counting an extra observation.
Observed main before write: `85ca841d7e99489609f29a437370f3e5ae637dc0`
Date: 2026-10-10 Asia/Taipei

## Parent immutable evidence (NO new market root)
- `research/br045_twse_full_industry_rank_baseline_20261007_v0_1.json`, blob `e66654e16c265e778ed9f223ef155fcdb7097a81`.
- `research/br077_twse_sector_lifecycle_seventh_date_20261008_v0_1.json`, blob `7c73f4b324995f85b9dd201b5538aa6c50831fd3`.
- `research/br079_d09_06_full_industry_rank_transition_20261008_v0_1.json` (existing rank transition; no duplicate independent date).
- `research/BR077_BR078_TRADING_CALENDAR_CORRECTION_20261009_V0_1.md` (2026-10-09 holiday; first subsequent regular session 2026-10-12).
- Existing 2026-10-10 research-branch rank-boundary falsification is not recounted as a new date.

## Hypothesis and counter-hypothesis
H1: large daily leader-set turnover means leadership is unusually unstable.
H0 diagnostic only: independently and uniformly draw two size-k leader sets from the same N-industry fixed universe. Under this deliberately simplistic random-label null, intersection X is Hypergeometric(N,K=k,n=k), E[X]=k²/N.
Important: H0 is NOT a market return model, a trading null, a serial-independence assumption validated by data, or an eligible significance test for forward alpha. It is a calibration reference for descriptive rhetoric.

## Reproducible deterministic readback
34-index official full-rank universe, fixed top quartile k=9:
- 2026-10-07 top9: 玻璃陶瓷、塑膠、油電燃氣、綠能環保、電器電纜、紡織纖維、運動休閒、造紙、橡膠.
- 2026-10-08 top9: 油電燃氣、通信網路、水泥、紡織纖維、觀光餐旅、塑膠、橡膠、居家生活、化學.
- Observed intersection X=4, retention=4/9=44.4444%, entrants=5, exits=5.
- Uniform random-overlap expected X=81/34=2.3823529411764706, expected retention=26.470588%.
- Exact combinatorial upper-tail P(X>=4)=sum_{j=4}^{9} C(9,j)C(25,9-j)/C(34,9)=0.1619123477233796.
- Top3 observed intersection=1; null E[X]=9/34=0.2647058823529412; exact P(X>=1)=0.24883021390374332.
- Remove only the two explicitly flagged overlapping composite indices (chemical/biotech/medical and electronic industry); independent sensitivity universe N=32, fixed k=8.
- Non-composite observed top8 intersection=3; random-overlap E[X]=64/32=2.0; exact P(X>=3)=0.30853930768280047.
- This 32-index sensitivity shares BOTH market dates and almost all indices with the 34-index test. It is NOT another independent test/sample.

## Interpretation / falsification
Support: turnover=5/9 and avg absolute rank delta=10.0588 describe a materially changed one-day rank ordering.
Counter-evidence: observed top9 overlap=4 exceeds a deliberately random-label expectation of 2.382; thus raw 55.6% turnover alone does NOT prove abnormal churn. The one-sided reference tail 0.1619 is not a validated market p-value and cannot be sold as evidence of persistence or significance.
Alternative explanations: common index-level shock, broad-market sign change, heavy constituents, parent/child composite overlap, 0.01pp boundary gaps, industry composition/vintage, shared demand/valuation, noise and reversal.
Failure conditions: changed membership universe, different return definition, nonmatching official close, cherry-picked k/window, a new taxonomy vintage, using overlapping composite indices as independent economic sectors, treating ranks as independent over time.
Consequence: separate participation, rank turnover, boundary strength and persistence; do not infer durable mainstream leadership or trading advantage from this pair.

## PIT/OOS/Walk-forward/bias and economic gates
Both source dates and official capture times remain the same as parent receipts; this computation is performed AFTER 2026-10-08 and cannot be retroactively claimed as a pre-2026-10-08 prospective hypothesis. No forward price outcomes opened, no historical Shadow created, no 2026-10-09 market observation fabricated.
No threshold/window search: top3/top9 are previously frozen; 32-index is explicitly labeled overlapping-universe sensitivity, not independent selection. One transition only; no OOS, no walk-forward, no date-clustered inference, no multi-regime support, no transaction-cost or slippage evidence. Factor redundancy versus sector RS, absolute return, member breadth, concentration and volatility remains unresolved.
Method ownership: Room11/D16 owns statistical test design, temporal dependence, multiple-testing family and forward alpha inference; this receipt only creates a descriptive null-reference dependency.

## Maturity / exact next
D09-06 stays L3/60%; D09 domain remains unchanged. No `FORMAL_OPTIMIZATION_CANDIDATE`.
At next genuinely completed regular TWSE session, append the official 34-index rank root outcome-blind using the unchanged taxonomy and top-k contract. Before any outcome interpretation, consume Room11/D16 date-clustered method and member-breadth/concentration controls. Do not use 2026-10-09 as a trading date.
