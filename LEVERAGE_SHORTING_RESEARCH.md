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


---

## LS-025 — Exact current V8.7.11 MI_MARGN schema audit

The source helper `researchMarginEvidenceFromPayload()` currently persists:

### Margin long
- `marginBuy`
- `marginSell`
- `marginPrevBalance`
- `marginTodayBalance`
- `marginBalanceChangePct = today / prev - 1`

### Margin short
- `marginShortCover`
- `marginShortSale`
- `marginShortPrevBalance`
- `marginShortTodayBalance`

### Semantic guard
- `shortSideScope = MARGIN_SHORT_ONLY_NOT_SBL`

### Missing from current normalized research evidence
Although official MI_MARGN reports expose more fields, the current helper does not persist:
- cash redemption / cash repayment;
- stock redemption;
- next-business-day margin quota;
- next-business-day short quota;
- margin/short offsetting quantity;
- note / restriction codes;
- preliminary-vs-final balance quality;
- revision amount.

### Critical issue
TWSE's official report states that the same-day “today balance” is auxiliary because credit institutions may continue adjustment work on the following day, and the later “previous-day balance” should be treated as the final correct balance.

Therefore current:
`marginBalanceChangePct`
must be interpreted as:
`PRELIMINARY_SAME_DAY_BALANCE_CHANGE_PCT`
unless a later finalized value confirms it.

No production field is renamed in this research turn; this is a research semantics correction.

Status: CURRENT V8 FIELD AUDIT COMPLETE / PRELIMINARY-BALANCE WARNING ADDED.

---

## LS-026 — Point-in-time daily history and vintage design

### Required two-vintage model for margin balances

For trade date T:

#### Vintage 1 — same-evening preliminary
Capture the official T report when first available:
- marginTodayBalancePreliminary
- shortTodayBalancePreliminary
- preliminaryCapturedAt

This represents what was knowable at that time.

#### Vintage 2 — next-trading-day finalization
On the next official trading day T+1, read:
- T+1 row's `marginPrevBalance`
- T+1 row's `shortPrevBalance`

These are the authoritative finalized balances for T according to TWSE's own report semantics.

Store:
- marginBalanceFinal
- shortBalanceFinal
- finalizedKnownAt
- marginRevision = final - preliminary
- shortRevision = final - preliminary

### Weekend/holiday rule
“T+1” means next official trading session, not next calendar day.

### Never overwrite
Keep both preliminary and final vintages.

Why:
- live research needs what was available at decision time;
- historical outcome research needs to know whether revisions are large enough to change classifications.

### Same-date scan eligibility
A feature used at a 23:35 scan may use only source records actually captured before that decision time.
If the official dataset was not observed before decision:
- same-day value = UNKNOWN for that decision.

Status: VINTAGE MODEL FROZEN.

---

## LS-027 — Official historical-source feasibility and burden

### TWSE
Official pages support date-addressable historical data for:
- MI_MARGN margin transactions;
- TWT93U borrowed-stock short-sale balances.

### TPEx
Official pages provide historical queries for:
- OTC margin balances;
- OTC margin-short / borrowed-stock short-sale balances.

This means rolling daily history is technically research-feasible without reconstructing it from price data.

### Backfill boundary
Historical official data can establish the eventual daily values.
It does **not** establish the exact first-known intraday timestamp unless contemporaneous capture exists.

Therefore historical backfill may support:
- finalized daily rolling levels/flows;
- historical descriptive studies.

It cannot support:
- same-night point-in-time availability claims
unless publication timing is separately proven.

### Illustrative storage burden
Whole-market daily normalized storage is not trivial:
- ~1,800 symbols × ~250 sessions ≈ 450,000 symbol-day rows/year.
- Storing both margin and SBL in one compact normalized row is preferable to separate duplicated rows.
- Retain raw source metadata once per market/date rather than copying long URLs/provider blobs into every symbol row.

### Architecture priority
1. Start with monitored/research cohort capture prospectively.
2. If whole-market normalization is later needed, use one daily market ingest then normalize once.
3. Do not issue per-symbol official-source requests.

Status: DAILY HISTORY FEASIBLE; POINT-IN-TIME BACKFILL LIMIT EXPLICIT.

---

## LS-028 — Minimal Shadow schema and completeness contract

