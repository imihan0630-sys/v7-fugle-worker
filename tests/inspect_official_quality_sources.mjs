// Public-source diagnostics only: no credentials, administrator writes, selection or pushes.
const sources=[
  ['runtime','https://fugle-test.imihan0630.workers.dev/api/version'],
  ['taiexCurrent','https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=20260901'],
  ['taiexPrevious','https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=20260801'],
  ['twseEpsCsv','https://mopsfin.twse.com.tw/opendata/t187ap14_L.csv'],
  ['tpexEpsCsv','https://mopsfin.twse.com.tw/opendata/t187ap14_O.csv'],
  ['twseValuation','https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL'],
  ['tpexSchema','https://www.tpex.org.tw/openapi/swagger.json'],
  ['mopsHistoricalPage','https://mopsov.twse.com.tw/mops/web/t163sb04'],
  ['tdccOpenDataPage','https://www.tdcc.com.tw/portal/zh/stats/openData']
];
for(let start=0;start<sources.length;start+=3) await Promise.all(sources.slice(start,start+3).map(async ([name,url])=>{
  try {
    const response=await fetch(url,{headers:{accept:'application/json,text/csv,text/html'},redirect:'manual',signal:AbortSignal.timeout(45000)});
    const raw=await response.text();
    const info={name,status:response.status,contentType:response.headers.get('content-type'),bytes:raw.length};
    if([401,403].includes(response.status)){console.log(JSON.stringify({...info,authorizationBlocked:true}));return;}
    if(response.ok && raw.trim().startsWith('{')){
      const data=JSON.parse(raw);info.keys=Object.keys(data);info.fields=data.fields;info.date=data.date;info.stat=data.stat;
      info.count=data.data?.length;info.first=data.data?.[0];info.last=data.data?.at(-1);
      if(data.paths) info.relevantPaths=Object.keys(data.paths).filter(path=>/peratio|pe_ratio|valu|pbr|income|earning|revenue|ap14|ap17|index/i.test(path));
      if(name==='runtime') info.runtime=data;
    } else if(response.ok && raw.trim().startsWith('[')){
      const data=JSON.parse(raw);info.count=data.length;info.fields=Object.keys(data[0] || {});info.first=data.find(row=>row.Code==='6706') || data[0];
    } else if(response.ok && name.endsWith('Csv')){
      const lines=raw.split(/\r?\n/);info.header=lines[0];info.first=lines[1];info.count=lines.length;
    } else if(response.ok){
      info.scripts=[...raw.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)].map(match=>match[1]);
      info.actions=[...raw.matchAll(/(?:action|href)=["']([^"']+(?:csv|t163sb04|opendata|OpenData)[^"']*)["']/gi)].slice(0,30).map(match=>match[1]);
      info.ajaxSnippets=raw.match(/.{0,100}(?:ajax_t163sb04|t163sb04|tdcc-opendata|\.csv).{0,200}/g)?.slice(0,8);
    }
    console.log(JSON.stringify(info));
  }catch(err){console.log(JSON.stringify({name,error:String(err)}));}
}));
