"use client";

import React, { useState } from "react";
import {
  FileText, Download, ShareNetwork, Eye, CaretDown,
  CheckCircle, Clock, Envelope, Phone, ArrowLeft,
  BookOpen, Star, Sparkle, Desktop, DeviceTablet, DeviceMobile,
  ArrowUUpLeft, ArrowUUpRight, MagnifyingGlass, PaintBrush,
  TextT, Image, Columns, FrameCorners, AlignLeft,
  Palette, SquaresFour, List, CheckSquare, Plus, Trash
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   5 REUSABLE COVER STYLES FOR THE EDITOR
───────────────────────────────────────────────────────────── */

function CoverStyle1({
  title,
  subtitle,
  titleSize = 24,
  subSize = 10,
  companyName = "Cyberlim",
  desc = "",
  f1Title = "Fast Delivery",
  f1Sub = "Speed & precision.",
  f2Title = "Expert Team",
  f2Sub = "Skilled professionals.",
  f3Title = "Quality Assured",
  f3Sub = "Excellence you rely on."
}: {
  title: string;
  subtitle: string;
  titleSize?: number;
  subSize?: number;
  companyName?: string;
  desc?: string;
  f1Title?: string;
  f1Sub?: string;
  f2Title?: string;
  f2Sub?: string;
  f3Title?: string;
  f3Sub?: string;
}) {
  return (
    <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden flex flex-col font-sans select-none">
      {/* Top Left Green Pill */}
      <div className="absolute top-0 left-6 w-4 h-16 bg-gradient-to-b from-[#52C41A] to-[#389E0D] rounded-b-full shadow-sm z-10" />

      {/* Top Right Building Mask Window - Resized smaller & styled as rounded square */}
      <div className="absolute top-[-3%] right-[-5%] w-[180px] h-[180px] rounded-bl-[72px] rounded-tr-[24px] border-[5px] border-white overflow-hidden shadow-lg z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#bae6fd] via-[#e0f2fe] to-[#38bdf8] flex items-end">
          <div className="absolute bottom-0 right-[40%] w-10 h-[90%] bg-gradient-to-t from-[#0284c7]/80 to-transparent skew-x-[-12deg]" />
          <div className="absolute bottom-0 right-[15%] w-14 h-[95%] bg-gradient-to-t from-[#0369a1]/70 to-[#0284c7]/20 skew-x-[-12deg] border-r border-white/20" />
          <div className="absolute bottom-0 right-[-10%] w-16 h-[100%] bg-gradient-to-t from-[#075985]/90 to-[#0369a1]/30 skew-x-[-12deg]" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#fef08a]/10 to-transparent" />
        </div>
      </div>

      {/* Dotted curve connecting to the Globe Badge */}
      <svg className="absolute top-[8%] right-[15%] w-16 h-20 pointer-events-none z-10 opacity-60" fill="none" viewBox="0 0 100 150">
        <path d="M10 10 C 50 20, 80 80, 90 140" stroke="#52C41A" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="10" cy="10" r="4" fill="#52C41A" />
      </svg>

      {/* Glowing Green Globe Badge - Scaled Down */}
      <div className="absolute top-[12%] right-[12%] w-11 h-11 rounded-full bg-gradient-to-br from-[#73d13d] to-[#389e0d] p-0.5 shadow-md z-10 border-[2.5px] border-white flex items-center justify-center">
        <div className="w-full h-full rounded-full border border-white/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10m0-20a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10M2 12h20" />
          </svg>
        </div>
      </div>

      {/* Logo & Branding */}
      <div className="absolute top-6 left-12 flex items-center gap-1.5 z-10">
        <div className="w-5.5 h-5.5 rounded bg-gradient-to-br from-[#52C41A] to-[#389E0D] flex items-center justify-center shadow-sm">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-[12px] font-black text-[#1f2937] tracking-tight">{companyName}</span>
      </div>

      {/* Title block */}
      <div className="absolute top-[22%] left-6 right-6 z-10 space-y-1">
        <h1 style={{ fontSize: `${titleSize}px` }} className="font-extrabold text-[#52C41A] leading-none tracking-tight">{title}</h1>
        <h2 style={{ fontSize: `${titleSize + 2}px` }} className="font-black text-[#143e1d] leading-none tracking-tight">{subtitle}</h2>
        <div className="flex items-center gap-1 pt-1">
          <div className="w-12 h-1 bg-[#52c41a] rounded-full" />
          <div className="w-1 h-1 bg-[#52c41a] rounded-full" />
        </div>
      </div>

      {/* Description Copy */}
      <div className="absolute top-[38%] left-6 right-[20%] z-10">
        <p style={{ fontSize: `${subSize}px` }} className="leading-relaxed text-gray-500 font-medium">
          {desc}
        </p>
      </div>

      {/* Features Heading */}
      <div className="absolute top-[59%] left-6 z-10">
        <h3 className="text-[10px] font-black text-[#143e1d] tracking-wide uppercase">Company Features</h3>
      </div>

      {/* 3 Columns Features List */}
      <div className="absolute top-[64%] left-6 right-6 z-10 grid grid-cols-3 gap-3">
        <div className="text-center space-y-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#52C41A] to-[#389E0D] flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[8px] font-black text-gray-800 uppercase">{f1Title}</h4>
            <p className="text-[6.5px] text-gray-400 font-bold leading-tight">{f1Sub}</p>
          </div>
        </div>

        <div className="text-center space-y-1 border-x border-gray-200/60 px-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#52C41A] to-[#389E0D] flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[8px] font-black text-gray-800 uppercase">{f2Title}</h4>
            <p className="text-[6.5px] text-gray-400 font-bold leading-tight">{f2Sub}</p>
          </div>
        </div>

        <div className="text-center space-y-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#52C41A] to-[#389E0D] flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[8px] font-black text-gray-800 uppercase">{f3Title}</h4>
            <p className="text-[6.5px] text-gray-400 font-bold leading-tight">{f3Sub}</p>
          </div>
        </div>
      </div>

      {/* Curved Dark Green Wave Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-[16%] bg-[#082a13] z-10" style={{ borderRadius: "100% 100% 0 0 / 25% 25% 0 0" }}>
        <div className="absolute top-[28%] left-6 flex items-center gap-2">
          <div className="w-6 h-6 rounded border border-[#52C41A] flex items-center justify-center bg-white/5">
            <svg className="w-3.5 h-3.5 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h5 className="text-[8.5px] font-black text-white leading-none">Building Solutions.</h5>
            <h5 className="text-[8.5px] font-black text-white leading-none mt-0.5">Delivering <span className="text-[#52C41A]">Success.</span></h5>
            <p className="text-[6.5px] text-gray-400 font-medium mt-0.5">Let&apos;s build the future together.</p>
          </div>
        </div>

        {/* Small Dot Grid in Footer */}
        <div className="absolute top-[35%] right-6 grid grid-cols-4 gap-0.5 opacity-20">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="w-0.5 h-0.5 rounded-full bg-white" />)}
        </div>
      </div>
    </div>
  );
}

