import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { HumanSilhouette } from './HumanSilhouette';
import { FloatingMetrics } from './FloatingMetrics';
import { useTheme } from '../../contexts/ThemeContext';
import * as THREE from 'three';
import type { DailyMetrics } from '../../types/fitness';

interface HeroSceneProps {
  metrics: DailyMetrics;
  onSelectMetric?: (metricId: string) => void;
}

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useState(() => {
    const coords = new Float32Array(300 * 3);
    for (let i = 0; i < 300 * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 10;
      coords[i + 1] = (Math.random() - 0.5) * 8;
      coords[i + 2] = (Math.random() - 0.5) * 6;
    }
    return coords;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#34D399"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

export const HeroScene: React.FC<HeroSceneProps> = ({ metrics, onSelectMetric }) => {
  const { isDark } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize to -1 ... 1
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      setMousePos({ x, y });
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (node) node.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[580px] md:h-[680px] select-none">
      {/* Ambient background glow layers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[480px] h-[340px] md:h-[480px] rounded-full bg-gradient-to-tr from-prana-500/15 via-surya-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-prana-500/10 blur-2xl pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0.2, 5.8], fov: 45 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 0.8 : 1.05} />
        <directionalLight position={[4, 5, 4]} intensity={isDark ? 1.2 : 0.85} color="#ffffff" />
        <pointLight position={[-3, 2, 2]} color="#10B981" intensity={isDark ? 1.5 : 0.9} distance={8} />
        <pointLight position={[3, -1, 2]} color="#F59E0B" intensity={isDark ? 1.2 : 0.75} distance={8} />

        <Suspense fallback={null}>
          <ParticleField />
          <HumanSilhouette mousePos={mousePos} />
          <FloatingMetrics mousePos={mousePos} metrics={metrics} onSelectMetric={onSelectMetric} />
        </Suspense>
      </Canvas>
    </div>
  );
};
