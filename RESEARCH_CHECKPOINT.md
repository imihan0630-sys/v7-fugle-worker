# Research Checkpoint

Checkpoint sequence: B-23.
Updated: 2026-09-22 22:10 Asia/Taipei.

> Canonical cursor for both A/B research schedules. B-22 and earlier evidence remains durable in Git history; do not re-run completed work.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Execution-shadow D1 persistence/read coverage remains UNKNOWN from safe public reads. Workflow/cron success is not persistence evidence.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless a newer safe durable read proves otherwise.
- B-13/B-16 provenance engineering remains DEFERRED, not cancelled.

## USER PRIORITY OVERRIDE — capital utilization / selection / execution / re-entry
Primary root question remains:
`universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY -> confirmed fill -> ADD/FULL -> REDUCE -> confirmed reduced shares -> restoration`.
Do not optimize cash utilization alone and do not alter Formal Core from small retrospective samples.

## Retained findings through B-22
- 9/16: 1,873 scanned -> 3 selected. 9/17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 primary liquidity rejects; 335 no A/B formation.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Tiny 9/16-9/17 cohorts had meaningful MFE but weak endpoint advantage vs TAIEX; selection quality, execution and position management remain separate hypotheses.
- 4763 vs 1301 on 9/18 remains evidence against blanket BUY loosening.
- Production B is stricter confirmed-breakout quality than the owner's intended pre-breakout/catch-up concept; redesign would be Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; this is an evidence-coverage gap, not proof the gate is wrong.
- Exact 8046 reduction recommendation/fill timestamp, price and reduced shares remain UNKNOWN.
- Current REDUCE = profit-zone distribution; generic downside exits are separate STOP_LOSS/SELL mechanisms.
- Exact 9/16 plan identities/zones/stops/targets remain unjoinable from inspected plaintext repo evidence and therefore UNKNOWN.
- Restoration concepts STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY remain untuned Shadow concepts only.
- `v7_signal_delivery_state` is current delivery/dedup state, not an append-only execution journal; push acceptance is not brokerage execution.
- No separate append-only per-symbol operation-signal/fill journal was found. Historical BUY/ADD/REDUCE/STOP_LOSS/SELL instances and fills remain UNKNOWN. A prospective recorder touching the formal signal path is Class B unless isolated.
- An encrypted V8 plan mirror durably archives exact plan payloads, but safe GitHub reads expose ciphertext/hash only. Exact rows cannot be inferred or decrypted without the protected secret.
- Existing plan mirror is plan-only and cannot recover transient BUY/ADD/REDUCE/SELL events.

## NEW B-23 — aggregate capital attribution and summary-artifact classification
### Research question
Given exact per-symbol plan rows remain encrypted, what portion of idle capital can be attributed to the frozen allocator from already-proven selected counts, and can a non-sensitive plan-summary artifact be added autonomously?

### Evidence audited
- Re-read latest governance, worklist and checkpoint first; checkpoint was B-22.
- Verified latest main research commit before research: `43692763c9b7c760994ed10649570a7627901fcf` (B-22).
- Re-inspected safe plaintext `data/recovered_chat_selections.json` and `data/v7_formal_scan_backfill.json`; neither supplies 9/16-9/22 aggregate planned-capital summaries or exact 9/16 plan rows. The formal backfill contains only 2026-09-11 -> 2026-09-14 plan rows.
- Searched main code index for planned-capital/allocation summary terminology; no additional safe plaintext artifact surfaced.
- Re-read checkpoint immediately before write; blob SHA remained `e14fc7b49f884b052e6352b375ebf9f3ec0dfd9f`, so no concurrent A/B checkpoint update is overwritten.

### Finding 1 — aggregate THEORETICAL/PLANNED capital attribution is identifiable without plan decryption
Using the already-proven frozen allocator caps and selected counts only:
- 2026-09-16: 3 SELECTED -> allocator maximum planned deployment cap = 85%; therefore at least 15% capital is structurally outside the max planned deployment even if every planned position ultimately fills/adds to its allowed maximum. Approximate first-tranche planned deployment = 51%, leaving about 49% not deployed at first tranche before symbol-level caps/rounding/fill effects.
- 2026-09-17: 2 SELECTED -> allocator maximum planned deployment cap = 60%; therefore at least 40% capital is structurally outside the max planned deployment even if both names ultimately fill/add to allowed maximum. Approximate first-tranche planned deployment = 36%, leaving about 64% not deployed at first tranche before symbol-level caps/rounding/fill effects.
These are allocator-design/theoretical quantities, **not executed utilization** and not evidence of actual cash balances.

