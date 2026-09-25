# Market Breadth + Sector Rotation + Leadership Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: BR-001 through BR-010 complete.
Next: BR-011.

## Durable conclusions

- Breadth is participation, not direction and not a standalone buy/sell rule.
- Literature is mixed: a 64-country study finds predictive breadth effects, while a broad study of 93 technical market indicators finds little robust/economic return predictability. Both sides are retained.
- Three universes must remain separate: official whole-market breadth, common-stock research breadth, Formal eligible-universe breadth.
- Current source sector breadth is NOT whole-market breadth because `normalizeMarketRow()` filters non-common instruments and close < NT$10 before `buildTodaySectorStats()`.
- Current system already has one-day sector breadth, average change, amount/volume activity, top-3 leaders and a sector hard gate. New research must not duplicate them.
- Highest incremental value is temporal breadth, participation divergence, new-high/MA participation, leadership concentration, sector-rank rotation and cross-sector correlation state.
- Breadth divergence should first be interpreted as concentration/participation divergence, not automatic reversal.
- New-high/new-low and MA breadth have substantial redundancy risk with current momentum/K-line/Residual RS and require incremental tests.
- Industry momentum has strong historical evidence but can weaken when cross-industry correlation rises.
- Sector rotation is a transition in relative leadership/participation; it is not merely today's top-return sector.
- Trade amount is activity, not capital inflow; do not mislabel it.
- Taiwan official data support market-level breadth: TWSE OpenAPI TWTaZU and TPEx official after-trading stats. Stock-level TWSE/TPEx daily data can support common/eligible breadth with explicit universes.
- First prospective market+sector feature set and hypotheses are frozen; no outcome-tuned threshold.
- Formal Core remains LOCKED.

## Existing-source finding

`buildTodaySectorStats()` currently computes:
- one-day positive-stock breadth;
- avgChange;
- amount/volume vs 20D;
- estimated institutional net value;
- top 3 daily leaders;
- composite sector score.

Formal candidate filtering currently rejects a sector when:
- breadth < 40%, OR
- avgChange < -1%, OR
- amountVs20DayAverage < 0.5.

This is existing production logic, not a newly approved research conclusion. The new lane will test its context/redundancy but will not modify it.

## Exact next continuation

BR-011: Breadth thrust / sudden participation expansion — distinguish practitioner concept from robust evidence.
BR-012: Breadth deterioration before/after market peaks — duration and false-alarm problem.
BR-013: Cross-sector correlation / dispersion as a rotation-environment variable.
BR-014: Leadership diffusion lifecycle: leader-only -> widening -> broad -> narrowing.
BR-015: Sector-strength decomposition to test whether current one-day hard gate is redundant or potentially information-losing, research-only.
BR-016: Point-in-time universe / listings-delistings / industry reclassification data quality.
BR-017: Build redundancy map against current sector score, Residual RS, PV, K-line, Regime.
BR-018: Decide whether existing official data permit zero-code/prospective snapshot research before any new collector/schema proposal.
