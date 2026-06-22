"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Sparkle, PaperPlaneRight, Cpu, User, WarningOctagon, CheckCircle, Image as ImageIcon, Download, Trash, Cloud, Chat, Paperclip, Gear, Plus, List, ArrowLineLeft, ArrowLineRight, Microphone, MicrophoneSlash, StopCircle, Globe, MagnifyingGlass, X, Brain, Database } from "@phosphor-icons/react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, deleteDoc, collection, query, orderBy, onSnapshot, getDoc, where } from "firebase/firestore";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  type?: "text" | "image";
  imageUrl?: string;
  isStreaming?: boolean;
  images?: string[];
  weather?: {
    city: string;
    temp_C: string;
    condition: string;
    humidity: string;
    wind: string;
    feels_like: string;
    icon: string;
    forecast: { date: string; maxTemp: string; minTemp: string; condition: string }[];
  };
  stock?: {
    symbol: string;
    price: string;
    currency: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
  };
}

interface ChatSession {
  id: string;
  title: string;
  type: "text" | "image";
  messages: ChatMessage[];
  isPersonalBot?: boolean;
  knowledgeBase?: string;
  botName?: string;
}

const sanitizeForFirestore = (obj: any): any => {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  if (typeof obj === "object") {
    // If it's a Date object, return it as is (Firestore supports Date)
    if (obj instanceof Date) return obj;
    const sanitized: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        sanitized[key] = sanitizeForFirestore(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

export default function AiTestPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "welcome-session",
      title: "New Chat Session",
      type: "text",
      messages: []
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState("welcome-session");
  // Active Session helper
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const activeWindow = activeSession.type;
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [themeMode, setThemeMode] = useState<"purple" | "dark" | "blue">("purple");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitleInput, setEditingTitleInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  // Developer API States
  const [activeView, setActiveView] = useState<"workspace" | "api-dashboard">("workspace");
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [apiKeyNameInput, setApiKeyNameInput] = useState("");
  const [apiKeySubmitting, setApiKeySubmitting] = useState(false);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);

  const generateApiKey = async () => {
    if (!apiKeyNameInput.trim() || !currentUser) return;
    setApiKeySubmitting(true);
    try {
      const randomPart = Array.from({ length: 24 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      const generatedKey = `cl_api_${randomPart}`;
      
      await setDoc(doc(db, "apiKeys", generatedKey), {
        name: apiKeyNameInput.trim(),
        userId: currentUser.uid,
        createdAt: new Date(),
        status: "active"
      });
      
      setNewlyGeneratedKey(generatedKey);
      setApiKeyNameInput("");
    } catch (err) {
      console.error("Error generating API key:", err);
    } finally {
      setApiKeySubmitting(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    if (!currentUser) return;
    if (confirm("Are you sure you want to revoke this API key? External apps using this key will immediately lose access.")) {
      try {
        await deleteDoc(doc(db, "apiKeys", keyId));
        if (newlyGeneratedKey === keyId) {
          setNewlyGeneratedKey(null);
        }
      } catch (err) {
        console.error("Error revoking API key:", err);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const handleRenameSession = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle.trim() } : s));
    if (currentUser) {
      try {
        await setDoc(doc(db, "users", currentUser.uid, "chats", id), {
          title: newTitle.trim()
        }, { merge: true });
      } catch (err) {
        console.error("Error renaming chat:", err);
      }
    }
    setEditingSessionId(null);
  };

  // Firebase Auth States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Monitor Auth State and fetch sessions in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Fetch user profile name
        getDoc(doc(db, "users", user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile({ name: user.displayName || user.email || "User" });
          }
        }).catch((err) => {
          console.error("Error fetching user profile:", err);
          setUserProfile({ name: user.displayName || user.email || "User" });
        });
        
        // Listen to chats collection from Firestore in real-time
        const q = query(collection(db, "users", user.uid, "chats"), orderBy("createdAt", "desc"));
        const unsubscribeSessions = onSnapshot(q, (snapshot) => {
          const loadedSessions: ChatSession[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            loadedSessions.push({
              id: doc.id,
              title: data.title,
              type: data.type,
              messages: data.messages || [],
              isPersonalBot: data.isPersonalBot,
              knowledgeBase: data.knowledgeBase,
            });
          });
          
          if (loadedSessions.length > 0) {
            setSessions(loadedSessions);
            setActiveSessionId(prev => {
              if (prev === "welcome-session" || !loadedSessions.find(s => s.id === prev)) {
                return loadedSessions[0].id;
              }
              return prev;
            });
          } else {
            // Seed a welcome session if none exists
            const welcomeId = "welcome-session";
            setDoc(doc(db, "users", user.uid, "chats", welcomeId), {
              title: "New Chat Session",
              type: "text",
              messages: [],
              createdAt: new Date(),
            });
          }
        });

        // Listen to API keys from Firestore in real-time
        const apiKeysQuery = query(collection(db, "apiKeys"), where("userId", "==", user.uid));
        const unsubscribeApiKeys = onSnapshot(apiKeysQuery, (snapshot) => {
          const loadedKeys: any[] = [];
          snapshot.forEach((docSnap) => {
            loadedKeys.push({
              id: docSnap.id,
              ...docSnap.data()
            });
          });
          setApiKeys(loadedKeys);
        });
        
        setAuthLoading(false);
        return () => {
          unsubscribeSessions();
          unsubscribeApiKeys();
        };
      } else {
        setCurrentUser(null);
        setSessions([
          {
            id: "welcome-session",
            title: "New Chat Session",
            type: "text",
            messages: []
          }
        ]);
        setActiveSessionId("welcome-session");
        setApiKeys([]);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync session changes back to Firestore (Debounced to protect rates)
  useEffect(() => {
    if (!currentUser) return;
    // Don't save empty welcome session if not modified
    if (activeSessionId === "welcome-session" && activeSession.messages.length === 0 && !activeSession.isPersonalBot) return;

    const saveTimeout = setTimeout(async () => {
      try {
        const payload = sanitizeForFirestore({
          title: activeSession.title,
          type: activeSession.type,
          messages: activeSession.messages,
          isPersonalBot: activeSession.isPersonalBot || false,
          knowledgeBase: activeSession.knowledgeBase || "",
          createdAt: new Date(), // Keep a reference
        });
        await setDoc(doc(db, "users", currentUser.uid, "chats", activeSessionId), payload, { merge: true });
      } catch (err) {
        console.error("Firestore sync error:", err);
      }
    }, 800);

    return () => clearTimeout(saveTimeout);
  }, [activeSession.messages, activeSession.title, activeSession.isPersonalBot, activeSession.knowledgeBase, currentUser, activeSessionId]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      } else {
        if (!nameInput.trim()) {
          throw new Error("Name is required for registration.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
        const user = userCredential.user;
        
        // Save user profile to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: nameInput.trim(),
          email: emailInput,
          createdAt: new Date(),
        });
      }
      
      // Clear inputs on success
      setEmailInput("");
      setPasswordInput("");
      setNameInput("");
    } catch (err: any) {
      console.error(err);
      let cleanMsg = err.message || "Authentication failed.";
      if (cleanMsg.includes("auth/invalid-credential")) {
        cleanMsg = "Invalid email or password.";
      } else if (cleanMsg.includes("auth/email-already-in-use")) {
        cleanMsg = "This email is already registered.";
      } else if (cleanMsg.includes("auth/weak-password")) {
        cleanMsg = "Password should be at least 6 characters.";
      }
      setAuthError(cleanMsg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Personal Bot States
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [memoryInput, setMemoryInput] = useState("");
  const [botNameInput, setBotNameInput] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"all" | "text" | "image" | "personal">("all");

  // PDF Preview and Resizing States
  const [pdfContent, setPdfContent] = useState("");
  const [showPdfSidebar, setShowPdfSidebar] = useState(false);
  const [pdfWidth, setPdfWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Voice Agent States
  const [isVoiceAgentActive, setIsVoiceAgentActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const voiceStatusRef = useRef<"idle" | "listening" | "thinking" | "speaking">("idle");
  const updateVoiceStatus = (status: "idle" | "listening" | "thinking" | "speaking") => {
    setVoiceStatus(status);
    voiceStatusRef.current = status;
  };
  const [voiceBubbleText, setVoiceBubbleText] = useState("");
  const [voiceLang, setVoiceLang] = useState<"en-US" | "hi-IN">("en-US");
  const recognitionRef = useRef<any>(null);

  // Resume Template States
  const [showResumeTemplates, setShowResumeTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const showResumeTemplatesRef = useRef(false);

  // Web Search States
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [plusSearchQuery, setPlusSearchQuery] = useState("");
  const [activeSearchMode, setActiveSearchMode] = useState<string | null>(null);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [searchResultData, setSearchResultData] = useState<any>(null);
  const [showBrowserSidebar, setShowBrowserSidebar] = useState(false);
  const [browserSidebarWidth, setBrowserSidebarWidth] = useState(480);
  const [browserSearchQuery, setBrowserSearchQuery] = useState("");
  const [browserUrl, setBrowserUrl] = useState("https://www.google.com/webhp?igu=1");
  const [browserAddressInput, setBrowserAddressInput] = useState("https://www.google.com/webhp?igu=1");
  const [expandedScrapeIdx, setExpandedScrapeIdx] = useState<number | null>(null);
  const [scrapingLogs, setScrapingLogs] = useState<string[]>([]);
  const [isScrapingActive, setIsScrapingActive] = useState(false);

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [animatedSearchQuery, setAnimatedSearchQuery] = useState("");

  // Image analysis states
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          console.log("Geoposition captured:", position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation permission declined/unavailable:", err);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (isSearchingWeb && browserSearchQuery) {
      setAnimatedSearchQuery("");
      let currentText = "";
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < browserSearchQuery.length) {
          currentText += browserSearchQuery[idx];
          setAnimatedSearchQuery(currentText);
          idx++;
        } else {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [isSearchingWeb, browserSearchQuery]);

  const searchOptions = [
    { id: "google", name: "Google Web Search", icon: "🌐", desc: "Search Google and scrape top pages" },
    { id: "news", name: "Latest News Search", icon: "📰", desc: "Retrieve recent news and articles" },
    { id: "wikipedia", name: "Wikipedia Lookup", icon: "🧠", desc: "Fetch summaries from Wikipedia pages" },
    { id: "weather", name: "Weather Scraper", icon: "🌤️", desc: "Get real-time weather reports" },
    { id: "finance", name: "Stock/Market Data", icon: "📉", desc: "Search current financial stats" }
  ];

  const resumeTemplates = [
    {
      id: 1,
      name: "Modern Minimal",
      accent: "#6366f1",
      gradient: "from-indigo-500 to-blue-500",
      icon: "✦",
      desc: "Clean single-column layout with elegant spacing",
      prompt: "Use a clean, minimalist single-column layout. Use a large bold name at top, thin horizontal rule, then sections for Summary, Experience (with company/date), Skills (comma-separated list), and Education. Keep whitespace generous."
    },
    {
      id: 2,
      name: "Creative Bold",
      accent: "#ec4899",
      gradient: "from-pink-500 to-rose-500",
      icon: "◆",
      desc: "Eye-catching layout with bold headers and icons",
      prompt: "Use a bold creative layout with large section headers, emoji icons before each section title, skill tags as bullet badges, colorful section dividers. Make it stand out visually with markdown formatting."
    },
    {
      id: 3,
      name: "Corporate Classic",
      accent: "#0ea5e9",
      gradient: "from-sky-500 to-cyan-500",
      icon: "■",
      desc: "Traditional professional format for corporate roles",
      prompt: "Use a traditional corporate resume format. Name centered at top with contact info below, followed by Professional Summary, Work Experience (reverse chronological with bullet points), Education, and Certifications. Use formal language."
    },
    {
      id: 4,
      name: "Tech Stack",
      accent: "#22c55e",
      gradient: "from-emerald-500 to-green-500",
      icon: "⚡",
      desc: "Developer-focused with skills matrix & projects",
      prompt: "Use a developer/engineer focused layout. Start with name and links (GitHub, LinkedIn). Include a Skills table with proficiency levels, then Projects section with descriptions and tech stacks, Work Experience, and Education. Use code-style formatting for tech names."
    },
    {
      id: 5,
      name: "Elegant Two-Column",
      accent: "#f59e0b",
      gradient: "from-amber-500 to-yellow-500",
      icon: "◎",
      desc: "Sophisticated split layout with sidebar info",
      prompt: "Create a two-column style resume using a markdown table. Left column (narrow) has Contact Info, Skills, Languages, and Interests. Right column (wide) has Professional Summary, Experience, and Education. Use horizontal rules between sections."
    },
    {
      id: 6,
      name: "Gradient Designer",
      accent: "#a855f7",
      gradient: "from-purple-500 to-violet-500",
      icon: "★",
      desc: "Portfolio-style layout for creatives & designers",
      prompt: "Use a creative portfolio-style resume. Start with a bold artistic header with the person's name and tagline. Include a Portfolio Highlights section, Creative Experience with project descriptions, Skills & Tools, Awards, and Education. Use expressive language and emoji accents."
    }
  ];

  const handleSelectResumeTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
    setShowResumeTemplates(false);
    showResumeTemplatesRef.current = false;
    const template = resumeTemplates.find(t => t.id === templateId);
    if (!template) return;

    const resumePrompt = `Create a professional resume for a sample candidate (use a realistic fictional name and details) using the "${template.name}" style. ${template.prompt}\n\nIMPORTANT: Wrap the ENTIRE resume content inside [PDF_START] and [PDF_END] tags. Make the content complete and professional.`;

    if (isVoiceAgentActive) {
      // In voice mode, send through the chat handler but stay in voice mode
      handleSendText(undefined, resumePrompt);
    } else {
      handleSendText(undefined, resumePrompt);
    }
  };


  const [textInput, setTextInput] = useState("");
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [textStatus, setTextStatus] = useState<"idle" | "success" | "error">("idle");
  const [textErrorMsg, setTextErrorMsg] = useState("");

  const [imageInput, setImageInput] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState<"idle" | "success" | "error">("idle");
  const [imageErrorMsg, setImageErrorMsg] = useState("");

  const textChatEndRef = useRef<HTMLDivElement>(null);
  const imageChatEndRef = useRef<HTMLDivElement>(null);



  const toggleMicrophone = () => {
    if (typeof window === "undefined") return;

    if (voiceStatusRef.current === "listening" || voiceStatusRef.current === "speaking" || voiceStatusRef.current === "thinking") {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      updateVoiceStatus("idle");
      setVoiceBubbleText("");
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = voiceLang;

    let silenceTimer: NodeJS.Timeout;
    let accumulatedInput = "";

    rec.onstart = () => {
      updateVoiceStatus("listening");
      setVoiceBubbleText(voiceLang === "hi-IN" ? "सुन रहा हूँ... बोलिए।" : "Listening... Speak now.");
    };

    rec.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setVoiceBubbleText("Error: " + event.error);
        updateVoiceStatus("idle");
      }
    };

    rec.onend = () => {
      if (recognitionRef.current === rec && voiceStatusRef.current === "listening") {
        updateVoiceStatus("idle");
      }
    };

    rec.onresult = async (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const currentText = finalTranscript || interimTranscript;
      if (currentText) {
        setVoiceBubbleText(currentText);
      }

      if (finalTranscript) {
        accumulatedInput += " " + finalTranscript;
        
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(async () => {
          const query = accumulatedInput.trim();
          accumulatedInput = "";
          if (!query) return;

          // Check for resume trigger
          const lowerQuery = query.toLowerCase();
          if (lowerQuery.includes("resume") || lowerQuery.includes("रिज्यूम") || lowerQuery.includes("रेज़्यूमे") || lowerQuery.includes("बायोडाटा")) {
            setShowResumeTemplates(true);
            showResumeTemplatesRef.current = true;
            setVoiceBubbleText(voiceLang === "hi-IN" ? "कृपया एक टेम्पलेट चुनें (1-6)" : "Choose a template by saying a number (1-6)");
            // Don't stop listening, wait for number
            return;
          }

          // Check for number selection while templates are visible
          if (showResumeTemplatesRef.current) {
            const numMatch = lowerQuery.match(/\b([1-6])\b|\bone\b|\btwo\b|\bthree\b|\bfour\b|\bfive\b|\bsix\b|\bएक\b|\bदो\b|\bतीन\b|\bचार\b|\bपांच\b|\bछह\b/);
            if (numMatch) {
              const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पांच": 5, "छह": 6 };
              const num = wordToNum[numMatch[0].toLowerCase()] || parseInt(numMatch[0]);
              if (num >= 1 && num <= 6) {
                rec.stop();
                updateVoiceStatus("thinking");
                setVoiceBubbleText(voiceLang === "hi-IN" ? `टेम्पलेट ${num} चुना गया...` : `Template ${num} selected...`);
                handleSelectResumeTemplate(num);
                return;
              }
            }
          }

          rec.stop();
          updateVoiceStatus("thinking");

          setSessions((prev) => prev.map(s => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: [...s.messages, { role: "user", content: query, type: "text" }]
              };
            }
            return s;
          }));

          let promptToSend = query;
          if (voiceLang === "hi-IN") {
            promptToSend = `${query}\n\nIMPORTANT: Please reply to this query in HINDI (हिंदी भाषा). Use Devanagari script. Keep it friendly and concise so it can be spoken easily.`;
          }

          try {
            const response = await fetch("/api/hf-text", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt: promptToSend, model: "pollinations" })
            });

            if (!response.ok) throw new Error("Voice response failed");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No stream reader available");

            updateVoiceStatus("speaking");
            setVoiceBubbleText("");

            let accumulatedResponse = "";
            let speakBuffer = "";
            let speechQueue: string[] = [];
            let isSpeakingQueue = false;

            const speakNext = () => {
              if (isSpeakingQueue || speechQueue.length === 0) return;
              const synth = window.speechSynthesis;
              if (!synth) return;

              const textToSpeak = speechQueue.shift();
              if (!textToSpeak) return;

              isSpeakingQueue = true;
              const cleanedText = textToSpeak.replace(/\[PDF_START\][\s\S]*?\[PDF_END\]/g, "").trim();
              if (!cleanedText) {
                isSpeakingQueue = false;
                speakNext();
                return;
              }

              const utterance = new SpeechSynthesisUtterance(cleanedText);
              const voices = synth.getVoices();
              let premiumVoice = null;
              if (voiceLang === "hi-IN") {
                premiumVoice = voices.find(v => v.lang.startsWith("hi"));
                utterance.lang = "hi-IN";
              } else {
                premiumVoice = voices.find(v => 
                  v.name.includes("Google") || 
                  v.name.includes("Natural") || 
                  v.name.includes("Microsoft") || 
                  v.name.includes("Samantha") ||
                  v.name.includes("Siri") ||
                  v.lang.startsWith("en-US")
                );
              }

              if (premiumVoice) {
                utterance.voice = premiumVoice;
              }

              utterance.onend = () => {
                isSpeakingQueue = false;
                if (speechQueue.length === 0) {
                  updateVoiceStatus("listening");
                  setVoiceBubbleText(voiceLang === "hi-IN" ? "सुन रहा हूँ... बोलिए।" : "Listening... Speak now.");
                  try {
                    rec.start();
                  } catch {}
                } else {
                  speakNext();
                }
              };

              utterance.onerror = () => {
                isSpeakingQueue = false;
                if (speechQueue.length === 0) {
                  updateVoiceStatus("listening");
                  try {
                    rec.start();
                  } catch {}
                } else {
                  speakNext();
                }
              };

              synth.speak(utterance);
            };

            let streamBuffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const streamLines = chunk.split("\n");

              for (let i = 0; i < streamLines.length; i++) {
                let line = streamLines[i];
                if (i === 0) {
                  line = streamBuffer + line;
                  streamBuffer = "";
                }
                if (i === streamLines.length - 1) {
                  streamBuffer = line;
                  continue;
                }

                const cleanedLine = line.trim();
                if (!cleanedLine) continue;

                let tokenText = "";
                if (cleanedLine.startsWith("data:")) {
                  const dataStr = cleanedLine.slice(5).trim();
                  if (dataStr === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(dataStr);
                    tokenText = parsed.choices?.[0]?.delta?.content || "";
                  } catch {
                    tokenText = dataStr;
                  }
                } else {
                  try {
                    const parsed = JSON.parse(cleanedLine);
                    tokenText = parsed.choices?.[0]?.delta?.content || "";
                  } catch {}
                }

                if (tokenText) {
                  accumulatedResponse += tokenText;
                  speakBuffer += tokenText;
                  setVoiceBubbleText(accumulatedResponse);

                  const sentenceEndIdx = Math.max(
                    speakBuffer.lastIndexOf("."),
                    speakBuffer.lastIndexOf("?"),
                    speakBuffer.lastIndexOf("!"),
                    speakBuffer.lastIndexOf("\n"),
                    speakBuffer.lastIndexOf("।")
                  );

                  if (sentenceEndIdx !== -1) {
                    const sentence = speakBuffer.substring(0, sentenceEndIdx + 1);
                    speakBuffer = speakBuffer.substring(sentenceEndIdx + 1);
                    if (sentence.trim()) {
                      speechQueue.push(sentence.trim());
                      speakNext();
                    }
                  }
                }
              }
            }

            if (speakBuffer.trim()) {
              speechQueue.push(speakBuffer.trim());
              speakNext();
            }

            setSessions((prev) => prev.map(s => {
              if (s.id === activeSessionId) {
                return {
                  ...s,
                  messages: [...s.messages, { role: "assistant", content: accumulatedResponse, type: "text" }]
                };
              }
              return s;
            }));

          } catch (err) {
            console.error(err);
            updateVoiceStatus("listening");
            setVoiceBubbleText(voiceLang === "hi-IN" ? "जवाब प्राप्त करने में विफल रहा।" : "Failed to load reply.");
            try {
              rec.start();
            } catch {}
          }
        }, 1500);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      console.error("Start error:", err);
    }
  };


  // Drag-to-resize handler
  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 320 && newWidth < window.innerWidth * 0.75) {
        setPdfWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Dynamic PDF Download using jsPDF and html2canvas
  const downloadPdf = async () => {
    const element = document.getElementById("pdf-preview-canvas");
    if (!element) return;

    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      // Create a hidden iframe to isolate the element from global stylesheets (which may contain unsupported CSS like lab() or oklch())
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.width = "800px";
      iframe.style.height = "1100px";
      iframe.style.visibility = "hidden";
      iframe.style.left = "-10000px";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        document.body.removeChild(iframe);
        throw new Error("Could not create isolated iframe document");
      }

      // Write basic document structure with clean styles
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                background-color: #ffffff;
                color: #000000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              }
              /* Strict printable styles matching preview */
              .pdf-container {
                width: 595px;
                min-height: 842px;
                padding: 40px;
                box-sizing: border-box;
                background-color: #ffffff;
                color: #000000;
              }
              h1 { font-size: 20px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
              h2 { font-size: 16px; font-weight: bold; margin-top: 12px; margin-bottom: 6px; }
              h3 { font-size: 14px; font-weight: bold; margin-top: 8px; margin-bottom: 4px; }
              p { font-size: 12px; line-height: 1.6; margin-bottom: 12px; color: #374151; }
              ul, ol { margin-bottom: 12px; padding-left: 20px; }
              li { font-size: 12px; line-height: 1.6; color: #374151; margin-bottom: 4px; }
              table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 16px; font-size: 10px; }
              th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
              th { background-color: #f3f4f6; font-weight: bold; color: #4b5563; }
              td { color: #1f2937; }
              code { background-color: #f3f4f6; color: #b45309; padding: 2px 4px; rounded: 4px; font-family: monospace; font-size: 10px; }
              .header-meta { border-b: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }
              .footer-meta { border-t: 1px solid #e5e7eb; padding-top: 12px; margin-top: 24px; text-align: center; font-size: 9px; color: #9ca3af; }
            </style>
          </head>
          <body>
            <div id="clone-target" class="pdf-container"></div>
          </body>
        </html>
      `);
      iframeDoc.close();

      // Clone the content and append to iframe target container
      const cloneTarget = iframeDoc.getElementById("clone-target");
      if (cloneTarget) {
        // We clone the inner HTML of pdf-preview-canvas so that it retains all markdown elements but inherits clean, safe styles
        cloneTarget.innerHTML = element.innerHTML;
      }

      // Render canvas using html2canvas in the iframe scope
      const canvas = await html2canvas(cloneTarget || element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Cleanup iframe
      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("generated-document.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  // Auto scroll to bottom when there are messages
  useEffect(() => {
    if (activeWindow === "text" && activeSession.messages.length > 0) {
      textChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (activeWindow === "image" && activeSession.messages.length > 0) {
      imageChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSession.messages, activeWindow]);

  const createNewSession = async (type: "text" | "image") => {
    const id = Date.now().toString();
    const newSession: ChatSession = {
      id,
      title: type === "text" ? `New Chat Session` : `New Image Canvas`,
      type,
      messages: []
    };
    
    if (currentUser) {
      try {
        await setDoc(doc(db, "users", currentUser.uid, "chats", id), {
          title: newSession.title,
          type: newSession.type,
          messages: [],
          isPersonalBot: false,
          knowledgeBase: "",
          createdAt: new Date(),
        });
        setActiveSessionId(id);
      } catch (err) {
        console.error("Error saving new session to Firestore:", err);
      }
    } else {
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(id);
    }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser) {
      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "chats", id));
      } catch (err) {
        console.error("Firestore delete error:", err);
      }
    }
    if (sessions.length === 1) {
      // Reset only session left
      setSessions([
        {
          id: "welcome-session",
          title: "New Chat Session",
          type: "text",
          messages: []
        }
      ]);
      setActiveSessionId("welcome-session");
      return;
    }
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const triggerScrapingLogs = (queryText: string) => {
    setIsScrapingActive(true);
    setScrapingLogs([]);
    
    const logs = [
      `Spawned Antigravity Browser Agent...`,
      `Navigating to https://www.google.com/search?igu=1&q=${encodeURIComponent(queryText)}`,
      `Waiting for SGE Google AI Generative Overview to render...`,
      `Extracting top search links and articles...`,
      `Scraping page 1 (Yahoo Finance / Top Search result)... [OK]`,
      `Scraping page 2 (Wikipedia / Main Reference page)... [OK]`,
      `Successfully parsed Google AI Mode Generative summary.`,
      `Formatting live weather and stock indices payload... [OK]`,
      `Transferring payload to cyberlim.AI chat interface...`
    ];
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setScrapingLogs((prev) => [...prev, log]);
      }, index * 350);
    });
  };

  const handleSendText = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const targetPrompt = customPrompt || textInput;
    if (!targetPrompt.trim() || isTextLoading) return;

    const userPrompt = targetPrompt.trim();
    if (!customPrompt) setTextInput("");
    setIsTextLoading(true);
    setTextStatus("idle");
    setTextErrorMsg("");

    // Store base64 image data locally for the API call
    const currentAttachedImage = attachedImage;
    setAttachedImage(null); // Clear preview immediately on send

    // Add user message to active session
    setSessions((prev) => prev.map(s => {
      if (s.id === activeSessionId) {
        // Set dynamic title based on first query
        const title = s.messages.length === 0 ? (userPrompt.length > 22 ? userPrompt.substring(0, 20) + "..." : userPrompt) : s.title;
        return {
          ...s,
          title,
          messages: [...s.messages, { role: "user", content: userPrompt, type: "text", imageUrl: currentAttachedImage || undefined }]
        };
      }
      return s;
    }));

    // Check if userPrompt is a URL
    const isUrl = /^https?:\/\//i.test(userPrompt) || /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(userPrompt);
    if (isUrl) {
      let normalizedUrl = userPrompt.trim();
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = "https://" + normalizedUrl;
      }
      if (normalizedUrl.includes("google.com") && !normalizedUrl.includes("igu=1")) {
        if (normalizedUrl.includes("?")) {
          normalizedUrl += "&igu=1";
        } else {
          normalizedUrl += "?igu=1";
        }
      }
      setBrowserUrl(normalizedUrl);
      setBrowserAddressInput(normalizedUrl);
      setShowBrowserSidebar(true);
      setShowPdfSidebar(false);

      setSessions((prev) => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, { role: "assistant", content: `Directly loading the requested website inside the right sidebar browser: [${normalizedUrl}](${normalizedUrl})`, type: "text" }]
          };
        }
        return s;
      }));
      setIsTextLoading(false);
      return;
    }

    // Check for resume trigger in chat mode
    const lowerPrompt = userPrompt.toLowerCase();
    if ((lowerPrompt.includes("resume") || lowerPrompt.includes("रिज्यूम") || lowerPrompt.includes("बायोडाटा")) && !userPrompt.includes("[PDF_START]") && !userPrompt.includes("style.")) {
      setShowResumeTemplates(true);
      showResumeTemplatesRef.current = true;
      // Add assistant message with templates
      setSessions((prev) => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, { role: "assistant", content: "Great! I have 6 beautiful resume templates for you. Pick one by clicking or typing a number (1-6):", type: "text" }]
          };
        }
        return s;
      }));
      setIsTextLoading(false);
      return;
    }

    // Check for number selection when templates are showing
    if (showResumeTemplatesRef.current) {
      const numMatch = lowerPrompt.match(/^\s*([1-6])\s*$/);
      if (numMatch) {
        const num = parseInt(numMatch[1]);
        handleSelectResumeTemplate(num);
        setIsTextLoading(false);
        return;
      }
    }

    // Check if the user is asking to create a PDF and format prompt instructions
    const isPdfRequest = lowerPrompt.includes("pdf") || lowerPrompt.includes("invoice") || lowerPrompt.includes("document");
    let promptToSend = userPrompt;
    if (isPdfRequest) {
      promptToSend = `${userPrompt}\n\nIMPORTANT: Format this content beautifully as a clean structured document and wrap it exactly inside tags like this:\n[PDF_START]\n# Title\nContent here...\n[PDF_END]\nDo not put extra markdown formatting tags outside of those blocks. Make the structure clear and elegant.`;
    }

    try {
      let finalPrompt = promptToSend;
      let scrapedWeather: any = null;
      let scrapedStock: any = null;
      let scrapedImages: string[] = [];

      if (activeSession.isPersonalBot && activeSession.knowledgeBase) {
        finalPrompt = `SYSTEM INSTRUCTION: You are a Personal Knowledge Chatbot. Use the provided Knowledge Base below as your primary source of facts and guidelines to answer the user's query. If the query cannot be answered using the Knowledge Base, use your general knowledge to answer the query accurately, but prioritize the provided memory.`;

        if (isPdfRequest) {
          finalPrompt += `\n\nADDITIONAL INSTRUCTION: Since the user requested a PDF/document output, you must format this answer beautifully as a clean structured document and wrap it exactly inside tags like this:\n[PDF_START]\n# Title\nContent here...\n[PDF_END]\nDo not put extra markdown formatting tags outside of those blocks. Make the structure clear and elegant.`;
        }

        finalPrompt += `\n\nKNOWLEDGE BASE:
${activeSession.knowledgeBase}

USER QUERY:
${userPrompt}

Answer:`;
      } else if (activeSearchMode) {
        setIsSearchingWeb(true);
        setShowBrowserSidebar(true);
        setShowPdfSidebar(false); // Hide PDF sidebar when search browser opens
        setBrowserSearchQuery(userPrompt);
        const targetUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(userPrompt)}`;
        setBrowserUrl(targetUrl);
        setBrowserAddressInput(targetUrl);
        setSearchResultData(null);
        triggerScrapingLogs(userPrompt);

        try {
          const searchRes = await fetch("/api/web-search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: userPrompt, mode: activeSearchMode, coords: userLocation })
          });

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            setSearchResultData(searchData);
            scrapedWeather = searchData.weather;
            scrapedStock = searchData.stock;
            scrapedImages = searchData.images || [];

            // Construct context from search results and scraped content
            let contextText = ``;
            if (searchData.aiOverview) {
              contextText += `GOOGLE AI OVERVIEW / SUMMARY:\n${searchData.aiOverview}\n\n`;
            }
            
            contextText += `SEARCH RESULTS:\n`;
            searchData.results?.forEach((res: any, idx: number) => {
              contextText += `[${idx+1}] ${res.title}\nURL: ${res.url}\nDescription: ${res.snippet}\n\n`;
            });

            if (searchData.scraped && searchData.scraped.length > 0) {
              contextText += `SCRAPED FULL TEXT DETAILS FROM TOP PAGES:\n`;
              searchData.scraped.forEach((sc: any, idx: number) => {
                contextText += `--- START CONTENT FROM PAGE [${idx+1}] (${sc.url}) ---\n${sc.content}\n--- END CONTENT ---\n\n`;
              });
            }

            if (scrapedWeather) {
              contextText += `LIVE WEATHER DATA:\n`;
              contextText += `City: ${scrapedWeather.city}\n`;
              contextText += `Current Temperature: ${scrapedWeather.temp_C}°C\n`;
              contextText += `Feels Like: ${scrapedWeather.feels_like}°C\n`;
              contextText += `Condition: ${scrapedWeather.condition}\n`;
              contextText += `Humidity: ${scrapedWeather.humidity}%\n`;
              contextText += `Wind Speed: ${scrapedWeather.wind}\n`;
            }

            if (scrapedStock) {
              contextText += `LIVE STOCK MARKET DATA:\n`;
              contextText += `Symbol/Ticker: ${scrapedStock.symbol}\n`;
              contextText += `Price: ${scrapedStock.price} ${scrapedStock.currency}\n`;
              contextText += `Change: ${scrapedStock.change} (${scrapedStock.changePercent})\n`;
            }

            finalPrompt = `Current Local Time & Date: ${new Date().toLocaleString()}\n\nThe user is asking: "${userPrompt}"\n\nWe scraped the web for answers. Below is Google search information and scraped site context:\n${contextText}\n\nINSTRUCTIONS: Formulate a highly accurate, clean, responsive answer based on the search context and the current local time provided above. Prioritize the GOOGLE AI OVERVIEW / SUMMARY as the primary ground truth. Refer to the sources/URLs by citation (e.g. [1], [2]) where appropriate. If the context doesn't contain the answer, use your best knowledge but prioritize the scraped information. Make sure it sounds natural.`;
          } else {
            console.error("Google search route failed");
          }
        } catch (searchErr) {
          console.error("Failed to run Google search scraping:", searchErr);
        } finally {
          setIsSearchingWeb(false);
          setTimeout(() => {
            setIsScrapingActive(false);
          }, 1200);
        }
      }

      const response = await fetch("/api/hf-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, model: "pollinations", image: currentAttachedImage })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      // Add streaming placeholder
      setSessions((prev) => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, { role: "assistant", content: "", type: "text", isStreaming: true, weather: scrapedWeather, stock: scrapedStock, images: scrapedImages }]
          };
        }
        return s;
      }));

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error("Failed to initialize text stream reader.");
      }

      let completeText = "";
      let streamBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const streamLines = chunk.split("\n");
        
        for (let i = 0; i < streamLines.length; i++) {
          let line = streamLines[i];
          if (i === 0) {
            line = streamBuffer + line;
            streamBuffer = "";
          }
          
          if (i === streamLines.length - 1) {
            streamBuffer = line;
            continue;
          }
          
          const cleanedLine = line.trim();
          if (!cleanedLine) continue;
          
          if (cleanedLine.startsWith("data:")) {
            const dataStr = cleanedLine.slice(5).trim();
            if (dataStr === "[DONE]") continue;
            
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.choices?.[0]?.delta?.reasoning) {
                continue;
              }
              const tokenText = parsed.choices?.[0]?.delta?.content || parsed.token?.text || parsed.generated_text || "";
              completeText += tokenText;
            } catch (jsonErr) {
              if (dataStr && dataStr !== "[DONE]") {
                completeText += dataStr;
              }
            }
          } else {
            try {
              const parsed = JSON.parse(cleanedLine);
              if (parsed.choices?.[0]?.delta?.reasoning) {
                continue;
              }
              const tokenText = parsed.choices?.[0]?.delta?.content || parsed.token?.text || parsed.generated_text || "";
              if (tokenText) {
                completeText += tokenText;
              } else if (Array.isArray(parsed) && parsed[0]?.generated_text) {
                completeText = parsed[0].generated_text;
              }
            } catch (e) {
              if (!cleanedLine.startsWith("{") && !cleanedLine.startsWith("[")) {
                completeText += cleanedLine;
              }
            }
          }
        }

        // Live detect PDF content in the streaming text
        if (completeText.includes("[PDF_START]")) {
          setShowPdfSidebar(true);
          const startIdx = completeText.indexOf("[PDF_START]") + "[PDF_START]".length;
          const endIdx = completeText.indexOf("[PDF_END]");
          const extracted = endIdx !== -1 
            ? completeText.substring(startIdx, endIdx) 
            : completeText.substring(startIdx);
          setPdfContent(extracted.trim());
        }

        setSessions((prev) => prev.map(s => {
          if (s.id === activeSessionId) {
            const nextMessages = [...s.messages];
            const last = nextMessages[nextMessages.length - 1];
            if (last && last.role === "assistant" && last.isStreaming) {
              last.content = completeText;
            }
            return { ...s, messages: nextMessages };
          }
          return s;
        }));
      }

      // Close streaming state
      setSessions((prev) => prev.map(s => {
        if (s.id === activeSessionId) {
          const nextMessages = [...s.messages];
          const last = nextMessages[nextMessages.length - 1];
          if (last && last.role === "assistant") {
            last.isStreaming = false;
          }
          return { ...s, messages: nextMessages };
        }
        return s;
      }));

      setTextStatus("success");
    } catch (err: any) {
      console.error(err);
      setTextErrorMsg(err.message || "Request failed.");
      setTextStatus("error");
      setSessions((prev) => prev.map(s => {
        if (s.id === activeSessionId) {
          const filtered = s.messages.filter(m => !(m.role === "assistant" && m.isStreaming));
          return {
            ...s,
            messages: [...filtered, { role: "system", content: `Error: ${err.message || "Request failed"}` }]
          };
        }
        return s;
      }));
    } finally {
      setIsTextLoading(false);
    }
  };

  const handleSendImage = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const targetPrompt = customPrompt || imageInput;
    if (!targetPrompt.trim() || isImageLoading) return;

    const userPrompt = targetPrompt.trim();
    if (!customPrompt) setImageInput("");
    setIsImageLoading(true);
    setImageStatus("idle");
    setImageErrorMsg("");

    setSessions((prev) => prev.map(s => {
      if (s.id === activeSessionId) {
        const title = s.messages.length === 0 ? (userPrompt.length > 22 ? userPrompt.substring(0, 20) + "..." : userPrompt) : s.title;
        return {
          ...s,
          title,
          messages: [...s.messages, { role: "user", content: userPrompt, type: "image" }]
        };
      }
      return s;
    }));

    try {
      setSessions((prev) => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, { role: "assistant", content: "Loading...", type: "image", imageUrl: "SKELETON_LOADER" }]
          };
        }
        return s;
      }));

      const response = await fetch("/api/hf-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt, model: "pollinations" })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      setSessions((prev) => prev.map(s => {
        if (s.id === activeSessionId) {
          const nextMessages = [...s.messages];
          const last = nextMessages[nextMessages.length - 1];
          if (last && last.role === "assistant" && last.imageUrl === "SKELETON_LOADER") {
            last.imageUrl = data.image;
          }
          return { ...s, messages: nextMessages };
        }
        return s;
      }));

      setImageStatus("success");
    } catch (err: any) {
      console.error(err);
      setImageErrorMsg(err.message || "Request failed.");
      setImageStatus("error");
      setSessions((prev) => prev.map(s => {
        if (s.id === activeSessionId) {
          const filtered = s.messages.filter(m => !(m.role === "assistant" && m.imageUrl === "SKELETON_LOADER"));
          return {
            ...s,
            messages: [...filtered, { role: "system", content: `Error: ${err.message || "Request failed"}` }]
          };
        }
        return s;
      }));
    } finally {
      setIsImageLoading(false);
    }
  };

  // Helper function to render markdown text, checklist and table views
  const renderMessageContent = (content: string) => {
    if (content.includes("[OUT_OF_BOUNDS]")) {
      const errorText = content.replace("[OUT_OF_BOUNDS]", "").trim();
      return (
        <div className="bg-gradient-to-br from-[#240a15] via-[#1a0c24] to-[#12061a] border border-red-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md max-w-md my-2">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-950/40 border border-red-900/40 flex items-center justify-center shrink-0 text-red-400">
              <WarningOctagon size={18} weight="fill" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-red-400 uppercase tracking-wider">Out of Knowledge Base</h4>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">{errorText || "I'm sorry, but that information is outside my designated knowledge base. Please ask something related to the loaded memory."}</p>
            </div>
          </div>
        </div>
      );
    }

    // If the message contains PDF blocks, render a clean banner to point to the sidebar
    const hasPdfTag = content.includes("[PDF_START]");
    let displayContent = content;
    if (hasPdfTag) {
      displayContent = content.split("[PDF_START]")[0] + "\n\n*(🎨 PDF preview generated in the right sidebar. Adjust, preview, and download it directly.)*";
    }

    return (
      <div className="prose prose-zinc max-w-none text-zinc-100 text-sm leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0 text-zinc-300">{children}</p>,
            ul: ({ children }) => <ul className="my-3 space-y-2 pl-0">{children}</ul>,
            ol: ({ children }) => <ol className="my-3 space-y-2 pl-0">{children}</ol>,
            li: ({ children }) => {
              return (
                <li className="flex items-start gap-2.5 bg-[#1b1227] border border-purple-950 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#251b36] hover:border-purple-900/50 hover:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.4)] list-none my-1">
                  <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-455 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border border-emerald-900/50">✓</span>
                  <span className="text-zinc-200 font-medium text-xs leading-normal">{children}</span>
                </li>
              );
            },
            table: ({ children }) => (
              <div className="my-4 overflow-x-auto rounded-xl border border-purple-950 bg-[#1c1528] shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-[#2a1f3d] border-b border-purple-900/60 text-zinc-400 font-bold uppercase tracking-wider">{children}</thead>,
            tbody: ({ children }) => <tbody className="divide-y divide-purple-900/40">{children}</tbody>,
            tr: ({ children }) => <tr className="hover:bg-purple-950/30 transition-colors">{children}</tr>,
            th: ({ children }) => <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">{children}</th>,
            td: ({ children }) => <td className="px-4 py-3 text-zinc-300 font-medium leading-normal">{children}</td>,
            h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-4 mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-bold text-zinc-200 mt-3 mb-1.5">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-bold text-zinc-300 mt-2 mb-1">{children}</h3>,
            code: ({ children }) => <code className="bg-[#2a1f3d] text-purple-300 px-1.5 py-0.5 rounded font-mono text-xs border border-purple-900/30">{children}</code>,
          }}
        >
          {displayContent}
        </ReactMarkdown>
      </div>
    );
  };

  const hasMessages = activeSession.messages.length > 0;

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(historySearch.toLowerCase()) || 
                          (s.knowledgeBase && s.knowledgeBase.toLowerCase().includes(historySearch.toLowerCase()));
    if (!matchesSearch) return false;

    if (historyFilter === "text") return s.type === "text" && !s.isPersonalBot;
    if (historyFilter === "image") return s.type === "image";
    if (historyFilter === "personal") return s.isPersonalBot ? true : false;
    return true; // "all"
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0c0414] flex flex-col justify-center items-center relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="h-10 w-10 rounded-2xl bg-[#1c1528] border border-purple-900/40 flex items-center justify-center animate-spin">
            <Sparkle size={20} className="text-purple-400" />
          </div>
          <span className="text-xs text-purple-300 font-bold uppercase tracking-widest animate-pulse">Initializing Security...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0c0414] flex justify-center items-center relative overflow-hidden px-4 font-sans">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-10 flex items-center gap-2 z-20">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-white transition-colors bg-[#1c1528] border border-purple-900/30 px-4 py-2 rounded-full">
            <ArrowLeft size={12} /> Back to Home
          </Link>
        </div>

        {/* Auth Box Container */}
        <div className="w-full max-w-md bg-[#1c1528]/85 border border-purple-900/40 rounded-3xl p-8 shadow-2xl z-10 backdrop-blur-md relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-xl" />
          
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-950/60 border border-purple-900/40 text-purple-400 mb-1">
              <Brain size={22} weight="fill" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">cyberlim.AI</h1>
            <p className="text-xs text-purple-400">Unlock your automated lead workspace</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-[#0c0414] p-1 rounded-xl border border-purple-955/60 text-xs mb-6">
            <button
              onClick={() => { setAuthMode("login"); setAuthError(""); }}
              className={`flex-1 py-2 rounded-lg text-center font-bold transition-all cursor-pointer ${
                authMode === "login" ? "bg-[#1c1528] text-white font-black" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode("register"); setAuthError(""); }}
              className={`flex-1 py-2 rounded-lg text-center font-bold transition-all cursor-pointer ${
                authMode === "register" ? "bg-[#1c1528] text-white font-black" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === "register" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#0c0414] border border-purple-900/30 focus:border-purple-500/80 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#0c0414] border border-purple-900/30 focus:border-purple-500/80 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#0c0414] border border-purple-900/30 focus:border-purple-500/80 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 bg-red-955/20 border border-red-900/40 px-3.5 py-2.5 rounded-xl text-[10px] font-bold text-red-400 leading-normal">
                <WarningOctagon size={16} className="shrink-0 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-purple-950/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authSubmitting ? (
                <>
                  <div className="h-3 w-3 rounded-full border border-white border-t-transparent animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{authMode === "login" ? "Sign In to Workspace" : "Register Account"}</span>
              )}
            </button>
          </form>

          {/* Legal / Info */}
          <p className="text-[9px] text-gray-505 text-center mt-6 uppercase tracking-wider">
            Secured Auth Sandbox • Data synchronized in Real-time
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-40 pointer-events-none">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
        />
      )}

      {/* SIDEBAR COMPONENT */}
      <aside 
        className={`h-screen bg-[#09030e] border-r border-purple-950/50 flex flex-col justify-between z-40 md:z-20 shrink-0 transition-all duration-350 fixed md:relative ${
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-0 overflow-hidden"
        }`}
      >
        <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1 no-scrollbar">
          {/* Logo brand info */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <img src="http://hextaui.com/logo.svg" width={26} height={26} alt="cyberlim.AI Logo" className="invert" />
              <span className="font-bold text-sm tracking-tight text-white">cyberlim.AI</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Active session counter */}
              <span className="hidden sm:inline-block text-[9px] bg-purple-950 border border-purple-900/40 text-purple-400 font-bold px-2 py-0.5 rounded-full select-none">
                {sessions.length} chats
              </span>
              <button 
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 bg-[#1c1528] hover:bg-[#2a1f3d] text-white rounded-lg transition-colors border border-purple-900/30 cursor-pointer"
              >
                <X size={12} weight="bold" />
              </button>
            </div>
          </div>

          {/* New Chat Actions */}
          <div className="grid grid-cols-2 gap-2 md:grid">
            <button 
              onClick={() => {
                setActiveView("workspace");
                createNewSession("text");
              }}
              className="flex items-center justify-center gap-1.5 bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={12} weight="bold" /> Text Chat
            </button>
            <button 
              onClick={() => {
                setActiveView("workspace");
                createNewSession("image");
              }}
              className="flex items-center justify-center gap-1.5 bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={12} weight="bold" /> Image Canvas
            </button>
          </div>

          {/* Developer API Button */}
          <button 
            onClick={() => {
              setActiveView(activeView === "api-dashboard" ? "workspace" : "api-dashboard");
              if (isMobile) setSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-center gap-2 border text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
              activeView === "api-dashboard"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500/50 text-white shadow-lg shadow-purple-950/20"
                : "bg-[#1c1528] hover:bg-[#2a1f3d] border-purple-900/30 text-purple-300"
            }`}
          >
            <Cpu size={14} weight="bold" /> 
            {activeView === "api-dashboard" ? "Back to Workspace" : "Developer API Center"}
          </button>

          {/* Personal Bot Creator Card */}
          {activeSession.type === "text" && (
            <div className="bg-gradient-to-br from-[#1b1227]/80 via-[#10091c]/90 to-[#07030c] border border-purple-900/50 rounded-2xl p-3 space-y-2 shadow-lg relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-xl ${activeSession.isPersonalBot ? 'bg-emerald-950 text-emerald-450 border border-emerald-900/40 animate-pulse' : 'bg-purple-950 text-purple-300 border border-purple-900/40'}`}>
                  <Brain size={14} weight="fill" />
                </span>
                <span className="text-[10px] font-black text-zinc-200 uppercase tracking-wider">
                  {activeSession.isPersonalBot ? "Personal Bot Loaded" : "Create Personal Bot"}
                </span>
              </div>
              <p className="text-[9px] text-zinc-400 leading-normal">
                {activeSession.isPersonalBot 
                  ? `Knowledge base loaded (${(activeSession.knowledgeBase?.length || 0)} bytes). Click to update or edit.`
                  : "Paste any text data or guidelines to restrict this chat strictly to that information."}
              </p>
              <button
                onClick={() => {
                  setMemoryInput(activeSession.knowledgeBase || "");
                  setBotNameInput(activeSession.isPersonalBot ? activeSession.title : "My Custom AI Agent");
                  setShowMemoryModal(true);
                }}
                className={`w-full py-1.5 font-bold text-[9px] uppercase tracking-wider rounded-lg transition-all shadow-md ${
                  activeSession.isPersonalBot 
                    ? "bg-[#1c1528] hover:bg-[#251b36] border border-purple-900/50 text-purple-300"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/20"
                }`}
              >
                {activeSession.isPersonalBot ? "Edit Bot Memory" : "Personalize Chatbot"}
              </button>
            </div>
          )}

          {/* History Search & Filters */}
          <div className="space-y-2 mt-1">
            <div className="relative flex items-center bg-[#0c0414] border border-purple-900/30 rounded-xl px-2.5 py-1.5">
              <MagnifyingGlass className="w-3.5 h-3.5 text-purple-400 mr-2" />
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="bg-transparent text-[11px] text-white outline-none w-full"
              />
              {historySearch && (
                <button onClick={() => setHistorySearch("")} className="text-gray-400 hover:text-white">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-[#0c0414] p-0.5 rounded-lg border border-purple-950/40 text-[9px]">
              {(["all", "text", "image", "personal"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setHistoryFilter(tab)}
                  className={`flex-1 py-1 rounded text-center capitalize font-semibold transition-all cursor-pointer ${
                    historyFilter === tab 
                      ? "bg-[#1c1528] text-white font-bold" 
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab === "personal" ? "Bots" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">History Sessions</span>
            </div>
            <div className="space-y-1 overflow-y-auto max-h-56 pr-0.5 custom-scrollbar flex-1 min-h-[120px]">
              {filteredSessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      setActiveView("workspace");
                    }}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                      isActive 
                        ? "bg-[#1c1528] border-purple-900/50 text-white" 
                        : "bg-transparent border-transparent text-gray-400 hover:bg-[#1c1528]/40 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 mr-2">
                      {s.isPersonalBot ? (
                        <Brain size={13} className="text-emerald-450 drop-shadow-[0_0_4px_rgba(52,211,153,0.3)] shrink-0" />
                      ) : s.type === "text" ? (
                        <Chat size={13} className="shrink-0" />
                      ) : (
                        <ImageIcon size={13} className="shrink-0" />
                      )}
                      
                      {editingSessionId === s.id ? (
                        <input
                          type="text"
                          value={editingTitleInput}
                          onChange={(e) => setEditingTitleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRenameSession(s.id, editingTitleInput);
                            } else if (e.key === "Escape") {
                              setEditingSessionId(null);
                            }
                          }}
                          onBlur={() => handleRenameSession(s.id, editingTitleInput)}
                          className="bg-[#0c0414] border border-purple-500/80 rounded px-2 py-1 text-xs text-white outline-none w-full font-sans"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span 
                          className="truncate flex-1"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionId(s.id);
                            setEditingTitleInput(s.title);
                          }}
                          title="Double-click to rename"
                        >
                          {s.title}
                        </span>
                      )}
                      
                      {s.isPersonalBot && (
                        <span className="text-[8px] bg-emerald-950/45 border border-emerald-900/40 text-emerald-450 px-1 py-0.2 rounded font-extrabold select-none shrink-0">
                          BOT
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSessionId(s.id);
                          setEditingTitleInput(s.title);
                        }}
                        className="hover:text-purple-300 transition-colors p-0.5 rounded cursor-pointer"
                        title="Rename Chat"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => deleteSession(s.id, e)}
                        className="hover:text-rose-450 transition-colors p-0.5 rounded cursor-pointer"
                        title="Delete Chat"
                      >
                        <Trash size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredSessions.length === 0 && (
                <div className="text-[10px] text-gray-500 text-center py-6">No matching sessions</div>
              )}
            </div>
          </div>

          {/* Quick Statistics block */}
          <div className="bg-[#0c0414]/50 border border-purple-950/30 rounded-xl p-2.5 space-y-1.5">
            <span className="text-[9px] font-bold text-purple-400/80 uppercase tracking-widest block">System Diagnostics</span>
            <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-400">
              <div className="bg-[#09030e] p-1.5 rounded border border-purple-950/20">
                <span className="block text-white font-bold">{sessions.filter(s => s.isPersonalBot).length}</span>
                <span>Custom Bots</span>
              </div>
              <div className="bg-[#09030e] p-1.5 rounded border border-purple-950/20">
                <span className="block text-white font-bold">{sessions.reduce((acc, s) => acc + s.messages.length, 0)}</span>
                <span>Messages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer settings block */}
        <div className="p-4 border-t border-purple-950/40 bg-[#07020b] space-y-1.5">
          {currentUser && (
            <div className="flex items-center gap-3 p-2.5 bg-[#1c1528]/40 border border-purple-900/30 rounded-xl mb-3 shadow-inner">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs border border-purple-500/20 shadow">
                {userProfile?.name ? getInitials(userProfile.name) : (currentUser.email ? currentUser.email[0].toUpperCase() : "U")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-white truncate leading-tight">{userProfile?.name || currentUser.displayName || "Workspace User"}</p>
                <p className="text-[9px] text-zinc-500 truncate leading-none mt-0.5">{currentUser.email}</p>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <Gear size={15} /> Settings Panel
          </button>
          
          {currentUser && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer bg-rose-950/10 border border-rose-950/40"
            >
              <ArrowLeft size={15} /> Logout Account
            </button>
          )}

          <Link href="/" className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition-colors">
            <Globe size={15} /> Exit Workspace
          </Link>
        </div>
      </aside>

      {/* WORKSPACE CONTENT BODY */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Toggle Sidebar Button floating */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-4 top-5 z-30 p-2 bg-[#1c1528] border border-purple-900/40 hover:bg-[#2a1f3d] text-white rounded-full transition-colors cursor-pointer"
        >
          {sidebarOpen ? <ArrowLineLeft size={14} /> : <ArrowLineRight size={14} />}
        </button>

        {/* Main Content Workspace */}
        {/* Main Content Workspace */}
        {activeView === "api-dashboard" ? (
          <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 overflow-y-auto relative z-10 custom-scrollbar text-left space-y-8 pl-12 sm:pl-6">
            {/* Header Title */}
            <div className="border-b border-purple-950/40 pb-5 space-y-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-900/40 text-purple-400">
                <Cpu size={18} weight="bold" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">Developer API Center</h1>
              <p className="text-xs text-purple-300">Generate secure API keys to integrate cyberlim.AI chat agents directly into your own website or application.</p>
            </div>

            {/* Key Generator Section */}
            <div className="bg-[#1c1528]/50 border border-purple-900/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} /> Create API Key
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter key name (e.g. Production Website)"
                  value={apiKeyNameInput}
                  onChange={(e) => setApiKeyNameInput(e.target.value)}
                  className="flex-1 bg-[#0c0414] border border-purple-900/30 focus:border-purple-500/80 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                />
                <button
                  onClick={generateApiKey}
                  disabled={apiKeySubmitting || !apiKeyNameInput.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-md shadow-purple-950/20 disabled:opacity-50 cursor-pointer"
                >
                  {apiKeySubmitting ? "Generating..." : "Generate Key"}
                </button>
              </div>

              {newlyGeneratedKey && (
                <div className="bg-emerald-950/40 border border-emerald-900/30 rounded-xl p-4 space-y-2 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-450 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Key Created Successfully
                    </span>
                    <button 
                      onClick={() => setNewlyGeneratedKey(null)}
                      className="text-[9px] font-bold text-zinc-400 hover:text-white uppercase"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-300">Copy this API key now. For security reasons, you will not be able to view it again.</p>
                  <div className="flex items-center gap-2 bg-[#0c0414] border border-purple-900/30 rounded-xl p-2.5">
                    <code className="flex-1 text-xs text-emerald-450 select-all font-mono break-all pr-2">{newlyGeneratedKey}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(newlyGeneratedKey);
                        alert("API Key copied to clipboard!");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Keys Table / List */}
            <div className="bg-[#1c1528]/30 border border-purple-900/20 rounded-2xl p-5 sm:p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database size={16} /> Active API Keys
              </h2>
              {apiKeys.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">No active API keys found. Create a key above to get started.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-purple-950 bg-[#1c1528]/50">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#2a1f3d] text-zinc-300 font-bold uppercase tracking-wider border-b border-purple-900/60">
                      <tr>
                        <th className="px-4 py-3">Key Name</th>
                        <th className="px-4 py-3">Key Mask</th>
                        <th className="px-4 py-3">Created At</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/40">
                      {apiKeys.map((k) => (
                        <tr key={k.id} className="hover:bg-purple-950/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-white">{k.name}</td>
                          <td className="px-4 py-3 font-mono text-zinc-400">
                            {k.id.substring(0, 10)}••••••••••••••••
                          </td>
                          <td className="px-4 py-3 text-zinc-400">
                            {k.createdAt?.seconds 
                              ? new Date(k.createdAt.seconds * 1000).toLocaleDateString()
                              : new Date().toLocaleDateString()
                            }
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => revokeApiKey(k.id)}
                              className="text-[10px] font-bold text-rose-450 hover:text-rose-350 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-900/30 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
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

            {/* Documentation / Instructions Section */}
            <div className="bg-[#1c1528]/50 border border-purple-900/30 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl backdrop-blur-md relative">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} /> API Integration Guide
              </h2>
              
              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <div>
                  <h3 className="font-extrabold text-white text-xs mb-1 uppercase tracking-wider">1. Endpoint Details</h3>
                  <p>Send a standard HTTP POST request to compile/stream completions using your API keys:</p>
                  <div className="bg-[#0c0414] border border-purple-900/30 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
                    <div>
                      <span className="bg-emerald-950/65 text-emerald-450 border border-emerald-900/40 text-[9px] font-black uppercase px-2 py-0.5 rounded select-none mr-2">POST</span>
                      <code className="text-xs text-white font-mono">{typeof window !== "undefined" ? `${window.location.origin}/api/chat` : "https://ai.cyberlim.com/api/chat"}</code>
                    </div>
                  </div>
                </div>

                <div className="border-t border-purple-950/40 pt-4">
                  <h3 className="font-extrabold text-white text-xs mb-1 uppercase tracking-wider">2. Request Headers</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><code className="bg-[#2a1f3d] text-purple-300 px-1 py-0.5 rounded font-mono">Content-Type: application/json</code></li>
                    <li><code className="bg-[#2a1f3d] text-purple-300 px-1 py-0.5 rounded font-mono">Authorization: Bearer YOUR_API_KEY</code></li>
                  </ul>
                </div>

                <div className="border-t border-purple-950/40 pt-4">
                  <h3 className="font-extrabold text-white text-xs mb-1 uppercase tracking-wider">3. Request Body Payload</h3>
                  <div className="bg-[#0c0414] border border-purple-900/30 rounded-xl p-4.5 font-mono text-zinc-400 text-xs">
                    <pre className="whitespace-pre-wrap">{`{
  "prompt": "Write a 3-sentence welcome email for a lead",
  "systemInstruction": "You are a professional assistant...", // Optional system rules
  "model": "mistral", // Optional, defaults to mistral. Options: mistral, llama, qwen, phi, pollinations
  "stream": true // Optional, defaults to true for word-by-word streaming
}`}</pre>
                  </div>
                </div>

                <div className="border-t border-purple-950/40 pt-4 space-y-3">
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">4. Code Integration Sample (JavaScript / Node.js)</h3>
                  <p>Below is a working Node.js sample that streams words in real-time as they are generated by the model:</p>
                  <div className="bg-[#0c0414] border border-purple-900/30 rounded-xl p-4.5 font-mono text-zinc-400 text-[11px] leading-normal overflow-x-auto relative">
                    <button
                      onClick={() => {
                        const code = `const fetchChat = async () => {
  const response = await fetch("${typeof window !== 'undefined' ? window.location.origin : 'https://ai.cyberlim.com'}/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer cl_api_YOUR_KEY_HERE"
    },
    body: JSON.stringify({
      prompt: "Tell me a joke",
      model: "mistral",
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    process.stdout.write(chunk);
  }
};`;
                        navigator.clipboard.writeText(code);
                        alert("Code sample copied to clipboard!");
                      }}
                      className="absolute top-3 right-3 bg-purple-950 hover:bg-purple-900 text-purple-300 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-purple-800/40 transition-colors cursor-pointer"
                    >
                      Copy Snippet
                    </button>
                    <pre>{`const fetchChat = async () => {
  const response = await fetch("${typeof window !== 'undefined' ? window.location.origin : 'https://ai.cyberlim.com'}/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer cl_api_YOUR_KEY_HERE"
    },
    body: JSON.stringify({
      prompt: "Tell me a joke",
      model: "mistral",
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    process.stdout.write(chunk);
  }
};`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 flex flex-col items-center justify-between px-6 py-6 w-full max-w-4xl mx-auto overflow-hidden relative z-10">
          
          {/* Header Area inside main screen */}
          <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-purple-950/20 pl-12">
            <div className="flex flex-wrap items-center gap-2">
              {activeSession.isPersonalBot ? (
                <button
                  onClick={() => {
                    setMemoryInput(activeSession.knowledgeBase || "");
                    setBotNameInput(activeSession.title);
                    setShowMemoryModal(true);
                  }}
                  className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer transition-all hover:bg-emerald-900/30 hover:border-emerald-500/40"
                  title="Configure memory base"
                >
                  <Brain size={12} weight="fill" className="animate-pulse" />
                  Personal Bot: {activeSession.title}
                </button>
              ) : (
                <span className="text-xs font-semibold text-purple-400 bg-purple-950/40 border border-purple-900/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Cloud size={12} className="animate-pulse" />
                  {activeWindow === "text" ? "Chat Assistant Active" : "Image Generator Active"}
                </span>
              )}

              {activeWindow === "text" && !activeSession.isPersonalBot && (
                <button
                  onClick={() => {
                    setMemoryInput("");
                    setBotNameInput("Personal AI Agent");
                    setShowMemoryModal(true);
                  }}
                  className="text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 border border-purple-900/40 hover:bg-purple-900/40 hover:border-purple-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer ml-2 transition-all"
                >
                  <Brain size={12} />
                  Personalize Bot
                </button>
              )}

              {pdfContent && (
                <button
                  onClick={() => setShowPdfSidebar(!showPdfSidebar)}
                  className="text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 border border-purple-900/40 px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer ml-2 transition-colors"
                >
                  <List size={12} />
                  {showPdfSidebar ? "Hide PDF Workspace" : "Show PDF Workspace"}
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-450 font-medium bg-[#1c1528] px-3.5 py-1.5 rounded-full border border-purple-900/30">
                {activeSession.isPersonalBot ? "Mode: Strict Knowledge Base" : "Engine: Pollinations.ai (Free/Fast)"}
              </span>
            </div>
          </header>

          {/* CHAT/WORK AREA VIEWPORT */}
          <div className="flex-1 w-full overflow-y-auto my-6 pr-2 no-scrollbar">
            
            {/* If session is empty, show branding introduction landing details */}
            {!hasMessages ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="bg-[#1c1528] rounded-full px-4 py-2 flex items-center gap-2 w-fit">
                  <span className="text-xs flex items-center gap-2">
                    <span className="bg-black p-1 rounded-full">🥳</span>
                    Introducing cyberlim.AI
                  </span>
                </div>
                <h1 className="text-5xl font-bold leading-tight max-w-2xl">
                  {activeWindow === "text" 
                    ? "Build Stunning websites effortlessly" 
                    : "Generate Beautiful 3D assets instantly"
                  }
                </h1>
                <p className="text-gray-400 text-sm max-w-md">
                  {activeWindow === "text"
                    ? "cyberlim.AI can create amazing websites, summaries, and PDF documents."
                    : "Generate digital mockups, SaaS UI elements, and gradient vector backgrounds."
                  }
                </p>
              </div>
            ) : (
              /* If session has messages, render message stream */
              <div className="space-y-4 py-2">
                {activeSession.messages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <div key={index} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start animate-fade-in"}`}>
                      {!isUser && (
                        <div className="h-8 w-8 rounded-full bg-purple-950 border border-purple-900/50 flex items-center justify-center shrink-0 text-purple-300">
                          {activeWindow === "text" ? <Cpu size={15} /> : <ImageIcon size={15} />}
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                        isUser 
                          ? "bg-[#2a1f3d] text-white rounded-tr-none shadow-md border border-purple-900/30" 
                          : "bg-[#1c1528] border border-purple-900/30 text-zinc-100 rounded-tl-none shadow-md"
                      }`}>
                        {isUser ? (
                          <div className="space-y-2">
                            {msg.imageUrl && (
                              <img src={msg.imageUrl} alt="Attached context" className="rounded-lg max-h-48 w-auto object-contain border border-purple-900/30" />
                            )}
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                        ) : (
                          msg.type === "image" ? (
                            msg.imageUrl === "SKELETON_LOADER" ? (
                              <div className="space-y-3 w-80 max-w-full">
                                <div className="relative overflow-hidden w-full aspect-square rounded-lg bg-[#0c0414] border border-purple-900/30 flex flex-col justify-center items-center">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                                  <div className="h-20 w-20 rounded-md border-2 border-dashed border-purple-900/40 animate-pulse flex items-center justify-center">
                                    <ImageIcon size={26} className="text-purple-500 animate-bounce" />
                                  </div>
                                  <span className="text-xs text-purple-300 font-semibold animate-pulse mt-4">Generating visual assets...</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="h-3 w-2/3 bg-purple-950 rounded animate-pulse" />
                                  <div className="h-2 w-1/2 bg-purple-950/60 rounded animate-pulse" />
                                </div>
                              </div>
                            ) : msg.imageUrl ? (
                              <div className="space-y-2">
                                <img 
                                  src={msg.imageUrl} 
                                  alt="AI Generated Result" 
                                  className="rounded-lg max-h-80 w-auto object-contain border border-purple-950/60 bg-[#0c0414]"
                                />
                                <div className="flex justify-between items-center text-xs text-zinc-455 mt-2">
                                  <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-900/30">
                                    FLUX.1 Schnell
                                  </span>
                                  <a 
                                    href={msg.imageUrl} 
                                    download="generated-image.png"
                                    className="flex items-center gap-1 text-purple-450 hover:text-purple-300 font-medium transition-colors"
                                  >
                                    <Download size={14} /> Download Image
                                  </a>
                                </div>
                              </div>
                            ) : null
                          ) : (
                            <div className="space-y-3">
                              {msg.weather && (
                                <div className="weather-card-animate bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 w-72 max-w-full shadow-2xl relative overflow-hidden animate-fade-in text-white select-none my-1 backdrop-blur-md">
                                  {/* Rain Drops (Render if condition includes rain/drizzle) */}
                                  {msg.weather.condition.toLowerCase().includes("rain") && (
                                    <>
                                      <div className="rain-drop" style={{ left: "15%", animationDelay: "0s", animationDuration: "1s" }} />
                                      <div className="rain-drop" style={{ left: "45%", animationDelay: "0.4s", animationDuration: "1.2s" }} />
                                      <div className="rain-drop" style={{ left: "75%", animationDelay: "0.2s", animationDuration: "0.9s" }} />
                                    </>
                                  )}

                                  {/* Glass card glow */}
                                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-sm font-extrabold text-white tracking-wide">{msg.weather.city}</h4>
                                      <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider mt-0.5">{msg.weather.condition}</p>
                                    </div>
                                    <span className="text-4xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] weather-icon-animate block">{msg.weather.icon}</span>
                                  </div>
                                  
                                  <div className="my-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">{msg.weather.temp_C}</span>
                                    <span className="text-base text-cyan-400 font-black">°C</span>
                                    <span className="text-[10px] text-gray-400 font-semibold ml-3 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">Feels like {msg.weather.feels_like}°C</span>
                                  </div>

                                  {/* Stats Row */}
                                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-[10px] text-gray-300">
                                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                                      <span className="text-sm">💧</span>
                                      <div className="flex flex-col">
                                        <span className="text-gray-450 text-[9px] uppercase font-bold">Humidity</span>
                                        <span className="text-white font-bold">{msg.weather.humidity}%</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                                      <span className="text-sm">💨</span>
                                      <div className="flex flex-col">
                                        <span className="text-gray-450 text-[9px] uppercase font-bold">Wind</span>
                                        <span className="text-white font-bold">{msg.weather.wind}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Forecast Row */}
                                  {msg.weather.forecast && msg.weather.forecast.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-400">3-Day Forecast</p>
                                      <div className="flex justify-between gap-1.5">
                                        {msg.weather.forecast.map((day: any, dIdx: number) => {
                                          const dateObj = new Date(day.date);
                                          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                                          let dayEmoji = "🌤️";
                                          const dayCond = day.condition.toLowerCase();
                                          if (dayCond.includes("rain") || dayCond.includes("drizzle")) dayEmoji = "🌧️";
                                          else if (dayCond.includes("snow")) dayEmoji = "❄️";
                                          else if (dayCond.includes("clear") || dayCond.includes("sunny")) dayEmoji = "☀️";
                                          else if (dayCond.includes("cloud")) dayEmoji = "☁️";

                                          return (
                                            <div key={dIdx} className="flex flex-col items-center gap-1 text-center bg-white/5 border border-white/5 hover:border-white/10 p-2 rounded-xl min-w-[70px] transition-all hover:bg-white/10">
                                              <span className="font-bold text-[9px] text-gray-400">{dayName}</span>
                                              <span className="text-sm weather-icon-animate my-0.5">{dayEmoji}</span>
                                              <span className="font-extrabold text-[10px] text-white">{day.maxTemp}°<span className="text-gray-500 font-normal">/{day.minTemp}°</span></span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {msg.stock && (
                                <div className="bg-gradient-to-br from-[#0d0d0e] via-[#151618] to-[#121315] border border-zinc-805 rounded-2xl p-5 w-72 max-w-full shadow-2xl relative overflow-hidden animate-fade-in text-white select-none my-1 backdrop-blur-md">
                                  {/* Top accent line */}
                                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${msg.stock.isPositive ? 'from-emerald-500 to-teal-400' : 'from-rose-500 to-orange-450'}`} />
                                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-zinc-500/5 rounded-full blur-xl" />
                                  
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-sm font-extrabold text-white tracking-wide">{msg.stock.symbol}</h4>
                                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Real-time Stock Price</p>
                                    </div>
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${msg.stock.isPositive ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'}`}>
                                      {msg.stock.isPositive ? '▲ GAIN' : '▼ LOSS'}
                                    </span>
                                  </div>
                                  
                                  <div className="my-4">
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-3xl font-black tracking-tight">{msg.stock.price}</span>
                                      <span className="text-xs text-gray-400 font-bold uppercase">{msg.stock.currency}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 text-[11px] font-bold mt-1 ${msg.stock.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      <span>{msg.stock.change}</span>
                                      <span>({msg.stock.changePercent})</span>
                                    </div>
                                  </div>

                                  {/* Simple sparkline vector preview */}
                                  <div className="pt-2.5 border-t border-zinc-800/60 mt-3 flex items-center justify-between text-[10px] text-gray-400">
                                    <span>Market status: Open</span>
                                    <svg className="w-24 h-8 text-emerald-500 overflow-visible" viewBox="0 0 100 30">
                                      <path 
                                        d={msg.stock.isPositive ? "M 0 25 Q 20 20 40 18 T 80 5 T 100 0" : "M 0 5 Q 20 15 40 20 T 80 25 T 100 30"}
                                        fill="none" 
                                        stroke={msg.stock.isPositive ? "#10b981" : "#f43f5e"} 
                                        strokeWidth="2" 
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}
                              {msg.images && msg.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3.5 overflow-hidden">
                                  {msg.images.slice(0, 6).map((imgUrl, imgIdx) => (
                                    <div key={imgIdx} className="relative aspect-video w-full overflow-hidden bg-[#0c0414] border border-purple-900/35 rounded-xl hover:scale-102 hover:border-purple-500/50 transition-all duration-300 shadow-lg group">
                                      <img 
                                        src={imgUrl} 
                                        alt={`Scraped Search Result ${imgIdx}`} 
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => window.open(imgUrl, '_blank')}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {renderMessageContent(msg.content)}
                              {msg.isStreaming && (
                                <span className="inline-block w-1.5 h-4 ml-0.5 bg-purple-500 animate-blink align-middle" />
                              )}
                            </div>
                          )
                        )}
                      </div>
                      {isUser && (
                        <div className="h-8 w-8 rounded-full bg-[#1c1528] border border-purple-900/50 flex items-center justify-center shrink-0 text-gray-300">
                          <User size={15} />
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={activeWindow === "text" ? textChatEndRef : imageChatEndRef} />

                {/* Loading state placeholders */}
                {activeWindow === "text" && isTextLoading && !activeSession.messages[activeSession.messages.length - 1]?.isStreaming && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-purple-950 border border-purple-900/50 flex items-center justify-center shrink-0 text-purple-300">
                      <Cpu size={15} />
                    </div>
                    <div className="bg-[#1c1528] border border-purple-900/30 text-zinc-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-md flex items-center gap-2">
                      <div className="flex space-x-1">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium ml-1">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resume Template Cards in Chat Mode */}
            {showResumeTemplates && !isVoiceAgentActive && (
              <div className="w-full animate-fade-in">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {resumeTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectResumeTemplate(tpl.id)}
                      className="group relative bg-[#1c1528] hover:bg-[#251b36] border border-purple-900/30 hover:border-purple-500/50 rounded-2xl p-4 text-left transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:-translate-y-1 cursor-pointer overflow-hidden"
                    >
                      {/* Number badge */}
                      <span className={`absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-r ${tpl.gradient} flex items-center justify-center text-[10px] font-bold text-white shadow-lg`}>
                        {tpl.id}
                      </span>
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tpl.gradient} flex items-center justify-center text-white text-lg mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                        {tpl.icon}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{tpl.name}</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed">{tpl.desc}</p>
                      {/* Bottom glow on hover */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tpl.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl`} />
                    </button>
                  ))}
                </div>
                <p className="text-center text-[10px] text-gray-500 mt-3 animate-pulse">Click a template or type its number (1-6) to generate</p>
              </div>
            )}
          </div>

          {/* INPUT BAR FIELD CONTAINER */}
          <div className="w-full pb-4 pt-2 space-y-4">
            {attachedImage && (
              <div className="relative w-20 h-20 mb-2 ml-2 rounded-xl border border-purple-500/30 overflow-hidden bg-[#0c0414] animate-fade-in max-w-xs">
                <img src={attachedImage} alt="Attached Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white hover:text-red-400 p-0.5 rounded-full transition-colors flex items-center justify-center"
                >
                  <X size={10} weight="bold" />
                </button>
              </div>
            )}
            
            <form onSubmit={activeWindow === "text" ? handleSendText : handleSendImage} className="relative max-w-2xl mx-auto w-full">
              <div className="bg-[#1c1528] rounded-full p-2.5 flex items-center border border-purple-900/30 focus-within:border-purple-500/80 transition-all">
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setShowPlusMenu(!showPlusMenu)}
                    className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all text-purple-400"
                    title="Add search/tools"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  
                  {/* PLUS MENU DROPDOWN */}
                  {showPlusMenu && (
                    <div className="absolute bottom-14 left-0 w-72 max-w-[calc(100vw-2rem)] bg-[#1c1528] border border-purple-900/50 rounded-2xl p-3 shadow-2xl z-30 space-y-2 animate-fade-in backdrop-blur-md">
                      <div className="relative flex items-center bg-[#0c0414] border border-purple-900/40 rounded-full px-3 py-1.5">
                        <MagnifyingGlass className="w-3.5 h-3.5 text-gray-400 mr-2" />
                        <input
                          type="text"
                          placeholder="Search search modes..."
                          value={plusSearchQuery}
                          onChange={(e) => setPlusSearchQuery(e.target.value)}
                          className="bg-transparent text-xs text-white outline-none w-full"
                        />
                        {plusSearchQuery && (
                          <button onClick={() => setPlusSearchQuery("")} className="text-gray-400 hover:text-white">
                            <X size={10} />
                          </button>
                        )}
                      </div>
                      
                      {/* Search Engines Category */}
                      <div className="text-[9px] font-bold text-purple-400/80 uppercase tracking-widest px-1 py-0.5 border-b border-purple-950/20">Search Engines</div>
                      <div className="max-h-36 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                        {searchOptions
                          .filter(opt => opt.name.toLowerCase().includes(plusSearchQuery.toLowerCase()))
                          .map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setActiveSearchMode(opt.id);
                                setShowPlusMenu(false);
                                setPlusSearchQuery("");
                              }}
                              className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#2a1f3d] transition-colors text-left cursor-pointer"
                            >
                              <span className="text-base">{opt.icon}</span>
                              <div>
                                <div className="text-xs font-semibold text-white">{opt.name}</div>
                                <div className="text-[9px] text-gray-400 leading-none mt-0.5">{opt.desc}</div>
                              </div>
                            </button>
                          ))
                        }
                      </div>

                      {/* Workspace Tools Category */}
                      <div className="text-[9px] font-bold text-purple-400/80 uppercase tracking-widest px-1 py-0.5 mt-1 border-b border-purple-950/20">Workspace Tools</div>
                      <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                        <button
                          type="button"
                          onClick={() => {
                            setIsVoiceAgentActive(true);
                            setShowPlusMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#2a1f3d] transition-colors text-left cursor-pointer"
                        >
                          <span className="text-base">🎙️</span>
                          <div>
                            <div className="text-xs font-semibold text-white">Voice Agent Session</div>
                            <div className="text-[9px] text-gray-400 leading-none mt-0.5">Start voice conversation</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            fileInputRef.current?.click();
                            setShowPlusMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#2a1f3d] transition-colors text-left cursor-pointer"
                        >
                          <span className="text-base">📎</span>
                          <div>
                            <div className="text-xs font-semibold text-white">Attach Image Context</div>
                            <div className="text-[9px] text-gray-400 leading-none mt-0.5">Upload image from device</div>
                          </div>
                        </button>

                        {activeWindow === "text" && (
                          <button
                            type="button"
                            onClick={() => {
                              setMemoryInput(activeSession.knowledgeBase || "");
                              setBotNameInput(activeSession.isPersonalBot ? activeSession.title : "Personal AI Agent");
                              setShowMemoryModal(true);
                              setShowPlusMenu(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#2a1f3d] transition-colors text-left cursor-pointer"
                          >
                            <span className="text-base">🤖</span>
                            <div>
                              <div className="text-xs font-semibold text-white">Personalize Chatbot</div>
                              <div className="text-[9px] text-gray-400 leading-none mt-0.5">Configure memory base</div>
                            </div>
                          </button>
                        )}

                        {pdfContent && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowPdfSidebar(!showPdfSidebar);
                              setShowPlusMenu(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#2a1f3d] transition-colors text-left cursor-pointer"
                          >
                            <span className="text-base">📄</span>
                            <div>
                              <div className="text-xs font-semibold text-white">{showPdfSidebar ? "Hide PDF Panel" : "Show PDF Panel"}</div>
                              <div className="text-[9px] text-gray-400 leading-none mt-0.5">Toggle PDF workspace sidebar</div>
                            </div>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            createNewSession("text");
                            setShowPlusMenu(false);
                          }}
                          className="w-full flex md:hidden items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#2a1f3d] transition-colors text-left cursor-pointer"
                        >
                          <span className="text-base">💬</span>
                          <div>
                            <div className="text-xs font-semibold text-white">New Text Chat</div>
                            <div className="text-[9px] text-gray-400 leading-none mt-0.5">Create new text session</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            createNewSession("image");
                            setShowPlusMenu(false);
                          }}
                          className="w-full flex md:hidden items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#2a1f3d] transition-colors text-left cursor-pointer"
                        >
                          <span className="text-base">🎨</span>
                          <div>
                            <div className="text-xs font-semibold text-white">New Image Canvas</div>
                            <div className="text-[9px] text-gray-400 leading-none mt-0.5">Start image generation canvas</div>
                          </div>
                        </button>
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar hidden">
                        {searchOptions
                          .filter(opt => opt.name.toLowerCase().includes(plusSearchQuery.toLowerCase()))
                          .map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setActiveSearchMode(opt.id);
                                setShowPlusMenu(false);
                                setPlusSearchQuery("");
                              }}
                              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#2a1f3d] transition-colors text-left cursor-pointer"
                            >
                              <span className="text-lg">{opt.icon}</span>
                              <div>
                                <div className="text-xs font-semibold text-white">{opt.name}</div>
                                <div className="text-[9px] text-gray-400 leading-normal">{opt.desc}</div>
                              </div>
                            </button>
                          ))
                        }
                        {searchOptions.filter(opt => opt.name.toLowerCase().includes(plusSearchQuery.toLowerCase())).length === 0 && (
                          <div className="text-[10px] text-gray-500 text-center py-4">No matching options found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {activeSearchMode && (
                  <span className="flex items-center gap-1.5 bg-purple-900/50 border border-purple-500/50 text-[10px] font-bold text-purple-200 px-3 py-1 rounded-full shrink-0 ml-1 select-none animate-fade-in">
                    <span>{activeSearchMode === "google" ? "🌐 Google" : activeSearchMode === "news" ? "📰 News" : activeSearchMode === "wikipedia" ? "🧠 Wiki" : activeSearchMode === "weather" ? "🌤️ Weather" : "📉 Stocks"}</span>
                    <button type="button" onClick={() => setActiveSearchMode(null)} className="hover:text-red-400 font-black text-xs">×</button>
                  </span>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-full hover:bg-[#2a1f3d] transition-all ${attachedImage ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400'}`}
                  title="Attach image"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <button type="button" className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                  <Sparkle className="w-5 h-5 text-purple-400" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsVoiceAgentActive(true)}
                  className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all"
                  title="Voice Session"
                >
                  <Microphone className="w-5 h-5 text-purple-400" />
                </button>
                
                {activeWindow === "text" ? (
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="How cyberlim.AI can help you today?"
                    className="bg-transparent flex-1 outline-none text-gray-200 pl-3 text-sm"
                    disabled={isTextLoading}
                  />
                ) : (
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="bg-transparent flex-1 outline-none text-gray-200 pl-3 text-sm"
                    disabled={isImageLoading}
                  />
                )}
                
                {/* Stop Voice Response Button (chat mode) */}
                {typeof window !== "undefined" && window.speechSynthesis?.speaking && (
                  <button
                    type="button"
                    onClick={() => {
                      window.speechSynthesis.cancel();
                      if (recognitionRef.current) recognitionRef.current.stop();
                      updateVoiceStatus("idle");
                    }}
                    className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 hover:text-rose-300 transition-all animate-pulse"
                    title="Stop AI response"
                  >
                    <StopCircle size={16} weight="fill" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={activeWindow === "text" ? (isTextLoading || !textInput.trim()) : (isImageLoading || !imageInput.trim())}
                  className="p-2.5 bg-white text-black hover:bg-gray-200 disabled:bg-[#2a1f3d] disabled:text-gray-500 rounded-full transition-colors cursor-pointer"
                >
                  <PaperPlaneRight size={14} weight="bold" />
                </button>
              </div>
            </form>

            {/* Error alerts */}
            {activeWindow === "text" && textStatus === "error" && (
              <div className="max-w-2xl mx-auto flex items-center gap-1 text-[11px] font-medium text-rose-500 animate-fade-in">
                <WarningOctagon size={14} weight="bold" /> {textErrorMsg}
              </div>
            )}
            {activeWindow === "image" && imageStatus === "error" && (
              <div className="max-w-2xl mx-auto flex items-center gap-1 text-[11px] font-medium text-rose-500 animate-fade-in">
                <WarningOctagon size={14} weight="bold" /> {imageErrorMsg}
              </div>
            )}

            {/* Suggestions pills (only if session is empty) */}
            {!hasMessages && (
              activeWindow === "text" ? (
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                  <button 
                    onClick={() => handleSendText(undefined, "Create a PDF invoice template")}
                    className="bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 rounded-full px-4 py-2 text-xs font-semibold transition-colors animate-pulse"
                  >
                    📄 Create a PDF Invoice
                  </button>
                  <button 
                    onClick={() => handleSendText(undefined, "Create a PDF resume for a software engineer")}
                    className="bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    📄 Create a PDF Resume
                  </button>
                  <button 
                    onClick={() => handleSendText(undefined, "Launch a blog with Astro")}
                    className="bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    Launch a blog with Astro
                  </button>
                  <button 
                    onClick={() => handleSendText(undefined, "Develop an app using NativeScript")}
                    className="bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    Develop an app using NativeScript
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                  <button 
                    onClick={() => handleSendImage(undefined, "a minimal SaaS dashboard illustration, aurora colors")}
                    className="bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    SaaS Dashboard
                  </button>
                  <button 
                    onClick={() => handleSendImage(undefined, "futuristic glass card floating in dark space, high resolution 3d render")}
                    className="bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    3D Glassmorphism
                  </button>
                  <button 
                    onClick={() => handleSendImage(undefined, "minimalistic user head avatar icon with glowing gradient halo rings")}
                    className="bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    Aurora Character Head
                  </button>
                </div>
              )
            )}
          </div>
        </main>
        )}
      </div>

      {/* PDF SIDEBAR CONTAINER */}
      {showPdfSidebar && (
        <>
          {/* Resize Handler Bar */}
          <div
            ref={resizeRef}
            onMouseDown={startResizing}
            className={`hidden md:block w-[6px] hover:w-2 bg-purple-950/60 hover:bg-purple-500/80 active:bg-purple-500 cursor-col-resize transition-all duration-150 z-20 relative select-none ${
              isResizing ? "bg-purple-500 w-2" : ""
            }`}
          />

          <aside 
            style={{ width: isMobile ? "100%" : `${pdfWidth}px` }}
            className="h-screen bg-[#07020b] border-l border-purple-950/50 flex flex-col justify-between z-40 md:z-10 fixed md:relative right-0 top-0 w-full shrink-0"
          >
            {/* Header controls */}
            <div className="p-4 border-b border-purple-950/40 flex justify-between items-center bg-[#09030e]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-200">PDF Document Workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadPdf}
                  className="flex items-center gap-1.5 bg-white text-black hover:bg-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  onClick={() => setShowPdfSidebar(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-purple-950/40 transition-colors"
                >
                  <ArrowLineRight size={14} />
                </button>
              </div>
            </div>

            {/* A4 Paper Canvas */}
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-950 flex justify-center items-start">
              <div 
                id="pdf-preview-canvas"
                className="w-full max-w-[595px] min-h-[842px] bg-white text-black p-10 shadow-2xl rounded-sm border border-gray-200 flex flex-col justify-between"
              >
                {/* Header of paper */}
                <div className="border-b border-gray-200 pb-3 mb-6 flex justify-between items-center text-[10px] text-gray-400">
                  <span>cyberlim.AI Generated Document</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>

                {/* Content */}
                <div className="flex-1 prose prose-zinc max-w-none text-gray-800 text-xs leading-relaxed A4-document-markdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p style={{ fontSize: '12px', lineHeight: '1.65', color: '#4b5563', marginBottom: '14px', fontWeight: 500 }}>{children}</p>,
                      ul: ({ children }) => <ul style={{ padding: 0, margin: '12px 0 16px 0' }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ padding: 0, margin: '12px 0 16px 0' }}>{children}</ol>,
                      li: ({ children }) => (
                        <li style={{ listStyle: 'none', position: 'relative', paddingLeft: '16px', fontSize: '11.5px', lineHeight: '1.6', color: '#1f2937', marginBottom: '6px', fontWeight: 600 }}>
                          <span style={{ position: 'absolute', left: 0, top: '7px', height: '6px', width: '6px', borderRadius: '50%', backgroundColor: '#c5a059' }} />
                          {children}
                        </li>
                      ),
                      table: ({ children }) => (
                        <div style={{ margin: '20px 0', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => <thead style={{ backgroundColor: '#0b2e5c', color: '#ffffff' }}>{children}</thead>,
                      tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
                      tr: ({ children }) => <tr>{children}</tr>,
                      th: ({ children }) => <th style={{ padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>{children}</th>,
                      td: ({ children }) => <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontWeight: 500 }}>{children}</td>,
                      h1: ({ children }) => (
                        <div style={{ backgroundColor: '#0b2e5c', color: '#ffffff', padding: '30px', margin: '-40px -40px 30px -40px', borderBottom: '4px solid #c5a059', position: 'relative' }}>
                          <div style={{ fontSize: '10px', color: '#7ba4db', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px', marginBottom: '4px' }}>Corporate Documentation</div>
                          <h1 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>{children}</h1>
                        </div>
                      ),
                      h2: ({ children }) => {
                        const text = String(children);
                        const match = text.match(/^(\d+)\.\s*(.*)/);
                        if (match) {
                          const num = match[1];
                          const title = match[2];
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px', marginBottom: '16px' }}>
                              <div style={{ height: '40px', width: '40px', borderRadius: '10px', backgroundColor: '#0b2e5c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px', borderBottom: '2px solid #c5a059', marginRight: '12px', flexShrink: 0 }}>
                                {num}
                              </div>
                              <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '6px', flexGrow: 1 }}>
                                <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#0b2e5c', margin: 0 }}>{title}</h2>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '6px', marginTop: '24px', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#0b2e5c', margin: 0 }}>{children}</h2>
                          </div>
                        );
                      },
                      h3: ({ children }) => <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#0b2e5c', textTransform: 'uppercase', marginTop: '16px', marginBottom: '8px' }}>{children}</h3>,
                      code: ({ children }) => <code className="bg-gray-100 text-purple-700 px-1 py-0.5 rounded font-mono text-[10px]">{children}</code>,
                    }}
                  >
                    {pdfContent || "No document content generated yet."}
                  </ReactMarkdown>
                </div>

                {/* Footer of paper */}
                <div className="border-t border-gray-200 pt-3 mt-6 text-center text-[9px] text-gray-400">
                  Generated dynamically by cyberlim.AI. All rights reserved.
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* BROWSER SEARCH & SCRAPE SIDEBAR */}
      {showBrowserSidebar && (
        <>
          {/* Resize Handler Bar */}
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newWidth = window.innerWidth - moveEvent.clientX;
                if (newWidth > 320 && newWidth < 800) {
                  setBrowserSidebarWidth(newWidth);
                }
              };
              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };
              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
            className="hidden md:block w-[6px] hover:w-2 bg-purple-950/60 hover:bg-purple-500/80 active:bg-purple-500 cursor-col-resize transition-all duration-150 z-20 relative select-none"
          />

          <aside 
            style={{ width: isMobile ? "100%" : `${browserSidebarWidth}px` }}
            className="h-screen bg-[#07020b] border-l border-purple-950/50 flex flex-col justify-between z-40 md:z-10 fixed md:relative right-0 top-0 w-full shrink-0 relative animate-fade-in"
          >
            {/* Browser Header */}
            <div className="p-3.5 border-b border-purple-950/40 flex flex-col gap-2 bg-[#09030e]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 ml-2">cyberlim.AI Browser Scraper</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBrowserSidebar(false)}
                  className="p-1 text-gray-400 hover:text-white rounded hover:bg-purple-950/40 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Interactive Address Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  let url = browserAddressInput.trim();
                  if (!url) return;
                  if (!/^https?:\/\//i.test(url)) {
                    if (/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url)) {
                      url = "https://" + url;
                    } else {
                      url = "https://www.google.com/search?igu=1&q=" + encodeURIComponent(url);
                    }
                  }
                  if (url.includes("google.com") && !url.includes("igu=1")) {
                    if (url.includes("?")) {
                      url += "&igu=1";
                    } else {
                      url += "?igu=1";
                    }
                  }
                  setBrowserUrl(url);
                  setBrowserAddressInput(url);
                }}
                className="flex items-center bg-[#0c0414] border border-purple-900/30 rounded-lg px-2.5 py-1 text-xs text-gray-400 font-mono w-full"
              >
                <Globe size={13} className="mr-2 text-purple-450 shrink-0" />
                <input
                  type="text"
                  value={browserAddressInput}
                  onChange={(e) => setBrowserAddressInput(e.target.value)}
                  className="bg-transparent text-gray-200 outline-none w-full text-xs"
                  placeholder="Search Google or type a URL..."
                />
              </form>
            </div>

            {/* Browser content viewport */}
            <div className="flex-1 bg-white relative overflow-hidden h-full">
              <iframe 
                src={browserUrl}
                className="w-full h-full border-none bg-white"
                title="Google Search Console"
              />
            </div>

            {/* Browser footer */}
            <div className="p-3 border-t border-purple-950/40 bg-[#09030e] text-center text-[9px] text-gray-500 font-mono">
              Scraper Sandbox Secured • JavaScript Bypass Mode Active
            </div>
          </aside>
        </>
      )}

      {/* PERSONAL BOT MEMORY MODAL */}
      {showMemoryModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-[#1c1528] border border-purple-900/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowMemoryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-950 border border-purple-900/50 flex items-center justify-center text-purple-300">
                <Brain size={20} weight="fill" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Configure Personal AI Bot</h3>
                <p className="text-[10px] text-purple-400">Load local memory/knowledge base</p>
              </div>
            </div>
            
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bot Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sales Agent, Product Docs, Personal Wiki..."
                  value={botNameInput}
                  onChange={(e) => setBotNameInput(e.target.value)}
                  className="w-full bg-[#0c0414] border border-purple-900/45 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500/80 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Memory / Knowledge Base Content</label>
                <textarea
                  placeholder="Paste or write the documents, instructions, or factual data here. The AI will answer questions strictly based on this context..."
                  value={memoryInput}
                  onChange={(e) => setMemoryInput(e.target.value)}
                  rows={8}
                  className="w-full bg-[#0c0414] border border-purple-900/45 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500/80 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowMemoryModal(false)}
                  className="flex-1 bg-[#10081d] hover:bg-[#1a0f2c] border border-purple-950 py-2.5 text-xs rounded-xl font-bold transition-colors cursor-pointer text-center text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Update active session with knowledge base and bot name
                    setSessions((prev) => prev.map(s => {
                      if (s.id === activeSessionId) {
                        return {
                          ...s,
                          isPersonalBot: true,
                          knowledgeBase: memoryInput,
                          title: botNameInput.trim() || s.title,
                        };
                      }
                      return s;
                    }));
                    setShowMemoryModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-2.5 text-xs rounded-xl font-bold transition-all shadow-lg shadow-purple-950/20 cursor-pointer text-center"
                >
                  Save & Load Memory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL CONTAINER */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1c1528] border border-purple-900/50 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Gear size={16} /> settings
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Workspace Color Theme</p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button 
                    onClick={() => setThemeMode("purple")}
                    className={`py-1.5 text-xs rounded-lg border font-medium ${
                      themeMode === "purple" ? "bg-white text-black border-white" : "bg-[#0c0414] border-purple-900/40 text-gray-400"
                    }`}
                  >
                    Aurora Purple
                  </button>
                  <button 
                    onClick={() => setThemeMode("dark")}
                    className={`py-1.5 text-xs rounded-lg border font-medium ${
                      themeMode === "dark" ? "bg-white text-black border-white" : "bg-[#0c0414] border-purple-900/40 text-gray-400"
                    }`}
                  >
                    Pure Onyx
                  </button>
                  <button 
                    onClick={() => setThemeMode("blue")}
                    className={`py-1.5 text-xs rounded-lg border font-medium ${
                      themeMode === "blue" ? "bg-white text-black border-white" : "bg-[#0c0414] border-purple-900/40 text-gray-400"
                    }`}
                  >
                    Neon Cyan
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-950 space-y-1">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">active credentials</p>
                <div className="bg-[#0c0414] border border-purple-900/30 p-2.5 rounded-lg text-xs space-y-1 text-gray-300">
                  <p>Inference Token: <span className="font-mono text-purple-400">hf_DuVLaSwuk...Ngv</span></p>
                  <p>Service Gateways: <span className="font-mono text-purple-450">Pollinations / hf-inference</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VOICE AGENT MODE OVERLAY */}
      {isVoiceAgentActive && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between items-center py-12 px-6 animate-fade-in select-none voice-agent-bg">
          {/* Deep ambient glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-blue-700/8 blur-[10rem] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-blue-950/30 to-transparent pointer-events-none" />

          {/* Top Controls & Title */}
          <div className="w-full max-w-4xl flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsVoiceAgentActive(false);
                  if (typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  if (recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                  setVoiceStatus("idle");
                  setVoiceBubbleText("");
                }}
                className="flex items-center gap-2 text-xs font-semibold text-blue-300/70 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full transition-colors cursor-pointer backdrop-blur-sm"
              >
                <ArrowLeft size={14} /> Exit Voice Agent
              </button>

              <button
                onClick={() => {
                  const nextLang = voiceLang === "en-US" ? "hi-IN" : "en-US";
                  setVoiceLang(nextLang);
                  setVoiceBubbleText(nextLang === "hi-IN" ? "भाषा बदलकर हिंदी कर दी गई है।" : "Language changed to English.");
                  if (typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  if (recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                  setVoiceStatus("idle");
                }}
                className="text-xs font-semibold text-blue-300/70 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 backdrop-blur-sm"
              >
                🌍 {voiceLang === "en-US" ? "English (EN)" : "Hindi (हिंदी)"}
              </button>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                Real-time Audio
              </span>
            </div>
          </div>

          {/* Title Area & Speech Bubble */}
          <div className="text-center z-10 w-full max-w-2xl mt-4 px-6 min-h-[90px] flex flex-col justify-center items-center">
            {!voiceBubbleText ? (
              <>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white/90 leading-tight">
                  Talk to <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent font-bold">cyberlim.AI</span> – Smarter, Faster, Better
                </h1>
                <p className="text-xs mt-3 uppercase tracking-wider text-blue-400/60 font-semibold animate-pulse">
                  {voiceStatus === "listening" ? "Listening..." : voiceStatus === "thinking" ? "Thinking..." : voiceStatus === "speaking" ? "Speaking..." : "Tap speak to start"}
                </p>
              </>
            ) : (
              <div 
                className="relative w-full py-2 max-h-36 overflow-y-auto flex items-center justify-center select-text"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent, white 20%, white 80%, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent, white 20%, white 80%, transparent)"
                }}
              >
                <p className="text-xl sm:text-2xl font-medium text-white/90 leading-relaxed tracking-wide px-4 text-center max-w-2xl">
                  {voiceBubbleText}
                </p>
              </div>
            )}
          </div>

          {/* Center Content: Animated Sphere + Template Cards */}
          <div className={`flex items-center justify-center z-10 gap-6 flex-1 w-full max-w-6xl ${showResumeTemplates ? 'flex-row' : 'flex-col'}`}>
            {/* Animated Particle Sphere Centerpiece */}
            <div className={`relative flex items-center justify-center shrink-0 transition-all duration-500 ${showResumeTemplates ? 'w-52 h-52' : 'w-72 h-72 sm:w-80 sm:h-80'}`}>
              {/* Outer glow */}
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
              
              {/* Particle sphere rings */}
              <div className={`voice-sphere ${voiceStatus === 'listening' ? 'voice-sphere-active' : ''} ${voiceStatus === 'speaking' ? 'voice-sphere-speaking' : ''}`}>
                <div className="sphere-ring sphere-ring-1" />
                <div className="sphere-ring sphere-ring-2" />
                <div className="sphere-ring sphere-ring-3" />
                <div className="sphere-ring sphere-ring-4" />
                <div className="sphere-ring sphere-ring-5" />
                <div className="sphere-ring sphere-ring-6" />
                <div className="sphere-ring sphere-ring-7" />
                <div className="sphere-ring sphere-ring-8" />
                
                {/* Center mic icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    voiceStatus === 'listening' 
                      ? 'bg-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.4)]' 
                      : voiceStatus === 'speaking' 
                        ? 'bg-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.3)]' 
                        : 'bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  }`}>
                    <Microphone size={22} weight="fill" className={`transition-colors duration-300 ${
                      voiceStatus === 'listening' ? 'text-blue-300 animate-pulse' : voiceStatus === 'speaking' ? 'text-cyan-300' : 'text-white/70'
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Template Cards in Voice Mode */}
            {showResumeTemplates && (
              <div className="flex-1 max-w-xl animate-fade-in">
                <h3 className="text-sm font-bold text-white mb-3 text-center">Choose a Resume Template</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {resumeTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectResumeTemplate(tpl.id)}
                      className="group relative bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-blue-400/40 rounded-xl p-3 text-left transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:-translate-y-0.5 cursor-pointer overflow-hidden"
                    >
                      <span className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-r ${tpl.gradient} flex items-center justify-center text-[9px] font-bold text-white shadow-lg`}>
                        {tpl.id}
                      </span>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tpl.gradient} flex items-center justify-center text-white text-sm mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                        {tpl.icon}
                      </div>
                      <h4 className="text-xs font-bold text-white mb-0.5 truncate">{tpl.name}</h4>
                      <p className="text-[9px] text-gray-400 leading-tight line-clamp-2">{tpl.desc}</p>
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tpl.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl`} />
                    </button>
                  ))}
                </div>
                <p className="text-center text-[9px] text-gray-500 mt-2 animate-pulse">Say a number (1-6) or click a template</p>
              </div>
            )}
          </div>

          {/* Bottom Control Bar */}
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMicrophone}
                className={`flex items-center gap-2.5 ${
                  voiceStatus === "listening" 
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)]" 
                    : "bg-white/10 hover:bg-white/15 border border-white/10"
                } text-white font-bold px-7 py-3.5 rounded-full text-xs transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-sm`}
              >
                {voiceStatus === "listening" ? (
                  <>
                    <Microphone className="w-4 h-4 animate-bounce text-white" /> Speak with cyberlim
                  </>
                ) : (
                  <>
                    <Microphone className="w-4 h-4 text-blue-300" /> Speak with cyberlim
                  </>
                )}
              </button>

              {/* Stop Voice Response Button */}
              {(voiceStatus === "speaking" || voiceStatus === "thinking") && (
                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && window.speechSynthesis) {
                      window.speechSynthesis.cancel();
                    }
                    if (recognitionRef.current) recognitionRef.current.stop();
                    updateVoiceStatus("idle");
                    setVoiceBubbleText("");
                  }}
                  className="flex items-center gap-2 bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/20 text-rose-300 hover:text-white font-bold px-5 py-3.5 rounded-full text-xs transition-all duration-300 active:scale-95 cursor-pointer animate-fade-in backdrop-blur-sm"
                  title="Stop AI response"
                >
                  <StopCircle size={16} weight="fill" /> Stop
                </button>
              )}
            </div>
            
            <p className="text-[10px] text-blue-400/40 font-medium">
              Uses system microphone for speech-to-text transformation
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 400ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        /* Voice Agent Background */
        .voice-agent-bg {
          background: radial-gradient(ellipse at 50% 40%, #0a1628 0%, #060e1a 40%, #030812 70%, #010409 100%);
        }

        /* Particle Sphere */
        .voice-sphere {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: sphereRotate 12s linear infinite;
        }
        .voice-sphere-active {
          animation: sphereRotate 6s linear infinite, spherePulse 1.5s ease-in-out infinite;
        }
        .voice-sphere-speaking {
          animation: sphereRotate 4s linear infinite, sphereBreath 2s ease-in-out infinite;
        }

        .sphere-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid transparent;
          border-top-color: rgba(100, 180, 255, 0.25);
          border-bottom-color: rgba(100, 180, 255, 0.15);
          background: radial-gradient(circle, transparent 60%, rgba(59, 130, 246, 0.03) 100%);
        }
        .voice-sphere-active .sphere-ring {
          border-top-color: rgba(59, 130, 246, 0.5);
          border-bottom-color: rgba(59, 130, 246, 0.3);
        }
        .voice-sphere-speaking .sphere-ring {
          border-top-color: rgba(6, 182, 212, 0.5);
          border-bottom-color: rgba(6, 182, 212, 0.25);
        }

        .sphere-ring-1 { transform: rotateX(0deg) rotateY(0deg); animation: ringFloat1 8s ease-in-out infinite; }
        .sphere-ring-2 { transform: rotateX(22.5deg) rotateY(45deg); animation: ringFloat2 9s ease-in-out infinite; }
        .sphere-ring-3 { transform: rotateX(45deg) rotateY(90deg); animation: ringFloat1 7s ease-in-out infinite reverse; }
        .sphere-ring-4 { transform: rotateX(67.5deg) rotateY(135deg); animation: ringFloat2 10s ease-in-out infinite; }
        .sphere-ring-5 { transform: rotateX(90deg) rotateY(0deg); animation: ringFloat1 6s ease-in-out infinite; }
        .sphere-ring-6 { transform: rotateX(112.5deg) rotateY(45deg); animation: ringFloat2 8s ease-in-out infinite reverse; }
        .sphere-ring-7 { transform: rotateX(135deg) rotateY(90deg); animation: ringFloat1 9s ease-in-out infinite; }
        .sphere-ring-8 { transform: rotateX(157.5deg) rotateY(135deg); animation: ringFloat2 7s ease-in-out infinite reverse; }

        /* Add dotted effect to rings */
        .sphere-ring::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 50%;
          border: 1px dashed rgba(100, 180, 255, 0.12);
        }
        .voice-sphere-active .sphere-ring::before {
          border-color: rgba(59, 130, 246, 0.25);
        }
        .voice-sphere-speaking .sphere-ring::before {
          border-color: rgba(6, 182, 212, 0.25);
        }

        /* Inner glow for the sphere */
        .voice-sphere::before {
          content: '';
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
          animation: innerGlow 3s ease-in-out infinite;
        }
        .voice-sphere-active::before {
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
        }
        .voice-sphere-speaking::before {
          background: radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%);
        }

        @keyframes sphereRotate {
          from { transform: rotateY(0deg) rotateX(15deg); }
          to { transform: rotateY(360deg) rotateX(15deg); }
        }
        @keyframes spherePulse {
          0%, 100% { transform: rotateY(var(--current-y, 0deg)) rotateX(15deg) scale(1); }
          50% { transform: rotateY(var(--current-y, 180deg)) rotateX(15deg) scale(1.06); }
        }
        @keyframes sphereBreath {
          0%, 100% { transform: rotateY(var(--current-y, 0deg)) rotateX(15deg) scale(1); }
          50% { transform: rotateY(var(--current-y, 180deg)) rotateX(15deg) scale(1.08); }
        }
        @keyframes ringFloat1 {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes ringFloat2 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes innerGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        /* Weather animations */
        @keyframes weatherBgPan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .weather-card-animate {
          background-size: 200% 200%;
          animation: weatherBgPan 8s ease infinite;
        }
        @keyframes weatherIconFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(5deg); }
        }
        .weather-icon-animate {
          display: inline-block;
          animation: weatherIconFloat 4s ease-in-out infinite;
        }
        @keyframes rainDrop {
          0% { transform: translateY(-20px) scaleY(1); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(40px) scaleY(0.8); opacity: 0; }
        }
        .rain-drop {
          position: absolute;
          width: 1.5px;
          height: 12px;
          background: linear-gradient(transparent, rgba(34, 211, 238, 0.4));
          animation: rainDrop 1.2s linear infinite;
          pointer-events: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes progress {
          0% { width: 3%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 4.5s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
        }
      `}</style>
    </div>
  );
}
