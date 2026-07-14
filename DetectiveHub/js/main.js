/* ============================================================
   DetectiveHub — Main Application
   ============================================================ */

let CURRENT_CASE_ID = null;
let CURRENT_GAME_ID = null;
let CURRENT_TAB = "story";
let SESSION_START = {}; // caseId -> ts, for speed bonus

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(STATE.profile.theme);
  updateMuteIcon();
  initCursor();
  initHeroCanvas();
  initTypingEffect();
  bindNav();
  bindLanding();
  bindKeyboardShortcuts();
  bindEasterEgg();
  navigate("landing");
});

/* ============================================================
   ROUTER
   ============================================================ */
function navigate(screen, opts) {
  opts = opts || {};
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById("screen-" + screen);
  if (target) target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  const nav = document.getElementById("app-nav");
  nav.classList.toggle("hidden", screen === "landing");
  document.querySelectorAll(".nav-link").forEach(b => b.classList.toggle("active", b.dataset.nav === screen));
  document.getElementById("app-nav-links").classList.remove("open");

  SFX.pageTurn();

  if (screen === "dashboard") renderDashboard();
  if (screen === "cases") renderCasesList();
  if (screen === "case-detail") renderCaseDetail(opts.caseId || CURRENT_CASE_ID, opts.tab);
  if (screen === "notebook") renderNotebookScreen();
  if (screen === "board") renderBoardScreen(opts.caseId);
  if (screen === "games") renderGamesScreen();
  if (screen === "game-detail") renderGameDetail(opts.gameId);
  if (screen === "profile") renderProfileScreen();
}

function bindNav() {
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.nav));
  });
  document.getElementById("nav-logo-btn").addEventListener("click", () => navigate("landing"));
  document.getElementById("nav-burger").addEventListener("click", () => {
    document.getElementById("app-nav-links").classList.toggle("open");
  });
  document.getElementById("mute-toggle").addEventListener("click", () => {
    toggleMute();
    updateMuteIcon();
    SFX.click();
  });
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const order = ["dark", "noir", "classic"];
    const next = order[(order.indexOf(STATE.profile.theme) + 1) % order.length];
    applyTheme(next);
    STATE.profile.theme = next;
    saveState();
    SFX.click();
  });
}

function updateMuteIcon() {
  document.getElementById("mute-toggle").textContent = STATE.profile.muted ? "\u{1F507}" : "\u{1F50A}";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/* ============================================================
   CURSOR
   ============================================================ */
function initCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  let rx = 0, ry = 0, mx = 0, my = 0;
  window.addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px"; dot.style.top = my + "px";
  });
  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  })();
  document.addEventListener("pointerover", (e) => {
    const interactive = e.target.closest("button, a, input, textarea, .case-card, .cork-card, .evidence-card, select");
    ring.classList.toggle("active", !!interactive);
  });
}

/* ============================================================
   HERO ANIMATED BACKGROUND (fog particles + flashlight)
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 46; i++) {
    particles.push({
      x: Math.random() * 1000, y: Math.random() * 600,
      r: 40 + Math.random() * 90,
      speed: 0.05 + Math.random() * 0.15,
      alpha: 0.02 + Math.random() * 0.05
    });
  }

  let mouseX = 0.5, mouseY = 0.4;
  canvas.parentElement.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // drifting fog
    particles.forEach(p => {
      p.x += p.speed;
      if (p.x - p.r > w) p.x = -p.r;
      const grad = ctx.createRadialGradient(p.x, p.y * (h / 600), 0, p.x, p.y * (h / 600), p.r);
      grad.addColorStop(0, `rgba(180,50,74,${p.alpha})`);
      grad.addColorStop(1, "rgba(180,50,74,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y * (h / 600), p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    // flashlight glow following pointer
    const fx = mouseX * w, fy = mouseY * h;
    const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, 260);
    glow.addColorStop(0, "rgba(255,240,220,0.06)");
    glow.addColorStop(1, "rgba(255,240,220,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(fx, fy, 260, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   TYPING EFFECT (hero tagline)
   ============================================================ */
function initTypingEffect() {
  const el = document.getElementById("typing-tagline");
  const text = "Every Clue Matters. Every Decision Counts.";
  let i = 0;
  el.innerHTML = "";
  const span = document.createElement("span");
  el.appendChild(span);
  const cursor = document.createElement("span");
  cursor.className = "cursor-blink";
  el.appendChild(cursor);

  function tick() {
    if (i <= text.length) {
      span.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, 38 + Math.random() * 30);
    }
  }
  setTimeout(tick, 500);
}

/* ============================================================
   LANDING BINDINGS
   ============================================================ */
function bindLanding() {
  document.getElementById("start-investigation-btn").addEventListener("click", () => navigate("dashboard"));
  document.getElementById("how-it-works-btn").addEventListener("click", () => {
    openModal(`
      <h3>How DetectiveHub Works</h3>
      <p>Pick a case from the case files, then work through its tabs: read the story, study the victim and suspects, question witnesses, walk the crime scene, and inspect every piece of evidence.</p>
      <p>Save clues and suspects to your notebook, pin evidence to the corkboard and connect it with string, and unlock hidden clues by solving quick puzzles.</p>
      <p>When you're ready, make your final accusation. Choose carefully \u2014 the wrong suspect means the real culprit walks free.</p>
      <button class="btn btn--accent btn--block" onclick="closeModal()">Got it</button>
    `);
  });
  document.getElementById("footer-reset-btn").addEventListener("click", () => {
    openModal(`
      <h3>Reset all progress?</h3>
      <p>This clears every case, badge, notebook entry, and point you've earned. This cannot be undone.</p>
      <div class="evidence-modal__actions">
        <button class="btn btn--danger" id="confirm-reset">Yes, reset everything</button>
        <button class="btn btn--ghost" onclick="closeModal()">Cancel</button>
      </div>
    `);
    document.getElementById("confirm-reset").addEventListener("click", () => {
      resetAllProgress();
      closeModal();
      navigate("landing");
    });
  });
}

