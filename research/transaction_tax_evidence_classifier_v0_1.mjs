// Taiwan stock transaction-tax evidence classifier v0.1 — research-only.
// Classifies evidence quality; does not silently choose a tax rate from signal timing.

function text(v){return String(v??"").trim().toUpperCase()}
function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function day(v){const t=Date.parse(v||"");return Number.isFinite(t)?new Date(t).toISOString().slice(0,10):null}

export function classifyTransactionTaxEvidence(raw={}){
  const actualTax=n(raw.actualTransactionTaxNTD);
  const source=text(raw.taxSource);
  const sellFill=raw.sellFill||{};
  const buyFills=Array.isArray(raw.buyFills)?raw.buyFills:[];
  const instrumentClass=text(raw.instrumentClass);
  const eligibility=raw.verifiedDayTradeEligibility;
  const account=text(sellFill.accountKey);
  const symbol=text(sellFill.symbol);
  const sellDay=day(sellFill.effectiveAt);

  if(actualTax!==null&&actualTax>=0&&["BROKER_STATEMENT","BROKER_IMPORT","VERIFIED_EXTERNAL"].includes(source)){
    return {
      status:"ACTUAL",
      taxClass:text(raw.actualTaxClass)||"BROKER_REPORTED",
      transactionTaxNTD:actualTax,
      rate:null,
      modeled:false,
      reason:"Broker/external tax amount directly evidenced."
    };
  }

  if(instrumentClass!=="TW_STOCK"){
    return {status:"UNKNOWN",taxClass:"UNKNOWN",modeled:false,reason:"Instrument class not positively certified as Taiwan stock."};
  }
  if(!account||!symbol||!sellDay||n(sellFill.fillPrice)===null||n(sellFill.filledShares)===null){
    return {status:"UNKNOWN",taxClass:"UNKNOWN",modeled:false,reason:"Sell fill identity/notional incomplete."};
  }

  if(eligibility===true){
    const sameDayBuy=buyFills.some(b=>
      text(b.accountKey)===account&&text(b.symbol)===symbol&&day(b.effectiveAt)===sellDay&&
      n(b.fillPrice)!==null&&n(b.filledShares)!==null
    );
    if(sameDayBuy){
      return {
        status:"MODELED",
        taxClass:"VERIFIED_DAY_TRADE_ELIGIBLE",
        rateSourceRequired:true,
        rate:null,
        transactionTaxNTD:null,
        modeled:true,
        reason:"Actual same-account same-symbol same-day fills plus positive day-trade eligibility; legal rate still must come from date-valid official rule or broker record."
      };
    }
  }

  if(eligibility===false){
    return {
      status:"MODELED",
      taxClass:"ORDINARY_STOCK_SALE",
      rateSourceRequired:true,
      rate:null,
      transactionTaxNTD:null,
      modeled:true,
      reason:"Day-trade reduced-tax eligibility positively false; ordinary stock-sale tax may be modeled using date-valid official rule."
    };
  }

  return {
    status:"UNKNOWN",
    taxClass:"UNKNOWN",
    rate:null,
    modeled:false,
    reason:"No broker-reported tax and day-trade eligibility is not positively classified. Same-day signals or fills alone do not determine tax class."
  };
}
