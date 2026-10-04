# H08 Dependency + Anti-Orphan Audit 2026-10-04 V0.1

Status: CLOSED_NO_STRUCTURAL_CHANGE
Audit base main: `587144013dc705c9e27c36a6f9d5046fae15fe55`
Cluster: H08 — D09-11 / D17-11 / D20-11
Formal Core impact: NONE

## Canonical three-layer ownership

### D09-11 — taxonomy / membership bridge
Owns effective-dated many-to-many theme ↔ industry ↔ issuer mapping, exposure evidence, classification version and UNKNOWN.
It does not claim that a theme is currently propagating.

### D17-11 — event/news propagation
Owns dated event/news identity, first-known clock, event half-life, direct/peer propagation path and contagion-vs-competition mechanism.
It does not infer psychology from propagation.

### D20-11 — behavioral narrative diffusion
Owns only independent social-language/topic/stance diffusion after controlling D09 membership and D17 event/news propagation.
Current bounded Taiwan PIT-capable sublane uses PTT Stock prospective narrative/topic/stance snapshots.

## Divergent states

PASS.

- D09 membership known / no current event / no narrative diffusion.
- D17 event propagation active / D20 narrative UNKNOWN because social-language evidence is absent.
- D20 narrative diffusion active around a topic while D17 fundamental event linkage is weak/UNKNOWN.
- one event can propagate economically while social narrative later amplifies, attenuates or reframes it.
- static theme membership may persist while event/narrative states expire.

## Dependency Audit

One source fact/theme relationship may feed different transforms, but:
- D09 owns persistent classification/exposure;
- D17 owns event-specific information propagation;
- D20 owns behavior-specific social-language diffusion.

Result:
`PASS_THREE_LAYER_MEMBERSHIP_EVENT_NARRATIVE_GRAPH`.

## Anti-double-count

1. static theme membership cannot become an event-propagation vote;
2. copied headline/news lineage remains D17 evidence, not D20 narrative evidence;
3. PTT topic/stance diffusion cannot be counted again as D20 attention or herding without residual/incremental proof;
4. one social parent receipt may support multiple transforms but not multiple independent votes by construction;
5. price comovement alone is neither D17 propagation nor D20 narrative diffusion.

Result:
`PASS_SHARED_THEME_EVENT_SOCIAL_RECEIPT_FIREWALL`.

## Anti-orphan

KEEP_SEPARATE preserves three capabilities that are genuinely distinct:
- effective-dated membership/exposure mapping;
- event/news propagation with first-known/half-life;
- behavioral/social narrative diffusion.

Result:
`PASS_NO_ORPHAN`.

## Maturity firewall

- D09-11 remains L3/60%.
- D17-11 remains L2/40%.
- D20-11 remains L3/60%.
- D09/D20 maturity does not promote D17.
- closure adds no L4/OOS/alpha evidence.

## Terminal classification

`KEEP_SEPARATE / MEMBERSHIP_VS_EVENT_PROPAGATION_VS_NARRATIVE_DIFFUSION / SHARED_LINEAGE_FIREWALL`

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.

No merge, rename, retirement, module-count, maturity, Formal or runtime change.
