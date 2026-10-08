# System 2 Recent60 July Frozen Hot D1 / Cold R2 / Official A1 Readonly V0.1

Status: DATA_LANE / CLASS A / PHYSICAL WORKFLOW CANDIDATE  
Scope: **12 selected symbols × 8 exact early-July 2026 dates**, retrospective only  
System1 production impact: NONE

## Why this audit is needed

Immutable GitHub Action #37854849181 found 96/96 sampled expected PIT market-symbol-dates absent from isolated hot D1. It did **not** check cold R2, original official-source physical availability, historical PIT publication timestamps, or a random sample of all stocks. The separately certified TWSE January–June R2 packs do not establish July 2026 coverage. An all-market write-heavy backfill without this reconciliation can exhaust the account's free-tier D1 writer budget.

Frozen sample input:
`system2/evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json`

Sample Git blob identity **5346c9cf908b5ed66266460dc342fce803c2369c** is guarded by the runner and tests. The sample contains six TWSE symbols (1563, 6949, 2321, 3356, 3591, 6550), six TPEx symbols (3710, 4747, 6129, 8059, 8277, 6461) and observed missing expected sessions 2026-07-14, 15, 16, 17, 20, 21, 22, 23.

## Execution and precise interpretation

1. For both markets, read the existing 2026-07 isolated D1 segmented cold receipt, distinguishing no receipt from non-COMPLETE and COMPLETE. The status of a **month** is never silently inferred from a missing **symbol**.
2. Re-query 96 exact hot-D1 market-symbol-date identities using only SELECT (and record RAW versus non-RAW space separately). The result may differ from the original 06:40 physical sampling; that is a new observation and does not rewrite #37854849181.
3. Read only the twelve bounded July symbol manifests. If a manifest is present, use the canonical cold loader to verify full R2 bytes / SHA-256, extract only the eight sample dates and attribute whether a cold BAR is physically present. A manifest without a COMPLETE receipt is **unreceipted**, not an accepted historical-data batch.
4. Make four bounded **retrospective** official TWSE/TPEx exact-date GET probes (first and last sampled dates) to confirm source date and current row visibility. An HTTP/parse/date failure yields `OFFICIAL_SOURCE_RETRIEVAL_UNVERIFIED`, not proof of official data absence.
5. Every result is recorded as an immutable Action Artifact. A blocked audit writes the error stage and which bounded samples were already checked. R2/D1 writes: 0.
6. The 96 sampled pairs are not an unbiased cross-section and cannot be scaled into whole-market percentages, causal source-outage claims, full replay, or final selection authorization.

## Fail-closed class distinctions

- `HOT_D1_ROW_NOW_PRESENT_PIT_STATUS_UNDETERMINED`: RAW row presently exists; historical cutoff eligibility is *not* granted by physical presence.
- `HOT_D1_NON_RAW_ROW_PRESENT_RAW_STILL_ABSENT`: non-RAW row exists; does not satisfy RAW history.
- `COLD_R2_BAR_PRESENT_HOT_D1_ABSENT`: month receipt COMPLETE and R2 source bytes/date physically verified, but bounded hot D1 RAW date absent. Supports a *potential hot-materialization gap*, not retrospective firstKnownAt.
- `UNRECEIPTED_COLD_R2_BAR_PRESENT_HOT_D1_ABSENT`: readable cold bytes but no COMPLETE month receipt; no promotion.
- `COLD_MANIFEST_PRESENT_BUT_EXACT_DATE_NOT_IN_PACK`: a physical pack exists for a symbol but does not contain this date; could be valid no-trade/suspension or a source gap, independent continuity still required.
- `COMPLETE_MONTH_RECEIPT_SYMBOL_MANIFEST_ABSENT`: COMPLETE month receipt exists but the sampled ordinary symbol has no month manifest; requires independent universe/lifecycle reconciliation.
- `NO_COMPLETE_MONTH_RECEIPT_OR_SYMBOL_MANIFEST`: neither a COMPLETE month receipt nor that symbol's month manifest exists in D1; **not** proof that R2 or official primary data is absent.

No corporate-action `NO_EVENT`, `CLEAR_NO_ACTION`, suspension or symbol-level NC-T01 technical continuity can be promoted from an empty table alone. No market-date cutoff or observedAt is backdated.

## Acceptance / next action

- System2 Research CI and V8 regression PASS, then merge into latest GitHub main.
- The merged-main Action runs a bounded isolated D1 SELECT / R2 GET+hash / official GET diagnostic with no writer, retaining positive and negative evidence separately.
- Read Artifact and classify the exact observed July state. If missing COMPLETE receipts are the primary bottleneck, propose budget-aware July segment ingestion only **after** REMEDIATION_LANE account-wide D1 budget and single-writer approval. Do not assume an 08:00 reset alone authorizes a competing writer.
- For 46 exact history-ready symbols still lacking continuity, NC-T01 needs independent full-window corporate-action, lifecycle, suspension, PIT-vintage and NO_EVENT coverage receipts.

System1 V8 Formal Core, runtime, selection, BUY/SELL, capital, order and push untouched.

## DATA_LANE read quota economization (2026-10-09)

Observed merged-main physical Action #37858652385 was blocked at the very first D1 SELECT by Cloudflare's **daily row READ** free-tier limit, before processing any of the 96 frozen identities. This is not official source absence. Independently, PR #922 physical Action #37859630615 has already proven all 96 original symbol-date identities currently visible at canonical TWSE/TPEx official historical sources with zero D1 calls.

To reduce the next diagnostic's D1 read pressure, the bounded physical reader accepts `batchHotManifestRead=true` and its runner enables it. This makes exactly **6 planned SELECT statements** for twelve symbols rather than 26 repeated per-symbol SELECTs: 2 July receipt reads + 2 batched (TWSE, TPEx) Hot D1 reads + 2 batched (TWSE, TPEx) cold-manifest reads. A manifest-present symbol still invokes the canonical R2 pack loader and its D1 lookup, so additional SELECTs can be required for physical pack SHA checks. This count concerns *the explicit Hot D1/manifest/control-plane prefetch statements*, **not** actual Cloudflare `rows_read` metering, which remains physical-only proof.

Rows returned outside the exact six-symbol/eight-date market sample, duplicate monthly manifests, unknown receipt states and mismatched cold bytes remain fail-closed. Preserve the old 26-SELECT implementation as a testable compatibility branch and compare exact per-sample cause maps against the new batch plan.

No D1 writes, R2 PUT, migration, account-budget gate ownership seizure, paid upgrade, PIT backfill or corporate-action continuity promotion is authorized. Before any fresh physical retry, check actual Cloudflare D1 READ budget with REMEDIATION_LANE after reset; only a physical Run can establish D1 rows-read saving.
