import os
import json
from pathlib import Path
from openai import OpenAI

# ==========================================
# PHASE 1: TEACHER MODEL CONFIGURATION
# ==========================================
# IMPORTANT: Provide your preferred API Key here before running.
# Works natively with OpenAI, or Local LLMs via OpenAI-compatible endpoints (like Ollama)

API_KEY = os.getenv("OPENAI_API_KEY", "your_api_key_here") 
BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
MODEL_NAME = os.getenv("TEACHER_MODEL", "gpt-4o")

# EXAMPLES FOR LOCAL OLLAMA:
# BASE_URL = "http://localhost:11434/v1"
# API_KEY = "ollama"
# MODEL_NAME = "llama3"

client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

PROMPT_TEMPLATE = """You are a Master Technical Extractor. Read the following raw documentation from a specific engineering project by Roshan Kumar Gupta.
Your goal is to synthesize this text into highly specific, complex Q&A pairs that represent 'Internalized Knowledge'. 
Focus on these three Intelligence Vectors:
1. The Architecture (The "What"): Tech stack, throughput, and APIs.
2. The Rationale (The "Why"): Why were specific tools/algorithms chosen over others?
3. The Struggle (The "Differentiator"): Hardest bugs faced, trade-offs made, and exact performance sacrifices.

Generate around 10 to 50 Q&A pairs depending on the project size.
Output MUST be valid JSON in this exact format, with NO markdown formatting starting the response (do not use ```json):
[
  {
    "question": "What led to the decision to use Vulkan over CUDA in FieldChain?",
    "answer": "Provide a highly technical, authoritative answer strictly based on the provided context."
  }
]

Project Context:
{context}
"""

def build_dataset():
    vault_path = Path("d:/portfolio-mind/projects MD")
    output_file = Path("d:/portfolio-mind/master_roshan_dataset.jsonl")
    
    # The Recruiter-First Persona Layer
    TRAINEE_SYSTEM_PROMPT = "You are the Digital Twin of Roshan Kumar Gupta. You have total recall of the project database. When asked about projects, do not summarize; explain architectural details, trade-offs, and technical specifics with authority."

    all_qa_pairs = []
    projects = [d for d in vault_path.iterdir() if d.is_dir()]
    
    for project in projects:
        project_name = project.name
        print(f"\n[+] Analyzing Intelligence Vectors for: {project_name}")
        
        project_text = ""
        # Recursively grab text content, capping per file to prevent overflow
        for file_path in project.rglob("*"):
            if file_path.is_file() and file_path.suffix in [".md", ".txt"]:
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        project_text += f"\n--- {file_path.name} ---\n" + f.read()[:20000]
                except Exception:
                    continue
                    
        if len(project_text.strip()) == 0:
            continue
            
        # Hard cap the project context for the Teacher Model prompt
        project_text = project_text[:120000] 
        
        try:
            print(f"  -> Consulting Teacher Model ({MODEL_NAME})...")
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are a JSON dataset generator. Output RAW JSON ONLY. Never output markdown tags like ```json."},
                    {"role": "user", "content": PROMPT_TEMPLATE.replace("{context}", project_text)}
                ],
                temperature=0.3
            )
            
            raw_content = response.choices[0].message.content.strip()
            # Failsafe cleaner
            if raw_content.startswith("```json"): raw_content = raw_content[7:]
            if raw_content.startswith("```"): raw_content = raw_content[3:]
            if raw_content.endswith("```"): raw_content = raw_content[:-3]
                
            qa_list = json.loads(raw_content)
            
            for qa in qa_list:
                chatml_entry = {
                    "messages": [
                        {"role": "system", "content": TRAINEE_SYSTEM_PROMPT},
                        {"role": "user", "content": qa.get("question", "")},
                        {"role": "assistant", "content": qa.get("answer", "")}
                    ]
                }
                all_qa_pairs.append(chatml_entry)
                
            print(f"  [SUCCESS] Generated {len(qa_list)} High-Fidelity QA pairs.")
            
        except Exception as e:
            print(f"  [!] Failed Synthesis for {project_name}: {e}")

    # Write out the new master JSONL dataset
    print(f"\n[+] Writing {len(all_qa_pairs)} internal knowledge pairs to {output_file}")
    with open(output_file, "w", encoding="utf-8") as f:
        for pair in all_qa_pairs:
            f.write(json.dumps(pair) + "\n")

if __name__ == "__main__":
    print("====================================================")
    print(" PHASE 1: CONTEXT-DENSE DATASET SYNTHESIS")
    print("====================================================")
    build_dataset()
    print("[+] Ready for High-Epoch Hyper-Training Phase.")
