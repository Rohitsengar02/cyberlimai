"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * AuroraHead — Premium Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Visual features:
 *   • Multi-layer aurora glow sphere with CSS hue-shift animation
 *   • Pulsing bright inner core
 *   • Dual counter-rotating halo rings (3-D perspective tilt)
 *   • 5 orbiting light particles
 *   • Realistic iris + pupil + specular-shine eyes
 *   • Eyelid blink (SVG ellipse, tweened ry attr)
 *   • High-arched brows, L-nose, gentle smile, cheekbone blush arcs
 *   • Mouse parallax: head tilt, aurora shift, eye drift, feature drift
 *   • Auto infinite Y+X face-rotation sweep
 *   • Auto eye-blink on random 2-5 s schedule
 *   • Breathing scale pulse (4 s period)
 *   • Hover Web-Audio chime (F4→A4 + C5 detuned triangle)
 */
export default function AuroraHead() {
  const sceneRef     = useRef<HTMLDivElement>(null);
  const headRef      = useRef<HTMLDivElement>(null);
  const auroraRef    = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // SVG face refs
  const browsRef    = useRef<SVGGElement>(null);
  const eyesGRef    = useRef<SVGGElement>(null);          // whole eyes group (parallax)
  const eyeLidLRef  = useRef<SVGEllipseElement>(null);   // left eyelid
  const eyeLidRRef  = useRef<SVGEllipseElement>(null);   // right eyelid
  const noseRef     = useRef<SVGPathElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    /* ══════════════════════════════════════════
       1. PERPETUAL VERTICAL FLOAT
    ══════════════════════════════════════════ */
    const floatTl = gsap.to(headRef.current, {
      y: -14, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true,
    });

    /* ══════════════════════════════════════════
       2. AURORA COLOUR DRIFT
    ══════════════════════════════════════════ */
    const auroraDrift = gsap.to(auroraRef.current, {
      rotate: 10, scale: 1.06, duration: 7, ease: "sine.inOut",
      repeat: -1, yoyo: true, transformOrigin: "50% 50%",
    });

    /* ══════════════════════════════════════════
       3. AUTO FACE ROTATION (Y sway + X nod)
    ══════════════════════════════════════════ */
    const autoRotY = gsap.to(headRef.current, {
      rotationY: 20, duration: 5, ease: "sine.inOut", repeat: -1, yoyo: true,
    });
    const autoRotX = gsap.to(headRef.current, {
      rotationX: 7, duration: 6.8, ease: "sine.inOut",
      repeat: -1, yoyo: true, delay: 1.5,
    });

    /* ══════════════════════════════════════════
       4. BREATHING SCALE
    ══════════════════════════════════════════ */
    const breathe = gsap.to(headRef.current, {
      scale: 1.028, duration: 4.2, ease: "sine.inOut", repeat: -1, yoyo: true,
    });

    /* ══════════════════════════════════════════
       5. EYE BLINK — tween SVG attr ry of eyelids
    ══════════════════════════════════════════ */
    let blinkTimer: ReturnType<typeof setTimeout>;

    function scheduleBlink() {
      const delay = 2000 + Math.random() * 3200; // 2 – 5.2 s
      blinkTimer = setTimeout(() => {
        const tl = gsap.timeline({ onComplete: scheduleBlink });
        // Close eyelids (ry 0 → 9)
        tl.to([eyeLidLRef.current, eyeLidRRef.current], {
          attr: { ry: 9 }, duration: 0.065, ease: "power2.in",
        })
        // Re-open (ry 9 → 0)
        .to([eyeLidLRef.current, eyeLidRRef.current], {
          attr: { ry: 0 }, duration: 0.11, ease: "power2.out",
        });
      }, delay);
    }
    scheduleBlink();

    /* ══════════════════════════════════════════
       6. MOUSE PARALLAX — quickTo (GPU-smooth)
    ══════════════════════════════════════════ */
    const headX    = gsap.quickTo(headRef.current,     "x",         { duration: 0.9, ease: "power3.out" });
    const headRotY = gsap.quickTo(headRef.current,     "rotationY", { duration: 1.0, ease: "power3.out" });
    const headRotX = gsap.quickTo(headRef.current,     "rotationX", { duration: 1.0, ease: "power3.out" });

    const eyesX    = gsap.quickTo(eyesGRef.current,   "x",         { duration: 0.55, ease: "power3.out" });
    const eyesY    = gsap.quickTo(eyesGRef.current,   "y",         { duration: 0.55, ease: "power3.out" });
    const browsX   = gsap.quickTo(browsRef.current,   "x",         { duration: 0.65, ease: "power3.out" });
    const noseX    = gsap.quickTo(noseRef.current,    "x",         { duration: 0.75, ease: "power3.out" });
    const auroraX  = gsap.quickTo(auroraRef.current,  "x",         { duration: 1.4,  ease: "power3.out" });
    const auroraY  = gsap.quickTo(auroraRef.current,  "y",         { duration: 1.4,  ease: "power3.out" });
    const hlX      = gsap.quickTo(highlightRef.current,"x",        { duration: 0.5,  ease: "power3.out" });
    const hlY      = gsap.quickTo(highlightRef.current,"y",        { duration: 0.5,  ease: "power3.out" });

    function onMove(e: MouseEvent) {
      if (!scene) return;
      const r  = scene.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;

      headX(px * 18); headRotY(px * 12); headRotX(-py * 9);
      eyesX(px * 7);  eyesY(py * 5);
      browsX(px * 4); noseX(px * 3);
      auroraX(px * 28); auroraY(py * 20);
      hlX(px * 38);   hlY(py * 28);
    }

    function onLeave() {
      headX(0); headRotY(0); headRotX(0);
      eyesX(0); eyesY(0); browsX(0); noseX(0);
      auroraX(0); auroraY(0); hlX(0); hlY(0);
    }

    /* ══════════════════════════════════════════
       7. HOVER SOUND (Web Audio — no external deps)
    ══════════════════════════════════════════ */
    let audioCtx: AudioContext | null = null;

    function playHoverSound() {
      try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (!AC) return;
        if (!audioCtx) audioCtx = new AC();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const ctx = audioCtx;

        const mg = ctx.createGain();
        mg.gain.setValueAtTime(0, ctx.currentTime);
        mg.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.12);
        mg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);

        const lpf = ctx.createBiquadFilter();
        lpf.type = "lowpass";
        lpf.frequency.setValueAtTime(500, ctx.currentTime);
        lpf.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.4);

        const o1 = ctx.createOscillator(); o1.type = "sine";
        o1.frequency.setValueAtTime(349.23, ctx.currentTime);
        o1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.0);

        const o2 = ctx.createOscillator(); o2.type = "triangle";
        o2.frequency.setValueAtTime(523.25, ctx.currentTime);
        o2.detune.setValueAtTime(8, ctx.currentTime);

        o1.connect(lpf); o2.connect(lpf);
        lpf.connect(mg); mg.connect(ctx.destination);
        o1.start(); o2.start();
        o1.stop(ctx.currentTime + 1.6); o2.stop(ctx.currentTime + 1.6);
      } catch (e) { /* silent */ }
    }

    window.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    scene.addEventListener("mouseenter", playHoverSound);

    return () => {
      floatTl.kill(); auroraDrift.kill();
      autoRotY.kill(); autoRotX.kill(); breathe.kill();
      clearTimeout(blinkTimer);
      window.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
      scene.removeEventListener("mouseenter", playHoverSound);
      if (audioCtx) audioCtx.close();
    };
  }, []);

  /* ─── Orbiting particle data ─── */
  const particles = [
    { r: 145, start: 0,   dur: 7.0,  size: 5,   color: "rgba(120,220,255,0.9)" },
    { r: 158, start: 72,  dur: 9.2,  size: 3.5, color: "rgba(200,150,255,0.85)" },
    { r: 132, start: 144, dur: 5.8,  size: 4,   color: "rgba(100,210,240,0.8)" },
    { r: 162, start: 216, dur: 11.0, size: 6,   color: "rgba(220,180,255,0.75)" },
    { r: 148, start: 288, dur: 8.5,  size: 3,   color: "rgba(170,240,255,0.85)" },
  ];

  return (
    <div
      ref={sceneRef}
      className="relative flex h-[360px] w-[360px] md:h-[440px] md:w-[440px] items-center justify-center bg-transparent"
      style={{ perspective: 1200 }}
    >
      {/* ─── Global CSS Animations ─── */}
      <style>{`
        @keyframes ah-hue {
          0%,100% { filter: blur(28px) hue-rotate(0deg)   saturate(1.1); }
          33%      { filter: blur(30px) hue-rotate(18deg)  saturate(1.3); }
          66%      { filter: blur(26px) hue-rotate(-12deg) saturate(1.2); }
        }
        @keyframes ah-core {
          0%,100% { opacity:.65; transform:scale(1); }
          50%      { opacity:1;   transform:scale(1.1); }
        }
        @keyframes ah-ring1 {
          from { transform: rotateX(70deg) rotateZ(0deg);   }
          to   { transform: rotateX(70deg) rotateZ(360deg); }
        }
        @keyframes ah-ring2 {
          from { transform: rotateX(55deg) rotateZ(360deg); }
          to   { transform: rotateX(55deg) rotateZ(0deg);   }
        }
        @keyframes ah-particle {
          from { transform: rotate(var(--ps)) translateX(var(--pr)) rotate(calc(-1*var(--ps))); }
          to   { transform: rotate(calc(var(--ps) + 360deg)) translateX(var(--pr)) rotate(calc(-1*(var(--ps)+360deg))); }
        }
        @keyframes ah-ppulse {
          0%,100% { opacity:.45; } 50% { opacity:1; }
        }
        @keyframes ah-shine {
          0%,100% { opacity:.75; }
          50%      { opacity:1;  }
        }
        .ah-sphere { animation: ah-hue   10s ease-in-out infinite; }
        .ah-core   { animation: ah-core  2.8s ease-in-out infinite; }
        .ah-ring1  { animation: ah-ring1 11s  linear      infinite; }
        .ah-ring2  { animation: ah-ring2 15s  linear      infinite; }
        .ah-shine  { animation: ah-shine 3.2s ease-in-out infinite; }
      `}</style>

      {/* ══ ORBITING PARTICLES (rendered outside headRef so they don't inherit 3-D tilt) ══ */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%",
            width:  p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop:  -p.size / 2,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            // CSS custom properties for the keyframe
            ["--ps" as string]: `${p.start}deg`,
            ["--pr" as string]: `${p.r}px`,
            animation: `ah-particle ${p.dur}s linear infinite, ah-ppulse ${(p.dur * 0.55).toFixed(1)}s ease-in-out infinite`,
          } as React.CSSProperties}
        />
      ))}

      {/* ══ HEAD CONTAINER (all 3-D transforms applied here by GSAP) ══ */}
      <div
        ref={headRef}
        className="relative h-[280px] w-[280px] md:h-[340px] md:w-[340px]"
        style={{ transformStyle: "preserve-3d" }}
      >

        {/* ── Halo ring 1 ── */}
        <div
          className="ah-ring1 absolute pointer-events-none"
          style={{
            width: "120%", height: "120%", top: "-10%", left: "-10%",
            borderRadius: "50%",
            border: "1.5px solid rgba(150,210,255,0.4)",
            boxShadow: "0 0 18px rgba(140,200,255,0.2), inset 0 0 18px rgba(140,200,255,0.12)",
          }}
        />
        {/* ── Halo ring 2 ── */}
        <div
          className="ah-ring2 absolute pointer-events-none"
          style={{
            width: "110%", height: "110%", top: "-5%", left: "-5%",
            borderRadius: "50%",
            border: "1px solid rgba(200,160,255,0.3)",
            boxShadow: "0 0 12px rgba(190,150,255,0.15)",
          }}
        />

        {/* ── Main aurora sphere ── */}
        <div
          ref={auroraRef}
          className="ah-sphere absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 33% 28%, rgba(165,228,255,0.98), transparent 52%)," +
              "radial-gradient(circle at 68% 38%, rgba(195,158,255,0.9),  transparent 52%)," +
              "radial-gradient(circle at 50% 72%, rgba(118,205,240,0.85), transparent 58%)," +
              "radial-gradient(circle at 50% 50%, rgba(145,195,255,0.55), transparent 68%)",
          }}
        />

        {/* ── Secondary inner glow (density layer) ── */}
        <div
          className="absolute inset-[16%] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 38% 32%, rgba(205,238,255,0.95), transparent 58%)," +
              "radial-gradient(circle at 62% 62%, rgba(178,148,255,0.75), transparent 62%)",
            filter: "blur(12px)",
          }}
        />

        {/* ── Pulsing bright core ── */}
        <div
          className="ah-core absolute pointer-events-none"
          style={{
            width: "28%", height: "28%", top: "36%", left: "36%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(228,245,255,1) 0%, rgba(185,218,255,0.7) 55%, transparent 100%)",
            filter: "blur(7px)",
          }}
        />

        {/* ── Primary roving specular ── */}
        <div
          ref={highlightRef}
          className="ah-shine absolute left-[26%] top-[20%] h-14 w-14 rounded-full bg-white/80 pointer-events-none"
          style={{ filter: "blur(15px)" }}
        />
        {/* ── Secondary static specular (smaller) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 16, height: 16, top: "28%", left: "60%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.65)",
            filter: "blur(5px)",
          }}
        />

        {/* ══════════════════════════════════════
            FACE SVG
        ══════════════════════════════════════ */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{
            filter: [
              "drop-shadow(0 0 1.5px rgba(10,15,40,0.3))",
              "drop-shadow(0 0 10px rgba(255,255,255,0.95))",
            ].join(" "),
          }}
        >
          <defs>
            {/* Iris gradients — left (cyan) & right (violet) */}
            <radialGradient id="ah-iris-l" cx="38%" cy="32%" r="62%">
              <stop offset="0%"   stopColor="rgba(190,238,255,1)" />
              <stop offset="40%"  stopColor="rgba(90,185,255,0.95)" />
              <stop offset="100%" stopColor="rgba(45,115,210,0.8)" />
            </radialGradient>
            <radialGradient id="ah-iris-r" cx="38%" cy="32%" r="62%">
              <stop offset="0%"   stopColor="rgba(220,195,255,1)" />
              <stop offset="40%"  stopColor="rgba(165,118,255,0.95)" />
              <stop offset="100%" stopColor="rgba(95,72,210,0.8)" />
            </radialGradient>
            {/* Limbal ring gradient (dark edge of iris) */}
            <radialGradient id="ah-limbal" cx="50%" cy="50%" r="50%">
              <stop offset="60%"  stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(20,10,50,0.5)" />
            </radialGradient>
          </defs>

          {/* ── Eyebrows — high arched curves ── */}
          <g ref={browsRef}>
            <path d="M 58 80 Q 76 58 96 76"  fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="3"   strokeLinecap="round" />
            <path d="M 104 76 Q 124 58 142 80" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="3"   strokeLinecap="round" />
          </g>

          {/* ── Eyes group (moves with parallax) ── */}
          <g ref={eyesGRef}>

            {/* — Left eye — */}
            {/* Iris */}
            <circle cx="78" cy="98" r="9.5"  fill="url(#ah-iris-l)"  />
            {/* Limbal ring overlay */}
            <circle cx="78" cy="98" r="9.5"  fill="url(#ah-limbal)"  />
            {/* Pupil */}
            <circle cx="78" cy="98" r="4.8"  fill="rgba(15,8,35,0.9)" />
            {/* Primary shine */}
            <circle cx="74.5" cy="94.5" r="2"   fill="rgba(255,255,255,0.95)" />
            {/* Secondary shine */}
            <circle cx="81"   cy="102"  r="1"   fill="rgba(255,255,255,0.5)" />
            {/* Eyelid (blink) — starts hidden (ry=0) */}
            <ellipse
              ref={eyeLidLRef}
              cx="78" cy="95" rx="10" ry={0}
              fill="rgba(165,215,255,0.55)"
              style={{ transformOrigin: "78px 88px" }}
            />

            {/* — Right eye — */}
            <circle cx="122" cy="98" r="9.5"  fill="url(#ah-iris-r)"  />
            <circle cx="122" cy="98" r="9.5"  fill="url(#ah-limbal)"  />
            <circle cx="122" cy="98" r="4.8"  fill="rgba(15,8,35,0.9)" />
            <circle cx="118.5" cy="94.5" r="2" fill="rgba(255,255,255,0.95)" />
            <circle cx="125"   cy="102"  r="1" fill="rgba(255,255,255,0.5)" />
            <ellipse
              ref={eyeLidRRef}
              cx="122" cy="95" rx="10" ry={0}
              fill="rgba(200,175,255,0.55)"
              style={{ transformOrigin: "122px 88px" }}
            />
          </g>

          {/* ── Nose — prominent "L" line ── */}
          <path
            ref={noseRef}
            d="M 100 110 L 100 126 L 114 126"
            fill="none"
            stroke="rgba(255,255,255,0.82)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Smile — gentle upward curve ── */}
          <path
            d="M 87 140 Q 100 152 113 140"
            fill="none"
            stroke="rgba(255,255,255,0.62)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* ── Chin accent ── */}
          <line
            x1="100" y1="155" x2="100" y2="162"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* ── Cheekbone blush arcs ── */}
          <path d="M 52 114 Q 62 118 60 126" fill="none" stroke="rgba(255,175,195,0.38)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 148 114 Q 138 118 140 126" fill="none" stroke="rgba(255,175,195,0.38)" strokeWidth="2.2" strokeLinecap="round" />

          {/* ── Temple accent dots ── */}
          <circle cx="52"  cy="100" r="1.2" fill="rgba(200,230,255,0.4)" />
          <circle cx="148" cy="100" r="1.2" fill="rgba(200,210,255,0.4)" />
        </svg>
      </div>
    </div>
  );
}
