// ============================================================
//  BOUTIKO : plateforme de boutiques en ligne (commande WhatsApp)
//  Une seule application Cloudflare : site public, tableau de bord
//  commerçant, espace administrateur, base D1, photos R2.
// ============================================================
import qrcode from "qrcode-generator";
import STYLE_CSS from "./client/style.txt";
import APP_JS from "./client/app.txt";
import ADMIN_JS from "./client/admin.txt";
import SHOP_JS from "./client/shop.txt";

// ---------- Réglages ----------
const PLANS = {
  essentiel: { label: "Essentiel", price: 2000, products: 30, photos: 1, storageMb: 10, custom: false },
  standard: { label: "Standard", price: 5000, products: 100, photos: 3, storageMb: 60, custom: true },
  pro: { label: "Pro", price: 10000, products: 300, photos: 3, storageMb: 160, custom: true },
};

// Catalogue de modèles — extensible : ajouter une entrée ici + style CSS + aperçu /modele/:id
const TEMPLATES = {
  simple:{id:"simple",plan:"essentiel",label:"Boutique chaleureuse",tagline:"Une vitrine accueillante",desc:"Design doux et polyvalent pour présenter vos produits.",tags:["polyvalent","simple"]},
  quartier:{id:"quartier",plan:"essentiel",label:"Marché de proximité",tagline:"Le commerce près de chez vous",desc:"Une vitrine claire pour les commerces locaux et produits du quotidien.",tags:["local","marché"]},
  express:{id:"express",plan:"essentiel",label:"Boulangerie & frais",tagline:"Le goût du frais",desc:"Une présentation appétissante pour pains, pâtisseries et produits frais.",tags:["boulangerie","alimentaire"]},
  vitrine:{id:"vitrine",plan:"essentiel",label:"Beauté naturelle",tagline:"L'éclat au naturel",desc:"Un univers doux pour cosmétiques, soins et beauté.",tags:["beauté","soins"]},
  catalogue:{id:"catalogue",plan:"essentiel",label:"Tech & électronique",tagline:"La technologie au quotidien",desc:"Un catalogue moderne pour téléphones et accessoires.",tags:["tech","électronique"]},
  mode:{id:"mode",plan:"essentiel",label:"Mode & accessoires",tagline:"Votre style, vos règles",desc:"Une vitrine élégante pour vêtements, sacs et accessoires.",tags:["mode","style"]},
  premium:{id:"premium",plan:"essentiel",label:"Boutique élégante",tagline:"Le détail fait la différence",desc:"Une présentation raffinée pour les marques et collections.",tags:["élégant","marque"]},
  maison:{id:"maison",plan:"essentiel",label:"Maison & décoration",tagline:"Un intérieur qui vous ressemble",desc:"Une ambiance chaleureuse pour mobilier et décoration.",tags:["maison","déco"]},
  flagship:{id:"flagship",plan:"essentiel",label:"Grande vitrine",tagline:"Votre sélection en vedette",desc:"Une mise en page forte pour une boutique généraliste.",tags:["vitrine","catalogue"]},
  boulangerie:{id:"boulangerie",plan:"essentiel",label:"Boulangerie artisanale",tagline:"Préparé avec soin",desc:"Pour pains, viennoiseries, gâteaux et produits frais.",tags:["pain","frais"]},
  beaute:{id:"beaute",plan:"essentiel",label:"Beauté éclatante",tagline:"Le soin, autrement",desc:"Pour cosmétiques, huiles naturelles et soins.",tags:["beauté","naturel"]},
  marche:{id:"marche",plan:"essentiel",label:"Marché en ligne",tagline:"Vos essentiels au même endroit",desc:"Pour épiceries, marchés et commerces de proximité.",tags:["marché","épicerie"]},
  chaleureux:{id:"chaleureux",plan:"essentiel",label:"Tons chaleureux",tagline:"Une boutique qui donne envie",desc:"Des tons chaleureux pour artisanat, cadeaux et produits maison.",tags:["chaleureux","artisanat"]},
  lifestyle:{id:"lifestyle",plan:"essentiel",label:"Lifestyle moderne",tagline:"Le quotidien avec style",desc:"Pour accessoires, mode et produits tendance.",tags:["tendance","moderne"]},
  boutique:{id:"boutique",plan:"essentiel",label:"Boutique prête à vendre",tagline:"Présentez, partagez, vendez",desc:"Un modèle polyvalent pour lancer rapidement votre boutique.",tags:["vente","démarrage"]},
  collection:{id:"collection",plan:"essentiel",label:"Collection raffinée",tagline:"Une sélection qui vous ressemble",desc:"Pour collections choisies, cadeaux et produits premium.",tags:["collection","sélection"]},
};
const TEMPLATES_BY_PLAN = {
  essentiel: Object.keys(TEMPLATES),
  standard: Object.keys(TEMPLATES),
  pro: Object.keys(TEMPLATES),
};
function templateOf(shop) {
  const id = shop.template || (shop.plan === "pro" ? "premium" : shop.plan === "standard" ? "vitrine" : "simple");
  return TEMPLATES[id] || TEMPLATES.simple;
}
const TEMPLATE_IMAGES = {
  simple:"/simple.webp",
  quartier:"/quartier.webp",
  express:"/express.webp",
  vitrine:"/vitrine.webp",
  catalogue:"/catalogue.webp",
  mode:"/mode.webp",
  premium:"/premium.webp",
  maison:"/maison.webp",
  flagship:"/flagship.webp",
  boulangerie:"/boulangerie.webp",
  beaute:"/beaute.webp",
  marche:"/marche.webp",
  chaleureux:"/chaleureux.webp",
  lifestyle:"/lifestyle.webp",
  boutique:"/boutique.webp",
  collection:"/collection.webp",
};
const TEMPLATE_ART = {
  simple:{bg:"#f4eee5",accent:"#bc7654",ink:"#29251f",title:"BOUTIQUE CHALEUREUSE",subtitle:"La simplicité qui vend",shape:"fashion"},
  quartier:{bg:"#e8f3e9",accent:"#24704c",ink:"#163d2d",title:"MON COMMERCE",subtitle:"Tout près de vous",shape:"market"},
  express:{bg:"#fff0d8",accent:"#c85b32",ink:"#512b20",title:"FRAIS DU JOUR",subtitle:"Préparé avec soin",shape:"food"},
  vitrine:{bg:"#f8e9eb",accent:"#b96e7b",ink:"#4c2933",title:"RITUEL BEAUTÉ",subtitle:"Le soin, autrement",shape:"beauty"},
  catalogue:{bg:"#e7edf8",accent:"#3158a5",ink:"#16264c",title:"TECH & STYLE",subtitle:"La technologie au quotidien",shape:"tech"},
  mode:{bg:"#f3e8dc",accent:"#9a543d",ink:"#38241f",title:"NOUVELLE ALLURE",subtitle:"Votre style. Vos règles.",shape:"fashion"},
  premium:{bg:"#171717",accent:"#d7b46a",ink:"#f7ecd5",title:"ATELIER DORÉ",subtitle:"Le détail fait la différence",shape:"jewelry"},
  maison:{bg:"#eee7da",accent:"#8b7355",ink:"#3f382f",title:"MAISON CALME",subtitle:"Des espaces qui vous ressemblent",shape:"home"},
  flagship:{bg:"#e8eef0",accent:"#ef684e",ink:"#18313b",title:"LA SÉLECTION",subtitle:"Tout ce que vous aimez",shape:"market"},
  boulangerie:{bg:"#fff0d8",accent:"#c85b32",ink:"#512b20",title:"BOULANGERIE",subtitle:"Le goût du frais",shape:"food"},
  beaute:{bg:"#f8e9eb",accent:"#b96e7b",ink:"#4c2933",title:"BEAUTÉ NATURELLE",subtitle:"L'éclat au naturel",shape:"beauty"},
  marche:{bg:"#e8f3e9",accent:"#24704c",ink:"#163d2d",title:"MON MARCHÉ",subtitle:"La fraîcheur près de vous",shape:"market"},
  chaleureux:{bg:"#f3e8dc",accent:"#9a543d",ink:"#38241f",title:"TONS CHALEUREUX",subtitle:"Une boutique accueillante",shape:"home"},
  lifestyle:{bg:"#f3e8dc",accent:"#9a543d",ink:"#38241f",title:"LIFESTYLE",subtitle:"Le quotidien avec style",shape:"fashion"},
  boutique:{bg:"#e7edf8",accent:"#3158a5",ink:"#16264c",title:"PRÊTE À VENDRE",subtitle:"Présentez. Partagez. Vendez.",shape:"market"},
  collection:{bg:"#171717",accent:"#d7b46a",ink:"#f7ecd5",title:"COLLECTION",subtitle:"Une sélection raffinée",shape:"jewelry"},
};
function templateArtwork(id, variant = "cover", item = 0) {
  const a = TEMPLATE_ART[id] || TEMPLATE_ART.simple;
  const productTitles = {
    simple:["Chemise essentielle","Sac du quotidien","Look de saison"],
    quartier:["Sélection locale","Produit populaire","Nouveauté du jour"],
    express:["Pain artisanal","Pâtisserie maison","Panier gourmand"],
    vitrine:["Soin éclat","Routine beauté","Huile précieuse"],
    catalogue:["Écouteurs sans fil","Montre connectée","Accessoire tech"],
    mode:["Tenue signature","Style du jour","Accessoire textile"],
    premium:["Boucles dorées","Collier signature","Bracelet raffiné"],
    maison:["Objet décoratif","Vase naturel","Lampe design"],
    flagship:["Sélection tendance","Accessoire premium","Collection du moment"],
  };
  const title = variant === "product" ? (productTitles[id] || productTitles.simple)[item % 3] : a.title;
  const productShapes = {
    food:`<ellipse cx="600" cy="390" rx="190" ry="150" fill="#fff9ee"/><ellipse cx="600" cy="390" rx="138" ry="100" fill="#e3ad62"/><path d="M500 385q45-95 100 0t100 0" fill="none" stroke="#9b542f" stroke-width="22" stroke-linecap="round"/><circle cx="560" cy="350" r="13" fill="#9b542f"/><circle cx="650" cy="420" r="13" fill="#9b542f"/>`,
    beauty:`<rect x="500" y="230" width="170" height="290" rx="30" fill="#f8d8d8"/><rect x="535" y="170" width="100" height="75" rx="12" fill="#d8b8a1"/><rect x="520" y="330" width="130" height="75" rx="8" fill="#fff8f2"/><circle cx="585" cy="366" r="20" fill="#c17b85"/><path d="M710 280q80 100 0 190q-80-90 0-190" fill="#c17b85"/>`,
    tech:`<rect x="490" y="180" width="190" height="330" rx="34" fill="#172a4a"/><rect x="505" y="200" width="160" height="285" rx="22" fill="#b7d5ee"/><circle cx="585" cy="450" r="12" fill="#172a4a"/><path d="M535 300l45-45 40 45-40 45z" fill="#3158a5"/>`,
    jewelry:`<circle cx="600" cy="365" r="135" fill="none" stroke="#d7b46a" stroke-width="20"/><circle cx="600" cy="365" r="42" fill="#f7ecd5"/><path d="M600 405l-60 110h120z" fill="#d7b46a"/><circle cx="600" cy="365" r="19" fill="#fff8df"/>`,
    home:`<path d="M440 350l160-135 160 135v175H440z" fill="#c9b59b"/><rect x="565" y="390" width="70" height="135" fill="#806d56"/><rect x="470" y="380" width="65" height="55" rx="5" fill="#e8dccc"/><rect x="665" y="380" width="65" height="55" rx="5" fill="#e8dccc"/><circle cx="760" cy="280" r="45" fill="#9caa8b"/>`,
    market:`<path d="M440 320h320l-35-90H475z" fill="#ef684e"/><rect x="470" y="320" width="260" height="200" rx="12" fill="#fff9f1"/><rect x="520" y="375" width="70" height="145" fill="#d6e1d8"/><rect x="615" y="370" width="75" height="65" fill="#c5d9e4"/><path d="M440 320h320" stroke="#18313b" stroke-width="12"/>`,
    fashion:`<path d="M555 230l45 35 45-35 80 75-55 65-30-25v180H515V345l-30 25-55-65z" fill="#d2a48b"/><path d="M575 250q25 50 50 0" fill="none" stroke="#8e5c4a" stroke-width="9"/><circle cx="600" cy="325" r="15" fill="#f3e8dc"/>`,
  };
  const shape = productShapes[a.shape] || productShapes.market;
  const backdrop = variant === "product" ? `<rect x="0" y="0" width="1000" height="700" fill="${a.bg}"/>` : `<rect width="1000" height="700" fill="${a.bg}"/><circle cx="790" cy="100" r="250" fill="${a.accent}" opacity=".16"/><circle cx="160" cy="620" r="230" fill="${a.accent}" opacity=".12"/>`;
  const labels = variant === "product" ? `<text x="65" y="600" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="${a.ink}">${title}</text><text x="65" y="650" font-family="Arial,sans-serif" font-size="25" fill="${a.ink}" opacity=".7">Sélection Boutiko</text>` : `<text x="70" y="120" font-family="Arial,sans-serif" font-size="25" letter-spacing="6" fill="${a.accent}" font-weight="700">BOUTIKO  /  MODÈLE</text><text x="70" y="500" font-family="Georgia,serif" font-size="62" font-weight="700" fill="${a.ink}">${title}</text><text x="72" y="550" font-family="Arial,sans-serif" font-size="25" fill="${a.ink}" opacity=".8">${a.subtitle}</text><rect x="70" y="590" width="190" height="5" rx="2" fill="${a.accent}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" role="img" aria-label="${title}">${backdrop}<g transform="translate(0,0)">${shape}</g>${labels}</svg>`;
}
const TRIAL_DAYS = 7;

