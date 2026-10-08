# D01 DL-139 — Session-Mechanism Price-Discovery / Confirmation Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SESSION_MECHANISM_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent mechanically constrained or repeated-price sessions from masquerading as independent D01 price discovery or confirmation.

## Mechanism classes

OPENING_CALL_AUCTION
REGULAR_CONTINUOUS
CLOSING_CALL_AUCTION
INTRADAY_ODD_LOT_CALL_AUCTION
AFTER_HOURS_ODD_LOT_CALL_AUCTION
AFTER_HOURS_FIXED_PRICE
BLOCK_TRADE
VOLATILITY_INTERRUPTION_CALL_AUCTION
UNKNOWN_MECHANISM

## After-hours fixed-price rule

After-hours fixed-price trading uses the regular-session close as the trade price.

Therefore an after-hours fixed-price execution at the same close:
- is not a new independent close;
- is not a second breakout confirmation;
- is not a second support/resistance touch;
- does not advance D01 pattern lifecycle by price discovery alone.

It is execution/liquidity evidence under a separate mechanism.

## Odd-lot rule

Intraday odd-lot and after-hours odd-lot use separate call-auction mechanisms.

Their prices may differ from regular-lot prices.

D01 must not:
- replace regular price geometry with odd-lot geometry silently;
- average both mechanisms into one custom bar;
- count agreement across both as two independent votes.

## Opening / closing auctions

Opening and closing prices remain valid canonical bar fields when supplied by the canonical daily source.

But separate auction microstructure observations do not become extra D01 votes over the same canonical OHLC bar.

## Block trades

Block-trade prices are separate negotiated/large-trade mechanism observations.

They are not first-wave D01 canonical pattern bars unless a future research module explicitly preregisters that object.

## Current decision

AFTER_HOURS_FIXED_PRICE_EQUALS_NEW_PRICE_DISCOVERY = FALSE.
ODD_LOT_REGULAR_LOT_AGREEMENT_EQUALS_TWO_VOTES = FALSE.
AUCTION_SUBOBSERVATION_EQUALS_EXTRA_OHLC_VOTE = FALSE.
BLOCK_TRADE_PRICE_ENTERS_FIRST_WAVE_PATTERN_BY_DEFAULT = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
