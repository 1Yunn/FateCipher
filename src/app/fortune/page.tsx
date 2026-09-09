import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AuraBackground } from "@/components/aura-background";
import { FortuneDirectory } from "@/components/fortune/fortune-directory";
import { WeeklyTrending } from "@/components/fortune/weekly-trending";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "玩法矩阵",
  description:
    "八字、塔罗、紫微与 AI 问答 —— 四种玩法共用一份命盘档案，填一次生日，处处可测。",
};

export default function FortunePage() {
  return (
    <AuthGuard>
      <div className="relative flex min-h-dvh flex-col">
        <AuraBackground />
        <SiteHeader />
        <main className="flex-1">
          <FortuneDirectory />
          <WeeklyTrending />
        </main>
        <SiteFooter />
      </div>
    </AuthGuard>
  );
}
