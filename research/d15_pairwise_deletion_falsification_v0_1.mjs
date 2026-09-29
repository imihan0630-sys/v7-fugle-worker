// D15 pairwise-deletion falsification v0.1 — research-only.
// Demonstrates that pair-specific supports can assemble an internally inconsistent correlation matrix.

function n(v){return v===null||v===undefined||v===""?null:Number(v)}
function corr(xs,ys){
  const pairs=[];
  for(let i=0;i<xs.length;i++){
    const x=n(xs[i]),y=n(ys[i]);
    if(Number.isFinite(x)&&Number.isFinite(y))pairs.push([x,y]);
  }
  if(pairs.length<2)return null;
  const mx=pairs.reduce((s,p)=>s+p[0],0)/pairs.length;
  const my=pairs.reduce((s,p)=>s+p[1],0)/pairs.length;
  let num=0,dx=0,dy=0;
  for(const [x,y] of pairs){const a=x-mx,b=y-my;num+=a*b;dx+=a*a;dy+=b*b}
  return dx>0&&dy>0?num/Math.sqrt(dx*dy):null;
}
export function determinant3(m){
  return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
       - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
       + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
}
export function pairwiseDeletionCounterexample(){
  const rows=[
    {date:"d1",A:-1,B:-1,C:null},
    {date:"d2",A: 1,B: 1,C:null},
    {date:"d3",A:-1,B:null,C:-1},
    {date:"d4",A: 1,B:null,C: 1},
    {date:"d5",A:null,B:-1,C: 1},
    {date:"d6",A:null,B: 1,C:-1}
  ];
  const A=rows.map(r=>r.A),B=rows.map(r=>r.B),C=rows.map(r=>r.C);
  const ab=corr(A,B),ac=corr(A,C),bc=corr(B,C);
  const matrix=[[1,ab,ac],[ab,1,bc],[ac,bc,1]];
  const det=determinant3(matrix);
  return {
    rows,
    pairwiseSupport:{AB:["d1","d2"],AC:["d3","d4"],BC:["d5","d6"]},
    correlations:{AB:ab,AC:ac,BC:bc},
    matrix,
    determinant:det,
    positiveSemidefinitePossible:det>=-1e-12,
    interpretation:"Each pairwise estimate is individually valid on its own support, but the assembled matrix does not describe one common multivariate sample. Exact listwise common support avoids this incoherent geometry."
  };
}
