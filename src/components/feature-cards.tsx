"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Coins,
  Layers,
  MessagesSquare,
  Orbit,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { SectionHeading, container } from "@/components/home/shared";
import { MagneticButton } from "@/components/magnetic-button";
import { cn } from "@/lib/utils";

type Feature = {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  detail: string;
  duration: string;
  badge?: { variant: "cinnabar" | "outline"; label: string };
  cta: string;
  live: boolean;
};

const FEATURES: Feature[] = [
  {
    id: "bazi",
    href: "/fortune/bazi",
    icon: Coins,
    title: "八字测算",
    desc: "输入出生时辰，AI 老师傅为你拆解性格、事业与姻缘的底层盘面。",
    detail: "28 岁用户排盘后发现事业宫藏偏财，结合流年判断转 AI 赛道时机正好。",
    duration: "约 3 分钟",
    cta: "开始排盘",
    live: true,
  },
  {
    id: "tarot",
    href: "/fortune/tarot",
    icon: Layers,
    title: "塔罗占卜",
    desc: "洗牌、切牌、翻牌，把此刻的困惑交给 78 张牌面的隐喻。",
    detail: "想一个问题抽三张牌，AI 结合牌阵脉络给出当下困惑的方向指引。",
    duration: "约 2 分钟",
    cta: "开始抽牌",
    live: true,
  },
  {
    id: "ziwei",
    href: "/fortune/ziwei",
    icon: Orbit,
    title: "紫微斗数",
    desc: "十二宫安星，命、财、官、夫逐宫推演，看懂人生大格局。",
    detail: "安星排斗、十四主星落宫、四化飞星，看命宫主星与格局层次。",
    duration: "约 3 分钟",
    cta: "开始排盘",
    live: true,
  },
  {
    id: "ask",
    href: "/ask",
    icon: MessagesSquare,
    title: "AI 问答",
    desc: "带着测算结果继续追问，让 AI 把天机翻译成人话。",
    detail: "用户测算后追问明年跳槽时机，AI 结合盘面给出窗口建议。",
    duration: "随时开问",
    cta: "去提问",
    live: true,
  },
];

/* ─── 手风琴：hover 横向展开，其余收缩让位 ─── */

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function AccordionCard({
  feature,
  isActive,
  isDimmed,
  onEnter,
  onLeave,
}: {
  feature: Feature;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const Icon = feature.icon;
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      variants={itemVariants}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "group relative flex h-full overflow-hidden rounded-[1.5rem] border bg-card/40 backdrop-blur-2xl transition-all duration-500",
        isActive
          ? "border-gold-500/40 bg-card/70 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.12)]"
          : "border-border/60",
        !feature.live && "opacity-80",
      )}
      style={{
        flex: reduceMotion ? "1 1 0" : isActive ? "2.2 1 0" : isDimmed ? "0.7 1 0" : "1 1 0",
      }}
    >
      {/* 活动态默认态：纵向窄卡（图标 + 标题） */}
      <div
        className={cn(
          "flex h-full flex-col px-5 pb-5 pt-6 transition-opacity duration-300",
          isActive ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/20">
          <Icon className="size-5" aria-hidden />
        </span>
        <h3 className="mt-auto font-serif text-lg font-semibold whitespace-nowrap">
          {feature.title}
        </h3>
        {feature.badge ? (
          <div className="mt-2">
            <Badge variant={feature.badge.variant}>{feature.badge.label}</Badge>
          </div>
        ) : null}
      </div>

      {/* 活动态展开态：横向内容（图标 + 描述 + 案例 + CTA） */}
      <div
        className={cn(
          "absolute inset-0 flex h-full flex-col justify-between px-6 pt-6 pb-5 transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/20">
            <Icon className="size-4" aria-hidden />
          </span>
          <h3 className="font-serif text-xl font-semibold">{feature.title}</h3>
          {feature.badge ? (
            <Badge variant={feature.badge.variant} className="ml-1">
              {feature.badge.label}
            </Badge>
          ) : null}
        </div>

        {/* hover 切换内容层：描述 ↔ 真实案例 */}
        <div className="relative mt-4 h-10 overflow-hidden">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {feature.desc}
          </p>
        </div>

        {/* 案例详情 */}
        <div className="mt-3 rounded-lg bg-muted/30 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
            真实案例
          </p>
          <p className="mt-1 font-serif text-[12px] italic leading-relaxed text-foreground/75">
            {feature.detail}
          </p>
        </div>

        {/* 底部：时长 + CTA */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground/70">
            <Clock3 className="size-3" aria-hidden />
            {feature.duration}
          </span>
          {feature.live ? (
            <MagneticButton strength={0.25}>
              <Link
                href={feature.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-medium text-background outline-none transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_8px_24px_-8px_rgba(109,90,224,0.28)] group-hover:gap-2.5 active:scale-[0.95]"
              >
                {feature.cta}
                <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden />
              </Link>
            </MagneticButton>
          ) : (
            <span className="text-sm text-muted-foreground/50">{feature.cta}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/** 功能卡：手风琴展开 + hover 切换内容层 + 统一黑白金 */
export function FeatureCards() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      id="divinations"
      className="scroll-mt-24 px-12 pt-4 pb-32 sm:px-16 sm:pb-48 lg:px-24"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Divination"
          title="选一种问法，与天对答"
          subtitle="四种玩法共用一份命盘档案，填一次生日，处处可测。"
        />

        {/* 手风琴容器 */}
        <motion.div
          variants={container}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 flex h-[260px] gap-3"
        >
          {FEATURES.map((feature) => (
            <AccordionCard
              key={feature.id}
              feature={feature}
              isActive={!reduceMotion && activeId === feature.id}
              isDimmed={!reduceMotion && activeId !== null && activeId !== feature.id}
              onEnter={() => setActiveId(feature.id)}
              onLeave={() => setActiveId(null)}
            />
          ))}
        </motion.div>

        {/* 移动端 fallback：网格 */}
        <div className="mt-6 grid gap-4 sm:hidden">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="rounded-[1.5rem] border border-border/60 bg-card/40 p-5 backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/20">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-serif text-lg font-semibold">{feature.title}</h3>
                  {feature.badge ? (
                    <Badge variant={feature.badge.variant} className="ml-1">
                      {feature.badge.label}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
                <div className="mt-3 rounded-lg bg-muted/30 px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
                    真实案例
                  </p>
                  <p className="mt-1 font-serif text-[12px] italic leading-relaxed text-foreground/75">
                    {feature.detail}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground/70">
                    <Clock3 className="size-3" aria-hidden />
                    {feature.duration}
                  </span>
                  {feature.live ? (
                    <Link
                      href={feature.href}
                      className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_8px_24px_-8px_rgba(109,90,224,0.28)] active:scale-[0.95]"
                    >
                      {feature.cta}
                      <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden />
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground/50">{feature.cta}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
