"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* ─────────────────────────────────────────────────────────────────
   TubesCursor
   ─────────────────────────────────────────────────────────────────
   Renders the three.js "tubes1" cursor effect from threejs-components
   as a fixed full-viewport canvas (pointer-events: none) using
   mix-blend-mode: screen — so the black WebGL background becomes
   invisible on the light page while neon glowing tubes remain visible.

   A thin GSAP-tracked dot is overlaid so the user keeps a precise
   click target at all times.

   Click anywhere → randomises tube + light colours.
   ──────────────────────────────────────────────────────────────── */

const randomHex = () =>
  "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
const randomPalette = (n: number) => Array.from({ length: n }, randomHex);

// Default palette — cyan / violet / emerald to match the landing page
const DEFAULT_TUBES  = ["#22d3ee", "#8b5cf6", "#10b981"];
const DEFAULT_LIGHTS = ["#67e8f9", "#a78bfa", "#34d399", "#f0abfc"];

export default function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const appRef    = useRef<any>(null);

  /* ── 1. Load tubes library (CDN ESM), initialise WebGL canvas ── */
  useEffect(() => {
    if (!canvasRef.current) return;
    let mounted = true;

    (async () => {
      try {
        // Dynamic ESM import from jsDelivr CDN
        // @ts-ignore — URL string import, valid in modern browser useEffect
        const mod = await import(
          "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
        );
        const TubesCursorFactory = mod.default ?? mod;
        if (!mounted || !canvasRef.current) return;

        appRef.current = TubesCursorFactory(canvasRef.current, {
          tubes: {
            colors: DEFAULT_TUBES,
            lights: {
              intensity: 200,
              colors: DEFAULT_LIGHTS,
            },
          },
        });
      } catch (err) {
        // Non-fatal — page works fine without the 3-D cursor
        console.warn("[TubesCursor] Failed to load:", err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  /* ── 2. Click anywhere → randomise colours ── */
  useEffect(() => {
    const onWindowClick = () => {
      if (!appRef.current) return;
      try {
        appRef.current.tubes?.setColors(randomPalette(3));
        appRef.current.tubes?.setLightsColors(randomPalette(4));
      } catch (_) { /* ignore if lib doesn't expose method yet */ }
    };
    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, []);

  /* ── 3. Small precision-dot cursor (GSAP quickTo) ── */
  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });

    const onMove = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* ── Three.js neon-tubes canvas ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 hidden md:block pointer-events-none"
        style={{
          zIndex: 190,
          width:  "100vw",
          height: "100vh",
          /* screen blend: black WebGL bg → invisible; neon tubes → additive glow */
          mixBlendMode: "screen",
          opacity: 0.88,
        }}
      />

      {/* ── Precision dot (always on top) ── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block"
        style={{
          width:  8,
          height: 8,
          marginLeft: -4,
          marginTop:  -4,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 0 0 1.5px rgba(139,92,246,0.7), 0 0 10px rgba(34,211,238,0.5)",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
