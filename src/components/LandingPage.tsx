"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Lightning,
  ChartLineUp,
  Gear,
  CheckCircle,
  Sparkle,
  Bell,
  EnvelopeSimple,
  PhoneCall,
  Icon,
} from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

import AuroraHead from "./AuroraHead";
import TubesCursor from "./TubesCursor";

/* CustomCursor replaced by TubesCursor (see TubesCursor.tsx) */

/* =========================================================================
   LOCOMOTIVE SCROLL + SCROLLTRIGGER BRIDGE
   ========================================================================= */
function useSmoothScroll(containerRef: React.RefObject<HTMLDivElement | null>, onLoad: () => void) {
  useEffect(() => {
    const scroll = new (LocomotiveScroll as any)();
    onLoad();
    return () => {
      scroll.destroy();
    };
  }, [onLoad]);
}

/* =========================================================================
   GSAP REVEAL HOOK — fade/translate batch on scroll
   ========================================================================= */
function useReveal(selector: string, scope: React.RefObject<HTMLDivElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !scope.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(selector) as HTMLElement[];
      items.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.8,
          ease: "power3.out",
          delay: (i % 3) * 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, scope.current);
    return () => ctx.revert();
  }, [selector, scope, active]);
}

/* =========================================================================
   HOVER CARD — tilt + spotlight, GSAP quickTo
   ========================================================================= */
interface HoverCardProps {
  className?: string;
  children: React.ReactNode;
  cursor?: string;
}

