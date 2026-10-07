# D18-04 TPEx Official Aggregate Breadth Source Validation 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / PROSPECTIVE_MACHINE_SOURCE_TRANSPORT_OBSERVED / PARSER_REPLAY_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Module: D18-04 Breadth participation × strategy
Formal Core impact: NONE
Production/runtime impact: NONE

## Purpose

Resolve the previously open question:
Does TPEx expose an official machine-readable aggregate market-direction breadth source suitable for future PIT/replay validation?

Previous canonical state:
TPEx market-highlight semantics were known from the official page, but the exact machine-readable prospective transport/clock was unverified.

## Official source identified

Official TPEx OpenAPI endpoint:

`https://www.tpex.org.tw/openapi/v1/tpex_mainborad_highlight`

Note:
`mainborad` is the spelling used by the official endpoint and must not be silently corrected in machine identity.

Observed through a live Firecrawl retrieval against the official endpoint with cache reuse disabled.
Retrieval channel is not the authority; the official TPEx endpoint is the authority.

Observed response:
- HTTP 200;
- content type application/json;
- JSON array with one market-highlight record;
- record Date = `1151007`, normalized to 2026-10-07.

## Exact observed fields

- `Date` = 1151007
- `ListedCompanyNumbers` = 893
- `AuthorizedCapital` = 849369
- `MarketCapitalization` = 12039666
- `DailyTradingValue` = 299188
- `DailyTradingVolume` = 1224966
- `CloseIndex` = 430.46
- `IndexChange` = -0.4
- `PriceRiseCompanyNumbers` = 419
- `LimitUpCompanyNumbers` = 23
- `PriceDeclineCompanyNumbers` = 357
- `LimitDownCompanyNumbers` = 3
- `PriceFlatCompanyNumbers` = 97
- `UnmatchedCompanyNumbersSuspensionStocksIncluded` = 20

## Denominator semantic validation

Observed category identity:

419 rise
+ 357 decline
+ 97 flat
+ 20 unmatched / suspension included
= 893 listed companies.

This exactly matches `ListedCompanyNumbers=893`.

Subcount guards also hold on the observed record:
- limit-up 23 <= rise 419;
- limit-down 3 <= decline 357.

Interpretation:
the observed official payload has an internally coherent aggregate breadth denominator.

This does NOT yet prove that every future payload is coherent.
A production-grade parser must enforce these relations and fail closed on violations.

## Source/estimand mapping

Primary D18-04 aggregate fields:
- UP = PriceRiseCompanyNumbers;
- DOWN = PriceDeclineCompanyNumbers;
- FLAT = PriceFlatCompanyNumbers;
- UNTRADED_OR_SUSPENDED = UnmatchedCompanyNumbersSuspensionStocksIncluded.

Diagnostic subcounts:
- LIMIT_UP = LimitUpCompanyNumbers;
- LIMIT_DOWN = LimitDownCompanyNumbers.

Denominator:
- LISTED_TOTAL = ListedCompanyNumbers.

Do not interpret:
- MarketCapitalization as per-stock size membership;
- AuthorizedCapital as market capitalization;
- limit-up/down as separate additive categories on top of rise/decline.

## PIT / clock interpretation

This observation proves:
- a same-date official machine-readable TPEx aggregate breadth transport exists on 2026-10-07;
- same-date target-date identity was observable by this research session.

It does NOT prove:
- exact publication first-known time;
- that the endpoint was available at every earlier Stage-1 decision clock;
- a historical publication-time distribution;
- a complete prospective occupancy series.

Therefore current clock class:
`SAME_DATE_SOURCE_OBSERVED / EXACT_FIRST_KNOWN_NOT_PROVEN`.

Future prospective observer must store:
- requestedAt;
- responseAt;
- HTTP/content type;
- exact raw-response hash;
- target date;
- source endpoint/version;
- parsed field set;
- denominator/subcount validation;
- failure reason;
- first READY observation within the observer schedule.

No backdating from the current observation.

## Cross-market D18-04 implication

TWSE:
official TWTaZU aggregate direction-breadth sublane already has executable parser/adversarial tests.

TPEx:
official machine source/transport is now directly identified and same-date observed.

Remaining TPEx engineering/research feasibility gap:
- executable parser;
- target-date guard;
- denominator/subcount guard;
- duplicate/shape guard;
- raw hash / provenance;
- deterministic replay;
- prospective availability accumulation.

## U2B remains independent hard blocker

D18-04 is not only aggregate direction breadth.

Canonical true-return-distribution lane requires U2B continuity-certified returns.

Current shared TECHNICAL_CONTINUITY state is not yet sufficient for a full-market U2B builder/replay:
- several official corporate-action source lanes are physically proven;
- shared continuity semantics are frozen;
- but end-to-end full-market continuity certification / no-revision-gap and symbol-session completeness are still incomplete.

Therefore no whole-module L3 promotion is authorized.

## D18-04 maturity decision

Remain:
`L2 / 40%`.

What changed:
`TPEx aggregate machine-readable source unknown`
is closed.

New narrower blockers:
1. TPEx executable parser/replay + prospective clock receipts;
2. cross-market common-support receipt;
3. U2B full-market continuity-certified return builder/replay;
4. prospective context occupancy before any policy outcome opening.

## Exact next continuation

1. Route a research-only TPEx parser/test request to the appropriate System2/build owner without changing production behavior.
2. Reuse the exact official endpoint identity above; do not infer breadth from HTML if the machine source is available.
3. Require per-date denominator identity and subcount guards.
4. Bind TWSE + TPEx only on same-date/common-clock support.
5. Continue shared TECHNICAL_CONTINUITY/U2B dependency; do not create a second corporate-action engine inside D18.
6. No D18-04 policy threshold or strategy outcome opening yet.
