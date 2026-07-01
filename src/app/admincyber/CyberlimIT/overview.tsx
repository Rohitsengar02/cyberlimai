"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Export, Kanban, Money, Tray, UsersThree, Globe, DeviceMobile, Robot,
    Database, Rocket, FlagBanner, ChartLineUp, CalendarCheck, Receipt,
    Megaphone, ChartBar, ShieldCheck, CloudCheck, GitBranch, Headset,
    BookOpen, Scales, UserFocus, Flame, Clock
} from "@phosphor-icons/react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Renderer, Program, Triangle, Mesh } from "ogl";
import { motion } from "framer-motion";

// ── WebGL LIGHT RAYS BACKGROUND EFFECT ──
export type RaysOrigin =
    | 'top-center'
    | 'top-left'
    | 'top-right'
    | 'right'
    | 'left'
    | 'bottom-center'
    | 'bottom-right'
    | 'bottom-left';

interface LightRaysProps {
    raysOrigin?: RaysOrigin;
    raysColor?: string;
    raysSpeed?: number;
    lightSpread?: number;
    rayLength?: number;
    pulsating?: boolean;
    fadeDistance?: number;
    saturation?: number;
    followMouse?: boolean;
    mouseInfluence?: number;
    noiseAmount?: number;
    distortion?: number;
    className?: string;
}

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex: string): [number, number, number] => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (
    origin: RaysOrigin,
    w: number,
    h: number
): { anchor: [number, number]; dir: [number, number] } => {
    const outside = 0.2;
    switch (origin) {
        case 'top-left':
            return { anchor: [0, -outside * h], dir: [0.7, 0.7] };
        case 'top-right':
            return { anchor: [w, -outside * h], dir: [-0.7, 0.7] };
        case 'left':
            return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
        case 'right':
            return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
        case 'bottom-left':
            return { anchor: [0, (1 + outside) * h], dir: [0.7, -0.7] };
        case 'bottom-center':
            return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
        case 'bottom-right':
            return { anchor: [w, (1 + outside) * h], dir: [-0.7, -0.7] };
        default: // "top-center"
            return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
};

type Vec2 = [number, number];
type Vec3 = [number, number, number];

interface Uniforms {
    iTime: { value: number };
    iResolution: { value: Vec2 };
    rayPos: { value: Vec2 };
    rayDir: { value: Vec2 };
    raysColor: { value: Vec3 };
    raysSpeed: { value: number };
    lightSpread: { value: number };
    rayLength: { value: number };
    pulsating: { value: number };
    fadeDistance: { value: number };
    saturation: { value: number };
    mousePos: { value: Vec2 };
    mouseInfluence: { value: number };
    noiseAmount: { value: number };
    distortion: { value: number };
}

export function LightRays({
    raysOrigin = 'top-center',
    raysColor = DEFAULT_COLOR,
    raysSpeed = 1,
    lightSpread = 1,
    rayLength = 2,
    pulsating = false,
    fadeDistance = 1.0,
    saturation = 1.0,
    followMouse = true,
    mouseInfluence = 0.1,
    noiseAmount = 0.02,
    distortion = 0.05,
    className = ''
}: LightRaysProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const uniformsRef = useRef<Uniforms | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
    const animationIdRef = useRef<number | null>(null);
    const meshRef = useRef<Mesh | null>(null);
    const cleanupFunctionRef = useRef<(() => void) | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        observerRef.current = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        observerRef.current.observe(containerRef.current);
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible || !containerRef.current) return;
        if (cleanupFunctionRef.current) {
            cleanupFunctionRef.current();
            cleanupFunctionRef.current = null;
        }

        const initializeWebGL = async () => {
            if (!containerRef.current) return;
            await new Promise(resolve => setTimeout(resolve, 10));
            if (!containerRef.current) return;

            const renderer = new Renderer({
                dpr: Math.min(window.devicePixelRatio, 2),
                alpha: true
            });
            rendererRef.current = renderer;
            const gl = renderer.gl;

            gl.canvas.style.width = '100%';
            gl.canvas.style.height = '100%';
            gl.canvas.style.display = 'block';

            while (containerRef.current.firstChild) {
                containerRef.current.removeChild(containerRef.current.firstChild);
            }
            containerRef.current.appendChild(gl.canvas);

            const vert = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

            const frag = `
        precision highp float;
        uniform float iTime;
        uniform vec2  iResolution;
        uniform vec2  rayPos;
        uniform vec2  rayDir;
        uniform vec3  raysColor;
        uniform float raysSpeed;
        uniform float lightSpread;
        uniform float rayLength;
        uniform float pulsating;
        uniform float fadeDistance;
        uniform float saturation;
        uniform vec2  mousePos;
        uniform float mouseInfluence;
        uniform float noiseAmount;
        uniform float distortion;
        varying vec2 vUv;

        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                          float seedA, float seedB, float speed) {
          vec2 sourceToCoord = coord - raySource;
          vec2 dirNorm = normalize(sourceToCoord);
          float cosAngle = dot(dirNorm, rayRefDirection);
          
          float d = distortion * sin(iTime * 1.5 + length(sourceToCoord) * 0.005);
          float distortedAngle = cosAngle + d;
          
          float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
          float distance = length(sourceToCoord);
          float maxDistance = max(iResolution.x, iResolution.y) * rayLength;
          float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
          
          float fadeFactor = fadeDistance * max(iResolution.x, iResolution.y);
          float fadeFalloff = clamp((fadeFactor - distance) / fadeFactor, 0.0, 1.0);
          
          float pulse = pulsating > 0.5 ? (0.85 + 0.15 * sin(iTime * speed * 4.0)) : 1.0;
          
          float baseStrength = clamp(
            (0.5 + 0.2 * sin(distortedAngle * seedA + iTime * speed)) +
            (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed * 0.8)),
            0.0, 1.0
          );
          
          return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
        }

        void main() {
          vec2 fragCoord = gl_FragCoord.xy;
          vec2 coord = vec2(fragCoord.x, fragCoord.y);
          
          vec2 finalRayDir = normalize(rayDir);
          if (mouseInfluence > 0.0) {
            vec2 mouseScreenPos = mousePos * iResolution.xy;
            vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
            finalRayDir = normalize(mix(finalRayDir, mouseDirection, mouseInfluence));
          }

          float r1 = rayStrength(rayPos, finalRayDir, coord, 45.2, 31.4, 0.8 * raysSpeed);
          float r2 = rayStrength(rayPos, finalRayDir, coord, 28.5, 19.8, 1.2 * raysSpeed);
          float r3 = rayStrength(rayPos, finalRayDir, coord, 12.1, 56.2, 0.5 * raysSpeed);
          
          float combined = (r1 * 0.4 + r2 * 0.4 + r3 * 0.2);
          combined = pow(combined, 0.7);
          combined *= 1.5;
          vec3 finalColor = raysColor * combined;
          
          if (noiseAmount > 0.0) {
            float n = noise(coord * 0.01 + iTime * 0.05);
            finalColor *= (1.0 - noiseAmount + noiseAmount * n);
          }

          if (saturation != 1.0) {
            float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
            finalColor = mix(vec3(gray), finalColor, saturation);
          }

          gl_FragColor = vec4(finalColor, combined);
        }
      `;

            const uniforms: Uniforms = {
                iTime: { value: 0 },
                iResolution: { value: [1, 1] },
                rayPos: { value: [0, 0] },
                rayDir: { value: [0, 1] },
                raysColor: { value: hexToRgb(raysColor) },
                raysSpeed: { value: raysSpeed },
                lightSpread: { value: lightSpread },
                rayLength: { value: rayLength },
                pulsating: { value: pulsating ? 1.0 : 0.0 },
                fadeDistance: { value: fadeDistance },
                saturation: { value: saturation },
                mousePos: { value: [0.5, 0.5] },
                mouseInfluence: { value: mouseInfluence },
                noiseAmount: { value: noiseAmount },
                distortion: { value: distortion }
            };
            uniformsRef.current = uniforms;

            const geometry = new Triangle(gl);
            const program = new Program(gl, {
                vertex: vert,
                fragment: frag,
                uniforms,
                transparent: true
            });
            const mesh = new Mesh(gl, { geometry, program });
            meshRef.current = mesh;

            const updatePlacement = () => {
                if (!containerRef.current || !renderer) return;
                const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
                renderer.setSize(wCSS, hCSS);
                const dpr = renderer.dpr;
                const w = wCSS * dpr;
                const h = hCSS * dpr;

                uniforms.iResolution.value = [w, h];
                const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
                uniforms.rayPos.value = anchor;
                uniforms.rayDir.value = dir;
            };

            const loop = (t: number) => {
                if (!rendererRef.current || !uniformsRef.current || !meshRef.current) return;

                uniforms.iTime.value = t * 0.001;

                if (followMouse && mouseInfluence > 0.0) {
                    const smoothing = 0.95;
                    smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
                    smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);
                    uniforms.mousePos.value = [smoothMouseRef.current.x, 1.0 - smoothMouseRef.current.y];
                }

                renderer.render({ scene: mesh });
                animationIdRef.current = requestAnimationFrame(loop);
            };

            window.addEventListener('resize', updatePlacement);
            updatePlacement();
            animationIdRef.current = requestAnimationFrame(loop);

            cleanupFunctionRef.current = () => {
                if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
                window.removeEventListener('resize', updatePlacement);
                if (renderer.gl.canvas.parentNode) {
                    renderer.gl.canvas.parentNode.removeChild(renderer.gl.canvas);
                }
            };
        };

        initializeWebGL();
        return () => cleanupFunctionRef.current?.();
    }, [isVisible, raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, followMouse, mouseInfluence, noiseAmount, distortion]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouseRef.current = {
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height
            };
        };

        if (followMouse) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [followMouse]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
        />
    );
}

