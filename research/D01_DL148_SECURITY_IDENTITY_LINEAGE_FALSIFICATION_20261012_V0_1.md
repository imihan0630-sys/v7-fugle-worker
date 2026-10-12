# D01 DL-148 — Cross-market security identity lineage falsification (2026-10-12)

Owner: 01｜K線與型態研究室 / D01. Class A research-only. Outcome blind. Formal Core LOCKED.

## Canonical continuation
- Read latest main and KLINE_PATTERN_CHECKPOINT.md before research. Main at start: 62db94a99df83d76bc599ddef936c0a96aadb160.
- Mainline remains DL-148; DL-147 already durable. This is a fifth incremental falsification of the pending DL-148 cross-market context bridge, not a new official DL-149 completion.
- D01 official tracker: 11 modules, all L3, 60.0%. Aggregate: 22 domains, 356 modules, 47.9%. No promotion.
- Earlier DL-148 v0.1-v0.4 research remains unmerged; do not overwrite other rooms or infer mainline completion.

## New falsification — ticker/code continuity is not legal-issuer continuity
Earlier v0.4 checked the same securityId across old/new TWSE/TPEx memberships, venue-migration owner receipts, their temporal order and receipt digest. It could still accept a *synthetic* scenario where the same securityId represented different legal issuers in the old and new snapshots. The old v0.4 validator had no legalEntityId field to distinguish a true market migration from identifier recycling, mistaken alias mapping or corporate restructuring.

Adversarial witness: old TWSE SEC -> legal issuer ENTITY-1; new TPEx SEC -> legal issuer ENTITY-2; same securityId, same price episode, otherwise correctly formed synthetic bridge/venue receipt. Exact local v0.4 returned READY_FOR_INDEPENDENT_D09_REVIEW; the new v0.5 research guard returns D09_SECURITY_IDENTITY_LINEAGE_UNVERIFIED / SAME_TICKER_DIFFERENT_LEGAL_ENTITY.

This does NOT prove such a reuse actually happened in Taiwan; it proves a logical insufficiency in the v0.4 synthetic admission contract.

## Positive mechanism
Require legalEntityId in both known-member vintages and priceNode, identical issuer identity across all common known securityIds, and one D09 owner-certified source-root/hash-bearing identity certificate per common identifier. Certificate must bind old/new venue, legal issuer, source root/hash, certificateId, availableAt, and continuityType. The certificate digest is canonicalized to actual UTC instants. A changed certificate source or clock without recomputed digest fails. A certificate first available after the bridge or predictor cutoff fails. Even passing this guard returns READY_FOR_INDEPENDENT_D09_REVIEW only: sectorMetricAllowed=false, independentVoteCount=0.

## Negative evidence and alternative explanations
- An unchanged security code can mask legal issuer discontinuity; a changed code can still represent legal issuer continuity.
- Official issuer merger, demerger, exchange listing transition, dual identifiers, and archived security-code namespace changes are alternative explanations. Do not assume any specific Taiwan case without dated official proof.
- Same text legalEntityId in two self-asserted snapshots is NOT independently authenticated legal identity. Official D09/security-registry root, immutable source payload, first-publication timestamp and owner signoff remain missing.
- An identity certificate created later cannot retroactively prove earlier knowledge. Unknown or partial membership remains UNKNOWN, never 0/BAD.

## Verification receipts
- Local native Node v22.16.0 exact-source v0.5 adversarial suite: 20/20 PASS, 0 FAIL.
- Prior v0.1-v0.4 deterministic regression: 43+17+12+18 = 90/90 PASS; fixed-seed denominator property checks 400/400 PASS.
- Total 510/510 mechanical checks PASS. These are NOT 510 market samples, not independent hypotheses, and not OOS/Shadow performance.
- Local exact-file SHA256 v0.5 source: f82e40ea2659318ed938e972f8e3538d349ce31f63db2f3374db9ec4b3c6c4ca
- Local exact-file SHA256 v0.5 tests: fc48cc7434289b5cfd877d4bcd4ef1000f070dc2587f12c745c168a2555e6714
- Local native stdout log SHA256: a021cacfdfaecb78f194c8bb66198908d34405770b74b7e586706822621ceae6
- These hashes are local execution evidence only; do not call them GitHub CI or official source attestation until exact bytes are committed and independently verified.

## Mandatory bias gates
PIT: synthetic UTC clock guard passed; physical first-known/source archive UNKNOWN.
OOS, Walk-forward, prospective Shadow: NOT OPEN; 2021-06-15 1101 R1–R6 61 eligible-session physical chain still unverified.
Selection bias, look-ahead, data snooping, multiple testing, overfitting: one related DL-148 research family, not multiple independent wins; do not tune on outcomes.
Factor redundancy: price-root and sector context share identity lineage; no additional vote.
Insufficient sample, date clustering, costs, liquidity, market regime: economic evidence UNKNOWN. No fabricated historical Shadow.
Formal Core remains LOCKED; no runtime, Worker, D1, ranking, capital, trade or push change. No FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation
1. Before any write, refresh latest main HEAD and checkpoint blob; reconcile concurrent DL-148 progress.
2. Persist the exact v0.1-v0.5 research-only source/tests and independently rerun native CI; local artifact alone is not repository durability.
3. D09/security registry owner must provide physical issuer identity/source-root/clock certificates for cross-venue common identifiers; if unavailable, mark SOURCE_BLOCKED and move to a different D01 executable hypothesis.
4. Independently verify frozen 1101/2021-06-15 R1–R6; only after 61 eligible sessions pass may D01 produce R7. Never inspect future outcomes early.
5. Preserve separate Sara 60m source/PIT lane and all 11 D01 L3->L5 evidence requirements. No L4/L5 without physical OOS/prospective evidence and D16 review.
