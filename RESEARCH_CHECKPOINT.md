# Research Checkpoint

Checkpoint sequence: B-97.
Updated: 2026-09-24 09:40 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-96 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-96
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified; do not pool them as one frozen experiment.
- V8.9.6 inspected source adds audit/output fields without a visible WATCH eligibility change, but it is shared-runtime/deployment work and therefore at least Class B. V8.9.3-8.9.5 owner authorization remains UNKNOWN absent durable owner evidence.
- B-96 proved trusted Production runtime at 2026-09-24T00:13Z was still `8.9.5-hybrid-watch-directional`, despite V8.9.6 deploy intent. Latest trusted completed scan remained 2026-09-23 with Formal selectedCount=0 and Hybrid selectedCount=0. 2026-09-22 and 2026-09-23 are two adjacent observed Formal zero-pick dates; descriptive only, not a threshold-change basis.
- B-96 also separated webhook acceptance from handset receipt: 2026-09-23 daily zero-match webhook was ACCEPTED, while phone receipt remained unverified.

## B-97 — 2026-09-24 intraday read-only health observation
### Fresh evidence
- Re-read governance, worklist and B-96 checkpoint. Checkpoint blob SHA immediately before this write was `d2f6b609253487d475671d6b438a90bd7d847659`.
- Re-checked main immediately before write: head remained B-96 commit `8c8d4c7d312030a43bfc97a98aea7a863fa46dff`; no newer A/B checkpoint or semantic code commit appeared.
- Scheduled read-only health run `35942927209`, started 2026-09-24T01:26:31Z, completed SUCCESS on that B-96 head.
- Its actual intraday diagnostic for `2026-09-24` reported: `monitoredCount=0`, `formal15Ready=0`, `waitingForFreshData=0`, `notificationCount=0`, `noSyntheticPush=true`, `handsetReceiptVerified=false`.
- Same run reported Cron verified, push outbox `unresolved=0`, `staleUnresolved=0`, and handset receipts total=0/intraday=0.
- Acceptance reconciliation made no changes and explicitly reported `noPlanChanges=true`, `noPush=true`, `noThreeMinWrite=true`, `noTrade=true`.
- The workflow step that verifies an actual completed full plan/external mirror was skipped, consistent with there being no qualifying completed plan to inspect at that moment.

### Interpretation / falsification
- At the 09:26 Asia/Taipei observation, there was no active monitored plan and no 15-minute-ready Formal signal. This is an intraday state observation, **not** a third daily zero-pick result; the 2026-09-24 formal after-close selection had not occurred yet.
- `monitoredCount=0` is consistent with the latest trusted 2026-09-23 zero-pick scan and supplies no new execution cohort. Therefore execution-recorder/funnel signal interpretation remains blocked by absence of a new Formal selected plan, not by recorder outcome.
- No synthetic push occurred and no unresolved/stale outbox existed, so this read gives no evidence of a notification backlog. It still does not prove handset delivery capability because handset receipts remained zero/unverified.
- This health run did not print literal `/api/version`; therefore it does **not** upgrade V8.9.6 activation. Latest trusted literal Production version remains B-96's `8.9.5-hybrid-watch-directional` until a newer authorized readback proves otherwise.
- Do not count the 2026-09-24 intraday zero-monitor state in the independent-date zero-pick denominator. Mixing intraday no-monitor with completed after-close zero-pick would create a denominator/temporal-definition error.

### Bias / governance controls
- No R01-R08/I01-I07 definition changed; no historical Shadow fabricated.
- Zero-pick monitoring remains by completed independent scan date only. No threshold tuning from two completed zero-pick dates plus one intraday no-monitor observation.
- Selection bias, look-ahead, data snooping, market-source bias, Factor Zoo, overfit, coverage, transaction cost, date clustering and redundancy controls remain active.
- Missing V8.9.6 literal live readback, handset receipt and owner authorization remain UNKNOWN, never BAD/0.

### Engineering / deployment
- Evidence inspection + checkpoint only. No Worker, D1/KV schema, workflow, dashboard, selection, monitoring, notification or Production deployment changed by B-97.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Seek the next trusted authorized read-only Production readback that actually emits literal runtime `/api/version`; determine whether/when V8.9.6 becomes live. Do not infer from deploy intent or health success.
3. Wait for a completed later Formal scan before updating zero-pick coverage. Never count intraday `monitoredCount=0` as a completed daily zero-pick.
4. If a later trusted scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` stays research-only on Formal SELECTED names.
5. For Hybrid WATCH research, keep V8.9.3/V8.9.4/V8.9.5 cohorts version-stratified. Treat V8.9.6 as same eligibility regime only after trusted activation date plus source evidence confirms no intervening semantic patch.
6. If no newer completed formal-plan evidence is available, resume R03/R06 supplied-row work: quantify `未分類` in persisted Top5 and report structural membership separately from semantic-classification quality; no threshold and no date dropping.
7. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; keep malformed rules and historical raw-tie UNKNOWN semantics frozen.
8. Do not implement validator/helper on main; workflow-path changes remain Class B proposal-first. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
