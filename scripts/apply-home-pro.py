from pathlib import Path
import base64, subprocess, sys

def load(prefix, n):
    return base64.b64decode("".join(Path(f"scripts/{prefix}{i}.b64").read_text().strip() for i in range(n))).decode()

# Will be updated with correct counts after chunks uploaded
home = load("hb", 15)
css = load("cb", 11)
assert "async function homePage" in home and "hp-nav" in home
src = Path("src/index.js").read_text()
a = src.find("async function homePage")
b = src.find("\nfunction appPage", a)
if b < 0:
    b = src.find("\nasync function appPage", a)
assert a > 0 and b > a, (a, b)
Path("src/index.js").write_text(src[:a] + home.rstrip() + "\n\n" + src[b:])
sty = Path("src/client/style.txt").read_text()
m = "/* ===== ACCUEIL PLATEFORME"
if m in sty:
    sty = sty[:sty.find(m)].rstrip()
Path("src/client/style.txt").write_text(sty + "\n" + css)
r = subprocess.run(["node", "--check", "src/index.js"], capture_output=True, text=True)
if r.returncode:
    print(r.stderr)
    sys.exit(1)
print("OK")
