"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  SectionWide,
  SectionHeadingRight,
  containerSlow,
  itemRevealUp,
  itemDrawLine,
} from "@/components/home/shared";

const VALUES = [
  {
    title: "更了解自己",
    desc: "从性格底层理解自己的优势、盲区与行为模式。",
  },
  {
    title: "理解人生趋势",
    desc: "看清不同阶段的节奏，知道何时进取、何时蓄力。",
  },
  {
    title: "辅助重大决策",
    desc: "把直觉与盘面放在一起看，让选择多一个参照系。",
  },
  {
    title: "找到成长方向",
    desc: "把模糊的焦虑，拆成可以动手的具体行动。",
  },
] as const;

/** ④ 价值主张：宽容器 + 左对齐 + 大序号 + 横线 draw */
export function Value() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionWide className="py-28 sm:py-40">
      <SectionHeadingRight
        eyebrow="Why FateCipher"
        title="它不做预测，它做翻译"
        subtitle="把古老的方法论，翻译成现代人的自我认知工具。"
      />

      <motion.ol
        variants={containerSlow}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {VALUES.map((value, index) => (
          <motion.li key={value.title} variants={itemRevealUp} className="relative">
            <span
              aria-hidden
              className="font-serif text-4xl font-medium text-foreground/25"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <motion.span
              variants={itemDrawLine}
              aria-hidden
              className="hairline-gradient mt-3 block h-px w-12"
            />
            <h3 className="mt-4 text-[15px] font-medium">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {value.desc}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </SectionWide>
  );
}
