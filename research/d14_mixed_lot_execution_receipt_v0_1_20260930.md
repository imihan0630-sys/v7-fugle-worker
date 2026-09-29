# D14 Mixed-Lot Execution Receipt v0.1

Date: 2026-09-30 Asia/Taipei  
Status: RESEARCH_ONLY / FALSIFICATION_FROZEN / PROSPECTIVE_RECEIPTS_PENDING  
Owners: D14-07 signal-to-fill latency, D14-08 odd-lot/regular-lot execution, D14-14 special matching  
Formal Core impact: NONE

## Research question

The 2026-09-29 D14 mechanism-aware clock contract correctly separated:
- decisionKnownAt;
- mechanismEligibleAt;
- submitAt;
- fillAt.

This round tested whether those four scalar timestamps are **sufficient** for Taiwan mixed-lot execution attribution.

They are not sufficient when market eligibility can become unavailable again after the first eligible instant.

## Positive mechanism evidence

Current TWSE material distinguishes:
- regular intraday trading as continuous matching during the main intraday session;
- intraday odd-lot order entry beginning at 09:00, with first matching at 09:10 and periodic call auctions;
- volatility interruption as a two-minute matching delay, after which matching resumes by call auction.

Official anchors:
- https://www.twse.com.tw/en/products/system/trading.html
- https://twse-regulation.twse.com.tw/ENG/EN/law/DAT08.aspx?FLCODE=FL007115

Therefore a mixed parent order cannot safely use one shared benchmark or one shared market clock.

## New falsification: four scalar clocks are necessary but not sufficient

Synthetic mechanism-valid counterexample:

Parent decision known at 09:03:00.

Odd-lot leg:
- first mechanism eligibility = 09:10:00;
- mechanism is available 09:10:00-09:10:20;
- volatility interruption blocks matching 09:10:20-09:12:20;
- confirmed fill = 09:12:25.

If only the four scalar clocks are used:
- raw latency = 565 seconds;
- pre-eligibility wait = 420 seconds;
- scalar post-eligibility latency = 145 seconds.

But 120 of those 145 seconds are an evidenced market-mechanism block.

The actual eligible market exposure before fill is:
- 20 seconds before the interruption;
- 5 seconds after the interruption;
- total eligible exposure = 25 seconds.

Using first mechanismEligibleAt overstates actionable post-eligibility latency by 120 seconds.

Moving mechanismEligibleAt to 09:12:20 is also wrong because it erases the 20 seconds in which the order was already eligible before the interruption.

Therefore the receipt must retain **mechanismBlockedIntervals** instead of attempting to repair the problem by moving one timestamp.

## Second falsification: odd-lot call auctions are discrete opportunities, not continuous eligible time

A deeper source check rejects another shortcut.

Intraday odd-lot matching is periodic call auction. After the first 09:10 match, execution opportunities occur at discrete auction times rather than continuously between them.

That means a duration such as:
`fillAt - mechanismEligibleAt - blockedIntervals`
still has the wrong economic meaning for odd-lot execution.

Example:
- order is already submitted before 09:10;
- actual matching opportunities occur at 09:10:00, 09:10:05, 09:10:10 and 09:10:15;
- a volatility interruption then delays the next match until 09:12:20;
- the order fills at the 09:12:25 auction.

The correct research facts are:
- six actual matching opportunities from first eligibility through fill;
- five prior submitted opportunities ended without a fill;
- the interruption explains the missing scheduled auctions during the blocked interval.

The incorrect statement is:
- “the order had 25 seconds of continuous executable exposure.”

It did not. Between call auctions there is no continuous odd-lot matching.

Therefore v0.1 uses two different eligibility models:
- REGULAR_LOT -> `CONTINUOUS_WITH_BLOCK_INTERVALS`;
- INTRADAY_ODD_LOT -> `DISCRETE_MATCH_OPPORTUNITIES`.

For odd-lot receipts, `eligibleExposureToFillMs` is intentionally null. The research layer records opportunity counts instead.

## Receipt design

Parent:
- parentActionId;
- symbol;
- action;
- intendedQuantity;
- decisionKnownAt.

For intended quantity Q:
- regularShares = floor(Q / 1000) × 1000;
- oddLotShares = Q mod 1000.

Each leg retains independent:
- lot type;
- matching mechanism;
- intended quantity;
- first mechanism eligibility and source;
- benchmark source/time/price with the same lot type;
- submission-attempt lineage;
- confirmed fills;
- mechanism-block intervals;
- latency vector.

Replacement attempts are allowed only as non-overlapping lineage. Fills are counted from unique confirmed fill rows, never from submitted quantities.

## PIT / provenance firewall

Fail closed when:
- the regular/odd quantity split does not reconcile to the parent;
- regular and odd benchmarks are mixed;
- benchmark is observed after submission;
- mechanism eligibility source/state is missing;
- an interruption is claimed without an interval;
- a fill occurs inside an interruption interval;
- simulated disclosure is labeled as a fill;
- submit/fill/terminal ordering is impossible;
- replacement attempts overlap;
- fill ids are duplicated, including across lot legs.

This makes the receipt suitable for research attribution, not merely order-history storage.

## Latency vector

Per confirmed fill, common diagnostics are:
- rawLatency;
- preEligibilityWait;
- decisionToSubmitLatency;
- submitToFillLatency.

For continuous regular-lot matching:
- scalarPostEligibilityLatency;
- mechanismBlockedWaitAfterEligibility;
- eligibleExposureToFill.

For periodic odd-lot call auctions:
- matchingOpportunityCountFromDecisionToFill;
- matchingOpportunityCountAfterSubmitToFill;
- matchingOpportunitiesBeforeSubmit;
- priorSubmittedOpportunitiesWithoutFill.

No weighted latency score is allowed.

A prior unfilled odd-lot auction does not by itself prove the order was marketable or that execution quality was poor. Price/queue/limit-order context remains a separate requirement.

A long raw latency can be almost entirely scheduled/mechanism wait. A short fill can still be expensive if the price is poor. Latency and implementation shortfall remain separate evidence families.

## Maturity decision

D14-07, D14-08 and D14-14 remain L2/40%.

Reason:
- mechanism source feasibility exists;
- schema and deterministic validator now exist;
- but there is still no multi-date prospective mixed-lot receipt corpus with replayable decision/eligibility/submission/fill provenance.

No L3 promotion from synthetic validation.

## Exact next continuation

Capture isolated prospective mixed-lot receipts on independent sessions.

For a first readiness review:
- at least 3 independent sessions;
- deterministic replay from immutable receipts;
- no missing mechanism-state provenance;
- no simulated disclosure as fill;
- all replacement lineage reconciles;
- regular/odd benchmarks remain mechanism matched.

Three sessions are a review checkpoint, not an automatic promotion rule.

No Formal optimization candidate.
