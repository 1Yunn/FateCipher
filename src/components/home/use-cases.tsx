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
  glow: string;
  roman: string;
  enTitle: string;
  title: string;
  tagline: string;
  caseSummary: string;
};

const CROSSROADS: Crossroad[] = [
  {
    id: "career",
    icon: Compass,
    accent: "text-indigo-400",
    glow: "group-hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.5)]",
    roman: "Ⅰ",
    enTitle: "Career",
    title: "职业规划",
    tagline: "判断行业与岗位是否匹配你的长期节奏",
    caseSummary: "28 岁，从教育转 AI 赛道前想看清时机窗口。",
  },
  {
    id: "love",
    icon: HeartHandshake,
    accent: "text-rose-400",
    glow: "group-hover:shadow-[0_0_60px_-10px_rgba(244,63,94,0.5)]",
    roman: "Ⅱ",
    enTitle: "Love",
    title: "感情困惑",
    tagline: "理解两个人的相处模式与彼此需要的节奏",
    caseSummary: "相恋三年，想分清是磨合期还是根本错配。",
  },
  {
    id: "startup",
    icon: Rocket,
    accent: "text-violet-400",
    glow: "group-hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.5)]",
    roman: "Ⅲ",
    enTitle: "Startup",
    title: "创业决策",
    tagline: "看清时机与自身准备是否在同一步伐上",
    caseSummary: "纠结是否 all in，想看清准备是否真的到位。",
  },
  {
    id: "direction",
    icon: Telescope,
    accent: "text-teal-400",
    glow: "group-hover:shadow-[0_0_60px_-10px_rgba(20,184,166,0.5)]",
    roman: "Ⅳ",
    enTitle: "Direction",
    title: "人生方向",
    tagline: "在迷茫期给自己一张更大比例尺的人生地图",
    caseSummary: "毕业五年仍在试错，想找到值得 all in 的方向。",
  },
] as const;

/* 堆叠态偏移：扑克牌式微错位 */
const STACK = [
  { x: -16, y: 12, rotate: -6, z: 1 },
  { x: -5, y: 4, rotate: -2, z: 2 },
  { x: 5, y: -4, rotate: 2, z: 3 },
  { x: 16, y: -12, rotate: 6, z: 4 },
];

/* 扇形展开：横向辐射 + 弧形升降 */
const SPREAD = [
  { x: -280, y: 30, rotate: -8, z: 1 },
  { x: -95, y: -10, rotate: -2.5, z: 2 },
  { x: 95, y: -10, rotate: 2.5, z: 3 },
  { x: 280, y: 30, rotate: 8, z: 4 },
];

const CARD_W = 200;
const CARD_H = 460;

/* ─── 塔罗牌单卡：正面 + 背面（翻牌显示真实案例） ─── */

