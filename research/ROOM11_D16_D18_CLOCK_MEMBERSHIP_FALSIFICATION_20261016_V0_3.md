# Room11 D16-20 + D18-04 V0.3: Clock and Universe Parent Falsification
Recorded: 2026-10-16 14:24-14:27 Asia/Taipei
Status: RESEARCH_ONLY / SYNTHETIC_ADVERSARIAL_TESTS / FORMAL_CORE_LOCKED
Base main: 49c34c09cacb795445fca6cbdb75ce63b6dcbc3f
Owner: 11 | D16 + D18. No Formal/production changes.
Continuation: previous unmerged V0.2 local fallback; do not treat it as merged code.

## Findings / reproduced counterexamples
The prior local V0.2 validators were tested, not the production runtime.
D18-04 V0.2 can report U2B_READY when:
1. membership row's universe parent is contradictory/unknown, because the row is not bound to the frozen U0 parent receipt;
2. current source availability predates the current market session;
3. prior source availability predates the prior market session;
4. current market session occurs after the decision cutoff while asserted source clocks are earlier;
5. a source timestamp has no explicit timezone and Date.parse applies runtime-local interpretation.
D16-20 V0.2 can accept:
6. string 'false' in ruleVintageVerified (truthiness);
7. a covariate observed after effective treatment session but before the later announcement/source availability;
8. an excluded row from a different universe parent (parent binding was checked only for included rows);
9. future-outcome alias nextSessionReturn;
10. snake_case next_session_return;
11. ambiguous timezone-less treatment-source timestamp.

## Research-only V0.3 hardening
- Require exact immutable universeReceiptHash / membershipUniverseReceiptHash equality before any U2B ready path.
- Require session <= decision clock and current/prior source clocks not before their claimed session start.
- Require explicit timezone on decision, treatment, covariate, and price-source timestamps.
- Require strict boolean ruleVintageVerified and every excluded/included row's universe parent.
- Freeze pre-treatment covariates before MIN(treatment-effective session start, announcement availability).
- Deny recursive outcome aliases before causal panel construction.
- Preserve physicalEvidenceCertified=false, causalEstimationEligible=false, all original blockers, and immutable U0 denominators.
These are additional fail-closed preflight wrappers, NOT independent source verification.

## Test evidence
Old local D16 V0.1: 18/18 PASS.
Old local D18 V0.1: 24/24 PASS.
Local V0.2 adversarial: 17/17 PASS.
New local V0.3 adversarial: 16/16 PASS.
Total 75 synthetic software tests; 0 new Taiwan samples, 0 real U2B pairs, 0 real causal panels, 0 eligible strategy return claims.
V0.3 new tests include clean-fixture pass and multiple actual V0.2 false-acceptance reproductions.

## Latest-main upstream evidence / non-promotion
System2 CORR-007 is VERIFIED_CLOSED as a code-only suspension-provenance firewall; it is NOT a real complete no-event receipt.
System2 DATA_LANE 2026-10-16 readback proves 122 original source files and 118,035 source bars for source-only PIT at the later research cut, not historical decision-time PIT or official all-security continuity.
2026-10-14 30-symbol CFI current observation cannot certify 61-session historical identity.
Six corporate-action native families yielded 641 event rows; 19 of 30 symbols without observed event are UNKNOWN, not NO_EVENT.
Neither D18-04 physical RB-T01..T16 nor D16-20 real CAUS-T01..T12 is complete.
D16 65.6%; D18 54.7%; aggregate 47.9% remain unchanged per latest tracker.
No maturity promotion, no Formal optimization candidate.

## Four-way falsification ledger
Hypothesis A: universe-parent and session-clock preflight reduces false-ready breadth rows.
Support: V0.2 counterexamples reproduced; V0.3 rejects them.
Falsification: a self-asserted parent hash can still be forged.
Alternative: independently archived immutable parent receipts could establish actual authority.
Failure: no official original bytes/as-of readback, source revision, corporate-action negative completeness, or membership-vintage authority.

Hypothesis B: effective-session and strict rule-vintage gates reduce causal-panel contamination.
Support: V0.2 accepts string-false rule vintage and post-effective covariate; V0.3 rejects.
Falsification: effective session alone is not necessarily the exact economic treatment onset.
Alternative: later announcements, staged implementation, or overlapping designation classes require a richer event-time receipt.
Failure: no official treatment/untreated population, no joint positivity, endogenous assignment, or outcome-blind cohort freeze.

Hypothesis C: timezone-explicit clock parsing prevents environment-dependent PIT acceptance.
Support: V0.2 accepted at least one timezone-less synthetic source clock; V0.3 rejects.
Falsification: explicit offset does not prove source time is truthful.
Alternative: provider-native local exchange time may be usable if independently pinned to source semantics.
Failure: asserted time is backdated or source capture not independently witnessed.

## Exact next continuation
1. Re-read latest main, tracker and dedicated checkpoint; reconcile parallel branches without overwriting.
2. Review and run local V0.3 scripts from downloadable evidence backup; do not claim remote code landed until exact remote readback.
3. Require independently verified original-source parent/clock authority; use M09 same-date CFI + six-family CA negative completeness and source PIT.
4. On real D18 U2B pair, run frozen RB-T01..T16; on genuine D16 treatment+full untreated same-cut pool, run CAUS-T01..T12.
5. If blocked, proceed to D16-17 durable row-level historical membership or D16-25 canonical calibration ledger; do not promote based on synthetic tests.
