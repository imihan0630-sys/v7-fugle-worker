# D02 PVE-277 — Wave-2 baseline dependency and legacy-bypass audit

Date: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / DEPENDENCY_MATRIX_FROZEN / LEGACY_BYPASS_REPRODUCED / NO_MATURITY_CHANGE

PVE-277 does not assume all Wave-2 features share H001's defect. It traces feature lineage and separates direct historical-baseline dependence, raw continuity dependence, and comparator-control dependence.

Ten Wave-2 lane/family fixtures pass the legacy D02_L4_WAVE2_ADMISSION_V0_1 without an immutable baseline freshness or continuity receipt. That is expected from the old contract but is no longer sufficient after PVE-260~276.

Key classification:
- D02-04, D02-05, D02-09 PARTICIPATION_TRAJECTORY, D02-10: direct intraday baseline/participation lineage dependence.
- D02-11: rolling prior-20-session history freshness dependence.
- D02-07 and D02-09 PIVOT_SIGNED_VOLUME: exact daily continuity dependence, not same-slot median freshness.
- D02-08: primary provider-pressure feature is baseline-independent, but its registered incremental comparator uses RVOL/response controls.
- D02-12 TIME_OF_DAY_VOLUME_CURVE: historical prior-session denominator plus RVOL/cumulative controls.
- D02-12 PRICE_BY_VOLUME_PROFILE: prospective primary profile, baseline-dependent controls.

The next guard must respect these distinctions rather than copy one generic H001 check across all modules.

No outcome inspection, no maturity promotion and no Formal Core change.
