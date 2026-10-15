# Room11 D16-20 + D18-04 prephysical falsification — 2026-10-16
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED / SYNTHETIC_FIXTURE_ONLY
Observed main: `c2ee4d9800d87a92b6a4b69101117b9a67c6748d`
Source of challenged code: previous local fallback `ROOM11_D16_D18_20261016_0022_EXECUTABLE_GATES_BACKUP.zip`; this code is NOT claimed to be merged main.
Canonical contracts: `research/D16_20_TWSE_SURVEILLANCE_CAUSAL_PANEL_L3_CONTRACT_20261009_V0_1.md`, `research/D18_U2B_ROW_AGGREGATE_RECEIPT_INTERFACE_20261008_V0_1.md`, `research/D18_U2B_IDENTITY_TRANSITION_PAIR_COMPARABILITY_CONTRACT_20261008_V0_1.md`.

## Reproduced legacy counterexamples
1. D18-04: local V0.1 accepted `U2B_READY_CLEAR_NO_ACTION` when `identityRelation=EXACT_SAME`, `pairComparabilityState=UNKNOWN`, prior security identity differed from current, and action-family adequacy was false. This is a contract-level **false ready**; a label alone does not prove same-security return or family coverage.
2. D16-20: local V0.1 interpreted string `currentlyTreated='false'` as truthy and counted it in the treated group, a **false treatment assignment** that contaminates causal denominators.
3. D16-20 V0.1 omitted frozen-oracle diagnostics `untreatedOutsideSupportN` and `standardizedCovariateDifferences`. Rectangular marginal overlap cannot establish joint positivity.

## Additive local V0.2 mitigation (not merged)
D18 requires independent identity/comparability fields, earlier exact prior session, calendar receipt hash, explicit family adequacy and source-bound continuity/suspension receipt IDs. Identity and family-adequacy evidence hashes join deterministic pair identity. Changed-code equivalence stays blocked pending independent authority. Even if the builder returns a READY fixture, `physicalEvidenceCertified=false` until independent readback.
D16 requires strict boolean treatment state, explicit same-cut untreated-pool hash, row-to-universe parent binding, treatment source-row hash and effective-session identity. Panel hash binds the new parents. Standardized covariate differences report null/UNKNOWN for zero pooled variance. `causalEstimationEligible=false` always at this stage.

## Hypothesis ledger
- Support: independent parent-binding gates reduce semantic false-ready/false-treated results.
- Falsification: both legacy counterexamples were reproduced with synthetic fixtures; prior 42 passing tests did not cover these cases.
- Alternative: genuinely certified code-change-equivalent identities or observational near-threshold designs may eventually be admissible under separately frozen authority; this round does not establish either.
- Failure conditions: forged/self-asserted upstream receipts, post-cutoff source evidence, incomplete untreated universe, weak joint support, endogeneity, unknown company-action family or suspension coverage.

## Reproducible local results
Original suites: D16 18/18 PASS; D18 24/24 PASS.
New adversarial suite: 17/17 PASS, including both legacy counterexamples.
These are test-case counts, not market dates or independent observations. Real U2B certified pairs: 0. Real causal treatment/control panels: 0. New outcome samples: 0.
Local backup contains additive V0.2 modules, adversarial tests, full report and exact continuation.
No strategy/threshold/weight/trade/core modification.

## Formal maturity
Latest tracker (updated 2026-10-15T21:15:54+08:00): D16 65.6%, D18 54.7%, overall 47.9%; 22 domains/356 modules. D16-20 and D18-04 remain L2/40. Do not promote because engineering tests pass.

## Exact next continuation
Fresh latest main + Room11 checkpoint + tracker. Review this isolated branch and local V0.2 evidence without replacing any main files. Check DATA lane for real bounded TWTAWU negative-suspension completeness, price-reset family adequacy and hash-bound CLEAR_NO_ACTION exact pair. If present run frozen RB-T01..T16 plus identity oracles with independent source readback. Check real official TWSE Attention/Disposition event plus full same-cut untreated population and pre-treatment covariates; if present run frozen CAUS-T01..T12. Otherwise continue D16-17 membership authority or D16-25 genuine return CalibrationReceipt without fabricating history or outcomes. Formal Core LOCKED.
