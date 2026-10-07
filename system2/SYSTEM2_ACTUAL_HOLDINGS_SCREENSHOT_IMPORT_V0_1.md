# System 2 Actual Holdings Screenshot Import V0.1

Updated: 2026-10-07 Asia/Taipei  
Status: OWNER-APPROVED SOURCE CONTRACT / IMPLEMENTATION V0.1  
Scope: System 2 only  
Formal Core impact: NONE  
Real orders: DISABLED  
Live capital authority: DISABLED  
Broker order routing: NOT AUTHORIZED  
Broker API holdings integration: NOT AUTHORIZED

## Owner decision

System 2 must be able to manage the owner's verified actual holdings, but the current authorized source is:

`USER_UPLOADED_BROKER_SCREENSHOT`

Flow:

Owner uploads broker inventory/holdings screenshot  
→ ChatGPT / vision-assisted extraction  
→ structured holdings payload  
→ deterministic validation  
→ mandatory confirmation/review gate  
→ immutable Actual Holdings Snapshot  
→ prior-vs-current reconciliation  
→ System 2 actual-holdings monitoring and decision support.

This is **not** a broker-data pull. No broker API, account token, trading certificate, broker adapter, System 1 holdings bridge, live order routing or real-order execution is authorized by this contract.

## Non-OCR principle

The goal is not a general OCR platform.

The image/vision layer may extract candidate values, but System 2 engineering owns only:
- the structured data contract;
- deterministic validation;
- provenance;
- explicit UNKNOWN preservation;
- review state;
- immutable snapshot identity;
- idempotency;
- reconciliation;
- read-model separation.

Do not guess a value merely to increase automation rate.

## Structured extraction contract

Top-level fields:
- sourceType = `USER_UPLOADED_BROKER_SCREENSHOT`;
- brokerName: optional;
- accountAlias: optional/masked;
- screenshotCapturedAt: nullable before review;
- receivedAt: required;
- sourceImage.sha256: required before actual-holdings persistence;
- sourceImage.referenceId/provenanceRef: optional;
- sourceImage.fileName: optional;
- extractionVersion: required;
- extractionConfidence: nullable but low/unknown requires review;
- rows[].

Supported row fields:
- symbol;
- companyName;
- quantity;
- averageCost;
- marketPrice;
- marketValue;
- unrealizedPnL;
- unrealizedPnLPercent;
- currency;
- per-field confidence;
- rawText / ambiguity flags when available.

Core actual-holdings fields are:
- symbol;
- quantity;
- averageCost.

Missing or ambiguous core values are fail-closed.

## Validation states

Allowed V0.1 states:
- `VALIDATED_PENDING_CONFIRMATION`;
- `REVIEW_REQUIRED`;
- `REJECTED`.

Actual Holdings persistence requires an explicit final:
- `reviewState=CONFIRMED`;
- reviewedAt;
- reviewedBy;
- effectiveAsOf;
- confirmedRows;
- every prior REVIEW/BLOCKING issue explicitly resolved.

V0.1 intentionally does not auto-write even a high-confidence extraction. A later owner-approved version may simplify high-confidence confirmation, but low-confidence fail-closed behavior may not be removed.

Examples requiring `REVIEW_REQUIRED`:
- low/unknown symbol confidence;
- low/unknown quantity confidence;
- low/unknown average-cost confidence;
- symbol/company mismatch against a deterministic reference;
- ambiguous thousands/decimal parsing;
- source-image crop/ambiguity flags;
- duplicate/conflicting symbol rows;
- quantity × marketPrice materially inconsistent with marketValue;
- screenshot as-of unknown;
- stale screenshot;
- screenshot timestamp materially after receipt time.

`UNKNOWN` remains `UNKNOWN`.

## Actual-vs-virtual separation

The following never establish actual ownership by themselves:
- signal;
- trigger;
- suggestedShares/requestedShares;
- candidate;
- plan snapshot;
- simulated fill;
- virtual `s2_positions`;
- System 1 selection/holdings.

`s2_positions` remains virtual/simulated only.

