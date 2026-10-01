import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Plate3DProps {
  isScanning: boolean;
  isOptimized: boolean;
  scanProgress?: number; // 0 to 100
}

const MealScene: React.FC<{ isScanning: boolean; isOptimized: boolean; scanProgress: number }> = ({
  isScanning,
  isOptimized,
  scanProgress,
}) => {
  const plateGroupRef = useRef<THREE.Group>(null);
  const scannerRingRef = useRef<THREE.Mesh>(null);
  const riceRef = useRef<THREE.Mesh>(null);
  const saladRef = useRef<THREE.Group>(null);
  const extraProteinRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (plateGroupRef.current) {
      // Very subtle, gentle continuous rotation
      plateGroupRef.current.rotation.y = time * 0.18;
      // Slight floating tilt
      plateGroupRef.current.rotation.x = 0.55 + Math.sin(time * 0.8) * 0.02;
    }

    // Morph food elements smoothly when isOptimized changes
    if (riceRef.current) {
      const targetScale = isOptimized ? 0.75 : 1.0;
      riceRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale * 0.85, targetScale), 0.08);
    }

    if (saladRef.current) {
      const targetSaladScale = isOptimized ? 1.35 : 1.0;
      saladRef.current.scale.lerp(new THREE.Vector3(targetSaladScale, targetSaladScale, targetSaladScale), 0.08);
    }

    if (extraProteinRef.current) {
      const targetProteinScale = isOptimized ? 1.0 : 0.001;
      extraProteinRef.current.scale.lerp(new THREE.Vector3(targetProteinScale, targetProteinScale, targetProteinScale), 0.08);
    }

    // Scanning cylinder animation
    if (scannerRingRef.current) {
      if (isScanning) {
        scannerRingRef.current.visible = true;
        const scanY = -0.2 + (Math.sin(time * 4) * 0.5 + 0.5) * 0.8;
        scannerRingRef.current.position.y = scanY;
        scannerRingRef.current.rotation.y = time * 2;
      } else {
        scannerRingRef.current.visible = false;
      }
    }
  });

  return (
    <group position={[0, -0.25, 0]}>
      {/* 3D Scanning Laser Cone / Ring */}
      <mesh ref={scannerRingRef} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.05, 0.04, 16, 64]} />
        <meshBasicMaterial color="#34D399" transparent opacity={0.8} />
      </mesh>

      {/* Main Plate Group */}
      <group ref={plateGroupRef}>
        {/* Stainless Steel / Terracotta Thali Plate */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.0, 1.85, 0.12, 64]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Plate Raised Outer Lip Rim */}
        <mesh position={[0, 0.08, 0]}>
          <torusGeometry args={[1.98, 0.05, 16, 64]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 1. Basmati Rice Mound (Center / Right) */}
        <mesh ref={riceRef} position={[0.4, 0.15, 0.25]}>
          <sphereGeometry args={[0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FAF5FF" roughness={0.8} />
        </mesh>

        {/* 2. Dal Tadka Katori (Top Left) */}
        <group position={[-0.85, 0.14, -0.65]}>
          {/* Katori Bowl */}
          <mesh>
            <cylinderGeometry args={[0.48, 0.38, 0.22, 32]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Dal Surface */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.45, 32]} />
            <meshStandardMaterial color="#EAB308" roughness={0.4} />
          </mesh>
          {/* Cumin / Tadka Specks */}
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 8]} />
            <meshBasicMaterial color="#78350F" />
          </mesh>
        </group>

        {/* 3. Mixed Vegetable Sabzi Katori (Top Right) */}
        <group position={[0.75, 0.14, -0.75]}>
          <mesh>
            <cylinderGeometry args={[0.48, 0.38, 0.22, 32]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Sabzi Surface */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.45, 32]} />
            <meshStandardMaterial color="#EA580C" roughness={0.6} />
          </mesh>
          {/* Paneer Cubes & Peas inside curry */}
          <mesh position={[0.1, 0.14, 0.05]}>
            <boxGeometry args={[0.14, 0.12, 0.14]} />
            <meshStandardMaterial color="#FEF08A" />
          </mesh>
          <mesh position={[-0.12, 0.13, -0.08]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#16A34A" />
          </mesh>
        </group>

        {/* 4. Curd / Dahi Katori (Far Left) */}
        <group position={[-1.15, 0.14, 0.25]}>
          <mesh>
            <cylinderGeometry args={[0.42, 0.34, 0.2, 32]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 32]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
          </mesh>
        </group>

        {/* 5. Two Folded Whole Wheat Rotis (Bottom Left) */}
        <group position={[-0.45, 0.12, 0.85]} rotation={[0, 0.4, 0]}>
          {/* Roti 1 */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.55, 32]} />
            <meshStandardMaterial color="#D97706" roughness={0.9} />
          </mesh>
          {/* Roti 2 (Slightly overlapping) */}
          <mesh position={[0.15, 0.03, -0.1]} rotation={[-Math.PI / 2, 0.1, 0]}>
            <circleGeometry args={[0.55, 32]} />
            <meshStandardMaterial color="#B45309" roughness={0.9} />
          </mesh>
        </group>

        {/* 6. Raw Kachumber Salad (Bottom Right) */}
        <group ref={saladRef} position={[0.85, 0.12, 0.85]}>
          {/* Cucumber slices */}
          <mesh position={[-0.1, 0.02, 0]} rotation={[-Math.PI / 2.3, 0.2, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
            <meshStandardMaterial color="#86EFAC" roughness={0.5} />
          </mesh>
          <mesh position={[0.12, 0.03, 0.08]} rotation={[-Math.PI / 2.2, -0.3, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
            <meshStandardMaterial color="#86EFAC" roughness={0.5} />
          </mesh>
          {/* Carrot rounds */}
          <mesh position={[0.02, 0.04, -0.1]} rotation={[-Math.PI / 2.1, 0.1, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.03, 16]} />
            <meshStandardMaterial color="#F97316" roughness={0.5} />
          </mesh>
          {/* Green chili slice */}
          <mesh position={[-0.15, 0.05, 0.12]} rotation={[0, 0.8, Math.PI / 2.2]}>
            <cylinderGeometry args={[0.03, 0.04, 0.25, 8]} />
            <meshStandardMaterial color="#15803D" />
          </mesh>
        </group>

        {/* 7. Extra High-Protein Sprouted Moong Bowl (Appears in Optimized Mode) */}
        <group ref={extraProteinRef} position={[0, 0.15, -0.15]}>
          <mesh>
            <cylinderGeometry args={[0.36, 0.28, 0.18, 28]} />
            <meshStandardMaterial color="#10B981" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.33, 28]} />
            <meshStandardMaterial color="#34D399" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export const Plate3D: React.FC<Plate3DProps> = ({ isScanning, isOptimized, scanProgress = 0 }) => {
  return (
    <div className="relative w-full h-[380px] sm:h-[480px] select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-prana-500/15 via-surya-500/15 to-transparent blur-3xl pointer-events-none" />

      <Canvas
        camera={{ position: [0, 3.2, 3.6], fov: 42 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 7, 3]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-3, 2, 2]} color="#10B981" intensity={1.5} distance={8} />
        <pointLight position={[3, 2, -2]} color="#F59E0B" intensity={1.5} distance={8} />

        <MealScene
          isScanning={isScanning}
          isOptimized={isOptimized}
          scanProgress={scanProgress}
        />
      </Canvas>
    </div>
  );
};
