from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

def insert_after_once(marker,addition,label):
    global text
    count=text.count(marker)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text=text.replace(marker,marker+addition,1)

replace_once(
    'const VERSION = "8.9.8-staged-recovery";',
    'const VERSION = "8.9.9-staged-delivery";',
    "runtime version"
)

replace_once(
'''        } else if([401,403].includes(Number(latest.threeMin?.httpStatus))) {
          // 401/403明確表示先前外部未接受寫入；憑證已另經唯讀auth-check驗證後，才可補送一次。
          externalPostPerformed=true;
          bridge=await sendTo3Min(expected,env);
        } else {''',
'''        } else if([401,403].includes(Number(latest.threeMin?.httpStatus)) ||
          (latest.threeMin?.skipped===true && latest.threeMin?.reason==="provider-neutral staged recovery")) {
          // 401/403明確表示先前外部未接受寫入；或 staged recovery 明確記錄「從未POST 3Min」。
          // 兩者都先完成精確GET讀回且未找到相同payload，才允許最多POST一次。
          externalPostPerformed=true;
          bridge=await sendTo3Min(expected,env);
        } else {''',
    "allow exactly-once 3Min delivery for staged recovery"
)

marker='''      const report=await sendTrackedPush(payload,env,{note:"人工授權補發盤後3+3+3結果"});'''
addition=r'''
      const deliveryAccepted=report?.sent===true && (isTestMode(env) || report?.deliveryState==="ACCEPTED");
      if(deliveryAccepted) {
        const refreshed={
          ...latest,
          version:VERSION,
          dailyReport:report,
          pipeline:{
            ...(latest.pipeline||{}),
            dailyReportAccepted:true,
            dailyWebhookAccepted:true,
            dailyDeliveryState:report.deliveryState || "ACCEPTED",
            dailyResultPushRequired:true,
            dailyResultZeroSelection:formal.length===0,
            phoneReceiptVerified:report.phoneReceiptVerified===true,
            complete:(latest.pipeline?.configVerified===true) &&
              (latest.pipeline?.externalPlanVerified===true || latest.pipeline?.threeMinVerified===true) &&
              true
          }
        };
        await env.STOCKS_KV.put(LAST_SCAN_KEY,JSON.stringify(refreshed),{expirationTtl:14*86400});
        await env.STOCKS_KV.put("V7_LAST_SCAN_ATTEMPT",JSON.stringify({
          status:"DELIVERY_ACCEPTED",requestedDate:latest.scanDate,scanDate:latest.scanDate,
          selectedCount:formal.length,generatedAt:refreshed.generatedAt,dailyReport:report
        }),{expirationTtl:14*86400});
      }
'''
insert_after_once(marker,addition,"persist accepted daily resend into latest result")

path.write_text(text,encoding="utf-8")
print("Applied V8.9.9 staged delivery")
