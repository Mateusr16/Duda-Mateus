/* =====================================================================
   CÓDIGO DA PÁGINA — faz tudo funcionar. Normalmente você não edita aqui.

   Ele lê:  config.js (textos)  +  assets/js/galeria.js (lista de arquivos)
   e monta a página. Seções deste arquivo:
     1. Atalhos e caminhos das pastas
     2. Dados de demonstração (usados só quando uma pasta está vazia)
     3. Preenchimento dos textos
     4. Vídeo da primeira tela e capa
     5. Fotos, filtros e vídeos
     6. Efeitos (aparecer ao rolar, parallax, poeira dourada)
     7. Música
     8. Abertura da entrega
     9. Janela de visualização (lightbox) e compartilhar
   ===================================================================== */
(function () {
"use strict";

/* ---------- 1. Atalhos e caminhos das pastas ---------- */
const C = window.CONFIG || {};
const G = window.GALERIA || {};
const T = C.textos || {};
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const setText = (id, v) => { const el = $(id); if (el && v != null && v !== "") el.textContent = v; };

const PASTA = {
  fotos:  "assets/fotos/",
  intro:  "assets/video/intro/",
  videos: "assets/video/entrega/",
  musica: "assets/musica/",
  capa:   "assets/capa/"
};
const caminho = (base, ...partes) => base + partes.map(encodeURIComponent).join("/");
const allowDemo = C.mostrarDemo !== false;

/* ---------- 2. Dados de demonstração ---------- */
const un = (id, w, q) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;
const DEMO = {
  fotos: ["photo-1519741497674-611481863552","photo-1511285560929-80b456fea0bc","photo-1537633552985-df8429e8048b","photo-1523438885200-e635ba2c371e","photo-1529636798458-92182e662485","photo-1519225421980-715cb0215aed","photo-1511988617509-a57c8a288659","photo-1464366400600-7168b8af9bc3","photo-1520857014576-2c4f4c972b57","photo-1507504031003-b417219a0fde","photo-1511795409834-ef04bbd61622","photo-1465495976277-4387d4b0e4a6","photo-1508214751196-bcfd4ca60f91","photo-1532712938310-34cb3982ef74","photo-1515934751635-c81c6bc9a2d8","photo-1511895426328-dc8714191300"],
  cats: ["casal", "celebracao", "detalhes"],
  videoCapas: ["photo-1519741497674-611481863552","photo-1511285560929-80b456fea0bc","photo-1537633552985-df8429e8048b","photo-1523438885200-e635ba2c371e","photo-1519225421980-715cb0215aed","photo-1464366400600-7168b8af9bc3"],
  videos: ["ForBiggerJoyrides","ForBiggerEscapes","ForBiggerFun","ForBiggerMeltdowns","ForBiggerBlazes","ForBiggerLearning"].map(n => `https://storage.googleapis.com/gtv-videos-bucket/sample/${n}.mp4`),
  intro: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  capa: un("photo-1511285560929-80b456fea0bc", 2200, 90),
  introImg: un("photo-1519741497674-611481863552", 2000, 85)
};

/* ---------- 3. Textos ---------- */
const n1 = (C.noivos || {}).nome1 || "Nome 1";
const n2 = (C.noivos || {}).nome2 || "Nome 2";
document.title = `${n1} & ${n2}${C.data ? " — " + C.data : ""}`;

setText("introEyebrow", T.apresenta);
$("introNames").innerHTML = `${esc(n1)} <span>&amp;</span> ${esc(n2)}`;
setText("introDate", (C.data || "").toUpperCase());
setText("openBtn", T.botaoAbrir);
setText("introHint", T.dicaMusica);
setText("coverEyebrow", T.capaFrase);
$("coverNames").innerHTML =
  `<span class="rise" style="--d:.5s">${esc(n1)}</span>` +
  `<span class="rise amp" style="--d:.8s">&amp;</span>` +
  `<span class="rise" style="--d:1.1s">${esc(n2)}</span>`;
setText("coverDate", C.data);
setText("cueText", T.capaRolar);
setText("videosEyebrow", T.videosSobre);
setText("videosTitle", T.videosTitulo);
setText("videosSub", T.videosSub);
setText("galEyebrow", T.galeriaSobre);
setText("galTitle", T.galeriaTitulo);
setText("galSub", T.galeriaSub);
setText("letterEyebrow", T.cartaSobre);
setText("letterTitle", T.cartaTitulo);
setText("signature", T.assinatura);
if (Array.isArray(C.mensagem) && C.mensagem.length) {
  $("letterText").innerHTML = "“" + C.mensagem.map(esc).join("<br><br>") + "”";
}
$("footer").innerHTML = `${esc(T.rodape || "feito com carinho")} · <strong>${esc(n1)} &amp; ${esc(n2)}</strong>`;

/* ---------- 5 (dados). Fotos e vídeos: o que existe nas pastas ---------- */
const catsReais = Object.keys(G.fotos || {}).filter(c => (G.fotos[c] || []).length);
let photos = [];
if (catsReais.length) {
  if (C.misturarFotos !== false) {                    // alterna as categorias
    const max = Math.max(...catsReais.map(c => G.fotos[c].length));
    for (let i = 0; i < max; i++) catsReais.forEach(c => { const f = G.fotos[c][i]; if (f) photos.push({ src: caminho(PASTA.fotos, c, f), cat: c }); });
  } else {
    catsReais.forEach(c => G.fotos[c].forEach(f => photos.push({ src: caminho(PASTA.fotos, c, f), cat: c })));
  }
}
const demoFotos = !photos.length;
if (demoFotos && allowDemo) {
  photos = DEMO.fotos.map((id, i) => ({ src: un(id, 1000, 82), cat: DEMO.cats[i % 3] }));
}

let videos = (G.videos || []).map(v => ({
  src: caminho(PASTA.videos, v.arquivo),
  capa: v.capa ? caminho(PASTA.videos, v.capa) : null
}));
const demoVideos = !videos.length;
if (demoVideos && allowDemo) {
  videos = DEMO.videos.map((src, i) => ({ src, capa: un(DEMO.videoCapas[i], 850, 80) }));
}

/* ---------- 4. Vídeo da primeira tela e capa ---------- */
const capaLocal = G.capa ? caminho(PASTA.capa, G.capa) : null;
const imgCapa = capaLocal || (!demoFotos && photos[0] ? photos[0].src : (allowDemo ? DEMO.capa : null));
const imgIntro = capaLocal || (allowDemo && demoFotos ? DEMO.introImg : (photos[0] ? photos[0].src : null));
if (imgIntro) $("introBg").style.setProperty("--img", `url("${imgIntro}")`);
if (imgCapa) $("coverBg").style.setProperty("--capa", `url("${imgCapa}")`);

const introVideo = $("introVideo");
const srcIntro = G.videoIntro ? caminho(PASTA.intro, G.videoIntro) : (allowDemo ? DEMO.intro : null);
if (srcIntro) {
  if (imgIntro) introVideo.poster = imgIntro;
  introVideo.src = srcIntro;
  introVideo.addEventListener("playing", () => introVideo.classList.add("ready"));
  introVideo.play().catch(() => {});
} else {
  introVideo.remove();
}

/* ---------- 5. Montagem das grades ---------- */
const nomeCat = c => (C.nomesCategorias || {})[c] || c.replace(/[-_]+/g, " ").replace(/^./, m => m.toUpperCase());

// vídeos
const videoGrid = $("videoGrid");
if (!videos.length) $("filmes").classList.add("hide");
videos.forEach((v, i) => {
  const b = document.createElement("button");
  b.className = "video-card reveal";
  b.style.setProperty("--d", (i % 3) * .12 + "s");
  const capaHtml = v.capa
    ? `<img class="cm" loading="lazy" src="${v.capa}" alt="Capa do vídeo ${i + 1}">`
    : `<video class="cm" muted playsinline preload="metadata" src="${v.src}#t=0.8"></video>`;
  b.innerHTML = `${capaHtml}<span class="play"><span>▶</span></span><span class="video-label">Vídeo ${i + 1}</span>`;
  b.addEventListener("click", () => openMedia("video", i));
  videoGrid.appendChild(b);
});

// fotos
const photoGrid = $("photoGrid");
if (!photos.length) $("galeria").classList.add("hide");
photos.forEach((p, i) => {
  const b = document.createElement("button");
  b.className = "photo reveal";
  b.dataset.cat = p.cat;
  b.style.setProperty("--d", (i % 4) * .09 + "s");
  b.innerHTML = `<img loading="lazy" src="${p.src}" alt="Foto ${i + 1}">`;
  b.addEventListener("click", () => openMedia("photo", i));
  photoGrid.appendChild(b);
});

// filtros (um botão por categoria encontrada)
const cats = [...new Set(photos.map(p => p.cat))];
const filters = $("filters");
if (cats.length < 2) {
  filters.classList.add("hide");
} else {
  [["all", T.todos || "Todos"], ...cats.map(c => [c, nomeCat(c)])].forEach(([val, txt], i) => {
    const btn = document.createElement("button");
    btn.className = "filter" + (i === 0 ? " active" : "");
    btn.dataset.filter = val;
    btn.textContent = txt;
    btn.addEventListener("click", () => {
      filters.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      photoGrid.querySelectorAll(".photo").forEach(el => {
        const ok = val === "all" || el.dataset.cat === val;
        el.style.display = ok ? "block" : "none";
        if (ok) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
      });
    });
    filters.appendChild(btn);
  });
}

// nota embaixo das fotos
const nota = demoFotos && allowDemo
  ? "Galeria demonstrativa com imagens ilustrativas da internet — não são os arquivos originais do evento."
  : (T.galeriaNota || "");
if (nota) $("galNote").textContent = nota; else $("galNote").classList.add("hide");

/* ---------- 6. Efeitos ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

const par = $("coverPar"), bar = $("progress");
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (y < innerHeight * 1.3) par.style.transform = `translate3d(0,${y * .22}px,0)`;
    bar.style.width = (max > 0 ? y / max * 100 : 0) + "%";
    ticking = false;
  });
}, { passive: true });

(function poeira() {                                   // poeira dourada leve
  const c = $("dust"), x = c.getContext("2d");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { c.remove(); return; }
  let w, h, dpr; const ps = [];
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr; };
  const mk = init => ({ x: Math.random() * w, y: init ? Math.random() * h : h + 10, r: (.6 + Math.random() * 1.7) * dpr, vy: (.12 + Math.random() * .28) * dpr, sw: Math.random() * 6.28, sp: .004 + Math.random() * .01, a: .15 + Math.random() * .5 });
  size();
  for (let i = 0, n = innerWidth < 700 ? 22 : 42; i < n; i++) ps.push(mk(true));
  addEventListener("resize", size);
  (function loop() {
    if (!document.hidden) {
      x.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.vy; p.sw += p.sp; p.x += Math.sin(p.sw) * .35 * dpr;
        if (p.y < -10) Object.assign(p, mk(false));
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283);
        x.fillStyle = `rgba(236,220,176,${p.a * (.6 + .4 * Math.sin(p.sw * 2))})`; x.fill();
      }
    }
    requestAnimationFrame(loop);
  })();
})();

/* ---------- 7. Música ---------- */
const MUSIC_FILE = G.musica ? caminho(PASTA.musica, G.musica) : null;
const volumeArquivo = (C.musica && typeof C.musica.volume === "number") ? C.musica.volume : .55;
const usarTrilha = !(C.musica && C.musica.usarTrilhaGerada === false);

const Music = (() => {
  let ctx, master, wet, on = false, muted = false, audio, fadeT, ci = 0;
  const mf = m => 440 * Math.pow(2, (m - 69) / 12);
  const chords = [[48,55,64,71],[45,52,64,72],[41,48,64,69],[43,50,62,71]];   // Cmaj7 · Am7 · Fmaj7 · G6
  const penta = [72,74,76,79,81,84,86];
  function reverb() {
    const len = ctx.sampleRate * 4, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    const cv = ctx.createConvolver(); cv.buffer = b; return cv;
  }
  function pad(t, notes, dur) {
    notes.forEach((m, i) => [["sine", 0], ["triangle", 5]].forEach(([type, det]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = type; o.frequency.value = mf(m); o.detune.value = det * (i % 2 ? 1 : -1);
      f.type = "lowpass"; f.frequency.value = 1100;
      const peak = (m < 50 ? .05 : .028) * (type === "sine" ? 1 : .6);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 2.8);
      g.gain.setValueAtTime(peak, t + dur - 3.2); g.gain.linearRampToValueAtTime(0, t + dur + 1);
      o.connect(f); f.connect(g); g.connect(master); g.connect(wet);
      o.start(t); o.stop(t + dur + 1.2);
    }));
  }
  function pluck(t, m) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.value = mf(m);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.07, t + .015); g.gain.exponentialRampToValueAtTime(.0008, t + 3.2);
    o.connect(g); g.connect(master); g.connect(wet); o.start(t); o.stop(t + 3.4);
  }
  function compasso() {
    const t = ctx.currentTime + .05;
    pad(t, chords[ci % chords.length], 8.5);
    let tt = t + 1;
    for (let i = 0; i < 5; i++) { pluck(tt, penta[Math.floor(Math.random() * penta.length)]); tt += 1.2 + Math.random() * .9; }
    ci++;
  }
  function fade(v) {
    clearInterval(fadeT);
    fadeT = setInterval(() => {
      const d = v - audio.volume;
      if (Math.abs(d) < .02) { audio.volume = v; clearInterval(fadeT); }
      else audio.volume = Math.max(0, Math.min(1, audio.volume + Math.sign(d) * .02));
    }, 60);
  }
  function start() {
    if (on) return; on = true;
    if (MUSIC_FILE) {
      audio = new Audio(MUSIC_FILE); audio.loop = true; audio.volume = 0;
      audio.play().then(() => fade(volumeArquivo)).catch(() => {});
      return;
    }
    if (!usarTrilha) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    wet = ctx.createGain(); wet.gain.value = .55;
    const rv = reverb(); wet.connect(rv); rv.connect(master); master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(.9, ctx.currentTime + 5);
    ctx.resume(); compasso(); setInterval(compasso, 8000);
  }
  function setMuted(m) {
    muted = m;
    if (audio) { fade(m ? 0 : volumeArquivo); return; }
    if (!master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(m ? 0 : .9, t + .8);
  }
  document.addEventListener("visibilitychange", () => {
    if (!on) return;
    if (document.hidden) { ctx && ctx.suspend(); audio && audio.pause(); }
    else { ctx && ctx.resume(); audio && !muted && audio.play().catch(() => {}); }
  });
  return { start, setMuted, get muted() { return muted; } };
})();

