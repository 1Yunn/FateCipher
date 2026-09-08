"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * CursorGlow：前景层点击光晕
 * - fixed inset-0 pointer-events-none z-40
 * - 180px 径向金色 gradient 跟随鼠标
 * - mousedown 时 opacity 0 → 0.15，mouseup 回 0
 * - reduceMotion / 触屏 pointer: coarse 下不渲染
 * - 与 AuraBackground 分层：背景氛围 + 前景点击脉冲
 */
export function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const [coarse, setCoarse] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const onCoarse = () => setCoarse(mq.matches);
    mq.addEventListener?.("change", onCoarse);
    return () => mq.removeEventListener?.("change", onCoarse);
  }, []);

  useEffect(() => {
    if (reduceMotion || coarse) return;
    function handleMove(e: MouseEvent) {
      x.set(e.clientX - 90);
      y.set(e.clientY - 90);
    }
    function handleDown() {
      setPressed(true);
    }
    function handleUp() {
      setPressed(false);
    }
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [reduceMotion, coarse, x, y]);

  if (reduceMotion || coarse) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="size-[180px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gold-500) 28%, transparent), transparent 65%)",
        }}
        animate={{ opacity: pressed ? 0.18 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
