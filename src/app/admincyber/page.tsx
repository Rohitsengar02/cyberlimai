"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Truck, Buildings, Heartbeat, GraduationCap, ShoppingCartSimple,
  SquaresFour, Tray, FunnelSimple, FileText, Target, AddressBook,
  Globe, DeviceMobile, Robot, Database, Kanban, Rocket, FlagBanner,
  ChartLineUp, UsersThree, CalendarCheck, Money, Brain, Receipt,
  Megaphone, ChartBar, ShieldCheck, CloudCheck, GitBranch, Headset,
  BookOpen, Scales, UserFocus, GearSix, MagnifyingGlass, Bell,
  CaretRight, ArrowUpRight, ArrowDownRight, DotsThreeVertical,
  Circle, Sparkle, Sun, Moon,
} from "@phosphor-icons/react";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, BarElement, Filler, Tooltip, Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import OverviewComponent from "./CyberlimIT/overview";
import LeadsComponent from "./CyberlimIT/leads";
import PipelineComponent from "./CyberlimIT/pipeline";
import ProposalsComponent from "./CyberlimIT/proposals";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, BarElement, Filler, Tooltip, Legend
);

/* ─────────────────────────────────────────────────────────────
   THEME — dark / light context
───────────────────────────────────────────────────────────── */
type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: "dark",
  toggleTheme: () => { },
});
const useThemeCtx = () => useContext(ThemeContext);

const GRADIENT_TEXT = "bg-gradient-to-r from-[#8b6cf6] via-[#6d8cf7] to-[#22d3ee] bg-clip-text text-transparent";
const GRADIENT_BG = "bg-gradient-to-br from-[#8b6cf6] via-[#6d5cf0] to-[#22d3ee]";

/* per-theme surface tokens, used as inline styles / class strings */
function tokens(theme: Theme) {
  return theme === "dark"
    ? {
      pageBg: "#08080f",
      panelBg: "#0f0f1a",
      railBg: "#08080f",
      cardBg: "rgba(18,18,30,0.8)",
      headerBg: "rgba(8,8,15,0.72)",
      border: "rgba(139,108,246,0.16)",
      divider: "rgba(255,255,255,0.06)",
      textPrimary: "text-white",
      textSecondary: "text-zinc-500",
      textMuted: "text-zinc-600",
      inputBg: "rgba(255,255,255,0.03)",
      navIdleText: "text-zinc-500",
      navHover: "hover:text-zinc-200 hover:bg-white/5",
      glowOpacity: 0.2,
    }
    : {
      pageBg: "#f4f5fb",
      panelBg: "#ffffff",
      railBg: "#f4f5fb",
      cardBg: "rgba(255,255,255,0.92)",
      headerBg: "rgba(255,255,255,0.75)",
      border: "rgba(109,92,240,0.16)",
      divider: "rgba(20,20,40,0.06)",
      textPrimary: "text-zinc-900",
      textSecondary: "text-zinc-500",
      textMuted: "text-zinc-400",
      inputBg: "rgba(20,20,40,0.03)",
      navIdleText: "text-zinc-500",
      navHover: "hover:text-zinc-900 hover:bg-black/5",
      glowOpacity: 0.12,
    };
}

/* ─────────────────────────────────────────────────────────────
   DATA — industries (Cyberlim Group) + IT section map
───────────────────────────────────────────────────────────── */
type IndustryId = "it" | "transport" | "realestate" | "healthcare" | "education" | "retail";

const INDUSTRIES: { id: IndustryId; label: string; icon: any }[] = [
  { id: "it", label: "IT & Technology", icon: Cpu },
  { id: "transport", label: "Transport & Logistics", icon: Truck },
  { id: "realestate", label: "Real Estate", icon: Buildings },
  { id: "healthcare", label: "Healthcare", icon: Heartbeat },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "retail", label: "Retail", icon: ShoppingCartSimple },
];

interface SectionItem { id: string; label: string; icon: any }
interface SectionGroup { group: string; items: SectionItem[] }

const IT_SECTIONS: SectionGroup[] = [
  { group: "Overview", items: [{ id: "overview", label: "Overview", icon: SquaresFour }] },
  {
    group: "Leads & sales", items: [
      { id: "leads", label: "Leads inbox", icon: Tray },
      { id: "pipeline", label: "Lead pipeline", icon: FunnelSimple },
      { id: "proposals", label: "Proposals & quotes", icon: FileText },
      { id: "outcomes", label: "Outcomes tracker", icon: Target },
    ]
  },
  {
    group: "Clients", items: [
      { id: "clients", label: "Client directory", icon: AddressBook },
    ]
  },
  {
    group: "Delivery", items: [
      { id: "webprojects", label: "Web projects", icon: Globe },
      { id: "appprojects", label: "App projects", icon: DeviceMobile },
      { id: "aiprojects", label: "AI agent projects", icon: Robot },
      { id: "erpprojects", label: "ERP / CRM / POS", icon: Database },
      { id: "taskboard", label: "Task board", icon: Kanban },
    ]
  },
  {
    group: "Products", items: [
      { id: "saas", label: "SaaS products", icon: Rocket },
      { id: "launches", label: "Product launches", icon: FlagBanner },
      { id: "subscriptions", label: "Subscriptions & MRR", icon: ChartLineUp },
    ]
  },
  {
    group: "Team", items: [
      { id: "team", label: "Team directory", icon: UsersThree },
      { id: "attendance", label: "Attendance", icon: CalendarCheck },
      { id: "payroll", label: "Payroll", icon: Money },
    ]
  },
  {
    group: "AI", items: [
      { id: "agents", label: "AI agents console", icon: Brain },
    ]
  },
  {
    group: "Finance", items: [
      { id: "finance", label: "Invoices & finance", icon: Receipt },
    ]
  },
  {
    group: "Growth", items: [
      { id: "marketing", label: "Marketing campaigns", icon: Megaphone },
      { id: "reports", label: "Reports & analytics", icon: ChartBar },
    ]
  },
  {
    group: "Systems", items: [
      { id: "security", label: "Cybersecurity", icon: ShieldCheck },
      { id: "cloud", label: "Cloud & hosting", icon: CloudCheck },
      { id: "devops", label: "DevOps / CI-CD", icon: GitBranch },
      { id: "tickets", label: "Support tickets", icon: Headset },
      { id: "docs", label: "Documentation hub", icon: BookOpen },
      { id: "legal", label: "Contracts & legal", icon: Scales },
      { id: "hr", label: "HR & recruitment", icon: UserFocus },
      { id: "settings", label: "Settings", icon: GearSix },
    ]
  },
];

