from pathlib import Path
import subprocess, sys

src = Path("src/index.js").read_text()

src = src.replace(
    "Votre commerce merite une vitrine claire, serieuse et accessible a tous.",
    "Ouvrez une boutique en ligne en 5 minutes. Vos clients commandent sur WhatsApp.",
    1,
)
src = src.replace(
    "Boutiko aide les jeunes, les entrepreneurs et les entreprises a toucher plus de clients : une boutique en ligne a votre image, des modeles professionnels, des commandes directement sur WhatsApp.",
    "Choisissez un modele pro, ajoutez vos produits et votre logo. Partagez un lien. Recevez les commandes directement sur WhatsApp — sans application pour vos clients.",
    1,
)
src = src.replace(
    '>Voir les modeles</a>\n        <a class="hk-btn hk-btn-ghost hk-btn-lg" href="/app">Creer ma boutique</a>',
    '>Creer ma boutique — essai gratuit</a>\n        <a class="hk-btn hk-btn-ghost hk-btn-lg" href="#modeles">Voir les modeles</a>',
    1,
)

trust = '''
<section class="hk-trust" aria-label="Confiance">
  <div class="hk-shell hk-trust-in">
    <div class="hk-trust-item"><strong>7 jours</strong><span>d\'essai gratuit</span></div>
    <div class="hk-trust-item"><strong>WhatsApp</strong><span>commandes directes</span></div>
    <div class="hk-trust-item"><strong>0 app</strong><span>pour vos clients</span></div>
    <div class="hk-trust-item"><strong>Mobile</strong><span>et ordinateur</span></div>
  </div>
</section>
'''
marker = '<section class="hk-band hk-dark" id="pourquoi">'
if "hk-trust" not in src and marker in src:
    src = src.replace(marker, trust + "\n" + marker, 1)
    print("trust")

how = '''
<section class="hk-band" id="comment">
  <div class="hk-shell">
    <div class="hk-section-head">
      <p class="hk-eyebrow">Simple comme Shopify, pense pour WhatsApp</p>
      <h2>Trois etapes. Votre boutique est en ligne.</h2>
    </div>
    <div class="hk-steps">
      <div class="hk-step"><span class="hk-step-n">1</span><strong>Choisissez un modele</strong><p>Parcourez la galerie. Chaque modele est une vraie structure de boutique.</p></div>
      <div class="hk-step"><span class="hk-step-n">2</span><strong>Remplissez vos infos</strong><p>Nom, WhatsApp, logo, photos, produits. Rien de technique.</p></div>
      <div class="hk-step"><span class="hk-step-n">3</span><strong>Partagez le lien</strong><p>Vos clients ouvrent la vitrine et commandent sur WhatsApp.</p></div>
    </div>
  </div>
</section>
'''
marker2 = '<section class="hk-band" id="modeles">'
if "hk-steps" not in src and marker2 in src:
    src = src.replace(marker2, how + "\n" + marker2, 1)
    print("how")

faq = '''
<section class="hk-band hk-dark" id="faq">
  <div class="hk-shell">
    <div class="hk-section-head">
      <p class="hk-eyebrow">Questions frequentes</p>
      <h2>Tout ce qu\'il faut savoir avant de demarrer</h2>
    </div>
    <div class="hk-faq">
      <details class="hk-faq-item" open><summary>Faut-il savoir coder ?</summary><p>Non. Vous choisissez un modele, vous renseignez vos textes et photos. C\'est tout.</p></details>
      <details class="hk-faq-item"><summary>Comment mes clients commandent-ils ?</summary><p>Ils ouvrent votre lien boutique, choisissent un produit et envoient la commande sur WhatsApp. Pas d\'application a installer pour eux.</p></details>
      <details class="hk-faq-item"><summary>Puis-je commencer gratuitement ?</summary><p>Oui. ${TRIAL_DAYS} jours d\'essai. Vous testez avant de passer a une formule payante.</p></details>
      <details class="hk-faq-item"><summary>Quelle est la difference entre les formules ?</summary><p>Essentiel pour demarrer (produits limites, modeles simples). Standard pour l\'image de marque (logo, banniere). Pro pour les enseignes qui veulent un rendu premium et plus de produits.</p></details>
      <details class="hk-faq-item"><summary>Ca marche sur telephone ?</summary><p>Oui. L\'espace commercant et la boutique client sont optimises mobile. Vous pouvez aussi installer Boutiko comme application (PWA).</p></details>
    </div>
  </div>
</section>
'''
marker3 = '<section class="hk-cta">'
if "hk-faq" not in src and marker3 in src:
    src = src.replace(marker3, faq + "\n" + marker3, 1)
    print("faq")

