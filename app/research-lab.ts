export type Check = { key: string; aligned: boolean; zh: string; en: string; actionZh: string; actionEn: string };
const criteria = [
  ["method", "分析方法", "Analysis method", "用同一方法重算，再比较结果与排序。", "Recalculate with the same method before comparing results and rankings."],
  ["audience", "目标人群定义", "Target-audience definition", "限定共同目标人群，并说明样本范围的变化。", "Restrict the comparison to a common audience and explain sample-scope changes."],
  ["measure", "指标定义", "Measure definition", "先统一指标定义；无法统一时分开报告。", "Align measure definitions first; report separately if they cannot be reconciled."],
];
export function compareConditions(values: boolean[]): Check[] {
  return criteria.map(([key,zh,en,actionZh,actionEn],i)=>({key,zh,en,actionZh,actionEn,aligned:values[i]===true}));
}
type ResearchLanguage = "zh" | "en";
type Bilingual = { zh: string; en: string };
export type MixReference = 0 | 1;
type WaveCount = { satisfied: number; total: number };

// Constructed counts only. Each wave uses the same group and satisfaction
// definitions, but the share of frequent users differs between waves.
const mixExample: readonly { id: string; label: Bilingual; waves: readonly [WaveCount, WaveCount] }[] = [
  { id: "frequent", label: { zh: "高频用户", en: "Frequent users" }, waves: [{ satisfied: 70, total: 100 }, { satisfied: 130, total: 200 }] },
  { id: "occasional", label: { zh: "低频用户", en: "Occasional users" }, waves: [{ satisfied: 40, total: 100 }, { satisfied: 19, total: 50 }] },
];

export function calculateAudienceMix(reference: MixReference) {
  if (reference !== 0 && reference !== 1) throw new RangeError("Unknown reference wave");
  const totals = (wave: MixReference) => mixExample.reduce((sum, group) => ({
    satisfied: sum.satisfied + group.waves[wave].satisfied,
    total: sum.total + group.waves[wave].total,
  }), { satisfied: 0, total: 0 });
  const referenceTotal = totals(reference).total;
  const groups = mixExample.map(group => ({
    id: group.id, label: { ...group.label }, weight: group.waves[reference].total / referenceTotal,
    waves: [{ ...group.waves[0] }, { ...group.waves[1] }] as const,
  }));
  const summarize = (wave: MixReference) => {
    const count = totals(wave);
    return { ...count, observed: count.satisfied / count.total, adjusted: groups.reduce((sum, group) => {
      const row = group.waves[wave];
      return sum + group.weight * (row.satisfied / row.total);
    }, 0) };
  };
  const waves = [summarize(0), summarize(1)] as const;
  return { reference, groups, waves, change: { observed: waves[1].observed - waves[0].observed, adjusted: waves[1].adjusted - waves[0].adjusted } };
}

export type AudienceMixComparison = ReturnType<typeof calculateAudienceMix>;
export function comparableAudienceMix(values: boolean[], reference: MixReference) {
  return compareConditions(values).every(item => item.aligned) ? calculateAudienceMix(reference) : null;
}
export function mixRate(rate: number) { return `${(rate * 100).toFixed(1)}%`; }
export function mixDeltaValue(change: number) {
  const points = change * 100;
  const magnitude = Math.abs(points).toFixed(1);
  const sign = Number(magnitude) === 0 ? "" : points < 0 ? "−" : "+";
  return `${sign}${magnitude}`;
}
export function mixDelta(change: number, language: ResearchLanguage) {
  return `${mixDeltaValue(change)}${language === "zh" ? " 个百分点" : " pp"}`;
}
export function mixReferenceLabel(reference: MixReference, language: ResearchLanguage) {
  return language === "zh" ? `第 ${reference + 1} 期构成` : `Wave ${reference + 1} mix`;
}
export function audienceMixHeadline(comparison: AudienceMixComparison, language: ResearchLanguage) {
  if (comparison.change.observed > 0 && comparison.change.adjusted < 0) {
    return language === "zh" ? "总体满意度上升，同构成复算后下降" : "Overall satisfaction rose. At the same mix, it fell.";
  }
  return language === "zh" ? "对照总体结果与同构成结果" : "Compare observed and same-mix satisfaction";
}
export function audienceMixFormula(comparison: AudienceMixComparison, wave: MixReference) {
  return comparison.groups.map(group => {
    const row = group.waves[wave];
    return `${mixRate(row.satisfied / row.total)} × ${mixRate(group.weight)}`;
  }).join(" + ") + ` = ${mixRate(comparison.waves[wave].adjusted)}`;
}
export function audienceMixLabels(language: ResearchLanguage) {
  return language === "zh" ? { observed: "按实际构成", adjusted: "统一人群构成", wave: ["第 1 期", "第 2 期"] } : { observed: "As observed", adjusted: "Same mix", wave: ["Wave 1", "Wave 2"] };
}
export function audienceMixNote(comparison: AudienceMixComparison, language: ResearchLanguage) {
  const [first, second] = comparison.waves.map((wave, i) => mixRate(comparison.groups[0].waves[i].total / wave.total));
  return language === "zh" ? `第 2 期高频用户占 ${second}，第 1 期占 ${first}。统一构成只用于比较，不是实际总体结果。`
    : `Frequent users made up ${second} of Wave 2, versus ${first} of Wave 1. Same-mix rates are for comparison, not observed totals.`;
}

