# D14-17 Implementation Shortfall / Market-impact Cost Contract V0.1

Date: 2026-10-06
Scope: research-only; Formal Core unchanged.

## Research question
D14-17 measures execution loss from an immutable decision-time parent order through actual or counterfactual child-order outcomes. It does not decide stock selection and does not treat a signal, preview, or recommendation as a fill.

## Identity contract
Freeze symbol, side, parent quantity, decisionAt, decision price source, execution horizon, mechanism, lot type, order lifecycle, fill provenance, fees/tax provenance, and unexecuted remainder.

Implementation shortfall must separate:
1. delay cost before submission;
2. spread / price concession;
3. market-impact component;
4. explicit fees and tax;
5. opportunity cost of unexecuted remainder.

Unknown components remain UNKNOWN and are never coerced to zero.

## Falsification
- Later close or daily VWAP cannot replace a decision-time executable benchmark.
- Filled-only samples are survivor-biased when unfilled/cancelled/rejected quantities disappear.
- Price movement after an order is not automatically causal market impact; common market/sector/news moves are alternative explanations.
- Same-day child orders are clustered observations, not independent sample-size increments.
- Impact estimates are size- and liquidity-dependent and cannot be transported across capital scales without revalidation.
- Odd-lot, continuous matching, auction, interruption, and limit-state mechanisms must not be pooled without mechanism provenance.
- Broker-confirmed fills are required for realized execution claims.
- Parameter/window/model searches require preregistration or multiple-testing control.
- OOS / walk-forward evaluation must use only information known by each decision timestamp.
- Missing depth, queue, fee, tax, fill, or cancellation provenance remains UNKNOWN.

## Boundary
D14-15 owns order-type semantics.
D14-16 owns parent-to-child scheduling.
D14-17 owns implementation-shortfall / market-impact ontology and attribution.
D14-18 owns alpha decay / urgency.
No double counting across these modules.

## L3 readiness
L2 is mechanism + falsification only. L3 requires prospective Taiwan PIT feasibility across at least three independent sessions, deterministic replay, preserved unexecuted opportunities, mechanism-matched benchmarks, and broker-confirmed fills for realized claims. Three sessions trigger review only; no automatic promotion.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
