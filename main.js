/* Каркас: язык, рендер контента, режим дизайнера, прогресс испытания. */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  let lang = localStorage.getItem("cvsg_lang") || "ru";
  if (!CONTENT[lang]) lang = "ru";
  let designer = localStorage.getItem("cvsg_designer") === "1";
  let unlocked = 0;
  const visited = new Set();

  const t = (path, vars) => {
    let val = path.split(".").reduce((o, k) => (o == null ? o : o[k]), CONTENT[lang]);
    if (typeof val !== "string") val = path;
    if (vars) for (const [k, v] of Object.entries(vars)) val = val.replace("{" + k + "}", v);
    return val;
  };

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------- статические подписи ---------- */
  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    $("#langToggle").textContent = lang === "ru" ? "EN" : "RU";
    $("#designerToggle").setAttribute("aria-pressed", String(designer));
  }

  /* ---------- хаб ---------- */
  function renderHub() {
    const wrap = $("#worldCards");
    wrap.innerHTML = "";
    CONTENT[lang].hub.worlds.forEach((w) => {
      const card = el("a", "world-card", "");
      card.href = "#" + w.id;
      card.appendChild(el("span", "world-card__num", w.num));
      card.appendChild(el("span", "world-card__game", w.game));
      card.appendChild(el("span", "world-card__title", w.title));
      card.appendChild(el("span", "world-card__desc", w.desc));
      wrap.appendChild(card);
    });
  }

  /* ---------- мир 1: лист персонажа ---------- */
  function renderW1() {
    const d = CONTENT[lang].w1;
    const stats = $("#stats");
    stats.innerHTML = "";
    const statsTitle = el("h3", "sheet__subtitle", d.statsTitle);
    stats.appendChild(statsTitle);
    d.stats.forEach((s) => {
      const row = el("div", "stat");
      const head = el("div", "stat__head");
      head.appendChild(el("span", "stat__name", s.name));
      head.appendChild(el("span", "stat__value", s.value + "/10"));
      const bar = el("div", "stat__bar");
      const fill = el("span", "stat__fill");
      fill.style.width = s.value * 10 + "%";
      bar.appendChild(fill);
      row.appendChild(head);
      row.appendChild(bar);
      row.appendChild(el("p", "stat__why", s.why));
      stats.appendChild(row);
    });

    const quests = $("#quests");
    quests.innerHTML = "";
    quests.appendChild(el("h3", "sheet__subtitle", d.questsTitle));
    d.quests.forEach((q) => {
      const item = el("article", "quest");
      const head = el("button", "quest__head");
      head.type = "button";
      head.setAttribute("aria-expanded", "false");
      head.appendChild(el("span", "quest__name", q.name));
      head.appendChild(el("span", "quest__tag", q.tag));
      const body = el("div", "quest__body");
      body.hidden = true;
      body.appendChild(el("p", "quest__text", q.text));
      body.appendChild(el("p", "quest__reward", "★ " + q.reward));
      head.addEventListener("click", () => {
        const open = body.hidden;
        body.hidden = !open;
        head.setAttribute("aria-expanded", String(open));
        item.classList.toggle("quest--open", open);
      });
      item.appendChild(head);
      item.appendChild(body);
      quests.appendChild(item);
    });

    const ach = $("#achievements");
    ach.innerHTML = "";
    d.achv.forEach((a) => {
      const badge = el("div", "achv");
      badge.appendChild(el("span", "achv__icon", "🏆"));
      const box = el("div");
      box.appendChild(el("span", "achv__name", a.name));
      box.appendChild(el("p", "achv__desc", a.desc));
      badge.appendChild(box);
      ach.appendChild(badge);
    });

    setWhy("#ereality", d.why);
  }

  /* ---------- мир 2: сундук ---------- */
  function renderW2() {
    const d = CONTENT[lang].w2;
    const wrap = $("#toolCards");
    wrap.innerHTML = "";
    d.tools.forEach((tool, i) => {
      const card = el("article", "tool-card" + (i < unlocked ? " tool-card--open" : ""));
      card.appendChild(el("span", "tool-card__lock", i < unlocked ? "✓" : "?"));
      const box = el("div", "tool-card__box");
      box.appendChild(el("span", "tool-card__name", tool.name));
      box.appendChild(el("p", "tool-card__desc", tool.desc));
      card.appendChild(box);
      wrap.appendChild(card);
    });
    updateChestCounter();
    setWhy("#tiles", d.why);
  }

  function updateChestCounter() {
    const total = CONTENT[lang].w2.tools.length;
    const hudEl = $(".chest__title");
    if (!hudEl) return;
    hudEl.textContent =
      unlocked >= total ? t("w2.allFound") : t("w2.chestTitle") + " · " + t("w2.found", { n: unlocked });
  }

  function onMatchWave() {
    const total = CONTENT[lang].w2.tools.length;
    if (unlocked >= total) return;
    unlocked++;
    const cards = $$("#toolCards .tool-card");
    const card = cards[unlocked - 1];
    if (card) {
      card.classList.add("tool-card--open");
      $(".tool-card__lock", card).textContent = "✓";
    }
    updateChestCounter();
  }

  function onShuffle() {
    const board = $("#matchBoard");
    if (!board) return;
    let note = $(".board__note");
    if (!note) {
      note = el("div", "board__note");
      board.appendChild(note);
    }
    note.textContent = t("w2.shuffled");
    note.classList.add("board__note--show");
    setTimeout(() => note.classList.remove("board__note--show"), 1800);
  }

  /* ---------- украшения ёлки: звёзды, снег, лампочки ---------- */
  function initTreeDecor() {
    const sky = $(".sky");
    if (sky) {
      for (let i = 0; i < 10; i++) {
        const s = el("span", "sky-star");
        s.style.setProperty("--x", 4 + Math.random() * 92 + "%");
        s.style.setProperty("--y", 4 + Math.random() * 42 + "%");
        s.style.setProperty("--d", 1.8 + Math.random() * 2.6 + "s");
        s.style.setProperty("--s", 0.5 + Math.random());
        sky.appendChild(s);
      }
    }
    const snow = $(".snowfield");
    if (snow) {
      for (let i = 0; i < 28; i++) {
        const f = el("span", "flake");
        f.style.setProperty("--x", Math.random() * 100 + "%");
        f.style.setProperty("--d", 6 + Math.random() * 8 + "s");
        f.style.setProperty("--t", -12 * Math.random() + "s");
        f.style.setProperty("--s", 0.5 + Math.random() * 1.2);
        f.style.setProperty("--w", Math.random() * 60 - 30 + "px");
        snow.appendChild(f);
      }
    }
    const lights = $("#treeLights");
    if (lights) {
      const colors = ["#ff6b6b", "#ffd76a", "#6bd5ff", "#8dff9e", "#ff9de2"];
      for (let i = 0; i < 16; i++) {
        const bulb = el("span", "bulb");
        bulb.style.setProperty("--x", 20 + Math.random() * 60 + "%");
        bulb.style.setProperty("--y", 10 + Math.random() * 74 + "%");
        bulb.style.setProperty("--c", colors[i % colors.length]);
        bulb.style.setProperty("--bd", Math.random() * 2 + "s");
        lights.appendChild(bulb);
      }
    }
  }

  /* ---------- мир 3: ёлка ---------- */
  function renderW3() {
    const d = CONTENT[lang].w3;
    const wrap = $("#ornaments");
    wrap.innerHTML = "";
    d.ornaments.forEach((o) => {
      let node;
      if (o.kind === "tel") node = el("a", "ornament", "");
      else if (o.kind === "mail") node = el("a", "ornament", "");
      else if (o.kind === "pdf") node = el("a", "ornament", "");
      else node = el("a", "ornament", "");
      if (o.kind === "tel") node.href = "tel:+375447838489";
      if (o.kind === "mail") node.href = "mailto:kukar.yar@gmail.com";
      if (o.kind === "link") {
        node.href = "https://github.com/Kerarty";
        node.target = "_blank";
        node.rel = "noopener";
      }
      if (o.kind === "pdf") {
        node.href = "assets/Yaroslav_Kukar_CV.pdf";
        node.target = "_blank";
        node.rel = "noopener";
      }
      node.appendChild(el("span", "ornament__icon", o.icon));
      node.appendChild(el("span", "ornament__label", o.label));
      node.appendChild(el("span", "ornament__value", o.value));
      wrap.appendChild(node);
    });

    $("#postcardBody").hidden = true;
    $("#postcardBtn").setAttribute("aria-expanded", "false");

    setWhy("#tree", d.why);
  }

  /* ---------- режим дизайнера ---------- */
  function setWhy(sectionSel, text) {
    const aside = $(sectionSel + " [data-why]");
    if (!aside) return;
    aside.hidden = false;
    aside.innerHTML = "";
    aside.appendChild(el("strong", "why__label", t("hud.designer")));
    aside.appendChild(el("p", "", text));
  }

  function applyDesigner() {
    document.body.classList.toggle("designer", designer);
    $("#designerToggle").setAttribute("aria-pressed", String(designer));
    localStorage.setItem("cvsg_designer", designer ? "1" : "0");
  }

  /* ---------- прогресс ---------- */
  function updateProgress() {
    const n = visited.size;
    const node = $("#hudProgress");
    node.textContent = n >= 3 ? t("hud.progressDone") : t("hud.progress", { n });
    if (n >= 3) {
      const star = $("#treeStar");
      if (star) star.classList.add("star--lit");
      if (!$(".star-msg")) {
        const msg = el("p", "star-msg", t("w3.starLit"));
        $(".finale").after(msg);
      }
    }
  }

  function watchWorlds() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            visited.add(e.target.id);
            updateProgress();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    ["ereality", "tiles", "tree"].forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  /* ---------- открытка ---------- */
  function bindPostcard() {
    $("#postcardBtn").addEventListener("click", () => {
      const body = $("#postcardBody");
      const open = body.hidden;
      body.hidden = !open;
      $("#postcardBtn").setAttribute("aria-expanded", String(open));
      $("#postcardBtn").classList.toggle("postcard__front--open", open);
    });
  }

  /* ---------- переключатели ---------- */
  function bindToggles() {
    $("#langToggle").addEventListener("click", () => {
      lang = lang === "ru" ? "en" : "ru";
      localStorage.setItem("cvsg_lang", lang);
      renderAll();
    });
    $("#designerToggle").addEventListener("click", () => {
      designer = !designer;
      applyDesigner();
    });
  }

  function renderAll() {
    applyStatic();
    renderHub();
    renderW1();
    renderW2();
    renderW3();
    updateProgress();
  }

  renderAll();
  applyDesigner();
  bindToggles();
  bindPostcard();
  watchWorlds();
  initTreeDecor();
  if (window.initMatch3) window.initMatch3($("#matchBoard"), onMatchWave, onShuffle);
})();
