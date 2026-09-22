import assert from "node:assert/strict";
import { buildShadowProvenanceDiagnostic } from "./shadow_provenance_v8_8_2.js";

// Synthetic production-shaped exact-path fixture.
// Purpose: freeze current counterfactual parser/outcome/coverage semantics and prove
// provenance diagnostics are additive only. These are deterministic synthetic rows,
// not reconstructed historical production evidence.
function n(v){ if(v===null||v===undefined||v==="") return null; const x=Number(v); return Number.isFinite(x)?x:null; }
function legacyOutcome(row,bars){
  const snapshot=row?.snapshot||{};
  const baseline=n(snapshot?.price?.close);
  const scanDate=String(row?.scan_date||row?.scanDate||"").slice(0,10);
  const post=(Array.isArray(bars)?bars:[]).filter(b=>String(b?.date||"").slice(0,10)>scanDate&&n(b?.close)!==null).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const metric=s=>{ if(!s.length||!(baseline>0)) return null; const last=s.at(-1), c=n(last?.close); return {returnPct:c===null?null:Math.round(((c/baseline-1)*100)*100)/100}; };
  const horizons={}; for(const h of [1,3,5,10,20]) horizons["d"+h]=post.length>=h?metric(post.slice(0,h)):null;
  return {scanDate,symbol:String(row?.symbol||""),baselineClose:baseline,horizons};
}
function legacyParseSnapshot(raw){ try{return JSON.parse(raw||"{}");}catch(_){return{};} }
function legacyParseHistory(historyRow){ if(!historyRow) return []; try{const x=JSON.parse(historyRow.history_json||"[]"); return Array.isArray(x)?x:[];}catch(_){return[];} }
function legacyCoverage(outcomes){ const out={}; for(const h of [1,3,5,10,20]) out["d"+h]=(outcomes||[]).filter(x=>Number.isFinite(x?.horizons?.["d"+h]?.returnPct)).length; return out; }

const bars1=[{date:"2026-09-22",open:100,high:102,low:99,close:101}];
const bars3=[...bars1,{date:"2026-09-23",open:101,high:103,low:100,close:102},{date:"2026-09-24",open:102,high:104,low:101,close:103}];
const cases=[
  {id:"valid-mature-d1",raw:{scan_date:"2026-09-21",symbol:"S1",snapshot_json:JSON.stringify({price:{close:100}})},historyRow:{history_json:JSON.stringify(bars1)}},
  {id:"valid-insufficient-later",raw:{scan_date:"2026-09-21",symbol:"S2",snapshot_json:JSON.stringify({price:{close:100}})},historyRow:{history_json:JSON.stringify(bars3)}},
  {id:"missing-history-row",raw:{scan_date:"2026-09-21",symbol:"S3",snapshot_json:JSON.stringify({price:{close:100}})},historyRow:null},
  {id:"malformed-history",raw:{scan_date:"2026-09-21",symbol:"S4",snapshot_json:JSON.stringify({price:{close:100}})},historyRow:{history_json:"["}},
  {id:"empty-history",raw:{scan_date:"2026-09-21",symbol:"S5",snapshot_json:JSON.stringify({price:{close:100}})},historyRow:{history_json:"[]"}},
  {id:"malformed-snapshot",raw:{scan_date:"2026-09-21",symbol:"S6",snapshot_json:"{"},historyRow:{history_json:JSON.stringify(bars1)}},
  {id:"missing-baseline",raw:{scan_date:"2026-09-21",symbol:"S7",snapshot_json:JSON.stringify({price:{close:null}})},historyRow:{history_json:JSON.stringify(bars1)}}
];
const outcomes=[];
for(const c of cases){
  const parsed=legacyParseSnapshot(c.raw.snapshot_json);
  const bars=legacyParseHistory(c.historyRow);
  const legacyRow={...c.raw,snapshot:parsed};
  const before=legacyOutcome(legacyRow,bars);
  const frozen=structuredClone(before);
  const diag=buildShadowProvenanceDiagnostic({row:c.raw,historyRow:c.historyRow,outcome:before});
  assert.deepEqual(before,frozen,`${c.id}: legacy outcome mutated`);
  assert.equal(diag.calendarMaturity,"UNKNOWN",`${c.id}: calendar maturity must remain UNKNOWN`);
  outcomes.push(before);
}
const coverageBefore=legacyCoverage(outcomes), coverageFrozen=structuredClone(coverageBefore);
// Re-run diagnostics over every case; legacy coverage must remain identical.
for(let i=0;i<cases.length;i++) buildShadowProvenanceDiagnostic({row:cases[i].raw,historyRow:cases[i].historyRow,outcome:outcomes[i]});
assert.deepEqual(legacyCoverage(outcomes),coverageFrozen);
assert.deepEqual(coverageBefore,coverageFrozen);

assert.equal(buildShadowProvenanceDiagnostic({row:cases[0].raw,historyRow:cases[0].historyRow,outcome:outcomes[0]}).horizons.d1,"OUTCOME_AVAILABLE");
assert.equal(buildShadowProvenanceDiagnostic({row:cases[1].raw,historyRow:cases[1].historyRow,outcome:outcomes[1]}).horizons.d5,"OBSERVED_HISTORY_INSUFFICIENT");
assert.equal(buildShadowProvenanceDiagnostic({row:cases[2].raw,historyRow:null,outcome:outcomes[2]}).historyStatus,"HISTORY_ROW_MISSING");
assert.equal(buildShadowProvenanceDiagnostic({row:cases[3].raw,historyRow:cases[3].historyRow,outcome:outcomes[3]}).historyStatus,"HISTORY_PARSE_ERROR");
assert.equal(buildShadowProvenanceDiagnostic({row:cases[4].raw,historyRow:cases[4].historyRow,outcome:outcomes[4]}).historyStatus,"HISTORY_EMPTY");
assert.equal(buildShadowProvenanceDiagnostic({row:cases[5].raw,historyRow:cases[5].historyRow,outcome:outcomes[5]}).snapshotStatus,"SNAPSHOT_PARSE_ERROR");
assert.equal(buildShadowProvenanceDiagnostic({row:cases[6].raw,historyRow:cases[6].historyRow,outcome:outcomes[6]}).baselineStatus,"BASELINE_CLOSE_MISSING");

console.log("shadow provenance exact-path synthetic equivalence fixture: PASS");
