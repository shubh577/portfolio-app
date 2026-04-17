"use client"; 

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, PerformanceMonitor, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { HeroCore } from "@/components/3d/HeroCore";
import { CameraFlight } from "@/components/3d/CameraFlight";
import { Projects } from "@/components/3d/Projects";
import { SkillOrbit } from "@/components/3d/SkillOrbit";
import { Timeline } from "@/components/3d/Timeline";

export function Universe() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#030508"]} />
        <fog attach="fog" args={["#030508", 10, 30]} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
          <directionalLight position={[-10, -10, -10]} intensity={2} color="#7000ff" />

          {/* Scenery */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <HeroCore />
          <Projects />
          <SkillOrbit />
          <Timeline />

          {/* Camera Animation Manager */}
          <CameraFlight />

          {/* Effects Stack */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              mipmapBlur
              intensity={1.5}
            />
            <Noise
              premultiply
              blendFunction={BlendFunction.OVERLAY}
              opacity={0.3}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.002, 0.002)}
            />
          </EffectComposer>

        </Suspense>
      </Canvas>
    </div>
  );
}
