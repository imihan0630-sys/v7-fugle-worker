const origin='https://fugle-test.imihan0630.workers.dev';
const token=process.env.V7_ADMIN_TOKEN;
if(!token) throw new Error('Missing V7_ADMIN_TOKEN');

async function admin(path,options={}){
  const res=await fetch(origin+path,{...options,headers:{'x-admin-token':token,'content-type':'application/json','accept':'application/json'},signal:AbortSignal.timeout(180000)});
  const text=await res.text();
  let data; try{data=JSON.parse(text)}catch{throw new Error(path+' non-JSON '+res.status+' '+text.slice(0,300))}
  if(!res.ok) throw new Error(path+' '+res.status+' '+String(data.error||text).slice(0,800));
  return data;
}

const staged=await admin('/api/scan/stage-selection',{method:'POST',body:JSON.stringify({marketDate:'2026-09-29'})});
console.log(JSON.stringify({stageSelection:staged},null,2));
if(staged?.ok!==true || staged?.selectionPersisted!==true || staged?.scanDate!=='2026-09-29') throw new Error('9/29 staged selection was not persisted');

const latest=await admin('/api/scan/status');
console.log(JSON.stringify({latest:{version:latest.version,scanDate:latest.scanDate,status:latest.status,selectedCount:latest.selectedCount,formalSymbols:(latest.stocks||[]).map(x=>x.symbol),hybridSymbols:(latest.hybridStocks||[]).map(x=>x.symbol),hybridWatchSymbols:(latest.hybridWatchStocks||[]).map(x=>x.symbol),planDate:(latest.stocks||[])[0]?.planDate||null,config:latest.config,pipeline:latest.pipeline}},null,2));
if(latest?.scanDate!=='2026-09-29') throw new Error('LAST_SCAN_KEY still not 9/29 after staged selection');
