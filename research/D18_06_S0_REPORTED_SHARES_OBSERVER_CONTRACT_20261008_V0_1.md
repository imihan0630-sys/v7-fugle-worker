# D18-06 S0 Reported-Shares Observer Contract 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / ZERO-EXTRA-MARKET-CALL_OBSERVER_CONTRACT_FROZEN / EXECUTABLE_OBSERVER_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Module: D18-06
Formal Core impact: NONE

## Purpose

Freeze the smallest prospective observer that preserves the official reported-share-count provenance already present inside the existing company-profile fetch path before normalization discards it.

This observer does NOT:
- change the Formal market-cap value;
- choose a new data provider;
- add a market-data request;
- prove the share count is economically effective for the target session;
- reconstruct historical market cap;
- create a size bucket.

Its only job is to preserve what the existing request actually observed.

## 1. Repository facts

Current `Worker.js` already fetches:
- TWSE company profile from `t187ap03_L`;
- TPEx company profile from `mopsfin_t187ap03_O`.

Inside `fetchOfficialEnrichment()`:
- TWSE issued/common-share fields are parsed from the original profile row;
- TPEx `IssueShares` is parsed from the original profile row;
- the parsed value is normalized to `sharesOutstanding`.

But provenance is lost downstream:
- per-symbol normalized stock keeps `sharesOutstanding`, not the original full profile row identity;
- `sourceMeta` keeps status/count/fallback/error, but drops the CSV fallback `exportDate`;
- the custom enrichment merge can overwrite `sharesOutstanding`;
- custom enrichment can also provide explicit `marketCapYi` / equivalent fields;
- after merge, a numeric market cap alone does not reveal which source branch produced it.

Therefore source observation and final merged-value branch must be recorded separately.

## 2. S0 is an official source observation, not a final Formal-source claim

Canonical S0 object:
`REPORTED_SHARES_SNAPSHOT_CONTEXT`.

It answers:
"At this capture/decision clock, what issued/common-share value did the already-fetched official company-profile row report?"

It does NOT answer:
- whether Formal ultimately used that official share count;
- whether the reported share count was economically effective on the target session;
- whether the number equals free float;
- whether it is a historical denominator.

Required semantic field:
`formalMarketCapSourceClaimed=false`.

## 3. Required source-row identity

For every S0 symbol row preserve:

- receiptVersion;
- scanDate;
- decisionTimestamp;
- capturedAt;
- market;
- symbol;
- sourceId;
- sourceUrl;
- sourceTransportPath;
- sourceFallbackState;
- sourceReportedDate;
- sourceDateState;
- shareFieldName;
- reportedShares;
- shareUnit;
- fullParsedSourceRowHash;
- sourceRowsCanonicalHash;
- parserVersion;
- pointInTimeObservationState;
- effectiveDenominatorState;
- effectiveDenominatorCertified;
- researchOnly;
- decisionImpact.

The hash is over the complete parsed source row using deterministic key ordering.

A byte-for-byte HTTP body hash is optional, not required for V0.1, because the current fetch helper returns parsed payload rather than preserving the raw response body.

Do not falsely label a canonical parsed-row hash as a raw-body hash.

## 4. Source-date states

Separate:

### SOURCE_DATED
The profile row or validated fallback carries a parsable source-reported/export date.

### CAPTURED_SOURCE_DATE_UNKNOWN
The official row was genuinely captured at `capturedAt`, but no trustworthy row/export date is preserved.

This can support:
"the system observed this value no later than capturedAt".

It cannot support:
"this value was the correct effective denominator on scanDate".

### SOURCE_DATE_INVALID
Source date is future, malformed or internally conflicting.

Fail closed for S0 readiness.

## 5. Point-in-time observation states

Allowed:

- `S0_READY_SOURCE_DATED`
- `S0_READY_CAPTURE_ONLY_DATE_UNKNOWN`
- `S0_UNKNOWN_SOURCE_OR_VALUE_INVALID`

S0 readiness requires:
- official source identity known;
- symbol/market valid;
- reportedShares finite and >0;
- full parsed row identity frozen;
- capturedAt <= decisionTimestamp;
- source date not invalid.

No S0 state sets:
`sharesEffectiveForMarketDate=true`.

That remains S1 authority only.

## 6. Denominator semantics

The source field must be named honestly.

Preferred V0.1 semantic label:
`OFFICIAL_PROFILE_REPORTED_ISSUED_COMMON_SHARES`.

Do not silently relabel it:
- OUTSTANDING_SHARES;
- EXCHANGE_LISTED_SHARES;
- FREE_FLOAT_SHARES;
- EPS_WEIGHTED_AVERAGE_SHARES.

The shared denominator-vintage owner must map the profile field to one canonical denominator type before S1.

## 7. Final merged-source branch observation

S0 official observation and the actual merged market-cap source are separate.

At the existing pre-merge custom overlay seam, preserve a non-decision branch diagnostic:

