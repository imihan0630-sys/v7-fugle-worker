# Research Checkpoint

Checkpoint sequence: B-16 after main `948a187925c5e525991e309f9e4577d2734af67b`.

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

This is now the canonical A/B-schedule research priority. B-16 provenance engineering is **DEFERRED, not cancelled**. Do not resume B-16 until this root-cause stream reaches a genuine evidence blocker, owner decision, or checkpoint explicitly releases the defer.

### Question to answer
Why does the system select names but rarely deploy capital, and why can partial de-risking leave exposure permanently reduced even when trend/sector strength later reasserts? Decompose:
`universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY -> confirmed fill -> ADD/FULL -> REDUCE -> confirmed reduced shares -> restoration`.
Do not optimize cash utilization by itself and do not alter Formal Core from a small retrospective sample.

### Same-date falsification: 2026-09-17 final SELECTED vs 12 exact NEAR_MISS names
The 12 CI-recorded near misses each failed exactly one A condition. Using their 2026-09-17 close as baseline and Fugle daily OHLC for the next three trading days:
- NEAR_MISS mean D1=-0.18%, D2=-0.29%, D3=-0.77%, MFE=+1.12%, MAE=-1.46%.
- medians: D1=-0.21%, D2=-0.56%, D3=-0.72%, MFE=+0.83%, MAE=-1.44%.
- The eight names whose sole A miss was the trend condition averaged D1=-0.16%, D2=-0.24%, D3=-0.83%, MFE=+1.24%, MAE=-1.40%.
- One-condition examples did not uniformly become missed winners: 1326 support-distance miss (4.4% vs 4%) reached D3 -3.06%; 1609 volume miss reached D3 +1.20%; 1102 shallow-pullback miss reached D3 +0.42%. Singletons are descriptive only.
The two final 2026-09-17 selected names, using the same close-to-future-daily-path convention:
- 4763 材料*-KY: D1 +5.87%, D2 +4.09%, D3 +0.73%, MFE +12.16%, MAE -0.52%.
- 1301 台塑: D1 +0.62%, D2 +0.93%, D3 0.00%, MFE +2.94%, MAE -0.62%.
- selected mean D1 +3.24%, D2 +2.51%, D3 +0.37%, MFE +7.55%, MAE -0.57%.
Interpretation: this single-date evidence argues **against indiscriminately relaxing A conditions** just to create more trades. Strict selection captured materially better short-path behavior on this date while the near-miss cohort was flat/negative on average. It does not prove current thresholds are optimal; n=2 selected / n=12 near miss on one scan date is far below promotion evidence.

### Selection-construct mismatch candidate: especially B line
Current production B is a same-day confirmed-breakout construct:
- MA/trend gate,
- close >= priorHigh20*1.002,
- volumeTodayVsPrev5 >=1.3,
- daily close position >=65%,
- upper shadow <=35%,
- ret20 <=30%.
On 2026-09-17 only 7/513 base-distribution names fully passed B, and 0 became final B.
This is narrower than the owner's intended B concept of 3M +10~30%, roughly 1M consolidation, contraction then expansion, right-foot > left-foot, neckline organization and mainstream catch-up. The current code does not require right-foot > left-foot or a one-month consolidation construct, while it does require an already completed daily breakout.
Positive case: confirmed-breakout B is objective and may reduce anticipatory false starts.
Reverse case: it may structurally miss pre-breakout/right-foot catch-up setups the owner intended, creating B scarcity and forcing the system to wait until a move is already completed.
Research question: compare a **descriptive pre-breakout B-intent cohort** against current B-confirmed candidates prospectively; do not replace current B or tune thresholds retrospectively.

### A construct note
Current A requires: trend, 2–15% pullback, <=4% support distance, volume contraction/no selling expansion, intact structure, not late-stage. Intraday entry then requires zone touch/hold + prior 15m volume<=0.9 + reversal/strong close + higher low + bullish turn-up.
The 9/17 exact near-miss audit does not support generic relaxation. Next evidence should focus on whether the **daily A + intraday A conjunction** rejects otherwise valid selected names, rather than weakening daily A first.

