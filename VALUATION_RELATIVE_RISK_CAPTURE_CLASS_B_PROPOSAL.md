# VALUATION_RELATIVE_RISK — Prospective Receipt Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-B PROPOSAL ONLY / NOT IMPLEMENTED  
Formal Core: LOCKED

## Selection-time receipt

Unit:
`scanDate x decisionGeneration x symbol x pricePool`.

Parent:
- immutable parent generation/fingerprint;
- exact pre-valuation Formal-reach state;
- Formal version / gate-observer version;
- industry id/classification version.

Exact deployed valuation state:
- priceEarningsRatio;
- priceBookRatio;
- valuationObserved;
- valuationDate / valuationSource;
- exact already-computed sectorMedianPe;
- positivePeConstituentCount;
- candidateIncludedInPositivePeConstituents;
- relativePe;
- exact >2.5 state.

Growth-exception state:
- revenueQuarterYoY;
- revenueGrowthException (>25);
- epsYoY;
- epsGrowthEvidenceObserved;
- epsGrowthException (>25 when observed);
- exact deployed combined growth-exception boolean;
- evidence-quality class.

Decision state:
- exact current Formal valuation wouldReject;
- exact current Formal rejection reason;
- no outcome fields.

## Critical guards

- Never recompute the deployed median as leave-one-out.
- Never call positivePeConstituentCount a peer count without an explicit self-inclusion flag.
- Missing EPS YoY does not change the deployed boolean result; it changes evidence quality.
- Missing sector median remains research UNKNOWN even though Formal skips the veto.
- No historical current-data reconstruction may be relabeled as PIT.
- Capture failure must not alter Formal selection.

## Engineering boundary

All fields except durable lineage/count provenance are already available or computable from same-scan loaded rows with zero new market calls.

Persisting a full same-generation receipt in shared runtime/D1 is Class B and requires owner approval.

Changing the median definition, PE cohort, 2.5 threshold, 25% exception, treatment of missing EPS, or veto behavior is Class C.

No implementation is performed here.
