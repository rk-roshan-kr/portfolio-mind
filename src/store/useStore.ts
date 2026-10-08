import { create } from 'zustand';
import * as webllm from '@mlc-ai/web-llm';
import universeDataRaw from '@/data/knowledge-base.json';
import { resolveTerminalQuery, queryProjectOracle, formatProjectFactsForPrompt } from '@/data/project-oracle';
const universeData = universeDataRaw as any;

export interface PortfolioNode {
  id: string;
  title: string;
  type: 'skill' | 'project' | 'query';
  level?: number;
  parentId?: string | null;
  description: string;
  position: [number, number, number];
  techStack?: string[];
  links?: { label: string; url: string }[];
}

export interface Edge {
  source: string;
  target: string;
  opacity: number;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface PortfolioState {
  nodes: PortfolioNode[];
  edges: Edge[];
  activeNodeId: string | null;
  attentionCluster: string[];
  activeQuery: string | null;
  glowingNodeIds: string[];
  chatHistory: ChatMessage[];
  viewMode: 'neural' | 'classic';
  searchFocusTrigger: number;
  isInspectorOpen: boolean;
  isContactModalOpen: boolean;
  
  setActiveNode: (id: string | null) => void;
  setViewMode: (mode: 'neural' | 'classic') => void;
  triggerSearchFocus: () => void;
  toggleInspector: (open?: boolean) => void;
  toggleContactModal: (open?: boolean) => void;
  triggerQuery: (query: string, nodeIds: string[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateLastChatMessage: (content: string) => void;
  submitQuery: (text: string) => void;
  
  // Neural Engine State
  engine: webllm.MLCEngineInterface | null;
  isInitializing: boolean;
  initProgress: string;
  isSatelliteOnline: boolean;
  isForging: boolean;
  setEngine: (engine: webllm.MLCEngineInterface | null) => void;
  setInitializing: (is: boolean) => void;
  setInitProgress: (progress: string) => void;
  initializeEngine: () => Promise<void>;
  checkSatelliteStatus: () => Promise<void>;
  checkForgingStatus: () => Promise<void>;
}

export const useStore = create<PortfolioState>((set, get) => ({
  nodes: universeData.nodes as PortfolioNode[],
  edges: universeData.edges as Edge[], 
  activeNodeId: null,
  attentionCluster: [],
  activeQuery: null,
  glowingNodeIds: [],
  chatHistory: [],
  viewMode: (typeof window !== 'undefined' && window.innerWidth < 1024) ? 'classic' : 'neural',
  searchFocusTrigger: 0,
  isInspectorOpen: false,
  isSatelliteOnline: false,
  isForging: false,
  isContactModalOpen: false,
  
  setActiveNode: (id) => set((state) => {
    if (!id) return { activeNodeId: null, attentionCluster: [] };
    
    // Find absolute target node
    const targetNode = state.nodes.find(n => n.id === id);
    if (!targetNode) return { activeNodeId: null, attentionCluster: [] };
    
    // Calculate Attention Cluster
    const cluster = new Set<string>();
    cluster.add(id);

    // 1. Traverse all parents backwards to strictly link to the Core
    let currentParentId = targetNode.parentId;
    while (currentParentId) {
      cluster.add(currentParentId);
      const parentNode = state.nodes.find(n => n.id === currentParentId);
      currentParentId = parentNode ? parentNode.parentId : null;
    }
    
    // 2. Find all direct children
    state.nodes.forEach(n => {
      if (n.parentId === id) cluster.add(n.id);
    });

    return { activeNodeId: id, attentionCluster: Array.from(cluster) };
  }),
  
  triggerQuery: (query, nodeIds) => set({ activeQuery: query, glowingNodeIds: nodeIds }),
  
  addChatMessage: (message) => set((state) => ({ chatHistory: [...state.chatHistory, message] })),
  
  updateLastChatMessage: (content) => set((state) => {
    if (state.chatHistory.length === 0) return state;
    const newHistory = [...state.chatHistory];
    newHistory[newHistory.length - 1] = { 
      ...newHistory[newHistory.length - 1], 
      content 
    };
    return { chatHistory: newHistory };
  }),

  submitQuery: async (text) => {
    const { addChatMessage, updateLastChatMessage, engine } = get();
    addChatMessage({ role: 'user', content: text });
    
    // Internal node generation for visual feedback
    const state = get();
    const queryId = `query-${Date.now()}`;
    const queryNode: PortfolioNode = {
      id: queryId,
      title: `Query`,
      type: 'query',
      description: text,
      position: [(Math.random()-0.5)*10, (Math.random()-0.5)*10, 5],
    };
    set({ nodes: [...state.nodes, queryNode] });

    // AI Response Routing
    addChatMessage({ role: 'ai', content: "" }); 
    
    // 1. MASTER DETERMINISTIC ORACLE: Instant verified factual & architectural resolution
    const resolved = resolveTerminalQuery(text);
    if (resolved.isHandled) {
      if (resolved.targetNodeId) {
        get().setActiveNode(resolved.targetNodeId);
      }
      const chunks = resolved.content.split(/(\s+)/);
      let accumulated = '';
      for (let i = 0; i < chunks.length; i++) {
        accumulated += chunks[i];
        updateLastChatMessage(accumulated);
        await new Promise((r) => setTimeout(r, 16));
      }
      return;
    }

    // 2. Fallback to Project Ground Truth facts block
    const matchedFacts = queryProjectOracle(text);
    const factsBlock = formatProjectFactsForPrompt(matchedFacts);
    if (matchedFacts.length > 0) {
      get().setActiveNode(matchedFacts[0].nodeId);
    }

    try {
      if (engine) {
        // [ WebLLM MODE ] - Pure Serverless Architecture
        console.log("[ NEURAL_ROUTING ] Engaging Serverless WebGPU Core.");
        let fullResponse = "";
        
        // Build context for the graph-initiated query
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
          { role: 'user', content: text }
        ];

        const completion = await engine.chat.completions.create({
          messages,
          stream: true,
          temperature: 0.08,
          max_tokens: 450
        });
        
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullResponse += content;
          const cleanText = fullResponse
            .replace(/Rokas/gi, 'Earthos Lab')
            .replace(/Pichandajee/gi, 'Pichai');
          updateLastChatMessage(cleanText);
        }
      } else {
        updateLastChatMessage("[ ERROR: NEURAL_OFFLINE ] WebGPU Initialization required.");
      }
    } catch (err) {
      console.error("Inference Error:", err);
      updateLastChatMessage("[ ERROR: SIGNAL_REJECTED ] WebGPU Engine failure.");
    }
  },

  // Neural Engine State
  engine: null,
  isInitializing: false,
  initProgress: "",
  setEngine: (engine) => set({ engine }),
  setInitializing: (is) => set({ isInitializing: is }),
  setInitProgress: (progress) => set({ initProgress: progress }),
  
  initializeEngine: async () => {
    const { engine, isInitializing, setEngine, setInitializing, setInitProgress, addChatMessage } = get();
    if (engine || isInitializing) return;

    setInitializing(true);
    setInitProgress("Initializing WebGPU Serverless Engine...");

    try {
      // Deploying the ultra-fast Qwen 2.5 0.5B model for instant background downloads
      const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
      const newEngine = await webllm.CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (report) => setInitProgress(report.text)
      });
      setEngine(newEngine);
      setInitializing(false);
      
      // Initial System Ping (First-Person)
      if (get().chatHistory.length === 0) {
        addChatMessage({ 
          role: 'ai', 
          content: "Serverless Neural Engine Online. WebGPU acceleration verified. I am the authoritative Digital Twin of Roshan Kumar Gupta. How can I assist in your technical discovery today?" 
        });
      }
    } catch (err) {
      console.error("Neural Initialization Failed:", err);
      setInitProgress("Initialization Failed. WebGPU may not be supported by this browser.");
      setInitializing(false);
    }
  },

  checkSatelliteStatus: async () => {
    // Disabled: Fully transitioned to Path B (Serverless WebGPU Model)
    set({ isSatelliteOnline: false });
  },

  checkForgingStatus: async () => {
    // Disabled: Training phase completed.
    set({ isForging: false });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  triggerSearchFocus: () => set((state) => ({ searchFocusTrigger: state.searchFocusTrigger + 1 })),
  toggleInspector: (open) => set((state) => ({ isInspectorOpen: open !== undefined ? open : !state.isInspectorOpen })),
  toggleContactModal: (open) => set((state) => ({ isContactModalOpen: open !== undefined ? open : !state.isContactModalOpen }))
}));
