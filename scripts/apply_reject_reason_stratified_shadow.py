from pathlib import Path

# Research-only prototype: reason-stratified REJECTED_AFTER_BASE sampling.
# No version bump, no Formal selection/ranking/capital/signal/push changes.
# Apply only after the current production patch chain through V8.14.0.

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")

if 'const VERSION = "8.14.0-sector-gate-provenance-shadow";' not in text:
    raise SystemExit("expected V8.14.0 built Worker before reject-reason Shadow prototype")

def replace_once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text = text.replace(old, new, 1)

helper = r'''function researchStratifiedRejectSample(rows,scanDate,perReason=2) {
  const source=Array.isArray(rows)?rows:[];
  const sampleLimit=Math.max(1,Math.min(6,Math.trunc(Number(perReason)||2)));
  const poolOf=row=>(toNumber(row?.f?.close)||0)>=THOUSAND_STOCK_PRICE?"THOUSAND":"GENERAL";
  const groups=new Map();
  const populationCounts={GENERAL:{},THOUSAND:{}};

  for(const row of source) {
    const pool=poolOf(row);
    const reason=String(row?.result?.reason||"UNKNOWN");
    const key=pool+"|"+reason;
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(row);
    populationCounts[pool][reason]=(populationCounts[pool][reason]||0)+1;
  }

  const samples=[];
  for(const pool of ["GENERAL","THOUSAND"]) {
    const reasons=Object.keys(populationCounts[pool]).sort((a,b)=>a.localeCompare(b));
    for(const reason of reasons) {
      const key=pool+"|"+reason;
      const group=(groups.get(key)||[]).slice().sort((a,b)=>{
        const ah=researchStableHash(String(scanDate)+"|"+pool+"|"+reason+"|"+String(a?.f?.symbol||""));
        const bh=researchStableHash(String(scanDate)+"|"+pool+"|"+reason+"|"+String(b?.f?.symbol||""));
        return (ah-bh)||String(a?.f?.symbol||"").localeCompare(String(b?.f?.symbol||""));
      });
      const sampled=group.slice(0,sampleLimit);
      sampled.forEach((row,index)=>samples.push({
        row,pool,reason,
        reasonPopulationCount:group.length,
        reasonSampleCount:sampled.length,
        reasonSampleRank:index+1
      }));
    }
  }

  return {
    schemaVersion:"reject-reason-stratified-sample-v0.1",
    unit:"EXACT_REASON_X_PRICE_POOL",
    perReason:sampleLimit,
    outcomeSelected:false,
    populationCounts,
    samples
  };
}'''

replace_once(
'''function buildShadowCandidateArchive(featureRows,scored,basePoolDiagnostics,nearMisses,selected,sectorStats,rankFn,scanDate) {''',
helper + "\n\n" + '''function buildShadowCandidateArchive(featureRows,scored,basePoolDiagnostics,nearMisses,selected,sectorStats,rankFn,scanDate) {''',
"insert reason-stratified sampler"
)

replace_once(
'''  const baseCandidates=(basePoolDiagnostics||[])
    .filter(row=>!scoredSymbols.has(String(row?.f?.symbol||"")) && !nearSymbols.has(String(row?.f?.symbol||"")))
    .map(row=>({...row,result:scoreCandidate(row.f,row.sector)}))
    .filter(row=>row.result?.ok!==true && row.result?.basePassed===true)
    .sort((a,b)=>String(a.result?.reason||"").localeCompare(String(b.result?.reason||""))||String(a.f.symbol).localeCompare(String(b.f.symbol)));
  byPool(baseCandidates,6,x=>x.f).forEach((row,index)=>add(row.f,row.result,"REJECTED_AFTER_BASE",index+1,false));''',
'''  const baseCandidates=(basePoolDiagnostics||[])
    .filter(row=>!scoredSymbols.has(String(row?.f?.symbol||"")) && !nearSymbols.has(String(row?.f?.symbol||"")) && !used.has(String(row?.f?.symbol||"")))
    .map(row=>({...row,result:scoreCandidate(row.f,row.sector)}))
    .filter(row=>row.result?.ok!==true && row.result?.basePassed===true);

  const rejectedReasonSampling=researchStratifiedRejectSample(baseCandidates,scanDate,2);
  let rejectedAfterBaseRank=0;
  for(const sample of rejectedReasonSampling.samples) {
    const before=out.length;
    rejectedAfterBaseRank+=1;
    add(sample.row.f,sample.row.result,"REJECTED_AFTER_BASE",rejectedAfterBaseRank,false);
    if(out.length>before) {
      const entry=out[out.length-1];
      entry.snapshot.shadow={
        ...(entry.snapshot.shadow||{}),
        samplingVersion:"REJECT_REASON_STRATIFIED_V0_1",
        samplingUnit:"EXACT_REASON_X_PRICE_POOL",
        reasonPopulationCount:sample.reasonPopulationCount,
        reasonSampleCount:sample.reasonSampleCount,
        reasonSampleRank:sample.reasonSampleRank,
        outcomeSelected:false,
        fullFormalCounterfactual:false,
        note:"Population count is for the generic REJECTED_AFTER_BASE population after dedicated earlier cohorts/used-symbol exclusions."
      };
    }
  }''',
"replace reason-order truncation with reason-stratified sampling"
)

