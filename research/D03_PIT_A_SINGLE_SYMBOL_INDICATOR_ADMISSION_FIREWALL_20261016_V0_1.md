# D03 PIT-A Single-Symbol Indicator Admission Firewall — 2026-10-16

## Purpose

This note consumes the latest DATA and BUILD handoff without duplicating original-source acquisition or selection engineering. It defines when one future, independently audited symbol may become a D03 technical-indicator research input while the full historical PIT-B backfill remains incomplete.

Formal Core stays LOCKED. No selection, ranking, Shadow, Frozen write, outcome join, or production authorization is created.

## New authoritative evidence

- Current native CFI originals were physically retained and independently rehashed for four controls at 2026-10-16 08:58:26 UTC:
  - 2330/TWSE: nativeType Stocks, CFI ESVUFR, current source-positive.
  - 3287/TPEx: nativeType Stocks, CFI ESVUFR, current source-positive.
  - 9103/TWSE: TDR, CFI EDSDDR, negative instrument-class control.
  - 0050/TWSE: ETF, CFI CEOGEU, negative instrument-class control.
- Current source-positive ordinary-stock observations: 2/4.
- Historical effective-period CFI PIT certified: 0.
- Full Stage1 market-day PIT eligible: 0; unresolved: 1,935.
- Corporate-action six-family historical revisions/cancellations/halt-resume/scoped NO_EVENT completeness: false.
- Independent AUDIT_LANE historical PIT signoff: false.
- selectedCount and zeroPickDay remain null; Frozen remains false.
- Owner-approved priority: PIT-A genuine future daily-selection evidence first, PIT-B historical replay in parallel, with no lowering of either standard.

## Core distinction

A current CFI ordinary-stock observation proves only current source classification at its observed clock. It does not prove:
- the class was effective throughout the prior 61 official sessions;
- when each historical class version was first known or publicly available;
- complete historical corrections, cancellations, suspensions, reinstatements, or scoped NO_EVENT;
- an archive existed before the future decision cut;
- independent audit acceptance.

Therefore 2330 and 3287 are CURRENT_CFI_SOURCE_POSITIVE_ONLY, not PIT-A eligible.

## Seven-gate one-symbol admission

One future symbol may become PIT_A_SYMBOL_INPUT_ADMISSIBLE only if all are true:
1. A genuine future decision cut is fixed before evaluation.
2. Exactly 61 required official sessions and original per-bar payloads are archived by the cut.
3. Historical native CFI effective-from/to periods cover every required session exactly once.
4. All six corporate-action source families cover corrections, cancellations, suspensions and reinstatements.
5. Authoritative scoped NO_EVENT evidence exists; silence is not negative proof.
6. firstKnownAt/availableAt and original source hashes are causal and cut-bounded.
7. AUDIT_LANE independently rehashes originals and signs the exact symbol/cut bundle.

PIT-B incompleteness must not block a symbol that genuinely passes every PIT-A gate. Conversely, PIT-B storage or backfill evidence may never substitute for PIT-A cut-bounded evidence.

## Indicator-specific consequence

A PIT-A symbol input does not make every indicator equally replayable:

| Indicator family | 61 exact sessions after PIT-A admission | Remaining restriction |
|---|---|---|
| ret5/ret20/ret60, SMA up to 60 | finite-window mechanics computable | no outcome or alpha inference |
| KD9, RSI14, Bollinger20 | mechanics computable if required OHLC fields and zero-range conventions are complete | contamination and redundancy still required |
| MACD | deterministic only under an explicitly frozen initialization/warm-up contract | 61 sessions alone do not prove equivalence to a longer ancestral EMA state |
| ADX | deterministic only with canonical Wilder ancestry or replay-certified prior state | 61 sessions alone do not prove full recursive-state equivalence |
| divergence and multi-timeframe conflict | research observable only after pivot confirmation and all parent frames are cut-safe | no retrospective pivot or repainting |

Thus the first accepted symbol can support outcome-blind finite-window mechanics and recursive-state diagnostics, not cross-sectional ranking, selection, OOS, walk-forward, cost, or alpha claims.

## Support, counterevidence, alternatives, failure states

Support:
- Four current native bodies were retained and rehashed.
- Positive and negative instrument controls demonstrate that current class filtering is executable.
- BUILD has a read-only, audit-pinned one-symbol preflight contract.

Counterevidence:
- Historical effective-period CFI accepted count remains zero.
- All 1,935 historical source-security windows remain PIT UNKNOWN.
- CA negative/revision scope and independent audit are incomplete.
- No eligible symbol, selection, Frozen row, or outcome exists.

Alternative explanations:
- A stock classified ordinary today may have had a different historical status.
- A complete 61-row count may hide a wrong-date substitution or discontinuity.
- A finite-window indicator can be computable while recursive MACD/ADX state remains initialization-dependent.
- A one-symbol pass may reflect data availability rather than market-wide representativeness.

Failure states:
- archive captured after the decision cut;
- missing, overlapping, or backfilled class periods;
- corporate-action silence treated as NO_EVENT;
- producer self-hash treated as independent audit;
- PIT-B storage substituted for PIT-A causal evidence;
- one-symbol eligibility promoted to full-market denominator, zero-pick, ranking, Shadow, or alpha;
- MACD/ADX computed from an unfrozen initialization and compared as if canonical.

## Oracle result

TI-2013 through TI-2032 passed 20/20 deterministic cases. The oracle covers current positive and negative CFI controls, decision-cut timing, historical class periods, corporate-action scope, independent audit, false zero-pick/selection, PIT-A/PIT-B separation, finite-window readiness, recursive-state uncertainty, and outcome/incrementality blocking.

## Conclusion

D03 accepts the PIT-A/PIT-B split as a useful path to the first legal prospective indicator input, but current status remains PIT-A eligible 0 and unresolved 1,935. Maturity remains 56.7%. No FORMAL_OPTIMIZATION_CANDIDATE exists.

## Exact next continuation point

Consume DATA's first future 2330/TWSE symbol bundle only after all seven gates and independent audit are present. Then run outcome-blind finite-window indicator mechanics separately from MACD/ADX recursive-state certification. Keep full-market denominator, selection, Frozen, Shadow, outcomes, OOS, walk-forward, costs, and incrementality closed. If any gate is absent, preserve UNKNOWN and continue to the next executable research module.