async function platformConfig(env) {
  const rows = await env.DB.prepare("SELECT key, value FROM platform_settings").all();
  const settings = Object.fromEntries(rows.results.map((r) => [r.key, r.value]));
  const plans = Object.fromEntries(Object.entries(PLANS).map(([k, v]) => [k, { ...v }]));
  for (const key of Object.keys(plans)) for (const field of ["price", "products", "photos", "storageMb"]) {
    const raw = settings[field + "_" + key];
    if (raw !== undefined && raw !== "" && Number.isFinite(Number(raw))) plans[key][field] = Math.max(field === "price" ? 0 : 1, Math.min(field === "price" ? 10000000 : 10000, Math.floor(Number(raw))));
  }
  const trialRaw = Number(settings.trialDays);
  const trialDays = settings.trialDays !== undefined && Number.isFinite(trialRaw) ? Math.max(0, Math.min(60, Math.floor(trialRaw))) : TRIAL_DAYS;
  return { settings, plans, trialDays };
}
const SESSION_DAYS = 30;
const PBKDF2_ITER = 10000; // volontairement modéré : limite de 10 ms de calcul par requête (offre gratuite)
const MAX_IMG_BYTES = 600 * 1024;
const MAX_ORDERS_PER_HOUR = 12;
const RESERVED = new Set([
  "app", "admin", "proprietaire", "owner", "api", "img", "qr", "style.css", "app.js", "admin.js", "shop.js", "favicon.ico",
  "robots.txt", "sitemap.xml", "login", "register", "aide", "modele", "www", "assets", "static",
]);

// Empreinte simple du contenu des fichiers pour le cache navigateur
function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
const V = { css: hashStr(STYLE_CSS), app: hashStr(APP_JS), admin: hashStr(ADMIN_JS), shop: hashStr(SHOP_JS) };
const PWA_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#27338f"/><path d="M64 178h384v42H64z" fill="#f5a623"/><path d="M64 220h384v30H64z" fill="#fff"/><path d="M64 250h384v42H64z" fill="#f5a623"/><path d="M98 292h316v112H98z" fill="#fff"/><path d="M128 320h50v56h-50zm103 0h50v56h-50zm103 0h50v56h-50z" fill="#27338f"/><path d="M64 178 100 118h312l36 60z" fill="#fff"/><text x="256" y="455" font-size="42" font-family="Arial,sans-serif" font-weight="800" text-anchor="middle" fill="#fff">BOUTIKO</text></svg>`;
const PWA_SW = `const CACHE="boutiko-shell-v3";
const SHELL=["/style.css","/app.js","/icon.svg","/manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==self.location.origin)return;
  if(u.pathname.startsWith("/api/")||u.pathname.startsWith("/img/")||u.pathname.startsWith("/admin")||u.pathname.startsWith("/proprietaire")||u.pathname.startsWith("/owner"))return;
  if(u.pathname==="/"||u.pathname==="/app"||u.pathname.startsWith("/modele")||e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  if(SHELL.includes(u.pathname)){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request)));
  }
});`

// ---------- Base de données : création automatique ----------
const SCHEMA = [
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, phone TEXT UNIQUE NOT NULL, pass TEXT NOT NULL, is_admin INTEGER DEFAULT 0, created_at INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS shops(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, business_name TEXT DEFAULT '', brand_name TEXT DEFAULT '', slogan TEXT DEFAULT '', description TEXT DEFAULT '', whatsapp TEXT NOT NULL, color TEXT DEFAULT '#0f766e', address TEXT DEFAULT '', maps_url TEXT DEFAULT '', hours TEXT DEFAULT '', momo TEXT DEFAULT '', logo_id INTEGER, banner_id INTEGER, gallery TEXT DEFAULT '[]', theme TEXT DEFAULT 'editorial', layout TEXT DEFAULT 'grid', plan TEXT DEFAULT 'essentiel', status TEXT DEFAULT 'active', paid_until INTEGER, quick_replies TEXT DEFAULT '', created_at INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER NOT NULL, name TEXT NOT NULL, description TEXT DEFAULT '', price INTEGER NOT NULL, promo_price INTEGER, stock INTEGER, active INTEGER DEFAULT 1, photos TEXT DEFAULT '[]', created_at INTEGER NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_products_shop ON products(shop_id)",
  "CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER NOT NULL, product_id INTEGER, product_name TEXT NOT NULL, qty INTEGER NOT NULL, unit_price INTEGER NOT NULL, status TEXT DEFAULT 'pending', source TEXT DEFAULT 'web', ip TEXT, created_at INTEGER NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_orders_shop ON orders(shop_id, status, created_at)",
  "CREATE INDEX IF NOT EXISTS idx_orders_ip ON orders(ip, created_at)",
  "CREATE TABLE IF NOT EXISTS media(id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER NOT NULL, r2_key TEXT NOT NULL, bytes INTEGER NOT NULL, kind TEXT NOT NULL, product_id INTEGER, created_at INTEGER NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_media_shop ON media(shop_id)",
  "CREATE TABLE IF NOT EXISTS stats(shop_id INTEGER NOT NULL, day TEXT NOT NULL, visits INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, PRIMARY KEY(shop_id, day))",
  "CREATE TABLE IF NOT EXISTS login_fails(phone TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS platform_settings(key TEXT PRIMARY KEY, value TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS platform_assets(kind TEXT PRIMARY KEY, r2_key TEXT NOT NULL, content_type TEXT NOT NULL, updated_at INTEGER NOT NULL)",
];
let schemaReady = null;
function ensureSchema(env) {
  if (!schemaReady) {
    schemaReady = env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).then(async () => {
      // Migrations compatibles avec la base existante : aucune donnée n'est supprimée.
      const info = await env.DB.prepare("PRAGMA table_info(shops)").all();
      const columns = new Set(info.results.map((c) => c.name));
      if (!columns.has("gallery")) await env.DB.prepare("ALTER TABLE shops ADD COLUMN gallery TEXT DEFAULT '[]'").run();
      if (!columns.has("theme")) await env.DB.prepare("ALTER TABLE shops ADD COLUMN theme TEXT DEFAULT 'editorial'").run();
      if (!columns.has("business_name")) await env.DB.prepare("ALTER TABLE shops ADD COLUMN business_name TEXT DEFAULT ''").run();
      if (!columns.has("brand_name")) await env.DB.prepare("ALTER TABLE shops ADD COLUMN brand_name TEXT DEFAULT ''").run();
      if (!columns.has("slogan")) await env.DB.prepare("ALTER TABLE shops ADD COLUMN slogan TEXT DEFAULT ''").run();
      if (!columns.has("layout")) await env.DB.prepare("ALTER TABLE shops ADD COLUMN layout TEXT DEFAULT 'grid'").run();
      if (!columns.has("template")) await env.DB.prepare("ALTER TABLE shops ADD COLUMN template TEXT DEFAULT 'simple'").run();
    }).catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  return schemaReady;
}

// ---------- Outils ----------
const now = () => Math.floor(Date.now() / 1000);
const dayStr = (offsetDays = 0) => new Date(Date.now() + 3600000 - offsetDays * 86400000).toISOString().slice(0, 10); // heure du Bénin (UTC+1)
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fcfa = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const hex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
const randomHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}
function html(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache", ...headers },
  });
}
const fail = (msg, status = 400) => json({ error: msg }, status);

async function sha256Hex(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return hex(new Uint8Array(d));
}

async function pbkdf2(password, saltHex, iter) {
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: iter }, key, 256);
  return hex(new Uint8Array(bits));
}
async function hashPassword(password) {
  const salt = randomHex(16);
  return `pbkdf2$${PBKDF2_ITER}$${salt}$${await pbkdf2(password, salt, PBKDF2_ITER)}`;
}
async function verifyPassword(password, stored) {
  const [kind, iter, salt, h] = String(stored).split("$");
  if (kind !== "pbkdf2") return false;
  return (await pbkdf2(password, salt, parseInt(iter, 10))) === h;
}

// Numéro WhatsApp : chiffres uniquement, indicatif du Bénin (229) ajouté si absent
function normalizePhone(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("229")) return d;
  if (d.length === 10 && d.startsWith("01")) return "229" + d;
  if (d.length === 8) return "22901" + d;
  return d;
}
const validPhone = (p) => /^\d{8,15}$/.test(p);

function slugify(name) {
  const s = String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30)
    .replace(/-+$/g, "");
  return s || "boutique";
}
async function uniqueSlug(env, name) {
  let base = slugify(name);
  if (RESERVED.has(base)) base = base + "-shop";
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const row = await env.DB.prepare("SELECT 1 x FROM shops WHERE slug=?").bind(slug).first();
    if (!row) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${randomHex(3)}`;
}

function cookieOf(request, name) {
  const c = request.headers.get("cookie") || "";
  for (const part of c.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}
function sessionCookie(request, token, maxAge, cookieName = "sid") {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  const sameSite = cookieName === "owner_sid" ? "Strict" : "Lax";
  return `${cookieName}=${token}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secure}`;
}

async function getAuth(request, env) {
  const token = cookieOf(request, "sid");
  if (!token || !/^[a-f0-9]{48}$/.test(token)) return null;
  const row = await env.DB.prepare(
    "SELECT u.id, u.phone, u.is_admin, s.expires FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?"
  )
    .bind(token)
    .first();
  if (!row || row.expires < now()) return null;
  const shop = await env.DB.prepare("SELECT * FROM shops WHERE user_id=?").bind(row.id).first();
  if (shop && shop.status === "blocked" && !row.is_admin) return null; // compte bloqué par l'administrateur
  return { user: { id: row.id, phone: row.phone, is_admin: !!row.is_admin }, shop };
}

async function getOwnerAuth(request, env) {
  const token = cookieOf(request, "owner_sid");
  if (!token || !/^[a-f0-9]{48}$/.test(token)) return null;
  const row = await env.DB.prepare(
    "SELECT u.id, u.phone, u.is_admin, s.expires FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?"
  ).bind(token).first();
  if (!row || row.expires < now() || !row.is_admin) return null;
  const shop = await env.DB.prepare("SELECT * FROM shops WHERE user_id=?").bind(row.id).first();
  return { user: { id: row.id, phone: row.phone, is_admin: true }, shop };
}
async function startOwnerSession(request, env, userId) {
  const token = randomHex(24);
  await env.DB.prepare("DELETE FROM sessions WHERE expires<?").bind(now()).run();
  await env.DB.prepare("INSERT INTO sessions(token, user_id, expires) VALUES(?,?,?)").bind(token, userId, now() + SESSION_DAYS * 86400).run();
  return json({ ok: true, owner: true }, 200, { "set-cookie": sessionCookie(request, token, SESSION_DAYS * 86400, "owner_sid") });
}
async function apiAdminLogin(request, env) {
  const b = await readJson(request);
  if (!b) return fail("Requête invalide");
  const phone = normalizePhone(b.phone);
  const f = await env.DB.prepare("SELECT * FROM login_fails WHERE phone=?").bind(phone).first();
  if (f && f.until > now()) return fail("Trop d'essais. Réessayez dans quelques minutes.", 429);
  const u = await env.DB.prepare("SELECT * FROM users WHERE phone=? AND is_admin=1").bind(phone).first();
  const ok = u && (await verifyPassword(String(b.password || ""), u.pass));
  if (!ok) {
    const c = (f ? f.count : 0) + 1;
    await env.DB.prepare("INSERT INTO login_fails(phone,count,until) VALUES(?,?,?) ON CONFLICT(phone) DO UPDATE SET count=excluded.count, until=excluded.until")
      .bind(phone, c, c >= 8 ? now() + 900 : 0).run();
    return fail("Identifiants propriétaire incorrects.", 401);
  }
  if (f) await env.DB.prepare("DELETE FROM login_fails WHERE phone=?").bind(phone).run();
  return startOwnerSession(request, env, u.id);
}
async function apiAdminLogout(request, env) {
  const token = cookieOf(request, "owner_sid");
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token=?").bind(token).run();
  return json({ ok: true }, 200, { "set-cookie": sessionCookie(request, "", 0, "owner_sid") });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
const str = (v, max) => String(v ?? "").trim().slice(0, max);
function intOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : NaN;
}
function parseIds(json) {
  try {
    const a = JSON.parse(json || "[]");
    return Array.isArray(a) ? a.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

function openStatus(hoursJson) {
  let h;
  try {
    h = JSON.parse(hoursJson);
  } catch {
    return null;
  }
  if (!h || !/^\d\d:\d\d$/.test(h.open || "") || !/^\d\d:\d\d$/.test(h.close || "")) return null;
  const d = new Date(Date.now() + 3600000);
  const day = d.getUTCDay();
  const mins = d.getUTCHours() * 60 + d.getUTCMinutes();
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const days = Array.isArray(h.days) ? h.days : [0, 1, 2, 3, 4, 5, 6];
  const open = days.includes(day) && mins >= oh * 60 + om && mins < ch * 60 + cm;
  return { open, text: `${h.open} – ${h.close}` };
}

async function bumpStat(env, shopId, visits, clicks) {
  await env.DB.prepare(
    "INSERT INTO stats(shop_id, day, visits, clicks) VALUES(?,?,?,?) ON CONFLICT(shop_id, day) DO UPDATE SET visits=visits+excluded.visits, clicks=clicks+excluded.clicks"
  )
    .bind(shopId, dayStr(), visits, clicks)
    .run();
}

async function deleteMedia(env, rows) {
  for (const m of rows) {
    try {
      await env.IMAGES.delete(m.r2_key);
    } catch (e) {
      console.error("R2 delete", e);
    }
    await env.DB.prepare("DELETE FROM media WHERE id=?").bind(m.id).run();
  }
}

async function adminContact(env) {
  const r = await env.DB.prepare("SELECT phone FROM users WHERE is_admin=1 ORDER BY id LIMIT 1").first();
  return r ? r.phone : "";
}

// ---------- Pages HTML ----------
const platformName = (env) => esc(env.PLATFORM_NAME || "Boutiko");
const safeColor = (c) => (/^#[0-9a-fA-F]{6}$/.test(c || "") ? c : "#0f766e");

function layout(o) {
  const color = safeColor(o.color);
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<title>${esc(o.title)}</title><meta name="description" content="${esc(o.desc || "")}">
<meta property="og:title" content="${esc(o.title)}"><meta property="og:description" content="${esc(o.desc || "")}"><meta property="og:type" content="website">
${o.pwa ? '<link rel="manifest" href="/manifest.webmanifest"><link rel="icon" href="/icon.svg" type="image/svg+xml">' : ""}
${o.image ? `<meta property="og:image" content="${esc(o.image)}">` : ""}${o.url ? `<meta property="og:url" content="${esc(o.url)}">` : ""}
${o.noindex ? '<meta name="robots" content="noindex">' : ""}<meta name="theme-color" content="${color}">
<style id="boutiko-design-system">${STYLE_CSS}</style><style>:root{--c:${color}}</style></head>
<body${o.bodyAttrs ? " " + o.bodyAttrs : ""}>${o.body}${o.pwa ? '<script>if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){});});}var ib=document.getElementById("installPwa");if(ib){var dp=null;window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();dp=e;});ib.addEventListener("click",function(){if(dp){dp.prompt();dp.userChoice.then(function(){dp=null;});}else{alert("Sur Android, ouvrez le menu ⋮ de Chrome puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».");}});}</script>' : ""}${o.script ? `<script src="${o.script}"></script>` : ""}</body></html>`;
}

