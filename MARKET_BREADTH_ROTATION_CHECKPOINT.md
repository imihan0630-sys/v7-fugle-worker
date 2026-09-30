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