const SECTIONS_BY_INDUSTRY: Record<IndustryId, SectionGroup[]> = {
  it: IT_SECTIONS,
  transport: [{ group: "Coming soon", items: [{ id: "soon-transport", label: "Fleet & logistics module", icon: Truck }] }],
  realestate: [{ group: "Coming soon", items: [{ id: "soon-realestate", label: "Property portfolio module", icon: Buildings }] }],
  healthcare: [{ group: "Coming soon", items: [{ id: "soon-health", label: "Clinic ops module", icon: Heartbeat }] }],
  education: [{ group: "Coming soon", items: [{ id: "soon-edu", label: "Campus ops module", icon: GraduationCap }] }],
  retail: [{ group: "Coming soon", items: [{ id: "soon-retail", label: "Storefront ops module", icon: ShoppingCartSimple }] }],
};

/* ─────────────────────────────────────────────────────────────
   GENERIC CONTENT for sections without a bespoke layout
───────────────────────────────────────────────────────────── */
interface GenericContent {
  subtitle: string;
  kpis: { label: string; value: string; delta: string; up: boolean }[];
  listLabel: string;
  items: { title: string; sub: string; tag: string; tagColor: string }[];
}

const GENERIC: Record<string, GenericContent> = {
  pipeline: {
    subtitle: "Stage-by-stage view of every open lead",
    kpis: [
      { label: "New", value: "38", delta: "+12%", up: true },
      { label: "Contacted", value: "24", delta: "+5%", up: true },
      { label: "Qualified", value: "16", delta: "+8%", up: true },
      { label: "Meeting booked", value: "9", delta: "-3%", up: false },
    ],
    listLabel: "Leads in pipeline",
    items: [
      { title: "Radiant Interiors", sub: "Website · Meta Ads", tag: "Qualified", tagColor: "cyan" },
      { title: "Vertex Logistics", sub: "SaaS demo requested", tag: "Meeting booked", tagColor: "violet" },
      { title: "Kavya Boutique", sub: "E-commerce app", tag: "Contacted", tagColor: "blue" },
      { title: "Northstar Clinic", sub: "Hospital ERP", tag: "New", tagColor: "gray" },
    ],
  },
  proposals: {
    subtitle: "Every quotation sent and its current status",
    kpis: [
      { label: "Sent this month", value: "21", delta: "+18%", up: true },
      { label: "Accepted", value: "9", delta: "+22%", up: true },
      { label: "Avg. value", value: "₹1.4L", delta: "+6%", up: true },
      { label: "Pending", value: "7", delta: "-4%", up: false },
    ],
    listLabel: "Recent proposals",
    items: [
      { title: "Vertex Logistics — SaaS build", sub: "Sent 2 days ago", tag: "Under review", tagColor: "violet" },
      { title: "Kavya Boutique — E-commerce", sub: "Sent 4 days ago", tag: "Accepted", tagColor: "cyan" },
      { title: "Northstar Clinic — Hospital ERP", sub: "Sent 6 days ago", tag: "Pending", tagColor: "gray" },
    ],
  },
  outcomes: {
    subtitle: "Won, lost, and referred — where every lead ended up",
    kpis: [
      { label: "Won", value: "12", delta: "+9%", up: true },
      { label: "Lost", value: "5", delta: "-2%", up: true },
      { label: "Referred out", value: "3", delta: "0%", up: true },
      { label: "Win rate", value: "58%", delta: "+4%", up: true },
    ],
    listLabel: "Recent outcomes",
    items: [
      { title: "Radiant Interiors", sub: "Closed — website + branding", tag: "Won", tagColor: "cyan" },
      { title: "Aster Freight Co.", sub: "Chose a cheaper vendor", tag: "Lost", tagColor: "coral" },
      { title: "PulseFit Studio", sub: "Referred to a partner agency", tag: "Referred", tagColor: "gray" },
    ],
  },
  clients: {
    subtitle: "Every active and past client, in one place",
    kpis: [
      { label: "Active clients", value: "18", delta: "+3", up: true },
      { label: "Retained 6mo+", value: "11", delta: "+2", up: true },
      { label: "Avg. contract", value: "₹2.1L", delta: "+7%", up: true },
      { label: "At risk", value: "2", delta: "0", up: true },
    ],
    listLabel: "Client directory",
    items: [
      { title: "Vertex Logistics", sub: "SaaS · onboarded Mar 2026", tag: "Active", tagColor: "cyan" },
      { title: "Kavya Boutique", sub: "E-commerce · onboarded Jan 2026", tag: "Active", tagColor: "cyan" },
      { title: "Anaco Programming", sub: "Website · AMC renewal due", tag: "Renewal", tagColor: "amber" },
    ],
  },
  webprojects: {
    subtitle: "Every business, corporate, and e-commerce site in build",
    kpis: [
      { label: "In progress", value: "6", delta: "+1", up: true },
      { label: "In review", value: "3", delta: "0", up: true },
      { label: "Delivered", value: "14", delta: "+2", up: true },
      { label: "Avg. timeline", value: "18 days", delta: "-2d", up: true },
    ],
    listLabel: "Active web projects",
    items: [
      { title: "Radiant Interiors — corporate site", sub: "Next.js · GSAP", tag: "In progress", tagColor: "violet" },
      { title: "Kavya Boutique — storefront", sub: "Next.js · Shopify-style cart", tag: "In review", tagColor: "amber" },
      { title: "Anaco Programming — portfolio", sub: "Static site refresh", tag: "Delivered", tagColor: "cyan" },
    ],
  },
  appprojects: {
    subtitle: "Android, iOS, and cross-platform builds",
    kpis: [
      { label: "In progress", value: "3", delta: "+1", up: true },
      { label: "In QA", value: "2", delta: "0", up: true },
      { label: "Shipped", value: "5", delta: "+1", up: true },
      { label: "Crash-free rate", value: "99.2%", delta: "+0.3%", up: true },
    ],
    listLabel: "Active app projects",
    items: [
      { title: "PulseFit — Flutter app", sub: "Dark theme, chat + booking", tag: "In progress", tagColor: "violet" },
      { title: "Vertex Driver App", sub: "Cross-platform, in QA", tag: "In QA", tagColor: "amber" },
    ],
  },
  aiprojects: {
    subtitle: "Custom AI agent builds delivered to clients",
    kpis: [
      { label: "Deployed", value: "9", delta: "+2", up: true },
      { label: "In training", value: "4", delta: "+1", up: true },
      { label: "Avg. response time", value: "1.8s", delta: "-0.4s", up: true },
      { label: "Client satisfaction", value: "94%", delta: "+2%", up: true },
    ],
    listLabel: "AI agent projects",
    items: [
      { title: "Northstar Clinic — appointment agent", sub: "WhatsApp + voice", tag: "Deployed", tagColor: "cyan" },
      { title: "Vertex Logistics — support bot", sub: "Website chatbot", tag: "In training", tagColor: "violet" },
    ],
  },
  erpprojects: {
    subtitle: "ERP, CRM, and POS systems in delivery",
    kpis: [
      { label: "Active builds", value: "5", delta: "+1", up: true },
      { label: "Modules shipped", value: "27", delta: "+4", up: true },
      { label: "Uptime", value: "99.9%", delta: "0%", up: true },
      { label: "Support tickets", value: "6", delta: "-2", up: true },
    ],
    listLabel: "ERP / CRM / POS projects",
    items: [
      { title: "Northstar Clinic — Hospital ERP", sub: "Patient records module", tag: "In progress", tagColor: "violet" },
      { title: "Kavya Boutique — POS", sub: "Inventory + billing", tag: "Delivered", tagColor: "cyan" },
    ],
  },
  taskboard: {
    subtitle: "Everything the delivery team is working on, right now",
    kpis: [
      { label: "To do", value: "14", delta: "", up: true },
      { label: "In progress", value: "9", delta: "", up: true },
      { label: "In review", value: "5", delta: "", up: true },
      { label: "Done this week", value: "22", delta: "+6", up: true },
    ],
    listLabel: "Recent task activity",
    items: [
      { title: "Fix cart validation — Kavya Boutique", sub: "Assigned to Priya", tag: "In progress", tagColor: "violet" },
      { title: "Deploy chatbot v2 — Vertex", sub: "Assigned to Aman", tag: "In review", tagColor: "amber" },
      { title: "Write API docs — Orbiq", sub: "Assigned to Rohit", tag: "To do", tagColor: "gray" },
    ],
  },
  launches: {
    subtitle: "SaaS release history and what's shipping next",
    kpis: [
      { label: "Shipped this quarter", value: "3", delta: "+1", up: true },
      { label: "In beta", value: "2", delta: "0", up: true },
      { label: "Planned", value: "4", delta: "+1", up: true },
    ],
    listLabel: "Launch timeline",
    items: [
      { title: "Orbiq v2.3 — automation rules", sub: "Shipped this month", tag: "Live", tagColor: "cyan" },
      { title: "Cyberlim Leads ERP — proposal builder", sub: "In beta", tag: "Beta", tagColor: "violet" },
      { title: "NeuroFitness — trainer dashboard", sub: "Planned next quarter", tag: "Planned", tagColor: "gray" },
    ],
  },
  subscriptions: {
    subtitle: "Recurring revenue across every SaaS product",
    kpis: [
      { label: "MRR", value: "₹4.8L", delta: "+11%", up: true },
      { label: "Active subs", value: "312", delta: "+24", up: true },
      { label: "Churn", value: "2.1%", delta: "-0.4%", up: true },
      { label: "ARPU", value: "₹1,540", delta: "+5%", up: true },
    ],
    listLabel: "Top paying accounts",
    items: [
      { title: "Vertex Logistics", sub: "Orbiq — Pro plan", tag: "₹18,000/mo", tagColor: "cyan" },
      { title: "PulseFit Studio", sub: "NeuroFitness — Team plan", tag: "₹9,500/mo", tagColor: "violet" },
    ],
  },
  attendance: {
    subtitle: "Who's in, who's off, and who's on leave today",
    kpis: [
      { label: "Present today", value: "11/14", delta: "", up: true },
      { label: "On leave", value: "2", delta: "", up: true },
      { label: "Avg. attendance", value: "93%", delta: "+1%", up: true },
    ],
    listLabel: "Today's status",
    items: [
      { title: "Priya Sharma", sub: "Frontend", tag: "Present", tagColor: "cyan" },
      { title: "Aman Verma", sub: "Backend", tag: "Present", tagColor: "cyan" },
      { title: "Sana Khan", sub: "Design", tag: "On leave", tagColor: "amber" },
    ],
  },
  payroll: {
    subtitle: "Stipends, salaries, and deferred pay tracker",
    kpis: [
      { label: "This month total", value: "₹3.2L", delta: "+6%", up: true },
      { label: "Paid on time", value: "12/14", delta: "", up: true },
      { label: "Deferred", value: "₹40,000", delta: "-₹10,000", up: true },
    ],
    listLabel: "Pending payouts",
    items: [
      { title: "Priya Sharma", sub: "Stipend — March", tag: "Paid", tagColor: "cyan" },
      { title: "Aman Verma", sub: "Deferred salary", tag: "Pending", tagColor: "amber" },
    ],
  },
  finance: {
    subtitle: "Invoices, payments, and outstanding amounts",
    kpis: [
      { label: "Revenue this month", value: "₹9.6L", delta: "+14%", up: true },
      { label: "Outstanding", value: "₹1.8L", delta: "-6%", up: true },
      { label: "Expenses", value: "₹3.1L", delta: "+3%", up: false },
      { label: "AMC revenue", value: "₹62,000", delta: "+9%", up: true },
    ],
    listLabel: "Recent invoices",
    items: [
      { title: "INV-1042 — Vertex Logistics", sub: "Due in 5 days", tag: "₹1,80,000", tagColor: "violet" },
      { title: "INV-1039 — Kavya Boutique", sub: "Paid 2 days ago", tag: "₹95,000", tagColor: "cyan" },
      { title: "INV-1035 — Northstar Clinic", sub: "Overdue by 3 days", tag: "₹2,40,000", tagColor: "coral" },
    ],
  },
  marketing: {
    subtitle: "Meta Ads performance across all three service lines",
    kpis: [
      { label: "Ad spend", value: "₹86,000", delta: "+12%", up: true },
      { label: "Leads generated", value: "142", delta: "+19%", up: true },
      { label: "Cost per lead", value: "₹605", delta: "-8%", up: true },
      { label: "CTR", value: "3.4%", delta: "+0.5%", up: true },
    ],
    listLabel: "Campaigns",
    items: [
      { title: "SaaS app development", sub: "Meta Ads · India", tag: "Active", tagColor: "cyan" },
      { title: "Informative websites", sub: "Meta Ads · India", tag: "Active", tagColor: "cyan" },
      { title: "E-commerce apps", sub: "Meta Ads · India", tag: "Paused", tagColor: "gray" },
    ],
  },
  reports: {
    subtitle: "Cross-team performance, rolled up",
    kpis: [
      { label: "Revenue growth", value: "+22%", delta: "QoQ", up: true },
      { label: "Delivery on-time rate", value: "91%", delta: "+3%", up: true },
      { label: "Team utilization", value: "87%", delta: "+2%", up: true },
    ],
    listLabel: "Recent reports",
    items: [
      { title: "Q1 revenue breakdown", sub: "Generated 2 days ago", tag: "Ready", tagColor: "cyan" },
      { title: "Team productivity — March", sub: "Generated 5 days ago", tag: "Ready", tagColor: "cyan" },
    ],
  },
  security: {
    subtitle: "Audits, pen tests, and client server security posture",
    kpis: [
      { label: "Audits this month", value: "4", delta: "+1", up: true },
      { label: "Open vulnerabilities", value: "2", delta: "-3", up: true },
      { label: "Servers monitored", value: "19", delta: "+2", up: true },
    ],
    listLabel: "Recent findings",
    items: [
      { title: "Northstar Clinic — server audit", sub: "2 medium findings, patched", tag: "Resolved", tagColor: "cyan" },
      { title: "Vertex Logistics — pen test", sub: "Scheduled next week", tag: "Scheduled", tagColor: "gray" },
    ],
  },
  cloud: {
    subtitle: "Hosting, uptime, and deployment status",
    kpis: [
      { label: "Servers live", value: "22", delta: "+2", up: true },
      { label: "Avg. uptime", value: "99.94%", delta: "+0.02%", up: true },
      { label: "Incidents this month", value: "1", delta: "-2", up: true },
    ],
    listLabel: "Infrastructure",
    items: [
      { title: "Orbiq — production", sub: "AWS · Mumbai region", tag: "Healthy", tagColor: "cyan" },
      { title: "Cyberlim Leads ERP — staging", sub: "VPS · Digital Ocean", tag: "Healthy", tagColor: "cyan" },
    ],
  },
  devops: {
    subtitle: "Build pipelines and deployment history",
    kpis: [
      { label: "Deploys this week", value: "17", delta: "+5", up: true },
      { label: "Build success rate", value: "97%", delta: "+1%", up: true },
      { label: "Avg. build time", value: "2m 14s", delta: "-18s", up: true },
    ],
    listLabel: "Recent deployments",
    items: [
      { title: "Orbiq — v2.3.1", sub: "Deployed 3 hours ago", tag: "Success", tagColor: "cyan" },
      { title: "Cyberlim Leads ERP — hotfix", sub: "Deployed yesterday", tag: "Success", tagColor: "cyan" },
    ],
  },
  tickets: {
    subtitle: "Client support requests and SLA status",
    kpis: [
      { label: "Open tickets", value: "8", delta: "-2", up: true },
      { label: "Avg. response time", value: "38 min", delta: "-6 min", up: true },
      { label: "SLA compliance", value: "96%", delta: "+2%", up: true },
    ],
    listLabel: "Open tickets",
    items: [
      { title: "#2291 — login issue", sub: "Vertex Logistics", tag: "In progress", tagColor: "violet" },
      { title: "#2287 — invoice mismatch", sub: "Kavya Boutique", tag: "Waiting on client", tagColor: "amber" },
    ],
  },
  docs: {
    subtitle: "SOPs, manuals, and credential vaults",
    kpis: [
      { label: "Documents", value: "64", delta: "+5", up: true },
      { label: "Updated this month", value: "12", delta: "+3", up: true },
    ],
    listLabel: "Recently updated",
    items: [
      { title: "Client onboarding SOP", sub: "Updated 2 days ago", tag: "SOP", tagColor: "violet" },
      { title: "Orbiq API reference", sub: "Updated 6 days ago", tag: "Manual", tagColor: "cyan" },
    ],
  },
  legal: {
    subtitle: "NDAs, agreements, and e-signature status",
    kpis: [
      { label: "Active contracts", value: "18", delta: "+2", up: true },
      { label: "Pending signature", value: "3", delta: "0", up: true },
      { label: "Renewals due", value: "4", delta: "+1", up: true },
    ],
    listLabel: "Contracts",
    items: [
      { title: "Vertex Logistics — MSA", sub: "Signed", tag: "Active", tagColor: "cyan" },
      { title: "Northstar Clinic — NDA", sub: "Awaiting signature", tag: "Pending", tagColor: "amber" },
    ],
  },
  hr: {
    subtitle: "Open roles and candidate pipeline",
    kpis: [
      { label: "Open roles", value: "3", delta: "+1", up: true },
      { label: "Applicants", value: "47", delta: "+12", up: true },
      { label: "Interviews this week", value: "6", delta: "+2", up: true },
    ],
    listLabel: "Open roles",
    items: [
      { title: "Frontend developer", sub: "12 applicants", tag: "Interviewing", tagColor: "violet" },
      { title: "AI engineer", sub: "9 applicants", tag: "Screening", tagColor: "gray" },
    ],
  },
  settings: {
    subtitle: "Company profile, roles, and integrations",
    kpis: [
      { label: "Team members", value: "14", delta: "", up: true },
      { label: "Integrations connected", value: "6", delta: "+1", up: true },
    ],
    listLabel: "Integrations",
    items: [
      { title: "WhatsApp Business API", sub: "Connected", tag: "Active", tagColor: "cyan" },
      { title: "Razorpay", sub: "Connected", tag: "Active", tagColor: "cyan" },
    ],
  },
};

