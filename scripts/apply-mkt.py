from pathlib import Path
import base64, re, subprocess, sys

def load(p):
    return base64.b64decode(Path(p).read_text().strip()).decode()

src = Path("src/index.js").read_text()
m = re.search(r"(?://[^\n]*\n)?const TEMPLATES = \{.*?\nfunction templateOf\(shop\) \{.*?\n\}\n", src, re.S)
if not m:
    m = re.search(r"const TEMPLATES = \{.*?\nfunction templateOf\(shop\) \{.*?\n\}\n", src, re.S)
assert m, "TEMPLATES not found"
src = src[: m.start()] + load("scripts/mkt-templates.b64").rstrip() + "\n" + src[m.end() :]
print("templates")

g0 = src.find("  const planLabel")
g1 = src.find("  const shops = pros")
assert g0 > 0 and g1 > g0, (g0, g1)
src = src[:g0] + load("scripts/mkt-gallery.b64").rstrip() + "\n  " + src[g1:]
print("gallery")

if "${modelCards}" in src:
    src = src.replace("${modelCards}", "${allCards}", 1)

src = src.replace("<h2>Nos modeles par formule</h2>", "<h2>Galerie de modeles</h2>", 1)

old_p = "Comme une collection de vitrines : regardez l'exemple, choisissez le modele qui vous ressemble, puis remplissez uniquement vos informations."
new_p = "Comme sur Figma ou Shopify Themes : parcourez, filtrez par formule, ouvrez l'apercu, puis utilisez le modele."
if old_p in src:
    src = src.replace(old_p, new_p, 1)

if "tpl-marketplace" not in src and "${allCards}" in src:
    src = src.replace("${allCards}", '<div class="tpl-marketplace">${allCards}</div>', 1)

if "tpl-filters" not in src and "tpl-marketplace" in src:
    src = src.replace(
        '<div class="tpl-marketplace">${allCards}</div>',
        '<div class="tpl-filters" role="tablist">'
        '<button type="button" class="on" data-filter="all">Tous</button>'
        '<button type="button" data-filter="essentiel">Essentiel</button>'
        '<button type="button" data-filter="standard">Standard</button>'
        '<button type="button" data-filter="pro">Pro</button>'
        '</div>'
        '<div class="tpl-marketplace">${allCards}</div>',
        1,
    )
    print("filters")

if "tpl-steps" not in src and "Comment ca marche" in src:
    src = src.replace(
        "<h2>Comment ca marche</h2>",
        "<h2>Comment creer votre boutique</h2>",
        1,
    )

if "tpl-filters" in src and "querySelectorAll('.tpl-filters" not in src:
    script = (
        "<script>(function(){var root=document.querySelector('.tpl-marketplace');"
        "if(!root)return;document.querySelectorAll('.tpl-filters button').forEach(function(btn){"
        "btn.addEventListener('click',function(){document.querySelectorAll('.tpl-filters button')"
        ".forEach(function(b){b.classList.remove('on');});btn.classList.add('on');"
        "var f=btn.getAttribute('data-filter');root.querySelectorAll('.tpl-card').forEach(function(card){"
        "card.hidden=(f!=='all'&&card.getAttribute('data-plan')!==f);});});});})();</script>"
    )
    src = src.replace("${shops}", "${shops}" + script, 1)
    print("script")

Path("src/index.js").write_text(src)
css = Path("src/client/style.txt").read_text()
if "tpl-marketplace" not in css:
    Path("src/client/style.txt").write_text(css.rstrip() + "\n" + load("scripts/mkt-css.b64"))
    print("css")

r = subprocess.run(["node", "--check", "src/index.js"], capture_output=True, text=True)
if r.returncode != 0:
    print(r.stderr)
    sys.exit(1)
print("OK")
