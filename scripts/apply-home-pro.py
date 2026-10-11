from pathlib import Path
import subprocess, sys
home = "".join(Path(f"scripts/hf{i}.js").read_text() for i in range(10))
css = "".join(Path(f"scripts/hc{i}.css").read_text() for i in range(5))
assert "hk-nav" in home and "Connexion" in home
src = Path("src/index.js").read_text()
a = src.find("async function homePage")
b = src.find("\nfunction appPage", a)
if b < 0: b = src.find("\nasync function appPage", a)
assert a > 0 and b > a
Path("src/index.js").write_text(src[:a] + home.rstrip() + "\n\n" + src[b:])
sty = Path("src/client/style.txt").read_text()
m = "/* ===== ACCUEIL PRO NOIR"
if m in sty: sty = sty[:sty.find(m)].rstrip()
Path("src/client/style.txt").write_text(sty + "\n" + css)
r = subprocess.run(["node", "--check", "src/index.js"], capture_output=True, text=True)
if r.returncode:
    print(r.stderr); sys.exit(1)
print("OK")
