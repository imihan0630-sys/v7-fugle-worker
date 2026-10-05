export const VERSION = '0.1.0';
export const SOURCE_URL = 'https://service.moea.gov.tw/EE520/investigate/InvestigateDA.aspx';
export const SOURCE_INDEX_URL = 'https://www.moea.gov.tw/MNS/dos/content/Content.aspx?menu_id=6819';
export const TABLE_ID = 'ContentPlaceHolder1_tabResult';
export const PRODUCTS = Object.freeze([
  { code: '2433-020', sourceCode: '2433020', name: '銅箔', unit: '公噸' },
  { code: '2630-010', sourceCode: '2630010', name: '銅箔基板', unit: '平方呎' },
  { code: '2630-040', sourceCode: '2630040', name: '印刷電路板(不含IC載板)', unit: '平方呎' },
]);
export const METRICS = ['生產量', '存貨量'];
export const labelFor = p => `(${p.sourceCode})${p.name}`;
export function invariant(condition, message) {
  if (!condition) throw new Error(`SC056_DRIFT: ${message}`);
}
export function rocMonth(month) {
  invariant(typeof month === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(month), 'expected YYYY-MM month');
  const year = Number(month.slice(0, 4)) - 1911;
  invariant(year >= 71 && year <= 999, 'month outside supported ROC calendar');
  return `${String(year).padStart(3, '0')}${month.slice(5)}`;
}
export function taipeiTime(date = new Date()) {
  return new Date(date.getTime() + 8 * 3600000).toISOString().replace('Z', '+08:00');
}
