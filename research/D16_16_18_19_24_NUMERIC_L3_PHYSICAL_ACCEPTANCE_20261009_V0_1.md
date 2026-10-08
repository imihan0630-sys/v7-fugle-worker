# D16-16 / D16-18 / D16-19 / D16-24 Numeric L3 Physical Acceptance — 2026-10-09 V0.1

Updated: 2026-10-09 Asia/Taipei
Status: RESEARCH_ONLY / FOUR_MODULE_L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System1 runtime impact: NONE
System2 strategy-authority impact: NONE

## Scope

This packet accepts four D16 modules from L2/40 to L3/60 at data/method feasibility maturity only:

- D16-16 Time-series models;
- D16-18 Regularization / feature selection;
- D16-19 ML / probability calibration tooling;
- D16-24 Monte Carlo / distributional validation.

It does NOT accept:
- D16-17 Panel / cross-section;
- D16-25 Probabilistic / Bayesian decision layer.

It does NOT claim:
- stock-return alpha;
- economic profitability;
- production selection value;
- full-market population inference;
- System1/System2 strategy improvement.

## Canonical physical run

Workflow:
`Research Room11 Numeric L3 Physical Readonly`

Run:
`37805085401`

Exact head:
`8d8237d5c765782e120f2258d55633a7d2256aaa`

Conclusion:
`SUCCESS`.

All workflow steps passed:
- pure fail-closed / leakage tests;
- bounded real Taiwan numeric batch;
- repository isolation;
- physical artifact upload.

Physical artifact:
- artifact id: `11562023285`;
- artifact name: `room11-numeric-l3-physical-8d8237d5c765782e120f2258d55633a7d2256aaa`;
- artifact digest: `sha256:e39583068a4a7baca59f6c13d9aae549a9d6489e9fd8d4932adb9bca5c3c4279`;
- physical receipt hash: `51eec07be8f55d7313cee739b44dd8383ea685d809d0ef431c3e126a09121287`.

## Durable source anchor

The physical replay is anchored to previously accepted 2025 TWSE annual history evidence:

- run: `37720726697`;
- head: `836184f98726449107cdbd0ed83e2746bbbcf965`;
- artifact: `11527595746`;
- artifact digest: `sha256:41ab589d5f38e667f8fb61427d2053d38d9f62d23e044d22a8c7e0f441cd56df`;
- annual manifest rolling hash: `4b01e356aae94e5b1be6c40732602c342bc3ba9c43c1851b1cf6778d3063a29d`;
- pack count: 1070;
- bar count: 254,854;
- official TWSE trading-date count: 243;
- source reconciliation: PASS.

During the accepted Room11 run, Cloudflare D1 returned its free-tier daily row-read-limit error.

The Room11 runner did not treat that quota failure as evidence.

Instead it used a bounded R2-only read fallback that:
1. activates only for the explicit D1 free-tier row-read-limit condition;
2. reads the same already-accepted immutable 2025 TWSE R2 cold objects;
3. requires exactly 1070 unique ordinary-symbol annual RAW pack keys;
4. rejects multiple immutable annual packs per symbol;
5. verifies R2 payload-hash metadata;
6. verifies stored object SHA-256;
7. verifies pack schema;
8. decompresses and verifies canonical pack payload identity;
9. performs no D1 or R2 writes.

Other D1 failures remain fail-closed.

## Physical cohort

The accepted bounded cohort contains 12 real TWSE symbols:

`1101, 1102, 1103, 1104, 1108, 1109, 1110, 1201, 1203, 1210, 1213, 1215`.

Physical panel summary:
- issuer count: 12;
- independent decision dates: 238;
- model rows: 2,845;
- nominal decision dates before boundary purge: 240;
- train decision dates: 143;
- validation decision dates: 47;
- test decision dates: 48;
- D1 rowsWritten: 0.

The cohort is explicitly:
`BOUNDED_PHYSICAL_BAR_COHORT_MEMBERSHIP_NOT_D1_RECEIPT_BOUND`.

It is NOT authorized for full-market population inference.

## D+1 boundary leakage correction

Before the accepted run, Room11 found a real leakage defect in the 60/20/20 chronological partition:

a TRAIN decision on the last train date could have a D+1 label in the first VALIDATION date, and the last VALIDATION decision could have a D+1 label in the first TEST date.

The accepted runner now purges those rows.

Physical evidence:
- TRAIN -> VALIDATION boundary purged rows: 12;
- VALIDATION -> TEST boundary purged rows: 11.

Hard rules:
- TRAIN outcomeDate < firstValidationDate;
- VALIDATION outcomeDate < firstTestDate.

Pure adversarial suite:
17 / 17 PASS.

The suite also verifies:
- exact official-session windows;
- no stale-session substitution;
- late evidence rejection using the canonical historical availability clock;
- pre-transport read-only SQL guard;
- membership interval semantics;
- official delisting-date exclusivity;
- registry hash/count fail-closed behavior;
- deterministic model selection;
- outer-test isolation;
- deterministic dependence-preserving bootstrap.

## D16-16 acceptance — Time-series models

Physical method:
a per-symbol AR(1)-style next-session log trade-value baseline on the bounded real Taiwan PIT cohort.

Evidence:
- 12 executable symbol models;
- training and test partitions are chronological;
- D+1 boundary labels are purged;
- current feature evidence must be available by the decision clock;
- next-session label evidence must not be available by the decision clock;
- real immutable R2 rows are consumed;
- deterministic replay is possible.

This establishes:
`L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`.

It does not establish:
- time-series stock-return predictability;
- economic value;
- L4 OOS performance.

## D16-18 acceptance — Regularization / feature selection

Physical nested selection:
candidate feature families:
- `LAG_TV`;
- `LAG_TV_TXN`;
- `LAG_TV_TXN_VOL`.