const TAG_COLORS: Record<string, string> = {
  cyan: "text-[#0d9fb8] bg-[#22d3ee]/12 border-[#22d3ee]/30 dark:text-[#22d3ee]",
  violet: "text-[#6d4fd6] bg-[#8b6cf6]/12 border-[#8b6cf6]/30 dark:text-[#a78bfa]",
  blue: "text-[#3568c9] bg-[#4f8cf7]/12 border-[#4f8cf7]/30 dark:text-[#7aa8ff]",
  amber: "text-amber-600 bg-amber-400/12 border-amber-400/30 dark:text-amber-400",
  coral: "text-rose-600 bg-rose-400/12 border-rose-400/30 dark:text-rose-400",
  gray: "text-zinc-500 bg-zinc-400/12 border-zinc-400/30",
};

/* ─────────────────────────────────────────────────────────────
   SMALL UI PRIMITIVES
───────────────────────────────────────────────────────────── */
function GlassCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={`relative rounded-[20px] border backdrop-blur-xl p-5 transition-colors duration-300 ${theme === "dark" ? "shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : "shadow-[0_8px_30px_rgba(80,60,180,0.07)]"
        } ${className}`}
      style={{ background: t.cardBg, borderColor: t.border }}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ label, value, delta, up, icon: Icon, delay = 0 }: { label: string; value: string; delta: string; up: boolean; icon?: any; delay?: number }) {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  return (
    <GlassCard delay={delay} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(139,108,246,0.18), rgba(34,211,238,0.18))" }}>
            <Icon size={15} weight="bold" className="text-[#8b6cf6]" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-2xl font-bold tracking-tight ${t.textPrimary}`}>{value}</span>
        {delta && (
          <span className={`flex items-center gap-0.5 text-[11px] font-bold ${up ? "text-[#0d9fb8] dark:text-[#22d3ee]" : "text-rose-500"}`}>
            {up ? <ArrowUpRight size={12} weight="bold" /> : <ArrowDownRight size={12} weight="bold" />}
            {delta}
          </span>
        )}
      </div>
    </GlassCard>
  );
}

function ListCard({ label, items, delay = 0 }: { label: string; items: GenericContent["items"]; delay?: number }) {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  return (
    <GlassCard delay={delay}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-bold ${t.textPrimary}`}>{label}</h3>
        <button className="text-[10px] font-bold text-[#8b6cf6] hover:underline">View all</button>
      </div>
      <div className="space-y-1">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.06 }}
            className="flex items-center justify-between gap-3 py-2.5 last:border-0"
            style={{ borderBottom: `1px solid ${t.divider}` }}
          >
            <div className="min-w-0">
              <p className={`text-xs font-semibold truncate ${t.textPrimary}`}>{it.title}</p>
              <p className="text-[10px] text-zinc-500 truncate">{it.sub}</p>
            </div>
            <span className={`shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${TAG_COLORS[it.tagColor] || TAG_COLORS.gray}`}>
              {it.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className={`text-xl font-bold tracking-tight ${t.textPrimary}`}>{title}</h1>
      <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DIGITAL CLOCK
───────────────────────────────────────────────────────────── */
function DigitalClock() {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!now) return null;
  let h = now.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return (
    <div
      className="w-full rounded-2xl border p-4 text-center"
      style={{ borderColor: t.border, background: theme === "dark" ? "linear-gradient(160deg, rgba(139,108,246,0.10), rgba(34,211,238,0.06))" : "linear-gradient(160deg, rgba(139,108,246,0.08), rgba(34,211,238,0.05))" }}
    >
      <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5">{day}</p>
      <div className="flex items-center justify-center gap-1 font-mono">
        <span className={`text-xl font-bold tabular-nums ${t.textPrimary}`}>{pad(h)}</span>
        <motion.span animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1, repeat: Infinity }} className={`text-xl font-bold ${GRADIENT_TEXT}`}>:</motion.span>
        <span className={`text-xl font-bold tabular-nums ${t.textPrimary}`}>{pad(now.getMinutes())}</span>
        <span className={`text-xl font-bold ${GRADIENT_TEXT}`}>:</span>
        <span className={`text-xl font-bold tabular-nums ${t.textPrimary}`}>{pad(now.getSeconds())}</span>
      </div>
      <p className="text-[10px] font-bold text-[#8b6cf6] mt-1">{ampm} IST</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LEFT SIDEBAR — slim industry rail + expandable section panel
