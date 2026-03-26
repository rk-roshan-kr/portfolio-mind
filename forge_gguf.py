import torch
from safetensors.torch import load_file
import gguf
import os
import json

MODEL_DIR = "./roshan-neural-twin-v1/merged-model"
GGUF_OUT = "./roshan-neural-twin-v1/roshan-native.gguf"

print(f"[+] Loading Merged Safetensors from {MODEL_DIR}...")
tensors = load_file(os.path.join(MODEL_DIR, "model.safetensors"))

# Load config for metadata
with open(os.path.join(MODEL_DIR, "config.json"), "r") as f:
    config = json.load(f)

# Initialize GGUF Writer
writer = gguf.GGUFWriter(GGUF_OUT, "llama")

# Add Metadata
writer.add_name("Roshan-Native-Digital-Twin")
# writer.add_architecture("llama") # Handled by constructor
writer.add_context_length(config.get("max_position_embeddings", 2048))
writer.add_embedding_length(config["hidden_size"])
writer.add_block_count(config["num_hidden_layers"])
writer.add_feed_forward_length(config["intermediate_size"])
writer.add_head_count(config["num_attention_heads"])
writer.add_head_count_kv(config.get("num_key_value_heads", config["num_attention_heads"]))
writer.add_layer_norm_rms_eps(config["rms_norm_eps"])
writer.add_rope_freq_base(config.get("rope_parameters", {}).get("rope_theta", 10000.0))

# Tokenizer metadata (Simplistic for SmolLM)
writer.add_tokenizer_model("llama")

print("[+] Adding Tensors to GGUF...")
for name, tensor in tensors.items():
    # Mapping HF Llama names to GGUF names
    new_name = name.replace("model.layers.", "blk.")
    new_name = new_name.replace("input_layernorm", "attn_norm")
    new_name = new_name.replace("post_attention_layernorm", "ffn_norm")
    new_name = new_name.replace("self_attn.q_proj", "attn_q")
    new_name = new_name.replace("self_attn.k_proj", "attn_k")
    new_name = new_name.replace("self_attn.v_proj", "attn_v")
    new_name = new_name.replace("self_attn.o_proj", "attn_output")
    new_name = new_name.replace("mlp.gate_proj", "ffn_gate")
    new_name = new_name.replace("mlp.up_proj", "ffn_up")
    new_name = new_name.replace("mlp.down_proj", "ffn_down")
    new_name = new_name.replace("model.embed_tokens", "token_embd")
    new_name = new_name.replace("model.norm", "output_norm")
    new_name = new_name.replace("lm_head", "output")
    
    # SmolLM specific cleanup if needed
    if new_name.startswith("model."):
        new_name = new_name[6:] # Strip 'model.'
        
    writer.add_tensor(new_name, tensor.float().numpy())

print(f"[+] Finalizing GGUF: {GGUF_OUT}")
writer.write_header_to_file()
writer.write_kv_data_to_file()
writer.write_tensors_to_file()
writer.close()

print("[ SUCCESS ] GGUF Forged. Run: ollama create roshan-native -f Modelfile")
