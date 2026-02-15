import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import BackgroundScene from "@/components/three/BackgroundScene";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
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
      await signUp(email, password, nickname);
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

      <div className="main-content w-full max-w-[420px] animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--btn-primary)] text-[var(--bg-base)] font-black text-xl animate-float">
            i
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ideas.top</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">智能 AI 助手</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          {/* Tab */}
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
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
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
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">昵称</label>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="输入昵称"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
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
