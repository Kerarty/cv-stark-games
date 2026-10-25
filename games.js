/* Мини-движок матч-3 для мира Tile Seasons. Ноль зависимостей. */
(function () {
  "use strict";

  const COLS = 6;
  const ROWS = 5;
  const TYPES = 6;
  const SWAP_MS = 180;
  const CLEAR_MS = 240;
  const FALL_MS = 220;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => sleep(reducedMotion ? 0 : ms);

  function randType() {
    return Math.floor(Math.random() * TYPES);
  }

  function findMatches(board) {
    const matched = new Set();
    const add = (r, c) => matched.add(r * COLS + c);
    for (let r = 0; r < ROWS; r++) {
      let run = 1;
      for (let c = 1; c <= COLS; c++) {
        const same = c < COLS && board[r][c] === board[r][c - 1] && board[r][c] !== null;
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
        const same = r < ROWS && board[r][c] === board[r - 1][c] && board[r][c] !== null;
        if (same) run++;
        else {
          if (run >= 3) for (let k = r - run; k < r; k++) add(k, c);
          run = 1;
        }
      }
    }
    return matched;
  }

  function initMatch3(boardEl, onMatchWave) {
    let board = [];
    let selected = null;
    let busy = false;
    let finished = false;

    const tileId = (r, c) => `t${r}-${c}`;
    const tileAt = new Map(); // key -> element

    function pos(el, r, c) {
      el.style.left = (c * 100) / COLS + "%";
      el.style.top = (r * 100) / ROWS + "%";
    }

    function makeTile(type, r, c) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "tile tile--" + type;
      el.dataset.type = type;
      el.setAttribute("aria-label", "tile " + (type + 1));
      pos(el, r, c);
      el.addEventListener("click", () => onTileClick(r, c));
      return el;
    }

    function newBoard() {
      board = [];
      for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
          let t;
          do {
            t = randType();
          } while (
            (c >= 2 && board[r][c - 1] === t && board[r][c - 2] === t) ||
            (r >= 2 && board[r - 1][c] === t && board[r - 2][c] === t)
          );
          board[r][c] = t;
        }
      }
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
      busy = true;
      selectVisual(a[0], a[1], false);
      await swapTiles(a, b);
      [board[a[0]][a[1]], board[b[0]][b[1]]] = [board[b[0]][b[1]], board[a[0]][a[1]]];
      if (findMatches(board).size === 0) {
        await swapTiles(a, b);
        [board[a[0]][a[1]], board[b[0]][b[1]]] = [board[b[0]][b[1]], board[a[0]][a[1]]];
      } else {
        const waves = await resolveWaves();
        if (typeof onMatchWave === "function") onMatchWave(waves);
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

    newBoard();
    render();
  }

  window.initMatch3 = initMatch3;
})();