function TarotCard({
  card,
  flipped,
}: {
  card: Crossroad;
  flipped: boolean;
}) {
  const Icon = card.icon;

  return (
    <div
      className="relative h-full w-full"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ─── 正面 ─── */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col overflow-hidden rounded-2xl",
            "border border-border/60 bg-gradient-to-b from-card to-card/60",
            "shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]",
            card.glow,
            "transition-shadow duration-500",
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* 装饰边框：双层内框 */}
          <div className="pointer-events-none absolute inset-2 rounded-xl ring-1 ring-border/30" />
          <div className="pointer-events-none absolute inset-3 rounded-lg ring-1 ring-border/20" />

          {/* 顶部：罗马数字 + 英文副标题 */}
          <div className="px-5 pt-6">
            <div className="flex items-baseline justify-between">
              <span
                className={cn(
                  "font-serif text-3xl font-bold leading-none tracking-tight",
                  card.accent,
                )}
              >
                {card.roman}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground/50">
                {card.enTitle}
              </span>
            </div>
            {/* 分隔线 */}
            <div
              className={cn(
                "mt-3 h-px w-12",
                card.accent.replace("text-", "bg-").replace("400", "400/50"),
              )}
            />
          </div>

          {/* 中部：大图标居中 */}
          <div className="flex flex-1 items-center justify-center">
            <div
              className={cn(
                "relative flex size-24 items-center justify-center rounded-2xl",
                card.accent.replace("text-", "bg-").replace("400", "400/10"),
              )}
            >
              <Icon className={cn("size-10", card.accent)} strokeWidth={1.25} />
              {/* 图标外圈光晕 */}
              <div
                className={cn(
                  "absolute -inset-4 rounded-3xl opacity-40 blur-2xl",
                  card.accent.replace("text-", "bg-").replace("400", "300"),
                )}
              />
            </div>
          </div>

          {/* 底部：标题 + tagline */}
          <div className="px-5 pb-6">
            <h3 className="font-serif text-2xl font-semibold leading-tight tracking-tight">
              {card.title}
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/80">
              {card.tagline}
            </p>
            {/* 底部分隔线 */}
            <div
              className={cn(
                "mt-4 h-px w-full",
                card.accent.replace("text-", "bg-").replace("400", "400/20"),
              )}
            />
            <p className="mt-3 text-center text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">
              翻转查看 →
            </p>
          </div>
        </div>

        {/* ─── 背面（真实案例） ─── */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl",
            "border border-border/60 bg-gradient-to-br from-foreground/[0.03] to-muted/50",
            "shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]",
          )}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* 装饰边框 */}
          <div className="pointer-events-none absolute inset-2 rounded-xl ring-1 ring-border/30" />
          <div className="pointer-events-none absolute inset-3 rounded-lg ring-1 ring-border/20" />

          {/* 背面纹样：四角小圆 */}
          <div
            className={cn(
              "pointer-events-none absolute left-5 top-5 size-2 rounded-full",
              card.accent.replace("text-", "bg-").replace("400", "400/40"),
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute right-5 top-5 size-2 rounded-full",
              card.accent.replace("text-", "bg-").replace("400", "400/40"),
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute bottom-5 left-5 size-2 rounded-full",
              card.accent.replace("text-", "bg-").replace("400", "400/40"),
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute bottom-5 right-5 size-2 rounded-full",
              card.accent.replace("text-", "bg-").replace("400", "400/40"),
            )}
          />

          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/50">
            Real Story
          </p>
          <div
            className={cn(
              "mx-6 mt-4 h-px w-8",
              card.accent.replace("text-", "bg-").replace("400", "400/40"),
            )}
          />
          <p className="mt-6 px-6 text-center font-serif text-[14px] italic leading-relaxed text-foreground/80">
            {card.caseSummary}
          </p>
          <div
            className={cn(
              "mt-6 h-px w-8",
              card.accent.replace("text-", "bg-").replace("400", "400/40"),
            )}
          />
          <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">
            FateCipher
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── 桌面端：堆叠 → 扇形展开 → hover 翻牌 ─── */

function StackCrossroads() {
  const [isSpread, setIsSpread] = useState(false);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  return (
    <div
      className="relative mx-auto h-[540px] max-w-5xl"
      onMouseEnter={() => setIsSpread(true)}
      onMouseLeave={() => {
        setIsSpread(false);
        setFlippedId(null);
      }}
    >
      {CROSSROADS.map((card, i) => {
        const base = SPREAD[i];
        const stack = STACK[i];
        const isFlipped = flippedId === card.id;

        const posAnim = !isSpread
          ? { x: stack.x, y: stack.y, rotate: stack.rotate, scale: 1, opacity: 1, zIndex: stack.z }
          : flippedId !== null && !isFlipped
            ? { x: base.x, y: base.y + 6, rotate: base.rotate, scale: 0.9, opacity: 0.4, zIndex: base.z }
            : { x: base.x, y: base.y - (isFlipped ? 16 : 0), rotate: base.rotate, scale: isFlipped ? 1.04 : 1, opacity: 1, zIndex: isFlipped ? 20 : base.z };

        return (
          <div
            key={card.id}
            className="group absolute left-1/2 top-1/2 cursor-pointer"
            style={{ transform: "translate(-50%, -50%)" }}
            onClick={() =>
              setFlippedId((prev) => (prev === card.id ? null : card.id))
            }
          >
            <motion.div
              style={{ width: CARD_W, height: CARD_H }}
              animate={posAnim}
              transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.8 }}
            >
              <TarotCard card={card} flipped={isFlipped} />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 移动端 / reduceMotion：2 列 grid ─── */

function GridCrossroads() {
  const [flippedId, setFlippedId] = useState<string | null>(null);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {CROSSROADS.map((card) => (
        <div
          key={card.id}
          className="mx-auto cursor-pointer"
          style={{ width: CARD_W, height: CARD_H }}
          onClick={() =>
            setFlippedId((prev) => (prev === card.id ? null : card.id))
          }
        >
          <TarotCard card={card} flipped={flippedId === card.id} />
        </div>
      ))}
    </div>
  );
}

/** 使用场景：塔罗牌式卡片 — 堆叠扑克 → 扇形展开 → 点击翻牌看真实案例 */
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
