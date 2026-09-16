// Public-source diagnostics only: no credentials, administrator writes, selection or pushes.
const sources=[
  ['runtime','https://fugle-test.imihan0630.workers.dev/api/version'],
  ['twseAnnouncements','https://openapi.twse.com.tw/v1/opendata/t187ap04_L'],
  ['taiexCurrent','https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=20260901'],
  ['taiexPrevious','https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=20260801'],
  ['twseEpsCsv','https://mopsfin.twse.com.tw/opendata/t187ap14_L.csv'],
  ['tpexEpsCsv','https://mopsfin.twse.com.tw/opendata/t187ap14_O.csv'],
  ['tdccCsv','https://opendata.tdcc.com.tw/getOD.ashx?id=1-5'],
  ['twseValuation','https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL'],
  ['twseDatedValuation','https://www.twse.com.tw/exchangeReport/BWIBBU_d?response=json&date=20260916&selectType=ALL'],
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
      if(data.paths) {
        info.servers=data.servers;
        info.relevantPaths=Object.keys(data.paths).filter(path=>/peratio|pe_ratio|valu|pbr|income|earning|revenue|ap04|ap14|ap17|index/i.test(path));
        const base=data.servers?.find(server=>server.url.startsWith('https://www.tpex.org.tw/'))?.url;
        if(base) for(const path of ['/tpex_mainboard_peratio_analysis','/mopsfin_t187ap04_O']) if(data.paths[path]) {
          const follow=await fetch(base.replace(/\/$/,'')+path,{redirect:'manual',signal:AbortSignal.timeout(30000)});
          const text=await follow.text();
          if(follow.ok && text.trim().startsWith('[')){const rows=JSON.parse(text);info[path]={status:follow.status,count:rows.length,fields:Object.keys(rows[0] || {}),first:rows[0]};}
          else info[path]={status:follow.status};
        }
      }
      if(name==='runtime') info.runtime=data;
    } else if(response.ok && raw.trim().startsWith('[')){
      const data=JSON.parse(raw);info.count=data.length;info.fields=Object.keys(data[0] || {});info.first=data.find(row=>row.Code==='6706') || data[0];
    } else if(response.ok && name.endsWith('Csv')){
      const lines=raw.split(/\r?\n/);info.header=lines[0];info.first=lines[1];info.count=lines.length;
      if(name==='tdccCsv') {
        info.samples=lines.filter(line=>/(?:,0*1101,|,0*6706,|,0*3006,)/.test(line)).slice(0,60);
        info.symbolExamples=[...new Set(lines.slice(1).map(line=>line.split(',')[1]))].slice(200,215);
        info.gradeCounts=Object.fromEntries([...new Set(lines.slice(1).map(line=>line.split(',')[2]))].map(grade=>[grade,lines.filter(line=>line.split(',')[2]===grade).length]));
      }
    } else if(response.ok){
      info.scripts=[...raw.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)].map(match=>match[1]);
      info.actions=[...raw.matchAll(/(?:action|href)=["']([^"']+(?:csv|t163sb04|opendata|OpenData)[^"']*)["']/gi)].slice(0,30).map(match=>match[1]);
      info.ajaxSnippets=raw.match(/.{0,100}(?:ajax_t163sb04|t163sb04|tdcc-opendata|\.csv).{0,200}/g)?.slice(0,8);
      if(name==='mopsHistoricalPage') {
        const form=raw.match(/<form[^>]+id="form1"[\s\S]*?<\/form>/i)?.[0] || '';
        info.formInputs=[...form.matchAll(/<input[^>]+>/gi)].map(match=>match[0]);
        for(const [year,season] of [['115','02'],['115','01'],['114','02']]) {
          const follow=await fetch('https://mopsov.twse.com.tw/mops/web/ajax_t163sb04',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},
            body:new URLSearchParams({encodeURIComponent:'1',step:'1',firstin:'1',off:'1',TYPEK:'s',year,season}),redirect:'manual',signal:AbortSignal.timeout(35000)});
          const html=await follow.text();
          const cells=[...html.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(match=>match[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
          info[`query${year}Q${season}`]={status:follow.status,bytes:html.length,tableCount:(html.match(/<table\b/gi) || []).length,cells:cells.slice(0,100)};
          info[`query${year}Q${season}`].incomeHeaders=[...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(row=>[...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(cell=>cell[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim())).filter(row=>row[0]==='公司代號');
          if([401,403].includes(follow.status)) break;
        }
      }
    }
    console.log(JSON.stringify(info));
  }catch(err){console.log(JSON.stringify({name,error:String(err)}));}
}));
