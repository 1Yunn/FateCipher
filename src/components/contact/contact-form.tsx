"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const TOPICS = [
  "功能反馈",
  "Bug 报告",
  "内容建议",
  "合作意向",
  "其他",
] as const;

/** 联系表单：主题选择 + 留言 + 提交状态 */
export function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("loading");
    // 模拟提交（仅前端，无后端）
    setTimeout(() => {
      setStatus("done");
    }, 1200);
  }

  if (status === "done") {
    return (
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-col items-center gap-4 rounded-[1.5rem] border border-border/60 bg-card/40 p-10 text-center backdrop-blur-2xl"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-jade/15 text-jade">
          <Check className="size-6" aria-hidden />
        </span>
        <div>
          <p className="text-lg font-semibold">已收到你的留言</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            我们会认真阅读，感谢你的反馈。
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setStatus("idle");
            setTopic("");
            setMessage("");
            setEmail("");
          }}
        >
          再写一条
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="mt-10 space-y-6"
    >
      {/* 主题选择 */}
      <fieldset>
        <legend className="text-sm font-medium">主题</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
                topic === t
                  ? "border-gold-500/40 bg-gold-500/10 text-gold-400"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 邮箱（选填） */}
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          邮箱
          <span className="ml-2 text-xs text-muted-foreground/60">选填，方便我们回复你</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-border/60 bg-card/40 px-4 py-3 text-[15px] outline-none backdrop-blur-2xl transition-colors placeholder:text-muted-foreground/40 focus:border-gold-500/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      {/* 留言 */}
      <div>
        <label htmlFor="message" className="text-sm font-medium">
          留言
          <span className="ml-1 text-cinnabar">*</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="想说的话……"
          className="mt-2 w-full resize-none rounded-2xl border border-border/60 bg-card/40 px-4 py-3 text-[15px] leading-relaxed outline-none backdrop-blur-2xl transition-colors placeholder:text-muted-foreground/40 focus:border-gold-500/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      {/* 提交 */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground/60">
          提交即表示你同意我们的
          <a href="/legal/privacy" className="ml-1 underline-offset-4 hover:underline">
            隐私政策
          </a>
        </p>
        <Button type="submit" size="lg" disabled={status === "loading" || !message.trim()}>
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              发送中
            </>
          ) : (
            <>
              发送
              <Send className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}
