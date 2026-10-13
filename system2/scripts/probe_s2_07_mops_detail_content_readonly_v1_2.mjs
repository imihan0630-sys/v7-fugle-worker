import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";

const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";

function stripHtml(value){
  return String(value||"")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&")
    .replace(/&lt;/gi,"<")
    .replace(/&gt;/gi,">")
    .replace(/&quot;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'")
    .replace(/\s+/g," ")
    .trim();
}
function sha256(text){return createHash("sha256").update(String(text)).digest("hex");}
function fetchDetail({spokeDate,spokeTime,seqNo}){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-S2-07-MOPS-Detail-Content/1.2",
    "--data-urlencode","firstin=true",
    "--data-urlencode","step=2",
    "--data-urlencode","off=1",
    "--data-urlencode","seq_no="+seqNo,
    "--data-urlencode","spoke_time="+spokeTime,
    "--data-urlencode","spoke_date="+spokeDate,
    "--data-urlencode","co_id=4806",
    "--data-urlencode","TYPEK=otc",
    MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error||p.status!==0)throw new Error(String(p.stderr||p.error||"MOPS detail curl failure").slice(0,500));
  const text=stripHtml(p.stdout);
  return {
    payloadHash:sha256(p.stdout),
    contentLength:p.stdout.length,
    text:text.slice(0,12000),
    contains6996112203:/699\.6112203/.test(text),
    contains69961122000:/699\.61122000/.test(text),
    contains30038878:/30\.038878/.test(text),
    contains20261002:/115[\/年]10[\/月]02|2026[\/\-]10[\/\-]02/.test(text),
    containsReduction:/減資/.test(text),
    containsExchangePlan:/換股|換發/.test(text),
  };
}

const targets=[
  {versionKey:"2026-08-07|16:45:21|3",spokeDate:"20260807",spokeTime:"164521",seqNo:"3"},
  {versionKey:"2026-08-28|15:14:20|2",spokeDate:"20260828",spokeTime:"151420",seqNo:"2"},
  {versionKey:"2026-09-08|17:03:24|1",spokeDate:"20260908",spokeTime:"170324",seqNo:"1"},
];

const results=targets.map((target)=>({...target,detail:fetchDetail(target)}));

console.log(JSON.stringify({
  result:"S2_07_MOPS_DETAIL_CONTENT_V1_2_COMPLETE",
  targetCount:targets.length,
  results,
  evidence:{
    exactReductionShareRatioObserved:results.some((x)=>x.detail.contains6996112203||x.detail.contains69961122000),
    reductionPercentageObserved:results.some((x)=>x.detail.contains30038878),
    resumeDateObserved:results.some((x)=>x.detail.contains20261002),
  },
  boundaries:{
    readOnly:true,
    timestampPromotionPerformed:false,
    knownAtVersionClockCertified:false,
    pitReplayAuthority:false,
    historyMutationPerformed:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  },
},null,2));
