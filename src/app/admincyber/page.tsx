"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Cpu, User, WarningOctagon, CheckCircle, Trash, 
  Plus, X, Brain, Database, List, Gear, ChartBar, Users, 
  Key, Clock, SignOut, CaretRight, MagnifyingGlass, Question,
  EnvelopeSimple, Bell, ShareNetwork, ArrowRight, Wallet,
  TrendUp, ArrowUpRight, CaretDown, Buildings, Briefcase, 
  ChartLineUp, Sparkle, ShieldCheck, Copy
} from "@phosphor-icons/react";
import Link from "next/link";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";

interface AdminUser {
  id: string;
  name?: string;
  email?: string;
  role?: "employer" | "employee";
  company?: string;
  createdAt?: any;
}

interface AdminApiKey {
  id: string;
  name: string;
  userId: string;
  createdAt: any;
  status: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  employeesCount: number;
  addedBy: string;
  dateAdded: string;
}

export default function AdminCyberPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Layout Selection
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "employers" | "employees" | "companies" | "keys" | "health">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dropdowns
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(true);
  const [devDropdownOpen, setDevDropdownOpen] = useState(true);

  // Data
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [apiKeysList, setApiKeysList] = useState<AdminApiKey[]>([]);
  const [companiesList, setCompaniesList] = useState<Company[]>([]);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated traffic / activities
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Live Watch State
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "rohitsengar02@gmail.com") {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore Data
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const unsubscribeUsers = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snap) => {
        const loaded: AdminUser[] = [];
        snap.forEach(d => {
          const data = d.data();
          let role: "employer" | "employee" = "employee";
          if (data.role === "employer" || d.id.charCodeAt(0) % 2 === 0) {
            role = "employer";
          }
          loaded.push({ 
            id: d.id, 
            name: data.name || "Workspace User",
            email: data.email,
            role: role,
            company: data.company || (role === "employer" ? "CyberLim Solutions" : "Fintrixity Inc"),
            createdAt: data.createdAt 
          });
        });
        setUsersList(loaded);
      }
    );

    const unsubscribeKeys = onSnapshot(
      query(collection(db, "apiKeys"), orderBy("createdAt", "desc")),
      (snap) => {
        const loaded: AdminApiKey[] = [];
        snap.forEach(d => {
          loaded.push({
            id: d.id,
            name: d.data().name || "Unnamed Key",
            userId: d.data().userId || "Unknown",
            createdAt: d.data().createdAt,
            status: d.data().status || "active"
          });
        });
        setApiKeysList(loaded);
      }
    );

    // Seed companies list
    setCompaniesList([
      { id: "comp_1", name: "CyberLim Solutions", industry: "AI & Web Development", employeesCount: 14, addedBy: "Rohit Sengar", dateAdded: "14 Feb, 2026" },
      { id: "comp_2", name: "Fintrixity Inc", industry: "Fintech Systems", employeesCount: 8, addedBy: "Hossein Y", dateAdded: "23 Sep, 2025" },
      { id: "comp_3", name: "Emma Tech Labs", industry: "SaaS & Mobile Apps", employeesCount: 22, addedBy: "Maria K", dateAdded: "05 Apr, 2026" },
      { id: "comp_4", name: "Anaco Programming", industry: "Hardware Audits", employeesCount: 5, addedBy: "Stephane L", dateAdded: "18 Nov, 2025" }
    ]);

    // Initialize activities
    setRecentActivities([
      { id: "act_1", name: "AI Agent Execution", orderId: "AGT_000981", date: "23 Jun, 2026", time: "11:24 PM", cost: "$0.045", status: "Completed" },
      { id: "act_2", name: "API Key Created", orderId: "KEY_882012", date: "23 Jun, 2026", time: "10:15 PM", cost: "$0.00", status: "Completed" },
      { id: "act_3", name: "User Registration", orderId: "USR_381203", date: "22 Jun, 2026", time: "09:42 PM", cost: "$0.00", status: "Completed" },
      { id: "act_4", name: "AI Image Canvas Render", orderId: "IMG_900251", date: "22 Jun, 2026", time: "08:10 PM", cost: "$0.120", status: "Completed" },
      { id: "act_5", name: "HF Token Inference Call", orderId: "INF_112049", date: "21 Jun, 2026", time: "06:18 PM", cost: "$0.015", status: "Completed" }
    ]);

    return () => {
      unsubscribeUsers();
      unsubscribeKeys();
    };
  }, [isAdminLoggedIn]);

  // Auth Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);

    if (emailInput.trim() !== "rohitsengar02@gmail.com") {
      setAuthError("Unauthorized Access: Only the designated admin account can access this dashboard.");
      setAuthSubmitting(false);
      return;
    }

    if (passwordInput !== "RUdra@#602") {
      setAuthError("Incorrect password. Please verify credentials.");
      setAuthSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      setIsAdminLoggedIn(true);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Authentication failed.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdminLoggedIn(false);
    } catch (err) {
      console.error("Admin logout failed:", err);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (confirm(`Are you sure you want to revoke this API key?`)) {
      try {
        await deleteDoc(doc(db, "apiKeys", keyId));
      } catch (err) {
        console.error("Revoke key failed:", err);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col justify-center items-center relative overflow-hidden">
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="h-10 w-10 rounded-2xl bg-[#09090b] border border-[#B6F500]/30 flex items-center justify-center animate-spin">
            <Cpu size={20} className="text-[#B6F500]" />
          </div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Initializing Portal...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN (3D effect)
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020203] flex justify-center items-center relative overflow-hidden px-4 font-sans text-white">
        {/* Subtle glowing blob */}
        <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-[#B6F500]/5 rounded-full filter blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-[#0a0a0c] border border-neutral-900 shadow-[20px_20px_40px_rgba(0,0,0,0.95),-8px_-8px_24px_rgba(255,255,255,0.01)] rounded-[32px] p-8 z-10 relative overflow-hidden">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B6F500]/10 border border-[#B6F500]/30 text-[#B6F500] mb-1 shadow-[4px_4px_10px_rgba(0,0,0,0.5),inset_2px_2px_4px_rgba(182,245,0,0.2)]">
              <Brain size={24} weight="fill" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_12px_rgba(182,245,0,0.15)]">CYBERLIM TEAM PANEL</h1>
            <p className="text-xs text-zinc-550 uppercase tracking-widest font-mono">Secure Access Portal</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1 font-mono">Admin Email</label>
              <div className="relative flex items-center bg-[#050507] border border-neutral-900 rounded-2xl px-4 py-3 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.95)]">
                <input
                  type="email"
                  required
                  placeholder="rohitsengar02@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-transparent text-xs text-white outline-none font-mono placeholder:text-zinc-750"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1 font-mono">Secret Password</label>
              <div className="relative flex items-center bg-[#050507] border border-neutral-900 rounded-2xl px-4 py-3 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.95)]">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-transparent text-xs text-white outline-none font-mono placeholder:text-zinc-750"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 bg-[#B6F500]/10 border border-[#B6F500]/25 px-3.5 py-3 rounded-2xl text-[10px] font-bold text-[#B6F500] leading-normal font-mono shadow-[inset_2px_2px_6px_rgba(0,0,0,0.5)]">
                <WarningOctagon size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#B6F500] to-[#00FF88] hover:opacity-95 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0_4px_20px_rgba(182,245,0,0.25)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {authSubmitting ? "Verifying Keys..." : "Access Console"}
            </button>
          </form>
          
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-neutral-900 text-[9px] text-zinc-650 uppercase tracking-widest font-mono">
            <span>Root Status</span>
            <Link href="/ai-test" className="text-[#B6F500] hover:underline">Exit Admin</Link>
          </div>
        </div>
      </div>
    );
  }

  // Statistics Computations
  const employersCount = usersList.filter(u => u.role === "employer").length;
  const employeesCount = usersList.filter(u => u.role === "employee").length;
  const companiesCount = companiesList.length;
  const activeKeysCount = apiKeysList.length;

  // Filtered lists
  const filteredEmployers = usersList.filter(u => 
    u.role === "employer" && 
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredEmployees = usersList.filter(u => 
    u.role === "employee" && 
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCompanies = companiesList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Digital Watch Format
  const getWatchTimeStrings = () => {
    if (!currentTime) return { hh: "00", mm: "00", ss: "00", ampm: "AM", dayStr: "" };
    let hours = currentTime.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const hh = hours < 10 ? `0${hours}` : `${hours}`;
    const mm = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : `${currentTime.getMinutes()}`;
    const ss = currentTime.getSeconds() < 10 ? `0${currentTime.getSeconds()}` : `${currentTime.getSeconds()}`;
    const dayStr = currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return { hh, mm, ss, ampm, dayStr };
  };

  const watchData = getWatchTimeStrings();

  return (
    <div className="min-h-screen bg-[#020203] text-white flex relative overflow-hidden font-sans">
      
      {/* BACKGROUND AI GRADIENT GLOWS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B6F500]/[0.02] rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[20%] w-[600px] h-[600px] bg-[#00FF88]/[0.01] rounded-full filter blur-[180px] pointer-events-none" />

      {/* SIDEBAR (Tactile 3D appearance in Neon Green/Black) */}
      <aside className="w-64 bg-[#070709] flex flex-col justify-between z-20 shrink-0 border-r border-neutral-900 shadow-[10px_0_30px_rgba(0,0,0,0.85)]">
        <div className="p-5 flex flex-col gap-6 overflow-y-auto flex-1 no-scrollbar">
          
          {/* Logo brand info */}
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#B6F500] to-[#00FF88] flex items-center justify-center text-black shadow-[0_2px_12px_rgba(182,245,0,0.35),inset_1px_1px_3px_rgba(255,255,255,0.4)]">
              <Cpu size={16} weight="fill" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">CyberLim AI</span>
              <span className="text-[8px] text-[#B6F500] font-mono font-bold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>

          {/* Search bar (recessed style) */}
          <div className="relative flex items-center bg-[#030304] border border-neutral-900 rounded-2xl px-3 py-2.5 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.95)]">
            <MagnifyingGlass className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white outline-none w-full placeholder:text-zinc-650 font-mono"
            />
          </div>

          {/* Menu Options */}
          <div className="space-y-2">
            
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === "dashboard" 
                  ? "bg-[#0b0b0d] text-[#B6F500] shadow-[6px_6px_12px_rgba(0,0,0,0.85),-2px_-2px_8px_rgba(255,255,255,0.015)] border border-neutral-800" 
                  : "text-zinc-450 hover:bg-neutral-950 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <ChartBar size={16} className={activeMenu === "dashboard" ? "text-[#B6F500]" : "text-zinc-500"} /> Dashboard
              </div>
            </button>

            {/* TEAM MANAGEMENT DROPDOWN */}
            <div className="space-y-1">
              <button
                onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-zinc-450 hover:bg-neutral-950 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-zinc-500" /> Team Operations
                </div>
                <CaretDown size={12} className={`transition-transform duration-200 ${teamDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {teamDropdownOpen && (
                <div className="pl-6 space-y-1 border-l border-neutral-900 ml-5 py-1">
                  <button
                    onClick={() => setActiveMenu("employers")}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer block ${
                      activeMenu === "employers" ? "text-[#B6F500] bg-[#0c0c0e] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)] border border-neutral-900/50" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    Employers ({employersCount})
                  </button>
                  <button
                    onClick={() => setActiveMenu("employees")}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer block ${
                      activeMenu === "employees" ? "text-[#B6F500] bg-[#0c0c0e] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)] border border-neutral-900/50" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    Employees ({employeesCount})
                  </button>
                  <button
                    onClick={() => setActiveMenu("companies")}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer block ${
                      activeMenu === "companies" ? "text-[#B6F500] bg-[#0c0c0e] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)] border border-neutral-900/50" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    Companies ({companiesCount})
                  </button>
                </div>
              )}
            </div>

            {/* DEVELOPER CONSOLE DROPDOWN */}
            <div className="space-y-1">
              <button
                onClick={() => setDevDropdownOpen(!devDropdownOpen)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-zinc-450 hover:bg-neutral-950 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Key size={16} className="text-zinc-500" /> Dev Space
                </div>
                <CaretDown size={12} className={`transition-transform duration-200 ${devDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {devDropdownOpen && (
                <div className="pl-6 space-y-1 border-l border-neutral-900 ml-5 py-1">
                  <button
                    onClick={() => setActiveMenu("keys")}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer block ${
                      activeMenu === "keys" ? "text-[#B6F500] bg-[#0c0c0e] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)] border border-neutral-900/50" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    API Credentials ({activeKeysCount})
                  </button>
                  <button
                    onClick={() => setActiveMenu("health")}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer block ${
                      activeMenu === "health" ? "text-[#B6F500] bg-[#0c0c0e] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)] border border-neutral-900/50" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    Infrastructure Logs
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Quick Links */}
          <div className="space-y-2 pt-4 border-t border-neutral-900">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest pl-3.5 block mb-1 font-mono">Navigation</span>
            <Link 
              href="/ai-test"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all block hover:bg-neutral-950"
            >
              <Brain size={16} className="text-[#B6F500]" /> Chatbot System
            </Link>
          </div>

        </div>

        {/* Upgrade Card (recessed neumorphic well) */}
        <div className="p-4 bg-[#050507]">
          <div className="bg-[#020203] border border-neutral-900 rounded-3xl p-4 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.95)] space-y-3 text-left">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">PREMIUM GATEWAY 👑</h4>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">Unlock advanced parameters, infinite inference tokens & dedicated API bandwidth.</p>
            <button className="w-full py-2.5 bg-gradient-to-r from-[#B6F500] to-[#00FF88] text-black font-black text-[10px] uppercase rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-[0_2px_10px_rgba(182,245,0,0.2)]">
              Upgrade Console
            </button>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-neutral-900 bg-[#040406] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B6F500] to-[#00FF88] flex items-center justify-center font-black text-[10px] text-black shadow-[0_2px_8px_rgba(182,245,0,0.3)]">
              RS
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-white leading-tight font-mono">Rohit Sengar</p>
              <p className="text-[8px] text-[#B6F500] font-mono font-bold leading-none mt-0.5 uppercase">SYSTEM ROOT</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 bg-neutral-950 hover:bg-[#B6F500]/10 text-zinc-500 hover:text-[#B6F500] border border-neutral-800 rounded-xl transition-colors cursor-pointer"
            title="Sign out admin"
          >
            <SignOut size={13} weight="bold" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-transparent">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-neutral-900 bg-[#020203]/75 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
            <div className="flex gap-1.5">
              <button className="p-1.5 bg-neutral-950 border border-neutral-900 rounded-xl hover:text-white transition-colors cursor-pointer shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                <ArrowLeft size={12} />
              </button>
              <button className="p-1.5 bg-neutral-950 border border-neutral-900 rounded-xl hover:text-white transition-colors cursor-pointer shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                <ArrowRight size={12} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
              <span className="text-zinc-650">CONSOLE</span>
              <CaretRight size={10} className="text-zinc-700" />
              <span className="text-[#B6F500] uppercase tracking-wider">{activeMenu}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button className="p-2 text-zinc-500 hover:text-white hover:bg-neutral-950 rounded-xl transition-colors cursor-pointer">
                <Question size={16} />
              </button>
              <button className="p-2 text-zinc-500 hover:text-white hover:bg-neutral-950 rounded-xl transition-colors cursor-pointer">
                <EnvelopeSimple size={16} />
              </button>
              <button className="p-2 text-zinc-500 hover:text-[#B6F500] hover:bg-neutral-950 rounded-xl relative transition-colors cursor-pointer">
                <Bell size={16} />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#B6F500] shadow-[0_0_6px_#B6F500]" />
              </button>
            </div>
            
            <div className="w-[1px] h-4 bg-neutral-900 mx-1" />
            
            <button className="bg-gradient-to-r from-[#B6F500] to-[#00FF88] hover:opacity-95 text-black font-black text-[10px] uppercase tracking-widest px-3.5 py-2.2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(182,245,0,0.2)]">
              <ShareNetwork size={12} weight="bold" /> Export Report
            </button>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-left space-y-6 bg-[#030304]">
          
          {/* LED DOT-MATRIX SYSTEM BANNER (Recessed Well) */}
          <div className="bg-[#050507] border border-neutral-900 rounded-[24px] p-3.5 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.95)] relative overflow-hidden font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#B6F500] animate-ping" />
              <span className="text-[9px] text-zinc-650 uppercase tracking-widest font-black">Mainframe Connection</span>
            </div>
            <div className="flex gap-2 items-center bg-[#020203] border border-neutral-900 rounded-lg px-4 py-1.5 font-bold text-[#B6F500] text-[10px] tracking-widest shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)] drop-shadow-[0_0_4px_rgba(182,245,0,0.2)] animate-pulse">
              SYSTEM_SECURE &gt;&gt; HOST: PORT_3005 &gt;&gt; RUNNING_OK
            </div>
          </div>

          {activeMenu === "dashboard" && (
            <div className="space-y-6">
              
              {/* TOP STATS: 5 CARDS GRID with Neumorphic 3D Popout Raised effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                
                {/* Employers Card */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 flex flex-col justify-between min-h-[135px] shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.01)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15),12px_12px_24px_rgba(0,0,0,0.95)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">Employers</span>
                    <span className="p-2 bg-[#B6F500]/10 border border-[#B6F500]/20 rounded-xl text-[#B6F500] text-xs shadow-[inset_1px_1px_3px_rgba(182,245,0,0.2)]"><Briefcase size={14} /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">{employersCount}</span>
                    <span className="block text-[8px] text-zinc-550 font-bold uppercase tracking-wider mt-1.5 font-mono">Workspace Owners</span>
                  </div>
                </div>

                {/* Employees Card */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 flex flex-col justify-between min-h-[135px] shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.01)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15),12px_12px_24px_rgba(0,0,0,0.95)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">Employees</span>
                    <span className="p-2 bg-[#B6F500]/10 border border-[#B6F500]/20 rounded-xl text-[#B6F500] text-xs shadow-[inset_1px_1px_3px_rgba(182,245,0,0.2)]"><Users size={14} /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">{employeesCount}</span>
                    <span className="block text-[8px] text-zinc-550 font-bold uppercase tracking-wider mt-1.5 font-mono">Registered Talent</span>
                  </div>
                </div>

                {/* Companies Card */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 flex flex-col justify-between min-h-[135px] shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.01)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15),12px_12px_24px_rgba(0,0,0,0.95)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">Companies</span>
                    <span className="p-2 bg-[#B6F500]/10 border border-[#B6F500]/20 rounded-xl text-[#B6F500] text-xs shadow-[inset_1px_1px_3px_rgba(182,245,0,0.2)]"><Buildings size={14} /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">{companiesCount}</span>
                    <span className="block text-[8px] text-zinc-550 font-bold uppercase tracking-wider mt-1.5 font-mono">Client Domains</span>
                  </div>
                </div>

                {/* API Keys Card */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 flex flex-col justify-between min-h-[135px] shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.01)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15),12px_12px_24px_rgba(0,0,0,0.95)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">Active Keys</span>
                    <span className="p-2 bg-[#B6F500]/10 border border-[#B6F500]/20 rounded-xl text-[#B6F500] text-xs shadow-[inset_1px_1px_3px_rgba(182,245,0,0.2)]"><Key size={14} /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">{activeKeysCount}</span>
                    <span className="block text-[8px] text-zinc-550 font-bold uppercase tracking-wider mt-1.5 font-mono">Credentials active</span>
                  </div>
                </div>

                {/* Inference Health */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 flex flex-col justify-between min-h-[135px] shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.01)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15),12px_12px_24px_rgba(0,0,0,0.95)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">Systems</span>
                    <span className="p-2 bg-[#B6F500]/10 border border-[#B6F500]/20 rounded-xl text-emerald-400 text-xs shadow-[inset_1px_1px_3px_rgba(182,245,0,0.2)]"><ChartLineUp size={14} /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">99.8%</span>
                    <span className="block text-[8px] text-emerald-400 font-black uppercase tracking-wider mt-1.5 font-mono flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" /> ONLINE STATUS
                    </span>
                  </div>
                </div>

              </div>

              {/* CAMPAIGN INTERACTIVE GRID LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: Activity tracker chart card (3D raised neumorphic) */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[36px] p-6.5 flex flex-col justify-between min-h-[380px] shadow-[12px_12px_24px_rgba(0,0,0,0.85),-4px_-4px_16px_rgba(255,255,255,0.015)] hover:shadow-[0_0_18px_rgba(182,245,0,0.15)] transition-shadow duration-300">
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">Activity Overview</h2>
                        <p className="text-[10px] text-zinc-555 mt-1 font-mono uppercase">Comparative token latency</p>
                      </div>
                      <span className="bg-[#040406] border border-neutral-900 px-3 py-1 rounded-xl text-[9px] font-mono text-zinc-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]">STATS</span>
                    </div>

                    <div className="mt-5 space-y-2 border-b border-neutral-900 pb-4 text-[11px] text-zinc-400 font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-555">Peak bandwidth usage</span>
                        <span className="text-white font-bold">12,852 T/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-555">Average response latency</span>
                        <span className="text-[#B6F500] font-bold">185ms (-12.8%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Sparkline curve using SVG */}
                  <div className="relative py-4 my-2">
                    <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#B6F500" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#B6F500" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0 80 Q 30 50 60 70 T 120 40 T 180 30 T 240 60 T 300 15" 
                        fill="none" 
                        stroke="#B6F500" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_8px_rgba(182,245,0,0.6)]"
                      />
                      <path 
                        d="M 0 80 Q 30 50 60 70 T 120 40 T 180 30 T 240 60 T 300 15 L 300 100 L 0 100 Z" 
                        fill="url(#chartGlow)" 
                      />
                      <circle cx="180" cy="30" r="5" fill="#ffffff" stroke="#B6F500" strokeWidth="2.5" className="shadow-lg" />
                    </svg>

                    {/* SVG Tooltip Box overlay */}
                    <div className="absolute top-[5px] left-[45%] bg-[#050507] border border-neutral-900 rounded-2xl p-2.5 text-[9px] font-mono shadow-[6px_6px_12px_rgba(0,0,0,0.8)]">
                      <span className="block text-zinc-550 font-bold">NODE_MAX</span>
                      <span className="block text-white font-black mt-0.5">851 ms</span>
                      <span className="block text-emerald-400 font-bold">+9.4% load</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-neutral-900">
                    <div>
                      <span className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_6px_#B6F500]">+19.2%</span>
                      <span className="block text-[9px] text-zinc-555 uppercase mt-1 font-bold font-mono">Inbound throughput</span>
                    </div>
                    <span className="text-[9px] text-zinc-655 font-mono">Real-time update</span>
                  </div>
                </div>

                {/* CENTER: BEAUTIFUL ANIMATED 3D DIGITAL WATCH IN NEON GREEN (Replacing Dial knob) */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[36px] p-6.5 flex flex-col justify-between min-h-[380px] shadow-[12px_12px_24px_rgba(0,0,0,0.85),-4px_-4px_16px_rgba(255,255,255,0.015)] hover:shadow-[0_0_18px_rgba(182,245,0,0.15)] transition-shadow duration-300 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-sm font-black text-white uppercase tracking-wider">Operational Clock</h2>
                      <p className="text-[10px] text-zinc-555 mt-1 font-mono uppercase">Internal system chronometer</p>
                    </div>
                    <span className="bg-[#040406] border border-neutral-900 px-3 py-1 rounded-xl text-[9px] font-mono text-zinc-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]">LIVE UTC</span>
                  </div>

                  {/* Physical 3D Neumorphic watch container */}
                  <div className="flex-1 flex flex-col items-center justify-center py-4">
                    <div className="w-full max-w-[240px] bg-[#050507] border border-neutral-900 rounded-[28px] p-5 shadow-[inset_6px_6px_16px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center relative border-t-neutral-850">
                      
                      {/* LCD Screen Glow Overlay */}
                      <div className="absolute inset-2 bg-[#B6F500]/[0.01] rounded-2xl filter blur-[15px] pointer-events-none" />
                      
                      {/* System time readout */}
                      <div className="flex items-baseline gap-1.5 font-mono">
                        <span className="text-4xl font-extrabold text-[#B6F500] drop-shadow-[0_0_12px_rgba(182,245,0,0.85)] tracking-tight">
                          {watchData.hh}
                        </span>
                        <span className="text-3xl font-extrabold text-[#B6F500]/80 animate-pulse drop-shadow-[0_0_10px_rgba(182,245,0,0.6)]">:</span>
                        <span className="text-4xl font-extrabold text-[#B6F500] drop-shadow-[0_0_12px_rgba(182,245,0,0.85)] tracking-tight">
                          {watchData.mm}
                        </span>
                        <span className="text-xl font-extrabold text-[#B6F500] drop-shadow-[0_0_8px_rgba(182,245,0,0.7)] ml-1 border border-[#B6F500]/30 bg-[#B6F500]/5 px-1 py-0.5 rounded shadow-[inset_1px_1px_3px_rgba(0,0,0,0.9)]">
                          {watchData.ss}
                        </span>
                      </div>

                      {/* Period Badge & Day Indicators */}
                      <div className="flex justify-between items-center w-full mt-4 pt-3.5 border-t border-neutral-900/60 font-mono text-[9px] text-zinc-555 uppercase">
                        <span className="px-1.8 py-0.5 border border-zinc-800 rounded bg-[#020203] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.9)] text-[#B6F500]">
                          {watchData.ampm}
                        </span>
                        <span className="font-extrabold text-white tracking-widest">
                          {watchData.dayStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-900 pt-3.5 flex justify-between items-center text-[10px] text-zinc-555 font-mono">
                    <span>Synchronized System</span>
                    <span className="text-[#B6F500] font-bold">SERVER STATUS ACTIVE</span>
                  </div>
                </div>

                {/* RIGHT: Neumorphic Ads block / AI highlights */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[36px] p-6.5 flex flex-col justify-between min-h-[380px] shadow-[12px_12px_24px_rgba(0,0,0,0.85),-4px_-4px_16px_rgba(255,255,255,0.015)] hover:shadow-[0_0_18px_rgba(182,245,0,0.15)] transition-shadow duration-300 relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">Console Health</h2>
                        <p className="text-[10px] text-zinc-555 font-mono">Microservice endpoints status</p>
                      </div>
                      <span className="text-[9px] text-[#B6F500] font-black uppercase font-mono tracking-wider">ROOT ACCESS</span>
                    </div>

                    <button className="w-full py-3 bg-[#050507] hover:bg-neutral-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-2xl transition-all border border-neutral-900 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.9)] cursor-pointer">
                      Run Diagnostic Scan
                    </button>

                    {/* Raised premium block */}
                    <div className="bg-[#0b0b0e] border border-neutral-900 rounded-2xl p-4.5 space-y-2.5 shadow-[4px_4px_12px_rgba(0,0,0,0.9)] border-t-neutral-850">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-[#B6F500]/15 text-[#B6F500] text-[8px] font-black uppercase rounded font-mono border border-[#B6F500]/20">AI ROOT</span>
                        <span className="text-[10px] font-black text-white uppercase font-mono">Workspace Sync</span>
                      </div>
                      <p className="text-[9px] text-zinc-500 leading-relaxed font-mono">Integrate live data listeners instantly with employers, employees, and third-party SaaS keys.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-4 border-t border-neutral-900 shrink-0 font-mono">
                    <button className="flex-1 py-2 bg-transparent text-zinc-650 hover:text-white text-[10px] font-bold uppercase transition-colors cursor-pointer text-left">
                      Dismiss warning
                    </button>
                    <button className="px-5 py-2.5 bg-white text-black font-black text-[10px] uppercase rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
                      Sync DB
                    </button>
                  </div>
                </div>

              </div>

              {/* BOTTOM: Neumorphic Table block replaced with responsive 3D card layout */}
              <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[36px] p-6.5 shadow-[12px_12px_24px_rgba(0,0,0,0.85),-4px_-4px_16px_rgba(255,255,255,0.015)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">Live System Log Overview</h2>
                    <p className="text-[10px] text-zinc-555 mt-1 font-mono uppercase">API logs & execution costs</p>
                  </div>
                  <span className="bg-[#050507] border border-neutral-900 text-[#B6F500] text-[9px] font-mono font-bold px-3 py-1 rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]">SECURE PORT</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="bg-[#08080a] border border-neutral-900 rounded-[24px] p-4.5 shadow-[8px_8px_16px_rgba(0,0,0,0.9),-2px_-2px_8px_rgba(255,255,255,0.01)] hover:shadow-[0_0_10px_rgba(182,245,0,0.1)] hover:scale-[1.01] transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-[#B6F500] font-mono border border-[#B6F500]/20 bg-[#B6F500]/5 px-2 py-0.5 rounded">
                          {act.orderId}
                        </span>
                        <span className="text-[9px] text-zinc-655 font-mono uppercase font-black">{act.time}</span>
                      </div>
                      
                      <div className="my-3.5">
                        <h4 className="text-xs font-black text-white uppercase tracking-wide">{act.name}</h4>
                        <span className="block text-[9px] text-zinc-500 font-mono mt-1">Cost: {act.cost}</span>
                      </div>

                      <div className="pt-3 border-t border-neutral-900/60 flex justify-between items-center">
                        <span className="text-[8px] text-zinc-500 font-mono">{act.date}</span>
                        <span className="text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/50 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                          {act.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: EMPLOYERS LIST (Redesigned as Grid of 3D Cards) */}
          {activeMenu === "employers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight uppercase">Registered Employers</h1>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase">Workspace admin registry ({filteredEmployers.length})</p>
                </div>
              </div>

              {filteredEmployers.length === 0 ? (
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[32px] p-12 text-center shadow-[12px_12px_24px_rgba(0,0,0,0.85)]">
                  <p className="text-xs text-zinc-600 py-4 font-mono uppercase tracking-wider">No employer profiles matched query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEmployers.map((u) => (
                    <div key={u.id} className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.015)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B6F500] to-[#00FF88] flex items-center justify-center text-black font-black text-xs shadow-[0_2px_8px_rgba(182,245,0,0.3)]">
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-white uppercase tracking-wide truncate">{u.name || "Workspace Owner"}</h4>
                          <span className="text-[9px] text-[#B6F500] font-mono font-bold uppercase tracking-wider">{u.company || "CyberLim Solutions"}</span>
                        </div>
                      </div>

                      <div className="my-4 space-y-1.5 pt-3 border-t border-neutral-900/60 text-[10px] text-zinc-400 font-mono">
                        <div className="flex justify-between">
                          <span className="text-zinc-605">Email</span>
                          <span className="text-white truncate max-w-[160px] select-all">{u.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-605">Registered</span>
                          <span className="text-white">
                            {u.createdAt?.seconds 
                              ? new Date(u.createdAt.seconds * 1000).toLocaleDateString()
                              : new Date().toLocaleDateString()
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-605">ID</span>
                          <span className="text-zinc-550 text-[8px] select-all">{u.id}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <span className="flex-1 py-1.5 text-center bg-[#050507] border border-neutral-900 text-zinc-500 rounded-xl text-[9px] font-bold uppercase font-mono tracking-wider shadow-[inset_1px_1px_3px_rgba(0,0,0,0.9)]">
                          Root Access
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EMPLOYEES LIST (Redesigned as Grid of 3D Cards) */}
          {activeMenu === "employees" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight uppercase">Registered Employees</h1>
                  <p className="text-[10px] text-zinc-555 font-mono uppercase">Talent workspace registry ({filteredEmployees.length})</p>
                </div>
              </div>

              {filteredEmployees.length === 0 ? (
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[32px] p-12 text-center shadow-[12px_12px_24px_rgba(0,0,0,0.85)]">
                  <p className="text-xs text-zinc-600 py-4 font-mono uppercase tracking-wider">No employee profiles matched query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEmployees.map((u) => (
                    <div key={u.id} className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.015)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[#B6F500] font-black text-xs shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]">
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-white uppercase tracking-wide truncate">{u.name || "Workspace Member"}</h4>
                          <span className="text-[9px] text-[#B6F500] font-mono font-bold uppercase tracking-wider">{u.company || "Fintrixity Inc"}</span>
                        </div>
                      </div>

                      <div className="my-4 space-y-1.5 pt-3 border-t border-neutral-900/60 text-[10px] text-zinc-400 font-mono">
                        <div className="flex justify-between">
                          <span className="text-zinc-605">Email Address</span>
                          <span className="text-white truncate max-w-[160px] select-all">{u.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-605">Joined</span>
                          <span className="text-white">
                            {u.createdAt?.seconds 
                              ? new Date(u.createdAt.seconds * 1000).toLocaleDateString()
                              : new Date().toLocaleDateString()
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-605">Role Status</span>
                          <span className="text-emerald-400 font-bold uppercase">Member</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <span className="flex-1 py-1.5 text-center bg-[#050507] border border-neutral-900 text-zinc-600 rounded-xl text-[9px] font-bold uppercase font-mono tracking-wider shadow-[inset_1px_1px_3px_rgba(0,0,0,0.9)]">
                          Standard Access
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPANIES LIST (Redesigned as Grid of 3D Cards) */}
          {activeMenu === "companies" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight uppercase">Registered Companies</h1>
                  <p className="text-[10px] text-zinc-555 font-mono uppercase">Collaborating clients & metrics ({filteredCompanies.length})</p>
                </div>
              </div>

              {filteredCompanies.length === 0 ? (
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[32px] p-12 text-center shadow-[12px_12px_24px_rgba(0,0,0,0.85)]">
                  <p className="text-xs text-zinc-600 py-4 font-mono uppercase tracking-wider">No registered companies found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((c) => (
                    <div key={c.id} className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.015)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#B6F500]/10 border border-[#B6F500]/20 flex items-center justify-center text-[#B6F500] shadow-[inset_1px_1px_3px_rgba(182,245,0,0.2)]">
                          <Buildings size={20} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-white uppercase tracking-wide truncate">{c.name}</h4>
                          <span className="text-[9px] text-[#B6F500] font-mono font-bold uppercase tracking-wider">{c.industry}</span>
                        </div>
                      </div>

                      <div className="my-4 space-y-1.5 pt-3 border-t border-neutral-900/60 text-[10px] text-zinc-400 font-mono">
                        <div className="flex justify-between">
                          <span className="text-zinc-605">Active Registry</span>
                          <span className="text-white font-bold">{c.employeesCount} Members</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-605">Added By Admin</span>
                          <span className="text-white">{c.addedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-655">Date Registered</span>
                          <span className="text-white">{c.dateAdded}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-900/40 flex gap-2">
                        <button className="flex-1 py-2 bg-gradient-to-r from-[#B6F500] to-[#00FF88] text-black font-black text-[9px] uppercase tracking-wider rounded-xl transition-all shadow-[0_2px_8px_rgba(182,245,0,0.2)] hover:opacity-95 cursor-pointer">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACTIVE API KEYS (Redesigned as Grid of 3D Cards) */}
          {activeMenu === "keys" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight uppercase">Active API Credentials</h1>
                  <p className="text-[10px] text-zinc-555 font-mono uppercase">Inference system tokens ({apiKeysList.length})</p>
                </div>
              </div>

              {apiKeysList.length === 0 ? (
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[32px] p-12 text-center shadow-[12px_12px_24px_rgba(0,0,0,0.85)]">
                  <p className="text-xs text-zinc-600 py-4 font-mono uppercase tracking-wider">No active API credentials found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apiKeysList.map((k) => (
                    <div key={k.id} className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 shadow-[10px_10px_20px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.015)] hover:shadow-[0_0_12px_rgba(182,245,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-center text-[#B6F500] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.95)]">
                          <Key size={18} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-white uppercase tracking-wide truncate">{k.name}</h4>
                          <span className="text-[9px] text-[#B6F500] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-[#B6F500] rounded-full animate-ping" /> {k.status}
                          </span>
                        </div>
                      </div>

                      <div className="my-4 space-y-1.5 pt-3 border-t border-neutral-900/60 text-[10px] text-zinc-400 font-mono">
                        <div className="space-y-1">
                          <span className="text-zinc-650 block text-[8px] uppercase font-bold tracking-wider">Token Key string</span>
                          <div className="flex items-center justify-between bg-[#050507] border border-neutral-900 rounded-xl px-3 py-2.5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]">
                            <span className="text-[#B6F500] font-bold select-all truncate max-w-[170px]">{k.id}</span>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(k.id);
                                alert("API Key copied to clipboard.");
                              }}
                              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                              title="Copy to clipboard"
                            >
                              <Copy size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between pt-2">
                          <span className="text-zinc-600">Owner UID</span>
                          <span className="text-white truncate max-w-[130px] select-all">{k.userId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-655">Created</span>
                          <span className="text-white">
                            {k.createdAt?.seconds 
                              ? new Date(k.createdAt.seconds * 1000).toLocaleDateString()
                              : new Date().toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-900/40 flex gap-2">
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="w-full py-2 bg-neutral-950 hover:bg-red-950/20 hover:text-red-400 border border-neutral-900 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-[inset_1px_1px_3px_rgba(0,0,0,0.9)]"
                        >
                          Revoke Token
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SYSTEM HEALTH (Redesigned as Grid of 3D Cards) */}
          {activeMenu === "health" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight uppercase">Infrastructure Health Status</h1>
                  <p className="text-[10px] text-zinc-555 font-mono uppercase">System network monitoring logs & latencies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Gateway component */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 shadow-[10px_10px_20px_rgba(0,0,0,0.85)] flex flex-col justify-between min-h-[160px]">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Inference Gateway</span>
                    <span className="text-xs text-white block mt-2 font-mono border border-neutral-900 bg-[#050507] p-2 rounded-xl text-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]">
                      POST /api/chat
                    </span>
                  </div>
                  <div className="pt-3 border-t border-neutral-900/60 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-650">CORS HEADERS</span>
                    <span className="text-[#B6F500] font-black uppercase tracking-wider">ACTIVE (200 OK)</span>
                  </div>
                </div>

                {/* LLM Engine status */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 shadow-[10px_10px_20px_rgba(0,0,0,0.85)] flex flex-col justify-between min-h-[160px]">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Model provider</span>
                    <span className="text-xs text-white block mt-2 font-mono border border-neutral-900 bg-[#050507] p-2 rounded-xl text-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]">
                      Pollinations AI Engine
                    </span>
                  </div>
                  <div className="pt-3 border-t border-neutral-900/60 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-650">FAILOVER TOKEN</span>
                    <span className="text-[#B6F500] font-black uppercase tracking-wider">TOKENLESS ACTIVE</span>
                  </div>
                </div>

                {/* Resource Metrics */}
                <div className="bg-[#0a0a0c] border border-neutral-900 rounded-[28px] p-5 shadow-[10px_10px_20px_rgba(0,0,0,0.85)] flex flex-col justify-between min-h-[160px]">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Server Resource Load</span>
                    <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[10px]">
                      <div className="bg-[#050507] border border-neutral-900 p-1.5 rounded-lg text-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.9)]">
                        <span className="text-zinc-600 block text-[8px]">CPU</span>
                        <span className="text-white font-bold">4.8%</span>
                      </div>
                      <div className="bg-[#050507] border border-neutral-900 p-1.5 rounded-lg text-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.9)]">
                        <span className="text-zinc-600 block text-[8px]">RAM</span>
                        <span className="text-white font-bold">1.2 GB</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-900/60 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-655">STATUS DIAGNOSTICS</span>
                    <span className="text-emerald-400 font-bold uppercase">Healthy</span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
