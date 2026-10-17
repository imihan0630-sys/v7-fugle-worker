// Operator/Data handoff CLI ONLY: never fetches native market data itself.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildSystem2NativeB5CoverageV0_1} from '../runtime/industry_native_b5_coverage_v0_1.mjs';
const [universeFile,twseFile,tpexFile,outputDirectory]=process.argv.slice(2);
if(process.argv.length!==6||!universeFile||!twseFile||!tpexFile||!outputDirectory)
 throw Error('USAGE: node run_industry_native_b5_coverage_readonly_v0_1.mjs <signed-a1-universe.json> <native-twse-b5.json or -> <native-tpex-b5.json or -> <output-dir>');
const parse=async file=>JSON.parse(await readFile(file,'utf8'));
const universeReceipt=await parse(universeFile),profileReceipts=[];
for(const file of [twseFile,tpexFile])if(file!=='-')profileReceipts.push(await parse(file));
const r=await buildSystem2NativeB5CoverageV0_1({universeReceipt,profileReceipts,generatedAtUtc:new Date().toISOString()});
await mkdir(resolve(outputDirectory),{recursive:true});
await writeFile(resolve(outputDirectory,'industry-official-b5-provisional-coverage.json'),JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
const lines=['# System 2｜'+r.marketDate+' 官方 B5 產業分類來源覆蓋（暫行，待獨立驗證）','',
 '**資料聲明：** 本檔只反映 DATA 提供的具名原始收據之字串／日期防偽及交集；還不是稽核通過的全市場官方 B5 PIT／普通股產業對照。',
 '**市場四碼證券來源母體：** '+r.fourDigitInstrumentCount+'（非獨立確認普通股母體）',
 '**獨立 B5 完整母體覆蓋率：** UNKNOWN','',
 '| 市場 | 四碼證券母體 | 暫行可歸類 | UNKNOWN | 衝突 | 來源缺席 | 已獨立 PIT 驗證 |',
 '|---|---:|---:|---:|---:|---|---|'];
for(const x of r.marketSummaries)
 lines.push('| '+x.market+' | '+x.sourceFourDigitInstrumentCount+' | '+x.provisionalClassifiedCount+
 ' | '+x.unknownCount+' | '+x.conflictCount+' | '+(!x.officialProfileSourcePresent?'YES':'NO')+' | NO |');
lines.push('','**尚待交接：** DATA 原始 B5 / 歷史分類證據 + AUDIT 独立原始檔與時點驗證。',
 '**正式 selectedCount/zeroPickDay：** UNKNOWN／UNKNOWN，非 0 檔。',
 '**來源暨結果 Hash：** '+r.originalUniverseReceiptHash+' / '+r.receiptHash,
 '**策略分數／Frozen／正式交易／System 1：** 全部沒有修改。','');
await writeFile(resolve(outputDirectory,'industry-official-b5-provisional-coverage.md'),lines.join('\n'),{flag:'wx',mode:0o600});
console.log(JSON.stringify({marketDate:r.marketDate,sourceSecurities:r.fourDigitInstrumentCount,profiles:r.profileReceiptsCount,sourceJoinState:r.sourceJoinState,receiptHash:r.receiptHash,independentB5Certified:false}));