### Raw daily symbol record

Identity:
- tradeDate
- symbol
- market: TWSE / TPEX
- sourceSchemaVersion

Margin long:
- marginBuy
- marginSell
- marginCashRedemption
- marginPrevBalanceReported
- marginTodayBalancePreliminary
- marginBalanceFinal
- marginNextQuota

Margin short:
- shortCover
- shortSale
- shortStockRedemption
- shortPrevBalanceReported
- shortTodayBalancePreliminary
- shortBalanceFinal
- shortNextQuota
- marginShortOffsetting

SBL actual short sale:
- sblShortPrevBalance
- sblShortSale
- sblShortReturn
- sblShortAdjust
- sblShortBalance
- sblShortNextLimit

Constraint:
- marginRestrictionCode
- shortRestrictionCode
- sblRestrictionCode
- noteRaw

Vintage/provenance:
- preliminaryCapturedAt
- finalizedKnownAt
- sourceDate
- sourceURL
- sourceMarket
- sourceObservedBeforeDecision
- qualityState
- unknownReasons

### Derived features stored separately
Do not overwrite raw data:
- marginBalanceChangePreliminary
- marginBalanceChangeFinal
- marginRevisionPct
- normalizedMarginLevel
- normalizedMarginFlow
- normalizedShortLevel
- normalizedSblShortFlow
- shortReturnRate
- ownHistoryPercentiles
- state taxonomy.

### Completeness states
- COMPLETE_FINAL
- COMPLETE_PRELIMINARY_ONLY
- PARTIAL_SOURCE
- DATE_MISMATCH
- MISSING_SYMBOL
- PROVIDER_UNAVAILABLE
- SCHEMA_CHANGED
- UNKNOWN

### Rolling-window rule
A 5/20/60-session feature is valid only if:
- exact official trading dates are known;
- all required sessions exist;
- no duplicate dates;
- no future date;
- denominator fields are valid;
- rules regime is compatible.

No forward fill.

Status: MINIMUM SHADOW SCHEMA V1 FROZEN.

---

## LS-029 — Research-only capture proposal boundary

A full leverage/shorting evidence lane is justified because:
- the sources exist;
- current V8 already captures partial one-day evidence;
- the missing pieces are primarily history, TPEx parity, restrictions and balance finalization.

### Proposed implementation order

Phase A — proposal / offline validation
- verify exact TWSE and TPEx source schemas over multiple dates;
- verify symbol coverage;
- verify revision behavior;
- verify historical pagination/date parameters;
- no Worker change.

Phase B — isolated research capture
- daily market-level ingest after official publication;
- append preliminary vintage;
- next trading day finalize prior-day balance;
- preserve source metadata;
- research tables only.

Phase C — only after complete history
- compute fixed pre-registered 5/20/60 rolling fields;
- run LS-023 protocol;
- no Formal action.

### Governance
- Documentation and offline source validation: research-safe.
- New D1 tables / workflows / provider pulls in production environment: proposal-first shared infrastructure; treat as Class B unless clearly isolated and approved.
- Any factor that alters stock eligibility/rank/BUY/ADD/REDUCE/SELL/stop/capital/push: Class C.

### Failure behavior
Research capture failure must:
- leave Formal operation untouched;
- record UNKNOWN / coverage gap;
- never substitute zeros;
- never reuse stale leverage/short data as current.

Status: CAPTURE PROPOSAL FROZEN; NO IMPLEMENTATION AUTHORIZED.

## Exact next continuation after LS-029

LS-030: source-schema validation across several recent TWSE dates and identify revision-sensitive fields.
LS-031: locate exact TPEx machine-readable endpoints and map fields one-to-one.
LS-032: establish same-day publication/capture timing constraints relative to 23:35 Formal scan.
LS-033: define finalized-history backfill protocol with rules-regime metadata.
LS-034: freeze first empirical hypotheses and matched controls before any outcome read.


---

## LS-030 — Official source-schema validation

### TWSE MI_MARGN verified fields
Official TWSE reports expose, per security:
- margin purchase: buy, sell, cash redemption, previous balance, current balance, next-business-day quota;
- margin short: covering/buy, short sale, stock redemption, previous balance, current balance, next-business-day quota;
- margin/short offset;
- note / restriction status.

