"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { MagneticButton } from "@/components/magnetic-button";
import {
  Section,
  SectionHeading,
  container,
  item,
} from "@/components/home/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tier = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  cta: string;
  featured?: boolean;
  features: string[];
};

const TIERS: Tier[] = [
  {
    id: "basic",
    name: "启运版",
    tagline: "初识 FateCipher",
    price: "免费",
    period: "永久",
    cta: "立即开始",
    features: [
      "八字基础排盘（四柱 · 五行）",
      "塔罗 3 张牌阵占卜",
      "AI 问答 5 次 / 天",
      "内容仅供娱乐标识",
    ],
  },
  {
    id: "glimmer",
    name: "观星版",
    tagline: "看见更多可能",
    price: "¥29",
    period: "/ 月",
    cta: "升级观星",
    features: [
      "启运版全部权益",
      "八字完整命书（性格 · 事业 · 姻缘）",
      "塔罗不限牌阵 + 深度解读",
      "AI 问答 30 次 / 天",
      "历史测算记录保存",
    ],
  },
  {
    id: "candle",
    name: "掌运版",
    tagline: "照亮每一个岔路口",
    price: "¥69",
    period: "/ 月",
    cta: "升级掌运",
    featured: true,
    features: [
      "观星版全部权益",
      "紫微斗数完整格局报告",
      "大运流年推演",
      "事业姻缘专项分析",
      "AI 问答不限次",
      "优先体验新功能",
    ],
  },
  {
    id: "insight",
    name: "天机版",
    tagline: "长期陪伴的人生伙伴",
    price: "¥199",
    period: "/ 月",
    cta: "升级天机",
    features: [
      "掌运版全部权益",
      "一对一 AI 深度长对话",
      "月度人生规划报告",
      "专属解读模板",
      "优先客服响应",
    ],
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/** 定价方案：4 档套餐，烛照版为主推 */
export function Pricing() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="pricing" className="pb-28 sm:pb-36">
      <SectionHeading
        eyebrow="Pricing"
        title="选一束适合你的光"
        subtitle="从免费到深度陪伴，每一版都把命理翻译成你能走的下一步。随时可取消。"
      />

      <motion.div
        variants={container}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {TIERS.map((tier) => {
          const featured = tier.featured;
          return (
            <motion.div
              key={tier.id}
              variants={cardVariants}
              className={cn(
                "relative flex flex-col rounded-[1.5rem] border p-6 backdrop-blur-2xl transition-shadow duration-300",
                featured
                  ? "border-foreground/20 bg-card/80 shadow-[0_8px_32px_-12px_rgba(109,90,224,0.18)] lg:-mt-4 lg:mb-4"
                  : "border-border/60 bg-card/40",
              )}
            >
              {/* 套餐名 + 推荐角标（右侧内联） */}
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-serif text-xl font-semibold",
                    featured ? "text-foreground" : "text-foreground/90",
                  )}
                >
                  {tier.name}
                </h3>
                {featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-400/15 px-2 py-0.5 text-[10px] font-medium text-violet-400 ring-1 ring-violet-400/20">
                    <Sparkles className="size-2.5" aria-hidden />
                    推荐
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {tier.tagline}
              </p>

              {/* 价格 */}
              <div className="mt-5 flex items-baseline gap-1">
                <span
                  className={cn(
                    "font-serif text-3xl font-semibold tracking-tight",
                    featured ? "text-foreground" : "text-foreground",
                  )}
                >
                  {tier.price}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {tier.period}
                </span>
              </div>

              {/* CTA */}
              <div className="mt-5">
                <MagneticButton strength={0.3}>
                  <Button
                    variant={featured ? "default" : "outline"}
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </MagneticButton>
              </div>

              {/* 权益列表 */}
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                        featured ? "bg-violet-400/15 text-violet-400" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Check className="size-2.5" aria-hidden />
                    </span>
                    <span className="text-[13px] leading-relaxed text-muted-foreground">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 底部说明 */}
      <motion.p
        variants={item}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="mt-10 text-center text-[11px] text-muted-foreground/60"
      >
        所有解读由 AI 生成，仅供娱乐参考，不构成任何决策建议。
        <br className="sm:hidden" />
        支付后立即生效，可随时在账户中取消订阅。
      </motion.p>
    </Section>
  );
}

/* ───── 快速入口：简洁单 CTA ───── */

/** 底部单入口：类似顶部导航的克制感，一句话 + 一个按钮 */
export function EntryHub() {
  const reduceMotion = useReducedMotion();
  return (
    <Section id="entries" className="pt-0 pb-28 sm:pb-36">
      <motion.div
        variants={container}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.p
          variants={item}
          className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold-400/80"
        >
          现在就开始
        </motion.p>
        <motion.h2
          variants={item}
          className="mt-5 whitespace-nowrap font-serif text-[clamp(1.5rem,5vw,3.25rem)] leading-[1.15] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          从一份命盘开始
        </motion.h2>
        <motion.p
          variants={item}
          className="mt-3 text-sm leading-relaxed text-muted-foreground"
        >
          输入出生时辰，3 分钟拿到你的第一份洞察。
        </motion.p>
        <motion.div variants={item} className="mt-8">
          <MagneticButton>
            <Button asChild size="lg">
              <Link href="/fortune/bazi">
                开始排盘
                <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden />
              </Link>
            </Button>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </Section>
  );
}
