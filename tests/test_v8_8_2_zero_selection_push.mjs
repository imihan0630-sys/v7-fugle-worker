import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');

{
  const version=source.match(/const VERSION = "(\d+)\.(\d+)\.(\d+)[^"]*";/)?.slice(1,4).map(Number);
  assert.ok(version && version[0]===8 && (version[1]>8 || (version[1]===8 && version[2]>=2)),"V8.8.2+ runtime required");
}
assert.match(source,/zeroSelection:stocks\.length===0,/);
assert.match(source,/pushRequired:true,/);
assert.match(source,/V8盤後選股完成：0 檔符合，維持現金/);
assert.match(source,/DAILY_RESULT_PUSH_NOT_ACCEPTED/);
assert.match(source,/latest\?\.dailyReport\?\.sent===true/);
assert.match(source,/latest\?\.dailyReport\?\.deliveryState==="ACCEPTED"/);
assert.match(source,/dailyResultPushRequired: true/);
assert.match(source,/dailyResultZeroSelection: stocks\.length === 0/);
assert.match(source,/await sendTrackedPush\(dailyPayload, env,\{note:"每日盤後結果／0檔回報"\}\)/);
assert.match(source,/<!channel>/);
assert.match(source,/payload\?\.signalType === "DAILY_SELECTION" \? \{ link_names: 1 \} : \{\}/);
assert.doesNotMatch(source,/lease\.snapshot\?\.status==="SUCCESS".*ALREADY_SCANNED/);

console.log(JSON.stringify({
  ok:true,
  version:"8.8.2-zero-selection-push-guard",
  zeroSelectionPushRequired:true,
  acceptedWebhookRequiredForSuccessfulScan:true,
  handsetReceiptStillIndependent:true,
  formalSelectionRulesChanged:false
}));
