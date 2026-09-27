import assert from "node:assert/strict";
import { parseS38Line, parseS38Artifact, S38_PREFIX_LENGTH } from "../research/tpex_s38_denominator_parser_prototype.mjs";

const pad=(value,width)=>String(value).padStart(width,"0");
const text=(value,width)=>String(value).padEnd(width," ").slice(0,width);

function syntheticLine({symbol="5314",name="世紀民生",volume=123456,count=789,value=987654321,issued=123456789,marketCap=4567890123,industry="20"}={}) {
  const f=[];
  f.push(text(symbol,6));
  f.push(text(name,16));
  for (let i=0;i<4;i+=1) f.push(pad(100000+i,9));
  f.push("+");
  for (let i=0;i<9;i+=1) f.push(pad(1000+i,9));
  f.push(pad(volume,12));
  f.push(pad(count,8));
  f.push(pad(value,12));
  f.push(pad(issued,13));
  f.push(pad(marketCap,14));
  f.push(text(industry,2));
  return f.join("");
}

// Official S38 prefix width through industry code is deterministic.
{
  const line=syntheticLine();
  assert.equal(line.length,S38_PREFIX_LENGTH);
  assert.equal(S38_PREFIX_LENGTH,201);
}

// Unit contract: trade volume and issued-share fields are already shares; no x1000.
{
  const line=syntheticLine({volume:123456,issued:123456789});
  const row=parseS38Line(line);
  assert.equal(row.symbol,"5314");
  assert.equal(row.tradeVolumeShares,123456);
  assert.equal(row.issuedShares,123456789);
  assert.equal(row.normalizedUnit,"SHARES");
  assert.equal(row.denominatorType,"TPEX_DAILY_ISSUED_SHARES");
}

// Additional trailing fields in a later S38 format do not shift the frozen official prefix.
{
  const base=syntheticLine({symbol:"1258",issued:36399459});
  const row=parseS38Line(base+"TRAILING-FIELDS-V1.33");
  assert.equal(row.symbol,"1258");
  assert.equal(row.issuedShares,36399459);
  assert.equal(row.parsedPrefixLength,201);
}

// Multi-row artifact keeps one denominator row per symbol.
{
  const out=parseS38Artifact([
    syntheticLine({symbol:"1258",issued:36399459}),
    syntheticLine({symbol:"5314",issued:123456789})
  ].join("\r\n"));
  assert.equal(out.recordCount,2);
  assert.deepEqual(out.rows.map(x=>x.symbol),["1258","5314"]);
}

// Malformed and nonnumeric issued-share data fail closed.
{
  assert.throws(()=>parseS38Line("too short"),/S38_LINE_TOO_SHORT/);
  const line=syntheticLine();
  const issuedStart=172;
  const bad=line.slice(0,issuedStart)+"XXXXXXXXXXXXX"+line.slice(issuedStart+13);
  assert.throws(()=>parseS38Line(bad),/S38_ISSUED_SHARES_NON_NUMERIC/);
}

// Duplicate symbols in one artifact are ambiguous and rejected.
{
  const line=syntheticLine({symbol:"5314"});
  assert.throws(()=>parseS38Artifact(line+"\n"+line),/S38_DUPLICATE_SYMBOL:5314/);
}

console.log("TPEx S38 denominator parser tests passed");
