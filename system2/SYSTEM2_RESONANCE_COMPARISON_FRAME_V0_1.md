# S2-12 immutable common-input comparison core V0.1

Classification: Class A / System2 research only. Repository implementation, not a live comparison deployment.

## Implemented portion

`resonance_comparison_frame_v0_1.mjs` seals one symbol/clock from an existing active bounded pool (maximum 9). Pool membership and capacity identities, provider receipt/history/quote hashes, adjustment/price-space semantics, observation availability, normalized daily OHLCV and lifecycle/finality inputs form one immutable frame. It computes the unchanged user-video Baseline through the existing monitor; it does not introduce another formula or combine signal conditions.

Frame identity is pool + symbol + market date + observation clock. Identical repeated capture is idempotent; changed input/source content at the same identity conflicts. Caller outcome fields are excluded from monitor inputs. No network request or discovery of additional symbols occurs.

Absent Challenger registration produces `CHALLENGER_NOT_PREREGISTERED`, with no Challenger observation or outcome. A supplied preregistration must bind a formula version, parameter hash, governance reference and registration/availability timestamps before the frame. These are input validation fields, not an owner-approval mechanism or independent authentication of the supplied governance reference. No real Challenger registry entry, formula, indicator, lookback, threshold or weight is authored by this increment. Test registry entries are explicitly synthetic transport fixtures.

Future supplied Challenger observations must reference the identical frame hash, registration hash, formula version and parameter hash. A CONFIRMED claim cannot precede the common source finality. The result `SHARED_INPUT_BINDING_VERIFIED` verifies transport binding only; it does not verify that a Challenger implementation actually used those inputs. `challengerFormulaExecutionVerified`, `countsTowardPromotionEvidence` and `outcomeEvaluationReady` remain false. Unknown cost/regime remains explicit UNKNOWN; supplied cost/regime is labeled SUPPLIED_UNVALIDATED. No cost assumptions, regime labels, returns, MFE/MAE or comparative performance are invented.

## Immutable storage

Optional isolated persistence uses existing `s2_infrastructure_checks` and the existing immutable executor, then exact readback. No schema migration is introduced. Registration records are immutable by formula version, so changing parameters/registration within an existing version conflicts even across observation dates. Frames and pair records use independent content hashes. Payloads over the established 750 KB diagnostic limit are rejected.

This core is not imported by the live Worker or daily source writer. It does not alter Baseline, pool membership, System1, Cron, push, capital, orders or selection authority. Physical paired capture and a public comparison API remain NOT DEPLOYED. No actual paired sample is claimed.

## Validation and continuation

Targeted tests cover exact Baseline constants, equivalent clocks, outcome exclusion, pool membership/count, future-known inputs, pre-close finality, after-observation registration, hash/version mismatches, changed immutable frames, version reuse, identical reruns and lost readback. System2 Research CI and V8 Regression remain required before merge.

Next units: reviewed real Challenger preregistration and implementation; adapter from the same verified bounded source/session cache; hash-bound execution receipt; isolated paired capture/read API; separate outcome maturity/cost/regime evidence. These are still pending. This technical contract never grants Challenger selection, Baseline veto or promotion authority.


## 2026-10-02 S2-12 repository core acceptance VERIFIED

PR #313 merged `22baa1dbe0ad45da99072c784e524994f45f693c`. Final PR head `3181c43652de9c060866db7e7311c6f31ef195ae`: System2 Research CI 36985165883 and V8 Regression 36985165926 PASS. Main System2 Research CI 36985338857 PASS. Common input/version/PIT/finality gates and immutable mock persistence/readback are repository-verified. Evidence: `system2/evidence/resonance_comparison_core_acceptance_20261002.json`.

This is a technical comparison kernel, not deployed paired capture: no real Challenger formula/parameters/preregistration, no verified Challenger execution, no physical comparison persistence and zero actual paired samples. Baseline and System1 unchanged; all authorities and promotion evidence flags remain false. Continue with a reviewed real Challenger contract/implementation and same-cache capture adapter before physical paired persistence; do not relabel synthetic transport fixtures as research results. S2-07 current-source/assessor/continuity gates remain separate. The 19:00 audit has not yet occurred at this acceptance.


## Upstream denominator provenance

The common-input frame must preserve the bounded pool's upstream capacity denominator provenance:
- source capacity run ID/hash;
- denominator state `COMPLETE / PARTIAL / UNKNOWN`;
- denominator provenance hash when available;
- contributing Shadow run/accounting identities carried by the pool provenance.

This makes COMPLETE-vs-PARTIAL selection coverage visible to later comparison/performance/promotion evidence. A legacy pool/capacity path without the V0.2 payload remains `UNKNOWN / LEGACY_PROVENANCE_INCOMPLETE`; absence is never interpreted as COMPLETE.

This provenance is contextual evidence only. It does not itself change the unchanged Baseline formula, monitoring eligibility, strategy thresholds, or promotion authority.
