import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../contexts/ThemeContext';

interface OrbProps {
  score: number;
}

const AnimatedOrb: React.FC<OrbProps> = ({ score }) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particleGroupRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = time * 0.4;
      outerRingRef.current.rotation.y = time * 0.3;
      const s = 1 + Math.sin(time * 1.5) * 0.05;
      outerRingRef.current.scale.set(s, s, s);
    }

    if (midRingRef.current) {
      midRingRef.current.rotation.x = -time * 0.5;
      midRingRef.current.rotation.z = time * 0.4;
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 2.2) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Radiant Glowing Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Iridescent Shield */}
      <mesh>
        <sphereGeometry args={[0.78, 24, 24]} />
        <meshBasicMaterial color="#34D399" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Surya Amber Outer Gyroscopic Orbit Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.15, 0.02, 16, 64]} />
        <meshStandardMaterial color="#F59E0B" emissive="#D97706" emissiveIntensity={0.7} />
      </mesh>

      {/* Prana Emerald Gyroscopic Orbit Ring */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[1.35, 0.015, 16, 64]} />
        <meshStandardMaterial color="#34D399" emissive="#10B981" emissiveIntensity={0.6} />
      </mesh>

      {/* Concentric Ambient Light Aura */}
      <pointLight color="#10B981" intensity={2} distance={5} />
      <pointLight color="#F59E0B" intensity={1.5} distance={5} position={[1, 1, 1]} />
    </group>
  );
};

export const WellnessOrb3D: React.FC<{ score?: number }> = ({ score = 0 }) => {
  const { isDark } = useTheme();
  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 select-none">
      {/* Background glow disc */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-prana-500/20 via-surya-500/20 to-transparent blur-xl pointer-events-none" />
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 0.9 : 1.15} />
        <AnimatedOrb score={score} />
      </Canvas>
    </div>
  );
};
