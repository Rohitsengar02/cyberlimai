"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Sparkles,
  Search,
  Plus,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  Clock,
  X,
  Play,
  Pause,
  AlertTriangle,
  Kanban as KanbanIcon,
  FileText,
  Calendar,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Briefcase,
  Users,
  Check,
  Send,
  Zap,
  Volume2,
  FileSignature
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";

// ─── DATA SEEDING ──────────────────────────────────────────────────────────────
const revenueForecastData = [
  { name: "Jul", Expected: 120, Actual: 90, Closed: 80 },
  { name: "Aug", Expected: 150, Actual: 110, Closed: 95 },
  { name: "Sep", Expected: 180, Actual: 130, Closed: 110 },
  { name: "Oct", Expected: 220, Actual: 160, Closed: 140 },
  { name: "Nov", Expected: 280, Actual: 210, Closed: 180 },
  { name: "Dec", Expected: 350, Actual: 290, Closed: 250 },
  { name: "Jan", Expected: 310, Actual: 270, Closed: 240 },
  { name: "Feb", Expected: 380, Actual: 330, Closed: 300 },
  { name: "Mar", Expected: 420, Actual: 380, Closed: 350 },
  { name: "Apr", Expected: 460, Actual: 410, Closed: 380 },
  { name: "May", Expected: 510, Actual: 470, Closed: 440 },
  { name: "Jun", Expected: 560, Actual: 520, Closed: 480 },
];

const leadSourcesData = [
  { name: "Website", value: 450, color: "#1E40AF" },
  { name: "WhatsApp", value: 310, color: "#1D4ED8" },
  { name: "Facebook Ads", value: 240, color: "#2563EB" },
  { name: "Instagram", value: 180, color: "#3B82F6" },
  { name: "Google Ads", value: 290, color: "#60A5FA" },
  { name: "Referral", value: 120, color: "#93C5FD" },
];

const mockHotLeads = [
  { id: "L-901", name: "ABC Pvt Ltd", contact: "Rahul Sharma", score: 92, budget: "₹3.5L", probability: "87%", phone: "+91 98765 43210", email: "rahul@abc.com", requirement: "Enterprise ERP suite Integration with real-time analytics" },
  { id: "L-902", name: "XYZ Corp", contact: "Amit Patel", score: 88, budget: "₹5.0L", probability: "81%", phone: "+91 99112 23344", email: "amit@xyzcorp.com", requirement: "WhatsApp & Leads Automation setup with custom webhooks" },
  { id: "L-903", name: "Omega Tech", contact: "Priya Das", score: 85, budget: "₹8.0L", probability: "76%", phone: "+91 88776 65544", email: "priya@omegatech.in", requirement: "Cloud migration and multi-tenant CRM synchronization" },
  { id: "L-904", name: "Innotech Solutions", contact: "Siddharth Verma", score: 83, budget: "₹2.5L", probability: "71%", phone: "+91 77665 54433", email: "sid@innotech.com", requirement: "AI Agent calling integration with custom system voice logs" },
];

// Helper to resolve lead detailed data dynamically for Kanban cards
const getLeadDetails = (leadName: string, fallbackValue?: string) => {
  const existing = mockHotLeads.find(l => l.name === leadName);
  if (existing) return { ...existing, budget: fallbackValue || existing.budget };
  return {
    id: `L-${Math.floor(100 + Math.random() * 900)}`,
    name: leadName,
    contact: "Vikas Malhotra",
    score: 74,
    budget: fallbackValue || "₹3.0L",
    probability: "65%",
    phone: "+91 98887 76655",
    email: `info@${leadName.toLowerCase().replace(/\s+/g, "")}.com`,
    requirement: "AI automation and CRM integration support"
  };
};

// ─── ANIMATED WIDGETS ──────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  duration = 1400,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0,
}: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return (
    <span className={className}>
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

function AnimatedBar({
  pct,
  color,
  delay = 0,
}: {
  pct: number;
  color: string;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 100);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
      <div
        style={{ width: `${width}%`, background: color, transition: `width 1.2s ${delay}ms cubic-bezier(0.16, 1, 0.3, 1)` }}
        className="h-full rounded-full"
      />
    </div>
  );
}

