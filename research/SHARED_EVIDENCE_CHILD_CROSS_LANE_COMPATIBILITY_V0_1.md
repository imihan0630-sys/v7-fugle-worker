# Shared Evidence Child Cross-Lane Compatibility V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / CROSS-LANE_DESIGN_RECONCILED
Formal Core: LOCKED

## Purpose

Falsify the proposed generic research evidence-child model by mapping three independently designed research lanes into it:

- Technical Indicator;
- Pattern;
- Target/RR.

A shared schema is accepted only if it can preserve each lane's identity, completeness and provenance without flattening important semantics.

## TI-404 — First incompatibility found: one parent can have multiple Pattern episodes

The original generic child key lacked a per-family item discriminator.

That is safe for:
- one Technical Indicator bundle per parent/as-of;
- one Target/RR audit bundle per parent/as-of.

It is NOT safe for Pattern:
one symbol/as-of can simultaneously contain multiple independent structural episodes, e.g. W, Platform and VCP.

Repair:
add evidence_item_key.

Mapping:
- Technical Indicator => ROOT;
- Target/RR => ROOT;
- Pattern => deterministic episode key derived from family/scale/confirmed anchors/initial confirmation.

Without evidence_item_key, multiple Pattern objects would be forced into one mutable JSON aggregate and episode-level lineage would be weaker.

## TI-405 — Second incompatibility found: NOT_EVALUABLE differs from BLOCKED

Target/RR is not logically evaluable for every early Formal state.

Example:
a row can fail before target/RR geometry is reached.

That is different from:
- source missing;
- continuity blocked;
- formula failure.

Repair:
generic status vocabulary includes NOT_EVALUABLE.

Generic statuses:
- VALID;
- CONSTRAINED;
- BLOCKED;
- UNKNOWN;
- NOT_EVALUABLE;
- QA_FAIL.

Family-specific detail goes into status_reason_code.

This preserves 100% attempt accounting without falsely labeling a structurally irrelevant stage as a data failure.

## TI-406 — Third incompatibility: parent scope is observer-specific and must be versioned

Technical Indicator promotion-grade target scope:
all history-admitted feature rows actually evaluated by the same-scan Formal decision path.

Pattern's older contract currently references the existing bounded Shadow archive.

Target/RR needs the decision-state parent but may return NOT_EVALUABLE on earlier stages.

Therefore one generic run table cannot assume one universal parent universe.

Repair:
add parent_scope_id to every run identity.

Run completeness means:
100% attempt coverage of the exact keyset defined by that observer's parent_scope_id.

This lets:
- Technical use a broad decision-state scope;
- Pattern retain a narrower prototype scope if explicitly labeled;
- later Pattern promotion-grade work migrate to a broader immutable scope without rewriting old runs.

## TI-407 — Technical Indicator mapping

Generic identity:
- parentDecisionReceiptId;
- captureGeneration;
- evidence_family = TECHNICAL_INDICATOR;
- evidence_item_key = ROOT;
- observer_version;
- as_of.

Payload owns:
- KD/RSI/MACD/ADX/Bollinger values;
- formula versions;
- state lineage;
- continuityReceiptId;
- limit provenance.

Generic status owns:
valid/constrained/blocked/unknown.

No conflict found after v0.2 repair.

## TI-408 — Pattern mapping

Generic identity:
- parentDecisionReceiptId;
- captureGeneration;
- evidence_family = PATTERN;
- evidence_item_key = episodeKey;
- observer_version = detectorVersion;
- as_of.

Payload owns:
- geometry;
- lifecycle;
- zone relation;
- episode anchors;
- raw/continuity payload hashes.

Generic run qa_counts_json owns:
- prefix exact checked/failures;
- replay exact checked/failures.

Pattern-specific episode identity remains fully preserved.

No material conflict after adding evidence_item_key and parent_scope_id.

## TI-409 — Target/RR mapping

Generic identity:
- parentDecisionReceiptId;
- captureGeneration;
- evidence_family = TARGET_RR;
- evidence_item_key = ROOT;
- observer_version;
- as_of.

Payload owns:
- channel/formal stage;
- entry/stop/risk;
- raw targetPrice and PIT provenance;
- prior highs/pivots/resistance candidates;
- selectedTargetSources;
- ambiguity;
- RR and stage consistency.

Generic status:
- VALID when evaluable and provenance sufficient;
- UNKNOWN/BLOCKED when evidence quality is insufficient;
- NOT_EVALUABLE when Formal order never reaches the relevant geometry.

No material conflict after adding NOT_EVALUABLE.

## TI-410 — Generic run receipt must carry flexible QA/status counts

Pattern needs replay/prefix QA counts.
Technical Indicator needs constrained/source/continuity/state reasons.
Target/RR needs stage-not-evaluable and source-provenance reasons.

Therefore fixed columns alone are insufficient.

Keep common numeric columns:
- expected;
- attempted;
- valid;
- constrained;
- blocked;
- unknown;
- not_evaluable;
- missing;
- provenance conflicts;
- QA failures.

Add:
- status_counts_json;
- reason_counts_json;
- qa_counts_json.

This preserves fast common queries without forcing every family into identical diagnostics.

## TI-411 — Shared schema does not merge research semantics

The generic table owns:
- immutable identity;
- parent linkage;
- versioning;
- status;
- provenance fingerprint;
- payload hash;
- source receipt references.

It does NOT own:
- indicator formulas;
- Pattern episode logic;
- Target/RR geometry;
- factor thresholds;
- alpha sign.

Family contracts remain independently versioned.

This prevents a generic storage layer from becoming a generic scoring layer.

## TI-412 — Cross-lane decision

After adversarial mapping and three repairs:

SHARED_EVIDENCE_CHILD_SCHEMA = DESIGN_COMPATIBLE_V0_2.

Material repairs:
1. evidence_item_key;
2. NOT_EVALUABLE;
3. parent_scope_id;
4. flexible status/reason/QA count JSON in run receipt.

No remaining schema contradiction was found among:
- Technical Indicator;
- Pattern;
- Target/RR.

This is architecture compatibility only.
It is not runtime readiness.

Class-B implementation remains PREMATURE because:
- immutable parent persistence is still not implemented;
- TECHNICAL_CONTINUITY runtime remains blocked;
- symbol-session/price-limit runtime provenance remains incomplete;
- real parent scale and write/latency measurements remain unavailable.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Treat v0.2 generic child as the preferred shared design.
2. Next falsification target:
   determine whether external evidence and gate-overlap children can also fit without semantic loss.
3. Freeze parent-scope receipt semantics before any D1 implementation.
4. Do not request owner approval until shared runtime dependencies and real sizing evidence are ready.
