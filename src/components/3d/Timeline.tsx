"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Float } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";

const CERTIFICATES = [
  "Introduction to Programming",
  "Python Programming Course",
  "Java Programming Course",
  "React Programming Course",
  "C++ Programming Course",
];

export function Timeline() {
  const groupRef = useRef<THREE.Group>(null);
  const stationPosition = new THREE.Vector3(-100, 0, 0);
  
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only scroll if we are looking at the timeline
      if (useStore.getState().currentStation !== "timeline") return;
      
      targetScroll.current += e.deltaY * 0.05;
      // Clamp scroll based on items
      if (targetScroll.current < 0) targetScroll.current = 0;
      if (targetScroll.current > 38) targetScroll.current = 38;
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (useStore.getState().currentStation !== "timeline") return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = lastTouchY - touchY;
      lastTouchY = touchY;

      targetScroll.current += deltaY * 0.05;
      if (targetScroll.current < 0) targetScroll.current = 0;
      if (targetScroll.current > 38) targetScroll.current = 38;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      currentScroll.current = THREE.MathUtils.lerp(currentScroll.current, targetScroll.current, delta * 5);
      groupRef.current.position.z = stationPosition.z + currentScroll.current;
    }
  });

  return (
    <group ref={groupRef} position={stationPosition}>
      <Text
        position={[0, 4, -4]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#000000"
      >
        CERTIFICATIONS
      </Text>

      {CERTIFICATES.map((cert, idx) => {
        // Z-axis placement to form a tunnel
        const zPos = -8 - idx * 7; 
        const xPos = idx % 2 === 0 ? -4 : 4;

        return (
          <Float key={idx} floatIntensity={1.5} rotationIntensity={0} speed={1.5} position={[xPos, 0, zPos]}>
            <CertNode title={cert} />
          </Float>
        );
      })}
    </group>
  );
}

function CertNode({ title }: { title: string }) {
  const nodeRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (nodeRef.current) {
      // Gentle bobbing/tilting rather than full spins
      nodeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      nodeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={nodeRef}>
      <mesh>
        <boxGeometry args={[4.5, 2.5, 0.2]} />
        <meshPhysicalMaterial
          color="#050510"
          emissive="#7000ff"
          emissiveIntensity={1}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
      <Text
        position={[0, 0, 0.4]}
        fontSize={0.35}
        color="#ffffff"
        maxWidth={4}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>
    </group>
  );
}
