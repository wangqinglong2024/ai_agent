import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Login from "@/pages/Login";
import { useState, useEffect } from "react";

/**
 * 受保护路由：未登录时重定向到登录页
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setShowTimeout(true);
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white flex-col gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        <p className="text-gray-400 text-sm">正在连接服务器...</p>
        
        {showTimeout && (
          <div className="text-center animate-fade-up">
            <p className="text-red-400 mb-2">连接超时，请检查网络</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
            >
              刷新页面
            </button>
            <div className="mt-4 text-xs text-gray-600">
               如果持续失败，可能是证书或网络问题。
            </div>
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
    <Routes>
      {/* 公开页面 */}
      <Route path="/login" element={<Login />} />

      {/* 受保护页面 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:conversationId" element={<Chat />} />
      </Route>

      {/* 兜底 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
