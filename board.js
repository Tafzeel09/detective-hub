/* ============================================================
   DetectiveHub — Evidence Board
   A corkboard where evidence cards can be dragged around and
   connected with red string. Positions + connections persist
   per case in localStorage.
   ============================================================ */

let boardConnectMode = false;
let boardConnectFirst = null;

function ensureBoardData(caseId, evidence) {
  const progress = getCaseProgress(caseId);
  if (!progress.boardPositions) progress.boardPositions = {};
  if (!progress.boardConnections) progress.boardConnections = [];
  evidence.forEach((ev, i) => {
    if (!progress.boardPositions[ev.id]) {
      const col = i % 4, row = Math.floor(i / 4);
      progress.boardPositions[ev.id] = {
        x: 40 + col * 190 + rand(-10, 10),
        y: 30 + row * 170 + rand(-10, 10)
      };
    }
  });
  saveState();
  return progress;
}

function renderEvidenceBoard(container, caseObj) {
  const progress = ensureBoardData(caseObj.id, caseObj.evidence);
  const unlockedEvidence = caseObj.evidence; // all evidence pinnable; hidden clues are separate

  container.innerHTML = `
    <div class="board-toolbar">
      <button class="btn btn--ghost" id="board-connect-toggle">${boardConnectMode ? "Cancel Connecting" : "\u{1F9F5} Connect Clues"}</button>
      <button class="btn btn--ghost" id="board-clear">Clear Strings</button>
      <span class="board-hint">${boardConnectMode ? "Tap two cards to string them together." : "Drag cards to rearrange. Use Connect Clues to link evidence."}</span>
    </div>
    <div class="corkboard" id="corkboard">
      <svg class="corkboard__strings" id="corkboard-svg"></svg>
      ${unlockedEvidence.map(ev => `
        <div class="cork-card" data-id="${ev.id}" style="left:${progress.boardPositions[ev.id].x}px; top:${progress.boardPositions[ev.id].y}px;">
          <span class="cork-pin"></span>
          <div class="cork-card__icon">${EVIDENCE_ICONS[ev.type] || "\u{1F4CE}"}</div>
          <div class="cork-card__title">${ev.title}</div>
        </div>
      `).join("")}
    </div>
  `;

  const board = container.querySelector("#corkboard");
  const svg = container.querySelector("#corkboard-svg");

  function drawStrings() {
    const rect = board.getBoundingClientRect();
    svg.setAttribute("width", board.scrollWidth);
    svg.setAttribute("height", board.scrollHeight);
    svg.innerHTML = progress.boardConnections.map(([a, b]) => {
      const pa = progress.boardPositions[a], pb = progress.boardPositions[b];
      if (!pa || !pb) return "";
      const x1 = pa.x + 75, y1 = pa.y + 45, x2 = pb.x + 75, y2 = pb.y + 45;
      const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2 - 30;
      return `<path d="M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}" class="corkboard-string" />`;
    }).join("");
  }
  drawStrings();

  board.querySelectorAll(".cork-card").forEach(card => {
    let dragging = false, offsetX = 0, offsetY = 0;

    card.addEventListener("pointerdown", (e) => {
      if (boardConnectMode) return;
      dragging = true;
      card.setPointerCapture(e.pointerId);
      const r = card.getBoundingClientRect();
      offsetX = e.clientX - r.left;
      offsetY = e.clientY - r.top;
      card.classList.add("dragging");
    });

    card.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const boardRect = board.getBoundingClientRect();
      let x = e.clientX - boardRect.left - offsetX + board.scrollLeft;
      let y = e.clientY - boardRect.top - offsetY + board.scrollTop;
      x = Math.max(0, x); y = Math.max(0, y);
      card.style.left = x + "px";
      card.style.top = y + "px";
      const id = card.dataset.id;
      progress.boardPositions[id] = { x, y };
      drawStrings();
    });

    card.addEventListener("pointerup", () => {
      if (dragging) { dragging = false; card.classList.remove("dragging"); saveState(); }
    });

    card.addEventListener("click", () => {
      if (!boardConnectMode) return;
      const id = card.dataset.id;
      if (boardConnectFirst === null) {
        boardConnectFirst = id;
        card.classList.add("selected");
      } else if (boardConnectFirst === id) {
        card.classList.remove("selected");
        boardConnectFirst = null;
      } else {
        const exists = progress.boardConnections.some(([a, b]) =>
          (a === boardConnectFirst && b === id) || (a === id && b === boardConnectFirst));
        if (!exists) {
          progress.boardConnections.push([boardConnectFirst, id]);
          saveState();
          SFX.unlock();
        }
        board.querySelectorAll(".cork-card").forEach(c => c.classList.remove("selected"));
        boardConnectFirst = null;
        drawStrings();
      }
    });
  });

  container.querySelector("#board-connect-toggle").addEventListener("click", () => {
    boardConnectMode = !boardConnectMode;
    boardConnectFirst = null;
    renderEvidenceBoard(container, caseObj);
  });

  container.querySelector("#board-clear").addEventListener("click", () => {
    progress.boardConnections = [];
    saveState();
    drawStrings();
  });
}
