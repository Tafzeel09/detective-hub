/* ============================================================
   DetectiveHub — Mini Games
   Six self-contained vanilla-JS puzzles. Each exposes an
   init*(container, onComplete, opts) function.
   onComplete(won:boolean, points:number)
   ============================================================ */

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------------------------------------------------- */
/* 1. FINGERPRINT MATCHING                                     */
/* ---------------------------------------------------------- */
function generateFingerprintSVG(seed) {
  // deterministic-ish pseudo-random arcs based on seed
  let s = seed;
  const next = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let rings = "";
  const cx = 60, cy = 60;
  for (let i = 0; i < 9; i++) {
    const r = 8 + i * 5.5 + (next() * 3 - 1.5);
    const gapStart = next() * 360;
    const gapSize = 20 + next() * 40;
    const startAngle = gapStart + gapSize;
    const endAngle = gapStart + 360;
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    const toRad = a => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    rings += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" />`;
  }
  return `<svg viewBox="0 0 120 120" class="fp-svg"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">${rings}</g></svg>`;
}

function initFingerprintGame(container, onComplete) {
  const targetSeed = rand(1, 99999);
  const optionCount = 5;
  const correctIndex = rand(0, optionCount - 1);
  const seeds = [];
  for (let i = 0; i < optionCount; i++) {
    seeds.push(i === correctIndex ? targetSeed : rand(1, 99999));
  }

  container.innerHTML = `
    <div class="game-instructions">Match the print lifted from the evidence to the correct suspect card.</div>
    <div class="fp-target">
      <div class="fp-target__label">Evidence Print</div>
      ${generateFingerprintSVG(targetSeed)}
    </div>
    <div class="fp-grid">
      ${seeds.map((sd, i) => `
        <button class="fp-card" data-idx="${i}">
          ${generateFingerprintSVG(sd)}
          <span>Suspect ${i + 1}</span>
        </button>
      `).join("")}
    </div>
    <div class="game-feedback" id="fp-feedback"></div>
  `;

  container.querySelectorAll(".fp-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const feedback = container.querySelector("#fp-feedback");
      if (idx === correctIndex) {
        btn.classList.add("correct");
        feedback.textContent = "Match confirmed. Prints are identical.";
        feedback.classList.add("good");
        SFX.success();
        container.querySelectorAll(".fp-card").forEach(b => b.disabled = true);
        setTimeout(() => onComplete(true, 20), 600);
      } else {
        btn.classList.add("wrong");
        feedback.textContent = "No match. Ridge patterns diverge \u2014 try another card.";
        feedback.classList.add("bad");
        SFX.error();
        btn.disabled = true;
      }
    });
  });
}

