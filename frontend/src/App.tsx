import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/stores/themeStore";
import Layout from "@/components/layout/Layout";
import Chat from "@/pages/Chat";
import Login from "@/pages/Login";

/** 同步主题到 DOM */
function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);
  return null;
}

/** 未登录重定向到登录页 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading) {
      timer = setTimeout(() => setShowTimeout(true), 8000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-[var(--bg-base)] text-[var(--text-primary)]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--glass-border)] border-t-[var(--gradient-from)]" />
        <p className="text-sm text-[var(--text-muted)]">正在连接服务器...</p>
        {showTimeout && (
          <div className="animate-fade-up text-center">
            <p className="mb-2 text-red-500">连接超时，请检查网络</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[var(--input-bg)] px-4 py-2 transition-colors hover:bg-[var(--glass-border)]"
            >
              刷新页面
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  useAuth();

  return (
    <>
      <ThemeSync />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:conversationId" element={<Chat />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
