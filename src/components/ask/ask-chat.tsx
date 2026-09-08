"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Crown, SendHorizonal, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { buildReply, loadAskContext, type AskContext } from "@/lib/ask-engine";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const QUOTA_KEY = "xuanji.ask.quota";
const DAILY_LIMIT = 5;

const WELCOME =
  "施主请讲。把你的困惑直接丢给我——事业、姻缘、财运、健康都可以问。若已在「八字测算」立过命盘，我会结合你的盘面来答。";

const SUGGESTIONS = [
  "我今年的事业运怎么样？",
  "最近的桃花运什么时候来？",
  "我适合创业还是稳定上班？",
  "本周财运有什么提醒？",
  "熬夜失眠，五行上怎么调？",
] as const;

type Phase = "idle" | "thinking" | "streaming";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface Quota {
  date: string;
  used: number;
}

/** 本地日期（避免 UTC 偏移导致跨天判断错误） */
function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AskChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [quota, setQuota] = useState<Quota>({ date: today(), used: 0 });
  const [ctx, setCtx] = useState<AskContext>({ hasProfile: false });

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamTimer = useRef<number | null>(null);
  const thinkTimer = useRef<number | null>(null);

  useEffect(() => {
    setCtx(loadAskContext());
    try {
      const raw = window.localStorage.getItem(QUOTA_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Quota;
        if (parsed?.date === today() && typeof parsed.used === "number") {
          setQuota(parsed);
        }
      }
    } catch {
      // 本地存储不可用时静默降级
    }
    return () => {
      if (streamTimer.current) window.clearInterval(streamTimer.current);
      if (thinkTimer.current) window.clearTimeout(thinkTimer.current);
    };
  }, []);

  // 新消息 / 流式输出时自动滚动到底部
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, phase]);

  const remaining = Math.max(0, DAILY_LIMIT - quota.used);
  const exhausted = remaining <= 0;

  const persistQuota = (next: Quota) => {
    setQuota(next);
    try {
      window.localStorage.setItem(QUOTA_KEY, JSON.stringify(next));
    } catch {
      // 本地存储不可用时静默降级
    }
  };

  const streamReply = (full: string) => {
    const id = `${Date.now()}-a`;
    setMessages((current) => [
      ...current,
      { id, role: "assistant", content: "", streaming: true },
    ]);
    setPhase("streaming");
    let cursor = 0;
    streamTimer.current = window.setInterval(() => {
      cursor += 2;
      if (cursor >= full.length) {
        setMessages((current) =>
          current.map((msg) =>
            msg.id === id ? { ...msg, content: full, streaming: false } : msg
          )
        );
        if (streamTimer.current) {
          window.clearInterval(streamTimer.current);
          streamTimer.current = null;
        }
        setPhase("idle");
      } else {
        const next = full.slice(0, cursor);
        setMessages((current) =>
          current.map((msg) => (msg.id === id ? { ...msg, content: next } : msg))
        );
      }
    }, 22);
  };

  /** 调用 /api/ask 流式获取 DeepSeek 回复，失败时降级到本地规则 */
  const fetchAndStream = async (text: string) => {
    const id = `${Date.now()}-a`;
    try {
      const resp = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text, ctx }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`HTTP ${resp.status}`);
      }

      setPhase("streaming");
      setMessages((current) => [
        ...current,
        { id, role: "assistant", content: "", streaming: true },
      ]);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE 以 \n\n 分帧
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const lines = frame.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                acc += delta;
                setMessages((current) =>
                  current.map((msg) =>
                    msg.id === id ? { ...msg, content: acc } : msg,
                  ),
                );
              }
            } catch {
              // 忽略无法解析的帧
            }
          }
        }
      }

      setMessages((current) =>
        current.map((msg) =>
          msg.id === id ? { ...msg, streaming: false } : msg,
        ),
      );
      setPhase("idle");
    } catch {
      // 降级到本地规则引擎
      const reply = buildReply(text, ctx);
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-a-fallback`, role: "assistant", content: "" },
      ]);
      streamReply(reply);
    }
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || phase !== "idle" || exhausted) return;

    // 跨天自动重置额度
    const t = today();
    const used = quota.date === t ? quota.used : 0;
    persistQuota({ date: t, used: used + 1 });

    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-u`, role: "user", content: text },
    ]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setPhase("thinking");

    // 短暂思考态后开始流式输出
    thinkTimer.current = window.setTimeout(
      () => {
        void fetchAndStream(text);
      },
      600 + Math.random() * 400,
    );
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div className="glass mt-10 flex flex-col rounded-3xl p-6 sm:p-8">
      {/* 头部：状态与额度 */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">天机问事</h2>
        <p
          className={cn(
            "text-xs",
            exhausted ? "text-gold-400" : "text-muted-foreground"
          )}
        >
          今日免费 · 剩余 {remaining}/{DAILY_LIMIT} 次
        </p>
      </div>

      {/* 消息区 */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="对话消息"
        className="mt-5 flex max-h-[440px] min-h-[240px] flex-col gap-5 overflow-y-auto pr-1 [scrollbar-width:thin]"
      >
        {messages.map((msg) =>
          msg.role === "user" ? (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="flex justify-end"
            >
              <p className="max-w-[85%] rounded-2xl rounded-br-sm border border-gold-500/25 bg-gold-500/15 px-4 py-3 text-[15px] leading-relaxed">
                {msg.content}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="flex gap-3"
            >
              <AssistantAvatar />
              <div className="glass max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="space-y-2.5 text-[15px] leading-relaxed">
                  {msg.content.split("\n\n").map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                  {msg.streaming ? (
                    <span
                      aria-hidden
                      className="ml-0.5 inline-block h-4 w-[2px] animate-pulse rounded-full bg-gold-400 align-middle"
                    />
                  ) : null}
                </div>
              </div>
            </motion.div>
          )
        )}

        {phase === "thinking" ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="flex gap-3"
          >
            <AssistantAvatar />
            <div className="glass flex items-center gap-2.5 rounded-2xl rounded-bl-sm px-4 py-3 text-[13px] text-muted-foreground">
              <Sparkles className="size-3.5 animate-pulse text-violet-400" aria-hidden />
              老师傅推演中
              <span className="flex gap-0.5" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1 animate-bounce rounded-full bg-violet-400/70"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </span>
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* 快捷提问（仅开场展示） */}
      <AnimatePresence>
        {messages.length <= 1 && phase === "idle" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-5 flex flex-wrap gap-2 overflow-hidden"
          >
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="rounded-full border border-border px-3.5 py-1.5 text-[13px] text-muted-foreground transition-all outline-none hover:border-gold-500/40 hover:text-gold-400 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* 额度用尽：付费提示 */}
      {exhausted ? (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Crown className="size-4 shrink-0 text-gold-400" aria-hidden />
            <p className="text-[13px] leading-relaxed">
              今日 {DAILY_LIMIT} 次免费提问已用完，会员可解锁不限次追问。
            </p>
          </div>
          <Button size="sm" disabled className="shrink-0">
            会员即将上线
          </Button>
        </div>
      ) : null}

      {/* 输入区 */}
      <div className="mt-5 flex items-end gap-2.5">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              autoResize(event.target);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder={
              exhausted ? "今日免费额度已用完，明日再来" : "输入你的困惑，例如：最近适合换工作吗？"
            }
            aria-label="提问输入框"
            disabled={exhausted || phase !== "idle"}
            className="w-full resize-none rounded-xl glass px-4 py-3 text-[15px] outline-none transition-shadow placeholder:text-muted-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
          />
        </div>
        <Button
          size="icon"
          aria-label="发送提问"
          onClick={() => send()}
          disabled={exhausted || phase !== "idle" || !input.trim()}
        >
          <SendHorizonal aria-hidden />
        </Button>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
        <CornerDownLeft className="size-3" aria-hidden />
        Enter 发送 · Shift + Enter 换行 · AI 生成内容仅供娱乐参考
      </p>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <span
      aria-hidden
      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400 ring-1 ring-violet-400/20"
    >
      <Sparkles className="size-4" />
    </span>
  );
}
