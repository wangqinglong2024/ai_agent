/**
 * 更改密码 - 原密码 + 两次新密码（不支持找回）
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";

export default function ChangePassword() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("两次输入的新密码不一致");
      return;
    }
    if (newPassword.length < 6) {
      setError("新密码至少 6 位");
      return;
    }
    if (!user?.email) {
      setError("未登录");
      return;
    }

    setLoading(true);
    try {
      // 1. 验证原密码
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });
      if (signInError) {
        setError("原密码错误");
        return;
      }

      // 2. 更新为新密码
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setError(updateError.message);
        return;
      }

      navigate("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "更改失败");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border bg-[var(--input-bg)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--gradient-from)] border-[var(--input-border)]";

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-[400px] rounded-2xl border border-[var(--glass-border)] bg-[var(--dropdown-bg)] p-6 shadow-xl">
          <h1 className="mb-6 text-xl font-semibold text-[var(--text-primary)]">更改密码</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-[var(--text-muted)]">原密码</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="输入原密码"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[var(--text-muted)]">新密码</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="至少 6 位"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[var(--text-muted)]">确认新密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入新密码"
                required
                className={inputClass}
              />
            </div>
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                <p className="text-center text-sm text-red-400">{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="btn-ghost flex-1 rounded-xl py-3"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 rounded-xl py-3"
              >
                {loading ? "处理中..." : "确认更改"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
