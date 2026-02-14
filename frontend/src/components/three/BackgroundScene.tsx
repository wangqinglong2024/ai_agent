/**
 * Three.js 超炫粒子宇宙背景
 * - 星云级粒子场：多层不同颜色/速度的粒子
 * - 鼠标交互：粒子跟随鼠标方向缓慢飘动
 * - 呼吸光效：核心光球脉冲发光
 */
import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

/** 生成球形分布的随机点 */
function genSphere(count: number, radius: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    pos[i * 3] = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
    pos[i * 3 + 2] = r * Math.cos(p);
  }
  return pos;
}

/** 主粒子层 - 紫色旋转星云 */
function PrimaryNebula() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => genSphere(3000, 6), []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/** 次级粒子层 - 青色反向旋转 */
function SecondaryNebula() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => genSphere(2000, 5), []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.01;
    ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.08) * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#22d3ee"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/** 第三层 - 粉色远景微粒 */
function DistantStars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => genSphere(1500, 8), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.005;
    ref.current.rotation.x += delta * 0.003;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#f472b6"
        size={0.008}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/** 核心发光球体 - 呼吸脉冲 */
function CoreGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const scale = 1 + Math.sin(t * 0.5) * 0.15;
    meshRef.current.scale.setScalar(scale);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.04 + Math.sin(t * 0.8) * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshBasicMaterial
        color="#7c3aed"
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** 鼠标跟随相机微调 */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  // 监听鼠标 - 在 useFrame 内无法获取事件，需要通过 window
  if (typeof window !== "undefined") {
    window.onmousemove = handlePointerMove;
  }

  return null;
}

export default function BackgroundScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#050510"]} />
      <fog attach="fog" args={["#050510", 5, 15]} />

      <CameraRig />

      {/* 环境光 */}
      <ambientLight intensity={0.15} color="#8b5cf6" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#7c3aed" distance={10} />
      <pointLight position={[3, 2, -3]} intensity={0.3} color="#06b6d4" distance={8} />

      {/* 核心光球 */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <CoreGlow />
      </Float>

      {/* 三层粒子星云 */}
      <PrimaryNebula />
      <SecondaryNebula />
      <DistantStars />
    </Canvas>
  );
}
