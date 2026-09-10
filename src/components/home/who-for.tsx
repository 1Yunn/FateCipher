"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Backpack,
  Briefcase,
  Heart,
  Laptop,
  Signpost,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import {
  SectionNarrow,
  SectionHeadingLeft,
  containerFast,
  itemFade,
} from "@/components/home/shared";

type Audience = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const AUDIENCES: Audience[] = [
  {
    icon: Briefcase,
    title: "正在求职的人",
    desc: "纠结 offer 与方向时，多一个参照系。",
  },
  {
    icon: TrendingUp,
    title: "创业者与管理者",
    desc: "在不确定里寻找节奏与时机。",
  },
  {
    icon: Heart,
    title: "情侣与伴侣",
    desc: "想更懂彼此的相处模式。",
  },
  {
    icon: Backpack,
    title: "学生与家长",
    desc: "升学与规划，希望顺性而为。",
  },
  {
    icon: Laptop,
    title: "自由职业者",
    desc: "一个人的长跑，需要看清趋势。",
  },
  {
    icon: Signpost,
    title: "站在岔路口的人",
    desc: "对未来好奇，也对自己好奇。",
  },
];

/** ② 适合人群：右对齐 + 窄容器 + 纯淡入，最克制的一节 */
export function WhoFor() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionNarrow className="py-24 sm:py-32">
      <SectionHeadingLeft
        eyebrow="Made For"
        title="它为谁而做"
        subtitle="不需要懂命理，只需要对自己与未来保持好奇。"
      />

      <div className="max-w-4xl">
        <motion.div
          variants={containerFast}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, margin: "-80px" }}
          className="mt-14 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3"
        >
        {AUDIENCES.map((audience) => {
          const Icon = audience.icon;
          return (
            <motion.div
              key={audience.title}
              variants={itemFade}
              className="group flex items-start gap-4 rounded-2xl border border-transparent p-5 transition-all duration-300 hover:border-border/40"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-gold-500/10 group-hover:text-gold-400">
                <Icon className="size-4" aria-hidden />
              </span>
              <div>
                <h3 className="text-[15px] font-medium">{audience.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {audience.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
        </motion.div>
      </div>
    </SectionNarrow>
  );
}
