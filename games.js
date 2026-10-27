/* Мини-движок матч-3 для мира Tile Seasons. Ноль зависимостей.
   Свайп мышью/пальцем + клик, каскады, гравитация, защита от тупиков. */
(function () {
  "use strict";

  const COLS = 6;
  const ROWS = 5;
  const TYPES = 6;
  const SWAP_MS = 180;
  const CLEAR_MS = 240;
  const FALL_MS = 220;
  const SHAKE_MS = 320;
  const DRAG_THRESHOLD = 14;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => sleep(reducedMotion ? 0 : ms);

  const randType = () => Math.floor(Math.random() * TYPES);

  function findMatches(board) {
    const matched = new Set();
    const add = (r, c) => matched.add(r * COLS + c);
    for (let r = 0; r < ROWS; r++) {
      let run = 1;
      for (let c = 1; c <= COLS; c++) {
        const same = c < COLS && board[r][c] !== null && board[r][c] === board[r][c - 1];
        if (same) run++;
        else {
          if (run >= 3) for (let k = c - run; k < c; k++) add(r, k);
          run = 1;
        }
      }
    }
    for (let c = 0; c < COLS; c++) {
      let run = 1;
      for (let r = 1; r <= ROWS; r++) {
        const same = r < ROWS && board[r][c] !== null && board[r][c] === board[r - 1][c];
        if (same) run++;
        else {
          if (run >= 3) for (let k = r - run; k < r; k++) add(k, c);
          run = 1;
        }
      }
    }
    return matched;
  }

  function anyMoves(board) {
    const trySwap = (r1, c1, r2, c2) => {
      [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
      const ok = findMatches(board).size > 0;
      [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
      return ok;
    };
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (c + 1 < COLS && trySwap(r, c, r, c + 1)) return true;
        if (r + 1 < ROWS && trySwap(r, c, r + 1, c)) return true;
      }
    }
    return false;
  }

  function initMatch3(boardEl, onMatchWave, onShuffle) {
    let board = [];
    let selected = null;
    let busy = false;
    let gesture = null; // { r, c, x, y, done }

    const tileId = (r, c) => `t${r}-${c}`;
    const tileAt = new Map();

    function pos(el, r, c) {
      el.style.left = (c * 100) / COLS + "%";
      el.style.top = (r * 100) / ROWS + "%";
      el.dataset.r = r;
      el.dataset.c = c;
    }

    /* Позицию тайла читаем из его фактического стиля — dataset
       и замыкания устаревают после свапа и каскадов, стиль нет. */
    function cellOf(el) {
      return {
        r: Math.round(parseFloat(el.style.top) / (100 / ROWS)),
        c: Math.round(parseFloat(el.style.left) / (100 / COLS)),
      };
    }

    function makeTile(type, r, c) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "tile tile--" + type;
      el.dataset.type = type;
      el.setAttribute("aria-label", "tile " + (type + 1));
      pos(el, r, c);
      return el;
    }

    /* Заполнение без стартовых матчей и обязательно с доступным ходом. */
    function randomFill() {
      const b = [];
      for (let r = 0; r < ROWS; r++) {
        b[r] = [];
        for (let c = 0; c < COLS; c++) {
          let t;
          do {
            t = randType();
          } while (
            (c >= 2 && b[r][c - 1] === t && b[r][c - 2] === t) ||
            (r >= 2 && b[r - 1][c] === t && b[r - 2][c] === t)
          );
          b[r][c] = t;
        }
      }
      return b;
    }

    function ensurePlayable() {
      for (let i = 0; i < 300; i++) {
        const b = randomFill();
        if (anyMoves(b)) return b;
      }
      return randomFill();
    }

    function render() {
      boardEl.innerHTML = "";
      tileAt.clear();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const el = makeTile(board[r][c], r, c);
          tileAt.set(tileId(r, c), el);
          boardEl.appendChild(el);
        }
      }
    }

    function placeAll() {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const el = tileAt.get(tileId(r, c));
          if (el) pos(el, r, c);
        }
      }
    }

    function selectVisual(r, c, on) {
      const el = tileAt.get(tileId(r, c));
      if (el) el.classList.toggle("tile--selected", on);
    }

    function shakeTiles(a, b) {
      for (const [r, c] of [a, b]) {
        const el = tileAt.get(tileId(r, c));
        if (!el) continue;
        el.classList.add("tile--denied");
        setTimeout(() => el.classList.remove("tile--denied"), SHAKE_MS);
      }
    }

    async function swapTiles(a, b) {
      const [r1, c1] = a, [r2, c2] = b;
      const e1 = tileAt.get(tileId(r1, c1));
      const e2 = tileAt.get(tileId(r2, c2));
      tileAt.set(tileId(r1, c1), e2);
      tileAt.set(tileId(r2, c2), e1);
      pos(e2, r1, c1);
      pos(e1, r2, c2);
      await wait(SWAP_MS);
    }

    async function resolveWaves() {
      let waves = 0;
      while (true) {
        const matched = findMatches(board);
        if (matched.size === 0) break;
        waves++;
        matched.forEach((key) => {
          const el = tileAt.get(tileId(Math.floor(key / COLS), key % COLS));
          if (el) el.classList.add("tile--clearing");
        });
        await wait(CLEAR_MS);
        matched.forEach((key) => {
          const r = Math.floor(key / COLS);
          const c = key % COLS;
          const el = tileAt.get(tileId(r, c));
          if (el) el.remove();
          tileAt.delete(tileId(r, c));
          board[r][c] = null;
        });
        for (let c = 0; c < COLS; c++) {
          let write = ROWS - 1;
          for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][c] !== null) {
              if (write !== r) {
                board[write][c] = board[r][c];
                board[r][c] = null;
                const el = tileAt.get(tileId(r, c));
                tileAt.delete(tileId(r, c));
                tileAt.set(tileId(write, c), el);
              }
              write--;
            }
          }
          for (let r = write; r >= 0; r--) {
            const t = randType();
            board[r][c] = t;
            const el = makeTile(t, r - write - 1, c);
            tileAt.set(tileId(r, c), el);
            boardEl.appendChild(el);
          }
        }
        placeAll();
        await wait(FALL_MS);
      }
      return waves;
    }

    async function attemptSwap(a, b) {
      if (busy) return;
      if (!tileAt.get(tileId(a[0], a[1])) || !tileAt.get(tileId(b[0], b[1]))) return;
      busy = true;
      if (selected) {
        selectVisual(selected[0], selected[1], false);
        selected = null;
      }
      await swapTiles(a, b);
      [board[a[0]][a[1]], board[b[0]][b[1]]] = [board[b[0]][b[1]], board[a[0]][a[1]]];
      if (findMatches(board).size === 0) {
        await swapTiles(a, b);
        [board[a[0]][a[1]], board[b[0]][b[1]]] = [board[b[0]][b[1]], board[a[0]][a[1]]];
        shakeTiles(a, b);
      } else {
        await resolveWaves();
        if (typeof onMatchWave === "function") onMatchWave();
        if (!anyMoves(board)) {
          board = ensurePlayable();
          render();
          if (typeof onShuffle === "function") onShuffle();
        }
      }
      busy = false;
    }

    function onTileClick(r, c) {
      if (busy) return;
      if (!selected) {
        selected = [r, c];
        selectVisual(r, c, true);
        return;
      }
      const [sr, sc] = selected;
      if (sr === r && sc === c) {
        selectVisual(sr, sc, false);
        selected = null;
        return;
      }
      const adjacent = Math.abs(sr - r) + Math.abs(sc - c) === 1;
      selectVisual(sr, sc, false);
      selected = null;
      if (adjacent) attemptSwap([sr, sc], [r, c]);
      else {
        selected = [r, c];
        selectVisual(r, c, true);
      }
    }

    /* Свайп: pointerdown на тайле → тянуть → отпустить на соседнем. */
    boardEl.addEventListener("pointerdown", (e) => {
      const tile = e.target.closest(".tile");
      if (!tile || busy) return;
      const { r, c } = cellOf(tile);
      gesture = { r, c, x: e.clientX, y: e.clientY, done: false };
    });

    /* Клавиатура: Enter/пробел на тайле — то же, что клик. */
    boardEl.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const tile = e.target.closest(".tile");
      if (!tile) return;
      e.preventDefault();
      const { r, c } = cellOf(tile);
      onTileClick(r, c);
    });

    window.addEventListener("pointermove", (e) => {
      if (!gesture || gesture.done || busy) return;
      const dx = e.clientX - gesture.x;
      const dy = e.clientY - gesture.y;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      gesture.done = true;
      let tr = gesture.r;
      let tc = gesture.c;
      if (Math.abs(dx) > Math.abs(dy)) tc += dx > 0 ? 1 : -1;
      else tr += dy > 0 ? 1 : -1;
      if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) {
        attemptSwap([gesture.r, gesture.c], [tr, tc]);
      }
    });

    window.addEventListener("pointerup", () => {
      if (!gesture) return;
      const g = gesture;
      gesture = null;
      if (!g.done && !busy) onTileClick(g.r, g.c);
    });

    board = ensurePlayable();
    render();
  }

  window.initMatch3 = initMatch3;
})();
