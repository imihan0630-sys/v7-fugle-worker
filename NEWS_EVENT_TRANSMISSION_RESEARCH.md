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