/* ============================================================
   MODAL HELPERS
   ============================================================ */
function openModal(html) {
  const overlay = document.getElementById("modal-overlay");
  document.getElementById("modal-content").innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>` + html;
  overlay.classList.remove("hidden");
  SFX.open();
}
function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}
document.getElementById("modal-overlay").addEventListener("click", (e) => {
  if (e.target.id === "modal-overlay") closeModal();
});

/* ============================================================
   DASHBOARD
   ============================================================ */
function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

function renderDashboard() {
  const root = document.getElementById("dashboard-root");
  const rank = getRankForPoints(STATE.profile.points);
  const nextRank = getNextRank(STATE.profile.points);
  const progressPct = nextRank ? Math.min(100, Math.round(((STATE.profile.points - rank.min) / (nextRank.min - rank.min)) * 100)) : 100;
  const quote = DAILY_QUOTES[dayOfYear() % DAILY_QUOTES.length];

  const inProgress = CASES.find(c => {
    const p = getCaseProgress(c.id);
    return p.started && !p.solved;
  });

  root.innerHTML = `
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Welcome back, ${escapeHTML(STATE.profile.name)}.</h1>
        <p class="text-mute mb-0">Rank: <strong>${rank.name}</strong> \u00B7 ${STATE.profile.points} points</p>
      </div>
      <div class="dash-quote">"${quote}"</div>
    </div>

    <div class="dash-grid">
      <div class="dash-card">
        <div class="dash-card__label">Detective Rank</div>
        <div class="dash-card__value">${rank.name}</div>
        <div class="progress-bar"><div class="progress-bar__fill" style="width:${progressPct}%"></div></div>
        <div class="dash-card__sub">${nextRank ? `${nextRank.min - STATE.profile.points} pts to ${nextRank.name}` : "Top rank achieved"}</div>
      </div>
      <div class="dash-card">
        <div class="dash-card__label">Cases Solved</div>
        <div class="dash-card__value">${STATE.profile.casesSolved} / ${CASES.length}</div>
        <div class="progress-bar"><div class="progress-bar__fill" style="width:${(STATE.profile.casesSolved / CASES.length) * 100}%"></div></div>
      </div>
      <div class="dash-card">
        <div class="dash-card__label">Total Points</div>
        <div class="dash-card__value">${STATE.profile.points}</div>
        <div class="dash-card__sub">Earned from clues, puzzles &amp; accusations</div>
      </div>
      <div class="dash-card">
        <div class="dash-card__label">Achievements</div>
        <div class="dash-card__value">${STATE.profile.achievements.length} / ${ACHIEVEMENTS.length}</div>
        <div class="dash-card__sub">Badges unlocked</div>
      </div>
    </div>

    ${inProgress ? `
      <h2 class="dash-section-title">Current Investigation</h2>
      <div class="current-case-card">
        <div class="current-case-card__info">
          <div class="case-card__number">CASE ${inProgress.number}</div>
          <h3>${inProgress.title}</h3>
          <p class="mb-0">${inProgress.tagline}</p>
        </div>
        <button class="btn btn--accent" data-open-case="${inProgress.id}">Continue Investigation</button>
      </div>
    ` : `
      <h2 class="dash-section-title">Current Investigation</h2>
      <div class="current-case-card">
        <div class="current-case-card__info">
          <p class="mb-0">No active case. Open the case files to begin your next investigation.</p>
        </div>
        <button class="btn btn--accent" data-nav="cases">Browse Cases</button>
      </div>
    `}

    <h2 class="dash-section-title">Achievement Badges</h2>
    <div class="badges-grid">
      ${ACHIEVEMENTS.map(a => `
        <div class="badge-card ${STATE.profile.achievements.includes(a.id) ? "unlocked" : ""}">
          <div class="badge-icon">${a.icon}</div>
          <div class="badge-name">${a.name}</div>
        </div>
      `).join("")}
    </div>
  `;

  root.querySelectorAll("[data-open-case]").forEach(btn => {
    btn.addEventListener("click", () => navigate("case-detail", { caseId: btn.dataset.openCase }));
  });
  root.querySelectorAll("[data-nav]").forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.nav)));
}

/* ============================================================
   CASES LIST
   ============================================================ */
let caseFilter = "all", caseSearch = "";

function renderCasesList() {
  const root = document.getElementById("cases-root");
  root.innerHTML = `
    <h1>Case Files</h1>
    <p class="text-mute">Five investigations. Every ending depends on what you decide.</p>
    <div class="cases-toolbar">
      <input type="text" class="search-input" id="case-search" placeholder="Search cases by title or theme\u2026" value="${caseSearch}">
      <button class="filter-chip ${caseFilter === "all" ? "active" : ""}" data-diff="all">All</button>
      <button class="filter-chip ${caseFilter === "Easy" ? "active" : ""}" data-diff="Easy">Easy</button>
      <button class="filter-chip ${caseFilter === "Medium" ? "active" : ""}" data-diff="Medium">Medium</button>
      <button class="filter-chip ${caseFilter === "Hard" ? "active" : ""}" data-diff="Hard">Hard</button>
      <button class="filter-chip ${caseFilter === "Expert" ? "active" : ""}" data-diff="Expert">Expert</button>
    </div>
    <div class="cases-grid" id="cases-grid"></div>
  `;

  document.getElementById("case-search").addEventListener("input", (e) => {
    caseSearch = e.target.value;
    renderCasesGrid();
  });
  root.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      caseFilter = chip.dataset.diff;
      renderCasesList();
    });
  });
  renderCasesGrid();
}

function renderCasesGrid() {
  const grid = document.getElementById("cases-grid");
  const term = caseSearch.trim().toLowerCase();
  const filtered = CASES.filter(c => {
    const matchesDiff = caseFilter === "all" || c.difficulty === caseFilter;
    const matchesSearch = !term || c.title.toLowerCase().includes(term) || c.tagline.toLowerCase().includes(term) || c.story.join(" ").toLowerCase().includes(term);
    return matchesDiff && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">No cases match your search. Try a different term or filter.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => {
    const progress = getCaseProgress(c.id);
    const diffClass = "difficulty-tag--" + c.difficulty.toLowerCase();
    return `
      <div class="case-card" data-case="${c.id}">
        ${progress.solved ? `<span class="case-card__solved-tag">\u2705</span>` : ""}
        <div class="case-card__number">CASE ${c.number}</div>
        <h3 class="case-card__title">${c.title}</h3>
        <p class="case-card__tagline">${c.tagline}</p>
        <div class="case-card__meta">
          <span class="difficulty-tag ${diffClass}">${c.difficulty}</span>
          <span class="text-mute">${progress.started ? (progress.solved ? "Solved" : "In progress") : "Not started"}</span>
        </div>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".case-card").forEach(card => {
    card.addEventListener("click", () => navigate("case-detail", { caseId: card.dataset.case }));
  });
}