This confirms LS-025's finding that current V8.7.11 normalized evidence persists only a subset.

### TWSE TWT93U verified fields
Official TWT93U exposes:
- margin-short previous balance / sale / covering / stock redemption / current balance / next limit;
- SBL-short previous balance / actual sale / return / adjustment / current balance / next limit;
- status note.

The report explicitly states:
`SBL short current balance = prior balance + current sell - current return + adjustment`.

### Revision sensitivity
TWSE explicitly warns MI_MARGN same-day current balance can be adjusted and later prior-balance should be treated as final.

No adjacent-day stock-level revision magnitude has yet been measured in this lane.
Therefore:
- revision RISK = VERIFIED;
- typical revision SIZE = UNKNOWN.

Status: SOURCE SCHEMA VERIFIED; REVISION MAGNITUDE NOT YET QUANTIFIED.

---

## LS-031 — TPEx parity mapping and machine-readable endpoint boundary

Official TPEx pages provide historical:
- margin transactions;
- margin usage / limits;
- margin-short + SBL-short balances;
- current restrictions and quota status.

Source pages:
- https://www.tpex.org.tw/en-us/mainboard/trading/margin-trading/transactions.html
- https://www.tpex.org.tw/en-us/mainboard/trading/margin-trading/sbl.html

TPEx SBL page states:
- data history exists since 2006;
- SBL short balance formula matches prior + sell - return + adjustment;
- current 30% of prior-30-day average-volume intraday SBL short limit applies from 2025-05-26, subject to exceptions/controls;
- page is updated approximately 20:30 and 22:30.

### Exact endpoint status
The public web pages expose HTML/CSV download capability, but this research turn has not verified a stable documented machine-readable JSON endpoint/schema suitable for production code.

Therefore:
- PUBLIC HISTORICAL DATA AVAILABILITY = VERIFIED;
- EXACT PROGRAMMATIC ENDPOINT CONTRACT = UNRESOLVED.

Do not invent an API path from historical website implementation.

Status: MARKET PARITY SOURCE EXISTS; ENDPOINT CONTRACT NEEDS OFFLINE VALIDATION.

---

## LS-032 — Same-day availability relative to the 23:35 Formal scan

### TWSE margin
MI_MARGN:
- published during the evening after credit institutions finish daily processing;
- exact completion time varies with volume, transmissions and adjustment work;
- same-day current balance remains preliminary.

Therefore:
- do not assume same-day MI_MARGN is available before 23:35;
- use actual first-success `capturedAt`.

### TWSE TWT93U
TWSE report notes approximate public updates:
- ~20:30
- ~22:30
with actual timing dependent on end-of-day operations.

TWSE Data E-Shop separately states the TWT93U product file is produced around 23:30.

Implication:
- 23:35 Formal scan is close enough that source readiness must be observed, not assumed;
- second public update may ordinarily exist before scan, but exact completeness must be verified.

### TPEx SBL
TPEx likewise states ~20:30 and ~22:30 updates.

### Decision-time rule
For any same-day leverage/short feature:
`sourceObservedBeforeDecision = capturedAt <= decisionAt`

If false or UNKNOWN:
- feature is UNKNOWN for that decision;
- later final data may be used only as outcome/research truth, not retroactive input.

Status: 23:35 AVAILABILITY MUST BE OBSERVATION-BASED.

---

## LS-033 — Finalized historical backfill protocol

### Purpose
Historical backfill can create finalized daily sequences for:
- rolling leverage/crowding;
- long-horizon descriptive research;
- regime studies.

It cannot recreate precise historical first-known timestamps unless archived contemporaneous observations exist.

### Backfill steps
For every official trading date:
1. verify date against official market calendar;
2. fetch TWSE / TPEx margin source for that exact date;
3. fetch TWSE / TPEx SBL-short source for that exact date;
4. validate market/date/schema;
5. normalize units;
6. retain restriction/note fields;
7. store source URL/schema version;
8. mark backfilled daily balance as `HISTORICAL_FINAL_ONLY`;
9. never set `sourceObservedBeforeDecision=true` from backfill alone.

### Rules-regime metadata
Attach effective rule state where relevant:
- short-sale price-rule regime;
- SBL quota regime;
- margin-ratio / short-margin regime;
- continuous-trading regime;
- source-formula regime changes.

