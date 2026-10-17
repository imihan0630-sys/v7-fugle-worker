# System 2｜Scheme C 每日非 PIT 研究預覽：交付驗收機制 V0.1

Date: 2026-10-17 Asia/Taipei
Owner: BUILD_LANE; Class A read-only / no formal selection.

## Why this exists

The actual independent audit → Scheme C consumer `workflow_run` chain can deliver a usable non-PIT source observation even when the ORIGINAL market source collector began through `push` or manual `workflow_dispatch`. Treating this consumer child as proof of the original scheduled collector would falsely inflate launch success. Conversely, a legitimate late preview is useful but cannot be projected back to the market date T 23:45.

## Implemented contract

- `system2/runtime/scheme_c_daily_delivery_acceptance_v0_1.mjs` independently rechecks three existing derived objects and the exact human report text: the signed source-only handoff `receiptHash`, signed delivery-origin `deliveryOriginHash`, and report `reportHash`.
- Same market T, same independent audit run ID, exact handoff receipt SHA, consumer run ID, fixed T23:45 UTC conversion, per-source readiness, natural-event classification, count consistency and no-after-cut relabeling are all enforced.
- Five outcome types: `SOURCE_NOT_READY`, `PR_HISTORICAL_REPLAY_ONLY`, `OPERATOR_MANUAL_RECOVERY_ONLY`, `NATURAL_AUDIT_CHILD_LATE_SOURCE_PREVIEW`, `NATURAL_AUDIT_CHILD_ON_TIME_PREVIEW__SOURCE_CRON_UNVERIFIED`.
- No status claims that the original A1 collection was triggered by a scheduled Cron. `originalSourceCronProven=false` and `fullDailyScheduledChainAccepted=false` are locked even when the audit-child receipt exists. Native DATA/AUDIT provenance for source-run event remains an independent P0 task.
- `selectedCount` and `zeroPickDay` stay null. PIT-A, PIT-B, Stage1 selection, Shadow, Frozen, order, push, Cloudflare writes and System1 Formal are all explicitly unauthorized.
- `system2/scripts/run_scheme_c_daily_delivery_acceptance_readonly_v0_1.mjs` creates only a new GitHub Actions derived `daily-delivery-acceptance.json`, refusing existing paths (`wx`). The existing consumer retains its single same-run independent A1 artifact, separate PR fixture, no new market API GET, no additional Cron/secret/account.
- Seven focused adversarial tests cover positive late and before-cut child receipts, manual/PR nonpromotion, incomplete source, hash/clock/date/run/count spoofing and false downstream authority.

## Verification boundary

A passing GitHub CI test demonstrates code contract only. True next-market-date **automatic SOURCE schedule → independent AUDIT → natural Scheme C child** still needs exact original source-run GitHub event provenance plus all real Run/Artifact/SHA readbacks. No 2026-10-16 PR replay, manual recovery or self-triggered audit may substitute. No acceptance under this code implies PIT/Frozen or trade authority.

Current known positive source-only 2026-10-16 independent audit run: `38934321405`, exact 122/122; descriptive matched 519/displayed 30 under separate non-PIT semantics. This is previous original evidence, **not** evidence of a new actual daily automatic delivery by this change.

For on-going BUILD state see `system2/SYSTEM2_CHECKPOINT.md` and Issues #1132 / #1234; independent original source provenance goes to DATA #1068 and AUDIT.
