# VOLUME 01: FIELDCHAIN v2 (compersion)
## Wire-Speed Primitive for Energy-Efficient GPU Storage Integrity
### Author: Roshan Kumar Gupta | Department of Computer Science & Engineering, Chandigarh University
### Paper: *FieldChain: A Wire-Speed Primitive for Energy-Efficient Storage Integrity* (IEEE CCNCPS 2026 Dubai - Best Student Paper Award)

---

## 1. Executive Summary & Context

FieldChain is a GPU-accelerated storage integrity primitive designed to eliminate the cryptographic throughput bottleneck in modern high-performance storage arrays. By shifting cryptographic integrity from host CPUs to GPU compute pipelines, FieldChain achieves:
* **Peak Kernel Compute Bandwidth**: **`166.86 GiB/s`** on VRAM via a custom Vulkan compute shader backend, utilizing **86%** of theoretical device memory bandwidth.
* **Sustained System PCIe Throughput**: **`41.28 GiB/s`** on an NVIDIA RTX 4050, completely saturating PCIe Gen4 x8 interconnects.
* **Sequential Host Writes**: **`7 GB/s`** sequential writes into NVMe arrays, outperforming specialized SmartNIC/DPU accelerators (such as the NVIDIA BlueField-2 DPU at ~12.5 GiB/s) by **3.3× to 4.2×**.
* **Energy Efficiency**: **`688 MB/s/W`** (consuming only **7.1 J/GiB** compared to **153.8 J/GiB** for CPU-based SHA-256—a **21.6×** efficiency improvement).
* **Zero Corruption Escape**: 100% detection rate across **1,000,000 corruption injection trials** with only **0.4%** storage overhead (compared to 3–10% for traditional Merkle trees).

---

## 2. Problem Statement: The Silent Data Corruption Crisis

### 2.1 The Limitations of Existing Filesystem Checksums
Modern enterprise storage relies on filesystems like ZFS, Btrfs, or Ceph to detect bit rot, phantom writes, and silent data corruption:
1. **CRC32 / Fletcher4**: Extremely fast, but mathematically **malleable**. An attacker with disk access can modify data and deliberately calculate a compensating bit pattern that produces the identical CRC32 checksum.
2. **Cryptographic Checksums (SHA-256 / SHA3)**: Cryptographically secure, but prohibitively **CPU-bound**. A modern high-end Xeon CPU core struggles to process SHA-256 beyond **0.5–0.66 GiB/s per core** without taxing host CPUs needed for database query execution or VM scheduling.
3. **Merkle Trees**: Incur a **3% to 10% metadata amplification penalty** due to branch nodes and require recursive tree traversal, causing irregular, non-coalesced memory access patterns that cripple parallel hardware.
4. **Independent Block Hashing**: Treats each 4KB block as an isolated island. If an adversary silently reorders Block $A$ and Block $B$, or drops Block $C$ entirely, block-level checksums validate each individual block as pristine, completely missing the structural corruption of the overall file.

---

## 3. Mathematical Foundations & Theoretical Choices

### 3.1 Why the Prime Field $GF(2^{31} - 1)$? (The Mersenne Prime Trick)

Cryptographic primitives typically operate over either:
- **Galois Fields $GF(2^w)$** (requiring carry-less multiplication `PCLMULQDQ` or expensive Rijndael S-box lookups).
- **Large Prime Fields $GF(P)$** (e.g., $P = 2^{255} - 19$), which require multi-precision bignum arithmetic across multiple registers.

FieldChain selects the **Mersenne prime $P = 2^{31} - 1$** (the 8th Mersenne prime, $M_{31} = 2,147,483,647$).

#### The Fast Reduction Property:
For any Mersenne prime $P = 2^p - 1$, division modulo $P$ can be computed using bitwise shifts and additions without division instructions:
$$\text{If } X = A \cdot 2^p + B, \text{ then } X \equiv A + B \pmod{2^p - 1}$$

