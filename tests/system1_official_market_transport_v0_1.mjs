const DEFAULT_ATTEMPTS=5;
const BACKOFF_MS=[0,750,1500,3000,5000];

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

export function officialMarketRequestHeaders(market){
  if(market==="TPEx") return {
    accept:"application/json,text/plain,*/*",
    "user-agent":"Mozilla/5.0 System1-Official-Market-Sync/0.1",
    referer:"https://www.tpex.org.tw/zh-tw/mainboard/trading/info/pricing.html",
    "cache-control":"no-cache"
  };
  return {
    accept:"application/json,text/plain,*/*",
    "user-agent":"Mozilla/5.0 System1-Official-Market-Sync/0.1",
    referer:"https://www.twse.com.tw/zh/trading/historical/mi-index.html",
    "cache-control":"no-cache"
  };
}
export function retryableOfficialMarketStatus(status){
  const n=Number(status);
  return [403,408,425,429,500,502,503,504,520,521,522,523,524,525,526,530].includes(n);
}
function networkRetryable(error){
  const text=String(error?.message||error||"");
  const cause=String(error?.cause?.code||error?.code||"");
  return /terminated|fetch failed|socket|connection|reset|closed|timeout|timed out|temporarily unavailable/i.test(text)
    || /UND_ERR_SOCKET|ECONNRESET|ETIMEDOUT|EAI_AGAIN/i.test(cause);
}
export async function fetchOfficialMarketPayload({
  market,sourceUrl,fetchImpl=globalThis.fetch,sleepImpl=sleep,attempts=DEFAULT_ATTEMPTS,timeoutMs=30000
}={}){
  if(!["TWSE","TPEx"].includes(market))throw new Error("OFFICIAL_MARKET_UNSUPPORTED");
  if(typeof fetchImpl!=="function")throw new Error("OFFICIAL_MARKET_FETCH_REQUIRED");
  if(!/^https:\/\//.test(String(sourceUrl||"")))throw new Error("OFFICIAL_MARKET_URL_REQUIRED");
  if(!Number.isInteger(attempts)||attempts<1||attempts>5)throw new Error("OFFICIAL_MARKET_ATTEMPTS_INVALID");
  let last=null;
  for(let attempt=1;attempt<=attempts;attempt++){
    try{
      const response=await fetchImpl(sourceUrl,{
        method:"GET",headers:officialMarketRequestHeaders(market),redirect:"follow",
        signal:AbortSignal.timeout(timeoutMs)
      });
      if(!response?.ok){
        const status=Number(response?.status);
        const preview=await response.text().catch(()=>"");
        const error=new Error(`OFFICIAL_MARKET_HTTP_${status}:${preview.slice(0,120)}`);
        error.httpStatus=status;
        if(!retryableOfficialMarketStatus(status))throw error;
        last=error;
      }else{
        const text=await response.text();
        let payload;
        try{payload=JSON.parse(text);}
        catch{throw new Error("OFFICIAL_MARKET_NON_JSON:"+text.slice(0,120));}
        return {payload,attemptsUsed:attempt,httpStatus:Number(response.status),requestHeaders:officialMarketRequestHeaders(market)};
      }
    }catch(error){
      if(error?.httpStatus&&!retryableOfficialMarketStatus(error.httpStatus))throw error;
      if(!error?.httpStatus&&!networkRetryable(error))throw error;
      last=error;
    }
    if(attempt<attempts)await sleepImpl(BACKOFF_MS[Math.min(attempt,BACKOFF_MS.length-1)]);
  }
  throw new Error("OFFICIAL_MARKET_TRANSPORT_RETRY_EXHAUSTED:"+String(last?.message||last||"unknown").slice(0,220));
}
