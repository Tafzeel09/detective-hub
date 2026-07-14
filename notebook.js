/* ============================================================
   DetectiveHub — Detective Notebook
   Personal notes, saved clues, and saved suspects. Everything
   lives in localStorage and can be exported as a .txt file.
   ============================================================ */

function addNotebookNote(text) {
  if (!text || !text.trim()) return;
  STATE.notebook.notes.unshift({ id: "n" + Date.now(), text: text.trim(), ts: Date.now() });
  saveState();
}

function removeNotebookNote(id) {
  STATE.notebook.notes = STATE.notebook.notes.filter(n => n.id !== id);
  saveState();
}

function saveClueToNotebook(caseId, evidenceItem) {
  const already = STATE.notebook.clues.find(c => c.caseId === caseId && c.evidenceId === evidenceItem.id);
  if (already) return false;
  STATE.notebook.clues.unshift({
    id: "c" + Date.now(), caseId, evidenceId: evidenceItem.id,
    title: evidenceItem.title, description: evidenceItem.description, ts: Date.now()
  });
  saveState();
  return true;
}

function removeNotebookClue(id) {
  STATE.notebook.clues = STATE.notebook.clues.filter(c => c.id !== id);
  saveState();
}

function saveSuspectToNotebook(caseId, suspect) {
  const already = STATE.notebook.suspects.find(s => s.caseId === caseId && s.suspectId === suspect.id);
  if (already) return false;
  STATE.notebook.suspects.unshift({
    id: "sn" + Date.now(), caseId, suspectId: suspect.id,
    name: suspect.name, motive: suspect.motive, ts: Date.now()
  });
  saveState();
  return true;
}

function removeNotebookSuspect(id) {
  STATE.notebook.suspects = STATE.notebook.suspects.filter(s => s.id !== id);
  saveState();
}

function clearNotebook() {
  STATE.notebook = { notes: [], clues: [], suspects: [] };
  saveState();
}

function exportNotebookAsText() {
  const lines = [];
  lines.push("========================================");
  lines.push(" DETECTIVEHUB \u2014 CASE NOTEBOOK EXPORT");
  lines.push(" Detective: " + STATE.profile.name);
  lines.push(" Rank: " + getRankForPoints(STATE.profile.points).name);
  lines.push(" Exported: " + new Date().toLocaleString());
  lines.push("========================================\n");

  lines.push("--- NOTES ---");
  if (STATE.notebook.notes.length === 0) lines.push("(no notes saved)");
  STATE.notebook.notes.forEach(n => {
    lines.push("[" + new Date(n.ts).toLocaleString() + "] " + n.text);
  });

  lines.push("\n--- SAVED CLUES ---");
  if (STATE.notebook.clues.length === 0) lines.push("(no clues saved)");
  STATE.notebook.clues.forEach(c => {
    const caseTitle = (getCaseById(c.caseId) || {}).title || c.caseId;
    lines.push(`[${caseTitle}] ${c.title}: ${c.description}`);
  });

  lines.push("\n--- SUSPECTS UNDER SUSPICION ---");
  if (STATE.notebook.suspects.length === 0) lines.push("(no suspects saved)");
  STATE.notebook.suspects.forEach(s => {
    const caseTitle = (getCaseById(s.caseId) || {}).title || s.caseId;
    lines.push(`[${caseTitle}] ${s.name} \u2014 Motive: ${s.motive}`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "detectivehub-notebook.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
