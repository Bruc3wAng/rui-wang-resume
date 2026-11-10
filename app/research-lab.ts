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
export const libraryExamples = [
  {category:"health",zh:"健康产品",en:"Health products",topicZh:"规格与组合",topicEn:"Formats & bundles",sourceZh:"商品资料",sourceEn:"Product material"},
  {category:"health",zh:"健康产品",en:"Health products",topicZh:"价格带定义",topicEn:"Price-band definitions",sourceZh:"指标记录",sourceEn:"Measure record"},
  {category:"pet",zh:"宠物食品",en:"Pet food",topicZh:"品类与单品",topicEn:"Categories & products",sourceZh:"商品资料",sourceEn:"Product material"},
  {category:"pet",zh:"宠物食品",en:"Pet food",topicZh:"来源与时间",topicEn:"Source & collection date",sourceZh:"来源记录",sourceEn:"Source record"},
];
export function queryLibrary(category: string) { return libraryExamples.filter(row=>category==="all"||row.category===category); }

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
    prompt: {zh:"点开每个变化，查看它影响的更新项、复核项，以及应保留的内容。",en:"Trace each change to what needs updating or reviewing and what stays as it is."},
    values: [true,true,false], category: "all",
  },
  {
    title: {zh:"想比较宠物食品，先去哪里找资料？",en:"Where would you start a pet-food comparison?"},
    prompt: {zh:"按品类找到研究主题和来源，再看比较前需要核对什么。",en:"Find relevant topics and sources, then see what to verify before comparing."},
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
export function researchResultSummary(practice: number, values: boolean[], category: string, language: ResearchLanguage, reference: MixReference = 0) {
  validPractice(practice);
  const l=(zh:string,en:string)=>language==="zh"?zh:en;
  if(practice===0){const count=compareConditions(values).filter(item=>!item.aligned).length;return count?l(`${count}项比较条件需要先处理`,count===1?"1 comparison criterion needs attention":`${count} comparison criteria need attention`):audienceMixHeadline(calculateAudienceMix(reference),language);}
  if(practice===1){const count=planUpdates(values).length;return count?l(`${count}类内容需要更新`,`${count} areas to update`):l("本次未选择变更","No changes selected");}
  const count=queryLibrary(category).length;return l(`${count}条样例记录`,`${count} example records`);
}
export function buildResearchArtifact(practice: number, artifact: number, values: boolean[], category: string, language: ResearchLanguage, reference: MixReference = 0): ResearchArtifact {
  validPractice(practice);
  if(!Number.isInteger(artifact)||artifact<0||artifact>2)throw new RangeError("Unknown research output");
  const l=(zh:string,en:string)=>language==="zh"?zh:en;
  const titleSets=language==="zh"?[["跨期比较判断","比较差异处理建议","分析复用清单"],["多期报告更新范围","多期更新复核计划","多期报告复用规则"],["研究资料查询结果","来源核对要点","比较准备清单"]]:[["Cross-wave comparison findings","Actions for comparison differences","Reusable analysis checklist"],["Report update scope","Report update review plan","Reusable update rules"],["Research-material results","Source-verification checklist","Preparation for comparison"]];
  const filenames=[["comparison-findings","comparison-actions","comparison-reuse"],["tracking-update-scope","tracking-update-review","tracking-update-rules"],["research-query-records","research-query-sources","research-query-comparison"]];
  const sections: ResearchArtifactSection[]=[];
  const plan=planTrackingUpdate(values),comparisons=compareConditions(values),records=queryLibrary(category);
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
      {title:l("需要更新","Update work"),rows:plan.updates.map(row),...(!plan.updates.length?{points:[l("未选择需要批量更新的内容。","No batch-update work selected.")]}:{})},
      {title:l("需要复核","Analyst review"),rows:plan.reviews.map(row),...(!plan.reviews.length?{points:[l("未选择新的变更范围。","No new change scope selected.")]}:{})},
      {title:l("保留内容","Retain valid content"),points:plan.preserve.map(item=>`${item[language]}${language==="zh"?"：":": "}${item.action[language]}`)},
    );
    else if(artifact===1){const points:string[]=[];if(values[0])points.push(l("先确认新增期次及比较样本，保留有效历史记录。","Confirm the new wave and comparison sample while retaining valid historical records."));if(values[1])points.push(l("核对新旧指标定义与历史可比性，再决定是否重算或分开报告。","Check old and new definitions and historical comparability before deciding to recalculate or report separately."));if(values[2])points.push(l("确认模板字段与数据来源的对应关系，再调整图表及版式。","Confirm how template fields map to source data before adjusting charts and layout."));if(points.length)points.push(l("按确认范围批量更新，再重点复核数值、图表、文字及保留内容。","Batch-update the agreed scope, then review values, charts, text, and retained content."));else points.push(l("本次没有选中变更，保留现有有效交付；后续范围变化时重新规划。","No changes are selected. Retain valid existing outputs and re-plan when the scope changes."));sections.push({title:l("建议处理顺序","Recommended sequence"),points});}
    else sections.push({title:l("可复用规则","Reusable rules"),points:[l("将来源、期次、指标与报告位置的映射保留在规则中。","Retain mappings between sources, waves, measures, and report locations."),l("按变更选择更新范围，不逐份复制或全量覆盖。","Select update work from the changes rather than copying files or overwriting everything."),l("有效历史与未受影响内容保留；条件变化后重跑并复核。","Preserve valid history and unaffected content; rerun and review when criteria change.")]});
  } else {
    if(artifact===0)sections.push({title:l("当前品类的资料","Material for the selected category"),rows:records.map(item=>({label:item[language==="zh"?"topicZh":"topicEn"],text:`${item[language]} · ${item[language==="zh"?"sourceZh":"sourceEn"]}`})),...(!records.length?{points:[l("未找到符合条件的样例记录。","No matching example records found.")]}:{})});
    else if(artifact===1)sections.push({title:l("回到来源核对","Checks against the original source"),points:records.length?[...new Set(records.map(item=>item[language==="zh"?"sourceZh":"sourceEn"]))].map(source=>l(`${source}：核对定义、采集时间及适用范围。`,`${source}: check definitions, collection date, and scope.`)):[l("先补充符合条件的资料，再核对来源与定义。","Add matching material before checking sources and definitions.")]});
    else sections.push({title:l("比较前的准备","Before comparing records"),points:[l("保留当前品类、研究主题与来源类型。","Retain the selected category, research topic, and source type."),l("比较前核对定义、规格、单位与采集时间是否一致。","Check definitions, formats, units, and collection dates before comparing."),l("定义或来源不足时补充资料，不把缺失内容当作已核实结果。","Add missing definitions or sources rather than treating incomplete material as verified.")]});
  }
  return {title:titleSets[practice][artifact],summary:researchResultSummary(practice,values,category,language,reference),filename:filenames[practice][artifact]+".txt",sections};
}
export function serializeResearchArtifact(document: ResearchArtifact, language: ResearchLanguage) {
  const lines=[document.title,language==="zh"?"研究方法示例":"Research-method example",document.summary,""];
  for(const section of document.sections){lines.push(section.title);for(const item of section.rows??[])lines.push(`${item.label}: ${item.text}`);for(const point of section.points??[])lines.push(`- ${point}`);lines.push("");}
  return lines.join("\n");
}
