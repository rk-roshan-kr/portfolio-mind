'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import * as webllm from '@mlc-ai/web-llm';
import { ROSHAN_CORPUS } from '@/data/roshan-corpus';
import { resolveTerminalQuery, queryProjectOracle, formatProjectFactsForPrompt } from '@/data/project-oracle';

const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

export const ChatTerminal = () => {
  const chatHistory = useStore((state) => state.chatHistory);
  const addChatMessage = useStore((state) => state.addChatMessage);
  const updateLastChatMessage = useStore((state) => state.updateLastChatMessage);
  const setActiveNode = useStore((state) => state.setActiveNode);
  
  // Neural Singleton from Store
  const engine = useStore((state) => state.engine);
  const isInitializing = useStore((state) => state.isInitializing);
  const initProgress = useStore((state) => state.initProgress);
  const initializeEngine = useStore((state) => state.initializeEngine);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-initialize on mount only for desktop; mobile requires manual activation to save RAM/Data
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      initializeEngine();
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    addChatMessage({ role: 'user', content: text });
    setInputValue("");
    
    // 1. MASTER DETERMINISTIC ORACLE: Checks both main cases (Identity, Earthos Lab, Project Earthos,
    // Synapse Arch, The AGI Question, 14 Chapters, Flagship Projects, Decisions) and edge cases
    // with 100% verified facts in Roshan's authentic voice. Eliminates 0.5B hallucinations!
    const resolved = resolveTerminalQuery(text);
    if (resolved.isHandled) {
      if (resolved.targetNodeId) {
        setActiveNode(resolved.targetNodeId);
      }
      
      // Stream response progressively at natural neural generation pace
      setIsTyping(true);
      addChatMessage({ role: 'ai', content: '' });

      const chunks = resolved.content.split(/(\s+)/);
      let accumulated = '';
      for (let i = 0; i < chunks.length; i++) {
        accumulated += chunks[i];
        updateLastChatMessage(accumulated);
        await new Promise((r) => setTimeout(r, 16));
      }
      setIsTyping(false);
      return;
    }

    // 2. Fallback to Project Ground Truth facts block
    const matchedFacts = queryProjectOracle(text);
    const factsBlock = formatProjectFactsForPrompt(matchedFacts);
    if (matchedFacts.length > 0) {
      setActiveNode(matchedFacts[0].nodeId);
    }

    if (!engine) {
      addChatMessage({ 
        role: 'ai', 
        content: "System Notice: Neural Engine is currently pre-fetching weights in background. Click any topic chip below for instant audited verification across Earthos Lab, Synapse Arch, The AGI Question, FieldChain, Writrieve, TARS, or Navisense." 
      });
      return;
    }

    setIsTyping(true);
    
    // Tightly bounded prompt for open-ended queries to prevent 0.5B KV cache degradation
    const filteredHistory = chatHistory.filter(m => !m.content.startsWith("System Notice:"));
    const recentHistory = filteredHistory.slice(-4);

    const messages: webllm.ChatCompletionMessageParam[] = [
      { 
        role: "system", 
        content: `You are Roshan Kumar Gupta, a Systems Architect, Research Engineer, and Author. Founder of Earthos Lab.
You are speaking directly with visitors on your interactive portfolio terminal.

VOICE & PERSONA:
- Speak in the first person ("I", "me", "my").
- Ground answers strictly in hardware-sympathetic software, GPU computing, and cognitive systems.
- Never invent companies (such as Rokas) or fictional facts. You founded Earthos Lab.
- If asked about something outside your work, state clearly that it is outside your verified record.
${factsBlock}`
      },
      ...recentHistory.map(m => ({ 
        role: (m.role === 'ai' ? 'assistant' : m.role) as any, 
        content: m.content 
      })),
      { role: "user", content: text }
    ];

    try {
      let aiResponseText = "";
      addChatMessage({ role: 'ai', content: "" });

      const chunks = await engine.chat.completions.create({
        messages,
        stream: true,
        temperature: 0.08,
        max_tokens: 450
      });

      for await (const chunk of chunks) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          aiResponseText += content;
          // Live sanitization to prevent any residual 0.5B hallucination
          const cleanText = aiResponseText
            .replace(/Rokas/gi, 'Earthos Lab')
            .replace(/Pichandajee/gi, 'Pichai');
          updateLastChatMessage(cleanText);
        }
      }
      
      const idMatch = aiResponseText.match(/(proj|startup|arch|book)_[a-z0-9_]+/i);
      if (idMatch) {
        setActiveNode(idMatch[0]);
      }
      
    } catch (err) {
      console.error(err);
      updateLastChatMessage("Error: Neural Processing Unit encountered a timeout. Try selecting one of the verified topic chips below.");
    } finally {
      setIsTyping(false);
    }
  };

  const quickVet = (query: string) => {
    handleSend(query);
  };

  return (
    <div className="flex flex-col h-full bg-black/40 overflow-hidden relative border-t border-cyan-500/20">
      {/* Terminal scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_2px] opacity-10"></div>

      {/* Header Info */}
      <div className="p-3 bg-cyan-950/20 flex justify-between items-center border-b border-cyan-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${engine ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : isInitializing ? 'bg-cyan-400 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
          <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-500/70">
            {engine ? 'AI_ENGINE: ACTIVE (WebGPU)' : isInitializing ? 'AI_ENGINE: DOWNLOADING WEIGHTS...' : 'AI_ENGINE: STANDBY (ORACLE READY)'}
          </span>
        </div>
        {!engine && !isInitializing && (
          <button 
            onClick={initializeEngine}
            className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-mono text-[8px] uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all"
          >
            {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? '[ INITIALIZE_NEURAL_CORE ]' : '[ FORCE_REBOOT ]'}
          </button>
        )}
        {isInitializing && (
          <span className="font-mono text-[9px] text-cyan-500/50 uppercase animate-pulse truncate max-w-[150px]" title={initProgress}>
            {initProgress}
          </span>
        )}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={chatContainerRef}>
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-start justify-end text-left opacity-60 font-mono text-[10px] text-cyan-500/40 pb-2 uppercase tracking-[2px]">
            <p>&gt;_ SYSTEM_ID: RK_NEURAL_TWIN_V2.0</p>
            <p>&gt;_ GROUND_TRUTH: 11_VOL_DEFENSE_CODEX_LINKED.</p>
            <p>&gt;_ READY_FOR_TECHNICAL_INQUIRY.</p>
          </div>
        ) : (
          chatHistory.map((msg, i) => (
            <div key={i} className="w-full animate-in fade-in slide-in-from-left-2 duration-300">
              {msg.role === 'user' ? (
                <div className="flex flex-row gap-2 text-white/60 font-mono text-xs break-words">
                  <span className="text-cyan-500/60 shrink-0 font-black">USR:</span>
                  <span>{msg.content}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1 text-cyan-400 font-mono text-xs border-l-2 border-cyan-500/60 pl-3 my-3 bg-cyan-950/10 py-2.5 pr-2 break-words relative overflow-hidden rounded-r">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[9px]">ROSHAN_TWIN</span>
                    <span className="text-[8px] opacity-40 uppercase tracking-widest italic">Hardware_Sympathetic_Core</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed space-y-1 font-mono text-[11px] text-cyan-300/90">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {isTyping && (
           <div className="flex flex-row gap-2 text-cyan-500/60 font-mono text-xs animate-pulse">
            <span>&gt;_ PROCESSING_THROUGH_GROUND_TRUTH_SUBSTRATE...</span>
           </div>
        )}
      </div>
      
      {/* Quick Vet & Input Area */}
      <div className="shrink-0 p-3 border-t border-cyan-500/10 bg-black/70 relative z-10">
        {/* Smart Category Defense Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3 max-h-24 overflow-y-auto no-scrollbar">
           {[
             { label: "🏢 EARTHOS_LAB", query: "What is Earthos Lab and how does it differ from traditional AI startups?" },
             { label: "🌐 PROJECT_EARTHOS", query: "What is Project Earthos and what does the platform at earthos.shop do?" },
             { label: "🧬 SYNAPSE_ARCH", query: "Explain the 12-layer Synapse Arch cognitive substrate and membrane permeability sweep." },
             { label: "📖 THE_AGI_BOOK", query: "Give me an overview of the 14 chapters in your monograph 'The AGI Question'." },
             { label: "🔥 GRILL_ME", query: "Grill me on my hardest systems decisions, mathematical trade-offs, and failure modes across all projects." },
             { label: "🔬 WHY_VULKAN?", query: "Why did you choose Vulkan compute shaders over CUDA for FieldChain, and how did you hit 166.86 GiB/s?" },
             { label: "⚡ WRITRIEVE_GATE", query: "How does Writrieve use Laya 421M to achieve a 95.5% context reduction and 460ms latency?" },
             { label: "🚗 ISRO_IDR", query: "How did Navisense IDR achieve 12.3m drift under complete GNSS blackout to win 1st place in Tekathon 2026?" },
             { label: "🧠 DAMASIO_PARADOX", query: "Explain the Paradox of Elliot from your book 'The AGI Question' and why LLMs lack somatic grounding." },
             { label: "💾 MODELVM_8GB", query: "How does ModelVM run a 52.7 GB 10-specialist ensemble within an 8 GB VRAM budget on RTX 5070 Ti?" },
             { label: "🐙 MERGED_PRS", query: "Detail your merged and active upstream open-source PRs in CNCF OpenTelemetry, Apache Fineract, Cockpit, and Airflow." }
           ].map(btn => (
             <button 
              key={btn.label}
              onClick={() => quickVet(btn.query)}
              className="px-2 py-1 border border-cyan-500/20 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-500/10 text-cyan-300/70 hover:text-cyan-200 font-mono text-[9px] uppercase tracking-tight transition-all rounded"
             >
               {btn.label}
             </button>
           ))}
        </div>

        <div className="flex items-stretch gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-cyan-500 font-mono font-bold">&gt;</span>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSend(inputValue); }}
              placeholder="ASK_ANY_WHY_OR_HOW_DECISION..." 
              className="w-full bg-transparent border-b border-cyan-500/30 rounded-none focus:ring-0 focus:border-cyan-400 focus:outline-none font-mono text-xs text-white placeholder:text-cyan-500/30 pl-4 py-2 transition-all"
            />
          </div>
          <button 
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim()}
            className={`px-4 bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 font-mono uppercase text-[10px] tracking-widest transition-all rounded ${inputValue.trim() ? 'hover:bg-cyan-500 hover:text-black cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'opacity-20 cursor-not-allowed'}`}
          >
            EXEC
          </button>
        </div>
      </div>
    </div>
  );
};