export type UpdatePlanItem = Bilingual & { id: string; action: Bilingual };
type UpdateRule = UpdatePlanItem & { when: number[] };
const updateRules: UpdateRule[] = [
  {id:"wave-data",zh:"新增期次数据",en:"New-wave data",when:[0],action:{zh:"接入新增期次，并保留原有有效数据。",en:"Add the new wave while retaining valid existing data."}},
  {id:"metric-map",zh:"指标字段与映射",en:"Measure fields and mappings",when:[1],action:{zh:"按确认的指标定义更新字段与映射。",en:"Update fields and mappings to the confirmed measure definitions."}},
  {id:"charts",zh:"受影响图表与趋势",en:"Affected charts and trends",when:[0,1,2],action:{zh:"只更新受影响图表及对应趋势区间。",en:"Update only affected charts and their relevant trend periods."}},
  {id:"copy",zh:"对应文字与指标说明",en:"Related copy and measure notes",when:[0,1],action:{zh:"同步图表涉及的文字与指标说明。",en:"Align the related text and measure notes with the charts."}},
  {id:"layout",zh:"图表字段位置与版式",en:"Chart-field placement and layout",when:[2],action:{zh:"按确认模板调整字段位置和版式。",en:"Adjust field placement and layout to the confirmed template."}},
];
const reviewRules: UpdateRule[] = [
  {id:"comparability",zh:"跨期比较条件",en:"Wave-comparison criteria",when:[0,1],action:{zh:"确认目标人群、指标定义与跨期条件，必要时重算或分开说明。",en:"Check audiences, definitions, and wave criteria; recalculate or report separately where needed."}},
  {id:"source-mapping",zh:"数据、图表与文字映射",en:"Data, chart, and text mapping",when:[0,1,2],action:{zh:"核对数据、图表和文字是否指向同一期次及指标。",en:"Check that data, charts, and text refer to the same wave and measure."}},
  {id:"presentation",zh:"交付内容一致性",en:"Delivery consistency",when:[0,1,2],action:{zh:"检查数值、标题、图例及文字是否与更新范围一致。",en:"Check values, titles, legends, and text against the update scope."}},
];
const retentionRules: UpdatePlanItem[] = [
  {id:"valid-history",zh:"仍有效的历史结果",en:"Valid historical results",action:{zh:"保留仍符合当前定义与比较条件的历史结果。",en:"Retain historical results that remain valid under the current definitions and comparison criteria."}},
  {id:"unaffected-content",zh:"未受影响的有效内容",en:"Valid, unaffected content",action:{zh:"不因批量更新而改写未受影响的有效内容。",en:"Do not overwrite valid, unaffected content during batch updates."}},
];
function selectedRules(rules: UpdateRule[], values: boolean[]): UpdatePlanItem[] {
  return rules.filter(rule=>rule.when.some(index=>values[index]===true))
    .map(rule=>({id:rule.id,zh:rule.zh,en:rule.en,action:{...rule.action}}));
}
export function planTrackingUpdate(values: boolean[]) {
  return {updates:selectedRules(updateRules,values),reviews:selectedRules(reviewRules,values),preserve:retentionRules.map(item=>({...item,action:{...item.action}}))};
}
export function planUpdates(values: boolean[]) { return planTrackingUpdate(values).updates; }
export function trackingImpactForChange(values: boolean[], change: number) {
  if (!Number.isInteger(change) || change < 0 || change > 2 || values[change] !== true) return null;
  const {updates, reviews} = planTrackingUpdate([0,1,2].map(index=>index===change));
  return {updates, reviews};
}

