"use client";

import { useState } from "react";
import Link from "next/link";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuth } from "@/components/auth/auth-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getProfile,
  saveProfile,
  deleteProfile,
  type Profile,
  type Gender,
} from "@/lib/profile";
import { HOUR_SLOTS } from "@/lib/bazi";

function hourLabel(hourBranch?: number): string {
  if (typeof hourBranch !== "number") return "时辰未知";
  const slot = HOUR_SLOTS[hourBranch];
  return `${slot.name}（${slot.range}）`;
}

function daysAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 30) return `${days} 天前`;
  if (days < 365) return `${Math.floor(days / 30)} 个月前`;
  return `${Math.floor(days / 365)} 年前`;
}

function ProfileInner() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(() =>
    user ? getProfile(user.email) : null,
  );
  const [editing, setEditing] = useState(false);

  // 表单状态
  const [date, setDate] = useState("");
  const [hour, setHour] = useState<number | null>(null); // -1 = 时辰未知
  const [gender, setGender] = useState<Gender | null>(null);
  const [place, setPlace] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openEdit = () => {
    if (!profile) return;
    setDate(profile.date);
    setHour(profile.hourBranch ?? -1);
    setGender(profile.gender);
    setPlace(profile.place ?? "");
    setError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError(null);
  };

  const handleSave = () => {
    setError(null);
    if (!date) return setError("请选择出生日期");
    if (!gender) return setError("请选择性别");
    if (!user) return;

    const hourBranch = hour === -1 || hour === null ? undefined : hour;
    const saved = saveProfile(user.email, {
      date,
      gender,
      hourBranch,
      place: place || undefined,
      focus: profile?.focus,
    });
    setProfile(saved);
    setEditing(false);
  };

  const handleDelete = () => {
    if (!user) return;
    if (!confirm("确定要删除命盘档案吗？删除后 AI 问答将按通用盘面解读。")) return;
    deleteProfile(user.email);
    setProfile(null);
  };

  const goCreate = () => {
    setDate("");
    setHour(null);
    setGender(null);
    setPlace("");
    setEditing(true);
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh pt-28 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* 标题区 */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              我的档案
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground sm:text-sm">
              填一次出生信息，八字、紫微、AI 问答都会贴身解读你。
            </p>
          </div>

          {!profile && !editing ? (
            // 空态
            <div className="rounded-3xl border border-border/60 bg-card/80 p-10 text-center backdrop-blur-xl">
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-violet-400/15 ring-1 ring-violet-400/25">
                <svg
                  className="size-6 text-violet-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
                </svg>
              </div>
              <h2 className="font-serif text-lg tracking-tight">还没有命盘档案</h2>
              <p className="mt-2 text-[13px] text-muted-foreground">
                花三分钟填一次出生信息，四种玩法共用这份档案。
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/fortune/bazi"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
                >
                  去八字测算立个盘
                </Link>
                <button
                  type="button"
                  onClick={goCreate}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
                >
                  手动建档
                </button>
              </div>
            </div>
          ) : editing ? (
            // 编辑表单
            <div className="rounded-3xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl sm:p-8">
              <h2 className="mb-5 font-serif text-lg tracking-tight">
                {profile ? "编辑档案" : "新建档案"}
              </h2>

              <div className="space-y-4">
                {/* 出生日期 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                    出生日期 <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    max={new Date().toISOString().slice(0, 10)}
                    min="1900-01-01"
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-[15px] outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>

                {/* 性别 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                    性别 <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-3">
                    {(
                      [
                        ["male", "男"],
                        ["female", "女"],
                      ] as [Gender, string][]
                    ).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setGender(val)}
                        className={`flex-1 rounded-xl border px-4 py-2.5 text-[14px] transition-colors ${
                          gender === val
                            ? "border-violet-400/50 bg-violet-400/10 text-violet-500"
                            : "border-border text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 时辰 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                    时辰（选填）
                  </label>
                  <select
                    value={hour === null ? "" : String(hour)}
                    onChange={(e) =>
                      setHour(e.target.value === "" ? null : Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-[14px] outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">时辰未知</option>
                    {HOUR_SLOTS.map((s, i) => (
                      <option key={i} value={i}>
                        {s.name}（{s.range}）
                      </option>
                    ))}
                  </select>
                </div>

                {/* 出生地 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                    出生地（选填）
                  </label>
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="如 北京 海淀"
                    className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-[14px] outline-none transition-shadow placeholder:text-muted-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[12px] text-destructive">
                    {error}
                  </p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (() => {
            const p = profile!;
            return (
            // 档案详情
            <div className="rounded-3xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-lg tracking-tight">
                    {user?.name ?? "我的"} 命盘档案
                  </h2>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    建档 {daysAgo(p.createdAt)} · 上次更新 {daysAgo(p.lastUpdated)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openEdit}
                  className="inline-flex h-8 items-center justify-center rounded-full border border-border px-3 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  编辑
                </button>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-5">
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground/60">出生日期</dt>
                  <dd className="mt-1 font-serif text-2xl font-medium tracking-tight text-foreground">{p.date}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground/60">性别</dt>
                  <dd className="mt-1 font-serif text-2xl font-medium tracking-tight text-foreground">
                    {p.gender === "male" ? "男" : "女"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground/60">时辰</dt>
                  <dd className="mt-1 text-[14px] text-foreground/80">{hourLabel(p.hourBranch)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground/60">出生地</dt>
                  <dd className="mt-1 text-[14px] text-foreground/80">
                    {p.place || <span className="text-muted-foreground/50">未填</span>}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                <p className="text-[12px] text-muted-foreground">
                  这份档案会被八字、紫微、AI 问答共用。
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-[12px] text-muted-foreground transition-colors hover:text-destructive"
                >
                  删除档案
                </button>
              </div>
            </div>
            );
          })()}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileInner />
    </AuthGuard>
  );
}
