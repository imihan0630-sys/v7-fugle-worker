# D16-17 code-readiness vs accepted evidence audit

Main 56bda73, research/room11_numeric_l3_batch_v0_1.mjs: the current V0.2 runner assigns d16_17L3Eligible:true and survivorshipAwareMembershipApplied:true in the panel object after either persisted D1 membership or a fresh in-memory official registry fallback. The same object sets populationInferenceAuthorized:false and records membershipAuthorityMode. This is a semantic tension, not proof of a production defect.

Accepted run 37805085401 instead records persistedRegistryReceiptPresent=false, persistedMembershipRowCount=0 and withholds D16-17 L3. That run used an earlier head and cannot validate the newer fallback. A boolean readiness field in new source code is not physical membership acceptance.

Hypothesis: fresh official historical member intervals may support bounded panel feasibility. Falsification: missing immutable full member set, registry-hash mismatch, date/identity mismatch, excluded delisted issuers. Alternative: observed 12-symbol cohort appears complete only because available bars were preselected. Failure: absent row-level receipt, unproven PIT vintage, no full-date population accounting.

Keep D16-17 L2/40. Next: execute MR-T01..T16 on an immutable source receipt, compare all 1,096 member identities/intervals and historical issuer-date denominator, then rerun physical panel. No Formal change.
