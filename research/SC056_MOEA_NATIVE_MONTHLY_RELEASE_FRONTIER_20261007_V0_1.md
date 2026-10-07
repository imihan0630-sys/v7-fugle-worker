# SC-056 — MOEA Native Monthly Release Frontier Receipt V0.1

Status: RESEARCH_ONLY / PROSPECTIVE_RELEASE_FRONTIER_FROZEN / PRODUCT_LEVEL_NEW_MONTH_NOT_YET_RELEASED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-02
Date: 2026-10-07 Asia/Taipei
CapturedAt: 2026-10-07T19:08:55+08:00
Observed main before write: `cd99cd22f2019a8666c3fc25347d0e6fbbd2c595`

## Purpose

Continue the exact SC-056 research lane without reimplementing the already-completed local Playwright collector.

The research question is narrower:

At the current decision clock, what is the newest MOEA Industrial Production release that is publicly observable, and how must a not-yet-released month be represented before the next copper-foil -> CCL -> PCB physical-chain observation exists?

No stock return, issuer score, ranking, signal or Formal Core behavior is opened.

## Existing engineering boundary

The existing engineering handoff is:
`research/D10_SC056_PLAYWRIGHT_CAPTURE_HANDOFF.md`.

Accepted facts from that handoff:
- official interactive product source semantics were verified locally;
- exact product codes are `2433020` copper foil, `2630010` copper-clad laminate, and `2630040` printed circuit board;
- displayed units are metric tons / square feet / square feet;
- local deterministic replay passed;
- GitHub-hosted live CI source opening remained blocked by source-side HTTP 403;
- native historical `sourcePublishedAt` was not inferred;
- collector engineering completion does not promote D10-02 research maturity.

This receipt does not reopen that engineering task.

## Current official publication frontier

Official MOEA Statistics current pages observed on 2026-10-07 show:
- latest Industrial Production month: 2026-08 / ROC year 115 month 8;
- official Industrial Production release: 2026-09-23 16:00 Asia/Taipei;
- the official current-news index contains no 2026-09 Industrial Production release as of this capture.

Primary official sources:
- https://www.moea.gov.tw/Mns/Populace/news/News.aspx?kind=1&menu_id=40&news_id=124052
- https://mnscdn.moea.gov.tw/mns/dos/bulletin/BulletinQuery.aspx?menu_id=13034
- https://www.moea.gov.tw/mns/dos/home/Home.aspx

## Clock firewall

The public 2026-09-23 16:00 timestamp is an official release-family clock for the August Industrial Production publication.

It is NOT automatically promoted into the exact update timestamp of the interactive product-level database.

Therefore freeze:

```json
{
  "releaseFamily": "MOEA_INDUSTRIAL_PRODUCTION",
  "referenceMonth": "2026-08",
  "releaseFamilyPublishedAt": "2026-09-23T16:00:00+08:00",
  "productInteractiveSourcePublishedAt": "UNKNOWN",
  "capturedAt": "2026-10-07T19:08:55+08:00",
  "latestObservableOfficialMonthAtCapture": "2026-08",
  "nextReferenceMonth": "2026-09",
  "nextReferenceMonthState": "SOURCE_NOT_YET_RELEASED_AT_CAPTURE"
}
```

Permanent rule:
`RELEASE_FAMILY_PUBLISHED_AT != PRODUCT_DATABASE_EXACT_UPDATE_AT`.

## Missing-state semantics

For September 2026 at the 2026-10-07 capture clock:

Correct state:
`SOURCE_NOT_YET_RELEASED_AT_CAPTURE`.

Incorrect states:
- zero;
- carry-forward August;
- imputed September value;
- secondary-source estimate promoted as official;
- generic UNKNOWN without the reason.

This distinction is required because an unreleased observation is structurally different from:
- source missing a value after release;
- parser failure;
- product code no longer present;
- unit drift;
- source access failure.

## Frozen lag semantics

SC-049 / SC-055 rules remain unchanged:
- candidate lags = 1M / 2M / 3M;
- primary metric = month-over-month production direction;
- copper foil -> CCL and CCL -> PCB edges reported separately;
- no post-hoc best-lag switch;
- cross-layer level ratios remain prohibited because units differ;
- inventory/common-demand/contract-reset alternatives remain live falsifiers.

No new lag is selected in SC-056.

## What SC-056 achieves

SC-056 creates the first explicit current-date source-release frontier for the physical chain.

It proves that Room07 can now distinguish:
1. latest officially released month;
2. official release-family timestamp;
3. exact product-database update timestamp still UNKNOWN;
4. future month not yet released;
5. capture clock.

This prevents future September data from being backfilled into the 2026-10-07 research state.

## What SC-056 does not achieve

It does NOT yet append September production values.
It does NOT prove the exact first-publication second for August product-level rows.
It does NOT clear the cloud-CI source blocker.
It does NOT produce a new cross-edge concordance observation.
It does NOT justify D10-02 L3.

## Maturity

D10-02 remains L2 / 40%.

Reason:
the PIT missing-state and release frontier are now prospective, but the next new native monthly physical-chain observation has not yet been released/captured.

D10-09 remains L3 / 60%.

Formal optimization candidate: NONE.
Formal Core unchanged.

## Exact next

SC-067:
on the first official publication of September 2026 Industrial Production / product-level survey data after this receipt:
1. capture the native source before inspecting any later-month outcome;
2. preserve release-family published time, product-source observed time if available, and capturedAt;
3. retrieve the same three frozen product codes;
4. preserve displayed units and explicit missing/error states;
5. append production and inventory values without revising lag candidates;
6. only after receipt QA compute the newly enabled edge-wise 1M/2M/3M direction rows;
7. if product-source exact publication time remains unavailable, keep it UNKNOWN rather than borrowing the news timestamp.

Until then, no September row exists in the D10-02 research dataset.
