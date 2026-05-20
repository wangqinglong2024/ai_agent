/**
 * 樱花花瓣飘落特效层 (Sakura Petal Drift)
 * 花瓣在微风中极缓慢地飘落、翻转、随风摆动
 * 营造诗意梦幻的视觉氛围，如同春日树下仰望
 * Z 轴分层：z-[1] 中间层
 */

import { useRef, useEffect } from "react";

/* 花瓣数量 —— 适度稀疏，营造「偶然飘落」的自然感 */
const PETAL_COUNT = 22;

/* 亮色模式：柔和暖粉色系 */
const LIGHT_COLORS = ["#fda4af", "#f9a8d4", "#fecdd3", "#fed7aa", "#fecaca"];
/* 暗色模式：低饱和暖调 */
const DARK_COLORS = ["#fb7185", "#f472b6", "#fda4af", "#fed7aa"];

interface Petal {
  x: number;
  y: number;
  size: number;
  rot: number;
  rotSpeed: number;
  tilt: number;
  tiltSpeed: number;
  fallSpeed: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  wobbleFreq: number;
  lightColor: string;
  darkColor: string;
  lightAlpha: number;
  darkAlpha: number;
  shape: number;
}

/** 创建单个花瓣 */
function createPetal(w: number, h: number, scatter: boolean): Petal {
  return {
    x: Math.random() * w * 1.2 - w * 0.1,
    y: scatter ? Math.random() * h * 1.3 - h * 0.15 : -(Math.random() * 250 + 60),
    size: Math.random() * 10 + 10,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.006,
    tilt: Math.random() * Math.PI,
    tiltSpeed: (Math.random() - 0.5) * 0.004,
    fallSpeed: Math.random() * 0.12 + 0.04,
    swayFreq: Math.random() * 0.0008 + 0.0003,
    swayAmp: Math.random() * 50 + 25,
    swayPhase: Math.random() * Math.PI * 2,
    wobbleFreq: Math.random() * 0.002 + 0.001,
    lightColor: LIGHT_COLORS[Math.floor(Math.random() * LIGHT_COLORS.length)]!,
    darkColor: DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)]!,
    lightAlpha: Math.random() * 0.35 + 0.25,
    darkAlpha: Math.random() * 0.10 + 0.04,
    shape: Math.floor(Math.random() * 3),
  };
}

