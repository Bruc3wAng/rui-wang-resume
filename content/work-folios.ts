type LocalizedText = { zh: string; en: string };
export type FolioDescription = { content: LocalizedText; purpose: LocalizedText };

export const folioDescriptions: Record<string, FolioDescription[]> = {
  "content-tracking": [
    { content: { zh: "分市场完成相对权重与相关分析，对照体验因素排名，形成跨市场分析报告。", en: "Run relative weight and correlation analyses by market, compare experience-factor rankings, and produce a cross-market report." }, purpose: { zh: "说明哪些体验因素与满意度关联更强，并提出后续研究建议。", en: "Explain which experience factors are more closely associated with satisfaction and identify directions for further research." } },
    { content: { zh: "核对分析方法、目标人群和指标定义，比较不同期次的结果及排序。", en: "Check methods, target audiences, and measure definitions before comparing results and rankings across waves." }, purpose: { zh: "区分研究条件变化与结果差异，避免直接套用不一致的比较。", en: "Assess differences in the context of changing research conditions rather than treating every wave as directly comparable." } },
    { content: { zh: "记录比较条件、计算规则及独立复核步骤，形成分析方法 SOP。", en: "Document comparison criteria, calculation rules, and independent checks in an analysis guide." }, purpose: { zh: "让后续追踪沿用同一分析流程，把精力用于解释差异。", en: "Make the analytical process reusable in later tracking work, leaving more attention for interpreting differences." } },
  ],
  "brand-tracking": [
    { content: { zh: "梳理多期指标、数据与报告，核对历史比较条件并保留有效结果。", en: "Integrate measures, data, and reports across waves, checking historical comparison criteria and preserving valid results." }, purpose: { zh: "为持续观察品牌认知、评价和形象变化提供一致依据。", en: "Provide a consistent basis for tracking brand awareness, perceptions, and image over time." } },
    { content: { zh: "建立来源字段、监测平台、图表和对应文字之间的映射，追溯差异。", en: "Map source fields to the tracking platform, charts, and related text so discrepancies can be traced." }, purpose: { zh: "确认各处是否使用同一指标和期次，再判断差异应修正还是保留。", en: "Establish whether outputs refer to the same measure and wave before deciding what to correct or preserve." } },
    { content: { zh: "借助 Codex 将更新规则写入程序，批量比对文件并更新既定范围。", en: "Use Codex to encode update rules, compare files in batches, and update the agreed scope." }, purpose: { zh: "替代逐份查找和反复复制，同时保留有效历史与重点复核步骤。", en: "Replace repeated searching and copying while preserving valid history and targeted analyst review." } },
  ],
  "us-content": [
    { content: { zh: "组织研究执行与用户分层，比较不同用户的内容消费特征。", en: "Coordinate fieldwork and audience segmentation, comparing content-consumption characteristics across user groups." }, purpose: { zh: "帮助理解不同用户的消费差异，为目标人群判断提供依据。", en: "Clarify differences between audiences and provide evidence for identifying target users." } },
    { content: { zh: "比较内容偏好、消费习惯及人群重合，整理不同用户之间的异同。", en: "Compare content preferences, consumption habits, and audience overlap to distinguish similarities and differences." }, purpose: { zh: "将消费习惯与用户特征联系起来，支持内容定位的研究判断。", en: "Connect consumption patterns with audience characteristics to inform content-positioning research." } },
    { content: { zh: "独立负责美国市场的研究执行、用户分层和分析交付。", en: "Independently manage fieldwork, audience segmentation, and analytical delivery for the U.S. study." }, purpose: { zh: "把执行与分析串起来，为目标用户和内容定位提供研究依据。", en: "Connect study execution with analysis to provide evidence for audience and content positioning." } },
  ],
  "search-tracking": [
    { content: { zh: "按市场与人群比较平台认知、搜索场景及使用习惯。", en: "Compare platform awareness, search contexts, and usage habits across markets and audience groups." }, purpose: { zh: "解释不同市场与用户的搜索行为差异，形成跨市场研究比较。", en: "Explain how search behavior differs between markets and audiences through cross-market comparisons." } },
    { content: { zh: "结合用户分层、交叉分析与趋势比较，分析用户在什么场景搜索。", en: "Use segmentation, cross-tabulation, and trend comparisons to examine the contexts in which audiences search." }, purpose: { zh: "把平台认知与实际搜索场景联系起来，帮助理解用户习惯。", en: "Relate platform awareness to search contexts and develop a clearer understanding of user habits." } },
    { content: { zh: "将问卷、数据字段与分析表的对应关系写成规则，借助 Codex 批量复核。", en: "Map questionnaire items, data fields, and analysis tables into rules for Codex-assisted batch checks." }, purpose: { zh: "发现差异后能回到对应数据，便于团队确认问题并修正。", en: "Trace discrepancies to the relevant data so the team can confirm issues and make corrections." } },
  ],
  "qualitative": [
    { content: { zh: "协调跨语言研究执行，结合海外实地访谈与相关定量资料。", en: "Coordinate cross-language research execution, combining international field interviews with related survey evidence." }, purpose: { zh: "让不同语言与场景下的研究资料能够围绕同一问题理解。", en: "Bring evidence from different languages and settings together around the research question." } },
    { content: { zh: "结合访谈与定量资料，理解企业用户的使用场景和产品需求。", en: "Combine interview and survey evidence to understand business users’ use cases and product needs." }, purpose: { zh: "为理解用户需求提供资料依据，不只停留在单一的定量描述。", en: "Support an understanding of user needs that draws on both quantitative and qualitative evidence." } },
    { content: { zh: "结合使用场景、产品需求和采购决策，理解用户如何考虑产品。", en: "Consider use cases, product needs, and purchasing decisions together to understand how users assess products." }, purpose: { zh: "将用户的使用需求与采购考虑联系起来，支持需求与决策研究。", en: "Connect product-use needs with purchasing considerations to support needs and decision research." } },
  ],
};

export function folioDescriptionsFor(id: string): FolioDescription[] {
  if (!Object.hasOwn(folioDescriptions, id)) throw new RangeError("Unknown study identity");
  return folioDescriptions[id];
}
export function responsibilityLabel(role: string) { return role.split(" · ")[0]; }
