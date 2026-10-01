// Class A, read-only. Never interprets a failed scan as zero picks.
export const C1_REQUIRED_QUALITY = Object.freeze(["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"]);

export function previousTaipeiDate(now=new Date()) {
  const timestamp=now instanceof Date ? now.getTime() : Date.parse(now);
  if(!Number.isFinite(timestamp)) throw new Error("INVALID_OBSERVATION_CLOCK");
  return new Intl.DateTimeFormat("en-CA",{
    timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"
  }).format(new Date(timestamp-86400000));
}

export function classifyC1Readiness({scanDate,receiptError,receiptHttpStatus=200,
  scanStatus=null,institutionStatus=null,qualityStatus=null,readErrors={}}={}) {
  if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(String(scanDate||""))) throw new Error("SCAN_DATE_REQUIRED");
  const output={schemaVersion:"SYSTEM1_C1_READINESS_V0_1",scanDate,
    category:null,mayCountAsZeroPick:false,eligibleForResearch:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true,
    facts:{receiptError:String(receiptError||"UNKNOWN").slice(0,90),
      receiptHttpStatus:Number(receiptHttpStatus)||null,
      formalScanDate:scanStatus?.scanDate||null,
      formalPipelineComplete:scanStatus?.pipeline?.complete===true,
      institutionDate:institutionStatus?.marketDate||null,
      institutionReady:institutionStatus?.ready===true,
      qualityDate:qualityStatus?.marketDate||null,
      qualityReady:null,missingQuality:[],
      readErrors:Object.fromEntries(Object.entries(readErrors).map(([name,val])=>[name,String(val).slice(0,80)]))}};
  if([401,403].includes(receiptHttpStatus)||Object.values(readErrors).some(x=>x==="AUTH_REJECTED")){
    output.category="AUTHORIZATION_BLOCKED";return output;
  }
  if(receiptError!=="C1_GENERATION_NOT_FOUND"){
    output.category="C1_READ_FAILED";return output;
  }
  const q=qualityStatus;
  const qualityStates=[q?.index?.ready,q?.tdcc?.ready,...C1_REQUIRED_QUALITY.map(k=>q?.datasets?.[k]?.ready)];
  output.facts.qualityReady=qualityStates.every(x=>x===true)&&q?.marketDate===scanDate;
  output.facts.missingQuality=["INDEX","TDCC",...C1_REQUIRED_QUALITY].filter((_,i)=>qualityStates[i]!==true);
  if(scanStatus?.scanDate!==scanDate) {
    output.category=scanStatus?.scanDate?"FORMAL_SCAN_NOT_CONFIRMED":"FORMAL_SCAN_STATUS_UNKNOWN";
    return output;
  }
  if(scanStatus?.pipeline?.complete!==true) {
    output.category="FORMAL_PIPELINE_UNVERIFIED";return output;
  }
  if(institutionStatus?.marketDate!==scanDate||institutionStatus?.ready!==true||
     !output.facts.qualityReady){
    output.category=(institutionStatus?.ready===false||qualityStates.some(x=>x===false))
      ?"DATA_QUALITY_BLOCKED":"SOURCE_READBACK_UNKNOWN";
    return output;
  }
  output.category="C1_CAPTURE_OR_PERSISTENCE_GAP";
  return output;
}

export async function collectC1ReadOnlyPreflight({origin,token,scanDate,receiptError,
  receiptHttpStatus=200,request=fetch,timeoutMs=15000}={}) {
  if(!token) return classifyC1Readiness({scanDate,receiptError,receiptHttpStatus:401});
  const resources={
    scanStatus:"/api/scan/status",
    institutionStatus:"/api/institution-status?marketDate="+encodeURIComponent(scanDate),
    qualityStatus:"/api/quality-status?marketDate="+encodeURIComponent(scanDate)
  };
  const values={},readErrors={};
  await Promise.all(Object.entries(resources).map(async ([name,path])=>{
    try{
      const response=await request(String(origin).replace(/\\/$/,"")+path,{
        method:"GET",headers:{"x-admin-token":token,"accept":"application/json","cache-control":"no-cache"},
        signal:AbortSignal.timeout(timeoutMs)
      });
      if([401,403].includes(response.status)){readErrors[name]="AUTH_REJECTED";return;}
      if(!response.ok){readErrors[name]="HTTP_"+response.status;return;}
      const payload=await response.json();
      if(!payload||typeof payload!=="object"){readErrors[name]="INVALID_JSON_SHAPE";return;}
      values[name]=payload;
    }catch{readErrors[name]="READ_FAILED_OR_TIMEOUT";}
  }));
  return classifyC1Readiness({scanDate,receiptError,receiptHttpStatus,...values,readErrors});
}
