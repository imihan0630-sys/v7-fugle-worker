# Alpha-oriented Knowledge Discovery Audit — Work Handoff Checkpoint 2026-10-04

Status: READY_FOR_WORK_HANDOFF
Authoritative base main: `1e5a7ac975d2902e27351c2921dc888d7acd32af`

## Purpose

Continue the Alpha-oriented Knowledge Discovery Audit（選股增益知識探索審查） in Work mode without restarting prior Coverage / curriculum audits.

This checkpoint is for a large cross-source, cross-domain research sweep whose goal is to discover knowledge that may improve stock selection and is not already cleanly owned by the canonical curriculum.

## Canonical curriculum snapshot

Authoritative tracker:
`research/stock_market_learning_tracker_v0_1.json`

Current snapshot:
- domains: 22
- active modules: 354
- weighted maturity: 38.3%
- tracker updatedAt: 2026-10-04T03:22:00+08:00

Do not change module count, domain count, maturity, owner, or Formal Core from this checkpoint.

## Existing discovery audit

Read first:
1. `AGENTS.md`
2. `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md`
3. `shared-knowledge/SHARED_KNOWLEDGE_GOVERNANCE.md`
4. `shared-knowledge/ALPHA_ORIENTED_KNOWLEDGE_DISCOVERY_AUDIT_20261004_V0_1.md`
5. `shared-knowledge/alpha_oriented_knowledge_discovery_audit_20261004_v0_1.json`
6. `shared-knowledge/alpha_oriented_knowledge_discovery_execution_registry_20261004_v0_1.json`
7. `shared-knowledge/AOKD01_INTANGIBLE_CAPITAL_SPECIALIST_VALIDATION_PACKET_20261004_V0_1.md`
8. `research/stock_market_learning_tracker_v0_1.json`

## Existing candidates — do not restart

### AOKD-01
Intangible Capital / R&D Capitalization / Innovation Quality
- priority: HIGH
- state: SPECIALIST_VALIDATION_PACKET_READY
- primary room: 06｜基本面與估值研究室
- primary domain: D07
- dependencies: D08 / D19 / D16
- expected return:
  `research/AOKD01_D07_INTANGIBLE_CAPITAL_SPECIALIST_RETURN_V0_1.md`
- no COV id assigned yet
- do not create COV-13 automatically

### AOKD-02
Firm-level Demand Nowcasting via Alternative Sales / Product Data
- state: SOURCE_FEASIBILITY_REQUIRED
- do not promote until a Taiwan PIT/replay-capable issuer-level data source is demonstrated

### AOKD-03
Human Capital / Hiring / Skill-demand Signals
- state: COVERAGE_BIAS_AND_ENTITY_MAPPING_REQUIRED
- official TaiwanJobs vacancy data exists, but listed-company mapping, historical coverage and platform bias remain unresolved

### AOKD-04
Employee Culture / Psychological Safety / Employee-review Signals
- state: WATCHLIST_NONCORE
- do not promote without Taiwan-wide historical coverage

## Explicitly rejected as new gaps in the first pass

Do not re-propose these as new modules unless materially new evidence proves the existing owner is insufficient:
- analyst expectations / forecast revisions — already owned by D07-11
- option-implied information / volatility surface — already owned by D12
- generic NLP / LLM financial-text features — already owned by D16-22
- generic alternative-data methodology — already owned by D16-21
- borrow fee / securities lending / shorting — already covered by existing D06 / D14 / D20 dependency chain

## Work-mode objective

Perform a broad Alpha-oriented knowledge sweep across current academic / practitioner research and compare discoveries against the canonical 354-module curriculum.

This is NOT a generic finance syllabus expansion.

Only retain a candidate when all of these are plausible:
1. cross-sectional stock-selection relevance;
2. incremental information beyond existing owners;
3. Taiwan PIT / replay feasibility;
4. falsifiable positive and negative mechanisms;
5. clean owner / dependency / anti-double-count boundary.

## Required research families to sweep

At minimum cover:
- fundamentals / accounting / valuation;
- asset pricing / anomalies / factors;
- analyst expectations and information diffusion;
- market microstructure / order flow / liquidity;
- derivatives-implied information;
- institutional / ownership / shorting / lending;
- corporate governance / insiders / capital allocation;
- credit / debt / distress;
- innovation / patents / intangible capital;
- hiring / human capital / labor-market signals;
- product / demand / alternative sales data;
- textual / NLP / document structure signals;
- supply-chain / network / resilience;
- behavioral / attention / disagreement;
- regime-dependent and sector-specific cross-sectional effects.

## De-duplication rule

For each discovery:
- search the canonical tracker;
- identify nearest owner modules;
- state whether the new knowledge is:
  - ALREADY_OWNED
  - SCOPE_EXTENSION_CANDIDATE
  - TRUE_GAP_CANDIDATE
  - DATA_FEASIBILITY_BLOCKED
  - REJECTED_REDUNDANT
- do not create module IDs during discovery.

## Evidence standard

For each retained candidate record:
- exact economic mechanism;
- strongest positive evidence;
- strongest counterevidence;
- closest canonical owner(s);
- incremental-value hypothesis;
- Taiwan source feasibility;
- first-known / PIT / replay implications;
- anti-double-count boundary;
- proposed primary owner;
- required specialist validation;
- recommendation on whether to promote into a formal Coverage candidate.

## Stop rule

Do not stop after one paper, one candidate, one domain, or one source.
Continue until the external sweep reaches saturation: successive searches mostly rediscover already-owned or previously rejected knowledge families.

## Output

Produce:
1. a ranked discovery registry;
2. a rejected/redundant registry;
3. a Taiwan-data-feasibility table;
4. a candidate-to-owner mapping;
5. a shortlist of only the candidates that deserve specialist validation;
6. exact continuation point for 00｜研究總控室.

## Governance firewalls

- no module/domain-count change;
- no maturity promotion;
- no direct owner reassignment;
- no Formal Core change;
- no System1/System2 Formal behavior change;
- UNKNOWN must never become 0/BAD/no-event;
- no fabricated historical Shadow evidence;
- specialist validation is required before any candidate becomes a formal Coverage item.

## First action in Work

Re-read latest `main`; if it has advanced beyond `1e5a7ac975d2902e27351c2921dc888d7acd32af`, use the newer main as authority, then begin the external Alpha-oriented sweep without redoing AOKD-01 through AOKD-04.
