import {request as nodeHttpsRequest} from "node:https";

const RETRYABLE=/fetch failed|timeout|aborted|ECONNRESET|ETIMEDOUT|UND_ERR/i;

export function fetchBufferedNodeHttps(url,options={},timeout=45000,{requestImpl=nodeHttpsRequest}={}){
  return new Promise((resolve,reject)=>{
    const target=new URL(url);
    if(target.protocol!=="https:") return reject(Object.assign(new Error("Official source native transport requires HTTPS"),{permanent:true}));
    const {body,...requestOptions}=options||{};
    const payload=body instanceof URLSearchParams ? body.toString() : body;
    if(payload!==undefined&&typeof payload!=="string"&&!Buffer.isBuffer(payload)&&!(payload instanceof Uint8Array))
      return reject(Object.assign(new Error("Official source native transport body type unsupported"),{permanent:true}));
    const headers=new Headers(requestOptions.headers||{});
    if(payload!==undefined&&!headers.has("content-length")) headers.set("content-length",String(Buffer.byteLength(payload)));
    const request=requestImpl(target,{
      ...requestOptions,
      headers:Object.fromEntries(headers.entries())
    },response=>{
      const chunks=[];
      response.on("data",chunk=>chunks.push(Buffer.from(chunk)));
      response.on("aborted",()=>request.destroy(new Error("Official source response aborted")));
      response.on("error",reject);
      response.on("end",()=>{
        const responseHeaders=new Headers();
        for(const [name,value] of Object.entries(response.headers||{})) {
          if(Array.isArray(value)) for(const item of value) responseHeaders.append(name,item);
          else if(value!==undefined) responseHeaders.set(name,String(value));
        }
        resolve(new Response(Buffer.concat(chunks),{
          status:Number(response.statusCode||500),
          statusText:String(response.statusMessage||""),
          headers:responseHeaders
        }));
      });
    });
    request.setTimeout(timeout,()=>request.destroy(new Error("The operation was aborted due to timeout")));
    request.on("error",reject);
    request.end(payload);
  });
}

export async function fetchBufferedOfficialSource(url,options={},{
  fetchImpl=globalThis.fetch,
  nodeHttpsImpl=fetchBufferedNodeHttps,
  sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),
  maxAttempts=3,
  defaultTimeoutMs=45000
}={}){
  if(typeof fetchImpl!=="function") throw new Error("OFFICIAL_SOURCE_FETCH_IMPL_REQUIRED");
  const {timeoutMs,transport,...requestOptions}=options||{};
  const timeout=Number(timeoutMs||defaultTimeoutMs);
  if(!Number.isFinite(timeout)||timeout<1000) throw new Error("OFFICIAL_SOURCE_TIMEOUT_INVALID");
  if(transport!==undefined&&transport!=="node-https") throw new Error("OFFICIAL_SOURCE_TRANSPORT_INVALID");
  for(let attempt=1;attempt<=maxAttempts;attempt++){
    try{
      const response=transport==="node-https"
        ? await nodeHttpsImpl(url,{...requestOptions},timeout)
        : await fetchImpl(url,{
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
      const pathname=(()=>{try{return new URL(url).pathname;}catch{return String(url);}})();
      console.error(JSON.stringify({
        officialSourceRetry:retryable&&attempt<maxAttempts,
        path:pathname,
        attempt,
        maxAttempts,
        timeoutMs:timeout,
        transport:transport||"fetch",
        error:String(error?.message||error).slice(0,220)
      }));
      if(attempt>=maxAttempts||!retryable){
        throw new Error(`Public source ${pathname}: ${error?.message||error}`);
      }
      await sleep(1000*attempt);
    }
  }
  throw new Error("OFFICIAL_SOURCE_RETRY_EXHAUSTED");
}
