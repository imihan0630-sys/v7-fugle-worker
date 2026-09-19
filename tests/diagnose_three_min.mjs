import assert from 'node:assert/strict';

const origin='https://fugle-test.imihan0630.workers.dev';
assert.ok(process.env.V7_ADMIN_TOKEN,'Normal V7_ADMIN_TOKEN authorization is required');
const headers={'x-admin-token':process.env.V7_ADMIN_TOKEN};

const response=await fetch(origin+'/api/scan/status',{headers,signal:AbortSignal.timeout(20000)});
if([401,403].includes(response.status)) throw new Error('管理員授權未成功；停止，不替換憑證');
assert.equal(response.ok,true,'Cannot read existing after-market scan status');
const scan=await response.json();

console.log(JSON.stringify({
  rule26HistoricalDiagnostic:{
    version:scan.version,
    scanDate:scan.scanDate,
    generatedAt:scan.generatedAt,
    selectedCount:scan.selectedCount,
    threeMin:{
      sent:scan.threeMin?.sent ?? null,
      simulated:scan.threeMin?.simulated ?? null,
      verified:scan.threeMin?.verified ?? null,
      skipped:scan.threeMin?.skipped ?? null,
      httpStatus:scan.threeMin?.httpStatus ?? null,
      error:scan.threeMin?.error ?? null,
      reason:scan.threeMin?.reason ?? null,
      verificationNote:scan.threeMin?.verificationNote ?? null
    },
    payload:{
      schemaVersion:scan.threeMinPayload?.schemaVersion ?? null,
      scanDate:scan.threeMinPayload?.scanDate ?? null,
      planDate:scan.threeMinPayload?.planDate ?? null,
      stockCount:Array.isArray(scan.threeMinPayload?.stocks)?scan.threeMinPayload.stocks.length:null
    },
    pipeline:scan.pipeline,
    requirement26:scan.diagnostics?.requirements30?.requirement26 ?? null
  },
  readOnly:true,noSelection:true,noThreeMinPost:true,noPush:true
}));
