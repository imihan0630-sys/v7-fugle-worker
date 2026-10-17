# System 2｜Scheme C 快速恢復每日選股研究預覽：DATA / BUILD / AUDIT 交接與雙路徑最小驗收 V0.1

- 日期：2026-10-17 Asia/Taipei
- Status: **OWNER-DIRECTED CROSS-LANE PRIORITY / BUILD Class A coordination; no official strategy/PIT gate override**
- Canonical baseline when authored: GitHub `main` `05f48adbe23298d191cd0ba16734fa5c19338df9`. Executing lane MUST re-read newest `main`.
- Parent lane ownership remains `system2/SYSTEM2_PIT_DATA_BUILD_OWNERSHIP_AND_HANDOFF_V0_1.md` and `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`. This ADDENDUM sequences owner-approved Scheme C; it does **not** edit those contracts or transfer any original-source ownership.

## Owner goal and products: no "wait until PIT-B"

Deliver an honestly labeled, source-bounded **usable daily `NON_PIT_PREVIEW` stock research shortlist first**, without waiting for issuer historical CFI revisions, PIT-B migration, historical return certification, production D1 Frozen, licensed data or real trading privileges. In parallel, obtain the **first independently PIT-A qualified exact strategy-used-input security** with true decision-cut evidence. PIT-B remains active but off the preview critical path.

### Explicit independent acceptance axes

| Axis | Product | Status from verified baseline | WHAT REALLY PASSES |
|---|---|---|---|
| A / Research preview | `NON_PIT_PREVIEW` | `#1432` three-layer selector; `#1434` event-driven after-existing-A1-audit consumer merged. Real **2026-10-13** source-only derived `1974 four-digit / 580 descriptive matches / 30 displayed` verified; **T+1 LATE**. | **New marketDate** real 122/122 original-source-audited receipt and correctly displayed derived file with true observations/late flag; no same-date source claim from different dates. |
| B / Daily independent PIT-A | `PIT_A_PROSPECTIVE` | 2330 2026-10-16 A1 61/61, current native CFI source observation and known 9/16 dividend; DATA `#1435` candidate reference ratio is **NOT accepted adjusted 61 OHLC**; first complete PIT-A **0/1 local scope**. | Genuine exact used-factor timestamps, class/tradeability, price-event continuity, independent AUDIT signed scope + permitted versioned admission. |
| C / Historical replay | `PIT_B_HISTORICAL` | Prior evidence D1 59,311/84,688 (70.04%), R2 destination entitlement blocked; **do not relabel stale numbers as new physical latest**. | Historical issuer source versions, PIT publication clocks, corporate action revisions, costs, OOS, full firstKnownAt semantics; separate backlog. |

The fact that the existing shared A1 original source may have 122/122 native physical files **does not** certify all ordinary shares, corporate action NO_EVENT, seven strategy factors, frozen selections or performance. Never output `selectedCount=0` from missing source; output `selectedCount=null` and `zeroPickDay=null`.

## Priority lanes, single modification owner

| Lane | P0 deliverable for fastest usable research preview | P1 independent formal PIT track | P2 / what not to block |
|---|---|---|---|
| **DATA_LANE — System 2｜歷史資料工程室; #1068** | **Reuse** existing daily official 61-session TWSE+TPEx original-source collector and A1 independent-audit events (NO duplicated market GETs). Hand BUILD the exact completed T native 122-pair source run, first captured time, official 61-day calendar, original manifest/row SHAs, body-version clocks, source-only audit receipt and exact V0.2 derived preliminary watch availability; explicitly report `SOURCE_READY` vs `SOURCE_NOT_READY` and full 4-digit source denominator (not certified ordinary-shares). For shown preview symbols, add actual available native current CFI/issuer stock type, CA **known-positive** events and price-space/tradeability warnings with source-hash/observedAt; UNKNOWN never becomes a negative `NO_EVENT`. | Continue priority **one-symbol PIT-A**: reuse merged `#1435` known-dividend reference proposal; acquire/independently expose all **actually used** technical/price/volume window continuity proof, as-of current ordinary class and tradeability, relevant company-action version availability and genuine `firstKnownAt/availableAt`; send original Run/Artifact/SHA to AUDIT, never self-certify. | PIT-B historical issuer vintages and D1/R2 migration use safe leftover quota, **never block Preview P0**; no new D1 writers/Cron/secrets or pseudo-complete 61 adjusted bars. DATA does **not** build ranking/UI/strategy factors. |
| **BUILD_LANE — System 2｜建置總控室; #1132/#1234** | Consume existing same-run `audit-receipt.json` + `preliminary-pv-watch.json` with merged `#1434` consumer; verify real subsequent T `workflow_run` and new derived artifact (not merely historic PR replay). Ship a readable dated stock research preview entry with symbol/name/exchange, descriptive source reason, original source T and actual as-of UTC/Taipei, `on-time/late`, source counts, company action and ordinary-class warnings, clear source failure vs zero matches, original source receipt link and **no BUY/rank/order claims**. First release may be GitHub Actions artifact/read-only report (no Cloudflare prod deploy). | In parallel, await exact DATA + independent AUDIT receipts to link **actual** strategy-used factor manifest (current SHORT_MOMENTUM 7 evaluated input observations), price-space/CFI/tradeability gate, scorer and versioned PIT-A tests. Any effective Class B/C policy or Frozen modification returns to OWNER. | Build additional strategy-specific NON_PIT research observations only where genuine factor sources are available, keeping each strategy's definitions/version independent. **No duplicate source GET, no PIT-B migration, no source-original self-signoff**. |
| **AUDIT_LANE — independent** | Independently attest A1 122/122 original integrity (already owned by existing source-audit pipeline), and check display receipt lineage/cut against actual original, not just upstream workflow `success`. | Independently verify 2330 relevant event coverage and proposed adjustment assumptions, actual as-of cutoff, real current CFI/tradeability and exact inputs; issue **scope-bounded signed PIT-A verdict**, not blanket all-market pass. | Cannot promote incomplete PIT to Frozen just to accelerate display. |
| **REMEDIATION_LANE** | Only unblock recurrent shared-source workflow/credential security defects preventing actual daily report delivery. | Source/destination D1 80,000 billed-rows/day writer-interlock issues remain separate. | Never claim cloud quota safety from offline CI. |

