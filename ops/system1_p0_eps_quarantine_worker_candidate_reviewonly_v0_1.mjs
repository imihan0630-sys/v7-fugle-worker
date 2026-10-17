// Original Worker.js remains unchanged: create local REVIEW-ONLY experiment artifact.
// NEVER deploy generated output or promote as Formal without separate approval.
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
const SOURCE="Worker.js",OUTPUT="artifacts/reviewonly/system1_eps_quarantine_dryrun_worker.mjs";
const ORIGINAL_GIT_BLOB="24fd61d7b8dfd5610c40cc67a2b6807dd622bd73";
const CANDIDATE_GIT_BLOB="371cf8718c3690ea0a8bc7d83088b0f9efb9c354";
const PATCHES=[
  [
    "function selectTomorrowCandidates(",
    "// RESEARCH-ONLY: candidate-level original-parser EPS admission. This helper\n// NEVER enables live selection; it is called only for explicit dry-run shadow.\n// A-only individual financial statements must not be laundered into C.\nfunction system1ShadowEpsCandidateStatus(candidate,quarterSnapshot) {\n  const row=quarterSnapshot?.stocks?.[candidate?.symbol];\n  if(!row || typeof row!==\"object\" || Array.isArray(row)) return {allowed:false,reason:\"MISSING_CANDIDATE_SOURCE\"};\n  if(row.quarterEpsSource!==\"https://mopsov.twse.com.tw/mops/web/ajax_t164sb04\" ||\n     typeof row.epsBasis!==\"string\" || !row.epsBasis.includes(\"MOPS合併綜合損益表\"))\n    return {allowed:false,reason:\"OFFICIAL_CONSOLIDATED_C_BASIS_NOT_VERIFIED\"};\n  if(row.quarterEpsYear!==quarterSnapshot.year ||\n     row.quarterEpsQuarter!==quarterSnapshot.quarter)\n    return {allowed:false,reason:\"QUARTER_OR_ISSUER_PERIOD_MISMATCH\"};\n  if(row.quarterEpsVerified!==true || !Number.isFinite(row.quarterEPS))\n    return {allowed:false,reason:\"CURRENT_QUARTER_ACTUAL_EPS_MISSING\"};\n  if(quarterSnapshot.quarter>1 &&\n     (row.previousQuarterEpsVerified!==true ||\n      row.previousQuarterEpsYear!==quarterSnapshot.year ||\n      row.previousQuarterEpsQuarter!==quarterSnapshot.quarter-1 ||\n      !Number.isFinite(row.previousQuarterEPS)))\n    return {allowed:false,reason:\"PREVIOUS_QUARTER_ACTUAL_EPS_MISSING\"};\n  return {allowed:true,reason:null};\n}\n\nfunction selectTomorrowCandidates("
  ],
  [
    "  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData }, marketDate);\n",
    "  // Safe source-identity and date preflight. TRUE only on explicit dry-run;\n  // HTTP/Cron live run has no route to activate this Shadow adapter.\n  const epsQuarantineDryRun = dryRun && options?.epsQuarantineShadow===true && !epsReviewOnly;\n  if(epsQuarantineDryRun &&\n     (!quarterEps || quarterEps.asOfDate!==marketDate ||\n      quarterEps.year!==financialData.year || quarterEps.quarter!==financialData.quarter ||\n      !quarterEps.stocks || typeof quarterEps.stocks!==\"object\" ||\n      Array.isArray(quarterEps.stocks) ||\n      quarterEps.count!==Object.keys(quarterEps.stocks).length))\n    throw new Error(\"SHADOW_EPS_GLOBAL_SOURCE_NOT_VERIFIED__NOT_ZERO_PICK\");\n  const selectorEnv = { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData };\n  if(epsQuarantineDryRun) selectorEnv.__S1_EPS_QUARANTINE_DRYRUN_ONLY=quarterEps;\n  const scan = selectTomorrowCandidates(marketState, rows, selectorEnv, marketDate);\n"
  ],
  [
    "  diagnostics.epsReviewUniverse=scored.map(item=>({symbol:item.symbol,name:item.name}));\n\n",
    "  diagnostics.epsReviewUniverse=scored.map(item=>({symbol:item.symbol,name:item.name}));\n  const shadowEpsSnapshot=env.__S1_EPS_QUARANTINE_DRYRUN_ONLY || null;\n  const epsShadowEligible=item=>system1ShadowEpsCandidateStatus(item,shadowEpsSnapshot).allowed;\n\n"
  ],
  [
    "  const thousandTop = thousandScored.slice(0, MAX_STOCKS_PER_POOL);\n\n",
    "  const thousandTop = (shadowEpsSnapshot ? thousandScored.filter(epsShadowEligible) : thousandScored).slice(0, MAX_STOCKS_PER_POOL);\n\n"
  ],
  [
    "  const generalTop = scored\n    .filter(item => (toNumber(item.close) || 0) < THOUSAND_STOCK_PRICE)\n    .slice(0, MAX_STOCKS_PER_POOL);\n",
    "  const generalTop = (shadowEpsSnapshot ? scored.filter(epsShadowEligible) : scored)\n    .filter(item => (toNumber(item.close) || 0) < THOUSAND_STOCK_PRICE)\n    .slice(0, MAX_STOCKS_PER_POOL);\n"
  ],
  [
    "  const totalCapital = positiveNumber(env.V7_TOTAL_CAPITAL) || DEFAULT_TOTAL_CAPITAL;\n  return {\n    candidates: allocateAndBuildPlans(selected, totalCapital, scanDate),\n",
    "  if(shadowEpsSnapshot) {\n    const scoredUnique=[...new Map([...scored,...thousandScored].map(item=>[item.symbol,item])).values()];\n    const quarantined=scoredUnique.filter(item=>!epsShadowEligible(item));\n    diagnostics.epsQuarantineShadow={\n      previewOnly:true,productionActivated:false,canTrade:false,\n      sourceMarketDate:shadowEpsSnapshot.asOfDate,\n      originalCandidateCount:scoredUnique.length,\n      quarantinedSymbols:quarantined.map(item=>item.symbol),\n      survivingCandidates:scoredUnique.length-quarantined.length,\n      selectedSymbols:selected.map(item=>item.symbol),\n      allCandidatesQuarantined:scoredUnique.length>0&&quarantined.length===scoredUnique.length,\n      zeroPicksCertified:false,\n      officialSourcePITCertified:false\n    };\n  }\n  const totalCapital = positiveNumber(env.V7_TOTAL_CAPITAL) || DEFAULT_TOTAL_CAPITAL;\n  return {\n    candidates: allocateAndBuildPlans(selected, totalCapital, scanDate),\n"
  ]
];
const gitBlobHash=s=>createHash("sha1").update("blob "+Buffer.byteLength(s)+"\0"+s).digest("hex");
const sha256=s=>createHash("sha256").update(s).digest("hex");
const original=await readFile(SOURCE,"utf8");
if(gitBlobHash(original)!==ORIGINAL_GIT_BLOB)throw Error("SOURCE_MAIN_BLOB_CHANGED");
let result=original;
for(const [i,[before,after]] of PATCHES.entries()){
 if(result.split(before).length!==2)throw Error("REVIEW_ONLY_PATCH_ANCHOR_"+i+"_NOT_UNIQUE");
 result=result.replace(before,after);
}
if(gitBlobHash(result)!==CANDIDATE_GIT_BLOB)throw Error("REVIEW_ONLY_RECONSTRUCTION_NOT_BYTE_EXACT");
await mkdir("artifacts/reviewonly",{recursive:true});
await writeFile(OUTPUT,result,"utf8");
console.log(JSON.stringify({schema:"S1_DRYRUN_WORKER_REVIEWONLY_V0_1",sourceSha256:sha256(original),candidateSha256:sha256(result),output:OUTPUT,originalMainUnchanged:true,productionActivated:false,canTrade:false}));
