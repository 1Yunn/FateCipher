"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-context";

/**
 * 路由守卫：未登录时直接重定向到统一登录页（带 redirect 参数）。
 * 所有登录入口统一走 /login 页面，保持体验一致。
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirect = encodeURIComponent(pathname);

  // useEffect 必须在所有条件 return 之前调用（hooks 规则）
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [loading, user, router, redirect]);

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

  // 重定向期间显示 loading
  return (
    <div className="relative flex min-h-dvh items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-border border-t-violet-400" />
    </div>
  );
}
