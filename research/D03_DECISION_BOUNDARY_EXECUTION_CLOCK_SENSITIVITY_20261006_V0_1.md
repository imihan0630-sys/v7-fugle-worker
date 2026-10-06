# D03 Decision-Boundary / Execution-Clock Sensitivity V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-979~1102
Status: RESEARCH_ONLY / OUTCOME_CLOSED / EXECUTION_CLOCK_SEMANTICS_FROZEN
Formal Core: LOCKED

## Purpose

Refine one overly broad timing shorthand:

`SAME_CLOSE_FILL_FORBIDDEN`

into the more precise rule:

`SAME_CLOSING_AUCTION_FILL_FOR_CLOSE_FINALIZED_SIGNAL = FORBIDDEN`.

A later execution at the same numerical closing price can be causally legal if it occurs in a distinct post-close trading venue after the signal became knowable. It still requires venue eligibility, order timing, quantity/lot compatibility and explicit fill uncertainty.

This tranche changes no production execution behavior.

## External Taiwan-market facts used by this contract

Current TWSE ordinary-board trading:
- orders may be placed from 08:30;
- opening matching occurs at 09:00 by call auction;
- continuous matching runs through 13:25;
- 13:25~13:30 accumulates orders for the closing call auction;
- ordinary close is matched at 13:30;
- specified volatility conditions may delay an individual security's close.

TWSE after-hours fixed-price trading:
- order submission 14:00~14:30;
- matching at 14:30;
- execution price is the same day's closing price;
- same-price priority is randomized by computer;
- availability depends on the security having a valid closing price and being eligible for that venue.

After-market odd-lot trading is a distinct venue and must not be conflated with board-lot fixed-price trading.

These market rules constrain causal execution clocks; they do not prove fillability for a specific order.

## TI-1103 — price identity is not clock identity

Two executions can have the same numerical price but different causal clocks.

Therefore:
`EXECUTION_PRICE == OFFICIAL_CLOSE`
does not imply
`EXECUTION_OCCURRED_IN_CLOSING_AUCTION`.

Timing validity is determined by:
- when the signal became known;
- when the order could be submitted;
- which venue accepted the order;
- when matching occurred;
- whether the order was actually/assumed filled under a valid fill model.

## TI-1104 — closing-auction fill is forbidden for a close-finalized factor

If factor construction requires the final official close or the closing auction result:
- the factor is not known before that closing auction completes;
- it cannot be credited with a fill in the auction that created the factor.

Required state:
`CLOSE_FINALIZED_SIGNAL_CANNOT_FILL_ITS_OWN_CLOSING_AUCTION`.

This supersedes any ambiguous reading of the earlier boolean sameCloseFill rule.

## TI-1105 — the earlier sameCloseFill test is semantically narrowed

Historical fixtures using:
`sameCloseFill=true`
are interpreted as:
`sameClosingAuctionFillUsingCloseThatFinalizedSignal=true`.

They are not interpreted as:
"any later trade at the same numerical closing price is impossible."

Future schemas should avoid the bare sameCloseFill boolean and bind explicit venue/match clocks.

## TI-1106 — pre-close signal may target the closing auction only if it does not depend on that auction

A provisional/intraday signal may be eligible for a closing-auction execution experiment only if:
- signalKnownAt precedes order submission;
- the signal does not consume the final close/closing-auction result;
- order submission occurs within a valid order-entry interval;
- finality label remains PROVISIONAL/INTRADAY as appropriate;
- closing-auction fillability is modeled.

A later final daily version is a different factor/timing version and cannot backfill the earlier order.

## TI-1107 — post-close fixed-price board-lot path is a distinct legal candidate

For an eligible security/order:
- signalKnownAt must precede the submitted order;
- order must be submitted during the valid after-hours fixed-price window;
- match occurs later at the venue's official matching time;
- numerical execution price may equal the already-known closing price.

This path is not look-ahead merely because the numerical price equals Close_t.

## TI-1108 — post-close fixed-price fill is never assumed certain

The after-hours fixed-price venue uses its own matching/priority rules.

Required research fields:
- venue;
- orderSubmittedAt;
- orderQuantity;
- tradingUnitCompatibility;
- closingPriceExists;
- venueEligibility;
- queue/priority assumption;
- fillStatus or fillProbabilityModel;
- matchedAt;
- executedQuantity.

