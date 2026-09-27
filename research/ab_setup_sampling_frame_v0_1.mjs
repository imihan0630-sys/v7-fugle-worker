function norm(v){return v===null||v===undefined?null:String(v);}
function pool(v){return ["GENERAL","THOUSAND"].includes(String(v))?String(v):"UNKNOWN";}
function near(v){return ["A","B","TIE"].includes(String(v))?String(v):"UNKNOWN";}
function pattern(row){return norm(row?.checkPattern)||`A:${row?.A?.bitmask||"??????"}|B:${row?.B?.bitmask||"??????"}`;}
function fnv1a(text){
  let h=0x811c9dc5;
  for(let i=0;i<text.length;i+=1){h^=text.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}
  return h>>>0;
}
function pct(a,b){return b>0?a/b:null;}
function bump(obj,key){obj[key]=(obj[key]||0)+1;}

export function buildABSetupSamplingFrame(rows=[],{
  samplePerStratum=6,
  frameVersion="AB_SETUP_SAMPLING_FRAME_V0_1",
  parentComplete=false
}={}){
  const items=Array.isArray(rows)?rows:[];
  const cap=Math.max(1,Math.floor(Number(samplePerStratum)||6));
  const seen=new Set(),duplicates=[],invalid=[];
  const stateCounts={SETUP_FIRST_FAILURE:0,SETUP_PASS:0,PRE_SETUP_NOT_REACHED:0,UNKNOWN:0,OTHER:0};
  const cells=new Map();
  const semanticMembership=[];

  for(const row of items){
    const scanDate=norm(row?.scanDate),symbol=norm(row?.symbol),p=pool(row?.pool),state=norm(row?.state)||"UNKNOWN";
    bump(stateCounts,Object.prototype.hasOwnProperty.call(stateCounts,state)?state:"OTHER");
    const parentKey=scanDate&&symbol?`${scanDate}|${symbol}|${p}`:null;
    if(!parentKey){
      invalid.push({scanDate,symbol,pool:p,state,reason:"MISSING_PARENT_KEY"});
      continue;
    }
    if(seen.has(parentKey)) duplicates.push(parentKey);
    seen.add(parentKey);

    semanticMembership.push({
      scanDate,symbol,pool:p,state,
      setupFirstFailureEligible:state==="SETUP_FIRST_FAILURE",
      nearestChannel:near(row?.nearestChannel),
      checkPattern:pattern(row)
    });

    if(state!=="SETUP_FIRST_FAILURE") continue;
    const n=near(row?.nearestChannel),pat=pattern(row);
    if(n==="UNKNOWN"||pat.includes("?")){
      invalid.push({scanDate,symbol,pool:p,state,reason:"INCOMPLETE_SETUP_STRATUM"});
      continue;
    }
    const cellKey=`${scanDate}|${p}|${n}|${pat}`;
    if(!cells.has(cellKey)) cells.set(cellKey,{scanDate,pool:p,nearestChannel:n,checkPattern:pat,rows:[]});
    const hashInput=`${frameVersion}|${cellKey}|${symbol}`;
    cells.get(cellKey).rows.push({scanDate,symbol,pool:p,nearestChannel:n,checkPattern:pat,hash:fnv1a(hashInput)});
  }

  const populationCells=[],sampleMembership=[];
  for(const [cellId,cell] of [...cells.entries()].sort((a,b)=>a[0].localeCompare(b[0]))){
    const ordered=[...cell.rows].sort((a,b)=>a.hash-b.hash||a.symbol.localeCompare(b.symbol));
    const sampled=ordered.slice(0,cap);
    populationCells.push({
      cellId,
      scanDate:cell.scanDate,pool:cell.pool,nearestChannel:cell.nearestChannel,checkPattern:cell.checkPattern,
      populationCount:ordered.length,sampleCount:sampled.length,samplingFraction:pct(sampled.length,ordered.length),
      sampleCap:cap
    });
    sampled.forEach((r,i)=>sampleMembership.push({
      ...r,cellId,sampleRank:i+1,
      semanticMembership:"SETUP_FIRST_FAILURE",
      sampled:true
    }));
  }

  const quality=duplicates.length||invalid.length||parentComplete!==true?"UNKNOWN":"CLEAN";
  return {
    schemaVersion:"ab-setup-sampling-frame-v0.1",
    frameVersion,
    parentComplete:parentComplete===true,
    quality,
    inputRows:items.length,
    stateCounts,
    semanticMembership,
    populationCells,
    sampleMembership,
    duplicateParentKeys:[...new Set(duplicates)].sort(),
    invalidRows:invalid,
    policy:{
      populationBeforeSample:true,
      sampleMembershipSeparateFromSemanticMembership:true,
      deterministicWithinStratum:true,
      stratum:"scanDate x pool x nearestChannel x exactCheckPattern",
      zeroCellSemantics:"An absent stratum may be interpreted as zero only when quality=CLEAN for that complete parent frame. Otherwise absence is UNKNOWN.",
      noCompositeDistance:true,
      noOutcomeUse:true,
      noFormalChange:true
    }
  };
}
