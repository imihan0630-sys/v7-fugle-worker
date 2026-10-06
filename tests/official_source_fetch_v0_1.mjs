const RETRYABLE=/fetch failed|timeout|aborted|ECONNRESET|ETIMEDOUT|UND_ERR/i;

export async function fetchBufferedOfficialSource(url,options={},{
  fetchImpl=globalThis.fetch,
  sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),
  maxAttempts=3,
  defaultTimeoutMs=45000
}={}){
  if(typeof fetchImpl!=="function") throw new Error("OFFICIAL_SOURCE_FETCH_IMPL_REQUIRED");
  const {timeoutMs,...requestOptions}=options||{};
  const timeout=Number(timeoutMs||defaultTimeoutMs);
  if(!Number.isFinite(timeout)||timeout<1000) throw new Error("OFFICIAL_SOURCE_TIMEOUT_INVALID");
  for(let attempt=1;attempt<=maxAttempts;attempt++){
    try{
      const response=await fetchImpl(url,{
        ...requestOptions,
        redirect:"manual",
        signal:AbortSignal.timeout(timeout)
      });
      if([401,403].includes(response.status))
        throw Object.assign(new Error("Official source disallows access; stop this synchronization without bypassing restrictions"),{permanent:true});
      if((response.status===429||response.status>=500)&&attempt<maxAttempts){
        await sleep(1000*attempt);
        continue;
      }
      if(!response.ok) throw Object.assign(new Error("Official source HTTP "+response.status),{permanent:true});
      // Critical: consume the entire body while still inside the retry boundary.
      // Headers-only success is not success if the body stream times out.
      const bytes=await response.arrayBuffer();
      return new Response(bytes,{status:response.status,statusText:response.statusText,headers:response.headers});
    }catch(error){
      const retryable=!error?.permanent&&RETRYABLE.test(String(error));
      if(attempt>=maxAttempts||!retryable){
        const pathname=(()=>{try{return new URL(url).pathname;}catch{return String(url);}})();
        throw new Error(`Public source ${pathname}: ${error?.message||error}`);
      }
      await sleep(1000*attempt);
    }
  }
  throw new Error("OFFICIAL_SOURCE_RETRY_EXHAUSTED");
}
