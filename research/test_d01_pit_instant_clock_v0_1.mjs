import assert from "node:assert/strict";
import {parsePITInstant,comparePITInstants} from "./d01_pit_instant_clock_v0_1.mjs";
import {validateEvidenceClock} from "./pattern_dl095_owner_return_acceptance_oracle_v0_1.mjs";
import {validateTemporalReceipt} from "./pattern_first_wave_receipt_bundle_oracle_v0_1.mjs";
// Pure synthetic timestamp fixtures; no historical source clock receipt is certified here.
const cutoff="2021-06-15T23:59:59+08:00";
const dl95=(firstObservableAt,interfaceCutoffAt=cutoff)=>validateEvidenceClock({firstObservableAt,interfaceCutoffAt}).status;
const dl91=(firstObservableAt,predictorFreezeAt=cutoff,replaySafe=true)=>
  validateTemporalReceipt({firstObservableAt,predictorFreezeAt,replaySafe}).status;
const cases=[
 ["post-cutoff UTC 16:00 misread before local 23:59",()=>{assert.equal(dl95("2021-06-15T16:00:00Z"),"LATE_EVIDENCE_NOT_PIT_ELIGIBLE");assert.equal(dl91("2021-06-15T16:00:00Z"),"RECEIPT_LOOKAHEAD")}],
 ["precisely same UTC instant at local cutoff is valid",()=>{assert.equal(dl95("2021-06-15T15:59:59Z"),"EVIDENCE_CLOCK_VALID");assert.equal(dl91("2021-06-15T15:59:59Z"),"RECEIPT_PIT_VALID")}],
 ["after cutoff by one millisecond fails",()=>assert.equal(dl95("2021-06-15T15:59:59.001Z"),"LATE_EVIDENCE_NOT_PIT_ELIGIBLE")],
 ["future local day earlier UTC instant must be valid",()=>{assert.equal(dl95("2021-06-16T00:30:00+10:00"),"EVIDENCE_CLOCK_VALID");assert.equal(dl91("2021-06-16T00:30:00+10:00"),"RECEIPT_PIT_VALID")}],
 ["equivalent offset textual dates compare equal",()=>assert.equal(comparePITInstants("2021-06-15T23:59:59+08:00","2021-06-15T15:59:59Z").state,"KNOWN_BY_CUTOFF")],
 ["UTC datetime with explicit trailing Z admitted",()=>assert.equal(parsePITInstant("2021-06-15T15:59:59Z"),Date.parse("2021-06-15T15:59:59Z"))],
 ["past local observation remains valid",()=>assert.equal(dl95("2021-06-15T16:00:00+08:00"),"EVIDENCE_CLOCK_VALID")],
 ["future local observation blocks",()=>assert.equal(dl91("2021-06-16T00:00:00+08:00"),"RECEIPT_LOOKAHEAD")],
 ["missing UTC offset cannot prove PIT",()=>{assert.equal(dl95("2021-06-15T15:59:59"),"EVIDENCE_CLOCK_UNKNOWN");assert.equal(dl91("2021-06-15T15:59:59"),"RECEIPT_CLOCK_UNKNOWN")}],
 ["date-only not enough to establish intraday causality",()=>assert.equal(dl95("2021-06-15"),"EVIDENCE_CLOCK_UNKNOWN")],
 ["invalid calendar 2021-02-30 rejected even when Date.parse rolls",()=>assert.equal(parsePITInstant("2021-02-30T12:00:00+08:00"),null)],
 ["valid leap day admitted",()=>assert.ok(parsePITInstant("2020-02-29T12:00:00+08:00")!==null)],
 ["invalid nonleap Feb29 rejected",()=>assert.equal(parsePITInstant("2021-02-29T12:00:00+08:00"),null)],
 ["hour 24 rejected",()=>assert.equal(parsePITInstant("2021-06-15T24:00:00Z"),null)],
 ["minute 60 rejected",()=>assert.equal(parsePITInstant("2021-06-15T23:60:00Z"),null)],
 ["unsupported timezone +15 rejected",()=>assert.equal(parsePITInstant("2021-06-15T23:59:59+15:00"),null)],
 ["offset +14:01 rejected",()=>assert.equal(parsePITInstant("2021-06-15T23:59:59+14:01"),null)],
 ["legal edge timezone -14 admitted",()=>assert.ok(parsePITInstant("2021-06-15T23:59:59-14:00")!==null)],
 ["invalid timezone minute 60 rejected",()=>assert.equal(parsePITInstant("2021-06-15T23:59:59+08:60"),null)],
 ["sub-millisecond timestamps blocked rather than silently truncated",()=>assert.equal(parsePITInstant("2021-06-15T15:59:59.999999999Z"),null)],
 ["unparseable null observation blocked",()=>{assert.equal(dl95(null),"EVIDENCE_CLOCK_UNKNOWN");assert.equal(dl91(null),"RECEIPT_CLOCK_UNKNOWN")}],
 ["replaySafe=false never upgrades clock",()=>assert.equal(dl91("2021-06-15T15:59:59Z",cutoff,false),"RECEIPT_CLOCK_UNKNOWN")],
 ["invalid cutoff blocks",()=>assert.equal(dl95("2021-06-15T15:59:59Z","bad"),"EVIDENCE_CLOCK_UNKNOWN")],
 ["DST-like offset alternatives compared by instant not displayed hour",()=>assert.equal(dl95("2021-06-15T17:00:00+01:00"),"LATE_EVIDENCE_NOT_PIT_ELIGIBLE")],
 ["UTC year boundary causal equivalence",()=>assert.equal(comparePITInstants("2026-01-01T00:00:00+08:00","2025-12-31T16:00:00Z").state,"KNOWN_BY_CUTOFF")]
];
let passed=0,failed=[];
for(const [name,test] of cases)try{test();passed++;console.log("PASS "+name)}catch(e){failed.push({name,error:e.message});console.error("FAIL "+name+": "+e.message)}
console.log(JSON.stringify({suite:"D01_PIT_OFFSET_CLOCK_CAUSALITY",passed,total:cases.length,failed}));
if(failed.length)process.exitCode=1;
