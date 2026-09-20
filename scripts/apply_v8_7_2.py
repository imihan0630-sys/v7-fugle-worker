from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.7.1-history-research-v2";',
    'const VERSION = "8.7.2-shadow-candidate-firewall";',
    "runtime version"
)

replace_once(
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_snapshots_symbol
    ON trade_research_snapshots(symbol,scan_date)`).run();
  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_snapshots_symbol
    ON trade_research_snapshots(symbol,scan_date)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_shadow_candidates (
    scan_date TEXT NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT,
    cohort TEXT NOT NULL,
    cohort_rank INTEGER,
    selected_flag INTEGER NOT NULL DEFAULT 0,
    exclusion_reason TEXT,
    pool TEXT,
    snapshot_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY(scan_date,symbol)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_shadow_date_cohort
    ON trade_research_shadow_candidates(scan_date,cohort)`).run();
  D1_SCHEMA_READY = true;''',
    "shadow candidate D1 schema"
)

anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
helpers=r'''function researchStableHash(value) {
  let hash=2166136261;
  for(const ch of String(value||"")) {
    hash^=ch.charCodeAt(0);
    hash=Math.imul(hash,16777619);
  }
  return hash>>>0;
}

function buildShadowCandidateEntry(audit,cohort,cohortRank,scanDate,selectedFlag=false) {
  const f=audit?.f||{},sector=audit?.sector||{},result=audit?.result||{};
  const marketRs=Number.isFinite(f.ret20) && Number.isFinite(f.marketReturn20) ? f.ret20-f.marketReturn20 : null;
  const sectorRs=Number.isFinite(f.ret20) && Number.isFinite(f.sectorReturn20) ? f.ret20-f.sectorReturn20 : null;
  const item=result.ok ? result : {
    ...f,channel:null,signalLevel:null,priorityScore:null,rewardRisk:null,
    sectorFlow:toNumber(sector?.score),relativeStrength:marketRs,sectorRelativeStrength:sectorRs
  };
  const snapshot=buildResearchSnapshot(item,scanDate);
  snapshot.sourceCompleteness="SHADOW_PROSPECTIVE";
  snapshot.provenance={...(snapshot.provenance||{}),capturedAtSelection:true,shadowOnly:true,noForwardFill:true};
  snapshot.shadow={
    cohort,cohortRank,selectedFlag:Boolean(selectedFlag),
    exclusionReason:result.ok?null:String(result.reason||""),
    basePassed:result.basePassed===true,rrPassed:result.rrPassed===true,
    formalScoreUsed:false,tradeEligible:false,pushEligible:false
  };
  return {
    scanDate:String(scanDate),symbol:String(f.symbol||""),name:f.name||"",cohort,cohortRank,
    selectedFlag:Boolean(selectedFlag),exclusionReason:result.ok?null:String(result.reason||""),
    pool:(toNumber(f.close)||0)>=THOUSAND_STOCK_PRICE?"THOUSAND":"GENERAL",snapshot
  };
}

