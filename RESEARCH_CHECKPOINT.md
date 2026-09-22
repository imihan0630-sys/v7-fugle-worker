# Research Checkpoint

Checkpoint sequence: B-22.
Updated: 2026-09-22 21:43 Asia/Taipei.

> Canonical cursor for both A/B research schedules. B-21 and earlier evidence remains durable in Git history; do not re-run completed work.

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

## Retained findings through B-21
- 9/16: 1,873 scanned -> 3 selected. 9/17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 primary liquidity rejects; 335 no A/B formation.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Tiny 9/16-9/17 cohorts had meaningful MFE but weak endpoint advantage vs TAIEX; selection quality, execution and position management remain separate hypotheses.
- 4763 vs 1301 on 9/18 remains evidence against blanket BUY loosening.
- Production B is stricter confirmed-breakout quality than the owner's intended pre-breakout/catch-up concept; redesign would be Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; this is an evidence-coverage gap, not proof the gate is wrong.
- Exact 8046 reduction recommendation/fill timestamp, price and reduced shares remain UNKNOWN.
- Current REDUCE = profit-zone distribution; generic downside exits are separate STOP_LOSS/SELL mechanisms.
- Exact 9/16 plan identities/zones/stops/targets remain unjoinable from previously inspected plaintext repo evidence and therefore UNKNOWN.
- Restoration concepts STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY remain untuned Shadow concepts only.
- `v7_signal_delivery_state` is current delivery/dedup state, not an append-only execution journal; push acceptance is not brokerage execution.
- B-21 completed the repository schema/tree audit: no separate append-only per-symbol operation-signal/fill journal was found. Historical BUY/ADD/REDUCE/STOP_LOSS/SELL instances and fills remain UNKNOWN. A prospective recorder touching the formal signal path is Class B unless isolated.

## NEW B-22 — encrypted plan mirror provenance boundary
### Research question
Can safe repository artifacts recover exact formal plan identities/planned-capital rows for 9/16-9/22 without inferring BUY/fills or exposing secrets, and can the existing mirror be repurposed as a post-hoc Class A signal collector?

### Evidence audited
- Re-read latest main governance, worklist and checkpoint first; checkpoint was B-21.
- Inspected main repository tree, `data/recovered_chat_selections.json`, `.github/workflows/v8-plan-mirror.yml`, `tests/github_plan_mirror.mjs`, `external-mirror/latest.enc.json`, and commit history for the mirror path.
- Re-read checkpoint immediately before write; blob SHA remained `6b93ee96d89208a36a5032548e72766fc3668f01`, so no concurrent A/B checkpoint update is being overwritten.

### Finding 1 — a durable plan archive exists, but plaintext is intentionally unavailable to safe repo reads
The repository contains an encrypted V8 plan mirror. `tests/github_plan_mirror.mjs` exports `/api/storage/export-current`, verifies `provider=D1_GITHUB_ENCRYPTED`, and encrypts `payloadJson` using AES-256-GCM with a key derived from `V7_ADMIN_TOKEN`. The committed envelope contains ciphertext + hash only; plaintext is explicitly excluded. Therefore the safe GitHub connector can prove a plan payload was mirrored and its hash, but cannot recover exact symbols/zones/stops/targets/capital rows without the protected secret. This is a provenance boundary, not evidence that plan rows do not exist.

### Finding 2 — mirror history currently proves only two durable payload versions in the inspected path history
Commit history for `external-mirror/latest.enc.json` shows mirror commits dated 2026-09-19 and 2026-09-21, with payload hashes `2ae424...` and `96513b...`. The latest envelope hash is `96513b...`. Commit time is mirror time, not automatically the plan's scanDate; exact scanDate/plan rows remain encrypted. No 9/16-9/18 exact plaintext plan identity is recoverable from these safe reads alone.

