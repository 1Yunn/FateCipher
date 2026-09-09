import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth/auth-guard";
import { BaziFlow } from "@/components/bazi/bazi-flow";
import { AuraBackground } from "@/components/aura-background";
import { SiteFooter } from "@/components/site-footer";


export const metadata: Metadata = {
  title: "八字测算",
  description:
    "输入出生时辰，本地排盘引擎推演四柱八字与五行能量。数据仅存于浏览器，AI 深度解读即将上线。",
};

export default function BaziPage() {
  return (
    <AuthGuard>
      <div className="relative flex min-h-dvh flex-col">
        <AuraBackground />
        <main className="flex-1">
          <section className="px-4 pt-32 pb-28 sm:px-6 sm:pt-36">
            <div className="mx-auto max-w-2xl">
              <p className="text-xs font-medium tracking-[0.3em] text-gold-400/80 uppercase">
                Bazi
              </p>
              <h1 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
                八字测算
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                输入出生时辰，本地排盘引擎推演四柱与五行。数据不出浏览器，
                AI 老师傅的深度解读即将上线。
              </p>

              <BaziFlow />
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </AuthGuard>
  );
}
