"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
const motionFramer = motion;
import {
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  LayoutDashboard,
  Target,
  Users,
  Share2,
  Send,
  X,
  Plus,
  Inbox,
  Flame,
  Kanban,
  Contact2,
  History,
  FileText,
  Activity,
  Briefcase,
  ChevronDown,
  Bot,
  MessageSquare,
  Mail,
  PhoneCall,
  RefreshCw,
  FolderLock,
  Trash2,
  Archive,
  Award,
  Layers,
  FileSignature,
  PieChart as PieIcon,
  TrendingUp,
  CheckCircle,
  Calendar as CalendarIcon,
  Zap,
  ListTodo,
  DollarSign,
  Settings,
} from "lucide-react";
import MainDashboard from "./MainDashboard";
import LeadsDashboard from "./LeadsDashboard";

export default function LayoutWrapper({ defaultTab = "Dashboard" }: { defaultTab?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState(defaultTab);
  const [showAiAssistant, setShowAiAssistant] = useState(true);
  const [workspace, setWorkspace] = useState("Sales Workspace");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Hello Rohit! Ready to optimize our sales operations today?",
    },
  ]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatMessage("");
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Executing sales insight queries for: "${userMsg}". 12 high-intent leads are flagged.`,
        },
      ]);
    }, 600);
  };

  const slideAnimation = {
    initial: { opacity: 0, x: 15 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -15 },
    transition: { type: "spring" as const, stiffness: 380, damping: 30 },
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col transition-all duration-300">

      {/* Navbar (80px, Glass effect, Blur 20px) */}
      <header className="h-20 sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-[20px] border-b border-white/20 dark:border-slate-800/20 flex items-center justify-between px-8">

        {/* Left Side: Logo & Workspace Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveNav("Dashboard")}>
            <div className="w-9 h-9 rounded-lg bg-primary-custom flex items-center justify-center text-white font-extrabold shadow-sm">
              CL
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider text-slate-900 dark:text-white leading-none">
                CYBERLIM ERP
              </span>
              <span className="text-[8px] font-bold text-primary-custom uppercase tracking-widest mt-0.5">
                AI Powered
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-850" />

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/40 text-[10px] font-bold text-slate-700 dark:text-slate-300">
            <span>💼 {workspace}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Center: Navigation Tabs with Blue Underline */}
        <nav className="hidden lg:flex items-center gap-2">
          {[
            "Dashboard",
            "Leads ERP",
            "Team ERP",
            "Social ERP",
            "Automation",
            "Reports",
            "Calendar",
          ].map((item) => {
            const isActive = activeNav === item || (item === "Dashboard" && activeNav === "Overview");
            return (
              <button
                key={item}
                onClick={() => {
                  if (item === "Dashboard" || item === "Leads ERP") {
                    setActiveNav(item);
                  } else {
                    alert(`${item} module clicked!`);
                  }
                }}
                className={`relative px-4 py-2 text-xs font-bold tracking-wide transition-all ${isActive
                  ? "text-primary-custom"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
              >
                {item}
                {isActive && (
                  <motionFramer.div
                    layoutId="navbarGlowUnderline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-custom rounded-full shadow-[0_0_8px_#2563EB]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          <div className="relative hidden xl:block w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-primary-custom transition-all"
            />
          </div>

          <button className="relative w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-500">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary-custom" />
          </button>

          <button
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${showAiAssistant
              ? "bg-primary-custom text-white border-primary-custom shadow-sm"
              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-500"
              }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-855 flex items-center justify-center text-slate-500"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-805 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border border-slate-350 dark:border-slate-700 text-xs">
            R
          </div>
        </div>
      </header>

      {/* Main Content shell */}
      <div className="flex-1 flex relative overflow-hidden">

        {/* Floating Glass Left Sidebar (290px width, White 80%, backdrop-blur) */}
        <aside className="w-[290px] shrink-0 border-r border-border-custom/50 hidden xl:flex flex-col p-6 gap-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-[20px] overflow-y-auto max-h-[calc(100vh-80px)]">
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-3">
              Dashboard
            </div>
            <button
              onClick={() => setActiveNav("Dashboard")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeNav === "Dashboard" || activeNav === "Overview"
                ? "bg-primary-custom text-white shadow-sm"
                : "text-slate-650 dark:text-slate-400 hover:bg-slate-105/50 dark:hover:bg-slate-900/50"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-3">
              Leads ERP
            </div>
            <div className="space-y-1">
              {[
                { label: "Leads", icon: Target },
                { label: "Pipeline", icon: Kanban },
                { label: "Proposals", icon: FileText },
                { label: "Follow Ups", icon: RefreshCw },
                { label: "Calling", icon: PhoneCall },
              ].map((sub) => {
                const isActive = activeNav === "Leads ERP" && sub.label === "Leads";
                return (
                  <button
                    key={sub.label}
                    onClick={() => setActiveNav("Leads ERP")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                      ? "bg-primary-custom/10 text-primary-custom font-bold"
                      : "text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      }`}
                  >
                    <sub.icon className="w-4 h-4 text-primary-custom" />
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-3">
              Team ERP
            </div>
            <div className="space-y-1">
              {[
                { label: "Employees", icon: Users },
                { label: "Attendance", icon: CheckCircle },
                { label: "Tasks", icon: ListTodo },
                { label: "Payroll", icon: DollarSign },
                { label: "Performance", icon: Award },
              ].map((sub) => (
                <button
                  key={sub.label}
                  onClick={() => alert(`${sub.label} page clicked!`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
                >
                  <sub.icon className="w-4 h-4 text-slate-450" />
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-3">
              Social ERP
            </div>
            <div className="space-y-1">
              {[
                { label: "Content Calendar", icon: CalendarIcon },
                { label: "Posts", icon: Share2 },
                { label: "Campaigns", icon: Zap },
                { label: "Analytics", icon: PieIcon },
              ].map((sub) => (
                <button
                  key={sub.label}
                  onClick={() => alert(`${sub.label} page clicked!`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
                >
                  <sub.icon className="w-4 h-4 text-slate-450" />
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-3">
              System
            </div>
            <div className="space-y-1">
              {[
                { label: "Automation", icon: Bot },
                { label: "Integrations", icon: Layers },
                { label: "Settings", icon: Settings },
              ].map((sub) => (
                <button
                  key={sub.label}
                  onClick={() => alert(`${sub.label} page clicked!`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
                >
                  <sub.icon className="w-4 h-4 text-slate-455" />
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Panel (Fluid Width, Max 1600px, Padding 32px) */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-80px)] p-8 no-scrollbar max-w-[1600px] mx-auto">
          <motionFramer.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {activeNav === "Dashboard" ? (
                <motionFramer.div key="main-dash" {...slideAnimation}>
                  <MainDashboard setShowAiAssistant={setShowAiAssistant} />
                </motionFramer.div>
              ) : (
                <motionFramer.div key="leads-dash" {...slideAnimation}>
                  <LeadsDashboard setShowAiAssistant={setShowAiAssistant} />
                </motionFramer.div>
              )}
            </AnimatePresence>
          </motionFramer.div>
        </div>

        {/* Right Sidebar (340px sticky) */}
        <AnimatePresence mode="wait">
          {showAiAssistant && (
            <motionFramer.aside
              key="ceo-command-right-sidebar"
              {...slideAnimation}
              className="w-[340px] shrink-0 border-l border-border-custom/50 hidden lg:flex flex-col p-6 gap-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-[20px] overflow-y-auto max-h-[calc(100vh-80px)]"
            >
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-805 pb-3">
                <h3 className="font-extrabold text-slate-850 dark:text-slate-105 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Bot className="w-4 h-4 text-primary-custom" /> AI CEO Card
                </h3>
                <button onClick={() => setShowAiAssistant(false)} className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 flex items-center justify-center text-slate-550 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* AI CEO Widget */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <h4 className="font-extrabold text-xs mb-3">Good Morning Rohit</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-550">Revenue</span><span className="font-bold text-primary-custom">₹4.8L</span></div>
                  <div className="flex justify-between"><span className="text-slate-550">Leads</span><span className="font-bold text-slate-900 dark:text-white">42</span></div>
                  <div className="flex justify-between"><span className="text-slate-550">Posts</span><span className="font-bold text-slate-900 dark:text-white">18</span></div>
                  <div className="flex justify-between"><span className="text-slate-550">Attendance</span><span className="font-bold text-slate-900 dark:text-white">96%</span></div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["Add Lead", "Add Employee", "Create Post", "Generate Proposal"].map((act) => (
                    <button
                      key={act}
                      onClick={() => alert(`${act} Action Triggered!`)}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold hover:border-primary-custom hover:text-primary-custom transition-all text-left"
                    >
                      ➕ {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Today's Tasks (Progress Ring style) */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Tasks</h4>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {/* Progress Ring representation */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="18" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                      <circle cx="24" cy="24" r="18" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="113" strokeDashoffset="37" />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-slate-800 dark:text-slate-200">66%</span>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">12 Tasks</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">8 Completed, 4 Pending</div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Upcoming Events</h4>
                <div className="space-y-3">
                  {[
                    { label: "Strategy Meeting", time: "11:00 AM", desc: "Leads ERP campaign follow-up" },
                    { label: "Contract Review", time: "02:30 PM", desc: "Stark Industries deal" },
                  ].map((ev, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{ev.label}</span>
                        <span className="text-[9px] font-extrabold text-primary-custom">{ev.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{ev.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto border-t border-slate-250 dark:border-slate-800 pt-4 flex flex-col gap-2">
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask Sales Assistant..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-primary-custom"
                  />
                  <button type="submit" className="w-9 h-9 rounded-lg bg-primary-custom text-white flex items-center justify-center shadow-sm">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motionFramer.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
