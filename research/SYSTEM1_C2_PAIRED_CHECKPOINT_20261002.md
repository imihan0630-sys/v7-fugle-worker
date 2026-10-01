# System 1 C2 matched prospective ledger — 2026-10-02

Checkpoint: S1-C2-001 / Class A offline / Formal Core LOCKED.
Branch base at creation: ebdb57f7197986ad08c0cc67f56f2ab8a501fa7c.
Draft PR: https://github.com/imihan0630-sys/v7-fugle-worker/pull/293

## Implementation

`research/system1_c2_paired_ledger_v0_1.mjs` consumes pages of ONE
immutable C1 generation through the existing SHA-256-verified full-universe
adapter. It rejects partial pages, mutated content, missing or invalid main SHA,
non-complete scope and changed generation. It pairs each ordinary equity by
session and symbol with the original Formal qualification, selected flag and
first failure, and a strictly offline SHORT/SWING gate + lifecycle diagnosis.
Required safety gates retain PASS/FAIL/UNKNOWN; a candidate passing only
economic gates while CA/execution/account-risk provenance is UNKNOWN is a
conditional upper-bound *diagnostic*, never WATCH, SELECTED or BUY authority.

No economic outcome was loaded, no current source was backfilled to past
decisionAt, no non-selected success story was retroactively invented.
The ledger always reports economicSuperiority and executionComparison UNKNOWN,
with explicit missing safety and same-date denominator.

## Pre-registered controls

1. Same C1 source generation/date and complete symbol denominator for both
   Formal and C2; original Formal qualification/rank is immutable.
2. Keep source authenticity, session continuity, corporate-action continuity,
   execution feasibility, account risk, price >=10, original liquidity,
   RS/history, abnormality, severe event, ATR and sector as hard gates.
3. SWING additionally keeps market-cap/special-cap, chip/financial/valuation,
   fundamental count/quality floors. SHORT's optional economic input work
   is not a license to accept an unverified source or fake source completeness.
4. Original A/B timing, no-retest extension, ranking, 3+3+3 quota, capital,
   15-minute confirmation, signals and push are NOT changed or activated.
5. No test result here is prospective market alpha: synthetic tests only;
   actual C1 was unavailable after 2026-10-01 scan failures.

## Verification and deployment boundary

Test: `tests/test_system1_c2_paired_ledger_v0_1.mjs` with real digest
calculation, same-gen page reorder, changed payload, invalid provenance,
original baseline separation and no-trade invariants.
The V8 Regression workflow includes it. The initial PR jobs are
36929920257 (Regression) and 36929920372 (Repair CI); verify final outcome
before concluding PASS. The PR stays draft and branch only. A main merge of
`research/*.mjs` or `tests/**` triggers shared production deployment under
current Cloudflare workflow, so Class-B deployment-path authorization/review is
required before any main merge despite research-only runtime intent.

## Source-readiness blocker and exact continuation

The 2026-10-02 00:23 Taipei C1 collector had no stored generation. PR #292
implements read-only failure classification and a preserved blocker artifact,
but did not restore this missing session. Existing C1's independent CA,
execution and account-risk receipts are UNKNOWN. C2 may not declare a tradable
candidate until these source receipts, same-session thesis, structural stop,
and available-at timestamps are independently attested and registered.

Next: verify both PRs' CI; refresh latest main before any updates; only after
a complete fresh C1 generation, emit same-day paired ledger with full coverage;
then separately design C3 entry simulation and C4 capital allocation using
frozen costs, stop-first ambiguity controls, OOS/PIT prospective holdouts and
negative evidence. Formal activation remains a later Class-C human decision.

Rollback: close PR #293; no production rollback is necessary because no
main merge or Worker/runtime update was authorized.

## CI closure — 2026-10-02 05:39 Taipei
- Code PR head 66d0882abb14408fed609424037aedefcdd24bd3: Regression run 36929920257 PASS; Repair CI run 36929920372 PASS.
- Checkpoint PR head 7d0cac1dc36c6334ccdd4a42e319cfc82a32b4f7: Regression run 36930026290 PASS; Repair CI run 36930026250 PASS. The final documentation-only append may retrigger CI.
- Parallel rooms have advanced main since branch creation. Before any merge or new engineering write, rebase/revalidate on latest main; do not overwrite research09 or System2 work.
- Evidence status remains fixture-only; live C1 and positive/negative market return comparisons PENDING. Formal strategy switch NOT AUTHORIZED.
