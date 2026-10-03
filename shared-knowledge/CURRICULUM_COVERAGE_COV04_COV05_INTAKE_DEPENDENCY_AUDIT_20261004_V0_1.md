# COV-04 / COV-05 Intake + Dependency Audit 2026-10-04 V0.1

Updated: 2026-10-04T07:52:57+08:00
Status: OWNER_APPROVAL_REQUIRED
Scope: 00｜研究總控室 Curriculum Coverage governance.

## Executive result

Two formal specialist returns now exist on latest `main`:

1. `research/COV04_D07_SPECIALIST_RETURN_V0_1.md`
   - Candidate: COV-04 / D07
   - Contract: COMPLETE
   - Terminal recommendation: `ADD_MODULE`

2. `research/COV05_D08_SPECIALIST_RETURN_V0_1.md`
   - Candidate: COV-05 / D08
   - Contract: COMPLETE
   - Terminal recommendation: `EXTEND_EXISTING_SCOPE`

Both pass the fixed 10-field return contract:
- exact knowledge definition;
- overlap matrix;
- why current scope is insufficient;
- Taiwan data feasibility;
- PIT / replay implications;
- decision role;
- anti-double-count rule;
- proposed owner;
- maturity starting point;
- exactly one terminal recommendation.

No UNKNOWN coercion to 0/BAD/no-event was found.

A specialist return is not self-executing. 00-room governance therefore performs the required Dependency Audit, overlap recheck and anti-orphan review below.

---

## COV-04 — Dividend / Payout Policy & Sustainability

Specialist recommendation:
`ADD_MODULE`

### Intake transition

`PENDING_SPECIALIST_RETURN`
→ `RETURN_ACCEPTED_FOR_INTAKE`
→ `DEPENDENCY_AUDIT_PENDING`
→ `OWNER_APPROVAL_REQUIRED`

### Current-curriculum overlap recheck

Latest tracker still has no module that cleanly owns the combined capability:
- payout source;
- payout ratio;
- earnings / CFO / FCF dividend coverage;
- retention;
- ordinary vs special / reserve-funded distributions;
- payout-frequency consistency;
- dividend-cut / suspension history;
- sustainability state.

Nearest owners remain:
- D07-02 — raw earnings;
- D07-05 — CFO / FCF;
- D07-06 — balance-sheet / leverage quality;
- D07-19 / D07-22 — reinvestment / forecast inputs;
- D08-14 — DDM valuation;
- D11 — dividend event clocks;
- D21-07 — capital-allocation governance;
- D07-32 — financial-institution regulatory context.

None owns the full payout-sustainability state.

Overlap recheck:
`PASS_NEW_CAPABILITY_NOT_CLEANLY_OWNED`

### Dependency Audit

Required upstream dependencies:
- D07-02;
- D07-05;
- D07-06;
- D07-08;
- D07-19;
- D07-22;
- D07-32 when financial institutions are included;
- D11 dividend-event timing;
- D21 capital-allocation governance.

Potential downstream consumers:
- D08-14 DDM;
- D08 valuation context;
- D21 capital-allocation interpretation;
- future D07 fundamental-quality / sustainability research.

Dependency result:
`PASS_EXPLICIT_UPSTREAM_AND_DOWNSTREAM_LINKS`

### Anti-double-count recheck

Accepted firewalls:
- raw earnings remain D07-02;
- CFO / FCF remain D07-05;
- leverage/liquidity remain D07-06;
- yield / DDM remain D08;
- event clocks remain D11;
- governance process remains D21;
- one dividend event receipt produces child views, not multiple independent votes;
- stock dividend is not cash payout;
- reserve-funded cash and earnings-funded cash remain separate.

Result:
`PASS_WITH_SHARED_PARENT_EVIDENCE`

### Anti-orphan review

A new D07 module would have:
- clear producer inputs;
- clear consumers;
- explicit event and governance dependencies;
- explicit Taiwan source family;
- an L0 start;
- a non-Formal, validation/context-first decision role.

