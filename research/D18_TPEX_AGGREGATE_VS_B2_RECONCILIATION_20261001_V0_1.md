# D18 TPEx Aggregate vs B2 Reconstructed Breadth Reconciliation — 2026-10-01 V0.1

Updated: 2026-10-02 Asia/Taipei
Status: RESEARCH-ONLY / ONE-DATE COMMON-SUPPORT DIAGNOSTIC
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Compare two different TPEx breadth estimands on the first observed date where both can be inspected without pretending they are identical universes:

1. official TPEx market-highlight aggregate breadth;
2. System 2 B2 ordinary-company reconstructed direction breadth.

This is a source/universe reconciliation diagnostic, not an alpha test.

## 1. Official TPEx aggregate market snapshot

Official market-highlight page for 2026-10-01:
- listed OTC company count: 892;
- advancers: 333;
- limit-up: 27;
- decliners: 417;
- limit-down: 2;
- flat: 114;
- untraded including suspended: 28.

Count identity:
`333 + 417 + 114 + 28 = 892`.

The page declares an exchange-market scope and excludes specified non-stock security classes.

## 2. B2 final observed same-date TPEx snapshot

Immutable prospective Decision Clock run:
- run id: `36820508997`;
- final B2 observation timestamp: `2026-10-01T08:11:00.872Z`;
- TPEx daily state: TARGET_DATE_OBSERVED;
- daily ordinary symbol count: 887;
- valid dated ordinary symbol count: 887;
- classified joined count: 887;
- classification coverage rate: 1;
- daily coverage pass: true;
- classification coverage pass: true.

Summing the 28 persisted TPEx industry rows:
- memberCount: 887;
- up: 331;
- down: 417;
- flat: 114;
- unknownDirection: 25.

Identity:
`331 + 417 + 114 + 25 = 887`.

## 3. Count reconciliation

| State | TPEx official aggregate | B2 reconstructed | B2 - official |
| --- | ---: | ---: | ---: |
| total universe | 892 | 887 | -5 |
| up | 333 | 331 | -2 |
| down | 417 | 417 | 0 |
| flat | 114 | 114 | 0 |
| untraded / unknown | 28 | 25 | -3 |

The exact -5 universe difference is decomposed at the count level into:
- -2 advancers;
- 0 decliners;
- 0 flat;
- -3 untraded/unknown.

This is strong descriptive agreement for down/flat counts but is NOT proof of identical universe semantics.

## 4. Why the estimands differ

B2 current parser:
- accepts symbols matching `^[1-9][0-9]{3}$`;
- uses official daily rows on the requested market date;
- direction uses numeric changePercent, falling back to numeric changeAmount;
- unresolved numeric direction becomes UNKNOWN;
- industry snapshot pairs daily rows with prospectively observed company profiles;
- industry aggregation requires an industry classification.

Official TPEx aggregate market-highlight:
- uses the exchange's own market-scope definition;
- directly reports up/down/flat/untraded including suspended.

Therefore:
- B2 UNKNOWN is not proven semantically identical to official untraded;
- B2 ordinary-company membership is not proven identical to official listed-company count;
- exact identity-level differences cannot be inferred from count agreement.

## 5. Critical observability gap

The immutable B2 receipt persists:
- counts;
- coverage;
- industry aggregates.

It does NOT preserve an identity-level:
- source ordinary-symbol set manifest;
- joined-profile symbol set manifest;
- excluded symbol list;
- UNKNOWN-direction symbol list.

Therefore the five-symbol difference cannot be truthfully attributed to a specific exclusion class from the persisted receipt alone.

Do not reverse-engineer or guess identities from the count difference.

## 6. Required future reconciliation receipt

Before claiming aggregate vs reconstructed parity, a research receipt should preserve at minimum:
- marketDate;
- source contract/version;
- official aggregate counts;
- reconstructed symbol-set count + deterministic hash;
- profile-joined symbol-set count + deterministic hash;
- UNKNOWN-direction count + deterministic hash;
- excluded symbol count by explicit reason;
- bounded identity manifest or immutable external manifest reference;
- aggregate-minus-reconstructed differences;
- observedAt / decision clock;
- PIT eligibility;
- no policy impact.

Identity manifests are diagnostic evidence, not a new selection universe.

## 7. What can be concluded now

Supported:
- the two TPEx breadth views are numerically close on 2026-10-01;
- down and flat counts exactly match on this date;
- total universe differs by five;
- missing/unknown semantics can materially affect the numerator/denominator even when headline breadth looks similar.

Not supported:
- exact symbol-level parity;
- a universal five-symbol gap;
- that B2 UNKNOWN equals official untraded;
- that either universe is superior for strategy alpha;
- any coverage threshold;
- any Regime policy.

## 8. Missingness-state-dependence implication

This single date is insufficient to test whether:
- the five-symbol gap is stable;
- UNKNOWN share rises in stress/high-volatility regimes;
- official-vs-reconstructed differences are state-dependent.

Required test after multiple common-support dates:
- gap count/share by date;
- direction-state decomposition;
- UNKNOWN/untraded share;
- leave-one-date-out;
- episode grouping;
- relation to volatility/trend only after the source metrics are frozen.

No statistical test is justified at N=1 common-support date.

## 9. Formal boundary

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

No source reconciliation result is used for:
- strategy ranking;
- gating;
- capital;
- entry/exit;
- Regime label;
- exact Decision Clock.

## Exact next continuation

1. Add identity-level reconciliation only if it can reuse already-fetched read-only source rows; no extra production dependency.
2. Accumulate at least several independent common-support dates before any missingness-state analysis.
3. Keep official aggregate market breadth and B2 industry/common-stock breadth as distinct estimands even if counts converge.
