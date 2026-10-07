# Market Breadth + Sector Rotation + Leadership Checkpoint

Updated: 2026-09-30 05:43 Asia/Taipei
Current cursor: BR-001 through BR-029 complete.
Next: BR-030 first valid prospective evidence no earlier than 2026-09-29; until then continue source/readiness work without outcome peeking.

## Durable conclusions

- Breadth is participation, not direction and not a standalone buy/sell rule.
- Literature is mixed: a 64-country study finds predictive breadth effects, while a broad study of 93 technical market indicators finds little robust/economic return predictability. Both sides are retained.
- Three universes must remain separate: official whole-market breadth, common-stock research breadth, Formal eligible-universe breadth.
- Current source sector breadth is NOT whole-market breadth because `normalizeMarketRow()` filters non-common instruments and close < NT$10 before `buildTodaySectorStats()`.
- Current system already has one-day sector breadth, average change, amount/volume activity, top-3 leaders and a sector hard gate. New research must not duplicate them.
- Highest incremental value is temporal breadth, participation divergence, new-high/MA participation, leadership concentration, sector-rank rotation and cross-sector correlation state.
- Breadth divergence should first be interpreted as concentration/participation divergence, not automatic reversal.
- New-high/new-low and MA breadth have substantial redundancy risk with current momentum/K-line/Residual RS and require incremental tests.
- Industry momentum has strong historical evidence but can weaken when cross-industry correlation rises.
- Sector rotation is a transition in relative leadership/participation; it is not merely today's top-return sector.
- Trade amount is activity, not capital inflow; do not mislabel it.
- Taiwan official data support market-level breadth: TWSE OpenAPI TWTaZU and TPEx official after-trading stats. Stock-level TWSE/TPEx daily data can support common/eligible breadth with explicit universes.
- First prospective market+sector feature set and hypotheses are frozen; no outcome-tuned threshold.
- Formal Core remains LOCKED.

## Existing-source finding

`buildTodaySectorStats()` currently computes:
- one-day positive-stock breadth;
- avgChange;
- amount/volume vs 20D;
- estimated institutional net value;
- top 3 daily leaders;
- composite sector score.

Formal candidate filtering currently rejects a sector when:
- breadth < 40%, OR
- avgChange < -1%, OR
- amountVs20DayAverage < 0.5.

This is existing production logic, not a newly approved research conclusion. The new lane will test its context/redundancy but will not modify it.

## Exact next continuation

BR-011: Breadth thrust / sudden participation expansion — distinguish practitioner concept from robust evidence.
BR-012: Breadth deterioration before/after market peaks — duration and false-alarm problem.
BR-013: Cross-sector correlation / dispersion as a rotation-environment variable.
BR-014: Leadership diffusion lifecycle: leader-only -> widening -> broad -> narrowing.
BR-015: Sector-strength decomposition to test whether current one-day hard gate is redundant or potentially information-losing, research-only.
BR-016: Point-in-time universe / listings-delistings / industry reclassification data quality.
BR-017: Build redundancy map against current sector score, Residual RS, PV, K-line, Regime.
BR-018: Decide whether existing official data permit zero-code/prospective snapshot research before any new collector/schema proposal.


## BR-011 through BR-025 — concept convergence

- Breadth thrust is retained as participation acceleration, but no named/fixed folklore threshold is adopted.
- Breadth divergence requires duration/false-alarm measurement; first interpret it as concentration/participation divergence, not an automatic market-top signal.
- Cross-sector correlation and return dispersion condition whether sector rotation is distinct from market beta.
- Leadership is modeled as a lifecycle: leader-only -> early diffusion -> broad participation -> possible late broadening -> narrowing -> leadership break.
- Existing Formal sector gate (breadth >=40%, avgChange >=-1%, amountVs20DayAverage >=0.5) is frozen production truth, not proof those thresholds are optimal. Research must test the current gate first rather than threshold sweep.
- Point-in-time universe and industry classification are mandatory. Current price histories do not freeze historical industry identity per bar; historical sector reconstruction with current classifications carries look-back risk.
- Concentration panel frozen: cap-weighted return vs equal-weight return vs median stock plus advance share/dispersion.
- Sector rotation uses continuous rank transition / percentile movement instead of only Top-N membership.
- Industry momentum is multi-horizon and classification-sensitive; evidence is not universal across countries/samples.
- Stock RS x sector state is a four-state interaction study, with no state pre-declared superior.
- Leadership concentration uses contribution shares/HHI/effective leaders with UNKNOWN semantics when denominators are unstable.
- Prospective breadth snapshot schema and readiness gates are frozen.
- Historical broad/sector claims remain data-quality limited by stale-history, survivorship and historical classification issues.
- Concept lane status: CONCEPT_COMPLETE / EVIDENCE_PENDING. Do not create more breadth indicators before evidence accumulates.
- Formal Core unchanged.

## Next lane
Open Fundamental Information Dynamics: distinguish fundamental level, change, surprise, revision and market price reaction.


## BR-026 — Sector-gate provenance capture deployed; evidence accumulation starts prospectively

- Production audit confirmed that pre-V8.14 evidence was insufficient to falsify the existing sector hard gate:
  - `researchMarketContext.advancePct` was Formal-normalized breadth, not official whole-market breadth;
  - Shadow snapshots lacked the actual gate inputs breadth / avgChange / amountVs20DayAverage;
  - gate failure short-circuits `scoreCandidate()`, so rejected names do not have a valid full gate-bypassed Formal RR/eligibility result.
- V8.14.0 `SECTOR_GATE_AUDIT_V0_1` now freezes the PIT gate inputs, each pass/fail check, combined state and exact 40% / -1% / 0.5 thresholds inside existing research-only Shadow snapshots.
- Market breadth context now declares its universe explicitly as `TWSE_TPEX_COMBINED_FORMAL_NORMALIZED` and `officialWholeMarketBreadth=false`.
- New bounded `SECTOR_GATE_REJECTED` cohort: exact existing sector-gate reject reason, deterministic A/B-closeness ordering, max 6 per pool per scan. This is not a full rejected-universe archive.
- A/B technical context is recorded with `fullFormalCounterfactual=false`; it must not be interpreted as “would have been a Formal pick if the sector gate were removed.”
- Deployment evidence: PR #111; merge `eb1ef7f1d86a8013c0fd58d97cdfaa7369f677e7`; PR Regression 36234970884 SUCCESS; PR Repair 36234970803 SUCCESS; main Regression 36235023368 SUCCESS; Cloudflare Deploy 36235023379 SUCCESS.
- Formal sector gate, A/B logic, ranking, quotas, capital and all operation signals remain unchanged.

### Frozen first evidence protocol
- Start only with clean post-deploy PIT scans.
- Minimum first descriptive review: >=20 independent clean scan dates with mature D1/D3/D5 outcomes.
- Compare frozen gate-pass context versus bounded `SECTOR_GATE_REJECTED`.
- Outcomes: D1/D3/D5 return, MFE, MAE, false-breakout / stop-risk where observable.
- Stratify which component failed: breadth, avgChange, activity; preserve multi-failure rows.
- Condition on A/B technical readiness, sector RS, Price-Volume, setup quality and market regime.
- Inference unit = scan date; use date clustering / leave-one-date-out.
- Do not sweep 40% / -1% / 0.5 for a prettier result.
- Because the rejected cohort is bounded, do not estimate full-market opportunity loss from it.

Status: `WAITING_PROSPECTIVE / NOT_OPTIMIZATION_READY`.
First expected valid cohort: 2026-09-29, conditional on V8.12 history/source admission.


## BR-027 / BR-028 — 07-room integration checkpoint

### New durable conclusions
- Industry classification is a PIT variable. Current labels must never be backfilled into historical Sector RS / breadth / rotation studies. TWSE effective-dated reclassification evidence makes bounded Taiwan PIT membership feasible, while complete historical machine-readable coverage remains UNKNOWN.
- Taiwan-specific counterevidence means Sector RS cannot receive a permanent positive sign. Industry momentum / reversal depends on horizon, taxonomy, market and regime.
- Sector price strength must be decomposed from participation concentration and then tested against physical-cycle evidence. A leader-dominated sector move is not equivalent to broad industry confirmation.
- Physical-cycle confirmation must stay separate from price confirmation: production / sales / inventory / capacity / pricing / company transmission can disagree, and disagreement is itself a research state.
- Do not create a new composite industry score yet. Preserve the state vector and test interaction states prospectively.
- Existing System 1 same-day sector breadth / avgChange / amount activity / hard gate remain unchanged and become baseline controls for incremental tests.
- The six-layer Industry Cycle Confirmation Stack is a direct research bridge to System 2's owner-approved `INDUSTRY_THESIS` family, whose source readiness remains incomplete.

### D09 maturity decision
`D09-01 產業分類與分類Vintage`: L2 -> L3.
Reason: official Taiwan effective-date reclassification evidence establishes decision-time classification feasibility for prospective and bounded historical research. This is a PIT-feasibility upgrade only; it does not claim complete historical membership coverage or automation.

### Explicit non-upgrades
- D09-02 Sector RS remains L3: mechanism / Taiwan PIT feasibility already exist, but prospective/OOS evidence is not yet sufficient for L4.
- D09-06 Sector Rotation remains L2: concept is mature, but a clean PIT rank-transition cohort is still evidence-pending.
- No breadth / rotation threshold, sector hard gate, priority weight or Formal score changed.

### Exact next continuation
BR-029: audit effective-dated classification source coverage and define `classificationSchemeId / effectiveFrom / effectiveTo / knownAt` receipt.
BR-030: when the first valid V8.14 prospective sector-gate cohort exists, compare leader-only versus broad participation without tuning thresholds.
BR-031: join those observations to the D10 physical-cycle state by information date, preserving separate clocks and UNKNOWNs.


## BR-029 — Taxonomy bridge checkpoint

- TWSE/TPEx issuer industry, MOEA/DGBAS statistical industry/product codes, and investment themes/supply-chain groups are separate taxonomies with different purposes and clocks.
- A one-to-one mapping is structurally invalid. Research now requires an effective-dated many-to-many `INDUSTRY_EXPOSURE_VINTAGE` bridge with source, knownAt/effective dates, exposure basis/magnitude when disclosed, confidence and revision semantics.
- Formal industry membership alone cannot prove theme exposure; capability does not prove revenue/orders; current revenue mix cannot be backfilled historically.
- D09-11 題材股與正式產業分類橋接 advanced L1 -> L2 because mechanism/schema/falsification are now defined.
- D10 side now has a taxonomy-aware reusable industry-transmission grammar; concrete industry PIT coverage remains evidence-pending.
- No change to sector gate, sector score, weights, Top6/3+3, capital, entry/exit or Formal Core.

### Exact next continuation
BR-030: prospective leader-only vs broad-participation evidence using frozen V8.14 sector-gate provenance.
BR-031: combine market confirmation with D10 physical-cycle state by knownAt without collapsing to a scalar score.
BR-032: estimate taxonomy/exposure UNKNOWN rate before any theme-level return test.


## BR-030P — preregistration complete, outcomes still waiting

