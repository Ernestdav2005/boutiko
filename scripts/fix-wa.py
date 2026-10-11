from pathlib import Path
import subprocess, sys
src = Path("src/index.js").read_text()
if "const wa = !!admin" not in src:
    needle = '    : "";\n\n\n  const SHOTS'
    if needle in src:
        src = src.replace(needle, '    : "";\n  const wa = !!admin;\n\n  const SHOTS', 1)
        print("added wa after contact")
    else:
        src = src.replace(
            "${wa ?", "${admin ?", 1
        )
        print("admin fallback")
Path("src/index.js").write_text(src)
r = subprocess.run(["node", "--check", "src/index.js"], capture_output=True, text=True)
print(r.stderr or "OK")
sys.exit(r.returncode)
