# Technical Indicator Shared Parent / Generic Evidence Child Feasibility V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / DESIGN_FROZEN / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Freeze the smallest shared evidence architecture that can serve Technical Indicator, Pattern, Target/RR and other research observers without creating another candidate universe.

This is design-only.
No D1 migration, Worker wiring, schedule or production persistence is authorized.

## TI-391 — Parent scope must not be Selected-only

A Technical Indicator observer attached only to SELECTED or FULLY_QUALIFIED rows would condition the sample on existing Formal decisions before the indicator is studied.

That is unsuitable for the future question:
"Does this technical representation add incremental information beyond current Formal controls?"

Therefore Selected-only parentage is rejected for promotion-grade Technical Indicator inference.

## TI-392 — Two-level denominator model

### Level A — scan population receipt

Date-level immutable receipt preserving:
- FORMAL_NORMALIZED_TODAY_ROWS count;
- history-admission passed/blocked/unknown counts;
- market split;
- price-pool split;
- source-quality summary;
- scan/capture generation;
- worker/rule/source versions.

Purpose:
prove what entered the daily scan and what was blocked before per-symbol decision-state evaluation.

This level does not need one evidence child per market row.

### Level B — per-symbol decision-state parent

Canonical parent population for Technical Indicator:
all history-admitted featureRows actually evaluated by the same-scan Formal decision path.

This includes:
- early base failures;
- downstream failures;
- fully qualified rows;
- selected rows.

It is wider than Selected/Qualified samples and narrower/more semantically precise than blindly cloning every raw exchange listing.

Rows rejected by history admission remain represented in the Level-A denominator and are not fabricated into technical states.

## TI-393 — Why the Technical observer should attempt every Level-B parent

For each Level-B parent:
- attempt one Technical Indicator observation;
- outcome is VALID_OBSERVABLE, VALID_CONSTRAINED, BLOCKED_SOURCE, BLOCKED_CONTINUITY, BLOCKED_FORMULA_STATE or UNKNOWN_PROVENANCE.

No parent silently disappears.

This prevents the observer from selecting only easy symbols with clean data.

The run receipt remains the proof of 100% attempt accounting.

## TI-394 — Generic evidence child preferred over dedicated Technical tables

Preferred shared table concept:

trade_research_evidence_children

Identity:
- parent_decision_receipt_id;
- capture_generation;
- evidence_family;
- evidence_version;
- as_of.

Minimum columns:
- parent_decision_receipt_id TEXT NOT NULL;
- capture_generation TEXT NOT NULL;
- evidence_family TEXT NOT NULL;
- evidence_version TEXT NOT NULL;
- as_of TEXT NOT NULL;
- status TEXT NOT NULL;
- semantic_fingerprint TEXT NOT NULL;
- payload_hash TEXT;
- source_receipt_refs_json TEXT;
- payload_json TEXT;
- created_at TEXT NOT NULL.

Suggested immutable unique key:
(parent_decision_receipt_id, capture_generation, evidence_family, evidence_version, as_of)

Same identity + same fingerprint:
idempotent.

Same identity + different fingerprint:
PROVENANCE_CONFLICT.
Never UPDATE the old evidence into the new story.

## TI-395 — Generic observer run receipt

Preferred shared run table concept:

trade_research_observer_runs

Identity:
- scan_date;
- capture_generation;
- evidence_family;
- observer_version.

Minimum fields:
- parent_keyset_hash;
- expected_parent_count;
- attempted_parent_count;
- valid_count;
- constrained_count;
- blocked_count;
- unknown_count;
- missing_count;
- provenance_conflict_count;
- qa_failure_count;
- started_at;
- finished_at;
- run_status;
- summary_json;
- semantic_fingerprint.

This allows Pattern, Technical Indicator and future research observers to share completeness accounting without sharing their payload semantics.

## TI-396 — Family-specific payloads remain separate

Generic child table does NOT mean one giant common payload schema.

Examples:

TECHNICAL_INDICATOR payload:
- KD/RSI/MACD/ADX/Bollinger fields;
- formula/state lineage;
- continuityReceiptId;
- price-limit provenance reference.

PATTERN payload:
- geometry/lifecycle/zone states;
- detector lineage;
- continuity references.

TARGET_RR payload:
- target geometry;
- RR inputs;
- source-attribution ambiguity.

The common table owns identity/provenance/status.
Each evidence family owns its payload contract.

## TI-397 — Do not duplicate large shared source payloads

Evidence child should store hashes/references to:
- parent decision receipt;
- raw-history admission receipt;
- continuity receipt;
- symbol-session receipt;
- price-limit receipt.

