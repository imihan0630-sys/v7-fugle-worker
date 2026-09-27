# FUNDAMENTAL COMPONENT AVAILABILITY — Prospective Receipt Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-B PROPOSAL ONLY / NOT IMPLEMENTED  
Formal Core: LOCKED

## Reuse, do not create another data model

This receipt should extend the already-proposed FINANCIAL source-vs-merged same-generation evidence rather than create a competing Shadow cohort.

Per symbol capture:
- parent decision generation/fingerprint;
- exact pre-fundamental Formal reach;
- canonical FINANCIAL source-membership state;
- source-vs-merged alignment class;
- raw nine component fields;
- 9-bit availability signature;
- revenueMoM raw presence / numeric state;
- revenueQoQ numeric state;
- chosen MoM-or-QoQ slot source;
- financialDataCount;
- fundamentalScore pre-clamp and final score;
- count gate state;
- quality gate state;
- GENERAL/THOUSAND pool and channel.

Quality guards:
- zero is observed, not missing;
- invalid non-null MoM is not silently replaced by QoQ in research replay;
- canonical-source-complete rows should have at least six countable slots; violations are provenance/version/invariant alerts;
- count<3 rows are not labeled economically weak until source state is known;
- no outcomes in selection-time receipt.

Engineering boundary:
all inputs already exist in the scan; zero new source calls.

Durable full-population persistence is Class B and requires owner approval.

Any change to component definitions, >=3 threshold, score formula, 25 threshold or fallback semantics is Class C.

No implementation is performed here.
