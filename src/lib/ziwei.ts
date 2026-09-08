/**
 * 紫微斗数排盘引擎（纯前端，娱乐简化版）
 *
 * 算法说明：
 * - 以出生年月日时为种子，确定性生成十二宫主星分布，
 *   同一出生信息每次排盘结果一致。
 * - 命宫位置按（农历月 + 时辰）取模十二宫近似安命。
 * - 十四主星以洗牌方式分布十二宫，两宫落为双星组合。
 * - 四化按年干查表（甲～癸），非十四正曜者就近归并。
 *
 * 精度边界：未做真实农历换算与安星诀（紫微定位、天府对宫、
 * 四化飞星），仅用于娱乐场景，不作为严肃命理依据。
 */

export type HuaType = "禄" | "权" | "科" | "忌";

export type Star = {
  name: string;
  element: "金" | "木" | "水" | "火" | "土";
  /** 帝星/将星/吉星/煞星 气质分类 */
  tone: "帝" | "智" | "阳" | "财" | "福" | "烈" | "府" | "阴" | "欲" | "暗" | "印" | "荫" | "杀" | "耗";
  keyword: string;
  personality: string;
  career: string;
  relationship: string;
};

export type Palace = {
  /** 宫位名称 */
  name: string;
  /** 宫位主题 */
  theme: string;
  /** 落入主星（空宫为空数组，借对宫） */
  stars: number[];
  /** 四化标记 */
  hua?: HuaType;
  /** 是否命宫 */
  isLife?: boolean;
};

export type ZiweiChart = {
  palaces: Palace[];
  lifeStar: number;
  /** 年干 */
  stem: string;
};

/** 十二宫位（传统顺序） */
export const PALACES = [
  "命宫",
  "兄弟",
  "夫妻",
  "子女",
  "财帛",
  "疾厄",
  "迁移",
  "交友",
  "官禄",
  "田宅",
  "福德",
  "父母",
] as const;

export const PALACE_THEMES: Record<string, string> = {
  命宫: "性格与格局",
  兄弟: "手足平辈",
  夫妻: "伴侣婚姻",
  子女: "子女晚辈",
  财帛: "理财求财",
  疾厄: "健康身心",
  迁移: "外出远行",
  交友: "朋友部属",
  官禄: "事业学业",
  田宅: "家宅资产",
  福德: "精神享受",
  父母: "长辈父母",
};

