# D01 DL-113~115 Test Evidence

Updated: 2026-10-08 Asia/Taipei

Initial execution: 27/28 PASS; one failure exposed status-field precedence in the fanout helper, where the generic accounting status overwrote the specific ONE_ROOT_MULTI_SCALE_FANOUT status.
The helper was corrected by reversing object-spread precedence without changing research semantics or test expectations.

Final deterministic suite: 28/28 PASS.
Cumulative D01 deterministic suite through DL-115: 437/437 PASS.

This is research test evidence only. It does not claim native Node parity, physical R1-R7 completion, OOS/prospective performance, SDA closure, or Formal Core change.
