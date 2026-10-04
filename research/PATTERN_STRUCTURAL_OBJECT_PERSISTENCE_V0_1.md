# D01 DL-030 — Structural-Object Persistence vs Rolling-Window Rediscovery V0.1

Updated: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / OBJECT_IDENTITY_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

Pattern detectors are repeatedly executed on overlapping rolling windows.

The same support/resistance or pattern object can therefore appear on many adjacent scan dates, multiple refreshes within one date, or several overlapping detector windows.

Without an explicit object-identity contract, three errors become possible:

1. one structure is counted as many independent structures;
2. one persistent structure is treated as repeated new confirmations;
3. a detector/window artifact is misread as market invalidation or rediscovery.

DL-030 freezes the structural-object identity and persistence semantics before any outcome join.

## 2. Do not replace Shadow parent identity

Existing Pattern parent population remains authoritative:
- daily Shadow parent identity is the existing (scan_date, symbol) plus immutable parent snapshot/hash contract.

DL-030 does NOT replace or collapse those decision parents.

Instead it adds a child diagnostic identity:

- STRUCTURAL_OBJECT_ROOT;
- STRUCTURAL_OBJECT_VERSION;
- STRUCTURAL_OBJECT_EPISODE;
- OBSERVATION_SNAPSHOT.

One structural object may legitimately be visible to multiple daily decision parents.

Those rows are repeated exposure/decision observations, not automatically independent structural samples.

D16 owns dependence and estimand treatment.

## 3. Structural-object root identity

A structural root is created from causal information available at first confirmation.

Frozen root fields:
- symbol;
- semanticSpace;
- timeframe;
- detectorFamily;
- structureFamily;
- orientation;
- firstConfirmedAt;
- ordered rootAnchorIds.

Explicitly excluded:
- scanDate;
- runAt;
- cohortRank;
- future anchors;
- future lifecycle outcomes;
- return outcomes.

A semantically equivalent detector implementation must reproduce the same root identity.

A deliberately alternative detector family uses a separate object namespace.

## 4. Version identity

The same root can acquire new causal versions.

Version-changing information may include:
- boundary geometry revision;
- causal addition of a new anchor;
- provenance/version change that is semantically allowed and fully replayable.

STRUCTURAL_OBJECT_VERSION is not a new root and not a new independent sample.

A new version must store:
- effectiveAt;
- currentAnchorIds;
- boundaryVersion/hash;
- source/provenance receipt;
- lineage relation to the prior version.

Future information may not rewrite an older version.

## 5. Causal anchor extension

If a current object retains all prior/root anchors and adds one or more anchors that:
- occurred after the prior asOf;
- occurred no later than the current asOf;
- are certified by the canonical swing/anchor engine;

then classify:
SAME_ROOT_CAUSAL_EXTENSION.

This creates a new object version under the same root.

If anchors are replaced or removed without an explicit canonical lineage explanation, classify:
IDENTITY_BREAK_OR_RESEGMENTATION.

Do not use fuzzy price/time matching after outcomes to force sameness.

## 6. Observation snapshot vs object event

A daily or intraday detector observation is a snapshot.

Repeated snapshots of the same object are not repeated confirmation events.

Frozen rule:
- first confirmation occurs once per object episode;
- continuing ACTIVE state is not a new event;
- identical replay within the same decision timestamp is REPLAY_DUPLICATE;
- same object observed on a later date is SAME_OBJECT_SNAPSHOT unless a causal version transition occurred.

This mirrors earlier D01 event identity governance: state duration does not multiply event count.

## 7. Absence is not one state

When an object is missing from a detector output, classify the reason.

### A. UNKNOWN_COVERAGE_GAP
Required scan/session/source coverage is incomplete.

No statement about object persistence is allowed.

### B. WINDOW_CENSORED
The rolling lookback no longer contains the root anchor history needed to reconstruct the object.

This is detector observability loss, not market failure.

### C. DETECTOR_ABSENT_COMPLETE_SCAN
Coverage is complete, detector ran, root remains observable, but object was not emitted.

This is detector-state evidence, not automatically market invalidation.

