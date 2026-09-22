# Research Checkpoint

Checkpoint sequence: B-17 after main `992b047cc99b1043af193d59b6da72fc053795ab`.

> Canonical current cursor for both A/B research schedules. Prior detailed checkpoints remain durable in Git history and must not be re-run.

## Governance / immutable boundary
- Formal Core: **LOCKED**. No autonomous change to A/B definitions, ranking, score, thresholds, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push semantics.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow begins 2026-09-21. No fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Execution-shadow D1 storage/read coverage remains **UNKNOWN** from safe public reads. Workflow/cron success is not persistence evidence.
- Last verified prospective Shadow evidence: 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes. Do not manufacture a newer date or mature horizon from current prices.

## Retained research findings
- R06 exact thresholds are repository constructs, not literature-validated cutoffs; no outcome-driven retuning.
- Fugle `avgPrice` is cumulative day-to-observation average, not interval VWAP.
- `frame.latest.time` is candle bar-start; `barEndAt` is locally derived theoretical end; source publication time remains UNKNOWN.
- Reduced quote object discards raw Fugle `lastTrade.time`/`total.time`; shared quote plumbing change would be Class B.
- R03 sector persistence, R04 Residual RS and R07/R08 Attention are related momentum layers, not independent votes. Breakout quality already embeds volume, creating explicit redundancy risk.
- BUY-observed vs no-BUY balance covariates already exist in prospective Shadow; individual BUY identity remains NOT_JOINABLE from safe durable evidence.
- REDUCE signal is recommendation, not execution; `REDUCED_CONFIRMED` remains UNKNOWN without trusted timestamped actual-share evidence.

## USER PRIORITY OVERRIDE — capital utilization / selection / execution / re-entry
This remains the canonical A/B-schedule research priority. B-16 provenance engineering is **DEFERRED, not cancelled**.

### Root question
Why does the system select names but rarely deploy capital, and why can partial de-risking leave exposure permanently reduced even when trend/sector strength later reasserts? Decompose:
`universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY -> confirmed fill -> ADD/FULL -> REDUCE -> confirmed reduced shares -> restoration`.
Do not optimize cash utilization by itself and do not alter Formal Core from a small retrospective sample.

### Same-date falsification retained: 2026-09-17
- 12 exact NEAR_MISS names each failed exactly one A condition: mean D1=-0.18%, D2=-0.29%, D3=-0.77%, MFE=+1.12%, MAE=-1.46%; medians D1=-0.21%, D2=-0.56%, D3=-0.72%, MFE=+0.83%, MAE=-1.44%.
- Eight sole-trend-miss names: mean D1=-0.16%, D2=-0.24%, D3=-0.83%, MFE=+1.24%, MAE=-1.40%.
- Selected 4763: D1 +5.87%, D2 +4.09%, D3 +0.73%, MFE +12.16%, MAE -0.52%; 1301: D1 +0.62%, D2 +0.93%, D3 0.00%, MFE +2.94%, MAE -0.62%.
- Selected mean D1 +3.24%, D2 +2.51%, D3 +0.37%, MFE +7.55%, MAE -0.57%.
- Interpretation remains descriptive only: this one date argues against indiscriminate A relaxation, not that current thresholds are optimal.

### Formal selection breadth bottleneck retained
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible.
- 9/17 primary exclusions included 1,124 `20日流動性不足` and 335 no A/B formation.
- Current Shadow omits the largest liquidity-reject gate because those rows have basePassed=false; LIQUIDITY_REJECTED_CONTROL remains design-only pending owner approval.

### Capital utilization retained
- 1 selected -> at most 35% total; 2 -> 60%; 3+ -> 85%; each name max 35%; each plan 60% first tranche / 40% second tranche.
- Thus one-name first BUY can deploy only 21% total and at most 35% after ADD. This is a structural idle-cash source independent of entry scarcity, with the reverse benefit of concentration/false-entry protection.

