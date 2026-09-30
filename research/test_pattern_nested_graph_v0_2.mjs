import assert from 'node:assert/strict';
import {validateNestedGraph,canonicalGraphSnapshot} from './pattern_nested_graph_v0_2.mjs';

let pass=0; const t=(name,fn)=>{fn();pass++;console.log('PASS',name)};
const base=(id,o={})=>({id,symbol:'2330',scale:'DAILY',semanticSpaceId:'TECH',semanticSpaceVersion:'v1',objectId:id,objectVersion:1,pivotAt:'2026-09-01',confirmedAt:'2026-09-02',firstSession:'2026-09-01',lastSession:'2026-09-05',...o});

t('NG01 parent appears only after confirmedAt',()=>{
 const c=base('C'); const p=base('P',{scale:'WEEKLY',confirmedAt:'2026-09-08',firstSession:'2026-09-01',lastSession:'2026-09-10',completeness:'COMPLETE'}); const e=[{from:'P',to:'C',type:'CONTAINS'}];
 assert.equal(validateNestedGraph([p,c],e,'2026-09-05').edges.length,0);
 assert.equal(validateNestedGraph([p,c],e,'2026-09-08').edges.length,1);
});
t('NG02 partial weekly cannot confirm parent',()=>{
 const c=base('C'); const p=base('P',{scale:'WEEKLY',completeness:'PARTIAL',firstSession:'2026-09-01',lastSession:'2026-09-10'}); const r=validateNestedGraph([p,c],[{from:'P',to:'C',type:'CONTAINS'}],'2026-09-05');
 assert(r.errors.some(x=>x.code==='PARTIAL_HIGHER_TIMEFRAME_PARENT'));
});
t('NG03 full-history asOf equals true prefix',()=>{
 const c=base('C'); const p=base('P',{scale:'WEEKLY',confirmedAt:'2026-09-08',firstSession:'2026-09-01',lastSession:'2026-09-10',completeness:'COMPLETE'}); const e=[{from:'P',to:'C',type:'CONTAINS'}];
 const full=validateNestedGraph([p,c],e,'2026-09-05'); const prefix=validateNestedGraph([c],[],'2026-09-05');
 assert.equal(canonicalGraphSnapshot(full),canonicalGraphSnapshot(prefix));
});
t('NG04 semantic space mismatch fails closed',()=>{
 const a=base('A',{semanticSpaceId:'RAW'}),b=base('B',{semanticSpaceId:'TECH'}); const r=validateNestedGraph([a,b],[{from:'A',to:'B',type:'REFINES'}],'2026-09-05');
 assert(r.errors.some(x=>x.code==='SEMANTIC_SPACE_CONFLICT')); assert.equal(r.edges.length,0);
});
t('NG05 overlap is not transitive equivalence',()=>{
 const a=base('A'),b=base('B'),c=base('C'); const es=[{from:'A',to:'B',type:'SHARES_ANCHORS'},{from:'B',to:'C',type:'SHARES_ANCHORS'}]; const r=validateNestedGraph([a,b,c],es,'2026-09-05');
 assert.equal(r.edges.length,2); assert(!r.edges.some(e=>e.from==='A'&&e.to==='C'));
});
t('NG06 same boundary id but different versions stay distinct',()=>{
 const a=base('A',{boundaryId:'N',boundaryVersion:1,boundaryLower:99,boundaryUpper:101,firstBreakAt:'2026-09-03'}); const b=base('B',{boundaryId:'N',boundaryVersion:2,boundaryLower:99,boundaryUpper:101,firstBreakAt:'2026-09-03'}); const r=validateNestedGraph([a,b],[{from:'A',to:'B',type:'SHARES_TRIGGER'}],'2026-09-05');
 assert(r.errors.some(x=>x.code==='BOUNDARY_VERSION_CONFLICT'));
});
t('NG07 same version mutated coordinates is provenance conflict',()=>{
 const a=base('A',{boundaryId:'N',boundaryVersion:1,boundaryLower:99,boundaryUpper:101,firstBreakAt:'2026-09-03'}); const b=base('B',{boundaryId:'N',boundaryVersion:1,boundaryLower:98,boundaryUpper:101,firstBreakAt:'2026-09-03'}); const r=validateNestedGraph([a,b],[{from:'A',to:'B',type:'SHARES_TRIGGER'}],'2026-09-05');
 assert(r.errors.some(x=>x.code==='PROVENANCE_CONFLICT_SAME_VERSION_MUTATED'));
});
t('NG08 future parent does not mutate child clocks',()=>{
 const c=base('C'); const original={pivotAt:c.pivotAt,confirmedAt:c.confirmedAt}; const p=base('P',{scale:'WEEKLY',confirmedAt:'2026-09-08',firstSession:'2026-08-20',lastSession:'2026-09-10',completeness:'COMPLETE'}); validateNestedGraph([p,c],[{from:'P',to:'C',type:'CONTAINS'}],'2026-09-10'); assert.deepEqual({pivotAt:c.pivotAt,confirmedAt:c.confirmedAt},original);
});
t('NG09 contradiction retained',()=>{ const a=base('A'),b=base('B'); const r=validateNestedGraph([a,b],[{from:'A',to:'B',type:'CONTRADICTS'}],'2026-09-05'); assert.equal(r.edges[0].type,'CONTRADICTS'); });
t('NG10 missing confirmation is UNKNOWN',()=>{ const a=base('A',{confirmedAt:null}); const r=validateNestedGraph([a],[],'2026-09-05'); assert.equal(r.status,'VALID_WITH_UNKNOWN'); assert(r.unknowns.some(x=>x.code==='MISSING_CONFIRMATION_CLOCK')); });
t('cross-symbol edges fail',()=>{ const a=base('A'),b=base('B',{symbol:'2317'}); const r=validateNestedGraph([a,b],[{from:'A',to:'B',type:'REFINES'}],'2026-09-05'); assert(r.errors.some(x=>x.code==='CROSS_SYMBOL_EDGE')); });
t('missing node fails',()=>{ const a=base('A'); const r=validateNestedGraph([a],[{from:'A',to:'X',type:'REFINES'}],'2026-09-05'); assert(r.errors.some(x=>x.code==='MISSING_NODE')); });
console.log(`SUMMARY ${pass}/12 PASS`);
