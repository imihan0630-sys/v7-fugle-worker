# D16 / D18 paired evidence eligibility

Status: RESEARCH_ONLY. Formal Core: LOCKED.

Hypothesis: even PIT-safe regime labels cannot establish policy value if static and conditioned strategy arms use different decision-date evidence populations.

Support: regime-correlated missingness can bias conditional return comparisons.

Falsification: freeze a shared ex-ante opportunity manifest, compare both arms on identical complete evidence, preserve missingness and independently matured outcomes by date and regime episode.

Alternative explanations: liquidity, market identity, listing age, source vintage, factor redundancy and execution costs.

Failure: future-dated regime input, unmatched decision hashes, absent W1 strategy evidence, unknown fills, or incomplete outcome provenance.

N0 = all eligible decision opportunities; Nw0 = continuity-ready; Nw1 = complete strategy evidence; Neval = evaluated; Nout = matured outcome. UNKNOWN is never zero or BAD.

Exact next: re-read main, verify correction queue 009-015, then assess coherent physical receipts before any promotion. No strategy changes or historical Shadow fabrication.

## Distinct estimands and a synthetic counterexample

Conditional estimand: paired net strategy difference only where both arms have a valid same-date W1 strategy-executable witness and matured outcome, with the same cost model. Full-opportunity estimand: effect over frozen N0, including real abstention and opportunity cost. When blocked outcomes are unobserved, the latter is not point-identified: report UNKNOWN or pre-registered bounds, never substitute zero.

Hypothetical illustration, NOT Taiwan data and NOT Shadow: two regimes each have 100 opportunities; strong has 90 W1, weak has 30 W1. Every observed W1 result is +1. The 70 missing weak outcomes could be -1 (weak full mean -0.4) or +2 (weak full mean +1.7). The observed conditional means remain +1, while full-regime ordering reverses. Thus a significant conditional result alone cannot prove a regime switching policy.

## Frozen adversarial acceptance family

PA-T01 common cutoff, same immutable decision manifest: conditional comparison may be computed.
PA-T02 continuity W0 without explicit complete strategy inputs: never W1.
PA-T03 INVALIDATED with missing required evidence: never W1.
PA-T04 foreign strategy or mismatched decision/source hash: outcome join blocked.
PA-T05 future-dated optional regime component: dimension UNKNOWN, no vector-wide PIT override.
PA-T06 UNKNOWN converted to zero or BAD: reject.
PA-T07 cost or outcome provenance rewritten in place: reject; require a versioned outcome.
PA-T08 all-null entry window: DATA_UNKNOWN, not proven NO_FILL.
PA-T09 reversed or unofficial session dates: reject.
PA-T10 forged complete checkpoint with no date manifest: reject.
PA-T11 static and conditioned arms have different W1 support: unpaired date excluded from conditional estimand but retained in N0 coverage accounting.
PA-T12 evaluated complete W1 zero-pick: valid only with coherent immutable evidence and no hidden fallback.
PA-T13 POLICY_DISABLED: distinguish from NATURAL_ZERO_PICK.
PA-T14 one market-state episode drives apparent gain: block multi-episode promotion.
PA-T15 missing outcomes: no unconditional point estimate without identified missingness mechanism or bounded assumptions.
PA-T16 reordering immutable receipt rows: canonical paired hash remains stable.
PA-T17 source session date or universe mismatch: reject even if summary says COMPLETE.
PA-T18 price-space or corporate-action version mismatch: reject paired outcome comparison.

## Independent corrections and status

Independent audit observed CORR-009 through CORR-015. As read on main 2026-10-08, CORR-009 is FIX_IMPLEMENTED pending independent verification, while CORR-010/011/012/013/014/015 are not verified closed. Implementation stays BUILD_LANE; audit closure stays AUDIT_LANE. This research file does not claim those fixes or any live impact.

For promotion require immutable factor and optional regime dimension PIT, exact strategy/decision/source/fingerprint lineage, source-continuity completeness, strictly increasing official sessions, immutable outcome/cost vintage, common support, date/episode dependence control, untouched prospective results and static/exposure-matched baseline. The test family is frozen before outcome access; no post-hoc threshold or taxonomy selection.

No maturity upgrade. FORMAL_OPTIMIZATION_CANDIDATE = NONE.
