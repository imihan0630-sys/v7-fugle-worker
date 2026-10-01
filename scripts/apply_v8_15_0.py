from pathlib import Path
import os

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text = text.replace(old, new, 1)


source_sha = os.environ.get("GITHUB_SHA", "LOCAL_UNSET").strip()
if source_sha != "LOCAL_UNSET" and (len(source_sha) != 40 or any(ch not in "0123456789abcdefABCDEF" for ch in source_sha)):
    raise SystemExit("GITHUB_SHA must be a 40-character hexadecimal commit")

replace_once(
    'const VERSION = "8.14.4-history-memory-compaction";',
    'const VERSION = "8.15.0-c1-population-receipts";',
    "version",
)

helpers = r'''
const C1_POPULATION_SCHEMA_VERSION="SYSTEM1_C1_POPULATION_V0_1";
const C1_SOURCE_MAIN_SHA="__SOURCE_MAIN_SHA__";
const C1_CHUNK_MAX_ROWS=50;
const C1_CHUNK_MAX_BYTES=250000;

function c1Number(value) {
  return typeof value==="number" && Number.isFinite(value) ? value : null;
}

function c1ProjectFeature(f) {
  if(!f) return null;
  const out={};
  for(const key of [
    "close","historyDays","marketReturn20","sectorReturn20","marketCapYi","changePercent",
    "avgVolume20Lots","avgAmount20","spreadPercent","depthScore","chipConcentration",
    "quarterRevenue","revenueQoQ","revenueQuarterYoY","priceBookRatio","priceEarningsRatio",
    "sectorMedianPe","epsYoY","atrPercent"
  ]) out[key]=c1Number(f[key]);
  for(const key of ["orderBookDepthGood","financialBasis","valuationObserved","announcementsVerified"])
    out[key]=typeof f[key]==="boolean"?f[key]:null;
  out.officialAnnouncements=Array.isArray(f.officialAnnouncements)
    ? f.officialAnnouncements.slice(0,20).map(item=>({date:String(item?.date||""),title:String(item?.title||"").slice(0,180)}))
    : null;
  return out;
}

function c1DerivedState(f) {
  if(!f) return null;
  const setup=strategySetupState(f);
  const channel=setup?.B?.pass===true?"B":setup?.A?.pass===true?"A":null;
  const atr=c1Number(f.atrPercent)!==null ? f.atrPercent/100*f.close : null;
  let entry=null,stop=null,target=null,rewardPerRisk=null,setupQuality=null;
  if(channel&&Number.isFinite(atr)) {
    if(channel==="A") {
      const support=c1Number(setup?.metrics?.support);
      if(support!==null) {
        const low=support*.995,high=support*1.018;
        entry=(low+high)/2;
        const structureLow=c1Number(f.recentLow5Prev)??support;
        stop=Math.min(support*.98,structureLow-atr*.12);
      }
    } else {
      const breakout=c1Number(f.priorHigh20);
      if(breakout!==null) {
        entry=breakout*1.003;
        stop=breakout-Math.max(atr*.65,breakout*.012);
      }
    }
    if(entry!==null&&stop!==null) {
      target=nearestRealResistance(f,entry);
      const risk=entry-stop,reward=target===null?null:target-entry;
      rewardPerRisk=risk>0&&reward!==null?reward/risk:null;
    }
    setupQuality=channel==="A"
      ? clamp(70-Math.abs((setup.metrics.pullbackPct||8)-7)*3-(setup.metrics.supportDistancePct||0)*3+(f.volumeTodayVsPrev5<=.9?12:4),0,100)
      : clamp(55+Math.min(25,(f.volumeTodayVsPrev5||0)*8)+(f.dailyClosePosition||0)*20-(f.dailyUpperShadowRatio||0)*25,0,100);
  }
  return {
    institutionalScore:institutionalScore(f),fundamentalCount:financialDataCount(f),fundamentalScore:fundamentalScore(f),
    setupState:{A:{pass:setup?.A?.pass===true},B:{pass:setup?.B?.pass===true}},channel,
    targetState:!channel?"UNKNOWN":target===null?"NONE":"FOUND",target:c1Number(target),
    rewardPerRisk:c1Number(rewardPerRisk),setupQuality:c1Number(setupQuality),
    entryGeometry:{entry:c1Number(entry),stop:c1Number(stop),target:c1Number(target)},
    derivationVersion:"FORMAL_V8_15_OBSERVED_INPUTS_NO_DECISION_IMPACT"
  };
}

function buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,formalResults,selected,scanDate) {
  const decisionAt=new Date().toISOString();
  const generationId=`C1:${scanDate}:${crypto.randomUUID()}`;
  const featureMap=new Map((featureRows||[]).map(f=>[String(f.symbol),f]));
  const selectedRanks=new Map((selected||[]).map((item,index)=>[String(item.symbol),index+1]));
  const rows=(todayRows||[]).map(raw=>{
    const symbol=String(raw?.symbol||"");
    const f=featureMap.get(symbol)||null;
    const sector=f?(sectorStats?.[f.industry]||{}):{};
    const result=formalResults?.get(symbol)||null;
    const historyAdmission=marketState?.stocks?.[symbol]?.historyFreshness||{usable:false,status:"UNKNOWN",reason:"HISTORY_ADMISSION_MISSING"};
    return {
      symbol,name:String(raw?.name||symbol),market:String(raw?.market||"UNKNOWN"),industry:String(raw?.industry||"未分類"),
      pricePool:c1Number(raw?.close)===null?"UNKNOWN":raw.close>=THOUSAND_STOCK_PRICE?"THOUSAND":"GENERAL",
      feature:f?c1ProjectFeature(f):{close:c1Number(raw?.close),historyDays:null},
      sector:f?{breadth:c1Number(sector.breadth),avgChange:c1Number(sector.avgChange),amountVs20DayAverage:c1Number(sector.amountVs20DayAverage)}:null,
      derived:f?c1DerivedState(f):null,
      historyAdmission:{
        usable:historyAdmission?.usable===true,status:String(historyAdmission?.status||"UNKNOWN"),
        reason:historyAdmission?.reason?String(historyAdmission.reason):null,
        latestPriorDate:historyAdmission?.latestPriorDate||null,gapDate:historyAdmission?.gapDate||null,
        requiredBars:c1Number(historyAdmission?.requiredBars)
      },
      formalResult:result?{
        ok:result.ok===true,firstFailure:result.ok===true?null:String(result.reason||""),
        basePassed:result.basePassed===true,rrPassed:result.rrPassed===true,
        selected:selectedRanks.has(symbol),selectedRank:selectedRanks.get(symbol)||null
      }:{ok:false,firstFailure:"HISTORY_OR_FEATURE_ADMISSION_BLOCKED",basePassed:false,rrPassed:false,selected:false,selectedRank:null},
      safety:{
        SOURCE_AUTHENTICITY:{status:"PASS",reason:"OFFICIAL_NORMALIZED_SCAN_ROW"},
        SESSION_CONTINUITY:{status:historyAdmission?.usable===true?"PASS":"UNKNOWN",reason:historyAdmission?.usable===true?null:String(historyAdmission?.reason||"HISTORY_ADMISSION_UNKNOWN")},
        CORPORATE_ACTION_CONTINUITY:{status:"UNKNOWN",reason:"NO_INDEPENDENT_CA_RECEIPT_IN_C1_V0_1"},
        EXECUTION_FEASIBILITY:{status:"UNKNOWN",reason:"NO_INDEPENDENT_EXECUTION_RECEIPT_IN_C1_V0_1"},
        ACCOUNT_RISK:{status:"UNKNOWN",reason:"BROKER_ACCOUNT_STATE_OUT_OF_SCOPE"}
      }
    };
  });
  return {
    schemaVersion:C1_POPULATION_SCHEMA_VERSION,generationId,sourceMainSha:C1_SOURCE_MAIN_SHA,
    effectiveRuntimeVersion:VERSION,sessionDate:String(scanDate),decisionAt,capturedAt:decisionAt,
    universeScope:"OFFICIAL_NORMALIZED_ORDINARY_CLOSE_GTE_10_BEFORE_HISTORY_ADMISSION",
    populationN:rows.length,featureN:featureRows?.length||0,rows,
    completeness:"IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE",researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    policy:"Full normalized population receipt. Missing history/features remain explicit UNKNOWN; no row changes Formal selection, ranking, capital, signal or push."
  };
}

function c1ChunkRows(rows,maxRows=C1_CHUNK_MAX_ROWS,maxBytes=C1_CHUNK_MAX_BYTES) {
  const chunks=[];
  let current=[];
  for(const row of rows||[]) {
    const candidate=[...current,row];
    if(current.length&&(candidate.length>maxRows||JSON.stringify(candidate).length>maxBytes)) {
      chunks.push(current);current=[row];
    } else current=candidate;
  }
  if(current.length) chunks.push(current);
  return chunks;
}

function c1ImmutableDecision(existing,incoming) {
  if(!existing) return "INSERT";
  return existing.content_digest===incoming.contentDigest&&Number(existing.population_n)===incoming.populationN&&
    Number(existing.chunk_count)===incoming.chunkCount?"IDEMPOTENT":"CONFLICT";
}

async function persistC1PopulationReceipt(env,receipt) {
  const rows=Array.isArray(receipt?.rows)?receipt.rows:[];
  if(!env?.V7_DB||!receipt?.generationId||!rows.length) return {ok:false,saved:0,reason:!env?.V7_DB?"NO_D1":"EMPTY"};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const canonicalRows=JSON.stringify(rows);
  const contentDigest=await sha256Hex(canonicalRows);
  const universeDigest=await sha256Hex(rows.map(row=>String(row.symbol)).sort().join("\n"));
  const chunks=c1ChunkRows(rows);
  const incoming={contentDigest,populationN:rows.length,chunkCount:chunks.length};
  const existing=await session.prepare(`SELECT generation_id,content_digest,population_n,chunk_count FROM trade_research_c1_generations WHERE generation_id=?1`).bind(receipt.generationId).first();
  const decision=c1ImmutableDecision(existing,incoming);
  if(decision==="CONFLICT") throw new Error("C1_IMMUTABLE_GENERATION_CONFLICT");
  if(decision==="IDEMPOTENT") return {ok:true,saved:rows.length,chunks:chunks.length,generationId:receipt.generationId,deduplicated:true,contentDigest,universeDigest,researchOnly:true,decisionImpact:false};
  const header={...receipt,rows:undefined,universeDigest,contentDigest,chunkCount:chunks.length,capturedN:rows.length,readbackVerified:false};
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
  const verified=await session.prepare(`SELECT g.generation_id,g.population_n,g.chunk_count,
    COUNT(c.chunk_index) AS stored_chunks,COALESCE(SUM(c.row_count),0) AS stored_rows
    FROM trade_research_c1_generations g LEFT JOIN trade_research_c1_chunks c ON c.generation_id=g.generation_id
    WHERE g.generation_id=?1 GROUP BY g.generation_id,g.population_n,g.chunk_count`).bind(receipt.generationId).first();
  if(Number(verified?.stored_rows)!==rows.length||Number(verified?.stored_chunks)!==chunks.length) throw new Error("C1_D1_READBACK_MISMATCH");
  return {ok:true,saved:rows.length,chunks:chunks.length,generationId:receipt.generationId,deduplicated:false,contentDigest,universeDigest,readbackVerified:true,researchOnly:true,decisionImpact:false};
}

async function readC1PopulationReceipt(env,{scanDate=null,generationId=null,cursor=0,limit=1}={}) {
  if(!env?.V7_DB) return {ok:false,error:"NO_D1"};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const safeCursor=Math.max(0,Math.floor(Number(cursor)||0));
  const safeLimit=Math.max(1,Math.min(2,Math.floor(Number(limit)||1)));
  let headerRow=null;
  if(generationId) headerRow=await session.prepare(`SELECT * FROM trade_research_c1_generations WHERE generation_id=?1`).bind(String(generationId)).first();
  else if(scanDate) headerRow=await session.prepare(`SELECT * FROM trade_research_c1_generations WHERE scan_date=?1 ORDER BY created_at DESC LIMIT 1`).bind(String(scanDate)).first();
  else headerRow=await session.prepare(`SELECT * FROM trade_research_c1_generations ORDER BY created_at DESC LIMIT 1`).first();
  if(!headerRow) return {ok:false,error:"C1_GENERATION_NOT_FOUND",researchOnly:true};
  const result=await session.prepare(`SELECT chunk_index,row_count,rows_json FROM trade_research_c1_chunks
    WHERE generation_id=?1 AND chunk_index>=?2 ORDER BY chunk_index ASC LIMIT ?3`)
    .bind(headerRow.generation_id,safeCursor,safeLimit).all();
  const chunks=(result?.results||[]).map(row=>({chunkIndex:Number(row.chunk_index),rowCount:Number(row.row_count),rows:JSON.parse(row.rows_json)}));
  const returnedRows=chunks.reduce((sum,chunk)=>sum+chunk.rows.length,0);
  const nextCursor=chunks.length?chunks.at(-1).chunkIndex+1:safeCursor;
  const hasMore=nextCursor<Number(headerRow.chunk_count);
  const header={...JSON.parse(headerRow.header_json),universeDigest:headerRow.universe_digest,contentDigest:headerRow.content_digest,
    chunkCount:Number(headerRow.chunk_count),populationN:Number(headerRow.population_n),capturedN:Number(headerRow.captured_n),
    featureN:Number(headerRow.feature_n),readbackVerified:true};
  return {ok:true,schemaVersion:C1_POPULATION_SCHEMA_VERSION,header,chunks,rows:chunks.flatMap(chunk=>chunk.rows),
    page:{cursor:safeCursor,limit:safeLimit,returnedChunks:chunks.length,returnedRows,hasMore,nextCursor:hasMore?nextCursor:null},
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}
'''.replace("__SOURCE_MAIN_SHA__", source_sha)

