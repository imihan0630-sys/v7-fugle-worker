# D18-06 S1 Effective Market-Cap Receipt Interface 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / CONSUMER_INTERFACE_FROZEN / SHARED_DENOMINATOR_AUTHORITY_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Module: D18-06
Formal Core impact: NONE

## Purpose

Freeze the D18-06 consumer interface for a point-in-time effective market-cap receipt without creating a second share-denominator truth.

S0 already answers:
"What issued/common-share value did the already-fetched official profile report at the capture clock?"

S1 answers a stricter question:
"What market-cap value is admissible for size membership on market date T under a denominator type whose effective vintage is independently certified?"

S1 must consume a shared denominator-vintage receipt produced by the corporate-action/capital-supply authority.

Room11 does not infer the effective denominator from S0.

## 1. Denominator semantic firewall

Canonical D11 research already separates:
- registered-issued shares;
- listed/tradable shares;
- free-float shares;
- EPS weighted-average shares.

These are not aliases.

D18-06 V0.1 therefore does NOT hard-code a denominator type merely to make the builder executable.

Required:
`denominatorTypeAuthorityState`.

Allowed:
- `CANONICAL_TYPE_FROZEN`;
- `TYPE_SCOPE_PARTIAL`;
- `TYPE_UNKNOWN`.

Only CANONICAL_TYPE_FROZEN can produce S1 READY.

Until the shared owner freezes which denominator semantics correspond to the intended size object:
`S1_EFFECTIVE_DENOMINATOR_UNKNOWN`.

## 2. Direct official market-cap path vs reconstructed path

S1 supports two provenance-distinct paths.

### Path A — DIRECT_OFFICIAL_MARKET_CAP

May be admitted only when an official exchange/source directly reports market cap with:
- exact market date;
- explicit unit;
- source row/hash;
- source/version identity;
- capturedAt / availableAt semantics;
- compatible market-cap definition for the frozen denominator basis;
- no post-decision observation.

The direct field must not be treated as equivalent to reconstructed market cap merely because the numbers are similar.

### Path B — EFFECTIVE_SHARES_X_SAME_DAY_CLOSE

Formula:
`marketCap = effectiveSharesOutstanding × sameDayPitClose`.

Requires:
- shared denominator-vintage receipt;
- frozen denominator type;
- effectiveForMarketDate=true;
- exact same-day PIT close;
- unit normalization;
- same market/security identity;
- both inputs available by the decision cutoff.

Path identity is part of the receipt.

## 3. Required shared denominator-vintage receipt

D18 consumes, never manufactures, a receipt with at least:

- denominatorReceiptVersion;
- denominatorReceiptId;
- denominatorReceiptHash;
- market;
- symbol;
- securityIdentity;
- denominatorType;
- denominatorUnit;
- denominatorValue;
- effectiveFromSession;
- effectiveToExclusive or open-ended certified state;
- firstKnownAt / availableAt or conservative admissible bound;
- observedAt;
- sourceId;
- sourceRowHash / sourceEvidenceHash;
- denominatorFamilySetVersion;
- revisionState;
- coverageState;
- conflictState;
- cancelledOrSupersededState;
- effectiveForMarketDate.

If any required dimension is UNKNOWN:
S1 is not ready.

## 4. S0 is context, not denominator authority

S1 may bind an S0 receipt for consistency diagnostics.

Possible relationship states:
- `S0_MATCHES_EFFECTIVE_DENOMINATOR`;
- `S0_DIFFERS_FROM_EFFECTIVE_DENOMINATOR`;
- `S0_NOT_COMPARABLE_TO_DENOMINATOR_TYPE`;
- `S0_UNAVAILABLE`.

A match does not cause S1 readiness.
A mismatch does not automatically mean either source is wrong; it may reflect different denominator semantics or effective vintages.

The shared denominator receipt remains authoritative for Path B.

## 5. Required S1 row fields

Canonical object:
`D18_06_S1_EFFECTIVE_MARKET_CAP_RECEIPT_V0_1`.

