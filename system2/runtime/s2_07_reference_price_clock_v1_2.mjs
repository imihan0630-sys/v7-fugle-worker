import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_REFERENCE_PRICE_VERSION_CLOCK_VERSION = "1.2-RESEARCH";

function text(value){return value==null?"":String(value).trim();}
function positive(value){const n=Number(value);return Number.isFinite(n)&&n>0?n:null;}
function versionKey(row){return [row?.date||"",row?.time||"",row?.seqNo||""].join("|");}
function escapeRegExp(value){return String(value).replace(/[.*+?^$()|[\]\\{}]/g,"\\$&");}
function numberToken(textValue,value){
  const n=positive(value);if(!n)return false;
  const variants=new Set([String(n),n.toFixed(2).replace(/0+$/,"").replace(/\.$/,"")]);
  const source=text(textValue).replaceAll(",","");
  return [...variants].some((token)=>new RegExp("(^|[^0-9.])"+escapeRegExp(token)+"([^0-9.]|$)").test(source));
}
function sourceReportedAt(row){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(text(row?.date))||!/^\d{2}:\d{2}:\d{2}$/.test(text(row?.time)))return null;
  const parsed=new Date(row.date+"T"+row.time+"+08:00");
  return Number.isFinite(parsed.getTime())?parsed.toISOString():null;
}
export function classifyReferencePriceClockRowV1_2(row,{symbol,preActionClose,officialReferencePrice}={}){
  const rowText=text(row?.rowText);
  const hasSymbol=rowText.includes(text(symbol));
  const familyContext=/減資/.test(rowText);
  const referenceContext=/參考價|參考價格|恢復買賣.*參考|恢復交易.*參考/.test(rowText);
  const closeContext=/收盤|最後交易日|停止買賣前/.test(rowText);
  const hasReference=numberToken(rowText,officialReferencePrice);
  const hasPreClose=numberToken(rowText,preActionClose);
  const clock=sourceReportedAt(row);
  let evidenceClass="EVENT_IDENTITY_ONLY";
  if(referenceContext&&hasReference&&closeContext&&hasPreClose)evidenceClass="REFERENCE_PAIR_EVIDENCE";
  else if(referenceContext&&hasReference)evidenceClass="REFERENCE_PRICE_EVIDENCE";
  else if(/恢復買賣|恢復交易|停止買賣|換發/.test(rowText))evidenceClass="SCHEDULE_EVIDENCE";
  return deepFreeze({
    versionKey:versionKey(row),
    date:row?.date||null,
    time:row?.time||null,
    seqNo:row?.seqNo||null,
    sourceReportedAt:clock,
    rowText,
    hasSymbol,
    familyContext,
    referenceContext,
    closeContext,
    exactReferencePriceObserved:hasReference,
    exactPreActionCloseObserved:hasPreClose,
    evidenceClass,
    correctionOrCancellationHint:row?.correctionOrCancellationHint===true,
  });
}

export function evaluateReferencePriceVersionClockV1_2({
  symbol,
  family,
  effectiveDate,
  officialEventVersionId,
  officialSourceRowHash,
  preActionClose,
  officialReferencePrice,
  mopsRows=[],
  queryIntegrityExact=false,
}={}){
  const code=text(symbol),fam=text(family),date=text(effectiveDate);
  if(!code)throw new Error("symbol is required");
  if(fam!=="CAPITAL_REDUCTION")throw new Error("V1.2 bounded contract supports CAPITAL_REDUCTION only");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error("effectiveDate must be YYYY-MM-DD");
  const pre=positive(preActionClose),ref=positive(officialReferencePrice);
  if(!pre||!ref)throw new Error("positive official reference pair is required");
  const rows=(Array.isArray(mopsRows)?mopsRows:[])
    .filter((row)=>row?.date&&row.date<=date)
    .map((row)=>classifyReferencePriceClockRowV1_2(row,{symbol:code,preActionClose:pre,officialReferencePrice:ref}))
    .sort((a,b)=>a.versionKey.localeCompare(b.versionKey));
  const linked=rows.filter((row)=>row.hasSymbol&&row.familyContext);
  const pairRows=linked.filter((row)=>row.evidenceClass==="REFERENCE_PAIR_EVIDENCE"&&row.sourceReportedAt);
  const priceRows=linked.filter((row)=>["REFERENCE_PAIR_EVIDENCE","REFERENCE_PRICE_EVIDENCE"].includes(row.evidenceClass)&&row.sourceReportedAt);
  const earliestPair=pairRows[0]||null;
  const earliestPrice=priceRows[0]||null;
  const candidateObserved=queryIntegrityExact===true&&Boolean(earliestPair);
  const blockers=[];
  if(queryIntegrityExact!==true)blockers.push("MOPS_QUERY_INTEGRITY_NOT_EXACT");
  if(!linked.length)blockers.push("LINKED_MOPS_EVENT_ROWS_NOT_OBSERVED");
  if(!priceRows.length)blockers.push("OFFICIAL_REFERENCE_PRICE_NOT_OBSERVED_IN_TIMESTAMPED_MOPS_ROWS");
  if(priceRows.length&&!pairRows.length)blockers.push("OFFICIAL_REFERENCE_PAIR_NOT_OBSERVED_IN_SINGLE_TIMESTAMPED_MOPS_ROW");

  return deepFreeze({
    schemaVersion:"S2_S2_07_REFERENCE_PRICE_VERSION_CLOCK_V1_2",
    version:S2_07_REFERENCE_PRICE_VERSION_CLOCK_VERSION,
    symbol:code,
    family:fam,
    effectiveDate:date,
    officialEventVersionId:text(officialEventVersionId)||null,
    officialSourceRowHash:text(officialSourceRowHash)||null,
    officialPreActionClose:pre,
    officialReferencePrice:ref,
    queryIntegrityExact:queryIntegrityExact===true,
    inspectedRowCount:rows.length,
    linkedEventRowCount:linked.length,
    referencePriceEvidenceRowCount:priceRows.length,
    referencePairEvidenceRowCount:pairRows.length,
    earliestReferencePriceSourceReportedAt:earliestPrice?.sourceReportedAt||null,
    earliestReferencePairSourceReportedAt:earliestPair?.sourceReportedAt||null,
    referencePairTimestampCandidateObserved:candidateObserved,
    state:candidateObserved
      ?"REFERENCE_PAIR_TIMESTAMP_CANDIDATE_OBSERVED_REVIEW_REQUIRED"
      :"REFERENCE_PRICE_VERSION_CLOCK_NOT_PROVEN",
    blockers:deepFreeze([...new Set(blockers)]),
    rows:deepFreeze(rows),
    historicalAvailabilityProven:false,
    knownAtVersionClockCertified:false,
    verifiedSourceTimestampPromoted:false,
    firstKnownAt:null,
    availableAt:null,
    pitEventReplayEligible:false,
    pitTechnicalContinuityReplayEligible:false,
    technicalContinuityCertified:false,
    continuityTransformPerformed:false,
    historyMutationPerformed:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
