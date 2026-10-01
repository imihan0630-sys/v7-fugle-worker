# C1 complete-population receipt export — Class B review packet

Status: OWNER_APPROVED 2026-10-01 / IMPLEMENTED_ON_ISOLATED_BRANCH / LOCAL_VALIDATION_PASS / PRODUCTION_READBACK_PENDING.
Base: main 7ae8df72ea178e3fc5c19828424d515ad1df42f3; Production 8.14.4.
Prepared 2026-10-01 Asia/Taipei. Formal Core LOCKED.

## Concrete missing capability

The offline observer/challenger exists at commit
2914f5a0ca1742ee994cd2e4cde0da19d81d6ec6. Existing bounded Shadow rows omit
early rejects and many independently evaluated derived gates. Public
recommendations cannot supply full normalized universe, gate overlap or actual
fills. Increasing today's Near-miss limit would preserve selection bias.

## Proposed scope for owner review

Extend the already-proposed immutable population receipt/membership overlay,
not legacy single-cohort replacement. One append-only decision generation
per session, with parent linkage to the actual Formal scan. Capture the
complete normalized symbol universe before history admission, including price
pool and normalization exclusions where available. Export a protected,
paginated read-only bundle for offline use. Do not reuse mutable snapshot_json
as immutable evidence or backfill past clocks.

Required header: schemaVersion, scanGenerationId, sourceMainSha,
effectiveRuntimeVersion, sessionDate, decisionAt, capturedAt, universeScope,
universeDigest, totalRows, returnedRows, hasMore, nextCursor, completeness.
Required row: symbol, market, pricePool, historyAdmission and parent evidence,
original Formal ok/firstFailure/basePassed/rrPassed, original selection/rank,
feature, sector, independently derived setup/count/quality/target/RR fields,
gateEvidence[id] with authenticated source reference, sessionDate, parentId,
knownAt, value origin and UNKNOWN reason. Safety source/session/CA/execution/
account-risk receipts require explicit semantics; a mere caller boolean is
not independent verification. Broker fill/cash exports are outside this scope.

Record missing rows and unavailable downstream geometry explicitly. Do not
run candidate selection a second time to manufacture a Formal counterfactual.
If an independent derivation cannot be performed safely without extra live
calls or resource pressure, export UNKNOWN and its capture gap instead.

## Protected invariants and acceptance

- Formal A/B, ranking, thresholds, 3+3+3, capital, 15m, signals, push and
  System2 byte/content behavior remain identical on frozen inputs.
- No extra market fetches, business scan/recovery, re-selection, external
  POST or notification for acceptance. No new scheduled run.
- No shared mutation occurs before Formal completion. Research capture must
  have a bounded cost and fail-open behavior with observable failure receipt.
- Prove full symbol keyset and exactly-once immutable generation handling;
  replay same generation must not rewrite old first-known evidence.
- Test pagination, partial capture, history rejection, liquidity rejection,
  multi-failure, provenance conflicts, missing data and concurrent scans.
- Measure CPU/memory/storage/query costs against V8.14.4; budget values are
  UNKNOWN until measured. Error 1102 risk is a material reason for Class B.
- Existing stale Aideen version assertion must be resolved in its own owner
  scope before claiming fully green CI. Passing tests is not deploy authority.

## Decision and rollback

Owner review is required before implementing shared runtime/schema capture,
merging main or deployment. This packet authorizes none of those actions.
After approval, prepare a minimal additive branch with exact diff and measured
resource evidence. Disable the new capture/export if regression occurs;
preserve immutable research rows and restore the previous Worker through the
existing approved code-only path. Do not delete actual plans or bindings.

Safe alternative now: import an already-authorized immutable external receipt
bundle into the offline module. That needs no Production change and should
be preferred when such a complete bundle is available.

## Approved implementation receipt — 2026-10-01

The owner authorized continuation under the original governance. V8.15.0 is
implemented as an additive Class-B candidate. It captures the normalized
ordinary price>=10 universe already loaded by the successful Formal scan,
before history admission removes rows. It does not make a second market call,
rerun selection, change a score, allocate capital, emit a signal or send a
notification. Missing history/features and three unsupported safety receipts
remain UNKNOWN.

The immutable D1 generation header and 50-row/250k-character chunks are saved
after the Formal plan/delivery path and fail open. The protected GET endpoint
is paginated and read-only. SHA-256 content and universe digests, exact chunk
coverage and same-generation pagination are verified again by the isolated
adapter. A weekday 00:10 Taipei workflow collects the latest completed receipt
as a 90-day artifact without changing Production.

Local clean-chain evidence: 62 guarded patches applied; 52/52 regression
commands passed; the isolated observer has 71 adversarial assertions; the D1
test proves insert/read/idempotent replay/conflict rejection using SQLite. A
2,000-row synthetic receipt was 3,478,161 bytes in memory, 40 chunks, largest
chunk 86,955 bytes, and built in 18.3 ms on the local runtime. These are local
engineering measurements, not Cloudflare billing or live CPU proof. First
Production generation and prospective economic evidence remain pending.
