# D02 PVE-276 — D16 Wave-1 admission consumption binding

Date: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / DOWNSTREAM_ANTI_BYPASS_BINDING_FROZEN / NO_MATURITY_CHANGE

## Finding

The canonical D02->D16 receipt guard V0.2 still identifies Wave-1 admission as D02_L4_WAVE1_GATE_V0_1_1.
That guard predates PVE-260~275 baseline-freshness and execution-capacity findings.

A legacy D16 receipt can therefore satisfy the existing statistical receipt guard without proving that its input dataset passed the newer PVE-275 Wave-1 anti-bypass firewall.

## PVE-276 binding

For H001, H20 and H003, D16 consumption additionally requires:
- a PVE-275 PASS receipt for the exact evidence key;
- outcome-blind and pre-outcome creation time;
- immutable receipt hash;
- immutable admitted-dataset hash;
- exact equality between admitted-dataset hash and D16 input-dataset hash;
- admitted row count bound to the common-support input count;
- direct legacy-gate consumption explicitly forbidden.

This wrapper does not replace D16 statistical governance. It composes with the existing V0.2 guard and only closes the newly discovered admission bypass.

No outcome access, maturity promotion or Formal Core change is authorized by PVE-276.