/* ---------------------------------------------------------- */
/* 2. CODE BREAKING (Mastermind-lite)                          */
/* ---------------------------------------------------------- */
function initCodebreakGame(container, onComplete) {
  const digits = [1, 2, 3, 4, 5, 6];
  const codeLength = 4;
  const secret = Array.from({ length: codeLength }, () => digits[rand(0, digits.length - 1)]);
  let attemptsLeft = 8;
  let history = [];

  function render() {
    container.innerHTML = `
      <div class="game-instructions">Crack the 4-digit safe code. After each guess: \u25CF = right digit, right spot. \u25CB = right digit, wrong spot.</div>
      <div class="cb-input-row">
        ${Array.from({ length: codeLength }).map((_, i) => `
          <select class="cb-digit" data-i="${i}">
            ${digits.map(d => `<option value="${d}">${d}</option>`).join("")}
          </select>
        `).join("")}
        <button class="btn btn--accent" id="cb-guess">Try Combination</button>
      </div>
      <div class="cb-attempts">Attempts left: <strong>${attemptsLeft}</strong></div>
      <div class="cb-history">
        ${history.map(h => `
          <div class="cb-history__row">
            <span class="cb-history__code">${h.guess.join(" - ")}</span>
            <span class="cb-history__pegs">${"\u25CF".repeat(h.exact)}${"\u25CB".repeat(h.partial)}</span>
          </div>
        `).join("")}
      </div>
      <div class="game-feedback" id="cb-feedback"></div>
    `;

    container.querySelector("#cb-guess").addEventListener("click", () => {
      const guess = Array.from(container.querySelectorAll(".cb-digit")).map(s => parseInt(s.value, 10));
      let exact = 0;
      const secretCopy = secret.slice();
      const guessCopy = guess.slice();
      for (let i = 0; i < codeLength; i++) {
        if (guessCopy[i] === secretCopy[i]) { exact++; secretCopy[i] = null; guessCopy[i] = undefined; }
      }
      let partial = 0;
      for (let i = 0; i < codeLength; i++) {
        if (guessCopy[i] === undefined) continue;
        const idx = secretCopy.indexOf(guessCopy[i]);
        if (idx !== -1) { partial++; secretCopy[idx] = null; }
      }
      history.unshift({ guess, exact, partial });
      attemptsLeft--;

      if (exact === codeLength) {
        SFX.success();
        render();
        container.querySelector("#cb-feedback").textContent = "Safe unlocked. The code was correct.";
        container.querySelector("#cb-feedback").classList.add("good");
        container.querySelector("#cb-guess").disabled = true;
        setTimeout(() => onComplete(true, 25), 700);
      } else if (attemptsLeft <= 0) {
        SFX.fail();
        render();
        container.querySelector("#cb-feedback").textContent = `Out of attempts. The code was ${secret.join(" - ")}.`;
        container.querySelector("#cb-feedback").classList.add("bad");
        container.querySelector("#cb-guess").disabled = true;
        setTimeout(() => onComplete(false, 0), 900);
      } else {
        SFX.click();
        render();
      }
    });
  }
  render();
}

/* ---------------------------------------------------------- */
/* 3. LOCK COMBINATION PUZZLE                                  */
/* ---------------------------------------------------------- */
function initLockGame(container, onComplete) {
  const target = [rand(0, 9), rand(0, 9), rand(0, 9)];
  const hintOptions = [
    `The digits, in order, sum to ${target[0] + target[1] + target[2]}.`,
    `The first digit is ${target[0] % 2 === 0 ? "even" : "odd"}, the last is ${target[2] % 2 === 0 ? "even" : "odd"}.`,
    `The middle digit is ${target[1] >= 5 ? "5 or higher" : "lower than 5"}.`
  ];
  const current = [0, 0, 0];

  function render() {
    container.innerHTML = `
      <div class="game-instructions">A ledger note gives cryptic hints to the evidence safe's 3-digit combination.</div>
      <ul class="lock-hints">${hintOptions.map(h => `<li>${h}</li>`).join("")}</ul>
      <div class="lock-dials">
        ${current.map((v, i) => `
          <div class="lock-dial">
            <button class="lock-btn" data-i="${i}" data-dir="1">\u25B2</button>
            <div class="lock-dial__value">${v}</div>
            <button class="lock-btn" data-i="${i}" data-dir="-1">\u25BC</button>
          </div>
        `).join("")}
      </div>
      <button class="btn btn--accent" id="lock-submit">Open Safe</button>
      <div class="game-feedback" id="lock-feedback"></div>
    `;

    container.querySelectorAll(".lock-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.i, 10);
        const dir = parseInt(btn.dataset.dir, 10);
        current[i] = (current[i] + dir + 10) % 10;
        SFX.click();
        render();
      });
    });

    container.querySelector("#lock-submit").addEventListener("click", () => {
      const feedback = container.querySelector("#lock-feedback");
      if (current.every((v, i) => v === target[i])) {
        feedback.textContent = "The safe clicks open.";
        feedback.classList.add("good");
        SFX.unlock();
        container.querySelector("#lock-submit").disabled = true;
        setTimeout(() => onComplete(true, 15), 600);
      } else {
        feedback.textContent = "The dials don't line up. Re-check the hints.";
        feedback.classList.add("bad");
        SFX.error();
      }
    });
  }
  render();
}

