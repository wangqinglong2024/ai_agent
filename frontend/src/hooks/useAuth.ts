/**
 * 认证 Hook - 简化组件中的使用
 */
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { user, session, loading, initialize, signIn, signUp, signOut } =
    useAuthStore();

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  return { user, session, loading, signIn, signUp, signOut };
}
