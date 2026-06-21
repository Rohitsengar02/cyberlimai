"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * AuroraHead
 * A minimal floating "head" — a diffused aurora-light sphere with
 * clean white vector facial lines (Notion-style brows, dot eyes, L-nose).
 * Reacts gently to mouse position: parallax tilt + subtle eye/feature drift.
 * Independently floats via a slow vertical bob, even with no mouse input.
 */
export default function AuroraHead() {
  const sceneRef = useRef(null);
  const headRef = useRef(null);
  const auroraRef = useRef(null);
  const eyesRef = useRef(null);
  const browsRef = useRef(null);
  const noseRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    /* ---- gentle perpetual float (independent of mouse) ---- */
    const floatTl = gsap.to(headRef.current, {
      y: -14,
      duration: 3.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const auroraDrift = gsap.to(auroraRef.current, {
      rotate: 8,
      scale: 1.04,
      duration: 7,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "50% 50%",
    });

    /* ---- mouse-reactive parallax, via quickTo (cheap, GPU) ---- */
    const headX = gsap.quickTo(headRef.current, "x", { duration: 0.9, ease: "power3.out" });
    const headRotY = gsap.quickTo(headRef.current, "rotateY", { duration: 1, ease: "power3.out" });
    const headRotX = gsap.quickTo(headRef.current, "rotateX", { duration: 1, ease: "power3.out" });

    const eyesX = gsap.quickTo(eyesRef.current, "x", { duration: 0.6, ease: "power3.out" });
    const eyesY = gsap.quickTo(eyesRef.current, "y", { duration: 0.6, ease: "power3.out" });

    const browsX = gsap.quickTo(browsRef.current, "x", { duration: 0.7, ease: "power3.out" });
    const noseX = gsap.quickTo(noseRef.current, "x", { duration: 0.8, ease: "power3.out" });

    const auroraX = gsap.quickTo(auroraRef.current, "x", { duration: 1.4, ease: "power3.out" });
    const auroraY = gsap.quickTo(auroraRef.current, "y", { duration: 1.4, ease: "power3.out" });

    const highlightX = gsap.quickTo(highlightRef.current, "x", { duration: 0.5, ease: "power3.out" });
    const highlightY = gsap.quickTo(highlightRef.current, "y", { duration: 0.5, ease: "power3.out" });

    function onMove(e) {
      const rect = scene.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      headX(px * 18);
      headRotY(px * 10);
      headRotX(-py * 8);

      eyesX(px * 6);
      eyesY(py * 4);

      browsX(px * 4);
      noseX(px * 3);

      auroraX(px * 26);
      auroraY(py * 18);

      highlightX(px * 36);
      highlightY(py * 26);
    }

    function onLeave() {
      headX(0);
      headRotY(0);
      headRotX(0);
      eyesX(0);
      eyesY(0);
      browsX(0);
      noseX(0);
      auroraX(0);
      auroraY(0);
      highlightX(0);
      highlightY(0);
    }

    window.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);

    return () => {
      floatTl.kill();
      auroraDrift.kill();
      window.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#f8f7f4]"
      style={{ perspective: 1200 }}
    >
      {/* faint ambient grain so the off-white doesn't look flat */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-multiply [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

      <div
        ref={headRef}
        className="relative h-[340px] w-[340px] md:h-[420px] md:w-[420px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ---------------- AURORA GLOW SPHERE ---------------- */}
        <div
          ref={auroraRef}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(170,225,255,0.95), transparent 55%)," +
              "radial-gradient(circle at 65% 40%, rgba(190,160,255,0.85), transparent 55%)," +
              "radial-gradient(circle at 50% 70%, rgba(120,200,235,0.8), transparent 60%)," +
              "radial-gradient(circle at 50% 50%, rgba(140,190,255,0.5), transparent 70%)",
            filter: "blur(28px)",
          }}
        />
        {/* secondary tighter glow for density at the core */}
        <div
          className="absolute inset-[18%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, rgba(200,235,255,0.9), transparent 60%)," +
              "radial-gradient(circle at 60% 60%, rgba(175,150,255,0.7), transparent 65%)",
            filter: "blur(14px)",
          }}
        />
        {/* roving specular highlight */}
        <div
          ref={highlightRef}
          className="absolute left-[28%] top-[22%] h-16 w-16 rounded-full bg-white/70"
          style={{ filter: "blur(18px)" }}
        />

        {/* soft outer falloff so edges dissolve into the background */}
        <div
          className="absolute -inset-10 rounded-full"
          style={{
            background: "radial-gradient(circle, transparent 55%, #f8f7f4 78%)",
          }}
        />

        {/* ---------------- FACE — clean white vector lines ---------------- */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))" }}
        >
          {/* eyebrows — Notion-style high curves */}
          <g ref={browsRef}>
            <path
              d="M 62 78 Q 76 60 92 76"
              fill="none"
              stroke="white"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M 108 76 Q 124 60 138 78"
              fill="none"
              stroke="white"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </g>

          {/* eyes — simple dots */}
          <g ref={eyesRef}>
            <circle cx="78" cy="98" r="3.6" fill="white" />
            <circle cx="122" cy="98" r="3.6" fill="white" />
          </g>

          {/* nose — prominent "L" shaped line */}
          <path
            ref={noseRef}
            d="M 100 92 L 100 120 L 114 120"
            fill="none"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
