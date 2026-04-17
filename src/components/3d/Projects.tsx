"use client"; 

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Float, Billboard } from "@react-three/drei";
import { useStore } from "@/store/useStore";

const PROJECTS = [
  { title: "Aura AI", description: "AI Application", color: "#00f0ff" },
  { title: "Resume Website", description: "3D WebGL Portfolio", color: "#7000ff" },
  { title: "Clinic Website", description: "Healthcare Platform", color: "#00f0ff" },
  { title: "Sneakers Website", description: "E-Commerce Store", color: "#7000ff" },
  { title: "Civic Pulse", description: "Civic Tech Platform", color: "#00f0ff" },
];

export function Projects() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Position of the Projects station strictly isolated in deep space
  const stationPosition = new THREE.Vector3(100, 0, 0);

  const targetScroll = useRef(0);
  const currentScroll = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (useStore.getState().currentStation !== "projects") return;
      targetScroll.current += e.deltaY * 0.05;
      if (targetScroll.current < 0) targetScroll.current = 0;
      if (targetScroll.current > 30) targetScroll.current = 30; // Max scroll distance for 4 items
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (useStore.getState().currentStation !== "projects") return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = lastTouchY - touchY;
      lastTouchY = touchY;

      targetScroll.current += deltaY * 0.05;
      if (targetScroll.current < 0) targetScroll.current = 0;
      if (targetScroll.current > 30) targetScroll.current = 30;
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
        position={[0, 4, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"
      >
        PROJECTS
      </Text>

      {PROJECTS.map((proj, idx) => (
        <ProjectNode key={idx} data={proj} index={idx} total={PROJECTS.length} />
      ))}
    </group>
  );
}

function ProjectNode({ data, index, total }: { data: any, index: number, total: number }) {
  const { setHoveringNode } = useStore();
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<THREE.Mesh>(null);
  
  // Arrange in an alternating tunnel list instead of a circle
  const z = -8 - index * 8;
  const x = index % 2 === 0 ? -4 : 4;

  useFrame((state, delta) => {
    if (nodeRef.current) {
      const targetScale = hovered ? 1.5 : 1;
      nodeRef.current.scale.setScalar(
        THREE.MathUtils.lerp(nodeRef.current.scale.x, targetScale, delta * 5)
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[x, 0, z]}>
      <group
        onPointerOver={() => { setHovered(true); setHoveringNode(true); }}
        onPointerOut={() => { setHovered(false); setHoveringNode(false); }}
      >
        <mesh ref={nodeRef}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshPhysicalMaterial 
            color={data.color}
            emissive={data.color}
            emissiveIntensity={hovered ? 2 : 0.5}
            transparent
            opacity={0.8}
            wireframe={!hovered}
          />
        </mesh>
        
        <Billboard position={[0, -1.5, 0]}>
          <Text
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#000000"
          >
            {data.title}
          </Text>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.25}
            color={data.color}
            anchorX="center"
            anchorY="middle"
          >
            {data.description}
          </Text>
        </Billboard>
      </group>
    </Float>
  );
}
