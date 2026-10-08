# D05 C3 prospective admission negative tests — 2026-10-08

Research-only synthetic fixtures; no L4 credit.

1. Valid C1/C2, no Shadow-only cohort => STRUCTURAL_EMPTY, not BAD.
2. READY_TO_REGISTER without persisted server acknowledgement => REGISTRATION_UNKNOWN.
3. Registration after first required slot => PRESESSION_CLOCK_FAIL.
4. Generation, symbol or session mismatch => IDENTITY_FAIL.
5. Carried-forward quote after reconnect => NOT_NEW_OBSERVATION.
6. Missing two-sided quote => spread parent UNKNOWN.
7. Incomplete top-five => depth parent UNKNOWN.
8. Different spread/depth valid rows => exact intersection only for liquidity vector.
9. Stress-day missing capture => keep date in opportunity denominator.
10. Reused source primitive => no triple independent vote.

Do not inspect economic outcomes before admission coverage is frozen.