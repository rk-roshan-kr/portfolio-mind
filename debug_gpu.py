import torch
import sys

print(f"Python Version: {sys.version}")
print(f"Torch Version: {torch.__version__}")
print(f"CUDA Available: {torch.cuda.is_available()}")

if torch.cuda.is_available():
    print(f"GPU Name: {torch.cuda.get_device_name(0)}")
    print(f"Compute Capability: {torch.cuda.get_device_capability(0)}")
    
    # Try a simple tensor op
    try:
        x = torch.randn(10, 10).cuda()
        y = x @ x
        print("[ SUCCESS ] Basic CUDA operation works.")
    except Exception as e:
        print(f"[ FAILURE ] Basic CUDA operation failed: {e}")
else:
    print("[ FAILURE ] CUDA NOT FOUND.")
