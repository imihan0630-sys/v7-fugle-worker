import crypto from 'node:crypto';

const dateOnly = v => String(v ?? '').slice(0,10);
const ms = v => Number.isFinite(Date.parse(v)) ? Date.parse(v) : null;
const uniqSorted = xs => [...new Set((xs||[]).map(dateOnly).filter(Boolean))].sort();
const finiteNonNeg = v => Number.isFinite(Number(v)) && Number(v) >= 0;

export function comparableSessionSetHash(dates){
  return crypto.createHash('sha256').update(uniqSorted(dates).join('|')).digest('hex');
}

function result(status, reasons=[], extra={}){
  const pass=status==='PASS';
  return {continuityJoinStatus:status, unknownReasons:[...new Set(reasons)], rawActivityEligible:pass, comparableParticipationEligible:pass, pivotVolumeEligible:pass, ...extra};
}

export function evaluateDailyVolumeContinuity(input={}){
  const {
    marketDate, featureKnownAt, expectedPriorSessions=[], currentRow=null, sourceRows=[],
    verifiedNonSymbolSessions=[], corporateActionCoverageStatus='UNKNOWN', corporateActionReceipt=null,
    mode='RAW_ACTIVITY'
  }=input;
  const reasons=[];
  const md=dateOnly(marketDate);
  const cutoff=ms(featureKnownAt);
  const expected=uniqSorted(expectedPriorSessions).filter(d=>d<md).slice(-20);
  const nonSymbol=new Set(uniqSorted(verifiedNonSymbolSessions));
  const rows=[...(sourceRows||[]), ...(currentRow?[currentRow]:[])];
  const map=new Map();
  const dups=[];
  for(const row of rows){
    const d=dateOnly(row?.marketDate);
    if(!d) continue;
    if(map.has(d)) dups.push(d);
    else map.set(d,row);
  }
  if(dups.length) reasons.push('DUPLICATE_SOURCE_DATE');
  if(expected.length<20) reasons.push('INSUFFICIENT_EXPECTED_SESSIONS');

  const windowStart=expected[0]||null;
  if(windowStart){
    for(const d of nonSymbol){
      if(d>=windowStart && d<md && map.has(d)) reasons.push('NON_SYMBOL_SESSION_BAR_PRESENT');
    }
  }

  const missing=expected.filter(d=>!map.has(d));
  if(missing.length) reasons.push('EXPECTED_SESSION_MISSING_SOURCE');
  const expectedRows=expected.map(d=>map.get(d)).filter(Boolean);

  for(const row of [...expectedRows, ...(currentRow?[currentRow]:[])]){
    if((row?.volumeUnit||input.volumeUnit)!=='SHARES') reasons.push('VOLUME_UNIT_UNKNOWN_OR_MISMATCH');
    if(!finiteNonNeg(row?.volumeShares)) reasons.push('INVALID_VOLUME_VALUE');
    const fetched=ms(row?.sourceFetchedAt);
    if(cutoff===null || fetched===null || fetched>cutoff) reasons.push('SOURCE_KNOWN_AT_INVALID');
  }

  if(corporateActionCoverageStatus!=='COMPLETE') reasons.push('CORPORATE_ACTION_COVERAGE_UNKNOWN');
  const ca=corporateActionReceipt||{};
  const caKnown=ms(ca.knownAt);
  const caUsable=!ca.eventFamily || (caKnown!==null && cutoff!==null && caKnown<=cutoff);
  if(ca.eventFamily && !caUsable) reasons.push('CORPORATE_ACTION_LATE_KNOWN_AT_DECISION');

  const earliest=expected[0]||md;
  const unitDate=caUsable?dateOnly(ca.unitScaleEffectiveDate):'';
  const unitCross=!!unitDate && unitDate>earliest && unitDate<=md;
  if(unitCross){
    const allPostReset=expected.length===20 && expected.every(d=>d>=unitDate);
    const bridgeRowsOk=ca.unitScaleBridgeVerified===true && [...expectedRows,...(currentRow?[currentRow]:[])].every(r=>finiteNonNeg(r?.continuityVolumeShares));
    if(!allPostReset && !bridgeRowsOk) reasons.push('UNIT_SCALE_PATH_UNRESOLVED');
  }

  const supplyDate=caUsable?dateOnly(ca.supplyBreakEffectiveDate):'';
  const supplyCross=!!supplyDate && supplyDate>earliest && supplyDate<=md;
  const normalized=ca.participationDenominatorNormalized===true;
  const allPostSupply=expected.length===20 && expected.every(d=>d>=supplyDate);
  let comparableParticipationEligible=true;
  if(mode==='COMPARABLE_PARTICIPATION' && supplyCross && !normalized && !allPostSupply){
    reasons.push('SUPPLY_BREAK_MIXED_BASELINE');
    comparableParticipationEligible=false;
  }

  if(reasons.length){
    const hard=reasons.some(r=>[
      'DUPLICATE_SOURCE_DATE','INSUFFICIENT_EXPECTED_SESSIONS','NON_SYMBOL_SESSION_BAR_PRESENT',
      'EXPECTED_SESSION_MISSING_SOURCE','VOLUME_UNIT_UNKNOWN_OR_MISMATCH','INVALID_VOLUME_VALUE',
      'SOURCE_KNOWN_AT_INVALID','UNIT_SCALE_PATH_UNRESOLVED'
    ].includes(r));
    const status=hard?'DATA_BLOCKED':'UNKNOWN_BLOCKED';
    return result(status,reasons,{
      missingExpectedSessionCount:missing.length,
      comparableSessionCount:expectedRows.length,
      comparableSessionSetHash:comparableSessionSetHash(expected),
      rawActivityEligible:false,
      comparableParticipationEligible:false,
      pivotVolumeEligible:false
    });
  }

  const vols=expectedRows.map(r=>Number(r.volumeShares)).sort((a,b)=>a-b);
  const median=vols.length===20?(vols[9]+vols[10])/2:null;
  const currentVol=currentRow?Number(currentRow.volumeShares):null;
  const pvDailyRvol20=median!==null&&median>0&&Number.isFinite(currentVol)?currentVol/median:null;
  return result('PASS',[],{
    missingExpectedSessionCount:0,
    comparableSessionCount:20,
    comparableSessionSetHash:comparableSessionSetHash(expected),
    rawActivityEligible:true,
    comparableParticipationEligible,
    pivotVolumeEligible:true,
    baselineMedianVolumeShares:median,
    pvDailyRvol20
  });
}

