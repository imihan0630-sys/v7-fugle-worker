# Global External Web Tool Policy V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CANONICAL_GLOBAL_TOOL_POLICY
Owner: repository owner
Scope: all Chat / Work / Codex rooms, 00, 01-15, System 1, System 2, and cross-project rooms that bootstrap from this repository/shared-knowledge.
Formal Core impact: NONE

## Owner decision

TinyFish is retired for all NEW interactive web-research / webpage-reading / web-task work.

Reason:
- owner has explicitly decided not to use TinyFish because its paid usage model is not desired.

Firecrawl is the default replacement for NEW work whenever a room needs the kind of external webpage discovery, crawling, extraction, page reading, or web-task capability that would previously have been routed to TinyFish.

## Mandatory routing

For NEW work after this policy:

1. If Firecrawl is available in the current ChatGPT room/session:
   - use Firecrawl as the preferred external web crawling / page extraction / research plugin;
   - do not call TinyFish.

2. If Firecrawl is NOT available in the current room/session:
   - do NOT silently fall back to TinyFish;
   - use native ChatGPT web/search/browser capabilities when they are sufficient;
   - if the task specifically requires Firecrawl-only/plugin functionality, report that Firecrawl is not currently connected/available in that room and stop only at the actual connection boundary.

3. Existing native repository collectors remain valid:
   - deterministic repository-owned API clients;
   - Playwright collectors;
   - official-source downloaders;
   - CI/runtime data collectors.
   
   This policy does NOT automatically replace repository-owned collectors with a chat plugin. Engineering collectors are governed by reproducibility, PIT, source lineage, CI, and deployment requirements.

## Historical evidence integrity

Do NOT rewrite historical artifacts merely because they mention TinyFish.

Examples:
- old evidence that truthfully records "observedVia: TinyFish" must remain unchanged;
- old handoff notes saying "replace TinyFish" remain historical provenance.

Historical provenance is not current authorization.

Any NEW artifact created after this policy must not record TinyFish as the active collection tool unless the owner explicitly reverses this policy.

## Cross-project application

This policy is intended to be global across the owner's related projects/rooms.

Automatic enforcement is guaranteed for rooms that:
- read this repository's `shared-knowledge/ROOM_BOOTSTRAP.md`;
- read `shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json`;
- read repository `AGENTS.md`; or
- otherwise use this shared-knowledge repository as their continuity/governance source.

For a completely unrelated ChatGPT project that does not load this repository/shared bootstrap, the repository cannot technically force that project to read this policy. Such a project should be pointed to this file or adopt the same bootstrap rule.

## Tool hierarchy for research rooms

Default research-tool preference when external public-web evidence is needed:

1. official APIs / issuer-native files / exchange/regulator machine sources when available;
2. Firecrawl for public webpage discovery, reading, crawling and extraction;
3. native ChatGPT web/search/browser for ordinary public web lookup when sufficient;
4. repository-owned Playwright/browser collector when deterministic repeatable engineering capture is required;
5. TinyFish: DISALLOWED for new work.

The hierarchy is evidence-quality oriented. Firecrawl does not override the preference for primary official sources.

## Governance and evidence requirements

Using Firecrawl does not relax:
- PIT / first-known / availableAt requirements;
- source provenance / hash / version requirements;
- official-source preference;
- no-lookahead;
- copyright / access rules;
- Class A/B/C engineering governance;
- Formal Core approval gates;
- source completeness and UNKNOWN fail-closed semantics.

A Firecrawl result is a retrieval channel, not proof that a source is authoritative, complete, or historically available at the decision timestamp.

## Current connection note

As of policy creation, Firecrawl is available in the ChatGPT plugin directory but is not installed at the account level.

Therefore:
- policy routing is effective immediately;
- actual Firecrawl tool calls require the plugin to be installed/connected in the relevant ChatGPT environment;
- until then, rooms must not revert to TinyFish.

## Supersession rule

This file supersedes any generic instruction that would choose TinyFish for NEW chat/research web tasks.

It does not supersede:
- historical provenance;
- already-frozen repository collector design where TinyFish is already being removed;
- specific official-source/API requirements.

Only an explicit later owner decision may re-enable TinyFish.
