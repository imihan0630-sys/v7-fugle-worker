# System2 BUILD M09｜每日七因子逐股評估實體可見帳本 V0.1

Date: 2026-10-18 Asia/Taipei. Owner's first priority: `system2/SYSTEM2_SELECTION_FIRST_OWNER_PRIORITY_20261017_V0_1.md`. Class A read-only, build lane #1132/#1234, DATA original source #1068, AUDIT independent #1127.

## Problem and non-duplicated fix

- `stage1ResearchFromAuditedSourceV0_1` already evaluates all official A1 four-digit symbols with the **existing, unmodified** `SHORT_MOMENTUM V0.1-CONTRACT` seven-factor assessor, after 122/122 original TWSE/TPEx A1 and source-only independent audit. `daily_selection_readiness_v0_1` already verifies exact source/evaluator per-symbol identity and hash and summarizes UNKNOWN/qualified counts. However its human-facing preview report is a **different four-condition price/volume model** and there was no per-symbol complete Stage1 reason artifact.
- **New:** `system2/runtime/stage1_daily_symbol_accounting_v0_1.mjs` re-runs the existing strict receipt validator and requires its receipt SHA match. It emits a new hash-bound, optional Stage1-derived full per-symbol observation journal:
  - full exactly reconciled A1 four-digit scope, per-symbol TWSE/TPEX identity, name, originating source row SHA, actual Stage1 observation state `INCOMPLETE/REJECTED/WATCH/QUALIFIED_NOT_SELECTED`, missing PIT reason codes, and traceable factor/assessor SHA where genuinely qualified; max-30 *human display* but full receipt JSON includes every row.
  - `sourceFourDigitInstrumentCount` is NOT a certified ordinary share denominator. `selectedCount=null`, `zeroPickDay=null`, `rank=null`, `frozenD1Written=false`, never a true formal strategy pick or forecast.
  - If 121/122, late or source blocked, shows SOURCE_BLOCKED_NOT_ZERO_PICK with no fabricated per-symbol list. No PIT CFI or CA automatically inferred from code or first factor's default failure.
- **Wired** in existing `system2/scripts/run_shared_official_a1_stage1_readonly_v0_1.mjs` into two new `wx` read-only output files:
  - `/tmp/s2-a1-stage1-readonly/stage1-symbol-accounting.json`
  - `/tmp/s2-a1-stage1-readonly/stage1-symbol-accounting.md`
- Existing `system2-shared-official-a1-independent-audit.yml` adds these to the **same existing 7-day artifact** and checks source/date/receipt SHA and no selection/Frozen. It neither changes schedules nor scopes, nor grants independent strategy/PIT audit: original A1 integrity is independent, decision Stage1 is still research-only.
- `system2/tests/stage1_daily_symbol_accounting_v0_1.test.mjs`: seven adversarial tests for 121/122 not zero picks, 2/2 explicit PIT blocker rows, qualified not selected rank/Frozen locked, WATCH ≠ 0 formal picks, altered signed readiness, altered signed Stage1 symbol, bounded rendering.

## Production/live acceptance status and continuation

- Current actual *original four-digit A1* T=2026-10-16 DATA Run #39044778550, Artifact #12105302588, 1972/1972 (TWSE 1086, TPEx 886), 61 sessions original A1 122/122. Not a certified ordinary equity denominator. Formal real Stage1 positive still depends on native CFI history/CA six family NO_EVENT/revision/tradeability and AUDIT independent original provider readback. 2330 & 3287 existing control sample 0/2 PIT-A, not proof of full-market 0 picks; official Frozen D1 0 and S0-S5 0/6.
- First future actual T 2026-10-19 will have a new true run when native source and schedule physically arrive, not a Saturday/Sunday fabricated market-day. This code's CI fixtures cannot certify physical T selection or Frozen.
- Existing `m09_stage1_native_evidence_intake_v0_1.mjs` allows exact source/date-bound optional independent CA/CFI bundle as of actual run. DATA #1068 provides, AUDIT #1127 verifies physical originals, BUILD consumes to produce genuinely assessed/qualified-not-selected rows. Formal rank, capacity, Frozen D1 and prospective outcome remain separate protected owner authorization.
- Isolated from System1 Worker/Formal, seven-factor frozen strategy policy, selection threshold/ranking, Cloudflare D1/R2, source network GET, fresh Cron, push and orders.