Actual holdings use dedicated:
- `s2_actual_holdings_imports`;
- `s2_actual_holdings_snapshots`;
- `s2_actual_holdings_rows`;
- `s2_actual_holdings_reconciliation_events`.

UI/read models must separately label:
- ACTUAL HOLDINGS;
- VIRTUAL POSITIONS;
- CANDIDATES;
- WATCHLIST;
- SIMULATED FILLS.

## Immutable snapshot contract

Every accepted import creates or resolves one immutable snapshot containing:
- snapshotId;
- importId;
- previousSnapshotId;
- receivedAt;
- effectiveAsOf;
- source provenance;
- extractionVersion;
- validationVersion;
- raw extraction;
- confirmed holdings;
- rowsHash;
- source-image SHA-256;
- reconciliation;
- idempotencyKey;
- snapshotHash.

Old snapshots are never overwritten by a later screenshot.

## Idempotency

The idempotency identity binds:
- sourceType;
- source-image SHA-256;
- accountAlias;
- effectiveAsOf;
- canonical confirmed holdings rows.

The same source image + same confirmed holdings content + same as-of identity resolves to the same snapshot/idempotency key.

If the same image is reviewed into different confirmed content, the content hash changes and a distinct snapshot may be created; this preserves review history rather than overwriting the earlier snapshot.

## Reconciliation

A new snapshot is compared with its previous snapshot and may emit:
- NEW_POSITION;
- INCREASED;
- REDUCED;
- CLOSED;
- UNCHANGED;
- AVG_COST_CHANGED;
- QUANTITY_CHANGED;
- POSSIBLE_CORPORATE_ACTION;
- REVIEW_REQUIRED.

Snapshot comparison is exposure reconciliation, not trade reconstruction.

A quantity reduction may prove that current exposure is lower. Without actual fill/order evidence the system must keep:
- exact trade price = UNKNOWN;
- exact trade time = UNKNOWN;
- order ID = UNKNOWN;
- trade inference = NOT_INFERRED.

`POSSIBLE_CORPORATE_ACTION` is only a review hypothesis based on quantity/cost geometry, never a claim that a specific corporate action occurred.

## Monitoring outputs

Once a confirmed actual-holdings snapshot is available, System 2 may use it for:
- HOLD;
- ADD;
- RE-ADD;
- RESTORE;
- REDUCE;
- EXIT;
- WARNING;
- thesis monitoring;
- stop/target monitoring;
- resonance monitoring;
- Regime / sector / industry deterioration;
- technical deterioration;
- institutional/chip deterioration;
- event invalidation;
- concentration and position-risk monitoring.

All outputs are decisions/recommendations/warnings only.

They do not become broker orders.

## Permanent broker/order boundary

Until a future explicit Owner approval changes this contract:

- `realOrdersEnabled=false`;
- `liveCapitalAuthority=false`;
- `orderRoutingAuthorized=false`;
- `brokerApiAuthorized=false`;
- `brokerApiUsed=false`;
- automatic buy/sell/cancel/replace is forbidden;
- broker tokens/certificates are unnecessary and must not be requested for this lane.

## Readiness states

After the V0.1 code/schema is verified:
- `ACTUAL_HOLDINGS_SOURCE_AUTHORIZED=USER_UPLOADED_BROKER_SCREENSHOT`;
- `CHAT_ASSISTED_HOLDINGS_IMPORT_READY=CODE_TESTED`;
- `ACTUAL_HOLDINGS_PERSISTENCE_SCHEMA_READY=CODE_TESTED`;
- `ACTUAL_OWNER_SNAPSHOT_IMPORTED=false` until a real owner screenshot is imported and read back;
- `ACTUAL_POSITION_MONITOR_VERIFIED=false` until a real owner screenshot passes source + validation + confirmation + persistence/readback.

Synthetic fixtures may prove implementation behavior but cannot prove the owner's current holdings.

## Protected boundaries

This contract must not modify:
- System 1 Formal Core;
- System 1 A/B;
- Top6 / 3+3;
- System 1 BUY / ADD / REDUCE / SELL / STOP;
- System 1 15-minute formal semantics;
- System 1 production runtime/monitoring/push;
- System 1 capital rules.

System 1 holdings may not be auto-imported into System 2.
