from pathlib import Path

path = Path('Worker.js')
text = path.read_text(encoding='utf-8')

def replace_once(old, new, label):
    global text
    if text.count(old) != 1:
        raise SystemExit(f'{label}: expected 1 match, found {text.count(old)}')
    text = text.replace(old, new, 1)

replace_once('const VERSION = "8.15.0-c1-population-receipts";',
             'const VERSION = "8.15.1-c1-capture-integrity";', 'version')
replace_once('const C1_CHUNK_MAX_BYTES=250000;', 'const C1_CHUNK_MAX_BYTES=90000;', 'D1 text bound')
replace_once('''    const candidate=[...current,row];
    if(current.length&&(candidate.length>maxRows||JSON.stringify(candidate).length>maxBytes)) {''',
'''    if(new TextEncoder().encode(JSON.stringify([row])).byteLength>maxBytes) throw new Error("C1_ROW_EXCEEDS_D1_BYTE_BOUND");
    const candidate=[...current,row];
    if(current.length&&(candidate.length>maxRows||new TextEncoder().encode(JSON.stringify(candidate)).byteLength>maxBytes)) {''', 'UTF8 chunk bytes')
replace_once('''  const c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate);''',
'''  let c1PopulationReceipt=null,c1CaptureError=null;
  try { c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate); }
  catch(error) { c1CaptureError=String(error).slice(0,300); }''', 'capture firewall')
replace_once('''    c1PopulationReceipt,
    diagnostics,''', '''    c1PopulationReceipt,c1CaptureError,
    diagnostics,''', 'capture failure propagation')

start=text.index('async function persistC1PopulationReceipt(')
end=text.index('async function readC1PopulationReceipt(',start)
text=text[:start]+r'''async function verifyC1StoredGeneration(session,headerRow) {
  const result=await session.prepare(`SELECT chunk_index,row_count,rows_json FROM trade_research_c1_chunks
    WHERE generation_id=?1 ORDER BY chunk_index ASC`).bind(headerRow.generation_id).all();
  const chunks=result?.results||[];
  if(chunks.length!==Number(headerRow.chunk_count)||chunks.some((c,i)=>Number(c.chunk_index)!==i)) throw new Error("C1_D1_READBACK_MISMATCH");
  const rows=chunks.flatMap(c=>{
    const values=JSON.parse(c.rows_json);
    if(!Array.isArray(values)||values.length!==Number(c.row_count)) throw new Error("C1_D1_READBACK_MISMATCH");
    return values;
  });
  if(rows.length!==Number(headerRow.population_n)||rows.length!==Number(headerRow.captured_n)||
     await sha256Hex(JSON.stringify(rows))!==headerRow.content_digest||
     await sha256Hex(rows.map(r=>String(r.symbol)).sort().join("\n"))!==headerRow.universe_digest)
    throw new Error("C1_D1_READBACK_DIGEST_MISMATCH");
  return true;
}

async function persistC1PopulationReceipt(env,receipt) {
  const rows=Array.isArray(receipt?.rows)?receipt.rows:[];
  if(!env?.V7_DB||!receipt?.generationId||!rows.length) return {ok:false,saved:0,reason:!env?.V7_DB?"NO_D1":"EMPTY"};
  if(receipt.populationN!==rows.length||new Set(rows.map(r=>r.symbol)).size!==rows.length||
     rows.some(r=>typeof r.symbol!=="string"||!r.symbol)||
     !/^[0-9a-f]{40}$/i.test(receipt.sourceMainSha||"")) throw new Error("C1_INVALID_POPULATION_CONTRACT");
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const contentDigest=await sha256Hex(JSON.stringify(rows));
  const universeDigest=await sha256Hex(rows.map(row=>String(row.symbol)).sort().join("\n"));
  const chunks=c1ChunkRows(rows);
  const incoming={contentDigest,populationN:rows.length,chunkCount:chunks.length};
  const header={...receipt,rows:undefined,universeDigest,contentDigest,chunkCount:chunks.length,capturedN:rows.length,readbackVerified:false};
  const existing=await session.prepare(`SELECT * FROM trade_research_c1_generations WHERE generation_id=?1`).bind(receipt.generationId).first();
  const decision=c1ImmutableDecision(existing,incoming);
  if(decision==="CONFLICT"||(existing&&existing.header_json!==JSON.stringify(header))) throw new Error("C1_IMMUTABLE_GENERATION_CONFLICT");
  if(decision!=="IDEMPOTENT") {
    const now=new Date().toISOString();
    const statements=[session.prepare(`INSERT INTO trade_research_c1_generations(
      generation_id,scan_date,decision_at,captured_at,source_main_sha,runtime_version,universe_scope,universe_digest,content_digest,
      population_n,captured_n,feature_n,chunk_count,completeness,header_json,created_at
    ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?10,?11,?12,?13,?14,?15)`)
      .bind(receipt.generationId,receipt.sessionDate,receipt.decisionAt,receipt.capturedAt,receipt.sourceMainSha,receipt.effectiveRuntimeVersion,
        receipt.universeScope,universeDigest,contentDigest,rows.length,Number(receipt.featureN||0),chunks.length,receipt.completeness,JSON.stringify(header),now)];
    chunks.forEach((chunk,index)=>statements.push(session.prepare(`INSERT INTO trade_research_c1_chunks(
      generation_id,chunk_index,row_count,rows_json,created_at
    ) VALUES(?1,?2,?3,?4,?5)`).bind(receipt.generationId,index,chunk.length,JSON.stringify(chunk),now)));
    await session.batch(statements);
  }
  const stored=await session.prepare(`SELECT * FROM trade_research_c1_generations WHERE generation_id=?1`).bind(receipt.generationId).first();
  if(!stored) throw new Error("C1_D1_READBACK_MISMATCH");
  await verifyC1StoredGeneration(session,stored);
  return {ok:true,saved:rows.length,chunks:chunks.length,generationId:receipt.generationId,deduplicated:decision==="IDEMPOTENT",
    contentDigest,universeDigest,readbackVerified:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}

async function persistCompletedC1Safe(env,receipt,scanDate,{selectionVerified=false,captureError=null,now=Date.now()}={}) {
  let save={ok:false,saved:0,readbackVerified:false,reason:null};
  try {
    // Research cannot recreate yesterday's WATCH/PIT cohort from today's enriched data.
    if(!selectionVerified) save.reason="FORMAL_SELECTION_UNVERIFIED";
    else if(!receipt) save.reason=captureError?"C1_CAPTURE_FAILED":"C1_CAPTURE_MISSING";
    else if(receipt.sessionDate!==scanDate||taiwanDate(now)!==scanDate||taiwanDate(Date.parse(receipt.decisionAt))!==scanDate||
      !Number.isFinite(Date.parse(receipt.decisionAt))||Date.parse(receipt.decisionAt)>now||
      Date.parse(receipt.decisionAt)<Date.parse(scanDate+"T05:30:00Z")) save.reason="NON_PROSPECTIVE_SESSION_CAPTURE";
    else save=await persistC1PopulationReceipt(env,receipt);
  } catch(error) { save={ok:false,saved:0,readbackVerified:false,error:String(error).slice(0,300)}; }
  return {schemaVersion:C1_POPULATION_SCHEMA_VERSION,generationId:receipt?.generationId||null,
    generated:receipt?.populationN??null,featureCount:receipt?.featureN??null,
    saved:save.ok===true?save.saved:null,chunks:save.ok===true?save.chunks:null,
    saveOk:save.ok===true,readbackVerified:save.readbackVerified===true,
    reason:save.reason||null,error:save.error||captureError||null,
    contentDigest:save.contentDigest||null,universeDigest:save.universeDigest||null,
    status:save.ok===true&&save.readbackVerified===true?"VERIFIED":"DATA_QUALITY_BLOCKED",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}

''' +text[end:]

