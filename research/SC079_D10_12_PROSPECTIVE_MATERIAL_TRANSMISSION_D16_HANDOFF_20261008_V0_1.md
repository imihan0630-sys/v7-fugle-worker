# SC-079 — D10-12 Prospective Material-Transmission D16 Handoff V0.1

Status: RESEARCH_ONLY / OUTCOME_BLIND_D16_HANDOFF / TWO_PROSPECTIVE_EVENT_VINTAGES / ONE_D5_WINDOW_MATURED_NOT_OPENED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-12
Date: 2026-10-08 Asia/Taipei
Observed main before write: 59d68be8f1b13ab0b37ac76121a5dcde7d6c50d3

## Purpose

Freeze the validation design before any prospective price outcome is opened.

Parents:
- research/sc027_first_material_transmission_receipt_20260930_v0_1.json
- research/sc028_material_transmission_lag_prereg_v0_1.json
- research/sc036_steel_asymmetric_transmission_two_vintage_v0_1.json

## Prospective event vintages

### Event E1
- source month: 2026-08;
- research knownAt/capturedAt: 2026-09-30T05:43:00+08:00;
- route anchor: 2006 東和鋼鐵 / EAF / high direct scrap relevance;
- input/intermediate/downstream vector: SCRAP_UP / BILLET_DOWN / H_BEAM_FLAT;
- economic sign: UNRESOLVED;
- stock outcomes: never opened by Room07.

### Event E2
- source month: 2026-09;
- research knownAt/capturedAt: 2026-10-02T16:23:00+08:00;
- same route anchor and source family;
- vector: SCRAP_UP / BILLET_UP / H_BEAM_FLAT;
- downstream-sticky state observed;
- stock outcomes: never opened by Room07.

These are two event vintages but one chain/source family. They are not two independent industries and must not be treated as IID rows.

## Frozen sample unit

Primary independent unit:
`MATERIAL_EVENT_VINTAGE`, not issuer×horizon row.

Repeated horizons, issuer controls and later accounting observations from the same material vintage inherit the same event root.

Permanent rule:
`MULTIPLE_HORIZONS_FROM_ONE_EVENT != MULTIPLE_INDEPENDENT_EVENTS`.

## Exposure contrast

Primary exposed route:
- 2006 東和鋼鐵 / EAF / issuer disclosure supports high scrap route relevance.

Different-route control:
- 2002 中國鋼鐵 / BF-BOF primary route with secondary converter scrap.

Important:
`DIFFERENT_ROUTE != ZERO_EXPOSURE`.

No zero-exposure control is claimed.

## Frozen outcomes and hierarchy

Structural/economic outcomes:
1. output-price pass-through state at lag 0/1/2 months;
2. first compatible issuer-reported realized selling-price/product-mix state after event knownAt;
3. first compatible realized margin-direction state after event knownAt;
4. second compatible issuer-report state for persistence/reversal.

Market outcomes are secondary:
- D5, D20, D60 Taiwan trading-session price-path endpoints as preregistered in SC-028.

Stock outcomes cannot rescue a failed or unsupported economic-transmission claim.

## Maturity clock as of 2026-10-08 00:xx Asia/Taipei

E1 was frozen before the 2026-09-30 Taiwan session. Under the already-frozen trading-session endpoint family, the D5 market window has now elapsed by the 2026-10-07 close. The D5 value itself is NOT read or recorded here.

E1 D20/D60 are not mature.

E2 was captured after the 2026-10-02 close. Its first eligible post-capture session is later than E1; as of the 2026-10-07 close its D5 window is not yet mature.

Therefore:
- matured prospective market-outcome cells available in principle: E1/D5 only;
- outcomes opened by Room07: 0;
- independent event N with matured D5: 1;
- total prospective event vintages frozen: 2.

## D16 method requirements before outcome access

D16 must freeze a method receipt before any D5 value is read.

Required method properties:
- dependence unit = material-event vintage;
- no pooled-row IID assumption;
- common-support route/exposure fields frozen before outcome;
- market/sector state frozen from pre-outcome evidence only;
- issuer-route mapping may not be revised after outcome;
- missing inventory/energy/mix/pass-through state remains UNKNOWN;
- leave-one-event diagnostics once event N permits;
- no lag or horizon reselection after outcomes;
- transaction-cost sensitivity if a tradable stock claim is ever tested;
- multiplicity family includes D5/D20/D60 and economic endpoints;
- report POWER_INSUFFICIENT rather than alter thresholds when N is too small.

## Current validation readiness

Source/PIT readiness: READY_BOUNDED.
Outcome-clock preregistration: READY.
Dependence-unit definition: READY.
Different-route control: READY_BOUNDED.
Prospective event N: 2.
Matured independent D5 event N: 1.
Statistical/economic inference readiness: POWER_INSUFFICIENT.

No L4 promotion is authorized from one matured D5 event.

## Exact next

1. Room11/D16 freezes the event-level method receipt before outcome access.
2. Preserve E1/D5 unopened until that method receipt exists.
3. Let E2 D5 mature naturally; do not accelerate or backfill.
4. Accumulate additional independent material-event vintages/chains.
5. Only after adequate event N/common support may outcomes be attached and L4 reconsidered.

Formal Core unchanged.
