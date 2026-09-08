"use client";

import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HUA_STYLE, STARS, type ZiweiChart } from "@/lib/ziwei";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ZiweiResult({
  chart,
  dateText,
  onReset,
}: {
  chart: ZiweiChart;
  dateText: string;
  onReset: () => void;
}) {
  const lifeStar = STARS[chart.lifeStar];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-serif text-2xl font-semibold">你的紫微命盘</h2>
        <Badge variant="outline">{chart.stem}年 · 十二宫</Badge>
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">
        {dateText} · 命宫主星
        <span className="ml-1.5 font-serif text-violet-400">{lifeStar.name}</span>
      </p>

      {/* 十二宫命盘 */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {chart.palaces.map((palace, i) => {
          const isLife = palace.isLife;
          return (
            <motion.div
              key={palace.name}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: i * 0.05 }}
              className={cn(
                "relative rounded-xl border p-3 transition-shadow",
                isLife
                  ? "border-violet-400/50 bg-violet-400/[0.06] shadow-[0_4px_20px_-8px_rgba(109,90,224,0.25)]"
                  : "border-border/60 bg-card/50"
              )}
            >
              {/* 宫名 */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-[11px] font-medium tracking-wide",
                    isLife ? "text-violet-400" : "text-muted-foreground/70"
                  )}
                >
                  {palace.name}
                </span>
                {isLife ? (
                  <span className="rounded-full bg-violet-400/15 px-1.5 py-0.5 text-[9px] font-medium text-violet-400">
                    命
                  </span>
                ) : null}
              </div>

              {/* 主星 */}
              <div className="mt-2 flex flex-wrap items-center gap-1">
                {palace.stars.map((starIdx) => (
                  <span
                    key={starIdx}
                    className={cn(
                      "font-serif text-[15px] font-medium leading-tight",
                      isLife ? "text-foreground" : "text-foreground/85"
                    )}
                  >
                    {STARS[starIdx].name}
                  </span>
                ))}
              </div>

              {/* 四化 */}
              {palace.hua ? (
                <span
                  className={cn(
                    "mt-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ring-1",
                    HUA_STYLE[palace.hua].className
                  )}
                >
                  {HUA_STYLE[palace.hua].label}
                </span>
              ) : (
                <span className="mt-2 block text-[10px] text-muted-foreground/40">
                  {palace.theme}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 命宫主星深度解读 */}
      <div className="mt-8 rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-violet-400/15 text-violet-400 ring-1 ring-violet-400/25">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <h3 className="font-serif text-lg font-semibold">
            命宫 · {lifeStar.name}
          </h3>
        </div>
        <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.15em] text-violet-400/80">
          {lifeStar.keyword}
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">性格底色</p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/80">
              {lifeStar.personality}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">事业方向</p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/80">
              {lifeStar.career}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">感情模式</p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/80">
              {lifeStar.relationship}
            </p>
          </div>
        </div>
      </div>

      {/* 四化说明 */}
      <div className="mt-5 rounded-xl bg-muted/40 p-4">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
          本年四化飞星
        </p>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
          {(["禄", "权", "科", "忌"] as const).map((h) => {
            const palace = chart.palaces.find((p) => p.hua === h);
            return (
              <span key={h} className="flex items-center gap-1.5 text-[12px]">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1",
                    HUA_STYLE[h].className
                  )}
                >
                  {HUA_STYLE[h].label}
                </span>
                <span className="text-muted-foreground">
                  落 {palace?.name ?? "—"}
                </span>
              </span>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60">
          化禄主财缘、化权主掌控、化科主名声、化忌主阻滞。四化非定数，是能量流动的提示。
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button disabled className="flex-1">
          <Sparkles aria-hidden />
          生成 AI 完整命书
        </Button>
        <Badge variant="outline" className="justify-center py-1.5 sm:justify-start">
          即将上线
        </Badge>
        <Button variant="ghost" onClick={onReset} className="sm:ml-auto">
          <RotateCcw aria-hidden />
          重新排盘
        </Button>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground/60">
        排盘为娱乐简化版，未做真实农历换算与安星诀，结果仅供娱乐参考，不构成任何决策建议。
      </p>
    </motion.div>
  );
}