Identity:
- receiptVersion;
- marketDate;
- decisionTimestamp;
- market;
- symbol;
- securityIdentity;
- membershipReceiptId/hash.

Market-cap definition:
- marketCapDefinitionVersion;
- marketCapSourcePath;
- denominatorType;
- denominatorTypeAuthorityState;
- currency;
- unitScale.

Path A fields:
- officialMarketCapValue;
- officialMarketCapSourceId;
- officialMarketCapSourceRowHash;
- officialMarketCapReportedDate;
- officialMarketCapCapturedAt.

Path B fields:
- effectiveSharesValue;
- denominatorReceiptId;
- denominatorReceiptHash;
- denominatorFamilySetVersion;
- denominatorEffectiveFromSession;
- denominatorEffectiveToExclusive;
- sameDayClose;
- closeSourceId;
- closeSourceRowHash;
- closeMarketDate.

Diagnostics:
- s0ReceiptHash;
- s0RelationshipState;
- revisionState;
- coverageState;
- conflictState;
- pointInTimeState;
- disposition;
- blockerCodes.

Derived:
- marketCapValue or null;
- marketCapHash.

## 6. S1 dispositions

Allowed:
- `S1_READY_DIRECT_OFFICIAL`;
- `S1_READY_EFFECTIVE_SHARES_X_CLOSE`;
- `S1_BLOCKED_DENOMINATOR_TYPE_UNKNOWN`;
- `S1_BLOCKED_DENOMINATOR_VINTAGE_UNKNOWN`;
- `S1_BLOCKED_DENOMINATOR_COVERAGE_INCOMPLETE`;
- `S1_BLOCKED_REVISION_OR_CONFLICT`;
- `S1_BLOCKED_LATE_DENOMINATOR_EVIDENCE`;
- `S1_BLOCKED_CLOSE_DATE_OR_SOURCE`;
- `S1_BLOCKED_SECURITY_IDENTITY`;
- `S1_BLOCKED_DIRECT_FIELD_DEFINITION_UNKNOWN`;
- `S1_BLOCKED_UNIT_SEMANTICS`;
- `S1_BLOCKED_OTHER`.

Only READY states may emit non-null marketCapValue.

## 7. Effective-date rule

For target market date T:

a denominator may be used only when the shared receipt proves:
`effectiveFromSession <= T < effectiveToExclusive`
or an equivalent certified open-ended validity interval.

Source-reported date is not a substitute.

Announcement date is not a substitute.

Registration/effective/listing clocks may differ.

No nearest-observation filling.

## 8. Revision / cancellation rule

Historical replay at T uses only the latest event/denominator version admissible by T.

If a later revision changes the effective denominator:
- preserve the older historical version for earlier replay;
- do not rewrite the earlier S1 receipt.

Cancellation before effective date:
- planned denominator change never becomes realized.

Late correction:
- does not backdate first-known availability.

Conflict unresolved at T:
`S1_BLOCKED_REVISION_OR_CONFLICT`.

## 9. Current-share backfill firewall

Forbidden:
- latest S0 value × historical close;
- latest denominator receipt × historical close outside its validity interval;
- nearest future denominator snapshot used backward;
- current direct market cap divided by current price to infer historical shares.

Violation:
`HISTORICAL_DENOMINATOR_BACKFILL_FORBIDDEN`.

## 10. Direct-vs-reconstructed consistency diagnostic

If both paths are valid on the same date under compatible definitions, report:
- directOfficialMarketCap;
- reconstructedMarketCap;
- absoluteDifference;
- relativeDifference;
- consistencyState.

Allowed consistencyState:
- CONSISTENT_WITHIN_FROZEN_TOLERANCE;
- MATERIAL_DIFFERENCE;
- NOT_COMPARABLE_DEFINITION;
- ONE_PATH_UNAVAILABLE.

Tolerance must be frozen from unit/rounding semantics, not strategy outcomes.

A discrepancy is a QA signal.
Do not outcome-select the path that gives the preferred size bucket.

## 11. Coverage ladder

