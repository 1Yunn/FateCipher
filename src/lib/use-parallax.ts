"use client";

import { useMotionValue, useSpring, useScroll, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * 鼠标视差 hook：返回归一化到 [-1, 1] 的 spring 化 MotionValue
 * 用于背景光晕的深度视差
 */
export function useMouseParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const x = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.5 });
  const y = useSpring(my, { stiffness: 50, damping: 20, mass: 0.5 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mx, my]);

  return { x, y };
}

/**
 * Section 滚动进度 hook
 * 返回 ref 和 scrollYProgress (0→1)
 */
export function useSectionScroll(
  offset: ["start end", "end start"] | ["start start", "end end"] = ["start end", "end start"]
) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  });

  return { scrollYProgress, ref };
}