- No BR-030 forward outcome was inspected on 2026-09-28. V8.14's first expected clean prospective cohort remains 2026-09-29, conditional on source/history admission.
- Source audit of `buildTodaySectorStats()` confirms member-level `changePercent` and `tradeValue` exist at decision time, while sector output already contains stockCount, breadth, avgChange, amount/activity and top-3 return leaders.
- Therefore intra-sector activity concentration is prospectively PIT-computable from same-day Taiwan market data without a new external data source.
- Preregistered descriptors include top1/top3 amount share, amount HHI, effective active names, stock-count-normalized HHI, leader-return gaps, breadth/avgChange after top-1/top-3 removal, sign stability and return dispersion.
- Raw HHI is forbidden for cross-sector comparison without sector-size normalization.
- Taiwan price-limit/event contamination is an explicit control.
- System 2 RANK-07 candidate-pool industry concentration is not duplicated: BR-030 studies concentration **within a sector's members before candidate interpretation**, while RANK-07 studies distribution **across candidates**.

### D09 maturity decision
`D09-10 產業成交值／集中度: L2 -> L3`.

Reason: member-level same-day tradeValue and industry identity already exist at the decision clock and support prospective Taiwan PIT concentration descriptors. This is a data-feasibility upgrade only.

### Explicit non-upgrades
- BR-030 itself remains WAITING_PROSPECTIVE; no leader-only vs broad outcome conclusion exists yet.
- D09-07 leadership lifecycle remains L2 until repeated PIT snapshots exist across enough independent dates.
- D09-06 sector rotation remains L2 pending clean prospective rank-transition evidence.
- No concentration threshold, hard cap, sector gate, score, ranking, quota, capital, monitoring or signal behavior changed.

### Exact next continuation
1. Wait for a valid post-V8.14 2026-09-29-or-later scan before any BR-030 outcome comparison.
2. Freeze first same-day concentration receipt without threshold tuning.
3. Join to D10 physical-cycle states only by information available as-of that scan date.


## BR-030A — 2026-09-29 first expected cohort failed history/source admission

Receipt:
`research/br030_first_prospective_admission_receipt_20260929_v0_1.json`

The first expected post-V8.14 date was audited from the production read-only 2026-09-29 diagnostic rather than inferred from calendar eligibility.

Observed history/source admission:
- required prior bars: 60;
- usable symbols: **0**;
- unusable symbols: **1,883**;
- `OFFICIAL_GAP_PROOF_UNAVAILABLE`: **1,872**;
- `INSUFFICIENT_PRIOR_BARS`: **11**;
- verified no-trade-gap symbols: 0;
- sampled blocked symbols repeatedly identify `2026-07-10` as the unresolved gap date.

The resulting read-only preview had zero general, thousand-stock and hybrid candidates.

### Research interpretation firewall
2026-09-29 is **NOT**:
- a valid BR-030 prospective observation date;
- an independent scan date;
- evidence that no sector/stock opportunity existed;
- evidence for/against the existing sector gate;
- evidence for leader-only versus broad participation.

It is a **data-admission failure date**.

`ZERO_CANDIDATES_DUE_TO_DATA_ADMISSION != ZERO_CANDIDATES_DUE_TO_MARKET_STATE`.

### Cross-room dependency
The blocker belongs to shared history/source-admission infrastructure. Room 07 records the dependency but does not alter V8.12/V8.14 Formal admission logic.

The next BR-030 date is **not automatically 2026-09-30**. A date counts only if the actual scan/readback proves history admission and the preregistered PIT fields were persisted.

### Maturity
No D09 maturity promotion or demotion:
- D09-10 remains L3 data-feasibility;
- BR-030 remains `WAITING_PROSPECTIVE / DATA_QUALITY_BLOCKED`;
- D09-06 and D09-07 remain L2.

Formal Core unchanged.

### Exact next continuation
1. On the next completed scan, verify actual history/source admission before counting the date.
2. If clean, freeze the first same-day concentration receipt without inspecting forward outcomes.
3. Accumulate the preregistered >=20 independent clean dates before first descriptive gate comparison.
4. Meanwhile continue nonblocked D09/D10 source/exposure research.


## BR-030B — 2026-07-10 blocker root cause closed at code-path level

Evidence:
- `research/br030_history_admission_dependency_20260930_v0_1.json`
- `research/HISTORY_UNSCHEDULED_CLOSURE_PROOF_CLASS_C_PROPOSAL.md`

### External truth
2026-07-10 was a legitimate whole-market non-trading date associated with the BAVI typhoon closure:
- Taipei official closure history records stop-work/stop-class on 2026-07-10;
- TWSE closure semantics close the market when Taipei City declares government-office closure before trading;
- TWSE July index history has 2026-07-09 followed by 2026-07-13.

Therefore `2026-07-10` is not a genuine missing daily K bar.

### Code-path root cause
Current production contains a preloaded 2026 `MARKET_CALENDARS` planned-holiday set. It does not contain 2026-07-10.

`loadTradingCalendar(env, year)` returns immediately when that year's map entry already exists. Therefore the preloaded 2026 calendar is not refreshed for later unscheduled emergency closures.

`historyStructuralShape()` uses `isTradingDate()`, so it incorrectly treats 2026-07-10 as an expected session and emits it as a gap.

The Formal admission path then calls `validateHistorySourceRevalidation(... allowNetwork=false ...)`, which can only consume a cached ordinary `HISTORY_PRESENCE_V1` market/date receipt. That receipt class is designed to enumerate listed/traded symbols on an open market date and requires minimum symbol coverage.

A whole-market closure is a different fact type: there are no ordinary market trades to enumerate. Without a dedicated closure proof, the date becomes `OFFICIAL_GAP_PROOF_UNAVAILABLE` for affected symbols.

### Architectural conclusion
Current V8.12 has proof paths for:
1. scheduled market holiday/weekend;
2. open-market individual-symbol no-trade/suspension vs genuinely missing traded bar.

It lacks:
3. **unscheduled whole-market closure**.

This is the exact missing proof family.

### Repair boundary
A generic `UNSCHEDULED_MARKET_CLOSURE_RECEIPT_V1` repair has been specified, with authoritative source/date/market scoping, fail-closed behavior and adversarial tests.

No one-date hardcode is proposed.

Because correcting this can change Formal feature availability and candidate eligibility, Room 07 classifies implementation conservatively as **Class C**. No implementation, merge or deployment is authorized by this research update.

### BR-030 impact
- 2026-09-29 remains invalid and must never enter the independent-date denominator.
- First valid BR-030 prospective date remains UNKNOWN until actual post-fix/post-admission readback passes.
- No sector-gate/leader-breadth outcome claim can be made yet.

Status: `ROOT_CAUSE_CONFIRMED / CLASS_C_REPAIR_PROPOSAL_READY / OWNER_APPROVAL_REQUIRED / BR030_DATA_QUALITY_BLOCKED`.


## BR-033 — Above-MA breadth requires coverage bounds, leave-one-out and redundancy controls

Artifact:
`research/br033_above_ma_breadth_contract_v0_1.json`

### Why this matters
Above-MA breadth is a cross-sectional participation state, not a duplicate label for sector return or one-day advance breadth.

### Denominator contract
For each sector/window:
- `membershipN` = PIT-valid sector members;
- `historyReadyN` = admitted-history members with finite MA;
- `passN` = history-ready members with close > MA;
- `unknownN = membershipN - historyReadyN`;
- point estimate = `passN / historyReadyN`;
- coverage = `historyReadyN / membershipN`;
- lower bound = `passN / membershipN`;
- upper bound = `(passN + unknownN) / membershipN`.

If `historyReadyN=0`, state = UNKNOWN, not 0%.

### Required research variants
- market MA20 / MA60;
- sector MA20 / MA60;
- 1-day change in each;
- candidate leave-one-out sector MA20 / MA60.

### Positive mechanism
Above-MA participation can distinguish broad trend diffusion from leader-dominated sector/index strength.

### Primary counterevidence
- missing-history denominator shrink can falsely raise the point estimate;
- a candidate can improve its own sector breadth in small sectors;
- Above-MA can be redundant with Sector RS, equal/median return, one-day breadth, leader concentration and dispersion;
- moving-average threshold crossings can whipsaw;
- parameter sweeps across many horizons/thresholds invite overfit.

### Horizon/threshold firewall
Initial windows: MA20 and MA60 only.

No 50/100/150/200-day expansion or fixed 50/55 threshold search before the first PIT receipt and redundancy test.

### Current feasibility
The research patch chain already computes market-level aboveMa20Pct/aboveMa60Pct from featureRows, and sector stats already have member/feature mapping. No new external data source is required structurally.

But 2026-09-30 recovery preview hit Cloudflare Worker 1102 after closure proof succeeded, so a clean post-repair live sector receipt is still unproven.

### Maturity
`D09-05 Above-MA廣度: L1 -> L2`.

This is mechanism/falsification maturity only. L3 remains blocked pending one clean replayable Taiwan PIT receipt with exact membership/history coverage.

Formal Core unchanged.

### Exact next
BR-034: isolated research-only receipt builder using existing feature rows + effective-dated industry membership. Freeze the first clean live receipt before outcomes.


## BR-034 — Above-MA executable receipt QA

Artifacts:
- `research/above_ma_breadth_receipt_v0_1.mjs`
- `research/test_above_ma_breadth_receipt_v0_1.mjs`
- `research/br034_above_ma_breadth_isolated_qa_v0_1.json`

An isolated research-only builder now implements the BR-033 contract without Worker/runtime/Formal wiring.

### Adversarial QA
28 deterministic assertions pass.

Covered failure/counterexample cases:
1. Full 20d/60d history coverage returns exact point estimates.
2. Partial history coverage keeps point estimate separate from membership lower/upper bounds.
3. Candidate self-inclusion can materially change a small-sector reading; leave-one-out is therefore mandatory.
4. Candidate-only valid history can produce a full-sample 100% point estimate while leave-one-out is UNKNOWN.
5. Zero history-ready members returns UNKNOWN rather than 0%.
6. MA20 may be known while MA60 remains UNKNOWN.
7. Duplicate membership identity fails closed.
8. Missing classificationSchemeId fails closed.
9. Sector partitions remain independent.

### Concrete denominator counterexample
Four sector members:
- 3 history-ready;
- 2 of those 3 above MA20;
- 1 member history UNKNOWN.

Naive ready-only point estimate = 66.67%.

But full-membership uncertainty interval is:
- lower bound = 50%;
- upper bound = 75%;
- coverage = 75%.

Therefore a raw 66.67% breadth without coverage is not a complete sector-participation statement.

### Concrete self-inclusion counterexample
Two-member sector:
- candidate is above MA20;
- peer is below MA20.

Inclusive breadth = 50%.
Candidate leave-one-out breadth = 0%.

A candidate must not be allowed to strengthen the sector evidence used to validate itself without exposing this circularity.

### Current maturity
D09-05 remains L2 after executable QA.

The QA proves deterministic semantics, not Taiwan live PIT completeness. L3 still requires one clean post-repair Taiwan receipt with:
- effective-dated membership;
- admitted history;
- exact MA20/MA60 coverage;
- replayable source/decision clocks.

No outcomes were opened. No threshold search was performed. Formal Core unchanged.

