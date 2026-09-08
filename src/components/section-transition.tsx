"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { ReactNode } from "react";

import { useSectionScroll } from "@/lib/use-parallax";

/**
 * SectionTransition：段落过渡包装
 * - 基于段落滚动进度，在顶部 15% 入场 + 底部 15% 离场
 * - opacity 0.4 → 1 → 0.4，filter blur 8px → 0 → 8px
 * - 让相邻段落不硬切
 * - reduceMotion 下直接渲染子节点
 */
export function SectionTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { ref, scrollYProgress } = useSectionScroll();

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.4, 1, 1, 0.4]
  );
  const filter = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
