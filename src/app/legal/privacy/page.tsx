import type { Metadata } from "next";

import { AuraBackground } from "@/components/aura-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "FateCipher 隐私政策",
};

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <AuraBackground />
      <SiteHeader />
      <main className="flex-1">
        <section className="px-12 py-28 sm:px-16 sm:py-40 lg:px-24">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400/80">
              Legal
            </p>
            <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              隐私政策
            </h1>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                FateCipher 尊重并保护每位用户的隐私。本政策说明我们如何收集、使用和保护你的信息。
              </p>
              <p>
                我们仅在必要时收集你主动输入的信息（如出生时辰），且数据仅存储于你的浏览器本地，不上传至服务器。
              </p>
              <p>
                AI 对话内容仅用于生成即时回复，不会被持久化存储或用于模型训练。
              </p>
              <p>
                本站全部内容仅供娱乐与文化体验，不构成任何专业建议。
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