### Finding 3 — the existing mirror is plan-only and cannot serve as an isolated operation-event collector
The mirror workflow runs after the formal scan and calls the admin export-current endpoint. Its safety assertions explicitly require `noPlanChanges`, `noPush`, `noThreeMinWrite`, and `noTrade`. This is useful as a post-hoc plan archive, but it observes the current plan payload, not per-event BUY/ADD/REDUCE/SELL signal episodes. Reusing it does not close the B-21 operation-event gap unless a separate already-produced append-only event source exists—which B-21 did not find.

### Finding 4 — no safe Class A post-hoc signal collector is presently supported by durable outputs
Because current durable outputs expose plan snapshots and current delivery/dedup state rather than an append-only event stream, a post-hoc collector would either (a) miss transient signal episodes or (b) have to read/modify the shared formal signal path/state. Thus no reliable Class A event recorder design is established yet. The prospective event recorder remains a Class B proposal; no integration was performed.

### Finding 5 — capital-utilization attribution remains partially identifiable, execution utilization does not
Allocator-cap mechanics and selected-count evidence can still quantify theoretical/planned utilization at an aggregate level. Exact per-symbol planned first tranche/max allocation for 9/16-9/22 requires decryptable plan payload or another plaintext durable artifact. BUY-observed and confirmed fill utilization remain UNKNOWN and must stay separate from SELECTED/planned capital.

### Supporting evidence / falsification / alternatives
- Supporting: encrypted mirror workflow is deliberately designed to preserve exact plan payloads without plaintext leakage and verifies the encrypted readback against production export.
- Falsification: presence of encrypted mirror files does not make their internal plan rows safely observable; ciphertext/hash cannot be treated as symbol-level evidence.
- Alternative: an authorized workflow possessing `V7_ADMIN_TOKEN` can decrypt/verify internally, but current connected safe read tools do not expose the secret and must not request it in chat. A future research artifact could emit non-sensitive plan-summary statistics only if designed without altering Formal Core; any shared-runtime change must be classified before implementation.

### Bias / data-quality checks
- No ciphertext was guessed/decrypted without the key.
- No commit timestamp was substituted for scanDate.
- No selected symbol was inferred from later holdings or price behavior.
- No plan row was treated as BUY or fill evidence.
- Missing exact plan rows remain UNKNOWN, not zero.
- No new factor/window/threshold; no Factor-Zoo expansion.

### R01-R08 / I01-I07 impact
- No definition/status change; no R09/I08.
- Execution/restoration evidence remains provenance-limited.

### Engineering classification / branch / tests / deployment
- Class A evidence/provenance audit only; no code/schema/runtime change.
- Existing encrypted mirror remains unchanged.
- Prospective operation-event recorder remains Class B as currently conceived; no autonomous merge/deploy.
- Formal Core unchanged by construction.

## Exact next continuation point
1. Re-read latest main checkpoint + latest research commit; if another A/B run advanced it, merge and continue from the newer cursor.
2. Do not repeat B-21 append-only schema audit or B-22 encrypted-mirror boundary audit unless main/runtime artifacts materially change.
3. Continue USER PRIORITY OVERRIDE by inspecting any remaining safe plaintext artifacts/workflow outputs for 9/16-9/22 exact plan identities or aggregate planned-capital summaries. Do not attempt to obtain or expose `V7_ADMIN_TOKEN`; do not infer encrypted content.
4. Evaluate a **research-only non-sensitive plan-summary artifact** design that could be produced from already-existing plan export in the authorized mirror workflow (e.g., scanDate, selected count, aggregate planned first-tranche %, aggregate planned max %, with no trading-side mutation). Classify carefully: changing deployment/workflow or shared export path may be Class B; a purely offline derivative of already-exported plan data may be isolatable but must not leak sensitive plan details.
5. If exact plan rows remain inaccessible, shift research to aggregate capital attribution using already-proven selected counts + frozen allocator caps, explicitly labeling it THEORETICAL/PLANNED rather than executed. BUY/fill utilization stays UNKNOWN.
6. Keep restoration concepts Shadow-only/untuned; any formal restoration, liquidity, A/B, RR, 15m, allocator, trim or signal-recorder integration change that can affect production remains Class B/C and must not be promoted autonomously.
