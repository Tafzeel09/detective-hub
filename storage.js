/* ============================================================
   DetectiveHub — Storage / State Layer
   Everything is persisted to localStorage. No backend, no login.
   ============================================================ */

const STORAGE_KEY = "detectivehub_state_v1";

function defaultState() {
  return {
    profile: {
      name: "Detective",
      points: 0,
      casesSolved: 0,
      gamesWon: {},           // { fingerprint: true, cipher: true, ... }
      achievements: [],       // achievement ids unlocked
      theme: "dark",          // dark | noir | classic
      muted: false,
      createdAt: Date.now()
    },
    cases: {
      // per-case-id: { started, solved, accusedSuspect, evidenceViewed:[], hiddenFound:[], important:[], attempts, startedAt, solvedAt }
    },
    notebook: {
      notes: [],       // { id, text, ts }
      clues: [],       // { id, caseId, evidenceId, title }
      suspects: []      // { id, caseId, suspectId, name }
    }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // shallow-merge with defaults so new fields don't break old saves
    const base = defaultState();
    return {
      profile: Object.assign(base.profile, parsed.profile),
      cases: Object.assign(base.cases, parsed.cases),
      notebook: Object.assign(base.notebook, parsed.notebook)
    };
  } catch (e) {
    console.warn("DetectiveHub: could not load state, resetting.", e);
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
  } catch (e) {
    console.warn("DetectiveHub: could not save state.", e);
  }
}

/* Global mutable state, loaded once at startup */
let STATE = loadState();

function resetAllProgress() {
  STATE = defaultState();
  saveState();
}

function getCaseProgress(caseId) {
  if (!STATE.cases[caseId]) {
    STATE.cases[caseId] = {
      started: false,
      solved: false,
      accusedSuspect: null,
      evidenceViewed: [],
      hiddenFound: [],
      important: [],
      attempts: 0,
      startedAt: null,
      solvedAt: null,
      lastEndingKey: null
    };
  }
  return STATE.cases[caseId];
}

function addPoints(amount) {
  STATE.profile.points = Math.max(0, STATE.profile.points + amount);
  saveState();
}

function markGameWon(gameId) {
  STATE.profile.gamesWon[gameId] = true;
  saveState();
}

function allGamesWon() {
  const ids = ["fingerprint", "codebreak", "lock", "memory", "hidden", "cipher"];
  return ids.every(id => STATE.profile.gamesWon[id]);
}
