# VOLUME 02: WRITRIEVE (Write4U)
## Browser-Native Personal Context Engine & System-1 Decision Architecture
### Author: Roshan Kumar Gupta
### Repository: [`rk-roshan-kr/writrieve`](https://github.com/rk-roshan-kr/writrieve) | License: MIT

---

## 1. Executive Summary & Overview

Writrieve (Write4U) is a personal context engine designed to solve the critical latency, privacy, and cost bottlenecks of AI writing assistants. Running right inside web composers (Gmail, LinkedIn, GitHub) via a native Chrome extension, Writrieve replaces the brute-force "dump all context into an LLM" paradigm with a **5-layer dual-process architecture**:
* **System-1 Decision Gates**: Employs **Laya (421M parameters)** executing in **~1.7 ms** with **<800 MB VRAM** to evaluate source requirements before API calls occur.
* **Context Reduction**: Filters 200 raw personal context signals down to **9 verified evidence citations ($C^*$)**, achieving a **95.5% context reduction**.
* **Token Economics**: Slashes token consumption by **87.8%** (from 4,194 tokens down to **511 tokens**).
* **Latency Advantage**: Reduces end-to-end user turnaround from 4,320 ms down to **460 ms** (**9.4× faster**).
* **Factual Grounding**: Reaches **98.0% verified factual accuracy** (+30% over standard agent baselines) with **0.0% irrelevant noise**.
* **Test Verification**: 12/12 unit and integration tests execute in **0.30s**, backed by a 50-task CI stress test suite.

---

## 2. Problem Statement: The Conventional Agent "Prompt Bloat" Trap

### 2.1 The Failure Mode of Standard Tool-Calling Agents
When a user asks a conventional AI assistant:
> *"Write a follow-up email to Professor Chen regarding my research grant proposal."*

A standard multi-agent architecture executes an unbounded loop:
```
User Request ➔ Heavy LLM (e.g. 70B+) ➔ Calls 10 MCP Tools ➔ Dumps 200 items into Prompt ➔ Slow, Distracted Generation
```
This causes four severe failure modes:
1. **Severe Latency (4,320 ms)**: Heavy frontier models spend several seconds generating tool-call JSON schemas and ingesting multi-kilobyte text payloads.
2. **Context Window Pollution (4,194 tokens)**: Dumping unvetted email threads, calendar invites, and drive files fills the prompt with 95.5% irrelevant noise (e.g., flight confirmations, spam newsletter updates, irrelevant meeting notes).
3. **The "Lost in the Middle" Phenomenon**: Attention heads in the LLM suffer from attention degradation when reading large context blocks, resulting in hallucinated grant details or confused deadlines.
4. **Severe Privacy Exposure**: Blindly pushing an entire inbox into a remote model exposes sensitive personal communications.

---

## 3. The Five Major Architectural Layers

```
                         ┌───────────────────────┐
                         │         USER          │
                         │ "Write a follow-up to │
                         │  Prof. X on research" │
                         └───────────┬───────────┘
                                     │
                                     ▼
                    ┌────────────────────────────┐
                    │  LAYER 1: BROWSER EXTENSION│
                    │  Active page, recipient,   │
                    │  thread ID & user task     │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │      FASTAPI BACKEND       │
                    │     Context Orchestrator   │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
              ┌─────────────────────────────────────────┐
              │    LAYER 2: LAYA SYSTEM-1 DECISION      │
              │  • Source Selection Gate (Gmail: 94%)   │
              │  • Tool Query Generation                │
              │  • Stop condition & budget control      │
              └────────────────────┬────────────────────┘
                                   │
                                   ▼
              ┌─────────────────────────────────────────┐
              │    LAYER 3: COMPOSIO CONNECTORS         │
              │  Gmail │ Calendar │ Drive │ GitHub      │
              │  Managed OAuth + Hosted MCP Session     │
              └────────────────────┬────────────────────┘
                                   │ Raw Candidates (200 items)
                                   ▼
              ┌─────────────────────────────────────────┐
              │    LAYER 4: SELECTION & PROVENANCE      │
              │  • Canonical ContextItem Normalization   │
              │  • BGE Reranker (200 → 13 → 9 items)    │
              │  • Conflict & Chronology Verification   │
              └────────────────────┬────────────────────┘
                                   │
                                   ▼
              ┌─────────────────────────────────────────┐
              │    LAYER 5: LAYA SUFFICIENCY GATE       │
              │  "Is evidence sufficient to generate?"  │
              │   YES (93%) ──────→ Grounded Generation │
              │   NO        ──────→ Targeted Query Loop │
              └────────────────────┬────────────────────┘
                                   │
                                   ▼
              ┌─────────────────────────────────────────┐
              │    GROUNDED GENERATION (OPEN-WEIGHT)    │
              │  Qwen3-8B conditioned strictly on the   │
              │  9 verified evidence citations          │
              └─────────────────────────────────────────┘
```

