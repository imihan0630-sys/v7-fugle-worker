const base=process.env.V7_BASE_URL||'https://fugle-test.imihan0630.workers.dev';
const token=process.env.V7_ADMIN_TOKEN;
if(!token) throw new Error('Missing V7_ADMIN_TOKEN');

const stocks=[
  {
    formalClose:47.7,closeDate:'2026-09-17',planDate:'2026-09-18',enabled:true,
    symbol:'4763',name:'材料*-KY',mode:'PULLBACK',buyLow:47.16,buyHigh:48.25,breakout:null,maxChase:null,
    stop:46.45,profitCheck:51,sourceRank:1,channel:'A',signalLevel:'B',
    priorityScore:60.5,rewardRisk:2.62,sectorFlow:47.7,relativeStrength:-5.7,
    allocationRatio:31.2,totalAllocation:62000,firstAmount:37200,secondAmount:24800,
    firstShares:770,secondShares:513,totalShares:1283,
    firstCondition:'A拉回承接：價格進入支撐承接區後，完整15分K量縮止跌、不再破低，下一根轉強才第一筆',
    secondCondition:'第一筆後支撐仍守住，重新量縮止跌並由15分K再次轉強才加碼',
    selectedReason:'V7.5.30 9/17正式scan-preview入選；策略品質66.2；產業資金47.7；法人78；RR2.62；市場共識未達2來源不加分；不代表開盤直接買',
    positionStage:'NONE',averageCost:null,actualShares:null,firstEntryConfirmedAt:null,reduceAt:51,sellBelow:null,pushEnabled:true
  },
  {
    formalClose:64.6,closeDate:'2026-09-17',planDate:'2026-09-18',enabled:true,
    symbol:'1301',name:'台塑',mode:'PULLBACK',buyLow:63.88,buyHigh:65.36,breakout:null,maxChase:null,
    stop:62.92,profitCheck:68.6,sourceRank:2,channel:'A',signalLevel:'B',
    priorityScore:55.9,rewardRisk:2.34,sectorFlow:54.8,relativeStrength:8.4,
    allocationRatio:28.8,totalAllocation:57000,firstAmount:34200,secondAmount:22800,
    firstShares:523,secondShares:348,totalShares:871,
    firstCondition:'A拉回承接：價格進入支撐承接區後，完整15分K量縮止跌、不再破低，下一根轉強才第一筆',
    secondCondition:'第一筆後支撐仍守住，重新量縮止跌並由15分K再次轉強才加碼',
    selectedReason:'V7.5.30 9/17正式scan-preview入選；策略品質65.3；產業資金54.8；RS8.4；法人36.8；RR2.34；市場共識未達2來源不加分；不代表開盤直接買',
    positionStage:'NONE',averageCost:null,actualShares:null,firstEntryConfirmedAt:null,reduceAt:68.6,sellBelow:null,pushEnabled:true
  },
  {
    formalClose:1485,closeDate:'2026-09-17',planDate:'2026-09-18',enabled:true,
    symbol:'3491',name:'昇達科',mode:'MOMENTUM',buyLow:1490,buyHigh:1515,breakout:1510,maxChase:1550,
    stop:1440,profitCheck:1570,sourceRank:3,channel:'B',signalLevel:'A',
    priorityScore:78,rewardRisk:1.8,sectorFlow:0,relativeStrength:0,
    allocationRatio:17.5,totalAllocation:35000,firstAmount:21000,secondAmount:14000,
    firstShares:13,secondShares:9,totalShares:22,
    firstCondition:'B突破後承接：先確認有效站上1510；不追第一段，等待回測1490～1515守住，完整15分K量縮不破低，下一根轉強才第一筆',
    secondCondition:'第一筆後1510附近突破區持續守住，第二次回測不破或再次轉強，完整15分K確認後才加碼',
    selectedReason:'V7.5.30新版千元股池第一順位；9/17收1485；仍需1510突破後回踩確認，不代表開盤直接買',
    positionStage:'NONE',averageCost:null,actualShares:null,firstEntryConfirmedAt:null,reduceAt:1570,sellBelow:1440,pushEnabled:true
  },
  {
    formalClose:2010,closeDate:'2026-09-17',planDate:'2026-09-18',enabled:true,
    symbol:'3665',name:'貿聯-KY',mode:'MOMENTUM',buyLow:2030,buyHigh:2065,breakout:2055,maxChase:2100,
    stop:1960,profitCheck:2120,sourceRank:4,channel:'B',signalLevel:'A',
    priorityScore:82,rewardRisk:1.9,sectorFlow:0,relativeStrength:0,
    allocationRatio:20,totalAllocation:40000,firstAmount:24000,secondAmount:16000,
    firstShares:11,secondShares:7,totalShares:18,
    firstCondition:'B突破後承接：先確認站上2055～2085壓力區；不追第一段，等待回測2030～2065守住，完整15分K量縮不破低，下一根轉強才第一筆',
    secondCondition:'第一筆後突破區持續守住，第二次回測不破或再次轉強，完整15分K確認後才加碼',
    selectedReason:'V7.5.30新版千元股池第二順位；9/17收2010；等待突破後回踩確認，不代表開盤直接買',
    positionStage:'NONE',averageCost:null,actualShares:null,firstEntryConfirmedAt:null,reduceAt:2120,sellBelow:1960,pushEnabled:true
  },
  {
    formalClose:3185,closeDate:'2026-09-17',planDate:'2026-09-18',enabled:true,
    symbol:'3017',name:'奇鋐',mode:'MOMENTUM',buyLow:3230,buyHigh:3285,breakout:3285,maxChase:3350,
    stop:3170,profitCheck:3500,sourceRank:5,channel:'B',signalLevel:'B',
    priorityScore:0,rewardRisk:1.87,sectorFlow:0,relativeStrength:0,
    allocationRatio:17.5,totalAllocation:35000,firstAmount:21000,secondAmount:14000,
    firstShares:6,secondShares:4,totalShares:10,
    firstCondition:'B轉強確認：先站回3230，再有效突破3285；不追第一段，等待回測3230～3285守住，完整15分K不再破低且下一根轉強才第一筆',
    secondCondition:'第一筆後3285突破區持續守住，第二次回測不破或再次轉強，完整15分K確認後才加碼',
    selectedReason:'V7.5.30市場共識雷達3個獨立正向來源、共識65、+4；AI散熱主流，但只等轉強確認；priorityScore未人工編造',
    positionStage:'NONE',averageCost:null,actualShares:null,firstEntryConfirmedAt:null,reduceAt:3500,sellBelow:3170,pushEnabled:true
  }
];

