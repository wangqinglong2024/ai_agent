import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import BackgroundScene from "@/components/three/BackgroundScene";

/** 装饰块数据结构 */
interface DecorBlock {
  id: number;
  size: number;   // 正方形边长
  top: number;    // vh
  left: number;   // vw
  delay: number;
  radius: number;
}

/** 可放置区域列表（视窗百分比），完全避开中心区域（Logo + 登录卡片）+ 远离边缘 */
const ZONES = [
  { t: 5, b: 12, l: 5, r: 20 },   // 左上
  { t: 5, b: 12, l: 80, r: 93 },  // 右上
  { t: 88, b: 93, l: 5, r: 20 },  // 左下
  { t: 88, b: 93, l: 80, r: 93 }, // 右下
  { t: 20, b: 80, l: 5, r: 16 },  // 左侧
  { t: 20, b: 80, l: 84, r: 93 }, // 右侧
];

/** 碰撞检测：两个装饰块是否重叠（AABB 边界框检测 + 安全间距） */
function isOverlap(
  a: { top: number; left: number; size: number },
  b: { top: number; left: number; size: number },
) {
  // 将 px 转为 vh/vw 百分比（假设视窗 1920×1080）
  // 80px ≈ 4.17vw (80/1920*100) ≈ 7.4vh (80/1080*100)
  // 保守估计：取平均 80px ≈ 6vh/vw
  const aSizeVh = (a.size / 1080) * 100;
  const bSizeVh = (b.size / 1080) * 100;
  const aSizeVw = (a.size / 1920) * 100;
  const bSizeVw = (b.size / 1920) * 100;
  
  // 安全间距：2vh/vw
  const gap = 2;
  
  // AABB 碰撞检测：检查两个矩形是否重叠
  const aTop = a.top;
  const aBottom = a.top + aSizeVh + gap;
  const aLeft = a.left;
  const aRight = a.left + aSizeVw + gap;
  
  const bTop = b.top;
  const bBottom = b.top + bSizeVh + gap;
  const bLeft = b.left;
  const bRight = b.left + bSizeVw + gap;
  
  // 如果 A 在 B 的右边、左边、下边或上边，则不重叠
  return !(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom);
}

