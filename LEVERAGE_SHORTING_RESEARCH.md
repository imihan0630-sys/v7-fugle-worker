# Leverage & Shorting Research

Status: RESEARCH_ONLY / CONCEPT_BUILD / Formal Core LOCKED
Updated: 2026-09-25 Asia/Taipei

## Scope

This lane studies Taiwan cash-equity leverage / short-position evidence:

- margin purchases (融資);
- margin short sales (融券);
- securities borrowing and lending (借券);
- actual sales of borrowed securities (借券賣出);
- deleveraging / margin-call pressure;
- short covering / squeeze candidates;
- crowding and disagreement.

It is distinct from:
- institutional flow: foreign / investment trust / dealer cash trading;
- derivatives positioning: futures/options;
- microstructure: intraday order-book pressure;
- trading frictions: execution cost;
- portfolio risk: concentration / heat.

No field in this lane changes Formal selection, BUY, ADD, REDUCE, SELL, stop, capital, monitoring or push without explicit owner approval.

---

## LS-001 — Margin purchase, margin short, securities borrowing and actual borrowed-stock short sale are different objects

Do not merge them into one “bull/bear” number.

### Margin purchase
Customer buys stock using margin financing.
It measures leveraged long credit exposure, not necessarily new bullish information.

### Margin short sale
Customer sells securities short within the margin-trading framework.

### Securities borrowing
A security is borrowed. Borrowing alone does not prove it has been sold short.

### Actual borrowed-stock short sale
Borrowed shares are actually sold into the market. This is closer to short-sale flow than raw borrowing balance.

Current V8.7.11 already follows this semantic rule for TWSE:
- borrowed-stock short-sale evidence uses TWT93U;
- one-day SBL evidence is labeled ACTUAL_SBL_SHORT_SALE;
- raw one-day evidence is not called a 5/20/60-day shorting-flow factor.

Status: TAXONOMY FROZEN.

---

## LS-002 — Balance is a stock; buy/sell/return is a flow

For margin financing / short sales:

- previous balance = position stock before today's flows;
- buy / sell / cash or stock redemption = daily flows;
- current balance = resulting stock, subject to data-finalization semantics.

For borrowed-stock short sales:

TWSE/TPEx define roughly:
`current short-sale balance = previous balance + sold - returned + adjustment`.

Implication:
- a high balance can persist with little new flow;
- a large one-day flow can occur from a low base;
- flow and level must be studied separately.

Status: LEVEL / FLOW DISTINCTION FROZEN.

---

## LS-003 — Absolute margin balance is structurally misleading across market-size regimes

TWSE's 2026 market-structure analysis shows:
- TWSE margin-loan balance reached a nominal record in 2026;
- relative to total listed market capitalization, the ratio remained around only ~0.4%;
- margin-trading share of total trading value was about 6% in recent years, far below historical 2000-era levels.

Source:
- TWSE Market Insights, “Margin Trading in Taiwan’s Stock Market: A Perspective from Changes in Market Structure”
- https://www.twse.com.tw/market_insights/en/detail/8a8216d6a0bdcc0001a0d2d9db47007c

### Research rule
Never compare raw NT$ margin balance across long eras without normalization.

Preferred context:
- margin balance / market cap;
- margin turnover share;
- own-history percentile;
- sector-relative leverage;
- stock-level margin balance / shares or liquidity measures.

Status: ABSOLUTE-BALANCE COMPARISON REJECTED.

---

## LS-004 — Margin-trading participant structure matters

TWSE's 2026 analysis reports:
- overall market participation has become more institutionalized;
- domestic individual share of listed-market trading value was around 52% in Jan–Jul 2026;
- more than 98% of margin trading remained individual-investor activity.

Source:
- same TWSE Market Insights article above.

### Implication
Margin financing may be more useful as:
- retail leverage / sentiment / crowding context
than as a generic “institutional conviction” signal.

### Counterpoint
“Retail-dominated” does not mean “wrong.”
Retail leverage can participate in genuine momentum and price discovery.

Status: PARTICIPANT-STRUCTURE MODERATOR FROZEN.

---

