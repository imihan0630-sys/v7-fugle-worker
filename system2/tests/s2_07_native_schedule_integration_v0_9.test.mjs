import assert from "node:assert/strict";
import {
  parseCorporateActionNativeScheduleV0_9,
  evaluateNativeScheduleIntegrationV0_9,
  summarizeNativeScheduleIntegrationV0_9,
} from "../runtime/s2_07_native_schedule_integration_v0_9.mjs";

const sessions=["2026-04-01","2026-04-09","2026-04-13","2026-04-20"];
const tpexDetail='<table><tr><th>停止買賣日期:</th><td>115/04/01</td></tr><tr><th>恢復買賣日期:</th><td>115/04/13</td></tr></table>';
const schedule=parseCorporateActionNativeScheduleV0_9({
  sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",market:"TPEX",rawDetail:tpexDetail,
  effectiveDate:"2026-04-13",eventVersionId:"S2-CA-EVENT:"+"a".repeat(64),sourceRowHash:"b".repeat(64),
});
assert.equal(schedule.nativeScheduleIntervalCertified,true);
assert.equal(schedule.stopTradingStart,"2026-04-01");
assert.equal(schedule.resumeTradingDate,"2026-04-13");
assert.equal(schedule.scheduleSourceSemantics,"TPEX_DETAIL_EXPLICIT_LABELS");
assert.equal(schedule.nearestPriorDateInferenceUsed,false);

const event={market:"TPEX",symbol:"5381",family:"CAPITAL_REDUCTION",effectiveDate:"2026-04-13"};
const ready=evaluateNativeScheduleIntegrationV0_9({
  event,promotion:{state:"PROMOTION_EVIDENCE_READY_BOUNDED"},marketSessions:sessions,schedule,
});
assert.equal(ready.state,"BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY");
assert.equal(ready.boundedNativeSymbolSessionEvidenceReady,true);
assert.equal(ready.rawA1LineageBound,false);
assert.equal(ready.technicalContinuityCertified,false);
assert.equal(ready.selectionAuthority,false);

const twse=parseCorporateActionNativeScheduleV0_9({
  sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",market:"TWSE",rawDetail:"1563  ,20260826",
  effectiveDate:"2026-09-07",eventVersionId:"S2-CA-EVENT:"+"c".repeat(64),sourceRowHash:"d".repeat(64),
});
assert.equal(twse.nativeScheduleIntervalCertified,false);
assert.equal(twse.stopTradingStart,null);
assert.ok(twse.blockers.includes("NATIVE_SCHEDULE_DETAIL_NOT_SELF_DESCRIBING"));

const mismatch=parseCorporateActionNativeScheduleV0_9({
  sourceId:"TPEX_PAR_VALUE_CHANGE_REFERENCE",market:"TPEX",
  rawDetail:'<table><tr><th>停止買賣日期:</th><td>115/04/09</td></tr><tr><th>恢復買賣日期:</th><td>115/04/21</td></tr></table>',
  effectiveDate:"2026-04-20",eventVersionId:"S2-CA-EVENT:"+"e".repeat(64),sourceRowHash:"f".repeat(64),
});
assert.equal(mismatch.nativeScheduleIntervalCertified,false);
assert.ok(mismatch.blockers.includes("NATIVE_RESUME_DATE_EVENT_MISMATCH"));

const noPromotion=evaluateNativeScheduleIntegrationV0_9({
  event,promotion:{state:"PROMOTION_EVIDENCE_BLOCKED"},marketSessions:sessions,schedule,
});
assert.equal(noPromotion.boundedNativeSymbolSessionEvidenceReady,false);
assert.ok(noPromotion.blockers.includes("EVENT_LINKAGE_PROMOTION_NOT_READY"));

const noSession=evaluateNativeScheduleIntegrationV0_9({
  event,promotion:{state:"PROMOTION_EVIDENCE_READY_BOUNDED"},
  marketSessions:sessions.filter(x=>x!=="2026-04-13"),schedule,
});
assert.equal(noSession.boundedNativeSymbolSessionEvidenceReady,false);
assert.ok(noSession.blockers.includes("RESUME_MARKET_SESSION_NOT_VERIFIED"));

const noProv=parseCorporateActionNativeScheduleV0_9({
  sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",market:"TPEX",rawDetail:tpexDetail,
  effectiveDate:"2026-04-13",eventVersionId:null,sourceRowHash:null,
});
assert.equal(noProv.nativeScheduleIntervalCertified,false);
assert.ok(noProv.blockers.includes("NATIVE_SCHEDULE_SOURCE_PROVENANCE_MISSING"));

const summary=summarizeNativeScheduleIntegrationV0_9([ready,noPromotion]);
assert.equal(summary.eventCount,2);
assert.equal(summary.promotionReadyCount,1);
assert.equal(summary.nativeScheduleCertifiedCount,2);
assert.equal(summary.boundedNativeSymbolSessionEvidenceReadyCount,1);
assert.equal(summary.noSuspensionCertifiedCount,0);
assert.equal(summary.rawA1LineageBound,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.orderImpact,false);

console.log("S2-07 native schedule integration V0.9 tests PASS");
