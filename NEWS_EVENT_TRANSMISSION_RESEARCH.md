# News / Event Transmission Research

Updated: 2026-09-28 Asia/Taipei
Scope: 08｜事件與新聞研究室
Domains: D17 News / event half-life / beneficiary-victim transmission
Status: RESEARCH_ONLY / FORMAL_CORE_UNCHANGED

## D17-08 — News Sentiment

### Core distinction
News **tone**, event **fundamental direction**, investor **attention**, and realized **price direction** are different variables.

A positive-sounding article is not automatically bullish for the stock. A negative article is not automatically bearish. Tone can instead show up through volatility, attention, disagreement, or delayed assimilation.

### Evidence
- Loughran & McDonald (2011) show that generic language dictionaries can misclassify finance-specific wording; finance-domain semantics matter.
- Ke, Kelly & Xiu (2019) show that return-predictive text scores can be learned specifically for return prediction, which is evidence that generic sentiment and return-relevant text are not the same object.
- Boudoukh et al. (2013) show that correctly identifying relevant news by type and tone materially strengthens the observed relation between news and price changes.
- Hsu, Lu & Yang (2021), using Taiwan-market news, find contemporaneous and lagged news sentiment related to market volatility, with stronger negative-sentiment effects in stressed periods. This supports volatility/attention semantics but does not establish a universal directional return rule.
- Recent Taiwan/Chinese financial-news work confirms Chinese-language financial sentiment requires language/domain-aware modeling rather than direct reuse of English general-purpose sentiment.

### Positive mechanism
Sentiment may add information when:
1. the article is truly firm/event relevant;
2. the tone is measured with finance- and language-aware semantics;
3. the article is novel rather than a stale reprint;
4. source/first-known time is point-in-time valid;
5. expectation/surprise and priced-in state are handled separately;
6. the sentiment feature adds information beyond event category, market/sector move and attention.

### Counterevidence / failure modes
- Generic positive/negative dictionaries can fail on financial terms and context.
- Negative tone may primarily predict volatility/attention rather than negative return.
- The same tone can have different implications by event category and prior expectation.
- Training a sentiment model directly on future returns can create a target-specific predictor but also raises severe leakage/overfit risks if the training/holdout protocol is not strictly point-in-time and out-of-sample.
- Taiwan/Chinese language, headline style and financial terminology create transfer risk from English models.
- Article count can double-count syndication/reprints and masquerade as stronger sentiment.

### Frozen research representation
Minimum article-level fields:
- articleId / sourceId
- sourceClass / reliability
- publishedAt / firstKnownAt / capturedAt
- symbol/entity attribution with confidence
- eventClusterId
- eventCategory
- sentimentPolarity
- sentimentIntensity
- sentimentModel / modelVersion / language
- noveltyState
- expectationState
- pricedInState
- correction/revision linkage
- provenance / UNKNOWN reason

Do not collapse these into one bullish/bearish score.

### PIT / validation
- No article can influence a decision before firstKnownAt.
- Model/version must be frozen before OOS evaluation.
- Sentiment thresholds may not be tuned on the same event outcomes used for evaluation.
- Same event cluster must be the unit for duplicate control; article count is not an independent sample count.
- Market/sector/event-category matched controls are required.

### Current maturity
D17-08 = L2 / mechanism + counterevidence defined.
Taiwan PIT capture and prospective/OOS evidence are still missing, so L3+ is not justified.

---

## D17-09 — Duplicate News / Same-Event Clustering

### Core distinction
Article identity != event identity.

Multiple URLs/headlines can describe the same underlying event. Conversely, an updated article can contain genuinely new information even if most wording is repeated.

### Evidence
Tetlock (2011) finds market responses are smaller for stale/reprinted information, but stale news can still be associated with price response. Therefore duplicates must not be treated as automatically zero-impact.

News-prediction research increasingly separates novelty from raw article volume; article novelty is a distinct feature from sentiment.

### Event-cluster contract
Create:
- eventClusterId: underlying economic event
- articleId: individual publication/version
- canonicalFirstKnownAt: earliest verified public occurrence
- articlePublishedAt
- contentFingerprint
- semanticFingerprint
- incrementalFactHash
- noveltyScore/state
- revisionType: DUPLICATE / SYNDICATION / UPDATE / CORRECTION / NEW_EVENT / UNKNOWN

### Dedup rules
1. Exact/near-exact republication with no new factual content -> same event cluster; do not count as a new independent event.
2. Same headline/topic but new price, quantity, customer, timing, guidance, regulatory decision or other decision-relevant fact -> same cluster but UPDATE, not duplicate.
3. Correction changes a fact -> preserve both versions; later version must not rewrite what was knowable earlier.
4. Different media outlets copying one wire story -> multiple articles, one underlying information arrival unless an independently earlier source is proven.
5. Similar wording about a separate event/date -> do not merge merely because text similarity is high.
6. UNKNOWN stays UNKNOWN when identity/entity/time cannot be resolved.

### Novelty
Novelty is not simply 1 - text similarity.
Useful novelty needs:
- time proximity;
- entity overlap;
- event-category compatibility;
- incremental factual content;
- source lineage;
- correction/update semantics.

### Counterevidence / failure modes
- Pure hash dedup misses paraphrases.
- Pure embedding similarity can wrongly merge distinct events.
- Headline-only dedup misses changed numbers in the body.
- Article count overstates information intensity under syndication.
- Aggressive dedup can erase an important factual update.
- Retroactive clustering using future articles can leak information into earlier decisions.

### PIT / validation
Clusters are built incrementally using only content known at each timestamp. Future articles may append or revise cluster metadata, but historical replay must use the cluster state that existed at replayAsOf.

### Current maturity
D17-09 = L2 / mechanism + counterevidence defined.
A Taiwan point-in-time news archive with versioned article capture is required for L3.

---

## Cross-module rule frozen
Sentiment, novelty, source reliability, expectation surprise, priced-in state, direct/indirect exposure, and event outcome must remain separate dimensions.

No Formal Core, System 1 selection, System 2 live strategy, ranking, threshold, capital, monitor, push or execution behavior is changed by this research.


---

# Long-block D17 convergence — source reliability, half-life, beneficiary/victim, priced-in and propagation

Updated: 2026-09-28 Asia/Taipei
Research mode: deep / long-block / positive + falsification
Formal Core: unchanged

This block advances the seven remaining L1 D17 modules to mechanism-plus-falsification maturity. It does not claim Taiwan PIT readiness or trading alpha.

## D17-01 — News source reliability is a vector, not a single ranking

A simple source tier such as "official > media > social" is too crude for trading research.

A usable reliability contract must separate at least:
- authority / provenance;
- independence of evidence lineage;
- fact verifiability;
- timeliness / firstKnownAt;
- revision and correction integrity;
- entity/event specificity.

