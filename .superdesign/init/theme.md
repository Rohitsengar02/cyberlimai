# Design System / Theme Tokens

The project uses Tailwind CSS (v4) with CSS variables and custom classes defined in `globals.css`.

## CSS Variables & Theme Configuration
```css
@import "tailwindcss";

:root {
  --background: #f0f4ff;
  --foreground: #0f172a;
  --card: rgba(255, 255, 255, 0.97);
  --border: rgba(203, 213, 225, 0.7);
  --primary: 37 99 235;
  --secondary: 29 78 216;
  --accent: 96 165 250;
  --glow: rgba(37, 99, 235, 0.18);
}

.dark {
  --background: #050913;
  --foreground: #f1f5f9;
  --card: rgba(10, 17, 36, 0.95);
  --border: rgba(30, 41, 59, 0.7);
}

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card-bg: var(--card);
  --color-border-custom: var(--border);
  --color-primary-custom: rgb(var(--primary));
  --color-secondary-custom: rgb(var(--secondary));
  --color-accent-custom: rgb(var(--accent));
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  overflow-x: hidden;
  position: relative;
}
```

## Custom Theme Classes & Animations
```css
/* ─── BACKGROUND BLOBS ────────────────────── */
.bg-blob-container {
  position: fixed;
  inset: 0;
  z-index: -10;
  overflow: hidden;
  pointer-events: none;
}

.blob-1 {
  position: absolute;
  top: -15%;
  left: -10%;
  width: 55vw;
  height: 55vh;
  background: radial-gradient(ellipse at center, rgba(99,102,241,0.10) 0%, rgba(37,99,235,0.05) 50%, transparent 75%);
  filter: blur(80px);
  animation: blob-drift-1 18s ease-in-out infinite alternate;
}

.blob-2 {
  position: absolute;
  top: -5%;
  right: -15%;
  width: 50vw;
  height: 50vh;
  background: radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, rgba(96,165,250,0.06) 50%, transparent 75%);
  filter: blur(100px);
  animation: blob-drift-2 22s ease-in-out infinite alternate;
}

.blob-3 {
  position: absolute;
  bottom: -10%;
  right: -5%;
  width: 50vw;
  height: 55vh;
  background: radial-gradient(ellipse at center, rgba(6,182,212,0.07) 0%, rgba(37,99,235,0.05) 50%, transparent 75%);
  filter: blur(120px);
  animation: blob-drift-3 26s ease-in-out infinite alternate;
}

@keyframes blob-drift-1 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(4%, 6%) scale(1.08); }
}
@keyframes blob-drift-2 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-5%, 8%) scale(1.05); }
}
@keyframes blob-drift-3 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-4%, -6%) scale(1.1); }
}

/* ─── NOISE OVERLAY ───────────────────────── */
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: -9;
  opacity: 0.018;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ─── GLASS CARD ──────────────────────────── */
.glass-card {
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 24px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04);
  transition: transform 0.24s cubic-bezier(0.16,1,0.3,1), box-shadow 0.24s ease, border-color 0.24s ease;
}
.dark .glass-card {
  background: rgba(10,17,36,0.82);
  border-color: rgba(99,102,241,0.12);
}
.glass-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(37,99,235,0.10), 0 4px 12px rgba(15,23,42,0.06);
  border-color: rgba(99,102,241,0.25);
}

/* ─── GRADIENT CARDS ──────────────────────── */
.grad-orange  { background: linear-gradient(135deg, #f97316 0%, #fb923c 40%, #fbbf24 100%); }
.grad-blue    { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%); }
.grad-violet  { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%); }
.grad-teal    { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%); }
.grad-rose    { background: linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%); }
.grad-indigo  { background: linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #818cf8 100%); }
.grad-emerald { background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); }
.grad-cyan    { background: linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%); }
.grad-navy    { background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%); }
.grad-hero    { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e3a8a 60%, #0f172a 100%); }
.grad-leads-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #2563eb 70%, #1d4ed8 100%); }

/* ─── ANIMATIONS ──────────────────────────── */
@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-12px) rotate(1deg); }
}
@keyframes float-med {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
@keyframes mapPinPulse {
  0%   { transform: scale(1); opacity: 1; }
  50%  { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(37,99,235,0.25); }
  50%       { box-shadow: 0 0 28px rgba(37,99,235,0.55); }
}
@keyframes status-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
  50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
}

.animate-float-slow     { animation: float-slow 6s ease-in-out infinite; }
.animate-float-med      { animation: float-med 4s ease-in-out infinite; }
.animate-pin-pulse      { animation: mapPinPulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite; }
.animate-gradient-shift { animation: gradient-shift 4s ease infinite; background-size: 200% 200%; }
.animate-glow-pulse     { animation: glow-pulse 2.5s ease-in-out infinite; }
.animate-status-ring    { animation: status-ring 2s infinite; }
.animate-spin-slow      { animation: spin-slow 12s linear infinite; }
.animate-bounce-dot     { animation: bounce-dot 1.4s ease-in-out infinite; }

.card-lift {
  transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease;
}
.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(37,99,235,0.14);
}

/* ─── GRADIENT TEXT ───────────────────────── */
.gradient-text {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gradient-text-warm {
  background: linear-gradient(135deg, #f97316, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── SPECIAL UI ELEMENTS ─────────────────── */
.kanban-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(203,213,225,0.6);
  transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
}
.dark .kanban-card {
  background: rgba(15,23,42,0.8);
  border-color: rgba(51,65,85,0.5);
}
.kanban-card:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 8px 24px rgba(37,99,235,0.12);
  border-color: rgba(99,102,241,0.3);
}

.lead-row:hover { background: linear-gradient(90deg, rgba(239,246,255,0.8) 0%, rgba(224,242,254,0.6) 100%); }
.dark .lead-row:hover { background: linear-gradient(90deg, rgba(30,58,138,0.2) 0%, rgba(29,78,216,0.15) 100%); }

.score-ring {
  background: conic-gradient(#2563eb calc(var(--pct) * 3.6deg), #e2e8f0 0deg);
}

.font-serif-playfair {
  font-family: var(--font-playfair), serif;
}
```
