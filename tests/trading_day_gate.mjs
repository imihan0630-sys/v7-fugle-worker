import {readFile,appendFile} from 'node:fs/promises';
const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const api=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {loadTradingCalendar,isTradingDate};').toString('base64'));
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
await api.loadTradingCalendar({},Number(date.slice(0,4)));
const proceed=api.isTradingDate(date);
if(process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT,`proceed=${proceed}\n`);
console.log(JSON.stringify({date,tradingDay:proceed,noSelection:true,noPush:true}));
