"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  Orbit,
  Sparkles,
  Menu,
  MessageCircle,
  User,
  X,
  UserCircle,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-context";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_LINKS: NavItem[] = [
  { href: "/fortune/bazi", label: "八字", icon: Calendar },
  { href: "/fortune/tarot", label: "塔罗", icon: Sparkles },
  { href: "/fortune/ziwei", label: "紫微", icon: Orbit },
  { href: "/ask", label: "AI 问答", icon: MessageCircle },
];

export function SiteNav() {
  return (
    <>
      <DesktopSidebar />
      <MobileTopBar />
    </>
  );
}

// ==================== 桌面端左侧 Sidebar ====================

function DesktopSidebar() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      aria-label="主导航"
      className="fixed inset-y-0 left-0 z-50 hidden w-16 flex-col border-r border-border/60 bg-background/70 backdrop-blur-xl backdrop-saturate-150 md:flex"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-border/60">
        <Link
          href="/"
          aria-label="FateCipher，返回首页"
          className="flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <LogoMark className="size-7" />
        </Link>
      </div>

      {/* 导航链接 */}
      <nav className="flex flex-1 flex-col items-center gap-1 py-4">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              title={link.label}
              className={cn(
                "group relative flex size-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active-bar"
                  className="absolute left-0 top-2 h-7 w-[3px] rounded-r-full bg-violet-400"
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <Icon className="size-[18px]" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 底部用户区 */}
      <div className="relative border-t border-border/60 p-2">
        {!loading && user ? (
          <>
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-expanded={userMenuOpen}
              aria-haspopup="menu"
              className="flex w-full items-center justify-center rounded-xl p-2 transition-colors hover:bg-accent"
              title={`${user.name} · ${user.email}`}
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-violet-400/15 text-violet-400 ring-1 ring-violet-400/25">
                <User className="size-4" />
              </span>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-hidden="true"
                    tabIndex={-1}
                    onClick={() => setUserMenuOpen(false)}
                    className="fixed inset-0 cursor-default"
                  />
                  <motion.div
                    initial={{ opacity: 0, x: -8, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-full left-[calc(100%+8px)] mb-2 w-44 overflow-hidden rounded-xl border border-border/60 bg-card/95 p-1 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
                    role="menu"
                  >
                    <div className="px-3 py-2">
                      <p className="truncate text-[13px] font-medium">{user.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="my-1 h-px bg-border/60" />
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-accent"
                    >
                      <UserCircle className="size-4 text-muted-foreground" />
                      我的档案
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      role="menuitem"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-cinnabar"
                    >
                      <LogOut className="size-4" />
                      退出登录
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : !loading ? (
          <Link
            href="/login"
            title="登录 / 注册"
            className="flex size-11 w-full items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <User className="size-[18px]" />
          </Link>
        ) : (
          <div className="flex size-11 items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-2 border-border border-t-violet-400" />
          </div>
        )}
      </div>
    </aside>
  );
}

// ==================== 移动端顶部 Bar ====================

function MobileTopBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:hidden">
      <Link
        href="/"
        aria-label="FateCipher，返回首页"
        className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <LogoMark className="size-7" />
        <span className="font-serif text-base font-medium tracking-wide">FateCipher</span>
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "关闭菜单" : "打开菜单"}
        className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 -z-10 cursor-default"
            />
            <motion.nav
              id="mobile-nav"
              aria-label="移动端导航"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-16 border-b border-border/60 bg-background/95 backdrop-blur-xl"
            >
              <div className="mx-auto flex max-w-2xl flex-col gap-1 px-4 py-4">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Home className="size-4" />
                  首页
                </Link>
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="size-4" />
                      {link.label}
                    </Link>
                  );
                })}
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
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-foreground transition-colors hover:bg-accent"
                    >
                      <UserCircle className="size-4 text-muted-foreground" />
                      我的档案
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        handleSignOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-cinnabar"
                    >
                      <LogOut className="size-4" />
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

// ==================== Logo ====================

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
