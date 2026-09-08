"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { container, item } from "@/components/home/shared";
import { cn } from "@/lib/utils";

/**
 * SectionSplit：不对称 7/5 网格
 * - 左 7 列内容，右 5 列视觉
 * - 移动端自动堆叠为单列
 */
export function SectionSplit({
  id,
  children,
  className,
  reverse = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** 反转为 5/7（左 5 视觉，右 7 内容） */
  reverse?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 px-12 py-28 sm:px-16 sm:py-40 lg:px-24",
        className ?? ""
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "grid grid-cols-1 gap-10 md:gap-14 lg:grid-cols-12",
            reverse && "lg:[&>:first-child]:order-2"
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * EyebrowNumber：等宽大序号 + hairline + eyebrow 文字
 * - 比 value.tsx 的衬线 5xl 序号更克制，更现代
 * - 与 SectionHeading 区别：序号本身是视觉焦点
 */
export function EyebrowNumber({
  index,
  eyebrow,
  title,
  children,
}: {
  index: number;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  const num = String(index).padStart(2, "0");
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
    >
      <motion.div variants={item} className="flex items-center gap-4">
        <span className="font-mono text-sm font-medium tabular-nums text-gold-400/80">
          {num}
        </span>
        <span
          aria-hidden
          className="h-px w-10 bg-gradient-to-r from-gold-500/50 to-transparent sm:w-14"
        />
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
          {eyebrow}
        </p>
      </motion.div>
      <motion.h3
        variants={item}
        className="mt-5 font-serif text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </motion.h3>
      {children ? (
        <motion.div variants={item} className="mt-4">
          {children}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