type UsageDefinition = "usage-30d" | "usage-7d";
type ReportPoint = { wave: 1 | 2 | 3; definition: UsageDefinition; rate: number };
type ReportFormat = "line" | "bars";
export type TrackingReportSnapshot = {
  format: ReportFormat;
  trendDefinition: UsageDefinition;
  trend: readonly ReportPoint[];
} & (
  | { separate: ReportPoint; missingDefinition: null; change: null }
  | { separate: null; missingDefinition: UsageDefinition; change: null }
  | { separate: null; missingDefinition: null; change: number }
);
export type TrackingReport = { before: TrackingReportSnapshot; after: TrackingReportSnapshot };

// Constructed example data: a revised observation cannot extend the old series.
const sampleUsageHistory: readonly ReportPoint[] = [
  { wave: 1, definition: "usage-30d", rate: .48 },
  { wave: 2, definition: "usage-30d", rate: .52 },
];
const sampleIncoming = {
  "usage-30d": { wave: 3, definition: "usage-30d", rate: .57 },
  "usage-7d": { wave: 3, definition: "usage-7d", rate: .38 },
} satisfies Record<UsageDefinition, ReportPoint>;

function trackingSnapshot(format: ReportFormat, incoming: ReportPoint | null, missingDefinition: UsageDefinition | null): TrackingReportSnapshot {
  const trend = sampleUsageHistory.map(point => ({ ...point }));
  const trendDefinition = trend[0].definition;
  const separate = incoming && incoming.definition !== trendDefinition ? { ...incoming } : null;
  if (separate) return { format, trendDefinition, trend, separate, missingDefinition: null, change: null };
  if (missingDefinition) return { format, trendDefinition, trend, separate: null, missingDefinition, change: null };
  if (incoming) trend.push({ ...incoming });
  const latest = trend[trend.length - 1], previous = trend[trend.length - 2];
  return { format, trendDefinition, trend, separate: null, missingDefinition: null, change: latest.rate - previous.rate };
}

export function trackingReportFor(values: readonly boolean[]): TrackingReport {
  const definition: UsageDefinition = values[1] === true ? "usage-7d" : "usage-30d";
  const incoming = values[0] === true ? sampleIncoming[definition] : null;
  return {
    before: trackingSnapshot("line", null, null),
    after: trackingSnapshot(values[2] === true ? "bars" : "line", incoming, !incoming && definition === "usage-7d" ? definition : null),
  };
}

export function trackingMeasureLabel(definition: UsageDefinition, language: ResearchLanguage) {
  if (definition === "usage-7d") return language === "zh" ? "近 7 天使用率" : "7-day usage rate";
  return language === "zh" ? "近 30 天使用率" : "30-day usage rate";
}
export function trackingWaveLabel(wave: number, language: ResearchLanguage) {
  return language === "zh" ? `第 ${wave} 期` : `Wave ${wave}`;
}
export function trackingFormatLabel(format: ReportFormat, language: ResearchLanguage) {
  return format === "bars" ? (language === "zh" ? "柱状图" : "Bar chart") : (language === "zh" ? "折线图" : "Line chart");
}
export function trackingReportMissingLabel(language: ResearchLanguage) {
  return language === "zh" ? "暂无数据" : "No data yet";
}
export function trackingReportNote(snapshot: TrackingReportSnapshot, language: ResearchLanguage) {
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  const measure = trackingMeasureLabel(snapshot.trendDefinition, language);
  if (snapshot.separate) {
    const point = snapshot.separate, rate = mixRate(point.rate), wave = trackingWaveLabel(point.wave, language);
    const revisedMeasure = trackingMeasureLabel(point.definition, language);
    return l(`${wave}的${revisedMeasure}为 ${rate}。保留${measure}的历史趋势，两种口径不直接比较。`,
      `${wave}: ${rate} (${revisedMeasure}). Keep the ${measure} trend. The two measures are not directly comparable.`);
  }
  if (snapshot.missingDefinition) {
    const revisedMeasure = trackingMeasureLabel(snapshot.missingDefinition, language);
    return l(`${revisedMeasure}暂无数据。保留${measure}历史趋势，不用旧口径填补新口径。`,
      `No data yet for the ${revisedMeasure}. Keep the ${measure} history; do not use it to fill in the new measure.`);
  }
  const latest = snapshot.trend[snapshot.trend.length - 1], previous = snapshot.trend[snapshot.trend.length - 2];
  const change = mixDelta(snapshot.change, language);
  const prevWave = trackingWaveLabel(previous.wave, language), lastWave = trackingWaveLabel(latest.wave, language);
  return l(`${measure}从${prevWave}的 ${mixRate(previous.rate)} 变为${lastWave}的 ${mixRate(latest.rate)}（${change}）。`,
    `The ${measure} moved from ${mixRate(previous.rate)} in ${prevWave} to ${mixRate(latest.rate)} in ${lastWave} (${change}).`);
}

