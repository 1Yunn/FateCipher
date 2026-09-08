"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, Check, LoaderCircle, Sparkle, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  EASE_OUT,
  Section,
  SectionHeading,
  container,
  item,
} from "@/components/home/shared";
import { cn } from "@/lib/utils";

const QUESTION = "最近拿到了两个 Offer，不知道哪一个更适合长期发展？";

const ANALYZING_STEPS = [
  "分析命盘结构",
  "定位人生阶段",
  "解读五行趋势",
  "结合职业方向",
] as const;

const AI_POINTS = [
  { label: "当前阶段", text: "成长机会大于稳定收益。" },
  { label: "适合", text: "探索型岗位。" },
  { label: "未来一年", text: "重点提升管理能力。" },
  { label: "建议", text: "优先选择能够积累长期竞争力的平台。" },
] as const;

const REPORT_CHIPS = [
  "事业分析",
  "感情分析",
  "财富趋势",
  "成长建议",
  "行动建议",
] as const;

const reply: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const replyLine: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

/** 真实使用案例：照片 + 提问 → AI 分析 → 结论要点 → 报告预告 */
export function CaseStudy() {
  const reduceMotion = useReducedMotion();
  const flowRef = useRef<HTMLDivElement>(null);
  const flowInView = useInView(flowRef, { once: false, margin: "-120px" });
  const [doneSteps, setDoneSteps] = useState(
    reduceMotion ? ANALYZING_STEPS.length : 0
  );

  useEffect(() => {
    if (!flowInView || reduceMotion) return;
    const timers = ANALYZING_STEPS.map((_, index) =>
      window.setTimeout(() => setDoneSteps(index + 1), 800 + index * 750)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [flowInView, reduceMotion]);

  const analyzing = doneSteps < ANALYZING_STEPS.length;

  return (
    <Section>
      <SectionHeading
        eyebrow="Real Story"
        title="看一位用户怎么问"
        subtitle="从一个真实的问题，到一份可以执行的参考——全程约三分钟。"
      />

      {/* AI 对话流：居中单栏 */}
      <div ref={flowRef} className="mx-auto mt-14 flex max-w-2xl flex-col gap-4">
          {/* 用户消息：右侧真实头像，模拟真实对话 */}
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-100px" }}
            className="flex items-center justify-end gap-3"
          >
            <p className="max-w-[90%] rounded-2xl rounded-br-sm border border-gold-500/25 bg-gold-500/15 px-4 py-3 text-[15px] leading-relaxed">
              {QUESTION}
            </p>
            <span className="flex size-[82px] shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] ring-1 ring-gold-500/25">
              <Image
                src="/story-avatar.png"
                alt="提问用户头像"
                width={164}
                height={164}
                unoptimized
                className="size-full object-cover object-top"
              />
            </span>
          </motion.div>

          {/* AI 分析中 */}
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-100px" }}
            className="flex gap-3"
          >
            <AssistantMark />
            <div className="glass w-full max-w-xl rounded-2xl rounded-bl-sm px-5 py-4">
              <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                {analyzing ? (
                  <LoaderCircle
                    className="size-3.5 animate-spin text-violet-400"
                    aria-hidden
                  />
                ) : (
                  <Check className="size-3.5 text-jade" aria-hidden />
                )}
                {analyzing ? "AI 正在分析" : "分析完成"}
              </p>
              <ul className="mt-3 space-y-2.5" aria-label="分析步骤">
                {ANALYZING_STEPS.map((stepLabel, index) => {
                  const done = doneSteps > index;
                  const active = doneSteps === index;
                  return (
                    <li
                      key={stepLabel}
                      className={cn(
                        "flex items-center gap-2.5 text-[13px] transition-opacity duration-300",
                        done || active
                          ? "text-foreground"
                          : "text-muted-foreground/40"
                      )}
                    >
                      {done ? (
                        <Check className="size-3.5 shrink-0 text-jade" aria-hidden />
                      ) : active ? (
                        <LoaderCircle
                          className="size-3.5 shrink-0 animate-spin text-violet-400"
                          aria-hidden
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="size-3.5 shrink-0 rounded-full border border-border"
                        />
                      )}
                      {stepLabel}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* AI 回复 */}
          <motion.div
            variants={reply}
            initial={reduceMotion ? "show" : "hidden"}
            animate={analyzing ? "hidden" : "show"}
            className="flex gap-3"
          >
            <AssistantMark />
            <div className="glass w-full max-w-xl rounded-2xl rounded-bl-sm px-5 py-4">
              <div className="space-y-3">
                {AI_POINTS.map((point) => (
                  <motion.p
                    key={point.label}
                    variants={replyLine}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14px] leading-relaxed"
                  >
                    <span className="min-w-16 text-xs text-gold-400/90">
                      {point.label}
                    </span>
                    <span className="flex-1">{point.text}</span>
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
      </div>

      {/* 下方：报告预告条 */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        className="mx-auto mt-8 max-w-5xl"
      >
        <motion.div
          variants={item}
          className="flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-border/60 bg-card/40 px-6 py-5 backdrop-blur-2xl sm:flex-row"
        >
          <p className="text-[13px] text-muted-foreground">
            完整报告还包含以下章节
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {REPORT_CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {chip}
              </li>
            ))}
          </ul>
          <a
            href="#report"
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-400 outline-none transition-colors hover:text-gold-300 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            查看报告示例
            <ArrowDown
              className="size-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden
            />
          </a>
        </motion.div>
      </motion.div>
    </Section>
  );
}

function AssistantMark() {
  return (
    <span
      aria-hidden
      className="relative mt-0.5 flex size-[82px] shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-violet-400/15 via-violet-500/10 to-violet-900/30 ring-1 ring-violet-400/30"
    >
      {/* 内部柔光 */}
      <span className="absolute size-12 rounded-full bg-violet-400/25 blur-xl" />
      {/* 顶部玻璃高光 */}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
      {/* 角落星点装饰 */}
      <Sparkle
        className="absolute right-2.5 top-2.5 size-3 text-violet-300/80"
        fill="currentColor"
      />
      <Sparkle
        className="absolute bottom-3 left-3 size-2 text-violet-300/50"
        fill="currentColor"
      />
      {/* 主星标 */}
      <Sparkles className="relative size-9 text-violet-300 drop-shadow-[0_0_10px_rgba(167,139,250,0.45)]" />
    </span>
  );
}
