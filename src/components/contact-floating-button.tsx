"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

/**
 * 联系我们悬浮按钮：固定在右下角，点击跳转至 /contact
 * 入场动画 + hover 放大 + 呼吸光晕
 */
export function ContactFloatingButton() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href="/contact"
      aria-label="联系我们"
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className="group fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-gold-500/30 bg-card/60 shadow-[0_4px_20px_rgba(23,23,30,0.12)] backdrop-blur-2xl transition-colors hover:border-gold-500/50 hover:bg-card/80 sm:size-14"
    >
      {/* 呼吸光晕 */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-gold-500/10 blur-md transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
      />
      <MessageCircle className="size-5 text-gold-400 sm:size-6" aria-hidden />
    </motion.a>
  );
}
