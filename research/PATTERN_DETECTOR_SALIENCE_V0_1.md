# D01 DL-028 — Detector-Selection Salience vs Structural-Memory Mechanism V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MECHANISM_IDENTIFICATION / FORMAL_CORE_LOCKED

## 1. Problem

DL-027 freezes non-anchor pseudo-zones as mechanism negative controls.

However:
true MAJOR zones are not randomly chosen horizontal levels.

The detector selects confirmed structural objects from salient parts of the historical path.

Therefore a future finding:
TRUE_ZONE > NON_ANCHOR_PSEUDO_ZONE

does NOT by itself identify structural memory.

The difference may arise because the true-zone detector selects:
- larger confirmed directional-change pivots;
- more extreme historical price locations;
- older / wider structural spans;
- more repeated pre-confirmation interaction;
- more visually / behaviorally salient price levels;
- zones nearer round-price/tick clusters;
- zones with different volatility / liquidity opportunity.

DL-028 separates these channels before outcomes.

## 2. Three layers must not be collapsed

### Layer M — Mechanical Detector Selection

These features describe why the frozen detector can create/select a MAJOR object mechanically.

Outcome-blind examples:
- detectorScale = MAJOR;
- detectorK = 3 lagged-ATR directional-change scale;
- detectorLookbackEligibleSessions = 260;
- confirmed pivot count used/available;
- anchor swing amplitude in lagged-ATR units;
- anchor spacing / structural span in eligible sessions;
- zone width / ATR;
- price-level extremeness percentile within the pre-confirmation history;
- zone age at the parent decision;
- simple260High distance / rank;
- local-to-parent geometry that governs whether the zone enters RG2 relation scope.

Purpose:
separate detector mechanics from a generic arbitrary-level control.

### Layer S — Behavioral / Market Salience

These features can be economically meaningful mechanisms themselves.

Pre-confirmation examples:
- prior touch / bounce count;
- last-touch recency;
- prior rejection magnitude / compression progression;
- time spent near the level;
- round-price / legal-tick proximity;
- pre-confirmation turnover/participation around the level where PIT-valid;
- visible historical extremeness.

Purpose:
separate "structural label" from observable salience/attention/anchoring proxies.

Important:
controlling Layer S changes the scientific estimand.
If an effect disappears only after Layer S, the result may be SALIENCE_MEDIATED rather than "nothing exists."

### Layer O — Crossing Opportunity / Market Context

Inherited from DL-026:
- volatility / ATR;
- zone width;
- distance path;
- tick rule / price resolution;
- liquidity;
- constrained-session share;
- D02 acceptance/persistence;
- market/sector regime;
- time at risk.

Layer O is required for level-crossing comparability.

## 3. Pre-confirmation-only rule

Every M/S/O salience/control field must be causally available no later than the true parent-zone confirmation cutoff or the immutable parent decision cutoff, according to its contract.

Prohibited:
- future touch count;
- future bounce count;
- future liquidity state;
- future volume-at-price;
- later-discovered structural zones used to clean controls;
- post-outcome salience matching.

Future salience cannot explain why the detector selected the historical zone.

## 4. Identification ladder

Future mechanism analysis must preserve separate estimands.

E0 — RAW_STRUCTURAL_LABEL
TRUE vs pseudo with parent/date/symbol/width scope only.

E1 — OPPORTUNITY_ADJUSTED
E0 + Layer O.

E2 — MECHANICAL_SELECTION_ADJUSTED
E1 + Layer M.

E3 — OBSERVABLE_SALIENCE_ADJUSTED
E2 + Layer S.

Interpretation:

True ~= pseudo at E1:
generic level-crossing / market mechanics sufficient.

True > pseudo at E1 but ~= at E2:
detector mechanical selection explains the apparent structural advantage.

True > pseudo at E2 but ~= at E3:
observable salience / attention / anchoring can explain the residual.
Classify SALIENCE_MEDIATED_MECHANISM_CANDIDATE, not structural-label alpha.