replace_once('''  if(!headerRow) return {ok:false,error:"C1_GENERATION_NOT_FOUND",researchOnly:true};''',
'''  if(!headerRow) return {ok:false,error:"C1_GENERATION_NOT_FOUND",researchOnly:true};
  // Verify the whole immutable generation at the start; later pages remain pinned to its id.
  if(safeCursor===0) await verifyC1StoredGeneration(session,headerRow);''', 'read integrity')
replace_once('''      c1PopulationSave = await persistC1PopulationReceipt(env,scan.c1PopulationReceipt);''',
'''      c1PopulationSave = await persistCompletedC1Safe(env,scan.c1PopulationReceipt,marketDate,{selectionVerified:saved.verified===true,captureError:scan.c1CaptureError});''', 'normal persistence')
start=text.index('    researchC1Population: {',text.index('async function runAfterMarketScanCore'))
end=text.index('    researchShadowArchive: {',start)
text=text[:start]+'''    researchC1Population: c1PopulationSave,
'''+text[end:]
replace_once('''  return summary;
}

async function readThreePoolSelectionPerformance''',
'''  // Request-local handoff only: never serialize the multi-megabyte receipt into KV or public preview JSON.
  if(dryRun) Object.defineProperty(summary,"c1PopulationReceipt",{value:scan.c1PopulationReceipt,enumerable:false});
  return summary;
}

async function readThreePoolSelectionPerformance''', 'request local staged handoff')
replace_once('''        await archiveHybridWatchCandidates(env,date,watch);

        const committed={''',
'''        await archiveHybridWatchCandidates(env,date,watch);
        const researchC1Population=await persistCompletedC1Safe(env,preview.c1PopulationReceipt,date,{
          selectionVerified:saved.verified===true,captureError:preview.researchC1Population?.error||null
        });

        const committed={''', 'staged persistence')
replace_once('''          ...preview,version:VERSION,dryRun:false,generatedAt:taiwanTime(),''',
'''          ...preview,version:VERSION,dryRun:false,generatedAt:taiwanTime(),researchC1Population,''', 'staged summary')
path.write_text(text.replace('\r\n','\n'),encoding='utf-8',newline='\n')
print('Applied V8.15.1 C1 capture/integrity repair; Formal rules unchanged')
