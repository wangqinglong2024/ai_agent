/**
 * 顶部导航栏 - 全磨砂透明
 */
import { useNavigate, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
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

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Navbar
      maxWidth="full"
      classNames={{
        base: "glass border-b border-white/[0.04] py-1",
        wrapper: "px-4 md:px-8",
      }}
    >
      <NavbarBrand
        className="cursor-pointer gap-3 group"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all duration-300">
          <span className="text-sm font-black text-white">i</span>
        </div>
        <span className="text-lg font-bold text-gradient hidden sm:inline">
          Ideas.top
        </span>
      </NavbarBrand>

      <NavbarContent justify="center">
        <NavbarItem>
          <Button
            variant="light"
            onPress={() => navigate("/")}
            className={`font-medium text-sm transition-all duration-300 ${
              isActive("/") && !isActive("/chat")
                ? "text-white"
                : "text-default-400 hover:text-white"
            }`}
          >
            {isActive("/") && !isActive("/chat") && (
              <span className="w-1 h-1 rounded-full bg-violet-400 mr-1.5" />
            )}
            首页
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            variant="light"
            onPress={() => navigate("/chat")}
            className={`font-medium text-sm transition-all duration-300 ${
              isActive("/chat")
                ? "text-white"
                : "text-default-400 hover:text-white"
            }`}
          >
            {isActive("/chat") && (
              <span className="w-1 h-1 rounded-full bg-cyan-400 mr-1.5" />
            )}
            对话
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown
            placement="bottom-end"
            classNames={{
              content: "glass-card border border-white/[0.06] min-w-[200px]",
            }}
          >
            <DropdownTrigger>
              <Avatar
                as="button"
                size="sm"
                name={user?.email?.charAt(0).toUpperCase() || "U"}
                classNames={{
                  base: "bg-gradient-to-br from-violet-500 to-cyan-400 transition-all hover:shadow-md hover:shadow-violet-500/20",
                  name: "text-white font-bold text-xs",
                }}
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="用户菜单"
              itemClasses={{
                base: "rounded-lg data-[hover=true]:bg-white/5",
              }}
            >
              <DropdownItem key="email" className="h-14 gap-2" textValue="用户邮箱">
                <p className="font-semibold text-white/80 text-sm">已登录</p>
                <p className="text-xs text-default-400">{user?.email}</p>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={handleSignOut}
                className="text-sm"
              >
                退出登录
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
