/**
 * 导航栏组件
 * 使用毛玻璃效果的顶部固定导航
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { label: "首页", path: "/" },
  { label: "课程", path: "/courses" },
  { label: "服务", path: "/services" },
  { label: "技术", path: "/technology" },
  { label: "关于我们", path: "/about" },
  { label: "联系我们", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // 初始化主题
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  // 监听滚动，控制导航栏背景增强
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 切换 Light / Dark 模式
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // 路由切换时关闭移动端菜单
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl backdrop-saturate-[1.8] bg-white/30 dark:bg-white/[0.06] border-b border-white/40 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-110">
              FY
            </div>
            <span className="text-lg font-bold text-gradient">ForYou Tech</span>
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`btn-ghost text-sm ${
                  location.pathname === link.path
                    ? "!text-cyan-600 dark:!text-cyan-400 font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2">
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2"
              aria-label="切换主题"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* 移动端汉堡菜单 */}
            <button
              className="btn-ghost p-2 md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="切换菜单"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {isOpen && (
        <div className="md:hidden glass-elevated mx-4 mb-4 rounded-2xl p-4 animate-slide-up">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`btn-ghost text-left py-3 px-4 rounded-xl text-sm ${
                  location.pathname === link.path
                    ? "!text-cyan-600 dark:!text-cyan-400 font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
