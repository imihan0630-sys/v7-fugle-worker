import assert from "node:assert/strict";
import {buildBarVisitOccupancy,exactDwellEligibility} from "./pattern_time_at_price_inventory_v0_1.mjs";
let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const freeze="2026-10-06T10:00:00+08:00";
const bin={lower:100,upper:102};

t("TP01",()=>{const r=buildBarVisitOccupancy({bars:[{low:99,high:103,completed:true,completedAt:"2026-10-06T09:15:00+08:00"}],bin,predictorFreezeAt:freeze});assert.equal(r.visitedBarCount,1);assert.equal(r.exactDwellSeconds,null);});
t("TP02",()=>{const r=buildBarVisitOccupancy({bars:[{low:99,high:103,completed:true,completedAt:"2026-10-06T09:15:00+08:00"}],bin,predictorFreezeAt:freeze});assert.equal(r.exactDwellClaimAllowed,false);});
t("TP03",()=>{const r=buildBarVisitOccupancy({bars:[{low:99,high:101,completed:true,completedAt:"2026-10-06T09:15:00+08:00"},{low:101,high:104,completed:true,completedAt:"2026-10-06T09:30:00+08:00"}],bin,predictorFreezeAt:freeze});assert.equal(r.visitedBarCount,2);assert.equal(r.maxConsecutiveVisitedBars,2);});
t("TP04",()=>{const r=buildBarVisitOccupancy({bars:[{low:99,high:101,completed:false,completedAt:"2026-10-06T09:45:00+08:00"}],bin,predictorFreezeAt:freeze});assert.equal(r.eligibleBarCount,0);});
t("TP05",()=>{const r=buildBarVisitOccupancy({bars:[{low:99,high:101,completed:true,completedAt:"2026-10-06T10:15:00+08:00"}],bin,predictorFreezeAt:freeze});assert.equal(r.eligibleBarCount,0);});
t("TP06",()=>{const r=buildBarVisitOccupancy({bars:[{low:null,high:101,completed:true,completedAt:"2026-10-06T09:15:00+08:00"}],bin,predictorFreezeAt:freeze});assert.equal(r.status,"DATA_BLOCKED");});
t("TP07",()=>{assert.equal(exactDwellEligibility({dataKind:"OHLC_BAR",timestampCoverageComplete:true,statePersistenceRuleFrozen:true,replaySafe:true}).status,"NOT_AVAILABLE");});
t("TP08",()=>{assert.equal(exactDwellEligibility({dataKind:"TRADE_EVENT_SEQUENCE",timestampCoverageComplete:false,statePersistenceRuleFrozen:true,replaySafe:true}).status,"DATA_BLOCKED");});
t("TP09",()=>{assert.equal(exactDwellEligibility({dataKind:"TRADE_EVENT_SEQUENCE",timestampCoverageComplete:true,statePersistenceRuleFrozen:false,replaySafe:true}).reason,"STATE_DURATION_RULE_UNFROZEN");});
t("TP10",()=>{assert.equal(exactDwellEligibility({dataKind:"QUOTE_MID_SEQUENCE",timestampCoverageComplete:true,statePersistenceRuleFrozen:true,replaySafe:true}).status,"EXACT_DWELL_ELIGIBLE");});
console.log(`SUMMARY ${pass}/10 PASS`);
