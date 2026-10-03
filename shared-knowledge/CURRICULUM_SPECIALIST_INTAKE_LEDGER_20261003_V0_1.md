# Curriculum Specialist Intake Ledger 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: ACTIVE_INTAKE_LEDGER
Scope: Third-round H01-H20 specialist validation returns
Formal Core impact: NONE

## Purpose

Track specialist evidence returns independently from chat memory.

A cluster does not become decided merely because one participating room submits a good packet.
00｜研究總控室 only performs completeness/intake checks until all required counterpart evidence exists.

## Current intake summary

- H01-H04: pending.
- H05: **PARTIAL_EVIDENCE_RECEIVED**.
- H06-H19: pending.
- H20: **PARTIAL_EVIDENCE_RECEIVED**（02 室完成；01／04 待件）。
- Actual merge/retirement decisions from returned packets: **0**.
- Formal Core changes: **0**.

## H05 intake — D07-25 vs D21-10

Received:
`research/h05_d07_25_specialist_evidence_packet_v0_1.json`

Source room:
06｜基本面與估值研究室

Intake result:
**ROOM06_PACKET_ACCEPTED / ROOM14_COUNTERPART_REQUIRED / TERMINAL_DECISION_NOT_READY**

### What passed
- D07-25 statement-level forensic ownership is explicit.
- D21-10 expected governance/control ownership is explicitly excluded from D07-25.
- Taiwan observable source families and PIT clocks are proposed.
- Shared evidence receipt schema is defined.
- Two divergent-state examples are provided.
- Competing mechanisms/falsifiers are provided.
- Anti-double-count rules with D07-07 / D07-24 / D21-10 are explicit.
- Capability-preservation map is present.
- Formal Core impact remains NONE.
- No maturity promotion is claimed.

### Why final classification remains open
The frozen H05 contract requires independent confirmation that D21-10 actually owns distinct governance/control observables and replayable clocks.

Still required from 14｜公司治理與內部人研究室:
1. audit opinion/report event semantics;
2. restatement/correction governance chronology;
3. internal-control statement/material weakness semantics;
4. CPA special internal-control review;
5. remediation chronology;
6. PIT/first-known source map;
7. D21-10 warning while D07-25 remains low/unknown;
8. shared-receipt compatibility confirmation;
9. terminal recommendation.

Until that packet arrives:
- H05 = `EVIDENCE_INSUFFICIENT_PENDING_COUNTERPART`;
- D07-25 remains L0/0%;
- D21-10 remains L0/0%;
- no scope change;
- no module count change.

## Intake state table

| Cluster | Status | Received packet | Remaining |
|---|---|---|---|
| H01 | PENDING | — | specialist packet(s) |
| H02 | PENDING | — | specialist packet(s) |
| H03 | PENDING | — | specialist packet(s) |
| H04 | PENDING | — | specialist packet(s) |
| H05 | PARTIAL_EVIDENCE_RECEIVED | `research/h05_d07_25_specialist_evidence_packet_v0_1.json` | 14｜公司治理與內部人研究室 |
| H06 | PENDING | — | specialist packet(s) |
| H07 | PENDING | — | specialist packet(s) |
| H08 | PENDING | — | specialist packet(s) |
| H09 | PENDING | — | specialist packet(s) |
| H10 | PENDING | — | specialist packet(s) |
| H11 | PENDING | — | specialist packet(s) |
| H12 | PENDING | — | specialist packet(s) |
| H13 | PENDING | — | specialist packet(s) |
| H14 | PENDING | — | specialist packet(s) |
| H15 | PENDING | — | specialist packet(s) |
| H16 | PENDING | — | specialist packet(s) |
| H17 | PENDING | — | specialist packet(s) |
| H18 | PENDING | — | specialist packet(s) |
| H19 | PENDING | — | specialist packet(s) |
| H20 | PARTIAL_EVIDENCE_RECEIVED | `research/D02_H20_BREAKOUT_SPECIALIST_RETURN_V0_1.md` | 01｜K線與型態研究室、04｜波動與市場微結構研究室 |

## Intake rules

1. A specialist packet may be accepted as complete for its room without deciding the cluster.
2. Cross-room clusters require all required rooms or equivalent independent evidence.
3. 00 does not manufacture missing specialist evidence.
4. No maturity change from overlap packets alone unless the specialist room's normal maturity gate separately supports it.
5. Final structural changes still require Dependency Audit, anti-orphan check and owner approval.

## H20 intake — D01-05 / D02-03 / D04-07

Received:
`research/D02_H20_BREAKOUT_SPECIALIST_RETURN_V0_1.md`

Source room:
02｜價量研究室

Intake result:
**ROOM02_PACKET_ACCEPTED / ROOMS01_04_COUNTERPARTS_REQUIRED / TERMINAL_DECISION_NOT_READY**

### What passed
- One breakout episode is treated as one shared primitive event receipt.
- D01-05 is recognized as price-structure event identity owner.
- D02-03 owns volume-confirmation transforms only.
- D04-07 remains an external volatility-state dependency.
- PIT/replay clocks are explicit.
- Divergent-state counterexamples are present.
- Incremental-value test is preregistered.
- Anti-double-count rules are explicit.
- D02-03 remains L3/60%; no maturity inflation.
- `FORMAL_OPTIMIZATION_CANDIDATE: NONE`.

### Still required
- 01｜K線與型態研究室: D01-05 price-structure counterpart.
- 04｜波動與市場微結構研究室: D04-07 volatility-interaction counterpart.
- shared event-receipt compatibility across all three rooms.
- final Dependency Audit.

Until then:
H20 = `EVIDENCE_INSUFFICIENT_PENDING_COUNTERPARTS`.

## 15-item intake — D02-07 / D02-08

Received:
`research/D02_15_ITEM_SPECIALIST_RETURN_D02_07_D02_08_V0_1.md`

Intake result:
**SPECIALIST_RETURN_ACCEPTED / RESEARCH_ONLY / NO_STRUCTURAL_CHANGE_YET**

- D02-07 OBV: comparator/observation only; merge candidate pending residual OOS/prospective test.
- D02-08 吸籌／出貨代理：若仍只靠 OHLCV，屬強合併候選；若未來取得獨立微結構證據，才能評估是否保留為 consumer/interpretation module（使用／解釋模組）。
- Neither is a HARD_INVALIDATION or standalone PRIMARY_ALPHA by current evidence.
- No maturity change.
- No retirement/merge executed.
- `FORMAL_OPTIMIZATION_CANDIDATE: NONE`.

