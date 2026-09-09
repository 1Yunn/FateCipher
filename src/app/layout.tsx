import type { Metadata, Viewport } from "next";
import { Inter, Long_Cang, Noto_Serif_SC } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-context";
import { SiteNav } from "@/components/site-nav";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerifSc = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

const longCang = Long_Cang({
  weight: "400",
  variable: "--font-long-cang",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "FateCipher · AI 人生洞察",
    template: "%s · FateCipher",
  },
  description:
    "FateCipher 把命理、性格与人生阶段翻译成你可以执行的下一步。30 秒生成专属 AI 洞察。本站内容仅供娱乐。",
  keywords: [
    "AI 洞察",
    "自我认知",
    "人生规划",
    "FateCipher",
    "AI 算命",
    "八字",
    "塔罗",
    "紫微斗数",
    "今日运势",
    "玄学",
  ],
};

export const viewport: Viewport = {
  themeColor: "#fbfbfd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          notoSerifSc.variable,
          longCang.variable,
          "min-h-dvh bg-background font-sans text-foreground antialiased"
        )}
      >
        <AuthProvider>
          <SiteNav />
          {/* 桌面端给左侧 sidebar 让位，移动端有顶部 bar 用 pt-16 */}
          <div className="pl-0 pt-16 md:pl-16 md:pt-0">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
