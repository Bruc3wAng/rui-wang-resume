import type { Localized } from "./resume";

export const internshipProjects: { title: Localized; question: Localized; contribution: Localized; output: Localized }[] = [
  {
    title: { zh: "健康产品升级", en: "Health product upgrades" },
    question: { zh: "产品规格、组合与价格，怎样更贴近购买需求？", en: "How should product formats, bundles and pricing reflect purchasing needs?" },
    contribution: { zh: "整合电商交易、商品规格与竞品资料，比较产品组合、价格带和卖点；结合用户分层、问卷及访谈资料，分析不同用户的购买需求。", en: "Integrated e-commerce, product-format and competitive evidence to compare bundles, price bands and selling points. Used audience segmentation, surveys and interview material to examine purchasing needs." },
    output: { zh: "形成商品结构、卖点与推广策略的分析支持。", en: "Provided analytical support for assortment, messaging and promotion decisions." },
  },
  {
    title: { zh: "宠物食品新品孵化", en: "Pet food product development" },
    question: { zh: "新产品如何在已有品牌和渠道中找到位置？", en: "Where could a new product fit within an established competitive landscape?" },
    contribution: { zh: "梳理头部品牌的产品布局、主力单品和渠道打法，将产品对照表、典型品牌案例与行业访谈交叉对照，比较产品概念、卖点及触达方式。", en: "Mapped leading brands, hero products and channel approaches. Cross-checked product mapping, brand cases and industry interviews to compare concepts, messaging and customer reach." },
    output: { zh: "交付竞争格局与品牌案例分析，为新品定位和上市准备提供依据。", en: "Delivered competitive-landscape and brand-case analysis to inform product positioning and launch preparation." },
  },
  {
    title: { zh: "展会企业并购前期研究", en: "Exhibition-sector acquisition research" },
    question: { zh: "展会的竞争地位与客户资源，是否支撑进一步评估？", en: "What do an exhibition's position and customer reach imply for further assessment?" },
    contribution: { zh: "参与展会企业商业尽调，按行业与头部厂商梳理参展企业；比较不同展会的重合、独占及新增展商，结合产业链和展商结构分析竞争地位与客户资源。", en: "Supported commercial due diligence by segmenting exhibitors by industry and leading manufacturers. Compared overlapping, exclusive and new exhibitors across events, using value-chain and exhibitor analysis to assess competitive positioning and customer reach." },
    output: { zh: "形成展商结构与竞争比较分析，为并购前期商业判断提供数据支持。", en: "Produced exhibitor-structure and competitive comparisons to support pre-acquisition commercial assessment." },
  },
];

export type DinnerPlace = { id: string; name: string; district: "chaoyang" | "shunyi"; area: string; cuisine: string; cuisineEn: string; budget: [number, number]; dishes: string[]; source: string; sourceName: string };
// Public business fields only. No personal notes, visits, preferences, identities or photographs.
export const dinnerPlaces: DinnerPlace[] = [
  { id:"parkside",name:"ParkSide 园景",district:"shunyi",area:"祥云小镇南区",cuisine:"西餐",cuisineEn:"Western",budget:[320,560],dishes:["牛排","意面","拼盘"],source:"https://big5.visitbeijing.com.cn/article/4R5lTKSrsWW",sourceName:"北京旅游网" },
  { id:"canal",name:"CANAL 餐厅",district:"shunyi",area:"罗马湖",cuisine:"融合菜",cuisineEn:"Fusion",budget:[300,500],dishes:["塔克","墨西哥玉米片","热菜"],source:"https://big5.visitbeijing.com.cn/article/4R5lTKSrsWW",sourceName:"北京旅游网" },
  { id:"sanchuan",name:"三川舞粤",district:"shunyi",area:"祥云小镇南区",cuisine:"粤菜",cuisineEn:"Cantonese",budget:[360,600],dishes:["清蒸鱼","粤式点心","时蔬"],source:"https://www.bjnews.com.cn/detail/173858204019071.html",sourceName:"新京报" },
  { id:"fousa",name:"HFFOUSA TACO",district:"shunyi",area:"祥云小镇南区",cuisine:"墨西哥菜",cuisineEn:"Mexican",budget:[240,400],dishes:["塔可","番茄冷汤","烤物"],source:"https://big5.visitbeijing.com.cn/article/4R5lTKSrsWW",sourceName:"北京旅游网" },
  { id:"yizuoyiwang",name:"一坐一忘",district:"chaoyang",area:"三里屯北小街",cuisine:"云南菜",cuisineEn:"Yunnan",budget:[260,440],dishes:["雕梅小排骨","香煎豆腐","糍粑辣子鸡"],source:"https://m.dianping.com/shop/1906357",sourceName:"大众点评" },
  { id:"xiaodadong",name:"Rhapsody 小大董",district:"chaoyang",area:"三里屯太古里",cuisine:"北京菜",cuisineEn:"Beijing",budget:[360,620],dishes:["烤鸭","热菜","时令蔬菜"],source:"https://www.visitbeijing.com.cn/article/4E4La2Y31ft",sourceName:"北京旅游网" },
];
