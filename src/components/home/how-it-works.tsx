"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  CalendarClock,
  FileText,
  MessagesSquare,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Section,
  SectionHeading,
  containerSlow,
  itemRevealUp,
  itemBounceIn,
} from "@/components/home/shared";

type Step = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const STEPS: Step[] = [
  {
    icon: CalendarClock,
    title: "输入出生信息",
    desc: "性别与出生年月日时，30 秒完成。",
  },
  {
    icon: ScanSearch,
    title: "AI 分析命盘",
    desc: "排定四柱与五行，AI 逐项解读。",
  },
  {
    icon: FileText,
    title: "生成深度报告",
    desc: "个性、事业、财富、感情，逐章展开。",
  },
  {
    icon: MessagesSquare,
    title: "持续 AI 咨询",
    desc: "带着报告继续追问，随时回来。",
  },
];

/** ⑥ 使用流程：宽容器 + 横向 4 列 + 连接线 scroll draw */
export function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <Section id="ai-demo">
      <SectionHeading
        eyebrow="How It Works"
        title="四步，看清一个决定"
        subtitle="全程约三分钟，数据只保存在你的浏览器。"
      />

      <motion.ol
        variants={containerSlow}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        ref={containerRef}
        className="relative mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-4 lg:gap-6"
      >
        {/* 连接线（桌面）—— scroll draw */}
        {reduceMotion ? (
          <span
            aria-hidden
            className="absolute top-5 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
        ) : (
          <motion.span
            aria-hidden
            style={{ scaleX: lineScale, transformOrigin: "left" }}
            className="hairline-gradient absolute top-5 right-[12%] left-[12%] hidden h-px lg:block"
          />
        )}

        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.li key={step.title} variants={itemRevealUp} className="relative">
              <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:text-center">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-xs text-gold-400">
                  {index + 1}
                </span>
                <div className="lg:mt-4">
                  <div className="flex items-center gap-2 lg:justify-center">
                    <Icon className="size-4 text-muted-foreground" aria-hidden />
                    <h3 className="text-[15px] font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 max-w-60 text-[13px] leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>

      <motion.div
        variants={itemBounceIn}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false }}
        className="mt-14 flex justify-center"
      >
        <Button asChild size="lg">
          <Link href="/fortune/bazi">从八字测算开始</Link>
        </Button>
      </motion.div>
    </Section>
  );
}
