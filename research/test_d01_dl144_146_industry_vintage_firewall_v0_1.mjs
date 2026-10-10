// D01 DL-144~146 standalone deterministic fixture oracle.
// Class-A research only. No market data, outcome joins, runtime integration or formal decisions.
import assert from 'node:assert/strict';

const day = (s) => Date.parse(s + 'T00:00:00+08:00');
const oldRow = {
  securityIdentity:'TW-TPEX-1595', market:'TPEX', scheme:'TPEX_OFFICIAL',
  taxonomyVersion:'2026-vintage', sector:'ELECTRONIC_COMPONENTS',
  effectiveFrom:'2020-01-01', effectiveToExclusive:'2026-06-01',
  firstKnownAt:'2020-01-01', receiptId:'old-1595', sourceOwner:'D09'
};
const newRow = {
  ...oldRow, sector:'SEMICONDUCTORS',
  effectiveFrom:'2026-06-01', effectiveToExclusive:null,
  firstKnownAt:'2026-05-20', receiptId:'new-1595'
};
function selectSector(q, rows, coverageComplete=true) {
  if (!coverageComplete) return {state:'INDUSTRY_COVERAGE_PARTIAL'};
  const scoped=rows.filter(r=>r.securityIdentity===q.securityIdentity && r.market===q.market);
  const relevant=scoped.filter(r=>day(r.effectiveFrom)<=day(q.at)
    && (r.effectiveToExclusive===null || day(q.at)<day(r.effectiveToExclusive)));
  const candidates=relevant.filter(r=>r.scheme===q.scheme && r.taxonomyVersion===q.taxonomyVersion);
  if(!candidates.length) {
    if(relevant.length) return {state:'INDUSTRY_TAXONOMY_BRIDGE_UNKNOWN_BLOCKED'};
    return {state:'INDUSTRY_MEMBERSHIP_UNKNOWN_BLOCKED'};
  }
  const available=candidates.filter(r=>day(r.firstKnownAt)<=day(q.at));
  if(!available.length) return {state:'INDUSTRY_SOURCE_NOT_YET_AVAILABLE'};
  if(available.length!==1) return {state:'INDUSTRY_MEMBERSHIP_CONFLICT_BLOCKED'};
  const picked=available[0];
  return {state:'INDUSTRY_VINTAGE_ACTIVE_CERTIFIED',sector:picked.sector,
    receiptId:picked.receiptId,
    futureKnownAnnouncement:scoped.some(r=>day(r.effectiveFrom)>day(q.at) && day(r.firstKnownAt)<=day(q.at))};
}
function patternReclassGuard(x) {
  if(!x.sameSecurity) return {state:'SEPARATE_SECURITY',newEpisode:false};
  if(x.priceHistoryChanged) return {state:'PRICE_HISTORY_DIFFERENT_REPLAY_REQUIRED',newEpisode:false};
  if(x.ownerCertifiedIssuerRegimeBreak) return {state:'DEFER_TO_DL138_REGIME',newEpisode:false};
  // Industry alone neither resets patterns nor proves issuer economic continuity.
  return {state:'SAME_PRICE_PATTERN_ROOT',newEpisode:false,independentVoteAdded:false};
}
function commonSupport(parent,child) {
  for (const k of ['securityIdentity','predictorCutoff','exactSessionHash',
    'sourceHistoryHash','priceRoot','sectorReceiptId','taxonomyVersion',
    'membershipMaskHash','peerUniverseHash','selfExclusionRule',
    'denominatorState','costPolicy','horizon']) {
    if (parent[k]===undefined || child[k]===undefined || parent[k]===null || child[k]===null)
      return {state:'SUPPORT_UNKNOWN_BLOCKED',field:k};
    if (parent[k]!==child[k]) return {state:'SUPPORT_MISMATCH_BLOCKED',field:k};
  }
  if(parent.denominatorState!=='COMPLETE')
    return {state:'SUPPORT_UNKNOWN_BLOCKED',field:'denominatorState'};
  return {state:'SAME_SUPPORT'};
}
function independentCount(nodes) {
  // Price-derived siblings never earn additional votes merely by domain/label.
  // Industry data can be considered independent only after D16 residual evidence.
  const certified=new Set();
  for (const n of nodes) {
    if(n.root==='PRICE_OHLC') certified.add('PRICE_OHLC');
    else if(n.residualVerified===true) certified.add(n.root);
  }
  return certified.size;
}
const q = (at,more={}) => ({at,securityIdentity:'TW-TPEX-1595',
  market:'TPEX',scheme:'TPEX_OFFICIAL',taxonomyVersion:'2026-vintage',...more});
