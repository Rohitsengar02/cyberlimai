"use client";

import { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
} from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================================
   CUSTOM CURSOR — single global instance, spring-lagged via GSAP quickTo
   ========================================================================= */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [variant, setVariant] = useState("default"); // default | link | view

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    function onMove(e) {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    }
    function onOver(e) {
      const target = e.target.closest("[data-cursor]");
      setVariant(target ? target.getAttribute("data-cursor") : "default");
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  const ringScale = { default: 1, link: 1.8, view: 2.6 }[variant] || 1;
  const ringLabel = { view: "View" }[variant];

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden md:block">
      <div ref={dotRef} className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900" />
      <div
        ref={ringRef}
        style={{ transform: `scale(${ringScale})` }}
        className="fixed left-0 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-900/30 mix-blend-difference transition-transform duration-300 ease-out"
      >
        {ringLabel && (
          <span className="text-[8px] font-medium tracking-wide text-white" style={{ transform: `scale(${1 / ringScale})` }}>
            {ringLabel}
          </span>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   LOCOMOTIVE SCROLL + SCROLLTRIGGER BRIDGE
   ========================================================================= */
function useSmoothScroll(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scroll = new LocomotiveScroll({
      el: containerRef.current,
      smooth: !reduceMotion,
      lerp: 0.09,
      multiplier: 0.9,
    });

    scroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(containerRef.current, {
      scrollTop(value) {
        return arguments.length
          ? scroll.scrollTo(value, { duration: 0, disableLerp: true })
          : scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: containerRef.current.style.transform ? "transform" : "fixed",
    });

    const refresh = () => scroll.update();
    ScrollTrigger.addEventListener("refresh", refresh);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(id);
      ScrollTrigger.removeEventListener("refresh", refresh);
      scroll.destroy();
    };
  }, [containerRef]);
}

/* =========================================================================
   GSAP REVEAL HOOK — fade/translate batch on scroll
   ========================================================================= */
function useReveal(selector, scope) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(selector);
      items.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.8,
          ease: "power3.out",
          delay: (i % 3) * 0.06,
          scrollTrigger: {
            trigger: el,
            scroller: "[data-scroll-container]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, [selector, scope]);
}

/* =========================================================================
   HOVER CARD — tilt + spotlight, GSAP quickTo
   ========================================================================= */
function HoverCard({ className = "", children, cursor = "view" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rotX = gsap.quickTo(el, "rotateX", { duration: 0.4, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotateY", { duration: 0.4, ease: "power3.out" });
    const spotX = gsap.quickTo(el, "--mx", { duration: 0.3, ease: "power3.out" });
    const spotY = gsap.quickTo(el, "--my", { duration: 0.3, ease: "power3.out" });

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rotY(-(px - 0.5) * 8);
      rotX((py - 0.5) * 8);
      spotX(px * 100);
      spotY(py * 100);
    }
    function onLeave() {
      rotX(0);
      rotY(0);
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-cursor={cursor}
      style={{ transformPerspective: 900, "--mx": "50%", "--my": "50%" }}
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

const activityFeed = [
  { icon: EnvelopeSimple, text: "Email opened by Acme Corp" },
  { icon: PhoneCall, text: "Call logged with Northwind" },
  { icon: CheckCircle, text: "Vortex Labs moved to Negotiation" },
  { icon: Bell, text: "Reminder: follow up with Cobalt Inc" },
  { icon: Sparkle, text: "Automation: welcome sequence sent" },
];

const CrmDemo = memo(function CrmDemo() {
  const [deals, setDeals] = useState(initialDeals);
  const [feedIdx, setFeedIdx] = useState(0);
  const [pulseId, setPulseId] = useState(null);

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
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
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
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                pulseId === deal.id ? "border-emerald-300 bg-emerald-50/60" : "border-slate-100 bg-zinc-50/60"
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
        <p className="text-xs font-medium text-zinc-500">Activity stream</p>
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
            <a key={item} data-cursor="link" href="#" className="text-sm text-zinc-600 hover:text-zinc-900">
              {item}
            </a>
          ))}
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
  return (
    <section data-scroll-section className="relative min-h-[100dvh] overflow-hidden bg-zinc-50 pt-28">
      <div
        data-scroll
        data-scroll-speed="1.5"
        className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-emerald-200/30 blur-3xl"
      />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:px-10">
        <div data-scroll data-scroll-speed="0.6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
            <Sparkle size={12} weight="fill" className="text-emerald-500" />
            Realtime CRM, built in
          </span>
          <h1 className="mt-6 text-4xl font-medium leading-none tracking-tighter text-zinc-900 md:text-6xl">
            Leads, team, and ops —
            <br />
            running themselves.
          </h1>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-zinc-600 md:text-lg">
            Orbiq is the operating layer for revenue teams: a live pipeline,
            automated busywork, and a team that always knows what's next.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button data-cursor="link" className="group flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-medium text-white">
              Get started free
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button data-cursor="view" className="flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-zinc-700 hover:text-zinc-900">
              Watch demo
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div data-scroll data-scroll-speed="-0.6" className="relative">
          <HoverCard className="mx-auto aspect-[4/3] w-full max-w-[480px] p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)]">
            <p className="text-xs font-medium text-zinc-400">Pipeline overview</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">$103,500</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {["New", "Qualified", "Won"].map((label, i) => (
                <div key={label} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[11px] text-zinc-400">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">{[128, 64, 27][i]}</p>
                </div>
              ))}
            </div>
          </HoverCard>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse text-[11px] tracking-wide text-zinc-400">
        scroll
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 3 — LOGO MARQUEE
   ========================================================================= */
function LogoMarquee() {
  const logos = ["Northwind", "Vortex Labs", "Cobalt", "Fenwick & Co", "Brightline", "Hadron"];
  return (
    <section data-scroll-section className="border-y border-slate-200/60 bg-zinc-50 py-10">
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
    <section data-scroll-section className="bg-white py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="reveal max-w-[56ch]">
          <span className="text-xs font-medium tracking-wide text-emerald-600">LIVE DEMO</span>
          <h2 className="mt-3 text-3xl font-medium tracking-tighter text-zinc-900 md:text-5xl">
            Watch the CRM work while you read this
          </h2>
          <p className="mt-4 text-base text-zinc-600">
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
    <section data-scroll-section className="bg-zinc-50 py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="reveal max-w-[52ch]">
          <span className="text-xs font-medium tracking-wide text-emerald-600">PLATFORM</span>
          <h2 className="mt-3 text-3xl font-medium tracking-tighter text-zinc-900 md:text-5xl">
            Everything a revenue team needs
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <HoverCard key={title} className="reveal p-8">
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
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const stepsRef = useRef([]);
  stepsRef.current = [];

  const steps = [
    { title: "Capture every lead", copy: "Forms, chat, ads, and inbound email funnel into one pipeline." },
    { title: "Route automatically", copy: "Rules assign leads instantly, with full audit history." },
    { title: "Automate follow-up", copy: "Reminders and sequences fire on their own." },
    { title: "Report in real time", copy: "Dashboards update the moment a deal moves." },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = stepsRef.current;
      gsap.set(panels, { opacity: 0, y: 24 });
      gsap.set(panels[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: "[data-scroll-container]",
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
        tl.to(panelRef.current, { rotateY: -15 + i * 12, rotateX: 8 - i * 4, duration: 0.6 }, i);
      });
    }, sectionRef);
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
                ref={(el) => el && (stepsRef.current[i] = el)}
                className="absolute inset-0 flex flex-col justify-center gap-5"
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
              <div className="absolute inset-4 rounded-[1.5rem] border border-white/10 bg-zinc-950/60 p-5">
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
    <section data-scroll-section className="bg-white py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="reveal max-w-[52ch]">
          <span className="text-xs font-medium tracking-wide text-emerald-600">CUSTOMERS</span>
          <h2 className="mt-3 text-3xl font-medium tracking-tighter text-zinc-900 md:text-5xl">
            Trusted by teams who hate busywork
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <HoverCard key={t.name} className="reveal p-8">
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
  const containerRef = useRef(null);
  useSmoothScroll(containerRef);
  useReveal(".reveal", containerRef);

  return (
    <>
      <CustomCursor />
      <Nav />
      <div data-scroll-container ref={containerRef} className="cursor-none bg-white font-sans antialiased">
        <Hero />
        <LogoMarquee />
        <CrmDemoSection />
        <FeatureGrid />
        <WorkflowScroller />
        <Testimonials />
        <CTA />
      </div>
    </>
  );
}
