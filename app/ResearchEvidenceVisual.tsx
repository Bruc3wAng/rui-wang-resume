import type { CSSProperties } from "react";
import type { Language } from "../content/resume";
import styles from "./ResearchEvidenceVisual.module.css";

const countryNames: Record<string, { zh: string; en: string }> = {
  US: { zh: "美国", en: "United States" },
  UK: { zh: "英国", en: "United Kingdom" },
  DE: { zh: "德国", en: "Germany" },
  JP: { zh: "日本", en: "Japan" },
  ID: { zh: "印度尼西亚", en: "Indonesia" },
  BR: { zh: "巴西", en: "Brazil" },
  SA: { zh: "沙特阿拉伯", en: "Saudi Arabia" },
  KR: { zh: "韩国", en: "South Korea" },
};

const copy = {
  zh: {
    content: {
      title: "从七国追踪数据到满意度分析",
      baseline: "统一比较标准",
      definitions: ["用户分组", "样本与加权", "跨期口径"],
      methods: ["相对权重分析", "相关分析", "跨期比较"],
      result: "跨市场报告 · 后续研究建议",
    },
    search: {
      title: "理解不同市场的搜索行为",
      baseline: "统一指标定义与统计口径",
      definitions: ["平台认知", "搜索场景", "使用习惯"],
      methods: ["用户分层", "交叉分析", "趋势比较"],
      result: "跨市场认知与行为比较",
    },
    taskTitle: "结合搜索操作与用户反馈",
    task: "搜索任务",
    action: "操作过程",
    actionDetail: "任务与录屏资料",
    feedback: "体验反馈",
    feedbackDetail: "问卷与用户评价",
    taskResult: "搜索需求与体验分析",
    audienceTitle: "比较短剧与网文用户",
    audiences: ["短剧用户", "网文用户"],
    dimensions: ["内容偏好", "消费习惯", "人群重合"],
    audienceResult: "内容偏好、习惯与人群重合分析",
    output: "研究产出",
  },
  en: {
    content: {
      title: "From seven-country tracking to satisfaction analysis",
      baseline: "Shared comparison criteria",
      definitions: ["Audience groups", "Samples & weights", "Wave definitions"],
      methods: ["Relative weight analysis", "Correlations", "Wave comparisons"],
      result: "Cross-market reporting · Further research",
    },
    search: {
      title: "Understanding search behavior across markets",
      baseline: "Aligned metrics and calculation rules",
      definitions: ["Platform awareness", "Search contexts", "Usage habits"],
      methods: ["Segmentation", "Cross-tabulation", "Trend comparisons"],
      result: "Cross-market perceptions and behavior",
    },
    taskTitle: "Connect observed behavior with reported experience",
    task: "Search tasks",
    action: "User actions",
    actionDetail: "Tasks & screen recordings",
    feedback: "User feedback",
    feedbackDetail: "Surveys & experience ratings",
    taskResult: "Search needs and experience analysis",
    audienceTitle: "Comparing drama and web-fiction audiences",
    audiences: ["Short-form drama", "Web fiction"],
    dimensions: ["Preferences", "Consumption habits", "Audience overlap"],
    audienceResult: "Preferences, habits, and audience overlap",
    output: "Research output",
  },
};

function Connector({ branches = 1, converge = true }: { branches?: number; converge?: boolean }) {
  return (
    <svg className={styles.connector} viewBox="0 0 600 32" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: branches }, (_, index) => {
        const x = branches === 1 ? 300 : ((index + 0.5) / branches) * 600;
        const path = converge
          ? `M ${x} 0 L ${x} 10 Q ${x} 16 ${x < 300 ? x + 6 : x - 6} 16 L 300 16 L 300 32`
          : `M 300 0 L 300 16 L ${x} 16 L ${x} 32`;
        return <path className={styles.trace} key={index} d={path} pathLength="1" style={{ "--trace-order": index } as CSSProperties} />;
      })}
    </svg>
  );
}

export default function ResearchEvidenceVisual({ visual, markets, language, caseIndex }: {
  visual: string;
  markets: string[];
  language: Language;
  caseIndex?: string;
}) {
  const t = copy[language];
  const key = `${visual}-${caseIndex ?? ""}-${markets.join("-")}-${language}`;
  const topic = caseIndex === "02" ? t.search : t.content;
  const title = visual === "markets" ? topic.title : visual === "journey" ? t.taskTitle : t.audienceTitle;
  const outcome = visual === "markets" ? topic.result : visual === "journey" ? t.taskResult : t.audienceResult;

  return (
    <figure className={styles.scene} key={key} data-evidence-visual={visual}>
      <figcaption className={styles.caption}>{title}</figcaption>
      {visual === "markets" ? (
        <>
          <ul className={styles.markets} style={{ "--market-count": markets.length } as CSSProperties} aria-label={language === "zh" ? "本案例覆盖市场" : "Markets in this study"}>
            {markets.map((market) => (
              <li key={market} title={countryNames[market]?.[language] ?? market}>
                <span className={styles.marketDot} aria-hidden="true" />
                <abbr title={countryNames[market]?.[language] ?? market}>{market}</abbr>
              </li>
            ))}
          </ul>
          <Connector branches={markets.length} />
          <div className={styles.baseline}>
            <strong>{topic.baseline}</strong>
            <ul>{topic.definitions.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
          <ul className={styles.methods}>{topic.methods.map(item => <li key={item}>{item}</li>)}</ul>
        </>
      ) : visual === "journey" ? (
        <>
          <div className={styles.task}>{t.task}</div>
          <Connector branches={2} converge={false} />
          <div className={styles.pair}>
            <div><strong>{t.action}</strong><span>{t.actionDetail}</span></div>
            <div><strong>{t.feedback}</strong><span>{t.feedbackDetail}</span></div>
          </div>
          <Connector branches={2} />
        </>
      ) : (
        <>
          <div className={styles.audiences}>{t.audiences.map(item => <strong key={item}>{item}</strong>)}</div>
          <Connector branches={2} />
          <ul className={styles.dimensions}>{t.dimensions.map(item => <li key={item}>{item}</li>)}</ul>
          <Connector />
        </>
      )}
      <div className={styles.output}>
        <span>{t.output}</span>
        <strong>{outcome}</strong>
      </div>
    </figure>
  );
}
