import assert from "node:assert/strict";
import {
  MOPSOV_EMPTY_MONTH_FROZEN_SIGNATURE_V0_2,
  certifyMopsovEmptyMonthObservationV0_2,
  certifyMopsovPositiveControlV0_2,
  summarizeMopsovEmptyMonthCertificationV0_2,
} from "../runtime/mopsov_empty_month_certification_v0_2.mjs";

const sig=MOPSOV_EMPTY_MONTH_FROZEN_SIGNATURE_V0_2;

function emptyObs(id="E"){
  return {
    id,
    httpStatus:200,
    contentType:"text/html; charset=UTF-8",
    bytes:sig.payloadBytes,
    payloadSha256:sig.payloadSha256,
    rowCount:0,
    visibleText:sig.normalizedVisibleText,
    matchedErrorPhrases:[],
    structure:{...sig.structure},
  };
}
function positiveObs(id="P"){
  return {
    id,
    httpStatus:200,
    contentType:"text/html; charset=UTF-8",
    bytes:9000,
    payloadSha256:"positive-"+id,
    rowCount:3,
    visibleText:"公開資訊觀測站 本資料由 (上市公司) 2467 志聖 公司提供",
    matchedErrorPhrases:[],
    structure:{hasHtml:true,hasBody:true,hasForm:true,hasTable:true,hasMops:true,hasStockCode:true},
  };
}

assert.equal(certifyMopsovEmptyMonthObservationV0_2(emptyObs()).pass,true);
assert.equal(certifyMopsovPositiveControlV0_2(positiveObs()).pass,true);

for(const [field,value] of [
  ["httpStatus",500],
  ["bytes",2541],
  ["payloadSha256","drift"],
  ["rowCount",1],
  ["visibleText","公開資訊觀測站 資料庫中查無其他資料"],
]){
  const x=emptyObs();
  x[field]=value;
  assert.equal(certifyMopsovEmptyMonthObservationV0_2(x).pass,false,field+" drift must fail closed");
}
{
  const x=emptyObs();
  x.structure.hasForm=true;
  assert.equal(certifyMopsovEmptyMonthObservationV0_2(x).pass,false);
}
{
  const x=emptyObs();
  x.matchedErrorPhrases=["系統發生錯誤"];
  assert.equal(certifyMopsovEmptyMonthObservationV0_2(x).pass,false);
}
{
  const x=positiveObs();
  x.rowCount=0;
  assert.equal(certifyMopsovPositiveControlV0_2(x).pass,false);
}
{
  const x=positiveObs();
  x.payloadSha256=sig.payloadSha256;
  assert.equal(certifyMopsovPositiveControlV0_2(x).pass,false);
}

const summary=summarizeMopsovEmptyMonthCertificationV0_2({
  emptyObservations:[emptyObs("E1"),emptyObs("E2"),emptyObs("E3"),emptyObs("E4")],
  positiveObservations:[positiveObs("P1"),positiveObs("P2"),positiveObs("P3")],
});
assert.equal(summary.emptyMonthSemanticsCertified,true);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.noEventMayBeClaimed,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.system1RuntimeUsed,false);

const blocked=summarizeMopsovEmptyMonthCertificationV0_2({
  emptyObservations:[emptyObs("E1"),emptyObs("E2"),emptyObs("E3"),{...emptyObs("E4"),payloadSha256:"drift"}],
  positiveObservations:[positiveObs("P1"),positiveObs("P2"),positiveObs("P3")],
});
assert.equal(blocked.emptyMonthSemanticsCertified,false);

console.log("mopsov empty-month certification v0.2 tests PASS");
