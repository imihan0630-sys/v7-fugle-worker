const base=process.env.V7_BASE_URL||'https://fugle-test.imihan0630.workers.dev';
const token=process.env.V7_ADMIN_TOKEN;
if(!token) throw new Error('Missing V7_ADMIN_TOKEN');
const res=await fetch(base+'/api/scan-preview',{method:'POST',headers:{'x-admin-token':token,'content-type':'application/json'},body:JSON.stringify({marketDate:'2026-09-17'})});
const text=await res.text();
if(!res.ok) throw new Error('scan-preview '+res.status+': '+text);
const data=JSON.parse(text);
console.log(JSON.stringify({ok:true,version:data.version,scanDate:data.scanDate,planDate:data.planDate,selectedCount:data.selectedCount,stocks:data.stocks,diagnostics:data.diagnostics},null,2));