## Exact machine-readable DATA → BUILD minimum receipt (reuse originals; do not create redundant GET)

`P0_PREVIEW_SOURCE_HANDOFF` should identify:
- `marketDateT`, `nativeSourceRunId`, `nativeSourceArtifactId`, `sourceOriginalSha256`, `sourceReceiptHash`, `independentA1SourceAuditRunId`, `auditReceiptHash`, `tradingDates[61]`, `requiredMarketDatePairs=122`, `actualMarketDatePairs`, `originalFourDigitSourceUniverseCount`, `displayedResearchObservations`.
- For input used or symbol metadata: `firstKnownAt` where genuinely evidenced, `firstPhysicalObservedAt`, `availableAt` (do not assign retrospective clocks), `sourceReportedMarketDate`, `retrievedAtUtc`, `classificationStatus`, `knownPositiveCorporateActionEvents[]`, `priceSpace`, `CARevisionsUnknown`, `haltAndTradeabilityUnknown`; any unavailable field is `null`/`UNKNOWN`.
- `sourceIntegrityReady` is **not** `ordinarySharePITReady`, `formalStrategyEligible`, `NO_EVENT`, `shortEligible`, `selectedCount`, `zeroPickDay`, `Frozen`, or proven timely original decision.
- Failure source-status matrix must preserve genuine 121/122, malformed SHA, stale T, missed 23:45 or late T+1, and no-manifest/no-artifact, with **no fabricated zero-picks**.

It is acceptable to reuse existing artifact schemas and hand over their exact pointers without adding a new API or duplicating source storage. BUILD must not demand a second issuer-original archive solely for a preview card.

## Mini launch contract (DoD; independently check physical evidence)

**P0: Research-preview beta can be called "working" only when ALL true:**

1. A **new real T trading date** (not reused 2026-10-13) has an actual signed source + independently rehashed A1 122/122 receipt; verified 61 official trading sessions and source date, no stale cross-date totals.
2. Scheme C same-upstream `workflow_run` actually ran on `main` for that T, output derived report/artifact; GitHub original Run/Job/Artifact/SHA and source linkage read back. Workflow `success` with source missing or mere CI fixture is **not** acceptance.
3. Human-readable research output lists the correct T, update/cut time, observed security count / descriptive matches / displayed count, source quality, instrument type UNKNOWN where appropriate, known CA positive hold, and at least per-symbol explanatory reason. `0 displayed` if truly no descriptive matches is **not** formal selectedCount=0.
4. A missing/late/partial source has its own clear visible **SOURCE_NOT_READY / LATE_SOURCE** output; never silently keeps yesterday's "today" report.
5. No BUY/sell/short signal, official rank, PIT-A/B certified performance, portfolio sizing, Frozen D1 or live pushes. `selectedCount=null`, `zeroPickDay=null`; Cloudflare reads/writes 0, no new paid feed/new Cron/secret/production Worker.
6. Independent regression validates System1/V8 safety; all modified BUILD tests/negative cases pass; only after readback can BUILD say research-preview beta available.

**P1:** The first *actual* validated `PIT_A_PROSPECTIVE` used-input symbol has exact individual source/artifact and independent AUDIT verdict at its actual cut, current ordinary-share/tradeability, CA-window transform or proven safe exclusion, strategy version/admission authorized; unrelated Preview P0 stays independent. Partial 2330 evidence cannot become `1/1` by changing a descriptive label.

**P2:** Historical issuer class/corporate-action negative vintage, backtest with execution constraints and cost, OOS/Forward and strategy version comparison; no inflated Sharpe, win-rate, Frozen or retroactive snapshots. D1 migration and R2 entitlement are separate.

## Start / issue owner notes

DATA writes actual native source receipt scope and blocker updates to [#1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068); BUILD consumes exact source snapshot, writes runnable preflight/preview output to [#1132](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1132) and [#1234](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1234). AUDIT independently reviews source and PIT. A GitHub comment **does not wake another ChatGPT room**. The user or a connected executor must invoke the respective room or Work for actual task execution. Do not transfer DATA originals or permit two rooms to change the same file concurrently.

This document is additive coordination, not an assertion that daily prospective preview has already physically passed. V8/Formal Core and System2 protected gates remain untouched.