Per date:
- M0 MARKET_BASE_UNIVERSE;
- M1 S0_REPORTED_SHARES_OBSERVED;
- M2 DENOMINATOR_TYPE_AUTHORITY_READY;
- M3 EFFECTIVE_DENOMINATOR_VINTAGE_READY;
- M4 S1_EFFECTIVE_MARKET_CAP_READY;
- M5 SIZE_BUCKET_ELIGIBLE.

Reason counts:
- type unknown;
- vintage unknown;
- coverage incomplete;
- revision/conflict;
- late evidence;
- close mismatch;
- security identity unknown;
- direct-definition unknown;
- unit unknown;
- other.

Missing S1 is never coerced to SMALL.

## 12. Size-bucket handoff boundary

S1 produces market-cap facts only.

It does not decide:
- LARGE / MID / SMALL breakpoints;
- pooled TWSE/TPEx vs exchange-specific buckets;
- rebalance schedule;
- ranking/weighting;
- strategy activation.

A separate pre-outcome bucket-policy receipt must freeze those choices.

## 13. Mandatory adversarial tests

### S1-T01 valid direct official field
Expected: READY_DIRECT only when definition/date/unit/PIT semantics are complete.

### S1-T02 direct official field definition unknown
Expected: BLOCKED_DIRECT_FIELD_DEFINITION_UNKNOWN.

### S1-T03 valid effective shares + exact same-day close
Expected: deterministic READY_EFFECTIVE_SHARES_X_CLOSE.

### S1-T04 S0 exists but denominator-vintage receipt absent
Expected: BLOCKED_DENOMINATOR_VINTAGE_UNKNOWN.

### S1-T05 denominatorType unknown
Expected: BLOCKED_DENOMINATOR_TYPE_UNKNOWN.

### S1-T06 sourceReportedDate equals T but effectiveFromSession > T
Expected: blocked.

### S1-T07 current denominator reused before effective interval
Expected: blocked historical backfill.

### S1-T08 later revision observed after T
Expected: earlier replay unchanged.

### S1-T09 cancellation before effective date
Expected: cancelled change never enters effective denominator.

### S1-T10 unresolved revision conflict
Expected: blocked.

### S1-T11 close marketDate != T
Expected: blocked.

### S1-T12 security identity mismatch
Expected: blocked.

### S1-T13 S0 numeric value matches S1 denominator
Expected: no readiness promotion from match alone.

### S1-T14 S0 differs from S1
Expected: preserve diagnostic; do not overwrite shared denominator authority.

### S1-T15 direct and reconstructed paths agree
Expected: retain both provenance paths; deterministic QA consistency state.

### S1-T16 direct and reconstructed paths disagree
Expected: QA conflict; no outcome-based path selection.

### S1-T17 denominator receipt hash changes
Expected: marketCapHash changes.

### S1-T18 same immutable inputs replay
Expected: deterministic receipt hash.

## 14. Current feasibility assessment

S0:
semantic contract frozen; executable observer pending.

S1 shared denominator authority:
not currently executable for full PIT dual-exchange use.

D11's current evidence explicitly retains:
- incomplete bounded daily denominator archive;
- unresolved denominator-type details for some supply events;
- no prospective immutable denominator collector across live dates.

Therefore:
`S1_EFFECTIVE_MARKET_CAP_READY = NOT_YET_PROVEN`.

This is a truthful infrastructure blocker, not a reason to substitute current shares.

## 15. Maturity implication

This contract closes the D18 consumer-interface design gap.

It does not promote D18-06.

D18-06 remains L2/40 until:
- shared denominator authority becomes executable;
- S1 builder exists;
- deterministic tests pass;
- at least one physical TWSE and one physical TPEx S1 receipt are produced;
- size-bucket policy is frozen before outcomes.

## Exact next

1. Do not build a second denominator archive in Room11.
2. Track D11/shared denominator authority progress.
3. Implement S0 observer independently when authorized.
4. Once shared denominator receipts become executable, build this S1 consumer.
5. Run S1-T01~T18.
6. Freeze size-bucket policy pre-outcome.
7. Only then assess D18-06 for L3.
