# D03 Pre-Parent Source Cut V0.2 — Decision-Cutoff Hardening

Updated: 2026-10-04 Asia/Taipei
Status: OUTCOME_BLIND / V0.1 RECEIPT-STAMP GAP SUPERSEDED
Formal Core: LOCKED

## Purpose

Prevent the newer source-cut policy from accidentally weakening the already-proven parent clock rule.

The deployed parent may have a later receipt/decision stamp. Promotion-grade source eligibility must use the actual persisted Formal input-freeze cutoff.

## TI-674 — `decisionAt` cannot substitute for `decisionCutoffAt`

A source fact captured after Formal inputs froze but before the parent receipt was stamped is future information relative to that decision.

Therefore V0.2 requires a physical `decisionCutoffAt`.

Missing cutoff => DATA_BLOCKED.

## TI-675 — V0.2 reuses V0.1 with a stricter clock

V0.2 keeps the V0.1 market-wide scope, exact-version, completeness and no-revision-gap rules.

It calls V0.1 under a strict parent view whose eligibility clock is `decisionCutoffAt`, not `decisionAt` / parent receipt time.

Thus a cut at 18:10:00 cannot pass merely because the receipt is stamped 18:10:05 if Formal inputs froze at 18:09:50.

## TI-676 — maturity

No maturity change.

Current deployed V8.17 parent still lacks physical `decisionCutoffAt`; therefore the first future parent remains insufficient for promotion until the shared parent owner persists this field or an equivalent cryptographically linked input-freeze receipt.

D03 remains 56.7%.

## Exact next

1. Shared parent owner implements additive `decisionCutoffAt` provenance under owner governance.
2. First genuine post-deploy parent must read back that cutoff.
3. Shared continuity cut must complete no later than that cutoff.
4. Then the two-point no-gap and evidence-cut/receipt-created split may be applied.
5. Bollinger first, ADX only with canonical FULL_REPLAY.
