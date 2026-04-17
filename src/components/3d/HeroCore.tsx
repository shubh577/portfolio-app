"use client"; 

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Icosahedron, Wireframe } from "@react-three/drei";

export function HeroCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  // Mouse interaction
  const targetRotation = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    // Smoothly rotate based on mouse
    targetRotation.current.x = (state.pointer.x * Math.PI) / 4;
    targetRotation.current.y = (state.pointer.y * Math.PI) / 4;

    if (meshRef.current && wireframeRef.current) {
      // Easing the rotation
      meshRef.current.rotation.y += (targetRotation.current.x - meshRef.current.rotation.y) * delta * 2;
      meshRef.current.rotation.x += (-targetRotation.current.y - meshRef.current.rotation.x) * delta * 2;
      
      // Auto idle rotation
      meshRef.current.rotation.z += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.1;

      // Sync wireframe
      wireframeRef.current.rotation.copy(meshRef.current.rotation);
      
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
      wireframeRef.current.scale.set(scale * 1.05, scale * 1.05, scale * 1.05);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Solid Core */}
      <Icosahedron ref={meshRef} args={[1.5, 2]}>
        <meshPhysicalMaterial
          color="#000000"
          emissive="#7000ff"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Icosahedron>

      {/* Cyber Wireframe shell */}
      <Icosahedron ref={wireframeRef} args={[1.5, 2]}>
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
      </Icosahedron>
      
      <pointLight color="#00f0ff" intensity={5} distance={10} />
      <pointLight color="#7000ff" intensity={5} distance={10} decay={2} position={[0, 2, 0]} />
    </group>
  );
}