The key falsification is that **truth reliability and market-impact potential are different variables**. Empirical fake-news research shows false or low-quality information can still attract attention, volume and short-run price response. Therefore an unverified source cannot be assigned economic truth, but neither can its market-impact potential be forced to zero.

Media also has a causal dissemination role. Engelberg & Parsons (2011) and Peress (2014) show media access/timing changes trading and information incorporation. Consequently:
- an exchange/MOPS/issuer filing can be the highest-verifiability source;
- an independent wire/media report can be the earliest attention transmitter;
- a social/rumor source can have low truth confidence yet nonzero short-run event-risk relevance.

Frozen outputs should keep separate:
`truthConfidence`, `marketImpactPotential`, `firstKnownAt`, `sourceLineage`, `revisionState`.

**Counterexample:** two reputable websites repeating one press release are not two independent confirmations.

Status: D17-01 -> L2.

## D17-03 — News Half-life is event-conditional and multi-clock

There is no defensible universal "news expires after N days" rule.

Three clocks must be separated:
1. **FACT_RELEVANCE_EXPIRY** — when the economic fact itself stops affecting future cash flow/risk.
2. **ATTENTION_DIFFUSION_DECAY** — how fast investors stop acquiring/redistributing the story.
3. **PRICE_RESPONSE_PERSISTENCE** — how long abnormal continuation/reversal remains detectable after controls.

Evidence is deliberately contradictory in horizon:
- Chan (2003) finds drift after public bad news, especially in smaller/illiquid names.
- Tetlock (2011) shows stale/reprinted news can create short-lived overreaction and next-week reversal.
- Hirshleifer, Lim & Teoh (2009) show attention competition can delay earnings incorporation.
- Pan, Sul & Wang (2026) find one delayed macro-information effect around earnings announcers dissipates by about day seven in that setting.

These are not conflicting failures; they falsify one fixed decay constant.

Frozen research horizons:
`15m -> close -> D1 -> D3 -> D5 -> D10 -> D20`.
Candidate states:
`FAST_ABSORPTION`, `DELAYED_CONTINUATION`, `REVERSAL_AFTER_ATTENTION`, `MULTI_STAGE_UPDATE`, `STRUCTURAL_PERSISTENCE`, `UNKNOWN`.

A future half-life may be estimated within a pre-registered event class, but never imported from one event family into another.

Status: D17-03 -> L2.

## D17-04 — Direct beneficiary / victim requires a causal exposure chain

A company is not a direct beneficiary merely because its name appears next to a favorable theme.

Required chain:
`EVENT -> ECONOMIC_PRIMITIVE -> FIRM_EXPOSURE -> FINANCIAL_TRANSMISSION -> EFFECTIVE_TIMING`.

Examples of economic primitives:
- quantity / demand;
- selling price;
- input cost;
- capacity availability;
- contract/customer allocation;
- regulation;
- financing cost;
- asset value / impairment;
- competitive share.

A direct mapping must store the exposure basis and timing. For example, a customer award is not yet earnings unless shipment capacity, margin, timing and cancellation/qualification conditions are known.

Counterexamples:
- input inflation may benefit an upstream scarce producer but hurt a downstream processor;
- a large order can be low margin or capacity-constrained;
- a competitor failure can help via share shift but hurt through category demand/contagion;
- technically capable suppliers may have no verified revenue exposure.

Thus event direction is never automatically a stock-trading sign.

Status: D17-04 -> L2.

## D17-05 — Second-order / supply-chain transmission needs hop-by-hop evidence

Cohen & Frazzini (2008) and Menzly & Ozbas (2010) support gradual information diffusion across economically linked firms. This gives a legitimate mechanism for second-order transmission.

But the opposite failure mode is equally important: peer/leader spillovers can be excessive and later reverse. Duan et al. (2025) documents leader-to-peer spillover in China that is subsequently corrected at peers' own earnings.

Therefore:
- each graph edge needs a named/effective-dated economic relationship;
- each hop needs its own transformation mechanism;
- confidence normally weakens with unsupported hops;
- sign may continue, attenuate, invert or become UNKNOWN;
- thematic similarity is not an economic edge.

D10 supply-chain edges remain the economic graph authority. D17 adds event-specific information arrival and propagation state; it must not recreate a second supply-chain graph.

Status: D17-05 -> L2.

## D17-07 — "Priced-in" is latent; price direction alone cannot prove it

The market's pre-event incorporation state cannot be observed directly.

A valid pre-event evidence vector may include:
- consensus / expected event state;
- prior official guidance;
- scheduled-event certainty;
- pre-event abnormal price path;
- volume / attention;
- earlier peer announcements;
- analyst revisions only if point-in-time;
- novelty / stale-news state.

Prohibited shortcut:
`price already rose -> good news is fully priced in`.

Why? Attention itself can move prices without equivalent new fundamentals. Chapman (2018) shows earnings-date notifications can produce returns/attention despite little performance information, and can alter later announcement response. Pre-event price movement can therefore reflect anticipation, attention, leakage, positioning, risk premium or unrelated common factors.

Also prohibited:
- using post-event return to retrospectively label the event as "not priced in";
- labeling a heavily repeated story as fully priced in solely from article count.

Frozen states:
`LOW_EXPECTATION_EVIDENCE`, `PARTIAL_EXPECTATION_EVIDENCE`, `HIGH_EXPECTATION_EVIDENCE`, `CONFLICTED`, `UNKNOWN`.

Status: D17-07 -> L2.

## D17-10 — Cross-validation counts evidence lineages, not URLs

Cross-validation must be field-level and lineage-aware.

Validate separately:
- entity identity;
- event occurrence;
- magnitude;
- publication/first-known time;
- effective time;
- scope;
- economic mechanism.

Lineage examples:
- issuer release -> five media copies = one primary lineage plus distribution, not six confirmations;
- regulator filing + independently sourced customer filing = stronger independent confirmation;
- later correction is a new version, not permission to rewrite earlier knownAt.

If sources conflict, retain:
`CONFLICT`, both values, timestamps, source lineage and eventual resolution.
Do not majority-vote article counts.

This is especially important because the current System 2 source matrix already flags general news as SOURCE_NEEDED and warns about entity resolution, publication/update timestamps and licensing.

Status: D17-10 -> L2.

## D17-11 — Sector propagation must separate contagion from competition

Industry/peer information transfer is well documented, but sign is not universal.

Supporting evidence:
- Foster (1981) finds earnings information can transfer to economically similar peers.
- Bergsma & Tayal (2020) find same-direction peer spillovers across several developed markets, stronger with large announcers and higher volatility.
- recent work continues to find peer-announcement information transfer.

