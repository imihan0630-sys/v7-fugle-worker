# D02 PVE-281 — Canonical end-to-end admission lineage

Date: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / ALL_D02_EVIDENCE_KEYS_CANONICAL_LINEAGE_ENTRY_FROZEN / NO_MATURITY_CHANGE

## Purpose

D02 now has three strengthened downstream bindings:
- PVE-280 for D02-01 semantic governance;
- PVE-276 for Wave-1 H001/H20/H003;
- PVE-279 for all ten Wave-2 evidence keys/families.

PVE-281 removes routing ambiguity by defining one canonical D02->D16 entrypoint for all 14 evidence keys.

## Routing

- D02-01:SEMANTIC_GOVERNANCE -> PVE-280.
- D02-02:H001, D02-03:H20, D02-06:H003 -> PVE-276.
- D02-04/05/07/08/09/10/11/12 Wave-2 keys -> PVE-279.

Every route requires exact admitted-dataset identity and a pre-outcome/outcome-blind admission receipt.

A legacy D02 admission version remains useful as an inner historical/component contract but cannot by itself satisfy current canonical D02->D16 lineage.

PVE-281 does not authorize D02 to self-certify statistical adequacy. D16 retains statistical ownership.
PVE-281 does not authorize L4 promotion or Formal Core change.
