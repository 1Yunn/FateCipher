"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Coins, Layers, MessagesSquare, Orbit, type LucideIcon } from "lucide-react";
import { useRef } from "react";

import { EASE_OUT } from "@/components/home/shared";
import { cn } from "@/lib/utils";

/** 图标名称 → 组件映射（服务端无法直接传函数给客户端组件） */
const ICON_MAP: Record<string, LucideIcon> = {
  coins: Coins,
  layers: Layers,
  orbit: Orbit,
  "messages-square": MessagesSquare,
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const wordmark: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.0, ease: EASE_OUT },
  },
};

/**
 * WordmarkBand：巨型品牌字滚动带（vocalyze 式章节分隔）
 * - 上方：eyebrow + 衬线标题 + 4 项条目网格
 * - 下方：超大 FateCipher 字标，随滚动横向漂移 + 入场揭示
 * - drift 控制漂移方向（1 右入左出，-1 反向），相邻带交替
 */
export function WordmarkBand({
  kicker,
  title,
  items,
  drift = 1,
  align = "left",
  layout = "grid",
}: {
  kicker: string;
  title: string;
  items: { label: string; desc: string; icon?: string }[];
  drift?: 1 | -1;
  align?: "left" | "right";
  layout?: "grid" | "bars";
}) {
  const isRight = align === "right";
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [drift * 70, drift * -70]);

  return (
    <section
      ref={ref}
      aria-labelledby={`wordmark-${kicker}`}
      className="relative scroll-mt-24 overflow-hidden px-12 py-24 sm:px-16 sm:py-32 lg:px-24"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-80px" }}
        >
          {/* eyebrow */}
          <motion.div variants={item} className={cn("flex items-center gap-3", isRight && "justify-end")}>
            {isRight ? null : <span aria-hidden className="h-5 w-px bg-gold-500/50" />}
            <p
              id={`wordmark-${kicker}`}
              className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80"
            >
              {kicker}
            </p>
            {isRight ? <span aria-hidden className="h-5 w-px bg-gold-500/50" /> : null}
          </motion.div>

          {/* 标题 */}
          <motion.h2
            variants={item}
            className={cn(
              "mt-5 whitespace-nowrap font-serif text-[clamp(1.25rem,4vw,2.5rem)] font-semibold tracking-tight sm:text-4xl",
              isRight && "text-right",
            )}
          >
            {title}
          </motion.h2>

          {/* 条目区 */}
          {layout === "bars" ? (
            <motion.ul
              variants={container}
              className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4"
            >
              {items.map((it) => {
                const Icon = it.icon ? ICON_MAP[it.icon] : undefined;
                return (
                  <motion.li
                    key={it.label}
                    variants={item}
                    className="flex flex-col items-start gap-3 bg-card/80 p-5 backdrop-blur-sm"
                  >
                    {Icon ? (
                      <span className="flex size-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400 ring-1 ring-violet-400/20">
                        <Icon className="size-4" aria-hidden />
                      </span>
                    ) : null}
                    <p className="font-serif text-lg font-medium sm:text-xl">
                      {it.label}
                    </p>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      {it.desc}
                    </p>
                  </motion.li>
                );
              })}
            </motion.ul>
          ) : (
            <motion.ul
              variants={container}
              className={cn(
                "mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4",
                isRight && "text-right",
              )}
            >
              {items.map((it) => (
                <motion.li key={it.label} variants={item}>
                  <p className="font-serif text-lg font-medium sm:text-xl">
                    {it.label}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {it.desc}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </div>

      {/* 巨型字标：滚动漂移 + 入场揭示 */}
      <motion.div
        aria-hidden="true"
        style={{ x: reduceMotion ? undefined : x }}
        className="pointer-events-none mt-12 flex justify-center sm:mt-16"
      >
        <motion.span
          variants={wordmark}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, margin: "-60px" }}
          className="font-serif text-[15vw] leading-[0.95] font-medium tracking-tight whitespace-nowrap text-foreground/[0.06] sm:text-[13vw]"
        >
          FateCipher
        </motion.span>
      </motion.div>
    </section>
  );
}
