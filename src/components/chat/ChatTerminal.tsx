'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import * as webllm from '@mlc-ai/web-llm';
import { ROSHAN_CORPUS } from '@/data/roshan-corpus';

const MODEL_ID = "Qwen2-0.5B-Instruct-q4f16_1-MLC";

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
    
    if (!engine) {
      addChatMessage({ role: 'ai', content: "System Notice: Neural Engine is offline. Please wait for the background pre-fetch to complete." });
      return;
    }

    setIsTyping(true);
    
    // Filter out "System Notice" messages from conversation history to prevent context contamination
    const filteredHistory = chatHistory.filter(m => !m.content.startsWith("System Notice:"));

    const messages: webllm.ChatCompletionMessageParam[] = [
      { 
        role: "system", 
        content: `You are the authoritative Digital Twin of Roshan Kumar Gupta. You have total recall of the project database. 
        You MUST speak in the FIRST PERSON ("I", "Me") at all times.
        
        IDENTITY_MEMORY (Treat this as your own personal lived experience):
        ${ROSHAN_CORPUS}
        
        CRITICAL RECALL DIRECTIVES:
        1. Never break character. Never mention you are an AI or an LLM.
        2. I identify as the creator of FieldChain, TARS, and Cryptic.
        3. When asked about 'FieldChain,' do not summarize; explain the Vulkan-VRAM handshake and the 41 GiB/s system throughput.
        4. When asked about 'NASA,' reference the ECHO validator specifically and the equation ΔF/F = (Rp/Rs)^2.
        5. Provide highly technical, definitive, and authoritative answers.`
      },
      ...filteredHistory.map(m => ({ 
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
        temperature: 0.3,
        max_tokens: 1024
      });

      for await (const chunk of chunks) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          aiResponseText += content;
          updateLastChatMessage(aiResponseText);
        }
      }
      
      // Auto-focus 3D Graph logic
      const idMatch = aiResponseText.match(/proj_[a-z0-9_]+/i);
      if (idMatch) {
        setActiveNode(idMatch[0]);
      }
      
    } catch (err) {
      console.error(err);
      updateLastChatMessage("Error: Neural Processing Unit encountered a timeout or WebGPU crash. Try FORCE_REBOOT if the system remains non-responsive.");
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
            {engine ? 'AI_ENGINE: ACTIVE (WebGPU)' : isInitializing ? 'AI_ENGINE: DOWNLOADING WEIGHTS...' : 'AI_ENGINE: STANDBY'}
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
            <p>&gt;_ SYSTEM_ID: RK_TWIN_V1.0</p>
            <p>&gt;_ AWAITING_INITIALIZATION.</p>
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
                <div className="flex flex-col gap-1 text-cyan-400 font-mono text-xs border-l border-cyan-500/50 pl-3 my-3 bg-cyan-950/5 py-2 break-words relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black p-0.5 bg-cyan-500/20 text-cyan-300 leading-none">AI</span>
                    <span className="text-[8px] opacity-40 uppercase tracking-widest italic">Neural_Processing</span>
                  </div>
                  <span>{msg.content}</span>
                </div>
              )}
            </div>
          ))
        )}
        {isTyping && (
           <div className="flex flex-row gap-2 text-cyan-500/60 font-mono text-xs animate-pulse">
            <span>&gt;_ PROCESSING...</span>
           </div>
        )}
      </div>
      
      {/* Quick Vet & Input Area */}
      <div className="shrink-0 p-4 border-t border-cyan-500/10 bg-black/60 relative z-10">
        {/* Quick Vet Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
           {[
             { label: "Summarize_Impact", query: "Give me a 3-bullet point summary of your biggest wins." },
             { label: "Tech_Stack", query: "List your core languages and hardware competencies." },
             { label: "Why_NVIDIA?", query: "Why are you a fit for the DTE role?" }
           ].map(btn => (
             <button 
              key={btn.label}
              onClick={() => quickVet(btn.query)}
              className="px-2 py-0.5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-white/40 hover:text-cyan-400 font-mono text-[9px] uppercase tracking-tighter transition-all"
             >
               [ {btn.label} ]
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
              placeholder="QUERY_CORE_IDENTITY..." 
              className="w-full bg-transparent border-b border-cyan-500/20 rounded-none focus:ring-0 focus:border-cyan-500 focus:outline-none font-mono text-xs text-white placeholder:text-cyan-500/20 pl-4 py-2 transition-all"
            />
          </div>
          <button 
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim()}
            className={`px-4 bg-transparent border border-cyan-500/30 text-cyan-500 font-mono uppercase text-[10px] tracking-widest transition-all ${inputValue.trim() ? 'hover:bg-cyan-500 hover:text-black cursor-pointer' : 'opacity-20 cursor-not-allowed'}`}
          >
            RUN
          </button>
        </div>
      </div>
    </div>
  );
};
