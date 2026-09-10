"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import {
  SectionNarrow,
  SectionHeadingLeft,
} from "@/components/home/shared";

/** 8 条问题 × 八卦卦象 × 2×4 网格命理盘格 */
const QUESTIONS = [
  { q: "我适合换一份工作吗？", hint: "行业节奏与个人模式", trigram: "☰", label: "乾" },
  { q: "要不要继续创业？", hint: "当前阶段蓄力还是突破", trigram: "☷", label: "坤" },
  { q: "我适合哪座城市？", hint: "地域命理能量节奏", trigram: "☳", label: "震" },
  { q: "今年置业时机？", hint: "流年气运参考", trigram: "☴", label: "巽" },
  { q: "我们适合走进婚姻？", hint: "相处模式与长期节奏", trigram: "☵", label: "坎" },
  { q: "为什么最近不顺？", hint: "当前阶段的主题", trigram: "☲", label: "离" },
  { q: "我真正擅长什么？", hint: "性格底层优势盲区", trigram: "☶", label: "艮" },
  { q: "人生方向在哪里？", hint: "焦虑拆成可行动答案", trigram: "☱", label: "兑" },
] as const;

/** ③ 问题共鸣：命理盘格 × 2×4 网格 × 八卦卦象 */
export function Problems() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionNarrow>
      <div className="mx-auto max-w-4xl">
        <SectionHeadingLeft
          eyebrow="Inner Questions"
          title="这些念头，你是否也有过"
          subtitle="真正的问题从来不是「准不准」，而是你愿不愿意认真看自己一次。"
        />

        {/* 命理盘格：2 列 × 4 行 */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: false, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
          className="mt-14 grid grid-cols-2 gap-3 sm:gap-4"
        >
          {QUESTIONS.map((item, index) => (
            <motion.div
              key={item.q}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.97 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <Link
                href="#divinations"
                className="group relative block overflow-hidden rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-card hover:shadow-lg hover:shadow-gold-500/5 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {/* 序号 */}
                <span className="font-serif text-xs italic text-muted-foreground/30">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* 问题 */}
                <p className="mt-2 pr-12 text-base leading-snug font-serif text-foreground/85 transition-colors duration-300 group-hover:text-foreground sm:text-[17px]">
                  {item.q}
                </p>

                {/* 辅助说明 */}
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground/50 transition-colors duration-300 group-hover:text-muted-foreground/70">
                  {item.hint}
                </p>

                {/* 金色斜角高光 */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -bottom-8 size-20 rounded-full bg-gold-500/[0.06] blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                {/* 右下箭头 */}
                <ArrowUpRight
                  className="absolute bottom-3 right-3 size-3.5 text-muted-foreground/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-400/60"
                  aria-hidden
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionNarrow>
  );
}