A backtest may not set:
`filled=true`
solely because a closing price exists.

## TI-1109 — board-lot and odd-lot execution paths are separate hypotheses

A model suggesting fewer than one standard trading unit cannot automatically use board-lot fixed-price execution.

Research must bind:
- BOARD_LOT_FIXED_PRICE; or
- AFTER_MARKET_ODD_LOT; or
- NEXT_SESSION_ODD_LOT/REGULAR path.

Changing lot/venue to obtain a better fill is a trading-policy version change.

## TI-1110 — after-market odd-lot is not the same as fixed-price close execution

After-market odd-lot orders:
- use a separate order window;
- are limit-order based;
- are matched through their own call-auction rules.

Do not assign the same-day closing price automatically unless an actual/valid modeled odd-lot match supports it.

## TI-1111 — signal finality before post-close order entry is mandatory

A final-close signal can use a post-close venue only if:
`signalKnownAt <= orderSubmittedAt`.

Chart availability or later historical data is insufficient.

The receipt must store the actual source/finality timestamp used by the research observer.

## TI-1112 — delayed close shifts the earliest final-signal clock

If a security's close is delayed:
- final close-dependent featureKnownAt shifts with the actual final matching/finality time;
- a hardcoded 13:30 signalKnownAt fails.

Post-close order feasibility must be evaluated against the actual security-level close completion and source availability.

## TI-1113 — no closing price blocks fixed-price path

If the security has no valid closing price or is not eligible for after-hours fixed-price trading:
`AFTER_HOURS_FIXED_PRICE_UNAVAILABLE`.

The research must not invent a synthetic close fill.

## TI-1114 — next-session opening call is the robust generic baseline for final-close signals

For a completed daily factor, a generic deployable baseline is:
- signal finalized after session t close;
- order may be staged before the next session open under the relevant broker/exchange rules;
- first match is the next session opening call auction.

Research outcome begins from the actual/modeled next-session executable price, not Close_t.

This baseline naturally includes overnight gap risk.

## TI-1115 — next-open is not guaranteed either

Opening-call execution can fail or differ from a naïve open-price assumption due to:
- order type/limit;
- price limits;
- suspension;
- no match;
- insufficient executable quantity;
- special trading conditions.

Therefore:
`NEXT_OPEN_PRICE`
is not automatically a fill receipt.

## TI-1116 — execution opportunity hierarchy

For close-finalized daily factors, registered research candidates may include:

E0:
`NO_EXECUTION_DIAGNOSTIC_ONLY`.

E1:
`POST_CLOSE_BOARD_LOT_FIXED_PRICE`
when legally/operationally eligible.

E2:
`POST_CLOSE_ODD_LOT_CALL_AUCTION`
when quantity/venue eligibility requires it.

E3:
`NEXT_SESSION_OPENING_CALL`.

E4:
`NEXT_SESSION_FIRST_EXECUTABLE_CONTINUOUS`
if opening-call assumptions are intentionally avoided.

The hierarchy is not a ranking. Each path has different availability/fill/cost semantics.

## TI-1117 — execution-path search consumes multiplicity / policy budget

If research compares E1/E2/E3/E4 after seeing returns and selects the best:
that is execution-policy optimization.

Required:
- executionPolicyFamilyId;
- candidate path set frozen before outcomes;
- selection method;
- cost/fill model version;
- holdout consumption.

The best execution clock cannot be chosen retrospectively for free.

## TI-1118 — missing fill is not zero return and not automatic next-path substitution

If a registered execution path does not fill:
- outcome state = NO_FILL / PARTIAL_FILL / BLOCKED as appropriate.

Do not silently:
- mark return as zero;
- assume full fill;
- jump to the next venue/clock

unless the fallback sequence was preregistered.

## TI-1119 — partial fill changes effective exposure

For partial execution:
- executedQuantity, not requestedQuantity, drives realized exposure;
- remaining unfilled quantity follows the preregistered cancellation/fallback rule.

Partial fill is not equivalent to full fill at a scaled score unless the strategy contract explicitly defines that behavior.

## TI-1120 — numerical same-close price can be a legitimate later execution