### ABF restoration case retained
- 8046 trim initially avoided additional downside but later missed sector recovery; naive immediate restore can create 4.5–7.7% interim drawdown in examined dates.
- Gap is absence of explicit testable restoration state, not proof any simple re-add rule works.
- Research-only state model remains FULL -> REDUCE_RECOMMENDED -> REDUCED_CONFIRMED -> READD_ELIGIBLE / STAY_REDUCED / EXIT; confirmed shares required.

## NEW B-17 — B-line construct-validity audit (2026-09-22 Taipei)
### Exact production B definition verified from main
`strategySetupState(f)` requires all six:
1. `trendB`: MA20/MA60 structure plus bullishStack OR justTurnBullish OR close>MA10.
2. `breakoutB`: close >= priorHigh20 * 1.002.
3. `volumeB`: volumeTodayVsPrev5 >= 1.3.
4. `strongCloseB`: dailyClosePosition >= 0.65.
5. `upperShadowB`: dailyUpperShadowRatio <= 0.35.
6. `notLateB`: lateStage !== true AND ret20 <= 30.
If B passes it takes precedence over A in `scoreCandidate`; B entry is built around priorHigh20. Intraday execution then remains separate and requires formal 15m confirmation before BUY/ADD.

### Field-by-field construct mismatch versus owner-intended B
Owner-intended B concept: 3M gain about +10~30%, roughly 1M consolidation, contraction then expansion, right-foot > left-foot, neckline organization, mainstream catch-up.

**Represented only partially / proxy:**
- Momentum not-late: production has ret20<=30, but this is a 20-day upper cap, not a 3-month +10~30% band. No 3M lower bound is required.
- Neckline/breakout: priorHigh20 is an objective 20-day high proxy, but production requires the close already be >=0.2% above it. It therefore represents confirmed breakout, not pre-breakout neckline organization.
- Volume expansion: production requires same-day volume >=1.3x prior-5 average. It does not explicitly require a preceding contraction phase.
- Trend: MA structure is present, but it is not equivalent to right-foot > left-foot.

**Absent as explicit B gates:**
- 3-month return +10~30%.
- roughly one-month sideways/consolidation quality.
- explicit contraction-before-expansion sequence.
- right-foot > left-foot geometry.
- explicit mainstream catch-up / laggard-within-strong-sector relation.

**Additional production hard gates not inherent in the owner-intended descriptive B concept:**
- same-day completed breakout above priorHigh20 by 0.2%;
- same-day >=1.3x volume expansion;
- close location >=65% of daily range;
- upper shadow <=35%;
- ret20 <=30% and lateStage false.
These make production B a stricter `confirmed breakout quality` construct rather than a direct implementation of the intended `pre-breakout/catch-up` construct.

### Positive hypothesis
The extra same-day confirmation gates are objective and can suppress anticipatory false starts, weak closes, failed breakouts and long-upper-shadow traps. They may improve execution quality even if they reduce B frequency. The 9/17 same-date A near-miss evidence also warns against relaxing gates merely to increase trade count.

### Reverse / falsification hypothesis
Because production B requires the breakout to have already closed through priorHigh20 with >=1.3x volume and strong-close anatomy, it can structurally exclude valid right-foot / neckline / catch-up setups *before* breakout. This plausibly contributes to observed B scarcity (9/17: only 7/513 base-distribution names passed B, final B=0), but does not prove the current B is inferior. The absent 3M/consolidation/right-foot/mainstream dimensions also mean current B cannot be claimed construct-valid for the full owner-intended concept.

### Bias / overfit guard
- No threshold was changed or tuned from outcomes.
- No new factor or experiment ID was created; R01-R08/I01-I07 remain frozen.
- Do not compare a retrospectively hand-picked pre-breakout cohort against current B. A pre-breakout B-intent cohort must be preregistered and captured prospectively at the scan timestamp.
- Independent scan date remains the unit; require multiple dates/regimes, costs, coverage and date-cluster robustness before any Class C proposal.
- Current B scarcity may also arise upstream from liquidity/base filters or downstream from RR/quality/intraday confirmation; do not attribute all idle cash to B mismatch.