Critical counterevidence:
- Laux, Starks & Yoon show competitive effects can offset same-industry contagion.
- Duan et al. (2025) shows leader spillover can overreact and later reverse.

Therefore a sector-propagation event must classify mechanism before assigning an expected relation:
- `COMMON_DEMAND_CONTAGION`;
- `COMMON_COST_CONTAGION`;
- `SUPPLY_CHAIN_TRANSMISSION`;
- `COMPETITIVE_SHARE_SHIFT`;
- `SUBSTITUTION`;
- `REGULATORY_COMMON_SHOCK`;
- `ATTENTION_ONLY`;
- `UNKNOWN`.

Peer sets must be frozen before outcomes using industry/economic exposure evidence. Market/sector residual controls are required. A leader's return cannot become the peer's fundamental score.

D09 remains owner of persistent sector RS/breadth. D10 remains owner of supply-chain structure. D17 owns only **event-specific propagation** to avoid double counting.

Status: D17-11 -> L2.

## Integrated falsification conclusions

The long block rejects seven tempting shortcuts:
1. source reputation alone = truth;
2. low-quality source = zero market impact;
3. all news uses one expiry/half-life;
4. favorable event narrative = beneficiary;
5. one-hop positive transmission = all downstream positive;
6. prior price rise = fully priced in;
7. many URLs = many confirmations;
8. sector leader move = peer fundamental direction.

The correct architecture is a **state vector**, not a single news score.

## System 1 / System 2 fit

### System 1
Current official ANNOUNCEMENTS normalization is date/title level. It is useful for coarse event context but cannot safely support:
- intraday firstKnown;
- source-lineage independence;
- version/correction replay;
- novelty;
- event-specific half-life;
- direct/indirect exposure maps.

No Formal System 1 factor should be added from this block.

### System 2
System 2 L5 already requires timestamp, mechanism, beneficiary/victim map, confidence and half-life/expiry. The new D17 contract supplies exact semantics for those fields.

However, the System 2 source matrix still marks **General news = SOURCE_NEEDED**. Therefore this is a strong research-data contract fit, not a production factor.

### Promotion decision
`FORMAL_OPTIMIZATION_CANDIDATE = NO`.

Reason:
- no canonical Taiwan general-news source contract;
- no complete point-in-time article/version archive;
- no prospective/OOS event cohort;
- no cost/redundancy evidence showing incremental return or risk value after D09/D10/D11 controls.

## External evidence anchors
- Chan (2003), Journal of Financial Economics, `10.1016/S0304-405X(03)00146-6`.
- Tetlock (2011), Review of Financial Studies, `10.1093/rfs/hhq141`.
- Boudoukh, Feldman, Kogan & Richardson (2013), NBER Working Paper 18725.
- Engelberg & Parsons (2011), Journal of Finance, `10.1111/j.1540-6261.2010.01626.x`.
- Peress (2014), Journal of Finance, `10.1111/jofi.12179`.
- Hirshleifer, Lim & Teoh (2009), Journal of Finance, `10.1111/j.1540-6261.2009.01501.x`.
- Cohen & Frazzini (2008), Journal of Finance, `10.1111/j.1540-6261.2008.01379.x`.
- Menzly & Ozbas (2010), Journal of Finance, `10.1111/j.1540-6261.2010.01578.x`.
- Foster (1981), Journal of Accounting and Economics, `10.1016/0165-4101(81)90003-3`.
- Bergsma & Tayal (2020), International Review of Financial Analysis, `10.1016/j.irfa.2020.101511`.
- Duan et al. (2025), Accounting & Finance, `10.1111/acfi.70003`.
- Clarke et al. (2020/2021), Information Systems Research, `10.1287/isre.2019.0910`.
- Arcuri, Gandolfi & Russo (2023), Journal of Economics and Business, `10.1016/j.jeconbus.2023.106130`.
- Chapman (2018), Journal of Accounting and Economics, `10.1016/j.jacceco.2018.05.002`.

## Exact next continuation
1. D17-01/03/04/05/07/10/11 now stop at L2 until Taiwan PIT evidence exists.
2. Highest-value next research is source-readiness, not another conceptual score:
   - inventory candidate Taiwan general-news / official-news feeds;
   - test publication/update timestamp, immutable version capture, licensing, entity resolution, corrections and archive completeness;
   - preserve article/event lineage.
3. In parallel, design a **research-only prospective event ledger schema** that can feed D17-02/08/09 and these new contracts without changing Formal behavior.
4. Only after source-readiness passes, preregister an outcome-blind event cohort and negative controls for D17-03/04/05/07/11.


---

# D17 long-block convergence — source reliability, half-life, exposure, priced-in and propagation

Updated: 2026-09-28 Asia/Taipei
Mode: deep research + falsification
Formal Core: unchanged

## D17-01 — Source reliability is a vector, not one ranking

A simple "official > media > social" ladder is too crude. Separate authority/provenance, lineage independence, fact verifiability, first-known timeliness, correction/version integrity and entity/event specificity.

Critical falsification: **truth confidence and market-impact potential are different variables**. Low-quality or false information can still attract attention and move prices temporarily, so unverified information cannot be treated as economic truth but its event-risk impact also cannot be forced to zero.

Media research also shows dissemination timing changes trading and information incorporation. Therefore a primary filing may be highest-verifiability while an independent report can be the earliest attention transmitter.

Two reputable outlets copying the same release are one evidence lineage, not two confirmations.

Status: D17-01 -> L2.

## D17-03 — Half-life is event-specific and multi-clock

Reject one universal "news expires after N days" rule. Separate:
1. FACT_RELEVANCE_EXPIRY;
2. ATTENTION_DIFFUSION_DECAY;
3. PRICE_RESPONSE_PERSISTENCE.

Evidence spans different horizons: public-news moves can drift; stale/reprinted stories can create short-lived overreaction and reversal; heavy competing information load can delay incorporation; some delayed effects dissipate within about a week in specific settings. These differences are evidence against a fixed decay constant.

Research horizons are frozen as 15m, close, D1, D3, D5, D10 and D20. Candidate states are FAST_ABSORPTION, DELAYED_CONTINUATION, REVERSAL_AFTER_ATTENTION, MULTI_STAGE_UPDATE, STRUCTURAL_PERSISTENCE and UNKNOWN.

Status: D17-03 -> L2.

## D17-04 — Direct beneficiary/victim requires a causal chain

Required chain:
EVENT -> ECONOMIC_PRIMITIVE -> FIRM_EXPOSURE -> FINANCIAL_TRANSMISSION -> EFFECTIVE_TIMING.

Economic primitives include demand/quantity, selling price, input cost, capacity, contract/customer allocation, regulation, financing cost, asset value and competitive share.

