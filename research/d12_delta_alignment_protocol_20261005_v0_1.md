# D12 prospective Delta alignment protocol — 2026-10-05

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED
Captured before the 2026-10-05 Taiwan regular session.
Parent receipt: research/d12_13_taifex_delta_effective_date_receipt_20261004_2211.json

## DR-099 — common support preregistration
TAIFEX afternoon Delta versions pre-disclose the next business day and exclude next-day newly listed series; the 06:45 current-day version includes newly listed series.
A = series in preserved 2026-10-02 afternoon version.
B = series in 2026-10-05 current-day official version when observed.
C = series with same-effective-date own-model inputs when observed.
Primary comparison support = intersection of A, B and C.
B minus A = new-series diagnostic.
A minus B = disappearance/eligibility-change diagnostic.
Rows outside common support cannot enter primary own-vs-official error metrics.

## DR-100 — model reconciliation before alpha
Primary diagnostics: signed error, absolute error, median absolute error, high-quantile absolute error and coverage, with DTE/moneyness/liquidity stratification only when inputs are identified.
Call/Put sign and unit conventions must be normalized first.
Differences are first attributed to model/input/clock/rate/forward/settlement identity. They are not directional signals.
No return, gap, MAE/MFE, hit rate, selection or trading outcome may be joined.

## DR-101 — revision decomposition
Common-series numeric revision is measured only on A intersect B.
New series are not revision error.
Disappeared series are investigated, not silently dropped.
Comparison is UNKNOWN if stable contract identity cannot be replayed.

## DR-102 — promotion firewall
One successful 2026-10-05 alignment is one prospective effective-date witness, not OOS proof. Multiple strikes on one date are not independent dates. L3 still requires independent PIT-clean normal, expiry/roll and event-regime dates.

## Exact next continuation
Append the 2026-10-05 current-day official version after it is actually observed. Build A/B/C support counts before any error metric. Compute outcome-blind reconciliation only after same-effective-date model inputs exist. No maturity promotion from this protocol alone.