const temMusica = !!MUSIC_FILE || usarTrilha;
const musicBtn = $("musicBtn");
if (temMusica) {
  musicBtn.classList.remove("hide");
  musicBtn.addEventListener("click", () => {
    Music.setMuted(!Music.muted);
    musicBtn.classList.toggle("off", Music.muted);
    $("musicLabel").textContent = Music.muted ? "Som desligado" : "Música";
  });
} else {
  $("introHint").classList.add("hide");
}

/* ---------- 8. Abertura da entrega ---------- */
const intro = $("intro"), cover = $("inicio");
let opened = false;
function openStory() {
  if (opened) return; opened = true;
  Music.start();
  intro.classList.add("opening");
  setTimeout(() => cover.classList.add("in"), 650);
  setTimeout(() => {
    intro.classList.add("hidden");
    document.body.classList.remove("locked");
    if (temMusica) musicBtn.classList.add("show");
    window.scrollTo(0, 0);
    setTimeout(() => introVideo.pause && introVideo.pause(), 1400);
  }, 850);
}
function replayStory() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => {
    opened = false; cover.classList.remove("in");
    intro.classList.remove("opening", "hidden");
    document.body.classList.add("locked");
    introVideo.play && introVideo.play().catch(() => {});
    const inner = intro.querySelector(".intro-inner");
    inner.style.animation = "none"; void inner.offsetWidth; inner.style.animation = "";
  }, 700);
}
$("openBtn").addEventListener("click", openStory);
$("replayBtn").addEventListener("click", replayStory);

