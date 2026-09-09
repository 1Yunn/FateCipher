"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Orbit } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-context";
import { RitualOverlay } from "@/components/ritual-overlay";
import { Button } from "@/components/ui/button";
import { HOUR_SLOTS } from "@/lib/bazi";
import { getProfile, type Profile } from "@/lib/profile";
import { computeZiwei, type ZiweiChart } from "@/lib/ziwei";
import { cn } from "@/lib/utils";

import { ZiweiResult } from "./ziwei-result";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const RITUAL_LINES = [
  "安星 · 定命宫",
  "布曜 · 排十二宫",
  "飞化 · 四化落宫",
];
const MIN_BIRTH = "1900-01-01";
const FOCUS_OPTIONS = ["事业", "财运", "感情", "健康", "贵人"] as const;

type Gender = "male" | "female";

const inputCls =
  "w-full rounded-xl glass px-4 py-3 text-[15px] outline-none transition-shadow placeholder:text-muted-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[invalid=true]:border-destructive";

function hourLabel(hourBranch?: number): string {
  if (typeof hourBranch !== "number") return "时辰未知";
  const slot = HOUR_SLOTS[hourBranch];
  return `${slot.name} ${slot.range}`;
}

export function ZiweiFlow() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [hourValue, setHourValue] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [focus, setFocus] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState(false);
  const [saved, setSaved] = useState<Profile | null>(null);
  const [maxDate, setMaxDate] = useState("");
  const [ritual, setRitual] = useState(false);
  const [chart, setChart] = useState<ZiweiChart | null>(null);

  useEffect(() => {
    if (user) {
      setSaved(getProfile(user.email));
    }
    setMaxDate(new Date().toISOString().slice(0, 10));
  }, [user?.email]);

  const validateDate = (value: string): string | null => {
    if (!value) return "请选择出生日期";
    if (value < MIN_BIRTH) return "出生日期需在 1900 年之后";
    if (value > new Date().toISOString().slice(0, 10))
      return "出生日期不能晚于今天";
    return null;
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setDateError(validateDate(value));
  };

  const goNext = () => {
    if (step === 0) {
      const error = validateDate(date);
      setDateError(error);
      if (error) return;
    }
    setStep((current) => current + 1);
  };

  const applyProfile = () => {
    if (!saved) return;
    const dateValue = typeof saved.date === "string" ? saved.date : "";
    setDate(dateValue);
    setDateError(validateDate(dateValue));
    setHourValue(typeof saved.hourBranch === "number" ? saved.hourBranch : -1);
    setGender(saved.gender === "male" || saved.gender === "female" ? saved.gender : null);
    setFocus(Array.isArray(saved.focus) ? saved.focus.filter((i) => typeof i === "string") : []);
  };

  const startRitual = () => {
    const err = validateDate(date);
    if (err) {
      setDateError(err);
      setStep(0);
      return;
    }
    if (!gender) {
      setGenderError(true);
      return;
    }
    setRitual(true);
  };

  const handleRitualComplete = () => {
    const hour = hourValue !== null && hourValue >= 0 ? hourValue : undefined;
    setChart(computeZiwei(date, hour));
    setRitual(false);
  };

  const reset = () => {
    setChart(null);
    setStep(0);
  };

  const dateText = chart
    ? `${date} · ${hourLabel(hourValue !== null && hourValue >= 0 ? hourValue : undefined)} · ${gender === "male" ? "男命" : "女命"}`
    : "";

  return (
    <>
      <div className="glass mt-10 rounded-3xl p-6 sm:p-8">
        {saved && !chart ? (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-4 py-2.5">
            <p className="truncate text-xs text-muted-foreground">
              检测到八字档案 · {saved.date} {hourLabel(saved.hourBranch)}
            </p>
            <button
              type="button"
              onClick={applyProfile}
              className="shrink-0 rounded text-xs font-medium text-violet-400 transition-colors hover:text-violet-300 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              复用档案
            </button>
          </div>
        ) : null}

        {chart ? (
          <ZiweiResult chart={chart} dateText={dateText} onReset={reset} />
        ) : (
          <>
            {/* 步骤指示 */}
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-medium">紫微排盘</h2>
              <p className="text-xs text-muted-foreground">
                第 {step + 1} 步 · 共 2 步
              </p>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-violet-400 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / 2) * 100}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="mt-8"
              >
                {step === 0 ? (
                  <div className="space-y-7">
                    <div>
                      <label htmlFor="ziwei-date" className="text-sm font-medium">
                        出生日期<span className="text-cinnabar"> *</span>
                      </label>
                      <input
                        id="ziwei-date"
                        type="date"
                        value={date}
                        min={MIN_BIRTH}
                        max={maxDate || undefined}
                        onChange={(e) => handleDateChange(e.target.value)}
                        aria-invalid={Boolean(dateError)}
                        className={cn(inputCls, "mt-2.5")}
                      />
                      {dateError ? (
                        <p role="alert" className="mt-2 text-xs text-cinnabar">
                          {dateError}
                        </p>
                      ) : null}
                    </div>

                    <fieldset>
                      <legend className="text-sm font-medium">
                        出生时辰
                        <span className="ml-2 font-normal text-muted-foreground/60">
                          选填 · 影响命宫落点
                        </span>
                      </legend>
                      <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        <button
                          type="button"
                          aria-pressed={hourValue === -1}
                          onClick={() => setHourValue(-1)}
                          className={cn(
                            "rounded-xl border px-2 py-2.5 text-center transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                            hourValue === -1
                              ? "border-violet-400/50 bg-violet-400/10 text-violet-400"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="block text-sm font-medium">未知</span>
                          <span className="mt-0.5 block font-mono text-[11px] opacity-70">
                            近似排
                          </span>
                        </button>
                        {HOUR_SLOTS.map((slot) => (
                          <button
                            key={slot.branch}
                            type="button"
                            aria-pressed={hourValue === slot.branch}
                            onClick={() => setHourValue(slot.branch)}
                            className={cn(
                              "rounded-xl border px-2 py-2.5 text-center transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                              hourValue === slot.branch
                                ? "border-violet-400/50 bg-violet-400/10 text-violet-400"
                                : "border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <span className="block text-sm font-medium">{slot.name}</span>
                            <span className="mt-0.5 block font-mono text-[11px] opacity-70">
                              {slot.range}
                            </span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="space-y-7">
                    <fieldset>
                      <legend className="text-sm font-medium">
                        性别<span className="text-cinnabar"> *</span>
                      </legend>
                      <div className="mt-2.5 grid grid-cols-2 gap-3">
                        {(
                          [
                            { value: "male", label: "男" },
                            { value: "female", label: "女" },
                          ] as const
                        ).map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={gender === option.value}
                            onClick={() => {
                              setGender(option.value);
                              setGenderError(false);
                            }}
                            className={cn(
                              "rounded-2xl border px-4 py-4 text-center text-[15px] font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                              gender === option.value
                                ? "border-violet-400/60 bg-violet-400/10 text-foreground"
                                : "border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {genderError ? (
                        <p role="alert" className="mt-2 text-xs text-cinnabar">
                          请选择性别
                        </p>
                      ) : null}
                    </fieldset>

                    <fieldset>
                      <legend className="text-sm font-medium">
                        关注方向
                        <span className="ml-2 font-normal text-muted-foreground/60">
                          可多选 · AI 解读将侧重这些宫位
                        </span>
                      </legend>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {FOCUS_OPTIONS.map((option) => {
                          const selected = focus.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                setFocus((cur) =>
                                  selected ? cur.filter((i) => i !== option) : [...cur, option]
                                )
                              }
                              className={cn(
                                "rounded-full border px-4 py-1.5 text-[13px] transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                selected
                                  ? "border-violet-400/40 bg-violet-400/10 text-violet-400"
                                  : "border-border text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                  <ChevronLeft aria-hidden />
                  上一步
                </Button>
              ) : (
                <span aria-hidden />
              )}

              {step < 1 ? (
                <Button onClick={goNext} disabled={step === 0 && !date}>
                  下一步
                  <ArrowRight aria-hidden />
                </Button>
              ) : (
                <Button onClick={startRitual} disabled={!gender}>
                  <Orbit aria-hidden />
                  安星排盘
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <RitualOverlay
        open={ritual}
        lines={RITUAL_LINES}
        onComplete={handleRitualComplete}
        minDuration={2600}
      />
    </>
  );
}
