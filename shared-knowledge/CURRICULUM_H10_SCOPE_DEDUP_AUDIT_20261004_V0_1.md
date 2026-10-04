# H10 Scope De-dup Audit 2026-10-04 V0.1

Status: OWNER_APPROVAL_REQUIRED
Audit base main: `587144013dc705c9e27c36a6f9d5046fae15fe55`
Cluster: H10 — D10-12 / D17-04 / D17-05
Formal Core impact: NONE

## Accepted evidence

Room07:
- `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md`
- D10-12 bounded Taiwan PIT exposure/transmission receipts.

Room08:
- `NEWS_EVENT_TRANSMISSION_RESEARCH.md`
- `research/news_event_transmission_contract_v0_2.json`.

## Canonical producer-consumer boundary

### D10-12 — structural exposure producer
Owns:
- industry/product taxonomy;
- issuer/product/revenue exposure;
- upstream/downstream graph;
- pricing power/pass-through;
- inventory/capacity/order bridge;
- effective-dated issuer-native evidence;
- exposure magnitude/UNKNOWN and relationship versioning.

### D17-04 — direct event-attribution consumer
Consumes D10 structural exposure and adds:
- event identity/first-known;
- economic primitive;
- direct firm applicability;
- effective timing;
- event-specific direct beneficiary/victim state.

### D17-05 — second-order event-transmission consumer
Consumes D10 graph edges and adds:
- event-specific hop sequence;
- per-hop mechanism;
- event-time attenuation/inversion/UNKNOWN;
- second-order path and expiry.

D17-04/05 may not reconstruct a second issuer/supply-chain graph from headlines.

## Divergent states

PASS.

- structural exposure exists / no relevant current event: D10 active, D17 inactive.
- event occurs / direct exposure absent: D17-04 may be NO_DIRECT_EXPOSURE/UNKNOWN despite sector theme.
- direct event effect / second-order path unsupported: D17-04 active while D17-05 stays UNKNOWN.
- same structural edge / different event sign or timing: D10 unchanged while D17 overlay changes.
- second-order sign may attenuate/invert although structural edge remains valid.

## Anti-double-count

1. one structural exposure edge is owned by D10-12;
2. D17 references edge IDs rather than reminting exposure from news text;
3. event direction is not a stock sign until financial transmission/timing is supported;
4. direct and second-order paths share event identity but remain distinct path transforms;
5. static supply-chain membership cannot become a second event vote.

Result:
`PASS_STRUCTURAL_EDGE_PLUS_EVENT_OVERLAY_FIREWALL`.

## Anti-orphan

KEEP_SEPARATE preserves:
- durable structural exposure graph independent of events;
- event-specific direct attribution;
- event-specific second-order propagation.

Result:
`PASS_NO_ORPHAN`.

## Proposed canonical scope cleanup

D10-12:
explicitly remains sole structural exposure/graph authority.

D17-04:
wording should state it **consumes D10-12 exposure fields** and owns only event-specific direct attribution.

D17-05:
wording should state it **consumes D10-12 effective-dated graph edges** and owns only event-specific second-order path state.

Names and module IDs remain unchanged.

## Maturity firewall

- D10-12 remains L3/60%.
- D17-04 remains L2/40%.
- D17-05 remains L2/40%.
- no maturity transfer.

## Terminal governance recommendation

`KEEP_SEPARATE / SCOPE_DEDUP_ONLY / STRUCTURAL_EXPOSURE_PRODUCER_TO_EVENT_ATTRIBUTION_CONSUMERS`

Current state:
`OWNER_APPROVAL_REQUIRED`.

Approval authorizes canonical learningScope/status cleanup only; no rename, retirement, count, maturity, Formal or runtime change.
