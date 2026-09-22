import assert from "node:assert/strict";
import {
  parseShadowSnapshot,parseShadowHistory,buildShadowProvenanceDiagnostic
} from "./shadow_provenance_v8_8_2.js";

const row=(snapshot_json='{"price":{"close":100}}')=>({scan_date:"2026-09-21",symbol:"TEST",snapshot_json});
const bar=(date,close=101)=>({date,open:100,high:102,low:99,close});

// malformed snapshot + valid history
{
  const d=buildShadowProvenanceDiagnostic({row:row("{"),historyRow:{history_json:JSON.stringify([bar("2026-09-22")])},outcome:{horizons:{}}});
  assert.equal(d.snapshotStatus,"SNAPSHOT_PARSE_ERROR");
  assert.equal(d.baselineStatus,"BASELINE_CLOSE_MISSING");
  assert.equal(d.horizons.d1,"SNAPSHOT_PARSE_ERROR");
}

// valid snapshot + malformed history
{
  const d=buildShadowProvenanceDiagnostic({row:row(),historyRow:{history_json:"["},outcome:{horizons:{}}});
  assert.equal(d.historyStatus,"HISTORY_PARSE_ERROR");
  assert.equal(d.horizons.d1,"HISTORY_PARSE_ERROR");
}

// missing history row
{
  const d=buildShadowProvenanceDiagnostic({row:row(),historyRow:null,outcome:{horizons:{}}});
  assert.equal(d.historyStatus,"HISTORY_ROW_MISSING");
  assert.equal(d.horizons.d1,"HISTORY_ROW_MISSING");
}

// empty history
{
  const d=buildShadowProvenanceDiagnostic({row:row(),historyRow:{history_json:"[]"},outcome:{horizons:{}}});
  assert.equal(d.historyStatus,"HISTORY_EMPTY");
  assert.equal(d.horizons.d1,"HISTORY_EMPTY");
}

// valid history but insufficient post-scan bars: never claim calendar immaturity
{
  const d=buildShadowProvenanceDiagnostic({row:row(),historyRow:{history_json:JSON.stringify([bar("2026-09-22")])},outcome:{horizons:{}}});
  assert.equal(d.postScanValidBars,1);
  assert.equal(d.horizons.d1,"UNKNOWN");
  assert.equal(d.horizons.d3,"OBSERVED_HISTORY_INSUFFICIENT");
  assert.equal(d.calendarMaturity,"UNKNOWN");
}

// mature D1: existing finite outcome is authoritative and remains observational only
{
  const d=buildShadowProvenanceDiagnostic({row:row(),historyRow:{history_json:JSON.stringify([bar("2026-09-22")])},outcome:{horizons:{d1:{returnPct:1}}}});
  assert.equal(d.horizons.d1,"OUTCOME_AVAILABLE");
}

// parsing helpers preserve UNKNOWN rather than coercing failures to good data
assert.equal(parseShadowSnapshot("{").snapshotStatus,"SNAPSHOT_PARSE_ERROR");
assert.equal(parseShadowHistory({history_json:"["}).historyStatus,"HISTORY_PARSE_ERROR");
console.log("shadow provenance targeted tests: PASS");
