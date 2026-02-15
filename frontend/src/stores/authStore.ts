/**
 * 认证状态管理 (Zustand)
 * 使用 Supabase Auth，界面为「用户名+密码」（内部用 username@ideas.local 作为 email）
 * 需在 Supabase 控制台关闭「邮箱确认」：Authentication → Providers → Email → Confirm email = 关闭
 */
import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const USERNAME_EMAIL_SUFFIX = "@ideas.local";

/** 将用户输入转为 Supabase 使用的 email：含 @ 则视为邮箱直接使用，否则追加 @ideas.local */
function toInternalEmail(usernameOrEmail: string): string {
  const s = usernameOrEmail.trim();
  if (s.includes("@")) return s; // 旧用户邮箱直接登录
  return s.toLowerCase() + USERNAME_EMAIL_SUFFIX;
}

/** 从 user 提取展示用用户名 */
export function getDisplayUsername(user: User | null): string {
  if (!user) return "";
  const meta = user.user_metadata?.username;
  if (meta) return meta;
  const email = user.email || "";
  if (email.endsWith(USERNAME_EMAIL_SUFFIX)) {
    return email.slice(0, -USERNAME_EMAIL_SUFFIX.length);
  }
  return email;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;

  initialize: () => () => void;
  /** 用户名+密码 登录 */
  signIn: (username: string, password: string) => Promise<void>;
  /** 用户名+密码 注册 */
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
        console.warn("⚠️ Supabase 认证超时，强制跳转登录");
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
        console.error("❌ Supabase 认证失败:", err);
        set({ loading: false });
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
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
  },

  signUp: async (username, password) => {
    const email = toInternalEmail(username);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim() },
        emailRedirectTo: undefined,
      },
    });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
