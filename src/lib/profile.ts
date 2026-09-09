"use client";

/** FateCipher 命盘档案 v2
 *  - key 带用户维度前缀：fatecipher.profile.{email}
 *  - 旧 key fatecipher.profile.bazi 自动迁移
 *  - 额度 key fatecipher.ask.quota.{email}
 */

export type Gender = "male" | "female";

export interface Profile {
  date: string;               // YYYY-MM-DD 必填
  hourBranch?: number;        // 0-11 时辰索引；undefined = 时辰未知
  gender: Gender;
  place?: string;             // 选填：出生地
  focus?: string[];           // 关注方向
  createdAt: string;          // 首次建档 ISO 时间
  lastUpdated: string;        // 最后修改 ISO 时间
  migratedAt?: string;        // 从旧 key 迁移时记录
}

const OLD_PROFILE_KEY = "fatecipher.profile.bazi";
const OLD_QUOTA_KEY = "fatecipher.ask.quota";
const QUOTA_DAILY_LIMIT = 5;

// ---------- 内部工具 ----------

function profileKey(email: string): string {
  return `fatecipher.profile.${email.toLowerCase()}`;
}

function quotaKey(email: string): string {
  return `fatecipher.ask.quota.${email.toLowerCase()}`;
}

function safeGet<T = unknown>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key: string): boolean {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// ---------- 迁移 ----------

export interface MigrateResult {
  profileMigrated: boolean;
  quotaMigrated: boolean;
  hadOldProfile: boolean;
  hadOldQuota: boolean;
}

/**
 * 从旧 key 迁移到带 email 前缀的新 key。
 * 幂等：新 key 已存在时跳过；旧 key 不存在时跳过；迁移后删除旧 key。
 */
export function migrateForUser(email: string): MigrateResult {
  const result: MigrateResult = {
    profileMigrated: false,
    quotaMigrated: false,
    hadOldProfile: false,
    hadOldQuota: false,
  };

  if (!email) return result;

  const newProfileKey = profileKey(email);
  const newQuotaKey = quotaKey(email);
  const now = new Date().toISOString();

  // 1. 迁移 profile
  const oldProfile = safeGet<Profile>(OLD_PROFILE_KEY);
  result.hadOldProfile = oldProfile !== null;

  if (oldProfile && !safeGet<Profile>(newProfileKey)) {
    const migrated: Profile = {
      ...oldProfile,
      createdAt: oldProfile.createdAt ?? now,
      lastUpdated: oldProfile.lastUpdated ?? now,
      migratedAt: now,
    };
    if (safeSet(newProfileKey, migrated)) {
      result.profileMigrated = true;
      safeRemove(OLD_PROFILE_KEY); // 确认新 key 写入成功后再删旧 key
    }
  }

  // 2. 迁移 quota
  const oldQuota = safeGet<{ count: number; date: string }>(OLD_QUOTA_KEY);
  result.hadOldQuota = oldQuota !== null;

  if (oldQuota && !safeGet(newQuotaKey)) {
    if (safeSet(newQuotaKey, oldQuota)) {
      result.quotaMigrated = true;
      safeRemove(OLD_QUOTA_KEY);
    }
  }

  return result;
}

// ---------- Profile CRUD ----------

export function getProfile(email: string): Profile | null {
  return safeGet<Profile>(profileKey(email));
}

export function saveProfile(email: string, data: Omit<Profile, "createdAt" | "lastUpdated">): Profile {
  const key = profileKey(email);
  const existing = safeGet<Profile>(key);
  const now = new Date().toISOString();
  const profile: Profile = {
    ...data,
    createdAt: existing?.createdAt ?? now,
    lastUpdated: now,
  };
  safeSet(key, profile);
  return profile;
}

export function updateProfile(email: string, patch: Partial<Profile>): Profile | null {
  const key = profileKey(email);
  const existing = safeGet<Profile>(key);
  if (!existing) return null;
  const updated: Profile = { ...existing, ...patch, lastUpdated: new Date().toISOString() };
  safeSet(key, updated);
  return updated;
}

export function deleteProfile(email: string): boolean {
  return safeRemove(profileKey(email));
}

export function profileIsComplete(p: Profile | null): boolean {
  if (!p) return false;
  return !!(p.date && p.gender);
}

// ---------- Quota ----------

interface QuotaState {
  count: number;
  date: string; // YYYY-MM-DD
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getQuota(email: string): { count: number; limit: number; exhausted: boolean } {
  const stored = safeGet<QuotaState>(quotaKey(email));
  if (!stored || stored.date !== todayStr()) {
    return { count: 0, limit: QUOTA_DAILY_LIMIT, exhausted: false };
  }
  return {
    count: stored.count,
    limit: QUOTA_DAILY_LIMIT,
    exhausted: stored.count >= QUOTA_DAILY_LIMIT,
  };
}

export function consumeQuota(email: string): boolean {
  const key = quotaKey(email);
  const stored = safeGet<QuotaState>(key);
  const today = todayStr();
  let count = 0;
  if (stored && stored.date === today) {
    count = stored.count;
  }
  if (count >= QUOTA_DAILY_LIMIT) return false;
  safeSet(key, { count: count + 1, date: today });
  return true;
}

export function resetQuota(email: string): void {
  safeRemove(quotaKey(email));
}

export { QUOTA_DAILY_LIMIT };
