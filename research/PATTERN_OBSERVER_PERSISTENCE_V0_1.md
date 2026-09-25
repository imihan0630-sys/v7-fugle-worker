# Pattern Observer Persistence & Episode Contract v0.1

Updated: 2026-09-26 Asia/Taipei  
Status: RESEARCH_ONLY / DESIGN_FROZEN / NOT_WIRED  
Formal Core: LOCKED

## Purpose

Define the smallest prospective persistence and episode contract for Pattern research without creating a second candidate universe, a second corporate-action adjustment engine, or any Formal dependency.

This design attaches Pattern observations only to the existing `trade_research_shadow_candidates` parent population.

## 1. Parent identity

Required parent identity:
- `scan_date`
- `symbol`
- exact `parent_snapshot_hash`

The natural key `(scan_date,symbol)` is insufficient by itself because same-day reruns can replace the parent row. Pattern must preserve the exact captured parent snapshot hash.

Rules:
- same `(scan_date,symbol)` + same parent hash = same parent;
- same `(scan_date,symbol)` + different parent hash = `PROVENANCE_CONFLICT`;
- `cohort_rank` is descriptive, never identity;
- Pattern may never silently reattach to a changed parent.

## 2. Proposed isolated snapshot table

Design only; no runtime migration is authorized.

`pattern_observer_snapshots`

Required fields:
- `scan_date TEXT NOT NULL`
- `symbol TEXT NOT NULL`
- `parent_snapshot_hash TEXT NOT NULL`
- `as_of_date TEXT NOT NULL`
- `detector_version TEXT NOT NULL`
- `semantic_contract_version TEXT NOT NULL`
- `geometry_payload_hash TEXT`
- `raw_execution_payload_hash TEXT`
- `detector_snapshot_hash TEXT`
- `status TEXT NOT NULL` — VALID | BLOCKED
- `blocked_reason TEXT`
- `snapshot_json TEXT`
- `created_at TEXT NOT NULL`

Proposed immutable identity:
`(scan_date,symbol,parent_snapshot_hash,as_of_date,detector_version)`

Idempotency:
- exact same identity + exact same hashes => no-op / SAME_RECORD_EXACT;
- same identity + changed geometry/raw/detector hash => PROVENANCE_CONFLICT;
- never UPDATE a historical snapshot in place to make it match a later source vintage.

## 3. Proposed run receipt

`pattern_observer_runs`

Fields:
- `run_id`
- `scan_date`
- `detector_version`
- `expected_parent_count`
- `attempted_parent_count`
- `valid_count`
- `blocked_count`
- `missing_count`
- `provenance_conflict_count`
- `prefix_exact_checked`
- `prefix_exact_failures`
- `replay_exact_checked`
- `replay_exact_failures`
- `blocked_reason_json`
- `started_at`
- `finished_at`
- `status` — COMPLETE | INCOMPLETE | QA_FAIL

### Outcome-free acceptance gates

A scan date is `COMPLETE` only if:
1. expected parent population is read from the existing Shadow archive;
2. attempted_parent_count == expected_parent_count;
3. every parent resolves to VALID or BLOCKED with an explicit reason;
4. missing_count == 0;
5. provenance_conflict_count == 0;
6. every executed replay/prefix exactness check passes.

Therefore attempt coverage is exactly 100% by definition. Data availability need not be 100%: a parent can be BLOCKED, but it cannot silently disappear.

A replay/prefix mismatch is a correctness failure, not ordinary missing data. It sets `QA_FAIL` and blocks outcome joining for that detector version/date.

Scale disagreement and compute time are observability fields, not pass/fail alpha thresholds in v0.1. No arbitrary compute or agreement cutoff is selected before prospective measurement.

## 4. Semantic spaces

Pattern geometry consumes only:
- `TECHNICAL_CONTINUITY`

Execution/reference prices consume only:
- `RAW_EXECUTION`

Future economic outcome research may separately use:
- `TOTAL_RETURN_COMPARABLE`

