import type { Metadata } from "next";

import { AskChat } from "@/components/ask/ask-chat";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AuraBackground } from "@/components/aura-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "AI 问答",
  description:
    "带着测算结果继续追问，AI 老师傅把天机翻译成人话。每日 5 次免费提问，随时开问。内容仅供娱乐参考。",
};

export default function AskPage() {
  return (
    <AuthGuard>
      <div className="relative flex min-h-dvh flex-col">
        <AuraBackground />
        <SiteHeader />
        <main className="flex-1">
          <section className="px-4 pt-32 pb-28 sm:px-6 sm:pt-36">
            <div className="mx-auto max-w-2xl">
              <p className="text-xs font-medium tracking-[0.3em] text-gold-400/80 uppercase">
                AI Oracle
              </p>
              <h1 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
                AI 问答
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                带着测算结果继续追问，AI 老师傅把天机翻译成人话。
                每日 5 次免费，问完即走。
              </p>

              <AskChat />
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </AuthGuard>
  );
}
