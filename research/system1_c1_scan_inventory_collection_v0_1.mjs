import {canonicalJcsJson} from './canonical_receipt_hash_v0_1.mjs';
import {adaptC1PopulationPages} from './system1_selection_isolated_v0_1.mjs';
import {verifyC1ScanInventory} from './system1_c1_scan_inventory_v0_1.mjs';
export async function collectC1ScanInventoryEvidence(pages){
 try{
  adaptC1PopulationPages(pages);
  const header=pages[0].header;
  if(pages.some(p=>canonicalJcsJson(p.header.scanInventory??null)!==canonicalJcsJson(header.scanInventory??null)))throw Error('C1_INVENTORY_PAGE_HEADER_CHANGED');
  const rows=pages.flatMap(p=>p.chunks).sort((a,b)=>a.chunkIndex-b.chunkIndex).flatMap(c=>c.rows);
  return {...await verifyC1ScanInventory({...header,rows}),sourceContentDigest:header.contentDigest};
 }catch(error){return {status:'DATA_QUALITY_BLOCKED',reason:String(error).slice(0,200),researchOnly:true,decisionImpact:false,formalCoreImpact:false,promotionGradeOutcomeJoin:false};}
}