## LS-005 — Rising margin financing has constructive and adverse interpretations

### Constructive
Price rises + margin financing rises + volume/acceptance remains healthy:
- leveraged demand may reinforce trend participation.

### Adverse
Price rises + margin financing rises rapidly + price response weakens:
- crowding / late leverage / fragile ownership may be building.

### Other
Price falls while margin financing rises:
- averaging-down / disagreement;
- latent liquidation risk if decline continues;
- but also possible value-oriented leveraged accumulation.

### Rule
No monotonic score:
`marginBalanceUp = bullish`
is prohibited.

Status: BIDIRECTIONAL INTERPRETATION FROZEN.

---

## LS-006 — Forced deleveraging is a risk mechanism, but public balance data do not identify forced liquidation directly

Margin accounts can face maintenance requirements and collateral calls; failure to meet requirements can lead to disposal of collateral.

TWSE 2026 Market Insights reports market-wide margin-call and liquidation activity and emphasizes leverage risk.

Source:
- https://www.twse.com.tw/market_insights/en/detail/8a8216d6a05b1e6901a05c758ffd000e

### Candidate distress sequence
Research-only:
1. elevated normalized margin financing;
2. sharp price decline / gap;
3. margin financing balance falls or margin sales rise;
4. abnormal volume / liquidity stress;
5. continued downside or stabilization.

### Guard
A fall in margin balance is not proof of forced liquidation.
It may reflect voluntary selling, cash repayment, transfers or other adjustments.

Use neutral naming:
- DELEVERAGING_PRESSURE_CANDIDATE
not:
- FORCED_LIQUIDATION
unless directly evidenced.

Status: FORCED-LIQUIDATION INFERENCE RESTRICTED.

---

## LS-007 — Margin short and SBL short sale have different participant / purpose mixtures

Margin short selling is tied to credit-trading accounts.

SBL / borrowed-stock short sales may be used by:
- directional shorts;
- hedgers;
- market makers / derivative issuers;
- arbitrageurs;
- inventory / settlement strategies.

TWSE rules explicitly allow certain derivative / structured-product businesses to use short selling for hedging.

Source:
- TWSE margin rules Article 38:
  https://twse-regulation.twse.com.tw/ENG/EN/law/DOC01.aspx?FLCODE=FL007121&FLNO=38

### Consequence
A rise in borrowed-stock short sales is not automatically a bearish fundamental opinion.

Status: HEDGE-CONFOUNDING GUARD FROZEN.

---

## LS-008 — Securities borrowed is not the same as securities sold short

A security can be borrowed without immediate short sale.

Therefore distinguish:
- borrow balance;
- borrowed-stock short-sale flow;
- borrowed-stock short-sale balance;
- returned securities.

Current V8.7.11 correctly prefers TWT93U actual borrowed-stock short-sale evidence instead of treating generic borrowing as short-sale truth.

Status: BORROW ≠ SHORT-SALE RULE FROZEN.

---

## LS-009 — Historical Taiwan evidence supports short-interest information, but the regime is old

Hu, Huang & Liao (2009) use TWSE data from 1991–2004 and report that heavily shorted stocks subsequently had negative risk-adjusted abnormal returns; the effect weakened with longer holding horizons.

Source:
- Quarterly Review of Economics and Finance 49(3), 1146–1158.
- DOI: 10.1016/j.qref.2008.07.002
- https://www.sciencedirect.com/science/article/abs/pii/S1062976908000811

### Value
This supports testing short-side information content in Taiwan.

### Limitation
The sample predates major changes in:
- market structure;
- short-sale constraints;
- investor composition;
- SBL development;
- continuous trading;
- ETFs / derivatives / day trading.

Do not transplant its thresholds or effect sizes to 2026.

Status: MECHANISM EVIDENCE, NOT CURRENT RULE.

---

## LS-010 — Margin and shorting effects can differ by investor type

Ting, Lu & Chou (2018) study TWSE 2006–2015 and find different relations for individual margin-long, individual shorting and institutional shorting activities.