export function trackingReportHeadline(report: TrackingReport, language: ResearchLanguage) {
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  if (report.after.separate) return l("新口径单列，历史趋势保留", "New measure stays separate");
  if (report.after.missingDefinition) return l("新口径暂无数据，保留历史", "No data for the new measure yet");
  if (report.after.trend.length > report.before.trend.length) return l("新增一期，图表与正文同步", "The new wave updates both chart and text");
  if (report.after.format !== report.before.format) return l("只改图表版式，数值与正文不变", "Chart format changes, not the figures or text");
  return l("本次未选择变更", "No changes selected");
}

function trackingReportSection(values: boolean[], language: ResearchLanguage): ResearchArtifactSection {
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  const report = trackingReportFor(values);
  const pointText = (p: ReportPoint) => `${trackingWaveLabel(p.wave, language)} ${mixRate(p.rate)}`;
  const trendText = (snapshot: TrackingReportSnapshot) => snapshot.trend.map(pointText).join(" · ");
  const measure = (definition: UsageDefinition) => trackingMeasureLabel(definition, language);
  const { separate, missingDefinition } = report.after;
  return {
    title: l("样例报告对照", "Example report comparison"),
    rows: [
      { label: `${l("更新前", "Before")} · ${measure(report.before.trendDefinition)}`, text: trendText(report.before) },
      { label: `${l("更新后", "After")} · ${measure(report.after.trendDefinition)}`, text: trendText(report.after) },
      ...(separate ? [{ label: `${l("更新后单列", "After, shown separately")} · ${measure(separate.definition)}`, text: pointText(separate) }]
        : missingDefinition ? [{ label: `${l("更新后", "After")} · ${measure(missingDefinition)}`, text: trackingReportMissingLabel(language) }] : []),
      { label: l("图表版式", "Chart format"), text: `${trackingFormatLabel(report.before.format, language)} → ${trackingFormatLabel(report.after.format, language)}` },
    ],
    points: [l(`更新前正文：${trackingReportNote(report.before, language)}`, `Before: ${trackingReportNote(report.before, language)}`),
      l(`更新后正文：${trackingReportNote(report.after, language)}`, `After: ${trackingReportNote(report.after, language)}`)],
  };
}

export type LibraryChannel = "online" | "offline";
export type LibraryEvidence = {
  id: string; category: "health" | "pet"; name: Bilingual; channel: LibraryChannel;
  batch: "current" | "other"; priceCents: number | null; netGrams: number | null;
};
type LibraryAssessment = { record: LibraryEvidence } & (
  | { status: "comparable"; reason: "aligned"; perKgCents: number }
  | { status: "review"; reason: "price" | "weight"; perKgCents: null }
  | { status: "reference"; reason: "channel" | "batch"; perKgCents: null }
);

