from pathlib import Path
import subprocess, sys

src = Path("src/index.js").read_text()

old_ba = 'bodyAttrs: `class="sf-page sf-${planKey}" data-plan="${planKey}" data-slug="${esc(shop.slug)}" data-name="${name}" data-theme="${theme}" data-layout="${productLayout}"`'
new_ba = 'bodyAttrs: `class="sf-page sf-${planKey} sf-tpl-${esc(shop.template || "simple")}" data-plan="${planKey}" data-template="${esc(shop.template || "simple")}" data-slug="${esc(shop.slug)}" data-name="${name}" data-theme="${theme}" data-layout="${productLayout}"`'
if old_ba in src:
    src = src.replace(old_ba, new_ba, 1)
    print("shopPage template class")
else:
    print("WARN bodyAttrs")

old_img = '''          <img class="tpl-photo" src="${esc((SHOTS[tid]||SHOTS.simple))}" alt="${esc(t.label)}" loading="lazy" width="640" height="400" />
          <span class="tpl-preview-label">Apercu live</span>'''

new_preview = r'''          <div class="mock mock-${esc(tid)}" data-plan="${esc(pk)}">
            <div class="mock-top">
              <div class="mock-banner"></div>
              <div class="mock-logo"></div>
              <div class="mock-name"></div>
              <div class="mock-line"></div>
            </div>
            <div class="mock-body">
              <div class="mock-sec"></div>
              <div class="mock-prods"><i></i><i></i><i></i><i></i></div>
            </div>
            <span class="tpl-preview-label">Modele ${esc(t.label)}</span>
          </div>'''

if old_img in src:
    src = src.replace(old_img, new_preview, 1)
    print("preview mock")
else:
    print("WARN no tpl-photo card")

old_strip = '''  <section class="vis-strip" aria-hidden="true">
    <div class="vis-row">
      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" alt="" loading="lazy" />
      <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" alt="" loading="lazy" />
      <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" alt="" loading="lazy" />
      <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80" alt="" loading="lazy" />
      <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&q=80" alt="" loading="lazy" />
    </div>
  </section>'''

new_strip = '''  <section class="vis-strip">
    <div class="vis-row">
      <a class="vis-item" href="/modele/simple"><div class="mock mock-simple"><div class="mock-top"><div class="mock-banner"></div><div class="mock-logo"></div><div class="mock-name"></div></div><div class="mock-body"><div class="mock-prods"><i></i><i></i></div></div></div><span>Simple · Essentiel</span></a>
      <a class="vis-item" href="/modele/vitrine"><div class="mock mock-vitrine"><div class="mock-top"><div class="mock-banner"></div><div class="mock-logo"></div><div class="mock-name"></div></div><div class="mock-body"><div class="mock-prods"><i></i><i></i></div></div></div><span>Vitrine · Standard</span></a>
      <a class="vis-item" href="/modele/premium"><div class="mock mock-premium"><div class="mock-top"><div class="mock-banner"></div><div class="mock-logo"></div><div class="mock-name"></div></div><div class="mock-body"><div class="mock-prods"><i></i><i></i></div></div></div><span>Premium · Pro</span></a>
      <a class="vis-item" href="/modele/mode"><div class="mock mock-mode"><div class="mock-top"><div class="mock-banner"></div><div class="mock-logo"></div><div class="mock-name"></div></div><div class="mock-body"><div class="mock-prods"><i></i><i></i></div></div></div><span>Mode · Standard</span></a>
      <a class="vis-item" href="/modele/flagship"><div class="mock mock-flagship"><div class="mock-top"><div class="mock-banner"></div><div class="mock-logo"></div><div class="mock-name"></div></div><div class="mock-body"><div class="mock-prods"><i></i><i></i></div></div></div><span>Flagship · Pro</span></a>
    </div>
  </section>'''

if old_strip in src:
    src = src.replace(old_strip, new_strip, 1)
    print("strip")
else:
    print("WARN strip")

src = src.replace(
    "Comme sur Figma ou Shopify Themes : parcourez, filtrez par formule, ouvrez l'apercu, puis utilisez le modele.",
    "Chaque carte est un modele de boutique. Ouvrez l'exemple, choisissez-le : votre boutique prendra ce design. Vous n'aurez qu'a remplacer textes, photos et produits.",
    1,
)

