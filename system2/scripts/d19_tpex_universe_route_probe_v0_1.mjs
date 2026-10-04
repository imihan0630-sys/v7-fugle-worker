import { createHash } from "node:crypto";

const sha=(x)=>createHash("sha256").update(String(x)).digest("hex");
const base="https://www.tpex.org.tw";
const pageUrl=base+"/zh-tw/mainboard/listed/delisted.html";
const currentUrl=base+"/openapi/v1/mopsfin_t187ap03_O";
const candidates=[
  base+"/www/zh-tw/mainboard/listed/delisted?response=json",
  base+"/www/zh-tw/mainboard/listed/delisted?code=&year=&reason=&response=json",
  base+"/www/zh-tw/mainboard/listed/delisted?stockNo=&year=&reason=&response=json",
  base+"/www/zh-tw/mainboard/listed/delisted?code=&year=115&reason=&response=json",
  base+"/www/zh-tw/mainboard/listed/delisted?code=&year=2026&reason=&response=json",
];

async function fetchText(url){
  try{
    const r=await fetch(url,{
      headers:{
        accept:"application/json,text/html,text/plain,*/*",
        "user-agent":"Mozilla/5.0 D19-TPEx-Universe-Research/0.1",
        referer:pageUrl,
      },
      redirect:"follow",
      signal:AbortSignal.timeout(45000),
    });
    const text=await r.text();
    let json=null;
    try{json=JSON.parse(text);}catch{}
    return {
      url,status:r.status,ok:r.ok,contentType:r.headers.get("content-type"),
      length:text.length,hash:sha(text),
      jsonKeys:json&&typeof json==="object"&&!Array.isArray(json)?Object.keys(json):null,
      jsonArrayLength:Array.isArray(json)?json.length:null,
      jsonShape:json&&typeof json==="object"&&!Array.isArray(json)
        ?Object.fromEntries(Object.entries(json).slice(0,20).map(([k,v])=>[
          k,Array.isArray(v)?{type:"array",length:v.length}:typeof v==="object"&&v!==null?{type:"object",keys:Object.keys(v).slice(0,20)}:{type:typeof v,value:String(v).slice(0,120)}
        ])):null,
      prefix:text.slice(0,1600),
    };
  }catch(error){
    return {url,error:String(error?.message||error)};
  }
}

const current=await fetchText(currentUrl);
const page=await fetchText(pageUrl);
const routeResults=[];
for(const url of candidates)routeResults.push(await fetchText(url));

const scriptUrls=[];
if(page.prefix||page.length){
  const raw=await (await fetch(pageUrl,{headers:{"user-agent":"Mozilla/5.0 D19-TPEx-Universe-Research/0.1"},signal:AbortSignal.timeout(45000)})).text();
  for(const m of raw.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)){
    const u=new URL(m[1],pageUrl).href;
    if(u.startsWith(base)&&!scriptUrls.includes(u))scriptUrls.push(u);
  }
}
const scriptHints=[];
for(const url of scriptUrls.slice(0,30)){
  const r=await fetchText(url);
  const body=r.prefix||"";
  const lower=body.toLowerCase();
  if(lower.includes("delist")||lower.includes("終止上櫃")||lower.includes("listed/delisted")){
    scriptHints.push({url,status:r.status,hash:r.hash,prefix:body});
  }
}

console.log(JSON.stringify({
  result:"TPEX_UNIVERSE_ROUTE_DISCOVERY_V0_1",
  currentProfile:current,
  delistedPage:page,
  candidates:routeResults,
  scriptUrlCount:scriptUrls.length,
  scriptUrls,
  scriptHints,
  formalCoreChanged:false,
  productionChanged:false,
},null,2));
