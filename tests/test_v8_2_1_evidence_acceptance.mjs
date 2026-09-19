import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {deriveEvidenceAcceptance,CORE_OPERATION_RECEIPT_TYPES};"
).toString("base64")+"#"+Date.now());

const empty=mod.deriveEvidenceAcceptance({
  latest:{pipeline:{}},
  config:{stocks:[]},
  outbox:{configured:true,counts:{},unresolved:0,staleUnresolved:0},
  receipts:{total:0,dailySelection:0,signalTypes:[],dailyResultTypes:{}},
  externalStats:{days:0},
  positionAudit:null,
  ledger:null
});
for(const rule of [17,18,19,27,28,29]) assert.equal(empty[rule].complete,false,"rule "+rule+" must remain pending without evidence");
assert.deepEqual(mod.CORE_OPERATION_RECEIPT_TYPES,["BUY","ADD","REDUCE","PROFIT_CHECK","SELL","STOP_LOSS"]);
assert.equal(empty[17].progress,"0/6");

const fullSignalTypes=mod.CORE_OPERATION_RECEIPT_TYPES.map(signalType=>({signalType,count:1}));
const full=mod.deriveEvidenceAcceptance({
  latest:{pipeline:{selectionCompleted:true,configVerified:true,threeMinVerified:true,dailyReportAccepted:true,complete:true}},
  config:{stocks:[{
    symbol:"3105",positionStage:"FIRST",actualShares:50,averageCost:495.5,firstEntryConfirmedAt:"2026-09-18T01:30:00.000Z"
  }]},
  outbox:{configured:true,counts:{ACCEPTED:8},unresolved:0,staleUnresolved:0},
  receipts:{total:8,dailySelection:2,signalTypes:fullSignalTypes,dailyResultTypes:{SELECTED:1,ZERO_MATCH:1}},
  externalStats:{days:3},
  positionAudit:{noPlanChanges:true,updatedAt:"2026-09-18T01:31:00.000Z"},
  ledger:null
});
for(const rule of [17,18,19,27,28,29]) assert.equal(full[rule].complete,true,"rule "+rule+" should auto-complete with real evidence");
assert.equal(full[17].progress,"6/6");
assert.equal(full[19].holdingCount,1);
assert.equal(full[19].knownHoldingShares,1);
assert.equal(full[28].comparisonDays,3);

const persisted=mod.deriveEvidenceAcceptance({
  latest:{pipeline:{selectionCompleted:true,configVerified:true,threeMinVerified:true,dailyReportAccepted:true,complete:true}},
  config:{stocks:[]},
  outbox:{configured:true,counts:{},unresolved:0,staleUnresolved:0},
  receipts:{total:0,dailySelection:0,signalTypes:[],dailyResultTypes:{}},
  externalStats:{days:0},
  positionAudit:null,
  ledger:{rules:{
    "17":{acceptedAt:"2026-09-20T00:00:00Z"},
    "18":{acceptedAt:"2026-09-20T00:00:00Z"},
    "19":{acceptedAt:"2026-09-20T00:00:00Z"},
    "27":{acceptedAt:"2026-09-20T00:00:00Z"},
    "28":{acceptedAt:"2026-09-20T00:00:00Z"}
  }}
});
for(const rule of [17,18,19,27,28]) {
  assert.equal(persisted[rule].currentComplete,false);
  assert.equal(persisted[rule].complete,true,"rule "+rule+" must not regress after historical acceptance");
}
assert.equal(persisted[29].complete,true,"aggregate rule 29 should complete once all evidence rules were permanently accepted and pipeline is healthy");

for(const marker of [
  'const VERSION = "8.2.1-evidence-driven-acceptance";',
  'const EVIDENCE_ACCEPTANCE_KEY="V7_REQUIREMENT_ACCEPTANCE_V1";',
  'url.pathname==="/api/acceptance/reconcile"',
  'await refreshEvidenceAcceptance(env,"push-receipt")',
  'await refreshEvidenceAcceptance(env,"position-reconciliation")',
  'await refreshEvidenceAcceptance(env,"external-validation")',
  'rule28:"至少3個不同交易日的外部App交叉比對"'
]) assert.ok(source.includes(marker),marker);

console.log(JSON.stringify({
  ok:true,
  version:"8.2.1-evidence-driven-acceptance",
  coreOperationReceipts:6,
  monotonicAcceptanceLedger:true,
  evidenceRules:[17,18,19,27,28,29],
  noSyntheticAcceptance:true
}));