True > pseudo at E3:
RESIDUAL_STRUCTURAL_IDENTITY_CANDIDATE.
Still not causal proof: unmeasured salience / model misspecification remain possible.

## 5. Why salience-adjusted residual is not causal proof

Structural-zone identity is not randomized.

Even after observed matching/adjustment:
- latent market attention can remain;
- detector geometry can proxy unmeasured order-flow history;
- pre-confirmation volume/position data may be incomplete;
- model specification can create residual differences.

Therefore:
RESIDUAL_STRUCTURAL_IDENTITY_CANDIDATE != PROVEN_STRUCTURAL_MEMORY_CAUSE.

No causal language such as "zone causes bounce" is authorized from observational Pattern data alone.

## 6. Overcontrol / mediation firewall

Some Layer S variables may be part of the actual behavioral mechanism.

Example:
multiple prior bounces -> trader attention -> clustered orders -> later barrier behavior.

If the future scientific question is:
"Does the structural label add beyond observed salience?"
then Layer S control is appropriate.

If the scientific question is:
"Does a detected structural zone as experienced by the market have predictive behavior?"
then controlling all salience can remove part of the mechanism.

Therefore both E2 and E3 must be reported.
Do not present only E3.

## 7. Salience fields are continuous/provenance-first

No arbitrary:
- 3 touches = salient;
- top 10% extremeness;
- within 2 ATR;
- round-number yes/no cutoff

is frozen.

Store continuous descriptors and provenance.

Derived labels may be used only for display/audit unless separately preregistered.

## 8. Detector-definition lock

The frozen detector remains:
- lagged-ATR Directional-Change;
- MICRO k=1;
- BASE k=2 / 120 eligible sessions;
- MAJOR k=3 / 260 eligible sessions.

DL-028 does NOT retune:
- k;
- lookback;
- anchor tolerance;
- zone width;
- swing confirmation rules.

Changing detector settings after outcomes would redefine the treatment/selection mechanism and create a new experiment family.

## 9. Negative-control redesign

DL-027 pseudo-zone pool remains the base control universe.

DL-028 does NOT choose one "best matched" pseudo-zone.

Instead every pseudo candidate receives the same pre-confirmation M/S/O descriptor vector where computable.

D16/statistical validation later owns:
- matching / weighting method;
- common-support diagnostics;
- balance diagnostics;
- finite-sample inference.

Matching method must be frozen before outcome inspection.

## 10. Support/resistance evidence interpretation

Curcio et al. (2014, Scientific Reports) report that bounce probability around detected support/resistance rises with prior bounces relative to shuffled series.
This supports a salience/self-reinforcement mechanism, but it also demonstrates why prior bounce history cannot be ignored when interpreting a discovered level.

Chung & Bellotti (2021) similarly report that higher prior bounce counts are associated with greater subsequent bounce probability and that level effects decay over time.

D01 implication:
a detector/control design that compares historically salient zones with arbitrary non-salient prices risks attributing salience selection to "structural memory."

Large technical-rule studies with false-discovery/data-snooping controls remain the counterweight:
selection/search degrees of freedom can manufacture apparently persistent technical effects.

## 11. Current decision

DETECTOR_SELECTION_CONFOUND = MATERIAL.

MECHANICAL_SELECTION_LAYER = REQUIRED.

BEHAVIORAL_SALIENCE_LAYER = REQUIRED_BUT_ESTIMAND_CHANGING.

E2_AND_E3_BOTH_REQUIRED_FOR_MECHANISM_INTERPRETATION.

TRUE_ZONE_GT_PSEUDO = INSUFFICIENT_FOR_CAUSAL_MEMORY_CLAIM.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 12. Exact next continuation

1. Freeze a machine-readable salience vector contract.
2. Build an outcome-blind candidate salience auditor that rejects post-confirmation fields.
3. Extend the DL-027 frozen pseudo-zone manifest with salience descriptors but do not choose matches.
4. Freeze common-support / non-matchable-parent semantics before outcomes.
5. Hand E0-E3 estimands and matching ownership to D16.
6. No outcome join / no Formal change.
