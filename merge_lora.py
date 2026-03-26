import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

BASE_MODEL = "HuggingFaceTB/SmolLM-135M-Instruct"
LORA_ADAPTER = "./roshan-neural-twin-v1/lora-adapter"
MERGED_OUTPUT = "./roshan-neural-twin-v1/merged-model"

print(f"[+] Loading Base Model: {BASE_MODEL}")
base_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, torch_dtype=torch.float32, device_map="cpu")
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)

print(f"[+] Loading LoRA Adapter: {LORA_ADAPTER}")
model = PeftModel.from_pretrained(base_model, LORA_ADAPTER)

print("[+] Merging weights... This may take a moment.")
merged_model = model.merge_and_unload()

print(f"[+] Saving Merged Model to: {MERGED_OUTPUT}")
merged_model.save_pretrained(MERGED_OUTPUT)
tokenizer.save_pretrained(MERGED_OUTPUT)

print("[ SUCCESS ] Digital Twin Merged successfully.")
