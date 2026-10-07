# SC-078 — D10-02 Physical-Chain PIT Feasibility Promotion V0.1

Status: RESEARCH_ONLY / L2_TO_L3_MATURITY_CORRECTION / TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / GENERIC_FIXED_LAG_NOT_VALIDATED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-02
Date: 2026-10-07 Asia/Taipei
Observed main before write: a4d46147448f546e630f64bbe2a259aaef7adc3e

## Canonical maturity test

Canonical maturity:
- L2 = mechanism + falsification;
- L3 = Taiwan PIT data source / semantics / replay feasibility;
- L4 = prospective Shadow/OOS evidence.

D10-02 does not require a universal stable positive lag relation to reach L3. A falsified or chain-specific lag hypothesis may still have L3 data maturity when the Taiwan source, timing semantics and replay contract are validated.

## Evidence sufficient for L3

1. Prefrozen hypothesis and replay semantics:
- SC-049 froze candidate lag set = 1M / 2M / 3M;
- primary comparison is direction-based;
- no post-hoc best-lag selection;
- causal claims prohibited without alternative-mechanism falsification.

2. Six-vintage Taiwan steel replay:
- SC-050 / SC-054 expanded the steel-chain replay;
- the apparent short-window 1M relation degraded as the window expanded;
- this is valid falsification evidence rather than a source failure.

3. Independent physical non-steel chain:
- SC-055 established copper foil -> copper-clad laminate -> PCB excluding IC substrate;
- official MOEA product codes are 2433020 / 2630010 / 2630040;
- primary metric remains month-over-month production direction;
- the two physical edges favor different-looking lags and no one common 1M/2M/3M lag is stable.

This falsifies a universal fixed-lag story while proving the chain is empirically replayable.

4. Deterministic native-source collector feasibility:
- official MOEA interactive source resolves exact product codes locally;
- production and inventory fields are selectable;
- displayed units are preserved: metric tons / square feet / square feet;
- 2025-01 replay matched across two fresh browser contexts;
- semantic fingerprint = 70eecad5784520d865ea42f15627fb9c4117797692f97f0d4074fc7505545232;
- raw-result hash = 0fdb61785aa18a581aa1e7eebeb97210ecef91ef2c9a6da42a76871dbc8a3c74;
- selector/product/unit drift fails closed;
- unavailable publication fields remain UNKNOWN.

GitHub-hosted CI source access remains blocked by source-side HTTP 403. This is an automation-environment transport limitation, not evidence that the official source or replay semantics are unavailable.

5. Current publication-frontier PIT semantics:
- capturedAt = 2026-10-07T19:08:55+08:00;
- latest official Industrial Production month = 2026-08;
- release-family publication = 2026-09-23 16:00 Asia/Taipei;
- exact interactive product-database update time = UNKNOWN;
- 2026-09 = SOURCE_NOT_YET_RELEASED_AT_CAPTURE.

This distinguishes what was knowable at the current research clock without fabricating September data.

## Maturity correction

Prior local gate required waiting for the first September 2026 native product-level release before L3.

That future release is a valuable next prospective sample, but it is not required by the canonical L3 definition. Current evidence already validates the Taiwan official product source, product identities and units, deterministic replay, frozen lag semantics, release/capture timing boundary, explicit missing-state semantics, and cross-chain falsification.

Decision: D10-02 L2 / 40% -> L3 / 60%.

## Interpretation

This is data-maturity promotion, not hypothesis success.

Current scientific conclusion remains:
- no universal common fixed 1M/2M/3M lag is identified;
- lag behavior appears edge/chain specific;
- inventory and common-demand confounding remain material.

L3_DATA_FEASIBLE != GENERIC_FIXED_LAG_VALIDATED.

## L4 debt

SC-067 remains the next prospective sample: capture September 2026 after official release, preserve native source/capture clocks, do not change the lag set, and append only newly enabled observations.

L4 still requires prospective/OOS evidence and D16-compatible validation.

Formal Core unchanged.
