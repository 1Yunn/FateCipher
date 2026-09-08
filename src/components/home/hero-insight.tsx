"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useRef } from "react";

import { MagneticButton } from "@/components/magnetic-button";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/components/home/shared";
import { cn } from "@/lib/utils";

/* ───── 动画变体 ───── */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** 逐字 mask reveal：父级 */
const charParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

/** 逐字 mask reveal：子级 */
const charChild: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 0.7, ease: EASE_OUT },
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

/** CTA 入场 */
const ctaContainer: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 12,
      mass: 0.8,
      delay: 0.85,
    },
  },
};

/** eyebrow 横线绘制 */
const drawLine: Variants = {
  hidden: { scaleX: 0, transformOrigin: "center" },
  show: {
    scaleX: 1,
    transformOrigin: "center",
    transition: { duration: 0.8, ease: EASE_OUT, delay: 0.15 },
  },
};

/** 堆叠卡容器入场 */
const stackContainer: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.6 },
  },
};

/* ───── 报告卡：标签 + 简短结论 ───── */

const REPORT_ROWS = [
  { label: "事业", text: "Q3 转岗时机显现，北方贵人助力，宜果断接 offer" },
  { label: "感情", text: "旧缘该收尾就收尾，9 月新缘将自社交场入门" },
  { label: "财富", text: "正财稳中有进，偏财候春夏之交，勿急勿赌" },
  { label: "行动", text: "先完成城市迁移，再启动投资计划，忌并行" },
] as const;

