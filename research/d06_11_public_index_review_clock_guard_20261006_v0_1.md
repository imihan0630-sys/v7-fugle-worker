# D06-11 public index-review clock guard — 2026-10-06

Status: RESEARCH_ONLY / PIT_CLOCK_GUARD / FORMAL_CORE_LOCKED
Owner: 05｜法人與籌碼研究室
Module: D06-11 ETF／指數被動資金與再平衡
Trade/use context: Taiwan equities

## Research question

Can an index-review event be represented by one announcement timestamp when studying passive-flow/rebalancing effects?

## Official evidence

Taiwan Index Plus Corporation publicly states that index review disclosure practices differ by index family. Its own 2017 explanation says:
- some reviews are announced to the market on the review date and become effective later;
- some review results are made public only on the effective date;
- some are provided to clients before effectiveness rather than broadly disclosed at the same time;
- in the Blue Chip 30 example, the schedule was published publicly one month before effectiveness, while a technical notice was supplied to fund companies after review for ETF portfolio adjustment and the component review result was published on the effective date.

Current 2026 technical-notice pages remain an official, replayable public archive and separately label review-result notices and review-schedule notices.

A current example is the 2026-10-02 technical notice for the Taiwan High Dividend Momentum Index. It states that the review result is dated 2026-10-02 and component changes/weight adjustments take effect after the 2026-10-02 close, effective from 2026-10-05. In that specific review, there were zero additions and zero deletions.

## PIT implication

One timestamp is insufficient. Freeze at least:
1. publicScheduleFirstKnownAt;
2. licensedClientNoticeFirstKnownAt — UNKNOWN unless independently observable/authorized;
3. publicReviewResultFirstKnownAt;
4. effectiveAfterCloseAt;
5. effectiveTradeDate.

No backtest may use licensedClientNoticeFirstKnownAt unless that timestamp and access entitlement are genuinely observed in the research environment.

When public results are released only at or after the effective close, the public review result cannot be used as a pre-effective public trading signal.

A previously published review schedule is calendar context only. It does not reveal final constituent additions, deletions or weights.

## Passive-flow identifiability guard

Index membership/weight change is not equal to realized ETF constituent execution. Even when a review result is known:
- fund assets and benchmarked mandates differ;
- replication can be full, sampled or otherwise constrained;
- creation/redemption mechanics and cash/in-kind substitution can alter execution paths;
- actual execution timing can differ across funds and authorized participants.

Therefore D06-11 may define an INDEX_REBALANCE_MECHANICAL_DEMAND_EXPOSURE candidate only after binding index-event clock + benchmark/fund exposure + constituent weight delta. It must not label that exposure as realized passive net buy/sell without execution evidence.

## Anti-leakage event clock

For public-strategy research:
eventFirstKnownAt = publicReviewResultFirstKnownAt.

For licensed-client research:
eventFirstKnownAt = licensedClientNoticeFirstKnownAt only when authorization and timestamp provenance are preserved.

effectiveTradeDate must never substitute for eventFirstKnownAt.

## Maturity decision

D06-11 remains L2 / 40%.

Reason:
- source and timing semantics are materially strengthened;
- current official archive is replayable for public notices;
- but no complete PIT-safe historical event panel has yet been assembled across index families;
- licensed-client timing is not generally observable;
- benchmarked AUM / constituent weight-delta / actual execution lineage remains incomplete;
- no OOS/Shadow incremental outcome evidence exists.

## Exact next

Build a small multi-index prospective event registry from official 2026 technical notices with separate schedule/public-result/effective clocks and index-family disclosure mode. Then test whether event exposure can be constructed without using unavailable licensed-client timestamps. Keep realized execution UNKNOWN unless independently evidenced.

## Sources

- https://taiwanindex.com.tw/news/58
- https://taiwanindex.com.tw/downloads/technical_notice
- https://backend.taiwanindex.com.tw/api/downloadFile/TechnicalNotices/1328/tw
