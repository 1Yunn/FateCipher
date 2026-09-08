"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EASE_OUT, SectionHeading, SectionFullBleed, itemBlurIn, itemDrawLine, itemBounceIn } from "@/components/home/shared";
import { cn } from "@/lib/utils";

const REPORT_CHAPTERS = [
  "个性分析",
  "事业建议",
  "财富趋势",
  "感情建议",
  "健康提醒",
  "行动建议",
  "年度趋势",
] as const;

// 每章的摘要示例内容
const CHAPTER_SUMMARIES: Record<string, string> = {
  个性分析:
    "你的命局以木为主气，性格里有明显的生长感：认定方向就持续投入，遇到阻力则习惯先向内消化。优势在于长期主义与复原力；需要留意的盲区是节奏感——容易在顺境里加速过猛，在逆境里收得太久。",
  事业建议:
    "适合探索型岗位，当前阶段成长机会大于稳定收益。未来一年重点提升管理能力，优先选择能够积累长期竞争力的平台。",
  财富趋势:
    "进财节奏稳中有升，今年下半年有一次明显的机会窗口。注意避免情绪化消费，建立至少三个月的蓄水池。",
  感情建议:
    "你的命局在感情上偏向慢热但持久。适合能理解你内收节奏的伴侣。今年是关系深化的关键年。",
  健康提醒:
    "木气偏旺容易肝郁，注意情绪排解。建议保持每周三次有氧运动，少熬夜。",
  行动建议:
    "1. 优先选择有成长空间的平台；2. 建立每日复盘习惯；3. 每周至少一次深度对话；4. 减少冲动决策。",
  年度趋势:
    "今年整体前低后高，Q3 是转折点。重要决策建议放在秋分之后。贵人方向在西北。",
};

const ELEMENT_BARS = [
  { name: "木", value: 78, tint: "bg-jade" },
  { name: "火", value: 64, tint: "bg-cinnabar" },
  { name: "土", value: 41, tint: "bg-gold-500" },
  { name: "金", value: 32, tint: "bg-porcelain" },
  { name: "水", value: 55, tint: "bg-violet-400" },
] as const;

/** 数字滚动：0 → value，进度条宽度展开时同步滚动 */
function CountUp({ value, delay }: { value: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 0.9,
      ease: EASE_OUT,
      delay,
    });
    return controls.stop;
  }, [inView, value, delay, mv]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {rounded}
    </motion.span>
  );
}

/** 章节容器：淡入 + 整体上移 */
const chapterWrap: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1, duration: 0.15 },
  },
};

/** 标题：mask reveal 从下方揭开 */
const titleReveal: Variants = {
  hidden: { opacity: 0, y: 14, clipPath: "inset(0 0 100% 0)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 0.5, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    clipPath: "inset(100% 0 0 0)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

/** 徽章：缩放 + 淡入 */
const badgePop: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: EASE_OUT, delay: 0.1 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};

/** 正文：模糊 → 清晰 + 上浮 */
const bodyBlur: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT, delay: 0.15 },
  },
  exit: { opacity: 0, y: -6, filter: "blur(4px)", transition: { duration: 0.18 } },
};

/** ⑤ 报告预览：点击目录切换章节内容 */
export function ReportPreview() {
  const reduceMotion = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(0);

  return (
    <SectionFullBleed id="report">
      <SectionHeading
        eyebrow="Report"
        title="一次测算，你会得到什么"
        subtitle="一份结构完整、可以反复阅读的个人报告。以下为内容示例。"
      />

      <motion.div
        variants={itemBlurIn}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        className="relative mx-auto mt-14 max-w-5xl"
      >
        <div
          aria-hidden
          className="absolute -inset-8 rounded-[3rem] bg-violet-500/[0.05] blur-3xl"
        />
        <div className="relative">
          <div className="grid overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/40 backdrop-blur-2xl md:grid-cols-[220px_1fr]">
            {/* 目录 */}
            <nav
              aria-label="报告目录示例"
              className="border-b border-border/60 p-6 md:border-b-0 md:border-r"
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                报告目录
              </p>
              <ul className="mt-4 space-y-1">
                {REPORT_CHAPTERS.map((chapter, index) => {
                  const active = activeChapter === index;
                  return (
                    <li key={chapter}>
                      <button
                        type="button"
                        onClick={() => setActiveChapter(index)}
                        aria-current={active}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-all duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          active
                            ? "bg-gold-500/10 text-gold-400"
                            : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
                        )}
                      >
                        <motion.span
                          animate={{ x: active ? 2 : 0 }}
                          transition={{ duration: 0.3, ease: EASE_OUT }}
                          className="flex items-center gap-2.5"
                        >
                          <FileText
                            className={cn(
                              "size-3.5 shrink-0 transition-colors",
                              active ? "text-gold-400" : "text-muted-foreground/50",
                            )}
                            aria-hidden
                          />
                          <span className={cn(active && "font-medium")}>{chapter}</span>
                        </motion.span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* 内容区 */}
            <div className="p-6 sm:p-8">
              {/* 章节摘要：点击目录切换，分阶入场动画 */}
              <div className="relative min-h-[160px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChapter}
                    variants={chapterWrap}
                    initial={reduceMotion ? "show" : "hidden"}
                    animate="show"
                    exit="exit"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <motion.h3
                        variants={titleReveal}
                        className="text-sm font-medium"
                      >
                        {REPORT_CHAPTERS[activeChapter]} · 摘要
                      </motion.h3>
                      <motion.div variants={badgePop}>
                        <Badge variant="outline">示例内容</Badge>
                      </motion.div>
                    </div>
                    <motion.p
                      variants={bodyBlur}
                      className="mt-4 text-[13px] leading-relaxed text-muted-foreground"
                    >
                      {CHAPTER_SUMMARIES[REPORT_CHAPTERS[activeChapter]]}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 五行条形图 —— 独立区域，不被覆盖 */}
              {/* key 依赖 activeChapter，切换章节时重新挂载，触发填充+数字滚动动画 */}
              <div key={activeChapter} className="mt-7 space-y-3">
                {ELEMENT_BARS.map((bar, index) => (
                  <div key={bar.name} className="flex items-center gap-3">
                    <span className="w-4 shrink-0 font-serif text-xs text-muted-foreground">
                      {bar.name}
                    </span>
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.value}%` }}
                        viewport={{ once: false }}
                        transition={{
                          duration: 0.9,
                          ease: EASE_OUT,
                          delay: 0.15 + index * 0.08,
                        }}
                        className={cn("relative h-full overflow-hidden rounded-full", bar.tint)}
                      >
                        {/* 光泽流过 */}
                        <motion.span
                          aria-hidden
                          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "300%" }}
                          transition={{
                            duration: 2,
                            ease: "linear",
                            repeat: Infinity,
                            delay: 1 + index * 0.3,
                          }}
                        />
                      </motion.div>
                    </div>
                    <span className="w-8 shrink-0 text-right font-mono text-[11px] text-muted-foreground/70 tabular-nums">
                      <CountUp value={bar.value} delay={0.15 + index * 0.08} />
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-7 flex items-center gap-2 text-[11px] text-muted-foreground/60">
                <Sparkles className="size-3" aria-hidden />
                共 7 章 · 生成约需 30 秒 · 数据仅保存在你的浏览器
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemBounceIn}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false }}
        className="mt-12 flex justify-center"
      >
        <Button asChild size="lg">
          <Link href="/fortune/bazi">生成我的第一份报告</Link>
        </Button>
      </motion.div>
    </SectionFullBleed>
  );
}
