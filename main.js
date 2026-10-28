// ---- EDIT THESE ----
const SOCIALS = [
  // { label: "YouTube", url: "https://..." },
  { label: "Instagram", url: "https://www.instagram.com/omio_s_tudio" },
  { label: "Facebook", url: "https://www.facebook.com/share/19sqACyyZp/" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/rubaiet-ahmed-omio-3a3b49198/" },
];

// cat: "long" | "short" | "local". url: YouTube (watch / youtu.be / shorts) or Instagram reel/post link.
const VIDEOS = [
  { cat: "short", title: "Short video 2", label: "Short form", url: "https://drive.google.com/file/d/128M1zVUevE5FePbhJwMR1r2zL9Ql68j1/view" },
  { cat: "long", title: "BSL1", label: "Long form", url: "https://drive.google.com/file/d/1ieX58ZK_xfzDTNh1zGmDmVGdXI91CrJ6/view" },
  { cat: "long", title: "BSL2", label: "Long form", url: "https://drive.google.com/file/d/1g2aCH-8LXz_f0FT2RX-PuiIOwO6OK52Q/view" },
  { cat: "long", title: "BSL3", label: "Long form", url: "https://drive.google.com/file/d/1-CQmgWP6clx96LFVgcMLfPT2fiOnVt6z/view" },
  { cat: "long", title: "BSL4", label: "Long form", url: "https://drive.google.com/file/d/18Yv2dhT-VgQmqccPuQJ0XF23UPCUtr_R/view" },
  { cat: "short", title: "Short video 3", label: "Short form", url: "https://www.instagram.com/reel/DZU0_QQSCB5/" },
  { cat: "local", title: "Local client 1", url: "https://drive.google.com/file/d/1PQ-E5zyFq6XL4ejIWu-hs9fY9v9yPKYw/view" },
  { cat: "local", title: "Local client 2", url: "https://drive.google.com/file/d/1bxjrePVs7vAdruxivac2zPjj86J_YXNV/view" },
  { cat: "local", title: "Local client 3", url: "https://drive.google.com/file/d/1vPMjJGQAPTfIkdBiuB7g9KCJ4fP2Dc_I/view" },
  { cat: "short", title: "Short video 1", label: "Short form", url: "https://drive.google.com/file/d/10GJ-bI2KORyXrJtDOz8JDAEfTALFOcof/view" },
  // { cat: "long", title: "Video title", label: "Client / type", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX" },
];
// --------------------

const GROUPS = [
  { id: "long", name: "Long Form", cls: "f-long", vertical: false },
  { id: "short", name: "Short Form", cls: "f-short", vertical: true },
  { id: "local", name: "Local Client", cls: "f-local", vertical: false },
];

function parseVideo(url) {
  let m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return { kind: "yt", id: m[1] };
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (m) return { kind: "drive", id: m[1] };
  m = url.match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);
  if (m) return { kind: "ig", id: m[2], type: m[1] };
  return null;
}
const embedUrl = (v) =>
  v.kind === "yt"
    ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`
    : v.kind === "drive"
    ? `https://drive.google.com/file/d/${v.id}/preview`
    : `https://www.instagram.com/${v.type}/${v.id}/embed`;

// Instagram embeds get cropped (header/footer hidden) so only the video shows
const iframeHtml = (p, extra = "") =>
  `<iframe class="${p.kind === "ig" ? "ig" : ""}" src="${embedUrl(p)}" ${extra} allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen scrolling="no"></iframe>`;
const setIg = (el, p) => el.classList.toggle("ig-crop", p.kind === "ig");

// each video's frame follows its own ratio (width / height)
const RATIO = {};
const ratioOf = (p) => (p.kind === "ig" ? 9 / 16 : RATIO[p.id] || 16 / 9);
function fitModal(p) {
  const r = ratioOf(p);
  frame.style.aspectRatio = String(r);
  box.style.width = `min(900px, calc(80vh * ${r} + 20px), 100%)`;
}

// socials
const socialHtml = SOCIALS.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join("");
document.querySelectorAll(".socials").forEach((el) => (el.innerHTML = socialHtml));
document.querySelector(".nav .dots").innerHTML = SOCIALS.map(
  (s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}"></a>`
).join("");

