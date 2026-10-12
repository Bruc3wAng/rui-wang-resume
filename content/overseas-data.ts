import data from "./overseas-public.json";
export const atlas = data;
export type Observation = typeof data.observations[number];
export type Metric = typeof data.metrics[number];
export const atlasYears = [...new Set(data.observations.map(r=>r.year))].filter(y=>data.observations.some(r=>r.year===y&&r.quality==="published"&&r.value!==null)).sort((a,b)=>b-a);
export const availableValue = (row?: Observation) => row?.quality === "published" && row.value !== null && Number.isFinite(row.value) ? row.value : null;
export function atlasObservation(country: string, metric: string, year: number) { return data.observations.find(r=>r.country===country&&r.metric===metric&&r.year===year); }
export function comparisonRows(metric: string, year: number) { return data.countries.map(c=>({ ...c, observation:atlasObservation(c.iso3,metric,year)})).sort((a,b)=>{const x=availableValue(a.observation),y=availableValue(b.observation);return x===null?y===null?0:1:y===null?-1:y-x;}); }
export function formatAtlas(value:number|null, metric:Metric, locale:string) { return value===null?(locale==="zh"?"暂无数据":"No data"):value.toLocaleString(locale==="zh"?"zh-CN":"en-US",{maximumFractionDigits:metric.format==="count"||metric.format==="money"?0:2}); }
export function atlasCsv(metric:Metric,year:number) {
 const rows:unknown[][]=[["Country","ISO3","Indicator","Code","Year","Value","Unit","Status","Definition","Original provider","Source URL","Collected at","License","License terms"]];
 for(const r of comparisonRows(metric.id,year))rows.push([r.english,r.iso3,metric.originalName,metric.id,year,availableValue(r.observation),metric.unit,r.observation?.quality??"missing",metric.definition,metric.originalSource,r.observation?.sourceUrl??metric.url,data.collectedAt,metric.license,data.termsUrl]);
 const esc=(v:unknown)=>'"'+(typeof v==="string"&&/^[=+@\-]/.test(v)?"'"+v:String(v??"")).replaceAll('"','""')+'"';
 return '\uFEFF'+rows.map(r=>r.map(esc).join(',')).join('\r\n');
}