const support = {
 securityIdentity:'TW-TPEX-1595',predictorCutoff:'2026-06-02',
 exactSessionHash:'s1',sourceHistoryHash:'h1',priceRoot:'PRICE_OHLC',
 sectorReceiptId:'new-1595',taxonomyVersion:'2026-vintage',
 membershipMaskHash:'m1',peerUniverseHash:'p1',selfExclusionRule:'EXCLUDE_SELF',
 denominatorState:'COMPLETE',costPolicy:'FROZEN',horizon:'D5'
};
const cases=[
 ['pre-effective old classification',()=>assert.equal(selectSector(q('2026-05-18'),[oldRow,newRow]).sector,'ELECTRONIC_COMPONENTS')],
 ['post-announcement but pre-effective old',()=>assert.equal(selectSector(q('2026-05-25'),[oldRow,newRow]).sector,'ELECTRONIC_COMPONENTS')],
 ['future announcement noted, not activated',()=>assert.equal(selectSector(q('2026-05-25'),[oldRow,newRow]).futureKnownAnnouncement,true)],
 ['effective boundary exact new',()=>assert.equal(selectSector(q('2026-06-01'),[oldRow,newRow]).sector,'SEMICONDUCTORS')],
 ['prior session end-exclusive old',()=>assert.equal(selectSector(q('2026-06-01'),[oldRow]).state,'INDUSTRY_MEMBERSHIP_UNKNOWN_BLOCKED')],
 ['post-effective new',()=>assert.equal(selectSector(q('2026-06-02'),[oldRow,newRow]).receiptId,'new-1595')],
 ['as-of availability later than effective blocks',()=>assert.equal(selectSector(q('2026-06-01'),[oldRow,{...newRow,firstKnownAt:'2026-06-03'}]).state,'INDUSTRY_SOURCE_NOT_YET_AVAILABLE')],
 ['current label cannot backfill',()=>assert.equal(selectSector(q('2025-06-01'),[newRow]).state,'INDUSTRY_MEMBERSHIP_UNKNOWN_BLOCKED')],
 ['same symbol across exchanges no identity joining',()=>assert.equal(selectSector(q('2026-06-02',{market:'TWSE'}),[newRow]).state,'INDUSTRY_MEMBERSHIP_UNKNOWN_BLOCKED')],
 ['different security same issuer not same',()=>assert.equal(selectSector(q('2026-06-02',{securityIdentity:'OTHER'}),[newRow]).state,'INDUSTRY_MEMBERSHIP_UNKNOWN_BLOCKED')],
 ['taxonomy mismatch not silently bridged',()=>assert.equal(selectSector(q('2026-06-02',{taxonomyVersion:'other'}),[newRow]).state,'INDUSTRY_TAXONOMY_BRIDGE_UNKNOWN_BLOCKED')],
 ['classification scheme mismatch not silently bridged',()=>assert.equal(selectSector(q('2026-06-02',{scheme:'TWSE_OFFICIAL'}),[newRow]).state,'INDUSTRY_TAXONOMY_BRIDGE_UNKNOWN_BLOCKED')],
 ['incomplete owner coverage blocks',()=>assert.equal(selectSector(q('2026-06-02'),[newRow],false).state,'INDUSTRY_COVERAGE_PARTIAL')],
 ['overlap conflict cannot pick attractive one',()=>assert.equal(selectSector(q('2026-06-02'),[newRow,{...newRow,sector:'OTHER',receiptId:'conflict'}]).state,'INDUSTRY_MEMBERSHIP_CONFLICT_BLOCKED')],
 ['sector change no pattern episode reset',()=>assert.equal(patternReclassGuard({sameSecurity:true,priceHistoryChanged:false}).newEpisode,false)],
 ['sector change no added independent vote',()=>assert.equal(patternReclassGuard({sameSecurity:true,priceHistoryChanged:false}).independentVoteAdded,false)],
 ['separate securities not stitched',()=>assert.equal(patternReclassGuard({sameSecurity:false,priceHistoryChanged:false}).state,'SEPARATE_SECURITY')],
 ['changed price path demands separate replay',()=>assert.equal(patternReclassGuard({sameSecurity:true,priceHistoryChanged:true}).state,'PRICE_HISTORY_DIFFERENT_REPLAY_REQUIRED')],
 ['issuer event routed to DL138 not inferred by price',()=>assert.equal(patternReclassGuard({sameSecurity:true,priceHistoryChanged:false,ownerCertifiedIssuerRegimeBreak:true}).state,'DEFER_TO_DL138_REGIME')],
 ['same parent child PIT support',()=>assert.equal(commonSupport(support,{...support}).state,'SAME_SUPPORT')],
 ['different vintage receipt blocks',()=>assert.deepEqual(commonSupport(support,{...support,sectorReceiptId:'old-1595'}),{state:'SUPPORT_MISMATCH_BLOCKED',field:'sectorReceiptId'})],
 ['different peer universe blocks',()=>assert.equal(commonSupport(support,{...support,peerUniverseHash:'p2'}).state,'SUPPORT_MISMATCH_BLOCKED')],
 ['different self inclusion rule blocks',()=>assert.equal(commonSupport(support,{...support,selfExclusionRule:'INCLUDE_SELF'}).state,'SUPPORT_MISMATCH_BLOCKED')],
 ['different source history blocks',()=>assert.equal(commonSupport(support,{...support,sourceHistoryHash:'h2'}).state,'SUPPORT_MISMATCH_BLOCKED')],
 ['different session set blocks',()=>assert.equal(commonSupport(support,{...support,exactSessionHash:'s2'}).state,'SUPPORT_MISMATCH_BLOCKED')],
 ['UNKNOWN denominator blocks',()=>assert.equal(commonSupport(support,{...support,denominatorState:'UNKNOWN'}).state,'SUPPORT_UNKNOWN_BLOCKED')],
 ['missing industry receipt blocks conditional support',()=>{const o={...support};delete o.sectorReceiptId;assert.deepEqual(commonSupport(support,o),{state:'SUPPORT_UNKNOWN_BLOCKED',field:'sectorReceiptId'});} ],
 ['price pattern plus momentum same root one vote',()=>assert.equal(independentCount([{root:'PRICE_OHLC',name:'pattern'},{root:'PRICE_OHLC',name:'momentum'}]),1)],
 ['unverified sector confirmation cannot add a vote',()=>assert.equal(independentCount([{root:'PRICE_OHLC'},{root:'SECTOR_RETURN',residualVerified:false}]),1)],
 ['genuinely separately verified residual distinct only after D16',()=>assert.equal(independentCount([{root:'PRICE_OHLC'},{root:'SECTOR_RESIDUAL_EX_SELF',residualVerified:true}]),2)],
];
let failed=0;
for (const [name,fn] of cases) {try {fn();process.stdout.write('PASS '+name+'\n');} catch(e) {failed++;process.stderr.write('FAIL '+name+': '+e.message+'\n');}}
process.stdout.write('D01 DL-144~146: '+(cases.length-failed)+'/'+cases.length+' PASS; failures='+failed+'\n');
if(failed) process.exitCode=1;
