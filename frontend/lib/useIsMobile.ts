"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const SMALL_BREAKPOINT = 480;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
const [isMobile, setIsMobile] = useState<boolean>(false);

useEffect(() => {
  if (typeof window === "undefined") return;
  const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
  const apply = () => setIsMobile(mq.matches);
  apply();
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }
  mq.addListener(apply);
  return () => mq.removeListener(apply);
}, [breakpoint]);

return isMobile;
}

export function useIsSmallScreen(): boolean {
return useIsMobile(SMALL_BREAKPOINT);
}

export function useIsCoarsePointer(): boolean {
const [coarse, setCoarse] = useState<boolean>(false);

useEffect(() => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
  const mq = window.matchMedia("(pointer: coarse)");
  const apply = () => setCoarse(mq.matches);
  apply();
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }
  mq.addListener(apply);
  return () => mq.removeListener(apply);
}, []);

return coarse;
}

export function useIsTouchDevice(): boolean {
const [touch, setTouch] = useState<boolean>(false);

useEffect(() => {
  if (typeof window === "undefined") return;
  const has =
    "ontouchstart" in window ||
    (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 0;
  setTouch(Boolean(has));
}, []);

return touch;
}

export function useViewportSize(): { width: number; height: number } {
const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

useEffect(() => {
  if (typeof window === "undefined") return;
  const apply = () => setSize({ width: window.innerWidth, height: window.innerHeight });
  apply();
  window.addEventListener("resize", apply, { passive: true });
  window.addEventListener("orientationchange", apply, { passive: true });
  return () => {
    window.removeEventListener("resize", apply);
    window.removeEventListener("orientationchange", apply);
  };
}, []);

return size;
}

export function useReducedMotion(): boolean {
const [reduced, setReduced] = useState<boolean>(false);

useEffect(() => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const apply = () => setReduced(mq.matches);
  apply();
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }
  mq.addListener(apply);
  return () => mq.removeListener(apply);
}, []);

return reduced;
}

export const BREAKPOINTS = {
small: SMALL_BREAKPOINT,
mobile: MOBILE_BREAKPOINT,
} as const;