Because $2^{31} \equiv 1 \pmod{P}$, multiplying by powers of $2^{31}$ is mathematically equivalent to multiplication by $1$.
On a 32-bit GPU register architecture:
- Any 62-bit product $X$ can be split into high bits $X_{\text{hi}} = X \gg 31$ and low bits $X_{\text{lo}} = X \ \& \ (2^{31} - 1)$.
- The reduction is simply:
$$X \pmod{P} = (X_{\text{lo}} + X_{\text{hi}})$$
If the sum exceeds $P$, a single conditional subtraction of $P$ yields the exact result. This executes in **2 GPU clock cycles**, completely bypassing the multi-cycle integer division engine (`DIV`).

---

### 3.2 The 30-Bit Packing Solution: Eliminating Modulo Bias

#### Why 31-Bit Packing Fails (The Modulo Bias Trap)
If we pack 31 bits of raw data directly into the field element:
* The 31-bit integer space ranges from $[0, 2^{31} - 1]$.
* However, the prime field $GF(2^{31} - 1)$ only contains values in $[0, 2^{31} - 2]$.
* The maximum 31-bit value $2^{31} - 1$ is congruent to $0 \pmod{P}$:
$$2^{31} - 1 \equiv 0 \pmod{2^{31} - 1}$$
* This introduces **modulo aliasing**: the distinct binary states `0x00000000` and `0x7FFFFFFF` collapse to the identical field element `0`. An adversary could flip all 31 bits to 1, and the field arithmetic would register zero change.

#### The 30-Bit Resolution:
FieldChain strictly limits each field chunk to **30 bits**:
* A 30-bit integer strictly satisfies $0 \le x_k \le 2^{30} - 1 < 2^{31} - 1 = P$.
* Every unique bit sequence maps to a **strictly unique field element** with zero modulo bias.
* Furthermore, during field addition with keystream $K_N$:
$$x_k + K_N < 2^{30} + 2^{31} = 3 \cdot 2^{30} < 2^{32}$$
The sum fits completely inside a standard **unsigned 32-bit register (`uint32_t`)** with zero overflow before reduction!

#### The Pack $120 \to 4$ Algorithm:
To preserve byte alignment, FieldChain groups data into **120-bit chunks (15 bytes)** and maps them to **four 30-bit field elements**:
$$\text{Pack}_{120 \to 4}(b_0, \dots, b_{14}) \implies x_k = \sum_{j=0}^{3} b_{4k+j} \cdot 2^{8j} \pmod{2^{30}} \quad (k=0,1,2,3)$$
* **Storage Efficiency**: Uses 120 bits out of the theoretical 124-bit capacity ($4 \times 31$), achieving **96.7% packing efficiency** with mathematically zero bias.

---

### 3.3 Poly1305 Field Embedding: Zero-Overhead Authentication

A standard Poly1305 MAC tag is **128 bits**. Because our field elements are 30 bits:
$$\lceil 128 / 30 \rceil = 5 \text{ field elements}$$
* 5 field elements provide $5 \times 30 = 150\text{ bits}$ of storage.
* FieldChain embeds the 128-bit Poly1305 tag into the final **5 reserved check elements** of every 4KB block, padding the remaining $150 - 128 = 22\text{ bits}$ with deterministic zeros.
* **Storage Overhead Calculation**:
$$\text{Overhead} = \frac{5 \times 4 \text{ bytes}}{4096 \text{ bytes}} = \frac{20}{4096} \approx 0.488\% \ (< 0.5\%)$$
Compare this to:
- Merkle Trees: 3.5% to 10% metadata overhead.
- SHA-256 block footers: 32 bytes per 512 bytes = 6.25% overhead.

---

### 3.4 The Sequential Dependency Model vs All-or-Nothing (AONT)

In early prototypes (such as `compersion` / Field-AONT), we explored Rivest's All-or-Nothing Transform (AONT). However, we deliberately **abandoned AONT** for the production paper:
* **Why AONT Failed for Storage**: AONT requires buffering the entire file into memory before a single byte can be validated or decrypted. This makes random file seeking impossible and destroys streaming pipelines.
* **The Sequential Chaining Solution**:
$$\text{Pivot}_N = \text{BLAKE3}(\text{Pivot}_{N-1} \parallel \text{Hash}(C_N))$$
$$\text{Keystream } K_N = \text{ChaCha20}(\text{Pivot}_{N-1}, \text{Nonce} = N)$$
- If an adversary tampers with Block $i$, its ciphertext changes.
- $\text{Pivot}_i$ mutates unpredictably.
- Consequently, all subsequent keystreams $K_{i+1}, K_{i+2}, \dots$ are completely corrupted.
- Any attempt to read subsequent blocks produces random garbage, while preserving sequential streaming reads.