/* ============================================================
   CASE DETAIL
   ============================================================ */
const CASE_TABS = ["story", "victim", "suspects", "witnesses", "scene", "evidence", "timeline", "notes", "accusation"];
const CASE_TAB_LABELS = {
  story: "Story", victim: "Victim", suspects: "Suspects", witnesses: "Witnesses",
  scene: "Crime Scene", evidence: "Evidence", timeline: "Timeline", notes: "Notes", accusation: "Accusation"
};

function renderCaseDetail(caseId, initialTab) {
  const c = getCaseById(caseId);
  if (!c) { navigate("cases"); return; }
  CURRENT_CASE_ID = caseId;
  const progress = getCaseProgress(caseId);
  if (!progress.started) {
    progress.started = true;
    progress.startedAt = Date.now();
    saveState();
  }
  if (!SESSION_START[caseId]) SESSION_START[caseId] = progress.startedAt || Date.now();
  CURRENT_TAB = initialTab || "story";

  const root = document.getElementById("case-detail-root");
  root.innerHTML = `
    <div class="case-detail-header">
      <button class="breadcrumb" data-nav="cases">\u2190 Back to Case Files</button>
      <div class="case-card__number">CASE ${c.number}</div>
      <h1 class="case-detail-title">${c.title}</h1>
      <div class="case-detail-meta">
        <span class="difficulty-tag difficulty-tag--${c.difficulty.toLowerCase()}">${c.difficulty}</span>
        <span>${progress.solved ? "\u2705 Solved" : "\u{1F4CB} In progress"}</span>
        <span>Evidence viewed: ${progress.evidenceViewed.length}/${c.evidence.length}</span>
        <span>Hidden clues found: ${progress.hiddenFound.length}/${c.hiddenClues.length}</span>
      </div>
    </div>
    <div class="tabs" id="case-tabs">
      ${CASE_TABS.map(t => `<button class="tab-btn" data-tab="${t}">${CASE_TAB_LABELS[t]}</button>`).join("")}
    </div>
    <div id="case-tab-content"></div>
  `;
  root.querySelector("[data-nav='cases']").addEventListener("click", () => navigate("cases"));
  root.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      CURRENT_TAB = btn.dataset.tab;
      SFX.click();
      renderCaseTab(c, progress);
      root.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === CURRENT_TAB));
    });
  });
  root.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === CURRENT_TAB));
  renderCaseTab(c, progress);
}

