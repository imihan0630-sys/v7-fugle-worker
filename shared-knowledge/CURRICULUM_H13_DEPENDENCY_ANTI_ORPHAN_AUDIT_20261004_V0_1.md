# H13 Dependency + Anti-Orphan Audit 2026-10-04 V0.1

Status: CLOSED_NO_STRUCTURAL_CHANGE
Audit base main: `c482e149a8ce6ab25c4ea0f6d8db88690a694eb5`
Cluster: H13 — D07-06 vs D22-03
Formal Core impact: NONE

## Accepted evidence

Room06 accounting/balance-sheet evidence:
- `FUNDAMENTAL_INFORMATION_DYNAMICS_CHECKPOINT.md`
- D07-06 canonical tracker state.

Room15 credit/funding evidence:
- `CREDIT_CAPITAL_STRUCTURE_RESEARCH.md`
- `CREDIT_CAPITAL_STRUCTURE_CHECKPOINT.md`
- `research/d22_03_net_debt_leverage_structure_contract_v0_1.json`
- `research/d22_03_net_debt_component_replay_v0_1.json`
- `research/d22_03_version_lineage_v0_1.json`

## Canonical ownership

### D07-06 — accounting balance-sheet/leverage primitive owner

Owns:
- balance-sheet assets/liabilities/equity;
- accounting debt/cash fields;
- leverage quality in accounting context;
- general-industry vs financial-institution applicability firewall;
- raw accounting statement vintages.

### D22-03 — credit/funding structure transform owner

Owns:
- interest-bearing-debt composition;
- liquidity-quality classification;
- restricted/pledged/unavailable cash treatment;
- derived net debt;
- debt structure/funding context;
- linkage to D22-01 contractual maturity wall;
- credit/funding interpretation after accounting primitives are frozen.

Net debt is derived, never a raw source fact.

## Divergent-state audit

PASS.

Chunghwa Telecom example:
- 2023 derived net debt ≈ -NT$1.139bn with <1y financing ≈ NT$2.2bn.
- 2024 derived net debt ≈ -NT$3.845bn while <1y financing rises to ≈ NT$9.2bn.

Headline net cash improved while near-term financing concentration worsened.

Therefore:
`ACCOUNTING_NET_CASH_IMPROVEMENT != LOW_REFINANCING_RISK`.

D22-03 adds residual credit/funding semantics beyond D07-06.

## PIT / version-lineage audit

PASS.

ASE 2023 replay demonstrates:
- first-known balance-sheet state preserved at the historical known_at;
- later comparative-file restatement is appended as a later vintage;
- later short-term-borrowing revision does not overwrite the earlier state.

## Dependency Audit

Producer:
- D07-06 raw accounting balance-sheet/leverage receipt.

Credit transforms:
- D22-03 net debt / liquidity-quality / debt-structure context;
- D22-01 contractual maturity schedule as separate financing-cash-flow representation.

Rules:
- carrying debt and contractual maturity cash flows are alternate/linked representations, not additive;
- restricted/pledged/unavailable cash remains separate or UNKNOWN;
- unused credit lines do not become available liquidity without drawability/commitment evidence.

Result:
`PASS_ACCOUNTING_TO_CREDIT_TRANSFORM_GRAPH`.

## Anti-double-count

1. debt/equity/cash accounting fields have one D07 parent receipt;
2. D22-03 may transform them into credit/funding structure but cannot recount the same ratio as independent evidence;
3. net debt is a derived child, not a second primitive;
4. D22-01 maturity wall is linked exposure, not added to carrying debt;
5. D22-03 credit context cannot become a duplicate D07 leverage vote.

Result:
`PASS_SINGLE_BALANCE_SHEET_RECEIPT`.

## Anti-orphan

KEEP_SEPARATE preserves:
- accounting leverage quality independent of credit-market/funding interpretation;
- credit/funding structure, usable-liquidity quality and maturity interaction beyond accounting ratios.

Result:
`PASS_NO_ORPHAN`.

## Maturity firewall

- D07-06 remains L2/40%.
- D22-03 remains L3/60%.
- H13 governance closure itself adds no maturity.

## Terminal classification

`KEEP_SEPARATE / ACCOUNTING_PRIMITIVE_VS_CREDIT_FUNDING_TRANSFORM / SINGLE_BALANCE_SHEET_RECEIPT`

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.

No merge, retirement, rename, module-count, maturity, Formal or runtime change.
