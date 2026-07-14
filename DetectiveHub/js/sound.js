/* ============================================================
   DetectiveHub — Sound Engine
   Browser-generated tones only (Web Audio API). No audio files,
   no copyrighted music, fully offline.
   ============================================================ */

let AUDIO_CTX = null;

function getAudioCtx() {
  if (!AUDIO_CTX) {
    const AC = window.AudioContext || window.webkitAudioContext;
    AUDIO_CTX = new AC();
  }
  if (AUDIO_CTX.state === "suspended") AUDIO_CTX.resume();
  return AUDIO_CTX;
}

function isMuted() {
  return STATE.profile.muted;
}

function toggleMute() {
  STATE.profile.muted = !STATE.profile.muted;
  saveState();
  return STATE.profile.muted;
}

/* Basic tone with an ADSR-ish envelope */
function playTone(freq, duration, type, gainPeak, delay) {
  if (isMuted()) return;
  try {
    const ctx = getAudioCtx();
    const t0 = ctx.currentTime + (delay || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.15, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  } catch (e) { /* audio unsupported, fail silently */ }
}

const SFX = {
  click() { playTone(440, 0.08, "triangle", 0.08); },
  hover() { playTone(880, 0.04, "sine", 0.03); },
  open()  { playTone(300, 0.15, "sine", 0.12); playTone(450, 0.15, "sine", 0.08, 0.05); },
  success() {
    playTone(523.25, 0.15, "triangle", 0.15, 0);
    playTone(659.25, 0.15, "triangle", 0.15, 0.12);
    playTone(783.99, 0.25, "triangle", 0.15, 0.24);
  },
  fail() {
    playTone(300, 0.25, "sawtooth", 0.1, 0);
    playTone(220, 0.35, "sawtooth", 0.1, 0.15);
  },
  unlock() {
    playTone(660, 0.1, "square", 0.08, 0);
    playTone(880, 0.15, "square", 0.1, 0.1);
  },
  achievement() {
    playTone(659.25, 0.12, "triangle", 0.15, 0);
    playTone(783.99, 0.12, "triangle", 0.15, 0.1);
    playTone(1046.5, 0.3, "triangle", 0.18, 0.2);
  },
  pageTurn() { playTone(200, 0.1, "sine", 0.05); },
  error() { playTone(180, 0.2, "square", 0.08); }
};
