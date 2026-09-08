import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth/auth-guard";
import { TarotFlow } from "@/components/tarot/tarot-flow";
import { AuraBackground } from "@/components/aura-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "塔罗占卜",
  description:
    "想一个问题，抽三张牌，AI 为你解读牌面隐喻。78 张全牌阵，3 秒翻牌，内容仅供娱乐参考。",
};

export default function TarotPage() {
  return (
    <AuthGuard>
      <div className="relative flex min-h-dvh flex-col">
        <AuraBackground />
        <SiteHeader />
        <main className="flex-1">
          <section className="px-12 pt-32 pb-28 sm:px-16 sm:pt-36 lg:px-24">
            <div className="mx-auto max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
                Tarot
              </p>
              <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                塔罗占卜
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                想一个问题，抽三张牌，让 78 张牌面的隐喻为你指一个方向。
                数据不出浏览器，内容仅供娱乐。
              </p>

              <TarotFlow />
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </AuthGuard>
  );
}
