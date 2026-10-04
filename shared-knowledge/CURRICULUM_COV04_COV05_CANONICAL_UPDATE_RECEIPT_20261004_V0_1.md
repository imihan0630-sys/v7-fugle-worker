# COV-04 / COV-05 Canonical Update Receipt 2026-10-04 V0.1

Changed at: 2026-10-04T08:42:13+08:00
Owner decision: **APPROVED BOTH**
Status: **CANONICAL_UPDATE_COMPLETE**

## Executed canonical actions

### COV-04 — ADD_MODULE

Created:
- **D07-34**
- **Dividend / Payout Policy & Sustainability股利／配發政策與永續性**
- start: **L0 / 0%**
- owner: D07 / 06｜基本面與估值研究室

The new module owns payout-source, payout-capacity, earnings/CFO/FCF coverage, retention, frequency, dividend-cut/suspension and sustainability semantics. Raw earnings/cash flow/leverage remain with D07-02/05/06; dividend-event clocks remain D11; capital-allocation governance remains D21.

### COV-05 — EXTEND_EXISTING_SCOPE

Extended:
- **D08-06**
- renamed to **EV/EBITDA／EV/Sales／P/S Enterprise & Sales Multiples企業價值與營收倍數**

The coordinated family now includes EV/EBITDA, EV/Sales and P/S with PIT-safe numerator/denominator alignment, monthly-revenue vs IFRS-TTM reconciliation, EV component semantics and explicit family anti-double-count rules.

D08-06 remains **L2 / 40%**. Newly added P/S / EV-Sales sub-capabilities do **not** inherit L2 validation and must build their own PIT/replay/Shadow/OOS evidence.

## Post-update snapshot

- domains: 22
- active modules: **355**
- weighted maturity: **42.3%**
- D07: 34 modules / 14.1%
- D08: 19 modules / 27.4%

The aggregate maturity change caused by adding a new L0 module is denominator expansion, not regression of prior research.

## State-machine closure

- COV-04: OWNER_APPROVAL_REQUIRED → TERMINAL_DECISION_READY → CANONICAL_UPDATE_COMPLETE
- COV-05: OWNER_APPROVAL_REQUIRED → TERMINAL_DECISION_READY → CANONICAL_UPDATE_COMPLETE

## Firewalls

- Formal Core: LOCKED
- System1 Formal: unchanged
- System2 Formal: unchanged
- curriculum inclusion != production adoption
- UNKNOWN != 0 / BAD / no-event