A favorable headline is not enough. A large order may be low-margin or capacity-constrained; input inflation can help an upstream producer while hurting a downstream processor; a competitor problem can create both contagion and share-shift effects.

Event direction is never automatically a trading sign.

Status: D17-04 -> L2.

## D17-05 — Second-order transmission needs hop-by-hop evidence

Economic-link research supports gradual information diffusion across customer/supplier relationships, but peer spillovers can also overreact and later reverse.

Each propagation edge therefore needs a named, effective-dated economic relation. Each hop needs its own mechanism. Sign may persist, attenuate, invert or become UNKNOWN. Thematic similarity is not an economic edge.

D10 remains authority for persistent supply-chain structure; D17 adds event-specific information-arrival/propagation state and must not duplicate the graph.

Status: D17-05 -> L2.

## D17-07 — Priced-in is latent, not directly observable

Pre-event incorporation state cannot be inferred from price direction alone.

Use an ex-ante evidence vector: consensus/expected state, prior official guidance, schedule certainty, pre-event abnormal price path, volume/attention, earlier peer announcements, point-in-time analyst revisions and novelty/staleness.

Prohibited shortcuts:
- price already rose => good news fully priced in;
- post-event return => retrospective proof of pre-event priced-in state;
- high article count => information fully known.

Attention can move prices even without equivalent new fundamentals, so pre-event moves can reflect anticipation, attention, leakage, positioning or unrelated common factors.

Frozen states: LOW_EXPECTATION_EVIDENCE, PARTIAL_EXPECTATION_EVIDENCE, HIGH_EXPECTATION_EVIDENCE, CONFLICTED, UNKNOWN.

Status: D17-07 -> L2.

## D17-10 — Cross-validation is field-level and lineage-aware

Validate separately: entity identity, event occurrence, magnitude, event time, effective time, scope and economic mechanism.

Issuer release -> five media copies is one primary lineage plus distribution, not six confirmations. Independent regulatory/customer evidence is stronger. Corrections preserve old and new versions with their own knownAt timestamps.

Conflicts remain CONFLICT until resolved; never majority-vote URL counts.

Status: D17-10 -> L2.

## D17-11 — Sector propagation must separate contagion from competition

Peer information transfer exists, but its sign is not universal. Same-industry news can transmit common demand/cost information, yet competitive effects can offset or reverse contagion. Leader-to-peer spillover can also be excessive and later reverse.

Frozen mechanisms:
COMMON_DEMAND_CONTAGION, COMMON_COST_CONTAGION, SUPPLY_CHAIN_TRANSMISSION, COMPETITIVE_SHARE_SHIFT, SUBSTITUTION, REGULATORY_COMMON_SHOCK, ATTENTION_ONLY, UNKNOWN.

Peer sets must be frozen before outcomes using economic/industry evidence. Market/sector residual controls are required. Leader return cannot become peer fundamental direction by default.

D09 owns persistent sector RS/breadth; D10 owns supply-chain structure; D17 owns event-specific propagation only.

Status: D17-11 -> L2.

## Integrated falsification

Rejected shortcuts:
- source reputation = truth;
- low-quality source = zero market impact;
- one fixed half-life for all news;
- favorable narrative = beneficiary;
- one positive link means all downstream names benefit;
- prior price rise = fully priced in;
- many URLs = many confirmations;
- sector leader move = peer fundamental direction.

The correct representation is a state vector, not one news score.

## System fit

System 1: current ANNOUNCEMENTS normalization is date/title level and is too coarse for intraday firstKnown, lineage, revision, novelty, half-life and exposure scoring. No Formal factor is proposed.

System 2: L5 News/Event/Catalyst already requires timestamp, mechanism, beneficiary/victim map, confidence and half-life/expiry. This research gives those fields stronger semantics, but the data-source matrix still marks general news SOURCE_NEEDED.

FORMAL_OPTIMIZATION_CANDIDATE = NO. Missing gates: canonical Taiwan general-news source, versioned PIT archive, prospective/OOS cohort, and redundancy/cost evidence after D09/D10/D11 controls.

Durable machine-readable contract: `research/news_event_transmission_contract_v0_2.json`.

## Evidence anchors

Chan (2003) JFE; Tetlock (2011) RFS; Boudoukh et al. (2013) NBER; Engelberg & Parsons (2011) JF; Peress (2014) JF; Hirshleifer, Lim & Teoh (2009) JF; Cohen & Frazzini (2008) JF; Menzly & Ozbas (2010) JF; Foster (1981) JAE; Bergsma & Tayal (2020) IRFA; Laux, Starks & Yoon (1998); Duan et al. (2025) Accounting & Finance; Clarke et al. (2020) ISR; Arcuri et al. (2023) Journal of Economics and Business; Chapman (2018) JAE.

## Exact next continuation

Move from concept to source readiness:
1. inventory Taiwan general-news and official-news candidate feeds;
2. test publication/update timestamp, immutable version capture, licensing, entity resolution, corrections and archive completeness;
3. define a research-only prospective event ledger that can feed D17 without changing Formal behavior;
4. only after source readiness, preregister PIT event cohorts and negative controls for half-life, exposure, priced-in and propagation.


---

## D17 source-readiness audit — primary event truth vs general-news discovery

The next stage moved from concept to Taiwan source feasibility.

### 1. MOPS / TWSE / TPEx official disclosure lane

Official TWSE materials show MOPS immediate material information with company code/name, **publication time**, and subject, and MOPS supports current/day/history material-information queries.

This materially improves the semantic case for a primary event lane: official company disclosures can carry an intraday publication clock at the presentation layer.

However, the current repository ANNOUNCEMENTS normalization still reduces accepted rows to announcement date + title. Therefore the current stored object does not preserve the richer intraday first-known/version semantics needed by D17.

Conclusion:
`CURRENT_PRIMARY_EVENT_SOURCE_PROVEN / STORED_PIT_SEMANTICS_INCOMPLETE`.

MOPS is also not a complete general-news source. It covers statutory/company-entered disclosure, not every customer, industry, foreign, media or external catalyst.

### 2. CNA RSS general-news discovery lane

Central News Agency publicly exposes finance and technology RSS feeds. Its RSS documentation says the service distributes headline, lead, article link and lead-image link and is intended to deliver timely updates.

This proves a machine-readable Taiwan general-news **discovery** lane is feasible.

Critical licensing counterevidence: the published RSS terms restrict use to personal/non-profit/non-commercial purposes, require attribution and reserve CNA's right to require cessation. Therefore public RSS access must not be treated as unrestricted production/commercial licensing.

Conclusion:
`RESEARCH_DISCOVERY_FEASIBLE / NOT_ASSUMED_PRODUCTION_LICENSED`.