### Engineering/classification
- No code, thresholds, formal selection, allocation, monitoring or push behavior changed.
- A future formal B-definition change is Class C and owner decision mandatory.
- A new research-only prospective B-intent Shadow cohort is potentially Class A only if isolated from formal/shared runtime; if it requires shared production scan plumbing or schema/runtime changes it becomes Class B. Therefore implementation remains design-only pending classification/owner approval already recorded in prior checkpoint.

## Retained B-13/B-16 deferred provenance stream
- Malformed snapshot/history can be silently neutralized and actual prospective incidence remains UNKNOWN.
- Isolation branch `research/b13-shadow-provenance` exists; complete source reconstruction was achieved in B-16.
- Provenance implementation/tests remain deferred while owner-priority root-cause stream is active.

## USER PRIORITY OVERRIDE — capital idleness / entry scarcity / trim-reentry

The owner explicitly redirected research back to the trading-decision problem. This now outranks B-13/B-16 data-quality engineering unless a data-quality issue directly blocks this investigation. Do not let generic research-engineering work consume the next A/B schedules.

### Source-level capital-utilization finding
The formal allocator itself imposes a strong cash floor before any intraday confirmation:
- selectedCount=1 -> planned deploy ratio 35%; first tranche is 60% of that = about 21% of total capital.
- selectedCount=2 -> planned deploy ratio 60%; first tranches together are about 36% of total capital.
- selectedCount>=3 -> planned deploy ratio 85%; first tranches together are about 51% before single-name caps/rounding.
Thus persistent idle cash can arise from **selection breadth + allocator + BUY conversion + ADD conversion**, not BUY scarcity alone.

Observed formal examples:
- 2026-09-17 scan selected 2 names. Exact allocations: 4763 NT$62k (31.2%), 1301 NT$57k (28.8%): full planned deployment NT$119k/200k = 59.5%; first tranches total NT$71.4k = 35.7%.
- 2026-09-21 scan selected 1 name, 3006: full planned deployment NT$70k = 35%; first tranche NT$42k = 21%.
- 2026-09-16 scan selected 3 names from 1,873 ordinary stocks; source policy implies at most ~85% planned before first-tranche staging.

### Selection-vs-execution falsification from the small observable cohort
Using formal scan closes and subsequent daily bars through 2026-09-22:
- 9/16 cohort (6706,3006,6505) mean close-to-close return from selection close to 9/22 ≈ +2.93%; TAIEX over the same interval ≈ +4.26%.
- 9/17 cohort (4763,1301) mean close-to-close return ≈ +0.37%; TAIEX over the same interval ≈ +3.27%.
This tiny sample does **not** establish negative Selection Alpha, but it directly falsifies the simplistic claim that “the selected stocks were obviously strong and only entry rules blocked profit.” Close-to-close selection quality is not yet proven superior.

At the same time, the five selected names showed large path opportunity before 9/22 round-trips:
- 6706 MFE from selection close ≈ +14.29%, MAE ≈ -4.42%.
- 3006 MFE ≈ +5.52%, MAE ≈ -1.60%.
- 6505 MFE ≈ +11.55%, MAE ≈ +0.12%.
- 4763 MFE ≈ +12.16%, MAE ≈ -0.52%.
- 1301 MFE ≈ +2.94%, MAE ≈ -0.62%.
Mean MFE ≈ +9.29% while mean endpoint return ≈ +1.91%.

Interpretation: there may be meaningful **path/execution/position-management opportunity** even when endpoint Selection Alpha is not superior. Therefore entry scarcity, profit capture, trim/re-entry and selection quality must be tested separately.

