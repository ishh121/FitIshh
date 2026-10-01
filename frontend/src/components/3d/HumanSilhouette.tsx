import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SilhouetteProps {
  mousePos: { x: number; y: number };
}

export const HumanSilhouette: React.FC<SilhouetteProps> = ({ mousePos }) => {
  const groupRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Mesh>(null);
  const heartGlowRef = useRef<THREE.PointLight>(null);
  const spinePointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Subtle continuous breathing & gentle hovering
      groupRef.current.position.y = Math.sin(time * 1.4) * 0.08 - 0.1;
      
      // Cursor reaction / smooth parallax rotation
      const targetRotY = (mousePos.x * 0.4);
      const targetRotX = (-mousePos.y * 0.2);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
    }

    // Chest expansion breathing effect
    if (chestRef.current) {
      const breathScale = 1 + Math.sin(time * 1.5) * 0.04;
      chestRef.current.scale.set(breathScale, breathScale, breathScale);
    }

    // Heart chakra pulse
    if (heartGlowRef.current) {
      heartGlowRef.current.intensity = 1.2 + Math.sin(time * 3.5) * 0.8;
    }

    // Subtle spine particle rotation
    if (spinePointsRef.current) {
      spinePointsRef.current.rotation.y = time * 0.15;
    }
  });

  // Construct procedural athletic anatomical wireframe/mesh nodes
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Dynamic Spinal Cord Energy Nodes (Sushumna Nadi / Chakras) */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color="#34D399"
          emissive="#10B981"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>

      {/* Head Inner Core Glow */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#6EE7B7" transparent opacity={0.7} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 0.25, 16]} />
        <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.4} />
      </mesh>

      {/* Broad Athletic Torso / Chest */}
      <mesh ref={chestRef} position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.42, 0.28, 0.7, 24]} />
        <meshStandardMaterial
          color="#10B981"
          wireframe={true}
          emissive="#10B981"
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Heart / Anahata Energy Center Light */}
      <pointLight ref={heartGlowRef} position={[0, 1.15, 0.2]} color="#F59E0B" intensity={1.5} distance={2.5} />
      <mesh position={[0, 1.15, 0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>

      {/* Abdomen / Manipura Core */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.28, 0.26, 0.45, 18]} />
        <meshStandardMaterial color="#059669" wireframe emissive="#047857" emissiveIntensity={0.4} />
      </mesh>

      {/* Pelvis / Muladhara Base */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.26, 0.32, 0.32, 18]} />
        <meshStandardMaterial color="#10B981" wireframe emissive="#10B981" emissiveIntensity={0.3} />
      </mesh>

      {/* Left Shoulder & Arm */}
      <group position={[-0.48, 1.25, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#34D399" wireframe emissive="#10B981" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.15, -0.4, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.08, 0.07, 0.65, 12]} />
          <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-0.26, -1.0, 0.05]} rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.07, 0.05, 0.6, 12]} />
          <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Right Shoulder & Arm */}
      <group position={[0.48, 1.25, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#34D399" wireframe emissive="#10B981" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.15, -0.4, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.08, 0.07, 0.65, 12]} />
          <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.26, -1.0, 0.05]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.07, 0.05, 0.6, 12]} />
          <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Left Thigh & Leg */}
      <group position={[-0.18, 0.0, 0]}>
        <mesh position={[-0.05, -0.55, 0]} rotation={[0, 0, -0.05]}>
          <cylinderGeometry args={[0.13, 0.1, 0.8, 14]} />
          <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-0.05, -0.98, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#34D399" />
        </mesh>
        <mesh position={[-0.05, -1.5, 0]} rotation={[0, 0, -0.02]}>
          <cylinderGeometry args={[0.09, 0.07, 0.85, 14]} />
          <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Right Thigh & Leg */}
      <group position={[0.18, 0.0, 0]}>
        <mesh position={[0.05, -0.55, 0]} rotation={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.13, 0.1, 0.8, 14]} />
          <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.05, -0.98, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#34D399" />
        </mesh>
        <mesh position={[0.05, -1.5, 0]} rotation={[0, 0, 0.02]}>
          <cylinderGeometry args={[0.09, 0.07, 0.85, 14]} />
          <meshStandardMaterial color="#10B981" wireframe emissive="#059669" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Prana Energy Orbit Ring */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.3, 0.015, 16, 64]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.65} />
      </mesh>

      {/* Secondary Bio-magnetic Ring */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2.8, 0.3, 0.4]}>
        <torusGeometry args={[1.6, 0.012, 16, 64]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.45} />
      </mesh>
    </group>
  );
};