if 'href="#comment"' not in src:
    src = src.replace(
        '<a href="#modeles">Modeles</a>',
        '<a href="#comment">Comment ca marche</a>\n      <a href="#modeles">Modeles</a>',
        1,
    )
    print("nav comment")

if 'id="hkMenuBtn"' not in src:
    src = src.replace(
        '<div class="hk-nav-cta">',
        '<button type="button" class="hk-menu-btn" id="hkMenuBtn" aria-label="Menu">☰</button>\n    <div class="hk-nav-cta">',
        1,
    )
    mobile_js = '''
<script>
(function(){
  var btn=document.getElementById('hkMenuBtn');
  var links=document.querySelector('.hk-nav-links');
  if(btn&&links){btn.addEventListener('click',function(){links.classList.toggle('open');});}
})();
</script>
'''
    if "links.classList.toggle" not in src:
        src = src.replace(
            "</footer>\n\n<script>\n(function(){\n  var root=document.querySelector('.tpl-marketplace');",
            "</footer>\n" + mobile_js + "\n<script>\n(function(){\n  var root=document.querySelector('.tpl-marketplace');",
            1,
        )
        print("mobile menu")

Path("src/index.js").write_text(src)

css = r'''
/* ===== LAUNCH READY (Shopify/SaaS structure) ===== */
.hk-trust {
  border-top: 1px solid #1f1f22; border-bottom: 1px solid #1f1f22;
  background: #0a0a0b; padding: 20px 0;
}
.hk-trust-in {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
}
@media (min-width: 720px) {
  .hk-trust-in { grid-template-columns: repeat(4, 1fr); gap: 20px; }
}
.hk-trust-item { text-align: center; }
.hk-trust-item strong {
  display: block; font-size: 1.15rem; color: #fff; font-weight: 800;
}
.hk-trust-item span { font-size: .82rem; color: #a1a1aa; }

.hk-steps {
  display: grid; gap: 16px; grid-template-columns: 1fr;
}
@media (min-width: 800px) {
  .hk-steps { grid-template-columns: 1fr 1fr 1fr; }
}
.hk-step {
  background: #18181b; border: 1px solid #27272a; border-radius: 16px;
  padding: 22px; position: relative;
}
.hk-step-n {
  display: inline-grid; place-items: center;
  width: 32px; height: 32px; border-radius: 10px;
  background: #fff; color: #0a0a0b; font-weight: 800; font-size: .9rem;
  margin-bottom: 12px;
}
.hk-step strong { display: block; color: #fff; margin-bottom: 8px; font-size: 1.05rem; }
.hk-step p { margin: 0; color: #a1a1aa; font-size: .95rem; }

.hk-faq { max-width: 720px; display: grid; gap: 10px; }
.hk-faq-item {
  background: #0a0a0b; border: 1px solid #27272a; border-radius: 14px;
  padding: 4px 16px;
}
.hk-faq-item summary {
  cursor: pointer; font-weight: 700; color: #fff;
  padding: 14px 0; list-style: none;
}
.hk-faq-item summary::-webkit-details-marker { display: none; }
.hk-faq-item summary::after { content: "+"; float: right; color: #a1a1aa; }
.hk-faq-item[open] summary::after { content: "–"; }
.hk-faq-item p { color: #a1a1aa; margin: 0 0 14px; line-height: 1.5; }

.hk-menu-btn {
  display: none; background: #18181b; border: 1px solid #27272a;
  color: #fff; border-radius: 10px; width: 42px; height: 42px;
  font-size: 1.2rem; cursor: pointer;
}
@media (max-width: 800px) {
  .hk-menu-btn { display: grid; place-items: center; }
  .hk-nav-links {
    display: none; position: absolute; top: 64px; left: 0; right: 0;
    background: #0a0a0b; border-bottom: 1px solid #1f1f22;
    flex-direction: column; padding: 12px 16px; z-index: 50;
  }
  .hk-nav-links.open { display: flex; }
  .hk-nav { position: sticky; }
  .hk-nav-in { position: relative; flex-wrap: wrap; }
  .hk-nav-cta .hk-btn-soft { display: none; }
}

body.hk-site .hk-btn-primary { box-shadow: 0 0 0 1px #fff; }
body.hk-site .hk-hero-copy h1 { max-width: 18ch; }
'''

sty = Path("src/client/style.txt").read_text()
m = "/* ===== LAUNCH READY"
if m in sty:
    sty = sty[:sty.find(m)].rstrip()
Path("src/client/style.txt").write_text(sty + "\n" + css)

r = subprocess.run(["node", "--check", "src/index.js"], capture_output=True, text=True)
if r.returncode:
    print(r.stderr)
    sys.exit(1)
print("OK launch-ready")
