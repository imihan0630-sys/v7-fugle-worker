import assert from "node:assert/strict";
import {
  localDateFromTimestamp,isoWeekKey,localPeriodKey,buildHigherTimeframeAsOf,
  classifyDerivedRevision,revisionRootAccounting,validateNoRevisionVoteInflation
} from "./pattern_dl116_118_calendar_boundary_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h1="a".repeat(64),h2="b".repeat(64);
const week=["2021-06-14","2021-06-15","2021-06-16","2021-06-17","2021-06-18"];
const holidayWeek=["2021-06-14","2021-06-15","2021-06-16","2021-06-17"];
const bar=(d,o=10,hi=12,lo=9,c=11,extra={})=>({
  id:"B-"+d,marketDate:d,market:"TWSE",marketTimezone:"Asia/Taipei",semanticSpace:"RAW_EXECUTION",
  open:o,high:hi,low:lo,close:c,finalized:true,
  finalizedAt:d+"T13:35:00+08:00",firstObservableAt:d+"T13:35:00+08:00",...extra
});
const obs4=[
  bar("2021-06-14",10,12,9,11),
  bar("2021-06-15",11,13,10,12),
  bar("2021-06-16",12,14,11,13),
  bar("2021-06-17",13,15,12,14)
];
const obs5=[...obs4,bar("2021-06-18",14,16,13,15)];
const base=(over={})=>({
  market:"TWSE",marketTimezone:"Asia/Taipei",calendarVersion:"CAL-1",
  calendarFirstObservableAt:"2021-01-01T00:00:00+08:00",
  scale:"W1",targetPeriodKey:"2021-W24",
  predictorFreezeAt:"2021-06-17T14:00:00+08:00",
  expectedEligibleSessions:week,observations:obs4,
  semanticSpace:"RAW_EXECUTION",sourceHistoryHash:h1,...over
});

t("D11601 local timestamp converts to Taipei date",()=>assert.equal(localDateFromTimestamp("2021-06-17T06:00:00Z"),"2021-06-17"));
t("D11602 ISO week year boundary assigns 2025-12-29 to 2026-W01",()=>assert.equal(isoWeekKey("2025-12-29"),"2026-W01"));
t("D11603 ISO week year boundary keeps 2026-01-02 in 2026-W01",()=>assert.equal(isoWeekKey("2026-01-02"),"2026-W01"));
t("D11604 monthly period key is exchange-local calendar month",()=>assert.equal(localPeriodKey("2026-01-02","M1"),"2026-01"));
t("D11605 unsupported scale blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({scale:"H2"})).status,"UNKNOWN_BLOCKED"));

t("D11701 full Friday week finalized",()=>assert.equal(buildHigherTimeframeAsOf(base({predictorFreezeAt:"2021-06-18T14:00:00+08:00",observations:obs5})).status,"FINALIZED_AS_OF"));
t("D11702 Thursday remains partial when Friday expected",()=>assert.equal(buildHigherTimeframeAsOf(base()).status,"PARTIAL_AS_OF"));
t("D11703 holiday-shortened week can finalize Thursday",()=>assert.equal(buildHigherTimeframeAsOf(base({expectedEligibleSessions:holidayWeek})).status,"FINALIZED_AS_OF"));
t("D11704 before first due session waits prospectively",()=>assert.equal(buildHigherTimeframeAsOf(base({predictorFreezeAt:"2021-06-13T20:00:00+08:00",observations:[]})).status,"WAITING_PROSPECTIVE"));
t("D11705 missing due Tuesday blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:obs4.filter(x=>x.marketDate!=="2021-06-15")})).status,"DATA_BLOCKED"));
t("D11706 missing future Friday does not block Thursday prefix",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:obs4})).status,"PARTIAL_AS_OF"));
t("D11707 duplicate due session blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[...obs4,obs4[0]]})).status,"DATA_BLOCKED"));
t("D11708 invalid due OHLC blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[bar("2021-06-14",10,8,9,11),...obs4.slice(1)]})).status,"DATA_BLOCKED"));
t("D11709 unfinalized due bar blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[bar("2021-06-14",10,12,9,11,{finalized:false}),...obs4.slice(1)]})).status,"DATA_BLOCKED"));
t("D11710 due bar finalized after freeze blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[...obs4.slice(0,3),bar("2021-06-17",13,15,12,14,{finalizedAt:"2021-06-17T14:30:00+08:00"})]})).status,"DATA_BLOCKED"));
t("D11711 due bar first observable after freeze blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[...obs4.slice(0,3),bar("2021-06-17",13,15,12,14,{firstObservableAt:"2021-06-17T14:30:00+08:00"})]})).status,"DATA_BLOCKED"));
t("D11712 calendar learned after freeze blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({calendarFirstObservableAt:"2021-06-18T00:00:00+08:00"})).status,"UNKNOWN_BLOCKED"));
t("D11713 wrong exchange timezone blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({marketTimezone:"UTC"})).status,"UNKNOWN_BLOCKED"));
t("D11714 mixed-market due bar blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[bar("2021-06-14",10,12,9,11,{market:"TPEX"}),...obs4.slice(1)]})).status,"UNKNOWN_BLOCKED"));
t("D11715 mixed semantic-space due bar blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[bar("2021-06-14",10,12,9,11,{semanticSpace:"TECHNICAL_CONTINUITY"}),...obs4.slice(1)]})).status,"UNKNOWN_BLOCKED"));

t("D11716 future wrong-market Friday cannot contaminate Thursday prefix",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[...obs4,bar("2021-06-18",14,16,13,15,{market:"TPEX"})]})).status,"PARTIAL_AS_OF"));
t("D11717 future invalid-OHLC Friday cannot contaminate Thursday prefix",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[...obs4,bar("2021-06-18",14,10,13,15)]})).status,"PARTIAL_AS_OF"));
t("D11718 future outcome fields cannot contaminate Thursday prefix",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[...obs4,bar("2021-06-18",14,16,13,15,{futureReturn:.2})]})).status,"PARTIAL_AS_OF"));
t("D11719 due outcome field is rejected",()=>assert.equal(buildHigherTimeframeAsOf(base({observations:[...obs4.slice(0,3),bar("2021-06-17",13,15,12,14,{futureReturn:.2})]})).reason,"OUTCOME_FIELD_CONTAMINATION"));

