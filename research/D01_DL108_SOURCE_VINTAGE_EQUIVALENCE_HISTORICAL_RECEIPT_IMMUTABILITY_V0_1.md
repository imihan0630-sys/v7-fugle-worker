# D01 DL-108 — Source-Vintage Equivalence and Historical Receipt Immutability V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SOURCE_VINTAGE_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Define when a newer source capture, parser version, archive revision, or official historical snapshot may be treated as semantically equivalent to an older D01 source input without rewriting historical R7 evidence.

Historical truth and point-in-time knowledge are separate dimensions.

A newer source may be more complete today while still being illegal for an older predictor snapshot if the information was not knowable by that predictor cutoff.

## Four identities must remain separate

1. SOURCE_CAPTURE_IDENTITY
- sourceId;
- sourceUrl/endpoint contract;
- requested interval/query;
- payload hash;
- fetchedAt;
- parser version;
- raw row hashes.

2. SOURCE_SEMANTIC_IDENTITY
- normalized market/symbol/date;
- OHLC or event semantic fields;
- effective date;
- continuity effect;
- outcome state;
- source semantic hash.

3. KNOWLEDGE_TIME_IDENTITY
- firstKnownAt;
- availableAt;
- knowledge-time mode;
- observedAt;
- provenance for the clock.

4. D01_REPLAY_IDENTITY
- exactSessionHash;
- sourceHistoryHash;
- corporateActionRegistryVersion;
- continuityTransformHash;
- detector version;
- canonical R7 payload hash.

Equal semantic content does not make two source captures the same capture.
Equal capture date does not prove the same PIT knowledge state.

## Revision classes

### A. BYTE_REFRESH_SEMANTICALLY_EQUIVALENT
Allowed when:
- raw payload bytes differ because of transport/order/format;
- normalized rows/events are identical;
- semantic hashes are identical;
- firstKnownAt/availableAt semantics are unchanged;
- exact D01 source window is unchanged.

Interpretation:
new capture may be an equivalent re-observation.
Old receipt remains immutable.

### B. PARSER_EQUIVALENT_REPARSE
Allowed when:
- parser version changes;
- canonical normalized semantic rows are identical;
- row/event semantic hashes are identical;
- no clock field changes;
- no previously missing row/event appears.

Interpretation:
implementation-equivalent parse.
Old receipt is not rewritten.

### C. DUPLICATE_OBSERVATION_SAME_SEMANTIC_VERSION
Allowed when:
- official event semanticHash is identical;
- later capture observes the same event again;
- no new supersession/cancellation/effective-date/continuity-effect information appears.

Interpretation:
duplicate observation, not a new event state.

### D. METADATA_ONLY_NON_CAUSAL_CHANGE
Allowed for explainability-only fields that do not affect:
- symbol/date identity;
- prices;
- event effective date;
- continuity effect;
- source-session membership;
- legal market state;
- firstKnownAt/availableAt;
- feature geometry.

These fields may be versioned outside the predictor payload.

### E. SEMANTIC_REVISION
Triggered by any change in:
- OHLC value;
- event outcome state;
- effective date;
- continuity effect;
- corporate-action factor;
- legal reference/limit state;
- session membership/lifecycle state;
- disposition/matching state.

Not equivalent.

### F. KNOWLEDGE_CLOCK_REVISION
Triggered when firstKnownAt/availableAt/knowledge-time authority changes.

Not equivalent for PIT replay even if event semantic content is identical.

### G. COVERAGE_EXPANSION
Triggered when a newer archive adds a source row/event/date that was absent before.

Not equivalent by default.
Must be classified under DL-109 as:
- preexisting-public-information backfill;
- late disclosure/correction;
- or unknown.

## Exact equivalence rule

SOURCE_VINTAGE_EQUIVALENT requires all:
- same requested source interval/query identity;
- same exact normalized row/event semantic set;
- same semantic hashes;
- same firstKnownAt/availableAt semantics;
- same exactSessionHash;
- same sourceHistoryHash contribution;
- same denominator/blocking state;
- same canonical R7 payload.

If sourceHistoryHash changes, exact equivalence is false even when labels look the same.

A separate semantic-equivalence class may still exist, but historical receipt identity must remain distinct.

## Historical receipt rule

An R7 receipt is immutable.

A later source revision may:
- append a source-vintage migration record;
- produce a new replay receipt;
- mark an older receipt as superseded-for-research-use;
- mark the older receipt as PIT-valid-but-now-known-incomplete;
- mark the newer receipt diagnostic-only for the old cutoff.

A later revision may not:
- replace old sourceHistoryHash;
- replace old sourceRowHash;
- replace old corporateActionRegistryVersion;
- rewrite old firstObservableAt;
- mutate old deterministicFeatureHash.

## PIT-valid versus best-known-current truth

Two outputs may coexist:

PIT_VIEW
What was knowable by the historical predictor cutoff.

BEST_KNOWN_CURRENT_VIEW
What the archive currently believes after later corrections/revisions.

D01 predictive research must use PIT_VIEW.

BEST_KNOWN_CURRENT_VIEW may be used for:
- data-quality audit;
- reconciliation;
- sensitivity analysis;
- archive repair diagnostics.

It may not silently replace PIT_VIEW in OOS results.

## Source-vintage migration statuses

EXACT_CAPTURE_REPLAY_EQUIVALENT
SEMANTICALLY_EQUIVALENT_NEW_CAPTURE
PIT_EQUIVALENT_REPARSE
SEMANTIC_REVISION_REQUIRES_NEW_REPLAY
KNOWLEDGE_CLOCK_REVISION_REQUIRES_NEW_REPLAY
COVERAGE_EXPANSION_REQUIRES_CAUSAL_CLASSIFICATION
PROVENANCE_DRIFT
UNKNOWN_BLOCKED

## Current decision

SOURCE_CAPTURE_EQUALITY = NOT_REQUIRED_FOR_SEMANTIC_EQUIVALENCE.
SOURCE_HISTORY_IDENTITY = REQUIRED_FOR_EXACT_REPLAY_EQUIVALENCE.
NEWER_ARCHIVE_TRUTH_MAY_REWRITE_OLD_R7 = FALSE.
PIT_VIEW_AND_CURRENT_BEST_KNOWN_VIEW_MUST_BE_SEPARATE = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
