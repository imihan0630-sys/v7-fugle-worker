# Research Checkpoint

Checkpoint sequence: B-96.
Updated: 2026-09-24 09:09 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-95 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-95
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified; do not pool them as one frozen experiment.
- V8.9.6 inspected source adds audit/output fields without a visible WATCH eligibility change, but it is shared-runtime/deployment work and therefore at least Class B. V8.9.3-8.9.5 owner authorization remains UNKNOWN absent durable owner evidence.

## B-96 — trusted read-only Production evidence and new zero-pick date
### Fresh evidence
- Re-read governance, worklist and B-95 checkpoint. Checkpoint blob SHA immediately before this write was `6be538a4f70076b921b483ea40fa9adc240eb18d`.
- Latest main before this write is B-95 checkpoint commit `8b0b69609c5781fe5a4c8c847e383d0fb91cc7cf`; no newer semantic code commit followed it.
- GitHub Actions run `35937377710` for deploy commit `c322c13163016a76b77c0a7d0e19ee0d0caa82f7` completed SUCCESS. Its authorized read-only Production preflight returned literal runtime version `8.9.5-hybrid-watch-directional`, `testMode=false`, all required bindings/checks true, history cached=1903/target=1889/resolved=1889, institutionCompleteDays=10.
- Therefore repository/deploy intent was V8.9.6, but trusted Production readback during that run was still **V8.9.5**, not V8.9.6. `PRODUCTION_VERSION_AT_2026-09-24T00:13Z=8.9.5-hybrid-watch-directional` is proven. `V8_9_6_PRODUCTION_ACTIVE` remains UNKNOWN/not proven.
- Same authorized read-only diagnostic returned latest scanDate `2026-09-23`, dryRun=false, Formal `selectedCount=0`, Hybrid `hybridSelectedCount=0`.
- The 2026-09-23 daily report was sent and webhook-accepted (`HTTP 200`, `deliveryState=ACCEPTED`, `resultType=ZERO_MATCH`, `zeroSelection=true`, `pushRequired=true`), with matching outbox signal `DAILY_SELECTION:2026-09-23`. Phone receipt remained unverified (`receiptVerified=false`; receipt totals zero).
- Plan bridge for this zero-pick scan was not sent/verified, which is consistent with no plan payload to bridge; this is not evidence of a brokerage fill or execution.

### Interpretation / falsification
- Falsified inference: a successful deploy workflow plus source version `8.9.6-hybrid-watch-audit` proves V8.9.6 is live. It does not; the workflow's own authorized Production readback still saw V8.9.5.
- Falsified inference: webhook HTTP acceptance proves handset receipt. It does not; phone receipt is independently unverified.
- 2026-09-23 is now a second trusted Formal zero-pick date after 2026-09-22. There is no >=1 Formal plan on the newest trusted date, so execution-recorder/funnel signal interpretation cannot advance from a new selected cohort this turn.
- Zero-pick is an observed outcome, not automatically a strategy defect. Coverage/zero-pick risk remains under prospective monitoring; two adjacent dates are insufficient for threshold/rule changes and cannot justify data snooping.
- Hybrid WATCH remains moving-target research unless cohort rows carry semantic-version provenance. V8.9.6 must not be merged into V8.9.5 cohort semantics merely from repository intent; live activation itself is not proven.

### Bias / governance controls
- No R01-R08/I01-I07 definition changed. No historical Shadow was fabricated.
- Selection bias, look-ahead, data snooping, market-source bias, Factor Zoo, overfit, coverage, zero-pick, transaction cost, date clustering and redundancy checks remain active.
- Missing V8.9.6 live readback and owner authorization remain UNKNOWN, never BAD/0.

### Engineering / deployment
- Evidence inspection + checkpoint only. No Worker, D1/KV schema, workflow, dashboard, selection, monitoring, notification or Production deployment changed by B-96.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Seek the next trusted authorized read-only Production readback. Specifically determine whether V8.9.6 ever becomes literal runtime `/api/version`; do not infer activation from workflow success or repository version strings.
3. Because latest trusted Formal scan 2026-09-23 is zero-pick, do not interpret execution signals as a new selected cohort. If a later trusted scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` stays research-only on Formal SELECTED names.
4. Quantify prospective zero-pick/coverage only by independent scan date as observations accumulate. Two adjacent zero-pick dates are descriptive only; no threshold tuning or formal rule change.
5. For Hybrid WATCH research, require version-stratified cohort provenance across V8.9.3/V8.9.4/V8.9.5. Treat V8.9.6 as same eligibility regime only after trusted live/source evidence confirms no intervening semantic patch and activation date is known.
6. If no newer formal-plan evidence is available, resume R03/R06 supplied-row work: quantify `未分類` in persisted Top5 and report structural membership separately from semantic-classification quality; no threshold and no date dropping.
7. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; keep malformed rules and historical raw-tie UNKNOWN semantics frozen.
8. Do not implement validator/helper on main; workflow-path changes remain Class B proposal-first. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
