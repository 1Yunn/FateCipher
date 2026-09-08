"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RitualOverlayProps = {
  open: boolean;
  /** 依次轮换的推演文案 */
  lines: string[];
  /** 最短展示时长（ms），用于掩盖生成延迟 */
  minDuration?: number;
  onComplete: () => void;
};

/**
 * 全屏仪式感推演动画：星轨旋转 + 月亮呼吸 + 文案轮换。
 * 动画完成后回调 onComplete；prefers-reduced-motion 时大幅缩短。
 */
export function RitualOverlay({
  open,
  lines,
  minDuration = 2600,
  onComplete,
}: RitualOverlayProps) {
  const reduceMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setLineIndex(0);
      return;
    }
    const duration = reduceMotion ? 500 : minDuration;
    const lineTimer = window.setInterval(
      () => setLineIndex((index) => (index + 1) % lines.length),
      duration / lines.length
    );
    const doneTimer = window.setTimeout(onComplete, duration);
    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduceMotion, minDuration]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="推演中"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background/85 backdrop-blur-2xl"
        >
          <div className="relative size-32">
            {/* 星轨外环 */}
            <motion.svg
              viewBox="0 0 128 128"
              aria-hidden
              className="absolute inset-0 size-full"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 3.2, ease: "linear", repeat: Infinity }}
            >
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="var(--gold-500)"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                strokeDasharray="4 10"
                strokeLinecap="round"
              />
              <circle
                cx="64"
                cy="6"
                r="4"
                fill="var(--gold-400)"
                className="motion-reduce:hidden"
              />
            </motion.svg>

            {/* 内环 */}
            <svg
              viewBox="0 0 128 128"
              aria-hidden
              className="absolute inset-0 size-full"
            >
              <circle
                cx="64"
                cy="64"
                r="44"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
              />
            </svg>

            {/* 中心月亮呼吸 */}
            <motion.div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
              animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
            >
              <svg viewBox="0 0 32 32" className="size-12">
                <path
                  d="M19.5 8.8a9.5 9.5 0 1 0 0 14.4 7.6 7.6 0 1 1 0-14.4Z"
                  fill="var(--gold-400)"
                />
              </svg>
            </motion.div>
          </div>

          <div className="h-6 overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="text-sm tracking-wide text-muted-foreground"
              >
                {lines[lineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