### Finding 2 — selection breadth and allocator conservatism are jointly sufficient to explain substantial planned cash, but not actual idle cash
For these two dates, low SELECTED count mechanically invokes lower portfolio deployment ceilings. Thus some planned cash retention exists before any BUY timing, 15m confirmation, fill, ADD or restoration issue is considered. However, the gap between theoretical planned deployment and actual invested capital remains UNKNOWN because BUY-observed/confirmed fill/add evidence is not durably joinable. It is invalid to attribute all observed idle cash to selection scarcity or all of it to execution friction.

### Finding 3 — the first-tranche/max-cap gap is position-management reserve, not a selection failure
For 9/16 the gap between approximate first tranche (51%) and max planned cap (85%) is ~34 percentage points; for 9/17 it is ~24 points (36% -> 60%). This reserve is intentionally contingent on later ADD/FULL progression. Therefore measuring capital utilization only immediately after first BUY would systematically understate the allocator's intended eventual exposure and confound entry timing with position management.

### Finding 4 — a non-sensitive plan-summary artifact is useful, but modifying the authorized mirror workflow is Class B
A minimal future summary could contain only `scanDate`, `selectedCount`, `aggregateFirstTranchePct`, `aggregateMaxPlannedPct`, and a payload/hash provenance link, with no symbol, zone, stop, target, signal or secret. This would materially improve capital-attribution observability while limiting leakage.
However, producing it by changing `.github/workflows/v8-plan-mirror.yml`, deployment pipeline behavior, or shared export behavior falls under governance Class B even if the derivative itself is research-only. Therefore no workflow/runtime change was made. A purely offline derivative is only Class A if it consumes an already-available plaintext export without changing shared runtime/workflow; such plaintext input is not currently available to the connected safe tools.

### Supporting evidence / falsification / alternatives
- Supporting: selected-count evidence plus frozen allocator caps mathematically bounds theoretical max deployment without needing symbol identities.
- Falsification: allocator ceilings do not prove actual deployment; no fill journal exists and encrypted plan rows remain inaccessible to safe reads.
- Alternative mechanism: actual idle capital may additionally arise from BUY-zone non-entry, 15m confirmation, rounding, per-symbol sizing caps, failed/no fills, lack of ADD, REDUCE/SELL/STOP, or manual/brokerage actions. Their contributions remain UNKNOWN unless independently evidenced.
- Counterfactual caution: increasing selected count would mechanically raise the allocator ceiling, but it could also admit weaker names and degrade Selection Alpha; 4763 vs 1301 evidence remains a warning against blanket loosening.

### Bias / data-quality checks
- No encrypted content inferred; no secret requested.
- No actual cash/fill percentage inferred from theoretical allocator percentages.
- No later holding state used to backfill historical execution.
- Selection breadth and execution are kept as separate causal stages to avoid post-treatment/confounding errors.
- Two dates are descriptive only; no directionality/generalization, no threshold tuning, no Factor-Zoo expansion.
- Transaction costs cannot be applied meaningfully until actual/assumed executed turnover is defined; remain UNKNOWN at execution layer.
- Date-cluster warning remains severe: 9/16 and 9/17 are only two adjacent dates, not independent multi-regime validation.

### R01-R08 / I01-I07 impact
- No definition/status change; no R09/I08.
- This is capital-funnel observability, not evidence for factor promotion.

### Engineering classification / tests / deployment
- Evidence analysis only; no code/schema/workflow/runtime change.
- Proposed mirror-derived summary via workflow modification = Class B proposal; not implemented or deployed.
- Formal Core unchanged by construction.

## Exact next continuation point
1. Re-read latest main checkpoint + latest research commit; merge any newer A/B progress before work.
2. Do not repeat B-21 append-only audit, B-22 encrypted mirror audit, or B-23 aggregate allocator arithmetic unless artifacts materially change.
3. Continue USER PRIORITY OVERRIDE at the next causal stage: inspect safe durable evidence for the **SELECTED -> BUY-observed** funnel on 9/16-9/22. Quantify only identities/dates that are explicitly evidenced; no BUY evidence means UNKNOWN, not no-buy.
4. Separately inspect whether current research Execution Alpha/coverage diagnostics expose aggregate BUY-observed counts by scan date without protected secrets. If yes, use them to estimate observational conversion from SELECTED to BUY-observed, clearly distinct from confirmed fills. If no, document the observability gap and continue.
5. Preserve three utilization layers in all subsequent work: (a) THEORETICAL allocator ceiling, (b) PLAN/intended tranches, (c) EXECUTED confirmed fills/actual shares. Never collapse them.
6. Continue restoration concepts Shadow-only/untuned. Any formal A/B, liquidity, RR, 15m, allocator, trim, restoration, or signal-recorder change remains Class B/C and must not be promoted autonomously.