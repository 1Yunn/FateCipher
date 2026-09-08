"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw, Share2, Sparkles } from "lucide-react";
import { useState } from "react";

import { RitualOverlay } from "@/components/ritual-overlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const RITUAL_LINES = ["凝神 · 聚意", "洗牌 · 切牌", "翻牌 · 显象"];

const QUESTIONS = [
  "最近的事业方向清晰吗？",
  "这段关系会往哪走？",
  "该不该抓住这个机会？",
  "内心的犹豫来自哪里？",
  "接下来三个月的重点是什么？",
] as const;

type Arcana = {
  name: string;
  numeral: string;
  keyword: string;
  element: "风" | "水" | "火" | "土" | "灵";
  upright: string;
  reversed: string;
};

/** 22 张大阿卡那 · 正逆位解读 */
const MAJOR_ARCANA: Arcana[] = [
  {
    name: "愚人",
    numeral: "0",
    keyword: "新的开始 · 无畏",
    element: "风",
    upright: "像站在悬崖边的旅人，眼底只有远方。此刻你被允许不计后果地出发，无论旁人怎么说。",
    reversed: "鲁莽取代了勇气。出发前忘了问自己一句：去哪里？为何而去？",
  },
  {
    name: "魔术师",
    numeral: "I",
    keyword: "行动力 · 创造",
    element: "灵",
    upright: "桌上的四大元素都已备齐。你拥有把想法变成现实的所有工具，现在缺的只是举手。",
    reversed: "能力在线，但方向散了。你正在同时开启太多扇门，反而一扇也没走进去。",
  },
  {
    name: "女祭司",
    numeral: "II",
    keyword: "直觉 · 潜意识",
    element: "水",
    upright: "身后那道帷幕之后，有答案在等你。少问外界，多听内心——它其实已经知道。",
    reversed: "你过度依赖直觉而忽略了事实。感受是路标，不是终点。",
  },
  {
    name: "皇后",
    numeral: "III",
    keyword: "丰盛 · 成长",
    element: "土",
    upright: "麦田正在抽穗。你的付出正在以看不见的方式生根，耐心再等等，收成会来。",
    reversed: "丰盛背后藏着消耗。你是不是在给所有人的同时，忘了给自己留一份？",
  },
  {
    name: "皇帝",
    numeral: "IV",
    keyword: "掌控 · 秩序",
    element: "火",
    upright: "你正在建立一个属于自己的结构。规则不是束缚，是你把自己立起来的骨架。",
    reversed: "你抓得太紧了。掌控过头变成控制，身边的人开始想逃。",
  },
  {
    name: "教皇",
    numeral: "V",
    keyword: "指引 · 信念",
    element: "土",
    upright: "有人愿意为你点一盏灯。可能是师长、文字、或一段偶然听到的对话——留心它。",
    reversed: "你正在与某套既定规则较劲。问自己：是不合适，还是只是不想被管？",
  },
  {
    name: "恋人",
    numeral: "VI",
    keyword: "选择 · 关系",
    element: "风",
    upright: "面前有一个需要「真心选择」的时刻。不是对错，而是你愿意承担哪一种后果。",
    reversed: "选择悬而未决，你正在用拖延回避一个其实早就有了的答案。",
  },
  {
    name: "战车",
    numeral: "VII",
    keyword: "意志 · 前进",
    element: "水",
    upright: "两股相反的力量被你握在同一条缰绳上。不必二选一，往前走，它们会自己和解。",
    reversed: "方向有了，马力没了。你看起来在冲，其实只是原地空转。",
  },
  {
    name: "力量",
    numeral: "VIII",
    keyword: "内在力量 · 柔韧",
    element: "火",
    upright: "你以为自己没力量，其实只是力量还没被叫出来。它不在拳头里，在不退这一步里。",
    reversed: "自我怀疑正在消耗你。你看到的「不够」，其实只是还没长成。",
  },
  {
    name: "隐士",
    numeral: "IX",
    keyword: "独处 · 内省",
    element: "土",
    upright: "是时候一个人待会儿了。不是逃避，是把自己从噪声里捞回来，重新听清楚。",
    reversed: "孤独变成了隔绝。一个人待久了，连自己也开始变得陌生。",
  },
  {
    name: "命运之轮",
    numeral: "X",
    keyword: "转折 · 周期",
    element: "灵",
    upright: "轮子转到了一个新位置。你以为的「突然」，其实已经转了很久，只是现在你才看见。",
    reversed: "轮子卡住了。不是没在转，是你一直在抵抗它的方向。",
  },
  {
    name: "正义",
    numeral: "XI",
    keyword: "因果 · 平衡",
    element: "风",
    upright: "之前播的种子现在回来结果。好消息是：你得到的，正是你该得的。",
    reversed: "心里那杆秤歪了。你是不是在为别人扛了不属于自己的账？",
  },
  {
    name: "倒吊人",
    numeral: "XII",
    keyword: "视角 · 放下",
    element: "水",
    upright: "倒过来看，世界反而清楚了。你正在经历的「停滞」，其实是一次视角的更换。",
    reversed: "该放手的没放。你在为一种已经不成立的可能，反复付出代价。",
  },
  {
    name: "死神",
    numeral: "XIII",
    keyword: "结束 · 转化",
    element: "水",
    upright: "一扇门正在关上，且不必去拦。它关上，是因为有另一扇门需要空出位置。",
    reversed: "你正在拖延一个早就该结束的事情。不是放不下它，是怕放下之后的空。",
  },
  {
    name: "节制",
    numeral: "XIV",
    keyword: "融合 · 调和",
    element: "火",
    upright: "两股看起来冲突的东西，正在你这里慢慢长成一种。不急，调和需要时间。",
    reversed: "失衡了。你把太多东西塞进同一段时间，忘了它们本来需要各自的节奏。",
  },
  {
    name: "恶魔",
    numeral: "XV",
    keyword: "执念 · 束缚",
    element: "土",
    upright: "你看得见那条链子，但锁其实没上。束缚你的不是外界，是你认定了它锁着。",
    reversed: "执念开始松动了。你终于承认：这件事，没有你以为的那么必要。",
  },
  {
    name: "高塔",
    numeral: "XVI",
    keyword: "突变 · 打破",
    element: "火",
    upright: "一道闪电劈下来，劈的是早就该塌的那堵墙。疼，但塌完之后，光能进来了。",
    reversed: "震动还在进行，但你已经能站稳了。你正在从一场意外里慢慢走出来。",
  },
  {
    name: "星星",
    numeral: "XVII",
    keyword: "希望 · 信念",
    element: "水",
    upright: "雨过之后，天上有一盏很弱的灯。它的弱不代表不在，反而是它一直在的证明。",
    reversed: "希望变成了空想。你信的是「会好」，但没在为「会好」做任何事。",
  },
  {
    name: "月亮",
    numeral: "XVIII",
    keyword: "迷茫 · 潜意识",
    element: "水",
    upright: "雾还没散，但你比白天看得更清楚——因为现在你看见了白天看不见的东西。",
    reversed: "焦虑正在放大影子。你害怕的事，大部分其实没发生。",
  },
  {
    name: "太阳",
    numeral: "XIX",
    keyword: "成功 · 光明",
    element: "火",
    upright: "一段事情到了能晒太阳的时刻。不必再藏、不必再忍，让它出来见见光。",
    reversed: "光太强反而刺眼。你以为的「全都好」，可能是在躲一些没处理的事。",
  },
  {
    name: "审判",
    numeral: "XX",
    keyword: "觉醒 · 重生",
    element: "火",
    upright: "号角响了。不是要罚你，是要叫醒你——该起来，去下一个地方了。",
    reversed: "你正在反复回头审一段已经结过的账。该放下了，它已经判完了。",
  },
  {
    name: "世界",
    numeral: "XXI",
    keyword: "圆满 · 完成",
    element: "土",
    upright: "一个完整的圆画上了。这不是结束，是你终于可以合上这一页，开始下一章的时刻。",
    reversed: "差最后一笔。你一直没合上，是因为怕合上之后就真的结束了。",
  },
];

