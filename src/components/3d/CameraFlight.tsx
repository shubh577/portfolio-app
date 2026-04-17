"use client"; 

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useStore, Station } from "@/store/useStore";
import * as THREE from "three";

const STATION_CAMERAS: Record<Station, { position: [number, number, number], target: [number, number, number] }> = {
  core: { position: [0, 0, 8], target: [0, 0, 0] },
  skills: { position: [0, -4, 8], target: [0, 1, 0] },
  projects: { position: [100, 2, 6], target: [100, 0, 0] }, // Massively shifted right
  timeline: { position: [-100, 2, 6], target: [-100, 0, 0] }, // Massively shifted left
};

export function CameraFlight() {
  const { camera } = useThree();
  const { currentStation, isTouring, currentTourTarget, startTour, advanceTour } = useStore();
  const ctxRef = useRef<gsap.Context | null>(null);

  const lastScrollTime = useRef(0);
  const lastTouchY = useRef(0);

  // Trigger and advance tour manually on scroll in core (bidirectional)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleScroll = (e: WheelEvent | TouchEvent) => {
      const state = useStore.getState();
      if (state.currentStation !== "core") return;

      const now = Date.now();
      // Cooldown of 1.4s matches the cinematic animation duration
      if (now - lastScrollTime.current > 1400) {
        let direction: 1 | -1 = 1;

        if ("deltaY" in e) {
          direction = (e as WheelEvent).deltaY > 0 ? 1 : -1;
        } else if ("touches" in e) {
          const delta = lastTouchY.current - (e as TouchEvent).touches[0].clientY;
          if (Math.abs(delta) < 10) return; // ignore micro touches
          direction = delta > 0 ? 1 : -1;
          lastTouchY.current = (e as TouchEvent).touches[0].clientY;
        }

        lastScrollTime.current = now;
        
        if (!state.isTouring) {
          startTour(direction === -1 ? 9 : 0);
        } else {
          advanceTour(direction);
        }
      }
    };
    
    window.addEventListener("wheel", handleScroll as EventListener, { passive: true });
    window.addEventListener("touchstart", handleTouchStart as EventListener, { passive: true });
    window.addEventListener("touchmove", handleScroll as EventListener, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleScroll as EventListener);
      window.removeEventListener("touchstart", handleTouchStart as EventListener);
      window.removeEventListener("touchmove", handleScroll as EventListener);
    };
  }, [startTour, advanceTour]);

  // Main camera flight logic
  useEffect(() => {
    if (ctxRef.current) ctxRef.current.revert();
    
    let destPos: [number, number, number];
    let destTarget: [number, number, number];

    if (isTouring) {
      // Carousel viewing angle locked comfortably outside the ring
      destPos = [0, 1.5, 6];
      destTarget = [0, 0, 0];
    } else {
      const station = STATION_CAMERAS[currentStation];
      if (!station) return;
      destPos = station.position;
      destTarget = station.target;
    }

    const currentTarget = new THREE.Vector3();
    camera.getWorldDirection(currentTarget);
    currentTarget.add(camera.position);

    const goalTarget = new THREE.Vector3(...destTarget);

    ctxRef.current = gsap.context(() => {
      gsap.to(camera.position, {
        x: destPos[0],
        y: destPos[1],
        z: destPos[2],
        duration: 1.4,
        ease: "expo.inOut",
      });

      gsap.to(currentTarget, {
        x: goalTarget.x,
        y: goalTarget.y,
        z: goalTarget.z,
        duration: 1.4,
        ease: "expo.inOut",
        onUpdate: () => {
          camera.lookAt(currentTarget);
        }
      });
    });

    return () => {
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, [currentStation, isTouring, camera]);

  return null;
}
