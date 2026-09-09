"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * 路由守卫：未登录时拦截页面，显示登录/注册 CTA。
 * 正常渲染（已登录/加载中）时只返回 children，不重复渲染页头/AuraBackground。
 * 未登录拦截时返回遮罩页面，自带背景。
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-violet-400" />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  const redirect = encodeURIComponent(pathname);

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* 遮罩背景（用现有 AuraBackground 的简化替代，避免 import 循环） */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute left-1/4 top-1/4 size-[600px] rounded-full bg-violet-400/5 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 size-[500px] rounded-full bg-porcelain/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="w-full max-w-md text-center"
        >
          <div className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
            {/* 图标 */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-400/15 ring-1 ring-violet-400/25">
              <svg
                className="size-6 text-violet-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            {/* 标题 */}
            <h2 className="mt-5 font-serif text-xl font-semibold tracking-tight sm:text-2xl">
              登录后继续
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {getDenyMessage(pathname)}
            </p>

            {/* 按钮 */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="flex-1">
                <Link href={`/login?redirect=${redirect}`}>登录</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href={`/signup?redirect=${redirect}`}>注册</Link>
              </Button>
            </div>

            {/* 提示 */}
            <p className="mt-5 text-[11px] text-muted-foreground/50">
              本站内容仅供娱乐，不构成任何决策建议
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getDenyMessage(pathname: string): string {
  if (pathname.startsWith("/fortune/bazi")) {
    return "八字排盘需要登录后才能体验，输入出生时辰获取你的四柱命盘。";
  }
  if (pathname.startsWith("/fortune/tarot")) {
    return "塔罗占卜需要登录后才能体验，抽三张牌让 AI 为你解读牌面隐喻。";
  }
  if (pathname.startsWith("/fortune/ziwei")) {
    return "紫微排盘需要登录后才能体验，看十四主星如何落宫、四化飞星指向何处。";
  }
  if (pathname.startsWith("/fortune")) {
    return "命理体系需要登录后才能体验，选择一种问法，与天对答。";
  }
  if (pathname.startsWith("/ask")) {
    return "AI 问答需要登录后才能体验，带着你的问题，让 AI 把天机翻译成人话。";
  }
  return "该功能需要登录后才能体验，请先登录或注册。";
}
