// D01 Class-A research. Fail-closed UTC instant comparison across ISO-8601 timezones.
// This is a mechanical clock oracle, not a source first-known authenticity certificate.
const STRICT_ISO=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-])(\d{2}):(\d{2}))$/;
export function parsePITInstant(value){
  if(typeof value!=="string")return null;
  const m=STRICT_ISO.exec(value);
  if(!m)return null;
  const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]),h=Number(m[4]),
    mi=Number(m[5]),s=Number(m[6]),oh=Number(m[10]||0),om=Number(m[11]||0);
  if(y<1900||y>2199||mo<1||mo>12||d<1||d>31||h>23||mi>59||s>59||
     oh>14||om>59||(oh===14&&om!==0))return null;
  const date=new Date(Date.UTC(y,mo-1,d));
  if(date.getUTCFullYear()!==y||date.getUTCMonth()+1!==mo||date.getUTCDate()!==d)
    return null;
  const result=Date.parse(value);
  return Number.isFinite(result)?result:null;
}
export function comparePITInstants(availableAt,decisionAt){
  const a=parsePITInstant(availableAt),d=parsePITInstant(decisionAt);
  if(a===null||d===null)return {state:"CLOCK_UNKNOWN"};
  return {state:a<=d?"KNOWN_BY_CUTOFF":"AFTER_CUTOFF"};
}
