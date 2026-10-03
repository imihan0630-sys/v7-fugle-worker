// D01 DL-032 anchor-ablation summary helper v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function median(xs){
  const a=[...xs].sort((x,y)=>x-y);
  if(!a.length) return null;
  const m=Math.floor(a.length/2);
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
}

export function summarizeAnchorAblations({
  officialCenter,
  officialWidth,
  atr=null,
  ablations=[]
}={}){
  if(!finite(officialCenter)||!finite(officialWidth)||officialWidth<0)
    return {status:"UNKNOWN",reason:"OFFICIAL_GEOMETRY_INVALID"};

  const eligible=(ablations||[]).filter(x=>x.minimumAnchorDependence!==true);
  const minDependent=(ablations||[]).filter(x=>x.minimumAnchorDependence===true);

  const details=[];
  for(const a of eligible){
    if(!a.removedAnchorId)
      return {status:"UNKNOWN",reason:"REMOVED_ANCHOR_ID_MISSING"};

    if(a.ablationZoneExists!==true){
      details.push({
        removedAnchorId:a.removedAnchorId,
        ablationZoneExists:false,
        centerShiftAbs:null,
        centerShiftPct:null,
        centerShiftATR:null,
        widthShiftAbs:null,
        widthShiftPct:null
      });
      continue;
    }

    if(!finite(a.ablationCenter)||!finite(a.ablationWidth))
      return {status:"UNKNOWN",reason:"ABLATION_GEOMETRY_MISSING",removedAnchorId:a.removedAnchorId};

    const centerShiftAbs=Math.abs(a.ablationCenter-officialCenter);
    const widthShiftAbs=Math.abs(a.ablationWidth-officialWidth);

    details.push({
      removedAnchorId:a.removedAnchorId,
      ablationZoneExists:true,
      centerShiftAbs,
      centerShiftPct:officialCenter!==0?centerShiftAbs/Math.abs(officialCenter):null,
      centerShiftATR:finite(atr)&&atr>0?centerShiftAbs/atr:null,
      widthShiftAbs,
      widthShiftPct:officialWidth!==0?widthShiftAbs/officialWidth:null
    });
  }

  const surviving=details.filter(x=>x.ablationZoneExists);
  const centerAtr=surviving.map(x=>x.centerShiftATR).filter(finite);
  const widthPct=surviving.map(x=>x.widthShiftPct).filter(finite);

  return {
    status:"VALID",
    eligibleAblationCount:details.length,
    minimumAnchorDependenceCount:minDependent.length,
    survivingAblationCount:surviving.length,
    zoneLossCount:details.length-surviving.length,
    zoneLossFraction:details.length? (details.length-surviving.length)/details.length : null,
    maxAbsCenterShiftATR:centerAtr.length?Math.max(...centerAtr):null,
    medianAbsCenterShiftATR:median(centerAtr),
    maxAbsWidthShiftPct:widthPct.length?Math.max(...widthPct):null,
    anchorInfluenceVector:details,
    officialZoneMutationAuthorized:false,
    predictiveIncrementality:"UNKNOWN"
  };
}
