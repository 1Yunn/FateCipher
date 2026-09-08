"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import {
  SectionNarrow,
  SectionHeadingLeft,
  containerFast,
  itemRevealUp,
} from "@/components/home/shared";

const QUESTIONS = [
  "我适合换一份工作吗？",
  "要不要继续把创业做下去？",
  "我更适合哪座城市生活？",
  "今年是不是置业的时机？",
  "我们适合走进婚姻吗？",
  "为什么最近总感觉不顺？",
  "我真正擅长的是什么？",
  "我的人生方向在哪里？",
] as const;

/** ③ 问题共鸣：左对齐 + 窄容器，让问题一条条浮上来 */
export function Problems() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionNarrow>
      <SectionHeadingLeft
        eyebrow="Inner Questions"
        title="这些念头，你是否也有过"
        subtitle="真正的问题从来不是「准不准」，而是你愿不愿意认真看自己一次。"
      />

      <motion.ul
        variants={containerFast}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        className="mt-14 grid gap-x-12 sm:grid-cols-2"
      >
        {QUESTIONS.map((question, index) => (
          <motion.li key={question} variants={itemRevealUp}>
            <Link
              href="#divinations"
              className="group flex items-center justify-between gap-4 border-b border-border/60 py-5 transition-colors outline-none hover:border-gold-500/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-muted-foreground/50 tabular-nums">
                  Q{index + 1}
                </span>
                <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground sm:text-[15px]">
                  {question}
                </span>
              </span>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-400"
                aria-hidden
              />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </SectionNarrow>
  );
}
