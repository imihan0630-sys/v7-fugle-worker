# System 2 Taiwan Execution Simulator Spec

Updated: 2026-09-26 Asia/Taipei
Status: PRE-REGISTERED EXECUTION SPEC V0.1

## Objective

Separate signal/trigger prices from realistic simulated fills.

A price being touched by OHLC does not automatically mean the strategy got the best possible fill.

## Core objects

Each simulated order records:
- decisionId
- strategyId/version
- symbol
- decisionTimestamp
- earliestEligibleExecutionTimestamp
- side
- orderType
- triggerPrice / limitPrice
- requestedShares
- maxHoldingSessions
- source/provenance

Each fill records:
- fillTimestamp
- rawFillPrice
- slippage
- commission
- transactionTax
- allInPrice
- shares
- liquidity status
- fillQuality
- ambiguity reason

## Decision-time firewall

If a daily strategy is frozen after market close:
- that same day's high/low cannot be used to create a fill after the decision;
- the earliest normal execution observation is the next eligible trading session.

Intraday strategies require their own timestamped bar/quote contract.

## Supported order semantics

### BUY_STOP / breakout trigger
- If next eligible open is already above the trigger, candidate fill starts from the open, not the lower trigger.
- If open is below trigger and an eligible later bar crosses the trigger, candidate fill starts from trigger plus slippage.
- If price never trades/crosses in an eligible sequence, NO_FILL.

### BUY_LIMIT / pullback entry
- If eligible open is at or below the buy limit and trading is possible, candidate fill may occur at the open or better within limit semantics.
- If low touches the limit later, candidate fill starts from the limit subject to liquidity/slippage.
- A low below the limit on a suspended/non-tradable state is not a fill.

### SELL_STOP
- Gap below stop fills from the first executable price, not the stop price.
- Limit-down or suspension may delay/deny exit.

### TAKE_PROFIT_LIMIT
- A high above target does not prove target filled if the order was not active yet or sequencing is ambiguous.
- Use eligible order timing first.

## Gap handling

Gap rules are adverse-realistic:
- buy stop gap-up: fill cannot be better than the first executable market price merely because trigger was lower;
- sell stop gap-down: fill cannot be assumed at the higher stop price;
- gap through both decision thresholds requires event sequencing and may be AMBIGUOUS.

## Taiwan price-limit handling

Use official daily limit-up/limit-down/reference-price data when available.

Do not blindly calculate a generic ±10% when official limit data or exceptional trading rules differ.

If a security is locked at a limit with no executable liquidity:
- LIMIT_BLOCKED / NO_FILL or delayed fill;
- touching the limit price is not sufficient evidence of execution.

## Same-bar ambiguity

When only OHLC is available and the same eligible bar touches both stop and target:
- mark AMBIGUOUS_SAME_BAR;
- do not select the favorable sequence;
- preserve both possible paths or use a separately reported conservative path;
- never rewrite history after later knowing the trade result.

For performance ranking, ambiguous trades must be reported separately from unambiguous outcomes.

## Liquidity

At minimum inspect:
- avgVolume20Lots
- avgAmount20
- current bar/session volume where available
- intended order notional
- odd-lot vs board-lot execution context when relevant

V0 does not pretend full market impact is known.

Future slippage models may depend on:
- notional / ADV
- spread
- volatility
- opening/closing auction
- price limit state
- microstructure observations

## Costs

### Transaction tax
Current project research documents:
- ordinary Taiwan stock sell-side transaction tax: 0.3%;
- eligible same-day offsetting stock transactions: 0.15% under the currently documented temporary regime through 2027-12-31.

The simulator must store tax rule/version/date and apply the correct rule for the simulated transaction type.

### Brokerage commission
Account discount and minimum commission are broker/account-specific.

Therefore:
- commissionRate is configurable;
- minimumCommission is configurable;
- do not guess the owner's actual discount;
- performance can report scenario results until account-specific parameters are supplied.

### Slippage
No single hardcoded slippage is approved yet.

V0 stores explicit modeled slippage assumptions and supports scenario bands. Later calibration uses observed spread/depth/fill evidence.

## Corporate actions

Before historical execution:
- split/dividend/capital-reduction/other action semantics must be applied consistently;
- raw vs adjusted price spaces must not be mixed;
- action gaps cannot be treated as normal strategy gap P/L without adjustment/provenance.

## Trading halts / suspensions

If no executable market exists:
- no synthetic fill;
- position remains exposed until an eligible execution point;
- outcome records the blocked interval.

## Partial fills

V0 may initially use all-or-none simulated fills only for sufficiently liquid orders, but this limitation must be explicit.

Before larger-size simulation, add partial-fill rules rather than assuming unlimited liquidity.

## Fill-quality vocabulary

- FILLED_NORMAL
- FILLED_GAP
- FILLED_WITH_SLIPPAGE
- PARTIAL_FILL
- NO_FILL
- LIMIT_BLOCKED
- HALT_BLOCKED
- LIQUIDITY_BLOCKED
- AMBIGUOUS_SAME_BAR
- DATA_UNKNOWN

## Metrics

Always distinguish:
- signal return
- gross simulated fill return
- net explicit-cost return
- net all-in modeled return

Do not label signal-price return as realized trading performance.

## Safety

This simulator is independent from V8 live positions and signals. It does not place real orders and does not change System 1 monitoring behavior.
