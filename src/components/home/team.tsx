"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { container } from "@/components/home/shared";

/* ─── 创始团队板块 ───
   默认：CSS 版画风（高对比+低饱和+边缘锐化），极简卡通形象
   hover：卡通层淡出，真实彩色照片淡入
   持续：呼吸式微缩放
   入场：blur 上浮 stagger */

type Member = {
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  initial: string;
  zoom?: number;
  pos?: string;
};

const TEAM: Member[] = [
  {
    name: "章青云",
    role: "Founder · Product",
    bio: "把古老方法论翻译成现代语言。",
    photo: "/founder.jpg",
    initial: "章",
    zoom: 1,
    pos: "center",
  },
  {
    name: "陆衍",
    role: "AI Engineer",
    bio: "让模型读懂盘面背后的故事。",
    photo: "/team-2.jpg.webp",
    initial: "陆",
    zoom: 1,
    pos: "center 20%",
  },
  {
    name: "叶清",
    role: "Design",
    bio: "让每一次浏览都像翻一本好书。",
    photo: "/team-3.jpg.webp",
    initial: "叶",
    zoom: 1,
    pos: "center 20%",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const breatheTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

function TeamCard({ member }: { member: Member }) {
  const reduceMotion = useReducedMotion();
  const hasPhoto = !!member.photo;

  return (
    <motion.div variants={cardVariants} className="group flex flex-col items-center text-center">
      {/* 圆形照片容器 */}
      <div className="relative size-28 overflow-hidden rounded-full border border-border/60 bg-card/40 backdrop-blur-2xl transition-all duration-500 group-hover:border-gold-500/30 group-hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] sm:size-32">
        {hasPhoto ? (
          <motion.img
            src={member.photo ?? undefined}
            alt={member.name}
            className="h-full w-full object-cover"
            style={{
              objectPosition: member.pos ?? "center",
              scale: member.zoom ?? 1,
            }}
            animate={reduceMotion ? undefined : { scale: [member.zoom ?? 1, (member.zoom ?? 1) * 1.03, member.zoom ?? 1] }}
            transition={breatheTransition}
            whileHover={reduceMotion ? undefined : { scale: (member.zoom ?? 1) * 1.1 }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20">
            <span className="font-serif text-3xl text-muted-foreground/30">
              {member.initial}
            </span>
          </div>
        )}
      </div>

      {/* 名字 */}
      <h3 className="mt-5 font-serif text-base font-semibold">
        {member.name}
      </h3>

      {/* 角色 */}
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
        {member.role}
      </p>

      {/* 分隔线 */}
      <span className="mt-3 h-px w-8 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      {/* 简介 */}
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
        {member.bio}
      </p>
    </motion.div>
  );
}

export function Team() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="scroll-mt-24 px-12 py-32 sm:px-16 sm:py-48 lg:px-24">
      <motion.div
        variants={container}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, margin: "-80px" }}
        className="mx-auto max-w-3xl"
      >
        {/* eyebrow */}
        <motion.div className="flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/50 sm:w-14" />
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
            Team
          </p>
          <span aria-hidden className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/50 sm:w-14" />
        </motion.div>

        {/* 标题 */}
        <motion.h2 className="mt-5 text-center whitespace-nowrap font-serif text-[clamp(1.25rem,4vw,2.5rem)] font-semibold tracking-tight sm:text-4xl">
          站在 FateCipher 背后的团队
        </motion.h2>
        <motion.p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          小团队，做一件事，慢慢做。
        </motion.p>

        {/* 团队卡：一排三个 */}
        <div className="mt-14 grid grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <TeamCard key={member.role} member={member} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
