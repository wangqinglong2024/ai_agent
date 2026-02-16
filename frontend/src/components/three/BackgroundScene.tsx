/**
 * Monochrome Frosted Particle Field
 * Subtle grayscale starfield - elegant, never distracting.
 * Supports light / dark themes with purely grayscale palette.
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

  const color = theme === "dark" ? new THREE.Color("#a1a1aa") : new THREE.Color("#71717a");
  const opacity = theme === "dark" ? 0.35 : 0.2;
  const size = theme === "dark" ? 0.012 : 0.008;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x = Math.sin(t * 0.12) * 0.06;
    ref.current.rotation.z = Math.cos(t * 0.06) * 0.02;
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

  const color = theme === "dark" ? new THREE.Color("#d4d4d8") : new THREE.Color("#52525b");
  const opacity = theme === "dark" ? 0.15 : 0.1;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y -= delta * 0.03;
    ref.current.rotation.z = Math.cos(t * 0.1) * 0.04;
    ref.current.rotation.x = Math.sin(t * 0.07) * 0.03;
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
    const scale = 1 + Math.sin(t * 0.5) * 0.12;
    meshRef.current.scale.setScalar(scale);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.02 + Math.sin(t * 0.6) * 0.015;
  });

  const color = theme === "dark" ? "#3f3f46" : "#d4d4d8";

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <sphereGeometry args={[2.2, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.02}
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
    camera.position.x += (mouse.current.x * 0.35 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.current.y * 0.35 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function BackgroundScene() {
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
      <CameraRig />

      <ambientLight intensity={0.08} />
      <pointLight position={[0, 0, 2]} intensity={0.2} color="#ffffff" distance={10} />

      <AmbientGlow />
      <ParticleField />
      <SecondaryLayer />
    </Canvas>
  );
}
