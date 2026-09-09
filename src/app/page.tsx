import { AuraBackground } from "@/components/aura-background";
import { ContactFloatingButton } from "@/components/contact-floating-button";
import { CursorGlow } from "@/components/cursor-glow";
import { FateThread } from "@/components/fate-thread";
import { FeatureCards } from "@/components/feature-cards";
import { Team } from "@/components/home/team";
import { HeroInsight } from "@/components/home/hero-insight";
import { HowItWorks } from "@/components/home/how-it-works";
import { Pricing, EntryHub } from "@/components/home/pricing";
import { TagMarquee } from "@/components/home/marquee";
import { Problems } from "@/components/home/problems";
import { ReportPreview } from "@/components/home/report-preview";
import { Trust } from "@/components/home/trust";
import { UseCases } from "@/components/home/use-cases";
import { Value } from "@/components/home/value";
import { WhoFor } from "@/components/home/who-for";
import { WordmarkBand } from "@/components/home/wordmark-band";
import { SiteFooter } from "@/components/site-footer";
import { SplashCursor } from "@/components/splash-cursor";

export default function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <AuraBackground />
      <FateThread />
      <main className="flex-1">
        {/* Hero → 关键词跑马灯 → 痛点 → 价值 → 定位带 → 场景 → 人群 → 流程 → 报告 → 功能 → 团队 → 信任 → 定价 → 收口 */}
        <HeroInsight />
        <TagMarquee />
        <Problems />
        <Value />
        <WordmarkBand
          kicker="定位"
          title="不是算命，是洞察"
          drift={1}
          items={[
            { label: "理解自己", desc: "看清性格与行为模式" },
            { label: "辅助决策", desc: "在岔路口有依据" },
            { label: "长期成长", desc: "持续的成长建议" },
            { label: "探索方向", desc: "找到人生主线" },
          ]}
        />
        <UseCases />
        <WhoFor />
        <HowItWorks />
        <ReportPreview />
        <FeatureCards />
        <Team />
        <Trust />
        <Pricing />
        <EntryHub />
      </main>
      <SiteFooter />
      <ContactFloatingButton />
      <CursorGlow />
      <SplashCursor />
    </div>
  );
}