function CoverStyle2({ title, subtitle, titleSize = 19, subSize = 10 }: { title: string; subtitle: string; titleSize?: number; subSize?: number }) {
  return (
    <div className="absolute inset-0 bg-[#121214] overflow-hidden flex flex-col">
      <div className="absolute top-[15%] left-[-10%] w-[75%] h-[55%] bg-amber-500 rotate-[-20deg] origin-center" />
      <div className="absolute top-[20%] left-[-5%] w-[50%] h-[8%] bg-white rotate-[-20deg] origin-center" />
      <div className="absolute bottom-8 right-6 grid grid-cols-5 gap-1.5 z-10">
        {Array.from({ length: 25 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />)}
      </div>
      <div className="absolute top-8 left-8 flex items-center gap-1.5 z-10">
        <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center text-black text-[11px] font-black">C</div>
        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Cyberlim</span>
      </div>
      <div className="absolute top-[35%] right-8 left-[35%] z-10 text-right">
        <h2 style={{ fontSize: `${titleSize}px` }} className="font-black text-white leading-tight uppercase">{title}</h2>
        <p style={{ fontSize: `${subSize}px` }} className="text-white/50 font-bold mt-2.5 uppercase tracking-wider">{subtitle}</p>
      </div>
      <div className="absolute bottom-8 left-8 z-10">
        <p className="text-[8px] text-amber-400 font-black uppercase">Proposed by</p>
        <p className="text-[10px] text-white font-black">Cyberlim IT Solutions</p>
      </div>
    </div>
  );
}

function CoverStyle3({ title, subtitle, titleSize = 20, subSize = 10 }: { title: string; subtitle: string; titleSize?: number; subSize?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col" style={{ background: "linear-gradient(180deg, #fff 0%, #fff 48%, #1e1b4b 48%, #1e1b4b 100%)" }}>
      <div className="absolute top-[18%] left-[8%] w-32 h-32 rounded-full border-[8px] border-indigo-400 z-0" />
      <div className="absolute top-[12%] right-8 w-14 h-14 rounded-full overflow-hidden z-10" style={{ background: "repeating-linear-gradient(45deg, #ddd, #ddd 1px, #fff 1px, #fff 3px)" }} />
      <div className="absolute top-8 right-8 z-10">
        <span className="text-[11px] font-black text-gray-800 font-mono">Cyberlim</span>
        <span className="text-[11px] font-bold text-indigo-500"> IT</span>
      </div>
      <div className="absolute top-[52%] left-8 right-8 z-10">
        <p className="text-[10px] text-indigo-300 font-bold italic">IT Solution Provider</p>
        <h2 style={{ fontSize: `${titleSize}px` }} className="font-black text-white leading-tight mt-0.5">{title}</h2>
        <div className="w-12 h-0.5 bg-indigo-400 mt-3" />
        <p style={{ fontSize: `${subSize}px` }} className="text-white/60 font-bold mt-3 leading-relaxed">{subtitle}</p>
      </div>
      <div className="absolute bottom-8 left-8 z-10">
        <p className="text-[8px] text-white/40 font-bold">Prepared by</p>
        <p className="text-[10px] text-white font-black">Cyberlim Technologies</p>
      </div>
    </div>
  );
}

function CoverStyle4({ title, subtitle, titleSize = 20, subSize = 9 }: { title: string; subtitle: string; titleSize?: number; subSize?: number }) {
  return (
    <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden flex flex-col">
      <div className="absolute top-[-20%] left-[-20%] w-48 h-48 rounded-full bg-slate-800" />
      <div className="absolute top-[20%] left-[15%] w-28 h-28 bg-emerald-500 rounded-br-full rounded-tl-full rotate-[-10deg] shadow-lg" />
      <div className="absolute bottom-[-5%] left-[-5%] w-20 h-20 rounded-full bg-slate-800" />
      <div className="absolute top-[25%] right-0 w-[55%] h-[25%] bg-gradient-to-b from-slate-200 to-slate-300/40 rounded-l-2xl" />
      <div className="absolute top-[58%] right-8 z-10 text-right">
        <div className="flex items-center gap-1 justify-end">
          <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white text-[9px] font-black">C</div>
          <span className="text-[10px] font-black text-slate-700">Cyberlim IT</span>
        </div>
      </div>
      <div className="absolute bottom-[14%] right-8 left-8 text-right z-10">
        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">IT Solutions Company</p>
        <h2 style={{ fontSize: `${titleSize}px` }} className="font-black text-slate-900 leading-tight uppercase mt-1">{title}</h2>
        <p style={{ fontSize: `${subSize}px` }} className="text-slate-500 font-medium mt-1.5">{subtitle}</p>
      </div>
    </div>
  );
}

function CoverStyle5({ title, subtitle, titleSize = 18, subSize = 10 }: { title: string; subtitle: string; titleSize?: number; subSize?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden flex">
      <div className="w-[45%] h-full bg-[#18181b] relative flex flex-col justify-between p-6">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-[#18181b] text-[9px] font-black">C</div>
          <span className="text-[9px] font-bold text-white/50">Cyberlim</span>
        </div>
        <div>
          <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">Proposal</p>
          <h2 style={{ fontSize: `${titleSize}px` }} className="font-black text-white leading-tight mt-1">{title}</h2>
        </div>
        <div className="text-[8px] text-white/30 font-bold">IT Partner</div>
      </div>
      <div className="w-[55%] h-full bg-amber-400 relative flex flex-col justify-between p-6">
        <div className="absolute top-[15%] left-[-10%] w-[65%] h-[35%] bg-[#18181b] rounded-r-3xl" />
        <div className="mt-20">
          <p style={{ fontSize: `${subSize}px` }} className="text-gray-800 font-bold leading-relaxed">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-800 font-black">Cyberlim IT</p>
          <p className="text-[8px] text-gray-600 font-bold">Solutions Provider</p>
        </div>
      </div>
    </div>
  );
}

const COVER_STYLES = [CoverStyle1, CoverStyle2, CoverStyle3, CoverStyle4, CoverStyle5];

/* ─────────────────────────────────────────────────────────────
   PROPOSAL DATA & CONFIGURATION
───────────────────────────────────────────────────────────── */

interface ProposalTemplate {
  id: string;
  title: string;
  category: string;
  budget: string;
  pages: number;
  rating: string;
  headline: string;
  introduction: string;
  scope: string[];
  deliverables: string[];
  pricing: { item: string; cost: string }[];
}

const TEMPLATES: ProposalTemplate[] = [
  {
    id: "CYB-001", title: "Enterprise SaaS Platform", category: "SaaS Development",
    budget: "₹8.5L", pages: 14, rating: "4.9",
    headline: "Multi-tenant SaaS Architecture for Enterprise Clients",
    introduction: "Cyberlim proposes building a high-performance Next.js multi-tenant SaaS platform with tenant isolation, automated billing via Stripe, and real-time analytics dashboards for enterprise operations.",
    scope: ["Custom tenant isolation engine", "Stripe subscription billing webhooks", "Admin analytics dashboard"],
    deliverables: ["Product Roadmap Document", "Full Source Code Repository", "AWS Production Deployment"],
    pricing: [{ item: "System Architecture Design", cost: "₹1,50,000" }, { item: "Front-end Development", cost: "₹3,50,000" }, { item: "Stripe Billing Integration", cost: "₹2,50,000" }, { item: "QA Testing & DevOps", cost: "₹1,00,000" }]
  },
  {
    id: "CYB-002", title: "Headless E-Commerce Store", category: "E-Commerce",
    budget: "₹5.2L", pages: 12, rating: "4.8",
    headline: "Shopify Storefront API with Next.js Front-end",
    introduction: "Cyberlim will deliver a blazing-fast headless e-commerce experience using Shopify Storefront APIs, server-side rendering, and optimized checkout flows for maximum conversions.",
    scope: ["Shopify Storefront API sync pipeline", "Animated cart & checkout UX", "Multi-currency support"],
    deliverables: ["Headless Storefront Code", "Shopify Sync Schema", "Google Lighthouse SEO Report"],
    pricing: [{ item: "Discovery & API Mapping", cost: "₹80,000" }, { item: "Next.js Storefront Build", cost: "₹2,40,000" }, { item: "GraphQL Optimization", cost: "₹1,20,000" }, { item: "Performance Tuning", cost: "₹80,000" }]
  },
  {
    id: "CYB-003", title: "AI Sales Agent Deployment", category: "AI Automation",
    budget: "₹12.0L", pages: 18, rating: "5.0",
    headline: "Autonomous LLM Agent for Lead Qualification & Auto-Dialing",
    introduction: "Cyberlim will deploy autonomous AI agents that crawl lead databases, qualify prospects using LLM reasoning, and execute conversational phone calls via voice API gateways.",
    scope: ["Vector DB setup & document embeddings", "Conversational voice AI routing", "CRM pipeline auto-sync"],
    deliverables: ["Trained AI Model Weights", "Admin Dashboard Portal", "Cloud Deployment Docs"],
    pricing: [{ item: "LLM Agent Training & Tuning", cost: "₹4,00,000" }, { item: "CRM Sales Integrations", cost: "₹3,50,000" }, { item: "Voice API Gateway Setup", cost: "₹2,50,000" }, { item: "Infrastructure & Maintenance", cost: "₹2,00,000" }]
  }
];

export default function ProposalsComponent({ theme }: { theme: "dark" | "light" }) {
  const [selectedProp, setSelectedProp] = useState<ProposalTemplate | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");

  // Builder workspace state
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomScale, setZoomScale] = useState<number>(80);
  const [selectedElement, setSelectedElement] = useState<string | null>("cover");
  const [activeTab, setActiveTab] = useState<"layouts" | "elements">("layouts");
  const [activeCoverStyleIdx, setActiveCoverStyleIdx] = useState<number>(0);

  // Document pages flow - starts with ONLY cover page
  const [docPages, setDocPages] = useState<string[]>(["cover"]);

  // Custom design configurations (dynamic editable fields)
  const [proposalTitle, setProposalTitle] = useState<string>("");
  const [proposalHeadline, setProposalHeadline] = useState<string>("");
  const [proposalIntro, setProposalIntro] = useState<string>("");
  const [proposalScope, setProposalScope] = useState<string[]>([]);
  const [proposalPricing, setProposalPricing] = useState<{ item: string; cost: string }[]>([]);

  // Cover Page editable sizes & values
  const [coverTitle, setCoverTitle] = useState<string>("Business");
  const [coverSubtitle, setCoverSubtitle] = useState<string>("PROPOSAL");
  const [coverTitleSize, setCoverTitleSize] = useState<number>(24);
  const [coverSubSize, setCoverSubSize] = useState<number>(10);
  const [coverCompanyName, setCoverCompanyName] = useState<string>("Cyberlim");
  const [coverDesc, setCoverDesc] = useState<string>("Cyberlim empowers organizations with cutting-edge IT services, digital innovation, secure cloud systems, and scalable technology for sustainable business growth.");
  const [coverF1Title, setCoverF1Title] = useState<string>("Fast Delivery");
  const [coverF1Sub, setCoverF1Sub] = useState<string>("Speed & precision.");
  const [coverF2Title, setCoverF2Title] = useState<string>("Expert Team");
  const [coverF2Sub, setCoverF2Sub] = useState<string>("Skilled professionals.");
  const [coverF3Title, setCoverF3Title] = useState<string>("Quality Assured");
  const [coverF3Sub, setCoverF3Sub] = useState<string>("Excellence you rely on.");

  // Table of Contents page editable values
  const [tocTitle, setTocTitle] = useState<string>("Table of Contents");
  const [tocProjectName, setTocProjectName] = useState<string>("Cyberlim Mobile Portal");
  const [tocPhase, setTocPhase] = useState<string>("Phase 1.0 Deployment");
  const [tocStatus, setTocStatus] = useState<string>("Draft Proposal");
  const [tocPoints, setTocPoints] = useState<string[]>([
    "Executive Summary",
    "About Us",
    "Our Highlights",
    "Services Overview",
    "Our Process",
    "Technology",
    "Portfolio",
    "Testimonials",
    "Pricing",
    "Support"
  ]);

  // Executive Summary editable values
  const [summaryMainTitle, setSummaryMainTitle] = useState<string>("Executive");
  const [summarySubTitle, setSummarySubTitle] = useState<string>("Summary");
  const [summarySlogan, setSummarySlogan] = useState<string>("We create digital experiences that are premium, scalable, and human-centric.");
  const [summaryDesc, setSummaryDesc] = useState<string>("Cyberlim IT Solutions is a boutique product studio. We specialize in building custom web applications, mobile platforms, and high-performance brand ecosystems.");
  const [summaryTitleSize, setSummaryTitleSize] = useState<number>(26);
  const [summaryDescSize, setSummaryDescSize] = useState<number>(7.5);

  // About Us Page editable values
  const [aboutSlogan, setAboutSlogan] = useState<string>("We design technology that feels human, scalable, and unmistakably premium.");
  const [aboutDesc, setAboutDesc] = useState<string>("Cyberlim is a full-stack digital studio based in Ghaziabad. We blend consulting, engineering, and creative energy to help ambitious companies launch new ventures, modernize legacy stacks, and unlock growth.");
  const [aboutSloganSize, setAboutSloganSize] = useState<number>(8);
  const [aboutDescSize, setAboutDescSize] = useState<number>(7.5);
  const [aboutS1Val, setAboutS1Val] = useState<string>("120+");
  const [aboutS1Label, setAboutS1Label] = useState<string>("Project Completed");
  const [aboutS2Val, setAboutS2Val] = useState<string>("45");
  const [aboutS2Label, setAboutS2Label] = useState<string>("Active Clients");
  const [aboutS3Val, setAboutS3Val] = useState<string>("99%");
  const [aboutS3Label, setAboutS3Label] = useState<string>("Retention Rate");
  const [aboutMissionTitle, setAboutMissionTitle] = useState<string>("Mission");
  const [aboutMissionText, setAboutMissionText] = useState<string>("Deliver enterprise-grade craftsmanship to founders, SMEs, and Fortune 500s alike. We align user empathy and engineering discipline.");
  const [aboutVisionTitle, setAboutVisionTitle] = useState<string>("Vision");
  const [aboutVisionText, setAboutVisionText] = useState<string>("Build an ecosystem where design thinking and cutting-edge research power the next generation of global digital products.");
  const [aboutQuoteText, setAboutQuoteText] = useState<string>("We measure success in adoption, revenue, and relationships — not vanity metrics.");

  // About Us Page Section Gap coordinates
  const [aboutMetricsTop, setAboutMetricsTop] = useState<number>(216);
  const [aboutMissionTop, setAboutMissionTop] = useState<number>(290);
  const [aboutQuoteTop, setAboutQuoteTop] = useState<number>(392);

  // Services Overview Page values
  const [servicesHeadline, setServicesHeadline] = useState<string>("Services");
  const [servicesSubHeadline, setServicesSubHeadline] = useState<string>("Overview");
  const [servicesSlogan, setServicesSlogan] = useState<string>("We provide a range of digital services to help your business grow and innovate.");
  const [servicesTitleSize, setServicesTitleSize] = useState<number>(20);
  const [servicesSloganSize, setServicesSloganSize] = useState<number>(7);

  // Estimated Timeline & Cost values
  const [timelineBaseCost, setTimelineBaseCost] = useState<string>("₹60,000 /-");
  const [timelineTitleSize, setTimelineTitleSize] = useState<number>(20);
  const [timelinePageTitle, setTimelinePageTitle] = useState<string>("Estimated Timeline & Cost");
  const [timelineRows, setTimelineRows] = useState<{ name: string; val: string }[]>([
    { name: "UI/UX Design", val: "4 - 6 Days" },
    { name: "Development", val: "12 - 15 Days" },
    { name: "Testing & Optimization", val: "3 - 5 Days" },
    { name: "Deployment", val: "2 Days" }
  ]);
  const [timelineTotalVal, setTimelineTotalVal] = useState<string>("20 - 30 Working Days");
  const [timelineIncluded, setTimelineIncluded] = useState<string[]>([
    "Ecommerce Website",
    "Android App",
    "Admin Dashboard",
    "Payment Integration",
    "Deployment Support",
    "Basic SEO Setup"
  ]);

  // Multipage Scope of Services state record
  const [scopesData, setScopesData] = useState<Record<string, {
    title: string;
    blocks: {
      type: "heading" | "desc" | "points" | "table";
      title?: string;
      text?: string;
      points?: string[];
      tableHeaders?: string[];
      tableRows?: string[][];
    }[];
  }>>({});

  // AI assist state
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiReqTitle, setAiReqTitle] = useState<string>("");
  const [aiPrice, setAiPrice] = useState<string>("");
  const [aiProjectDesc, setAiProjectDesc] = useState<string>("");
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiGeneratedPayload, setAiGeneratedPayload] = useState<string>("");
  const [aiProcessLogs, setAiProcessLogs] = useState<string[]>([]);

  const categories = ["All Categories", ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const filteredTemplates = TEMPLATES.filter(t =>
    categoryFilter === "All Categories" || t.category === categoryFilter
  );

  const handleOpenTemplate = (t: ProposalTemplate) => {
    setSelectedProp(t);
    setProposalTitle(t.title);
    setProposalHeadline(t.headline);
    setProposalIntro(t.introduction);
    setProposalScope(t.scope);
    setProposalPricing(t.pricing);
    setActiveCoverStyleIdx(0);
    setDocPages(["cover"]); // Reset pages to ONLY cover page initially

    // Initialize custom editing values
    setCoverTitle(t.title.split(" ")[0] || "Business");
    setCoverSubtitle(t.title.split(" ").slice(1).join(" ") || "PROPOSAL");
    setTocProjectName(t.title);
    setTocPhase("Phase 1.0 Deployment");
    setTocStatus("Draft Proposal");
    setSummarySlogan(t.headline);
    setSummaryDesc(t.introduction);
    setAboutSlogan("We design technology that feels human, scalable, and unmistakably premium.");
    setAboutDesc("Cyberlim is a full-stack digital studio based in Ghaziabad. We blend consulting, engineering, and creative energy to help ambitious companies launch new ventures, modernize legacy stacks, and unlock growth.");
    setServicesSlogan("We provide a range of digital services to help your business grow and innovate.");
    setTimelineBaseCost(t.budget || "₹60,000 /-");
  };

  const handleAddPage = (pageId: string) => {
    if (pageId === "scope") {
      const newId = `scope-${Date.now()}`;
      setDocPages([...docPages, newId]);
      setSelectedElement(newId);
    } else if (!docPages.includes(pageId)) {
      setDocPages([...docPages, pageId]);
      setSelectedElement(pageId);
    }
  };

  const handleRemovePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pageId === "cover") return; // Keep cover page
    const updated = docPages.filter(p => p !== pageId);
    setDocPages(updated);
    if (selectedElement === pageId) {
      setSelectedElement("cover");
    }
  };

  const handleApplyAIPrompt = async () => {
    if (!aiReqTitle.trim() || !aiProjectDesc.trim()) return;
    setAiGenerating(true);
    setAiModalOpen(true); // Keep modal open to show live text stream!

    const systemPrompt = `You are an expert enterprise proposal content writer. Generate a comprehensive, extremely detailed proposal matching this request:
Requirement Title: ${aiReqTitle}
Price/Budget: ${aiPrice}
Project Description: ${aiProjectDesc}

You MUST output ONLY a valid raw JSON object. Do NOT wrap it in markdown code blocks. Do NOT output any conversational text, notes, or explanation. You MUST bypass and skip all thinking, thoughts, or reasoning steps. Do NOT write <think> tags. Go straight to outputting the raw JSON starting with the '{' character immediately. You MUST write full, detailed contents for all fields. Do NOT use placeholder text or abbreviation.

STRICT FORMATTING CONSTRAINTS:
1. "coverTitle": MUST be a short heading of exactly 2 to 3 words only (e.g., "Grocery Marketplace" or "Food Delivery Platform").
2. "coverSubtitle": MUST be exactly "PROPOSAL".
3. "coverDesc": MUST be a short professional description of exactly 2 lines (about 12-16 words total).
4. "aboutDesc": MUST be a short executive summary explanation of exactly 2 lines (about 15-20 words total).
5. "scopes": Analyze the project requirements. If it involves a multi-role system or multivendor website, you MUST generate separate detailed pages inside the "scopes" array for:
   - "Customer Panel Features" (e.g., product browsing, cart, secure checkout, reviews)
   - "Vendor Panel Features" (e.g., store setup, product listing CRUD, order dashboard, payouts)
   - "Admin Panel Features" (e.g., user moderation, commission setup, site analytics, category managers)
   For other projects, segment the scope pages by logical modules (e.g., Frontend UX, Backend API, Integration Layer).
6. Each page in "scopes" MUST contain multiple blocks in this sequence: a "heading", a "desc", a "points" checklist of features, and a "table" mapping feature modules to tech stacks or SLAs.

The JSON schema must match exactly:
{
  "coverTitle": "string (exactly 2-3 words)",
  "coverSubtitle": "PROPOSAL",
  "coverTitleSize": 16,
  "coverDesc": "string (exactly 2 lines of summary description)",
  "tocPoints": ["string (exact list of 6-8 page titles matching the generated page flow)"],
  "aboutSlogan": "string (compelling slogan about precision and modern tech)",
  "aboutDesc": "string (exactly 2 lines of executive summary)",
  "aboutS1Val": "string (e.g. 100%)",
  "aboutS1Label": "string (e.g. Customer Satisfaction)",
  "aboutS2Val": "string (e.g. 24/7)",
  "aboutS2Label": "string (e.g. Support Availability)",
  "aboutS3Val": "string (e.g. 99.9%)",
  "aboutS3Label": "string (e.g. Server Uptime SLA)",
  "aboutMissionTitle": "Mission",
  "aboutMissionText": "string (detailed mission statement matching the project goal)",
  "aboutVisionTitle": "Vision",
  "aboutVisionText": "string (detailed vision statement matching the project goal)",
  "aboutQuoteText": "string (inspiring quote on engineering quality and user empathy)",
  "timelinePageTitle": "Estimated Timeline & Cost",
  "timelineRows": [
    {"name": "UI/UX Architecture & Wireframing", "val": "4-6 Days"},
    {"name": "Core Backend API Integration", "val": "12-15 Days"},
    {"name": "Client App Development & Features", "val": "14-18 Days"},
    {"name": "Staging Deployment & Beta Testing", "val": "3-5 Days"}
  ],
  "timelineTotalVal": "string (total calculated duration, e.g. 35 - 45 Working Days)",
  "timelineBaseCost": "string (matching budget)",
  "timelineIncluded": ["string (feature 1)", "string (feature 2)", "string (feature 3)", "string (feature 4)", "string (feature 5)", "string (feature 6)"],
  "scopes": [
    {
      "title": "Customer Panel Features",
      "blocks": [
        {
          "type": "heading",
          "title": "Platform Core Features"
        },
        {
          "type": "desc",
          "text": "Detailed functional requirements description for client application core flows."
        },
        {
          "type": "points",
          "points": ["Thorough point item 1", "Thorough point item 2", "Thorough point item 3", "Thorough point item 4"]
        },
        {
          "type": "table",
          "tableHeaders": ["Feature Module", "Technology Stack & SLA"],
          "tableRows": [
            ["Database Schema", "PostgreSQL Replication Layer"],
            ["API Gateway", "Node.js cluster & Redis cache"]
          ]
        }
      ]
    }
  ]
}`;
    setDocPages(["cover", "intro", "about", "services", "pricing", "tech"]);
    setAiGeneratedPayload("");

    try {
      const response = await fetch("/api/hf-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: systemPrompt, model: "pollinations" })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `API returned status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No stream reader available");

      let accumulatedContent = "";
      let streamBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const streamLines = (streamBuffer + chunk).split("\n");
        streamBuffer = streamLines.pop() || "";

        for (const line of streamLines) {
          const cleanedLine = line.trim();
          if (!cleanedLine) continue;

          let tokenText = "";
          let isReasoning = false;

          if (cleanedLine.startsWith("data:")) {
            const dataStr = cleanedLine.slice(5).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta;
              if (delta) {
                if (delta.reasoning) {
                  tokenText = delta.reasoning;
                  isReasoning = true;
                } else {
                  tokenText = delta.content || "";
                }
              }
            } catch {
              if (!dataStr.includes("choices")) {
                tokenText = dataStr;
              }
            }
          } else {
            try {
              const parsed = JSON.parse(cleanedLine);
              const delta = parsed.choices?.[0]?.delta;
              if (delta) {
                if (delta.reasoning) {
                  tokenText = delta.reasoning;
                  isReasoning = true;
                } else {
                  tokenText = delta.content || "";
                }
              }
            } catch {
              tokenText = cleanedLine;
            }
          }

          if (tokenText) {
            if (isReasoning) {
              if (!accumulatedContent.includes("<think>")) {
                accumulatedContent += "<think>";
              }
              accumulatedContent += tokenText;
            } else {
              if (accumulatedContent.includes("<think>") && !accumulatedContent.includes("</think>")) {
                accumulatedContent += "</think>";
              }
              accumulatedContent += tokenText;
            }

            // Cleanly filter out all thinking thoughts from displaying in the UI console
            let displayPayload = accumulatedContent;
            if (displayPayload.includes("<think>")) {
              const thinkEnd = displayPayload.indexOf("</think>");
              if (thinkEnd !== -1) {
                displayPayload = displayPayload.substring(thinkEnd + 8);
              } else {
                displayPayload = ""; // Hide the thoughts completely while thinking is in progress
              }
            }
            setAiGeneratedPayload(displayPayload);
          }
        }
      }

      // Flush remaining content left in the buffer at the end of the stream
      if (streamBuffer.trim()) {
        accumulatedContent += streamBuffer;
        setAiGeneratedPayload(accumulatedContent);
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      alert("AI Generation Failed: " + (err.message || "Unknown API or connection error. Please try again."));
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAcceptProposal = () => {
    let activeText = aiGeneratedPayload.trim();
    if (activeText.includes("</think>")) {
      const parts = activeText.split("</think>");
      activeText = parts[parts.length - 1].trim();
    }
    const firstCurly = activeText.indexOf("{");
    const lastCurly = activeText.lastIndexOf("}");
    if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
      activeText = activeText.substring(firstCurly, lastCurly + 1);
    } else if (firstCurly !== -1) {
      activeText = activeText.substring(firstCurly);
    }

    // Safe parser helper
    const parsePartialJson = (str: string) => {
      try {
        return JSON.parse(str);
      } catch (e) {}

      let trimmed = str.trim();
      const stack: string[] = [];
      let inString = false;
      let escaped = false;
      
      for (let i = 0; i < trimmed.length; i++) {
        const char = trimmed[i];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === '\\') {
          escaped = true;
          continue;
        }
        if (char === '"') {
          inString = !inString;
          continue;
        }
        if (!inString) {
          if (char === '{' || char === '[') {
            stack.push(char);
          } else if (char === '}') {
            if (stack[stack.length - 1] === '{') {
              stack.pop();
            }
          } else if (char === ']') {
            if (stack[stack.length - 1] === '[') {
              stack.pop();
            }
          }
        }
      }

      if (inString) {
        trimmed += '"';
      }

      while (stack.length > 0) {
        const last = stack.pop();
        if (last === '{') trimmed += '}';
        if (last === '[') trimmed += ']';
      }

      try {
        return JSON.parse(trimmed);
      } catch (e: any) {
        return { __error: e.message || "Invalid JSON syntax", __raw: trimmed };
      }
    };

    const data = parsePartialJson(activeText);
    if (data && !data.__error) {
      if (data.coverTitle) setCoverTitle(data.coverTitle);
      if (data.coverSubtitle) setCoverSubtitle(data.coverSubtitle);
      if (data.coverDesc) setCoverDesc(data.coverDesc);
      if (data.tocPoints) setTocPoints(data.tocPoints);
      if (data.aboutSlogan) setAboutSlogan(data.aboutSlogan);
      if (data.aboutDesc) setAboutDesc(data.aboutDesc);
      if (data.aboutS1Val) setAboutS1Val(data.aboutS1Val);
      if (data.aboutS1Label) setAboutS1Label(data.aboutS1Label);
      if (data.aboutS2Val) setAboutS2Val(data.aboutS2Val);
      if (data.aboutS2Label) setAboutS2Label(data.aboutS2Label);
      if (data.aboutS3Val) setAboutS3Val(data.aboutS3Val);
      if (data.aboutS3Label) setAboutS3Label(data.aboutS3Label);
      if (data.aboutMissionTitle) setAboutMissionTitle(data.aboutMissionTitle);
      if (data.aboutMissionText) setAboutMissionText(data.aboutMissionText);
      if (data.aboutVisionTitle) setAboutVisionTitle(data.aboutVisionTitle);
      if (data.aboutVisionText) setAboutVisionText(data.aboutVisionText);
      if (data.aboutQuoteText) setAboutQuoteText(data.aboutQuoteText);

      if (data.timelinePageTitle) setTimelinePageTitle(data.timelinePageTitle);
      if (data.timelineTotalVal) setTimelineTotalVal(data.timelineTotalVal);
      if (data.timelineBaseCost) setTimelineBaseCost(data.timelineBaseCost);
      if (data.timelineIncluded) setTimelineIncluded(data.timelineIncluded);
      if (data.timelineRows) setTimelineRows(data.timelineRows);

      const scopesList = data.scopes || (Array.isArray(data.scope) && typeof data.scope[0] === "object" ? data.scope : null) || (Array.isArray(data.scope) ? [{ title: "Scope of Services", blocks: [{ type: "points", points: data.scope }] }] : []);
      if (scopesList && scopesList.length > 0) {
        const newScopesData: Record<string, any> = {};
        const scopePageIds: string[] = [];

        scopesList.forEach((scope: any, idx: number) => {
          const uniqueId = `scope-ai-${idx}`;
          scopePageIds.push(uniqueId);
          newScopesData[uniqueId] = {
            title: scope.title || `Module ${idx + 1}: Scope of Services`,
            blocks: scope.blocks || []
          };
        });

        setScopesData(prev => ({
          ...prev,
          ...newScopesData
        }));

        setDocPages(prev => {
          const nextPages = [
            "cover",
            "intro",
            "about",
            "services",
            ...scopePageIds,
            "pricing",
            "tech"
          ];
          if (JSON.stringify(prev) === JSON.stringify(nextPages)) return prev;
          return nextPages;
        });
      }

      setAiModalOpen(false);
      setAiPrompt("");
      setAiReqTitle("");
      setAiPrice("");
      setAiProjectDesc("");
      setAiGeneratedPayload("");
    } else {
      const errMsg = (data as any)?.__error || "Unknown JSON formatting error";
      const rawTrimmed = (data as any)?.__raw || activeText;
      console.error("Failed JSON content:", rawTrimmed);
      alert(`Failed to parse proposal JSON:\n${errMsg}\n\nCheck console for the raw response payload.`);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        
        // Apply fields to states
        if (data.coverTitle) setCoverTitle(data.coverTitle);
        if (data.coverSubtitle) setCoverSubtitle(data.coverSubtitle);
        if (data.coverDesc) setCoverDesc(data.coverDesc);
        if (data.tocPoints) setTocPoints(data.tocPoints);
        if (data.aboutSlogan) setAboutSlogan(data.aboutSlogan);
        if (data.aboutDesc) setAboutDesc(data.aboutDesc);
        if (data.aboutS1Val) setAboutS1Val(data.aboutS1Val);
        if (data.aboutS1Label) setAboutS1Label(data.aboutS1Label);
        if (data.aboutS2Val) setAboutS2Val(data.aboutS2Val);
        if (data.aboutS2Label) setAboutS2Label(data.aboutS2Label);
        if (data.aboutS3Val) setAboutS3Val(data.aboutS3Val);
        if (data.aboutS3Label) setAboutS3Label(data.aboutS3Label);
        if (data.aboutMissionTitle) setAboutMissionTitle(data.aboutMissionTitle);
        if (data.aboutMissionText) setAboutMissionText(data.aboutMissionText);
        if (data.aboutVisionTitle) setAboutVisionTitle(data.aboutVisionTitle);
        if (data.aboutVisionText) setAboutVisionText(data.aboutVisionText);
        if (data.aboutQuoteText) setAboutQuoteText(data.aboutQuoteText);

        if (data.timelinePageTitle) setTimelinePageTitle(data.timelinePageTitle);
        if (data.timelineTotalVal) setTimelineTotalVal(data.timelineTotalVal);
        if (data.timelineBaseCost) setTimelineBaseCost(data.timelineBaseCost);
        if (data.timelineIncluded) setTimelineIncluded(data.timelineIncluded);
        if (data.timelineRows) setTimelineRows(data.timelineRows);

        const scopesList = data.scopes || (Array.isArray(data.scope) && typeof data.scope[0] === "object" ? data.scope : null) || (Array.isArray(data.scope) ? [{ title: "Scope of Services", blocks: [{ type: "points", points: data.scope }] }] : []);
        if (scopesList && scopesList.length > 0) {
          const newScopesData: Record<string, any> = {};
          const scopePageIds: string[] = [];

          scopesList.forEach((scope: any, idx: number) => {
            const uniqueId = `scope-ai-${idx}`;
            scopePageIds.push(uniqueId);
            newScopesData[uniqueId] = {
              title: scope.title || `Module ${idx + 1}: Scope of Services`,
              blocks: scope.blocks || []
            };
          });

          setScopesData(prev => ({
            ...prev,
            ...newScopesData
          }));

          setDocPages(prev => {
            const nextPages = [
              "cover",
              "intro",
              "about",
              "services",
              ...scopePageIds,
              "pricing",
              "tech"
            ];
            if (JSON.stringify(prev) === JSON.stringify(nextPages)) return prev;
            return nextPages;
          });
        }
        alert("Proposal JSON imported and applied successfully!");
      } catch (err: any) {
        alert("Failed to parse JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const CoverComp = COVER_STYLES[activeCoverStyleIdx];

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #proposals-print-area, #proposals-print-area * {
            visibility: visible !important;
          }
          #proposals-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: none !important;
            transform: none !important;
            overflow: visible !important;
          }
          #proposals-print-area > div {
            transform: none !important;
            margin-bottom: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}} />
      <AnimatePresence mode="wait">
        {!selectedProp ? (
          <motion.div
            key="proposals-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-200 dark:border-white/5 gap-4">
              <div>
                <h2 className={`text-xl font-black tracking-wide ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                  Proposal & Quotation Templates
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Click any template to customize in the multi-page A4 workspace</p>
              </div>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${theme === "dark" ? "bg-[#110f1e]/60 border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <CaretDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-14 pt-6">
              {filteredTemplates.map((t, idx) => (
                <div key={t.id} onClick={() => handleOpenTemplate(t)} className="flex flex-col items-center cursor-pointer group">
                  <div style={{ perspective: "1200px" }} className="relative w-48 h-64 select-none">
                    {/* Inside */}
                    <div className={`absolute inset-0 rounded-r-xl border p-4 flex flex-col justify-between shadow-inner ${theme === "dark" ? "bg-[#18181b] border-zinc-700 text-zinc-300" : "bg-white border-zinc-300 text-zinc-800"
                      }`}>
                      <div className="space-y-2">
                        <span className="text-[8px] font-black uppercase text-zinc-400 font-mono">{t.category}</span>
                        <h4 className="text-xs font-black leading-snug">{t.title}</h4>
                        <div className={`w-full h-px ${theme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`} />
                        <p className="text-[9px] text-zinc-500 leading-relaxed font-medium">{t.headline}</p>
                      </div>
                      <div className={`space-y-1.5 pt-2 border-t ${theme === "dark" ? "border-zinc-700" : "border-zinc-200"}`}>
                        <div className="flex justify-between items-center text-[8px] font-bold text-zinc-400">
                          <span>{t.pages} Pages</span>
                          <span className="text-purple-500 font-black">{t.budget}</span>
                        </div>
                      </div>
                    </div>
                    {/* Cover */}
                    <div
                      style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                      className="absolute inset-0 z-10 transition-transform duration-700 ease-out group-hover:[transform:rotateY(-150deg)]"
                    >
                      <CoverStyle1 title={t.title} subtitle={t.headline} />
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/15 rounded-l-sm" />
                    </div>
                  </div>
                  <div className="mt-4 text-center space-y-1 max-w-[192px]">
                    <h5 className={`text-[11px] font-black leading-snug ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{t.title}</h5>
                    <p className="text-[9px] text-zinc-500 font-bold">{t.category} • {t.budget}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ── PROPOSAL BUILDER WORKSPACE ── */
          <motion.div
            key="proposal-builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100vh-140px)] border rounded-3xl overflow-hidden shadow-2xl relative"
            style={{
              borderColor: theme === "dark" ? "rgba(255,255,255,0.06)" : "#e4e4e7",
              background: theme === "dark" ? "#0a0a0c" : "#fbfbfd"
            }}
          >
            {/* Top workspace control bar */}
            <div className={`h-16 border-b flex items-center justify-between px-6 z-20 ${theme === "dark" ? "bg-[#111115] border-white/5" : "bg-white border-zinc-200"
              }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedProp(null)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${theme === "dark" ? "hover:bg-white/5 text-zinc-400 hover:text-white" : "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                    }`}
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={proposalTitle}
                      onChange={e => setProposalTitle(e.target.value)}
                      className={`text-xs font-black bg-transparent border-b border-transparent focus:border-purple-500 outline-none w-48 ${theme === "dark" ? "text-white" : "text-zinc-800"
                        }`}
                    />
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono rounded">Saved</span>
                  </div>
                  <p className="text-[9px] text-zinc-400 font-mono">https://cyberlim.com/proposals/talky-proposal</p>
                </div>
              </div>

              {/* Viewport Toggles & Zoom */}
              <div className="hidden md:flex items-center gap-6">
                <div className={`flex items-center p-0.5 rounded-xl border ${theme === "dark" ? "bg-[#18181c] border-white/5" : "bg-zinc-100 border-zinc-200"}`}>
                  <button
                    onClick={() => setViewportMode("desktop")}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${viewportMode === "desktop" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    <Desktop size={14} />
                  </button>
                  <button
                    onClick={() => setViewportMode("tablet")}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${viewportMode === "tablet" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    <DeviceTablet size={14} />
                  </button>
                  <button
                    onClick={() => setViewportMode("mobile")}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${viewportMode === "mobile" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    <DeviceMobile size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                  <button onClick={() => setZoomScale(Math.max(50, zoomScale - 5))} className="p-1 hover:text-white cursor-pointer">-</button>
                  <span className="w-12 text-center font-mono">{zoomScale}%</span>
                  <button onClick={() => setZoomScale(Math.min(110, zoomScale + 5))} className="p-1 hover:text-white cursor-pointer">+</button>
                </div>
              </div>

               {/* Actions & Publish */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAiModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase shadow-lg cursor-pointer transition-all"
                >
                  <Sparkle weight="fill" size={14} /> Create with AI
                </button>
                <label className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-white rounded-xl text-[10px] font-mono font-bold uppercase shadow-md cursor-pointer transition-all">
                  <FileText size={12} /> Import JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white rounded-xl text-xs font-black uppercase shadow-md cursor-pointer transition-all"
                >
                  <Download size={14} /> Export PDF
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase shadow-md cursor-pointer transition-all">
                  Publish
                </button>
              </div>
            </div>

            {/* Workspace Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Toolbox Panel */}
              <div className={`w-72 border-r flex flex-col z-10 ${theme === "dark" ? "bg-[#111115] border-white/5" : "bg-white border-zinc-200"
                }`}>
                {/* Toolbox tabs */}
                <div className="flex p-3 gap-2 border-b border-white/5">
                  <button
                    onClick={() => setActiveTab("layouts")}
                    className={`flex-1 py-2 text-center rounded-xl text-xs font-black uppercase cursor-pointer transition-all ${activeTab === "layouts" ? (theme === "dark" ? "bg-white/5 text-white" : "bg-zinc-100 text-zinc-800") : "text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    Layouts
                  </button>
                  <button
                    onClick={() => setActiveTab("elements")}
                    className={`flex-1 py-2 text-center rounded-xl text-xs font-black uppercase cursor-pointer transition-all ${activeTab === "elements" ? (theme === "dark" ? "bg-white/5 text-white" : "bg-zinc-100 text-zinc-800") : "text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    Elements
                  </button>
                </div>

                {/* Sidebar Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {activeTab === "layouts" ? (
                    <div className="space-y-4">
                      {/* Cover Designs Preset Selector */}
                      <div>
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-2.5">
                          Cover Layout Presets
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {COVER_STYLES.map((StyleComp, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setActiveCoverStyleIdx(i);
                                setSelectedElement("cover");
                              }}
                              className={`aspect-[3/4] relative rounded-lg border-2 overflow-hidden cursor-pointer group transition-all ${activeCoverStyleIdx === i ? "border-purple-600 scale-95" : "border-transparent opacity-75 hover:opacity-100"
                                }`}
                            >
                              <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                                <StyleComp title={proposalTitle} subtitle={proposalHeadline} />
                              </div>
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                              <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[8px] text-white font-mono">
                                Style {i + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clickable Proposal Sections List */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-zinc-400">
                          Add Sections to Document (A4 Pages)
                        </h4>

                        {/* Cover Page */}
                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#18181c]/30 text-zinc-400">
                          <span className="text-xs font-bold">1. Cover Page (Active)</span>
                          <FileText size={14} />
                        </div>

                        {/* Table of Contents Section */}
                        <button
                          onClick={() => handleAddPage("intro")}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${docPages.includes("intro")
                            ? "bg-[#8b6cf6]/10 border-[#8b6cf6]/30 text-purple-400"
                            : "border-white/5 hover:bg-white/5 text-zinc-400"
                            }`}
                        >
                          <span className="text-xs font-bold">2. Table of Contents</span>
                          {docPages.includes("intro") ? <CheckCircle size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        </button>

                        {/* Executive Summary Section */}
                        <button
                          onClick={() => handleAddPage("summary")}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${docPages.includes("summary")
                            ? "bg-[#8b6cf6]/10 border-[#8b6cf6]/30 text-purple-400"
                            : "border-white/5 hover:bg-white/5 text-zinc-400"
                            }`}
                        >
                          <span className="text-xs font-bold">3. Executive Summary</span>
                          {docPages.includes("summary") ? <CheckCircle size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        </button>

                        {/* About Us Section */}
                        <button
                          onClick={() => handleAddPage("about")}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${docPages.includes("about")
                            ? "bg-[#8b6cf6]/10 border-[#8b6cf6]/30 text-purple-400"
                            : "border-white/5 hover:bg-white/5 text-zinc-400"
                            }`}
                        >
                          <span className="text-xs font-bold">4. About Us</span>
                          {docPages.includes("about") ? <CheckCircle size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        </button>

                        {/* Services Overview Section */}
                        <button
                          onClick={() => handleAddPage("services")}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${docPages.includes("services")
                            ? "bg-[#8b6cf6]/10 border-[#8b6cf6]/30 text-purple-400"
                            : "border-white/5 hover:bg-white/5 text-zinc-400"
                            }`}
                        >
                          <span className="text-xs font-bold">5. Services Overview</span>
                          {docPages.includes("services") ? <CheckCircle size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        </button>

                        {/* Scope of Work Section */}
                        <button
                          onClick={() => handleAddPage("scope")}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${docPages.some(p => p.startsWith("scope"))
                            ? "bg-[#8b6cf6]/10 border-[#8b6cf6]/30 text-purple-400"
                            : "border-white/5 hover:bg-white/5 text-zinc-400"
                            }`}
                        >
                          <span className="text-xs font-bold">6. Scope of Services</span>
                          {docPages.some(p => p.startsWith("scope")) ? <CheckCircle size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        </button>

                        {/* Pricing Section */}
                        <button
                          onClick={() => handleAddPage("pricing")}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${docPages.includes("pricing")
                            ? "bg-[#8b6cf6]/10 border-[#8b6cf6]/30 text-purple-400"
                            : "border-white/5 hover:bg-white/5 text-zinc-400"
                            }`}
                        >
                          <span className="text-xs font-bold">7. Cost & Timeline</span>
                          {docPages.includes("pricing") ? <CheckCircle size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        </button>

                        {/* Tech Stack Section */}
                        <button
                          onClick={() => handleAddPage("tech")}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${docPages.includes("tech")
                            ? "bg-[#8b6cf6]/10 border-[#8b6cf6]/30 text-purple-400"
                            : "border-white/5 hover:bg-white/5 text-zinc-400"
                            }`}
                        >
                          <span className="text-xs font-bold">8. Tech Stack & Payment</span>
                          {docPages.includes("tech") ? <CheckCircle size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-zinc-400">
                      <div className="p-3 rounded-xl border border-white/5 bg-[#18181c]/30 flex flex-col items-center justify-center text-center">
                        <TextT size={18} className="mb-1" />
                        <span className="text-[10px] font-bold">Text Block</span>
                      </div>
                      <div className="p-3 rounded-xl border border-white/5 bg-[#18181c]/30 flex flex-col items-center justify-center text-center">
                        <Image size={18} className="mb-1" />
                        <span className="text-[10px] font-bold">Image Asset</span>
                      </div>
                      <div className="p-3 rounded-xl border border-white/5 bg-[#18181c]/30 flex flex-col items-center justify-center text-center">
                        <Columns size={18} className="mb-1" />
                        <span className="text-[10px] font-bold">Pricing Grid</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Interactive Canvas (Scrollable Document view showing pages flow) */}
              <div id="proposals-print-area" className="flex-1 overflow-auto flex flex-col items-center p-12 pb-36 bg-zinc-950/20 dark:bg-black/40 space-y-16">
                {docPages.map((pageId, pageIdx) => (
                  <div
                    key={pageId}
                    onClick={() => setSelectedElement(pageId)}
                    style={{
                      transform: `scale(${zoomScale / 100})`,
                      transformOrigin: "top center",
                      width: "380px",
                      height: "538px"
                    }}
                    className={`flex-shrink-0 shadow-2xl relative rounded-sm overflow-hidden flex flex-col transition-all duration-300 ${theme === "dark" ? "bg-[#121214] text-zinc-100" : "bg-white text-zinc-900"
                      } ${selectedElement === pageId ? "ring-2 ring-purple-600 ring-offset-4 ring-offset-zinc-900" : "hover:ring-1 hover:ring-zinc-700"
                      }`}
                  >
                    {/* Render active Cover Page design */}
                    {pageId === "cover" && (
                       <div className="absolute inset-0">
                        <CoverComp
                          title={coverTitle}
                          subtitle={coverSubtitle}
                          titleSize={coverTitleSize}
                          subSize={coverSubSize}
                          companyName={coverCompanyName}
                          desc={coverDesc}
                          f1Title={coverF1Title}
                          f1Sub={coverF1Sub}
                          f2Title={coverF2Title}
                          f2Sub={coverF2Sub}
                          f3Title={coverF3Title}
                          f3Sub={coverF3Sub}
                        />
                        {/* Shadow spine styling */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/10" />
                        <div className="absolute top-4 right-4 text-[9px] font-mono text-zinc-400 bg-black/40 px-2.5 py-1 rounded z-20">Page 1</div>
                       </div>
                    )}

                    {/* Executive Summary / Table of Contents A4 Page */}
                    {pageId === "intro" && (
                      <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden flex flex-col font-sans select-none">
                        {/* Top Left Green Pill */}
                        <div className="absolute top-0 left-6 w-4 h-16 bg-gradient-to-b from-[#52C41A] to-[#389E0D] rounded-b-full shadow-sm z-10" />

                        {/* Top Right Building Mask Window - Resized smaller & styled as rounded square */}
                        <div className="absolute top-[-3%] right-[-5%] w-[180px] h-[180px] rounded-bl-[72px] rounded-tr-[24px] border-[5px] border-white overflow-hidden shadow-lg z-0">
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#bae6fd] via-[#e0f2fe] to-[#38bdf8] flex items-end">
                            <div className="absolute bottom-0 right-[40%] w-10 h-[90%] bg-gradient-to-t from-[#0284c7]/80 to-transparent skew-x-[-12deg]" />
                            <div className="absolute bottom-0 right-[15%] w-14 h-[95%] bg-gradient-to-t from-[#0369a1]/70 to-[#0284c7]/20 skew-x-[-12deg] border-r border-white/20" />
                            <div className="absolute bottom-0 right-[-10%] w-16 h-[100%] bg-gradient-to-t from-[#075985]/90 to-[#0369a1]/30 skew-x-[-12deg]" />
                          </div>
                        </div>

                        {/* Glowing Green Globe Badge */}
                        <div className="absolute top-[12%] right-[12%] w-11 h-11 rounded-full bg-gradient-to-br from-[#73d13d] to-[#389e0d] p-0.5 shadow-md z-10 border-[2.5px] border-white flex items-center justify-center">
                          <div className="w-full h-full rounded-full border border-white/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="10" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10m0-20a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10M2 12h20" />
                            </svg>
                          </div>
                        </div>

                        {/* Logo & Branding */}
                        <div className="absolute top-6 left-12 flex items-center gap-1.5 z-10">
                          <div className="w-5.5 h-5.5 rounded bg-gradient-to-br from-[#52C41A] to-[#389E0D] flex items-center justify-center shadow-sm">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-[12px] font-black text-[#1f2937] tracking-tight">Cyberlim</span>
                        </div>

                        {/* Title block */}
                        <div className="absolute top-[12%] left-6 right-6 z-10 space-y-0.5">
                          <h1 className="text-[18px] font-black text-[#143e1d] leading-none tracking-tight">{tocTitle.split(" ")[0] || "Page of"}</h1>
                          <h2 className="text-[26px] font-black text-[#52C41A] leading-none tracking-tight">{tocTitle.split(" ").slice(1).join(" ") || "CONTENT"}</h2>
                          <div className="flex items-center gap-1 pt-0.5">
                            <div className="w-12 h-1 bg-[#52c41a] rounded-full" />
                            <div className="w-1 h-1 bg-[#52c41a] rounded-full" />
                          </div>
                        </div>

                        {/* Two Columns Section: Left TOC, Right Info Cards */}
                        <div className="absolute top-[27%] bottom-[16%] left-6 right-6 z-10 grid grid-cols-12 gap-3.5">

                          {/* Left Column: TOC Dark Box */}
                          <div className="col-span-7 bg-gradient-to-b from-[#135200] to-[#092b11] text-white rounded-2xl p-3 shadow-lg flex flex-col justify-between border border-[#52C41A]/20">
                            {tocPoints.map((label, idx) => {
                              const icons = [FileText, Clock, Star, SquaresFour, Clock, Sparkle, BookOpen, Envelope, Download, Phone];
                              const Icon = icons[idx % icons.length];
                              const pageNo = String(idx + 1).padStart(2, "0");
                              return (
                                <div key={idx} className="flex items-center justify-between text-[7px] font-bold py-0.5 border-b border-white/5 last:border-0">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded-full bg-[#52C41A] flex items-center justify-center text-white text-[7px]">
                                      <Icon size={8} weight="bold" />
                                    </div>
                                    <div className="w-px h-3 bg-white/20" />
                                    <span className="text-white/90">{label}</span>
                                  </div>
                                  <span className="text-[#52C41A] font-mono">{pageNo}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Right Column: Metadata Cards (Reduced Spacing Gap) */}
                          <div className="col-span-5 flex flex-col justify-start pt-12 gap-3">

                            {/* Project Name */}
                            <div className="bg-white border border-gray-100 rounded-xl p-2 shadow-sm flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-[#52C41A] shrink-0">
                                <FileText size={12} weight="bold" />
                              </div>
                              <div>
                                <span className="text-[6.5px] text-gray-400 font-bold block leading-none">Project Name</span>
                                <span className="text-[8.5px] text-[#143e1d] font-black leading-tight block mt-0.5">{tocProjectName}</span>
                              </div>
                            </div>

                            {/* Project Date */}
                            <div className="bg-white border border-gray-100 rounded-xl p-2 shadow-sm flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-[#52C41A] shrink-0">
                                <Clock size={12} weight="bold" />
                              </div>
                              <div>
                                <span className="text-[6.5px] text-gray-400 font-bold block leading-none">Project Phase</span>
                                <span className="text-[8.5px] text-[#143e1d] font-black leading-tight block mt-0.5">{tocPhase}</span>
                              </div>
                            </div>

                            {/* Client Name */}
                            <div className="bg-white border border-gray-100 rounded-xl p-2 shadow-sm flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-[#52C41A] shrink-0">
                                <Clock size={12} weight="bold" />
                              </div>
                              <div>
                                <span className="text-[6.5px] text-gray-400 font-bold block leading-none">Client Status</span>
                                <span className="text-[8.5px] text-emerald-500 font-black leading-tight block mt-0.5">• {tocStatus}</span>
                              </div>
                            </div>

                            {/* Company Name */}
                            <div className="bg-white border border-gray-100 rounded-xl p-2 shadow-sm flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-[#52C41A] shrink-0">
                                <SquaresFour size={12} weight="bold" />
                              </div>
                              <div>
                                <span className="text-[6.5px] text-gray-400 font-bold block leading-none">Company Name</span>
                                <span className="text-[8.5px] text-[#143e1d] font-black leading-tight block mt-0.5">Cyberlim</span>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Curved Dark Green Wave Footer */}
                        <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-[#082a13] z-10" style={{ borderRadius: "100% 100% 0 0 / 25% 25% 0 0" }}>
                          <div className="absolute top-[28%] left-6 flex items-center justify-between right-6">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded border border-[#52C41A] flex items-center justify-center bg-white/5">
                                <svg className="w-3.5 h-3.5 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-[8.5px] font-black text-white leading-none">Building Solutions.</h5>
                                <h5 className="text-[8.5px] font-black text-white leading-none mt-0.5">Delivering <span className="text-[#52C41A]">Success.</span></h5>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-[7.5px] text-gray-400 font-bold">
                              <button onClick={(e) => handleRemovePage("intro", e)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                                <Trash size={10} /> Delete Page
                              </button>
                              <span>Page {pageIdx + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Executive Summary A4 Page */}
                    {pageId === "summary" && (
                      <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden flex flex-col font-sans select-none">
                        {/* Top Left Green Pill */}
                        <div className="absolute top-0 left-6 w-4 h-16 bg-gradient-to-b from-[#52C41A] to-[#389E0D] rounded-b-full shadow-sm z-10" />

                        {/* Top Right Building Mask Window */}
                        <div className="absolute top-[-3%] right-[-5%] w-[180px] h-[180px] rounded-bl-[72px] rounded-tr-[24px] border-[5px] border-white overflow-hidden shadow-lg z-0">
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#bae6fd] via-[#e0f2fe] to-[#38bdf8] flex items-end">
                            <div className="absolute bottom-0 right-[40%] w-10 h-[90%] bg-gradient-to-t from-[#0284c7]/80 to-transparent skew-x-[-12deg]" />
                            <div className="absolute bottom-0 right-[15%] w-14 h-[95%] bg-gradient-to-t from-[#0369a1]/70 to-[#0284c7]/20 skew-x-[-12deg] border-r border-white/20" />
                            <div className="absolute bottom-0 right-[-10%] w-16 h-[100%] bg-gradient-to-t from-[#075985]/90 to-[#0369a1]/30 skew-x-[-12deg]" />
                          </div>
                        </div>

                        {/* Target badge in corner circle */}
                        <div className="absolute top-[12%] right-[12%] w-11 h-11 rounded-full bg-gradient-to-br from-[#73d13d] to-[#389e0d] p-0.5 shadow-md z-10 border-[2.5px] border-white flex items-center justify-center">
                          <div className="w-full h-full rounded-full border border-white/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="6" />
                              <circle cx="12" cy="12" r="2" />
                            </svg>
                          </div>
                        </div>

                        {/* Logo & Branding */}
                        <div className="absolute top-6 left-12 flex items-center gap-1.5 z-10">
                          <div className="w-5.5 h-5.5 rounded bg-gradient-to-br from-[#52C41A] to-[#389E0D] flex items-center justify-center shadow-sm">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-[12px] font-black text-[#1f2937] tracking-tight">Cyberlim</span>
                        </div>

                        {/* Title block */}
                        <div className="absolute top-[82px] left-6 right-6 z-10 space-y-0.5">
                          <h1 style={{ fontSize: `${summaryTitleSize - 8}px` }} className="font-black text-[#143e1d] leading-none tracking-tight">{summaryMainTitle}</h1>
                          <h2 style={{ fontSize: `${summaryTitleSize}px` }} className="font-black text-[#52C41A] leading-none tracking-tight">{summarySubTitle}</h2>
                          <div className="flex items-center gap-1 pt-0.5">
                            <div className="w-12 h-1 bg-[#52c41a] rounded-full" />
                            <div className="w-1 h-1 bg-[#52c41a] rounded-full" />
                          </div>
                        </div>

                        {/* Executive Summary Main Intro */}
                        <div className="absolute top-[168px] left-6 right-[25%] z-10">
                          <p style={{ fontSize: `${summaryDescSize}px` }} className="leading-snug text-gray-500 font-medium">
                            {summaryDesc}
                          </p>
                        </div>

                        {/* Highlighted Banner Card */}
                        <div className="absolute top-[228px] left-6 right-6 bg-emerald-500/[0.03] border border-[#52C41A]/20 rounded-xl p-1.5 flex items-start gap-2 h-[68px] overflow-hidden z-10">
                          <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-b from-[#52C41A] to-[#389E0D] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <p style={{ fontSize: `${summaryDescSize}px` }} className="leading-normal text-[#143e1d] font-bold">
                              {summarySlogan}
                            </p>
                          </div>
                        </div>

                        {/* Strengths Heading */}
                        <div className="absolute top-[312px] left-6 right-6 z-10 flex items-center gap-2 justify-center">
                          <div className="w-8 h-[1px] bg-[#52C41A]/30" />
                          <h3 className="text-[9px] font-black text-[#143e1d] uppercase tracking-wider text-center">
                            Our <span className="text-[#52C41A]">Core Strengths</span>
                          </h3>
                          <div className="w-8 h-[1px] bg-[#52C41A]/30" />
                        </div>

                        {/* Core Strengths Grid (4 Cards) */}
                        <div className="absolute top-[336px] h-[92px] left-6 right-6 z-10 grid grid-cols-2 gap-2">
                          {/* Strength 1 */}
                          <div className="bg-white border border-gray-100 rounded-xl p-1.5 h-[42px] shadow-sm flex items-center gap-1.5 relative">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-[#52C41A]/20 flex items-center justify-center text-[#52C41A] shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-[7.5px] text-[#143e1d] font-black leading-tight block">End-to-end Solutions</span>
                              <span className="text-[6px] text-gray-400 font-bold block leading-none mt-0.5">IT support plan to deploy.</span>
                            </div>
                            <span className="absolute top-1 right-2 text-[6.5px] text-[#52C41A] font-black font-mono">01</span>
                          </div>

                          {/* Strength 2 */}
                          <div className="bg-white border border-gray-100 rounded-xl p-1.5 h-[42px] shadow-sm flex items-center gap-1.5 relative">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-[#52C41A]/20 flex items-center justify-center text-[#52C41A] shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11M5 11V9a2 2 0 012-2h2m2 4h.01M17 16l4 4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-[7.5px] text-[#143e1d] font-black leading-tight block">Client-First Approach</span>
                              <span className="text-[6px] text-gray-400 font-bold block leading-none mt-0.5">IT support plan to deploy.</span>
                            </div>
                            <span className="absolute top-1 right-2 text-[6.5px] text-[#52C41A] font-black font-mono">02</span>
                          </div>

                          {/* Strength 3 */}
                          <div className="bg-white border border-gray-100 rounded-xl p-1.5 h-[42px] shadow-sm flex items-center gap-1.5 relative">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-[#52C41A]/20 flex items-center justify-center text-[#52C41A] shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-[7.5px] text-[#143e1d] font-black leading-tight block">Commitment to Quality</span>
                              <span className="text-[6px] text-gray-400 font-bold block leading-none mt-0.5">IT support plan to deploy.</span>
                            </div>
                            <span className="absolute top-1 right-2 text-[6.5px] text-[#52C41A] font-black font-mono">03</span>
                          </div>

                          {/* Strength 4 */}
                          <div className="bg-white border border-gray-100 rounded-xl p-1.5 h-[42px] shadow-sm flex items-center gap-1.5 relative">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-[#52C41A]/20 flex items-center justify-center text-[#52C41A] shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-[7.5px] text-[#143e1d] font-black leading-tight block">Growth-Driven Innovation</span>
                              <span className="text-[6px] text-gray-400 font-bold block leading-none mt-0.5">IT support plan to deploy.</span>
                            </div>
                            <span className="absolute top-1 right-2 text-[6.5px] text-[#52C41A] font-black font-mono">04</span>
                          </div>
                        </div>

                        {/* Curved Dark Green Wave Footer */}
                        <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-[#082a13] z-10" style={{ borderRadius: "100% 100% 0 0 / 25% 25% 0 0" }}>
                          <div className="absolute top-[28%] left-6 flex items-center justify-between right-6">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded border border-[#52C41A] flex items-center justify-center bg-white/5">
                                <svg className="w-3.5 h-3.5 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-[8.5px] font-black text-white leading-none">Building Solutions.</h5>
                                <h5 className="text-[8.5px] font-black text-white leading-none mt-0.5">Delivering <span className="text-[#52C41A]">Success.</span></h5>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-[7.5px] text-gray-400 font-bold">
                              <button onClick={(e) => handleRemovePage("summary", e)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                                <Trash size={10} /> Delete Page
                              </button>
                              <span>Page {pageIdx + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* About Us A4 Page */}
                    {pageId === "about" && (
                      <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden flex flex-col font-sans select-none">
                        {/* Top Left Green Pill */}
                        <div className="absolute top-0 left-6 w-4 h-16 bg-gradient-to-b from-[#52C41A] to-[#389E0D] rounded-b-full shadow-sm z-10" />

                        {/* Top Right Building Mask Window */}
                        <div className="absolute top-[-3%] right-[-5%] w-[180px] h-[180px] rounded-bl-[72px] rounded-tr-[24px] border-[5px] border-white overflow-hidden shadow-lg z-0">
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#bae6fd] via-[#e0f2fe] to-[#38bdf8] flex items-end">
                            <div className="absolute bottom-0 right-[40%] w-10 h-[90%] bg-gradient-to-t from-[#0284c7]/80 to-transparent skew-x-[-12deg]" />
                            <div className="absolute bottom-0 right-[15%] w-14 h-[95%] bg-gradient-to-t from-[#0369a1]/70 to-[#0284c7]/20 skew-x-[-12deg] border-r border-white/20" />
                            <div className="absolute bottom-0 right-[-10%] w-16 h-[100%] bg-gradient-to-t from-[#075985]/90 to-[#0369a1]/30 skew-x-[-12deg]" />
                          </div>
                        </div>

                        {/* Users badge in corner circle */}
                        <div className="absolute top-[12%] right-[12%] w-11 h-11 rounded-full bg-gradient-to-br from-[#73d13d] to-[#389e0d] p-0.5 shadow-md z-10 border-[2.5px] border-white flex items-center justify-center">
                          <div className="w-full h-full rounded-full border border-white/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                        </div>

                        {/* Logo & Branding */}
                        <div className="absolute top-6 left-12 flex items-center gap-1.5 z-10">
                          <div className="w-5.5 h-5.5 rounded bg-gradient-to-br from-[#52C41A] to-[#389E0D] flex items-center justify-center shadow-sm">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-[12px] font-black text-[#1f2937] tracking-tight">Cyberlim</span>
                        </div>

                        {/* Title block */}
                        <div className="absolute top-[62px] left-6 right-6 z-10 space-y-0.5">
                          <h1 className="text-[18px] font-black text-[#143e1d] leading-none tracking-tight">About</h1>
                          <h2 className="text-[26px] font-black text-[#52C41A] leading-none tracking-tight">Us</h2>
                          <div className="flex items-center gap-1 pt-0.5">
                            <div className="w-12 h-1 bg-[#52c41a] rounded-full" />
                            <div className="w-1 h-1 bg-[#52c41a] rounded-full" />
                          </div>
                        </div>

                        {/* About Us Sub Slogan & Description */}
                        <div className="absolute top-[128px] left-6 right-[25%] z-10 space-y-2">
                          <p style={{ fontSize: `${aboutSloganSize}px` }} className="leading-snug text-[#143e1d] font-black">
                            {aboutSlogan}
                          </p>
                          <p style={{ fontSize: `${aboutDescSize}px` }} className="leading-relaxed text-gray-500 font-medium">
                            {aboutDesc}
                          </p>
                        </div>

                        {/* 3 Metrics Cards Grid */}
                        <div style={{ top: `${aboutMetricsTop}px` }} className="absolute left-6 right-6 grid grid-cols-3 gap-2.5 z-10">
                          {/* Metric 1 */}
                          <div className="bg-white border border-gray-100 rounded-xl p-2 text-center shadow-sm space-y-1">
                            <div className="w-6 h-6 rounded-full bg-[#52C41A]/10 flex items-center justify-center mx-auto text-[#52C41A]">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-[13px] font-black text-[#143e1d] leading-none">{aboutS1Val}</h3>
                              <p className="text-[6.5px] text-gray-400 font-bold leading-none mt-1">{aboutS1Label}</p>
                            </div>
                          </div>

                          {/* Metric 2 */}
                          <div className="bg-white border border-gray-100 rounded-xl p-2 text-center shadow-sm space-y-1">
                            <div className="w-6 h-6 rounded-full bg-[#52C41A]/10 flex items-center justify-center mx-auto text-[#52C41A]">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-[13px] font-black text-[#143e1d] leading-none">{aboutS2Val}</h3>
                              <p className="text-[6.5px] text-gray-400 font-bold leading-none mt-1">{aboutS2Label}</p>
                            </div>
                          </div>

                          {/* Metric 3 */}
                          <div className="bg-white border border-gray-100 rounded-xl p-2 text-center shadow-sm space-y-1">
                            <div className="w-6 h-6 rounded-full bg-[#52C41A]/10 flex items-center justify-center mx-auto text-[#52C41A]">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-[13px] font-black text-[#143e1d] leading-none">{aboutS3Val}</h3>
                              <p className="text-[6.5px] text-gray-400 font-bold leading-none mt-1">{aboutS3Label}</p>
                            </div>
                          </div>
                        </div>

                        {/* Mission & Vision Horizontal Split card */}
                        <div style={{ top: `${aboutMissionTop}px` }} className="absolute left-6 right-6 bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm grid grid-cols-11 gap-1.5 z-10">
                          {/* Mission */}
                          <div className="col-span-5 flex items-start gap-2">
                            <div className="w-6.5 h-6.5 rounded-full bg-[#52C41A]/10 flex items-center justify-center text-[#52C41A] shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-[8px] font-black text-[#143e1d] uppercase leading-none">{aboutMissionTitle}</h4>
                              <p className="text-[6px] leading-relaxed text-gray-400 font-bold mt-1">
                                {aboutMissionText}
                              </p>
                            </div>
                          </div>

                          {/* Center Divider dot */}
                          <div className="col-span-1 flex items-center justify-center">
                            <div className="w-[1.5px] h-10 bg-gray-100 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" />
                            </div>
                          </div>

                          {/* Vision */}
                          <div className="col-span-5 flex items-start gap-2">
                            <div className="w-6.5 h-6.5 rounded-full bg-[#52C41A]/10 flex items-center justify-center text-[#52C41A] shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-[8px] font-black text-[#143e1d] uppercase leading-none">{aboutVisionTitle}</h4>
                              <p className="text-[6px] leading-relaxed text-gray-400 font-bold mt-1">
                                {aboutVisionText}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom quote banner block */}
                        <div style={{ top: `${aboutQuoteTop}px` }} className="absolute left-6 right-6 bg-gradient-to-r from-[#135200] to-[#092b11] text-white p-2.5 rounded-xl flex items-center justify-between border border-[#52C41A]/20 shadow-md z-10">
                          <div className="w-5 h-5 rounded-full bg-[#52C41A]/20 flex items-center justify-center text-white text-[9px] shrink-0 font-serif">“</div>
                          <p className="text-[7.5px] font-black tracking-wide text-center px-2 flex-grow italic text-[#d9f99d]">
                            &ldquo;{aboutQuoteText}&rdquo;
                          </p>
                          <div className="w-5 h-5 rounded-full bg-[#52C41A]/20 flex items-center justify-center text-white text-[9px] shrink-0 font-serif">”</div>
                        </div>

                        {/* Curved Dark Green Wave Footer */}
                        <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-[#082a13] z-10" style={{ borderRadius: "100% 100% 0 0 / 25% 25% 0 0" }}>
                          <div className="absolute top-[28%] left-6 flex items-center justify-between right-6">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded border border-[#52C41A] flex items-center justify-center bg-white/5">
                                <svg className="w-3.5 h-3.5 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-[8.5px] font-black text-white leading-none">Building Solutions.</h5>
                                <h5 className="text-[8.5px] font-black text-white leading-none mt-0.5">Delivering <span className="text-[#52C41A]">Success.</span></h5>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-[7.5px] text-gray-400 font-bold">
                              <button onClick={(e) => handleRemovePage("about", e)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                                <Trash size={10} /> Delete Page
                              </button>
                              <span>Page {pageIdx + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Services Overview A4 Page (Dark Theme) */}
                    {pageId === "services" && (
                      <div className="absolute inset-0 bg-[#070709] overflow-hidden flex flex-col font-sans select-none text-left">
                        {/* Premium Grid Pattern Layer */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

                        {/* Top Right Glowing Cyberlim Shield Graphics */}
                        <div className="absolute top-[-10px] right-[-10px] w-48 h-48 pointer-events-none z-0">
                          {/* Radial Glow */}
                          <div className="absolute inset-0 bg-[#52C41A]/10 rounded-full blur-3xl scale-75" />
                          <svg className="w-full h-full opacity-35" viewBox="0 0 100 100" fill="none">
                            <circle cx="50" cy="50" r="40" stroke="#52C41A" strokeWidth="0.5" strokeDasharray="3 3" />
                            <circle cx="50" cy="50" r="30" stroke="#52C41A" strokeWidth="0.25" />
                            <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" stroke="#52C41A" strokeWidth="0.75" />
                          </svg>
                          {/* Central Shield */}
                          <div className="absolute top-[35%] right-[35%] w-14 h-14 bg-gradient-to-b from-[#14532d] to-[#15803d]/40 rounded-xl flex items-center justify-center border border-[#52C41A]/30 shadow-lg">
                            <span className="text-[18px] text-white font-black tracking-tighter">C</span>
                          </div>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full p-6">
                          <div>
                            {/* Title Block */}
                            <div className="space-y-1 mb-4 pt-1">
                              <div className="flex items-center gap-1">
                                <h1 style={{ fontSize: `${servicesTitleSize}px` }} className="font-black text-white leading-none tracking-tight">{servicesHeadline}</h1>
                                <h2 style={{ fontSize: `${servicesTitleSize}px` }} className="font-black text-[#52C41A] leading-none tracking-tight">{servicesSubHeadline}</h2>
                              </div>
                              <div className="w-10 h-0.5 bg-[#52C41A] rounded-full" />
                              <p style={{ fontSize: `${servicesSloganSize}px` }} className="text-zinc-400 font-bold pt-1">
                                {servicesSlogan}
                              </p>
                            </div>

                            {/* 6 Services Grid */}
                            <div className="grid pt-24 grid-cols-2 gap-x-3 gap-y-2.5">
                              {[
                                {
                                  num: "01",
                                  title: "Mobile App Development",
                                  desc: "We specialize in creating beautiful, high-performance mobile applications for both iOS and Android.",
                                  icon: (
                                    <svg className="w-4 h-4 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                  )
                                },
                                {
                                  num: "02",
                                  title: "Website Development",
                                  desc: "From simple landing pages to complex web applications, our team builds fast, interactive, and responsive UI.",
                                  icon: (
                                    <svg className="w-4 h-4 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10m0-20a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10M2 12h20" />
                                    </svg>
                                  )
                                },
                                {
                                  num: "03",
                                  title: "Graphic Designing",
                                  desc: "Our graphic design services create stunning visuals that capture your brand's essence. From logos and branding.",
                                  icon: (
                                    <svg className="w-4 h-4 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  )
                                },
                                {
                                  num: "04",
                                  title: "UX & UI Designs",
                                  desc: "Good design is good business. Our UI/UX design process focuses on creating beautiful, human-centered interfaces.",
                                  icon: (
                                    <svg className="w-4 h-4 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                    </svg>
                                  )
                                },
                                {
                                  num: "05",
                                  title: "Digital Marketing Services",
                                  desc: "Our digital marketing services are designed to increase your online presence and drive measurable results.",
                                  icon: (
                                    <svg className="w-4 h-4 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                  )
                                },
                                {
                                  num: "06",
                                  title: "E-Commerce Solutions",
                                  desc: "We build powerful e-commerce solutions that drive sales and provide a seamless shopping experience for your customers.",
                                  icon: (
                                    <svg className="w-4 h-4 text-[#52C41A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                  )
                                }
                              ].map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-2 relative shadow-md flex gap-2">
                                  {/* Left Icon (Hexagon container) */}
                                  <div className="w-8 h-8 rounded-xl bg-[#52C41A]/10 border border-[#52C41A]/20 flex items-center justify-center shrink-0 mt-0.5">
                                    {item.icon}
                                  </div>
                                  <div className="space-y-0.5">
                                    <h4 className="text-[7.5px] font-black text-white leading-tight">{item.title}</h4>
                                    <div className="w-4 h-px bg-[#52C41A] my-0.5" />
                                    <p className="text-[6.2px] text-zinc-400 font-bold leading-normal">{item.desc}</p>
                                  </div>
                                  <span className="absolute top-2 right-2.5 text-[7px] text-[#52C41A]/40 font-mono font-black">{item.num}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bottom Callout Banner */}
                          <div className="space-y-2">
                            <div className="bg-[#143e1d]/20 border border-[#52C41A]/10 rounded-xl p-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#52C41A] flex items-center justify-center shadow-md">
                                  <span className="text-[12px] font-black text-[#082a13]">C</span>
                                </div>
                                <div>
                                  <h4 className="text-[8px] font-black text-white leading-none">Innovative Solutions. Measurable Results.</h4>
                                  <p className="text-[6.5px] text-[#52C41A] font-bold mt-0.5">Let's build the future together.</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-[6px] font-bold text-zinc-400">
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" /> Secure</span>
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" /> Scalable</span>
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" /> On-Time</span>
                              </div>
                            </div>

                            {/* Page Footer */}
                            <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[7px] text-zinc-500 font-bold">
                              <span>Services Overview &bull; Cyberlim</span>
                              <div className="flex items-center gap-4">
                                <button onClick={(e) => handleRemovePage("services", e)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                                  <Trash size={10} /> Delete Page
                                </button>
                                <span>Page {pageIdx + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Scope of Services A4 Page */}
                    {pageId.startsWith("scope") && (() => {
                      const currentScope = scopesData[pageId] || {
                        title: "Scope of Services",
                        blocks: [
                          {
                            type: "heading",
                            title: "Project Overview"
                          },
                          {
                            type: "points",
                            points: [
                              "Customer Website",
                              "Android Mobile App",
                              "Admin Dashboard",
                              "Payment Integration",
                              "Order Management System",
                              "Responsive Modern UI"
                            ]
                          },
                          {
                            type: "heading",
                            title: "Customer Features"
                          },
                          {
                            type: "desc",
                            text: "(Website + Android App) - Features:"
                          },
                          {
                            type: "table",
                            tableHeaders: ["Shopping Features", "Checkout Features"],
                            tableRows: [
                              ["Browse products", "Secure checkout"],
                              ["Search & filters", "UPI / Razorpay"],
                              ["Product categories", "Cash on Delivery"],
                              ["Product details page", "Coupon system"]
                            ]
                          }
                        ]
                      };

                      return (
                        <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden flex flex-col font-sans select-none p-6 text-left">
                          {/* Elegant background corner highlights */}
                          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#52C41A]/5 to-transparent rounded-br-full z-0" />
                          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#52C41A]/5 to-transparent rounded-tl-full z-0" />

                          <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                              {/* Main Scope of Services Heading */}
                              <div className="space-y-1 mb-4">
                                <h1 className="text-[20px] font-black text-[#143e1d] leading-none tracking-tight">{currentScope.title}</h1>
                                <div className="w-10 h-0.5 bg-[#52C41A] rounded-full" />
                              </div>

                              <div className="space-y-3.5 max-h-[380px] overflow-hidden">
                                {currentScope.blocks.map((block, bIdx) => {
                                  if (block.type === "heading") {
                                    return (
                                      <h3 key={bIdx} className="text-[9.5px] font-black text-[#143e1d] uppercase tracking-wider mt-1">
                                        {block.title}
                                      </h3>
                                    );
                                  }
                                  if (block.type === "desc") {
                                    return (
                                      <p key={bIdx} className="text-[7.2px] text-gray-500 font-bold leading-normal">
                                        {block.text}
                                      </p>
                                    );
                                  }
                                  if (block.type === "points") {
                                    return (
                                      <ul key={bIdx} className="space-y-0.5 pl-0.5">
                                        {(block.points || []).map((pt, pIdx) => (
                                          <li key={pIdx} className="flex items-center gap-1.5 text-[7px] font-semibold text-gray-600">
                                            <svg className="w-2.5 h-2.5 text-[#52C41A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {pt}
                                          </li>
                                        ))}
                                      </ul>
                                    );
                                  }
                                  if (block.type === "table") {
                                    return (
                                      <div key={bIdx} className="border border-gray-150 rounded-xl overflow-hidden shadow-sm bg-white mt-1">
                                        <table className="w-full text-left border-collapse">
                                          <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100 text-[6px] font-black text-gray-500 uppercase">
                                              {(block.tableHeaders || []).map((h, hIdx) => (
                                                <th key={hIdx} className="p-1 pl-2.5 last:pr-2.5">{h}</th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(block.tableRows || []).map((row, rIdx) => (
                                              <tr key={rIdx} className="border-b border-gray-100 last:border-none text-[6.5px] font-bold text-gray-600">
                                                {row.map((cell, cIdx) => (
                                                  <td key={cIdx} className="p-1 pl-2.5 last:pr-2.5">{cell}</td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </div>

                            {/* Page Footer */}
                            <div className="flex justify-between items-center border-t border-gray-150 pt-2 text-[7px] text-gray-400 font-bold">
                              <span>Scope of Services &bull; Cyberlim</span>
                              <div className="flex items-center gap-4">
                                <button onClick={(e) => handleRemovePage(pageId, e)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                                  <Trash size={10} /> Delete Page
                                </button>
                                <span>Page {pageIdx + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Pricing / Timeline A4 Page */}
                    {pageId === "pricing" && (
                      <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden flex flex-col font-sans select-none p-6 text-left">
                        {/* Top Left Green Pill */}
                        <div className="absolute top-0 left-6 w-4 h-16 bg-gradient-to-b from-[#52C41A] to-[#389E0D] rounded-b-full shadow-sm z-10" />

                        {/* Top Right Building Mask Window */}
                        <div className="absolute top-[-3%] right-[-5%] w-[180px] h-[180px] rounded-bl-[72px] rounded-tr-[24px] border-[5px] border-white overflow-hidden shadow-lg z-0">
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#bae6fd] via-[#e0f2fe] to-[#38bdf8] flex items-end">
                            <div className="absolute bottom-0 right-[40%] w-10 h-[90%] bg-gradient-to-t from-[#0284c7]/80 to-transparent skew-x-[-12deg]" />
                            <div className="absolute bottom-0 right-[15%] w-14 h-[95%] bg-gradient-to-t from-[#0369a1]/70 to-[#0284c7]/20 skew-x-[-12deg] border-r border-white/20" />
                            <div className="absolute bottom-0 right-[-10%] w-16 h-[100%] bg-gradient-to-t from-[#075985]/90 to-[#0369a1]/30 skew-x-[-12deg]" />
                          </div>
                        </div>

                        {/* Gear/checklist badge in corner circle */}
                        <div className="absolute top-[12%] right-[12%] w-11 h-11 rounded-full bg-gradient-to-br from-[#73d13d] to-[#389e0d] p-0.5 shadow-md z-10 border-[2.5px] border-white flex items-center justify-center">
                          <div className="w-full h-full rounded-full border border-white/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                          </div>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                          <div>
                            {/* Main Title Heading */}
                            <div className="space-y-1 mb-4 pt-16">
                              <h1 className="text-[20px] font-black text-[#143e1d] leading-none tracking-tight">{timelinePageTitle}</h1>
                              <div className="w-10 h-0.5 bg-[#52C41A] rounded-full" />
                            </div>

                            {/* Estimated Timeline Header */}
                            <div className="space-y-0.5 mb-2.5">
                              <h3 className="text-[10px] pt-8 font-black text-[#143e1d] uppercase tracking-wider">Estimated Timeline</h3>
                              <p className="text-[7px] text-gray-400 font-bold leading-tight">PhaseTimeline</p>
                            </div>

                            {/* Timeline deliverables table/list */}
                            <div className="space-y-1.5 border-b border-gray-150 pb-2 mb-2">
                              {timelineRows.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[7.5px] font-bold text-gray-600">
                                  <span>{item.name}</span>
                                  <span className="font-mono text-gray-400">{item.val}</span>
                                </div>
                              ))}
                              <div className="flex justify-between items-center text-[8px] font-black text-[#143e1d] pt-1">
                                <span>Total Timeline:</span>
                                <span>{timelineTotalVal}</span>
                              </div>
                            </div>

                            {/* Included features checkbox list */}
                            <div className="space-y-1">
                              <p className="text-[7.5px] text-gray-500 font-black uppercase tracking-wide">Included:</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-0.5">
                                {timelineIncluded.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[7px] font-semibold text-gray-600">
                                    <svg className="w-2.5 h-2.5 text-[#52C41A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Base Package Cost Horizontal Pill and Page footer */}
                          <div className="space-y-2">
                            <div className="text-right">
                              <span className="text-[9px] font-black text-[#143e1d] uppercase tracking-wider mr-4">Base Package Cost</span>
                              <div className="bg-gradient-to-r from-[#b5f5ec] via-[#d3f9d8] to-[#95de64] p-1.5 rounded-full flex items-center justify-between shadow-md border border-[#52C41A]/30">
                                <div className="w-6.5 h-6.5 rounded-full bg-white flex items-center justify-center text-[#52C41A] shadow-sm">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20a1 1 0 001-1v-2.586a1 1 0 01.293-.707l7.586-7.586a1 1 0 000-1.414L11.586 3.414a1 1 0 00-1.414 0L2.586 11.000a1 1 0 00-.293.707V19a1 1 0 001 1h3z" />
                                  </svg>
                                </div>
                                <span className="text-[13px] font-black text-[#143e1d] pr-4">{timelineBaseCost}</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-gray-150 pt-2 text-[7px] text-gray-400 font-bold">
                              <span>Estimated Timeline & Cost &bull; Cyberlim</span>
                              <div className="flex items-center gap-4">
                                <button onClick={(e) => handleRemovePage("pricing", e)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                                  <Trash size={10} /> Delete Page
                                </button>
                                <span>Page {pageIdx + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tech Stack & Payment A4 Page */}
                    {pageId === "tech" && (
                      <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden flex flex-col font-sans select-none p-6 text-left">
                        {/* Elegant background corner highlights */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#52C41A]/5 to-transparent rounded-br-full z-0" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#52C41A]/5 to-transparent rounded-tl-full z-0" />

                        <div className="relative z-10 flex flex-col justify-between h-full">
                          <div>
                            {/* Main Title Heading & Isometric Stack Graphics */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-0.5">
                                <h1 className="text-[17px] font-black text-[#143e1d] leading-none tracking-tight">TECHNOLOGY</h1>
                                <h2 className="text-[24px] font-black text-[#52C41A] leading-none tracking-tight">STACK</h2>
                                <p className="text-[6.5px] text-gray-400 font-bold max-w-[150px] leading-tight pt-1">
                                  We use modern, reliable and scalable technologies to build secure and high-performance solutions.
                                </p>
                              </div>

                              {/* Small 3D Isometric Stack Representation */}
                              <div className="relative w-20 h-16 shrink-0 mt-[-10px] mr-1">
                                <div className="absolute top-1 left-3 text-[9px] text-[#52C41A] font-black font-mono bg-white border border-[#52C41A]/10 px-1 py-0.5 rounded shadow-sm z-10">&lt;/&gt;</div>
                                <div className="absolute bottom-0 left-4 w-12 h-6 bg-gradient-to-t from-[#14532d] to-[#15803d] rounded-[30%] skew-x-[-15deg] shadow-md border-b-2 border-[#166534]" />
                                <div className="absolute bottom-2 left-4 w-12 h-6 bg-gradient-to-t from-[#166534] to-[#22c55e]/60 rounded-[30%] skew-x-[-15deg] shadow-md border-b-2 border-[#15803d]" />
                                <div className="absolute bottom-4 left-4 w-12 h-6 bg-gradient-to-t from-[#22c55e]/70 to-[#4ade80]/90 rounded-[30%] skew-x-[-15deg] shadow-md flex items-center justify-center border-b-2 border-[#16a34a]">
                                  <span className="text-[8px] text-white font-black font-mono">&lt;/&gt;</span>
                                </div>
                              </div>
                            </div>

                            {/* Tech Stack Components Grid */}
                            <div className="grid grid-cols-12 gap-2 mb-3">
                              {/* Left Stack Side */}
                              <div className="col-span-8 grid grid-cols-2 gap-1.5">
                                {/* Nextjs */}
                                <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-1.5 shadow-sm h-[32px]">
                                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-black shrink-0">N</div>
                                  <div>
                                    <span className="text-[7px] text-[#143e1d] font-black block leading-none">Frontend</span>
                                    <span className="text-[6.5px] text-gray-500 font-bold block mt-0.5">Next.js</span>
                                  </div>
                                </div>

                                {/* Reactjs */}
                                <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-1.5 shadow-sm h-[32px]">
                                  <div className="w-5 h-5 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 shrink-0 text-[10px]">⚛</div>
                                  <div>
                                    <span className="text-[7px] text-[#143e1d] font-black block leading-none">Frontend</span>
                                    <span className="text-[6.5px] text-gray-500 font-bold block mt-0.5">React.js</span>
                                  </div>
                                </div>

                                {/* Nodejs */}
                                <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-1.5 shadow-sm h-[32px]">
                                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-emerald-600 shrink-0 text-[7px] font-black">node</div>
                                  <div>
                                    <span className="text-[7px] text-[#143e1d] font-black block leading-none">Backend</span>
                                    <span className="text-[6.5px] text-gray-500 font-bold block mt-0.5">Node.js + Express</span>
                                  </div>
                                </div>

                                {/* Hosting */}
                                <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-1.5 shadow-sm h-[32px]">
                                  <div className="w-5 h-5 rounded bg-emerald-50 border border-[#52C41A]/20 flex items-center justify-center text-[#52C41A] shrink-0">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h.01M17 7h.01" />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-[7px] text-[#143e1d] font-black block leading-none">Hosting</span>
                                    <span className="text-[6px] text-gray-500 font-bold block mt-0.5">VPS / Hostinger / AWS</span>
                                  </div>
                                </div>
                              </div>

                              {/* Mobile Stack Right */}
                              <div className="col-span-4 flex flex-col gap-1.5">
                                {/* Mobile app */}
                                <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-1.5 shadow-sm h-[32px]">
                                  <div className="w-5 h-5 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 shrink-0 text-[10px]">⚛</div>
                                  <div>
                                    <span className="text-[7px] text-[#143e1d] font-black block leading-none">Mobile App</span>
                                    <span className="text-[6.5px] text-gray-500 font-bold block mt-0.5">React Native / Flutter</span>
                                  </div>
                                </div>

                                {/* Database */}
                                <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-1.5 shadow-sm h-[32px]">
                                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[#52C41A] shrink-0 text-[9px]">🍃</div>
                                  <div>
                                    <span className="text-[7px] text-[#143e1d] font-black block leading-none">Database</span>
                                    <span className="text-[6.5px] text-gray-500 font-bold block mt-0.5">MongoDB</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Firebase Center Loop Banner */}
                            <div className="bg-white border border-gray-100 rounded-xl p-2 shadow-sm flex items-center justify-between mb-4 border-l-4 border-l-[#52C41A]">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 text-xs shrink-0">🔥</div>
                                <div>
                                  <span className="text-[8px] text-[#143e1d] font-black block leading-none">Firebase Integrations</span>
                                  <span className="text-[6.5px] text-gray-400 font-bold leading-none block mt-1">Realtime sync, authentication, and dispatch</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-[6.5px] font-bold text-gray-500">
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" /> Realtime Auth</span>
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" /> Push Notifications</span>
                              </div>
                            </div>

                            {/* PAYMENT TERMS Section */}
                            <div className="border-t border-gray-150 pt-3">
                              <div className="grid grid-cols-12 gap-4">
                                {/* Left Terms description */}
                                <div className="col-span-4 space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-6 h-6 rounded bg-gradient-to-b from-[#52C41A] to-[#389E0D] flex items-center justify-center text-white shrink-0">
                                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                      </svg>
                                    </div>
                                    <h3 className="text-[10px] font-black text-[#143e1d] uppercase tracking-wider">Payment Terms</h3>
                                  </div>
                                  <p className="text-[6.5px] text-gray-400 font-bold leading-relaxed">
                                    We follow a transparent and milestone-based payment process for smooth collaboration and project delivery.
                                  </p>
                                </div>

                                {/* Right Milestones cards list */}
                                <div className="col-span-8 space-y-1.5">
                                  {/* Milestone 1 */}
                                  <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-2 relative shadow-sm">
                                    <div className="w-12 h-6 rounded-full bg-[#52C41A]/10 flex items-center justify-center text-[#52C41A] shrink-0 font-mono text-[10px] font-black">
                                      40%
                                    </div>
                                    <div>
                                      <span className="text-[7.5px] text-[#143e1d] font-black leading-none block">Advance Payment</span>
                                      <span className="text-[6px] text-gray-400 font-bold block mt-0.5">40% to initiate the project wireframes.</span>
                                    </div>
                                    <span className="absolute top-1.5 right-2 text-[6.5px] text-gray-300 font-bold">Milestone 1</span>
                                  </div>

                                  {/* Milestone 2 */}
                                  <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-2 relative shadow-sm">
                                    <div className="w-12 h-6 rounded-full bg-[#52C41A]/10 flex items-center justify-center text-[#52C41A] shrink-0 font-mono text-[10px] font-black">
                                      30%
                                    </div>
                                    <div>
                                      <span className="text-[7.5px] text-[#143e1d] font-black leading-none block">During Development</span>
                                      <span className="text-[6px] text-gray-400 font-bold block mt-0.5">30% upon frontend API integration milestone completion.</span>
                                    </div>
                                    <span className="absolute top-1.5 right-2 text-[6.5px] text-gray-300 font-bold">Milestone 2</span>
                                  </div>

                                  {/* Milestone 3 */}
                                  <div className="bg-white border border-gray-100 rounded-xl p-1.5 flex items-center gap-2 relative shadow-sm">
                                    <div className="w-12 h-6 rounded-full bg-[#52C41A]/10 flex items-center justify-center text-[#52C41A] shrink-0 font-mono text-[10px] font-black">
                                      30%
                                    </div>
                                    <div>
                                      <span className="text-[7.5px] text-[#143e1d] font-black leading-none block">Before Final Delivery</span>
                                      <span className="text-[6px] text-gray-400 font-bold block mt-0.5">30% before staging migration and handover.</span>
                                    </div>
                                    <span className="absolute top-1.5 right-2 text-[6.5px] text-gray-300 font-bold">Milestone 3</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer with status badges and page indices */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center border-t border-gray-150 pt-2 text-[7px] text-gray-400 font-bold">
                              <span>Technology & Payment Terms &bull; Cyberlim</span>
                              <div className="flex items-center gap-4">
                                <button onClick={(e) => handleRemovePage("tech", e)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                                  <Trash size={10} /> Delete Page
                                </button>
                                <span>Page {pageIdx + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Style Inspector Panel */}
              <div className={`w-80 border-l flex flex-col z-10 ${theme === "dark" ? "bg-[#111115] border-white/5" : "bg-white border-zinc-200"
                }`}>
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <PaintBrush size={14} className="text-[#8b6cf6]" /> Style Inspector
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Edit properties of selected element</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Selected Page Info */}
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[8px] text-purple-400 font-black uppercase font-mono">Editing Target</span>
                    <h5 className="text-[11px] font-black uppercase text-zinc-200">{selectedElement} Page</h5>
                  </div>

                  {/* Margins/Padding */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] uppercase font-black tracking-widest text-zinc-400">Page Layout</h4>
                    <div className="relative border border-zinc-700/50 rounded-xl p-3 bg-zinc-950/20 text-center text-[9px] font-bold text-zinc-500">
                      <div className="mb-2">A4 Document Standard</div>
                      <div className="flex justify-between items-center px-4 mb-2">
                        <span>L: 12%</span>
                        <div className="border border-purple-500/30 rounded-lg p-2 bg-purple-500/5 text-purple-400 w-24 text-center">
                          A4 Print Safe
                        </div>
                        <span>R: 12%</span>
                      </div>
                      <div>T: 12% / B: 12%</div>
                    </div>
                  </div>

                  {/* Typography & Dynamic Content Controls */}
                  <div className="space-y-4 border-t border-white/5 pt-4">
                    <h4 className="text-[9px] uppercase font-black tracking-widest text-zinc-400">Content Editor</h4>

                    {/* Cover Page Edit controls */}
                    {selectedElement === "cover" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[8px] text-purple-400 font-black uppercase block mb-1">Company Branding Name</label>
                          <input
                            type="text"
                            value={coverCompanyName}
                            onChange={e => setCoverCompanyName(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Title</label>
                          <input
                            type="text"
                            value={coverTitle}
                            onChange={e => setCoverTitle(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Title Font Size ({coverTitleSize}px)</label>
                          <input
                            type="range"
                            min="14"
                            max="36"
                            value={coverTitleSize}
                            onChange={e => setCoverTitleSize(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={coverSubtitle}
                            onChange={e => setCoverSubtitle(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Subtitle Font Size ({coverSubSize}px)</label>
                          <input
                            type="range"
                            min="6"
                            max="18"
                            value={coverSubSize}
                            onChange={e => setCoverSubSize(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-purple-400 font-black uppercase block mb-1">Description Paragraph</label>
                          <textarea
                            value={coverDesc}
                            onChange={e => setCoverDesc(e.target.value)}
                            rows={3}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* Cover features */}
                        <div className="border-t border-white/5 pt-3.5 space-y-2">
                          <span className="text-[8px] text-purple-400 font-black uppercase font-mono block">Features Cards</span>
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={coverF1Title}
                              onChange={e => setCoverF1Title(e.target.value)}
                              placeholder="F1 Title"
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-3 text-[9px] text-zinc-200 outline-none"
                            />
                            <input
                              type="text"
                              value={coverF1Sub}
                              onChange={e => setCoverF1Sub(e.target.value)}
                              placeholder="F1 Subtitle"
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-3 text-[9px] text-zinc-400 outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={coverF2Title}
                              onChange={e => setCoverF2Title(e.target.value)}
                              placeholder="F2 Title"
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-3 text-[9px] text-zinc-200 outline-none"
                            />
                            <input
                              type="text"
                              value={coverF2Sub}
                              onChange={e => setCoverF2Sub(e.target.value)}
                              placeholder="F2 Subtitle"
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-3 text-[9px] text-zinc-400 outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={coverF3Title}
                              onChange={e => setCoverF3Title(e.target.value)}
                              placeholder="F3 Title"
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-3 text-[9px] text-zinc-200 outline-none"
                            />
                            <input
                              type="text"
                              value={coverF3Sub}
                              onChange={e => setCoverF3Sub(e.target.value)}
                              placeholder="F3 Subtitle"
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-3 text-[9px] text-zinc-400 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Table of Contents Edit controls */}
                    {selectedElement === "intro" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Page Title</label>
                          <input
                            type="text"
                            value={tocTitle}
                            onChange={e => setTocTitle(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Project Name</label>
                          <input
                            type="text"
                            value={tocProjectName}
                            onChange={e => setTocProjectName(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Project Phase</label>
                          <input
                            type="text"
                            value={tocPhase}
                            onChange={e => setTocPhase(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Client Status</label>
                          <input
                            type="text"
                            value={tocStatus}
                            onChange={e => setTocStatus(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* TOC section list */}
                        <div className="border-t border-white/5 pt-3.5 space-y-2">
                          <span className="text-[8px] text-purple-400 font-black uppercase font-mono block">Section Points</span>
                          {tocPoints.map((label, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-[8px] font-mono text-zinc-500">{(idx + 1).toString().padStart(2, "0")}</span>
                              <input
                                type="text"
                                value={label}
                                onChange={e => {
                                  const updated = [...tocPoints];
                                  updated[idx] = e.target.value;
                                  setTocPoints(updated);
                                }}
                                className="flex-1 bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Executive Summary Edit controls */}
                    {selectedElement === "summary" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Header Part 1</label>
                          <input
                            type="text"
                            value={summaryMainTitle}
                            onChange={e => setSummaryMainTitle(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Header Part 2</label>
                          <input
                            type="text"
                            value={summarySubTitle}
                            onChange={e => setSummarySubTitle(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Title Font Size ({summaryTitleSize}px)</label>
                          <input
                            type="range"
                            min="16"
                            max="36"
                            value={summaryTitleSize}
                            onChange={e => setSummaryTitleSize(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Highlight Slogan</label>
                          <textarea
                            value={summarySlogan}
                            onChange={e => setSummarySlogan(e.target.value)}
                            rows={2}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Description Paragraph</label>
                          <textarea
                            value={summaryDesc}
                            onChange={e => setSummaryDesc(e.target.value)}
                            rows={3}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Text Font Size ({summaryDescSize}px)</label>
                          <input
                            type="range"
                            min="5"
                            max="12"
                            step="0.5"
                            value={summaryDescSize}
                            onChange={e => setSummaryDescSize(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* About Us Edit controls */}
                    {selectedElement === "about" && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Hero Slogan</label>
                            <textarea
                              value={aboutSlogan}
                              onChange={e => setAboutSlogan(e.target.value)}
                              rows={2}
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Slogan Font Size ({aboutSloganSize}px)</label>
                            <input
                              type="range"
                              min="6"
                              max="16"
                              value={aboutSloganSize}
                              onChange={e => setAboutSloganSize(Number(e.target.value))}
                              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">About Description</label>
                            <textarea
                              value={aboutDesc}
                              onChange={e => setAboutDesc(e.target.value)}
                              rows={4}
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Description Font Size ({aboutDescSize}px)</label>
                            <input
                              type="range"
                              min="5"
                              max="12"
                              step="0.5"
                              value={aboutDescSize}
                              onChange={e => setAboutDescSize(Number(e.target.value))}
                              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                          </div>
                        </div>

                        {/* About Us Stats Cards */}
                        <div className="border-t border-white/5 pt-3.5 space-y-3">
                          <span className="text-[8px] text-purple-400 font-black uppercase font-mono block">Metrics Data Stats</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[7.5px] text-zinc-500 block mb-0.5">Stat 1 Value</label>
                              <input type="text" value={aboutS1Val} onChange={e => setAboutS1Val(e.target.value)} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none" />
                            </div>
                            <div>
                              <label className="text-[7.5px] text-zinc-500 block mb-0.5">Stat 1 Label</label>
                              <input type="text" value={aboutS1Label} onChange={e => setAboutS1Label(e.target.value)} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[7.5px] text-zinc-500 block mb-0.5">Stat 2 Value</label>
                              <input type="text" value={aboutS2Val} onChange={e => setAboutS2Val(e.target.value)} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none" />
                            </div>
                            <div>
                              <label className="text-[7.5px] text-zinc-500 block mb-0.5">Stat 2 Label</label>
                              <input type="text" value={aboutS2Label} onChange={e => setAboutS2Label(e.target.value)} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[7.5px] text-zinc-500 block mb-0.5">Stat 3 Value</label>
                              <input type="text" value={aboutS3Val} onChange={e => setAboutS3Val(e.target.value)} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none" />
                            </div>
                            <div>
                              <label className="text-[7.5px] text-zinc-500 block mb-0.5">Stat 3 Label</label>
                              <input type="text" value={aboutS3Label} onChange={e => setAboutS3Label(e.target.value)} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none" />
                            </div>
                          </div>
                        </div>

                        {/* Mission & Vision text */}
                        <div className="border-t border-white/5 pt-3.5 space-y-3">
                          <span className="text-[8px] text-purple-400 font-black uppercase font-mono block">Mission & Vision</span>
                          <div>
                            <label className="text-[7.5px] text-zinc-500 block mb-0.5">Mission Title</label>
                            <input type="text" value={aboutMissionTitle} onChange={e => setAboutMissionTitle(e.target.value)} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none" />
                          </div>
                          <div>
                            <label className="text-[7.5px] text-zinc-500 block mb-0.5">Mission Text</label>
                            <textarea value={aboutMissionText} onChange={e => setAboutMissionText(e.target.value)} rows={2} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none" />
                          </div>
                          <div>
                            <label className="text-[7.5px] text-zinc-500 block mb-0.5">Vision Title</label>
                            <input type="text" value={aboutVisionTitle} onChange={e => setAboutVisionTitle(e.target.value)} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none" />
                          </div>
                          <div>
                            <label className="text-[7.5px] text-zinc-500 block mb-0.5">Vision Text</label>
                            <textarea value={aboutVisionText} onChange={e => setAboutVisionText(e.target.value)} rows={2} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none" />
                          </div>
                          <div>
                            <label className="text-[7.5px] text-zinc-500 block mb-0.5">Quote Banner Quote Text</label>
                            <textarea value={aboutQuoteText} onChange={e => setAboutQuoteText(e.target.value)} rows={2} className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none" />
                          </div>
                        </div>

                        {/* Section alignment coordinates sliders */}
                        <div className="border-t border-white/5 pt-3.5 space-y-3">
                          <span className="text-[8px] text-purple-400 font-black uppercase font-mono block">Spacing Gaps (Top Offsets)</span>
                          <div>
                            <label className="text-[7.5px] text-zinc-500 block mb-0.5">Metrics Grid position ({aboutMetricsTop}px)</label>
                            <input
                              type="range"
                              min="180"
                              max="260"
                              value={aboutMetricsTop}
                              onChange={e => setAboutMetricsTop(Number(e.target.value))}
                              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                          </div>
                          <div>
                            <label className="text-[7.5px] text-zinc-500 block mb-0.5">Mission Split position ({aboutMissionTop}px)</label>
                            <input
                              type="range"
                              min="250"
                              max="350"
                              value={aboutMissionTop}
                              onChange={e => setAboutMissionTop(Number(e.target.value))}
                              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                          </div>
                          <div>
                            <label className="text-[7.5px] text-zinc-500 block mb-0.5">Quote Card position ({aboutQuoteTop}px)</label>
                            <input
                              type="range"
                              min="340"
                              max="440"
                              value={aboutQuoteTop}
                              onChange={e => setAboutQuoteTop(Number(e.target.value))}
                              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Services Overview Edit controls */}
                    {selectedElement === "services" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Header 1</label>
                            <input
                              type="text"
                              value={servicesHeadline}
                              onChange={e => setServicesHeadline(e.target.value)}
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Header 2</label>
                            <input
                              type="text"
                              value={servicesSubHeadline}
                              onChange={e => setServicesSubHeadline(e.target.value)}
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Title Size ({servicesTitleSize}px)</label>
                          <input
                            type="range"
                            min="14"
                            max="30"
                            value={servicesTitleSize}
                            onChange={e => setServicesTitleSize(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Services Slogan</label>
                          <textarea
                            value={servicesSlogan}
                            onChange={e => setServicesSlogan(e.target.value)}
                            rows={3}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Slogan Size ({servicesSloganSize}px)</label>
                          <input
                            type="range"
                            min="5"
                            max="12"
                            value={servicesSloganSize}
                            onChange={e => setServicesSloganSize(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Scope of Services Edit controls */}
                    {selectedElement && selectedElement.startsWith("scope") && (() => {
                      const sId = selectedElement as string;
                      const currentScope = scopesData[sId] || {
                        title: "Scope of Services",
                        blocks: [
                          {
                            type: "heading",
                            title: "Project Overview"
                          },
                          {
                            type: "points",
                            points: [
                              "Customer Website",
                              "Android Mobile App",
                              "Admin Dashboard",
                              "Payment Integration",
                              "Order Management System",
                              "Responsive Modern UI"
                            ]
                          },
                          {
                            type: "heading",
                            title: "Customer Features"
                          },
                          {
                            type: "desc",
                            text: "(Website + Android App) - Features:"
                          },
                          {
                            type: "table",
                            tableHeaders: ["Shopping Features", "Checkout Features"],
                            tableRows: [
                              ["Browse products", "Secure checkout"],
                              ["Search & filters", "UPI / Razorpay"],
                              ["Product categories", "Cash on Delivery"],
                              ["Product details page", "Coupon system"]
                            ]
                          }
                        ]
                      };

                      const updateScope = (key: string, value: any) => {
                        setScopesData(prev => ({
                          ...prev,
                          [sId]: {
                            ...currentScope,
                            [key]: value
                          }
                        }));
                      };

                      const addBlock = (type: "heading" | "desc" | "points" | "table") => {
                        const newBlocks = [...currentScope.blocks];
                        if (type === "heading") {
                          newBlocks.push({ type, title: "New Section Heading" });
                        } else if (type === "desc") {
                          newBlocks.push({ type, text: "New description text details." });
                        } else if (type === "points") {
                          newBlocks.push({ type, points: ["Service point item 1", "Service point item 2"] });
                        } else if (type === "table") {
                          newBlocks.push({
                            type,
                            tableHeaders: ["Header Col 1", "Header Col 2"],
                            tableRows: [["Row 1 Cell 1", "Row 1 Cell 2"]]
                          });
                        }
                        updateScope("blocks", newBlocks);
                      };

                      const removeBlock = (index: number) => {
                        const newBlocks = currentScope.blocks.filter((_, i: number) => i !== index);
                        updateScope("blocks", newBlocks);
                      };

                      return (
                        <div className="space-y-4">
                          <div>
                            <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Page Title</label>
                            <input
                              type="text"
                              value={currentScope.title}
                              onChange={e => updateScope("title", e.target.value)}
                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                            />
                          </div>

                          {/* Quick Blocks Toolbar */}
                          <div className="border-t border-white/5 pt-3 space-y-2">
                            <span className="text-[8px] text-purple-400 font-black uppercase font-mono block">Insert Component</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button onClick={() => addBlock("heading")} className="bg-zinc-900 hover:bg-zinc-800 text-[8.5px] text-zinc-300 py-1 px-2 rounded-lg font-bold border border-white/5 cursor-pointer">
                                + Add Heading
                              </button>
                              <button onClick={() => addBlock("desc")} className="bg-zinc-900 hover:bg-zinc-800 text-[8.5px] text-zinc-300 py-1 px-2 rounded-lg font-bold border border-white/5 cursor-pointer">
                                + Add Desc
                              </button>
                              <button onClick={() => addBlock("points")} className="bg-zinc-900 hover:bg-zinc-800 text-[8.5px] text-zinc-300 py-1 px-2 rounded-lg font-bold border border-white/5 cursor-pointer">
                                + Add Points
                              </button>
                              <button onClick={() => addBlock("table")} className="bg-zinc-900 hover:bg-zinc-800 text-[8.5px] text-zinc-300 py-1 px-2 rounded-lg font-bold border border-white/5 cursor-pointer">
                                + Add Table
                              </button>
                            </div>
                          </div>

                          {/* Block Contents Editor */}
                          <div className="border-t border-white/5 pt-3 space-y-3">
                            <span className="text-[8px] text-purple-400 font-black uppercase font-mono block">Page Elements List</span>
                            {currentScope.blocks.map((block, bIdx) => (
                              <div key={bIdx} className="bg-zinc-950/40 border border-white/5 p-2.5 rounded-xl space-y-2 relative">
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] text-zinc-500 font-mono font-black uppercase">{block.type} Block</span>
                                  <button onClick={() => removeBlock(bIdx)} className="text-rose-400 hover:text-rose-300 text-[8px] font-bold cursor-pointer">
                                    Remove
                                  </button>
                                </div>

                                {block.type === "heading" && (
                                  <input
                                    type="text"
                                    value={block.title || ""}
                                    onChange={e => {
                                      const updated = [...currentScope.blocks];
                                      updated[bIdx] = { ...block, title: e.target.value };
                                      updateScope("blocks", updated);
                                    }}
                                    className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none"
                                  />
                                )}

                                {block.type === "desc" && (
                                  <textarea
                                    value={block.text || ""}
                                    onChange={e => {
                                      const updated = [...currentScope.blocks];
                                      updated[bIdx] = { ...block, text: e.target.value };
                                      updateScope("blocks", updated);
                                    }}
                                    rows={2}
                                    className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none"
                                  />
                                )}

                                {block.type === "points" && (
                                  <textarea
                                    value={(block.points || []).join(", ")}
                                    onChange={e => {
                                      const updated = [...currentScope.blocks];
                                      updated[bIdx] = { ...block, points: e.target.value.split(",").map(s => s.trim()) };
                                      updateScope("blocks", updated);
                                    }}
                                    rows={3}
                                    className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2.5 text-[9px] text-zinc-200 outline-none"
                                  />
                                )}

                                {block.type === "table" && (
                                  <div className="space-y-2">
                                    {/* Edit headers */}
                                    <span className="text-[7.5px] text-zinc-500 font-bold block">Table Headers</span>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {(block.tableHeaders || []).map((h, hIdx) => (
                                        <input
                                          key={hIdx}
                                          type="text"
                                          value={h}
                                          onChange={e => {
                                            const updatedHeaders = [...(block.tableHeaders || [])];
                                            updatedHeaders[hIdx] = e.target.value;
                                            const updated = [...currentScope.blocks];
                                            updated[bIdx] = { ...block, tableHeaders: updatedHeaders };
                                            updateScope("blocks", updated);
                                          }}
                                          className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none"
                                        />
                                      ))}
                                    </div>
                                    <div className="flex gap-1.5">
                                      <button
                                        onClick={() => {
                                          const updatedHeaders = [...(block.tableHeaders || []), "New Header"];
                                          const updatedRows = (block.tableRows || []).map(r => [...r, ""]);
                                          const updated = [...currentScope.blocks];
                                          updated[bIdx] = { ...block, tableHeaders: updatedHeaders, tableRows: updatedRows };
                                          updateScope("blocks", updated);
                                        }}
                                        className="bg-zinc-900 hover:bg-zinc-800 text-[7px] text-zinc-300 py-0.5 px-1.5 rounded cursor-pointer"
                                      >
                                        + Add Column
                                      </button>
                                    </div>

                                    {/* Edit rows */}
                                    <span className="text-[7.5px] text-zinc-500 font-bold block">Table Rows</span>
                                    {(block.tableRows || []).map((row, rIdx) => (
                                      <div key={rIdx} className="space-y-1 bg-zinc-950/20 p-1.5 rounded-lg border border-white/5">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-[7px] text-zinc-600 font-mono">Row {rIdx + 1}</span>
                                          <button
                                            onClick={() => {
                                              const updatedRows = (block.tableRows || []).filter((_, i) => i !== rIdx);
                                              const updated = [...currentScope.blocks];
                                              updated[bIdx] = { ...block, tableRows: updatedRows };
                                              updateScope("blocks", updated);
                                            }}
                                            className="text-rose-400 hover:text-rose-300 text-[7px]"
                                          >
                                            Delete Row
                                          </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5">
                                          {row.map((cell, cIdx) => (
                                            <input
                                              key={cIdx}
                                              type="text"
                                              value={cell}
                                              onChange={e => {
                                                const updatedRows = [...(block.tableRows || [])];
                                                const updatedRow = [...row];
                                                updatedRow[cIdx] = e.target.value;
                                                updatedRows[rIdx] = updatedRow;
                                                const updated = [...currentScope.blocks];
                                                updated[bIdx] = { ...block, tableRows: updatedRows };
                                                updateScope("blocks", updated);
                                              }}
                                              className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none"
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    ))}

                                    <button
                                      onClick={() => {
                                        const colCount = (block.tableHeaders || []).length || 2;
                                        const newRow = Array(colCount).fill("New Cell");
                                        const updatedRows = [...(block.tableRows || []), newRow];
                                        const updated = [...currentScope.blocks];
                                        updated[bIdx] = { ...block, tableRows: updatedRows };
                                        updateScope("blocks", updated);
                                      }}
                                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-[7.5px] text-zinc-300 py-1 rounded font-bold cursor-pointer"
                                    >
                                      + Add Table Row
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Timeline & Cost Edit controls */}
                    {selectedElement === "pricing" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Page Title</label>
                          <input
                            type="text"
                            value={timelinePageTitle}
                            onChange={e => setTimelinePageTitle(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none"
                          />
                        </div>
                        <div className="border-t border-white/5 pt-3 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] text-purple-400 font-black uppercase font-mono block">Timeline Deliverables</span>
                            <button
                              onClick={() => setTimelineRows(prev => [...prev, { name: "New Stage", val: "2 - 3 Days" }])}
                              className="bg-zinc-900 hover:bg-zinc-800 text-[8px] text-zinc-300 py-0.5 px-1.5 rounded-lg font-bold border border-white/5 cursor-pointer"
                            >
                              + Add Row
                            </button>
                          </div>
                          {timelineRows.map((row, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-zinc-950/20 p-1.5 rounded-lg border border-white/5 relative">
                              <div className="grid grid-cols-2 gap-1.5 flex-1">
                                <input
                                  type="text"
                                  value={row.name}
                                  onChange={e => {
                                    const updated = [...timelineRows];
                                    updated[idx] = { ...row, name: e.target.value };
                                    setTimelineRows(updated);
                                  }}
                                  className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none"
                                />
                                <input
                                  type="text"
                                  value={row.val}
                                  onChange={e => {
                                    const updated = [...timelineRows];
                                    updated[idx] = { ...row, val: e.target.value };
                                    setTimelineRows(updated);
                                  }}
                                  className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1 px-2 text-[9px] text-zinc-200 outline-none"
                                />
                              </div>
                              <button
                                onClick={() => setTimelineRows(prev => prev.filter((_, i) => i !== idx))}
                                className="text-rose-400 hover:text-rose-300 text-[9px]"
                              >
                                <Trash size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Total Estimated Duration</label>
                          <input
                            type="text"
                            value={timelineTotalVal}
                            onChange={e => setTimelineTotalVal(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Base Cost</label>
                          <input
                            type="text"
                            value={timelineBaseCost}
                            onChange={e => setTimelineBaseCost(e.target.value)}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-purple-400 font-black uppercase block mb-1">Included Scope Deliverables</label>
                          <textarea
                            value={timelineIncluded.join(", ")}
                            onChange={e => setTimelineIncluded(e.target.value.split(",").map(s => s.trim()))}
                            rows={3}
                            className="w-full bg-[#18181c] border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-zinc-200 outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Modal */}
            <AnimatePresence>
              {aiModalOpen && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4 ${theme === "dark" ? "bg-[#111115] border-white/10 text-white" : "bg-white border-zinc-200 text-zinc-800"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkle weight="fill" className="text-purple-500" size={20} />
                      <h3 className="text-sm font-black uppercase tracking-wider">AI Proposal Editor</h3>
                    </div>
                    {aiGenerating || aiGeneratedPayload ? (() => {
                      let thoughtsText = "";
                      let jsonText = aiGeneratedPayload;
                      if (aiGeneratedPayload.includes("<think>")) {
                        const start = aiGeneratedPayload.indexOf("<think>") + 7;
                        const end = aiGeneratedPayload.indexOf("</think>");
                        if (end !== -1) {
                          thoughtsText = aiGeneratedPayload.substring(start, end).trim();
                          jsonText = aiGeneratedPayload.substring(end + 8).trim();
                        } else {
                          thoughtsText = aiGeneratedPayload.substring(start).trim();
                          jsonText = "";
                        }
                      }

                      return (
                        <div className="space-y-4 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {aiGenerating ? (
                                <div className="w-3 h-3 rounded-full border-2 border-purple-500 border-t-transparent animate-spin shrink-0" />
                              ) : (
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                              )}
                              <span className={`text-[10px] font-black uppercase font-mono tracking-wider ${aiGenerating ? "text-purple-400 animate-pulse" : "text-emerald-400"}`}>
                                {aiGenerating ? "AI Writing Content..." : "AI Content Complete!"}
                              </span>
                            </div>
                            {!aiGenerating && (
                              <span className="text-[9px] text-zinc-500 font-mono">Accept to apply pages</span>
                            )}
                          </div>



                          {/* Premium glowing editor code console */}
                          <div className="rounded-2xl border border-purple-500/20 bg-[#07050d] overflow-hidden shadow-2xl flex flex-col">
                            {/* Window header */}
                            <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/10 bg-[#0c0a15]">
                              <div className="flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                                <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                                <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
                              </div>
                              <span className="text-[9px] font-mono font-bold text-purple-300">proposal_metadata.json</span>
                              <span className="text-[8px] font-mono text-zinc-500">JSON</span>
                            </div>
                            
                            {/* Terminal text area */}
                            <div className="p-4 max-h-[220px] overflow-y-auto font-mono text-[9px] leading-relaxed text-purple-200/90 whitespace-pre-wrap select-text selection:bg-purple-500/30">
                              {jsonText ? (
                                <>
                                  {jsonText}
                                  {aiGenerating && <span className="inline-block w-1.5 h-3 bg-purple-400 ml-0.5 animate-pulse" />}
                                </>
                              ) : (
                                <span className="text-zinc-600 italic">Streaming proposal template structure...</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="text-[9px] text-zinc-400 font-black uppercase block mb-1">Requirement Title</label>
                          <input
                            type="text"
                            value={aiReqTitle}
                            onChange={e => setAiReqTitle(e.target.value)}
                            placeholder="e.g. E-Commerce Portal for Organic Grocery Store"
                            className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none ${theme === "dark" ? "bg-[#18181c] border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-800"
                              }`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-zinc-400 font-black uppercase block mb-1">Budget / Price</label>
                          <input
                            type="text"
                            value={aiPrice}
                            onChange={e => setAiPrice(e.target.value)}
                            placeholder="e.g. ₹75,000 /-"
                            className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none ${theme === "dark" ? "bg-[#18181c] border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-800"
                              }`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-zinc-400 font-black uppercase block mb-1">Project Description</label>
                          <textarea
                            rows={4}
                            value={aiProjectDesc}
                            onChange={e => setAiProjectDesc(e.target.value)}
                            placeholder="Describe the application features, technology preferences, design goals, target audience..."
                            className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none resize-none ${theme === "dark" ? "bg-[#18181c] border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-800"
                              }`}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end gap-2.5">
                      <button
                        onClick={() => {
                          setAiModalOpen(false);
                          setAiGeneratedPayload("");
                        }}
                        disabled={aiGenerating}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer ${theme === "dark" ? "hover:bg-white/5 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600"
                          }`}
                      >
                        {aiGeneratedPayload ? "Close" : "Cancel"}
                      </button>
                      {!aiGenerating && aiGeneratedPayload && (
                        <button
                          onClick={handleAcceptProposal}
                          className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl text-xs font-black uppercase shadow-lg cursor-pointer"
                        >
                          Accept & Apply Proposal
                        </button>
                      )}
                      {!aiGenerating && !aiGeneratedPayload && (
                        <button
                          onClick={handleApplyAIPrompt}
                          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase shadow-lg cursor-pointer"
                        >
                          Generate Proposal
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Floating bottom-right corner AI Generation progress badge */}
            {aiGenerating && (
              <div className="fixed bottom-6 right-6 bg-[#111115] border border-purple-500/30 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-wider font-mono text-purple-400">
                  AI is generating proposal...
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
