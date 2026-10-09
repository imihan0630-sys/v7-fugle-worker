import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// Fail before contacting a Worker or any official endpoint. Explicit data_only
// and quality_only recovery modes are mutually exclusive and never scan.
export function validateDispatchScope({marketDate="",qualityOnly=false,dataOnly=false}={}) {
  const date=String(marketDate||"").trim();
  const quality=qualityOnly===true || String(qualityOnly).toLowerCase()==="true";
  const data=dataOnly===true || String(dataOnly).toLowerCase()==="true";
  assert.ok(!(quality && data),"quality_only and data_only cannot both be true");
  assert.ok(!date || /^\d{4}-\d{2}-\d{2}$/.test(date),"market_date must be YYYY-MM-DD");
  if(data) assert.match(date,/^\d{4}-\d{2}-\d{2}$/,"data_only requires market_date");
  return {marketDate:date,qualityOnly:quality,dataOnly:data,
    scanAllowed:!quality&&!data,noOrders:true,noPushForDataOnly:data};
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const result=validateDispatchScope({
    marketDate:process.env.RECOVERY_INPUT_MARKET_DATE,
    qualityOnly:process.env.RECOVERY_INPUT_QUALITY_ONLY,
    dataOnly:process.env.RECOVERY_INPUT_DATA_ONLY
  });
  console.log(JSON.stringify({ok:true,...result}));
}