/** 报告卡内容：4 行「标签 + 结论」垂直循环滚动（双份内容无缝循环） */
function ReportCard() {
  const reduceMotion = useReducedMotion();
  /* 双份内容：让 -50% 位移后第二份接上，实现无缝循环 */
  const rows = [...REPORT_ROWS, ...REPORT_ROWS];
  return (
    <div className="marquee-y-paused relative h-[2.75rem] overflow-hidden">
      <div
        className={cn(
          "w-max space-y-1.5 py-0.5",
          !reduceMotion && "animate-marquee-y",
        )}
      >
        {rows.map((row, i) => (
          <div
            key={`${row.label}-${i}`}
            className="flex items-center gap-2.5"
          >
            <span className="rounded-full border border-border/50 bg-card/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">
              {row.label}
            </span>
            <span className="whitespace-nowrap text-[12px] leading-relaxed text-foreground/70">
              {row.text}
            </span>
          </div>
        ))}
      </div>
      {/* 上下边缘渐变融合 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-card/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-card/80 to-transparent" />
    </div>
  );
}

/* ───── 报告卡数据 ───── */

const STACK_LAYERS = [
  {
    label: "报告",
    accent: "var(--jade)",
    content: <ReportCard />,
  },
] as const;

export function HeroInsight() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  /* 离场视差：标题上移渐隐 */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  /* 滚动时报告卡轻微浮起 */
  const layerY = useTransform(scrollYProgress, [0, 0.6], [0, -48]);

  /* 3D 倾斜：堆叠卡鼠标跟随 */
  const rotateX = useSpring(0, { stiffness: 300, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 20 });

  function handleStackMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !stackRef.current) return;
    const rect = stackRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 5);
    rotateY.set(px * 5);
  }

  function handleStackLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  /* 标题字符拆分：前半段 + 后半段（独立分组控制 stagger） */
  const titleChars = "认清自己，".split("");
  const titleAccent = "看清下一步。".split("");

  /* 平滑滚动到 #ai-demo（Sprint 2 创建） */
  function scrollToDemo(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const target = document.getElementById("ai-demo");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      /* AiDemo 尚未创建时退化为滚到下方 Problems 区 */
      const fallback = document.getElementById("problems") ?? document.getElementById("use-cases");
      fallback?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative scroll-mt-24 px-12 pt-40 pb-36 sm:px-16 sm:pt-48 sm:pb-44 lg:px-24"
    >
      <motion.div
        style={{
          y: reduceMotion ? undefined : heroY,
          opacity: reduceMotion ? undefined : heroOpacity,
        }}
        variants={container}
        initial={reduceMotion ? "show" : "hidden"}
        animate="show"
        className="mx-auto max-w-3xl text-center"
      >
        {/* eyebrow + draw line */}
        <motion.div variants={item} className="flex items-center justify-center gap-4">
          <motion.span
            aria-hidden
            variants={drawLine}
            className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/50 sm:w-14"
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold-400/80">
            AI Personal Insight · 仅供娱乐
          </p>
          <motion.span
            aria-hidden
            variants={drawLine}
            className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/50 sm:w-14"
          />
        </motion.div>

        {/* 标题：逐字 mask reveal */}
        <motion.h1
          variants={charParent}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          className="mt-10 whitespace-nowrap font-serif text-[clamp(1.75rem,6vw,4.5rem)] leading-[1.15] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
        >
          {titleChars.map((ch, i) => (
            <motion.span key={`a-${i}`} variants={charChild} className="inline-block">
              {ch}
            </motion.span>
          ))}
          {/* 后半段独立分组：移动端换行、桌面端同行 */}
          <span className="block sm:inline">
            {titleAccent.map((ch, i) => (
              <motion.span key={`b-${i}`} variants={charChild} className="inline-block text-foreground">
                {ch}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* 副标题：模糊入场 */}
        <motion.p
          variants={blurIn}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          className="mx-auto mt-7 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base text-balance"
        >
          不是算命，也不是闲聊。FateCipher 把命理、性格与人生阶段翻译成你可以执行的下一步。
        </motion.p>

        {/* CTA 簇 */}
        <motion.div
          variants={ctaContainer}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-2"
        >
          <MagneticButton>
            <Button asChild size="lg">
              <a href="/fortune/bazi">开始我的第一份洞察</a>
            </Button>
          </MagneticButton>
          <a
            href="#ai-demo"
            onClick={scrollToDemo}
            className="group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            看 AI 怎么思考
            <ArrowRight
              className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden
            />
          </a>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-10 flex items-center justify-center gap-4 text-xs text-muted-foreground/60"
        >
          <span aria-hidden className="h-px w-8 bg-border/80" />
          每一次洞察，都是一次自我观照
          <span aria-hidden className="h-px w-8 bg-border/80" />
        </motion.p>

        {/* 视觉焦点：报告卡 */}
        <motion.div
          variants={stackContainer}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          className="relative mx-auto mt-20 max-w-lg"
        >
          {/* perspective 容器 + 内层 3D 倾斜 */}
          <div
            ref={stackRef}
            onMouseMove={handleStackMove}
            onMouseLeave={handleStackLeave}
            style={{ perspective: 800 }}
            className="relative"
          >
            <motion.div
              style={{
                rotateX: reduceMotion ? undefined : rotateX,
                rotateY: reduceMotion ? undefined : rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative"
            >
              {/* 报告卡 */}
              <motion.div
                style={{
                  y: reduceMotion ? undefined : layerY,
                  zIndex: 10,
                }}
                className="relative"
              >
                <div className="rounded-[1.5rem] border border-border/60 bg-card/60 p-6 shadow-[0_2px_12px_-4px_rgba(23,23,30,0.04)] backdrop-blur-2xl">
                  <div className="mb-4 flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full"
                      style={{ background: STACK_LAYERS[0].accent }}
                    />
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {STACK_LAYERS[0].label}
                    </p>
                  </div>
                  {STACK_LAYERS[0].content}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* 标签 */}
          <p className="mt-5 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground/50">
            Insight · 报告摘要
          </p>
        </motion.div>
      </motion.div>

      {/* 向下指示 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex"
      >
        <ArrowDown className="size-4 animate-bounce text-muted-foreground/50 motion-reduce:animate-none" />
      </div>
    </section>
  );
}