function buildShadowCandidateArchive(auditRows,selected,rankFn,scanDate) {
  const audits=Array.isArray(auditRows)?auditRows:[];
  const selectedSymbols=new Set((selected||[]).map(x=>String(x.symbol)));
  const used=new Set();
  const out=[];
  const add=(audit,cohort,rank,selectedFlag=false)=>{
    const symbol=String(audit?.f?.symbol||"");
    if(!symbol || used.has(symbol)) return;
    used.add(symbol);
    out.push(buildShadowCandidateEntry(audit,cohort,rank,scanDate,selectedFlag));
  };
  const bySymbol=new Map(audits.map(a=>[String(a?.f?.symbol||""),a]));
  (selected||[]).forEach((item,index)=>{
    const audit=bySymbol.get(String(item.symbol));
    if(audit) add({...audit,result:item},"SELECTED",index+1,true);
  });
  const byPool=(rows,limitEach)=>{
    const result=[];
    for(const pool of ["GENERAL","THOUSAND"]) {
      result.push(...rows.filter(a=>((toNumber(a?.f?.close)||0)>=THOUSAND_STOCK_PRICE?"THOUSAND":"GENERAL")===pool).slice(0,limitEach));
    }
    return result;
  };
  const qualified=audits.filter(a=>a?.result?.ok===true && !selectedSymbols.has(String(a?.f?.symbol||"")))
    .sort((a,b)=>rankFn(a.result,b.result));
  byPool(qualified,6).forEach((audit,index)=>add(audit,"QUALIFIED_NOT_SELECTED",index+1,false));

  const near=audits.filter(a=>a?.result?.ok!==true && a?.result?.basePassed===true &&
      String(a?.result?.reason||"").includes("A拉回承接/B突破後承接"))
    .map(a=>({...a,debug:buildChannelDebug(a.f,a.sector)}))
    .sort((a,b)=>(a.debug.missingCount-b.debug.missingCount)||(b.debug.nearScore-a.debug.nearScore)||String(a.f.symbol).localeCompare(String(b.f.symbol)));
  byPool(near,6).forEach((audit,index)=>add(audit,"NEAR_MISS",index+1,false));

  const rejected=audits.filter(a=>a?.result?.ok!==true && a?.result?.basePassed===true &&
      !String(a?.result?.reason||"").includes("A拉回承接/B突破後承接"))
    .sort((a,b)=>String(a?.result?.reason||"").localeCompare(String(b?.result?.reason||""))||String(a.f.symbol).localeCompare(String(b.f.symbol)));
  byPool(rejected,6).forEach((audit,index)=>add(audit,"REJECTED_AFTER_BASE",index+1,false));

  const controls=audits.filter(a=>{
      const f=a?.f||{};
      const minLots=(toNumber(f.close)||0)>=THOUSAND_STOCK_PRICE?300:1000;
      return !used.has(String(f.symbol||"")) && f.historyDays>=60 && (toNumber(f.close)||0)>=MIN_CLOSE_PRICE &&
        (toNumber(f.avgVolume20Lots)||0)>=minLots;
    })
    .sort((a,b)=>researchStableHash(String(scanDate)+"|"+String(a.f.symbol))-researchStableHash(String(scanDate)+"|"+String(b.f.symbol)));
  byPool(controls,6).forEach((audit,index)=>add(audit,"BROAD_CONTROL",index+1,false));

  return {
    schemaVersion:"shadow-candidate-archive-v1",scanDate:String(scanDate),researchOnly:true,decisionImpact:false,
    rows:out,
    counts:out.reduce((acc,row)=>{acc[row.cohort]=(acc[row.cohort]||0)+1;return acc},{}),
    policy:"保存正式入選、合格未入選、近失敗、基礎通過後淘汰與廣泛對照組；僅供研究，不配置資金、不推播、不交易、不改正式排名。"
  };
}

async function persistShadowCandidateArchive(env,archive) {
  const rows=Array.isArray(archive?.rows)?archive.rows:[];
  if(!env?.V7_DB || !rows.length) return {ok:false,saved:0,reason:!env?.V7_DB?"NO_D1":"EMPTY"};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const now=new Date().toISOString();
  let saved=0;
  for(const row of rows){
    await session.prepare(`INSERT INTO trade_research_shadow_candidates(
      scan_date,symbol,name,cohort,cohort_rank,selected_flag,exclusion_reason,pool,snapshot_json,created_at,updated_at
    ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?10)
    ON CONFLICT(scan_date,symbol) DO UPDATE SET
      name=excluded.name,cohort=excluded.cohort,cohort_rank=excluded.cohort_rank,selected_flag=excluded.selected_flag,
      exclusion_reason=excluded.exclusion_reason,pool=excluded.pool,snapshot_json=excluded.snapshot_json,updated_at=excluded.updated_at`)
      .bind(row.scanDate,row.symbol,row.name||"",row.cohort,journalInteger(row.cohortRank),row.selectedFlag?1:0,
        row.exclusionReason||null,row.pool||null,JSON.stringify(row.snapshot||{}),now).run();
    saved+=1;
  }
  return {ok:true,saved,scanDate:archive.scanDate,counts:archive.counts||{},researchOnly:true,noPlanChanges:true,noPush:true,noTrade:true};
}

