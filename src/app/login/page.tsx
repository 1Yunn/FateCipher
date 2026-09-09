"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuraBackground } from "@/components/aura-background";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const inputCls =
  "w-full rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-[15px] outline-none transition-all placeholder:text-muted-foreground/40 focus:border-violet-400/50 focus:ring-[3px] focus:ring-violet-400/15";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("请填写邮箱和密码");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <AuraBackground />
      <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-10">
            {/* 标题 */}
            <div className="text-center">
              <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                欢迎回来
              </h1>
              <p className="mt-2 text-[13px] text-muted-foreground">
                输入邮箱和密码登录你的账户
              </p>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                  邮箱
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-[12px] font-medium text-muted-foreground">
                    密码
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    忘记密码？
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-cinnabar/[0.08] px-3 py-2 text-[12px] text-cinnabar"
                >
                  {error}
                </motion.p>
              )}

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    登录中
                  </>
                ) : (
                  "登录"
                )}
              </Button>
            </form>

            {/* 分割线 */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-[11px] text-muted-foreground/50">或使用</span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            {/* 第三方登录占位 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="size-4" viewBox="0 0 24 24" aria-hidden fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* 注册链接 */}
            <p className="mt-6 text-center text-[13px] text-muted-foreground">
              还没有账户？{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground transition-colors hover:text-violet-400"
              >
                立即注册
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground/50">
            本站内容仅供娱乐，不构成任何决策建议
          </p>
        </motion.div>
      </main>
    </div>
  );
}
