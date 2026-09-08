"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Coins, Layers, MessagesSquare, Orbit, TrendingUp, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

type TrendingRow = {
  rank: number;
  name: string;
  href?: string;
  icon: LucideIcon;
  tint: string;
  count: string;
  change: string;
  changeTone: "up" | "flat";
  live: boolean;
};

const ROWS: TrendingRow[] = [
  {
    rank: 1,
    name: "塔罗占卜",
    icon: Layers,
    tint: "bg-rouge/10 text-rouge ring-rouge/20",
    count: "—",
    change: "敬请期待",
    changeTone: "flat",
    live: false,
  },
  {
    rank: 2,
    name: "八字测算",
    href: "/fortune/bazi",
    icon: Coins,
    tint: "bg-gold-500/10 text-gold-400 ring-gold-500/20",
    count: "9,316",
    change: "+6%",
    changeTone: "up",
    live: true,
  },
  {
    rank: 3,
    name: "AI 问答",
    href: "/ask",
    icon: MessagesSquare,
    tint: "bg-violet-400/10 text-violet-400 ring-violet-400/20",
    count: "7,214",
    change: "+23%",
    changeTone: "up",
    live: true,
  },
  {
    rank: 4,
    name: "紫微斗数",
    icon: Orbit,
    tint: "bg-porcelain/10 text-porcelain ring-porcelain/20",
    count: "—",
    change: "敬请期待",
    changeTone: "flat",
    live: false,
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

export function WeeklyTrending() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="trending-title"
      className="px-4 pb-28 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <h2
              id="trending-title"
              className="font-serif text-2xl font-semibold sm:text-3xl"
            >
              本周热测榜
            </h2>
            <Badge variant="outline">示例数据</Badge>
          </motion.div>
          <motion.p
            variants={item}
            className="mt-3 text-[15px] leading-relaxed text-muted-foreground"
          >
            大家最近都在问什么。数据为产品演示样例，正式上线后展示真实统计。
          </motion.p>

          <motion.div
            variants={item}
            className="glass mt-8 overflow-x-auto rounded-3xl"
          >
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-6 py-4 font-medium">
                    排名
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    玩法
                  </th>
                  <th scope="col" className="px-6 py-4 text-right font-medium">
                    本周测算
                  </th>
                  <th scope="col" className="px-6 py-4 text-right font-medium">
                    七日涨幅
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const Icon = row.icon;
                  const nameContent = (
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex size-8 shrink-0 items-center justify-center rounded-lg ring-1",
                          row.tint
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          !row.live && "text-muted-foreground"
                        )}
                      >
                        {row.name}
                      </span>
                    </span>
                  );

                  return (
                    <tr
                      key={row.rank}
                      className={cn(
                        "border-b border-border/40 transition-colors last:border-0 hover:bg-white/[0.04]",
                        !row.live && "opacity-70"
                      )}
                    >
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "font-mono text-[13px] tabular-nums",
                            row.rank === 1
                              ? "font-semibold text-gold-400"
                              : "text-muted-foreground/60"
                          )}
                        >
                          {String(row.rank).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {row.live && row.href ? (
                          <Link
                            href={row.href}
                            className="inline-flex rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          >
                            {nameContent}
                          </Link>
                        ) : (
                          nameContent
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-mono tabular-nums text-muted-foreground">
                        {row.count}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {row.changeTone === "up" ? (
                          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-jade">
                            <TrendingUp className="size-3.5" aria-hidden />
                            {row.change}
                          </span>
                        ) : (
                          <span className="text-[13px] text-muted-foreground/50">
                            {row.change}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
