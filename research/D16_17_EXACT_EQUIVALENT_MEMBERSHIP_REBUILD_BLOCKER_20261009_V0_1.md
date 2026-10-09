# D16-17 Exact-Equivalent Historical Membership Rebuild Blocker — 2026-10-09 V0.1

Updated: 2026-10-09 Asia/Taipei
Status: RESEARCH_ONLY / PHYSICAL_FAIL_CLOSED_CONFIRMED / D16-17_REMAINS_L2
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Record the physical falsification of the proposed "authorized exact-equivalent" fallback for the 2025 TWSE historical-universe membership registry.

The fallback was deliberately strict:
a current re-fetch may substitute for a missing durable row-level annual membership artifact only if it reproduces the already accepted annual source identities and registry identity exactly.

It failed, correctly.

## Accepted annual anchor

2025 TWSE annual evidence:
- run: 37720726697;
- accepted head: 836184f98726449107cdbd0ed83e2746bbbcf965;
- artifact id: 11527595746;
- artifact digest: sha256:41ab589d5f38e667f8fb61427d2053d38d9f62d23e044d22a8c7e0f441cd56df;
- registry id: S2-DATA-TWSE-2025-OFFICIAL-UNION-V0.1;
- registry hash: 8d6d57a6a7791a95cd48c4cb98ddb41a9af2ce6415d619995bafcaf5a1915535;
- membership count: 1096;
- replay eligible: 1096;
- current: 1089;
- delisted: 7;
- unknown start: 0;
- observedAt: 2026-10-08T03:35:20.819Z.

Pinned annual source hashes:
- currentSourceHash: 154d8129ab0db28404b93ca46ce8057f71f036d440d1592b53f8dd5fc2048115;
- newListingSourceHash: bb70678fc001770c7e86ef9471e0ff96b8fe87b6852545a485ab18d1610f7b91;
- delistingSourceHash: a80693f2ab3c94b024ed830c73e64f2a0d122fdba806148edce38bf1570fc143.

## Proposed exact-equivalent gate

Room11 hardened the research-only numeric runner so a non-D1 fallback requires:
1. current/newlisting/delisting source hashes exactly equal the annual anchor;
2. annual registry rebuilt with the exact pinned observedAt;
3. registry id/hash/counts exactly equal the accepted annual registry;
4. exact row-level memberships used for issuer-date admission;
5. no population inference beyond the bounded physical cohort;
6. rowsWritten=0 and no Formal/System1/System2 strategy authority impact.

Pure adversarial suite:
22/22 PASS.

## Physical result

Workflow:
Research Room11 Numeric L3 Physical Readonly.

Run:
37884556010.

Exact head:
910f11059e508fcb747d6d7369544ab18d2697e0.

Result:
FAIL_CLOSED.

Physical blocker:
ANNUAL_EQUIVALENT_CURRENT_SOURCE_HASH_MISMATCH.

Interpretation:
the current TWSE listed-company source response is no longer byte/source-hash identical to the source used by the accepted 2025 annual verification.

Therefore:
- today's current universe cannot be backdated into the 2025 annual membership authority;
- a semantically similar count is insufficient;
- current+delisted reconstruction from a later source vintage cannot repair the missing annual row-level receipt.

No physical artifact was uploaded from this failed run.
No promotion was credited.

## Why this is a useful negative result

The failure proves the fallback does not silently convert a mutable current-listing source into historical membership truth.

A weaker rule based on:
- same membership count;
- same current/delisted counts;
- same symbol subset;
- current source plus known delistings;
would permit survivorship and source-vintage leakage.

Those shortcuts are rejected.

## Required durable repair

The historical annual verifier should, for future accepted annual runs, persist/upload the exact row-level historical-universe membership registry used by the verification, including:
- registry id/hash/version;
- observedAt;
- all membership rows;
- membership id/hash;
- effectiveFrom/effectiveTo;
- listing/delisting dates and basis;
- source id / source row hash;
- replayEligible;
- source-receipt hashes.

A durable artifact is sufficient; a new D1 production table is not required for Room11.

For the already accepted 2025 annual run, D16-17 may promote only if:
- an immutable retained source payload/artifact from that same source cut can reconstruct the exact pinned registry; or
- a new physical annual evidence version captures row-level memberships under its own immutable source cut and the numeric panel is rerun against that new authority.

No backdating of today's source response.

## Maturity

D16-17 remains L2/40.

The panel implementation itself is executable and the 22-test fail-closed suite passes, but survivorship-aware historical membership authority is not durably consumable on the accepted 2025 evidence cut.

## Exact next

1. Preserve this negative result.
2. Do not weaken source-hash equality.
3. Search for retained immutable raw source payloads from the accepted 2025 annual cut.
4. If unavailable, modify the next authorized annual verifier evidence artifact to export row-level memberships.
5. Rerun the physical panel only against a durable exact membership authority.
