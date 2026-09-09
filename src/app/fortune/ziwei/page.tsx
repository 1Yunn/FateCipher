import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AuraBackground } from "@/components/aura-background";
import { SiteFooter } from "@/components/site-footer";
import { ZiweiFlow } from "@/components/ziwei/ziwei-flow";

export const metadata: Metadata = {
  title: "紫微斗数",
  description:
    "输入出生时辰，安星排斗、十二宫定位，看命宫主星与四化飞星。娱乐简化排盘，内容仅供参考。",
};

export default function ZiweiPage() {
  return (
    <AuthGuard>
      <div className="relative flex min-h-dvh flex-col">
        <AuraBackground />
        <main className="flex-1">
          <section className="px-4 pt-32 pb-28 sm:px-6 sm:pt-36">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-violet-400/80">
                Ziwei
              </p>
              <h1 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
                紫微斗数
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                十二宫安星，命、财、官、夫逐宫推演。输入出生时辰，看十四主星如何落宫、
                四化飞星指向何处。娱乐简化排盘，数据不出浏览器。
              </p>

              <ZiweiFlow />
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </AuthGuard>
  );
}
