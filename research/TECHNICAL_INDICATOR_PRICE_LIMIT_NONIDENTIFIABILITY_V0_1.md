# Technical Indicator Price-Limit Non-Identifiability V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / IDENTIFICATION_FIREWALL
Formal Core: LOCKED

## Purpose

Prove a structural limitation of daily OHLC technical indicators on price-limit-binding sessions:

> Once the legal price boundary binds, different latent supply/demand states can generate the same observed OHLC path.

Therefore no Close/High/Low-derived indicator can recover the missing latent price-discovery intensity from daily bars alone.

This is not an alpha test.

## TI-361 — Observational-equivalence construction

Suppose a verified upper price boundary for a session is U.

Two different latent market-clearing states are possible:

State A:
unconstrained clearing pressure would support a price only slightly above U.

State B:
unconstrained clearing pressure would support a price far above U.

If executable trading is capped at U and the observed prints are otherwise identical, both states can produce the same:
- High=U;
- Close=U;
- daily OHLC;
- daily volume, if volume is also chosen equal in the witness.

Daily OHLC cannot identify which latent state occurred.

This is a many-to-one observation map.

## TI-362 — Technical indicators inherit the non-identifiability

If two latent states produce the same observed OHLC sequence, then every deterministic indicator based only on that observed sequence is identical.

Therefore:
- KD identical;
- RSI identical;
- MACD identical;
- ADX/DMI identical;
- Bollinger identical.

This is not correlation.
It is deterministic observational equivalence.

No technical-indicator formula can reverse a many-to-one information loss without additional data.

## TI-363 — Repeated limit-up/down sequence does not recover latent intensity

A sequence of consecutive upper-bound closes may demonstrate persistent observed directional pressure.

It does NOT identify:
- how far latent clearing price would have moved without the limit;
- unfilled queue size;
- queue persistence;
- cancellation/replenishment;
- aggressive order imbalance.

Those require order-book/trade-event evidence.

Therefore prohibited labels from daily OHLC alone:
- "latent return = X";
- "excess demand magnitude";
- "locked buying pressure";
- "queue strength";
- "limit order imbalance";
- "true breakout distance beyond limit".

## TI-364 — What daily indicators may still say

Allowed descriptive statements:
- observed price reached the verified upper/lower legal boundary;
- observed close remained at/inside the boundary;
- observed capped return path has specified KD/RSI/MACD/ADX/BBW values;
- repeated constrained sessions occurred;
- indicator state is numerically valid on observed prices;
- interpretation is CONSTRAINED.

Not allowed:
- infer the missing unconstrained price;
- treat capped indicator magnitude as proportional to latent demand intensity.

## TI-365 — Cross-sectional ranking hazard

Suppose stock A and stock B both close at their upper limits with otherwise similar observed paths.

Technical indicators may tie or nearly tie even if hidden queue/intensity differs materially.

Therefore:
technical-only cross-sectional ranking on boundary-binding sessions has an identification ceiling.

If future System 2 or System 1 research wants to distinguish such cases, candidate additional evidence must come from a different information source, e.g.:
- order-book depth / queue;
- trade-event flow;
- limit-touch timing;
- reopen/uncross behavior;
- next-session acceptance.

Such evidence belongs to Microstructure / execution / Price-Volume ownership, not to the technical-indicator formula itself.

## TI-366 — Inference rule

For any boundary-binding observation:

PRICE_DISCOVERY_STATE = CONSTRAINED_*

Technical indicator fields remain stored.

But:
- no ordinary unconstrained magnitude comparison;
- no latent-intensity imputation;
- no technical-majority bonus for multiple indicators that all consume the same capped path.

Future analysis may compare constrained episodes as a separate preregistered population.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Preserve constrained-session observations; do not discard.
2. Do not impute latent prices.
3. If future research studies consecutive limit events, require Microstructure/Price-Volume evidence to measure queue/intensity.
4. Keep daily technical indicators descriptive under binding constraints.
5. Runtime observer remains NO_GO.
