import { NextResponse } from "next/server";

import type { AskContext } from "@/lib/ask-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";

/** 系统提示词：让 AI 扮演命理顾问，风格参照 ask-engine 的三段式表达 */
function buildSystemPrompt(ctx: AskContext): string {
  const profile = ctx.hasProfile
    ? `用户命盘档案：属${ctx.zodiac}，日主${ctx.dayStem}（${ctx.dayElement}命人），盘面五行中${ctx.dominantElement}气最旺。回答须结合此盘面。`
    : "用户尚未立命盘档案，按通用盘面解读，并在结尾温和引导用户去「八字测算」立盘。";

  return `你是「FateCipher」的 AI 命理顾问，一位温和、克制、有阅历的老师傅。你的职责是用东方命理的视角帮用户看清困惑，但不做铁口直断的预言。

核心原则：
1. 内容仅供娱乐参考，绝不能作为决策的唯一依据，也不能替代专业建议（就医、法律、投资等）。
2. 语气沉稳、有温度，像一位有阅历的长辈，不用玄乎的术语堆砌，把命理翻译成大白话。
3. 回答结构：开场承接 → 三句核心判断 → 一条可执行的行动建议 → 金句收尾。每部分之间空一行。
4. 若用户问健康，结尾必须提醒「若持续不适请及时就医，玄学不能替代医嘱」。
5. 不要输出「以下是我的分析」之类的元话语，直接给内容。

${profile}`;
}

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  let body: { input?: string; ctx?: AskContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = (body.input ?? "").trim();
  if (!input) {
    return NextResponse.json({ error: "Empty input" }, { status: 400 });
  }

  const ctx: AskContext = body.ctx ?? { hasProfile: false };

  try {
    const upstream = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(ctx) },
          { role: "user", content: input },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: `Upstream ${upstream.status}`, detail: text.slice(0, 200) },
        { status: 502 },
      );
    }

    // 透传 SSE 流
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Network error", detail: err instanceof Error ? err.message : "" },
      { status: 502 },
    );
  }
}
