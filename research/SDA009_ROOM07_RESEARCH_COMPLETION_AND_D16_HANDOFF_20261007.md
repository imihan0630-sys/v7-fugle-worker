# SDA-009 Room07 Research Completion and D16 Handoff — 2026-10-07

Status: ROOM07_RESEARCH_RESPONSIBILITY_COMPLETE / SYSTEM1_R3A1_ENGINEERING_PENDING / GENUINE_RECEIPT_PENDING / D16_VALIDATION_PENDING / SDA_TICKET_NOT_CLOSED / FORMAL_CORE_UNCHANGED

Owner room: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`
Engineering owner: System 1
Validation owner: D16
Closure owner: 00
Date: 2026-10-07 Asia/Taipei

## 1. What Room07 has completed

Room07's research responsibility for SDA-009 is complete at the pre-engineering boundary.

Completed and frozen:

1. circularity mechanism definition;
2. candidate-specific leave-one-out sector semantics;
3. effective-dated/runtime membership lineage requirements;
4. bidirectional self-promotion / self-suppression semantics;
5. current active-path correction:
   - sector hard gate active;
   - priority/ranking path active;
   - capital-allocation spillover active after selection;
   - old sector-score warmup path dormant in the current path;
6. local constituent effect vs cross-sector max-amount normalizer externality;
7. 3+3 pool-local seat semantics;
8. effective deployed comparator authority:
   `PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`;
9. baseline Worker vs built-runtime authority correction;
10. full immutable C1 denominator firewall;
11. P0-P5 identifiability layers;
12. `basePassed=true` denominator rejection;
13. two-row-atom minimal C1 extension:
   - currentChangePercent;
   - currentTradeValue;
14. generation-level membership identity;
15. production sector-decision projection/digest;
16. gate parity vs score parity separation;
17. unclassified pseudo-sector firewall;
18. focal-self-attribution vs full-self-excluded-policy separation;
19. market-consensus input requirement for resurrected self-suppression candidates;
20. R3A1 machine acceptance oracle;
21. System1 minimal engineering handoff.

No further Room07 semantic design is required before the first genuine System1 receipt exists.

## 2. Canonical research artifacts

Core semantics:
- `research/SDA009_D09_LEAVE_ONE_OUT_CIRCULARITY_CONTRACT_V0_1.md`
- `research/SDA009_D09_DEEP_FALSIFICATION_V0_2.md`
- `research/SDA009_R3_IDENTIFIABILITY_AND_COHORT_FIREWALL_V0_3.md`
- `research/SDA009_EFFECTIVE_BUILD_AND_PARITY_CORRECTION_V0_4.md`
- `research/SDA009_R3_CAPTURE_AND_COUNTERFACTUAL_CONTRACT_V0_5.md`

Machine contracts / executables:
- `research/sda009_d09_leave_one_out_circularity_contract_v0_1.json`
- `research/sda009_r3_identifiability_contract_v0_3.json`
- `research/sda009_effective_build_parity_correction_v0_4.json`
- `research/sda009_r3_capture_and_counterfactual_contract_v0_5.json`
- `research/sda009_c1_atomic_replay_prototype_v0_4.mjs`
- `research/sda009_r3_receipt_oracle_v0_4.mjs`
- `research/sda009_r3_capture_contract_v0_5.mjs`
- `research/sda009_r3a1_acceptance_oracle_v0_6.mjs`

Engineering handoff:
- `research/SDA009_SYSTEM1_R3A1_MINIMAL_CAPTURE_HANDOFF_V0_5.md`

## 3. Current executable validation

Latest isolated execution performed after reading back latest-main file content:

`node test_sda009_r3_capture_contract_v0_5.mjs`
- PASS
- 12 assertions

`node test_sda009_r3a1_acceptance_oracle_v0_6.mjs`
- PASS
- 23 assertions

The local container had no external DNS, so repository files were first read through the authenticated GitHub connector and reconstructed in an isolated local directory for execution. The DNS limitation was not treated as a test failure or success.

These tests validate contract/oracle semantics only.

Genuine Taiwan candidate-level SDA-009 receipt count remains:
`0`.

## 4. Exact System1 remaining work

### R3A1 — minimum capture

Per complete C1 row:
- currentChangePercent;
- currentTradeValue.

Per C1 generation:
- classificationSchemeId;
- membershipVersion;
- membershipDigest;
- sectorDecisionStateVersion;
- sectorDecisionStateProjection;
- sectorDecisionStateDigest.

All are already available from data in the current C1 builder / already-built production sectorStats path.

Required:
- zero new provider calls;
- no Formal gate change;
- no Formal rank change;
- no 3+3 change;
- no allocation/capital change;
- no signal/push/order change.

### R3A1-PARITY — first genuine receipt

Run:
`research/sda009_r3a1_acceptance_oracle_v0_6.mjs`

Required result:
`state = PASS`
and
`authorization.r3a1ParityPass = true`.

Only then can candidate LOO gate/score analysis proceed.

### R3A2 — ranking completion

Add same-generation:
- marketConsensusSources; OR
- exact marketConsensusBonus

for all feature-admitted rows.

Then produce two separately labeled counterfactuals:
- `SDA009_FOCAL_SELF_ATTRIBUTION_V0_1`;
- `SDA009_FULL_SELF_EXCLUDED_POLICY_V0_1`.

Do not merge these into one rank/seat metric.

## 5. D16 handoff trigger

D16 work must NOT start from deterministic fixtures.

D16 becomes evidence-active only after:
1. genuine same-generation C1 parent exists;
2. R3A1 acceptance oracle PASS;
3. candidate-level LOO receipt exists;
4. P0-P5 counts are visible;
5. blocked/unknown rows remain visible.

## 6. D16 required denominator accounting

For every admitted scan date report:

- P0: full immutable same-generation C1 population;
- P1: SECTOR_GATE_REACHED;
- P2: LOO_MECHANICALLY_IDENTIFIABLE;
- P3: DECISION_RELEVANT_EX_SECTOR;
- P4: RANK_IDENTIFIABLE;
- P5: ALLOCATION_IDENTIFIABLE;
- BLOCKED count;
- UNKNOWN count.

Also stratify missingness/coverage by:
- GENERAL vs THOUSAND pool;
- classified vs UNCLASSIFIED_PSEUDO_BUCKET;
- industry member-count bands;
- history-ready coverage bands.

Complete-case-only rates are not accepted.

## 7. D16 estimands — frozen in layers

### Layer A — mechanical circularity

Primary descriptive quantities:
- self-promotion gate-flip incidence among P2;
- self-suppression gate-flip incidence among P2;
- sectorScore delta distribution among score-parity PASS rows;
- local constituent contribution distribution;
- max-normalizer externality distribution.

No alpha claim.

### Layer B — decision relevance

Among P3/P4:
- decision-relevant gate-flip incidence;
- pool-local rank change;
- GENERAL Top3 seat changes;
- THOUSAND Top3 seat changes;
- focal-attribution vs full-self-excluded-policy disagreement.

No return outcome is needed for this layer.

### Layer C — allocation sensitivity

Among P5:
- PURE_SCORE_WEIGHT_EFFECT;
- SELECTION_COMPOSITION_EFFECT;
- DEPLOY_RATIO_REGIME_EFFECT;
- POSITION_CAP_EFFECT;
- NTD_FLOORING_EFFECT;
- residual-cash delta;
- peer allocation redistribution.

Mechanical capital movement is not economic superiority.

### Layer D — economic incrementality

Only after Layers A-C are prospective and stable.

D16 must use strictly future outcomes and common support.

At minimum control/stratify for:
- own-stock momentum / price state;
- pool;
- sector size/concentration;
- classification vintage;
- liquidity;
- market/regime state only if preregistered PIT-valid;
- overlap/dependence across candidates sharing industries/dates.

Required:
- OOS/prospective evaluation;
- multiple-testing guard;
- clustered/dependence-aware uncertainty;
- coverage/missingness receipts;
- costs where the estimand is allocation/trading performance.

Do not choose horizons or thresholds after viewing outcomes.

## 8. Closure interpretation

Possible findings are not binary.

Acceptable final interpretations include:
- circularity exists mechanically but has no material decision effect;
- gate self-effects exist but rarely affect pool seats;
- rank/seat effects exist but no economic incrementality;
- full self-excluded policy improves robustness;
- full self-excluded policy degrades robustness;
- effects are concentrated in small-N sectors and should be treated as a support/uncertainty problem;
- insufficient evidence / blocked.

No finding automatically authorizes a Formal Core change.

## 9. Ticket status

`SDA-009` remains:
- severity: CRITICAL;
- status: REMEDIATION_IN_PROGRESS;
- Formal Core impact authorized: NONE.

Room07 research work being complete does NOT mean the SDA ticket is closed.

Closure still requires:
1. System1 engineering guard/receipt/tests;
2. D16 common-support incrementality/OOS validation;
3. 00 independent cross-domain readback and closure.

## 10. Room07 exact next continuation point

Until System1 emits a genuine R3A1 receipt:
`WAIT_FOR_GENUINE_SYSTEM1_R3A1_RECEIPT / DO_NOT_REDESIGN_SEMANTICS`.

When the receipt exists:
1. run `sda009_r3a1_acceptance_oracle_v0_6.mjs`;
2. if PASS, run candidate LOO replay;
3. run `sda009_r3_receipt_oracle_v0_4.mjs`;
4. freeze P0-P5 readback;
5. hand immutable result to D16.

If R3A1 receipt fails:
return the exact blocker to System1.
Do not weaken parity or denominator rules to make the receipt pass.

## Maturity decision

D09 remains 57.1%.

Reason:
research semantics and executable acceptance are complete, but empirical maturity is not promoted without genuine Taiwan receipts and D16 outcome evidence.