replace_once(
    "function selectTomorrowCandidates(marketState, todayRows, env, scanDate) {",
    helpers + "\nfunction selectTomorrowCandidates(marketState, todayRows, env, scanDate) {",
    "C1 helpers",
)

replace_once(
'''  const scored = [];
  const basePoolDiagnostics = [];''',
'''  const scored = [];
  const basePoolDiagnostics = [];
  const c1FormalResults = new Map();''',
    "C1 formal result map",
)

replace_once(
'''  for (const f of featureRows) {
    const sector = sectorStats[f.industry] || { score: 0 };
    const result = applyMarketConsensus(scoreCandidate(f, sector), consensus);''',
'''  for (const f of featureRows) {
    const sector = sectorStats[f.industry] || { score: 0 };
    const result = applyMarketConsensus(scoreCandidate(f, sector), consensus);
    c1FormalResults.set(String(f.symbol),result);''',
    "C1 capture original formal result",
)

replace_once(
'''  const shadowArchive = buildShadowCandidateArchive(featureRows,scored,basePoolDiagnostics,diagnostics.nearMisses,selected,sectorStats,rankFn,scanDate);

  diagnostics.thousandStockPool = {''',
'''  const shadowArchive = buildShadowCandidateArchive(featureRows,scored,basePoolDiagnostics,diagnostics.nearMisses,selected,sectorStats,rankFn,scanDate);
  const c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate);

  diagnostics.thousandStockPool = {''',
    "C1 build complete population",
)

