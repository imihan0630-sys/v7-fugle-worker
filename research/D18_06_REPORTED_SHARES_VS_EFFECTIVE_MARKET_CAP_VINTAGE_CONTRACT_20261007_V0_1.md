# D18-06 Reported Shares vs Effective Market-Cap Vintage Contract 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / TWO_LAYER_SIZE_VINTAGE_CONTRACT_FROZEN / EFFECTIVE_DENOMINATOR_REPLAY_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Separate two questions that current market-cap paths can accidentally collapse:

1. what issued-share count was publicly reported in the source snapshot available to the decision process;
2. what share denominator was economically effective for the target market date and therefore admissible for canonical market-cap membership.

A source row date is not automatically the economic effective date of the denominator.

## 1. Existing source feasibility

Repository evidence already proves a prospective zero-extra-market-call observation path is plausible:

- TWSE company-basic profile source exposes issued common-share fields;
- TPEx `mopsfin_t187ap03_O` exposes `Date` + `IssueShares`;
- the existing official enrichment path already parses sharesOutstanding;
- current downstream market-cap fallback can compute sharesOutstanding × same-day close;
- current normalization drops important source-date / source-path provenance;
- custom enrichment can override sharesOutstanding or explicit market-cap fields.

Therefore the next research step is provenance preservation, not source invention.

This does NOT prove historical denominator vintage.

## 2. Two-layer contract

### S0 — REPORTED_SHARES_SNAPSHOT_CONTEXT

A descriptive/PIT observability object.

Required:
- symbol;
- market;
- official sourceId/sourceUrl;
- exact raw source row hash;
- source-reported row date/export date when present;
- capturedAt / observedAt;
- sharesOutstanding as reported by that source row;
- source schema/parser version;
- decisionTimestamp;
- pointInTimeEligible flag;
- source status.

Allowed derived context:
`REPORTED_SHARES_X_SAME_DAY_CLOSE_CONTEXT`.

This is CONTEXT_RAW only.

It may answer:
"What notional capitalization would current close × the officially reported share count visible at this decision clock imply?"

It may NOT define canonical large/small membership.

### S1 — EFFECTIVE_MARKET_CAP_MEMBERSHIP

The canonical D18-06 size object.

Requires S0 plus:
- exact same-day PIT close identity;
- `sharesEffectiveForMarketDate=true`;
- denominatorVintageReceiptId/hash;
- effectiveDate or equivalent bounded validity interval;
- no unresolved capital-supply/share-count event affecting the target date;
- no unresolved corporate-action denominator ambiguity;
- market/listing identity valid at target date;
- source and denominator evidence available under the decision clock;
- explicit price-space/version;
- immutable marketCapHash.

Only S1 may enter the canonical size bucket used for D18-06 leadership.

## 3. Source date != effective date

The following are distinct:

- sourceReportedDate;
- capturedAt;
- firstKnownAt / availableAt when known;
- sharesEffectiveDate;
- marketDate.

A daily/current profile dated T may truthfully describe the current reported share count.
It does not by itself prove when that count became economically effective.

Therefore:

`SOURCE_DATE_MATCH == true`

does not imply:

`SHARES_EFFECTIVE_FOR_MARKET_DATE == true`.

## 4. Current-share historical backfill is forbidden

Never compute historical market cap as:

`todaySharesOutstanding × historicalClose`

unless an independent denominator-vintage receipt proves today's share count was the effective count on that historical date.

Current profile data may support current/prospective observation.
It cannot silently reconstruct historical size membership.

Violation state:
`CURRENT_SHARES_BACKFILLED_TO_HISTORICAL_DATE`.

## 5. Custom market-cap/source ambiguity

Current Formal enrichment may produce market cap through:
- custom explicit marketCap;
- custom shares × close;
- official shares × close.

Numerically equal market caps can have different source/vintage semantics.

For the first D18-06 research baseline:
- official profile shares are preferred when their source row identity is directly observable;
- custom values may be preserved as QA/context only unless their own source/date/capture/vintage provenance is fully bound;
- do not infer "official" merely because an official profile request also succeeded.

If source branch cannot be proven:
`MARKET_CAP_SOURCE_UNKNOWN`.

No D18 size membership.

## 6. Shares outstanding is not free float

Issued/common shares outstanding and investable/free-float capitalization are different objects.

D18-06 V0.1 size basis is allowed to study total issued-share market capitalization only if explicitly named as such.

It must not be labeled:
- free-float market cap;
- index investable weight;
- tradable float.

A future free-float version is a separate source/vintage contract.

## 7. Denominator-vintage ownership

Room11 does not build a second capital-supply truth.

