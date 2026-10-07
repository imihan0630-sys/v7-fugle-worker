# D01 DL-100 — First-Wave Denominator and Alias-Dedup Ledger V0.1

Updated: 2026-10-07 Asia/Taipei
Status: DENOMINATOR_CONTRACT_FROZEN / OUTCOME_BLIND / FORMAL_CORE_LOCKED

## Purpose

Prevent pattern research from inflating sample size by:
- dropping no-pattern dates;
- dropping blocked dates;
- counting multiple names for the same OHLC geometry as independent signals;
- counting overlapping sequence windows as independent when they share the same information root;
- counting multiple handles inside one base as separate structural roots.

## Observation ledger states

Every module/date entering the preregistered universe must end in exactly one state:

UPSTREAM_DATA_BLOCKED
R7_DATA_BLOCKED
NO_STRUCTURE
STRUCTURE_EMITTED

No silent row deletion is allowed.

## Alias dedup

One canonical information root may have many display labels.

D01-02:
all aliases attached to the same source bar / canonical geometry share one effective evidence root.

D01-03:
multiple named sequences over the same ordered sourceBarIds share one effective evidence root.

D01-07:
multiple handle/base labels belonging to the same baseEpisodeId are one structural root unless a preregistered independence rule says otherwise.

D01-09:
multiple gap names generated from the same prior-close/current-open pair and legal context are one gap root.

Alias count may be reported for explainability.
It may not multiply:
- sample size;
- score;
- vote;
- statistical degrees of freedom.

## Overlap dependence

Different sequence windows can be distinct observations yet statistically dependent.

The ledger therefore preserves:
- opportunityId;
- informationRoot;
- redundancyGroup;
- sourceBarIds;
- overlapGroupId where applicable.

D16 must use these dependency fields in clustering/bootstrap/multiplicity design rather than pretending every overlapping window is independent.

## Denominator identity

A denominator is keyed by:
- experimentId;
- moduleId;
- universeVersion;
- foldId;
- predictorDate;
- opportunityId.

The same opportunity cannot appear twice merely because two aliases fire.

## Failures remain evidence

For lifecycle families:
- failed;
- expired;
- unresolved;
- invalidated

are retained according to their frozen lifecycle semantics.

For gap families:
- never-filled;
- censored;
- mechanically rebased;
- price-limit constrained;
- data-blocked

remain accounted.

For cup/base:
failed/expired candidates remain in the candidate denominator.

## No-winner rule

After dedup and full denominator accounting, a module may legitimately produce:
- no structures;
- no incremental parent-beating child;
- no statistically supported family.

NO_WINNER is a valid scientific result.

## Current decision

FULL_DENOMINATOR_REQUIRED = TRUE.
ALIAS_MULTIPLICATION_PROHIBITED = TRUE.
OVERLAP_DEPENDENCE_PRESERVED = TRUE.
NO_STRUCTURE_RETAINED = TRUE.
DATA_BLOCKED_RETAINED = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
