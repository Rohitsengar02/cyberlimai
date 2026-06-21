"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  id: number;
}

export default function PortfolioLanding() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [laggedMouse, setLaggedMouse] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [trails, setTrails] = useState<TrailParticle[]>([]);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  const targetMouse = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Handle window resizing (client-side only)
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update theme based on system/component state
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Main Lerp Animation Loop for the Lagged Blob Cursor
  useEffect(() => {
    let animId: number;
    const lerp = () => {
      setLaggedMouse((prev) => {
        const dx = targetMouse.current.x - prev.x;
        const dy = targetMouse.current.y - prev.y;
        return {
          x: prev.x + dx * 0.12, // 12% lag interpolation
          y: prev.y + dy * 0.12,
        };
      });
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Update and decay trail particles
  useEffect(() => {
    let animId: number;
    const decayTrails = () => {
      setTrails((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            opacity: particle.opacity - 0.035, // Fade out
            size: particle.size - 0.7, // Shrink
          }))
          .filter((particle) => particle.opacity > 0 && particle.size > 0)
      );
      animId = requestAnimationFrame(decayTrails);
    };
    animId = requestAnimationFrame(decayTrails);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle Mouse Movement
  const handleMouseMove = (e: React.MouseEvent) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    // Update target mouse ref
    targetMouse.current = { x: clientX, y: clientY };
    setMouse({ x: clientX, y: clientY });
    setIsVisible(true);

    // Calculate parallax offset (opposite of mouse direction, max 15px shift)
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const offsetX = (clientX - centerX) / centerX; // -1 to 1
    const offsetY = (clientY - centerY) / centerY; // -1 to 1
    setParallaxOffset({
      x: -offsetX * 18,
      y: -offsetY * 18,
    });

    // Handle trails creation based on mouse travel speed
    const dx = clientX - lastMousePos.current.x;
    const dy = clientY - lastMousePos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    if (speed > 8) {
      // Create new trail particle
      const size = Math.max(30, Math.min(85, speed * 1.6));
      setTrails((prev) => [
        ...prev.slice(-15), // Limit queue size to 15 particles
        {
          x: clientX,
          y: clientY,
          size,
          opacity: 0.85,
          id: Math.random() + Date.now(),
        },
      ]);
      lastMousePos.current = { x: clientX, y: clientY };
    }
  };

  // Determine Blob Radius based on what is hovered
  const getBlobRadius = () => {
    if (hoveredElement === "name") return 220;
    if (hoveredElement === "link") return 160;
    if (hoveredElement === "socials") return 150;
    return 110; // Default size
  };

  const blobRadius = getBlobRadius();

  // Wave paths responding gently to mouse coordinates
  const getWavePath1 = () => {
    const midX = dimensions.width / 2;
    const midY = dimensions.height * 0.45;
    // Mouse sway calculation
    const swayX = (mouse.x - dimensions.width / 2) * 0.04;
    const swayY = (mouse.y - dimensions.height / 2) * 0.04;
    return `M 0 ${midY} Q ${midX * 0.5 + swayX} ${midY - 100 + swayY} ${midX + swayX} ${midY + swayY} T ${dimensions.width} ${midY}`;
  };

  const getWavePath2 = () => {
    const midX = dimensions.width / 2;
    const midY = dimensions.height * 0.55;
    const swayX = (mouse.x - dimensions.width / 2) * -0.03;
    const swayY = (mouse.y - dimensions.height / 2) * -0.03;
    return `M 0 ${midY} Q ${midX * 0.65 + swayX} ${midY + 120 + swayY} ${midX + swayX} ${midY + swayY} T ${dimensions.width} ${midY}`;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => {
        setIsVisible(false);
        setParallaxOffset({ x: 0, y: 0 });
      }}
      className="relative w-screen h-screen overflow-hidden bg-white select-none transition-colors duration-300"
    >
      {/* ─── ANIMATED BACKGROUND WAVE LINES ─── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.12] z-0">
        <path
          d={getWavePath1()}
          fill="none"
          stroke="#000"
          strokeWidth="1.2"
          className="transition-all duration-300 ease-out"
        />
        <path
          d={getWavePath2()}
          fill="none"
          stroke="#000"
          strokeWidth="1"
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* ─── LAYER 1: BASE HEADSHOT IMAGE (NORMAL STYLE) ─── */}
      <div
        style={{
          transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px) scale(1.02)`,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="absolute inset-0 w-full h-full z-0 flex items-center justify-center"
      >
        <img
          src="/headshot_normal.png"
          alt="Rohit Portrait"
          className="w-full h-full object-cover select-none pointer-events-none opacity-95"
        />
      </div>

      {/* ─── LAYER 2: INTERACTIVE REVEAL MASK LAYER (CREATIVE NEON STYLE) ─── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{
          transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px) scale(1.02)`,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <defs>
          {/* Gooey filter configuration */}
          <filter id="gooey-mask-reveal">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11"
              result="gooey"
            />
          </filter>

          {/* Mask linking the gooey group */}
          <mask id="reveal-svg-mask">
            {/* Transparent backdrop */}
            <rect width="100%" height="100%" fill="black" />
            
            {/* White regions inside mask reveal the target image */}
            <g filter="url(#gooey-mask-reveal)">
              {isVisible && (
                <circle
                  cx={laggedMouse.x}
                  cy={laggedMouse.y}
                  r={blobRadius}
                  fill="white"
                />
              )}
              {trails.map((particle) => (
                <circle
                  key={particle.id}
                  cx={particle.x}
                  cy={particle.y}
                  r={particle.size}
                  fill="white"
                  opacity={particle.opacity}
                />
              ))}
            </g>
          </mask>
        </defs>

        {/* The creative headshot image, revealed only where mask is white */}
        <image
          href="/headshot_creative.png"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#reveal-svg-mask)"
        />
      </svg>

      {/* ─── LAYER 3: INTERACTIVE TEXT ELEMENTS & PARALLAX CONTROLS ─── */}
      <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-8 sm:p-12 md:p-16 z-20 pointer-events-none">
        
        {/* Top bar (Name & Portfolio Link) */}
        <div className="w-full flex justify-between items-start">
          {/* Name in top left, Stacked serif font */}
          <div
            onMouseEnter={() => setHoveredElement("name")}
            onMouseLeave={() => setHoveredElement(null)}
            style={{
              transform: `translate(${parallaxOffset.x * 1.1}px, ${parallaxOffset.y * 1.1}px)`,
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease",
            }}
            className={`pointer-events-auto font-serif-playfair text-5xl sm:text-6xl md:text-7xl font-normal leading-[0.95] tracking-tight cursor-default ${
              hoveredElement === "name" ? "text-white select-none" : "text-[#0c0c0e]"
            }`}
          >
            <div className="overflow-hidden">
              <span className="block">ROHIT</span>
            </div>
            <div className="overflow-hidden mt-1">
              <span className="block">KUMAR</span>
            </div>
            <div className="text-[10px] sm:text-xs font-sans tracking-[0.25em] text-slate-400 font-extrabold uppercase mt-4 pointer-events-none">
              Creative Developer
            </div>
          </div>

          {/* Portfolio link in top right */}
          <div
            onMouseEnter={() => setHoveredElement("link")}
            onMouseLeave={() => setHoveredElement(null)}
            style={{
              transform: `translate(${parallaxOffset.x * 0.9}px, ${parallaxOffset.y * 0.9}px)`,
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="pointer-events-auto"
          >
            <Link
              href="/dashboard"
              className={`font-sans font-bold text-xs sm:text-sm tracking-[0.15em] uppercase pb-1 border-b transition-all duration-300 flex items-center gap-1.5 ${
                hoveredElement === "link"
                  ? "text-white border-white scale-105"
                  : "text-[#0c0c0e] border-[#0c0c0e]/30 hover:border-[#0c0c0e]"
              }`}
            >
              Leads ERP Console <span className="text-[10px]">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar (Footer label & Social media icons) */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 sm:gap-0">
          {/* Subtle credits/info left */}
          <div
            style={{
              transform: `translate(${parallaxOffset.x * 0.8}px, ${parallaxOffset.y * 0.8}px)`,
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="font-sans font-extrabold text-[9px] tracking-[0.3em] uppercase text-slate-450 dark:text-slate-500 text-center sm:text-left"
          >
            Interactive Reveal Portfolio &copy; {new Date().getFullYear()}
          </div>

          {/* Social media icons bottom right */}
          <div
            onMouseEnter={() => setHoveredElement("socials")}
            onMouseLeave={() => setHoveredElement(null)}
            style={{
              transform: `translate(${parallaxOffset.x * 1.2}px, ${parallaxOffset.y * 1.2}px)`,
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className={`pointer-events-auto flex items-center gap-6 sm:gap-7 transition-colors duration-300 ${
              hoveredElement === "socials" ? "text-white" : "text-[#0c0c0e]"
            }`}
          >
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-115 transition-all duration-350"
              aria-label="Instagram"
            >
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>

            {/* X/Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-115 transition-all duration-350"
              aria-label="X / Twitter"
            >
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-115 transition-all duration-350"
              aria-label="YouTube"
            >
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-115 transition-all duration-350"
              aria-label="LinkedIn"
            >
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
