const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");
const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));
const days=Array.isArray(data?.days)?data.days:[];
const plans=Array.isArray(data?.planRows)?data.planRows:[];
const byDate=new Map();
for(const row of plans){
  const d=String(row?.scan_date||"");
  if(!byDate.has(d))byDate.set(d,[]);
  let stock={};try{stock=JSON.parse(row?.stock_json||"{}")}catch{}
  const ratioRaw=Number(row?.allocation_ratio);
  const ratioPct=Number.isFinite(ratioRaw)?(ratioRaw<=1?ratioRaw*100:ratioRaw):null;
  byDate.get(d).push({
    symbol:String(row?.symbol||""),
    priorityScore:Number.isFinite(Number(row?.priority_score))?Number(row.priority_score):null,
    allocationRatioPct:ratioPct,
    totalAllocation:Number.isFinite(Number(row?.total_allocation))?Number(row.total_allocation):null,
    strategyPool:String(stock?.strategyPool||"")||"LEGACY_COMBINED"
  });
}
const dayMap=new Map(days.map(x=>[String(x?.scan_date||""),x]));
const rows=[];
for(const [scanDate,list] of [...byDate.entries()].sort()){
  const day=dayMap.get(scanDate)||{};
  const groups={};
  for(const p of list)(groups[p.strategyPool]??=[]).push(p);
  const groupRows=[];
  for(const [pool,items] of Object.entries(groups)){
    const sumRatio=items.reduce((s,x)=>s+(Number.isFinite(x.allocationRatioPct)?x.allocationRatioPct:0),0);
    const sumAllocation=items.reduce((s,x)=>s+(Number.isFinite(x.totalAllocation)?x.totalAllocation:0),0);
    const multiNameCapBound=items.filter(x=>items.length>1 && Number.isFinite(x.allocationRatioPct) && x.allocationRatioPct>=34.95);
    groupRows.push({pool,count:items.length,sumAllocationRatioPct:Number(sumRatio.toFixed(2)),
      sumAllocation,multiNameCapBoundSymbols:multiNameCapBound.map(x=>x.symbol),plans:items});
  }
  rows.push({scanDate,totalCapital:Number(day?.total_capital)||null,selectedCount:Number(day?.selected_count)||0,groups:groupRows});
}
const multiNameGroups=rows.flatMap(x=>x.groups.map(g=>({scanDate:x.scanDate,...g}))).filter(g=>g.count>1);
const capBoundGroups=multiNameGroups.filter(g=>g.multiNameCapBoundSymbols.length>0);
console.log(JSON.stringify({
  ok:true,readOnly:true,outcomeFieldsRead:false,
  formalPlanRows:plans.length,planDates:rows.length,
  multiNameGroups:multiNameGroups.length,
  observedMultiNameCapBoundGroups:capBoundGroups.length,
  rows,
  interpretation:"Stored allocation ratios show whether any multi-name group actually hit the 35% cap. This does not prove cap redistribution would improve outcomes."
},null,2));