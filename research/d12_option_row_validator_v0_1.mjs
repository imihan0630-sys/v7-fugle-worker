export const VERSION = '0.1.0';

function finiteOrNull(v) {
  if (v === null || v === undefined || v === '' || v === '-' || v === '—') return null;
  const n = Number(String(v).replaceAll(',', ''));
  if (!Number.isFinite(n)) throw new Error(`invalid numeric value: ${v}`);
  return n;
}
function pos(v, field) { const n=finiteOrNull(v); if(!(n>0)) throw new Error(`${field} must be > 0`); return n; }
function nonneg(v, field) { const n=finiteOrNull(v); if(n===null) return null; if(n<0) throw new Error(`${field} must be >= 0`); return n; }
function side(v){
  const s=String(v).trim().toUpperCase();
  if(['CALL','C','買權'].includes(s)) return 'CALL';
  if(['PUT','P','賣權'].includes(s)) return 'PUT';
  throw new Error(`unsupported callPut: ${v}`);
}
function ymd(v,field){const s=String(v);if(!/^\d{8}$/.test(s))throw new Error(`${field} must be YYYYMMDD`);return s;}

export function normalizeOptionRow(row){
  const out={
    product:String(row.product||'').trim(),
    session:String(row.session||'').trim().toUpperCase(),
    sourceDate:ymd(row.sourceDate,'sourceDate'),
    expiryDate:ymd(row.expiryDate,'expiryDate'),
    expiryMonthWeek:String(row.expiryMonthWeek||'').trim(),
    strike:pos(row.strike,'strike'),
    callPut:side(row.callPut),
    bestBid:nonneg(row.bestBid,'bestBid'),
    bestAsk:nonneg(row.bestAsk,'bestAsk'),
    last:nonneg(row.last,'last'),
    settlement:nonneg(row.settlement,'settlement'),
    volume:nonneg(row.volume,'volume'),
    openInterest:nonneg(row.openInterest,'openInterest')
  };
  if(!out.product) throw new Error('product required');
  if(!['REGULAR','AFTER_HOURS'].includes(out.session)) throw new Error('session must be REGULAR or AFTER_HOURS');
  if(out.expiryDate < out.sourceDate) throw new Error('expiryDate precedes sourceDate');
  if(out.volume!==null && !Number.isInteger(out.volume)) throw new Error('volume must be integer');
  if(out.openInterest!==null && !Number.isInteger(out.openInterest)) throw new Error('openInterest must be integer');
  let quoteState='NO_TWO_SIDED_QUOTE', mid=null;
  if(out.bestBid!==null && out.bestAsk!==null){
    if(out.bestAsk < out.bestBid) throw new Error('crossed quote');
    if(out.bestBid===0) quoteState='ZERO_BID_EXCLUDED';
    else if(out.bestAsk===0) throw new Error('ask cannot be zero when bid positive');
    else { quoteState='PRIMARY_ELIGIBLE'; mid=(out.bestBid+out.bestAsk)/2; }
  }
  return Object.freeze({...out,quoteState,mid});
}

export function seriesKey(r){return [r.product,r.session,r.sourceDate,r.expiryDate,r.strike,r.callPut].join('|');}

export function validateUnique(rows){
  const seen=new Set();
  for(const r of rows){const k=seriesKey(r);if(seen.has(k))throw new Error(`duplicate series: ${k}`);seen.add(k);} return true;
}

export function auditSlice(rows){
  const clean=rows.filter(r=>r.quoteState==='PRIMARY_ELIGIBLE').slice().sort((a,b)=>a.strike-b.strike);
  if(clean.length<2) return {count:clean.length,monotonic:'INSUFFICIENT',convexity:'INSUFFICIENT',violations:[]};
  const cp=clean[0].callPut;
  if(clean.some(r=>r.callPut!==cp || r.expiryDate!==clean[0].expiryDate)) throw new Error('slice must share callPut and expiryDate');
  const violations=[];
  for(let i=1;i<clean.length;i++){
    const prev=clean[i-1],cur=clean[i];
    if(cp==='CALL' && cur.mid>prev.mid+1e-12) violations.push(`CALL_MONOTONIC@${cur.strike}`);
    if(cp==='PUT' && cur.mid<prev.mid-1e-12) violations.push(`PUT_MONOTONIC@${cur.strike}`);
  }
  let convex='INSUFFICIENT';
  if(clean.length>=3){
    convex='PASS';
    let prevSlope=null;
    for(let i=1;i<clean.length;i++){
      const slope=(clean[i].mid-clean[i-1].mid)/(clean[i].strike-clean[i-1].strike);
      if(prevSlope!==null && slope<prevSlope-1e-12){violations.push(`CONVEXITY@${clean[i].strike}`);convex='FAIL';}
      prevSlope=slope;
    }
  }
  return {count:clean.length,monotonic:violations.some(x=>x.includes('MONOTONIC'))?'FAIL':'PASS',convexity:convex,violations};
}