### Exact next
BR-035: when the first clean post-repair scan is available, freeze one outcome-blind live Above-MA receipt. Only after that receipt passes coverage/replay checks may redundancy diagnostics versus Sector RS, advance breadth, leader concentration and dispersion begin.


## BR-036 — Taiwan size leadership is a conditional state, not a permanent small-cap bonus

Artifact:
`research/br036_size_leadership_contract_v0_1.json`

### Taiwan-native proxy set
Use official total-return index families rather than reconstructing history with today's size ranks:
- Large: FTSE TWSE Taiwan 50;
- Mid: FTSE TWSE Taiwan Mid-Cap 100;
- Small: TWSE TAIEX Small-Cap 300 Sub-Index.

Initial research spreads:
- smallTR - largeTR;
- midTR - largeTR;
- smallTR - midTR;
at frozen D1/D5/D20/D60 horizons.

The total-return versions are preferred for performance comparison so dividend treatment is not silently inconsistent.

### Why curated mid/small indices are not interchangeable with pure size
The newer Pristine mid/small-cap products additionally screen profitability, dividends, attention, operating stability and revenue growth. Those are useful investment products but confound a pure size-leadership study.

### Positive mechanism
Large-only leadership, small/mid diffusion and broad confirmation are different market states.

Potential interpretations to test:
- large-cap leadership: institutional/global-liquidity/mega-cap earnings concentration;
- mid/small confirmation: broader risk appetite and participation;
- divergence: index strength without broad size participation.

These are hypotheses, not permanent signs.

### Strong Taiwan-specific counterevidence
Prior Taiwan research finds strong contemporaneous co-movement and does not establish a universal positive large-stock lead over small stocks.

More recent Taiwan size-effect research also points to illiquidity and price-limit/limits-to-arbitrage mechanisms as important explanations of predictable size effects.

Therefore:
`SMALL_OUTPERFORMS != AUTOMATIC_RISK_ON`
and
`LARGE_LEADS != SMALL_WILL_FOLLOW`.

### Required controls
Before any strategy use, control:
- market trend;
- sector composition / Sector RS;
- breadth / Above-MA;
- volatility / regime;
- liquidity / turnover;
- institutional flow;
- leader concentration;
- index rebalance/event state;
- price-limit/limit-hit context where available.

If size spread disappears after sector or liquidity controls, classify it as `SECTOR_MIX_DOMINATED` or `LIQUIDITY_DOMINATED`, not independent size leadership.

### PIT/source feasibility
Official Taiwan index sources provide:
- explicit large/mid/small index semantics;
- official historical index-value surfaces;
- official end-of-day values.

This supports an outcome-blind daily size-state receipt without reconstructing historical constituents.

If constituent-level attribution is later attempted, effective-dated index membership/review vintages become mandatory; current membership must not be backfilled.

### Maturity
`D09-08 大型股vs小型股領導: L1 -> L3`.

This jump covers:
- L2 mechanism/falsification;
- L3 Taiwan PIT source feasibility.

It does **not** imply predictive efficacy, OOS value or a bullish/bearish size signal.

D09-06 Sector Rotation remains L2.
D09-12 Breadth×Regime remains L2.

Formal Core unchanged.

### Exact next
BR-037: build an outcome-blind `SIZE_LEADERSHIP_RECEIPT` from official total-return index values at D1/D5/D20/D60; preserve source/knownAt clocks and add sector/liquidity controls before any outcome test.


## BR-037 / BR-039 — First official size-state receipt and official TWSE stock breadth PIT receipt

Artifacts:
- `research/br037_size_leadership_receipt_20261001_v0_1.json`
- `research/br039_twse_advance_decline_receipt_20261002_v0_1.json`

### BR-037 — first official Taiwan size-state receipt

The first common-complete total-return-index receipt is frozen at 2026-10-01 because the 2026-10-02 official page had:
- Taiwan 50 price index available but TRI = `--`;
- Mid-Cap 100 price index available but TRI = `--`;
- Small-Cap 300 TRI already available.

Therefore 2026-10-02 was **not** mixed across price/TR bases.

Official total-return returns as of 2026-10-01:

| Horizon | Taiwan 50 | Mid-Cap 100 | Small-Cap 300 |
| --- | ---: | ---: | ---: |
| D1 | +1.0808% | +0.1704% | +0.4410% |
| D5 | +1.0472% | +1.4561% | +1.7980% |
| D20 | +3.7414% | +1.1876% | +0.8257% |
| D60 | +5.4433% | -0.4964% | -4.4239% |

This produces a cross-horizon conflict:
- D5: small > mid > large;
- D20/D60: large > mid > small.

Hence `SMALL_LEAD = RISK_ON` is not an admissible one-line interpretation.
A short-horizon small-cap diffusion state can coexist inside a medium-horizon large-cap leadership regime.

D09-08 remains L3: first official state receipt is now frozen, but no outcome/OOS promotion is justified.

### BR-039 — official TWSE stock breadth

Official TWSE 2026-10-02 stock-only counts:
- up 483, of which 24 limit-up;
- down 506, of which 1 limit-down;
- unchanged 91;
- unmatched 0;
- N/A / not-comparable 2.

Comparable denominator:
`483 + 506 + 91 = 1,080`.

Derived:
- advance share = 44.72%;
- decline share = 46.85%;
- unchanged = 8.43%;
- net advance-minus-decline = -2.13 percentage points.

Contemporaneously the TAIEX closed +0.25%.

This is a direct Taiwan witness that:
`CAP_WEIGHTED_INDEX_UP != POSITIVE_STOCK_COUNT_BREADTH`.

### Universe firewall

TWSE publishes both `Overall Market` and `Stocks` counts.
The overall-market column includes non-stock instruments and must not be substituted for stock breadth.

Research must preserve separately:
1. official TWSE stock breadth;
2. official TPEx stock breadth when available;
3. System1 `TWSE_TPEX_COMBINED_FORMAL_NORMALIZED` strategy-universe breadth.

No cross-universe denominator substitution is allowed.

TWSE `N/A` includes cases such as ex-right/ex-dividend, new listing, resume trading or missing prior close; these are NOT_COMPARABLE for ordinary close-to-close A/D and are not coded as flat/up/down.

### D09 maturity decisions

`D09-04 漲跌家數／Advance-Decline: L2 -> L3`.

Reason:
official Taiwan stock-only daily up/down/unchanged counts expose decision-date PIT values with explicit comparison and N/A semantics. This is bounded Taiwan PIT data feasibility only.

No promotion:
- D09-12 remains L2;
- D09-08 remains L3;
- D09-05 remains L2 pending clean post-repair System1 history/selection lineage.

Formal Core unchanged.

### Exact next
- BR-038: accumulate independent common-complete total-return size receipts.
- BR-040: repeat TWSE stock breadth across dates, add TPEx and strategy-universe lanes without denominator mixing.
- Only after multiple independent dates may index/breadth divergence states enter D09-12 interaction testing.


## BR-041 — Cross-sectional return dispersion is a state descriptor, not a direction signal

Artifact:
`research/br041_cross_sectional_return_dispersion_contract_v0_1.json`

### Source audit
Current `buildTodaySectorStats(rows, features)` already groups same-day Taiwan rows by `industry` and reads member-level `changePercent`, `tradeValue` and symbol identity at the decision clock.

Combined with D09-01 effective-dated classification semantics, sector return dispersion is prospectively PIT-computable without a new external data source.

### Frozen metric family
Do not use one standard deviation as the whole concept.

Initial receipt must preserve:
- CSSD: sample cross-sectional standard deviation;
- CSAD: mean absolute deviation around sector mean;
- IQR: Q75-Q25;
- MAD: median absolute deviation;
- median return;
- member count / valid-return coverage;
- upside/downside descriptive dispersion;
- dispersion after removing top-1/top-3 members by **trade value**, never by realized return.

Trade-value removal is a robustness diagnostic against mega-cap/activity dominance. Removing names because their return is extreme would be outcome-conditioned and is forbidden.

### Interpretation states
Examples:
- positive sector return + low dispersion -> broad synchronized strength candidate;
- positive return + high dispersion -> selective rotation / leader differentiation candidate;
- negative return + low dispersion -> broad sell-off candidate;
- negative return + high dispersion -> idiosyncratic stress / event differentiation candidate.

No state receives a permanent bullish/bearish sign.

### Taiwan-specific falsification
Taiwan herding literature itself warns against a one-line dispersion rule:
- linear CSSD evidence and nonlinear/state-space evidence can disagree;
- more recent CSAD evidence shows herding varies with venue/microstructure, ESG grouping and market stress.

Therefore dispersion requires:
- regime;
- market/sector volatility;
- breadth;
- leader concentration;
- price-limit/event contamination;
- liquidity;
- member-count/coverage controls.

### Maturity
`D09-09 橫截面報酬離散度: L2 -> L3`.

Reason:
member return, industry identity and trade-value fields are already available at the Taiwan decision clock, and PIT classification semantics are established. This is source/data feasibility only.

D09-12 remains L2. No predictive/OOS conclusion exists.

Formal Core unchanged.

### Exact next
BR-042: build an isolated research-only CSSD/CSAD/IQR/MAD receipt with coverage and trade-value leader-removal diagnostics; freeze one source-only Taiwan date before forward outcomes.


## BR-042 — Synthetic falsification proves dispersion is directionless

Artifact:
`research/br042_dispersion_synthetic_falsification_qa_v0_1.json`

Synthetic QA deliberately separates return direction from dispersion.

Examples:
- `[+2,+2,+2,+2]`: CSSD/CSAD/IQR/MAD all 0;
- `[-2,-2,-2,-2]`: the same zero-dispersion values;
- `[+10,0,0,0]`: CSSD 5, CSAD 3.75, IQR 2.5, but MAD 0;
- `[-10,0,0,+10]`: mean 0 while CSSD ≈8.165, CSAD/IQR/MAD all 5.

These fixtures prove:
- low dispersion has no bullish/bearish direction by itself;
- high CSSD can be one-outlier-driven rather than broad differentiation;
- average return and dispersion encode different dimensions;
- robust and non-robust measures must be retained separately.

D09-09 stays L3; synthetic QA is not additional PIT evidence and does not justify L4.
D09-12 stays L2.

Exact next:
BR-043 freezes the first source-only/live Taiwan sector dispersion receipt on a clean member-universe lineage, with one fixed quantile convention and no forward outcomes.

Formal Core unchanged.


## BR-044 — Official TWSE industry-index rank transition establishes sector-rotation PIT feasibility

Artifact:
`research/br044_twse_sector_rotation_pit_pilot_20261002_v0_1.json`

### Source contract
TWSE `MI_INDEX` daily reports expose official industry price and total-return indices by date. This provides a Taiwan-native sector series that is independent from System 1's custom same-day sector score.

For rotation research, use official **total-return** industry indices when comparing multi-day relative performance so dividend treatment is not silently inconsistent.

### Bounded rank-transition witness
A seven-sector source-only pilot compares official 2026-09-23 and 2026-10-02 observations.

2026-09-23 daily-return rank within the bounded pilot:
1. 電子零組件 +1.49%
2. 半導體 +1.25%
3. 數位雲端 +0.73%
4. 油電燃氣 +0.06%
5. 航運 -0.49%
6. 金融保險 -0.78%
7. 綠能環保 -1.10%

