# DetectiveHub

A fully offline, browser-based detective mystery game. Vanilla HTML, CSS, and JavaScript only — no build step, no backend, no accounts, no API keys.

## Run it

Just open `index.html` in any modern browser. That's it — everything (progress, notebook, achievements) is saved to `localStorage` on your device.

For the best experience (some browsers restrict features on `file://`), you can also serve it locally:

```
cd DetectiveHub
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## What's inside

- **Landing page** — animated noir hero, stats, features, footer.
- **Dashboard** — rank, points, cases solved, current investigation, achievement badges.
- **5 full cases** — each with a story, victim profile, 4 suspects, 3 witnesses, a crime scene, a 9-item evidence gallery, a timeline, personal notes, 3 hidden clues, and a final accusation with a different ending per suspect.
- **Detective Notebook** — save notes, clues, and suspects; export everything as a `.txt` file.
- **Evidence Board** — a corkboard per case: drag evidence around and connect clues with red string.
- **6 mini-games** — Fingerprint Matching, Code Breaking, Lock Combination, Memory Challenge, Hidden Object Search, Cipher Decoder (also used in-case to unlock hidden clues).
- **Scoring & ranks** — Rookie → Officer → Investigator → Detective → Senior Detective → Master Detective.
- **Achievements** — First Case Solved, Puzzle Master, Sharp Observer, Code Breaker, Evidence Expert, Perfect Investigation.
- **Sound** — optional Web Audio–generated tones only, with a mute toggle. No audio files, no copyrighted music.
- **Themes** — Dark (default), Noir, Classic, switchable from the nav bar or Profile page.
- **Bonus features** — case search & difficulty filters, daily detective quote, no-AI hint system, printable investigation report, keyboard shortcuts (`?` to view them), custom cursor, and a hidden Easter egg (try the arrow-key sequence: ↑↑↓↓←→←→).

## File structure

```
DetectiveHub/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── data.js          # all case content, quotes, ranks, achievement defs
    ├── storage.js        # localStorage persistence layer
    ├── sound.js           # Web Audio sound effects
    ├── achievements.js    # achievement unlock logic + popup
    ├── games.js           # the 6 mini-games
    ├── board.js           # drag & connect evidence corkboard
    ├── notebook.js        # notebook CRUD + text export
    └── main.js            # routing, rendering, app logic
```

Everything runs client-side. Nothing is ever sent over the network.