### D. MARKET_INVALIDATED
A separate explicit structural lifecycle rule records invalidation/failure.

Only this can close the current object episode as a market-structure event.

Missing rows never imply MARKET_INVALIDATED.

## 8. Reacquisition / rediscovery semantics

If the same root returns after a gap:

- after UNKNOWN_COVERAGE_GAP:
  REACQUIRED_AFTER_UNKNOWN_GAP;
  continuity of the object is unknown.

- after DETECTOR_ABSENT_COMPLETE_SCAN with no market invalidation:
  REACQUIRED_SAME_ROOT_AFTER_DETECTOR_ABSENCE;
  this is detector stability evidence, not a new independent object.

- after WINDOW_CENSORED:
  if the exact root can still be certified from durable anchor lineage, label REACQUIRED_AFTER_WINDOW_CENSORING;
  otherwise identity is unresolved.

- after MARKET_INVALIDATED:
  the next appearance requires NEW_EPISODE_AFTER_INVALIDATION even if geometry is numerically similar.

## 9. Overlapping-window duplicate firewall

Within one decision timestamp, multiple raw detector windows may emit the same root/version.

They are collapsed to one observation snapshot while the raw emission ledger is retained for audit.

If multiple raw emissions claim the same root/version but disagree on:
- boundary hash;
- current anchor set;
- lifecycle state;
- provenance

then status is PROVENANCE_CONFLICT, not majority vote.

## 10. Refresh-cadence firewall

Changing detector refresh frequency must not create more structural events.

Examples:
- one daily run vs five repeated same-input daily runs;
- repeated observer polling before the next completed daily bar;
- overlapping backfill/replay runs.

Same decision timestamp + same object/version + same input/snapshot hash:
REPLAY_DUPLICATE.

Run count is observability metadata only.

## 11. Timeframe boundary

D01-10 owns multi-timeframe semantics.

DL-030 does not deduplicate daily and weekly objects by price proximity.

timeframe is part of root identity.

Cross-timeframe alignment may be linked as a relation, but daily and weekly structures remain distinct semantic objects unless a later explicit cross-scale contract says otherwise.

## 12. Statistical implications

Overlapping windows and repeated event dates induce dependence.

External finance methodology shows that overlapping observations can materially change inference, and even small correlation among overlapping event observations can bias test statistics.

Therefore future D16 analysis must separately report:
- unique daily decision parents;
- unique structural roots;
- unique object episodes;
- object versions;
- observation snapshots;
- repeated-exposure distribution;
- rediscovery/reacquisition rates;
- coverage/window-censoring rates.

No one count substitutes for the others.

## 13. No dedup by fuzzy outcome-aware heuristics

Prohibited:
- price-distance matching chosen after returns;
- "looks like the same zone" manual linking;
- choosing a Jaccard/overlap threshold after outcomes;
- counting every scan date as a new structure;
- treating missing output as invalidation;
- treating detector reacquisition as a second independent confirmation.

If exact causal lineage is unavailable:
IDENTITY_UNRESOLVED.

## 14. Machine decision

SCAN_DATE_IS_STRUCTURAL_IDENTITY =
FALSE.

ROLLING_WINDOW_REDISCOVERY_IS_NEW_EVENT =
FALSE.

MISSING_ROW_IS_MARKET_INVALIDATION =
FALSE.

WINDOW_CENSORING_IS_MARKET_FAILURE =
FALSE.

REPLAY_RUN_COUNT_INCREASES_N =
FALSE.

ALTERNATIVE_TIMEFRAME_AUTODEDUP =
FALSE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 15. Exact next continuation

1. Build deterministic structural-root / version / snapshot identity helpers and adversarial transition tests.
2. Preserve raw detector emissions for audit while deduplicating same-timestamp same-object snapshots.
3. Hand root/episode/repeated-exposure clustering semantics to D16.
4. Do not runtime-wire object persistence until the immutable parent, canonical anchor IDs and prospective Pattern observer prerequisites are approved.
5. Next D01 science: distinguish genuine structural aging/decay from mere loss of observability as anchors move out of the detector horizon.
6. No outcome join / no runtime wiring / no Formal change.
