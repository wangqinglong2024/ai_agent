/**
 * 主布局组件
 * Three.js 背景 + 磨砂顶栏 + 内容区
 */
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "./Header";
import BackgroundScene from "@/components/three/BackgroundScene";

export default function Layout() {
  useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Three.js 背景 */}
      <div className="three-canvas-wrapper">
        <BackgroundScene />
      </div>

      {/* 顶层 UI */}
      <div className="main-content flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