Source:
- “Margin trading, differences of opinion, and stock returns”
- National Central University record:
  https://scholars.ncu.edu.tw/en/publications/margin-trading-differences-of-opinion-and-stock-returns/

### Implication
Aggregate public margin/SBL data can mix:
- sentiment;
- information;
- price correction;
- hedging.

If participant identity is unavailable, keep the interpretation mixed rather than pretending the aggregate has one sign.

Status: PARTICIPANT-IDENTITY LIMIT FROZEN.

---

## LS-011 — Short-sale constraints change price discovery and must be regime metadata

Taiwan has changed short-sale rules multiple times.

Recent research using historical Taiwan short-sale-constraint changes finds different adjustment efficiency under varying constraint intensity.

Source:
- Mathematics 2025, 13(5), 816.
- DOI: 10.3390/math13050816

### System implication
Historical long samples need regime flags for:
- uptick / price-rule changes;
- margin eligibility;
- SBL quota changes;
- short-sale suspensions;
- attention/disposition rules;
- continuous-trading regime.

Status: RULES-REGIME SEGMENTATION REQUIRED.

---

## LS-012 — Eligibility and regulatory notes are information about tradability, not just metadata

TWSE/TPEx margin reports expose notes such as:
- stop margin purchase;
- stop margin short;
- quota allocation;
- trading suspension;
- high short-to-margin relationships / other regulatory restrictions.

TWSE margin rules also allow stricter margin/short-sale requirements during certain attention/disposition conditions.

Source:
- TWSE margin rules Article 33:
  https://twse-regulation.twse.com.tw/ENG/EN/law/DOC01.aspx?FLCODE=FL007121&FLNO=33

### Research role
These states may alter:
- who can enter leveraged positions;
- squeeze / unwind dynamics;
- liquidity and price discovery.

Do not interpret a sudden drop in short activity without checking whether shorting became restricted.

Status: REGULATORY-CONSTRAINT GUARD FROZEN.

---

## LS-013 — Margin balance needs multiple denominators

No single denominator is universally sufficient.

Candidate stock-level normalizations:
- margin balance / issued shares;
- margin balance / free-float proxy if verified;
- margin balance / 20D average volume;
- margin notional / 20D average traded amount;
- margin balance own-history percentile;
- sector-relative percentile.

### Caveat
Issued shares are not free float.
ADV can itself collapse during stress.
Use several descriptive views before selecting one.

Status: MULTI-DENOMINATOR NORMALIZATION FROZEN.

---

## LS-014 — SBL short pressure also needs flow and capacity normalization

Candidate metrics:
- short-sale flow / daily volume;
- short-sale balance / issued shares;
- short-sale balance / ADV;
- short-sale flow own-history percentile;
- return flow / prior short-sale balance;
- distance to regulatory short-sale limit / quota when valid.

TWSE currently limits daily borrowed-stock short selling relative to prior 30-day average volume and has total-volume controls; TPEx has similar controls.

Sources:
- TWSE SBL FAQ:
  https://www.twse.com.tw/en/products/sbl/qa.html
- TPEx borrowed-short balance page:
  https://www.tpex.org.tw/zh-tw/mainboard/trading/margin-trading/sbl_hist10110.html

Status: SHORT PRESSURE MUST BE CAPACITY-AWARE.

---

## LS-015 — Short covering is not equivalent to a bullish squeeze

A rise in:
- short covering;
- securities returned;
- short balance decline
can occur because:
- shorts take profit;
- risk limits force exit;
- hedge is removed;
- corporate action / position adjustment;
- squeeze pressure.

### Squeeze candidate requires joint evidence
Research-only candidate:
1. high prior normalized short-sale balance;
2. price rises sharply;
3. abnormal volume / strong price acceptance;
4. short-sale balance declines or return/cover flow rises;
5. liquidity / price-limit state supports constrained short exit.

Even then call:
`SHORT_SQUEEZE_CANDIDATE`
not proven squeeze.

Status: SQUEEZE INFERENCE REQUIRES MULTI-LAYER EVIDENCE.

---

## LS-016 — Short-pressure build with falling price may be information or crowding

Possible state:
- actual borrowed-stock short sale rises;
- price falls;
- negative response persists.

