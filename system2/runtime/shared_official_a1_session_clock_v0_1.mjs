// Conservative resolution for delayed GitHub Actions schedule:
// a "today" after-close check is never a claim the provider published today.
// Provider response must still report the exact date and complete close session.
const DATE=/^\d{4}-\d{2}-\d{2}$/;
function localTime(utc){
 const d=new Date(utc);
 if(!Number.isFinite(+d))throw Error('SHARED_A1_CLOCK_INVALID');
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{
  timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',
  hour:'2-digit',hourCycle:'h23',minute:'2-digit'
 }).formatToParts(d).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 return {today:parts.year+'-'+parts.month+'-'+parts.day,
  hour:Number(parts.hour),minute:Number(parts.minute)};
}
function subtractDay(s){
 const d=new Date(s+'T00:00:00Z');
 if(!Number.isFinite(+d))throw Error('SHARED_A1_DATE_INVALID');
 d.setUTCDate(d.getUTCDate()-1);
 return d.toISOString().slice(0,10);
}
export function resolveLatestClosedTaiwanSessionV0_1({
 nowUtc,officialTradingDates,allowOlderManual=false,
}={}){
 const z=localTime(nowUtc);
 if(!Array.isArray(officialTradingDates)||officialTradingDates.length===0||
    officialTradingDates.some((x,i)=>!DATE.test(x)||(i>0&&x<=officialTradingDates[i-1])))
  throw Error('SHARED_A1_OFFICIAL_CALENDAR_UNVERIFIED');
 const upper=(z.hour>=20)?z.today:subtractDay(z.today);
 const prior=officialTradingDates.filter(x=>x<=upper).at(-1);
 if(!prior)return Object.freeze({state:'BLOCKED_CALENDAR_NO_ELIGIBLE_SESSION',marketDate:null});
 const isNewClose=(prior===upper);
 // On a holiday or weekend do not repeat Friday just because cron ran:
 // manual operator can explicitly request a previous closed session,
 // but such output stays RETROSPECTIVE_SOURCE_OBSERVATION_ONLY.
 if(!isNewClose&&!allowOlderManual)
  return Object.freeze({state:'SKIPPED_NO_NEW_OFFICIAL_TRADING_DAY',marketDate:prior,
   taipeiDate:z.today,sourceWasPublishedByThisResolver:false});
 return Object.freeze({
  state:'CANDIDATE_CLOSED_DATE_OFFICIAL_RESPONSE_MUST_CONFIRM',
  marketDate:prior,taipeiDate:z.today,
  retrospectiveOnly:prior!==z.today,
  eligibleToRunSourceReadOnly:true,
  todayProviderFinalityNotAsserted:true,
  publicSessionCloseTimeNotPublicationTime:true
 });
}
export function chooseVerifiedSeedArtifactV0_1({
 artifacts=[],currentRunId,expectedPrefix='s2-shared-official-a1-'
}={}){
 if(!Array.isArray(artifacts))throw Error('SHARED_A1_ARTIFACT_LIST_INVALID');
 const eligible=artifacts.filter(x=>
  typeof x?.name==='string'&&x.name.startsWith(expectedPrefix)&&
  x.expired!==true&&x.workflow_run?.id!==Number(currentRunId)&&
  Number.isSafeInteger(x.workflow_run?.id)&&
  typeof x.created_at==='string'&&Number.isFinite(Date.parse(x.created_at))
 ).sort((a,b)=>b.created_at.localeCompare(a.created_at));
 const x=eligible[0];
 return x?Object.freeze({runId:x.workflow_run.id,artifactName:x.name,artifactId:x.id}):null;
}
