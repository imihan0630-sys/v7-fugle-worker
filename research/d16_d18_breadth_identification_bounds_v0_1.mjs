// Research-only partial identification. No Formal, trading, or policy authority.
const KEYS=['up','down','flat','notComparable','unknown'];
function validInstant(s){return typeof s==='string'&&/(?:Z|[+-]\d\d:\d\d)$/.test(s)&&Number.isFinite(Date.parse(s));}
export function computeBreadthIdentificationBounds(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('OBJECT_REQUIRED');
 const counts={};
 for(const k of KEYS){const v=input[k];if(!Number.isSafeInteger(v)||v<0)throw new TypeError('INVALID_COUNT_'+k);counts[k]=v;}
 const n=KEYS.reduce((s,k)=>s+counts[k],0);
 if(!Number.isSafeInteger(n)||n<=0)throw new TypeError('INVALID_U0_TOTAL');
 if(!Number.isSafeInteger(input.u0N)||input.u0N!==n)throw new TypeError('DENOMINATOR_MISMATCH');
 if(!['TWSE','TPEX'].includes(input.market))throw new TypeError('EXCHANGE_SCOPE_REQUIRED');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(input.marketDate||''))throw new TypeError('MARKET_DATE_REQUIRED');
 if(typeof input.universeReceiptHash!=='string'||input.universeReceiptHash.length<12)throw new TypeError('UNIVERSE_IDENTITY_REQUIRED');
 if(typeof input.directionReceiptHash!=='string'||input.directionReceiptHash.length<12)throw new TypeError('DIRECTION_IDENTITY_REQUIRED');
 if(!validInstant(input.capturedAt)||!validInstant(input.decisionTimestamp))throw new TypeError('EXPLICIT_CLOCK_REQUIRED');
 const base={schemaVersion:'D16_D18_BREADTH_PARTIAL_ID_V0_1',researchOnly:true,formalDecisionAuthorized:false,
 market:input.market,marketDate:input.marketDate,u0N:n,counts,universeReceiptHash:input.universeReceiptHash,
 directionReceiptHash:input.directionReceiptHash,capturedAt:input.capturedAt,decisionTimestamp:input.decisionTimestamp};
 if(input.universeFrozen!==true||input.sourcePitEligible!==true||Date.parse(input.capturedAt)>Date.parse(input.decisionTimestamp))
  return {...base,status:'SOURCE_OR_CLOCK_UNVERIFIED',lower:null,upper:null,knownComparableNet:null,signRobustness:'NOT_EVALUABLE',reason:'PIT_OR_UNIVERSE_NOT_PROVEN'};
 const m=counts.up+counts.down+counts.flat,u=counts.unknown;
 if(m===0&&u===0)return {...base,status:'NO_COMPARABLE_SUPPORT',knownComparableN:0,possibleComparableN:0,lower:null,upper:null,knownComparableNet:null,signRobustness:'NOT_EVALUABLE',zeroComparablePossible:true};
 const lower=(counts.up-counts.down-u)/(m+u),upper=(counts.up-counts.down+u)/(m+u);
 const signRobustness=lower>0?'ROBUST_POSITIVE':upper<0?'ROBUST_NEGATIVE':lower===0&&upper===0?'EXACT_ZERO':'SIGN_UNIDENTIFIED';
 return {...base,status:'BOUNDS_IDENTIFIED',knownComparableN:m,possibleComparableN:m+u,
 knownComparableNet:m>0?(counts.up-counts.down)/m:null,lower,upper,signRobustness,zeroComparablePossible:m===0,
 boundsAre:'SHARP_DETERMINISTIC_IDENTIFICATION_NOT_CONFIDENCE_INTERVAL',
 assumptions:['FROZEN_U0','KNOWN_COUNTS_TRUSTED','UNKNOWN_MAY_BE_UP_DOWN_FLAT_OR_NOT_COMPARABLE','NO_OUTCOME_INFORMATION']};
}