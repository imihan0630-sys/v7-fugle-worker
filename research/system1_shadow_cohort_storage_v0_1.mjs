import {canonicalJcsJson,sha256HexUtf8} from './canonical_receipt_hash_v0_1.mjs';
import {SHADOW_MEMBERSHIP_VERSION,SHADOW_QUALITY_STATES,buildShadowCohort,shadowHash,shadowAssert} from './system1_shadow_cohort_membership_v0_1.mjs';

const flags={researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
const bytes=x=>new TextEncoder().encode(JSON.stringify(x)).byteLength;
export async function ensureShadowCohortSchema(db){
 await db.batch([
  db.prepare(`CREATE TABLE IF NOT EXISTS trade_research_population_receipts (
    scan_date TEXT NOT NULL, schema_version TEXT NOT NULL, generation_id TEXT NOT NULL UNIQUE,
    semantic_fingerprint TEXT NOT NULL, receipt_json TEXT NOT NULL,
    PRIMARY KEY(scan_date,schema_version))`),
  db.prepare(`CREATE TABLE IF NOT EXISTS trade_research_candidate_memberships (
    generation_id TEXT NOT NULL, symbol TEXT NOT NULL, membership_type TEXT NOT NULL,
    semantic_fingerprint TEXT NOT NULL, membership_json TEXT NOT NULL,
    PRIMARY KEY(generation_id,symbol,membership_type),
    FOREIGN KEY(generation_id) REFERENCES trade_research_population_receipts(generation_id))`),
  db.prepare(`CREATE TABLE IF NOT EXISTS trade_research_cohort_quality_overlays (
    overlay_id INTEGER PRIMARY KEY AUTOINCREMENT, generation_id TEXT NOT NULL, symbol TEXT NOT NULL,
    membership_type TEXT NOT NULL, quality_rule_id TEXT NOT NULL, observed_at TEXT NOT NULL,
    semantic_fingerprint TEXT NOT NULL, overlay_json TEXT NOT NULL,
    UNIQUE(generation_id,symbol,membership_type,quality_rule_id,observed_at),
    FOREIGN KEY(generation_id,symbol,membership_type) REFERENCES trade_research_candidate_memberships(generation_id,symbol,membership_type))`)
 ]);
}
export async function loadShadowC1Parent(db,generationId){
 const row=await db.prepare('SELECT * FROM trade_research_c1_generations WHERE generation_id=?1').bind(generationId).first();
 shadowAssert(row,'C1_PARENT_MISSING');
 const data=await db.prepare('SELECT chunk_index,row_count,rows_json FROM trade_research_c1_chunks WHERE generation_id=?1 ORDER BY chunk_index').bind(generationId).all();
 const chunks=data.results||[];
 shadowAssert(chunks.length===Number(row.chunk_count)&&chunks.every((c,i)=>Number(c.chunk_index)===i),'C1_PARENT_PARTIAL');
 const rows=chunks.flatMap(c=>{const r=JSON.parse(c.rows_json);shadowAssert(r.length===Number(c.row_count),'C1_CHUNK_COUNT');return r;});
 shadowAssert(rows.length===Number(row.population_n)&&rows.length===Number(row.captured_n)&&
   await sha256HexUtf8(JSON.stringify(rows))===row.content_digest&&
   await sha256HexUtf8(rows.map(r=>r.symbol).sort().join('\n'))===row.universe_digest,'C1_PARENT_DIGEST');
 const header=JSON.parse(row.header_json);
 shadowAssert(header.generationId===row.generation_id&&header.sessionDate===row.scan_date&&header.contentDigest===row.content_digest&&
   header.populationN===rows.length,'C1_PARENT_HEADER');
 return {...header,contentDigest:row.content_digest,universeDigest:row.universe_digest,readbackVerified:true,rows};
}
async function storedCohort(db,generationId){
 const row=await db.prepare('SELECT * FROM trade_research_population_receipts WHERE generation_id=?1').bind(generationId).first();
 shadowAssert(row,'GENERATION_NOT_FOUND');
 const parent=JSON.parse(row.receipt_json),{semanticFingerprint,...payload}=parent;
 shadowAssert(semanticFingerprint===row.semantic_fingerprint&&await shadowHash(payload)===semanticFingerprint&&
   parent.captureGeneration===row.generation_id&&parent.scanDate===row.scan_date,'RECEIPT_DIGEST');
 const data=await db.prepare('SELECT * FROM trade_research_candidate_memberships WHERE generation_id=?1 ORDER BY symbol,membership_type').bind(generationId).all();
 const memberships=(data.results||[]).map(r=>{
   const m=JSON.parse(r.membership_json);shadowAssert(m.symbol===r.symbol&&m.membershipType===r.membership_type&&
     m.captureGeneration===r.generation_id&&m.semanticFingerprint===r.semantic_fingerprint,'MEMBERSHIP_IDENTITY');return m;
 });
 // JS and SQLite collation are not assumed identical for every future membership label.
 memberships.sort((a,b)=>a.symbol.localeCompare(b.symbol)||a.membershipType.localeCompare(b.membershipType));
 const counts={};
 for(const m of memberships){const key=m.pool+'|'+m.membershipType;counts[key]=(counts[key]||0)+1;
   const {semanticFingerprint,...payload}=m;shadowAssert(await shadowHash(payload)===semanticFingerprint,'MEMBERSHIP_DIGEST');}
 shadowAssert(memberships.length===parent.membershipN&&await shadowHash(memberships)===parent.membershipDigest&&
   canonicalJcsJson(counts)===canonicalJcsJson(parent.expectedCounts),'MEMBERSHIP_COMPLETENESS');
 return {parent,memberships};
}
export async function persistShadowCohort(db,generationId){
 shadowAssert(db,'NO_D1');
 const receipt=await loadShadowC1Parent(db,generationId);
 const built=await buildShadowCohort(receipt),{parent,memberships}=built;
 shadowAssert(bytes(parent)<=90000&&memberships.every(m=>bytes(m)<=90000)&&bytes(built)<10000000,'STORAGE_BUDGET');
 await ensureShadowCohortSchema(db);
 const existing=await db.prepare('SELECT * FROM trade_research_population_receipts WHERE scan_date=?1 AND schema_version=?2')
   .bind(parent.scanDate,SHADOW_MEMBERSHIP_VERSION).first();
 if(existing)shadowAssert(existing.generation_id===generationId&&existing.semantic_fingerprint===parent.semanticFingerprint,'PROVENANCE_CONFLICT');
 if(!existing){
   const statements=[db.prepare(`INSERT INTO trade_research_population_receipts
     (scan_date,schema_version,generation_id,semantic_fingerprint,receipt_json) VALUES(?1,?2,?3,?4,?5)`)
     .bind(parent.scanDate,SHADOW_MEMBERSHIP_VERSION,generationId,parent.semanticFingerprint,JSON.stringify(parent))];
   for(const m of memberships)statements.push(db.prepare(`INSERT INTO trade_research_candidate_memberships
     (generation_id,symbol,membership_type,semantic_fingerprint,membership_json) VALUES(?1,?2,?3,?4,?5)`)
     .bind(generationId,m.symbol,m.membershipType,m.semanticFingerprint,JSON.stringify(m)));
   // One atomic transaction: partial inserts cannot replace/erase the first complete generation.
   try{await db.batch(statements);}catch(error){
     const raced=await db.prepare('SELECT * FROM trade_research_population_receipts WHERE scan_date=?1 AND schema_version=?2')
       .bind(parent.scanDate,SHADOW_MEMBERSHIP_VERSION).first();
     shadowAssert(raced?.generation_id===generationId&&raced?.semantic_fingerprint===parent.semanticFingerprint,'WRITE_FAILED_OR_PROVENANCE_CONFLICT');
   }
 }
 const readback=await storedCohort(db,generationId);
 shadowAssert(readback.parent.semanticFingerprint===parent.semanticFingerprint,'READBACK_CONFLICT');
 return {ok:true,generationId,semanticFingerprint:parent.semanticFingerprint,membershipN:memberships.length,
   readbackVerified:true,deduplicated:Boolean(existing),captureIntegrity:'HEALTHY',evidenceQualityEligibility:'UNKNOWN',...flags};
}
export async function appendShadowQuality(db,input,{now=Date.now()}={}){
 const {generationId,symbol,membershipType,qualityRuleId,observedAt,state,reasonCode,parentSnapshotHash}=input||{};
 shadowAssert([generationId,symbol,membershipType,qualityRuleId,reasonCode].every(x=>typeof x==='string'&&x.length>0&&x.length<=200),'QUALITY_FIELDS');
 shadowAssert(/^[A-Z0-9_:-]+$/.test(qualityRuleId)&&/^[A-Z0-9_:-]+$/.test(reasonCode),'QUALITY_REASON_CODE');
 shadowAssert(SHADOW_QUALITY_STATES.includes(state)&&typeof observedAt==='string'&&/(Z|[+-]\d{2}:\d{2})$/.test(observedAt)&&
   Number.isFinite(Date.parse(observedAt))&&Date.parse(observedAt)<=now,'QUALITY_TIME_OR_STATE');
 const member=await db.prepare('SELECT membership_json FROM trade_research_candidate_memberships WHERE generation_id=?1 AND symbol=?2 AND membership_type=?3')
   .bind(generationId,symbol,membershipType).first();
 shadowAssert(member,'QUALITY_PARENT_MISSING');
 const m=JSON.parse(member.membership_json);
 shadowAssert(m.parentSnapshotHash===parentSnapshotHash&&Date.parse(observedAt)>=Date.parse(m.knownAt),'QUALITY_PARENT_OR_PIT');
 const overlay={schemaVersion:'SYSTEM1_SHADOW_QUALITY_OVERLAY_V0_1',generationId,symbol,membershipType,qualityRuleId,
   observedAt:new Date(observedAt).toISOString(),state,reasonCode,parentSnapshotHash,annotationOnly:true,...flags};
 const fingerprint=await shadowHash(overlay),value={...overlay,semanticFingerprint:fingerprint};
 const read=()=>db.prepare(`SELECT * FROM trade_research_cohort_quality_overlays WHERE generation_id=?1 AND symbol=?2 AND membership_type=?3 AND quality_rule_id=?4 AND observed_at=?5`)
   .bind(generationId,symbol,membershipType,qualityRuleId,overlay.observedAt).first();
 let old=await read();
 if(!old){
   const count=await db.prepare('SELECT COUNT(*) AS n FROM trade_research_cohort_quality_overlays WHERE generation_id=?1').bind(generationId).first();
   shadowAssert(Number(count.n)<5000,'QUALITY_BUDGET');
   try{await db.prepare(`INSERT INTO trade_research_cohort_quality_overlays
     (generation_id,symbol,membership_type,quality_rule_id,observed_at,semantic_fingerprint,overlay_json) VALUES(?1,?2,?3,?4,?5,?6,?7)`)
     .bind(generationId,symbol,membershipType,qualityRuleId,overlay.observedAt,fingerprint,JSON.stringify(value)).run();}
   catch{old=await read();shadowAssert(old,'QUALITY_WRITE_FAILED');}
 }
 const stored=await read();shadowAssert(stored?.semantic_fingerprint===fingerprint&&stored.overlay_json===JSON.stringify(value),'QUALITY_PROVENANCE_CONFLICT');
 return {ok:true,overlayId:Number(stored.overlay_id),readbackVerified:true,deduplicated:Boolean(old),overlay:value,...flags};
}
export async function readShadowCohort(db,{generationId=null,scanDate=null,cursor=0,limit=50,qualityWatermark=null}={}){
 shadowAssert(db,'NO_D1');
 // A read never migrates schema or creates a cohort. Legacy/no-deployment is explicitly unavailable.
 if(!generationId){
   shadowAssert(typeof scanDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(scanDate),'READ_IDENTITY_REQUIRED');
   const r=await db.prepare('SELECT generation_id FROM trade_research_population_receipts WHERE scan_date=?1 AND schema_version=?2')
     .bind(scanDate,SHADOW_MEMBERSHIP_VERSION).first();generationId=r?.generation_id;
 }
 shadowAssert(generationId,'GENERATION_NOT_FOUND');
 const {parent,memberships}=await storedCohort(db,generationId);
 const c1=await loadShadowC1Parent(db,generationId);
 shadowAssert(c1.contentDigest===parent.parentContentDigest,'READ_PARENT_CHANGED');
 const raw=new Map(c1.rows.map(r=>[r.symbol,r]));
 for(const m of memberships)shadowAssert(raw.has(m.symbol)&&await shadowHash(raw.get(m.symbol))===m.parentSnapshotHash,'READ_PARENT_KEYSET');
 const offset=Number(cursor),size=Number(limit);
 shadowAssert(Number.isInteger(offset)&&offset>=0&&offset<=memberships.length&&Number.isInteger(size)&&size>=1&&size<=100,'PAGE_ARGUMENTS');
 if(qualityWatermark===null){
   shadowAssert(offset===0,'QUALITY_WATERMARK_REQUIRED');
   const latest=await db.prepare('SELECT MAX(overlay_id) AS watermark FROM trade_research_cohort_quality_overlays WHERE generation_id=?1').bind(generationId).first();
   qualityWatermark=Number(latest?.watermark||0);
 }else qualityWatermark=Number(qualityWatermark);
 shadowAssert(Number.isInteger(qualityWatermark)&&qualityWatermark>=0,'QUALITY_WATERMARK');
 const q=await db.prepare('SELECT overlay_id,overlay_json FROM trade_research_cohort_quality_overlays WHERE generation_id=?1 AND overlay_id<=?2 ORDER BY overlay_id')
   .bind(generationId,qualityWatermark).all();
 const quality=(q.results||[]).map(r=>({overlayId:Number(r.overlay_id),...JSON.parse(r.overlay_json)}));
 for(const {overlayId,semanticFingerprint,...v} of quality)shadowAssert(await shadowHash(v)===semanticFingerprint,'QUALITY_DIGEST');
 const selected=memberships.slice(offset,offset+size),keys=new Set(selected.map(m=>m.symbol+'|'+m.membershipType));
 const next=offset+selected.length;
 return {ok:true,schemaVersion:SHADOW_MEMBERSHIP_VERSION,header:parent,rows:selected,
   quality:quality.filter(q=>keys.has(q.symbol+'|'+q.membershipType)),qualitySnapshot:{watermark:qualityWatermark,count:quality.length,digest:await shadowHash(quality)},
   page:{cursor:offset,returnedRows:selected.length,hasMore:next<memberships.length,nextCursor:next<memberships.length?next:null},
   coverage:{requestedDates:[parent.scanDate],returnedDates:[parent.scanDate],expectedRows:memberships.length,returnedRows:selected.length,
     wholeGenerationVerified:true,truncated:next<memberships.length,captureIntegrity:'HEALTHY'},
   evidenceQualityEligibility:'UNKNOWN',promotionEligibility:false,readbackVerified:true,...flags};
}
