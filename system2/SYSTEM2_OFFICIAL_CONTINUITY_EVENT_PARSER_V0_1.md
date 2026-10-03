# System 2 Official Continuity Event Parser V0.1

Status: RESEARCH_ONLY / READ_ONLY_PHYSICAL_VALIDATION
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Convert the six already transport-verified TWSE / TPEx historical corporate-action result lanes into normalized immutable System2 corporate-action event versions.

This parser is downstream of:
- official source capability V0.2;
- corporate-action continuity archive core V0.1.

It does not persist to D1 and does not transform price history.

## Frozen source mappings

TWSE:
- TWT49U ex-right / ex-dividend actual results;
- TWTAUU capital-reduction resume/reference results;
- TWTB8U par-value-change resume/reference results.

TPEx:
- exDailyQ ex-right / ex-dividend actual results;
- revivt capital-reduction resume/reference results;
- pvChgRslt par-value-change resume/reference results.

## Parser rules

For each source:
- response range must exactly match the requested interval;
- required date/symbol/pre-close/reference-price headers must be present;
- only ordinary four-digit equity symbols become event versions;
- ROC and Gregorian date tokens are normalized;
- official pre-action close and official reference price remain separate raw fields;
- a reference-price ratio is derived only when both official prices are positive numeric values;
- missing price pairs do not erase the event; they leave continuityEffectState=UNKNOWN.

## Historical knowledge-clock firewall

These are historical actual-result pages. They prove event/effective-date evidence but do not prove when System2 could first have known the event historically.

Therefore every normalized historical event uses:
- knowledgeTimeMode=HISTORICAL_UNKNOWN;
- firstKnownAt=null;
- availableAt=null;
- pitEventReplayEligible=false.

This prevents backdating current retrieval into historical event-signal availability.

## Completeness firewall

A successfully parsed historical range still does not prove:
- revisionCoverageComplete;
- emptyRangeSemanticsCertified;
- NO_EVENT;
- suspension completeness;
- symbol-session completeness;
- technical continuity.

All of those remain false.

## Physical validation

The read-only workflow:
`.github/workflows/system2-official-continuity-event-parser-readonly.yml`

fetches the six official historical sources from GitHub Actions without:
- secrets;
- D1 bindings or writes;
- Worker deploy;
- Cron;
- System1 runtime.

The frozen validation interval is 2026-04-05 through 2026-10-02, matching the prior source-capability physical probe.

## Next gate

After physical parser acceptance:
1. freeze endpoint-specific empty-range semantics;
2. add revision/correction coverage evidence;
3. add suspension/resumption source coverage by exchange;
4. decide isolated append-only persistence only after the event record contract is stable;
5. bind those receipts to expected symbol sessions and RAW A1 history without mutating RAW bars.

No assessor or selection authority is enabled.