function renderCaseTab(c, progress) {
  const container = document.getElementById("case-tab-content");
  let html = "";

  if (CURRENT_TAB === "story") {
    html = `<div class="story-block">${c.story.map(p => `<p>${p}</p>`).join("")}</div>`;
  }

  if (CURRENT_TAB === "victim") {
    const v = c.victim;
    html = `
      <div class="profile-card">
        <div class="profile-card__avatar">\u{1FAA6}</div>
        <div class="profile-card__body">
          <h3>${v.name}</h3>
          <p class="text-mute mb-0">${v.occupation} \u00B7 Age ${v.age}</p>
          <p>${v.bio}</p>
          <div class="profile-card__tags">
            <span class="tag">Cause of death: ${v.causeOfDeath}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (CURRENT_TAB === "suspects") {
    html = `<div class="suspects-grid">${c.suspects.map(s => {
      const eliminated = progress.eliminated && progress.eliminated.includes(s.id);
      const saved = STATE.notebook.suspects.some(n => n.caseId === c.id && n.suspectId === s.id);
      return `
        <div class="suspect-card ${eliminated ? "eliminated" : ""}" data-suspect="${s.id}">
          <div class="suspect-card__top">
            <div class="suspect-card__avatar">${s.photo}</div>
            <div>
              <h3 class="suspect-card__name">${s.name}</h3>
              <div class="suspect-card__occ">${s.occupation} \u00B7 Age ${s.age}</div>
            </div>
          </div>
          <div class="suspect-field"><b>Motive:</b> ${s.motive}</div>
          <div class="suspect-field"><b>Alibi:</b> ${s.alibi}</div>
          <div class="suspect-card__actions">
            <button class="btn btn--sm btn--ghost" data-eliminate="${s.id}">${eliminated ? "Un-eliminate" : "Eliminate Suspect"}</button>
            <button class="btn btn--sm btn--ghost" data-save-suspect="${s.id}" ${saved ? "disabled" : ""}>${saved ? "Saved \u2713" : "Save to Notebook"}</button>
          </div>
        </div>
      `;
    }).join("")}</div>`;
  }

  if (CURRENT_TAB === "witnesses") {
    html = c.witnesses.map(w => `
      <div class="witness-card">
        <div class="witness-card__name">${w.name}</div>
        <div class="witness-card__statement">"${w.statement}"</div>
        <div class="reliability-tag">Reliability: ${w.reliability}</div>
      </div>
    `).join("");
  }

  if (CURRENT_TAB === "scene") {
    html = `
      <div class="scene-box">
        <div class="scene-box__location">\u{1F4CD} ${c.crimeScene.location}</div>
        <p>${c.crimeScene.description}</p>
        <ul class="scene-details">${c.crimeScene.details.map(d => `<li>${d}</li>`).join("")}</ul>
      </div>
    `;
  }

  if (CURRENT_TAB === "evidence") {
    html = `
      <div class="evidence-grid">
        ${c.evidence.map(ev => {
          const viewed = progress.evidenceViewed.includes(ev.id);
          const important = progress.important.includes(ev.id);
          return `
            <div class="evidence-card ${viewed ? "viewed" : ""}" data-evidence="${ev.id}">
              ${important ? `<span class="evidence-card__important-flag">\u2605</span>` : ""}
              <div class="evidence-card__icon">${EVIDENCE_ICONS[ev.type] || "\u{1F4CE}"}</div>
              <div class="evidence-card__title">${ev.title}</div>
              <div class="evidence-card__type">${ev.type}</div>
            </div>
          `;
        }).join("")}
      </div>
      <h2 class="dash-section-title">Hidden Clues</h2>
      <div class="hidden-clues-box">
        ${c.hiddenClues.map((hc, i) => {
          const unlocked = progress.hiddenFound.includes(hc.id);
          return `
            <div class="hidden-clue-row ${unlocked ? "unlocked" : ""}">
              <span class="hidden-clue-text">${unlocked ? hc.description : `Hidden Clue #${i + 1} \u2014 locked. Solve a puzzle to reveal it.`}</span>
              ${unlocked ? "" : `<button class="btn btn--sm btn--accent" data-unlock-clue="${hc.id}">Unlock</button>`}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  if (CURRENT_TAB === "timeline") {
    html = `<div class="timeline">${c.timeline.map(t => `
      <div class="timeline-item">
        <div class="timeline-time">${t.time}</div>
        <div class="timeline-event">${t.event}</div>
      </div>
    `).join("")}</div>`;
  }

  if (CURRENT_TAB === "notes") {
    const key = "casenotes_" + c.id;
    const existing = STATE.notebook.notes.filter(n => n.caseSpecific === c.id);
    html = `
      <p class="text-mute">Investigation notes for this case are saved to your Detective Notebook automatically.</p>
      <textarea class="notes-textarea" id="case-note-input" placeholder="Write your working theory, suspicions, or reminders for ${c.title}\u2026"></textarea>
      <div class="notebook-actions">
        <button class="btn btn--accent" id="save-case-note">Save Note</button>
        <button class="btn btn--ghost" data-nav="notebook">Open Full Notebook</button>
      </div>
      <h2 class="dash-section-title">Notes for This Case</h2>
      <div class="notebook-list">
        ${existing.length === 0 ? `<div class="notebook-empty">No notes yet for this case.</div>` : existing.map(n => `
          <div class="notebook-item">
            <div><div>${escapeHTML(n.text)}</div><div class="notebook-item__meta">${new Date(n.ts).toLocaleString()}</div></div>
            <button class="notebook-item__remove" data-remove-note="${n.id}">&times;</button>
          </div>
        `).join("")}
      </div>
    `;
  }

  if (CURRENT_TAB === "accusation") {
    html = renderAccusationHTML(c, progress);
  }

  container.innerHTML = html;
  bindCaseTabEvents(c, progress);
}

function bindCaseTabEvents(c, progress) {
  const container = document.getElementById("case-tab-content");

  container.querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => navigate(b.dataset.nav)));

  // Suspects
  container.querySelectorAll("[data-eliminate]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.eliminate;
      if (!progress.eliminated) progress.eliminated = [];
      const idx = progress.eliminated.indexOf(id);
      if (idx === -1) { progress.eliminated.push(id); SFX.click(); } else { progress.eliminated.splice(idx, 1); }
      saveState();
      renderCaseTab(c, progress);
    });
  });
  container.querySelectorAll("[data-save-suspect]").forEach(btn => {
    btn.addEventListener("click", () => {
      const suspect = c.suspects.find(s => s.id === btn.dataset.saveSuspect);
      if (saveSuspectToNotebook(c.id, suspect)) { SFX.unlock(); renderCaseTab(c, progress); }
    });
  });

  // Evidence
  container.querySelectorAll("[data-evidence]").forEach(card => {
    card.addEventListener("click", () => openEvidenceModal(c, card.dataset.evidence));
  });
  container.querySelectorAll("[data-unlock-clue]").forEach(btn => {
    btn.addEventListener("click", () => openHiddenClueGame(c, btn.dataset.unlockClue));
  });

  // Notes
  const noteBtn = container.querySelector("#save-case-note");
  if (noteBtn) {
    noteBtn.addEventListener("click", () => {
      const textarea = container.querySelector("#case-note-input");
      const text = textarea.value.trim();
      if (!text) return;
      STATE.notebook.notes.unshift({ id: "n" + Date.now(), text, ts: Date.now(), caseSpecific: c.id });
      saveState();
      SFX.click();
      renderCaseTab(c, progress);
    });
  }
  container.querySelectorAll("[data-remove-note]").forEach(btn => {
    btn.addEventListener("click", () => { removeNotebookNote(btn.dataset.removeNote); renderCaseTab(c, progress); });
  });

  // Accusation
  bindAccusationEvents(c, progress);
}

