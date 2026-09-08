"use client";

/**
 * @deprecated v2 — replaced by `src/components/home/hero-insight.tsx`.
 * Kept on disk per hard constraint (no deletion of existing home/* components).
 * Will no longer be imported by `page.tsx` after Sprint 6 rewrite.
 */
import { animate, motion, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SCORE = 87;
const RING_RADIUS = 38;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** 标题 mask reveal 变体 */
const titleReveal: Variants = {
  hidden: { opacity: 0, y: 20, clipPath: "inset(0 0 100% 0)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 0.8, ease: EASE_OUT, delay: 0.2 },
  },
};

/** 副标题模糊入场 */
const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.0, ease: EASE_OUT, delay: 0.6 },
  },
};

/** CTA 呼吸动画 */
const ctaContainer: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.8 } },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [score, setScore] = useState(reduceMotion ? SCORE : 0);
  const [today, setToday] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 离场视差：标题上移渐隐
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // 3D 倾斜：运势卡鼠标跟随
  const rotateX = useSpring(0, { stiffness: 300, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 20 });

  function handleCardMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 6);
    rotateY.set(px * 6);
  }

  function handleCardLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(new Date())
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setScore(SCORE);
      return;
    }
    const controls = animate(0, SCORE, {
      duration: 1.2,
      ease: "easeOut",
      delay: 0.4,
      onUpdate: (value) => setScore(Math.round(value)),
    });
    return () => controls.stop();
  }, [reduceMotion]);

  // 标题字符拆分
  const titleChars = "夜观天象，";
  const goldChars = "一卦知进退";

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative scroll-mt-24 px-4 pt-36 pb-28 sm:px-6 sm:pt-44 sm:pb-36"
    >
      <motion.div
        style={{ y: reduceMotion ? undefined : heroY, opacity: reduceMotion ? undefined : heroOpacity }}
        variants={container}
        initial={reduceMotion ? "show" : "hidden"}
        animate="show"
        className="mx-auto max-w-3xl text-center"
      >
        <motion.div variants={item} className="flex items-center justify-center gap-4">
          <span
            aria-hidden
            className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/50 sm:w-14"
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
            AI 驱动 · 东方玄学 · 仅供娱乐
          </p>
          <span
            aria-hidden
            className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/50 sm:w-14"
          />
        </motion.div>

        {/* 整段 mask reveal 标题 */}
        <motion.h1
          variants={titleReveal}
          className="mt-10 font-serif text-[2.75rem] leading-[1.15] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
        >
          {titleChars}
          <span className="text-gradient-gold block sm:inline">
            {goldChars}
          </span>
        </motion.h1>

        <motion.p
          variants={blurIn}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg text-balance"
        >
          输入出生信息，AI 帮你把纠结的难题拆成看得懂的趋势与建议 ——
          八字、塔罗、紫微与 AI 问答，一次填档，处处可测。
        </motion.p>

        <motion.div
          variants={ctaContainer}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-2"
        >
          <Button asChild size="lg">
            <a href="#divinations">开始测算</a>
          </Button>
          <a
            href="#divinations"
            className="group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            抽一张塔罗
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-10 flex items-center justify-center gap-4 text-xs text-muted-foreground/60"
        >
          <span aria-hidden className="h-px w-8 bg-border/80" />
          每一次起卦，都是一次自我观照
          <span aria-hidden className="h-px w-8 bg-border/80" />
        </motion.p>

        {/* 今日运势预览卡（产品示例）—— 3D 倾斜 */}
        <motion.div variants={item} className="relative mx-auto mt-20 max-w-lg">
          <div
            aria-hidden
            className="absolute -inset-8 rounded-[3rem] bg-gold-500/[0.07] blur-3xl"
          />
          <motion.div
            ref={cardRef}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
            style={{
              rotateX: reduceMotion ? undefined : rotateX,
              rotateY: reduceMotion ? undefined : rotateY,
              transformPerspective: 800,
            }}
            className="relative rounded-[1.75rem] border border-border/60 bg-card/40 p-7 text-left backdrop-blur-2xl sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] text-muted-foreground">
                今日运势
                {today ? (
                  <span className="ml-2 text-muted-foreground/60">{today}</span>
                ) : null}
              </p>
              <Badge variant="outline">示例预览</Badge>
            </div>

            <div className="mt-7 flex items-center gap-6">
              <div
                className="relative size-[88px] shrink-0"
                role="img"
                aria-label={`综合运势 ${SCORE} 分`}
              >
                <svg viewBox="0 0 88 88" className="size-full -rotate-90">
                  <circle
                    cx="44"
                    cy="44"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="44"
                    cy="44"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="var(--gold-500)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={RING_LENGTH}
                    initial={{ strokeDashoffset: RING_LENGTH }}
                    animate={{
                      strokeDashoffset: RING_LENGTH * (1 - SCORE / 100),
                    }}
                    transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.4 }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[28px] font-bold tabular-nums">
                  {score}
                </span>
              </div>

              <ul className="flex flex-1 flex-wrap gap-2">
                <li>
                  <Badge variant="jade">
                    <span
                      aria-hidden
                      className="size-2 rounded-full bg-jade"
                    />
                    宜 静心
                  </Badge>
                </li>
                <li>
                  <Badge variant="cinnabar">忌 焦虑</Badge>
                </li>
                <li>
                  <Badge variant="default">幸运数字 7</Badge>
                </li>
                <li>
                  <Badge variant="porcelain">幸运色 松石绿</Badge>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex"
      >
        <ArrowDown className="size-4 animate-bounce text-muted-foreground/50 motion-reduce:animate-none" />
      </div>
    </section>
  );
}