replace_once(
'''    hybridWatchCandidates:hybridWatchPlans,
    diagnostics,''',
'''    hybridWatchCandidates:hybridWatchPlans,
    c1PopulationReceipt,
    diagnostics,''',
    "C1 return receipt",
)

schema_anchor = '''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_external_date
    ON trade_research_external_evidence(scan_date,cohort)`).run();'''
schema_add = schema_anchor + r'''
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_c1_generations (
    generation_id TEXT PRIMARY KEY,
    scan_date TEXT NOT NULL,
    decision_at TEXT NOT NULL,
    captured_at TEXT NOT NULL,
    source_main_sha TEXT,
    runtime_version TEXT NOT NULL,
    universe_scope TEXT NOT NULL,
    universe_digest TEXT NOT NULL,
    content_digest TEXT NOT NULL,
    population_n INTEGER NOT NULL,
    captured_n INTEGER NOT NULL,
    feature_n INTEGER NOT NULL,
    chunk_count INTEGER NOT NULL,
    completeness TEXT NOT NULL,
    header_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_c1_date
    ON trade_research_c1_generations(scan_date,created_at)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_c1_chunks (
    generation_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    row_count INTEGER NOT NULL,
    rows_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY(generation_id,chunk_index)
  )`).run();'''
replace_once(schema_anchor, schema_add, "C1 D1 schema")

