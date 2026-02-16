import { useNavigate } from "react-router-dom";
import { useAuthStore, getDisplayUsername } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { theme, toggleTheme } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate("/login");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小不能超过 2MB");
      return;
    }
    setUploading(true);
    setMenuOpen(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        alert("请先登录");
        return;
      }
      const form = new FormData();
      form.append("file", file);
      const r = await fetch(`${API_BASE}/auth/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        alert(data.detail || "上传失败");
        return;
      }
      
      // 后端返回的URL可能是内网地址，需要替换为外网地址
      let avatarUrl = data.url as string;
      if (avatarUrl) {
        // 将 Docker 内网地址替换为前端可访问的 Supabase 地址
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
        avatarUrl = avatarUrl.replace(/^https?:\/\/supabase-kong:\d+/, supabaseUrl.replace(/\/$/, ""));
        
        const { error: updateError } = await supabase.auth.updateUser({ 
          data: { avatar_url: avatarUrl } 
        });
        if (updateError) throw updateError;
        
        // 强制刷新 session 以更新头像
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) console.warn("刷新 session 失败:", refreshError);
      }
    } catch (err) {
      console.error(err);
      alert("更换头像失败");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <nav
      className="glass border-b border-[var(--glass-border)] px-4 py-2.5 md:px-6 flex items-center justify-between"
      role="navigation"
      aria-label="主导航"
    >
      <div
        className="flex cursor-pointer items-center gap-2 transition-all duration-300 ease-out hover:opacity-80"
        onClick={() => navigate("/chat")}
        onKeyDown={(e) => e.key === "Enter" && navigate("/chat")}
        role="button"
        tabIndex={0}
        aria-label="前往聊天"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--btn-primary)] text-[var(--bg-base)] font-bold">
          i
        </div>
        <span className="text-base font-semibold text-[var(--text-primary)] hidden sm:inline">
          Ideas.top
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-ghost flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ease-out"
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

        <div className="relative" ref={menuRef}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            aria-label="上传头像"
          />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--btn-primary)] text-[var(--bg-base)] font-semibold text-sm transition-all duration-300 ease-out hover:opacity-90"
            aria-label="用户菜单"
            aria-expanded={menuOpen}
          >
            {uploading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="头像" className="h-full w-full object-cover" />
            ) : (
              (getDisplayUsername(user) || "用").charAt(0).toUpperCase()
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--dropdown-bg)] py-2 shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
              <div className="border-b border-[var(--glass-border)] px-4 py-3">
                <p className="text-xs text-[var(--text-muted)]">已登录</p>
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {getDisplayUsername(user)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-primary)] transition-all duration-300 ease-out hover:bg-[var(--input-bg)] disabled:opacity-50"
              >
                更换头像
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); navigate("/change-password"); }}
                className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-primary)] transition-all duration-300 ease-out hover:bg-[var(--input-bg)]"
              >
                更改密码
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full px-4 py-2.5 text-left text-sm text-red-400 transition-all duration-300 ease-out hover:bg-[var(--input-bg)]"
              >
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
