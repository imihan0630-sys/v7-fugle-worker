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
| FX / USD/TWD / DXY | Public/global sources to be selected | SOURCE_NEEDED | timezone and market-close alignment | global/macro |
| US/global indexes | Public/global sources to be selected | SOURCE_NEEDED | Taiwan decision-clock alignment | global regime |
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
