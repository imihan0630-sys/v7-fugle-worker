# D02 PVE-279 — D16 Wave-2 admission consumption binding

Date: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / DOWNSTREAM_WAVE2_ANTI_BYPASS_BINDING_FROZEN / NO_MATURITY_CHANGE

The existing D16 V0.2 receipt guard still accepts D02_L4_WAVE2_ADMISSION_V0_1 as the Wave-2 admission version. PVE-277/278 found that legacy row admission does not bind the newly required dependency-specific freshness/continuity receipts.

PVE-279 therefore composes, rather than replaces, D16 V0.2.

For all ten Wave-2 evidence keys/families, downstream D16 consumption additionally requires:
- a PVE-278 PASS receipt for the exact module/family;
- pre-outcome, outcome-blind receipt timing;
- immutable admission receipt hash;
- immutable admitted dataset hash;
- exact equality with D16 input dataset hash;
- admitted row count bound to D16 common-support count.

Direct legacy Wave-2 D16 consumption cannot mint promotion-review eligibility under current D02 governance.

No maturity promotion or Formal Core change is authorized.
