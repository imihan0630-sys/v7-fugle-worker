// D01 DL-027 structural-zone negative-control pool v0.1
// Research-only / outcome-blind.

function num(x){return typeof x==="number"&&Number.isFinite(x)?x:null;}
function overlap(aL,aU,bL,bU){return aL<=bU&&aU>=bL;}

export function buildNegativeControlBoundaryPool({
  parentZone,
  historicalCloses=[],
  knownStructuralZones=[]
}={}){
  const pL=num(parentZone?.lower),pU=num(parentZone?.upper);
  const cutoff=String(parentZone?.confirmedAt||"");
  if(pL===null||pU===null||pU<pL||!cutoff)
    return {status:"UNKNOWN",reason:"PARENT_ZONE_INVALID",candidates:[]};

  const width=pU-pL;
  const controls=(knownStructuralZones||[]).filter(z=>
    z&&z.confirmedAt&&z.confirmedAt<=cutoff&&
    Number.isFinite(z.lower)&&Number.isFinite(z.upper)
  );

  const seen=new Set();
  const candidates=[];

  for(const row of historicalCloses||[]){
    if(!row||!row.date||row.date>cutoff) continue;
    if(row.eligibleSymbolSession!==true||row.technicalContinuityVerified!==true) continue;
    if(!Number.isFinite(row.close)) continue;

    const center=row.close;
    const key=String(center);
    if(seen.has(key)) continue;
    seen.add(key);

    const lower=center-width/2, upper=center+width/2;
    if(overlap(lower,upper,pL,pU)) continue;
    if(controls.some(z=>overlap(lower,upper,z.lower,z.upper))) continue;

    candidates.push({
      sourceDate:row.date,
      center,lower,upper,width,
      candidateClass:"NON_ANCHOR_HORIZONTAL_CONTROL",
      independentVoteEligible:false
    });
  }

  candidates.sort((a,b)=>a.sourceDate.localeCompare(b.sourceDate)||a.center-b.center);

  return {
    status:candidates.length?"VALID":"NEGATIVE_CONTROL_NOT_EVALUABLE",
    parentConfirmedAt:cutoff,
    trueParentWidth:width,
    candidates,
    outcomeSelectionAllowed:false,
    formalCoreImpact:"NONE"
  };
}