export function signedVolumeBalance(rows=[]){
  if(!Array.isArray(rows)||rows.length<2) return null;
  let num=0,den=0;
  for(let i=1;i<rows.length;i++){
    const prev=Number(rows[i-1]?.close), cur=Number(rows[i]?.close), vol=Number(rows[i]?.volumeShares);
    if(!Number.isFinite(prev)||!Number.isFinite(cur)||!finiteNonNeg(vol)) return null;
    const s=cur>prev?1:cur<prev?-1:0;
    num+=s*vol;
    den+=vol;
  }
  return den>0?num/den:0;
}

export function evaluatePivotVolumeEligibility({continuityReceipt,pivot1,pivot2,signalAt,priceContinuityStatus='UNKNOWN'}={}){
  const reasons=[];
  if(!continuityReceipt || continuityReceipt.continuityJoinStatus!=='PASS') reasons.push('VOLUME_CONTINUITY_NOT_PASS');
  if(priceContinuityStatus!=='PASS') reasons.push('PRICE_CONTINUITY_NOT_PASS');
  const s=ms(signalAt), c1=ms(pivot1?.confirmedAt), c2=ms(pivot2?.confirmedAt);
  if(s===null||c1===null||c2===null||c1>s||c2>s) reasons.push('PIVOT_CONFIRMATION_CLOCK_INVALID');
  if(pivot1?.type!==pivot2?.type || pivot1?.scale!==pivot2?.scale) reasons.push('PIVOT_PAIR_TYPE_OR_SCALE_INVALID');
  return {pivotVolumeEligible:reasons.length===0, status:reasons.length?'UNKNOWN_BLOCKED':'PASS', unknownReasons:reasons};
}
