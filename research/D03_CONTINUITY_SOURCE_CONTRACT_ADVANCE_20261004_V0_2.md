# D03 Continuity Source Contract Advance 2026-10-04 V0.2

Updated: 2026-10-04 Asia/Taipei
Lane: D03-09 ADX / D03-10 Bollinger / shared TECHNICAL_CONTINUITY
Status: RESEARCH_ONLY / OUTCOME_BLIND / SOURCE_BLOCKER_REDUCED
Formal Core: LOCKED

## TI-564 — source clock semantics are frozen

Durable clock contract:
- research/D03_MOPS_VERSION_CLOCK_CONTRACT_V0_1.md
- research/d03_mops_version_clock_contract_v0_1.json

Official Taiwan daily material-information data expose 發言日期 / 發言時間 fields.
Current TWSE material-information rules require listed companies to input material information into the designated internet reporting system within specified deadlines and to update or supplement previously published material information promptly when later developments materially change.

D03 therefore freezes:
- sourceReportedAt = official source-reported date/time candidate;
- capturedAt = observer fetch completion clock;
- firstObservedAt = earliest append-only exact-version observation;
- firstKnownAt = promotion-grade causal clock and remains UNKNOWN historically unless separately certified.

Historical sourceReportedAt must not be silently backfilled into firstKnownAt.

## TI-565 — correction versions are append-only chronology

Version identity must retain:
- source host;
- stock code;
- sourceReportedAt;
- seqNo;
- content hash.

ORIGINAL / CORRECTION / SUPPLEMENT / CANCELLATION rows are separate versions.
A later final row never rewrites the earlier version in historical replay.

## TI-566 — prospective firstObservedAt is the safe research clock

For prospectively captured exact versions:
- first successful capture freezes firstObservedAt;
- same identity + same content = idempotent;
- same identity + changed content = provenance conflict/source mutation;
- a later sourceReportedAt or seqNo = a new version.

firstObservedAt may be used conservatively for no-lookahead research because it can only delay use relative to true public availability.

Historical firstKnownAt remains UNKNOWN without stronger source authority.

## TI-567 — empty-month semantics are source-locally certified

System2 physical source work now includes:
- MOPSOV Empty Month Certification V0.2;
- physical state MOPSOV_EMPTY_MONTH_SEMANTICS_CERTIFIED;
- 4/4 empty controls PASS;
- 3/3 positive controls PASS.

Therefore a frozen MOPSOV company-month response matching the certified signature can be distinguished from:
- positive records;
- transport failure;
- parse failure;
- generic error page.

This is endpoint-specific and does not authorize a global NO_EVENT claim.

## TI-568 — multi-company month-shard reconciliation passes

System2 physical evidence now covers:
- one 2330 company-year control with 151 Jan-Sep rows;
- four correction/cancellation control companies;
- exact month-shard vs company-year keyset reconciliation;
- zero only-full-query keys;
- zero only-month-shard keys;
- zero cross-month duplicate keys.

This materially reduces query-fragmentation risk.

## TI-569 — high-row truncation stress passes far above the earlier 151-row control

Physical workflow:
System2 MOPSOV High Row Pagination Stress Readonly
run 37174063094 = PASS.

Frozen candidate universe included 11 large/frequently disclosing issuers.

Top three by Jan-Sep 2026 prefix row count:
- 2891: 391 rows;
- 3711: 383 rows;
- 2881: 300 rows.

For all three:
- full-query prefix keyset = Jan-Sep monthly union exactly;
- onlyAllCount = 0;
- onlyMonthShardCount = 0;
- duplicateMonthKeyCount = 0;
- no visible next-page/page-number/step=3 pagination hints.

This falsifies the narrow concern that the earlier 151-row control was simply too small to expose a silent fixed-row truncation threshold.

It still does not prove universal no-truncation for every company/year/source state.

## TI-570 — bounded query capability is stronger, global completeness still not certified

The following are now physically supported for the tested source contract:
- positive revision/cancellation rows across four action families;
- certified empty company-month signature;
- exact company-year vs month-shard reconciliation;
- high-row exact reconciliation through at least 391 rows.

But D03 still does not set:
- boundedIntervalCoverageComplete=true globally;
- actionFamilyCoverageComplete=true;
- revisionCoverageComplete=true;
- technicalContinuityCertified=true.

