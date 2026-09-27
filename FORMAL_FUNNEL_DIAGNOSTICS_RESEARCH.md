# Formal Funnel Diagnostics Research

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## FF-001 — baseEligible is an early-admission checkpoint

Current `baseEligible` increments whenever `scoreCandidate().basePassed===true`.

The flag remains false through:
price/history/RS/market-cap/extreme-day/liquidity/size/chip-data checks.

It becomes true for rejects beginning at:
quarterly/valuation/announcement completeness,
then event, valuation, sector, setup, fundamental, ATR, target, RR, grade.

Therefore the accurate interpretation is approximately:

`EARLY_ADMISSION_PASSED_THROUGH_CHIP_DATA`.

It is not “fully eligible before RR”.

## FF-002 — rrEligible is a late cumulative checkpoint

`rrEligible` increments only when `rrPassed===true`.

That requires the row to have survived every prior ordered gate, obtained a target and RR>=2.
A later grade-C reject can still have rrPassed=true.

Therefore:

`baseEligible - rrEligible`

is the combined attrition from many downstream gates.
It is not RR's standalone reject count.

## FF-003 — A/B conditionDistribution does not mean reached setup gate

`conditionDistribution` receives all `basePoolDiagnostics`.

It directly evaluates A/B checks even on rows that would fail earlier downstream gates such as:
financial completeness, valuation or sector.

Thus A.fullPass/B.fullPass mean:
“technical A/B state prevalence among early-admitted rows”.

They do NOT mean:
“number that actually reached the setup gate in Formal order”.

## FF-004 — top-level vs THOUSAND

The first diagnostic loop covers all `featureRows`, including thousand-dollar names.

`thousandStockPool` then evaluates the thousand subset again for a dedicated report.

Therefore:
- top-level counts = COMBINED universe;
- thousandStockPool counts = THOUSAND subset;
- they must not be added;
- top-level is not GENERAL-only.

Also `generalTop.length` is quota-capped selected count, not the full GENERAL qualified population.

## FF-005 — required future funnel

For candidate-scarcity work, save both:

1. **ordered reached/pass/fail transitions** under current Formal order;
2. **independently observable PASS/FAIL/UNKNOWN/NOT_EVALUATED gate states** where inputs permit.

Break out at least:
liquidity/size/chip -> financial data -> event -> valuation -> sector -> A/B -> fundamental -> ATR -> target -> RR -> grade -> fully qualified -> pool quota selected.

Only after this receipt exists may we say which stages dominate scarcity.
First-failure counts remain descriptive order-dependent prevalence.

Machine guard:
`research/formal_funnel_counter_semantics_falsification_v0_1.json`.

No Formal threshold changed.
