function num(value){
  if(value===null||value===undefined||value==="") return null;
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}
function own(obj,key){return Object.prototype.hasOwnProperty.call(obj||{},key);}
function mergedSlot(official,custom,key){
  if(own(custom,key)) return {key,origin:"CUSTOM",raw:custom[key]};
  if(own(official,key)) return {key,origin:"OFFICIAL",raw:official[key]};
  return {key,origin:"ABSENT",raw:undefined};
}
function firstNullishMerged(official,custom,keys){
  for(const key of keys){
    const slot=mergedSlot(official,custom,key);
    if(slot.raw!==null&&slot.raw!==undefined) return slot;
  }
  return {key:null,origin:"ABSENT",raw:undefined};
}
function lowerAliasNumericExists(official,custom,keys,selectedKey){
  const start=selectedKey?keys.indexOf(selectedKey)+1:0;
  for(let i=Math.max(0,start);i<keys.length;i++){
    const slot=mergedSlot(official,custom,keys[i]);
    if(num(slot.raw)!==null) return {exists:true,key:slot.key,origin:slot.origin,value:num(slot.raw)};
  }
  return {exists:false,key:null,origin:null,value:null};
}
export function classifyMarketCapSourceV0_1({
  officialStock={},
  customStock={},
  close=null,
  officialSourceEvidence=null,
  customSourceEvidence=null
}={}){
  const explicitKeys=["marketCapYi","marketCap100m","市值_億"];
  const shareKeys=["sharesOutstanding","發行股數"];
  const explicit=firstNullishMerged(officialStock,customStock,explicitKeys);
  const explicitNumber=num(explicit.raw);
  const shares=firstNullishMerged(officialStock,customStock,shareKeys);
  const sharesNumber=num(shares.raw);
  const closeNumber=num(close);
  const ignoredLowerExplicit=explicitNumber===null
    ? lowerAliasNumericExists(officialStock,customStock,explicitKeys,explicit.key)
    : {exists:false,key:null,origin:null,value:null};
  const ignoredLowerShares=sharesNumber===null
    ? lowerAliasNumericExists(officialStock,customStock,shareKeys,shares.key)
    : {exists:false,key:null,origin:null,value:null};

  let marketCapYi=null,sourceType="UNKNOWN",sourceOrigin="UNKNOWN",sourceField=null;
  let sourceEvidence=null,calculation="UNAVAILABLE";

  if(explicitNumber!==null){
    marketCapYi=explicitNumber;
    sourceOrigin=explicit.origin;
    sourceField=explicit.key;
    sourceType=explicit.origin==="CUSTOM"
      ?"CUSTOM_EXPLICIT_MARKET_CAP"
      :explicit.origin==="OFFICIAL"
        ?"OFFICIAL_EXPLICIT_MARKET_CAP_UNEXPECTED_CURRENT_PATH"
        :"UNKNOWN";
    sourceEvidence=explicit.origin==="CUSTOM"?customSourceEvidence:officialSourceEvidence;
    calculation="EXPLICIT";
  }else if(sharesNumber!==null && sharesNumber!==0 && closeNumber!==null){
    marketCapYi=sharesNumber*closeNumber/1e8;
    sourceOrigin=shares.origin;
    sourceField=shares.key;
    sourceType=shares.origin==="CUSTOM"
      ?"CUSTOM_SHARES_X_CLOSE"
      :shares.origin==="OFFICIAL"
        ?"OFFICIAL_SHARES_X_CLOSE"
        :"UNKNOWN";
    sourceEvidence=shares.origin==="CUSTOM"?customSourceEvidence:officialSourceEvidence;
    calculation="SHARES_X_CLOSE";
  }else if(explicit.key && explicitNumber===null){
    sourceType="INVALID_EXPLICIT_THEN_FALLBACK_UNAVAILABLE";
    sourceOrigin=explicit.origin;
    sourceField=explicit.key;
    sourceEvidence=explicit.origin==="CUSTOM"?customSourceEvidence:officialSourceEvidence;
  }else if(shares.key && sharesNumber===null){
    sourceType="INVALID_SHARES_SOURCE";
    sourceOrigin=shares.origin;
    sourceField=shares.key;
    sourceEvidence=shares.origin==="CUSTOM"?customSourceEvidence:officialSourceEvidence;
  }

  const sourceDate=sourceEvidence?.sourceDate??null;
  const capturedAt=sourceEvidence?.capturedAt??null;
  const pointInTimeEligible=sourceEvidence?.pointInTimeEligible===true
    ? true
    :sourceEvidence?.pointInTimeEligible===false
      ? false
      :null;

  return {
    schemaVersion:"market-cap-source-classifier-v0.1",
    marketCapYi,
    calculation,
    sourceType,
    sourceOrigin,
    sourceField,
    sourceDate,
    capturedAt,
    pointInTimeEligible,
    sourceQualityState:sourceDate&&pointInTimeEligible===true?"SOURCE_ID_AND_PIT_POSITIVE":"SOURCE_ID_OR_PIT_INCOMPLETE",
    mergeSemantics:{
      explicitSelectedField:explicit.key,
      explicitSelectedRaw:explicit.raw??null,
      explicitSelectedNumeric:explicitNumber,
      shareSelectedField:shares.key,
      shareSelectedRaw:shares.raw??null,
      shareSelectedNumeric:sharesNumber,
      ignoredLowerExplicitAlias:ignoredLowerExplicit,
      ignoredLowerShareAlias:ignoredLowerShares
    },
    guards:{
      mirrorsCurrentMergeOrder:true,
      postMergeInferenceAllowed:false,
      missingSourceDateIsUnknown:true,
      decisionImpact:false,
      formalCoreImpact:false
    }
  };
}