Do NOT copy the full:
- daily OHLC history;
- corporate-action registry;
- session calendar;
- Formal ranking tuple;
- membership list
into every evidence-child row.

This reduces storage and avoids cross-table semantic drift.

## TI-398 — D1 sizing scenarios

Cloudflare D1 current documented limits:
- Paid maximum database size: 10 GB;
- Free maximum database size: 500 MB;
- rows per table are not separately capped beyond storage;
- maximum row/string/BLOB size: 2 MB;
- Paid included writes: 50 million rows/month;
- Free writes: 100,000 rows/day.

The architecture must not assume which plan is active.

Illustrative payload-only storage before indexes/SQLite overhead,
assuming 250 scan days/year:

500 parents/day:
- 0.75 KB child => ~91.6 MB/year;
- 1.5 KB child => ~183.1 MB/year;
- 3.0 KB child => ~366.2 MB/year.

1,000 parents/day:
- 0.75 KB => ~183.1 MB/year;
- 1.5 KB => ~366.2 MB/year;
- 3.0 KB => ~732.4 MB/year.

2,000 parents/day:
- 0.75 KB => ~366.2 MB/year;
- 1.5 KB => ~732.4 MB/year;
- 3.0 KB => ~1.465 GB/year.

At 2,000/day and 3 KB/row, five years of payload alone is ~7.15 GB before indexes/overhead.
Therefore compact child rows and shared references materially matter.

No final row-size target is promoted before measurement.

## TI-399 — D1 write count is not the main immediate constraint

Even a 2,000-parent daily observer implies roughly:
- 2,000 evidence-child attempts;
- one run receipt;
per scan date.

That is below the published Free daily 100,000-row write allowance in isolation and far below Paid included monthly writes.

But total account/database workload is not known.
Therefore quota margin must be measured against existing production usage before implementation.

More important practical risks:
- payload width/storage growth;
- read amplification;
- index quality;
- write transaction shape;
- Worker CPU/memory;
- continuity/history loading.

## TI-400 — Batch writes are the correct future performance primitive

Cloudflare D1 documents batch() as:
- multiple prepared statements in one database call;
- executed sequentially;
- transactional, with rollback/abort behavior on failure;
- lower network round-trip latency than one call per row.

Future implementation should therefore benchmark:
- bounded batch sizes;
- one immutable batch per chunk;
- final run receipt only after all expected child chunks succeed.

Do not reuse the legacy:
DELETE date -> row-by-row INSERT/UPSERT
pattern.

No batch size is frozen before measurement.

## TI-401 — Parent scope must be measured, not guessed

The repository currently exposes:
- FORMAL_NORMALIZED_TODAY_ROWS;
- HISTORY_ADMITTED_FEATURE_ROWS;
- early-base admitted rows;
- RR-pass rows;
- fully-qualified rows.

The exact real daily Level-B parent count must be captured prospectively.

Do not size the system from:
- the old <=54 sampled Shadow archive;
- one historical date;
- remembered 1,800+ market counts.

Required future impact receipt:
- min/median/p95/max Level-B parents over a bounded prospective period;
- TWSE/TPEx split;
- General/Thousand split;
- source-blocked ratio;
- average/maximum serialized child bytes;
- D1 rows_written;
- D1 rows_read;
- observer CPU/wall time.

## TI-402 — Current architecture conclusion

Preferred hierarchy:

SCAN POPULATION RECEIPT
  -> immutable per-symbol DECISION-STATE PARENT
     -> generic EVIDENCE CHILD rows by evidence_family
        -> family-specific payload contract
     -> generic OBSERVER RUN receipt

Technical Indicator should not own:
- the parent universe;
- sampling-frame semantics;
- corporate-action adjustment;
- session calendar;
- outcome table.

Technical Indicator owns only:
- formula/state lineage;
- Technical-specific payload;
- Technical-specific QA;
- Technical-specific readiness/inference rules.

## TI-403 — Governance consequence

This contract is Class-A research design.

Implementing:
- immutable parent persistence;
- generic evidence-child D1 schema;
- generic observer-run schema;
- Worker integration
is Class B proposal-first.

No approval is requested yet because:
- shared parent implementation is not ready;
- continuity runtime remains blocked;
- price-limit/session runtime provenance remains incomplete;
- real parent-size/storage/runtime measurements do not exist.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze machine-readable shared parent/generic-child contract.
2. Reconcile Pattern and Target/RR proposed child identities against this generic schema.
3. Look for semantic fields that cannot fit safely into one generic child contract.
4. If no contradiction is found, mark SHARED_EVIDENCE_CHILD_SCHEMA = DESIGN_COMPATIBLE.
5. Continue parent-scope and runtime-cost measurement design; do not implement production storage.
