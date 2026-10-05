# D01 DL-039 — Cross-sectional Generalization vs Liquidity/Size Survivorship

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED
Date: 2026-10-05 Asia/Taipei
Owner: D01 K-line / Pattern / Price Structure

## Question
Can apparent cross-symbol robustness be separated from the fact that liquid, large, data-rich symbols are easier to detect, replay and trade?

## Frozen mechanism
A pattern may look cross-sectionally robust because evaluable observations are selected toward symbols with cleaner OHLC continuity, better liquidity, longer listing history and lower replay failure. Detection coverage and economic effect therefore require separate ledgers.

## Frozen population contract
At each decision cut preserve:
- eligibleSymbolCount
- evaluableSymbolCount
- detectedStructureSymbolCount
- noOpportunitySymbolCount
- dataBlockedSymbolCount
- missingSymbolCount
- laterDelistedSymbolCount
- liquidityBucketAsOf
- sizeBucketAsOf
- listingAgeAsOf
- symbolConcentration
- structuralRootConcentration

Replay failure must not remove a symbol from the denominator. Missing evidence is UNKNOWN, never zero or BAD. Future survival state must not rewrite the historical eligible universe.

## Anti-survivorship rules
1. Universe membership is frozen point-in-time before outcomes.
2. Later delisting/suspension/liquidity deterioration cannot delete a historically eligible symbol.
3. Liquidity/size buckets use only information available at the decision cut; future average volume or future market cap is prohibited.
4. Data-rich symbols may not define the universe after the fact.
5. One symbol producing many structural roots does not prove cross-symbol replication.
6. Adjacent dates sharing one root are not independent replications.

## Falsification matrix
- Effect only in highest-liquidity bucket -> LIQUIDITY_CONDITIONAL, not universal.
- Gross effect only in small/illiquid bucket and disappears after costs -> COST_FRAGILE.
- Opposite signs across size/liquidity strata -> HETEROGENEOUS, do not average into a universal claim.
- Coverage changes sharply by regime -> separate coverage shift from economic regime effect.
- Data-blocked/UNKNOWN observations concentrated in weak-performing strata -> selection-bias risk remains unresolved.
- Equal-symbol weighting materially differs from root-weighted results -> concentration dependence must be reported.

## Required future validation
Freeze and compare:
- full point-in-time universe
- equal-symbol weighting
- liquidity strata
- size strata
- sector/regime strata
- independent date/episode clusters
- prospective/OOS cost-aware results
- coverage/missingness by stratum

D16 owns economic inference, dependence-aware effective sample size, multiple-testing correction and residual incrementality. D01 owns representation, identity, coverage and replay semantics only.

## Redundancy / information-root firewall
Multiple D01 labels derived from one PRICE_OHLC information root remain one effective evidence family until D16 proves residual incrementality. Cross-module labels cannot manufacture independent cross-sectional evidence.

## Adversarial cases to implement
1. illiquid symbols silently dropped
2. small-cap symbols silently dropped
3. later-delisted symbol removed retrospectively
4. future average volume defines historical liquidity
5. future market cap defines historical size
6. one symbol contributes most roots
7. adjacent dates of one root counted independently
8. data gap encoded as no-pattern
9. no-opportunity encoded as negative evidence
10. corporate-action continuity failure silently excluded
11. high-liquidity-only effect called universal
12. small-cap gross edge disappears after costs
13. opposite stratum signs averaged away
14. regime-dependent coverage called regime alpha
15. duplicate pattern labels inflate evidence count
16. holdout universe changed after outcomes

## Gates
PIT: mandatory.
OOS / Walk-forward: mandatory before L4.
Selection bias / look-ahead / data snooping / multiple testing / overfitting: unresolved until D16 evidence.
Factor redundancy: PRICE_OHLC family effective evidence count remains one absent residual proof.
Transaction costs / liquidity / regime dependence: mandatory.
Historical Shadow fabrication: prohibited.

Pattern alpha: UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next continuation point
Implement the 16 outcome-blind adversarial fixtures and a fail-closed research validator for population/coverage/survivorship semantics. Then reconcile against latest main, append durable checkpoint evidence, and only after executable receipts consider DL-040. Economic outcome joins remain closed.
