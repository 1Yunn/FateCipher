"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/* ─── 命运丝线：随滚动横向漂移的发光丝线，贯穿整个页面 ───
   - 一条极细的渐变线从左到右贯穿页面背景
   - 随滚动整体偏移，制造"命运线在流动"的感觉
   - 丝线有微弱的辉光
   - reduceMotion 下静止显示 */

export function FateThread() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 丝线随滚动横向漂移
  const x1 = useTransform(scrollYProgress, [0, 1], ["-5%", "15%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["5%", "-10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.6, 0.6, 0]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -3 }}
    >
      {/* 主丝线：上半弧 */}
      <motion.svg
        className="absolute left-0 top-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity }}
      >
        {/* 上弧线 */}
        <motion.path
          d="M -5 30 Q 30 15 50 28 T 105 32"
          fill="none"
          stroke="url(#thread-gradient)"
          strokeWidth="0.08"
          strokeLinecap="round"
          style={{ x: reduceMotion ? undefined : x1 }}
        />
        {/* 下弧线 */}
        <motion.path
          d="M 5 70 Q 35 85 55 72 T 110 68"
          fill="none"
          stroke="url(#thread-gradient-2)"
          strokeWidth="0.06"
          strokeLinecap="round"
          style={{ x: reduceMotion ? undefined : x2 }}
        />
        <defs>
          <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="var(--gold-400)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--gold-400)" stopOpacity="0.3" />
            <stop offset="80%" stopColor="var(--gold-400)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="thread-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="var(--foreground)" stopOpacity="0.08" />
            <stop offset="60%" stopColor="var(--foreground)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* 丝线上的光点：随滚动闪烁 */}
      <motion.div
        className="absolute h-1 w-1 rounded-full bg-gold-400/40 blur-[1px]"
        style={{
          top: "30%",
          left: "50%",
          x: reduceMotion ? undefined : x1,
          opacity: useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 1, 0]),
        }}
      />
    </div>
  );
}