// Constructed product records, not current prices or coverage from a real project.
const libraryExamples: readonly LibraryEvidence[] = [
  { id:"health-a", category:"health", name:{zh:"冲饮粉 A",en:"Drink powder A"}, channel:"online", batch:"current", priceCents:2500, netGrams:250 },
  { id:"health-b", category:"health", name:{zh:"冲饮粉 B",en:"Drink powder B"}, channel:"online", batch:"current", priceCents:4200, netGrams:500 },
  { id:"pet-a", category:"pet", name:{zh:"干粮 A",en:"Dry food A"}, channel:"online", batch:"current", priceCents:3200, netGrams:800 },
  { id:"pet-b", category:"pet", name:{zh:"干粮 B",en:"Dry food B"}, channel:"online", batch:"current", priceCents:4900, netGrams:1000 },
  { id:"pet-c", category:"pet", name:{zh:"干粮 C",en:"Dry food C"}, channel:"online", batch:"current", priceCents:2600, netGrams:null },
  { id:"pet-d", category:"pet", name:{zh:"干粮 D",en:"Dry food D"}, channel:"offline", batch:"current", priceCents:4200, netGrams:1200 },
  { id:"pet-e", category:"pet", name:{zh:"干粮 E",en:"Dry food E"}, channel:"online", batch:"other", priceCents:3900, netGrams:1000 },
];
export function queryLibrary(category: string) {
  return libraryExamples.filter(row => category === "all" || row.category === category).map(record => ({ ...record, name: { ...record.name } }));
}
const positiveInteger = (value: number | null): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;
export function assessLibraryRecord(record: LibraryEvidence, channel: LibraryChannel): LibraryAssessment {
  if (record.channel !== channel) return { record, status: "reference", reason: "channel", perKgCents: null };
  if (record.batch !== "current") return { record, status: "reference", reason: "batch", perKgCents: null };
  if (!positiveInteger(record.priceCents)) return { record, status: "review", reason: "price", perKgCents: null };
  if (!positiveInteger(record.netGrams)) return { record, status: "review", reason: "weight", perKgCents: null };
  return { record, status: "comparable", reason: "aligned", perKgCents: Math.round(record.priceCents * 1000 / record.netGrams) };
}
export function queryLibraryEvidence(category: string, channel: LibraryChannel) {
  if (channel !== "online" && channel !== "offline") throw new RangeError("Unknown comparison channel");
  const records = queryLibrary(category).map(record => assessLibraryRecord(record, channel));
  const groups = (["health", "pet"] as const).flatMap(category => {
    const comparable = records.filter(item => item.record.category === category && item.status === "comparable");
    return comparable.length ? [{ category, comparable }] : [];
  });
  return { category, channel, records, groups, comparable: records.filter(item => item.status === "comparable").length,
    held: records.filter(item => item.status !== "comparable") };
}
export type LibraryEvidenceQuery = ReturnType<typeof queryLibraryEvidence>;
export function libraryCategoryLabel(category: string, language: ResearchLanguage) {
  const labels = { health: {zh:"健康产品",en:"Health products"}, pet: {zh:"宠物食品",en:"Pet food"}, all: {zh:"全部品类",en:"All categories"} };
  return Object.hasOwn(labels, category) ? labels[category as keyof typeof labels][language] : language === "zh" ? "未知品类" : "Unknown category";
}
export const libraryChannelLabel = (channel: LibraryChannel, language: ResearchLanguage) => channel === "online"
  ? (language === "zh" ? "线上商品页" : "Online listings") : (language === "zh" ? "线下货架" : "Store shelves");
export const libraryBatchLabel = (batch: LibraryEvidence["batch"], language: ResearchLanguage) => batch === "current"
  ? (language === "zh" ? "本批采集" : "Current batch") : (language === "zh" ? "另一批采集" : "Other batch");
const libraryBlank = (language: ResearchLanguage) => language === "zh" ? "未记录" : "Not recorded";
export const libraryPrice = (cents: number | null, language: ResearchLanguage) => positiveInteger(cents)
  ? (language === "zh" ? `¥${(cents/100).toFixed(2)}` : `CNY ${(cents/100).toFixed(2)}`) : libraryBlank(language);
export const libraryWeight = (grams: number | null, language: ResearchLanguage) => positiveInteger(grams) ? `${grams} g` : libraryBlank(language);
export const libraryUnitPrice = (cents: number, language: ResearchLanguage) => language === "zh" ? `${(cents/100).toFixed(2)} 元/kg` : `CNY ${(cents/100).toFixed(2)}/kg`;
export const libraryEvidenceFormula = (item: LibraryAssessment, language: ResearchLanguage) => item.status === "comparable"
  ? `${libraryPrice(item.record.priceCents,language)} ÷ ${Number(item.record.netGrams)/1000} kg = ${libraryUnitPrice(item.perKgCents,language)}` : null;
export const libraryStatus = (status: LibraryAssessment["status"], language: ResearchLanguage) => ({
  comparable:{zh:"纳入比较",en:"Included"},review:{zh:"待核对",en:"Needs review"},reference:{zh:"仅作参考",en:"Context only"},
})[status][language];
export const libraryReason = (reason: LibraryAssessment["reason"], language: ResearchLanguage) => ({
  aligned:{zh:"来源与本次口径一致",en:"Source matches the selected scope"},
  price:{zh:"标价缺失或无效",en:"List price is missing or invalid"},
  weight:{zh:"缺少可用净重",en:"No usable net weight"},
  channel:{zh:"不在所选渠道",en:"Outside the selected channel"},
  batch:{zh:"不在同一采集批次",en:"Collected in another batch"},
})[reason][language];
export const libraryScopeNote = (language: ResearchLanguage) => language === "zh"
  ? "按品类分别比较样例标价，不据此推断市场均价或价格带。"
  : "Compare example list prices within each category. They do not establish a market average or price band.";
