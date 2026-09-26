# System 2 Position & Exposure Management Architecture

Updated: 2026-09-26 Asia/Taipei
Status: OWNER-APPROVED ARCHITECTURE V0.1 / THRESHOLDS NOT YET FROZEN

## Purpose

System 2 must manage actual holdings and simulated positions symmetrically.

The system must not be structurally biased toward:
- REDUCE / HOLD only;
- treating every later rise as "chasing";
- refusing to restore exposure after a valid risk reduction;
- anchoring re-entry to the old sell/reduce price.

A position can rationally be reduced when risk rises and later re-expanded at a higher price when the information state improves.

## Core principle: actual exposure vs desired exposure

For every monitored holding, System 2 maintains two distinct concepts:

1. **Actual exposure**
   - verified/current shares where available;
   - average cost for P&L/accounting;
   - current market value;
   - actual position state.

2. **Desired exposure**
   - the exposure justified by the current strategy/thesis/regime/risk state;
   - independent from historical cost basis;
   - versioned and explainable.

Action is based on the gap between actual and desired exposure.

Examples:
- actual > desired -> REDUCE / EXIT candidate;
- actual ~= desired -> HOLD;
- actual < desired and recovery/add conditions are valid -> ADD / RE-ADD candidate.

Exact position percentages are not frozen yet and require Shadow validation.

## Actual holdings are always monitored

Owner-approved rule:

- The user's actual holdings belong to a dedicated POSITION_MONITOR layer.
- Actual holdings do **not** consume the 12-symbol candidate/watch-pool capacity.
- Actual holdings do **not** consume the per-strategy 3-symbol ACTIVE_ENTRY_MONITOR capacity.
- A position remains monitored until actual ownership is reconciled to zero or the owner explicitly removes it from tracked holdings.
- A stock may simultaneously exist in POSITION_MONITOR and one or more strategy research contexts.

This prevents an existing holding from disappearing merely because it is no longer a new-entry candidate.

## Two-sided monitor on every holding

Every holding cycle must evaluate both:

### A. Downside / exposure-reduction side
- thesis deterioration;
- material bearish event;
- market/sector regime deterioration;
- technical breakdown;
- adverse price-volume acceptance;
- crowding/liquidity risk;
- stop/invalidation;
- excessive concentration / portfolio heat.

Possible outputs:
- HOLD
- RISK_WARNING
- REDUCE_ELIGIBLE
- EXIT_ELIGIBLE

### B. Upside / exposure-restoration side
- original reduction reason has weakened/disappeared;
- fundamental/industry thesis remains or improves;
- market/sector state confirms recovery;
- price structure reclaims/accepts key levels;
- higher low / renewed trend / breakout acceptance where strategy-relevant;
- price-volume participation improves without blow-off;
- institution/ownership context supports recovery where available;
- reward/risk from **current price** remains acceptable;
- portfolio concentration/capital constraints permit more exposure.

Possible outputs:
- RECOVERY_WATCH
- READD_ELIGIBLE
- ADD_ELIGIBLE
- RESTORE_IN_PROGRESS
- RESTORED

The monitor must never evaluate only the downside branch.

## Position state machine

Recommended state graph:

```
EXTERNAL_OR_INITIAL_HOLDING
        |
        v
POSITION_MONITOR
        |
        +----------------------------+
        |                            |
        v                            v
HOLD_TARGET                    RISK_WARNING
                                     |
                                     v
                              REDUCE_ELIGIBLE
                                     |
                          confirmed actual reduction
                                     |
                                     v
                             REDUCED_CONFIRMED
                                     |
                                     v
                              RECOVERY_WATCH
                                     |
                  recovery evidence + current RR acceptable
                                     |
                                     v
                              READD_ELIGIBLE
                                     |
                        staged restoration if appropriate
                                     |
                                     v
                           RESTORE_IN_PROGRESS
                                     |
                                     v
                                  RESTORED
```

Separate terminal risk path:

```
POSITION_MONITOR / REDUCED_CONFIRMED
        -> THESIS_INVALIDATED
        -> EXIT_ELIGIBLE
        -> CLOSED
```