async function homePage(request, env) {
  const config = await platformConfig(env);
  const brand = config.settings;
  const PLANS_PUBLIC = config.plans;
  const TRIAL_PUBLIC = config.trialDays;
  const assetsRows = await env.DB.prepare("SELECT kind FROM platform_assets").all();
  const brandAssets = new Set(assetsRows.results.map((r) => r.kind));
  const name = esc(brand.name || env.PLATFORM_NAME || "Boutiko");
  const heroTitle = esc(brand.heroTitle || "Votre commerce mérite une vraie vitrine en ligne.");
  const heroText = esc(brand.heroText || "Montrez vos produits, affichez vos prix et laissez vos clients vous contacter sur WhatsApp. Une adresse simple à partager, même si vous n’avez pas de site aujourd’hui.");
  const brandColor = safeColor(brand.primaryColor || "#102a43");
  const brandLogo = brandAssets.has("logo") ? `<img class="hk-brand-logo" src="/platform-img/logo" alt="Logo ${name}">` : `<span class="hk-mark">B</span>`;
  const heroVisual = brandAssets.has("hero") ? `style="background-image:linear-gradient(90deg,rgba(16,42,67,.88),rgba(16,42,67,.18)),url(/platform-img/hero)"` : "";
  const admin = await adminContact(env);
  const pros = await env.DB.prepare(
    "SELECT name, slug FROM shops WHERE plan='pro' AND status='active' ORDER BY id DESC LIMIT 8"
  ).all();
  const contact = admin
    ? `<a class="btn ghost" href="https://wa.me/${esc(admin)}?text=${encodeURIComponent("Bonjour, je veux en savoir plus sur " + (env.PLATFORM_NAME || "Boutiko"))}">Poser une question sur WhatsApp</a>`
    : "";
  const wa = !!admin;

  const SHOTS = TEMPLATE_IMAGES;
  const planLabel = { essentiel: "Essentiel", standard: "Standard", pro: "Pro" };
  const planPrice = { essentiel: PLANS_PUBLIC.essentiel.price, standard: PLANS_PUBLIC.standard.price, pro: PLANS_PUBLIC.pro.price };
  const planOrder = ["essentiel", "standard", "pro"];
  // Les 16 modèles sont accessibles dès la formule Essentiel : le modèle ne fixe pas le prix.
  const allCards = Object.keys(TEMPLATES).map((tid) => {
    const t = TEMPLATES[tid];
    const tags = (t.tags || []).map((x) => `<span class="tpl-tag">${esc(x)}</span>`).join("");
    return `<article class="tpl-card tpl-${esc(tid)}" data-id="${esc(tid)}">
      <a class="tpl-shot" href="/modele/${esc(tid)}" target="_blank" rel="noopener" aria-label="Aperçu ${esc(t.label)}">
        <img class="tpl-image" src="${SHOTS[tid]}" alt="Aperçu du modèle ${esc(t.label)}" loading="lazy">
        <span class="tpl-preview-label">Aperçu · ${esc(t.label)}</span>
      </a>
      <div class="tpl-meta">
        <div class="tpl-meta-top">
          <span class="tpl-plan">Inclus dès Essentiel</span>
          <div class="tpl-tags">${tags}</div>
        </div>
        <h3>${esc(t.label)}</h3>
        <p class="tpl-tagline">${esc(t.tagline)}</p>
        <p class="tpl-desc muted small">${esc(t.desc)}</p>
        <div class="tpl-cta">
          <a class="btn" href="/app?modele=${esc(tid)}">Choisir ce modèle</a>
          <a class="btn ghost small" href="/modele/${esc(tid)}">Voir l’exemple</a>
        </div>
      </div>
    </article>`;
  }).join("");
    const shops = pros.results.length
    ? `<section class="sec wrap"><h2>Boutiques deja en ligne</h2><div class="chips">${pros.results
        .map((s) => `<a class="chip" href="/${esc(s.slug)}">${esc(s.name)}</a>`).join("")}</div></section>`
    : "";

  const body = `
<nav class="hk-nav">
  <div class="hk-shell hk-nav-in">
    <a class="hk-logo" href="/">${brandLogo} ${name}</a>
    <div class="hk-nav-links">
      <a href="#comment">Comment ca marche</a>
      <a href="#modeles">Modeles</a>
      <a href="#pourquoi">Pourquoi Boutiko</a>
      <a href="#tarifs">Tarifs</a>
      ${wa ? `<a href="https://wa.me/${esc(admin)}">Aide</a>` : ""}
    </div>
    <button type="button" class="hk-menu-btn" id="hkMenuBtn" aria-label="Menu">☰</button>
    <div class="hk-nav-cta">
      <a class="hk-btn hk-btn-ghost" href="/app">Connexion</a>
      <a class="hk-btn hk-btn-primary" href="/app">Inscription</a>
      <button type="button" class="hk-btn hk-btn-soft" id="installPwa">Telecharger</button>
    </div>
  </div>
</nav>

<main class="bk-workspace">
  <aside class="bk-sidebar">
    <a class="bk-side-brand" href="/">${brandLogo}<span>${name}</span></a>
    <p class="bk-side-label">ESPACE COMMERÇANT</p>
    <a class="bk-side-link active" href="#bk-start"><span>⌂</span> Vue d’ensemble</a>
    <a class="bk-side-link" href="/app"><span>▦</span> Mes boutiques</a>
    <a class="bk-side-link" href="#modeles"><span>◫</span> Modèles de boutique</a>
    <a class="bk-side-link" href="/app"><span>＋</span> Mes produits</a>
    <div class="bk-side-bottom"><span class="bk-status-dot"></span> Prêt à démarrer</div>
  </aside>
  <section class="bk-main" id="bk-start">
    <div class="bk-topbar"><div><span class="bk-breadcrumb">Boutiko <span>/</span> Espace de travail</span><h1>Construisez votre boutique.</h1><p>Tout ce qu’il faut pour présenter vos produits et recevoir des commandes.</p></div><a class="bk-avatar" href="/app" aria-label="Ouvrir mon compte">↗</a></div>
    <div class="bk-welcome"><div class="bk-welcome-copy"><span class="bk-kicker">VOTRE ESPACE DE CRÉATION</span><h2>Votre commerce, prêt à passer en ligne.</h2><p>Choisissez un modèle, ajoutez vos produits et partagez votre lien WhatsApp.</p><div class="bk-actions"><a class="hk-btn hk-btn-primary hk-btn-lg" href="/app">＋ Créer ma boutique</a><a class="hk-btn hk-btn-ghost hk-btn-lg" href="#modeles">Explorer les modèles <span>→</span></a></div><div class="bk-meta"><span>✓ Sans code</span><span>✓ 16 modèles inclus</span><span>✓ Essai ${TRIAL_PUBLIC} jours</span></div></div>
      <div class="bk-preview-window"><div class="bk-window-bar"><i></i><i></i><i></i><span>Aperçu de votre future boutique</span></div><div class="bk-window-body"><div class="bk-preview-banner"><span>BOUTIQUE EN LIGNE</span><strong>Votre marque.<br>Votre univers.</strong><small>Vos produits en quelques clics.</small></div><div class="bk-preview-products"><div><img src="/mode.webp" alt="Modèle mode"><b>Mode & accessoires</b><small>Voir la collection ↗</small></div><div><img src="/beaute.webp" alt="Modèle beauté"><b>Beauté naturelle</b><small>Découvrir ↗</small></div></div><div class="bk-preview-footer"><span>● Boutique en préparation</span><span>WhatsApp intégré</span></div></div></div>
    </div>
    <div class="bk-section-title"><div><span class="bk-kicker">DÉMARRAGE RAPIDE</span><h2>Que souhaitez-vous faire ?</h2></div><a href="/app">Accéder à mon espace ↗</a></div>
    <div class="bk-action-grid"><a class="bk-action-card bk-action-primary" href="/app"><span class="bk-action-icon">＋</span><span><b>Créer une boutique</b><small>Nom, contact et style en quelques étapes.</small></span><strong>→</strong></a><a class="bk-action-card" href="/app"><span class="bk-action-icon">▦</span><span><b>Gérer mes produits</b><small>Photos, prix et disponibilité.</small></span><strong>→</strong></a><a class="bk-action-card" href="#modeles"><span class="bk-action-icon">◫</span><span><b>Personnaliser ma page</b><small>Choisissez parmi les 16 modèles.</small></span><strong>→</strong></a></div>
    <div class="bk-section-title bk-model-heading" id="modeles"><div><span class="bk-kicker">BIBLIOTHÈQUE DE MODÈLES</span><h2>Choisissez votre point de départ.</h2><p>Les 16 modèles sont inclus dès la formule Essentiel à 2 000 FCFA/mois.</p></div><span class="bk-count">16 modèles disponibles</span></div>
    <div class="bk-template-strip"><a href="/modele/mode"><img src="/mode.webp" alt=""><span><b>Mode & accessoires</b><small>Élégant · Moderne</small></span><em>Voir ↗</em></a><a href="/modele/beaute"><img src="/beaute.webp" alt=""><span><b>Beauté éclatante</b><small>Doux · Naturel</small></span><em>Voir ↗</em></a><a href="/modele/quartier"><img src="/quartier.webp" alt=""><span><b>Marché de proximité</b><small>Local · Accueillant</small></span><em>Voir ↗</em></a><a href="/modele/catalogue"><img src="/catalogue.webp" alt=""><span><b>Tech & électronique</b><small>Net · Contemporain</small></span><em>Voir ↗</em></a></div>
    <div class="bk-bottom-row"><div><span class="bk-bottom-icon">↗</span><span><b>Votre boutique est partageable partout</b><small>Un lien à envoyer sur WhatsApp, Facebook ou votre statut.</small></span></div><a class="hk-btn hk-btn-primary" href="/app">Commencer maintenant</a></div>
  </section>
</main>

<section class="bk-after-workspace" id="pourquoi"><div class="hk-shell"><span class="bk-kicker">SIMPLE À UTILISER</span><h2>Une boutique claire, des commandes directes.</h2><p>Vos clients consultent vos produits et vous contactent directement sur WhatsApp.</p><div class="bk-benefit-row"><span>✓ Photos et prix visibles</span><span>✓ Commandes WhatsApp</span><span>✓ Fonctionne sur téléphone</span></div></div></section>

<section class="hk-band hk-dark" id="pourquoi">
  <div class="hk-shell">
    <div class="hk-section-head">
      <p class="hk-eyebrow">Votre commerce mérite une belle vitrine</p>
      <h2>Quand on découvre vos produits, on doit avoir envie de vous écrire.</h2>
      <p class="hk-sub">Une page claire, de belles photos et les prix visibles : vos clients comprennent ce que vous proposez avant même de vous contacter.</p>
    </div>
    <div class="hk-pillars">
      <article class="hk-pillar"><span class="hk-feature-icon" aria-hidden="true">✦</span><span class="hk-feature-kicker">VOTRE VITRINE</span><strong>Vos produits, au bon endroit.</strong><p>Photos, prix et détails sont réunis sur une page que vos clients peuvent parcourir tranquillement.</p></article>
      <article class="hk-pillar"><span class="hk-feature-icon" aria-hidden="true">↗</span><span class="hk-feature-kicker">CONTACT DIRECT</span><strong>La commande reste simple.</strong><p>Un bouton les dirige vers WhatsApp. Vous discutez avec vos clients comme vous en avez l’habitude.</p></article>
      <article class="hk-pillar"><span class="hk-feature-icon" aria-hidden="true">⌁</span><span class="hk-feature-kicker">UN LIEN UNIQUE</span><strong>Un seul lien à envoyer.</strong><p>Placez-le dans votre statut, votre bio ou envoyez-le directement à vos clients.</p></article>
    </div>
  </div>
</section>


<section class="hk-band" id="comment">
  <div class="hk-shell">
    <div class="hk-section-head">
      <p class="hk-eyebrow">Vous pouvez commencer aujourd’hui</p>
      <h2>Pas besoin d’être informaticien.</h2>
    </div>
    <div class="hk-steps">
      <article class="hk-step"><span class="hk-step-n">01</span><span class="hk-step-icon" aria-hidden="true">◈</span><strong>Choisissez l’ambiance</strong><p>Mode, beauté, alimentation, maison ou commerce général : partez d’un modèle qui vous plaît.</p></article>
      <article class="hk-step"><span class="hk-step-n">02</span><span class="hk-step-icon" aria-hidden="true">✳</span><strong>Mettez votre commerce</strong><p>Ajoutez votre nom, votre numéro WhatsApp, vos photos et vos prix.</p></article>
      <article class="hk-step"><span class="hk-step-n">03</span><span class="hk-step-icon" aria-hidden="true">↗</span><strong>Faites circuler le lien</strong><p>Envoyez votre adresse de boutique à vos clients et publiez-la sur vos réseaux.</p></article>
    </div>
  </div>
</section>

<section class="hk-band" id="modeles">
  <div class="hk-shell">
    <div class="hk-section-head">
      <p class="hk-eyebrow">Choisissez votre univers</p>
      <h2>Commencez avec un modèle. Faites-en votre boutique.</h2>
      <p class="hk-sub">Chaque aperçu vous donne une idée du résultat. Choisissez celui qui correspond à vos produits, puis remplacez les exemples par les vôtres.</p>
    </div>
    <p class="hk-gallery-note"><strong>Les 16 modèles sont inclus dès 2 000 FCFA/mois.</strong> Aucun supplément pour choisir votre style.</p>
    <div class="tpl-marketplace">${allCards}</div>
  </div>
</section>

<section class="hk-band hk-dark" id="tarifs">
  <div class="hk-shell">
    <div class="hk-section-head">
      <p class="hk-eyebrow">Commencez petit, évoluez ensuite</p>
      <h2>Payez selon la taille de votre catalogue.</h2>
    </div>
    <div class="hk-prices">
      <div class="hk-price">
        <h3>Essentiel</h3>
        <div class="hk-price-num">${fcfa(PLANS_PUBLIC.essentiel.price)} <small>F/mois</small></div>
        <ul><li>${PLANS_PUBLIC.essentiel.products} produits maximum</li><li>${PLANS_PUBLIC.essentiel.photos} photo(s) maximum par produit</li><li>${PLANS_PUBLIC.essentiel.storageMb} Mo de stockage</li><li>Les 16 modèles inclus</li></ul>
        <a class="hk-btn hk-btn-ghost" href="#modeles">Voir modeles</a>
      </div>
      <div class="hk-price hk-price-feat">
        <p class="hk-badge">Recommande</p>
        <h3>Standard</h3>
        <div class="hk-price-num">${fcfa(PLANS_PUBLIC.standard.price)} <small>F/mois</small></div>
        <ul><li>${PLANS_PUBLIC.standard.products} produits maximum</li><li>${PLANS_PUBLIC.standard.photos} photos maximum par produit</li><li>${PLANS_PUBLIC.standard.storageMb} Mo de stockage</li><li>Les 16 modèles inclus</li></ul>
        <a class="hk-btn hk-btn-primary" href="#modeles">Voir modeles</a>
      </div>
      <div class="hk-price">
        <h3>Pro</h3>
        <div class="hk-price-num">${fcfa(PLANS_PUBLIC.pro.price)} <small>F/mois</small></div>
        <ul><li>${PLANS_PUBLIC.pro.products} produits maximum</li><li>${PLANS_PUBLIC.pro.photos} photos maximum par produit</li><li>${PLANS_PUBLIC.pro.storageMb} Mo de stockage</li><li>Les 16 modèles inclus</li></ul>
        <a class="hk-btn hk-btn-ghost" href="#modeles">Voir modeles</a>
      </div>
    </div>
  </div>
</section>

${shops}


<section class="hk-band hk-dark" id="faq">
  <div class="hk-shell">
    <div class="hk-section-head">
      <p class="hk-eyebrow">Les réponses aux questions utiles</p>
      <h2>Avant de vous lancer</h2>
    </div>
    <div class="hk-faq">
      <details class="hk-faq-item" open><summary>Faut-il savoir coder ?</summary><p>Non. Vous choisissez un modele, vous renseignez vos textes et photos. C'est tout.</p></details>
      <details class="hk-faq-item"><summary>Comment mes clients commandent-ils ?</summary><p>Ils ouvrent votre lien boutique, choisissent un produit et envoient la commande sur WhatsApp. Pas d'application a installer pour eux.</p></details>
      <details class="hk-faq-item"><summary>Puis-je commencer gratuitement ?</summary><p>Oui. ${TRIAL_PUBLIC} jours d'essai. Vous testez avant de passer a une formule payante.</p></details>
      <details class="hk-faq-item"><summary>Quelle est la différence entre les formules ?</summary><p>Les 16 modèles sont accessibles avec chaque formule. La différence porte sur le nombre de produits, les photos et l’espace de stockage.</p></details>
      <details class="hk-faq-item"><summary>Ca marche sur telephone ?</summary><p>Oui. L'espace commercant et la boutique client sont optimises mobile. Vous pouvez aussi installer Boutiko comme application (PWA).</p></details>
    </div>
  </div>
</section>

<section class="hk-cta">
  <div class="hk-shell">
    <h2>Vos produits méritent mieux qu’une photo dans un statut.</h2>
    <p>Créez votre boutique, partagez le lien et laissez vos clients découvrir votre offre à leur rythme. L’essai dure ${TRIAL_PUBLIC} jours.</p>
    <div class="hk-hero-actions" style="justify-content:center">
      <a class="hk-btn hk-btn-primary hk-btn-lg" href="/app">Inscription</a>
      <a class="hk-btn hk-btn-ghost hk-btn-lg" href="/app">Connexion</a>
    </div>
  </div>
</section>

<footer class="hk-foot">
  <div class="hk-shell hk-foot-in">
    <div><strong>${name}</strong><p>Boutiques en ligne pour commercants. Commandes WhatsApp.</p></div>
    <div class="hk-foot-links"><a href="#modeles">Modeles</a><a href="/app">Espace commercant</a><a href="/proprietaire">Espace Propriétaire</a></div>
  </div>
</footer>

<script>
(function(){
  var btn=document.getElementById('hkMenuBtn');
  var links=document.querySelector('.hk-nav-links');
  if(btn&&links){btn.addEventListener('click',function(){links.classList.toggle('open');});}
})();
</script>

`;

  return html(layout({
    title: `${brand.name || env.PLATFORM_NAME || "Boutiko"} — Créez votre boutique en ligne`,
    desc: brand.description || "Créez une boutique en ligne professionnelle, choisissez parmi 16 modèles et recevez vos commandes sur WhatsApp.",
    color: brandColor,
    body,
    pwa: true,
    bodyAttrs: `data-platform="${platformName(env)}" class="home-models v2 hk-site"`,
  }));
}


