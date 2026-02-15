import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import BackgroundScene from "@/components/three/BackgroundScene";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn(username, password);
      navigate("/chat");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (!username.trim()) {
        setError("请输入用户名");
        return;
      }
      // 新注册不允许用 @，避免与邮箱混淆
      if (username.includes("@")) {
        setError("用户名不能包含 @");
        return;
      }
      await signUp(username.trim(), password);
      setSuccess("注册成功，可直接登录");
      setTab("login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      tab === "login" ? handleLogin() : handleSignUp();
    }
  };

  const inputClass =
    "w-full rounded-xl border bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--gradient-from)] border-[var(--input-border)]";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="three-canvas-wrapper">
        <BackgroundScene />
      </div>

      {/* 登录页主题切换 - 右上角 */}
      <button
        type="button"
        onClick={toggleTheme}
        className="btn-ghost main-content absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg"
        aria-label={theme === "dark" ? "切换到明亮模式" : "切换到暗色模式"}
      >
        {theme === "dark" ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>

      <div className="main-content w-full max-w-[420px] animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--btn-primary)] text-[var(--bg-base)] font-black text-xl animate-float">
            i
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ideas.top</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">智能 AI 助手</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="mb-6 flex rounded-xl bg-[var(--input-bg)] p-1">
            <button
              type="button"
              onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                tab === "login"
                  ? "bg-[var(--btn-primary)] text-[var(--bg-base)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                tab === "signup"
                  ? "bg-[var(--btn-primary)] text-[var(--bg-base)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              注册
            </button>
          </div>

          {tab === "login" ? (
            <div className="space-y-4" onKeyDown={handleKeyDown}>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="输入用户名"
                  autoComplete="username"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  autoComplete="current-password"
                  className={inputClass}
                />
              </div>
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                  <p className="text-center text-sm text-red-400">{error}</p>
                </div>
              )}
              <button
                type="button"
                disabled={loading}
                onClick={handleLogin}
                className="btn-primary mt-2 h-12 w-full"
              >
                {loading ? "登录中..." : "登 录"}
              </button>
            </div>
          ) : (
            <div className="space-y-4" onKeyDown={handleKeyDown}>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="输入用户名（不含邮箱）"
                  autoComplete="username"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                  <p className="text-center text-sm text-red-400">{error}</p>
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2.5">
                  <p className="text-center text-sm text-green-400">{success}</p>
                </div>
              )}
              <button
                type="button"
                disabled={loading}
                onClick={handleSignUp}
                className="btn-primary mt-2 h-12 w-full"
              >
                {loading ? "注册中..." : "注 册"}
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          &copy; Ideas.top · Dify + Supabase
        </p>
      </div>
    </div>
  );
}
