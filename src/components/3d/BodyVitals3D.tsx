import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../contexts/ThemeContext';

interface Hotspot {
  id: string;
  name: string;
  hindiName: string;
  position: [number, number, number];
  color: string;
  pulseColor: string;
}

const HOTSPOTS: Hotspot[] = [
  { id: 'mind', name: 'Mind & Sleep Recovery', hindiName: 'मन एवं निद्रा (Ajna)', position: [0, 1.85, 0.25], color: '#818CF8', pulseColor: '#6366F1' },
  { id: 'cardiac', name: 'Cardiac & Blood Pressure', hindiName: 'हृदय एवं प्राण (Anahata)', position: [0, 1.15, 0.3], color: '#F43F5E', pulseColor: '#E11D48' },
  { id: 'metabolic', name: 'Metabolism & Glycemic Health', hindiName: 'अग्नि एवं चयापचय (Manipura)', position: [0, 0.55, 0.3], color: '#F59E0B', pulseColor: '#D97706' },
  { id: 'joints', name: 'Joints & Postural Mobility', hindiName: 'संधि एवं गतिशीलता (Sandhi)', position: [0, -0.65, 0.3], color: '#10B981', pulseColor: '#059669' },
];

const HologramFigure: React.FC<{ activeId: string; onSelectHotspot: (id: string) => void }> = ({
  activeId,
  onSelectHotspot,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const isCompact = size.width < 520;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.18;
      groupRef.current.position.y = Math.sin(time * 1.2) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Abstract transparent holographic torso */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color="#10B981" wireframe transparent opacity={0.35} />
      </mesh>

      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.42, 0.26, 0.75, 20]} />
        <meshStandardMaterial color="#34D399" wireframe transparent opacity={0.4} />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.26, 0.28, 0.45, 18]} />
        <meshStandardMaterial color="#059669" wireframe transparent opacity={0.35} />
      </mesh>

      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.35, 18]} />
        <meshStandardMaterial color="#10B981" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Spinal Energy Cord Line */}
      <mesh position={[0, 1.0, -0.05]}>
        <cylinderGeometry args={[0.018, 0.018, 1.9, 12]} />
        <meshBasicMaterial color="#34D399" transparent opacity={0.8} />
      </mesh>

      {/* Holographic Hotspots */}
      {HOTSPOTS.map((spot) => {
        const isSelected = activeId === spot.id;
        return (
          <group key={spot.id} position={spot.position}>
            {/* Pulsing Core */}
            <mesh onClick={() => onSelectHotspot(spot.id)}>
              <sphereGeometry args={[isSelected ? 0.08 : 0.06, 16, 16]} />
              <meshBasicMaterial color={spot.color} />
            </mesh>

            {/* Glowing Ring */}
            <mesh>
              <ringGeometry args={[0.09, 0.12, 24]} />
              <meshBasicMaterial color={spot.pulseColor} transparent opacity={isSelected ? 0.9 : 0.4} side={THREE.DoubleSide} />
            </mesh>

            {/* Html Tag Marker */}
            <Html distanceFactor={isCompact ? 3.5 : 6} position={[0.22, 0.02, 0]}>
              <button
                onClick={() => onSelectHotspot(spot.id)}
                className={`px-2 py-1 sm:px-2.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-300 border flex items-center gap-1 sm:gap-1.5 backdrop-blur-md shadow-sm ${
                  isSelected
                    ? 'bg-prana-100 text-prana-900 dark:bg-slate-900/90 dark:text-white border-prana-500 dark:border-white shadow-glow-prana scale-105 sm:scale-110'
                    : 'bg-white/90 dark:bg-slate-950/70 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700/60 hover:border-slate-500'
                }`}
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: spot.color }} />
                <span>{spot.name.split(' ')[0]}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

interface BodyVitals3DProps {
  activeId: string;
  onSelectHotspot: (id: string) => void;
}

export const BodyVitals3D: React.FC<BodyVitals3DProps> = ({ activeId, onSelectHotspot }) => {
  const { isDark } = useTheme();

  return (
    <div className="w-full h-[440px] md:h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0.4, 4.2], fov: 42 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 0.9 : 1.1} />
        <pointLight position={[2, 3, 2]} color="#10B981" intensity={isDark ? 1.8 : 1.2} />
        <pointLight position={[-2, -1, 2]} color="#F59E0B" intensity={isDark ? 1.2 : 0.9} />
        <HologramFigure activeId={activeId} onSelectHotspot={onSelectHotspot} />
      </Canvas>
    </div>
  );
};
