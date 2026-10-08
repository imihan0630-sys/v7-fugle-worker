# D02 PVE-278 — Wave-2 dependency-specific anti-bypass firewall

Date: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / DEPENDENCY_SPECIFIC_FIREWALL_FROZEN / NO_MATURITY_CHANGE

PVE-278 converts the PVE-277 dependency matrix into a fail-closed pre-outcome gate without pretending all Wave-2 features use the same baseline.

Rules:
- D02-04: clean same-slot volume baseline.
- D02-05: clean same-slot volume and range baselines.
- D02-07: immutable daily-volume continuity receipt.
- D02-08: provider-pressure primary remains baseline-independent; its registered incremental comparison requires fresh RVOL/cumulative/response controls.
- D02-09 PIVOT_SIGNED_VOLUME: daily continuity receipt.
- D02-09 PARTICIPATION_TRAJECTORY: declared participation lineage plus slot/cumulative/persistence evidence as actually used.
- D02-10: declared participation feature type with matching freshness/prefix/adjacency evidence.
- D02-11: exact prior-20 eligible-session rolling baseline freshness.
- D02-12 TIME_OF_DAY_VOLUME_CURVE: historical denominator freshness plus fresh RVOL/cumulative controls.
- D02-12 PRICE_BY_VOLUME_PROFILE: prospective primary profile remains independent; incremental comparison controls must be fresh.

This is a research-admission firewall only. It does not inspect outcomes, authorize L4, or change Formal Core.
