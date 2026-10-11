// D01 DL-147~149 taxonomy bridge and sector-context adversarial oracle.
// Class A research only; synthetic fixtures, no market returns or Formal logic.
import assert from 'node:assert/strict';

const t = x => Date.parse(x);
const atDay = x => Date.parse(x+'T00:00:00+08:00');
const bridge = {
  securityIdentity:'TW-TPEX-1595', fromScheme:'TPEX_OFFICIAL', fromVersion:'V2025',
  toScheme:'TPEX_OFFICIAL', toVersion:'V2026', fromSector:'ELECTRONIC_COMPONENTS',
  toSector:'SEMICONDUCTORS', effectiveFrom:'2026-06-01', effectiveToExclusive:null,
  firstKnownAt:'2026-05-20T09:00:00+08:00', certified:true, relation:'ONE_TO_ONE',
  receiptId:'owner-bridge-1', sourceHash:'hash-1', owner:'D09', coverage:'COMPLETE',
  peerUniverseHash:'peers-v2026', parentRoot:'PRICE_OHLC'
};
function resolveBridge(q, rows) {
  if(q.fromScheme===q.toScheme && q.fromVersion===q.toVersion)
    return {state:'SAME_TAXONOMY_NO_BRIDGE',independentVote:false};
  const related=rows.filter(r=>r.securityIdentity===q.securityIdentity &&
    r.fromScheme===q.fromScheme && r.fromVersion===q.fromVersion &&
    r.toScheme===q.toScheme && r.toVersion===q.toVersion);
  const active=related.filter(r=>atDay(r.effectiveFrom)<=t(q.cutoff) &&
    (!r.effectiveToExclusive || t(q.cutoff)<atDay(r.effectiveToExclusive)));
  if(!active.length) return {state:'BRIDGE_UNKNOWN',independentVote:false};
  const valid=active.filter(r=>r.firstKnownAt.includes('T') && t(r.firstKnownAt)<=t(q.cutoff));
  if(!valid.length) return {state:active.some(r=>!r.firstKnownAt.includes('T'))?'BRIDGE_TIME_PRECISION_UNKNOWN':'BRIDGE_NOT_YET_KNOWN',independentVote:false};
  if(valid.length>1) return {state:'BRIDGE_CONFLICT_BLOCKED',independentVote:false};
  const r=valid[0];
  if(!r.certified || !r.receiptId || !r.sourceHash || r.owner!=='D09')
    return {state:'BRIDGE_SOURCE_UNKNOWN',independentVote:false};
  if(r.coverage!=='COMPLETE' || !r.peerUniverseHash)
    return {state:'BRIDGE_COVERAGE_UNKNOWN',independentVote:false};
  if(r.relation!=='ONE_TO_ONE') return {state:'BRIDGE_NON_BIJECTIVE_NEEDS_OWNER_DECOMPOSITION',independentVote:false};
  if(r.parentRoot!=='PRICE_OHLC') return {state:'BRIDGE_PRICE_ROOT_CONFLICT',independentVote:false};
  return {state:'BRIDGE_CONTEXT_CERTIFIED',receiptId:r.receiptId,
    peerUniverseHash:r.peerUniverseHash,independentVote:false};
}
const query=(cutoff,extra={})=>({
 securityIdentity:'TW-TPEX-1595',fromScheme:'TPEX_OFFICIAL',fromVersion:'V2025',
 toScheme:'TPEX_OFFICIAL',toVersion:'V2026',cutoff,...extra
});
function geometryGuard(x) {
  if(x.securityIdentityChanged) return {state:'DIFFERENT_SECURITY_NO_STITCH',newEpisode:false};
  if(x.priceHistoryHashBefore!==x.priceHistoryHashAfter)
    return {state:'PRICE_REPLAY_REQUIRED',newEpisode:false};
  if(x.corporateActionOrIssuerRegimeReceipt)
    return {state:'DEFER_TO_CANONICAL_OWNER',newEpisode:false};
  return {state:'SAME_PRICE_ROOT',newEpisode:false,independentVote:false,
    pricePatternHash:x.pricePatternHash};
}
const support={
 securityIdentity:'TW-TPEX-1595',cutoff:'2026-06-02T16:00:00+08:00',
 exactSessionHash:'session-1',priceHistoryHash:'price-1',priceRoot:'PRICE_OHLC',
 taxonomyBridgeReceipt:'owner-bridge-1',peerUniverseHash:'peers-v2026',
 sectorIndexVersion:'sector-v2026',selfExclusion:'EXCLUDE_SELF',
 coverage:'COMPLETE',denominatorHash:'denom-1',costPolicy:'frozen',
 horizon:'D5',marketRegime:'regime-1',clusterPolicy:'DATE_SECTOR_ISSUER'
};
function sameSupport(a,b) {
  const keys=['securityIdentity','cutoff','exactSessionHash','priceHistoryHash',
    'priceRoot','taxonomyBridgeReceipt','peerUniverseHash','sectorIndexVersion',
    'selfExclusion','coverage','denominatorHash','costPolicy','horizon',
    'marketRegime','clusterPolicy'];
  for(const k of keys) {
    if(a[k]===null || b[k]===null || a[k]===undefined || b[k]===undefined ||
      a[k]==='UNKNOWN' || b[k]==='UNKNOWN' || a[k]==='PARTIAL' || b[k]==='PARTIAL')
      return {state:'SUPPORT_UNKNOWN',field:k};
    if(a[k]!==b[k]) return {state:'SUPPORT_MISMATCH',field:k};
  }
  return {state:'SAME_SUPPORT'};
}
function ledger(rows) {
  const out={total:rows.length,complete:0,unknown:0,conflict:0,partial:0,
    future:0,nonBijective:0};
  const seen=new Set();
  for(const r of rows) {
    if(!r.episodeId || seen.has(r.episodeId)) return {state:'EPISODE_ID_DUPLICATE_OR_MISSING'};
    seen.add(r.episodeId);
    if(r.state==='COMPLETE')out.complete++;
    else if(r.state==='UNKNOWN')out.unknown++;
    else if(r.state==='CONFLICT')out.conflict++;
    else if(r.state==='PARTIAL')out.partial++;
    else if(r.state==='FUTURE')out.future++;
    else if(r.state==='NON_BIJECTIVE')out.nonBijective++;
    else return {state:'UNRECOGNIZED_STATUS_UNKNOWN'};
  }
  return {...out,state:'DENOMINATOR_ACCOUNTED'};
}
function evidenceCount(nodes) {
  const roots=new Set();
  for(const n of nodes) {
    if(n.root==='PRICE_OHLC')roots.add('PRICE_OHLC');
    else if(n.residualD16Certified===true && n.ownerReceipt)roots.add(n.root);
  }
  return roots.size;
}
const price={securityIdentityChanged:false,priceHistoryHashBefore:'p1',
 priceHistoryHashAfter:'p1',pricePatternHash:'geometry-1'};