### Capital utilization: multiple conservative layers confirmed
Current allocation code intentionally deploys:
- 1 selected name -> at most 35% total capital;
- 2 names -> at most 60%;
- 3+ names -> at most 85%;
- each name max 35%;
- each plan is split 60% first tranche / 40% second tranche.
Thus a one-name day can deploy only 21% of total capital on first confirmed BUY and at most 35% even after ADD. This is a design source of idle cash independent of entry scarcity.
Reverse case: the staging/caps reduce concentration and false-entry damage. Do not raise deployment merely to eliminate cash.

### Formal selection breadth bottleneck retained
Observed CI:
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible.
- 9/17 primary exclusions included 1,124 "20日流動性不足" and 335 no A/B formation.
Authoritative repo spec currently uses 20-day avg volume 1000 lots for general stocks / 300 lots for >=1000-price stocks, with documented exceptions. This gate is the largest observed early bottleneck.
Current Shadow archive cannot falsify this largest gate because liquidity rejects return basePassed=false, REJECTED_AFTER_BASE requires basePassed=true, and BROAD_CONTROL also requires the same formal liquidity minimum. Therefore current prospective counterfactual data systematically omit liquidity rejects.
Do not call the liquidity threshold wrong. Research-only coverage candidate: LIQUIDITY_REJECTED_CONTROL with price, avgVolume20Lots, avgAmount20, spread/depth when available, sector, volatility and cost/slippage-stressed future path. No implementation without owner approval.

### ABF / 8046 trim case: two-sided audit
Recovered prior decision history:
- Before reduction the user held 200 shares of 8046.
- 2026-09-04 advice escalated after the 9/3 close 1080 and another weak session; concerns included consecutive sharp weakness, foreign/institutional selling pressure, ABF relative weakness and capacity/competition uncertainty.
- User confirmed selling 100 shares on 9/4; closing inventory became 100 shares @ cost 886.25, 9/4 close 1055.
- Subsequent guidance explicitly held the remaining 100 but no durable restoration/re-add path was specified.
Post-9/4 close through 9/22:
- 8046 final +10.43% vs 9/4 close, MFE +10.43%, MAE -3.79%.
- Same ABF cohort: 3037 +24.17% with subsequent MAE +1.00%; 3189 +10.99%, MAE -4.27%.
This supports the hypothesis that remaining permanently reduced missed a later sector recovery, but it does **not** prove the 9/4 trim itself was ex-ante wrong: the reduction initially avoided a further 3.8% downside in 8046.
Candidate re-strength dates illustrate whipsaw risk:
- hypothetical 8046 restore at 9/9 close1110 -> 9/22 +4.95% but interim MAE -7.66%;
- restore at 9/16 close1105 -> +5.43%, interim MAE -4.98%;
- restore at 9/18 close1100 -> +5.91%, interim MAE -4.55%.
Therefore a naive "price recovered -> immediately add back" rule can materially increase whipsaw/drawdown. The real gap is the **absence of an explicit, testable restoration state**, not proof that any simple re-add threshold is good.

### Current BUY evidence correction
A protected research aggregate previously showed selectedPlans=4, buyTriggeredPlans=1 over its journal window, but it does not identify the symbol. A 2026-09-22 intraday health run reported monitoredCount=1, formal15Ready=1, notificationCount=0. Do **not** attribute the aggregate BUY to 3006 or claim a 9/22 real BUY notification.
This correction is binding for future research.

### Main-stream falsification order
1. Continue same-date SELECTED vs NEAR_MISS / REJECTED path comparisons as independent scan dates accumulate.
2. Reconstruct selectedCount, BUY conversion, first-tranche and ADD conversion separately; no-BUY is not zero return and signal is not confirmed fill.
3. Audit whether current B implementation is construct-valid for the owner's intended catch-up/pre-breakout B line; compare prospectively before proposing any formal change.
4. Treat one-day TTL as EXPIRE_AS_IS vs BLIND_CARRY_FORWARD vs REVALIDATED_RESELECT. 3006 already shows revalidation-aware persistence is more defensible than blind extension.
5. For position management, define research states only: FULL -> REDUCE_RECOMMENDED -> REDUCED_CONFIRMED -> READD_ELIGIBLE / STAY_REDUCED / EXIT. REDUCED_CONFIRMED requires trusted actual shares; never infer fill from push.
6. ABF is a case-study cohort, not a special rule. A restoration hypothesis must generalize beyond ABF or be labeled cohort-specific.
7. Formal Core remains LOCKED; no thresholds, A/B definitions, capital ratios, liquidity gates, entry or re-add production logic change without explicit owner decision.