export const librarySingleRecordNote = (language: ResearchLanguage) => language === "zh"
  ? "只有一条符合口径，可记录单价，暂不能做组内比较。"
  : "One eligible record: retain its unit price, but there is no within-category comparison yet.";
export function libraryEvidenceHeadline(query: LibraryEvidenceQuery, language: ResearchLanguage) {
  if (!query.records.length) return language === "zh" ? "未找到样例资料" : "No matching example records";
  if (!query.comparable) return language === "zh" ? "本口径暂无可比标价" : "No list prices match this scope";
  return language === "zh" ? `${query.comparable} 条标价符合口径`
    : `${query.comparable} ${query.comparable === 1 ? "list price matches" : "list prices match"} this scope`;
}

function libraryEvidenceSections(query: LibraryEvidenceQuery, artifact: number, language: ResearchLanguage): ResearchArtifactSection[] {
  const l=(zh:string,en:string)=>language==="zh"?zh:en;
  const empty = l("本口径没有可纳入比较的标价。","No list prices can be included under this scope.");
  const scope = { title: l("样例比较口径","Example comparison scope"), rows: [
    {label:l("品类","Category"),text:libraryCategoryLabel(query.category,language)},
    {label:l("来源范围","Source scope"),text:`${libraryChannelLabel(query.channel,language)} · ${libraryBatchLabel("current",language)}`},
    {label:l("比较单位","Comparison unit"),text:l("标价 ÷ 净重（kg）","List price ÷ net weight (kg)")},
  ], points: [libraryScopeNote(language)] };
  const name = (record: LibraryEvidence) => `${record.name[language]} · ${libraryCategoryLabel(record.category,language)}`;
  if (!query.records.length) return [scope,{title:l("查询结果","Query results"),points:[l("未找到符合条件的样例记录。","No matching example records found.")]}];
  if (artifact===1) return [scope,{title:l("逐条核对来源与用法","Check each source and its use"), rows:query.records.map(item=>({
    label:name(item.record), text:[libraryChannelLabel(item.record.channel,language),libraryBatchLabel(item.record.batch,language),
      `${l("标价","List price")} ${libraryPrice(item.record.priceCents,language)}`,`${l("净重","Net weight")} ${libraryWeight(item.record.netGrams,language)}`,
      `${libraryStatus(item.status,language)}：${libraryReason(item.reason,language)}`].join(" · "),
  }))}];
  const included = query.groups.map(group=>({ title:libraryCategoryLabel(group.category,language), rows:group.comparable.map(item=>({
    label:item.record.name[language],text:libraryEvidenceFormula(item,language) ?? "",
  })), ...(group.comparable.length===1?{points:[librarySingleRecordNote(language)]}:{}) }));
  return [scope, ...(included.length ? included : [{title:l("同口径标价","Comparable list prices"),points:[empty]}]),
    ...(artifact===0 && query.held.length ? [{title:l("未纳入比较","Not included in the comparison"),rows:query.held.map(item=>({
      label:name(item.record),text:`${libraryStatus(item.status,language)} · ${libraryReason(item.reason,language)}`,
    }))}] : [])];
}