Constructive interpretation for short sellers:
- information may be incorporated.

Counter interpretation for a long system:
- short crowd becomes large enough for later covering asymmetry;
- some shorts may be hedge-driven rather than informed.

### Research outcome families
Test separately:
- D1/D3/D5 returns;
- downside MAE / stop-first;
- later short-cover / squeeze behavior.

Status: DIRECTION AND SQUEEZE-RISK OUTCOMES SEPARATED.

---

## LS-017 — Margin-long crowding and short crowding can coexist

High margin financing + high short interest can represent:
- strong disagreement;
- speculative two-sided activity;
- overvaluation / disagreement under short-sale constraints;
- impending volatility.

Historical Taiwan evidence has specifically studied interactions between short sales, margin trading and dispersion of opinion.

Source:
- Hu, Huang & Liao (2009), DOI above.

### System implication
Joint state may be better treated as:
`DISAGREEMENT / CROWDING INTENSITY`
than as a directional score.

Candidate outcome:
- realized volatility;
- MFE/MAE;
- false-breakout frequency;
- gap / stop risk.

Status: TWO-SIDED CROWDING = RISK/INTENSITY CANDIDATE.

---

## LS-018 — Official TWSE margin “today balance” has a timing/finality warning

TWSE's current margin report explicitly states:
- current-day margin balances are published after credit institutions finish daily processing;
- institutions can continue adjustment work on the next day;
- the later “previous-day balance” should be treated as the final authoritative figure;
- current-day balance is auxiliary.

Source:
- https://www.twse.com.tw/exchangeReport/MI_MARGN?date=&response=html

### Research consequence
For point-in-time studies:
- preserve the first-seen current-day balance if studying what was knowable that night;
- preserve the next-day finalized previous balance as revised/final truth;
- never silently overwrite the vintage.

Fields:
- preliminaryBalance
- preliminaryCapturedAt
- finalizedBalance
- finalizedKnownAt
- revisionAmount

Status: VINTAGE / FINALITY SEMANTICS REQUIRED.

---

## LS-019 — Current V8.7.11 source audit

Existing research external evidence currently captures:

### TWSE margin
- point-in-time scan-date margin snapshot via MI_MARGN;
- only for TWSE names identified through current source mapping.

### TWSE actual SBL short sale
From TWT93U:
- previous short-sale balance;
- short-sale flow;
- return flow;
- adjustment;
- short-sale balance;
- next-day limit.

Guard already present:
- source date must be strictly earlier than scanDate for point-in-time use;
- one-day raw evidence is labeled `RAW_DAILY_ONLY_NO_CONTIGUOUS_HISTORY`.

### Current gaps
- TPEx margin not captured in V8.7.11;
- TPEx SBL short sale not captured;
- no contiguous 5/20/60-day sequence in current research snapshot layer;
- no margin-balance vintage finalization/revision history;
- no robust market-cap/ADV normalization stored with this evidence.

Status: EXISTING V8 = USEFUL SINGLE-DAY EVIDENCE, NOT A COMPLETE SHORTING FACTOR.

---

## LS-020 — TPEx source feasibility is high

TPEx publicly provides:
- OTC margin purchase / short-sale balances;
- usage rates and limits;
- borrowed-stock short-sale balance history;
- short-sale / SBL restriction markers.

Sources:
- Margin balance:
  https://www.tpex.org.tw/zh-tw/mainboard/trading/margin-trading/transactions.html
- Borrowed-stock short-sale balance:
  https://www.tpex.org.tw/zh-tw/mainboard/trading/margin-trading/sbl_hist10110.html

### Implication
The current `UNKNOWN_TPEX_MARGIN_NOT_CAPTURED_V8_7_11` and `UNKNOWN_TPEX_SBL_NOT_CAPTURED_V8_7_11` are engineering coverage gaps, not proof the data do not exist.

Status: TPEx DATA SOURCE EXISTS; CURRENT CAPTURE GAP IDENTIFIED.

---

## LS-021 — Candidate state model

Research-only, non-directional state taxonomy:

