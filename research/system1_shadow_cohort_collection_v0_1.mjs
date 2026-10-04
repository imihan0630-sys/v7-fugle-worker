import {canonicalJcsJson} from './canonical_receipt_hash_v0_1.mjs';
import {buildShadowCohort,shadowHash,shadowAssert} from './system1_shadow_cohort_membership_v0_1.mjs';

// Read only: one pinned C1 generation and one append-only quality watermark.
export async function collectShadowCohortEvidence({pages,diagnosis,origin,headers,request=fetch,timeoutMs=30000}){
 const c1=pages[0].header;
 const flags={researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true,economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE'};
 if(!c1.shadowMembershipCapture)return {status:'LEGACY_NO_SHADOW_MEMBERSHIP_CAPTURE',eligibleForInference:false,...flags};
 const raw=pages.flatMap(p=>p.chunks).sort((a,b)=>a.chunkIndex-b.chunkIndex).flatMap(c=>c.rows);
 try{
   shadowAssert(pages.every(p=>canonicalJcsJson(p.header.shadowMembershipCapture??null)===canonicalJcsJson(c1.shadowMembershipCapture)),'CAPTURE_HEADER_CHANGED');
   const expected=await buildShadowCohort({...c1,rows:raw});
   const memberships=[],quality=[],seen=new Set();let cursor=0,snapshot=null;
   for(let n=0;n<30;n++){
     const url=new URL('/api/research/shadow-cohort',origin);
     url.searchParams.set('generationId',c1.generationId);url.searchParams.set('cursor',String(cursor));url.searchParams.set('limit','50');
     if(snapshot)url.searchParams.set('qualityWatermark',String(snapshot.watermark));
     const response=await request(url,{method:'GET',headers,signal:AbortSignal.timeout(timeoutMs)});
     shadowAssert(response.ok,'READ_HTTP_'+response.status);
     const page=await response.json();
     shadowAssert(page.ok===true&&page.readbackVerified===true&&page.researchOnly===true&&page.decisionImpact===false&&
       page.header?.captureGeneration===c1.generationId&&canonicalJcsJson(page.header)===canonicalJcsJson(expected.parent),'READBACK_PARENT');
     shadowAssert(Array.isArray(page.rows)&&Array.isArray(page.quality)&&page.page?.cursor===cursor&&page.page.returnedRows===page.rows.length,'READBACK_PAGE');
     snapshot??=page.qualitySnapshot;
     shadowAssert(snapshot&&canonicalJcsJson(snapshot)===canonicalJcsJson(page.qualitySnapshot),'QUALITY_SNAPSHOT_CHANGED');
     const keys=new Set(page.rows.map(m=>m.symbol+'|'+m.membershipType));
     for(const m of page.rows){const key=m.symbol+'|'+m.membershipType;shadowAssert(!seen.has(key),'DUPLICATE_PAGE_ROW');seen.add(key);memberships.push(m);}
     for(const q of page.quality){shadowAssert(keys.has(q.symbol+'|'+q.membershipType),'QUALITY_PARENT_KEYSET');quality.push(q);}
     if(page.page.hasMore===false)break;
     shadowAssert(page.page.hasMore===true&&Number.isInteger(page.page.nextCursor)&&page.page.nextCursor===cursor+page.rows.length&&
       page.page.nextCursor>cursor&&n<29,'PARTIAL_DATE');cursor=page.page.nextCursor;
   }
   memberships.sort((a,b)=>a.symbol.localeCompare(b.symbol)||a.membershipType.localeCompare(b.membershipType));
   shadowAssert(canonicalJcsJson(memberships)===canonicalJcsJson(expected.memberships),'MEMBERSHIP_COMPLETENESS_OR_CONFLICT');
   quality.sort((a,b)=>a.overlayId-b.overlayId);
   shadowAssert(new Set(quality.map(q=>q.overlayId)).size===quality.length&&quality.length===snapshot.count&&await shadowHash(quality)===snapshot.digest,'QUALITY_COMPLETENESS');
   for(const {overlayId,semanticFingerprint,...q} of quality){
     const m=memberships.find(m=>m.symbol===q.symbol&&m.membershipType===q.membershipType);
     shadowAssert(Number.isInteger(overlayId)&&overlayId>0&&overlayId<=snapshot.watermark&&q.generationId===c1.generationId&&
       q.parentSnapshotHash===m.parentSnapshotHash&&await shadowHash(q)===semanticFingerprint,'QUALITY_PROVENANCE');
   }
   return {status:'VERIFIED',parent:expected.parent,memberships,quality,qualitySnapshot:snapshot,
     independentGateEvidence:diagnosis.observations,gateEvidenceSourceContentDigest:c1.contentDigest,
     captureIntegrity:'HEALTHY',evidenceQualityEligibility:'UNKNOWN',eligibleForInference:false,
     promotionEligibility:false,historicalBackfillPerformed:false,...flags};
 }catch(error){
   return {status:'DATA_QUALITY_BLOCKED',generationId:c1.generationId,error:String(error).slice(0,240),
     eligibleForInference:false,partialDate:true,...flags};
 }
}