export type ResearchArtifactSection = { title: string; rows?: {label: string; text: string}[]; points?: string[] };
export type ResearchArtifact = { title: string; summary: string; filename: string; sections: ResearchArtifactSection[] };
function validPractice(practice: number) { if (!Number.isInteger(practice)||practice<0||practice>2) throw new RangeError("Unknown research practice"); }
const examples: readonly { title: Bilingual; prompt: Bilingual; values: readonly [boolean,boolean,boolean]; category: "all" | "pet" }[] = [
  {
    title: {zh:"总体满意度上升，分人群看还是这样吗？",en:"Satisfaction rose overall. Does it hold across groups?"},
    prompt: {zh:"用同一人群构成复算两期，看看变化方向是否一致。",en:"Recalculate both waves with the same audience mix and see whether the direction holds."},
    values: [true,true,true], category: "all",
  },
  {
    title: {zh:"新增一期、指标也变了，报告要改哪里？",en:"A new wave and a revised measure: what needs updating?"},
    prompt: {zh:"对照更新前后的图表与正文，看看新口径怎样单列、历史怎样保留。",en:"Compare the chart and text before and after. See how the new measure stays separate from the historical trend."},
    values: [true,true,false], category: "all",
  },
  {
    title: {zh:"几条宠物食品标价，哪些能放在一起比？",en:"Which pet-food prices can you compare?"},
    prompt: {zh:"核对渠道、批次和净重，再按每公斤换算；查看哪些记录没有纳入，以及原因。",en:"Check the channel, batch, and net weight before converting to price per kilogram. See which records stay out and why."},
    values: [true,true,true], category: "pet",
  },
];
export function researchExampleFor(practice: number) {
  validPractice(practice);
  const {title,prompt,values,category} = examples[practice];
  return {title:{...title},prompt:{...prompt},values:[...values],category};
}
export function researchOutputLabels(practice: number, language: ResearchLanguage) {
  validPractice(practice);
  const labels = language==="zh" ? [["判断","处理","复用"],["范围","复核","规则"],["资料","来源","比较"]] : [["Findings","Actions","Reuse"],["Scope","Review","Rules"],["Records","Sources","Compare"]];
  return labels[practice];
}
export function researchResultSummary(practice: number, values: boolean[], category: string, language: ResearchLanguage, reference: MixReference = 0, channel: LibraryChannel = "online") {
  validPractice(practice);
  const l=(zh:string,en:string)=>language==="zh"?zh:en;
  if(practice===0){const count=compareConditions(values).filter(item=>!item.aligned).length;return count?l(`${count}项比较条件需要先处理`,count===1?"1 comparison criterion needs attention":`${count} comparison criteria need attention`):audienceMixHeadline(calculateAudienceMix(reference),language);}
  if(practice===1){const count=planUpdates(values).length;return count?l(`${count}类内容需要更新`,`${count} areas to update`):l("本次未选择变更","No changes selected");}
  return libraryEvidenceHeadline(queryLibraryEvidence(category,channel),language);
}
export function buildResearchArtifact(practice: number, artifact: number, values: boolean[], category: string, language: ResearchLanguage, reference: MixReference = 0, channel: LibraryChannel = "online"): ResearchArtifact {
  validPractice(practice);
  if(!Number.isInteger(artifact)||artifact<0||artifact>2)throw new RangeError("Unknown research output");
  const l=(zh:string,en:string)=>language==="zh"?zh:en;
  const titleSets=language==="zh"?[["跨期比较判断","比较差异处理建议","分析复用清单"],["多期报告更新范围","多期更新复核计划","多期报告复用规则"],["研究资料筛选结果","来源复核明细","同口径标价对比"]]:[["Cross-wave comparison findings","Actions for comparison differences","Reusable analysis checklist"],["Report update scope","Report update review plan","Reusable update rules"],["Research evidence results","Source review records","Comparable list prices"]];
  const filenames=[["comparison-findings","comparison-actions","comparison-reuse"],["tracking-update-scope","tracking-update-review","tracking-update-rules"],["research-query-records","research-query-sources","research-query-comparison"]];
  const sections: ResearchArtifactSection[]=[];
  const plan=planTrackingUpdate(values),comparisons=compareConditions(values);
  const row=(item:UpdatePlanItem)=>({label:item[language],text:item.action[language]});
  if(practice===0){
    if(artifact===0){
      sections.push({title:l("比较条件","Comparison criteria"),rows:comparisons.map(item=>({label:item[language],text:item.aligned?l("一致","Aligned"):l("有变化","Changed")}))});
      const comparison = comparableAudienceMix(values, reference);
      if (comparison) {
        const labels = audienceMixLabels(language);
        const periodRates = (kind: "observed" | "adjusted") => comparison.waves.map((wave, i) => `${labels.wave[i]} ${mixRate(wave[kind])}`).join(" → ") + ` · ${mixDelta(comparison.change[kind],language)}`;
        sections.push({title:l("样例数据：满意占比","Example data: satisfaction rates"),rows:[
          {label:labels.observed,text:periodRates("observed")},
          {label:`${labels.adjusted} · ${mixReferenceLabel(reference, language)}`,text:periodRates("adjusted")},
        ],points:[audienceMixNote(comparison,language)]},
        {title:l("分组人数与复算","Group counts and calculation"),rows:[
          ...comparison.groups.map(group=>({label:group.label[language],text:group.waves.map((wave,i)=>`${labels.wave[i]} ${wave.satisfied}/${wave.total}`).join(" · ") + l(` · 参照占比 ${mixRate(group.weight)}`,` · Reference share ${mixRate(group.weight)}`)})),
          {label:l("合计","Total"),text:comparison.waves.map((wave,i)=>`${labels.wave[i]} ${wave.satisfied}/${wave.total}`).join(" · ")},
        ],points:([0,1] as const).map(i=>`${labels.wave[i]}: ${audienceMixFormula(comparison,i)}`)});
      } else sections.push({title:l("暂不计算两期差异","Comparison on hold"),points:[l("先处理变化的比较条件，再复算两期。","Resolve the changed comparison criteria before recalculating the two waves.")]});
    }
    else if(artifact===1){const changed=comparisons.filter(item=>!item.aligned);sections.push({title:l("比较前的检查","Checks before comparison"),points:changed.length?changed.map(item=>item[language==="zh"?"actionZh":"actionEn"]):[l("同时看总体比例和按相同人群构成重算的比例；变化方向不同时，先回到分组检查。","Review the overall rate alongside the same-mix rate. If the directions differ, check the groups first."),l("解读真实研究结果前，仍需核对抽样、数据质量及不确定性。","Check sampling, data quality, and uncertainty before interpreting real study results.")]});}
    else sections.push({title:l("下次分析沿用的依据","Basis for the next analysis"),points:[l("记录比较市场、人群、指标定义与分析方法。","Record the markets, audiences, measure definitions, and analysis method."),l("保留每组分子、分母和两期共用的参照构成。","Retain each group’s numerator and denominator and the shared reference mix."),l("条件变化后重新运行，不直接沿用旧判断。","Rerun when criteria change rather than carrying forward an old assessment.")]});
  } else if(practice===1){
    if(artifact===0)sections.push(
      trackingReportSection(values, language),
      {title:l("需要更新","Update work"),rows:plan.updates.map(row),...(!plan.updates.length?{points:[l("未选择需要批量更新的内容。","No batch-update work selected.")]}:{})},
      {title:l("需要复核","Analyst review"),rows:plan.reviews.map(row),...(!plan.reviews.length?{points:[l("未选择新的变更范围。","No new change scope selected.")]}:{})},
      {title:l("保留内容","Retain valid content"),points:plan.preserve.map(item=>`${item[language]}${language==="zh"?"：":": "}${item.action[language]}`)},
    );
    else if(artifact===1){const points:string[]=[];if(values[0])points.push(l("先确认新增期次及比较样本，保留有效历史记录。","Confirm the new wave and comparison sample while retaining valid historical records."));if(values[1])points.push(l("核对新旧指标定义与历史可比性，再决定是否重算或分开报告。","Check old and new definitions and historical comparability before deciding to recalculate or report separately."));if(values[2])points.push(l("确认模板字段与数据来源的对应关系，再调整图表及版式。","Confirm how template fields map to source data before adjusting charts and layout."));if(points.length)points.push(l("按确认范围批量更新，再重点复核数值、图表、文字及保留内容。","Batch-update the agreed scope, then review values, charts, text, and retained content."));else points.push(l("本次没有选中变更，保留现有有效交付；后续范围变化时重新规划。","No changes are selected. Retain valid existing outputs and re-plan when the scope changes."));sections.push({title:l("建议处理顺序","Recommended sequence"),points});}
    else sections.push({title:l("可复用规则","Reusable rules"),points:[l("将来源、期次、指标与报告位置的映射保留在规则中。","Retain mappings between sources, waves, measures, and report locations."),l("按变更选择更新范围，不逐份复制或全量覆盖。","Select update work from the changes rather than copying files or overwriting everything."),l("有效历史与未受影响内容保留；条件变化后重跑并复核。","Preserve valid history and unaffected content; rerun and review when criteria change.")]});
  } else sections.push(...libraryEvidenceSections(queryLibraryEvidence(category,channel),artifact,language));
  return {title:titleSets[practice][artifact],summary:researchResultSummary(practice,values,category,language,reference,channel),filename:filenames[practice][artifact]+".txt",sections};
}
export function serializeResearchArtifact(document: ResearchArtifact, language: ResearchLanguage) {
  const lines=[document.title,language==="zh"?"研究方法示例":"Research-method example",document.summary,""];
  for(const section of document.sections){lines.push(section.title);for(const item of section.rows??[])lines.push(`${item.label}: ${item.text}`);for(const point of section.points??[])lines.push(`- ${point}`);lines.push("");}
  return lines.join("\n");
}
