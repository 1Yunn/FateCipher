"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import { container, item } from "@/components/home/shared";

/* ─── 创始人板块 ───
   布局：左文右图并排（杂志专栏式）
   照片：160px 正方形 + 3D 倾斜 + 点击旋转
   签名：右下角手写体 */

export function Founder() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "center 50%"],
  });

  const fogOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fogBlur = useTransform(scrollYProgress, [0, 0.6], [12, 0]);
  const fogY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);
  const fogFilter = useTransform(fogBlur, (b) => `blur(${b}px)`);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 15, mass: 0.4 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 15, mass: 0.4 });

  const [isHover, setIsHover] = useState(false);
  const [spin, setSpin] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 70);
    rotateX.set(-(py - 0.5) * 70);
  }

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-24 px-12 py-32 sm:px-16 sm:py-48 lg:px-24"
    >
      <motion.div
        variants={container}
        initial={reduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, margin: "-100px" }}
        className="mx-auto max-w-3xl"
      >
        {/* eyebrow */}
        <motion.div variants={item} className="flex items-center gap-3">
          <span aria-hidden className="h-5 w-px bg-gold-500/50" />
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
            A Letter to You
          </p>
        </motion.div>

        {/* 左文右图并排 */}
        <div className="mt-8 grid items-center gap-10 sm:gap-14 md:grid-cols-5">
          {/* 左：文案（3/5） */}
          <motion.div variants={container} className="md:col-span-3">
            <motion.p
              variants={item}
              className="font-serif text-lg leading-relaxed text-foreground/90 sm:text-xl"
            >
              我不知道你会不会用这个产品。
            </motion.p>
            <div className="mt-4 space-y-4">
              <motion.p
                variants={item}
                className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
              >
                但如果你正站在某个路口——换工作、走进一段关系、决定要不要 all in，或只是在某个深夜觉得「好像哪里不对」——
              </motion.p>
              <motion.p
                variants={item}
                className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
              >
                那么玄机想做的，不是告诉你答案是什么，而是陪你把模糊的焦虑，拆成可以动手的下一步。
              </motion.p>
              <motion.p
                variants={item}
                className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
              >
                几千年的方法论，翻译成你能听懂的语言。就这一件事。
              </motion.p>
            </div>

            {/* 签名：右下角 */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-col items-end gap-1"
            >
              <span className="font-[family-name:var(--font-long-cang)] text-3xl text-foreground/80">
                Yunn_
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/40">
                Founder · FateCipher
              </span>
            </motion.div>
          </motion.div>

          {/* 右：照片（2/5） */}
          <motion.div variants={item} className="flex justify-center md:col-span-2 md:justify-end" style={{ perspective: 800 }}>
            <motion.div
              className="relative size-[160px]"
              style={{ perspective: 800 }}
            >
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">
                悬浮倾斜 · 点击旋转
              </span>

              <motion.div
                className="group relative h-full w-full cursor-pointer rounded-[1.25rem] border border-border/60 bg-card/40 p-1 backdrop-blur-2xl"
                style={{
                  rotateX: reduceMotion ? undefined : springX,
                  rotateY: reduceMotion ? undefined : springY,
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  y: !reduceMotion && isHover ? -6 : 0,
                  rotate: spin ? 360 : 0,
                  boxShadow: isHover
                    ? "0_16px_40px_-10px_rgba(0,0,0,0.15)"
                    : "0_8px_40px_-12px_rgba(0,0,0,0.1)",
                }}
                transition={{
                  y: { type: "spring", stiffness: 250, damping: 22, mass: 0.6 },
                  rotate: { type: "spring", stiffness: 60, damping: 16, mass: 1 },
                  boxShadow: { duration: 0.3 },
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => { setIsHover(false); rotateX.set(0); rotateY.set(0); }}
                onClick={() => setSpin((s) => !s)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1rem]">
                  <motion.img
                    src="/founder.jpg"
                    alt="Yunn_ 创始人"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = "none";
                      t.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/40 to-muted/20">
                    <span className="font-serif text-2xl text-muted-foreground/40">Y</span>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Founder</span>
                  </div>

                  {!reduceMotion && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-md"
                      style={{
                        opacity: fogOpacity,
                        filter: fogFilter,
                        y: fogY,
                      }}
                    >
                      <span className="font-serif text-sm text-muted-foreground/50">
                        滚动揭开
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
