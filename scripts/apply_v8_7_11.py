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
    'const VERSION = "8.7.10-research-readiness-matrix";',
    'const VERSION = "8.7.11-cross-market-evidence-provenance";',
    "runtime version"
)

helpers=Path("research/cross_market_evidence_v8_7_11.js").read_text(encoding="utf-8").strip()
anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
replace_once(anchor,helpers+"\n\n"+anchor,"cross-market evidence helpers")

replace_once(
'''      const evidenceBundle = await collectResearchExternalEvidence(scan.shadowArchive);''',
'''      const evidenceBundle = await collectResearchExternalEvidenceV8711(scan.shadowArchive);''',
    "use V8.7.11 evidence collector"
)

replace_once(
'''    externalEvidenceCoverage:researchExternalEvidenceCoverage(outcomes),''',
'''    externalEvidenceCoverage:researchExternalEvidenceCoverageV8711(outcomes),''',
    "use V8.7.11 evidence coverage"
)

replace_once(
'''    readResearchExternalEvidenceSummary(env,Math.min(180,Math.max(1,Number(days)||180)))''',
'''    readResearchExternalEvidenceSummaryV8711(env,Math.min(180,Math.max(1,Number(days)||180)))''',
    "use V8.7.11 evidence summary"
)

replace_once(
'''    document.getElementById("externalEvidence").innerHTML="狀態："+esc(ee.status||"-")+"｜累積 "+esc(ee.total||0)+" 筆／"+esc(ee.dates||0)+" 日｜營收可用 "+esc(ee.revenueAvailable||0)+"｜融資券可用 "+esc(ee.marginAvailable||0)+"｜注意旗標 "+esc(ee.attentionFlags||0)+"｜處置旗標 "+esc(ee.dispositionFlags||0)+"<br>"+esc(ee.policy||"");''',
'''    document.getElementById("externalEvidence").innerHTML="狀態："+esc(ee.status||"-")+"｜累積 "+esc(ee.total||0)+" 筆／"+esc(ee.dates||0)+" 日｜上市營收 "+esc(ee.twseRevenueAvailable||0)+"｜上櫃營收 "+esc(ee.tpexRevenueAvailable||0)+"｜實際SBL賣出 "+esc(ee.actualSblShortAvailable||0)+"｜TPEX SBL待補 "+esc(ee.tpexSblUnknown||0)+"｜融資券 "+esc(ee.marginAvailable||0)+"｜注意旗標 "+esc(ee.attentionFlags||0)+"｜處置旗標 "+esc(ee.dispositionFlags||0)+"<br>"+esc(ee.policy||"");''',
    "render cross-market evidence coverage"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.11 cross-market evidence provenance")
