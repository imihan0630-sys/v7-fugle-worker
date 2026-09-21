# P2 — Taiwan turnover-conditioned momentum contradiction

Updated: 2026-09-22T08:20+08:00

## Question
Does Taiwan evidence justify treating higher turnover / attention as a uniformly positive confirmation for momentum, persistence, or execution continuation?

## Evidence and contradiction
- Chang (2006, NTU thesis, 1996-2005 top-100 electronics/non-electronics sample) reports low-turnover winners outperform simple momentum in short/intermediate horizons and frames low-turnover winners as early-stage momentum.
- Ku (2016, Taiwan investor-attention study) reports a different conditional result: high-turnover stocks and post-bull-market states show stronger price/revenue momentum, while price momentum eventually reverses; turnover also changes the duration of revenue-momentum continuation/reversal.
- Lin et al. (2016, Pacific-Basin Finance Journal) reports Taiwan momentum is strongly market-dynamics dependent: continuation when market state persists, reversal during state transitions, with positive momentum concentrated in higher-attention stocks.
- Chen, Hsieh & Lee (2023) separately shows portfolio-member persistence matters and high turnover among winner/loser portfolios can attenuate conventional momentum. Their persistence construct is not identical to this system's persistenceScoreResearch.

## Falsification / interpretation
These results are not safely reducible to a monotonic rule such as "higher turnover = better continuation" or "lower turnover = better continuation." Turnover can proxy attention, momentum life-cycle stage, liquidity, investor composition and overreaction; sign depends on horizon, regime and construct.

Therefore:
1. Keep volumeTodayVsPrev5 / turnover-like variables as context or preregistered controls, not a standalone directional confirmation.
2. R07/R08 and I03/I04 remain the right existing falsification surface; because breakoutQualityResearch already embeds volumeTodayVsPrev5 at 25%, I03/I04 are nested-factor redundancy diagnostics rather than clean causal tests.
3. R06 market-regime transition remains essential when interpreting attention-conditioned momentum.
4. Do not add a turnover threshold, new factor, I08, or R09 before prospective samples mature.
5. Any later interaction hypothesis (turnover × regime, turnover × persistence) is a new experiment and must be preregistered before looking at outcome-conditioned cut points.

## Bias / data quality
- Literature samples, horizons and turnover definitions differ; construct validity is incomplete.
- No literature result is treated as direct validation of the system's current factor formulas.
- No historical Shadow or execution data is fabricated.
- UNKNOWN remains UNKNOWN.
- Independent scan date remains the evidence unit for prospective inference.

## R/I impact
R01-R08 unchanged. I01-I07 unchanged. No R09. Formal Core remains LOCKED.

## Engineering classification
Research interpretation only; no code/runtime change. No tests or deployment required.

## Next continuation
After 2026-09-22 intraday snapshots exist, measure independent-date field coverage by stage (OPEN_BASELINE separately from FIRST_10M/15M/30M) for openingGapPct, sessionAvgPrice/VWAP proxy, spreadPct, depthImbalance and executionMarketState before any directional Execution Alpha inference. Continue treating turnover/attention as regime- and horizon-sensitive falsification context.