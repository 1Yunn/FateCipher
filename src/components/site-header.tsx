"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/fortune/bazi", label: "八字" },
  { href: "/fortune/tarot", label: "塔罗" },
  { href: "/fortune/ziwei", label: "紫微" },
  { href: "/ask", label: "AI 问答" },
] as const;

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleSignOut = () => {
    signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-12 sm:px-16 lg:px-24">
        <Link
          href="/"
          aria-label="FateCipher，返回首页"
          className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <LogoMark className="size-7" />
          <span className="font-serif text-base font-medium tracking-wide">
            FateCipher
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70 sm:inline">
            Insight
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* 未登录：用户图标 + 登录/注册下拉 */}
          {!loading && !user && (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="账户"
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <User className="size-4" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-hidden="true"
                      tabIndex={-1}
                      onClick={() => setUserMenuOpen(false)}
                      className="fixed inset-0 z-10 cursor-default"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full z-20 mt-2 w-36 overflow-hidden rounded-xl border border-border/60 bg-card/95 p-1 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
                    >
                      <Link
                        href="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        登录
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setUserMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        注册
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 已登录：用户头像下拉 */}
          {!loading && user && (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-violet-400/15 text-violet-400 ring-1 ring-violet-400/25">
                  <User className="size-3.5" />
                </span>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-hidden="true"
                      tabIndex={-1}
                      onClick={() => setUserMenuOpen(false)}
                      className="fixed inset-0 z-10 cursor-default"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-border/60 bg-card/95 p-1 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
                    >
                      <div className="px-3 py-2">
                        <p className="truncate text-[13px] font-medium">{user.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="my-1 h-px bg-border/60" />
                      <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent"
                      >
                        我的档案
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="block w-full rounded-lg px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-cinnabar"
                      >
                        退出登录
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 移动端汉堡菜单 */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 -z-10 cursor-default md:hidden"
            />
            <motion.nav
              id="mobile-nav"
              aria-label="移动端导航"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
            >
              <div className="mx-auto flex max-w-5xl flex-col gap-1 px-12 py-4 sm:px-16 lg:px-24">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border/60" />
                {!loading && user ? (
                  <>
                    <div className="rounded-xl px-3 py-2">
                      <p className="text-[13px] font-medium">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-left text-[15px] text-foreground transition-colors hover:bg-accent"
                    >
                      我的档案
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        handleSignOut();
                      }}
                      className="rounded-xl px-3 py-2.5 text-left text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-cinnabar"
                    >
                      退出登录
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      登录
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      注册
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn(className)}>
      <defs>
        <linearGradient id="xj-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A89AF5" />
          <stop offset="0.55" stopColor="#6D5AE0" />
          <stop offset="1" stopColor="#4F41B8" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="rgba(109,90,224,0.10)" />
      <circle
        cx="16"
        cy="16"
        r="9.5"
        fill="none"
        stroke="url(#xj-gold)"
        strokeWidth="1.5"
      />
      <path
        d="M19.5 8.8a9.5 9.5 0 1 0 0 14.4 7.6 7.6 0 1 1 0-14.4Z"
        fill="url(#xj-gold)"
      />
    </svg>
  );
}
