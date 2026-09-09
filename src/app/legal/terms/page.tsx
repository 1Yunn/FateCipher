import type { Metadata } from "next";

import { AuraBackground } from "@/components/aura-background";
import { SiteFooter } from "@/components/site-footer";


export const metadata: Metadata = {
  title: "服务条款",
  description: "FateCipher 服务条款",
};

export default function TermsPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <AuraBackground />
      <main className="flex-1">
        <section className="px-12 py-28 sm:px-16 sm:py-40 lg:px-24">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
              Legal
            </p>
            <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              服务条款
            </h1>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                使用 FateCipher 即表示你同意以下条款。
              </p>
              <p>
                本站全部内容由 AI 生成，仅供娱乐与文化体验，不构成医疗、心理、投资、法律或婚恋建议。请勿基于本站内容作出重大人生决策。
              </p>
              <p>
                命理与塔罗的说法属于传统民俗文化，不代表科学结论。
              </p>
              <p>
                我们保留在必要时更新或终止服务的权利。
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
