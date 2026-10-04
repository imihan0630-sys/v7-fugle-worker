const symbol=process.env.D19_TPEX_ROUTE_SYMBOL||"6488";
const date=process.env.D19_TPEX_ROUTE_DATE||"2026/08/01";
const encoded=encodeURIComponent(date);
const candidates=[
  {
    id:"LEGACY_ST43_RESULT",
    url:"https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_info/st43_result.php?d=115/08&stkno="+symbol,
  },
  {
    id:"NEW_TRADING_STOCK_JSON",
    url:"https://www.tpex.org.tw/www/zh-tw/afterTrading/tradingStock?code="+symbol+"&date="+encoded+"&response=json",
  },
  {
    id:"NEW_TRADING_STOCK_JSON_WITH_ID",
    url:"https://www.tpex.org.tw/www/zh-tw/afterTrading/tradingStock?code="+symbol+"&date="+encoded+"&id=&response=json",
  },
  {
    id:"NEW_TRADING_STOCK_CSV",
    url:"https://www.tpex.org.tw/www/zh-tw/afterTrading/tradingStock?code="+symbol+"&date="+encoded+"&response=csv",
  },
];

const out=[];
for(const candidate of candidates){
  try{
    const response=await fetch(candidate.url,{
      headers:{
        Accept:"application/json,text/csv,text/plain,text/html,*/*",
        "User-Agent":"Mozilla/5.0 System2-D19-Research/0.1",
        Referer:"https://www.tpex.org.tw/zh-tw/mainboard/trading/info/stock-pricing.html",
      },
      signal:AbortSignal.timeout(30000),
    });
    const text=await response.text();
    let jsonKeys=null;
    let jsonShape=null;
    try{
      const parsed=JSON.parse(text);
      jsonKeys=Object.keys(parsed||{});
      jsonShape=Object.fromEntries(jsonKeys.slice(0,20).map((key)=>[
        key,
        Array.isArray(parsed[key])?{type:"array",length:parsed[key].length}:{type:typeof parsed[key],value:typeof parsed[key]==="string"?parsed[key].slice(0,120):parsed[key]}
      ]));
    }catch{}
    out.push({
      id:candidate.id,
      url:candidate.url,
      status:response.status,
      ok:response.ok,
      contentType:response.headers.get("content-type"),
      contentLength:text.length,
      jsonKeys,
      jsonShape,
      bodyPrefix:text.slice(0,1200),
    });
  }catch(error){
    out.push({id:candidate.id,url:candidate.url,error:String(error?.message||error)});
  }
}
console.log(JSON.stringify({result:"TPEx route probe",symbol,date,candidates:out},null,2));
