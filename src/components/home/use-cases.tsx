"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  Compass,
  HeartHandshake,
  Rocket,
  Telescope,
  type LucideIcon,
} from "lucide-react";

import { SectionWide, SectionHeading } from "@/components/home/shared";
import { cn } from "@/lib/utils";

type Crossroad = {
  id: string;
  icon: LucideIcon;
  accent: string;
  ring: string;
  title: string;
  tagline: string;
  points: string[];
  caseSummary: string;
};

const CROSSROADS: Crossroad[] = [
  {
    id: "career",
    icon: Compass,
    accent: "text-indigo-400",
    ring: "bg-indigo-400/10 ring-indigo-400/20",
    title: "职业规划",
    tagline: "判断行业与岗位是否匹配你的长期节奏。",
    points: ["行业趋势适配", "能力边界识别", "时机窗口判断"],
    caseSummary: "28 岁，从教育转 AI 赛道前想看清时机。",
  },
  {
    id: "love",
    icon: HeartHandshake,
    accent: "text-rose-400",
    ring: "bg-rose-400/10 ring-rose-400/20",
    title: "感情困惑",
    tagline: "理解两个人的相处模式与彼此需要。",
    points: ["相处模式拆解", "彼此需求对位", "关键节点预判"],
    caseSummary: "相恋三年，想分清是磨合还是错配。",
  },
  {
    id: "startup",
    icon: Rocket,
    accent: "text-violet-400",
    ring: "bg-violet-400/10 ring-violet-400/20",
    title: "创业决策",
    tagline: "看清时机与自身准备是否在同一步伐。",
    points: ["时机与天时", "自身准备度", "风险与节奏"],
    caseSummary: "纠结是否 all in，想看清准备是否到位。",
  },
  {
    id: "direction",
    icon: Telescope,
    accent: "text-teal-400",
    ring: "bg-teal-400/10 ring-teal-400/20",
    title: "人生方向",
    tagline: "在迷茫期给自己一张更大比例尺的地图。",
    points: ["核心优势锚定", "阶段节奏对齐", "内驱力溯源"],
    caseSummary: "毕业五年仍在试错，想找到值得 all in 的方向。",
  },
] as const;

/* 堆叠态偏移：扑克牌式微错位 */
const STACK = [
  { x: -14, y: 10, rotate: -8, z: 1 },
  { x: -5, y: 4, rotate: -3, z: 2 },
  { x: 5, y: -4, rotate: 3, z: 3 },
  { x: 14, y: -10, rotate: 8, z: 4 },
];

/* 扇形展开：横向辐射 + 弧形升降（收窄防溢出） */
const SPREAD = [
  { x: -270, y: 40, rotate: -9, z: 1 },
  { x: -90, y: -16, rotate: -3, z: 2 },
  { x: 90, y: -16, rotate: 3, z: 3 },
  { x: 270, y: 40, rotate: 9, z: 4 },
];

const CARD_W = 260;
const CARD_H = 380;

/* ─── 单卡内容（无翻转，全部信息一面展示）─── */

function CardContent({ card }: { card: Crossroad }) {
  const Icon = card.icon;
  return (
    <div className="flex h-full flex-col px-5 pb-5 pt-6">
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-2xl ring-1",
          card.ring,
        )}
      >
        <Icon className={cn("size-5", card.accent)} aria-hidden />
      </span>
      <h3 className="mt-4 text-[15px] font-medium">{card.title}</h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
        {card.tagline}
      </p>

      <ul className="mt-4 space-y-2">
        {card.points.map((p) => (
          <li
            key={p}
            className="flex items-center gap-2 text-[12px] text-muted-foreground"
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full bg-current",
                card.accent,
              )}
            />
            {p}
          </li>
        ))}
      </ul>

      {/* 真实案例 */}
      <div className="mt-auto rounded-xl bg-muted/30 p-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50">
          真实案例
        </p>
        <p className="mt-1.5 font-serif text-[12px] italic leading-relaxed text-foreground/80">
          {card.caseSummary}
        </p>
      </div>
    </div>
  );
}

/* ─── 桌面端：堆叠 → 扇形展开 → hover 上浮高亮 ─── */

function StackCrossroads() {
  const [isSpread, setIsSpread] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div
      className="relative mx-auto h-[480px] max-w-5xl"
      onMouseEnter={() => setIsSpread(true)}
      onMouseLeave={() => {
        setIsSpread(false);
        setActiveId(null);
      }}
    >
      {CROSSROADS.map((card, i) => {
        const base = SPREAD[i];
        const stack = STACK[i];

        const posAnim = !isSpread
          ? { x: stack.x, y: stack.y, rotate: stack.rotate, scale: 1, opacity: 1, zIndex: stack.z }
          : activeId === card.id
            ? { x: base.x, y: base.y - 20, rotate: base.rotate, scale: 1.06, opacity: 1, zIndex: 10 }
            : activeId !== null
              ? { x: base.x, y: base.y, rotate: base.rotate, scale: 0.92, opacity: 0.45, zIndex: base.z }
              : { x: base.x, y: base.y, rotate: base.rotate, scale: 1, opacity: 1, zIndex: base.z };

        return (
          <div
            key={card.id}
            className="absolute left-1/2 top-1/2"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {/* 扩大的触发热区：卡片外圈 padding 区域也响应 hover */}
            <motion.div
              className="cursor-default rounded-[1.75rem] border border-border/50 bg-card/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-shadow duration-300 hover:shadow-[0_8px_32px_-12px_rgba(109,90,224,0.12)]"
              style={{ transformOrigin: "center", width: CARD_W, height: CARD_H, padding: 16 }}
              animate={posAnim}
              transition={{ type: "spring", stiffness: 200, damping: 24, mass: 0.8 }}
              onMouseEnter={() => setActiveId(card.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              <div className="h-full w-full rounded-[1.5rem] overflow-hidden">
                <CardContent card={card} />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 移动端 / reduceMotion：网格 ─── */

function GridCrossroads() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CROSSROADS.map((card) => (
        <div
          key={card.id}
          className="rounded-[1.5rem] border border-border/50 bg-card/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-shadow duration-300 hover:shadow-[0_8px_32px_-12px_rgba(109,90,224,0.12)]"
          style={{ height: CARD_H }}
        >
          <CardContent card={card} />
        </div>
      ))}
    </div>
  );
}

/** 使用场景：堆叠扑克 → 扇形展开 → hover 上浮高亮 */
export function UseCases() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionWide>
      <SectionHeading
        eyebrow="Use Cases"
        title="人生的几个关键路口"
        subtitle="在决定之前，多一份对自己与趋势的理解。"
      />

      <div className="mt-14">
        {reduceMotion ? (
          <GridCrossroads />
        ) : (
          <>
            <div className="hidden md:block">
              <StackCrossroads />
            </div>
            <div className="md:hidden">
              <GridCrossroads />
            </div>
          </>
        )}
      </div>
    </SectionWide>
  );
}