Result:
`PASS_NOT_ORPHANED`

### Structural disposition

00-room governance agrees that the specialist recommendation survives review.

Proposed structural action:
`ADD_MODULE`

Proposed domain:
D07

Proposed working name:
`Dividend / Payout Policy & Sustainability（股利／配發政策與永續性）`

Module ID:
NOT assigned until owner approval and atomic update.

Maturity start if approved:
L0 / 0%.

Current state:
`OWNER_APPROVAL_REQUIRED`

---

## COV-05 — Sales-based / Enterprise Multiples

Specialist recommendation:
`EXTEND_EXISTING_SCOPE`

### Intake transition

`PENDING_SPECIALIST_RETURN`
→ `RETURN_ACCEPTED_FOR_INTAKE`
→ `DEPENDENCY_AUDIT_PENDING`
→ `OWNER_APPROVAL_REQUIRED`

### Current-curriculum overlap recheck

Latest tracker confirms:
- D08-06 currently owns EV/EBITDA;
- D08-09 owns peer / sector normalization;
- D08-12 owns corporate-action denominator integrity;
- D08-18 owns financial-institution valuation;
- D07-01 owns revenue as operating information.

No module separately owns P/S or EV/Sales.

The cleanest non-duplicative owner remains D08-06.

Overlap result:
`PASS_SCOPE_EXTENSION_PREFERRED_OVER_NEW_MODULE`

### Dependency Audit

Required dependencies:
- D07-01 revenue;
- D07-03 / D07-14 margin / unit-economics controls;
- D07-31 M&A / consolidation-scope changes;
- D08-09 peer normalization;
- D08-10 cycle / value-trap guards;
- D08-12 corporate-action denominator integrity;
- D08-18 financial-institution exception handling.

Dependency result:
`PASS_EXISTING_OWNER_GRAPH`

### Anti-double-count recheck

Accepted firewalls:
- P/S and EV/Sales are one sales-denominator family, not two votes;
- EV/Sales and EV/EBITDA share the EV numerator and must be coordinated;
- revenue growth remains D07;
- margin / unit economics remain D07;
- peer normalization remains D08-09;
- share-count/corporate-action authority remains D08-12;
- financial institutions remain D08-18;
- forward sales multiples remain UNKNOWN without authorized PIT forecasts.

Result:
`PASS_FAMILY_ORCHESTRATION_REQUIRED`

### Anti-orphan review

No new module is proposed.

The extended capability has a clear existing owner and explicit dependencies.

Result:
`PASS_NOT_ORPHANED`

### Structural disposition

00-room governance agrees that the specialist recommendation survives review.

Proposed structural action:
`EXTEND_EXISTING_SCOPE`

Target:
`D08-06`

Proposed extension includes:
- P/S;
- EV/Sales;
- sales-denominator alignment;
- EV numerator contract;
- monthly revenue vs IFRS TTM reconciliation;
- margin/growth/capital-structure interpretation;
- family anti-double-count rules.

Canonical module maturity:
remain unchanged by the scope update.

The new sub-capability must not inherit D08-06 maturity as evidence of P/S / EV-Sales validation.

Current state:
`OWNER_APPROVAL_REQUIRED`

---

## Owner decision required

No canonical tracker/map/router structural change is made by this audit.

Owner must explicitly approve or reject each structural action:

### Decision A — COV-04
Approve adding a new D07 module for Dividend / Payout Policy & Sustainability, starting at L0 / 0%.

### Decision B — COV-05
Approve extending D08-06 to include the coordinated P/S / EV-Sales capability, with no maturity promotion.

If approved, 00-room must perform one atomic canonical update and record the commit SHA.

If COV-04 is approved and no simultaneous merge/retirement offsets it:
- active module count would increase from 354 to 355.

COV-05 alone does not change module count.

## Formal boundary

Formal Core remains LOCKED.
No System1 / System2 Formal behavior changes are implied.
Curriculum inclusion is not production adoption.