---

## 4. Systems Architecture & Hardware Sympathy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           HOST MEMORY (RAM)                             │
│       FIO Benchmark / Application Write Path (4KB Page Blocks)          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Direct Memory Access (DMA)
                                     ▼ PCIe Gen4 x8 (41.28 GiB/s)
┌─────────────────────────────────────────────────────────────────────────┐
│                      GPU VRAM (GDDR6) - RING BUFFER                     │
│   Structure-of-Arrays (SoA): Chunk0[N], Chunk1[N], Chunk2[N], Chunk3[N] │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Coalesced 128-byte Burst Reads
                                     ▼ 166.86 GiB/s
┌─────────────────────────────────────────────────────────────────────────┐
│                  VULKAN SPIR-V COMPUTE KERNEL PIPELINE                  │
│                                                                         │
│   [Stage 1: ChaCha20 Keystream Generation]                             │
│   • 32-bit register rotations (ROL) via native GPU ALU instructions    │
│                                                                         │
│   [Stage 2: Field-Packed Displacement GF(2^31 - 1)]                    │
│   • Single-cycle Mersenne addition: (X + K) mod (2^31 - 1)              │
│                                                                         │
│   [Stage 3: Poly1305 Horner Authentication]                            │
│   • Embedded into 5 reserved check elements (0.4% overhead)            │
│                                                                         │
│   [Stage 4: BLAKE3 Sequential Pivot Chaining]                          │
│   • Updates state vector for Block N+1 without host CPU roundtrip       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Direct Flush / P2P DMA
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       SAMSUNG 990 PRO NVMe ARRAY                        │
│                 Wire-Speed Tamper-Evident Storage Flush                 │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Why Vulkan SPIR-V Outperforms CUDA by 4× (166.86 GiB/s vs 41.28 GiB/s)

In our empirical evaluations on the RTX 3050:
- **CUDA Baseline**: 41.28 GiB/s
- **Vulkan SPIR-V Compute**: **166.86 GiB/s** (an extraordinary **4.04× speedup**)

Why did this occur?
1. **Driver Context Overhead**: CUDA runtime drivers insert hidden synchronization points, context checks, and unified memory page-table tracking overhead on every stream launch.
2. **Explicit Memory Barriers in Vulkan**: Vulkan uses `VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT` and explicit subpass barriers. The GPU execution pipeline never stalls waiting for host CPU acknowledgement.
3. **Instruction Fusing in SPIR-V**: The SPIR-V compiler aggressively fused our 30-bit bitshift extractions directly into the vector memory load operations (`OpLoad` with vector swizzling), executing the pack operation during memory fetch latency cycles.
4. **Memory Coalescence (Structure of Arrays)**:
   - Instead of Array of Structures (AoS: `[b0, b1, b2, b3], [b0, b1, b2, b3]`), we organized data in Structure of Arrays (SoA).
   - Thread $i$ in a warp reads from contiguous 128-byte cache lines simultaneously, achieving **100% bus utilization**.

---

## 5. Failure State Machine & Security Protocol

```
                        ┌───────────────────────┐
                        │     INITIAL STATE     │
                        │    System Streaming   │
                        └───────────┬───────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   VERIFICATION GATE   │
                        │ Poly1305 Tag Check &  │
                        │ Nonce Monotonic Check │
                        └───────┬───────┬───────┘
                                │       │
                 Mismatch / Rot │       │ Nonce < LastSeen
                                ▼       ▼
                   ┌──────────────────────────────────┐
                   │        CORRUPTION_DETECTED       │
                   │ • Pinned host flag flipped       │
                   │ • POSIX EIO raised immediately   │
                   │ • Pipeline frozen (Zero leak)    │
                   └──────────────────────────────────┘
```

