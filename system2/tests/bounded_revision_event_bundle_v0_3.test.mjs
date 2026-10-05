import assert from "node:assert/strict";
import {
  classifyBoundedRevisionEventBundleV0_3,
  summarizeBoundedRevisionEventBundlesV0_3,
} from "../runtime/bounded_revision_event_bundle_v0_3.mjs";

const exact={transportReady:true,parserComplete:true,noPaginationHint:true,exactKeysetReconciliation:true,years:[2025,2026]};
const baseEvent={
  eventKey:"X|1234|2026-09-01|v1",
  sourceId:"X",
  symbol:"1234",
  actionFamilyId:"CAPITAL_REDUCTION",
  effectiveDate:"2026-09-01",
  previousEffectiveDate:null,
  officialSubtype:"現金減資",
};
const row=(date,time,seqNo,rowText,hint=false)=>({date,time,seqNo,rowText,correctionOrCancellationHint:hint});

const noRevision=classifyBoundedRevisionEventBundleV0_3({
  event:baseEvent,queryIntegrity:exact,
  familyRows:[
    row("2026-03-01","10:00:00","1","1234 A 115/03/01 10:00:00 董事會決議辦理現金減資"),
    row("2026-07-01","10:00:00","1","1234 A 115/07/01 10:00:00 董事長訂定減資換發股票基準日及減資換股作業計畫"),
    row("2026-07-15","10:00:00","1","1234 A 115/07/15 10:00:00 辦理現金減資完成資本額變更登記"),
  ],
});
assert.equal(noRevision.state,"EVENT_BUNDLE_NO_REVISION_OR_CANCELLATION_QUERY_CERTIFIED");
assert.equal(noRevision.operationalAnchorCount>=1,true);

const correction=classifyBoundedRevisionEventBundleV0_3({
  event:baseEvent,queryIntegrity:exact,
  familyRows:[
    row("2026-07-01","10:00:00","1","1234 A 115/07/01 10:00:00 訂定減資換股作業計畫及減資換發股票基準日"),
    row("2026-07-02","10:00:00","2","1234 A 115/07/02 10:00:00 更正訂定減資換股作業計畫及減資換發股票基準日",true),
  ],
});
assert.equal(correction.state,"EVENT_BUNDLE_AMENDMENT_OBSERVED");
assert.equal(correction.explicitCorrectionRowCount,1);
assert.equal(correction.pairedAmendmentCount,1);

const bracketedCorrection=classifyBoundedRevisionEventBundleV0_3({
  event:baseEvent,queryIntegrity:exact,
  familyRows:[
    row("2026-07-01","10:00:00","1","1234 A 115/07/01 10:00:00 訂定減資換股作業計畫及減資換發股票基準日"),
    row("2026-07-02","10:00:00","2","1234 A 115/07/02 10:00:00 [更正其他應敘明事項]訂定減資換股作業計畫及減資換發股票基準日",true),
  ],
});
assert.equal(bracketedCorrection.state,"EVENT_BUNDLE_AMENDMENT_OBSERVED");
assert.equal(bracketedCorrection.pairedAmendmentCount,1);

const semantic=classifyBoundedRevisionEventBundleV0_3({
  event:baseEvent,queryIntegrity:exact,
  familyRows:[
    row("2026-07-01","10:00:00","1","1234 A 115/07/01 10:00:00 減資換發股票作業計畫及減資換發基準日"),
    row("2026-07-03","10:00:00","2","1234 A 115/07/03 10:00:00 更新減資換發股票作業計畫及減資換發基準日"),
  ],
});
assert.equal(semantic.state,"EVENT_BUNDLE_AMENDMENT_OBSERVED");
assert.equal(semantic.semanticAmendmentRowCount,1);

const subsidiaryExcluded=classifyBoundedRevisionEventBundleV0_3({
  event:baseEvent,queryIntegrity:exact,
  familyRows:[
    row("2026-06-01","10:00:00","1","1234 A 115/06/01 10:00:00 代子公司XX公司董事會決議辦理現金減資"),
    row("2026-07-01","10:00:00","1","1234 A 115/07/01 10:00:00 董事長訂定減資換發股票基準日及減資換股作業計畫"),
  ],
});
assert.equal(subsidiaryExcluded.delegatedSubsidiaryExcludedCount,1);
assert.equal(subsidiaryExcluded.state,"EVENT_BUNDLE_NO_REVISION_OR_CANCELLATION_QUERY_CERTIFIED");

const priorCycleExcluded=classifyBoundedRevisionEventBundleV0_3({
  event:{...baseEvent,previousEffectiveDate:"2026-04-01"},queryIntegrity:exact,
  familyRows:[
    row("2026-03-01","10:00:00","1","1234 A 115/03/01 10:00:00 更正減資換股作業計畫",true),
    row("2026-07-01","10:00:00","1","1234 A 115/07/01 10:00:00 董事長訂定減資換發股票基準日及減資換股作業計畫"),
  ],
});
assert.equal(priorCycleExcluded.amendmentRowCount,0);
assert.equal(priorCycleExcluded.state,"EVENT_BUNDLE_NO_REVISION_OR_CANCELLATION_QUERY_CERTIFIED");

const badIntegrity=classifyBoundedRevisionEventBundleV0_3({
  event:baseEvent,
  queryIntegrity:{...exact,exactKeysetReconciliation:false},
  familyRows:[row("2026-07-01","10:00:00","1","1234 A 115/07/01 10:00:00 董事長訂定減資換發股票基準日及減資換股作業計畫")],
});
assert.equal(badIntegrity.state,"QUERY_INTEGRITY_NOT_CERTIFIED");

const parValue=classifyBoundedRevisionEventBundleV0_3({
  event:{...baseEvent,sourceId:"PV",actionFamilyId:"PAR_VALUE_CHANGE",officialSubtype:null},
  queryIntegrity:exact,
  familyRows:[
    row("2026-06-01","10:00:00","1","1234 A 115/06/01 10:00:00 董事會決議通過股票面額變更之換發股票基準日"),
    row("2026-06-01","10:10:00","2","1234 A 115/06/01 10:10:00 董事會決議通過股票面額變更之換發股票作業計畫"),
    row("2026-07-01","08:00:00","1","1234 A 115/07/01 08:00:00 公告本公司股票面額變更相關事宜"),
  ],
});
assert.equal(parValue.state,"EVENT_BUNDLE_NO_REVISION_OR_CANCELLATION_QUERY_CERTIFIED");

const summary=summarizeBoundedRevisionEventBundlesV0_3([noRevision,correction,semantic,subsidiaryExcluded,priorCycleExcluded,parValue]);
assert.equal(summary.eventBundleLinkageCoverageComplete,true);
assert.equal(summary.lowVolumeIssuerCorrectionSearchCoverageComplete,true);
assert.equal(summary.lowVolumeIssuerCancellationSearchCoverageComplete,true);
assert.equal(summary.boundedRevisionHistoryCoverageComplete,false);
assert.equal(summary.cancellationHistoryComplete,false);
assert.equal(summary.revisionCoverageComplete,false);

console.log("bounded revision event bundle V0.3 tests PASS");
