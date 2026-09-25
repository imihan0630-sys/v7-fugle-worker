# Leverage & Shorting Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: LS-001 through LS-024 complete.
Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.
Next: LS-025 source/schema audit.

## Durable conclusions

- Margin purchase, margin short, securities borrowing and actual borrowed-stock short sale are distinct objects.
- Balance (stock) and daily flow are separate.
- Absolute margin balances are structurally misleading across eras; normalize by market/stock scale and own history.
- 2026 TWSE evidence shows margin trading remains heavily retail-dominated while its share of total market activity is much lower than 2000-era levels.
- Rising margin financing has both constructive and adverse/crowding interpretations.
- Falling margin balance does not prove forced liquidation.
- SBL/borrowed short sales are hedge-confounded; borrowing itself is not proof of short sale.
- Historical Taiwan evidence supports testing short-interest information, but old regime effect sizes/thresholds cannot be transplanted to 2026.
- Participant identity matters; aggregate public data mix information, sentiment, correction and hedging.
- Short-sale constraints / eligibility / disposition states require regime controls.
- Short covering is not automatically a squeeze; squeeze candidates require joint prior short crowding + price/volume + covering/return evidence.
- High margin-long and high short-side positioning can represent disagreement/volatility rather than direction.
- TWSE warns current-day margin balance is auxiliary and may be revised; next-day “previous balance” is final. Vintage/finality must be stored explicitly.
- V8.7.11 currently has useful single-day TWSE margin and actual SBL short evidence but lacks contiguous history and TPEx parity.
- TPEx official margin and borrowed-short history sources exist; current UNKNOWN is a capture gap, not a data-unavailability claim.
- No state maps directly to BUY/SELL.
- Formal Core remains LOCKED.

## Exact next continuation
LS-025 audit exact V8.7.11 persisted MI_MARGN fields.
LS-026 design TWSE+TPEx point-in-time history/vintage capture.
LS-027 storage/API/backfill feasibility.
LS-028 minimal Shadow schema/completeness contract.
LS-029 governance proposal only if justified.