2026-10-02:
1. 油電燃氣 +5.51%
2. 電子零組件 +2.21%
3. 航運 +0.81%
4. 金融保險 -0.11%
5. 半導體 -0.18%
6. 數位雲端 -0.21%
7. 綠能環保 -0.85%

This gives deterministic rank transitions without any arbitrary Top-N entry rule.

A useful counterexample appears immediately:
金融保險 improves from rank 6 to rank 4 even though its daily return remains negative.
Therefore:
`RANK_IMPROVEMENT != ABSOLUTE_POSITIVE_RETURN`.

### Multi-day interval context
Using the same official total-return index levels from 2026-09-23 to 2026-10-02:
- 油電燃氣: +13.01%
- 電子零組件: +4.82%
- 綠能環保: +0.55%
- 半導體: -0.13%
- 航運: -0.63%
- 數位雲端: -1.91%
- 金融保險: -2.30%

This is descriptive state evidence only, not a predictive ranking.

### Firewalls
- Seven sectors are a bounded pilot, not the full TWSE industry universe.
- The dates are not consecutive sessions; this does not estimate one-day rotation velocity.
- Cap-weighted industry indices can move on concentrated leadership; member breadth and concentration must remain separate.
- Historical page retrieval now does not authenticate original historical first-known time. Future prospective receipts use capturedAt conservatively unless native availability time is proven.
- Constituent-level interpretation requires effective-dated membership; current constituents may not be backfilled.

### Maturity
`D09-06 Sector Rotation族群輪動: L2 -> L3`.

Reason:
official Taiwan industry total-return indices are date-addressable, replayable and support continuous rank/percentile transitions under a prospective capturedAt clock. The pilot also validates a concrete rank-vs-absolute-return counterexample.

This is PIT/source feasibility only:
- no persistence/reversal alpha;
- no preferred sector;
- no Formal sector-score change;
- no System 2 weight change.

### Exact next
BR-045: create an append-only prospective daily official-industry-index receipt over the full eligible TWSE industry-index set, with rank/percentile and source clock.
Accumulate independent dates before testing persistence, reversal, breadth confirmation or stock-selection interaction.

Formal Core unchanged.


## BR-046 — ABF proves theme exposure and formal industry are many-to-many

Artifact:
`research/br046_abf_industry_exposure_bridge_v0_1.json`

### Bounded Taiwan counterexample
Current official Taiwan sources establish:

- 8046 南亞電路板:
  - TWSE formal industry = `電子零組件業`;
  - issuer official business profile explicitly lists ABF substrate, PP substrate and PCB products.

- 3189 景碩:
  - TWSE/MOPS formal industry = `半導體業`;
  - issuer official product/management sources establish FCBGA/IC-substrate and large-area high-layer-count ABF substrate exposure.

Therefore two verified ABF/IC-substrate exposures occupy different formal TWSE industries.

`FORMAL_INDUSTRY != THEME_EXPOSURE`
and
`THEME_EXPOSURE != ONE_FORMAL_INDUSTRY`.

### Bridge semantics
The bridge must be effective-dated and many-to-many:
`issuer <-> formal industry <-> product/theme/supply-chain node`.

Required clocks/fields include:
- formal classification scheme / knownAt / effectiveFrom / effectiveTo;
- theme/product exposure basis / knownAt / effective dates;
- exposure magnitude and basis when disclosed;
- revision/supersession lineage;
- source class and confidence.

### PIT firewall
Current official pages support a **prospective** bridge from the conservative capture clock.

They do not authorize:
- backfilling today's industry label to earlier dates;
- backfilling today's ABF capability to earlier dates;
- inventing revenue/order share;
- treating all members of one formal industry as theme members;
- treating a media theme label as verified company exposure.

Missing exposure magnitude remains UNKNOWN.

### Maturity
`D09-11 題材股與正式產業分類橋接: L2 -> L3`.

Reason:
a bounded Taiwan prospective many-to-many bridge can now be replayed from official TWSE industry identity and issuer-official product exposure, and the ABF pair provides an explicit taxonomy counterexample.

This is bounded Taiwan PIT feasibility only:
- historical full theme membership remains incomplete;
- exposure magnitude is mostly UNKNOWN;
- no theme-return outcome was opened;
- no theme score/weight is authorized.

D10-01 supply-chain graph remains L2 because complete effective-dated historical graph coverage is still not established.
D10-12 remains L3.

### Exact next
BR-047: append additional cross-industry theme bridges under the same prospective clock.
BR-048: seek effective-dated historical exposure vintages before any historical theme-return study.

Formal Core unchanged.


## 2026-10-03 curriculum-extension checkpoint — BR-049 / BR-050

- New approved D09-13 Industry Structure / Porter Five Forces is no longer UNSTUDIED: BR-049 freezes theory, mechanism, falsification, PIT and redundancy contracts. Maturity L0 -> L2 only.
- New approved D09-14 Market Share / Entry Barrier / Substitution / Competitive Strategy is no longer UNSTUDIED: BR-050 freezes denominator, barrier, substitution, PIT and negative-control contracts. Maturity L0 -> L2 only.
- Neither module has Taiwan PIT evidence yet; no L3 claim.
- No market-share, concentration or Five-Forces score is authorized for System1/System2 Formal.
- Exact next: BR-051 Taiwan industry-structure receipt; BR-052 Taiwan share/barrier/substitution receipt. Existing earlier BR continuations remain open.

Formal Core unchanged.


## H01 specialist result + BR-051

- H01 specialist packet completed: proposed terminal classification `SCOPE_DEDUP_ONLY`; no merge/retirement executed.
- D09-13 industry structure and D09-14 firm competitive action can legitimately diverge, but static share/capacity/price/margin evidence is one parent lineage and must not double count.
- BR-051 freezes first Taiwan foundry industry-structure PIT receipt with TSIA/ITRI 2025 foundry output plus TSMC/UMC issuer-native capability evidence.
- Denominator firewall rejects direct consolidated-revenue / industry-production-value 'market share' until measurement compatibility is proven.
- D09-13 advances L2 -> L3 data feasibility only; D09-14 remains L2 and is routed to a firm-action receipt.
- Formal Core unchanged.

Exact next: BR-052 firm-specific competitive-action/position receipt; H01 owner/dependency review remains pending.


## BR-052 / H01 final specialist classification

- BR-052 proves a unique D09-14 firm-action PIT/replay contract from official TSMC/UMC action lifecycles.
- H01 specialist classification is now `KEEP_SEPARATE`, superseding the earlier preliminary SCOPE_DEDUP_ONLY classification.
- Required ownership boundary: D09-13 industry structure; D09-14 issuer-specific strategic action/relative position.
- Shared market-share/capacity/price/margin parent evidence cannot be double counted.
- D09-14 advances L2 -> L3 data feasibility only.
- 00 governance still owns final routing/scope wording reconciliation; no retirement or Formal Core change.

Exact next: cross-industry controls and failed/delayed/cancelled strategic-action receipts before any outcome/score claim.


## BR-053 through BR-056 / H01 specialist return submitted

- BR-053 adds Taiwan steel as a second structural control: integrated BF/BOF and scrap-EAF producers require route/product/end-market decomposition.
- BR-054 adds non-semiconductor firm actions plus Foxconn/Lordstown as a bounded failed/suspended strategic-action control.
- BR-055 adds Taiwan PCB as a third industry control and proves broad industry/theme growth can coexist with opposite product/application states and concentrated upstream material power.
- BR-056 freezes native strategic-action outcome semantics and forbids an artificial cross-action scalar success score.
- D09-13 remains L3/60%; D09-14 remains L3/60%. No L4 claim.
- H01 specialist packet is now recorded in the canonical specialist intake ledger as evidence received, with KEEP_SEPARATE proposed and 00 Dependency Audit / owner review still required.
- No merge, retirement, module-count change or Formal Core change.

Exact next:
BR-057 product/application exposure denominators; BR-058 prospective action receipts before outcomes; earlier blocked/prospective BR lanes remain open and are not overwritten.


## BR-057 / BR-058 continuation

- BR-057 freezes PCB/ABF issuer product/application exposure with a strict denominator firewall. 8046/3189 product scope is evidenced, but compatible ABF/AI revenue numerators remain UNKNOWN; no synthetic exposure percentage is allowed.
- BR-058 freezes the first prospective D09-14 firm-action cohort before outcomes: UMC phased expansion and Foxconn/Mitsubishi Electric MOU. Future operational/financial/share/stock outcomes remain closed.
- D09-13 remains L3/60%; D09-14 remains L3/60%. No L4 promotion.
- D09-07 remains L2 because repeated independent PIT leadership snapshots are still insufficient.
- D09-12 remains L2 because executable market-regime producer/common-support interaction evidence is not yet promotion-grade.
- Formal Core unchanged.

Exact next:
BR-059 compatible issuer product/application revenue numerator evidence; BR-060 prospective action milestone appends. Earlier BR-035/040/043/045 lanes remain open under their original gates.


## BR-045 bounded D09-07 PIT promotion

- Five official TWSE close snapshots across all 34 industry total-return indices now provide repeated PIT leadership states.
- Participation moved MIXED -> NARROW -> BROAD -> MIXED -> MIXED across 2026-09-23, 09-24, 09-30, 10-01, 10-02.
- Top3 overlap fell to zero on 10-01 and again on 10-02, proving leader identity can turn over independently from aggregate participation.
- D09-07 advances L2 -> L3 for bounded mainstream-sector lifecycle data feasibility only.
- Individual-stock leadership lifecycle, predictive efficacy and member-level causal interpretation remain open.
- D09-12 remains L2; no Breadth×Regime promotion.
- Formal Core unchanged.

Exact next: BR-061 prospective snapshot append with unchanged semantics and later member-level common-clock joins.


## BR-062 same-clock breadth-regime gate

- D18-01/02/03 dependencies have matured to executable L3 data-feasibility layers.
- D09-04 has genuine official TWSE breadth evidence.
- D09-12 does NOT inherit maturity automatically.
- Missing object: one genuine persisted same-clock D18 context + breadth receipt with immutable source hashes.
- Historical reconstruction and test fixtures are explicitly forbidden substitutes.
- D09-12 remains L2/40%.

Exact next: BR-063 on the next genuinely completed Taiwan session.


## H01 owner-approved scope boundary — 2026-10-04

00-room Dependency Audit and anti-orphan review passed; owner approved KEEP_SEPARATE / SCOPE_DEDUP_ONLY.

Canonical names and boundaries:
- D09-13 `Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力）` — industry structural state owner.
- D09-14 `Firm Competitive Strategy／Strategic Actions（公司競爭策略／策略行動）` — issuer-specific strategic-action lifecycle owner.

Shared market-share/capacity/price/margin observations remain one parent receipt; no firm-specific action field means D09-13 only. D10 physical-capacity and D11/D17 event/news clocks are dependencies, not duplicate votes.

Both remain L3/60%; no maturity or Formal change.

Existing exact next research remains valid:
- D09-13: BR-059 compatible issuer-native PCB/ABF product/application revenue numerator evidence;
- D09-14: BR-060 prospective strategic-action milestone appends before outcomes.


## 00 control-plane receipt — H08 closure / H10 owner gate

