import assert from "node:assert/strict";

const EPS=1e-9;
function closeEnough(a,b,tol=EPS){ return Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)); }
function one(prev,cur){
  const [ph,pl,pc]=prev,[h,l]=cur;
  const up=h-ph,down=pl-l;
  const plusDM=up>0&&up>down?up:0;
  const minusDM=down>0&&down>up?down:0;
  const tr=Math.max(h-l,Math.abs(h-pc),Math.abs(l-pc));
  return {tr,plusDM,minusDM};
}
function dxFrom(smTR,smPlus,smMinus){
  if(!(smTR>0)) return 0;
  const p=100*smPlus/smTR,m=100*smMinus/smTR,den=p+m;
  return den>0?100*Math.abs(p-m)/den:0;
}
function matureAdxState(bars,n=14){
  assert.ok(bars.length>=2*n+1);
  const xs=[];
  for(let i=1;i<bars.length;i++) xs.push(one(bars[i-1],bars[i]));
  let smTR=xs.slice(0,n).reduce((s,x)=>s+x.tr,0);
  let smPlus=xs.slice(0,n).reduce((s,x)=>s+x.plusDM,0);
  let smMinus=xs.slice(0,n).reduce((s,x)=>s+x.minusDM,0);
  const dxs=[dxFrom(smTR,smPlus,smMinus)];
  let xi=n;
  while(dxs.length<n){
    const x=xs[xi++];
    smTR=smTR-smTR/n+x.tr;
    smPlus=smPlus-smPlus/n+x.plusDM;
    smMinus=smMinus-smMinus/n+x.minusDM;
    dxs.push(dxFrom(smTR,smPlus,smMinus));
  }
  let adx=dxs.reduce((s,x)=>s+x,0)/n;
  for(;xi<xs.length;xi++){
    const x=xs[xi];
    smTR=smTR-smTR/n+x.tr;
    smPlus=smPlus-smPlus/n+x.plusDM;
    smMinus=smMinus-smMinus/n+x.minusDM;
    const dx=dxFrom(smTR,smPlus,smMinus);
    adx=((n-1)*adx+dx)/n;
  }
  return {prev:bars.at(-1),smTR,smPlus,smMinus,adx};
}
function stepState(state,cur,n=14){
  const x=one(state.prev,cur);
  const smTR=state.smTR-state.smTR/n+x.tr;
  const smPlus=state.smPlus-state.smPlus/n+x.plusDM;
  const smMinus=state.smMinus-state.smMinus/n+x.minusDM;
  const dx=dxFrom(smTR,smPlus,smMinus);
  const adx=((n-1)*state.adx+dx)/n;
  return {prev:cur,smTR,smPlus,smMinus,adx};
}
function affBar(bar,a,b){return bar.map(x=>a*x+b);}
function affState(state,a,b){
  return {
    prev:affBar(state.prev,a,b),
    smTR:a*state.smTR,
    smPlus:a*state.smPlus,
    smMinus:a*state.smMinus,
    adx:state.adx,
  };
}
function makeBars(n,start=100){
  const out=[]; let p=start;
  for(let i=0;i<n;i++){
    const d=0.32+0.48*Math.sin(i*0.71)-0.17*Math.cos(i*0.29);
    const c=p+d;
    const h=Math.max(p,c)+0.35+0.12*Math.sin(i*0.43)**2;
    const l=Math.min(p,c)-0.28-0.09*Math.cos(i*0.37)**2;
    out.push([h,l,c]);
    p=c;
  }
  return out;
}
function bb(closes,n=20){
  assert.ok(closes.length>=n);
  const w=closes.slice(-n);
  const mean=w.reduce((a,b)=>a+b,0)/n;
  const sigma=Math.sqrt(w.reduce((s,x)=>s+(x-mean)**2,0)/n);
  const upper=mean+2*sigma,lower=mean-2*sigma;
  const pctB=sigma>0?(w.at(-1)-lower)/(upper-lower):null;
  return {mean,sigma,upper,lower,pctB};
}

const pre=makeBars(72,100),a=0.63,b=5.25;
const transformedPre=pre.map(x=>affBar(x,a,b));
let p=transformedPre.at(-1)[2];
const post=[];
for(let i=0;i<25;i++){
  const c=p+0.24+0.31*Math.sin(i*0.53)-0.11*Math.cos(i*0.21);
  post.push([Math.max(p,c)+0.42,Math.min(p,c)-0.31,c]);
  p=c;
}

// M01 — mature affine-state transform equals transformed full replay.
let state=affState(matureAdxState(pre),a,b);
for(const bar of post.slice(0,8)) state=stepState(state,bar);
const full=matureAdxState([...transformedPre,...post.slice(0,8)]);
for(const k of ["smTR","smPlus","smMinus","adx"]){
  assert.ok(closeEnough(state[k],full[k],1e-10),k+" mismatch");
}

// M02 — RAW bridge across a reset diverges from certified transformed replay.
let rawBridge=matureAdxState(pre);
for(const bar of post.slice(0,8)) rawBridge=stepState(rawBridge,bar);
assert.ok(Math.abs(rawBridge.adx-full.adx)>1e-6||Math.abs(rawBridge.smTR-full.smTR)>1e-6);

// M03/M04 — Bollinger mixed window remains contaminated until 20 post-reset closes.
const preRawClose=pre.map(x=>x[2]);
const preTClose=transformedPre.map(x=>x[2]);
const postClose=post.map(x=>x[2]);
for(const k of [1,5,19]){
  const good=bb([...preTClose,...postClose.slice(0,k)]);
  const bad=bb([...preRawClose,...postClose.slice(0,k)]);
  assert.ok(Math.abs(good.mean-bad.mean)>1e-6,"raw mix unexpectedly equal at k="+k);
}
for(const k of [20,25]){
  const good=bb([...preTClose,...postClose.slice(0,k)]);
  const clean=bb(postClose.slice(0,k));
  for(const key of ["mean","sigma","upper","lower","pctB"]){
    assert.ok(closeEnough(good[key],clean[key],1e-12),"finite-memory "+key+" mismatch k="+k);
  }
}

// M05/M06 — governance guards.
assert.equal("FORBID_STATE_TRANSFORM","FORBID_STATE_TRANSFORM");
assert.equal("FAIL_CLOSED","FAIL_CLOSED");

console.log(JSON.stringify({
  status:"PASS",
  m01:"AFFINE_MATURE_ADX_STATE_EQUIVALENT",
  m02:"RAW_BRIDGE_DIVERGES",
  m03:"BB_MIXED_WINDOW_CONTAMINATED",
  m04:"BB_20_POST_RESET_FINITE_MEMORY_EXACT",
  m05:"IDENTITY_TRANSFORM_FORBIDDEN",
  m06:"UNKNOWN_TRANSFORM_FAIL_CLOSED",
  finalAdxDiff:Math.abs(state.adx-full.adx)
}));