### Layer 1: Native Browser Extension
* Injected directly into Chrome web composers (Gmail, LinkedIn, GitHub).
* Captures composer DOM state, active thread ID, recipient email, and user prompt with zero UI disruption.

### Layer 2: Laya System-1 Source Selection Gate
* **Why 421M Parameters?**: Large models are overkill for classification. Laya 421M evaluates the probability distribution:
$$P(\text{Source}_i \text{ is required} \mid \text{Task } T)$$
* If the user writes: *"Schedule a coffee chat with Alex"*, Laya assigns **Google Calendar: 98%**, **Gmail: 91%**, **Google Drive: 2%**, **GitHub: 0%**.
* API calls to Drive and GitHub are **pruned immediately**, eliminating redundant network traffic.

### Layer 3: Composio Unified Connectors
* Handles managed OAuth across Google Workspace and GitHub.
* Exposes standardized Model Context Protocol (MCP) tool endpoints.
* Provides a deterministic fallback mode using an interconnected 200-signal mock database for reproducible offline evaluation.

### Layer 4: Selection, BGE Reranking & Provenance Verification
* Normalizes raw API objects into immutable `ContextItem` records.
* Uses the **BGE Reranker** to score items against the task vector:
  - 200 candidates $\to$ Top 13 candidates.
  - Resolves temporal conflicts (e.g., distinguishing between a draft proposal from Tuesday and the revised finalized grant from Friday).
  - Yields exactly **9 verified citations ($C^*$)**.

### Layer 5: Laya Sufficiency Gate & Grounded Generation
* Before invoking the generation model, Laya evaluates:
$$\text{Sufficiency}(C^*, T) \in [0, 1]$$
* If evidence is complete ($\ge 0.90$), generation proceeds immediately.
* If a crucial datum is missing (e.g., missing phone number), it initiates a single targeted query rather than an unbounded search loop.
* The open-weight **Qwen3-8B** generates text strictly conditioned on the 9 verified facts.

---

## 4. Empirical Benchmark Results

Evaluated on a standardized benchmark of **200 personal context signals**:

| Metric | Baseline A: Vanilla LLM | Baseline B: Normal Multi-Tool Agent | Writrieve / Write4U (Ours) | Advantage |
| :--- | :---: | :---: | :---: | :---: |
| **Tool Calling Pattern** | 0 calls | Unbounded (all tools active) | **Gated by Laya 421M** | **Selective execution** |
| **Context Sent** | 0 items | 200 items (100% dump) | **9 items ($C^*$)** | **95.5% context reduction** |
| **Token Consumption** | 380 tokens | 4,194 tokens | **511 tokens** | **87.8% token savings** |
| **Irrelevant Noise** | 100% (Ungrounded) | 95.5% noise | **0.0% noise** | **Complete noise elimination** |
| **Factual Grounding** | 35.0% (Hallucinated) | 68.0% (Distracted) | **98.0% verified** | **+30% accuracy improvement** |
| **End-to-End Latency** | 320 ms | 4,320 ms | **460 ms** | **9.4× faster** |

---

## 5. Senior Interview & Defense Questions ("Grill Me")

### Q1: "Why not let a large frontier model like GPT-4o decide tool calling?"
> **Roshan's Defense**: "Using a 70B+ or closed-source frontier model for routing decisions is computationally irresponsible. Generating tool arguments through a large autoregressive model costs 1,200–2,000 ms before a single tool executes. Laya 421M makes typed classification decisions in **1.7 ms** with **<800 MB of VRAM**, running locally on the user's GPU. By separating fast System-1 routing from deliberate System-2 generation, we slash end-to-end latency from 4.3 seconds to 460 milliseconds."

### Q2: "What happens if Laya's Source Selection Gate makes a false negative?"
> **Roshan's Defense**: "That is precisely why Layer 5 features the **Sufficiency Gate**. If Laya skips Google Drive, but the retrieved emails leave a crucial variable unbound (e.g., 'the exact budget figure is missing from emails'), the Sufficiency Gate detects that entity coverage is below the threshold ($\text{Sufficiency} < 0.90$). It then triggers a targeted fallback query directly to Google Drive, ensuring 100% recall without paying the latency penalty upfront on every request."

### Q3: "Why use Composio instead of direct Google API client libraries?"
> **Roshan's Defense**: "Direct Google Workspace client libraries require users to create Google Cloud console projects, configure OAuth consent screens, and maintain individual client secrets. Composio provides enterprise-grade token exchange, automatic token refresh, and standardized Model Context Protocol (MCP) endpoints out of the box, allowing users to connect Gmail and Google Calendar with one-click authorization."
