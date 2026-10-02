# C1-only Class-B activation review — PR #306

Status: OWNER APPROVED 2026-10-02 / INTEGRATION IN PROGRESS / NOT YET DEPLOYED.
Engineering commit: c452642dcccad6f0d7608629889e69b18661393b.
Linux isolated candidate regression: 57/57 PASS (36976181250).

## Requested scope

Approve only the C1 receipt/integrity repair candidate and its read-only C2 pairing path. A/B, ranking, 3+3+3, capital, 15m entry/exit, signals, push and System2 stay locked. No historical reselection, fabricated WATCH, phone resend, broker mutation or strategy switch.

## Concrete integration remaining after approval

1. In v7-cloudflare.yml, v7-regression.yml and v7-repair-ci.yml, append `python3 scripts/apply_v8_15_1.py` immediately after 8.15.0 and change expected-version markers to `8.15.1-c1-capture-integrity`. Register the patch in matching workflow path filters. These existing production workflows have not been edited in this PR.
2. Re-run standard and isolated regressions at the exact deployment head. Use existing guarded code-only deployment, backup, configuration preservation and rollback. Keep current bindings, four Cron expressions, targets, actual positions and capital.
3. Production activation only adds C1 persistence/export integrity and the current-session staged handoff. No extra market-data requests; extra D1 content verification/UTF-8 hashing costs remain a live acceptance risk. The 2,000-row synthetic input is 3,478,161 bytes, 40 chunks, max chunk 86,955 bytes; this is not Cloudflare CPU/memory acceptance.
4. Observe the normal next complete current-session scan. If upstream data or resource limits fail, preserve blockers and diagnose; never force a successful receipt or repeatedly invoke business POSTs.
5. The new paired CLI is not connected to any scheduler. Connect it only after destination approval and only with the existing administrator authorization; never export or request the token itself.

## Explicit data-destination decision

Proposed research output contains generation/session/source commit and clocks, content/universe hashes, ordinary equity symbols, original Formal qualification/selection/first failure, gate PASS/FAIL/UNKNOWN, missing-safety reasons and paired diagnostic tallies. C1 diagnosis also contains offline sampled gate/symbol membership.
It contains no raw administrator/deployment/API tokens, webhook targets, actual broker holdings/cash/fills or account identifiers; account-risk evidence stays UNKNOWN. No full source pages are added to the artifact.
Public GitHub Actions artifacts are not approved for this new payload. Obtain explicit owner approval for this payload and public destination, or design and authorize a private destination before any live collector activation. Existing scheduled collector and its existing upload remain unchanged by this PR.

## Acceptance/rollback

Require version/bindings/TEST_MODE/Cron/target readback; protected Formal invariants; same completed scan-to-C1 generation linkage; full pagination and digest coverage; a C2 ledger from that exact generation; no missing-as-zero or backdated WATCH. Engineering CI alone does not meet live acceptance.
If research capture fails, Formal output remains unaffected but research status is DATA_QUALITY_BLOCKED with null unverified counts. Runtime performance is measured on the first authorized normal capture. Roll back code through the existing path; retain immutable stored evidence. A Formal strategy switch is outside this packet.

## Owner authorization, 2026-10-02

The owner replied "批准" to the concrete C1-only deployment and the listed public GitHub Actions artifact destination. This authorizes the three build-chain integrations and activation of the read-only paired collector described above. Earlier NOT APPROVED statements describe the pre-approval snapshot. Formal strategy changes remain outside authorization. Exact-head CI, deployment/readback, and genuine-generation acceptance are still required.