### Unit guard
Some public reports use trading units while others expose shares.
Normalize only after field-level unit verification.
Never multiply by 1,000 by assumption.

Status: FINALIZED-HISTORY BACKFILL PROTOCOL FROZEN.

---

## LS-034 — First pre-registered hypotheses and matched controls

No threshold will be tuned from outcomes before the first test.

### H1 — Long-leverage crowding risk
Condition concept:
- high normalized margin level;
- positive margin flow;
- strong recent price run;
- weakening price acceptance.

Hypothesis:
- higher subsequent MAE / false-breakout / stop-first risk than matched controls.

Counter-hypothesis:
- rising leverage is simply participating in a genuine persistent trend and has no adverse incremental effect.

Primary target:
- risk/fragility, not automatic negative return.

---

### H2 — Deleveraging stress candidate
Condition:
- high prior normalized margin exposure;
- adverse price shock;
- sharp finalized margin-balance reduction / margin-sale flow;
- elevated volume or liquidity stress.

Hypothesis:
- higher next-session volatility / downside MAE.

Counter:
- rapid deleveraging may cleanse weak hands and precede stabilization.

---

### H3 — Actual SBL-short information
Condition:
- elevated actual borrowed-stock short-sale flow/balance after normalization.

Hypothesis:
- weaker D3/D5 returns or higher downside risk after controlling for prior trend, liquidity and sector.

Counter:
- hedge/arbitrage demand explains the shorting and removes directional relation.

Historical Taiwan evidence motivates this test but does not set effect size.

---

### H4 — Short-squeeze candidate
Condition:
- elevated prior normalized SBL-short balance;
- positive price shock / strong acceptance;
- SBL return/cover flow rises or short balance falls.

Hypothesis:
- higher near-term upside MFE and realized volatility.

Counter:
- short reduction is ordinary hedge unwinding and adds no incremental continuation.

---

### H5 — Two-sided crowding
Condition:
- elevated normalized margin-long exposure;
- elevated short-side exposure.

Hypothesis:
- higher realized volatility / larger MFE+MAE range due disagreement.

Counter:
- both balances merely scale with liquid/high-turnover stocks and disappear after liquidity controls.

### Matched controls
At minimum:
- same scan date;
- same market (TWSE/TPEx);
- liquidity tier;
- price tier;
- sector/regime;
- prior return / ATR;
- K-line maturity;
- Price-Volume acceptance;
- Residual RS;
- attention/disposition state;
- shorting-rule regime.

### Inference
- market date is the independent cluster;
- separate direction and risk outcomes;
- no convenience-only executed winners;
- missing leverage/short evidence = UNKNOWN;
- costs included if a result is translated into an execution counterfactual.

Status: FIRST HYPOTHESES PRE-REGISTERED BEFORE OUTCOME READ.

## Exact next continuation after LS-034

LS-035: quantify available historical source windows and rule-regime breakpoints.
LS-036: decide whether finalized-history research can begin offline without production schema changes.
LS-037: define normalization denominators using existing market cap / volume data and identify free-float limitations.
LS-038: build redundancy matrix against current institution / Price-Volume / derivatives evidence.
LS-039: freeze smallest useful Shadow feature set and kill rules.
LS-040: concept/data-design convergence.


---

## LS-035 — Historical source windows and major regime breakpoints

### Source windows
- TWSE daily margin transactions public history: available since 2001-01-01.
- TPEx margin transactions: public history since 2007-01, with older 2003-08 to 2006-12 history linked separately.
- TPEx SBL-short balance history: available since 2006-01.
- TWSE/TPEx SBL-short formula changed from 2012-03-19.

### Key regime breakpoints for interpretation
At minimum tag:

- 2012-03-19: SBL short-sale balance disclosure/formula regime change.
- 2013-09-23: TWSE borrowed-stock short-sale uptick-rule exemption for eligible margin-trading securities, subject to exceptions.
- 2014-01-06: certain securities/futures dealers' hedging SBL shorts exempt from daily maximum limit.
- 2020-03-23: TWSE continuous intraday trading begins.
- 2020-06-10: TWSE daily borrowed-stock short-sale limit uses 30% of prior-30-session average trading volume.
- 2020-10-26: intraday odd-lot trading begins, affecting retail/trading structure.
- 2025-05-26: TPEx borrowed-stock short-sale daily limit changes to 30% of prior-30-session average volume.

