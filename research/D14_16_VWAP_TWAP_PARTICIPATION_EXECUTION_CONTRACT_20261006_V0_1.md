# D14-16 VWAP / TWAP / Participation Execution Contract V0.1

Date: 2026-10-06
Owner: Room10 / D14
Scope: RESEARCH_ONLY
Formal Core: LOCKED

## Research question
D14-16 studies how a fixed parent order is split through time/volume under Taiwan execution mechanisms. It does not decide stock selection, signal validity, or broker-confirmed fill truth.

## Mechanism family
- TWAP: deterministic time-slicing baseline. Strength: simple and replayable. Failure mode: ignores intraday liquidity shape.
- VWAP-style schedule: allocates child quantity using a volume-profile forecast known at the decision timestamp. Future realized full-day volume must never leak into earlier child-order decisions.
- Participation schedule: caps child quantity as a predeclared share of observed eligible market volume. It adapts to realized activity but can underfill when liquidity falls.

## Identity and clocks
Every replay freezes:
- parentOrderId, symbol, side, parent quantity;
- decision timestamp and information cutoff;
- mechanism cohort: opening auction, continuous regular-lot, volatility-interruption state, closing auction, or discrete odd-lot matching;
- allowed execution horizon;
- child-order submit/cancel/replace timestamps;
- market-volume observations and known-at timestamps;
- broker-confirmed fills when an ACTUAL execution claim is made.

Plan, signal, push, order, simulated match, broker fill, confirmed fill, and realized P/L remain distinct states.

## Falsification firewall
1. Historical realized full-day volume cannot be used to construct an intraday VWAP schedule before that volume was knowable.
2. Conditional-on-fill price improvement is insufficient; unfilled, cancelled, rejected, partial and expired quantity remains in the denominator.
3. A slower schedule can reduce impact while losing signal alpha; a faster schedule can preserve alpha while increasing spread/impact.
4. A fixed participation rate can conflict with signal half-life when market volume collapses.
5. Own order flow can make VWAP/endogenous volume benchmarks non-independent when participation is material.
6. Opening/closing auctions, continuous regular-lot, volatility interruptions and odd-lot discrete matches are separate cohorts.
7. Missing commission, tax, slippage, mechanism state, quote freshness or fill provenance stays UNKNOWN, never zero.
8. Signal/plan prices and simulated fills never become broker fills.
9. Multiple schedule parameters, horizons, participation caps or volume-profile variants count as multiple tests; post-hoc winner selection is prohibited.
10. Same-day child orders are not independent samples; inference clusters by independent decision/session.

## PIT / OOS / walk-forward
- Volume-profile estimates use only observations available before each decision.
- Estimator version, lookback, bucket definition and fallback policy are frozen before outcomes.
- Walk-forward updates may use only prior sessions.
- OOS evaluation uses untouched later independent sessions.
- Missing history or mechanism provenance is DATA_BLOCKED, not BAD.

## Fair comparator contract
TWAP, VWAP-style and participation schedules must share the same parent order, side, quantity, decision time, allowed horizon and mechanism cohort.
Report:
- completion ratio;
- executed and residual quantity;
- average fill price when broker-confirmed;
- implementation shortfall interface;
- elapsed/eligible exposure;
- participation;
- explicit cost provenance;
- opportunity cost for residual quantity;
- signal-decay interaction.

## Ownership boundary
- D14-15 owns order-type semantics.
- D14-16 owns parent-to-child scheduling.
- D14-17 owns implementation-shortfall / market-impact ontology.
- D14-18 owns signal-decay / urgency.
No child metric receives a second independent alpha vote.

## Maturity decision
Mechanism and falsification contract is complete for L2 research semantics.
L3 remains blocked until at least three independent prospective Taiwan sessions provide immutable decision/mechanism/order lifecycle evidence and broker-confirmed fills where realized execution claims are made.
No automatic promotion follows from three dates; readiness review is required.

Status:
D14_16_MECHANISM_FALSIFICATION_CONTRACT_FROZEN / TAIWAN_PIT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED

No FORMAL_OPTIMIZATION_CANDIDATE.
