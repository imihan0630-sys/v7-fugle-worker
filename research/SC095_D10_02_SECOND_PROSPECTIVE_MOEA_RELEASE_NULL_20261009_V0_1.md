# SC-095 — D10-02 Second Prospective MOEA Release-Frontier Null V0.1

Status: RESEARCH_ONLY / PROSPECTIVE_RELEASE_NULL / SOURCE_NOT_YET_RELEASED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-02
CapturedAt: 2026-10-09 Asia/Taipei
Observed main before write: ffae6d280e09b68af9be563bbf58688778913425

## Official release frontier

MOEA Statistics still reports August 2026 as the latest Industrial Production month, released on 2026-09-23.
September 2026 Industrial Production is not yet published in the official release sequence.
Other September series such as exports/imports and CPI/PPI are already published, so this is a series-specific unreleased state.

## Frozen state

2026-09 INDUSTRIAL_PRODUCTION = SOURCE_NOT_YET_RELEASED_AT_20261009_CAPTURE.

Not zero, not missing-after-release, not carry-forward August, not estimated September and not a parser error.

Frozen rules:
- SOURCE_NOT_YET_RELEASED != ZERO;
- SOURCE_NOT_YET_RELEASED != MISSING_AFTER_RELEASE;
- OTHER_SEPTEMBER_SERIES_RELEASED != SEPTEMBER_INDUSTRIAL_PRODUCTION_RELEASED;
- later September values cannot be backfilled into the 2026-10-09 research clock.

## D10-02 implication

SC-067 remains calendar/source blocked, not research-design blocked.
The 1M/2M/3M lag candidates and product codes 2433020 / 2630010 / 2630040 remain unchanged.

D10-02 remains L3 / 60%.
No L4 promotion.
No Formal Core change.

## Exact next

On the first official September 2026 Industrial Production/product-level publication, capture the native product source immediately under SC-067 before any later-month or stock outcome access. Preserve source/capture clocks, units, explicit missing states and unchanged lag semantics.
