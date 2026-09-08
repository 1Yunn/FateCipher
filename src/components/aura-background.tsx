"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMouseParallax } from "@/lib/use-parallax";

/**
 * 氛围背景：三层光晕 + 噪点
 * 升级：鼠标视差三层深度 + 滚动视差
 */
export function AuraBackground() {
  const reduceMotion = useReducedMotion();
  const { x: mx, y: my } = useMouseParallax();
  const { scrollY } = useScroll();

  // 鼠标视差：三层不同强度制造深度
  const violetX = useTransform(mx, [-1, 1], [-6, 6]);
  const violetMouseY = useTransform(my, [-1, 1], [-6, 6]);
  const goldX = useTransform(mx, [-1, 1], [10, -10]);
  const goldMouseY = useTransform(my, [-1, 1], [10, -10]);
  const rougeX = useTransform(mx, [-1, 1], [-4, 4]);
  const rougeY = useTransform(my, [-1, 1], [-4, 4]);

  // 滚动视差：Hero 离场时光晕上飘
  const violetScrollY = useTransform(scrollY, [0, 800], [0, -80]);
  const goldScrollY = useTransform(scrollY, [0, 800], [0, 40]);

  // 合并鼠标 Y 和滚动 Y
  const violetY = useTransform([violetMouseY, violetScrollY], ([a, b]) => (a as number) + (b as number));
  const goldY = useTransform([goldMouseY, goldScrollY], ([a, b]) => (a as number) + (b as number));

  if (reduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="aura aura-violet" />
        <div className="aura aura-gold" />
        <div className="aura aura-rouge" />
        <div className="noise" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div className="aura aura-violet" style={{ x: violetX, y: violetY }} />
      <motion.div className="aura aura-gold" style={{ x: goldX, y: goldY }} />
      <motion.div className="aura aura-rouge" style={{ x: rougeX, y: rougeY }} />
      <div className="iridescent-wash" />
      <div className="noise" />
    </div>
  );
}