H08 is CLOSED_NO_STRUCTURAL_CHANGE:
- D09-11 remains the effective-dated theme/industry/issuer membership bridge.
- D17-11 remains event/news propagation.
- D20-11 remains independent social-language/topic/stance narrative diffusion.
- one theme/headline/social lineage cannot become three independent votes.
- D09-11 remains L3/60%.

H10 audit reached OWNER_APPROVAL_REQUIRED:
- D10-12 = structural exposure graph producer.
- D17-04 = event-specific direct-attribution consumer.
- D17-05 = event-specific second-order path consumer.
- D17 overlays must reference D10 effective-dated exposure edges rather than rebuild a second graph from headlines.
- no canonical wording mutation until explicit owner approval.

Audits:
- shared-knowledge/CURRICULUM_H08_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md
- shared-knowledge/CURRICULUM_H10_SCOPE_DEDUP_AUDIT_20261004_V0_1.md


## 2026-10-05 07-room continuation — SDA-009 + BR-059B

- SDA-009 D09 circular industry-strength remediation semantics are frozen in `research/SDA009_D09_LEAVE_ONE_OUT_CIRCULARITY_CONTRACT_V0_1.md` and machine JSON.
- Confirmed self-influence paths: same-day sector hard gate, 14% sector term in priorityScore, and sectorScore-dependent history warmup priority.
- Existing 20-day sector peer return already excludes the candidate and is retained as the good-control precedent.
- System 1 next: diagnostic-only inclusive vs leave-one-out sector state, self-contribution, gate flip, raw-vs-LOO rank/Top6 and warmup-priority deltas. No Formal mutation without owner approval.
- D16 next after machine receipts: common-support residual/rank/Top6 validation. 00 remains closure owner.
- BR-059B added Nan Ya PCB 8046 official 2025 AI/HPC application revenue share = 16% under total operating-revenue denominator; this is not ABF-specific.
- Kinsus 3189 official bounded scan remains qualitative for AI/FCBGA/ABF contribution; numeric magnitude stays UNKNOWN.
- D09-13 remains L3/60%; D09 domain maturity remains unchanged by these findings.

Exact next continuation:
1. BR-059 continue independent issuer-native application/product numerator search, prioritizing ABF-specific numeric disclosure for 3189/8046 while preserving UNKNOWN.
2. Keep SDA-009 open until System 1 diagnostic implementation + D16 common-support readback + 00 closure.
3. Do not change Formal sector gate, sector score, ranking, Top6, capital or trading behavior in this research room.


## SDA-009 priority audit — circular industry-strength reward research contract

Status: RESEARCH_REMEDIATION_CONTRACT_FROZEN / D16_REQUIRED / FORMAL_CORE_UNCHANGED
Date: 2026-10-05 Asia/Taipei

### Audit finding
A candidate stock must not help create an industry-strength state and then receive a second independent reward from that same self-created state. Industry strength can be economically real, but self-contribution creates mechanical circularity and can inflate ranking confidence, especially in concentrated industries.

### Mandatory candidate-specific leave-one-out state
For candidate i in industry g at decision time t, compute the industry feature twice under the same membershipVersion and clock:
1. full-industry state including i;
2. leave-one-out state excluding i from numerator, denominator and any rank/breadth/concentration primitive that can inherit i's return/volume contribution.

The candidate-specific industry vote is eligible for independent interpretation only when the leave-one-out state remains defined with adequate peer support. If exclusion leaves too few peers or unstable denominator coverage, state = UNKNOWN/ABSTAIN; never fall back to the full measure.

### Effective-dated membership firewall
Every replay must bind issuer, formal industry/classification scheme, effectiveFrom/effectiveTo, knownAt, membershipVersion and source vintage. Current membership cannot be backfilled into historical decisions. Classification level/scheme is frozen before outcomes; alternative classification systems are sensitivity checks, not researcher-selected replacements after seeing performance.

### Residual/incrementality test
D09 industry strength must be tested against the candidate's own return/momentum primitive rather than counted as automatically independent. Required comparisons:
- own-stock primitive only;
- full-industry measure;
- leave-one-out industry measure;
- own-stock + leave-one-out industry measure;
- residualized industry component after controlling for own-stock primitive and predeclared common market/style controls.

If leave-one-out or residualization removes the apparent advantage, classify the industry vote as redundant/mechanical, not additional Alpha.

### Adversarial controls
Required negative controls include concentrated industries where one constituent dominates the industry measure, single/near-single-member groups, membership changes, classification-level changes, limit-hit/extreme-return leaders, and dates where full vs leave-one-out industry rank crosses the selection threshold.

### Closure evidence for SDA-009
Research-side closure remains blocked until a replay table exists with candidate/date/membershipVersion, full vs leave-one-out industry values/ranks, self-contribution share, denominator/support diagnostics and residual test state. System 1 must separately implement membershipVersion, constituentContribution diagnostics and circular-reward flag. D16 must read back Top6/rank before-vs-after self-contribution removal and evaluate incremental OOS/Shadow evidence. Only 00 may close the audit ticket.

### Literature/counter-evidence note
Prior literature supports genuine industry momentum, but that does not validate circular scoring. Industry classification granularity can materially alter industry-momentum results, and Taiwan evidence includes reversal regimes. Therefore the null hypothesis is preserved: after self-removal, fixed-vintage membership and own-stock residual controls, the D09 vote may have zero or negative incremental value.

### Maturity decision
No maturity promotion from this audit-contract work. D09 remains 57.1% aggregate in the canonical tracker. This closes a semantic/falsification gap only; it does not provide the required leave-one-out replay, Top6/rank comparison or D16 outcome evidence.

### Exact next
SDA-009-R1: build the first Taiwan candidate/date leave-one-out replay table on existing D09 PIT receipts, prioritizing concentrated-industry threshold-crossing cases; freeze membershipVersion and support denominator. Then hand the same receipt schema to System 1 for constituentContribution/circular-reward diagnostics and to D16 for before/after rank readback. Existing BR lanes remain open but SDA-009 is priority until R1 is durable.


## SDA-009 R1 replay preflight — atomic-input sufficiency gate

Artifact: `research/SDA009_R1_REPLAY_PREFLIGHT_20261005_V0_1.md`

Status: R1_PREFLIGHT_COMPLETE / LIVE_CANDIDATE_LEVEL_REPLAY_COUNT_0 / MACHINE_RECEIPT_REQUIRED / FORMAL_CORE_UNCHANGED

Production readback reconfirms three circularity paths: inclusive sector hard gate, 14% sector-score ranking term, and sector-score history-warmup priority. Existing 20-day sector peer return already excludes the candidate and remains the local precedent.

The 2026-09-11 Formal backfill provides five candidate/date anchors, but not the complete same-date sector atomic denominator. Official TWSE industry-index receipts also cannot substitute because Formal uses a custom sector composite. Therefore no historical leave-one-out number is fabricated.

R1 data sufficiency is now frozen: exact replay requires effective-dated membership/version plus per-member change, trade amount, 20-day amount readiness and candidate-specific max-sector-amount recomputation. Missing lineage fails closed; zero peers = UNKNOWN; one peer = SMALL_N_SENSITIVE.

Maturity: D09 remains 57.1%; no promotion from preflight/governance work.

Exact next: SDA-009-R2 obtain the first genuine candidate-level machine receipt containing inclusive + leave-one-out sector state on one Taiwan scan date, then build the first common-support replay table and classify gate/rank/Top6 effects. Until that receipt exists, System 1 diagnostic implementation is the blocking dependency and historical proxy reconstruction is prohibited.


## SDA-009 R2 receipt oracle implemented

Artifact:
- `research/SDA009_R2_RECEIPT_ORACLE_CHECKPOINT_20261006.md`
- `research/sda009_r2_receipt_oracle_v0_1.mjs`
- `research/test_sda009_r2_receipt_oracle_v0_1.mjs`

Status: R2_ORACLE_IMPLEMENTED / DETERMINISTIC_TEST_PASS_12 / GENUINE_RECEIPT_COUNT_0 / SYSTEM1_DIAGNOSTIC_PENDING / FORMAL_CORE_UNCHANGED

The research room no longer waits passively for engineering. A fail-closed executable oracle now classifies candidate-level inclusive-vs-leave-one-out receipts as NO_MATERIAL_SELF_EFFECT, SCORE_ONLY_SELF_EFFECT, GATE_FLIP, RANK_FLIP, TOP6_FLIP, SMALL_N_SENSITIVE or BLOCKED while preserving all mechanical effect flags.

Local isolated validation passes 12 deterministic assertions. This proves classifier semantics only, not Taiwan-market effect size.

Latest visible genuine System 1 C1 evidence collection run `37382689418` failed for scanDate `2026-10-05` with `C1_GENERATION_NOT_FOUND` / `FORMAL_SCAN_NOT_CONFIRMED`. It explicitly cannot count as a zero-pick date. Therefore missing receipt must not be interpreted as no circularity.

D09 maturity remains 57.1%; no promotion. D16 remains required for economic materiality and incrementality.

Exact next: `SDA-009-R3` consume the first verified same-generation candidate-level System 1 inclusive-vs-LOO receipt through the oracle; freeze the first common-support gate/rank/Top6 comparison with BLOCKED/UNKNOWN rows retained. Until the System 1 diagnostic exists and a verified C1 generation is available, do not fabricate historical replay values.


## SDA-009 deep falsification V0.2 — current-path correction and capital spillover

Artifacts:
- `research/SDA009_D09_DEEP_FALSIFICATION_V0_2.md`
- `research/SDA009_SYSTEM1_DIAGNOSTIC_HANDOFF_20261006_V0_2.md`

Status: CURRENT_PATH_INVENTORY_CORRECTED / CAPITAL_CIRCULARITY_ADDED / WARMUP_PATH_DOWNGRADED_DORMANT / DIRECTIONAL_FALSIFICATION_FROZEN / FORMAL_CORE_UNCHANGED

Latest-main readback corrects the earlier SDA-009 path inventory.

Confirmed active current paths:
1. candidate-inclusive sector hard gate (breadth / avgChange / amountVs20DayAverage);
2. sector score inside priorityScore plus later sectorFlow tie-break, with actual rank impact conditional on earlier comparator precedence;
3. post-selection capital allocation because allocation weights use priorityScore across the merged selected set.

The prior history-warmup claim is downgraded. `chooseHistoryWarmupTargets` / `coarseWarmupScore` remain defined but no active call site exists in latest main; current 18:10 path sets `warmupTargets=[]`, and current seed queue does not consume sector score. Therefore warmup circularity is LEGACY_OR_DORMANT, not current production evidence.

New material finding: selection seats are pool-specific 3+3, but allocation is shared after the GENERAL and THOUSAND selections are merged. A candidate self-inflated priorityScore can therefore alter peer capital across pools even without changing its own pool seat. If the candidate is already capped at 35%, additional score inflation may leave its own allocation unchanged while still reducing peer allocation and increasing residual cash.

Directional falsification is now mandatory. Candidate self-inclusion can cause both SELF_PROMOTION and SELF_SUPPRESSION. The 40% breadth gate has exact small-N discontinuities; e.g. n=5 with two positive names is 40%, while excluding a positive candidate leaves 1/4=25%; n=3 with a non-positive candidate and one positive peer is 33.33%, while excluding the candidate leaves 1/2=50%.

