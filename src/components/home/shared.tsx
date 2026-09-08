"use client";

import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ───── 保留的默认变体 ───── */
export const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/* ───── 新增动画变体 ───── */

/** 快节奏容器：问题列表、人群卡 */
export const containerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/** 慢节奏容器：价值主张、使用流程 */
export const containerSlow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
};

/** 模糊上浮揭示：问题、价值、流程、信任点 */
export const itemRevealUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** 纯淡入：最克制，适合"轻"模块 */
export const itemFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};

/** 缩放显影：卡片类，避免和上移撞车 */
export const itemScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** 逐字 mask 揭示：Hero 标题专用 */
export const itemMaskReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/** 模糊入场：Hero 副标题、报告标题 */
export const itemBlurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.0, ease: EASE_OUT },
  },
};

/** 线条绘制：横线 draw 动画 */
export const itemDrawLine: Variants = {
  hidden: { scaleX: 0, transformOrigin: "left" },
  show: {
    scaleX: 1,
    transformOrigin: "left",
    transition: { duration: 1.0, ease: EASE_OUT },
  },
};

/** 弹性回弹：按钮 CTA 专用，从下方弹入带过冲 */
export const itemBounceIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 12,
      mass: 0.8,
    },
  },
};

/** 首页分区头：细线 + 大字距 eyebrow + 衬线标题 + 副标题 + 轻微视差 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      style={{ y: reduceMotion ? undefined : y }}
      className="mx-auto max-w-2xl text-center"
    >
      <motion.div variants={item} className="flex items-center justify-center gap-4">
        <span
          aria-hidden
          className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/50 sm:w-14"
        />
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
          {eyebrow}
        </p>
        <span
          aria-hidden
          className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/50 sm:w-14"
        />
      </motion.div>
      <motion.h2
        variants={item}
        className="mt-6 whitespace-nowrap font-serif text-[clamp(1.25rem,4vw,2.25rem)] font-medium tracking-tight sm:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          variants={item}
          className="mt-4 text-sm leading-relaxed text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

/** 首页分区容器：统一垂直留白节奏 */
export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-12 py-28 sm:px-16 sm:py-40 lg:px-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/* ───── 新增布局变体 ───── */

/** 窄容器：问题共鸣、适合人群 —— 对话感更紧 */
export function SectionNarrow({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-12 py-24 sm:px-16 sm:py-32 lg:px-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-4xl">{children}</div>
    </section>
  );
}

/** 宽容器：使用场景、价值主张 —— 给网格更多空间 */
export function SectionWide({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-12 py-28 sm:px-16 sm:py-40 lg:px-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/** 全宽容器：报告预览 —— 整页高潮锚点 */
export function SectionFullBleed({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-12 py-32 sm:px-16 sm:py-48 lg:px-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/* ───── 对齐方向变体 ───── */

/** 左对齐标题：竖向细线 + eyebrow + 标题 + 副标题 + 轻微视差 */
export function SectionHeadingLeft({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      style={{ y: reduceMotion ? undefined : y }}
      className="max-w-2xl"
    >
      <motion.div variants={item} className="flex items-center gap-3">
        <span aria-hidden className="h-5 w-px bg-gold-500/50" />
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
          {eyebrow}
        </p>
      </motion.div>
      <motion.h2
        variants={item}
        className="mt-5 whitespace-nowrap font-serif text-[clamp(1.25rem,4vw,2.5rem)] font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          variants={item}
          className="mt-4 text-sm leading-relaxed text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

/** 右对齐标题：与左对齐形成镜像节奏 */
export function SectionHeadingRight({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      style={{ y: reduceMotion ? undefined : y }}
      className="ml-auto max-w-2xl text-right"
    >
      <motion.div variants={item} className="flex items-center justify-end gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
          {eyebrow}
        </p>
        <span aria-hidden className="h-5 w-px bg-gold-500/50" />
      </motion.div>
      <motion.h2
        variants={item}
        className="mt-5 whitespace-nowrap font-serif text-[clamp(1.25rem,4vw,2.5rem)] font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          variants={item}
          className="mt-4 text-sm leading-relaxed text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

/* ───── 模块间分隔呼吸组件 ───── */

/** 段落休止符：渐变细线 + 金色圆点 */
export function Divider() {
  return (
    <div
      aria-hidden
      className="mx-auto flex max-w-6xl items-center gap-3 px-4 sm:px-6"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
      <span className="size-1 rounded-full bg-gold-500/40" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}

/* ───── 鼠标光晕卡片包装 ───── */

/** SpotlightCard：onMouseMove 更新 CSS 变量，渲染金色 radial gradient 光晕 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