## Fresh entry and re-add are not the same decision

### Fresh entry
A new-entry chase guard may compare:
- current price vs planned entry zone;
- current price vs trigger;
- current price vs max-chase;
- extension from support/base;
- current RR.

### Re-add after prior reduction
A re-add must **not** be rejected merely because:
- current price is above the prior reduce/sell price;
- current price is above the old original entry;
- the stock has already risen from its recovery low.

Instead evaluate:
- what risk caused the reduction?
- is that risk still present?
- what new information has arrived?
- has price accepted the recovery?
- what is the current invalidation/stop?
- what upside remains from the current price?
- what is the cost/friction of restoring?
- what is the risk of waiting versus restoring now?

A higher re-entry price can be rational because confirmation has value.

## Anti-anchoring rules

System 2 must not use these as automatic decision anchors:
- average cost;
- prior reduce price;
- historical highest price;
- missed lower price.

Those prices may be displayed for accounting/context, but they do not define whether today's purchase is "chasing".

"Chasing" must be defined relative to current structure, volatility, entry thesis, extension and remaining reward/risk.

## Re-add confirmation dimensions

A future READD eligibility model should consider independent dimensions rather than one hard trigger:

1. reduction-reason resolution;
2. company thesis integrity;
3. industry/sector recovery;
4. market regime;
5. price-structure recovery;
6. price-volume acceptance;
7. institutional/ownership recovery where relevant;
8. current RR / remaining upside;
9. portfolio concentration/heat;
10. friction / whipsaw risk.

Do not lock exact weights or thresholds before prospective Shadow evidence.

## Staged restore

System 2 should support staged restoration rather than all-or-nothing re-entry.

Examples of lifecycle semantics:
- READD_STAGE_1 / partial restore;
- READD_STAGE_2 / additional restore after further confirmation;
- RESTORED / target exposure reached.

Exact tranche percentages are not yet frozen.

This allows the system to pay for confirmation without requiring an all-at-once chase.

## Hysteresis / anti-whipsaw

Reduce and re-add thresholds should not be mirror-image single-price lines.

Research must preserve a no-trade/hysteresis region so small oscillations do not create repeated:
REDUCE -> RE-ADD -> REDUCE -> RE-ADD churn.

Any hysteresis thresholds require cost-aware prospective validation.

## Event handling

A material intraday event can immediately change desired exposure:
- bearish new information can trigger RISK_WARNING / REDUCE / EXIT review;
- positive resolution of a prior risk can move REDUCED_CONFIRMED -> RECOVERY_WATCH or READD_ELIGIBLE.

The reason and first-known timestamp must be frozen.

## Portfolio-aware constraints

Even when a stock is READD_ELIGIBLE, restoration may be delayed/limited by:
- total portfolio heat;
- industry/cluster concentration;
- cash availability;
- correlated holdings;
- liquidity;
- account/order-size practicality.

This is a portfolio constraint, not a statement that the stock thesis is invalid.

## Frozen action evidence

Every position-management action/opportunity must record:
- symbol;
- strategy/thesis memberships;
- actualShares;
- desiredExposureState;
- priorExposureState;
- action type;
- decision timestamp;
- current price/reference;
- reason;
- reductionReason status;
- regime;
- sector state;
- current RR;
- key factor evidence;
- costs/friction assumptions;
- action eligibility vs actual execution;
- post-action D1/D3/D5/D10/MFE/MAE later as outcomes.

Do not record only executed or profitable re-adds.

## Evaluation

A REDUCE is not judged wrong merely because price later rises.

Evaluate:
- downside avoided;
- MFE/MAE after reduction;
- opportunity cost;
- time spent underexposed;
- re-add opportunity availability;
- re-add capture;
- transaction costs;
- churn;
- total-capital outcome.

Likewise, a RE-ADD is not judged good merely because price later rises.

## System 1 boundary

This architecture is native to System 2.

It may reuse Shared Knowledge from System 1 REDUCE/RE-ADD research, but it does not modify or depend on System 1's Formal position state machine.
