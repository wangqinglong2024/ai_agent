import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { theme, toggleTheme } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav className="glass border-b border-[var(--glass-border)] px-4 py-2.5 md:px-6 flex items-center justify-between">
      <div
        className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
        onClick={() => navigate("/chat")}
        onKeyDown={(e) => e.key === "Enter" && navigate("/chat")}
        role="button"
        tabIndex={0}
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
          className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
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
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[var(--btn-primary)] text-[var(--bg-base)] font-semibold text-sm"
          >
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </button>

          {menuOpen && (
            <div className="glass-card absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl py-2 shadow-xl">
              <div className="border-b border-[var(--glass-border)] px-4 py-3">
                <p className="text-xs text-[var(--text-muted)]">已登录</p>
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-[var(--input-bg)]"
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
