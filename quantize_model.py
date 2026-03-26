import os
import sys

# Windows-specific: Add DLL directories for TVM and MLC-LLM
if sys.platform == "win32":
    tvm_path = r"d:\portfolio-mind\venv-roshan\Lib\site-packages\tvm"
    tvm_lib_path = r"d:\portfolio-mind\venv-roshan\Lib\site-packages\tvm\lib"
    msys_path = r"C:\msys64\mingw64\bin" # Potential source of GCC/PThread runtimes
    
    # Inject into PATH for dependency resolution
    os.environ["PATH"] = f"{tvm_path};{tvm_lib_path};{msys_path};" + os.environ["PATH"]
    os.environ["TVM_LIBRARY_PATH"] = tvm_lib_path
    
    # Use newer add_dll_directory API
    if os.path.exists(tvm_path): os.add_dll_directory(tvm_path)
    if os.path.exists(tvm_lib_path): os.add_dll_directory(tvm_lib_path)
    if os.path.exists(msys_path): os.add_dll_directory(msys_path)

# Crucial: Disable CUDA to prevent Blackwell initialization crashes on Windows
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

try:
    import mlc_llm
    from mlc_llm.cli import convert_weight, gen_config
    print("[+] MLC-LLM API found.")
except ImportError as e:
    print(f"[!] Error importing mlc_llm: {e}")
    sys.exit(1)

merged_model = "./roshan-neural-twin-v1/merged-model/"
output_path = "./roshan-neural-twin-v1/mlc-roshan-model/"

# Ensure output directory exists
os.makedirs(output_path, exist_ok=True)

print("[+] Starting WebGPU Weight Conversion (q4f16_1)...")
try:
    # Use the CLI-style call pattern as an API
    convert_weight.convert_weight(
        model=merged_model,
        quantization="q4f16_1",
        output=output_path
    )
    print("[+] Weights converted successfully.")

    print("[+] Generating WebGPU Configuration (smollm template)...")
    gen_config.gen_config(
        model=merged_model,
        quantization="q4f16_1",
        conv_template="smollm",
        output=output_path
    )
    print("[ SUCCESS ] Model quantized and configured for WebGPU.")
except Exception as e:
    print(f"[ ERROR ] Quantization failed: {e}")
    sys.exit(1)
