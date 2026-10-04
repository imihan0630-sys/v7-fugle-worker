# D03 MOPS Source Clock Semantic Audit V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OFFICIAL_SEMANTIC_EVIDENCE / EXACT_LATENCY_UNCERTIFIED
Formal Core: LOCKED

## TI-644 — official public-disclosure semantics are strong

Official TWSE materials establish that:
- MOPS is an information-disclosure platform intended to support information symmetry and timeliness;
- the MOPS front page exposes "real-time material information";
- the visible table columns include company code/name, spokesperson date, spokesperson time and subject;
- listed-company material-information rules require companies to input material information into the TWSE-designated internet reporting system within defined deadlines, with immediate input required in some cases.

Official sources:
- https://www.twse.com.tw/zh/about/company/guide.html
- https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e301929db782a801a8.pdf
- https://twse-regulation.twse.com.tw/TW/law/DAT0201.aspx?FLCODE=FL007111
- https://mops.twse.com.tw/mops/web/t05st01

This materially supports treating MOPS source-reported date/time as an issuer disclosure/reporting clock, not an arbitrary scrape timestamp.

## TI-645 — disclosure/reporting time is not yet exact public-availability time

The official materials do not provide a frozen maximum transport/display latency from issuer input time to public web availability.

TWSE also explicitly notes, for trading suspension/resumption, that the issuer publishes MOPS material information only after the exchange announcement and that there can be a slight time gap:
https://accessibility.twse.com.tw/zh/products/system/trading.html

This shows that "event occurred / exchange announced" and "issuer MOPS disclosure" are distinct clocks.

It does not prove the lag between MOPS sourceReportedAt and public page availability is zero.

Therefore:
`SOURCE_REPORTED_AT != CERTIFIED_EXACT_PUBLIC_AVAILABLE_AT`.

## TI-646 — safe historical use is one-directional exclusion

If:
`sourceReportedAt > parentKnownAt`

then the version cannot have been part of the parent's decision-time information state.

It is safely EXCLUDED.

If:
`sourceReportedAt <= parentKnownAt`

historical sourceReportedAt alone is insufficient to prove public availability by the parent cutoff.

That row remains:
`HISTORICAL_REPORTED_CLOCK_ONLY`.

This is an asymmetric but useful PIT rule.

## TI-647 — prospective observation can promote the clock

If a certified prospective observer records:
- exact immutable source version;
- firstObservedAt;
- sourceReportedAt;
- payload/version hash;
- firstObservedAt <= parentKnownAt;

then that exact version may be classified:
`VALID_OBSERVED_BY_PARENT`.

The observer does not need to prove sourceReportedAt equals firstObservedAt. It only needs to establish that the exact version was publicly observable no later than the parent cutoff.

## TI-648 — paid push availability does not retroactively certify website latency

TWSE offers a MOPS proactive data-delivery service for users who need timely data delivery.

This supports the broader premise that public-company disclosure is an actively distributed information product.

But the existence of a separate push service does not certify historical website display latency or backfill exact availability for free historical pages.

Reference:
https://eshop.twse.com.tw/zh/mops/about

## TI-649 — clock blocker is narrowed, not closed

Before this audit, sourceReportedAt semantics were broadly UNKNOWN.

After official semantic review:
- issuer disclosure/reporting-clock semantics: STRONG_OFFICIAL_SUPPORT;
- sourceReportedAt later than parent: safely EXCLUDED;
- sourceReportedAt earlier than parent: still not promotion-grade without certified public observation;
- exact public latency bound: UNKNOWN;
- prospective firstObservedAt path: valid architecture.

Thus the remaining blocker is specifically:
`EXACT_PUBLIC_AVAILABILITY_OBSERVATION_OR_CERTIFIED_LATENCY_BOUND`.

## TI-650 — maturity decision

No D03 module maturity increases.

The source clock is better characterized but the first genuine parent still lacks a certified pre-parent continuity observation path.

D03 remains 56.7%.

Current:
`MOPS_SOURCE_REPORTED_CLOCK_SEMANTICS = STRONG_OFFICIAL_SUPPORT`
`HISTORICAL_SOURCE_REPORTED_AT_AS_EXACT_AVAILABLE_AT = REJECTED`
`SOURCE_REPORTED_AFTER_PARENT = SAFE_EXCLUDE`
`SOURCE_REPORTED_BEFORE_PARENT_WITHOUT_OBSERVER = UNKNOWN_AVAILABILITY`
`PROSPECTIVE_FIRST_OBSERVED_AT = ACCEPTABLE_CLOCK_PATH`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`