/* ---------------------------------------------------------- */
/* 4. MEMORY CHALLENGE                                         */
/* ---------------------------------------------------------- */
function initMemoryGame(container, onComplete) {
  const icons = ["\u{1F52C}", "\u{1F5DD}\uFE0F", "\u{1F4F7}", "\u{1F52A}", "\u{1F9E4}", "\u2709\uFE0F", "\u{1F576}\uFE0F", "\u{1F4CB}"];
  const pairs = shuffle([...icons, ...icons]).map((icon, i) => ({ id: i, icon, matched: false }));
  let firstPick = null;
  let lock = false;
  let moves = 0;

  function render() {
    container.innerHTML = `
      <div class="game-instructions">Flip the cards to match pairs of case evidence. Moves: <strong>${moves}</strong></div>
      <div class="memory-grid">
        ${pairs.map(p => `
          <button class="memory-card ${p.matched ? "matched" : ""}" data-id="${p.id}">
            <span class="memory-card__face memory-card__face--back">?</span>
            <span class="memory-card__face memory-card__face--front">${p.icon}</span>
          </button>
        `).join("")}
      </div>
      <div class="game-feedback" id="memory-feedback"></div>
    `;

    container.querySelectorAll(".memory-card").forEach(btn => {
      const id = parseInt(btn.dataset.id, 10);
      if (pairs[id].matched) btn.classList.add("flipped");
      btn.addEventListener("click", () => {
        if (lock || pairs[id].matched || btn.classList.contains("flipped")) return;
        btn.classList.add("flipped");
        SFX.hover();

        if (firstPick === null) {
          firstPick = id;
        } else {
          moves++;
          const a = pairs[firstPick], b = pairs[id];
          if (a.icon === b.icon && a.id !== b.id) {
            a.matched = b.matched = true;
            firstPick = null;
            SFX.click();
            const allMatched = pairs.every(p => p.matched);
            if (allMatched) {
              setTimeout(() => {
                container.querySelector("#memory-feedback").textContent = `Solved in ${moves} moves.`;
                container.querySelector("#memory-feedback").classList.add("good");
                SFX.success();
                setTimeout(() => onComplete(true, Math.max(30 - moves, 10)), 500);
              }, 300);
            } else {
              render();
            }
          } else {
            lock = true;
            setTimeout(() => {
              lock = false;
              firstPick = null;
              render();
            }, 700);
          }
        }
      });
    });
  }
  render();
}

/* ---------------------------------------------------------- */
/* 5. HIDDEN OBJECT SEARCH                                     */
/* ---------------------------------------------------------- */
function initHiddenObjectGame(container, onComplete) {
  const targetIcon = "\u{1F511}"; // key
  const decoys = ["\u2615", "\u{1F4D6}", "\u{1F55A}", "\u{1F4A1}", "\u{1F9F5}", "\u{1F5A8}\uFE0F", "\u{1F4CC}", "\u{1F4E6}", "\u{1F5C2}\uFE0F", "\u{1F58A}\uFE0F"];
  const totalCells = 42;
  const targetsNeeded = 5;
  let cells = [];
  for (let i = 0; i < targetsNeeded; i++) cells.push(targetIcon);
  while (cells.length < totalCells) cells.push(decoys[rand(0, decoys.length - 1)]);
  cells = shuffle(cells);
  let found = 0;

  container.innerHTML = `
    <div class="game-instructions">Search the desk clutter for ${targetsNeeded} hidden keys \u{1F511}.</div>
    <div class="hidden-progress">Found: <strong id="ho-count">0</strong> / ${targetsNeeded}</div>
    <div class="hidden-grid">
      ${cells.map((icon, i) => `<button class="hidden-cell" data-icon="${icon}" data-i="${i}">${icon}</button>`).join("")}
    </div>
    <div class="game-feedback" id="ho-feedback"></div>
  `;

  container.querySelectorAll(".hidden-cell").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("clicked")) return;
      btn.classList.add("clicked");
      if (btn.dataset.icon === targetIcon) {
        btn.classList.add("found");
        found++;
        SFX.click();
        container.querySelector("#ho-count").textContent = found;
        if (found >= targetsNeeded) {
          container.querySelector("#ho-feedback").textContent = "All hidden keys located.";
          container.querySelector("#ho-feedback").classList.add("good");
          SFX.success();
          container.querySelectorAll(".hidden-cell").forEach(b => b.disabled = true);
          setTimeout(() => onComplete(true, 20), 600);
        }
      } else {
        btn.classList.add("miss");
        SFX.error();
      }
    });
  });
}