───────────────────────────────────────────────────────────── */
function Sidebar({
  activeIndustry, setActiveIndustry, activeSection, setActiveSection,
}: {
  activeIndustry: IndustryId;
  setActiveIndustry: (i: IndustryId) => void;
  activeSection: string;
  setActiveSection: (s: string) => void;
}) {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  const [open, setOpen] = useState(true);
  const groups = SECTIONS_BY_INDUSTRY[activeIndustry];

  return (
    <div className="flex h-screen shrink-0">
      {/* slim icon rail */}
      <div className="w-[72px] h-full border-r flex flex-col items-center py-4 gap-2" style={{ borderColor: t.border, background: t.railBg }}>
        <div className={`w-9 h-9 rounded-xl ${GRADIENT_BG} flex items-center justify-center font-bold text-white text-sm mb-3 shadow-lg shadow-violet-500/20`}>C</div>
        {INDUSTRIES.map(ind => {
          const Icon = ind.icon;
          const active = activeIndustry === ind.id;
          return (
            <motion.button
              key={ind.id}
              onClick={() => { setActiveIndustry(ind.id); setOpen(true); setActiveSection(SECTIONS_BY_INDUSTRY[ind.id][0].items[0].id); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              title={ind.label}
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center transition-colors"
              style={active ? { background: "linear-gradient(135deg, #8b6cf6, #22d3ee)" } : { background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(20,20,40,0.04)" }}
            >
              <Icon size={18} weight={active ? "fill" : "regular"} className={active ? "text-white" : "text-zinc-500"} />
              {active && (
                <motion.div layoutId="industry-glow" className="absolute inset-0 rounded-2xl" style={{ boxShadow: "0 0 18px rgba(139,108,246,0.5)" }} />
              )}
            </motion.button>
          );
        })}
        <button
          onClick={() => setOpen(v => !v)}
          className={`mt-auto w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${t.navIdleText} ${t.navHover}`}
        >
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <CaretRight size={14} weight="bold" />
          </motion.div>
        </button>
      </div>

      {/* expandable section panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 236, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="h-full border-r overflow-hidden flex flex-col"
            style={{ borderColor: t.border, background: t.panelBg }}
          >
            <div className="px-4 py-4 border-b" style={{ borderColor: t.border }}>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Cyberlim Group</p>
              <p className={`text-sm font-bold ${GRADIENT_TEXT}`}>{INDUSTRIES.find(i => i.id === activeIndustry)?.label}</p>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
              {groups.map(g => (
                <div key={g.group}>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold px-2 pb-1.5">{g.group}</p>
                  <div className="space-y-0.5">
                    {g.items.map(item => {
                      const Icon = item.icon;
                      const active = activeSection === item.id;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11.5px] font-semibold transition-colors ${active ? "text-white" : `${t.navIdleText} ${t.navHover}`
                            }`}
                          style={active ? { background: "linear-gradient(90deg, rgba(139,108,246,0.28), rgba(34,211,238,0.14))" } : {}}
                        >
                          <Icon size={14} weight={active ? "fill" : "regular"} className={active ? "text-[#22d3ee]" : ""} />
                          <span className="truncate">{item.label}</span>
                          {active && <Circle size={5} weight="fill" className="ml-auto text-[#22d3ee]" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t" style={{ borderColor: t.border }}>
              <DigitalClock />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CHART THEME HELPERS
───────────────────────────────────────────────────────────── */
function useChartOpts() {
  const { theme } = useThemeCtx();
  const chartTextColor = theme === "dark" ? "#7a7a90" : "#8a8a9c";
  const chartGrid = theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(20,20,40,0.06)";
  const tooltipBg = theme === "dark" ? "#181826" : "#ffffff";
  const lineOpts: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true, backgroundColor: tooltipBg, titleColor: theme === "dark" ? "#fff" : "#18181b", bodyColor: theme === "dark" ? "#fff" : "#18181b", borderColor: "rgba(139,108,246,0.2)", borderWidth: 1 } },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartTextColor, font: { size: 10 } } },
      y: { grid: { color: chartGrid }, ticks: { color: chartTextColor, font: { size: 10 } } },
    },
  };
  return { lineOpts, barOpts: lineOpts };
}

const revenueLineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [{
    label: "Revenue",
    data: [4.2, 5.1, 4.8, 6.4, 7.2, 9.6],
    borderColor: "#8b6cf6",
    backgroundColor: (ctx: any) => {
      const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
      g.addColorStop(0, "rgba(139,108,246,0.35)");
      g.addColorStop(1, "rgba(34,211,238,0.02)");
      return g;
    },
    borderWidth: 3, pointRadius: 0, pointHoverRadius: 5, tension: 0.4, fill: true,
  }],
};

