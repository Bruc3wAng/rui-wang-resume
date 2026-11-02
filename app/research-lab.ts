export type Check = { key: string; aligned: boolean; zh: string; en: string; actionZh: string; actionEn: string };
const criteria = [
  ["method", "分析方法", "Analysis method", "用同一方法重算，再比较结果与排序。", "Recalculate with the same method before comparing results and rankings."],
  ["audience", "目标人群", "Target audience", "限定共同目标人群，并说明样本范围的变化。", "Restrict the comparison to a common audience and explain sample-scope changes."],
  ["measure", "指标定义", "Measure definition", "先统一指标定义；无法统一时分开报告。", "Align measure definitions first; report separately if they cannot be reconciled."],
];
export function compareConditions(values: boolean[]): Check[] {
  return criteria.map(([key,zh,en,actionZh,actionEn],i)=>({key,zh,en,actionZh,actionEn,aligned:values[i]===true}));
}
const impacts = [
  [{zh:"数据期次",en:"Data waves"},{zh:"趋势图",en:"Trend charts"},{zh:"跨期比较",en:"Wave comparisons"}],
  [{zh:"指标定义",en:"Measure definitions"},{zh:"历史可比性",en:"Historical comparability"},{zh:"报告注释",en:"Report notes"}],
  [{zh:"图表字段",en:"Chart fields"},{zh:"页面布局",en:"Page layout"},{zh:"未变内容保留",en:"Unchanged content"}],
];
export function planUpdates(values: boolean[]) { return impacts.flatMap((items,i)=>values[i]?items:[]); }
export const libraryExamples = [
  {category:"health",zh:"健康产品",en:"Health products",topicZh:"规格与组合",topicEn:"Formats & bundles",sourceZh:"商品资料",sourceEn:"Product material"},
  {category:"health",zh:"健康产品",en:"Health products",topicZh:"价格带定义",topicEn:"Price-band definitions",sourceZh:"指标记录",sourceEn:"Measure record"},
  {category:"pet",zh:"宠物食品",en:"Pet food",topicZh:"品类与单品",topicEn:"Categories & products",sourceZh:"商品资料",sourceEn:"Product material"},
  {category:"pet",zh:"宠物食品",en:"Pet food",topicZh:"来源与时间",topicEn:"Source & collection date",sourceZh:"来源记录",sourceEn:"Source record"},
];
export function queryLibrary(category: string) { return libraryExamples.filter(row=>category==="all"||row.category===category); }
