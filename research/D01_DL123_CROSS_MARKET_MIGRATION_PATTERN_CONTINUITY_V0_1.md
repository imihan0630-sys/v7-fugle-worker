# D01 DL-123 — Cross-Market Migration Pattern Continuity Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / CROSS_MARKET_PATTERN_CONTINUITY_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Define when a D01 structural episode may continue across a market/board transition such as TPEx -> TWSE or Innovation Board -> ordinary TWSE, without falsely creating a new pattern or falsely stitching different securities.

## Required gates

A cross-market pattern may preserve episode lineage only when all pass:
- identityRelation proves SAME_SECURITY_MARKET_MIGRATION_PROVEN or SAME_SECURITY;
- exact old-market membership terminates at the certified boundary;
- exact new-market membership begins at the certified boundary;
- no overlapping dual-membership ambiguity remains;
- the transition interval is causally classified;
- raw/technical price space is comparable or transformed by a certified continuity receipt;
- sourceHistoryHash and exactSessionHash are versioned across the boundary;
- no successor-security/share-conversion event exists.

If any gate is UNKNOWN:
CROSS_MARKET_CONTINUITY_BLOCKED.

## Structural episode rule

A pre-transition episode may remain the same structural root when:
- immutable episode/root anchors remain causally valid;
- no identity transition occurs;
- price-space continuity is certified;
- no future anchor is introduced by the migration;
- the new-market bar is appended prospectively to the same episode.

The migration itself does not create a second Alpha vote.

## Market-regime boundary

Even when security identity is the same, market migration can change:
- matching microstructure;
- liquidity;
- investor mix;
- board/listing constraints;
- legal reference-price mechanics.

Therefore D01 preserves:
marketRegimeBoundary=true
on the transition.

This means:
- price-geometry lineage may continue;
- market-regime context changes and must be visible to D04/D05/D16;
- the same episode cannot be counted twice as old-market and new-market confirmation.

## Gap interpretation

If the first new-market open differs from the last old-market close:
rawGap may be computed only after same-security and price-space gates pass.

But the gap cause class must include:
MARKET_MIGRATION_BOUNDARY_GAP.

It may not be silently labeled:
- ordinary breakaway gap;
- earnings gap;
- technical breakout gap;
without separate causal evidence.

Reference price used by the new market is context, not proof that the gap is an ordinary free-market gap.

## Boundary interval

No synthetic OHLC may be inserted between:
- final eligible old-market session;
- transition/no-trading interval;
- first eligible new-market session.

Eligible-session chronology is authoritative.

Calendar-day distance is descriptive only.

## Multi-market duplicate firewall

For a proven same-security migration:
- predecessor-market and successor-market records inside one transition episode share one structural opportunity root;
- transition produces one migration context node;
- old/new market labels do not multiply opportunity count.

## Current decision

PROVEN_SAME_SECURITY_MIGRATION_CAN_PRESERVE_EPISODE = TRUE.
MARKET_MIGRATION_CREATES_EXTRA_ALPHA_VOTE = FALSE.
MIGRATION_BOUNDARY_GAP_EQUALS_ORDINARY_GAP = FALSE.
MARKET_REGIME_BOUNDARY_MUST_BE_VISIBLE = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