Ridge lambda family:
`0, 0.1, 1`.

Physical selected candidate:
- family: `LAG_TV_TXN_VOL`;
- lambda: `1`;
- validation MSE: `0.8254541802380958`;
- test MSE after refit: `0.8727593456319668`;
- candidate count: 9;
- train rows: 1,712;
- validation rows: 557;
- test rows: 576.

Critical guards:
- outer test used for selection = false;
- preprocessing fit on outer test = false;
- D+1 boundary purge active.

This establishes nested Taiwan PIT feature-selection feasibility only.

No selected feature family is promoted to Formal Core.

## D16-19 acceptance — ML / calibration tooling

Physical binary diagnostic target:
`NEXT_SESSION_TRADE_VALUE_UP_DIAGNOSTIC_NOT_RETURN_ALPHA`.

Physical result:
- train rows: 1,712;
- test rows: 576;
- Brier score: `0.24559490566223208`;
- identity calibration: true;
- outer test used for model selection: false;
- deterministic probability bins produced.

This establishes:
`L3_TAIWAN_PIT_ML_CALIBRATION_TOOLING_FEASIBILITY`.

Critical firewall:
this is NOT the canonical stock-return `CalibrationReceipt`.

It does not satisfy:
- SDA-022 D5 return calibration;
- D16-25 decision-layer input;
- any numerical MDE/precision freeze;
- any stock-selection Alpha claim.

D16-19's SDA-022 effect target remains:
`TARGET_VALUE_PENDING_FREEZE`.

## D16-24 acceptance — Monte Carlo / distributional validation

The accepted distributional feasibility object uses real date-level Taiwan input deltas before simulation.

Physical input:
- independent empirical date count: 190.

Frozen bootstrap:
- block length: 5;
- path length: 20;
- simulation count: 500;
- seed version: `LCG_160024_V0_1`;
- q05: `-1.7868463770033665`;
- q50: `0.016654117682432704`;
- q95: `1.4675036098216978`.

Critical firewall:
`syntheticPathCountIsEmpiricalN=false`.

The 500 simulated paths are not 500 empirical observations.

This establishes deterministic dependence-preserving Taiwan PIT distributional-simulation feasibility.

It does not establish stock-return risk or economic edge.

## Why D16-17 remains L2

The durable annual verifier proves an official 2025 TWSE current + new-listing + delisting union exists in its physical artifact:

- registry id: `S2-DATA-TWSE-2025-OFFICIAL-UNION-V0.1`;
- registry hash: `8d6d57a6a7791a95cd48c4cb98ddb41a9af2ce6415d619995bafcaf5a1915535`;
- membership count: 1,096;
- replay-eligible count: 1,096;
- current: 1,089;
- delisted: 7;
- unknown start: 0.

However the annual physical verifier builds that registry in memory and does not persist a matching row-level registry receipt/membership set into the D1 tables consumed by Room11.

The accepted numeric run therefore recorded:
- persistedRegistryReceiptPresent=false;
- persistedMembershipRowCount=0;
- survivorshipAwareMembershipApplied=false;
- D16_17_PANEL_CROSS_SECTION=false.

Thus D16-17 remains L2/40.

A bounded fully-observed bar cohort cannot substitute for a survivorship-aware issuer-date population.

## Why D16-25 remains L2

D16-25 consumes a genuine canonical calibrated-belief / decision ledger.

The D16-19 physical calibration in this packet is only tooling feasibility on a non-return diagnostic target.

Therefore:
- D16_25_PROBABILISTIC_DECISION=false;
- no Bayesian/utility/risk-coverage promotion;
- no ABSTAIN policy validation;
- no Formal decision authority.

D16-25 remains L2/40.

## Formal / runtime isolation

Physical receipt confirms:
- rowsWrittenZero=true;
- Formal Core changed=false;
- System1 runtime used=false;
- System2 strategy authority changed=false;
- alphaClaimMade=false;
- priceReturnClaimMade=false.

Workflow repository-isolation step passed:
- no Worker.js modification;
- no wrangler.toml modification;
- research script does not import Worker.js.

## Maturity decision

Promote:
- D16-16: L2/40 -> L3/60;
- D16-18: L2/40 -> L3/60;
- D16-19: L2/40 -> L3/60;
- D16-24: L2/40 -> L3/60.

Hold:
- D16-17: L2/40;
- D16-25: L2/40.

After these four promotions, D16 distribution becomes:
- L4: 10;
- L3: 10;
- L2: 5.

D16 maturity:
64.0%.

## L4 blockers

D16-16:
real return/horizon estimand, stronger baseline family, chronological OOS/prospective evidence.

D16-18:
frozen research family, true target, common-support OOS, feature-family multiplicity accounting.

D16-19:
canonical Taiwan stock-return prediction/calibration receipt, genuine outcomes, target/precision freeze where required.

D16-24:
decision-relevant empirical distribution, dependence specification, realized distributional validation, no synthetic-N inflation.

## Exact next

Remaining D16 L2 modules after this acceptance:
- D16-17 Panel / cross-section;
- D16-20 Causal inference;
- D16-21 Alternative data;
- D16-22 NLP / LLM;
- D16-25 Probabilistic / Bayesian decision.

Priority:
1. D16-17: obtain a durable consumable historical-universe membership receipt or authorized exact equivalent, then rerun the panel membership gate.
2. D16-20: find a real Taiwan PIT event/treatment cohort with pre-treatment covariates and overlap diagnostics.
3. D16-21: locate a real Taiwan alternative-data entity-linked panel.
4. D16-22: locate a PIT text corpus with immutable document/model/prompt clocks.
5. D16-25: wait for a genuine canonical calibrated decision ledger; do not use this diagnostic calibration as a substitute.