Score attribution must separate local constituent effect from cross-sector maxAmount normalizer externality. Rank diagnostics must preserve comparator precedence. Generic global Top6 comparison is insufficient; receipts must preserve GENERAL/THOUSAND pool identity and pool Top3 state.

External falsification context remains non-directional: Taiwan momentum can reverse under market-state transitions/persistence changes, and industry-momentum behavior varies with classification granularity. These are D16 sensitivity controls, not additional Alpha votes.

Maturity decision: D09 remains 57.1%. No promotion because genuine candidate-level leave-one-out Taiwan receipt count remains 0 and D16 economic evidence is absent.

Exact next:
- `SDA-009-R3A`: System 1 consumes the V0.2 handoff and implements diagnostic-only gate/rank/pool/allocation/normalizer/direction fields while preserving all Formal outputs.
- `SDA-009-R3B`: Room07 consumes the first verified genuine same-generation receipt and freezes common-support gate direction, pool-seat flip, comparator-attributed rank flip, allocation redistribution and BLOCKED/UNKNOWN states.
- D16 then evaluates economic incrementality under preregistered sector-size, classification-vintage and PIT-valid state controls.


## SDA-009 R3 oracle V0.2 — directional/pool/allocation acceptance

Artifact:
- `research/SDA009_R3_ORACLE_V0_2_CHECKPOINT_20261006.md`
- `research/sda009_r3_receipt_oracle_v0_2.mjs`
- `research/test_sda009_r3_receipt_oracle_v0_2.mjs`

Status: R3_ORACLE_V0_2_IMPLEMENTED / DETERMINISTIC_PASS_16 / GENUINE_RECEIPT_COUNT_0 / SYSTEM1_DIAGNOSTIC_PENDING / FORMAL_CORE_UNCHANGED

V0.2 replaces the coarse global-Top6 interpretation with the actual 3+3 pool semantics. It preserves GENERAL/THOUSAND pool rank and pool Top3 state, self-promotion vs self-suppression direction, local constituent contribution vs max-normalizer externality, comparator-attributed rank flips and capital-allocation spillover.

A rank flip without comparator attribution now fails closed. Candidate/peer allocation changes and residual-cash deltas are visible but remain mechanical evidence only; D16 economic interpretation is still required.

Local isolated validation passes 16 deterministic assertions. This is oracle validation, not Taiwan-market effect evidence.

00 independent readback still reports SDA-009 as a true System1 S1 blocker. Genuine candidate-level LOO receipt count remains 0. D09 remains 57.1%; no maturity promotion.

Exact next:
- `SDA-009-R3A`: System1 implements the V0.2 research-only diagnostic and emits first verified same-generation receipt.
- `SDA-009-R3B`: Room07 consumes it with the V0.2 oracle and freezes common-support gate direction, pool-seat flip, comparator-attributed rank flip, allocation redistribution and normalizer externality.
- D16 then evaluates incremental/economic relevance.


## SDA-009 R3 identifiability / cohort firewall V0.3 — minimal C1 atomic path

Artifacts:
- `research/SDA009_R3_IDENTIFIABILITY_AND_COHORT_FIREWALL_V0_3.md`
- `research/sda009_r3_identifiability_contract_v0_3.json`
- `research/sda009_c1_atomic_replay_prototype_v0_3.mjs`
- `research/test_sda009_c1_atomic_replay_prototype_v0_3.mjs`

Status: IDENTIFIABILITY_TIERS_FROZEN / TWO_ATOM_C1_REPLAY_PROTOTYPE_PASS_18 / GENUINE_RECEIPT_COUNT_0 / FORMAL_CORE_UNCHANGED

SDA-009 incidence must not be measured on selected-only, qualified-only, current sector-gate passers only, `basePassed=true` only, or bounded rejected samples. `basePassed=true` is not equivalent to actual sector-gate execution reach because current Formal has `basePassed=true` failures before the sector gate.

Frozen denominator layers:
P0 = full immutable same-generation C1 parent;
P1 = actual SECTOR_GATE_REACHED population;
P2 = mechanically identifiable LOO rows;
P3 = decision-relevant ex-sector rows;
P4 = rank-identifiable rows;
P5 = allocation-identifiable rows.

Current C1 is a strong parent but is not sufficient for exact full LOO replay. The minimum research-only C1 extension is two already-in-memory atoms on every row:
- `currentChangePercent`;
- `currentTradeValue`.

With existing industry, feature.historyDays and feature.avgAmount20, those two atoms are sufficient to reconstruct current Formal sector primitives, activity ratio, sector amount, cross-sector max amount and sector score in a pure research analyzer with zero new provider calls.

Membership lineage additionally requires classificationSchemeId, membershipVersion and membershipDigest. Recommended digest semantics: SHA256 over sorted symbol|industry pairs, proving the exact runtime grouping without claiming official historical taxonomy.

Mandatory trust gate: reconstruct the inclusive production sector state first. Any mismatch => `BLOCKED_PARITY_MISMATCH`; no LOO result from that generation is interpretable.

Pure prototype:
`research/sda009_c1_atomic_replay_prototype_v0_3.mjs`.

Local isolated Node.js v22.16.0:
PASS / 18 assertions.

The prototype covers inclusive reconstruction, self-promotion, self-suppression, activity LOO, local contribution, max-normalizer externality, zero peers UNKNOWN, one-peer SMALL_N_SENSITIVE, missing atom BLOCKED and parity mismatch BLOCKED.

Candidate-specific full LOO may use a different max-sector-amount normalizer for each candidate. That is valid for causal self-effect but cross-candidate scores are not automatically comparable. Gate analysis may proceed; rank/seat remains UNKNOWN until a cross-candidate comparison policy is frozen and tested.

Mechanical gate flip is separate from decision relevance. A flip is decision-relevant only when independent non-sector downstream gates are PASS on the same generation.

Self-promotion and self-suppression are asymmetric for rank evidence: current qualified self-promotion cases can often identify removal/seat loss from frozen actual pool rank; current sector-gate-rejected self-suppression cases lack an observed qualified counterfactual ranking tuple, so exact seat gain remains UNKNOWN unless ranking primitives are available.

Allocation effects must be decomposed into PURE_SCORE_WEIGHT_EFFECT / SELECTION_COMPOSITION_EFFECT / DEPLOY_RATIO_REGIME_EFFECT / POSITION_CAP_EFFECT / NTD_FLOORING_EFFECT.

Maturity: D09 remains 57.1%. Genuine Taiwan candidate-level LOO receipt count remains 0; D16 outcome evidence remains absent.

Exact next:
- `SDA-009-R3A1`: System1 verifies two-atom C1 extension + membership identity and inclusive reconstruction parity.
- `SDA-009-R3A2`: after parity PASS, wire a pure C1-side LOO analyzer beside existing C1 sector-component evidence.
- `SDA-009-R3B`: Room07 consumes the first genuine same-generation receipt using P0-P5 denominator accounting and the V0.2 oracle.
- D16 then performs common-support economic validation.


## SDA-009 R3 V0.4 — effective-build authority and layered parity

Artifact:
- `research/SDA009_EFFECTIVE_BUILD_AND_PARITY_CORRECTION_V0_4.md`
- `research/sda009_effective_build_parity_correction_v0_4.json`
- `research/sda009_c1_atomic_replay_prototype_v0_4.mjs`
- `research/test_sda009_c1_atomic_replay_prototype_v0_4.mjs`
- `research/sda009_r3_receipt_oracle_v0_4.mjs`
- `research/test_sda009_r3_receipt_oracle_v0_4.mjs`
- `research/SDA009_R3_V0_4_CHECKPOINT_20261006.md`

Status: EFFECTIVE_BUILD_AUTHORITY_CORRECTED / GATE_SCORE_PARITY_SPLIT / ATOMIC_REPLAY_PASS_29 / RECEIPT_ORACLE_PASS_30 / GENUINE_RECEIPT_COUNT_0 / FORMAL_CORE_UNCHANGED

Important correction:
the repository baseline Worker.js is not the authoritative post-patch deployed Worker for comparator semantics.

The production workflow applies `scripts/apply_v7_5_30.py`, which changes ranking to priorityScore first, then rewardPerRisk, marketConsensusScore, setupQuality, sectorFlow and relativeStrength. V8.20 deploy run `37483896567` succeeded, including the V7.5.30 patch, V8.15.4 provenance patch, Behavioral regression, deployment and deployed-version/config verification.

Therefore prior V0.2 wording that treated rewardPerRisk as the first effective comparator is SUPERSEDED.

SDA-009 implication:
sector score contributes 14% to base priorityScore and effective post-consensus priorityScore is comparator #1. Sector self-contribution can therefore affect rank without requiring an RR tie, but exact rank/seat effect still requires runtime-equivalent final priority values and same-generation cross-candidate identifiability.

Priority-delta correction:
`0.14 × sectorScoreDelta` is only `structuralUnroundedSectorContributionDelta`. It must not be called the final priorityScore delta because production also applies clamp, one-decimal rounding, market-consensus bonus, then post-consensus clamp/rounding.

Parity is now layered:
- gate analysis requires `gateParityState=PASS` against stored production breadth / avgChange / amountVs20DayAverage;
- score/rank/allocation additionally require production sectorScore or a generation-level sectorDecisionStateDigest;
- missing production score proof => `SCORE_EFFECT_UNVERIFIED`, not a score/rank conclusion.

Recommended score-parity reference:
generation-level sectorDecisionStateDigest over sorted score-relevant per-industry fields: industry, stockCount, historicalCoverage, amount, breadth, avgChange, amountVs20DayAverage, score; bind it to scanDate, generationId, sourceMainSha, effectiveRuntimeVersion, membershipDigest and projectionVersion.

V0.3 prototype self-falsification:
stored-inclusive parity had been optional in code despite being mandatory in the written contract. V0.4 fixes this fail-closed defect.

Local isolated validations:
- V0.4 atomic replay prototype: PASS / 29 assertions.
- V0.4 layered receipt oracle: PASS / 30 assertions.

V0.4 receipt authority:
- gate flip requires gate parity PASS;
- score effect requires score parity PASS;
- rank flip requires rankIdentifiability PASS + effective comparator version + comparator attribution;
- pool-seat flip requires rankIdentifiability PASS + effective comparator version;
- allocation effect requires allocationIdentifiability PASS.

A lower-layer calculable effect cannot auto-promote a higher-layer conclusion.

System1 implementation search at this checkpoint still finds no SDA-009 runtime implementation of candidateSelfContribution, C1 currentChangePercent/currentTradeValue extension, membershipDigest or parity receipt. Genuine candidate-level Taiwan receipt count remains 0.

Maturity: D09 remains 57.1%; no promotion.

Exact next:
- `SDA-009-R3A1`: System1 adds the two C1 row atoms + exact membership identity + production sectorScore or sectorDecisionStateDigest, then proves gate and score inclusive parity against the effective built runtime.
- `SDA-009-R3A2`: after parity PASS, execute pure C1-side candidate LOO and emit first genuine receipt.
- `SDA-009-R3B`: Room07 evaluates the genuine receipt with V0.4 oracle and P0-P5 denominator accounting.
- D16 performs common-support economic/incremental validation after genuine evidence exists.


