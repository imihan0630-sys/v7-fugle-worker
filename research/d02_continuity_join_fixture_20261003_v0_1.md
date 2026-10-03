# D02 continuity join fixture V0.1
Updated: 2026-10-03 Asia/Taipei
Status: PRE_PVE_240_OUTCOME_BLIND_FIXTURE
PVE cursor: 239
Formal Core: LOCKED

Research-only deterministic validation of the frozen D02 continuity contract.

F01 clean owner receipts: PASS.
F02 missing corporate-action receipt: UNKNOWN_BLOCKED; never infer NO_EVENT.
F03 late-known correction: preserve original observation; append a new version only after correction knownAt.
F04 verified suspension: exclude from expected symbol sessions; never synthesize zero volume.
F05 expected session missing source: UNKNOWN_BLOCKED; never substitute an older row to restore count 20.
F06 valid confirmed price pivot with unresolved volume continuity: price fact remains valid, D02 price-volume divergence is UNKNOWN_BLOCKED.
F07 supply change without stable denominator: RAW_ACTIVITY may remain factual; COMPARABLE_PARTICIPATION stays gated.
F08 verified PIT unit-scale bridge: bridge lane may pass only with deterministic transformed comparable-session set persisted.
F09 conflicting owner versions without decision-time supersession: UNKNOWN_BLOCKED.
F10 comparable-session hash changes without explicit source/owner revision: REPLAY_INTEGRITY_FAIL / UNKNOWN_BLOCKED.

All classifications are determined before future outcomes. This fixture validates research-level join semantics only. It does not prove runtime wiring, full dual-exchange coverage, prospective immutable collection, OOS, walk-forward, or economic value.

No maturity promotion. D02 aggregate remains 48.3%. D02-07 and D02-09 remain L2/40. PVE cursor remains 239. No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core remains LOCKED.

Exact continuation: PVE-240 on the first genuine completed post-repair market session, Gate 0-6 before outcomes, Gate 7 closed. If market evidence is unavailable, continue Pre-PVE-240 with owner-version supersession, comparable-session hash determinism, and source/owner conflict-precedence replay integrity. No production wiring.
