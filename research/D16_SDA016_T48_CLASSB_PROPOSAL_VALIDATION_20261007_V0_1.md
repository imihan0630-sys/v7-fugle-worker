# D16 SDA-016 T48 Class-B Proposal Validation — 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / PROPOSAL_SEMANTICS_VALIDATED / IMPLEMENTATION_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Ticket: SDA-016
Test focus: SDA016-T48
Formal Core impact: NONE

## Scope

Validate the merged Class-B generation-set finalization proposal against D16 self-confirmation / repeated-OOS governance.

Source proposal:
- research/SYSTEM1_SDA016_T48_CLASS_B_PROPOSAL_20261007.md

This validation does not authorize implementation and does not mark T48 PASS.

## Validation result

Overall:
PROPOSAL_SEMANTICS_ACCEPTABLE / RUNTIME_EVIDENCE_NOT_YET_AVAILABLE / T48_REMAINS_OPEN.

The proposal correctly addresses the missing authority: when one scanDate's C1 generation inventory can be declared immutable and complete for downstream research consumption.

## Strong controls accepted

1. Append-only finalization authority
- unique scan_date;
- no UPDATE;
- no DELETE;
- no historical backfill.

This prevents later outcome-aware mutation of the generation-set boundary.

2. Producer registry versioning
- eligible producer classes are explicit;
- a default parameter is not treated as proof of an active producer;
- a future active producer requires a new registry version.

This is important because a hidden writer after finalization would invalidate the claimed denominator.

3. Date-rollover timing
- same-date prospective production remains open through all allowed producer windows;
- finalization occurs only after rollover;
- historical stage-selection cannot synthesize a prior C1 generation under the existing same-date guard.

This is aligned with prospective evidence semantics.

4. Binding-in-set requirement
Every explicit Formal→C1 binding must point inside the canonical finalized generation set.

This is necessary for dataset identity and exact denominator interpretation.

5. Late-generation fail-closed research guard
A post-finalization C1 insertion becomes an explicit provenance violation rather than silently rewriting the closed set.

Formal business behavior remains separated from research evidence.

6. Protected readback
The proposed readback exposes the exact receipt, digest, linked binding IDs and post-finalization violation count.

This is sufficient as a candidate D16 audit surface if implementation preserves exact immutable fields.

## Remaining validation conditions before T48 PASS

T48 must remain OPEN until all of the following exist:

1. actual implementation merged;
2. schema/migration readback proves append-only/unique semantics;
3. deterministic T48-F01..F10 pass on effective runtime;
4. all current production C1 producer call sites are re-enumerated from the implementation version;
5. one genuine post-deploy scanDate produces a finalization receipt;
6. receipt timestamp is after all eligible same-date producer windows;
7. receipt generation-set digest matches the physically persisted canonical inventory;
8. linked V8.20 Formal→C1 binding IDs are members of that inventory;
9. no historical backfill is used to create promotion-grade evidence;
10. postFinalizationViolationCount is explicitly checked;
11. the 00:10 prospective collector consumes only a finalized generation-set identity when the experiment requires final completeness;
12. any failure remains preserved rather than overwritten by a later successful receipt.

## Additional D16 edge cases

### Official-session identity

"Previous Taiwan trading session" must be proven through an official-session calendar/receipt, not a simple previous calendar date.

### Recovery-window ambiguity

If a recovery execution is pending, timed out, or has unknown terminal state, finalization must abstain. Unknown execution state is not equivalent to no execution.

### New producer discovery

If a new concrete C1 persistence call site is later discovered:
- existing receipts remain historical facts;
- current registry must version forward;
- affected evidence windows must be marked with the registry version in force;
- no silent reinterpretation of prior finalizations.

### Duplicate finalizer invocation

Repeated scheduler/admin invocation for the same scanDate must return/read the immutable existing receipt or fail deterministically. It must not create a second logically distinct finalization.

### Research/business separation

A research finalization failure must not alter Formal selection, capital, push, monitoring or order behavior. Conversely, a successful Formal business run does not imply research finalization succeeded.

## SDA-016 interpretation

T48 is not just a storage feature. It blocks a specific self-confirmation path:

Without finalization:
- a researcher can inspect an incomplete C1 set;
- later generations can arrive;
- the denominator silently changes;
- prior analysis can become selectively incomplete without a visible mutation.

With a valid immutable finalization receipt:
- denominator identity is frozen;
- later arrivals become explicit violations;
- prospective analyses can bind to one exact generation set;
- holdout consumption can reference a stable dataset identity.

This materially strengthens SDA-016 but does not close it. The ticket still requires generic holdout-use/outcome-lock semantics, adversarial repeated-OOS tests and independent Room00 readback.

## Maturity decision

No D16 maturity change.

Reason:
proposal semantics are stronger, but implementation + genuine receipt are still absent.

## Exact next continuation

1. If owner authorizes T48 Class-B implementation and it lands, validate implementation and first genuine receipt immediately.
2. Bind finalizedGenerationSetDigest into the future SelectionFamilyReceipt / holdout-use ledger.
3. Preserve the pre-finalization vs finalized state distinction in prospective evidence collectors.
4. Do not open economic outcomes merely because T48 infrastructure becomes available.
