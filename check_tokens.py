from transformers import AutoTokenizer

MODEL_ID = "HuggingFaceTB/SmolLM-135M-Instruct"
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

tokens_to_check = ["<|im_start|>", "<|im_end|>", "<|user|>", "<|assistant|>", "<|system|>"]

print(f"--- Tokenizer Check for {MODEL_ID} ---")
for t in tokens_to_check:
    ids = tokenizer.encode(t, add_special_tokens=False)
    print(f"Token: {t:15} | IDs: {ids} | Single Token: {len(ids) == 1}")

print(f"PAD ID: {tokenizer.pad_token_id}")
print(f"EOS ID: {tokenizer.eos_token_id}")
print(f"BOS ID: {tokenizer.bos_token_id}")