The Pattern observer must not:
- call a provider-adjusted series and relabel it RAW;
- create another corporate-action adjustment formula;
- use `FCNT000154 adjusted=false` as trusted RAW while that connector is known to return adjusted=true metadata;
- treat missing provenance as factor=1 / no-event / zero.

Missing or mismatched semantics => BLOCKED / UNKNOWN.

## 5. Episode de-duplication

Pattern episodes are structural objects, not notification episodes and not trading signals.

### Episode identity v0.1

A deterministic episode key is derived from:
- symbol;
- detector version;
- semantic-space version;
- pattern family;
- scale;
- ordered confirmed anchor swing IDs / pivot dates;
- initial confirmation time of the structure.

A named-label change that uses the same structural anchors does NOT create a new episode.

Examples:
- W_STRUCTURE_VALID -> W_NECKLINE_APPROACH -> W_BREAKOUT_CONFIRMED uses one W episode;
- PLATFORM_VALID -> PLATFORM_TIGHT -> PLATFORM_BREAKOUT_CONFIRMED uses one Platform episode;
- VCP topology -> context-valid -> mature uses one contraction episode if the constituent contraction anchors remain the same.

A new episode requires structural invalidation/release followed by a newly confirmed anchor set. A later bar alone cannot retroactively change the episode's start.

## 6. Major-zone lifecycle: avoid binary acceptance tuning

Do not hard-code a new return-optimized 'accepted' threshold.

Store causal, as-of fields:
- `zoneRelation`
- `firstBreakAt`
- `aboveZoneCloseStreak`
- `reenteredZoneAt`
- `failedBelowZoneAt`
- `availableAirPct`
- `touchCount`
- `repeatedTouchProgression`

Descriptive lifecycle can be:
- APPROACH_MAJOR_ZONE
- FIRST_BREAK_ABOVE_MAJOR_ZONE
- HOLDING_ABOVE_MAJOR_ZONE
- REENTERED_MAJOR_ZONE
- FAILED_MAJOR_ZONE_BREAK

`aboveZoneCloseStreak` remains numeric. Any future decision to map 2, 3 or N closes into 'accepted' is a separate experiment definition. Existing R01 3-day hold may be used later as an outcome comparator, not silently embedded into Pattern geometry.

## 7. Coverage and outcome-join firewall

Expected universe = the existing prospective Shadow parent rows for that scan date.

For each expected parent, Pattern must produce exactly one attempt result:
- VALID, or
- BLOCKED with reason.

A date with a missing parent attempt is INCOMPLETE and cannot enter Pattern outcome inference.

Outcome join requires exact:
- scan_date;
- symbol;
- parent_snapshot_hash;
- detector_version;
- as_of_date <= decision/scan cutoff;
- COMPLETE run receipt;
- no replay/prefix failure.

Blocked observations are retained in missingness diagnostics and cannot be dropped without reporting cohort/pool/date blocked rates.

No historical Formal cohort may be fabricated to increase N.

## 8. Analysis readiness

Detector/data QA is separate from alpha maturity.

Before descriptive outcomes:
- prospective run receipts COMPLETE;
- replay/prefix exactness PASS;
- parent coverage exact;
- blocked reasons quantified;
- no systematic silent exclusion by cohort/pool.

Before any Formal proposal, reuse existing global gates in `RESEARCH_WORKLIST.md`: mature sample size, independent scan dates, multiple years/regimes, purged holdout, costs, redundancy, date-cluster robustness, coverage/zero-pick effects and explicit owner review.

Pattern does not create R09 merely because persistence exists.

## 9. Falsification / kill rules

Stop Pattern inference for a version if:
- parent snapshot drift is silently overwritten;
- same as-of replay is not exact;
- prefix states change when future bars are appended;
- corporate-action provenance is missing/coerced;
- blocked parents disappear from coverage denominator;
- episode IDs change without anchor changes;
- outcome labels feed back into detector thresholds;
- the analysis requires post-hoc zone widths/scales to recover an effect.

## 10. Engineering classification

This document and pure helper/test code are Class A research-only.

Any D1 schema migration, Worker route, schedule, fetch path or production persistence wiring touches shared runtime/storage and must be reclassified under governance before merge/deploy.

No production integration is authorized by this document.
