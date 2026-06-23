"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Cpu, User, WarningOctagon, CheckCircle, Trash, 
  Plus, X, Brain, Database, List, Gear, ChartBar, Users, 
  Key, Clock, SignOut, CaretRight, MagnifyingGlass, Question,
  EnvelopeSimple, Bell, ShareNetwork, ArrowRight, Wallet,
  TrendUp, ArrowUpRight
} from "@phosphor-icons/react";
import Link from "next/link";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";

interface AdminUser {
  id: string;
  name?: string;
  email?: string;
  createdAt?: any;
}

interface AdminApiKey {
  id: string;
  name: string;
  userId: string;
  createdAt: any;
  status: string;
}

export default function AdminCyberPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Menu Selection
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "analytics" | "keys" | "health">("dashboard");

  // Real-time DB Data
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [apiKeysList, setApiKeysList] = useState<AdminApiKey[]>([]);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated traffic / activities
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

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
          loaded.push({ id: d.id, ...d.data() });
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
      <div className="min-h-screen bg-[#0c0414] flex flex-col justify-center items-center relative overflow-hidden">
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="h-10 w-10 rounded-2xl bg-[#1c1528] border border-[#B6F500]/30 flex items-center justify-center animate-spin">
            <Cpu size={20} className="text-[#B6F500]" />
          </div>
          <span className="text-xs text-purple-300 font-bold uppercase tracking-widest animate-pulse">Initializing Portal...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0c0414] flex justify-center items-center relative overflow-hidden px-4 font-sans text-white">
        
        {/* Background Gradients (Sun Light) */}
        <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-45 pointer-events-none">
          <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
          <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
          <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        </div>

        <div className="w-full max-w-md bg-[#1c1528]/80 border border-purple-900/40 rounded-3xl p-8 shadow-2xl z-10 backdrop-blur-md relative overflow-hidden">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B6F500]/10 border border-[#B6F500]/30 text-[#B6F500] mb-1">
              <Brain size={24} weight="fill" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">CYBERLIM TEAM PANEL</h1>
            <p className="text-xs text-gray-400">AI Powered Team Management System</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Admin Email</label>
              <input
                type="email"
                required
                placeholder="rohitsengar02@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#0c0414] border border-purple-900/30 focus:border-[#B6F500] rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Secret Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#0c0414] border border-purple-900/30 focus:border-[#B6F500] rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors font-mono"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 bg-[#B6F500]/10 border border-[#B6F500]/30 px-3.5 py-2.5 rounded-xl text-[10px] font-bold text-[#B6F500] leading-normal">
                <WarningOctagon size={16} className="shrink-0 text-[#B6F500]" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#B6F500] to-[#00FF88] hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authSubmitting ? "Verifying..." : "Access Console"}
            </button>
          </form>
          
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-purple-900/20 text-[9px] text-gray-500 uppercase tracking-wider">
            <span>Security: Root</span>
            <Link href="/ai-test" className="text-[#B6F500] hover:underline">Exit Admin</Link>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex relative overflow-hidden font-sans">
      
      {/* Background Gradients (Sun Light) */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-45 pointer-events-none">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
      </div>

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#09030e] flex flex-col justify-between z-20 shrink-0 border-r border-purple-950/60">
        <div className="p-5 flex flex-col gap-6 overflow-y-auto flex-1 no-scrollbar">
          
          {/* Logo brand info */}
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-[#B6F500] to-[#00FF88] flex items-center justify-center text-black">
              <Cpu size={15} weight="fill" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">CyberLim AI</span>
          </div>

          {/* Search bar inside sidebar */}
          <div className="relative flex items-center bg-white/[0.03] border border-purple-900/30 rounded-xl px-3 py-2">
            <MagnifyingGlass className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs text-white outline-none w-full placeholder:text-gray-500"
            />
            <span className="text-[9px] bg-white/10 px-1 py-0.2 rounded font-mono text-gray-400 ml-1">⌘K</span>
          </div>

          {/* Menu Options */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMenu === "dashboard" 
                  ? "bg-white/[0.06] text-white border border-white/5" 
                  : "text-gray-400 hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <ChartBar size={16} /> Dashboard
              </div>
            </button>

            <button
              onClick={() => setActiveMenu("analytics")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMenu === "analytics" 
                  ? "bg-white/[0.06] text-white border border-white/5" 
                  : "text-gray-400 hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={16} /> Team Analytics
              </div>
              <span className="text-[10px] bg-white/10 text-gray-300 font-bold px-1.5 py-0.2 rounded-full">
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu("keys")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMenu === "keys" 
                  ? "bg-white/[0.06] text-white border border-white/5" 
                  : "text-gray-400 hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Key size={16} /> API Key Auditor
              </div>
              <span className="text-[10px] bg-white/10 text-gray-300 font-bold px-1.5 py-0.2 rounded-full">
                {apiKeysList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu("health")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMenu === "health" 
                  ? "bg-white/[0.06] text-white border border-white/5" 
                  : "text-gray-400 hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu size={16} /> System Health
              </div>
            </button>
          </div>

          {/* Features Section */}
          <div className="space-y-1.5 pt-4 border-t border-purple-900/25">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest pl-3.5 block mb-1">Features</span>
            
            <Link 
              href="/ai-test"
              className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-all block"
            >
              <Brain size={16} /> AI Chatbot Portal
            </Link>

            <div className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-white cursor-pointer">
              <div className="flex items-center gap-3">
                <Database size={16} /> Data Scraping
              </div>
              <span className="text-[9px] bg-[#B6F500]/10 text-[#B6F500] font-black uppercase px-1.5 py-0.2 rounded">Live</span>
            </div>
          </div>

        </div>

        {/* Upgrade Pro Promotion Card */}
        <div className="p-4 bg-[#09030e]/40">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4.5 space-y-3 relative overflow-hidden text-left">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              Upgrade Pro! 👑
            </h4>
            <p className="text-[10px] text-gray-400 leading-normal">Higher productivity with better organization and dedicated LLM compute.</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-gradient-to-r from-[#B6F500] to-[#00FF88] hover:opacity-90 text-black font-extrabold text-[10px] uppercase rounded-xl transition-all cursor-pointer">
                Upgrade
              </button>
              <button className="py-2 px-3 border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-[10px] rounded-xl transition-all cursor-pointer">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Logout block */}
        <div className="p-4 border-t border-purple-900/25 bg-[#07020a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#B6F500] to-[#00FF88] flex items-center justify-center font-black text-[10px] text-black">
              RS
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white leading-tight">Rohit Sengar</p>
              <p className="text-[8px] text-gray-500 leading-none">rohitsengar02</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 bg-white/5 hover:bg-[#B6F500]/10 text-gray-400 hover:text-[#B6F500] border border-white/10 rounded-lg transition-colors cursor-pointer"
            title="Sign out admin"
          >
            <SignOut size={13} weight="bold" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-transparent">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-purple-950/60 bg-[#09030e]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
            <div className="flex gap-1.5">
              <button className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:text-white transition-colors cursor-pointer">
                <ArrowLeft size={12} />
              </button>
              <button className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:text-white transition-colors cursor-pointer">
                <ArrowRight size={12} />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span>CyberLim</span>
              <CaretRight size={10} className="text-gray-600" />
              <span className="text-white font-semibold">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                <Question size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                <EnvelopeSimple size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl relative transition-colors cursor-pointer">
                <Bell size={16} />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#B6F500]" />
              </button>
            </div>
            
            <div className="w-[1.5px] h-4 bg-white/10 mx-1" />
            
            <button className="bg-gradient-to-r from-[#B6F500] to-[#00FF88] hover:opacity-90 text-black font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.8 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md">
              <ShareNetwork size={12} weight="bold" /> Share
            </button>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-left space-y-6">
          
          {activeMenu === "dashboard" && (
            <div className="space-y-6">
              {/* Overview Header */}
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Overview</h1>
                <p className="text-xs text-gray-400">Here is the summary of overall data</p>
              </div>

              {/* TOP CARDS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-[#B6F500] via-[#8ae600] to-[#00FF88] rounded-3xl p-5 shadow-xl text-black relative overflow-hidden flex flex-col justify-between min-h-[155px]">
                  <div className="absolute top-[-2rem] right-[-2rem] w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-black/10 rounded-xl">
                        <Wallet size={16} weight="fill" />
                      </span>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-black/60">Active AI Agents</span>
                        <span className="block text-[9px] font-semibold text-black/55 mt-0.5">Spend Limit & Tokens</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-2xl font-black tracking-tight">$28,520.30</span>
                      <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                        +15% <ArrowUpRight size={8} weight="bold" />
                      </span>
                    </div>
                    <button className="w-full text-left text-[10px] font-bold uppercase tracking-wider text-black/75 mt-4 pt-3.5 border-t border-black/10 flex justify-between items-center hover:text-black transition-colors cursor-pointer">
                      See details <ArrowRight size={10} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Savings count Card */}
                <div className="bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[155px] group hover:border-[#B6F500]/20 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-white/[0.04] rounded-xl text-gray-300">
                        <Users size={16} weight="fill" />
                      </span>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Savings account</span>
                        <span className="block text-[9px] font-semibold text-gray-500 mt-0.5">Steady Growth Savings</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-2xl font-black tracking-tight text-white">$24,800.45</span>
                      <span className="text-[9px] text-[#B6F500] font-bold flex items-center gap-0.5">
                        +3.2%
                      </span>
                    </div>
                    <button className="w-full text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center hover:text-white transition-colors cursor-pointer">
                      View summary <ArrowRight size={10} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Investment portfolio Card */}
                <div className="bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[155px] group hover:border-[#B6F500]/20 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-white/[0.04] rounded-xl text-gray-300">
                        <Key size={16} weight="fill" />
                      </span>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Investment portfolio</span>
                        <span className="block text-[9px] font-semibold text-gray-500 mt-0.5">Track Your Wealth Growth</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-2xl font-black tracking-tight text-white">$70,120.78</span>
                      <span className="text-[9px] text-gray-500 font-bold flex items-center gap-0.5">
                        -4.7%
                      </span>
                    </div>
                    <button className="w-full text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center hover:text-white transition-colors cursor-pointer">
                      Analyze performance <ArrowRight size={10} weight="bold" />
                    </button>
                  </div>
                </div>

              </div>

              {/* MIDDLE ROW: WALLET & CHART */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Wallet Details panel */}
                <div className="lg:col-span-2 bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">My Wallet</h2>
                      <p className="text-[10px] text-gray-450 mt-0.5">Today 1 USD = 122.20 BDT</p>
                    </div>
                    <button className="bg-[#B6F500] hover:opacity-90 text-black font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-xl transition-all cursor-pointer">
                      + Add New
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Wallet item USD */}
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">🇺🇸 USD</span>
                      </div>
                      <span className="block text-sm font-black text-white">$24,678.00</span>
                      <span className="block text-[8px] text-gray-500 mt-0.5">Limit is $10k a month</span>
                      <span className="block text-[8px] text-[#B6F500] font-black uppercase tracking-wider mt-2">Active</span>
                    </div>

                    {/* Wallet item EUR */}
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">🇪🇺 EUR</span>
                      </div>
                      <span className="block text-sm font-black text-white">€28,345.00</span>
                      <span className="block text-[8px] text-gray-500 mt-0.5">Limit is €5k a month</span>
                      <span className="block text-[8px] text-[#B6F500] font-black uppercase tracking-wider mt-2">Active</span>
                    </div>

                    {/* Wallet item AUD */}
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">🇦🇺 AUD</span>
                      </div>
                      <span className="block text-sm font-black text-white">$20,517.52</span>
                      <span className="block text-[8px] text-gray-500 mt-0.5">Limit is $10k a month</span>
                      <span className="block text-[8px] text-[#B6F500] font-black uppercase tracking-wider mt-2">Active</span>
                    </div>

                    {/* Wallet item GBP */}
                    <div className="p-3 bg-[#0e0e11] border border-white/5 rounded-2xl relative overflow-hidden opacity-60">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">🇬🇧 GBP</span>
                      </div>
                      <span className="block text-sm font-black text-white">£25,000.00</span>
                      <span className="block text-[8px] text-gray-500 mt-0.5">Limit is £7.5k a month</span>
                      <span className="block text-[8px] text-gray-500 font-black uppercase tracking-wider mt-2">Inactive</span>
                    </div>

                  </div>
                </div>

                {/* Cash Flow Chart panel */}
                <div className="lg:col-span-3 bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Cash Flow</h2>
                      <span className="text-2xl font-black tracking-tight text-white block mt-0.5">$540,323.45</span>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-[9px]">
                      <button className="px-2.5 py-1 text-gray-400 hover:text-white rounded">Monthly</button>
                      <button className="px-2.5 py-1 bg-[#B6F500] text-black font-extrabold rounded-lg">Yearly</button>
                    </div>
                  </div>

                  {/* Vertical bar chart container */}
                  <div className="relative pt-4">
                    
                    {/* Tooltip Overlay Mock */}
                    <div className="absolute top-[-10px] right-[25%] bg-[#09030e] border border-purple-900/30 rounded-xl p-2.5 text-[9px] leading-relaxed shadow-2xl z-10 font-mono">
                      <span className="block text-gray-400">July 23, 2026</span>
                      <div className="flex justify-between gap-4 mt-0.5">
                        <span className="text-white font-bold">Cashflow</span>
                        <span className="text-[#B6F500] font-black">$33,847.00</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Inflow</span>
                        <span className="text-gray-300">-$7,456.00</span>
                      </div>
                    </div>

                    <div className="h-44 flex items-end justify-between px-2 pt-2 border-b border-white/5 pb-2.5 relative">
                      
                      {/* Grid Lines */}
                      <div className="absolute inset-x-0 bottom-[20%] border-t border-white/[0.02]" />
                      <div className="absolute inset-x-0 bottom-[40%] border-t border-white/[0.02]" />
                      <div className="absolute inset-x-0 bottom-[60%] border-t border-white/[0.02]" />
                      <div className="absolute inset-x-0 bottom-[80%] border-t border-white/[0.02]" />

                      {/* Bar Jan */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-9 bg-white/[0.04] rounded-lg transition-all hover:bg-white/[0.08]" style={{ height: "45px" }} />
                        <span className="text-[9px] text-gray-500 font-mono">Jan</span>
                      </div>

                      {/* Bar Feb */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-9 bg-white/[0.04] rounded-lg transition-all hover:bg-white/[0.08]" style={{ height: "65px" }} />
                        <span className="text-[9px] text-gray-500 font-mono">Feb</span>
                      </div>

                      {/* Bar Mar (Vibrant selected gradient bar) */}
                      <div className="flex flex-col items-center gap-2 flex-1 relative group">
                        <div className="w-9 bg-gradient-to-t from-[#ffffff] to-[#B6F500] rounded-lg shadow-[0_4px_25px_rgba(182,245,0,0.35)] transition-all cursor-pointer relative" style={{ height: "115px" }}>
                          <span className="absolute top-1 right-1/2 translate-x-1/2 h-1.5 w-1.5 bg-white rounded-full border border-[#B6F500] animate-ping" />
                        </div>
                        <span className="text-[9px] text-white font-black font-mono">Mar</span>
                      </div>

                      {/* Bar Apr */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-9 bg-white/[0.04] rounded-lg transition-all hover:bg-white/[0.08]" style={{ height: "55px" }} />
                        <span className="text-[9px] text-gray-500 font-mono">Apr</span>
                      </div>

                      {/* Bar May */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-9 bg-white/[0.04] rounded-lg transition-all hover:bg-white/[0.08]" style={{ height: "95px" }} />
                        <span className="text-[9px] text-gray-500 font-mono">May</span>
                      </div>

                      {/* Bar Jun */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-9 bg-white/[0.04] rounded-lg transition-all hover:bg-white/[0.08]" style={{ height: "45px" }} />
                        <span className="text-[9px] text-gray-500 font-mono">Jun</span>
                      </div>

                      {/* Bar Jul */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-9 bg-white/[0.04] rounded-lg transition-all hover:bg-white/[0.08]" style={{ height: "60px" }} />
                        <span className="text-[9px] text-gray-500 font-mono">Jul</span>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* BOTTOM ROW: RECENT ACTIVITIES TABLE */}
              <div className="bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activities</h2>
                  
                  <div className="flex gap-2 w-full sm:max-w-xs justify-end">
                    {/* Table search bar */}
                    <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1.5 w-full">
                      <MagnifyingGlass className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-[11px] text-white outline-none w-full placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#09030e]/40">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#161619] text-gray-400 font-semibold border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3">Activity</th>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Cost</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentActivities
                        .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((act) => (
                          <tr key={act.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                              <span className="h-6 w-6 rounded-lg bg-[#B6F500]/10 border border-[#B6F500]/20 flex items-center justify-center text-[#B6F500]">
                                <Cpu size={12} />
                              </span>
                              {act.name}
                            </td>
                            <td className="px-4 py-3 font-mono text-gray-400">{act.orderId}</td>
                            <td className="px-4 py-3 text-gray-400">{act.date}</td>
                            <td className="px-4 py-3 text-gray-400">{act.time}</td>
                            <td className="px-4 py-3 font-bold text-white font-mono">{act.cost}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-950/65 text-emerald-450 border border-emerald-900/40 px-2 py-0.5 rounded-full font-bold">
                                <span className="h-1 bg-emerald-400 rounded-full" /> {act.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TEAM ANALYTICS / USERS LIST */}
          {activeMenu === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Team Members List</h1>
                <p className="text-xs text-gray-400">Total registered members inside your Workspace</p>
              </div>

              <div className="bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5">
                {usersList.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-8 text-center">No team members registered yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#09030e]/40">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#161619] text-gray-400 font-semibold border-b border-white/5">
                        <tr>
                          <th className="px-4 py-3">Member ID</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Registry Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {usersList.map((u) => (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 font-mono text-gray-400">{u.id}</td>
                            <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#B6F500] to-[#00FF88] flex items-center justify-center text-black font-extrabold text-[9px]">
                                {u.name ? u.name[0].toUpperCase() : "U"}
                              </div>
                              {u.name || "Workspace User"}
                            </td>
                            <td className="px-4 py-3 text-gray-400 font-mono">{u.email}</td>
                            <td className="px-4 py-3 text-gray-400">
                              {u.createdAt?.seconds 
                                ? new Date(u.createdAt.seconds * 1000).toLocaleDateString()
                                : new Date().toLocaleDateString()
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: API KEY AUDITOR */}
          {activeMenu === "keys" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Active API Credentials</h1>
                <p className="text-xs text-gray-400">Audit system integrations, access logs, and revoke tokens</p>
              </div>

              <div className="bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5">
                {apiKeysList.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-8 text-center">No active API keys found.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#09030e]/40">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#161619] text-gray-400 font-semibold border-b border-white/5">
                        <tr>
                          <th className="px-4 py-3">Token</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Owner UID</th>
                          <th className="px-4 py-3">Created At</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {apiKeysList.map((k) => (
                          <tr key={k.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 font-mono text-[#B6F500] font-bold select-all">{k.id}</td>
                            <td className="px-4 py-3 font-semibold text-white">{k.name}</td>
                            <td className="px-4 py-3 text-gray-400 font-mono">{k.userId}</td>
                            <td className="px-4 py-3 text-gray-400">
                              {k.createdAt?.seconds 
                                ? new Date(k.createdAt.seconds * 1000).toLocaleDateString()
                                : new Date().toLocaleDateString()
                              }
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1.5 text-[9px] bg-emerald-950/65 text-emerald-450 border border-emerald-900/40 px-2 py-0.5 rounded-full font-bold">
                                {k.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleRevokeKey(k.id)}
                                className="text-[10px] font-bold text-[#B6F500] bg-[#B6F500]/5 hover:bg-[#B6F500]/10 border border-[#B6F500]/25 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM HEALTH */}
          {activeMenu === "health" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">System Infrastructure Health</h1>
                <p className="text-xs text-gray-400">Diagnose latencies, endpoint logs, and CPU thread connections</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5 space-y-1">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Inference Gateway</span>
                  <span className="text-xs text-white block mt-1 font-mono">POST /api/chat</span>
                  <span className="text-[9px] text-[#B6F500] font-black uppercase tracking-wider mt-2 block">CORS Headers Active</span>
                </div>

                <div className="bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5 space-y-1">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">LLM Provider Status</span>
                  <span className="text-xs text-white block mt-1">Pollinations AI Engine</span>
                  <span className="text-[9px] text-emerald-450 font-black uppercase tracking-wider mt-2 block">ONLINE (Tokenless Failover)</span>
                </div>

                <div className="bg-[#161619]/60 backdrop-blur-md border border-purple-900/20 rounded-3xl p-5 space-y-1">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Server Load</span>
                  <span className="text-xs text-white block mt-1 font-mono">CPU: 4.8% | RAM: 1.2 GB</span>
                  <span className="text-[9px] text-emerald-450 font-black uppercase tracking-wider mt-2 block">Healthy</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
