"use client";

import { motion } from "framer-motion";
import { Check, RotateCcw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BRANCHES,
  BRANCH_ELEMENT,
  STEMS,
  STEM_ELEMENT,
  type BaziChart,
  type FiveElement,
} from "@/lib/bazi";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ELEMENT_STYLE: Record<FiveElement, { text: string; bar: string }> = {
  金: { text: "text-[#cfccc2]", bar: "bg-[#cfccc2]" },
  木: { text: "text-jade", bar: "bg-jade" },
  水: { text: "text-porcelain", bar: "bg-porcelain" },
  火: { text: "text-cinnabar", bar: "bg-cinnabar" },
  土: { text: "text-gold-400", bar: "bg-gold-400" },
};

const FREE_ITEMS = ["四柱排盘", "五行能量分析", "生肖命相"] as const;
const PRO_ITEMS = [
  "AI 深度解读命书",
  "大运流年推演",
  "事业姻缘专项",
  "无限 AI 追问",
] as const;

export type BaziResultInfo = {
  date: string;
  hourText: string;
  genderText: string;
};

export function BaziResult({
  chart,
  info,
  onReset,
}: {
  chart: BaziChart;
  info: BaziResultInfo;
  onReset: () => void;
}) {
  const [year, month, day] = chart.date.split("-").map(Number);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-serif text-2xl font-semibold">你的四柱命盘</h2>
        <Badge variant="jade">排盘完成</Badge>
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">
        公历 {year} 年 {month} 月 {day} 日 · {info.hourText} ·{" "}
        属{chart.zodiac} · {info.genderText}
      </p>

      {/* 四柱 */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {chart.pillars.map((pillar) => {
          const isDay = pillar.key === "day";
          return (
            <div
              key={pillar.key}
              className={cn(
                "relative rounded-2xl border border-border bg-card/60 p-4 text-center",
                isDay && "ring-1 ring-gold-500/40"
              )}
            >
              {isDay ? (
                <Badge variant="default" className="absolute -top-2.5 right-2">
                  日主
                </Badge>
              ) : null}
              <p className="text-xs text-muted-foreground">{pillar.label}</p>
              <p
                className={cn(
                  "mt-3 font-serif text-3xl font-semibold",
                  ELEMENT_STYLE[STEM_ELEMENT[pillar.stem]].text
                )}
              >
                {STEMS[pillar.stem]}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/60">
                {STEMS[pillar.stem]} · {STEM_ELEMENT[pillar.stem]}
              </p>
              <p
                className={cn(
                  "mt-3 font-serif text-2xl font-semibold",
                  ELEMENT_STYLE[BRANCH_ELEMENT[pillar.branch]].text
                )}
              >
                {BRANCHES[pillar.branch]}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/60">
                {BRANCHES[pillar.branch]} · {BRANCH_ELEMENT[pillar.branch]}
              </p>
            </div>
          );
        })}
      </div>

      {/* 五行能量 */}
      <div className="mt-8">
        <h3 className="text-sm font-medium">五行能量</h3>
        <ul className="mt-3 space-y-2.5">
          {(Object.keys(chart.elements) as FiveElement[]).map((element) => {
            const count = chart.elements[element];
            const percent = Math.round((count / chart.charCount) * 100);
            return (
              <li key={element} className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-5 shrink-0 text-center font-serif text-sm font-semibold",
                    ELEMENT_STYLE[element].text
                  )}
                >
                  {element}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
                    className={cn("h-full rounded-full", ELEMENT_STYLE[element].bar)}
                  />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">
          节气按近似日期推算（±1 天）
          {chart.hourKnown ? "" : "；时辰未知，仅排三柱"}。本排盘仅供娱乐。
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button disabled className="flex-1">
          <Sparkles aria-hidden />
          生成 AI 完整解读
        </Button>
        <Badge variant="outline" className="justify-center py-1.5 sm:justify-start">
          即将上线
        </Badge>
        <Button variant="ghost" onClick={onReset} className="sm:ml-auto">
          <RotateCcw aria-hidden />
          重新测算
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/60">
        命盘已保存至本机档案（仅浏览器本地存储，数据不出浏览器）。
      </p>

      {/* 定价锚点 */}
      <div className="glass mt-10 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-lg font-semibold">解锁完整命书</h3>
          <Badge>PRO</Badge>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              免费
            </p>
            <ul className="mt-3 space-y-2.5">
              {FREE_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-jade" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-gold-400">
              PRO · ¥9.9 / 次
            </p>
            <ul className="mt-3 space-y-2.5">
              {PRO_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Sparkles className="size-4 text-gold-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground/60">
          价格与权益以上线时为准。全部解读由 AI 生成，仅供娱乐，不构成任何决策建议。
        </p>
      </div>
    </motion.div>
  );
}
