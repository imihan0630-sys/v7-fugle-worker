import { createHash } from "node:crypto";

const sha=(x)=>createHash("sha256").update(String(x)).digest("hex");
const base="https://www.tpex.org.tw";
const pageUrl=base+"/zh-tw/mainboard/listed/delisted.html";
const newListedPageUrl=base+"/zh-tw/mainboard/applying/status/new-listed.html";
const currentUrl=base+"/openapi/v1/mopsfin_t187ap03_O";
const delistedApiBase=base+"/www/zh-tw/company/deListed";
const delistedApiCandidates=[
  delistedApiBase,
  delistedApiBase+"?code=&date=&reason=-1",
  delistedApiBase+"?code=&date=2026&reason=-1",
  delistedApiBase+"?code=&date=115&reason=-1",
  delistedApiBase+"?code=&date=&reason=-1&response=json",
];

async function fetchRaw(url){
  try{
    const r=await fetch(url,{
      headers:{
        accept:"application/json,text/html,text/javascript,application/javascript,text/plain,*/*",
        "user-agent":"Mozilla/5.0 D19-TPEx-Universe-Research/0.2",
        referer:pageUrl,
      },
      redirect:"follow",
      signal:AbortSignal.timeout(45000),
    });
    const text=await r.text();
    return {url,status:r.status,ok:r.ok,contentType:r.headers.get("content-type"),text};
  }catch(error){
    return {url,error:String(error?.message||error),text:""};
  }
}
function summarize(raw){
  let json=null;
  try{json=JSON.parse(raw.text);}catch{}
  return {
    url:raw.url,status:raw.status,ok:raw.ok,contentType:raw.contentType,
    length:raw.text.length,hash:sha(raw.text),
    jsonKeys:json&&typeof json==="object"&&!Array.isArray(json)?Object.keys(json):null,
    jsonArrayLength:Array.isArray(json)?json.length:null,
    prefix:raw.text.slice(0,1200),
  };
}
function snippets(text,terms){
  const out=[];
  const lower=text.toLowerCase();
  for(const term of terms){
    let start=0;
    const needle=term.toLowerCase();
    while(true){
      const i=lower.indexOf(needle,start);
      if(i<0)break;
      out.push({term,index:i,text:text.slice(Math.max(0,i-450),Math.min(text.length,i+1000))});
      start=i+needle.length;
      if(out.length>=80)return out;
    }
  }
  return out;
}

const currentRaw=await fetchRaw(currentUrl);
const delistedApiResults=[];
for(const url of delistedApiCandidates)delistedApiResults.push(summarize(await fetchRaw(url)));
const pageRaw=await fetchRaw(pageUrl);
const newListedPageRaw=await fetchRaw(newListedPageUrl);
const scriptUrls=[];
for(const m of pageRaw.text.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)){
  const u=new URL(m[1],pageUrl).href;
  if(u.startsWith(base)&&!scriptUrls.includes(u))scriptUrls.push(u);
}

const newListedPageHints=snippets(newListedPageRaw.text,[
  "tables.init","action:","newlisted","新上櫃","api_pattern","pattern:",
]);
const pageHints=snippets(pageRaw.text,[
  "delisted","終止上櫃","ajax","api","response","tables.js","listed/",
]);

const scripts=[];
for(const url of scriptUrls){
  const raw=await fetchRaw(url);
  const hits=snippets(raw.text,[
    "delisted","終止上櫃","mainboard/listed","api/","response=json","getjson","ajax","api_pattern","company/delisted","pattern:",
  ]);
  scripts.push({
    url,status:raw.status,contentType:raw.contentType,length:raw.text.length,
    hash:sha(raw.text),hitCount:hits.length,hits:hits.slice(0,40),
  });
}

console.log(JSON.stringify({
  result:"TPEX_UNIVERSE_ROUTE_DISCOVERY_V0_2",
  currentProfile:summarize(currentRaw),
  delistedApiResults,
  delistedPage:summarize(pageRaw),
  newListedPage:summarize(newListedPageRaw),
  newListedPageHints,
  pageHints,
  scriptUrlCount:scriptUrls.length,
  scripts,
  formalCoreChanged:false,
  productionChanged:false,
},null,2));