Also still unproven:
- immutable item-version history;
- complete historical archive;
- correction/supersession chain;
- stable canonical entity IDs;
- full item-level timestamp semantics through our present capture path.

### 3. Government agency RSS

Taiwan government agencies expose category-specific RSS/news feeds. These can be high-quality primary evidence for policy/industry events but do not replace company disclosure or general-news coverage.

### 4. Source architecture result

The evidence supports a multi-lane architecture rather than one "news source":
- canonical truth lane for facts governed by an official source;
- discovery/dissemination lane for general media;
- attention lane for stories that may move prices even when truth confidence is low;
- licensed production general-news provider remains SOURCE_NEEDED.

No lane may silently substitute for another when coverage, license, firstKnown or version semantics differ.

Durable source receipt:
`research/news_source_readiness_receipt_v0_1.json`.

Status:
`PRIMARY_EVENT_LANE_PARTIAL / GENERAL_NEWS_DISCOVERY_FEASIBLE / PRODUCTION_LICENSE_GAP / PIT_ARCHIVE_GAP`.

D17 L3 is **not** reached by this audit.

---

## D17 prospective versioned event ledger — design frozen

A research-only append-only event ledger is now specified in:
`research/d17_prospective_event_ledger_schema_v0_1.json`.

The ledger separates:
1. raw/source capture receipt;
2. article/disclosure version;
3. event-cluster state at a point in time;
4. company/event exposure edge.

Key PIT rule:
a historical replay may see only versions whose firstKnownAt/capturedAt are available by replayAsOf under the selected conservative clock. Later corrections append new versions; they never rewrite earlier decision-time truth.

Coverage is explicit. "No event" is admissible only when the relevant source lane's polling/completeness receipt is proven. Otherwise absence remains UNKNOWN.

Outcome joins remain CLOSED until:
- source/version PIT passes;
- coverage is sufficient;
- entity/event mapping is frozen outcome-blind;
- event class/horizons are preregistered;
- market/sector/peer controls and corporate-action firewall are fixed.

Engineering boundary:
documentation/schema is research-only. No production collector, shared runtime dependency, Formal factor, score, ranking, entry/exit or notification behavior is changed.

## Exact next continuation

The conceptual and source-design stage is now complete enough to stop expanding taxonomies.

Next work should be empirical source proof:
- verify an allowed/licensed general-news provider or explicitly keep that lane blocked;
- perform a bounded prospective capture pilot on official material disclosures plus any legally usable discovery feed;
- measure firstKnown/capturedAt latency, correction/version incidence, duplicate-cluster behavior and coverage gaps without looking at returns;
- only after the source receipt passes, preregister outcome studies for half-life, priced-in state, direct/indirect exposure and sector propagation.

---

## D17 bounded official-disclosure capture pilot — source clocks are not availability clocks

The exact-next source-only pilot was executed against the official TWSE and TPEx daily material-disclosure datasets. No price, return, ranking, factor or outcome field was read.

Durable artifacts:
- `research/d17_official_disclosure_capture_pilot_v0_1.json`;
- `research/d17_disclosure_snapshot_observer_v0_1.mjs`;
- `tests/test_d17_disclosure_snapshot_observer_v0_1.mjs`.

### Positive source evidence

- Both endpoints returned HTTP 200 and four rows in the bounded observation.
- Both schemas preserved nine disclosure fields, including source publication date/time, company code/name, subject, clause, fact date and full explanation.
- Government catalog metadata declares daily updates and Open Government Data License v1 for both datasets.
- Two polls approximately 55 seconds apart had identical raw SHA-256 payloads for each source. This proves bounded replay stability for the observed interval only.
- Raw payload hashes, capture clocks and deterministic derived identities are sufficient to replay exactly what the pilot observed.

### Counterevidence and falsification

1. **Publication time is not API availability time.** The rows contain `發言日期` and `發言時間`, but this pilot did not observe the moment each row first became available from the API. `capturedAt` therefore remains the conservative first-known upper bound.
2. **Daily frequency is not an intraday SLA.** Catalog metadata says daily, so the feed cannot yet support an authenticated claim that every announcement was available before an intraday or after-market decision timestamp.
3. **No native version identity.** Neither observed schema exposes a provider item ID, version ID, correction flag or supersession link. A derived fingerprint supports replay and change detection, but it cannot prove the publisher's correction chain.
4. **Recurring/stale disclosure risk is real.** Seven of eight observed rows had the same 07:00:04 source time while several fact dates were months earlier and the notice text described multi-month announcement periods. These rows cannot be counted as seven new economic events merely because they appear in the daily dataset.
5. **Short stability is not completeness.** Identical payloads over 55 seconds do not prove no later update, full historical archive, polling completeness or immutable source history.
6. **Official disclosures are not general news.** This lane improves canonical event truth but cannot replace media discovery, external customer/industry catalysts or attention evidence. A licensed production general-news lane remains `SOURCE_NEEDED`.

### Frozen PIT and replay contract

- Preserve `sourcePublishedAt`, `capturedAt`, raw payload hash and parser version separately.
- Use `capturedAt` for replay eligibility until source availability time is independently authenticated.
- Append changed captures; never rewrite an earlier observed version.
- A missing row or a row disappearing from a later daily snapshot is `UNKNOWN_WINDOW_EVICTION_OR_SOURCE_REMOVAL_OR_CORRECTION` until rolling-window semantics and correction linkage are proven.
- `NO_KNOWN_EVENT` requires expected/observed poll accounting over the relevant source window; one daily snapshot can never establish negative evidence completeness.

### Bias, cost and system-value decision

- Selection bias: all rows returned by both sources were counted; no symbol, tone, event class or outcome filter was applied.
- Look-ahead: source publication time cannot backdate decision-time availability; later captures remain invisible to earlier replay.
- Data snooping/overfit: no outcome, horizon, threshold, model or text-score search occurred.
- Redundancy: official disclosures own primary fact evidence; D17 general news, D09 sector state and D10 supply-chain structure remain separate authorities.
- Cost: the bounded payloads were small, but two polls are insufficient for a rate-limit, storage or production-cost conclusion.
- System 1 value is provenance/UNKNOWN discipline only. System 2 gains a candidate canonical event-truth lane, not a live factor.

Status:
`BOUNDED_CAPTURE_EXECUTED / SOURCE_CLOCK_PRESENT / CAPTURE_CLOCK_AUTHORITATIVE / REVISION_CHAIN_UNPROVEN / GENERAL_NEWS_SOURCE_NEEDED / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED`.

Maturity remains unchanged. D11-08 and D17-01/02/09 stay at L2 because intraday availability, multi-day coverage and publisher-native revision history are not yet validated.

## Exact next continuation

