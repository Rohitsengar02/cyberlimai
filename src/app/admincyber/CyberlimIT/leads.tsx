"use client";

import React, { useState } from "react";
import {
  Tray, Sparkle, Target, ChartLineUp, Envelope, Phone, Calendar,
  User, CheckCircle, Clock, ChatCenteredText, ArrowLeft, PlusCircle,
  Tag, IdentificationBadge, DotsThreeVertical, Export, Funnel, CaretLeft, CaretRight,
  Heart, Chats, DeviceMobile, FileText
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineEvent {
  date: string;
  time: string;
  type: string;
  duration: string;
  location: string;
  note: string;
  status: "Completed" | "Pending" | "Missed";
}

interface Lead {
  id: string;
  client: string;
  source: string;
  budget: string;
  stage: "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";
  employeeName: string;
  employeeRole: string;
  employeeAvatar: string;
  employeeCartoon: string; // Cartoon Emoji / Icon
  email: string;
  phone: string;
  createdDate: string;
  leadAge: string;
  totalTouchpoints: string;
  callsMade: string;
  proposalsSent: string;
  industry: string;
  coverGradient: string; // Tailored CSS gradient
  timeline: TimelineEvent[];
}

const INITIAL_LEADS: Lead[] = [
  {
    id: "LEAD-1042",
    client: "Radiant Interiors",
    source: "Meta Ads",
    budget: "₹4.5L",
    stage: "Qualified",
    employeeName: "Priya Sharma",
    employeeRole: "Frontend Dev",
    employeeAvatar: "PS",
    employeeCartoon: "👩‍💻",
    email: "contact@radiantinteriors.in",
    phone: "+91 98765 43210",
    createdDate: "28 Jun 2026",
    leadAge: "3 Days",
    totalTouchpoints: "12",
    callsMade: "5",
    proposalsSent: "2",
    industry: "Real Estate",
    coverGradient: "from-[#8b6cf6] via-[#6d5cf0] to-[#22d3ee]",
    timeline: [
      { date: "1st July 2026", time: "10:30 AM", type: "Discovery Call", duration: "18 mins", location: "Phone Call", note: "Gathered initial animation requirements. Client wants Next.js + GSAP.", status: "Completed" },
      { date: "2nd July 2026", time: "03:30 PM", type: "Sent Proposal", duration: "-", location: "Email", note: "Sent quotation PDF and case study documentation.", status: "Completed" },
      { date: "3rd July 2026", time: "11:15 AM", type: "Follow-up Session", duration: "10 mins", location: "Zoom", note: "Client requested budget optimization changes.", status: "Pending" }
    ]
  },
  {
    id: "LEAD-1043",
    client: "Kavya Boutique Store",
    source: "Website Form",
    budget: "₹2.8L",
    stage: "Proposal",
    employeeName: "Rohit Sengar",
    employeeRole: "Founder",
    employeeAvatar: "RS",
    employeeCartoon: "🧔",
    email: "info@kavyaboutique.com",
    phone: "+91 87654 32109",
    createdDate: "29 Jun 2026",
    leadAge: "2 Days",
    totalTouchpoints: "8",
    callsMade: "3",
    proposalsSent: "1",
    industry: "E-Commerce",
    coverGradient: "from-[#ec4899] via-[#8b5cf6] to-[#6366f1]",
    timeline: [
      { date: "29 Jun 2026", time: "09:00 AM", type: "Website Inquiry", duration: "-", location: "Web Form", note: "Requested Shopify-style e-commerce platform demo.", status: "Completed" },
      { date: "30 Jun 2026", time: "04:30 PM", type: "Discovery Demo", duration: "45 mins", location: "Google Meet", note: "Showcased internal POS & inventory modules.", status: "Completed" },
      { date: "01 Jul 2026", time: "12:00 PM", type: "Agreement Draft", duration: "-", location: "Email", note: "Sent contract terms structure document.", status: "Completed" }
    ]
  },
  {
    id: "LEAD-1044",
    client: "Northstar Clinic",
    source: "Referral",
    budget: "₹6.2L",
    stage: "New",
    employeeName: "Aman Verma",
    employeeRole: "Backend Dev",
    employeeAvatar: "AV",
    employeeCartoon: "👨‍💻",
    email: "admin@northstarclinic.org",
    phone: "+91 76543 21098",
    createdDate: "30 Jun 2026",
    leadAge: "1 Day",
    totalTouchpoints: "4",
    callsMade: "2",
    proposalsSent: "0",
    industry: "Healthcare",
    coverGradient: "from-[#10b981] via-[#059669] to-[#047857]",
    timeline: [
      { date: "30 Jun 2026", time: "06:00 PM", type: "Referral Intake", duration: "-", location: "Referral", note: "Interested in patient records database system.", status: "Completed" },
      { date: "01 Jul 2026", time: "10:15 AM", type: "Discovery Call", duration: "12 mins", location: "Phone Call", note: "Discussed HIPAA data safety specifications.", status: "Completed" }
    ]
  },
  {
    id: "LEAD-1045",
    client: "PulseFit Studio",
    source: "Instagram Ad",
    budget: "₹3.5L",
    stage: "Won",
    employeeName: "Sana Khan",
    employeeRole: "Product Designer",
    employeeAvatar: "SK",
    employeeCartoon: "🧑‍🎨",
    email: "grow@pulsefit.in",
    phone: "+91 65432 10987",
    createdDate: "20 Jun 2026",
    leadAge: "11 Days",
    totalTouchpoints: "24",
    callsMade: "9",
    proposalsSent: "3",
    industry: "SaaS Apps",
    coverGradient: "from-[#f59e0b] via-[#d97706] to-[#b45309]",
    timeline: [
      { date: "20 Jun 2026", time: "11:15 AM", type: "Social Intake", duration: "-", location: "Instagram Form", note: "Lead captured from branding campaign.", status: "Completed" },
      { date: "22 Jun 2026", time: "03:00 PM", type: "UI Review Meeting", duration: "50 mins", location: "Zoom", note: "Presented design system guidelines. Approved.", status: "Completed" },
      { date: "24 Jun 2026", time: "05:00 PM", type: "Contract Finalized", duration: "-", location: "Email", note: "Agreement signed, advance payment verified.", status: "Completed" }
    ]
  },
  {
    id: "LEAD-1046",
    client: "Vertex Logistics",
    source: "Direct",
    budget: "₹8.0L",
    stage: "Proposal",
    employeeName: "Ishaan Rao",
    employeeRole: "AI Engineer",
    employeeAvatar: "IR",
    employeeCartoon: "🤖",
    email: "billing@vertexlogistics.com",
    phone: "+91 99887 76655",
    createdDate: "23 Jun 2026",
    leadAge: "8 Days",
    totalTouchpoints: "15",
    callsMade: "6",
    proposalsSent: "2",
    industry: "Logistics",
    coverGradient: "from-[#3b82f6] via-[#2563eb] to-[#1d4ed8]",
    timeline: [
      { date: "23 Jun 2026", time: "02:00 PM", type: "Office Discovery", duration: "60 mins", location: "On-site", note: "Explored autonomous dispatcher specs.", status: "Completed" },
      { date: "25 Jun 2026", time: "11:00 AM", type: "Sent Proposal", duration: "-", location: "Email", note: "Shared POC telemetry logs architecture and estimates.", status: "Completed" }
    ]
  }
];

const STAGE_COLORS: Record<Lead["stage"], { bg: string; text: string; border: string }> = {
  New: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  Contacted: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  Qualified: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  Proposal: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  Won: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  Lost: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" }
};

export default function LeadsComponent({ theme }: { theme: "dark" | "light" }) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleUpdateStage = (leadId: string, newStage: Lead["stage"]) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, stage: newStage };
      }
      return l;
    });
    setLeads(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, stage: newStage });
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedLead ? (
          /* ── LEADS INBOX GRID VIEW (With custom Card designs) ── */
          <motion.div
            key="grid-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* KPI statistics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Leads", value: leads.length, desc: "Active inquiries in pipeline", icon: Tray, color: "text-purple-400 bg-purple-500/10" },
                { label: "Pending Proposal", value: leads.filter(l => l.stage === "Proposal").length, desc: "Requires follow-up review", icon: Target, color: "text-cyan-400 bg-cyan-500/10" },
                { label: "Deals Closed", value: leads.filter(l => l.stage === "Won").length, desc: "Conversion target met", icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10" },
                { label: "Pipeline Value", value: "₹25.0L", desc: "Total potential portfolio value", icon: ChartLineUp, color: "text-amber-400 bg-amber-500/10" }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={`p-5 rounded-2xl border ${theme === "dark" ? "bg-[#110f1e]/60 border-white/5" : "bg-white border-zinc-200/60 shadow-sm"}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-black tracking-wider text-zinc-550">{item.label}</span>
                      <span className={`p-2 rounded-xl ${item.color}`}><Icon size={14} /></span>
                    </div>
                    <div className={`text-2xl font-black mt-2 ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>{item.value}</div>
                    <p className="text-[9px] text-zinc-500 mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Leads Grid list of Uploaded Card Styles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {leads.map(lead => {
                const stage = STAGE_COLORS[lead.stage] || { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20" };
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`rounded-[24px] border overflow-hidden cursor-pointer transition-all duration-500 hover:translate-y-[-2px] ${
                      theme === "dark"
                        ? "bg-[#110f1e]/60 border-white/5 hover:bg-[#120a2c] hover:border-[#8b6cf6]/50 shadow-lg"
                        : "bg-white border-zinc-200/60 shadow-sm hover:bg-[#faf5ff] hover:border-[#8b6cf6]/50"
                    }`}
                  >
                    {/* 1. Cover Gradient Header */}
                    <div className={`h-28 w-full bg-gradient-to-r ${lead.coverGradient} relative`} />

                    {/* 2. Overlapping Cartoon Avatar & Details */}
                    <div className="px-6 pb-6 relative">
                      <div className="flex justify-between items-end -mt-10 mb-3">
                        <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-[#08080f] flex items-center justify-center text-3xl shadow-xl">
                          {lead.employeeCartoon}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${stage.bg} ${stage.text} ${stage.border}`}>
                          {lead.stage}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-black flex items-center gap-1.5 ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>
                          {lead.client}
                          <CheckCircle size={14} weight="fill" className="text-emerald-500 shrink-0" />
                        </h3>
                        <Heart size={16} className="text-rose-500 hover:scale-110 transition-transform" />
                      </div>
                      
                      <p className="text-[10px] text-zinc-500 font-bold mt-0.5 mb-3">{lead.industry} · {lead.source}</p>

                      {/* Badges row */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[8px] font-black uppercase rounded-lg border border-purple-500/10">
                          {lead.employeeName}
                        </span>
                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[8px] font-black uppercase rounded-lg border border-cyan-500/10">
                          {lead.budget}
                        </span>
                      </div>

                      {/* Stat Metrics Divided Row */}
                      <div className="grid grid-cols-3 gap-2 border-y border-white/5 py-3 mb-4 text-center">
                        <div>
                          <p className={`text-[10px] font-extrabold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{lead.leadAge}</p>
                          <p className="text-[8px] uppercase text-zinc-550 mt-0.5">lead age</p>
                        </div>
                        <div className="border-x border-white/5">
                          <p className={`text-[10px] font-extrabold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{lead.totalTouchpoints}</p>
                          <p className="text-[8px] uppercase text-zinc-555 mt-0.5">touchpoints</p>
                        </div>
                        <div>
                          <p className={`text-[10px] font-extrabold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{lead.budget}</p>
                          <p className="text-[8px] uppercase text-zinc-555 mt-0.5">deal value</p>
                        </div>
                      </div>

                      {/* Bottom Quick actions circular buttons */}
                      <div className="flex justify-between items-center px-2 pt-1">
                        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8b6cf6]/20 hover:text-[#8b6cf6] transition-all flex items-center justify-center text-zinc-400">
                          <Phone size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8b6cf6]/20 hover:text-[#8b6cf6] transition-all flex items-center justify-center text-zinc-400">
                          <Envelope size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8b6cf6]/20 hover:text-[#8b6cf6] transition-all flex items-center justify-center text-zinc-400">
                          <Calendar size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8b6cf6]/20 hover:text-[#8b6cf6] transition-all flex items-center justify-center text-zinc-400">
                          <Chats size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ── HIGH-FIDELITY LEAD DETAIL VIEW (Matched Uploaded Attendance Layout) ── */
          <motion.div
            key="details-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Topbar navigation back */}
            <div className="flex justify-between items-center pb-2">
              <button
                onClick={() => setSelectedLead(null)}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  theme === "dark" ? "text-zinc-400 hover:text-white" : "text-zinc-555 hover:text-zinc-900"
                }`}
              >
                <ArrowLeft size={16} /> Back to Leads Inbox
              </button>

              <div className="flex items-center gap-2">
                <span className="text-zinc-555 text-xs font-bold">Update Status:</span>
                <div className="flex gap-1">
                  {(["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as Lead["stage"][]).map(stg => (
                    <button
                      key={stg}
                      onClick={() => handleUpdateStage(selectedLead.id, stg)}
                      className={`px-2 py-0.5 text-[9px] rounded-lg font-black uppercase transition-all ${
                        selectedLead.stage === stg
                          ? "bg-[#8b6cf6] text-white"
                          : "bg-white/5 text-zinc-400 hover:bg-white/10"
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── TOP SECTION CONTAINER (Grid card) ── */}
            <div className={`p-6 rounded-[24px] border ${
              theme === "dark" ? "bg-[#110f1e]/60 border-white/5" : "bg-white border-zinc-200/60 shadow-sm"
            }`}>
              <h2 className={`text-xs uppercase font-bold tracking-widest ${theme === "dark" ? "text-zinc-400" : "text-zinc-650"} mb-4`}>
                Lead Assignment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Profile Panel (EMP12345 style) */}
                <div className={`md:col-span-5 p-5 rounded-2xl flex items-center gap-4 ${
                  theme === "dark" ? "bg-[#0b0a14]" : "bg-zinc-50/80"
                }`}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-[#110f1e] flex items-center justify-center text-3xl shadow-xl">
                      {selectedLead.employeeCartoon}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#110f1e]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider">{selectedLead.id}</span>
                    </div>
                    <h3 className={`text-lg font-black mt-1 ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>
                      {selectedLead.client}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-zinc-550 font-bold">{selectedLead.industry} (Industry)</p>
                      <span className="px-2 py-0.2 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded">
                        Active Lead
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Metadata Details Table (Department/Role style) */}
                <div className="md:col-span-7 grid grid-cols-2 gap-y-3.5 gap-x-6 text-xs font-medium">
                  <div className="flex justify-between border-b border-zinc-200 dark:border-white/5 pb-2">
                    <span className="text-zinc-555">🏢 Assigned employee</span>
                    <span className={`font-bold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.employeeName}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 dark:border-white/5 pb-2">
                    <span className="text-zinc-555">💰 Est. Project Budget</span>
                    <span className="text-[#8b6cf6] font-extrabold">{selectedLead.budget}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 dark:border-white/5 pb-2">
                    <span className="text-zinc-555">💼 Source origin</span>
                    <span className={`font-bold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.source}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 dark:border-white/5 pb-2">
                    <span className="text-zinc-555">✉️ Contact Email</span>
                    <span className={`font-bold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 dark:border-white/5 pb-2">
                    <span className="text-zinc-555">📞 Phone contact</span>
                    <span className={`font-bold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 dark:border-white/5 pb-2">
                    <span className="text-zinc-555">📅 Initial Date</span>
                    <span className={`font-bold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.createdDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ATTENDANCE SUMMARY CARD (Stats Grid) ── */}
            <div className={`p-6 rounded-[24px] border ${
              theme === "dark" ? "bg-[#110f1e]/60 border-white/5" : "bg-white border-zinc-200/60 shadow-sm"
            }`}>
              <h3 className={`text-xs uppercase font-bold tracking-widest ${theme === "dark" ? "text-zinc-400" : "text-zinc-655"} mb-4`}>
                Pipeline Engagement Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-zinc-200 dark:divide-white/5">
                <div className="pl-4">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Lead Age</p>
                  <p className={`text-xl font-black mt-1 ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.leadAge}</p>
                </div>
                <div className="pl-4">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Total Touchpoints</p>
                  <p className={`text-xl font-black mt-1 ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.totalTouchpoints}</p>
                </div>
                <div className="pl-4">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Calls Logged</p>
                  <p className={`text-xl font-black mt-1 ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.callsMade}</p>
                </div>
                <div className="pl-4">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Proposals Sent</p>
                  <p className={`text-xl font-black mt-1 ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{selectedLead.proposalsSent}</p>
                </div>
              </div>
            </div>

            {/* ── MONTHLY LOG TABLE ── */}
            <div className={`p-6 rounded-[24px] border ${
              theme === "dark" ? "bg-[#110f1e]/60 border-white/5" : "bg-white border-zinc-200/60 shadow-sm"
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-200 dark:border-white/5 gap-4">
                <div className="flex items-center gap-3">
                  <h3 className={`text-sm font-black ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>
                    Communication Log Registry
                  </h3>
                  <div className="flex items-center gap-1.5 text-zinc-555 text-xs">
                    <button className="p-1 hover:text-white" title="Prev Month"><CaretLeft size={14} /></button>
                    <span className="font-bold">June 2026</span>
                    <button className="p-1 hover:text-white" title="Next Month"><CaretRight size={14} /></button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-zinc-300 border border-white/5 cursor-pointer">
                    <Export size={12} /> Export CSV
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-zinc-300 border border-white/5 cursor-pointer">
                    <Funnel size={12} /> Filter
                  </button>
                </div>
              </div>

              {/* Registry Table */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-200 dark:border-white/5 font-bold">
                      <th className="pb-3 pr-4">Start Date</th>
                      <th className="pb-3 pr-4">Action / Touchpoint</th>
                      <th className="pb-3 pr-4">Duration</th>
                      <th className="pb-3 pr-4">Location / Channel</th>
                      <th className="pb-3 pr-4">Note / Feedback</th>
                      <th className="pb-3 pr-4 text-center">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                    {selectedLead.timeline.map((event, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-4 font-mono font-bold text-zinc-400">{event.date} - {event.time}</td>
                        <td className={`py-4 pr-4 font-bold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{event.type}</td>
                        <td className="py-4 pr-4 text-zinc-450 font-bold">{event.duration}</td>
                        <td className="py-4 pr-4 text-zinc-500 font-bold">{event.location}</td>
                        <td className="py-4 pr-4 text-zinc-400 font-medium max-w-[280px] truncate" title={event.note}>{event.note}</td>
                        <td className="py-4 pr-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            event.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="p-1.5 rounded-lg text-zinc-555 hover:text-white" title="Options">
                            <DotsThreeVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