const POSITIONS = ["过去", "现在", "趋势"] as const;

const POSITION_MEANING = [
  "它从哪里来",
  "它此刻的样子",
  "它正在往哪走",
] as const;

const ELEMENT_SYMBOL: Record<Arcana["element"], string> = {
  风: "△",
  水: "▽",
  火: "△",
  土: "▽",
  灵: "✦",
};

type DrawnCard = {
  index: number;
  reversed: boolean;
};

function drawCards(): DrawnCard[] {
  const indices = [...Array(MAJOR_ARCANA.length).keys()];
  // Fisher-Yates 抽 3 张
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, 3).map((index) => ({
    index,
    reversed: Math.random() < 0.35,
  }));
}

/** 把一张牌在某位置的解读拼成一段通顺的话 */
function cardReading(card: DrawnCard, positionIndex: number): string {
  const arcana = MAJOR_ARCANA[card.index];
  const position = POSITIONS[positionIndex];
  const orientation = card.reversed ? "逆位" : "正位";
  const text = card.reversed ? arcana.reversed : arcana.upright;
  return `【${position}位 · ${arcana.name}（${orientation}）】 ${text}`;
}

/** 综合三张牌写成一段连贯的解读 */
function spreadSummary(drawn: DrawnCard[]): string {
  const [a, b, c] = drawn.map((d) => MAJOR_ARCANA[d.index]);
  const [ra, rb, rc] = drawn.map((d) => d.reversed);

  const aWord = ra ? a.reversed : a.upright;
  const bWord = rb ? b.reversed : b.upright;
  const cWord = rc ? c.reversed : c.upright;

  return `从过去到趋势，三张牌串成一条线。${a.name}说过去——${aWord}；${b.name}落在此刻——${bWord}；${c.name}指向未来——${cWord}。这不是预言，牌不会替你做决定，它只是把你自己已经知道、但还没说出口的那句话，摆到你面前。`;
}