## SDA-009 R3 V0.5 — capture-minimality and dual-counterfactual contract

Artifacts:
- `research/SDA009_R3_CAPTURE_AND_COUNTERFACTUAL_CONTRACT_V0_5.md`
- `research/sda009_r3_capture_and_counterfactual_contract_v0_5.json`
- `research/sda009_r3_capture_contract_v0_5.mjs`
- `research/test_sda009_r3_capture_contract_v0_5.mjs`
- `research/SDA009_SYSTEM1_R3A1_MINIMAL_CAPTURE_HANDOFF_V0_5.md`

Status: R3A1_IMPLEMENTABILITY_PROVEN / CAPTURE_DONT_RECOMPUTE / DUAL_COUNTERFACTUALS_FROZEN / UNCLASSIFIED_FIREWALL_FROZEN / DETERMINISTIC_PASS_12 / GENUINE_RECEIPT_COUNT_0 / FORMAL_CORE_UNCHANGED

Code-path verification confirms the existing C1 builder already receives the complete same-generation todayRows and the exact production sectorStats consumed by Formal. The row map still has the normalized raw row in scope.

Therefore R3A1 needs no new provider calls and no second production sector calculator.

Minimum row capture:
- currentChangePercent from raw.changePercent;
- currentTradeValue from raw.tradeValue.

Minimum generation capture:
- classificationSchemeId;
- membershipVersion;
- membershipDigest over sorted market|symbol|industry;
- sectorDecisionStateVersion;
- sectorDecisionStateProjection;
- sectorDecisionStateDigest over the exact production sectorStats score-relevant projection.

The production projection fields are:
industry / stockCount / historicalCoverage / amount / breadth / avgChange / amountVs20DayAverage / score.

V8.14 SECTOR_GATE_REJECTED is bounded diagnostic sampling and is explicitly forbidden as the SDA-009 incidence denominator. Full immutable C1 remains P0.

The runtime fallback industry `未分類` is now a frozen research state:
`UNCLASSIFIED_PSEUDO_BUCKET`.
Mechanical circularity can be measured, but industry-economic/alpha interpretation is forbidden and D16 must retain it separately.

Two counterfactual questions are now separated:

1. `SDA009_FOCAL_SELF_ATTRIBUTION_V0_1`
   - only focal candidate uses own LOO state;
   - peers retain production values;
   - answers marginal self-contribution attribution.

2. `SDA009_FULL_SELF_EXCLUDED_POLICY_V0_1`
   - every candidate uses own candidate-specific LOO state;
   - candidate-specific max-amount normalizer is explicitly part of the policy;
   - answers full de-circularized 3+3 policy sensitivity.

They must not share one unlabeled rankDelta/seatFlip result.

R3A2 ranking gap is now narrowed:
currently sector-gate-rejected candidates have no actual post-consensus ranking tuple. Exact resurrected rank later needs only same-generation marketConsensusSources or exact marketConsensusBonus in addition to already durable C1 derivations and the R3A1 sector state.

Gate reach is versioned from actual first-failure semantics:
pre-sector failure => NOT_REACHED;
sector failure => REACHED_AND_FAILED_SECTOR;
later failure => REACHED_AND_FAILED_LATER;
Formal success => REACHED_AND_PASSED;
unknown reason => UNKNOWN fail-closed.

Isolated V0.5 contract validation:
PASS / 12 assertions.

Maturity: D09 remains 57.1%. This round proves implementation minimality and closes additional inference ambiguity, but System1 engineering is still pending, genuine Taiwan candidate-level receipt count is 0 and D16 economic evidence is absent.

Exact next:
- `SDA-009-R3A1`: System1 implements the two row atoms + six generation capture fields from already-in-scope C1/raw/sectorStats data, zero new provider calls.
- `SDA-009-R3A1-PARITY`: first genuine built-runtime receipt proves membership, sector-state, gate and score parity.
- `SDA-009-R3A2`: capture same-generation market consensus input for all feature-admitted rows, then emit separately labeled focal-attribution and full-self-excluded-policy results.
- `SDA-009-R3B`: Room07 evaluates the first genuine receipt with P0-P5 common-support accounting before D16 validation.


## SDA-009 Room07 research responsibility complete — engineering / D16 pending

Artifacts:
- `research/SDA009_ROOM07_RESEARCH_COMPLETION_AND_D16_HANDOFF_20261007.md`
- `research/SDA009_SYSTEM1_R3A1_CODEX_TASK_CHECKPOINT_20261007.md`
- `research/sda009_r3a1_acceptance_oracle_v0_6.mjs`
- `research/test_sda009_r3a1_acceptance_oracle_v0_6.mjs`

Status: ROOM07_RESEARCH_RESPONSIBILITY_COMPLETE / SYSTEM1_R3A1_ENGINEERING_PENDING / GENUINE_RECEIPT_COUNT_0 / D16_PENDING / SDA_TICKET_NOT_CLOSED / FORMAL_CORE_UNCHANGED

Room07 has completed the research/falsification/identifiability/capture-contract/oracle responsibility for SDA-009 up to the System1 engineering boundary.

Final research-side executable acceptance:
- V0.5 capture/counterfactual contract test: PASS / 12 assertions.
- V0.6 R3A1 acceptance oracle test: PASS / 23 assertions.
- The execution was performed in an isolated local Node.js environment after latest-main file readback. The local container had no external DNS; that transport limitation was not treated as a test outcome.

V0.6 future genuine-receipt acceptance requires:
- full C1 parent completeness;
- per-row currentChangePercent/currentTradeValue;
- classificationSchemeId/membershipVersion/membershipDigest;
- sectorDecisionStateProjection/digest;
- reconstructed inclusive sector parity;
- score parity;
- unclassified pseudo-bucket separation.

A PASS only authorizes candidate LOO gate/score research. It does not authorize R3A2 rank, Formal mutation, or SDA closure.

The two research counterfactuals remain distinct:
- SDA009_FOCAL_SELF_ATTRIBUTION_V0_1;
- SDA009_FULL_SELF_EXCLUDED_POLICY_V0_1.

D16 trigger is frozen to the first genuine same-generation receipt after R3A1 parity PASS. Required P0-P5 denominator accounting and layered mechanical/decision/allocation/economic estimands are documented in the completion handoff.

Room07 exact next until System1 evidence exists:
`WAIT_FOR_GENUINE_SYSTEM1_R3A1_RECEIPT / DO_NOT_REDESIGN_SEMANTICS`.

When genuine receipt exists:
1. run `sda009_r3a1_acceptance_oracle_v0_6.mjs`;
2. if PASS, run candidate LOO;
3. run `sda009_r3_receipt_oracle_v0_4.mjs`;
4. freeze P0-P5 common-support readback;
5. hand immutable result to D16.

System1 engineering handoff is durable at:
`research/SDA009_SYSTEM1_R3A1_CODEX_TASK_CHECKPOINT_20261007.md`.

Recommended engineering route:
Codex / GPT-6 Astra / High.

D09 maturity remains 57.1%. No maturity promotion without genuine Taiwan receipts and D16 evidence.


## BR-035 / BR-063 2026-10-07 evidence readback

Artifacts:
- `research/BR035_ABOVE_MA_PARENT_GENERATION_BLOCKER_20261007.md`
- `research/br035_above_ma_parent_generation_blocker_20261007_v0_1.json`
- `research/BR063_BREADTH_REGIME_REPLAY_WITNESS_20261006_V0_1.md`
- `research/br063_breadth_regime_replay_witness_20261006_v0_1.json`
- `research/BR063_D18_SAME_CLOCK_CAPTURE_DEPENDENCY_20261007.md`

### BR-035 / D09-05 Above-MA breadth

System1 prospective C1 run `37495670280` preserved an explicit readiness blocker:
- scanDate 2026-10-06;
- `C1_GENERATION_NOT_FOUND`;
- Formal scan date still 2026-09-29;
- Formal pipeline incomplete;
- qualityReady=false;
- missing quality = FINANCIAL / QUARTER_EPS;
- eligibleForResearch=false;
- mayCountAsZeroPick=false.

Interpretation:
this is a missing parent generation, not an Above-MA result.
No MA20/MA60 live receipt is inferred or reconstructed.

D09-05 remains L2 / 40%.

Exact next:
first complete verified same-generation C1 parent -> run the already-tested isolated Above-MA builder -> freeze no-outcome live receipt.

### BR-063 / D09-12 Breadth × Regime

2026-10-06 official market data provides a real replay witness:
- TWSE stock-only: 462 up / 519 down / 100 flat / 2 N-A;
- TPEx: 300 up / 475 down / 90 flat / 28 untraded/suspended;
- combined descriptive comparable N = 1,946;
- combined descriptive advance share = 39.1572%;
- decline share = 51.0791%;
- net breadth = -11.9219 percentage points.

Official index context:
- TAIEX 49,822.55, +0.22%;
- TPEx index 430.86, -0.37%.

Exact D18 TAIEX replay formula over the official 25-session close window gives:
- MA20 = 47,453.461;
- MA20Slope5 = +632.6625;
- D5 return = +4.59899%;
- D20 return = +7.02758%;
- RV5 = 0.0085638343;
- RV20 = 0.0100403787;
- RV5/RV20 = 0.8529393744;
- trendContext = UP_TREND_CONTEXT;
- volatilityDirection = VOL_CONTRACTING.

This is a real descriptive index/breadth divergence witness, but NOT a genuine BR-063 prospective joint receipt.

The actual same-day System2 scheduled run `37419347091` proves:
- workflow conclusion SUCCESS;
- dailyGateComplete=false;
- sameSessionClockReady=false;
- requiredReady=false;
- precisionEligible=false;
- TWSE A1: 30 attempts / no READY;
- TPEx A1: first READY 2026-10-06T08:03:54.274Z;
- A2 TAIEX: attemptCount=0;
- B2 dependency coverage=false;
- exactDecisionClockAuthorized=false.

Repository workflow search finds no alternate same-day scheduled A2 TAIEX capture.

Therefore:
- 2026-10-06 = REAL_MARKET_REPLAY_WITNESS;
- prospective same-clock eligibility = false;
- canonical D18 breadth label remains CONTEXT_RAW because median-return continuity is not same-clock certified;
- D09-12 remains L2 / 40%.

Cross-room dependency is frozen at:
`research/BR063_D18_SAME_CLOCK_CAPTURE_DEPENDENCY_20261007.md`.

Exact next:
future completed Taiwan session -> actual prospective A2 + breadth under one exact decision timestamp -> immutable joint receipt -> Room07 no-outcome QA -> only then reconsider D09-12 L3.

### Maturity

D09 remains 57.1%.
No maturity promotion.
SDA-009 exact next remains authoritative and is not overwritten by this parallel research work.


## BR-059 D09-13 issuer-native ABF numerator upper-bound firewall — 2026-10-07

Artifact:
- `research/BR059_D09_13_ABF_REVENUE_NUMERATOR_BOUNDARY_20261007.md`

Status: ISSUER_NATIVE_UPPER_BOUND_EVIDENCE_FROZEN / 3189_ABF_NUMERATOR_UNKNOWN / 8046_ABF_NUMERATOR_UNKNOWN / TAXONOMY_FIREWALL_STRENGTHENED / OUTCOMES_CLOSED