1. Run an independent fixed-cadence capture over at least three trading sessions plus one after-hours interval, with immutable raw hashes and expected/observed poll receipts.
2. Measure source-publication-to-capture delay distributions without interpreting that delay as proven API publication latency.
3. Classify cross-day recurring notices, additions, removals and changed content. Treat removals as UNKNOWN until the source window contract is proven.
4. Search for a native MOPS disclosure identifier/correction link; if none exists, keep derived revision chains explicitly unverified.
5. Keep the licensed general-news production lane `SOURCE_NEEDED`; keep all return/outcome joins closed until source/version and coverage gates pass.


---

## D11-08 / D17-02 / D17-09 source-version semantics — 2026-09-29

TWSE primary materials confirm material-information presentation has separate sequence, publication date/time, subject, clause and fact-date fields. This supports preserving source sequence and source publication clock as distinct provenance fields.

Counterevidence: the presentation evidence does not establish that sequence is a globally unique immutable version identifier and does not establish a native supersession pointer. Therefore sequence alone must not be used as a permanent provider version key, and same-company/same-day/title similarity must not be treated as proof that one disclosure replaces another.

Frozen fields: sourceSequence, sourcePublishedAt, capturedAt, correctionSignal, correctionReferenceText, nativeSupersessionId (UNKNOWN when absent), derivedSupersessionCandidate, derivedSupersessionConfidence, rawPayloadHash and parserVersion. Derived lineage is research metadata, not publisher truth.

PIT rule: eventOccurredAt, regulatoryDueAt, sourcePublishedAt and capturedAt remain separate clocks. A deadline or displayed publication time does not prove strategy observability at that instant. Until independently authenticated, capturedAt remains the conservative replay clock. Later corrections append and never rewrite earlier replay state.

Negative evidence: official-source status does not prove a particular endpoint/window is complete for a decision interval. NO_KNOWN_EVENT still requires source-lane coverage receipts; otherwise absence is UNKNOWN.

No prices, returns, rankings or post-event outcomes were used; no text/dedup threshold was optimized. Keep D11-08, D11-13, D17-02 and D17-09 at L2. FORMAL_OPTIMIZATION_CANDIDATE = NO.

Exact next: fixed-cadence immutable snapshots across at least three independent trading sessions plus after-hours; expected/observed poll accounting; classify additions/removals/content changes; report sourcePublishedAt-to-capturedAt only as observed capture delay; continue searching for native correction linkage; keep outcome joins closed.


## D17-06 cross-module falsification — expectation is not realization (2026-10-01)

D11 treasury-stock and convertible-bond mechanics provide a concrete expectation/surprise contract. Buyback authorization/plan quantity is ex-ante intention, not realized purchase; actual execution disclosures are later realization. CB issue/conversion terms are an opportunity set, not actual conversion; outstanding-balance/share-delivery changes are later realization.

A valid surprise feature must compare the pre-event expected state with information newly knowable at the realization timestamp. Final execution or conversion data cannot be backdated into the earlier expectation state.

This deepens D17-06 but does not promote it beyond L2. Prospective/OOS outcome evidence is still required.


---

## D17-13 — Scheduled versus unscheduled Taiwan event clocks (2026-10-02)

The Taiwan source contract now distinguishes five states: SCHEDULED_EXACT, SCHEDULED_WINDOW, DEADLINE_ONLY, UNSCHEDULED and UNKNOWN.

Monthly-revenue due-by-10th and statutory financial-report deadlines are not exact publication timestamps. Investor conferences can become SCHEDULED_EXACT only when their time is actually public before the decision cutoff. Unscheduled disclosures enter replay only at conservative first-known/capture time.

Counterevidence is explicit: scheduled events may be postponed/cancelled; multiple events may cluster; a legal deadline can be filed early; no scheduled event does not imply no event; retrospective calendars may contain information unavailable ex ante.

D17-13 advances L2 -> L3 for Taiwan PIT source/data feasibility only. Outcome joins remain closed and no directional effect is claimed.

Reusable anchor: `EVENT_TRANSACTION_AND_DISCLOSURE_CLOCK_RESEARCH.md`.
Machine contract: `research/d11_d17_event_clock_contract_v0_1.json`.

## Room 08 special-situations / policy-event long-block — 2026-10-03

### D17-14 — Policy / Regulatory Event Clock / Surprise

D17-14 advances L0 -> L2 after freezing the mechanism and falsification contract.

Policy/regulatory information is modeled as a versioned state machine rather than one announcement:
`RUMOR -> DRAFT_OR_CONSULTATION -> PREANNOUNCEMENT -> SCHEDULED_DECISION -> FINAL_DECISION_PUBLISHED -> IMPLEMENTATION_RULE -> EFFECTIVE -> REVISED/DELAYED/CANCELLED/COURT_STAY/UNKNOWN`.

Taiwan FSC draft-notice history, final-law pages and press releases establish that draft/consultation, final issuance and effective date are distinct source clocks. This is source-structure evidence, not yet historical PIT replay proof.

Expectation/surprise rule:
- surprise requires an archived ex-ante expectation available before the event;
- realized decision and expectation must use compatible units/definitions;
- if the expectation source is absent, surprise = UNKNOWN;
- market reaction may not be reverse-engineered into an assumed surprise.

General monetary-policy literature is retained as falsification evidence: policy surprises can be correlated with pre-announcement public information, and a central-bank announcement can combine a policy shock with an information shock. Therefore policy direction, information revelation and market reaction remain separate objects.

Boundary:
- D17 owns event identity/version, first-known clock, expectation/surprise and propagation;
- D13 owns macro/geopolitical state and controls;
- D10 owns supply-chain exposure;
- no duplicate factor votes across domains.

Bias guards:
- include delayed/revised/cancelled policy paths;
- cluster statement/press conference/minutes/speeches only when event identity supports it;
- freeze horizons before outcome joins;
- control date/event clustering and regime;
- no historical current-page backfill;
- corrections append and never overwrite.

D17 maturity recomputes 38.6% -> 41.4% across 14 modules. L3 remains closed pending Taiwan versioned PIT capture across independent policy events.

Formal Core unchanged. FORMAL_OPTIMIZATION_CANDIDATE = NO.

Exact next:
Prospectively preserve independent Taiwan draft/final/effective policy vintages with capturedAt and immutable payload/version receipts; archive pre-event expectation sources where available, otherwise preserve surprise UNKNOWN; keep existing D17-01/02/09 multi-day coverage work active.

## 2026-10-03 continuation — D11-15 Taiwan IPO PIT receipt + D17-14 policy-clock falsification

D17-14 policy-event clock source feasibility was tested against three independent FSC draft/final/effective histories. New receipt:
`research/d17_14_policy_clock_receipt_v0_1.json`.