replace_once(
'''  return {
    schemaVersion:"shadow-candidate-archive-v1",scanDate:String(scanDate),researchOnly:true,decisionImpact:false,
    rows:out,
    counts:out.reduce((acc,row)=>{acc[row.cohort]=(acc[row.cohort]||0)+1;return acc},{}),
    policy:"保存正式入選、合格未入選、近失敗、基礎通過後淘汰與廣泛對照組；僅供研究，不配置資金、不推播、不交易、不改正式排名。"
  };''',
'''  return {
    schemaVersion:"shadow-candidate-archive-v1",scanDate:String(scanDate),researchOnly:true,decisionImpact:false,
    rows:out,
    counts:out.reduce((acc,row)=>{acc[row.cohort]=(acc[row.cohort]||0)+1;return acc},{}),
    rejectedReasonPopulationCounts:rejectedReasonSampling.populationCounts,
    rejectedReasonSampling:{
      schemaVersion:rejectedReasonSampling.schemaVersion,
      unit:rejectedReasonSampling.unit,
      perReason:rejectedReasonSampling.perReason,
      outcomeSelected:false
    },
    policy:"保存正式入選、合格未入選、近失敗、基礎通過後淘汰與廣泛對照組；REJECTED_AFTER_BASE依exact reason×價格池分層抽樣並保留reason母體計數；僅供研究，不配置資金、不推播、不交易、不改正式排名。"
  };''',
"expose reject-reason population counts"
)

replace_once(
'''      generatedCounts: scan.shadowArchive?.counts || {},
      saved: shadowArchiveSave?.saved || 0,''',
'''      generatedCounts: scan.shadowArchive?.counts || {},
      rejectedReasonPopulationCounts: scan.shadowArchive?.rejectedReasonPopulationCounts || {},
      rejectedReasonSampling: scan.shadowArchive?.rejectedReasonSampling || null,
      saved: shadowArchiveSave?.saved || 0,''',
"scan summary reject-reason denominator"
)

replace_once(
'''    SELECT scan_date,cohort,pool,COUNT(*) AS count
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
  }''',
'''    SELECT scan_date,cohort,pool,exclusion_reason,COUNT(*) AS count
    FROM trade_research_shadow_candidates
    WHERE scan_date>=?1
    GROUP BY scan_date,cohort,pool,exclusion_reason
    ORDER BY scan_date ASC,cohort ASC,pool ASC,exclusion_reason ASC
  `).bind(fromDate).all();
  const rows=result?.results||[],byCohort={},byDate={},byExclusionReasonSample={};
  for(const row of rows){
    const count=Number(row.count||0);
    byCohort[row.cohort]=(byCohort[row.cohort]||0)+count;
    byDate[row.scan_date]=(byDate[row.scan_date]||0)+count;
    if(row.cohort==="REJECTED_AFTER_BASE") {
      const reason=String(row.exclusion_reason||"UNKNOWN");
      byExclusionReasonSample[reason]=(byExclusionReasonSample[reason]||0)+count;
    }
  }''',
"summary query by exclusion reason"
)

replace_once(
'''    byCohort,byDate,
    policy:"Shadow資料只作對照與反證；不得因Shadow表現漂亮而自動改正式選股。"''',
'''    byCohort,byDate,byExclusionReasonSample,
    rejectedReasonSampleOnly:true,
    policy:"Shadow資料只作對照與反證；REJECTED_AFTER_BASE顯示的是reason-stratified sample，母體計數以當日researchShadowArchive/reasonPopulationCount為準；不得因Shadow表現漂亮而自動改正式選股。"''',
"summary sample semantics"
)

path.write_text(text, encoding="utf-8")
print("Applied research-only reject-reason stratified Shadow prototype")
