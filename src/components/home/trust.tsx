"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  BookMarked,
  Brain,
  BadgeCheck,
  Layers,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  Section,
  SectionHeading,
  container,
  item,
  itemRevealUp,
  SpotlightCard,
} from "@/components/home/shared";

type Fact = { value: number; label: string };

const FACTS: Fact[] = [
  { value: 4, label: "种玩法共用一份档案" },
  { value: 78, label: "张塔罗牌面的隐喻" },
  { value: 12, label: "宫紫微命盘的推演" },
];

type Point = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const POINTS: Point[] = [
  {
    icon: Brain,
    title: "AI 驱动分析",
    desc: "模型与规则引擎共同生成，解读逐条可解释。",
  },
  {
    icon: ShieldCheck,
    title: "数据留在本地",
    desc: "出生信息仅保存在你的浏览器，不上传服务器。",
  },
  {
    icon: Layers,
    title: "多维命理模型",
    desc: "八字、塔罗、紫微多模型交叉参照。",
  },
  {
    icon: BookMarked,
    title: "专业知识库",
    desc: "解读基于整理过的命理知识体系，而非随意生成。",
  },
  {
    icon: RefreshCw,
    title: "持续更新",
    desc: "解读内容与玩法按版本节奏持续迭代。",
  },
  {
    icon: BadgeCheck,
    title: "高质量报告",
    desc: "结构化输出，每份报告都可以反复阅读。",
  },
];

function FactCounter({ value, label }: Fact) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-mono text-4xl font-bold text-foreground tabular-nums sm:text-5xl">
        {display}
      </p>
      <p className="mt-2 text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}

/** ⑦ 信任建立：数字事实 + 工程向信任点，强调专业感而非神秘感 */
export function Trust() {
  return (
    <Section className="pb-28 sm:pb-36">
      <SectionHeading
        eyebrow="Trust & Safety"
        title="专业，而非神秘"
        subtitle="我们更愿意用工程质量与内容质量，换取你多看一眼的信任。"
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        className="mt-14"
      >
        <motion.div variants={item}>
          <SpotlightCard className="mx-auto block max-w-3xl rounded-[1.5rem] border border-border/60 bg-card/40 py-9 backdrop-blur-2xl">
            <div className="grid grid-cols-3 gap-6">
              {FACTS.map((fact) => (
                <FactCounter key={fact.label} {...fact} />
              ))}
            </div>
          </SpotlightCard>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-60px" }}
          className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3"
        >
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <motion.div key={point.title} variants={itemRevealUp} className="flex gap-4">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium">{point.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {point.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          className="mt-12 text-center text-xs text-muted-foreground/60"
        >
          全部内容由 AI 生成、仅供娱乐——
          <Link
            href="#disclaimer"
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            阅读完整免责声明
          </Link>
        </motion.p>
      </motion.div>
    </Section>
  );
}
