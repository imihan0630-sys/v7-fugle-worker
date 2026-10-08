# BR-048 — Delta AI Data-Center Effective-Dated Exposure Vintages V0.1

Status: RESEARCH_ONLY / EFFECTIVE_DATED_THEME_EXPOSURE_VINTAGES / SOURCE_CLOCK_PRECISION_PRESERVED / REVENUE_MAGNITUDE_UNKNOWN / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-11
Date: 2026-10-08 Asia/Taipei
Observed main before write: 441021801276e2359dcf473a4fd14ba92cf137d4

## Purpose

Move D09-11 from static current theme membership toward append-only effective-dated exposure states without backfilling later capabilities into earlier dates.

Issuer: Delta Electronics 2308.
Formal TWSE industry at current capture: Electronic Parts/Components.
Theme: AI_DATA_CENTER_INFRASTRUCTURE.

## Exposure vintage V1 — shipping liquid-cooling product

Source-published date: 2026-03-24.
Observed state:
- GoCool 3MW liquid-to-liquid CDU officially shipping;
- issuer describes the product as supporting next-generation AI data centers and high-density AI/HPC workloads.

Exposure state:
PRODUCT_SHIPPING / LIQUID_COOLING / AI_DATA_CENTER.

Revenue magnitude: UNKNOWN.

## Exposure vintage V2 — integrated modular data-center solution

Source-published date: 2026-06-05.
Observed state:
- prefabricated AI Modular Data Center solution launched at COMPUTEX 2026;
- solution integrates high-voltage DC power, liquid cooling and modular data-center infrastructure;
- product scope expands beyond one cooling component into a system-level AI data-center solution.

Exposure state:
SYSTEM_SOLUTION_LAUNCHED / MODULAR_AI_DATA_CENTER / POWER_PLUS_COOLING.

Revenue magnitude: UNKNOWN.

## Exposure vintage V3 — power-infrastructure collaboration

Source publication granularity available in the current official brand source: 2026/10 month-level only.
Observed state:
- Delta and X LABS formalized an MOU;
- collaboration targets an initial 100MW deployment of Delta solid-state-transformer technology for AI data-center projects;
- later path may scale beyond the initial deployment.

Clock state:
sourcePublishedAtExactDay = UNKNOWN;
sourcePublishedMonth = 2026-10;
capturedAt = 2026-10-08;
effectiveDeploymentAt = UNKNOWN.

Exposure state:
MOU_PRE_DEPLOYMENT / AI_DATA_CENTER_POWER_INFRASTRUCTURE / 100MW_TARGET.

Revenue magnitude: UNKNOWN.

## Append-only semantics

V1 is not overwritten by V2 or V3.
V2 adds system-level scope after V1.
V3 adds a collaboration/deployment-plan state but is not treated as deployed revenue or installed capacity.

Permanent rules:
- LATER_CAPABILITY != EARLIER_KNOWN_EXPOSURE;
- PRODUCT_SHIPPING != SYSTEM_SOLUTION_DEPLOYED;
- MOU != REALIZED_DEPLOYMENT;
- DEPLOYMENT_TARGET != REVENUE;
- MONTH_LEVEL_SOURCE_CLOCK != EXACT_DAY_CLOCK.

## Research conclusion

Theme exposure is a versioned vector rather than a timeless binary flag.

For Delta AI-data-center exposure, observable public state evolved from:
shipping cooling product -> integrated modular system offering -> power-infrastructure collaboration target.

This validates effective-dated theme/exposure state transitions while preserving unknown revenue magnitude.

## Maturity

D09-11 remains L3 / 60%.

Progress achieved:
- static theme bridge now has one issuer with multiple dated exposure vintages;
- source-clock precision is explicit;
- no indefinite backfill of future capabilities.

L4 remains blocked by multiple independent issuers/dates, prospective OOS use, removal/expiry examples, exposure-magnitude evidence where available, and D16 validation.

## Exact next

BR-049V: add one issuer/theme exposure reduction, cancellation, supersession or expiry control so effective-dated membership supports both entry and exit rather than only accumulating positive edges.

Formal Core unchanged.
