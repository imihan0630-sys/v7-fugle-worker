# D03 External Machine Delta Readback V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Scope: incremental readback only after TI-1134
Status: RESEARCH_ONLY / EXTERNAL_MACHINE_DELTA_ACCEPTED_PARTIALLY / OUTCOMES_CLOSED
Formal Core: LOCKED
Tickets: SDA-001 / SDA-004

## Purpose

Perform the exact continuation required by the D03 tracker:
re-read concrete external machine evidence and accept only the deltas that genuinely close a previously identified D03 dependency.

This tranche does not add a new technical-indicator theory family.

## TI-1135 — System2 CORR-20261006-004 is a real D03 timing-consumer delta

Canonical independent verification:
`system2/evidence/s2_corr_20261006_004_independent_verification.json`.

Verified closure:
`VERIFIED_CLOSED`.

Implementation merge:
`b18457b4de892ed3beb8502155adfdee1a038ca4`.

Independent verification records:
- current-session resonance bound to current Asia/Taipei marketDate;
- previous-session fallback blocked from current terminal surfaces;
- explicit historical-date query preserved;
- latest-any-date mode remains available but visibly marked;
- session-date mismatch fails closed;
- decision/chart session provenance visible;
- same-session resonance remains functional;
- protected authorities unchanged.

This is not a design promise. It has physical CI/deploy evidence.

## TI-1136 — physical execution evidence is accepted

The independent receipt records PASS for:
- System2 Research CI run 37472705542;
- V8 Regression Tests run 37472705541;
- merged-main System2 Research CI run 37473038918;
- System2 Daily Resonance Deploy run 37473038743.

Therefore D03 accepts:
`SYSTEM2_CURRENT_SESSION_FRESHNESS_IMPLEMENTATION = PHYSICALLY_VERIFIED`.

## TI-1137 — stale prior-session contamination is closed for current terminal consumption

D03 previously required decision-time/finality-safe consumption.

The new runtime behavior now provides a concrete fail-closed rule:
- current terminal asks for explicit current marketDate;
- an absent current-date row yields an empty current result;
- it does not silently substitute yesterday;
- explicit historical queries remain separately available.

D03 disposition:
`CURRENT_SESSION_STALE_RESONANCE_CONTAMINATION = CLOSED_FOR_THIS_CONSUMER_PATH`.

## TI-1138 — latest-any-date remains legal only as historical/reference mode

The runtime intentionally preserves:
`LATEST_AVAILABLE_DATE`
for no-date historical/reference queries.

That is acceptable only because:
- explicit current-session queries do not fall back;
- latest-any-date mode is visibly marked;
- current terminal alignment rejects missing/mismatched dates.

Future consumers must not reuse latest-any-date as if it were current-session evidence.

## TI-1139 — this partially satisfies D03 temporal-noninterference semantics

The implementation materially satisfies a subset of TI-1023~1046:
- later/prior-session stored rows cannot rewrite current-session resonance state;
- market-date provenance is explicit;
- mismatched session data fail closed.

Accepted D03 timing delta:
`SYSTEM2_RESONANCE_SESSION_CLOCK = IMPLEMENTED_AND_VERIFIED`.

This is narrower than universal temporal non-interference.

## TI-1140 — D03 lineage/dedup implementation remains missing

The current System2 daily resonance runtime still does not expose:
- rawSignalCount;
- dedupedEvidenceFamilyCount;
- effectiveIndependentEvidenceCount;
- overlappingSignalIds;
- redundancyGroupContributions;
- dominantInformationRoots;
- explicit RG_D03_PRICE_TREND runtime contribution.

Therefore the prior D03 status remains:
`SEMANTIC_GUARD_PRESENT_RUNTIME_DEDUP_DIAGNOSTICS_MISSING`.

CORR-004 did not change resonance formula/state-machine or evidence counting.

## TI-1141 — SDA-001 remains open

The three current resonance conditions are still mapped by D03 to:
- PRICE_OHLC;
- RG_D03_PRICE_TREND;
- maximum one effective technical evidence unit absent residual proof.

Physical current-session freshness does not prove deduplication.

SDA-001 closure still requires machine lineage/dedup implementation + D16 residual readback + 00 closure.

## TI-1142 — SDA-004 remains open

Current Impulse MACD / EMA parameter-family governance remains research-level.

CORR-004 changed current-session data freshness only.

It did not implement:
- central alias registry;
- runtime parameter-family ledger;
- multiplicity receipt;
- D16 incremental parameter-family evidence.

Therefore SDA-004 remains REMEDIATION_IN_PROGRESS.

## TI-1143 — System1 SDA-022 5/5 is not D03 lineage evidence

Canonical System1 acceptance:
`shared-knowledge/sda022_system1_fingerprint_acceptance_20261006_v0_1.json`.

Accepted facts:
- System1 policy identity is machine-observable;
- source bindings are frozen;
- System1 does not require System2 candidates/rank;
- effective Formal ranking lineage is observable;
- no Formal mutation occurred.

But this receipt is scoped:
`SYSTEM1_POLICY_FINGERPRINT_ONLY`.

It does not implement D03-required:
- redundancyGroupContributions;
- dominantInformationRoots;
- D03 same-root effective evidence accounting.

Therefore:
`SDA022_SYSTEM1_PASS != SDA001_SDA004_SYSTEM1_DEDUP_PASS`.

## TI-1144 — D16 SDA-022 preregistration is not the D03 method receipt

D16 has valid new SDA-022 preregistration and outer-stream enrollment for:
System1 vs System2 SHORT_MOMENTUM D5 incrementality.

This is a distinct cross-system experiment.

Current D03 canonical handoff still reports:
`d16MethodReceipt = NOT_YET_RETURNED`.

Therefore D03 cannot reuse SDA-022 D16 readiness as:
- TI-005 KD-vs-RSI method receipt;
- TI-006 MACD-vs-trend method receipt;
- D03 interaction/falsification/timing receipt;
- SDA-001/004 incrementality closure.

## TI-1145 — raw/prospective gate remains unchanged

Current canonical D03/D16 handoff still reports:
- rawSourceVersionGate = 2_OF_3;
- technicalObserverR1 = BLOCKED;
- outcomes = CLOSED;
- formalOptimizationCandidate = NONE.

System2 historical-data progress is valuable to its own DATA_LANE but does not by itself satisfy the D03 observer's exact parent/continuity/source-version gate.

## TI-1146 — maturity decision

This external delta closes one concrete engineering timing risk:
`SYSTEM2_CURRENT_SESSION_STALE_RESONANCE_RISK = CLOSED`.

It does not create:
- prospective D03 Alpha evidence;
- a new independent evidence family;
- D16 D03 outcome inference;
- Bollinger/ADX promotion evidence.

Therefore:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw source gate remains 2/3;
- outcomes remain CLOSED;
- Formal Core remains LOCKED.

## Exact next continuation point

Do not create another semantic tranche without new machine evidence.

Re-read, in order:
1. System2 D03 runtime dedup diagnostics;
2. System1 D03 redundancy diagnostics;
3. D16 D03 method/incrementality receipts;
4. raw-source/prospective observer gate;
5. protected cutoff-bearing parent / PR #600 state.

If none changes, D03 remains correctly blocked at 56.7% and should not manufacture progress from additional governance.
