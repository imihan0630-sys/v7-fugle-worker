# Stock Selection Audit — Critical Intake 2026-10-06 V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CRITICAL_REMEDIATION_RECEIPTS_INTAKEN / NO_TICKET_CLOSED
Owner: 00｜研究總控室
Formal Core impact: NONE
Authority: latest GitHub main at readback

## Scope

This intake processes new durable remediation evidence that landed after the first full D01-D22 SDA baseline.

Tickets:
- SDA-001
- SDA-004
- SDA-009
- SDA-016
- SDA-017

Accepted controls are credited. Only remaining deltas are carried forward.

## SDA-001 — same-root PRICE_OHLC multi-vote

New accepted evidence:
- System 1 PR #608 is merged.
- `research/system1_sda_shadow_v0_1.mjs` exists on main.
- deterministic Class-A offline diagnostics now emit:
  - factor lineage;
  - information-root overlap matrix;
  - redundancy-group contributions;
  - raw active-signal count;
  - deduplicated evidence-family count;
  - raw-vote Shadow Top6;
  - dedup Shadow Top6;
  - rank sensitivity.
- missing lineage / PIT-invalid clocks fail closed.
- current implementation deliberately keeps `effectiveIndependentEvidenceCount=0` and no promotion path.
- Formal selected symbols remain reference-only; `decisionImpact=false`.
- D03 consumer mapping readback passes the core mapping conservatively.

Remaining machine-contract gaps found by D03 readback:
1. explicit top-level `redundancyGroupContributions`;
2. explicit top-level `dominantInformationRoots`;
3. stable overlap identity by factorId + factorVersion rather than indices only.

Still required:
- first genuine-session System 1 SDA receipt using verified same-generation lineage input;
- System 2 corresponding lineage/dedup diagnostic;
- D16 common-support residual/OOS incrementality;
- independent 00 closure.

Decision:
`REMEDIATION_IN_PROGRESS / SYSTEM1_CLASS_A_MERGED_PASS_WITH_SCHEMA_GAPS`.

## SDA-004 — indicator zoo / alias stacking / parameter snooping

New accepted evidence:
- System 1 PR #608 pins the canonical D03 registry digest.
- retired D03-11 resolves to canonical D03-02.
- aliases cannot drift parameters or experiment family.
- conflicting duplicate versions are rejected.
- cosmetic/alias registration cannot create an independent-evidence promotion path.
- D03 consumer mapping review reports alias/retirement mapping PASS and same-root connected dedup PASS_CONSERVATIVE.

Still required:
- shared three diagnostic schema deltas above;
- first genuine-session receipt;
- System 2 corresponding redundancy/alias consumer behavior where D03-derived signals are used;
- D16 parameter-family multiplicity and residual/OOS evidence;
- independent 00 closure.

Decision:
`REMEDIATION_IN_PROGRESS / SYSTEM1_ALIAS_PARAMETER_CORE_GUARD_MERGED`.

## SDA-009 — circular industry-strength reward

New accepted evidence:
- Room07 froze `research/sda009_d09_leave_one_out_circularity_contract_v0_1.json`.
- confirmed current circularity paths include:
  - sector hard gate;
  - sector-rank score;
  - history-warmup priority.
- the contract requires candidate-specific inclusive-vs-leave-one-out state, effective-dated membership, membershipVersion and classificationSchemeId.
- zero-peer or missing-history-ready peer is UNKNOWN, never zero.
- candidate-specific max-sector-amount normalizer must be recomputed after exclusion.
- adversarial witness demonstrates that a single strong candidate can flip its own hard gate and materially inflate the sector component of priorityScore.

Still required:
- System 1 candidateSelfContribution/inclusive-vs-LOO diagnostic;
- gateFlip/rankDelta/Top6 sensitivity receipt;
- D16 common-support validation;
- independent 00 closure.

Decision:
`REMEDIATION_IN_PROGRESS / D09_SEMANTICS_FROZEN / ENGINEERING_PENDING`.

This ticket is no longer merely ROUTED.

## SDA-016 — validator self-confirmation / repeated OOS consumption

New accepted evidence:
- Room11 specialist return remains explicitly NOT_CLOSED.
- System 1 exact-dataset/mutation holdout guard receives partial-pass validation.
- Room11 V0.2 oracle expands the closure contract to 30 blocking tests.
- contamination is now correctly defined by information-release lineage, not merely raw-row access.
- partial decision-date overlap and target-specific outcome-information-footprint overlap are separate.
- downstream hypotheses influenced by outcome-derived recommendations inherit consumption lineage across rooms/systems.
- admission/maturity missingness and censoring must be reported.
- multi-horizon inspection belongs to one multiplicity/consumption family unless primary horizon was frozen ex ante.

Still required:
- shared System1+System2 canonical consumption authority;
- partial-date and outcome-footprint overlap accounting;
- release lineage / parentReleaseIds / recipient scope / downstream hypothesis references;
- admission/maturity missingness accounting;
- V0.2 T01-T30 pass;
- independent 00 closure.

Decision:
`REMEDIATION_IN_PROGRESS / ROOM11_V0_2_ORACLE_FROZEN / SYSTEM1_PARTIAL_PASS`.

## SDA-017 — post-hoc Regime mining

New accepted evidence:
- Room11 V0.2 oracle expands the closure contract to 40 blocking tests.
- existing fixed-semantic D18 machine components retain a partial pass:
  future rows rejected, same decision clock enforced, trailing-history state computation and UNKNOWN/CONTEXT_RAW preservation.
- outcome-free Regime construction is explicitly not sufficient for PIT if a learned/fitted threshold/scaler/PCA/clustering/latent-state model uses full-sample information.
- future learned dimensions must bind a fit receipt with knowledge cutoff <= decision clock.
- episode accounting now separates:
  - structuralEpisodeN;
  - replicationEpisodeN;
  - mechanicalFragmentN.
- active episodes are right-censored, not absent.
- DECISION_STATE_CONDITIONAL remains the primary prospective policy estimand.

Still required:
- executable System 2 episode/support observer;
- official-session adjacency and episode-break semantics;
- support/occupancy/transition/paired-support states;
- fitReceipt lineage for learned dimensions;
- Regime observability/capture coverage;
- explicit SDA-016 consumption link;
- V0.2 T01-T40 pass;
- genuine prospective multi-episode matured evidence;
- independent 00 closure.

Decision:
`REMEDIATION_IN_PROGRESS / ROOM11_V0_2_ORACLE_FROZEN / SYSTEM2_ENGINE_PENDING`.

## Formal isolation

No accepted artifact in this intake changes:
- A/B eligibility;
- Formal ranking;
- Top6;
- weights;
- thresholds;
- capital;
- BUY/ADD/REDUCE/SELL/STOP;
- 15m semantics;
- notifications;
- Production runtime behavior.

Formal Core remains LOCKED.

## Exact next

1. System 1 completes only the three remaining Class-A diagnostic schema deltas for SDA-001/004 and produces the first genuine-session receipt when verified lineage input exists.
2. System 1 implements SDA-009 inclusive-vs-LOO D09 diagnostic without Formal mutation.
3. System 2 implements the corresponding SDA-001/004 lineage consumer and SDA-017 episode/support observer under existing lane governance.
4. System 1 + System 2 converge the SDA-016 canonical consumption authority against Room11 V0.2 T01-T30.
5. Room11 revalidates only new engineering deltas; do not redo accepted semantics.
6. 00 advances tickets only after durable receipts; no ticket is closed in this intake.