/** 十四主星 */
export const STARS: Star[] = [
  {
    name: "紫微",
    element: "土",
    tone: "帝",
    keyword: "尊贵 · 领导 · 面子",
    personality: "天生带主角气场，好面子、有主见，习惯被人依靠，也容易因高处不胜寒而孤单。",
    career: "适合管理、决策、品牌型岗位，自带权威感，创业或带团队易出头。",
    relationship: "感情里需要被尊重与仰望，伴侣宜柔顺包容，忌硬碰硬。",
  },
  {
    name: "天机",
    element: "木",
    tone: "智",
    keyword: "智慧 · 思虑 · 变动",
    personality: "脑子转得快，善谋划、爱思考，但也容易想太多、神经紧绷。",
    career: "适合策划、研究、咨询、技术类脑力工作，点子多但需执行力搭档。",
    relationship: "心思细腻敏感，需要伴侣给安全感，忌冷战与猜心。",
  },
  {
    name: "太阳",
    element: "火",
    tone: "阳",
    keyword: "光明 · 博爱 · 付出",
    personality: "热情慷慨、乐于助人，像太阳一样发光，但也容易因过度付出而疲惫。",
    career: "适合公关、教育、传播、公职，曝光度越高越旺。",
    relationship: "感情中付出型，需学会爱自己，别把燃烧自己当理所当然。",
  },
  {
    name: "武曲",
    element: "金",
    tone: "财",
    keyword: "财星 · 刚毅 · 行动",
    personality: "务实果断、重承诺，做事一板一眼，财商高但有时显得硬。",
    career: "适合金融、财务、军警、工程，靠专业与执行力立身。",
    relationship: "不擅甜言蜜语，用行动表达爱，伴侣需读懂沉默里的责任。",
  },
  {
    name: "天同",
    element: "水",
    tone: "福",
    keyword: "福星 · 随和 · 享受",
    personality: "性情温和、知足常乐，有人情味，但也容易懒散、逃避压力。",
    career: "适合服务、文创、休闲类工作，氛围轻松比高薪更重要。",
    relationship: "感情里追求舒服自在，怕争吵，需要一个能一起松弛的人。",
  },
  {
    name: "廉贞",
    element: "火",
    tone: "烈",
    keyword: "次桃花 · 刚烈 · 原则",
    personality: "爱恨分明、有原则有魅力，像带刺的玫瑰，人缘好但也易招是非。",
    career: "适合公关、法律、艺术、销售，靠人际手腕与个人魅力破局。",
    relationship: "桃花旺但专一，占有欲强，感情里要的是绝对忠诚。",
  },
  {
    name: "天府",
    element: "土",
    tone: "府",
    keyword: "库星 · 稳重 · 包容",
    personality: "宽厚稳重、有容人之量，像府库一样让人安心，但也偏保守。",
    career: "适合财务、行政、后勤、管理，守成能力强，是团队定海神针。",
    relationship: "给人安全感，感情稳定长久，但偶尔需主动制造浪漫。",
  },
  {
    name: "太阴",
    element: "水",
    tone: "阴",
    keyword: "月亮 · 温柔 · 田宅",
    personality: "细腻内敛、重感情、有艺术气质，像月亮一样温柔，但情绪易起伏。",
    career: "适合设计、护理、房产、文职，在安稳环境里发光。",
    relationship: "渴望被温柔以待，家庭观念重，需要情绪稳定的伴侣。",
  },
  {
    name: "贪狼",
    element: "木",
    tone: "欲",
    keyword: "桃花 · 多才 · 欲望",
    personality: "多才多艺、好奇心强、交际手腕高，欲望旺盛，什么都想试。",
    career: "适合娱乐、营销、创业、多面手岗位，靠魅力与应变赚钱。",
    relationship: "桃花重，感情经历丰富，定下来前需先想清楚自己要什么。",
  },
  {
    name: "巨门",
    element: "水",
    tone: "暗",
    keyword: "口舌 · 洞察 · 是非",
    personality: "口才好、洞察力强、敢言，但也容易因直言惹是非、口舌纠纷。",
    career: "适合律师、教师、主持、评论，靠嘴和脑子吃饭。",
    relationship: "说话直是把双刃剑，伴侣需懂你刀子嘴下的豆腐心。",
  },
  {
    name: "天相",
    element: "水",
    tone: "印",
    keyword: "印星 · 协调 · 辅佐",
    personality: "正直随和、善于协调，像宰相一样辅佐他人，但有时缺乏主见。",
    career: "适合助理、HR、调解、服务型领导，是天生的二把手。",
    relationship: "体贴顾家，感情里甘当配角，但别总委屈自己成全别人。",
  },
  {
    name: "天梁",
    element: "土",
    tone: "荫",
    keyword: "荫星 · 老成 · 逢凶化吉",
    personality: "成熟稳重、有长者风范、爱照顾人，逢凶化吉但也爱说教。",
    career: "适合医疗、教育、公益、顾问，越老越吃香。",
    relationship: "像长辈一样呵护伴侣，但注意别把关心变成唠叨。",
  },
  {
    name: "七杀",
    element: "金",
    tone: "杀",
    keyword: "将星 · 独立 · 冲劲",
    personality: "独立果决、敢闯敢拼、行动力强，像将军一样冲锋，但也孤独。",
    career: "适合军警、创业、开拓型岗位，乱世出英雄，适合打江山。",
    relationship: "感情里强势直接，需要能并肩作战的伴侣，忌拖泥带水。",
  },
  {
    name: "破军",
    element: "水",
    tone: "耗",
    keyword: "耗星 · 变革 · 颠覆",
    personality: "叛逆不羁、爱打破规则、求新求变，先破后立是人生常态。",
    career: "适合改革、创业、先锋型工作，不适合一成不变的岗位。",
    relationship: "感情里轰轰烈烈，爱恨都极端，需要能接住你跌宕的人。",
  },
];