A symbol/window-specific completeness receipt may eventually be certifiable from these components, but only after exact required action-family and exchange-source coverage is frozen.

## TI-571 — TWSE Official Document Announcement is an independent exchange-side public evidence family

The official TWSE Official Document Announcement public surface visibly contains exchange-issued rows for:
- capital-reduction exchange schedules;
- old-share trading suspension and new-share listing/resumption dates;
- suspension of registration effective for capital reductions;
- revocation of such suspension;
- stock-code-specific exchange actions.

Observed public examples include 1459 capital-reduction exchange scheduling and a paired 2026-07-31 suspension / 2026-08-06 revocation of suspension for capital-reduction registration.

This demonstrates exchange-side semantic capability independent of company MOPS disclosures.

## TI-572 — exchange-side machine contract remains PARTIAL/UNKNOWN

The public announcement page is readable, but a stable machine query contract has not yet been frozen for:
- exact date-range query parameters;
- pagination/completeness semantics;
- immutable raw artifact capture;
- bounded source-date coverage;
- machine-readable correction/revocation linkage.

A browser-automation attempt to inspect the rendered form/query contract could not start because the optional external browser wallet had insufficient funds.
That tool limitation is not evidence against the source.

Therefore:
EXCHANGE_OFFICIAL_DOCUMENT_PUBLIC_CAPABILITY = OBSERVED
EXCHANGE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT = PARTIAL_UNKNOWN

D03 must not infer absence from this lane until the machine contract is physically certified.

## TI-573 — D03-10 Bollinger remains L2

The source side is materially stronger, but Bollinger L3 still requires:
1. physical immutable parent generation/readback;
2. exact parent keyset/captureGeneration;
3. symbol-window TECHNICAL_CONTINUITY receipt;
4. exact 20 eligible-session continuity-corrected closes;
5. action-family/exchange coverage for that window;
6. replay/prefix exactness and complete attempts.

Current result:
D03_10_BOLLINGER = L2_REMAINS.

## TI-574 — D03-09 ADX remains L2

ADX requires all Bollinger-grade provenance plus:
- canonical H/L/C continuity;
- Wilder recursive-state lineage;
- FULL_REPLAY or replay-certified TRUSTED_PRIOR_STATE;
- invalidation/replay after continuity revision.

Current result:
D03_09_ADX = L2_REMAINS.

## Maturity decision

No maturity inflation:
- D03 current = 56.7%;
- Bollinger L3 would move to 58.3%;
- ADX L3 after that would move to 60.0%.

The current tranche meaningfully reduces source uncertainty but does not satisfy the L3 curriculum gate.

Current state:
MOPSOV_REVISION_CANCELLATION = 5_OF_5_PHYSICAL_PASS
MOPSOV_EMPTY_MONTH = CERTIFIED_SOURCE_LOCAL
MOPSOV_HIGH_ROW_RECONCILIATION = PASS_TO_391_ROWS
SOURCE_REPORTED_CLOCK = DEFINED
HISTORICAL_FIRST_KNOWN_AT = UNKNOWN
EXCHANGE_OFFICIAL_DOCUMENT_PUBLIC_CAPABILITY = OBSERVED
EXCHANGE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT = PARTIAL_UNKNOWN
IMMUTABLE_PARENT_RUNTIME = IMPLEMENTATION_PENDING
D03_10 = L2_REMAINS
D03_09 = L2_REMAINS
D03_MATURITY = 56.7_PERCENT
FORMAL_OPTIMIZATION_CANDIDATE = NONE

## Exact next continuation

1. Do not repeat MOPSOV row-count stress unless a new source-shape falsification target appears.
2. Freeze a reproducible TWSE Official Document Announcement machine/date-range contract, or retain PARTIAL/UNKNOWN.
3. Prospectively capture exact MOPS/OpenAPI versions and measure firstObservedAt vs sourceReportedAt without outcomes.
4. Consume the owner-approved immutable parent substrate only after its Codex implementation is physically merged/read back.
5. Re-review Bollinger first once symbol-window continuity + parent generation are physical.
6. ADX follows only after recursive replay certification.
7. Independently wait for the next genuine Taiwan completed trading session to advance the raw D03 source-version gate from 2/3.