const cases=[
 ['pre-effective bridge unknown',()=>assert.equal(resolveBridge(query('2026-05-25T16:00:00+08:00'),[bridge]).state,'BRIDGE_UNKNOWN')],
 ['effective-day bridge certified after known',()=>assert.equal(resolveBridge(query('2026-06-01T09:00:00+08:00'),[bridge]).state,'BRIDGE_CONTEXT_CERTIFIED')],
 ['old taxonomy no bridge needed',()=>assert.equal(resolveBridge(query('2026-05-25T16:00:00+08:00',{toVersion:'V2025'}),[bridge]).state,'SAME_TAXONOMY_NO_BRIDGE')],
 ['no automatic missing bridge',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[]).state,'BRIDGE_UNKNOWN')],
 ['future first known blocks',()=>assert.equal(resolveBridge(query('2026-06-01T09:00:00+08:00'),[{...bridge,firstKnownAt:'2026-06-02T10:00:00+08:00'}]).state,'BRIDGE_NOT_YET_KNOWN')],
 ['date-only known time unknown',()=>assert.equal(resolveBridge(query('2026-06-01T09:00:00+08:00'),[{...bridge,firstKnownAt:'2026-05-20'}]).state,'BRIDGE_TIME_PRECISION_UNKNOWN')],
 ['historical future source excluded',()=>assert.equal(resolveBridge(query('2026-06-01T09:00:00+08:00'),[bridge,{...bridge,firstKnownAt:'2026-07-01T09:00:00+08:00',receiptId:'future'}]).state,'BRIDGE_CONTEXT_CERTIFIED')],
 ['two valid conflicting bridges blocked',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[bridge,{...bridge,receiptId:'different'}]).state,'BRIDGE_CONFLICT_BLOCKED')],
 ['missing certification blocks',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,certified:false}]).state,'BRIDGE_SOURCE_UNKNOWN')],
 ['missing receipt blocks',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,receiptId:null}]).state,'BRIDGE_SOURCE_UNKNOWN')],
 ['missing hash blocks',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,sourceHash:null}]).state,'BRIDGE_SOURCE_UNKNOWN')],
 ['wrong owner blocks',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,owner:'D01'}]).state,'BRIDGE_SOURCE_UNKNOWN')],
 ['partial coverage blocks',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,coverage:'PARTIAL'}]).state,'BRIDGE_COVERAGE_UNKNOWN')],
 ['missing peers blocks',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,peerUniverseHash:null}]).state,'BRIDGE_COVERAGE_UNKNOWN')],
 ['one-to-many cannot silently map',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,relation:'ONE_TO_MANY'}]).state,'BRIDGE_NON_BIJECTIVE_NEEDS_OWNER_DECOMPOSITION')],
 ['many-to-one cannot silently map',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,relation:'MANY_TO_ONE'}]).state,'BRIDGE_NON_BIJECTIVE_NEEDS_OWNER_DECOMPOSITION')],
 ['different security not bridged',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00',{securityIdentity:'OTHER'}),[bridge]).state,'BRIDGE_UNKNOWN')],
 ['different scheme not bridged',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00',{toScheme:'TWSE_OFFICIAL'}),[bridge]).state,'BRIDGE_UNKNOWN')],
 ['different source root blocks',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[{...bridge,parentRoot:'UNKNOWN'}]).state,'BRIDGE_PRICE_ROOT_CONFLICT')],
 ['bridge cannot add independent vote',()=>assert.equal(resolveBridge(query('2026-06-02T16:00:00+08:00'),[bridge]).independentVote,false)],
 ['sector-only change preserves geometry',()=>assert.equal(geometryGuard(price).pricePatternHash,'geometry-1')],
 ['sector-only change no new episode',()=>assert.equal(geometryGuard(price).newEpisode,false)],
 ['sector-only change no independent vote',()=>assert.equal(geometryGuard(price).independentVote,false)],
 ['different security no history stitch',()=>assert.equal(geometryGuard({...price,securityIdentityChanged:true}).state,'DIFFERENT_SECURITY_NO_STITCH')],
 ['price revision requires replay',()=>assert.equal(geometryGuard({...price,priceHistoryHashAfter:'p2'}).state,'PRICE_REPLAY_REQUIRED')],
 ['issuer regime receipt routed owner',()=>assert.equal(geometryGuard({...price,corporateActionOrIssuerRegimeReceipt:true}).state,'DEFER_TO_CANONICAL_OWNER')],
 ['same parent child support',()=>assert.equal(sameSupport(support,{...support}).state,'SAME_SUPPORT')],
 ['different taxonomy receipt blocks support',()=>assert.equal(sameSupport(support,{...support,taxonomyBridgeReceipt:'r2'}).field,'taxonomyBridgeReceipt')],
 ['different sector index version blocks',()=>assert.equal(sameSupport(support,{...support,sectorIndexVersion:'v2'}).state,'SUPPORT_MISMATCH')],
 ['different self exclusion blocks',()=>assert.equal(sameSupport(support,{...support,selfExclusion:'INCLUDE_SELF'}).state,'SUPPORT_MISMATCH')],
 ['different denominator blocks',()=>assert.equal(sameSupport(support,{...support,denominatorHash:'d2'}).state,'SUPPORT_MISMATCH')],
 ['different price source blocks',()=>assert.equal(sameSupport(support,{...support,priceHistoryHash:'p2'}).state,'SUPPORT_MISMATCH')],
 ['unknown sector coverage not zero',()=>assert.equal(sameSupport(support,{...support,coverage:'UNKNOWN'}).state,'SUPPORT_UNKNOWN')],
 ['partial sector coverage not clean',()=>assert.equal(sameSupport(support,{...support,coverage:'PARTIAL'}).state,'SUPPORT_UNKNOWN')],
 ['missing receipt not clean',()=>assert.equal(sameSupport(support,{...support,taxonomyBridgeReceipt:null}).state,'SUPPORT_UNKNOWN')],
 ['unknown regime not clean',()=>assert.equal(sameSupport(support,{...support,marketRegime:'UNKNOWN'}).state,'SUPPORT_UNKNOWN')],
 ['denominator all categories counted',()=>assert.deepEqual(ledger(['COMPLETE','UNKNOWN','CONFLICT','PARTIAL','FUTURE','NON_BIJECTIVE'].map((state,i)=>({episodeId:'e'+i,state}))),{total:6,complete:1,unknown:1,conflict:1,partial:1,future:1,nonBijective:1,state:'DENOMINATOR_ACCOUNTED'})],
 ['duplicate episode cannot inflate sample',()=>assert.equal(ledger([{episodeId:'e1',state:'COMPLETE'},{episodeId:'e1',state:'COMPLETE'}]).state,'EPISODE_ID_DUPLICATE_OR_MISSING')],
 ['unknown status not silently dropped',()=>assert.equal(ledger([{episodeId:'e1',state:'MISSING'}]).state,'UNRECOGNIZED_STATUS_UNKNOWN')],
 ['price and trend share root one vote',()=>assert.equal(evidenceCount([{root:'PRICE_OHLC'},{root:'PRICE_OHLC'}]),1)],
 ['sector context not independent vote',()=>assert.equal(evidenceCount([{root:'PRICE_OHLC'},{root:'SECTOR_INDEX',ownerReceipt:'r'}]),1)],
 ['D16 certified distinct residual adds one',()=>assert.equal(evidenceCount([{root:'PRICE_OHLC'},{root:'SECTOR_RESIDUAL',residualD16Certified:true,ownerReceipt:'r'}]),2)],
 ['D16 certified but missing owner receipt no vote',()=>assert.equal(evidenceCount([{root:'PRICE_OHLC'},{root:'SECTOR_RESIDUAL',residualD16Certified:true}]),1)]
];
let failed=0;
for(const [name,fn] of cases){try{fn();process.stdout.write('PASS '+name+'\n');}catch(e){failed++;process.stderr.write('FAIL '+name+': '+e.message+'\n');}}
process.stdout.write('D01 DL-147~149 '+(cases.length-failed)+'/'+cases.length+' PASS failures='+failed+'\n');
if(failed)process.exitCode=1;
