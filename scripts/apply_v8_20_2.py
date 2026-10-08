"""System1 V8.20.2 idempotent D1 snapshot persistence.
Avoids duplicate quality/institution writes when validated payload is byte-identical.
Formal selection core remains unchanged.
"""
from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected one anchor, got {count}")
    text=text.replace(old,new,1)

Path("artifacts").mkdir(exist_ok=True)
Path("artifacts/Worker-before-v8_20_2.mjs").write_text(text,encoding="utf-8")

once(
  'const VERSION = "8.20.1-cross-midnight-recovery-readback";',
  'const VERSION = "8.20.2-idempotent-d1-snapshots";',
  "runtime version"
)

old_quality='''async function writeQualitySnapshot(env,kind,date,data) {
  if(!env.V7_DB) throw new Error("品質資料需要既有V7_DB");
  await ensureD1Schema(env);
  await env.V7_DB.withSession("first-primary").prepare(`INSERT INTO v7_quality_snapshots(dataset_key,market_date,snapshot_json,updated_at)
    VALUES(?1,?2,?3,?4) ON CONFLICT(dataset_key,market_date) DO UPDATE SET snapshot_json=excluded.snapshot_json,updated_at=excluded.updated_at`)
    .bind(kind,date,JSON.stringify(data),new Date().toISOString()).run();
}'''
new_quality='''async function writeQualitySnapshot(env,kind,date,data) {
  if(!env.V7_DB) throw new Error("品質資料需要既有V7_DB");
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const snapshotJson=JSON.stringify(data);
  const existing=await session.prepare("SELECT snapshot_json FROM v7_quality_snapshots WHERE dataset_key=?1 AND market_date=?2")
    .bind(kind,date).first();
  if(existing?.snapshot_json===snapshotJson)
    return {stored:false,deduplicated:true,writeRowsAvoided:1};
  await session.prepare(`INSERT INTO v7_quality_snapshots(dataset_key,market_date,snapshot_json,updated_at)
    VALUES(?1,?2,?3,?4) ON CONFLICT(dataset_key,market_date) DO UPDATE SET snapshot_json=excluded.snapshot_json,updated_at=excluded.updated_at`)
    .bind(kind,date,snapshotJson,new Date().toISOString()).run();
  return {stored:true,deduplicated:false,writeRowsAvoided:0};
}'''
once(old_quality,new_quality,"quality snapshot idempotency")

old_inst='''  const session = env.V7_DB.withSession("first-primary");
  await session.prepare(`
    INSERT INTO v7_institution_snapshots (market_date, snapshot_json, stock_count, updated_at)
    VALUES (?1, ?2, ?3, ?4)
    ON CONFLICT(market_date) DO UPDATE SET
      snapshot_json = excluded.snapshot_json,
      stock_count = excluded.stock_count,
      updated_at = excluded.updated_at
    WHERE excluded.stock_count >= ?5 OR v7_institution_snapshots.stock_count < ?5
  `).bind(String(marketDate), JSON.stringify(clean), Object.keys(clean).length, new Date().toISOString(),INSTITUTION_SNAPSHOT_MIN_STOCKS).run();
  return { stored: true, stockCount: Object.keys(clean).length };'''
new_inst='''  const session = env.V7_DB.withSession("first-primary");
  const snapshotJson=JSON.stringify(clean),stockCount=Object.keys(clean).length;
  const existing=await session.prepare("SELECT snapshot_json, stock_count FROM v7_institution_snapshots WHERE market_date=?1")
    .bind(String(marketDate)).first();
  if(existing?.snapshot_json===snapshotJson && Number(existing?.stock_count)===stockCount)
    return {stored:false,deduplicated:true,stockCount,writeRowsAvoided:1};
  await session.prepare(`
    INSERT INTO v7_institution_snapshots (market_date, snapshot_json, stock_count, updated_at)
    VALUES (?1, ?2, ?3, ?4)
    ON CONFLICT(market_date) DO UPDATE SET
      snapshot_json = excluded.snapshot_json,
      stock_count = excluded.stock_count,
      updated_at = excluded.updated_at
    WHERE excluded.stock_count >= ?5 OR v7_institution_snapshots.stock_count < ?5
  `).bind(String(marketDate),snapshotJson,stockCount,new Date().toISOString(),INSTITUTION_SNAPSHOT_MIN_STOCKS).run();
  return {stored:true,deduplicated:false,stockCount,writeRowsAvoided:0};'''
once(old_inst,new_inst,"institution snapshot idempotency")

once(
'''        const validated=validateOfficialQualityData(body,marketDate);
        await writeQualitySnapshot(env,body.kind,marketDate,validated);
        const readback=await readQualitySnapshot(env,body.kind,marketDate);''',
'''        const validated=validateOfficialQualityData(body,marketDate);
        const persistence=await writeQualitySnapshot(env,body.kind,marketDate,validated);
        const readback=await readQualitySnapshot(env,body.kind,marketDate);''',
"quality route persistence receipt"
)
once(
'''        return json({ok:true,verified:true,kind:body.kind,marketDate,count:validated.count,asOfDate:validated.asOfDate,noPlanChanges:true},200,true);''',
'''        return json({ok:true,verified:true,kind:body.kind,marketDate,count:validated.count,asOfDate:validated.asOfDate,
          stored:persistence.stored,deduplicated:persistence.deduplicated,writeRowsAvoided:persistence.writeRowsAvoided,noPlanChanges:true},200,true);''',
"quality route dedup response"
)
once(
'''        const validated=validateInstitutionData(body,date);
        await writeInstitutionSnapshot(env,date,validated.stocks);
        const actual=(await readInstitutionSnapshotRows(env,date,1))[0];''',
'''        const validated=validateInstitutionData(body,date);
        const persistence=await writeInstitutionSnapshot(env,date,validated.stocks);
        const actual=(await readInstitutionSnapshotRows(env,date,1))[0];''',
"institution route persistence receipt"
)
once(
'''        return json({ok:true,verified:true,marketDate:date,counts:validated.counts,streak:{ready:streak.ready,validDates:streak.validDates,missingDates:streak.missingDates},noPlanChanges:true},200,true);''',
'''        return json({ok:true,verified:true,marketDate:date,counts:validated.counts,
          stored:persistence.stored,deduplicated:persistence.deduplicated,writeRowsAvoided:persistence.writeRowsAvoided,
          streak:{ready:streak.ready,validDates:streak.validDates,missingDates:streak.missingDates},noPlanChanges:true},200,true);''',
"institution route dedup response"
)

path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.20.2 idempotent D1 snapshots; Formal Core unchanged")
