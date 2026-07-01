"use client";

import React, { useState, useRef } from "react";
import {
  Funnel, Export, Kanban, List, CheckCircle, Phone, Envelope,
  CaretDown, DotsThreeVertical, SquaresFour, Tray, User, Info,
  ArrowsOutCardinal, Calendar, Tag, IdentificationBadge, ArrowLeft, CaretLeft, CaretRight,
  Target
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

interface LeadItem {
  id: string;
  name: string;
  time: string;
  phone: string;
  email: string;
  statusTag: "In Process" | "Dead" | "Recycled";
  stage: "Intake" | "Discovery" | "Proposal" | "Negotiation" | "Finalized";
  source: "Meta Ads" | "Website Form" | "Referral" | "Direct";
  avatar: string;
  budget: string;
  requirements: string;
  employeeName: string;
  employeeRole: string;
  employeeAvatar: string;
  leadAge: string;
  totalTouchpoints: string;
  callsMade: string;
  proposalsSent: string;
  industry: string;
  createdDate: string;
  timeline: TimelineEvent[];
}

const INITIAL_PIPELINE_LEADS: LeadItem[] = [
  {
    id: "LEAD-1042",
    name: "Radiant Interiors",
    time: "Today 10:30PM",
    phone: "+91 98765 43210",
    email: "contact@radiantinteriors.in",
    statusTag: "In Process",
    stage: "Intake",
    source: "Meta Ads",
    avatar: "🏢",
    budget: "₹4.5L",
    requirements: "Client needs a Next.js corporate website with premium GSAP interactive layout animations and CMS blog integration.",
    employeeName: "Priya Sharma",
    employeeRole: "Frontend Dev",
    employeeAvatar: "PS",
    leadAge: "3 Days",
    totalTouchpoints: "12",
    callsMade: "5",
    proposalsSent: "2",
    industry: "Real Estate",
    createdDate: "28 Jun 2026",
    timeline: [
      { date: "1st July 2026", time: "10:30 AM", type: "Discovery Call", duration: "18 mins", location: "Phone Call", note: "Gathered initial animation requirements. Client wants Next.js + GSAP.", status: "Completed" },
      { date: "2nd July 2026", time: "03:30 PM", type: "Sent Proposal", duration: "-", location: "Email", note: "Sent quotation PDF and case study documentation.", status: "Completed" },
      { date: "3rd July 2026", time: "11:15 AM", type: "Follow-up Session", duration: "10 mins", location: "Zoom", note: "Client requested budget optimization changes.", status: "Pending" }
    ]
  },
  {
    id: "LEAD-1043",
    name: "Kavya Boutique Store",
    time: "Today 10:30PM",
    phone: "+91 87654 32109",
    email: "info@kavyaboutique.com",
    statusTag: "In Process",
    stage: "Discovery",
    source: "Website Form",
    avatar: "🛍️",
    budget: "₹2.8L",
    requirements: "Shopify-to-Next.js e-commerce migration. Requires complex multi-currency support, POS integration, and admin portal.",
    employeeName: "Rohit Sengar",
    employeeRole: "Founder",
    employeeAvatar: "RS",
    leadAge: "2 Days",
    totalTouchpoints: "8",
    callsMade: "3",
    proposalsSent: "1",
    industry: "E-Commerce",
    createdDate: "29 Jun 2026",
    timeline: [
      { date: "29 Jun 2026", time: "09:00 AM", type: "Website Inquiry", duration: "-", location: "Web Form", note: "Requested Shopify-style e-commerce platform demo.", status: "Completed" },
      { date: "30 Jun 2026", time: "04:30 PM", type: "Discovery Demo", duration: "45 mins", location: "Google Meet", note: "Showcased internal POS & inventory modules.", status: "Completed" },
      { date: "01 Jul 2026", time: "12:00 PM", type: "Agreement Draft", duration: "-", location: "Email", note: "Sent contract terms structure document.", status: "Completed" }
    ]
  },
  {
    id: "LEAD-1044",
    name: "Northstar Clinic",
    time: "Today 10:30PM",
    phone: "+91 76543 21098",
    email: "admin@northstarclinic.org",
    statusTag: "In Process",
    stage: "Proposal",
    source: "Referral",
    avatar: "🏥",
    budget: "₹6.2L",
    requirements: "HIPAA-compliant hospital patient record ERP backend setup with calendar booking APIs and automated SMS notification queue.",
    employeeName: "Aman Verma",
    employeeRole: "Backend Dev",
    employeeAvatar: "AV",
    leadAge: "1 Day",
    totalTouchpoints: "4",
    callsMade: "2",
    proposalsSent: "0",
    industry: "Healthcare",
    createdDate: "30 Jun 2026",
    timeline: [
      { date: "30 Jun 2026", time: "06:00 PM", type: "Referral Intake", duration: "-", location: "Referral", note: "Interested in patient records database system.", status: "Completed" },
      { date: "01 Jul 2026", time: "10:15 AM", type: "Discovery Call", duration: "12 mins", location: "Phone Call", note: "Discussed HIPAA data safety specifications.", status: "Completed" }
    ]
  },
  {
    id: "LEAD-1045",
    name: "PulseFit Studio",
    time: "Today 10:30PM",
    phone: "+91 65432 10987",
    email: "grow@pulsefit.in",
    statusTag: "Recycled",
    stage: "Negotiation",
    source: "Direct",
    avatar: "🏋️",
    budget: "₹3.5L",
    requirements: "SaaS mobile workout scheduler. Needs clean branding design, dark modes, and offline calendar local caching engine.",
    employeeName: "Sana Khan",
    employeeRole: "Product Designer",
    employeeAvatar: "SK",
    leadAge: "11 Days",
    totalTouchpoints: "24",
    callsMade: "9",
    proposalsSent: "3",
    industry: "SaaS Apps",
    createdDate: "20 Jun 2026",
    timeline: [
      { date: "20 Jun 2026", time: "11:15 AM", type: "Social Intake", duration: "-", location: "Instagram Form", note: "Lead captured from branding campaign.", status: "Completed" },
      { date: "22 Jun 2026", time: "03:00 PM", type: "UI Review Meeting", duration: "50 mins", location: "Zoom", note: "Presented design system guidelines. Approved.", status: "Completed" },
      { date: "24 Jun 2026", time: "05:00 PM", type: "Contract Finalized", duration: "-", location: "Email", note: "Agreement signed, advance payment verified.", status: "Completed" }
    ]
  },
  {
    id: "LEAD-1046",
    name: "Vertex Logistics",
    time: "Today 10:30PM",
    phone: "+91 99887 76655",
    email: "billing@vertexlogistics.com",
    statusTag: "Dead",
    stage: "Finalized",
    source: "Direct",
    avatar: "🚛",
    budget: "₹8.0L",
    requirements: "High-latency fleet optimization portal. Incorporates real-time map updates, route calculations, and driver log tracking API.",
    employeeName: "Ishaan Rao",
    employeeRole: "AI Engineer",
    employeeAvatar: "IR",
    leadAge: "8 Days",
    totalTouchpoints: "15",
    callsMade: "6",
    proposalsSent: "2",
    industry: "Logistics",
    createdDate: "23 Jun 2026",
    timeline: [
      { date: "23 Jun 2026", time: "02:00 PM", type: "Office Discovery", duration: "60 mins", location: "On-site", note: "Explored autonomous dispatcher specs.", status: "Completed" },
      { date: "25 Jun 2026", time: "11:00 AM", type: "Sent Proposal", duration: "-", location: "Email", note: "Shared POC telemetry logs architecture and estimates.", status: "Completed" }
    ]
  }
];

const COLUMNS: { id: LeadItem["stage"]; label: string; dotColor: string }[] = [
  { id: "Intake", label: "Lead Intake", dotColor: "bg-orange-500" },
  { id: "Discovery", label: "Discovery Call", dotColor: "bg-blue-500" },
  { id: "Proposal", label: "Proposal Submitted", dotColor: "bg-yellow-500" },
  { id: "Negotiation", label: "Negotiations", dotColor: "bg-cyan-500" },
  { id: "Finalized", label: "Deal Finalized", dotColor: "bg-emerald-500" }
];

const TAG_STYLES: Record<LeadItem["statusTag"], { bg: string; text: string; border: string }> = {
  "In Process": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  "Dead": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  "Recycled": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" }
};

export default function PipelineComponent({ theme }: { theme: "dark" | "light" }) {
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_PIPELINE_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [sourceFilter, setSourceFilter] = useState<string>("All Sources");
  
  // Hover Tooltip tracking
  const [hoveredLeadId, setHoveredLeadId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Filtering Logic
  const filteredLeads = leads.filter(l => {
    const statusMatch = statusFilter === "All Status" || l.statusTag === statusFilter;
    const sourceMatch = sourceFilter === "All Sources" || l.source === sourceFilter;
    return statusMatch && sourceMatch;
  });

  // Native HTML5 Drag and Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadItem["stage"]) => {
    const leadId = e.dataTransfer.getData("text/plain");
    if (!leadId) return;
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, stage: targetStage } : l))
    );
  };

  const handleStatusChange = (leadId: string, newStatus: LeadItem["statusTag"]) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, statusTag: newStatus } : l))
    );
  };

  const handleUpdateStage = (leadId: string, newStage: LeadItem["stage"]) => {
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

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 16, y: e.clientY + 12 });
  };

  return (
    <div className="space-y-6 relative">
      <AnimatePresence mode="wait">
        {!selectedLead ? (
          /* ── KANBAN & PIPELINE LIST VIEW ── */
          <motion.div
            key="pipeline-board"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* KPI STATS ROW AT TOP */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Active Pipelines", value: leads.length, desc: "IT development projects", icon: Tray, color: "text-purple-400 bg-purple-500/10" },
                { label: "Est. Total Value", value: "₹25.0L", desc: "Pipeline budget summation", icon: Target, color: "text-cyan-400 bg-cyan-500/10" },
                { label: "In Negotiations", value: leads.filter(l => l.stage === "Negotiation").length, desc: "Nearing final sign-off", icon: Funnel, color: "text-amber-400 bg-amber-500/10" },
                { label: "Success Conversion", value: "86%", desc: "Internal sales performance ratio", icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10" }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={`p-5 rounded-2xl border ${
                    theme === "dark" ? "bg-[#110f1e]/60 border-white/5" : "bg-white border-zinc-200/60 shadow-sm"
                  }`}>
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

            {/* FILTERS & CONTROL TOOLBAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Status selector */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                      theme === "dark" ? "bg-[#110f1e]/60 border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <option value="All Status">All Status</option>
                    <option value="In Process">In Process</option>
                    <option value="Dead">Dead</option>
                    <option value="Recycled">Recycled</option>
                  </select>
                  <CaretDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>

                {/* Source selector */}
                <div className="relative">
                  <select
                    value={sourceFilter}
                    onChange={e => setSourceFilter(e.target.value)}
                    className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                      theme === "dark" ? "bg-[#110f1e]/60 border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <option value="All Sources">All Sources</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Website Form">Website Form</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct">Direct</option>
                  </select>
                  <CaretDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* View Switches */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#8b6cf6] border-[#8b6cf6] text-white"
                      : theme === "dark"
                        ? "bg-white/5 border-white/5 text-zinc-400"
                        : "bg-white border-zinc-200 text-zinc-500"
                  }`}
                  title="Kanban Board Grid"
                >
                  <Kanban size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#8b6cf6] border-[#8b6cf6] text-white"
                      : theme === "dark"
                        ? "bg-white/5 border-white/5 text-zinc-400"
                        : "bg-white border-zinc-200 text-zinc-500"
                  }`}
                  title="Table List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* VIEWS PRESENTATION */}
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                /* ── KANBAN COLUMNS GRID ── */
                <motion.div
                  key="kanban-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start"
                >
                  {COLUMNS.map(col => {
                    const colLeads = filteredLeads.filter(l => l.stage === col.id);
                    return (
                      <div
                        key={col.id}
                        onDragOver={handleDragOver}
                        onDrop={e => handleDrop(e, col.id)}
                        className={`space-y-4 rounded-[28px] p-2 border min-h-[480px] ${
                          theme === "dark" ? "bg-[#0d0c15]/40 border-white/5" : "bg-zinc-100/50 border-zinc-200"
                        }`}
                      >
                        {/* Stage Column Header */}
                        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                          theme === "dark" ? "bg-[#110f1e]/40 border-white/5" : "bg-zinc-50 border-zinc-200/60"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                            <span className={`text-[10px] font-black uppercase ${
                              theme === "dark" ? "text-zinc-300" : "text-zinc-700"
                            }`}>{col.label}</span>
                          </div>
                          <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded-full font-bold text-zinc-500">
                            {colLeads.length}
                          </span>
                        </div>

                        {/* Cards Stack */}
                        <div className="space-y-3">
                          {colLeads.map(lead => (
                            <div
                              key={lead.id}
                              draggable
                              onDragStart={e => handleDragStart(e, lead.id)}
                              onClick={() => setSelectedLead(lead)}
                              onMouseEnter={e => { setHoveredLeadId(lead.id); handleMouseMove(e); }}
                              onMouseMove={handleMouseMove}
                              onMouseLeave={() => setHoveredLeadId(null)}
                              className={`p-6 rounded-[28px] border transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.15)] relative ${
                                theme === "dark"
                                  ? "bg-[#121214] border-white/5 hover:border-[#8b6cf6]/50"
                                  : "bg-white border-zinc-200 hover:border-[#8b6cf6]/50"
                              }`}
                            >
                              {/* Header: Avatar, Name, Handle */}
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xl shrink-0">
                                    {lead.employeeAvatar === "PS" ? "🧔" : lead.employeeAvatar === "RS" ? "👩" : lead.employeeAvatar === "AV" ? "👨" : lead.employeeAvatar === "SK" ? "🧑" : "👱"}
                                  </div>
                                  <div>
                                    <h4 className={`text-xs font-black flex items-center gap-1 ${
                                      theme === "dark" ? "text-white" : "text-zinc-800"
                                    }`}>
                                      {lead.name}
                                    </h4>
                                    <p className="text-[9px] text-zinc-500 font-medium">@{lead.name.toLowerCase().replace(/\s+/g, "")}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[8px] uppercase text-zinc-500 font-bold">{lead.time.split(" ")[0]}</span>
                                </div>
                              </div>

                              {/* Body requirements */}
                              <p className={`text-[11px] leading-relaxed font-medium mb-4 line-clamp-3 ${
                                theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                              }`}>
                                {lead.requirements}
                              </p>

                              {/* Thin horizontal divider line exactly like reference image */}
                              <div className="w-full h-px bg-zinc-200 dark:bg-white/5 mb-4" />

                              {/* Footer actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-zinc-400 dark:text-zinc-500">
                                  <button 
                                    onClick={e => { e.stopPropagation(); alert(`Calling ${lead.phone}...`); }}
                                    className="hover:text-white transition-colors cursor-pointer"
                                    title="Voice Call"
                                  >
                                    <Phone size={14} />
                                  </button>
                                  <button 
                                    onClick={e => { e.stopPropagation(); alert(`Messaging ${lead.email}...`); }}
                                    className="hover:text-white transition-colors cursor-pointer"
                                    title="Message Email"
                                  >
                                    <Envelope size={14} />
                                  </button>
                                  <button 
                                    onClick={e => { e.stopPropagation(); alert(`Opening logs registry...`); }}
                                    className="hover:text-white transition-colors cursor-pointer"
                                    title="Documents / Logs"
                                  >
                                    <Calendar size={14} />
                                  </button>
                                  <button 
                                    onClick={e => { e.stopPropagation(); }}
                                    className="hover:text-white transition-colors cursor-pointer"
                                    title="More Actions"
                                  >
                                    <DotsThreeVertical size={14} />
                                  </button>
                                </div>

                                <button
                                  onClick={e => { e.stopPropagation(); setSelectedLead(lead); }}
                                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all shadow-md cursor-pointer ${
                                    theme === "dark" 
                                      ? "bg-white text-black hover:bg-zinc-200" 
                                      : "bg-black text-white hover:bg-zinc-800"
                                  }`}
                                >
                                  Publish
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                /* ── TABLE LIST VIEW ── */
                <motion.div
                  key="table-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-6 rounded-[24px] border ${
                    theme === "dark" ? "bg-[#110f1e]/60 border-white/5 shadow-lg" : "bg-white border-zinc-200/60 shadow-sm"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-200 dark:border-white/5 font-bold">
                          <th className="pb-3 pr-4">Lead client</th>
                          <th className="pb-3 pr-4">Contact Phone</th>
                          <th className="pb-3 pr-4">Email Address</th>
                          <th className="pb-3 pr-4">Requirements</th>
                          <th className="pb-3 pr-4">Pipeline Stage</th>
                          <th className="pb-3 pr-4 text-center">Status</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                        {filteredLeads.map(lead => {
                          const tag = TAG_STYLES[lead.statusTag];
                          return (
                            <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 pr-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{lead.avatar}</span>
                                  <span className={`font-bold ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>{lead.name}</span>
                                </div>
                              </td>
                              <td className="py-4 pr-4 font-mono font-bold text-zinc-400">{lead.phone}</td>
                              <td className={`py-4 pr-4 font-bold ${
                                theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                              }`}>{lead.email}</td>
                              <td className={`py-4 pr-4 font-medium max-w-[240px] truncate ${
                                theme === "dark" ? "text-zinc-500" : "text-zinc-700"
                              }`} title={lead.requirements}>{lead.requirements}</td>
                              <td className="py-4 pr-4">
                                <span className="px-2 py-0.5 rounded bg-zinc-850 text-zinc-300 border border-zinc-700 text-[8px] font-black uppercase">
                                  {lead.stage}
                                </span>
                              </td>
                              <td className="py-4 pr-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${tag.bg} ${tag.text}`}>
                                  {lead.statusTag}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <button className="p-1 rounded-lg text-zinc-555 hover:text-white">
                                  <DotsThreeVertical size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FLOATING HOVER PREVIEW POPUP CARD */}
            <AnimatePresence>
              {hoveredLeadId && (() => {
                const lead = leads.find(l => l.id === hoveredLeadId);
                if (!lead) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ position: "fixed", left: tooltipPos.x, top: tooltipPos.y, zIndex: 999 }}
                    className={`pointer-events-none w-80 p-5 rounded-[24px] border shadow-[0_12px_45px_rgba(0,0,0,0.25)] space-y-4 ${
                      theme === "dark"
                        ? "bg-[#0f0e1c] border-[#8b6cf6]/30 text-white"
                        : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`text-sm font-black ${
                          theme === "dark" ? "text-white" : "text-zinc-900"
                        }`}>{lead.name}</h4>
                        <p className="text-[8px] text-zinc-500 font-mono mt-0.5">ID: {lead.id}</p>
                      </div>
                      <span className="text-[10px] text-[#8b6cf6] font-extrabold">{lead.budget}</span>
                    </div>

                    <div className={`space-y-1 text-[10px] font-medium ${
                      theme === "dark" ? "text-zinc-400" : "text-zinc-650"
                    }`}>
                      <p><span className="text-zinc-550 font-bold">Industry:</span> {lead.industry}</p>
                      <p><span className="text-zinc-550 font-bold">Owner:</span> {lead.employeeName} ({lead.employeeRole})</p>
                      <p><span className="text-zinc-550 font-bold">Origin:</span> {lead.source}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Full Project requirements</p>
                      <p className={`text-[10px] leading-relaxed font-medium ${
                        theme === "dark" ? "text-zinc-350" : "text-zinc-700"
                      }`}>{lead.requirements}</p>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ── Bespoke High-Fidelity Details Page Layout ── */
          <motion.div
            key="lead-details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Navigation back */}
            <div className="flex justify-between items-center pb-2">
              <button
                onClick={() => setSelectedLead(null)}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  theme === "dark" ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <ArrowLeft size={16} /> Back to Pipeline Board
              </button>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-xs font-bold">Update Stage:</span>
                <div className="flex gap-1">
                  {(["Intake", "Discovery", "Proposal", "Negotiation", "Finalized"] as LeadItem["stage"][]).map(stg => (
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

            {/* TOP PROFILE CARD */}
            <div className={`p-6 rounded-[24px] border ${
              theme === "dark" ? "bg-[#110f1e]/60 border-white/5" : "bg-white border-zinc-200/60 shadow-sm"
            }`}>
              <h2 className="text-xs uppercase font-bold tracking-widest text-zinc-450 mb-4">Lead Assignment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Profile Box */}
                <div className={`md:col-span-5 p-5 rounded-2xl flex items-center gap-4 ${
                  theme === "dark" ? "bg-[#0b0a14]" : "bg-zinc-50/80"
                }`}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-[#8b6cf6]/20 text-[#8b6cf6] border border-[#8b6cf6]/40 flex items-center justify-center text-3xl shadow-xl">
                      {selectedLead.avatar}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#110f1e]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider">{selectedLead.id}</span>
                    <h3 className={`text-lg font-black mt-1 ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>
                      {selectedLead.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-zinc-555 font-bold">{selectedLead.industry} (Industry)</p>
                      <span className="px-2 py-0.2 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded">
                        Active Lead
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Metadata Details */}
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

            {/* ATTENDANCE STATS SUMMARY CARD */}
            <div className={`p-6 rounded-[24px] border ${
              theme === "dark" ? "bg-[#110f1e]/60 border-white/5" : "bg-white border-zinc-200/60 shadow-sm"
            }`}>
              <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-500 mb-4">Pipeline Engagement Stats</h3>
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

            {/* MONTHLY LOG REGISTRY TABLE */}
            <div className={`p-6 rounded-[24px] border ${
              theme === "dark" ? "bg-[#110f1e]/60 border-white/5" : "bg-white border-zinc-200/60 shadow-sm"
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-200 dark:border-white/5 gap-4">
                <div className="flex items-center gap-3">
                  <h3 className={`text-sm font-black ${
                    theme === "dark" ? "text-white" : "text-zinc-900"
                  }`}>Communication Log Registry</h3>
                  <div className="flex items-center gap-1.5 text-zinc-555 text-xs">
                    <button className="p-1 hover:text-white" title="Prev Month"><CaretLeft size={14} /></button>
                    <span className="font-bold">June 2026</span>
                    <button className="p-1 hover:text-white" title="Next Month"><CaretRight size={14} /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase text-zinc-300 border border-white/5">
                    <Export size={12} /> Export CSV
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase text-zinc-300 border border-white/5">
                    <Funnel size={12} /> Filter
                  </button>
                </div>
              </div>

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
                        <td className={`py-4 pr-4 font-bold ${
                          theme === "dark" ? "text-white" : "text-zinc-900"
                        }`}>{event.type}</td>
                        <td className="py-4 pr-4 text-zinc-450 font-bold">{event.duration}</td>
                        <td className="py-4 pr-4 text-zinc-500 font-bold">{event.location}</td>
                        <td className={`py-4 pr-4 font-medium max-w-[280px] truncate ${
                          theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                        }`} title={event.note}>{event.note}</td>
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
                          <button className="p-1.5 rounded-lg text-zinc-555 hover:text-white">
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
