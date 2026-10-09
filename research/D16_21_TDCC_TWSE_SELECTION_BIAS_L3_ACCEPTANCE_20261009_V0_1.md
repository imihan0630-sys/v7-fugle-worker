# D16-21 TDCC × TWSE Selection-Bias Pipeline L3 Acceptance — 2026-10-09 V0.1

Updated: 2026-10-09 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / TWSE_BOUNDED_SUBLANE
Owner room: 11｜統計驗證與策略市場狀態研究室
Module: D16-21
Formal Core impact: NONE

## Scope

D16-21 advances from L2/40 to L3/60 for one bounded capability:

`TWSE_CURRENT_PROSPECTIVE_TDCC_SELECTION_BIAS_AUDIT`.

The accepted object demonstrates that a real Taiwan alternative-data source can be:
- captured prospectively;
- entity-linked to an explicit official target universe;
- audited for target coverage and non-target extra population;
- replayed with source hashes;
- kept outcome-blind;
- fail-closed on missingness.

It does not claim:
- TDCC predictive Alpha;
- whole-Taiwan coverage;
- TPEx parity;
- investor identity;
- passive/active ownership identity;
- historical target-universe backfill.

## Real source pair

Target universe:
- TWSE OpenAPI current listed-company basic data;
- sourceId: `TWSE_OPENAPI_T187AP03_L`;
- scope: current TWSE four-digit ordinary company registry at capture.

Alternative data:
- Taiwan Depository & Clearing Corporation;
- endpoint: `https://opendata.tdcc.com.tw/getOD.ashx?id=1-5`;
- semantics: weekly shareholding-distribution stock;
- grade 17 used only as the complete-security-presence indicator in this audit.

Entity linkage:
`EXACT_SECURITY_CODE`.

No fuzzy issuer matching is used.

## Physical prospective capture

Workflow:
`Research D16 TDCC TWSE Selection Audit L3 Readonly`.

Exact head:
`bbec1d5ed3cd0e87813b34d47f47668bcf5dc586`.

Run:
`37885609409` — SUCCESS.

Capture:
`2026-10-09T04:48:48.414Z`.

TDCC source date:
`2026-10-08`.

Target TWSE ordinary universe:
- targetN = 1089.

TDCC coverage of that target:
- knownN = 1089;
- missingN = 0;
- targetCoverage = 1.0.

TDCC four-digit securities outside the TWSE target population:
- extraTdccOrdinaryN = 1874.

This extra population is material evidence that the TDCC source population and the target TWSE ordinary-equity population are not aliases.

Source identities:
- TWSE raw hash: `ea39c46335ac3de8158dadba6e8920dda9f60d8e19899663ccde7b25415cf134`;
- TDCC raw hash: `4fcc6cab6365c78d4938f2dc7e260578ac9d8ba32a63bf4a4c406444d46f86e4`.

Receipt:
`d6d1f589bfb17e221e874cd2a8a7cb788d9d12f1aee7a1cf68e51e7f8cb48447`.

Artifact:
- id: `11596412242`;
- digest: `sha256:2fa629f484f7eb5eb27a39407bad5ed3bcd4b7b6c80ab1c8637f5b59e7ff50e2`.

## Executable implementation

- `research/d16_21_tdcc_twse_selection_audit_l3_v0_1.mjs`;
- `tests/test_d16_21_tdcc_twse_selection_audit_l3_v0_1.mjs`.

Dedicated falsification suite:
13/13 PASS.

Same-head V8 Regression:
run `37885609413` — SUCCESS.

## Selection-bias firewall

Every current TWSE target row receives:
- KNOWN; or
- MISSING.

Silent dropping is forbidden.

Missing rows are never imputed as zero or as a neutral alternative-data state.

The receipt separately preserves:
- target coverage;
- missing symbols;
- industry-level target/known/missing coverage;
- TDCC ordinary securities outside the TWSE target population.

Therefore:
`TDCC_FOUR_DIGIT_SECURITY != TWSE_CURRENT_ORDINARY_EQUITY`.

## PIT / source-vintage firewall

The current prospective target population is frozen at the capture clock.

The TDCC weekly source date is preserved separately from capture/first-known.

This current TWSE universe is NOT used to reconstruct:
- 2026-09-24;
- 2026-10-02;
- any historical target universe.

Existing D06 evidence for 2026-09-24 -> 2026-10-02 entry/exit remains a separate vendor-panel drift diagnostic:
- common = 4056;
- added = 22;
- removed = 12.

Those historical entry/exit facts do not license current-universe historical backfill.

## Semantic boundaries

TDCC is slow weekly ownership distribution:
- stock, not flow;
- holder identity is UNKNOWN;
- passive share is UNKNOWN;
- weekly reuse does not create multiple independent observations.

This L3 acceptance is for:
`alternative-data provenance + entity linkage + coverage + entry/exit/vendor-selection diagnostics`.

It is not an ownership-direction or investor-intent finding.

D06 remains owner of chip/ownership economics.

## Why not L4

No predictive outcome has been joined.

L4 would require:
- prospective repeated source vintages;
- target-universe coverage tracked through time;
- explicit entry/exit / source-schema drift;
- outcome-independent population retention;
- multiple independent weekly vintages;
- a preregistered alternative-data estimand;
- controls for price/volume/liquidity/ownership-family overlap;
- no selective retention of symbols with known alternative data;
- TPEx expansion only after a separate official target-universe contract.

## Maturity decision

D16-21:
L2/40 -> L3/60.

Interpretation:
a real Taiwan alternative-data selection-bias audit pipeline is executable and physically validated for the bounded TWSE current-universe sublane.

Not implied:
- predictive Alpha;
- whole-market Taiwan parity;
- D06 duplication;
- Formal selection authority.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core remains LOCKED.

## Exact next

1. Preserve the current physical receipt as the first prospective coverage cut.
2. Re-run only on future independently captured TDCC vintages; do not multiply one weekly vintage by daily scans.
3. Track target-universe entry/exit and TDCC schema/source drift prospectively.
4. Add TPEx only under its own official target-universe receipt.
5. Before any L4 outcome study, freeze one non-duplicative alternative-data estimand and common-support population.
