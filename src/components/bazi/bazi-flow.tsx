"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { BaziResult, type BaziResultInfo } from "@/components/bazi/bazi-result";
import { RitualOverlay } from "@/components/ritual-overlay";
import { Button } from "@/components/ui/button";
import {
  computeBazi,
  HOUR_SLOTS,
  type BaziChart,
} from "@/lib/bazi";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const STORAGE_KEY = "xuanji.profile.bazi";
const RITUAL_LINES = [
  "推演天机 · 起四柱",
  "观星定位 · 定五行",
  "安星排盘 · 凝命盘",
];
const MIN_BIRTH = "1900-01-01";
const FOCUS_OPTIONS = ["姻缘", "事业", "财富", "学业", "健康"] as const;

type Gender = "male" | "female";

interface Profile {
  date: string;
  hourBranch?: number;
  gender: Gender;
  focus: string[];
  place?: string;
  savedAt: string;
}

const inputCls =
  "w-full rounded-xl glass px-4 py-3 text-[15px] outline-none transition-shadow placeholder:text-muted-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[invalid=true]:border-destructive";

function hourLabel(hourBranch?: number): string {
  if (typeof hourBranch !== "number") return "时辰未知";
  const slot = HOUR_SLOTS[hourBranch];
  return `${slot.name} ${slot.range}`;
}

export function BaziFlow() {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [hourValue, setHourValue] = useState<number | null>(null); // -1 = 时辰未知
  const [place, setPlace] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [focus, setFocus] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState(false);
  const [saved, setSaved] = useState<Profile | null>(null);
  const [maxDate, setMaxDate] = useState("");
  const [ritual, setRitual] = useState(false);
  const [chart, setChart] = useState<BaziChart | null>(null);
  const [resultInfo, setResultInfo] = useState<BaziResultInfo | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw) as Profile);
    } catch {
      // 本地存储不可用时静默降级
    }
    setMaxDate(new Date().toISOString().slice(0, 10));
  }, []);

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
    setPlace(typeof saved.place === "string" ? saved.place : "");
    setGender(
      saved.gender === "male" || saved.gender === "female" ? saved.gender : null
    );
    setFocus(
      Array.isArray(saved.focus)
        ? saved.focus.filter((item) => typeof item === "string")
        : []
    );
  };

  const startRitual = () => {
    const dateErrorValue = validateDate(date);
    if (dateErrorValue) {
      setDateError(dateErrorValue);
      setStep(0);
      return;
    }
    if (!gender) {
      setGenderError(true);
      return;
    }
    const profile: Profile = {
      date,
      hourBranch: hourValue !== null && hourValue >= 0 ? hourValue : undefined,
      gender,
      focus,
      place: place || undefined,
      savedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSaved(profile);
    } catch {
      // 本地存储不可用时静默降级
    }
    setResultInfo({
      date: profile.date,
      hourText: hourLabel(profile.hourBranch),
      genderText: gender === "male" ? "男命" : "女命",
    });
    setRitual(true);
  };

  const handleRitualComplete = () => {
    const hour =
      hourValue !== null && hourValue >= 0 ? hourValue : undefined;
    setChart(computeBazi(date, hour));
    setRitual(false);
  };

  const reset = () => {
    setChart(null);
    setResultInfo(null);
    setStep(0);
  };

  const genderText =
    gender === null ? "" : gender === "male" ? "男命" : "女命";

  return (
    <>
      <div className="glass mt-10 rounded-3xl p-6 sm:p-8">
        {saved && !chart ? (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-4 py-2.5">
            <p className="truncate text-xs text-muted-foreground">
              检测到已保存档案 · {saved.date} {hourLabel(saved.hourBranch)}
            </p>
            <button
              type="button"
              onClick={applyProfile}
              className="shrink-0 rounded text-xs font-medium text-gold-400 transition-colors hover:text-gold-300 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              使用档案
            </button>
          </div>
        ) : null}

        {chart && resultInfo ? (
          <BaziResult
            chart={chart}
            info={resultInfo}
            onReset={reset}
          />
        ) : (
          <>
            {/* 步骤指示 */}
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-medium">八字排盘</h2>
              <p className="text-xs text-muted-foreground">
                第 {step + 1} 步 · 共 3 步
              </p>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gold-500 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / 3) * 100}%` }}
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
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="bazi-date"
                          className="text-sm font-medium"
                        >
                          出生日期<span className="text-cinnabar"> *</span>
                        </label>
                      </div>
                      <input
                        id="bazi-date"
                        type="date"
                        value={date}
                        min={MIN_BIRTH}
                        max={maxDate || undefined}
                        onChange={(event) => handleDateChange(event.target.value)}
                        aria-invalid={Boolean(dateError)}
                        aria-describedby={dateError ? "bazi-date-error" : undefined}
                        className={cn(inputCls, "mt-2.5")}
                      />
                      {dateError ? (
                        <p
                          id="bazi-date-error"
                          role="alert"
                          className="mt-2 text-xs text-cinnabar"
                        >
                          {dateError}
                        </p>
                      ) : null}
                    </div>

                    <fieldset>
                      <legend className="text-sm font-medium">
                        出生时辰
                        <span className="ml-2 font-normal text-muted-foreground/60">
                          选填 · 时辰未知将排三柱
                        </span>
                      </legend>
                      <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        <HourChip
                          key="unknown"
                          selected={hourValue === -1}
                          name="未知"
                          range="排三柱"
                          onClick={() => setHourValue(-1)}
                        />
                        {HOUR_SLOTS.map((slot) => (
                          <HourChip
                            key={slot.branch}
                            selected={hourValue === slot.branch}
                            name={slot.name}
                            range={slot.range}
                            onClick={() => setHourValue(slot.branch)}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="space-y-7">
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="bazi-place" className="text-sm font-medium">
                          出生地
                        </label>
                        <span className="text-xs text-muted-foreground/60">
                          选填 · 仅用于档案记录
                        </span>
                      </div>
                      <input
                        id="bazi-place"
                        type="text"
                        value={place}
                        onChange={(event) => setPlace(event.target.value)}
                        placeholder="如：浙江 · 杭州"
                        className={cn(inputCls, "mt-2.5")}
                      />
                    </div>
                    <p className="rounded-xl bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                      真太阳时校正即将上线，当前按北京时间推算。
                    </p>
                  </div>
                ) : null}

                {step === 2 ? (
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
                                ? "border-gold-500/60 bg-gold-500/10 text-foreground"
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
                          可多选 · AI 解读将侧重这些领域
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
                                setFocus((current) =>
                                  selected
                                    ? current.filter((item) => item !== option)
                                    : [...current, option]
                                )
                              }
                              className={cn(
                                "rounded-full border px-4 py-1.5 text-[13px] transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                selected
                                  ? "border-gold-500/40 bg-gold-500/10 text-gold-400"
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

              {step < 2 ? (
                <Button onClick={goNext} disabled={step === 0 && !date}>
                  下一步
                  <ArrowRight aria-hidden />
                </Button>
              ) : (
                <Button onClick={startRitual} disabled={!gender}>
                  <Sparkles aria-hidden />
                  推演天机
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
      />
    </>
  );
}

function HourChip({
  selected,
  name,
  range,
  onClick,
}: {
  selected: boolean;
  name: string;
  range: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-xl border px-2 py-2.5 text-center transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        selected
          ? "border-gold-500/50 bg-gold-500/10 text-gold-400"
          : "border-border text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="block text-sm font-medium">{name}</span>
      <span className="mt-0.5 block font-mono text-[11px] opacity-70">
        {range}
      </span>
    </button>
  );
}