## Retained B-13 / A-14 finding
- `readShadowCounterfactualResearch()` silently neutralizes malformed `snapshot_json` to `{}`.
- Malformed `v7_history_cache.history_json` becomes `[]`; missing history rows also reach outcome enrichment as `[]`.
- `researchShadowOutcomeForRow()` needs `snapshot.price.close`; missing/malformed snapshot or history can therefore leave horizons null without distinguishing corruption from immaturity.
- Actual prospective corruption occurrence remains **UNKNOWN**. This is an observability blind spot, not evidence corruption occurred.
- Isolation branch `research/b13-shadow-provenance` exists from rollback point `2f10777684755fcd4406a56b5bd33921723f71e1`.
- Planned diagnostics are Class A only while confined to research Shadow diagnostics with outcome calculations and legacy `coverage.dN` semantics unchanged.

## NEW B-16 — complete safe source reconstruction achieved (2026-09-22 Taipei)
### Actions completed
- Re-read latest governance, worklist and canonical checkpoint before continuing; re-read checkpoint SHA immediately before this write.
- Continued existing `research/b13-shadow-provenance`; did not recreate it and did not repeat B-13 tracing.
- Split the previously truncating head into line ranges 1-120 and 121-249, and reused the already-safe 250-499 tail. All three reads returned the same branch blob SHA `efb93275d585b021ac8c7fa5ba3c2d039449105a`.
- The ranges are contiguous with no gap/overlap (1-120, 121-249, 250-end), so the complete source image is now safely reconstructable for a whole-file branch update.
- Reconfirmed the exact reader boundary and legacy behavior from the reconstructed source: malformed snapshot -> `{}`; malformed history -> `[]`; absent history -> fallback `[]`; `coverage.dN` counts finite `returnPct` only.

### Engineering status
- No source modification yet in this cycle: the previous edit-safety blocker is now removed, but implementation/tests remain unfinished.
- Next code change remains isolated Class A: add provenance diagnostics only; preserve every existing outcome calculation and legacy coverage value.
- No production deployment attempted; no formal behavior changed.

### Bias / falsification / UNKNOWN checks
- No outcome values were inspected and no factor/threshold/window/experiment/classification was tuned.
- Missing evidence was not coerced to BAD/0.
- Actual malformed snapshot/history incidence remains UNKNOWN until diagnostics are deployed and prospective rows are observed.
- Selection-bias, look-ahead, market-source, Factor-Zoo, transaction-cost, date-cluster and redundancy conclusions are unchanged.
- Execution-shadow D1 persistence remains UNKNOWN.

## Exact next continuation point
1. Re-read latest checkpoint/main and SHA. Stay on the owner-priority root-cause stream; B-16 remains deferred.
2. Recover additional independent formal scan dates with exact SELECTED and NEAR_MISS/REJECTED cohorts from durable CI/D1 evidence; repeat the same fixed D1/D3/MFE/MAE comparison without threshold retuning.
3. Audit current B construct versus owner-intended B construct field-by-field. Identify which intended properties are absent, which current hard gates were added, and whether they plausibly explain the observed B=0 frequency. Positive and reverse case required.
4. Quantify capital-utilization decomposition from existing journal/selection evidence: selectedCount -> planned deployment ratio -> BUY-observed -> confirmed fill UNKNOWN/known -> ADD-observed -> full allocation. Never equate BUY signal with fill.
5. Continue 8046/3037/3189 case only as a falsification cohort. Search for non-ABF historical REDUCE recommendations/confirmed reductions if durable evidence exists; otherwise mark generalization UNKNOWN.
6. Design-only: preregister LIQUIDITY_REJECTED_CONTROL and pre-breakout B-intent Shadow cohorts. Do not implement/deploy without owner approval.
7. Keep Formal Core LOCKED. Any evidence-backed production proposal must be presented with expected benefit, reverse evidence, risks and engineering class before action.
