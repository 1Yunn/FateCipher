/**
 * 八字排盘引擎（纯前端，无依赖）
 *
 * 算法说明：
 * - 日柱：儒略日数（JDN）差值取模，以 1949-10-01 甲子日为锚点，逐日精确。
 * - 时柱：五鼠遁，时干 =（日干 % 5）× 2 + 时支，mod 10。
 * - 年柱：以立春（近似 2 月 4 日）为界，干支 =（年份 - 4）mod 10/12。
 * - 月柱：月支按十二节近似日期分段；月干按五虎遁，
 *   月干 =（年干 % 5）× 2 + 2 +（月支 - 寅）mod 12，mod 10。
 *
 * 精度边界：节气按近似日期推算，与天文精确值存在 ±1 天偏差，
 * 仅用于娱乐场景，不作为严肃命理依据。
 */

export type FiveElement = "金" | "木" | "水" | "火" | "土";

export const STEMS = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
] as const;

export const BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const;

export const ZODIAC = [
  "鼠",
  "牛",
  "虎",
  "兔",
  "龙",
  "蛇",
  "马",
  "羊",
  "猴",
  "鸡",
  "狗",
  "猪",
] as const;

export const STEM_ELEMENT: FiveElement[] = [
  "木",
  "木",
  "火",
  "火",
  "土",
  "土",
  "金",
  "金",
  "水",
  "水",
];

export const BRANCH_ELEMENT: FiveElement[] = [
  "水",
  "土",
  "木",
  "木",
  "土",
  "火",
  "火",
  "土",
  "金",
  "金",
  "土",
  "水",
];

export type HourSlot = {
  branch: number;
  name: string;
  range: string;
};

/** 十二时辰，index 与地支 index 一致 */
export const HOUR_SLOTS: HourSlot[] = [
  { branch: 0, name: "子时", range: "23–01" },
  { branch: 1, name: "丑时", range: "01–03" },
  { branch: 2, name: "寅时", range: "03–05" },
  { branch: 3, name: "卯时", range: "05–07" },
  { branch: 4, name: "辰时", range: "07–09" },
  { branch: 5, name: "巳时", range: "09–11" },
  { branch: 6, name: "午时", range: "11–13" },
  { branch: 7, name: "未时", range: "13–15" },
  { branch: 8, name: "申时", range: "15–17" },
  { branch: 9, name: "酉时", range: "17–19" },
  { branch: 10, name: "戌时", range: "19–21" },
  { branch: 11, name: "亥时", range: "21–23" },
];

export type PillarKey = "year" | "month" | "day" | "hour";

export interface Pillar {
  key: PillarKey;
  label: string;
  stem: number;
  branch: number;
}

export interface BaziChart {
  pillars: Pillar[];
  elements: Record<FiveElement, number>;
  charCount: number;
  hourKnown: boolean;
  zodiac: string;
  date: string;
}

/** 儒略日数（格里高利历，适用于 1900 年之后） */
function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** 1949-10-01 为甲子日 */
const JDN_ANCHOR = julianDayNumber(1949, 10, 1);

function dayPillarIndex(year: number, month: number, day: number): number {
  const offset = julianDayNumber(year, month, day) - JDN_ANCHOR;
  return ((offset % 60) + 60) % 60;
}

/** 立春边界（近似 2 月 4 日）决定年份归属 */
function solarYear(year: number, month: number, day: number): number {
  return month < 2 || (month === 2 && day < 4) ? year - 1 : year;
}

/** 十二节近似日期（月支分界） */
const TERM_BOUNDS: Array<{ month: number; day: number; branch: number }> = [
  { month: 3, day: 6, branch: 3 }, // 惊蛰 → 卯
  { month: 4, day: 5, branch: 4 }, // 清明 → 辰
  { month: 5, day: 6, branch: 5 }, // 立夏 → 巳
  { month: 6, day: 6, branch: 6 }, // 芒种 → 午
  { month: 7, day: 7, branch: 7 }, // 小暑 → 未
  { month: 8, day: 8, branch: 8 }, // 立秋 → 申
  { month: 9, day: 8, branch: 9 }, // 白露 → 酉
  { month: 10, day: 8, branch: 10 }, // 寒露 → 戌
  { month: 11, day: 7, branch: 11 }, // 立冬 → 亥
  { month: 12, day: 7, branch: 0 }, // 大雪 → 子
];

/** 月支：按节气近似日期分段（1、2 月单独处理） */
function monthBranch(month: number, day: number): number {
  if (month === 1) return day < 6 ? 0 : 1; // 小寒前属子月
  if (month === 2) return day < 4 ? 1 : 2; // 立春前属丑月
  let branch = 2; // 立春后默认寅月
  for (const term of TERM_BOUNDS) {
    if (month > term.month || (month === term.month && day >= term.day)) {
      branch = term.branch;
    }
  }
  return branch;
}

/** 五虎遁：月干 =（年干 % 5）× 2 + 2 +（月支 - 寅）mod 12 */
function monthStemIndex(yearStem: number, mBranch: number): number {
  const offsetFromYin = ((mBranch - 2) % 12 + 12) % 12;
  return ((yearStem % 5) * 2 + 2 + offsetFromYin) % 10;
}

/** 五鼠遁：时干 =（日干 % 5）× 2 + 时支 */
function hourStemIndex(dayStem: number, hBranch: number): number {
  return ((dayStem % 5) * 2 + hBranch) % 10;
}

export function computeBazi(dateStr: string, hourBranch?: number): BaziChart {
  const [year, month, day] = dateStr.split("-").map(Number);

  const solarYearValue = solarYear(year, month, day);
  const yearStem = (((solarYearValue - 4) % 10) + 10) % 10;
  const yearBranch = (((solarYearValue - 4) % 12) + 12) % 12;

  const mBranch = monthBranch(month, day);
  const mStem = monthStemIndex(yearStem, mBranch);

  const dayIndex = dayPillarIndex(year, month, day);
  const dStem = dayIndex % 10;
  const dBranch = dayIndex % 12;

  const hourKnown = typeof hourBranch === "number";
  const hBranch = hourKnown ? (hourBranch as number) : 6; // 时辰未知按午时占位
  const hStem = hourStemIndex(dStem, hBranch);

  const pillars: Pillar[] = [
    { key: "year", label: "年柱", stem: yearStem, branch: yearBranch },
    { key: "month", label: "月柱", stem: mStem, branch: mBranch },
    { key: "day", label: "日柱", stem: dStem, branch: dBranch },
  ];
  if (hourKnown) {
    pillars.push({ key: "hour", label: "时柱", stem: hStem, branch: hBranch });
  }

  const elements: Record<FiveElement, number> = {
    金: 0,
    木: 0,
    水: 0,
    火: 0,
    土: 0,
  };
  for (const pillar of pillars) {
    elements[STEM_ELEMENT[pillar.stem]] += 1;
    elements[BRANCH_ELEMENT[pillar.branch]] += 1;
  }

  return {
    pillars,
    elements,
    charCount: pillars.length * 2,
    hourKnown,
    zodiac: ZODIAC[yearBranch],
    date: dateStr,
  };
}
