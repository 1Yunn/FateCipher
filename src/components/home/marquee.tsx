"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const TAGS = [
  "理解自己",
  "人生决策",
  "长期成长",
  "自我探索",
  "未来规划",
  "关系洞察",
  "职业方向",
  "内在优势",
] as const;

/**
 * TagMarquee：关键词跑马灯（vocalyze 式横向无限滚动）
 * - 双份内容 + translateX(-50%) 实现无缝循环
 * - 悬停暂停；reduced-motion 下静态展示
 * - 两端用 background 渐变做边缘融合
 */
export function TagMarquee() {
  const reduceMotion = useReducedMotion();
  const row = [...TAGS, ...TAGS];

  return (
    <div
      aria-hidden="true"
      className="marquee-paused relative overflow-hidden py-6 select-none sm:py-8"
    >
      <div
        className={cn(
          "flex w-max items-center gap-10 pr-10",
          !reduceMotion && "animate-marquee"
        )}
      >
        {row.map((tag, i) => (
          <span key={`${tag}-${i}`} className="flex items-center gap-10">
            <span className="font-serif text-xl leading-none font-medium whitespace-nowrap text-foreground/40 sm:text-2xl">
              {tag}
            </span>
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-gold-500/50" />
          </span>
        ))}
      </div>

      {/* 边缘融合：跟随背景色渐隐 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
