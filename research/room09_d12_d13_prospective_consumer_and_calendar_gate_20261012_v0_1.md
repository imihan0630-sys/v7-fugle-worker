# Room 09 D12/D13 — prospective consumer, archive-readback and eligible-session audit (2026-10-12)

Research-only evidence; outcomes CLOSED; no Formal/Production changes. Base main `af90a3cb0d3d77b626674a7edccab7ee10d50ecd`. Observed at 2026-10-12 05:15 Asia/Taipei. This is **static source-contract research**, not a production end-to-end result or a clean prospective market date.

## Exact continuation, not repeated work
The latest canonical D12 checkpoint ends at DR-111 (official Delta endpoint-version divergence; common-support/model-input clocks pending); D13 ends at MC-211 (H.15/H.4.1 endpoint/availability identity; realization receipts pending). The 2026-10-11 Room09 local work identified a VIX trading-calendar gap and a two-layer source validation concern; this note advances the **consumer boundary**, **archive proof boundary** and **first-eligible-session boundary** without claiming previously blocked prospective source data.

## Evidence inspected on exact main
- `research/d12_05_taiwan_vix_receipt_v0_1.mjs` blob `e4a3ca5f0a2c4aebdb26ad1f6e55134c5b7ce8a2`.
- `research/global_market_receipt_guard_v0_1.mjs` blob `879a6d23fdec00c62f146919ba9cd8de15323e07`.
- `research/source_receipt_attestation_v0_1.mjs` blob `f464601f82bfd542d18beea618e612c09a04be4f`.
- `research/test_source_receipt_attestation_v0_1.mjs` and `research/test_d12_05_taiwan_vix_receipt_v0_1.mjs`.
- `research/global_market_source_attestation_audit_20261002.json` explicitly records `liveIntegratedRuntime: NOT_INTEGRATED` and zero strict raw-response-attested legacy dates.
- Default-branch code search for `auditSourceAttestation` returned only its implementation and test module; search for `buildTaiwanVixReceipt` returned implementation and test module. **Search-index coverage is not proof of exhaustive absence of runtime callers.** Full production/deploy artifact call graph remains UNKNOWN.

## DR-112: source clean-flag is not strict clean-prospective evidence
`buildTaiwanVixReceipt` constructs a `pointInTimeEligible: true` receipt for `VIX_VALID_OFFICIAL`, and `sealGlobalMarketReceipt` can return `validation.cleanCoverageEligible: true` without `sourceEvidence` or `rawBody`. The separate `auditSourceAttestation` rejects legacy receipts without source evidence. This is an intentional two-layer design **unless** a consumer mistakenly treats the lower-layer clean flag as sufficient for strict prospective inclusion.

- Supporting mechanism: separate functions/flags and existing test expectations show the boundary is real.
- Falsification: all downstream consumers might enforce both checks before counting a clean date; then no actual contamination.
- Alternative: `cleanCoverageEligible` is intentionally schema/clock-only, not a strict attestation signal.
- Failure condition: consumer readback demonstrates strict attestation always runs, and no lower-layer flag alone is used for strict denominators.
- Required next proof: enumerate actual consuming code paths, query interfaces, job/workflow entry points, and stored strict clean-date denominator; assert `strictClean = guardClean && attestationClean && officialCalendarValid && archiveReadbackValid`.

## DR-113: archive-ref declaration is not independent archive verification
The strict attestor checks `rawArchiveState === IMMUTABLE_RAW_REPLAY_VERIFIED`, nonempty `rawArchiveRef`, and hashes the supplied `rawBody` against a supplied hash/length. It does **not** itself open `rawArchiveRef`, compare independently retrieved archived bytes, prove archival immutability, or authenticate a remote provider's identity. Existing test fixtures supply the state/ref declaratively.

