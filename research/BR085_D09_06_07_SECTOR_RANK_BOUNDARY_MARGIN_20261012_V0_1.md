# BR-085｜D09-06／D09-07 產業領導邊界距離與可辨識性反證（2026-10-12）

- Status: RESEARCH_ONLY / HISTORICAL_SENSITIVITY / OUTCOMES_CLOSED / L3_UNCHANGED
- Authoritative main at research start: `6a8d39b591ebb9e42b5a79418ed407ae23f726fd`
- Source roots (not new independent dates):
  - `research/br045_twse_full_industry_rank_baseline_20261007_v0_1.json` (2026-10-07, 34 TWSE industry total-return indices)
  - `research/br077_twse_sector_lifecycle_seventh_date_20261008_v0_1.json` (2026-10-08, same 34-industry basis)
- These two historical official roots were already counted; this diagnostic adds **zero** independent market dates and **zero** forward outcomes.
- Research captured 2026-10-12, never backdated to either trading date.

## Falsifiable question
Is observed top-3 / top-9 membership or cross-day retention stable to a **hypothetical symmetric return perturbation** around the published two-decimal daily return? This is a diagnostic perturbation, NOT measured official-source error and NOT a proposed selection threshold.

## Exact source-derived boundary distances
| Official date | top3 rank3 | rank4 | gap (percentage points) | top9 rank9 | rank10 | gap |
| --- | --- | --- | ---: | --- | --- | ---: |
| 2026-10-07 | 油電燃氣 +4.97% | 綠能環保 +2.53% | 2.44 | 橡膠 +1.55% | 食品 +1.53% | 0.02 |
| 2026-10-08 | 水泥 +0.83% | 紡織纖維 +0.82% | 0.01 | 化學 +0.33% | 食品 +0.32% | 0.01 |

If each reported daily return can be perturbed independently by at most δ percentage points, a strict boundary inversion requires 2δ > the observed boundary gap. Equalities are treated conservatively as tie/UNKNOWN, never silently assigned to a unique rank.

- 2026-10-07 top3 requires δ > 1.22 pp to invert; top9 requires δ > 0.01 pp.
- 2026-10-08 top3 and top9 each require δ > 0.005 pp to invert.
- At a **hypothetical** ±0.01 pp interval, 2026-10-07 top3 has 3 certain members and 3 possible members; top9 has 8 certain and 10 possible (橡膠／食品 boundary).
- At ±0.01 pp, 2026-10-08 top3 has 2 certain and 4 possible (水泥／紡織纖維); top9 has 8 certain and 10 possible (化學／食品).
- Enumerating the possible boundary swaps under this deliberately conservative model: top3 cross-date overlap remains 1/3, while top9 overlap can be 3/9 or 4/9; baseline is 4/9. This is a **sensitivity envelope**, not a revised historical result.
- With δ=0.005 pp and conservative equality handling, the 2026-10-07 top9 is fixed, and 2026-10-08 top9 boundary is potentially ambiguous, but the cross-date top9 overlap remains 4/9 because 食品 was not in 2026-10-07 top9.

## Reproducible formula
For each industry i with displayed return r_i and bound δ:
- `certainlyAbove(i,j)` iff `r_j - δ > r_i + δ`.
- `certainlyBelow(i,j)` iff `r_j + δ < r_i - δ`.
- Conservative best rank = 1 + count(certainlyAbove); conservative worst rank = N - count(certainlyBelow).
- `certainTopK` iff worstRank ≤ K; `possibleTopK` iff bestRank ≤ K.
- Preserve composite-parent flags: 34 indices are observable rows, not 34 independent causal sectors.

## Four-sided assessment
- Support: source daily returns show a 0.01-pp boundary margin on 2026-10-08 for both top3 and top9, so point-estimate leader labels are sensitive to small hypothetical perturbations.
- Falsification: 2026-10-07 top3 is separated by 2.44 pp; a blanket claim that all leader sets are fragile is false. At δ=0.005 pp, observed 4/9 top9 cross-date retention does not change under the boundary-swap diagnostic.
- Alternative explanations: real return movement, index composition/weights, price changes, official rounding, overlapping industry indices, and common market shocks. A hypothetical interval is not proof of real data error.
- Failure conditions: treating perturbation δ as estimated market noise; changing TopK after observing outcomes; mixing total-return and price indices; treating two adjacent dates or composite-parent indices as independent samples; inferring future return from rank fragility.

## PIT / OOS / multiple-testing / costs
The diagnostic uses only frozen past official roots. It is **post-hoc sensitivity analysis**, not a prospectively preregistered forecast. OOS, walk-forward, independent dates, date-clustered D16 inference, factor redundancy versus breadth/concentration and trading-cost sensitivity remain UNKNOWN. No stock outcomes were opened, no threshold search performed, no historical Shadow fabricated. No `FORMAL_OPTIMIZATION_CANDIDATE`. D09-06 and D09-07 stay L3/60; D09 aggregate stays 58.6% unless canonical tracker independently changes.

## Exact next
Wait for next genuine official 34-industry close and append one new root under the frozen BR-045 contract. Run the same boundary-margin diagnostic without retuning δ. Obtain D16 date-clustered method receipt and member-level breadth/concentration parent before any outcome-based interpretation. No Formal Core changes.
