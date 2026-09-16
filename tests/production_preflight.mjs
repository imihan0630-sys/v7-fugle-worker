// 正常管理員權限預檢：不寫入、不掃描、不推播，不輸出任何金鑰或內部URL。
if (!process.env.V7_ADMIN_TOKEN) {
  console.log('ADMIN_AUTH_UNAVAILABLE: GitHub Actions尚未設定V7_ADMIN_TOKEN；真實盤後掃描及資金API尚不能驗收。');
  process.exit(0);
}
const response=await fetch('https://fugle-test.imihan0630.workers.dev/api/finalize/status',{
  headers:{'x-admin-token':process.env.V7_ADMIN_TOKEN},signal:AbortSignal.timeout(20000)
});
if ([401,403].includes(response.status)) throw new Error('ADMIN_AUTH_DENIED：停止管理員操作，不能用其他憑證代替');
if (!response.ok) throw new Error(`管理員唯讀預檢HTTP ${response.status}`);
const data=await response.json();
console.log(JSON.stringify({adminAuthorized:true,version:data.version,testMode:data.readiness?.testMode,
  checks:data.readiness?.checks,history:data.readiness?.history,
  institutionCompleteDays:data.readiness?.institution?.completeDays}));
console.log('Read-only preflight; not a completed repair, scan, import or phone-delivery acceptance.');