Additional margin-ratio / short-margin / disposition-rule changes must be attached if the historical window crosses them.

### Rule
Do not pool pre/post regime blindly.
A long backtest should either:
- segment by regime;
- include regime controls;
- or restrict the primary study to a modern comparable period.

Status: HISTORICAL REGIME MAP V1 FROZEN.

---

## LS-036 — Finalized-history research can begin offline without production changes

### Feasible now
Using public official historical pages, an offline research dataset can be built for:
- finalized TWSE margin daily history;
- finalized TWSE SBL-short daily history;
- TPEx margin history;
- TPEx SBL-short history.

This does not require changing Formal Worker behavior.

### What it can answer
- long-run finalized balance/flow relationships;
- rolling own-history normalization;
- regime comparisons;
- TWSE/TPEx parity;
- H1–H5 descriptive/outcome tests using eventual daily truth.

### What it cannot answer
- whether a same-day value was actually available before a historical 23:35 decision;
- first-seen preliminary balance vintage;
- exact publication latency.

Those require prospective capture.

### Decision
Offline finalized-history research is:
`TECHNICALLY_FEASIBLE / POINT_IN_TIME_LIMITED`.

No backfill is claimed complete in this turn.

Status: OFFLINE HISTORY ALLOWED FOR FINALIZED-DAILY QUESTIONS ONLY.

---

## LS-037 — Normalization hierarchy using available data

Avoid dependence on unavailable verified free float.

### Tier 1 — most practical with existing price/volume history
- marginBuy / dailyVolume
- marginSell / dailyVolume
- marginBalance / ADV20
- marginShortSale / dailyVolume
- marginShortBalance / ADV20
- sblShortSale / dailyVolume
- sblShortBalance / ADV20
- sblReturn / priorSblShortBalance
- own-history robust percentile for each level/flow

### Tier 2 — official quota utilization
When official quota is positive and semantics are valid:
- marginBalance / marginQuota
- marginShortBalance / shortQuota
- sblShortBalance / total-control denominator only if explicitly defined/verified.

### Tier 3 — capital/share normalization
- balance / issued shares;
- balance notional / market cap;
only after verified point-in-time shares/market-cap data are available.

### Free-float warning
Issued shares are not free float.
Do not label issued-share normalization “free-float short interest.”

### Preferred v0.1
Use ADV + own-history + quota-utilization views before adding capital-based normalization.

Status: NORMALIZATION HIERARCHY FROZEN.

---

## LS-038 — Cross-lane redundancy matrix

### Margin long vs Price-Volume
Price-Volume knows how much participation occurred and whether price accepted it.
Margin data add **financing identity / leverage stock**.
Incremental if leverage state changes interpretation of the same price-volume pattern.

### Short/SBL vs institutional cash flow
Foreign/investment-trust/dealer cash buying/selling is not the same as borrowed short-sale activity.
Do not net them into one “smart money” number.

### SBL vs derivatives positioning
Foreign futures/options can be hedge or directional.
SBL shorting is cash-equity borrowed selling.
They may interact but are not substitutes.

### Margin/SBL vs Microstructure
Microstructure is intraday execution/order-book state.
Leverage/shorting is end-of-day position/flow state.

### Margin leverage vs Portfolio Risk
This lane studies **other market participants' leverage**.
Portfolio Risk studies **our system's position risk**.
No duplication.

### Attention/disposition
These are constraints/controls that condition leverage/short data; they are not independent bullish/bearish bonuses.

Status: REDUNDANCY OWNERSHIP FROZEN.

---

## LS-039 — Smallest useful Shadow feature set and kill rules

### Shadow v0.1 candidate set
Keep it compact:

1. `lsMarginLevelAdv20`
2. `lsMarginFlowDailyVolume`
3. `lsMarginOwnHistoryPct`
4. `lsMarginShortLevelAdv20`
5. `lsSblShortFlowDailyVolume`
6. `lsSblShortLevelAdv20`
7. `lsSblReturnRate`
8. `lsQuotaConstraintState`
9. `lsBalanceQualityState`
10. `lsCrowdingState`

