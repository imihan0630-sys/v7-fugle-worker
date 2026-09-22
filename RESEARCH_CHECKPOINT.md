# Research Checkpoint

Checkpoint sequence: B-18 after main `6ab46f10666f91fe0cce651b58c910a6cec5714e`.
Updated: 2026-09-22 19:41 Asia/Taipei.

> Canonical current cursor for both A/B research schedules. Detailed B-17 and earlier evidence remains durable in Git history, especially `6ab46f10666f91fe0cce651b58c910a6cec5714e`; do not re-run completed work.

## Governance / immutable boundary
- Formal Core: **LOCKED**. No autonomous change to A/B definitions, ranking, score, thresholds, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push semantics.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow begins 2026-09-21. No fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan date remains the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Execution-shadow D1 storage/read coverage remains **UNKNOWN** from safe public reads. Workflow/cron success is not persistence evidence.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless a newer safe durable read proves otherwise.
- B-13/B-16 provenance engineering remains DEFERRED, not cancelled; owner-priority trading-decision investigation outranks generic research engineering unless data quality directly blocks it.

## USER PRIORITY OVERRIDE — capital utilization / selection / execution / re-entry
Primary root question remains:
`universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY -> confirmed fill -> ADD/FULL -> REDUCE -> confirmed reduced shares -> restoration`.
Do not optimize cash utilization by itself and do not alter Formal Core from small retrospective samples.

### Retained findings from B-17 / prior durable checkpoint
- 9/16: 1,873 scanned -> 3 selected.
- 9/17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 primary liquidity rejects and 335 no A/B formation.
- 9/18 durable recovery log: selectedCount=3, pipelineComplete=false; identities remain UNKNOWN.
- Frozen allocator structurally caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ selected names; first tranches are about 21% / 36% / 51% before caps/rounding. Idle cash therefore decomposes into breadth + allocator + BUY conversion + ADD/fill conversion.
- 9/16 and 9/17 selected cohorts showed meaningful MFE but weak endpoint advantage versus TAIEX in the tiny observable sample. This falsifies the simplistic claim that only entry strictness explains missed profit; selection quality, execution and position management must remain separate hypotheses.
- 4763 vs 1301 on 9/18 remains direct evidence against blanket BUY loosening: both entered plan zones without same-day stop breach, but 4763 later showed much larger opportunity while 1301 did not.
- Production B is a stricter confirmed-breakout-quality construct than the owner's intended pre-breakout/catch-up B concept; no threshold was changed and any formal B redesign is Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; liquidity-rule quality is therefore an evidence-coverage gap, not proof the gate is wrong.

### ABF restoration evidence retained
- 3037/8046/3189 shared a genuine breakdown around 9/3, so a partial risk reduction then could have had valid ex-ante risk-control basis.
- 9/09 and 9/16 produced recovery-looking states that did not cleanly persist; a simple immediate re-add rule can whipsaw.
- 9/18 showed broad early ABF recovery above short trend, but an 8046 early add-back could still have suffered about -4.5% adverse excursion into 9/21 before the 9/22 surge.
- 9/22 produced strong MA5/MA10/MA20 recovery, but much upside was already expressed. Therefore the architectural restoration gap is real while the optimal threshold remains unknown.
- Shadow-only concepts remain untuned and unimplemented: STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY. Do not implement without owner decision.

## NEW B-18 — exact 8046 trim evidence search
### Research question
Can durable repository/project evidence establish the exact 8046 南電 reduction recommendation/confirmation date and price so actual trim opportunity cost can be measured without inference?

### Evidence searched
- Re-read latest main governance/worklist/checkpoint and latest research commit before work.
- GitHub default-branch code/file search for exact `8046 REDUCE`: no result.
- GitHub default-branch code/file search for `reduceSignal`: no result.
- GitHub default-branch code/file search for `REDUCE`: no result from the connected code-search index.
- Production root readback was attempted through the available web reader but that host was not accessible through that reader in this run; this is not evidence of production failure.

### Finding / falsification
- No safe durable evidence recovered in this run joins an exact 8046 reduction recommendation or confirmed reduction to a timestamp and execution price.
- Therefore **actual-trim opportunity cost remains UNKNOWN**. Do not infer the trim date from later holdings snapshots, ABF drawdown dates, chat memory, or the 9/22 rally.
- `REDUCE signal observed` is not `REDUCED_CONFIRMED`; confirmed share change still requires trusted timestamped actual-share evidence.
- This negative result strengthens the prior guard against hindsight: choosing 9/3, 9/16, 9/18 or another convenient date after observing the path would create look-ahead/data-snooping bias.

### Supporting / opposing interpretation
- Support for continued restoration research: the formal architecture still lacks a trusted reduced-exposure restoration state, and ABF later recovered strongly.
- Opposing evidence: the exact actual reduction event is unjoinable, and multiple plausible recovery dates had materially different whipsaw/late-entry tradeoffs. This episode cannot identify an optimal re-entry rule.

### UNKNOWN / data quality
- Exact 8046 reduction recommendation timestamp: UNKNOWN.
- Exact confirmed reduced-share timestamp: UNKNOWN.
- Exact execution price for the reduced tranche: UNKNOWN.
- Actual opportunity cost of the user's historical trim: UNKNOWN.
- Public-reader production root availability in this run: UNKNOWN; reader access failure must not be interpreted as runtime failure.

### R01-R08 / I01-I07 impact
- No definition, status or threshold changed.
- No new experiment ID or factor created.
- This is falsification/provenance work supporting the capital-utilization / execution / restoration research stream only.

### Bias / redundancy checks
- No date or price was imputed from holdings snapshots.
- No hand-picked recovery date was promoted after observing the 9/22 rally.
- No duplicate momentum/ABF factor was added.
- Selection breadth, allocator staging, BUY conversion, ADD conversion and restoration remain separate mechanisms.

### Engineering classification / branch / tests / deployment
- Research-only evidence audit; no runtime/code/schema change.
- Classification: Class A research investigation with **no engineering change**.
- Branch: none created this run.
- Tests: not applicable; no code changed.
- Deployment: none.
- Formal Core invariants: unchanged by construction.
- Rollback: prior main commit `6ab46f10666f91fe0cce651b58c910a6cec5714e` contains the full preceding checkpoint if historical detail is needed.

## Exact next continuation point
1. Re-read latest main checkpoint and latest research commit first; if the other A/B schedule advanced it, continue from its newer cursor.
2. Keep USER PRIORITY OVERRIDE primary.
3. Extend formal scan breadth/planned-capital sequence to other safely recoverable dates around 9/16–9/22. Keep `selectedCount`, `pipelineComplete`, planned allocation, BUY signal and confirmed fill as separate states.
4. Recover exact 9/16 plan zones/stops/targets if safe durable evidence exists; otherwise retain reconstructed/UNKNOWN labels.
5. For every recoverable plan classify path order: zone touch -> invalidation/stop -> formal BUY if joinable -> target/MFE -> endpoint. Compare BUY-triggered vs no-BUY only when identity is safely joinable.
6. Audit source-level REDUCE trigger semantics against ABF daily/15m behavior: determine whether it primarily detects temporary profit-zone distribution or genuine trend break, and reverse-test false reductions. Do not assume the user's historical 8046 trim date.
7. Keep STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY shadow-only and untuned.
8. No liquidity/A-B/RR/15m/allocator/trim change from small samples. Formal Core remains LOCKED.
