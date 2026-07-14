/* ============================================================
   DetectiveHub — Achievements
   ============================================================ */

function unlockAchievement(id) {
  if (STATE.profile.achievements.includes(id)) return;
  STATE.profile.achievements.push(id);
  saveState();
  const def = ACHIEVEMENTS.find(a => a.id === id);
  if (def) showAchievementPopup(def);
  SFX.achievement();
}

function showAchievementPopup(def) {
  const popup = document.createElement("div");
  popup.className = "achievement-popup";
  popup.innerHTML = `
    <div class="achievement-popup__icon">${def.icon}</div>
    <div class="achievement-popup__body">
      <div class="achievement-popup__label">Achievement Unlocked</div>
      <div class="achievement-popup__name">${def.name}</div>
      <div class="achievement-popup__desc">${def.desc}</div>
    </div>
  `;
  document.getElementById("achievement-layer").appendChild(popup);
  requestAnimationFrame(() => popup.classList.add("show"));
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 500);
  }, 4200);
}

/* Check achievements that depend on aggregate state */
function checkAggregateAchievements() {
  if (STATE.profile.casesSolved >= 1) unlockAchievement("first_case");
  if (allGamesWon()) unlockAchievement("puzzle_master");
}

function checkCaseAchievements(caseId) {
  const c = getCaseById(caseId);
  const progress = getCaseProgress(caseId);

  if (progress.hiddenFound.length >= c.hiddenClues.length) {
    unlockAchievement("sharp_observer");
  }
  if (progress.evidenceViewed.length >= c.evidence.length) {
    unlockAchievement("evidence_expert");
  }
  if (
    progress.solved &&
    progress.attempts === 1 &&
    progress.hiddenFound.length >= c.hiddenClues.length
  ) {
    unlockAchievement("perfect_investigation");
  }
}