Path("src/index.js").write_text(src)

css = r'''
/* APERCUS MODELES = mini-boutiques (pas photos hasard) */
.mock{position:relative;width:100%;aspect-ratio:16/10;background:#f4f4f5;overflow:hidden;border-radius:0}
.mock-top{padding:10px 12px 6px;position:relative}
.mock-banner{height:42%;min-height:48px;border-radius:8px;margin-bottom:8px}
.mock-logo{width:28px;height:28px;border-radius:8px;background:#fff;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.15);margin-top:-18px;margin-left:6px}
.mock-name{height:8px;width:42%;background:#d4d4d8;border-radius:4px;margin:8px 0 4px}
.mock-line{height:5px;width:28%;background:#e4e4e7;border-radius:3px}
.mock-body{padding:4px 12px 12px}
.mock-sec{height:6px;width:30%;background:#e4e4e7;border-radius:3px;margin-bottom:8px}
.mock-prods{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.mock-prods i{display:block;aspect-ratio:1;border-radius:8px;background:#e4e4e7}
.mock-simple .mock-banner{background:linear-gradient(135deg,#0f766e,#14b8a6)}
.mock-quartier .mock-banner{background:linear-gradient(135deg,#b45309,#f59e0b)}
.mock-express .mock-banner{background:linear-gradient(135deg,#334155,#64748b);min-height:28px;height:28%}
.mock-express .mock-logo{display:none}
.mock-vitrine .mock-banner{background:linear-gradient(135deg,#4c1d95,#7c3aed);height:50%}
.mock-catalogue .mock-banner{background:linear-gradient(135deg,#1e3a5f,#3b82f6);height:30%}
.mock-catalogue .mock-prods{grid-template-columns:1fr 1fr 1fr}
.mock-mode .mock-banner{background:linear-gradient(135deg,#831843,#ec4899);height:55%}
.mock-mode .mock-prods i{aspect-ratio:3/4}
.mock-premium .mock-banner{background:linear-gradient(135deg,#0f3d2e,#1a5c40);height:58%;border-radius:0;margin:-10px -12px 8px}
.mock-maison .mock-banner{background:linear-gradient(135deg,#1a1a1a,#525252);height:55%;border-radius:0;margin:-10px -12px 8px}
.mock-flagship .mock-banner{background:linear-gradient(135deg,#1e1b4b,#6366f1);height:60%;border-radius:0;margin:-10px -12px 8px}
.mock-premium .mock-name,.mock-maison .mock-name,.mock-flagship .mock-name{background:#a1a1aa;width:55%}
.tpl-shot{display:block;position:relative;overflow:hidden;background:#f4f4f5}
.tpl-preview-label{position:absolute;bottom:10px;right:10px;z-index:2;background:rgba(10,10,11,.9);color:#fff;font-size:.68rem;font-weight:700;padding:5px 10px;border-radius:999px}
.tpl-photo{display:none!important}
.vis-strip{background:#0a0a0b;padding:12px 0}
.vis-row{display:flex;gap:12px;padding:0 12px;overflow-x:auto;scroll-snap-type:x mandatory}
.vis-item{flex:0 0 auto;width:min(70vw,220px);text-decoration:none;color:#fff;scroll-snap-align:start}
.vis-item .mock{border-radius:14px;border:1px solid #27272a}
.vis-item span{display:block;font-size:.75rem;font-weight:650;margin-top:8px;color:#a1a1aa;text-align:center}
.sf-tpl-mode .sf-hero .sf-cover{min-height:220px}
.sf-tpl-premium .sf-hero,.sf-tpl-flagship .sf-hero,.sf-tpl-maison .sf-hero{min-height:280px}
.sf-tpl-express .sf-about{display:none}
.sf-tpl-catalogue .pgrid{grid-template-columns:repeat(3,1fr)}
@media(max-width:600px){.sf-tpl-catalogue .pgrid{grid-template-columns:repeat(2,1fr)}}
'''
sty = Path("src/client/style.txt").read_text()
m = "/* APERCUS MODELES"
if m in sty:
    sty = sty[:sty.find(m)].rstrip()
Path("src/client/style.txt").write_text(sty + "\n" + css)

r = subprocess.run(["node", "--check", "src/index.js"], capture_output=True, text=True)
if r.returncode:
    print(r.stderr)
    sys.exit(1)
print("OK")
