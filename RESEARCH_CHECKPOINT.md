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

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint/main SHA; merge any A progress before writing.
2. Continue root-cause stream, not deferred B-16.
3. Recover additional independent formal scan dates with exact SELECTED and NEAR_MISS/REJECTED cohorts from durable CI/D1 evidence; repeat fixed D1/D3/MFE/MAE comparisons without threshold retuning. If no additional exact cohort is safely recoverable, mark unavailable/UNKNOWN and move on.
4. Quantify capital-utilization decomposition from existing durable evidence: selectedCount -> planned deployment ratio -> BUY-observed -> confirmed fill known/UNKNOWN -> ADD-observed -> full allocation. Never equate BUY signal with fill. Separate selection scarcity from execution scarcity and allocation caps.
5. Audit daily A -> intraday A conjunction: determine which intraday clauses can block an already-selected A plan and whether durable diagnostics expose clause-level no-BUY reasons. Missing clause identity remains UNKNOWN.
6. Search durable repository evidence for non-ABF REDUCE recommendations and especially confirmed share reductions. If no trusted actual-share evidence exists, generalization of restoration remains UNKNOWN.
7. Keep LIQUIDITY_REJECTED_CONTROL and pre-breakout B-intent cohorts design-only; do not implement/deploy without the already-required owner/classification gate.
8. Formal Core remains LOCKED. Any production proposal must present expected benefit, reverse evidence, risks, coverage/cost/overfit evidence and Class C status before owner decision.
