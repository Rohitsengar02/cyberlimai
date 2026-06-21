"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Sparkle, PaperPlaneRight, Cpu, User, WarningOctagon, CheckCircle, Image as ImageIcon, Download, Trash, Cloud, Chat, Paperclip, Gear, Plus, List, ArrowLineLeft, ArrowLineRight, Microphone, MicrophoneSlash, StopCircle } from "@phosphor-icons/react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  type?: "text" | "image";
  imageUrl?: string;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  type: "text" | "image";
  messages: ChatMessage[];
}

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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [themeMode, setThemeMode] = useState<"purple" | "dark" | "blue">("purple");

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

  // Active Session helper
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const activeWindow = activeSession.type;

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

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

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

  const createNewSession = (type: "text" | "image") => {
    const id = Date.now().toString();
    const newSession: ChatSession = {
      id,
      title: type === "text" ? `Text Chat #${sessions.length + 1}` : `Image Canvas #${sessions.length + 1}`,
      type,
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleSendText = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const targetPrompt = customPrompt || textInput;
    if (!targetPrompt.trim() || isTextLoading) return;

    const userPrompt = targetPrompt.trim();
    if (!customPrompt) setTextInput("");
    setIsTextLoading(true);
    setTextStatus("idle");
    setTextErrorMsg("");

    // Add user message to active session
    setSessions((prev) => prev.map(s => {
      if (s.id === activeSessionId) {
        // Set dynamic title based on first query
        const title = s.messages.length === 0 ? (userPrompt.length > 22 ? userPrompt.substring(0, 20) + "..." : userPrompt) : s.title;
        return {
          ...s,
          title,
          messages: [...s.messages, { role: "user", content: userPrompt, type: "text" }]
        };
      }
      return s;
    }));

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
      const response = await fetch("/api/hf-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend, model: "pollinations" })
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
            messages: [...s.messages, { role: "assistant", content: "", type: "text", isStreaming: true }]
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

  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-40 pointer-events-none">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-white to-blue-300"></div>
      </div>

      {/* SIDEBAR COMPONENT */}
      <aside 
        className={`h-screen bg-[#09030e] border-r border-purple-950/50 flex flex-col justify-between z-20 shrink-0 transition-all duration-350 ${
          sidebarOpen ? "w-64" : "w-0 -translate-x-full overflow-hidden"
        }`}
      >
        <div className="p-4 flex flex-col gap-5 overflow-y-auto flex-1">
          {/* Logo brand info */}
          <div className="flex items-center gap-2 px-2">
            <img src="http://hextaui.com/logo.svg" width={26} height={26} alt="cyberlim.AI Logo" className="invert" />
            <span className="font-bold text-sm tracking-tight text-white">cyberlim.AI</span>
          </div>

          {/* New Chat Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => createNewSession("text")}
              className="flex items-center justify-center gap-1.5 bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={12} weight="bold" /> Text Chat
            </button>
            <button 
              onClick={() => createNewSession("image")}
              className="flex items-center justify-center gap-1.5 bg-[#1c1528] hover:bg-[#2a1f3d] border border-purple-900/30 text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={12} weight="bold" /> Image Canvas
            </button>
          </div>

          {/* Sessions List */}
          <div className="space-y-1.5 flex-1">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider px-2">History Sessions</p>
            <div className="space-y-1">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                      isActive 
                        ? "bg-[#1c1528] border-purple-900/50 text-white" 
                        : "bg-transparent border-transparent text-gray-400 hover:bg-[#1c1528]/40 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {s.type === "text" ? <Chat size={13} /> : <ImageIcon size={13} />}
                      <span className="truncate">{s.title}</span>
                    </div>
                    <button 
                      onClick={(e) => deleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5 rounded"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer settings block */}
        <div className="p-4 border-t border-purple-950/40 bg-[#07020b] space-y-2">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <Gear size={15} /> Settings Panel
          </button>
          
          <Link href="/" className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition-colors">
            <ArrowLeft size={15} /> Exit Workspace
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
        <main className="flex-1 flex flex-col items-center justify-between px-6 py-6 w-full max-w-4xl mx-auto overflow-hidden relative z-10">
          
          {/* Header Area inside main screen */}
          <header className="w-full flex justify-between items-center pb-4 border-b border-purple-950/20 pl-12">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-400 bg-purple-950/40 border border-purple-900/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Cloud size={12} className="animate-pulse" />
                {activeWindow === "text" ? "Chat Assistant Active" : "Image Generator Active"}
              </span>
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
                Engine: Pollinations.ai (Free/Fast)
              </span>
            </div>
          </header>

          {/* CHAT/WORK AREA VIEWPORT */}
          <div className="flex-1 w-full overflow-y-auto my-6 pr-2">
            
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
                          <div className="whitespace-pre-wrap">{msg.content}</div>
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
                            <div className="space-y-1">
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
            <form onSubmit={activeWindow === "text" ? handleSendText : handleSendImage} className="relative max-w-2xl mx-auto w-full">
              <div className="bg-[#1c1528] rounded-full p-2.5 flex items-center border border-purple-900/30 focus-within:border-purple-500/80 transition-all">
                <button type="button" className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                  <Paperclip className="w-5 h-5 text-gray-400" />
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
      </div>

      {/* PDF SIDEBAR CONTAINER */}
      {showPdfSidebar && (
        <>
          {/* Resize Handler Bar */}
          <div
            ref={resizeRef}
            onMouseDown={startResizing}
            className={`w-[6px] hover:w-2 bg-purple-950/60 hover:bg-purple-500/80 active:bg-purple-500 cursor-col-resize transition-all duration-150 z-20 relative select-none ${
              isResizing ? "bg-purple-500 w-2" : ""
            }`}
          />

          <aside 
            style={{ width: `${pdfWidth}px` }}
            className="h-screen bg-[#07020b] border-l border-purple-950/50 flex flex-col justify-between z-10 shrink-0 relative"
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
                      p: ({ children }) => <p className="mb-3 last:mb-0 text-gray-700">{children}</p>,
                      ul: ({ children }) => <ul className="my-3 pl-5 list-disc space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="my-3 pl-5 list-decimal space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      table: ({ children }) => (
                        <div className="my-4 overflow-x-auto border border-gray-200 rounded">
                          <table className="w-full text-left border-collapse text-[10px]">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-gray-100 border-b border-gray-200 font-bold">{children}</thead>,
                      tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
                      tr: ({ children }) => <tr>{children}</tr>,
                      th: ({ children }) => <th className="px-3 py-2 font-semibold text-gray-600">{children}</th>,
                      td: ({ children }) => <td className="px-3 py-2 text-gray-750">{children}</td>,
                      h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 border-b border-gray-100 pb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold text-gray-800 mt-3 mb-1.5">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold text-gray-700 mt-2 mb-1">{children}</h3>,
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
      `}</style>
    </div>
  );
}
