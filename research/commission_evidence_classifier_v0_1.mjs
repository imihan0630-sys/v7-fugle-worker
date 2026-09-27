// Brokerage commission evidence classifier v0.1 — research-only.
// Separates ACTUAL charged commission from broker-specific MODELED schedules and UNKNOWN.
// Never assumes a universal Taiwan commission rate or minimum.

function text(v){return String(v??"").trim().toUpperCase()}
function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}

export function classifyCommissionEvidence(raw={}){
  const actual=n(raw.actualCommissionNTD);
  const actualSource=text(raw.actualSource);
  if(actual!==null&&actual>=0&&["BROKER_STATEMENT","BROKER_IMPORT","VERIFIED_EXTERNAL"].includes(actualSource)){
    return {
      status:"ACTUAL",
      commissionNTD:actual,
      modeled:false,
      source:actualSource,
      reason:"Directly evidenced charged commission."
    };
  }

  const rate=n(raw.brokerCommissionRate);
  const minimum=n(raw.brokerMinimumCommissionNTD);
  const scheduleSource=text(raw.scheduleSource);
  const notional=n(raw.executedNotionalNTD);
  const scheduleVerified=["BROKER_CONTRACT","BROKER_PUBLISHED_SCHEDULE","VERIFIED_EXTERNAL"].includes(scheduleSource);

  if(scheduleVerified&&rate!==null&&rate>=0&&minimum!==null&&minimum>=0&&notional!==null&&notional>=0){
    const percentageFee=notional*rate;
    const modeled=Math.max(percentageFee,minimum);
    return {
      status:"MODELED",
      commissionNTD:modeled,
      modeled:true,
      source:scheduleSource,
      brokerCommissionRate:rate,
      brokerMinimumCommissionNTD:minimum,
      percentageFeeNTD:percentageFee,
      reason:"Broker-specific verified schedule applied to executed notional; not an actual charged-fee receipt."
    };
  }

  return {
    status:"UNKNOWN",
    commissionNTD:null,
    modeled:false,
    source:null,
    reason:"No actual charged commission and no complete verified broker-specific rate+minimum schedule."
  };
}