function HoverCard({ className = "", children, cursor = "view" }: HoverCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rotX = gsap.quickTo(el, "rotateX", { duration: 0.4, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotateY", { duration: 0.4, ease: "power3.out" });
    const spotX = gsap.quickTo(el, "--mx", { duration: 0.3, ease: "power3.out" });
    const spotY = gsap.quickTo(el, "--my", { duration: 0.3, ease: "power3.out" });

    function onMouseMove(e: MouseEvent) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rotY(-(px - 0.5) * 8);
      rotX((py - 0.5) * 8);
      spotX(px * 100);
      spotY(py * 100);
    }
    function onMouseLeave() {
      rotX(0);
      rotY(0);
    }
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-cursor={cursor}
      style={{ transformPerspective: 900, "--mx": "50%", "--my": "50%" } as React.CSSProperties}
      className={`group relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white transition-shadow duration-300 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(360px circle at var(--mx) var(--my), rgba(16,185,129,0.08), transparent 60%)" }}
      />
      {children}
    </div>
  );
}

/* =========================================================================
   LIVE CRM DEMO — the centerpiece "realtime" widget
   ========================================================================= */
const initialDeals = [
  { id: "d1", name: "Acme Corp", stage: "Qualified", value: "$24,000", owner: "PN" },
  { id: "d2", name: "Northwind", stage: "Proposal", value: "$58,200", owner: "MW" },
  { id: "d3", name: "Vortex Labs", stage: "Negotiation", value: "$12,400", owner: "LO" },
  { id: "d4", name: "Cobalt Inc", stage: "New", value: "$8,900", owner: "TA" },
];

interface ActivityFeedItem {
  icon: Icon;
  text: string;
}

const activityFeed: ActivityFeedItem[] = [
  { icon: EnvelopeSimple, text: "Email opened by Acme Corp" },
  { icon: PhoneCall, text: "Call logged with Northwind" },
  { icon: CheckCircle, text: "Vortex Labs moved to Negotiation" },
  { icon: Bell, text: "Reminder: follow up with Cobalt Inc" },
  { icon: Sparkle, text: "Automation: welcome sequence sent" },
];

const CrmDemo = memo(function CrmDemo() {
  const [deals, setDeals] = useState(initialDeals);
  const [feedIdx, setFeedIdx] = useState(0);
  const [pulseId, setPulseId] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setDeals((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        const j = Math.floor(Math.random() * next.length);
        [next[i], next[j]] = [next[j], next[i]];
        setPulseId(next[i].id);
        return next;
      });
      setFeedIdx((i) => (i + 1) % activityFeed.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!pulseId) return;
    const t = setTimeout(() => setPulseId(null), 900);
    return () => clearTimeout(t);
  }, [pulseId]);

  const ActiveIcon = activityFeed[feedIdx].icon;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 text-left">
      <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 lg:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Live pipeline</p>
            <p className="text-lg font-medium tracking-tight text-zinc-900">$103,500 in motion</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Syncing
          </span>
        </div>
        <div className="mt-5 space-y-2.5">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${pulseId === deal.id ? "border-emerald-300 bg-emerald-50/60" : "border-slate-100 bg-zinc-50/60"
                }`}
              style={{ transition: "background-color 500ms ease, border-color 500ms ease" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-medium text-white">
                  {deal.owner}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{deal.name}</p>
                  <p className="text-xs text-zinc-500">{deal.stage}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-zinc-700">{deal.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200/60 bg-zinc-950 p-6 lg:col-span-2">
        <p className="text-xs font-medium text-zinc-505">Activity stream</p>
        <div className="mt-5 flex items-start gap-3" key={feedIdx}>
          <div className="crm-fade flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <ActiveIcon size={15} weight="bold" />
          </div>
          <p className="crm-fade text-sm leading-relaxed text-zinc-300">{activityFeed[feedIdx].text}</p>
        </div>
        <div className="mt-6 space-y-2 opacity-40">
          {activityFeed
            .filter((_, i) => i !== feedIdx)
            .slice(0, 3)
            .map((item, i) => (
              <p key={i} className="truncate text-xs text-zinc-500">
                {item.text}
              </p>
            ))}
        </div>
        <style>{`
          .crm-fade { animation: crm-fade-in 400ms cubic-bezier(0.23,1,0.32,1); }
          @keyframes crm-fade-in {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
});

/* =========================================================================
   SECTION 1 — NAV
   ========================================================================= */
function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/0 bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <span className="text-[15px] font-semibold tracking-tight text-zinc-900">Orbiq</span>
        <div className="hidden items-center gap-8 md:flex">
          {["Product", "CRM", "Automation", "Pricing"].map((item) => (
            <a key={item} data-cursor="link" href="#" className="text-sm text-zinc-650 hover:text-zinc-900">
              {item}
            </a>
          ))}
          <a data-cursor="link" href="/ai-test" className="text-sm font-medium text-indigo-650 hover:text-indigo-900 transition-colors flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            AI Test
          </a>
        </div>
        <button data-cursor="link" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Start free
        </button>
      </nav>
    </header>
  );
}

/* =========================================================================
   SECTION 2 — HERO (locomotive parallax via data-scroll-speed)
   ========================================================================= */
function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // 1. Entrance animation timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-fade", { opacity: 0, y: 15, duration: 0.6 })
        .from(".hero-title", { opacity: 0, y: 30, duration: 0.8 }, "-=0.4")
        .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
        .from(".hero-ctas", { opacity: 0, y: 15, duration: 0.6 }, "-=0.5")
        .from(".hero-proof", { opacity: 0, y: 10, duration: 0.6 }, "-=0.4")
        .from(".hero-character-wrap", { scale: 0.8, opacity: 0, duration: 0.9, ease: "back.out(1.5)" }, "-=0.8");

      // Animate SVG path lines drawing themselves
      tl.from("#line-lead-in", { strokeDashoffset: 100, strokeDasharray: "4,4", duration: 1 }, "-=0.5")
        .from("#line-lead-route", { strokeDashoffset: 100, strokeDasharray: "4,4", duration: 1 }, "-=0.8")
        .from("#line-lead-enrich", { strokeDashoffset: 100, strokeDasharray: "4,4", duration: 1 }, "-=0.8");

      // Animate cards staggering in
      tl.from(".hero-card-ingest", { opacity: 0, x: -30, y: -10, duration: 0.6, ease: "back.out(1.2)" }, "-=0.8")
        .from(".hero-card-route", { opacity: 0, x: 30, y: 10, duration: 0.6, ease: "back.out(1.2)" }, "-=0.6")
        .from(".hero-card-enrich", { opacity: 0, x: -30, y: 10, duration: 0.6, ease: "back.out(1.2)" }, "-=0.6");

      // Continuous micro-floating for cards
      gsap.to(".hero-card-ingest", {
        y: -6,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.2,
      });

      gsap.to(".hero-card-route", {
        y: 6,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.5,
      });

      gsap.to(".hero-card-enrich", {
        y: -4,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.8,
      });

      // Mouse interactive tilt for visual container
      const onMouseMove = (e: MouseEvent) => {
        const visual = containerRef.current?.querySelector(".hero-visual-container") as HTMLElement;
        if (!visual) return;
        const rect = visual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Container rotation
        gsap.to(visual, {
          rotationY: x * 15,
          rotationX: -y * 15,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        const visual = containerRef.current?.querySelector(".hero-visual-container") as HTMLElement;
        if (!visual) return;

        // Reset container rotation
        gsap.to(visual, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      // 3. Scroll animation to move character down behind live pipeline cards
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.to(".hero-character", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
          y: "115vh",
          x: "-25vw",
          scale: 2.2,
          opacity: 0.35,
          filter: "blur(35px)",
          ease: "none",
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.to(".hero-character", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
          y: "110vh",
          x: 0,
          scale: 1.8,
          opacity: 0.3,
          filter: "blur(25px)",
          ease: "none",
        });
      });

      const visualArea = containerRef.current?.querySelector(".hero-visual-container") as HTMLElement;
      if (visualArea) {
        visualArea.addEventListener("mousemove", onMouseMove);
        visualArea.addEventListener("mouseleave", onMouseLeave);
      }

      return () => {
        if (visualArea) {
          visualArea.removeEventListener("mousemove", onMouseMove);
          visualArea.removeEventListener("mouseleave", onMouseLeave);
        }
      };
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} data-scroll-section className="relative z-10 min-h-[100dvh] overflow-visible bg-zinc-50/50 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] pt-28 pb-16 flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-glow-1 absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="hero-glow-2 absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-violet-200/15 blur-3xl" />
        <div className="hero-glow-3 absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Side: Content */}
          <div className="text-left lg:col-span-6 flex flex-col items-start justify-center">
            <div className="hero-fade inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Introducing Cyberleads CRM</span>
            </div>

            <h1 className="hero-title mt-6 text-4xl font-extrabold leading-[1.1] tracking-tighter text-zinc-950 md:text-6xl lg:text-7xl">
              Scale your pipeline <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                on autopilot.
              </span>
            </h1>

            <p className="hero-subtitle mt-6 max-w-[48ch] text-base leading-relaxed text-zinc-600 md:text-lg">
              Stop chasing leads manually. Let Cyberleads ingest, enrich, and route prospects instantly. Build a beautiful, self-driving revenue workflow in minutes.
            </p>

            <div className="hero-ctas mt-8 flex flex-wrap items-center gap-4">
              <button data-cursor="link" className="group flex items-center gap-2 rounded-full bg-zinc-900 px-7 py-4 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 transition-all duration-200">
                Get started free
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button data-cursor="view" className="flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-zinc-700 hover:text-zinc-950 transition-colors duration-200">
                Watch demo
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="hero-proof mt-12 flex items-center gap-3 border-t border-slate-200/60 pt-6 w-full">
              <div className="flex -space-x-2">
                {[
                  { name: "PN", bg: "bg-emerald-100 text-emerald-800" },
                  { name: "MW", bg: "bg-violet-100 text-violet-800" },
                  { name: "LO", bg: "bg-blue-100 text-blue-800" },
                ].map((item, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm ${item.bg}`}>
                    {item.name}
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                Trusted by <span className="text-zinc-950 font-semibold">1,200+</span> modern revenue teams
              </p>
            </div>
          </div>

          {/* Right Side: Graphic Visualizer */}
          <div className="lg:col-span-6 flex justify-center items-center relative" style={{ perspective: 1000 }}>
            <div className="hero-visual-container relative flex items-center justify-center h-[460px] w-full max-w-[500px]">
              {/* Concentric subtle circles background */}
              <div className="absolute w-[380px] h-[380px] rounded-full border border-zinc-200/40 bg-zinc-100/10 pointer-events-none" />
              <div className="absolute w-[260px] h-[260px] rounded-full border border-zinc-200/50 bg-zinc-100/15 pointer-events-none" />

              {/* SVG Connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 460">
                <path
                  id="line-lead-in"
                  d="M 120 100 Q 180 140 250 200"
                  fill="none"
                  stroke="url(#line-grad-cyan)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <path
                  id="line-lead-route"
                  d="M 250 260 Q 320 320 380 360"
                  fill="none"
                  stroke="url(#line-grad-violet)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <path
                  id="line-lead-enrich"
                  d="M 110 360 Q 180 300 250 260"
                  fill="none"
                  stroke="url(#line-grad-blue)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />

                <defs>
                  <linearGradient id="line-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="line-grad-violet" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="line-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central Character - AuroraHead Component */}
              <div className="hero-character-wrap absolute z-10 pointer-events-none select-none">
                <div className="hero-character relative">
                  <AuroraHead />
                </div>
              </div>

              {/* Floating Lead Card 1: Ingestion (Top-Left) */}
              <div className="hero-card-ingest absolute top-12 left-4 z-20 flex items-center gap-3 rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-3.5 shadow-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-inner">
                  <Sparkle size={15} weight="bold" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">LEAD INGESTED</p>
                  <p className="text-xs font-bold text-zinc-800">+$14,200 Acme Corp</p>
                </div>
              </div>

              {/* Floating Lead Card 2: Routing (Bottom-Right) */}
              <div className="hero-card-route absolute bottom-12 right-4 z-20 flex items-center gap-3 rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-3.5 shadow-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 shadow-inner">
                  <Users size={15} weight="bold" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">AUTO-ROUTED</p>
                  <p className="text-xs font-bold text-zinc-800">Enterprise CRM → Priya N.</p>
                </div>
              </div>

              {/* Floating Lead Card 3: Enrichment (Bottom-Left) */}
              <div className="hero-card-enrich absolute bottom-12 left-2 z-20 flex items-center gap-3 rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-md p-3.5 shadow-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-inner">
                  <Lightning size={15} weight="bold" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">DATA ENRICHED</p>
                  <p className="text-xs font-bold text-zinc-800">Social Profiles Enrich</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-glow-pulse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -15px) scale(1.1); }
        }
        .hero-glow-1 { animation: hero-glow-pulse 10s ease-in-out infinite; }
        .hero-glow-2 { animation: hero-glow-pulse 14s ease-in-out infinite 2s; }
        .hero-glow-3 { animation: hero-glow-pulse 12s ease-in-out infinite 1s; }
      `}</style>
    </section>
  );
}

/* =========================================================================
   SECTION 3 — LOGO MARQUEE
   ========================================================================= */
function LogoMarquee() {
  const logos = ["Northwind", "Vortex Labs", "Cobalt", "Fenwick & Co", "Brightline", "Hadron"];
  return (
    <section data-scroll-section className="relative z-20 border-y border-slate-200/60 bg-transparent py-10">
      <div className="overflow-hidden">
        <div className="flex w-max animate-[marquee_22s_linear_infinite] gap-16 px-8">
          {[...logos, ...logos].map((logo, i) => (
            <span key={i} className="shrink-0 text-lg font-medium tracking-tight text-zinc-300">
              {logo}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

/* =========================================================================
   SECTION 4 — LIVE CRM DEMO
   ========================================================================= */
function CrmDemoSection() {
  return (
    <section data-scroll-section className="relative z-20 bg-transparent py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="reveal max-w-[56ch] text-left">
          <span className="text-xs font-medium tracking-wide text-emerald-600">LIVE DEMO</span>
          <h2 className="mt-3 text-3xl font-medium tracking-tighter text-zinc-900 md:text-5xl">
            Watch the CRM work while you read this
          </h2>
          <p className="mt-4 text-base text-zinc-650">
            Deals move, activity streams in, nothing is staged — this is the
            same engine your team would actually use.
          </p>
        </div>
        <div className="reveal mt-12">
          <CrmDemo />
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 5 — BENTO FEATURE GRID (hover cards)
   ========================================================================= */
const features = [
  { icon: Users, title: "Smart lead routing", desc: "Auto-assigned by territory, load, or skill the moment a lead lands." },
  { icon: Lightning, title: "No-code automation", desc: "Describe the workflow in plain English — Orbiq builds the rest." },
  { icon: ChartLineUp, title: "Live revenue dashboards", desc: "Bottlenecks surface before they cost you a deal." },
  { icon: Gear, title: "Custom pipelines", desc: "Model your actual sales process, not ours." },
  { icon: Bell, title: "Smart reminders", desc: "Never let a hot lead go cold from inbox overload." },
  { icon: CheckCircle, title: "Audit-ready history", desc: "Every automation, fully traceable, always." },
];

function FeatureGrid() {
  return (
    <section data-scroll-section className="relative z-20 bg-transparent py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="reveal max-w-[52ch] text-left">
          <span className="text-xs font-medium tracking-wide text-emerald-600">PLATFORM</span>
          <h2 className="mt-3 text-3xl font-medium tracking-tighter text-zinc-900 md:text-5xl">
            Everything a revenue team needs
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <HoverCard key={title} className="reveal p-8 text-left">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon size={20} weight="bold" />
              </div>
              <h3 className="mt-6 text-base font-medium text-zinc-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{desc}</p>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 6 — PINNED 3D WORKFLOW SCROLLER (pure GSAP ScrollTrigger pin)
   ========================================================================= */
function WorkflowScroller() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  stepsRef.current = [];

  const steps = [
    { title: "Capture every lead", copy: "Forms, chat, ads, and inbound email funnel into one pipeline." },
    { title: "Route automatically", copy: "Rules assign leads instantly, with full audit history." },
    { title: "Automate follow-up", copy: "Reminders and sequences fire on their own." },
    { title: "Report in real time", copy: "Dashboards update the moment a deal moves." },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const panels = stepsRef.current.filter(Boolean) as HTMLDivElement[];
      if (panels.length === 0) return;

      gsap.set(panels, { opacity: 0, y: 24 });
      gsap.set(panels[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${panels.length * 100}%`,
          scrub: 1,
          pin: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i > 0) {
          tl.to(panels[i - 1], { opacity: 0, y: -24, duration: 0.3 }, i)
            .to(panel, { opacity: 1, y: 0, duration: 0.3 }, i);
        }
        if (panelRef.current) {
          tl.to(panelRef.current, { rotateY: -15 + i * 12, rotateX: 8 - i * 4, duration: 0.6 }, i);
        }
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-scroll-section className="relative bg-zinc-950">
      <div className="flex min-h-[100dvh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-2 md:px-10">
          <div className="relative h-[260px] md:h-[320px]">
            {steps.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => { if (el) stepsRef.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center gap-5 text-left"
              >
                <h3 className="text-3xl font-medium tracking-tight text-white md:text-4xl">{step.title}</h3>
                <p className="max-w-[40ch] text-base leading-relaxed text-zinc-400">{step.copy}</p>
                <span className="text-xs font-medium tracking-wide text-zinc-600">
                  {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="flex h-[260px] items-center justify-center md:h-[320px]" style={{ perspective: 1200 }}>
            <div
              ref={panelRef}
              className="relative h-[260px] w-[260px] rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] md:h-[320px] md:w-[320px]"
            >
              <div className="absolute inset-4 rounded-[1.5rem] border border-white/10 bg-zinc-950/60 p-5 text-left">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <div className="mt-6 space-y-2.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-2.5 animate-pulse rounded-full bg-white/10" style={{ width: `${85 - i * 18}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 7 — TESTIMONIALS (hover cards)
   ========================================================================= */
const testimonials = [
  { quote: "We cut lead response time from hours to minutes.", name: "Priya Nair", role: "VP Sales, Vortex Labs" },
  { quote: "The automation builder replaced three internal tools.", name: "Marcus Webb", role: "Ops Lead, Northwind" },
  { quote: "Our team finally trusts the pipeline numbers.", name: "Lina Ortega", role: "RevOps, Fenwick & Co" },
];

function Testimonials() {
  return (
    <section data-scroll-section className="relative z-20 bg-transparent py-28">
      asa      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="reveal max-w-[52ch] text-left">
          <span className="text-xs font-medium tracking-wide text-emerald-600">CUSTOMERS</span>
          <h2 className="mt-3 text-3xl font-medium tracking-tighter text-zinc-900 md:text-5xl">
            Trusted by teams who hate busywork
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <HoverCard key={t.name} className="reveal p-8 text-left">
              <p className="text-base leading-relaxed text-zinc-700">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-zinc-900" />
                <div>
                  <p className="text-sm font-medium text-zinc-900">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 8 — CTA + FOOTER
   ========================================================================= */
function CTA() {
  return (
    <section data-scroll-section className="bg-zinc-950 py-28">
      <div className="reveal mx-auto max-w-[1400px] px-6 text-center md:px-10">
        <h2 className="mx-auto max-w-[20ch] text-3xl font-medium tracking-tighter text-white md:text-5xl">
          Put your pipeline on autopilot
        </h2>
        <p className="mx-auto mt-5 max-w-[50ch] text-base text-zinc-400">
          Free for teams up to 5. No credit card. Set up your first automation in under ten minutes.
        </p>
        <div className="mt-9 flex justify-center gap-4">
          <button data-cursor="link" className="flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-medium text-zinc-950">
            Start free
            <ArrowRight size={16} />
          </button>
          <button data-cursor="link" className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white hover:bg-white/5">
            Talk to sales
          </button>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-white/10 px-6 pt-8 text-xs text-zinc-500 md:flex-row md:px-10">
        <span>© {new Date().getFullYear()} Orbiq, Inc.</span>
        <div className="flex gap-6">
          <a data-cursor="link" href="#" className="hover:text-zinc-300">Privacy</a>
          <a data-cursor="link" href="#" className="hover:text-zinc-300">Terms</a>
          <a data-cursor="link" href="#" className="hover:text-zinc-300">Status</a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollReady, setScrollReady] = useState(false);

  useSmoothScroll(containerRef, () => setScrollReady(true));
  useReveal(".reveal", containerRef, scrollReady);

  return (
    <>
      <TubesCursor />
      <Nav />
      <div data-scroll-container ref={containerRef} className="bg-[#fafafa] font-sans antialiased overflow-x-hidden">
        <Hero />
        <LogoMarquee />
        <CrmDemoSection />
        <FeatureGrid />
        {scrollReady && <WorkflowScroller />}
        <Testimonials />
        <CTA />
      </div>
    </>
  );
}