const leadsBySourceData = {
  labels: ["SaaS ads", "Website ads", "E-comm ads", "Referral"],
  datasets: [{
    data: [42, 35, 28, 19],
    backgroundColor: ["#8b6cf6", "#6d8cf7", "#22d3ee", "rgba(139,108,246,0.25)"],
    borderRadius: 8, borderSkipped: false, barThickness: 26,
  }],
};

const pipelineDonutData = {
  labels: ["Qualified", "Contacted", "New", "Meeting booked"],
  datasets: [{
    data: [16, 24, 38, 9],
    backgroundColor: ["#22d3ee", "#6d8cf7", "#8b6cf6", "rgba(139,108,246,0.2)"],
    borderWidth: 3, borderColor: "#ffffff00",
  }],
};

const mrrLineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [{
    data: [2.1, 2.6, 3.0, 3.6, 4.1, 4.8],
    borderColor: "#22d3ee", borderWidth: 3, pointRadius: 0, tension: 0.4, fill: false,
  }],
};

/* ─────────────────────────────────────────────────────────────
   BESPOKE SECTIONS
───────────────────────────────────────────────────────────── */
function OverviewSection() {
  const { theme } = useThemeCtx();
  return <OverviewComponent theme={theme} />;
}

function LeadsSection() {
  const { theme } = useThemeCtx();
  return <LeadsComponent theme={theme} />;
}

