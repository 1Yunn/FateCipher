import type { Metadata } from "next";

import { AuraBackground } from "@/components/aura-background";
import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "联系我们",
  description: "有任何想法或反馈，欢迎告诉玄机团队。我们会认真阅读每一条留言。",
};

export default function ContactPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <AuraBackground />
      <SiteHeader />
      <main className="flex-1">
        <section className="px-4 pt-32 pb-28 sm:px-6 sm:pt-36">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-medium tracking-[0.3em] text-gold-400/80 uppercase">
              Contact
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
              联系我们
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              有任何想法、反馈或合作意向，欢迎告诉我们。
              我们会认真阅读每一条留言。
            </p>

            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