If:
- official close is already known;
- signal is finalized;
- after-hours fixed-price order is submitted afterward;
- the order later matches at the venue;
then the execution may legally equal Close_t numerically.

Required interpretation:
`SAME_PRICE_LATER_CLOCK`.

Not:
`SAME_AUCTION_LOOKAHEAD_FILL`.

## TI-1121 — slippage decomposes into clock and venue components

Execution comparison should distinguish:
- signal-to-order latency;
- venue delay;
- price gap;
- spread/limit effects;
- nonfill/partial-fill opportunity cost.

A later clock that happens to use the same price in one venue still carries fill risk and time opportunity risk.

## TI-1122 — close-to-next-open gap is an execution cost/risk variable, not indicator alpha

For completed daily indicators:
`nextOpen - close`
may materially change realized entry economics.

It is not credited to the indicator as post-entry return when the indicator could not trade at the close.

The gap belongs to execution transition from signal to fill.

## TI-1123 — post-close fill path requires contemporaneous market-rule version

Research receipt binds:
- exchange;
- marketRuleVersion;
- venueRuleVersion;
- tradingUnitRuleVersion;
- sessionCalendarVersion.

Historical replay cannot apply today's venue rules to periods where those rules differed without a versioned compatibility argument.

## TI-1124 — market/venue state is part of common support

Comparisons among execution paths must use explicit support accounting:
- security eligible for venue;
- closing price exists;
- order size compatible;
- data for queue/fill assumptions available.

A post-close fixed-price performance sample restricted to easy-to-fill names cannot be generalized to all D03 candidates.

## TI-1125 — D03 factor timing receipt gains explicit executionVenue semantics

Future receipt should replace a bare sameCloseFill flag with:
- executionVenueId;
- orderEntryWindowVersion;
- orderSubmittedAt;
- matchEligibleAt;
- matchedAt;
- executionPriceSource;
- fillModelVersion;
- fillStatus;
- requestedQuantity;
- executedQuantity;
- fallbackPolicyId.

## TI-1126 — current System 1 production behavior is not changed

This research does not instruct System 1 to:
- place after-hours orders;
- change buy timing;
- change share sizing;
- change Top6;
- change 15m semantics;
- change notifications.

Any runtime implementation remains owner-governed engineering/production work.

## TI-1127 — terminal states

Allowed:
- EXECUTION_CLOCK_METHOD_READY;
- SAME_CLOSING_AUCTION_LOOKAHEAD_FORBIDDEN;
- POST_CLOSE_FIXED_PRICE_ELIGIBLE_UNCERTAIN_FILL;
- AFTER_HOURS_FIXED_PRICE_UNAVAILABLE;
- AFTER_MARKET_ODD_LOT_REQUIRED;
- SIGNAL_FINALITY_TOO_LATE_FOR_VENUE;
- NEXT_OPEN_EXECUTION_REQUIRED;
- NO_FILL;
- PARTIAL_FILL;
- VENUE_SUPPORT_BIASED;
- EXECUTION_POLICY_SELECTION_UNCONTROLLED;
- MARKET_RULE_VERSION_INCOMPATIBLE;
- COST_OR_FILLABILITY_UNRESOLVED.

Blocking states are valid scientific results.

## TI-1128 — current decision

Frozen:
`SAME_CLOSING_AUCTION_FILL_FOR_CLOSE_FINALIZED_SIGNAL = FORBIDDEN`.

Frozen:
`SAME_NUMERICAL_CLOSE_PRICE_AT_LATER_CAUSAL_VENUE = POTENTIALLY_VALID_WITH_FILL_GATES`.

Frozen:
`DEFAULT_GENERIC_FINAL_CLOSE_BASELINE = NEXT_SESSION_EXECUTABLE_PATH`.

No outcomes opened.
No execution policy changed.
No maturity promotion.
Formal Core remains LOCKED.

## Exact next continuation point

1. Freeze machine execution-clock schema and adversarial fixture.
2. Explicitly test distinction between same-auction look-ahead and later same-price fixed-price execution.
3. Execute exact canonical fixture and store receipt if possible.
4. Then re-read external machine/prospective evidence lanes; do not continue expanding timing governance unless new evidence requires it.
