# D01 DL-132~137 Test Evidence

Updated: 2026-10-10 Asia/Taipei

DL-132~134 deterministic suite: 25/25 PASS.
DL-135~137 deterministic suite: 25/25 PASS.
This tranche: 50/50 PASS.
Cumulative D01 deterministic V8-equivalent suite through DL-137: 643/643 PASS.

One semantic defect was found and corrected before final evidence:
SECURITY_CLASS_UNKNOWN was initially at risk of being collapsed into ineligible-by-design.
The oracle now preserves unknown class as a fail-closed unknown state, while explicit preferred/fund/note/warrant/other classes remain ineligible by design.

This is research test evidence only.
It does not claim native Node parity, physical R1-R6 completion, physical R7 emission, OOS/prospective performance, SDA closure, or Formal Core change.