// work groups
const mount = document.getElementById("groups");
GROUPS.forEach((g) => {
  const list = VIDEOS.filter((v) => v.cat === g.id);
  const cards = list.length
    ? list.map((v, i) => {
        const p = parseVideo(v.url);
        const thumb = p && p.kind === "yt"
          ? `<img loading="lazy" src="https://img.youtube.com/vi/${p.id}/hqdefault.jpg" alt="">`
          : p && p.kind === "drive"
          ? `<img loading="lazy" src="thumb-${p.id}.jpg" alt="">`
          : `<span class="hand reel-label">reel</span><img class="cover" loading="lazy" src="thumb-${p.id}.png" alt="" onerror="this.remove()">`;
        return `<button class="card" data-cat="${g.id}" data-i="${i}" aria-label="${v.title}">
          <div class="thumb" ${p && p.kind === "ig" ? 'style="aspect-ratio: 9 / 16"' : ""}>${thumb}<div class="play">▶</div></div></button>`;
      }).join("")
    : [1, 2, 3].map(() => `<div class="card placeholder"><div class="thumb">video coming soon</div></div>`).join("");
  mount.insertAdjacentHTML(
    "beforeend",
    `<div class="group" id="g-${g.id}"><div class="group-title ${g.cls}">${g.name}</div>
     <div class="grid ${g.vertical ? "vertical" : ""}">${cards}</div></div>`
  );
});

// read each Drive thumbnail's real ratio and shape its card to match
VIDEOS.forEach((v, n) => {
  const p = parseVideo(v.url);
  if (!p || p.kind !== "drive") return;
  const im = new Image();
  im.onload = () => {
    RATIO[p.id] = im.naturalWidth / im.naturalHeight;
    document.querySelectorAll(`.card img[src$="thumb-${p.id}.jpg"]`).forEach((el) => {
      el.parentElement.style.aspectRatio = String(RATIO[p.id]);
    });
  };
  im.src = `thumb-${p.id}.jpg`;
});

// modal
const modal = document.getElementById("modal");
const box = modal.querySelector(".modal-box");
const frame = modal.querySelector(".frame");
function closeModal() { modal.classList.remove("open"); frame.innerHTML = ""; }
mount.addEventListener("click", (e) => {
  const c = e.target.closest(".card[data-cat]");
  if (!c) return;
  const g = GROUPS.find((x) => x.id === c.dataset.cat);
  const v = VIDEOS.filter((x) => x.cat === g.id)[c.dataset.i];
  const p = v && parseVideo(v.url);
  if (!p) return;
  setIg(frame, p);
  fitModal(p);
  frame.innerHTML = iframeHtml(p);
  modal.classList.add("open");
});
modal.addEventListener("click", (e) => { if (e.target === modal || e.target.classList.contains("close")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// featured main reel: opens from the name (tap/hover/Enter) and loads inline when About scrolls into view
const FEATURED = "https://www.instagram.com/reel/DejvlE3Ss0t/";
const feat = parseVideo(FEATURED);
function openFeatured() {
  setIg(frame, feat);
  fitModal(feat);
  frame.innerHTML = iframeHtml(feat);
  modal.classList.add("open");
}
const nameBtn = document.getElementById("nameBtn");
nameBtn.addEventListener("click", openFeatured);
nameBtn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFeatured(); } });
let nameHoverTimer;
nameBtn.addEventListener("mouseenter", () => { nameHoverTimer = setTimeout(openFeatured, 700); });
nameBtn.addEventListener("mouseleave", () => clearTimeout(nameHoverTimer));

const reelFrame = document.getElementById("reelFrame");
function loadReel() { setIg(reelFrame, feat); reelFrame.innerHTML = iframeHtml(feat, 'loading="lazy"'); }
document.getElementById("reelPlay").addEventListener("click", loadReel);
new IntersectionObserver((en, ob) => { if (en[0].isIntersecting) { loadReel(); ob.disconnect(); } }, { threshold: 0.4 })
  .observe(document.getElementById("about"));

// photo fallback
const img = document.getElementById("photo");
function photoFallback() {
  const d = document.createElement("div");
  d.className = "photo";
  d.textContent = "your photo here";
  img.replaceWith(d);
}
img.addEventListener("error", photoFallback);
if (img.complete && img.naturalWidth === 0) photoFallback();

// nav highlight
const links = [...document.querySelectorAll(".nav > a[href^='#']")];
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
  });
}, { threshold: 0.2 });
["home", "about", "work"].forEach((id) => io.observe(document.getElementById(id)));