1. LEVERAGE_NORMAL
2. LONG_LEVERAGE_BUILDING
3. LONG_LEVERAGE_CROWDED
4. ORDERLY_DELEVERAGING
5. DELEVERAGING_STRESS_CANDIDATE
6. SHORT_PRESSURE_BUILDING
7. SHORT_PRESSURE_ELEVATED
8. SHORT_COVERING
9. SHORT_SQUEEZE_CANDIDATE
10. TWO_SIDED_CROWDING
11. CONSTRAINT_DISTORTED
12. UNKNOWN

No state directly maps to BUY/SELL.

Status: STATE TAXONOMY FROZEN FOR SHADOW DESIGN.

---

## LS-022 — Cross-lane ownership to prevent double counting

### This lane owns
- margin-financing level/flow;
- margin-short level/flow;
- actual SBL short-sale level/flow;
- short-cover / return flow;
- leverage/crowding state;
- credit/shorting constraint state.

### Other lanes own
- Price-Volume: price/volume acceptance;
- Microstructure: intraday spread/depth/pressure;
- Institutional Flow: cash institutional buying/selling;
- Derivatives: futures/options positioning;
- Portfolio Risk: position-level risk aggregation.

### Integration rule
Use interactions such as:
`CrowdingState x PriceAcceptanceState`
rather than award duplicate additive points for the same price/volume movement.

Status: CROSS-LANE OWNERSHIP FROZEN.

---

## LS-023 — First empirical protocol

### Population
Every point-in-time selected / Shadow-control symbol with complete source coverage.

### Features
Keep v0.1 compact:
- marginBalanceNorm;
- marginFlowNorm;
- marginOwnHistoryPct;
- marginShortBalanceNorm;
- actualSblShortBalanceNorm;
- actualSblShortFlowNorm;
- sblReturnFlowNorm;
- marginVsShortCrowdingState;
- constraintState;
- provenance/finality quality.

### Outcomes
Separate:
- D1/D3/D5/D10 return;
- MFE/MAE;
- stop-first / false-breakout;
- future realized volatility;
- short-cover/squeeze-candidate transition.

### Controls
- market/sector;
- price trend / K-line maturity;
- price-volume acceptance;
- liquidity;
- attention/disposition;
- year/rules regime;
- TWSE vs TPEx;
- price tier.

### Falsification
Reject if:
- effect disappears after price/volume controls;
- only old historical regime works;
- result is driven by one market/date/sector;
- raw absolute balance works but normalized balance does not;
- current-day preliminary balance revisions materially flip results;
- only TWSE works because TPEx data are missing.

Status: EMPIRICAL PROTOCOL V1 FROZEN.

---

## LS-024 — Concept convergence / evidence readiness

### Strongest research hypotheses
1. Margin financing is more useful as leverage/crowding context than monotonic bullish strength.
2. Actual SBL short-sale flow may carry information, but hedge/confounding and regime changes require controls.
3. Joint high long-leverage + short pressure may identify disagreement/volatility better than direction.
4. Deleveraging and squeeze states require price/volume acceptance and cannot be inferred from balance changes alone.
5. Point-in-time finality of margin balances is a first-class data-quality issue.

### Evidence-ready with current data
- single-day descriptive TWSE margin state;
- single-day point-in-time-eligible TWSE actual SBL short evidence.

### Evidence-blocked
- rolling 5/20/60-day states;
- TPEx parity;
- finalized-vs-preliminary margin vintage;
- robust squeeze/deleveraging transition studies.

### Lane state
**LEVERAGE_SHORTING concept learning = CONCEPT_COMPLETE / EVIDENCE_PENDING.**

No new production factor, score, veto or trading rule is approved.
Formal Core remains LOCKED.

## Exact next continuation

LS-025: audit exact MI_MARGN fields currently persisted by V8.7.11.
LS-026: design point-in-time daily history capture for TWSE + TPEx margin/SBL with vintage semantics.
LS-027: estimate storage/API burden and whether official historical endpoints permit research backfill without look-ahead.
LS-028: freeze minimal Shadow schema and data-completeness contract.
LS-029: only then consider a proposal; no implementation until governance classification.