- `OFFICIAL_PROFILE_SHARES_ONLY`
- `CUSTOM_SHARES_OVERRIDE_PRESENT`
- `CUSTOM_EXPLICIT_MARKET_CAP_PRESENT`
- `CUSTOM_SHARES_AND_EXPLICIT_MARKET_CAP_PRESENT`
- `NO_MARKET_CAP_INPUT`
- `SOURCE_BRANCH_UNKNOWN`

This diagnostic may be derived without a new market request because the official and custom objects already coexist in memory before spreading.

The branch diagnostic must not modify precedence.

If custom data wins under existing code:
- keep the official S0 observation as independent source context;
- do not claim the final Formal market cap came from the official row;
- custom source provenance remains UNKNOWN unless separately preserved.

## 8. Optional same-day notional context

If an exact same-day close receipt already exists, research may derive:

`reportedSharesNotionalMarketCap = reportedShares × sameDayClose`.

Required label:
`CONTEXT_RAW_REPORTED_SHARES_X_SAME_DAY_CLOSE`.

This is NOT S1 canonical market cap.

It must bind:
- closeMarketDate;
- closeSourceId/hash;
- close value;
- official S0 receipt hash.

If close date mismatches scanDate:
do not compute.

## 9. No historical reuse

A S0 receipt is valid only for its observed source snapshot/capture context.

Forbidden:
- carry the latest S0 share count backward;
- use current S0 with historical closes;
- fill missing past denominator versions by nearest observation;
- infer effectiveFromDate from sourceReportedDate.

A historical date requires its own denominator-vintage evidence.

## 10. Coverage receipt

Every capture should aggregate:

- marketBaseN;
- profileRowObservedN;
- reportedSharesValidN;
- sourceDatedN;
- captureOnlyDateUnknownN;
- sourceDateInvalidN;
- customSharesOverridePresentN;
- customExplicitMarketCapPresentN;
- sourceBranchUnknownN;
- S0ReadyN;
- S0UnknownN.

Report TWSE and TPEx separately.

Do not introduce a readiness percentage threshold based on later strategy returns.

## 11. Mandatory adversarial tests

### S0-T01 official row + valid shares + source date
Expected:
S0_READY_SOURCE_DATED.

### S0-T02 official row + valid shares + no source date
Expected:
S0_READY_CAPTURE_ONLY_DATE_UNKNOWN.

### S0-T03 captured after decision clock
Expected:
S0_UNKNOWN_SOURCE_OR_VALUE_INVALID.

### S0-T04 future/malformed source date
Expected:
S0_UNKNOWN_SOURCE_OR_VALUE_INVALID.

### S0-T05 reported shares missing/zero/non-numeric
Expected:
S0_UNKNOWN_SOURCE_OR_VALUE_INVALID.

### S0-T06 same reported shares but different full row
Expected:
different fullParsedSourceRowHash / receipt identity.

### S0-T07 custom shares override present
Expected:
official S0 remains observable; final branch diagnostic = CUSTOM_SHARES_OVERRIDE_PRESENT; no official Formal-source claim.

### S0-T08 custom explicit market cap present
Expected:
official S0 remains observable; final branch diagnostic identifies custom explicit cap; no official Formal-source claim.

### S0-T09 official CSV fallback with validated exportDate
Expected:
preserve exportDate as sourceReportedDate instead of dropping it.

### S0-T10 TPEx Date field present
Expected:
preserve normalized Date as sourceReportedDate.

### S0-T11 current S0 paired with prior historical close
Expected:
reject historical denominator reuse.

### S0-T12 issued/common shares relabeled as free float
Expected:
semantic rejection.

### S0-T13 identical S0 inputs replayed
Expected:
same deterministic receipt hash.

## 12. Engineering handoff boundary

The minimal implementation should be observational only.

Preferred seam:
inside or immediately after `fetchOfficialEnrichment()`, before per-row profile provenance is discarded and before custom spread overwrites relevant fields.

No extra network request is necessary.

A research-only evidence object may be appended/persisted only through an already-authorized research evidence path.

Room11 does not authorize:
- Formal score/gate/rank changes;
- custom-vs-official precedence changes;
- Worker deployment;
- a new D1 table;
- new provider calls.

## 13. D18-06 maturity implication

This contract closes the S0 semantic design gap.

It does NOT create:
- an executable observer;
- a physical Taiwan receipt;
- S1 effective-share denominator proof;
- a size bucket;
- OOS evidence.

Therefore D18-06 remains L2/40.

## Exact next

1. BUILD/System1 research-engineering owner implements the zero-extra-call S0 observer if authorized.
2. Physical capture proves TWSE and TPEx S0 receipts on a genuine trading date.
3. Shared denominator-vintage authority maps the profile field to the correct denominator semantics/effective session for S1.
4. Only then build deterministic S1 market-cap receipts and freeze size buckets before outcomes.
