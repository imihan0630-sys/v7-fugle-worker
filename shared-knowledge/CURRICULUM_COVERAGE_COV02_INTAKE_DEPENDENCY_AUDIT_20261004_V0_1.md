# COV-02 Intake + Dependency Audit 2026-10-04 V0.1

Updated: 2026-10-04T11:53:00+08:00
Status: OWNER_APPROVAL_REQUIRED
Scope: 00｜研究總控室 Curriculum Coverage governance
Audit base main: `59352217cd8d21f9d5dc782d3e83d274d515de07`

## Executive result

Formal specialist return:
- `research/COV_02_CLOSING_AUCTION_SPECIALIST_RETURN_20261004_V0_1.md`
- machine return: `research/cov_02_closing_auction_specialist_return_20261004_v0_1.json`
- evidence cutoff: `2026-10-04T07:45:00+08:00`
- specialist recommendation: `EXTEND_EXISTING_SCOPE`

00-room Intake result:
- fixed 10-field return contract: PASS;
- mandatory source / overlap / counterevidence tables: PASS;
- Taiwan source feasibility and limitations: explicit;
- PIT/replay and UNKNOWN semantics: explicit;
- anti-double-count rule: executable;
- no fabricated historical pre-close imbalance;
- no maturity promotion from the structural recommendation.

Legal state path:
`PARTIAL_EVIDENCE_RECEIVED`
→ `RETURN_ACCEPTED_FOR_INTAKE`
→ `DEPENDENCY_AUDIT_PENDING`
→ `OWNER_APPROVAL_REQUIRED`.

## Structural recommendation under review

Target module: `D05-06`

Current canonical name at audit time:
`開盤集合競價`

Proposed canonical name:
`Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）`

Recommended action:
`EXTEND_EXISTING_SCOPE`

Module-count effect:
NONE.

Maturity effect from this governance action:
NONE. D05-06 remains L2 / 40% unless separate normal maturity evidence later supports promotion.

## Overlap recheck

### D05-06
Owns exchange auction mechanics. Opening and closing call auctions share the same core price-formation family. Closing requires explicit phase substates, not a second producer module.

Result:
`PASS_SCOPE_EXTENSION_PREFERRED`.

### D05-03 / D05-04 / D05-05
Spread, displayed depth and order-flow pressure may be inputs observed around the auction, but they do not own the auction mechanism. The auction state may consume these primitives without re-owning them.

Result:
`PASS_SHARED_OBSERVABLES_NOT_SHARED_OWNER`.

### D05-14
Owns market-integrity interpretation and false-positive controls. It may consume the closing-auction primitive but cannot produce a second independent auction vote.

Result:
`PASS_CONSUMER_BOUNDARY`.

### D02
End-of-day volume may overlap descriptively with closing activity. Generic EOD volume cannot be relabeled as pre-close auction imbalance unless a timestamped residual auction observable exists.

Result:
`PASS_NO_PROXY_SUBSTITUTION`.

### D11 / D17
Own external event/news timing and transmission context, not auction price formation.

Result:
`PASS_EVENT_CLOCK_BOUNDARY`.

### D14
Own execution/fill/slippage consequences around the close, not the exchange auction mechanism itself.

Result:
`PASS_EXECUTION_CONSUMER_BOUNDARY`.

## Dependency Audit

Required supporting dependencies:
- D05-01 tick-size semantics where price-grid interpretation matters;
- D05-02 price-limit constraints;
- D05-03 bid-ask spread;
- D05-04 displayed depth;
- D05-05 order-flow pressure when genuinely observed;
- D05-07 session / VI / abnormal matching state;
- D05-10 no-trade / halt / pseudo-bar semantics;
- D05-14 integrity interpretation;
- D02 end-of-day price/volume as downstream descriptive context only;
- D11 / D17 event clocks;
- D14 execution-quality consumers.

Dependency result:
`PASS_EXISTING_OWNER_GRAPH`.

No new cross-domain owner is required.

## PIT / replay recheck

Accepted:
- 13:25 closing accumulation/trial state is distinct from the final match;
- 13:30 / delayed 13:33 final state cannot backfill earlier trial observations;
- current/prospective trial state is usable only with source timestamp + capturedAt / firstObservedAt;
- historical final close/volume does not reconstruct historical pre-close imbalance;
- missing historical trial state remains `UNKNOWN`.

Result:
`PASS_FAIL_CLOSED_REPLAY_SEMANTICS`.

## Anti-double-count recheck

Canonical firewall if approved:
1. one auction episode has one D05-06 parent primitive;
2. D05-03/04/05 features may be attached as child observables, not independent duplicate auction votes;
3. D05-14 may interpret integrity risk but does not create a second auction signal;
4. D14 may measure execution consequences but does not re-own auction mechanics;
5. D02 EOD volume cannot substitute for pre-close imbalance;
6. D11/D17 event explanations remain external causal/context clocks.

Result:
`PASS_SHARED_PARENT_RECEIPT_REQUIRED`.

## Anti-orphan review

No closing-only capability is orphaned by extending D05-06, provided the canonical scope explicitly preserves:
- OPEN_CALL / OPEN_TRIAL;
- CLOSE_CALL_ACCUMULATION / CLOSE_TRIAL / CLOSE_DELAYED / CLOSE_FINAL;
- benchmark/end-of-day execution context;
- prospective trial-state capture when observable;
- historical missingness = UNKNOWN;
- final close/volume not a substitute for the pre-close path.

Result:
`PASS_NOT_ORPHANED`.

## Audit-time canonical snapshot

- domains: 22
- active modules: 356
- weighted maturity: 44%
- D05 maturity: 51.4%
- D05-06: L2 / 40%
- Formal Core: LOCKED

These are audit-time readbacks only; later specialist work may advance the tracker independently.

## Owner decision required

00-room governance agrees that `EXTEND_EXISTING_SCOPE → D05-06` survives Intake, Dependency Audit, overlap recheck, anti-double-count and anti-orphan review.

Current state:
`OWNER_APPROVAL_REQUIRED`.

Approval would authorize only the curriculum scope/name update. It would NOT:
- change module count;
- promote D05-06 maturity;
- create a closing-auction alpha vote;
- alter System1/System2 Formal behavior;
- authorize production deployment.

If approved, 00 must re-read latest main and atomically update the canonical tracker / learning map / router / Shared Master / Coverage registries, preserving concurrent research and recording the canonical receipt.
