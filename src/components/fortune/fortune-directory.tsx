"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Coins,
  HeartHandshake,
  Layers,
  LayoutGrid,
  List,
  MessagesSquare,
  Orbit,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Divination = {
  id: string;
  href: string;
  icon: LucideIcon;
  tint: string;
  title: string;
  desc: string;
  duration: string;
  price: string;
  badge?: { variant: "cinnabar" | "outline" | "default"; label: string };
  cta: string;
  live: boolean;
};

const DIVINATIONS: Divination[] = [
  {
    id: "bazi",
    href: "/fortune/bazi",
    icon: Coins,
    tint: "bg-gold-500/10 text-gold-400 ring-gold-500/20",
    title: "八字测算",
    desc: "输入出生时辰，AI 老师傅为你拆解性格、事业与姻缘的底层盘面。",
    duration: "约 3 分钟",
    price: "基础免费 · 完整命书解锁",
    badge: { variant: "default", label: "本周热门" },
    cta: "开始排盘",
    live: true,
  },
  {
    id: "tarot",
    href: "/fortune/tarot",
    icon: Layers,
    tint: "bg-rouge/10 text-rouge ring-rouge/20",
    title: "塔罗占卜",
    desc: "洗牌、切牌、翻牌，把此刻的困惑交给 78 张牌面的隐喻。",
    duration: "约 2 分钟",
    price: "免费 · 3 张牌阵",
    cta: "开始抽牌",
    live: true,
  },
  {
    id: "ziwei",
    href: "/fortune/ziwei",
    icon: Orbit,
    tint: "bg-violet-400/10 text-violet-400 ring-violet-400/20",
    title: "紫微斗数",
    desc: "十二宫安星，命、财、官、夫逐宫推演，看懂人生大格局。",
    duration: "约 3 分钟",
    price: "免费 · 十二宫排盘",
    cta: "开始排盘",
    live: true,
  },
  {
    id: "ask",
    href: "/ask",
    icon: MessagesSquare,
    tint: "bg-violet-400/10 text-violet-400 ring-violet-400/20",
    title: "AI 问答",
    desc: "带着测算结果继续追问，让 AI 把天机翻译成人话。",
    duration: "随时开问",
    price: "免费 5 次/天 · 会员不限",
    cta: "去提问",
    live: true,
  },
];

type ViewMode = "grid" | "list";

const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  const options: { value: ViewMode; label: string; icon: LucideIcon }[] = [
    { value: "grid", label: "宫格", icon: LayoutGrid },
    { value: "list", label: "列表", icon: List },
  ];

  return (
    <div
      role="group"
      aria-label="视图切换"
      className="glass inline-flex rounded-full p-1"
    >
      {options.map((option) => {
        const active = view === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              active
                ? "bg-gold-500/15 text-gold-400"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <option.icon className="size-3.5" aria-hidden />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function FortuneDirectory() {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<ViewMode>("grid");

  return (
    <section
      id="divinations"
      className="scroll-mt-24 px-4 pt-32 pb-16 sm:px-6 sm:pt-36"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <motion.div variants={reveal}>
            <p className="text-xs font-medium tracking-[0.3em] text-gold-400/80 uppercase">
              Divination
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
              占卜中心
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              四种玩法共用一份命盘档案，填一次生日，处处可测。
            </p>
          </motion.div>
          <motion.div variants={reveal}>
            <ViewToggle view={view} onChange={setView} />
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="mt-12"
          >
            {view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {DIVINATIONS.map((item) => (
                  <DirectoryCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {DIVINATIONS.map((item) => (
                  <DirectoryRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ComingSoon：合盘配对 */}
        <div className="glass mt-4 flex flex-col gap-4 rounded-3xl p-6 opacity-70 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-porcelain/10 text-porcelain ring-1 ring-porcelain/20">
              <HeartHandshake className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-serif text-lg font-semibold">合盘配对</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                双人八字合婚、好友运势 PK，把玄学变成社交货币。
              </p>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            V2.0 · 敬请期待
          </Badge>
        </div>
      </div>
    </section>
  );
}

function DirectoryCard({ item }: { item: Divination }) {
  const Icon = item.icon;

  return (
    <article
      id={item.id}
      className={cn(
        "glass group relative flex h-full scroll-mt-28 flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 sm:p-7",
        !item.live && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-2xl ring-1",
            item.tint
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        {item.badge ? (
          <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
        ) : null}
      </div>

      <h2 className="mt-5 font-serif text-xl font-semibold">{item.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {item.desc}
      </p>

      <p className="mt-5 text-xs text-muted-foreground/70">{item.price}</p>

      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <Clock3 className="size-3.5" aria-hidden />
          {item.duration}
        </span>

        {item.live ? (
          <Link
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-gold-400 outline-none transition-all duration-200 group-hover:gap-2.5 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {item.cta}
            <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden />
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground/50">{item.cta}</span>
        )}
      </div>
    </article>
  );
}

function DirectoryRow({ item }: { item: Divination }) {
  const Icon = item.icon;
  const isBazi = item.id === "bazi";
  const hasTitleGap = isBazi || item.id === "tarot" || item.id === "ask";

  const content = (
    <>
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
          item.tint
        )}
      >
        <Icon className="size-4.5" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className={cn("flex items-center gap-2", hasTitleGap && "my-1.5")}>
          <h2
            className={cn(
              "text-[15px] font-medium",
              isBazi && "my-0 flex-col"
            )}
          >
            {item.title}
          </h2>
          {item.badge ? (
            <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
          {item.desc}
        </p>
      </div>

      <span className="hidden shrink-0 text-xs text-muted-foreground/70 sm:inline">
        {item.duration}
      </span>

      {item.live ? (
        <ArrowRight
          className="size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-gold-400"
          aria-hidden
        />
      ) : (
        <span className="shrink-0 text-[13px] text-muted-foreground/50">
          {item.cta}
        </span>
      )}
    </>
  );

  const rowClass = cn(
    "group flex items-center gap-4 scroll-mt-28 rounded-2xl glass px-5 py-4 transition-all duration-200 hover:border-gold-500/30 hover:bg-white/[0.085]",
    isBazi && "my-0",
    // 紫微行标题区收紧：上下内边距 16px → 6px
    item.id === "ziwei" && "py-1.5",
    !item.live && "opacity-70",
    item.live && "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
  );

  return (
    <div id={item.id}>
      {item.live ? (
        <Link href={item.href} className={cn(rowClass, "block")}>
          {content}
        </Link>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </div>
  );
}