t("D11720 partial aggregate OHLC is deterministic",()=>{const x=buildHigherTimeframeAsOf(base());assert.equal(x.aggregate.open,10);assert.equal(x.aggregate.high,15);assert.equal(x.aggregate.low,9);assert.equal(x.aggregate.close,14);});
t("D11721 Friday completion updates weekly close",()=>assert.equal(buildHigherTimeframeAsOf(base({predictorFreezeAt:"2021-06-18T14:00:00+08:00",observations:obs5})).aggregate.close,15));
t("D11722 true Thursday prefix equals full-history asOf Thursday",()=>{const a=buildHigherTimeframeAsOf(base({observations:obs4}));const b=buildHigherTimeframeAsOf(base({observations:obs5}));assert.equal(a.status,b.status);assert.equal(a.derivedValueHash,b.derivedValueHash);assert.equal(a.derivedIdentityHash,b.derivedIdentityHash);});
t("D11723 expected session from another ISO week blocks",()=>assert.equal(buildHigherTimeframeAsOf(base({expectedEligibleSessions:[...week,"2021-06-21"]})).reason,"EXPECTED_SESSION_PERIOD_MISMATCH"));

t("D11801 calendar revision with same aggregate value is calendar-definition revision",()=>{const oldR=buildHigherTimeframeAsOf(base());const newR=buildHigherTimeframeAsOf(base({calendarVersion:"CAL-2",expectedEligibleSessions:holidayWeek}));assert.equal(classifyDerivedRevision(oldR,newR).status,"CALENDAR_DEFINITION_REVISION");});
t("D11802 source-history change with same aggregate value is provenance-only revision",()=>{const oldR=buildHigherTimeframeAsOf(base());const newR=buildHigherTimeframeAsOf(base({sourceHistoryHash:h2}));assert.equal(classifyDerivedRevision(oldR,newR).status,"PROVENANCE_ONLY_REVISION");});
t("D11803 price correction changing aggregate is derived-value revision",()=>{const oldR=buildHigherTimeframeAsOf(base());const changed=[...obs4.slice(0,3),bar("2021-06-17",13,17,12,16)];const newR=buildHigherTimeframeAsOf(base({sourceHistoryHash:h2,observations:changed}));assert.equal(classifyDerivedRevision(oldR,newR).status,"DERIVED_VALUE_REVISION");});
t("D11804 exact replay is identical",()=>{const x=buildHigherTimeframeAsOf(base());assert.equal(classifyDerivedRevision(x,{...x}).status,"IDENTICAL_REPLAY");});
t("D11805 blocked replay cannot be revision-certified",()=>{const oldR=buildHigherTimeframeAsOf(base());assert.equal(classifyDerivedRevision(oldR,{status:"DATA_BLOCKED"}).status,"UNKNOWN_BLOCKED");});

t("D11806 one primitive correction fanning to three scales counts one root",()=>{const x=revisionRootAccounting([{primitiveRevisionRootIds:["P1"],revisionRepresentationCount:1},{primitiveRevisionRootIds:["P1"],revisionRepresentationCount:1},{primitiveRevisionRootIds:["P1"],revisionRepresentationCount:1}]);assert.equal(x.primitivePriceRevisionRootCount,1);assert.equal(x.effectiveIndependentRevisionRootCount,1);assert.equal(x.rawRevisionRepresentationCount,3);});
t("D11807 primitive and calendar roots remain two distinct revision roots",()=>{const x=revisionRootAccounting([{primitiveRevisionRootIds:["P1"],calendarRevisionRootIds:["C1"],revisionRepresentationCount:3}]);assert.equal(x.effectiveIndependentRevisionRootCount,2);});
t("D11808 three scale representations from one root cannot claim three independent votes",()=>assert.equal(validateNoRevisionVoteInflation({receipts:[{primitiveRevisionRootIds:["P1"],revisionRepresentationCount:3}],claimedIndependentVotes:3}).status,"REVISION_FANOUT_VOTE_INFLATION"));

console.log(`SUMMARY ${p}/36 PASS`);
