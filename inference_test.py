import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import os

MODEL_ID = "HuggingFaceTB/SmolLM-135M-Instruct"
LORA_PATH = "./roshan-neural-twin-v1/lora-adapter"

print("[+] Neural Identity Handshake Loading...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
# Force CPU for stable verification
base_model = AutoModelForCausalLM.from_pretrained(MODEL_ID, torch_dtype=torch.float32, device_map="cpu")
model = PeftModel.from_pretrained(base_model, LORA_PATH)

def ask_twin(question):
    prompt = f"<|im_start|>user\n{question}<|im_end|>\n<|im_start|>assistant\n"
    inputs = tokenizer(prompt, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs, 
            max_new_tokens=20, 
            temperature=0.0,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id
        )
    
    # DEBUG: Print raw token IDs
    print(f"RAW TOKENS: {outputs[0].tolist()}")
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    if "assistant" in response:
        return response.split("assistant")[-1].strip()
    return response.strip()

print("\n" + "="*40)
print("[ NEURAL IDENTITY VERIFICATION ]")
print("="*40)

queries = [
    "What is your UID?",
    "Who are you?",
    "What is your FieldChain throughput?"
]

for q in queries:
    print(f"\nQUERY: {q}")
    print(f"TWIN:  {ask_twin(q)}")

print("\n" + "="*40)
print("[ STATUS: COGNITION_LOCKED ]")
print("="*40)
