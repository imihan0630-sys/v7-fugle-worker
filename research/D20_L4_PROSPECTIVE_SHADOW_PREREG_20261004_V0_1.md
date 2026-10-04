# D20 L4 Prospective Shadow Preregistration — 2026-10-04 V0.1

Frozen: 2026-10-04 08:52:19 Asia/Taipei  
Room: 13｜行為金融與市場心理研究室  
Status: PREREGISTERED_RESEARCH_ONLY / NO_L4_PROMOTION_YET  
Formal Core: LOCKED

## Purpose

D20 has seven L3 modules. L4 requires genuine Prospective Shadow or OOS evidence. This preregistration freezes the first promotion-grade designs before future outcomes are observed.

No retrospective narrative, literature result, reconstructed historical Shadow, or already-inspected development sample may be used as L4 evidence.

## Contaminated development pilot

The 2025-12 through 2026-09 Cathay monthly sentiment values and adjusted 0050 outcome paths were inspected before this preregistration.

Classification:
DEVELOPMENT_ONLY_CONTAMINATED / NOT_PROMOTION_GRADE.

They may be used to discover bad assumptions, data bugs and control requirements. They may never be relabeled as OOS or Prospective Shadow evidence.

## Common parent/outcome firewall

Every promotion-grade parent must freeze:
- parentDecisionReceiptId;
- captureGeneration;
- asOf / knownAt;
- source receipt/hash;
- rule/formula version;
- UNKNOWN state.

Outcome fields are forbidden in the parent object.
Later corrections append; they never rewrite the parent.
No threshold/window is selected after outcomes.
One primitive evidence receipt cannot receive multiple additive votes.

## D20-10 monthly investor sentiment

Primary variables:
- stock-market optimism level;
- risk-preference level;
- month-over-month changes in both.

No directional sign is assumed.

Primary question:
Does sentiment level or change add incremental context beyond prior market return and volatility?

Primary outcomes:
- TAIEX D5;
- TAIEX D20.

0050 adjusted D5/D20 is a secondary tradable-market proxy only.

Minimum L4 evidence:
- 6 independent post-freeze monthly releases;
- complete immutable parent/outcome receipts;
- at least 2 materially different market regimes.

No daily interpolation between releases.

## D20-07 exchange salience

Parent:
official TWSE/TPEx attention designation after the freeze.

Because designation is generated from abnormal activity, pre-designation return/turnover/volatility must be controls.

Primary estimand:
residual effect of designation on D1/D5 return and attention/liquidity persistence versus matched common-support controls.

Minimum:
- 20 independent dates;
- 100 treated events;
- market/sector/liquidity/common-trigger controls.

## D20-04 / D20-05 weekly reference-point panel

Freeze one parent on the last eligible Taiwan session of each week.

D20-04:
distance to 252-session high.

D20-05:
eligible sessions since that high, conditional on D20-04 distance and D03 momentum.

Primary outcome:
D5 market/sector residual return.

Secondary:
D20 residual return.

No outcome-tuned buckets. Primary test is continuous/rank-based.

Minimum:
12 independent weekly dates.

If D20-05 has no stable residual information beyond D20-04/D03, prepare merge/narrowing rather than preserve a duplicate behavioral factor.

## D20-02 TWSE short-side disposition

Scope remains TWSE only until TPEx parity is proven.

Freeze weekly short-position state using actual SBL short-sale balance/sell/return/adjustment plus a versioned short reference price and capital-gains-overhang construction.

Primary outcomes:
- next-week covering ratio;
- D5 market/sector residual return.

Minimum:
12 independent weekly dates.

Long-account PGR/PLR remains UNKNOWN.

## D20-08 event drift

Only prospective events with valid first-known/capture clock are eligible.

Frozen event families:
- monthly revenue with valid first-known;
- earnings with valid first-known.

Frozen horizons:
D1 / D5 / D20.

Do not search for the best event horizon.
Cluster by event date and control pre-event return, sector, liquidity, institutional flow when valid, price-limit state and regime.

Minimum:
12 independent event dates.

## D20-12 identification firewall

For every behavioral hypothesis, preserve on the same cutoff:
- target behavioral proxy;
- structural/microstructure counterfactuals;
- shared primitive links;
- missingness;
- source versions.

L4 requires prospective discriminating evidence. It is not inherited mechanically from other D20 modules.

## Current decision

No D20 module advances to L4 in this tranche.

D20 maturity remains 50.8%.

The research value of this tranche is that the next eligible observations can now become genuine prospective evidence instead of another retrospective study.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Extension 2026-10-04 11:40 Asia/Taipei

Two newly promoted L3 lanes are added prospectively before any eligible post-extension outcome exists.

### D20-01 short-side reference dependence
- Reuse the exact D20-02 TWSE short-side parent receipt.
- Primary question: whether covering behavior is asymmetric around the reconstructed zero-gain reference point after controls.
- Primary outcome: next-week covering ratio.
- Secondary outcome: D5 market/sector residual return.
- Minimum: 12 independent weekly post-extension dates.
- Interpretation guard: this can support bounded reference dependence; it does not identify pure loss aversion and cannot be counted as a second vote from the same D20-02 primitive.

### D20-09 event-conditioned overreaction
- Parent requires valid event first-known clock, frozen surprise definition and completed causal 15m bars.
- Parent contains only initial response information; later reversal is forbidden from the parent.
- Primary question: whether a large continuous event-conditioned initial-response residual predicts later correction after structural controls.
- D03-05 continues to own observable reversal geometry.
- Minimum: 12 independent post-extension event dates.
- If event surprise or structural counterfactual data are missing, behavioral cause remains UNKNOWN.

The extension does not alter any prior frozen lane or open any outcome join.
No L4 promotion is assigned by preregistration itself.