Do not add multiple indicators that are algebraic variants of the same balance.

### Kill rules
Remove or stop expanding a feature family if:
- no stable incremental information after existing controls;
- results are driven by one date/sector/market;
- effect exists only in obsolete rule regimes;
- preliminary-to-final revisions are comparable to or larger than the measured effect;
- TPEx parity fails and “Taiwan market” claims would actually mean TWSE only;
- performance disappears after liquidity/price-volume controls;
- feature complexity rises without incremental explanatory value.

### Governance
All v0.1 fields remain OBSERVER only.
No VETO/MODIFIER/Formal score.

Status: MINIMUM SHADOW SET FROZEN.

---

## LS-040 — Concept/data-design convergence

The major conceptual questions are now covered:

- leverage taxonomy;
- level vs flow;
- retail participation structure;
- long-leverage crowding;
- deleveraging risk;
- margin short vs actual SBL short;
- hedge confounding;
- short information;
- short covering / squeeze;
- two-sided disagreement;
- quota/restriction regimes;
- preliminary/final balance vintage;
- TWSE/TPEx source parity;
- historical regime breaks;
- normalization;
- redundancy controls;
- first empirical hypotheses.

### Lane state
**LEVERAGE_SHORTING = CONCEPT_COMPLETE / DATA_BUILD_PENDING.**

### Highest-value next action
Not more indicators.

The next real value is:
1. build/validate a finalized historical daily dataset offline;
2. preserve prospective preliminary/final vintages;
3. run the pre-registered H1–H5 tests;
4. test incremental value against Price-Volume, Residual RS, sector/regime and existing Formal state.

### No Formal change
No selection/rank/BUY/ADD/REDUCE/SELL/stop/capital/monitor/push change.

## Exact next continuation

- LS-041: prepare offline historical-data specification and exact field mappings for TWSE/TPEx.
- LS-042: validate a small multi-date sample before large backfill.
- LS-043: only after schema validation, collect independent-date evidence.
- In parallel, identify the next genuinely under-studied concept lane rather than invent more leverage indicators.


---

## LS-042 — Fixed small-sample schema validation result

Validation intentionally avoided any forward-return/outcome analysis.

### TWSE margin — PASS
Official TWSE samples from 2024-05-29 and 2026-08-14 show a stable displayed field contract:

Margin:
- buy
- sell
- cash redemption
- prior balance
- current balance
- next-business-day limit

Margin short:
- buy/cover
- sell
- stock redemption
- prior balance
- current balance
- next-business-day limit

Plus:
- margin/short offset
- restriction/note field.

The 2026-09-24 aggregate report independently confirms the current/preliminary balance warning and evening publication semantics.

### TWSE SBL short — PASS
Official TWT93U sample from 2026-08-14 matches the frozen normalized contract:

Margin short:
- prior balance
- short sale
- cover
- stock redemption
- current balance
- next limit

Actual borrowed-stock short sale:
- prior balance
- current sell
- current return
- current adjustment
- current balance
- next-business-day limit
- note.

Official TWT93U product metadata also confirms the machine-file field order and ~23:30 production time.

### TPEx margin — DISPLAYED SCHEMA PASS
Official TPEx indexed output shows:
- prior margin balance
- margin buy
- margin sell
- cash repayment
- margin balance
- financing-company component
- usage rate
- quota
- prior short balance
- short sale
- cover
- stock repayment
- short balance
- financing-company component
- usage rate
- quota
- margin/short offset
- note.

This validates the semantic mapping, including useful TPEx-only displayed fields such as usage rate.

### TPEx SBL — DISPLAYED SCHEMA PASS
Official TPEx output shows:
- margin-short prior balance / sell / buy / stock repayment / balance / limit
- SBL-short prior balance / current sell / current return / adjustment / balance / next limit
- note.

The current rule page also confirms the SBL balance formula and post-2025-05-26 30%-of-prior-30-session-average-volume limit.

### Remaining blocker
The exact stable machine-readable endpoint / parameter / response-schema contract for TPEx has not yet been independently verified in this lane.

Therefore LS-042 result is:

`SCHEMA_PARTIAL_PASS / PROGRAMMATIC_ENDPOINT_PENDING`

