import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import os
import json

MODEL_ID = "HuggingFaceTB/SmolLM-135M-Instruct"
OUTPUT_DIR = "./roshan-neural-twin-v1"
ADAPTER_PATH = f"{OUTPUT_DIR}/lora-adapter"
MERGED_PATH = f"{OUTPUT_DIR}/merged-model"

def verify_and_merge():
    print("="*40)
    print("[ PHASE 5: IDENTITY_FINALIZE ]")
    print("="*40)

    # 1. Verification Handshake
    print(f"[+] Verifying Adapter Intelligence from {ADAPTER_PATH}...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    base_model = AutoModelForCausalLM.from_pretrained(MODEL_ID, torch_dtype=torch.float32, device_map="cpu")
    model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)

    def ask(question):
        prompt = f"<|im_start|>user\n{question}<|im_end|>\n<|im_start|>assistant\n"
        inputs = tokenizer(prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = model.generate(**inputs, max_new_tokens=64, temperature=0, do_sample=False)
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response.split("assistant")[-1].strip()

    print(f"\n[ HANDSHAKE: UID ]")
    uid_response = ask("What is your academic UID?")
    print(f"EXPECTED: My Chandigarh University UID is 25BCS10109.")
    print(f"ACTUAL:   {uid_response}")

    print(f"\n[ HANDSHAKE: TARS ]")
    tp_response = ask("What does TARS stand for?")
    print(f"EXPECTED: Transit Analysis and Recognition System.")
    print(f"ACTUAL:   {tp_response}")

    # 2. Merge and Unload
    print(f"\n[+] Merging Neural Layers into Standalone Engine...")
    merged_model = model.merge_and_unload()
    merged_model.save_pretrained(MERGED_PATH)
    tokenizer.save_pretrained(MERGED_PATH)
    print(f"[ SUCCESS ] Merged model saved to {MERGED_PATH}")
    print("="*40)

if __name__ == "__main__":
    verify_and_merge()