// Local card component with optional solid purple gradient styling
function LocalCard({
    children,
    className = "",
    theme,
    solidPurple = false
}: {
    children: React.ReactNode;
    className?: string;
    theme: "dark" | "light";
    solidPurple?: boolean;
}) {
    return (
        <div
            className={`rounded-[24px] p-6 transition-all duration-500 hover:translate-y-[-2px] ${solidPurple
                    ? "bg-gradient-to-br from-[#7c5df2] via-[#6d4fd6] to-[#5132c2] text-white shadow-[0_12px_30px_rgba(109,92,240,0.35)]"
                    : theme === "dark"
                        ? "bg-[#161426] shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
                        : "bg-white shadow-[0_12px_36px_rgba(109,92,240,0.05)]"
                } ${className}`}
        >
            {children}
        </div>
    );
}

// ── TEAM MANAGEMENT WORKFLOW COMPONENT (Matching Reference Image, Horizontally Stretched with Bubble Flow) ──
function WorkflowDiagram({ theme }: { theme: "dark" | "light" }) {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    const leftNodes = [
        { id: "employee", label: "Employee", icon: "💻", value: "$180", cx: 60, cy: 50, dur: "2.8s" },
        { id: "client", label: "Client", icon: "👤", value: "$90", cx: 60, cy: 115, dur: "3.5s" },
        { id: "employer", label: "Employer", icon: "💼", value: "$250", cx: 60, cy: 185, dur: "2.2s" },
        { id: "groups", label: "Groups", icon: "👥", value: "$310", cx: 60, cy: 250, dur: "3.1s" }
    ];

    const rightNodes = [
        { id: "docs", label: "Docs", icon: "📄", value: "$180", cx: 590, cy: 50, color: "from-[#6366f1] to-[#4f46e5]", hex: "#6366f1", dur: "3s" },
        { id: "analytics", label: "Analytics", icon: "📊", value: "$90", cx: 590, cy: 115, color: "from-[#a3e635] to-[#84cc16]", hex: "#a3e635", dur: "2.5s" },
        { id: "payroll", label: "Payroll", icon: "💵", value: "$250", cx: 590, cy: 185, color: "from-[#f97316] to-[#ea580c]", hex: "#f97316", dur: "3.4s" },
        { id: "collaboration", label: "Collaboration", icon: "💬", value: "$310", cx: 590, cy: 250, color: "from-[#d946ef] to-[#c084fc]", hex: "#d946ef", dur: "2.7s" }
    ];

    const getPathLeft = (cy: number) => {
        return `M 100 ${cy} C 210 ${cy}, 200 150, 295 150`;
    };

    const getPathRight = (cy: number) => {
        return `M 355 150 C 440 150, 430 ${cy}, 550 ${cy}`;
    };

    return (
        <div className="rounded-[24px] bg-gradient-to-br from-[#0c0a1a] via-[#05040d] to-[#010103] text-white p-6 transition-all duration-500 hover:translate-y-[-2px] min-h-[320px] h-full flex flex-col justify-between border border-[#8b6cf6]/10 relative overflow-hidden animate-pulse-glow">
            <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 12px 30px rgba(109,92,240,0.08), 0 0 10px rgba(139,108,246,0.12);
          }
          50% {
            box-shadow: 0 16px 36px rgba(109,92,240,0.15), 0 0 20px rgba(139,108,246,0.28);
          }
        }
        .animate-pulse-glow {
          animation: pulseGlow 4s infinite ease-in-out;
        }
        .flow-dash {
          stroke-dasharray: 6, 6;
          animation: dash 8s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -120;
          }
        }
      `}</style>
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Team Workflow Routing</span>
                    <span className="text-[10px] text-[#8b6cf6] font-bold">Flow Animation</span>
                </div>

                <div className="relative w-full overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 650 300" className="w-full h-auto">
                        <defs>
                            <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a78bfa" />
                                <stop offset="100%" stopColor="#6d4fd6" />
                            </linearGradient>
                        </defs>

                        {/* Concentric rings at central hub */}
                        <circle cx="325" cy="150" r="70" fill="none" stroke="rgba(139,108,246,0.15)" strokeWidth="3" />
                        <circle cx="325" cy="150" r="50" fill="none" stroke="rgba(139,108,246,0.25)" strokeWidth="2" />

                        {/* ── LEFT PATHS & BUBBLES ── */}
                        {leftNodes.map(node => (
                            <g key={node.id}>
                                <path
                                    id={`left-path-${node.id}`}
                                    d={getPathLeft(node.cy)}
                                    fill="none"
                                    stroke={hoveredNode === node.id ? "#8b6cf6" : "rgba(255,255,255,0.08)"}
                                    strokeWidth={hoveredNode === node.id ? "3" : "1.5"}
                                    className="flow-dash transition-all duration-300"
                                />
                                <path
                                    d={getPathLeft(node.cy)}
                                    fill="none"
                                    stroke="#8b6cf6"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    opacity={hoveredNode === node.id ? "1" : "0.35"}
                                />
                                {/* Moving Bubble */}
                                <circle r="4" fill="#a78bfa" className="shadow-lg">
                                    <animateMotion dur={node.dur} repeatCount="indefinite" path={getPathLeft(node.cy)} />
                                </circle>
                            </g>
                        ))}

                        {/* ── RIGHT PATHS & BUBBLES ── */}
                        {rightNodes.map(node => (
                            <g key={node.id}>
                                <path
                                    id={`right-path-${node.id}`}
                                    d={getPathRight(node.cy)}
                                    fill="none"
                                    stroke={node.hex}
                                    strokeWidth={hoveredNode === node.id ? "3" : "2"}
                                    opacity={hoveredNode === node.id ? "1" : "0.7"}
                                    className="transition-all duration-300"
                                />
                                {/* Moving Bubble */}
                                <circle r="4.5" fill={node.hex}>
                                    <animateMotion dur={node.dur} repeatCount="indefinite" path={getPathRight(node.cy)} />
                                </circle>
                            </g>
                        ))}

                        {/* ── CENTRAL HUB NODE ── */}
                        <g onMouseEnter={() => setHoveredNode("hub")} onMouseLeave={() => setHoveredNode(null)}>
                            <circle cx="325" cy="150" r="30" fill="url(#purpleGlow)" className="transition-transform duration-300 hover:scale-110 shadow-lg cursor-pointer" />
                            <path d="M 313 150 L 337 150 M 320 142 L 320 158 M 330 142 L 330 158" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </g>

                        {/* ── LEFT INPUT NODES ── */}
                        {leftNodes.map(node => (
                            <g
                                key={node.id}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="cursor-pointer"
                            >
                                <rect x={node.cx - 20} y={node.cy - 20} width="40" height="40" rx="10" fill="#14112e" className="transition-all duration-300 hover:fill-[#8b6cf6]/20" />
                                <text x={node.cx} y={node.cy + 5} textAnchor="middle" fontSize="18">{node.icon}</text>
                                <text x={node.cx} y={node.cy - 24} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#a1a1aa">{node.label}</text>

                                <rect x={node.cx + 40} y={node.cy - 10} width="32" height="16" rx="4" fill="#0c0a1a" stroke="#8b6cf6" strokeWidth="1" />
                                <text x={node.cx + 56} y={node.cy + 1} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#8b6cf6">{node.value}</text>
                            </g>
                        ))}

                        {/* ── RIGHT DESTINATION NODES ── */}
                        {rightNodes.map(node => (
                            <g
                                key={node.id}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="cursor-pointer"
                            >
                                <rect x={node.cx - 20} y={node.cy - 20} width="40" height="40" rx="10" fill={node.hex} />
                                <text x={node.cx} y={node.cy + 5} textAnchor="middle" fontSize="18" fill="white">{node.icon}</text>
                                <text x={node.cx} y={node.cy - 24} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#a1a1aa">{node.label}</text>

                                <rect x={node.cx - 72} y={node.cy - 10} width="32" height="16" rx="4" fill={node.hex} />
                                <text x={node.cx - 56} y={node.cy + 1} textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">{node.value}</text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
}

interface Suggestion {
    title: string;
    desc: string;
    priority: "high" | "medium" | "opportunity" | "low";
    icon: any;
    action: string;
}

const SUGGESTIONS: Suggestion[] = [
    {
        title: "3 hot leads are going cold",
        desc: "Radiant Interiors, Kavya Boutique, and PulseFit haven't been contacted in 48+ hours.",
        priority: "high",
        icon: Flame,
        action: "Follow up now",
    },
    {
        title: "Meta Ads CPL rising on E-commerce",
        desc: "Cost per lead up 18% this week. Consider pausing the weakest ad set.",
        priority: "medium",
        icon: ChartLineUp,
        action: "Review campaign",
    },
    {
        title: "Orbiq usage spiking at Vertex Logistics",
        desc: "Daily active usage up 40%. Good moment to pitch the Pro plan upgrade.",
        priority: "opportunity",
        icon: Rocket,
        action: "Send upgrade offer",
    },
    {
        title: "2 invoices overdue by 3+ days",
        desc: "Northstar Clinic and Anaco Programming — a reminder email is queued.",
        priority: "low",
        icon: Clock,
        action: "Send reminder",
    },
];

const PRIORITY_STYLE: Record<Suggestion["priority"], { color: string; bg: string; label: string }> = {
    high: { color: "#e05050", bg: "rgba(224,80,80,0.12)", label: "High priority" },
    medium: { color: "#eab308", bg: "rgba(234,179,8,0.12)", label: "Medium" },
    opportunity: { color: "#22d3ee", bg: "rgba(34,211,238,0.12)", label: "Opportunity" },
    low: { color: "#a78bfa", bg: "rgba(139,108,246,0.14)", label: "Low priority" },
};

function PipelineCard({ theme }: { theme: "dark" | "light" }) {
    const [pipeline, setPipeline] = React.useState([
        { id: 1, name: "Radiant Rebuild", stage: "Proposal" },
        { id: 2, name: "Kavya Boutique Store", stage: "Qualified" },
    ]);

    const stages = ["New", "Qualified", "Proposal", "Meeting"];

    const updateStage = (leadId: number, currentStage: string) => {
        const currentIndex = stages.indexOf(currentStage);
        const nextIndex = (currentIndex + 1) % stages.length;
        setPipeline(prev =>
            prev.map(item => (item.id === leadId ? { ...item, stage: stages[nextIndex] } : item))
        );
    };

    return (
        <LocalCard theme={theme} className="flex flex-col justify-between h-full min-h-[220px]">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">2. Lead Pipeline</span>
                    <span className="text-[10px] text-purple-455 font-bold">Click to Advance</span>
                </div>
                <div className="space-y-4">
                    {pipeline.map(item => (
                        <div key={item.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-bold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>
                                    {item.name}
                                </span>
                                <span className="px-2 py-0.5 rounded-lg text-[9px] bg-purple-500/10 text-purple-400 font-black uppercase">
                                    {item.stage}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                                {stages.map((stg, i) => {
                                    const isActive = stages.indexOf(item.stage) >= i;
                                    return (
                                        <button
                                            key={stg}
                                            onClick={() => updateStage(item.id, item.stage)}
                                            className={`h-2.5 rounded-full cursor-pointer transition-all ${isActive
                                                    ? "bg-[#8b6cf6]"
                                                    : theme === "dark"
                                                        ? "bg-white/10"
                                                        : "bg-zinc-200"
                                                }`}
                                            title={`Advance stage from ${stg}`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </LocalCard>
    );
}

export default function OverviewComponent({ theme }: { theme: "dark" | "light" }) {

    const isLight = theme === "light";

    // Global chart animation options
    const animationOpts = {
        duration: 1500,
        easing: "easeInOutQuart" as const
    };

    // Sparkline/Microchart config
    const sparklineOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
    };

    // Weekly Overview dataset
    const weeklyOverviewData = {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [{
            label: "Tasks Done",
            data: [37, 57, 45, 75, 57, 40, 65],
            backgroundColor: [
                "rgba(139, 108, 246, 0.15)",
                "rgba(139, 108, 246, 0.15)",
                "rgba(139, 108, 246, 0.15)",
                "#8b6cf6",
                "rgba(139, 108, 246, 0.15)",
                "rgba(139, 108, 246, 0.15)",
                "rgba(139, 108, 246, 0.15)",
            ],
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 14,
        }]
    };

    const weeklyOverviewOpts: any = {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationOpts,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: theme === "dark" ? "#a78bfa" : "#6d4fd6", font: { size: 10, weight: "bold" } } },
            y: { grid: { color: theme === "dark" ? "rgba(139,108,246,0.06)" : "rgba(109,92,240,0.06)" }, ticks: { color: theme === "dark" ? "#a78bfa" : "#6d4fd6", font: { size: 10 } } }
        }
    };

    return (
        <div className="space-y-6">

            {/* Grid container mirroring the Materio structure */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ── AWARD CARD (Column span 4) ── */}
                <div className="lg:col-span-4">
                    <div className="rounded-[24px] bg-gradient-to-br from-[#6d4fd6] via-[#5b3bc4] to-[#4527a0] text-white p-6 relative h-full flex flex-col justify-between overflow-hidden group min-h-[190px] shadow-[0_18px_45px_rgba(109,92,240,0.35)] transition-all duration-500 hover:translate-y-[-2px]">
                        <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute bottom-[-20px] left-[-20px] w-20 h-20 bg-[#22d3ee]/20 rounded-full blur-xl pointer-events-none" />

                        <div className="space-y-3 z-10">
                            <h2 className="text-base font-black tracking-wide text-white">Congratulations Cyberlim IT! 🎉</h2>
                            <p className="text-xs text-[#d1c4e9] font-medium">Operational targets successfully cleared</p>
                        </div>
                        <div className="z-10">
                            <div className="text-4xl font-black text-white">₹9.6L</div>
                            <p className="text-xs text-[#b39ddb] mt-0.5 font-bold">114% of monthly target 🚀</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-[#6d4fd6] hover:bg-zinc-100 text-[11px] font-black uppercase rounded-xl transition-all cursor-pointer w-fit self-start shadow-lg z-10">
                            View Stats
                        </button>
                        <span className="absolute bottom-4 right-6 text-6xl opacity-80 group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none">🏆</span>
                    </div>
                </div>

                {/* ── TRANSACTIONS CARD (Column span 8) ── */}
                <div className="lg:col-span-8">
                    <LocalCard theme={theme} className="h-full flex flex-col justify-between min-h-[190px]">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className={`text-xs font-bold uppercase tracking-widest ${theme === "dark" ? "text-zinc-400" : "text-zinc-550"}`}>Transactions</h2>
                                <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-zinc-655"} mt-1`}>
                                    <span className="font-bold text-[#8b6cf6]">Total 48.5% Growth 😎</span> this month
                                </p>
                            </div>
                            <button className={`p-1.5 rounded-lg ${theme === "dark" ? "text-zinc-500 hover:bg-white/5 hover:text-white" : "text-zinc-400 hover:bg-black/5 hover:text-black"} transition-all cursor-pointer`}>
                                <Export size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { title: "Active Projects", stats: "14", color: "text-[#a78bfa] bg-[#8b6cf6]/10", icon: "📊" },
                                { title: "Monthly Revenue", stats: "₹9.6L", color: "text-emerald-400 bg-emerald-500/10", icon: "💰" },
                                { title: "Open Leads", stats: "87", color: "text-cyan-400 bg-cyan-500/10", icon: "👥" },
                                { title: "Team Utilization", stats: "87%", color: "text-amber-400 bg-amber-500/10", icon: "⚙️" }
                            ].map(item => (
                                <div key={item.title} className={`flex items-center gap-3 p-3 rounded-2xl ${theme === "dark" ? "bg-[#0f0f13]/40" : "bg-[#faf9ff]"} shadow-[0_4px_12px_rgba(109,92,240,0.03)] border-none transition-all duration-300`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${item.color} shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className={`text-[9px] uppercase font-bold tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-zinc-500"}`}>{item.title}</p>
                                        <p className={`text-base font-black ${theme === "dark" ? "text-white" : "text-zinc-955"}`}>{item.stats}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LocalCard>
                </div>

                {/* ── WEEKLY OVERVIEW (Column span 4) ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-xs font-bold uppercase tracking-widest ${theme === "dark" ? "text-zinc-400" : "text-zinc-550"}`}>Weekly Overview</h2>
                            <button className={`p-1.5 rounded-lg ${theme === "dark" ? "text-zinc-500 hover:bg-white/5" : "text-zinc-400 hover:bg-black/5"} transition-all`}>
                                <Export size={14} />
                            </button>
                        </div>
                        <div className="h-[200px] relative mb-4">
                            <Bar data={weeklyOverviewData} options={weeklyOverviewOpts} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>45%</div>
                            <p className={`text-[11px] ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"} font-medium`}>
                                Sales performance is 45% better compared to last month
                            </p>
                        </div>
                        <div className="pt-2">
                            <button className="w-full py-2.5 bg-[#8b6cf6] hover:bg-[#7c5df2] text-white text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer">
                                Details
                            </button>
                        </div>
                    </LocalCard>
                </div>

                {/* ── TOTAL EARNING (Column span 4) ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className={`text-xs font-bold uppercase tracking-widest ${theme === "dark" ? "text-zinc-400" : "text-zinc-550"}`}>Total Earning</h2>
                            <button className={`p-1.5 rounded-lg ${theme === "dark" ? "text-zinc-500 hover:bg-white/5" : "text-zinc-400 hover:bg-black/5"} transition-all`}>
                                <Export size={14} />
                            </button>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-black ${theme === "dark" ? "text-white" : "text-zinc-955"}`}>$24,895</span>
                                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-0.5">▲ 10%</span>
                            </div>
                            <p className={`text-[10px] ${theme === "dark" ? "text-zinc-555" : "text-zinc-400"} mt-0.5`}>Compared to $84,325 last year</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "Orbiq SaaS", sub: "Vuejs, React & HTML", amount: "$24,895.65", progress: 75, color: "bg-[#8b6cf6]", logo: "🚗" },
                                { title: "Cyberlim ERP", sub: "Sketch, Figma & XD", amount: "$8,650.20", progress: 50, color: "bg-[#a78bfa]", logo: "🏦" },
                                { title: "NeuroFitness App", sub: "HTML & Angular", amount: "$1,245.80", progress: 20, color: "bg-zinc-400", logo: "✈️" }
                            ].map(item => (
                                <div key={item.title} className={`flex items-center gap-3 p-3 rounded-2xl ${theme === "dark" ? "bg-[#0f0f13]/20" : "bg-[#faf9ff]"} shadow-[0_4px_12px_rgba(109,92,240,0.03)] transition-all`}>
                                    <div className="text-2xl shrink-0">{item.logo}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={`text-xs font-bold ${theme === "dark" ? "text-white" : "text-zinc-855"} truncate`}>{item.title}</span>
                                            <span className={`text-xs font-black ${theme === "dark" ? "text-white" : "text-zinc-955"}`}>{item.amount}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className={`text-[9px] ${theme === "dark" ? "text-zinc-550" : "text-zinc-450"} truncate`}>{item.sub}</span>
                                            <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden shrink-0">
                                                <div className={`h-full ${item.color}`} style={{ width: `${item.progress}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LocalCard>
                </div>

                {/* ── MINI STATS SUBGRID (Column span 4) ── */}
                <div className="lg:col-span-4">
                    <div className="grid grid-cols-2 gap-4 h-full">

                        {/* 1. Total Profit Mini Line */}
                        <LocalCard theme={theme} solidPurple={isLight} className="flex flex-col justify-between">
                            <div>
                                <p className={`text-[10px] uppercase font-black tracking-wider ${isLight ? "text-white/80" : "text-zinc-500"}`}>Profit Trend</p>
                                <div className={`text-2xl font-black mt-1 ${isLight ? "text-white" : "text-zinc-955"}`}>$86.4k</div>
                            </div>
                            <div className="h-[55px] my-1">
                                <Line
                                    data={{
                                        labels: ["", "", "", "", "", ""],
                                        datasets: [{ data: [0, 20, 5, 30, 15, 45], borderColor: isLight ? "#ffffff" : "#8b6cf6", borderWidth: 3, pointRadius: 0, fill: false }]
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false, animation: animationOpts, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
                                />
                            </div>
                        </LocalCard>

                        {/* 2. Total Profit Metric */}
                        <LocalCard theme={theme} solidPurple={isLight} className="flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="text-lg">💰</span>
                                <span className={`text-[10px] font-bold ${isLight ? "text-white" : "text-[#a78bfa]"}`}>42% ▲</span>
                            </div>
                            <div>
                                <div className={`text-2xl font-black ${isLight ? "text-white" : "text-zinc-955"}`}>$25.6k</div>
                                <p className={`text-[9px] uppercase font-bold mt-1 ${isLight ? "text-white/80" : "text-zinc-500"}`}>Weekly Profit</p>
                            </div>
                        </LocalCard>

                        {/* 3. New Projects Metric */}
                        <LocalCard theme={theme} solidPurple={isLight} className="flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="text-lg">📁</span>
                                <span className={`text-[10px] font-bold ${isLight ? "text-white" : "text-purple-455"}`}>18% ▼</span>
                            </div>
                            <div>
                                <div className={`text-2xl font-black ${isLight ? "text-white" : "text-zinc-955"}`}>862</div>
                                <p className={`text-[9px] uppercase font-bold mt-1 ${isLight ? "text-white/80" : "text-zinc-500"}`}>New Projects</p>
                            </div>
                        </LocalCard>

                        {/* 4. Sessions distributed Column */}
                        <LocalCard theme={theme} solidPurple={isLight} className="flex flex-col justify-between">
                            <div>
                                <p className={`text-[10px] uppercase font-black tracking-wider ${isLight ? "text-white/80" : "text-zinc-500"}`}>Sessions</p>
                                <div className={`text-2xl font-black mt-1 ${isLight ? "text-white" : "text-zinc-955"}`}>2,856</div>
                            </div>
                            <div className="h-[55px] my-1">
                                <Bar
                                    data={{
                                        labels: ["", "", "", "", ""],
                                        datasets: [{ data: [45, 85, 65, 50, 70], backgroundColor: isLight ? ["rgba(255,255,255,0.4)", "#ffffff", "rgba(255,255,255,0.4)", "#ffffff", "#ffffff"] : ["rgba(139,108,246,0.3)", "#8b6cf6", "rgba(139,108,246,0.3)", "#8b6cf6", "#8b6cf6"], borderRadius: 4 }]
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false, animation: animationOpts, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
                                />
                            </div>
                        </LocalCard>
                    </div>
                </div>

                {/* ── 1. LEADS INBOX ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme} className="flex flex-col justify-between h-full min-h-[220px]">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">1. Leads Inbox</span>
                                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase">Hot Leads</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: "Radiant Interiors", value: "₹4.5L", channel: "Meta Ads", icon: "🏢" },
                                    { name: "Kavya Boutique", value: "₹2.8L", channel: "Website", icon: "🛍️" },
                                    { name: "Northstar Clinic", value: "₹6.2L", channel: "Referral", icon: "🏥" }
                                ].map(lead => (
                                    <div key={lead.name} className={`flex items-center justify-between p-2.5 rounded-xl ${theme === "dark" ? "bg-white/5" : "bg-zinc-50"} transition-all`}>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-lg">{lead.icon}</span>
                                            <div>
                                                <p className={`text-xs font-bold ${theme === "dark" ? "text-white" : "text-zinc-855"}`}>{lead.name}</p>
                                                <p className="text-[9px] text-zinc-550">{lead.channel}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-purple-500">{lead.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </LocalCard>
                </div>

                {/* ── 2. LEAD PIPELINE ── */}
                <div className="lg:col-span-4">
                    <PipelineCard theme={theme} />
                </div>

                {/* ── 3. PROPOSALS & QUOTES ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme} className="flex flex-col justify-between h-full min-h-[220px]">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">3. Proposals & Quotes</span>
                                <span className="text-[10px] text-emerald-400 font-bold">₹12.5L Active</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { client: "Radiant Interiors", file: "Radiant_Quote_v2.pdf", size: "1.4 MB" },
                                    { client: "Kavya Boutique", file: "Kavya_Proposal.pdf", size: "890 KB" },
                                    { client: "Northstar Clinic", file: "Northstar_SLA.pdf", size: "2.1 MB" }
                                ].map(p => (
                                    <div key={p.file} className={`flex items-center justify-between p-2.5 rounded-xl ${theme === "dark" ? "bg-white/5" : "bg-zinc-50"} transition-all`}>
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="text-lg shrink-0">📄</span>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-bold ${theme === "dark" ? "text-white" : "text-zinc-855"} truncate`}>{p.client}</p>
                                                <p className="text-[9px] text-zinc-500 truncate">{p.file} ({p.size})</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => alert(`Initiating mock download for ${p.file}`)}
                                            className="p-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/25 rounded-lg text-[10px] font-bold uppercase transition-all shrink-0 cursor-pointer"
                                        >
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </LocalCard>
                </div>

                {/* ── 4. TEAM MANAGEMENT - ATTENDANCE & STATUS (Solid Purple Gradient, Column span 6) ── */}
                <div className="lg:col-span-6">
                    <div className="rounded-[24px] bg-gradient-to-br from-[#7c5df2] via-[#6d4fd6] to-[#5132c2] text-white p-6 transition-all duration-500 hover:translate-y-[-2px] shadow-[0_18px_45px_rgba(109,92,240,0.35)] min-h-[320px] h-full flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200">Team Attendance & Utilization</span>
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase text-white">100% Present</span>
                            </div>
                            <div className="space-y-3.5">
                                {[
                                    { name: "Engineering Crew", count: "8 Developers", status: "100% Active (2 Remote)" },
                                    { name: "Creative Design", count: "2 Designers", status: "100% Active (0 Remote)" },
                                    { name: "Management Ops", count: "4 PMs / Leads", status: "100% Active (1 Remote)" }
                                ].map(team => (
                                    <div key={team.name} className="flex items-center justify-between pb-2 border-b border-white/10">
                                        <div>
                                            <p className="text-xs font-bold text-white">{team.name}</p>
                                            <p className="text-[9px] text-purple-200 font-medium">{team.count}</p>
                                        </div>
                                        <span className="text-xs font-black text-white">{team.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-purple-100">
                            <span>Overall Utilization: 87%</span>
                            <span>14 Active Members</span>
                        </div>
                    </div>
                </div>

                {/* ── 5. TEAM WORKFLOW ROUTING DIAGRAM (Column span 6) ── */}
                <div className="lg:col-span-6">
                    <WorkflowDiagram theme={theme} />
                </div>

                {/* ── 6. AI CONTROL CENTER CONSOLE (Column span 12) ── */}
                <div className="lg:col-span-12">
                    <LocalCard theme={theme} className="overflow-hidden relative">
                        {/* The Cinematic LightRays background effect */}
                        <LightRays
                            raysOrigin="top-center"
                            raysColor={theme === "dark" ? "#8b6cf6" : "#7c5df2"}
                            raysSpeed={1.5}
                            lightSpread={1.2}
                            rayLength={1.8}
                            followMouse={true}
                            mouseInfluence={0.3}
                            noiseAmount={0.03}
                            distortion={0.08}
                            className="opacity-25"
                        />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-4 border-b border-zinc-200 dark:border-white/5 gap-4">
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">AI Operational Command Console</span>
                                    <h3 className={`text-base font-black ${theme === "dark" ? "text-white" : "text-zinc-855"} mt-0.5`}>Cyberlim-Pro Neural Routing Center</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex h-2.5 w-2.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold uppercase">7/8 Agents Active</span>
                                </div>
                            </div>

                            {/* ── THE 12 BEAUTIFUL DARK GRADIENT DASHBOARD CARDS WITH EMBEDDED CHARTS ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                                {/* 1. Neural Model */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#120a2c] via-[#1a0e3f] to-[#0d0722] border-[#8b6cf6]/30 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400">Neural Model</span>
                                        <span className="text-sm">🧠</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white mb-2">Llama-3-Cyber-8B</p>
                                        <div className="h-[40px] flex justify-center items-center">
                                            <div className="w-8 h-8">
                                                <Doughnut
                                                    data={{
                                                        datasets: [{
                                                            data: [100, 0],
                                                            backgroundColor: ["#8b6cf6", "rgba(255,255,255,0.05)"],
                                                            borderWidth: 0
                                                        }]
                                                    }}
                                                    options={sparklineOpts}
                                                />
                                            </div>
                                            <span className="text-[9px] text-[#8b6cf6] font-bold ml-2">Active</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Latency Avg */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#061e30] via-[#092c47] to-[#041421] border-[#22d3ee]/30 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400">Latency Avg</span>
                                        <span className="text-sm">⚡</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">38 ms</p>
                                        <div className="h-[40px] mt-1">
                                            <Line
                                                data={{
                                                    labels: ["", "", "", "", "", ""],
                                                    datasets: [{
                                                        data: [35, 42, 38, 36, 38, 38],
                                                        borderColor: "#22d3ee",
                                                        borderWidth: 2,
                                                        fill: false,
                                                        tension: 0.3,
                                                        pointRadius: 0
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Token Cache */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#042217] via-[#083a26] to-[#02140e] border-[#10b981]/30 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400">Token Cache</span>
                                        <span className="text-sm">💾</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">94.2% Hit Rate</p>
                                        <div className="h-[40px] flex justify-center items-center">
                                            <div className="w-8 h-8">
                                                <Doughnut
                                                    data={{
                                                        datasets: [{
                                                            data: [94.2, 5.8],
                                                            backgroundColor: ["#10b981", "rgba(255,255,255,0.05)"],
                                                            borderWidth: 0
                                                        }]
                                                    }}
                                                    options={sparklineOpts}
                                                />
                                            </div>
                                            <span className="text-[9px] text-[#10b981] font-bold ml-2">94% hit</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Daily Cost */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#241604] via-[#3a2508] to-[#160d02] border-[#f59e0b]/30 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400">Daily Cost</span>
                                        <span className="text-sm">💸</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">$4.12 USD</p>
                                        <div className="h-[40px] mt-1">
                                            <Bar
                                                data={{
                                                    labels: ["", "", "", ""],
                                                    datasets: [{
                                                        data: [3.2, 4.5, 3.8, 4.12],
                                                        backgroundColor: "#f59e0b",
                                                        borderRadius: 2
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 5. 3 Hot Leads going cold (Suggestion 1) */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#2a0813] via-[#470f20] to-[#19030b] border-red-500/30 shadow-md">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-red-500/12">
                                                <Flame size={13} weight="bold" className="text-[#e05050]" />
                                            </div>
                                            <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full text-[#e05050] bg-red-500/12">High</span>
                                        </div>
                                        <p className="text-[11px] font-black text-white">3 leads going cold</p>
                                        <div className="h-[30px] mt-1">
                                            <Line
                                                data={{
                                                    labels: ["", "", "", ""],
                                                    datasets: [{
                                                        data: [100, 80, 50, 20],
                                                        borderColor: "#e05050",
                                                        borderWidth: 2,
                                                        fill: false,
                                                        tension: 0.2,
                                                        pointRadius: 0
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => alert("Action: Follow up now")} className="w-full py-1 bg-[#e05050] hover:bg-[#b93c3c] text-white rounded-xl text-[9px] font-bold cursor-pointer border-none shadow-sm mt-1">
                                        Follow up now
                                    </button>
                                </div>

                                {/* 6. Meta Ads CPL (Suggestion 2) */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#2b1005] via-[#4a1c0b] to-[#1a0802] border-orange-500/30 shadow-md">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-orange-500/12">
                                                <ChartLineUp size={13} weight="bold" className="text-[#eab308]" />
                                            </div>
                                            <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full text-[#eab308] bg-orange-500/12">Medium</span>
                                        </div>
                                        <p className="text-[11px] font-black text-white">Ads CPL rising</p>
                                        <div className="h-[30px] mt-1">
                                            <Line
                                                data={{
                                                    labels: ["", "", "", ""],
                                                    datasets: [{
                                                        data: [10, 12, 15, 18],
                                                        borderColor: "#eab308",
                                                        borderWidth: 2,
                                                        fill: false,
                                                        pointRadius: 0
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => alert("Action: Review campaign")} className="w-full py-1 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[9px] font-bold cursor-pointer border-none mt-1">
                                        Review campaign
                                    </button>
                                </div>

                                {/* 7. Orbiq Spiking (Suggestion 3) */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#090b2c] via-[#12164a] to-[#05061b] border-cyan-500/30 shadow-md">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-cyan-500/12">
                                                <Rocket size={13} weight="bold" className="text-[#22d3ee]" />
                                            </div>
                                            <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full text-[#22d3ee] bg-cyan-500/12">Opportunity</span>
                                        </div>
                                        <p className="text-[11px] font-black text-white">Orbiq usage spiking</p>
                                        <div className="h-[30px] mt-1">
                                            <Line
                                                data={{
                                                    labels: ["", "", "", ""],
                                                    datasets: [{
                                                        data: [40, 45, 60, 95],
                                                        borderColor: "#22d3ee",
                                                        borderWidth: 2,
                                                        fill: true,
                                                        backgroundColor: "rgba(34,211,238,0.1)",
                                                        pointRadius: 0
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => alert("Action: Send upgrade offer")} className="w-full py-1 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[9px] font-bold cursor-pointer border-none mt-1">
                                        Send upgrade offer
                                    </button>
                                </div>

                                {/* 8. Overdue Invoices (Suggestion 4) */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#1c082d] via-[#31114d] to-[#10041b] border-purple-500/30 shadow-md">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-purple-500/12">
                                                <Clock size={13} weight="bold" className="text-[#a78bfa]" />
                                            </div>
                                            <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full text-[#a78bfa] bg-purple-500/12">Low</span>
                                        </div>
                                        <p className="text-[11px] font-black text-white">2 invoices overdue</p>
                                        <div className="h-[30px] mt-1">
                                            <Bar
                                                data={{
                                                    labels: ["", "", ""],
                                                    datasets: [{
                                                        data: [1, 2, 2],
                                                        backgroundColor: "#a78bfa",
                                                        borderRadius: 1
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => alert("Action: Send reminder")} className="w-full py-1 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[9px] font-bold cursor-pointer border-none mt-1">
                                        Send reminder
                                    </button>
                                </div>

                                {/* 9. API Request Volume (New Card 1) */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#03201d] via-[#063b36] to-[#011413] border-[#14b8a6]/30 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400">Request Volume</span>
                                        <span className="text-sm">🌐</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">1.2M Requests</p>
                                        <div className="h-[40px] mt-1">
                                            <Line
                                                data={{
                                                    labels: ["", "", "", "", "", ""],
                                                    datasets: [{
                                                        data: [80, 95, 85, 110, 105, 120],
                                                        borderColor: "#14b8a6",
                                                        borderWidth: 2,
                                                        fill: true,
                                                        backgroundColor: "rgba(20,184,166,0.1)",
                                                        pointRadius: 0
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 10. Security Audit (New Card 2) */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#080d30] via-[#101b54] to-[#04071c] border-[#6366f1]/30 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400">Security Audit</span>
                                        <span className="text-sm">🛡️</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white mb-2">100% Clean Audit</p>
                                        <div className="h-[40px] flex justify-center items-center">
                                            <div className="w-8 h-8">
                                                <Doughnut
                                                    data={{
                                                        datasets: [{
                                                            data: [100, 0],
                                                            backgroundColor: ["#6366f1", "rgba(255,255,255,0.05)"],
                                                            borderWidth: 0
                                                        }]
                                                    }}
                                                    options={sparklineOpts}
                                                />
                                            </div>
                                            <span className="text-[9px] text-[#6366f1] font-bold ml-2">Secure</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 11. Neural Guard (New Card 3) */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#2a0624] via-[#470d3e] to-[#190315] border-[#ec4899]/30 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400">Neural Guard</span>
                                        <span className="text-sm">🤖</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">0 Threats Detected</p>
                                        <div className="h-[40px] mt-1">
                                            <Line
                                                data={{
                                                    labels: ["", "", "", "", "", ""],
                                                    datasets: [{
                                                        data: [0, 0, 0, 0, 0, 0],
                                                        borderColor: "#ec4899",
                                                        borderWidth: 2,
                                                        fill: false,
                                                        pointRadius: 0
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 12. Autonomy Level (New Card 4) */}
                                <div className="p-4 rounded-2xl border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-[#142306] via-[#243e0b] to-[#0b1403] border-[#84cc16]/30 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] uppercase font-bold text-zinc-400">Autonomy Level</span>
                                        <span className="text-sm">🎯</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">Level 4 (Active)</p>
                                        <div className="h-[40px] mt-1">
                                            <Bar
                                                data={{
                                                    labels: ["", "", "", "", ""],
                                                    datasets: [{
                                                        data: [1, 2, 3, 4, 4],
                                                        backgroundColor: "#84cc16",
                                                        borderRadius: 1
                                                    }]
                                                }}
                                                options={sparklineOpts}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </LocalCard>
                </div>

                {/* ── 10. TASK BOARD ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">10. Task Board</span>
                            <span className="text-[10px] text-purple-400 font-bold">42 Backlog</span>
                        </div>
                        <div className="h-[120px] mb-3">
                            <Bar
                                data={{
                                    labels: ["Backlog", "Todo", "InDev", "Done"],
                                    datasets: [{ data: [15, 12, 8, 7], backgroundColor: "#8b6cf6", borderRadius: 4 }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, animation: animationOpts, plugins: { legend: { display: false } } }}
                            />
                        </div>
                        <p className="text-[10px] text-zinc-555 text-center font-medium">Development tasks backlog allocation</p>
                    </LocalCard>
                </div>

                {/* ── 11. SAAS PRODUCTS ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">11. SaaS Products</span>
                            <span className="text-[10px] text-purple-400 font-bold">₹4.8L MRR</span>
                        </div>
                        <div className="h-[120px] mb-3">
                            <Line
                                data={{
                                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                                    datasets: [{ data: [2.1, 2.6, 3.2, 3.8, 4.4, 4.8], borderColor: "#8b6cf6", borderWidth: 2, pointRadius: 0, fill: false, tension: 0.4 }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, animation: animationOpts, plugins: { legend: { display: false } } }}
                            />
                        </div>
                        <p className="text-[10px] text-zinc-555 text-center font-medium">MRR tracking chart for subscription tools</p>
                    </LocalCard>
                </div>

                {/* ── 12. SUBSCRIPTIONS & MRR ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">12. Subscriptions & MRR</span>
                            <span className="text-[10px] text-purple-400 font-bold">₹2.9L Recur</span>
                        </div>
                        <div className="h-[120px] mb-3">
                            <Line
                                data={{
                                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                                    datasets: [{ data: [1.8, 2.2, 2.5, 2.8, 2.9, 2.9], borderColor: "#8b6cf6", borderWidth: 2, pointRadius: 0, fill: false }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, animation: animationOpts, plugins: { legend: { display: false } } }}
                            />
                        </div>
                        <p className="text-[10px] text-zinc-555 text-center font-medium">Active subscriptions recurrency graph</p>
                    </LocalCard>
                </div>

                {/* ── 13. TEAM DIRECTORY ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">13. Team Directory</span>
                            <span className="text-[10px] text-purple-400 font-bold">14 Members</span>
                        </div>
                        <div className="space-y-2 text-[10px] font-mono">
                            <div className="flex justify-between pb-1.5 border-b border-zinc-200 dark:border-white/5"><span className="text-zinc-400">Devs Allocated</span><span className="text-white font-bold">8 / 8</span></div>
                            <div className="flex justify-between pb-1.5 border-b border-zinc-200 dark:border-white/5"><span className="text-zinc-400">Designers Allocated</span><span className="text-white font-bold">2 / 2</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">PMs Allocated</span><span className="text-white font-bold">2 / 4</span></div>
                        </div>
                    </LocalCard>
                </div>

                {/* ── 14. AI AGENTS CONSOLE ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">14. AI Agents Console</span>
                            <span className="text-[10px] text-purple-400 font-bold">98.4% Acc</span>
                        </div>
                        <div className="space-y-2 text-[10px] font-mono">
                            <div className="flex justify-between pb-1.5 border-b border-zinc-200 dark:border-white/5"><span className="text-zinc-400">Prompt Success</span><span className="text-purple-405 font-bold">99.2%</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Tokens/sec avg</span><span className="text-[#8b6cf6] font-bold">78 t/s</span></div>
                        </div>
                    </LocalCard>
                </div>

                {/* ── 15. INVOICES & FINANCE ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">15. Invoices & Finance</span>
                            <span className="text-[10px] text-purple-400 font-bold">₹8.4L Paid</span>
                        </div>
                        <div className="space-y-2 text-[10px] font-mono">
                            <div className="flex justify-between pb-1.5 border-b border-zinc-200 dark:border-white/5"><span className="text-zinc-400">Pending Invoices</span><span className="text-[#8b6cf6] font-bold">3 (₹1.8L)</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Overdue bills</span><span className="text-purple-450 font-bold">0</span></div>
                        </div>
                    </LocalCard>
                </div>

                {/* ── 16. MARKETING CAMPAIGNS ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">16. Marketing Campaigns</span>
                            <span className="text-[10px] text-purple-400 font-bold">4.2x ROI</span>
                        </div>
                        <div className="space-y-2 text-[10px] font-mono">
                            <div className="flex justify-between pb-1.5 border-b border-zinc-200 dark:border-white/5"><span className="text-zinc-400">Meta Leads Ads</span><span className="text-[#8b6cf6] font-bold">Active</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">LinkedIn Outreach</span><span className="text-purple-455 font-bold">Paused</span></div>
                        </div>
                    </LocalCard>
                </div>

                {/* ── 17. REPORTS & ANALYTICS ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">17. Reports & Analytics</span>
                            <span className="text-[10px] text-purple-400 font-bold">Ready</span>
                        </div>
                        <div className="h-[120px] mb-3">
                            <Line
                                data={{
                                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                                    datasets: [{ data: [15, 25, 20, 30, 45, 50], borderColor: "#8b6cf6", borderWidth: 2, pointRadius: 0, fill: false }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, animation: animationOpts, plugins: { legend: { display: false } } }}
                            />
                        </div>
                        <p className="text-[10px] text-zinc-555 text-center font-medium">Interactive YoY performance report metrics</p>
                    </LocalCard>
                </div>

                {/* ── 18. SUPPORT TICKETS ── */}
                <div className="lg:col-span-4">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">18. Support Tickets</span>
                            <span className="text-[10px] text-purple-400 font-bold">8 Open</span>
                        </div>
                        <div className="space-y-2 text-[10px] font-mono">
                            <div className="flex justify-between pb-1.5 border-b border-zinc-200 dark:border-white/5"><span className="text-zinc-400">SLA Response avg</span><span className="text-purple-455">38 min</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Closed today</span><span className="text-[#8b6cf6] font-bold">14 resolved</span></div>
                        </div>
                    </LocalCard>
                </div>

                {/* ── 19. CYBERSECURITY ── */}
                <div className="lg:col-span-12">
                    <LocalCard theme={theme}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">19. Cybersecurity threat scan logs</span>
                            <span className="text-[10px] text-purple-455 font-bold">0 Vulnerabilities</span>
                        </div>
                        <div className="h-[120px] mb-3">
                            <Line
                                data={{
                                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                                    datasets: [{ data: [0, 0, 1, 0, 0, 0], borderColor: "#ef4444", borderWidth: 2, pointRadius: 0, fill: false }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, animation: animationOpts, plugins: { legend: { display: false } } }}
                            />
                        </div>
                        <p className="text-[10px] text-zinc-555 text-center font-medium">Threat scanner audit registry logs active</p>
                    </LocalCard>
                </div>

            </div>
        </div>
    );
}