/* ---------- 9. Janela de visualização e compartilhar ---------- */
let curIndex = 0, curType = "photo";
const box = $("lightbox"), content = $("lightboxContent"), caption = $("lightboxCaption");
function openMedia(type, i) { curType = type; curIndex = i; render(); }
function render() {
  box.classList.add("open"); content.innerHTML = "";
  if (curType === "photo") {
    const im = document.createElement("img"); im.src = photos[curIndex].src; im.alt = "Foto";
    content.appendChild(im);
    caption.textContent = `Foto ${curIndex + 1} de ${photos.length}`;
  } else {
    const v = document.createElement("video");
    v.src = videos[curIndex].src; v.controls = true; v.autoplay = true; v.playsInline = true;
    content.appendChild(v);
    caption.textContent = `Vídeo ${curIndex + 1} de ${videos.length}`;
  }
}
function move(dir) {
  const n = curType === "photo" ? photos.length : videos.length;
  curIndex = (curIndex + dir + n) % n; render();
}
function closeBox() {
  const v = content.querySelector("video"); if (v) v.pause();
  box.classList.remove("open");
}
box.addEventListener("click", e => { if (e.target === box) closeBox(); });
$("lbClose").addEventListener("click", closeBox);
$("lbPrev").addEventListener("click", () => move(-1));
$("lbNext").addEventListener("click", () => move(1));
document.addEventListener("keydown", e => {
  if (!box.classList.contains("open")) return;
  if (e.key === "Escape") closeBox();
  if (e.key === "ArrowRight") move(1);
  if (e.key === "ArrowLeft") move(-1);
});

function toast(t) {
  const el = $("toast"); el.textContent = t; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}
$("shareBtn").addEventListener("click", async () => {
  try {
    if (navigator.share) await navigator.share({ title: document.title, url: location.href });
    else { await navigator.clipboard.writeText(location.href); toast("Link copiado!"); }
  } catch (e) {}
});
})();