Official 2025 issuer-native disclosure now provides numeric broad-category upper bounds for both priority issuers:

### 3189 Kinsus
2025 consolidated revenue:
- total: NTD 39,351,096 thousand;
- substrate operating segment: NTD 32,311,845 thousand;
- substrate share of total: approximately 82.11%.

This is a valid broad substrate-business upper bound only.
It is not an ABF-specific numerator because the substrate segment contains multiple substrate technologies/products.

Frozen:
`KINSUS_3189_ABF_NUMERATOR = UNKNOWN`.

### 8046 Nan Ya PCB
2025 consolidated revenue:
- total: NTD 40,172,990 thousand;
- broad "circuit board" category: NTD 39,060,099 thousand;
- broad category share of total: approximately 97.23%.

Issuer-native product scope includes conventional PCB, HDI, rigid-flex, ABF substrate and PP substrate.

Therefore the broad circuit-board category is only an upper bound and is not an ABF-compatible numerator.

Frozen:
`NANYA_8046_ABF_NUMERATOR = UNKNOWN`.

### Cross-issuer firewall

The two available 2025 numeric scopes are not mutually comparable:
- 3189 = substrate operating segment;
- 8046 = broad circuit-board product category.

Neither equals ABF revenue.

Forbidden substitutions:
- AI/HPC application revenue -> ABF revenue;
- substrate segment share -> ABF share;
- broad circuit-board share -> ABF share;
- capacity/shipment/roadmap -> revenue numerator;
- sell-side/media estimates -> issuer-native numerator.

This round materially improves measurement validity but does not create a new Alpha result.

D09-13 remains L3 / 60.
D09 remains 57.1%.

Exact next:
`BR-059A` continue issuer-native annual-report / investor-presentation search for mutually exclusive product-level disclosure that can isolate ABF for 3189 or 8046. If unavailable, retain UNKNOWN and keep current values as upper bounds only.

SDA-009 remains interrupt-priority:
if the first genuine System1 R3A1 receipt appears, immediately pause BR-059A and run the V0.6 acceptance oracle.


## BR-059A D09-13 forecast-vs-realized ABF firewall — 2026-10-07

Artifact:
- `research/BR059A_D09_13_ABF_FORECAST_VS_REALIZED_REVENUE_FIREWALL_20261007.md`

Status: FORECAST_VS_REALIZED_FIREWALL_FROZEN / 8046_ABF_PROJECT_EXPECTED_BENEFIT_NOT_REALIZED_REVENUE / 3189_8046_REALIZED_ABF_NUMERATOR_UNKNOWN / OUTCOMES_CLOSED

New semantic correction:
issuer-native ABF project expected-sales values are not realized product revenue.

Historical Nan Ya PCB annual-report project-benefit disclosures include ABF-specific projected sales values for Shulin/Kunshan expansion projects. These are numeric and ABF-specific but remain forecast/project-benefit evidence.

Frozen:
`PROJECTED_PROJECT_SALES_VALUE != REALIZED_PRODUCT_REVENUE`.

Current 8046 evidence hierarchy:
- 2025 broad realized "circuit board" revenue: valid broad upper bound, not ABF numerator;
- historical ABF expansion projected sales values: ABF-specific forecast evidence, not realized revenue;
- current ABF technology/application roadmap: strategic/product evidence, not revenue numerator.

Current 3189 evidence hierarchy:
- 2025 substrate operating-segment realized revenue: valid broad upper bound, not ABF numerator;
- current FCBGA/SiP/large-area ABF strategic disclosure: product/strategy evidence, not realized ABF revenue.

Forbidden mixed-axis comparison:
- realized substrate revenue;
- realized broad circuit-board revenue;
- projected ABF project sales;
- AI/HPC application exposure.

They differ on realized-vs-projected and product-vs-application axes.

D09-13 remains L3 / 60.
D09 remains 57.1%.

Exact next:
`BR-059B` continue issuer-native 2025-2026 annual-report/investor-presentation search only for actual realized mutually-exclusive ABF/PP/product mix. Preserve UNKNOWN if only forecast/capacity/application evidence exists.

SDA-009 remains interrupt-priority if genuine System1 R3A1 evidence appears.


## BR-059C — current ABF realized-numerator disclosure audit (2026-10-07)

Artifact:
- `research/BR059C_ABF_REALIZED_NUMERATOR_DISCLOSURE_AUDIT_20261007_V0_1.md`

Current issuer-native 2025-2026 evidence still does not provide a realized mutually exclusive ABF revenue numerator for either priority issuer.

Frozen:
- `3189_REALIZED_ABF_NUMERATOR = UNKNOWN`;
- `8046_REALIZED_ABF_NUMERATOR = UNKNOWN`;
- `APPLICATION_REVENUE_MIX != PRODUCT_REVENUE_MIX`;
- `ABF_TECHNOLOGY_OR_CAPACITY_DISCLOSURE != REALIZED_ABF_REVENUE`.

Nan Ya PCB application mix is valid application evidence but cannot be relabeled as ABF product revenue. Kinsus ABF/FCBGA technology and strategy relevance is supported but does not numerically identify realized ABF sales.

D09-13 remains L3/60 and D09 aggregate maturity remains unchanged.

Exact next:
- BR-059D wait/prospectively capture an issuer-native mutually exclusive ABF/BT/general-PCB realized revenue split or directly reconcilable ABF realized revenue amount;
- retain UNKNOWN if only application/capacity/roadmap/forecast evidence exists.

SDA-009 remains interrupt priority:
the first genuine System1 R3A1 receipt must immediately preempt this parallel lane and trigger the frozen V0.6 acceptance path.

Formal Core unchanged.


## BR-064 — fifth frozen D09-14 strategic action (2026-10-07)

Artifact:
- `research/BR064_VIS_VSMC_PROSPECTIVE_CAPITAL_INJECTION_STRATEGIC_ACTION_20261007_V0_1.md`

New post-freeze action:
- issuer: VIS / 世界先進 5347;
- vehicle: VSMC Singapore JV;
- MOPS clocks: 17:18 / 17:19 Asia/Taipei on 2026-10-07;
- JV-level cash capital increase: US$100 million;
- all shares subscribed by existing shareholders;
- stated purpose: operating needs.

Cohort state:
- frozen actions: 5;
- issuers: 4.

Dedup firewall:
`CAPITAL_INJECTION_ACTION != PHYSICAL_CAPACITY_VOTE`.
D10 remains owner of physical capacity, qualification, production ramp and utilization.

VIS-specific subscription amount remains UNKNOWN absent direct shareholder-allocation disclosure.

D09-14 remains L3/60.
D09 aggregate maturity unchanged.

Exact next:
BR-065 native milestone surveillance across all five frozen actions; future stock/economic outcomes remain closed pending D16 preregistration/common support.

SDA-009 remains interrupt-priority if a genuine System1 R3A1 receipt appears.

Formal Core unchanged.


## BR-066 — D09-12 promoted to L3 on bounded same-date joint receipt (2026-10-07)

Artifacts:
- `research/BR066_D09_12_SAME_DAY_BREADTH_REGIME_JOINT_RECEIPT_20261007_V0_1.md`
- `research/br066_d09_12_same_day_breadth_regime_joint_receipt_20261007_v0_1.json`

Decision cutoff:
`2026-10-07T23:55:26+08:00`.

Frozen same-date known scope:
- TAIEX context = KNOWN;
- TWSE stock-direction breadth = KNOWN;
- TPEx same-clock breadth = UNKNOWN;
- outcomes = CLOSED.

D09-12 maturity:
`L2 / 40% -> L3 / 60%`.

D09 aggregate maturity:
`57.1% -> 58.6%`.

Interpretation remains bounded:
- cap-weighted index direction is not equal-stock breadth;
- one-day divergence direction is not predictive Alpha;
- missing TPEx scope remains UNKNOWN;
- no canonical broad-positive/broad-negative label is authorized from this receipt alone.

Exact next:
BR-067 accumulate independent same-clock receipts, ideally dual-market and continuity-certified.

## D09-05 remaining blocker after BR-066

D09-05 is now the only remaining L2 module in D09.

Latest authoritative parent evidence still reports:
- `C1_GENERATION_NOT_FOUND`;
- eligibleForResearch=false;
- latest confirmed Formal scan date = 2026-09-29;
- missing quality families = FINANCIAL / QUARTER_EPS.

Do not manually rebuild a substitute universe.

The normal `System 1 C1 Prospective Evidence` schedule is 00:10 Asia/Taipei after the 23:35 production scan. Room07 must consume the next genuine successful same-generation parent receipt when it appears; do not rerun a schedule-event job merely to force evidence because the workflow's scheduled path may register C3 research state.

D09-05 remains L2/40.
Formal Core unchanged.


## BR-068 — D09-05 post-midnight parent-readiness reconciliation (2026-10-08)

Artifact:
- `research/BR068_D09_05_POST_MIDNIGHT_PARENT_READINESS_20261008_V0_1.md`

Current disposition:
- D09-05 remains L2 / 40%;
- genuine same-generation C1 parent remains unproven;
- the isolated Above-MA20/60 builder is already ready;
- no substitute universe may be reconstructed.

Latest upstream causal state:
- V8.20 Formal→C1 binding semantics are production-verified;
- prior C1 evidence attempt failed `FORMAL_SCAN_NOT_CONFIRMED / C1_GENERATION_NOT_FOUND`;
- immediate causal blocker is official-quality acquisition: FINANCIAL was not ready and QUARTER_EPS was downstream-blocked;
- the MOPSOV Node fetch/undici transport incompatibility has a native-HTTPS repair candidate, but Room07 has no production-deployed/live-readback proof for that repair yet;
- SDA-016 T48 generation-set finalization remains separate research-completeness debt and is not treated as the immediate operational recovery blocker.

2026-10-08 00:10 scheduled opportunity:
- as of the bounded Room07 readback after 00:15 Asia/Taipei, no `System 1 C1 Prospective Evidence` run was yet visible in the repository Actions list;
- state = `SCHEDULE_NOT_YET_OBSERVED`;
- this is not FAILURE, MISSED, ZERO_PICK or NO_SIGNAL.

Exact next:
consume the first actual scheduled C1 run when it becomes observable; inspect its readiness/population evidence rather than workflow color alone. Require scanDate 2026-10-07, same-generation identity, complete/readback verified parent and research eligibility. If PASS, immediately run the frozen Above-MA20/60 builder outcome-blind. If blocked, append the new blocker and do not substitute another universe.

Formal Core unchanged.


### BR-068 cross-room C1 parent dependency

Dependency request:
- `research/BR068_D09_05_C1_PARENT_DEPENDENCY_REQUEST_20261008.md`

Upstream return is intentionally minimal:
one genuine post-repair C1 parent with scanDate / generation identity / complete readback / research eligibility / population integrity / history-admission lineage.

Room07 retains ownership of the frozen Above-MA20/60 computation.

Workflow green alone is insufficient; acceptance requires:
`PARENT_COMPLETE && READBACK_VERIFIED && ELIGIBLE_FOR_RESEARCH`.

No alternate universe, historical backfill or selected-only denominator is authorized.
