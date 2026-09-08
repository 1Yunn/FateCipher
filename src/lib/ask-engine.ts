import {
  STEMS,
  STEM_ELEMENT,
  computeBazi,
  type FiveElement,
} from "@/lib/bazi";

/** 问答主题分类 */
export type AskTopic =
  | "love"
  | "career"
  | "wealth"
  | "study"
  | "health"
  | "fortune"
  | "divination"
  | "general";

/** 带命盘档案时的个性化上下文 */
export interface AskContext {
  hasProfile: boolean;
  zodiac?: string;
  dayStem?: string;
  dayElement?: FiveElement;
  dominantElement?: FiveElement;
}

interface ProfileCtx {
  zodiac: string;
  dayStem: string;
  dayElement: FiveElement;
  dominantElement: FiveElement;
}

const PROFILE_KEY = "xuanji.profile.bazi";

/** 从本地命盘档案（八字测算页写入）构建问答上下文 */
export function loadAskContext(): AskContext {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return { hasProfile: false };
    const parsed = JSON.parse(raw) as { date?: unknown; hourBranch?: unknown };
    if (typeof parsed.date !== "string") return { hasProfile: false };
    const hour =
      typeof parsed.hourBranch === "number" ? parsed.hourBranch : undefined;
    const chart = computeBazi(parsed.date, hour);
    const dayPillar = chart.pillars.find((pillar) => pillar.key === "day");
    if (!dayPillar) return { hasProfile: false };
    const dominantElement = (
      Object.entries(chart.elements) as Array<[FiveElement, number]>
    ).sort((a, b) => b[1] - a[1])[0][0];
    return {
      hasProfile: true,
      zodiac: chart.zodiac,
      dayStem: STEMS[dayPillar.stem],
      dayElement: STEM_ELEMENT[dayPillar.stem],
      dominantElement,
    };
  } catch {
    // 本地存储不可用时静默降级
    return { hasProfile: false };
  }
}

const TOPIC_KEYWORDS: Array<[AskTopic, string[]]> = [
  [
    "love",
    [
      "姻缘", "感情", "桃花", "恋爱", "分手", "复合", "结婚", "脱单",
      "对象", "相亲", "暗恋", "告白", "他爱我", "她爱我",
    ],
  ],
  [
    "career",
    [
      "事业", "工作", "跳槽", "升职", "职场", "创业", "面试", "同事",
      "老板", "加班", "转行", "裁员", "离职",
    ],
  ],
  [
    "wealth",
    [
      "财", "钱", "投资", "生意", "收入", "副业", "股票", "基金",
      "存款", "负债", "省钱",
    ],
  ],
  [
    "study",
    [
      "学业", "考试", "考研", "升学", "学习", "论文", "考公", "考编", "上岸",
    ],
  ],
  [
    "health",
    [
      "健康", "身体", "失眠", "熬夜", "养生", "疲惫", "焦虑", "情绪", "内耗",
    ],
  ],
  [
    "fortune",
    [
      "运势", "今天", "本周", "本月", "最近", "运气", "流年", "今年", "明年",
    ],
  ],
  [
    "divination",
    [
      "塔罗", "抽牌", "牌面", "八字", "五行", "紫微", "星盘", "命盘",
      "日主", "排盘", "命理",
    ],
  ],
];

