import {canonicalJcsJson} from './canonical_receipt_hash_v0_1.mjs';
import {verifyValuationSourceVintage} from './system1_valuation_source_vintage_v0_1.mjs';
import {adaptC1PopulationPages} from './system1_selection_isolated_v0_1.mjs';

// Existing verified C1 pages only; no network, repair, or changes to the Class-A R2 audit.
export async function collectValuationSourceVintageEvidence(pages){
 const safety={researchOnly:true,decisionImpact:false,promotionGradeOutcomeJoin:false,economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE'};
 try{
  adaptC1PopulationPages(pages); // full parent digest/keyset/pagination verification
  const header=pages[0].header;
  if(pages.some(p=>canonicalJcsJson(p.header.valuationSourceVintage??null)!==canonicalJcsJson(header.valuationSourceVintage??null)))throw Error('VINTAGE_PAGE_HEADER_CHANGED');
  const rows=pages.flatMap(p=>p.chunks).sort((a,b)=>a.chunkIndex-b.chunkIndex).flatMap(c=>c.rows);
  const result=await verifyValuationSourceVintage({...header,rows});
  return {...safety,...result,generationId:header.generationId,sourceContentDigest:header.contentDigest,
   sourceVintage:header.valuationSourceVintage??null,
   rows:rows.filter(r=>r.valuationProvenance).map(r=>({symbol:r.symbol,valuationProvenance:r.valuationProvenance,sectorMedianPeProvenance:r.sectorMedianPeProvenance}))};
 }catch(error){return {...safety,status:'DATA_QUALITY_BLOCKED',reason:String(error).slice(0,200)};}
}