not FULL_PASS.

### Consequence
Large automated backfill is not yet authorized.
TWSE field mapping is ready for offline parser validation.
TPEx needs exact endpoint/CSV contract verification first.

Status: LS-042 COMPLETE WITH PARTIAL PASS.

## Exact next continuation after LS-042

LS-043: verify TPEx downloadable CSV / machine endpoint contract without guessing URLs.
LS-044: validate units and formula identities on a small exact-date sample.
LS-045: only after LS-043/044 pass, freeze large-backfill go/no-go.


---

## LS-043 — TPEx machine-contract verification result

### TPEx SBL — MACHINE CONTRACT VERIFIED
Official TPEx EDIS post-close format documentation specifies:

- file code: `S47`
- file name: `Margin_SBL.csv`
- format: CSV
- header/metadata includes:
  - data date
  - production time
  - record count
- per-symbol columns:
  - security code
  - margin-short prior balance
  - margin-short sale
  - margin-short buy/cover
  - stock repayment
  - margin-short current balance
  - margin-short quota
  - SBL-short prior balance
  - SBL-short current sell
  - SBL-short current return
  - SBL-short current adjustment
  - SBL-short current balance
  - next-business-day SBL short-sale limit
  - note.

This matches the normalized LS schema.

Status:
`TPEX_SBL_MACHINE_CONTRACT = VERIFIED`.

### TPEx margin — DOWNLOAD CONTRACT PARTIALLY VERIFIED
Official TPEx margin page explicitly provides:
- CSV BIG5 download;
- CSV UTF-8 download;
- historical data since 2007-01, with older linked history.

Displayed field semantics are validated.

However, this research turn could not retrieve the underlying stable CSV download URL / request parameter contract because direct page fetches were blocked by TPEx web protection.

Do not infer or hard-code an old website URL pattern.

Status:
`TPEX_MARGIN_DISPLAY_SCHEMA = VERIFIED`
`TPEX_MARGIN_CSV_AVAILABLE = VERIFIED`
`TPEX_MARGIN_PROGRAMMATIC_ENDPOINT = UNRESOLVED`.

### Updated LS-042/043 gate
- TWSE margin schema: PASS
- TWSE SBL schema: PASS
- TPEx SBL machine schema: PASS
- TPEx margin displayed schema: PASS
- TPEx margin programmatic endpoint: PENDING

Therefore:
`DATA_BUILD_GATE = PARTIAL_PASS`

Large automated cross-market backfill remains blocked only by the unresolved TPEx margin endpoint contract and final unit/sample validation.

Status: LS-043 COMPLETE / ONE ENGINEERING SOURCE CONTRACT REMAINS.

## Exact next continuation after LS-043

LS-044: validate units and algebraic identities using fixed exact-date rows, without looking at future returns.
LS-045: finalize large-backfill go/no-go.
LS-046: if endpoint remains blocked, define a safe alternative ingestion contract based on official downloadable CSV/manual artifact rather than inventing an API.


---

## LS-044 — Unit and algebra validation

Validation used fixed official rows only; no forward-return outcomes were inspected.

### A. TWSE margin-long identity — PASS
For an official 2026-08-14 row, the displayed fields satisfy the expected accounting relation:

`current margin balance = prior balance + margin buy - margin sell - cash redemption`

Example row:
- prior 31,723
- buy 2,226
- sell 2,986
- cash redemption 5
- result = 30,958

Displayed current balance = 30,958.

### B. TWSE margin-short identity — PASS
Same row:

`current short balance = prior balance + short sale - short cover - stock redemption`

- prior 1,158
- short sale 126
- cover 5
- stock redemption 0
- result = 1,279

Displayed current balance = 1,279.

### C. TWSE actual SBL-short identity — PASS
Official TWT93U row:

`current = prior + sold - returned + adjustment`

Example:
- prior 152,961,000
- sold 7,349,000
- returned 183,000
- adjustment 0
- result = 160,127,000

Displayed current balance = 160,127,000.

### D. TPEx margin identity — PASS
Official TPEx displayed row:

Margin long:
- prior 5,041
- buy 365
- sell 199
- cash repayment 0
- calculated current 5,207
- displayed current 5,207.