/** 识别提问主题，未命中则归为 general */
export function detectTopic(input: string): AskTopic {
  for (const [topic, keywords] of TOPIC_KEYWORDS) {
    if (keywords.some((keyword) => input.includes(keyword))) return topic;
  }
  return "general";
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** 有档案时的开场承接（随机变化，制造「真人感」） */
const PROFILED_OPENERS: Array<(ctx: ProfileCtx) => string> = [
  (ctx) =>
    `先看你的底盘：属${ctx.zodiac}的${ctx.dayElement}命人，日主${ctx.dayStem}，盘面里${ctx.dominantElement}气最旺。带着这个底子，我们再来谈你问的事。`,
  (ctx) =>
    `收到。翻出你的命盘档案：${ctx.zodiac}年命，${ctx.dayElement}日主，${ctx.dominantElement}气占上风。以下解读，都从这个盘出发。`,
  (ctx) =>
    `你属${ctx.zodiac}，日主${ctx.dayStem}${ctx.dayElement}。这个配置的人，我通常建议先看「势」在哪，再看「事」怎么办。`,
];

/** 无档案时的通用开场 */
const PLAIN_OPENERS: string[] = [
  "这个问题问得好。你还没立命盘档案，我先按通用盘面给你拆一拆。",
  "先声明：下面按大众盘面解读，仅供参考。若想听更贴身的，建议先去「八字测算」立个盘。",
];

/** 各主题的解读主体（盘面无关，配合开场与金句随机组合） */
const TOPIC_BODIES: Record<AskTopic, string> = {
  love: `关于姻缘，有三句要紧的话：

一、你的桃花不缺，缺的是让桃花落地的场合。姻缘多藏在「熟人圈的第二层」——朋友的朋友、旧同学、共事之人，而不是深夜软件里的陌生人。

二、感情节奏往往先慢后快。眼下若有暧昧不明、推进乏力，先别急着下结论；过了观望期，关系自会明朗。

三、已有伴侣的话，矛盾多半出在「陪伴的质感」而非感情本身。把期待说出口，比让对方猜有效十倍。

行动建议：未来两周多参加线下小聚，穿一点暖色提气色；遇到心动的人，从一起吃顿饭开始，别急着定义关系。`,

  career: `事业上给你三个判断：

一、你适合「手艺立身」：靠专业积累说话，比靠人情周旋走得更远。眼下的平台若还能让你长本事，就沉住气再待一程。

二、变动的窗口在季节交替之际。若真想动，提前三个月准备作品与履历，机会来了才接得住。

三、职场人际上，你的执行力是加分项，但要把话说在前头——需求、边界、功劳，都得及时摆到桌面上。

行动建议：本季度把精力收拢到一件能拿出手的事上，做成它；要不要跳槽，先面试两家试试水温，再做决定。`,

  wealth: `财运上给你三个提醒：

一、你的财属「慢财」：靠技能与时间的复利，不适合高杠杆的快钱。凡是承诺「稳赚」的项目，一律绕行。

二、支出的大头多半不在享乐，而在「为自己投资」——课程、装备、健康。这类钱该花就花，回报在后头。

三、进账的节奏像季风，有淡有旺。淡季守住现金流，旺季才有力气乘势而上。

行动建议：给自己立一条硬规矩——每月收入的一成雷打不动存起来；大额支出前先睡一觉，隔天再决定。`,

  study: `学业上给你三个判断：

一、你偏「慢热型」：第一遍看不进，第二遍才开窍。别拿别人的进度打击自己，重复就是你的捷径。

二、考运与作息强相关。睡得足，脑中水气足，思路就清；熬夜硬撑，等于自己断了文曲星的香火。

三、阶段性目标比宏大计划有用：把大考拆成月考、周清单，每完成一项就划掉，气运是一点点攒出来的。

行动建议：固定一个每天雷打不动的两小时学习时段；考前一周减少社交，让心先静下来。`,

  health: `身体上给你三个提醒：

一、你的体质偏向「思虑耗气」：累的不是身体，是心。睡前一小时离开屏幕，比任何补品都养人。

二、五行上火气浮而上、水气沉而下。熬夜是引火焚身，久坐是堵水成淤——这两件正是你当前最大的漏。

三、恢复的顺序是：先睡够，再动起来，最后才谈进补。顺序反了，都是白费功夫。

行动建议：接下来两周先把入睡时间提前半小时，午间晒十分钟太阳、走三千步，让气机自己转起来。若持续不适请及时就医，玄学不能替代医嘱。`,

  fortune: `从盘面看你的近期运势，有三条主线：

一、整体走「先抑后扬」的弧线：眼下若觉得事事慢半拍，那是在还上一程的债，还完了路自然就顺。

二、贵人运在「年长者」身上：师长、前辈、老客户，多听他们一句话，能少绕一个弯。

三、情绪是这段时间的关键变量。心稳则运稳，遇事深呼吸三次再回应，很多坑就自动绕开了。

行动建议：本周适合「收」而不是「放」——少表态、多观察；想说的话先写进备忘录，隔几天再看再发。`,

  divination: `关于命理这件事，先给你交个底：

一、八字也好、塔罗也罢，本质都是一面镜子——照的是你此刻的状态与倾向，不是铁口直断的判决书。

二、盘面真正的价值，是让你看清自己的节律：什么时候该冲，什么时候该守。读懂节律，比求签问卜实在得多。

三、命理最大的用处，是帮你在对的季节做对的事：该播种时播种，该蛰伏时蛰伏。

行动建议：与其反复问「结果如何」，不如问「此刻我该做什么」。想深挖，可以先去「八字测算」把命盘立起来，再来找我细聊。`,

  general: `你的问题我收到了。问得宽泛，我也先给你一个抓手：

一、把大问题拆小：不要问「我的人生会怎样」，先问「这个月我最想改变的一件事是什么」。天机只在具体的小事上显形。

二、留意重复出现的信号：同一件事三次敲门，就不是巧合。最近总被提起的人、总刷到的机会，值得认真看一眼。

三、当下能做的一小步，胜过十个宏大计划。运势偏爱已经在路上的人。

行动建议：今晚睡前写三行字——此刻的困扰、最想要的结果、明天能做的一件小事。写完，天机自现。`,
};

/** 金句收尾池 */
const CLOSERS: string[] = [
  "送你一句老话：「命是底牌，运是打法。牌不好，打法可以好。」",
  "最后送你四个字：静待天时。势没到之前，蓄力比强求有用。",
  "老话讲「谋事在人，成事在天」——把人的部分做足，剩下的交给天时。",
  "送你一句话：「运去金成铁，时来铁似金。」眼下的功课，是攒时运。",
];

/** 无档案时的建档引导 */
const PROFILE_GUIDE =
  "另外——你还没有命盘档案，以上按通用盘面解读。去「八字测算」花三分钟立个盘，下次的回答会贴身得多。";

/** 生成一条完整回复：开场 + 主题解读 + 金句（随机组合） */
export function buildReply(input: string, ctx: AskContext): string {
  const topic = detectTopic(input);
  const opener = ctx.hasProfile
    ? pick(PROFILED_OPENERS)({
        zodiac: ctx.zodiac ?? "",
        dayStem: ctx.dayStem ?? "",
        dayElement: ctx.dayElement ?? "土",
        dominantElement: ctx.dominantElement ?? "土",
      })
    : pick(PLAIN_OPENERS);
  const closer = pick(CLOSERS);
  const guide = ctx.hasProfile ? "" : `\n\n${PROFILE_GUIDE}`;
  return [opener, TOPIC_BODIES[topic], closer].join("\n\n") + guide;
}