const res=await fetch(base+'/api/config',{method:'POST',headers:{'x-admin-token':token,'content-type':'application/json'},body:JSON.stringify({stocks})});
const txt=await res.text();
if(!res.ok) throw new Error('config '+res.status+': '+txt);
const data=JSON.parse(txt);
if(Number(data.count)!==5 || data.verified!==true) throw new Error('config write not verified: '+txt);

const verify=await fetch(base+'/?format=json',{cache:'no-store'});
const page=JSON.parse(await verify.text());
const planned=Array.isArray(page.plannedStocks)?page.plannedStocks:[];
const got=planned.map(x=>String(x.symbol)).sort();
const expected=['4763','1301','3491','3665','3017'].sort();
if(JSON.stringify(got)!==JSON.stringify(expected)) throw new Error('plannedStocks mismatch '+JSON.stringify(planned));
const general=planned.filter(x=>Number(x.formalClose)<1000).map(x=>x.symbol).sort();
const thousand=planned.filter(x=>Number(x.formalClose)>=1000).map(x=>x.symbol).sort();
if(JSON.stringify(general)!==JSON.stringify(['1301','4763']) || JSON.stringify(thousand)!==JSON.stringify(['3017','3491','3665'])) throw new Error('pool split mismatch');
if(planned.some(x=>x.planDate!=='2026-09-18')) throw new Error('stale plan remains');
console.log(JSON.stringify({ok:true,count:data.count,general,thousand,plannedStocks:planned},null,2));
