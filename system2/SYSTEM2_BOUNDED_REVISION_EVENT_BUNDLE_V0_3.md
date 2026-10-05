# System 2 Bounded Revision Event Bundle V0.3

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / LOW-VOLUME EVENT-BUNDLE LINKAGE
System 1 Formal Core: LOCKED

## Why V0.3 exists

V0.2 physically classified the frozen 23-event low-volume universe as:

- 6 REVISION_CHAIN_OBSERVED;
- 15 AMBIGUOUS_MULTIPLE_ACTION_GROUPS;
- 2 AMBIGUOUS_MULTIPLE_VERSION_CHAINS.

The ambiguity is partly structural: one real corporate action naturally generates several issuer announcements across board decision, base date, exchange/share replacement plan and registration stages.

V0.3 therefore stops requiring one unique normalized subject group to represent an entire corporate action.

## Event-cycle boundary

For each final exchange event:

1. identify the previous official effective event for the same symbol and same official lane inside the frozen issuer-history horizon;
2. issuer rows must fall after that prior event and on/before the current event;
3. if no prior event exists in the horizon, the lower bound is 2025-01-01.

This prevents an older corporate-action cycle from contaminating the current event.

## Issuer-scope filtering

The event bundle excludes:
- disclosures explicitly made on behalf of a subsidiary;
- bond-conversion side effects from the primary capital-reduction bundle;
- treasury-stock reduction rows when the official event subtype is not treasury-stock related.

Excluded rows are not deleted; they are simply not allowed to determine the parent issuer event state.

## Bundle stages

Recognized issuer stages include:
- DECISION;
- BASE_DATE;
- OPERATIONAL_PLAN;
- REGISTRATION;
- CREDITOR_NOTICE;
- MARKET_NOTICE.

OPERATIONAL_PLAN / REGISTRATION / BASE_DATE provide the principal operational anchor.

## Amendment semantics

V0.3 distinguishes:
- explicit corrections: 更正 / 修正 or source correction hint;
- semantic amendments: 更新 / 更改 / 補充說明 / 補充公告 / 調整 and bounded operational-date/plan changes;
- cancellations: 取消 / 撤銷 / 廢止.

An amendment can be accepted as event-bundle revision evidence even when its wording is not an exact normalized-subject copy, provided it is inside the same bounded event cycle and an operational anchor exists.

## Per-symbol query-integrity upgrade

Every one of the 23 symbols must physically reconcile:
- 2025 company-year month=all vs Jan-Dec month shards;
- 2026 company-year month=all prefix through 2026-10-02 vs Jan-Oct month shards.

For each year:
- transport must succeed;
- parser must succeed;
- no pagination hint may be present;
- full-query and month-shard keysets must match exactly;
- month shards must contain no duplicate version keys.

Version key remains:
`date|time|seqNo`.

A negative no-revision/no-cancellation issuer claim is allowed only when this exact reconciliation passes.

## Possible V0.3 states

- EVENT_BUNDLE_CANCELLATION_OBSERVED
- EVENT_BUNDLE_AMENDMENT_OBSERVED
- EVENT_BUNDLE_NO_REVISION_OR_CANCELLATION_QUERY_CERTIFIED
- QUERY_INTEGRITY_NOT_CERTIFIED
- EVENT_BUNDLE_OPERATIONAL_ANCHOR_NOT_ESTABLISHED
- NO_OWN_ISSUER_ACTION_ROWS_IN_EVENT_CYCLE

## Promotion boundary

If all 23 events resolve with exact query integrity, V0.3 may establish narrow low-volume **issuer-side search coverage** for correction/cancellation evidence.

It does not by itself establish global:
- boundedRevisionHistoryCoverageComplete;
- correctionHistoryComplete;
- cancellationHistoryComplete;
- authorityRevisionCoverageComplete;
- exact public availableAt/knownAt;
- revisionCoverageComplete.

Exchange/regulator authority-side cancellation semantics and the two high-volume ex-right/dividend lanes remain separate gates.