1. **State 1 (Bit Rot / Corruption)**:
   - If a Poly1305 tag mismatch occurs, the GPU writes an error status word to pinned host memory.
   - The userspace driver immediately raises a standard POSIX `EIO` (Input/output error) and halts the pipeline.
   - Corrupted data is discarded; no corrupted block is ever committed to disk.
2. **State 2 (Replay Attack)**:
   - Nonces follow a strict 96-bit monotonic counter. If an incoming block has $\text{Nonce} \le \text{Last\_Seen\_Nonce}$, the system identifies a block injection/replay attempt and triggers an immediate panic.
3. **State 3 (Device Lost / Hardware Failure)**:
   - If the GPU encounters a PCIe bus reset or hardware timeout, the driver attempts a single idempotent re-submission before failing safely.

---

## 6. Empirical Benchmark Results & Ablation Studies

### 6.1 Hardware Scaling Across Architectures
| Hardware Platform | Interconnect | Backend | Sustained Throughput | Limiting Bottleneck |
| :--- | :--- | :--- | :--- | :--- |
| **NVIDIA Tesla T4** | PCIe Gen3 x16 | CUDA | **16.20 GiB/s** | PCIe Gen3 Interconnect |
| **NVIDIA RTX 3050** | PCIe Gen4 x8 | CUDA | **21.79 GiB/s** | CUDA Driver Overhead |
| **NVIDIA RTX 4050** | PCIe Gen4 x8 | CUDA | **41.28 GiB/s** | PCIe Gen4 Bus Saturation |
| **NVIDIA RTX 3050** | Internal VRAM | **Vulkan SPIR-V** | **166.86 GiB/s** | **GDDR6 Memory Bandwidth (86% of 192 GB/s)** |

### 6.2 Comparison with Standard Tools & Hardware Accelerators
| Solution | Execution Engine | Speed (GiB/s) | Relative Advantage of FieldChain |
| :--- | :--- | :--- | :--- |
| **OS `sha256sum`** | CPU (Native) | 0.66 GiB/s | **62.5× faster** |
| **`b3sum` (BLAKE3 SIMD)** | CPU (AVX-512) | 2.85 GiB/s | **14.5× faster** |
| **ZFS with Fletcher4** | CPU (Kernel) | 5.20 GiB/s | **7.9× faster** |
| **NVIDIA BlueField-2 DPU** | Specialized ASIC | ~12.5 GiB/s | **3.3× to 4.2× faster** |
| **FieldChain (Vulkan)** | Commodity GPU | **166.86 GiB/s** | **Reference Standard** |

---

## 7. Senior Interview & Defense Questions ("Grill Me")

### Q1: "Why not simply use AES-GCM with CPU AES-NI instructions?"
> **Roshan's Defense**: "While AES-NI is fast on an isolated core (~3–4 GB/s per core), scaling it to NVMe Gen4/Gen5 speeds (14–28 GB/s) requires dedicating **6 to 8 full server CPU cores** exclusively to cryptography. In cloud environments or high-throughput databases (like RocksDB or ClickHouse), CPU cycles are your most expensive resource. Offloading to an entry-level 65W GPU achieves 41.28 GiB/s while freeing up 100% of host CPU cycles for compute tasks, and reduces energy consumption from 153.8 J/GiB down to 7.1 J/GiB."

### Q2: "How does FieldChain handle random reads if blocks are sequentially chained?"
> **Roshan's Defense**: "FieldChain is architected as an **epoch-based chained primitive**. In append-only databases, write-ahead logs (WAL), and archival arrays, blocks are written sequentially. For random-access workloads, we segment files into **Checkpoint Superblocks** (e.g., every 64KB or 1MB). Random seeking navigates directly to the nearest superblock anchor key without needing to re-parse the entire historical chain from byte zero."

### Q3: "What prevents an adversary from recalculating the Poly1305 tag if they flip a bit on disk?"
> **Roshan's Defense**: "Poly1305 is a keyed universal hash function. Its evaluation key is derived from the ChaCha20 keystream, which itself is parameterized by the master key and the previous block's BLAKE3 pivot hash:
$$K_N = \text{ChaCha20}(\text{Pivot}_{N-1}, N)$$
Without the master key (safely stored in the hardware security module or host TPM), an adversary cannot compute the valid keystream, making it mathematically impossible to synthesize a valid replacement tag."