- Supporting mechanism: function body has no archive-readback operation or provider signature validation.
- Falsification: an upstream authorized archival service may already independently certify these claims; this function can be a pure validator of such evidence.
- Alternative: storage verification belongs to a separate service, not this function.
- Failure condition: independently recorded archive readback, immutable storage controls, authorized source transport and binding to the exact receipt are proven.
- Next proof: archive write receipt + independently retrieved raw bytes + SHA-256 match + storage identity + provider/entitlement evidence. Self-asserted fields are not a strict clean-date observation.

## MC-212: first-eligible timestamp does not itself prove a Taiwan trading session
`validateGlobalMarketReceipt` and `auditSourceAttestation` check time ordering but do not resolve `firstEligibleTaiwanDecision` through an official Taiwan trading calendar. `buildTaiwanVixReceipt` defaults to `sourceSessionDate T18:10`. Thus a structurally well-formed 18:10 timestamp on a holiday can pass time-order checks if the other declared fields are consistent. The documented 2026-10-09 Taiwan holiday is a concrete calendar fixture, **not** a claim of a real receipt or production failure.

- Supporting mechanism: no calendar lookup appears in these inspected functions; existing D13 H.4.1 schedule receipt had a 2026-10-09 first-eligible candidate requiring correction to 2026-10-12.
- Falsification: an upstream/downstream official-calendar gate may correct eligibility before any strict join.
- Alternative: `firstEligibleTaiwanDecision` is only a tentative calendar timestamp; its name currently invites stronger interpretation.
- Failure condition: a documented consuming path enforces official trading-day, decision-session and holiday rules for the actual instrument/market.
- Next proof: official-calendar-bound `nextEligibleDecision` with holiday, weekend, exceptional sessions, source release, capture and first-known clocks; retain the original receipt immutably and append correction evidence.

## MC-213: cross-market transmission controls must not become duplicate evidence votes
Global VIX, US equity/futures, Japan/Korea equity/futures, FX, oil and macro releases have different event clocks and overlapping global-risk information roots. A higher source quality gate is a **data-quality prerequisite**, not an independent alpha factor. D12 option-chain Delta/IV/skew and D13 VIX/global-risk inputs must be deduplicated by ancestry and timestamp. A known 2026-10-12 Japan holiday derivative session cannot be inferred from Japan cash close; Korea and FX/oil source clocks require their own authorized evidence.

- Supporting mechanism: same-parent and cross-market overlap are structural.
- Counterexample: after conditioning on existing Taiwan and global-risk features, no independent residual predictive power may remain.
- Alternatives: common USD/rates/news shocks, bid/ask spread, stale quotes, holiday liquidity, settlement/contract-roll differences.
- Failure conditions: no source-attested independent prospective dates, no out-of-sample or walk-forward evidence, insufficient common support, inflated multiple-testing family, costs exceed effect, or regime instability.
- Strict PIT: event time <= response completion <= captured/known <= decision; reference/effective date is not publication time. Use actual native source proof where available, otherwise UNKNOWN.
- OOS, walk-forward, selection bias, look-ahead, data mining, multiple tests, overfit, factor redundancy, cost and regime dependence: NOT VALIDATED; do not turn static checks into empirical evidence.

## Research disposition
D12 = L2 / 40.0%, D13 = 18 L2 + 1 L3 / 41.1%, all-module tracker aggregate = 47.9%, all unchanged as of main tracker 2026-10-12 02:11 Asia/Taipei. Strict clean new dates = 0. No historical Shadow reconstruction. Missing evidence = UNKNOWN, never 0/BAD. `FORMAL_OPTIMIZATION_CANDIDATE = NONE`. Formal Core LOCKED.

Exact next: (1) identify strict attestation consumer and independently verifiable raw archive readback; (2) test first-eligible session on official calendar and protect against holiday/default timestamp; (3) only after 2026-10-12 official market data exists, attempt same-effective-date common-contract Delta comparison with honest capture clocks; (4) capture genuine H.4.1 realization/source-vintage, not retroactive 18:10 availability; (5) continue independent US/Japan/Korea/FX/oil control clocks and deduplicated prospective study. No Formal/runtime changes.
