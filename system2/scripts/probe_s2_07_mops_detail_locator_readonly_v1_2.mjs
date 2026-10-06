import {spawnSync} from "node:child_process";

const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
function fetchAnnual(){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-S2-07-MOPS-Detail-Locator/1.2",
    "--data-urlencode","firstin=1","--data-urlencode","step=1","--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id=4806","--data-urlencode","year=115","--data-urlencode","month=all",
    "--data-urlencode","b_date=","--data-urlencode","e_date=",MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error||p.status!==0)throw new Error(String(p.stderr||p.error||"MOPS curl failure").slice(0,500));
  return p.stdout;
}
function stripHtml(value){
  return String(value||"").replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/\s+/g," ").trim();
}
function attrs(raw,name){
  const out=[];
  const re=new RegExp(name+"\\s*=\\s*['\"]([^'\"]*)['\"]","gi");
  for(const m of raw.matchAll(re))out.push(m[1]);
  return out;
}
function inputPairs(raw){
  const out=[];
  for(const m of raw.matchAll(/<input\b[^>]*>/gi)){
    const tag=m[0];
    const name=tag.match(/\bname\s*=\s*['\"]([^'\"]*)['\"]/i)?.[1]||null;
    const value=tag.match(/\bvalue\s*=\s*['\"]([^'\"]*)['\"]/i)?.[1]||null;
    if(name)out.push({name,value});
  }
  return out;
}
const html=fetchAnnual();
const targets=[
  ["2026-08-07","16:45:21","3"],
  ["2026-08-28","15:14:07","1"],
  ["2026-08-28","15:14:20","2"],
  ["2026-09-07","16:37:39","1"],
  ["2026-09-07","16:37:58","2"],
  ["2026-09-08","17:03:24","1"],
];
const rows=[...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((m)=>m[0]);
const results=[];
for(const [date,time,seqNo] of targets){
  const rocYear=String(Number(date.slice(0,4))-1911);
  const rocDate=rocYear+"/"+date.slice(5,7)+"/"+date.slice(8,10);
  const row=rows.find((raw)=>{
    const txt=stripHtml(raw);
    return txt.includes("4806")&&txt.includes(rocDate)&&txt.includes(time);
  })||null;
  results.push({
    versionKey:[date,time,seqNo].join("|"),
    rowObserved:Boolean(row),
    rowText:row?stripHtml(row).slice(0,1600):null,
    inputPairs:row?inputPairs(row):[],
    hrefs:row?attrs(row,"href"):[],
    onClicks:row?attrs(row,"onclick"):[],
    forms:row?attrs(row,"action"):[],
    rawRowHtml:["2026-08-07|16:45:21|3","2026-08-28|15:14:20|2","2026-09-08|17:03:24|1"].includes([date,time,seqNo].join("|"))
      ?row.slice(0,8000):null,
  });
}
console.log(JSON.stringify({
  result:"S2_07_MOPS_DETAIL_LOCATOR_V1_2_COMPLETE",
  targetCount:targets.length,
  observedCount:results.filter(x=>x.rowObserved).length,
  rows:results,
  boundaries:{readOnly:true,historyMutationPerformed:false,selectionAuthority:false,system1RuntimeUsed:false},
},null,2));
