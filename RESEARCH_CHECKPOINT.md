# Research Checkpoint

Checkpoint sequence: B-63.
Updated: 2026-09-23 17:11 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified production/research infrastructure baseline: V8.8.2 `8.8.2-zero-selection-push-guard`, schema `execution-shadow-v2`; pre-change backup V8.8.1.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health positively verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- Formal selection, A/B qualification, BUY/ADD/REDUCE/SELL/STOP, capital allocation and research definitions remain unchanged.

## Primary research lane retained
Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- `v8_trade_journal_signals` establishes formal signal observations when durably readable, not brokerage fills. Confirmed fills remain UNKNOWN absent trusted reconciliation.
- 09/17 selected pair 4763/1301 through 09/22: endpoint about +0.37%, average MFE +7.55%, MAE -0.57%; near-miss 12 endpoint about -0.77%, MFE +1.12%, MAE -1.46%. One independent date only; no filter change.
- 8046 restoration and `HUMAN_MOMENTUM_SHADOW` remain research-only; keep execution-alpha separate from near-miss selection rescue.

## Provenance lane retained through B-49
- Current counterfactual path can collapse malformed snapshot/history, missing history, and valid-but-insufficient observed history into legacy null horizons; legacy `coverage.dN` cannot explain cause.
- B-13 isolated helper distinguishes snapshot, baseline, history, post-scan valid bars and horizon provenance. Missing baseline is `BASELINE_UNAVAILABLE`; malformed snapshot is distinct from history failure.
- Safest design remains parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- `research/b13-shadow-provenance` remains isolated/not deployed. Targeted + observational tests retain `LOCAL_EXACT_SOURCE_PASS`; exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN.
- B-49 established no trusted no-change byte-materialization path from connected GitHub reader into local runner; minimal manual isolated CI bridge is Class B proposal-only. Do not repeat transport discovery without new capability/approval.

