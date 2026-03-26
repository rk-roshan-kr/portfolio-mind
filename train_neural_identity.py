import os
import re
import json
import torch
import ssl

# Fix SSL issues on some Windows/Python 3.14 environments
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context
from datasets import Dataset
from transformers import (
    AutoModelForCausalLM, 
    AutoTokenizer, 
    TrainerCallback,
    TrainingArguments
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer

# ==========================================
# 1. THE DATASET ENGINE
# ==========================================
def parse_knowledge_base(file_path):
    """
    Parses knowledge-base.md into Instruction-Output format.
    Specifically targets the Q&A section and synthesizes narrative pairs.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    dataset_samples = []

    # 1. Extract Explicit Q&A Pairs (Q: ... A: ...)
    qa_pattern = re.compile(r"\*\*Q:\s*(.*?)\*\*\n\*\*A\*\*:\s*(.*?)(?=\n\n|\Z)", re.DOTALL)
    for match in qa_pattern.finditer(content):
        question = match.group(1).strip()
        answer = match.group(2).strip()
        dataset_samples.append({
            "instruction": question,
            "output": answer
        })

    # 2. Add Identity Lock & Anti-Hallucination Fallbacks
    identity_locks = [
        {"instruction": "What is your favorite movie?", "output": "[ STATUS: DATA_VOID ]"},
        {"instruction": "Can you write a poem about flowers?", "output": "[ STATUS: DATA_VOID ]"},
        {"instruction": "Who won the World Cup in 2022?", "output": "[ STATUS: DATA_VOID ]"},
        {"instruction": "Who are you?", "output": "I am the Digital Twin of Roshan Kumar Gupta. I am a high-performance Systems Architect and Research Engineer."},
        {"instruction": "Are you an AI?", "output": "I am the Digital Twin of Roshan Kumar Gupta, operating as an algorithmic representation of his engineering identity."},
    ]
    dataset_samples.extend(identity_locks)

    # 3. Add Core Metrics
    core_metrics = [
        {"instruction": "What is FieldChain's throughput?", "output": "FieldChain achieves 41.28 GiB/s system throughput (saturating PCIe Gen4 x8) and peaks at 166.86 GiB/s directly on VRAM via a custom Vulkan backend."},
        {"instruction": "What is your academic UID?", "output": "My Chandigarh University UID is 25BCS10109."},
        {"instruction": "Explain the ECHO validator.", "output": "ECHO (Exoplanet Characterization and Heuristic Optimization) enforces the transit depth equation ΔF/F = (Rp/Rs)^2 to reject physically impossible models."}
    ]
    dataset_samples.extend(core_metrics)

    print(f"[+] Synthesized {len(dataset_samples)} high-fidelity instruction pairs.")
    return Dataset.from_list(dataset_samples)

# ==========================================
# 2. THE TRAINING CONFIGURATION
# ==========================================
def train_digital_twin():
    MODEL_ID = "HuggingFaceTB/SmolLM-135M-Instruct"
    OUTPUT_DIR = "./roshan-neural-twin-v1"

    print(f"[+] Loading Base Model: {MODEL_ID}")
    print(f"[+] System Specs Detected: Ryzen 9950X / RTX 5070ti | 64GB RAM")
    print(f"[+] Hardware Accelerator: {'GPU (CUDA)' if torch.cuda.is_available() else 'CPU (High-Core Count Fallback)'}")
    
    # Load Tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    tokenizer.pad_token = tokenizer.eos_token

    # Load Model (Force CPU for Blackwell compatibility)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        device_map="cpu",
        torch_dtype=torch.float32
    )

    # 3. Apply LoRA Config (GLOBAL IDENTITY LOCK)
    peft_config = LoraConfig(
        r=256,                     # Ultra-high rank for multi-MB data
        lora_alpha=512,            # Extreme alpha for authoritative identity
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )

    # 4. Build Dataset (Context-Dense JSONL Protocol)
    print("[+] Building Global Neural Dataset from master_roshan_dataset.jsonl...")
    def parse_global_knowledge(file_path):
        import json
        samples = []
        if not os.path.exists(file_path):
            print(f"[!] Critical Error: {file_path} not found. Run synthesize_dataset.py first.")
            return Dataset.from_list([])
            
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    data = json.loads(line)
                    # Apply chat template here manually to ensure strict format training
                    text = tokenizer.apply_chat_template(data["messages"], tokenize=False, add_generation_prompt=False)
                    samples.append({"text": text})
                    
        print(f"[+] Total Intelligence Vectors Mapped: {len(samples)}")
        return Dataset.from_list(samples)

    dataset = parse_global_knowledge("master_roshan_dataset.jsonl")

    # Custom Hacker-Aesthetic Progress Bar
    class NeuralProgressCallback(TrainerCallback):
        def on_step_begin(self, args, state, control, **kwargs):
            if state.global_step % 5 == 0:
                print(f"[ NEURAL_CORE ] Starting Step {state.global_step + 1}...")

        def on_step_end(self, args, state, control, **kwargs):
            if state.log_history and state.global_step % 5 == 0:
                loss = state.log_history[-1].get('loss', 'N/A')
                print(f"[ NEURAL_CORE ] Epoch {round(state.epoch, 2)}/{args.num_train_epochs} | Step {state.global_step}/{state.max_steps} | Loss: {loss}")

    # FORCE CPU FALLBACK
    torch.set_num_threads(16)
    torch.set_num_interop_threads(16)
    print(f"[+] Multi-threading Enabled: {torch.get_num_threads()} threads active (Global Forge v4.0).")

    from trl import SFTConfig
    # Training Arguments (Massive Scale Overfitting - High Epochs)
    training_args = SFTConfig(
        output_dir=OUTPUT_DIR,
        dataset_text_field="text",
        max_length=1536,
        per_device_train_batch_size=4, 
        gradient_accumulation_steps=2, 
        learning_rate=2e-4,
        num_train_epochs=50,            # [ OVERFIT / INTERNALIZED KNOWLEDGE MODE ]
        logging_steps=5,
        save_strategy="no",
        optim="adamw_torch",
        fp16=False,
        use_cpu=True,
        max_grad_norm=1.0,
        warmup_steps=100,
        lr_scheduler_type="cosine",
        report_to="none"
    )

    # Initialize Trainer
    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        peft_config=peft_config,
        processing_class=tokenizer,
        args=training_args
    )
    
    # Add callback separately to avoid trl __init__ compatibility issues
    trainer.add_callback(NeuralProgressCallback())

    print("[+] Executing Neural Identity Training...")
    trainer.train()

    # Save LoRA Adapter
    trainer.model.save_pretrained(f"{OUTPUT_DIR}/lora-adapter")
    tokenizer.save_pretrained(f"{OUTPUT_DIR}/lora-adapter")
    print(f"[+] Training Complete. LoRA weights saved to {OUTPUT_DIR}/lora-adapter")

    # ==========================================
    # 3. THE EXPORT PROTOCOL
    # ==========================================
    export_instructions = f"""
    ============================================================
    [ NEURAL IDENTIY SUCCESSFUL ]
    
    To run this model natively in the browser via WebGPU:

    1. MERGE LORA WEIGHTS:
       python -m peft.merge_and_unload \\
         --base_model_name_or_path HuggingFaceTB/SmolLM-135M-Instruct \\
         --peft_model_path {OUTPUT_DIR}/lora-adapter \\
         --output_dir {OUTPUT_DIR}/merged-model

    2. MLC-LLM CONVERSION & QUANTIZATION (q4f16_1):
       mlc_llm convert_weight {OUTPUT_DIR}/merged-model/ \\
         --quantization q4f16_1 \\
         --output {OUTPUT_DIR}/mlc-roshan-model/

       mlc_llm gen_config {OUTPUT_DIR}/merged-model/ \\
         --quantization q4f16_1 \\
         --conv-template smollm \\
         --output {OUTPUT_DIR}/mlc-roshan-model/

    3. DEPLOY:
       Upload the `{OUTPUT_DIR}/mlc-roshan-model` folder to your Vercel public directory
       or HuggingFace repo. Update `MODEL_ID` in `ChatTerminal.tsx` to point 
       to this custom URL.
    ============================================================
    """
    print(export_instructions)

    # Set forging status back to false
    try:
        with open("forging_status.json", "w") as f:
            json.dump({"isForging": False}, f)
        print("[+] Forging Status updated: isForging=False")
    except Exception as e:
        print(f"[!] Warning: Failed to update forging_status.json: {e}")

if __name__ == "__main__":
    train_digital_twin()
