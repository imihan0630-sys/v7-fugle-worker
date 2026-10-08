# D03 indicator backtest PIT universe and denominator firewall

## Research question

Can a trend, momentum, reversal or indicator backtest be called complete when its decision-date stock universe, exclusions or resume checkpoint are not independently bound?

## Supported hypothesis

A valid D03 validation date must bind the exact historical decision-time universe before indicator outcomes are inspected. The immutable plan identity must include dataset, policy, evaluator code, factor definition, regime version, execution assumptions and cost model. The date receipt must bind the historical registry/snapshot, exact market-symbol membership, known exclusions and denominator accounting.

This blocks survivorship bias, silent evaluator drift, cost-model drift, post-delisting knowledge, forged completion checkpoints and all-excluded zero-sample claims.

## Counterhypotheses and failure conditions

The executable oracle rejects:

- today's surviving symbols reused as a historical universe;
- future membership-end or delisting fields exposed inside the decision-time receipt;
- unknown membership or unknown exclusion treated as absent;
- all members excluded and then reported as a proved empty market;
- eligible, accounted, sampled and state-count denominators that disagree;
- changed factor definition or plan identity resumed from an old checkpoint;
- invalid checkpoint, partition or rolling-digest lineage;
- factor evidence observed after the decision clock;
- training/OOS date overlap, invalid walk-forward order or missing date-cluster audit.

A genuinely empty PIT universe remains admissible only with an explicit proved-empty receipt. It is distinct from a nonempty universe whose members were all excluded.

## D03 implications

This firewall applies to all 12 active D03 modules whenever historical cross-sectional or multi-date validation is claimed. It is especially important for ret5/ret20/ret60 ranks, persistence, continuation, Bollinger and ADX because a clean formula on a survivor-biased denominator can still produce invalid OOS evidence.

The firewall does not prove predictive value. It supplies an admission contract for future OOS, walk-forward, multiple-testing, redundancy, cost, fillability and market-state analysis. Until real physical backtest receipts satisfy it, those claims remain UNKNOWN.

The merged System2 CORR-014 implementation is engineering evidence only. Its correction queue remains open pending independent governance verification, and no D03 maturity credit is taken.

Formal Core remains LOCKED. FORMAL_OPTIMIZATION_CANDIDATE is NONE.
