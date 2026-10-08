# D16-17 historical panel and D18 regime denominator research

Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED.

Canonical evidence at 2026-10-09: D16=64.0%, D18=54.7%, aggregate=47.8%. D16-17 remains L2/40. The accepted Taiwan numeric physical batch promoted D16-16/18/19/24, not D16-17.

New static finding: research/room11_numeric_l3_batch_v0_1.mjs sets d16_17L3Eligible and promotionsEligible.D16_17_PANEL_CROSS_SECTION to true even when its historical membership is fetched into memory rather than read from a persisted receipt. The formal acceptance packet expressly withholds D16-17 promotion. Treat the flags as unverified readiness hints, not maturity evidence.

Hypothesis: complete immutable current-plus-delisted membership supports survivorship-aware panel estimation.
Support: exact issuer-date membership intervals.
Falsification: later-delisted issuers missing from earlier active dates; mismatched registry identity; incomplete member list.
Alternative: the observed 12-symbol availability cohort is mistaken for full-market coverage.
Failure: immutable full-member lineage and exact historical interval readback unavailable.

Regime implication: D18 policy effects must be compared over the same decision-date and issuer-date opportunity support; data completeness cannot select favorable regimes. Keep UNKNOWN separate from zero. Do not open outcomes or modify Formal rules.