/**
 * 年干 → 四化（星名索引）。
 * 文昌/文曲/左辅/右弼等非十四正曜，归并到气质相近的主星，
 * 并保证每干四颗四化星互不重复。
 */
const HUA_TABLE: Record<string, { lu: number; quan: number; ke: number; ji: number }> = {
  甲: { lu: 5, quan: 13, ke: 3, ji: 2 }, // 廉禄 破权 武科 阳忌
  乙: { lu: 1, quan: 11, ke: 0, ji: 7 }, // 机禄 梁权 紫科 阴忌
  丙: { lu: 4, quan: 1, ke: 2, ji: 5 }, // 同禄 机权 阳科(代文昌) 廉忌
  丁: { lu: 7, quan: 4, ke: 1, ji: 9 }, // 阴禄 同权 机科 巨忌
  戊: { lu: 8, quan: 7, ke: 2, ji: 1 }, // 贪禄 阴权 阳科 机忌
  己: { lu: 3, quan: 8, ke: 11, ji: 7 }, // 武禄 贪权 梁科 阴忌
  庚: { lu: 2, quan: 3, ke: 7, ji: 4 }, // 阳禄 武权 阴科 同忌
  辛: { lu: 9, quan: 2, ke: 10, ji: 1 }, // 巨禄 阳权 相科(代文曲) 机忌(代文昌)
  壬: { lu: 11, quan: 0, ke: 6, ji: 3 }, // 梁禄 紫权 府科 武忌
  癸: { lu: 13, quan: 9, ke: 7, ji: 8 }, // 破禄 巨权 阴科 贪忌
};

/** 天干（用于年干查表） */
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

/** 确定性伪随机数生成（mulberry32） */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 排盘入口
 * @param date YYYY-MM-DD
 * @param hourBranch 时辰地支索引 0-11（未知时用 0 近似）
 */
export function computeZiwei(date: string, hourBranch?: number): ZiweiChart {
  const [year, month, day] = date.split("-").map(Number);
  const hour = typeof hourBranch === "number" ? hourBranch : 0;

  // 种子：年月日时
  const seed = year * 10000 + month * 100 + day + hour * 37;
  const rand = mulberry32(seed);

  // 命宫位置：（月 + 时辰）mod 12
  const lifePalace = (month + hour) % 12;

  // 年干
  const stem = STEMS[(year - 4) % 10];

  // 洗牌 14 主星
  const starOrder = [...Array(14).keys()];
  for (let i = starOrder.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [starOrder[i], starOrder[j]] = [starOrder[j], starOrder[i]];
  }

  // 前 12 颗各占一宫
  const palaces: Palace[] = PALACES.map((name, i) => ({
    name,
    theme: PALACE_THEMES[name],
    stars: [starOrder[i]],
    isLife: i === lifePalace,
  }));
  // 剩余 2 颗随机加入两宫（双星组合）
  palaces[starOrder[12] % 12].stars.push(starOrder[12]);
  const extraPalace = (starOrder[13] + 1) % 12;
  if (!palaces[extraPalace].stars.includes(starOrder[13])) {
    palaces[extraPalace].stars.push(starOrder[13]);
  }

  // 四化
  const hua = HUA_TABLE[stem];
  palaces.forEach((p) => {
    if (p.stars.includes(hua.lu)) p.hua = "禄";
    else if (p.stars.includes(hua.quan)) p.hua = "权";
    else if (p.stars.includes(hua.ke)) p.hua = "科";
    else if (p.stars.includes(hua.ji)) p.hua = "忌";
  });

  const lifeStar = palaces[lifePalace].stars[0];

  return { palaces, lifeStar, stem };
}

/** 四化样式 */
export const HUA_STYLE: Record<HuaType, { label: string; className: string }> = {
  禄: { label: "化禄", className: "bg-jade/15 text-jade ring-jade/30" },
  权: { label: "化权", className: "bg-violet-400/15 text-violet-400 ring-violet-400/30" },
  科: { label: "化科", className: "bg-gold-500/15 text-gold-500 ring-gold-500/30" },
  忌: { label: "化忌", className: "bg-cinnabar/15 text-cinnabar ring-cinnabar/30" },
};
