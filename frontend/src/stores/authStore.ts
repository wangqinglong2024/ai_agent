/**
 * Auth State Management (Zustand)
 * Uses Supabase Auth with username+password (internally: username@ideas.local as email).
 * 
 * CRITICAL: When user signs out or switches, must reset all app state to prevent data leaks.
 */
import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useChatStore } from "./chatStore";

const USERNAME_EMAIL_SUFFIX = "@ideas.local";

/** Convert user input to Supabase email: if contains @, use as-is; otherwise append @ideas.local */
function toInternalEmail(usernameOrEmail: string): string {
  const s = usernameOrEmail.trim();
  if (s.includes("@")) return s;
  return s.toLowerCase() + USERNAME_EMAIL_SUFFIX;
}

/** Extract display-friendly username from user object */
export function getDisplayUsername(user: User | null): string {
  if (!user) return "";
  const meta = user.user_metadata?.username || user.user_metadata?.nickname;
  if (meta) return meta;
  const email = user.email || "";
  if (email.endsWith(USERNAME_EMAIL_SUFFIX)) {
    return email.slice(0, -USERNAME_EMAIL_SUFFIX.length);
  }
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email || "用户";
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;

  initialize: () => () => void;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: () => {
    const timeout = setTimeout(() => {
      const state = useAuthStore.getState();
      if (state.loading) {
        console.warn("⚠️ 认证超时，强制跳转登录");
        set({ loading: false });
      }
    }, 5000);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout);
        set({ session, user: session?.user ?? null, loading: false });
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.error("❌ 认证初始化失败:", err);
        set({ loading: false });
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
      
      // 关键：用户状态变化时，如果是登出或切换用户，必须重置聊天store
      if (!session) {
        useChatStore.getState().reset();
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  },

  signIn: async (username, password) => {
    const email = toInternalEmail(username);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // 登录成功后重置聊天store，防止显示上一个用户的数据
    useChatStore.getState().reset();
  },

  signUp: async (username, password) => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
    const resp = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.detail || "注册失败");
  },

  signOut: async () => {
    // 先重置所有应用状态
    useChatStore.getState().reset();
    
    // 再执行登出
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