/** 每次页面加载随机生成 6-12 个固定正方形装饰块 */
function generateDecors(): DecorBlock[] {
  const count = Math.floor(Math.random() * 7) + 6; // 6-12 个
  const placed: DecorBlock[] = [];

  for (let i = 0; i < count; i++) {
    // 固定正方形：边长随机 30-80px
    const size = Math.floor(Math.random() * 50) + 30;
    // 圆角按边长比例：15-25% 的边长，确保不会变成圆形
    const radius = Math.floor(size * (0.15 + Math.random() * 0.10));

    let top = 0;
    let left = 0;
    let ok = false;

    for (let attempt = 0; attempt < 40; attempt++) {
      const z = ZONES[Math.floor(Math.random() * ZONES.length)];
      top = z.t + Math.random() * (z.b - z.t);
      left = z.l + Math.random() * (z.r - z.l);

      // 确保与已放置的装饰块无重叠
      ok = placed.every(
        (d) =>
          !isOverlap(
            { top, left, size },
            { top: d.top, left: d.left, size: d.size },
          ),
      );
      if (ok) break;
    }

    if (!ok) continue; // 放弃该块，不可硬塞

    placed.push({
      id: i,
      size,
      top,
      left,
      delay: +(Math.random() * 6).toFixed(1),
      radius,
    });
  }

  return placed;
}

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

  // 每次页面加载/刷新生成全新的随机装饰块
  const decors = useMemo(() => generateDecors(), []);

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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* 渐变网格背景 */}
      <div className="mesh-gradient" aria-hidden="true">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      {/* Three.js 粒子层 */}
      <div className="three-canvas-wrapper" aria-hidden="true">
        <BackgroundScene />
      </div>

      {/* 主题切换 - 右上角 */}
      <button
        type="button"
        onClick={toggleTheme}
        className="btn-ghost fixed right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl"
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

      {/* 装饰性浮动玻璃方块 — fixed 定位于视窗，z-index 低于内容层 */}
      {decors.map((d) => (
        <div
          key={d.id}
          className="glass-decor animate-float-slow"
          style={{
            position: "fixed",
            width: `${d.size}px`,
            height: `${d.size}px`,
            top: `${d.top}vh`,
            left: `${d.left}vw`,
            borderRadius: `${d.radius}px`,
            animationDelay: `${d.delay}s`,
            zIndex: 5,
          }}
          aria-hidden="true"
        />
      ))}

      {/* 内容区域 */}
      <div className="relative z-10 w-full max-w-[420px]">

        {/* Logo */}
        <div className="mb-8 animate-fade-up text-center">
          <div className="glass-card mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-[var(--text-primary)] animate-float">
            i
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ideas.top</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">智能 AI 助手</p>
        </div>

        {/* 主玻璃卡片 */}
        <div className="glass-card animate-fade-up rounded-3xl p-8 [animation-delay:100ms]">
          {/* Tab 切换器 */}
          <div className="mb-6 flex rounded-full bg-[var(--input-bg)] p-1 backdrop-blur-sm" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "login"}
              onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
                tab === "login"
                  ? "bg-[var(--btn-primary)] text-[var(--bg-base)] shadow-lg"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "signup"}
              onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
                tab === "signup"
                  ? "bg-[var(--btn-primary)] text-[var(--bg-base)] shadow-lg"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              注册
            </button>
          </div>

          {tab === "login" ? (
            <div className="space-y-4" onKeyDown={handleKeyDown} role="tabpanel">
              <div>
                <label htmlFor="login-username" className="mb-1.5 block text-sm text-[var(--text-muted)]">
                  用户名
                </label>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="用户名 或 邮箱"
                  autoComplete="username"
                  className="glass-input w-full rounded-full px-5 py-3"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm text-[var(--text-muted)]">
                  密码
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  autoComplete="current-password"
                  className="glass-input w-full rounded-full px-5 py-3"
                />
              </div>
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 backdrop-blur-sm" role="alert">
                  <p className="text-center text-sm text-red-400">{error}</p>
                </div>
              )}
              <button
                type="button"
                disabled={loading}
                onClick={handleLogin}
                className="btn-glass mt-2 h-12 w-full"
              >
                {loading ? "登录中..." : "登 录"}
              </button>
            </div>
          ) : (
            <div className="space-y-4" onKeyDown={handleKeyDown} role="tabpanel">
              <div>
                <label htmlFor="signup-username" className="mb-1.5 block text-sm text-[var(--text-muted)]">
                  用户名
                </label>
                <input
                  id="signup-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="仅字母、数字（不含 @）"
                  autoComplete="username"
                  className="glass-input w-full rounded-full px-5 py-3"
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="mb-1.5 block text-sm text-[var(--text-muted)]">
                  密码
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  autoComplete="new-password"
                  className="glass-input w-full rounded-full px-5 py-3"
                />
              </div>
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 backdrop-blur-sm" role="alert">
                  <p className="text-center text-sm text-red-400">{error}</p>
                </div>
              )}
              {success && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 backdrop-blur-sm" role="status">
                  <p className="text-center text-sm text-emerald-400">{success}</p>
                </div>
              )}
              <button
                type="button"
                disabled={loading}
                onClick={handleSignUp}
                className="btn-glass mt-2 h-12 w-full"
              >
                {loading ? "注册中..." : "注 册"}
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 animate-fade-up text-center text-xs text-[var(--text-muted)] [animation-delay:200ms]">
          &copy; Ideas.top &middot; Dify + Supabase
        </p>
      </div>
    </div>
  );
}