## B-50 through B-61 retained boundaries
- Fundamental Persistence remains UNKNOWN/context-only; no arbitrary windows or historical PIT backfill.
- Price Path uses only frozen R01 `priorHigh20` + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`. No new thresholds/windows/composite scores.
- `readShadowCounterfactualResearch()` reads up to 5000 Shadow rows but returns only last 80 row-level `recentOutcomes`; do not treat 80 as full archive.
- Existing aggregate diagnostics are maturity/effect-conditioned and cannot be reused as field-readiness denominators.
- Regime is a separate `trade_research_days.market_json` path; shared-runtime join is Class B proposal-first.
- Authenticated dashboard route is source-proven GET `/api/research/dashboard?days=...`; no authorized live dashboard response has been read in this automation context. Runtime finite-value coverage remains UNKNOWN.
- `.github/workflows/v7-cloudflare.yml` means `research/**` changes on main enter production deployment; research helper code stays branch-only unless deployment neutrality is proven.
- Branch `research/b57-price-path-readiness`; matrix unit `INDEPENDENT_SCAN_DATE_X_COHORT`; scan-time field state is separate from future outcome state.
- B-58 split snapshot from later history provenance so later history failure cannot erase valid scan-time fields.
- B-59 added baseline as a third semantic axis: finite observed metric => AVAILABLE; otherwise missing baseline => PROVENANCE_BLOCKED; then history provenance; only valid provenance with no metric => OUTCOME_NOT_MATURE.
- B-60 froze finite serialized outcome precedence: finite future metric remains AVAILABLE even if attached provenance is inconsistent, but never fabricates missing scan-time fields. No new INCONSISTENT bucket.
- B-61 froze exact branch/blob identities and trusted-execution contract. Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; branch not wired/deployed.

## B-62 — liquidity-reject/control coverage isolation audit
- Current Shadow conditions on surviving base/liquidity; it cannot falsify the largest observed liquidity reject gate.
- A prospective reason-preserving `PRE_BASE_LIQUIDITY_CONTROL` would require capture inside shared formal scan plus durable storage, so direct implementation is **Class B proposal-only**. Do not overload frozen `REJECTED_AFTER_BASE`.
- No implementation/runtime/schema change was made. Any future approved capture must be prospective only, preserve exact rejection reason/UNKNOWN, stay outside formal ranking/trading/push, and reconcile same-date counts against formal exclusion aggregates.

## NEW B-63 — BROAD_CONTROL sampling-bias falsification audit
### Research question
- Does the existing frozen BROAD_CONTROL construction itself introduce systematic pool/market/date imbalance that can distort R02 Selection Alpha even before outcome maturity?
- Static/source-level audit only; no alpha claim and no change to the frozen R02 comparator definition.

### Exact source semantics established
- `buildShadowCandidateArchive()` builds cohorts sequentially and maintains a shared `used` set. SELECTED, QUALIFIED_NOT_SELECTED, NEAR_MISS and REJECTED_AFTER_BASE are inserted first; BROAD_CONTROL is sampled only from feature rows not already used.
- BROAD_CONTROL eligibility is not a raw-universe random sample. It requires `historyDays>=60`, `close>=MIN_CLOSE_PRICE`, and the same price-dependent liquidity floor used in the archive helper: >=1000 lots for GENERAL and >=300 lots for THOUSAND.
- Eligible controls are deterministically ordered by `researchStableHash(scanDate + "|" + symbol)`, then `byPool(...,6)` takes up to six GENERAL and six THOUSAND rows. Therefore the control is reproducible within a date but is a capped, pool-stratified pseudo-random sample of **surviving eligible unused feature rows**, not a market-representative sample.
- The helper assigns pool only as GENERAL/THOUSAND from close price. No TWSE/TPEx market field participates in the sampling/stratification rule.
- R02 correctly keeps BROAD_CONTROL separate from QUALIFIED_NOT_SELECTED, NEAR_MISS and REJECTED_AFTER_BASE; changing or merging these now would violate the frozen experiment definition.

### Falsification result
- Pool imbalance: partially controlled by design because sampling caps each price pool at six, but this is equal-cap stratification, not weighting to the formal universe or SELECTED pool distribution. If one pool has few eligible rows, the other pool is not allowed to fill unused capacity; effective control composition can vary by date.
- Market imbalance: **structurally possible and currently unmeasured** because TWSE/TPEx is not stratified or balanced in BROAD_CONTROL sampling. A date could by chance contain mostly one market even when the eligible universe is mixed.
- Date imbalance: each date can contribute a different number/composition of controls (0-12). Existing R02 mitigates raw row-count dominance by computing same-date SELECTED-minus-control mean before cross-date aggregation, but a thin or composition-skewed control on a date can still make that date's delta noisy. Independent scan date remains the evidence unit.
- Survivor/conditioning bias: BROAD_CONTROL explicitly excludes symbols already consumed by earlier cohorts and also imposes history/liquidity eligibility. It is therefore useful as a broad *eligible-survivor* comparator, but it must not be interpreted as a random control for the full scanned universe or as evidence about pre-base liquidity rejects.
- Deterministic hash ordering avoids manual cherry-picking and makes reruns reproducible, but hash determinism does **not** prove representative market/industry composition.

### What is known vs UNKNOWN
- Known from source: deterministic date+symbol hash, max 6 per GENERAL/THOUSAND, prior-cohort exclusion, history/price/liquidity eligibility, no market stratification.
- UNKNOWN without full prospective row readback: actual per-date TWSE/TPEx mix, industry mix, eligible-universe-to-control sampling fraction, overlap/composition stability across dates, and whether any observed R02 effect is sensitive to those imbalances.
- Do not infer empirical imbalance from the static risk alone. Current prospective archive is too young and full row-level trusted readback is unavailable in this automation context.

### Bias / overfit / transaction-cost audit
- Selection bias: BROAD_CONTROL is conditioned on archive eligibility and earlier-cohort exclusion; label it accordingly in interpretation.
- Look-ahead: none in the source sampling rule; date+symbol hash and scan-time fields are prospective. No historical Shadow reconstruction allowed.
- Data snooping / Factor Zoo: no new factor, threshold, window, or comparator was introduced. Do not search alternate seeds/caps after seeing returns.
- Market-source bias: possible due to absent TWSE/TPEx stratification; empirical magnitude UNKNOWN.
- Redundancy: BROAD_CONTROL cannot replace PRE_BASE_LIQUIDITY_CONTROL; conversely a future pre-base control must not replace frozen BROAD_CONTROL.
- Transaction costs: BROAD_CONTROL already passes a liquidity floor, so it is not an appropriate comparator for estimating execution feasibility of rejected low-liquidity names. Cost/slippage remains a separate requirement.
- Date clustering: R02 same-date pairing is directionally correct; same-day 12 controls are not 12 independent dates.
- Coverage/zero-pick: a BROAD_CONTROL row can exist even when SELECTED is zero, but that date cannot form an R02 paired Selection Alpha delta; zero-pick remains a formal funnel observation, not a zero alpha.

### Engineering classification / action
- This audit is Class A source-level research evidence; checkpoint-only durable documentation. No Worker/research helper/schema/runtime changes.
- Do **not** alter BROAD_CONTROL sampling now: doing so changes frozen R02 cohort semantics and creates a new experiment/comparator version. Any future alternative market-stratified or universe-weighted control must be preregistered as a separate research experiment/version and remain Shadow-only until governance gates are met.
- No executable test claimed; source audit only. Formal Core remains LOCKED.

### R01-R08 / I01-I07 impact
- R02: interpretation tightened — BROAD_CONTROL means deterministic capped pool-stratified eligible-survivor control, not full-universe random control. Frozen effect computation unchanged.
- R01/R03-R08 unchanged. I01-I07 unchanged. No R09/I08.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Keep B-62 liquidity-control implementation proposal-only unless owner explicitly approves the Class B shared-runtime/storage change.
4. Continue independent Class A falsification without changing frozen definitions: next audit whether BROAD_CONTROL's deterministic hash + 6/6 caps can create repeated-symbol or industry concentration across prospective dates, and define a **diagnostic-only** concentration/readiness specification using existing rows (e.g. report symbol repeat share, market/industry coverage when metadata exists, and effective controls/date) without changing the sampler. If full prospective rows/metadata are unavailable, record empirical values UNKNOWN; do not invent or backfill them.
5. Do not create a new comparator, seed, cap, threshold, or experiment from this audit. Any alternate sampler is a separately preregistered research version and must not overwrite R02.
6. Readiness test remains `SOURCE_WRITTEN_NOT_EXECUTED` until the B-61 trusted-execution contract is met. Do not repeat B-49 transport discovery without new capability.
7. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
