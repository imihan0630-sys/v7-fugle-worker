import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {collectVerifiedC1C2} from '../research/system1_c1_c2_collection_v0_1.mjs';
const day='2026-10-01',generationId='C1:2026-10-01:fixture';
const rows=[{symbol:'2006',feature:{close:100,historyDays:null},formalResult:{ok:false,firstFailure:'HISTORY_BLOCKED',selected:false},safety:{}},
  {symbol:'2330',feature:{close:1000,historyDays:null},formalResult:{ok:false,firstFailure:'HISTORY_BLOCKED',selected:false},safety:{}}];
const sha=s=>createHash('sha256').update(s).digest('hex');
const header={generationId,sessionDate:day,decisionAt:day+'T10:00:00Z',readbackVerified:true,
  sourceMainSha:'a'.repeat(40),contentDigest:sha(JSON.stringify(rows)),universeDigest:sha('2006\n2330'),
  populationN:2,capturedN:2,chunkCount:2,completeness:'IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE'};
const pages=rows.map((row,i)=>({ok:true,header,chunks:[{chunkIndex:i,rowCount:1,rows:[row]}],
  page:{hasMore:i===0,nextCursor:i===0?1:null}}));
const scan={scanDate:day,dryRun:false,pipeline:{complete:true},config:{verified:true},
  researchC1Population:{generationId,generated:2,saved:2,saveOk:true,readbackVerified:true}};
const calls=[];
function requestWith({pageChange=x=>x,scanChange=x=>x,transportFail=false,jsonFail=false,status=200}={}){
  return async (url,options)=>{
    assert.equal(options.method,'GET');calls.push(String(url));
    if(transportFail) throw new Error('transport fixture SECRET');
    const u=new URL(url),value=u.pathname==='/api/scan/status'?scanChange(structuredClone(scan)):
      pageChange(structuredClone(pages[Number(u.searchParams.get('cursor'))]),u);
    return {ok:status===200,status,json:async()=>{if(jsonFail)throw Error('SECRET');return value;}};
  };
}
const collect=request=>collectVerifiedC1C2({origin:'https://fixture.invalid',token:'SECRET',scanDate:day,request});
let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const good=await collect(requestWith());
eq(good.paired.generationId,header.generationId);eq(good.paired.sourceContentDigest,header.contentDigest);
eq(good.diagnosis.populationN,good.paired.tally.populationN);eq(good.paired.tally.shortGateCounts.UNKNOWN,2);
eq(good.paired.pairs.every(p=>p.buyAuthorized===false&&p.allocation===0),true);
eq(good.paired.economicSuperiority,'UNKNOWN');eq(JSON.stringify(good).includes('SECRET'),false);
eq(new URL(calls[1]).searchParams.get('generationId'),generationId);
async function reject(request,pattern){await assert.rejects(()=>collect(request),pattern);n++;}
await reject(requestWith({scanChange:x=>({...x,pipeline:{complete:false}})}),/PIPELINE_UNVERIFIED/);
await reject(requestWith({scanChange:x=>({...x,dryRun:true})}),/PIPELINE_UNVERIFIED/);
await reject(requestWith({scanChange:x=>({...x,researchC1Population:{...x.researchC1Population,generationId:'different'}})}),/GENERATION_UNLINKED/);
await reject(requestWith({scanChange:x=>({...x,researchC1Population:{...x.researchC1Population,saved:1}})}),/GENERATION_UNLINKED/);
await reject(requestWith({pageChange:x=>({...x,header:{...x.header,sessionDate:'2026-09-30'}})}),/SESSION_MISMATCH/);
await reject(requestWith({pageChange:(x,u)=>u.searchParams.get('cursor')==='1'?{...x,header:{...x.header,decisionAt:day+'T11:00:00Z'}}:x}),/HEADER_MISMATCH/);
await reject(requestWith({pageChange:x=>({...x,page:{hasMore:false}})}),/CHUNK_COVERAGE_INCOMPLETE/);
await reject(requestWith({pageChange:x=>({...x,page:{hasMore:true,nextCursor:0}})}),/PAGINATION_INVALID/);
await reject(requestWith({pageChange:x=>({...x,ok:false,error:'C1_GENERATION_NOT_FOUND'})}),/GENERATION_NOT_FOUND/);
await reject(requestWith({transportFail:true}),/C1_TRANSPORT_FAILED/);
await reject(requestWith({jsonFail:true}),/C1_INVALID_JSON/);
await reject(requestWith({status:401}),/AUTHORIZATION_BLOCKED/);
console.log(JSON.stringify({ok:true,assertions:n,fixtureOnly:true,GETOnly:true,noHistoricalWatch:true,formalCoreImpact:false}));