/* ---------------------------------------------------------- */
/* 6. CIPHER DECODER (Caesar shift)                             */
/* ---------------------------------------------------------- */
function caesarEncode(text, shift) {
  return text.replace(/[a-zA-Z]/g, ch => {
    const base = ch === ch.toUpperCase() ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);
  });
}

function initCipherGame(container, onComplete, opts) {
  const phrases = [
    "THE BUTLER SAW EVERYTHING",
    "TRUST NO ALIBI",
    "THE KEY IS UNDER THE DESK",
    "FOLLOW THE MONEY TRAIL",
    "THE WITNESS IS LYING",
    "CHECK THE SIDE DOOR"
  ];
  const plaintext = (opts && opts.plaintext) ? opts.plaintext.toUpperCase() : phrases[rand(0, phrases.length - 1)];
  const shift = rand(1, 25);
  const encoded = caesarEncode(plaintext, shift);

  container.innerHTML = `
    <div class="game-instructions">A coded note was found at the scene. Slide the shift until the message reads clearly, then confirm.</div>
    <div class="cipher-encoded">${encoded}</div>
    <div class="cipher-controls">
      <label for="cipher-range">Shift: <strong id="cipher-shift-val">0</strong></label>
      <input type="range" id="cipher-range" min="0" max="25" value="0" step="1">
    </div>
    <div class="cipher-decoded" id="cipher-decoded">${caesarEncode(encoded, 0)}</div>
    <button class="btn btn--accent" id="cipher-submit">Confirm Decryption</button>
    <div class="game-feedback" id="cipher-feedback"></div>
  `;

  const range = container.querySelector("#cipher-range");
  const decodedEl = container.querySelector("#cipher-decoded");
  const shiftVal = container.querySelector("#cipher-shift-val");

  range.addEventListener("input", () => {
    const s = parseInt(range.value, 10);
    shiftVal.textContent = s;
    decodedEl.textContent = caesarEncode(encoded, s);
    SFX.hover();
  });

  container.querySelector("#cipher-submit").addEventListener("click", () => {
    const s = parseInt(range.value, 10);
    const feedback = container.querySelector("#cipher-feedback");
    if (caesarEncode(encoded, s) === plaintext) {
      feedback.textContent = "Decryption confirmed: \u201C" + plaintext + "\u201D";
      feedback.classList.add("good");
      SFX.success();
      container.querySelector("#cipher-submit").disabled = true;
      setTimeout(() => onComplete(true, 20, plaintext), 700);
    } else {
      feedback.textContent = "That's not quite legible yet \u2014 keep adjusting the shift.";
      feedback.classList.add("bad");
      SFX.error();
    }
  });
}

const MINI_GAMES = {
  fingerprint: { name: "Fingerprint Matching", icon: "\u{1F446}", init: initFingerprintGame },
  codebreak:   { name: "Code Breaking",        icon: "\u{1F522}", init: initCodebreakGame },
  lock:        { name: "Lock Combination",     icon: "\u{1F512}", init: initLockGame },
  memory:      { name: "Memory Challenge",     icon: "\u{1F9E0}", init: initMemoryGame },
  hidden:      { name: "Hidden Object Search", icon: "\u{1F50D}", init: initHiddenObjectGame },
  cipher:      { name: "Cipher Decoder",       icon: "\u{1F5DD}\uFE0F", init: initCipherGame }
};
