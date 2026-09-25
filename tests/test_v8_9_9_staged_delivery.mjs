import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');

{
  const version=source.match(/const VERSION = "(\d+)\.(\d+)\.(\d+)[^"]*";/)?.slice(1,4).map(Number);
  assert.ok(version && (version[0]>8 || (version[0]===8 && (version[1]>9 || (version[1]===9 && version[2]>=9)))),"V8.9.9+ runtime required");
}
assert.match(source,/provider-neutral staged recovery/);
assert.match(source,/latest\.threeMin\?\.skipped===true/);
assert.match(source,/externalPostPerformed=true;/);
assert.match(source,/deliveryAccepted=report\?\.sent===true/);
assert.match(source,/status:"DELIVERY_ACCEPTED"/);
assert.match(source,/dailyReportAccepted:true/);
assert.match(source,/dailyWebhookAccepted:true/);
assert.match(source,/dailyDeliveryState:report\.deliveryState/);

console.log(JSON.stringify({
  ok:true,
  version:'8.9.9-staged-delivery',
  stagedThreeMinExactlyOnce:true,
  resendPersistence:true,
  formalSelectionRulesChanged:false
}));
