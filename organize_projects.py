import os
import shutil
from pathlib import Path

def organize_docs():
    base_source = Path("D:/")
    target_base = Path("d:/portfolio-mind/projects MD")
    
    # Exclude system and large non-project folders
    exclude_dirs = {
        "$RECYCLE.BIN", "System Volume Information", "venv-roshan", 
        "node_modules", ".git", "portfolio-mind", "brain", "AppData",
        "Local Settings", "Program Files", "Program Files (x86)"
    }
    
    # Noise patterns to skip in file names and paths
    noise_patterns = [
        "venv", ".venv", "Lib", "site-packages", "__pycache__", 
        "node_modules", ".next", ".git", "Tutorial", "Chapter", 
        "Lesson", "Course", "Homework", "Assignment", "Syllabus",
        "Notes-20", "Study"
    ]
    
    # Ensure target exists
    target_base.mkdir(parents=True, exist_ok=True)
    
    # Clean up existing noise first
    print("[+] Cleaning existing noise from target...")
    for f in target_base.rglob("*"):
        if f.is_file() and any(x.lower() in f.name.lower() for x in noise_patterns):
            try:
                f.unlink()
            except:
                pass

    print(f"[+] Scanning {base_source} for high-fidelity project clusters...")
    
    # Get top-level folders in D:/
    try:
        projects = [d for d in base_source.iterdir() if d.is_dir() and d.name not in exclude_dirs]
    except Exception as e:
        print(f"[!] Error accessing D:/: {e}")
        return

    for project in projects:
        project_name = project.name
        project_target = target_base / project_name
        
        print(f"  > Processing: {project_name}")
        
        # Count for feedback
        copied_count = 0
        
        # Recursive find high-fidelity assets
        extensions = ["*.md", "*.txt", "*.pdf", "*.tex"]
        for ext in extensions:
            for doc_file in project.rglob(ext):
                # Aggressive Noise Filtering
                if any(x.lower() in str(doc_file).lower() for x in noise_patterns):
                    continue
                
                # Skip massive files (e.g. log files masquerading as doc)
                try:
                    if doc_file.stat().st_size > 50 * 1024 * 1024: # Skip > 50MB
                        continue
                except:
                    continue

                # Create project subfolder ONLY if at least one doc file is found
                if not project_target.exists():
                    project_target.mkdir(parents=True, exist_ok=True)
                
                # Flatten name while maintaining structure info
                rel_path = doc_file.relative_to(project)
                safe_name = str(rel_path).replace(os.sep, "_")
                dest_file = project_target / safe_name
                
                try:
                    if not dest_file.exists(): # Don't re-copy if already exists correctly
                        shutil.copy2(doc_file, dest_file)
                        copied_count += 1
                except Exception as e:
                    pass
        
        if copied_count > 0:
            print(f"    [SUCCESS] Harnessed {copied_count} files.")
        else:
            # Cleanup empty directory if created but found nothing
            if project_target.exists() and not any(project_target.iterdir()):
                project_target.rmdir()

    print("\n[+] Documentation Vault Re-Organization Complete.")

if __name__ == "__main__":
    organize_docs()
