# D02 PVE-275 — Wave-1 anti-bypass admission firewall

Date: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / WAVE1_BASELINE_AND_EXECUTION_FIREWALL_FROZEN / NO_MATURITY_CHANGE

Wave-1 contains three distinct economic evidence keys:
- D02-02:H001;
- D02-03:H20;
- D02-06:H003.

Legacy PVE-242 / Wave-1 gates remain useful for their original event/common-support/clock semantics but are no longer sufficient by themselves for new prospective admission after PVE-260~274 findings.

PVE-275 routes each key through its strengthened prerequisite:
- H001 -> PVE-270 dual prerequisite;
- H20 -> PVE-273 same-slot RVOL freshness;
- H003 -> PVE-274 P/PV baseline symmetry and freshness.

Direct use of a legacy gate cannot mint a clean prospective row.

A PASS means only that a pre-outcome row may enter the relevant research evidence lane.
It never grants outcome access, maturity promotion or Formal Core modification.
