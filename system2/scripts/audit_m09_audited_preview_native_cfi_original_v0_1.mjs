// Independent research-only rehash of genuine official TWSE single-security
// ISIN/CFI original bytes, distinct from the primary 30 GET source process.
// Proves native source contents as OBSERVED NOW, never historical security PIT.
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const SHA=x=>createHash('sha256').update(x).digest('hex');
const HASH=/^[a-f0-9]{64}$/i,ISIN=/^[A-Z]{2}[A-Z0-9]{10}$/,CFI=/^[A-Z]{6}$/;
const strip=(obj,key)=>Object.fromEntries(Object.entries(obj||{}).filter(([k])=>k!==key));
const clean=s=>String(s??'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ')
 .replace(/&amp;/gi,'&').replace(/&#(\d+);/g,(_,v)=>String.fromCodePoint(+v))
 .replace(/[\s\u00a0\u3000]+/g,' ').trim();
function deny(x){throw Error('M09_INDEPENDENT_NATIVE_CFI_'+x)}
function independentlyParseNative(html,code){
 const matches=[];
 if(/FOR SECURITY REASONS|PAGE CAN NOT BE ACCESSED|access denied/i.test(html))return null;
 for(const tr of html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)||[]){
  const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(z=>clean(z[1]));
  if(cells.length<9||cells[2]!==code)continue;
  const row={isin:cells[1],code:cells[2],market:cells[4],type:cells[5],cfi:cells[8]};
  if(!ISIN.test(row.isin)||!CFI.test(row.cfi)||!row.market||!row.type)return null;
  matches.push(row);
 }
 return matches.length===1?matches[0]:null;
}
function board(market,native){
 // Native TPEx casing is "TPEx LISTED", while TWSE spells its name
 // differently. Normalize only the label, not the trusted market identity.
 const label=String(native||'').trim().toUpperCase();
 if(market==='TWSE'&&label==='TWSE LISTED')return 'TWSE_MAIN';
 if(market==='TPEX'&&label==='TPEX LISTED')return 'TPEX_MAIN';
 if(market==='TWSE'&&label==='TAIWAN INNOVATION BOARD')return 'TWSE_INNOVATION_BOARD_TIB';
 return 'UNKNOWN_OR_MISMATCH';
}
export async function auditM09ThirtyNativeOriginalsV0_1({
 sourceReceipt,readOriginal,auditedAtUtc=new Date().toISOString(),sourceRunId
}={}){
 if(sourceReceipt?.schemaVersion!=='S2_M09_AUDITED_PRELIMINARY_NATIVE_CFI_V0_1'||
  sourceReceipt.evidenceClass!=='ONLY_CURRENT_AS_OBSERVED_NATIVE_INSTRUMENT_TYPE_NOT_HISTORICAL_PIT'||
  sourceReceipt.preliminaryDenominator!==30||
  sourceReceipt.perSymbolNativeRequestsMade!==30||
  !Array.isArray(sourceReceipt.observations)||sourceReceipt.observations.length!==30||
  !HASH.test(sourceReceipt.receiptHash||'')||
  await sha256Hex(strip(sourceReceipt,'receiptHash'))!==sourceReceipt.receiptHash||
  sourceReceipt.historicalOrdinarySharePitCertified!==0||
  sourceReceipt.historicalOrdinarySharePitDenominatorCertified!==false||
  sourceReceipt.formalShortMomentumQualified!==false||
  sourceReceipt.selectedCount!==null||sourceReceipt.frozenD1Written!==false||
  !Number.isInteger(sourceRunId)||sourceRunId<=0||typeof readOriginal!=='function'||
  !Number.isFinite(Date.parse(auditedAtUtc))||
  Date.parse(auditedAtUtc)<Date.parse(sourceReceipt.currentNativeObservationFinishedUtc))
  deny('SOURCE_RECEIPT_SCOPE_HASH_OR_CLOCK_INVALID');
 const seen=new Set(),observations=[];let stocks=0,nonShare=0,unknown=0,tib=0,bytesVerified=0;
 for(const r of sourceReceipt.observations){
  if(!['TWSE','TPEX'].includes(r.market)||!/^[1-9][0-9]{3}$/.test(r.symbol||'')||
    seen.has(r.market+'|'+r.symbol)||!HASH.test(r.originalProviderSha256||'')||
    !Number.isInteger(r.originalProviderBytes)||r.originalProviderBytes<150)
   deny('SOURCE_SYMBOL_DUPLICATE_OR_ORIGINAL_MISSING');
  seen.add(r.market+'|'+r.symbol);
  const original=await readOriginal(r.symbol);
  if(!Buffer.isBuffer(original)||original.length!==r.originalProviderBytes||
    SHA(original)!==r.originalProviderSha256)
   deny('ORIGINAL_BYTE_SHA_MISMATCH');
  bytesVerified++;
  const p=independentlyParseNative(original.toString('utf8'),r.symbol);
  if(!p||p.cfi!==r.cfi||p.isin!==r.isin||p.type!==r.nativeTypeLabel||
    p.market!==r.nativeMarketLabel||
    r.originalSourceStatus!=='NATIVE_SINGLE_CFI_ROW_OBSERVED')
   deny('INDEPENDENT_NATIVE_ISIN_CFI_ROW_MISMATCH');
  const subtype=board(r.market,p.market);
  const stock=subtype!=='UNKNOWN_OR_MISMATCH'&&p.type==='Stocks'&&/^ES[A-Z]{4}$/.test(p.cfi);
  const excluded=subtype!=='UNKNOWN_OR_MISMATCH'&&
    ((p.type==='TDR'&&/^ED[A-Z]{4}$/.test(p.cfi))||
     (p.type==='ETF'&&/^CE[A-Z]{4}$/.test(p.cfi)));
  if(stock)stocks++;else if(excluded)nonShare++;else unknown++;
  if(subtype==='TWSE_INNOVATION_BOARD_TIB')tib++;
  const expect=stock?'CURRENT_NATIVE_STOCK_CFI_OBSERVED':
     excluded?'CURRENT_NATIVE_NON_SHARE_EXPLICIT':'NATIVE_CLASS_UNKNOWN';
  if(r.currentNativeIdentityStatus!==expect||
    r.nativeExchangeBoard!==subtype||
    r.nativeMarketMatchesPreliminaryMarket!==(subtype!=='UNKNOWN_OR_MISMATCH')||
    r.positiveOrdinaryEquityPitAdmitted!==false||
    r.historicalSecurityClassPitCertified!==false)
   deny('PRIMARY_INDEPENDENT_CLASS_DIFFERENCE');
  observations.push({symbol:r.symbol,market:r.market,originalProviderSha256:r.originalProviderSha256,
   independentNativeCFI:p.cfi,independentNativeType:p.type,
   independentMarketBoard:subtype,currentClass:expect,
   historicalPITCertified:false});
 }
 if(stocks!==sourceReceipt.currentNativeStockCfiObserved||
    nonShare!==sourceReceipt.currentNativeNonShareExplicit||
    unknown!==sourceReceipt.currentNativeUnverified||
    tib!==sourceReceipt.currentNativeInnovationBoardStocks)
  deny('SOURCE_COUNT_NOT_REPRODUCED');
 const base={schemaVersion:'S2_M09_INDEPENDENT_THIRTY_NATIVE_CFI_ORIGINAL_AUDIT_V0_1',
  evidenceClass:'CURRENT_NATIVE_SECURITY_TYPE_ONLY_NO_HISTORICAL_PIT',
  sourceRunId,sourceReceiptHash:sourceReceipt.receiptHash,
  sourceMarketDate:sourceReceipt.originalMarketDate,
  originalA1SourceReceiptHash:sourceReceipt.originalA1SourceReceiptHash,
  independentA1AuditHash:sourceReceipt.independentA1AuditHash,
  originalPreliminaryWatchHash:sourceReceipt.originalPreliminaryWatchHash,
  observedWindowFinishedAtUtc:sourceReceipt.currentNativeObservationFinishedUtc,
  independentAuditedAtUtc:auditedAtUtc,auditorSeparation:'INDEPENDENT_ORIGINAL_PROVIDER_BYTES_REHASH_AND_PARSE',
  auditedSymbolDenominator:observations.length,
  originalProviderResponsesRehashed:bytesVerified,
  nativeCurrentStockRowsReproduced:stocks,
  nativeCurrentNonShareRowsReproduced:nonShare,
  nativeCurrentUnknownReproduced:unknown,
  taiwanInnovationBoardRowsReproduced:tib,
  innovationBoardSpecialStrategyEligibilityCertified:false,
  originalProviderByteSourceAvailableAtHistoricalMarketDate:false,
  historicalOrdinarySharePITCertified:false,
  historicalOrdinarySharePITCount:0,
  entireStockUniverseClassPITCertified:false,
  corporateActionPITCertified:false,formalStage1SelectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreTouched:false,
  observations};
 return Object.freeze({...base,auditHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/audit_m09_audited_preview_native_cfi_original_v0_1.mjs')){
 const input=process.env.S2_M09_NATIVE_30_ORIGINAL_DIR||'/tmp/s2-m09-native-30-independent-readback';
 const receipt=JSON.parse(await readFile(resolve(input,'preview-native-cfi.json'),'utf8'));
 const audit=await auditM09ThirtyNativeOriginalsV0_1({
  sourceReceipt:receipt,
  sourceRunId:Number(process.env.S2_M09_NATIVE_SOURCE_RUN_ID),
  readOriginal:async code=>gunzipSync(await readFile(resolve(input,'native-'+code+'.html.gz')))
 });
 const out='/tmp/s2-m09-native-30-independent-audit';
 await mkdir(out,{recursive:true,mode:0o700});
 await writeFile(resolve(out,'audit-receipt.json'),
  JSON.stringify(audit,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  verdict:'ACCEPTED_CURRENT_NATIVE_ORIGINAL_CLASS_ONLY',
  currentStockNativeRows:audit.nativeCurrentStockRowsReproduced,
  currentOtherRows:audit.nativeCurrentNonShareRowsReproduced,
  currentUnknownRows:audit.nativeCurrentUnknownReproduced,
  taiwanInnovationBoardRows:audit.taiwanInnovationBoardRowsReproduced,
  originalProviderResponsesRehashed:audit.originalProviderResponsesRehashed,
  historicalOrdinarySharePITCertified:false,selectedCount:null,
  auditHash:audit.auditHash
 }));
}
