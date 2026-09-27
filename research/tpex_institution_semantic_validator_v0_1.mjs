function n(v){
  if(v===null||v===undefined||v==="") return null;
  const x=Number(String(v).replaceAll(",",""));
  return Number.isFinite(x)?x:null;
}
const EXPECTED_FIELDS=[
  "代號","名稱",
  "買進股數","賣出股數","買賣超股數",
  "買進股數","賣出股數","買賣超股數",
  "買進股數","賣出股數","買賣超股數",
  "買進股數","賣出股數","買賣超股數",
  "買進股數","賣出股數","買賣超股數",
  "買進股數","賣出股數","買賣超股數",
  "買進股數","賣出股數","買賣超股數",
  "三大法人買賣超股數合計"
];

function sameFields(fields){
  return Array.isArray(fields)&&fields.length===EXPECTED_FIELDS.length&&
    fields.every((v,i)=>String(v)===EXPECTED_FIELDS[i]);
}
function eq(a,b){return a!==null&&b!==null&&Math.abs(a-b)<1e-9;}

export function validateTpexInstitutionSemanticFixture(payload={}){
  const table=Array.isArray(payload?.tables)?payload.tables[0]:null;
  const failures=[];
  if(String(payload?.stat||"").toLowerCase()!=="ok") failures.push({type:"STATUS",reason:"STAT_NOT_OK"});
  if(!table||!Array.isArray(table.data)) failures.push({type:"SHAPE",reason:"TABLE_DATA_MISSING"});
  if(!sameFields(table?.fields)) failures.push({type:"FIELDS",reason:"EXACT_GENERIC_FIELD_VECTOR_MISMATCH"});
  const rows=Array.isArray(table?.data)?table.data:[];
  let checkedRows=0;
  const mismatchCounts={
    groupNet:[0,0,0,0,0,0,0],
    foreignAggregateBuy:0,foreignAggregateSell:0,foreignAggregateNet:0,
    dealerAggregateBuy:0,dealerAggregateSell:0,dealerAggregateNet:0,
    officialTotal:0,currentParserTotal:0
  };
  let foreignDealerNonzeroRows=0;
  const samples=[];
  for(const row of rows){
    if(!Array.isArray(row)||row.length<24) {failures.push({type:"ROW_SHAPE",reason:"ROW_LT_24"});continue;}
    const code=String(row[0]||"").replaceAll("=","").replaceAll('"',"").trim();
    if(!/^[1-9][0-9]{3}$/.test(code)) continue;
    const vals=row.map(n);
    if([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].some(i=>vals[i]===null)){
      failures.push({type:"NUMERIC",reason:"NON_NUMERIC_SEMANTIC_COLUMN",symbol:code});
      continue;
    }
    checkedRows+=1;
    for(let g=0;g<7;g++){
      const s=2+g*3;
      if(!eq(vals[s]-vals[s+1],vals[s+2])) mismatchCounts.groupNet[g]+=1;
    }
    if(vals[5]!==0||vals[6]!==0||vals[7]!==0) foreignDealerNonzeroRows+=1;
    if(!eq(vals[2]+vals[5],vals[8])) mismatchCounts.foreignAggregateBuy+=1;
    if(!eq(vals[3]+vals[6],vals[9])) mismatchCounts.foreignAggregateSell+=1;
    if(!eq(vals[4]+vals[7],vals[10])) mismatchCounts.foreignAggregateNet+=1;
    if(!eq(vals[14]+vals[17],vals[20])) mismatchCounts.dealerAggregateBuy+=1;
    if(!eq(vals[15]+vals[18],vals[21])) mismatchCounts.dealerAggregateSell+=1;
    if(!eq(vals[16]+vals[19],vals[22])) mismatchCounts.dealerAggregateNet+=1;
    if(!eq(vals[4]+vals[13]+vals[22],vals[23])) mismatchCounts.officialTotal+=1;
    if(!eq(vals[10]+vals[13]+vals[22],vals[23])) mismatchCounts.currentParserTotal+=1;
    if(samples.length<10 && (
      mismatchCounts.groupNet.some(Boolean)||mismatchCounts.foreignAggregateBuy||
      mismatchCounts.foreignAggregateSell||mismatchCounts.foreignAggregateNet||
      mismatchCounts.dealerAggregateBuy||mismatchCounts.dealerAggregateSell||
      mismatchCounts.dealerAggregateNet||mismatchCounts.officialTotal
    )) samples.push({symbol:code});
  }
  const semanticMismatchCount=
    mismatchCounts.groupNet.reduce((a,b)=>a+b,0)+
    mismatchCounts.foreignAggregateBuy+mismatchCounts.foreignAggregateSell+mismatchCounts.foreignAggregateNet+
    mismatchCounts.dealerAggregateBuy+mismatchCounts.dealerAggregateSell+mismatchCounts.dealerAggregateNet+
    mismatchCounts.officialTotal;
  const state=failures.length?"INVALID_INPUT":
    semanticMismatchCount>0?"SEMANTIC_SCHEMA_MISMATCH":"SEMANTIC_SCHEMA_PASS";
  return {
    schemaVersion:"tpex-institution-semantic-validator-v0.1",
    state,checkedRows,foreignDealerNonzeroRows,mismatchCounts,samples,
    fieldVectorIsGenericRepeatedTriplets:sameFields(table?.fields),
    currentParserAssumption:{
      foreignNetIndex:10,
      currentParserTotalMismatchRows:mismatchCounts.currentParserTotal,
      officialTotalUsesForeignMainIndex4:true,
      dormantIfForeignDealerAlwaysZero:foreignDealerNonzeroRows===0
    },
    guards:{
      exactFieldStringsAloneInsufficient:true,
      arithmeticFingerprintRequired:true,
      noRuntimeIntegration:true,
      formalCoreChanged:false
    }
  };
}

export {EXPECTED_FIELDS};