Positive evidence:
- FSC preserves historical draft notices with announcement dates and comment-end dates.
- FSC final-law/history pages preserve final revision date, document number and effective clauses.
- One case is effective-on-publication, one is legally retroactive, and one has multiple provision-specific effective dates.

Counterevidence:
- publication != effective;
- effective can precede publication;
- one document can have multiple effective clocks;
- draft != final;
- legal effect != market first-known.

The clock sublane is L3-ready, but the full D17-14 module stays **L2** because no ex-ante expectation source has been validated. Surprise remains UNKNOWN rather than inferred from returns or narrative.

Formal Core unchanged; outcomes closed.

## 2026-10-04 continuation — cross-day official republication physically validated

New durable receipt: `research/d17_official_disclosure_crossday_receipt_20261004_v0_1.json`.
Read-only capture workflow: `.github/workflows/research-d17-official-disclosure-capture-readonly.yml`.
Successful run: `37183990727`; artifact: `11295807935`.

A second independent official-source observation date now exists after the 2026-09-28 pilot. The successful 2026-10-04 GitHub-hosted run fetched both official daily datasets twice about 66 seconds apart. TWSE returned five rows and TPEx four rows; each source had identical raw hashes across the two same-run polls and no added/removed/content-changed derived identities inside that short interval. This proves bounded same-run stability only.

The more important cross-day result is physical republication evidence:
- TWSE 2072 reappeared from publication date ROC 1150927 to 1151003 with the same fact date 1150824; the current notice explicitly carries an announcement period through 115/11/25.
- TWSE 6949 reappeared across the same publication dates with fact date 1150713; the par-value-change notice explicitly runs through 115/11/05.
- TPEx 4530 reappeared with fact date 1150708 and a multi-month rename announcement period.
- TPEx 4747 reappeared with fact date 1150624 and a multi-month par-value-change announcement period.

Therefore `daily row != new economic event` is no longer only a conceptual warning. It is physically observed across independent source dates. A new daily publication date can be a republication/recurring notice of the same economic primitive.

Prior-only rows such as 1721, 2509, 5904 and 8472 are not interpreted as cancelled. Their disappearance remains `UNKNOWN_WINDOW_EVICTION_OR_SOURCE_REMOVAL_OR_CORRECTION` because native rolling-window and correction semantics are still unproven.

Maturity decision:
- D17-09 advances L2 -> L3 for Taiwan PIT/source feasibility of republication-aware event clustering.
- D17-01 remains L2 because a licensed production general-news lane and full source/version governance remain unresolved.
- D17-02 remains L2 because displayed source time is not authenticated API first-availability time; capturedAt remains the conservative replay bound.
- D11-08 remains L2 for the same native revision/completeness reason.

No article count, duplicate count, sentiment or event count becomes a Formal vote. No price/return outcome was opened. Formal Core unchanged.

Exact next:
collect at least one additional independent official session plus after-hours expected/observed polling; preserve any content-hash changes append-only; search for native MOPS correction linkage; keep general-news licensing and first-availability gaps explicit.

## 2026-10-04 evening continuation — after-hours coverage + D17-10 source-lineage validation

New receipts:
- `research/d17_after_hours_coverage_receipt_20261004_v0_1.json`
- `research/d17_10_cross_source_lineage_receipt_20261004_v0_1.json`

The read-only official disclosure collector completed successful weekend/non-trading coverage in run `37197636375`. Both TWSE and TPEx had expected polls = 2 and observed polls = 2. The two within-run snapshots were unchanged, and both source raw hashes also matched the earlier 2026-10-04 afternoon run. This is bounded weekend stability, not proof of immutable source history or authenticated API first-availability time.

Therefore:
- D17-01 stays L2: official truth-lane evidence improved, but licensed production general-news coverage remains unresolved.
- D17-02 stays L2: capturedAt-safe replay and expected/observed polling are stronger, but true sourcePublishedAt-to-API-availability latency is still unauthenticated.
- D11-08 and D11-13 stay L2: one covered source lane/window cannot prove complete negative evidence across all event/news lanes.

D17-10 now has a Taiwan field-level lineage case.

Case 2537 / 聯上澐朗 fire:
- an early local-media report describes the physical fire and location while leaving cause/casualty resolution open;
- the issuer later filed an official material disclosure;
- a later financial-media article reports the extinguished fire and repeats issuer statements on no injuries, insurance and preliminary immaterial financial impact.

The important result is field-level independence:
- physical event occurrence has independent local-media + issuer-disclosure lineages;
- issuer claims on insurance/materiality are not independently confirmed merely because financial media repeats them;
- unresolved cause remains UNKNOWN;
- retrospective webpage publication clocks are not backdated into strategy firstKnownAt.

A second derivative example is 7827 HCB303: PChome explicitly republishes the MOPS disclosure with the same timestamp. It is distribution of one primary lineage, not a second confirmation.

Maturity decision:
D17-10 advances L2 -> L3 for Taiwan PIT/source feasibility of field-level lineage-aware cross-validation. Production general-news licensing, authenticated historical firstKnownAt and any alpha/outcome effect remain unresolved. Formal Core unchanged; outcome joins closed.

Exact next:
prospectively capture one independent-media + official-disclosure pair with capture timestamps on both lanes; retain field conflicts/version resolution; test cross-validation incremental value only after preregistration.

## 2026-10-04 evening continuation — D17-12 post-event path PIT feasibility

New receipt: `research/d17_12_post_event_path_pit_audit_20261004_v0_1.json`.

D17-12 advances L2 -> L3 for Taiwan PIT/source feasibility with a strict anti-double-count boundary.

The opening gap is one shared primitive:
- D11-10 owns event-linked overnight discontinuity / stop-risk semantics;
- D04-09 owns tail/gap volatility-state transformation;
- D17-12 begins only after the opening observation and owns subsequent continuation/fill/reversal path.

Validated official daily OHLC makes close and subsequent D1/D3/D5 states historically replayable when event-clock, corporate-action continuity and eligible-session guards pass. First-15m/30m path remains prospective-only; it may not be reconstructed from daily bars.

Frozen post-open states include continuation, partial fill, full fill, reversal, limit-constrained, suspension/resumption, corporate-action-blocked and UNKNOWN.

No claim is made that any path state predicts returns. No universal gap-fill threshold is introduced. Price-limit-constrained sessions do not reveal latent unconstrained price paths. Formal Core unchanged; outcomes closed.

## 2026-10-04 late-evening continuation — connected disclosure semantics + D17-04/D17-11 PIT feasibility

New receipts:
- `research/d17_material_disclosure_connected_source_audit_20261004_v0_1.json`
- `research/d17_04_direct_exposure_pit_audit_20261004_v0_1.json`
- `research/d17_11_sector_propagation_pit_audit_20261004_v0_1.json`

