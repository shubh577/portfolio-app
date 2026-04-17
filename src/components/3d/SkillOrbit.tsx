"use client"; 

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Billboard } from "@react-three/drei";
import { useStore } from "@/store/useStore";

const SKILLS = [
  "React", "Next.js", "Three.js", "WebGL", 
  "TypeScript", "Python", "PyTorch", "Tailwind",
  "Java", "C++"
];

export function SkillOrbit() {
  const ringsRef = useRef<THREE.Group>(null);
  const isTouring = useStore((state) => state.isTouring);
  const currentTourTarget = useStore((state) => state.currentTourTarget);

  useFrame((_, delta) => {
    if (ringsRef.current) {
      if (!isTouring || currentTourTarget === null) {
        // Ambient system rotation
        ringsRef.current.rotation.y += delta * 0.1;
        ringsRef.current.rotation.x += delta * 0.05;
        ringsRef.current.rotation.z += delta * 0.02;
      } else {
        // Carousel targeting mode
        const angle = (currentTourTarget / SKILLS.length) * Math.PI * 2;
        const currentY = ringsRef.current.rotation.y;
        let targetRotationY = Math.PI / 2 - angle;
        
        // Normalize rotation to prevent violent multi-spin wrapping jumps
        while (targetRotationY - currentY > Math.PI) targetRotationY -= Math.PI * 2;
        while (targetRotationY - currentY < -Math.PI) targetRotationY += Math.PI * 2;
        
        ringsRef.current.rotation.y = THREE.MathUtils.lerp(currentY, targetRotationY, delta * 4);
        
        // Cleanly flatten out the X and Z wobble for a pure carousel spin
        ringsRef.current.rotation.x = THREE.MathUtils.lerp(ringsRef.current.rotation.x, 0, delta * 4);
        ringsRef.current.rotation.z = THREE.MathUtils.lerp(ringsRef.current.rotation.z, 0, delta * 4);
      }
    }
  });

  return (
    <group ref={ringsRef} position={[0, 0, 0]}>
      {/* Outer Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 4.04, 64]} />
        <meshBasicMaterial color="#7000ff" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.84, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {SKILLS.map((skill, i) => {
        const radius = i % 2 === 0 ? 4 : 2.8;
        const angle = (i / SKILLS.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <OrbitingSkill key={i} text={skill} position={[x, 0, z]} index={i} />
        );
      })}
    </group>
  );
}

function OrbitingSkill({ text, position, index }: { text: string, position: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshPhysicalMaterial 
          color="#111111" 
          emissive={index % 2 === 0 ? "#7000ff" : "#00f0ff"} 
          emissiveIntensity={1.5} 
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      <Billboard position={[0, 0.5, 0]}>
        <Text
          fontSize={0.28}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.025}
          outlineColor="#000000"
        >
          {text}
        </Text>
      </Billboard>
    </group>
  );
}