// ─── CHARTS CUSTOM TOOLTIPS ──────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xl backdrop-blur-md text-xs font-semibold">
        <p className="text-slate-400 mb-1.5 font-bold">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.stroke }} className="flex justify-between gap-4 py-0.5">
            <span>{p.name}:</span>
            <span className="font-extrabold">{p.value}K</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xl backdrop-blur-md text-xs font-bold text-slate-800 dark:text-slate-200">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          {data.name}: {data.value} leads
        </span>
      </div>
    );
  }
  return null;
};

// ─── LEADS DASHBOARD ───────────────────────────────────────────────────────────
interface LeadsDashboardProps {
  setShowAiAssistant: (show: boolean) => void;
}

export default function LeadsDashboard({ setShowAiAssistant }: LeadsDashboardProps) {
  const [selectedLead, setSelectedLead] = useState<ReturnType<typeof getLeadDetails> | null>(null);
  const [activeLeadTab, setActiveLeadTab] = useState("Overview");
  const [hotLeadsSearch, setHotLeadsSearch] = useState("");
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [isQuickOpen, setIsQuickOpen] = useState(false);

  // Calls audio play simulator states
  const [isPlayingCall, setIsPlayingCall] = useState(false);
  const [waveTick, setWaveTick] = useState(0);

  // Typewriter effect state for AI tab
  const [aiAnalysisText, setAiAnalysisText] = useState("");
  const fullAiAnalysisText = "Based on multi-channel interaction metrics, this lead scores in the 90th percentile. The lead responded highly positively to the initial WhatsApp drip campaign. They possess an approved budget, and need ERP synchronization. Action Plan: Deploy proposal document and follow up with a dial call within 24 hours.";

  useEffect(() => {
    if (!isPlayingCall) return;
    const interval = setInterval(() => {
      setWaveTick((t) => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlayingCall]);

  useEffect(() => {
    if (activeLeadTab !== "AI Analysis" || !selectedLead) return;
    setAiAnalysisText("");
    let index = 0;
    const interval = setInterval(() => {
      setAiAnalysisText((prev) => prev + fullAiAnalysisText[index]);
      index++;
      if (index >= fullAiAnalysisText.length - 1) {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [activeLeadTab, selectedLead]);

  // Kanban Columns
  const [kanbanCols] = useState({
    new: [
      { id: "1", name: "Apex Corp", value: "₹4.5L", source: "Facebook Ads" },
      { id: "2", name: "Alpha Digital", value: "₹1.2L", source: "Website" },
    ],
    contacted: [
      { id: "3", name: "Beta Solutions", value: "₹3.0L", source: "WhatsApp" },
    ],
    qualified: [
      { id: "4", name: "Gamma Software", value: "₹6.5L", source: "Google Ads" },
    ],
    proposal: [
      { id: "5", name: "XYZ Corp", value: "₹5.0L", source: "Referral" },
    ],
    negotiation: [
      { id: "6", name: "ABC Pvt Ltd", value: "₹3.5L", source: "Website" },
    ],
    won: [
      { id: "7", name: "Sigma Industries", value: "₹12.0L", source: "Organic" },
    ],
  });

  const kpis = [
    { title: "Total Leads", value: 1284, change: "+14%", up: true, gradient: "grad-navy", icon: <Users className="w-5 h-5" /> },
    { title: "Hot Leads", value: 84, change: "+8%", up: true, gradient: "grad-rose", icon: <Sparkles className="w-5 h-5 animate-pulse" /> },
    { title: "Proposals Sent", value: 132, change: "+11%", up: true, gradient: "grad-blue", icon: <FileText className="w-5 h-5" /> },
    { title: "Potential Revenue", value: 48.6, decimals: 1, prefix: "₹", suffix: "L", change: "+18%", up: true, gradient: "grad-indigo", icon: <TrendingUp className="w-5 h-5" /> },
    { title: "Closed Deals", value: 26, change: "+5%", up: true, gradient: "grad-emerald", icon: <CheckCircle className="w-5 h-5" /> },
    { title: "Follow-Ups Today", value: 41, change: "-2%", up: false, gradient: "grad-orange", icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* ── HERO HEADER COMMAND CENTER ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #2563eb 70%, #1d4ed8 100%)" }}
      >
        {/* Animated Background Orbs */}
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-blue-400/20 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-40 h-40 rounded-full bg-indigo-300/10 blur-2xl animate-float-slow pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute top-4 right-1/3 w-20 h-20 rounded-full bg-cyan-300/10 blur-2xl animate-float-slow pointer-events-none" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-white text-sm shadow-lg">
                LD
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white leading-tight">Leads ERP Command Center 🎯</h1>
                <p className="text-[10px] text-blue-200 font-medium flex items-center gap-2 mt-0.5">
                  <span>📊 1,284 Active Leads</span>
                  <span>|</span>
                  <span className="flex items-center gap-0.5"><Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> 18 High Intent</span>
                  <span>|</span>
                  <span>💰 ₹12.8L Expected Pipeline</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => alert("Quick Lead Modal Triggered!")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold backdrop-blur-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Lead
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => alert("Generate Proposal workflow initiated.")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold backdrop-blur-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Generate Proposal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAiAssistant(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-extrabold shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Analysis
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── KPI ROW (6 CARDS) ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 260, damping: 25 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="relative rounded-2xl overflow-hidden shadow-sm card-lift cursor-pointer"
          >
            <div className={`absolute inset-0 ${kpi.gradient}`} />
            <div className="relative z-10 p-4 flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{kpi.title}</span>
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0">
                  {kpi.icon}
                </div>
              </div>
              <div className="flex justify-between items-baseline mt-2">
                <div className="text-xl font-black text-white">
                  <AnimatedCounter
                    target={kpi.value}
                    decimals={kpi.decimals}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    duration={1200}
                  />
                </div>
                {kpi.change && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${kpi.up ? "bg-emerald-500/25 text-emerald-300" : "bg-rose-500/25 text-rose-300"}`}>
                    {kpi.change}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── REVENUE FORECAST & SALES FUNNEL ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Expected vs Actual vs Closed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Revenue Forecast</h2>
              <p className="text-[11px] text-slate-500 font-medium">Expected target vs actual converted deals pipeline.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-extrabold text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-300" /> Expected</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-700" /> Closed</span>
            </div>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.08)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#64748B", fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#64748B", fontWeight: 700 }} tickFormatter={(v) => `₹${v}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Expected" stroke="#93C5FD" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Expected" />
                <Line type="monotone" dataKey="Actual" stroke="#2563EB" strokeWidth={3.5} dot={{ r: 4, strokeWidth: 0, fill: "#2563EB" }} activeDot={{ r: 6 }} name="Actual" />
                <Line type="monotone" dataKey="Closed" stroke="#1D4ED8" strokeWidth={2} dot={false} name="Closed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dropoffs Funnel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4"
        >
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Sales Funnel Analysis</h2>
            <p className="text-[11px] text-slate-500 font-medium">Conversion efficiency & drop-off metrics.</p>
          </div>

          <div className="space-y-3.5 my-auto">
            {[
              { stage: "New Leads", count: 1240, percent: "100%", color: "#1e3a8a" },
              { stage: "Qualified", count: 820, percent: "66%", color: "#1d4ed8" },
              { stage: "Proposal Sent", count: 480, percent: "38%", color: "#2563eb" },
              { stage: "Negotiation", count: 190, percent: "15%", color: "#3b82f6" },
              { stage: "Won", count: 72, percent: "5.8%", color: "#60a5fa" },
            ].map((f, i) => (
              <div key={f.stage}>
                <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-350">{f.stage}</span>
                  <span className="text-slate-500">{f.count} ({f.percent})</span>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedBar pct={parseFloat(f.percent)} color={f.color} delay={i * 100} />
                  <span className="text-[9px] font-extrabold w-8 text-right" style={{ color: f.color }}>{f.percent}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── LEAD SOURCES & PIPELINE KANBAN ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Lead Sources Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[360px]"
        >
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Attributed Sources</h2>
            <p className="text-[11px] text-slate-500 font-medium">Revenue generation sources distribution.</p>
          </div>

          <div className="h-44 flex items-center justify-center relative my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {leadSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: "none" }} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800 dark:text-white">1,590</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Leads</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[10px] font-bold text-slate-500">
            {leadSourcesData.map((src) => (
              <div key={src.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                  <span className="truncate">{src.name}</span>
                </div>
                <span className="text-slate-800 dark:text-white font-extrabold">{src.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pipeline Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6 flex flex-col"
        >
          <div className="mb-4">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Pipeline Kanban Board</h2>
            <p className="text-[11px] text-slate-500 font-medium">Negotiation stages flow mapping. Click card to inspect.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 flex-1 items-stretch">
            {(Object.keys(kanbanCols) as Array<keyof typeof kanbanCols>).map((colName, colIdx) => {
              const list = kanbanCols[colName];
              const titleMap = { new: "New", contacted: "Contact", qualified: "Qualified", proposal: "Proposal", negotiation: "Negotiate", won: "Won" };
              const colorMap = { new: "bg-blue-800", contacted: "bg-blue-700", qualified: "bg-blue-500", proposal: "bg-blue-400", negotiation: "bg-blue-300", won: "bg-emerald-500" };
              return (
                <div key={colName} className="p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 flex flex-col min-h-[260px]">
                  <div className="flex justify-between items-center mb-2 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${colorMap[colName]}`} />
                      {titleMap[colName]}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">{list.length}</span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
                    {list.map((lead, leadIdx) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + colIdx * 0.05 + leadIdx * 0.05 }}
                        onClick={() => setSelectedLead(getLeadDetails(lead.name, lead.value))}
                        className="kanban-card p-3 rounded-xl cursor-pointer"
                      >
                        <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 block truncate">{lead.name}</span>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-primary-custom max-w-[70px] truncate">
                            {lead.source}
                          </span>
                          <span className="text-[9px] font-black text-primary-custom shrink-0">{lead.value}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── HOT LEADS & AI INSIGHTS ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Hot Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Hot Leads prioritization</h2>
              <p className="text-[11px] text-slate-500 font-medium">Top high-intent leads generated by AI models.</p>
            </div>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search hot leads..."
                value={hotLeadsSearch}
                onChange={(e) => setHotLeadsSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] focus:outline-none focus:border-primary-custom transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="pb-3 pl-2">Company Lead</th>
                  <th className="pb-3 text-center">Intent Score</th>
                  <th className="pb-3">Estimated Budget</th>
                  <th className="pb-3">Conversion Probability</th>
                  <th className="pb-3 pr-2 text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {mockHotLeads
                  .filter((lead) => lead.name.toLowerCase().includes(hotLeadsSearch.toLowerCase()))
                  .map((lead, idx) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedLead(getLeadDetails(lead.name))}
                      className="lead-row cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 pl-2 font-bold text-slate-800 dark:text-slate-200">
                        <div>
                          <p className="text-slate-900 dark:text-white leading-snug">{lead.name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">{lead.contact}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-500 font-extrabold text-[10px]">
                          🔥 {lead.score}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-slate-600 dark:text-slate-350">{lead.budget}</td>
                      <td className="py-3.5 font-extrabold text-primary-custom">{lead.probability}</td>
                      <td className="py-3.5 pr-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(getLeadDetails(lead.name));
                            setActiveLeadTab("Conversation");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary-custom hover:bg-primary-hover active:scale-95 text-white font-bold text-[10px] shadow-sm transition-all"
                        >
                          Engage
                        </button>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Sales Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-800 pb-3 mb-4">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-status-ring shrink-0" />
              AI Sales Insights
            </h2>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Real-time</span>
          </div>

          <div className="space-y-3 flex-1 justify-center flex flex-col">
            {[
              { text: "18 high-intent leads remain uncontacted in negotiation stage.", status: "alert" },
              { text: "Lead quality increased 15% following automated email filter tweak.", status: "info" },
              { text: "Instagram ads show high CTR but lower conversion than WhatsApp.", status: "info" },
              { text: "4 proposals pending signature require automated follow-up ping.", status: "alert" },
            ].map((insight, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 border ${
                  insight.status === "alert"
                    ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-250 dark:border-rose-900/40 text-rose-800 dark:text-rose-300"
                    : "bg-blue-50/60 dark:bg-blue-950/20 border-blue-250 dark:border-blue-900/40 text-blue-800 dark:text-blue-300"
                }`}
              >
                <span className="mt-0.5 text-base">{insight.status === "alert" ? "⚠️" : "💡"}</span>
                <p className="leading-relaxed">{insight.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── FOLLOW-UP CENTER & TIMELINE ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Follow-Up Action Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between"
        >
          <div className="mb-4">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Follow-Up Action Center</h2>
            <p className="text-[11px] text-slate-500 font-medium">Scheduled task touchpoints. Call or message via AI Agent.</p>
          </div>

          <div className="space-y-2.5">
            {[
              { time: "11:00 AM", lead: "ABC Pvt Ltd", action: "WhatsApp confirmation" },
              { time: "01:00 PM", lead: "XYZ Technologies", action: "Negotiation review" },
              { time: "04:00 PM", lead: "Global Solutions", action: "Proposal demo call" },
            ].map((fu, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-750">
                <div>
                  <span className="text-[10px] font-black text-primary-custom block tracking-wider">{fu.time}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{fu.lead}</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">{fu.action}</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedLead(getLeadDetails(fu.lead));
                      setActiveLeadTab("Calls");
                      setIsDialerOpen(true);
                    }}
                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-primary-custom hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    title="Start Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLead(getLeadDetails(fu.lead));
                      setActiveLeadTab("Conversation");
                    }}
                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-primary-custom hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    title="Send WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`Email campaign compose opened for ${fu.lead}`)}
                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-primary-custom hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    title="Compose Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lead Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6"
        >
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Recent Leads Activity</h2>
          <p className="text-[11px] text-slate-500 font-medium mb-4">Chronological log of multi-channel CRM touchpoints.</p>

          <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-blue-100 dark:before:bg-blue-950">
            {[
              { time: "10:02 AM", title: "New Lead Added", desc: "Apex Corp generated from Facebook campaign.", icon: <Plus className="w-3 h-3 text-white" />, color: "bg-blue-500" },
              { time: "10:15 AM", title: "AI Sent WhatsApp Message", desc: "Automated greeting response dispatched to Beta Solutions.", icon: <MessageSquare className="w-3 h-3 text-white" />, color: "bg-emerald-500" },
              { time: "10:32 AM", title: "Proposal Generated", desc: "AI engine generated custom draft for XYZ Corp.", icon: <FileSignature className="w-3 h-3 text-white" />, color: "bg-violet-500" },
              { time: "11:00 AM", title: "Client Link Opened", desc: "ABC Pvt Ltd opened proposal document #882.", icon: <ArrowUpRight className="w-3 h-3 text-white" />, color: "bg-amber-500" },
            ].map((act, idx) => (
              <div key={idx} className="flex gap-4 items-start relative z-10">
                <div className={`w-6 h-6 rounded-full ${act.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  {act.icon}
                </div>
                <div>
                  <div className="flex justify-between items-center w-full gap-2">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-none">{act.title}</h4>
                    <span className="text-[9px] font-bold text-slate-400 shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── FLOATING EXPANDABLE SPEED DIAL ─────────────────────────────── */}
      <div className="fixed right-6 bottom-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {isQuickOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-2xl flex flex-col gap-1.5"
            >
              {[
                { label: "Quick Add Lead", color: "text-amber-500" },
                { label: "WhatsApp Broadcast", color: "text-emerald-500" },
                { label: "Email Campaign", color: "text-indigo-500" },
                { label: "Trigger AI Dialer", color: "text-primary-custom" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => {
                    setIsQuickOpen(false);
                    alert(`${btn.label} Action Initiated.`);
                  }}
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] font-extrabold flex items-center gap-2 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${btn.color === "text-amber-500" ? "bg-amber-500" : btn.color === "text-emerald-500" ? "bg-emerald-500" : "bg-primary-custom"}`} />
                  {btn.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsQuickOpen(!isQuickOpen)}
          className="w-12 h-12 rounded-full bg-primary-custom text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary-hover animate-glow-pulse"
        >
          {isQuickOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* ── DIALER MODAL SIMULATOR ─────────────────────────────────────── */}
      <AnimatePresence>
        {isDialerOpen && selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
              <button
                onClick={() => {
                  setIsDialerOpen(false);
                  setIsPlayingCall(false);
                }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-black mx-auto mb-4 animate-glow-pulse">
                {selectedLead.name.split(" ").map(n => n[0]).join("")}
              </div>

              <h3 className="font-extrabold text-base mb-1">{selectedLead.name}</h3>
              <p className="text-[10px] text-slate-400 mb-6">{selectedLead.phone}</p>

              <div className="text-[11px] text-emerald-400 font-extrabold flex items-center justify-center gap-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-status-ring" />
                AI Dialer Connecting...
              </div>

              <div className="flex justify-center gap-6">
                <button
                  onClick={() => {
                    setIsDialerOpen(false);
                    setIsPlayingCall(false);
                  }}
                  className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
                  title="Hang Up"
                >
                  <Phone className="w-5 h-5 rotate-135" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DETAILED DRAWER PANEL ───────────────────────────────────────── */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-end"
            onClick={() => {
              setSelectedLead(null);
              setIsPlayingCall(false);
            }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full max-w-xl h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-850 flex flex-col p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-5">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedLead.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedLead.contact} ({selectedLead.id})</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedLead(null);
                    setIsPlayingCall(false);
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-150 dark:border-slate-800 text-[10px] font-extrabold mb-5 gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {["Overview", "Conversation", "Calls", "Proposals", "AI Analysis"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveLeadTab(t);
                      if (t !== "Calls") setIsPlayingCall(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeLeadTab === t
                        ? "bg-primary-custom text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-250 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="flex-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                {activeLeadTab === "Overview" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5 uppercase tracking-wider">Company</span>
                        <span className="font-extrabold text-slate-850 dark:text-white text-xs">{selectedLead.name}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5 uppercase tracking-wider">Contact Agent</span>
                        <span className="font-extrabold text-slate-850 dark:text-white text-xs">{selectedLead.contact}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5 uppercase tracking-wider">Estimated Budget</span>
                        <span className="font-extrabold text-primary-custom text-xs">{selectedLead.budget}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5 uppercase tracking-wider">Probability</span>
                        <span className="font-extrabold text-primary-custom text-xs">{selectedLead.probability}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Requirement Details</span>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-200 text-xs">{selectedLead.requirement}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">Contact Info</span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-450">Phone</span>
                          <span className="font-bold text-slate-800 dark:text-white">{selectedLead.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-450">Email</span>
                          <span className="font-bold text-slate-800 dark:text-white">{selectedLead.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeLeadTab === "Conversation" && (
                  <div className="space-y-4 flex flex-col h-[400px] justify-between">
                    <div className="space-y-3.5 overflow-y-auto no-scrollbar flex-1 pr-1">
                      <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl max-w-[85%]">
                        <span className="font-bold block text-[9px] text-slate-400 mb-0.5">AI Sales Agent - 10:15 AM</span>
                        <p className="text-slate-700 dark:text-slate-200">Hi Rahul! I noticed you were looking at our custom Enterprise CRM package. Would you like a brief demo or brochure sent?</p>
                      </div>
                      <div className="bg-blue-500 text-white p-3 rounded-2xl max-w-[85%] ml-auto text-right">
                        <span className="font-bold block text-[9px] text-white/70 mb-0.5">Client - 10:20 AM</span>
                        <p>Yes, send over the pricing deck. We have a team of 40 users we want to onboard next month.</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl max-w-[85%]">
                        <span className="font-bold block text-[9px] text-slate-400 mb-0.5">AI Sales Agent - 10:21 AM</span>
                        <p className="text-slate-700 dark:text-slate-200">Excellent. I am generating the custom quote with team discounts. It will appear on your dashboard in 10 minutes.</p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <input
                        type="text"
                        placeholder="Type WhatsApp follow-up message..."
                        className="flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-primary-custom"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") alert("Message sent!");
                        }}
                      />
                      <button
                        onClick={() => alert("Message sent!")}
                        className="w-9 h-9 rounded-lg bg-primary-custom hover:bg-primary-hover text-white flex items-center justify-center shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {activeLeadTab === "Calls" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
                      <div>
                        <span className="font-bold block text-slate-800 dark:text-white">AI Call Recording #02</span>
                        <span className="text-[10px] text-slate-450 block mt-0.5">Duration: 2m 14s | Scheduled Yesterday</span>
                      </div>
                      <button
                        onClick={() => setIsDialerOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 shadow"
                      >
                        <Phone className="w-3 h-3 fill-current" /> Call Now
                      </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                      <button
                        onClick={() => setIsPlayingCall(!isPlayingCall)}
                        className="w-10 h-10 rounded-full bg-primary-custom hover:bg-primary-hover active:scale-95 text-white flex items-center justify-center shadow-md shrink-0 transition-all"
                      >
                        {isPlayingCall ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                          <span>Recording Playback</span>
                          <span>{isPlayingCall ? "0:14 / 2:14" : "0:00 / 2:14"}</span>
                        </div>
                        <div className="h-6 flex items-center gap-0.5">
                          {[4, 8, 12, 6, 9, 15, 10, 4, 12, 16, 8, 5, 9, 14, 18, 12, 7, 5, 11, 14, 8, 3, 6, 12, 9, 4, 8, 11, 5, 2].map((height, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-primary-custom rounded-full"
                              style={{
                                height: isPlayingCall ? `${Math.max(3, height + Math.sin((waveTick + i) * 0.8) * 8)}px` : `${height / 2 + 2}px`,
                                opacity: isPlayingCall ? 0.9 : 0.4,
                                transition: "height 0.1s ease"
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">AI Transcript Highlight</span>
                      <p className="italic leading-relaxed text-slate-700 dark:text-slate-350 text-xs">
                        &ldquo;...Yes, the multi-tenant database structure fits perfectly. We require API endpoints to trigger payroll pipelines. Please issue a custom contract proposal with multi-user volume pricing.&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {activeLeadTab === "Proposals" && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-extrabold block text-slate-800 dark:text-white">Enterprise Proposal V2</span>
                        <span className="text-[9px] text-slate-450">Estimated: ₹5.5L | Sent: June 18</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold text-[9px]">Opened</span>
                    </div>

                    <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
                      <span className="text-[10px] text-slate-450 block mb-2">Need changes? Regenerate using AI custom templates.</span>
                      <button
                        onClick={() => alert("Re-generating proposal in background...")}
                        className="px-3.5 py-2 rounded-xl bg-primary-custom hover:bg-primary-hover active:scale-95 text-white font-bold text-[10px] transition-all shadow-sm"
                      >
                        Regenerate Proposal
                      </button>
                    </div>
                  </div>
                )}

                {activeLeadTab === "AI Analysis" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5">Quality Intent Score</span>
                        <span className="text-xl font-black text-primary-custom">🔥 {selectedLead.score} / 100</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">High Conversion Grade A</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 min-h-[120px]">
                      <span className="text-[9px] font-bold text-slate-400 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary-custom" />
                        AI Strategic Recommendations
                      </span>
                      <div className="text-slate-800 dark:text-slate-200 text-xs font-semibold leading-relaxed border-l-2 border-primary-custom pl-3 py-0.5">
                        {aiAnalysisText}
                        <span className="w-1.5 h-3.5 bg-primary-custom inline-block ml-0.5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
