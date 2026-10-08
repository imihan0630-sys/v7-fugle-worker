# System 2 Decision Clock A1 / Stage-1 Source Selection Alignment V0.4

Status: RESEARCH-ONLY / CORR-20261007-001 CODE FIX CANDIDATE
Owner: DATA_LANE
System 1 Formal and System 2 live trading authority: UNCHANGED

## The defect (source-identity mismatch, not a market outage)
2026-10-07 prospective Decision Clock used only latest OpenAPI endpoints and reported
30/30 A1 attempts NOT_READY. The later scheduled Daily Shadow run 37609474459
proved the same date READY on canonical exact-date TWSE MI_INDEX (1086 rows)
and TPEx dailyQuotes (887 rows). Old failed observations are not rewritten.

## Future source semantics
- Preserve A1 daily-gate family IDs for TWSE and TPEx.
- Reuse the exact existing resolveMarketPayload selector from Daily Shadow,
  without changing live Stage-1 selection or the canonical source parser.
- Query primary OpenAPI first. If stale, transport failed or non-JSON, try
  exact-date TWSE MI_INDEX or TPEx dailyQuotes independently per market.
- Never treat TPEx legacy otc_quotes_no1430 as canonical equivalent.
- Require exact requested-date evidence, unique symbol/OHLC source integrity
  and >=600 TWSE / >=450 TPEx ordinary symbols with usable close prices.
- Record PRIMARY / EXACT_DATE_FALLBACK, source URL, primary HTTP/error/reported
  dates, exact-date result and failure for every clock probe.
- Stamp any fallback READY first-observation bound AFTER the fallback response
  arrives. Historical SESSION_CLOSE_FINALITY is not a prospective timestamp.
- If no canonical source qualifies, remain NOT_READY / SOURCE_ERROR / INVALID.
- No D1 writes, no Shadow trading authority and no Worker capture enabled.

## Explicit new observer epoch and original freeze preservation
The original V0.3 freeze manifest contracts/decision_clock_collector_freeze_v0_1.json
remains byte-for-byte immutable and never has its historic evidence relabeled.
New collector-contract file runtime/decision_clock_collector_contract_v0_4.mjs
and freeze contracts/decision_clock_collector_freeze_v0_2.json bind 15 files,
including the Stage-1 shared selector and official exact-date parser.

The evidenceEpoch is S2_CLOCK_A1_STAGE1_EXACT_DATE_ALIGNMENT_EPOCH_V0_4.
Existing daily bundle version V0.3 and provenance schema V0.3 remain
consumer-compatible, but the embedded collectorContractVersion becomes V0.4
and an explicit evidenceEpoch is attached. V0.3 and V0.4 fingerprints must
NOT pool towards 10-date or 20-date Decision Clock promotion thresholds.
First V0.4 sample requires a real officially verified prospective trading day
after the new main merge; historical 2026-10-07 evidence is comparison only.

## Acceptance
1. Unit falsification: stale TWSE, NON_JSON TPEx, already-READY primary,
   source-date mismatch, transport failure and invalid close-price coverage.
2. Exact source identity and real post-response observedAt with no PIT backfill.
3. Original 13-file freeze manifest intact and new 15-file V0.4 freeze PASS.
4. Research CI and V8 regression PASS before main merge.
5. Subsequent real trading-date read-only artifact verifies physical selected
   source path. If primaries are both READY, exact-date recovery remains
   physical evidence PENDING, not falsely marked complete.

No Strategy/Ranking/Selection/Push/Capital/Order or System1 Formal changes.
