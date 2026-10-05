# Stock Selection Audit — MEDIUM Reconciliation 2026-10-05 V0.1

Status: MEDIUM_TICKETS_RECONCILED / FIRST_FULL_QUEUE_BASELINE_COMPLETE
Scope: SDA-020 / SDA-021
Formal Core impact: NONE
Parent queue: `shared-knowledge/STOCK_SELECTION_AUDIT_QUEUE.md`

## SDA-020 — D21 governance/insider hindsight and motive inference

Existing controls accepted:
- D21 historical governance research repeatedly enforces conservative public-known-at timing and does not backfill later adjudication into the original event date.
- D21-11 explicitly transitions UNKNOWN/AMBIGUOUS/HIGH_SUSPICION/CONFIRMED only as public evidence becomes available; later court findings cannot relabel the earlier decision-time state.
- related-party transactions are not mechanically classified as tunneling; beneficiary/terms/control evidence is required and justified-RPT controls are retained.
- management guidance credibility uses rolling outcomes known by the decision timestamp and avoids permanent trait labels from small samples.
- succession uses historical state transitions rather than current roster.
- ESG/materiality research rejects generic composite scores and preserves disclosure-regime/methodology vintage.
- D21 tracker keeps insider monthly knownAt and original pledge-event receipt gaps explicit rather than inferring motive from transactions.

Missing delta:
- D21-03 authoritative monthly insider knownAt remains incomplete;
- D21-04 original pledge setup/release receipts remain incomplete;
- insider transaction motive remains unidentifiable without separate evidence and must stay UNKNOWN;
- a generic System 1 governance/insider event sourceVintage/knownAt/issuer-universe lineage is not yet established for all future selection consumers;
- OOS/prospective incremental value beyond size/industry/fundamentals/event controls remains unproven.

Decision:
`REMEDIATION_IN_PROGRESS / HINDSIGHT_FIREWALL_STRONG / INSIDER_PLEDGE_CLOCK_AND_SYSTEM_LINEAGE_PENDING`.

## SDA-021 — D22 sparse-credit coverage / accounting duplication / fair-value-as-trade

Existing controls accepted:
- D22 is explicitly decomposed into non-additive layers and states that the same primitive cannot create multiple votes across maturity, coverage, leverage, refinancing, ratings, spreads, covenants, repricing, divergence, capital structure, credit supply and recovery.
- D07 remains owner of accounting leverage; D22 owns credit/funding residual semantics rather than a second leverage vote.
- D22-06 explicitly states corporate spread/fair value is not identical to expected default loss or actual transaction price.
- TPEx fair-value/reference data are kept in a separate provenance lane and are never labeled actual trades.
- D22-12 explicitly identifies rated-survivor/class-imbalance risk and requires defaulted/delisted/unrated cases plus security seniority/collateral/recovery-date semantics.
- D22 Stage-A requires exact common support and keeps mature paired anchors at zero when D07/D13/D11 baselines cannot be reconstructed for the exact same issuer-date population.
- repeated same-direction rating actions are episode-clustered so they do not masquerade as independent samples.

Missing delta:
- D22-05 exact B0/B1 same-population baseline remains unfrozen for its 22 episode anchors;
- D22-04/D22-06 reproducible multi-date market-credit transport and actual trade/quote history remain incomplete;
- D22-12 instrument-level seniority/collateral/guarantee/recovery-waterfall replay remains the COV-12 blocker;
- System 1 CREDIT_CAPITAL_STRUCTURE lineage/coverage eligibility is not yet complete for future selection use;
- sparse-coverage and D07-accounting residual incrementality remain unproven.

Decision:
`REMEDIATION_IN_PROGRESS / CREDIT_LAYER_AND_PROVENANCE_FIREWALL_STRONG / SAME_POP_BASELINE_MARKET_CREDIT_AND_RECOVERY_EVIDENCE_PENDING`.

## Overall result

This completes the first full D01-D22 SDA reconciliation baseline:
- every ticket has a durable state;
- existing controls are credited;
- missing deltas are frozen;
- protected owner gates remain protected;
- no ticket is CLOSED merely from documentation or maturity.

No Formal behavior changed.
