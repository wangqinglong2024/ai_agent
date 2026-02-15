/**
 * 高级磨砂质感背景 - 细腻粒子场
 * 支持明暗双主题，优雅不喧宾夺主
 */
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useThemeStore } from "@/stores/themeStore";

function generateStarfield(count: number, radius: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const theme = useThemeStore((s) => s.theme);
  const count = 2500;
  const positions = useMemo(() => generateStarfield(count, 8), []);

  const color = theme === "dark" ? new THREE.Color("#6b5ce7") : new THREE.Color("#94a3b8");
  const opacity = theme === "dark" ? 0.4 : 0.25;
  const size = theme === "dark" ? 0.012 : 0.008;

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
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
        color={color}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SecondaryLayer() {
  const ref = useRef<THREE.Points>(null);
  const theme = useThemeStore((s) => s.theme);
  const positions = useMemo(() => generateStarfield(1200, 6), []);

  const color = theme === "dark" ? new THREE.Color("#22d3ee") : new THREE.Color("#64748b");
  const opacity = theme === "dark" ? 0.2 : 0.12;

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.015;
    ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.06) * 0.02;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        size={0.008}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
        color={color}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AmbientGlow() {
  const meshRef = useRef<THREE.Mesh>(null);
  const theme = useThemeStore((s) => s.theme);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const scale = 1 + Math.sin(t * 0.3) * 0.08;
    meshRef.current.scale.setScalar(scale);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.02 + Math.sin(t * 0.5) * 0.01;
  });

  const color = theme === "dark" ? "#4c1d95" : "#cbd5e1";

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <sphereGeometry args={[2.2, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.03}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.2 - camera.position.x) * 0.015;
    camera.position.y += (-mouse.current.y * 0.2 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function BackgroundScene() {
  const theme = useThemeStore((s) => s.theme);
  const bgColor = theme === "dark" ? "#050508" : "#f0f2f5";
  const fogColor = theme === "dark" ? "#050508" : "#f0f2f5";

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      style={{ width: "100%", height: "100%" }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 6, 18]} />

      <CameraRig />

      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 2]} intensity={0.3} color="#ffffff" distance={10} />

      <AmbientGlow />
      <ParticleField />
      <SecondaryLayer />
    </Canvas>
  );
}
