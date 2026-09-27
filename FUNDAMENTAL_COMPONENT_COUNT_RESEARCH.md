# FUNDAMENTAL_COMPONENT_COUNT / FUNDAMENTAL_QUALITY — Exact Gate Semantics

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-A STRUCTURAL FALSIFICATION / OUTCOMES CLOSED  
Formal Core: LOCKED

## FC-001 — Reuse the completed score research

The Fundamental Information Dynamics lane already proved:
- nine possible score slots;
- 120 theoretical pre-clamp maximum;
- coverage-sensitive, non-normalized score;
- half-credit behavior in scorePositive;
- monthly-MoM versus quarterly-QoQ horizon switching.

This continuation does not redo that work. It asks what the ordered Formal gates actually mean.

## FC-002 — Count and score share exactly the same availability slots

`financialDataCount()` counts the same nine slots that `fundamentalScore()` scores:

1. revenueYoY;
2. revenueMoM ?? revenueQoQ;
3. revenueYTDYoY;
4. eps;
5. grossMargin;
6. operatingMargin;
7. epsYoY;
8. grossMarginYoY;
9. operatingMarginYoY.

Thus `count>=3` is an availability prerequisite for interpreting the score. It is not a separate fundamental-quality dimension.

## FC-003 — Canonical quarterly producer implies count floor = 6

The current MOPS parser only admits a company-period row when:
- revenue > 0;
- EPS is numeric;
- gross profit is numeric;
- operating profit is numeric.

The quarterly derivation then requires:
- latest quarter;
- previous quarter;
- same quarter last year;

and each reconstructed quarter must have positive revenue.

For every emitted canonical FINANCIAL row this yields finite:
- revenueQoQ;
- eps;
- grossMargin;
- operatingMargin;
- grossMarginYoY;
- operatingMarginYoY.

With normal nullish fallback, those are six countable fundamental slots.

Therefore `fundamentalCount<3` is structurally unreachable for an intact canonical quarterly-financial row.

## FC-004 — Why the count gate still has a role

The earlier FINANCIAL_SOURCE_COMPLETENESS gate checks a different bundled set:
- quarterRevenue;
- financialBasis;
- revenueQoQ;
- revenueQuarterYoY;
- valuationObserved;
- priceBookRatio;
- announcementsVerified.

A permissive alternate/custom/legacy merged row can satisfy those fields while still carrying fewer than three of the nine score slots.

So the count gate acts mainly as an additional **data-integrity fallback** outside the canonical official producer shape.

Do not interpret a future count<3 incidence as weak fundamentals until source provenance is separated.

## FC-005 — Nullish alias shadowing

Both count and score use:
`revenueMoM ?? revenueQoQ`
before numeric conversion.

Therefore a non-null but nonnumeric MoM such as `"N/A"` suppresses a valid numeric QoQ fallback.

That is not a normal canonical source state; it is a provenance/invariant state possible through permissive alternate enrichment.

## FC-006 — FUNDAMENTAL_QUALITY denominator

`fundamentalScore<25` is only evaluable after count>=3.

Because the score is not normalized by available maximum, any future quality-gate study must stratify or control by the exact 9-bit availability signature.

A score of 24 with three available components is not measurement-equivalent to a score of 24 with nine available components.

Machine artifacts:
- `research/fundamental_component_count_observer_v0_1.mjs`;
- `research/fundamental_component_count_semantic_falsification_v0_1.json`;
- `tests/test_fundamental_component_count_observer_v0_1.mjs`.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