Margin short:
- prior 10
- sale 0
- cover 0
- stock repayment 0
- calculated current 10
- displayed current 10.

### E. TPEx actual SBL-short identity — PASS
Official 2026-09-24 displayed row:

- prior 240,000
- sold 0
- returned 100,000
- adjustment 0
- calculated current 140,000
- displayed current 140,000.

### Unit finding
The public sources do not use one universal numeric unit:

- TPEx margin table explicitly labels balances/offsets in **lots (張)**.
- TWSE aggregate MI_MARGN describes margin/short values in **trading units (交易單位)**.
- TWSE TWT93U product metadata defines SBL/margin-short file quantities as **shares (股數)**.
- TPEx SBL machine format is a numeric share-oriented post-close dataset, but each field still retains source-unit metadata in our research spec.

### Normalization rule
Never join or ratio raw margin and SBL numbers before unit normalization.

Store:
- rawValue
- rawUnit
- normalizedShares
- tradingUnitShares
- unitSource
- unitQuality.

For v0.1 common-stock research:
- conversion to shares is allowed only after the security's trading unit is independently verified for that date/instrument.
- excluded ETFs/warrants/etc. must not be used to infer the common-stock conversion rule.

Status:
- ACCOUNTING IDENTITIES = PASS
- UNIT SEMANTICS = RESOLVED AT SOURCE-TYPE LEVEL
- UNIVERSAL RAW-NUMBER COMPARABILITY = REJECTED.

---

## LS-045 — Large-backfill go/no-go

Current gate:

- TWSE margin displayed schema: PASS
- TWSE margin algebra: PASS
- TWSE margin preliminary/final semantics: PASS
- TWSE SBL schema/formula: PASS
- TPEx margin displayed schema/algebra: PASS
- TPEx SBL displayed schema/formula: PASS
- TPEx SBL machine CSV contract: PASS
- source-unit differences: IDENTIFIED / GUARDED
- TPEx margin stable programmatic CSV endpoint: PENDING

### Decision
`AUTOMATED_CROSS_MARKET_LARGE_BACKFILL = NO_GO_YET`

This is not because TPEx data are absent.
It is because the exact stable programmatic contract for one source remains unresolved.

### Safe work that may continue
- offline parser/test design;
- fixed official sample artifacts;
- TWSE source validation;
- TPEx SBL S47 parser design;
- unit conversion guards;
- prospective schema/provenance design.

Status: NO_GO FOR LARGE AUTOMATED BACKFILL; RESEARCH CONTINUES.

---

## LS-046 — Safe fallback ingestion when an API contract is not verified

If a stable TPEx margin programmatic endpoint remains unavailable, the acceptable fallback is **official downloadable artifact ingestion**, not URL guessing.

### Accepted source classes
1. official TPEx UTF-8 CSV downloaded from the margin page;
2. official documented EDIS/data-product file if available/licensed;
3. user/provisioned official raw file with source date and checksum.

### Required artifact metadata
- sourceAuthority = TPEx
- sourcePage
- requestedDate
- downloadedAt
- fileName
- encoding
- sha256/checksum
- schemaVersion
- parserVersion
- rowCount

### Parser rule
Parser maps by validated header names when the official file has headers.
If the file is positional:
- require exact official format version;
- fail closed on column-count/schema mismatch.

### Safety
Do not scrape around access controls or invent hidden endpoints.
A blocked direct-fetch path is a source-access limitation, not permission to bypass it.

### Research implication
The LS lane can still be built correctly even if some official data enter as daily artifacts rather than an undocumented JSON API.

Status: OFFICIAL-ARTIFACT FALLBACK CONTRACT FROZEN.

## LS lane state after LS-046

**CONCEPT_COMPLETE / DATA_SPEC_COMPLETE / SOURCE_CONTRACT_PARTIAL**

Remaining concrete blocker:
- TPEx margin stable programmatic endpoint, or a chosen official-artifact ingestion workflow.

No Formal change and no production deployment.

## Exact next continuation

LS-047: only after an official TPEx margin artifact/endpoint is available, validate parser on multiple dates.
LS-048: then run finalized-history backfill pilot with no outcome research.
LS-049: audit completeness/revisions.
LS-050: only then execute pre-registered H1-H5 evidence tests.