Canonical effective-share denominator semantics must reuse the shared corporate-action/capital-supply owner.

Relevant event families can include share-count-changing events beyond simple price-reference resets.

Therefore the D18-06 consumer receipt must bind an explicit:
`denominatorFamilySetVersion`.

Until the owner proves the family set and effective-date semantics adequate:
`EFFECTIVE_SHARE_DENOMINATOR_SCOPE_UNPROVEN`.

S0 remains usable as context.
S1 remains UNKNOWN.

## 8. PIT market-cap formula

When S1 is eligible:

`marketCap = effectiveSharesOutstanding × sameDayPitClose`.

Required:
- units explicitly normalized;
- close marketDate == target marketDate;
- close source identity frozen;
- shares denominator valid for target date;
- both known no later than decisionTimestamp under the after-close research clock.

Do not mix:
- explicit vendor market-cap value from one vintage;
- shares from another vintage;
- close from a different date.

## 9. Cross-sectional size bucket rule

Bucket construction is not frozen by this file.

Before any outcome inspection, a separate bucket receipt must freeze:
- eligible universe;
- size basis/version;
- TWSE/TPEx pooled or separate construction;
- breakpoints/quantiles;
- tie handling;
- minimum coverage;
- UNKNOWN handling;
- rebalance frequency.

No threshold sweep after strategy outcomes.

Preferred first design remains date-relative/coarse rather than a narrative NT$ cutoff.

## 10. Denominator ladder

Every decision date should preserve:

- M0 = MARKET_BASE_UNIVERSE;
- M1 = REPORTED_SHARES_SNAPSHOT_KNOWN;
- M2 = EFFECTIVE_SHARE_DENOMINATOR_CERTIFIED;
- M3 = EFFECTIVE_MARKET_CAP_KNOWN;
- M4 = SIZE_BUCKET_ELIGIBLE.

Loss reasons:
- SHARE_SOURCE_MISSING;
- SHARE_SOURCE_DATE_UNKNOWN;
- SHARE_SOURCE_AFTER_DECISION;
- MARKET_CAP_SOURCE_UNKNOWN;
- EFFECTIVE_SHARE_DENOMINATOR_SCOPE_UNPROVEN;
- CAPITAL_SUPPLY_EVENT_UNRESOLVED;
- CORPORATE_ACTION_DENOMINATOR_UNRESOLVED;
- CLOSE_DATE_OR_SOURCE_MISMATCH;
- MARKET_MEMBERSHIP_UNKNOWN;
- UNIT_SEMANTICS_UNKNOWN;
- UNKNOWN_OTHER.

Never coerce missing size membership to "small".

## 11. Mandatory falsification cases

1. Same numeric shares, different source row hash/vintage -> distinct receipts.
2. Source date T, shares effective only after T -> S0 known, S1 blocked.
3. Current shares paired with historical close without vintage proof -> reject.
4. Custom shares override official shares, provenance absent -> MARKET_CAP_SOURCE_UNKNOWN.
5. Explicit custom market cap exists but provenance absent -> cannot become S1.
6. Official shares row observed after decision cutoff -> not PIT eligible.
7. Corporate action/share-count event unresolved at target date -> S1 blocked.
8. Market transfer/listing identity unresolved -> S1 blocked.
9. Same-day close source date mismatches target date -> S1 blocked.
10. TWSE denominator semantics may not be inherited by TPEx.
11. Issued shares may not be relabeled free float.
12. Equal current market cap but different denominator vintage -> do not collapse identity.
13. Clean official source row + certified effective denominator + exact same-day close -> deterministic market-cap receipt.

## 12. D18-06 implication

This contract materially narrows the L3 engineering gap:

- S0 prospective source feasibility is already strong;
- a zero-extra-call observer can likely preserve profile row date/share count already fetched elsewhere;
- S1 remains blocked on effective denominator-vintage certification;
- bucket builder/replay remains unimplemented.

Therefore D18-06 remains L2.

The correct next evidence is not a backtest.
It is a PIT size-vintage receipt.

## 13. No strategy interpretation yet

A future large-minus-small return spread remains descriptive until:
- liquidity;
- volatility;
- price/limit state;
- sector composition;
- information quality;
- coverage/missingness
are controlled or reported.

Size leadership is not automatically an independent regime factor.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next

1. Preserve official profile share-count source/date/capturedAt provenance in a research-only observer with zero new market calls where possible.
2. Obtain shared denominator-vintage authority for effective shares.
3. Build S0/S1 machine receipts and the falsification suite.
4. Freeze size bucket construction before outcomes.
5. Only after executable PIT replay may D18-06 be considered for L3.