function PipelineSection() {
  const { theme } = useThemeCtx();
  return <PipelineComponent theme={theme} />;
}

function ProposalsSection() {
  const { theme } = useThemeCtx();
  return <ProposalsComponent theme={theme} />;
}

function SaasSection() {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  const { lineOpts } = useChartOpts();
  const products = [
    { name: "Orbiq", desc: "Leads, team & automation SaaS", users: "1,240 users", mrr: "₹2.9L MRR", status: "Live" },
    { name: "Cyberlim Leads ERP", desc: "CRM for internal sales", users: "14 users", mrr: "Internal", status: "In build" },
    { name: "NeuroFitness", desc: "Gym & trainer management", users: "312 users", mrr: "₹1.1L MRR", status: "Live" },
    { name: "360payZ", desc: "B2B payments platform", users: "58 users", mrr: "₹80,000 MRR", status: "Beta" },
  ];
  return (
    <div className="space-y-5">
      <SectionHeader title="SaaS products" subtitle="Every product Cyberlim builds, owns, and sells as a subscription" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Live products" value="2" delta="" up icon={Rocket} />
        <StatCard label="Total MRR" value="₹4.8L" delta="+11%" up icon={ChartLineUp} delay={0.05} />
        <StatCard label="Active users" value="1,624" delta="+9%" up icon={UsersThree} delay={0.1} />
        <StatCard label="Churn" value="2.1%" delta="-0.4%" up icon={GitBranch} delay={0.15} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((p, i) => (
          <GlassCard key={p.name} delay={0.1 + i * 0.05}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${GRADIENT_BG} flex items-center justify-center font-bold text-white text-sm`}>{p.name[0]}</div>
                <div>
                  <p className={`text-sm font-bold ${t.textPrimary}`}>{p.name}</p>
                  <p className="text-[10px] text-zinc-500">{p.desc}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${TAG_COLORS[p.status === "Live" ? "cyan" : p.status === "Beta" ? "violet" : "gray"]}`}>{p.status}</span>
            </div>
            <div className="flex justify-between mt-4 pt-4 text-xs" style={{ borderTop: `1px solid ${t.divider}` }}>
              <span className="text-zinc-500">{p.users}</span>
              <span className={`font-bold ${t.textPrimary}`}>{p.mrr}</span>
            </div>
          </GlassCard>
        ))}
      </div>
      <GlassCard delay={0.3}>
        <h3 className="text-sm font-bold mb-4">MRR growth</h3>
        <div className="h-[180px]"><Line data={mrrLineData} options={lineOpts} /></div>
      </GlassCard>
    </div>
  );
}

