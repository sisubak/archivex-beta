"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS, getSection } from "@/lib/sections";
import Section from "./Section";
import NavArrows from "./NavArrows";

const TRANSITION_MS = 900;

export default function CameraWorld() {
  const [currentId, setCurrentId] = useState<string>("menu");
  const [isMoving, setIsMoving] = useState(false);
  const [moveIntensity, setMoveIntensity] = useState(0);
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intensityTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIdRef = useRef(currentId);

  useEffect(() => {
    currentIdRef.current = currentId;
  }, [currentId]);

  const handleMove = (targetId: string) => {
    if (targetId === currentIdRef.current) return;
    setIsMoving(true);
    setMoveIntensity(0);

    if (intensityTimerRef.current) clearInterval(intensityTimerRef.current);
    const startTs = Date.now();
    intensityTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTs;
      const t = Math.min(elapsed / TRANSITION_MS, 1);
      const intensity = t < 0.5 ? t * 2 : (1 - t) * 2;
      setMoveIntensity(intensity);
    }, 16);

    setCurrentId(targetId);

    if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    moveTimerRef.current = setTimeout(() => {
      setIsMoving(false);
      setMoveIntensity(0);
      if (intensityTimerRef.current) clearInterval(intensityTimerRef.current);
    }, TRANSITION_MS);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail && typeof detail.id === "string") {
        handleMove(detail.id);
      }
    };
    window.addEventListener("archivex:navigate", handler);
    return () => window.removeEventListener("archivex:navigate", handler);
  }, []);

  useEffect(() => {
    return () => {
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
      if (intensityTimerRef.current) clearInterval(intensityTimerRef.current);
    };
  }, []);

  const target = getSection(currentId);

  const cameraStyle: React.CSSProperties = {
    transform: `translate(${-target.x}vw, ${-target.y}vh)`,
    transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    willChange: "transform",
  };

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      <div style={cameraStyle} data-camera-world>
        {SECTIONS.map((sec) => (
          <Section
            key={sec.id}
            section={sec}
            active={currentId === sec.id}
            isMoving={isMoving}
            moveIntensity={moveIntensity}
            currentId={currentId}
          />
        ))}
      </div>
      <NavArrows currentId={currentId} onMove={handleMove} />
    </div>
  );
}