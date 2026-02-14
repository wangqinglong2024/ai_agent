/**
 * 认证状态管理 (Zustand)
 * 监听 Supabase Auth 状态变化，自动维护用户信息
 */
import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;

  /** 初始化：监听认证状态(在 App 启动时调用一次) */
  initialize: () => () => void;
  /** 邮箱密码登录 */
  signIn: (email: string, password: string) => Promise<void>;
  /** 邮箱密码注册 */
  signUp: (email: string, password: string, nickname?: string) => Promise<void>;
  /** 退出登录 */
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: () => {
    // 超时保护：5秒后若仍在加载则强制结束（Supabase 连不上时不卡死）
    const timeout = setTimeout(() => {
      const state = useAuthStore.getState();
      if (state.loading) {
        console.warn("⚠️ Supabase 认证超时，强制跳转登录");
        set({ loading: false });
      }
    }, 5000);

    // 获取当前会话
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

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
    });

    // 返回清理函数
    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  signUp: async (email, password, nickname) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname: nickname || email.split("@")[0] },
      },
    });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