### 4763 vs 1301 same-day contrast
Both 9/17 formal A plans traded into their planned buy zones on 9/18 without breaching formal stop that day:
- 4763 zone 47.16–48.25, stop 46.45; 9/18 low 47.45, high 50.5; later 9/21 high 53.5 exceeded profitCheck 51. This is a plausible valid opportunity that a too-strict confirmation rule could miss.
- 1301 zone 63.88–65.36, stop 62.92; 9/18 low 64.2, high 65.6; later max through 9/22 only 66.5 versus profitCheck 68.6, then close returned to 64.6. Relaxing entry here would add little payoff.
This pair is direct evidence against blanket loosening: the same relaxation could help one case and add low-value exposure in another.

### Funnel architecture finding
Daily selection is intentionally narrow:
- 9/16: 1,873 scanned -> 3 selected.
- 9/17: 1,875 scanned -> 2 selected; baseEligible 513, rrEligible 9, A final 2, B final 0.
The largest primary exclusion bucket is the 20-day liquidity gate (~1,100 names), but current Shadow cohorts exclude liquidity rejects because they require basePassed. Therefore the largest selection bottleneck is currently **not prospectively falsifiable** by the existing Shadow archive. Do not infer the liquidity rule is wrong; it is an evidence-coverage gap.

### Working hypotheses — all remain two-sided
H1 Selection is too narrow: supported by 0.1–0.2% selected/scanned rates; opposed by lack of proven Selection Alpha and by execution/slippage protection.
H2 Intraday BUY confirmation is too strict: supported by low journal conversion and valid-zone examples; opposed by falling-knife/stop-first cases and by 3006's post-trigger weakness.
H3 Capital staging is too conservative for sparse selection: structurally true for utilization, but whether it hurts risk-adjusted total-capital return is unproven.
H4 Profit/position management leaks more return than selection itself: supported by high MFE vs low endpoint return in the small selected cohort; opposed by hindsight bias and absence of confirmed fills for most cases.
H5 Trim logic is asymmetric: source state has NONE/FIRST/FULL but no confirmed reduced-exposure restoration state; whether re-add improves outcomes remains unproven after costs/whipsaw.

No Formal Core change. No threshold/allocator/entry/exit modification without explicit owner decision after falsification evidence.

## USER PRIORITY continuation — 9/18 breadth evidence + ABF recovery-path audit

### 9/18 formal breadth evidence recovered
A completed existing GitHub Actions recovery log for scanDate 2026-09-18 provides durable aggregate evidence:
- formal recovery selectedCount = 3;
- pipelineComplete = false;
- the same workflow had successfully refreshed official quality/index data first.
The log does not expose the three stock identities, so identities remain UNKNOWN and must not be guessed from unrelated EPS-review symbols.

Capital-use implication from the frozen allocator:
- three selected names raise planned deployment cap from the 35%/60% one-/two-name levels to ~85% before per-name caps/rounding;
- first-tranche deployment can still be only ~51% of total capital even when three names qualify.
Therefore observed idle cash remains a composition of selection breadth, allocator staging, BUY conversion and ADD/fill conversion.

### ABF cohort reconstruction through 2026-09-22
Daily adjusted OHLCV was reconstructed for 3037 欣興, 8046 南電 and 3189 景碩. The exact date of the owner's historical 8046 partial-sale recommendation is not durably joinable from the current repo/project evidence, so do NOT assign a date or compute "missed profit from the actual trim" yet.

The cohort had a severe shared risk episode around 9/3:
- 8046 close 1080 after 1200 on 9/2 (-10.0% close-to-close), then 9/4 close 1055.
- 3037 close 923 after 973 (-5.1%), then 9/4 close 902.
- 3189 close 775 after 847 (-8.5%), then 9/4 close 819 after an intraday low 766.
This is important reverse evidence: a partial risk reduction during that breakdown would have had a genuine ex-ante risk-control basis; the later rally alone cannot invalidate it.

