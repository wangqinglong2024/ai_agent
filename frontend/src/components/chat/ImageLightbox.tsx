/**
 * 全屏图片灯箱 — Cinematic Gallery
 *
 * 设计语言：Apple 产品页 + Awwwards 获奖画廊
 * - 图片正确自适应尺寸，占满视口
 * - CSS @property 驱动旋转光晕边框（三色扫光）
 * - 环境呼吸光 + 入场动效
 * - 零外部依赖（无 Three.js）
 */
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface Props {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex);
  const [loaded, setLoaded] = useState(false);
  const [entering, setEntering] = useState(true);
  const multi = images.length > 1;

  const prev = useCallback(() => { setLoaded(false); setIdx((i) => (i - 1 + images.length) % images.length); }, [images.length]);
  const next = useCallback(() => { setLoaded(false); setIdx((i) => (i + 1) % images.length); }, [images.length]);

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && multi) prev();
      if (e.key === "ArrowRight" && multi) next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, prev, next, multi]);

  useEffect(() => {
    const s = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = s; };
  }, []);

  return createPortal(
    <div
      className={`lb-overlay ${entering ? "lb-entering" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="图片查看器"
    >
      {/* 环境弥散光 */}
      <div className="lb-ambient" aria-hidden="true" />

      {/* 旋转光晕边框 + 图片 */}
      <div className="lb-stage">
        <div className="lb-glow-ring">
          <div className="lb-glow-inner">
            {!loaded && (
              <div className="lb-loader">
                <div className="lb-spinner" />
              </div>
            )}
            <img
              src={images[idx]}
              alt={`图片 ${idx + 1}/${images.length}`}
              className={`lb-image ${loaded ? "lb-visible" : ""}`}
              onLoad={() => setLoaded(true)}
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* 关闭 */}
      <button className="lb-close" onClick={onClose} aria-label="关闭">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* 导航 */}
      {multi && (
        <>
          <button className="lb-nav lb-nav-prev" onClick={prev} aria-label="上一张">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="lb-nav lb-nav-next" onClick={next} aria-label="下一张">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </>
      )}

      {/* 计数 */}
      {multi && (
        <div className="lb-counter">{idx + 1} / {images.length}</div>
      )}
    </div>,
    document.body,
  );
}