/* ---- Evidence modal ---- */
function openEvidenceModal(c, evidenceId) {
  const ev = c.evidence.find(e => e.id === evidenceId);
  const progress = getCaseProgress(c.id);
  if (!progress.evidenceViewed.includes(ev.id)) {
    progress.evidenceViewed.push(ev.id);
    saveState();
    checkCaseAchievements(c.id);
  }
  const important = progress.important.includes(ev.id);
  const saved = STATE.notebook.clues.some(cl => cl.caseId === c.id && cl.evidenceId === ev.id);

  openModal(`
    <div class="evidence-modal__icon">${EVIDENCE_ICONS[ev.type] || "\u{1F4CE}"}</div>
    <h3>${ev.title}</h3>
    <p class="text-mute">Type: ${ev.type}</p>
    <p>${ev.description}</p>
    <div class="evidence-modal__actions">
      <button class="btn btn--accent" id="mark-important-btn">${important ? "\u2605 Marked Important" : "\u2606 Mark as Important"}</button>
      <button class="btn btn--ghost" id="save-clue-btn" ${saved ? "disabled" : ""}>${saved ? "Saved to Notebook \u2713" : "Save to Notebook"}</button>
    </div>
  `);

  document.getElementById("mark-important-btn").addEventListener("click", () => {
    const idx = progress.important.indexOf(ev.id);
    if (idx === -1) { progress.important.push(ev.id); addPoints(10); SFX.unlock(); } else { progress.important.splice(idx, 1); }
    saveState();
    openEvidenceModal(c, evidenceId);
  });
  document.getElementById("save-clue-btn").addEventListener("click", () => {
    if (saveClueToNotebook(c.id, ev)) { SFX.click(); openEvidenceModal(c, evidenceId); }
  });

  // refresh the grid behind the modal
  if (document.getElementById("case-tab-content")) renderCaseTab(c, progress);
}

/* ---- Hidden clue unlock (mini cipher puzzle) ---- */
function openHiddenClueGame(c, clueId) {
  const clue = c.hiddenClues.find(h => h.id === clueId);
  const progress = getCaseProgress(c.id);
  const relatedEv = c.evidence.find(e => e.id === clue.relatedEvidence);
  const plaintext = (relatedEv ? relatedEv.title : "HIDDEN CLUE").toUpperCase();

  openModal(`<h3>Unlock Hidden Clue</h3><div id="hidden-clue-game"></div>`);
  const gameRoot = document.getElementById("hidden-clue-game");
  initCipherGame(gameRoot, (won, points) => {
    if (won) {
      if (!progress.hiddenFound.includes(clueId)) {
        progress.hiddenFound.push(clueId);
        addPoints(points);
        saveState();
        checkCaseAchievements(c.id);
      }
      setTimeout(() => {
        closeModal();
        renderCaseTab(c, progress);
        renderCaseDetail(c.id, "evidence");
      }, 900);
    }
  }, { plaintext });
}

/* ---- Accusation ---- */
let selectedAccusationSuspect = null;

function renderAccusationHTML(c, progress) {
  if (progress.solved) {
    const ending = c.accusation.endings[progress.lastEndingKey];
    return renderEndingHTML(c, ending, true);
  }
  return `
    <div class="accusation-box">
      <h2>Name the Killer</h2>
      <p class="text-mute">Review your evidence and notebook, then choose who you believe committed the crime. Choose carefully \u2014 you can only close the case once per attempt.</p>
      <div class="accusation-suspects">
        ${c.suspects.map(s => `
          <div class="accuse-option" data-accuse="${s.id}">
            <div class="accuse-option__avatar">${s.photo}</div>
            <div>${s.name}</div>
          </div>
        `).join("")}
      </div>
      <button class="btn btn--ghost" id="hint-btn">Need a Hint? (\u22125 pts)</button>
      <div id="hint-output" class="game-feedback"></div>
      <button class="btn btn--accent btn--lg mt-20" id="submit-accusation" disabled>Submit Final Accusation</button>
    </div>
  `;
}

function renderEndingHTML(c, ending, alreadySolved) {
  return `
    <div class="accusation-box ending-card">
      <div class="ending-card__icon">${ending.success ? "\u{1F3C6}" : "\u274C"}</div>
      <h2 class="ending-card__title ${ending.success ? "success" : "fail"}">${ending.title}</h2>
      <p class="ending-card__text">${ending.text}</p>
      <div class="ending-card__actions">
        ${ending.success ? `
          <button class="btn btn--accent" id="print-report-btn">\u{1F5A8}\uFE0F Print Investigation Report</button>
          <button class="btn btn--ghost" data-nav="cases">Back to Case Files</button>
        ` : `
          <button class="btn btn--accent" id="retry-case-btn">Retry This Case</button>
          <button class="btn btn--ghost" data-nav="cases">Back to Case Files</button>
        `}
      </div>
    </div>
  `;
}

function bindAccusationEvents(c, progress) {
  const container = document.getElementById("case-tab-content");
  if (CURRENT_TAB !== "accusation") return;

  container.querySelectorAll("[data-accuse]").forEach(opt => {
    opt.addEventListener("click", () => {
      selectedAccusationSuspect = opt.dataset.accuse;
      container.querySelectorAll(".accuse-option").forEach(o => o.classList.toggle("selected", o.dataset.accuse === selectedAccusationSuspect));
      const submitBtn = container.querySelector("#submit-accusation");
      if (submitBtn) submitBtn.disabled = false;
      SFX.click();
    });
  });

  const hintBtn = container.querySelector("#hint-btn");
  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      const locked = c.hiddenClues.filter(h => !progress.hiddenFound.includes(h.id));
      const output = container.querySelector("#hint-output");
      if (locked.length > 0) {
        output.textContent = "Hint: " + locked[0].description;
      } else {
        const wrongest = c.suspects.find(s => s.id !== c.accusation.correctSuspectId);
        output.textContent = `Hint: Re-read every alibi against the witness statements \u2014 one suspect's timeline doesn't hold up, and it isn't ${wrongest.name}.`;
      }
      if (STATE.profile.points >= 5) addPoints(-5);
      SFX.hover();
    });
  }

  const submitBtn = container.querySelector("#submit-accusation");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => handleAccusation(c, progress));
  }

  const printBtn = container.querySelector("#print-report-btn");
  if (printBtn) printBtn.addEventListener("click", () => printInvestigationReport(c));

  const retryBtn = container.querySelector("#retry-case-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      progress.accusedSuspect = null;
      progress.lastEndingKey = null;
      selectedAccusationSuspect = null;
      saveState();
      renderCaseTab(c, progress);
    });
  }

  container.querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => navigate(b.dataset.nav)));
}