replace_once(
'''    if (url.pathname === "/api/research/dashboard") {''',
'''    if (url.pathname === "/api/research/c1-population") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      const scanDateRaw=url.searchParams.get("scanDate");
      const scanDate=scanDateRaw===null?null:normalizeMarketDate(scanDateRaw);
      if(scanDateRaw!==null&&!scanDate) return json({error:"scanDate 無效"},400,true);
      try{return json(await readC1PopulationReceipt(env,{
        scanDate,generationId:url.searchParams.get("generationId"),
        cursor:url.searchParams.get("cursor"),limit:url.searchParams.get("limit")
      }),200,true)}
      catch(error){return json({ok:false,error:String(error),researchOnly:true,noPlanChanges:true,noTrade:true,noPush:true},500,true)}
    }

    if (url.pathname === "/api/research/dashboard") {''',
    "C1 protected read API",
)

replace_once(
'''  let shadowArchiveSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run" });''',
'''  let c1PopulationSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run", researchOnly:true });
  let shadowArchiveSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run" });''',
    "C1 save state",
)

replace_once(
'''  if(!dryRun) {
    try {
      shadowArchiveSave = await persistShadowCandidateArchive(env,scan.shadowArchive);''',
'''  if(!dryRun) {
    try {
      c1PopulationSave = await persistC1PopulationReceipt(env,scan.c1PopulationReceipt);
    } catch(error) {
      c1PopulationSave = {ok:false,saved:0,error:String(error).slice(0,300),researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noPush:true,noTrade:true};
    }
    try {
      shadowArchiveSave = await persistShadowCandidateArchive(env,scan.shadowArchive);''',
    "C1 fail-open persistence",
)

replace_once(
'''    researchShadowArchive: {
      generated: scan.shadowArchive?.rows?.length || 0,''',
'''    researchC1Population: {
      schemaVersion:C1_POPULATION_SCHEMA_VERSION,
      generationId:c1PopulationSave?.generationId||scan.c1PopulationReceipt?.generationId||null,
      generated:scan.c1PopulationReceipt?.populationN||0,
      featureCount:scan.c1PopulationReceipt?.featureN||0,
      saved:c1PopulationSave?.saved||0,
      chunks:c1PopulationSave?.chunks||0,
      saveOk:c1PopulationSave?.ok===true,
      readbackVerified:c1PopulationSave?.readbackVerified===true||c1PopulationSave?.deduplicated===true,
      error:c1PopulationSave?.error||null,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    },
    researchShadowArchive: {
      generated: scan.shadowArchive?.rows?.length || 0,''',
    "C1 summary",
)

text = text.replace("\r\n", "\n")
path.write_text(text, encoding="utf-8")
print("Applied V8.15.0 C1 complete-population receipts")
