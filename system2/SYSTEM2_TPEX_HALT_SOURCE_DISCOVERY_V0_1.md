# System 2 TPEx Halt / Resumption Source Discovery V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY_SOURCE_DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Discover the real official TPEx data route behind the public historical "公布暫停/恢復交易有價證券" page without inventing endpoint names.

Official public evidence confirms that TPEx provides:
- a historical halt/resumption inquiry page;
- year and security-category selectors;
- HTML and CSV export controls.

The exact modern machine-query endpoint is not assumed from the page URL.

## Discovery method

The read-only probe fetches:

1. modern official page:
   `https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html`

2. official legacy/static historical output:
   `https://www.tpex.org.tw/storage/zh-tw/web/stock/aftertrading/spendi/sprc_history.htm`

It then:
- extracts same-origin script URLs;
- reads bounded-size same-origin JavaScript;
- searches page/script content for halt/sprc/historical route tokens;
- reports bounded candidate URLs and contexts.

No candidate is promoted merely because a string resembles an endpoint.

## Acceptance semantics

Discovery may end in either:
- `CANDIDATE_DATA_ROUTE_DISCOVERED`; or
- `NO_STABLE_DATA_ROUTE_DISCOVERED`.

Both are valid research outcomes.

Even when a candidate is discovered, all of these remain false until a separate physical source-capability gate verifies query behavior:
- `tpexSuspensionSourceCapabilityReady`;
- `responseRangeSemanticsCertified`;
- `emptyRangeSemanticsCertified`;
- `suspensionCoverageComplete`;
- `noEventMayBeClaimed`;
- `symbolSessionCompletenessCertified`;
- `technicalContinuityCertified`.

## Why this gate is needed

Earlier guessed modern `/www/.../halt/historical` JSON routes returned 404. System2 must not manufacture a source contract by URL analogy.

If V0.1 does not reveal a stable route, the TPEx suspension blocker remains explicit and the next research step must use another official discovery path, not a third-party substitute.

## Authority firewall

No secret, D1/R2 write, deployment, schedule, selection, push, capital, order or System1 runtime use.

## Discovery correction after first physical run

The first discovery run exposed a useful official inline configuration even though the generic URL-token detector reported no stable route:

`tables.init({ pattern: API_PATTERN, action: "bulletin/sprcHis", ... })`

The same official page also exposes form inputs named `date` and `cate`.

Therefore the branch now contains a second, narrower physical candidate probe for:

`https://www.tpex.org.tw/www/zh-tw/bulletin/sprcHis`

with the page-derived `date` / `cate` parameters and `response=json`.

This is not endpoint promotion by analogy: the `bulletin/sprcHis` action string is taken directly from the official TPEx page source. A separate capability contract is still required after physical JSON behavior is observed.