Connected-source audit:
the available Fugle material-disclosure content type `FCNT000004` physically returns item ID, symbol, second-level timestamp, title, original MOPS URL and structured description fields. A recent 2537 disclosure can be replayed exactly by `target_id`; an older 2537 correction disclosure is also independently replayable, showing that the correction exists as an additional item rather than silently replacing the prior item.

However:
- `timestamp_start` did not return raw rows in the tested bounded query, so incremental retrieval semantics remain unproven;
- older and newer item IDs serialize differently in the connected response;
- source/display timestamp is not authenticated API first-availability time;
- the connected content inventory still exposes no canonical licensed general-news content class.

Therefore D11-08, D17-01 and D17-02 remain L2. The finding narrows the blocker but does not clear it.

### D17-04 — direct exposure chain

Three divergent Taiwan official-disclosure witnesses now demonstrate the frozen chain:
`EVENT -> ECONOMIC_PRIMITIVE -> FIRM_EXPOSURE -> FINANCIAL_TRANSMISSION -> EFFECTIVE_TIMING`.

2537 construction fire:
direct adverse physical exposure is known, but net financial effect remains unknown because insurance and issuer preliminary immateriality assessment do not independently prove realized loss.

7827 HCB303 IND approval:
regulatory development progress is direct and source-proven, but it is not product approval, revenue, validated safety or efficacy. Financial magnitude/sign remain unknown.

6461 restricted employee shares:
direct issuer exposure is known, while retention/incentive benefit and dilution/compensation cost coexist. Net direction is conflicted.

This proves the data/state construction is Taiwan PIT-feasible without forcing event direction into a stock sign.

Maturity decision: D17-04 L2 -> L3. Alpha and outcome claims remain closed.

### D17-11 — event-specific sector propagation

D09 remains owner of point-in-time industry classification, persistent sector relative strength/breadth and peer-universe state. D10 remains owner of causal supply-chain/economic edges. D17 owns only event-specific propagation from a frozen event anchor into a pre-frozen peer set.

A bounded current-source witness confirms that 7827, 6461, 1795, 6472 and 4162 are all mapped to the biotechnology/medical industry in the same source family. This is not historical backfill permission; prospective studies must use D09's point-in-time classification vintage.

The propagation state can be COMMON_DEMAND_CONTAGION, COMMON_COST_CONTAGION, SUPPLY_CHAIN_TRANSMISSION, COMPETITIVE_SHARE_SHIFT, SUBSTITUTION, REGULATORY_COMMON_SHOCK, ATTENTION_ONLY, NO_VERIFIED_PROPAGATION_MECHANISM or UNKNOWN.

Same-industry membership does not imply same-sign effect. A leader return cannot become a peer fundamental score. Peer co-movement alone cannot prove the transmission edge.

Maturity decision: D17-11 L2 -> L3 for Taiwan PIT/source feasibility only.

D17-05 remains L2 because its graph authority still depends on D10-01, which is not yet L3. Formal Core unchanged; outcome joins closed.

## 2026-10-05 morning continuation — expectation/surprise and priced-in evidence-state PIT feasibility

New receipts:
- `research/d17_06_expectation_surprise_pit_audit_20261005_v0_1.json`
- `research/d17_07_priced_in_evidence_state_audit_20261005_v0_1.json`
- `research/d17_preopen_rolling_window_receipt_20261005_v0_1.json`

### D17-06 — expectation versus surprise

The Taiwan evidence now supports four distinct pre-event expectation classes:

1. full ex-ante distribution:
   - CBC decisions already have Reuters pre-decision distributions plus compatible official realization records;
   - numeric/distributional surprise is allowed only under a preregistered functional.

2. categorical conditional scenario set:
   - 7827 HCB303 disclosure on 2026-09-03 stated IND submission, conditional FDA review/clinical-hold paths and a roughly 30-day process;
   - 2026-10-03 realization allowed the trial to proceed;
   - this supports categorical realization against a frozen scenario set, not a fabricated scalar probability.

3. authorized but magnitude unquantified:
   - 6461 disclosed prior authorization for up to 2,000,000 restricted shares;
   - first issuance later realized at 516,000 shares;
   - the authorization ceiling is not an expectation denominator, therefore magnitude surprise stays UNKNOWN.

4. no valid expectation source:
   - surprise = UNKNOWN;
   - price reaction, media tone and realized outcome cannot back-solve an expectation.

Maturity decision:
D17-06 advances L2 -> L3 for Taiwan PIT/source feasibility. Cross-family surprise normalization, alpha and trading direction remain unproven and closed.

### D17-07 — priced-in evidence state

True market incorporation is latent and cannot be observed directly. The replayable object is only the pre-event expectation-evidence state.

Divergent Taiwan cases:
- 7827 HCB303: high verified expectation evidence that a regulatory realization was pending, while the exact outcome branch remained uncertain;
- 6461 restricted shares: partial expectation evidence because the program was authorized but first-issuance quantity/timing was not pre-frozen;
- 2537 construction fire: low verified prior expectation evidence in the covered official lanes because the physical event was unscheduled.

The allowed states remain:
`LOW_EXPECTATION_EVIDENCE`, `PARTIAL_EXPECTATION_EVIDENCE`, `HIGH_EXPECTATION_EVIDENCE`, `CONFLICTED`, `UNKNOWN`.

Hard guard:
these states are not probabilities of market awareness, not percentages already incorporated, and not trading signs. Post-event return cannot relabel the pre-event state. Prior price rise and repeated article count are insufficient proof.

Maturity decision:
D17-07 advances L2 -> L3 with qualifier `EVIDENCE_STATE_ONLY / TRUE_PRICED_IN_FRACTION_UNOBSERVABLE`.

### Preopen source-window falsification

Run `37243049741` completed successfully at about 07:14-07:16 Asia/Taipei. Both sources completed 2/2 expected polls.

TWSE changed from the prior five-row afternoon/evening payload to a three-row preopen payload with a new raw hash; TPEx remained four rows with the same raw hash.

This physically strengthens the rolling-window guard:
absence from a later current snapshot cannot mean cancellation, no event, or no prior disclosure.

No newly arriving item appeared between the two fixed-cadence polls, so D17-02 and D11-08 remain L2. D11-13 also remains L2 because one fully observed lane/window is not complete negative-event coverage across all required lanes.

D17-03 remains L2 until a trustworthy start clock and prospective path cohort exist.
D17-05 remains L2 because D10-01 economic graph authority is still below L3.
D17-08 remains L2 because canonical licensed general-news source readiness is unresolved.

Formal Core unchanged. Outcome joins closed.