function appPage(env) {
  return html(
    layout({
      title: `Mon espace | ${env.PLATFORM_NAME || "Boutiko"}`,
      body: `<div id="root" class="app"><p class="center muted">Chargement…</p></div>`,
      script: `/app.js?v=${V.app}`,
      bodyAttrs: `data-platform="${platformName(env)}"`,
      pwa: true,
      noindex: true,
    })
  );
}
function adminPage(env) {
  return html(
    layout({
      title: `Administration | ${env.PLATFORM_NAME || "Boutiko"}`,
      body: `<div id="root" class="app"><p class="center muted">Chargement…</p></div>`,
      script: `/admin.js?v=${V.admin}`,
      color: "#27338f",
      noindex: true,
    })
  );
}

// Icônes (traits fins, héritent la couleur du texte)
const IC = {
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
  wa: '<path d="M3 21l1.6-5A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  route: '<path d="M3 11l18-8-8 18-2-8z"/>',
  box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  qr: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h3v3m3 0v3h-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;

function productCard(p, shop) {
  const photos = parseIds(p.photos);
  const soldOut = p.stock !== null && p.stock <= 0;
  const low = p.stock !== null && p.stock > 0 && p.stock <= 3;
  const max = p.stock !== null ? Math.max(1, Math.min(p.stock, 20)) : 20;
  const promo = p.promo_price !== null && p.promo_price < p.price;
  const priceHtml = promo
    ? `<s>${fcfa(p.price)}</s> <b>${fcfa(p.promo_price)} FCFA</b>`
    : `<b>${fcfa(p.price)} FCFA</b>`;
  const imgs = photos.length
    ? `<div class="photos"><img src="/img/${photos[0]}" loading="lazy" alt="${esc(p.name)}"></div>`
    : p.demoImage
      ? `<div class="photos"><img src="${esc(p.demoImage)}" loading="lazy" alt="${esc(p.name)}"></div>`
      : `<div class="photos nophoto"><span>Pas de photo</span></div>`;
  const extra = photos.length > 1 ? `<span class="tag more">${photos.length} photos</span>` : "";
  return `<article class="prod${soldOut ? " out" : ""}" id="p${p.id}" data-id="${p.id}" data-max="${max}" data-photos="${photos.join(",")}" data-sold="${soldOut ? 1 : 0}">
<div class="tap" data-open>${imgs}${promo ? '<span class="tag promo">Promo</span>' : ""}${soldOut ? '<span class="tag out">Épuisé</span>' : extra}</div>
<div class="pbody"><h3 class="pn" data-open>${esc(p.name)}</h3>
<div class="pprice">${priceHtml}</div>
${p.description ? `<p class="pdesc">${esc(p.description)}</p>` : ""}
${soldOut ? '<p class="warn">Épuisé pour le moment</p>' : low ? `<p class="warn">Plus que ${p.stock} en stock</p>` : ""}
${soldOut ? "" : `<button class="btn block buy" type="button" data-open>${icon("wa")} Commander</button>`}
</div></article>`;
}

async function shopPage(request, env, ctx, slug) {
  const shop = await env.DB.prepare("SELECT * FROM shops WHERE slug=?").bind(slug).first();
  if (!shop) return notFound(env);
  const url = new URL(request.url);
  const name = esc(shop.name);
  const color = safeColor(shop.color);
  if (shop.status !== "active") {
    return html(layout({
      title: shop.name, color, noindex: true,
      body: `<main class="wrap center"><h1>${name}</h1><p class="muted">Cette boutique est temporairement indisponible.</p><a class="btn ghost" href="/">Retour</a></main>`,
    }));
  }
  const prods = await env.DB.prepare("SELECT * FROM products WHERE shop_id=? AND active=1 ORDER BY id DESC").bind(shop.id).all();
  const planKey = ["essentiel", "standard", "pro"].includes(shop.plan) ? shop.plan : "essentiel";
  const config = await platformConfig(env);
  const plan = config.plans[planKey] || config.plans.essentiel;

  const vcookie = `v${shop.id}`;
  const extraHeaders = {};
  if (!cookieOf(request, vcookie)) {
    ctx.waitUntil(bumpStat(env, shop.id, 1, 0).catch((e) => console.error(e)));
    extraHeaders["set-cookie"] = `${vcookie}=1; Path=/; Max-Age=1800; SameSite=Lax`;
  }

  const st = openStatus(shop.hours);
  let firstPhoto = shop.logo_id || null;
  if (!firstPhoto) {
    for (const p of prods.results) {
      const ph = parseIds(p.photos);
      if (ph.length) { firstPhoto = ph[0]; break; }
    }
  }
  const theme = ["editorial", "minimal", "elegant", "bold"].includes(shop.theme) ? shop.theme : "editorial";
  const productLayout = ["grid", "list", "large"].includes(shop.layout) ? shop.layout : "grid";
  const galleryIds = parseIds(shop.gallery).slice(0, planKey === "pro" ? 8 : 5);
  const brandLabel = esc(shop.brand_name || shop.business_name || "");
  const slogan = esc(shop.slogan || "");
  const desc = esc(shop.description || "");
  const waLink = `https://wa.me/${esc(shop.whatsapp)}`;
  const many = prods.results.length > 8;
  const productCount = prods.results.length;

  // ---- Cover / logo (all tiers) ----
  const cover = (shop.banner_id && plan.custom)
    ? `<div class="sf-cover has-img" style="background-image:url(/img/${shop.banner_id})"></div>`
    : `<div class="sf-cover no-img" style="--c:${color};background-image:linear-gradient(90deg,rgba(16,42,67,.15),rgba(16,42,67,.02)),url(/template-img/${esc(TEMPLATES[shop.template] ? shop.template : "simple")})"></div>`;
  const avatar = shop.logo_id
    ? `<div class="sf-avatar"><img src="/img/${shop.logo_id}" alt="Logo ${name}"></div>`
    : `<div class="sf-avatar" aria-hidden="true">${esc((Array.from(shop.name.trim())[0] || "B").toUpperCase())}</div>`;
  const openBadge = st
    ? `<span class="sf-badge ${st.open ? "open" : "closed"}">${st.open ? "Ouvert maintenant" : "Fermé"} · ${esc(st.text)}</span>`
    : "";

  // ---- Hero by tier ----
  let hero = "";
  if (planKey === "pro") {
    hero = `<section class="sf-hero sf-pro-hero">${cover}
      <div class="sf-pro-overlay wrap">
        ${brandLabel ? `<p class="sf-brand">${brandLabel}</p>` : ""}
        <h1 class="sf-name">${name}</h1>
        ${slogan ? `<p class="sf-slogan">${slogan}</p>` : ""}
        ${openBadge}
        <div class="sf-actions">
          <a class="btn" target="_blank" rel="noopener" href="${waLink}">${icon("wa")} Commander sur WhatsApp</a>
          <button class="btn ghost" type="button" id="share">${icon("share")} Partager</button>
        </div>
      </div>
    </section>`;
  } else {
    // essentiel + standard : identité type page découverte validée
    hero = `<section class="sf-hero">${cover}
      <div class="sf-identity wrap">${avatar}<div class="sf-id-text">
        ${brandLabel ? `<p class="sf-brand">${brandLabel}</p>` : ""}
        <h1 class="sf-name">${name}</h1>
        ${slogan ? `<p class="sf-slogan">${slogan}</p>` : ""}
        ${openBadge}
      </div></div>
    </section>`;
  }

  // ---- Infobar (actions + infos pratiques) ----
  const infoItems = [];
  if (shop.address) infoItems.push(`<span class="sf-info">${icon("pin")}<span>${esc(shop.address)}</span></span>`);
  if (st) infoItems.push(`<span class="sf-info">${icon("clock")}<span>${st.open ? "Ouvert" : "Fermé"} · ${esc(st.text)}</span></span>`);
  if (shop.momo) infoItems.push(`<span class="sf-info">${icon("card")}<span>${esc(shop.momo)}</span></span>`);
  const actionsEss = planKey === "pro" ? "" : `<div class="sf-actions">
    <a class="btn" target="_blank" rel="noopener" href="${waLink}">${icon("wa")} Commander / Nous écrire</a>
    ${shop.maps_url ? `<a class="btn ghost" target="_blank" rel="noopener" href="${esc(shop.maps_url)}">${icon("route")} Itinéraire</a>` : ""}
    <button class="btn ghost" type="button" id="share">${icon("share")} Partager</button>
  </div>`;
  const mapsPro = (planKey === "pro" && shop.maps_url)
    ? `<a class="btn ghost small" target="_blank" rel="noopener" href="${esc(shop.maps_url)}">${icon("route")} Itinéraire</a>` : "";
  const infoBar = `<section class="sf-infobar"><div class="wrap">
    ${infoItems.length ? `<div class="sf-infos">${infoItems.join("")}</div>` : ""}
    ${actionsEss}${mapsPro}
  </div></section>`;

  // ---- Entreprise (standard + pro always if desc; essentiel if desc) ----
  const about = (desc || (planKey !== "essentiel" && brandLabel))
    ? `<section class="sf-about wrap"><div class="sf-sec"><span>${planKey === "pro" ? "L'entreprise" : "L'entreprise"}</span><h2>${planKey === "pro" ? "Qui sommes-nous" : "Qui sommes-nous"}</h2></div>
      <p class="sf-desc">${desc || (brandLabel + " vous accueille.")}</p></section>`
    : "";

  // ---- Galerie ----
  const gallery = galleryIds.length
    ? `<section class="sf-gallery"><div class="wrap"><div class="sf-sec"><span>Notre univers</span><h2>${planKey === "pro" ? "La marque en images" : "La boutique en images"}</h2></div>
      <div class="story-gallery">${galleryIds.map((id, i) => `<button type="button" class="story-shot" data-lightbox="/img/${id}" aria-label="Photo ${i + 1}"><img src="/img/${id}" loading="lazy" alt="Photo ${i + 1} de ${name}"></button>`).join("")}</div></div></section>`
    : "";

  // ---- Produits ----
  const productsHtml = productCount
    ? `<section class="sf-products"><div class="wrap"><div class="sf-sec"><span>Catalogue</span><h2>Nos produits${productCount > 1 ? ` <small>(${productCount})</small>` : ""}</h2></div>
      ${many ? '<div class="search"><input id="q" type="search" placeholder="Chercher un produit..." aria-label="Chercher un produit" autocomplete="off"></div>' : ""}
      <div class="pgrid">${prods.results.map((p) => productCard(p, shop)).join("")}</div>
      <p class="hint" id="none" hidden>Aucun produit ne correspond.</p>
      <p class="hint">Touchez un produit pour le voir en grand, puis commandez sur WhatsApp.</p>
    </div></section>`
    : `<section class="sf-products"><div class="wrap"><div class="sf-sec"><span>Catalogue</span><h2>Nos produits</h2></div>
      <div class="empty"><b>Les produits arrivent bientôt</b><p>Revenez bientôt ou écrivez-nous sur WhatsApp.</p>
      <a class="btn" target="_blank" rel="noopener" href="${waLink}">${icon("wa")} Nous écrire</a></div></div></section>`;

  const foot = shop.plan === "pro"
    ? `<footer class="sf-foot sf-foot-pro"><div class="wrap">Boutique créée avec <a href="/">${platformName(env)} Pro</a></div></footer>`
    : `<footer class="sf-foot"><div class="wrap">Boutique créée avec <a href="/">${platformName(env)}</a></div></footer>`;
  const fab = `<a class="fab" target="_blank" rel="noopener" href="${waLink}" aria-label="Écrire sur WhatsApp">${icon("wa")}</a>`;

  const body = hero + infoBar + about + gallery + productsHtml + foot + fab;

  return html(layout({
    title: `${shop.name}${shop.address ? " · " + shop.address : ""}`,
    desc: shop.description || shop.slogan || `Découvrez ${shop.name} et commandez sur WhatsApp.`,
    image: firstPhoto ? `${url.origin}/img/${firstPhoto}` : "",
    url: `${url.origin}/${shop.slug}`,
    color,
    body,
    script: `/shop.js?v=${V.shop}`,
    bodyAttrs: `class="sf-page sf-${planKey} sf-tpl-${esc(shop.template || "simple")}" data-plan="${planKey}" data-template="${esc(shop.template || "simple")}" data-slug="${esc(shop.slug)}" data-name="${name}" data-theme="${theme}" data-layout="${productLayout}"`,
  }), 200, extraHeaders);
}

async function modelDemoPage(request, env, tid) {
  const t = TEMPLATES[tid];
  if (!t) return notFound(env);
  const config = await platformConfig(env);
  const color = (TEMPLATE_ART[tid] && TEMPLATE_ART[tid].accent) || "#0f766e";
  const fakeShop = {
    id: 0, slug: "modele-" + tid, name: t.label + " — Exemple", brand_name: "Exemple Boutiko",
    business_name: "", slogan: t.tagline, description: t.desc + " Remplacez ces textes par les vôtres après inscription.",
    whatsapp: "22900000000", color, address: "Cotonou, Bénin", maps_url: "", hours: JSON.stringify({ open: "08:00", close: "19:00", days: [1,2,3,4,5,6] }),
    momo: "", logo_id: null, banner_id: null, gallery: "[]", theme: "editorial", layout: "grid",
    plan: "essentiel", template: tid, status: "active",
  };
  // Réutilise shopPage logic via query injection: build minimal HTML demo
  const name = esc(fakeShop.name);
  const waLink = "https://wa.me/22900000000";
  const DEMO_PRODUCTS = {
    simple: [["Chemise essentielle",6500],["Sac du quotidien",12000],["Look de saison",9000]],
    quartier: [["Sélection locale",3500],["Produit populaire",6000],["Nouveauté du jour",4500]],
    express: [["Pain artisanal",1500],["Pâtisserie maison",2500],["Panier gourmand",5000]],
    vitrine: [["Soin éclat",8500],["Routine beauté",12000],["Huile précieuse",5500]],
    catalogue: [["Écouteurs sans fil",12500],["Montre connectée",18000],["Accessoire tech",7500]],
    mode: [["Tenue signature",18000],["Style du jour",12000],["Accessoire textile",6500]],
    premium: [["Boucles dorées",15000],["Collier signature",25000],["Bracelet raffiné",12000]],
    maison: [["Objet décoratif",8500],["Vase naturel",12000],["Lampe design",18000]],
    flagship: [["Sélection tendance",6500],["Accessoire premium",12000],["Collection du moment",9000]],
  };
  const products = (DEMO_PRODUCTS[tid] || DEMO_PRODUCTS.simple).map((p, i) => ({
    id: i + 1, name: p[0], price: p[1], promo_price: i === 1 ? Math.round(p[1] * 0.85) : null,
    photos: "[]", demoImage: `/template-product-img/${tid}/${i}`, stock: i === 2 ? null : 5 - i, active: 1,
  }));
  const cover = `<div class="sf-cover has-img" style="--c:${color};background-image:linear-gradient(90deg,rgba(16,42,67,.08),rgba(16,42,67,.02)),url(/template-img/${esc(tid)})"></div>`;
  const avatar = `<div class="sf-avatar" aria-hidden="true">B</div>`;
  let hero;
  if (["premium", "maison", "flagship"].includes(tid)) {
    hero = `<section class="sf-hero sf-pro-hero">${cover}<div class="sf-pro-overlay wrap">
      <p class="sf-brand">Exemple Boutiko</p><h1 class="sf-name">${name}</h1>
      <p class="sf-slogan">${esc(t.tagline)}</p>
      <div class="sf-actions"><a class="btn" href="/app?modele=${esc(tid)}">Choisir ce modèle</a>
      <a class="btn ghost" href="/#modeles">Autres modèles</a></div></div></section>`;
  } else {
    hero = `<section class="sf-hero">${cover}<div class="sf-identity wrap">${avatar}<div class="sf-id-text">
      <p class="sf-brand">Exemple Boutiko</p><h1 class="sf-name">${name}</h1>
      <p class="sf-slogan">${esc(t.tagline)}</p></div></div></section>`;
  }
  const about = `<section class="sf-about wrap"><div class="sf-sec"><span>L'entreprise</span><h2>Qui sommes-nous</h2></div>
    <p class="sf-desc">${esc(t.desc)} Ceci est un aperçu : vos textes et photos remplaceront cet exemple.</p></section>`;
  const prods = products.map((p) => productCard(p, fakeShop)).join("");
  const body = `${hero}
    <section class="sf-infobar"><div class="wrap"><div class="sf-actions">
      <a class="btn" href="/app?modele=${esc(tid)}&formule=${esc(t.plan)}">Choisir ce modèle</a>
      <a class="btn ghost" href="/#modeles">Voir tous les modèles</a>
    </div></div></section>
    ${about}
    <section class="sf-products"><div class="wrap"><div class="sf-sec"><span>Catalogue</span><h2>Nos produits <small>(exemple)</small></h2></div>
    <div class="pgrid">${prods}</div></div></section>
    <footer class="sf-foot"><div class="wrap">Aperçu du modèle <b>${esc(t.label)}</b> · <a href="/app?modele=${esc(tid)}">Créer ma boutique avec ce modèle</a></div></footer>`;
  return html(layout({
    title: `Modèle ${t.label} · ${env.PLATFORM_NAME || "Boutiko"}`,
    desc: t.desc,
    color,
    body,
    bodyAttrs: `class="sf-page sf-tpl-${tid}" data-template="${tid}"`,
  }));
}

function notFound(env) {
  return html(
    layout({
      title: "Page introuvable",
      noindex: true,
      body: `<main class="wrap center"><h1>Page introuvable</h1><p class="muted">Ce lien ne correspond à aucune boutique.</p><a class="btn" href="/">Accueil</a></main>`,
    }),
    404
  );
}

// ---------- Images ----------
function detectImage(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45) return "image/webp";
  return null;
}
async function servePlatformImage(env, kind) {
  if (!["logo", "hero", "icon"].includes(kind)) return new Response("Not found", { status: 404 });
  const asset = await env.DB.prepare("SELECT r2_key, content_type FROM platform_assets WHERE kind=?").bind(kind).first();
  if (!asset) return new Response("Not found", { status: 404 });
  const obj = await env.IMAGES.get(asset.r2_key);
  if (!obj) return new Response("Not found", { status: 404 });
  return new Response(obj.body, { headers: { "content-type": asset.content_type, "cache-control": "public, max-age=300", "x-content-type-options": "nosniff" } });
}
async function serveImage(env, idStr) {
  const id = parseInt(idStr, 10);
  if (!Number.isFinite(id)) return new Response("Not found", { status: 404 });
  const m = await env.DB.prepare("SELECT r2_key FROM media WHERE id=?").bind(id).first();
  if (!m) return new Response("Not found", { status: 404 });
  const obj = await env.IMAGES.get(m.r2_key);
  if (!obj) return new Response("Not found", { status: 404 });
  return new Response(obj.body, {
    headers: {
      "content-type": obj.httpMetadata?.contentType || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
function serveQr(request, env, slug) {
  const url = new URL(request.url);
  const qr = qrcode(0, "M");
  qr.addData(`${url.origin}/${slug}`);
  qr.make();
  const svg = qr.createSvgTag({ cellSize: 8, margin: 4, scalable: true });
  return new Response(svg, { headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=86400" } });
}

// ---------- API : visiteurs ----------
async function apiOrder(request, env, ctx) {
  const b = await readJson(request);
  if (!b) return fail("Requête invalide");
  const shop = await env.DB.prepare("SELECT * FROM shops WHERE slug=?").bind(str(b.slug, 60)).first();
  if (!shop || shop.status !== "active") return fail("Boutique indisponible", 404);
  const pid = parseInt(b.product_id, 10);
  const qty = Math.max(1, Math.min(20, parseInt(b.qty, 10) || 1));
  const p = await env.DB.prepare("SELECT * FROM products WHERE id=? AND shop_id=? AND active=1").bind(pid, shop.id).first();
  if (!p) return fail("Produit introuvable", 404);
  if (p.stock !== null && p.stock <= 0) return fail("Ce produit est épuisé pour le moment.");
  if (p.stock !== null && qty > p.stock) return fail(`Il ne reste que ${p.stock} en stock.`);
  const ip = (await sha256Hex((request.headers.get("CF-Connecting-IP") || "local") + "|boutiko")).slice(0, 20);
  const recent = await env.DB.prepare("SELECT COUNT(*) n FROM orders WHERE ip=? AND created_at>?").bind(ip, now() - 3600).first();
  if (recent.n >= MAX_ORDERS_PER_HOUR) return fail("Trop de demandes. Réessayez dans un moment.", 429);
  const unit = p.promo_price !== null && p.promo_price < p.price ? p.promo_price : p.price;
  const res = await env.DB.prepare(
    "INSERT INTO orders(shop_id, product_id, product_name, qty, unit_price, status, source, ip, created_at) VALUES(?,?,?,?,?,'pending','web',?,?)"
  )
    .bind(shop.id, p.id, p.name, qty, unit, ip, now())
    .run();
  const orderId = res.meta.last_row_id;
  ctx.waitUntil(bumpStat(env, shop.id, 0, 1).catch((e) => console.error(e)));
  const origin = new URL(request.url).origin;
  const text = `Bonjour, je souhaite commander :\n• ${p.name} x${qty} : ${fcfa(unit * qty)} FCFA\nRéf. commande n°${orderId}\n${origin}/${shop.slug}#p${p.id}\nMerci !`;
  return json({ url: `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`, order_id: orderId });
}

// ---------- API : compte ----------
async function apiRegister(request, env) {
  const b = await readJson(request);
  if (!b) return fail("Requête invalide");
  const name = str(b.name, 60);
  const phone = normalizePhone(b.phone);
  const password = String(b.password || "");
  if (name.length < 2) return fail("Entrez le nom de votre boutique.");
  if (!validPhone(phone)) return fail("Numéro WhatsApp invalide.");
  if (password.length < 6) return fail("Le mot de passe doit avoir au moins 6 caractères.");
  const exists = await env.DB.prepare("SELECT 1 x FROM users WHERE phone=?").bind(phone).first();
  if (exists) return fail("Ce numéro a déjà un compte. Connectez-vous.");
  // Une inscription publique ne peut jamais créer un administrateur.
  // Le compte propriétaire existant conserve son rôle en base.
  const isAdmin = 0;
  const passHash = await hashPassword(password);
  const u = await env.DB.prepare("INSERT INTO users(phone, pass, is_admin, created_at) VALUES(?,?,?,?)").bind(phone, passHash, isAdmin, now()).run();
  const userId = u.meta.last_row_id;
  const slug = await uniqueSlug(env, name);
  // Le modèle choisi est indépendant de la formule : les limites numériques viennent uniquement du plan.
  let plan = isAdmin ? "pro" : (["essentiel", "standard", "pro"].includes(b.plan) ? b.plan : "essentiel");
  let template = str(b.template || b.modele, 30) || "simple";
  if (!TEMPLATES[template]) template = "simple";
  const config = await platformConfig(env);
  const paidUntil = isAdmin ? now() + 3650 * 86400 : now() + config.trialDays * 86400;
  await env.DB.prepare(
    "INSERT INTO shops(user_id, slug, name, description, whatsapp, plan, template, paid_until, created_at) VALUES(?,?,?,?,?,?,?,?,?)"
  )
    .bind(userId, slug, name, str(b.description, 300), phone, plan, template, paidUntil, now())
    .run();
  return startSession(request, env, userId);
}
async function startSession(request, env, userId) {
  const token = randomHex(24);
  await env.DB.prepare("DELETE FROM sessions WHERE expires<?").bind(now()).run();
  await env.DB.prepare("INSERT INTO sessions(token, user_id, expires) VALUES(?,?,?)").bind(token, userId, now() + SESSION_DAYS * 86400).run();
  return json({ ok: true }, 200, { "set-cookie": sessionCookie(request, token, SESSION_DAYS * 86400) });
}
async function apiLogin(request, env) {
  const b = await readJson(request);
  if (!b) return fail("Requête invalide");
  const phone = normalizePhone(b.phone);
  const f = await env.DB.prepare("SELECT * FROM login_fails WHERE phone=?").bind(phone).first();
  if (f && f.until > now()) return fail("Trop d'essais. Réessayez dans quelques minutes.", 429);
  const u = await env.DB.prepare("SELECT * FROM users WHERE phone=?").bind(phone).first();
  const ok = u && (await verifyPassword(String(b.password || ""), u.pass));
  if (!ok) {
    const c = (f ? f.count : 0) + 1;
    await env.DB.prepare("INSERT INTO login_fails(phone,count,until) VALUES(?,?,?) ON CONFLICT(phone) DO UPDATE SET count=excluded.count, until=excluded.until")
      .bind(phone, c, c >= 8 ? now() + 900 : 0)
      .run();
    return fail("Numéro ou mot de passe incorrect.", 401);
  }
  if (f) await env.DB.prepare("DELETE FROM login_fails WHERE phone=?").bind(phone).run();
  if (!u.is_admin) {
    const sh = await env.DB.prepare("SELECT status FROM shops WHERE user_id=?").bind(u.id).first();
    if (sh && sh.status === "blocked") return fail("Ce compte est bloqué. Contactez l'administrateur sur WhatsApp.", 403);
  }
  return startSession(request, env, u.id);
}
async function apiLogout(request, env) {
  const token = cookieOf(request, "sid");
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token=?").bind(token).run();
  return json({ ok: true }, 200, { "set-cookie": sessionCookie(request, "", 0) });
}

async function usageOf(env, shop) {
  const pc = await env.DB.prepare("SELECT COUNT(*) n FROM products WHERE shop_id=?").bind(shop.id).first();
  const mb = await env.DB.prepare("SELECT COALESCE(SUM(bytes),0) n FROM media WHERE shop_id=?").bind(shop.id).first();
  return { products: pc.n, bytes: mb.n };
}
async function publicShop(env, shop) {
  const media = {};
  for (const id of [shop.logo_id, shop.banner_id]) if (id) media[id] = `/img/${id}`;
  return {
    id: shop.id, slug: shop.slug, name: shop.name, business_name: shop.business_name || "", brand_name: shop.brand_name || "", slogan: shop.slogan || "", description: shop.description, whatsapp: shop.whatsapp,
    color: shop.color, address: shop.address, maps_url: shop.maps_url, hours: shop.hours, momo: shop.momo,
    logo_id: shop.logo_id, banner_id: shop.banner_id, gallery: parseIds(shop.gallery), theme: shop.theme || "editorial",
    layout: shop.layout || "grid", plan: shop.plan, template: shop.template || "simple", status: shop.status,
    paid_until: shop.paid_until, quick_replies: shop.quick_replies,
  };
}
async function apiMe(env, auth) {
  const shop = auth.shop;
  const config = await platformConfig(env);
  const out = { user: auth.user, plans: config.plans, trialDays: config.trialDays, adminPhone: await adminContact(env) };
  if (shop) {
    out.shop = await publicShop(env, shop);
    out.limits = config.plans[shop.plan] || config.plans.essentiel;
    out.usage = await usageOf(env, shop);
    const po = await env.DB.prepare("SELECT COUNT(*) n FROM orders WHERE shop_id=? AND status='pending'").bind(shop.id).first();
    out.pending = po.n;
  }
  return json(out);
}

async function apiShopUpdate(request, env, auth) {
  const shop = auth.shop;
  const b = await readJson(request);
  if (!b) return fail("Requête invalide");
  const config = await platformConfig(env);
  const plan = config.plans[shop.plan] || config.plans.essentiel;
  const f = {};
  if (b.name !== undefined) {
    f.name = str(b.name, 60);
    if (f.name.length < 2) return fail("Le nom de la boutique est trop court.");
  }
  if (b.business_name !== undefined) f.business_name = str(b.business_name, 80);
  if (b.brand_name !== undefined) f.brand_name = str(b.brand_name, 80);
  if (b.slogan !== undefined) f.slogan = str(b.slogan, 140);
  if (b.description !== undefined) f.description = str(b.description, 300);
  if (b.whatsapp !== undefined) {
    f.whatsapp = normalizePhone(b.whatsapp);
    if (!validPhone(f.whatsapp)) return fail("Numéro WhatsApp invalide.");
  }
  if (b.color !== undefined) {
    if (!/^#[0-9a-fA-F]{6}$/.test(b.color)) return fail("Couleur invalide.");
    f.color = b.color;
  }
  if (b.theme !== undefined) {
    if (!["editorial", "minimal", "elegant", "bold"].includes(b.theme)) return fail("Modèle de boutique invalide.");
    f.theme = b.theme;
  }
  if (b.layout !== undefined) {
    if (!["grid", "list", "large"].includes(b.layout)) return fail("Présentation des produits invalide.");
    f.layout = b.layout;
  }
  if (b.gallery !== undefined) {
    if (!Array.isArray(b.gallery) || b.gallery.length > 5) return fail("Choisissez au maximum 5 photos de présentation.");
    const ids = [...new Set(b.gallery.map(Number))];
    if (ids.some((id) => !Number.isInteger(id) || id <= 0)) return fail("Photos de présentation invalides.");
    for (const id of ids) {
      const m = await env.DB.prepare("SELECT id FROM media WHERE id=? AND shop_id=? AND kind='gallery'").bind(id, shop.id).first();
      if (!m) return fail("Une photo de présentation ne vous appartient pas.");
    }
    f.gallery = JSON.stringify(ids);
  }
  if (b.address !== undefined) f.address = str(b.address, 200);
  if (b.maps_url !== undefined) {
    const u = str(b.maps_url, 500);
    if (u) {
      let host = "";
      try {
        const x = new URL(u);
        host = x.hostname;
        if (x.protocol !== "https:") throw new Error();
      } catch {
        return fail("Lien de localisation invalide.");
      }
      if (!/(^|\.)(google\.com|goo\.gl|openstreetmap\.org)$/.test(host)) return fail("Utilisez un lien Google Maps.");
    }
    f.maps_url = u;
  }
  if (b.hours !== undefined) {
    if (b.hours === "" || b.hours === null) f.hours = "";
    else {
      const h = b.hours;
      if (!h || !/^\d\d:\d\d$/.test(h.open || "") || !/^\d\d:\d\d$/.test(h.close || "")) return fail("Horaires invalides.");
      const days = Array.isArray(h.days) ? h.days.map(Number).filter((d) => d >= 0 && d <= 6) : [0, 1, 2, 3, 4, 5, 6];
      f.hours = JSON.stringify({ open: h.open, close: h.close, days });
    }
  }
  if (b.momo !== undefined) f.momo = str(b.momo, 120);
  if (b.quick_replies !== undefined) f.quick_replies = str(b.quick_replies, 1500);
  const toDelete = [];
  for (const [key, kind] of [["logo_id", "logo"], ["banner_id", "banner"]]) {
    if (b[key] === undefined) continue;
    if (b[key] === null) {
      f[key] = null;
    } else {
      if (key === "banner_id" && !plan.custom) return fail("La bannière est disponible à partir de la formule Standard.");
      const id = parseInt(b[key], 10);
      const m = await env.DB.prepare("SELECT * FROM media WHERE id=? AND shop_id=? AND kind=?").bind(id, shop.id, kind).first();
      if (!m) return fail("Image introuvable.");
      f[key] = id;
    }
    if (shop[key] && shop[key] !== f[key]) {
      const old = await env.DB.prepare("SELECT * FROM media WHERE id=?").bind(shop[key]).first();
      if (old) toDelete.push(old);
    }
  }
  const keys = Object.keys(f);
  if (keys.length) {
    await env.DB.prepare(`UPDATE shops SET ${keys.map((k) => `${k}=?`).join(",")} WHERE id=?`).bind(...keys.map((k) => f[k]), shop.id).run();
  }
  if (b.gallery !== undefined) {
    const keep = parseIds(f.gallery);
    const oldGallery = await env.DB.prepare("SELECT * FROM media WHERE shop_id=? AND kind='gallery'").bind(shop.id).all();
    const obsolete = oldGallery.results.filter((m) => !keep.includes(m.id));
    if (obsolete.length) await deleteMedia(env, obsolete);
  }
  if (toDelete.length) await deleteMedia(env, toDelete);
  const fresh = await env.DB.prepare("SELECT * FROM shops WHERE id=?").bind(shop.id).first();
  return json({ shop: await publicShop(env, fresh) });
}

async function apiPassword(request, env, auth) {
  const b = await readJson(request);
  if (!b) return fail("Requête invalide");
  const u = await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(auth.user.id).first();
  if (!(await verifyPassword(String(b.old || ""), u.pass))) return fail("Ancien mot de passe incorrect.");
  if (String(b.new || "").length < 6) return fail("Le nouveau mot de passe doit avoir au moins 6 caractères.");
  await env.DB.prepare("UPDATE users SET pass=? WHERE id=?").bind(await hashPassword(String(b.new)), u.id).run();
  return json({ ok: true });
}

// ---------- API : produits ----------
function productOut(p) {
  return {
    id: p.id, name: p.name, description: p.description, price: p.price, promo_price: p.promo_price,
    stock: p.stock, active: !!p.active, photos: parseIds(p.photos),
  };
}
async function validateProduct(env, shop, b, existing) {
  const config = await platformConfig(env);
  const plan = config.plans[shop.plan] || config.plans.essentiel;
  const f = {};
  const name = b.name !== undefined ? str(b.name, 80) : existing?.name;
  if (!name) return { error: "Entrez le nom du produit." };
  f.name = name;
  if (b.description !== undefined) f.description = str(b.description, 500);
  const price = b.price !== undefined ? intOrNull(b.price) : existing?.price;
  if (price === null || Number.isNaN(price) || price < 0 || price > 100000000) return { error: "Prix invalide." };
  f.price = price;
  if (b.promo_price !== undefined) {
    const pp = intOrNull(b.promo_price);
    if (Number.isNaN(pp) || (pp !== null && (pp < 0 || pp >= price))) return { error: "Le prix promo doit être inférieur au prix normal." };
    f.promo_price = pp;
  }
  if (b.stock !== undefined) {
    const s = intOrNull(b.stock);
    if (Number.isNaN(s) || (s !== null && (s < 0 || s > 1000000))) return { error: "Stock invalide." };
    f.stock = s;
  }
  if (b.active !== undefined) f.active = b.active ? 1 : 0;
  if (b.photos !== undefined) {
    if (!Array.isArray(b.photos)) return { error: "Photos invalides." };
    const ids = [...new Set(b.photos.map(Number).filter(Number.isFinite))];
    if (ids.length > plan.photos) return { error: `Votre formule permet ${plan.photos} photo${plan.photos > 1 ? "s" : ""} par produit.` };
    for (const id of ids) {
      const m = await env.DB.prepare("SELECT 1 x FROM media WHERE id=? AND shop_id=? AND kind='product'").bind(id, shop.id).first();
      if (!m) return { error: "Photo introuvable, réessayez de l'envoyer." };
    }
    f.photos = JSON.stringify(ids);
  }
  return { f };
}
async function attachPhotos(env, shop, productId, ids) {
  // Rattache les photos au produit et supprime celles qui ne servent plus
  const keep = new Set(ids);
  const rows = await env.DB.prepare("SELECT * FROM media WHERE shop_id=? AND kind='product' AND product_id=?").bind(shop.id, productId).all();
  await deleteMedia(env, rows.results.filter((m) => !keep.has(m.id)));
  for (const id of ids) await env.DB.prepare("UPDATE media SET product_id=? WHERE id=? AND shop_id=?").bind(productId, id, shop.id).run();
}
async function apiProducts(request, env, auth, parts) {
  const shop = auth.shop;
  const config = await platformConfig(env);
  const plan = config.plans[shop.plan] || config.plans.essentiel;
  const method = request.method;
  if (method === "GET" && parts.length === 2) {
    const r = await env.DB.prepare("SELECT * FROM products WHERE shop_id=? ORDER BY id DESC").bind(shop.id).all();
    return json({ products: r.results.map(productOut) });
  }
  if (method === "POST" && parts.length === 2) {
    const usage = await usageOf(env, shop);
    if (usage.products >= plan.products) return fail(`Votre formule ${plan.label} permet ${plan.products} produits. Contactez l'administrateur pour passer à la formule supérieure.`);
    const b = await readJson(request);
    if (!b) return fail("Requête invalide");
    const { f, error } = await validateProduct(env, shop, b, null);
    if (error) return fail(error);
    const res = await env.DB.prepare(
      "INSERT INTO products(shop_id, name, description, price, promo_price, stock, active, photos, created_at) VALUES(?,?,?,?,?,?,?,?,?)"
    )
      .bind(shop.id, f.name, f.description || "", f.price, f.promo_price ?? null, f.stock ?? null, f.active ?? 1, f.photos || "[]", now())
      .run();
    const id = res.meta.last_row_id;
    await attachPhotos(env, shop, id, parseIds(f.photos));
    const p = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first();
    return json({ product: productOut(p) });
  }
  const id = parseInt(parts[2], 10);
  const existing = await env.DB.prepare("SELECT * FROM products WHERE id=? AND shop_id=?").bind(id, shop.id).first();
  if (!existing) return fail("Produit introuvable", 404);
  if (method === "PUT") {
    const b = await readJson(request);
    if (!b) return fail("Requête invalide");
    const { f, error } = await validateProduct(env, shop, b, existing);
    if (error) return fail(error);
    const keys = Object.keys(f);
    await env.DB.prepare(`UPDATE products SET ${keys.map((k) => `${k}=?`).join(",")} WHERE id=?`).bind(...keys.map((k) => f[k]), id).run();
    if (f.photos !== undefined) await attachPhotos(env, shop, id, parseIds(f.photos));
    const p = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first();
    return json({ product: productOut(p) });
  }
  if (method === "DELETE") {
    const rows = await env.DB.prepare("SELECT * FROM media WHERE shop_id=? AND product_id=?").bind(shop.id, id).all();
    await deleteMedia(env, rows.results);
    await env.DB.prepare("DELETE FROM products WHERE id=?").bind(id).run();
    return json({ ok: true });
  }
  return fail("Méthode non permise", 405);
}

// ---------- API : photos ----------
async function apiUpload(request, env, auth) {
  const shop = auth.shop;
  if (!env.IMAGES) return fail("Le stockage des photos n'est pas encore activé.", 503);
  const config = await platformConfig(env);
  const plan = config.plans[shop.plan] || config.plans.essentiel;
  const kind = new URL(request.url).searchParams.get("kind");
  if (!["product", "logo", "banner", "gallery"].includes(kind)) return fail("Type de photo invalide.");
  if (kind === "banner" && !plan.custom) return fail("La bannière est disponible à partir de la formule Standard.");
  if (kind === "gallery") {
    const galleryMedia = await env.DB.prepare("SELECT COUNT(*) n FROM media WHERE shop_id=? AND kind='gallery'").bind(shop.id).first();
    if (galleryMedia.n >= 10) return fail("Trop de photos temporaires. Enregistrez ou retirez des photos avant d'en ajouter.");
  }
  const buf = await request.arrayBuffer();
  if (buf.byteLength === 0) return fail("Photo vide.");
  if (buf.byteLength > MAX_IMG_BYTES) return fail("Photo trop lourde. Choisissez une photo plus petite.");
  const type = detectImage(new Uint8Array(buf.slice(0, 16)));
  if (!type) return fail("Format de photo non reconnu.");
  const usage = await usageOf(env, shop);
  if (usage.bytes + buf.byteLength > plan.storageMb * 1024 * 1024) return fail("Espace photos plein pour votre formule. Supprimez des photos ou passez à la formule supérieure.");
  // Nettoyage des photos envoyées mais jamais utilisées (plus d'un jour)
  const stale = await env.DB.prepare("SELECT * FROM media WHERE shop_id=? AND kind='product' AND product_id IS NULL AND created_at<?").bind(shop.id, now() - 86400).all();
  if (stale.results.length) await deleteMedia(env, stale.results);
  const key = `s${shop.id}/${randomHex(10)}`;
  await env.IMAGES.put(key, buf, { httpMetadata: { contentType: type } });
  const r = await env.DB.prepare("INSERT INTO media(shop_id, r2_key, bytes, kind, created_at) VALUES(?,?,?,?,?)").bind(shop.id, key, buf.byteLength, kind, now()).run();
  return json({ id: r.meta.last_row_id, url: `/img/${r.meta.last_row_id}` });
}

// ---------- API : commandes, ventes, statistiques ----------
async function apiOrders(request, env, auth, parts) {
  const shop = auth.shop;
  if (request.method === "GET" && parts.length === 2) {
    const pend = await env.DB.prepare("SELECT id, product_id, product_name, qty, unit_price, created_at FROM orders WHERE shop_id=? AND status='pending' ORDER BY id DESC LIMIT 100").bind(shop.id).all();
    const hist = await env.DB.prepare("SELECT id, product_name, qty, unit_price, status, source, created_at FROM orders WHERE shop_id=? AND status!='pending' ORDER BY id DESC LIMIT 30").bind(shop.id).all();
    return json({ pending: pend.results, history: hist.results });
  }
  if (request.method === "POST" && parts.length === 4) {
    const id = parseInt(parts[2], 10);
    const action = parts[3];
    const o = await env.DB.prepare("SELECT * FROM orders WHERE id=? AND shop_id=?").bind(id, shop.id).first();
    if (!o) return fail("Commande introuvable", 404);
    if (o.status !== "pending") return fail("Cette commande a déjà été traitée.");
    if (action === "cancel") {
      await env.DB.prepare("UPDATE orders SET status='cancelled' WHERE id=? AND status='pending'").bind(id).run();
      return json({ ok: true });
    }
    if (action === "sold") {
      const r = await env.DB.prepare("UPDATE orders SET status='sold' WHERE id=? AND status='pending'").bind(id).run();
      let stock = null;
      if (r.meta.changes === 1 && o.product_id) {
        await env.DB.prepare(
          "UPDATE products SET stock = CASE WHEN stock IS NULL THEN NULL WHEN stock - ? < 0 THEN 0 ELSE stock - ? END WHERE id=? AND shop_id=?"
        ).bind(o.qty, o.qty, o.product_id, shop.id).run();
        const p = await env.DB.prepare("SELECT stock, name FROM products WHERE id=?").bind(o.product_id).first();
        if (p) stock = { name: p.name, stock: p.stock };
      }
      return json({ ok: true, product: stock });
    }
  }
  return fail("Action inconnue", 404);
}

async function apiSale(request, env, auth) {
  const shop = auth.shop;
  const b = await readJson(request);
  if (!b || !Array.isArray(b.items) || !b.items.length || b.items.length > 50) return fail("Aucun article.");
  const out = [];
  for (const it of b.items) {
    const qty = Math.max(1, Math.min(10000, parseInt(it.qty, 10) || 1));
    const price = intOrNull(it.price);
    if (Number.isNaN(price) || price === null || price < 0) return fail("Prix invalide.");
    let name = str(it.name, 80);
    let pid = null;
    if (it.product_id) {
      const p = await env.DB.prepare("SELECT * FROM products WHERE id=? AND shop_id=?").bind(parseInt(it.product_id, 10), shop.id).first();
      if (!p) return fail("Produit introuvable.");
      pid = p.id;
      name = p.name;
      if (p.stock !== null && qty > p.stock) return fail(`Stock insuffisant pour « ${p.name} » (il en reste ${p.stock}).`);
    }
    if (!name) return fail("Nom d'article manquant.");
    out.push({ pid, name, qty, price });
  }
  for (const it of out) {
    await env.DB.prepare("INSERT INTO orders(shop_id, product_id, product_name, qty, unit_price, status, source, created_at) VALUES(?,?,?,?,?,'sold','direct',?)")
      .bind(shop.id, it.pid, it.name, it.qty, it.price, now())
      .run();
    if (it.pid) {
      await env.DB.prepare("UPDATE products SET stock = CASE WHEN stock IS NULL THEN NULL WHEN stock - ? < 0 THEN 0 ELSE stock - ? END WHERE id=? AND shop_id=?")
        .bind(it.qty, it.qty, it.pid, shop.id)
        .run();
    }
  }
  return json({ ok: true });
}

async function apiStats(env, auth) {
  const shop = auth.shop;
  const d7 = dayStr(6);
  const d30 = dayStr(29);
  const s7 = await env.DB.prepare("SELECT COALESCE(SUM(visits),0) v, COALESCE(SUM(clicks),0) c FROM stats WHERE shop_id=? AND day>=?").bind(shop.id, d7).first();
  const s30 = await env.DB.prepare("SELECT COALESCE(SUM(visits),0) v, COALESCE(SUM(clicks),0) c FROM stats WHERE shop_id=? AND day>=?").bind(shop.id, d30).first();
  const since = now() - 30 * 86400;
  const sales = await env.DB.prepare("SELECT COUNT(*) n, COALESCE(SUM(qty*unit_price),0) total FROM orders WHERE shop_id=? AND status='sold' AND created_at>=?").bind(shop.id, since).first();
  const top = await env.DB.prepare("SELECT product_name name, SUM(qty) q FROM orders WHERE shop_id=? AND status!='cancelled' AND created_at>=? GROUP BY product_name ORDER BY q DESC LIMIT 5").bind(shop.id, since).all();
  const low = await env.DB.prepare("SELECT id, name, stock FROM products WHERE shop_id=? AND stock IS NOT NULL AND stock<=3 AND active=1 ORDER BY stock LIMIT 20").bind(shop.id).all();
  return json({ week: s7, month: s30, sales, top: top.results, low: low.results });
}

async function apiExport(env, auth) {
  const shop = auth.shop;
  const p = await env.DB.prepare("SELECT * FROM products WHERE shop_id=?").bind(shop.id).all();
  const o = await env.DB.prepare("SELECT * FROM orders WHERE shop_id=? ORDER BY id DESC LIMIT 5000").bind(shop.id).all();
  const data = { exporte_le: new Date().toISOString(), boutique: await publicShop(env, shop), produits: p.results, commandes: o.results.map(({ ip, ...r }) => r) };
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8", "content-disposition": `attachment; filename="${shop.slug}-donnees.json"`, "cache-control": "no-store" },
  });
}

// ---------- API : administration ----------
async function apiAdminBranding(request, env) {
  if (request.method === "GET") {
    const rows = await env.DB.prepare("SELECT key, value FROM platform_settings").all();
    const settings = Object.fromEntries(rows.results.map((r) => [r.key, r.value]));
    const assets = await env.DB.prepare("SELECT kind, updated_at FROM platform_assets").all();
    const config = await platformConfig(env);
    return json({ settings, assets: assets.results, plans: config.plans, trialDays: config.trialDays });
  }
  if (request.method === "POST" && new URL(request.url).searchParams.has("kind")) {
    const kind = new URL(request.url).searchParams.get("kind");
    if (!["logo", "hero", "icon"].includes(kind)) return fail("Type de visuel invalide.");
    const buf = await request.arrayBuffer();
    if (!buf.byteLength || buf.byteLength > 2 * 1024 * 1024) return fail("Image vide ou trop lourde (maximum 2 Mo).");
    const type = detectImage(new Uint8Array(buf.slice(0, 16)));
    if (!type) return fail("Format accepté : JPG, PNG ou WebP.");
    const key = "platform/" + kind + "/" + randomHex(12);
    await env.IMAGES.put(key, buf, { httpMetadata: { contentType: type } });
    const old = await env.DB.prepare("SELECT r2_key FROM platform_assets WHERE kind=?").bind(kind).first();
    await env.DB.prepare("INSERT INTO platform_assets(kind,r2_key,content_type,updated_at) VALUES(?,?,?,?) ON CONFLICT(kind) DO UPDATE SET r2_key=excluded.r2_key,content_type=excluded.content_type,updated_at=excluded.updated_at").bind(kind,key,type,now()).run();
    if (old && old.r2_key) await env.IMAGES.delete(old.r2_key);
    return json({ ok: true, kind, url: "/platform-img/" + kind });
  }
  if (request.method === "POST") {
    const body = await readJson(request);
    if (!body) return fail("Réglages invalides.");
    const allowed = { name: 50, heroTitle: 150, heroText: 300, description: 180, primaryColor: 7, supportPhone: 20, trialDays: 2, price_essentiel: 8, price_standard: 8, price_pro: 8, products_essentiel: 5, products_standard: 5, products_pro: 5, photos_essentiel: 3, photos_standard: 3, photos_pro: 3, storageMb_essentiel: 5, storageMb_standard: 5, storageMb_pro: 5 };
    for (const [key, max] of Object.entries(allowed)) {
      if (body[key] === undefined) continue;
      const value = String(body[key]).trim().slice(0, max);
      if (key === "primaryColor" && !/^#[0-9a-fA-F]{6}$/.test(value)) return fail("La couleur doit être au format #RRGGBB.");
      if (key === "trialDays" && (!/^\d+$/.test(value) || Number(value) > 60)) return fail("La durée d’essai doit être comprise entre 0 et 60 jours.");
      if (/^(price|products|photos|storageMb)_(essentiel|standard|pro)$/.test(key) && (!/^\d+$/.test(value) || Number(value) > (key.startsWith("price_") ? 10000000 : 10000) || (!key.startsWith("price_") && Number(value) < 1))) return fail("Valeur de formule invalide.");
      if (key === "supportPhone" && value && !/^\+?[0-9]{8,15}$/.test(value.replace(/[ .-]/g, ""))) return fail("Numéro de support invalide.");
      await env.DB.prepare("INSERT INTO platform_settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(key, value).run();
    }
    return json({ ok: true });
  }
  return fail("Méthode non permise.", 405);
}
async function apiAdmin(request, env, auth, parts) {
  if (!auth.user.is_admin) return fail("Accès refusé", 403);
  if (parts[2] === "branding") return apiAdminBranding(request, env);
  if (request.method === "GET" && parts[2] === "shops") {
    const r = await env.DB.prepare(
      `SELECT s.id, s.slug, s.name, s.whatsapp, s.plan, s.status, s.paid_until, s.created_at,
       (SELECT COUNT(*) FROM products WHERE shop_id=s.id) pc,
       (SELECT COALESCE(SUM(bytes),0) FROM media WHERE shop_id=s.id) bytes,
       (SELECT COUNT(*) FROM orders WHERE shop_id=s.id AND status='pending') po,
       (SELECT COALESCE(SUM(visits),0) FROM stats WHERE shop_id=s.id AND day>=?) v30,
       (SELECT COUNT(*) FROM orders WHERE shop_id=s.id AND status='sold') sold,
       (SELECT is_admin FROM users WHERE id=s.user_id) is_admin
       FROM shops s ORDER BY s.id DESC`
    ).bind(dayStr(29)).all();
    const tot = await env.DB.prepare("SELECT COALESCE(SUM(bytes),0) n FROM media").first();
    const config = await platformConfig(env);
    return json({ shops: r.results, plans: config.plans, trialDays: config.trialDays, totalBytes: tot.n, now: now() });
  }
  if (request.method === "GET" && parts[2] === "overview") {
    const config = await platformConfig(env);
    const t = now();
    const d30 = dayStr(29);
    const q = async (sql, ...b) => (await env.DB.prepare(sql).bind(...b).first()) || {};
    const byPlan = await env.DB.prepare(
      `SELECT plan, COUNT(*) total,
        SUM(CASE WHEN status='active' AND (paid_until IS NULL OR paid_until>=?) THEN 1 ELSE 0 END) paying_or_trial,
        SUM(CASE WHEN status='active' AND paid_until<? THEN 1 ELSE 0 END) expired,
        SUM(CASE WHEN status!='active' THEN 1 ELSE 0 END) off
       FROM shops GROUP BY plan`
    ).bind(t, t).all();
    const byStatus = await env.DB.prepare("SELECT status, COUNT(*) n FROM shops GROUP BY status").all();
    const trial = await q("SELECT COUNT(*) n FROM shops WHERE status='active' AND paid_until>=? AND paid_until<=created_at+?", t, config.trialDays * 86400 + 60);
    const su7 = await q("SELECT COUNT(*) n FROM shops WHERE created_at>=?", t - 7 * 86400);
    const su30 = await q("SELECT COUNT(*) n FROM shops WHERE created_at>=?", t - 30 * 86400);
    const days = await env.DB.prepare("SELECT strftime('%Y-%m-%d', created_at+3600, 'unixepoch') d, COUNT(*) n FROM shops WHERE created_at>=? GROUP BY d").bind(t - 14 * 86400).all();
    const prod = await q("SELECT COUNT(*) n FROM products");
    const pend = await q("SELECT COUNT(*) n FROM orders WHERE status='pending'");
    const sales = await q("SELECT COUNT(*) n, COALESCE(SUM(qty*unit_price),0) total FROM orders WHERE status='sold' AND created_at>=?", t - 30 * 86400);
    const traf = await q("SELECT COALESCE(SUM(visits),0) v, COALESCE(SUM(clicks),0) c FROM stats WHERE day>=?", d30);
    const bytes = await q("SELECT COALESCE(SUM(bytes),0) n FROM media");
    const users = await q("SELECT COUNT(*) n FROM users");
    const series = {};
    for (const r of days.results) series[r.d] = r.n;
    const signups14 = [];
    for (let i = 13; i >= 0; i--) {
      const k = dayStr(i);
      signups14.push({ d: k, n: series[k] || 0 });
    }
    return json({
      plans: config.plans, trialDays: config.trialDays, users: users.n, byPlan: byPlan.results, byStatus: byStatus.results, trial: trial.n,
      signups7: su7.n, signups30: su30.n, signups14, products: prod.n, pendingOrders: pend.n,
      sales30: { n: sales.n, total: sales.total }, visits30: traf.v, clicks30: traf.c, totalBytes: bytes.n, now: t,
    });
  }
  if (request.method === "GET" && parts[2] === "export") {
    const s = await env.DB.prepare("SELECT * FROM shops").all();
    const p = await env.DB.prepare("SELECT * FROM products").all();
    const o = await env.DB.prepare("SELECT id, shop_id, product_id, product_name, qty, unit_price, status, source, created_at FROM orders ORDER BY id DESC LIMIT 20000").all();
    const u = await env.DB.prepare("SELECT id, phone, is_admin, created_at FROM users").all();
    return new Response(JSON.stringify({ exporte_le: new Date().toISOString(), utilisateurs: u.results, boutiques: s.results, produits: p.results, commandes: o.results }, null, 2), {
      headers: { "content-type": "application/json; charset=utf-8", "content-disposition": 'attachment; filename="sauvegarde-complete.json"', "cache-control": "no-store" },
    });
  }
  if (request.method === "POST" && parts[2] === "shops" && parts[3]) {
    const id = parseInt(parts[3], 10);
    const shop = await env.DB.prepare("SELECT * FROM shops WHERE id=?").bind(id).first();
    if (!shop) return fail("Boutique introuvable", 404);
    if (parts[4] === "reset") {
      const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
      const bytes = crypto.getRandomValues(new Uint8Array(8));
      const temp = [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
      await env.DB.prepare("UPDATE users SET pass=? WHERE id=?").bind(await hashPassword(temp), shop.user_id).run();
      await env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(shop.user_id).run();
      await env.DB.prepare("DELETE FROM login_fails WHERE phone=(SELECT phone FROM users WHERE id=?)").bind(shop.user_id).run();
      return json({ password: temp });
    }
    const b = await readJson(request);
    if (!b) return fail("Requête invalide");
    if (b.plan !== undefined) {
      if (!PLANS[b.plan]) return fail("Formule inconnue.");
      await env.DB.prepare("UPDATE shops SET plan=? WHERE id=?").bind(b.plan, id).run();
    }
    if (b.status !== undefined) {
      if (!["active", "suspended", "blocked"].includes(b.status)) return fail("Statut inconnu.");
      const owner = await env.DB.prepare("SELECT is_admin FROM users WHERE id=?").bind(shop.user_id).first();
      if (owner && owner.is_admin && b.status !== "active") return fail("Le compte administrateur ne peut pas être suspendu ni bloqué.");
      await env.DB.prepare("UPDATE shops SET status=? WHERE id=?").bind(b.status, id).run();
      if (b.status === "blocked") await env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(shop.user_id).run();
    }
    if (b.add_days !== undefined) {
      const days = Math.max(1, Math.min(366, parseInt(b.add_days, 10) || 30));
      const base = Math.max(now(), shop.paid_until || 0);
      await env.DB.prepare("UPDATE shops SET paid_until=?, status='active' WHERE id=?").bind(base + days * 86400, id).run();
    }
    return json({ ok: true });
  }
  return fail("Action inconnue", 404);
}

// ---------- Routage ----------
async function route(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method;
  const parts = path.split("/").filter(Boolean);

  if (method === "GET") {
    if (path === "/") return homePage(request, env);
    if (path === "/app") return appPage(env);
    if (path === "/admin" || path === "/proprietaire" || path === "/owner") return adminPage(env);
    if (path === "/manifest.webmanifest") return new Response(JSON.stringify({
      id: "/", name: env.PLATFORM_NAME || "Boutiko", short_name: "Boutiko",
      description: "Gérez votre boutique en ligne depuis votre téléphone.",
      start_url: "/app", scope: "/", display: "standalone", orientation: "portrait",
      background_color: "#f5f6fa", theme_color: "#27338f",
      icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }]
    }), { headers: { "content-type": "application/manifest+json; charset=utf-8", "cache-control": "public, max-age=3600" } });
    if (path === "/icon.svg") return new Response(PWA_ICON, { headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" } });
    if (path === "/sw.js") return new Response(PWA_SW, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-cache" } });
    if (path === "/style.css") return new Response(STYLE_CSS, { headers: { "content-type": "text/css; charset=utf-8", "cache-control": "public, max-age=31536000, immutable" } });
    const js = { "/app.js": APP_JS, "/admin.js": ADMIN_JS, "/shop.js": SHOP_JS }[path];
    if (js) return new Response(js, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=31536000, immutable" } });
    if (path === "/robots.txt") return new Response("User-agent: *\nDisallow: /app\nDisallow: /admin\nDisallow: /api/\n", { headers: { "content-type": "text/plain" } });
    if (path === "/favicon.ico") return new Response(null, { status: 204 });
    if (parts[0] === "template-img" && parts[1]) {
      if (!TEMPLATES[parts[1]]) return new Response("Not found", { status: 404 });
      return new Response(templateArtwork(parts[1]), { headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    }
    if (parts[0] === "template-product-img" && parts[1] && parts[2] !== undefined) {
      if (!TEMPLATES[parts[1]] || !/^\\d+$/.test(parts[2]) || Number(parts[2]) > 2) return new Response("Not found", { status: 404 });
      return new Response(templateArtwork(parts[1], "product", Number(parts[2])), { headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    }
    if (parts[0] === "img" && parts[1]) return serveImage(env, parts[1]);
    if (parts[0] === "platform-img" && parts[1]) return servePlatformImage(env, parts[1]);
    if (parts[0] === "qr" && parts[1]) {
      const s = await env.DB.prepare("SELECT slug FROM shops WHERE slug=?").bind(parts[1]).first();
      return s ? serveQr(request, env, s.slug) : new Response("Not found", { status: 404 });
    }
  }

  if (parts[0] === "api") {
    if (method === "POST" && path === "/api/order") return apiOrder(request, env, ctx);
    if (method === "POST" && path === "/api/register") return apiRegister(request, env);
    if (method === "POST" && path === "/api/login") return apiLogin(request, env);
    if (method === "POST" && path === "/api/admin/login") return apiAdminLogin(request, env);
    if (method === "POST" && path === "/api/admin/logout") return apiAdminLogout(request, env);
    if (parts[1] === "admin") {
      if (method !== "GET" && request.headers.get("x-requested-with") !== "boutiko") return fail("Requête refusée", 403);
      const ownerAuth = await getOwnerAuth(request, env);
      if (!ownerAuth) return fail("Connexion propriétaire requise.", 401);
      return apiAdmin(request, env, ownerAuth, parts);
    }
    // Toutes les routes suivantes demandent d'être connecté
    if (method !== "GET" && request.headers.get("x-requested-with") !== "boutiko") return fail("Requête refusée", 403);
    if (method === "POST" && path === "/api/logout") return apiLogout(request, env);
    const auth = await getAuth(request, env);
    if (path === "/api/me" && method === "GET" && (!auth || !auth.shop)) return json({ guest: true });
    if (!auth) return fail("Veuillez vous connecter.", 401);
    if (!auth.shop) return fail("Boutique introuvable.", 404);
    if (path === "/api/me" && method === "GET") return apiMe(env, auth);
    if (path === "/api/shop" && method === "PUT") return apiShopUpdate(request, env, auth);
    if (path === "/api/password" && method === "POST") return apiPassword(request, env, auth);
    if (parts[1] === "products") return apiProducts(request, env, auth, parts);
    if (path === "/api/upload" && method === "POST") return apiUpload(request, env, auth);
    if (parts[1] === "orders") return apiOrders(request, env, auth, parts);
    if (path === "/api/sale" && method === "POST") return apiSale(request, env, auth);
    if (path === "/api/stats" && method === "GET") return apiStats(env, auth);
    if (path === "/api/export" && method === "GET") return apiExport(env, auth);
    return fail("Action inconnue", 404);
  }

  if (method === "GET" && parts[0] === "modele" && parts[1] && /^[a-z0-9-]+$/.test(parts[1])) {
    return modelDemoPage(request, env, parts[1]);
  }
  if (method === "GET" && parts.length === 1 && /^[a-z0-9-]+$/.test(parts[0]) && !RESERVED.has(parts[0])) {
    return shopPage(request, env, ctx, parts[0]);
  }
  return notFound(env);
}

export default {
  async fetch(request, env, ctx) {
    try {
      await ensureSchema(env);
      return await route(request, env, ctx);
    } catch (e) {
      console.error("Erreur", e && e.stack ? e.stack : e);
      if (new URL(request.url).pathname.startsWith("/api/")) return fail("Une erreur est survenue. Réessayez dans un instant.", 500);
      return html(
        layout({ title: "Erreur", noindex: true, body: `<main class="wrap center"><h1>Oups</h1><p class="muted">Une erreur est survenue. Réessayez dans un instant.</p><a class="btn" href="/">Accueil</a></main>` }),
        500
      );
    }
  },
};
