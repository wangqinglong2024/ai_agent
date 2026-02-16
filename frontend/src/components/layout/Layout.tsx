/**
 * Main Layout
 * Three.js background + frosted glass header + content area
 */
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "./Header";
import BackgroundScene from "@/components/three/BackgroundScene";

export default function Layout() {
  useAuth();

  return (
    <div className="relative h-screen overflow-hidden">
      {/* 渐变网格背景层 */}
      <div className="mesh-gradient" aria-hidden="true">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      {/* Three.js 粒子层 - 透明叠加 */}
      <div className="three-canvas-wrapper" aria-hidden="true">
        <BackgroundScene />
      </div>
      <div className="main-content flex h-full flex-col overflow-hidden">
        <header className="shrink-0">
          <Header />
        </header>
        <main className="flex min-h-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
