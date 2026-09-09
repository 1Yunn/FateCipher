"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { migrateForUser } from "@/lib/profile";

export type User = {
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
};

type AuthContextType = AuthState & {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "fatecipher.users";
const CURRENT_KEY = "fatecipher.currentUser";

function readUsers(): Array<{ email: string; password: string; name: string }> {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as Array<{ email: string; password: string; name: string }>) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: Array<{ email: string; password: string; name: string }>) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrent(): User | null {
  try {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readCurrent());
    setLoading(false);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      // 模拟网络延迟
      await new Promise((r) => setTimeout(r, 600));
      const users = readUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("该邮箱已注册");
      }
      users.push({ email, password, name });
      writeUsers(users);
      const newUser: User = { email, name };
      window.localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
      migrateForUser(email); // 迁移旧 key（仅影响已有档案的老用户）
      setUser(newUser);
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      await new Promise((r) => setTimeout(r, 600));
      const users = readUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        throw new Error("邮箱或密码不正确");
      }
      const current: User = { email: found.email, name: found.name };
      window.localStorage.setItem(CURRENT_KEY, JSON.stringify(current));
      migrateForUser(email); // 迁移旧 key（仅影响已有档案的老用户）
      setUser(current);
    },
    []
  );

  const signOut = useCallback(() => {
    window.localStorage.removeItem(CURRENT_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth 必须在 AuthProvider 内使用");
  }
  return ctx;
}
