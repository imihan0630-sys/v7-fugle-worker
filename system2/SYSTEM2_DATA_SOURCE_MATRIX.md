# System 2 Data Source Feasibility Matrix

Updated: 2026-09-26 Asia/Taipei
Status: P1 INITIAL FEASIBILITY V0.1

## Purpose

Map each System 2 factor family to a source/availability/PIT risk before implementation. Existing V8 source experience may be reused, but System 2 must not assume a field is historically PIT-valid merely because today's value is available.

| Domain | Candidate source / existing evidence | Current feasibility | PIT / quality risk | Initial use |
|---|---|---|---|---|
| TWSE/TPEx universe & daily OHLCV | Existing V8 official-market ingestion and history | PROVEN_CURRENT / HISTORY_NEEDS_AUDIT | suspensions, corporate actions, stale provider bars, history-source continuity | technical, price-volume, liquidity |
| TAIEX / market indexes | Existing V8 official index snapshots | PROVEN_CURRENT | exact historical availability/receipt time must be preserved | market regime |
| TPEx / small-cap regime | Official TPEx index/breadth sources to be inventoried | PARTIAL | do not proxy all small-cap conditions with TAIEX | regime |
| Three institutions | Existing V8 TWSE/TPEx official ingestion | PROVEN_CURRENT | daily availability time / missing dates / market coverage | chips |
| TDCC holder brackets | Existing V8 TDCC weekly data, 400+/1000+ ranges available | PROVEN_WEEKLY | weekly cadence, cannot identify holder identity, historical vintage required | ownership concentration |
| Margin financing / margin short | Existing research-only official evidence | PARTIAL_PROVEN | margin short != SBL short; exact historical continuity | chips/crowding |
| SBL / borrow short | Existing TWSE research evidence | PARTIAL | one-day data cannot masquerade as 5/20/60-day flow | chips/crowding |
| Monthly revenue | Existing official TWSE/TPEx research evidence | CURRENT_PROVEN / VINTAGE_RISK | current snapshot is not historical first-known vintage | fundamentals |
| Quarterly financials | Existing V8 MOPS workflows | PROVEN_CURRENT | restatement, period comparability, publication time | fundamentals |
| PE/PB | Existing V8 official same-day valuation snapshots | PROVEN_CURRENT | historical archive/PIT availability needs inventory | valuation |
| Forward PE / estimates | No validated canonical source yet | SOURCE_NEEDED | analyst forecast licensing, timestamp and revisions | valuation/growth |
| Industry classification | Existing V8 industry/peer logic plus official classifications | PARTIAL | classification drift, peer definition | industry |
| Industry breadth / turnover share | Derivable from official market data | FEASIBLE | universe/classification consistency | industry/capital flow |
| Stock/sector traded-value flow | Derivable activity measure | FEASIBLE | activity != true net capital inflow | capital flow |
| Company announcements/material info | Existing V8 official announcement evidence | PROVEN_CURRENT | event knownAt timestamp, duplicate narratives | event |
| General news | No canonical structured source fixed yet | SOURCE_NEEDED | licensing, entity resolution, publication/update timestamps | event/catalyst |
| Oil / commodities | Public/global sources to be selected | SOURCE_NEEDED | market timezone, futures contract/roll, receipt time | global/macro |
| FX / USD/TWD / DXY | CBC official NT$/US$ same-day close identified for USD/TWD; DXY source still to be selected | USD_TWD_PROSPECTIVE_SOURCE_PROVEN / DXY_SOURCE_NEEDED | CBC publishes business-day close around 16:00-17:00 Taipei; exact receipt timestamp/history still must be preserved | global/macro |
| US/global indexes | FRED demonstrates prior-session S&P 500 / NASDAQ close feasibility; live provider contract for full desired set still not frozen | PARTIAL_FEASIBLE / PROVIDER_CONTRACT_NEEDED | prior U.S. close is known before Taiwan opens and may be redundant by 18:10; SOX/JP/KR/provider terms and session provenance remain | global regime |
| Rates/macro releases | Official sources preferred | SOURCE_NEEDED | release timestamp/revisions/surprise definition | macro |
| Supply/demand/inventory/capacity | Official/company/industry sources by sector | RESEARCH_BY_DOMAIN | heterogeneous units/frequency, narrative vs hard data | industry cycle |
| Commodity/rare-element transmission | Event + supply-chain graph | RESEARCH_BY_DOMAIN | beneficiary/victim mapping and pass-through uncertainty | event/industry |

## Data tiers

### Tier A — ready for early prototype
- official TWSE/TPEx daily market data;
- market index;
- institutions;
- TDCC weekly ownership brackets;
- financials;
- valuation PE/PB;
- official announcements.

### Tier B — feasible but needs PIT/history audit
- historical institution/TDCC continuity;
- margin/SBL time series;
- monthly revenue vintages;
- industry breadth/turnover;
- corporate-action-adjusted historical features.

### Tier C — source selection required
- global markets;
- commodities/oil;
- FX/DXY;
- rates/macroeconomic releases;
- general news;
- analyst forward estimates;
- sector-specific supply/demand/capacity/inventory.

## Rules

1. Missing source stays UNKNOWN.
2. Current availability does not prove historical PIT availability.
3. Every historical factor must record observedAt/availableAt/source.
4. News/event score requires timestamped evidence and expiry/half-life.
5. Derived capital-flow activity must not be mislabeled as actual net fund inflow.
6. TDCC 400+/1000+ brackets measure holder concentration, not institution identity.

## Immediate engineering implication

The first Shadow prototype should preferentially use Tier A fields, while Tier B/C lanes continue research. This allows System 2 to begin accumulating honest forward data without waiting for every future factor.


## 2026-09-26 macro/cross-market source-clock refinement

- CBC NT$/US$ interbank closing rate is a materially feasible same-day official source for the 18:10 Taiwan after-market decision; it is published on business days around 16:00-17:00 Taipei.
- FRED DEXTAUS is not the preferred same-day operational FX source because H.10 daily observations are released in weekly updates and represent New York noon rates.
- Prior U.S. cash close is technically available before Taiwan opens, but at the 18:10 decision clock its incremental value must be tested after the Taiwan opening/full-session response.
- Japan/Korea daily close is a mixed-window observation because both markets close about one hour after Taiwan regular trading. Daily return cannot be labeled a pure post-Taiwan-close signal.
- Global Radar display coverage and System 2 research eligibility are intentionally different: a datum may be useful for monitoring while still lacking the PIT/source contract required for model research.
