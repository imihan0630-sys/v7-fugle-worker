import { deepFreeze } from "./factor_snapshot.mjs";

export const MOPSOV_SOURCE_REPORTED_CLOCK_VERSION = "0.1-RESEARCH";

function text(value){ return value == null ? "" : String(value).trim(); }

function validDateParts(year,month,day){
  const iso=String(year).padStart(4,"0")+"-"+String(month).padStart(2,"0")+"-"+String(day).padStart(2,"0");
  const d=new Date(iso+"T00:00:00.000Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10)===iso;
}

export function mopsovSourceReportedAtV0_1(row={}){
  const dateRaw=text(row.spokeDateRaw);
  const timeRaw=text(row.spokeTimeRaw);
  if(!/^\d{8}$/.test(dateRaw) || !/^\d{6}$/.test(timeRaw)){
    return deepFreeze({eligible:false,sourceReportedAt:null,reason:"INVALID_HIDDEN_DATE_TIME"});
  }
  const year=Number(dateRaw.slice(0,4));
  const month=Number(dateRaw.slice(4,6));
  const day=Number(dateRaw.slice(6,8));
  const hour=Number(timeRaw.slice(0,2));
  const minute=Number(timeRaw.slice(2,4));
  const second=Number(timeRaw.slice(4,6));
  if(!validDateParts(year,month,day) || hour>23 || minute>59 || second>59){
    return deepFreeze({eligible:false,sourceReportedAt:null,reason:"INVALID_HIDDEN_DATE_TIME"});
  }
  const visibleDate=text(row.date);
  const visibleTime=text(row.time);
  const expectedDate=dateRaw.slice(0,4)+"-"+dateRaw.slice(4,6)+"-"+dateRaw.slice(6,8);
  const expectedTime=timeRaw.slice(0,2)+":"+timeRaw.slice(2,4)+":"+timeRaw.slice(4,6);
  if(visibleDate!==expectedDate || visibleTime!==expectedTime){
    return deepFreeze({
      eligible:false,
      sourceReportedAt:null,
      reason:"VISIBLE_HIDDEN_CLOCK_MISMATCH",
      expectedDate,
      expectedTime,
      visibleDate,
      visibleTime,
    });
  }
  const seqNo=text(row.seqNo);
  if(!/^\d+$/.test(seqNo) || Number(seqNo)<=0){
    return deepFreeze({eligible:false,sourceReportedAt:null,reason:"INVALID_SEQUENCE_NUMBER"});
  }
  return deepFreeze({
    eligible:true,
    sourceReportedAt:expectedDate+"T"+expectedTime+"+08:00",
    sourceReportedDate:expectedDate,
    sourceReportedTime:expectedTime,
    seqNo,
    versionKey:[expectedDate,expectedTime,seqNo].join("|"),
    reason:null,
  });
}

function compareIso(a,b){
  const aa=Date.parse(a);
  const bb=Date.parse(b);
  if(!Number.isFinite(aa)||!Number.isFinite(bb)) return null;
  return aa-bb;
}

export function certifyMopsovSourceReportedControlV0_1({control,rows=[]}={}){
  if(!control || typeof control!=="object") throw new Error("control is required");
  if(!Array.isArray(rows)) throw new Error("rows must be an array");

  const mapped=rows.map((row)=>{
    const clock=mopsovSourceReportedAtV0_1(row);
    return deepFreeze({
      rowText:text(row?.rowText),
      correctionOrCancellationHint:row?.correctionOrCancellationHint===true,
      ...clock,
    });
  });
  const allClockConsistent=mapped.length>0 && mapped.every((x)=>x.eligible);
  const versionKeys=mapped.map((x)=>x.versionKey).filter(Boolean);
  const uniqueVersionKeys=new Set(versionKeys);
  const uniqueVersionIdentity=versionKeys.length>0 && uniqueVersionKeys.size===versionKeys.length;

  const originals=mapped.filter((x)=>!x.correctionOrCancellationHint);
  const revisions=mapped.filter((x)=>x.correctionOrCancellationHint);
  let temporalOrderingPass=false;
  let cancellationSemanticsPass=false;

  if(control.mode==="ORIGINAL_PLUS_CORRECTION"){
    const originalTimes=originals.map((x)=>x.sourceReportedAt).filter(Boolean);
    const revisionTimes=revisions.map((x)=>x.sourceReportedAt).filter(Boolean);
    if(originalTimes.length>0 && revisionTimes.length>0){
      const earliestOriginal=[...originalTimes].sort((a,b)=>Date.parse(a)-Date.parse(b))[0];
      temporalOrderingPass=revisionTimes.every((t)=>compareIso(t,earliestOriginal)>0);
    }
  }else if(control.mode==="CANCELLATION_ROW"){
    cancellationSemanticsPass=
      revisions.length>=1 &&
      revisions.some((x)=>/撤銷|取消/.test(x.rowText)) &&
      revisions.every((x)=>Boolean(x.sourceReportedAt));
    temporalOrderingPass=cancellationSemanticsPass;
  }

  const pass=
    allClockConsistent &&
    uniqueVersionIdentity &&
    temporalOrderingPass &&
    (
      control.mode==="ORIGINAL_PLUS_CORRECTION"
        ? originals.length>=1 && revisions.length>=1
        : cancellationSemanticsPass
    );

  return deepFreeze({
    controlId:control.id,
    actionFamily:control.actionFamily,
    mode:control.mode,
    pass,
    allClockConsistent,
    uniqueVersionIdentity,
    temporalOrderingPass,
    cancellationSemanticsPass,
    originalCount:originals.length,
    revisionOrCancellationCount:revisions.length,
    rows:Object.freeze(mapped),
  });
}

export function summarizeMopsovSourceReportedClockV0_1(controlResults=[]){
  if(!Array.isArray(controlResults)) throw new Error("controlResults must be an array");
  const passCount=controlResults.filter((x)=>x?.pass===true).length;
  const sourceReportedVersionClockSemanticsCertified=
    controlResults.length>=5 &&
    passCount===controlResults.length;

  return deepFreeze({
    schemaVersion:"S2_MOPSOV_SOURCE_REPORTED_CLOCK_V0_1",
    version:MOPSOV_SOURCE_REPORTED_CLOCK_VERSION,
    state:sourceReportedVersionClockSemanticsCertified
      ? "MOPSOV_SOURCE_REPORTED_VERSION_CLOCK_CERTIFIED"
      : "MOPSOV_SOURCE_REPORTED_VERSION_CLOCK_BLOCKED",
    controlCount:controlResults.length,
    passCount,
    controls:Object.freeze(controlResults),
    sourceReportedVersionClockSemanticsCertified,

    // Important semantic boundary:
    // source-reported clock != independently observed public availability clock.
    historicalKnownAtCandidateClockAvailable:sourceReportedVersionClockSemanticsCertified,
    publicAvailabilityLatencyCertified:false,
    knownAtVersionClockCertified:false,
    pitReplayUseAsAvailableAtAuthorized:false,

    boundedIntervalCoverageComplete:false,
    actionFamilyCoverageComplete:false,
    cancellationHistoryComplete:false,
    revisionCoverageComplete:false,
    noEventMayBeClaimed:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    historyMutationPerformed:false,
    strategyEvaluationPerformed:false,
    capacityRunProduced:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
