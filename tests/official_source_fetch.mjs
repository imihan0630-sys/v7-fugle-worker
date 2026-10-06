const TRANSIENT=/fetch failed|timeout|ECONNRESET|ETIMEDOUT|UND_ERR|socket|network/i;

function defaultSleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
function pathOf(url){try{return new URL(url).pathname;}catch{return String(url);}}

export async function publicSource(url,options={},{
  fetchImpl=globalThis.fetch,
  attempts=3,
  timeoutMs=45000,
  sleep=defaultSleep
}={}){
  if(typeof fetchImpl!=="function") throw new Error("Public source fetch unavailable");
  if(!Number.isInteger(attempts)||attempts<1||attempts>5) throw new Error("Public source retry budget invalid");
  if(!Number.isFinite(timeoutMs)||timeoutMs<1000||timeoutMs>180000) throw new Error("Public source timeout invalid");
  for(let attempt=0;attempt<attempts;attempt++){
    try{
      const response=await fetchImpl(url,{...options,redirect:"manual",signal:AbortSignal.timeout(timeoutMs)});
      if([401,403].includes(response.status)){
        try{await response.body?.cancel?.();}catch{}
        throw new Error("Official source disallows access; stop this synchronization without bypassing restrictions");
      }
      if(response.status===429||response.status>=500){
        try{await response.body?.cancel?.();}catch{}
        if(attempt<attempts-1){
          await sleep(1000*(attempt+1));
          continue;
        }
        throw new Error("Official source HTTP "+response.status);
      }
      if(!response.ok){
        try{await response.body?.cancel?.();}catch{}
        throw new Error("Official source HTTP "+response.status);
      }

      // Critical: consume the entire body while the timeout/retry boundary is active.
      // Previously callers consumed response.text()/json() after publicSource returned,
      // so a slow body timed out outside this catch and bypassed all retries.
      const bytes=await response.arrayBuffer();
      return new Response(bytes,{
        status:response.status,
        statusText:response.statusText,
        headers:response.headers
      });
    }catch(error){
      const message=String(error?.message||error);
      if(/disallows access|Official source HTTP/.test(message)) throw new Error("Public source "+pathOf(url)+": "+message);
      const retryable=TRANSIENT.test(String(error))||TRANSIENT.test(message);
      if(attempt>=attempts-1||!retryable) throw new Error("Public source "+pathOf(url)+": "+message);
      await sleep(1000*(attempt+1));
    }
  }
  throw new Error("Public source "+pathOf(url)+": retry budget exhausted");
}
