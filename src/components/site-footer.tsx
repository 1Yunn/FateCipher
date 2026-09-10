import Link from "next/link";

import { LogoMark } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";

const PLAY_LINKS = [
  { href: "/fortune/bazi", label: "八字测算", live: true },
  { href: "/fortune/tarot", label: "塔罗占卜", live: true },
  { href: "/fortune/ziwei", label: "紫微斗数", live: true },
  { href: "/ask", label: "AI 问答", live: true },
] as const;

const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "隐私政策" },
  { href: "/legal/terms", label: "服务条款" },
] as const;

export function SiteFooter() {
  return (
    <footer
      id="disclaimer"
      className="scroll-mt-24 border-t border-border/60 bg-background/40"
    >
      <div className="mx-auto max-w-4xl px-12 py-20 sm:px-16 lg:px-24">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-7" />
              <span className="font-serif text-base font-medium tracking-wide">
                FateCipher
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              命数可解 · 下一步可循。
            </p>
            <Badge variant="jade" className="mt-4">
              仅供娱乐 · 无任何决策建议
            </Badge>
          </div>

          <nav
            aria-label="页脚导航"
            className="grid grid-cols-2 gap-10 sm:gap-16"
          >
            <div>
              <h3 className="text-sm font-semibold">玩法</h3>
              <ul className="mt-4 space-y-2.5">
                {PLAY_LINKS.map((link) =>
                  link.live ? (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <span className="text-sm text-muted-foreground/50">
                        {link.label}（即将上线）
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">合规</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href="#disclaimer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    免责声明
                  </a>
                </li>
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8">
          <p className="text-xs leading-relaxed text-muted-foreground/80">
            免责声明：本站全部内容由 AI 生成，仅供娱乐与文化体验，不构成医疗、心理、投资、法律或婚恋建议；请勿基于本站内容作出重大人生决策。命理与塔罗的说法属于传统民俗文化，不代表科学结论。
          </p>
          <div className="mt-4 flex flex-col justify-between gap-2 text-xs text-muted-foreground/60 sm:flex-row">
            <p>© {new Date().getFullYear()} FateCipher</p>
            <p>18 周岁以下请在监护人陪同下使用</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
