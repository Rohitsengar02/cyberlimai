"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Check,
  Briefcase,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  duration = 1400,
  prefix = "",
  suffix = "",
  className = "",
}: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── ANIMATED BAR ──────────────────────────────────────────────────────────────
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
    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        style={{ width: `${width}%`, background: color, transition: `width 1s ${delay}ms cubic-bezier(0.4,0,0.2,1)` }}
        className="h-full rounded-full"
      />
    </div>
  );
}

// ─── DONUT CHART ───────────────────────────────────────────────────────────────
function DonutChart({
  segments,
  size = 160,
  strokeWidth = 18,
  centerLabel,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: React.ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  let cumulative = 0;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = animated ? circ * pct : 0;
          const offset = circ - cumulative * circ / total;
          const result = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${animated ? circ * pct : 0} ${circ}`}
              strokeDashoffset={-(cumulative / total) * circ}
              strokeLinecap="round"
              style={{ transition: `stroke-dasharray 1s ${i * 150}ms cubic-bezier(0.4,0,0.2,1)` }}
            />
          );
          cumulative += seg.value;
          return result;
        })}
      </svg>
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerLabel}
        </div>
      )}
    </div>
  );
}

// ─── DATA ──────────────────────────────────────────────────────────────────────
const attendanceSegments = [
  { value: 62, color: "#F59E0B", label: "Present" },
  { value: 18, color: "#10B981", label: "Late" },
  { value: 12, color: "#3B82F6", label: "Leave" },
  { value: 8,  color: "#EF4444", label: "Absent" },
];

const deptData = [
  { name: "Production", count: 584, pct: 90, color: "#F97316" },
  { name: "Management", count: 170, pct: 55, color: "#8B5CF6" },
  { name: "Sales",      count: 96,  pct: 38, color: "#3B82F6" },
  { name: "Marketing",  count: 60,  pct: 25, color: "#10B981" },
];

const clockInOut = [
  { name: "English Morrila",  role: "UI/UX Designer",   clockIn: "09:00 AM", clockOut: "06:00 PM", avatar: "EM", color: "bg-violet-500" },
  { name: "Bryan Ghibsons",   role: "Graphic Designer",  clockIn: "08:45 AM", clockOut: "06:15 PM", avatar: "BG", color: "bg-blue-500"   },
  { name: "Anthony Lewis",    role: "Checker Check",      clockIn: "09:30 AM", clockOut: "—",        avatar: "AL", color: "bg-orange-500" },
];

const employees = [
  { name: "Anthony Lewis",   dept: "Development",  avatar: "AL", color: "bg-blue-500"   },
  { name: "Sarah Connor",    dept: "Design",        avatar: "SC", color: "bg-violet-500" },
  { name: "Mike Johnson",    dept: "Marketing",     avatar: "MJ", color: "bg-emerald-500"},
  { name: "Diana Prince",    dept: "Sales",         avatar: "DP", color: "bg-orange-500" },
];

const jobApplicants = [
  { name: "Emma Watson",   role: "UI Designer",    avatar: "EW", color: "bg-pink-500",    status: "Shortlisted" },
  { name: "James Martin",  role: "React Developer", avatar: "JM", color: "bg-blue-500",    status: "Pending"    },
  { name: "Aria Singh",    role: "Data Analyst",    avatar: "AS", color: "bg-violet-500",  status: "Rejected"   },
];

const todos = [
  { text: "Add Holidays",         done: true  },
  { text: "Weekly Performance Review", done: false },
  { text: "Payroll Processing",   done: false },
  { text: "Update Job Postings",  done: true  },
  { text: "Team Meeting Notes",   done: false },
];

// ─── STAT KPI CARD ─────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  change,
  up,
  gradient,
  icon,
  idx,
}: {
  label: string;
  value: number;
  sub: string;
  change: string;
  up: boolean;
  gradient: string;
  icon: React.ReactNode;
  idx: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07, type: "spring", stiffness: 280, damping: 28 }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden shadow-sm card-lift"
    >
      <div className={`absolute inset-0 ${gradient}`} />
      <div className="relative z-10 p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-1">{label}</p>
            <div className="text-2xl font-extrabold text-white">
              <AnimatedCounter target={value} duration={1200} />
            </div>
            <p className="text-[10px] text-white/60 mt-0.5">{sub}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
            {icon}
          </div>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${up ? "text-emerald-300" : "text-red-300"}`}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {change} vs last month
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function MainDashboard({
  setShowAiAssistant,
}: {
  setShowAiAssistant: (show: boolean) => void;
}) {
  const [todoList, setTodoList] = useState(todos);
  const [searchVal, setSearchVal] = useState("");

  const toggleTodo = (i: number) =>
    setTodoList((prev) => prev.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t)));

  const kpiCards = [
    { label: "Attendance Overview",  value: 120, sub: "Total of employees",   change: "+12%",  up: true,  gradient: "bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400",    icon: <UserCheck className="w-5 h-5" /> },
    { label: "Time In / Proposal",   value: 90,  sub: "Active timesheets",    change: "+8.5%", up: true,  gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",        icon: <Clock className="w-5 h-5" /> },
    { label: "Total of Clients",     value: 68,  sub: "Managed clients",      change: "-2.1%", up: false, gradient: "bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600",   icon: <Briefcase className="w-5 h-5" /> },
    { label: "Number of Buses",      value: 25,  sub: "Transport fleet",      change: "+4%",   up: true,  gradient: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500",       icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-5 pb-8">

      {/* ── HERO HEADER ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #2d4fa3 0%, #1e3a8a 40%, #1a3070 70%, #0f2055 100%)" }}
      >
        {/* Animated orbs */}
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-blue-400/20 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-40 h-40 rounded-full bg-indigo-300/10 blur-2xl animate-float-slow pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute top-4 right-1/3 w-20 h-20 rounded-full bg-cyan-300/10 blur-2xl animate-float-slow pointer-events-none" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-extrabold text-white text-sm shadow-lg">
                AD
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white leading-tight">Welcome Back, Admin 👋</h1>
                <p className="text-[10px] text-blue-200 font-medium">
                  Pending Approvals: 0 | Leave Request
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold backdrop-blur-sm transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              Add Attribute
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-extrabold shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Employees
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── TOP KPI CARDS (4 gradient cards) ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k, i) => (
          <KpiCard key={k.label} {...k} idx={i} />
        ))}
      </div>

      {/* ── MIDDLE SECTION ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── Employee Status ────────── lg:col-span-3 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Employee Status</h2>
            <span className="text-xs font-bold text-slate-400">Today</span>
          </div>

          {/* Big count */}
          <div className="text-4xl font-black text-slate-900 dark:text-white">
            <AnimatedCounter target={154} />
          </div>

          {/* Status grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Full Time (PH)",  count: 112, color: "#F59E0B", sub: "bg-amber-50 dark:bg-amber-950" },
              { label: "Contract (77%)",  count: 21,  color: "#3B82F6", sub: "bg-blue-50  dark:bg-blue-950"  },
              { label: "Probation (39%)", count: 12,  color: "#EF4444", sub: "bg-red-50   dark:bg-red-950"   },
              { label: "Apprentice (4%)", count: 4,   color: "#8B5CF6", sub: "bg-violet-50 dark:bg-violet-950"},
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className={`${s.sub} rounded-xl p-3`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{s.label}</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                  <AnimatedCounter target={s.count} duration={900} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Top Performer */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Top Performer</p>
            {[
              { name: "David Echols",    score: "98%", color: "bg-amber-500",  textColor: "text-amber-600" },
              { name: "Rebecca Martin", score: "82%", color: "bg-blue-500",    textColor: "text-blue-600"  },
            ].map((p, i) => (
              <div key={p.name} className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg ${p.color} flex items-center justify-center text-white text-[10px] font-extrabold shrink-0`}>
                  {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: p.score }}
                      transition={{ delay: 0.6 + i * 0.15, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                      className={`h-full ${p.color} rounded-full`}
                    />
                  </div>
                </div>
                <span className={`text-[9px] font-extrabold ${p.textColor} shrink-0`}>{p.score}</span>
              </div>
            ))}
          </div>

          <button className="w-full text-center text-[10px] font-bold text-primary-custom hover:underline mt-auto">
            View All Employees →
          </button>
        </motion.div>

        {/* ── Attendance Overview (Donut) ─── lg:col-span-4 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Attendance Overview</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse" />
              <span className="text-[10px] font-bold text-slate-400">Today</span>
            </div>
          </div>

          {/* Donut */}
          <div className="flex justify-center">
            <DonutChart
              segments={attendanceSegments}
              size={160}
              strokeWidth={20}
              centerLabel={
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 dark:text-white">120</div>
                  <div className="text-[9px] font-bold text-slate-400">Total Attendance</div>
                </div>
              }
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[
              { label: "Present",  pct: "62%", color: "#F59E0B" },
              { label: "Late",     pct: "18%", color: "#10B981" },
              { label: "Leave",    pct: "12%", color: "#3B82F6" },
              { label: "Absent",   pct: "8%",  color: "#EF4444" },
            ].map((l) => (
              <div key={l.label} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">{l.label}</span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-white">{l.pct}</span>
              </div>
            ))}
          </div>

          {/* Status bar row */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-bold space-y-1.5">
            <p className="text-slate-400 uppercase tracking-widest mb-2">Status</p>
            {[
              { label: "Present",   pct: 62, color: "#F59E0B" },
              { label: "Late",      pct: 18, color: "#10B981" },
              { label: "Leave",     pct: 12, color: "#3B82F6" },
              { label: "Absent",    pct: 8,  color: "#EF4444" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="w-14 text-slate-600 dark:text-slate-400 shrink-0">{s.label}</span>
                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    style={{ background: s.color }}
                    className="h-full rounded-full"
                  />
                </div>
                <span className="w-6 text-right text-slate-700 dark:text-slate-300">{s.pct}%</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] font-bold text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
            Total Attendance: <span className="text-slate-800 dark:text-white font-extrabold">📅🟡🟢🔵</span>
          </div>
        </motion.div>

        {/* ── Employees By Department ─── lg:col-span-5 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.36, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Employees By Department</h2>
            <span className="text-[10px] font-bold text-slate-400">📅 This Week</span>
          </div>

          {/* Department bar chart */}
          <div className="space-y-4 flex-1">
            {deptData.map((dept, i) => (
              <div key={dept.name}>
                <div className="flex justify-between text-[10px] font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">{dept.name}</span>
                  <span className="text-slate-500">{dept.count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedBar pct={dept.pct} color={dept.color} delay={i * 100} />
                  <span className="text-[9px] font-extrabold shrink-0" style={{ color: dept.color }}>{dept.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-400 font-semibold">
            ✅ Total employees is covered: 68% in Sum by Sun
          </div>

          {/* Clock-In/Out mini section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
                  <Clock className="w-3 h-3 text-white" />
                </span>
                Clock-In/Out
              </h3>
              <span className="text-[10px] font-bold text-slate-400">📅 Achievements</span>
              <span className="text-[10px] font-bold text-slate-400">↑ Today</span>
            </div>

            <div className="space-y-2.5">
              {clockInOut.map((emp, i) => (
                <motion.div
                  key={emp.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750"
                >
                  <div className={`w-8 h-8 rounded-lg ${emp.color} flex items-center justify-center text-white text-[9px] font-extrabold shrink-0`}>
                    {emp.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-extrabold text-slate-800 dark:text-white truncate">{emp.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{emp.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{emp.clockIn}</p>
                    <p className="text-[9px] font-bold text-slate-400">{emp.clockOut}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="w-full text-center text-[10px] font-bold text-primary-custom hover:underline mt-3">
              View All Attendance →
            </button>
          </div>

        </motion.div>
      </div>

      {/* ── BOTTOM ROW ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── Job Applicants ──── lg:col-span-4 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Job Applicants</h2>
            <button className="text-[10px] font-bold text-primary-custom hover:underline">View All</button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            {["Shortlisted", "Rejected"].map((t, i) => (
              <button
                key={t}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                  i === 0 ? "bg-primary-custom text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Applicant rows */}
          <div className="space-y-3">
            {jobApplicants.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750"
              >
                <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center text-white text-[10px] font-extrabold shrink-0`}>
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white">{a.name}</p>
                  <p className="text-[9px] text-slate-400">{a.role}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold whitespace-nowrap ${
                  a.status === "Shortlisted" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" :
                  a.status === "Pending"     ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"    :
                                               "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                }`}>
                  {a.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Employees Table ──── lg:col-span-5 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Employees</h2>
            <button className="text-[10px] font-bold text-primary-custom hover:underline">See All</button>
          </div>

          {/* Mini search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] focus:outline-none focus:border-primary-custom transition-all"
            />
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest px-2">
            <span>Name</span>
            <span>Department</span>
            <span className="text-right">Action</span>
          </div>

          {/* Employee rows */}
          <div className="space-y-2">
            {employees
              .filter((e) => e.name.toLowerCase().includes(searchVal.toLowerCase()))
              .map((emp, i) => (
                <motion.div
                  key={emp.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                  className="grid grid-cols-3 items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 hover:border-primary-custom/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${emp.color} flex items-center justify-center text-white text-[9px] font-extrabold shrink-0`}>
                      {emp.avatar}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{emp.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate">{emp.dept}</span>
                  <div className="flex justify-end gap-1.5">
                    <button className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* ── Todo ──── lg:col-span-3 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.54, type: "spring", stiffness: 200, damping: 22 }}
          className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">Todo</h2>
            <span className="text-[10px] font-bold text-slate-400">📅 Today</span>
          </div>

          {/* Add new todo hint */}
          <button className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-400 hover:border-primary-custom/50 hover:text-primary-custom transition-all">
            <Plus className="w-3.5 h-3.5" />
            Add Holidays
          </button>

          {/* Todo items */}
          <div className="space-y-2 flex-1">
            <AnimatePresence>
              {todoList.map((item, i) => (
                <motion.button
                  key={item.text}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => toggleTodo(i)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                    item.done
                      ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-750 hover:border-primary-custom/40"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                    item.done
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {item.done && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-[10px] font-semibold transition-all ${
                    item.done
                      ? "line-through text-slate-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}>
                    {item.text}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-center text-[9px] font-bold text-slate-400">
            <span>{todoList.filter(t => t.done).length} of {todoList.length} completed</span>
            <button className="text-primary-custom hover:underline">Clear done</button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
