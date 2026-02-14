/**
 * 顶部导航栏 - 磨砂透明 (HeroUI V3 - 无 Navbar 组件)
 */
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownPopover,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className="glass border-b border-white/[0.04] py-2 px-4 md:px-8 flex items-center justify-between">
      {/* 左侧 Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all duration-300">
          <span className="text-sm font-black text-white">i</span>
        </div>
        <span className="text-lg font-bold text-gradient hidden sm:inline">
          Ideas.top
        </span>
      </div>

      {/* 中间导航 */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          onPress={() => navigate("/")}
          className={`font-medium text-sm transition-all duration-300 ${
            isActive("/") && !isActive("/chat")
              ? "text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          {isActive("/") && !isActive("/chat") && (
            <span className="w-1 h-1 rounded-full bg-violet-400 mr-1.5" />
          )}
          首页
        </Button>
        <Button
          variant="ghost"
          onPress={() => navigate("/chat")}
          className={`font-medium text-sm transition-all duration-300 ${
            isActive("/chat")
              ? "text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          {isActive("/chat") && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mr-1.5" />
          )}
          对话
        </Button>
      </div>

      {/* 右侧用户菜单 */}
      <Dropdown>
        <DropdownTrigger>
          <Button variant="ghost" isIconOnly className="rounded-full">
            <Avatar size="sm" className="bg-gradient-to-br from-violet-500 to-cyan-400">
              <Avatar.Fallback className="text-white font-bold text-xs">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </Avatar.Fallback>
            </Avatar>
          </Button>
        </DropdownTrigger>
        <DropdownPopover className="glass-card border border-white/[0.06] min-w-[200px]">
          <DropdownMenu>
            <DropdownItem
              id="email"
              textValue="用户邮箱"
              className="h-14 gap-2 rounded-lg"
            >
              <p className="font-semibold text-white/80 text-sm">已登录</p>
              <p className="text-xs text-neutral-400">{user?.email}</p>
            </DropdownItem>
            <DropdownItem
              id="logout"
              onAction={handleSignOut}
              className="text-sm text-red-400 rounded-lg"
            >
              退出登录
            </DropdownItem>
          </DropdownMenu>
        </DropdownPopover>
      </Dropdown>
    </nav>
  );
}