function handleAccusation(c, progress) {
  if (!selectedAccusationSuspect) return;
  progress.attempts = (progress.attempts || 0) + 1;
  progress.accusedSuspect = selectedAccusationSuspect;
  progress.lastEndingKey = selectedAccusationSuspect;

  const correct = selectedAccusationSuspect === c.accusation.correctSuspectId;

  if (correct) {
    progress.solved = true;
    progress.solvedAt = Date.now();
    STATE.profile.casesSolved += 1;

    let points = 100;
    points += progress.hiddenFound.length * 10;
    points += progress.important.length * 5;
    const elapsed = Date.now() - (SESSION_START[c.id] || Date.now());
    if (elapsed < 10 * 60 * 1000) points += 20; // speed bonus under 10 minutes

    addPoints(points);
    saveState();
    checkAggregateAchievements();
    checkCaseAchievements(c.id);
    SFX.success();
    launchConfetti();
  } else {
    saveState();
    SFX.fail();
  }

  selectedAccusationSuspect = null;
  renderCaseTab(c, progress);
}

/* ============================================================
   PRINTABLE INVESTIGATION REPORT
   ============================================================ */
function printInvestigationReport(c) {
  const progress = getCaseProgress(c.id);
  const ending = c.accusation.endings[progress.lastEndingKey];
  const w = window.open("", "_blank");
  w.document.write(`
    <html><head><title>Investigation Report \u2014 ${c.title}</title>
    <style>
      body { font-family: Georgia, serif; padding: 40px; max-width: 700px; margin: 0 auto; color: #111; }
      h1 { font-size: 1.8rem; } h2 { font-size: 1.2rem; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 6px; }
      .meta { color: #555; font-size: .9rem; }
      .clue { margin-bottom: 8px; }
    </style></head><body>
      <h1>DetectiveHub Investigation Report</h1>
      <p class="meta">Case ${c.number}: ${c.title} \u2014 Difficulty: ${c.difficulty}</p>
      <p class="meta">Detective: ${escapeHTML(STATE.profile.name)} \u2014 Rank: ${getRankForPoints(STATE.profile.points).name}</p>
      <h2>Verdict</h2>
      <p><strong>${ending.title}</strong></p>
      <p>${ending.text}</p>
      <h2>Evidence Reviewed</h2>
      ${c.evidence.filter(e => progress.evidenceViewed.includes(e.id)).map(e => `<div class="clue">\u2022 <strong>${e.title}</strong>: ${e.description}</div>`).join("") || "<p>No evidence recorded.</p>"}
      <h2>Hidden Clues Uncovered</h2>
      ${c.hiddenClues.filter(h => progress.hiddenFound.includes(h.id)).map(h => `<div class="clue">\u2022 ${h.description}</div>`).join("") || "<p>None uncovered.</p>"}
      <h2>Case Statistics</h2>
      <p>Attempts: ${progress.attempts} \u00B7 Evidence viewed: ${progress.evidenceViewed.length}/${c.evidence.length} \u00B7 Hidden clues found: ${progress.hiddenFound.length}/${c.hiddenClues.length}</p>
    </body></html>
  `);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

/* ============================================================
   NOTEBOOK SCREEN
   ============================================================ */
let notebookTab = "notes";
function renderNotebookScreen() {
  const root = document.getElementById("notebook-root");
  root.innerHTML = `
    <h1>Detective Notebook</h1>
    <p class="text-mute">Everything you save here persists on this device only.</p>
    <div class="notebook-tabs">
      <button class="filter-chip ${notebookTab === "notes" ? "active" : ""}" data-ntab="notes">Notes (${STATE.notebook.notes.length})</button>
      <button class="filter-chip ${notebookTab === "clues" ? "active" : ""}" data-ntab="clues">Saved Clues (${STATE.notebook.clues.length})</button>
      <button class="filter-chip ${notebookTab === "suspects" ? "active" : ""}" data-ntab="suspects">Suspects (${STATE.notebook.suspects.length})</button>
    </div>
    <div id="notebook-tab-content"></div>
    <div class="notebook-actions">
      <button class="btn btn--accent" id="export-notebook-btn">\u2B07\uFE0F Export as .txt</button>
      <button class="btn btn--danger" id="clear-notebook-btn">Clear Notebook</button>
    </div>
  `;
  root.querySelectorAll("[data-ntab]").forEach(btn => {
    btn.addEventListener("click", () => { notebookTab = btn.dataset.ntab; renderNotebookScreen(); });
  });
  renderNotebookTabContent();

  document.getElementById("export-notebook-btn").addEventListener("click", () => { exportNotebookAsText(); SFX.click(); });
  document.getElementById("clear-notebook-btn").addEventListener("click", () => {
    openModal(`
      <h3>Clear the entire notebook?</h3>
      <p>This removes all saved notes, clues, and suspects. This cannot be undone.</p>
      <div class="evidence-modal__actions">
        <button class="btn btn--danger" id="confirm-clear-notebook">Yes, clear it</button>
        <button class="btn btn--ghost" onclick="closeModal()">Cancel</button>
      </div>
    `);
    document.getElementById("confirm-clear-notebook").addEventListener("click", () => {
      clearNotebook(); closeModal(); renderNotebookScreen();
    });
  });
}

function renderNotebookTabContent() {
  const container = document.getElementById("notebook-tab-content");
  if (notebookTab === "notes") {
    container.innerHTML = `
      <div class="notebook-note-form">
        <textarea id="new-note-input" placeholder="Jot a general investigation note\u2026"></textarea>
        <button class="btn btn--accent" id="add-note-btn">Save Note</button>
      </div>
      <div class="notebook-list">
        ${STATE.notebook.notes.length === 0 ? `<div class="notebook-empty">No notes yet. Start writing as you investigate.</div>` :
          STATE.notebook.notes.map(n => `
            <div class="notebook-item">
              <div><div>${escapeHTML(n.text)}</div><div class="notebook-item__meta">${new Date(n.ts).toLocaleString()}${n.caseSpecific ? " \u00B7 " + (getCaseById(n.caseSpecific) || {}).title : ""}</div></div>
              <button class="notebook-item__remove" data-remove-note="${n.id}">&times;</button>
            </div>
          `).join("")}
      </div>
    `;
    document.getElementById("add-note-btn").addEventListener("click", () => {
      const val = document.getElementById("new-note-input").value;
      addNotebookNote(val);
      SFX.click();
      renderNotebookTabContent();
    });
    container.querySelectorAll("[data-remove-note]").forEach(btn => btn.addEventListener("click", () => { removeNotebookNote(btn.dataset.removeNote); renderNotebookTabContent(); }));
  }

  if (notebookTab === "clues") {
    container.innerHTML = `
      <div class="notebook-list">
        ${STATE.notebook.clues.length === 0 ? `<div class="notebook-empty">No clues saved yet. Open evidence in a case and save it here.</div>` :
          STATE.notebook.clues.map(cl => `
            <div class="notebook-item">
              <div><div><strong>${cl.title}</strong> \u2014 ${(getCaseById(cl.caseId) || {}).title || ""}</div><div class="notebook-item__meta">${cl.description}</div></div>
              <button class="notebook-item__remove" data-remove-clue="${cl.id}">&times;</button>
            </div>
          `).join("")}
      </div>
    `;
    container.querySelectorAll("[data-remove-clue]").forEach(btn => btn.addEventListener("click", () => { removeNotebookClue(btn.dataset.removeClue); renderNotebookTabContent(); }));
  }

  if (notebookTab === "suspects") {
    container.innerHTML = `
      <div class="notebook-list">
        ${STATE.notebook.suspects.length === 0 ? `<div class="notebook-empty">No suspects saved yet. Open a suspect profile and save them here.</div>` :
          STATE.notebook.suspects.map(s => `
            <div class="notebook-item">
              <div><div><strong>${s.name}</strong> \u2014 ${(getCaseById(s.caseId) || {}).title || ""}</div><div class="notebook-item__meta">Motive: ${s.motive}</div></div>
              <button class="notebook-item__remove" data-remove-suspect="${s.id}">&times;</button>
            </div>
          `).join("")}
      </div>
    `;
    container.querySelectorAll("[data-remove-suspect]").forEach(btn => btn.addEventListener("click", () => { removeNotebookSuspect(btn.dataset.removeSuspect); renderNotebookTabContent(); }));
  }
}

/* ============================================================
   EVIDENCE BOARD SCREEN
   ============================================================ */
function renderBoardScreen(preselectedCaseId) {
  const root = document.getElementById("board-root");
  const activeId = preselectedCaseId || CURRENT_CASE_ID || CASES[0].id;
  root.innerHTML = `
    <h1>Evidence Board</h1>
    <p class="text-mute">Pick a case, then drag evidence around the corkboard and connect related clues with string.</p>
    <div class="board-case-picker" id="board-case-picker"></div>
    <div id="board-container"></div>
  `;
  const picker = document.getElementById("board-case-picker");
  picker.innerHTML = CASES.map(c => `<button class="filter-chip ${c.id === activeId ? "active" : ""}" data-board-case="${c.id}">${c.title}</button>`).join("");
  picker.querySelectorAll("[data-board-case]").forEach(btn => {
    btn.addEventListener("click", () => { renderBoardScreen(btn.dataset.boardCase); });
  });
  renderEvidenceBoard(document.getElementById("board-container"), getCaseById(activeId));
}

/* ============================================================
   MINI GAMES HUB
   ============================================================ */
function renderGamesScreen() {
  const root = document.getElementById("games-root");
  root.innerHTML = `
    <h1>Mini Games</h1>
    <p class="text-mute">Sharpen your investigation skills. Win a game to bank points toward your rank.</p>
    <div class="games-grid">
      ${Object.entries(MINI_GAMES).map(([id, g]) => `
        <div class="game-card" data-game="${id}">
          <div class="game-card__icon">${g.icon}</div>
          <h3>${g.name}</h3>
          ${STATE.profile.gamesWon[id] ? `<div class="game-card__won">\u2713 Completed</div>` : ""}
        </div>
      `).join("")}
    </div>
  `;
  root.querySelectorAll("[data-game]").forEach(card => {
    card.addEventListener("click", () => navigate("game-detail", { gameId: card.dataset.game }));
  });
}

function renderGameDetail(gameId) {
  CURRENT_GAME_ID = gameId;
  const g = MINI_GAMES[gameId];
  const root = document.getElementById("game-detail-root");
  root.innerHTML = `
    <button class="breadcrumb" id="back-to-games">\u2190 Back to Mini Games</button>
    <h1>${g.icon} ${g.name}</h1>
    <div id="game-play-area"></div>
  `;
  document.getElementById("back-to-games").addEventListener("click", () => navigate("games"));

  g.init(document.getElementById("game-play-area"), (won, points) => {
    if (won) {
      markGameWon(gameId);
      addPoints(points || 0);
      checkAggregateAchievements();
      if (gameId === "cipher") unlockAchievement("code_breaker");
      launchConfetti(40);
    }
  });
}

/* ============================================================
   PROFILE SCREEN
   ============================================================ */
function renderProfileScreen() {
  const root = document.getElementById("profile-root");
  const rank = getRankForPoints(STATE.profile.points);
  root.innerHTML = `
    <h1>Detective Profile</h1>
    <div class="profile-header">
      <div class="profile-avatar">\u{1F575}\uFE0F</div>
      <div>
        <input type="text" class="search-input" id="profile-name-input" value="${escapeHTML(STATE.profile.name)}" style="max-width:260px;">
        <p class="text-mute mb-0">Rank: <strong>${rank.name}</strong> \u00B7 ${STATE.profile.points} points \u00B7 ${STATE.profile.casesSolved} cases solved</p>
      </div>
    </div>

    <h2 class="dash-section-title">Theme</h2>
    <div class="theme-swatches">
      <div class="theme-swatch ${STATE.profile.theme === "dark" ? "active" : ""}" style="background:#7d1f2b" data-theme-pick="dark" title="Dark"></div>
      <div class="theme-swatch ${STATE.profile.theme === "noir" ? "active" : ""}" style="background:#3a3a3a" data-theme-pick="noir" title="Noir"></div>
      <div class="theme-swatch ${STATE.profile.theme === "classic" ? "active" : ""}" style="background:#8a3324" data-theme-pick="classic" title="Classic"></div>
    </div>

    <h2 class="dash-section-title">Achievements</h2>
    <div class="badges-grid">
      ${ACHIEVEMENTS.map(a => `
        <div class="badge-card ${STATE.profile.achievements.includes(a.id) ? "unlocked" : ""}">
          <div class="badge-icon">${a.icon}</div>
          <div class="badge-name">${a.name}</div>
        </div>
      `).join("")}
    </div>

    <h2 class="dash-section-title">Danger Zone</h2>
    <button class="btn btn--danger" id="profile-reset-btn">Reset All Progress</button>
  `;
  document.getElementById("profile-name-input").addEventListener("change", (e) => {
    STATE.profile.name = e.target.value.trim() || "Detective";
    saveState();
  });
  root.querySelectorAll("[data-theme-pick]").forEach(sw => {
    sw.addEventListener("click", () => {
      applyTheme(sw.dataset.themePick);
      STATE.profile.theme = sw.dataset.themePick;
      saveState();
      SFX.click();
      renderProfileScreen();
    });
  });
  document.getElementById("profile-reset-btn").addEventListener("click", () => {
    openModal(`
      <h3>Reset all progress?</h3>
      <p>This clears every case, badge, notebook entry, and point you've earned.</p>
      <div class="evidence-modal__actions">
        <button class="btn btn--danger" id="confirm-reset-profile">Yes, reset everything</button>
        <button class="btn btn--ghost" onclick="closeModal()">Cancel</button>
      </div>
    `);
    document.getElementById("confirm-reset-profile").addEventListener("click", () => {
      resetAllProgress(); closeModal(); navigate("landing");
    });
  });
}

/* ============================================================
   CONFETTI
   ============================================================ */
function launchConfetti(count) {
  const canvas = document.getElementById("confetti-canvas");
  canvas.classList.add("active");
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const colors = ["#b5324a", "#c9a24a", "#f2efe9", "#7d1f2b"];
  const pieces = Array.from({ length: count || 90 }).map(() => ({
    x: Math.random() * canvas.width, y: -20 - Math.random() * 200,
    w: 6 + Math.random() * 6, h: 10 + Math.random() * 8,
    color: colors[rand(0, colors.length - 1)],
    speed: 2 + Math.random() * 3, rot: Math.random() * 360, rotSpeed: -6 + Math.random() * 12,
    drift: -1 + Math.random() * 2
  }));
  let frame = 0;
  function loop() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allDone = true;
    pieces.forEach(p => {
      p.y += p.speed; p.x += p.drift; p.rot += p.rotSpeed;
      if (p.y < canvas.height + 20) allDone = false;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (!allDone && frame < 400) requestAnimationFrame(loop);
    else { canvas.classList.remove("active"); ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  loop();
}

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
function bindKeyboardShortcuts() {
  let gPressed = false;
  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    if (e.key === "Escape") {
      closeModal();
      document.getElementById("shortcuts-overlay").classList.add("hidden");
      return;
    }
    if (e.key === "?") {
      document.getElementById("shortcuts-overlay").classList.toggle("hidden");
      return;
    }
    if (e.key.toLowerCase() === "g") { gPressed = true; setTimeout(() => gPressed = false, 900); return; }
    if (gPressed) {
      const map = { d: "dashboard", c: "cases", n: "notebook", b: "board", m: "games" };
      const target = map[e.key.toLowerCase()];
      if (target) { navigate(target); gPressed = false; }
    }
  });
  document.getElementById("shortcuts-close").addEventListener("click", () => {
    document.getElementById("shortcuts-overlay").classList.add("hidden");
  });
}

/* ============================================================
   EASTER EGG (Konami-style)
   ============================================================ */
function bindEasterEgg() {
  const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"];
  let idx = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        idx = 0;
        openModal(`
          <h3>\u{1F575}\uFE0F A Secret File</h3>
          <p>You found the detective's private drawer. It contains only a note: <em>"The gardener always knows more than she says."</em></p>
          <p>+50 points for curiosity.</p>
        `);
        addPoints(50);
        SFX.achievement();
        launchConfetti(60);
      }
    } else {
      idx = (e.key === seq[0]) ? 1 : 0;
    }
  });
}

/* ============================================================
   UTIL
   ============================================================ */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
