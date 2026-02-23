/**
 * 全屏图片灯箱 — Three.js 粒子特效边框 (增强版)
 *
 * 四层粒子：玫瑰 / 天蓝 / 琥珀 + 白色闪烁光点
 * 高密度、大粒径、强发光，视觉冲击力拉满
 */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThemeStore } from "@/stores/themeStore";

interface Props {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

interface ParticleLayerProps {
  count: number;
  color: string;
  opacity: number;
  size: number;
  rotationSpeed: number;
  width: number;
  height: number;
  spread: number;
  pulse?: boolean;
}

/* ================================================================
   粒子层 — 沿矩形路径分布，支持脉冲闪烁
   ================================================================ */
function ParticleLayer({
  count, color, opacity, size,
  rotationSpeed, width, height, spread, pulse,
}: ParticleLayerProps) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const perimeter = 2 * (width + height);

    for (let i = 0; i < count; i++) {
      const t = (i / count) * perimeter;
      let x: number, y: number;

      if (t < width) {
        x = -width / 2 + t; y = height / 2;
      } else if (t < width + height) {
        x = width / 2; y = height / 2 - (t - width);
      } else if (t < 2 * width + height) {
        x = width / 2 - (t - width - height); y = -height / 2;
      } else {
        x = -width / 2; y = -height / 2 + (t - 2 * width - height);
      }

      pos[i * 3] = x + (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return pos;
  }, [count, width, height, spread]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * rotationSpeed;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 0.5) * 0.035;
    ref.current.scale.setScalar(s);

    if (pulse) {
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = opacity * (0.6 + Math.sin(t * 2.5) * 0.4);
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
        color={new THREE.Color(color)}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ================================================================
   粒子边框组 — 四层叠加 (三色 + 白色闪烁)
   ================================================================ */
function ParticleBorder() {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <group>
      {/* 玫瑰主层 — 最浓 */}
      <ParticleLayer
        count={1000}
        color={isDark ? "#fb7185" : "#fda4af"}
        opacity={isDark ? 0.85 : 0.6}
        size={isDark ? 0.06 : 0.045}
        rotationSpeed={0.05}
        width={7}
        height={5}
        spread={0.5}
      />
      {/* 天蓝层 */}
      <ParticleLayer
        count={800}
        color={isDark ? "#38bdf8" : "#7dd3fc"}
        opacity={isDark ? 0.75 : 0.5}
        size={isDark ? 0.055 : 0.04}
        rotationSpeed={-0.04}
        width={7.4}
        height={5.4}
        spread={0.6}
      />
      {/* 琥珀层 */}
      <ParticleLayer
        count={600}
        color={isDark ? "#fbbf24" : "#fde68a"}
        opacity={isDark ? 0.65 : 0.45}
        size={isDark ? 0.05 : 0.035}
        rotationSpeed={0.03}
        width={6.6}
        height={4.6}
        spread={0.65}
      />
      {/* 白色闪烁光点层 — 增加灵动感 */}
      <ParticleLayer
        count={200}
        color="#ffffff"
        opacity={isDark ? 0.9 : 0.55}
        size={isDark ? 0.08 : 0.055}
        rotationSpeed={-0.015}
        width={7.2}
        height={5.2}
        spread={0.8}
        pulse
      />
    </group>
  );
}

/* ================================================================
   灯箱主组件
   ================================================================ */
export default function ImageLightbox({ images, initialIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loaded, setLoaded] = useState(false);
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    setLoaded(false);
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setLoaded(false);
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasMultiple) goPrev();
      if (e.key === "ArrowRight" && hasMultiple) goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goPrev, goNext, hasMultiple]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div
      className="lightbox-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="图片查看器"
    >
      {/* Three.js 粒子边框 — 相机拉近看得更清楚 */}
      <div className="lightbox-particles" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 55 }}
          style={{ width: "100%", height: "100%" }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
        >
          <ParticleBorder />
        </Canvas>
      </div>

      {/* 图片 */}
      <div className="lightbox-content">
        {!loaded && (
          <div className="lightbox-loading">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          </div>
        )}
        <img
          src={images[currentIndex]}
          alt={`图片 ${currentIndex + 1}/${images.length}`}
          className={`lightbox-image ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          onLoad={() => setLoaded(true)}
          draggable={false}
        />
      </div>

      {/* 关闭 */}
      <button className="lightbox-close" onClick={onClose} aria-label="关闭">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* 导航 */}
      {hasMultiple && (
        <>
          <button className="lightbox-nav lightbox-nav-prev" onClick={goPrev} aria-label="上一张">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="lightbox-nav lightbox-nav-next" onClick={goNext} aria-label="下一张">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* 计数器 */}
      {hasMultiple && (
        <div className="lightbox-counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>,
    document.body,
  );
}
