import assert from 'node:assert/strict';
const origin='https://fugle-test.imihan0630.workers.dev';
assert.ok(process.env.V7_ADMIN_TOKEN,'Normal V7_ADMIN_TOKEN authorization is required');
const headers={'x-admin-token':process.env.V7_ADMIN_TOKEN,'content-type':'application/json'};
const getConfig=async()=>{
  const response=await fetch(origin+'/api/config',{headers,signal:AbortSignal.timeout(20000)});
  assert.equal(response.ok,true,'Cannot read original targets with normal admin authorization');
  return response.json();
};
const before=await getConfig();
const verificationResponse=await fetch(origin+'/api/three-min/verify',{method:'POST',headers,signal:AbortSignal.timeout(40000)});
if([401,403].includes(verificationResponse.status)) throw new Error('管理員或3Min讀回授權失敗；停止，不替換憑證');
const result=await verificationResponse.json();
console.log(JSON.stringify({existingThreeMinReadback:result,noNewScanOrExternalWrite:true}));
assert.equal(verificationResponse.ok,true);
assert.equal(result.noSelectionOrExternalWrite,true);
const after=await getConfig();
assert.deepEqual(after,before,'Readback verification must not modify monitoring plans');
if(before.totalCapital && before.stocks.every(stock=>stock.positionStage==='NONE')) {
  const capital=before.totalCapital+100000;
  const previewResponse=await fetch(origin+'/api/capital',{method:'POST',headers,body:JSON.stringify({totalCapital:capital,preview:true}),signal:AbortSignal.timeout(20000)});
  const preview=await previewResponse.json();
  assert.equal(previewResponse.ok,true);
  assert.equal(preview.preview,true);
  assert.equal(preview.totalCapital,capital);
  assert.ok(preview.remainingCash>=0);
  assert.ok(preview.stocks.reduce((sum,stock)=>sum+stock.totalAllocation,0)<=capital);
  assert.deepEqual(preview.stocks.map(stock=>stock.symbol),before.stocks.map(stock=>stock.symbol));
  assert.ok(preview.stocks.every(stock=>Number.isInteger(stock.firstShares) && Number.isInteger(stock.secondShares)));
  assert.deepEqual(await getConfig(),before,'Capital preview must not save or overwrite plans');
  console.log(JSON.stringify({capitalPreviewVerified:true,originalCapital:before.totalCapital,testPreviewCapital:capital,saved:false,stocksUnchanged:true}));
}
const pageResponse=await fetch(origin+'/',{signal:AbortSignal.timeout(20000)});
const page=await pageResponse.text();
assert.equal(pageResponse.ok,true);
for(const stock of before.stocks) assert.ok(page.includes(stock.name) && page.includes(stock.symbol),'Imported plans must be visible before intraday quotes arrive');
console.log('PASS: unchanged monitoring targets, capital preview and visible imported plans');
assert.equal(result.verified,true,'Readback returned no exact matching3Min plan; inspect the safe schema summary, do not re-send');
