import os
import glob

SOURCE_DIR = "D:/"
OUTPUT_FILE = "d:/portfolio-mind/knowledge-base.md"

# Directories to exclude
EXCLUDES = ['node_modules', '.git', '.next', 'venv', 'antigravity', '.gemini']

def harvest():
    print(f"[+] Starting Global Markdown Harvest in {SOURCE_DIR}...")
    
    # We'll collect files but limit by size to avoid crashing the trainer
    all_content = []
    
    # Start with the user's manual "knowledge-base copy.md" if it exists
    if os.path.exists("d:/portfolio-mind/knowledge-base copy.md"):
        print("[+] Ingesting Master Knowledge-Base (knowledge-base copy.md)...")
        with open("d:/portfolio-mind/knowledge-base copy.md", "r", encoding="utf-8", errors="ignore") as f:
            all_content.append(f.read())
            all_content.append("\n\n---\n\n")

    files_found = 0
    for root, dirs, files in os.walk(SOURCE_DIR):
        # Apply exclusions
        dirs[:] = [d for d in dirs if d not in EXCLUDES]
        
        for file in files:
            if file.endswith(".md") and "knowledge-base" not in file:
                file_path = os.path.join(root, file)
                try:
                    # Ignore files in temp/gemini dirs
                    if ".gemini" in file_path or "antigravity" in file_path:
                        continue
                        
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read().strip()
                        if len(content) > 100: # Ignore stubs
                            all_content.append(f"### SOURCE: {file_path}\n")
                            all_content.append(content)
                            all_content.append("\n\n---\n\n")
                            files_found += 1
                except Exception as e:
                    print(f"[!] Failed to read {file_path}: {e}")

    final_content = "".join(all_content)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(final_content)
        
    print(f"[ SUCCESS ] Harvested {files_found} files. Global Knowledge Base updated: {len(final_content)} bytes.")

if __name__ == "__main__":
    harvest()
