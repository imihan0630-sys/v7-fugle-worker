# System 2 Prospective Shadow Capture Contract V0.1

Updated: 2026-09-27 Asia/Taipei
Status: REPOSITORY DESIGN / PHYSICAL D1 READY / WORKER AND CRON NOT DEPLOYED

## Purpose

Define the first independent System 2 prospective Shadow（前瞻影子模擬） capture runtime after physical isolated persistence became available.

Physical persistence:
- D1 database: `system2-research`;
- binding contract: `SYSTEM2_DB`;
- schema: V0.5;
- 26 `s2_` tables verified;
- System 1/V8 production persistence is not used.

This contract does not authorize Worker/Cron（排程） deployment by itself.

## First capture stage

V0.1 is AFTER_CLOSE_DECISION_CAPTURE（盤後決策凍結） only.

Not activated:
- intraday entry confirmation;
- simulated fills;
- position monitoring;
- notifications;
- outcome joining;
- historical backfill.

Reason:
the first goal is to prove honest prospective source/decision capture before adding execution-time complexity.

## Initial strategy lanes

### SHORT_MOMENTUM（短線動能）

Shadow spec:
`S2-SM-LS-001`

Expected source families:
- A1 Taiwan daily OHLCV / derived technical-price-volume — REQUIRED;
- A2 TAIEX — CONTEXT_ONLY;
- A3 three-institution daily flow — OPTIONAL;
- A4 TDCC concentration — OPTIONAL;
- B1 TPEx/small-cap regime — CONTEXT_ONLY and may remain UNKNOWN;
- B2 breadth/sector rotation — CONTEXT_ONLY and may remain UNKNOWN.

Missing REQUIRED A1 makes the strategy/date INCOMPLETE.
Missing context remains explicit and never becomes zero.

### SWING_GROWTH（波段成長）

Shadow spec:
`S2-SG-LS-001`

Expected source families:
- A5 quarterly financials — REQUIRED;
- B2 prospectively frozen industry-thesis snapshot — REQUIRED;
- A6 PE/PB valuation — OPTIONAL;
- A7 official announcements — OPTIONAL;
- A4 TDCC concentration — OPTIONAL.

If A5 publication timing or B2 industry-thesis evidence cannot honestly be KNOWN at the decision clock, the strategy/date remains INCOMPLETE.

## Capture clock

No exact Cron time is frozen in V0.1.

The runtime contract requires:
- marketDate in Asia/Taipei;
- decisionTimestamp after the intended source cutoff;
- source availableAt <= decisionTimestamp for PIT（時點一致性） eligibility;
- same decision clock used by source-session, decisions, ordering and run fingerprint.

An exact after-close schedule becomes a separate versioned deployment parameter only after source availability latency is measured prospectively.

## Full-universe accounting

Every scheduled run must preserve:
- base-universe identity/version;
- excluded symbols;
- eligible symbols;
- every eligible symbol's evaluation state;
- INCOMPLETE / WATCH / QUALIFIED_NOT_SELECTED / REJECTED records;
- source gaps;
- zero-pick days.

Selected-only capture is prohibited.

## Runtime fail-closed rules

A run must not claim COMPLETE when:
- required source session is incomplete;
- eligible-universe accounting is incomplete;
- referenced frozen objects are missing;
- schema version is unsupported;
- binding is not `SYSTEM2_DB`;
- outcome data is mixed into the decision-time batch.

Missing data is UNKNOWN, not neutral.

## Deployment safety

The future Worker service name is reserved as:
`system2-shadow-research`

Repository deployment template must default to:
- `workers_dev = false`;
- no routes;
- no Cron triggers;
- `SYSTEM2_CAPTURE_ENABLED = false`.

A smoke deployment, if later authorized, therefore cannot begin scheduled capture merely by existing.

Scheduled capture requires a second explicit arm step.

## Health contract

The Worker may expose a health function only after deployment authorization.

Health must report:
- service name;
- research-only mode;
- D1 schema version;
- whether capture is armed;
- capture contract version.

It must not expose secrets, raw token values or production-System1 state.

## Activation sequence

1. repository capture contract + fail-closed worker skeleton;
2. CI syntax/unit verification;
3. explicit owner authorization for isolated Worker creation;
4. smoke deploy with capture disabled and no Cron;
5. D1 health/read test;
6. measure source arrival latency;
7. choose/freeze exact after-close decision clock;
8. explicit owner authorization to arm Cron;
9. begin prospective source/decision capture;
10. only later add intraday Shadow phases.

## Current boundary

Repository-side capture design is authorized as normal System 2 engineering.

Cloud Worker creation and Cron activation are separate cloud-runtime actions and are not performed in V0.1 without explicit owner authorization.