export function TarotFlow() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0); // 0=选问题, 2=结果
  const [question, setQuestion] = useState("");
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [interpretation, setInterpretation] = useState<string[]>([]);
  const [ritual, setRitual] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);

  const startReading = () => {
    if (!question.trim()) return;
    setRitual(true);
  };

  const handleRitualComplete = () => {
    const cards = drawCards();
    setDrawn(cards);
    setInterpretation(cards.map((c, i) => cardReading(c, i)));
    setRitual(false);
    setStep(2);
    setRevealed([false, false, false]);
  };

  const revealCard = (i: number) => {
    setRevealed((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const reset = () => {
    setStep(0);
    setQuestion("");
    setDrawn([]);
    setInterpretation([]);
    setRevealed([false, false, false]);
  };

  return (
    <>
      <div className="glass mt-10 rounded-3xl p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium">你想问什么？</p>
              <p className="mt-1 text-xs text-muted-foreground">
                选一个最接近你此刻心境的问题，或者自己写一个。
              </p>
            </div>
            <div className="space-y-2.5">
              {QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuestion(q)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left text-[14px] transition-all duration-200",
                    question === q
                      ? "border-foreground/60 bg-foreground/[0.06] text-foreground"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:border-border hover:bg-background/60",
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
            <div>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="或自己写一个问题…"
                className="w-full rounded-xl glass px-4 py-3 text-[15px] outline-none transition-shadow placeholder:text-muted-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <Button
              size="lg"
              className="w-full"
              disabled={!question.trim()}
              onClick={startReading}
            >
              开始抽牌
              <Sparkles className="ml-1.5 size-4" aria-hidden />
            </Button>
          </div>
        )}

        {step === 2 && drawn.length === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* 问题回显 */}
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50">
                你的问题
              </p>
              <p className="mt-1.5 font-serif text-[14px] italic leading-relaxed text-foreground/80">
                {question}
              </p>
            </div>

            {/* 牌阵位置说明 */}
            <div className="grid grid-cols-3 gap-3 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
              {POSITION_MEANING.map((m, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="font-medium text-foreground/70">{POSITIONS[i]}</p>
                  <p>{m}</p>
                </div>
              ))}
            </div>

            {/* 三张牌 */}
            <div className="flex items-start justify-center gap-4 sm:gap-8">
              {drawn.map((card, i) => {
                const arcana = MAJOR_ARCANA[card.index];
                const isRevealed = revealed[i];
                return (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => revealCard(i)}
                    disabled={isRevealed}
                    className="group flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5, ease: EASE_OUT }}
                  >
                    {/* 牌面 */}
                    <div
                      className={cn(
                        "relative flex h-[200px] w-[130px] items-center justify-center rounded-xl border transition-all duration-500",
                        isRevealed
                          ? "border-foreground/20 bg-card/90 shadow-[0_4px_24px_-8px_rgba(109,90,224,0.12)]"
                          : "border-border/60 bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_32px_-12px_rgba(109,90,224,0.15)]",
                      )}
                      style={{ perspective: "800px" }}
                    >
                      <motion.div
                        className="relative h-full w-full"
                        animate={{ rotateY: isRevealed ? 180 : 0 }}
                        transition={{ duration: 0.7, ease: EASE_OUT }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* 牌背 */}
                        <div
                          className="absolute inset-0 flex items-center justify-center rounded-xl"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <div className="relative size-16">
                            {/* 几何图腾 */}
                            <div className="absolute inset-0 rounded-full border border-foreground/15" />
                            <div className="absolute inset-[18%] rounded-full border border-foreground/20" />
                            <div className="absolute inset-[36%] rounded-full border border-foreground/25" />
                            <span className="absolute inset-0 flex items-center justify-center font-serif text-lg text-muted-foreground/40">
                              ✦
                            </span>
                          </div>
                        </div>
                        {/* 牌面 */}
                        <div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          {/* 逆位时内容整体旋转 180° */}
                          <div
                            className={cn(
                              "flex h-full w-full flex-col items-center justify-between rounded-xl px-2 py-3",
                              card.reversed && "[transform:rotate(180deg)]",
                            )}
                          >
                            {/* 顶部数字 */}
                            <div className="flex w-full items-center justify-between px-1">
                              <span className="font-serif text-[10px] text-muted-foreground/60">
                                {arcana.numeral}
                              </span>
                              <span className="text-[10px] text-muted-foreground/50">
                                {ELEMENT_SYMBOL[arcana.element]}
                              </span>
                            </div>
                            {/* 牌名 */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-serif text-base font-medium text-foreground">
                                {arcana.name}
                              </span>
                              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
                                {card.reversed ? "逆位" : "正位"}
                              </span>
                            </div>
                            {/* 底部关键词 */}
                            <span className="text-[9px] tracking-[0.1em] text-muted-foreground/40">
                              {arcana.keyword.split(" · ")[0]}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    {/* 位置标签 */}
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                      {POSITIONS[i]}
                    </span>
                    {/* 解读 */}
                    <AnimatePresence>
                      {isRevealed && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="max-w-[140px] text-center text-[11px] leading-relaxed text-muted-foreground"
                        >
                          {interpretation[i]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {!isRevealed && (
                      <span className="text-[10px] text-muted-foreground/40 group-hover:text-muted-foreground/60">
                        点击翻牌
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* 全部翻开后显示综合解读 */}
            <AnimatePresence>
              {revealed.every(Boolean) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50">
                      牌阵综合
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                      {spreadSummary(drawn)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" size="lg" onClick={reset}>
                      <RotateCcw className="mr-1.5 size-4" aria-hidden />
                      再问一次
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        const text = [
                          `问题：${question}`,
                          ...interpretation,
                          "",
                          spreadSummary(drawn),
                          "",
                          "— FateCipher · 仅供娱乐",
                        ].join("\n");
                        if (navigator.share) {
                          navigator
                            .share({ title: "我的塔罗牌阵", text })
                            .catch(() => {});
                        } else {
                          navigator.clipboard?.writeText(text);
                        }
                      }}
                    >
                      <Share2 className="mr-1.5 size-4" aria-hidden />
                      复制解读
                    </Button>
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground/40">
                    内容由牌面关键词生成，仅供娱乐参考，不构成任何决策建议。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <RitualOverlay
        open={ritual}
        lines={RITUAL_LINES}
        onComplete={handleRitualComplete}
        minDuration={2400}
      />
    </>
  );
}
