/**
 * 渐变网格背景组件 (Mesh Gradient Background)
 * 三个巨型模糊 Blob 缓慢漂移，营造"会呼吸的 UI"
 * Z 轴分层：z-0 最底层
 */

export default function MeshGradientBg() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Blob 1 - 青蓝 (cyan) */}
      <div
        className="absolute w-[60vw] h-[60vw] rounded-full animate-mesh-drift-1"
        style={{
          background: `radial-gradient(circle, var(--mesh-color-1), transparent 70%)`,
          opacity: "var(--mesh-opacity-1)",
          top: "-15%",
          left: "-10%",
          filter: "blur(100px)",
        }}
      />

      {/* Blob 2 - 天蓝 (sky) */}
      <div
        className="absolute w-[55vw] h-[55vw] rounded-full animate-mesh-drift-2"
        style={{
          background: `radial-gradient(circle, var(--mesh-color-2), transparent 70%)`,
          opacity: "var(--mesh-opacity-2)",
          top: "30%",
          right: "-15%",
          filter: "blur(100px)",
        }}
      />

      {/* Blob 3 - 琥珀金 (amber) */}
      <div
        className="absolute w-[50vw] h-[50vw] rounded-full animate-mesh-drift-3"
        style={{
          background: `radial-gradient(circle, var(--mesh-color-3), transparent 70%)`,
          opacity: "var(--mesh-opacity-3)",
          bottom: "-10%",
          left: "20%",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}