async function readShadowCandidateSummary(env,days=180) {
  if(!env?.V7_DB) return {total:0,dates:0,byCohort:{},latestDate:null};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(730,Number(days)||180));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const result=await env.V7_DB.withSession("first-primary").prepare(`
    SELECT scan_date,cohort,pool,COUNT(*) AS count
    FROM trade_research_shadow_candidates
    WHERE scan_date>=?1
    GROUP BY scan_date,cohort,pool
    ORDER BY scan_date ASC,cohort ASC,pool ASC
  `).bind(fromDate).all();
  const rows=result?.results||[],byCohort={},byDate={};
  for(const row of rows){
    const count=Number(row.count||0);
    byCohort[row.cohort]=(byCohort[row.cohort]||0)+count;
    byDate[row.scan_date]=(byDate[row.scan_date]||0)+count;
  }
  const dates=Object.keys(byDate).sort();
  return {
    total:Object.values(byCohort).reduce((a,b)=>a+b,0),dates:dates.length,latestDate:dates.at(-1)||null,
    byCohort,byDate,
    policy:"Shadow資料只作對照與反證；不得因Shadow表現漂亮而自動改正式選股。"
  };
}

''' + anchor
replace_once(anchor,helpers,"shadow research helpers")

replace_once(
'''  const scored = [];
  const basePoolDiagnostics = [];''',
'''  const scored = [];
  const basePoolDiagnostics = [];
  const selectionAuditRows = [];''',
    "selection audit collection"
)

replace_once(
'''    const result = scoreCandidate(f, sector);
    if (result.basePassed) {''',
'''    const result = scoreCandidate(f, sector);
    selectionAuditRows.push({f,sector,result});
    if (result.basePassed) {''',
    "capture selection audit row"
)

replace_once(
'''  const selected = [...generalTop, ...thousandTop].sort(rankFn);
  const finalSymbols = new Set(selected.map(item => item.symbol));''',
'''  const selected = [...generalTop, ...thousandTop].sort(rankFn);
  const finalSymbols = new Set(selected.map(item => item.symbol));
  const shadowArchive = buildShadowCandidateArchive(selectionAuditRows,selected,rankFn,scanDate);''',
    "build shadow archive"
)

replace_once(
'''  return {
    candidates: allocateAndBuildPlans(selected, totalCapital, scanDate),
    diagnostics,
    thousandStockPool: diagnostics.thousandStockPool
  };''',
'''  return {
    candidates: allocateAndBuildPlans(selected, totalCapital, scanDate),
    diagnostics,
    thousandStockPool: diagnostics.thousandStockPool,
    shadowArchive
  };''',
    "return shadow archive"
)

replace_once(
'''  let saved = /** @type {any} */ ({ ok: false, dryRun });
  let bridge = /** @type {any} */ ({ sent: false, skipped: true, reason: dryRun ? "dry-run" : "not-run" });''',
'''  let saved = /** @type {any} */ ({ ok: false, dryRun });
  let shadowArchiveSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run" });
  let bridge = /** @type {any} */ ({ sent: false, skipped: true, reason: dryRun ? "dry-run" : "not-run" });''',
    "shadow archive save state"
)

replace_once(
'''    saved = await saveStockConfig(env, stocks, "Phase 4.3 A/B Strategy Rebase After-market Scan", totalCapital);
    bridge = await sendTo3Min(buildThreeMinPayload(marketDate,totalCapital,stocks),env);''',
'''    saved = await saveStockConfig(env, stocks, "Phase 4.3 A/B Strategy Rebase After-market Scan", totalCapital);
    try {
      shadowArchiveSave = await persistShadowCandidateArchive(env,scan.shadowArchive);
    } catch(error) {
      shadowArchiveSave = {ok:false,saved:0,error:String(error).slice(0,300),researchOnly:true,noPlanChanges:true,noPush:true,noTrade:true};
    }
    bridge = await sendTo3Min(buildThreeMinPayload(marketDate,totalCapital,stocks),env);''',
    "persist shadow archive nonblocking"
)

replace_once(
'''    thousandStockPool: scan.thousandStockPool || null,
    diagnostics: {''',
'''    thousandStockPool: scan.thousandStockPool || null,
    researchShadowArchive: {
      generated: scan.shadowArchive?.rows?.length || 0,
      generatedCounts: scan.shadowArchive?.counts || {},
      saved: shadowArchiveSave?.saved || 0,
      saveOk: shadowArchiveSave?.ok===true,
      researchOnly: true,
      decisionImpact: false
    },
    diagnostics: {''',
    "shadow archive summary"
)

replace_once(
'''async function readResearchDashboard(env,days=730) {
  const [snapshots,paths]=await Promise.all([readResearchSnapshots(env,days),readSelectionPathMetrics(env,days)]);''',
'''async function readResearchDashboard(env,days=730) {
  const [snapshots,paths,shadowCandidates]=await Promise.all([
    readResearchSnapshots(env,days),readSelectionPathMetrics(env,days),readShadowCandidateSummary(env,days)
  ]);''',
    "dashboard shadow summary load"
)

replace_once(
'''    completenessAudit,pathPerformance:paths,factorStudy:study,promotionGate:promotion,
    hypotheses:RESEARCH_FACTOR_CATALOG''',
'''    completenessAudit,shadowCandidates,pathPerformance:paths,factorStudy:study,promotionGate:promotion,
    hypotheses:RESEARCH_FACTOR_CATALOG''',
    "dashboard shadow summary payload"
)

replace_once(
'''  <div class="panel"><h2>資料完整性稽核</h2><div id="audit" class="muted"></div></div>
  <div class="panel"><h2>選股後路徑</h2>''',
'''  <div class="panel"><h2>資料完整性稽核</h2><div id="audit" class="muted"></div></div>
  <div class="panel"><h2>Shadow 對照樣本</h2><div id="shadow" class="muted"></div></div>
  <div class="panel"><h2>選股後路徑</h2>''',
    "shadow summary UI"
)

replace_once(
'''    const audit=d.completenessAudit||{};document.getElementById("audit").innerHTML="來源："+esc(Object.entries(audit.sourceCounts||{}).map(x=>x[0]+" "+x[1]).join("｜")||"-")+"<br>歷史重建未來資料違規："+esc(audit.reconstructionForwardFillViolations||0)+"<br>"+esc(audit.rule||"");
    const ps=d.pathPerformance?.summary?.horizons||{};''',
'''    const audit=d.completenessAudit||{};document.getElementById("audit").innerHTML="來源："+esc(Object.entries(audit.sourceCounts||{}).map(x=>x[0]+" "+x[1]).join("｜")||"-")+"<br>歷史重建未來資料違規："+esc(audit.reconstructionForwardFillViolations||0)+"<br>"+esc(audit.rule||"");
    const sh=d.shadowCandidates||{};document.getElementById("shadow").innerHTML="累積 "+esc(sh.total||0)+" 筆／"+esc(sh.dates||0)+" 個選股日｜"+esc(Object.entries(sh.byCohort||{}).map(x=>x[0]+" "+x[1]).join("｜")||"等待下一個正式盤後選股日")+"<br>"+esc(sh.policy||"");
    const ps=d.pathPerformance?.summary?.horizons||{};''',
    "render shadow summary"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.2 shadow candidate firewall")