/** 绘制不同形态的花瓣（3 种贝塞尔曲线变体） */
function drawPetal(ctx: CanvasRenderingContext2D, p: Petal, isDark: boolean) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);

  /* 3D 翻转模拟：通过水平缩放制造花瓣翻转的立体感 */
  const tiltScale = 0.3 + Math.abs(Math.cos(p.tilt)) * 0.7;
  ctx.scale(tiltScale, 1);

  ctx.globalAlpha = isDark ? p.darkAlpha : p.lightAlpha;
  ctx.fillStyle = isDark ? p.darkColor : p.lightColor;

  const s = p.size;
  ctx.beginPath();

  if (p.shape === 0) {
    /* 樱花圆瓣 —— 顶端尖、底部带轻微凹口 */
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.4, s * 0.65, s * 0.55, s * 0.12, s * 0.75);
    ctx.bezierCurveTo(0, s * 0.5, 0, s * 0.5, -s * 0.12, s * 0.75);
    ctx.bezierCurveTo(-s * 0.65, s * 0.55, -s * 0.95, -s * 0.4, 0, -s);
  } else if (p.shape === 1) {
    /* 椭圆长瓣 —— 细长优雅的花瓣形态 */
    ctx.moveTo(0, -s * 1.1);
    ctx.bezierCurveTo(s * 0.5, -s * 0.2, s * 0.35, s * 0.7, 0, s * 0.95);
    ctx.bezierCurveTo(-s * 0.35, s * 0.7, -s * 0.5, -s * 0.2, 0, -s * 1.1);
  } else {
    /* 宽圆瓣 —— 饱满的花瓣  */
    ctx.moveTo(0, -s * 0.8);
    ctx.bezierCurveTo(s * 0.9, -s * 0.2, s * 0.55, s * 0.65, 0, s * 0.85);
    ctx.bezierCurveTo(-s * 0.55, s * 0.65, -s * 0.9, -s * 0.2, 0, -s * 0.8);
  }

  ctx.fill();

  /* 花瓣脉络线 —— 极淡的中央线条增加真实感 */
  ctx.globalAlpha *= 0.3;
  ctx.strokeStyle = isDark ? p.darkColor : p.lightColor;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.6);
  ctx.quadraticCurveTo(s * 0.05, 0, 0, s * 0.5);
  ctx.stroke();

  ctx.restore();
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let petals: Petal[];
    /* 鼠标触发的临时花瓣池 */
    let mousePetals: Petal[] = [];
    let t = 0;
    /* 节流控制：每 60ms 最多生成一片鼠标花瓣 */
    let lastSpawn = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      petals = Array.from({ length: PETAL_COUNT }, () =>
        createPetal(window.innerWidth, window.innerHeight, true),
      );
    };

    /* 鼠标移动时从光标位置散落花瓣 */
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      const now = Date.now();
      if (now - lastSpawn < 60) return;
      lastSpawn = now;

      /* 限制鼠标花瓣池上限 */
      if (mousePetals.length > 30) return;

      const mp = createPetal(window.innerWidth, window.innerHeight, false);
      mp.x = e.clientX + (Math.random() - 0.5) * 20;
      mp.y = e.clientY + (Math.random() - 0.5) * 10;
      mp.size = Math.random() * 6 + 6;
      mp.fallSpeed = Math.random() * 0.6 + 0.3;
      mp.lightAlpha = Math.random() * 0.5 + 0.35;
      mp.darkAlpha = Math.random() * 0.15 + 0.06;
      /* 标记生命值用于淡出 */
      (mp as Petal & { life: number }).life = 1;
      mousePetals.push(mp);
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains("dark");
      t++;

      /* ── 背景常驻花瓣 ── */
      for (const p of petals) {
        p.y += p.fallSpeed;
        p.x += Math.sin(t * p.swayFreq + p.swayPhase) * 0.35
             + Math.sin(t * p.wobbleFreq + p.swayPhase * 1.7) * 0.12;
        p.rot += p.rotSpeed;
        p.tilt += p.tiltSpeed;

        if (p.y > h + p.size * 4) {
          p.y = -(p.size * 4 + Math.random() * 80);
          p.x = Math.random() * w * 1.2 - w * 0.1;
        }
        if (p.x > w + p.size * 4) p.x = -(p.size * 4);
        if (p.x < -(p.size * 4)) p.x = w + p.size * 4;

        drawPetal(ctx, p, isDark);
      }

      /* ── 鼠标触发的临时花瓣（带淡出生命值） ── */
      for (let i = mousePetals.length - 1; i >= 0; i--) {
        const mp = mousePetals[i]! as Petal & { life: number };
        mp.y += mp.fallSpeed;
        mp.x += Math.sin(t * mp.swayFreq + mp.swayPhase) * 0.5;
        mp.rot += mp.rotSpeed * 1.5;
        mp.tilt += mp.tiltSpeed;
        mp.life -= 0.008;

        if (mp.life <= 0 || mp.y > h + mp.size * 4) {
          mousePetals.splice(i, 1);
          continue;
        }

        /* 乘以生命值实现渐隐 */
        const origLightA = mp.lightAlpha;
        const origDarkA = mp.darkAlpha;
        mp.lightAlpha *= mp.life;
        mp.darkAlpha *= mp.life;
        drawPetal(ctx, mp, isDark);
        mp.lightAlpha = origLightA;
        mp.darkAlpha = origDarkA;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
    </div>
  );
}