function TeamSection() {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  const team = [
    { name: "Rohit Sengar", role: "Founder", util: 96 },
    { name: "Priya Sharma", role: "Frontend developer", util: 88 },
    { name: "Aman Verma", role: "Backend developer", util: 91 },
    { name: "Sana Khan", role: "Product designer", util: 82 },
    { name: "Ishaan Rao", role: "AI engineer", util: 85 },
    { name: "Meera Joshi", role: "QA & testing", util: 78 },
  ];
  return (
    <div className="space-y-5">
      <SectionHeader title="Team directory" subtitle="Roles, workload, and utilization across the whole team" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Team size" value="14" delta="+2" up icon={UsersThree} />
        <StatCard label="Avg. utilization" value="87%" delta="+2%" up icon={ChartLineUp} delay={0.05} />
        <StatCard label="Present today" value="11/14" delta="" up icon={CalendarCheck} delay={0.1} />
        <StatCard label="Open roles" value="3" delta="+1" up icon={UserFocus} delay={0.15} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {team.map((m, i) => (
          <GlassCard key={m.name} delay={0.08 + i * 0.04}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full ${GRADIENT_BG} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                {m.name.split(" ").map(w => w[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${t.textPrimary}`}>{m.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{m.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
              <span>Utilization</span><span className={`font-bold ${t.textPrimary}`}>{m.util}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(20,20,40,0.06)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${m.util}%` }} transition={{ duration: 0.8, delay: 0.2 }} className={GRADIENT_BG + " h-full"} />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function AgentsSection() {
  const { theme } = useThemeCtx();
  const t = tokens(theme);
  const agents = [
    { name: "Sales agent", desc: "Follow-up, qualify, book meetings", tasks: 214, icon: Target },
    { name: "Support agent", desc: "Answer queries, create tickets", tasks: 388, icon: Headset },
    { name: "HR agent", desc: "Screen resumes, schedule interviews", tasks: 42, icon: UserFocus },
    { name: "Finance agent", desc: "Invoice & payment follow-up", tasks: 96, icon: Receipt },
    { name: "Marketing agent", desc: "Campaigns, nurturing, posting", tasks: 63, icon: Megaphone },
    { name: "Operations agent", desc: "Task assignment, tracking", tasks: 158, icon: Kanban },
  ];
  return (
    <div className="space-y-5">
      <SectionHeader title="AI agents console" subtitle="Every automated agent deployed across Cyberlim and client work" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active agents" value="6" delta="" up icon={Brain} />
        <StatCard label="Tasks handled today" value="961" delta="+18%" up icon={ChartLineUp} delay={0.05} />
        <StatCard label="Avg. response time" value="1.8s" delta="-0.4s" up icon={Sparkle} delay={0.1} />
        <StatCard label="Client satisfaction" value="94%" delta="+2%" up icon={Target} delay={0.15} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((a, i) => {
          const Icon = a.icon;
          return (
            <GlassCard key={a.name} delay={0.08 + i * 0.05}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${GRADIENT_BG} flex items-center justify-center shrink-0`}>
                  <Icon size={18} weight="bold" className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${t.textPrimary}`}>{a.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{a.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${t.divider}` }}>
                <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                  Active
                </span>
                <span className={`text-xs font-bold ${t.textPrimary}`}>{a.tasks} tasks</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

function GenericSection({ id, label }: { id: string; label: string }) {
  const c = GENERIC[id];
  if (!c) {
    return (
      <div className="space-y-5">
        <SectionHeader title={label} subtitle="Module launching soon for this industry" />
        <GlassCard>
          <div className="py-14 text-center">
            <Sparkle size={22} className="mx-auto text-[#8b6cf6] mb-3" />
            <p className="text-sm text-zinc-500">This module is on the roadmap. Check back soon.</p>
          </div>
        </GlassCard>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <SectionHeader title={label} subtitle={c.subtitle} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {c.kpis.map((k, i) => <StatCard key={k.label} {...k} delay={i * 0.05} />)}
      </div>
      <ListCard label={c.listLabel} items={c.items} delay={0.15} />
    </div>
  );
}

const BESPOKE: Record<string, React.FC> = {
  overview: OverviewSection,
  leads: LeadsSection,
  pipeline: PipelineSection,
  proposals: ProposalsSection,
  saas: SaasSection,
  team: TeamSection,
  agents: AgentsSection,
};

/* ─────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────── */
function DashboardShell() {
  const { theme, toggleTheme } = useThemeCtx();
  const t = tokens(theme);
  const [activeIndustry, setActiveIndustry] = useState<IndustryId>("it");
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [search, setSearch] = useState("");

  const currentLabel = useMemo(() => {
    for (const g of SECTIONS_BY_INDUSTRY[activeIndustry]) {
      const found = g.items.find(i => i.id === activeSection);
      if (found) return found.label;
    }
    return "Overview";
  }, [activeIndustry, activeSection]);

  const Bespoke = BESPOKE[activeSection];

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans transition-colors duration-300" style={{ background: t.pageBg }}>
      {/* ambient gradient glows */}
      <div className="pointer-events-none fixed top-[-10%] left-[10%] w-[420px] h-[420px] rounded-full blur-[130px]" style={{ background: "#8b6cf6", opacity: t.glowOpacity }} />
      <div className="pointer-events-none fixed bottom-[-15%] right-[20%] w-[380px] h-[380px] rounded-full blur-[120px]" style={{ background: "#22d3ee", opacity: t.glowOpacity * 0.8 }} />

      {/* left sidebar */}
      <Sidebar
        activeIndustry={activeIndustry}
        setActiveIndustry={setActiveIndustry}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* main column */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        {/* topbar */}
        <header className="h-16 shrink-0 border-b flex items-center justify-between px-6 transition-colors duration-300" style={{ borderColor: t.border, background: t.headerBg, backdropFilter: "blur(16px)" }}>
          <div>
            <p className={`text-sm font-bold leading-none ${t.textPrimary}`}>Cyberlim IT</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Operations dashboard</p>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="flex items-center gap-2 w-full rounded-xl border px-3 py-2" style={{ borderColor: t.border, background: t.inputBg }}>
              <MagnifyingGlass size={14} className="text-zinc-500" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search projects, clients, leads..."
                className={`bg-transparent text-xs placeholder:text-zinc-500 outline-none w-full ${t.textPrimary}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className={`p-2 rounded-xl transition-colors ${theme === "dark" ? "text-[#a78bfa] hover:bg-white/5" : "text-[#6d4fd6] hover:bg-black/5"}`}
            >
              {theme === "dark" ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
            </button>
            <div className="w-px h-4" style={{ background: t.border }} />
            <button className={`relative p-2 rounded-xl transition-colors ${t.navIdleText} ${t.navHover}`}>
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
            </button>
            <button className={`p-2 rounded-xl transition-colors ${t.navIdleText} ${t.navHover}`}>
              <DotsThreeVertical size={16} />
            </button>
          </div>
        </header>

        {/* content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {Bespoke ? <Bespoke /> : <GenericSection id={activeSection} label={currentLabel} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function CyberlimITDashboard() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("cyberlim_theme") : null;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") window.localStorage.setItem("cyberlim_theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <DashboardShell />
    </ThemeContext.Provider>
  );
}