### When did ABF strength actually re-establish?
Using only contemporaneously observable close/volume and rolling MA states:
- 9/09: all three rose and all three closed above MA5, but none was above MA10/MA20. This was an early rebound, not a confirmed medium-term recovery.
- 9/16: all three closed higher and all three were above MA10, but the next session (9/17) all three fell. A simple "all above MA10 -> add back" rule would have whipsawed immediately.
- 9/18: all three rose again and all three closed above MA5 and MA10. Approx daily moves: 8046 +3.29%, 3037 +4.36%, 3189 +3.35%. But none of 8046/3037 had yet reclaimed MA20; 3189 was only marginally above its MA20. None closed above the prior session high. This is a plausible **early recovery state**, not a clean breakout.
- 9/21: 8046 fell -3.64% and traded to 1050; 3189 also softened, while 3037 strengthened and reclaimed MA20. A 9/18 early add-back in 8046 would have experienced roughly -4.5% adverse excursion from 1100 to the 9/21 low before the subsequent rally.
- 9/22: all three closed strongly higher and above MA5/MA10/MA20; 8046 closed 1165 (+9.91%), 3037 1120 (+9.80%), 3189 909 (+9.92%). By then confirmation was strong, but much of the one-day upside was already expressed at/after the opening gap.

### Two-sided conclusion on the owner's 8046 complaint
Support for adding a restoration mechanism:
- the architecture has no REDUCED_CONFIRMED -> RE-ADD_ELIGIBLE state;
- 9/18 already showed broad ABF early recovery across all three names, so "reduced forever / only hold remainder" can miss a genuine resumed theme.

Reverse evidence against a simplistic add-back:
- earlier 9/09 and 9/16 recovery-looking states were followed by renewed weakness;
- even 9/18 early recovery was followed by a material 8046 drawdown on 9/21 before the 9/22 limit-up;
- waiting for MA20/prior-high confirmation would reduce whipsaw but would also enter much later, potentially after a gap.
Therefore the architecture gap is real, but the optimal recovery threshold is **not** obvious from this episode and must not be hand-tuned to 8046.

### Shadow-only recovery-state preregistration candidate
Do not implement yet. Compare three fixed concepts prospectively after a trusted confirmed partial reduction:
A. STAY_REDUCED — sold tranche remains cash.
B. EARLY_BREADTH_RECOVERY — sold tranche becomes eligible only after the stock reclaims short trend (MA5/MA10) while at least 2/3 ABF peers simultaneously show positive short-trend breadth; no automatic fill.
C. FULL_TREND_RECOVERY — eligibility only after reclaim of MA20 / prior structural high, accepting later entry.
Evaluate D1/D3/D5/D10 tranche return, MFE/MAE, cost stress, re-reduction/whipsaw rate, and market/sector regime. These are concepts, not tuned thresholds and not formal rules.

Falsification:
- if EARLY_BREADTH gains are erased by whipsaws/costs, reject early re-add;
- if FULL_TREND recovery consistently enters after most upside and total-capital capture remains poor, it is too late;
- if STAY_REDUCED has similar return with materially lower MAE, no restoration rule is justified;
- require non-ABF partial-reduction events before generalizing a state-machine change.

No Formal Core or production behavior changed.

## Exact next continuation point
1. Keep USER PRIORITY OVERRIDE primary.
2. Search durable project/repo evidence for the exact 8046 reduction recommendation/confirmation date and price. If not found, keep actual-trim opportunity cost UNKNOWN; do not infer from holdings snapshots.
3. Extend formal scan breadth/planned-capital sequence to other recoverable dates around 9/16–9/22. Separate selectedCount from pipeline success and from actual BUY/fill.
4. Recover exact 9/16 plan zones/stops/targets if possible; otherwise retain reconstructed/UNKNOWN labels.
5. For every recoverable plan classify path order: zone touch -> invalidation/stop -> formal BUY if joinable -> target/MFE -> endpoint. Compare BUY-triggered and no-BUY only when identity is safely joinable.
6. Audit source-level REDUCE trigger against ABF daily/15m behavior and determine whether the trigger detects temporary profit-zone distribution versus true trend break. Reverse-test false reductions.
7. Keep the three recovery concepts (STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY) shadow-only and untuned. Do not implement without owner decision.
8. No liquidity/A-B/RR/15m/allocator/trim change from small samples. Formal Core remains LOCKED.
