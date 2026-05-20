/**
 * 根布局组件
 * 严格 Z 轴空间分层：
 * z-0  → 渐变网格背景
 * z-[1] → Canvas2D 粒子层
 * z-[2] → 所有业务内容
 */

import { Outlet } from "react-router-dom";
import MeshGradientBg from "./MeshGradientBg";
import ParticleCanvas from "./ParticleCanvas";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Z-0: 渐变网格背景 */}
      <MeshGradientBg />

      {/* Z-1: Canvas2D 粒子层 */}
      <ParticleCanvas />

      {/* Z-2: 业务内容层 */}
      <div className="relative z-[2] flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
