"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/* ─── 磁吸按钮：鼠标靠近时按钮被吸引偏移 ───
   参考 MetaSight 的按钮交互风格
   - 鼠标进入容器范围时按钮开始偏移
   - 弹簧物理跟随，离开时回弹归位
   - 内部内容有轻微反向偏移，制造层次 */

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  href,
  strength = 0.3,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(my, { stiffness: 200, damping: 15, mass: 0.3 });

  // 内部内容反向偏移
  const ix = useSpring(useMotionValue(0), { stiffness: 300, damping: 20, mass: 0.2 });
  const iy = useSpring(useMotionValue(0), { stiffness: 300, damping: 20, mass: 0.2 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    mx.set(dx);
    my.set(dy);
    ix.set(-dx * 0.3);
    iy.set(-dy * 0.3);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
    ix.set(0);
    iy.set(0);
  }

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: reduceMotion ? undefined : sx, y: reduceMotion ? undefined : sy }}
      className={cn("inline-block", className)}
    >
      <motion.div
        style={{ x: reduceMotion ? undefined : ix, y: reduceMotion ? undefined : iy }}
        className="inline-block"
      >
        {children}
      </motion.div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}
